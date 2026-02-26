import {useMemo, useState} from 'react';
import data from './puzzles.json';
import './App.css';

type Material = 'none' | 'paper' | 'board' | 'props' | 'digital';
type Puzzle = {
  id: string;
  name: string;
  category: string;
  subCategory: string;
  sourceName: string;
  sourceUrl: string;
  avgMinutes: number;
  fun: number;
  difficulty: number;
  math: number;
  logic: number;
  spatial: number;
  word: number;
  social: number;
  materials: Material;
  notes: string;
};

const puzzles = data as Puzzle[];

const timeBuckets = [
  {key: 'all', label: 'Any time', min: 0, max: 999},
  {key: 'quick', label: '≤10m', min: 0, max: 10},
  {key: 'short', label: '11-20m', min: 11, max: 20},
  {key: 'medium', label: '21-40m', min: 21, max: 40},
  {key: 'long', label: '41-60m', min: 41, max: 60},
  {key: 'epic', label: '60m+', min: 61, max: 999},
] as const;

const profileDefs = [
  {key: 'all', label: 'All profiles'},
  {key: 'math-heavy', label: 'Math heavy'},
  {key: 'logic-heavy', label: 'Logic heavy'},
  {key: 'social-heavy', label: 'Social heavy'},
  {key: 'word-heavy', label: 'Word heavy'},
  {key: 'spatial-heavy', label: 'Spatial heavy'},
  {key: 'quick-fun', label: 'Quick + fun'},
] as const;

type Profile = (typeof profileDefs)[number]['key'];
type TimeKey = (typeof timeBuckets)[number]['key'];

function fitScore(p: Puzzle) {
  return Math.round((p.fun * 0.45 + p.logic * 0.2 + p.spatial * 0.1 + p.word * 0.1 + p.social * 0.05 + (10 - p.difficulty) * 0.1) * 10) / 10;
}

export default function App() {
  const [q, setQ] = useState('');
  const [activeCategories, setActiveCategories] = useState<string[]>([]);
  const [activeMaterials, setActiveMaterials] = useState<Material[]>([]);
  const [timeKey, setTimeKey] = useState<TimeKey>('all');
  const [profile, setProfile] = useState<Profile>('all');
  const [sort, setSort] = useState<'fit' | 'fun' | 'time' | 'difficulty'>('fit');

  const categories = useMemo(() => Array.from(new Set(puzzles.map((p) => p.category))).sort(), []);
  const materials: Material[] = ['none', 'paper', 'board', 'props', 'digital'];

  const toggle = <T,>(arr: T[], value: T, set: (v: T[]) => void) => {
    set(arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value]);
  };

  const filtered = useMemo(() => {
    const bucket = timeBuckets.find((b) => b.key === timeKey)!;

    let list = puzzles.filter((p) => {
      if (activeCategories.length && !activeCategories.includes(p.category)) return false;
      if (activeMaterials.length && !activeMaterials.includes(p.materials)) return false;
      if (p.avgMinutes < bucket.min || p.avgMinutes > bucket.max) return false;

      if (profile === 'math-heavy' && p.math < 7) return false;
      if (profile === 'logic-heavy' && p.logic < 7) return false;
      if (profile === 'social-heavy' && p.social < 7) return false;
      if (profile === 'word-heavy' && p.word < 7) return false;
      if (profile === 'spatial-heavy' && p.spatial < 7) return false;
      if (profile === 'quick-fun' && !(p.avgMinutes <= 15 && p.fun >= 7)) return false;

      if (q.trim()) {
        const txt = `${p.name} ${p.category} ${p.subCategory} ${p.sourceName} ${p.notes}`.toLowerCase();
        if (!txt.includes(q.toLowerCase())) return false;
      }
      return true;
    });

    list = [...list].sort((a, b) => {
      if (sort === 'fit') return fitScore(b) - fitScore(a);
      if (sort === 'fun') return b.fun - a.fun;
      if (sort === 'time') return a.avgMinutes - b.avgMinutes;
      return a.difficulty - b.difficulty;
    });

    return list;
  }, [q, activeCategories, activeMaterials, timeKey, profile, sort]);

  return (
    <div className="page">
      <header>
        <h1>Puzzle Curator</h1>
        <p>Curate puzzle candidates for Secret City Go. Total indexed puzzles: <b>{puzzles.length}</b>.</p>
      </header>

      <section className="search-row">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, source, tags..." />
        <button className="reset" onClick={() => {setQ(''); setActiveCategories([]); setActiveMaterials([]); setTimeKey('all'); setProfile('all'); setSort('fit')}}>Reset all</button>
      </section>

      <section className="filter-block">
        <h4>Categories</h4>
        <div className="chips">
          {categories.map((c) => (
            <button key={c} className={activeCategories.includes(c) ? 'chip active' : 'chip'} onClick={() => toggle(activeCategories, c, setActiveCategories)}>{c}</button>
          ))}
        </div>
      </section>

      <section className="filter-block">
        <h4>Materials</h4>
        <div className="chips">
          {materials.map((m) => (
            <button key={m} className={activeMaterials.includes(m) ? 'chip active' : 'chip'} onClick={() => toggle(activeMaterials, m, setActiveMaterials)}>{m}</button>
          ))}
        </div>
      </section>

      <section className="filter-block">
        <h4>Time to solve</h4>
        <div className="chips">
          {timeBuckets.map((b) => (
            <button key={b.key} className={timeKey === b.key ? 'chip active' : 'chip'} onClick={() => setTimeKey(b.key)}>{b.label}</button>
          ))}
        </div>
      </section>

      <section className="filter-block">
        <h4>Puzzle profile</h4>
        <div className="chips">
          {profileDefs.map((p) => (
            <button key={p.key} className={profile === p.key ? 'chip active' : 'chip'} onClick={() => setProfile(p.key)}>{p.label}</button>
          ))}
        </div>
      </section>

      <section className="filter-block">
        <h4>Sort</h4>
        <div className="chips">
          {['fit', 'fun', 'time', 'difficulty'].map((s) => (
            <button key={s} className={sort === s ? 'chip active' : 'chip'} onClick={() => setSort(s as any)}>{s}</button>
          ))}
        </div>
      </section>

      <p className="count">Showing <b>{filtered.length}</b> puzzles</p>

      <section className="grid">
        {filtered.map((p) => (
          <article className="card" key={p.id}>
            <div className="row top">
              <h3>{p.name}</h3>
              <span className="badge">fit {fitScore(p)}</span>
            </div>
            <div className="meta">{p.category} · {p.subCategory} · {p.materials}</div>
            <div className="stats">
              <span>⏱ {p.avgMinutes}m</span>
              <span>🎉 {p.fun}/10</span>
              <span>🧠 {p.difficulty}/10</span>
            </div>
            <div className="attrs">
              <small>math {p.math}</small>
              <small>logic {p.logic}</small>
              <small>spatial {p.spatial}</small>
              <small>word {p.word}</small>
              <small>social {p.social}</small>
            </div>
            <p>{p.notes}</p>
            <a href={p.sourceUrl} target="_blank" rel="noreferrer">Source: {p.sourceName}</a>
          </article>
        ))}
      </section>
    </div>
  );
}

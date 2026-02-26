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

function score(p: Puzzle) {
  return Math.round((p.fun * 0.4 + (10 - p.difficulty) * 0.1 + p.logic * 0.2 + p.spatial * 0.1 + p.word * 0.1 + p.social * 0.1) * 10) / 10;
}

export default function App() {
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('all');
  const [maxMinutes, setMaxMinutes] = useState(60);
  const [sort, setSort] = useState<'fit' | 'fun' | 'time' | 'difficulty'>('fit');

  const categories = useMemo(() => ['all', ...Array.from(new Set(puzzles.map((p) => p.category))).sort()], []);

  const filtered = useMemo(() => {
    let list = puzzles.filter((p) => {
      if (category !== 'all' && p.category !== category) return false;
      if (p.avgMinutes > maxMinutes) return false;
      if (!q.trim()) return true;
      const t = `${p.name} ${p.category} ${p.subCategory} ${p.notes} ${p.sourceName}`.toLowerCase();
      return t.includes(q.toLowerCase());
    });

    list = [...list].sort((a, b) => {
      if (sort === 'fit') return score(b) - score(a);
      if (sort === 'fun') return b.fun - a.fun;
      if (sort === 'time') return a.avgMinutes - b.avgMinutes;
      return a.difficulty - b.difficulty;
    });

    return list;
  }, [q, category, maxMinutes, sort]);

  return (
    <div className="page">
      <header>
        <h1>Puzzle Curator</h1>
        <p>Compare puzzle candidates for Secret City Go. Dataset size: <b>{puzzles.length}</b>.</p>
      </header>

      <section className="controls">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search puzzles, source, tags..." />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <label>
          Max minutes: <b>{maxMinutes}</b>
          <input type="range" min={5} max={90} step={5} value={maxMinutes} onChange={(e) => setMaxMinutes(Number(e.target.value))} />
        </label>
        <select value={sort} onChange={(e) => setSort(e.target.value as any)}>
          <option value="fit">Best fit</option>
          <option value="fun">Most fun</option>
          <option value="time">Shortest time</option>
          <option value="difficulty">Easiest first</option>
        </select>
      </section>

      <section className="grid">
        {filtered.map((p) => (
          <article className="card" key={p.id}>
            <div className="row top">
              <h3>{p.name}</h3>
              <span className="badge">fit {score(p)}</span>
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

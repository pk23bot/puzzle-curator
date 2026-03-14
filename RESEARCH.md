## Source coverage

This repository now keeps the restored `src/puzzles.json` as the base dataset and layers
additional entries from the 10 researched source collections on top of it.

- Base dataset before this pass: `1000` entries.
- Added in this pass from the 10 documented collections: `90` entries.
- Dataset after this pass: `1090` entries.

Research was performed on 2026-03-14. The Chrome DevTools MCP browser was attempted first
for the source crawl, but several public sites repeatedly timed out or blocked scripted page
loads, so some URL/title verification was completed with fallback page fetches instead.

## The 10 documented collections

| Source | Directory browsed | Entries added in this pass | Coverage examples now present in `src/puzzles.json` |
|---|---|---:|---|
| Project Euler Archives | https://projecteuler.net/archives | 10 | Modular Inverses, Lattice Quadrilaterals, Flipping Game |
| Simon Tatham Puzzle Collection | https://www.chiark.greenend.org.uk/~sgtatham/puzzles/ | 10 | Black Box, Galaxies, Loopy, Undead |
| GM Puzzles Categories | https://www.gmpuzzles.com/blog/category/puzzles/ | 10 | Arrow Sudoku, Killer Sudoku, Star Battle, LITS |
| Conceptis Puzzle Portal | https://www.conceptispuzzles.com/index.aspx?uri=puzzle | 10 | Pic-a-Pix Nonogram, Sym-a-Pix, Kakuro, Hitori |
| Nikoli Puzzle Directory | https://www.nikoli.co.jp/en/puzzles/ | 10 | Shikaku, Heyawake, Hashiwokakero, Yajilin |
| Janko Puzzle Archive | https://www.janko.at/Raetsel/ | 10 | Balance-Loop, Galaxien, Slitherlink, Kakuro |
| Puzzle Baron Collections | https://www.puzzlebaron.com/ | 10 | Acrostics, Cryptograms, Logic Puzzles, Word Searches |
| MIT Mystery Hunt / Puzzle Club | https://puzzles.mit.edu/ | 6 | 15 Questions, The Greatest Jigsaw, The Killer |
| Logic Masters Deutschland Portal | https://logic-masters.de/Raetselportal/ | 9 | Out of the Loop, Slitherlink Yin Yang, Interphase |
| World Puzzle Federation Puzzle Types | https://worldpuzzle.org/types-of-puzzles | 5 | Clouds, Easy As, Masyu, Tents |

## Normalization notes

- Existing entries were preserved. No restored base entries were removed.
- Added entries use the existing schema exactly: `id`, `name`, `category`, `subCategory`,
  `sourceName`, `sourceUrl`, ratings, `materials`, and `notes`.
- Deduplication for this pass used unique `id` plus normalized `sourceName + name`.
- Some broad puzzle families appear more than once across different sources on purpose
  when the collection itself is materially distinct, for example `Masyu` in Nikoli, GM
  Puzzles, Janko, and WPF.
- `avgMinutes`, skill ratings, and `materials` remain editorial normalization values so
  unlike-for-like collections can still be filtered together in the app.
- `sourceUrl` was kept as specific as practical: direct puzzle pages where available, and
  category/archive pages when the source is organized as a subtype collection rather than a
  single canonical puzzle page.

## Caveats

- MIT Mystery Hunt indexing was easiest to verify through the public hunt index mirror, so
  those entries currently point there rather than directly to every hunt host.
- Logic Masters Deutschland and some source portals expose a mix of category indexes and
  individual puzzle pages; the dataset reflects that mixed structure instead of forcing all
  entries into one URL pattern.

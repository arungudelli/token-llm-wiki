# facts-cache-demo

A tiny, self-contained, **non-proprietary** demonstration of the **"facts cache" pattern** for
AI-assisted work on a codebase:

> Understand a page **once** → write down the distilled, reusable truth as a `page-wiki.md` → anchor it to
> the source by git blob hash → then **reuse the facts instead of re-reading the source** every time.
> When the source changes, the anchor goes *stale* and you re-read **only then**.

The payoff is fewer tokens (and less time) spent re-discovering the same code, without going stale
silently. This repo lets you *run* the loop and *measure* the saving on toy code.

> Purely educational — there is no company/proprietary code here. It re-creates the shape of a real
> internal "codebase wiki" on a throwaway app so the idea can be shared and experimented with.

---

## What's inside

| Folder | Role |
|---|---|
| [`app/`](app/) | A toy **Angular bookstore** (list → detail → cart). This is the "codebase" an agent would otherwise read file-by-file. |
| [`wiki/`](wiki/) | A **Hugo** site: one `page-wiki.md` per app page + a `wiki-index` resolver. This is the *facts layer*. |
| [`tools/`](tools/) | `facts.mjs` — a dependency-free CLI that runs the whole loop (resolve → check → compare → demo). |

### The three tiers
```
app source (many files, the ground truth)
   ↑ re-read only when facts are STALE
page-wiki.md  (one distilled file per page, anchored to source by git hash)   ← reused every time
   ↑ resolved via
wiki-index.jsonl  (which page is this request about?)
```

---

## Run the app

```bash
cd app
npm install
npm start          # http://localhost:4200  (browse books → open one → add to cart → checkout)
npm run build      # production build
```

## Run the facts CLI (the pattern, made runnable)

From the repo root (needs Node + git; no install):

```bash
node tools/facts.mjs resolve  "add to cart button"   # Identify: which page?
node tools/facts.mjs check     book-detail            # Freshness: still valid vs source?
node tools/facts.mjs compare   book-detail            # Cost: re-read source vs reuse facts
node tools/facts.mjs demo      "add to cart button"   # the whole loop end-to-end
node tools/facts.mjs check-all
node tools/facts.mjs compare-all
node tools/facts.mjs reanchor  book-detail            # re-stamp hashes after a real source change
```

### Sample: the whole loop
```
$ node tools/facts.mjs demo "add to cart button on the book page"
=== facts-cache demo ===
resolve "...":
  [4] book-detail    Book Detail — wiki/content/pages/book-detail/page-wiki.md
  [3] book-list      Book List — ...
book-detail: FRESH (6/6 source hashes match)
book-detail  re-read source: ~1414 tok (6 files)  |  reuse facts: ~678 tok  |  saved ~52%
=> REUSE page-wiki.md — read ~678 tokens instead of ~1414 (saved ~52%). Source NOT re-read.
```

### Sample: staleness keeps it honest
```
$ echo "// change" >> app/src/app/pages/book-detail/book-detail.component.ts
$ node tools/facts.mjs check book-detail
book-detail: STALE (1/6 drifted)
  - app/src/app/pages/book-detail/book-detail.component.ts (changed)
$ node tools/facts.mjs reanchor book-detail   # after you've updated the facts to match
book-detail: FRESH (6/6 source hashes match)
```

This is the crux: reuse is **safe** because a changed source file makes the facts provably stale, so
you re-read source exactly when — and only when — it actually changed.

---

## How each piece maps to the real pattern

- **`page-wiki.md` contract** — each file is a *map + hazard list*, not a transcript: Overview, Component
  tree, Data flow, Routes, Key files, **Gotchas**, Related. Frontmatter carries `node-id`, `summary`,
  `aliases`, and the freshness anchor.
- **Freshness anchor** — `source-hashes` pins `git hash-object` for every source file the facts depend
  on. `tools/lib/freshness.mjs` recomputes and compares. (Real systems use the same blob-hash idea —
  rebase-proof, content-addressed.)
- **Resolver** — `wiki/static/wiki-index.jsonl` (one JSON row per page: id/summary/aliases/factsPath)
  is what the CLI greps to map a request to a page. `wiki-index.md` is the human view.

## Notes / honest caveats

- **Token counts are approximate** (`~chars/4`, in `tools/lib/tokens.mjs`) — enough to show the
  *relative* saving. Swap in a real tokenizer for exact numbers.
- **The saving grows with the codebase.** Here it's ~40–55% on tiny files; on large pages with many
  source files the ratio is much higher (facts stay small while source grows).
- **Hugo is theme-less on purpose** (`wiki/layouts/`) so it builds anywhere with zero dependencies.
- Build the wiki with `cd wiki && hugo` (or `hugo server` to preview).

## Layout
```
facts-cache-demo/
├─ app/                     # Angular bookstore (standalone components, signals)
│  └─ src/app/{models,services,pages/{book-list,book-detail,cart}}
├─ wiki/                    # Hugo facts site
│  ├─ content/pages/{book-list,book-detail,cart-checkout}/page-wiki.md
│  ├─ content/wiki-index.md
│  ├─ static/wiki-index.jsonl
│  └─ layouts/              # minimal, theme-less
└─ tools/
   ├─ facts.mjs             # resolve | check | reanchor | compare | demo
   └─ lib/{tokens,freshness}.mjs
```

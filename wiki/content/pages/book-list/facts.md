---
title: "Book List — Facts"
node-id: book-list
summary: "Bookstore catalog: responsive grid of books with title/author search + genre filter, and an add-to-cart button per card."
resolve-terms: [catalog, browse books, book grid, genre filter, search books, add to cart]
routes: /books
last-anchored: 2026-09-16
source-hashes:
  - file: app/src/app/pages/book-list/book-list.component.ts
    hash: f033198f679e96d10779a231c35eb111d5aac46a
  - file: app/src/app/pages/book-list/book-list.component.html
    hash: 8c68e988d6a7160c146ca4e896855875a0d5f79f
  - file: app/src/app/pages/book-list/book-list.component.scss
    hash: 9af826237acf4c793d21cbe4dfab8188f898689e
  - file: app/src/app/services/book.service.ts
    hash: ee25d5f8116d30ae1efc0f33732d2ec6db3a1016
  - file: app/src/app/models/book.ts
    hash: e211e72af24cb05e4c9a89a0d01596af6df34e82
---

## Overview
Standalone component `BookListComponent` (route `/books`, the app's default). Renders the whole catalog
as a card grid with a live search box + genre `<select>`, plus a per-card **Add to cart**.

## Component tree
`BookListComponent` → per-book `<article.card>` with a `routerLink` to `/books/:id`. No child
components (flat template). Uses `CurrencyPipe` + `RouterLink`.

## Data flow
- `BookService.getAll()` / `.genres()` are read **synchronously** (in-memory data, no HTTP, no async).
- `search` + `genre` are `signal`s; `filtered` is a `computed()` that filters `getAll()` by both.
- **Add to cart** calls `CartService.add(book)` (shared root singleton) — same service the detail + cart pages use.

## Routes & params
`/books` — no params. Default route (`'' → books`).

## Key files
| Role | File |
|---|---|
| Component | `app/src/app/pages/book-list/book-list.component.ts` |
| Template | `…/book-list.component.html` |
| Styles | `…/book-list.component.scss` |
| Data | `app/src/app/services/book.service.ts` |
| Model | `app/src/app/models/book.ts` |

## Gotchas
- Filtering is **client-side over the full in-memory list** — fine for the demo, would need server paging for a real catalog.
- `filtered` recomputes on every `search`/`genre` change (signals) — no manual subscriptions to leak.
- `Add to cart` mutates shared `CartService` state; the header/cart count updates reactively everywhere.

## Related
[[book-detail]] (card links to it) · [[cart-checkout]] (shares `CartService`).

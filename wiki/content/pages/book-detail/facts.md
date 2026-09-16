---
title: "Book Detail — Facts"
node-id: book-detail
summary: "Single-book page reached from the catalog; shows cover/title/author/genre/price/blurb and an add-to-cart action bound to the shared cart."
resolve-terms: [book page, book detail, add to cart, buy book, blurb, book not found]
routes: /books/:id
last-anchored: 2026-09-16
source-hashes:
  - file: app/src/app/pages/book-detail/book-detail.component.ts
    hash: 3f42aa2698c80c29d4c9e8fc5cd90dd8e6ae571c
  - file: app/src/app/pages/book-detail/book-detail.component.html
    hash: 12e5f0457f81c90b67484f56e76d8eab3f82fcbd
  - file: app/src/app/pages/book-detail/book-detail.component.scss
    hash: ce018d8d4e63e3902c482b9f672fb435b85e3e2f
  - file: app/src/app/services/book.service.ts
    hash: ee25d5f8116d30ae1efc0f33732d2ec6db3a1016
  - file: app/src/app/services/cart.service.ts
    hash: 48274ed00daf00e0f5d51206f35f7913d7648d4a
  - file: app/src/app/models/book.ts
    hash: e211e72af24cb05e4c9a89a0d01596af6df34e82
---

## Overview
Standalone `BookDetailComponent` (route `/books/:id`). Shows one book and an **Add to cart** button.
Renders a "not found" branch when the id doesn't match.

## Component tree
Single component, no children. Uses `RouterLink` (back link + cart link) + `CurrencyPipe`. Template is
one `@if (book(); as b) { … } @else { not-found }`.

## Data flow
- **`:id` arrives as a component `input.required<string>()`** — enabled by `withComponentInputBinding()`
  in `app.config.ts`. **Gotcha G below** if that provider is removed.
- `book` is a `computed()` = `BookService.getById(id())`; returns `undefined` → the `@else` not-found branch.
- **Add to cart** → `CartService.add(book)` (the same shared singleton the list + cart pages use).

## Routes & params
`/books/:id` — `id` is the `Book.id` slug (e.g. `dune`, `clean-code`). Unknown id → not-found view (no redirect).

## Key files
| Role | File |
|---|---|
| Component | `app/src/app/pages/book-detail/book-detail.component.ts` |
| Template | `…/book-detail.component.html` |
| Styles | `…/book-detail.component.scss` |
| Data | `app/src/app/services/book.service.ts` |
| Cart state | `app/src/app/services/cart.service.ts` |
| Model | `app/src/app/models/book.ts` |

## Gotchas
- **Gotcha G — route-param binding:** `id` is read via `input.required()`, which only works because
  `provideRouter(routes, withComponentInputBinding())` is set. Remove that and `id()` throws / never binds.
- `getById` returns `undefined` for a bad id — the template **must** guard (`@if … @else`); don't assume a book.
- Shares `CartService` — adding here updates the cart badge on every page.

## Related
[[book-list]] (links here) · [[cart-checkout]] (consumes what Add-to-cart writes).

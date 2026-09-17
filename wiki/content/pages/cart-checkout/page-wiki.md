---
title: "Cart & Checkout — Facts"
node-id: cart-checkout
summary: "Cart page: line-item table with editable quantities, live total, remove, and a checkout that clears the cart and shows a confirmation."
resolve-terms: [cart, checkout, quantity, total, remove item, place order, empty cart]
routes: /cart
last-anchored: 2026-09-16
source-hashes:
  - file: app/src/app/pages/cart/cart.component.ts
    hash: 8ffe409fb9f21c40ebb642ef5ce5ecf809fb589e
  - file: app/src/app/pages/cart/cart.component.html
    hash: 53585f496eed72cd94e9fc793b7fc8867285085e
  - file: app/src/app/pages/cart/cart.component.scss
    hash: 0b42bb0cf86e4c9bb4208e8a5239fc9e97bd33d3
  - file: app/src/app/services/cart.service.ts
    hash: 48274ed00daf00e0f5d51206f35f7913d7648d4a
  - file: app/src/app/models/cart-item.ts
    hash: dc260e29bf441c06adcf92eb9b1f2dd5c020ed8a
  - file: app/src/app/models/book.ts
    hash: e211e72af24cb05e4c9a89a0d01596af6df34e82
---

## Overview
Standalone `CartComponent` (route `/cart`). Three template states: **order placed**, **empty cart**,
and the **line-item table** (`@if placed / @else if empty / @else table`).

## Component tree
Single component, no children. Uses `RouterLink` + `CurrencyPipe`. A local `placed` signal flips the view
after checkout.

## Data flow
- Reads `CartService.items()` / `.total()` (signals/computed) — no local copy of cart state.
- Quantity `<input>` change → `CartService.setQuantity(id, n)`; **n = 0 removes the line** (service filters `quantity > 0`).
- Remove → `CartService.remove(id)`. Checkout → `placed.set(true)` then `CartService.clear()`.

## Routes & params
`/cart` — no params.

## Key files
| Role | File |
|---|---|
| Component | `app/src/app/pages/cart/cart.component.ts` |
| Template | `…/cart.component.html` |
| Styles | `…/cart.component.scss` |
| Cart state | `app/src/app/services/cart.service.ts` |
| Models | `app/src/app/models/cart-item.ts`, `…/book.ts` |

## Gotchas
- **Setting quantity to 0 deletes the line** — the removal rule lives in `CartService.setQuantity`, not the component.
- Checkout is a stub: it clears the cart and shows a message; there's **no order persistence or backend**.
- `total()` is a `computed()` over `items()`; it updates automatically — don't recompute in the component.

## Related
[[book-detail]] + [[book-list]] (both write to the same `CartService`).

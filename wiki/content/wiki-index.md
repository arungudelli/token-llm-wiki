---
title: "Wiki Index"
---

The **resolver**: map a request ("the add-to-cart button is broken") to the page it's about, then
follow the link to that page's facts. The machine-readable version an agent greps lives at
[`/wiki-index.jsonl`](/wiki-index.jsonl); this table is the human view.

| Page | node-id | Facts | What it is | Aliases (resolve terms) |
|---|---|---|---|---|
| Book List | `book-list` | [facts](/pages/book-list/facts/) | Catalog grid: search, genre filter, add-to-cart | catalog, browse, book grid, genre filter, search books |
| Book Detail | `book-detail` | [facts](/pages/book-detail/facts/) | Single book page + add-to-cart | book page, detail, add to cart, buy, blurb |
| Cart & Checkout | `cart-checkout` | [facts](/pages/cart-checkout/facts/) | Cart table, quantities, total, checkout | cart, checkout, quantity, total, remove item, order |

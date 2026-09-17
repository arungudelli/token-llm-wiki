---
title: ""
---

# 📚 BookStore — Facts Wiki

An **educational demo of the "facts cache" pattern**: understand a page in a codebase **once**,
write down the distilled, reusable truth about it as a `page-wiki.md`, anchor that file to the source by
git blob hash, and then **reuse the facts instead of re-reading the source** every time — saving
tokens. When the source changes, the anchor goes *stale* and you re-read only then.

> ▶ **Live:** [try the bookstore app](/app/) · [browse the facts](/pages/) · [wiki index](/wiki-index/)

This repo has two halves:

- **`/app`** — a toy Angular *bookstore* (list → detail → cart), deployed at **[/app/](/app/)**. This is
  the "codebase" an agent would otherwise have to read file-by-file.
- **`/wiki`** — this Hugo site: one **[facts page](/pages/)** per app page + a
  **[Wiki Index](/wiki-index/)** resolver.

And a small CLI that makes the loop runnable and *measurable*:

```
node tools/facts.mjs resolve "add to cart button"   # which page is this about?
node tools/facts.mjs check    book-detail            # are the facts still fresh vs source?
node tools/facts.mjs compare  book-detail            # tokens: re-read source vs reuse facts
node tools/facts.mjs demo     "add to cart button"   # the whole loop, end to end
```

> Fully self-contained and non-proprietary — no company code. Purely for learning/experimenting
> with the pattern.

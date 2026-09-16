// Approximate token counter — deliberately dependency-free.
//
// ~4 characters per token is the well-known rough heuristic for English + code.
// It is NOT exact, but it is more than good enough to DEMONSTRATE the *relative*
// saving this pattern produces (reuse one facts.md vs re-read many source files).
// For exact numbers, swap in a real BPE tokenizer (e.g. `tiktoken` or
// `gpt-tokenizer`) behind this same function.

import { readFileSync } from 'node:fs';

export function estimateTokens(text) {
  if (!text) return 0;
  return Math.ceil(text.length / 4);
}

export function tokensOfFile(absPath) {
  try {
    return estimateTokens(readFileSync(absPath, 'utf8'));
  } catch {
    return 0;
  }
}

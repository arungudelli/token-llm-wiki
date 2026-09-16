// Freshness anchor — the heart of the "facts cache" pattern.
//
// Each facts.md pins the exact git blob hash (`git hash-object`) of every source
// file its facts depend on. If a source file's current blob hash differs from the
// stored one, the facts are STALE and must not be trusted until re-anchored.
// This is what makes "reuse instead of re-read" SAFE: you only pay to re-read
// source when it actually changed.

import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
// repo root = two levels up from tools/lib/
export const REPO_ROOT = resolve(__dirname, '..', '..');

/** Minimal frontmatter reader (no YAML dependency — we control the format). */
export function parseFrontmatter(mdPath) {
  const raw = readFileSync(mdPath, 'utf8');
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return { sourceHashes: [] };
  const fm = m[1];

  const scalar = (key) => {
    const r = fm.match(new RegExp('^' + key + ':\\s*(.+)$', 'm'));
    return r ? r[1].trim().replace(/^["']|["']$/g, '') : undefined;
  };

  // source-hashes block:
  //   source-hashes:
  //     - file: app/src/...
  //       hash: <40-hex>
  const sourceHashes = [];
  const block = fm.match(/source-hashes:\s*\r?\n([\s\S]*?)(?=\r?\n\S|$)/);
  if (block) {
    const re = /-\s*file:\s*(.+?)\s*\r?\n\s*hash:\s*(\S+)/g;
    let mm;
    while ((mm = re.exec(block[1]))) {
      sourceHashes.push({ file: mm[1].trim().replace(/^["']|["']$/g, ''), hash: mm[2].trim() });
    }
  }
  return { nodeId: scalar('node-id'), title: scalar('title'), lastAnchored: scalar('last-anchored'), sourceHashes };
}

/** git hash-object for a repo-relative path (null if the file is gone). */
export function gitHashObject(relPath) {
  if (!existsSync(resolve(REPO_ROOT, relPath))) return null;
  try {
    return execFileSync('git', ['hash-object', relPath], { cwd: REPO_ROOT, encoding: 'utf8' }).trim();
  } catch {
    return null;
  }
}

/** Compare stored hashes against current source → Fresh / Stale + drift detail. */
export function checkFreshness(factsPath) {
  const { sourceHashes } = parseFrontmatter(factsPath);
  const drifted = [];
  for (const { file, hash } of sourceHashes) {
    const current = gitHashObject(file);
    if (current === null) drifted.push({ file, reason: 'missing' });
    else if (current !== hash) drifted.push({ file, reason: 'changed', stored: hash, current });
  }
  return { total: sourceHashes.length, drifted, fresh: drifted.length === 0 };
}

#!/usr/bin/env node
// facts.mjs — a tiny, dependency-free CLI that runs the facts-cache loop.
//
// Demonstrates the whole loop on the toy Angular bookstore:
//   resolve  <query>   Identify which page a request is about (grep the wiki index)
//   check    <id>      Freshness: are the page's facts still valid vs source?
//   reanchor <id>      Re-stamp the source hashes after a legit source change
//   compare  <id>      Token cost: re-read source  vs  reuse facts   (the saving)
//   demo     <query>   The full loop end-to-end (resolve -> check -> reuse or re-read)
//   check-all | compare-all
//
// Run:  node tools/facts.mjs <command> [args]

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { REPO_ROOT, parseFrontmatter, gitHashObject, checkFreshness } from './lib/freshness.mjs';
import { tokensOfFile, estimateTokens } from './lib/tokens.mjs';

const INDEX = resolve(REPO_ROOT, 'wiki/static/wiki-index.jsonl');

function loadIndex() {
  return readFileSync(INDEX, 'utf8')
    .split(/\r?\n/)
    .filter((l) => l.trim())
    .map((l) => JSON.parse(l));
}

const STOP = new Set(['the', 'a', 'an', 'is', 'to', 'of', 'in', 'on', 'for', 'and', 'not', 'my', 'i', 'it']);
function terms(s) {
  return (s.toLowerCase().match(/[a-z0-9]+/g) || []).filter((t) => t.length > 1 && !STOP.has(t));
}

function scoreRow(row, qTerms) {
  const hay = (row.id + ' ' + row.title + ' ' + row.summary + ' ' + (row.aliases || []).join(' ')).toLowerCase();
  let score = 0;
  for (const t of qTerms) if (hay.includes(t)) score++;
  return score;
}

function resolveQuery(query) {
  const q = terms(query);
  return loadIndex()
    .map((row) => ({ row, score: scoreRow(row, q) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);
}

function getRow(id) {
  const row = loadIndex().find((r) => r.id === id);
  if (!row) { console.error(`no page with id "${id}" in the wiki index`); process.exit(2); }
  return row;
}

function factsAbs(row) { return resolve(REPO_ROOT, row.factsPath); }

// ---- commands ----------------------------------------------------------------

function cmdResolve(query) {
  const hits = resolveQuery(query);
  if (!hits.length) { console.log(`no page resolved for: "${query}"`); return; }
  console.log(`resolve "${query}":`);
  for (const { row, score } of hits.slice(0, 3)) {
    console.log(`  [${score}] ${row.id.padEnd(14)} ${row.title} — ${row.factsPath}`);
  }
  return hits[0].row;
}

function cmdCheck(id) {
  const row = getRow(id);
  const r = checkFreshness(factsAbs(row));
  if (r.fresh) {
    console.log(`${id}: FRESH (${r.total}/${r.total} source hashes match)`);
  } else {
    console.log(`${id}: STALE (${r.drifted.length}/${r.total} drifted)`);
    for (const d of r.drifted) console.log(`  - ${d.file} (${d.reason})`);
  }
  return r;
}

function cmdCompare(id) {
  const row = getRow(id);
  const { sourceHashes } = parseFrontmatter(factsAbs(row));
  const srcTokens = sourceHashes.reduce((n, s) => n + tokensOfFile(resolve(REPO_ROOT, s.file)), 0);
  const factsTokens = estimateTokens(readFileSync(factsAbs(row), 'utf8'));
  const saved = srcTokens ? Math.round((1 - factsTokens / srcTokens) * 100) : 0;
  console.log(
    `${id.padEnd(14)} re-read source: ~${String(srcTokens).padStart(5)} tok (${sourceHashes.length} files)` +
    `  |  reuse facts: ~${String(factsTokens).padStart(5)} tok  |  saved ~${saved}%`
  );
  return { srcTokens, factsTokens, saved };
}

function cmdReanchor(id) {
  const row = getRow(id);
  const path = factsAbs(row);
  const { sourceHashes } = parseFrontmatter(path);
  const lines = ['source-hashes:'];
  for (const { file } of sourceHashes) {
    const h = gitHashObject(file);
    lines.push(`  - file: ${file}`);
    lines.push(`    hash: ${h ?? 'MISSING'}`);
  }
  const today = new Date().toISOString().slice(0, 10);
  let raw = readFileSync(path, 'utf8');
  raw = raw.replace(/source-hashes:\s*\r?\n([\s\S]*?)(?=\r?\n\S|\r?\n---)/, lines.join('\n'));
  raw = /^last-anchored:/m.test(raw)
    ? raw.replace(/^last-anchored:.*$/m, `last-anchored: ${today}`)
    : raw.replace(/^(node-id:.*)$/m, `$1\nlast-anchored: ${today}`);
  writeFileSync(path, raw);
  console.log(`${id}: re-anchored ${sourceHashes.length} source hashes (last-anchored: ${today})`);
}

function cmdDemo(query) {
  console.log('=== facts-cache demo ===');
  const best = cmdResolve(query);
  if (!best) return;
  console.log('');
  const fresh = cmdCheck(best.id);
  console.log('');
  if (fresh.fresh) {
    const c = cmdCompare(best.id);
    console.log('');
    console.log(`=> REUSE facts.md — read ~${c.factsTokens} tokens instead of ~${c.srcTokens} (saved ~${c.saved}%). Source NOT re-read.`);
  } else {
    console.log(`=> STALE — the safe move is to re-read source, then \`reanchor ${best.id}\`. This is exactly the case the cache must NOT hide.`);
  }
}

function allIds() { return loadIndex().map((r) => r.id); }

// ---- dispatch ----------------------------------------------------------------

const [cmd, ...args] = process.argv.slice(2);
switch (cmd) {
  case 'resolve': cmdResolve(args.join(' ')); break;
  case 'check': cmdCheck(args[0]); break;
  case 'check-all': for (const id of allIds()) cmdCheck(id); break;
  case 'reanchor': cmdReanchor(args[0]); break;
  case 'reanchor-all': for (const id of allIds()) cmdReanchor(id); break;
  case 'compare': cmdCompare(args[0]); break;
  case 'compare-all': for (const id of allIds()) cmdCompare(id); break;
  case 'demo': cmdDemo(args.join(' ')); break;
  default:
    console.log('usage: node tools/facts.mjs <resolve|check|check-all|reanchor|reanchor-all|compare|compare-all|demo> [args]');
    process.exit(1);
}

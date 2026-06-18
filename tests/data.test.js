/**
 * Data integrity tests for california/san-diego/index.html
 *
 * Protects against:
 *   - Programs being accidentally added, removed, or reordered
 *   - Required fields going missing or becoming empty
 *   - Category/icon values drifting outside the valid set
 *   - Duplicate IDs or names
 *   - Links being accidentally deleted
 *   - PROGRAM_CRITERIA referencing non-existent program IDs
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createContext, runInContext } from 'node:vm';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// ---------------------------------------------------------------------------
// Extract the pure-JS data block from the HTML (same approach as eligibility.test.js)
// ---------------------------------------------------------------------------
const html = readFileSync(join(ROOT, 'california/san-diego/index.html'), 'utf8');
const startMarker = '    const PROGRAMS = {';
const endMarker   = '    // quizSteps moved inside Quiz component';
const startIdx = html.indexOf(startMarker);
const endIdx   = html.indexOf(endMarker);
assert.ok(startIdx !== -1, 'Could not find PROGRAMS in index.html');
assert.ok(endIdx   !== -1, 'Could not find quizSteps boundary comment in index.html');
const pureJsBlock = html.slice(startIdx, endIdx);

const ctx = createContext({ Set, Map, Array, Object, console, exports: {} });
runInContext(
  pureJsBlock +
  `\nexports.PROGRAMS=PROGRAMS;\nexports.PROGRAM_CRITERIA=PROGRAM_CRITERIA;`,
  ctx
);

const { PROGRAMS, PROGRAM_CRITERIA } = ctx.exports;

// ---------------------------------------------------------------------------
// Snapshot constants — update these intentionally when programs are added
// ---------------------------------------------------------------------------
const EXPECTED_PROGRAM_COUNT = 530;

const VALID_CATEGORIES = new Set([
  'food', 'income', 'healthcare', 'mental healthcare', 'health necessities',
  'utility', 'transportation', 'housing', 'caretaker', 'entertainment',
  'legal', 'day care', 'taxes', 'technology', 'education', 'employment',
]);

const VALID_ICONS = new Set(['leaf', 'dollar', 'heart', 'spark', 'home', 'file']);

// ---------------------------------------------------------------------------
// PROGRAMS
// ---------------------------------------------------------------------------
describe('PROGRAMS — completeness', () => {
  test(`contains exactly ${EXPECTED_PROGRAM_COUNT} programs`, () => {
    const count = Object.keys(PROGRAMS).length;
    assert.equal(count, EXPECTED_PROGRAM_COUNT,
      `Expected ${EXPECTED_PROGRAM_COUNT} programs, got ${count}`);
  });

  test('IDs are non-empty strings matching expected format (e.g. CA-001, US-001, CA37-001)', () => {
    for (const id of Object.keys(PROGRAMS)) {
      assert.ok(typeof id === 'string' && id.length > 0, `Program has empty or non-string ID: ${id}`);
      assert.match(id, /^[A-Z]{2}[0-9]*-[0-9]{3}(\.[A-Z][0-9]+)?$/, `Program ID "${id}" does not match expected format`);
    }
  });

  test('no duplicate IDs', () => {
    const ids = Object.keys(PROGRAMS);
    const unique = new Set(ids);
    assert.equal(unique.size, ids.length, 'Duplicate program IDs found');
  });

  test('no duplicate names', () => {
    const names = Object.values(PROGRAMS).map(p => p.name);
    const unique = new Set(names);
    if (unique.size !== names.length) {
      const dupes = names.filter((n, i) => names.indexOf(n) !== i);
      assert.fail(`Duplicate program names: ${dupes.join(', ')}`);
    }
  });
});

describe('PROGRAMS — required fields', () => {
  for (const [key, program] of Object.entries(PROGRAMS)) {
    const id = key;

    test(`program ${id} (${program.name?.slice(0, 40)}) — id matches key`, () => {
      assert.equal(program.id, id, `Program key ${id} has mismatched id field`);
    });

    test(`program ${id} — name is non-empty string`, () => {
      assert.ok(typeof program.name === 'string' && program.name.trim().length > 0,
        `Program ${id} has missing or empty name`);
    });

    test(`program ${id} — description is non-empty string`, () => {
      assert.ok(typeof program.description === 'string' && program.description.trim().length > 4,
        `Program ${id} has missing or too-short description`);
    });

    test(`program ${id} — category is valid`, () => {
      assert.ok(VALID_CATEGORIES.has(program.category),
        `Program ${id} has invalid category: "${program.category}". Valid: ${[...VALID_CATEGORIES].join(', ')}`);
    });

    test(`program ${id} — icon is valid`, () => {
      assert.ok(VALID_ICONS.has(program.icon),
        `Program ${id} has invalid icon: "${program.icon}". Valid: ${[...VALID_ICONS].join(', ')}`);
    });

    test(`program ${id} — link is non-empty`, () => {
      assert.ok(typeof program.link === 'string' && program.link.trim().length > 0,
        `Program ${id} has missing or empty link`);
    });
  }
});

// ---------------------------------------------------------------------------
// PROGRAM_CRITERIA
// ---------------------------------------------------------------------------
describe('PROGRAM_CRITERIA — referential integrity', () => {
  test('all PROGRAM_CRITERIA keys reference valid program IDs', () => {
    const invalidRefs = [];
    for (const id of Object.keys(PROGRAM_CRITERIA)) {
      if (!PROGRAMS[id]) invalidRefs.push(id);
    }
    assert.deepEqual(invalidRefs, [],
      `PROGRAM_CRITERIA references non-existent program IDs: ${invalidRefs.join(', ')}`);
  });

  test('each PROGRAM_CRITERIA entry is an object with household-size keys', () => {
    for (const [progId, criteria] of Object.entries(PROGRAM_CRITERIA)) {
      assert.ok(typeof criteria === 'object' && criteria !== null,
        `PROGRAM_CRITERIA[${progId}] is not an object`);
      for (const [hhSize, rules] of Object.entries(criteria)) {
        assert.ok(Array.isArray(rules),
          `PROGRAM_CRITERIA[${progId}][${hhSize}] is not an array`);
      }
    }
  });
});

// ---------------------------------------------------------------------------
// Structural checks on the HTML file itself
// ---------------------------------------------------------------------------
describe('index.html — structural checks', () => {
  test('noscript block exists', () => {
    assert.ok(html.includes('<noscript>'), 'No <noscript> block found in index.html');
  });

  test('noscript contains at least 50 list items', () => {
    const noscriptMatch = html.match(/<noscript>([\s\S]*?)<\/noscript>/);
    assert.ok(noscriptMatch, 'No <noscript> block found');
    const liCount = (noscriptMatch[1].match(/<li>/g) || []).length;
    assert.ok(liCount >= 50,
      `noscript has only ${liCount} <li> items, expected at least 50`);
  });
});

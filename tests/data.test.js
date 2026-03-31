/**
 * Data integrity tests for data.js
 *
 * Protects against:
 *   - Programs being accidentally added, removed, or reordered
 *   - Required fields going missing or becoming empty
 *   - Category/icon values drifting outside the valid set
 *   - Duplicate IDs or names
 *   - Links being accidentally deleted
 *   - Quiz steps referencing non-existent program IDs
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
// Load data.js by evaluating it in a sandboxed context so we can extract
// all the constants it defines without modifying the source file.
// ---------------------------------------------------------------------------
const dataSource = readFileSync(join(ROOT, 'data.js'), 'utf8');
// `const` in VM context isn't exposed on the context object — wrap with explicit exports
const ctx = createContext({ Set, Map, Array, Object, console, exports: {} });
runInContext(
  dataSource + '\nexports.PROGRAMS=PROGRAMS;exports.PROGRAM_CRITERIA=PROGRAM_CRITERIA;exports.quizSteps=quizSteps;exports.GATE_EXEMPT=GATE_EXEMPT;',
  ctx
);

const { PROGRAMS, PROGRAM_CRITERIA, quizSteps, GATE_EXEMPT } = ctx.exports;

// ---------------------------------------------------------------------------
// Snapshot constants — update these intentionally when programs are added
// ---------------------------------------------------------------------------
const EXPECTED_PROGRAM_COUNT = 86;
const EXPECTED_QUIZ_STEP_COUNT = 6;

const VALID_CATEGORIES = new Set([
  'food', 'income', 'healthcare', 'utility', 'transportation',
  'housing', 'caretaker', 'entertainment', 'legal', 'day care', 'taxes',
]);

const VALID_ICONS = new Set(['leaf', 'dollar', 'heart', 'spark', 'home', 'file']);

// ---------------------------------------------------------------------------
// PROGRAMS
// ---------------------------------------------------------------------------
describe('PROGRAMS — completeness', () => {
  test('contains exactly 86 programs', () => {
    const count = Object.keys(PROGRAMS).length;
    assert.equal(count, EXPECTED_PROGRAM_COUNT,
      `Expected ${EXPECTED_PROGRAM_COUNT} programs, got ${count}`);
  });

  test('IDs are sequential integers 1–86 with no gaps', () => {
    const ids = Object.keys(PROGRAMS).map(Number).sort((a, b) => a - b);
    for (let i = 0; i < ids.length; i++) {
      assert.equal(ids[i], i + 1, `Missing program ID ${i + 1}`);
    }
  });

  test('no duplicate IDs', () => {
    const ids = Object.keys(PROGRAMS).map(Number);
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
    const id = Number(key);

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
// quizSteps
// ---------------------------------------------------------------------------
describe('quizSteps — structure', () => {
  test(`contains exactly ${EXPECTED_QUIZ_STEP_COUNT} steps`, () => {
    assert.equal(quizSteps.length, EXPECTED_QUIZ_STEP_COUNT,
      `Expected ${EXPECTED_QUIZ_STEP_COUNT} quiz steps, got ${quizSteps.length}`);
  });

  test('every step has id, title, and options array', () => {
    for (const step of quizSteps) {
      assert.ok(step.id, `Quiz step missing id: ${JSON.stringify(step)}`);
      assert.ok(typeof step.title === 'string' && step.title.trim().length > 0,
        `Quiz step ${step.id} missing title`);
      assert.ok(Array.isArray(step.options) && step.options.length > 0,
        `Quiz step ${step.id} has no options`);
    }
  });

  test('every step option is a non-empty string', () => {
    // quiz options are plain strings, not {value, label} objects
    for (const step of quizSteps) {
      assert.ok(Array.isArray(step.options) && step.options.length > 0,
        `Step ${step.id} has empty options array`);
      for (const opt of step.options) {
        assert.ok(typeof opt === 'string' && opt.trim().length > 0,
          `Step ${step.id} has empty or non-string option: ${JSON.stringify(opt)}`);
      }
    }
  });
});

// ---------------------------------------------------------------------------
// GATE_EXEMPT
// ---------------------------------------------------------------------------
describe('GATE_EXEMPT — referential integrity', () => {
  test('all GATE_EXEMPT IDs reference valid programs', () => {
    const invalid = [...GATE_EXEMPT].filter(id => !PROGRAMS[id]);
    assert.deepEqual(invalid, [],
      `GATE_EXEMPT contains non-existent program IDs: ${invalid.join(', ')}`);
  });
});

// ---------------------------------------------------------------------------
// Sync check: inline PROGRAMS in index.html matches data.js count
// ---------------------------------------------------------------------------
describe('Sync — data.js vs california/san-diego/index.html', () => {
  const html = readFileSync(join(ROOT, 'california/san-diego/index.html'), 'utf8');

  test('index.html inline program count matches data.js', () => {
    // Count "{ id: N," patterns in the PROGRAMS object inside the HTML
    const matches = html.match(/\bid:\s*\d+,/g) || [];
    assert.equal(matches.length, EXPECTED_PROGRAM_COUNT,
      `index.html has ${matches.length} inline programs, expected ${EXPECTED_PROGRAM_COUNT} (data.js count)`);
  });

  test('index.html noscript block exists', () => {
    assert.ok(html.includes('<noscript>'), 'No <noscript> block found in index.html');
  });

  test('index.html noscript contains at least 86 list items', () => {
    // noscript uses human-friendly abbreviated names; protect against mass deletion
    const noscriptMatch = html.match(/<noscript>([\s\S]*?)<\/noscript>/);
    assert.ok(noscriptMatch, 'No <noscript> block found');
    const liCount = (noscriptMatch[1].match(/<li>/g) || []).length;
    assert.ok(liCount >= EXPECTED_PROGRAM_COUNT,
      `noscript has only ${liCount} <li> items, expected at least ${EXPECTED_PROGRAM_COUNT}`);
  });
});

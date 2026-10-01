/**
 * Quiz structural integrity tests for california/san-diego/index.html
 *
 * Protects against the label/option index mismatch bug:
 *   - quizStepDefs options arrays must be the same length as the
 *     corresponding stepTitles labels arrays.
 *   - If they differ by even 1, every option after the split point
 *     displays the wrong label and stores the wrong value.
 *
 * Example of the bug this caught:
 *   Income step had 7 options but 8 labels (missing "No income" in options).
 *   Selecting "Under $20,000" (label index 1) stored "$20,000–$40,000"
 *   (option index 1), so the results page showed $40,000 instead of $20,000.
 *
 * Also verifies that INCOME_UPPER covers every income option so that
 * no selection silently falls through to the Infinity default.
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createContext, runInContext } from 'node:vm';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const html = readFileSync(join(ROOT, 'california/san-diego/index.html'), 'utf8');

// ---------------------------------------------------------------------------
// Extract INCOME_UPPER from the pure-JS eligibility block (no JSX)
// ---------------------------------------------------------------------------
const startMarker = '    const PROGRAMS = {';
const endMarker   = '    // quizSteps moved inside Quiz component';
const startIdx = html.indexOf(startMarker);
const endIdx   = html.indexOf(endMarker);
assert.ok(startIdx !== -1, 'Could not find PROGRAMS in index.html');
assert.ok(endIdx   !== -1, 'Could not find quizSteps boundary comment in index.html');
const pureJsBlock = html.slice(startIdx, endIdx);

const ctx = createContext({ Set, Map, Array, Object, console, exports: {} });
runInContext(pureJsBlock + '\nexports.INCOME_UPPER=INCOME_UPPER;', ctx);
const { INCOME_UPPER } = ctx.exports;

// ---------------------------------------------------------------------------
// Parse quiz options arrays from quizStepDefs (plain JSON arrays, no JSX)
// ---------------------------------------------------------------------------

/**
 * Returns the parsed options array for a given question id in quizStepDefs.
 * e.g. extractOptions('annual_income') → ['No income', 'Under $20,000', ...]
 */
function extractOptions(questionId) {
  const re = new RegExp(
    `id:\\s*"${questionId}"[^}]*?options:\\s*(\\[[^\\]]+\\])`,
    's'
  );
  const m = html.match(re);
  assert.ok(m, `Could not find quizStepDefs options for "${questionId}"`);
  return JSON.parse(m[1]);
}

/**
 * Returns the number of label slots in stepTitles for question N (1-based).
 * Counts occurrences of t('qN_opt_M') on the stepTitles line for that question.
 */
function countStepTitleLabels(questionNum) {
  // Each stepTitles entry is a single-line object; match the one for qN.
  const re = new RegExp(`title:\\s*t\\('q${questionNum}_title'\\)[^\\n]+`, 'g');
  const m = html.match(re);
  assert.ok(m && m.length > 0, `Could not find stepTitles entry for q${questionNum}`);
  // Take the last match (inside Quiz component, not inside a translation object)
  const line = m[m.length - 1];
  const opts = line.match(new RegExp(`q${questionNum}_opt_\\d+`, 'g')) || [];
  return opts.length;
}

// ---------------------------------------------------------------------------
// Label / option count alignment — income step
//
// This is the step where the label/option mismatch bug was introduced.
// "No income" existed as label q3_opt_1 but was missing from the options
// array, shifting every subsequent selection by one index.
// ---------------------------------------------------------------------------
describe('quiz — income step label/option alignment', () => {
  test('annual_income options count === stepTitles q3 labels count', () => {
    const options = extractOptions('annual_income');
    const labelCount = countStepTitleLabels(3);
    assert.equal(
      options.length,
      labelCount,
      `annual_income has ${options.length} options but stepTitles has ${labelCount} labels. ` +
      `A mismatch causes every option after the gap to display the wrong label and store the wrong value. ` +
      `(e.g. selecting "Under $20,000" would store "$20,000–$40,000" and show $40,000 on results page)`
    );
  });

  test('first income option is "No income"', () => {
    const options = extractOptions('annual_income');
    assert.equal(
      options[0],
      'No income',
      `First income option should be "No income" to align with q3_opt_1 translation key`
    );
  });

  test('income options are in expected order', () => {
    const options = extractOptions('annual_income');
    const expected = [
      'No income',
      'Under $20,000',
      '$20,000–$40,000',
      '$40,000–$60,000',
      '$60,000–$80,000',
      '$80,000–$120,000',
      '$120,000–$180,000',
      'Over $180,000',
    ];
    assert.deepEqual(options, expected,
      'Income options order changed — this will break INCOME_UPPER lookups and eligibility checks');
  });
});

// ---------------------------------------------------------------------------
// Income options — every option must have an INCOME_UPPER entry
// ---------------------------------------------------------------------------
describe('quiz — every income option is covered by INCOME_UPPER', () => {
  test('all annual_income options exist as keys in INCOME_UPPER', () => {
    const incomeOptions = extractOptions('annual_income');
    const missing = incomeOptions.filter(opt => !(opt in INCOME_UPPER));
    assert.deepEqual(
      missing,
      [],
      `These income options have no entry in INCOME_UPPER (will default to Infinity, breaking eligibility): ${missing.join(', ')}`
    );
  });

  test('INCOME_UPPER has no keys absent from annual_income options', () => {
    const incomeOptions = new Set(extractOptions('annual_income'));
    const extra = Object.keys(INCOME_UPPER).filter(k => !incomeOptions.has(k));
    assert.deepEqual(
      extra,
      [],
      `INCOME_UPPER has stale keys not present in the quiz options: ${extra.join(', ')}`
    );
  });
});

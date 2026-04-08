/**
 * Eligibility logic tests for california/san-diego/index.html
 *
 * Protects against:
 *   - Income-gated programs showing for over-income households
 *   - Age-gated programs showing for wrong age groups
 *   - Special-status programs (veteran, disabled, etc.) showing for wrong profiles
 *   - GATE_EXEMPT programs being blocked by the income/signal gate
 *   - SSP (id=54) showing without SSI qualifying first
 *   - checkPath short-circuit logic (income, age, flags)
 *   - ageQualifies range math
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
// Extract the pure-JS eligibility block from the HTML.
// Everything from "const PROGRAMS = {" up to (not including) "const quizSteps"
// contains no JSX and no React dependencies.
// ---------------------------------------------------------------------------
const html = readFileSync(join(ROOT, 'california/san-diego/index.html'), 'utf8');
const startMarker = '    const PROGRAMS = {';
const endMarker   = '    const quizSteps = [';
const startIdx = html.indexOf(startMarker);
const endIdx   = html.indexOf(endMarker);
assert.ok(startIdx !== -1, 'Could not find PROGRAMS in index.html');
assert.ok(endIdx   !== -1, 'Could not find quizSteps in index.html');
const pureJsBlock = html.slice(startIdx, endIdx);

const ctx = createContext({ Set, Map, Array, Object, console, exports: {} });
runInContext(
  pureJsBlock +
  `\nexports.PROGRAMS=PROGRAMS;
exports.PROGRAM_CRITERIA=PROGRAM_CRITERIA;
exports.QUALIFY_PATHS=QUALIFY_PATHS;
exports.ENROLLED_KEYS=ENROLLED_KEYS;
exports.GATED_CATEGORIES=GATED_CATEGORIES;
exports.GATE_EXEMPT=GATE_EXEMPT;
exports.ageQualifies=ageQualifies;
exports.checkPath=checkPath;
exports.hasGateQualifyingSignal=hasGateQualifyingSignal;
exports.getProgramTier=getProgramTier;`,
  ctx
);

const {
  PROGRAMS, PROGRAM_CRITERIA, QUALIFY_PATHS,
  GATED_CATEGORIES, GATE_EXEMPT,
  ageQualifies, checkPath, hasGateQualifyingSignal, getProgramTier,
} = ctx.exports;

// ---------------------------------------------------------------------------
// Profile factory — all false/empty by default, override as needed
// ---------------------------------------------------------------------------
const profile = (overrides = {}) => ({
  ageArr: ['26–59'],
  householdSize: 1,
  annualIncome: 200000,   // high → fails most income checks
  isVeteran: false,
  isRefugee: false,
  isDisabled: false,
  isPregnant: false,
  hasChildren: false,
  isFosterCare: false,
  isTribal: false,
  isUnemployed: false,
  isDVSurvivor: false,
  needsLegal: false,
  isEmployedFullTime: false,
  enrolledPrograms: [],
  ...overrides,
});

// ---------------------------------------------------------------------------
// ageQualifies
// ---------------------------------------------------------------------------
describe('ageQualifies', () => {
  test('empty array always qualifies (no age restriction)', () => {
    assert.equal(ageQualifies([], 65, undefined), true);
    assert.equal(ageQualifies([], 0, 5), true);
  });

  test('65+ qualifies for ageMin:65', () => {
    assert.equal(ageQualifies(['65+'], 65, undefined), true);
  });

  test('26–59 does not qualify for ageMin:65', () => {
    assert.equal(ageQualifies(['26–59'], 65, undefined), false);
  });

  test('65+ does not qualify for ageMax:20', () => {
    assert.equal(ageQualifies(['65+'], undefined, 20), false);
  });

  test('Under 6 qualifies for ageMax:5', () => {
    assert.equal(ageQualifies(['Under 6'], undefined, 5), true);
  });

  test('mixed ages: one range qualifies → true', () => {
    // household with a child (Under 6) and an adult (26–59)
    assert.equal(ageQualifies(['Under 6', '26–59'], undefined, 5), true);
  });

  test('62–64 qualifies for ageMin:62', () => {
    assert.equal(ageQualifies(['62–64'], 62, undefined), true);
  });
});

// ---------------------------------------------------------------------------
// checkPath
// ---------------------------------------------------------------------------
describe('checkPath — income gate', () => {
  const calFreshPath = { tier: 'likely', income: true };

  test('income below limit passes', () => {
    const p = profile({ householdSize: 1, annualIncome: 20000 });
    assert.equal(checkPath(calFreshPath, 1, p), true);
  });

  test('income above limit fails', () => {
    const p = profile({ householdSize: 1, annualIncome: 50000 });
    assert.equal(checkPath(calFreshPath, 1, p), false);
  });

  test('program with no income criteria in PROGRAM_CRITERIA fails income gate', () => {
    // Medicare (id=15) has {} in PROGRAM_CRITERIA → no income limit defined
    const p = profile({ householdSize: 1, annualIncome: 0 });
    assert.equal(checkPath({ tier: 'likely', income: true }, 15, p), false);
  });
});

describe('checkPath — age gate', () => {
  test('age qualifies for ageMin:65', () => {
    const p = profile({ ageArr: ['65+'] });
    assert.equal(checkPath({ tier: 'likely', ageMin: 65 }, 15, p), true);
  });

  test('wrong age fails ageMin:65', () => {
    const p = profile({ ageArr: ['26–59'] });
    assert.equal(checkPath({ tier: 'likely', ageMin: 65 }, 15, p), false);
  });
});

describe('checkPath — special status flags', () => {
  test('veteran path passes for veteran', () => {
    const p = profile({ isVeteran: true });
    assert.equal(checkPath({ tier: 'likely', veteran: true }, 51, p), true);
  });

  test('veteran path fails for non-veteran', () => {
    const p = profile({ isVeteran: false });
    assert.equal(checkPath({ tier: 'likely', veteran: true }, 51, p), false);
  });

  test('enrolledAny: has matching program → passes', () => {
    const p = profile({ enrolledPrograms: ['calfresh'] });
    assert.equal(checkPath({ tier: 'likely', enrolledAny: ['calfresh'] }, 30, p), true);
  });

  test('enrolledAny: no matching program → fails', () => {
    const p = profile({ enrolledPrograms: [] });
    assert.equal(checkPath({ tier: 'likely', enrolledAny: ['calfresh'] }, 30, p), false);
  });

  test('no-condition path always passes (label-only)', () => {
    // paths with only a label and no flags pass checkPath unconditionally
    const p = profile(); // high income, no special status
    assert.equal(checkPath({ tier: 'may', label: 'Contact provider' }, 13, p), true);
  });
});

// ---------------------------------------------------------------------------
// getProgramTier — income-gated programs
// ---------------------------------------------------------------------------
describe('getProgramTier — CalFresh (id=1, income-gated, food category)', () => {
  test('income under limit → likely', () => {
    const p = profile({ householdSize: 1, annualIncome: 20000 });
    assert.equal(getProgramTier(1, p, null), 'likely');
  });

  test('income over limit → null', () => {
    const p = profile({ householdSize: 1, annualIncome: 50000 });
    assert.equal(getProgramTier(1, p, null), null);
  });

  test('household size 4, income under limit → likely', () => {
    const p = profile({ householdSize: 4, annualIncome: 60000 });
    // PROGRAM_CRITERIA[1][4] = [{incomeLimit: 64320}]
    assert.equal(getProgramTier(1, p, null), 'likely');
  });

  test('household size 4, income over limit → null', () => {
    const p = profile({ householdSize: 4, annualIncome: 70000 });
    assert.equal(getProgramTier(1, p, null), null);
  });
});

// ---------------------------------------------------------------------------
// getProgramTier — age-gated programs
// ---------------------------------------------------------------------------
describe('getProgramTier — Medicare Part A (id=15, age 65+)', () => {
  test('age 65+ → likely', () => {
    const p = profile({ ageArr: ['65+'], annualIncome: 0 });
    assert.equal(getProgramTier(15, p, null), 'likely');
  });

  test('age 26–59, no special status → null (gate blocks)', () => {
    const p = profile({ ageArr: ['26–59'] });
    assert.equal(getProgramTier(15, p, null), null);
  });

  test('age 26–59, disabled → may (gate passes via isDisabled, 2nd path matches)', () => {
    const p = profile({ ageArr: ['26–59'], isDisabled: true });
    assert.equal(getProgramTier(15, p, null), 'may');
  });
});

describe('getProgramTier — MTS Reduced Fares (id=29, age/enrollment)', () => {
  test('age 65+ → likely', () => {
    const p = profile({ ageArr: ['65+'], annualIncome: 0 });
    assert.equal(getProgramTier(29, p, null), 'likely');
  });

  test('child age 6–13 → likely', () => {
    const p = profile({ ageArr: ['6–13'] });
    assert.equal(getProgramTier(29, p, null), 'likely');
  });

  test('enrolled in Medicare → likely', () => {
    const p = profile({ enrolledPrograms: ['medicare'] });
    assert.equal(getProgramTier(29, p, null), 'likely');
  });
});

// ---------------------------------------------------------------------------
// getProgramTier — special status programs
// ---------------------------------------------------------------------------
describe('getProgramTier — OMVA San Diego (id=51, veteran)', () => {
  test('veteran → likely', () => {
    const p = profile({ isVeteran: true });
    assert.equal(getProgramTier(51, p, null), 'likely');
  });

  test('non-veteran → null', () => {
    const p = profile();
    assert.equal(getProgramTier(51, p, null), null);
  });
});

describe('getProgramTier — Refugee Cash Assistance (id=48)', () => {
  test('refugee → likely', () => {
    const p = profile({ isRefugee: true });
    assert.equal(getProgramTier(48, p, null), 'likely');
  });

  test('non-refugee → null', () => {
    const p = profile();
    assert.equal(getProgramTier(48, p, null), null);
  });
});

describe('getProgramTier — WIC (id=24, pregnant + income)', () => {
  test('pregnant, income under limit → likely', () => {
    const p = profile({ isPregnant: true, householdSize: 1, annualIncome: 20000 });
    assert.equal(getProgramTier(24, p, null), 'likely');
  });

  test('pregnant, income over limit → null', () => {
    const p = profile({ isPregnant: true, householdSize: 1, annualIncome: 50000 });
    assert.equal(getProgramTier(24, p, null), null);
  });

  test('not pregnant, has child, income under limit → likely', () => {
    const p = profile({ hasChildren: true, householdSize: 2, annualIncome: 30000 });
    // PROGRAM_CRITERIA[24][2] = [{incomeLimit: 39128}]
    assert.equal(getProgramTier(24, p, null), 'likely');
  });

  test('not pregnant, no children, low income → null', () => {
    const p = profile({ householdSize: 1, annualIncome: 10000 });
    assert.equal(getProgramTier(24, p, null), null);
  });
});

// ---------------------------------------------------------------------------
// getProgramTier — GATE_EXEMPT programs bypass the income/signal gate
// ---------------------------------------------------------------------------
describe('getProgramTier — GATE_EXEMPT programs (ids 33, 59, 60, 74, 86)', () => {
  test('Medical Baseline (id=33) visible with no qualifying signals → may', () => {
    // Would normally be blocked by GATED_CATEGORIES('utility') + no signals
    const p = profile(); // high income, no special status
    assert.equal(getProgramTier(33, p, null), 'may');
  });

  test('Discover & Go library (id=59) visible with no qualifying signals → likely', () => {
    const p = profile();
    assert.equal(getProgramTier(59, p, null), 'likely');
  });

  test('State Parks Pass library (id=60) visible with no qualifying signals → likely', () => {
    const p = profile();
    assert.equal(getProgramTier(60, p, null), 'likely');
  });

  test('Utility Emergency Relief (id=74) visible with no qualifying signals → likely', () => {
    const p = profile();
    assert.equal(getProgramTier(74, p, null), 'likely');
  });

  test('National Parks Volunteer Pass (id=86) visible with no qualifying signals → may', () => {
    const p = profile();
    assert.equal(getProgramTier(86, p, null), 'may');
  });
});

// ---------------------------------------------------------------------------
// getProgramTier — SSP (id=54) requires SSI to qualify first
// ---------------------------------------------------------------------------
describe('getProgramTier — SSP (id=54, requires ssiTier)', () => {
  test('ssiTier=null → null regardless of profile', () => {
    const p = profile({ enrolledPrograms: ['ssi'] });
    assert.equal(getProgramTier(54, p, null), null);
  });

  test('ssiTier="likely", enrolled in SSI → likely', () => {
    const p = profile({ enrolledPrograms: ['ssi'] });
    assert.equal(getProgramTier(54, p, 'likely'), 'likely');
  });

  test('ssiTier="may", not enrolled in SSI → null (enrolled check fails)', () => {
    const p = profile({ enrolledPrograms: [] });
    assert.equal(getProgramTier(54, p, 'may'), null);
  });
});

// ---------------------------------------------------------------------------
// getProgramTier — programs with only label paths return 'may' for anyone
// ---------------------------------------------------------------------------
describe('getProgramTier — label-only paths', () => {
  test('General Relief (id=13): label-only path, gate passes with qualifying signal → may', () => {
    // The path has only a label (no conditions) so checkPath always returns true.
    // But id=13 is in the 'income' category (GATED), so the profile needs at least one
    // qualifying signal (e.g. disabled) to pass hasGateQualifyingSignal first.
    const p = profile({ isDisabled: true });
    assert.equal(getProgramTier(13, p, null), 'may');
  });

  test('General Relief (id=13): no qualifying signal → null (gated)', () => {
    const p = profile(); // high income, no special status
    assert.equal(getProgramTier(13, p, null), null);
  });
});

// ---------------------------------------------------------------------------
// hasGateQualifyingSignal
// ---------------------------------------------------------------------------
describe('hasGateQualifyingSignal', () => {
  test('no signals, income over limit → false', () => {
    const p = profile({ householdSize: 1, annualIncome: 200000 });
    assert.equal(hasGateQualifyingSignal(1, p), false);
  });

  test('income under CalFresh limit → true', () => {
    const p = profile({ householdSize: 1, annualIncome: 20000 });
    assert.equal(hasGateQualifyingSignal(1, p), true);
  });

  test('isDisabled → true', () => {
    const p = profile({ isDisabled: true });
    assert.equal(hasGateQualifyingSignal(15, p), true);
  });

  test('hasChildren → true', () => {
    const p = profile({ hasChildren: true });
    assert.equal(hasGateQualifyingSignal(1, p), true);
  });

  test('enrolledPrograms non-empty → true', () => {
    const p = profile({ enrolledPrograms: ['calfresh'] });
    assert.equal(hasGateQualifyingSignal(5, p), true);
  });
});

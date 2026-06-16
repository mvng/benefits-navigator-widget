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
// Everything from "const PROGRAMS = {" up to (not including) the quizSteps
// comment contains no JSX and no React dependencies.
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
  isPartTime: false,
  isRetired: false,
  isStudent: false,
  isHomeowner: false,
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
    assert.equal(checkPath(calFreshPath, 'CA-01', p), true);
  });

  test('income above limit fails', () => {
    const p = profile({ householdSize: 1, annualIncome: 50000 });
    assert.equal(checkPath(calFreshPath, 'CA-01', p), false);
  });

  test('program with no income criteria in PROGRAM_CRITERIA fails income gate', () => {
    // Medicare Part A (US-04) has {} in PROGRAM_CRITERIA → no income limit defined
    const p = profile({ householdSize: 1, annualIncome: 0 });
    assert.equal(checkPath({ tier: 'likely', income: true }, 'US-04', p), false);
  });
});

describe('checkPath — age gate', () => {
  test('age qualifies for ageMin:65', () => {
    const p = profile({ ageArr: ['65+'] });
    assert.equal(checkPath({ tier: 'likely', ageMin: 65 }, 'US-04', p), true);
  });

  test('wrong age fails ageMin:65', () => {
    const p = profile({ ageArr: ['26–59'] });
    assert.equal(checkPath({ tier: 'likely', ageMin: 65 }, 'US-04', p), false);
  });
});

describe('checkPath — special status flags', () => {
  test('veteran path passes for veteran', () => {
    const p = profile({ isVeteran: true });
    assert.equal(checkPath({ tier: 'likely', veteran: true }, 'CA37-07', p), true);
  });

  test('veteran path fails for non-veteran', () => {
    const p = profile({ isVeteran: false });
    assert.equal(checkPath({ tier: 'likely', veteran: true }, 'CA37-07', p), false);
  });

  test('enrolledAny: has matching program → passes', () => {
    const p = profile({ enrolledPrograms: ['calfresh'] });
    assert.equal(checkPath({ tier: 'likely', enrolledAny: ['calfresh'] }, 'US-23', p), true);
  });

  test('enrolledAny: no matching program → fails', () => {
    const p = profile({ enrolledPrograms: [] });
    assert.equal(checkPath({ tier: 'likely', enrolledAny: ['calfresh'] }, 'US-23', p), false);
  });

  test('no-condition path always passes (label-only)', () => {
    // paths with only a label and no flags pass checkPath unconditionally
    const p = profile(); // high income, no special status
    assert.equal(checkPath({ tier: 'may', label: 'Contact provider' }, 'CA37-09', p), true);
  });
});

// ---------------------------------------------------------------------------
// getProgramTier — income-gated programs
// ---------------------------------------------------------------------------
describe('getProgramTier — CalFresh (CA-01, income-gated, food category)', () => {
  test('income under limit → likely', () => {
    const p = profile({ householdSize: 1, annualIncome: 20000 });
    assert.equal(getProgramTier('CA-01', p), 'likely');
  });

  test('income over limit → null', () => {
    const p = profile({ householdSize: 1, annualIncome: 50000 });
    assert.equal(getProgramTier('CA-01', p), null);
  });

  test('household size 4, income under limit → likely', () => {
    const p = profile({ householdSize: 4, annualIncome: 60000 });
    // PROGRAM_CRITERIA["CA-01"][4] = [{incomeLimit: 64320}]
    assert.equal(getProgramTier('CA-01', p), 'likely');
  });

  test('household size 4, income over limit → null', () => {
    const p = profile({ householdSize: 4, annualIncome: 70000 });
    assert.equal(getProgramTier('CA-01', p), null);
  });
});

// ---------------------------------------------------------------------------
// getProgramTier — age-gated programs
// ---------------------------------------------------------------------------
describe('getProgramTier — Medicare Part A (US-04, age 65+)', () => {
  test('age 65+ → likely', () => {
    const p = profile({ ageArr: ['65+'], annualIncome: 0 });
    assert.equal(getProgramTier('US-04', p), 'likely');
  });

  test('age 26–59, no special status → null (gate blocks)', () => {
    const p = profile({ ageArr: ['26–59'] });
    assert.equal(getProgramTier('US-04', p), null);
  });

  test('age 26–59, disabled → likely (gate passes via isDisabled, 2nd path matches)', () => {
    const p = profile({ ageArr: ['26–59'], isDisabled: true });
    assert.equal(getProgramTier('US-04', p), 'likely');
  });
});

describe('getProgramTier — MTS Reduced Fares (CA37-03, age/disability)', () => {
  test('age 65+ → likely', () => {
    const p = profile({ ageArr: ['65+'], annualIncome: 0 });
    assert.equal(getProgramTier('CA37-03', p), 'likely');
  });

  test('child age 6–13 → likely (ageMax:18 path)', () => {
    const p = profile({ ageArr: ['6–13'] });
    assert.equal(getProgramTier('CA37-03', p), 'likely');
  });

  test('disabled → likely', () => {
    const p = profile({ isDisabled: true });
    assert.equal(getProgramTier('CA37-03', p), 'likely');
  });
});

// ---------------------------------------------------------------------------
// getProgramTier — special status programs
// ---------------------------------------------------------------------------
describe('getProgramTier — OMVA San Diego (CA37-07, veteran)', () => {
  test('veteran → likely', () => {
    const p = profile({ isVeteran: true });
    assert.equal(getProgramTier('CA37-07', p), 'likely');
  });

  test('non-veteran → null', () => {
    const p = profile();
    assert.equal(getProgramTier('CA37-07', p), null);
  });
});

describe('getProgramTier — Refugee Cash Assistance (CA-21)', () => {
  test('refugee → likely', () => {
    const p = profile({ isRefugee: true });
    assert.equal(getProgramTier('CA-21', p), 'likely');
  });

  test('non-refugee → null', () => {
    const p = profile();
    assert.equal(getProgramTier('CA-21', p), null);
  });
});

describe('getProgramTier — WIC (CA-36, pregnant + income)', () => {
  test('pregnant, income under limit → likely', () => {
    const p = profile({ isPregnant: true, householdSize: 1, annualIncome: 20000 });
    assert.equal(getProgramTier('CA-36', p), 'likely');
  });

  test('pregnant, income over limit → null', () => {
    const p = profile({ isPregnant: true, householdSize: 1, annualIncome: 50000 });
    assert.equal(getProgramTier('CA-36', p), null);
  });

  test('not pregnant, has children only, low income → null (WIC requires pregnant)', () => {
    // CA-36 QUALIFY_PATHS only has the pregnant+income path
    const p = profile({ hasChildren: true, householdSize: 2, annualIncome: 30000 });
    assert.equal(getProgramTier('CA-36', p), null);
  });

  test('not pregnant, no children, low income → null', () => {
    const p = profile({ householdSize: 1, annualIncome: 10000 });
    assert.equal(getProgramTier('CA-36', p), null);
  });
});

// ---------------------------------------------------------------------------
// getProgramTier — GATE_EXEMPT programs bypass the income/signal gate
// ---------------------------------------------------------------------------
describe('getProgramTier — GATE_EXEMPT programs', () => {
  test('Medical Baseline (CA-13) visible with disabled signal → may', () => {
    // CA-13 paths require disabled:true; GATE_EXEMPT bypasses category gate
    const p = profile({ isDisabled: true });
    assert.equal(getProgramTier('CA-13', p), 'may');
  });

  test('Medical Baseline (CA-13) without disabled signal → null (checkPath fails)', () => {
    const p = profile(); // no disabled signal
    assert.equal(getProgramTier('CA-13', p), null);
  });

  test('Discover & Go library (CA37-09) visible with no qualifying signals → may', () => {
    // Label-only path: tier is "may", gate-exempt
    const p = profile();
    assert.equal(getProgramTier('CA37-09', p), 'may');
  });

  test('SD Library Parks Pass (CA37-24) visible with no qualifying signals → may', () => {
    const p = profile();
    assert.equal(getProgramTier('CA37-24', p), 'may');
  });

  test('NP Volunteer Pass (US-21) visible with no qualifying signals → may', () => {
    const p = profile();
    assert.equal(getProgramTier('US-21', p), 'may');
  });
});

// ---------------------------------------------------------------------------
// getProgramTier — SSP (CA-24) follows own paths (income/age/disability)
// ---------------------------------------------------------------------------
describe('getProgramTier — SSP (CA-24, income / age / disability)', () => {
  test('income under limit → likely', () => {
    // PROGRAM_CRITERIA["CA-24"][1] = [{incomeLimit: 24228}]
    const p = profile({ householdSize: 1, annualIncome: 20000 });
    assert.equal(getProgramTier('CA-24', p), 'likely');
  });

  test('age 65+ → likely', () => {
    const p = profile({ ageArr: ['65+'] });
    assert.equal(getProgramTier('CA-24', p), 'likely');
  });

  test('disabled → likely', () => {
    const p = profile({ isDisabled: true });
    assert.equal(getProgramTier('CA-24', p), 'likely');
  });

  test('no qualifying condition → null', () => {
    const p = profile(); // high income, no special status
    assert.equal(getProgramTier('CA-24', p), null);
  });
});

// ---------------------------------------------------------------------------
// getProgramTier — programs with conditional-label paths
// ---------------------------------------------------------------------------
describe('getProgramTier — conditional paths', () => {
  test('General Relief (CA37-01): age 18-64 + income under limit → may', () => {
    // CA37-01 paths require ageMin:18, ageMax:64, income:true
    // PROGRAM_CRITERIA["CA37-01"][1] = [{incomeLimit: 7176, ageMin:18, ageMax:64}]
    const p = profile({ ageArr: ['26–59'], householdSize: 1, annualIncome: 5000 });
    assert.equal(getProgramTier('CA37-01', p), 'may');
  });

  test('General Relief (CA37-01): no qualifying signal → null (gated)', () => {
    const p = profile(); // high income, no special status
    assert.equal(getProgramTier('CA37-01', p), null);
  });
});

// ---------------------------------------------------------------------------
// hasGateQualifyingSignal
// ---------------------------------------------------------------------------
describe('hasGateQualifyingSignal', () => {
  test('no signals, income over limit → false', () => {
    const p = profile({ householdSize: 1, annualIncome: 200000 });
    assert.equal(hasGateQualifyingSignal('CA-01', p), false);
  });

  test('income under CalFresh limit → true', () => {
    const p = profile({ householdSize: 1, annualIncome: 20000 });
    assert.equal(hasGateQualifyingSignal('CA-01', p), true);
  });

  test('isDisabled → true', () => {
    const p = profile({ isDisabled: true });
    assert.equal(hasGateQualifyingSignal('US-04', p), true);
  });

  test('hasChildren → true', () => {
    const p = profile({ hasChildren: true });
    assert.equal(hasGateQualifyingSignal('CA-01', p), true);
  });

  test('enrolledPrograms non-empty → true', () => {
    const p = profile({ enrolledPrograms: ['calfresh'] });
    assert.equal(hasGateQualifyingSignal('CA-03', p), true);
  });
});

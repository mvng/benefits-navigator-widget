/**
 * Eligibility logic tests for california/san-diego/index.html
 *
 * Protects against:
 *   - Income-gated programs showing for over-income households
 *   - Age-gated programs showing for wrong age groups
 *   - Special-status programs (veteran, refugee, pregnant, etc.) showing for wrong profiles
 *   - ageQualifies range math
 *   - checkPath short-circuit logic
 *   - buildProfile correctly mapping quiz answers to profile flags
 *   - getProgramTier returning the right tier for each program
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
exports.ELIGIBILITY=ELIGIBILITY;
exports.AGE_RANGE_MAP=AGE_RANGE_MAP;
exports.ageQualifies=ageQualifies;
exports.buildProfile=buildProfile;
exports.checkPath=checkPath;
exports.getProgramTier=getProgramTier;`,
  ctx
);

const {
  PROGRAMS, PROGRAM_CRITERIA, ELIGIBILITY, AGE_RANGE_MAP,
  ageQualifies, buildProfile, checkPath, getProgramTier,
} = ctx.exports;

// ---------------------------------------------------------------------------
// Profile factory — all defaults produce a non-qualifying profile
// (high income, no special status, no ages set → empty age array = any age)
// ---------------------------------------------------------------------------
const profile = (overrides = {}) => ({
  householdSize: 1,
  income: Infinity,     // high → fails most income checks
  ages: [],             // empty → passes any age gate (no age restriction assumed)
  unemployed: false,
  partTime: false,
  retired: false,
  student: false,
  cannotWork: false,
  disabled: false,
  pregnant: false,
  veteran: false,
  fosterCare: false,
  refugee: false,
  tribal: false,
  domesticViolence: false,
  homeowner: false,
  landlord: false,
  homeless: false,
  legalHelp: false,
  reentry: false,
  rural: false,
  disasterSurvivor: false,
  providerSearch: false,
  forEveryone: false,
  enrolledPrograms: [],
  ...overrides,
});

// ---------------------------------------------------------------------------
// ageQualifies
// Ages are now [lo, hi] number pairs (produced by AGE_RANGE_MAP)
// ---------------------------------------------------------------------------
describe('ageQualifies', () => {
  test('empty array always qualifies (no age restriction)', () => {
    assert.equal(ageQualifies([], 65, 150), true);
    assert.equal(ageQualifies([], 0, 5), true);
  });

  test('65+ qualifies for ageMin:65', () => {
    assert.equal(ageQualifies([[65, 150]], 65, 150), true);
  });

  test('26–59 does not qualify for ageMin:65', () => {
    assert.equal(ageQualifies([[26, 59]], 65, 150), false);
  });

  test('65+ does not qualify for ageMax:20', () => {
    assert.equal(ageQualifies([[65, 150]], 0, 20), false);
  });

  test('Under 6 qualifies for ageMax:5', () => {
    assert.equal(ageQualifies([[0, 5]], 0, 5), true);
  });

  test('mixed ages: one range qualifies → true', () => {
    // household with a child (Under 6) and an adult (26–59)
    assert.equal(ageQualifies([[0, 5], [26, 59]], 0, 5), true);
  });

  test('62–64 qualifies for ageMin:62', () => {
    assert.equal(ageQualifies([[62, 64]], 62, 150), true);
  });
});

// ---------------------------------------------------------------------------
// buildProfile
// ---------------------------------------------------------------------------
describe('buildProfile', () => {
  test('maps household_size string to householdSize number', () => {
    const p = buildProfile({ household_size: '3 people', annual_income: 'Under $20,000', employment: [], special_status: [], age: [], enrolled_programs: [] });
    assert.equal(p.householdSize, 3);
  });

  test('maps annual_income string to income upper bound', () => {
    const p = buildProfile({ household_size: '1 person', annual_income: 'Under $20,000', employment: [], special_status: [], age: [], enrolled_programs: [] });
    assert.equal(p.income, 20000);
  });

  test('maps age strings to [lo, hi] pairs', () => {
    const p = buildProfile({ household_size: '1 person', annual_income: 'Under $20,000', employment: [], special_status: [], age: ['65+', '26–59'], enrolled_programs: [] });
    assert.equal(JSON.stringify(p.ages), JSON.stringify([[65, 150], [26, 59]]));
  });

  test('employment "Unemployed (looking for work)" → unemployed: true', () => {
    const p = buildProfile({ household_size: '1 person', annual_income: 'Under $20,000', employment: ['Unemployed (looking for work)'], special_status: [], age: [], enrolled_programs: [] });
    assert.equal(p.unemployed, true);
  });

  test('special_status "Disabled, blind, or have a chronic illness" → disabled: true', () => {
    const p = buildProfile({ household_size: '1 person', annual_income: 'Under $20,000', employment: [], special_status: ['Disabled, blind, or have a chronic illness'], age: [], enrolled_programs: [] });
    assert.equal(p.disabled, true);
  });

  test('employment "Unable to work (disability/medical)" → disabled: true and cannotWork: true', () => {
    const p = buildProfile({ household_size: '1 person', annual_income: 'Under $20,000', employment: ['Unable to work (disability/medical)'], special_status: [], age: [], enrolled_programs: [] });
    assert.equal(p.disabled, true);
    assert.equal(p.cannotWork, true);
  });

  test('special_status military string → veteran: true', () => {
    const p = buildProfile({ household_size: '1 person', annual_income: 'Under $20,000', employment: [], special_status: ['Military (active duty, reserve, national guard), Veteran, Gold Star Family, and Dependents'], age: [], enrolled_programs: [] });
    assert.equal(p.veteran, true);
  });

  test('"None of the above" in enrolled_programs is filtered out', () => {
    const p = buildProfile({ household_size: '1 person', annual_income: 'Under $20,000', employment: [], special_status: [], age: [], enrolled_programs: ['None of the above'] });
    assert.deepEqual(p.enrolledPrograms, []);
  });
});

// ---------------------------------------------------------------------------
// checkPath
// ---------------------------------------------------------------------------
describe('checkPath — income gate', () => {
  test('income below limit passes → likely', () => {
    const p = profile({ householdSize: 1, income: 20000 });
    assert.equal(checkPath({ household_size: 1, income_minimum: 0, income_limit: 31320 }, p), 'likely');
  });

  test('income above limit fails → null', () => {
    const p = profile({ householdSize: 1, income: 50000 });
    assert.equal(checkPath({ household_size: 1, income_minimum: 0, income_limit: 31320 }, p), null);
  });

  test('wrong household_size → null', () => {
    const p = profile({ householdSize: 2, income: 20000 });
    assert.equal(checkPath({ household_size: 1, income_limit: 31320 }, p), null);
  });

  test('path with may_only → may', () => {
    const p = profile({ householdSize: 1, income: 5000, ages: [[26, 59]] });
    assert.equal(checkPath({ household_size: 1, income_limit: 7176, age_min: 18, age_max: 64, may_only: true }, p), 'may');
  });
});

describe('checkPath — age gate', () => {
  test('age qualifies for age_min:65 → likely', () => {
    const p = profile({ ages: [[65, 150]] });
    assert.equal(checkPath({ age_min: 65, age_max: 150 }, p), 'likely');
  });

  test('wrong age fails age_min:65 → null', () => {
    const p = profile({ ages: [[26, 59]] });
    assert.equal(checkPath({ age_min: 65, age_max: 150 }, p), null);
  });

  test('empty ages array skips age gate → likely', () => {
    const p = profile({ ages: [] });
    assert.equal(checkPath({ age_min: 65, age_max: 150 }, p), 'likely');
  });
});

describe('checkPath — special status flags', () => {
  test('veteran path passes for veteran → likely', () => {
    const p = profile({ veteran: true });
    assert.equal(checkPath({ veteran_military: true }, p), 'likely');
  });

  test('veteran path fails for non-veteran → null', () => {
    const p = profile({ veteran: false });
    assert.equal(checkPath({ veteran_military: true }, p), null);
  });

  test('refugee path passes for refugee → likely', () => {
    const p = profile({ refugee: true });
    assert.equal(checkPath({ refugee: true }, p), 'likely');
  });

  test('disabled path passes for disabled → likely', () => {
    const p = profile({ disabled: true });
    assert.equal(checkPath({ disabled: true }, p), 'likely');
  });

  test('pregnant path fails for non-pregnant → null', () => {
    const p = profile({ pregnant: false });
    assert.equal(checkPath({ pregnant: true }, p), null);
  });

  test('provider_search path always returns may', () => {
    const p = profile();
    assert.equal(checkPath({ provider_search: true }, p), 'may');
  });

  test('other_eligibility path always returns may', () => {
    const p = profile();
    assert.equal(checkPath({ other_eligibility: 'Some condition' }, p), 'may');
  });

  test('no-condition path always passes → likely', () => {
    const p = profile();
    // An empty path object has no checks → passes unconditionally
    assert.equal(checkPath({}, p), 'likely');
  });
});

// ---------------------------------------------------------------------------
// getProgramTier — income-gated programs
// ---------------------------------------------------------------------------
describe('getProgramTier — CalFresh (CA-001, income-gated, food)', () => {
  test('income under limit → likely', () => {
    const p = profile({ householdSize: 1, income: 20000 });
    assert.equal(getProgramTier('CA-001', p), 'likely');
  });

  test('income over limit → null', () => {
    const p = profile({ householdSize: 1, income: 50000 });
    assert.equal(getProgramTier('CA-001', p), null);
  });

  test('household size 4, income under limit → likely', () => {
    // ELIGIBILITY["CA-001"][3] has income_limit: 64320 for hh_size 4
    const p = profile({ householdSize: 4, income: 60000 });
    assert.equal(getProgramTier('CA-001', p), 'likely');
  });

  test('household size 4, income over limit → null', () => {
    const p = profile({ householdSize: 4, income: 70000 });
    assert.equal(getProgramTier('CA-001', p), null);
  });
});

// ---------------------------------------------------------------------------
// getProgramTier — veteran-gated programs
// ---------------------------------------------------------------------------
describe('getProgramTier — CA-005 (California LifeLine, has veteran path)', () => {
  test('veteran → likely', () => {
    const p = profile({ veteran: true });
    assert.equal(getProgramTier('CA-005', p), 'likely');
  });
});

// ---------------------------------------------------------------------------
// getProgramTier — refugee programs
// ---------------------------------------------------------------------------
describe('getProgramTier — CA-021 (Refugee Cash Assistance)', () => {
  test('refugee → likely', () => {
    const p = profile({ refugee: true });
    assert.equal(getProgramTier('CA-021', p), 'likely');
  });

  test('domestic violence survivor → likely', () => {
    const p = profile({ domesticViolence: true });
    assert.equal(getProgramTier('CA-021', p), 'likely');
  });

  test('no qualifying flag → null', () => {
    const p = profile(); // high income, no special status
    assert.equal(getProgramTier('CA-021', p), null);
  });
});

// ---------------------------------------------------------------------------
// getProgramTier — WIC (CA-036, pregnant + income)
// ---------------------------------------------------------------------------
describe('getProgramTier — WIC (CA-036)', () => {
  test('pregnant, income under limit → likely', () => {
    const p = profile({ pregnant: true, householdSize: 1, income: 20000 });
    assert.equal(getProgramTier('CA-036', p), 'likely');
  });

  test('pregnant, income over limit → null', () => {
    // CA-036 hh_size 1 income_limit is 28953
    const p = profile({ pregnant: true, householdSize: 1, income: 40000 });
    assert.equal(getProgramTier('CA-036', p), null);
  });

  test('not pregnant, low income → null (WIC requires pregnant)', () => {
    const p = profile({ householdSize: 1, income: 10000 });
    assert.equal(getProgramTier('CA-036', p), null);
  });
});

// ---------------------------------------------------------------------------
// getProgramTier — General Relief (CA37-001, age + income, may_only)
// ---------------------------------------------------------------------------
describe('getProgramTier — General Relief (CA37-001, age 18–64 + income)', () => {
  test('age 26–59, income under limit → may', () => {
    const p = profile({ householdSize: 1, income: 5000, ages: [[26, 59]] });
    assert.equal(getProgramTier('CA37-001', p), 'may');
  });

  test('income over limit → null', () => {
    const p = profile({ householdSize: 1, income: 50000, ages: [[26, 59]] });
    assert.equal(getProgramTier('CA37-001', p), null);
  });

  test('age 65+, income under limit → null (outside age range)', () => {
    const p = profile({ householdSize: 1, income: 5000, ages: [[65, 150]] });
    assert.equal(getProgramTier('CA37-001', p), null);
  });
});

// ---------------------------------------------------------------------------
// getProgramTier — employment-gated programs
// ---------------------------------------------------------------------------
describe('getProgramTier — Unemployment Benefits (CA-002)', () => {
  test('unemployed → likely', () => {
    const p = profile({ unemployed: true });
    assert.equal(getProgramTier('CA-002', p), 'likely');
  });

  test('part-time → may', () => {
    const p = profile({ partTime: true });
    assert.equal(getProgramTier('CA-002', p), 'may');
  });

  test('no employment flag → null', () => {
    const p = profile();
    assert.equal(getProgramTier('CA-002', p), null);
  });
});

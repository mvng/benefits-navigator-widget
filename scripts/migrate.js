#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.resolve(__dirname, '..');
const TARGET = path.join(ROOT, 'california/san-diego/index.html');
const PROGRAMS_SRC = path.join(__dirname, 'out_programs.js');
const CRITERIA_SRC = path.join(__dirname, 'out_criteria.js');
const PROGRAMS_JSON = '/Users/matt/Downloads/programs.json';

// ── Read all source files ──────────────────────────────────────────────────
let html = fs.readFileSync(TARGET, 'utf8');
const programsJs = fs.readFileSync(PROGRAMS_SRC, 'utf8').trim();
const criteriaJs = fs.readFileSync(CRITERIA_SRC, 'utf8').trim();
const programsData = JSON.parse(fs.readFileSync(PROGRAMS_JSON, 'utf8'));

const sizeBefore = Buffer.byteLength(html, 'utf8');
console.log(`File size before: ${sizeBefore} bytes (${html.split('\n').length} lines)`);

const results = {};

// ── Replacement 1: PROGRAMS block ─────────────────────────────────────────
// The PROGRAMS block starts with '    const PROGRAMS = {' (4-space indent)
// and ends with '\n    };' (4-space indent closing).
{
  const startMarker = '    const PROGRAMS = {';
  const endMarker = '\n    };';

  const startIdx = html.indexOf(startMarker);
  if (startIdx === -1) {
    results['1_PROGRAMS'] = 'FAILED: could not find start marker';
  } else {
    const endSearchFrom = startIdx + startMarker.length;
    const endIdx = html.indexOf(endMarker, endSearchFrom);
    if (endIdx === -1) {
      results['1_PROGRAMS'] = 'FAILED: could not find end marker \\n    };';
    } else {
      const endOfBlock = endIdx + endMarker.length;
      // programsJs starts with "const PROGRAMS = {" — prepend 4 spaces
      const replacement = '    ' + programsJs;
      html = html.slice(0, startIdx) + replacement + html.slice(endOfBlock);
      results['1_PROGRAMS'] = 'OK';
      console.log(`  [1] PROGRAMS replaced`);
    }
  }
}

// ── Replacement 2: PROGRAM_CRITERIA block ─────────────────────────────────
// The PROGRAM_CRITERIA block starts with '    const PROGRAM_CRITERIA = {' (4-space)
// but its contents are at 0-indent, ending with '\n};' (0-indent closing).
{
  const startMarker = '    const PROGRAM_CRITERIA = {';
  // The block's content is at 0-indent, so the closing is \n}; at 0-indent
  const endMarker = '\n};';

  const startIdx = html.indexOf(startMarker);
  if (startIdx === -1) {
    results['2_PROGRAM_CRITERIA'] = 'FAILED: could not find start marker';
  } else {
    const endSearchFrom = startIdx + startMarker.length;
    const endIdx = html.indexOf(endMarker, endSearchFrom);
    if (endIdx === -1) {
      results['2_PROGRAM_CRITERIA'] = 'FAILED: could not find end marker \\n};';
    } else {
      const endOfBlock = endIdx + endMarker.length;
      // criteriaJs starts with "const PROGRAM_CRITERIA = {" — prepend 4 spaces
      const replacement = '    ' + criteriaJs;
      html = html.slice(0, startIdx) + replacement + html.slice(endOfBlock);
      results['2_PROGRAM_CRITERIA'] = 'OK';
      console.log(`  [2] PROGRAM_CRITERIA replaced`);
    }
  }
}

// ── Replacement 3: Insert ELIGIBILITY after PROGRAM_CRITERIA ──────────────
// After replacement 2, PROGRAM_CRITERIA ends with "};" at 0-indent (from criteriaJs).
// We inserted "    " prefix so the const declaration has 4-space indent,
// but the body of criteriaJs ends with "};" at 0-indent.
// So the ending of the PROGRAM_CRITERIA block in the new html is "\n};"
// We find the PROGRAM_CRITERIA start, then find its \n}; closing, and insert after.
{
  const startMarker = '    const PROGRAM_CRITERIA = {';
  const endMarker = '\n};';

  const startIdx = html.indexOf(startMarker);
  if (startIdx === -1) {
    results['3_ELIGIBILITY'] = 'FAILED: PROGRAM_CRITERIA block not found';
  } else {
    const endIdx = html.indexOf(endMarker, startIdx + startMarker.length);
    if (endIdx === -1) {
      results['3_ELIGIBILITY'] = 'FAILED: could not find closing }; of PROGRAM_CRITERIA';
    } else {
      const insertAfter = endIdx + endMarker.length;

      // Build ELIGIBILITY block from programs.json
      const eligibilityJson = JSON.stringify(programsData.ELIGIBILITY, null, 2);
      // Indent each line by 4 spaces
      const lines = eligibilityJson.split('\n');
      // lines[0] is "{", replace with "    const ELIGIBILITY = {"
      // lines[last] is "}", replace with "    };"
      lines[0] = '    const ELIGIBILITY = {';
      lines[lines.length - 1] = '    };';
      // All other lines get 4-space indent prepended
      for (let i = 1; i < lines.length - 1; i++) {
        lines[i] = '    ' + lines[i];
      }
      const eligibilityBlock = '\n' + lines.join('\n');

      html = html.slice(0, insertAfter) + eligibilityBlock + html.slice(insertAfter);
      results['3_ELIGIBILITY'] = 'OK';
      console.log(`  [3] ELIGIBILITY inserted after PROGRAM_CRITERIA`);
    }
  }
}

// ── Replacement 4: Replace eligibility engine ─────────────────────────────
// The engine block starts at '    const QUALIFY_PATHS' and ends just before
// '    // quizSteps moved inside Quiz component'
{
  const engineStartMarker = '    const QUALIFY_PATHS';
  const engineEndSentinel = '    // quizSteps moved inside Quiz component';

  const startIdx = html.indexOf(engineStartMarker);
  if (startIdx === -1) {
    results['4_ENGINE'] = 'FAILED: could not find QUALIFY_PATHS';
  } else {
    const endIdx = html.indexOf(engineEndSentinel, startIdx);
    if (endIdx === -1) {
      results['4_ENGINE'] = 'FAILED: could not find quizSteps moved sentinel';
    } else {
      // Replace from startIdx up to (not including) endIdx
      const newEngine = `    // \u2500\u2500 Eligibility engine \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    const HOUSEHOLD_SIZE_MAP = { "1 person":1,"2 people":2,"3 people":3,"4 people":4,"5 people":5,"6 people":6,"7 people":7 };
    const INCOME_UPPER = { "Under $20,000":20000,"$20,000\u2013$40,000":40000,"$40,000\u2013$60,000":60000,"$60,000\u2013$80,000":80000,"$80,000\u2013$120,000":120000,"$120,000\u2013$180,000":180000,"Over $180,000":Infinity };
    const AGE_RANGE_MAP = { "Under 6":[0,5],"6\u201313":[6,13],"13\u201317":[13,17],"18":[18,18],"19\u201325":[19,25],"26\u201359":[26,59],"60\u201361":[60,61],"62\u201364":[62,64],"65+":[65,150] };

    const ageQualifies = (ages, ageMin, ageMax) => {
      if (!ages || ages.length === 0) return true;
      return ages.some(([lo, hi]) => lo <= ageMax && hi >= ageMin);
    };

    const buildProfile = (answers) => {
      const emp = answers.employment || [];
      const special = answers.special_status || [];
      const enrolled = (answers.enrolled_programs || []).filter(e => e !== "None of the above");
      const ages = (answers.age || []).map(a => AGE_RANGE_MAP[a]).filter(Boolean);
      return {
        householdSize: HOUSEHOLD_SIZE_MAP[answers.household_size] || 1,
        income: INCOME_UPPER[answers.annual_income] ?? Infinity,
        ages,
        unemployed: emp.includes("Unemployed (looking for work)"),
        partTime: emp.includes("Employed part-time"),
        retired: emp.includes("Retired"),
        student: emp.includes("Student"),
        cannotWork: emp.includes("Unable to work (disability/medical)"),
        disabled: special.includes("Disabled, blind, or have a chronic illness") || emp.includes("Unable to work (disability/medical)"),
        pregnant: special.includes("Pregnant or recently pregnant"),
        veteran: special.includes("Military (active duty, reserve, national guard), Veteran, Gold Star Family, and Dependents"),
        fosterCare: special.includes("In foster care or extended foster care"),
        refugee: special.includes("Refugee or recent immigrant"),
        tribal: special.includes("Tribal member"),
        domesticViolence: special.includes("Domestic violence or human trafficking survivor"),
        homeowner: special.includes("Homeowner"),
        landlord: special.includes("Landlord"),
        homeless: special.includes("Homeless"),
        legalHelp: special.includes("Need legal assistance"),
        reentry: special.includes("Reentry"),
        rural: special.includes("Live in a rural area"),
        disasterSurvivor: special.includes("Disaster survivor"),
        providerSearch: special.includes("Want to find a healthcare or mental health provider"),
        forEveryone: special.includes("Want to learn about community resources available to everyone"),
        enrolledPrograms: enrolled,
      };
    };

    const checkPath = (path, profile) => {
      if (path.household_size !== undefined && profile.householdSize !== path.household_size) return null;
      if (path.income_limit != null && profile.income > path.income_limit) return null;
      if (path.income_minimum != null && profile.income < path.income_minimum) return null;
      if (path.age_min !== undefined || path.age_max !== undefined) {
        if (!ageQualifies(profile.ages, path.age_min ?? 0, path.age_max ?? 150)) return null;
      }
      if (path.unemployed && !profile.unemployed) return null;
      if (path['part-time'] && !profile.partTime) return null;
      if (path.retired && !profile.retired) return null;
      if (path.student && !profile.student) return null;
      if (path.disabled && !profile.disabled) return null;
      if (path.pregnant && !profile.pregnant) return null;
      if (path.veteran_military && !profile.veteran) return null;
      if (path.foster_care && !profile.fosterCare) return null;
      if (path.refugee && !profile.refugee) return null;
      if (path.tribal_member && !profile.tribal) return null;
      if (path['domestic violence'] && !profile.domesticViolence) return null;
      if (path.homeowner && !profile.homeowner) return null;
      if (path.landlord && !profile.landlord) return null;
      if (path.homeless && !profile.homeless) return null;
      if (path.legal && !profile.legalHelp) return null;
      if (path['re-entry'] && !profile.reentry) return null;
      if (path.rural && !profile.rural) return null;
      if (path['disaster survivor'] && !profile.disasterSurvivor) return null;
      if (path.provider_search) return 'may';
      if (path.other_eligibility) return 'may';
      if (path.business) return 'may';
      if (path.enrolled_any && path.enrolled_any.length > 0) {
        if (!profile.enrolledPrograms.some(id => path.enrolled_any.includes(id))) return null;
      }
      return path.may_only ? 'may' : 'likely';
    };

    const getProgramTier = (progId, profile) => {
      const paths = ELIGIBILITY[progId];
      if (!paths || paths.length === 0) return null;
      let best = null;
      for (const path of paths) {
        const t = checkPath(path, profile);
        if (t === 'likely') return 'likely';
        if (t === 'may') best = 'may';
      }
      return best;
    };

`;
      html = html.slice(0, startIdx) + newEngine + html.slice(endIdx);
      results['4_ENGINE'] = 'OK';
      console.log(`  [4] Eligibility engine replaced`);
    }
  }
}

// ── Replacement 5: Quiz step definitions ──────────────────────────────────
// quizStepDefs is inside the Quiz component, indented 6 spaces (inside a function).
// It starts with "      const quizStepDefs = [" and ends with "\n      ];"
{
  const startMarker = '      const quizStepDefs = [';
  const endMarker = '\n      ];';

  const startIdx = html.indexOf(startMarker);
  if (startIdx === -1) {
    results['5_QUIZ_STEPS'] = 'FAILED: could not find quizStepDefs start (6-space indent)';
  } else {
    const endIdx = html.indexOf(endMarker, startIdx + startMarker.length);
    if (endIdx === -1) {
      results['5_QUIZ_STEPS'] = 'FAILED: could not find quizStepDefs end ];';
    } else {
      const endOfBlock = endIdx + endMarker.length;
      // Use 6-space indent for const/]; and 8-space for items (matching file style)
      const newQuizSteps = `      const quizStepDefs = [
        { id: "household_size", type: "choice", options: ["1 person","2 people","3 people","4 people","5 people","6 people","7 people"] },
        { id: "age", type: "multi", options: ["Under 6","6\u201313","13\u201317","18","19\u201325","26\u201359","60\u201361","62\u201364","65+"] },
        { id: "annual_income", type: "choice", options: ["Under $20,000","$20,000\u2013$40,000","$40,000\u2013$60,000","$60,000\u2013$80,000","$80,000\u2013$120,000","$120,000\u2013$180,000","Over $180,000"] },
        { id: "employment", type: "multi", options: ["Employed full-time","Employed part-time","Retired","Self-employed","Student","Unable to work (disability/medical)","Unemployed (looking for work)"] },
        { id: "special_status", type: "multi", options: ["Disabled, blind, or have a chronic illness","Disaster survivor","Domestic violence or human trafficking survivor","Homeless","Homeowner","In foster care or extended foster care","Landlord","Live in a rural area","Military (active duty, reserve, national guard), Veteran, Gold Star Family, and Dependents","Need legal assistance","Pregnant or recently pregnant","Reentry","Refugee or recent immigrant","Tribal member","Want to find a healthcare or mental health provider","Want to learn about community resources available to everyone","None of these"] },
        { id: "enrolled_programs", type: "multi", options: ["Cal Fresh / Supplemental Nutrition Assistance Program (SNAP)","CalWORKs / Temporary Assistance for Needy Families (TANF)","California Alternative Rates for Energy (CARE)","California LifeLine","Family Electric Rate Assistance Program (FERA)","Federal Lifeline","Low Income Home Energy Assistance Program (LIHEAP)","Medi-Cal (Medicaid)","Medicare","Public Housing","San Diego County General Relief","Section 8 Housing Choice Voucher","Supplemental Security Income (SSI)","Women, Infants, and Children (WIC)","None of the above"] },
      ];`;
      html = html.slice(0, startIdx) + newQuizSteps + html.slice(endOfBlock);
      results['5_QUIZ_STEPS'] = 'OK';
      console.log(`  [5] quizStepDefs replaced`);
    }
  }
}

// ── Replacement 6: Update CA-24 → CA-024, US-01 → US-001 ──────────────────
// These IDs appear inside the old PROGRAMS, PROGRAM_CRITERIA, and QUALIFY_PATHS blocks
// which have all been replaced with new data. So there may be 0 occurrences remaining.
// Still scan and report.
{
  let caCount = 0;
  let usCount = 0;

  // Replace "CA-24" with "CA-024" (exact quoted string)
  const caOld = '"CA-24"';
  const caNew = '"CA-024"';
  let idx = html.indexOf(caOld);
  while (idx !== -1) {
    html = html.slice(0, idx) + caNew + html.slice(idx + caOld.length);
    caCount++;
    idx = html.indexOf(caOld, idx + caNew.length);
  }

  // Replace "US-01" with "US-001" (exact quoted string)
  const usOld = '"US-01"';
  const usNew = '"US-001"';
  idx = html.indexOf(usOld);
  while (idx !== -1) {
    html = html.slice(0, idx) + usNew + html.slice(idx + usOld.length);
    usCount++;
    idx = html.indexOf(usOld, idx + usNew.length);
  }

  results['6_IDS'] = `OK (CA-24 replaced ${caCount} times, US-01 replaced ${usCount} times)`;
  console.log(`  [6] ID replacements: "CA-24"\u2192"CA-024" x${caCount}, "US-01"\u2192"US-001" x${usCount}`);
}

// ── Replacement 7: Update program count 165 → 530 ─────────────────────────
// Replace specific UI strings in order from most specific to least specific
// to avoid double-replacement. Use exact strings as they appear in the file.
{
  // Process in order of specificity (longer strings first to avoid double-replacement)
  const replacements = [
    // English exact strings
    ['Browse all 165 programs', 'Browse all 530 programs'],
    ['165 assistance programs', '530 assistance programs'],
    ['All 165 programs', 'All 530 programs'],
    // Spanish
    ['Ver los 165 programas', 'Ver los 530 programas'],
    ['165 programas de asistencia', '530 programas de asistencia'],
    // Vietnamese
    ['Xem t\u1ea5t c\u1ea3 165 ch\u01b0\u01a1ng tr\u00ecnh', 'Xem t\u1ea5t c\u1ea3 530 ch\u01b0\u01a1ng tr\u00ecnh'],
    ['165 ch\u01b0\u01a1ng tr\u00ecnh h\u1ed7 tr\u1ee3', '530 ch\u01b0\u01a1ng tr\u00ecnh h\u1ed7 tr\u1ee3'],
    // Meta/title: "165 Programs" (capital P)
    ['165 Programs', '530 Programs'],
    // After all more-specific replacements, do the generic ones
    ['165 programs', '530 programs'],
    ['165 programas', '530 programas'],
    ['165 ch\u01b0\u01a1ng tr\u00ecnh', '530 ch\u01b0\u01a1ng tr\u00ecnh'],
  ];

  let totalCount = 0;
  for (const [from, to] of replacements) {
    let count = 0;
    let idx = html.indexOf(from);
    while (idx !== -1) {
      html = html.slice(0, idx) + to + html.slice(idx + from.length);
      count++;
      idx = html.indexOf(from, idx + to.length);
    }
    if (count > 0) {
      console.log(`  [7]   "${from}" \u2192 "${to}" x${count}`);
      totalCount += count;
    }
  }

  results['7_COUNT'] = `OK (${totalCount} replacements made)`;
  console.log(`  [7] Program count updates: ${totalCount} total replacements`);
}

// ── Replacement 8: Add employment to CATEGORY_LABELS ──────────────────────
// CATEGORY_LABELS ends with: education: 'Education',\n    };
// We want to insert employment before the closing };
{
  // Find CATEGORY_LABELS const declaration
  const catStart = html.indexOf("    const CATEGORY_LABELS = {");
  if (catStart === -1) {
    results['8_CATEGORY_LABELS'] = 'FAILED: CATEGORY_LABELS not found';
  } else {
    // Check if employment is already there
    const catEnd = html.indexOf('\n    };', catStart);
    if (catEnd === -1) {
      results['8_CATEGORY_LABELS'] = 'FAILED: could not find closing }; of CATEGORY_LABELS';
    } else {
      const catBlock = html.slice(catStart, catEnd + 7); // include \n    };
      if (catBlock.includes("employment")) {
        results['8_CATEGORY_LABELS'] = 'SKIPPED: employment already present';
        console.log(`  [8] CATEGORY_LABELS already has employment entry`);
      } else {
        // Insert before the closing \n    };
        // The last line before }; ends with something like "education: 'Education',"
        // Insert a new line before \n    };
        const insertAt = catEnd;
        html = html.slice(0, insertAt) + `\n      employment: 'Employment',` + html.slice(insertAt);
        results['8_CATEGORY_LABELS'] = 'OK';
        console.log(`  [8] CATEGORY_LABELS updated with employment entry`);
      }
    }
  }
}

// ── Write result ───────────────────────────────────────────────────────────
fs.writeFileSync(TARGET, html, 'utf8');
const sizeAfter = Buffer.byteLength(html, 'utf8');

console.log('\n\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550');
console.log(`File size before: ${sizeBefore} bytes`);
console.log(`File size after:  ${sizeAfter} bytes`);
console.log(`Delta:            ${sizeAfter - sizeBefore > 0 ? '+' : ''}${sizeAfter - sizeBefore} bytes`);
console.log(`Lines after:      ${html.split('\n').length}`);
console.log('\nReplacement results:');
for (const [key, val] of Object.entries(results)) {
  const status = val.startsWith('OK') ? '\u2713' : val.startsWith('SKIP') ? '\u25cb' : '\u2717';
  console.log(`  ${status} ${key}: ${val}`);
}

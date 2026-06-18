import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const INPUT_PATH    = '/Users/matt/Downloads/programs.json';
const OUT_DIR       = __dirname;
const OUT_PROGRAMS  = path.join(OUT_DIR, 'out_programs.js');
const OUT_CRITERIA  = path.join(OUT_DIR, 'out_criteria.js');

// ---------------------------------------------------------------------------
// Category → icon mapping
// ---------------------------------------------------------------------------
const ICON_MAP = {
  'food':               'leaf',
  'housing':            'home',
  'healthcare':         'heart',
  'mental healthcare':  'heart',
  'health necessities': 'heart',
  'day care':           'heart',
  'caretaker':          'heart',
  'income':             'dollar',
  'employment':         'dollar',
  'taxes':              'file',
  'legal':              'file',
  'utility':            'spark',
  'transportation':     'spark',
  'entertainment':      'spark',
  'technology':         'spark',
  'education':          'spark',
};

function iconForCategory(cat) {
  return ICON_MAP[cat] || 'spark';
}

// ---------------------------------------------------------------------------
// Safe JS string: JSON.stringify produces a valid JS double-quoted string
// with all control chars and special chars properly escaped.
// ---------------------------------------------------------------------------
function jsString(str) {
  if (str === null || str === undefined) return '""';
  return JSON.stringify(String(str));
}

// ---------------------------------------------------------------------------
// Load input
// ---------------------------------------------------------------------------
const raw  = fs.readFileSync(INPUT_PATH, 'utf8');
const data = JSON.parse(raw);

const allPrograms    = data.PROGRAMS;    // { [id]: { id, name, description, categories, county_any, url, ... } }
const allEligibility = data.ELIGIBILITY; // { [id]: [ { household_size, income_limit, ... }, ... ] }

// ---------------------------------------------------------------------------
// Filter programs: include county_any === null OR county_any includes "CA37"
// ---------------------------------------------------------------------------
const skipped     = [];
const filteredIds = [];

for (const [id, prog] of Object.entries(allPrograms)) {
  const countyAny = prog.county_any;
  const passesCounty =
    countyAny === null ||
    (Array.isArray(countyAny) && countyAny.includes('CA37'));

  if (!passesCounty) {
    continue; // excluded by county filter — not an error
  }

  // Validate required fields
  if (!prog.name) {
    skipped.push({ id, reason: 'missing name' });
    continue;
  }
  if (!prog.categories || prog.categories.length === 0) {
    skipped.push({ id, reason: 'missing categories' });
    continue;
  }
  if (!prog.url) {
    skipped.push({ id, reason: 'missing url' });
    continue;
  }

  filteredIds.push(id);
}

// ---------------------------------------------------------------------------
// Build PROGRAMS output
// ---------------------------------------------------------------------------
const programLines = filteredIds.map((id) => {
  const prog     = allPrograms[id];
  const category = prog.categories[0];
  const icon     = iconForCategory(category);

  return (
    `  ${jsString(id)}: { ` +
    `id: ${jsString(id)}, ` +
    `name: ${jsString(prog.name)}, ` +
    `description: ${jsString(prog.description)}, ` +
    `category: ${jsString(category)}, ` +
    `icon: ${jsString(icon)}, ` +
    `link: ${jsString(prog.url)} ` +
    `}`
  );
});

const programsOutput =
  'const PROGRAMS = {\n' +
  programLines.join(',\n') +
  '\n};\n';

// ---------------------------------------------------------------------------
// Build PROGRAM_CRITERIA output
// ---------------------------------------------------------------------------
const criteriaLines = filteredIds.map((id) => {
  const entries = allEligibility[id] || [];

  // Keep only entries that have both household_size and income_limit
  const sized = entries.filter(
    (e) => e.household_size != null && e.income_limit != null
  );

  if (sized.length === 0) {
    return `  ${jsString(id)}: {}`;
  }

  // Inner object: { householdSize: [{ incomeLimit: N }], ... }
  const innerLines = sized.map((e) => {
    const hh    = e.household_size;
    const limit = Math.round(e.income_limit); // source uses floats
    return `    ${hh}: [{ incomeLimit: ${limit} }]`;
  });

  return (
    `  ${jsString(id)}: {\n` +
    innerLines.join(',\n') +
    '\n  }'
  );
});

const criteriaOutput =
  'const PROGRAM_CRITERIA = {\n' +
  criteriaLines.join(',\n') +
  '\n};\n';

// ---------------------------------------------------------------------------
// Write outputs
// ---------------------------------------------------------------------------
fs.writeFileSync(OUT_PROGRAMS, programsOutput, 'utf8');
fs.writeFileSync(OUT_CRITERIA, criteriaOutput, 'utf8');

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------
const programsSize = fs.statSync(OUT_PROGRAMS).size;
const criteriaSize = fs.statSync(OUT_CRITERIA).size;

console.log('=== gen_programs.js report ===');
console.log(`Input programs total:     ${Object.keys(allPrograms).length}`);
console.log(`Passed county filter:      ${filteredIds.length}`);
console.log(`Skipped (field errors):    ${skipped.length}`);
if (skipped.length > 0) {
  skipped.forEach(({ id, reason }) => console.log(`  - ${id}: ${reason}`));
}
console.log(`out_programs.js size:      ${programsSize} bytes`);
console.log(`out_criteria.js size:      ${criteriaSize} bytes`);
console.log('Done.');

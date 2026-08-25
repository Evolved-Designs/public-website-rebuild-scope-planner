export const decisions = Object.freeze([
  ['content', 'Document the content inventory, owners, archive rules, and migration exceptions.'],
  ['journeys', 'Name the highest-value public journeys and the task each visitor must complete.'],
  ['accessibility', 'Define the accessibility target, test methods, evidence, and correction process.'],
  ['integrations', 'Map each portal, map, form, calendar, embed, authentication path, and data owner.'],
  ['migration', 'Specify URL migration, redirects, document treatment, and historical-content rules.'],
  ['search', 'Define on-site search, analytics events, findability, reporting, and decision owners.'],
  ['security', 'Set hosting, updates, access, privacy, recovery, and incident-response boundaries.'],
  ['governance', 'Assign publishing roles, review rules, training, standards, and change control.'],
  ['acceptance', 'Give each deliverable a reviewer, test, pass condition, and correction window.'],
  ['handoff', 'Connect responsive layouts, component states, editable assets, interaction notes, accessibility behavior, developer questions, and visual QA.'],
  ['care', 'Define cutover, warranty, support, maintenance, service levels, and ownership transfer.']
]);

export function scopeSignal(selected = []) {
  const complete = new Set(selected).size;
  if (complete <= 3) return { band: 'discovery', label: 'Discovery needed', cta: 'Scope a paid discovery phase' };
  if (complete <= 8) return { band: 'definition', label: 'Scope definition', cta: 'Stress-test the rebuild brief' };
  return { band: 'acceptance', label: 'Acceptance planning', cta: 'Compare implementation approaches' };
}

export function firstGap(selected = []) {
  const complete = new Set(selected);
  return decisions.find(([key]) => !complete.has(key))?.[1] ?? 'Keep the decision owners and acceptance evidence current through launch.';
}

export function phaseCopy(selected = []) {
  const signal = scopeSignal(selected);
  if (signal.band === 'discovery') return {
    heading: 'Start with an inventory and decision workshop.',
    summary: 'A vendor cannot responsibly price the unknowns yet. First identify content, journeys, integrations, and decision owners.'
  };
  if (signal.band === 'definition') return {
    heading: 'Turn known requirements into testable work packages.',
    summary: 'The direction is visible. Resolve the remaining ownership and acceptance gaps before comparing fixed scopes or schedules.'
  };
  return {
    heading: 'Build the proposal around evidence and acceptance.',
    summary: 'Most core decisions are owned. Require each proposal to connect deliverables, tests, reviewers, correction windows, and ongoing care.'
  };
}

export function contactUrl(rebuild = 'modernize', selected = []) {
  const valid = ['modernize', 'replace', 'consolidate'].includes(rebuild) ? rebuild : 'modernize';
  const url = new URL('https://evolveddesigns.net/contact-us/');
  url.searchParams.set('utm_source', 'github_pages');
  url.searchParams.set('utm_medium', 'owned_tool');
  url.searchParams.set('utm_campaign', 'rebuild_scope_planner');
  url.searchParams.set('utm_content', `${valid}_${scopeSignal(selected).band}`);
  return url.toString();
}

export function briefText(rebuild = 'modernize', selected = []) {
  const signal = scopeSignal(selected);
  const phase = phaseCopy(selected);
  return `Public website rebuild first-phase brief\n\nChange type: ${rebuild}\nReadiness: ${signal.label} (${new Set(selected).size}/11 decisions owned)\nFirst phase: ${phase.heading}\nWhy: ${phase.summary}\nFirst missing control: ${firstGap(selected)}\n\nThis is a scope signal, not a price estimate.`;
}

function init() {
  const form = document.querySelector('[data-planner]');
  if (!form) return;
  const boxes = [...form.querySelectorAll('input[type="checkbox"]')];
  const types = [...form.querySelectorAll('input[name="rebuild"]')];
  const score = document.querySelector('[data-score]');
  const band = document.querySelector('[data-band]');
  const phase = document.querySelector('[data-phase]');
  const summary = document.querySelector('[data-summary]');
  const gap = document.querySelector('[data-gap]');
  const contact = document.querySelector('[data-contact]');
  const copy = document.querySelector('[data-copy]');

  const selected = () => boxes.filter((box) => box.checked).map((box) => box.value);
  const rebuild = () => types.find((type) => type.checked)?.value ?? 'modernize';

  function render() {
    const values = selected();
    const signal = scopeSignal(values);
    const copyForPhase = phaseCopy(values);
    score.textContent = `${new Set(values).size}/11`;
    band.textContent = signal.label;
    phase.textContent = copyForPhase.heading;
    summary.textContent = copyForPhase.summary;
    gap.textContent = firstGap(values);
    contact.textContent = signal.cta;
    contact.href = contactUrl(rebuild(), values);
  }

  async function copyBrief() {
    await navigator.clipboard.writeText(briefText(rebuild(), selected()));
    copy.textContent = 'Brief copied';
    window.setTimeout(() => { copy.textContent = 'Copy first-phase brief'; }, 1800);
  }

  [...boxes, ...types].forEach((control) => control.addEventListener('change', render));
  copy.addEventListener('click', () => copyBrief().catch(() => { copy.textContent = 'Copy unavailable'; }));
  render();
}

if (typeof document !== 'undefined') init();

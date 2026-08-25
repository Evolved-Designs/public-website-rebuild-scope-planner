import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { briefText, contactUrl, decisions, firstGap, phaseCopy, scopeSignal } from '../app.js';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const css = await readFile(new URL('../styles.css', import.meta.url), 'utf8');

assert.equal(decisions.length, 10);
assert.equal(scopeSignal([]).band, 'discovery');
assert.equal(scopeSignal(decisions.slice(0, 5).map(([key]) => key)).band, 'definition');
assert.equal(scopeSignal(decisions.map(([key]) => key)).band, 'acceptance');
assert.match(firstGap(['content']), /highest-value public journeys/);
assert.match(phaseCopy([]).heading, /inventory/);
assert.match(contactUrl('replace', []), /replace_discovery/);
assert.doesNotMatch(contactUrl('replace', ['security']), /security/);
assert.match(briefText('consolidate', []), /not a price estimate/);
assert.equal((html.match(/<link rel="canonical"/g) ?? []).length, 1);
assert.equal((html.match(/type="radio"/g) ?? []).length, 3);
assert.equal((html.match(/type="checkbox"/g) ?? []).length, 10);
assert.match(html, /WCAG 2\.2 AA/);
assert.match(html, /section508\.gov\/buy/);
assert.match(html, /OWASA RFP 27-001/);
assert.match(html, /Selections stay in this browser/);
assert.match(html, /web-development\/\?utm_source=github_pages/);
assert.match(html, /service_path#web-development-services/);
assert.doesNotMatch(html + css, /clarity\.ms|Microsoft Clarity/i);
assert.match(css, /prefers-reduced-motion/);

const structured = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
assert.ok(structured);
assert.deepEqual(JSON.parse(structured[1])['@graph'].map((item) => item['@type']), ['WebApplication', 'FAQPage']);
console.log('Public website rebuild scope planner checks passed.');

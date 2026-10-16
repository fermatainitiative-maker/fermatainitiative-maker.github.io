import assert from 'node:assert/strict';
import { test } from 'node:test';
import { analyticsEnabled, createAnalytics, safePage, safeReferrer } from '../src/analytics.ts';

test('analytics defaults on without a popup, but respects an existing opt-out', () => {
  assert.equal(analyticsEnabled(null), true);
  assert.equal(analyticsEnabled('accepted'), true);
  assert.equal(analyticsEnabled('declined'), false);
});

function setup(hostname = 'fermatainitiative.org') {
  const calls: unknown[][] = [];
  let loads = 0;
  let disabled = true;
  const tracker = createAnalytics({ hostname, referrer: 'https://example.org/private?email=private@example.org', command: (...args) => calls.push(args), load: () => loads++, disable: value => { disabled = value; } });
  const events = (name: string) => calls.filter(c => c[0] === 'event' && c[1] === name);
  return { tracker, calls, events, get loads() { return loads; }, get disabled() { return disabled; } };
}

test('no tag or events before acceptance, after decline, or on previews', () => {
  for (const hostname of ['fermatainitiative.org', 'localhost']) {
    const s = setup(hostname);
    s.tracker.page('https://fermatainitiative.org/', 'Home');
    s.tracker.lead({ ok: true, success: true }, 'host', {});
    assert.equal(s.loads, 0);
    assert.equal(s.calls.length, 0);
    s.tracker.setConsent(false);
    s.tracker.page('https://fermatainitiative.org/about', 'About');
    assert.equal(s.loads, 0);
    if (hostname === 'localhost') { s.tracker.setConsent(true); assert.equal(s.loads, 0); assert.equal(s.calls.length, 0); }
  }
});
test('one pageview on acceptance; StrictMode, hashes, and interest queries do not duplicate it', () => {
  const s = setup();
  s.tracker.page('https://fermatainitiative.org/contact?interest=host', 'Contact');
  s.tracker.setConsent(true);
  s.tracker.setConsent(true);
  s.tracker.page('https://fermatainitiative.org/contact#main', 'Contact');
  assert.equal(s.loads, 1);
  assert.equal(s.events('page_view').length, 1);
  s.tracker.page('https://fermatainitiative.org/music', 'Music');
  assert.equal(s.events('page_view').length, 2);
  assert.equal((s.events('page_view')[1][2] as Record<string, string>).page_referrer, 'https://fermatainitiative.org/contact');
});
test('conversion requires confirmed success and is deduplicated per submission', () => {
  const s = setup();
  s.tracker.setConsent(true);
  s.tracker.page('https://fermatainitiative.org/contact', 'Contact');
  const submission = {};
  s.tracker.lead({ ok: false, success: true }, 'host', submission);
  s.tracker.lead({ ok: true, success: false }, 'host', submission);
  s.tracker.lead({ ok: true, success: 'true' }, 'host', submission);
  assert.equal(s.events('generate_lead').length, 0);
  s.tracker.lead({ ok: true, success: true }, 'host', submission);
  s.tracker.lead({ ok: true, success: true }, 'host', submission);
  s.tracker.page('https://fermatainitiative.org/thank-you', 'Thank you');
  s.tracker.page('https://fermatainitiative.org/thank-you', 'Thank you');
  assert.deepEqual(s.events('generate_lead'), [['event', 'generate_lead', { form_id: 'contact', lead_type: 'host', lead_source: 'website' }]]);
});
test('withdrawal stops events and a new acceptance does not reload the tag', () => {
  const s = setup();
  s.tracker.setConsent(true); s.tracker.page('https://fermatainitiative.org/', 'Home');
  s.tracker.setConsent(false);
  s.tracker.lead({ ok: true, success: true }, 'host', {});
  s.tracker.video('3oLMtCtvWl8');
  s.tracker.page('https://fermatainitiative.org/music', 'Music');
  assert.equal(s.disabled, true);
  assert.equal(s.events('page_view').length, 1);
  assert.equal(s.events('generate_lead').length, 0);
  assert.equal(s.events('select_content').length, 0);
  s.tracker.setConsent(true);
  assert.equal(s.disabled, false);
  assert.equal(s.loads, 1);
  assert.equal(s.events('page_view').length, 2);
});
test('URLs, referrers and event parameters never include arbitrary enquiry data', () => {
  assert.equal(safePage('https://fermatainitiative.org/contact?email=private@example.org&utm_source=newsletter#private'), 'https://fermatainitiative.org/contact?utm_source=newsletter');
  assert.equal(safePage('https://fermatainitiative.org/private@example.org?utm_term=private@example.org'), 'https://fermatainitiative.org/not-found');
  assert.equal(safeReferrer('https://example.org/private?email=private@example.org'), 'https://example.org/');
  assert.equal(safeReferrer('javascript:alert(1)'), '');
  const s = setup(); s.tracker.setConsent(true); s.tracker.page('https://fermatainitiative.org/', 'Home');
  s.tracker.lead({ ok: true, success: true }, 'private@example.org', {});
  assert.equal((s.events('generate_lead')[0][2] as Record<string, string>).lead_type, 'general');
  assert.ok(!JSON.stringify(s.calls).includes('private@example.org'));
});

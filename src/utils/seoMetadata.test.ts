import test from 'node:test';
import assert from 'node:assert/strict';
import {
  clampMetaDescription,
  formatSeoTitle,
  resolveOgType,
  SITE_OWNER,
} from './seoMetadata';

test('formatSeoTitle keeps concise titles intact and appends owner cleanly', () => {
  assert.equal(
    formatSeoTitle('Research & Academic Profile'),
    `Research & Academic Profile — ${SITE_OWNER}`,
  );
  assert.equal(
    formatSeoTitle(`${SITE_OWNER} — Engineering & Research`),
    `${SITE_OWNER} — Engineering & Research`,
  );
});

test('formatSeoTitle keeps long dynamic study/project titles under maxLength', () => {
  const longStudyTitle =
    'Decision-Aware Maintenance Prognostics: Coupling Remaining Useful Life Uncertainty with Cost-Optimal Scheduling';
  const result = formatSeoTitle(longStudyTitle);
  assert.ok(result.length <= 66, `Expected <= 66 chars, got ${result.length}: ${result}`);
  assert.ok(result.includes('Ibtashamur Rahman'));
});

test('clampMetaDescription keeps descriptions concise within search snippet bounds', () => {
  const short = 'Industrial & Production Engineering undergraduate portfolio at SUST.';
  assert.equal(clampMetaDescription(short), short);

  const long =
    'This is an extended research abstract describing multi-regime NASA C-MAPSS turbofan engine prognostics, interval calibration, sensor selection optimization, and downstream preventive maintenance scheduling trade-offs.';
  const clamped = clampMetaDescription(long);
  assert.ok(clamped.length <= 158, `Expected <= 158 chars, got ${clamped.length}`);
  assert.ok(clamped.endsWith('.'));
});

test('resolveOgType maps schema types to semantic OpenGraph types', () => {
  assert.equal(resolveOgType('Person'), 'profile');
  assert.equal(resolveOgType('ScholarlyArticle'), 'article');
  assert.equal(resolveOgType('WebApplication'), 'website');
  assert.equal(resolveOgType('CollectionPage'), 'website');
});

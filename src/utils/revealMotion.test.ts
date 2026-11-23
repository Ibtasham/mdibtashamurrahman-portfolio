import test from 'node:test';
import assert from 'node:assert/strict';
import { getRevealDelayMs, shouldImmediatelyReveal } from './revealMotion';

test('getRevealDelayMs calculates bounded stagger delays cleanly', () => {
  assert.equal(getRevealDelayMs(-2), 0);
  assert.equal(getRevealDelayMs(0), 0);
  assert.equal(getRevealDelayMs(1), 70);
  assert.equal(getRevealDelayMs(3), 210);
  assert.equal(getRevealDelayMs(8), 280);
  assert.equal(getRevealDelayMs(2, 90, 200), 180);
  assert.equal(getRevealDelayMs(5, 90, 200), 200);
});

test('shouldImmediatelyReveal honors reduced motion and missing IntersectionObserver fallback', () => {
  assert.equal(
    shouldImmediatelyReveal({
      prefersReducedMotion: true,
      hasIntersectionObserver: true,
    }),
    true,
  );
  assert.equal(
    shouldImmediatelyReveal({
      prefersReducedMotion: false,
      hasIntersectionObserver: false,
    }),
    true,
  );
  assert.equal(
    shouldImmediatelyReveal({
      prefersReducedMotion: false,
      hasIntersectionObserver: true,
    }),
    false,
  );
});

export interface ImmediateRevealInput {
  prefersReducedMotion: boolean;
  hasIntersectionObserver: boolean;
}

export function getRevealDelayMs(
  index: number,
  stepMs = 70,
  maxDelayMs = 280,
): number {
  if (!Number.isFinite(index) || index <= 0) return 0;
  return Math.min(maxDelayMs, Math.trunc(index) * Math.max(0, stepMs));
}

export function shouldImmediatelyReveal({
  prefersReducedMotion,
  hasIntersectionObserver,
}: ImmediateRevealInput): boolean {
  return prefersReducedMotion || !hasIntersectionObserver;
}

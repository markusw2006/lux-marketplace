export function calculatePlatformFeeCents(amountCents: number): number {
  // 15% fee by default
  const pct = 0.15;
  return Math.floor(amountCents * pct);
}



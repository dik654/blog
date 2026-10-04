/** 본문을 위해 만든 가정 모형입니다. Coase 원문의 코드나 실측값이 아닙니다. */
export const INSIDE = [1, 2, 3, 4, 5, 6] as const;
export function coordinationTotal(n: number, outside: number, setup = 0) {
  return INSIDE.slice(0, n).reduce((sum, cost) => sum + cost, 0)
    + (INSIDE.length - n) * outside + (n > 0 ? setup : 0);
}
export function choices(outside: number, setup = 0) {
  const totals = Array.from({ length: INSIDE.length + 1 }, (_, n) => coordinationTotal(n, outside, setup));
  const minimum = Math.min(...totals);
  return { totals, minimum, minimizers: totals.flatMap((cost, n) => cost === minimum ? [n] : []) };
}

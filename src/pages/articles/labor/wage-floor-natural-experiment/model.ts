/** 설명용 연속 노동시간 모형. 실제 1992년 자료를 맞춘 추정식이 아닙니다. */
export const benefit = (hours: number) => 13 * hours - hours ** 2 / 2;
export const requiredWage = (hours: number) => hours + 3;
export const wageBill = (hours: number, floor = 0) => hours * Math.max(floor, requiredWage(hours));
export const laborPlan = (hours: number, floor = 0) => ({
  hours, wage: Math.max(floor, requiredWage(hours)), revenue: benefit(hours),
  cost: wageBill(hours, floor), profit: benefit(hours) - wageBill(hours, floor),
});
/** F≥0, 0≤n≤13인 이 글의 가정에만 적용합니다. */
export function monopsonyHours(floor: number): number {
  if (floor <= 19 / 3) return 10 / 3;
  if (floor <= 8) return floor - 3;
  return Math.max(13 - floor, 0);
}
export const competitiveHours = (floor: number) => floor <= 8 ? 5 : Math.max(13 - floor, 0);
/** 별도의 정수 사례: k번째 단위의 수입이 13−k일 때의 합입니다. */
export const integerBenefit = (units: number) => 12.5 * units - units ** 2 / 2;
export function integerMaxima(floor: number, wageTaking = false): number[] {
  const plans = Array.from({ length: 14 }, (_, units) => ({ units, profit: integerBenefit(units) - (wageTaking ? units * floor : wageBill(units, floor)) }));
  const best = Math.max(...plans.map(p => p.profit));
  return plans.filter(p => Math.abs(p.profit - best) < 1e-10).map(p => p.units);
}
export const numberLabel = (n: number) => Number(n.toFixed(4)).toString();

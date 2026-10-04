/** 같은 부품·같은 기간·가동 여력 아래의 설명용 비용 모형. 실제 원문의 수치가 아닙니다. */
export const METHODS = [
  { id: "A", label: "바로 가공", setup: 0, unit: 10 },
  { id: "B", label: "기본 설비", setup: 60, unit: 4 },
  { id: "C", label: "전용 설비", setup: 300, unit: 1 },
] as const;
export function methodCosts(quantity: number) {
  const rows = METHODS.map(m => ({ ...m, total: m.setup + m.unit * quantity, average: m.setup / quantity + m.unit }));
  const minimum = Math.min(...rows.map(m => m.total));
  return { quantity, rows, minimum, minimizers: rows.filter(m => m.total === minimum).map(m => m.id) };
}

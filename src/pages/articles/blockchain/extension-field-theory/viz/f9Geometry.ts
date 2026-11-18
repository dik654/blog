/**
 * 본문 대응: F₉ = {a+bu : a,b ∈ F₃}의 아홉 원소를 3×3 칸에 놓는 공통 좌표.
 * 가로 열 = 상수 계수 a(0·1·2), 세로 행 = u의 계수 b(0·1·2). 배치는 설명용입니다.
 */
export const BOARD_W = 360;
export const BOARD_H = 212;
export const GRID_X = 48;
export const GRID_Y = 30;
export const CELL_W = 96;
export const CELL_H = 58;
export const CELL_INSET = 7;

export const cellX = (a: number) => GRID_X + a * CELL_W + CELL_INSET;
export const cellY = (b: number) => GRID_Y + b * CELL_H + CELL_INSET;
export const centerX = (a: number) => GRID_X + a * CELL_W + CELL_W / 2;
export const centerY = (b: number) => GRID_Y + b * CELL_H + CELL_H / 2;

/** [a,b]를 본문 표기 a+bu로 적습니다. */
export function elementName(a: number, b: number): string {
  if (b === 0) return String(a);
  const ub = b === 1 ? "u" : "2u";
  return a === 0 ? ub : `${a}+${ub}`;
}

/** u²=β일 때 (a+bu)(c+du) = (ac+βbd) + (ad+bc)u, 계수는 mod 3. */
export function mulF3(x: readonly [number, number], y: readonly [number, number], beta: number): [number, number] {
  return [(x[0] * y[0] + beta * x[1] * y[1]) % 3, (x[0] * y[1] + x[1] * y[0]) % 3];
}

export const ALL_CELLS: readonly (readonly [number, number])[] = [0, 1, 2].flatMap((b) => [0, 1, 2].map((a) => [a, b] as const));

export const STEPS = [
  { label: '-log(x) 곡선: 확률이 낮을수록 손실 급증' },
  { label: '현재 모델: y_파리=0.09 → L = -log(0.09) = 2.41' },
  { label: '완벽한 모델: y_파리=1.0 → L = -log(1.0) = 0' },
];

/* -log(x) curve points, x from 0.02 to 1.0 */
export const CURVE: [number, number][] = [
  [0.02, 3.91], [0.05, 3.0], [0.09, 2.41], [0.15, 1.9],
  [0.25, 1.39], [0.4, 0.92], [0.55, 0.6], [0.7, 0.36],
  [0.85, 0.16], [1.0, 0.0],
];

export const toSvg = (p: [number, number]) => ({
  x: 80 + p[0] * 260,
  y: 20 + (1 - p[1] / 4.2) * 100,
});

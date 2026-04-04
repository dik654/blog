export const STEPS = [
  { label: 'MSE 손실 곡선 (정답=1)', body: 'L = (1 - ŷ)² — 예측이 0에 가까울 때 기울기가 작아 학습 느림' },
  { label: 'CE 손실 곡선 (정답=1)', body: 'L = -log(ŷ) — 예측이 0에 가까울 때 기울기가 급격히 커서 빠른 수렴' },
  { label: '기울기 비교', body: 'CE는 틀릴수록 강한 교정 신호 / MSE는 포화 구간에서 학습 정체' },
];

export const MSE_C = '#f59e0b', CE_C = '#6366f1', GRAD_C = '#10b981';

const N = 40;
export const msePts: [number, number][] = [];
export const cePts: [number, number][] = [];
for (let i = 0; i <= N; i++) {
  const y = 0.02 + (i / N) * 0.96;
  msePts.push([y, (1 - y) ** 2]);
  cePts.push([y, Math.min(-Math.log(y), 4) / 4]);
}

export function curvePath(
  pts: [number, number][], ox: number, oy: number, w: number, h: number,
) {
  return pts.map(([x, v], i) => {
    const px = ox + x * w;
    const py = oy + h - v * h;
    return `${i === 0 ? 'M' : 'L'}${px.toFixed(1)},${py.toFixed(1)}`;
  }).join(' ');
}

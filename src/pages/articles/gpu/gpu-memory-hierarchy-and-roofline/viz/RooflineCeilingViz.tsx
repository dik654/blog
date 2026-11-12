import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — 가정한 두 상한(1TB/s, 1TFLOP/s)으로 그린 roofline.
 * 64 FLOP ÷ 768B = 1/12 FLOP/B → 10¹² B/s × 1/12 = 약 83.3GFLOP/s.
 * 두 상한이 만나는 점: 1TFLOP/s ÷ 1TB/s = 1 FLOP/B.
 * 가로·세로 모두 로그 눈금이며 눈금 한 칸이 4배다.
 */
const BW = 1000; // GB/s, 가정
const PEAK = 1000; // GFLOP/s, 가정
const AI = 1 / 12;
const ATTAIN = BW * AI;

const W = 400;
const H = 236;
const PL = 50;
const PR = 10;
const PT = 18;
const PB = 40;
const X_MIN = -5; // log2(1/32)
const X_MAX = 5; // log2(32)
const Y_MIN = Math.log2(PEAK / 32);
const Y_MAX = Math.log2(PEAK * 2);

const sx = (ai: number) => PL + ((Math.log2(ai) - X_MIN) / (X_MAX - X_MIN)) * (W - PL - PR);
const sy = (g: number) => H - PB - ((Math.log2(g) - Y_MIN) / (Y_MAX - Y_MIN)) * (H - PT - PB);

const X_TICKS: readonly (readonly [number, string])[] = [
  [1 / 16, "1/16"],
  [1 / 4, "1/4"],
  [1, "1"],
  [4, "4"],
  [16, "16"],
];
const Y_TICKS: readonly (readonly [number, string])[] = [
  [62.5, "62.5G"],
  [250, "250G"],
  [1000, "1T"],
];

const BAND = "#2563eb";
const ROOF = "#475569";
const POINT = "#d97706";
const GRID = "#e2e8f0";
const TEXT = "#64748b";

const SCENES = [
  { label: "두 상한", summary: "경사선 1TB/s · 수평선 1TFLOP/s", note: "파란 경사선은 대역폭 상한입니다. 바이트마다 하는 계산이 많을수록 같은 1TB/s로 낼 수 있는 계산 속도가 비례해 오릅니다. 회색 수평선은 계산 상한 1TFLOP/s입니다. 둘 다 연습용 가정이며 실제 GPU 사양이 아닙니다." },
  { label: "64개 덧셈의 자리", summary: "1/12 FLOP/B → 약 83.3GFLOP/s", note: "연산 강도 1/12에서 위로 올라가면 먼저 파란 경사선에 닿습니다. 10¹² byte/s × 1/12 FLOP/byte = 약 83.3GFLOP/s로 1TFLOP/s보다 낮으므로, 이상적인 정상 상태에서는 이동이 먼저 제한합니다." },
  { label: "두 상한이 만나는 점", summary: "1TFLOP/s ÷ 1TB/s = 1 FLOP/B", note: "두 선이 만나는 연산 강도 1 FLOP/B를 ridge point라고 부릅니다. 이 점보다 왼쪽에서는 경사선이, 오른쪽에서는 수평선이 더 낮은 상한입니다." },
  { label: "점이 움직이는 방향", summary: "byte↑ 왼쪽 · cache 재사용 오른쪽", note: "같은 경계의 실제 byte가 늘면 연산 강도가 줄어 점이 왼쪽으로 갑니다. Cache 재사용으로 HBM byte가 줄면 HBM 기준 연산 강도는 오른쪽으로 이동할 수 있습니다. 화살표는 방향만 보이며 이동 거리는 정하지 않았습니다." },
] as const;

export default function RooflineCeilingViz() {
  return (
    <SceneShell
      eyebrow="Roofline · 가정한 두 상한"
      title="1/12 FLOP/B에서는 대역폭 경사선이 계산 상한보다 먼저 막습니다"
      description="가로는 연산 강도(옮긴 바이트 1개당 계산 횟수, FLOP/B), 세로는 도달 가능한 계산 속도(FLOP/s)입니다. 두 축 모두 눈금 한 칸이 4배인 로그 눈금입니다. 두 상한 중 낮은 쪽이 그 연산 강도의 상한입니다."
      note="83.3GFLOP/s는 포화된 장치의 처리량 상한입니다. 64개만 제출한 실제 kernel이 그 속도로 끝난다는 예측은 아니며, 요청 시작과 메모리 응답을 기다리는 시간이 남습니다."
      ariaLabel="가정한 대역폭 상한과 계산 상한으로 그린 roofline에서 연산 강도 1/12의 상한과 ridge point"
      scenes={SCENES}
      render={(active) => {
        const xRidge = sx(PEAK / BW);
        const yPeak = sy(PEAK);
        const px = sx(AI);
        const py = sy(ATTAIN);
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {X_TICKS.map(([v, label]) => (
              <g key={label}>
                <line x1={sx(v)} x2={sx(v)} y1={PT} y2={H - PB} stroke={GRID} strokeWidth={1} />
                <text x={sx(v)} y={H - PB + 14} textAnchor="middle" fontSize={11} fill={TEXT}>{label}</text>
              </g>
            ))}
            {Y_TICKS.map(([v, label]) => (
              <g key={label}>
                <line x1={PL} x2={W - PR} y1={sy(v)} y2={sy(v)} stroke={GRID} strokeWidth={1} />
                <text x={PL - 6} y={sy(v) + 3.5} textAnchor="end" fontSize={11} fill={TEXT}>{label}</text>
              </g>
            ))}
            <text x={(PL + W - PR) / 2} y={H - 6} textAnchor="middle" fontSize={11} fill={TEXT}>연산 강도 (FLOP/B)</text>
            <text x={12} y={PT + 4} fontSize={11} fill={TEXT}>FLOP/s</text>
            <line x1={PL} x2={W - PR} y1={H - PB} y2={H - PB} stroke="#94a3b8" strokeWidth={1} />

            <line x1={sx(1 / 32)} y1={sy(BW / 32)} x2={xRidge} y2={yPeak} stroke={BAND} strokeWidth={1.25} />
            <line x1={xRidge} y1={yPeak} x2={sx(32)} y2={sy(BW * 32)} stroke={BAND} strokeWidth={1} strokeDasharray="3 3" opacity={0.6} />
            <line x1={sx(1 / 32)} y1={yPeak} x2={xRidge} y2={yPeak} stroke={ROOF} strokeWidth={1} strokeDasharray="3 3" opacity={0.6} />
            <line x1={xRidge} y1={yPeak} x2={W - PR} y2={yPeak} stroke={ROOF} strokeWidth={1.25} />
            <text x={sx(1 / 4) - 4} y={sy(BW / 4) - 6} textAnchor="end" fontSize={11} fontWeight={700} fill={BAND}>1TB/s 상한</text>
            <text x={W - PR} y={yPeak - 7} textAnchor="end" fontSize={11} fontWeight={700} fill={ROOF}>계산 1TFLOP/s</text>

            {active >= 1 && (
              <g>
                <line x1={px} x2={px} y1={H - PB} y2={py} stroke={POINT} strokeWidth={1} strokeDasharray="2 2" />
                <circle cx={px} cy={py} r={4.5} fill={POINT} />
                <text x={px - 8} y={py - 10} textAnchor="end" fontSize={11.5} fontWeight={700} fill={POINT}>1/12 → 약 83.3G</text>
              </g>
            )}
            {active >= 2 && (
              <g>
                <circle cx={xRidge} cy={yPeak} r={4.5} fill="none" stroke={ROOF} strokeWidth={1.25} />
                <text x={xRidge + 8} y={yPeak + 16} fontSize={11.5} fontWeight={700} fill={ROOF}>ridge point 1 FLOP/B</text>
              </g>
            )}
            {active === 3 && (
              <g>
                <line x1={px - 8} y1={py} x2={px - 30} y2={py} stroke={POINT} strokeWidth={1.25} />
                <path d={`M ${px - 30} ${py} l 5 -3.5 v 7 z`} fill={POINT} />
                <text x={px - 34} y={py + 4} textAnchor="end" fontSize={11} fill={POINT}>byte↑</text>
                <line x1={px + 8} y1={py} x2={px + 30} y2={py} stroke={POINT} strokeWidth={1.25} />
                <path d={`M ${px + 30} ${py} l -5 -3.5 v 7 z`} fill={POINT} />
                <text x={px + 34} y={py + 4} fontSize={11} fill={POINT}>cache 재사용(HBM 기준)</text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}

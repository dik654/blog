import SceneShell from "./ArchSceneShell";

/**
 * 본문 대응: #gpu-memory-traffic-hierarchy 아래 식 — 글의 예시 I = 2 FLOP/byte, B_peak = 3 TB/s, P_peak = 60 TFLOP/s.
 * memory 천장 = I × 3 → I = 2에서 6 TFLOP/s. 두 천장이 만나는 I = 60 ÷ 3 = 20 FLOP/byte.
 */
const B_PEAK = 3;
const P_PEAK = 60;
const I_EX = 2;
const RIDGE = P_PEAK / B_PEAK;

const W = 360;
const H = 210;
const L = 44;
const R = 14;
const T = 16;
const BOT = 176;
const X_MAX = 30;
const Y_MAX = 70;
const sx = (i: number) => L + (i / X_MAX) * (W - L - R);
const sy = (p: number) => BOT - (p / Y_MAX) * (BOT - T);

const SCENES = [
  {
    label: "1. Memory 천장",
    summary: "I × 3TB/s → I = 2이면 6TFLOP/s",
    note: "HBM이 1초에 3TB를 옮기고 byte 하나당 2 FLOP을 한다면, 1초에 할 수 있는 연산은 많아야 6TFLOP입니다. Intensity가 커질수록 이 천장은 비스듬히 올라갑니다.",
  },
  {
    label: "2. Compute 천장",
    summary: "P_peak = 60TFLOP/s",
    note: "연산 장치 쪽에도 사양상 상한이 있습니다. 이 천장은 intensity와 무관하게 수평입니다.",
  },
  {
    label: "3. 낮은 쪽이 상한입니다",
    summary: "min(60, 6) = 6TFLOP/s",
    note: "I = 2에서는 memory 천장 6이 compute 천장 60보다 낮아 우선 memory-bound 후보입니다. 두 선은 I = 60 ÷ 3 = 20에서 만납니다. 이 식은 이상적 상한일 뿐 실제 병목을 확정하지 않으며, achieved 값은 profiler로 다시 계산합니다.",
  },
] as const;

export default function RooflineBoundViz() {
  return (
    <SceneShell
      eyebrow="두 천장 중 낮은 쪽"
      title="Byte당 연산이 적으면 memory 천장에 먼저 닿습니다"
      description="가로축 I(arithmetic intensity)는 HBM에서 옮긴 byte 하나당 실행한 FLOP 수, 세로축은 이상적인 처리량 상한입니다. 3TB/s·60TFLOP/s·I = 2는 아래 식의 예시 숫자입니다."
      ariaLabel="I=2 FLOP/byte, 3TB/s, 60TFLOP/s에서 memory 천장과 compute 천장 비교"
      scenes={SCENES}
      render={(active) => {
        const showCompute = active >= 1;
        const both = active >= 2;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-label="처리량 상한 그래프">
            <line x1={L} y1={BOT} x2={W - R} y2={BOT} stroke="#a1a1aa" strokeWidth={1} />
            <line x1={L} y1={T} x2={L} y2={BOT} stroke="#a1a1aa" strokeWidth={1} />
            {[0, 10, 20, 30].map((i) => (
              <text key={i} x={sx(i)} y={BOT + 13} fontSize={10} textAnchor="middle" fill="#71717a">{i}</text>
            ))}
            {[0, 20, 40, 60].map((p) => (
              <text key={p} x={L - 6} y={sy(p) + 3} fontSize={10} textAnchor="end" fill="#71717a">{p}</text>
            ))}
            <text x={W - R} y={BOT + 27} fontSize={10} textAnchor="end" fill="#71717a">I (FLOP/byte)</text>
            <text x={L - 38} y={T - 4} fontSize={10} fill="#71717a">TFLOP/s</text>

            {/* memory 천장: 전 구간 점선, 상한 구간은 실선 */}
            <line x1={sx(0)} y1={sy(0)} x2={sx(Y_MAX / B_PEAK)} y2={sy(Y_MAX)} stroke="#d97706" strokeWidth={1} strokeDasharray={both ? "3 3" : undefined} opacity={both ? 0.5 : 1} />
            {/* compute 천장 */}
            <line x1={sx(0)} y1={sy(P_PEAK)} x2={sx(X_MAX)} y2={sy(P_PEAK)} stroke="#2563eb" strokeWidth={1} strokeDasharray={both ? "3 3" : undefined} opacity={showCompute ? (both ? 0.5 : 1) : 0} />
            {both && (
              <polyline
                points={`${sx(0)},${sy(0)} ${sx(RIDGE)},${sy(P_PEAK)} ${sx(X_MAX)},${sy(P_PEAK)}`}
                fill="none"
                stroke="#dc2626"
                strokeWidth={1.25}
              />
            )}
            {both && (
              <text x={sx(X_MAX)} y={sy(P_PEAK) + 15} fontSize={11} fontWeight={700} fill="#b91c1c" textAnchor="end">빨간 선 = 상한 min</text>
            )}
            <text x={sx(12) + 8} y={sy(12 * B_PEAK) + 14} fontSize={11} fill="#b45309">memory 천장 I × 3</text>
            <text x={sx(X_MAX)} y={sy(P_PEAK) - 6} fontSize={11} fill="#1d4ed8" textAnchor="end" opacity={showCompute ? 1 : 0}>compute 천장 60</text>

            {both && (
              <g>
                <line x1={sx(RIDGE)} y1={sy(P_PEAK)} x2={sx(RIDGE)} y2={BOT} stroke="#71717a" strokeWidth={1} strokeDasharray="2 3" />
                <text x={sx(RIDGE) + 4} y={BOT - 6} fontSize={10} fill="#64748b">I = 20</text>
                <line x1={sx(I_EX)} y1={sy(P_PEAK)} x2={sx(I_EX)} y2={sy(I_EX * B_PEAK)} stroke="#71717a" strokeWidth={1} strokeDasharray="2 3" />
                <text x={sx(I_EX) + 5} y={sy(48)} fontSize={11} fill="#64748b">compute 천장까지 거리</text>
              </g>
            )}
            <circle cx={sx(I_EX)} cy={sy(I_EX * B_PEAK)} r={4} fill="#d97706" />
            <text x={sx(I_EX) + 7} y={sy(I_EX * B_PEAK) + 4} fontSize={11} fontWeight={700} fill="#b45309">I = 2 → 6</text>
          </svg>
        );
      }}
    />
  );
}

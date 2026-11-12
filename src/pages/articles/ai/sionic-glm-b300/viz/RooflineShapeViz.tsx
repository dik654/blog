import SceneShell from "./SceneShell";

/**
 * 본문 대응: #roofline — P_attainable ≤ min(P_peak, I·B_mem).
 * 축 눈금·꺾이는 위치·점의 위치는 모양을 보이려는 가정이며 GLM-5.2나 B300의 측정값이 아니다.
 */
const W = 360;
const H = 220;
const X0 = 46;
const X1 = 344;
const Y_BOTTOM = 182;
const Y_TOP = 18;
const SLOPE = 0.75;
const PEAK_Y = 64;
const RAISED_Y = 36;
const ridgeX = (peakY: number) => X0 + (Y_BOTTOM - peakY) / SLOPE;
const slopeY = (x: number) => Y_BOTTOM - SLOPE * (x - X0);
const LOW_X = 112;
const MOVED_X = 176;

const SCENES = [
  {
    label: "두 상한 중 낮은 쪽",
    summary: "P ≤ min(P_peak, I·B_mem)",
    note: "가로선은 연산 장치가 낼 수 있는 FLOP/s, 기울어진 선은 HBM이 byte를 공급하는 속도로 낼 수 있는 FLOP/s(I × B_mem)입니다. I(arithmetic intensity)는 옮긴 byte마다 수행한 연산량입니다. 각 I에서 둘 중 낮은 쪽, 즉 굵은 선이 상한입니다.",
  },
  {
    label: "byte에 비해 계산이 적은 kernel",
    summary: "기울어진 선 위 → memory-bound",
    note: "계산 1회를 위해 옮길 byte가 많으면 I가 작아 점이 기울어진 선 위에 놓입니다. 이 점의 상한은 HBM 쪽이 만들며, 이를 memory-bound라고 부릅니다.",
  },
  {
    label: "연산 상한만 올리면",
    summary: "점의 상한은 그대로",
    note: "가로선(P_peak)을 위로 올려도 이 점은 여전히 기울어진 선이 더 낮으므로 상한이 바뀌지 않습니다. memory-bound에서는 FLOPS를 높이는 것이 직접적인 최적화가 아닙니다.",
  },
  {
    label: "byte를 줄이거나 재사용하면",
    summary: "I 증가 → 점이 오른쪽 위로",
    note: "같은 연산에 옮기는 byte를 줄이거나 한 번 가져온 byte를 여러 번 쓰면 I가 커져 점이 기울어진 선을 따라 올라갑니다. 꺾이는 점을 넘으면 그때부터는 연산 장치가 상한을 만듭니다(compute-bound).",
  },
] as const;

export default function RooflineShapeViz() {
  return (
    <SceneShell
      eyebrow="Roofline의 모양"
      title="낮은 지붕이 그 kernel의 상한입니다"
      description="가로축은 arithmetic intensity I, 세로축은 낼 수 있는 FLOP/s입니다. 두 축 모두 눈금 없이 모양만 그렸고, 꺾이는 위치와 점의 위치는 가정입니다."
      ariaLabel="연산 상한과 HBM 상한 중 낮은 쪽이 성능 상한이 되는 roofline 그래프"
      scenes={SCENES}
      render={(active) => {
        const raised = active === 2;
        const pointX = active === 3 ? MOVED_X : LOW_X;
        const showPoint = active > 0;
        const ridge = ridgeX(PEAK_Y);
        const raisedRidge = ridgeX(RAISED_Y);
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <line x1={X0} y1={Y_BOTTOM} x2={X1} y2={Y_BOTTOM} stroke="#94a3b8" strokeWidth={1} />
            <line x1={X0} y1={Y_BOTTOM} x2={X0} y2={Y_TOP} stroke="#94a3b8" strokeWidth={1} />
            <text x={X1} y={Y_BOTTOM + 16} textAnchor="end" fontSize={11} fill="#64748b">I = FLOP ÷ byte →</text>
            <text x={X0 - 6} y={Y_TOP + 4} textAnchor="end" fontSize={11} fill="#64748b">FLOP/s</text>
            <text x={X0 - 6} y={Y_TOP + 16} textAnchor="end" fontSize={11} fill="#64748b">↑</text>

            {/* 두 상한의 연장선 */}
            <line x1={X0} y1={PEAK_Y} x2={X1} y2={PEAK_Y} stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
            <line x1={X0} y1={Y_BOTTOM} x2={X0 + (Y_BOTTOM - Y_TOP) / SLOPE} y2={Y_TOP} stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
            {/* 실제 상한: 낮은 쪽 */}
            <polyline points={`${X0},${Y_BOTTOM} ${ridge},${PEAK_Y} ${X1},${PEAK_Y}`} fill="none" stroke="#2563eb" strokeWidth={1.25} />
            {raised && (
              <>
                <line x1={raisedRidge} y1={RAISED_Y} x2={X1} y2={RAISED_Y} stroke="#d97706" strokeWidth={1.25} strokeDasharray="5 3" />
                <text x={X1} y={RAISED_Y - 6} textAnchor="end" fontSize={11} fill="#d97706">P_peak을 올림</text>
              </>
            )}
            <text x={X1} y={PEAK_Y - 6} textAnchor="end" fontSize={11} fill="#2563eb">P_peak · 연산 장치 상한</text>
            <text x={X0 + 14} y={slopeY(X0 + 14) - 8} fontSize={11} fill="#2563eb" transform={`rotate(-36.9 ${X0 + 14} ${slopeY(X0 + 14) - 8})`}>I × B_mem · HBM 상한</text>

            <line x1={ridge} y1={PEAK_Y} x2={ridge} y2={Y_BOTTOM} stroke="#94a3b8" strokeWidth={1} strokeDasharray="2 3" />
            <text x={(X0 + ridge) / 2} y={Y_BOTTOM - 6} textAnchor="middle" fontSize={11} fill="#64748b">memory-bound</text>
            <text x={(ridge + X1) / 2} y={Y_BOTTOM - 6} textAnchor="middle" fontSize={11} fill="#64748b">compute-bound</text>

            {active === 3 && (
              <>
                <circle cx={LOW_X} cy={slopeY(LOW_X)} r={4} fill="none" stroke="#94a3b8" strokeWidth={1} strokeDasharray="2 2" />
                <line x1={LOW_X + 8} y1={slopeY(LOW_X) + 12} x2={MOVED_X - 2} y2={slopeY(MOVED_X) + 12} stroke="#16a34a" strokeWidth={1.25} />
                <path d={`M${MOVED_X - 2} ${slopeY(MOVED_X) + 12} l-8 1 l3 5 z`} fill="#16a34a" />
              </>
            )}
            {showPoint && (
              <>
                <circle cx={pointX} cy={slopeY(pointX)} r={5} fill={active === 3 ? "#16a34a" : "#d97706"} />
                <text x={pointX + 12} y={slopeY(pointX) + 4} fontSize={11} fontWeight={700} fill={active === 3 ? "#16a34a" : "#d97706"}>
                  kernel (가정)
                </text>
              </>
            )}
          </svg>
        );
      }}
    />
  );
}

import SceneShell from "./SceneShell";

/**
 * 본문 대응: #smoothness — f=x², x=1, d=0.1.
 * 이동한 거리 s에서 기울기 차이 = 2(1+s) − 2 = 2s, 끝(s=0.1)에서 0.2 = L‖d‖ (L=2).
 * 삼각형 넓이 = 0.1 × 0.2 / 2 = 0.01 = 실제 1.21 − 접선 예측 1.2.
 */
const SCENES = [
  { label: "출발점", summary: "기울기 차이 0", note: "출발점 x=1의 기울기는 2입니다. 접선 예측 1.2는 이 기울기 2를 이동 내내 그대로 쓴다고 보고 계산한 값입니다." },
  { label: "절반 이동", summary: "거리 0.05 → 차이 0.1", note: "0.05만큼 갔을 때 기울기는 2.1이라 출발 기울기보다 0.1 큽니다. 거리에 L=2를 곱한 만큼 차이가 벌어집니다." },
  { label: "끝까지 이동", summary: "거리 0.1 → 차이 0.2 = L‖d‖", note: "끝점 1.1의 기울기는 2.2이고 차이는 0.2입니다. 이 차이가 밑변 ‖d‖=0.1 위에 선 삼각형의 높이 L‖d‖입니다." },
  { label: "넓이 = 빠진 양", summary: "0.1 × 0.2 ÷ 2 = 0.01", note: "접선 예측이 빠뜨린 기울기 차이를 쌓으면 삼각형 넓이 L‖d‖²/2=0.01로, 실제 1.21과 예측 1.2의 차이와 같습니다. 일반 함수에서는 차이가 이 선을 넘지 않을 뿐이라 넓이는 오차의 상한입니다." },
] as const;

const W = 340;
const H = 200;
const LEFT = 52;
const RIGHT = 306;
const TOP = 22;
const BOTTOM = 160;
const D = 0.1;
const L = 2;
const MAX_DIFF = 0.24;
const px = (s: number) => LEFT + (s / D) * (RIGHT - LEFT);
const py = (v: number) => BOTTOM - (v / MAX_DIFF) * (BOTTOM - TOP);
const PROGRESS: readonly number[] = [0, 0.05, 0.1, 0.1];

const ACCENT = "#2563eb";
const BASE = "#64748b";
const MUTED = "#94a3b8";

export default function SlopeTriangleViz() {
  return (
    <SceneShell
      eyebrow="1/2이 나오는 자리"
      title="이동 중 벌어진 기울기 차이를 쌓으면 삼각형 넓이가 됩니다"
      description="f=x²에서 x=1부터 d=0.1만큼 이동합니다. 가로축은 이동한 거리, 세로축은 출발 기울기 2와 지금 기울기의 차이입니다."
      ariaLabel="이동 거리에 따라 커지는 기울기 차이와 그 아래 삼각형 넓이 0.01"
      scenes={SCENES}
      render={(active) => {
        const s = PROGRESS[active];
        const diff = L * s;
        const showArea = active === 3;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <line x1={LEFT} x2={RIGHT + 10} y1={BOTTOM} y2={BOTTOM} stroke={MUTED} strokeWidth={1} />
            <line x1={LEFT} x2={LEFT} y1={TOP - 8} y2={BOTTOM} stroke={MUTED} strokeWidth={1} />
            {[0, 0.05, 0.1].map((t) => (
              <g key={t}>
                <line x1={px(t)} x2={px(t)} y1={BOTTOM} y2={BOTTOM + 4} stroke={MUTED} strokeWidth={1} />
                <text x={px(t)} y={BOTTOM + 16} textAnchor="middle" fontSize={11} fill={BASE}>{t}</text>
              </g>
            ))}
            {[0.1, 0.2].map((v) => (
              <g key={v}>
                <line x1={LEFT - 4} x2={LEFT} y1={py(v)} y2={py(v)} stroke={MUTED} strokeWidth={1} />
                <text x={LEFT - 7} y={py(v) + 4} textAnchor="end" fontSize={11} fill={BASE}>{v}</text>
              </g>
            ))}
            <text x={RIGHT + 10} y={BOTTOM + 32} textAnchor="end" fontSize={11} fill={BASE}>이동한 거리</text>
            <text x={LEFT + 6} y={TOP - 2} fontSize={11} fill={BASE}>기울기 차이</text>
            <line x1={px(0)} y1={py(0)} x2={px(D)} y2={py(L * D)} stroke={MUTED} strokeWidth={1} strokeDasharray="4 3" />
            <polygon
              points={`${px(0)},${py(0)} ${px(D)},${py(0)} ${px(D)},${py(L * D)}`}
              fill={ACCENT}
              opacity={showArea ? 0.18 : 0}
            />
            <line x1={px(0)} y1={py(0)} x2={px(s)} y2={py(diff)} stroke={ACCENT} strokeWidth={1.25} />
            <line x1={px(s)} x2={px(s)} y1={py(0)} y2={py(diff)} stroke={ACCENT} strokeWidth={1} strokeDasharray="2 2" />
            <circle cx={px(s)} cy={py(diff)} r={4.5} fill={ACCENT} />
            {/* 점선(최대 차이 선)과 겹치지 않게: 출발점은 선 위 왼쪽, 절반 이동은 점 아래 오른쪽, 끝점은 왼쪽 위 */}
            <text
              x={active === 0 ? LEFT + 8 : px(s) + (active >= 2 ? -8 : 8)}
              y={active === 0 ? py(0.13) : active === 1 ? py(diff) + 18 : py(diff) - 8}
              textAnchor={active >= 2 ? "end" : "start"}
              fontSize={11} fontWeight={700} fill={ACCENT}>
              기울기 {(2 + diff).toFixed(1)} · 차이 {diff.toFixed(1)}
            </text>
            {showArea && (
              <text x={px(0.072)} y={py(0.035)} textAnchor="middle" fontSize={12} fontWeight={700} fill={ACCENT}>넓이 0.01</text>
            )}
          </svg>
        );
      }}
    />
  );
}

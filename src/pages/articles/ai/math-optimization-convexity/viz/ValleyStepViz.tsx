import SceneShell from "./SceneShell";

/**
 * 본문 대응: #curvature-range — q(x,y)=(x²+100y²)/2(가정), 기울기 (x,100y), μ=1, L=100.
 * 간격 1/L=0.01: (1,1)→(0.99,0). 간격 1: (1,1)→(0,−99).
 * z=10y: q=(x²+z²)/2, μ=L=1. (1,1)은 새 좌표 (1,10), 간격 1/L=1이면 1−1·1=0, 10−1·10=0 → (0,0).
 */
const SCENES = [
  { label: "좁은 골짜기", summary: "(1,1)의 기울기 (1, 100)", note: "등고선이 가로로 길쭉합니다. y 방향 변화 규모 100이 x 방향 1보다 커서 내려가는 방향 −(1, 100)은 거의 바로 아래입니다." },
  { label: "간격 1/L = 0.01", summary: "(1,1) → (0.99, 0)", note: "급한 y 방향은 100×0.01=1만큼 줄어 한 번에 0이 됩니다. x 방향은 1×0.01=0.01만 줄어 그림에서는 거의 제자리입니다." },
  { label: "간격 1", summary: "(1,1) → (0, −99)", note: "간격 1이면 x는 한 번에 0이 되지만 y는 1−100=−99로 골짜기 반대편 멀리 넘어갑니다." },
  { label: "좌표를 z=10y로", summary: "μ = L = 1", note: "새 좌표에서는 등고선이 원이고 두 방향 굽음이 모두 1입니다. (1,1)은 (1,10)이 되고 간격 1/L=1이면 (0,0)에 닿습니다(계산)." },
] as const;

const SIZE = 260;
const PAD = 26;
const C = PAD + SIZE / 2;
const ACCENT = "#2563eb";
const WARN = "#dc2626";
const BASE = "#64748b";
const MUTED = "#94a3b8";
const TOTAL = SIZE + PAD * 2;

export default function ValleyStepViz() {
  return (
    <SceneShell
      eyebrow="굽음이 다른 두 방향"
      title="한 보폭은 급한 방향에 맞추면 평평한 방향에서 거의 움직이지 않습니다"
      description="두 입력 q(x,y)=(x²+100y²)/2(가정)의 등고선입니다. 선 하나는 점수가 같은 점들을 이은 것이고 가로·세로 눈금은 같은 축척입니다."
      ariaLabel="굽음이 다른 이차 함수의 등고선과 간격 0.01, 간격 1의 한 걸음, 좌표 변경 후의 원형 등고선"
      scenes={SCENES}
      render={(active) => {
        const rescaled = active === 3;
        const range = rescaled ? 12 : 1.5;
        const unit = SIZE / 2 / range;
        const px = (x: number) => C + x * unit;
        const py = (y: number) => C - y * unit;
        const levels = rescaled ? [3, 6, 9, Math.sqrt(101)] : [0.4, 0.8, 1.2, 4, 7, Math.sqrt(101)];
        const start = rescaled ? [1, 10] : [1, 1];
        const end = active === 1 ? [0.99, 0] : active === 2 ? [0, -99] : rescaled ? [0, 0] : null;
        const exitY = -range;
        const drawnEnd = active === 2 ? [1 - (1 - exitY) / 100, exitY] : end;
        return (
          <div className="mx-auto w-full max-w-60 sm:max-w-sm">
          <svg viewBox={`0 0 ${TOTAL} ${TOTAL}`} className="block h-auto w-full" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <defs>
              <clipPath id="valley-step-clip">
                <rect x={PAD} y={PAD} width={SIZE} height={SIZE} />
              </clipPath>
              <marker id="valley-step-arrow" viewBox="0 0 8 8" refX={7} refY={4} markerWidth={7} markerHeight={7} orient="auto">
                <path d="M0,0 L8,4 L0,8 z" fill={active === 2 ? WARN : ACCENT} />
              </marker>
            </defs>
            <rect x={PAD} y={PAD} width={SIZE} height={SIZE} fill="none" stroke={MUTED} strokeWidth={1} />
            <g clipPath="url(#valley-step-clip)">
              <line x1={PAD} x2={PAD + SIZE} y1={C} y2={C} stroke={MUTED} strokeWidth={1} />
              <line x1={C} x2={C} y1={PAD} y2={PAD + SIZE} stroke={MUTED} strokeWidth={1} />
              {levels.map((a) => (
                <ellipse key={a} cx={C} cy={C} rx={a * unit} ry={(rescaled ? a : a / 10) * unit} fill="none" stroke={BASE} strokeWidth={1} opacity={0.55} />
              ))}
              {drawnEnd && (
                <line
                  x1={px(start[0])}
                  y1={py(start[1])}
                  x2={px(drawnEnd[0])}
                  y2={py(drawnEnd[1])}
                  stroke={active === 2 ? WARN : ACCENT}
                  strokeWidth={1.25}
                  markerEnd="url(#valley-step-arrow)"
                />
              )}
            </g>
            <circle cx={px(start[0])} cy={py(start[1])} r={4.5} fill={ACCENT} />
            <text x={px(start[0]) + 8} y={py(start[1]) - 6} fontSize={13} fontWeight={700} fill={ACCENT}>{rescaled ? "(1, 10)" : "(1, 1)"}</text>
            {active === 1 && (
              <text x={px(0.99) + 8} y={py(0) + 16} fontSize={13} fontWeight={700} fill={ACCENT}>(0.99, 0)</text>
            )}
            {active === 2 && (
              <text x={px(0.975) - 6} y={PAD + SIZE - 8} textAnchor="end" fontSize={13} fontWeight={700} fill={WARN}>(0, −99)은 아래 화면 밖</text>
            )}
            {rescaled && (
              <text x={px(0) + 6} y={py(0) + 16} fontSize={13} fontWeight={700} fill={ACCENT}>(0, 0)</text>
            )}
            <text x={PAD + SIZE} y={PAD + SIZE + 18} textAnchor="end" fontSize={13} fill={BASE}>x 방향 ({rescaled ? "±12" : "±1.5"})</text>
            <text x={PAD} y={PAD - 8} fontSize={13} fill={BASE}>{rescaled ? "z = 10y 방향" : "y 방향"}</text>
          </svg>
          </div>
        );
      }}
    />
  );
}

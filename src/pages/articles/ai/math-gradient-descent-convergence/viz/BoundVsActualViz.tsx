import SceneShell from "./SceneShell";

/**
 * 본문 대응: #convergence. μ=2, L=8, η=1/8(가정).
 * 상한 (3/4)^t: 1, 0.75, 0.5625, 0.4219, 0.3164. q=x²+4y², (1,0)의 실제 점수 (3/4)^(2t): 1, 0.5625, 0.3164, 0.178, 0.1001.
 */
const SCENES = [
  { label: "상한", summary: "(3/4)⁴ = 81/256 ≈ 0.3164", bound: true, actual: false, note: "한 번에 3/4를 곱한 값까지만 남을 수 있다는 경계를 네 번 쌓았습니다. 초기 오차를 1로 둔 경우입니다." },
  { label: "실제 경로 하나", summary: "(3/4)⁸ = 6561/65536 ≈ 0.1001", bound: false, actual: true, note: "q(x,y)=x²+4y²를 (1,0)에서 시작하면 y는 0에 머물고 x만 3/4배가 됩니다. 점수는 x²이므로 한 번에 9/16배입니다." },
  { label: "나란히 놓으면", summary: "실제 0.1001 < 상한 0.3164", bound: true, actual: true, note: "출발점 t=0에서는 둘 다 1이고, 그 뒤 모든 칸에서 이 경로의 실제 값이 상한 아래입니다. 상한은 매번 정확히 3/4로 변한다는 주장이 아닙니다." },
] as const;

const STEPS = [0, 1, 2, 3, 4];
const BOUND = STEPS.map((t) => 0.75 ** t);
const ACTUAL = STEPS.map((t) => 0.75 ** (2 * t));
const BASE_Y = 160;
const PX = 118;
const GROUP_W = 68;
const LEFT = 12;
const BAR_W = 26;
const BLUE = "#2563eb";
const AMBER = "#d97706";
const GRAY = "#64748b";

export default function BoundVsActualViz() {
  return (
    <SceneShell
      eyebrow="경계와 실제"
      title="상한은 천천히 내려오고, 이 경로의 실제 오차는 그 아래에 있습니다"
      description="μ=2, L=8, η=1/8인 예입니다(가정). 윤곽 막대가 오차의 상한, 채운 막대가 q(x,y)=x²+4y²의 (1,0)에서 잰 실제 점수이며, 최솟값이 0이라 점수가 곧 오차입니다."
      ariaLabel="반복 횟수별 오차 상한과 실제 오차 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <svg viewBox="0 0 360 182" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <line x1={LEFT} x2={348} y1={BASE_Y} y2={BASE_Y} stroke="#94a3b8" strokeWidth={1} />
            {STEPS.map((t, index) => {
              const x = LEFT + index * GROUP_W + 3;
              const b = BOUND[index] * PX;
              const a = ACTUAL[index] * PX;
              return (
                <g key={t}>
                  {scene.bound && (
                    <>
                      <rect x={x} y={BASE_Y - b} width={BAR_W} height={b} fill="none" stroke={AMBER} strokeWidth={1.25} />
                      <text x={x + BAR_W / 2} y={BASE_Y - b - 5} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={AMBER}>{t === 0 ? "1" : BOUND[index].toFixed(3)}</text>
                    </>
                  )}
                  {scene.actual && (
                    <>
                      <rect x={x + BAR_W + 2} y={BASE_Y - a} width={BAR_W} height={a} fill={BLUE} opacity={0.8} />
                      <text x={x + BAR_W + 2 + BAR_W / 2} y={BASE_Y - a - 5} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={BLUE}>{t === 0 ? "1" : ACTUAL[index].toFixed(3)}</text>
                    </>
                  )}
                  <text x={x + BAR_W} y={BASE_Y + 15} textAnchor="middle" fontSize={11} fill={GRAY}>t={t}</text>
                </g>
              );
            })}
          </svg>
        );
      }}
    />
  );
}

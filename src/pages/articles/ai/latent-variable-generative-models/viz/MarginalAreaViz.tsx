import SceneShell from "./SceneShell";

/**
 * 본문 대응: #marginalization — p(z=0)=.75, p(x|0)=.2, p(z=1)=.25, p(x|1)=.8.
 * 사각형(폭 1 × 높이 1로 둔 단위 넓이) 폭 = prior, 기둥 안 칠한 높이 = p(x|z), 칠한 넓이 = 기여분.
 * .75×.2=.15, .25×.8=.20, 합 p(x)=.35. 마지막 장면의 posterior는 .15/.35=3/7, .20/.35=4/7.
 */
const PRIOR: readonly number[] = [0.75, 0.25];
const COND: readonly number[] = [0.2, 0.8];
const CONTRIB = [PRIOR[0] * COND[0], PRIOR[1] * COND[1]];
const PX = CONTRIB[0] + CONTRIB[1];
const POST = [CONTRIB[0] / PX, CONTRIB[1] / PX];

const X0 = 52;
const SIDE_W = 270;
const Y0 = 22;
const SIDE_H = 150;
const COL_W = [PRIOR[0] * SIDE_W, PRIOR[1] * SIDE_W];
const COL_X = [X0, X0 + COL_W[0]];
const POST_Y = 204;
const POST_H = 18;
const COLORS: readonly string[] = ["#2563eb", "#d97706"];

const f2 = (value: number) => value.toFixed(2).replace(/^0/, "");

const SCENES = [
  {
    label: "prior가 폭을 나눕니다",
    summary: "p(z=0)=.75 · p(z=1)=.25",
    note: "Prior p(z)는 x를 보기 전 각 z가 뽑힐 비율입니다. 폭 1 × 높이 1로 둔 넓이 1인 사각형의 폭을 z=0 기둥이 .75, z=1 기둥이 .25만큼 차지합니다.",
  },
  {
    label: "기둥마다 x가 나올 비율을 칠합니다",
    summary: ".75×.2=.15 · .25×.8=.20",
    note: "각 기둥 안에서 아래부터 p(x|z)만큼 칠합니다. z=0 기둥은 높이 .2, z=1 기둥은 .8입니다. 칠한 넓이 .15와 .20이 각 branch의 joint contribution이고, 폭과 높이를 곱하는 것이 식의 p(z)·p(x|z)입니다.",
  },
  {
    label: "칠한 넓이를 모두 더합니다",
    summary: "p(x) = .15 + .20 = .35",
    note: "z는 관측하지 못했으므로 어느 기둥의 칠한 부분이든 이 x가 나온 경우입니다. 두 넓이를 더한 .35가 p(x)입니다. 칠하지 않은 부분은 이 x가 아닌 다른 관측이 나온 경우입니다.",
  },
  {
    label: "x를 본 뒤에는 칠한 부분만 남습니다",
    summary: "p(z|x) ≈ .43 · .57",
    note: "이미 x를 봤다면 칠한 .35 안에서만 따집니다. .15/.35≈.43, .20/.35≈.57이라 prior에서 세 배 흔했던 z=0보다 z=1이 더 그럴듯해집니다. 이것이 posterior p(z|x)입니다. 고차원 연속 z에서는 분모 p(x)의 적분부터 어려울 수 있습니다.",
  },
] as const;

export default function MarginalAreaViz() {
  return (
    <SceneShell
      eyebrow="넓이로 보는 marginalization"
      title="폭은 prior, 칠한 높이는 conditional, 칠한 넓이의 합이 p(x)입니다"
      description="본문 예시의 숫자를 그대로 씁니다. 사각형의 가로·세로를 각각 1로 두어 전체 넓이가 1이고, z는 0과 1 두 값뿐인 discrete 예시입니다."
      ariaLabel="prior 폭과 conditional 높이를 곱한 넓이로 p(x)와 posterior를 계산하는 네 장면"
      scenes={SCENES}
      render={(active) => {
        const shade = active >= 1;
        return (
          <svg viewBox="0 0 380 236" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {[0, 1].map((z) => {
              const fillH = COND[z] * SIDE_H;
              const cx = COL_X[z] + COL_W[z] / 2;
              return (
                <g key={z}>
                  <rect x={COL_X[z]} y={Y0} width={COL_W[z]} height={SIDE_H} fill="none" stroke="#94a3b8" strokeWidth={1} />
                  {shade && (
                    <rect
                      x={COL_X[z]}
                      y={Y0 + SIDE_H - fillH}
                      width={COL_W[z]}
                      height={fillH}
                      fill={COLORS[z]}
                      fillOpacity={active === 3 ? 0.85 : 0.6}
                      stroke={COLORS[z]}
                      strokeWidth={1}
                    />
                  )}
                  <text x={cx} y={Y0 - 7} textAnchor="middle" fontSize={13} fontWeight={700} fill={COLORS[z]}>
                    z={z} · 폭 {f2(PRIOR[z])}
                  </text>
                  {shade && (
                    <text x={cx} y={Y0 + SIDE_H - fillH / 2 + 4} textAnchor="middle" fontSize={13} fontWeight={700} fill="#ffffff">
                      {f2(CONTRIB[z])}
                    </text>
                  )}
                  {shade && (
                    <text
                      x={z === 0 ? COL_X[0] - 4 : COL_X[1] + COL_W[1] + 4}
                      y={Y0 + SIDE_H - fillH + 4}
                      textAnchor={z === 0 ? "end" : "start"}
                      fontSize={12}
                      fill="#64748b"
                    >
                      높이 {f2(COND[z])}
                    </text>
                  )}
                </g>
              );
            })}
            {active === 2 && (
              <text x={X0 + COL_W[0] / 2} y={Y0 + 50} textAnchor="middle" fontSize={13} fill="#64748b">
                칠하지 않은 부분: 다른 관측
              </text>
            )}
            <text x={X0} y={POST_Y - 8} fontSize={12} fill="#64748b">
              {active === 3 ? "칠한 .35만 다시 1로 늘린 막대 = p(z|x)" : active === 2 ? `p(x) = ${f2(CONTRIB[0])} + ${f2(CONTRIB[1])} = ${f2(PX)}` : ""}
            </text>
            {active === 2 && (
              <>
                <rect x={X0} y={POST_Y} width={CONTRIB[0] * SIDE_W} height={POST_H} fill={COLORS[0]} fillOpacity={0.6} />
                <rect x={X0 + CONTRIB[0] * SIDE_W} y={POST_Y} width={CONTRIB[1] * SIDE_W} height={POST_H} fill={COLORS[1]} fillOpacity={0.6} />
                <rect x={X0} y={POST_Y} width={SIDE_W} height={POST_H} fill="none" stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
              </>
            )}
            {active === 3 &&
              [0, 1].map((z) => {
                const x = z === 0 ? X0 : X0 + POST[0] * SIDE_W;
                const w = POST[z] * SIDE_W;
                return (
                  <g key={z}>
                    <rect x={x} y={POST_Y} width={w} height={POST_H} fill={COLORS[z]} fillOpacity={0.85} stroke={COLORS[z]} strokeWidth={1} />
                    <text x={x + w / 2} y={POST_Y + 13} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ffffff">
                      z={z} · {f2(POST[z])}
                    </text>
                  </g>
                );
              })}
          </svg>
        );
      }}
    />
  );
}

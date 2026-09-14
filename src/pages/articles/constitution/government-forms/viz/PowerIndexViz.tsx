import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: power-index 의 ExplainedFormula — 의석이 아니라 결정적 연합의 수가 협상력 */
const SCENES = [
  "의석만 보면 다당은 작다",
  "이기는 연합을 전부 적어 본다",
  "그래서 셋의 협상력이 같다",
  "20석만 옮기면 두 당이 0이 된다",
] as const;

const TOTAL = 300;
const QUOTA = 151;

const NAMES = ["가당", "나당", "다당"] as const;
const SETUP: Array<readonly [number, number, number]> = [
  [140, 140, 20],
  [140, 140, 20],
  [140, 140, 20],
  [160, 120, 20],
];

const COLORS = ["#6366f1", "#f59e0b", "#10b981"];
const WARN = "#ef4444";
const MUTED = "#94a3b8";

type Coalition = { members: number[]; seats: number; critical: number[] };

/** 정족수를 넘는 모든 연합과, 그 안에서 빠지면 지는 구성원을 구한다 */
function coalitions(seats: readonly number[]): Coalition[] {
  const out: Coalition[] = [];
  for (let mask = 1; mask < 1 << seats.length; mask += 1) {
    const members = seats.map((_, i) => i).filter((i) => mask & (1 << i));
    const sum = members.reduce((acc, i) => acc + seats[i], 0);
    if (sum < QUOTA) continue;
    const critical = members.filter((i) => sum - seats[i] < QUOTA);
    out.push({ members, seats: sum, critical });
  }
  return out;
}

function banzhaf(seats: readonly number[]): number[] {
  const swings = seats.map(() => 0);
  for (const c of coalitions(seats)) {
    for (const i of c.critical) swings[i] += 1;
  }
  const total = swings.reduce((a, b) => a + b, 0);
  return swings.map((s) => (total === 0 ? 0 : s / total));
}

const pct = (v: number) => `${Math.round(v * 1000) / 10}%`;

const BAR_X = 96;
const BAR_W = 300;

export default function PowerIndexViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3800);
  const step = scenes.active;
  const seats = SETUP[step];
  const wins = coalitions(seats);
  const power = banzhaf(seats);

  const NOTES = [
    `의석은 ${seats.join(" · ")}이고 과반은 ${QUOTA}석입니다. 다당은 전체의 ${pct(seats[2] / TOTAL)}뿐이라 협상 테이블에서 작아 보입니다.`,
    `과반을 넘는 연합은 ${wins.length}개입니다. 굵게 표시한 당은 그 연합에서 빠지면 과반이 깨지는 당, 곧 결정적인 당입니다.`,
    `결정적인 횟수를 세어 비율로 바꾸면 ${power.map(pct).join(" · ")}입니다. ${pct(seats[2] / TOTAL)}짜리 당이 ${pct(seats[0] / TOTAL)}짜리 당과 같은 협상력을 갖습니다.`,
    `나당의 ${SETUP[0][1] - SETUP[3][1]}석이 가당으로 넘어가 가당이 ${seats[0]}석, 곧 단독 과반이 되었습니다. 나당은 여전히 ${seats[1]}석, 곧 전체의 ${pct(seats[1] / TOTAL)}를 쥐고 있지만 결정적인 연합이 하나도 없어 협상력은 ${pct(power[1])}입니다.`,
  ] as const;

  return (
    <VizFrame
      eyebrow="협상력"
      title="의석 비율과 실제 협상력은 같은 수가 아닙니다"
      description="한 당의 힘은 가진 의석이 아니라, 그 당이 빠지면 무너지는 연합이 몇 개인가로 재야 합니다."
      note={`모든 연합이 똑같이 성사될 수 있다고 두고 이념 거리를 무시한 계산입니다. 의석은 당론으로 한 덩어리로 움직인다고 가정했습니다. 정족수는 ${TOTAL}석의 과반인 ${QUOTA}석입니다.`}
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="의석과 협상력의 괴리"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(step + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>

          <div className="mt-4 w-full min-w-0 overflow-x-auto">
            <svg
              viewBox="0 0 480 200"
              role="img"
              aria-label={SCENES[step]}
              className="h-auto w-full min-w-[30rem] max-w-2xl"
            >
              {step !== 1 && (
                <g>
                  <text x={BAR_X} y={26} fontSize={9} fontWeight={700} fill={MUTED}>
                    의석
                  </text>
                  {seats.map((s, i) => {
                    const y = 34 + i * 22;
                    return (
                      <g key={NAMES[i]}>
                        <text x={BAR_X - 8} y={y + 11} textAnchor="end" fontSize={9} fontWeight={700} fill={COLORS[i]}>
                          {NAMES[i]}
                        </text>
                        <rect x={BAR_X} y={y} width={(s / TOTAL) * BAR_W} height={14} fill={COLORS[i]} fillOpacity={0.25} stroke={COLORS[i]} strokeWidth={1} />
                        <text x={BAR_X + BAR_W + 10} y={y + 11} fontSize={9} fill={MUTED}>
                          {s}석
                        </text>
                      </g>
                    );
                  })}
                  <line x1={BAR_X + (QUOTA / TOTAL) * BAR_W} y1={30} x2={BAR_X + (QUOTA / TOTAL) * BAR_W} y2={104} stroke={WARN} strokeWidth={1} strokeDasharray="4 3" />
                  <text x={BAR_X + (QUOTA / TOTAL) * BAR_W} y={116} textAnchor="middle" fontSize={8} fontWeight={700} fill={WARN}>
                    과반 {QUOTA}석
                  </text>
                </g>
              )}

              {step === 0 && (
                <text x={240} y={150} textAnchor="middle" fontSize={9} fill={MUTED}>
                  단독 과반이 없으므로 누군가와 손을 잡아야 정부가 섭니다
                </text>
              )}

              {step === 1 && (
                <g>
                  <text x={40} y={26} fontSize={9} fontWeight={700} fill={MUTED}>
                    과반을 넘는 연합
                  </text>
                  <text x={300} y={26} fontSize={9} fontWeight={700} fill={MUTED}>
                    빠지면 지는 당
                  </text>
                  {wins.map((c, index) => {
                    const y = 42 + index * 26;
                    return (
                      <g key={c.members.join("-")}>
                        <text x={40} y={y} fontSize={9.5} fill={MUTED}>
                          {c.members.map((i) => NAMES[i]).join(" + ")} = {c.seats}석
                        </text>
                        {c.critical.length === 0 ? (
                          <text x={300} y={y} fontSize={9.5} fontWeight={700} fill={WARN}>
                            없음 · 누구든 빠져도 과반
                          </text>
                        ) : (
                          c.critical.map((i, k) => (
                            <text key={i} x={300 + k * 44} y={y} fontSize={9.5} fontWeight={700} fill={COLORS[i]}>
                              {NAMES[i]}
                            </text>
                          ))
                        )}
                      </g>
                    );
                  })}
                  <text x={40} y={42 + wins.length * 26 + 14} fontSize={9} fill={MUTED}>
                    결정적인 횟수 · {NAMES.map((n, i) => `${n} ${wins.filter((c) => c.critical.includes(i)).length}`).join(" · ")}
                  </text>
                </g>
              )}

              {step >= 2 && (
                <g>
                  <text x={BAR_X} y={140} fontSize={9} fontWeight={700} fill={MUTED}>
                    협상력
                  </text>
                  {power.map((p, i) => {
                    const y = 148 + i * 16;
                    return (
                      <g key={NAMES[i]}>
                        <text x={BAR_X - 8} y={y + 9} textAnchor="end" fontSize={9} fontWeight={700} fill={COLORS[i]}>
                          {NAMES[i]}
                        </text>
                        <rect x={BAR_X} y={y} width={Math.max(p * BAR_W, 0.6)} height={11} fill={COLORS[i]} fillOpacity={0.65} stroke={COLORS[i]} strokeWidth={1} />
                        <text x={BAR_X + BAR_W + 10} y={y + 9} fontSize={9} fontWeight={700} fill={p === 0 ? WARN : COLORS[i]}>
                          {pct(p)}
                        </text>
                      </g>
                    );
                  })}
                </g>
              )}
            </svg>
          </div>

          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {NOTES[step]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}

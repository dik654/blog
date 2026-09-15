import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: two-advantages 절 — 더 많이 만드는 것과 더 싸게 만드는 것은 다르다 */
const SCENES = [
  "가온이 둘 다 더 많이 만듭니다",
  "값은 포기한 것으로 잽니다",
  "케이크는 나루가 더 쌉니다",
  "빵은 가온이 더 쌉니다",
] as const;

/** 하루를 통째로 한 가지에만 썼을 때의 생산량 */
const MAKERS = [
  { name: "가온", bread: 8, cake: 4 },
  { name: "나루", bread: 3, cake: 3 },
] as const;

/** 케이크 한 개를 만들려면 포기해야 하는 빵의 판 수 */
const cakeCost = (i: number) => MAKERS[i].bread / MAKERS[i].cake;
/** 빵 한 판을 만들려면 포기해야 하는 케이크 개수 */
const breadCost = (i: number) => MAKERS[i].cake / MAKERS[i].bread;

const OK = "#10b981";
const WARN = "#ef4444";
const ACCENT = "#6366f1";
const MUTED = "#94a3b8";

const num = (v: number) => (Number.isInteger(v) ? `${v}` : v.toFixed(1));

const COL_X = 150;
const COL_W = 130;

export default function ComparativeAdvantageViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3800);
  const s = scenes.active;
  /** 2번 장면부터는 생산량 대신 기회비용을 보여 준다 */
  const showCost = s >= 1;
  const cheapCake = cakeCost(0) < cakeCost(1) ? 0 : 1;
  const cheapBread = breadCost(0) < breadCost(1) ? 0 : 1;

  const NOTES = [
    `가온은 하루에 빵 ${MAKERS[0].bread}판이나 케이크 ${MAKERS[0].cake}개를 만들고 나루는 빵 ${MAKERS[1].bread}판이나 케이크 ${MAKERS[1].cake}개를 만듭니다. 가온이 둘 다 더 많이 만듭니다. 여기까지만 보면 가온이 혼자 다 하는 것이 맞아 보입니다.`,
    `그런데 만든 양은 값이 아닙니다. 가온이 케이크 한 개를 만들려면 빵 ${num(cakeCost(0))}판을 포기해야 하고 나루는 빵 ${num(cakeCost(1))}판만 포기하면 됩니다. 같은 케이크인데 치르는 값이 다릅니다.`,
    `케이크의 값은 나루 쪽이 쌉니다. 빵 ${num(cakeCost(1))}판과 빵 ${num(cakeCost(0))}판이니 나루가 절반 값에 만듭니다. 가온이 더 많이 만들 수 있다는 사실과는 상관이 없습니다.`,
    `빵은 반대입니다. 가온은 빵 한 판에 케이크 ${num(breadCost(0))}개를 포기하고 나루는 ${num(breadCost(1))}개를 포기합니다. 그래서 각자가 싸게 만드는 쪽이 하나씩 갈립니다. 둘 다 더 잘하는 사람이 있어도 둘 다 맡는 것이 답이 되지 않는 이유입니다.`,
  ] as const;

  return (
    <VizFrame
      eyebrow="더 많이 만드는 것과 더 싸게 만드는 것"
      title="둘 다 더 잘하는 사람이 있어도 싸게 만드는 쪽은 갈립니다"
      description="만든 양으로 보면 한쪽이 다 이기지만, 포기한 것으로 값을 재면 각자 싼 것이 하나씩 생깁니다."
      note="하루를 통째로 한 가지에만 썼을 때의 생산량으로 잡은 예입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="절대우위와 비교우위"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(s + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[s]}</h4>

          <div className="mt-4 w-full min-w-0 overflow-x-auto">
            <svg
              viewBox="0 0 480 200"
              role="img"
              aria-label={SCENES[s]}
              className="h-auto w-full min-w-[30rem] max-w-2xl"
            >
              <text x={COL_X - 14} y={30} textAnchor="end" fontSize={8.5} fontWeight={700} fill={MUTED}>
                {showCost ? "치르는 값" : "하루 생산량"}
              </text>
              <text x={COL_X} y={30} fontSize={8.5} fontWeight={700} fill={MUTED}>
                빵
              </text>
              <text x={COL_X + COL_W} y={30} fontSize={8.5} fontWeight={700} fill={MUTED}>
                케이크
              </text>

              {MAKERS.map((m, i) => {
                const y = 56 + i * 46;
                const cakeWin = s >= 2 && i === cheapCake;
                const breadWin = s >= 3 && i === cheapBread;
                return (
                  <g key={m.name}>
                    <text x={COL_X - 14} y={y} textAnchor="end" fontSize={10} fontWeight={700} fill={MUTED}>
                      {m.name}
                    </text>

                    <text
                      x={COL_X}
                      y={y}
                      fontSize={12}
                      fontWeight={700}
                      fill={breadWin ? OK : showCost ? MUTED : ACCENT}
                    >
                      {showCost ? `케이크 ${num(breadCost(i))}개` : `${m.bread}판`}
                    </text>
                    {showCost && (
                      <text x={COL_X} y={y + 13} fontSize={7.5} fill={MUTED}>
                        빵 한 판에 포기하는 것
                      </text>
                    )}
                    {breadWin && (
                      <text x={COL_X} y={y + 26} fontSize={8.5} fontWeight={700} fill={OK}>
                        이쪽이 쌉니다
                      </text>
                    )}

                    <text
                      x={COL_X + COL_W}
                      y={y}
                      fontSize={12}
                      fontWeight={700}
                      fill={cakeWin ? OK : showCost ? MUTED : ACCENT}
                    >
                      {showCost ? `빵 ${num(cakeCost(i))}판` : `${m.cake}개`}
                    </text>
                    {showCost && (
                      <text x={COL_X + COL_W} y={y + 13} fontSize={7.5} fill={MUTED}>
                        케이크 한 개에 포기하는 것
                      </text>
                    )}
                    {cakeWin && (
                      <text x={COL_X + COL_W} y={y + 26} fontSize={8.5} fontWeight={700} fill={OK}>
                        이쪽이 쌉니다
                      </text>
                    )}
                  </g>
                );
              })}

              <line x1={COL_X - 90} y1={158} x2={440} y2={158} stroke={MUTED} strokeWidth={0.75} strokeOpacity={0.5} />
              <text x={COL_X - 14} y={176} textAnchor="end" fontSize={8.5} fontWeight={700} fill={MUTED}>
                지금 읽는 것
              </text>
              {s === 0 && (
                <text x={COL_X} y={176} fontSize={9.5} fontWeight={700} fill={WARN}>
                  가온이 빵도 케이크도 더 많이 만듭니다
                </text>
              )}
              {s === 1 && (
                <text x={COL_X} y={176} fontSize={9.5} fontWeight={700} fill={ACCENT}>
                  같은 케이크인데 치르는 값이 다릅니다
                </text>
              )}
              {s === 2 && (
                <text x={COL_X} y={176} fontSize={9.5} fontWeight={700} fill={OK}>
                  케이크는 나루가 빵 {num(cakeCost(1))}판으로 가장 싸게 만듭니다
                </text>
              )}
              {s === 3 && (
                <text x={COL_X} y={176} fontSize={9.5} fontWeight={700} fill={OK}>
                  싸게 만드는 쪽이 하나씩 갈립니다
                </text>
              )}
            </svg>
          </div>

          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {NOTES[s]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}

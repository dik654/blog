import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: rounds 절의 ExplainedFormula — 잡히는 수가 줄어도 남은 수는 0이 아니다 */
const SCENES = [
  "1라운드 · 초판을 넘겼습니다",
  "2라운드 · 수정안을 다시 넘겼습니다",
  "3라운드 · 새로 생긴 것만 찾게 했습니다",
  "줄어든다고 0이 되지는 않습니다",
] as const;

/** 라운드마다 돌아온 지적 수 */
const ROUNDS = [
  { n: 25, what: "초판 전체", note: "사실 관계 7건은 1차 출처로 되짚음" },
  { n: 16, what: "수정안과 신규", note: "그 사이 3건은 검증한 쪽이 철회" },
  { n: 8, what: "개정판에 새로 생긴 것", note: "모집단이 앞 둘과 다름" },
] as const;

/** 두 감쇠비의 기하평균 */
const RATIO = Math.sqrt(ROUNDS[2].n / ROUNDS[0].n);
/** 같은 비율로 계속 줄어든다고 두었을 때 남은 합 */
const REMAINING = (ROUNDS[2].n * RATIO) / (1 - RATIO);
const TOTAL = ROUNDS.reduce((a, r) => a + r.n, 0);

const OK = "#10b981";
const WARN = "#ef4444";
const ACCENT = "#6366f1";
const MUTED = "#94a3b8";

const X0 = 96;
const BAR_W = 240;
const MAX = 25;

export default function ReviewRoundsViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200);
  const s = scenes.active;
  const shown = Math.min(s + 1, ROUNDS.length);
  const done = s === SCENES.length - 1;

  const NOTES = [
    `초판을 그대로 넘겨 틀린 것만 찾게 했더니 ${ROUNDS[0].n}건이 돌아왔습니다. 그중 사실 관계가 걸린 일곱 건은 1차 출처를 직접 다시 열어 확인했고, 확인해 보니 지적이 맞았습니다.`,
    `고친 원고를 다시 넘겼습니다. 이번에는 수정안 자체의 허점과 새 지적을 합쳐 ${ROUNDS[1].n}건이 왔습니다. 같은 라운드에서 검증한 쪽이 앞서 낸 지적 세 건을 스스로 철회하기도 했습니다.`,
    `세 번째는 질문을 바꿔 개정판에 새로 생긴 오류만 찾게 했습니다. ${ROUNDS[2].n}건이 나왔습니다. 고치는 과정에서 문장을 새로 쓰거나 표를 다시 짜면서 들어간 것들입니다.`,
    `세 수를 같은 비율로 줄어드는 것으로 보면 감쇠비가 ${RATIO.toFixed(2)}이고 남은 합이 ${REMAINING.toFixed(0)}건쯤 됩니다. 다만 세 번째는 모집단이 달라 이 계산 자체가 이 글이 지적하는 단위 혼동을 저지릅니다. 그래도 방향은 남습니다.`,
  ] as const;

  return (
    <VizFrame
      eyebrow="세 번 돌린 결과"
      title="잡히는 수는 줄었지만 세 번째에도 여덟 건이 새로 나왔습니다"
      description="고치는 과정에서 새 오류가 들어가기 때문에 한 번의 검증으로 끝나지 않습니다."
      note="한 건의 조사 결과물을 세 라운드에 걸쳐 외부 모델에 검증시킨 기록입니다. 표본이 하나라 일반화할 수 없습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="라운드별 지적 수와 남은 수 추정"
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
              <text x={14} y={22} fontSize={8} fontWeight={700} fill={MUTED}>
                라운드
              </text>
              <text x={X0} y={22} fontSize={8} fontWeight={700} fill={MUTED}>
                돌아온 지적
              </text>

              {ROUNDS.map((r, i) => {
                const y = 32 + i * 38;
                const active = i < shown;
                const w = (r.n / MAX) * BAR_W;
                return (
                  <g key={i} opacity={active ? 1 : 0.25}>
                    <text x={14} y={y + 14} fontSize={9.5} fontWeight={700} fill={active ? ACCENT : MUTED}>
                      {i + 1}라운드
                    </text>
                    <text x={14} y={y + 26} fontSize={7.5} fill={MUTED}>
                      {r.what}
                    </text>
                    <rect
                      x={X0}
                      y={y}
                      width={Math.max(w, 1)}
                      height={18}
                      fill={active ? ACCENT : MUTED}
                      fillOpacity={active ? 0.38 : 0.15}
                      stroke={active ? ACCENT : MUTED}
                      strokeWidth={1}
                    />
                    <text x={X0 + w + 8} y={y + 14} fontSize={11} fontWeight={700} fill={active ? ACCENT : MUTED}>
                      {r.n}건
                    </text>
                    {active && (
                      <text x={X0 + w + 44} y={y + 14} fontSize={7.5} fill={MUTED}>
                        {r.note}
                      </text>
                    )}
                  </g>
                );
              })}

              <line x1={14} y1={150} x2={456} y2={150} stroke={MUTED} strokeWidth={0.75} strokeOpacity={0.4} />

              {done ? (
                <>
                  <text x={14} y={168} fontSize={9} fontWeight={700} fill={MUTED}>
                    남은 어림
                  </text>
                  <text x={14} y={180} fontSize={7.5} fill={MUTED}>
                    감쇠비 {RATIO.toFixed(2)}
                  </text>
                  <rect
                    x={X0}
                    y={158}
                    width={(REMAINING / MAX) * BAR_W}
                    height={16}
                    fill={WARN}
                    fillOpacity={0.3}
                    stroke={WARN}
                    strokeWidth={1}
                    strokeDasharray="3 2"
                  />
                  <text x={X0 + (REMAINING / MAX) * BAR_W + 8} y={170} fontSize={11} fontWeight={700} fill={WARN}>
                    약 {REMAINING.toFixed(0)}건 남음
                  </text>
                  <text x={96} y={192} fontSize={9} fontWeight={700} fill={WARN}>
                    세 번을 돌려 {TOTAL}건을 고쳤는데도 남은 것이 3라운드 한 번 분량보다 많습니다
                  </text>
                </>
              ) : (
                <>
                  <text x={14} y={168} fontSize={9.5} fontWeight={700} fill={MUTED}>
                    여기까지 고친 것
                  </text>
                  <text x={X0} y={168} fontSize={11} fontWeight={700} fill={OK}>
                    {ROUNDS.slice(0, shown).reduce((a, r) => a + r.n, 0)}건
                  </text>
                  <text x={14} y={190} fontSize={9} fill={MUTED}>
                    {shown < ROUNDS.length
                      ? "다음 라운드에서 또 나옵니다"
                      : "이제 남은 것을 세어 볼 차례입니다"}
                  </text>
                </>
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

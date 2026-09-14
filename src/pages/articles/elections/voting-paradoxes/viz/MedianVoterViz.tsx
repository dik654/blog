import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: median-voter 의 ExplainedFormula — 단일정점이면 중위가 이기고, 깨지면 순환이 돌아온다 */
const SCENES = [
  "이상점을 한 줄 위에 늘어놓는다",
  "중위와 왼쪽 안을 붙이면",
  "중위와 오른쪽 안을 붙이면",
  "한 사람만 산이 둘이어도 무너진다",
] as const;

const IDEALS = [2, 4, 5, 8, 9];
const MEDIAN = IDEALS[Math.floor(IDEALS.length / 2)];
const LEFT_RIVAL = 4;
const RIGHT_RIVAL = 8;

const ACCENT = "#6366f1";
const OK = "#10b981";
const WARN = "#ef4444";
const MUTED = "#94a3b8";

const X0 = 46;
const SPAN = 380;
const toX = (v: number) => X0 + (v / 10) * SPAN;

/** 이상점에서 멀어질수록 단조롭게 나빠진다고 볼 때 x를 y보다 낫다고 보는 사람 수 */
const prefers = (x: number, y: number) =>
  IDEALS.filter((ideal) => Math.abs(ideal - x) < Math.abs(ideal - y)).length;

/** 장면 4: 한 사람의 선호가 양끝에서 높고 가운데서 낮은 경우의 세 안 순위 */
const TWO_PEAKED = { label: "3번", order: ["오른쪽", "왼쪽", "가운데"] as const };

export default function MedianVoterViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3800);
  const step = scenes.active;
  const rival = step === 1 ? LEFT_RIVAL : RIGHT_RIVAL;
  const forMedian = prefers(MEDIAN, rival);
  const forRival = prefers(rival, MEDIAN);

  const NOTES = [
    `유권자 다섯 명의 이상점이 ${IDEALS.join(" · ")}입니다. 크기 순으로 세웠을 때 한가운데 있는 값이 ${MEDIAN}이고, 이 사람을 중위 유권자라고 부릅니다.`,
    `중위 ${MEDIAN} 자리에 왼쪽 도전안 ${LEFT_RIVAL} 지점이 맞서면, 이상점이 ${MEDIAN} 이상인 사람들이 전부 중위를 택해 ${forMedian}대 ${forRival}이 됩니다. 중위 자신이 그 안에 들어 있으므로 언제나 과반입니다.`,
    `오른쪽 도전안 ${RIGHT_RIVAL} 지점이 맞서도 방향만 뒤집힐 뿐 같은 이유로 ${forMedian}대 ${forRival}입니다. 어느 쪽에서 도전해도 중위가 이깁니다.`,
    "선호가 한 봉우리라는 전제가 깨지면 끝납니다. 가운데를 가장 싫어하는 사람이 한 명만 있어도 다수결은 다시 원을 그립니다.",
  ] as const;

  return (
    <VizFrame
      eyebrow="중위 투표자"
      title="선택지를 한 줄에 세울 수 있으면 한가운데가 이깁니다"
      description="순환을 피하게 해 주는 것은 규칙이 아니라 선호의 모양입니다."
      note="유권자 다섯 명, 정책을 하나의 축으로 줄인 예입니다. 축이 둘 이상이면 이 결론은 일반적으로 성립하지 않습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="중위 유권자와 그 전제"
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
              {step < 3 && (
                <g>
                  <line x1={X0} y1={120} x2={X0 + SPAN} y2={120} stroke={MUTED} strokeWidth={1} />
                  {[0, 2, 4, 6, 8, 10].map((tick) => (
                    <g key={tick}>
                      <line x1={toX(tick)} y1={116} x2={toX(tick)} y2={124} stroke={MUTED} strokeWidth={1} />
                      <text x={toX(tick)} y={136} textAnchor="middle" fontSize={8} fill={MUTED}>
                        {tick}
                      </text>
                    </g>
                  ))}
                  <text x={X0 + SPAN} y={154} textAnchor="end" fontSize={8} fill={MUTED}>
                    정책 축
                  </text>

                  {IDEALS.map((ideal, i) => {
                    const isMedian = ideal === MEDIAN;
                    const side =
                      step === 0
                        ? null
                        : Math.abs(ideal - MEDIAN) < Math.abs(ideal - rival);
                    const color = isMedian ? ACCENT : side === null ? MUTED : side ? OK : WARN;
                    return (
                      <g key={i}>
                        <circle cx={toX(ideal)} cy={120} r={isMedian ? 6 : 4.5} fill={color} fillOpacity={0.85} />
                        <text x={toX(ideal)} y={106} textAnchor="middle" fontSize={8} fontWeight={700} fill={color}>
                          {ideal}
                        </text>
                      </g>
                    );
                  })}

                  <text x={toX(MEDIAN)} y={88} textAnchor="middle" fontSize={9} fontWeight={700} fill={ACCENT}>
                    중위 {MEDIAN}
                  </text>

                  {step > 0 && (
                    <g>
                      <line x1={toX(rival)} y1={70} x2={toX(rival)} y2={96} stroke={MUTED} strokeWidth={1} strokeDasharray="4 3" />
                      <text x={toX(rival)} y={64} textAnchor="middle" fontSize={9} fontWeight={700} fill={MUTED}>
                        도전안 {rival}
                      </text>
                      <text x={X0} y={40} fontSize={9.5} fontWeight={700} fill={OK}>
                        중위 {MEDIAN} 쪽 {forMedian}명
                      </text>
                      <text x={X0 + 140} y={40} fontSize={9.5} fontWeight={700} fill={WARN}>
                        도전안 {rival} 쪽 {forRival}명
                      </text>
                      <text x={X0} y={172} fontSize={9} fill={MUTED}>
                        파랑이 중위 자신이고, 초록은 중위를 빨강은 도전안을 더 가깝게 보는 사람입니다
                      </text>
                    </g>
                  )}
                  {step === 0 && (
                    <text x={X0} y={172} fontSize={9} fill={MUTED}>
                      각 점은 그 사람이 가장 원하는 위치이며, 멀어질수록 싫어진다고 둡니다
                    </text>
                  )}
                </g>
              )}

              {step === 3 && (
                <g>
                  <text x={X0} y={28} fontSize={9} fontWeight={700} fill={MUTED}>
                    선호의 모양
                  </text>
                  <line x1={X0} y1={96} x2={X0 + 200} y2={96} stroke={MUTED} strokeWidth={1} />
                  <text x={X0} y={110} fontSize={8} fill={MUTED}>
                    왼쪽
                  </text>
                  <text x={X0 + 94} y={110} textAnchor="middle" fontSize={8} fill={MUTED}>
                    가운데
                  </text>
                  <text x={X0 + 200} y={110} textAnchor="end" fontSize={8} fill={MUTED}>
                    오른쪽
                  </text>
                  <path d={`M${X0} 84 L${X0 + 100} 40 L${X0 + 200} 88`} fill="none" stroke={OK} strokeWidth={1.25} />
                  <text x={X0 + 100} y={34} textAnchor="middle" fontSize={8} fontWeight={700} fill={OK}>
                    봉우리 하나
                  </text>
                  <path d={`M${X0} 42 L${X0 + 100} 88 L${X0 + 200} 36`} fill="none" stroke={WARN} strokeWidth={1.25} strokeDasharray="4 3" />
                  <text x={X0 + 200} y={30} textAnchor="end" fontSize={8} fontWeight={700} fill={WARN}>
                    봉우리 둘
                  </text>

                  <text x={300} y={28} fontSize={9} fontWeight={700} fill={MUTED}>
                    그때의 선호 순서
                  </text>
                  <text x={300} y={48} fontSize={9} fill={MUTED}>
                    1번 · 왼쪽 &gt; 가운데 &gt; 오른쪽
                  </text>
                  <text x={300} y={66} fontSize={9} fill={MUTED}>
                    2번 · 가운데 &gt; 오른쪽 &gt; 왼쪽
                  </text>
                  <text x={300} y={84} fontSize={9} fontWeight={700} fill={WARN}>
                    {TWO_PEAKED.label} · {TWO_PEAKED.order.join(" > ")}
                  </text>
                  <text x={300} y={108} fontSize={9} fontWeight={700} fill={WARN}>
                    왼쪽 &gt; 가운데 &gt; 오른쪽 &gt; 왼쪽
                  </text>
                  <text x={300} y={124} fontSize={8.5} fill={MUTED}>
                    순환이 그대로 돌아옵니다
                  </text>
                  <text x={X0} y={160} fontSize={9} fill={MUTED}>
                    가운데를 가장 싫어하는 사람은 이상한 사람이 아닙니다. 어중간한 타협이
                  </text>
                  <text x={X0} y={176} fontSize={9} fill={MUTED}>
                    양쪽 어느 쪽보다 나쁘다고 보는 경우가 실제로 흔합니다.
                  </text>
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

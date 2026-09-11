import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: Overview.tsx — 세 라운드와 각각의 실패 방식 */
const SCENES = ["합격 기준", "1차 조립식", "2차 단일 두상", "3차 매 단계 조건화"] as const;
const NOTES = [
  "극단적으로 다른 네 얼굴이 출력에서도 서로 구분되는가. 실행 전에 정해 뒀습니다.",
  "형태는 전달됐지만 턱 타원체가 콧수염으로, 눈썹 상자가 검은 막대로 복사됐습니다.",
  "깨끗해진 대신 결과가 서로 수렴했습니다. 조잡한 쪽이 오히려 잘 보존했습니다.",
  "성공처럼 보였는데 그 분리가 난수를 바꿔 얻는 것과 같은 크기였습니다.",
] as const;

const GOAL = "#6366f1";
const R1 = "#f59e0b";
const R2 = "#8b5cf6";
const R3 = "#ef4444";
const MUTED = "#94a3b8";

export default function RoundsViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="문제 정의"
      title="세 가지 방법으로 시도해 전부 실패했습니다"
      description="합격 기준을 먼저 정하고 각 라운드가 어디서 무너졌는지 봅니다."
      note="실패한 것은 이 세 방법이며 3차원 형태 제어 일반이 불가능하다는 뜻은 아닙니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="세 라운드의 실패"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            {step === 0 && (
              <g>
                <text x={24} y={30} fontSize={9} fill={MUTED}>
                  실행 전에 정해 둔 합격 기준
                </text>
                <rect x={24} y={48} width={432} height={44} fill={GOAL} fillOpacity={0.12} stroke={GOAL} strokeWidth={1.25} />
                <text x={240} y={68} textAnchor="middle" fontSize={10} fontWeight={700} fill={GOAL}>
                  극단적으로 다른 네 얼굴이 출력에서도 서로 구분되는가
                </text>
                <text x={240} y={84} textAnchor="middle" fontSize={8} fill={GOAL}>
                  여섯 쌍 전부가 다른 인물로 판정되어야 함
                </text>
                <text x={24} y={124} fontSize={9} fontWeight={700} fill={MUTED}>
                  왜 이 경로를 시도했는가
                </text>
                <text x={24} y={146} fontSize={8} fill={MUTED}>
                  얼굴을 문장으로 묘사하면 모델이 자기 학습 분포대로 되돌아갑니다.
                </text>
                <text x={24} y={164} fontSize={8} fill={MUTED}>
                  형태를 3차원에서 먼저 정해 두고 "사진처럼 바꿔라"만 시키면 되지 않을까.
                </text>
                <text x={24} y={188} fontSize={8} fontWeight={700} fill={GOAL}>
                  합리적인 발상이고, 세 가지 방법으로 시도해 전부 실패했습니다.
                </text>
              </g>
            )}
            {step >= 1 && (
              <g>
                {[
                  { n: "1차 · 조립식 메쉬", w: "형태는 전달", f: "부속물이 그대로 복사됨", c: R1 },
                  { n: "2차 · 단일 두상", w: "깨끗한 렌더", f: "결과가 서로 수렴", c: R2 },
                  { n: "3차 · 매 단계 조건화", w: "단조 감소 그래프", f: "분리가 난수와 같은 크기", c: R3 },
                ].map((r, i) => {
                  const on = step - 1 >= i;
                  const cur = step - 1 === i;
                  const c = on ? r.c : MUTED;
                  return (
                    <g key={r.n}>
                      <rect x={24} y={38 + i * 46} width={170} height={36} fill={c} fillOpacity={cur ? 0.16 : on ? 0.06 : 0.03} stroke={c} strokeWidth={cur ? 1.25 : 1} />
                      <text x={109} y={60 + i * 46} textAnchor="middle" fontSize={9} fontWeight={cur ? 700 : 400} fill={c}>
                        {r.n}
                      </text>
                      {on && (
                        <g>
                          <text x={210} y={52 + i * 46} fontSize={8} fill={c}>
                            얻은 것 · {r.w}
                          </text>
                          <text x={210} y={68 + i * 46} fontSize={8} fontWeight={cur ? 700 : 400} fill={c}>
                            무너진 곳 · {r.f}
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}
                <text x={24} y={192} fontSize={8} fontWeight={700} fill={MUTED}>
                  {step === 3
                    ? "실패 자체보다 실패를 확인하는 데 쓴 방법이 남을 가치가 있습니다."
                    : "각 라운드가 다른 방식으로 무너졌습니다."}
                </text>
              </g>
            )}
          </svg>
          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">{NOTES[step]}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}

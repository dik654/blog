import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: what-the-name-adds·what-to-do 절. 함의의 분해는 이 글이 정리한 것 */
const SCENES = ["두 이름", "더해지는 함의", "확인해 보면", "할 일"] as const;

const CODE = "#ef4444";
const JUDG = "#0ea5e9";
const OK = "#10b981";
const MUTED = "#94a3b8";
const INK = "#334155";

const IMPLIES = [
  { t: "모든 규정을 담았나", ok: false, why: "돌만으로 완전성은 확인할 수 없습니다" },
  { t: "장·조 번호가 원래였나", ok: false, why: "학교와 근대 편집이 붙였습니다" },
  { t: "왕이 확정했나", ok: true, why: "글 자체가 그렇게 적습니다" },
  { t: "적힌 대로 집행됐나", ok: false, why: "이 돌은 집행 빈도를 기록하지 않습니다" },
] as const;

export default function WhatTheNameAddsViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5600);
  const s = scenes.active;

  const NOTES = [
    `두 이름이 가리키는 것은 같은 돌이지만 읽는 관점이 달라집니다. 판결들이라는 이름은 구체적 상황의 판단을, 법전이라는 이름은 일반 규칙을 떠올리게 합니다. 실제 편찬 과정은 이름만으로 알 수 없습니다.`,
    `법전이라는 표제와 조항 번호를 함께 보는 독자가 떠올릴 수 있는 네 기대를 질문으로 바꿉니다. 완전성, 장·조 번호의 출처, 왕의 확정, 실제 집행입니다. 이는 단어의 필수 뜻이 아니라 사료로 점검할 질문입니다.`,
    `네 질문에서 왕이 확정했다는 것은 글 자체가 적습니다. 다룰 영역을 빠짐없이 담았는지는 돌만으로 알 수 없고, 지금 보이는 장·조 번호는 뒷사람이 붙였으며, 실제 집행 빈도도 이 돌에는 없습니다.`,
    `널리 쓰이는 이름을 버릴 필요는 없습니다. 이름을 쓰되 어디서 왔는지 적고, 떠오르는 성질을 결론에 쓸 때마다 사료에서 확인하면 됩니다.`,
  ] as const;

  return (
    <VizFrame
      eyebrow="이름이 더하는 것"
      title="법전이라는 이름에서 떠올릴 네 기대를 사료에 대어 봅니다"
      description="완전성·장과 번호의 출처·왕의 확정·집행 여부를 따로 묻습니다. 돌은 왕의 확정을 직접 적지만 나머지 질문에 같은 수준으로 답하지 않습니다."
      note="왕이 확정했다는 서술은 본문 끝 문장, 장 구분과 번호의 내력은 머리말과 65조 뒤 주의 것입니다. 네 질문은 이 글이 정리한 것이며 법전의 필수 정의가 아닙니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="법전이라는 이름에서 떠올릴 네 기대를 사료에 대어 보는 그림"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100svh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
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
              {s === 0 && (
                <g>
                  <rect x={20} y={34} width={214} height={82} rx={5} fill={JUDG} opacity={0.13} stroke={JUDG} strokeWidth={1.25} />
                  <text x={127} y={54} fontSize={10} fontWeight={700} fill={JUDG} textAnchor="middle">
                    올바름의 판결들
                  </text>
                  <text x={127} y={74} fontSize={7.5} fill={INK} textAnchor="middle">
                    구체적 상황의 판단을 떠올림
                  </text>
                  <text x={127} y={90} fontSize={7.5} fill={INK} textAnchor="middle">
                    실제 편찬 과정은 이름만으로 모름
                  </text>
                  <text x={127} y={106} fontSize={7} fill={MUTED} textAnchor="middle">
                    글이 자기를 부르는 이름
                  </text>

                  <rect x={246} y={34} width={214} height={82} rx={5} fill={CODE} opacity={0.13} stroke={CODE} strokeWidth={1.25} />
                  <text x={353} y={54} fontSize={10} fontWeight={700} fill={CODE} textAnchor="middle">
                    법전
                  </text>
                  <text x={353} y={74} fontSize={7.5} fill={INK} textAnchor="middle">
                    일반 규칙을 먼저 떠올림
                  </text>
                  <text x={353} y={90} fontSize={7.5} fill={INK} textAnchor="middle">
                    실제 집행 여부는 이름만으로 모름
                  </text>
                  <text x={353} y={106} fontSize={7} fill={MUTED} textAnchor="middle">
                    우리가 쓰는 이름
                  </text>
                </g>
              )}

              {s >= 1 && (
                <g>
                  <text x={20} y={26} fontSize={8} fontWeight={700} fill={CODE}>
                    이름과 번호를 보고 떠올릴 네 기대
                  </text>
                  {IMPLIES.map((im, i) => {
                    const y = 34 + i * 34;
                    const judged = s >= 2;
                    const col = judged ? (im.ok ? OK : MUTED) : CODE;
                    return (
                      <g key={im.t}>
                        <rect x={20} y={y} width={166} height={28} rx={4} fill={col} opacity={judged && !im.ok ? 0.07 : 0.14} stroke={col} strokeWidth={1.25} strokeDasharray={judged && !im.ok ? "3 2" : undefined} />
                        <text x={32} y={y + 18} fontSize={8} fontWeight={700} fill={INK}>
                          {im.t}
                        </text>
                        {judged && (
                          <g>
                            <text x={196} y={y + 13} fontSize={8} fontWeight={700} fill={col}>
                              {im.ok ? "직접 적힘" : "돌만으로 확인 불가"}
                            </text>
                            <text x={196} y={y + 25} fontSize={7.5} fill={INK}>
                              {im.why}
                            </text>
                          </g>
                        )}
                      </g>
                    );
                  })}
                </g>
              )}

              {s === 3 && (
                <g>
                  <rect x={20} y={172} width={440} height={0} rx={4} fill={OK} opacity={0} />
                </g>
              )}

              <text x={20} y={186} fontSize={8} fontWeight={700} fill={INK}>
                {s === 0
                  ? "같은 돌을 가리키지만 읽는 관점은 달라집니다"
                  : s === 1
                    ? "네 기대는 단어의 필수 뜻이 아닙니다"
                    : s === 2
                      ? "왕의 확정만 글 자체에 적혀 있습니다"
                      : "이름을 쓰되 출처를 적고 기대는 따로 확인합니다"}
              </text>
              <text x={20} y={196} fontSize={7.5} fill={MUTED}>
                {s === 3
                  ? "널리 쓰이는 이름을 혼자 바꾸면 가리키는 대상이 흐려집니다"
                  : "기대하는 성질을 결론에 쓸 때마다 사료에서 확인해야 합니다"}
              </text>
            </svg>
          </div>

          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-h-[10.5rem] min-[390px]:min-h-[8.75rem] sm:min-h-0">
            {NOTES[s]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}

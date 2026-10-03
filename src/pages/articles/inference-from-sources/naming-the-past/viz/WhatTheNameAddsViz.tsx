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
  { t: "빠짐없이 덮는다", ok: false, why: "지워진 다섯 단이 있고 분량도 추정입니다" },
  { t: "체계를 갖추고 있다", ok: false, why: "장 구분은 이천 년 뒤 학교가, 번호는 근대가 붙였습니다" },
  { t: "누군가 새로 정했다", ok: true, why: "왕이 확정했다고 글 자체가 적습니다" },
  { t: "그대로 집행되었다", ok: false, why: "집행을 보여 주는 것은 이 돌에 없습니다" },
] as const;

export default function WhatTheNameAddsViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5600);
  const s = scenes.active;

  const NOTES = [
    `두 이름이 가리키는 것은 같은 돌이지만 머릿속에 그려지는 것은 다릅니다. 판결들은 이미 내려진 판단을 모아 둔 것이고, 법전은 앞으로 적용될 규칙을 짜임새 있게 묶어 둔 것입니다.`,
    `법전이라는 말에는 몇 가지가 딸려 옵니다. 다룰 영역을 빠짐없이 덮고, 체계를 갖추고 있으며, 누군가 새로 정했고, 정해진 대로 집행된다는 것입니다. 이 가운데 어느 것도 이름을 쓴다고 해서 저절로 참이 되지는 않습니다.`,
    `네 가지를 사료에 대어 보면 하나만 남습니다. 왕이 확정했다는 것은 글 자체가 적어 둔 것이지만, 빠짐없음은 지워진 다섯 단 때문에 확인할 수 없고, 체계는 뒷사람이 붙인 것이며, 집행은 이 돌이 보여 주지 않습니다.`,
    `그렇다고 이름을 버릴 필요는 없습니다. 널리 쓰이는 이름을 혼자 바꾸면 가리키는 대상이 흐려집니다. 할 일은 이름을 쓰되 그 이름이 어디서 왔는지를 적고, 이름이 딸고 오는 함의를 결론에 쓸 때마다 사료에서 따로 확인하는 것입니다.`,
  ] as const;

  return (
    <VizFrame
      eyebrow="이름이 더하는 것"
      title="법전이라는 이름은 네 가지를 딸고 오고 그 가운데 하나만 사료가 받칩니다"
      description="빠짐없음·체계·새로 정함·집행이라는 함의를 하나씩 대어 보면, 왕이 확정했다는 것만 글 자체에 적혀 있습니다."
      note="왕이 확정했다는 서술은 본문 끝 문장, 장 구분과 번호의 내력은 머리말과 65조 뒤 주의 것입니다. 네 함의로 나눈 것은 이 글이 정리한 것입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="법전이라는 이름이 딸고 오는 함의를 사료에 대어 보는 그림"
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
              {s === 0 && (
                <g>
                  <rect x={20} y={34} width={214} height={82} rx={5} fill={JUDG} opacity={0.13} stroke={JUDG} strokeWidth={1.25} />
                  <text x={127} y={54} fontSize={10} fontWeight={700} fill={JUDG} textAnchor="middle">
                    올바름의 판결들
                  </text>
                  <text x={127} y={74} fontSize={7.5} fill={INK} textAnchor="middle">
                    이미 내려진 판단을 모아 둔 것
                  </text>
                  <text x={127} y={90} fontSize={7.5} fill={INK} textAnchor="middle">
                    사례가 앞서고 규칙이 뒤따름
                  </text>
                  <text x={127} y={106} fontSize={7} fill={MUTED} textAnchor="middle">
                    글이 자기를 부르는 이름
                  </text>

                  <rect x={246} y={34} width={214} height={82} rx={5} fill={CODE} opacity={0.13} stroke={CODE} strokeWidth={1.25} />
                  <text x={353} y={54} fontSize={10} fontWeight={700} fill={CODE} textAnchor="middle">
                    법전
                  </text>
                  <text x={353} y={74} fontSize={7.5} fill={INK} textAnchor="middle">
                    앞으로 적용될 규칙의 묶음
                  </text>
                  <text x={353} y={90} fontSize={7.5} fill={INK} textAnchor="middle">
                    규칙이 앞서고 사례가 뒤따름
                  </text>
                  <text x={353} y={106} fontSize={7} fill={MUTED} textAnchor="middle">
                    우리가 쓰는 이름
                  </text>
                </g>
              )}

              {s >= 1 && (
                <g>
                  <text x={20} y={26} fontSize={8} fontWeight={700} fill={CODE}>
                    법전이라는 이름이 딸고 오는 것
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
                              {im.ok ? "사료가 받침" : "받치지 않음"}
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
                  ? "같은 돌을 가리키는데 그려지는 모습이 다릅니다"
                  : s === 1
                    ? "이름을 쓴다고 이 넷이 참이 되지는 않습니다"
                    : s === 2
                      ? "넷 가운데 하나만 글 자체에 적혀 있습니다"
                      : "이름을 쓰되 출처를 적고 함의는 따로 확인합니다"}
              </text>
              <text x={20} y={196} fontSize={7.5} fill={MUTED}>
                {s === 3
                  ? "널리 쓰이는 이름을 혼자 바꾸면 가리키는 대상이 흐려집니다"
                  : "함의를 결론에 쓸 때마다 사료에서 확인해야 합니다"}
              </text>
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

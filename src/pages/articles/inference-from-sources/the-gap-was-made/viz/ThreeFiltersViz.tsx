import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: what-was-lost·copies·modern-omission 절. 세 겹의 걸름 정리는 이 글 */
const SCENES = ["돌에 새긴 것", "지움", "사본의 회수", "판본의 생략"] as const;

const WHOLE = "#0ea5e9";
const LOST = "#ef4444";
const BACK = "#10b981";
const CUT = "#f59e0b";
const MUTED = "#94a3b8";
const INK = "#334155";

export default function ThreeFiltersViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5600);
  const s = scenes.active;

  const NOTES = [
    `처음 돌에 새겨진 것은 세 덩이로 볼 수 있습니다. 왕의 칭호와 축복과 저주가 700행쯤 되고, 조항들이 그 사이에 있습니다. 이것이 출발점입니다.`,
    `첫 번째 걸름은 고대의 것입니다. 다섯 단이 긁혀 나가면서 정원사에 관한 나머지 규정과 세든 집에 관한 규정 전체, 그리고 상인과 대리인의 관계에 관한 조항들이 사라졌습니다. 무엇이 사라졌는지는 앞뒤에 남은 조항에서 짐작할 수 있지만, 그 내용이 무엇이었는지는 알 수 없습니다.`,
    `두 번째 걸름은 반대 방향입니다. 기원전 7세기에 아시리아 왕을 위해 만든 사본에서 세 조항이 알려져 있고, 그 조항들이 지워진 다섯 단 자리에 들어간다고 봅니다. 편집자는 그것을 번호 대신 다른 표시로 본문 끝에 따로 실었습니다. 돌아왔지만 같은 자격은 아니라는 표시입니다.`,
    `세 번째 걸름은 근대의 것입니다. 이 판본은 왕의 칭호와 축복과 저주 700행을 번역하지 않았습니다. 많은 주석 없이는 뜻이 통하지 않고 이 책의 목적과 거리가 멀다는 이유를 밝혀 두었습니다. 읽는 사람이 손에 드는 것은 돌에 남은 것에서 다시 한 번 걸러진 것입니다.`,
  ] as const;

  return (
    <VizFrame
      eyebrow="세 겹의 걸름"
      title="읽는 사람이 손에 드는 것은 세 번 걸러진 뒤의 것입니다"
      description="고대의 지움이 한 덩이를 없앴고 뒤늦은 사본이 세 조항을 돌려주었으며, 근대의 번역본이 또 한 덩이를 뺐습니다."
      note="지워진 내용과 아시리아 사본의 세 조항, 번역하지 않은 700행은 Johns 영역본의 편집자 주와 머리말에 적힌 것입니다. 세 겹으로 정리한 것은 이 글입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="고대의 지움과 사본의 회수와 근대 판본의 생략을 차례로 보이는 그림"
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
              {/* 막대: 칭호 / 조항 앞 / 사라진 몫 / 조항 뒤 */}
              {(() => {
                const segs = [
                  { w: 96, label: "칭호·축복·저주 700행", color: s === 3 ? CUT : WHOLE, dim: s === 3 },
                  { w: 120, label: "1~65조", color: WHOLE, dim: false },
                  { w: 84, label: "지워진 몫", color: s >= 1 ? LOST : WHOLE, dim: s >= 1 },
                  { w: 128, label: "100조 이후", color: WHOLE, dim: false },
                ];
                let x = 20;
                return segs.map((g) => {
                  const el = (
                    <g key={g.label}>
                      <rect
                        x={x}
                        y={40}
                        width={g.w}
                        height={34}
                        rx={3}
                        fill={g.color}
                        opacity={g.dim ? 0.1 : 0.22}
                        stroke={g.color}
                        strokeWidth={1.25}
                        strokeDasharray={g.dim ? "3 2" : undefined}
                      />
                      <text x={x + g.w / 2} y={60} fontSize={7.5} fontWeight={700} fill={INK} textAnchor="middle">
                        {g.label}
                      </text>
                      {g.dim && (
                        <text x={x + g.w / 2} y={86} fontSize={7} fontWeight={700} fill={g.color} textAnchor="middle">
                          빠짐
                        </text>
                      )}
                    </g>
                  );
                  x += g.w + 4;
                  return el;
                });
              })()}

              {s === 1 && (
                <g>
                  <rect x={20} y={100} width={440} height={50} rx={4} fill={LOST} opacity={0.08} stroke={LOST} strokeWidth={0.75} strokeDasharray="3 2" />
                  <text x={32} y={116} fontSize={8} fontWeight={700} fill={LOST}>
                    사라진 주제 — 앞뒤 조항에서 짐작할 수 있습니다
                  </text>
                  <text x={32} y={131} fontSize={7.5} fill={INK}>
                    정원사에 관한 나머지 규정 · 세든 집에 관한 규정 전체
                  </text>
                  <text x={32} y={144} fontSize={7.5} fill={INK}>
                    상인과 대리인의 관계에 관한 조항들
                  </text>
                </g>
              )}

              {s === 2 && (
                <g>
                  <rect x={20} y={100} width={214} height={56} rx={4} fill={BACK} opacity={0.13} stroke={BACK} strokeWidth={1.25} />
                  <text x={32} y={116} fontSize={8} fontWeight={700} fill={BACK}>
                    돌아온 세 조항
                  </text>
                  <text x={32} y={131} fontSize={7.5} fill={INK}>
                    기원전 7세기 아시리아 왕을 위한 사본
                  </text>
                  <text x={32} y={145} fontSize={7.5} fill={INK}>
                    지워진 다섯 단 자리에 들어간다고 봄
                  </text>

                  <rect x={246} y={100} width={214} height={56} rx={4} fill={MUTED} opacity={0.08} stroke={MUTED} strokeWidth={0.75} strokeDasharray="3 2" />
                  <text x={258} y={116} fontSize={8} fontWeight={700} fill={INK}>
                    같은 자격은 아니라는 표시
                  </text>
                  <text x={258} y={131} fontSize={7.5} fill={INK}>
                    번호 대신 다른 기호를 붙임
                  </text>
                  <text x={258} y={145} fontSize={7.5} fill={INK}>
                    본문 끝에 따로 실음
                  </text>
                </g>
              )}

              {s === 3 && (
                <g>
                  <rect x={20} y={100} width={440} height={50} rx={4} fill={CUT} opacity={0.1} stroke={CUT} strokeWidth={1.25} />
                  <text x={32} y={116} fontSize={8} fontWeight={700} fill={CUT}>
                    번역본이 뺀 몫 — 이유가 적혀 있습니다
                  </text>
                  <text x={32} y={131} fontSize={7.5} fill={INK}>
                    많은 주석 없이는 뜻이 통하지 않는다
                  </text>
                  <text x={32} y={144} fontSize={7.5} fill={INK}>
                    법전을 이해시키려는 이 책의 목적과 거리가 멀다
                  </text>
                </g>
              )}

              <text x={20} y={176} fontSize={8} fontWeight={700} fill={INK}>
                {s === 0
                  ? "출발점은 돌에 새겨진 전체입니다"
                  : s === 1
                    ? "고대의 지움이 한 덩이를 없앴습니다"
                    : s === 2
                      ? "뒤늦은 사본이 세 조항을 돌려주었습니다"
                      : "근대의 판본이 또 한 덩이를 뺐습니다"}
              </text>
              <text x={20} y={190} fontSize={7.5} fill={MUTED}>
                세 걸름 모두 그렇게 했다는 사실이 기록에 남아 있습니다
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

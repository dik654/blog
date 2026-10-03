import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: four-names 절. 네 이름은 Johns 영역본 표제·본문 끝·머리말 */
const SCENES = ["자기 이름", "학교의 이름", "아시리아의 이름", "근대의 이름"] as const;

const SELF = "#0ea5e9";
const SCHOOL = "#f59e0b";
const ASSYR = "#10b981";
const MODERN = "#ef4444";
const MUTED = "#94a3b8";
const INK = "#334155";

const NAMES = [
  {
    color: SELF,
    when: "돌에 새겨질 때",
    name: "올바름의 판결들",
    how: "본문 끝에서 글이 스스로를 부르는 말",
  },
  {
    color: SCHOOL,
    when: "훗날 학교에서",
    name: "Ninu ilu sirum",
    how: "바빌로니아 학교의 교재가 되며 첫 단어로 불림",
  },
  {
    color: ASSYR,
    when: "기원전 7세기",
    name: "함무라비 대왕이 세운 올바름의 판결들",
    how: "아시리아에서 다른 판으로 읽히며 붙은 이름",
  },
  {
    color: MODERN,
    when: "1903년 영역본",
    name: "세계에서 가장 오래된 법전",
    how: "오늘 우리가 이 대상을 가리키는 말",
  },
] as const;

export default function FourNamesViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5600);
  const s = scenes.active;

  const NOTES = [
    `돌에 새겨진 글은 끝에서 자기를 한 번 부릅니다. 강한 왕 함무라비가 확정하여 이 땅이 확실한 인도와 은혜로운 다스림을 얻게 한 올바름의 판결들이라는 것입니다. 이 이름은 구체적 상황에 내려진 판단을 떠올리게 합니다.`,
    `1903년 머리말은 이 글이 훗날 바빌로니아 학교의 교재가 되며 열두 장쯤으로 나뉘고, 첫머리 단어를 따서 Ninu ilu sirum이라 불렸다고 전합니다. 학교 판본의 연대를 따로 대조하지 않았으므로 머리말의 시간 간격은 여기서 채택하지 않습니다.`,
    `기원전 7세기의 아시리아에서는 또 다른 판으로 읽혔고, 거기서는 함무라비 대왕이 세운 올바름의 판결들이라는 이름이 붙은 것으로 보입니다. 자기 이름에 왕의 칭호가 더해진 꼴입니다.`,
    `오늘 이 대상을 가리키는 말은 법전입니다. 1903년 영역본의 표제는 세계에서 가장 오래된 법전이고, 본문은 1조부터 282조까지 번호가 매겨져 있습니다. 여기 놓은 네 이름의 표시 순서는 설명 순서이며 연표가 아닙니다.`,
  ] as const;

  return (
    <VizFrame
      eyebrow="네 이름"
      title="한 대상이 네 맥락에서 다른 이름으로 불렸습니다"
      description="돌에 적힌 자기 이름, 학교에서 쓴 이름, 아시리아 판의 이름, 근대 번역본의 표제를 출처별로 비교합니다. 표시 순서는 연대순이 아닙니다."
      note="네 이름은 Johns 영역본의 표제와 본문 끝 문장, 머리말에서 가져왔습니다. 머리말의 시간 간격은 학교 판본의 연대를 따로 대조하지 않아 사용하지 않습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="한 대상이 여러 맥락에서 얻은 네 이름을 출처별로 보이는 그림"
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
              <text x={30} y={182} fontSize={7.5} fill={MUTED}>
                네 이름의 출처 · 설명 순서이며 연표가 아닙니다
              </text>

              {NAMES.map((n, i) => {
                const x = 42 + i * 108;
                const lit = i <= s;
                return (
                  <g key={n.name}>
                    <circle cx={x} cy={168} r={lit ? 4.5 : 3} fill={lit ? n.color : MUTED} opacity={lit ? 1 : 0.5} />
                    <line x1={x} y1={162} x2={x} y2={146} stroke={lit ? n.color : MUTED} strokeWidth={lit ? 1.25 : 0.75} />
                    <text x={x} y={140} fontSize={7} fill={lit ? n.color : MUTED} textAnchor="middle">
                      {n.when}
                    </text>
                  </g>
                );
              })}

              {(() => {
                const n = NAMES[s];
                return (
                  <g>
                    <rect x={30} y={26} width={420} height={62} rx={5} fill={n.color} opacity={0.13} stroke={n.color} strokeWidth={1.25} />
                    <text x={44} y={46} fontSize={8} fontWeight={700} fill={n.color}>
                      {n.when}에 붙은 이름
                    </text>
                    <text x={44} y={66} fontSize={11} fontWeight={700} fill={INK}>
                      {n.name}
                    </text>
                    <text x={44} y={80} fontSize={7.5} fill={INK}>
                      {n.how}
                    </text>
                  </g>
                );
              })()}

              {s === 3 && (
                <g>
                  <rect x={30} y={96} width={420} height={32} rx={4} fill={MODERN} opacity={0.08} stroke={MODERN} strokeWidth={0.75} strokeDasharray="3 2" />
                  <text x={44} y={110} fontSize={8} fontWeight={700} fill={INK}>
                    이름과 함께 구조도 붙었습니다
                  </text>
                  <text x={44} y={122} fontSize={7.5} fill={INK}>
                    학교에서 쓰인 열두 장과 번역본의 1~282조 번호는 돌에 새겨진 것이 아닙니다
                  </text>
                </g>
              )}

              {s < 3 && (
                <text x={30} y={110} fontSize={8} fontWeight={700} fill={INK}>
                  {s === 0
                    ? "자기 이름은 판단의 모음을 가리킵니다"
                    : s === 1
                      ? "이름이 내용이 아니라 첫 줄에서 왔습니다"
                      : "자기 이름에 왕의 칭호가 더해졌습니다"}
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

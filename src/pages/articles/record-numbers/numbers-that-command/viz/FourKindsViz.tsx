import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: four-kinds·reading-prices 절. 조항은 함무라비 법전 196~204·220·225·273조 */
const SCENES = ["네 종류", "각각의 전제", "값을 읽을 때", "남는 것"] as const;

const NONE = "#ef4444";
const FIXED = "#0ea5e9";
const SHARE = "#f59e0b";
const COUNT = "#10b981";
const MUTED = "#94a3b8";
const INK = "#334155";

const KINDS = [
  {
    color: NONE,
    name: "숫자가 없는 자리",
    ex: "그의 눈을 잃게 한다 · 그의 딸을 죽인다",
    pre: "가해자 쪽에 같은 것이 있어야 합니다",
  },
  {
    color: FIXED,
    name: "고정된 금액",
    ex: "은 1마나 · 10세켈 · 5세켈",
    pre: "은의 값이 오래 안정적이어야 합니다",
  },
  {
    color: SHARE,
    name: "값의 비율",
    ex: "그 값의 절반 · 값의 4분의 1",
    pre: "그 대상에 거래되는 값이 있어야 합니다",
  },
  {
    color: COUNT,
    name: "횟수",
    ex: "집회에서 쇠가죽 채찍 60대",
    pre: "집행할 자리와 사람이 있어야 합니다",
  },
] as const;

export default function FourKindsViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5600);
  const s = scenes.active;

  const NOTES = [
    `명령하는 숫자는 한 종류가 아닙니다. 아예 숫자가 들어가지 않는 자리, 정해진 금액, 그 대상의 값에 대한 비율, 그리고 몇 번이라는 횟수까지 네 가지가 같은 법전 안에 있습니다.`,
    `네 종류는 각각 다른 것을 전제합니다. 같은 해를 돌려주려면 가해자 쪽에 같은 것이 있어야 하고, 고정된 금액이 뜻을 가지려면 은의 값이 오래 흔들리지 않아야 하며, 비율로 정하려면 그 대상에 거래되는 값이 있어야 하고, 횟수로 정하려면 집행할 자리와 사람이 있어야 합니다.`,
    `비율로 적힌 자리가 뜻밖의 정보를 줍니다. 종의 눈이나 소의 목숨에는 값이 있다고 전제되어 있고, 신사의 눈에는 그런 자리가 없습니다. 어떤 대상에 비율을 쓰고 어떤 대상에 쓰지 않았는지가, 무엇이 값으로 재는 것이었는지를 알려 줍니다.`,
    `그래도 이 숫자들은 관찰이 아닙니다. 하루 품삯이 은 6세라고 적혀 있다 해서 그 값에 사람이 실제로 일했다는 뜻은 아닙니다. 적힌 것은 그렇게 하라는 명령이고, 거기서 읽을 수 있는 것은 그 비율이 당시에 터무니없지 않았으리라는 것까지입니다.`,
  ] as const;

  return (
    <VizFrame
      eyebrow="네 종류"
      title="명령하는 숫자는 네 종류이고 각각 다른 것을 전제합니다"
      description="같은 해를 돌려주는 자리, 고정된 금액, 값의 비율, 횟수가 한 법전 안에 함께 있고, 어느 자리에 무엇을 썼는지가 그 사회에서 무엇을 값으로 쟀는지를 드러냅니다."
      note="조항과 문구는 함무라비 법전 196~204·220·225·273조의 것입니다. 네 종류로 가른 것과 각각의 전제는 이 글이 정리한 것이고 법전에 그 꼴로 적혀 있지 않습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="명령하는 숫자의 네 종류와 각각의 전제를 보이는 그림"
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
              {s <= 1 &&
                KINDS.map((k, i) => {
                  const y = 20 + i * 38;
                  return (
                    <g key={k.name}>
                      <rect x={20} y={y} width={150} height={30} rx={4} fill={k.color} opacity={0.14} stroke={k.color} strokeWidth={1.25} />
                      <text x={32} y={y + 19} fontSize={8.5} fontWeight={700} fill={INK}>
                        {k.name}
                      </text>
                      <text x={182} y={y + 19} fontSize={8} fill={INK}>
                        {k.ex}
                      </text>
                      {s === 1 && (
                        <>
                          <rect x={182} y={y + 22} width={278} height={14} rx={3} fill={MUTED} opacity={0.08} />
                          <text x={190} y={y + 32} fontSize={7.5} fill={MUTED}>
                            전제 · {k.pre}
                          </text>
                        </>
                      )}
                    </g>
                  );
                })}

              {s === 2 && (
                <g>
                  <rect x={20} y={24} width={214} height={74} rx={5} fill={SHARE} opacity={0.13} stroke={SHARE} strokeWidth={1.25} />
                  <text x={32} y={42} fontSize={8.5} fontWeight={700} fill={SHARE}>
                    비율로 적힌 자리
                  </text>
                  <text x={32} y={58} fontSize={7.5} fill={INK}>
                    종의 눈 · 그 값의 절반 (220조)
                  </text>
                  <text x={32} y={72} fontSize={7.5} fill={INK}>
                    죽은 소·양 · 값의 4분의 1 (225조)
                  </text>
                  <text x={32} y={88} fontSize={7.5} fill={MUTED}>
                    값이 있다고 전제된 대상입니다
                  </text>

                  <rect x={246} y={24} width={214} height={74} rx={5} fill={NONE} opacity={0.1} stroke={NONE} strokeWidth={1.25} strokeDasharray="3 2" />
                  <text x={258} y={42} fontSize={8.5} fontWeight={700} fill={NONE}>
                    비율이 쓰이지 않은 자리
                  </text>
                  <text x={258} y={58} fontSize={7.5} fill={INK}>
                    신사의 눈 · 같은 해를 돌려줌 (196조)
                  </text>
                  <text x={258} y={72} fontSize={7.5} fill={INK}>
                    신사의 딸의 죽음 · 그의 딸 (210조)
                  </text>
                  <text x={258} y={88} fontSize={7.5} fill={MUTED}>
                    값으로 재지 않는 자리입니다
                  </text>

                  <rect x={20} y={110} width={440} height={34} rx={4} fill={INK} opacity={0.06} stroke={INK} strokeWidth={0.75} />
                  <text x={32} y={125} fontSize={8} fontWeight={700} fill={INK}>
                    어디에 비율을 썼고 어디에 쓰지 않았는지가
                  </text>
                  <text x={32} y={139} fontSize={8} fill={INK}>
                    무엇이 값으로 재는 것이었는지를 알려 줍니다
                  </text>
                </g>
              )}

              {s === 3 && (
                <g>
                  <rect x={20} y={24} width={214} height={72} rx={5} fill={FIXED} opacity={0.13} stroke={FIXED} strokeWidth={1.25} />
                  <text x={32} y={42} fontSize={8.5} fontWeight={700} fill={FIXED}>
                    읽을 수 있는 것
                  </text>
                  <text x={32} y={58} fontSize={7.5} fill={INK}>
                    무엇을 어느 칸에 두었는가
                  </text>
                  <text x={32} y={72} fontSize={7.5} fill={INK}>
                    값으로 잰 것과 재지 않은 것의 경계
                  </text>
                  <text x={32} y={88} fontSize={7.5} fill={INK}>
                    비율이 터무니없지 않았으리라는 것
                  </text>

                  <rect x={246} y={24} width={214} height={72} rx={5} fill={NONE} opacity={0.1} stroke={NONE} strokeWidth={1.25} strokeDasharray="3 2" />
                  <text x={258} y={42} fontSize={8.5} fontWeight={700} fill={NONE}>
                    읽을 수 없는 것
                  </text>
                  <text x={258} y={58} fontSize={7.5} fill={INK}>
                    실제로 치러진 값
                  </text>
                  <text x={258} y={72} fontSize={7.5} fill={INK}>
                    이 조항이 지켜졌는지
                  </text>
                  <text x={258} y={88} fontSize={7.5} fill={INK}>
                    수의 해상도나 검산
                  </text>

                  <rect x={20} y={108} width={440} height={36} rx={4} fill={INK} opacity={0.06} stroke={INK} strokeWidth={0.75} />
                  <text x={32} y={124} fontSize={8} fontWeight={700} fill={INK}>
                    명령하는 숫자를 관찰된 값으로 바꿔 읽으면
                  </text>
                  <text x={32} y={138} fontSize={8} fill={INK}>
                    적힌 적 없는 주장이 사료에서 나온 것처럼 보이게 됩니다
                  </text>
                </g>
              )}

              <text x={20} y={192} fontSize={8} fontWeight={700} fill={INK}>
                {s === 0
                  ? "같은 법전 안에 네 종류가 함께 있습니다"
                  : s === 1
                    ? "종류마다 성립 조건이 다릅니다"
                    : s === 2
                      ? "값으로 잰 것과 재지 않은 것이 갈려 있습니다"
                      : "명령 숫자에서 관찰값을 꺼낼 수는 없습니다"}
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

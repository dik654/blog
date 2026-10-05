import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: the-assumption·if-it-moves 절 — 저자 자신이 적은 반사실 */
const SCENES = [
  "자본이 머무르면 각자 하나씩 맡습니다",
  "움직일 수 있다면 어디로 갑니까",
  "저자 자신이 둘 다 한쪽에서 만들어진다고 적습니다",
  "그러면 이윤율 차이가 사라집니다",
] as const;

const ENG = "#6366f1";
const POR = "#0ea5e9";
const MOVE = "#ef4444";
const MUTED = "#94a3b8";
const INK = "#334155";

export default function CapitalMovesViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5200);
  const s = scenes.active;

  const NOTES = [
    `자본이 나라에 머문다면 영국의 자본은 영국 안에서 쓰입니다. 영국은 상대적으로 덜 불리한 옷감에, 포르투갈은 포도주에 자기 자본을 씁니다. 1단계에서 본 교역의 이득이 여기서 나옵니다.`,
    `그런데 포르투갈은 옷감도 ${90}명이면 만듭니다. 영국은 ${100}명이 들고요. 영국 자본이 포르투갈로 옮겨 갈 수 있다면 옷감을 거기서 만드는 편이 그 자본에게 낫습니다. 막는 것이 없다면요.`,
    `Ricardo가 이 경우를 직접 적습니다. 그렇게 되면 포도주와 옷감이 둘 다 포르투갈에서 만들어지고, 영국에서 옷감을 만들던 자본과 노동이 그리로 옮겨 가는 편이 영국 자본가에게도 두 나라 소비자에게도 이롭다고 합니다.`,
    `그리고 그 경우의 결론도 적습니다. 자본이 가장 이익이 되는 곳으로 자유롭게 흐르면 이윤율에 차이가 없어지고, 물건 값의 차이는 시장까지 옮기는 데 더 드는 품만 남습니다. 두 나라를 가르던 구분 자체가 사라집니다.`,
  ] as const;

  return (
    <VizFrame
      eyebrow="전제가 풀리면"
      title="자본이 국경을 넘을 수 있으면 같은 장이 다른 결론으로 갑니다"
      description="이 반사실은 비판자가 지적한 것이 아니라 저자가 같은 장에서 직접 적어 둔 것입니다."
      note="장면 3과 4의 내용은 Ricardo(1817) 7장의 서술이고, 장면 2의 물음은 그 서술로 넘어가기 위해 이 글이 둔 것입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="자본이 머무를 때와 움직일 때의 생산 배치"
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
              {/* 두 나라 상자 */}
              <rect x={40} y={46} width={150} height={96} rx={5} fill={ENG} opacity={0.09} stroke={ENG} strokeWidth={1.25} />
              <text x={115} y={40} fontSize={8.5} fontWeight={700} fill={ENG} textAnchor="middle">
                영국
              </text>
              <rect x={250} y={46} width={150} height={96} rx={5} fill={POR} opacity={0.09} stroke={POR} strokeWidth={1.25} />
              <text x={325} y={40} fontSize={8.5} fontWeight={700} fill={POR} textAnchor="middle">
                포르투갈
              </text>

              {/* 생산 배치 */}
              {s <= 1 && (
                <g>
                  <rect x={70} y={78} width={90} height={30} rx={4} fill={ENG} opacity={0.65} />
                  <text x={115} y={97} fontSize={8.5} fontWeight={700} fill="#ffffff" textAnchor="middle">
                    옷감
                  </text>
                  <rect x={280} y={78} width={90} height={30} rx={4} fill={POR} opacity={0.65} />
                  <text x={325} y={97} fontSize={8.5} fontWeight={700} fill="#ffffff" textAnchor="middle">
                    포도주
                  </text>
                </g>
              )}

              {s >= 2 && (
                <g>
                  <rect x={272} y={64} width={106} height={28} rx={4} fill={POR} opacity={0.65} />
                  <text x={325} y={82} fontSize={8.5} fontWeight={700} fill="#ffffff" textAnchor="middle">
                    포도주
                  </text>
                  <rect x={272} y={100} width={106} height={28} rx={4} fill={MOVE} opacity={0.7} />
                  <text x={325} y={118} fontSize={8.5} fontWeight={700} fill="#ffffff" textAnchor="middle">
                    옷감
                  </text>
                  <text x={115} y={97} fontSize={8.5} fontWeight={700} fill={MUTED} textAnchor="middle">
                    (비어 있음)
                  </text>
                </g>
              )}

              {/* 자본의 이동 */}
              {s >= 1 && (
                <g>
                  <line
                    x1={192}
                    y1={94}
                    x2={248}
                    y2={94}
                    stroke={MOVE}
                    strokeWidth={1.25}
                    strokeDasharray={s === 1 ? "4 3" : undefined}
                  />
                  <polygon points="248,94 241,90 241,98" fill={MOVE} />
                  <text x={220} y={86} fontSize={8} fontWeight={700} fill={MOVE} textAnchor="middle">
                    자본
                  </text>
                  {s === 1 && (
                    <text x={220} y={112} fontSize={7.5} fill={MUTED} textAnchor="middle">
                      넘을 수 있습니까
                    </text>
                  )}
                </g>
              )}

              {s === 3 && (
                <g>
                  <text x={40} y={164} fontSize={8.5} fontWeight={700} fill={MOVE}>
                    이윤율 차이 없음 · 값 차이는 옮기는 품만 남음
                  </text>
                </g>
              )}

              <text x={20} y={186} fontSize={8.5} fontWeight={700} fill={INK}>
                {s === 0
                  ? "자본이 머물면 각자 상대적으로 나은 쪽을 맡습니다"
                  : s === 1
                    ? "포르투갈은 옷감도 90명이면 만듭니다"
                    : s === 2
                      ? "둘 다 포르투갈에서 만들어집니다"
                      : "두 나라를 가르던 구분 자체가 사라집니다"}
              </text>
              <text x={20} y={196} fontSize={7.5} fill={MUTED}>
                장면 3·4는 저자가 같은 장에서 직접 적어 둔 경우입니다
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

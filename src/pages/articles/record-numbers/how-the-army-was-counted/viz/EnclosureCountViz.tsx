import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: procedure·what-was-counted 절. 절차는 헤로도토스 7권 60절 */
const SCENES = [
  "1만 명 모으기",
  "담 쌓기",
  "채우고 비우기",
  "170번",
] as const;

const PEN = "#0ea5e9";
const WALL = "#f59e0b";
const MUTED = "#94a3b8";
const INK = "#334155";

export default function EnclosureCountViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5200);
  const s = scenes.active;

  const NOTES = [
    `첫 단계는 1만 명을 한곳에 모으고 할 수 있는 만큼 빽빽하게 세우는 것입니다. 이 1만 명을 어떻게 세었는지는 사료에 적혀 있지 않습니다. 절차의 출발점이 이미 다른 방법으로 얻은 수라는 뜻입니다.`,
    `모인 사람들 바깥으로 원을 두르고, 1만 명을 나가게 한 뒤 그 원의 둘레에 거친 돌로 담을 쌓습니다. 담의 높이는 사람의 배꼽까지입니다. 여기서 눈금 하나가 만들어집니다. 이 담 안의 공간이 곧 1만 명이라는 단위가 됩니다.`,
    `다음부터는 사람을 세지 않습니다. 다른 사람들을 그 안으로 들여보내 공간을 채우고, 다 차면 내보내고 다시 채웁니다. 세는 사람이 하는 일은 사람을 헤아리는 것이 아니라 채움이 몇 번이었는지를 헤아리는 것입니다.`,
    `보병 전체가 170만으로 나왔습니다. 눈금이 1만이므로 이 수는 채움 170번을 뜻합니다. 그러니까 기록된 것은 사람 1,700,000명을 헤아린 결과가 아니라 1만 단위를 170번 적용한 결과이고, 두 가지는 정확도가 다릅니다.`,
  ] as const;

  // 담 안을 채운 사람들. 원(cx 118, cy 92, r 56) 안에 들어가도록 가운데 정렬합니다.
  const DOTS = Array.from({ length: 42 }, (_, i) => ({
    x: 118 + ((i % 7) - 3) * 10,
    y: 92 + (Math.floor(i / 7) - 2.5) * 10,
  }));

  return (
    <VizFrame
      eyebrow="세는 절차"
      title="사람을 헤아리는 대신 1만 명이 들어가는 공간을 만들어 몇 번 찼는지를 헤아렸습니다"
      description="1만 명을 빽빽하게 세우고 그 둘레에 배꼽 높이의 담을 쌓아 눈금을 만든 뒤, 남은 사람들을 그 안에 넣고 비우기를 반복했습니다."
      note="절차와 170만이라는 수는 헤로도토스 『역사』 7권 60절의 것입니다. Macaulay 영역본으로 읽었습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="1만 명이 들어가는 담을 만들어 채움 횟수를 헤아리는 절차를 보이는 그림"
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
              {/* 원·담 */}
              <circle
                cx={118}
                cy={92}
                r={56}
                fill={PEN}
                opacity={s === 0 ? 0.06 : 0.1}
                stroke={s >= 1 ? WALL : MUTED}
                strokeWidth={s >= 1 ? 1.25 : 0.75}
                strokeDasharray={s === 0 ? "3 2" : undefined}
              />
              {s >= 1 && (
                <text x={118} y={28} fontSize={8} fontWeight={700} fill={WALL} textAnchor="middle">
                  배꼽 높이의 거친 돌담
                </text>
              )}
              {s === 0 && (
                <text x={118} y={28} fontSize={8} fontWeight={700} fill={MUTED} textAnchor="middle">
                  바깥으로 원을 두름
                </text>
              )}

              {(s === 0 || s === 2) &&
                DOTS.map((d, i) => (
                  <circle key={i} cx={d.x} cy={d.y} r={2.4} fill={PEN} opacity={0.75} />
                ))}
              {s === 1 && (
                <text x={118} y={96} fontSize={8} fill={MUTED} textAnchor="middle">
                  사람을 내보낸 뒤
                </text>
              )}
              {s === 3 && (
                <g>
                  <text x={118} y={88} fontSize={11} fontWeight={700} fill={PEN} textAnchor="middle">
                    1만
                  </text>
                  <text x={118} y={104} fontSize={8} fill={INK} textAnchor="middle">
                    눈금 하나
                  </text>
                </g>
              )}

              <text x={118} y={162} fontSize={7.5} fill={INK} textAnchor="middle">
                {s === 0
                  ? "1만 명을 할 수 있는 만큼 빽빽하게"
                  : s === 1
                    ? "둘레에 담을 쌓아 눈금을 고정"
                    : s === 2
                      ? "채우고 내보내고 다시 채움"
                      : "채움 횟수가 수가 됨"}
              </text>

              {/* 오른쪽 설명 */}
              {s === 0 && (
                <g>
                  <rect x={204} y={46} width={256} height={56} rx={4} fill={MUTED} opacity={0.08} stroke={MUTED} strokeWidth={0.75} strokeDasharray="3 2" />
                  <text x={216} y={62} fontSize={8} fontWeight={700} fill={INK}>
                    적혀 있지 않은 것
                  </text>
                  <text x={216} y={78} fontSize={7.5} fill={INK}>
                    이 1만 명을 무엇으로 세었는지
                  </text>
                  <text x={216} y={92} fontSize={7.5} fill={MUTED}>
                    절차의 출발점이 다른 방법에서 옵니다
                  </text>
                </g>
              )}

              {s === 1 && (
                <g>
                  <rect x={204} y={46} width={256} height={56} rx={4} fill={WALL} opacity={0.12} stroke={WALL} strokeWidth={1.25} />
                  <text x={216} y={62} fontSize={8} fontWeight={700} fill={INK}>
                    여기서 단위가 만들어집니다
                  </text>
                  <text x={216} y={78} fontSize={7.5} fill={INK}>
                    담 안의 공간 = 1만 명
                  </text>
                  <text x={216} y={92} fontSize={7.5} fill={INK}>
                    한 번 쌓은 뒤로는 바뀌지 않습니다
                  </text>
                </g>
              )}

              {s === 2 && (
                <g>
                  {[0, 1, 2].map((i) => (
                    <g key={i}>
                      <rect x={214 + i * 48} y={56} width={40} height={24} rx={3} fill={PEN} opacity={0.16} stroke={PEN} strokeWidth={0.75} />
                      <text x={234 + i * 48} y={71} fontSize={7.5} fontWeight={700} fill={INK} textAnchor="middle">
                        {i + 1}번
                      </text>
                    </g>
                  ))}
                  <text x={360} y={71} fontSize={8} fill={MUTED}>
                    …
                  </text>
                  <text x={214} y={96} fontSize={8} fill={INK}>
                    세는 대상이 사람에서 채움으로 바뀝니다
                  </text>
                </g>
              )}

              {s === 3 && (
                <g>
                  <rect x={204} y={46} width={256} height={64} rx={4} fill={PEN} opacity={0.12} stroke={PEN} strokeWidth={1.25} />
                  <text x={216} y={62} fontSize={8} fontWeight={700} fill={INK}>
                    적힌 수 · 보병 170만
                  </text>
                  <text x={216} y={78} fontSize={7.5} fill={INK}>
                    1만 × 170번 = 1,700,000
                  </text>
                  <text x={216} y={92} fontSize={7.5} fill={INK}>
                    사람을 하나하나 헤아린 수가 아닙니다
                  </text>
                  <text x={216} y={105} fontSize={7.5} fill={MUTED}>
                    세어진 것은 채움의 횟수입니다
                  </text>
                </g>
              )}

              <text x={204} y={184} fontSize={8} fontWeight={700} fill={INK}>
                {s === 0
                  ? "출발점의 1만은 다른 방법으로 얻은 수입니다"
                  : s === 1
                    ? "눈금을 만드는 일과 세는 일이 분리됩니다"
                    : s === 2
                      ? "반복할 때 드는 품이 사람 수에 비례하지 않습니다"
                      : "기록된 수의 해상도는 1만입니다"}
              </text>
            </svg>
          </div>

          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-h-[14rem] min-[390px]:min-h-[8.75rem] sm:min-h-0">
            {NOTES[s]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}

import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: how-it-vanished·the-numbering 절. 돌의 상태는 Johns 영역본 머리말과 65조 뒤 편집자 주 */
const SCENES = ["돌기둥", "긁어낸 자리", "번호의 구멍", "35라는 추정"] as const;

const KEPT = "#0ea5e9";
const GONE = "#ef4444";
const GUESS = "#f59e0b";
const MUTED = "#94a3b8";
const INK = "#334155";

export default function ErasedColumnsViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5600);
  const s = scenes.active;

  const NOTES = [
    `돌기둥은 검은 섬록암이고 높이가 8피트에 가깝습니다. 조각난 채로 발견되었지만 쉽게 다시 맞춰졌습니다. 앞면에는 왕이 태양신에게서 법을 받는 모습이 새겨져 있고 그 아래로 글이 이어집니다.`,
    `앞면에는 원래 글이 더 있었습니다. 다섯 단이 긁혀 나가고 돌이 다시 매끄럽게 다듬어졌습니다. 그 자리에 자기 이름과 칭호를 새기려 한 정복자의 작업으로 보이는데, 실제로 새기지는 않았습니다. 그래서 지웠다는 사실은 남고 누가 지웠는지는 남지 않았습니다.`,
    `지워진 다섯 단만큼 조항이 사라졌습니다. 번역본에서 조항 번호는 65에서 바로 100으로 건너뜁니다. 그 사이의 번호들은 본문이 비어 있는 자리가 아니라 아예 할당되지 않은 자리입니다.`,
    `65와 100 사이의 간격은 세어서 나온 수가 아닙니다. 편집자는 셰일이 사라진 부분을 35개 조항으로 추정했다고 적고, 그 추정을 따라 100부터 다시 시작한다고 밝힙니다. 그러니 조항 번호 자체가 추정값을 담고 있습니다.`,
  ] as const;

  const COLS = 16;

  return (
    <VizFrame
      eyebrow="지워진 다섯 단"
      title="조항 번호가 65에서 100으로 건너뛰는 것은 세어서가 아니라 추정해서입니다"
      description="앞면의 다섯 단이 긁혀 나가고 돌이 다시 다듬어졌으며, 사라진 분량을 35개 조항으로 본 추정에 따라 번호가 100부터 다시 시작합니다."
      note="돌의 상태와 지워진 단, 35개 조항이라는 추정은 C. H. W. Johns 영역본(1903년 판)의 머리말과 65조 뒤 편집자 주에 적힌 것입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="돌기둥의 지워진 단과 조항 번호의 간격을 보이는 그림"
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
              {/* 앞면 */}
              <text x={20} y={24} fontSize={8} fontWeight={700} fill={MUTED}>
                앞면
              </text>
              <rect x={20} y={30} width={56} height={34} rx={3} fill={MUTED} opacity={0.12} stroke={MUTED} strokeWidth={0.75} />
              <text x={48} y={44} fontSize={7} fill={INK} textAnchor="middle">
                왕이 법을
              </text>
              <text x={48} y={56} fontSize={7} fill={INK} textAnchor="middle">
                받는 모습
              </text>

              {Array.from({ length: COLS }, (_, i) => (
                <rect key={i} x={84 + i * 13} y={30} width={9} height={34} rx={1.5} fill={KEPT} opacity={0.3} stroke={KEPT} strokeWidth={0.75} />
              ))}
              <text x={84 + COLS * 13 + 4} y={44} fontSize={7.5} fill={KEPT}>
                16단 · 1,114행
              </text>

              {Array.from({ length: 5 }, (_, i) => (
                <rect
                  key={i}
                  x={84 + (COLS + 1) * 13 + 56 + i * 13}
                  y={30}
                  width={9}
                  height={34}
                  rx={1.5}
                  fill={s >= 1 ? GONE : KEPT}
                  opacity={s >= 1 ? 0.12 : 0.3}
                  stroke={s >= 1 ? GONE : KEPT}
                  strokeWidth={s >= 1 ? 1.25 : 0.75}
                  strokeDasharray={s >= 1 ? "2 2" : undefined}
                />
              ))}
              <text x={84 + (COLS + 1) * 13 + 56 + 32} y={76} fontSize={7.5} fontWeight={700} fill={s >= 1 ? GONE : MUTED} textAnchor="middle">
                {s >= 1 ? "다섯 단 · 긁어내고 다시 다듬음" : "다섯 단"}
              </text>

              {/* 뒷면 */}
              <text x={20} y={100} fontSize={8} fontWeight={700} fill={MUTED}>
                뒷면
              </text>
              {Array.from({ length: 28 }, (_, i) => (
                <rect key={i} x={84 + i * 13} y={88} width={9} height={26} rx={1.5} fill={KEPT} opacity={0.3} stroke={KEPT} strokeWidth={0.75} />
              ))}
              <text x={20} y={112} fontSize={7.5} fill={KEPT}>
                28단
              </text>

              {s >= 2 && (
                <g>
                  <rect x={20} y={128} width={440} height={48} rx={4} fill={s === 3 ? GUESS : GONE} opacity={0.1} stroke={s === 3 ? GUESS : GONE} strokeWidth={1.25} strokeDasharray="3 2" />
                  <text x={32} y={144} fontSize={8} fontWeight={700} fill={INK}>
                    {s === 2 ? "번역본의 조항 번호" : "간격을 정한 것"}
                  </text>
                  {s === 2 ? (
                    <g>
                      <text x={32} y={160} fontSize={10} fontWeight={700} fill={INK}>
                        … 64 · 65 　　　　　 100 · 101 …
                      </text>
                      <text x={32} y={172} fontSize={7.5} fill={MUTED}>
                        사이의 번호는 비어 있는 것이 아니라 할당되지 않았습니다
                      </text>
                    </g>
                  ) : (
                    <g>
                      <text x={32} y={160} fontSize={8} fill={INK}>
                        셰일이 사라진 부분을 35개 조항으로 추정했고, 편집자가 그 추정을 따라 100부터 다시 시작했습니다
                      </text>
                      <text x={32} y={172} fontSize={7.5} fontWeight={700} fill={GUESS}>
                        그러므로 조항 번호에는 추정값이 들어 있습니다
                      </text>
                    </g>
                  )}
                </g>
              )}

              {s < 2 && (
                <text x={20} y={150} fontSize={8} fontWeight={700} fill={INK}>
                  {s === 0
                    ? "검은 섬록암 · 높이 8피트에 가까움 · 조각난 채 발견되어 다시 맞춤"
                    : "그 자리에 아무것도 새겨지지 않아 누가 가져갔는지는 알 수 없습니다"}
                </text>
              )}

              <text x={20} y={192} fontSize={8} fontWeight={700} fill={INK}>
                {s === 0
                  ? "앞면 16단과 뒷면 28단이 남아 있습니다"
                  : s === 1
                    ? "손상이 아니라 자리를 비우려는 작업이었습니다"
                    : s === 2
                      ? "사라진 분량만큼 번호가 건너뜁니다"
                      : "번호를 인용할 때 그 안의 추정도 함께 인용됩니다"}
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

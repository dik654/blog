import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: dispersed 절 — 중앙이 알아야 할 것과 각자가 알아야 할 것의 차이 */
const SCENES = [
  "중앙이 같은 답을 내려면",
  "각자가 알아야 할 것은",
  "사정이 바뀌면 중앙은",
  "각자는 비교를 한 번 더 합니다",
] as const;

/** 앞 글과 같은 시장 */
const WTP = [10, 9, 8, 7, 6, 5] as const;
const MC = [4, 5, 6, 7, 8, 9] as const;
const SHOCK = 2;
const P_BEFORE = 7;
const P_AFTER = 8;

const CENTRAL = WTP.length + MC.length;
const INDIVIDUAL = 2;

const OK = "#10b981";
const WARN = "#ef4444";
const ACCENT = "#6366f1";
const MUTED = "#94a3b8";

const CELL = 30;
const LEFT_X = 92;

export default function KnowledgeSplitViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200);
  const s = scenes.active;
  const after = s >= 2;
  const showIndividual = s === 1 || s === 3;
  const price = after ? P_AFTER : P_BEFORE;

  const NOTES = [
    `앞 글의 답을 중앙에서 다시 내려면 낼 수 있는 금액 ${WTP.length}개와 드는 값 ${MC.length}개, 모두 ${CENTRAL}개의 숫자를 모아야 합니다. 그리고 그 숫자들은 각자의 머릿속에 있지 한곳에 적혀 있지 않습니다.`,
    `같은 답에 이르는 데 각자가 필요한 것은 ${INDIVIDUAL}개뿐입니다. 자기 숫자 하나와 시장 값 하나입니다. 남이 얼마를 낼 수 있는지도, 남에게 얼마가 드는지도 알 필요가 없습니다.`,
    `재료값이 모두 ${SHOCK}씩 올랐다고 하겠습니다. 중앙은 바뀐 숫자를 다시 받아야 하고, 그러려면 누가 무엇이 바뀌었는지를 다시 물어야 합니다. 물어서 답을 받는다는 보장도 없습니다.`,
    `시장에서는 값이 ${P_BEFORE}에서 ${P_AFTER}로 움직이고 각자는 자기 숫자를 새 값과 견주는 비교를 한 번 더 합니다. 필요한 정보는 여전히 ${INDIVIDUAL}개이고, 왜 올랐는지는 몰라도 됩니다.`,
  ] as const;

  return (
    <VizFrame
      eyebrow="누가 무엇을 알아야 하는가"
      title="중앙이 알아야 할 것은 사람 수에 비례하고 각자가 알아야 할 것은 둘입니다"
      description="같은 답에 이르는 두 경로인데 필요한 정보의 양이 전혀 다릅니다."
      note="앞 글과 같은 시장입니다. 실제로는 이 숫자들이 고정되어 있지도 않고 본인도 정확히 알지 못합니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="중앙과 개인이 필요로 하는 정보량"
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
              <text x={14} y={22} fontSize={8.5} fontWeight={700} fill={WARN}>
                중앙이 모아야 할 숫자
              </text>
              <text x={14} y={40} fontSize={8} fill={MUTED}>
                낼 수 있는
              </text>
              {WTP.map((w, i) => (
                <g key={`w${i}`}>
                  <rect
                    x={LEFT_X + i * CELL}
                    y={30}
                    width={CELL - 5}
                    height={16}
                    fill={ACCENT}
                    fillOpacity={0.24}
                    stroke={ACCENT}
                    strokeWidth={1}
                  />
                  <text x={LEFT_X + i * CELL + 7} y={42} fontSize={9} fontWeight={700} fill={ACCENT}>
                    {w}
                  </text>
                </g>
              ))}
              <text x={14} y={66} fontSize={8} fill={MUTED}>
                드는 값
              </text>
              {MC.map((m, i) => {
                const v = after ? m + SHOCK : m;
                return (
                  <g key={`m${i}`}>
                    <rect
                      x={LEFT_X + i * CELL}
                      y={56}
                      width={CELL - 5}
                      height={16}
                      fill={after ? WARN : OK}
                      fillOpacity={0.24}
                      stroke={after ? WARN : OK}
                      strokeWidth={1}
                    />
                    <text
                      x={LEFT_X + i * CELL + 7}
                      y={68}
                      fontSize={9}
                      fontWeight={700}
                      fill={after ? WARN : OK}
                    >
                      {v}
                    </text>
                  </g>
                );
              })}
              <text x={LEFT_X + 6 * CELL + 8} y={54} fontSize={11} fontWeight={700} fill={WARN}>
                {CENTRAL}개
              </text>
              {after && (
                <text x={LEFT_X + 6 * CELL + 8} y={70} fontSize={8} fontWeight={700} fill={WARN}>
                  전부 다시
                </text>
              )}

              <line x1={14} y1={88} x2={456} y2={88} stroke={MUTED} strokeWidth={0.75} strokeOpacity={0.4} />

              <text x={14} y={108} fontSize={8.5} fontWeight={700} fill={showIndividual ? OK : MUTED}>
                각자가 알아야 할 숫자
              </text>
              <g opacity={showIndividual ? 1 : 0.25}>
                <rect x={LEFT_X} y={116} width={CELL - 5} height={16} fill={OK} fillOpacity={0.3} stroke={OK} strokeWidth={1} />
                <text x={LEFT_X + 7} y={128} fontSize={9} fontWeight={700} fill={OK}>
                  {WTP[2]}
                </text>
                <text x={LEFT_X + CELL + 2} y={128} fontSize={8} fill={MUTED}>
                  자기 숫자
                </text>

                <rect x={LEFT_X + 96} y={116} width={CELL - 5} height={16} fill={OK} fillOpacity={0.3} stroke={OK} strokeWidth={1} />
                <text x={LEFT_X + 103} y={128} fontSize={9} fontWeight={700} fill={OK}>
                  {price}
                </text>
                <text x={LEFT_X + 96 + CELL + 2} y={128} fontSize={8} fill={MUTED}>
                  시장 값
                </text>

                <text x={LEFT_X + 196} y={128} fontSize={11} fontWeight={700} fill={OK}>
                  {INDIVIDUAL}개
                </text>
                <text x={LEFT_X + 232} y={128} fontSize={8} fontWeight={700} fill={MUTED}>
                  시장이 커져도 그대로
                </text>
              </g>

              <line x1={14} y1={148} x2={456} y2={148} stroke={MUTED} strokeWidth={0.75} strokeOpacity={0.4} />
              <text x={14} y={168} fontSize={9} fontWeight={700} fill={MUTED}>
                {s === 0
                  ? `중앙은 사람 수에 비례해 늘어납니다`
                  : s === 1
                    ? `${WTP[2]}까지 낼 수 있는 사람은 값 ${price}과 견주기만 하면 됩니다`
                    : s === 2
                      ? `바뀐 숫자를 다시 물어야 하고 사실대로 답할 이유도 없습니다`
                      : `${WTP[2]}과 ${price}을 견주어 이번에는 물러납니다`}
              </text>
              <text x={14} y={188} fontSize={9} fontWeight={700} fill={s === 3 ? ACCENT : MUTED}>
                {s === 3
                  ? "값이 움직였다는 사실 하나가 바뀐 사정 전부를 대신했습니다"
                  : "같은 답인데 한쪽은 열두 개, 다른 쪽은 둘입니다"}
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

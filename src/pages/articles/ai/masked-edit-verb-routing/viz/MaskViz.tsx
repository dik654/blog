import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: MaskPolarity.tsx — 교체는 넓혀야 하고 지우기는 넓히면 안 됨 */
const SCENES = ["교체 · 딱 맞는 마스크", "교체 · 넓힌 마스크", "지우기 · 넓히면", "반대 방향"] as const;
const NOTES = [
  "마스크가 옛 물건에 붙어 있으면 새 물건이 어디서 끝나야 하는지 볼 수 없습니다.",
  "정강이까지 열어 주면 그제야 관절식 각반이 나옵니다. 다만 160까지 가면 파편이 생깁니다.",
  "지우기는 준 것을 지웁니다. 24픽셀만 넓혀도 아래 레이어까지 함께 사라집니다.",
  "같은 이름의 손잡이가 한쪽에서는 필수이고 다른 쪽에서는 금지입니다.",
] as const;

const OBJ = "#6366f1";
const GROW = "#10b981";
const OVER = "#ef4444";
const MUTED = "#94a3b8";

export default function MaskViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="마스크 기하"
      title="확장값의 방향이 동작마다 반대입니다"
      description="같은 파라미터가 교체에서는 필수이고 지우기에서는 금지입니다."
      note="수치는 한 소스·한 마스크의 스윕이며 대상 크기에 따라 적정값이 달라집니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="마스크 확장 방향"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            {step <= 2 && (
              <g>
                <text x={24} y={24} fontSize={9} fill={MUTED}>
                  {step <= 1 ? "부츠를 금속 각반으로" : "초록 띠를 지워 줘"}
                </text>
                <rect x={60} y={44} width={70} height={104} fill={MUTED} fillOpacity={0.06} stroke={MUTED} strokeWidth={1} />
                <text x={95} y={38} textAnchor="middle" fontSize={8} fill={MUTED}>
                  다리
                </text>
                {step <= 1 && (
                  <g>
                    <rect x={64} y={108} width={62} height={36} fill={OBJ} fillOpacity={0.2} stroke={OBJ} strokeWidth={1.25} />
                    <text x={95} y={130} textAnchor="middle" fontSize={8} fontWeight={700} fill={OBJ}>
                      부츠
                    </text>
                    <rect
                      x={step === 0 ? 62 : 62}
                      y={step === 0 ? 106 : 72}
                      width={66}
                      height={step === 0 ? 40 : 74}
                      fill="none"
                      stroke={step === 0 ? OVER : GROW}
                      strokeWidth={1.25}
                      strokeDasharray="4 3"
                    />
                    <text x={140} y={step === 0 ? 126 : 92} fontSize={8} fontWeight={700} fill={step === 0 ? OVER : GROW}>
                      {step === 0 ? "확장 0 · 대상에 딱 맞음" : "확장 96 · 정강이까지"}
                    </text>
                    <text x={140} y={step === 0 ? 140 : 106} fontSize={8} fill={step === 0 ? OVER : GROW}>
                      {step === 0 ? "부츠 모양의 금속이 나옴" : "관절식 각반이 나옴"}
                    </text>
                  </g>
                )}
                {step === 2 && (
                  <g>
                    <rect x={64} y={86} width={62} height={14} fill={GROW} fillOpacity={0.25} stroke={GROW} strokeWidth={1.25} />
                    <text x={140} y={96} fontSize={8} fontWeight={700} fill={GROW}>
                      초록 띠 — 지울 대상
                    </text>
                    <rect x={64} y={102} width={62} height={16} fill={OBJ} fillOpacity={0.2} stroke={OBJ} strokeWidth={1.25} />
                    <text x={140} y={114} fontSize={8} fill={OBJ}>
                      가죽 벨트 — 남아야 하는 것
                    </text>
                    <rect x={60} y={70} width={70} height={48} fill="none" stroke={OVER} strokeWidth={1.25} strokeDasharray="4 3" />
                    <text x={140} y={140} fontSize={8} fontWeight={700} fill={OVER}>
                      확장 24 · 아래 레이어까지 함께 사라짐
                    </text>
                  </g>
                )}
                {step === 0 && (
                  <text x={24} y={176} fontSize={8} fill={OVER}>
                    선택을 대상에 정확히 맞추는 것이 조심스러워 보이지만 교체에서는 결과를 나쁘게 만듭니다.
                  </text>
                )}
                {step === 1 && (
                  <g>
                    <text x={24} y={170} fontSize={8} fill={GROW}>
                      전체 프레임 73.3 → 영역 크롭 44.8 → 확장 48에서 33.8 → 96에서 32.4
                    </text>
                    <text x={24} y={186} fontSize={8} fill={OVER}>
                      160에서 28.7로 더 내려가지만 떠다니는 금속 파편이 생깁니다.
                    </text>
                  </g>
                )}
                {step === 2 && (
                  <text x={24} y={176} fontSize={8} fill={OVER}>
                    96에서는 전체가 번집니다. 지우기의 기본값은 0이어야 합니다.
                  </text>
                )}
              </g>
            )}
            {step === 3 && (
              <g>
                <text x={24} y={26} fontSize={9} fill={MUTED}>
                  같은 파라미터, 반대 기본값
                </text>
                <rect x={24} y={44} width={200} height={62} fill={GROW} fillOpacity={0.1} stroke={GROW} strokeWidth={1.25} />
                <text x={124} y={64} textAnchor="middle" fontSize={9} fontWeight={700} fill={GROW}>
                  교체 · 기본 96
                </text>
                <text x={124} y={82} textAnchor="middle" fontSize={8} fill={GROW}>
                  새 물건이 끝날 자리를 보여 줘야 함
                </text>
                <text x={124} y={98} textAnchor="middle" fontSize={8} fill={MUTED}>
                  "딱 맞게 잡으면 나빠집니다" 경고 동반
                </text>
                <rect x={256} y={44} width={200} height={62} fill={OVER} fillOpacity={0.1} stroke={OVER} strokeWidth={1.25} />
                <text x={356} y={64} textAnchor="middle" fontSize={9} fontWeight={700} fill={OVER}>
                  지우기 · 기본 0
                </text>
                <text x={356} y={82} textAnchor="middle" fontSize={8} fill={OVER}>
                  준 것을 지우므로 넓힌 만큼 더 지움
                </text>
                <text x={356} y={98} textAnchor="middle" fontSize={8} fill={MUTED}>
                  "넓히지 마세요" 경고 동반
                </text>
                <text x={24} y={140} fontSize={9} fontWeight={700} fill={MUTED}>
                  두 동작이 같은 도구에 들어갈 수 없는 이유입니다.
                </text>
                <text x={24} y={164} fontSize={8} fill={MUTED}>
                  사실 이것은 "모델이 참고할 범위"와 "모델이 칠할 범위" 두 손잡이인데
                </text>
                <text x={24} y={180} fontSize={8} fill={MUTED}>
                  하나가 둘을 겸하고 있어 96이 타협값이 됩니다.
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

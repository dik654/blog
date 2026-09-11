import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: Overview.tsx — 세 축이 만나는 지점에서 후보가 줄어든다 */
const SCENES = ["학습 목표 축", "과제 요구 축", "배포 비용 축", "교집합"] as const;
const NOTES = [
  "모델이 무엇을 정답으로 삼아 학습했는지가 어떤 정보를 남겼는지를 정합니다.",
  "질의 형태와 출력 형태, 자리 정보 필요 여부가 요구 능력을 정합니다.",
  "지연 예산과 색인 규모가 감당 가능한 크기를 정합니다.",
  "세 축이 만나는 자리에 후보가 두세 개 남습니다. 그다음은 재는 단계입니다.",
] as const;

const OBJ = "#6366f1";
const TASK = "#10b981";
const COST = "#f59e0b";
const MUTED = "#94a3b8";

export default function AxesViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="선택의 축"
      title="순위표가 아니라 세 축의 교집합에서 고릅니다"
      description="각 축이 후보 집합을 어떻게 좁히는지 순서대로 봅니다."
      note="원의 크기와 위치는 개념도이며 실제 모델 분포가 아닙니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="백본 선택의 세 축"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            <circle cx={190} cy={82} r={56} fill={OBJ} fillOpacity={step >= 0 ? 0.1 : 0} stroke={OBJ} strokeWidth={1.25} />
            <text x={160} y={44} fontSize={9} fontWeight={700} fill={OBJ}>
              학습 목표
            </text>
            {step >= 1 && (
              <g>
                <circle cx={246} cy={82} r={56} fill={TASK} fillOpacity={0.1} stroke={TASK} strokeWidth={1.25} />
                <text x={266} y={44} fontSize={9} fontWeight={700} fill={TASK}>
                  과제 요구
                </text>
              </g>
            )}
            {step >= 2 && (
              <g>
                <circle cx={218} cy={124} r={56} fill={COST} fillOpacity={0.1} stroke={COST} strokeWidth={1.25} />
                <text x={196} y={190} fontSize={9} fontWeight={700} fill={COST}>
                  배포 비용
                </text>
              </g>
            )}
            {step >= 3 && (
              <g>
                <circle cx={218} cy={98} r={13} fill={TASK} fillOpacity={0.35} stroke={TASK} strokeWidth={1.25} />
                <text x={218} y={102} textAnchor="middle" fontSize={8} fontWeight={700} fill="#065f46">
                  후보
                </text>
                <line x1={231} y1={98} x2={330} y2={98} stroke={MUTED} strokeWidth={1} />
                <rect x={330} y={78} width={130} height={40} fill="none" stroke={TASK} strokeWidth={1.25} />
                <text x={395} y={94} textAnchor="middle" fontSize={9} fontWeight={700} fill={TASK}>
                  2~3개로 축소
                </text>
                <text x={395} y={110} textAnchor="middle" fontSize={8} fill={MUTED}>
                  다음은 짧은 실측
                </text>
              </g>
            )}
            <text x={340} y={40} fontSize={9} fill={MUTED}>
              {step === 0 && "무엇을 남기고 무엇을 버렸는가"}
              {step === 1 && "질의·출력·자리 정보"}
              {step === 2 && "지연 예산과 색인 규모"}
              {step === 3 && "여기서부터 숫자로 결정"}
            </text>
          </svg>
          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">{NOTES[step]}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}

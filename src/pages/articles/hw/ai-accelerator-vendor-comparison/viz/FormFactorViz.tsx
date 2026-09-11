import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: FormFactor.tsx — 폼팩터가 정하는 네 가지 */
const SCENES = ["카드 형태", "모듈 형태", "전력과 냉각", "조달 선택지"] as const;
const NOTES = [
  "표준 슬롯에 꽂습니다. 일반 서버에 들어가지만 급전과 발열에 상한이 있습니다.",
  "베이스보드에 얹습니다. 전력과 냉각, 그리고 전용 링크 배선을 보드가 책임집니다.",
  "전력이 올라가면 공랭으로 감당할 수 없어 액체 냉각이 전제가 됩니다.",
  "모듈 규격이 공개 규격이면 여러 서버 제조사의 섀시를 쓸 수 있습니다.",
] as const;

const CARD = "#6366f1";
const MOD = "#10b981";
const HEAT = "#ef4444";
const OPEN = "#f59e0b";
const MUTED = "#94a3b8";

export default function FormFactorViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="폼팩터"
      title="어디에 얹느냐가 전력 상한을 정합니다"
      description="카드 형태와 모듈 형태가 각각 무엇을 전제하는지 봅니다."
      note="구체적인 전력값은 제품과 냉각 방식에 따라 다르며 그림은 관계만 보여 줍니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="폼팩터와 전력·냉각 관계"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            <rect x={20} y={44} width={200} height={90} fill="none" stroke={step === 0 ? CARD : MUTED} strokeWidth={step === 0 ? 1.25 : 1} />
            <text x={120} y={38} textAnchor="middle" fontSize={9} fontWeight={700} fill={step === 0 ? CARD : MUTED}>
              카드 형태 (확장 슬롯)
            </text>
            {[0, 1].map((i) => (
              <rect key={i} x={40 + i * 90} y={60} width={60} height={58} fill={CARD} fillOpacity={step === 0 ? 0.16 : 0.06} stroke={step === 0 ? CARD : MUTED} strokeWidth={1} />
            ))}
            <text x={120} y={150} textAnchor="middle" fontSize={8} fill={step === 0 ? CARD : MUTED}>
              슬롯 급전 상한 · 공랭 중심
            </text>

            <rect x={260} y={44} width={200} height={90} fill="none" stroke={step >= 1 ? MOD : MUTED} strokeWidth={step >= 1 ? 1.25 : 1} />
            <text x={360} y={38} textAnchor="middle" fontSize={9} fontWeight={700} fill={step >= 1 ? MOD : MUTED}>
              모듈 형태 (베이스보드)
            </text>
            {[0, 1, 2, 3].map((i) => (
              <rect
                key={i}
                x={274 + (i % 2) * 92}
                y={58 + Math.floor(i / 2) * 34}
                width={80}
                height={28}
                fill={MOD}
                fillOpacity={step >= 1 ? 0.16 : 0.06}
                stroke={step >= 1 ? MOD : MUTED}
                strokeWidth={1}
              />
            ))}
            <text x={360} y={150} textAnchor="middle" fontSize={8} fill={step >= 1 ? MOD : MUTED}>
              보드가 전력·냉각·링크 배선 책임
            </text>

            {step >= 2 && (
              <g>
                <rect x={20} y={162} width={200} height={26} fill={HEAT} fillOpacity={0.08} stroke={HEAT} strokeWidth={1} />
                <text x={120} y={179} textAnchor="middle" fontSize={9} fontWeight={700} fill={HEAT}>
                  전력 ↑ → 액체 냉각 전제
                </text>
              </g>
            )}
            {step >= 3 && (
              <g>
                <rect x={260} y={162} width={200} height={26} fill={OPEN} fillOpacity={0.08} stroke={OPEN} strokeWidth={1} />
                <text x={360} y={179} textAnchor="middle" fontSize={9} fontWeight={700} fill={OPEN}>
                  공개 규격이면 섀시 선택지가 넓음
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

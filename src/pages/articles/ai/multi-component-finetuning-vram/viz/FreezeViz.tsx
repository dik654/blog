import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: ResidencySet.tsx — 동결이 줄이는 것과 줄이지 않는 것 */
const SCENES = ["전체 미세조정", "동결 적용", "어댑터 추가", "무엇이 줄었나"] as const;
const NOTES = [
  "모든 파라미터가 학습 대상이면 gradient와 optimizer state가 전부 붙습니다.",
  "동결하면 그 두 항목이 사라집니다. 가중치와 activation은 그대로입니다.",
  "어댑터만 학습 대상이 되어 두 항목이 어댑터 크기로 돌아옵니다.",
  "줄어든 것은 gradient와 optimizer state뿐입니다. 나머지 두 갈래는 그대로입니다.",
] as const;

const W = "#6366f1";
const G = "#f59e0b";
const O = "#ef4444";
const A = "#10b981";
const MUTED = "#94a3b8";

export default function FreezeViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  const bars = [
    { label: "가중치", color: W, w: [300, 300, 300, 300][step] },
    { label: "gradient", color: G, w: [300, 0, 6, 6][step] },
    { label: "optimizer state", color: O, w: [600, 0, 12, 12][step] },
    { label: "activation", color: A, w: [220, 220, 220, 220][step] },
  ];
  return (
    <VizFrame
      eyebrow="동결의 효과"
      title="줄어드는 항목은 두 개뿐입니다"
      description="막대 길이는 같은 축에서의 상대 크기이며 예시 구성 기준입니다."
      note="실제 비율은 모델과 옵티마이저, 실행 조건에 따라 달라집니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="동결과 어댑터가 줄이는 항목"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            {bars.map((b, i) => {
              const y = 40 + i * 36;
              const width = Math.min(b.w / 2, 300);
              return (
                <g key={b.label}>
                  <text x={20} y={y + 14} fontSize={9} fill={b.color}>
                    {b.label}
                  </text>
                  <rect x={140} y={y} width={300} height={20} fill="none" stroke={MUTED} strokeWidth={0.5} />
                  <rect x={140} y={y} width={width} height={20} fill={b.color} fillOpacity={0.3} stroke={b.color} strokeWidth={1} />
                  {width < 12 && (
                    <text x={158} y={y + 14} fontSize={8} fill={b.color}>
                      거의 0
                    </text>
                  )}
                </g>
              );
            })}
            <text x={140} y={30} fontSize={9} fill={MUTED}>
              같은 축의 상대 크기
            </text>
            {step === 3 && (
              <g>
                <rect x={20} y={184} width={440} height={14} fill={A} fillOpacity={0.06} stroke={A} strokeWidth={1} />
                <text x={240} y={195} textAnchor="middle" fontSize={9} fontWeight={700} fill={A}>
                  가중치와 activation은 그대로이므로 예산의 대부분이 남습니다
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

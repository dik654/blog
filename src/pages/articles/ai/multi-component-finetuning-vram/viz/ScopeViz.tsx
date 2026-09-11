import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: AdapterScope.tsx — 역전파 경로와 base 상주 */
const SCENES = ["어댑터 위치", "순전파", "역전파 경로", "무엇이 남아야 하나"] as const;
const NOTES = [
  "어댑터는 base 블록 옆에 붙어 출력을 더합니다. 학습되는 것은 이 작은 텐서뿐입니다.",
  "순전파는 base 블록을 그대로 지납니다. base 가중치가 없으면 계산이 되지 않습니다.",
  "기울기는 어댑터까지 도달하려면 그 뒤의 base 블록들을 통과해야 합니다.",
  "그래서 base 가중치와 경로상의 activation이 모두 남아 있어야 합니다.",
] as const;

const BASE = "#6366f1";
const AD = "#10b981";
const PATH = "#f59e0b";
const MUTED = "#94a3b8";

export default function ScopeViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="어댑터 범위"
      title="학습 대상이 작아도 경로는 그대로입니다"
      description="블록 네 개짜리 단순화한 경로입니다."
      note="어댑터를 어느 모듈에 붙이느냐에 따라 살아 있어야 하는 경로가 달라집니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="어댑터와 역전파 경로"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            {[0, 1, 2, 3].map((i) => {
              const x = 30 + i * 110;
              const hasAdapter = i === 1 || i === 2;
              return (
                <g key={i}>
                  <rect x={x} y={70} width={84} height={40} fill={BASE} fillOpacity={0.12} stroke={BASE} strokeWidth={1.25} />
                  <text x={x + 42} y={94} textAnchor="middle" fontSize={9} fontWeight={700} fill={BASE}>
                    block {i + 1}
                  </text>
                  {hasAdapter && (
                    <g>
                      <rect x={x + 24} y={34} width={36} height={20} fill={AD} fillOpacity={0.3} stroke={AD} strokeWidth={1.25} />
                      <text x={x + 42} y={48} textAnchor="middle" fontSize={8} fontWeight={700} fill={AD}>
                        LoRA
                      </text>
                      <line x1={x + 42} y1={54} x2={x + 42} y2={70} stroke={AD} strokeWidth={1} />
                    </g>
                  )}
                  {i < 3 && <line x1={x + 84} y1={90} x2={x + 110} y2={90} stroke={step >= 1 ? BASE : MUTED} strokeWidth={1} />}
                </g>
              );
            })}

            {step >= 2 && (
              <g>
                <path d="M 444 118 L 444 134 L 40 134 L 40 118" fill="none" stroke={PATH} strokeWidth={1.25} />
                <text x={240} y={150} textAnchor="middle" fontSize={9} fontWeight={700} fill={PATH}>
                  기울기가 어댑터에 닿으려면 뒤쪽 블록을 모두 통과
                </text>
              </g>
            )}

            {step >= 3 && (
              <g>
                <rect x={30} y={162} width={414} height={30} fill={PATH} fillOpacity={0.07} stroke={PATH} strokeWidth={1.25} />
                <text x={237} y={181} textAnchor="middle" fontSize={9} fontWeight={700} fill={PATH}>
                  base 가중치 + 경로상 activation 모두 상주
                </text>
              </g>
            )}
            <text x={30} y={26} fontSize={9} fill={MUTED}>
              {step === 0 ? "학습 대상은 초록 텐서뿐입니다" : "회색이 아니라 파란 경로가 실제 비용입니다"}
            </text>
          </svg>
          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">{NOTES[step]}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}

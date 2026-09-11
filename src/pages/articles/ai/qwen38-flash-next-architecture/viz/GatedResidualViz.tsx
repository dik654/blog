import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: GatedResidual.tsx — 네 갈래 stream의 mix와 주입 */
const SCENES = ["네 갈래 통로", "저랭크 게이트로 섞기", "블록 계산", "갈래마다 다른 세기로 주입"] as const;

const NOTES = [
  "토큰 하나가 층 사이로 들고 가는 상태는 2,560차원 네 벌, 합쳐서 10,240차원입니다.",
  "갈래별 정규화 뒤 10,240을 320으로 줄였다가 펼쳐 게이트를 만들고, 가중 평균 하나가 블록 입력이 됩니다.",
  "블록은 평소처럼 2,560차원 입력 하나만 받습니다. attention이든 MoE든 내부는 바뀌지 않습니다.",
  "출력에 갈래별 계수를 곱해 되돌립니다. 계수는 0과 2 사이라 어떤 갈래는 증폭되고 어떤 갈래는 거의 남지 않습니다.",
] as const;

const STREAM = "#6366f1";
const GATE = "#8b5cf6";
const BLOCK = "#10b981";
const MUTED = "#94a3b8";
const INJECT = [1.6, 0.9, 0.2, 1.1];

export default function GatedResidualViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2800);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="gated residual"
      title="블록은 하나를 받고 넷에 되돌립니다"
      description="한 층에서 attention 앞과 MoE 앞에 각각 한 번씩, 같은 절차가 두 번 반복됩니다."
      note="주입 계수 값은 범위를 보여 주기 위한 예시이며 학습된 실제 값이 아닙니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="gated residual의 mix와 주입"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(step + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            {[0, 1, 2, 3].map((lane) => (
              <g key={lane}>
                <line x1={24} y1={40 + lane * 34} x2={456} y2={40 + lane * 34} stroke={MUTED} strokeWidth={1} />
                <rect x={24} y={30 + lane * 34} width={56} height={20} fill={STREAM} fillOpacity={0.12} stroke={STREAM} strokeWidth={1} />
                <text x={52} y={44 + lane * 34} textAnchor="middle" fontSize={9} fontWeight={700} fill={STREAM}>
                  stream {lane + 1}
                </text>
              </g>
            ))}

            {step >= 1 && (
              <g>
                <rect x={128} y={62} width={72} height={78} fill={GATE} fillOpacity={0.1} stroke={GATE} strokeWidth={1.25} />
                <text x={164} y={94} textAnchor="middle" fontSize={9} fontWeight={700} fill={GATE}>
                  10240
                </text>
                <text x={164} y={108} textAnchor="middle" fontSize={9} fontWeight={700} fill={GATE}>
                  → 320 →
                </text>
                <text x={164} y={122} textAnchor="middle" fontSize={9} fontWeight={700} fill={GATE}>
                  10240
                </text>
                {[0, 1, 2, 3].map((lane) => (
                  <line key={lane} x1={80} y1={40 + lane * 34} x2={128} y2={101} stroke={GATE} strokeWidth={1} />
                ))}
              </g>
            )}

            {step >= 2 && (
              <g>
                <line x1={200} y1={101} x2={248} y2={101} stroke={BLOCK} strokeWidth={1} />
                <rect x={248} y={78} width={88} height={46} fill={BLOCK} fillOpacity={0.1} stroke={BLOCK} strokeWidth={1.25} />
                <text x={292} y={98} textAnchor="middle" fontSize={10} fontWeight={700} fill={BLOCK}>
                  attention · MoE
                </text>
                <text x={292} y={113} textAnchor="middle" fontSize={9} fill={MUTED}>
                  입력 2560
                </text>
              </g>
            )}

            {step >= 3 && (
              <g>
                {[0, 1, 2, 3].map((lane) => (
                  <g key={lane}>
                    <line x1={336} y1={101} x2={400} y2={40 + lane * 34} stroke={BLOCK} strokeWidth={1} />
                    <rect
                      x={400}
                      y={30 + lane * 34}
                      width={56}
                      height={20}
                      fill={BLOCK}
                      fillOpacity={INJECT[lane] / 2.4}
                      stroke={BLOCK}
                      strokeWidth={1}
                    />
                    <text x={428} y={44 + lane * 34} textAnchor="middle" fontSize={9} fontWeight={700} fill={BLOCK}>
                      × {INJECT[lane].toFixed(1)}
                    </text>
                  </g>
                ))}
              </g>
            )}

            <text x={24} y={186} fontSize={9} fill={MUTED}>
              층 입력 10,240차원
            </text>
            <text x={456} y={186} textAnchor="end" fontSize={9} fill={MUTED}>
              층 출력 10,240차원
            </text>
          </svg>
          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {NOTES[step]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}

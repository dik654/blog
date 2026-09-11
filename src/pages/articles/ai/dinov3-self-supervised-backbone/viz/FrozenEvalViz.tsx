import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: UseBoundary.tsx — 얼린 평가와 미세조정의 주장 차이 */
const SCENES = ["얼린 backbone", "선형 head만 학습", "head를 키우면", "미세조정은 다른 주장"] as const;

const NOTES = [
  "가중치를 고정합니다. 이 조건에서 나온 점수는 표현 자체의 성질에 가깝습니다.",
  "학습되는 것은 마지막 선형층뿐입니다. 점수 차이의 대부분이 backbone에서 나옵니다.",
  "head가 커질수록 head가 과제를 푸는 능력이 커져 backbone 차이가 가려집니다.",
  "backbone까지 학습하면 표현이 바뀝니다. 결론은 표현 품질이 아니라 초기값의 유용성이 됩니다.",
] as const;

const FROZEN = "#6366f1";
const HEAD = "#10b981";
const WARN = "#f59e0b";
const MUTED = "#94a3b8";

export default function FrozenEvalViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2800);
  const step = scenes.active;
  const headHeight = step === 2 ? 54 : 20;
  const trainBackbone = step === 3;
  return (
    <VizFrame
      eyebrow="평가 조건"
      title="무엇을 학습시키느냐가 결론의 주어를 바꿉니다"
      description="같은 backbone이라도 어디까지 학습을 허용하느냐에 따라 점수가 말해 주는 내용이 달라집니다."
      note="그림은 평가 조건의 차이만 보여 주며 특정 과제의 점수를 나타내지 않습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="얼린 평가와 미세조정의 차이"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(step + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            <rect
              x={120}
              y={96}
              width={240}
              height={62}
              fill={trainBackbone ? WARN : FROZEN}
              fillOpacity={trainBackbone ? 0.18 : 0.08}
              stroke={trainBackbone ? WARN : FROZEN}
              strokeWidth={1.25}
              strokeDasharray={trainBackbone ? "0" : "4 3"}
            />
            <text x={240} y={124} textAnchor="middle" fontSize={11} fontWeight={700} fill={trainBackbone ? WARN : FROZEN}>
              backbone
            </text>
            <text x={240} y={142} textAnchor="middle" fontSize={9} fill={MUTED}>
              {trainBackbone ? "함께 학습됨" : "가중치 고정"}
            </text>

            {step >= 1 && (
              <g>
                <rect
                  x={120}
                  y={96 - headHeight - 10}
                  width={240}
                  height={headHeight}
                  fill={step === 2 ? WARN : HEAD}
                  fillOpacity={0.15}
                  stroke={step === 2 ? WARN : HEAD}
                  strokeWidth={1.25}
                />
                <text
                  x={240}
                  y={96 - headHeight / 2 - 6}
                  textAnchor="middle"
                  fontSize={10}
                  fontWeight={700}
                  fill={step === 2 ? WARN : HEAD}
                >
                  {step === 2 ? "큰 head" : "선형 head"}
                </text>
                <line x1={240} y1={96} x2={240} y2={96 - 10} stroke={MUTED} strokeWidth={1} />
              </g>
            )}

            <text x={120} y={178} fontSize={9} fontWeight={700} fill={MUTED}>
              {step === 0 && "점수는 표현이 이미 담고 있는 정보를 잰다"}
              {step === 1 && "점수 차이의 대부분이 backbone에서 나온다"}
              {step === 2 && "backbone 차이가 head 능력에 가려진다"}
              {step === 3 && "결론의 주어가 표현에서 초기값으로 바뀐다"}
            </text>
            <text x={120} y={38} fontSize={9} fill={MUTED}>
              학습되는 부분을 실선으로 표시
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

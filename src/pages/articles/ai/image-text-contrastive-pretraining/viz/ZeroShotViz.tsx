import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: ZeroShot.tsx — 범주 이름에서 분류기를 만드는 절차 */
const SCENES = ["범주 이름", "문장 틀 적용", "평균과 정규화", "내적으로 예측"] as const;
const NOTES = [
  "분류하려는 범주 목록만 있으면 시작할 수 있습니다. 학습은 다시 하지 않습니다.",
  "범주마다 여러 형태의 문장을 만듭니다. 학습 캡션과 비슷한 형태일수록 유리합니다.",
  "범주별로 문장 벡터를 평균 내고 다시 정규화하면 분류기 가중치 행렬이 됩니다.",
  "이미지 벡터와의 내적이 가장 큰 범주를 고릅니다. 온도는 순위를 바꾸지 않습니다.",
] as const;

const NAME = "#8b5cf6";
const VEC = "#6366f1";
const PICK = "#10b981";
const MUTED = "#94a3b8";
const LABELS = ["고양이", "강아지", "자전거"];

export default function ZeroShotViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  const scores = [0.31, 0.22, 0.47];
  return (
    <VizFrame
      eyebrow="zero-shot 분류"
      title="텍스트 인코더가 분류기를 그 자리에서 만듭니다"
      description="범주 세 개로 줄인 예시입니다."
      note="점수는 절차를 보여 주기 위한 예시이며 실제 모델 출력이 아닙니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="zero-shot 분류기 구성"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            {LABELS.map((l, i) => (
              <g key={l}>
                <rect x={20} y={44 + i * 42} width={70} height={28} fill={NAME} fillOpacity={0.12} stroke={NAME} strokeWidth={1} />
                <text x={55} y={62 + i * 42} textAnchor="middle" fontSize={9} fontWeight={700} fill={NAME}>
                  {l}
                </text>
                {step >= 1 && (
                  <g>
                    <line x1={90} y1={58 + i * 42} x2={110} y2={58 + i * 42} stroke={MUTED} strokeWidth={1} />
                    {[0, 1, 2].map((k) => (
                      <rect key={k} x={110} y={44 + i * 42 + k * 9} width={92} height={7} fill={NAME} fillOpacity={0.2} stroke={NAME} strokeWidth={0.5} />
                    ))}
                  </g>
                )}
                {step >= 2 && (
                  <g>
                    <line x1={202} y1={58 + i * 42} x2={222} y2={58 + i * 42} stroke={MUTED} strokeWidth={1} />
                    <rect
                      x={222}
                      y={48 + i * 42}
                      width={80}
                      height={20}
                      fill={step >= 3 && i === 2 ? PICK : VEC}
                      fillOpacity={0.25}
                      stroke={step >= 3 && i === 2 ? PICK : VEC}
                      strokeWidth={1}
                    />
                    <text x={262} y={62 + i * 42} textAnchor="middle" fontSize={8} fill={step >= 3 && i === 2 ? PICK : VEC}>
                      w{i + 1}
                    </text>
                  </g>
                )}
                {step >= 3 && (
                  <text x={312} y={62 + i * 42} fontSize={9} fontWeight={i === 2 ? 700 : 400} fill={i === 2 ? PICK : MUTED}>
                    v · w{i + 1} = {scores[i].toFixed(2)}
                  </text>
                )}
              </g>
            ))}
            {step >= 1 && (
              <text x={110} y={38} fontSize={8} fill={NAME}>
                문장 틀 3개
              </text>
            )}
            {step >= 2 && (
              <text x={222} y={38} fontSize={8} fill={VEC}>
                평균 후 정규화
              </text>
            )}
            {step >= 3 && (
              <g>
                <rect x={380} y={44} width={80} height={112} fill="none" stroke={PICK} strokeWidth={1.25} />
                <text x={420} y={92} textAnchor="middle" fontSize={9} fontWeight={700} fill={PICK}>
                  예측
                </text>
                <text x={420} y={110} textAnchor="middle" fontSize={10} fontWeight={700} fill={PICK}>
                  자전거
                </text>
              </g>
            )}
            <text x={20} y={186} fontSize={9} fill={MUTED}>
              범주 목록을 바꾸면 분류기도 바로 바뀝니다
            </text>
          </svg>
          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">{NOTES[step]}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}

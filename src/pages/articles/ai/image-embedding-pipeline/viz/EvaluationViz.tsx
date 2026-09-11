import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: Evaluation.tsx — 정답 정의와 근거 누출 */
const SCENES = ["시각적 근접", "과제 기준 정답", "근거 누출", "분할을 고친 뒤"] as const;
const NOTES = [
  "색이 비슷한 사진이 먼저 올라옵니다. 사람 눈에는 가깝습니다.",
  "과제가 '같은 제품의 다른 각도'라면 색만 닮은 사진은 오답입니다.",
  "같은 촬영 세션을 질의와 정답으로 나누면 배경으로 맞혀도 점수가 오릅니다.",
  "세션이 겹치지 않게 나누면 점수는 내려가지만 실제 사용과 맞아집니다.",
] as const;

const HIT = "#10b981";
const MISS = "#ef4444";
const LEAK = "#f59e0b";
const MUTED = "#94a3b8";

export default function EvaluationViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  const results = [
    { label: "같은 제품 · 다른 각도", correct: true },
    { label: "색만 비슷한 다른 제품", correct: false },
    { label: "같은 세션 · 같은 배경", correct: step < 3 },
    { label: "같은 제품 · 다른 조명", correct: true },
  ];
  return (
    <VizFrame
      eyebrow="평가"
      title="정답 정의가 점수의 의미를 정합니다"
      description="한 질의의 상위 4개 결과를 과제 기준으로 다시 채점해 봅니다."
      note="결과 구성은 흔한 실패 유형을 보여 주기 위한 예시입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="이미지 검색 평가의 함정"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            <rect x={24} y={44} width={72} height={60} fill="none" stroke={MUTED} strokeWidth={1.25} />
            <text x={60} y={78} textAnchor="middle" fontSize={9} fontWeight={700} fill={MUTED}>
              질의
            </text>
            <text x={24} y={120} fontSize={8} fill={MUTED}>
              같은 제품 찾기
            </text>

            {results.map((r, i) => {
              const y = 40 + i * 34;
              const judged = step >= 1;
              const leak = step === 2 && i === 2;
              const color = !judged ? MUTED : leak ? LEAK : r.correct ? HIT : MISS;
              return (
                <g key={r.label}>
                  <rect x={128} y={y} width={30} height={26} fill={color} fillOpacity={0.2} stroke={color} strokeWidth={1} />
                  <text x={168} y={y + 17} fontSize={9} fill={color}>
                    {r.label}
                  </text>
                  {judged && (
                    <text x={420} y={y + 17} fontSize={9} fontWeight={700} fill={color}>
                      {leak ? "누출" : r.correct ? "정답" : "오답"}
                    </text>
                  )}
                </g>
              );
            })}
            <text x={128} y={190} fontSize={9} fontWeight={700} fill={step === 3 ? HIT : step === 2 ? LEAK : MUTED}>
              {step === 0 && "순위만 보면 잘 동작하는 것처럼 보입니다"}
              {step === 1 && "과제 기준으로 채점하면 2번이 오답입니다"}
              {step === 2 && "3번은 배경으로 맞힌 것이라 점수가 부풀려집니다"}
              {step === 3 && "세션 분할 후 점수는 낮지만 실제 사용과 맞습니다"}
            </text>
          </svg>
          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">{NOTES[step]}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}

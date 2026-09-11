import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: SoftmaxLoss.tsx — 행 정규화와 대각선 정답 */
const SCENES = ["유사도 행렬", "온도 적용", "행마다 정규화", "대각선이 정답"] as const;
const NOTES = [
  "배치 N개면 N×N 행렬이 나옵니다. 대각선이 진짜 짝입니다.",
  "코사인 값 범위가 좁아 그대로 쓰면 분포가 평평합니다. 학습되는 배율을 곱해 차이를 벌립니다.",
  "행 전체를 더해 1이 되도록 나눕니다. 한 칸의 값이 같은 행의 다른 칸에 의존하게 됩니다.",
  "정답 index가 순서대로이므로 교차 엔트로피 한 줄로 손실이 됩니다.",
] as const;

const CELL = "#6366f1";
const DIAG = "#10b981";
const MUTED = "#94a3b8";
const N = 5;
const raw = (i: number, j: number) => (i === j ? 0.62 : 0.12 + ((i * 3 + j * 7) % 5) * 0.05);

export default function SoftmaxViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  const t = step >= 1 ? 14 : 1;
  const value = (i: number, j: number) => {
    if (step < 2) return raw(i, j);
    const row = Array.from({ length: N }, (_, k) => Math.exp(t * raw(i, k)));
    const sum = row.reduce((a, b) => a + b, 0);
    return Math.exp(t * raw(i, j)) / sum;
  };
  return (
    <VizFrame
      eyebrow="정규화 손실"
      title="한 칸의 손실이 같은 행 전체에 묶입니다"
      description="배치 5개로 줄인 유사도 행렬입니다. 진할수록 큰 값입니다."
      note="값은 구조를 보여 주기 위한 예시이며 실제 학습 로그가 아닙니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="배치 정규화 대조 손실"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            <text x={24} y={30} fontSize={9} fill={MUTED}>
              행 = 이미지, 열 = 문장
            </text>
            {Array.from({ length: N }, (_, i) => i).map((i) =>
              Array.from({ length: N }, (_, j) => j).map((j) => {
                const v = value(i, j);
                const isDiag = i === j;
                const color = step >= 3 && isDiag ? DIAG : CELL;
                return (
                  <g key={`${i}-${j}`}>
                    <rect
                      x={24 + j * 30}
                      y={40 + i * 30}
                      width={28}
                      height={28}
                      fill={color}
                      fillOpacity={Math.min(0.85, v * (step >= 2 ? 0.9 : 1.1))}
                      stroke={color}
                      strokeWidth={step >= 3 && isDiag ? 1.25 : 0.5}
                    />
                    <text
                      x={38 + j * 30}
                      y={58 + i * 30}
                      textAnchor="middle"
                      fontSize={7}
                      fill={v > 0.5 ? "#ffffff" : color}
                    >
                      {v.toFixed(2)}
                    </text>
                  </g>
                );
              }),
            )}
            {step >= 2 && (
              <g>
                {Array.from({ length: N }, (_, i) => i).map((i) => (
                  <text key={i} x={182} y={58 + i * 30} fontSize={8} fill={MUTED}>
                    합 = 1
                  </text>
                ))}
              </g>
            )}
            {step >= 3 && (
              <g>
                <rect x={238} y={60} width={222} height={64} fill="none" stroke={DIAG} strokeWidth={1.25} />
                <text x={349} y={82} textAnchor="middle" fontSize={9} fontWeight={700} fill={DIAG}>
                  labels = arange(N)
                </text>
                <text x={349} y={100} textAnchor="middle" fontSize={9} fill={DIAG}>
                  cross_entropy(logits, labels)
                </text>
                <text x={349} y={116} textAnchor="middle" fontSize={8} fill={MUTED}>
                  두 방향 평균
                </text>
              </g>
            )}
            <text x={24} y={196} fontSize={9} fill={MUTED}>
              {step >= 2 ? "정규화 상수가 배치 구성에 의존합니다" : "아직 정규화 전입니다"}
            </text>
          </svg>
          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">{NOTES[step]}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}

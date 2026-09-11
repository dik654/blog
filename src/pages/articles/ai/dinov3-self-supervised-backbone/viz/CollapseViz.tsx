import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: DenseCollapse.tsx — 패치 유사도 구조가 평평해지는 과정 */
const SCENES = ["학습 초반", "학습 중반", "학습 후반", "downstream 영향"] as const;

const NOTES = [
  "같은 물체 위의 패치끼리 높게, 배경과는 낮게 나옵니다. 유사도 행렬에 블록 구조가 보입니다.",
  "대비가 약해지기 시작합니다. 이미지 한 장을 같은 답으로 요약하라는 압력이 자리별 차이를 지웁니다.",
  "행렬이 거의 평평해집니다. 어느 패치를 봐도 비슷한 벡터라 자리 정보가 남지 않습니다.",
  "손실은 계속 내려가지만 얼린 backbone에 붙인 분할 head의 점수는 떨어집니다.",
] as const;

const HI = "#6366f1";
const OK = "#10b981";
const BAD = "#ef4444";
const MUTED = "#94a3b8";

const GRID = 8;

function similarity(i: number, j: number, contrast: number) {
  const sameBlock = Math.floor(i / 4) === Math.floor(j / 4);
  const base = sameBlock ? 0.9 : 0.15;
  return 0.5 + (base - 0.5) * contrast;
}

export default function CollapseViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2800);
  const step = scenes.active;
  const contrast = [1, 0.55, 0.12, 0.12][step];
  return (
    <VizFrame
      eyebrow="dense feature 붕괴"
      title="무너지는 것은 값이 아니라 패치 사이의 관계입니다"
      description="한 이미지 안 패치 8개의 유사도 행렬을 단계별로 그렸습니다. 진할수록 닮은 쌍입니다."
      note="설명을 위해 만든 예시 행렬이며 특정 체크포인트의 실측값이 아닙니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="패치 유사도 행렬의 변화"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(step + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            <text x={24} y={26} fontSize={9} fill={MUTED}>
              패치 유사도 행렬 (8 × 8)
            </text>
            {Array.from({ length: GRID }, (_, i) => i).map((i) =>
              Array.from({ length: GRID }, (_, j) => j).map((j) => (
                <rect
                  key={`${i}-${j}`}
                  x={24 + j * 18}
                  y={34 + i * 18}
                  width={16}
                  height={16}
                  fill={HI}
                  fillOpacity={similarity(i, j, contrast) * 0.7}
                  stroke={HI}
                  strokeWidth={0.5}
                />
              )),
            )}
            <text x={24} y={196} fontSize={8} fill={MUTED}>
              앞 4개는 물체, 뒤 4개는 배경 패치
            </text>

            <g>
              <text x={200} y={50} fontSize={9} fill={MUTED}>
                얼린 backbone + 선형 분할 head 점수
              </text>
              <line x1={200} y1={140} x2={452} y2={140} stroke={MUTED} strokeWidth={1} />
              <line x1={200} y1={60} x2={200} y2={140} stroke={MUTED} strokeWidth={1} />
              {[0, 1, 2, 3].map((k) => {
                const heights = [54, 58, 44, 26];
                const on = k <= step;
                return (
                  <rect
                    key={k}
                    x={216 + k * 58}
                    y={140 - (on ? heights[k] : 0)}
                    width={40}
                    height={on ? heights[k] : 0}
                    fill={k === 3 ? BAD : OK}
                    fillOpacity={0.25}
                    stroke={k === 3 ? BAD : OK}
                    strokeWidth={1}
                  />
                );
              })}
              <text x={200} y={156} fontSize={8} fill={MUTED}>
                학습 진행 →
              </text>
              {step === 3 && (
                <text x={296} y={172} fontSize={9} fontWeight={700} fill={BAD}>
                  손실은 내려가는데 점수는 하락
                </text>
              )}
            </g>
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

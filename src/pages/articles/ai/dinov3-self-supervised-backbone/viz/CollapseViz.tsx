import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";
import MobileStageFlow from "./MobileStageFlow";

/** 본문 대응: DenseCollapse.tsx — 패치 유사도 구조가 평평해지는 과정 */
const SCENES = ["학습 초반", "학습 중반", "학습 후반", "downstream 영향"] as const;

const NOTES = [
  "설명용 행렬에서는 물체 패치끼리 높고 배경과는 낮아 두 블록이 보입니다. 논문은 20만 스텝의 기준 패치 similarity map이 매끄럽고 국소적이라고 보고합니다.",
  "학습이 이어지면 기준 패치와 무관한 위치의 유사도가 올라가기 시작합니다. 이미지 전체를 구분하는 지표는 같은 기간 계속 좋아질 수 있습니다.",
  "60만 스텝 이후 저자 보고의 similarity map은 더 시끄럽고 덜 국소적입니다. 이 행렬은 그 대비 감소를 단순화한 설명용 예시입니다.",
  "사전학습 손실이나 분류 점수만 보면 놓칠 수 있습니다. 얼린 패치 출력에 선형 분할 head를 붙인 dense 평가를 함께 봐야 합니다.",
] as const;

const MOBILE_STAGES = [
  { title: "20만 스텝", detail: "기준 패치 주변이 국소적으로 모임" },
  { title: "학습 지속", detail: "무관한 위치의 유사도가 올라감" },
  { title: "60만 스텝 이후", detail: "similarity map이 시끄러워짐" },
  { title: "dense 평가", detail: "분류와 달리 선형 분할 점수는 하락" },
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
  const scenes = useAnimatedScenes(SCENES.length, 5200, { loop: false, autoPlay: false });
  const step = scenes.active;
  const contrast = [1, 0.55, 0.12, 0.12][step];
  return (
    <VizFrame
      eyebrow="dense feature 붕괴"
      title="무관한 패치까지 비슷해지면 국소성이 흐려집니다"
      description="한 이미지 안 패치 8개의 유사도 행렬을 단계별로 그렸습니다. 진할수록 닮은 쌍입니다."
      note="설명을 위해 만든 예시 행렬이며 특정 체크포인트의 실측값이 아닙니다."
      className="my-8 !block !h-auto !max-h-none !overflow-visible"
      canvasClassName="!h-auto !max-h-none !flex-none !overflow-visible"
    >
      <div
        id={scenes.playbackId}
        data-viz-id="dinov3-dense-collapse"
        tabIndex={0}
        role="group"
        aria-label="패치 유사도 행렬의 변화"
        onKeyDown={scenes.onKeyDown}
        className="min-w-0 outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div data-viz-live-only className="flex min-h-[18rem] flex-col justify-center sm:min-h-[21rem]">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(step + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <MobileStageFlow items={MOBILE_STAGES} active={step} ariaLabel="긴 학습에서 dense feature가 흐려지는 순서" />
          <svg viewBox="0 0 480 200" className="mt-4 hidden w-full max-w-2xl sm:block">
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
        <ol className="static-reading-only mt-4 divide-y divide-border border-y border-border text-sm leading-6">
          {SCENES.map((label, index) => (
            <li key={label} className="grid gap-1 py-3 sm:grid-cols-[10rem_minmax(0,1fr)]">
              <strong>{index + 1}. {label}</strong>
              <span className="text-muted-foreground">{NOTES[index]}</span>
            </li>
          ))}
        </ol>
      </div>
    </VizFrame>
  );
}

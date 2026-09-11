import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: QsaIndex.tsx — 압축 블록 점수로 읽을 위치를 고르는 두 단계 */
const SCENES = ["4토큰을 한 블록으로", "블록마다 점수", "상위 블록만 선택", "원본 K/V를 읽음"] as const;

const NOTES = [
  "과거 토큰의 index key를 연속 4개씩 평균내 블록 키 하나를 만듭니다. 블록 첫 토큰 위치의 RoPE가 적용됩니다.",
  "질의 head 4개가 각각 내적을 구하고 음수를 0으로 누른 뒤 더해 블록 점수가 됩니다.",
  "점수 상위 512개 블록만 남습니다. 아직 4개가 차지 않은 꼬리 토큰은 점수와 무관하게 항상 포함됩니다.",
  "선택은 mask로만 전달됩니다. softmax와 값 집계는 압축 키가 아니라 원본 K/V로 수행됩니다.",
] as const;

const KEY = "#6366f1";
const PICK = "#10b981";
const DROP = "#94a3b8";
const TAIL = "#f59e0b";

const BLOCKS = [0, 1, 2, 3, 4, 5, 6];
const SCORES = [0.82, 0.21, 0.64, 0.13, 0.91, 0.35, 0.72];
const SELECTED = [0, 2, 4, 6];

export default function QsaIndexViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2800);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="Qwen Sparse Attention"
      title="색인은 압축 키로, 계산은 원본 키로"
      description="완전한 블록 7개와 미완성 꼬리 하나로 줄인 그림입니다. 실제로는 문맥 길이를 4로 나눈 수만큼 블록이 생기고 그중 512개가 선택됩니다."
      note="점수 값은 설명을 위한 예시이며 특정 입력의 실제 측정값이 아닙니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="QSA indexer의 블록 선택 절차"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(step + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            <text x={16} y={24} fontSize={10} fontWeight={700} fill={DROP}>
              과거 토큰의 index key
            </text>
            {BLOCKS.map((block) =>
              [0, 1, 2, 3].map((offset) => {
                const x = 16 + block * 56 + offset * 12;
                const selected = SELECTED.includes(block);
                const color = step >= 2 && !selected ? DROP : KEY;
                return (
                  <rect
                    key={`${block}-${offset}`}
                    x={x}
                    y={34}
                    width={9}
                    height={18}
                    fill={step >= 3 && selected ? PICK : "none"}
                    fillOpacity={0.18}
                    stroke={color}
                    strokeWidth={1}
                  />
                );
              }),
            )}

            {step >= 0 &&
              BLOCKS.map((block) => (
                <g key={`bar-${block}`}>
                  <line
                    x1={16 + block * 56 + 24}
                    y1={54}
                    x2={16 + block * 56 + 24}
                    y2={68}
                    stroke={DROP}
                    strokeWidth={1}
                  />
                  <rect
                    x={16 + block * 56}
                    y={68}
                    width={48}
                    height={20}
                    fill={step >= 1 ? KEY : "none"}
                    fillOpacity={0.12}
                    stroke={KEY}
                    strokeWidth={1.25}
                  />
                  <text x={16 + block * 56 + 24} y={82} textAnchor="middle" fontSize={9} fill={KEY}>
                    블록 {block + 1}
                  </text>
                </g>
              ))}

            {step >= 1 && (
              <g>
                <text x={16} y={110} fontSize={10} fontWeight={700} fill={DROP}>
                  블록 점수
                </text>
                {BLOCKS.map((block) => {
                  const selected = SELECTED.includes(block);
                  const color = step >= 2 ? (selected ? PICK : DROP) : KEY;
                  return (
                    <g key={`score-${block}`}>
                      <rect
                        x={16 + block * 56}
                        y={138 - SCORES[block] * 30}
                        width={48}
                        height={SCORES[block] * 30}
                        fill={color}
                        fillOpacity={0.22}
                        stroke={color}
                        strokeWidth={1}
                      />
                      <text x={16 + block * 56 + 24} y={150} textAnchor="middle" fontSize={8} fill={color}>
                        {SCORES[block].toFixed(2)}
                      </text>
                    </g>
                  );
                })}
              </g>
            )}

            <g>
              {[0, 1].map((offset) => (
                <rect
                  key={`tail-${offset}`}
                  x={408 + offset * 12}
                  y={34}
                  width={9}
                  height={18}
                  fill={step >= 2 ? TAIL : "none"}
                  fillOpacity={0.2}
                  stroke={TAIL}
                  strokeWidth={1}
                />
              ))}
              <text x={408} y={82} fontSize={8} fontWeight={700} fill={TAIL}>
                꼬리 0~3
              </text>
              {step >= 2 && (
                <line x1={412} y1={54} x2={412} y2={70} stroke={TAIL} strokeWidth={1} />
              )}
            </g>

            {step >= 3 && (
              <g>
                <rect x={16} y={164} width={448} height={26} fill="none" stroke={PICK} strokeWidth={1.25} />
                <text x={240} y={181} textAnchor="middle" fontSize={10} fontWeight={700} fill={PICK}>
                  선택된 위치의 원본 K/V로 softmax · 최대 2051자리
                </text>
              </g>
            )}
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

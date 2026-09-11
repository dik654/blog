import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: Similarity.tsx — 저수준 변형이 거리에 새는 문제 */
const SCENES = ["같은 대상, 다른 밝기", "다른 대상", "거리 비교", "건강한 경우"] as const;
const NOTES = [
  "같은 물체를 밝기만 바꿔 찍은 세 장입니다. 의미는 같습니다.",
  "다른 물체지만 촬영 조건이 비슷한 사진들입니다.",
  "변형본 사이 거리가 다른 대상 사이 거리에 근접하면 저수준 단서가 검색을 지배합니다.",
  "변형본은 뭉치고 다른 대상은 떨어져 있어야 의미 기준으로 검색됩니다.",
] as const;

const SAME = "#6366f1";
const DIFF = "#f59e0b";
const BAD = "#ef4444";
const OK = "#10b981";
const MUTED = "#94a3b8";

export default function SimilarityViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  const spreadSame = step === 3 ? 12 : 34;
  return (
    <VizFrame
      eyebrow="거리의 구성"
      title="정규화해도 촬영 조건은 남습니다"
      description="임베딩 공간을 2차원으로 눌러 그린 개념도입니다."
      note="좌표는 개념 설명을 위한 배치이며 실제 투영 결과가 아닙니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="변형 민감도"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            <circle cx={150} cy={100} r={72} fill="none" stroke={MUTED} strokeWidth={1} />
            <text x={150} y={22} textAnchor="middle" fontSize={9} fill={MUTED}>
              정규화된 임베딩 공간
            </text>

            {[0, 1, 2].map((i) => (
              <circle
                key={`s-${i}`}
                cx={120 + i * spreadSame}
                cy={86 + (i % 2) * spreadSame}
                r={6}
                fill={SAME}
                fillOpacity={0.4}
                stroke={SAME}
                strokeWidth={1}
              />
            ))}
            {step >= 1 &&
              [0, 1, 2].map((i) => (
                <circle
                  key={`d-${i}`}
                  cx={step === 3 ? 186 + i * 12 : 150 + i * 16}
                  cy={step === 3 ? 132 + i * 8 : 118 + (i % 2) * 14}
                  r={6}
                  fill={DIFF}
                  fillOpacity={0.4}
                  stroke={DIFF}
                  strokeWidth={1}
                />
              ))}

            <g>
              <rect x={256} y={48} width={12} height={12} fill={SAME} fillOpacity={0.4} stroke={SAME} strokeWidth={1} />
              <text x={274} y={58} fontSize={9} fill={SAME}>
                같은 대상, 밝기만 다름
              </text>
              <rect x={256} y={70} width={12} height={12} fill={DIFF} fillOpacity={0.4} stroke={DIFF} strokeWidth={1} />
              <text x={274} y={80} fontSize={9} fill={DIFF}>
                다른 대상
              </text>
            </g>

            {step >= 2 && (
              <g>
                <text x={256} y={110} fontSize={9} fontWeight={700} fill={MUTED}>
                  변형 민감도 비
                </text>
                <rect x={256} y={118} width={160} height={14} fill="none" stroke={MUTED} strokeWidth={1} />
                <rect
                  x={256}
                  y={118}
                  width={step === 3 ? 40 : 138}
                  height={14}
                  fill={step === 3 ? OK : BAD}
                  fillOpacity={0.3}
                  stroke={step === 3 ? OK : BAD}
                  strokeWidth={1}
                />
                <text x={424} y={129} fontSize={9} fontWeight={700} fill={step === 3 ? OK : BAD}>
                  {step === 3 ? "0.25" : "0.86"}
                </text>
                <text x={256} y={154} fontSize={9} fill={step === 3 ? OK : BAD}>
                  {step === 3 ? "의미 기준으로 검색됩니다" : "촬영 조건으로 모입니다"}
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

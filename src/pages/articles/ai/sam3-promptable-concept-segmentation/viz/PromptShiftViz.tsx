import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: Overview.tsx — 지목 프롬프트와 개념 프롬프트의 차이 */
const SCENES = ["점으로 지목", "개념 이름으로", "없는 개념", "정체성까지"] as const;

const NOTES = [
  "자리를 가리키면 그 자리의 물체 하나가 나옵니다. 무언가 있다는 사실은 사람이 이미 확인해 준 상태입니다.",
  "이름을 주면 모델이 사진 전체에서 해당 개념을 모두 찾아야 합니다. 몇 개인지도 스스로 정합니다.",
  "없는 개념을 물으면 빈 결과가 정답입니다. 이것도 채점 대상입니다.",
  "영상에서는 같은 개체가 프레임을 넘어 같은 정체성을 유지해야 합니다.",
] as const;

const POINT = "#6366f1";
const CONCEPT = "#10b981";
const EMPTY = "#ef4444";
const MUTED = "#94a3b8";

const OBJECTS = [
  { x: 40, y: 60, w: 52, h: 36 },
  { x: 130, y: 96, w: 46, h: 32 },
  { x: 214, y: 54, w: 58, h: 40 },
  { x: 300, y: 100, w: 50, h: 34 },
];

export default function PromptShiftViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2800);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="프롬프트 단위"
      title="자리를 가리키는 것과 이름을 부르는 것은 다른 과제입니다"
      description="같은 사진에 무엇을 주느냐에 따라 모델이 답해야 할 질문이 달라집니다."
      note="상자 배치는 설명용 예시이며 실제 모델 출력이 아닙니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="프롬프트 단위의 차이"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(step + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            <rect x={24} y={36} width={352} height={124} fill="none" stroke={MUTED} strokeWidth={1} />
            {OBJECTS.map((o, i) => {
              const picked = step === 0 ? i === 1 : step === 2 ? false : true;
              const color = step === 2 ? MUTED : picked ? (step === 0 ? POINT : CONCEPT) : MUTED;
              return (
                <g key={i}>
                  <rect
                    x={o.x}
                    y={o.y}
                    width={o.w}
                    height={o.h}
                    fill={color}
                    fillOpacity={picked && step !== 2 ? 0.22 : 0.05}
                    stroke={color}
                    strokeWidth={picked && step !== 2 ? 1.25 : 1}
                  />
                  {step === 3 && picked && (
                    <text x={o.x + o.w / 2} y={o.y + o.h / 2 + 3} textAnchor="middle" fontSize={8} fontWeight={700} fill={CONCEPT}>
                      id {i + 1}
                    </text>
                  )}
                </g>
              );
            })}
            {step === 0 && <circle cx={153} cy={112} r={4} fill={POINT} stroke={POINT} strokeWidth={1} />}

            <rect x={388} y={36} width={68} height={124} fill="none" stroke={MUTED} strokeWidth={1} />
            <text x={422} y={54} textAnchor="middle" fontSize={9} fill={MUTED}>
              프롬프트
            </text>
            <text x={422} y={78} textAnchor="middle" fontSize={9} fontWeight={700} fill={step === 0 ? POINT : step === 2 ? EMPTY : CONCEPT}>
              {step === 0 ? "점 1개" : step === 2 ? "없는 개념" : "명사구"}
            </text>
            <text x={422} y={104} textAnchor="middle" fontSize={8} fill={MUTED}>
              출력
            </text>
            <text x={422} y={122} textAnchor="middle" fontSize={9} fontWeight={700} fill={step === 0 ? POINT : step === 2 ? EMPTY : CONCEPT}>
              {step === 0 ? "마스크 1" : step === 2 ? "빈 결과" : "마스크 4"}
            </text>
            {step === 3 && (
              <text x={422} y={142} textAnchor="middle" fontSize={8} fill={CONCEPT}>
                + 정체성
              </text>
            )}
            <text x={24} y={182} fontSize={9} fill={MUTED}>
              {step === 2 ? "없다고 답하는 것도 정답입니다" : "같은 사진, 다른 질문"}
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

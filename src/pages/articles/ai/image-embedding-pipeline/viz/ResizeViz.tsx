import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: Preprocessing.tsx — 크기를 맞추는 세 방식이 버리는 것 */
const SCENES = ["원본 16:9", "비율 무시", "중앙 자르기", "여백 채우기"] as const;
const NOTES = [
  "가로로 긴 사진입니다. 주제가 왼쪽에 치우쳐 있습니다.",
  "모든 픽셀이 남지만 형태가 눌립니다. 형태가 근거인 과제에서 손해입니다.",
  "형태는 보존되지만 가장자리가 사라집니다. 왼쪽 주제가 잘려 나갔습니다.",
  "아무것도 버리지 않는 대신 여백이 입력의 상당 부분을 차지합니다.",
] as const;

const KEEP = "#6366f1";
const LOST = "#ef4444";
const PAD = "#94a3b8";
const OK = "#10b981";

export default function ResizeViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="전처리"
      title="어떤 방식을 써도 공짜는 없습니다"
      description="같은 사진을 세 방식으로 224 정사각형에 맞춰 봅니다."
      note="주제 위치는 설명을 위한 배치이며 실제 데이터 분포가 아닙니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="리사이즈 방식 비교"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            <text x={24} y={34} fontSize={9} fill={PAD}>
              원본
            </text>
            <rect x={24} y={42} width={176} height={99} fill="none" stroke={PAD} strokeWidth={1} />
            <circle cx={62} cy={92} r={20} fill={KEEP} fillOpacity={0.25} stroke={KEEP} strokeWidth={1} />
            <rect x={120} y={78} width={54} height={30} fill={PAD} fillOpacity={0.15} stroke={PAD} strokeWidth={1} />

            {step >= 1 && (
              <g>
                <text x={250} y={34} fontSize={9} fill={PAD}>
                  결과 224²
                </text>
                <rect x={250} y={42} width={99} height={99} fill="none" stroke={PAD} strokeWidth={1} />
                {step === 1 && (
                  <g>
                    <ellipse cx={271} cy={92} rx={11} ry={20} fill={LOST} fillOpacity={0.25} stroke={LOST} strokeWidth={1} />
                    <rect x={304} y={78} width={30} height={30} fill={PAD} fillOpacity={0.15} stroke={PAD} strokeWidth={1} />
                    <text x={250} y={158} fontSize={9} fontWeight={700} fill={LOST}>
                      형태 왜곡 · 픽셀은 전부 보존
                    </text>
                  </g>
                )}
                {step === 2 && (
                  <g>
                    <rect x={250} y={42} width={99} height={99} fill={PAD} fillOpacity={0.06} stroke={PAD} strokeWidth={1} />
                    <rect x={296} y={78} width={30} height={30} fill={PAD} fillOpacity={0.15} stroke={PAD} strokeWidth={1} />
                    <text x={250} y={158} fontSize={9} fontWeight={700} fill={LOST}>
                      왼쪽 주제가 잘려 사라짐
                    </text>
                    <rect x={24} y={42} width={62} height={99} fill={LOST} fillOpacity={0.12} stroke={LOST} strokeWidth={1} strokeDasharray="3 2" />
                  </g>
                )}
                {step === 3 && (
                  <g>
                    <rect x={250} y={42} width={99} height={28} fill={PAD} fillOpacity={0.2} stroke={PAD} strokeWidth={0.75} />
                    <rect x={250} y={113} width={99} height={28} fill={PAD} fillOpacity={0.2} stroke={PAD} strokeWidth={0.75} />
                    <circle cx={271} cy={92} r={11} fill={OK} fillOpacity={0.25} stroke={OK} strokeWidth={1} />
                    <rect x={304} y={84} width={30} height={17} fill={PAD} fillOpacity={0.15} stroke={PAD} strokeWidth={1} />
                    <text x={250} y={158} fontSize={9} fontWeight={700} fill={OK}>
                      전부 보존 · 여백이 43% 차지
                    </text>
                  </g>
                )}
              </g>
            )}

            {step >= 1 && (
              <g>
                <text x={376} y={70} fontSize={9} fontWeight={700} fill={PAD}>
                  버리는 것
                </text>
                <text x={376} y={90} fontSize={9} fill={step === 1 ? LOST : PAD}>
                  {step === 1 ? "형태" : step === 2 ? "가장자리" : "없음"}
                </text>
                <text x={376} y={112} fontSize={9} fontWeight={700} fill={PAD}>
                  더해지는 것
                </text>
                <text x={376} y={132} fontSize={9} fill={step === 3 ? PAD : PAD}>
                  {step === 3 ? "여백 패턴" : "없음"}
                </text>
              </g>
            )}
            <text x={24} y={190} fontSize={9} fill={PAD}>
              색인과 질의가 같은 방식을 써야 합니다
            </text>
          </svg>
          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">{NOTES[step]}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}

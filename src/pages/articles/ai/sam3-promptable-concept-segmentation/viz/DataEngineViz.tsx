import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: DataEngine.tsx — 사람과 자동 검수자의 배치 */
const SCENES = ["사람만 검수", "자동 검수자 투입", "사람 재배치", "순환의 위험"] as const;

const NOTES = [
  "초안을 만들고 사람이 전부 검수합니다. 품질은 높지만 처리량이 사람 수에 묶입니다.",
  "마스크가 맞는지와 빠짐없이 찾았는지를 언어모델이 먼저 판정합니다. 처리량이 약 두 배가 됩니다.",
  "사람은 자동 검수자가 갈라놓은 어려운 사례로 옮겨 갑니다. 같은 인원으로 더 어려운 구간을 봅니다.",
  "자동 검수자와 학습 모델이 실수를 공유하면 그 실수가 데이터에 반복 기록됩니다. 사람이 여러 명 붙는 평가 구간이 이 순환을 끊습니다.",
] as const;

const HUMAN = "#6366f1";
const AI = "#10b981";
const RISK = "#ef4444";
const MUTED = "#94a3b8";

export default function DataEngineViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2800);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="데이터 엔진"
      title="사람을 없애는 것이 아니라 어디에 둘지를 바꿉니다"
      description="검수 단계의 배치가 바뀌면서 처리량과 사람의 역할이 함께 달라집니다."
      note="처리량 약 두 배는 논문의 자기보고이며 조건이 다르면 달라집니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="데이터 엔진의 검수 배치"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(step + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            <rect x={20} y={44} width={84} height={40} fill="none" stroke={MUTED} strokeWidth={1} />
            <text x={62} y={62} textAnchor="middle" fontSize={9} fontWeight={700} fill={MUTED}>
              초안 생성
            </text>
            <text x={62} y={76} textAnchor="middle" fontSize={8} fill={MUTED}>
              검출기 + 분할 모델
            </text>

            {step >= 1 && (
              <g>
                <line x1={104} y1={64} x2={134} y2={64} stroke={MUTED} strokeWidth={1} />
                <rect x={134} y={44} width={96} height={40} fill={AI} fillOpacity={0.12} stroke={AI} strokeWidth={1.25} />
                <text x={182} y={60} textAnchor="middle" fontSize={9} fontWeight={700} fill={AI}>
                  자동 검수자
                </text>
                <text x={182} y={74} textAnchor="middle" fontSize={8} fill={AI}>
                  마스크·빠짐 판정
                </text>
              </g>
            )}

            <g>
              <line x1={step >= 1 ? 230 : 104} y1={64} x2={step >= 1 ? 262 : 262} y2={64} stroke={MUTED} strokeWidth={1} />
              <rect x={262} y={44} width={96} height={40} fill={HUMAN} fillOpacity={0.12} stroke={HUMAN} strokeWidth={1.25} />
              <text x={310} y={60} textAnchor="middle" fontSize={9} fontWeight={700} fill={HUMAN}>
                사람 검수
              </text>
              <text x={310} y={74} textAnchor="middle" fontSize={8} fill={HUMAN}>
                {step >= 2 ? "어려운 사례만" : "전량"}
              </text>
            </g>

            <line x1={358} y1={64} x2={386} y2={64} stroke={MUTED} strokeWidth={1} />
            <rect x={386} y={44} width={74} height={40} fill="none" stroke={MUTED} strokeWidth={1} />
            <text x={423} y={68} textAnchor="middle" fontSize={9} fontWeight={700} fill={MUTED}>
              학습 데이터
            </text>

            <g>
              <text x={20} y={116} fontSize={9} fill={MUTED}>
                처리량
              </text>
              <rect x={70} y={106} width={step >= 1 ? 220 : 110} height={14} fill={step >= 1 ? AI : MUTED} fillOpacity={0.25} stroke={step >= 1 ? AI : MUTED} strokeWidth={1} />
              <text x={step >= 1 ? 298 : 188} y={117} fontSize={8} fontWeight={700} fill={step >= 1 ? AI : MUTED}>
                {step >= 1 ? "약 2배" : "기준"}
              </text>
            </g>

            {step >= 3 && (
              <g>
                <path d="M 423 84 L 423 146 L 182 146 L 182 90" fill="none" stroke={RISK} strokeWidth={1} strokeDasharray="4 3" />
                <text x={200} y={164} fontSize={9} fontWeight={700} fill={RISK}>
                  학습된 모델이 다시 검수자가 되면 같은 실수가 반복 기록됩니다
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

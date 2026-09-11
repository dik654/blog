import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: ClientSignals.tsx — 지문 수집, 점수화, 임계값 선택 */
const SCENES = ["연결 지문", "프로토콜 지문", "점수 하나로", "임계값 선택"] as const;
const NOTES = [
  "첫 암호화 협상 메시지에 담긴 목록과 순서가 클라이언트 소프트웨어마다 다릅니다.",
  "프로토콜 설정 프레임의 값과 순서도 라이브러리마다 다릅니다. 두 지문이 서로를 보강합니다.",
  "여러 신호를 한 점수로 합쳐 자동화 정도를 나타냅니다. 점수는 확신이 아니라 정도입니다.",
  "선을 어디에 긋느냐가 두 오판의 비율을 바꿉니다. 정답은 두 오판의 비용이 정합니다.",
] as const;

const TLS = "#6366f1";
const H2 = "#8b5cf6";
const SCORE = "#f59e0b";
const HUMAN = "#10b981";
const BOT = "#ef4444";
const MUTED = "#94a3b8";

export default function SignalViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="클라이언트 신호"
      title="지문 두 개가 점수 하나가 됩니다"
      description="수집부터 임계값 선택까지를 따라갑니다."
      note="점수 분포 곡선은 개념도이며 특정 서비스의 실제 분포가 아닙니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="클라이언트 신호 수집과 점수화"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            {step <= 2 && (
              <g>
                <rect x={24} y={40} width={140} height={44} fill={TLS} fillOpacity={step === 0 ? 0.16 : 0.06} stroke={step >= 0 ? TLS : MUTED} strokeWidth={step === 0 ? 1.25 : 1} />
                <text x={94} y={58} textAnchor="middle" fontSize={9} fontWeight={700} fill={TLS}>
                  암호화 협상 첫 메시지
                </text>
                <text x={94} y={74} textAnchor="middle" fontSize={8} fill={TLS}>
                  버전·암호 목록·확장 순서
                </text>
                <rect x={24} y={96} width={140} height={44} fill={H2} fillOpacity={step === 1 ? 0.16 : 0.06} stroke={step >= 1 ? H2 : MUTED} strokeWidth={step === 1 ? 1.25 : 1} />
                <text x={94} y={114} textAnchor="middle" fontSize={9} fontWeight={700} fill={step >= 1 ? H2 : MUTED}>
                  프로토콜 설정 프레임
                </text>
                <text x={94} y={130} textAnchor="middle" fontSize={8} fill={step >= 1 ? H2 : MUTED}>
                  설정값·우선순위·헤더 순서
                </text>
                <line x1={164} y1={62} x2={210} y2={86} stroke={step === 2 ? SCORE : MUTED} strokeWidth={1} />
                <line x1={164} y1={118} x2={210} y2={94} stroke={step === 2 ? SCORE : MUTED} strokeWidth={1} />
                <rect x={210} y={68} width={110} height={44} fill={SCORE} fillOpacity={step === 2 ? 0.16 : 0.05} stroke={step === 2 ? SCORE : MUTED} strokeWidth={step === 2 ? 1.25 : 1} />
                <text x={265} y={86} textAnchor="middle" fontSize={9} fontWeight={700} fill={step === 2 ? SCORE : MUTED}>
                  점수 산출
                </text>
                <text x={265} y={102} textAnchor="middle" fontSize={8} fill={step === 2 ? SCORE : MUTED}>
                  자동화 정도 하나로
                </text>
                {step === 2 && (
                  <g>
                    <line x1={320} y1={90} x2={352} y2={90} stroke={SCORE} strokeWidth={1} />
                    <rect x={352} y={68} width={104} height={44} fill="none" stroke={SCORE} strokeWidth={1} />
                    <text x={404} y={86} textAnchor="middle" fontSize={9} fontWeight={700} fill={SCORE}>
                      처분 결정 입력
                    </text>
                    <text x={404} y={102} textAnchor="middle" fontSize={8} fill={SCORE}>
                      통과·검증·차단
                    </text>
                  </g>
                )}
                <text x={24} y={30} fontSize={9} fill={MUTED}>
                  {step === 2 ? "두 지문이 한 점수로" : "연결을 맺는 동안 얻는 것"}
                </text>
                {step === 0 && (
                  <text x={24} y={162} fontSize={8} fill={MUTED}>
                    같은 브라우저·같은 버전은 같은 지문을 냅니다. 지문은 신원이 아니라 소프트웨어의 종류입니다.
                  </text>
                )}
                {step === 1 && (
                  <text x={24} y={162} fontSize={8} fill={MUTED}>
                    브라우저를 사칭해도 두 지문을 동시에 맞추기는 더 어렵습니다.
                  </text>
                )}
              </g>
            )}
            {step === 3 && (
              <g>
                <line x1={40} y1={140} x2={456} y2={140} stroke={MUTED} strokeWidth={1} />
                <text x={40} y={156} fontSize={8} fill={MUTED}>
                  점수 낮음 (사람에 가까움)
                </text>
                <text x={456} y={156} textAnchor="end" fontSize={8} fill={MUTED}>
                  점수 높음 (자동화에 가까움)
                </text>
                <path d="M 40 140 Q 120 40 200 140" fill={HUMAN} fillOpacity={0.14} stroke={HUMAN} strokeWidth={1.25} />
                <path d="M 260 140 Q 350 44 440 140" fill={BOT} fillOpacity={0.14} stroke={BOT} strokeWidth={1.25} />
                <path d="M 170 140 Q 230 112 290 140" fill={MUTED} fillOpacity={0.1} stroke={MUTED} strokeWidth={1} strokeDasharray="3 2" />
                <line x1={252} y1={36} x2={252} y2={148} stroke={SCORE} strokeWidth={1.25} />
                <text x={252} y={30} textAnchor="middle" fontSize={9} fontWeight={700} fill={SCORE}>
                  임계값
                </text>
                <text x={120} y={112} textAnchor="middle" fontSize={9} fontWeight={700} fill={HUMAN}>
                  사람
                </text>
                <text x={350} y={112} textAnchor="middle" fontSize={9} fontWeight={700} fill={BOT}>
                  자동화
                </text>
                <text x={230} y={106} textAnchor="middle" fontSize={8} fill={MUTED}>
                  겹치는 구간
                </text>
                <text x={40} y={176} fontSize={8} fill={HUMAN}>
                  선을 오른쪽으로 → 사람을 덜 막고 봇을 더 통과시킵니다
                </text>
                <text x={40} y={190} fontSize={8} fill={BOT}>
                  선을 왼쪽으로 → 봇을 더 막고 사람도 더 막습니다
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

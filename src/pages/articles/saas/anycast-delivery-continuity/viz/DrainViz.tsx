import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: HealthAndDrain.tsx — 검사 깊이의 두 실패와 계획된 빼기 */
const SCENES = ["얕은 검사", "깊은 검사", "계획된 빼기", "감지 시간 계산"] as const;
const NOTES = [
  "포트만 보면 내부적으로 아무 일도 못 하는 서버가 계속 트래픽을 받습니다.",
  "공용 종속성까지 보면 그 하나가 흔들릴 때 모든 서버가 동시에 제외돼 남는 용량이 없어집니다.",
  "계획된 작업에서는 검사를 기다리지 않고 새 연결만 끊은 뒤 기존 연결이 끝나기를 기다립니다.",
  "감지 시간은 대략 주기와 연속 실패 허용 횟수의 곱이며, 그대로 장애 시간의 하한이 됩니다.",
] as const;

const OK = "#10b981";
const BAD = "#ef4444";
const WARN = "#f59e0b";
const DRAIN = "#8b5cf6";
const MUTED = "#94a3b8";

export default function DrainViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="판정 층"
      title="검사가 깊을수록 잡는 것도 늘고 함께 빠지는 것도 늘어납니다"
      description="두 극단의 실패 방식과 계획된 빼기를 비교합니다."
      note="주기와 횟수는 계산 방법을 보여 주기 위한 예시이며 권고값이 아닙니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="건강 검사 깊이와 빼기 절차"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            {step <= 2 && (
              <g>
                <text x={24} y={28} fontSize={9} fill={MUTED}>
                  서버 3대 · 공용 데이터베이스 1개
                </text>
                {[0, 1, 2].map((i) => {
                  let c = OK;
                  let tag = "통과";
                  if (step === 0) {
                    c = i === 1 ? BAD : OK;
                    tag = i === 1 ? "고장인데 통과" : "통과";
                  } else if (step === 1) {
                    c = BAD;
                    tag = "동시 제외";
                  } else if (step === 2) {
                    c = i === 1 ? DRAIN : OK;
                    tag = i === 1 ? "빼는 중" : "통과";
                  }
                  return (
                    <g key={i}>
                      <rect x={24 + i * 150} y={44} width={130} height={34} fill={c} fillOpacity={0.12} stroke={c} strokeWidth={1.25} />
                      <text x={89 + i * 150} y={60} textAnchor="middle" fontSize={9} fontWeight={700} fill={c}>
                        서버 {i + 1}
                      </text>
                      <text x={89 + i * 150} y={73} textAnchor="middle" fontSize={8} fill={c}>
                        {tag}
                      </text>
                      <line x1={89 + i * 150} y1={78} x2={224} y2={110} stroke={step === 1 ? BAD : MUTED} strokeWidth={1} strokeDasharray="3 2" />
                    </g>
                  );
                })}
                <rect x={162} y={110} width={124} height={30} fill={step === 1 ? BAD : MUTED} fillOpacity={0.1} stroke={step === 1 ? BAD : MUTED} strokeWidth={1} />
                <text x={224} y={129} textAnchor="middle" fontSize={9} fontWeight={700} fill={step === 1 ? BAD : MUTED}>
                  공용 데이터베이스
                </text>
                {step === 0 && (
                  <text x={24} y={168} fontSize={8} fill={BAD}>
                    포트만 확인하므로 내부가 망가진 서버 2도 계속 트래픽을 받습니다.
                  </text>
                )}
                {step === 1 && (
                  <text x={24} y={168} fontSize={8} fill={BAD}>
                    공용 항목이 느려지자 세 대가 함께 제외됩니다. 남는 용량이 0이 됩니다.
                  </text>
                )}
                {step === 2 && (
                  <g>
                    <text x={24} y={168} fontSize={8} fill={DRAIN}>
                      서버 2는 새 연결만 끊고 기존 연결은 끝날 때까지 유지합니다. 끊김이 생기지 않습니다.
                    </text>
                    <text x={24} y={184} fontSize={8} fill={MUTED}>
                      남은 두 대가 그 몫을 받을 여유가 있어야 성립합니다.
                    </text>
                  </g>
                )}
              </g>
            )}
            {step === 3 && (
              <g>
                <text x={24} y={28} fontSize={9} fill={MUTED}>
                  주기 2초 · 연속 3회 실패를 조건으로 둘 때
                </text>
                {[0, 1, 2, 3].map((i) => (
                  <g key={i}>
                    <rect x={24 + i * 96} y={48} width={84} height={30} fill={i === 0 ? MUTED : BAD} fillOpacity={0.12} stroke={i === 0 ? MUTED : BAD} strokeWidth={1} />
                    <text x={66 + i * 96} y={67} textAnchor="middle" fontSize={9} fontWeight={700} fill={i === 0 ? MUTED : BAD}>
                      {i === 0 ? "정상 응답" : `실패 ${i}회`}
                    </text>
                    {i < 3 && <text x={116 + i * 96} y={67} fontSize={8} fill={MUTED}>2s</text>}
                  </g>
                ))}
                <line x1={120} y1={86} x2={408} y2={86} stroke={WARN} strokeWidth={1.25} />
                <text x={264} y={102} textAnchor="middle" fontSize={9} fontWeight={700} fill={WARN}>
                  감지까지 최대 6초
                </text>
                <text x={24} y={130} fontSize={8} fill={MUTED}>
                  이 6초 동안 그 서버로 간 요청은 그대로 실패합니다. 감지 시간이 장애 시간의 하한입니다.
                </text>
                <text x={24} y={150} fontSize={8} fill={BAD}>
                  그렇다고 1회 실패로 빼면 일시적 지연만으로 멀쩡한 서버가 빠져 흔들립니다.
                </text>
                <text x={24} y={170} fontSize={8} fill={OK}>
                  그래서 빼는 조건은 빠르게, 되돌리는 조건은 더 오래 관찰한 뒤로 둡니다.
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

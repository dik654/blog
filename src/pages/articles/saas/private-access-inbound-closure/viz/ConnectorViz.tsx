import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: OutboundConnector.tsx — 통로 수립, 요청 흐름, 중복, 신뢰 지점 이동 */
const SCENES = ["통로 수립", "요청이 흐르는 길", "커넥터 중복", "신뢰 지점의 이동"] as const;
const NOTES = [
  "커넥터가 시작하자마자 바깥 중계망으로 나가는 연결을 겁니다. 들어오는 규칙은 하나도 늘지 않습니다.",
  "사용자 요청은 중계망까지 오고, 중계망이 이미 맺어 둔 통로로 안쪽에 밀어 넣습니다.",
  "한 통로에 커넥터를 여러 개 띄워 각자 가까운 지점에 붙이면 하나가 죽어도 나머지가 받습니다.",
  "방화벽 규칙이 사라진 자리에 커넥터와 그 자격 증명이 새 신뢰 지점으로 들어옵니다.",
] as const;

const TUNNEL = "#8b5cf6";
const FLOW = "#6366f1";
const OK = "#10b981";
const RISK = "#ef4444";
const MUTED = "#94a3b8";

export default function ConnectorViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="구현 1"
      title="나가는 연결 하나가 들어오는 규칙 전부를 대체합니다"
      description="통로가 만들어지는 순서와 그 대가를 봅니다."
      note="커넥터 수와 배치는 예시이며 제품별 재연결 동작은 다릅니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="역방향 커넥터의 동작"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            {step <= 2 && (
              <g>
                <rect x={24} y={52} width={78} height={30} fill={MUTED} fillOpacity={0.08} stroke={MUTED} strokeWidth={1} />
                <text x={63} y={71} textAnchor="middle" fontSize={9} fill={MUTED}>
                  사용자
                </text>
                <rect x={160} y={52} width={96} height={30} fill={FLOW} fillOpacity={0.12} stroke={FLOW} strokeWidth={1.25} />
                <text x={208} y={71} textAnchor="middle" fontSize={9} fontWeight={700} fill={FLOW}>
                  중계망
                </text>
                <rect x={306} y={36} width={150} height={{ 0: 62, 1: 62, 2: 106 }[step]} fill={MUTED} fillOpacity={0.04} stroke={MUTED} strokeWidth={1} strokeDasharray="4 3" />
                <text x={381} y={30} textAnchor="middle" fontSize={9} fill={MUTED}>
                  안쪽 네트워크 · 방화벽 안
                </text>
                {(step === 2 ? [0, 1] : [0]).map((k) => (
                  <g key={k}>
                    <rect x={320} y={48 + k * 44} width={122} height={30} fill={TUNNEL} fillOpacity={0.14} stroke={TUNNEL} strokeWidth={1.25} />
                    <text x={381} y={67 + k * 44} textAnchor="middle" fontSize={9} fontWeight={700} fill={TUNNEL}>
                      커넥터 {k + 1}
                    </text>
                    <line x1={320} y1={63 + k * 44} x2={256} y2={67} stroke={TUNNEL} strokeWidth={1.25} />
                    <polygon points={`264,63 256,67 264,71`} fill={TUNNEL} />
                  </g>
                ))}
                {step === 0 && (
                  <g>
                    <text x={264} y={44} fontSize={8} fontWeight={700} fill={TUNNEL}>
                      안에서 바깥으로 먼저
                    </text>
                    <text x={24} y={126} fontSize={8} fill={OK}>
                      방화벽에 추가되는 들어오는 규칙: 0개
                    </text>
                    <text x={24} y={144} fontSize={8} fill={MUTED}>
                      대부분의 방화벽이 나가는 연결을 기본 허용하므로 설정 없이 성립합니다.
                    </text>
                  </g>
                )}
                {step === 1 && (
                  <g>
                    <line x1={102} y1={67} x2={160} y2={67} stroke={FLOW} strokeWidth={1.25} />
                    <polygon points="152,63 160,67 152,71" fill={FLOW} />
                    <text x={106} y={58} fontSize={8} fontWeight={700} fill={FLOW}>
                      요청
                    </text>
                    <text x={264} y={90} fontSize={8} fill={FLOW}>
                      이미 맺어 둔 통로로 밀어 넣음
                    </text>
                    <text x={24} y={126} fontSize={8} fill={MUTED}>
                      응답도 같은 통로로 돌아옵니다. 안쪽은 여전히 받는 포트가 없습니다.
                    </text>
                  </g>
                )}
                {step === 2 && (
                  <g>
                    <text x={264} y={44} fontSize={8} fontWeight={700} fill={OK}>
                      각자 가까운 지점에
                    </text>
                    <text x={24} y={166} fontSize={8} fill={OK}>
                      하나가 죽거나 한 지점이 문제를 겪어도 나머지가 트래픽을 받습니다.
                    </text>
                    <text x={24} y={184} fontSize={8} fill={RISK}>
                      중복이 없으면 통로 자체가 단일 장애 지점이 됩니다.
                    </text>
                  </g>
                )}
              </g>
            )}
            {step === 3 && (
              <g>
                <text x={24} y={26} fontSize={9} fill={MUTED}>
                  없어진 것과 새로 생긴 것
                </text>
                <rect x={24} y={44} width={200} height={54} fill={OK} fillOpacity={0.1} stroke={OK} strokeWidth={1.25} />
                <text x={124} y={64} textAnchor="middle" fontSize={9} fontWeight={700} fill={OK}>
                  사라진 것
                </text>
                <text x={124} y={80} textAnchor="middle" fontSize={8} fill={OK}>
                  인터넷에서 직접 두드릴 표면
                </text>
                <rect x={256} y={44} width={200} height={54} fill={RISK} fillOpacity={0.1} stroke={RISK} strokeWidth={1.25} />
                <text x={356} y={64} textAnchor="middle" fontSize={9} fontWeight={700} fill={RISK}>
                  새로 생긴 것
                </text>
                <text x={356} y={80} textAnchor="middle" fontSize={8} fill={RISK}>
                  커넥터와 그 자격 증명
                </text>
                <text x={24} y={128} fontSize={8} fill={MUTED}>
                  점검 항목: 어떤 계정으로 도는가 · 자격 증명은 어디에 있고 언제 교체되는가
                </text>
                <text x={24} y={146} fontSize={8} fontWeight={700} fill={RISK}>
                  통로가 닿는 안쪽 대상이 무엇으로 제한되는가
                </text>
                <text x={24} y={170} fontSize={8} fill={MUTED}>
                  마지막 항목이 빠지면 이 구조는 앞 절의 네트워크 단위 부여와 같아집니다.
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

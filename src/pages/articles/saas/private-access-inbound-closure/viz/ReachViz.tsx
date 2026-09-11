import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: Overview.tsx — 포트를 여는 답과 방향을 뒤집는 두 답 */
const SCENES = ["포트를 연다", "안쪽이 먼저 나간다", "주소를 옮긴다", "두 축"] as const;
const NOTES = [
  "가장 쉬운 답입니다. 입구 하나와 그 입구를 지난 뒤의 넓은 내부가 함께 생깁니다.",
  "안쪽 프로그램이 바깥으로 통로를 먼저 맺어 둡니다. 받을 포트가 없으니 두드릴 대상이 없습니다.",
  "쓰려는 쪽 네트워크 안에 그 서비스만 대신하는 주소를 만듭니다. 인터넷을 거치지 않습니다.",
  "표면을 없애는 축과 부여 범위를 좁히는 축은 서로 다른 문제를 풉니다.",
] as const;

const OPEN = "#ef4444";
const TUNNEL = "#8b5cf6";
const ENDPOINT = "#10b981";
const SCOPE = "#6366f1";
const MUTED = "#94a3b8";

export default function ReachViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="문제 정의"
      title="안쪽 자원에 바깥에서 닿는 세 가지 답"
      description="연결 방향과 부여 범위라는 두 축으로 정리합니다."
      note="세 답은 배타적이지 않으며 실제 구성은 섞여 쓰입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="사설 접근의 세 가지 구현"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            {step <= 2 && (
              <g>
                <text x={24} y={26} fontSize={9} fill={MUTED}>
                  바깥 · 인터넷
                </text>
                <rect x={24} y={40} width={96} height={34} fill={MUTED} fillOpacity={0.08} stroke={MUTED} strokeWidth={1} />
                <text x={72} y={61} textAnchor="middle" fontSize={9} fill={MUTED}>
                  사용자
                </text>
                <rect x={296} y={36} width={160} height={128} fill={MUTED} fillOpacity={0.04} stroke={MUTED} strokeWidth={1} strokeDasharray="4 3" />
                <text x={376} y={30} textAnchor="middle" fontSize={9} fill={MUTED}>
                  안쪽 네트워크
                </text>
                {[0, 1, 2].map((i) => (
                  <rect key={i} x={312} y={48 + i * 38} width={128} height={28} fill={MUTED} fillOpacity={0.07} stroke={MUTED} strokeWidth={1} />
                ))}
                <text x={376} y={66} textAnchor="middle" fontSize={8} fill={MUTED}>
                  대상 서비스
                </text>
                <text x={376} y={104} textAnchor="middle" fontSize={8} fill={MUTED}>
                  다른 내부 도구
                </text>
                <text x={376} y={142} textAnchor="middle" fontSize={8} fill={MUTED}>
                  관리 화면
                </text>

                {step === 0 && (
                  <g>
                    <line x1={120} y1={57} x2={296} y2={62} stroke={OPEN} strokeWidth={1.25} />
                    <rect x={288} y={48} width={16} height={28} fill={OPEN} fillOpacity={0.25} stroke={OPEN} strokeWidth={1} />
                    <text x={150} y={50} fontSize={8} fontWeight={700} fill={OPEN}>
                      열린 포트
                    </text>
                    <path d="M 376 76 L 376 92" stroke={OPEN} strokeWidth={1} strokeDasharray="3 2" />
                    <path d="M 376 114 L 376 130" stroke={OPEN} strokeWidth={1} strokeDasharray="3 2" />
                    <text x={24} y={186} fontSize={8} fill={OPEN}>
                      입구를 지나면 옆의 내부 도구로 계속 이어집니다.
                    </text>
                  </g>
                )}
                {step === 1 && (
                  <g>
                    <rect x={312} y={48} width={128} height={28} fill={TUNNEL} fillOpacity={0.14} stroke={TUNNEL} strokeWidth={1.25} />
                    <text x={376} y={66} textAnchor="middle" fontSize={8} fontWeight={700} fill={TUNNEL}>
                      커넥터와 대상 서비스
                    </text>
                    <line x1={312} y1={62} x2={190} y2={62} stroke={TUNNEL} strokeWidth={1.25} />
                    <polygon points="198,58 190,62 198,66" fill={TUNNEL} />
                    <rect x={140} y={48} width={50} height={28} fill={TUNNEL} fillOpacity={0.1} stroke={TUNNEL} strokeWidth={1} />
                    <text x={165} y={66} textAnchor="middle" fontSize={8} fontWeight={700} fill={TUNNEL}>
                      중계망
                    </text>
                    <line x1={120} y1={57} x2={140} y2={60} stroke={MUTED} strokeWidth={1} />
                    <text x={196} y={44} fontSize={8} fontWeight={700} fill={TUNNEL}>
                      안에서 바깥으로 먼저
                    </text>
                    <text x={24} y={186} fontSize={8} fill={TUNNEL}>
                      받을 포트가 없으므로 인터넷에서 직접 두드릴 대상이 없습니다.
                    </text>
                  </g>
                )}
                {step === 2 && (
                  <g>
                    <rect x={140} y={40} width={92} height={34} fill={ENDPOINT} fillOpacity={0.14} stroke={ENDPOINT} strokeWidth={1.25} />
                    <text x={186} y={56} textAnchor="middle" fontSize={8} fontWeight={700} fill={ENDPOINT}>
                      사설 엔드포인트
                    </text>
                    <text x={186} y={68} textAnchor="middle" fontSize={8} fill={ENDPOINT}>
                      소비자 쪽 사설 주소
                    </text>
                    <line x1={120} y1={57} x2={140} y2={57} stroke={ENDPOINT} strokeWidth={1.25} />
                    <line x1={232} y1={57} x2={312} y2={62} stroke={ENDPOINT} strokeWidth={1.25} strokeDasharray="4 3" />
                    <rect x={312} y={48} width={128} height={28} fill={ENDPOINT} fillOpacity={0.12} stroke={ENDPOINT} strokeWidth={1.25} />
                    <text x={376} y={66} textAnchor="middle" fontSize={8} fontWeight={700} fill={ENDPOINT}>
                      대상 서비스
                    </text>
                    <text x={236} y={44} fontSize={8} fill={ENDPOINT}>
                      제공자 내부망
                    </text>
                    <text x={24} y={186} fontSize={8} fill={ENDPOINT}>
                      인터넷을 거치지 않고, 닿는 대상도 그 서비스 하나뿐입니다.
                    </text>
                  </g>
                )}
              </g>
            )}
            {step === 3 && (
              <g>
                <line x1={40} y1={150} x2={456} y2={150} stroke={MUTED} strokeWidth={1} />
                <line x1={40} y1={30} x2={40} y2={150} stroke={MUTED} strokeWidth={1} />
                <text x={456} y={166} textAnchor="end" fontSize={8} fill={MUTED}>
                  연결 방향을 뒤집음 →
                </text>
                <text x={24} y={24} fontSize={8} fill={MUTED}>
                  ↑ 부여 범위가 좁음
                </text>
                <rect x={56} y={112} width={110} height={30} fill={OPEN} fillOpacity={0.14} stroke={OPEN} strokeWidth={1.25} />
                <text x={111} y={131} textAnchor="middle" fontSize={9} fontWeight={700} fill={OPEN}>
                  포트 개방 + 사설망
                </text>
                <rect x={300} y={112} width={110} height={30} fill={TUNNEL} fillOpacity={0.14} stroke={TUNNEL} strokeWidth={1.25} />
                <text x={355} y={131} textAnchor="middle" fontSize={9} fontWeight={700} fill={TUNNEL}>
                  대역 전체 커넥터
                </text>
                <rect x={300} y={44} width={110} height={30} fill={ENDPOINT} fillOpacity={0.14} stroke={ENDPOINT} strokeWidth={1.25} />
                <text x={355} y={63} textAnchor="middle" fontSize={9} fontWeight={700} fill={ENDPOINT}>
                  자원 단위 사설 접근
                </text>
                <rect x={56} y={44} width={110} height={30} fill={SCOPE} fillOpacity={0.1} stroke={SCOPE} strokeWidth={1} />
                <text x={111} y={63} textAnchor="middle" fontSize={9} fill={SCOPE}>
                  자원별 포트 개방
                </text>
                <text x={180} y={186} fontSize={8} fill={MUTED}>
                  한 축만 움직이면 반대쪽 문제가 그대로 남습니다.
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

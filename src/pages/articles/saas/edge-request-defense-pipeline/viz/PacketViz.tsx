import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: PacketLayer.tsx — 애니캐스트 분산과 커널 앞단 폐기, 규칙 하강 */
const SCENES = ["애니캐스트 분산", "커널 앞단 폐기", "표본과 지문", "규칙 하강"] as const;
const NOTES = [
  "같은 주소를 여러 지점이 광고해 공격 트래픽이 한곳에 몰리지 않습니다.",
  "네트워크 카드 직후 프로그램이 기존 규칙에 맞는 패킷을 그 자리에서 버립니다.",
  "동시에 표본을 분석기로 보내고, 분석기가 공격 트래픽의 공통 필드 조합을 찾습니다.",
  "만들어진 규칙을 앞단으로 내려보냅니다. 양이 많을수록 더 앞쪽 층에 놓입니다.",
] as const;

const NET = "#6366f1";
const DROP = "#ef4444";
const ANALYZE = "#f59e0b";
const RULE = "#10b981";
const MUTED = "#94a3b8";

export default function PacketViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="패킷 층"
      title="버리는 위치가 앞일수록 단가가 낮아집니다"
      description="도착부터 규칙 생성까지의 경로를 단계로 봅니다."
      note="구성요소 이름과 배치는 사업자마다 다르며 여기서는 공개된 구조만 정리했습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="패킷 층 방어 경로"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            {step === 0 ? (
              <g>
                <text x={24} y={34} fontSize={9} fill={MUTED}>
                  공격 트래픽
                </text>
                {[0, 1, 2].map((i) => (
                  <g key={i}>
                    <rect x={24} y={50 + i * 44} width={70} height={30} fill={DROP} fillOpacity={0.16} stroke={DROP} strokeWidth={1} />
                    <line x1={94} y1={65 + i * 44} x2={160} y2={65 + i * 44} stroke={MUTED} strokeWidth={1} />
                    <rect x={160} y={50 + i * 44} width={110} height={30} fill={NET} fillOpacity={0.12} stroke={NET} strokeWidth={1.25} />
                    <text x={215} y={70 + i * 44} textAnchor="middle" fontSize={9} fontWeight={700} fill={NET}>
                      지점 {i + 1}
                    </text>
                  </g>
                ))}
                <text x={300} y={110} fontSize={9} fontWeight={700} fill={NET}>
                  한곳에 몰리지 않음
                </text>
              </g>
            ) : (
              <g>
                <rect x={24} y={50} width={90} height={36} fill={NET} fillOpacity={0.12} stroke={NET} strokeWidth={1.25} />
                <text x={69} y={72} textAnchor="middle" fontSize={9} fontWeight={700} fill={NET}>
                  네트워크 카드
                </text>
                <line x1={114} y1={68} x2={146} y2={68} stroke={MUTED} strokeWidth={1} />
                <rect x={146} y={50} width={110} height={36} fill={DROP} fillOpacity={0.14} stroke={DROP} strokeWidth={1.25} />
                <text x={201} y={66} textAnchor="middle" fontSize={9} fontWeight={700} fill={DROP}>
                  커널 앞단 필터
                </text>
                <text x={201} y={80} textAnchor="middle" fontSize={8} fill={DROP}>
                  규칙 적용 · 폐기
                </text>
                <line x1={256} y1={68} x2={288} y2={68} stroke={MUTED} strokeWidth={1} />
                <rect x={288} y={50} width={90} height={36} fill={MUTED} fillOpacity={0.08} stroke={MUTED} strokeWidth={1} />
                <text x={333} y={72} textAnchor="middle" fontSize={9} fill={MUTED}>
                  커널 스택
                </text>

                {step >= 2 && (
                  <g>
                    <line x1={201} y1={86} x2={201} y2={112} stroke={ANALYZE} strokeWidth={1} strokeDasharray="3 2" />
                    <rect x={146} y={112} width={150} height={40} fill={ANALYZE} fillOpacity={0.12} stroke={ANALYZE} strokeWidth={1.25} />
                    <text x={221} y={130} textAnchor="middle" fontSize={9} fontWeight={700} fill={ANALYZE}>
                      표본 분석기
                    </text>
                    <text x={221} y={144} textAnchor="middle" fontSize={8} fill={ANALYZE}>
                      후보 지문 생성 · 최적 조합 선택
                    </text>
                  </g>
                )}
                {step >= 3 && (
                  <g>
                    <path d="M 146 132 L 120 132 L 120 68 L 146 68" fill="none" stroke={RULE} strokeWidth={1.25} />
                    <text x={24} y={132} fontSize={9} fontWeight={700} fill={RULE}>
                      규칙 하강
                    </text>
                    <text x={24} y={148} fontSize={8} fill={RULE}>
                      양이 많을수록
                    </text>
                    <text x={24} y={162} fontSize={8} fill={RULE}>
                      더 앞쪽 층으로
                    </text>
                  </g>
                )}
                <text x={24} y={34} fontSize={9} fill={MUTED}>
                  서버 안에서의 경로
                </text>
                {step === 1 && (
                  <text x={146} y={180} fontSize={9} fontWeight={700} fill={DROP}>
                    커널 스택에 들어가기 전에 버리면 그 처리 비용이 사라집니다
                  </text>
                )}
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

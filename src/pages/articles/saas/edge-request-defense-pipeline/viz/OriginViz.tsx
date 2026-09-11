import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: OriginProtection.tsx — 우회 경로와 두 가지 차단 방식 */
const SCENES = ["정상 경로", "우회 경로", "허용 목록", "역방향 터널"] as const;
const NOTES = [
  "이름 조회가 엣지를 가리키므로 요청은 검사를 거쳐 오리진에 닿습니다.",
  "오리진 주소를 아는 쪽은 엣지를 건너뜁니다. 앞의 모든 층이 무의미해집니다.",
  "오리진이 엣지에서 온 연결만 받게 합니다. 주소 목록은 변하므로 갱신이 필요합니다.",
  "오리진이 바깥으로 먼저 연결을 겁니다. 받을 포트가 없으니 우회할 대상 자체가 없습니다.",
] as const;

const EDGE = "#6366f1";
const ORIGIN = "#10b981";
const BYPASS = "#ef4444";
const TUNNEL = "#8b5cf6";
const MUTED = "#94a3b8";

export default function OriginViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="오리진 보호"
      title="검사를 건너뛸 길이 남아 있으면 앞의 층은 장식입니다"
      description="우회가 생기는 이유와 두 가지 대응을 비교합니다."
      note="터널 방식의 이름과 구현은 사업자마다 다르며 여기서는 연결 방향만 비교합니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="오리진 우회 경로와 대응"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 190" className="mt-4 w-full max-w-2xl">
            <rect x={24} y={62} width={86} height={38} fill={MUTED} fillOpacity={0.08} stroke={MUTED} strokeWidth={1} />
            <text x={67} y={85} textAnchor="middle" fontSize={9} fontWeight={700} fill={MUTED}>
              클라이언트
            </text>
            <rect x={180} y={62} width={100} height={38} fill={EDGE} fillOpacity={0.14} stroke={EDGE} strokeWidth={1.25} />
            <text x={230} y={79} textAnchor="middle" fontSize={9} fontWeight={700} fill={EDGE}>
              엣지 검사
            </text>
            <text x={230} y={93} textAnchor="middle" fontSize={8} fill={EDGE}>
              앞의 모든 층
            </text>
            <rect x={352} y={62} width={104} height={38} fill={ORIGIN} fillOpacity={0.12} stroke={ORIGIN} strokeWidth={1.25} />
            <text x={404} y={85} textAnchor="middle" fontSize={9} fontWeight={700} fill={ORIGIN}>
              오리진
            </text>

            <line x1={110} y1={81} x2={180} y2={81} stroke={step === 1 ? MUTED : EDGE} strokeWidth={1.25} />
            {step !== 3 && <line x1={280} y1={81} x2={352} y2={81} stroke={step === 1 ? MUTED : EDGE} strokeWidth={1.25} />}

            {step === 1 && (
              <g>
                <path d="M 67 62 L 67 28 L 404 28 L 404 62" fill="none" stroke={BYPASS} strokeWidth={1.25} strokeDasharray="4 3" />
                <text x={235} y={22} textAnchor="middle" fontSize={9} fontWeight={700} fill={BYPASS}>
                  오리진 주소를 알면 검사를 건너뜁니다
                </text>
                <text x={24} y={132} fontSize={8} fill={BYPASS}>
                  주소가 새는 길: 과거 이름 조회 기록 · 메일 발송 서버 · 인증서 투명성 기록 · 오류 페이지
                </text>
              </g>
            )}
            {step === 2 && (
              <g>
                <rect x={330} y={54} width={12} height={54} fill={ORIGIN} fillOpacity={0.2} stroke={ORIGIN} strokeWidth={1} />
                <text x={336} y={124} textAnchor="middle" fontSize={8} fill={ORIGIN}>
                  허용 목록
                </text>
                <path d="M 67 62 L 67 28 L 404 28 L 404 54" fill="none" stroke={BYPASS} strokeWidth={1.25} strokeDasharray="4 3" opacity={0.4} />
                <line x1={396} y1={34} x2={412} y2={50} stroke={BYPASS} strokeWidth={1.25} />
                <line x1={412} y1={34} x2={396} y2={50} stroke={BYPASS} strokeWidth={1.25} />
                <text x={24} y={150} fontSize={8} fill={MUTED}>
                  엣지 주소 목록이 바뀌면 갱신해야 하고, 주소만으로는 같은 엣지를 쓰는 다른 고객도 통과합니다.
                </text>
                <text x={24} y={164} fontSize={8} fill={ORIGIN}>
                  그래서 주소 확인에 더해 상호 인증서 검증을 함께 겁니다.
                </text>
              </g>
            )}
            {step === 3 && (
              <g>
                <path d="M 352 81 L 280 81" fill="none" stroke={TUNNEL} strokeWidth={1.25} markerEnd="" />
                <polygon points="288,77 280,81 288,85" fill={TUNNEL} />
                <text x={316} y={70} textAnchor="middle" fontSize={8} fontWeight={700} fill={TUNNEL}>
                  바깥으로 먼저
                </text>
                <text x={24} y={136} fontSize={8} fill={TUNNEL}>
                  오리진이 연결을 거는 쪽이므로 받을 포트를 열어 둘 필요가 없습니다.
                </text>
                <text x={24} y={150} fontSize={8} fill={MUTED}>
                  대신 터널 소프트웨어와 그 자격 증명이 새 신뢰 지점이 됩니다.
                </text>
              </g>
            )}
            {step === 0 && (
              <text x={24} y={136} fontSize={8} fill={MUTED}>
                이름 조회 결과가 엣지를 가리키는 동안에는 이 경로가 유일합니다.
              </text>
            )}
          </svg>
          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">{NOTES[step]}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}

import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: PrivateEndpoint.tsx — 인터페이스 생성, 주소 겹침, 단방향, 승인과 정책 */
const SCENES = ["두 네트워크를 붙이면", "인터페이스만 만들면", "단방향", "승인과 정책"] as const;
const NOTES = [
  "대역이 겹치면 붙일 수 없고, 붙고 나면 양쪽이 서로의 주소로 오갈 수 있게 됩니다.",
  "소비자 서브넷 안에 그 서비스만 대신하는 인터페이스를 만들고 소비자 대역의 사설 주소를 붙입니다.",
  "소비자가 서비스에 닿을 뿐 제공자가 소비자 안을 보게 되지는 않습니다.",
  "요청은 소비자가 걸고 승인은 제공자가 합니다. 인터페이스에 정책을 얹어 무엇이 허용되는지 좁힙니다.",
] as const;

const PEER = "#ef4444";
const CONSUMER = "#6366f1";
const PROVIDER = "#10b981";
const POLICY = "#f59e0b";
const MUTED = "#94a3b8";

export default function EndpointViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="구현 2"
      title="연결되는 것이 네트워크가 아니라 인터페이스 하나입니다"
      description="두 네트워크를 붙이는 방식과의 차이를 네 장면으로 봅니다."
      note="주소 대역은 설명을 위한 예시이며 실제 구성은 계정·리전에 따라 다릅니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="사설 엔드포인트의 구조"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            <rect x={24} y={40} width={190} height={84} fill={CONSUMER} fillOpacity={0.05} stroke={CONSUMER} strokeWidth={1} strokeDasharray="4 3" />
            <text x={119} y={34} textAnchor="middle" fontSize={9} fontWeight={700} fill={CONSUMER}>
              소비자 네트워크 · 10.0.0.0/16
            </text>
            <rect x={266} y={40} width={190} height={84} fill={PROVIDER} fillOpacity={0.05} stroke={PROVIDER} strokeWidth={1} strokeDasharray="4 3" />
            <text x={361} y={34} textAnchor="middle" fontSize={9} fontWeight={700} fill={PROVIDER}>
              제공자 네트워크 · 10.0.0.0/16
            </text>
            <rect x={40} y={56} width={90} height={28} fill={CONSUMER} fillOpacity={0.12} stroke={CONSUMER} strokeWidth={1} />
            <text x={85} y={74} textAnchor="middle" fontSize={8} fill={CONSUMER}>
              클라이언트
            </text>
            <rect x={350} y={56} width={90} height={28} fill={PROVIDER} fillOpacity={0.12} stroke={PROVIDER} strokeWidth={1} />
            <text x={395} y={74} textAnchor="middle" fontSize={8} fill={PROVIDER}>
              대상 서비스
            </text>

            {step === 0 && (
              <g>
                <line x1={214} y1={82} x2={266} y2={82} stroke={PEER} strokeWidth={1.25} />
                <line x1={228} y1={74} x2={252} y2={90} stroke={PEER} strokeWidth={1.25} />
                <line x1={252} y1={74} x2={228} y2={90} stroke={PEER} strokeWidth={1.25} />
                <text x={240} y={110} textAnchor="middle" fontSize={8} fontWeight={700} fill={PEER}>
                  대역이 같아 붙일 수 없음
                </text>
                <text x={24} y={160} fontSize={8} fill={PEER}>
                  붙는다 해도 경로가 양방향으로 생겨 제공자 쪽에서도 소비자 안을 볼 수 있게 됩니다.
                </text>
              </g>
            )}
            {step >= 1 && (
              <g>
                <rect x={140} y={86} width={66} height={30} fill={PROVIDER} fillOpacity={0.16} stroke={PROVIDER} strokeWidth={1.25} />
                <text x={173} y={100} textAnchor="middle" fontSize={8} fontWeight={700} fill={PROVIDER}>
                  인터페이스
                </text>
                <text x={173} y={111} textAnchor="middle" fontSize={7} fill={PROVIDER}>
                  10.0.3.14
                </text>
                <line x1={130} y1={70} x2={173} y2={86} stroke={CONSUMER} strokeWidth={1.25} />
                <path d="M 206 96 L 266 82 L 350 70" fill="none" stroke={PROVIDER} strokeWidth={1.25} strokeDasharray="4 3" />
                {step <= 2 && (
                  <text x={236} y={140} textAnchor="middle" fontSize={8} fill={PROVIDER}>
                    제공자 내부망 · 인터넷 경유 없음
                  </text>
                )}
              </g>
            )}
            {step === 1 && (
              <text x={24} y={162} fontSize={8} fill={MUTED}>
                주소는 소비자 대역에서 뽑으므로 상대 네트워크의 주소 체계를 알 필요가 없습니다.
              </text>
            )}
            {step === 2 && (
              <g>
                <path d="M 350 100 L 266 100" fill="none" stroke={PEER} strokeWidth={1} strokeDasharray="3 3" opacity={0.5} />
                <line x1={296} y1={92} x2={312} y2={108} stroke={PEER} strokeWidth={1.25} />
                <line x1={312} y1={92} x2={296} y2={108} stroke={PEER} strokeWidth={1.25} />
                <text x={24} y={162} fontSize={8} fontWeight={700} fill={PROVIDER}>
                  소비자 → 서비스 방향만 성립합니다.
                </text>
                <text x={24} y={180} fontSize={8} fill={MUTED}>
                  제공자가 소비자 네트워크 안을 탐색할 경로는 만들어지지 않습니다.
                </text>
              </g>
            )}
            {step === 3 && (
              <g>
                <rect x={24} y={148} width={130} height={26} fill={CONSUMER} fillOpacity={0.12} stroke={CONSUMER} strokeWidth={1} />
                <text x={89} y={165} textAnchor="middle" fontSize={8} fontWeight={700} fill={CONSUMER}>
                  소비자가 연결 요청
                </text>
                <line x1={154} y1={161} x2={180} y2={161} stroke={MUTED} strokeWidth={1} />
                <rect x={180} y={148} width={130} height={26} fill={PROVIDER} fillOpacity={0.12} stroke={PROVIDER} strokeWidth={1} />
                <text x={245} y={165} textAnchor="middle" fontSize={8} fontWeight={700} fill={PROVIDER}>
                  제공자가 수락·거절
                </text>
                <line x1={310} y1={161} x2={336} y2={161} stroke={MUTED} strokeWidth={1} />
                <rect x={336} y={148} width={120} height={26} fill={POLICY} fillOpacity={0.12} stroke={POLICY} strokeWidth={1} />
                <text x={396} y={165} textAnchor="middle" fontSize={8} fontWeight={700} fill={POLICY}>
                  정책으로 범위 제한
                </text>
                <text x={24} y={192} fontSize={8} fill={MUTED}>
                  앞은 붙어도 되는지를, 뒤는 붙은 뒤 무엇이 허용되는지를 정합니다.
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

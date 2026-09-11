import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: LinkAxis.tsx — 세 가지 연결 철학 */
const SCENES = ["전용 스위치", "전용 링크 메시", "패키지 내장 이더넷", "쏠림이 생기면"] as const;
const NOTES = [
  "모든 쌍이 스위치를 거쳐 같은 대역폭으로 통신합니다. 어느 두 장을 붙이든 성능이 같습니다.",
  "스위치 없이 서로 직접 잇습니다. 쌍별 대역폭은 그 쌍을 잇는 링크 수로 정해집니다.",
  "가속기에 표준 이더넷 포트를 넣어 노드 안팎을 같은 방식으로 잇습니다.",
  "MoE처럼 트래픽이 몰리는 패턴에서는 구조에 따라 병목이 다르게 나타납니다.",
] as const;

const NODE = "#6366f1";
const SW = "#10b981";
const MESH = "#f59e0b";
const ETH = "#8b5cf6";
const HOT = "#ef4444";

const POS = [
  [120, 56], [220, 56], [320, 56],
  [120, 140], [220, 140], [320, 140],
];

export default function LinkViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  const color = step === 0 ? SW : step === 1 ? MESH : step === 2 ? ETH : MESH;
  return (
    <VizFrame
      eyebrow="링크 축"
      title="같은 여섯 장이라도 잇는 방식이 다릅니다"
      description="가속기 여섯 장을 세 가지 방식으로 연결해 봅니다."
      note="실제 제품의 링크 수와 토폴로지는 더 복잡하며 그림은 구조만 보여 줍니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="세 가지 가속기 연결 방식"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            {step === 0 && (
              <g>
                <rect x={196} y={88} width={88} height={24} fill={SW} fillOpacity={0.18} stroke={SW} strokeWidth={1.25} />
                <text x={240} y={104} textAnchor="middle" fontSize={9} fontWeight={700} fill={SW}>
                  전용 스위치
                </text>
                {POS.map(([x, y], i) => (
                  <line key={i} x1={x + 24} y1={y + 16} x2={240} y2={100} stroke={SW} strokeWidth={1} />
                ))}
              </g>
            )}
            {(step === 1 || step === 3) && (
              <g>
                {POS.map(([x1, y1], i) =>
                  POS.map(([x2, y2], j) => {
                    if (j <= i) return null;
                    const adjacent = Math.abs(x1 - x2) <= 100 && Math.abs(y1 - y2) <= 84;
                    if (!adjacent) return null;
                    const hot = step === 3 && i === 1 && j === 4;
                    return (
                      <line
                        key={`${i}-${j}`}
                        x1={x1 + 24}
                        y1={y1 + 16}
                        x2={x2 + 24}
                        y2={y2 + 16}
                        stroke={hot ? HOT : MESH}
                        strokeWidth={hot ? 1.25 : 1}
                      />
                    );
                  }),
                )}
              </g>
            )}
            {step === 2 && (
              <g>
                <rect x={180} y={88} width={120} height={24} fill={ETH} fillOpacity={0.12} stroke={ETH} strokeWidth={1.25} />
                <text x={240} y={104} textAnchor="middle" fontSize={9} fontWeight={700} fill={ETH}>
                  일반 이더넷 스위치
                </text>
                {POS.map(([x, y], i) => (
                  <line key={i} x1={x + 24} y1={y + 16} x2={240} y2={100} stroke={ETH} strokeWidth={1} strokeDasharray="3 2" />
                ))}
                <text x={352} y={104} fontSize={8} fill={ETH}>
                  노드 밖도 같은 방식
                </text>
              </g>
            )}

            {POS.map(([x, y], i) => (
              <g key={`n-${i}`}>
                <rect x={x} y={y} width={48} height={32} fill={NODE} fillOpacity={0.12} stroke={NODE} strokeWidth={1} />
                <text x={x + 24} y={y + 20} textAnchor="middle" fontSize={8} fontWeight={700} fill={NODE}>
                  GPU {i + 1}
                </text>
              </g>
            ))}

            <text x={16} y={30} fontSize={9} fontWeight={700} fill={color}>
              {["모든 쌍이 동일 대역폭", "이웃은 직결, 먼 쌍은 중계", "노드 안팎이 같은 프로토콜", "쏠린 링크가 먼저 포화"][step]}
            </text>
            {step === 3 && (
              <text x={16} y={190} fontSize={9} fontWeight={700} fill={HOT}>
                균일 패브릭에서는 흡수되는 쏠림이 메시에서는 병목이 됩니다
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

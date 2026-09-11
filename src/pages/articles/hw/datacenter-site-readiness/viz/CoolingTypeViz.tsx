import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: CoolingType.tsx — 네 가지 냉각 방식의 배기 경로 */
const SCENES = ["후면 배기형", "개방형 축류", "밀집 구성에서", "액체 냉각"] as const;
const NOTES = [
  "바람을 카드 안쪽 통로로 밀어 브래킷 밖으로 내보냅니다. 옆 카드를 데우지 않습니다.",
  "카드 주변으로 흩뿌립니다. 조용하고 효율적이지만 배기가 섀시 안에 남습니다.",
  "밀집 구성에서 개방형은 안쪽 카드가 옆 카드의 배기를 다시 마십니다.",
  "액체로 열을 빼면 공기로 못 버리는 전력을 처리하지만 전산실 설비가 함께 필요합니다.",
] as const;

const CARD = "#6366f1";
const HOT = "#ef4444";
const COOL = "#10b981";
const LIQ = "#8b5cf6";
const MUTED = "#94a3b8";

export default function CoolingTypeViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="냉각 방식"
      title="배기가 어디로 가느냐가 밀집 가능 여부를 정합니다"
      description="섀시 단면을 단순화해 배기 경로만 그렸습니다."
      note="실제 기류는 섀시 팬과 배플 설계에 따라 크게 달라집니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="가속기 냉각 방식 비교"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            <rect x={40} y={40} width={400} height={110} fill="none" stroke={MUTED} strokeWidth={1.25} />
            <text x={40} y={32} fontSize={9} fill={MUTED}>
              섀시 단면 · 왼쪽 흡기, 오른쪽 배기
            </text>

            {(step === 0 || step === 2 || step === 3) &&
              [0, 1, 2].map((i) => (
                <rect key={`c-${i}`} x={120 + i * 90} y={56} width={60} height={80} fill={step === 3 ? LIQ : CARD} fillOpacity={0.14} stroke={step === 3 ? LIQ : CARD} strokeWidth={1.25} />
              ))}
            {step === 1 && [0].map((i) => (
              <rect key={`c1-${i}`} x={180} y={56} width={80} height={80} fill={CARD} fillOpacity={0.14} stroke={CARD} strokeWidth={1.25} />
            ))}

            {step === 0 && (
              <g>
                {[0, 1, 2].map((i) => (
                  <line key={i} x1={120 + i * 90} y1={96} x2={180 + i * 90} y2={96} stroke={COOL} strokeWidth={1.25} />
                ))}
                <line x1={390} y1={96} x2={436} y2={96} stroke={HOT} strokeWidth={1.25} />
                <text x={356} y={168} fontSize={9} fontWeight={700} fill={HOT}>
                  배기는 섀시 밖으로
                </text>
              </g>
            )}
            {step === 1 && (
              <g>
                {[-1, 1].map((d) => (
                  <line key={d} x1={220} y1={96} x2={220 + d * 70} y2={96 - d * 26} stroke={HOT} strokeWidth={1} />
                ))}
                <text x={120} y={168} fontSize={9} fontWeight={700} fill={COOL}>
                  단일 카드에서는 조용하고 효율적
                </text>
              </g>
            )}
            {step === 2 && (
              <g>
                {[0, 1].map((i) => (
                  <line key={i} x1={180 + i * 90} y1={96} x2={210 + i * 90} y2={96} stroke={HOT} strokeWidth={1.25} strokeDasharray="3 2" />
                ))}
                <text x={120} y={168} fontSize={9} fontWeight={700} fill={HOT}>
                  안쪽 카드가 옆 카드의 배기를 다시 마심
                </text>
              </g>
            )}
            {step === 3 && (
              <g>
                {[0, 1, 2].map((i) => (
                  <rect key={i} x={126 + i * 90} y={62} width={48} height={12} fill={LIQ} fillOpacity={0.4} stroke={LIQ} strokeWidth={1} />
                ))}
                <path d="M 120 68 L 90 68 L 90 170 L 430 170" fill="none" stroke={LIQ} strokeWidth={1.25} />
                <text x={200} y={186} fontSize={9} fontWeight={700} fill={LIQ}>
                  분배 장치·배관·누수 감지가 전산실에 있어야 합니다
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

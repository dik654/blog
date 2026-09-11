import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: LaneBudget.tsx — 레인 예산과 나눠 쓰기 */
const SCENES = ["가속기만", "NIC·NVMe 추가", "예산 초과", "스위치로 나누기"] as const;
const NOTES = [
  "가속기 여덟 장이 각 16레인이면 128레인입니다. 단일 소켓 예산을 거의 다 씁니다.",
  "고속 네트워크 카드와 저장장치를 더하면 요구가 더 늘어납니다.",
  "단일 소켓 예산을 넘습니다. 소켓을 늘리거나 나눠 쓰거나 폭을 줄여야 합니다.",
  "스위치 아래 묶으면 들어가지만 동시에 쓰면 상위 링크를 나눠 갖습니다.",
] as const;

const GPU = "#6366f1";
const NIC = "#8b5cf6";
const SSD = "#f59e0b";
const OVER = "#ef4444";
const OKC = "#10b981";
const MUTED = "#94a3b8";

export default function LaneViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  const budget = 128;
  const need = [128, 128 + 32 + 16, 128 + 32 + 16, 128 + 32 + 16][step];
  const px = 400 / 200;
  return (
    <VizFrame
      eyebrow="레인 예산"
      title="장치를 더할수록 예산은 빠르게 찹니다"
      description="가속기 8장 구성에 네트워크와 저장장치를 더해 봅니다."
      note="장치별 레인 수와 소켓당 예산은 제품마다 다르며 여기서는 흔한 값을 씁니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="PCIe 레인 예산 계산"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            <text x={24} y={34} fontSize={9} fontWeight={700} fill={MUTED}>
              소켓당 예산 {budget}레인
            </text>
            <rect x={24} y={42} width={budget * px} height={22} fill="none" stroke={MUTED} strokeWidth={1.25} />
            <rect x={24} y={72} width={128 * px} height={22} fill={GPU} fillOpacity={0.28} stroke={GPU} strokeWidth={1} />
            <text x={30} y={88} fontSize={8} fontWeight={700} fill="#3730a3">
              가속기 8 × 16 = 128
            </text>
            {step >= 1 && (
              <g>
                <rect x={24 + 128 * px} y={72} width={32 * px} height={22} fill={NIC} fillOpacity={0.28} stroke={NIC} strokeWidth={1} />
                <rect x={24 + 160 * px} y={72} width={16 * px} height={22} fill={SSD} fillOpacity={0.28} stroke={SSD} strokeWidth={1} />
                <text x={24 + 128 * px} y={110} fontSize={8} fill={NIC}>
                  NIC 2 × 16
                </text>
                <text x={24 + 160 * px} y={110} fontSize={8} fill={SSD}>
                  NVMe 4 × 4
                </text>
              </g>
            )}
            {step >= 2 && (
              <g>
                <line x1={24 + budget * px} y1={38} x2={24 + budget * px} y2={100} stroke={OVER} strokeWidth={1.25} strokeDasharray="4 3" />
                <text x={24 + budget * px + 6} y={128} fontSize={9} fontWeight={700} fill={OVER}>
                  초과 {need - budget}레인
                </text>
              </g>
            )}
            {step >= 3 && (
              <g>
                <rect x={24} y={144} width={412} height={40} fill={OKC} fillOpacity={0.07} stroke={OKC} strokeWidth={1.25} />
                <text x={230} y={162} textAnchor="middle" fontSize={9} fontWeight={700} fill={OKC}>
                  스위치 아래 4장을 묶어 16레인 공유
                </text>
                <text x={230} y={176} textAnchor="middle" fontSize={8} fill={OKC}>
                  동시에 쓰면 각자 4레인 분량으로 떨어집니다
                </text>
              </g>
            )}
            <text x={24} y={132} fontSize={9} fill={MUTED}>
              합계 {need}레인 요구
            </text>
          </svg>
          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">{NOTES[step]}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}

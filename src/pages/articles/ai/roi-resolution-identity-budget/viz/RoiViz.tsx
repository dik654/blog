import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: RoiCrop.tsx — 픽셀 예산과 마스크 크기 */
const SCENES = ["예산을 넘겨 보내면", "예산에 맞춰 자르면", "마스크 크기", "0.142 → 0.943"] as const;
const NOTES = [
  "모델이 정해진 넓이로 다시 샘플링하므로 넘긴 만큼을 버리라고 보내는 셈이 됩니다.",
  "대상이 실제로 차지하는 비율이 커집니다. 잘라 보내는 목적이 여기 있습니다.",
  "부위 편집에서 마스크를 넓게 잡으면 얼굴 절반을 재생성하게 됩니다.",
  "모델도 프롬프트도 시드도 같습니다. 마스크만 좁혔습니다.",
] as const;

const OVER = "#ef4444";
const FIT = "#10b981";
const FACE = "#6366f1";
const MUTED = "#94a3b8";

export default function RoiViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="크롭과 마스크"
      title="크게 자를수록 좋은 것이 아닙니다"
      description="모델이 실제로 받는 예산과 마스크 크기를 함께 봅니다."
      note="예산 값은 모델마다 다르며 구체 수치는 각 구현을 확인해야 합니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="ROI 크롭 예산과 마스크 크기"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            {step <= 1 && (
              <g>
                <text x={24} y={24} fontSize={9} fill={MUTED}>
                  모델 예산이 1MP일 때
                </text>
                <rect x={24} y={38} width={150} height={110} fill={step === 0 ? OVER : FIT} fillOpacity={0.06} stroke={step === 0 ? OVER : FIT} strokeWidth={1.25} />
                <text x={99} y={34} textAnchor="middle" fontSize={8} fill={step === 0 ? OVER : FIT}>
                  보낸 크롭 {step === 0 ? "4MP" : "1MP"}
                </text>
                <rect x={step === 0 ? 78 : 60} y={step === 0 ? 82 : 66} width={step === 0 ? 22 : 58} height={step === 0 ? 22 : 58} fill={FACE} fillOpacity={0.3} stroke={FACE} strokeWidth={1} />
                <line x1={174} y1={93} x2={216} y2={93} stroke={MUTED} strokeWidth={1} />
                <text x={195} y={84} textAnchor="middle" fontSize={8} fill={MUTED}>
                  리샘플
                </text>
                <rect x={216} y={52} width={110} height={82} fill={step === 0 ? OVER : FIT} fillOpacity={0.08} stroke={step === 0 ? OVER : FIT} strokeWidth={1.25} />
                <text x={271} y={48} textAnchor="middle" fontSize={8} fill={step === 0 ? OVER : FIT}>
                  모델이 보는 1MP
                </text>
                <rect x={step === 0 ? 256 : 244} y={step === 0 ? 84 : 74} width={step === 0 ? 12 : 38} height={step === 0 ? 12 : 38} fill={FACE} fillOpacity={0.3} stroke={FACE} strokeWidth={1} />
                <text x={340} y={90} fontSize={9} fontWeight={700} fill={step === 0 ? OVER : FIT}>
                  {step === 0 ? "대상이 더 작아짐" : "대상이 커짐"}
                </text>
                <text x={340} y={108} fontSize={8} fill={MUTED}>
                  {step === 0 ? "잘라 보낸 의미가 사라짐" : "잘라 보내는 목적 달성"}
                </text>
                {step === 0 && (
                  <text x={24} y={178} fontSize={8} fill={OVER}>
                    실제로 2MP 전체 프레임을 그대로 넘겨 마스크 안 변화가 73.3이었고, 영역만 잘라 보내자 44.8이 됐습니다.
                  </text>
                )}
                {step === 1 && (
                  <text x={24} y={178} fontSize={8} fill={FIT}>
                    맥락이 들어갈 만큼 여유를 두되 예산을 넘지 않게 자릅니다.
                  </text>
                )}
              </g>
            )}
            {step >= 2 && (
              <g>
                <text x={24} y={24} fontSize={9} fill={MUTED}>
                  뺨에 흉터를 더하는 편집 · 같은 모델·프롬프트·시드
                </text>
                <rect x={40} y={40} width={110} height={110} fill={MUTED} fillOpacity={0.05} stroke={MUTED} strokeWidth={1} />
                <rect x={56} y={62} width={78} height={58} fill={OVER} fillOpacity={0.22} stroke={OVER} strokeWidth={1.25} />
                <text x={95} y={94} textAnchor="middle" fontSize={8} fontWeight={700} fill={OVER}>
                  눈~입 박스
                </text>
                <text x={95} y={164} textAnchor="middle" fontSize={9} fontWeight={700} fill={OVER}>
                  정체성 0.142
                </text>
                <rect x={250} y={40} width={110} height={110} fill={MUTED} fillOpacity={0.05} stroke={MUTED} strokeWidth={1} />
                <rect x={286} y={78} width={16} height={44} fill={FIT} fillOpacity={0.3} stroke={FIT} strokeWidth={1.25} />
                <text x={330} y={102} fontSize={8} fontWeight={700} fill={FIT}>
                  좁은 띠
                </text>
                <text x={305} y={164} textAnchor="middle" fontSize={9} fontWeight={700} fill={FIT}>
                  정체성 0.943
                </text>
                {step === 3 && (
                  <text x={24} y={190} fontSize={8} fontWeight={700} fill={FIT}>
                    부위 편집 실패의 상당수가 모델이 아니라 "어디까지를 그 부위로 볼 것인가"에서 나옵니다.
                  </text>
                )}
                {step === 2 && (
                  <text x={24} y={190} fontSize={8} fill={OVER}>
                    넓은 마스크는 얼굴 절반을 재생성 범위에 넣습니다.
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

import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: BudgetGate.tsx — 어느 항이 넘치는지에 따라 손잡이가 다르다 */
const SCENES = ["두 숫자 재기", "가중치 항 초과", "activation 항 초과", "학습 대상 항 초과"] as const;
const NOTES = [
  "모델만 올린 직후와 한 스텝 뒤를 각각 재면 두 항이 분리됩니다.",
  "배치를 1로 줄여도 해결되지 않습니다. 사전계산이나 양자화로 부품을 줄여야 합니다.",
  "부품을 내려도 소용이 없습니다. checkpointing이나 배치·해상도 조정이 답입니다.",
  "전체 미세조정 중일 때만 나타납니다. 어댑터 방식으로 바꾸면 사라집니다.",
] as const;

const W = "#6366f1";
const ACT = "#ef4444";
const TR = "#f59e0b";
const OKC = "#10b981";
const MUTED = "#94a3b8";

const FIXES = [
  ["사전계산으로 부품 내리기", "양자화로 dtype 낮추기"],
  ["gradient checkpointing", "배치·해상도·프레임 줄이기"],
  ["어댑터 방식으로 전환", "optimizer state가 작은 옵티마이저"],
];

export default function GateViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  const idx = step - 1;
  const colors = [W, ACT, TR];
  return (
    <VizFrame
      eyebrow="판단 게이트"
      title="넘치는 항이 무엇인지에 따라 손잡이가 다릅니다"
      description="두 번 재면 세 항 중 어디가 문제인지 가려집니다."
      note="계산값은 하한이며 실제로 들어가는지는 한 스텝 돌려 확인해야 합니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="메모리 초과 원인 판정"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            <rect x={20} y={36} width={200} height={30} fill={OKC} fillOpacity={0.08} stroke={OKC} strokeWidth={1.25} />
            <text x={120} y={55} textAnchor="middle" fontSize={9} fontWeight={700} fill={OKC}>
              모델만 올린 직후 = 가중치 항
            </text>
            <rect x={20} y={74} width={200} height={30} fill={OKC} fillOpacity={0.08} stroke={OKC} strokeWidth={1.25} />
            <text x={120} y={93} textAnchor="middle" fontSize={9} fontWeight={700} fill={OKC}>
              한 스텝 뒤 증가분 = 나머지
            </text>

            {step >= 1 && (
              <g>
                <line x1={220} y1={70} x2={252} y2={70} stroke={MUTED} strokeWidth={1} />
                <rect x={252} y={36} width={208} height={30} fill={colors[idx]} fillOpacity={0.14} stroke={colors[idx]} strokeWidth={1.25} />
                <text x={356} y={55} textAnchor="middle" fontSize={9} fontWeight={700} fill={colors[idx]}>
                  {["가중치 항 초과", "activation 항 초과", "학습 대상 항 초과"][idx]}
                </text>
                {FIXES[idx].map((f, i) => (
                  <g key={f}>
                    <rect x={252} y={76 + i * 30} width={208} height={24} fill="none" stroke={colors[idx]} strokeWidth={1} />
                    <text x={356} y={92 + i * 30} textAnchor="middle" fontSize={9} fill={colors[idx]}>
                      {f}
                    </text>
                  </g>
                ))}
              </g>
            )}

            {step >= 1 && (
              <g>
                <rect x={20} y={150} width={440} height={26} fill="none" stroke={MUTED} strokeWidth={1} strokeDasharray="4 3" />
                <text x={240} y={167} textAnchor="middle" fontSize={9} fill={MUTED}>
                  {["배치를 줄여도 해결되지 않습니다", "부품을 내려도 소용이 없습니다", "어댑터 학습에서는 나타나지 않습니다"][idx]}
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

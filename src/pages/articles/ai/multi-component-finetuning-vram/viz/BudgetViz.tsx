import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: ComponentBudget.tsx — 부품별 가중치와 나머지 항의 비중 */
const SCENES = ["부품별 가중치", "학습 대상 항", "activation", "24GB 장치에 놓기"] as const;
const NOTES = [
  "예시 구성에서 가중치 합은 약 14.8 GB이고 text encoder 하나가 60%를 넘습니다.",
  "어댑터에만 붙는 gradient·master·optimizer state는 약 0.14 GB로 1%가 되지 않습니다.",
  "activation은 배치·해상도·프레임에 따라 달라져 계산보다 측정이 빠릅니다.",
  "가중치가 먼저 자리를 차지하므로 activation에 남는 여유가 생각보다 적습니다.",
] as const;

const DEN = "#6366f1";
const ENC = "#8b5cf6";
const VAE = "#f59e0b";
const AD = "#10b981";
const ACT = "#ef4444";
const MUTED = "#94a3b8";

const PARTS = [
  { name: "text encoder", gb: 9.4, color: ENC },
  { name: "denoiser", gb: 5.2, color: DEN },
  { name: "autoencoder", gb: 0.17, color: VAE },
  { name: "어댑터", gb: 0.02, color: AD },
];

export default function BudgetViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  const scale = 26;
  return (
    <VizFrame
      eyebrow="예산 분해"
      title="큰 것은 학습하지 않는 부품일 수 있습니다"
      description="예시 구성의 BF16 기준 값입니다. 특정 제품의 수치가 아닙니다."
      note="실제 사용량은 할당기 단편화와 커널 작업 공간 때문에 이보다 큽니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="부품별 메모리 예산"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            {step < 3 ? (
              <g>
                {PARTS.map((p, i) => {
                  const y = 40 + i * 30;
                  return (
                    <g key={p.name}>
                      <text x={20} y={y + 14} fontSize={9} fill={p.color}>
                        {p.name}
                      </text>
                      <rect x={132} y={y} width={Math.max(2, p.gb * scale)} height={20} fill={p.color} fillOpacity={0.3} stroke={p.color} strokeWidth={1} />
                      <text x={132 + Math.max(2, p.gb * scale) + 6} y={y + 14} fontSize={8} fill={p.color}>
                        {p.gb} GB
                      </text>
                    </g>
                  );
                })}
                {step >= 1 && (
                  <g>
                    <text x={20} y={174} fontSize={9} fill={AD}>
                      학습 대상 항
                    </text>
                    <rect x={132} y={160} width={Math.max(2, 0.14 * scale)} height={20} fill={AD} fillOpacity={0.4} stroke={AD} strokeWidth={1} />
                    <text x={144} y={174} fontSize={8} fill={AD}>
                      0.14 GB (gradient + master + state)
                    </text>
                  </g>
                )}
                {step >= 2 && (
                  <text x={280} y={30} fontSize={9} fontWeight={700} fill={ACT}>
                    activation은 실행 조건에 따라 별도
                  </text>
                )}
              </g>
            ) : (
              <g>
                <text x={20} y={34} fontSize={9} fontWeight={700} fill={MUTED}>
                  24 GB 장치
                </text>
                <rect x={20} y={44} width={440} height={44} fill="none" stroke={MUTED} strokeWidth={1.25} />
                {(() => {
                  let x = 20;
                  const px = 440 / 24;
                  return PARTS.map((p) => {
                    const w = p.gb * px;
                    const el = (
                      <g key={p.name}>
                        <rect x={x} y={44} width={Math.max(1, w)} height={44} fill={p.color} fillOpacity={0.3} stroke={p.color} strokeWidth={1} />
                      </g>
                    );
                    x += w;
                    return el;
                  });
                })()}
                <rect x={20 + 14.79 * (440 / 24)} y={44} width={440 - 14.79 * (440 / 24)} height={44} fill={ACT} fillOpacity={0.08} stroke={ACT} strokeWidth={1.25} strokeDasharray="4 3" />
                <text x={20 + 14.79 * (440 / 24) + 10} y={70} fontSize={9} fontWeight={700} fill={ACT}>
                  activation에 남는 여유 약 9 GB
                </text>
                <text x={20} y={110} fontSize={9} fill={MUTED}>
                  가중치 14.8 GB가 먼저 자리를 차지합니다
                </text>
                <text x={20} y={132} fontSize={9} fill={ACT}>
                  배치·해상도·프레임을 올리면 점선 영역부터 넘칩니다
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

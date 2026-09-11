import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: ProductTiers.tsx — 계열을 가르는 것은 코어가 아니다 */
const SCENES = ["코어 수로 보면", "레인으로 보면", "채널로 보면", "관리 기능까지"] as const;
const NOTES = [
  "코어 수는 계열끼리 겹칩니다. 이 축만 보면 구분이 되지 않습니다.",
  "레인은 계열마다 크게 갈립니다. 붙일 수 있는 가속기 수가 여기서 정해집니다.",
  "채널도 함께 갈려 메모리 대역폭과 최대 용량의 상한이 달라집니다.",
  "원격 관리와 이중화는 플랫폼이 제공합니다. 무인 운영 여부가 여기서 갈립니다.",
] as const;

const SRV = "#6366f1";
const WS = "#10b981";
const HED = "#f59e0b";
const MUTED = "#94a3b8";

const TIERS = [
  { n: "서버", c: SRV, core: 0.9, lane: 1.0, ch: 1.0, mgmt: true },
  { n: "워크스테이션", c: WS, core: 0.75, lane: 1.0, ch: 0.67, mgmt: false },
  { n: "고성능 데스크톱", c: HED, core: 0.7, lane: 0.375, ch: 0.5, mgmt: false },
];

export default function TierViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  const key = (["core", "lane", "ch", "ch"] as const)[step];
  const label = ["코어 수 (상대)", "PCIe 레인 (상대)", "메모리 채널 (상대)", "메모리 채널 (상대)"][step];
  return (
    <VizFrame
      eyebrow="제품군 경계"
      title="코어로는 안 갈리고 레인으로는 갈립니다"
      description="같은 세 계열을 축을 바꿔 가며 봅니다."
      note="상대값은 계열 간 간격을 보여 주기 위한 것이며 특정 모델의 사양이 아닙니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="제품군 비교 축"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            <text x={24} y={34} fontSize={9} fontWeight={700} fill={MUTED}>
              {label}
            </text>
            {TIERS.map((t, i) => {
              const y = 48 + i * 40;
              const v = t[key];
              return (
                <g key={t.n}>
                  <text x={24} y={y + 15} fontSize={9} fontWeight={700} fill={t.c}>
                    {t.n}
                  </text>
                  <rect x={150} y={y} width={v * 260} height={20} fill={t.c} fillOpacity={0.3} stroke={t.c} strokeWidth={1} />
                  <text x={150 + v * 260 + 6} y={y + 15} fontSize={8} fill={t.c}>
                    ×{v.toFixed(2)}
                  </text>
                </g>
              );
            })}
            {step === 0 && (
              <text x={24} y={186} fontSize={9} fontWeight={700} fill={MUTED}>
                세 계열이 겹쳐 있어 이 축으로는 고를 수 없습니다
              </text>
            )}
            {step === 1 && (
              <text x={24} y={186} fontSize={9} fontWeight={700} fill={HED}>
                데스크톱 계열은 가속기 8장 구성에 예산이 모자랍니다
              </text>
            )}
            {step === 3 && (
              <g>
                <rect x={24} y={170} width={412} height={24} fill={SRV} fillOpacity={0.07} stroke={SRV} strokeWidth={1.25} />
                <text x={230} y={186} textAnchor="middle" fontSize={9} fontWeight={700} fill={SRV}>
                  원격 관리·이중화·핫스왑은 서버 계열 플랫폼이 제공합니다
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

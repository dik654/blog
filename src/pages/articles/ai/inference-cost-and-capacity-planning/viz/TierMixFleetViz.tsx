import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 모델 등급 세 개에 같은 token 수요를 나눠 줬을 때 GPU가 어디로 가는지 보여 준다.
 * 한 mechanism: 등급별 GPU = ceil(수요 ÷ (replica 처리량 × u)) × replica당 GPU 수.
 * 막대 길이는 첫 장면의 전체 2,477장을 100%로 둔 같은 눈금이라 장면 사이 길이를 직접 비교할 수 있다.
 */
const SCENES = ["트래픽 3등분", "10%를 70B로", "405B를 FP8 8장"] as const;

const U = 0.7;
const BASE_TOTAL = 2477;

interface Tier {
  name: string;
  color: string;
  gpusPerReplica: number;
  tokensPerReplica: number;
  demand: number;
}

const TIERS: readonly (readonly Tier[])[] = [
  [
    { name: "8B", color: "#0d9488", gpusPerReplica: 1, tokensPerReplica: 5000, demand: 100000 },
    { name: "70B", color: "#2563eb", gpusPerReplica: 2, tokensPerReplica: 1800, demand: 100000 },
    { name: "405B BF16", color: "#d97706", gpusPerReplica: 16, tokensPerReplica: 1000, demand: 100000 },
  ],
  [
    { name: "8B", color: "#0d9488", gpusPerReplica: 1, tokensPerReplica: 5000, demand: 100000 },
    { name: "70B", color: "#2563eb", gpusPerReplica: 2, tokensPerReplica: 1800, demand: 130000 },
    { name: "405B BF16", color: "#d97706", gpusPerReplica: 16, tokensPerReplica: 1000, demand: 70000 },
  ],
  [
    { name: "8B", color: "#0d9488", gpusPerReplica: 1, tokensPerReplica: 5000, demand: 100000 },
    { name: "70B", color: "#2563eb", gpusPerReplica: 2, tokensPerReplica: 1800, demand: 100000 },
    { name: "405B FP8", color: "#d97706", gpusPerReplica: 8, tokensPerReplica: 1000, demand: 100000 },
  ],
];

const NOTES = [
  "405B replica는 16장으로 1,000 tokens/s라 token당 GPU-시간이 8B의 80배입니다. 트래픽은 3분의 1인데 GPU는 92.4%입니다.",
  "30,000 tokens/s를 70B로 옮기면 70B는 48장 늘고 405B는 688장 줄어 1,837장입니다. 옮긴 요청이 품질 기준을 넘어야 합니다.",
  "405B만 FP8로 서버 한 대 8장에 올립니다. 처리량을 그대로 둬도 2,288장이 1,144장이 됩니다. 응답 분포 비교를 통과해야 합니다.",
] as const;

function replicas(tier: Tier) {
  return Math.ceil(tier.demand / (tier.tokensPerReplica * U) - 1e-9);
}

export default function TierMixFleetViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3600);
  const scene = scenes.active;
  const tiers = TIERS[scene];
  const rows = tiers.map((tier) => {
    const count = replicas(tier);
    return { tier, count, gpus: count * tier.gpusPerReplica };
  });
  const total = rows.reduce((sum, row) => sum + row.gpus, 0);
  const largest = rows[2];

  return (
    <VizFrame
      eyebrow="Model tier mix"
      title="같은 token 수요라도 큰 모델 등급이 GPU 대부분을 가져갑니다"
      description="세 줄은 모델 등급이고 막대 길이는 GPU 수입니다. 모든 장면에서 처음 2,477장을 100%로 둔 같은 눈금을 씁니다."
      note="Replica당 처리량 5,000·1,800·1,000 tokens/s와 목표 utilization 0.7은 계산용 가정값입니다. 405B의 16장은 Llama 3 논문의 두 서버 BF16 배치이고, FP8 8장은 이 글이 Table 3로 직접 센 weight 크기에 근거한 배치입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="모델 등급별 GPU 수"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(scene + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scene]}</h4>

          <ol className="mt-4 space-y-4">
            {rows.map(({ tier, count, gpus }) => (
              <li key={tier.name} className="min-w-0">
                <div className="flex min-h-[2.5rem] flex-wrap content-start items-baseline justify-between gap-x-3 text-xs sm:min-h-0">
                  <span className="font-bold" style={{ color: tier.color }}>
                    {tier.name}
                  </span>
                  <span className="font-mono text-muted-foreground">
                    {(tier.demand / 1000).toLocaleString()}k tok/s → {count} replica × {tier.gpusPerReplica}장
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <div className="flex h-5 min-w-0 flex-1 items-center rounded-sm bg-muted/60">
                    <div
                      className="h-full rounded-sm transition-[width] duration-500"
                      style={{
                        width: `${Math.max((gpus / BASE_TOTAL) * 100, 0.8)}%`,
                        backgroundColor: tier.color,
                      }}
                    />
                  </div>
                  <span className="w-14 shrink-0 text-right font-mono text-xs font-bold text-foreground">
                    {gpus.toLocaleString()}장
                  </span>
                </div>
              </li>
            ))}
          </ol>

          <dl className="mt-4 grid grid-cols-3 gap-x-4 gap-y-2 font-mono text-xs">
            <div>
              <dt className="text-muted-foreground">전체 GPU</dt>
              <dd className="font-bold text-foreground">{total.toLocaleString()}장</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">405B 비중</dt>
              <dd className="font-bold text-foreground">{((largest.gpus / total) * 100).toFixed(1)}%</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">처음 대비</dt>
              <dd className="font-bold text-foreground">
                {total === BASE_TOTAL ? "—" : `−${(BASE_TOTAL - total).toLocaleString()}장`}
              </dd>
            </div>
          </dl>

          <p className="mt-4 min-h-[10.5rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground sm:min-h-[3.5rem]">
            {NOTES[scene]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}

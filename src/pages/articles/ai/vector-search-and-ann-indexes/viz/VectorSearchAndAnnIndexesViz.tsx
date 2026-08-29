import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 mechanism: embedding space 의 벡터가 exact 전수 비교에서 IVF cluster 분할로,
 * 다시 PQ code 압축으로 좁혀지는 과정. 장면 = 비교 대상이 줄어드는 한 단계.
 * 18개 점은 N=1,000,000 을 6 cluster × 3 점으로 simplify 한 것.
 * stage 높이는 고정, control row 는 아래 고정 row. SVG viewBox 고정.
 */
const SCENES = [
  "Exact NN · 전부와 비교",
  "IVF · cluster 로 분할",
  "nprobe=10 · 일부 cluster 만 탐색",
  "PQ · subvector 코드로 압축",
] as const;

const NOTES = [
  "Exact 검색은 query 를 색인의 벡터 N개 전부와 비교합니다. d=768, N=1,000,000 이면 query 하나당 100만 번의 거리 계산이 듭니다.",
  "IVF 는 k-means 로 벡터를 nlist개 cluster 로 나눕니다. 여기서는 nlist=1,000 을 cluster 6개로 simplify 했고, 각 cluster 는 평균 N/nlist=1,000개 벡터를 담습니다.",
  "검색은 query 와 가까운 centroid nprobe개만 골라 그 안에서만 정확 거리를 계산합니다. N=1,000,000, nlist=1,000, nprobe=10 이면 비교는 1,000(centroid)+10×1,000=11,000회로, exact 대비 약 90.9배 적습니다.",
  "Cluster 안의 벡터는 PQ 로 다시 압축됩니다. d=768 을 m=8 subvector 로 나눠 각각 k=256 centroid 의 id(1byte)로 바꾸면 3,072byte 이던 저장이 8byte 로, 384배 줄어듭니다.",
] as const;

type PointState = "compare" | "default" | "selected" | "excluded";

const CLUSTERS = [
  { cx: 90, cy: 66 },
  { cx: 214, cy: 52 },
  { cx: 340, cy: 74 },
  { cx: 104, cy: 176 },
  { cx: 236, cy: 196 },
  { cx: 366, cy: 164 },
] as const;

const OFFSETS = [
  [-14, -9],
  [13, 7],
  [-4, 15],
] as const;

const QUERY = { x: 466, y: 24 };

function pointsForCluster(clusterIndex: number) {
  const c = CLUSTERS[clusterIndex];
  return OFFSETS.map(([dx, dy], i) => ({
    id: `${clusterIndex}-${i}`,
    x: c.cx + dx,
    y: c.cy + dy,
  }));
}

const ALL_POINTS = CLUSTERS.flatMap((_, clusterIndex) => pointsForCluster(clusterIndex));
const SELECTED_CLUSTERS = [1, 4];

function pointState(scene: number, clusterIndex: number): PointState {
  if (scene === 0) return "compare";
  if (scene === 2) return SELECTED_CLUSTERS.includes(clusterIndex) ? "selected" : "excluded";
  return "default";
}

function pointClass(state: PointState) {
  switch (state) {
    case "compare":
      return "fill-amber-500/30 stroke-amber-600";
    case "selected":
      return "fill-primary/25 stroke-primary";
    case "excluded":
      return "fill-muted/40 stroke-border";
    default:
      return "fill-muted stroke-border";
  }
}

const HIT_LABEL = [
  "비교 1,000,000회 (전부)",
  "cluster 6개 표시 (실제 nlist=1,000)",
  "비교 ≈11,000회 (90.9× 감소)",
  "384× 압축 (3,072B → 8B)",
] as const;

const SUB_LABEL = [
  "d=768, N=1,000,000",
  "평균 cluster 크기 1,000",
  "nprobe=10 개 cluster 만 탐색",
  "m=8 subvector × k=256 centroid",
] as const;

export default function VectorSearchAndAnnIndexesViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3000);
  const scene = scenes.active;

  return (
    <VizFrame
      eyebrow="IVF · Product Quantization"
      title="비교 대상은 exact 전수 비교에서 cluster 로, 다시 압축된 code 로 좁혀집니다"
      description="18개 점은 N=1,000,000 벡터를 6 cluster × 3 점으로 단순화한 것입니다. 노란 점은 이번에 비교하는 전부, 파란 점은 선택된 cluster, 회색은 탐색하지 않는 cluster 입니다."
      note="실제 nlist=1,000·nprobe=10·N=1,000,000 은 본문 수식에서 다룹니다. 이 그림은 비율만 보이는 단순화입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="Exact NN 에서 IVF cluster 분할, PQ 압축으로 비교 대상이 줄어드는 과정"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(33rem,calc(100dvh-15rem))] min-h-[26rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(scene + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scene]}</h4>

          <div className="mt-4 grid gap-4 sm:grid-cols-[minmax(0,3fr)_minmax(0,1fr)]">
            <div className="min-w-0 overflow-x-auto border border-border">
              <svg viewBox="0 0 520 250" className="h-[15.5rem] w-full min-w-[26rem]" role="img" aria-label="vector space diagram">
                {scene < 3 && (
                  <>
                    {scene >= 1 &&
                      CLUSTERS.map((c, clusterIndex) => (
                        <circle
                          key={`ring-${clusterIndex}`}
                          cx={c.cx}
                          cy={c.cy}
                          r={30}
                          className={
                            scene === 2 && !SELECTED_CLUSTERS.includes(clusterIndex)
                              ? "fill-none stroke-border"
                              : "fill-none stroke-muted-foreground"
                          }
                          strokeWidth={1}
                          strokeDasharray="3 3"
                        />
                      ))}
                    {scene === 0 &&
                      ALL_POINTS.map((p) => (
                        <line
                          key={`q-${p.id}`}
                          x1={QUERY.x}
                          y1={QUERY.y}
                          x2={p.x}
                          y2={p.y}
                          className="stroke-amber-600/40"
                          strokeWidth={1}
                        />
                      ))}
                    {scene === 2 &&
                      SELECTED_CLUSTERS.map((clusterIndex) => (
                        <line
                          key={`q-c-${clusterIndex}`}
                          x1={QUERY.x}
                          y1={QUERY.y}
                          x2={CLUSTERS[clusterIndex].cx}
                          y2={CLUSTERS[clusterIndex].cy}
                          className="stroke-primary/50"
                          strokeWidth={1}
                        />
                      ))}
                    {CLUSTERS.map((c, clusterIndex) => (
                      <g key={`centroid-${clusterIndex}`}>
                        {scene >= 1 && (
                          <rect
                            x={c.cx - 4}
                            y={c.cy - 4}
                            width={8}
                            height={8}
                            transform={`rotate(45 ${c.cx} ${c.cy})`}
                            className={
                              scene === 2 && SELECTED_CLUSTERS.includes(clusterIndex)
                                ? "fill-primary/40 stroke-primary"
                                : "fill-background stroke-muted-foreground"
                            }
                            strokeWidth={1}
                          />
                        )}
                        {pointsForCluster(clusterIndex).map((p) => (
                          <circle
                            key={p.id}
                            cx={p.x}
                            cy={p.y}
                            r={5}
                            className={pointClass(pointState(scene, clusterIndex))}
                            strokeWidth={1}
                          />
                        ))}
                      </g>
                    ))}
                    <path
                      d={`M${QUERY.x - 7},${QUERY.y} L${QUERY.x},${QUERY.y - 8} L${QUERY.x + 7},${QUERY.y} L${QUERY.x},${QUERY.y + 8} Z`}
                      className="fill-foreground/80 stroke-foreground"
                      strokeWidth={1}
                    />
                    <text x={QUERY.x} y={QUERY.y + 20} textAnchor="middle" className="fill-muted-foreground text-[8px]">
                      query
                    </text>
                  </>
                )}

                {scene === 3 && (
                  <>
                    <text x={16} y={40} className="fill-muted-foreground text-[9px] font-bold">
                      raw vector (768개 float32)
                    </text>
                    {Array.from({ length: 8 }).map((_, i) => (
                      <rect
                        key={`raw-${i}`}
                        x={16 + i * 58}
                        y={52}
                        width={52}
                        height={34}
                        className="fill-muted stroke-border"
                        strokeWidth={1}
                      />
                    ))}
                    {Array.from({ length: 8 }).map((_, i) => (
                      <text key={`raw-label-${i}`} x={16 + i * 58 + 26} y={73} textAnchor="middle" className="fill-foreground text-[8px]">
                        96f · 384B
                      </text>
                    ))}
                    <text x={16} y={104} className="fill-muted-foreground text-[9px]">
                      합계 3,072B
                    </text>

                    <text x={250} y={130} textAnchor="middle" className="fill-muted-foreground text-[14px]">
                      ↓ encode
                    </text>

                    <text x={16} y={162} className="fill-muted-foreground text-[9px] font-bold">
                      PQ code (subvector 8개 · centroid id)
                    </text>
                    {[214, 71, 8, 199, 33, 250, 5, 122].map((code, i) => (
                      <g key={`code-${i}`}>
                        <rect
                          x={16 + i * 58}
                          y={174}
                          width={52}
                          height={34}
                          className="fill-primary/15 stroke-primary"
                          strokeWidth={1}
                        />
                        <text x={16 + i * 58 + 26} y={195} textAnchor="middle" className="fill-foreground text-[9px] font-bold">
                          {code}
                        </text>
                      </g>
                    ))}
                    <text x={16} y={226} className="fill-muted-foreground text-[9px]">
                      합계 8B (1byte × 8)
                    </text>
                  </>
                )}
              </svg>
            </div>

            <div className="flex min-h-[9rem] flex-col justify-between border border-border p-3 font-mono text-[11px]">
              <div>
                <p className="font-bold text-muted-foreground">비교/저장</p>
                <p className="mt-1 text-primary">{HIT_LABEL[scene]}</p>
              </div>
              <div>
                <p className="font-bold text-muted-foreground">파라미터</p>
                <p className="mt-1">{SUB_LABEL[scene]}</p>
              </div>
              <div className="flex flex-col gap-1 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1"><span className="inline-block h-2 w-3 border border-amber-600 bg-amber-500/30" /> 비교 대상</span>
                <span className="flex items-center gap-1"><span className="inline-block h-2 w-3 border border-primary bg-primary/25" /> 선택된 cluster</span>
                <span className="flex items-center gap-1"><span className="inline-block h-2 w-3 border border-border bg-muted/40" /> 탐색 안 함</span>
              </div>
            </div>
          </div>

          <p className="mt-4 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {NOTES[scene]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}

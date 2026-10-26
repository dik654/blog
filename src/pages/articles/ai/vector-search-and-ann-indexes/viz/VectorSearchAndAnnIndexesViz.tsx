import { motion } from "framer-motion";
import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = [
  "같은 좌표",
  "모두 비교",
  "구역 선택",
  "짧은 코드",
  "결과 반환",
] as const;

const NOTES = [
  "검색어 q-17과 문서 100만 개를 같은 임베딩 모델로 768차원 좌표에 놓습니다. 서로 다른 모델을 쓰면 좌표계가 달라 거리를 비교할 수 없습니다.",
  "정확 검색은 q-17을 문서 벡터 100만 개와 모두 비교합니다. 선택한 거리 기준에서는 가장 가까운 문서를 놓치지 않지만, 매 요청의 비교량이 큽니다.",
  "IVF는 1,000개 구역의 중심부터 비교하고 가까운 10개 구역만 엽니다. 평균을 가정하면 전체 비교는 11,000회로 줄지만, 열지 않은 구역의 정답은 놓칠 수 있습니다.",
  "PQ는 768차원 벡터를 96차원 조각 8개로 나누고 각 조각을 1바이트 중심 번호로 바꿉니다. 벡터 하나가 3,072바이트에서 8바이트가 되지만 거리는 근삿값이 됩니다.",
  "선택된 후보 안에서 doc-104가 가장 가까워 top-k에 들어갑니다. 이 결과는 IVF가 doc-104의 구역을 열었고 PQ 근사 순위가 뒤집히지 않았을 때만 성립합니다.",
] as const;

const QUERY = { x: 458, y: 44 };
const CLUSTERS = [
  { cx: 75, cy: 63 },
  { cx: 201, cy: 58 },
  { cx: 333, cy: 76 },
  { cx: 94, cy: 181 },
  { cx: 234, cy: 178 },
  { cx: 365, cy: 164 },
] as const;
const SELECTED = [1, 4] as const;
const OFFSETS = [
  [-18, -9],
  [14, -4],
  [-7, 17],
] as const;

function VectorSpace({ scene, reducedMotion }: { scene: number; reducedMotion: boolean }) {
  const showQuery = scene <= 2;
  const showClusters = scene >= 2;

  return (
    <svg viewBox="0 0 520 250" className="h-auto w-full" role="img" aria-label={SCENES[scene]}>
      <defs>
        <marker id="vector-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0 0 8 4 0 8Z" className="fill-primary" />
        </marker>
      </defs>

      {scene === 0 && (
        <>
          <text x="18" y="28" className="fill-muted-foreground text-[10px] font-bold">같은 임베딩 모델</text>
          <rect x="18" y="42" width="118" height="54" className="fill-background stroke-border" />
          <text x="77" y="64" textAnchor="middle" className="fill-foreground text-[10px] font-bold">q-17</text>
          <text x="77" y="81" textAnchor="middle" className="fill-muted-foreground text-[9px]">배터리 충전 오류</text>
          <rect x="18" y="142" width="118" height="54" className="fill-background stroke-border" />
          <text x="77" y="164" textAnchor="middle" className="fill-foreground text-[10px] font-bold">문서 100만 개</text>
          <text x="77" y="181" textAnchor="middle" className="fill-muted-foreground text-[9px]">doc-104 포함</text>
          <rect x="194" y="76" width="130" height="84" className="fill-primary/5 stroke-primary" />
          <text x="259" y="109" textAnchor="middle" className="fill-foreground text-[10px] font-bold">Encoder v3</text>
          <text x="259" y="128" textAnchor="middle" className="fill-muted-foreground text-[9px]">같은 가중치 · 같은 전처리</text>
          <text x="259" y="144" textAnchor="middle" className="fill-muted-foreground text-[9px]">출력 d = 768</text>
          <path d="M136 69H187" className="stroke-primary" markerEnd="url(#vector-arrow)" />
          <path d="M136 169H164Q178 169 178 150V126Q178 119 187 119" className="fill-none stroke-primary" markerEnd="url(#vector-arrow)" />
          <path d="M324 118H382" className="stroke-primary" markerEnd="url(#vector-arrow)" />
          <rect x="390" y="75" width="112" height="86" className="fill-background stroke-border" />
          <text x="446" y="104" textAnchor="middle" className="fill-foreground text-[10px] font-bold">한 좌표계</text>
          <text x="446" y="124" textAnchor="middle" className="fill-primary text-[10px] font-bold">q ∈ R⁷⁶⁸</text>
          <text x="446" y="143" textAnchor="middle" className="fill-primary text-[10px] font-bold">dᵢ ∈ R⁷⁶⁸</text>
        </>
      )}

      {(scene === 1 || scene === 2) && (
        <>
          {CLUSTERS.map((cluster, clusterIndex) => {
            const selected = clusterIndex === 1 || clusterIndex === 4;
            return (
              <g key={`cluster-${clusterIndex}`}>
                {showClusters && (
                  <circle cx={cluster.cx} cy={cluster.cy} r="32" className={selected ? "fill-primary/5 stroke-primary/70" : "fill-transparent stroke-border"} strokeDasharray="4 4" />
                )}
                {showClusters && (
                  <rect x={cluster.cx - 4} y={cluster.cy - 4} width="8" height="8" transform={`rotate(45 ${cluster.cx} ${cluster.cy})`} className={selected ? "fill-primary stroke-primary" : "fill-background stroke-muted-foreground"} />
                )}
                {OFFSETS.map(([dx, dy], pointIndex) => {
                  const isAnswer = clusterIndex === 4 && pointIndex === 1;
                  const compared = scene === 1 || selected;
                  const x = cluster.cx + dx;
                  const y = cluster.cy + dy;
                  return (
                    <g key={`${clusterIndex}-${pointIndex}`}>
                      {scene === 1 && (
                        <motion.line
                          initial={reducedMotion ? false : { pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: 1, opacity: 0.35 }}
                          transition={{ duration: 0.65, delay: pointIndex * 0.08 }}
                          x1={QUERY.x} y1={QUERY.y} x2={x} y2={y}
                          className="stroke-amber-600"
                        />
                      )}
                      <circle cx={x} cy={y} r={isAnswer ? 6.5 : 5} className={isAnswer && compared ? "fill-emerald-500/30 stroke-emerald-600" : compared ? "fill-amber-500/20 stroke-amber-600" : "fill-muted stroke-border"} />
                      {isAnswer && compared && <text x={x + 10} y={y + 3} className="fill-foreground text-[8px] font-bold">doc-104</text>}
                    </g>
                  );
                })}
              </g>
            );
          })}
          {scene === 2 && SELECTED.map((clusterIndex) => (
            <motion.path
              key={clusterIndex}
              initial={reducedMotion ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.9 }}
              d={`M${QUERY.x} ${QUERY.y}L${CLUSTERS[clusterIndex].cx} ${CLUSTERS[clusterIndex].cy}`}
              className="stroke-primary" fill="none" markerEnd="url(#vector-arrow)"
            />
          ))}
          {showQuery && (
            <g>
              <path d={`M${QUERY.x - 8} ${QUERY.y}L${QUERY.x} ${QUERY.y - 9}L${QUERY.x + 8} ${QUERY.y}L${QUERY.x} ${QUERY.y + 9}Z`} className="fill-foreground stroke-foreground" />
              <text x={QUERY.x} y={QUERY.y + 24} textAnchor="middle" className="fill-foreground text-[9px] font-bold">q-17</text>
            </g>
          )}
          <text x="18" y="235" className="fill-muted-foreground text-[9px]">{scene === 1 ? "100만 개를 모두 비교하는 전수 검색" : "6개 구역 중 2개만 표시 · 실제 계산은 1,000개 중 10개"}</text>
        </>
      )}

      {scene === 3 && (
        <>
          <text x="18" y="28" className="fill-muted-foreground text-[10px] font-bold">doc-104 원본 벡터 · 768 × float32</text>
          {Array.from({ length: 8 }).map((_, index) => (
            <g key={`raw-${index}`}>
              <rect x={18 + index * 61} y="45" width="53" height="50" className="fill-muted/50 stroke-border" />
              <text x={44.5 + index * 61} y="66" textAnchor="middle" className="fill-foreground text-[8px] font-bold">96차원</text>
              <text x={44.5 + index * 61} y="82" textAnchor="middle" className="fill-muted-foreground text-[8px]">384B</text>
            </g>
          ))}
          <path d="M259 106V136" className="stroke-primary" markerEnd="url(#vector-arrow)" />
          <text x="282" y="126" className="fill-primary text-[9px] font-bold">각 조각 → 가장 가까운 중심 번호</text>
          {[214, 71, 8, 199, 33, 250, 5, 122].map((code, index) => (
            <motion.g key={code} initial={reducedMotion ? false : { opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: index * 0.08 }}>
              <rect x={18 + index * 61} y="151" width="53" height="45" className="fill-primary/10 stroke-primary" />
              <text x={44.5 + index * 61} y="170" textAnchor="middle" className="fill-foreground text-[9px] font-bold">{code}</text>
              <text x={44.5 + index * 61} y="186" textAnchor="middle" className="fill-muted-foreground text-[8px]">1B</text>
            </motion.g>
          ))}
          <text x="18" y="226" className="fill-foreground text-[10px] font-bold">3,072B → 8B · 원본 대비 384분의 1</text>
        </>
      )}

      {scene === 4 && (
        <>
          <text x="18" y="28" className="fill-muted-foreground text-[10px] font-bold">선택한 구역 안 후보를 근사 거리로 정렬</text>
          {[["doc-104", "0.08", "1"], ["doc-882", "0.13", "2"], ["doc-031", "0.21", "3"]].map(([id, distance, rank], index) => (
            <motion.g key={id} initial={reducedMotion ? false : { x: -22, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.45, delay: index * 0.18 }}>
              <rect x="30" y={50 + index * 47} width="310" height="34" className={index === 0 ? "fill-emerald-500/10 stroke-emerald-600" : "fill-background stroke-border"} />
              <text x="48" y={72 + index * 47} className="fill-foreground text-[10px] font-bold">{rank}위 · {id}</text>
              <text x="318" y={72 + index * 47} textAnchor="end" className="fill-muted-foreground text-[9px]">근사 거리 {distance}</text>
            </motion.g>
          ))}
          <path d="M349 117H395" className="stroke-primary" markerEnd="url(#vector-arrow)" />
          <rect x="403" y="76" width="101" height="82" className="fill-primary/5 stroke-primary" />
          <text x="453.5" y="102" textAnchor="middle" className="fill-primary text-[9px] font-bold">top-k</text>
          <text x="453.5" y="123" textAnchor="middle" className="fill-foreground text-[10px] font-bold">doc-104</text>
          <text x="453.5" y="141" textAnchor="middle" className="fill-muted-foreground text-[8px]">사용자에게 반환</text>
          <rect x="30" y="207" width="474" height="27" className="fill-amber-500/5 stroke-amber-600/50" />
          <text x="267" y="225" textAnchor="middle" className="fill-amber-700 text-[9px] font-bold dark:fill-amber-400">닫힌 구역의 정답과 PQ가 뒤집은 순위는 복구할 수 없습니다.</text>
        </>
      )}
    </svg>
  );
}

const METRICS = [
  { id: "doc-A", value: "(0.6, 0.8)", norm: "1", dot: "0.6", cosine: "0.6", distance: "0.8" },
  { id: "doc-B", value: "(1.2, 1.6)", norm: "2", dot: "1.2", cosine: "0.6", distance: "3.4" },
] as const;

export function VectorMetricEquivalenceViz() {
  return (
    <VizFrame
      eyebrow="거리 기준"
      title="방향이 같아도 정규화하지 않으면 내적 순위는 길이에 끌립니다"
      description="q=(1, 0)에서 doc-A와 doc-B는 같은 방향입니다. 표의 값을 먼저 비교한 뒤 정규화했을 때 무엇이 같아지는지 확인하세요."
      note="이 수치는 설명용 계산입니다. 실제 임베딩 품질이나 검색 성능 측정치가 아닙니다."
    >
      <div data-viz-canvas className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(18rem,.95fr)] lg:items-center">
        <svg viewBox="0 0 360 250" className="h-auto w-full" role="img" aria-label="같은 방향이지만 길이가 다른 두 문서 벡터">
          <defs>
            <marker id="metric-arrow-a" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0 8 4 0 8Z" className="fill-primary" /></marker>
            <marker id="metric-arrow-b" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0 8 4 0 8Z" className="fill-amber-600" /></marker>
          </defs>
          <path d="M52 205H330M52 205V24" className="stroke-border" />
          <path d="M52 205L192 205" className="stroke-foreground" strokeWidth="1.2" markerEnd="url(#metric-arrow-a)" />
          <text x="177" y="226" className="fill-foreground text-[10px] font-bold">q=(1,0)</text>
          <path d="M52 205L132 99" className="stroke-primary" strokeWidth="1.2" markerEnd="url(#metric-arrow-a)" />
          <text x="105" y="91" className="fill-primary text-[10px] font-bold">doc-A</text>
          <path d="M52 205L212 0" className="stroke-amber-600" strokeWidth="1.2" markerEnd="url(#metric-arrow-b)" />
          <text x="218" y="20" className="fill-amber-700 text-[10px] font-bold dark:fill-amber-400">doc-B</text>
          <path d="M52 205A38 38 0 0 0 76 175" className="fill-none stroke-muted-foreground" strokeDasharray="3 3" />
          <text x="79" y="185" className="fill-muted-foreground text-[9px]">같은 각도</text>
        </svg>
        <div className="min-w-0 overflow-x-auto">
          <table className="w-full min-w-[19rem] border-collapse text-left text-xs">
            <thead className="text-muted-foreground"><tr className="border-b border-border"><th className="py-2 pr-3">문서</th><th className="px-2">‖d‖</th><th className="px-2">q·d</th><th className="px-2">cos</th><th className="pl-2">L2²</th></tr></thead>
            <tbody>
              {METRICS.map((metric) => (
                <tr key={metric.id} className="border-b border-border/70">
                  <th className="py-3 pr-3"><span className="block font-bold">{metric.id}</span><span className="font-mono text-[10px] text-muted-foreground">{metric.value}</span></th>
                  <td className="px-2 tabular-nums">{metric.norm}</td><td className="px-2 font-bold tabular-nums">{metric.dot}</td><td className="px-2 font-bold tabular-nums text-primary">{metric.cosine}</td><td className="pl-2 tabular-nums">{metric.distance}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-4 border-l-2 border-primary pl-3 text-sm leading-6">내적은 더 긴 doc-B를 1등으로 두지만 코사인은 두 문서를 동률로 봅니다. 두 문서를 길이 1로 정규화하면 내적도 둘 다 0.6이 됩니다.</p>
        </div>
      </div>
    </VizFrame>
  );
}

export default function VectorSearchAndAnnIndexesViz() {
  const scenes = useAnimatedScenes(SCENES.length, 6500, { loop: false, autoPlay: false });
  const scene = scenes.active;

  if (scenes.reducedMotion) {
    return (
      <VizFrame eyebrow="q-17 검색 추적" title="한 검색어가 100만 개 문서에서 doc-104를 찾기까지" description="같은 좌표를 만들고, 비교 범위를 줄이고, 벡터를 압축한 뒤 결과를 반환하는 다섯 단계를 순서대로 읽습니다.">
        <StaticSceneList labels={SCENES} notes={NOTES} />
      </VizFrame>
    );
  }

  return (
    <VizFrame
      eyebrow="q-17 검색 추적"
      title="한 검색어가 100만 개 문서에서 doc-104를 찾기까지"
      description="아래 숫자는 동작을 설명하기 위한 가정입니다. 장면을 직접 넘기거나 재생해 같은 요청 하나를 끝까지 따라가세요."
      note="가정: d=768 · 문서 1,000,000개 · IVF nlist=1,000 · nprobe=10 · PQ m=8 · k=256"
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="q-17 벡터 검색의 다섯 단계"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-[32rem] min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div data-viz-live-only className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[minmax(0,1fr)_14rem] lg:items-center">
          <div className="min-w-0 border-y border-border py-3"><VectorSpace scene={scene} reducedMotion={scenes.reducedMotion} /></div>
          <div className="min-w-0 border-l-2 border-primary/50 pl-4">
            <p className="font-mono text-[10px] font-bold text-primary">{String(scene + 1).padStart(2, "0")} / {SCENES.length}</p>
            <h4 className="mt-2 break-keep text-lg font-black">{SCENES[scene]}</h4>
            <p className="mt-3 break-keep text-sm leading-7 text-muted-foreground">{NOTES[scene]}</p>
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} controlLabels={SCENES} />
        <StaticSceneList labels={SCENES} notes={NOTES} />
      </div>
    </VizFrame>
  );
}

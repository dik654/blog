import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 mechanism: 문장에서 뽑은 raw mention 이 schema 매핑으로 관계를 얻고, dedup 으로
 * 같은 entity 를 가리키는 mention 이 하나로 합쳐진 뒤, property graph 로 삽입되는 과정.
 * 장면 = pipeline 의 한 단계가 그래프 모양을 바꾼 순간. Stage 높이는 고정.
 */
const SCENES = [
  "추출 · raw mention 7개",
  "Schema 매핑 · triple 4개",
  "Dedup · 마리 퀴리 mention 병합",
  "삽입 완료 · node 5 · edge 4",
] as const;

const NOTES = [
  "세 문장(+한 문장)에서 NER 이 mention 7개를 찾습니다. \"마리 퀴리\"·\"그녀\"·\"M. 퀴리\"가 아직 서로 다른 mention 으로 남아 있습니다.",
  "Schema(Person·Place·Award·Institution, bornIn·wonAward·succeededAt)에 맞춰 4개 edge 가 생깁니다. Edge 는 아직 raw mention 을 그대로 잇고 있어 \"그녀\"가 두 edge 의 끝점입니다.",
  "Mention embedding 의 cosine 유사도가 threshold 를 넘는 \"마리 퀴리\"·\"그녀\"·\"M. 퀴리\"가 하나의 node 로 합쳐집니다. \"피에르 퀴리\"는 성이 같아도 유사도가 낮아 별도 node 로 남습니다.",
  "병합된 node 를 기준으로 property graph 에 5 node · 4 edge 가 삽입됩니다. 각 edge 는 자신의 property(연도)를 그대로 갖고 있습니다.",
] as const;

type NodeKind = "raw" | "merging" | "entity" | "support";

type GNode = {
  id: string;
  x: number;
  y: number;
  label: string;
  kind: NodeKind;
};

type GEdge = {
  from: string;
  to: string;
  label: string;
};

type Scene = {
  nodes: readonly GNode[];
  edges: readonly GEdge[];
  count: string;
};

const STATES: readonly Scene[] = [
  {
    nodes: [
      { id: "mc", x: 90, y: 55, label: "마리 퀴리", kind: "raw" },
      { id: "she", x: 90, y: 195, label: "그녀", kind: "raw" },
      { id: "mcurie", x: 250, y: 25, label: "M. 퀴리", kind: "raw" },
      { id: "pc", x: 430, y: 55, label: "피에르 퀴리", kind: "support" },
      { id: "w", x: 250, y: 100, label: "바르샤바", kind: "support" },
      { id: "np", x: 430, y: 195, label: "노벨 물리학상", kind: "support" },
      { id: "up", x: 250, y: 225, label: "파리 대학", kind: "support" },
    ],
    edges: [],
    count: "mention 7 · edge 0",
  },
  {
    nodes: [
      { id: "mc", x: 90, y: 55, label: "마리 퀴리", kind: "raw" },
      { id: "she", x: 90, y: 195, label: "그녀", kind: "raw" },
      { id: "mcurie", x: 250, y: 25, label: "M. 퀴리", kind: "raw" },
      { id: "pc", x: 430, y: 55, label: "피에르 퀴리", kind: "support" },
      { id: "w", x: 250, y: 100, label: "바르샤바", kind: "support" },
      { id: "np", x: 430, y: 195, label: "노벨 물리학상", kind: "support" },
      { id: "up", x: 250, y: 225, label: "파리 대학", kind: "support" },
    ],
    edges: [
      { from: "mc", to: "w", label: "bornIn · 1867" },
      { from: "mc", to: "np", label: "wonAward · 1903" },
      { from: "pc", to: "np", label: "wonAward · 1903" },
      { from: "she", to: "up", label: "succeededAt · 1906" },
    ],
    count: "mention 7 · edge 4",
  },
  {
    nodes: [
      { id: "mc", x: 150, y: 125, label: "마리 퀴리", kind: "merging" },
      { id: "she", x: 150, y: 125, label: "그녀", kind: "merging" },
      { id: "mcurie", x: 150, y: 125, label: "M. 퀴리", kind: "merging" },
      { id: "pc", x: 430, y: 55, label: "피에르 퀴리", kind: "support" },
      { id: "w", x: 60, y: 60, label: "바르샤바", kind: "support" },
      { id: "np", x: 430, y: 195, label: "노벨 물리학상", kind: "support" },
      { id: "up", x: 150, y: 225, label: "파리 대학", kind: "support" },
    ],
    edges: [
      { from: "mc", to: "w", label: "bornIn" },
      { from: "mc", to: "np", label: "wonAward" },
      { from: "pc", to: "np", label: "wonAward" },
      { from: "she", to: "up", label: "succeededAt" },
    ],
    count: "cluster 1개로 병합 중 · node 5",
  },
  {
    nodes: [
      { id: "mc", x: 150, y: 125, label: "Marie Curie", kind: "entity" },
      { id: "pc", x: 430, y: 60, label: "Pierre Curie", kind: "support" },
      { id: "w", x: 60, y: 60, label: "Warsaw", kind: "support" },
      { id: "np", x: 430, y: 195, label: "Nobel Prize", kind: "support" },
      { id: "up", x: 150, y: 225, label: "Univ. of Paris", kind: "support" },
    ],
    edges: [
      { from: "mc", to: "w", label: "bornIn · 1867" },
      { from: "mc", to: "np", label: "wonAward · 1903" },
      { from: "pc", to: "np", label: "wonAward · 1903" },
      { from: "mc", to: "up", label: "succeededAt · 1906" },
    ],
    count: "node 5 · edge 4 · 완성",
  },
];

const NODE_W = 92;
const NODE_H = 30;

function nodeClass(kind: NodeKind) {
  switch (kind) {
    case "raw":
      return "fill-amber-500/20 stroke-amber-600";
    case "merging":
      return "fill-amber-500/10 stroke-amber-600";
    case "entity":
      return "fill-primary/20 stroke-primary";
    default:
      return "fill-muted stroke-border";
  }
}

export default function KnowledgeGraphConstructionViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3000);
  const state = STATES[scenes.active];
  const byId = new Map(state.nodes.map((node) => [node.id, node] as const));

  return (
    <VizFrame
      eyebrow="Graph construction pipeline"
      title="Raw mention 이 schema 매핑과 dedup 을 거쳐 property graph 로 조립됩니다"
      description="노란 node 는 아직 합쳐지지 않은 raw mention, 회색은 지원 entity(장소·상·기관), 파란 node 는 dedup 으로 확정된 entity 입니다. Edge label 은 schema relation 과, 삽입이 끝나면 그 property(연도)를 보여 줍니다."
      note="문장은 본문의 마리 퀴리 예(3문장 + M. 퀴리가 나오는 네 번째 문장)이며 좌표는 그래프 모양을 보이기 위한 배치일 뿐 실제 layout 알고리즘이 아닙니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="문장에서 property graph 로 조립되는 과정"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(34rem,calc(100dvh-15rem))] min-h-[27rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(scenes.active + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scenes.active]}</h4>

          <div className="mt-4 grid gap-4 sm:grid-cols-[minmax(0,3fr)_minmax(0,1fr)]">
            <div className="min-w-0 overflow-x-auto border border-border">
              <svg viewBox="0 0 520 260" className="h-[16rem] w-full min-w-[26rem]" role="img" aria-label="entity-relation graph">
                {state.edges.map((edge, index) => {
                  const a = byId.get(edge.from);
                  const b = byId.get(edge.to);
                  if (!a || !b) return null;
                  const midX = (a.x + b.x) / 2;
                  const midY = (a.y + b.y) / 2;
                  return (
                    <g key={`${edge.from}-${edge.to}-${index}`}>
                      <line
                        x1={a.x}
                        y1={a.y}
                        x2={b.x}
                        y2={b.y}
                        className="stroke-muted-foreground"
                        strokeWidth={1}
                      />
                      <text
                        x={midX}
                        y={midY - 4}
                        textAnchor="middle"
                        className="fill-muted-foreground text-[8px]"
                      >
                        {edge.label}
                      </text>
                    </g>
                  );
                })}
                {state.nodes.map((node) => (
                  <g key={node.id}>
                    <rect
                      x={node.x - NODE_W / 2}
                      y={node.y - NODE_H / 2}
                      width={NODE_W}
                      height={NODE_H}
                      className={nodeClass(node.kind)}
                      strokeWidth={1}
                      strokeDasharray={node.kind === "merging" ? "3 3" : undefined}
                    />
                    <text
                      x={node.x}
                      y={node.y + 3}
                      textAnchor="middle"
                      className="fill-foreground text-[9px] font-bold"
                    >
                      {node.label}
                    </text>
                  </g>
                ))}
              </svg>
            </div>

            <div className="flex min-h-[9rem] flex-col justify-between border border-border p-3 font-mono text-[11px]">
              <div>
                <p className="font-bold text-muted-foreground">graph</p>
                <p className="mt-1 text-primary">{state.count}</p>
              </div>
              <div className="flex flex-col gap-1 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1"><span className="inline-block h-2 w-3 border border-amber-600 bg-amber-500/20" /> raw mention</span>
                <span className="flex items-center gap-1"><span className="inline-block h-2 w-3 border border-border bg-muted" /> 지원 entity</span>
                <span className="flex items-center gap-1"><span className="inline-block h-2 w-3 border border-primary bg-primary/20" /> dedup 확정 entity</span>
              </div>
            </div>
          </div>

          <p className="mt-4 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {NOTES[scenes.active]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}

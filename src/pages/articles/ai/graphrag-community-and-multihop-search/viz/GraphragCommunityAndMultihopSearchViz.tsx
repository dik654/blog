import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 mechanism: 같은 그래프가 community detection 으로 두 묶음으로 나뉘고, 그 위에서
 * local search(hop 제한 traversal)와 global search(모든 community summary 를 읽음)가
 * 서로 다른 범위를 방문하는 과정. 장면 = 탐색 방식이 그래프를 보는 방식의 차이.
 */
const SCENES = [
  "분할 전 · node 7 · edge 6",
  "Community detection · 2개로 분할",
  "Local search · 2-hop 만 방문",
  "Global search · summary 2개 모두 읽음",
] as const;

const NOTES = [
  "마리 퀴리 쪽 5 node 가 edge 4개로 조밀하고, 베크렐 쪽 2 node 는 edge 1개, 노벨 물리학상을 통한 다리 edge 1개로 성기게 이어져 있습니다.",
  "Leiden 알고리즘은 조밀한 쪽을 community A(파랑), 성긴 쪽을 community B(주황)로 나눕니다. 다리 edge 는 두 community 를 잇는 약한 연결로 점선입니다.",
  "\"마리 퀴리가 받은 상을 누가 또 받았나\"는 마리 퀴리에서 2-hop 만 걸어 노벨 물리학상을 거쳐 베크렐에 닿습니다. 바르샤바·피에르 퀴리·파리 대학·에콜 폴리테크닉은 이번 질문에 방문하지 않습니다.",
  "\"이 그래프의 주제가 몇 개인가\"는 한 entity 에서 시작할 수 없어 community summary(퀴리 요약·베크렐 요약) 둘 다 읽습니다. 원본 node·edge 는 다시 읽지 않고 미리 만든 요약만 봅니다.",
] as const;

type NodeState = "neutral" | "communityA" | "communityB" | "start" | "path" | "skip";

type GNode = {
  id: string;
  x: number;
  y: number;
  label: string;
  state: NodeState;
};

type EdgeState = "normal" | "bridge" | "path" | "dim";

type GEdge = {
  from: string;
  to: string;
  state: EdgeState;
};

const POS = {
  mc: { x: 140, y: 60 },
  pc: { x: 320, y: 30 },
  w: { x: 55, y: 105 },
  np: { x: 240, y: 130 },
  up: { x: 140, y: 190 },
  hb: { x: 420, y: 130 },
  ep: { x: 420, y: 205 },
} as const;

const LABELS: Record<keyof typeof POS, string> = {
  mc: "마리 퀴리",
  pc: "피에르 퀴리",
  w: "바르샤바",
  np: "노벨 물리학상",
  up: "파리 대학",
  hb: "앙리 베크렐",
  ep: "에콜 폴리테크닉",
};

const EDGE_PAIRS: readonly (readonly [keyof typeof POS, keyof typeof POS])[] = [
  ["mc", "w"],
  ["mc", "np"],
  ["pc", "np"],
  ["mc", "up"],
  ["hb", "ep"],
  ["hb", "np"],
];

function buildNodes(stateOf: (id: keyof typeof POS) => NodeState): GNode[] {
  return (Object.keys(POS) as (keyof typeof POS)[]).map((id) => ({
    id,
    x: POS[id].x,
    y: POS[id].y,
    label: LABELS[id],
    state: stateOf(id),
  }));
}

function buildEdges(stateOf: (from: string, to: string) => EdgeState): GEdge[] {
  return EDGE_PAIRS.map(([from, to]) => ({ from, to, state: stateOf(from, to) }));
}

type Scene = { nodes: readonly GNode[]; edges: readonly GEdge[]; summary: string };

const COMMUNITY_A = new Set(["mc", "pc", "w", "np", "up"]);

const STATES: readonly Scene[] = [
  {
    nodes: buildNodes(() => "neutral"),
    edges: buildEdges((from, to) => (from === "hb" && to === "np" ? "bridge" : "normal")),
    summary: "node 7 · edge 6 · community 없음",
  },
  {
    nodes: buildNodes((id) => (COMMUNITY_A.has(id) ? "communityA" : "communityB")),
    edges: buildEdges((from, to) => (from === "hb" && to === "np" ? "bridge" : "normal")),
    summary: "community A(5) · community B(2) · Q≈0.208",
  },
  {
    nodes: buildNodes((id) => {
      if (id === "mc") return "start";
      if (id === "np" || id === "hb") return "path";
      return "skip";
    }),
    edges: buildEdges((from, to) => {
      if ((from === "mc" && to === "np") || (from === "hb" && to === "np")) return "path";
      return "dim";
    }),
    summary: "방문 node 3 · 방문 edge 2 · hop 예산 2",
  },
  {
    nodes: buildNodes(() => "path"),
    edges: buildEdges((from, to) => (from === "hb" && to === "np" ? "bridge" : "normal")),
    summary: "summary 2개 read · 원본 node 재방문 없음",
  },
];

function nodeClass(state: NodeState) {
  switch (state) {
    case "communityA":
      return "fill-primary/20 stroke-primary";
    case "communityB":
      return "fill-amber-500/20 stroke-amber-600";
    case "start":
      return "fill-primary/30 stroke-primary";
    case "path":
      return "fill-primary/15 stroke-primary";
    case "skip":
      return "fill-transparent stroke-border";
    default:
      return "fill-muted stroke-border";
  }
}

function edgeClass(state: EdgeState) {
  switch (state) {
    case "bridge":
      return "stroke-amber-600";
    case "path":
      return "stroke-primary";
    case "dim":
      return "stroke-border";
    default:
      return "stroke-muted-foreground";
  }
}

export default function GraphragCommunityAndMultihopSearchViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3200);
  const state = STATES[scenes.active];
  const byId = new Map(state.nodes.map((node) => [node.id, node] as const));

  return (
    <VizFrame
      eyebrow="Community · local/global search"
      title="같은 그래프를 community detection·local search·global search 가 다르게 봅니다"
      description="파랑은 조밀한 community A(퀴리), 주황은 성긴 community B(베크렐)입니다. Local search 장면은 방문한 경로만 진하게, 건너뛴 node 는 테두리만 남깁니다. Global search 장면은 원본이 아니라 community summary 를 읽는다는 뜻으로 모든 node 를 옅게 표시합니다."
      note="그래프는 본문 예(node 7·edge 6)이며 modularity Q 값은 ExplainedFormula 의 계산과 같습니다. 좌표는 배치일 뿐 실제 layout 알고리즘이 아닙니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="Community detection 과 local·global search 의 탐색 범위 차이"
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
              <svg viewBox="0 0 480 240" className="h-[16rem] w-full min-w-[26rem]" role="img" aria-label="community graph">
                {state.edges.map((edge, index) => {
                  const a = byId.get(edge.from);
                  const b = byId.get(edge.to);
                  if (!a || !b) return null;
                  return (
                    <line
                      key={`${edge.from}-${edge.to}-${index}`}
                      x1={a.x}
                      y1={a.y}
                      x2={b.x}
                      y2={b.y}
                      className={edgeClass(edge.state)}
                      strokeWidth={edge.state === "path" ? 1.25 : 1}
                      strokeDasharray={edge.state === "bridge" ? "3 3" : undefined}
                    />
                  );
                })}
                {state.nodes.map((node) => (
                  <g key={node.id}>
                    <circle cx={node.x} cy={node.y} r={20} className={nodeClass(node.state)} strokeWidth={1} />
                    <text x={node.x} y={node.y + 32} textAnchor="middle" className="fill-foreground text-[8px] font-bold">
                      {node.label}
                    </text>
                  </g>
                ))}
              </svg>
            </div>

            <div className="flex min-h-[9rem] flex-col justify-between border border-border p-3 font-mono text-[11px]">
              <div>
                <p className="font-bold text-muted-foreground">state</p>
                <p className="mt-1 text-primary">{state.summary}</p>
              </div>
              <div className="flex flex-col gap-1 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1"><span className="inline-block h-3 w-3 rounded-full border border-primary bg-primary/20" /> community A / 방문·read</span>
                <span className="flex items-center gap-1"><span className="inline-block h-3 w-3 rounded-full border border-amber-600 bg-amber-500/20" /> community B</span>
                <span className="flex items-center gap-1"><span className="inline-block h-3 w-3 rounded-full border border-border bg-transparent" /> 이번 질문에 건너뜀</span>
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

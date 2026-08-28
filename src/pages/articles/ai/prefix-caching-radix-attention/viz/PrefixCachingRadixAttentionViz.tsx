import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 mechanism: radix tree 가 요청마다 자라고(match → split → insert) memory 가 모자랄 때
 * ref 0 인 leaf 부터 LRU 로 잘리는 과정. 장면 = 요청 하나가 tree 를 바꾼 순간.
 * stage 높이는 고정, control row 는 아래 고정 row. SVG viewBox 고정, label 은 짧게.
 */
const SCENES = [
  "R1 도착 · 단일 edge",
  "R2 도착 · node split",
  "R3·R4 도착 · 두 번째 split",
  "Memory 부족 · leaf 부터 evict",
] as const;

const NOTES = [
  "Tree 가 비어 있어 R1 의 2,600 token 은 통째로 miss 입니다. Root 에서 edge 하나가 자라고 R1 이 running 인 동안 ref 는 1 입니다.",
  "R2 는 2,500 token 까지 일치하고 어긋납니다. Edge 가 그 자리에서 쪼개져 공유 node(2,500) 아래 q1·q2 두 leaf 가 생기고 R2 의 hit 은 2,500 입니다.",
  "R3 은 같은 2,500 을 hit 해 leaf 만 붙습니다. R4 는 system prompt 2,000 만 같아 공유 node 가 2,000 에서 다시 쪼개지고 hit 은 2,000 입니다.",
  "250 token 을 비워야 합니다. Ref 0 인 leaf 가운데 가장 오래된 q1, 그다음 q2 가 지워집니다. R3 이 아직 running 이라 q3 과 그 조상은 ref 1 로 보호됩니다.",
] as const;

type NodeState = "new" | "cached" | "protected" | "evicted";

type TreeNode = {
  id: string;
  x: number;
  y: number;
  label: string;
  tokens: string;
  state: NodeState;
};

type Scene = {
  nodes: readonly TreeNode[];
  edges: readonly (readonly [string, string])[];
  hit: string;
  cache: string;
};

const ROOT = { x: 34, y: 128 } as const;

const STATES: readonly Scene[] = [
  {
    nodes: [{ id: "r1", x: 300, y: 128, label: "sys+few+q1", tokens: "2,600", state: "new" }],
    edges: [["root", "r1"]],
    hit: "R1 hit 0 / 2,600 (cold)",
    cache: "cache 2,600 token",
  },
  {
    nodes: [
      { id: "s", x: 200, y: 128, label: "sys+few", tokens: "2,500", state: "cached" },
      { id: "q1", x: 420, y: 80, label: "q1", tokens: "100", state: "cached" },
      { id: "q2", x: 420, y: 176, label: "q2", tokens: "100", state: "new" },
    ],
    edges: [["root", "s"], ["s", "q1"], ["s", "q2"]],
    hit: "R2 hit 2,500 / 2,600",
    cache: "cache 2,700 token",
  },
  {
    nodes: [
      { id: "sys", x: 150, y: 128, label: "sys", tokens: "2,000", state: "cached" },
      { id: "few", x: 290, y: 92, label: "few", tokens: "500", state: "cached" },
      { id: "q1", x: 440, y: 40, label: "q1", tokens: "100", state: "cached" },
      { id: "q2", x: 440, y: 92, label: "q2", tokens: "100", state: "cached" },
      { id: "q3", x: 440, y: 144, label: "q3", tokens: "100", state: "new" },
      { id: "q4", x: 290, y: 212, label: "few'+q4", tokens: "600", state: "new" },
    ],
    edges: [["root", "sys"], ["sys", "few"], ["few", "q1"], ["few", "q2"], ["few", "q3"], ["sys", "q4"]],
    hit: "R3 hit 2,500 · R4 hit 2,000",
    cache: "cache 3,400 token",
  },
  {
    nodes: [
      { id: "sys", x: 150, y: 128, label: "sys", tokens: "2,000", state: "protected" },
      { id: "few", x: 290, y: 92, label: "few", tokens: "500", state: "protected" },
      { id: "q1", x: 440, y: 40, label: "q1", tokens: "100", state: "evicted" },
      { id: "q2", x: 440, y: 92, label: "q2", tokens: "100", state: "evicted" },
      { id: "q3", x: 440, y: 144, label: "q3", tokens: "100", state: "protected" },
      { id: "q4", x: 290, y: 212, label: "few'+q4", tokens: "600", state: "cached" },
    ],
    edges: [["root", "sys"], ["sys", "few"], ["few", "q1"], ["few", "q2"], ["few", "q3"], ["sys", "q4"]],
    hit: "evict q1, q2 → 200 token 확보",
    cache: "protected: R3 경로 (ref 1)",
  },
];

const NODE_W = 76;
const NODE_H = 30;

function nodeClass(state: NodeState) {
  switch (state) {
    case "new":
      return "fill-amber-500/20 stroke-amber-600";
    case "protected":
      return "fill-primary/20 stroke-primary";
    case "evicted":
      return "fill-transparent stroke-red-600";
    default:
      return "fill-muted stroke-border";
  }
}

export default function PrefixCachingRadixAttentionViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3000);
  const state = STATES[scenes.active];
  const byId = new Map<string, { x: number; y: number }>([["root", ROOT], ...state.nodes.map((node) => [node.id, { x: node.x, y: node.y }] as const)]);

  return (
    <VizFrame
      eyebrow="RadixAttention"
      title="Radix tree 는 요청마다 갈라져 자라고 memory 가 모자라면 leaf 부터 잘립니다"
      description="각 장면은 요청 하나가 tree 를 바꾼 순간입니다. 노란 node 는 이번에 새로 계산한 부분, 회색은 cache 에 남은 부분, 파란 node 는 running 요청이 지나가 ref 가 0 이 아닌 부분, 빨간 점선은 evict 된 leaf 입니다."
      note="Page 크기는 1 token 으로 두었고 vLLM 의 16-token block 경계 손실은 본문 수식에서 다룹니다. 숫자는 본문의 예(system 2,000 · few-shot 500 · 질문 100)입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="Radix tree 가 요청마다 자라고 LRU 로 잘리는 과정"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(33rem,calc(100dvh-15rem))] min-h-[26rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(scenes.active + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scenes.active]}</h4>

          <div className="mt-4 grid gap-4 sm:grid-cols-[minmax(0,3fr)_minmax(0,1fr)]">
            <div className="min-w-0 overflow-x-auto border border-border">
              <svg viewBox="0 0 520 250" className="h-[15.5rem] w-full min-w-[26rem]" role="img" aria-label="radix tree">
                {state.edges.map(([from, to]) => {
                  const a = byId.get(from);
                  const b = byId.get(to);
                  if (!a || !b) return null;
                  const evicted = state.nodes.find((node) => node.id === to)?.state === "evicted";
                  return (
                    <line
                      key={`${from}-${to}`}
                      x1={from === "root" ? a.x + 8 : a.x + NODE_W / 2}
                      y1={a.y}
                      x2={b.x - NODE_W / 2}
                      y2={b.y}
                      className={evicted ? "stroke-red-600" : "stroke-muted-foreground"}
                      strokeWidth={1}
                      strokeDasharray={evicted ? "3 3" : undefined}
                    />
                  );
                })}
                <circle cx={ROOT.x} cy={ROOT.y} r={8} className="fill-background stroke-foreground" strokeWidth={1} />
                <text x={ROOT.x} y={ROOT.y + 22} textAnchor="middle" className="fill-muted-foreground text-[9px]">
                  root
                </text>
                {state.nodes.map((node) => (
                  <g key={node.id}>
                    <rect
                      x={node.x - NODE_W / 2}
                      y={node.y - NODE_H / 2}
                      width={NODE_W}
                      height={NODE_H}
                      className={nodeClass(node.state)}
                      strokeWidth={1}
                      strokeDasharray={node.state === "evicted" ? "3 3" : undefined}
                    />
                    <text x={node.x} y={node.y - 3} textAnchor="middle" className="fill-foreground text-[9px] font-bold">
                      {node.label}
                    </text>
                    <text x={node.x} y={node.y + 9} textAnchor="middle" className="fill-muted-foreground text-[8px]">
                      {node.state === "evicted" ? "evicted" : node.tokens}
                    </text>
                  </g>
                ))}
              </svg>
            </div>

            <div className="flex min-h-[9rem] flex-col justify-between border border-border p-3 font-mono text-[11px]">
              <div>
                <p className="font-bold text-muted-foreground">hit</p>
                <p className="mt-1 text-primary">{state.hit}</p>
              </div>
              <div>
                <p className="font-bold text-muted-foreground">memory</p>
                <p className="mt-1">{state.cache}</p>
              </div>
              <div className="flex flex-col gap-1 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1"><span className="inline-block h-2 w-3 border border-amber-600 bg-amber-500/20" /> 새로 계산</span>
                <span className="flex items-center gap-1"><span className="inline-block h-2 w-3 border border-border bg-muted" /> cached · ref 0</span>
                <span className="flex items-center gap-1"><span className="inline-block h-2 w-3 border border-primary bg-primary/20" /> running 경로 · ref 1</span>
                <span className="flex items-center gap-1"><span className="inline-block h-2 w-3 border border-dashed border-red-600" /> evicted</span>
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

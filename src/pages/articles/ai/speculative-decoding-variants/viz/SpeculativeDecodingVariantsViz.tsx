import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 mechanism: 폭 (2, 2) 인 token tree 가 tree attention mask 로 한 forward 에 검증되고
 * 경로 하나만 확정되는 과정. 왼쪽은 tree, 오른쪽은 node 사이의 mask 행렬이다.
 * stage 높이는 네 장면의 최대 필요 크기로 고정하고 control row 는 아래 고정 row 에 둔다.
 */
const SCENES = ["Chain 과 tree", "Tree attention mask", "한 forward 로 검증", "경로 확정 · 가지 폐기"] as const;

const NOTES = [
  "Chain draft 는 깊이 2 에 token 2 개를 넣습니다. 폭 (2, 2) 인 tree 는 깊이 1 에 2 개, 깊이 2 에 4 개로 6 개를 넣어 첫 위치의 top-1 이 틀려도 top-2 로 이어집니다.",
  "Node i 가 node j 를 볼 수 있으면 1 입니다. 자기와 조상만 1 이라 6×6 에 1 이 10 개이고, 같은 6 token 의 causal mask 21 개보다 적습니다. 형제 가지는 서로 가려집니다.",
  "Target 의 한 forward 가 node 6 개의 logit 을 모두 냅니다. root 의 출력이 A 와 일치하고 A 의 출력이 A2 와 일치하며, A2 의 출력은 자식이 없어 bonus token 이 됩니다.",
  "확정 경로는 A, A2, bonus 세 token 입니다. B 가지와 A1 의 KV 는 버리고 다음 step 이 덮어씁니다. Chain 이었다면 top-1 인 A1 에서 멈춰 A 와 bonus 두 개만 확정됐을 것입니다.",
] as const;

type Node = { id: string; label: string; depth: number; parent: string | null; x: number; y: number };
const NODES: readonly Node[] = [
  { id: "r", label: "root", depth: 0, parent: null, x: 90, y: 24 },
  { id: "A", label: "A", depth: 1, parent: "r", x: 50, y: 80 },
  { id: "B", label: "B", depth: 1, parent: "r", x: 130, y: 80 },
  { id: "A1", label: "A1", depth: 2, parent: "A", x: 26, y: 136 },
  { id: "A2", label: "A2", depth: 2, parent: "A", x: 74, y: 136 },
  { id: "B1", label: "B1", depth: 2, parent: "B", x: 106, y: 136 },
  { id: "B2", label: "B2", depth: 2, parent: "B", x: 154, y: 136 },
];
const TREE_IDS = NODES.filter((n) => n.id !== "r").map((n) => n.id);
const ACCEPTED_PATH = ["A", "A2"];

function isAncestorOrSelf(i: string, j: string): boolean {
  let cur: string | null = i;
  while (cur) {
    if (cur === j) return true;
    cur = NODES.find((n) => n.id === cur)?.parent ?? null;
  }
  return false;
}

const R = 12;
const CELL = 20;
const GRID_ORIGIN = 28;

export default function SpeculativeDecodingVariantsViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3000);
  const scene = scenes.active;
  const showTree = true;
  const chainOnly = scene === 0;
  return (
    <VizFrame
      eyebrow="Tree speculation · tree attention verification"
      title="Tree 의 node 6 개를 조상만 보는 mask 로 한 forward 에 검증하고 경로 하나만 확정합니다"
      description="왼쪽은 폭 (2, 2) 인 token tree, 오른쪽은 node 사이의 attention mask 입니다. 색이 있는 node 가 target 에 수락된 경로입니다."
      note="실제 tree 는 수십 node 이고 prefix 의 causal mask 가 앞에 붙습니다. 그림은 tree 부분만 보이고 root 는 마지막 확정 token 입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="Token tree 의 tree attention 검증 과정"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(34rem,calc(100dvh-15rem))] min-h-[27rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(scene + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scene]}</h4>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 sm:items-center">
            <div className="min-w-0 border border-border p-3">
              <p className="text-[11px] font-bold text-muted-foreground">Token tree · 폭 (2, 2)</p>
              <svg viewBox="0 0 180 160" className="mx-auto mt-2 h-auto w-full max-w-[14rem]" role="img" aria-label="폭 2 깊이 2 의 token tree">
                {NODES.filter((n) => n.parent).map((n) => {
                  const p = NODES.find((q) => q.id === n.parent)!;
                  const onPath = ACCEPTED_PATH.includes(n.id) && scene >= 2;
                  const hidden = chainOnly && n.id !== "A" && n.id !== "A1";
                  return (
                    <line
                      key={`e-${n.id}`}
                      x1={p.x}
                      y1={p.y + R}
                      x2={n.x}
                      y2={n.y - R}
                      strokeWidth={1}
                      strokeDasharray={hidden ? "2 3" : undefined}
                      className={onPath ? "stroke-primary" : hidden ? "stroke-border" : "stroke-muted-foreground"}
                    />
                  );
                })}
                {NODES.map((n) => {
                  const onPath = (n.id === "r" || ACCEPTED_PATH.includes(n.id)) && scene >= 2;
                  const discarded = scene === 3 && n.id !== "r" && !ACCEPTED_PATH.includes(n.id);
                  const hidden = chainOnly && n.id !== "r" && n.id !== "A" && n.id !== "A1";
                  return (
                    <g key={n.id}>
                      <circle
                        cx={n.x}
                        cy={n.y}
                        r={R}
                        strokeWidth={1}
                        strokeDasharray={hidden || discarded ? "2 3" : undefined}
                        className={
                          onPath
                            ? "fill-primary/25 stroke-primary"
                            : hidden || discarded
                              ? "fill-transparent stroke-border"
                              : "fill-transparent stroke-muted-foreground"
                        }
                      />
                      <text x={n.x} y={n.y + 3} textAnchor="middle" className={`font-mono text-[8px] ${hidden || discarded ? "fill-muted-foreground" : "fill-foreground"}`}>
                        {n.label}
                      </text>
                    </g>
                  );
                })}
                {scene >= 2 && (
                  <text x={74} y={158} textAnchor="middle" className="fill-primary font-mono text-[8px]">
                    + bonus
                  </text>
                )}
              </svg>
              <p className="mt-1 text-center font-mono text-[10px] text-muted-foreground">
                {chainOnly ? "chain: 2 token · tree: 6 token" : scene === 3 ? "확정 3 · 폐기 4" : "verify token 6 · forward 1"}
              </p>
            </div>
            <div className="min-w-0 border border-border p-3">
              <p className="text-[11px] font-bold text-muted-foreground">Tree attention mask · 행이 열을 봄</p>
              <svg viewBox={`0 0 ${GRID_ORIGIN + 6 * CELL + 4} ${GRID_ORIGIN + 6 * CELL + 4}`} className="mx-auto mt-2 h-auto w-full max-w-[12rem]" role="img" aria-label="6×6 tree attention mask">
                {TREE_IDS.map((id, k) => (
                  <text key={`c-${id}`} x={GRID_ORIGIN + k * CELL + CELL / 2} y={GRID_ORIGIN - 6} textAnchor="middle" className="fill-muted-foreground font-mono text-[7px]">
                    {id}
                  </text>
                ))}
                {TREE_IDS.map((id, k) => (
                  <text key={`r-${id}`} x={GRID_ORIGIN - 6} y={GRID_ORIGIN + k * CELL + CELL / 2 + 3} textAnchor="end" className="fill-muted-foreground font-mono text-[7px]">
                    {id}
                  </text>
                ))}
                {TREE_IDS.flatMap((i, a) =>
                  TREE_IDS.map((j, b) => {
                    const one = showTree && isAncestorOrSelf(i, j);
                    const visible = scene >= 1;
                    const onPath = scene >= 2 && ACCEPTED_PATH.includes(i) && one;
                    return (
                      <g key={`${i}-${j}`}>
                        <rect
                          x={GRID_ORIGIN + b * CELL}
                          y={GRID_ORIGIN + a * CELL}
                          width={CELL}
                          height={CELL}
                          strokeWidth={1}
                          className={
                            visible && one
                              ? onPath
                                ? "fill-primary/25 stroke-primary"
                                : "fill-muted-foreground/15 stroke-border"
                              : "fill-transparent stroke-border"
                          }
                        />
                        {visible && (
                          <text x={GRID_ORIGIN + b * CELL + CELL / 2} y={GRID_ORIGIN + a * CELL + CELL / 2 + 3} textAnchor="middle" className={`font-mono text-[8px] ${one ? "fill-foreground" : "fill-muted-foreground"}`}>
                            {one ? "1" : "0"}
                          </text>
                        )}
                      </g>
                    );
                  }),
                )}
              </svg>
              <p className="mt-1 text-center font-mono text-[10px] text-muted-foreground">
                {scene >= 1 ? "1 의 수 10 · causal 이면 21" : "mask 는 다음 장면에서"}
              </p>
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

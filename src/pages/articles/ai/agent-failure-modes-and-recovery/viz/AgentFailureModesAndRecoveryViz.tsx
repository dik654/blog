import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 실행 경로가 실패 신호에서 세 failure mode 로 갈라지고, 각 mode 가 idempotent 여부에 따라
 * retry 또는 human escalation 으로 수렴하는 장면. Node/edge 는 장면이 지나도 사라지지 않고
 * "seen" 상태로 남아, stage 크기가 장면 사이에 바뀌지 않는다(stable stage).
 */
const SCENES = [
  "정상 실행 경로",
  "세 failure mode 로 갈라짐",
  "Idempotent 여부 확인",
  "Retry 또는 escalation 으로 수렴",
] as const;

const NOTES = [
  "1→2→3 단계는 순서대로 실행되고, 아직 실패 신호는 없습니다.",
  "3 단계에서 실패 신호가 나오면 infra timeout·tool misuse·goal/context drift 세 갈래로 분류됩니다.",
  "Infra timeout 만 idempotent 여부를 확인할 대상입니다. 나머지 둘은 재시도로 고쳐지지 않습니다.",
  "Idempotent 이면 retry, 아니면 나머지 둘과 함께 checkpoint 를 남긴 human escalation 으로 수렴합니다.",
] as const;

type NodeSpec = { id: string; x: number; y: number; w: number; label: string; unlock: number; sub?: string };
type EdgeSpec = { from: string; to: string; unlock: number; label?: string };

const NODES: NodeSpec[] = [
  { id: "s1", x: 20, y: 14, w: 60, label: "1 단계", unlock: 0 },
  { id: "s2", x: 100, y: 14, w: 60, label: "2 단계", unlock: 0 },
  { id: "s3", x: 180, y: 14, w: 60, label: "3 단계", unlock: 0 },
  { id: "infra", x: 20, y: 78, w: 96, label: "Infra timeout", unlock: 1 },
  { id: "tool", x: 182, y: 78, w: 96, label: "Tool misuse", unlock: 1 },
  { id: "goal", x: 344, y: 78, w: 116, label: "Goal/context drift", unlock: 1 },
  { id: "check", x: 20, y: 138, w: 96, label: "Idempotent?", unlock: 2 },
  { id: "retry", x: 20, y: 198, w: 96, label: "Retry", unlock: 3 },
  { id: "escalate", x: 210, y: 198, w: 130, label: "Escalation → human", unlock: 3 },
];

const EDGES: EdgeSpec[] = [
  { from: "s1", to: "s2", unlock: 0 },
  { from: "s2", to: "s3", unlock: 0 },
  { from: "s3", to: "infra", unlock: 1 },
  { from: "s3", to: "tool", unlock: 1 },
  { from: "s3", to: "goal", unlock: 1 },
  { from: "infra", to: "check", unlock: 2 },
  { from: "check", to: "retry", unlock: 3, label: "예" },
  { from: "check", to: "escalate", unlock: 3, label: "아니오" },
  { from: "tool", to: "escalate", unlock: 3 },
  { from: "goal", to: "escalate", unlock: 3 },
];

function nodeState(unlock: number, active: number): "future" | "active" | "seen" {
  if (active < unlock) return "future";
  if (active === unlock) return "active";
  return "seen";
}

const NODE_H = 26;

function centerX(n: NodeSpec) {
  return n.x + n.w / 2;
}

export default function AgentFailureModesAndRecoveryViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2800);
  const active = scenes.active;
  const byId = Object.fromEntries(NODES.map((n) => [n.id, n]));

  return (
    <VizFrame
      eyebrow="Agent failure mode · recovery"
      title="같은 실행 경로가 실패 신호에서 갈라지고, idempotent 여부로 다시 모입니다"
      description="Failure mode 마다 다른 갈래로 나뉘지만, 자동으로 안전한 것은 retry뿐이고 나머지는 escalation으로 모입니다."
      note="실제 taxonomy는 더 세분화되지만, 이 장면은 retry 대 escalation 판정 축 하나만 단순화해 보여줍니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="복구는 idempotent 여부로 retry 나 escalation 으로 갈립니다"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(34rem,calc(100dvh-15rem))] min-h-[27rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(active + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[active]}</h4>

          <svg viewBox="0 0 480 232" className="mt-4 w-full" role="img" aria-label={SCENES[active]}>
            {EDGES.map((edge, index) => {
              const from = byId[edge.from];
              const to = byId[edge.to];
              const state = nodeState(edge.unlock, active);
              const stroke =
                state === "future" ? "#d4d4d8" : state === "active" ? "#6366f1" : "#a5a5b0";
              const x1 = centerX(from);
              const y1 = from.y + NODE_H;
              const x2 = centerX(to);
              const y2 = to.y;
              const midY = (y1 + y2) / 2;
              return (
                <g key={`${edge.from}-${edge.to}-${index}`}>
                  <path
                    d={`M${x1},${y1} C${x1},${midY} ${x2},${midY} ${x2},${y2}`}
                    fill="none"
                    stroke={stroke}
                    strokeWidth={state === "active" ? 1.25 : 1}
                  />
                  {edge.label && state !== "future" && (
                    <text x={(x1 + x2) / 2 + 6} y={midY} fontSize={8} fill="#71717a">
                      {edge.label}
                    </text>
                  )}
                </g>
              );
            })}
            {NODES.map((n) => {
              const state = nodeState(n.unlock, active);
              const fill = state === "future" ? "#fafafa" : state === "active" ? "#eef2ff" : "#f4f4f5";
              const stroke = state === "future" ? "#d4d4d8" : state === "active" ? "#6366f1" : "#a5a5b0";
              const text = state === "future" ? "#a1a1aa" : "#27272a";
              return (
                <g key={n.id}>
                  <rect
                    x={n.x}
                    y={n.y}
                    width={n.w}
                    height={NODE_H}
                    rx={4}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={state === "active" ? 1.25 : 1}
                  />
                  <text
                    x={centerX(n)}
                    y={n.y + NODE_H / 2 + 3}
                    textAnchor="middle"
                    fontSize={9}
                    fontWeight={state === "active" ? 700 : 500}
                    fill={text}
                  >
                    {n.label}
                  </text>
                </g>
              );
            })}
          </svg>

          <p className="mt-6 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {NOTES[active]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}

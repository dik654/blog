import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 같은 위장된 위험 요청이 rule-based guardrail과 model-based guardrail을 각각 지날 때
 * 어떻게 다른 판정과 latency로 갈리는지 보여주는 장면. Node/edge는 장면이 지나도
 * 사라지지 않고 "seen" 상태로 남아 stage 크기가 바뀌지 않는다(stable stage).
 */
const SCENES = [
  "위장된 위험 요청 도착",
  "Rule-based 검사 (패턴만 봄)",
  "Model-based 검사 (의미를 봄)",
  "판정 결과: False Negative 대 True Positive",
] as const;

const NOTES = [
  "패턴은 감췄지만 의도는 위험한 요청 하나가 두 guardrail 앞에 동시에 놓입니다.",
  "Rule-based guardrail은 미리 정한 정규식·키워드만 비교합니다. 문자를 쪼개거나 바꿔 쓰면 패턴이 어긋나 그대로 통과할 수 있습니다.",
  "Model-based guardrail은 표현이 달라도 같은 의도를 의미로 해석해 잡아냅니다. 대신 model 호출 한 번만큼 지연이 더 듭니다.",
  "같은 요청이 rule-based에서는 false negative로 새고, model-based에서는 true positive로 잡히지만 약 200배 느립니다. 실무에서는 rule-based로 먼저 거르고 애매한 것만 model-based로 넘기는 2단 구성을 씁니다.",
] as const;

type NodeSpec = { id: string; x: number; y: number; w: number; label: string; unlock: number };
type EdgeSpec = { from: string; to: string; unlock: number; label?: string };

const NODES: NodeSpec[] = [
  { id: "req", x: 150, y: 12, w: 180, label: "위장된 위험 요청", unlock: 0 },
  { id: "rule", x: 20, y: 82, w: 190, label: "Rule-based (~1ms)", unlock: 1 },
  { id: "model", x: 270, y: 82, w: 190, label: "Model-based (~200ms)", unlock: 2 },
  { id: "rule-out", x: 10, y: 152, w: 210, label: "통과 → False Negative", unlock: 3 },
  { id: "model-out", x: 260, y: 152, w: 210, label: "차단 → True Positive", unlock: 3 },
];

const EDGES: EdgeSpec[] = [
  { from: "req", to: "rule", unlock: 1 },
  { from: "req", to: "model", unlock: 2 },
  { from: "rule", to: "rule-out", unlock: 3 },
  { from: "model", to: "model-out", unlock: 3 },
];

function nodeState(unlock: number, active: number): "future" | "active" | "seen" {
  if (active < unlock) return "future";
  if (active === unlock) return "active";
  return "seen";
}

const NODE_H = 30;

function centerX(n: NodeSpec) {
  return n.x + n.w / 2;
}

export default function LlmGuardrailsAndOutputValidationViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2800);
  const active = scenes.active;
  const byId = Object.fromEntries(NODES.map((n) => [n.id, n]));

  return (
    <VizFrame
      eyebrow="Rule-based · model-based guardrail"
      title="같은 위장된 요청이 rule-based에서는 새고, model-based에서는 잡히지만 200배 느립니다"
      description="판정 방식(rule/model)이 다르면 같은 요청에도 latency와 정확도가 서로 반대로 움직입니다."
      note="실제 pipeline은 두 단을 함께 쓰지만, 이 장면은 한 요청이 한 판정 방식만 지났다고 가정해 대조를 단순화했습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="Rule-based guardrail과 model-based guardrail의 latency-정확도 대조"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(32rem,calc(100dvh-15rem))] min-h-[25rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(active + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[active]}</h4>

          <svg viewBox="0 0 480 210" className="mt-4 w-full" role="img" aria-label={SCENES[active]}>
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

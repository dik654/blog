import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 검색된 문서 속에 숨은 indirect prompt injection이, instruction-data separation의
 * 유무에 따라 실행되거나 데이터로만 남는 두 결말로 갈리는 장면. Node는 장면이 지나도
 * 사라지지 않고 "seen" 상태로 남아 stage 크기가 바뀌지 않는다(stable stage).
 */
const SCENES = [
  "숨은 지시가 담긴 문서 도착",
  "분리 없이 합치면: 지시로 읽힘",
  "Instruction-data separation 적용",
  "결과: 실행 대 미실행",
] as const;

const NOTES = [
  "검색 tool이 가져온 지원 티켓 본문 안에, 공격자가 미리 심어 둔 지시 문장이 섞여 있습니다.",
  "System instruction과 외부 문서를 구분 없이 이어 붙이면, model은 문서 속 문장도 자신에게 내려온 지시로 읽습니다.",
  "Instruction-data separation은 외부 콘텐츠를 <document> 같은 data 태그 안에 구조적으로 가둬 지시와 구분합니다.",
  "같은 문서라도 separation 유무에 따라 결과가 갈립니다. 분리 없이 실행되면 정보가 attacker@evil.com 같은 곳으로 새 나가고, 분리하면 데이터로만 남아 실행되지 않습니다. 다만 태그만으로 완전히 막히지는 않아 output·tool guardrail을 함께 둡니다.",
] as const;

type NodeSpec = { id: string; x: number; y: number; w: number; label: string; unlock: number };
type EdgeSpec = { from: string; to: string; unlock: number };

const NODES: NodeSpec[] = [
  { id: "doc", x: 150, y: 12, w: 180, label: "검색 문서 속 숨은 지시", unlock: 0 },
  { id: "nosep", x: 15, y: 82, w: 205, label: "분리 없음: 지시로 합쳐짐", unlock: 1 },
  { id: "sep", x: 260, y: 82, w: 205, label: "Separation 적용: data 태그 안", unlock: 2 },
  { id: "exec", x: 10, y: 152, w: 215, label: "Model이 실행 → 정보 유출", unlock: 3 },
  { id: "blocked", x: 255, y: 152, w: 215, label: "데이터로 인식 → 미실행", unlock: 3 },
];

const EDGES: EdgeSpec[] = [
  { from: "doc", to: "nosep", unlock: 1 },
  { from: "doc", to: "sep", unlock: 2 },
  { from: "nosep", to: "exec", unlock: 3 },
  { from: "sep", to: "blocked", unlock: 3 },
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

export default function PromptInjectionPoisoningAndDataProtectionViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2800);
  const active = scenes.active;
  const byId = Object.fromEntries(NODES.map((n) => [n.id, n]));

  return (
    <VizFrame
      eyebrow="Indirect prompt injection · instruction-data separation"
      title="같은 숨은 지시가 separation 유무에 따라 실행되거나 데이터로만 남습니다"
      description="외부 콘텐츠를 지시와 구조적으로 분리하느냐가 indirect injection의 실행 여부를 가릅니다."
      note="Separation은 완화이지 완전한 차단은 아니라 output·tool guardrail과 함께 쓴다는 점을 다음 절이 이어 다룹니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="Instruction-data separation 유무에 따른 indirect prompt injection 결과 대조"
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

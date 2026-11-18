import { useId } from "react";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — 세 방법을 한 가로등 수리에 차례로 적용한다.
 * 개입 결과로 원인 가설을 좁히고(전구 실패 · 배선 7일 점등 · 센서 시간 조정),
 * ‘정상’을 7일 점등에서 필요한 시간대·밝기·고장 신고 가능성으로 다시 정의하고,
 * 숫자에 빠진 보행자의 몸과 시야를 관찰·인터뷰한다. 이 경험 기록이 기준과 개입을 바꾸면 순환이 된다.
 */
const NODES = [
  { x: 60, title: "결과 시험", method: "프래그머틱 격률" },
  { x: 180, title: "기준 정리", method: "개념 분석" },
  { x: 300, title: "경험 기술", method: "현상학적 기술" },
] as const;

const NODE_W = 108;
const NODE_H = 54;
const NODE_Y = 4;

const SCENES = [
  {
    label: "개입 결과로 원인 가설을 좁힙니다",
    summary: "전구 실패 → 배선 7일 → 센서 조정",
    step: 0,
    loop: false,
    hypothesis: "전구 교체는 다시 꺼져 기각, 배선 수리 뒤 7일 점등, 센서 시간 조정 뒤 보행자가 지나는 동안 안정적으로 점등",
    standard: "처음 기준: 7일 동안 켜지면 정상",
    experience: "아직 적지 않음",
    note: "전구·배선·센서를 차례로 바꿔 본 결과로 원인 가설을 좁힙니다. 이 단계의 판정 기준은 아직 ‘며칠 동안 켜졌나’에 머뭅니다.",
  },
  {
    label: "‘정상’의 기준을 다시 정의합니다",
    summary: "7일 점등 → 시간대·밝기·신고 가능성",
    step: 1,
    loop: false,
    hypothesis: "전구 교체는 다시 꺼져 기각, 배선 수리 뒤 7일 점등, 센서 시간 조정 뒤 보행자가 지나는 동안 안정적으로 점등",
    standard: "필요한 시간대에, 필요한 밝기로 켜지고, 고장 나면 신고할 수 있으면 정상",
    experience: "아직 적지 않음",
    note: "개념 분석은 ‘정상 작동’이 무엇을 가리키는지 나눕니다. 7일 점등 기록은 그대로 두고, 그 기록을 재는 기준을 넓힙니다.",
  },
  {
    label: "숫자에 빠진 경험을 찾습니다",
    summary: "보행자의 몸과 시야를 관찰·인터뷰",
    step: 2,
    loop: false,
    hypothesis: "전구 교체는 다시 꺼져 기각, 배선 수리 뒤 7일 점등, 센서 시간 조정 뒤 보행자가 지나는 동안 안정적으로 점등",
    standard: "필요한 시간대에, 필요한 밝기로 켜지고, 고장 나면 신고할 수 있으면 정상",
    experience: "보행자의 몸과 시야를 관찰하고 인터뷰합니다. 3절이 따로 남긴 휠체어 이용자·야간 노동자가 겪은 그림자도 이 칸의 기록입니다.",
    note: "현상학적 기술은 어둠과 빛이 보행자에게 어떻게 나타나는지 이론보다 먼저 기술합니다. 점등 일수와 기준 문장만으로는 이 칸이 채워지지 않습니다.",
  },
  {
    label: "경험 기록이 기준과 개입을 바꾸면",
    summary: "세 칸이 서로의 빈칸을 드러내는 순환",
    step: 3,
    loop: true,
    hypothesis: "경험 기록을 보고 다시 시험할 개입",
    standard: "경험 기록을 보고 다시 고칠 기준",
    experience: "보행자의 몸과 시야를 관찰하고 인터뷰합니다. 3절이 따로 남긴 휠체어 이용자·야간 노동자가 겪은 그림자도 이 칸의 기록입니다.",
    note: "본문은 조건을 붙입니다. 이 경험 기록이 새 기준과 개입을 바꾸면, 세 방법은 경쟁하는 표어가 아니라 서로의 빈칸을 드러내는 순환이 됩니다. 어떤 기준이 어떻게 바뀌는지는 본문이 정하지 않았습니다.",
  },
] as const;

const ROWS = [
  { key: "hypothesis", label: "원인 가설", node: 0 },
  { key: "standard", label: "정상의 기준", node: 1 },
  { key: "experience", label: "경험 기록", node: 2 },
] as const;

function LoopDiagram({ step, loop }: { step: number; loop: boolean }) {
  const uid = useId().replace(/:/g, "");
  const arrow = `method-loop-arrow-${uid}`;
  const accent = `method-loop-accent-${uid}`;
  return (
    <svg viewBox="0 0 360 112" className="mx-auto block h-auto w-full max-w-md" role="img" aria-label="결과 시험, 기준 정리, 경험 기술의 세 칸과 경험에서 앞의 두 칸으로 돌아가는 화살표">
      <defs>
        <marker id={arrow} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" fill="#64748b" />
        </marker>
        <marker id={accent} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" fill="#2563eb" />
        </marker>
      </defs>
      {[0, 1].map((index) => (
        <line
          key={index}
          x1={NODES[index].x + NODE_W / 2 + 2}
          y1={NODE_Y + NODE_H / 2}
          x2={NODES[index + 1].x - NODE_W / 2 - 4}
          y2={NODE_Y + NODE_H / 2}
          stroke="#64748b"
          strokeWidth={1}
          markerEnd={`url(#${arrow})`}
        />
      ))}
      {NODES.map((node, index) => {
        const active = loop ? true : index === step;
        const reached = loop || index <= step;
        return (
          <g key={node.title}>
            <rect
              x={node.x - NODE_W / 2}
              y={NODE_Y}
              width={NODE_W}
              height={NODE_H}
              rx={8}
              fill="none"
              stroke={active ? "#2563eb" : reached ? "#64748b" : "#cbd5e1"}
              strokeWidth={active ? 1.25 : 1}
              strokeDasharray={reached ? undefined : "4 3"}
            />
            <text x={node.x} y={NODE_Y + 23} textAnchor="middle" fontSize={15} fontWeight={700} className={reached ? "fill-foreground" : "fill-muted-foreground"}>
              {node.title}
            </text>
            <text x={node.x} y={NODE_Y + 42} textAnchor="middle" fontSize={12} className="fill-muted-foreground">
              {node.method}
            </text>
          </g>
        );
      })}
      <g opacity={loop ? 1 : 0}>
        <path
          d={`M ${NODES[2].x} ${NODE_Y + NODE_H + 2} V 84 H ${NODES[0].x} V ${NODE_Y + NODE_H + 6}`}
          fill="none"
          stroke="#2563eb"
          strokeWidth={1.25}
          strokeDasharray="5 4"
          markerEnd={`url(#${accent})`}
        />
        <line x1={NODES[1].x} y1={84} x2={NODES[1].x} y2={NODE_Y + NODE_H + 6} stroke="#2563eb" strokeWidth={1.25} strokeDasharray="5 4" markerEnd={`url(#${accent})`} />
        <text x={240} y={104} textAnchor="middle" fontSize={12} fill="#2563eb">
          경험 기록이 기준과 개입을 바꾸면
        </text>
      </g>
    </svg>
  );
}

export default function MethodLoopViz() {
  return (
    <SceneShell
      eyebrow="세 방법의 순서"
      title="가로등 수리 기록이 세 칸을 차례로 채웁니다"
      description="위 그림은 지금 쓰는 방법, 아래 기록판은 그 방법이 무엇을 적었는지 보여 줍니다. 민원 10건과 세 번의 개입은 3절의 설명용 사례입니다."
      ariaLabel="개입 결과로 원인 가설을 좁히고, 정상의 기준을 다시 정의하고, 보행자 경험을 기록한 뒤 그 기록이 기준과 개입을 바꾸면 순환이 되는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-3">
            <LoopDiagram step={scene.step} loop={scene.loop} />
            <dl className="space-y-2">
              {ROWS.map((row) => {
                const reached = scene.loop || row.node <= scene.step;
                const current = scene.loop ? row.node < 2 : row.node === scene.step;
                return (
                  <div
                    key={row.key}
                    className={`grid grid-cols-1 gap-1 rounded-md border px-3 py-2 sm:grid-cols-[6.5rem_minmax(0,1fr)] sm:gap-3 ${
                      current ? "border-primary" : reached ? "border-border" : "border-dashed border-border"
                    }`}
                  >
                    <dt className="text-xs font-semibold sm:text-sm">{row.label}</dt>
                    <dd className={`text-xs leading-6 sm:text-sm ${reached ? "text-foreground" : "text-muted-foreground"}`}>{scene[row.key]}</dd>
                  </div>
                );
              })}
            </dl>
          </div>
        );
      }}
    />
  );
}

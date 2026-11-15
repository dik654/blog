import SceneShell from "./SceneShell";

/**
 * 본문 대응: #crate-map "Dependency arrow는 호출 횟수가 아니라 compile-time 지식을 뜻합니다".
 * 실행 순서(runtime → tool 호출)와 source 의존(tools → runtime contract)이 반대 방향임을 같은 상자 위에 겹쳐 봅니다.
 * 고정 commit의 manifest: CLI는 api·runtime·tools·commands·plugins를 조립, tools는 runtime contract 사용, runtime은 tools에 의존하지 않음.
 */
type Arrow = {
  from: readonly [number, number];
  to: readonly [number, number];
  label: string;
  lx: number;
  ly: number;
  kind: "call" | "dep" | "bad" | "none";
};

const COLORS = { call: "#2563eb", dep: "#d97706", bad: "#dc2626", none: "#94a3b8" } as const;

const BOX = {
  cli: { x: 104, y: 12, w: 128, h: 34, title: "rusty-claude-cli", sub: "" },
  others: { x: 250, y: 12, w: 98, h: 34, title: "api · commands", sub: "· plugins" },
  runtime: { x: 12, y: 98, w: 136, h: 44, title: "runtime", sub: "ToolExecutor contract" },
  tools: { x: 212, y: 98, w: 136, h: 44, title: "tools", sub: "built-in tool" },
  real: { x: 12, y: 176, w: 136, h: 36, title: "실제 executor", sub: "" },
  double: { x: 212, y: 176, w: 136, h: 36, title: "test double", sub: "" },
} as const;

type BoxKey = keyof typeof BOX;

const SCENES = [
  {
    label: "실행 순서",
    summary: "runtime → tool 호출",
    note: "파란 화살표는 실행 중 누가 누구를 부르는지입니다. CLI가 runtime을 조립해 turn을 시작하고, runtime은 ToolExecutor contract를 통해 tool을 호출합니다. tool의 typed result는 runtime으로 돌아옵니다.",
    boxes: ["cli", "runtime", "tools"] as readonly BoxKey[],
    arrows: [
      { from: [150, 46], to: [96, 98], label: "조립·시작", lx: 88, ly: 70, kind: "call" },
      { from: [148, 112], to: [212, 112], label: "호출", lx: 180, ly: 106, kind: "call" },
      { from: [212, 130], to: [148, 130], label: "result", lx: 180, ly: 146, kind: "call" },
    ] as readonly Arrow[],
  },
  {
    label: "compile-time 의존",
    summary: "tools → runtime, 반대는 없음",
    note: "주황 화살표는 Cargo manifest의 의존, 즉 누가 누구의 type을 import하는지입니다. tools가 runtime contract를 사용하고 runtime은 tools crate에 의존하지 않습니다. runtime과 tools 사이에서는 실행 순서의 화살표(runtime → tool)와 방향이 반대입니다.",
    boxes: ["cli", "others", "runtime", "tools"] as readonly BoxKey[],
    arrows: [
      { from: [150, 46], to: [96, 98], label: "의존", lx: 92, ly: 70, kind: "dep" },
      { from: [196, 46], to: [256, 98], label: "의존", lx: 254, ly: 70, kind: "dep" },
      { from: [232, 29], to: [250, 29], label: "", lx: 0, ly: 0, kind: "dep" },
      { from: [212, 130], to: [148, 130], label: "contract 사용", lx: 180, ly: 146, kind: "dep" },
      { from: [148, 112], to: [212, 112], label: "의존 없음", lx: 180, ly: 94, kind: "none" },
    ] as readonly Arrow[],
  },
  {
    label: "같은 contract 두 구현",
    summary: "실제 executor · test double",
    note: "runtime이 concrete tool을 import하지 않고 interface만 부르므로 실제 executor와 test double이 같은 ToolExecutor contract를 각각 구현할 수 있습니다. 이것이 본문이 말하는 의존성 역전입니다. 본문은 실제 executor가 어느 crate에 있는지 말하지 않으므로 crate 상자와 따로 그렸습니다.",
    boxes: ["runtime", "real", "double"] as readonly BoxKey[],
    arrows: [
      { from: [80, 176], to: [80, 142], label: "구현", lx: 98, ly: 163, kind: "dep" },
      { from: [222, 176], to: [140, 142], label: "구현", lx: 196, ly: 154, kind: "dep" },
    ] as readonly Arrow[],
  },
  {
    label: "역방향 의존",
    summary: "runtime → CLI type = 경계 위반",
    note: "runtime이 CLI rendering type을 import하면 다른 UI가 중심 loop를 재사용하기 어렵습니다. 붉은 점선 같은 역방향 의존은 경계 위반을 찾는 신호입니다.",
    boxes: ["cli", "runtime", "tools"] as readonly BoxKey[],
    arrows: [
      { from: [212, 130], to: [148, 130], label: "contract 사용", lx: 180, ly: 146, kind: "dep" },
      { from: [40, 98], to: [104, 34], label: "rendering type import", lx: 70, ly: 84, kind: "bad" },
    ] as readonly Arrow[],
  },
] as const;

const W = 360;
const H = 224;

function Marker({ id, color }: { id: string; color: string }) {
  return (
    <marker id={id} viewBox="0 0 8 8" refX={7} refY={4} markerWidth={7} markerHeight={7} orient="auto-start-reverse">
      <path d="M0 0 L8 4 L0 8 Z" fill={color} />
    </marker>
  );
}

export default function DependencyDirectionViz() {
  return (
    <SceneShell
      eyebrow="호출 방향과 의존 방향"
      title="runtime이 tool을 부르지만 import는 tools 쪽에서 합니다"
      description="파란 화살표는 실행 순서(control flow), 주황 화살표는 compile-time 의존(Cargo dependency·import)입니다. 상자는 본문이 고정한 commit의 crate 이름을 따릅니다."
      ariaLabel="Claw Code crate 사이의 실행 순서와 compile-time 의존 방향 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const shown = new Set<BoxKey>(scene.boxes);
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <defs>
              <Marker id="claw-dep-call" color={COLORS.call} />
              <Marker id="claw-dep-dep" color={COLORS.dep} />
              <Marker id="claw-dep-bad" color={COLORS.bad} />
            </defs>
            {(Object.keys(BOX) as BoxKey[]).map((key) => {
              const box = BOX[key];
              const on = shown.has(key);
              return (
                <g key={key} opacity={on ? 1 : 0.25}>
                  <rect x={box.x} y={box.y} width={box.w} height={box.h} rx={8} fill="none" stroke={key === "runtime" ? "#2563eb" : "#94a3b8"} strokeWidth={1} />
                  <text x={box.x + box.w / 2} y={box.y + (box.sub ? 15 : 21)} textAnchor="middle" fontSize={12} fontWeight={700} fill="#475569">{box.title}</text>
                  {box.sub && (
                    <text x={box.x + box.w / 2} y={box.y + 29} textAnchor="middle" fontSize={10.5} fill="#64748b">{box.sub}</text>
                  )}
                </g>
              );
            })}
            {scene.arrows.map((arrow, index) => {
              const color = COLORS[arrow.kind];
              const marker = arrow.kind === "none" ? undefined : `url(#claw-dep-${arrow.kind})`;
              const midX = (arrow.from[0] + arrow.to[0]) / 2;
              const midY = (arrow.from[1] + arrow.to[1]) / 2;
              return (
                <g key={`${active}-${index}`}>
                  <line
                    x1={arrow.from[0]}
                    y1={arrow.from[1]}
                    x2={arrow.to[0]}
                    y2={arrow.to[1]}
                    stroke={color}
                    strokeWidth={1.25}
                    strokeDasharray={arrow.kind === "bad" || arrow.kind === "none" ? "4 3" : undefined}
                    markerEnd={marker}
                  />
                  {arrow.kind === "none" && (
                    <path d={`M ${midX - 5} ${midY - 5} L ${midX + 5} ${midY + 5} M ${midX + 5} ${midY - 5} L ${midX - 5} ${midY + 5}`} stroke={color} strokeWidth={1.25} />
                  )}
                  {arrow.label && (
                    <text x={arrow.lx} y={arrow.ly} textAnchor={arrow.kind === "bad" ? "start" : "middle"} fontSize={11} fontWeight={600} fill={color}>{arrow.label}</text>
                  )}
                </g>
              );
            })}
          </svg>
        );
      }}
    />
  );
}

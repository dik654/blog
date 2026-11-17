import SceneShell from "./SceneShell";

/**
 * 본문 대응: #incremental-update — old tree에 edit 위치를 반영하고, 영향을 받지 않은 subtree를 재사용할 수 있다.
 * 예시는 개요 카드의 `const x = {a: 1}`에서 1을 10으로 바꾸는 edit(end byte +1).
 * byte 구간은 [시작, 끝). 옛 tree: number [14,15), object [10,16), } [15,16).
 * 새 tree: number [14,16), object [10,17), } [16,17). node 이름과 모양은 단순화한 가정이다.
 */
type Kind = "before" | "edit" | "ancestor" | "after";
type Node = { id: string; label: string; newLabel?: string; x: number; y: number; parent?: string; old: [number, number]; kind: Kind };

const NODES: readonly Node[] = [
  { id: "prog", label: "program", x: 220, y: 18, old: [0, 16], kind: "ancestor" },
  { id: "decl", label: "declaration", x: 220, y: 58, parent: "prog", old: [0, 16], kind: "ancestor" },
  { id: "const", label: "const", x: 60, y: 98, parent: "decl", old: [0, 5], kind: "before" },
  { id: "dtor", label: "declarator", x: 260, y: 98, parent: "decl", old: [6, 16], kind: "ancestor" },
  { id: "x", label: "x", x: 120, y: 138, parent: "dtor", old: [6, 7], kind: "before" },
  { id: "eq", label: "=", x: 178, y: 138, parent: "dtor", old: [8, 9], kind: "before" },
  { id: "obj", label: "object", x: 300, y: 138, parent: "dtor", old: [10, 16], kind: "ancestor" },
  { id: "lb", label: "{", x: 214, y: 178, parent: "obj", old: [10, 11], kind: "before" },
  { id: "pair", label: "pair", x: 300, y: 178, parent: "obj", old: [11, 15], kind: "ancestor" },
  { id: "rb", label: "}", x: 392, y: 178, parent: "obj", old: [15, 16], kind: "after" },
  { id: "key", label: "a", x: 246, y: 218, parent: "pair", old: [11, 12], kind: "before" },
  { id: "colon", label: ":", x: 300, y: 218, parent: "pair", old: [12, 13], kind: "before" },
  { id: "num", label: "1", newLabel: "10", x: 354, y: 218, parent: "pair", old: [14, 15], kind: "edit" },
];

const EDIT_START = 14;
const OLD_END = 15;
const NEW_END = 16;
const DELTA = NEW_END - OLD_END;

/** edit 뒤 새 구간: 시작이 edit 뒤면 통째로 밀리고, edit를 감싸면 끝만 늘어난다. */
function newRange([s, e]: [number, number]): [number, number] {
  if (s >= OLD_END) return [s + DELTA, e + DELTA];
  if (e >= OLD_END && s <= EDIT_START) return [s, e + DELTA];
  return [s, e];
}

const SCENES = [
  {
    label: "옛 tree: 모든 node가 byte 구간을 가집니다",
    summary: "1은 [14,15)",
    stage: 0,
    note: "`const x = {a: 1}`은 16 byte입니다. 각 node는 자기가 덮는 source 구간 [시작, 끝)을 기억합니다. 숫자 1은 14번 byte 하나, object는 10~15번 byte입니다.",
  },
  {
    label: "Edit: [14,15)를 '10'으로 바꿔 끝이 16이 됩니다",
    summary: "[14,15) → [14,16)",
    stage: 1,
    note: "편집기는 '14번에서 시작해 옛 끝 15가 새 끝 16이 됐다'는 edit range를 parser에 넘깁니다. 개요 카드의 '1을 10으로 바꿔 end byte가 하나 늘어납니다'가 이 한 줄입니다.",
  },
  {
    label: "Edit 위치를 반영해 다시 볼 곳과 재사용 후보를 나눕니다",
    summary: "다시 볼 node 6 · 재사용 후보 7",
    stage: 2,
    note: "바뀐 숫자와 그것을 감싸는 조상까지 여섯 node(program부터 숫자까지)는 다시 볼 대상입니다. edit 앞의 여섯 node는 구간 그대로, 뒤의 `}`는 구간을 한 칸 민 [16,17)로 재사용할 수 있는 후보가 됩니다.",
  },
  {
    label: "새 tree: 조상들의 끝이 하나씩 늘어납니다",
    summary: "object [10,16) → [10,17)",
    stage: 3,
    note: "다시 parse하면 숫자는 10 [14,16)이 되고 조상들의 끝이 하나씩 늘어납니다. 나머지 node는 재사용할 수 있어서 file 전체를 처음부터 해석하지 않고도 highlighting·folding을 짧은 주기로 갱신합니다.",
  },
] as const;

const COLOR: Record<Kind, { stroke: string; fill: string }> = {
  edit: { stroke: "#dc2626", fill: "#fee2e2" },
  ancestor: { stroke: "#d97706", fill: "#fef3c7" },
  before: { stroke: "#16a34a", fill: "#dcfce7" },
  after: { stroke: "#16a34a", fill: "#dcfce7" },
};
const MUTED = "#94a3b8";

function fmt([s, e]: [number, number]) {
  return `[${s},${e})`;
}

export default function SubtreeReuseViz() {
  return (
    <SceneShell
      eyebrow="Edit 한 번"
      title="1을 10으로 바꿀 때 tree에서 다시 보는 곳"
      description="개요의 `const x = {a: 1}`을 쓴 단순화한 tree입니다(node 이름은 가정). 각 node 아래 숫자는 그 node가 덮는 byte 구간 [시작, 끝)이고, 굵은 주황 숫자는 edit 뒤 바뀐 구간입니다."
      ariaLabel="const x = {a: 1}에서 1을 10으로 바꿀 때 조상 6개는 다시 parse하고 나머지 7개 node는 재사용 후보가 되는 과정"
      scenes={SCENES}
      render={(active) => {
        const { stage } = SCENES[active];
        const byId = new Map(NODES.map((n) => [n.id, n]));
        return (
          <div className="min-w-0">
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span><span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm border border-[#dc2626] bg-[#fee2e2] align-middle" />바뀐 byte</span>
              <span><span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm border border-[#d97706] bg-[#fef3c7] align-middle" />edit를 감싸 다시 볼 조상</span>
              <span><span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm border border-[#16a34a] bg-[#dcfce7] align-middle" />재사용 후보</span>
            </div>
            <svg viewBox="0 0 440 250" role="img" aria-label={SCENES[active].label} className="mt-2 block h-auto w-full sm:mx-auto sm:max-w-[27rem]">
              {NODES.map((n) => {
                const p = n.parent ? byId.get(n.parent) : undefined;
                return p ? <line key={`l-${n.id}`} x1={p.x} y1={p.y + 28} x2={n.x} y2={n.y - 11} stroke={MUTED} strokeWidth="1" /> : null;
              })}
              {NODES.map((n) => {
                const show = stage >= 2 || (stage === 1 && n.kind === "edit");
                const c = show ? COLOR[n.kind] : { stroke: MUTED, fill: "none" };
                const label = stage === 3 && n.newLabel ? n.newLabel : n.label;
                const w = Math.max(24, label.length * 7.8 + 12);
                const range = stage >= 2 ? newRange(n.old) : n.old;
                const changed = stage >= 2 && (range[0] !== n.old[0] || range[1] !== n.old[1]);
                const showNew = changed && (n.kind === "after" || stage === 3 || n.kind === "edit");
                return (
                  <g key={n.id}>
                    <rect
                      x={n.x - w / 2}
                      y={n.y - 11}
                      width={w}
                      height={22}
                      rx={6}
                      fill={c.fill}
                      stroke={c.stroke}
                      strokeWidth={show ? 1.25 : 1}
                      strokeDasharray={stage === 2 && n.kind === "after" ? "4 3" : undefined}
                    />
                    <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize="12.5" className={show ? "fill-slate-900 font-mono font-bold" : "fill-foreground font-mono"}>
                      {label}
                    </text>
                    <text
                      x={n.x}
                      y={n.y + 24}
                      textAnchor="middle"
                      fontSize="11.5"
                      fontWeight={showNew ? 700 : 400}
                      className="font-mono"
                      fill={showNew || (stage === 1 && n.kind === "edit") ? "#d97706" : "#64748b"}
                    >
                      {fmt(showNew ? range : stage === 1 && n.kind === "edit" ? [EDIT_START, NEW_END] : n.old)}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        );
      }}
    />
  );
}

import SceneShell from "./SceneShell";

/**
 * 본문 대응: #weight·#head — W(n) = b(n) + Σ W(child). Leaf의 직접 balance가 ancestor로 올라오고,
 * bestDescendant가 아래에서 채워진 뒤 store.head가 J320의 cached descendant를 읽는다.
 * Slot 353: A353 b = 96, B353 b = 80 + 40 → W(J320) = 96 + 120 = 216, best = B353.
 * Slot 354: boost 제거 → B353 b = 80 → W(J320) = 96 + 80 = 176, best = A353.
 * 중간 node A352·B352와 J320·중간 node의 직접 balance 0은 설명용이다(가정: latest vote가 모두 leaf에 있음).
 * Leaf의 bestDescendant는 소스(updateBestDescendant)대로 nil이고, 부모가 child 자체를 적는다.
 */
type NodeId = "J320" | "A352" | "A353" | "B352" | "B353";

interface Cell {
  b: string;
  w: string;
  best: string;
}

interface WeightScene {
  label: string;
  summary: string;
  note: string;
  cells: Record<NodeId, Cell>;
  path: readonly NodeId[];
  head: string;
}

const Q = "?";

const SCENES: readonly WeightScene[] = [
  {
    label: "직접 balance",
    summary: "A353 96 · B353 80 + 40",
    note: "Slot 353에서 latest vote 반영과 boost가 끝난 직접 balance입니다. B353의 b에는 latest vote 80과 proposer score 40이 함께 들어 있습니다. 중간 node A352·B352, 그리고 J320과 중간 node의 직접 balance 0은 설명용입니다(가정).",
    cells: {
      J320: { b: "0", w: Q, best: Q },
      A352: { b: "0", w: Q, best: Q },
      A353: { b: "96", w: Q, best: Q },
      B352: { b: "0", w: Q, best: Q },
      B353: { b: "80+40", w: Q, best: Q },
    },
    path: [],
    head: "계산 전",
  },
  {
    label: "leaf부터 합산",
    summary: "W(leaf) = b(leaf)",
    note: "자식이 없는 leaf는 자기 직접 balance가 곧 subtree weight입니다. A353은 96, B353은 120입니다.",
    cells: {
      J320: { b: "0", w: Q, best: Q },
      A352: { b: "0", w: Q, best: Q },
      A353: { b: "96", w: "96", best: Q },
      B352: { b: "0", w: Q, best: Q },
      B353: { b: "80+40", w: "120", best: Q },
    },
    path: [],
    head: "계산 전",
  },
  {
    label: "위로 전파",
    summary: "W(J320) = 96 + 120 = 216",
    note: "각 node는 자기 직접 balance에 자식 weight를 더합니다. A352는 0+96=96, B352는 0+120=120, J320은 0+96+120=216입니다. B353에 들어간 boost 40이 B352와 J320의 weight에도 올라옵니다.",
    cells: {
      J320: { b: "0", w: "216", best: Q },
      A352: { b: "0", w: "96", best: Q },
      A353: { b: "96", w: "96", best: Q },
      B352: { b: "0", w: "120", best: Q },
      B353: { b: "80+40", w: "120", best: Q },
    },
    path: [],
    head: "계산 전",
  },
  {
    label: "bestDescendant 채움",
    summary: "J320: 120 > 96 → B353",
    note: "bestDescendant는 그 node 아래에서 따라갈 viable leaf를 미리 적어 둔 cache입니다. 같은 recursive update가 leaf부터 채웁니다. 자식이 없는 leaf는 nil로 두고, 부모는 고른 child의 best가 nil이면 그 child 자체를 적습니다. J320은 viable child의 weight 96과 120을 비교해 B 쪽 leaf B353을 적습니다.",
    cells: {
      J320: { b: "0", w: "216", best: "B353" },
      A352: { b: "0", w: "96", best: "A353" },
      A353: { b: "96", w: "96", best: "nil" },
      B352: { b: "0", w: "120", best: "B353" },
      B353: { b: "80+40", w: "120", best: "nil" },
    },
    path: ["J320", "B352", "B353"],
    head: "계산 전",
  },
  {
    label: "store.head",
    summary: "head = J320.best = B353",
    note: "Spec은 justified root에서 weight를 비교하며 아래로 내려가는 방식으로 표현합니다. Prysm v7.3.1의 store.head는 그 loop를 다시 돌지 않고 justified root J320에 적힌 bestDescendant B353을 읽습니다.",
    cells: {
      J320: { b: "0", w: "216", best: "B353" },
      A352: { b: "0", w: "96", best: "A353" },
      A353: { b: "96", w: "96", best: "nil" },
      B352: { b: "0", w: "120", best: "B353" },
      B353: { b: "80+40", w: "120", best: "nil" },
    },
    path: ["J320", "B352", "B353"],
    head: "B353",
  },
  {
    label: "slot 354",
    summary: "boost 제거 → 96 > 80 → A353",
    note: "NewSlot이 proposerBoostRoot를 비우고 다음 Head가 이전 40을 뺍니다. B353은 80, B352는 80, J320은 96+80=176이 되고 J320의 bestDescendant가 A353으로 바뀝니다. Retained tree 안의 head 변경이며 finality나 prune이 아닙니다.",
    cells: {
      J320: { b: "0", w: "176", best: "A353" },
      A352: { b: "0", w: "96", best: "A353" },
      A353: { b: "96", w: "96", best: "nil" },
      B352: { b: "0", w: "80", best: "B353" },
      B353: { b: "80", w: "80", best: "nil" },
    },
    path: ["J320", "A352", "A353"],
    head: "A353",
  },
];

const BOX_W = 128;
const BOX_H = 58;
const POS: Record<NodeId, { x: number; y: number }> = {
  J320: { x: 96, y: 4 },
  A352: { x: 4, y: 86 },
  A353: { x: 4, y: 168 },
  B352: { x: 188, y: 86 },
  B353: { x: 188, y: 168 },
};
const EDGES: readonly (readonly [NodeId, NodeId])[] = [
  ["J320", "A352"],
  ["J320", "B352"],
  ["A352", "A353"],
  ["B352", "B353"],
];

const ACCENT = "#2563eb";
const MUTED = "#64748b";
const LINE = "#94a3b8";
const TEXT = "#334155";

export default function SubtreeWeightViz() {
  return (
    <SceneShell
      eyebrow="Subtree weight · bestDescendant"
      title="Leaf의 balance가 위로 합쳐지고, J320에 적힌 best leaf가 head가 됩니다"
      description="상자 하나가 block node입니다. b는 직접 balance(latest vote와 임시 boost), W는 자식까지 합한 subtree weight, best는 그 node 아래에서 따라갈 leaf를 적어 둔 cache이고 leaf 자신은 nil입니다. 파란 테두리가 현재 head로 가는 경로입니다."
      note="Root 이름과 weight unit은 본문의 설명용 값입니다. 중간 node, 그리고 J320과 중간 node의 직접 balance 0은 그림을 위한 가정입니다."
      ariaLabel="J320 아래 A와 B 가지에서 subtree weight와 bestDescendant가 채워지는 여섯 장면"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const onPath = (id: NodeId) => scene.path.includes(id);
        return (
          <div className="min-w-0">
            <svg viewBox="0 0 320 230" className="mx-auto h-auto w-full max-w-[300px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              {EDGES.map(([a, b]) => (
                <line
                  key={`${a}-${b}`}
                  x1={POS[a].x + BOX_W / 2}
                  y1={POS[a].y + BOX_H}
                  x2={POS[b].x + BOX_W / 2}
                  y2={POS[b].y}
                  stroke={onPath(a) && onPath(b) ? ACCENT : LINE}
                  strokeWidth={onPath(a) && onPath(b) ? 1.25 : 1}
                />
              ))}
              {(Object.keys(POS) as NodeId[]).map((id) => {
                const cell = scene.cells[id];
                const { x, y } = POS[id];
                const lit = onPath(id);
                return (
                  <g key={id}>
                    <rect x={x} y={y} width={BOX_W} height={BOX_H} rx={8} fill="#ffffff" stroke={lit ? ACCENT : LINE} strokeWidth={lit ? 1.25 : 1} />
                    <text x={x + 10} y={y + 17} fontSize={14} fontWeight={700} fill={lit ? ACCENT : TEXT}>
                      {id}
                    </text>
                    <text x={x + 10} y={y + 35} fontSize={13} fill={MUTED}>
                      b {cell.b}
                    </text>
                    <text x={x + BOX_W - 10} y={y + 35} textAnchor="end" fontSize={13} fontWeight={700} fill={cell.w === Q ? MUTED : TEXT}>
                      W {cell.w}
                    </text>
                    <text x={x + 10} y={y + 52} fontSize={13} fill={cell.best === Q || cell.best === "nil" ? MUTED : ACCENT}>
                      best {cell.best}
                    </text>
                  </g>
                );
              })}
              <text x={316} textAnchor="end" fontSize={14} fontWeight={700} fill={scene.head === "계산 전" ? MUTED : ACCENT}>
                <tspan x={316} y={20}>store.head</tspan>
                <tspan x={316} y={40}>= {scene.head}</tspan>
              </text>
            </svg>
          </div>
        );
      }}
    />
  );
}

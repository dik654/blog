import SceneShell from "./SceneShell";

/**
 * 본문 대응: #pc2-artifact — ℓ_{k,v} = H(RID‖k‖v‖{ℓ_{k,p} : p ∈ DRG(v)}‖{ℓ_{k−1,p} : p ∈ Exp(v)}).
 * layer 3개 × node 8개, parent 배치는 모두 설명용 가정이다(실제 graph는 SDR spec이 정한다).
 * 가정한 base(DRG) parents(같은 layer): 3←1, 4←2, 5←1·3, 6←2·4, 7←5, 8←3·6.
 * 가정한 expander parents(이전 layer): 2←8, 3←4, 4←6, 5←2, 6←3·7, 7←1, 8←5. k=1에는 expander 항이 없다.
 * stale 장면: ℓ_{2,2}가 바뀌면 같은 layer에서 4·6·8, 다음 layer에서 2~8이 연쇄로 바뀐다.
 */
const LAYERS = 3;
const NODES = 8;
const BASE: Readonly<Record<number, readonly number[]>> = {
  1: [],
  2: [],
  3: [1],
  4: [2],
  5: [1, 3],
  6: [2, 4],
  7: [5],
  8: [3, 6],
};
const EXP: Readonly<Record<number, readonly number[]>> = {
  1: [],
  2: [8],
  3: [4],
  4: [6],
  5: [2],
  6: [3, 7],
  7: [1],
  8: [5],
};
const LEGEND: readonly (readonly [string, string])[] = [
  ["#2563eb", "계산할 label"],
  ["#dbeafe", "먼저 확정돼야 하는 입력"],
  ["#ffffff", "기다리는 label"],
  ["#dc2626", "stale label"],
  ["#fed7aa", "따라 바뀌는 label"],
];
const TARGET = { k: 2, v: 6 };
const STALE = { k: 2, v: 2 };

const ORDER = Array.from({ length: LAYERS * NODES }, (_, index) => ({
  k: Math.floor(index / NODES) + 1,
  v: (index % NODES) + 1,
}));
const keyOf = (k: number, v: number) => `${k},${v}`;
// base parents는 더 앞 node, expander parents는 이전 layer이므로 layer·node 순으로 한 번 훑으면 영향 범위가 닫힙니다.
const AFFECTED = ORDER.reduce<ReadonlySet<string>>((hit, { k, v }) => {
  if (k === STALE.k && v === STALE.v) return new Set([...hit, keyOf(k, v)]);
  const fromExp = k > 1 && (EXP[v] ?? []).some((p) => hit.has(keyOf(k - 1, p)));
  const fromBase = (BASE[v] ?? []).some((p) => hit.has(keyOf(k, p)));
  return fromExp || fromBase ? new Set([...hit, keyOf(k, v)]) : hit;
}, new Set<string>());

const W = 420;
const H = 236;
const LEFT = 40;
const RIGHT = 8;
const PITCH = (W - LEFT - RIGHT) / NODES;
const CELL_W = PITCH - 10;
const CELL_H = 30;
const rowTop = (k: number) => 44 + (k - 1) * 70;
const cx = (v: number) => LEFT + (v - 1) * PITCH + PITCH / 2;

const SCENES = [
  {
    label: "label 한 칸",
    summary: "ℓ(k=2, v=6)",
    note: "칸 하나가 label 하나이고 ℓ(k,v)로 부릅니다. 가로는 sector graph의 node v, 세로는 layer k입니다. 모든 label의 hash 입력에는 ReplicaID(RID)와 자기 위치 k·v가 들어가므로 RID가 다르면 모든 칸이 달라집니다.",
  },
  {
    label: "이전 layer의 expander parents",
    summary: "Exp(6) = {3, 7}(가정)",
    note: "첫 번째 의존은 expander rule이 정한 parent node들의 이전 layer label입니다. 여기서는 node 6의 expander parents를 3과 7로 두었습니다(가정). 바로 위 칸으로 정해진 것이 아니라 이전 layer의 어느 칸이든 될 수 있고, 더 뒤 node일 수도 있습니다. ℓ(1,3)·ℓ(1,7)이 확정되기 전에는 ℓ(2,6)을 계산할 수 없습니다.",
  },
  {
    label: "같은 layer의 base parents",
    summary: "DRG(6) = {2, 4}(가정)",
    note: "두 번째 의존은 DRG rule이 정한 base parent node들의 같은 layer label입니다. 여기서는 node 6의 base parents를 2와 4로 두었습니다(가정). 이 labels도 이미 확정돼 있어야 흡수할 수 있습니다.",
  },
  {
    label: "layer를 건너뛰지 못함",
    summary: "ℓ(3,4)는 ℓ(2,6)을 기다림",
    note: "같은 규칙이 layer 3에도 적용됩니다. node 4가 6을 expander parent로 둔다면(가정) ℓ(3,4)는 ℓ(2,6)이 나와야 시작됩니다. 그래서 label 계산은 서로 독립인 hash 목록을 한꺼번에 병렬로 돌리는 일이 아닙니다.",
  },
  {
    label: "parent 하나가 stale이면",
    summary: "ℓ(2,2) 하나 → 10칸이 따라 바뀜",
    note: "ℓ(2,2) 하나가 stale(이전 값)이면 이것을 base parent로 쓰는 ℓ(2,4)·ℓ(2,6), 다시 그것을 쓰는 ℓ(2,8)이 달라집니다. 다음 layer(k=3)에서는 이 칸들을 expander parent로 읽는 node와 그 base 후손까지 번져, 가정한 graph 기준 ℓ(3,2)~ℓ(3,8)이 모두 바뀝니다(총 10칸). 이 labels로 만드는 commitment도 바뀝니다.",
  },
] as const;

function Arc({ from, to, k }: { from: number; to: number; k: number }) {
  const top = rowTop(k);
  const x1 = cx(from);
  const x2 = cx(to) - 6;
  const peak = top - 26 - (to - from) * 2;
  return (
    <path
      d={`M ${x1} ${top} Q ${(x1 + x2) / 2} ${peak} ${x2} ${top - 2}`}
      fill="none"
      stroke="#2563eb"
      strokeWidth={1.25}
      markerEnd="url(#label-dep-arrow)"
    />
  );
}

export default function LabelDependencyViz() {
  return (
    <SceneShell
      eyebrow="SDR label 의존"
      title="label 한 칸은 이전 layer의 expander parent 칸과 같은 줄의 base parent 칸이 정해진 뒤에야 계산됩니다"
      description="layer 3개·node 8개로 줄인 그림이고, 어느 node가 parent인지도 설명용 가정입니다. 실제 graph와 parent 순서는 pinned SDR specification을 따릅니다."
      ariaLabel="SDR label이 이전 layer의 expander parent label과 같은 layer의 base parent label에 의존하는 구조와 stale parent의 연쇄 영향"
      scenes={SCENES}
      render={(active) => {
        const cascade = active === 4;
        const parents = BASE[TARGET.v] ?? [];
        const expParents = EXP[TARGET.v] ?? [];
        const waiter = 4; // 가정한 EXP에서 node 6을 expander parent로 두는 node
        const role = (k: number, v: number): "target" | "input" | "waiting" | "stale" | "affected" | "plain" => {
          if (cascade) {
            if (k === STALE.k && v === STALE.v) return "stale";
            return AFFECTED.has(keyOf(k, v)) ? "affected" : "plain";
          }
          if (k === TARGET.k && v === TARGET.v) return "target";
          if (active >= 1 && k === TARGET.k - 1 && expParents.includes(v)) return "input";
          if (active >= 2 && k === TARGET.k && parents.includes(v)) return "input";
          if (active === 3 && k === TARGET.k + 1 && v === waiter) return "waiting";
          return "plain";
        };
        const style = {
          target: { fill: "#2563eb", stroke: "#2563eb", text: "#ffffff" },
          input: { fill: "#dbeafe", stroke: "#2563eb", text: "#1e3a8a" },
          waiting: { fill: "#ffffff", stroke: "#64748b", text: "#475569" },
          stale: { fill: "#dc2626", stroke: "#dc2626", text: "#ffffff" },
          affected: { fill: "#fed7aa", stroke: "#c2410c", text: "#7c2d12" },
          plain: { fill: "#f1f5f9", stroke: "#cbd5e1", text: "#64748b" },
        } as const;
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[440px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
              <defs>
                <marker id="label-dep-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
                  <path d="M0 0 L8 4 L0 8 Z" fill="#2563eb" />
                </marker>
              </defs>
              {Array.from({ length: NODES }, (_, index) => (
                <text key={index} x={cx(index + 1)} y={16} textAnchor="middle" fontSize={11} fill="#64748b">
                  v={index + 1}
                </text>
              ))}
              {Array.from({ length: LAYERS }, (_, index) => (
                <text key={index} x={8} y={rowTop(index + 1) + CELL_H / 2 + 4} fontSize={12} fontWeight={700} fill="#475569">
                  k={index + 1}
                </text>
              ))}
              {ORDER.map(({ k, v }) => {
                const look = style[role(k, v)];
                return (
                  <g key={keyOf(k, v)}>
                    <rect
                      x={cx(v) - CELL_W / 2}
                      y={rowTop(k)}
                      width={CELL_W}
                      height={CELL_H}
                      rx={4}
                      fill={look.fill}
                      stroke={look.stroke}
                      strokeWidth={1}
                      strokeDasharray={role(k, v) === "waiting" ? "3 3" : undefined}
                    />
                    <text x={cx(v)} y={rowTop(k) + CELL_H / 2 + 4} textAnchor="middle" fontSize={12} fontWeight={700} fill={look.text}>
                      {k},{v}
                    </text>
                  </g>
                );
              })}
              {!cascade && active >= 1 &&
                expParents.map((p) => (
                  <line
                    key={p}
                    x1={cx(p)}
                    x2={cx(TARGET.v) + (p < TARGET.v ? -4 : 8)}
                    y1={rowTop(TARGET.k - 1) + CELL_H}
                    y2={rowTop(TARGET.k) - 3}
                    stroke="#2563eb"
                    strokeWidth={1.25}
                    markerEnd="url(#label-dep-arrow)"
                  />
                ))}
              {!cascade && active >= 2 && parents.map((p) => <Arc key={p} from={p} to={TARGET.v} k={TARGET.k} />)}
              {active === 3 && (
                <line
                  x1={cx(TARGET.v)}
                  x2={cx(waiter)}
                  y1={rowTop(TARGET.k) + CELL_H}
                  y2={rowTop(TARGET.k + 1) - 3}
                  stroke="#64748b"
                  strokeWidth={1}
                  strokeDasharray="3 3"
                  markerEnd="url(#label-dep-arrow)"
                />
              )}
            </svg>
            <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              {(cascade ? LEGEND.slice(3) : LEGEND.slice(0, active === 0 ? 1 : active === 3 ? 3 : 2)).map(([color, name]) => (
                <li key={name} className="flex items-center gap-1.5">
                  <span className="inline-block h-3 w-3 rounded-sm border border-[#cbd5e1]" style={{ backgroundColor: color }} aria-hidden="true" />
                  {name}
                </li>
              ))}
            </ul>
          </div>
        );
      }}
    />
  );
}

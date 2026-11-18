import BplusSceneShell from "../../bplus-tree/viz/BplusSceneShell";

/**
 * 본문 대응: #experiment 01·02·03 — empty·root-only, capacity−1·capacity·capacity+1 경계 입력과
 * root growth, 각 단계의 point·missing·range 대조.
 * capacity 4와 key 10·20·30·40·25는 설명용 가정(B+ tree 개념 글의 분할 예와 같은 값).
 * 다섯 항목 [10,20,25,30,40] → [10,20] + [25,30,40], 새 root 경계 25.
 */
const W = 360;
const H = 214;
const CAP = 4;
const CELL = 26;
const LEAF_W = CAP * CELL;
const LEAF_Y = 82;
const LEAF_H = 28;
const ROOT = { x: 150, y: 28, w: 60, h: 26 };
const SINGLE_X = (W - LEAF_W) / 2;
const SPLIT_XS = [52, W - 52 - LEAF_W] as const;

const GRAY = "#94a3b8";
const INK = "#475569";
const MUTED = "#64748b";
const BLUE = "#2563eb";
const RED = "#b91c1c";

interface BoundaryState {
  keys: readonly number[];
  leaves: readonly (readonly number[])[];
  caption: string;
  point: string;
  range: string;
  graph: string;
  tone: "plain" | "full" | "over" | "split";
}

const STATES: readonly BoundaryState[] = [
  { keys: [], leaves: [[]], caption: "key 0개 · 비어 있음", point: "모든 조회 → 없음", range: "빈 결과", graph: "root-only page 1장", tone: "plain" },
  { keys: [10, 20, 30], leaves: [[10, 20, 30]], caption: "3개 · 자리 1개 남음", point: "3개 있음 · 그 밖은 없음", range: "oracle과 같은 순서", graph: "root-only page 1장", tone: "plain" },
  { keys: [10, 20, 30, 40], leaves: [[10, 20, 30, 40]], caption: "4개 · 가득 참, 분할 없음", point: "4개 있음 · 그 밖은 없음", range: "oracle과 같은 순서", graph: "root-only page 1장", tone: "full" },
  { keys: [10, 20, 25, 30, 40], leaves: [[10, 20, 25, 30, 40]], caption: "5개 · 용량 초과", point: "—", range: "—", graph: "한 page에 담을 수 없음", tone: "over" },
  { keys: [10, 20, 25, 30, 40], leaves: [[10, 20], [25, 30, 40]], caption: "", point: "5개 있음 · 그 밖은 없음", range: "두 leaf에 걸쳐 같은 순서", graph: "root에서 두 leaf 도달 · 같은 깊이", tone: "split" },
];

const SCENES = [
  { label: "empty", summary: "key 0개", note: "아무 key도 없는 상태에서 시작합니다. 이때 oracle도 비어 있으므로 모든 point 조회는 없음, 모든 range는 빈 결과로 일치해야 합니다." },
  { label: "capacity − 1", summary: "key 3개 · 자리 1개 남음", note: "Capacity는 page 하나가 담는 최대 key 수이며, 여기서는 4로 가정합니다. 3개는 root 하나뿐인 leaf에 자리가 하나 남은 상태입니다." },
  { label: "capacity", summary: "key 4개 · 분할 없음", note: "정확히 4개로 가득 찼지만 아직 넘치지 않았으므로 page graph는 그대로입니다. 구조가 바뀌기 직전의 마지막 상태입니다." },
  { label: "capacity + 1", summary: "25 삽입 → 다섯 항목", note: "25를 더하면 정렬된 다섯 항목이 되어 한 page에 들어가지 않습니다. Capacity + 1은 page graph가 처음 바뀌는 입력입니다." },
  { label: "분할과 root growth", summary: "leaf 2장 + 새 root · 경로 1장 → 2장", note: "Leaf를 [10,20]과 [25,30,40]으로 나누고 그 위에 경계 25를 가진 새 root를 만듭니다. Tree가 한 층 높아지는 이 변화가 root growth입니다. 이제 key·range 대조에 더해 root에서 두 leaf가 모두 도달되는지, separator·leaf 순서와 깊이가 맞는지 확인합니다." },
] as const;

function Leaf({ x, values, tone }: { x: number; values: readonly number[]; tone: BoundaryState["tone"] }) {
  const cells = Math.max(values.length, CAP);
  return (
    <g>
      {Array.from({ length: cells }, (_, cell) => {
        const over = cell >= CAP;
        const stroke = over ? RED : tone === "split" ? BLUE : tone === "full" ? INK : GRAY;
        return (
          <rect
            key={cell}
            x={x + cell * CELL}
            y={LEAF_Y}
            width={CELL - 2}
            height={LEAF_H}
            fill="none"
            stroke={stroke}
            strokeWidth={over || tone === "split" ? 1.25 : 1}
            strokeDasharray={values.length === 0 ? "3 3" : undefined}
          />
        );
      })}
      {values.map((value, cell) => (
        <text key={value} x={x + cell * CELL + (CELL - 2) / 2} y={LEAF_Y + 19} fontSize={13} fontWeight={700} fill={cell >= CAP || value === 25 ? (cell >= CAP ? RED : BLUE) : INK} textAnchor="middle" fontFamily="monospace">
          {value}
        </text>
      ))}
    </g>
  );
}

export default function BplusBoundaryInputViz() {
  return (
    <BplusSceneShell
      eyebrow="경계 입력"
      title="key 수가 capacity를 하나 넘는 순간 page graph가 바뀝니다"
      description="칸 넷이 page 하나의 capacity입니다. Capacity 4와 key 값은 설명용 가정이며, 아래 세 줄은 각 단계에서 oracle과 대조할 내용입니다."
      ariaLabel="빈 상태, capacity보다 하나 적을 때, 같을 때, 하나 많을 때 page graph와 대조 항목이 어떻게 바뀌는지"
      scenes={SCENES}
      render={(active) => {
        const state = STATES[active];
        const split = state.leaves.length === 2;
        const rootCenter = ROOT.x + ROOT.w / 2;
        const rows: readonly (readonly [string, string])[] = [
          ["point·missing", state.point],
          ["range", state.range],
          ["page graph", state.graph],
        ];
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[460px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={8} y={14} fontSize={12} fill={MUTED}>oracle</text>
            <text x={52} y={14} fontSize={12} fontWeight={700} fill={INK} fontFamily="monospace">[{state.keys.join(", ")}]</text>
            <text x={W - 8} y={14} fontSize={12} fill={split ? BLUE : MUTED} textAnchor="end">root → leaf: page {split ? 2 : 1}장</text>

            {split ? (
              <>
                <rect x={ROOT.x} y={ROOT.y} width={ROOT.w} height={ROOT.h} rx={3} fill="none" stroke={BLUE} strokeWidth={1.25} />
                <text x={rootCenter} y={ROOT.y + 18} fontSize={13} fontWeight={700} fill={BLUE} textAnchor="middle" fontFamily="monospace">25</text>
                <text x={ROOT.x + ROOT.w + 6} y={ROOT.y + 17} fontSize={12} fill={BLUE}>새 root</text>
                {SPLIT_XS.map((x) => (
                  <line key={x} x1={rootCenter} y1={ROOT.y + ROOT.h} x2={x + LEAF_W / 2} y2={LEAF_Y} stroke={GRAY} strokeWidth={1} />
                ))}
                {SPLIT_XS.map((x, index) => (
                  <Leaf key={x} x={x} values={state.leaves[index]} tone="split" />
                ))}
              </>
            ) : (
              <>
                <text x={SINGLE_X} y={LEAF_Y - 8} fontSize={12} fill={MUTED}>root-only leaf</text>
                <Leaf x={SINGLE_X} values={state.leaves[0]} tone={state.tone} />
                <text x={W / 2} y={LEAF_Y + LEAF_H + 16} fontSize={12} fontWeight={700} fill={state.tone === "over" ? RED : INK} textAnchor="middle">{state.caption}</text>
              </>
            )}

            {rows.map(([name, value], index) => {
              const y = 152 + index * 22;
              return (
                <g key={name}>
                  <line x1={8} x2={W - 8} y1={y - 14} y2={y - 14} stroke={GRAY} strokeWidth={1} opacity={0.5} />
                  <text x={8} y={y} fontSize={12} fill={MUTED}>{name}</text>
                  <text x={98} y={y} fontSize={12} fontWeight={700} fill={state.tone === "over" ? MUTED : INK}>{value}</text>
                </g>
              );
            })}
          </svg>
        );
      }}
    />
  );
}

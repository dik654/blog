import GroupSceneShell from "./GroupSceneShell";

/**
 * 본문 대응: #small-case·#inside-groups·#disjoint — A·B·C·D에게 2·2·3·1개 기록(가정).
 * 올바른 분할: 학습 A·B 4행, 평가 C·D 4행 → 대상 교집합 ∅.
 * C 한 행을 학습으로 옮기면: 학습 5행 {A,B,C}, 평가 3행 {C,D} → 교집합 {C}.
 */
type Row = { id: string; entity: string };

const ROWS: readonly Row[] = [
  { id: "r1", entity: "A" },
  { id: "r2", entity: "A" },
  { id: "r3", entity: "B" },
  { id: "r4", entity: "B" },
  { id: "r5", entity: "C" },
  { id: "r6", entity: "C" },
  { id: "r7", entity: "C" },
  { id: "r8", entity: "D" },
];

const COLOR: Record<string, string> = { A: "#2563eb", B: "#0891b2", C: "#d97706", D: "#7c3aed" };

type Split = { train: readonly string[]; valid: readonly string[] } | null;

const SPLITS: readonly Split[] = [
  null,
  { train: ["r1", "r2", "r3", "r4"], valid: ["r5", "r6", "r7", "r8"] },
  { train: ["r1", "r2", "r3", "r4", "r5"], valid: ["r6", "r7", "r8"] },
];

const SCENES = [
  {
    label: "기록 8행, 대상 4명",
    summary: "A·B·C·D = 2·2·3·1행",
    note: "칸 하나가 기록 한 행입니다. 큰 글자는 그 행을 만든 대상의 식별자, 작은 r번호는 행마다 다른 행 식별자입니다. 행 식별자로는 A의 첫 기록과 두 번째 기록을 구별하고, 대상 식별자로는 두 기록을 함께 움직입니다.",
  },
  {
    label: "대상 단위로 통째로 옮김",
    summary: "{A,B} ∩ {C,D} = ∅",
    note: "분할은 대상 식별자로 합니다. A·B의 4행이 학습, C·D의 4행이 평가에 들어가고 C의 세 기록은 모두 평가 쪽에 있습니다. 두 쪽 대상 집합의 교집합이 비어 있으므로 겹침 검사를 통과합니다.",
  },
  {
    label: "C 한 행만 학습으로 옮기면",
    summary: "{A,B,C} ∩ {C,D} = {C}",
    note: "행 수는 5와 3으로 여전히 그럴듯하지만 C가 학습과 평가 양쪽에 나타납니다. 평가 쪽 C의 두 기록은 더 이상 처음 보는 대상의 기록이 아니므로 이 분할은 거부됩니다.",
  },
] as const;

const CELL = 32;
const BOX_Y = 78;
const BOX_W = 168;
const TRAIN_X = 8;
const VALID_X = 184;

function cellPos(rowId: string, split: Split): { x: number; y: number } {
  const index = ROWS.findIndex((row) => row.id === rowId);
  if (split === null) return { x: 14 + index * 42, y: 26 };
  const inTrain = split.train.indexOf(rowId);
  const slot = inTrain >= 0 ? inTrain : split.valid.indexOf(rowId);
  const boxX = inTrain >= 0 ? TRAIN_X : VALID_X;
  return { x: boxX + 10 + (slot % 4) * 38, y: BOX_Y + 24 + Math.floor(slot / 4) * 36 };
}

function entitySet(ids: readonly string[]): string[] {
  return Array.from(new Set(ids.map((id) => ROWS.find((row) => row.id === id)?.entity ?? "")));
}

export default function GroupSplitViz() {
  return (
    <GroupSceneShell
      eyebrow="대상 단위 분할"
      title="같은 대상의 기록은 한쪽으로 함께 옮깁니다"
      description="3절의 작은 예(가정)입니다. A·B·C·D에게 각각 2·2·3·1개 기록이 있고, 처음 보는 대상에게 쓸 시스템을 평가한다고 둡니다. 실제 의료 성능 자료가 아닙니다."
      ariaLabel="기록 8행을 대상 단위로 학습과 평가에 나누고, C 한 행을 옮겼을 때 교집합이 C가 되는 과정"
      scenes={SCENES}
      render={(active) => {
        const split = SPLITS[active];
        const trainSet = split ? entitySet(split.train) : [];
        const validSet = split ? entitySet(split.valid) : [];
        const leaked = trainSet.filter((entity) => validSet.includes(entity));
        return (
          <svg viewBox="0 0 360 206" className="mx-auto block h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={14} y={18} fontSize={11} fill="#64748b">
              {split === null ? "아직 나누지 않은 기록" : "대상 식별자를 기준으로 옮김"}
            </text>
            {[
              { x: TRAIN_X, name: "학습", ids: split?.train ?? [], set: trainSet },
              { x: VALID_X, name: "평가", ids: split?.valid ?? [], set: validSet },
            ].map((box) => (
              <g key={box.name}>
                <rect x={box.x} y={BOX_Y} width={BOX_W} height={100} rx={8} fill="none" stroke="#94a3b8" strokeWidth={1} />
                <text x={box.x + 10} y={BOX_Y + 16} fontSize={11} fontWeight={700} fill="#64748b">
                  {box.name}
                </text>
                <text x={box.x + BOX_W - 10} y={BOX_Y + 16} fontSize={11} textAnchor="end" fill="#64748b">
                  {split === null ? "비어 있음" : `${box.ids.length}행`}
                </text>
                <text x={box.x + BOX_W / 2} y={198} fontSize={12} textAnchor="middle" fill="#64748b">
                  {split === null ? "대상 —" : "대상 {"}
                  {box.set.map((entity, index) => (
                    <tspan key={entity} fill={leaked.includes(entity) ? "#dc2626" : "#64748b"} fontWeight={leaked.includes(entity) ? 700 : 400}>
                      {index > 0 ? ", " : ""}
                      {entity}
                    </tspan>
                  ))}
                  {split === null ? "" : "}"}
                </text>
              </g>
            ))}
            {ROWS.map((row) => {
              const pos = cellPos(row.id, split);
              const isLeak = leaked.includes(row.entity);
              return (
                <g
                  key={row.id}
                  style={{ transform: `translate(${pos.x}px, ${pos.y}px)`, transition: "transform 400ms ease" }}
                  className="motion-reduce:!transition-none"
                >
                  <rect
                    width={CELL}
                    height={CELL}
                    rx={5}
                    fill={COLOR[row.entity]}
                    fillOpacity={0.12}
                    stroke={isLeak ? "#dc2626" : COLOR[row.entity]}
                    strokeWidth={isLeak ? 1.25 : 1}
                    strokeDasharray={isLeak ? "3 2" : undefined}
                  />
                  <text x={CELL / 2} y={15} textAnchor="middle" fontSize={13} fontWeight={700} fill={COLOR[row.entity]}>
                    {row.entity}
                  </text>
                  <text x={CELL / 2} y={27} textAnchor="middle" fontSize={10} fill="#64748b">
                    {row.id}
                  </text>
                </g>
              );
            })}
          </svg>
        );
      }}
    />
  );
}

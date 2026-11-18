import SceneShell from "./SceneShell";

/**
 * 본문 대응: #pool-inclusion "포함 관계와 겹치는 bit를 구분한다" + tryMerge(Disjoint → Or).
 * 같은 AttestationData에서 A={1,4,7}, C={1,4}, B={4,8}은 글의 예시. D={8}은 겹치지 않는 경우를 보이려는 가정.
 */
const POSITIONS = [1, 2, 3, 4, 5, 6, 7, 8] as const;
const W = 360;
const H = 176;
const LABEL_W = 92;
const CELL = 31;
const X0 = LABEL_W;
const ROW_YS = [34, 76, 128] as const;

type Row = { name: string; bits: readonly number[] };

const SCENES: readonly {
  label: string;
  summary: string;
  first: Row;
  second: Row;
  result: Row | null;
  resultName: string;
  overlap: readonly number[];
  note: string;
}[] = [
  {
    label: "포함 관계",
    summary: "A ⊇ C → C는 따로 남길 필요 없음",
    first: { name: "A", bits: [1, 4, 7] },
    second: { name: "C", bits: [1, 4] },
    result: { name: "A", bits: [1, 4, 7] },
    resultName: "남길 후보",
    overlap: [],
    note: "C가 켠 1과 4는 A에도 모두 켜져 있습니다. A가 C를 subsume하므로 C는 별도 block 후보로 남길 필요가 없습니다.",
  },
  {
    label: "겹치는 bit",
    summary: "A ∩ B = {4} → merge 안 함",
    first: { name: "A", bits: [1, 4, 7] },
    second: { name: "B", bits: [4, 8] },
    result: null,
    resultName: "합친다면",
    overlap: [4],
    note: "B는 A에 없는 participant 8을 담지만 4가 겹칩니다. 두 aggregate signature를 그대로 더하면 4의 서명이 두 번 계산됩니다. Disjoint한 원본 vote로 재구성할 수 없다면 merge하지 않습니다.",
  },
  {
    label: "겹치지 않음",
    summary: "A ∪ D = {1,4,7,8} · 서명도 합침",
    first: { name: "A", bits: [1, 4, 7] },
    second: { name: "D (가정)", bits: [8] },
    result: { name: "A∪D", bits: [1, 4, 7, 8] },
    resultName: "병합 결과",
    overlap: [],
    note: "같은 AttestationData이고 켜진 bit가 하나도 겹치지 않으면(Disjoint) tryMerge가 bitlist를 OR로 합치고 BLS signature도 합칩니다. 참여자 8이 새로 덮였습니다. D는 이 경우를 보이려는 가정입니다.",
  },
];

function BitRow({ row, y, color, overlap, label }: { row: Row | null; y: number; color: string; overlap: readonly number[]; label: string }) {
  return (
    <g>
      <text x={4} y={y + 14} fontSize={10.5} fontWeight={700} fill="#475569">
        {label}
      </text>
      {POSITIONS.map((pos, i) => {
        const on = row ? row.bits.includes(pos) : false;
        const clash = overlap.includes(pos);
        const stroke = clash ? "#dc2626" : on ? color : "#94a3b8";
        return (
          <g key={pos}>
            <rect x={X0 + i * CELL + 2} y={y} width={CELL - 4} height={20} rx={3} fill={on ? stroke : "none"} fillOpacity={on ? 0.85 : 0} stroke={stroke} strokeWidth={1} strokeOpacity={on || clash ? 1 : 0.6} />
            {on && (
              <text x={X0 + i * CELL + CELL / 2} y={y + 14} textAnchor="middle" fontSize={10} fontWeight={700} fill="#ffffff">
                1
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
}

export default function BitsMergeViz() {
  return (
    <SceneShell
      eyebrow="Participation bits · 같은 AttestationData"
      title="두 aggregate를 합칠 수 있는지는 켜진 bit가 겹치는지로 갈립니다"
      description="칸 하나가 committee 안의 참여자 위치 하나입니다. 칠한 칸은 그 aggregate에 서명이 들어 있는 참여자입니다."
      note="A·B·C의 bit는 본문 예시이고, D는 겹치지 않는 경우를 보이려는 가정입니다."
      ariaLabel="Participation bit 포함, 겹침, 서로소 병합 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {POSITIONS.map((pos, i) => (
              <text key={pos} x={X0 + i * CELL + CELL / 2} y={22} textAnchor="middle" fontSize={10} fill="#64748b">
                {pos}
              </text>
            ))}
            <text x={4} y={22} fontSize={10.5} fill="#64748b">위치</text>
            <BitRow row={scene.first} y={ROW_YS[0]} color="#2563eb" overlap={scene.overlap} label={scene.first.name} />
            <BitRow row={scene.second} y={ROW_YS[1]} color="#2563eb" overlap={scene.overlap} label={scene.second.name} />
            <line x1={X0} x2={X0 + POSITIONS.length * CELL} y1={112} y2={112} stroke="#94a3b8" strokeWidth={1} />
            {scene.result ? (
              <BitRow row={scene.result} y={ROW_YS[2]} color="#16a34a" overlap={[]} label={scene.resultName} />
            ) : (
              <g>
                <text x={4} y={ROW_YS[2] + 14} fontSize={10.5} fontWeight={700} fill="#475569">
                  {scene.resultName}
                </text>
                <text x={X0 + 4} y={ROW_YS[2] + 14} fontSize={10.5} fontWeight={700} fill="#dc2626">
                  4의 서명이 두 번 계산됨 → 합치지 않음
                </text>
              </g>
            )}
            <text x={4} y={H - 6} fontSize={10.5} fill="#64748b">
              {active === 0 ? "C의 칸은 모두 A 안에 있음" : active === 1 ? "빨간 칸 = 두 쪽에 모두 켜진 bit" : "Disjoint 확인 → OR + 서명 합침"}
            </text>
          </svg>
        );
      }}
    />
  );
}

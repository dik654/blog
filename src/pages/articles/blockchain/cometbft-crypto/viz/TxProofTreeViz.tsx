import CryptoSceneShell from "./CryptoSceneShell";

/**
 * 본문 대응: #merkle — 세 transaction을 입력 순서대로 [T1,T2]와 [T3]로 나눈 tree에서
 * T1 proof(index 0 · total 3 · aunts [L2, L3])가 D41을 복원하는 길.
 * Hash 값은 본문 식과 첫 Viz의 축약값을 그대로 씁니다.
 */

type NodeId = "D41" | "P12" | "L1" | "L2" | "L3" | "H1" | "H2" | "H3" | "T1" | "T2" | "T3";

const NODES: Record<NodeId, { x: number; y: number; name: string; value: string }> = {
  D41: { x: 210, y: 14, name: "D41 = DataHash", value: "8b7610…f65f" },
  P12: { x: 110, y: 74, name: "P12", value: "f26d10…5cf5" },
  L1: { x: 56, y: 134, name: "L1 leaf", value: "642302…60e2" },
  L2: { x: 164, y: 134, name: "L2 leaf", value: "11920b…cde7" },
  L3: { x: 296, y: 134, name: "L3 leaf", value: "9a81e6…6f8d" },
  H1: { x: 56, y: 190, name: "H1", value: "5c41bd…4a06" },
  H2: { x: 164, y: 190, name: "H2", value: "TxHash" },
  H3: { x: 296, y: 190, name: "H3", value: "TxHash" },
  T1: { x: 56, y: 246, name: "T1", value: "alice>bob:10" },
  T2: { x: 164, y: 246, name: "T2", value: "carol>dave:5" },
  T3: { x: 296, y: 246, name: "T3", value: "erin>frank:7" },
};

const EDGES: readonly (readonly [NodeId, NodeId])[] = [
  ["D41", "P12"],
  ["D41", "L3"],
  ["P12", "L1"],
  ["P12", "L2"],
  ["L1", "H1"],
  ["L2", "H2"],
  ["L3", "H3"],
  ["H1", "T1"],
  ["H2", "T2"],
  ["H3", "T3"],
];

const W = 96;
const H = 34;
const ACCENT = "#2563eb";
const MUTED = "#94a3b8";
const WARN = "#dc2626";

const SCENES: readonly {
  label: string;
  summary: string;
  note: string;
  active: readonly NodeId[];
  aunt: readonly NodeId[];
  mismatch?: boolean;
  split?: boolean;
}[] = [
  {
    label: "세 개를 입력 순서대로 나눕니다",
    summary: "[T1,T2] | [T3]",
    note: "정렬하지 않고 total 3보다 작은 가장 큰 2의 거듭제곱인 2에서 자릅니다. 앞 두 개가 왼쪽 subtree가 되고 T3 하나가 오른쪽에 남으므로 tree는 좌우 높이가 다릅니다.",
    active: ["P12", "L1", "L2", "L3", "H1", "H2", "H3", "T1", "T2", "T3"],
    aunt: [],
    split: true,
  },
  {
    label: "T1은 두 번 해시된 뒤 leaf가 됩니다",
    summary: "T1 → H1 → L1",
    note: "H1 = SHA256(T1)이고 L1 = SHA256(0x00 || H1)입니다. Proof를 받은 쪽도 전달받은 leaf hash를 믿지 않고 T1 bytes에서 이 두 단계를 다시 계산합니다.",
    active: ["T1", "H1", "L1"],
    aunt: [],
  },
  {
    label: "첫 aunt L2와 묶어 P12를 만듭니다",
    summary: "0x01 || L1 || L2",
    note: "Aunt는 올라가는 길 옆에 붙은 sibling hash입니다. Index 0인 T1은 [T1,T2] 안에서 왼쪽이므로 L1을 왼쪽, 첫 aunt L2를 오른쪽에 놓고 해시해 P12를 얻습니다.",
    active: ["L1", "P12"],
    aunt: ["L2"],
  },
  {
    label: "둘째 aunt L3와 묶어 D41에 닿습니다",
    summary: "0x01 || P12 || L3 = D41",
    note: "Total 3에서 T1은 앞쪽 [T1,T2]에 속하므로 P12가 왼쪽, 둘째 aunt L3가 오른쪽입니다. 복원한 값이 Header.DataHash D41과 같으면 T1 포함을 확인합니다. 그래서 aunts 순서가 L2, L3입니다.",
    active: ["P12", "D41"],
    aunt: ["L3"],
  },
  {
    label: "좌우가 바뀌면 같은 hash로도 실패합니다",
    summary: "0x01 || L2 || L1 ≠ P12",
    note: "Index·Total이 맞지 않아 L1과 L2의 좌우가 바뀌면 같은 두 hash를 넣어도 P12와 다른 값이 나옵니다. 그 위에서 L3와 묶어도 D41을 복원하지 못합니다.",
    active: ["L1"],
    aunt: ["L2"],
    mismatch: true,
  },
];

function TreeScene({ index }: { index: number }) {
  const scene = SCENES[index];
  const isOn = (id: NodeId) => scene.active.includes(id) || scene.aunt.includes(id);
  return (
    <svg viewBox="0 0 360 306" role="img" aria-label={scene.label} className="block h-auto w-full max-w-[21rem]">
      {scene.split ? (
        <g>
          <rect x={2} y={126} width={216} height={180} rx={10} fill="none" stroke={ACCENT} strokeWidth={1} strokeDasharray="5 4" />
          <rect x={242} y={126} width={108} height={180} rx={10} fill="none" stroke={ACCENT} strokeWidth={1} strokeDasharray="5 4" />
          <text x={110} y={298} textAnchor="middle" className="fill-primary text-[11px] font-bold">앞 2개 → 왼쪽 P12</text>
          <text x={296} y={298} textAnchor="middle" className="fill-primary text-[11px] font-bold">뒤 1개 → 오른쪽</text>
        </g>
      ) : null}
      {EDGES.map(([from, to]) => {
        const a = NODES[from];
        const b = NODES[to];
        const on = isOn(from) && isOn(to);
        const broken = scene.mismatch && from === "P12";
        return (
          <line
            key={`${from}-${to}`}
            x1={a.x}
            y1={a.y + H}
            x2={b.x}
            y2={b.y}
            stroke={broken ? WARN : on ? ACCENT : MUTED}
            strokeWidth={on ? 1.25 : 1}
            strokeDasharray={broken ? "4 3" : undefined}
            opacity={on || broken ? 1 : 0.45}
          />
        );
      })}
      {(Object.keys(NODES) as NodeId[]).map((id) => {
        const node = NODES[id];
        const isAunt = scene.aunt.includes(id);
        const isPath = scene.active.includes(id);
        const isBroken = scene.mismatch && id === "P12";
        const stroke = isBroken ? WARN : isAunt || isPath ? ACCENT : MUTED;
        const name = isBroken ? "≠ P12" : isAunt ? `${node.name} · aunt` : node.name;
        const value = isBroken ? "2656bd…eecf" : node.value;
        return (
          <g key={id} opacity={isPath || isAunt || isBroken ? 1 : 0.45}>
            <rect
              x={node.x - W / 2}
              y={node.y}
              width={W}
              height={H}
              rx={8}
              className="fill-background"
              stroke={stroke}
              strokeWidth={isPath || isAunt || isBroken ? 1.25 : 1}
              strokeDasharray={isAunt ? "4 3" : undefined}
            />
            <text x={node.x} y={node.y + 14} textAnchor="middle" className="fill-foreground text-[11px] font-bold">
              {name}
            </text>
            <text x={node.x} y={node.y + 27} textAnchor="middle" className="fill-muted-foreground font-mono text-[9.5px]">
              {value}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function TxProofTreeViz() {
  return (
    <CryptoSceneShell
      eyebrow="T1 proof · index 0 · total 3"
      title="세 transaction tree에서 T1 proof가 올라가는 길"
      description="아래에서 위로 T1 bytes → TxHash → leaf → D41입니다. 진한 실선 칸은 그 장면에서 나누거나 계산하는 칸, 점선 칸 aunt는 proof에 실려 오는 옆 가지 hash입니다."
      note="Hash 값은 SHA-256 결과의 앞 6자리·뒤 4자리 축약값입니다. 마지막 장면의 2656bd…eecf는 SHA256(0x01 || L2 || L1)을 같은 fixture로 계산한 값입니다."
      ariaLabel="T1, T2, T3 Merkle tree에서 T1 proof가 aunt L2, L3로 D41을 복원하는 다섯 장면"
      scenes={SCENES}
      render={(index) => (
        <div className="flex justify-center">
          <TreeScene index={index} />
        </div>
      )}
    />
  );
}

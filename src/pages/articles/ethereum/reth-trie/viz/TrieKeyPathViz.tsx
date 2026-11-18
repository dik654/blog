import SceneShell from "./TrieSceneShell";

/**
 * 본문 대응: #overview "먼저 key를 16진수 길로 바꿉니다".
 * keccak256(A)의 앞 3 byte 3f a0 c2와 trie 모양은 설명용 가정.
 * 32 byte × 2 = 64 nibble. root branch가 3, extension이 f a, 다음 branch가 0을 소비 → leaf에 64 − 1 − 2 − 1 = 60자리.
 */
const BYTES: readonly string[] = ["3f", "a0", "c2"];
const NIBBLES: readonly string[] = ["3", "f", "a", "0", "c", "2"];
/** 보이는 nibble마다 그 자리를 소비하는 node: 0 root branch, 1 extension, 2 branch, 3 leaf */
const OWNER: readonly number[] = [0, 1, 1, 2, 3, 3];
const NODE_COLOR: readonly string[] = ["#2563eb", "#7c3aed", "#0891b2", "#16a34a"];
const MUTED = "#94a3b8";
const TEXT = "#64748b";
const LEAF_REST = 64 - 1 - 2 - 1;

const SCENES = [
  {
    label: "주소를 hash",
    summary: "20 byte 주소 → 32 byte key",
    note: "State trie는 주소 원문이 아니라 keccak256(주소)를 key로 씁니다. 그림의 앞 3 byte 3f a0 c2는 설명용 가정이고, 나머지 29 byte도 같은 식으로 이어집니다.",
  },
  {
    label: "byte → nibble 둘",
    summary: "32 byte × 2 = 64자리",
    note: "nibble은 4 bit, 즉 0부터 f(15)까지인 16진수 한 자리입니다. byte 3f는 상위 4 bit 3과 하위 4 bit f로 나뉘고, 이렇게 만든 64자리가 root에서 leaf까지 고를 길이 됩니다.",
  },
  {
    label: "branch 16갈래",
    summary: "첫 자리 3 → 3번 칸",
    note: "branch node는 다음 nibble 값에 따라 최대 16방향으로 나눕니다. A의 첫 자리 3을 읽고 root branch의 3번 칸으로 내려갑니다.",
  },
  {
    label: "extension 압축",
    summary: "f a 두 자리를 한 번에",
    note: "이 아래 key들이 f a를 공통으로 가진다고 가정하면 extension 하나가 두 자리를 압축해 담습니다. 그래서 길이 64자리여도 node가 64개 늘어서는 것은 아닙니다.",
  },
  {
    label: "leaf와 value",
    summary: `남은 ${LEAF_REST}자리 + account RLP`,
    note: "다음 branch가 0을 고르면 leaf가 남은 60자리(c 2 …)와 value를 끝에 둡니다. value는 nonce·balance·storage root·code hash를 RLP(Ethereum의 직렬화 형식)로 묶은 값입니다. parent→child 선은 짧은 child면 inline, 긴 child면 hash 참조일 수 있습니다.",
  },
] as const;

const W = 360;
const H = 272;
const COL = 112;
const CELL = 14;
const BRANCH_Y = [112, 196];

function Branch({ y, pick, color, on }: { y: number; pick: number; color: string; on: boolean }) {
  return (
    <g>
      {Array.from({ length: 16 }, (_, slot) => {
        const picked = on && slot === pick;
        return (
          <g key={slot}>
            <rect
              x={COL + slot * CELL}
              y={y}
              width={CELL}
              height={20}
              fill={picked ? color : "none"}
              fillOpacity={picked ? 0.22 : 0}
              stroke={on ? color : MUTED}
              strokeWidth={picked ? 1.25 : 1}
            />
            <text x={COL + slot * CELL + CELL / 2} y={y + 14} textAnchor="middle" fontSize={9} fill={picked ? color : TEXT} fontWeight={picked ? 700 : 400}>
              {slot.toString(16)}
            </text>
          </g>
        );
      })}
    </g>
  );
}

function TrieKeyPathFigure({ active }: { active: number }) {
  /** 켜진 마지막 node: 장면 2 root branch, 3 extension, 4 다음 branch와 leaf까지 */
  const step = active >= 4 ? 3 : active - 2;
  const nodeOn = (node: number) => step >= node;
  const lineColor = (node: number) => (nodeOn(node) ? NODE_COLOR[node] : MUTED);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[420px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
      <text x={8} y={31} fontSize={11} fill={TEXT}>keccak256(A)</text>
      {BYTES.map((byte, index) => (
        <g key={byte}>
          <rect x={COL + index * 44} y={14} width={38} height={24} rx={4} fill={active === 0 ? "#2563eb" : "none"} fillOpacity={active === 0 ? 0.14 : 0} stroke={active === 0 ? "#2563eb" : MUTED} strokeWidth={1} />
          <text x={COL + index * 44 + 19} y={31} textAnchor="middle" fontSize={12} fontFamily="monospace" fontWeight={700} fill={active === 0 ? "#2563eb" : TEXT}>{byte}</text>
        </g>
      ))}
      <text x={COL + 3 * 44 + 4} y={31} fontSize={11} fill={TEXT}>… 29 byte 더</text>

      <text x={8} y={73} fontSize={11} fill={TEXT}>nibble</text>
      {NIBBLES.map((nibble, index) => {
        const owner = OWNER[index];
        const color = active === 1 ? "#2563eb" : step >= owner ? NODE_COLOR[owner] : MUTED;
        const strong = active === 1 || step >= owner;
        return (
          <g key={index}>
            <rect x={COL + index * 22} y={56} width={18} height={24} rx={3} fill={strong ? color : "none"} fillOpacity={strong ? 0.16 : 0} stroke={color} strokeWidth={1} />
            <text x={COL + index * 22 + 9} y={73} textAnchor="middle" fontSize={12} fontFamily="monospace" fontWeight={700} fill={strong ? color : TEXT}>{nibble}</text>
          </g>
        );
      })}
      <text x={COL + 6 * 22 + 4} y={73} fontSize={11} fill={TEXT}>… 모두 64자리</text>
      {NIBBLES.map((_, index) => {
        const byteIndex = Math.floor(index / 2);
        return <path key={index} d={`M${COL + byteIndex * 44 + 19} 38 L${COL + index * 22 + 9} 56`} stroke={active === 1 ? "#2563eb" : "none"} strokeWidth={1} />;
      })}

      <text x={8} y={BRANCH_Y[0] + 14} fontSize={11} fill={nodeOn(0) ? NODE_COLOR[0] : TEXT} fontWeight={nodeOn(0) ? 700 : 400}>branch</text>
      <Branch y={BRANCH_Y[0]} pick={3} color={NODE_COLOR[0]} on={nodeOn(0)} />
      <path d={`M${COL + 3 * CELL + CELL / 2} ${BRANCH_Y[0] + 20} L${COL + 3 * CELL + CELL / 2} 152`} stroke={lineColor(1)} strokeWidth={1} />

      <text x={8} y={168} fontSize={11} fill={nodeOn(1) ? NODE_COLOR[1] : TEXT} fontWeight={nodeOn(1) ? 700 : 400}>extension</text>
      <rect x={COL} y={152} width={132} height={24} rx={4} fill={nodeOn(1) ? NODE_COLOR[1] : "none"} fillOpacity={nodeOn(1) ? 0.14 : 0} stroke={lineColor(1)} strokeWidth={1} />
      <text x={COL + 66} y={168} textAnchor="middle" fontSize={11} fill={nodeOn(1) ? NODE_COLOR[1] : TEXT} fontWeight={700}>공유 prefix · f a</text>
      <path d={`M${COL + 66} 176 L${COL + 66} ${BRANCH_Y[1]}`} stroke={lineColor(2)} strokeWidth={1} />

      <text x={8} y={BRANCH_Y[1] + 14} fontSize={11} fill={nodeOn(2) ? NODE_COLOR[2] : TEXT} fontWeight={nodeOn(2) ? 700 : 400}>branch</text>
      <Branch y={BRANCH_Y[1]} pick={0} color={NODE_COLOR[2]} on={nodeOn(2)} />
      <path d={`M${COL + CELL / 2} ${BRANCH_Y[1] + 20} L${COL + CELL / 2} 236`} stroke={lineColor(3)} strokeWidth={1} />

      <text x={8} y={254} fontSize={11} fill={nodeOn(3) ? NODE_COLOR[3] : TEXT} fontWeight={nodeOn(3) ? 700 : 400}>leaf</text>
      <rect x={COL} y={236} width={16 * CELL} height={28} rx={4} fill={nodeOn(3) ? NODE_COLOR[3] : "none"} fillOpacity={nodeOn(3) ? 0.14 : 0} stroke={lineColor(3)} strokeWidth={1} />
      <text x={COL + 8 * CELL} y={254} textAnchor="middle" fontSize={11} fill={nodeOn(3) ? NODE_COLOR[3] : TEXT} fontWeight={700}>
        {`c 2 … 남은 ${LEAF_REST}자리 + account RLP`}
      </text>
    </svg>
  );
}

export default function TrieKeyPathViz() {
  return (
    <SceneShell
      eyebrow="key → nibble path"
      title="주소 하나가 64자리 16진수 길이 됩니다"
      description="위 두 줄은 key, 아래는 그 key가 지나가는 node입니다. 같은 색은 그 node가 소비하는 자리입니다. hash 값과 trie 모양은 설명용 가정입니다."
      ariaLabel="주소의 keccak256 hash가 64개 nibble로 나뉘고 branch, extension, branch, leaf 순으로 소비되는 과정"
      scenes={SCENES}
      render={(active) => <TrieKeyPathFigure active={active} />}
    />
  );
}

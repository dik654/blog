import SceneShell from "./SceneShell";

/**
 * 본문 대응: #dirty-path · #state-root — element 5 → chunk ⌊5/4⌋=1 → Balances field root → BeaconState root.
 * 아래 줄 = balance 여덟 칸(uint64), 가운데 = 32-byte chunk 두 개, 위 = top-level field leaf 넷과 root.
 * 칸 수는 줄여 그린 가정이며, 다시 계산하는 node와 재사용하는 node의 위치 관계만 보입니다.
 */
const ACCENT = "#2563eb";
const SHARED = "#94a3b8";
const TEXT = "#64748b";

const ELEMENT_W = 20;
const ex = (index: number) => 136 + index * 22 + (index >= 4 ? 12 : 0);
const CHUNK_X = [179, 279] as const;
const BALANCES_X = 229;
const FIELD_Y = 98;
const CHUNK_Y = 140;
const ELEMENT_Y = 182;

const FIELDS: readonly { label: string; x: number }[] = [
  { label: "slot", x: 40 },
  { label: "validators", x: 118 },
  { label: "balances", x: BALANCES_X },
  { label: "기타 field", x: 322 },
];
const INNER: readonly { x: number; children: readonly number[] }[] = [
  { x: 79, children: [40, 118] },
  { x: 275, children: [BALANCES_X, 322] },
];
const ROOT_X = 177;

const SCENES = [
  { label: "Packing", summary: "⌊5/4⌋ = 1", note: "uint64 balance는 8 bytes라 32-byte chunk 하나에 네 개씩 들어갑니다. Index 4~7이 chunk 1이므로 validator 5는 chunk 1에 있습니다." },
  { label: "Chunk 1 교체", summary: "chunk 1만 새로", note: "B용 trie view를 먼저 분기한 뒤 index 5가 31 ETH가 된 chunk 1만 다시 만들고 chunk 0은 재사용합니다. 4·6·7이 함께 바뀌어도 chunk는 하나입니다." },
  { label: "Balances root", summary: "새 field root", note: "분기한 B용 trie에서 새 chunk 1과 그 조상으로 새 Balances root를 만듭니다. 형제 chunk 0 쪽은 다시 hash하지 않습니다." },
  { label: "State root", summary: "A=R₀ · B=R₁", note: "새 Balances root로 balances leaf를 바꾸고 top-level 조상만 다시 계산해 B의 root R₁을 얻습니다. A의 root는 R₀로 남습니다." },
] as const;

function Node({ x, y, label, sub, hot, w = 64 }: { x: number; y: number; label: string; sub?: string; hot: boolean; w?: number }) {
  return (
    <g>
      <rect x={x - w / 2} y={y - 13} width={w} height={sub ? 30 : 24} rx={4} fill="none" stroke={hot ? ACCENT : SHARED} strokeWidth={hot ? 1.25 : 1} />
      <text x={x} y={y + 3} textAnchor="middle" fontSize={10} fontWeight={hot ? 700 : 500} fill={hot ? ACCENT : TEXT}>{label}</text>
      {sub && <text x={x} y={y + 13} textAnchor="middle" fontSize={8} fill={hot ? ACCENT : TEXT}>{sub}</text>}
    </g>
  );
}

function Edge({ x1, y1, x2, y2, hot }: { x1: number; y1: number; x2: number; y2: number; hot: boolean }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={hot ? ACCENT : SHARED} strokeWidth={hot ? 1.25 : 1} strokeDasharray={hot ? undefined : "3 3"} />;
}

export default function BalanceMerklePathViz() {
  return (
    <SceneShell
      eyebrow="B의 Merkle path"
      title="바뀐 balance 하나에서 State Root까지 한 줄만 다시 계산합니다"
      description="chunk는 아래 balance 네 칸을 이어 붙인 32 bytes이고, 선은 아래 값이 위 node 계산의 입력이 된다는 뜻입니다. 파란 선과 칸은 B에서 다시 계산하는 path, 회색 점선은 A와 공유해 재사용하는 부분입니다. Field 넷과 balance 여덟 칸으로 줄여 그렸습니다(가정)."
      note="32 ETH→31 ETH는 글의 설명용 입력이고, 실제 BeaconState의 field 수와 tree 깊이는 이 그림과 다릅니다. SSZ List인 Balances의 field root는 chunk tree root에 list 길이를 한 번 더 섞어(mix_in_length) 얻지만, 그림에서는 이 단계를 생략했습니다. 다른 balance 칸의 값은 정하지 않았습니다."
      ariaLabel="validator 5의 balance 변경이 chunk 1, Balances field root, BeaconState root로 올라가는 네 장면"
      scenes={SCENES}
      render={(active) => {
        const chunkHot = active >= 1;
        const fieldHot = active >= 2;
        const stateHot = active >= 3;
        return (
          <svg viewBox="0 0 360 210" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {/* top-level container */}
            {INNER.map((inner, k) => (
              <Edge key={`r${k}`} x1={ROOT_X} y1={34} x2={inner.x} y2={47} hot={stateHot && k === 1} />
            ))}
            {INNER.map((inner) =>
              inner.children.map((cx) => <Edge key={`i${inner.x}-${cx}`} x1={inner.x} y1={71} x2={cx} y2={FIELD_Y - 13} hot={stateHot && cx === BALANCES_X} />),
            )}
            <Node x={ROOT_X} y={22} w={110} label={stateHot ? "B state root R₁" : "state root R₀"} hot={stateHot} />
            {INNER.map((inner, k) => (
              <Node key={`n${k}`} x={inner.x} y={60} w={40} label="hash" hot={stateHot && k === 1} />
            ))}
            {FIELDS.map((field) => (
              <Node key={field.label} x={field.x} y={FIELD_Y} w={field.x === BALANCES_X ? 70 : 64} label={field.label} sub={field.x === BALANCES_X ? (fieldHot ? "새 field root" : "field root") : undefined} hot={fieldHot && field.x === BALANCES_X} />
            ))}

            {/* Balances field trie */}
            {CHUNK_X.map((cx, k) => (
              <Edge key={`c${k}`} x1={BALANCES_X} y1={FIELD_Y + 17} x2={cx} y2={CHUNK_Y - 13} hot={fieldHot && k === 1} />
            ))}
            {CHUNK_X.map((cx, k) => (
              <Node key={`chunk${k}`} x={cx} y={CHUNK_Y} w={74} label={`chunk ${k}`} sub={k === 1 && chunkHot ? "B용 새 chunk" : "32 bytes"} hot={chunkHot && k === 1} />
            ))}
            {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => {
              const chunk = index >= 4 ? 1 : 0;
              const isFive = index === 5;
              const inHotChunk = active === 0 ? chunk === 1 : chunkHot && chunk === 1;
              return (
                <g key={index}>
                  <line x1={ex(index) + ELEMENT_W / 2} y1={ELEMENT_Y - 12} x2={CHUNK_X[chunk]} y2={CHUNK_Y + 17} stroke={inHotChunk ? ACCENT : SHARED} strokeWidth={1} strokeDasharray={inHotChunk ? undefined : "3 3"} opacity={0.6} />
                  <rect x={ex(index)} y={ELEMENT_Y - 12} width={ELEMENT_W} height={20} rx={3} fill={isFive ? ACCENT : "none"} fillOpacity={isFive ? 0.14 : 0} stroke={isFive ? ACCENT : SHARED} strokeWidth={isFive ? 1.25 : 1} />
                  <text x={ex(index) + ELEMENT_W / 2} y={ELEMENT_Y + 2} textAnchor="middle" fontSize={10} fontWeight={isFive ? 700 : 500} fill={isFive ? ACCENT : TEXT}>{index}</text>
                </g>
              );
            })}
            <text x={136} y={ELEMENT_Y + 22} fontSize={9} fill={TEXT}>validator index (칸 하나 = uint64 balance)</text>

            {/* A·B 값 메모 */}
            <text x={8} y={140} fontSize={9} fontWeight={700} fill={ACCENT}>{active >= 1 ? "B[5] = 31 ETH" : "A[5] = B[5] = 32 ETH"}</text>
            <text x={8} y={155} fontSize={9} fill={TEXT}>{active >= 1 ? "A[5] = 32 ETH 유지" : "Copy 직후 같은 값"}</text>
            <text x={8} y={170} fontSize={9} fill={TEXT}>{stateHot ? "A root = R₀ 유지" : "A root = R₀"}</text>
          </svg>
        );
      }}
    />
  );
}

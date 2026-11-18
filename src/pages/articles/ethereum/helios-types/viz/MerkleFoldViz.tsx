import HeliosSceneShell from "./HeliosSceneShell";

/**
 * 본문 대응: #proof-context — leaf의 SSZ root에서 시작해 sibling을 bit 방향대로 접어 trusted root와 비교한다.
 * Electra next committee branch 6층을 그린다. bit 값은 proof.rs의 is_next_committee_proof_valid가 쓰는
 * index 23(=0b010111)을 아래 bit부터 읽은 1·1·1·0·1·0이다(is_proof_valid: (index / 2^i) % 2).
 * 장면: 출발 → 첫 층(bit 1) → bit 0이 나오는 넷째 층 → 나머지 2층 → r6 = R → 순서를 틀리면 거절.
 */
const INDEX = 23;
const BITS: readonly number[] = [1, 1, 1, 0, 1, 0];
const DEPTH = BITS.length;
const SUB = ["₀", "₁", "₂", "₃", "₄", "₅", "₆"];

const W = 320;
const H = 280;
const ROW_H = 32;
const BASE_Y = 238;
const BOX_W = 60;
const BOX_H = 22;
const LEFT_X = 118;
const RIGHT_X = 206;
const TOP_X = 162;
const R_X = 272;

const PATH = "#2563eb";
const SIB = "#64748b";
const BAD = "#dc2626";
const OK = "#16a34a";
const DIM = "#94a3b8";

const SCENES = [
  {
    label: "출발점: leaf의 SSZ root",
    summary: "r₀ = HTR(leaf) · sibling 6개",
    folded: 0,
    swap: false,
    note: "맨 아래 r₀는 leaf 객체(여기서는 next committee)의 SSZ hash-tree-root, 즉 객체 전체를 32-byte 하나로 줄인 값입니다. 회색 칸 s₀…s₅는 branch가 건네준 sibling hash 6개로 Electra next committee branch 길이와 같습니다. 층마다 내 값이 왼쪽인지 오른쪽인지는 leaf의 tree 안 위치 번호(Helios 코드의 index 23 = 이진수 010111)를 아래 bit부터 읽어 정합니다.",
  },
  {
    label: "bit₀ = 1: sibling이 왼쪽",
    summary: "r₁ = H(s₀‖r₀)",
    folded: 1,
    swap: false,
    note: "bit가 1이면 sibling s₀를 왼쪽, 지금 값 r₀를 오른쪽에 이어 붙여 SHA-256을 한 번 계산합니다. 결과 r₁이 한 층 위의 값이 됩니다.",
  },
  {
    label: "bit₃ = 0: 내 값이 왼쪽",
    summary: "r₄ = H(r₃‖s₃)",
    folded: 4,
    swap: false,
    note: "bit₁·bit₂도 1이라 s₁·s₂를 왼쪽에 두고 접은 뒤, bit₃은 0이라 이번에는 지금 값 r₃이 왼쪽, s₃이 오른쪽에 옵니다. 같은 hash 목록도 순서를 바꾸면 다른 root가 되므로 bit를 건너뛸 수 없습니다.",
  },
  {
    label: "남은 2층도 같은 규칙",
    summary: "r₄ → r₆",
    folded: 6,
    swap: false,
    note: "bit₄ = 1, bit₅ = 0에 따라 좌우를 정하며 두 번 더 접습니다. sibling 6개를 모두 쓰면 r₆ 하나가 남습니다. Electra finality branch라면 같은 일을 7번 합니다.",
  },
  {
    label: "trusted root와 비교",
    summary: "r₆ = R → 포함 증명 성립",
    folded: 6,
    swap: false,
    note: "R은 attested header가 이미 결속한 state_root입니다. 마지막 값이 R과 같아야 leaf가 그 tree에 들어 있다는 포함 증명이 성립합니다.",
  },
  {
    label: "순서 하나를 틀리면",
    summary: "r′₆ ≠ R → 거절",
    folded: 6,
    swap: true,
    note: "bit₀ = 1인데 s₀를 오른쪽에 붙이면 r′₁부터 값이 달라지고 그 차이가 꼭대기까지 올라갑니다. branch 길이가 6으로 맞아도 마지막 root가 R과 다르면 거절합니다.",
  },
] as const;

const rowY = (row: number) => BASE_Y - row * ROW_H;
const pathX = (row: number, swap: boolean) => {
  if (row === DEPTH) return TOP_X;
  const right = BITS[row] === 1;
  return (swap && row === 0 ? !right : right) ? RIGHT_X : LEFT_X;
};
const sibX = (row: number, swap: boolean) => (pathX(row, swap) === LEFT_X ? RIGHT_X : LEFT_X);

function Box({ x, y, label, color, dashed = false, strong = false }: { x: number; y: number; label: string; color: string; dashed?: boolean; strong?: boolean }) {
  return (
    <g>
      <rect
        x={x - BOX_W / 2}
        y={y - BOX_H / 2}
        width={BOX_W}
        height={BOX_H}
        rx={6}
        fill="none"
        stroke={color}
        strokeWidth={strong ? 1.25 : 1}
        strokeDasharray={dashed ? "3 3" : undefined}
      />
      <text x={x} y={y + 4} textAnchor="middle" fontSize={12} fontWeight={strong ? 700 : 500} fill={color}>
        {label}
      </text>
    </g>
  );
}

export default function MerkleFoldViz() {
  return (
    <HeliosSceneShell
      eyebrow="Merkle branch fold"
      title="sibling을 bit 방향대로 한 층씩 접어 root를 다시 만듭니다"
      description="칸 하나가 32-byte hash 하나입니다. 파란 칸은 지금 접고 있는 값, 회색 칸은 branch가 준 sibling, 점선 칸은 아직 계산하지 않은 값입니다. 아래에서 위로 읽습니다."
      note={`Electra next committee branch 6층을 그렸습니다. 왼쪽 bit는 Helios proof.rs가 이 branch에 쓰는 index ${INDEX}(이진수 010111)를 아래 bit부터 읽은 값입니다. hash 값은 기호로만 적었습니다.`}
      ariaLabel="leaf root에서 sibling 여섯 개를 bit 방향대로 접어 trusted root와 비교하는 장면"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const { folded, swap } = scene;
        const prime = (row: number) => (swap && row > 0 ? "′" : "");
        const pathColor = (row: number) => (swap && row > 0 ? BAD : PATH);
        const compared = active >= 4;
        const match = compared && !swap;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto block h-auto w-full max-w-[24rem]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {/* 연결선: 접은 층의 두 칸에서 위층 값으로 */}
            {Array.from({ length: DEPTH }, (_, row) => {
              if (row >= folded) return null;
              const ty = rowY(row + 1) + BOX_H / 2;
              const tx = pathX(row + 1, swap);
              const fy = rowY(row) - BOX_H / 2;
              const color = swap ? BAD : row === folded - 1 && active <= 2 ? PATH : DIM;
              return (
                <g key={`c${row}`}>
                  <line x1={LEFT_X} y1={fy} x2={tx} y2={ty} stroke={color} strokeWidth={1} />
                  <line x1={RIGHT_X} y1={fy} x2={tx} y2={ty} stroke={color} strokeWidth={1} />
                </g>
              );
            })}

            {/* 층별 bit 표시와 두 칸 */}
            {Array.from({ length: DEPTH }, (_, row) => {
              const y = rowY(row);
              const known = row <= folded;
              const current = !swap && active <= 2 && row === folded;
              return (
                <g key={`r${row}`}>
                  <text x={6} y={y + 4} fontSize={11} fill={SIB} fontFamily="monospace">
                    {`bit${SUB[row]}=${BITS[row]}`}
                  </text>
                  <Box x={sibX(row, swap)} y={y} label={`s${SUB[row]}`} color={swap && row === 0 ? BAD : SIB} strong={swap && row === 0} />
                  <Box
                    x={pathX(row, swap)}
                    y={y}
                    label={known ? `r${prime(row)}${SUB[row]}` : "?"}
                    color={known ? pathColor(row) : DIM}
                    dashed={!known}
                    strong={current || (swap && row === 0)}
                  />
                </g>
              );
            })}

            {/* 꼭대기: r6 과 trusted root R */}
            <Box
              x={TOP_X}
              y={rowY(DEPTH)}
              label={folded >= DEPTH ? `r${swap ? "′" : ""}${SUB[DEPTH]}` : "?"}
              color={folded >= DEPTH ? (swap ? BAD : PATH) : DIM}
              dashed={folded < DEPTH}
              strong={folded >= DEPTH}
            />
            <Box x={R_X} y={rowY(DEPTH)} label="R" color={compared ? (match ? OK : BAD) : SIB} strong={compared} />
            <text x={R_X} y={rowY(DEPTH) - 18} textAnchor="middle" fontSize={10} fill={SIB}>
              state_root
            </text>
            <text x={(TOP_X + R_X) / 2} y={rowY(DEPTH) + 5} textAnchor="middle" fontSize={15} fontWeight={700} fill={compared ? (match ? OK : BAD) : DIM}>
              {compared ? (match ? "=" : "≠") : "?"}
            </text>
            {compared ? (
              <text x={R_X} y={rowY(DEPTH) + 28} textAnchor="middle" fontSize={11} fontWeight={700} fill={match ? OK : BAD}>
                {match ? "수용" : "거절"}
              </text>
            ) : null}

            <text x={TOP_X} y={BASE_Y + 30} textAnchor="middle" fontSize={10} fill={SIB}>
              leaf = next committee 객체 → r₀ = HTR(leaf)
            </text>
          </svg>
        );
      }}
    />
  );
}

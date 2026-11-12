import SceneShell from "./SceneShell";

/**
 * 본문 대응: #dataset-service "Ordered piece entries" — A 60 leaves, B 40 leaves이면
 * logical range 0–59는 A, 60–99는 B. 순서나 leaf count가 바뀌면 challenge 좌표가 달라진다.
 * 좌표 70과 A를 50 leaves로 바꾼 장면은 설명용 가정이다.
 */
const POINT = 70;
const SCALE = 100;

interface Piece {
  name: string;
  leaves: number;
}

const SCENES: readonly { label: string; summary: string; note: string; pieces: readonly Piece[] }[] = [
  { label: "A 다음 B", summary: "좌표 70 → B의 10번 leaf", pieces: [{ name: "A", leaves: 60 }, { name: "B", leaves: 40 }], note: "piece를 순서대로 이어 붙이면 dataset 전체가 0부터 번호가 매겨진 leaf 한 줄이 됩니다. A가 0–59, B가 60–99를 차지하므로 좌표 70은 B 안의 10번째 자리(0부터 셈)입니다." },
  { label: "같은 두 piece, 순서만 바꿈", summary: "좌표 70 → A의 30번 leaf", pieces: [{ name: "B", leaves: 40 }, { name: "A", leaves: 60 }], note: "piece 내용은 그대로인데 순서만 B 다음 A로 바꾸면 B가 0–39, A가 40–99가 됩니다. 같은 좌표 70이 이제 A의 30번째 자리를 가리킵니다." },
  { label: "A의 leaf 수가 바뀜", summary: "좌표 70 → B의 20번 leaf", pieces: [{ name: "A", leaves: 50 }, { name: "B", leaves: 40 }], note: "A의 leaf 수가 50으로 달라졌다고 가정하면 A가 0–49, B가 50–89가 되어 좌표 70은 B의 20번째 자리입니다. 그래서 dataset record는 piece 순서와 leaf count를 함께 고정합니다." },
];

const COLORS: Record<string, string> = { A: "#2563eb", B: "#0d9488" };

const W = 360;
const H = 100;
const LEFT = 12;
const BAR_W = W - 2 * LEFT;
const BAR_Y = 34;
const BAR_H = 30;
const xOf = (leaf: number) => LEFT + (leaf / SCALE) * BAR_W;

export default function PieceRangeViz() {
  return (
    <SceneShell
      eyebrow="Ordered piece entries"
      title="piece 순서와 leaf 수가 challenge 좌표의 뜻을 정합니다"
      description="leaf는 piece를 일정 크기로 잘라 Merkle tree의 잎으로 쓴 조각이고, challenge는 검증 규칙이 고른 좌표의 leaf를 provider가 증명하게 하는 질문입니다. 막대 전체 눈금은 leaf 100개이며, 좌표 70은 설명용 가정입니다."
      ariaLabel="piece 순서와 leaf 수에 따라 같은 좌표 70이 가리키는 piece가 바뀌는 모습"
      scenes={SCENES}
      render={(active) => {
        const pieces = SCENES[active].pieces;
        const starts = pieces.map((_, i) => pieces.slice(0, i).reduce<number>((sum, p) => sum + p.leaves, 0));
        const total = pieces.reduce<number>((sum, p) => sum + p.leaves, 0);
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <rect x={LEFT} y={BAR_Y} width={BAR_W} height={BAR_H} rx={4} fill="none" stroke="#cbd5e1" strokeWidth={1} strokeDasharray="3 3" />
            {pieces.map((piece, i) => {
              const x0 = xOf(starts[i]);
              const x1 = xOf(starts[i] + piece.leaves);
              return (
                <g key={`${piece.name}-${i}`}>
                  <rect x={x0} y={BAR_Y} width={x1 - x0} height={BAR_H} fill={COLORS[piece.name]} opacity={0.85} stroke="#ffffff" strokeWidth={1} />
                  <text x={x0 + 6} y={BAR_Y + 20} fontSize={13} fontWeight={700} fill="#ffffff">
                    {piece.name} · {piece.leaves} leaves
                  </text>
                  <text x={x0 + 2} y={BAR_Y + BAR_H + 18} fontSize={12} fill="#64748b">{starts[i]}</text>
                </g>
              );
            })}
            <text x={xOf(total) - 2} y={BAR_Y + BAR_H + 18} textAnchor="end" fontSize={12} fill="#64748b">{total - 1}</text>
            <line x1={xOf(POINT + 0.5)} x2={xOf(POINT + 0.5)} y1={BAR_Y + BAR_H} y2={BAR_Y + BAR_H + 10} stroke="#b45309" strokeWidth={1.25} />
            <path d={`M ${xOf(POINT + 0.5)} ${BAR_Y - 2} l -4 -7 h 8 z`} fill="#b45309" />
            <text x={xOf(POINT + 0.5)} y={BAR_Y - 14} textAnchor="middle" fontSize={13} fontWeight={700} fill="#b45309">challenge 좌표 {POINT}</text>
          </svg>
        );
      }}
    />
  );
}

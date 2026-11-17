import SceneShell from "./SceneShell";

/**
 * 본문 대응: #pow "유효한 블록 두 개가 생기면 누적 작업량을 비교합니다".
 * 1) 같은 부모 P에서 X와 Y가 갈라지고, 5절처럼 A·B는 X를, C·D는 Y를 먼저 본다.
 * 2) 동등 난이도: X 뒤에 2개, Y 뒤에 1개 → X 쪽 3블록 > Y 쪽 2블록.
 * 3) 난이도가 다르면(가정): 블록 작업량을 평균 시도 수로 센다. T=16 → 16, T=8 → 32.
 *    X 쪽 3블록 × 16 = 48 < Y 쪽 2블록 × 32 = 64 → 블록 수가 적은 Y 쪽 누적량이 크다.
 */
const BW = 50;
const BH = 34;
const COL = [14, 82, 150, 218] as const;
const ROW_X = 36;
const ROW_Y = 130;
const MID_Y = 100;

type Block = { col: number; row: "x" | "y"; name: string; work: number | null };

const SCENES = [
  {
    label: "갈라짐",
    summary: "X·Y 모두 유효 · 임시 선택이 다름",
    note: "지연 때문에 같은 부모 P 뒤에 X와 Y가 거의 동시에 생겼습니다. 둘 다 내용 검사를 통과한 유효한 후보입니다. 5절처럼 A·B가 X를, C·D가 Y를 먼저 받으면 지금 따르는 head가 서로 다를 수 있습니다.",
    blocks: [
      { col: 1, row: "x", name: "X", work: null },
      { col: 1, row: "y", name: "Y", work: null },
    ] as readonly Block[],
    totals: null as null | { x: number; y: number },
    unit: "",
    winner: null as null | "x" | "y",
  },
  {
    label: "같은 난이도",
    summary: "X 쪽 3블록 > Y 쪽 2블록",
    note: "X 쪽에 같은 난이도의 블록 두 개가 더 붙고 Y 쪽에는 하나가 붙었습니다. 난이도가 같으면 블록 하나의 작업량도 같으므로 이 조건에서는 블록 수를 세는 것과 결과가 같습니다. 두 가지를 모두 본 노드는 누적량이 큰 X 쪽을 따릅니다.",
    blocks: [
      { col: 1, row: "x", name: "X", work: 1 },
      { col: 2, row: "x", name: "X+1", work: 1 },
      { col: 3, row: "x", name: "X+2", work: 1 },
      { col: 1, row: "y", name: "Y", work: 1 },
      { col: 2, row: "y", name: "Y+1", work: 1 },
    ] as readonly Block[],
    totals: { x: 3, y: 2 },
    unit: "블록",
    winner: "x" as null | "x" | "y",
  },
  {
    label: "다른 난이도 (가정)",
    summary: "X 쪽 16×3=48 < Y 쪽 32×2=64",
    note: "블록마다 난이도가 다르면 개수만 비교할 수 없습니다. 앞의 칸 그림에서 구한 평균 시도 수를 블록 하나의 작업량으로 센다고 놓습니다(가정). X 쪽 세 블록이 T=16(각 16), Y 쪽 두 블록이 T=8(각 32)이면 블록이 더 적은 Y 쪽의 누적량이 큽니다.",
    blocks: [
      { col: 1, row: "x", name: "X", work: 16 },
      { col: 2, row: "x", name: "X+1", work: 16 },
      { col: 3, row: "x", name: "X+2", work: 16 },
      { col: 1, row: "y", name: "Y", work: 32 },
      { col: 2, row: "y", name: "Y+1", work: 32 },
    ] as readonly Block[],
    totals: { x: 48, y: 64 },
    unit: "작업",
    winner: "y" as null | "x" | "y",
  },
] as const;

function rowY(row: "x" | "y") {
  return row === "x" ? ROW_X : ROW_Y;
}

export default function ForkWorkViz() {
  return (
    <SceneShell
      eyebrow="갈라진 두 가지"
      title="블록 개수가 아니라 가지에 쌓인 작업량을 더해 비교합니다"
      description="왼쪽 P가 공통 부모이고 오른쪽으로 갈수록 뒤에 붙은 블록입니다. 블록 안의 숫자는 그 블록의 작업량입니다."
      note="세 번째 장면의 난이도 배치와 작업량 단위는 비교를 보이기 위한 가정입니다."
      ariaLabel="같은 부모에서 갈라진 X 가지와 Y 가지의 누적 작업량 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <svg viewBox="0 0 360 196" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <rect x={COL[0]} y={MID_Y - BH / 2} width={BW} height={BH} rx={4} fill="#f1f5f9" stroke="#64748b" strokeWidth={1} />
            <text x={COL[0] + BW / 2} y={MID_Y + 4} textAnchor="middle" fontSize={12} fontWeight={700} fill="#334155">P</text>
            {(["x", "y"] as const).map((row) => (
              <line key={row} x1={COL[0] + BW} y1={MID_Y} x2={COL[1]} y2={rowY(row) + BH / 2} stroke="#94a3b8" strokeWidth={1} />
            ))}
            {scene.blocks.map((block) => {
              const x = COL[block.col];
              const y = rowY(block.row);
              const win = scene.winner === block.row;
              const color = block.row === "x" ? "#2563eb" : "#d97706";
              return (
                <g key={`${block.row}-${block.name}`}>
                  {block.col > 1 && <line x1={COL[block.col - 1] + BW} y1={y + BH / 2} x2={x} y2={y + BH / 2} stroke="#94a3b8" strokeWidth={1} />}
                  <rect x={x} y={y} width={BW} height={BH} rx={4} fill={win ? (block.row === "x" ? "#dbeafe" : "#fef3c7") : "#ffffff"} stroke={color} strokeWidth={win ? 1.25 : 1} />
                  <text x={x + BW / 2} y={y + (block.work === null ? 22 : 15)} textAnchor="middle" fontSize={13} fontWeight={700} fill={color}>{block.name}</text>
                  {block.work !== null && <text x={x + BW / 2} y={y + 29} textAnchor="middle" fontSize={12} fill="#475569">{block.work}</text>}
                </g>
              );
            })}
            {active === 0 && (
              <>
                <text x={COL[1] + BW + 10} y={ROW_X + 19} fontSize={13} fill="#2563eb">A·B가 먼저 봄</text>
                <text x={COL[1] + BW + 10} y={ROW_Y + 19} fontSize={13} fill="#d97706">C·D가 먼저 봄</text>
              </>
            )}
            {scene.totals && (["x", "y"] as const).map((row) => {
              const win = scene.winner === row;
              const color = row === "x" ? "#2563eb" : "#d97706";
              return (
                <g key={row}>
                  <text x={350} y={rowY(row) + 12} textAnchor="end" fontSize={12} fill="#64748b">누적 {scene.unit}</text>
                  <text x={350} y={rowY(row) + 32} textAnchor="end" fontSize={18} fontWeight={700} fill={color}>{scene.totals?.[row]}</text>
                  {win && <text x={350} y={rowY(row) + 50} textAnchor="end" fontSize={12} fontWeight={700} fill={color}>따르는 가지</text>}
                </g>
              );
            })}
          </svg>
        );
      }}
    />
  );
}

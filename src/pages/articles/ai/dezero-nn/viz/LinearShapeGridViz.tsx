import SceneShell from "./SceneShell";

/**
 * 본문 대응: #linear — X 4×2, W 2×3, b 3의 forward와 backward shape.
 * forward: XW 4×3, +b broadcast → Y 4×3.
 * backward: dX = gy·Wᵀ (4×3 · 3×2 = 4×2), dW = Xᵀ·gy (2×4 · 4×3 = 2×3), db = gy의 배치 축 합(길이 3).
 */
type Mat = {
  name: string;
  rows: number;
  cols: number;
  hlRow?: number;
  hlAll?: boolean;
  ghostRows?: boolean;
  colSum?: boolean;
};
type Part = Mat | string;

const CELL = 15;
const GAP = 14;
const TOP = 14;

const SCENES: { label: string; summary: string; note: string; parts: Part[] }[] = [
  {
    label: "행 하나가 weight를 통과",
    summary: "(4×2)·(2×3) = 4×3",
    note: "X의 각 행(sample 하나, 길이 2)이 W의 2×3과 곱해져 길이 3 행이 됩니다. 4개 sample이 같은 W를 쓰므로 결과는 4×3입니다.",
    parts: [{ name: "X", rows: 4, cols: 2, hlRow: 0 }, "×", { name: "W", rows: 2, cols: 3, hlAll: true }, "=", { name: "XW", rows: 4, cols: 3, hlRow: 0 }],
  },
  {
    label: "bias는 4행 모두에 더함",
    summary: "b 3개 → 4행에 broadcast",
    note: "b는 길이 3 하나뿐입니다. 점선 행은 같은 b를 다른 sample에 다시 쓰는 것이며 sample마다 새 parameter가 생기지 않습니다. 그래서 parameter는 6+3=9개입니다.",
    parts: [{ name: "XW", rows: 4, cols: 3 }, "+", { name: "b", rows: 4, cols: 3, hlRow: 0, ghostRows: true }, "=", { name: "Y", rows: 4, cols: 3, hlAll: true }],
  },
  {
    label: "입력 쪽 gradient",
    summary: "dX = gy·Wᵀ → 4×2",
    note: "출력 gradient gy(4×3)에 Wᵀ(3×2)를 곱하면 4×2가 되어 X와 같은 shape이 됩니다.",
    parts: [{ name: "gy", rows: 4, cols: 3 }, "×", { name: "Wᵀ", rows: 3, cols: 2 }, "=", { name: "dX", rows: 4, cols: 2, hlAll: true }],
  },
  {
    label: "weight 쪽 gradient",
    summary: "dW = Xᵀ·gy → 2×3",
    note: "Xᵀ(2×4)와 gy(4×3)를 곱하면 가운데 4가 사라지며 4개 sample의 몫이 행렬곱 안에서 합쳐집니다. 결과 2×3은 W와 같은 shape입니다.",
    parts: [{ name: "Xᵀ", rows: 2, cols: 4 }, "×", { name: "gy", rows: 4, cols: 3 }, "=", { name: "dW", rows: 2, cols: 3, hlAll: true }],
  },
  {
    label: "bias gradient는 배치 축 합",
    summary: "db = gy의 4행 합 → 길이 3",
    note: "forward에서 b를 4행에 나눠 썼으므로 backward에서는 gy의 4행을 열마다 더해 길이 3으로 되돌립니다. 이 합산을 빠뜨리면 db가 4×3으로 남습니다.",
    parts: [{ name: "gy", rows: 4, cols: 3, colSum: true }, "→", { name: "db", rows: 1, cols: 3, hlAll: true }],
  },
];

const OP_W = 18;

function partWidth(part: Part) {
  return typeof part === "string" ? OP_W : part.cols * CELL;
}

function Grid({ mat, x }: { mat: Mat; x: number }) {
  const h = mat.rows * CELL;
  const y0 = TOP + (4 * CELL - h) / 2;
  const cells = Array.from({ length: mat.rows * mat.cols }, (_, k) => ({ r: Math.floor(k / mat.cols), c: k % mat.cols }));
  return (
    <g>
      {cells.map(({ r, c }) => {
        const ghost = mat.ghostRows && r > 0;
        const hl = mat.hlAll || mat.hlRow === r;
        return (
          <rect
            key={`${r}-${c}`}
            x={x + c * CELL + 1}
            y={y0 + r * CELL + 1}
            width={CELL - 2}
            height={CELL - 2}
            rx={2}
            fill={hl && !ghost ? "#2563eb" : "none"}
            fillOpacity={hl && !ghost ? 0.22 : 0}
            stroke={hl ? "#2563eb" : "#94a3b8"}
            strokeWidth={1}
            strokeDasharray={ghost ? "2 2" : undefined}
          />
        );
      })}
      {mat.colSum && (
        <g>
          {Array.from({ length: mat.cols }, (_, c) => (
            <line key={c} x1={x + c * CELL + CELL / 2} y1={y0 + 3} x2={x + c * CELL + CELL / 2} y2={y0 + h + 7} stroke="#d97706" strokeWidth={1.25} />
          ))}
          <text x={x + (mat.cols * CELL) / 2} y={y0 + h + 18} textAnchor="middle" fontSize={9} fill="#d97706">열마다 합</text>
        </g>
      )}
      <text x={x + (mat.cols * CELL) / 2} y={TOP + 4 * CELL + 32} textAnchor="middle" fontSize={11} fontWeight={700} fill="#475569">{mat.name}</text>
      <text x={x + (mat.cols * CELL) / 2} y={TOP + 4 * CELL + 45} textAnchor="middle" fontSize={10} fill="#64748b">
        {mat.ghostRows ? "길이 3" : mat.rows === 1 ? `길이 ${mat.cols}` : `${mat.rows}×${mat.cols}`}
      </text>
    </g>
  );
}

function Equation({ parts }: { parts: readonly Part[] }) {
  const widths = parts.map(partWidth);
  const total = widths.reduce<number>((sum, w) => sum + w, 0) + GAP * (parts.length - 1);
  const starts = widths.map((_, i) => widths.slice(0, i).reduce<number>((sum, w) => sum + w + GAP, 0));
  const offset = (300 - total) / 2;
  return (
    <svg viewBox="0 0 300 126" className="mx-auto h-auto w-full max-w-[460px]" role="img" aria-label="행렬 칸으로 그린 shape 계산">
      {parts.map((part, i) => {
        const x = offset + starts[i];
        if (typeof part === "string") {
          return (
            <text key={i} x={x + OP_W / 2} y={TOP + 2 * CELL + 5} textAnchor="middle" fontSize={15} fontWeight={700} fill="#64748b">
              {part}
            </text>
          );
        }
        return <Grid key={i} mat={part} x={x} />;
      })}
    </svg>
  );
}

export default function LinearShapeGridViz() {
  return (
    <SceneShell
      eyebrow="shape 칸 세기"
      title="forward 두 단계와 backward 세 결과를 칸으로 셉니다"
      description="칸 하나가 숫자 하나입니다. 글의 고정 예제 X 4×2, W 2×3, b 길이 3을 그대로 씁니다. gy는 출력 Y와 같은 4×3 shape의 출력 gradient입니다."
      ariaLabel="Linear layer의 forward와 backward에서 행렬 shape가 맞물리는 다섯 장면"
      scenes={SCENES}
      render={(scene) => <Equation parts={SCENES[scene].parts} />}
    />
  );
}

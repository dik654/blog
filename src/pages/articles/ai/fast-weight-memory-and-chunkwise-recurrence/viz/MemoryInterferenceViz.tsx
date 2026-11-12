import SceneShell from "./SceneShell";
import { MemoryGrid, type CellTone } from "./MemoryGrid";

/**
 * 본문 대응: #case — 두 쌍을 같은 2×2 칸에 더해 쓰면 첫 주소의 읽기에 1.8이 섞인다.
 * k₁=(1,0)→v₁=(2,0), k₂=(0.6,0.8)→v₂=(0,3) (본문의 가정 숫자).
 * 칸(행 i, 열 j) = v_i × k_j. M=[[2,0],[1.8,2.4]], Mk₁=(2,1.8), Mk₂=(1.2,3).
 */
type Scene = {
  label: string;
  summary: string;
  note: string;
  cells: readonly (readonly string[])[];
  tones: readonly (readonly CellTone[])[];
  readCols: readonly number[];
  showK1: boolean;
  showK2: boolean;
  query: "k1" | "k2" | null;
};

const SUM_TONES: readonly (readonly CellTone[])[] = [
  ["first", "empty"],
  ["second", "second"],
];

const SCENES: readonly Scene[] = [
  {
    label: "첫 쌍 쓰기",
    summary: "(2,0) × (1,0)",
    note: "값 (2,0)의 각 숫자에 주소 (1,0)의 각 숫자를 곱해 칸을 채웁니다. 주소의 둘째 숫자가 0이라 열2는 모두 0이고, 첫 칸에만 2가 남습니다.",
    cells: [["2", "0"], ["0", "0"]],
    tones: [["first", "empty"], ["empty", "empty"]],
    readCols: [],
    showK1: true,
    showK2: false,
    query: null,
  },
  {
    label: "둘째 쌍 쓰기",
    summary: "(0,3) × (0.6,0.8)",
    note: "값 (0,3)의 첫 숫자가 0이라 행1은 0입니다. 행2는 3×0.6=1.8, 3×0.8=2.4입니다. 주소 k₂가 k₁ 방향으로 0.6만큼 겹쳐 있어 열1에도 숫자가 생깁니다.",
    cells: [["0", "0"], ["1.8", "2.4"]],
    tones: [["empty", "empty"], ["second", "second"]],
    readCols: [],
    showK1: false,
    showK2: true,
    query: null,
  },
  {
    label: "같은 칸에 더하기",
    summary: "M = [[2,0],[1.8,2.4]]",
    note: "같은 위치의 숫자를 더해 행렬 하나만 남깁니다. 칸 수는 그대로 네 개입니다. 대신 열1에는 첫 쌍의 2와 둘째 쌍의 1.8이 함께 들어 있습니다.",
    cells: [["2", "0"], ["1.8", "2.4"]],
    tones: SUM_TONES,
    readCols: [],
    showK1: true,
    showK2: true,
    query: null,
  },
  {
    label: "k₁로 읽기",
    summary: "Mk₁ = (2, 1.8)",
    note: "주소 (1,0)으로 읽으면 열1만 그대로 나옵니다. 원했던 (2,0) 옆에 둘째 쌍이 남긴 1.8(=0.6×3)이 함께 나옵니다.",
    cells: [["2", "0"], ["1.8", "2.4"]],
    tones: SUM_TONES,
    readCols: [0],
    showK1: true,
    showK2: true,
    query: "k1",
  },
  {
    label: "k₂로 읽기",
    summary: "Mk₂ = (1.2, 3)",
    note: "주소 (0.6,0.8)로 읽으면 열1에 0.6, 열2에 0.8을 곱해 더합니다. 행1은 2×0.6+0×0.8=1.2, 행2는 1.8×0.6+2.4×0.8=3입니다. 이번에도 첫 쌍의 값이 1.2만큼 섞입니다.",
    cells: [["2", "0"], ["1.8", "2.4"]],
    tones: SUM_TONES,
    readCols: [0, 1],
    showK1: true,
    showK2: true,
    query: "k2",
  },
];

/* 왼쪽 주소 평면: 원점 (28,168), 1 = 112px */
const OX = 28;
const OY = 168;
const U = 112;

function Arrow({ x2, y2, color, label, lx, ly, bold }: { x2: number; y2: number; color: string; label: string; lx: number; ly: number; bold: boolean }) {
  const angle = Math.atan2(y2 - OY, x2 - OX);
  const head = 7;
  const p1 = `${x2},${y2}`;
  const p2 = `${x2 - head * Math.cos(angle - 0.4)},${y2 - head * Math.sin(angle - 0.4)}`;
  const p3 = `${x2 - head * Math.cos(angle + 0.4)},${y2 - head * Math.sin(angle + 0.4)}`;
  return (
    <g>
      <line x1={OX} y1={OY} x2={x2} y2={y2} stroke={color} strokeWidth={bold ? 1.25 : 1} />
      <polygon points={`${p1} ${p2} ${p3}`} fill={color} />
      <text x={lx} y={ly} fontSize={14} fontWeight={700} fill={color}>{label}</text>
    </g>
  );
}

export default function MemoryInterferenceViz() {
  return (
    <SceneShell
      eyebrow="두 쌍을 한 행렬에"
      title="두 주소가 0.6만큼 겹치면 첫 주소의 읽기에 다른 값이 섞입니다"
      description="왼쪽은 두 주소의 방향, 오른쪽은 네 칸짜리 기억 M입니다. 칸(행 i, 열 j)에는 값의 i번째 숫자 × 주소의 j번째 숫자를 적습니다. 숫자는 본문의 설명용 가정입니다."
      ariaLabel="두 쌍을 2×2 기억 행렬에 더해 쓰고 각 주소로 읽는 과정"
      scenes={SCENES}
      render={(active) => {
        const s = SCENES[active];
        const k1 = { x: OX + U, y: OY };
        const k2 = { x: OX + 0.6 * U, y: OY - 0.8 * U };
        return (
          <svg viewBox="0 0 360 200" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${s.label}: ${s.summary}`}>
            <line x1={OX} y1={OY} x2={OX + U + 18} y2={OY} stroke="#cbd5e1" strokeWidth={1} />
            <line x1={OX} y1={OY} x2={OX} y2={OY - U + 4} stroke="#cbd5e1" strokeWidth={1} />
            <g opacity={s.showK1 ? 1 : 0.25}>
              <Arrow x2={k1.x} y2={k1.y} color="#2563eb" label="k₁" lx={k1.x - 6} ly={k1.y - 8} bold={s.query === "k1"} />
            </g>
            <g opacity={s.showK2 ? 1 : 0.25}>
              <Arrow x2={k2.x} y2={k2.y} color="#d97706" label="k₂" lx={k2.x + 6} ly={k2.y + 2} bold={s.query === "k2"} />
              <line x1={k2.x} y1={k2.y} x2={k2.x} y2={OY} stroke="#d97706" strokeWidth={1} strokeDasharray="3 3" />
              <line x1={OX} y1={OY + 10} x2={k2.x} y2={OY + 10} stroke="#d97706" strokeWidth={1} />
              <text x={(OX + k2.x) / 2} y={OY + 24} textAnchor="middle" fontSize={12} fontWeight={700} fill="#b45309">겹침 0.6</text>
            </g>
            <text x={OX} y={24} fontSize={12} fill="#64748b">주소 방향</text>
            <text x={210} y={24} fontSize={12} fill="#64748b">기억 M</text>
            <MemoryGrid x={210} y={52} cells={s.cells} tones={s.tones} readCols={s.readCols} />
            <text x={210} y={160} fontSize={12} fill="#64748b">
              {s.query === "k1" ? "읽기 = 열1" : s.query === "k2" ? "0.6×열1+0.8×열2" : ""}
            </text>
            <text x={210} y={182} fontSize={15} fontWeight={700} className="fill-foreground" fontFamily="ui-monospace, monospace">
              {s.query === "k1" ? "(2, 1.8)" : s.query === "k2" ? "(1.2, 3)" : ""}
            </text>
          </svg>
        );
      }}
    />
  );
}

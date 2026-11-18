import SceneShell from "./SceneShell";

/**
 * 본문 대응: #relaxed-r1cs — 두 원본 3×4=12, 2×5=10(u₁=u₂=1, E₁=E₂=0)을 r=2로 섞는다.
 * 왼쪽 (3+2·2)(4+2·5)=7×14=98 = 12 + (30+16) + 40.
 * 오른쪽 u′·결과 = (1+2)(12+2·10)=3×32=96 = 12 + 2·(10+12) + 40.
 * 차이 2 = r·T, T = 3×5+2×4−10−12 = 1. mod 17: 98≡13, 32≡15, 3×15+2=47≡13.
 */
const UNIT = 20;
const X0 = 60;
const Y0 = 34;
const COLS = [4, 10] as const;
const ROWS = [3, 4] as const;

type Kind = "orig" | "cross";

const BLOCKS: readonly { row: number; col: number; text: string; tag: string; kind: Kind }[] = [
  { row: 0, col: 0, text: "3×4=12", tag: "첫 원본", kind: "orig" },
  { row: 0, col: 1, text: "3×10=30", tag: "교차", kind: "cross" },
  { row: 1, col: 0, text: "4×4=16", tag: "교차", kind: "cross" },
  { row: 1, col: 1, text: "4×10=40", tag: "둘째 원본×r²", kind: "orig" },
];

const LEDGER = [
  { name: "첫 원본 칸", left: "3×4 = 12", right: "1×12 = 12", kind: "orig" as Kind },
  { name: "교차 두 칸", left: "30+16 = 46", right: "2×(1×10+1×12) = 44", kind: "cross" as Kind },
  { name: "둘째 원본 칸", left: "4×10 = 40", right: "2²×(1×10) = 40", kind: "orig" as Kind },
];

const SCENES = [
  {
    label: "왼쪽 7×14",
    summary: "(3+2×2)×(4+2×5) = 98",
    note: "왼쪽 입력 7은 3에 2×2를, 14는 4에 2×5를 더한 값입니다(섞는 숫자 r=2). 직사각형 넓이로 곱하면 네 칸으로 나뉘고 합은 98, 17로 나눈 나머지는 13입니다.",
  },
  {
    label: "대각선 두 칸",
    summary: "12와 40은 양쪽이 같습니다",
    note: "왼쪽 위 12는 첫 원본 결과 그대로이고, 오른쪽 아래 40은 둘째 원본의 2×5=10에 r²=4가 붙은 값입니다. 오른쪽(배율 u′×결과)을 전개해도 1×12와 2²×1×10으로 같은 12와 40이 나옵니다.",
  },
  {
    label: "교차 두 칸",
    summary: "46 − 44 = 2 = r×T",
    note: "서로 다른 원본의 입력이 곱해진 두 칸은 2×(3×5+2×4)=46입니다. 오른쪽의 교차 부분은 2×(1×10+1×12)=44입니다. 남는 2를 r=2로 나눈 1이 교차항 T입니다.",
  },
  {
    label: "17로 나누면",
    summary: "98 = 96 + 2 → 13 ≡ 3×15 + 2",
    note: "왼쪽 98은 오른쪽 3×32=96에 오차 E′=0+2×1+4×0=2를 더한 값입니다. 32를 17로 나눈 나머지가 15이므로 mod 17에서는 7×14≡13≡3×15+2입니다. 숫자는 설명용 가정입니다.",
  },
] as const;

const KIND_COLOR: Record<Kind, string> = { orig: "#2563eb", cross: "#d97706" };

function lit(active: number, kind: Kind) {
  if (active === 0 || active === 3) return true;
  return active === 1 ? kind === "orig" : kind === "cross";
}

export default function CrossTermAreaViz() {
  const colX = [X0, X0 + COLS[0] * UNIT];
  const rowY = [Y0, Y0 + ROWS[0] * UNIT];
  const width = (COLS[0] + COLS[1]) * UNIT;
  const height = (ROWS[0] + ROWS[1]) * UNIT;
  return (
    <SceneShell
      eyebrow="교차항"
      title="섞은 곱을 넓이로 펼치면 교차 두 칸에서 2가 남습니다"
      description="가로는 14=4+2×5, 세로는 7=3+2×2입니다(4와 3은 첫 원본, 2×5와 2×2는 둘째 원본에서 옵니다). 칸 넓이가 곱의 각 부분이고, 아래 표는 오른쪽(배율 u′=3 × 결과 12+2×10=32)을 같은 방식으로 나눈 값입니다. 17로 나누기 전의 정수로 셉니다."
      ariaLabel="두 곱셈 조건을 r=2로 섞은 곱을 네 칸 넓이로 나누어 교차항을 찾는 네 장면"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0">
          <svg
            viewBox="0 0 360 214"
            className="mx-auto h-auto w-full max-w-[440px]"
            role="img"
            aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}
          >
            <text x={colX[0] + (COLS[0] * UNIT) / 2} y={Y0 - 10} textAnchor="middle" fontSize={12} fill="#64748b">4</text>
            <text x={colX[1] + (COLS[1] * UNIT) / 2} y={Y0 - 10} textAnchor="middle" fontSize={12} fill="#64748b">2×5=10</text>
            <text x={X0 - 8} y={rowY[0] + (ROWS[0] * UNIT) / 2 + 4} textAnchor="end" fontSize={12} fill="#64748b">3</text>
            <text x={X0 - 8} y={rowY[1] + (ROWS[1] * UNIT) / 2 + 4} textAnchor="end" fontSize={12} fill="#64748b">2×2=4</text>
            {BLOCKS.map((block) => {
              const on = lit(active, block.kind);
              const color = KIND_COLOR[block.kind];
              const x = colX[block.col];
              const y = rowY[block.row];
              const w = COLS[block.col] * UNIT;
              const h = ROWS[block.row] * UNIT;
              return (
                <g key={block.text}>
                  <rect
                    x={x}
                    y={y}
                    width={w}
                    height={h}
                    fill={on ? color : "#94a3b8"}
                    fillOpacity={on ? 0.16 : 0.06}
                    stroke={on ? color : "#94a3b8"}
                    strokeWidth={1}
                    strokeDasharray={block.kind === "cross" ? "4 3" : undefined}
                  />
                  <text x={x + w / 2} y={y + h / 2 - 2} textAnchor="middle" fontSize={13} fontWeight={700} fill={on ? color : "#94a3b8"}>
                    {block.text}
                  </text>
                  <text x={x + w / 2} y={y + h / 2 + 13} textAnchor="middle" fontSize={11} fill={on ? "#475569" : "#94a3b8"}>
                    {block.tag}
                  </text>
                </g>
              );
            })}
            <text x={X0 + width / 2} y={Y0 + height + 24} textAnchor="middle" fontSize={12} fontWeight={700} fill="#334155">
              7 × 14 = 12 + 30 + 16 + 40 = 98
            </text>
          </svg>
          <div className="mt-3 grid grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)_minmax(0,1.3fr)] gap-x-2 gap-y-1 text-xs leading-5 sm:text-sm">
            <span className="text-muted-foreground">부분</span>
            <span className="font-semibold">왼쪽 7×14</span>
            <span className="font-semibold">오른쪽 3×32</span>
            {LEDGER.map((row) => {
              const on = lit(active, row.kind);
              const tone = on ? (row.kind === "orig" ? "text-blue-700 dark:text-blue-400" : "text-amber-700 dark:text-amber-400") : "text-muted-foreground/60";
              return (
                <div key={row.name} className="contents">
                  <span className={on ? "" : "text-muted-foreground/60"}>{row.name}</span>
                  <span className={`font-mono ${tone}`}>{row.left}</span>
                  <span className={`font-mono ${tone}`}>{row.right}</span>
                </div>
              );
            })}
            <span className="border-t border-border pt-1 font-semibold">합</span>
            <span className="border-t border-border pt-1 font-mono font-semibold">98</span>
            <span className={`border-t border-border pt-1 font-mono font-semibold ${active >= 2 ? "" : "text-muted-foreground/60"}`}>
              {active >= 2 ? "96, 차이 2 = E′" : "96"}
            </span>
          </div>
        </div>
      )}
    />
  );
}

import SceneShell from "./SceneShell";

/**
 * 본문 대응: #overview — 스왑션 변동성 큐브의 세 축(옵션 만기·기초 스왑 만기·행사가).
 * 왼쪽 격자 = 옵션 만기(행) × 기초 스왑 만기(열). 오른쪽 띠 = 고른 칸 안의 행사가 축.
 * 3개월·10년·ATM(4.00%)·+10bp(4.10%)만 글의 값이고, 다른 칸의 개수와 위치는 그림용(가정).
 * 변동성 숫자는 글에 없으므로 칸에 값을 적지 않는다.
 */
const ROWS = 4;
const COLS = 4;
const ROW_3M = 1;
const COL_10Y = 2;
const GX = 66;
const GY = 46;
const CELL = 38;
const STRIP_X = 266;
const STRIP_W = 70;
const SLOT_H = 26;
const SLOTS = 5;
const SLOT_ATM = 2; // 가운데 = ATM
const SLOT_K = 1; // 그 위 = +10bp
const BLUE = "#2563eb";
const GRAY = "#64748b";
const LINE = "#94a3b8";
const AMBER = "#d97706";

const SCENES = [
  { label: "축 1 · 옵션 만기", summary: "3개월 뒤 권리를 행사", step: 0, note: "가로줄 하나가 옵션 만기입니다. 3개월 뒤 스왑 시작을 고르는 권리라 3개월 줄에 있습니다." },
  { label: "축 2 · 기초 스왑 만기", summary: "3개월 줄 × 10년 칸", step: 1, note: "세로줄은 행사하면 들어가는 스왑의 길이입니다. 10년 스왑이라 3개월 줄과 10년 줄이 만나는 칸 하나로 좁혀집니다." },
  { label: "축 3 · 행사가", summary: "그 칸 안에서 ATM보다 +10bp", step: 2, note: "한 칸 안에도 행사가별 변동성이 따로 있습니다. ATM(등가격)은 행사가가 선도 4.00%와 같은 자리이고, 행사가 4.10%는 그보다 10bp 위입니다." },
  { label: "한 숫자로 줄이면", summary: "모든 칸이 같은 값", step: 3, note: "변동성 하나로 모든 금리 옵션을 평가하면 모든 칸이 같은 값이 되어 기간과 행사가의 차이를 잃습니다." },
] as const;

export default function CubeCoordinateViz() {
  return (
    <SceneShell
      eyebrow="세 좌표"
      title="스왑션 한 건은 큐브의 세 좌표로 찾습니다"
      description="왼쪽은 옵션 만기(가로줄)×기초 스왑 만기(세로줄) 격자이고, 오른쪽은 고른 칸 안의 행사가 축입니다. 3개월·10년·4.00%·4.10%만 1절의 값이고 다른 칸은 그림용(가정)입니다."
      ariaLabel="옵션 만기, 기초 스왑 만기, 행사가 세 축으로 3개월×10년×+10bp 지점을 찾는 과정"
      scenes={SCENES}
      render={(active) => {
        const step = SCENES[active].step;
        const flat = step === 3;
        const cellFill = (row: number, col: number) => {
          if (flat) return "#93c5fd";
          if (step >= 1 && row === ROW_3M && col === COL_10Y) return BLUE;
          if (step === 0 && row === ROW_3M) return "#93c5fd";
          if (step >= 1 && (row === ROW_3M || col === COL_10Y)) return "#dbeafe";
          return "#f1f5f9";
        };
        const slotFill = (slot: number) => {
          if (flat) return "#93c5fd";
          if (step < 2) return "#f1f5f9";
          if (slot === SLOT_K) return BLUE;
          if (slot === SLOT_ATM) return "#dbeafe";
          return "#f1f5f9";
        };
        const cx = GX + COL_10Y * CELL + CELL / 2;
        const cy = GY + ROW_3M * CELL + CELL / 2;
        return (
          <svg viewBox="0 0 360 236" className="mx-auto h-auto w-full max-w-[540px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={GX + (COLS * CELL) / 2} y={16} textAnchor="middle" fontSize={12} fontWeight={700} fill={GRAY}>기초 스왑 만기 → 길어짐</text>
            {Array.from({ length: COLS }, (_, col) => (
              <text key={col} x={GX + col * CELL + CELL / 2} y={38} textAnchor="middle" fontSize={11} fontWeight={col === COL_10Y ? 700 : 400} fill={col === COL_10Y && step >= 1 ? BLUE : GRAY}>
                {col === COL_10Y ? "10년" : "·"}
              </text>
            ))}
            <text x={14} y={GY + (ROWS * CELL) / 2} fontSize={12} fontWeight={700} fill={GRAY} textAnchor="middle" transform={`rotate(90 14 ${GY + (ROWS * CELL) / 2})`}>옵션 만기 → 길어짐</text>
            {Array.from({ length: ROWS }, (_, row) => (
              <text key={row} x={GX - 6} y={GY + row * CELL + CELL / 2 + 4} textAnchor="end" fontSize={11} fontWeight={row === ROW_3M ? 700 : 400} fill={row === ROW_3M ? BLUE : GRAY}>
                {row === ROW_3M ? "3개월" : "·"}
              </text>
            ))}
            {Array.from({ length: ROWS * COLS }, (_, index) => {
              const row = Math.floor(index / COLS);
              const col = index % COLS;
              return <rect key={index} x={GX + col * CELL + 1} y={GY + row * CELL + 1} width={CELL - 2} height={CELL - 2} rx={3} fill={cellFill(row, col)} stroke={LINE} strokeWidth={1} />;
            })}

            {/* 고른 칸 → 행사가 띠 */}
            {step >= 2 && !flat && (
              <path d={`M ${cx + CELL / 2 - 2} ${cy} L ${STRIP_X - 4} ${GY + 6}`} stroke={BLUE} strokeWidth={1} fill="none" strokeDasharray="3 2" />
            )}
            <text x={STRIP_X + STRIP_W / 2} y={38} textAnchor="middle" fontSize={11} fontWeight={700} fill={GRAY}>행사가</text>
            {Array.from({ length: SLOTS }, (_, slot) => (
              <g key={slot}>
                <rect x={STRIP_X} y={GY + slot * SLOT_H + 1} width={STRIP_W} height={SLOT_H - 2} rx={3} fill={slotFill(slot)} stroke={LINE} strokeWidth={1} />
                <text x={STRIP_X + STRIP_W / 2} y={GY + slot * SLOT_H + SLOT_H / 2 + 4} textAnchor="middle" fontSize={11} fontWeight={700} fill={step >= 2 && !flat && slot === SLOT_K ? "#ffffff" : GRAY}>
                  {slot === SLOT_K ? "+10bp 4.10%" : slot === SLOT_ATM ? "ATM 4.00%" : "·"}
                </text>
              </g>
            ))}
            <text x={STRIP_X + STRIP_W / 2} y={GY + SLOTS * SLOT_H + 16} textAnchor="middle" fontSize={10.5} fill={GRAY}>위로 갈수록</text>
            <text x={STRIP_X + STRIP_W / 2} y={GY + SLOTS * SLOT_H + 29} textAnchor="middle" fontSize={10.5} fill={GRAY}>행사가 높음</text>
            {flat && (
              <text x={180} y={GY + ROWS * CELL + 26} textAnchor="middle" fontSize={12} fontWeight={700} fill={AMBER}>변동성 하나 = 칸 사이 차이 사라짐</text>
            )}
          </svg>
        );
      }}
    />
  );
}

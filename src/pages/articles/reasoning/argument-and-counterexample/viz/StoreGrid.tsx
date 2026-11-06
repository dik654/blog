export type StoreCell = "plain" | "electronics" | "other" | "noCard" | "dimElectronics" | "dimOther" | "dimNoCard";

const CELL = 19;
const GAP = 2;
const PITCH = CELL + GAP;
const LEFT = 2;
const TOP = 24;
const LABEL_X = LEFT + 10 * PITCH + 10;
const rowY = (row: number) => TOP + row * PITCH;

const STYLE: Record<StoreCell, { fill: string; stroke: string; opacity: number; dash?: string; slash?: boolean }> = {
  plain: { fill: "#94a3b8", stroke: "#94a3b8", opacity: 0.4 },
  electronics: { fill: "#2563eb", stroke: "#2563eb", opacity: 1 },
  other: { fill: "#fbbf24", stroke: "#d97706", opacity: 1, slash: true },
  noCard: { fill: "none", stroke: "#64748b", opacity: 1, dash: "2 2" },
  dimElectronics: { fill: "#2563eb", stroke: "#2563eb", opacity: 0.2 },
  dimOther: { fill: "#fbbf24", stroke: "#d97706", opacity: 0.25, slash: true },
  dimNoCard: { fill: "none", stroke: "#64748b", opacity: 0.35, dash: "2 2" },
};

/**
 * 가게 100곳을 10줄로 놓습니다. 위 4줄 = 전자제품 40곳, 다음 5줄 = 카드를 받는 식당·약국 50곳, 마지막 줄 = 카드를 받지 않는 10곳.
 * 칸 수가 곧 가게 수입니다.
 */
export function StoreGrid({
  groups,
  showCardOutline = false,
  showLabels = [true, true, true],
  markedCell,
  ariaLabel,
}: {
  groups: readonly [StoreCell, StoreCell, StoreCell];
  showCardOutline?: boolean;
  showLabels?: readonly [boolean, boolean, boolean];
  markedCell?: number;
  ariaLabel: string;
}) {
  const label = (show: boolean, y: number, height: number, name: string, count: string, color: string) =>
    show && (
      <g>
        <line x1={LABEL_X - 5} x2={LABEL_X - 5} y1={y + 1} y2={y + height - 1} stroke={color} strokeWidth={1} />
        <text x={LABEL_X + 2} y={y + height / 2 - 2} fontSize={13} fontWeight={700} fill={color}>{count}</text>
        <text x={LABEL_X + 2} y={y + height / 2 + 14} fontSize={12} fill="#64748b">{name}</text>
      </g>
    );
  const markX = markedCell === undefined ? 0 : LEFT + (markedCell % 10) * PITCH + CELL / 2;
  const markY = markedCell === undefined ? 0 : rowY(Math.floor(markedCell / 10)) + CELL / 2;
  return (
    <svg viewBox="0 0 360 248" className="mx-auto h-auto w-full max-w-[480px]" role="img" aria-label={ariaLabel}>
      {Array.from({ length: 100 }, (_, index) => {
        const row = Math.floor(index / 10);
        const group = row < 4 ? groups[0] : row < 9 ? groups[1] : groups[2];
        const style = STYLE[group];
        const x = LEFT + (index % 10) * PITCH;
        const y = rowY(row);
        return (
          <g key={index} opacity={style.opacity}>
            <rect x={x + 0.5} y={y + 0.5} width={CELL - 1} height={CELL - 1} rx={2} fill={style.fill} stroke={style.stroke} strokeWidth={1} strokeDasharray={style.dash} />
            {style.slash && <line x1={x + 4} y1={y + CELL - 4} x2={x + CELL - 4} y2={y + 4} stroke="#92400e" strokeWidth={1} />}
          </g>
        );
      })}
      {showCardOutline && (
        <g>
          <text x={LEFT} y={TOP - 8} fontSize={13} fontWeight={700} fill="#64748b">카드 결제 90곳 (실선 안)</text>
          <rect x={LEFT - 1.5} y={TOP - 1.5} width={10 * PITCH - GAP + 3} height={9 * PITCH - GAP + 3} rx={3} fill="none" stroke="#64748b" strokeWidth={1.25} />
        </g>
      )}
      {label(showLabels[0], rowY(0), 4 * PITCH - GAP, "전자제품", "40곳", "#2563eb")}
      {label(showLabels[1], rowY(4), 5 * PITCH - GAP, "식당·약국 (카드 O)", "50곳", "#b45309")}
      {label(showLabels[2], rowY(9), PITCH + 12, "카드 X", "10곳", "#64748b")}
      {markedCell !== undefined && (
        <g>
          <circle cx={markX} cy={markY} r={12} fill="#ffffff" stroke="#dc2626" strokeWidth={1.25} />
          <text x={markX} y={markY + 4.5} textAnchor="middle" fontSize={13} fontWeight={700} fill="#dc2626">A</text>
        </g>
      )}
    </svg>
  );
}

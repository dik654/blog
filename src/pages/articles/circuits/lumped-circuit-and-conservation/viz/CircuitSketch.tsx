export type WirePart = "source" | "first" | "left" | "right" | "return";

const X = { source: 40, firstStart: 100, firstEnd: 160, node: 205, right: 300 };

/** 화살촉 하나를 그립니다. angle은 도 단위이며 0이 오른쪽입니다. */
export function ArrowHead({ x, y, angle = 0, color = "#64748b" }: { x: number; y: number; angle?: number; color?: string }) {
  return <polygon points="-7,-4 0,0 -7,4" fill={color} transform={`translate(${x} ${y}) rotate(${angle})`} />;
}

/**
 * 본문 대응: 4절의 회로 — 전원, 첫 부품, 같은 두 점에 닿은 두 갈래.
 * highlight에 든 도선만 accent 색으로 칠합니다.
 */
export function CircuitSketch({ top, bottom, highlight = [], rightValue = "2 kΩ" }: { top: number; bottom: number; highlight?: readonly WirePart[]; rightValue?: string }) {
  const mid = (top + bottom) / 2;
  const paths: Record<WirePart, string> = {
    source: `M ${X.source} ${bottom} V ${top}`,
    first: `M ${X.source} ${top} H ${X.node}`,
    left: `M ${X.node} ${top} V ${bottom}`,
    right: `M ${X.node} ${top} H ${X.right} V ${bottom} H ${X.node}`,
    return: `M ${X.node} ${bottom} H ${X.source}`,
  };
  const parts = Object.keys(paths) as WirePart[];
  return (
    <g>
      {parts.map((part) => (
        <path key={part} d={paths[part]} fill="none" stroke={highlight.includes(part) ? "#d97706" : "#94a3b8"} strokeWidth={highlight.includes(part) ? 1.25 : 1} />
      ))}
      <circle cx={X.source} cy={mid} r={14} fill="#fef3c7" stroke="#d97706" strokeWidth={1} />
      <text x={X.source} y={mid + 4} textAnchor="middle" fontSize={11} fontWeight={700} fill="#92400e">12</text>
      <rect x={X.firstStart} y={top - 12} width={X.firstEnd - X.firstStart} height={24} rx={5} fill="#dbeafe" stroke="#2563eb" strokeWidth={1} />
      <text x={(X.firstStart + X.firstEnd) / 2} y={top + 4} textAnchor="middle" fontSize={11} fontWeight={700} fill="#1e40af">1 kΩ</text>
      <rect x={X.node - 26} y={mid - 12} width={52} height={24} rx={5} fill="#dcfce7" stroke="#16a34a" strokeWidth={1} />
      <text x={X.node} y={mid + 4} textAnchor="middle" fontSize={11} fontWeight={700} fill="#166534">2 kΩ</text>
      <rect x={X.right - 26} y={mid - 12} width={52} height={24} rx={5} fill="#dcfce7" stroke="#16a34a" strokeWidth={1} />
      <text x={X.right} y={mid + 4} textAnchor="middle" fontSize={11} fontWeight={700} fill="#166534">{rightValue}</text>
      <text x={X.node - 32} y={mid + 4} textAnchor="end" fontSize={10} fill="#64748b">왼쪽</text>
      <text x={X.right + 30} y={mid + 4} fontSize={10} fill="#64748b">오른쪽</text>
    </g>
  );
}

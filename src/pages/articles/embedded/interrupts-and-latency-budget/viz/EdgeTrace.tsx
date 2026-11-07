/** 입력 에지와 에지 비트를 같은 가로 순서에 그립니다. 가로 위치는 순서만 나타냅니다. */
export type TraceEdge = { x: number; color: string };
export type TraceMark = { x: number; label: string; color: string };

const LEFT = 70;
const RIGHT = 350;
const HIGH = 66;
const LOW = 96;

export default function EdgeTrace({
  edges,
  bit,
  end,
  marks,
  ariaLabel,
  bitColor = "#2563eb",
}: {
  edges: readonly TraceEdge[];
  /** 비트가 바뀌는 x 위치. 짝수 번째는 0→1, 홀수 번째는 1→0 입니다. */
  bit: readonly number[];
  end: number;
  marks: readonly TraceMark[];
  ariaLabel: string;
  bitColor?: string;
}) {
  const path = bit.reduce<string>(
    (d, x, index) => `${d}H${x}V${index % 2 === 0 ? HIGH : LOW}`,
    `M${LEFT} ${LOW}`,
  );
  return (
    <svg viewBox="0 0 360 152" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={ariaLabel}>
      <text x={8} y={34} fontSize={12} fill="#64748b">입력 에지</text>
      <line x1={LEFT} x2={RIGHT} y1={40} y2={40} stroke="#cbd5e1" strokeWidth={1} />
      {edges.map((edge) => (
        <path key={edge.x} d={`M${edge.x} 40V20M${edge.x - 4} 26L${edge.x} 20L${edge.x + 4} 26`} fill="none" stroke={edge.color} strokeWidth={1.25} />
      ))}
      <text x={8} y={86} fontSize={12} fill="#64748b">에지 비트</text>
      <text x={LEFT - 6} y={HIGH + 4} textAnchor="end" fontSize={10} fontFamily="monospace" fill="#64748b">1</text>
      <text x={LEFT - 6} y={LOW + 4} textAnchor="end" fontSize={10} fontFamily="monospace" fill="#64748b">0</text>
      <line x1={LEFT} x2={RIGHT} y1={LOW} y2={LOW} stroke="#cbd5e1" strokeWidth={1} />
      <path d={`${path}H${end}`} fill="none" stroke={bitColor} strokeWidth={1.25} />
      {marks.map((mark) => (
        <g key={mark.x}>
          <line x1={mark.x} x2={mark.x} y1={44} y2={122} stroke={mark.color} strokeWidth={1} strokeDasharray="3 3" />
          <text x={mark.x} y={138} textAnchor="middle" fontSize={11} fontWeight={700} fill={mark.color}>{mark.label}</text>
        </g>
      ))}
    </svg>
  );
}

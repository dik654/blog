/** 두 당사자 칸과 그 사이 두 갈래 화살표. 위치가 고정돼 장면을 넘겨도 화살표 방향만 바뀝니다. */
export interface PartyFlow {
  label: string;
  toRight: boolean;
  color: string;
}

function Party({ x, name, lines }: { x: number; name: string; lines: readonly string[] }) {
  return (
    <g>
      <rect x={x} y={0} width={112} height={96} rx={8} className="fill-background" stroke="#94a3b8" strokeWidth={1} />
      <text x={x + 56} y={20} textAnchor="middle" fontSize={13} fontWeight={700} className="fill-foreground">{name}</text>
      {lines.map((line, index) => (
        <text key={line} x={x + 56} y={44 + index * 18} textAnchor="middle" fontSize={13} className="fill-muted-foreground">{line}</text>
      ))}
    </g>
  );
}

function Arrow({ flow, y, left, right }: { flow: PartyFlow; y: number; left: number; right: number }) {
  const tip = flow.toRight ? right : left;
  const back = flow.toRight ? right - 7 : left + 7;
  return (
    <g>
      <text x={(left + right) / 2} y={y - 6} textAnchor="middle" fontSize={13} fontWeight={700} fill={flow.color}>{flow.label}</text>
      <line x1={left} x2={right} y1={y} y2={y} stroke={flow.color} strokeWidth={1.25} />
      <polygon points={`${tip},${y} ${back},${y - 4} ${back},${y + 4}`} fill={flow.color} />
    </g>
  );
}

export default function TwoPartyFlow({
  y,
  width,
  left,
  right,
  flows,
  center,
}: {
  y: number;
  width: number;
  left: { name: string; lines: readonly string[] };
  right: { name: string; lines: readonly string[] };
  flows: readonly PartyFlow[];
  center?: readonly string[];
}) {
  const laneLeft = 118;
  const laneRight = width - 118;
  return (
    <g transform={`translate(0 ${y})`}>
      <Party x={2} name={left.name} lines={left.lines} />
      <Party x={width - 114} name={right.name} lines={right.lines} />
      {flows.map((flow, index) => (
        <Arrow key={flow.label} flow={flow} y={36 + index * 38} left={laneLeft} right={laneRight} />
      ))}
      {center?.map((line, index) => (
        <text key={line} x={width / 2} y={42 + index * 18} textAnchor="middle" fontSize={13} fontWeight={index === 0 ? 400 : 700} className={index === 0 ? "fill-muted-foreground" : "fill-foreground"}>{line}</text>
      ))}
    </g>
  );
}

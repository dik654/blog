export default function VizBox({ x, y, w, h, c, t, s }: {
  x: number; y: number; w: number; h: number;
  c: string; t: string; s: string;
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={5} fill="var(--card)" />
      <rect x={x} y={y} width={w} height={h} rx={5}
        fill={`${c}10`} stroke={c} strokeWidth={1} />
      <text x={x + w / 2} y={y + 17} textAnchor="middle"
        fontSize={10} fontWeight={600} fill={c}>{t}</text>
      <text x={x + w / 2} y={y + 32} textAnchor="middle"
        fontSize={10} fill="var(--muted-foreground)">{s}</text>
    </g>
  );
}

import { RING_VALUES } from "./ringValues";

const CX = 170;
const CY = 158;
const R = 112;
const LABEL_R = 138;
const point = (position: number, radius: number) => {
  const angle = (position / RING_VALUES.length) * 2 * Math.PI - Math.PI / 2;
  return { x: CX + radius * Math.cos(angle), y: CY + radius * Math.sin(angle) };
};

/** 22칸 고리. 칸 번호는 5를 곱한 횟수, 칸 안의 수는 23으로 나눈 나머지입니다. */
export default function ResidueRing({
  ariaLabel,
  chain,
  chainColor,
  marks,
  outer = {},
  center,
  sizeClass = "max-w-[300px] sm:max-w-[420px]",
}: {
  ariaLabel: string;
  chain: readonly number[];
  chainColor: string;
  marks: Readonly<Record<number, string>>;
  outer?: Readonly<Record<number, string>>;
  center: readonly string[];
  sizeClass?: string;
}) {
  return (
    <svg viewBox="0 8 340 300" className={`mx-auto h-auto w-full ${sizeClass}`} role="img" aria-label={ariaLabel}>
      {chain.slice(1).map((position, index) => {
        const from = point(chain[index], R);
        const to = point(position, R);
        return <line key={index} x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={chainColor} strokeWidth={1.25} />;
      })}
      {RING_VALUES.map((value, position) => {
        const { x, y } = point(position, R);
        const fill = marks[position];
        return (
          <g key={position}>
            <circle cx={x} cy={y} r={13.5} className="fill-background" />
            <circle cx={x} cy={y} r={13.5} fill={fill ?? "#94a3b8"} fillOpacity={fill ? 1 : 0.12} stroke={fill ?? "#94a3b8"} strokeWidth={1} />
            <text x={x} y={y + 4} textAnchor="middle" fontSize={12.5} fontWeight={fill ? 700 : 500} fill={fill ? "#ffffff" : "#64748b"}>{value}</text>
          </g>
        );
      })}
      {Object.entries(outer).map(([position, label]) => {
        const { x, y } = point(Number(position), LABEL_R);
        return <text key={position} x={x} y={y + 4} textAnchor="middle" fontSize={11} fontWeight={600} fill="#64748b">{label}</text>;
      })}
      {center.map((line, index) => (
        <text key={line} x={CX} y={CY + 6 + (index - (center.length - 1) / 2) * 20} textAnchor="middle" fontSize={index === 0 ? 14 : 12} fontWeight={index === 0 ? 700 : 500} fill="#64748b">{line}</text>
      ))}
    </svg>
  );
}

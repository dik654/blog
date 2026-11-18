/**
 * 본문 대응: #lde-fri, #source — 가로축 T=0…7, 세로축 17로 나눈 나머지 0…16의 점 그림.
 * 점 하나가 한 평가 위치의 값입니다.
 */
export interface ChartDot {
  t: number;
  y: number;
  fill: string;
  hollow?: boolean;
  dashed?: boolean;
  label?: string;
  labelColor?: string;
}

const W = 360;
const H = 214;
const LEFT = 30;
const RIGHT = 14;
const TOP = 18;
const BASE = 182;
const x = (t: number) => LEFT + (t * (W - LEFT - RIGHT)) / 7;
const y = (v: number) => BASE - (v * (BASE - TOP)) / 16;

export default function ModChart({ dots, shadeRows = [], ariaLabel }: { dots: readonly ChartDot[]; shadeRows?: readonly number[]; ariaLabel: string }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={ariaLabel}>
      {shadeRows.map((t) => (
        <rect key={`s${t}`} x={x(t) - 14} y={TOP - 8} width={28} height={BASE - TOP + 8} rx={4} fill="#94a3b8" opacity={0.16} />
      ))}
      {[0, 4, 8, 12, 16].map((v) => (
        <g key={v}>
          <line x1={LEFT} x2={W - RIGHT} y1={y(v)} y2={y(v)} stroke="#94a3b8" strokeWidth={v === 0 ? 1 : 0.5} opacity={v === 0 ? 1 : 0.5} />
          <text x={LEFT - 6} y={y(v) + 4} textAnchor="end" fontSize={10} fill="#64748b">{v}</text>
        </g>
      ))}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((t) => (
        <text key={t} x={x(t)} y={BASE + 18} textAnchor="middle" fontSize={11} fill="#64748b">{`T=${t}`}</text>
      ))}
      {dots.map((d, i) => (
        <g key={`${d.t}-${i}`}>
          <circle
            cx={x(d.t)}
            cy={y(d.y)}
            r={5.5}
            fill={d.hollow ? "none" : d.fill}
            stroke={d.fill}
            strokeWidth={1.25}
            strokeDasharray={d.dashed ? "2 2" : undefined}
          />
          {d.label && (
            <text x={x(d.t)} y={y(d.y) - 10} textAnchor="middle" fontSize={11} fontWeight={700} fill={d.labelColor ?? d.fill}>
              {d.label}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}

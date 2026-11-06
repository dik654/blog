import { fmt } from "./amplitudeFormat";
/**
 * 네 후보의 중간값을 같은 눈금의 막대로 그립니다. 4절과 7절 Viz가 함께 씁니다.
 * 막대 아래 확률은 값의 제곱이므로 부호가 바뀌어도 같다는 점을 숫자로 대조합니다.
 */
const W = 360;
const H = 268;
const LEFT = 30;
const RIGHT = 50;
const TOP = 16;
const BOTTOM = 56;
const V_MAX = 1.15;
const NAMES = ["00", "01", "10", "11"] as const;

const ANSWER = "#2563eb";
const OTHER = "#64748b";
const REFLECT = "#d97706";
const COL = (W - LEFT - RIGHT) / 4;
const BAR = 30;

const py = (value: number) => TOP + ((V_MAX - value) / (2 * V_MAX)) * (H - TOP - BOTTOM);
const barX = (index: number) => LEFT + COL * index + (COL - BAR) / 2 - 6;

export default function AmplitudeBars({
  values,
  before,
  mean,
  label,
}: {
  values: readonly number[];
  before?: readonly number[];
  mean?: number;
  label: string;
}) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto mt-3 h-auto w-full max-w-[460px]" role="img" aria-label={label}>
      {[1, 0.5, -0.5, -1].map((tick) => (
        <g key={tick}>
          <line x1={LEFT} x2={W - RIGHT} y1={py(tick)} y2={py(tick)} stroke="#94a3b8" strokeWidth={0.5} strokeDasharray="2 3" />
          <text x={LEFT - 5} y={py(tick) + 4} textAnchor="end" fontSize={11} fill="#64748b">{fmt(tick)}</text>
        </g>
      ))}
      <line x1={LEFT} x2={W - RIGHT} y1={py(0)} y2={py(0)} stroke="#94a3b8" strokeWidth={1} />
      <text x={LEFT - 5} y={py(0) + 4} textAnchor="end" fontSize={11} fill="#64748b">0</text>

      {values.map((value, index) => {
        const x = barX(index);
        const color = index === 0 ? ANSWER : OTHER;
        const y = Math.min(py(value), py(0));
        const height = Math.abs(py(value) - py(0));
        const old = before?.[index];
        return (
          <g key={NAMES[index]}>
            {old !== undefined && (
              <rect
                x={x}
                y={Math.min(py(old), py(0))}
                width={BAR}
                height={Math.abs(py(old) - py(0))}
                fill="none"
                stroke={color}
                strokeWidth={1}
                strokeDasharray="3 3"
              />
            )}
            {height > 0 && <rect x={x} y={y} width={BAR} height={height} fill={color} opacity={0.8} />}
            {height === 0 && <line x1={x} x2={x + BAR} y1={py(0)} y2={py(0)} stroke={color} strokeWidth={1.25} />}
            {old !== undefined && (
              <g>
                <line x1={x + BAR + 7} x2={x + BAR + 7} y1={py(old)} y2={py(value)} stroke={REFLECT} strokeWidth={1.25} />
                <path
                  d={
                    value > old
                      ? `M${x + BAR + 3} ${py(value) + 6} L${x + BAR + 7} ${py(value)} L${x + BAR + 11} ${py(value) + 6}`
                      : `M${x + BAR + 3} ${py(value) - 6} L${x + BAR + 7} ${py(value)} L${x + BAR + 11} ${py(value) - 6}`
                  }
                  fill="none"
                  stroke={REFLECT}
                  strokeWidth={1.25}
                />
              </g>
            )}
            <text
              x={x + BAR / 2}
              y={value < 0 ? py(value) + 15 : py(value) - 5}
              textAnchor="middle"
              fontSize={13}
              fontWeight={700}
              fill={color}
            >
              {fmt(value)}
            </text>
            <text x={x + BAR / 2} y={H - 30} textAnchor="middle" fontSize={13} fontWeight={700} fill={color}>
              {NAMES[index]}
              {index === 0 ? " 정답" : ""}
            </text>
            <text x={x + BAR / 2} y={H - 10} textAnchor="middle" fontSize={12} fill="#64748b">
              확률 {Number((value * value).toFixed(4))}
            </text>
          </g>
        );
      })}

      {mean !== undefined && (
        <g>
          <line x1={LEFT} x2={W - RIGHT + 2} y1={py(mean)} y2={py(mean)} stroke={REFLECT} strokeWidth={1.25} strokeDasharray="6 3" />
          <text x={W - RIGHT + 6} y={py(mean) - 2} fontSize={12} fontWeight={700} fill={REFLECT}>평균</text>
          <text x={W - RIGHT + 6} y={py(mean) + 13} fontSize={12} fontWeight={700} fill={REFLECT}>{fmt(mean)}</text>
        </g>
      )}
    </svg>
  );
}

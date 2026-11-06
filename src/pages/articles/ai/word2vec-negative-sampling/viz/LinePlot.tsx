import { useId } from "react";

export interface PlotSeries {
  points: readonly (readonly [number, number])[];
  color: string;
  dash?: string;
  dim?: boolean;
}

export interface PlotMarker {
  x: number;
  y: number;
  color: string;
  label?: string;
  dx?: number;
  dy?: number;
  anchor?: "start" | "middle" | "end";
}

export interface PlotGuide {
  x?: number;
  y?: number;
  label?: string;
  color?: string;
  dx?: number;
  dy?: number;
  anchor?: "start" | "middle" | "end";
}

const W = 360;
const DEFAULT_H = 224;
const L = 38;
const R = 12;
const T = 14;
const B = 40;

/** 이 글의 함수 그래프가 함께 쓰는 축과 곡선입니다. 범위 밖 곡선은 잘라 냅니다. */
export default function LinePlot({
  domain,
  range,
  xTicks,
  yTicks,
  xLabel,
  yLabel,
  series,
  markers = [],
  guides = [],
  ariaLabel,
  height = DEFAULT_H,
}: {
  domain: readonly [number, number];
  range: readonly [number, number];
  xTicks: readonly { at: number; text: string }[];
  yTicks: readonly { at: number; text: string }[];
  xLabel: string;
  yLabel: string;
  series: readonly PlotSeries[];
  markers?: readonly PlotMarker[];
  guides?: readonly PlotGuide[];
  ariaLabel: string;
  height?: number;
}) {
  const H = height;
  const clip = useId();
  const sx = (x: number) => L + ((x - domain[0]) / (domain[1] - domain[0])) * (W - L - R);
  const sy = (y: number) => H - B - ((y - range[0]) / (range[1] - range[0])) * (H - T - B);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={ariaLabel}>
      <defs>
        <clipPath id={clip}>
          <rect x={L} y={T} width={W - L - R} height={H - T - B} />
        </clipPath>
      </defs>
      {yTicks.map((tick) => (
        <g key={tick.at}>
          <line x1={L} x2={W - R} y1={sy(tick.at)} y2={sy(tick.at)} stroke="#94a3b8" strokeWidth={1} opacity={0.25} />
          <text x={L - 5} y={sy(tick.at) + 4} textAnchor="end" fontSize={10.5} fill="#64748b">{tick.text}</text>
        </g>
      ))}
      <line x1={L} x2={W - R} y1={H - B} y2={H - B} stroke="#94a3b8" strokeWidth={1} />
      {xTicks.map((tick) => (
        <text key={tick.at} x={sx(tick.at)} y={H - B + 15} textAnchor="middle" fontSize={10.5} fill="#64748b">{tick.text}</text>
      ))}
      <text x={(L + W - R) / 2} y={H - 6} textAnchor="middle" fontSize={11} fill="#64748b">{xLabel}</text>
      <text x={L} y={10} fontSize={11} fill="#64748b">{yLabel}</text>
      {guides.map((guide, index) => {
        const color = guide.color ?? "#94a3b8";
        return (
          <g key={index}>
            {guide.x !== undefined ? (
              <line x1={sx(guide.x)} x2={sx(guide.x)} y1={T} y2={H - B} stroke={color} strokeWidth={1} strokeDasharray="3 3" />
            ) : (
              <line x1={L} x2={W - R} y1={sy(guide.y ?? 0)} y2={sy(guide.y ?? 0)} stroke={color} strokeWidth={1} strokeDasharray="3 3" />
            )}
            {guide.label && (
              <text
                x={(guide.x !== undefined ? sx(guide.x) : W - R) + (guide.dx ?? 0)}
                y={(guide.y !== undefined ? sy(guide.y) : T + 10) + (guide.dy ?? 0)}
                textAnchor={guide.anchor ?? "end"}
                fontSize={10.5}
                fill={color}
              >
                {guide.label}
              </text>
            )}
          </g>
        );
      })}
      <g clipPath={`url(#${clip})`}>
        {series.map((line, index) => (
          <polyline
            key={index}
            points={line.points.map(([x, y]) => `${sx(x).toFixed(1)},${sy(y).toFixed(1)}`).join(" ")}
            fill="none"
            stroke={line.color}
            strokeWidth={1.25}
            strokeDasharray={line.dash}
            opacity={line.dim ? 0.3 : 1}
          />
        ))}
      </g>
      {markers.map((marker, index) => (
        <g key={index}>
          <circle cx={sx(marker.x)} cy={sy(marker.y)} r={3.5} fill={marker.color} />
          {marker.label && (
            <text x={sx(marker.x) + (marker.dx ?? 7)} y={sy(marker.y) + (marker.dy ?? -6)} textAnchor={marker.anchor ?? "start"} fontSize={11} fontWeight={700} fill={marker.color}>
              {marker.label}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}

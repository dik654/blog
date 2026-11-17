import type { ReactNode } from "react";

/**
 * 두 QAT Viz가 같이 쓰는 좌표판입니다. 가로축 x(입력), 세로축 x̂(fake quantizer 출력).
 * 가정: scale s=0.5, zero-point z=0, code q는 −4…3 → x̂는 −2, −1.5, …, 1.5.
 */
const W = 360;
const H = 184;
const CX = 180;
const CY = 92;
const UX = 50;
const UY = 32;
const px = (x: number) => CX + UX * x;
const py = (y: number) => CY - UY * y;
const CODES = [-4, -3, -2, -1, 0, 1, 2, 3];
const S = 0.5;

export default function StaircasePlot({
  showIdentity,
  showSteps,
  ariaLabel,
  children,
}: {
  showIdentity: boolean;
  showSteps: boolean;
  ariaLabel: string;
  children: (px: (x: number) => number, py: (y: number) => number) => ReactNode;
}) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={ariaLabel} className="mx-auto block h-auto w-full max-w-[400px]">
      <line x1={px(-3)} x2={px(3)} y1={CY} y2={CY} stroke="#94a3b8" strokeWidth={1} />
      <line x1={CX} x2={CX} y1={py(2.7)} y2={py(-2.6)} stroke="#94a3b8" strokeWidth={1} />
      <text x={px(3) - 2} y={CY + 14} textAnchor="end" fontSize={11} fill="#64748b">x</text>
      <text x={CX + 6} y={py(2.7) + 8} fontSize={11} fill="#64748b">x̂</text>
      {[-2, -1, 1, 2].map((v) => (
        <g key={v}>
          <line x1={px(v)} x2={px(v)} y1={CY - 3} y2={CY + 3} stroke="#94a3b8" strokeWidth={1} />
          <text x={px(v)} y={CY + 15} textAnchor="middle" fontSize={10} fill="#64748b">{v}</text>
        </g>
      ))}
      {showIdentity && (
        <line x1={px(-2.6)} y1={py(-2.6)} x2={px(2.7)} y2={py(2.7)} stroke="#94a3b8" strokeWidth={1} strokeDasharray="4 4" />
      )}
      {showSteps &&
        CODES.map((q) => {
          const lo = q === CODES[0] ? -3 : S * q - S / 2;
          const hi = q === CODES[CODES.length - 1] ? 3 : S * q + S / 2;
          return <line key={q} x1={px(lo)} x2={px(hi)} y1={py(S * q)} y2={py(S * q)} stroke="#2563eb" strokeWidth={1.25} />;
        })}
      {children(px, py)}
    </svg>
  );
}

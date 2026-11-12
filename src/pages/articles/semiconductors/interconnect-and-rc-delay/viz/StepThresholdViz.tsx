import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #limits — 배선 없는 500 Ω·20 fF, RC = 10 ps.
 * 이상적인 순간 전압 변화에서 받는 쪽 전압 1 − e^(−t/RC)는 t = RC×ln2 ≈ 6.93 ps에 50%를 지난다.
 */
const RC = 10;
const T_MAX = 30;
const X0 = 50;
const X1 = 380;
const Y0 = 170;
const Y1 = 30;
const HALF_T = RC * Math.LN2;

const xOf = (t: number) => X0 + (t / T_MAX) * (X1 - X0);
const yOf = (v: number) => Y0 - v * (Y0 - Y1);
const CURVE = Array.from({ length: 61 }, (_, i) => (i / 60) * T_MAX)
  .map((t) => `${xOf(t).toFixed(1)},${yOf(1 - Math.exp(-t / RC)).toFixed(1)}`)
  .join(" ");

const LINE = "#94a3b8";
const TEXT = "#64748b";
const BLUE = "#2563eb";
const AMBER = "#d97706";

export default function StepThresholdViz() {
  return (
    <VizFrame
      eyebrow="시간 척도와 도달 시각"
      title="RC = 10 ps는 50%에 도달하는 시각이 아닙니다"
      description="배선을 뺀 500 Ω·20 fF 회로에서 출력 전압이 순간적으로 바뀐다고 둔 이상적인 경우입니다. 이때 받는 쪽 전압은 1 − e^(−t/RC) 모양으로 올라가므로 50%에는 RC×ln2에 닿습니다."
      note="ln2는 저장점이 하나인 이 회로의 이상적인 경우에서 나온 계수입니다. 배선을 더한 여러 저장점 회로의 첫 모멘트(74 ps)에 ln2 하나를 곱해 정확한 50% 시각이라고 할 수는 없습니다."
    >
      <div className="w-full min-w-0 overflow-x-auto">
        <svg viewBox="0 0 400 208" className="mx-auto h-auto w-full min-w-[20rem] max-w-[560px]" role="img" aria-label="받는 쪽 전압이 6.93 피코초에 50퍼센트, 그 뒤 10 피코초에 RC 시간 척도를 지나는 곡선">
          <line x1={X0} x2={X1} y1={Y0} y2={Y0} stroke={LINE} strokeWidth={1} />
          <line x1={X0} x2={X0} y1={Y0} y2={Y1} stroke={LINE} strokeWidth={1} />
          <line x1={X0} x2={X1} y1={Y1} y2={Y1} stroke={LINE} strokeWidth={1} strokeDasharray="2 4" />
          <text x={X0 - 6} y={Y1 + 4} textAnchor="end" fontSize={13} fill={TEXT}>100%</text>
          <text x={X0 - 6} y={yOf(0.5) + 4} textAnchor="end" fontSize={13} fill={BLUE}>50%</text>
          <text x={X0 - 6} y={Y0 + 4} textAnchor="end" fontSize={13} fill={TEXT}>0</text>
          {[20, 30].map((t) => (
            <text key={t} x={xOf(t)} y={Y0 + 16} textAnchor="middle" fontSize={13} fill={TEXT}>{t}</text>
          ))}
          <text x={X1} y={Y0 + 30} textAnchor="end" fontSize={13} fill={TEXT}>시간(ps)</text>
          <polyline points={CURVE} fill="none" stroke={TEXT} strokeWidth={1.25} />
          <text x={xOf(20)} y={yOf(0.86) + 24} fontSize={13} fill={TEXT}>받는 쪽 전압</text>
          <line x1={X0} x2={xOf(HALF_T)} y1={yOf(0.5)} y2={yOf(0.5)} stroke={BLUE} strokeWidth={1} strokeDasharray="4 3" />
          <line x1={xOf(HALF_T)} x2={xOf(HALF_T)} y1={yOf(0.5)} y2={Y0} stroke={BLUE} strokeWidth={1} strokeDasharray="4 3" />
          <circle cx={xOf(HALF_T)} cy={yOf(0.5)} r={3} fill={BLUE} />
          <text x={xOf(HALF_T) - 4} y={Y0 + 16} textAnchor="end" fontSize={13} fontWeight={700} fill={BLUE}>6.93 ps</text>
          <line x1={xOf(RC)} x2={xOf(RC)} y1={Y1} y2={Y0} stroke={AMBER} strokeWidth={1} />
          <text x={xOf(RC) + 4} y={Y1 + 16} fontSize={13} fontWeight={700} fill={AMBER}>RC = 10 ps</text>
          <text x={xOf(RC) + 4} y={Y0 + 16} fontSize={13} fill={AMBER}>10</text>
          <text x={xOf(HALF_T) - 4} y={yOf(0.5) - 8} textAnchor="end" fontSize={13} fill={BLUE}>50% 도달</text>
        </svg>
      </div>
    </VizFrame>
  );
}

import SceneShell from "./SceneShell";

/**
 * 본문 대응: 두 번째 ExplainedFormula — ∂hₜ/∂h_{t−k} = Jₜ⋯J_{t−k+1}.
 * 한 step이 방향 A를 0.5배, 방향 B를 1.2배 하는 J를 k번 반복(가정, 매 step 같은 J).
 * A: 1 → 0.5 → 0.125 → 0.0156, B: 1 → 1.2 → 1.728 → 2.986.
 */
const SHRINK = 0.5;
const GROW = 1.2;
const KS = [0, 1, 3, 6] as const;

const UNIT = 20;
const CX = 90;
const CY = 100;

const CHART_X0 = 210;
const CHART_X1 = 344;
const CHART_Y_TOP = 26;
const CHART_Y_BOTTOM = 172;
const LOG_MIN = -2;
const LOG_MAX = 0.6;

const RED = "#dc2626";
const BLUE = "#2563eb";
const GREY = "#94a3b8";

const fmt = (value: number) => (value >= 0.1 ? value.toFixed(value >= 1 ? 2 : 3) : value.toFixed(4));

const SCENES = [
  { label: "k = 0", summary: "A 1 · B 1", note: "아직 Jacobian을 한 번도 지나지 않았습니다. 점선 원은 모든 방향의 크기가 1인 출발점입니다." },
  { label: "k = 1", summary: "A 0.5 · B 1.2", note: "한 step의 J가 방향 A는 0.5배로 줄이고 방향 B는 1.2배로 늘린다고 가정했습니다. 같은 matrix 곱 한 번이 방향마다 다른 배율을 줍니다." },
  { label: "k = 3", summary: "A 0.125 · B 1.73", note: "세 번 곱하면 A는 0.5³=0.125, B는 1.2³≈1.73입니다. 원이 한쪽으로 납작해지고 다른 쪽으로 길어집니다." },
  { label: "k = 6", summary: "A 0.0156 · B 2.99", note: "여섯 번이면 A는 0.5⁶≈0.0156으로 거의 사라지고(vanishing) B는 1.2⁶≈2.99로 커집니다(exploding). 한 product 안에서 둘이 함께 생길 수 있습니다." },
] as const;

const logY = (value: number) => CHART_Y_BOTTOM - ((Math.log10(value) - LOG_MIN) / (LOG_MAX - LOG_MIN)) * (CHART_Y_BOTTOM - CHART_Y_TOP);
const kX = (k: number) => CHART_X0 + (k / 6) * (CHART_X1 - CHART_X0);

export default function JacobianDirectionViz() {
  return (
    <SceneShell
      eyebrow="Jacobian을 k번 지난 뒤"
      title="반복 Jacobian product는 방향마다 다른 속도로 줄이거나 키웁니다"
      description="왼쪽은 크기 1인 신호가 k번의 transition을 지난 뒤의 모양, 오른쪽은 두 방향 A·B의 크기(log 눈금)입니다. 배율 0.5·1.2와 매 step 같은 J는 가정입니다. 실제 Jⱼ는 매 시점 state가 정하는 tanh derivative 때문에 step마다 달라집니다."
      ariaLabel="같은 Jacobian을 반복해 곱할 때 한 방향은 줄고 다른 방향은 커지는 모습"
      scenes={SCENES}
      render={(active) => {
        const k = KS[active];
        const a = SHRINK ** k;
        const b = GROW ** k;
        const shown = (KS as readonly number[]).slice(0, active + 1);
        const pathFor = (factor: number) => shown.map((step, index) => `${index === 0 ? "M" : "L"} ${kX(step)} ${logY(factor ** step)}`).join(" ");
        return (
          <svg viewBox="0 0 360 206" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`k=${k}: 방향 A ${fmt(a)}, 방향 B ${fmt(b)}`}>
            <line x1={CX - 82} x2={CX + 82} y1={CY} y2={CY} stroke="#e2e8f0" strokeWidth={1} />
            <line x1={CX} x2={CX} y1={CY - 70} y2={CY + 70} stroke="#e2e8f0" strokeWidth={1} />
            <circle cx={CX} cy={CY} r={UNIT} fill="none" stroke={GREY} strokeWidth={1} strokeDasharray="3 3" />
            <ellipse cx={CX} cy={CY} rx={UNIT * b} ry={Math.max(UNIT * a, 0.6)} fill="#2563eb" fillOpacity={0.08} stroke={BLUE} strokeWidth={1.25} />
            <line x1={CX} x2={CX} y1={CY} y2={CY - Math.max(UNIT * a, 0.6)} stroke={RED} strokeWidth={1.25} />
            <text x={CX + 5} y={CY - 56} fontSize={13} fill={RED}>{`A ${fmt(a)}`}</text>
            <text x={CX} y={CY + 70} textAnchor="middle" fontSize={13} fill={BLUE}>{`B ${fmt(b)}`}</text>

            <line x1={CHART_X0} x2={CHART_X1} y1={logY(1)} y2={logY(1)} stroke={GREY} strokeWidth={1} strokeDasharray="3 3" />
            <text x={CHART_X1} y={logY(1) - 4} textAnchor="end" fontSize={11} fill="#64748b">크기 1</text>
            <line x1={CHART_X0} x2={CHART_X0} y1={CHART_Y_TOP} y2={CHART_Y_BOTTOM} stroke={GREY} strokeWidth={1} />
            <line x1={CHART_X0} x2={CHART_X1} y1={CHART_Y_BOTTOM} y2={CHART_Y_BOTTOM} stroke={GREY} strokeWidth={1} />
            {[0.01, 0.1, 1].map((tick) => (
              <text key={tick} x={CHART_X0 - 4} y={logY(tick) + 3} textAnchor="end" fontSize={11} fill="#64748b">{tick}</text>
            ))}
            {KS.map((step) => (
              <text key={step} x={kX(step)} y={CHART_Y_BOTTOM + 13} textAnchor="middle" fontSize={11} fill="#64748b">{step}</text>
            ))}
            <text x={CHART_X1} y={CHART_Y_BOTTOM + 28} textAnchor="end" fontSize={11} fill="#64748b">k</text>
            <path d={pathFor(SHRINK)} fill="none" stroke={RED} strokeWidth={1.25} />
            <path d={pathFor(GROW)} fill="none" stroke={BLUE} strokeWidth={1.25} />
            {shown.map((step) => (
              <g key={`p-${step}`}>
                <circle cx={kX(step)} cy={logY(SHRINK ** step)} r={2.5} fill={RED} />
                <circle cx={kX(step)} cy={logY(GROW ** step)} r={2.5} fill={BLUE} />
              </g>
            ))}
            <text x={CHART_X0 + 6} y={CHART_Y_TOP + 4} fontSize={11} fill={BLUE}>B ×1.2씩</text>
            <text x={CHART_X0 + 6} y={CHART_Y_BOTTOM - 6} fontSize={11} fill={RED}>A ×0.5씩</text>
          </svg>
        );
      }}
    />
  );
}

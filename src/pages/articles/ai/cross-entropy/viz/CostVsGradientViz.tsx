import SceneShell from "./SceneShell";

/**
 * 본문 대응: #softmax-ce-gradient — 정답 확률 Q에서 비용 −lnQ와 정답 로짓 기울기 Q−1.
 * Q=0.9: 0.105 / −0.1, Q=0.5: 0.693 / −0.5, Q=0.01: 4.605 / −0.99.
 */
const POINTS = [
  { q: 0.9, cost: "0.105", grad: "−0.1" },
  { q: 0.5, cost: "0.693", grad: "−0.5" },
  { q: 0.01, cost: "4.605", grad: "−0.99" },
] as const;

const SCENES = [
  { label: "비용", summary: "0.105 → 0.693 → 4.605 nat", note: "정답 확률이 0.9, 0.5, 0.01로 작아질수록 비용은 약 0.105, 0.693, 4.605 nat으로 커집니다. 0에 다가가면 끝없이 커집니다." },
  { label: "기울기", summary: "−0.1 → −0.5 → −0.99", note: "softmax와 합성한 정답 로짓의 기울기는 Q−1입니다. 같은 세 확률에서 −0.1, −0.5, −0.99이며 −1 아래로 내려가지 않습니다." },
  { label: "정답 확률 0.01", summary: "비용 4.605 · 기울기 −0.99", note: "같은 자리에서 비용은 눈금 위쪽에 있지만 기울기는 −1 안쪽에 머뭅니다. 큰 손실을 모든 변수에 대한 무한한 교정으로 해석하지 않는 이유입니다." },
] as const;

const X0 = 40;
const X1 = 340;
const Y_TOP = 12;
const PER_UNIT = 27;
const x = (q: number) => X0 + (X1 - X0) * q;
const y = (value: number) => Y_TOP + (5 - value) * PER_UNIT;
const Q_START = Math.exp(-5);
const STEPS = Array.from({ length: 120 }, (_, index) => Q_START + ((1 - Q_START) * index) / 119);
const COST_PATH = STEPS.map((q, index) => `${index === 0 ? "M" : "L"}${x(q).toFixed(1)} ${y(-Math.log(q)).toFixed(1)}`).join(" ");
const COST_COLOR = "#2563eb";
const GRAD_COLOR = "#d97706";

export default function CostVsGradientViz() {
  return (
    <SceneShell
      eyebrow="비용과 교정의 크기"
      title="비용은 끝없이 커져도 정답 로짓의 기울기는 −1 안쪽입니다"
      description="가로는 정답에 준 확률, 세로는 값입니다. 파란 선은 비용 −lnQ(nat), 주황 선은 정답 로짓의 기울기 Q−1입니다."
      ariaLabel="정답 확률에 따른 비용과 정답 로짓 기울기의 비교 그래프"
      scenes={SCENES}
      render={(active) => {
        const showCost = active !== 1;
        const showGrad = active !== 0;
        const points: readonly (typeof POINTS)[number][] = active === 2 ? POINTS.filter((point) => point.q === 0.01) : POINTS;
        return (
          <svg viewBox="0 0 360 214" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {[-1, 0, 2, 4].map((tick) => (
              <g key={tick}>
                <line x1={X0} x2={X1} y1={y(tick)} y2={y(tick)} stroke={tick === 0 ? "#94a3b8" : "#cbd5e1"} strokeWidth={1} strokeDasharray={tick === 0 ? undefined : "2 4"} />
                <text x={X0 - 6} y={y(tick) + 4} textAnchor="end" fontSize={11} fill="#64748b">{tick < 0 ? `−${-tick}` : tick}</text>
              </g>
            ))}
            {[0, 0.5, 1].map((tick) => (
              <text key={tick} x={x(tick)} y={208} textAnchor="middle" fontSize={12} fill="#64748b">{`Q=${tick}`}</text>
            ))}
            {showCost && <path d={COST_PATH} fill="none" stroke={COST_COLOR} strokeWidth={1.25} />}
            {showCost && <text x={92} y={88} fontSize={12} fill={COST_COLOR}>비용 −lnQ</text>}
            {showGrad && <text x={238} y={170} fontSize={12} fill={GRAD_COLOR}>기울기 Q−1</text>}
            {showGrad && <line x1={x(0)} y1={y(-1)} x2={x(1)} y2={y(0)} stroke={GRAD_COLOR} strokeWidth={1.25} />}
            {active === 2 && <line x1={x(0.01)} x2={x(0.01)} y1={y(-Math.log(0.01))} y2={y(-0.99)} stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />}
            {points.map((point) => (
              <g key={point.q}>
                {showCost && (
                  <>
                    <circle cx={x(point.q)} cy={y(-Math.log(point.q))} r={3.5} fill={COST_COLOR} />
                    <text x={x(point.q) + (point.q === 0.9 ? -4 : 7)} y={y(-Math.log(point.q)) - (point.q === 0.01 ? -4 : 8)} textAnchor={point.q === 0.9 ? "end" : "start"} fontSize={12} fontWeight={700} fill={COST_COLOR}>{point.q === 0.01 ? `Q=0.01 · ${point.cost}` : point.cost}</text>
                  </>
                )}
                {showGrad && (
                  <>
                    <circle cx={x(point.q)} cy={y(point.q - 1)} r={3.5} fill={GRAD_COLOR} />
                    <text x={x(point.q) + 7} y={y(point.q - 1) + 15} fontSize={12} fontWeight={700} fill={GRAD_COLOR}>{point.grad}</text>
                  </>
                )}
              </g>
            ))}
          </svg>
        );
      }}
    />
  );
}

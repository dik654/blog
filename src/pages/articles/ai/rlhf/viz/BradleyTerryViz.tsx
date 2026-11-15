import SceneShell from "./SceneShell";

/**
 * 본문 대응: #reward-model Bradley–Terry 식.
 * 가정: r(x,y+) = 1.0, r(x,y−) = −0.5, 두 점수에 더하는 상수 c = 2.
 * Δr = 1.5 → σ(1.5) = 0.818 → −log 0.818 = 0.201. 순서가 뒤집힌 Δr = −1.5 → σ = 0.182 → loss 1.701.
 */
const R_PLUS = 1.0;
const R_MINUS = -0.5;
const SHIFT = 2;
const GAP = R_PLUS - R_MINUS;

const fx = (v: number) => v.toFixed(1).replace("-", "−");
const sigmoid = (z: number) => 1 / (1 + Math.exp(-z));
const loss = (z: number) => -Math.log(sigmoid(z));

const W = 360;
const H = 190;
const PAD_L = 34;
const PAD_R = 14;
const TOP = 18;
const BOTTOM = 158;

const SCENES = [
  { label: "점수 두 개", summary: `Δr = ${R_PLUS.toFixed(1)} − (${fx(R_MINUS)}) = ${GAP.toFixed(1)}`, note: "Reward model이 chosen y+와 rejected y−에 각각 점수를 줍니다. 식이 쓰는 것은 두 점수 자체가 아니라 그 차이 Δr입니다. 점수 값은 가정입니다." },
  { label: "둘 다 +2를 더하면", summary: `Δr는 그대로 ${GAP.toFixed(1)}`, note: "같은 prompt의 두 점수에 같은 상수를 더해도 차이는 바뀌지 않습니다. 그래서 data만으로는 reward의 절대 원점을 정할 수 없습니다." },
  { label: "차이를 확률로", summary: `σ(${GAP.toFixed(1)}) = ${sigmoid(GAP).toFixed(2)}`, note: "Sigmoid σ는 어떤 실수든 0과 1 사이로 접는 S자 함수입니다. 차이가 0이면 0.5, 클수록 1에 가까워집니다. 이 값이 ‘chosen이 이길 확률’ p+입니다." },
  { label: "확률을 벌점으로", summary: `−log ${sigmoid(GAP).toFixed(2)} = ${loss(GAP).toFixed(2)} · 뒤집히면 ${loss(-GAP).toFixed(2)}`, note: "Loss는 −log p+입니다. 순서를 맞게 매긴 Δr = 1.5의 벌점은 0.20이지만, 같은 크기로 순서를 거꾸로 매긴 Δr = −1.5에서는 1.70으로 커집니다. p+가 0에 가까울수록 벌점은 끝없이 커집니다." },
] as const;

function NumberLine({ shift }: { shift: number }) {
  const lo = -1;
  const hi = 4;
  const nx = (v: number) => PAD_L + ((v - lo) / (hi - lo)) * (W - PAD_L - PAD_R);
  const y = 100;
  const plus = R_PLUS + shift;
  const minus = R_MINUS + shift;
  return (
    <g>
      <line x1={nx(lo)} x2={nx(hi)} y1={y} y2={y} stroke="#94a3b8" strokeWidth={1} />
      {[-1, 0, 1, 2, 3, 4].map((v) => (
        <g key={v}>
          <line x1={nx(v)} x2={nx(v)} y1={y - 4} y2={y + 4} stroke="#94a3b8" strokeWidth={1} />
          <text x={nx(v)} y={y + 18} textAnchor="middle" fontSize={10} fill="#64748b">{v}</text>
        </g>
      ))}
      <circle cx={nx(minus)} cy={y} r={6} fill="#64748b" />
      <text x={nx(minus)} y={y - 14} textAnchor="middle" fontSize={11} fontWeight={700} fill="#475569">y− {fx(minus)}</text>
      <circle cx={nx(plus)} cy={y} r={6} fill="#2563eb" />
      <text x={nx(plus)} y={y - 14} textAnchor="middle" fontSize={11} fontWeight={700} fill="#2563eb">y+ {fx(plus)}</text>
      <line x1={nx(minus)} x2={nx(plus)} y1={y + 32} y2={y + 32} stroke="#d97706" strokeWidth={1.25} />
      <line x1={nx(minus)} x2={nx(minus)} y1={y + 27} y2={y + 37} stroke="#d97706" strokeWidth={1.25} />
      <line x1={nx(plus)} x2={nx(plus)} y1={y + 27} y2={y + 37} stroke="#d97706" strokeWidth={1.25} />
      <text x={(nx(minus) + nx(plus)) / 2} y={y + 50} textAnchor="middle" fontSize={11} fontWeight={700} fill="#b45309">Δr = {GAP.toFixed(1)}</text>
      {shift !== 0 && (
        <text x={W / 2} y={36} textAnchor="middle" fontSize={11} fill="#64748b">두 점수 모두 +{shift} 이동 (가정)</text>
      )}
    </g>
  );
}

function Curve({ kind }: { kind: "prob" | "loss" }) {
  const lo = -4;
  const hi = 4;
  const ymax = kind === "prob" ? 1 : 4.5;
  const cx = (v: number) => PAD_L + ((v - lo) / (hi - lo)) * (W - PAD_L - PAD_R);
  const cy = (v: number) => BOTTOM - (v / ymax) * (BOTTOM - TOP);
  const f = kind === "prob" ? sigmoid : loss;
  const path = Array.from({ length: 81 }, (_, i) => lo + (i / 80) * (hi - lo))
    .map((v, i) => `${i === 0 ? "M" : "L"}${cx(v).toFixed(1)},${cy(f(v)).toFixed(1)}`)
    .join(" ");
  const points = kind === "prob" ? [GAP] : [GAP, -GAP];
  const yTicks = kind === "prob" ? [0, 0.5, 1] : [0, 2, 4];
  return (
    <g>
      <line x1={cx(lo)} x2={cx(hi)} y1={BOTTOM} y2={BOTTOM} stroke="#94a3b8" strokeWidth={1} />
      <line x1={cx(0)} x2={cx(0)} y1={TOP} y2={BOTTOM} stroke="#cbd5e1" strokeWidth={1} strokeDasharray="2 3" />
      {yTicks.map((v) => (
        <text key={v} x={PAD_L - 6} y={cy(v) + 4} textAnchor="end" fontSize={10} fill="#64748b">{v}</text>
      ))}
      {[-4, -2, 0, 2, 4].map((v) => (
        <text key={v} x={cx(v)} y={BOTTOM + 15} textAnchor="middle" fontSize={10} fill="#64748b">{v}</text>
      ))}
      <text x={cx(hi)} y={BOTTOM + 29} textAnchor="end" fontSize={10} fill="#64748b">Δr →</text>
      <text x={PAD_L} y={TOP - 6} fontSize={10} fill="#64748b">{kind === "prob" ? "p+ = σ(Δr)" : "loss = −log p+"}</text>
      <path d={path} fill="none" stroke="#2563eb" strokeWidth={1.25} />
      {points.map((v) => {
        const value = f(v);
        const good = v > 0;
        const labelX = Math.min(Math.max(cx(v), PAD_L + 30), W - PAD_R - 40);
        return (
          <g key={v}>
            <line x1={cx(v)} x2={cx(v)} y1={BOTTOM} y2={cy(value)} stroke={good ? "#2563eb" : "#dc2626"} strokeWidth={1} strokeDasharray="3 3" />
            <circle cx={cx(v)} cy={cy(value)} r={5} fill={good ? "#2563eb" : "#dc2626"} />
            <text x={labelX} y={cy(value) + (kind === "prob" ? 18 : -10)} textAnchor="middle" fontSize={11} fontWeight={700} fill={good ? "#1d4ed8" : "#b91c1c"}>
              {kind === "prob" ? `p+ = ${value.toFixed(2)}` : `Δr ${v > 0 ? "+" : "−"}${GAP.toFixed(1)} → ${value.toFixed(2)}`}
            </text>
          </g>
        );
      })}
    </g>
  );
}

export default function BradleyTerryViz() {
  return (
    <SceneShell
      eyebrow="Bradley–Terry"
      title="두 점수의 차이 하나가 확률이 되고, 확률이 벌점이 된다"
      description="한 pair를 따라갑니다. chosen y+는 labeler가 더 낫다고 고른 응답, rejected y−는 비교 대상입니다. 점수 1.0과 −0.5는 가정이고 나머지는 식으로 계산했습니다."
      ariaLabel="점수 차이, 원점 이동, sigmoid 확률, negative log 벌점으로 이어지는 reward model loss 계산"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {active < 2 ? <NumberLine shift={active === 1 ? SHIFT : 0} /> : <Curve kind={active === 2 ? "prob" : "loss"} />}
        </svg>
      )}
    />
  );
}

import SceneShell from "./SceneShell";

/**
 * 본문 대응: #names 둘째 문단과 6절 식 — 명시적 계산의 세 가중치 λ·1−2λ·λ와 시간 칸 상한.
 * λ = 0.5×σ²×S²×Δt÷ΔS², σ=0.2. 상한 Δt ≤ ΔS²÷(σ²S²).
 * S=100,ΔS=10: Δt 0.01 → λ 0.02(가운데 0.96), 0.25 → 0.5(가운데 0), 0.3(가정) → 0.6(가운데 −0.2), 상한 0.25
 * S=110,ΔS=10,Δt 0.01 → λ 0.0242(가운데 0.9516), 상한 0.207. S=100,ΔS=5,Δt 0.01 → λ 0.08(가운데 0.84), 상한 0.0625
 */
const SCENES = [
  { label: "Δt 0.01", summary: "이 글의 칸 · 0.02 / 0.96 / 0.02", s: 100, ds: 10, dt: 0.01, note: "주가 100, 주가 칸 10에서 λ는 0.02입니다. 새 값은 아래 이웃×0.02+가운데×0.96+위 이웃×0.02이고, 0·0·10을 넣으면 3절의 0.2가 나옵니다. 세 가중치가 모두 양수입니다." },
  { label: "Δt 0.25", summary: "상한에 닿음 · 0.5 / 0 / 0.5", s: 100, ds: 10, dt: 0.25, note: "시간 칸을 0.25년까지 키우면 λ가 1/2이 되어 가운데 가중치가 정확히 0입니다. 주가 100 칸에서 허용되는 시간 칸 상한이 이 0.25년입니다." },
  { label: "Δt 0.3 (가정)", summary: "상한을 넘김 · 0.6 / −0.2 / 0.6", s: 100, ds: 10, dt: 0.3, note: "상한보다 큰 0.3년(가정)이면 가운데 가중치가 −0.2로 음수가 됩니다. 6절 식이 막으려는 상태이며, 본문이 말한 대로 시간 칸이 주가 칸에 비해 너무 커서 명시적 계산이 불안정해질 수 있는 영역입니다." },
  { label: "주가 110", summary: "본문 격자 맨 위 · 상한 0.207년", s: 110, ds: 10, dt: 0.01, note: "주가가 높을수록 λ가 커져 본문 격자 90·100·110의 맨 위 칸에서 상한이 가장 빡빡하지만, 0.207년이라 Δt=0.01년은 넉넉히 안쪽입니다. 앞 그림의 130 칸이라면 상한은 약 0.148년입니다." },
  { label: "주가 칸 5", summary: "상한 0.0625년", s: 100, ds: 5, dt: 0.01, note: "주가 칸을 절반으로 줄이면 상한은 주가 칸의 제곱에 비례해 0.25년의 4분의 1인 0.0625년이 됩니다. 주가 칸을 촘촘히 하면 시간 칸도 함께 줄여야 하는 이유입니다." },
] as const;

const SIGMA = 0.2;
const W = 360;
const H = 160;
const ZERO = 98;
const UNIT = 80; // 가중치 1이 차지하는 높이
const BAR_W = 52;
const BAR_X: readonly number[] = [70, 154, 238];
const BAR_LABELS: readonly string[] = ["아래 이웃 λ", "가운데 1−2λ", "위 이웃 λ"];

const GAUGE_MAX = 0.3;

function fmt(value: number) {
  const rounded = Math.round(value * 10000) / 10000;
  return Object.is(rounded, -0) ? "0" : String(rounded);
}

export default function StabilityWeightsViz() {
  return (
    <SceneShell
      eyebrow="안정 조건"
      title="가운데 가중치가 0 아래로 내려가면 안 됩니다"
      description="명시적 계산의 새 값은 가운데 값과 양옆 값을 세 가중치로 섞은 것입니다. λ는 한 시간 칸에 양옆 값이 섞이는 비율로 0.5×흔들림²×주가²×시간 칸÷주가 칸²이며, 연 흔들림 20%·금리 0을 넣었습니다(가정)."
      ariaLabel="시간 칸과 주가 칸에 따라 명시적 유한차분의 세 가중치와 시간 칸 상한이 바뀌는 모습"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const lambda = (0.5 * SIGMA ** 2 * scene.s ** 2 * scene.dt) / scene.ds ** 2;
        const weights = [lambda, 1 - 2 * lambda, lambda] as const;
        const cap = scene.ds ** 2 / (SIGMA ** 2 * scene.s ** 2);
        const gx = (t: number) => `${(Math.min(t, GAUGE_MAX) / GAUGE_MAX) * 100}%`;
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[420px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              <line x1={40} x2={W - 30} y1={ZERO} y2={ZERO} stroke="#94a3b8" strokeWidth={1} />
              <text x={34} y={ZERO + 4} textAnchor="end" fontSize={12} fill="#64748b">0</text>
              <line x1={40} x2={W - 30} y1={ZERO - UNIT} y2={ZERO - UNIT} stroke="#e2e8f0" strokeWidth={1} strokeDasharray="3 3" />
              <text x={34} y={ZERO - UNIT + 4} textAnchor="end" fontSize={12} fill="#64748b">1</text>
              {weights.map((weight, index) => {
                const negative = weight < -1e-9;
                const height = Math.abs(weight) * UNIT;
                const color = negative ? "#dc2626" : index === 1 ? "#2563eb" : "#64748b";
                return (
                  <g key={BAR_LABELS[index]}>
                    <rect x={BAR_X[index]} y={negative ? ZERO : ZERO - height} width={BAR_W} height={Math.max(height, 0.5)} rx={2} fill={color} opacity={0.85} />
                    <text x={BAR_X[index] + BAR_W / 2} y={negative ? ZERO + height + 13 : ZERO - height - 5} textAnchor="middle" fontSize={13} fontWeight={700} fill={color}>
                      {fmt(weight)}
                    </text>
                    <text x={BAR_X[index] + BAR_W / 2} y={H - 4} textAnchor="middle" fontSize={12} fill="#64748b">{BAR_LABELS[index]}</text>
                  </g>
                );
              })}
            </svg>
            <div className="mt-3 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>시간 칸 0년</span>
                <span>0.3년</span>
              </div>
              <div className="relative mt-1 h-6 rounded-md border border-border bg-background">
                <div className="absolute inset-y-0 left-0 rounded-l-md bg-[#2563eb]/15" style={{ width: gx(cap) }} />
                <div className="absolute inset-y-0 w-px bg-[#2563eb]" style={{ left: gx(cap) }} />
                <div className={`absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full ${scene.dt > cap + 1e-9 ? "bg-[#dc2626]" : "bg-[#475569]"}`} style={{ left: gx(scene.dt) }} />
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2 text-center">
                {[
                  ["주가 · 주가 칸", `${scene.s} · ${scene.ds}`],
                  ["시간 칸 Δt (점)", `${scene.dt}년`],
                  ["상한 (파란 선)", `${Number(cap.toPrecision(3))}년`],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-lg border border-border bg-background px-2 py-2">
                    <span className="block text-muted-foreground">{label}</span>
                    <span className="block font-mono text-sm font-bold">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}

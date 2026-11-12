import SceneShell from "./SceneShell";

/**
 * 본문 대응: #grpo-process 의 clipped surrogate — ℓ = min(ρÂ, clip(ρ, 1−ε, 1+ε)Â).
 * 가정: ε = 0.2, Â = ±1.
 * Â=+1, ρ=1.4 → u 1.4, c 1.2, ℓ 1.2 (잘림) / ρ=0.6 → u 0.6, c 0.8, ℓ 0.6 (안 잘림)
 * Â=−1, ρ=0.6 → u −0.6, c −0.8, ℓ −0.8 (잘림) / ρ=1.4 → u −1.4, c −1.2, ℓ −1.4 (안 잘림)
 */
const EPS = 0.2;
const clip = (rho: number) => Math.min(Math.max(rho, 1 - EPS), 1 + EPS);
const surrogate = (rho: number, adv: number) => Math.min(rho * adv, clip(rho) * adv);
const fmt = (v: number) => (v < 0 ? `−${Math.abs(v).toFixed(1)}` : v.toFixed(1));

const SCENES = [
  {
    label: "Â>0 · 확률을 올림",
    adv: 1,
    rho: 1.4,
    summary: "Â=+1, ρ=1.4 → ℓ=1.2",
    note: "좋은 completion의 token 확률을 이미 1.4배로 올렸습니다. 1+ε에서 잘린 1.2가 더 작아 쓰이므로, 더 올려도 이득이 늘지 않습니다.",
  },
  {
    label: "Â>0 · 확률이 내려감",
    adv: 1,
    rho: 0.6,
    summary: "Â=+1, ρ=0.6 → ℓ=0.6",
    note: "확률이 0.6배로 내려갔습니다. 원래 항 0.6이 잘린 0.8보다 작아 그대로 쓰입니다. Â>0이면 위쪽 끝에서만 잘립니다.",
  },
  {
    label: "Â<0 · 확률을 내림",
    adv: -1,
    rho: 0.6,
    summary: "Â=−1, ρ=0.6 → ℓ=−0.8",
    note: "나쁜 completion의 token 확률을 이미 0.6배로 내렸습니다. 1−ε에서 잘린 −0.8이 더 작아 쓰이므로, 더 내려도 이득이 늘지 않습니다.",
  },
  {
    label: "Â<0 · 확률이 올라감",
    adv: -1,
    rho: 1.4,
    summary: "Â=−1, ρ=1.4 → ℓ=−1.4",
    note: "확률이 1.4배로 올라갔습니다. 원래 항 −1.4가 잘린 −1.2보다 작아 그대로 쓰입니다. min은 늘 보수적인 쪽을 고릅니다.",
  },
] as const;

const W = 360;
const H = 196;
const PL = 40;
const PR = 344;
const PT = 16;
const PB = 160;
const X_MIN = 0.4;
const X_MAX = 1.6;
const Y_MIN = -1.6;
const Y_MAX = 1.6;
const sx = (rho: number) => PL + ((rho - X_MIN) / (X_MAX - X_MIN)) * (PR - PL);
const sy = (v: number) => PB - ((v - Y_MIN) / (Y_MAX - Y_MIN)) * (PB - PT);
const XS = Array.from({ length: 49 }, (_, i) => X_MIN + (i * (X_MAX - X_MIN)) / 48);
const path = (f: (rho: number) => number) =>
  XS.map((rho, i) => `${i === 0 ? "M" : "L"} ${sx(rho).toFixed(1)} ${sy(f(rho)).toFixed(1)}`).join(" ");
const X_TICKS = [0.6, 0.8, 1, 1.2, 1.4] as const;
const Y_TICKS = [-1.4, -0.8, 0, 0.8, 1.4] as const;

export default function ClipSurrogateViz() {
  return (
    <SceneShell
      eyebrow="Clipped surrogate"
      title="확률을 이미 많이 움직인 token은 더 밀어도 이득이 없습니다"
      description="ρ는 새 policy 확률 ÷ rollout을 만든 old policy 확률, Â는 completion이 group 평균보다 나은 정도입니다. 실선이 실제로 쓰는 ℓ=min(원래 항, 잘린 항), 점선이 원래 항 ρÂ입니다. ε=0.2와 Â=±1은 가정입니다."
      ariaLabel="advantage 부호와 policy ratio에 따라 clipped surrogate가 원래 항과 잘린 항 중 무엇을 쓰는지 보여 주는 그래프"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const u = scene.rho * scene.adv;
        const c = clip(scene.rho) * scene.adv;
        const l = surrogate(scene.rho, scene.adv);
        const clipped = l !== u;
        return (
          <div className="min-w-0">
            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="mx-auto h-auto w-full max-w-[440px]"
              role="img"
              aria-label={`${scene.label}: ${scene.summary}`}
            >
              <rect x={sx(1 - EPS)} y={PT} width={sx(1 + EPS) - sx(1 - EPS)} height={PB - PT} fill="#2563eb" fillOpacity={0.06} />
              <text x={(sx(1 - EPS) + sx(1 + EPS)) / 2} y={PT + 12} textAnchor="middle" fontSize={12} fill="#2563eb">1±ε</text>
              <line x1={PL} x2={PR} y1={sy(0)} y2={sy(0)} stroke="#94a3b8" strokeWidth={1} />
              <line x1={PL} x2={PL} y1={PT} y2={PB} stroke="#94a3b8" strokeWidth={1} />
              {X_TICKS.map((t) => (
                <text key={t} x={sx(t)} y={PB + 14} textAnchor="middle" fontSize={12} fill="#64748b">{t.toFixed(1)}</text>
              ))}
              {Y_TICKS.map((t) => (
                <text key={t} x={PL - 6} y={sy(t) + 3} textAnchor="end" fontSize={12} fill="#64748b">{fmt(t)}</text>
              ))}
              <text x={PR} y={PB + 30} textAnchor="end" fontSize={12} fill="#64748b">ρ (새/old 확률비)</text>
              <path d={path((rho) => rho * scene.adv)} fill="none" stroke="#94a3b8" strokeWidth={1} strokeDasharray="4 3" />
              <path d={path((rho) => surrogate(rho, scene.adv))} fill="none" stroke="#2563eb" strokeWidth={1.25} />
              <line x1={sx(scene.rho)} x2={sx(scene.rho)} y1={sy(u)} y2={sy(c)} stroke="#d97706" strokeWidth={1} strokeDasharray="2 2" />
              <circle cx={sx(scene.rho)} cy={sy(u)} r={3.5} fill="#ffffff" stroke="#64748b" strokeWidth={1} />
              <circle cx={sx(scene.rho)} cy={sy(c)} r={3.5} fill="#ffffff" stroke="#d97706" strokeWidth={1} />
              <circle cx={sx(scene.rho)} cy={sy(l)} r={4} fill="#2563eb" />
            </svg>
            <p className="mt-2 text-center text-xs leading-5 text-muted-foreground">
              <span style={{ color: "#64748b" }}>○</span> 원래 {fmt(u)} · <span style={{ color: "#d97706" }}>○</span> 잘림 {fmt(c)} ·{" "}
              <span style={{ color: "#2563eb" }}>●</span> ℓ {fmt(l)}{clipped ? " (잘린 항)" : " (원래 항)"}
            </p>
          </div>
        );
      }}
    />
  );
}

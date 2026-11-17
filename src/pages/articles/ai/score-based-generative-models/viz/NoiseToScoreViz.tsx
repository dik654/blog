import SceneShell from "./SceneShell";

/**
 * 본문 대응: #noise-score 두 번째 식 — sθ = −εθ / √(1−ᾱₜ).
 * 본문 예: noise 표준편차 σₜ = 0.5, εθ = 0.8 → −0.8 / 0.5 = −1.6.
 * 마지막 장면은 같은 εθ에 σₜ = 0.25(가정) → −0.8 / 0.25 = −3.2.
 */
const EPS = 0.8;
const SIGMA = 0.5;
const SMALL_SIGMA = 0.25;
const SCALE = 3.4;

type Row = { label: string; value: number | null; color: string; strong?: boolean };

const SCENES = [
  {
    label: "예측한 noise",
    summary: "εθ = +0.8",
    sigma: SIGMA,
    step: 0,
    note: "Network는 clean signal에서 noisy point xₜ로 밀어낸 noise 방향을 εθ로 예측합니다. 여기서는 1차원에서 오른쪽(+)으로 0.8이라고 둡니다.",
  },
  {
    label: "부호 뒤집기",
    summary: "−εθ = −0.8",
    sigma: SIGMA,
    step: 1,
    note: "Score는 noisy point에서 density가 높은 쪽, 곧 clean 쪽으로 돌아가는 방향이므로 부호를 뒤집습니다. 오른쪽으로 밀렸으니 왼쪽을 가리킵니다.",
  },
  {
    label: "σₜ로 나누기",
    summary: "−0.8 ÷ 0.5 = −1.6",
    sigma: SIGMA,
    step: 2,
    note: "Noise 표준편차 σₜ = √(1−ᾱₜ) = 0.5로 나누면 score는 −1.6입니다. 방향은 그대로이고 크기만 noise level에 맞춘 gradient 단위로 바뀝니다.",
  },
  {
    label: "다른 t에서",
    summary: "−0.8 ÷ 0.25 = −3.2",
    sigma: SMALL_SIGMA,
    step: 2,
    note: "같은 εθ라도 σₜ가 0.25인 t(가정)에서는 −3.2가 됩니다. 본문이 말하듯 이 나눗셈이 t마다 다른 noise 크기를 같은 coordinate gradient 단위로 맞춥니다.",
  },
] as const;

function Bar({ label, value, color, strong = false }: Row) {
  const width = value === null ? 0 : (Math.abs(value) / SCALE) * 50;
  const negative = value !== null && value < 0;
  return (
    <div className="grid grid-cols-[5.5rem_minmax(0,1fr)_3.25rem] items-center gap-2 text-xs sm:text-sm">
      <span className={strong ? "font-bold" : "text-muted-foreground"}>{label}</span>
      <div className="relative h-4 min-w-0 rounded-sm bg-muted/40">
        <div className="absolute inset-y-0 left-1/2 w-px bg-slate-400" />
        <div
          className="absolute inset-y-0 rounded-sm transition-[width,left] duration-300 motion-reduce:transition-none"
          style={{ width: `${width}%`, left: negative ? `${50 - width}%` : "50%", backgroundColor: color }}
        />
      </div>
      <span className={`text-right font-mono ${strong ? "font-bold" : ""}`}>
        {value === null ? "−" : `${value > 0 ? "+" : value < 0 ? "−" : ""}${Math.abs(value)}`}
      </span>
    </div>
  );
}

export default function NoiseToScoreViz() {
  return (
    <SceneShell
      eyebrow="ε-prediction → score"
      title="예측한 noise를 뒤집고 σₜ로 나누면 score가 됩니다"
      description="1차원에서 오른쪽을 +로 둡니다(가정). 막대는 가운데 세로선이 0이고 왼쪽이 음수입니다. σₜ = 0.5, εθ = 0.8은 본문 해석의 숫자입니다."
      ariaLabel="예측 noise 0.8의 부호를 바꾸고 noise 표준편차로 나눠 score를 구하는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const rows: Row[] = [
          { label: "εθ", value: EPS, color: "#64748b" },
          { label: "−εθ", value: scene.step >= 1 ? -EPS : null, color: "#d97706" },
          { label: `sθ (÷ ${scene.sigma})`, value: scene.step >= 2 ? Number((-EPS / scene.sigma).toFixed(2)) : null, color: "#2563eb", strong: true },
        ];
        return (
          <div className="min-w-0 space-y-4">
            <svg viewBox="0 0 340 92" role="img" aria-label="clean signal과 noisy point의 위치" className="mx-auto block h-auto w-full max-w-[30rem]">
              <line x1="16" y1="46" x2="324" y2="46" stroke="#94a3b8" strokeWidth="1" />
              <circle cx="100" cy="46" r="5" fill="#16a34a" />
              <text x="100" y="84" textAnchor="middle" fontSize="13" fill="#15803d">
                clean 쪽
              </text>
              <circle cx="240" cy="46" r="5" fill="#475569" />
              <text x="240" y="84" textAnchor="middle" fontSize="13" fill="#475569">
                noisy xₜ
              </text>
              <line x1="108" y1="28" x2="224" y2="28" stroke="#64748b" strokeWidth="1.25" />
              <path d="M232 28 L224 23.5 L224 32.5 Z" fill="#64748b" />
              <text x="170" y="18" textAnchor="middle" fontSize="13" fill="#475569">
                noise가 민 방향 (+)
              </text>
              <g opacity={scene.step >= 1 ? 1 : 0}>
                <line x1="232" y1="62" x2="116" y2="62" stroke="#d97706" strokeWidth="1.25" />
                <path d="M108 62 L116 57.5 L116 66.5 Z" fill="#d97706" />
                <text x="170" y="84" textAnchor="middle" fontSize="13" fontWeight="700" fill="#b45309">
                  score 방향
                </text>
              </g>
            </svg>
            <div className="space-y-2">
              {rows.map((row, index) => (
                <Bar key={index} {...row} />
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}

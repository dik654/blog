import SceneShell from "./SceneShell";

/**
 * 본문 대응: #period-state 발견 확률 식 P = 1 − (1−α)^{KT}, α = 0.1.
 * 표본 하나가 손실을 피할 확률 0.9를 표본 수만큼 곱한다.
 * n=1: 0.9 · n=5(K=5,T=1): 0.59049 → 발견 0.40951 · n=10(T=2): 0.3487 → 0.6513 · n=20(T=4): 0.1216 → 0.8784.
 * T>1은 식의 가정(독립·균등 표본, 손실 비율 고정, 중간 복구 없음)을 그대로 이어 간 계산이다.
 */
const ALPHA = 0.1;
const MAX_N = 20;
const N_VALUES = Array.from({ length: MAX_N }, (_, i) => i + 1);

const W = 360;
const H = 206;
const LEFT = 34;
const RIGHT = 8;
const TOP = 14;
const BASE = 150;
const SLOT = (W - LEFT - RIGHT) / MAX_N;
const BAR = SLOT * 0.7;
const y = (p: number) => BASE - p * (BASE - TOP);

const SCENES = [
  { label: "표본 1개", summary: "놓칠 확률 0.9", n: 1, note: "데이터의 10%를 잃었다면 무작위 표본 하나가 남은 90%에 떨어져 손실을 놓칠 확률은 0.9, 손실을 맞힐 확률은 0.1입니다." },
  { label: "K=5 · 한 period", summary: "0.9⁵ ≈ 0.590 → 발견 약 41%", n: 5, note: "다섯 표본이 모두 손실을 피해야 놓치므로 0.9를 다섯 번 곱해 0.59049입니다. 한 번이라도 맞힐 확률은 1−0.59049 ≈ 41%로, 한 period만으로는 놓칠 가능성이 더 큽니다." },
  { label: "T=2 (가정)", summary: "0.9¹⁰ ≈ 0.349 → 발견 약 65%", n: 10, note: "같은 손실 상태로 period가 한 번 더 지나면 표본은 10개가 되고, 놓칠 확률은 0.59049를 한 번 더 곱한 약 0.349입니다." },
  { label: "T=4 (가정)", summary: "0.9²⁰ ≈ 0.122 → 발견 약 88%", n: 20, note: "표본 20개에서도 놓칠 확률은 약 12%가 남습니다. 곱할수록 줄어들 뿐 0이 되지는 않으므로, 이는 발견 가능성이지 100% 보장이 아닙니다." },
] as const;

export default function DetectionCurveViz() {
  return (
    <SceneShell
      eyebrow="손실 비율 α = 0.1 · 표본마다 0.9를 곱함"
      title="표본이 늘수록 놓칠 확률은 곱해서 줄지만 0이 되지는 않습니다"
      description="막대 하나가 지금까지 뽑은 표본 수입니다. 회색은 모든 표본이 손실을 피할 확률 0.9ⁿ, 파랑은 한 번이라도 손실 leaf를 뽑을 확률 1−0.9ⁿ입니다. 표본은 독립·균등하고 손실 비율이 그대로라는 식의 가정을 따릅니다."
      ariaLabel="표본 수에 따라 줄어드는 놓칠 확률과 늘어나는 발견 확률"
      scenes={SCENES}
      render={(active) => {
        const n = SCENES[active].n;
        const miss = (1 - ALPHA) ** n;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto block h-auto w-full max-w-[600px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {[0, 0.5, 1].map((tick) => (
              <g key={tick}>
                <line x1={LEFT} x2={W - RIGHT} y1={y(tick)} y2={y(tick)} stroke="#e2e8f0" strokeWidth={1} />
                <text x={LEFT - 4} y={y(tick) + 3} textAnchor="end" fontSize={12} fill="#64748b">{tick}</text>
              </g>
            ))}
            {N_VALUES.map((k) => {
              const m = (1 - ALPHA) ** k;
              const x = LEFT + (k - 1) * SLOT + (SLOT - BAR) / 2;
              const on = k <= n;
              return (
                <g key={k} opacity={on ? 1 : 0.18}>
                  <rect x={x} y={y(1)} width={BAR} height={y(m) - y(1)} fill="#2563eb" />
                  <rect x={x} y={y(m)} width={BAR} height={BASE - y(m)} fill="#94a3b8" />
                  {(k === 1 || k === 5 || k === 10 || k === 20) && (
                    <text x={x + BAR / 2} y={BASE + 15} textAnchor="middle" fontSize={12} className="fill-muted-foreground">{k}</text>
                  )}
                </g>
              );
            })}
            <text x={(LEFT + W - RIGHT) / 2} y={BASE + 31} textAnchor="middle" fontSize={12} fill="#64748b">뽑은 표본 수 n = K × T</text>
            <line
              x1={LEFT + (n - 1) * SLOT + SLOT / 2}
              x2={LEFT + (n - 1) * SLOT + SLOT / 2}
              y1={TOP - 6}
              y2={BASE}
              className="stroke-foreground"
              strokeWidth={1}
              strokeDasharray="2 2"
            />
            <text x={W - RIGHT} y={H - 4} textAnchor="end" fontSize={12} fontWeight={700} className="fill-[#1d4ed8] dark:fill-[#60a5fa]">
              n={n}: 놓칠 {miss.toFixed(3)} · 발견 {(1 - miss).toFixed(3)}
            </text>
          </svg>
        );
      }}
    />
  );
}

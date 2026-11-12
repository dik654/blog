import KdSceneShell from "./KdSceneShell";

/**
 * 본문 대응: #soft-target — logit 차이 4를 같은 T로 나누면 두 class odds가 e^(4/T)로 줄고 순서는 유지된다.
 * T=1: e⁴≈54.6 → 98.2% / 1.8%. T=2: e²≈7.4 → 88.1% / 11.9%. T=20(MNIST 실험의 값): e^0.2≈1.22 → 55.0% / 45.0%.
 * 두 class만 있다고 둔 계산이며, 실제 분포에는 다른 class가 함께 있습니다.
 */
const GAP = 4;

const SCENES = [
  { label: "T = 1 · 원래 softmax", summary: "odds e⁴ ≈ 54.6", t: 1, note: "Logit 차이 4를 그대로 지수화하면 class i가 98.2%를 가져가고 class k에는 1.8%만 남습니다. Teacher가 class k를 아주 틀린 답으로 보지 않았더라도 그 정보는 거의 보이지 않습니다." },
  { label: "T = 2", summary: "odds e² ≈ 7.4", t: 2, note: "차이 4를 2로 나눠 2로 만든 뒤 지수화합니다. Class i가 여전히 앞서지만 class k의 몫이 11.9%로 커져, teacher가 두 class를 어느 정도 비슷하게 본다는 신호가 남습니다." },
  { label: "T = 20 · MNIST 실험의 값", summary: "odds e^0.2 ≈ 1.22", t: 20, note: "아래 MNIST 실험이 쓴 T=20을 같은 차이 4에 넣으면(계산) 55.0% 대 45.0%입니다. 그래도 class i가 앞선다는 순서는 바뀌지 않습니다." },
] as const;

function pct(value: number) {
  return `${(value * 100).toFixed(1)}%`;
}

export default function TemperatureOddsViz() {
  return (
    <KdSceneShell
      eyebrow="Temperature"
      title="T를 키우면 순서는 그대로이고 두 class의 차이만 줄어듭니다"
      description="Logit은 softmax에 넣기 전의 class score이고, temperature T는 모든 logit 차이를 나누는 양수입니다. 두 class i·k의 logit 차이를 아래 식 해석의 예와 같은 4로 두고 다른 class는 없다고 단순화해 계산했습니다."
      ariaLabel="Logit 차이 4에서 temperature 1, 2, 20일 때 두 class의 확률과 odds"
      scenes={SCENES}
      render={(active) => {
        const t = SCENES[active].t;
        const odds = Math.exp(GAP / t);
        const pi = odds / (1 + odds);
        const pk = 1 - pi;
        const rows = [
          { name: "class i", logit: `차이 ${GAP} ÷ ${t} = ${(GAP / t).toFixed(t === 20 ? 1 : 0)}`, p: pi, color: "#2563eb" },
          { name: "class k", logit: "기준 0", p: pk, color: "#d97706" },
        ];
        return (
          <div className="min-w-0 space-y-3">
            {rows.map((row) => (
              <div key={row.name} className="grid grid-cols-[4.5rem_minmax(0,1fr)_3.5rem] items-center gap-2 text-xs sm:text-sm">
                <span className="font-semibold">{row.name}</span>
                <div className="h-5 min-w-0 rounded-sm bg-muted/40">
                  <div
                    className="h-full rounded-sm transition-[width] duration-300 motion-reduce:transition-none"
                    style={{ width: `${row.p * 100}%`, backgroundColor: row.color }}
                  />
                </div>
                <span className="text-right font-mono font-bold">{pct(row.p)}</span>
              </div>
            ))}
            <div className="grid grid-cols-2 gap-2 pt-2 text-xs leading-5 text-muted-foreground">
              <p className="rounded-lg border border-border px-3 py-2">
                <span className="block font-semibold text-foreground">나눈 logit 차이</span>
                <span className="font-mono">{rows[0].logit}</span>
              </p>
              <p className="rounded-lg border border-border px-3 py-2">
                <span className="block font-semibold text-foreground">odds = 확률 비</span>
                <span className="font-mono">{odds.toFixed(t === 20 ? 2 : 1)} : 1</span>
              </p>
            </div>
          </div>
        );
      }}
    />
  );
}

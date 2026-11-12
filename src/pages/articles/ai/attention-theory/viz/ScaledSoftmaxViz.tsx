import SceneShell from "./SceneShell";

/**
 * 본문 대응: #multiplicative "왜 √dₖ로 나누는가" — 성분 평균 0·분산 1·독립 가정에서 Var(qᵀk)=dₖ,
 * 즉 score의 표준편차는 √dₖ. 한 query row의 세 score가 표준편차 단위로 +1, 0, −1에 있다고 두면(가정)
 * 원 score = (√dₖ, 0, −√dₖ). dₖ=4·16·64(가정) → (2,0,−2)·(4,0,−4)·(8,0,−8).
 * softmax: (2,0,−2) → 86.7·11.7·1.6% / (4,0,−4) → 98.2·1.8·0.0% / √dₖ로 나눈 (1,0,−1) → 66.5·24.5·9.0%.
 */
const DIMS: readonly number[] = [4, 16, 64];

const softmax = (scores: readonly number[]) => {
  const exps = scores.map((score) => Math.exp(score));
  const total = exps.reduce<number>((sum, value) => sum + value, 0);
  return exps.map((value) => value / total);
};

const rowFor = (dk: number, scaled: boolean) => {
  const s = scaled ? 1 : Math.sqrt(dk);
  return [s, 0, -s];
};

const SCENES = [
  {
    label: "dₖ = 4 · 나누지 않음",
    dk: 4,
    scaled: false,
    summary: "score (2, 0, −2)",
    note: "성분 평균 0·분산 1·독립이라는 가정에서 내적 qᵀk의 분산은 dₖ, 표준편차는 √dₖ=2입니다. 세 key의 score를 표준편차 단위로 +1, 0, −1 자리에 두면(가정) 2, 0, −2가 되고 softmax weight는 87%·12%·2%입니다.",
  },
  {
    label: "dₖ = 16 · 나누지 않음",
    dk: 16,
    scaled: false,
    summary: "score (4, 0, −4)",
    note: "같은 상대 위치라도 dₖ가 16이면 표준편차가 4로 커져 score 간격이 두 배가 됩니다. 첫 key가 98%를 가져가 softmax가 더 뾰족해집니다.",
  },
  {
    label: "dₖ = 64 · 나누지 않음",
    dk: 64,
    scaled: false,
    summary: "score (8, 0, −8)",
    note: "dₖ=64면 score는 8, 0, −8입니다. 첫 key가 거의 전부를 가져가고 나머지 두 key는 사실상 0이 됩니다.",
  },
  {
    label: "√dₖ로 나눔",
    dk: 64,
    scaled: true,
    summary: "어느 dₖ든 (1, 0, −1)",
    note: "Scaled dot-product는 내적을 √dₖ로 나눕니다. 위 세 경우 모두 (1, 0, −1)로 돌아가 weight가 67%·25%·9%로 같아집니다. 이 가정 아래 typical scale을 맞춘 것이며 학습 중 분산이 정확히 1이라는 보장은 아닙니다.",
  },
] as const;

const fmt = (p: number) => {
  const pct = p * 100;
  if (pct > 99.9) return ">99.9%";
  if (pct < 0.1) return "<0.1%";
  return `${pct.toFixed(1)}%`;
};

const COLORS = ["#2563eb", "#d97706", "#64748b"] as const;

export default function ScaledSoftmaxViz() {
  return (
    <SceneShell
      eyebrow="Logit scale"
      title="dₖ가 커지면 같은 상대 위치의 score도 벌어져 softmax가 뾰족해집니다"
      description="한 query가 key 세 개와 비교한 score row와 그 softmax weight입니다. 세 score를 표준편차 단위로 +1, 0, −1 자리에 둔 것과 dₖ 값 4·16·64는 설명용입니다(가정)."
      ariaLabel="key 차원 dk가 4, 16, 64일 때 나누지 않은 score와 √dk로 나눈 score의 softmax weight 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const scores = rowFor(scene.dk, scene.scaled);
        const weights = softmax(scores);
        return (
          <div className="min-w-0">
            <div className="mb-3 flex flex-wrap gap-1.5 text-[11px]">
              {DIMS.map((dk) => {
                const on = scene.scaled || dk === scene.dk;
                return (
                  <span key={dk} className={`rounded border px-2 py-0.5 font-mono ${on ? "border-primary/60 font-bold text-foreground" : "border-border/60 text-muted-foreground"}`}>
                    dₖ={dk} · √dₖ={Math.sqrt(dk)}
                  </span>
                );
              })}
            </div>
            <div className="space-y-2.5">
              {scores.map((score, index) => (
                <div key={index} className="grid grid-cols-[4.25rem_minmax(0,1fr)_3.75rem] items-center gap-2 text-xs sm:text-sm">
                  <span className="text-muted-foreground">
                    key {index + 1} <span className="font-mono text-foreground">{score > 0 ? "+" : score < 0 ? "−" : ""}{Math.abs(score)}</span>
                  </span>
                  <div className="h-4 min-w-0 rounded-sm bg-muted/40">
                    <div
                      className="h-full rounded-sm transition-[width] duration-300 motion-reduce:transition-none"
                      style={{ width: `${weights[index] * 100}%`, backgroundColor: COLORS[index] }}
                    />
                  </div>
                  <span className="text-right font-mono font-bold">{fmt(weights[index])}</span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[11px] leading-5 text-muted-foreground">왼쪽 숫자 = softmax에 들어가는 score, 막대 = softmax weight(세 막대 합 100%).</p>
          </div>
        );
      }}
    />
  );
}

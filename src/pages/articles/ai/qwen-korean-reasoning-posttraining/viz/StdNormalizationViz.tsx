import PosttrainingSceneShell from "./PosttrainingSceneShell";

/**
 * 본문 대응: #rl-approach "Dr.GRPO가 뺀 두 정규화 항" — 표준편차로 나누지 않는 이유.
 * 넓은 group: 글의 예 [1.0, 0.7, 0.4] → 평균 0.7, σ = √(0.06) ≈ 0.245, 최고 후보 0.3 → ÷σ ≈ 1.22
 * 좁은 group(가정): [0.71, 0.70, 0.69] → 평균 0.70, σ ≈ 0.0082, 최고 후보 0.01 → ÷σ ≈ 1.22
 * σ는 n으로 나누는 모집단 표준편차로 계산(가정). 0.3 / 0.01 = 30배.
 */
const GROUPS = [
  { name: "넓게 퍼진 group", rewards: [1.0, 0.7, 0.4] },
  { name: "촘촘한 group (가정)", rewards: [0.71, 0.7, 0.69] },
] as const;

const STATS = GROUPS.map((group) => {
  const rewards: readonly number[] = group.rewards;
  const mean = rewards.reduce<number>((sum, value) => sum + value, 0) / rewards.length;
  const variance = rewards.reduce<number>((sum, value) => sum + (value - mean) ** 2, 0) / rewards.length;
  const sigma = Math.sqrt(variance);
  const raw = Math.max(...rewards) - mean;
  return { name: group.name, rewards, mean, sigma, raw, scaled: raw / sigma };
});

const SCALE = 1.4;

const SCENES = [
  { label: "넓게 퍼진 group", summary: "0.3 ÷ 0.245 ≈ 1.22", note: "1.0, 0.7, 0.4 group에서 가장 높은 후보는 평균보다 0.3 높습니다. 표준편차 σ(점수가 평균에서 퍼진 정도)는 약 0.245이므로 σ로 나누면 약 1.22가 됩니다." },
  { label: "촘촘한 group", summary: "0.01 ÷ 0.0082 ≈ 1.22", note: "0.71, 0.70, 0.69처럼 차이가 작은 group에서는 가장 높은 후보가 평균보다 0.01 높을 뿐입니다. 그래도 σ가 약 0.0082로 작아서 나누면 똑같이 약 1.22로 커집니다." },
  { label: "Dr.GRPO는 나누지 않음", summary: "0.3 vs 0.01 · 30배 차이 유지", note: "평균만 빼면 두 group의 신호가 0.3과 0.01로 30배 차이를 그대로 유지합니다. 작은 reward 차이가 자동으로 커지지 않는 대신, reward를 어떤 크기로 설계했는지가 학습 신호의 크기를 직접 정합니다." },
] as const;

function Bar({ label, value, lit, color }: { label: string; value: number; lit: boolean; color: string }) {
  return (
    <div className={`grid grid-cols-[6.5rem_minmax(0,1fr)_3.25rem] items-center gap-2 text-xs transition-opacity duration-300 motion-reduce:transition-none sm:grid-cols-[8rem_minmax(0,1fr)_3.5rem] sm:text-sm ${lit ? "" : "opacity-35"}`}>
      <span className={lit ? "font-semibold" : "text-muted-foreground"}>{label}</span>
      <div className="h-4 min-w-0 rounded-sm bg-muted/40">
        <div className="h-full rounded-sm" style={{ width: `${Math.max((value / SCALE) * 100, 0.8)}%`, backgroundColor: color }} />
      </div>
      <span className="text-right font-mono font-bold">+{value < 0.1 ? value.toFixed(2) : value.toFixed(value > 1 ? 2 : 1)}</span>
    </div>
  );
}

export default function StdNormalizationViz() {
  return (
    <PosttrainingSceneShell
      eyebrow="표준편차 정규화"
      title="σ로 나누면 0.01 차이도 0.3 차이와 같은 크기가 됩니다"
      description="두 group에서 가장 높은 후보의 신호를 비교합니다. 위 막대는 평균만 뺀 값, 아래 막대는 그 값을 group의 표준편차 σ로 다시 나눈 값입니다."
      note="촘촘한 group의 점수는 설명용 가정이고, σ는 n으로 나누는 표준편차로 계산했습니다(가정). 이는 Dr.GRPO와 이 연구가 채택한 설계를 보이는 예이지, 정규화가 언제나 나쁘다는 뜻이 아닙니다."
      ariaLabel="평균만 뺀 advantage와 표준편차로 나눈 advantage를 두 group에서 비교"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0 space-y-5">
          {STATS.map((group, index) => {
            const groupLit = active === 2 || active === index;
            return (
              <div key={group.name} className="min-w-0">
                <p className={`text-xs leading-5 ${groupLit ? "" : "text-muted-foreground"}`}>
                  <strong>{group.name}</strong>
                  <span className="ml-2 font-mono text-muted-foreground">
                    {group.rewards.map((value) => value.toFixed(2)).join(" · ")} → 평균 {group.mean.toFixed(2)}, σ ≈ {group.sigma < 0.1 ? group.sigma.toFixed(4) : group.sigma.toFixed(3)}
                  </span>
                </p>
                <div className="mt-2 space-y-1.5">
                  <Bar label="평균만 뺌" value={group.raw} lit={groupLit} color="#2563eb" />
                  <Bar label="σ로도 나눔" value={group.scaled} lit={groupLit && active !== 2} color="#d97706" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    />
  );
}

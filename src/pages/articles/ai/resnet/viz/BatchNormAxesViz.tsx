import SceneShell from "./SceneShell";

/**
 * 본문 대응: #architecture BatchNorm 식 — "같은 channel의 batch·spatial 차원 전체에서 평균과 분산".
 * 예시 tensor(가정): sample 2개 × channel 3개 × 2×2 위치. channel 1의 값은 두 sample 모두 2·4·6·8.
 * m = 2 × 2 × 2 = 8, μ = 5, σ² = (9+1+1+9)/4 = 5, √5 ≈ 2.236
 * x̂ = (−3, −1, 1, 3)/√5 ≈ (−1.34, −0.45, 0.45, 1.34)   (ε≈1e-5는 소수 둘째 자리에 영향 없음)
 * γ=2, β=1(가정): y ≈ (−1.68, 0.11, 1.89, 3.68)
 * γ=√(σ²+ε)≈2.236, β=μ=5: y = (2, 4, 6, 8) — 본문 interpretation의 identity 복원
 */
const RAW = [2, 4, 6, 8] as const;
const MEAN = RAW.reduce<number>((sum, v) => sum + v, 0) / RAW.length;
const VAR = RAW.reduce<number>((sum, v) => sum + (v - MEAN) ** 2, 0) / RAW.length;
const STD = Math.sqrt(VAR);
const NORM = RAW.map((v) => (v - MEAN) / STD);
const AFFINE = NORM.map((v) => 2 * v + 1);
const RESTORED = NORM.map((v) => STD * v + MEAN);

const SAMPLES = 2;
const CHANNELS = 3;
const TARGET = 1;

const SCENES = [
  { label: "함께 묶는 값", summary: "channel 1 · m = 2×2×2 = 8", note: "BatchNorm은 channel마다 따로 계산합니다. Channel 1이라면 두 sample의 2×2 위치 값 8개(뒤 식의 m)를 모두 모아 평균과 분산을 냅니다. 같은 sample의 다른 channel 값은 섞지 않습니다." },
  { label: "평균 0 · 분산 1", summary: "μ = 5 · σ² = 5", note: "8개 값의 평균은 5, 분산은 5입니다. 평균을 빼고 √5≈2.24로 나누면 2·4·6·8이 −1.34·−0.45·0.45·1.34가 됩니다. ε는 아주 작은 값(보통 1e-5)이라 이 소수 자리에는 드러나지 않습니다." },
  { label: "γ·β 다시 적용", summary: "γ = 2 · β = 1 (가정)", note: "γ와 β는 channel마다 하나씩 학습되는 값입니다. 여기서는 γ=2, β=1을 가정해 정규화된 값을 두 배로 늘리고 1만큼 옮겼습니다." },
  { label: "원래 분포로 복원", summary: "γ = √(σ²+ε) · β = μ", note: "γ가 표준편차, β가 평균으로 수렴하면 정규화를 그대로 되돌려 원래 값 2·4·6·8이 나옵니다. 이론적으로는 BatchNorm이 표현력을 강제로 깎지 않는다는 뜻입니다. Eval mode에서는 batch 통계 대신 훈련 중 누적한 running mean·variance를 씁니다." },
] as const;

const ROWS: readonly (readonly number[])[] = [RAW, NORM, AFFINE, RESTORED];
const ROW_LABELS: readonly string[] = ["입력 x", "x̂", "γx̂ + β", "γx̂ + β"];

function Cell({ value, on }: { value: string; on: boolean }) {
  return (
    <div className={`flex h-7 items-center justify-center rounded-sm border font-mono text-[11px] ${on ? "border-blue-600 bg-blue-600/10 font-bold text-blue-700 dark:text-blue-300" : "border-border text-muted-foreground"}`}>
      {value}
    </div>
  );
}

export default function BatchNormAxesViz() {
  return (
    <SceneShell
      eyebrow="BatchNorm 축"
      title="한 channel의 값은 batch와 위치를 가로질러 함께 정규화됩니다"
      description="Batch는 한 번에 학습하는 sample 묶음, spatial은 feature map의 가로·세로 위치입니다. 위 그림은 sample 2개 × channel 3개 × 2×2 위치의 작은 tensor이고, 숫자는 계산을 보이려는 가정입니다."
      ariaLabel="BatchNorm이 같은 channel의 batch와 공간 위치 값을 모아 정규화하는 과정"
      scenes={SCENES}
      render={(active) => {
        const values = ROWS[active];
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {Array.from({ length: SAMPLES }, (_, sample) => (
                <div key={sample} className="min-w-0">
                  <p className="mb-1 text-xs font-semibold text-muted-foreground">sample {sample + 1}</p>
                  <div className="grid grid-cols-3 gap-1.5">
                    {Array.from({ length: CHANNELS }, (_, channel) => {
                      const on = channel === TARGET;
                      return (
                        <div key={channel} className="min-w-0">
                          <p className={`text-center text-[11px] ${on ? "font-bold text-blue-700 dark:text-blue-300" : "text-muted-foreground"}`}>ch {channel}</p>
                          <div className="mt-0.5 grid grid-cols-2 gap-0.5">
                            {RAW.map((raw, index) => (
                              <Cell key={index} value={on ? (active === 0 ? String(raw) : values[index].toFixed(2).replace(/\.00$/, "")) : "·"} on={on} />
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-[4.5rem_minmax(0,1fr)] items-center gap-x-2 gap-y-1 text-xs">
              <span className="text-muted-foreground">channel 1</span>
              <span className="font-mono">μ = {MEAN} · σ² = {VAR} · √(σ²+ε) ≈ {STD.toFixed(2)}</span>
              <span className="text-muted-foreground">{ROW_LABELS[active]}</span>
              <span className="font-mono font-bold text-blue-700 dark:text-blue-300">
                {values.map((v) => (active === 0 || active === 3 ? String(Math.round(v)) : v.toFixed(2))).join(" · ")}
              </span>
            </div>
          </div>
        );
      }}
    />
  );
}

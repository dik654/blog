import SceneShell from "./SceneShell";

/**
 * 본문 대응: #ppo 세 번째 ExplainedFormula(GAE).
 * 가정: response는 token 5개, γ = 1. Â_1이 δ_1…δ_5에 주는 weight = (γλ)^l.
 * λ = 0 → 1, 0, 0, 0, 0 / λ = 1 → 1, 1, 1, 1, 1 / λ = 0.9 → 1, 0.9, 0.81, 0.73, 0.66.
 */
const T = 5;
const GAMMA = 1;
const STEPS = Array.from({ length: T }, (_, i) => i);

type Mode = "reward" | "weights" | "recursion";

const SCENES = [
  { mode: "reward", lambda: 0, label: "보상이 있는 자리", summary: "r_5만 reward model 점수", note: "Reward model은 완성된 response 전체에 점수를 하나 줍니다. 그래서 그 점수는 마지막 token의 r_5에만 들어가고, 중간 step에는 보통 KL penalty만 있습니다. 앞쪽 token은 자기 몫을 따로 받지 못합니다." },
  { mode: "weights", lambda: 0, label: "λ = 0", summary: "Â_1 = δ_1 (1-step TD)", note: "δ_t는 한 step의 TD residual, 곧 ‘받은 보상 + 다음 state 가치 − 현재 state 가치 예측’입니다. λ = 0이면 첫 token의 advantage는 바로 자기 step의 δ_1만 봅니다. 뒤쪽 step의 결과는 δ_1 안의 다음 state 가치 예측 V(s_2)에 기댑니다." },
  { mode: "weights", lambda: 1, label: "λ = 1", summary: "Â_1 = δ_1 + … + δ_5", note: "γ = 1, λ = 1이면 뒤쪽 δ를 모두 같은 weight 1로 더합니다. 남은 전체 return과 baseline의 차이, 곧 Monte Carlo advantage와 같습니다." },
  { mode: "weights", lambda: 0.9, label: "λ = 0.9", summary: "1 · 0.9 · 0.81 · 0.73 · 0.66", note: "λ = 0.9이면 한 step 멀어질 때마다 weight가 0.9배가 됩니다. 마지막 δ_5도 0.66만큼 반영되므로 끝의 reward가 첫 token까지 닿되, 먼 미래일수록 덜 반영됩니다. 이 그림은 token 5개라서 0.66이 남습니다. 거리 l의 weight는 0.9^l이라 20 step 떨어지면 약 0.12, 50 step이면 약 0.005로 줄어듭니다." },
  { mode: "recursion", lambda: 0.9, label: "뒤에서부터 한 번에", summary: "Â_t = δ_t + γλ·Â_(t+1) · γλ = 0.9", note: "합을 매번 새로 계산하지 않습니다. 마지막 Â_5 = δ_5에서 시작해 한 칸 앞으로 올 때마다 γλ를 곱하고 그 step의 δ를 더합니다. response가 끝난 뒤의 δ는 0으로 둡니다." },
] as const satisfies readonly { mode: Mode; lambda: number; label: string; summary: string; note: string }[];

export default function GaeWeightViz() {
  return (
    <SceneShell
      eyebrow="GAE"
      title="끝에서 받은 reward가 앞쪽 token의 advantage로 번지는 비율"
      description="칸 하나가 token 한 step입니다(5 token response, γ = 1 가정). λ 장면의 막대 높이는 첫 token의 advantage Â_1이 각 step의 δ(그 step에서 value 예측이 빗나간 정도, λ = 0 장면에서 정의)를 얼마의 weight로 더하는지입니다."
      ariaLabel="λ 값에 따라 첫 token advantage가 뒤쪽 TD residual을 반영하는 weight와 역방향 재귀"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const mode: Mode = scene.mode;
        const decay = GAMMA * scene.lambda;
        return (
          <div className="grid min-w-0 grid-cols-5 gap-2">
            {STEPS.map((t) => {
              const last = t === T - 1;
              const weight = decay ** t;
              return (
                <div key={t} className="flex min-w-0 flex-col items-stretch gap-1.5 text-center">
                  <span className="font-mono text-[11px] font-bold text-muted-foreground">t = {t + 1}</span>
                  <div className="flex h-36 min-w-0 flex-col justify-end rounded-md border border-border/60 bg-background p-1.5">
                    {mode === "reward" && (
                      <div className={`flex h-full flex-col items-center justify-center rounded border px-1 text-[10px] leading-4 sm:text-[11px] ${last ? "border-blue-600/70 font-bold text-blue-700 dark:text-blue-400" : "border-dashed border-border text-muted-foreground"}`}>
                        <span className="font-mono">r_{t + 1}</span>
                        <span className="break-words">{last ? "reward model 점수 + KL" : "KL penalty만"}</span>
                      </div>
                    )}
                    {mode === "weights" && (
                      <>
                        <span className="font-mono text-[11px] font-bold text-primary">{weight === 0 ? "0" : weight.toFixed(2).replace(/\.?0+$/, "")}</span>
                        <div className="mt-1 w-full rounded-sm" style={{ height: `${weight * 78}%`, backgroundColor: "#2563eb", opacity: weight === 0 ? 0 : 0.85 }} />
                      </>
                    )}
                    {mode === "recursion" && (
                      <div className="flex h-full flex-col items-center justify-center gap-1 text-[10px] leading-4 sm:text-[11px]">
                        <span className="font-mono font-bold text-primary">Â_{t + 1}</span>
                        <span className="break-words font-mono">{last ? "= δ_5" : `= δ_${t + 1} + 0.9·Â_${t + 2}`}</span>
                        <span className="text-muted-foreground">{last ? "시작" : `${T - t}번째 계산`}</span>
                      </div>
                    )}
                  </div>
                  <span className="font-mono text-[11px] text-muted-foreground">{mode === "reward" ? `token ${t + 1}` : `δ_${t + 1}`}</span>
                </div>
              );
            })}
          </div>
        );
      }}
    />
  );
}

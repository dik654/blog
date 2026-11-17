import SceneShell from "./SceneShell";

/**
 * 본문 대응: #loss — L = −Σ ỹ_k log p_k를 class별 항으로 나눠 본다.
 * p=(.05,.85,.05,.05)는 설명용 가정. −ln .85≈.163, −ln .05≈3.00.
 * One-hot: .163만 남음. Smoothed (.025,.925,.025,.025): .075+.150+.075+.075≈.375.
 */
const P: readonly number[] = [0.05, 0.85, 0.05, 0.05];
const ONE_HOT: readonly number[] = [0, 1, 0, 0];
const SMOOTHED: readonly number[] = [0.025, 0.925, 0.025, 0.025];
const CLASS_LABELS: readonly string[] = ["c₁", "c₂", "c₃", "c₄"];
const SURPRISE = P.map((p) => -Math.log(p));
const SCALE = 3.2;

const SCENES = [
  {
    label: "Class별 −log p",
    summary: "p=(.05,.85,.05,.05) (가정)",
    note: "Model이 softmax 뒤 정답 c₂에 .85, 나머지에 .05씩 준다고 가정합니다. −log p는 그 class를 낮게 볼수록 커집니다. 아직 target으로 가중하기 전입니다.",
    weights: null,
  },
  {
    label: "One-hot target으로 가중",
    summary: "L = 1×.163 ≈ .163",
    note: "Target (0,1,0,0)이면 c₂ 항만 남고 나머지 세 class의 항은 0을 곱해 사라집니다.",
    weights: ONE_HOT,
  },
  {
    label: "Smoothed target으로 가중",
    summary: "L ≈ .150 + 3×.075 ≈ .375",
    note: "Target (.025,.925,.025,.025)이면 정답이 아닌 세 class의 항도 .025만큼 loss에 들어옵니다. 본문대로 이것이 calibration 개선을 자동 보장하지는 않습니다.",
    weights: SMOOTHED,
  },
] as const;

function fmt(value: number) {
  return value.toFixed(3).replace(/^0\./, ".");
}

function short(value: number) {
  return Number(value.toFixed(3)).toString().replace(/^0\./, ".");
}

export default function LossTermsViz() {
  return (
    <SceneShell
      eyebrow="Soft-target cross-entropy"
      title="Target 질량이 어느 class의 −log p를 loss에 넣는지 정합니다"
      description="회색 막대는 class별 −log p(자연로그), 파란 막대는 거기에 target 질량을 곱한 항입니다. Loss는 파란 항의 합입니다. Model probability p는 설명용 가정입니다."
      ariaLabel="One-hot과 smoothed target에서 class별 cross-entropy 항 비교"
      scenes={SCENES}
      render={(active) => {
        const weights: readonly number[] | null = (SCENES as readonly (typeof SCENES)[number][])[active].weights;
        const terms = SURPRISE.map((s, index) => (weights ? weights[index] * s : null));
        const loss = terms.reduce<number>((sum, term) => sum + (term ?? 0), 0);
        return (
          <div className="min-w-0 space-y-3">
            {CLASS_LABELS.map((label, index) => {
              const term = terms[index];
              return (
                <div key={label} className="grid grid-cols-[2rem_minmax(0,1fr)] items-start gap-2 text-xs sm:text-sm">
                  <span className="pt-0.5 font-mono font-bold">{label}</span>
                  <div className="min-w-0 space-y-1">
                    <div className="grid grid-cols-[minmax(0,1fr)_8rem] items-center gap-2">
                      <div className="h-3 min-w-0 rounded-sm bg-muted/40">
                        <div className="h-full rounded-sm" style={{ width: `${(SURPRISE[index] / SCALE) * 100}%`, backgroundColor: "#94a3b8" }} />
                      </div>
                      <span className="whitespace-nowrap font-mono text-xs text-muted-foreground">−log {short(P[index])} = {fmt(SURPRISE[index])}</span>
                    </div>
                    <div className="grid grid-cols-[minmax(0,1fr)_8rem] items-center gap-2">
                      <div className="h-3 min-w-0 rounded-sm bg-muted/40">
                        <div className="h-full rounded-sm transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${((term ?? 0) / SCALE) * 100}%`, backgroundColor: "#2563eb" }} />
                      </div>
                      <span className="whitespace-nowrap font-mono text-xs font-bold">
                        {weights ? `×${short(weights[index])} = ${fmt(term ?? 0)}` : "가중 전"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
            <div className="flex items-center justify-between border-t border-border pt-2 text-sm">
              <span className="font-semibold">L = 파란 항의 합</span>
              <span className="font-mono font-bold">{weights ? `≈ ${fmt(loss)}` : "−"}</span>
            </div>
          </div>
        );
      }}
    />
  );
}

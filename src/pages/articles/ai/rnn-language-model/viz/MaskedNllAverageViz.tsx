import SceneShell from "./SceneShell";

/**
 * 본문 대응: 두 번째 ExplainedFormula — L_NLL = −(1/T) Σ log pₜ[w_{t+1}], padding은 mask로 제외.
 * [BOS, 나, 간다, EOS] 뒤에 padding 한 칸이 붙은 batch 행(가정).
 * 정답 확률 0.50, 0.68, 0.25(가정) → NLL 0.69, 0.39, 1.39 → 합 2.47 → T=3 평균 0.82.
 */
const STEPS = [
  { input: "BOS", target: "나", prob: 0.5 },
  { input: "나", target: "간다", prob: 0.68 },
  { input: "간다", target: "EOS", prob: 0.25 },
] as const;

const NLL = STEPS.map((step) => -Math.log(step.prob));
const TOTAL = NLL.reduce<number>((sum, value) => sum + value, 0);
const MEAN = TOTAL / STEPS.length;
const MAX_NLL = 1.6;

const SCENES = [
  {
    label: "정답 확률만 고르기",
    summary: "0.50 · 0.68 · 0.25",
    note: "각 위치의 distribution 전체가 아니라 한 칸 뒤 정답 token에 배정한 확률 하나만 꺼냅니다. 마지막 PAD 칸은 정답이 없으므로 mask로 뺍니다.",
  },
  {
    label: "−log로 surprise",
    summary: "0.69 · 0.39 · 1.39",
    note: "−log를 취하면 확률이 작을수록 값이 커집니다. 0.25를 준 세 번째 위치가 1.39로 가장 큰 penalty를 받습니다.",
  },
  {
    label: "valid token으로 평균",
    summary: `${TOTAL.toFixed(2)} ÷ 3 = ${MEAN.toFixed(2)}`,
    note: `세 값을 더하면 ${TOTAL.toFixed(2)}이고, mask로 뺀 PAD는 T에 세지 않으므로 3으로 나눠 ${MEAN.toFixed(2)}입니다. PAD를 세면 분모가 달라져 같은 예측의 loss가 다르게 보입니다.`,
  },
] as const;

export default function MaskedNllAverageViz() {
  return (
    <SceneShell
      eyebrow="한 문장, 세 개의 shifted pair"
      title="정답 확률을 −log로 바꾸고, mask 밖의 token 수로만 평균합니다"
      description="한 행이 한 위치입니다. 정답 확률 0.50·0.68·0.25와 끝에 붙은 PAD 한 칸은 계산 경로를 보이기 위한 가정입니다. 막대는 그 위치의 NLL 크기입니다."
      ariaLabel="세 위치의 정답 확률을 negative log로 바꾸고 padding을 제외해 평균 NLL을 구하는 과정"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0 space-y-2 text-xs sm:text-sm">
          <div className="grid grid-cols-[5.2rem_3rem_minmax(0,1fr)] gap-2 text-[10px] text-muted-foreground sm:grid-cols-[6.5rem_3.5rem_minmax(0,1fr)]">
            <span>입력 → 정답</span>
            <span>정답 확률</span>
            <span>NLL = −ln p</span>
          </div>
          {STEPS.map((step, index) => (
            <div key={step.input} className="grid grid-cols-[5.2rem_3rem_minmax(0,1fr)] items-center gap-2 sm:grid-cols-[6.5rem_3.5rem_minmax(0,1fr)]">
              <span className="break-keep">
                {step.input} → <strong className="text-primary">{step.target}</strong>
              </span>
              <span className={`font-mono ${active === 0 ? "font-bold text-primary" : ""}`}>{step.prob.toFixed(2)}</span>
              <span className="grid min-w-0 grid-cols-[minmax(0,1fr)_2.4rem] items-center gap-1.5">
                <span className="h-3 min-w-0 rounded-sm bg-muted/50">
                  <span className="block h-full rounded-sm" style={{ width: active >= 1 ? `${(NLL[index] / MAX_NLL) * 100}%` : "0%", backgroundColor: "#d97706" }} />
                </span>
                <span className={`text-right font-mono ${active >= 1 ? "font-bold" : "text-muted-foreground/40"}`}>{active >= 1 ? NLL[index].toFixed(2) : "—"}</span>
              </span>
            </div>
          ))}
          <div className="grid grid-cols-[5.2rem_3rem_minmax(0,1fr)] items-center gap-2 text-muted-foreground sm:grid-cols-[6.5rem_3.5rem_minmax(0,1fr)]">
            <span>EOS → PAD</span>
            <span className="font-mono">mask</span>
            <span className="rounded-sm border border-dashed border-border px-2 py-0.5 text-[10px]">합계·T에서 제외</span>
          </div>
          <div className="mt-3 flex flex-wrap items-baseline justify-between gap-2 border-t border-border pt-3">
            <span className="text-[11px] text-muted-foreground">평균 NLL (T = 3)</span>
            <span className={`font-mono font-bold ${active >= 2 ? "text-primary" : "text-muted-foreground/40"}`}>
              {active >= 2 ? `(${NLL.map((value) => value.toFixed(2)).join(" + ")}) ÷ 3 = ${MEAN.toFixed(2)}` : "—"}
            </span>
          </div>
        </div>
      )}
    />
  );
}

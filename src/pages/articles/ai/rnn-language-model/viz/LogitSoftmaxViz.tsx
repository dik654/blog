import SceneShell from "./SceneShell";

/**
 * 본문 대응: 첫 ExplainedFormula — zₜ = W_yh hₜ + b_y, pₜ = softmax(zₜ).
 * TermBreakdown의 H=2, vocabulary 3개 예를 숫자로 채웁니다(값은 가정, b_y=0).
 * hₜ=(0.8, −0.4). 간다 (2, −1) → 2.0, 본다 (1, 0) → 0.8, EOS (0, −0.5) → 0.2.
 * exp → 7.39, 2.23, 1.22, 합 10.84 → 0.68, 0.21, 0.11.
 */
const H: readonly [number, number] = [0.8, -0.4];
const ROWS = [
  { token: "간다", w: [2, -1] },
  { token: "본다", w: [1, 0] },
  { token: "EOS", w: [0, -0.5] },
] as const;

const LOGITS = ROWS.map((row) => row.w[0] * H[0] + row.w[1] * H[1]);
const EXPS = LOGITS.map((z) => Math.exp(z));
const EXP_SUM = EXPS.reduce<number>((sum, value) => sum + value, 0);
const PROBS = EXPS.map((value) => value / EXP_SUM);
const LOGIT_SUM = LOGITS.reduce<number>((sum, value) => sum + value, 0);

const signed = (value: number) => (value < 0 ? `−${Math.abs(value)}` : `${value}`);

const SCENES = [
  {
    label: "W_yh hₜ → logit",
    summary: `logit 합 ${LOGIT_SUM.toFixed(1)}`,
    note: "3×2 matrix의 각 행이 hₜ의 두 좌표와 곱해져 token 하나의 점수가 됩니다. 예를 들어 간다는 2×0.8 + (−1)×(−0.4) = 2.0입니다. 세 logit의 합은 3.0입니다. logit은 probability가 아니므로 합이 1일 필요가 없습니다.",
  },
  {
    label: "exp로 양수화",
    summary: `exp 합 ${EXP_SUM.toFixed(2)}`,
    note: "softmax는 먼저 각 logit에 exp를 취합니다. 결과는 모두 양수이고, logit 차이가 클수록 값의 차이가 더 벌어집니다.",
  },
  {
    label: "합으로 나누기",
    summary: "probability 합 1",
    note: `exp 값을 합 ${EXP_SUM.toFixed(2)}로 나누면 0.68, 0.21, 0.11이 되고 합이 1입니다. 이것이 현재 prefix 뒤 다음 token의 distribution pₜ입니다.`,
  },
] as const;

export default function LogitSoftmaxViz() {
  return (
    <SceneShell
      eyebrow="H=2, vocabulary 3개"
      title="hidden state 두 숫자가 logit 세 개를 거쳐 합 1의 probability가 됩니다"
      description="hₜ=(0.8, −0.4), W_yh 값, bias 0, vocabulary {간다, 본다, EOS}는 모두 계산 경로를 보이기 위한 가정입니다. logit은 token별 정규화 전 점수입니다."
      ariaLabel="hidden state를 output projection과 softmax로 다음 token probability로 바꾸는 세 단계"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0 text-xs sm:text-sm">
          <p className="mb-3 font-mono">
            hₜ = (<span className="font-bold">0.8</span>, <span className="font-bold">−0.4</span>)
          </p>
          <div className="grid grid-cols-[2.6rem_4.2rem_2.4rem_2.8rem_minmax(0,1fr)] items-center gap-x-2 gap-y-1 sm:grid-cols-[3.5rem_5rem_3.5rem_3.5rem_minmax(0,1fr)]">
            <span className="text-[10px] text-muted-foreground">token</span>
            <span className="text-[10px] text-muted-foreground">W_yh 행</span>
            <span className={`text-[10px] ${active === 0 ? "font-bold text-primary" : "text-muted-foreground"}`}>logit z</span>
            <span className={`text-[10px] ${active === 1 ? "font-bold text-primary" : "text-muted-foreground"}`}>exp(z)</span>
            <span className={`text-[10px] ${active === 2 ? "font-bold text-primary" : "text-muted-foreground"}`}>p (막대)</span>
            {ROWS.map((row, index) => (
              <Row key={row.token} token={row.token} w={`(${signed(row.w[0])}, ${signed(row.w[1])})`} z={LOGITS[index]} e={EXPS[index]} p={PROBS[index]} active={active} />
            ))}
            <span className="col-span-2 text-right text-[10px] text-muted-foreground">합</span>
            <span className="font-mono">{LOGIT_SUM.toFixed(1)}</span>
            <span className={`font-mono ${active >= 1 ? "" : "text-muted-foreground/40"}`}>{active >= 1 ? EXP_SUM.toFixed(2) : "—"}</span>
            <span className={`font-mono ${active >= 2 ? "font-bold" : "text-muted-foreground/40"}`}>{active >= 2 ? "1.00" : "—"}</span>
          </div>
        </div>
      )}
    />
  );
}

function Row({ token, w, z, e, p, active }: { token: string; w: string; z: number; e: number; p: number; active: number }) {
  return (
    <>
      <span className="font-bold">{token}</span>
      <span className="font-mono text-muted-foreground">{w}</span>
      <span className={`font-mono ${active === 0 ? "font-bold text-primary" : ""}`}>{z.toFixed(1)}</span>
      <span className={`font-mono ${active === 1 ? "font-bold text-primary" : active > 1 ? "" : "text-muted-foreground/40"}`}>{active >= 1 ? e.toFixed(2) : "—"}</span>
      <span className={`font-mono ${active >= 2 ? "font-bold" : "text-muted-foreground/40"}`}>{active >= 2 ? p.toFixed(2) : "—"}</span>
      <span className="col-span-5 mb-1 h-2 min-w-0 rounded-sm bg-muted/50">
        <span className="block h-full rounded-sm" style={{ width: active >= 2 ? `${p * 100}%` : "0%", backgroundColor: "#2563eb" }} />
      </span>
    </>
  );
}

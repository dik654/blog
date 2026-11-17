import SceneShell from "./SceneShell";

/**
 * 본문 대응: #training — softmax cross-entropy는 logits에서 행별 최댓값을 빼는 log-sum-exp trick을 적용한다.
 * 가정한 한 행의 logits: 1000, 1001, 1002, 정답 class 3.
 * x−max = −2, −1, 0 → exp 0.1353, 0.3679, 1 → 합 1.5032 → softmax 0.0900, 0.2447, 0.6652.
 * log-sum-exp = 1002 + ln 1.5032 = 1002.4076, loss = 1002.4076 − 1002 = 0.4076 = −ln 0.6652.
 */
const LOGITS = [1000, 1001, 1002];
const MAX = Math.max(...LOGITS);
const SHIFTED = LOGITS.map((x) => x - MAX);
const EXPS = SHIFTED.map((x) => Math.exp(x));
const SUM = EXPS.reduce<number>((a, b) => a + b, 0);
const PROBS = EXPS.map((e) => e / SUM);
const LSE = MAX + Math.log(SUM);
const LOSS = LSE - LOGITS[2];

const f = (v: number, d: number) => v.toFixed(d);

const SCENES = [
  {
    label: "그대로 exp하면 넘침",
    summary: "e¹⁰⁰⁰ ≈ 10⁴³⁴",
    reveal: 0,
    note: "e¹⁰⁰⁰은 약 10⁴³⁴(1000÷ln10 ≈ 434)로, 배정밀도 부동소수점의 상한(약 1.8×10³⁰⁸)을 넘어 계산 단계에서 표현할 수 없습니다.",
  },
  {
    label: "행 최댓값 1002를 뺌",
    summary: `exp 합 = ${f(SUM, 4)}`,
    reveal: 1,
    note: "같은 행의 최댓값 1002를 모든 logit에서 빼면 −2, −1, 0이 되어 exp 값이 1을 넘지 않습니다.",
  },
  {
    label: "확률은 그대로",
    summary: `${f(PROBS[0], 3)} · ${f(PROBS[1], 3)} · ${f(PROBS[2], 3)}`,
    reveal: 2,
    note: "모든 항에서 같은 e¹⁰⁰²이 빠졌으므로 분자와 분모에서 약분됩니다. 원래 logits로 계산했을 softmax와 같은 확률입니다.",
  },
  {
    label: "loss는 뺀 값을 다시 더함",
    summary: `loss = ${f(LOSS, 4)}`,
    reveal: 3,
    note: `log-sum-exp = 1002 + ln ${f(SUM, 4)} = ${f(LSE, 4)}입니다. 정답 class 3의 logit 1002를 빼면 ${f(LOSS, 4)}이고, −ln ${f(PROBS[2], 4)}와 같습니다.`,
  },
];

function Cell({ on, children, strong = false }: { on: boolean; children: string; strong?: boolean }) {
  return (
    <span className={`text-right font-mono ${on ? (strong ? "font-bold text-[#2563eb]" : "text-foreground") : "text-muted-foreground/40"}`}>
      {children}
    </span>
  );
}

function Bar({ value, on, color }: { value: number; on: boolean; color: string }) {
  return (
    <span className="block h-3 min-w-0 rounded-sm bg-muted/40" aria-hidden>
      <span className="block h-full rounded-sm" style={{ width: on ? `${value * 100}%` : "0%", backgroundColor: color }} />
    </span>
  );
}

function Table({ reveal }: { reveal: number }) {
  const cols = "grid grid-cols-[2.5rem_2.75rem_2.25rem_minmax(0,1fr)_minmax(0,1fr)] items-center gap-x-2";
  return (
    <div className="min-w-0 text-xs leading-6" role="list" aria-label="logit에서 확률과 loss까지">
      <div className={`${cols} border-b border-border/70 pb-1 font-semibold text-muted-foreground`}>
        <span>class</span>
        <span className="text-right">logit</span>
        <span className="text-right">−max</span>
        <span>exp</span>
        <span>softmax</span>
      </div>
      {LOGITS.map((logit, i) => (
        <div key={logit} role="listitem" className={`${cols} border-b border-border/40 py-1`}>
          <span className={i === 2 && reveal === 3 ? "font-bold text-[#16a34a]" : "text-muted-foreground"}>{i + 1}{i === 2 ? " 정답" : ""}</span>
          <Cell on>{String(logit)}</Cell>
          <Cell on={reveal >= 1}>{reveal >= 1 ? String(SHIFTED[i]) : "·"}</Cell>
          <span className="grid min-w-0 grid-cols-[minmax(0,1fr)_2.6rem] items-center gap-1">
            {reveal === 0 ? (
              <span className="col-span-2 font-mono font-semibold text-[#dc2626]">e^{logit} 넘침</span>
            ) : (
              <>
                <Bar value={EXPS[i]} on color="#64748b" />
                <Cell on>{f(EXPS[i], 3)}</Cell>
              </>
            )}
          </span>
          <span className="grid min-w-0 grid-cols-[minmax(0,1fr)_2.4rem] items-center gap-1">
            <Bar value={PROBS[i]} on={reveal >= 2} color="#2563eb" />
            <Cell on={reveal >= 2} strong={i === 2 && reveal === 3}>{reveal >= 2 ? f(PROBS[i], 3) : "·"}</Cell>
          </span>
        </div>
      ))}
      <div className="mt-2 grid gap-1 font-mono">
        <span className={reveal >= 1 ? "text-foreground" : "text-muted-foreground/40"}>exp 합 = {reveal >= 1 ? f(SUM, 4) : "·"}</span>
        <span className={reveal === 3 ? "text-foreground" : "text-muted-foreground/40"}>
          {reveal === 3 ? `LSE = 1002 + ln ${f(SUM, 4)} = ${f(LSE, 4)} → loss ${f(LOSS, 4)}` : "LSE · loss = ·"}
        </span>
      </div>
    </div>
  );
}

export default function LogSumExpViz() {
  return (
    <SceneShell
      eyebrow="log-sum-exp trick"
      title="최댓값을 빼도 확률은 그대로이고 exp만 작아집니다"
      description="sample 한 행의 logits 1000·1001·1002와 정답 class 3은 그림을 위한 가정입니다. logit은 softmax에 들어가기 전의 class별 점수입니다."
      ariaLabel="큰 logit에서 행 최댓값을 빼 softmax와 cross-entropy를 안정적으로 계산하는 네 장면"
      scenes={SCENES}
      render={(scene) => <Table reveal={SCENES[scene].reveal} />}
    />
  );
}

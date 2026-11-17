import SceneShell from "./SceneShell";

/**
 * 본문 대응: #objective — augmented risk는 transform 평균(안쪽)과 sample 평균(바깥쪽)의 두 겹 평균이다.
 * Policy는 1절 용어 예의 "확률 0.5 flip"을 쓴다. 원본 2장과 loss 값은 그림용 가정이다.
 * L̄₁ = 0.5×0.4 + 0.5×0.8 = 0.6, L̄₂ = 0.5×0.2 + 0.5×0.6 = 0.4, R̂ = (0.6 + 0.4) / 2 = 0.5.
 */
const P_FLIP = 0.5;
const ROWS = [
  { name: "원본 1", keep: 0.4, flip: 0.8 },
  { name: "원본 2", keep: 0.2, flip: 0.6 },
] as const;

const fmt = (v: number) => (Math.round(v * 100) / 100).toFixed(1);
const MEANS = ROWS.map((row) => (1 - P_FLIP) * row.keep + P_FLIP * row.flip);
const RISK = MEANS.reduce<number>((sum, v) => sum + v, 0) / ROWS.length;

const SCENES = [
  {
    label: "ω 하나 뽑기",
    summary: "ω ~ A: flip 안 함 0.5 · flip 0.5",
    note: "ω는 이번 step에 쓸 transform parameter이고, A는 그 parameter를 뽑는 policy입니다. 한 step에서는 두 칸 중 하나만 나오고, 여기서는 원본 1에 flip이 나왔다고 가정했습니다. 칸의 loss 값과 원본 2장도 계산을 보이려는 가정입니다.",
  },
  {
    label: "원본 1의 transform 평균",
    summary: `L̄₁ = 0.5×0.4 + 0.5×0.8 = ${fmt(MEANS[0])}`,
    note: "안쪽 평균 E_ω는 뽑힐 수 있는 변화마다 loss에 확률을 곱해 더합니다. 원본 1 하나가 flip 안 한 경우와 flip한 경우를 모두 대표하는 학습 신호가 됩니다.",
  },
  {
    label: "원본 2의 transform 평균",
    summary: `L̄₂ = 0.5×0.2 + 0.5×0.6 = ${fmt(MEANS[1])}`,
    note: "원본마다 같은 policy로 안쪽 평균을 따로 구합니다. 각 칸의 무게는 저장한 파일 수가 아니라 policy의 확률 0.5입니다.",
  },
  {
    label: "원본 평균",
    summary: `R̂ = (${fmt(MEANS[0])} + ${fmt(MEANS[1])}) / 2 = ${fmt(RISK)}`,
    note: "바깥 평균 1/N Σ는 원본 sample을 평균합니다(여기서 N = 2, 가정). 그래서 training은 파일 수가 아니라 sampling distribution의 expectation을 최적화합니다.",
  },
] as const;

function Cell({ label, value, on, strong = false }: { label: string; value: string; on: boolean; strong?: boolean }) {
  return (
    <div
      className={`min-w-0 rounded-lg border px-2 py-2 text-center transition-opacity duration-300 motion-reduce:transition-none ${
        on ? (strong ? "border-primary bg-primary/10 opacity-100" : "border-primary/60 opacity-100") : "border-border opacity-40"
      }`}
    >
      <span className="block text-[11px] leading-4 text-muted-foreground">{label}</span>
      <span className={`block font-mono text-sm ${strong ? "font-bold" : ""}`}>{value}</span>
    </div>
  );
}

export default function ExpectationAverageViz() {
  return (
    <SceneShell
      eyebrow="두 겹 평균"
      title="Augmented risk는 transform 평균을 다시 원본끼리 평균합니다"
      description="Policy A는 확률 0.5로 좌우 flip합니다. 가로줄이 원본, 앞 두 칸이 뽑힐 수 있는 변화의 loss, 셋째 칸이 그 원본의 평균 L̄입니다. 원본 2장과 loss 값은 가정입니다."
      ariaLabel="원본 두 장에 대해 flip 확률 0.5의 기댓값 loss를 구하고 원본끼리 평균하는 계산"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0 space-y-2">
          <div className="grid grid-cols-[3.5rem_repeat(3,minmax(0,1fr))] gap-2 text-center text-[11px] text-muted-foreground">
            <span />
            <span>flip 안 함 · p 0.5</span>
            <span>flip · p 0.5</span>
            <span>평균 L̄</span>
          </div>
          {ROWS.map((row, i) => {
            const rowOn = active === 0 ? i === 0 : active === i + 1 || active === 3;
            const meanOn = active === i + 1 || active === 3;
            return (
              <div key={row.name} className="grid grid-cols-[3.5rem_repeat(3,minmax(0,1fr))] items-center gap-2">
                <span className="text-xs font-bold">{row.name}</span>
                <Cell label="loss (가정)" value={fmt(row.keep)} on={rowOn && active !== 3 && active !== 0} />
                <Cell label="loss (가정)" value={fmt(row.flip)} on={rowOn && active !== 3} strong={active === 0 && i === 0} />
                <Cell label={`L̄${i === 0 ? "₁" : "₂"}`} value={active === 0 ? "?" : active >= i + 1 ? fmt(MEANS[i]) : "?"} on={meanOn} strong={active === i + 1} />
              </div>
            );
          })}
          <div className="grid grid-cols-[3.5rem_repeat(3,minmax(0,1fr))] items-center gap-2 border-t border-border pt-2">
            <span className="text-xs font-bold">N = 2</span>
            <span className="col-span-2 text-right text-xs text-muted-foreground">원본 평균 1/N Σ L̄ →</span>
            <Cell label="R̂" value={active === 3 ? fmt(RISK) : "?"} on={active === 3} strong={active === 3} />
          </div>
        </div>
      )}
    />
  );
}

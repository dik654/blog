import SceneShell from "./SceneShell";

/**
 * 본문 대응: #tabnet — u = P ⊙ score, M = sparsemax(u), P⁽ˢ⁾ = P⁽ˢ⁻¹⁾ ⊙ (γ − M⁽ˢ⁾).
 * 특성 4개, score [1.2, 0.9, 0.3, 0.1]은 설명용 가정이며 2단계에도 같은 score를 둬 prior 효과만 분리합니다.
 * sparsemax(z)ᵢ = max(zᵢ − τ, 0), τ는 합이 1이 되도록 고릅니다.
 * 1단계: τ = 0.55 → M⁽¹⁾ = [0.65, 0.35, 0, 0].
 * γ = 1   → P⁽¹⁾ = [0.35, 0.65, 1, 1] → u⁽²⁾ = [0.42, 0.585, 0.3, 0.1] → M⁽²⁾ ≈ [0.32, 0.48, 0.20, 0].
 * γ = 1.5 → P⁽¹⁾ = [0.85, 1.15, 1.5, 1.5] → u⁽²⁾ = [1.02, 1.035, 0.45, 0.15] → M⁽²⁾ ≈ [0.49, 0.51, 0, 0].
 */
const FEATURES = ["소득", "부채", "연체", "직업"] as const;
const SCORE: readonly number[] = [1.2, 0.9, 0.3, 0.1];
const ONES: readonly number[] = [1, 1, 1, 1];
const MAX_VALUE = 1.5;

function sparsemaxTau(z: readonly number[]): number {
  const sorted = [...z].sort((a, b) => b - a);
  const prefix = sorted.map((_, i) => sorted.slice(0, i + 1).reduce<number>((sum, v) => sum + v, 0));
  const support = sorted.filter((v, i) => 1 + (i + 1) * v > prefix[i]).length;
  return (prefix[support - 1] - 1) / support;
}

const sparsemax = (z: readonly number[]) => {
  const tau = sparsemaxTau(z);
  return { tau, mask: z.map((v) => Math.max(v - tau, 0)) };
};
const times = (a: readonly number[], b: readonly number[]) => a.map((v, i) => v * b[i]);

const STEP1 = sparsemax(times(ONES, SCORE));
const RELAX = (gamma: number) => STEP1.mask.map((m) => gamma - m);
const P1_G1 = times(ONES, RELAX(1));
const P1_G15 = times(ONES, RELAX(1.5));
const U2_G1 = times(P1_G1, SCORE);
const U2_G15 = times(P1_G15, SCORE);
const STEP2_G1 = sparsemax(U2_G1);
const STEP2_G15 = sparsemax(U2_G15);

const f2 = (v: number) => v.toFixed(2);
const list = (values: readonly number[]) => values.map(f2).join(" · ");

type Row = { label: string; values: readonly number[]; kind: "input" | "prior" | "mask" };

const SCENES = [
  {
    label: "1단계 · mask 만들기",
    summary: `τ = ${f2(STEP1.tau)} → M⁽¹⁾ = ${list(STEP1.mask)}`,
    note: `처음에는 prior가 모두 1이라 score가 그대로 u가 됩니다. sparsemax는 모든 값에서 같은 τ를 빼고 0 아래는 0으로 자르며, τ는 남은 값의 합이 1이 되게 고릅니다. 여기서는 τ = ${f2(STEP1.tau)}이라 연체·직업이 정확히 0이 됩니다.`,
    rows: [
      { label: "prior P⁽⁰⁾", values: ONES, kind: "prior" },
      { label: "score (가정)", values: SCORE, kind: "input" },
      { label: "u⁽¹⁾ = P⁽⁰⁾ ⊙ score", values: times(ONES, SCORE), kind: "input" },
      { label: "mask M⁽¹⁾", values: STEP1.mask, kind: "mask" },
    ] as readonly Row[],
  },
  {
    label: "γ = 1 · prior 깎기",
    summary: `P⁽¹⁾ = ${list(P1_G1)}`,
    note: "γ = 1이면 이번에 쓴 만큼 그대로 깎습니다. 0.65를 받은 소득은 다음 prior가 0.35로, 고르지 않은 연체·직업은 1로 남습니다.",
    rows: [
      { label: "prior P⁽⁰⁾", values: ONES, kind: "prior" },
      { label: "mask M⁽¹⁾", values: STEP1.mask, kind: "mask" },
      { label: "γ − M⁽¹⁾", values: RELAX(1), kind: "input" },
      { label: "prior P⁽¹⁾", values: P1_G1, kind: "prior" },
    ] as readonly Row[],
  },
  {
    label: "γ = 1 · 2단계 mask",
    summary: `M⁽²⁾ = ${list(STEP2_G1.mask)}`,
    note: `prior 효과만 보려고 2단계 score를 1단계와 같게 두었습니다(가정). 같은 score여도 소득의 u가 낮아져 τ = ${f2(STEP2_G1.tau)}이 되고, 1단계에서 0이던 연체가 mask에 들어옵니다.`,
    rows: [
      { label: "prior P⁽¹⁾", values: P1_G1, kind: "prior" },
      { label: "score (가정)", values: SCORE, kind: "input" },
      { label: "u⁽²⁾ = P⁽¹⁾ ⊙ score", values: U2_G1, kind: "input" },
      { label: "mask M⁽²⁾", values: STEP2_G1.mask, kind: "mask" },
    ] as readonly Row[],
  },
  {
    label: "γ = 1.5 (가정) · 2단계 mask",
    summary: `M⁽²⁾ = ${list(STEP2_G15.mask)}`,
    note: `γ를 1.5로 키우면 소득의 prior가 ${f2(P1_G15[0])}로 덜 깎여 2단계도 소득·부채를 다시 고릅니다. 같은 feature를 다시 쓸 여지가 생긴 것이며, γ를 키운다고 일반화 성능이 단조롭게 좋아지지는 않습니다.`,
    rows: [
      { label: "prior P⁽¹⁾", values: P1_G15, kind: "prior" },
      { label: "score (가정)", values: SCORE, kind: "input" },
      { label: "u⁽²⁾ = P⁽¹⁾ ⊙ score", values: U2_G15, kind: "input" },
      { label: "mask M⁽²⁾", values: STEP2_G15.mask, kind: "mask" },
    ] as readonly Row[],
  },
] as const;

const COLOR: Record<Row["kind"], string> = { input: "#64748b", prior: "#d97706", mask: "#2563eb" };

export default function TabNetPriorViz() {
  return (
    <SceneShell
      eyebrow="prior와 mask"
      title="이번 단계에 많이 쓴 feature는 다음 단계에서 덜 뽑힙니다"
      description="한 고객 row의 특성 4개로 두 단계를 계산합니다. 각 단계 뒤 prior는 P⁽ˢ⁾ = P⁽ˢ⁻¹⁾ ⊙ (γ − M⁽ˢ⁾)로 갱신되며, γ는 같은 feature를 다시 쓸 여지를 정하는 relaxation parameter(1 이상)입니다. 막대 길이는 0~1.5 눈금이고, score와 γ = 1.5는 설명용 가정입니다. ⊙는 같은 칸끼리 곱하기입니다."
      ariaLabel="TabNet의 prior 갱신과 sparsemax mask를 두 단계에 걸쳐 계산"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-[minmax(0,7.5rem)_repeat(4,minmax(0,1fr))] gap-x-2 gap-y-1 text-[11px] font-semibold text-muted-foreground sm:grid-cols-[10rem_repeat(4,minmax(0,1fr))] sm:text-xs">
              <span />
              {FEATURES.map((name) => (
                <span key={name} className="text-center">
                  {name}
                </span>
              ))}
            </div>
            <div className="mt-2 space-y-3">
              {scene.rows.map((row) => (
                <div
                  key={row.label}
                  className="grid grid-cols-[minmax(0,7.5rem)_repeat(4,minmax(0,1fr))] items-center gap-x-2 sm:grid-cols-[10rem_repeat(4,minmax(0,1fr))]"
                >
                  <span className={`break-keep text-[11px] leading-4 sm:text-xs ${row.kind === "mask" ? "font-bold" : "text-muted-foreground"}`}>{row.label}</span>
                  {row.values.map((value, i) => (
                    <div key={FEATURES[i]} className="min-w-0">
                      <div className="h-2.5 rounded-sm bg-muted/50">
                        <div
                          className="h-full rounded-sm transition-[width] duration-300 motion-reduce:transition-none"
                          style={{ width: `${(Math.min(value, MAX_VALUE) / MAX_VALUE) * 100}%`, backgroundColor: COLOR[row.kind] }}
                        />
                      </div>
                      <p className={`mt-0.5 text-center font-mono text-[11px] ${value === 0 && row.kind === "mask" ? "font-bold text-red-700 dark:text-red-400" : "text-muted-foreground"}`}>
                        {value === 0 && row.kind === "mask" ? "0" : f2(value)}
                      </p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
              <span><span className="mr-1 inline-block h-2 w-3 align-middle" style={{ backgroundColor: COLOR.prior }} />prior: 지금까지 남은 사용 여지</span>
              <span><span className="mr-1 inline-block h-2 w-3 align-middle" style={{ backgroundColor: COLOR.mask }} />mask: 합 1, 굵은 0은 이번 입력에서 제거</span>
            </div>
          </div>
        );
      }}
    />
  );
}

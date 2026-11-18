import SceneShell from "./SceneShell";
import { VarianceGrid, VarianceTotalBar } from "./VarianceGrid";

/**
 * 본문 대응: #source 첫 문단 — 평균상관 = (지수 분산 − Σ비중²×분산) / (종목 쌍의 비중·변동성 합).
 * 두 종목(가정): 지수 분산 0.03, 개별 기여 0.5²×0.2²×2 = 0.02, 분자 0.01.
 * 분모 = 2×0.5×0.5×0.2×0.2 = 0.02 (상관을 곱하기 전 교차항). 0.01 / 0.02 = 0.5.
 */
const DIAG = 0.5 * 0.5 * 0.2 * 0.2;
const INDEX_VARIANCE = 0.03;
const NUMERATOR = INDEX_VARIANCE - 2 * DIAG;
const DENOMINATOR = 2 * 0.5 * 0.5 * 0.2 * 0.2;

const SCENES = [
  {
    label: "지수 옵션에서 읽은 분산",
    summary: "17.32%² ≈ 0.03",
    step: 0,
    note: "거꾸로 풀 때는 출발점이 반대입니다. 지수 옵션의 변동성 17.32%를 제곱한 분산 0.03만 알고, 그 안에서 어느 칸이 얼마인지는 아직 모릅니다. 그래서 칸 네 개를 모두 비워 둡니다.",
  },
  {
    label: "개별 기여를 뺍니다",
    summary: "0.03 − 0.02 = 0.01",
    step: 1,
    note: "종목 옵션에서 읽은 20%로 대각선 칸을 채웁니다. 비중 제곱 × 분산 = 0.5²×0.2² = 0.01이 두 칸이라 0.02입니다. 지수 분산에서 이것을 빼면 엇갈린 두 칸의 몫 0.01이 남습니다. 이것이 식의 분자입니다.",
  },
  {
    label: "쌍의 비중·변동성 합으로 나눕니다",
    summary: "0.01 ÷ 0.02 = 0.5",
    step: 2,
    note: "분모는 종목 쌍의 비중·변동성 곱을 두 칸 몫으로 합친 2×0.5×0.5×0.2×0.2 = 0.02입니다. 엇갈린 칸에 상관을 곱하기 전의 크기라서, 남은 0.01을 이것으로 나누면 상관 0.5가 나옵니다. 칸 하나는 0.005로 3절과 같습니다.",
  },
] as const;

export default function ImpliedCorrelationBackoutViz() {
  return (
    <SceneShell
      eyebrow="평균상관 거꾸로 풀기"
      title="지수 분산에서 개별 칸을 빼면 상관이 남습니다"
      description="3절의 2×2 칸을 반대 방향으로 채웁니다. 칸 하나 = 비중 × 비중 × 변동성 × 변동성 × 상관입니다. 두 종목 숫자는 식의 방향만 확인하는 가정이며 공개 지수 수준을 재현하지 않습니다."
      ariaLabel="지수 분산 0.03에서 개별 기여 0.02를 빼 0.01을 얻고 분모 0.02로 나누어 평균상관 0.5를 구하는 과정"
      scenes={SCENES}
      render={(active) => {
        const step = SCENES[active].step;
        return (
          <div className="min-w-0 space-y-5">
            <VarianceGrid
              diag={step >= 1 ? DIAG : null}
              diagLabel={step >= 1 ? "0.5²×0.2²" : "아직 모름"}
              cross={step >= 2 ? (DENOMINATOR / 2) * (NUMERATOR / DENOMINATOR) : null}
              crossLabel={step >= 2 ? "0.5×0.5×0.2×0.2×0.5" : step === 1 ? "두 칸 합 0.01" : "아직 모름"}
            />
            <VarianceTotalBar
              segments={
                step === 0
                  ? [{ key: "all", label: "지수 분산 0.03", value: INDEX_VARIANCE, color: null }]
                  : [
                      { key: "diag", label: "대각 0.02", value: 2 * DIAG, color: "#64748b" },
                      { key: "rest", label: "남은 0.01", value: NUMERATOR, color: step >= 2 ? "#2563eb" : null },
                    ]
              }
            />
            <div className="grid grid-cols-3 items-center gap-2 text-center text-xs">
              <div className={`rounded-md border px-1 py-2 ${step >= 1 ? "border-border" : "border-dashed border-border/60 text-muted-foreground/60"}`}>
                <span className="block text-muted-foreground">분자</span>
                <span className="font-mono text-sm font-bold">{step >= 1 ? "0.01" : "−"}</span>
              </div>
              <div className={`rounded-md border px-1 py-2 ${step >= 2 ? "border-border" : "border-dashed border-border/60 text-muted-foreground/60"}`}>
                <span className="block text-muted-foreground">분모</span>
                <span className="font-mono text-sm font-bold">{step >= 2 ? DENOMINATOR.toFixed(2) : "−"}</span>
              </div>
              <div className={`rounded-md border px-1 py-2 ${step >= 2 ? "border-blue-600" : "border-dashed border-border/60 text-muted-foreground/60"}`}>
                <span className="block text-muted-foreground">평균상관</span>
                <span className="font-mono text-sm font-bold">{step >= 2 ? (NUMERATOR / DENOMINATOR).toFixed(1) : "−"}</span>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}

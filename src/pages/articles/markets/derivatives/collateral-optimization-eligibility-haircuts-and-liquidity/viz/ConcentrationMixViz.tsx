import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — B의 인정가치 한도 5 → B 시장가 5÷0.85≈5.88, 나머지 5는 A 5÷0.95≈5.26.
 * 비용(3절 가정 2%·0.5%)은 글의 숫자로 계산: 5.88×0.005=0.0294, 5.26×0.02=0.1052, 합 0.1346≈0.13.
 * 비교: A만 10.53×0.02≈0.21, B만 11.764×0.005≈0.06(한도 때문에 불가).
 */
const NEED = 10;
const LIMIT_B = 5;

const COSTS = [
  { key: "A", label: "A만", value: 0.21, detail: "10.53 × 2%", blocked: false },
  { key: "B", label: "B만", value: 0.06, detail: "한도 초과라 불가", blocked: true },
  { key: "mix", label: "B 5 + A 5", value: 0.13, detail: "5.88×0.5% + 5.26×2%", blocked: false },
] as const;
const COST_SCALE = 0.25;

const SCENES = [
  { label: "B만으로 채우려 하면", summary: "B 인정가치 10 > 한도 5", step: 0, note: "비용만 보면 B가 가장 싸지만, B로 인정받을 수 있는 가치가 5까지라면 10 가운데 절반은 한도를 넘습니다. 적격성 제약이 이 답을 계산에서 뺍니다." },
  { label: "B를 한도 5까지", summary: "B 시장가 5 ÷ 0.85 ≈ 5.88", step: 1, note: "B는 한도까지만 씁니다. 인정가치 5를 남기려면 15% 할인을 감안해 시장가 약 5.88을 냅니다." },
  { label: "나머지 5를 A로", summary: "A 시장가 5 ÷ 0.95 ≈ 5.26", step: 2, note: "남은 인정가치 5는 A로 채웁니다. 시장가 약 5.26이면 됩니다. 두 자산을 합쳐 인정가치 10이 됩니다." },
  { label: "연 비용을 비교하면", summary: "혼합 ≈ 0.13 (글의 숫자로 계산)", step: 3, note: "3절 가정으로 계산하면 혼합은 0.029 + 0.105 ≈ 0.13입니다(본문에 없는 계산값). A만 쓰는 0.21보다 싸고, 한도 때문에 불가능한 B만의 0.06보다는 비쌉니다." },
] as const;

const pct = (value: number) => `${(value / NEED) * 100}%`;

export default function ConcentrationMixViz() {
  return (
    <SceneShell
      eyebrow="집중한도와 혼합 배정"
      title="B의 한도 5가 최저비용 답을 B와 A의 혼합으로 바꿉니다"
      description="위 막대는 채워야 할 인정가치 10이고, 주황 점선이 B의 집중 한도 5입니다. 할인율과 기회비용은 3절의 가정을 그대로 씁니다."
      ariaLabel="B의 인정가치 한도 5 때문에 B 5와 A 5로 인정가치 10을 채우는 배정과 연 비용 비교"
      scenes={SCENES}
      render={(active) => {
        const step = SCENES[active].step;
        const over = step === 0;
        return (
          <div className="min-w-0 space-y-4">
            <div>
              <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                <span>인정가치 0</span>
                <span>10</span>
              </div>
              <div className="relative flex h-9 w-full overflow-hidden rounded-md border border-border bg-muted/30">
                <div className="flex h-full items-center justify-center text-[11px] font-semibold" style={{ width: step >= 1 || over ? pct(LIMIT_B) : "0%", backgroundColor: "#0d9488", color: "#ffffff" }}>
                  B 5
                </div>
                {over ? (
                  <div className="flex h-full items-center justify-center border-l border-dashed text-[11px] font-bold" style={{ width: pct(NEED - LIMIT_B), borderColor: "#dc2626", color: "#b91c1c", backgroundColor: "#fee2e2" }}>
                    B 5 · 한도 초과
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center text-[11px] font-semibold" style={{ width: step >= 2 ? pct(NEED - LIMIT_B) : "0%", backgroundColor: "#2563eb", color: "#ffffff" }}>
                    A 5
                  </div>
                )}
                <div className="absolute top-0 h-full border-l-2 border-dashed" style={{ left: pct(LIMIT_B), borderColor: "#d97706" }} />
              </div>
              <p className="mt-1 text-[11px]" style={{ color: "#b45309" }}>점선 = B 집중 한도(인정가치 5)</p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
              <div className={`rounded-md border px-2 py-1.5 ${step >= 1 ? "border-border" : "border-dashed border-border/40 text-muted-foreground/50"}`}>
                <span className="block font-semibold">B 시장가</span>
                <span className="font-mono">{step >= 1 ? "5 ÷ 0.85 ≈ 5.88" : "·"}</span>
              </div>
              <div className={`rounded-md border px-2 py-1.5 ${step >= 2 ? "border-border" : "border-dashed border-border/40 text-muted-foreground/50"}`}>
                <span className="block font-semibold">A 시장가</span>
                <span className="font-mono">{step >= 2 ? "5 ÷ 0.95 ≈ 5.26" : "·"}</span>
              </div>
            </div>
            <div className={`space-y-1.5 ${step >= 3 ? "" : "invisible"}`}>
              {COSTS.map((cost) => (
                <div key={cost.key} className="grid grid-cols-[6.5rem_minmax(0,1fr)_2.5rem] items-center gap-2 text-xs">
                  <span className={`leading-4 ${cost.key === "mix" ? "font-bold" : "text-muted-foreground"}`}>
                    {cost.label}
                    <span className="block text-[10px] font-normal text-muted-foreground">{cost.detail}</span>
                  </span>
                  <div className="relative h-4 min-w-0 rounded-sm bg-muted/40">
                    <div
                      className={`h-full rounded-sm ${cost.blocked ? "border border-dashed" : ""}`}
                      style={{ width: `${(cost.value / COST_SCALE) * 100}%`, backgroundColor: cost.blocked ? "transparent" : "#d97706", borderColor: "#dc2626" }}
                    />
                  </div>
                  <span className={`text-right font-mono ${cost.key === "mix" ? "font-bold" : ""}`}>{cost.value.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}

import SceneShell from "./SceneShell";

/**
 * 본문 대응: #comparison — 의무율 70%(가정) → 의무량 70kg, 회수 60kg → 10kg 부족,
 * 재활용 비용 12만원 ÷ 60kg = 2,000원/kg(가정) → 2만원, 30% 이하 가산 → 2만~2만 6,000원.
 */
const SCENES = [
  {
    label: "의무량",
    summary: "100kg × 70% = 70kg",
    step: 0,
    note: "재활용의무율은 연간 출고량 중 재활용해야 하는 비율입니다. 100kg이 모두 대상 포장재이고 의무율이 70%라고 놓으면(가정) 70kg입니다.",
  },
  {
    label: "모자란 양",
    summary: "70 − 60 = 10kg",
    step: 1,
    note: "실제로 회수한 60kg만 인정되면 의무량까지 10kg이 모자랍니다.",
  },
  {
    label: "모자란 양의 비용",
    summary: "10kg × 2,000원 = 2만원",
    step: 2,
    note: "재활용부과금은 의무를 다하지 못하면 내는 돈으로, 재활용되지 않은 양의 비용에서 출발합니다. 12만원÷60kg=2,000원을 kg당 비용으로 쓰면(가정) 2만원입니다.",
  },
  {
    label: "30% 이하 가산",
    summary: "2만 ~ 2만 6,000원",
    step: 3,
    note: "제19조는 그 비용에 30% 이하를 더합니다. 그래서 한 값이 아니라 범위입니다. 실제 의무율과 kg당 비용은 고시와 시행령의 산정 기준으로 확인합니다.",
  },
] as const;

const KG_MAX = 100;
const WON_MAX = 30000;

export default function RecyclingObligationViz() {
  return (
    <SceneShell
      eyebrow="한국 제도의 계산 순서"
      title="의무율에서 부과금까지 네 걸음으로 따라갑니다"
      description="한국 「자원의 절약과 재활용촉진에 관한 법률」(2026-08-20 시행본, 2026-10-09 확인)에 100kg 사례를 넣었습니다. 의무율 70%와 kg당 2,000원은 가정입니다."
      ariaLabel="재활용의무량 70킬로그램, 회수 60킬로그램, 부족 10킬로그램, 부과금 범위 2만원에서 2만 6천원"
      scenes={SCENES}
      render={(active) => {
        const { step } = SCENES[active];
        return (
          <div className="min-w-0 text-sm">
            <p className="text-xs font-bold">양 (kg, 전체 칸 = 사례의 100kg)</p>
            <div className="relative mt-1.5 h-9 rounded-sm border border-border" role="img" aria-label={step === 0 ? "의무량 70킬로그램" : "회수 60킬로그램, 의무량까지 10킬로그램 부족"}>
              {step >= 1 && (
                <div className="absolute inset-y-0 left-0 flex items-center justify-center bg-[#2563eb] font-mono text-xs font-bold text-white" style={{ width: `${(60 / KG_MAX) * 100}%` }}>
                  회수 60
                </div>
              )}
              {step >= 1 && (
                <div className="absolute inset-y-0 flex items-center justify-center border-y border-dashed border-[#b91c1c] font-mono text-xs font-bold text-[#b91c1c] dark:text-[#fca5a5]" style={{ left: `${(60 / KG_MAX) * 100}%`, width: `${(10 / KG_MAX) * 100}%` }}>
                  10
                </div>
              )}
              <div className="absolute -inset-y-1 border-l-[1.25px] border-[#0f172a] dark:border-[#e2e8f0]" style={{ left: `${(70 / KG_MAX) * 100}%` }} />
            </div>
            <div className="relative mt-1.5 h-5 font-mono text-xs">
              <span className="absolute left-0 text-muted-foreground">0</span>
              <span className="absolute -translate-x-1/2 font-bold" style={{ left: `${(70 / KG_MAX) * 100}%` }}>의무량 70</span>
              <span className="absolute right-0 text-muted-foreground">100</span>
            </div>

            <p className="mt-3 text-xs font-bold">돈 (원, 전체 칸 = 3만원)</p>
            <div className="relative mt-1.5 h-9 rounded-sm border border-border" role="img" aria-label={step < 2 ? "아직 금액을 놓지 않았습니다" : step === 2 ? "모자란 10킬로그램의 비용 2만원" : "2만원에 30퍼센트 이하를 더한 범위, 최대 2만 6천원"}>
              {step >= 2 && (
                <div className="absolute inset-y-0 left-0 flex items-center justify-center bg-[#475569] font-mono text-xs font-bold text-white" style={{ width: `${(20000 / WON_MAX) * 100}%` }}>
                  2만
                </div>
              )}
              {step >= 3 && (
                <div className="absolute inset-y-0 flex items-center justify-center border-y border-r border-dashed border-[#b45309] font-mono text-xs font-bold text-[#b45309] dark:text-[#fcd34d]" style={{ left: `${(20000 / WON_MAX) * 100}%`, width: `${(6000 / WON_MAX) * 100}%` }}>
                  ≤0.6만
                </div>
              )}
            </div>
            <div className="relative mt-1.5 h-5 font-mono text-xs text-muted-foreground">
              <span className="absolute left-0">0</span>
              <span className="absolute right-0">3만</span>
            </div>
          </div>
        );
      }}
    />
  );
}

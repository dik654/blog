import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — 처리비 4+6+2=12만원, 판매수입 60kg×1000원=6만원 → 부족 6만원.
 * (가정) kg당 800원이면 60kg×800원=4만 8000원 → 부족 7만 2000원.
 * 두 막대는 같은 0–12만원 축이다.
 */
const COST = [
  { name: "수거", value: 4, color: "#64748b" },
  { name: "선별·재처리", value: 6, color: "#475569" },
  { name: "잔여물 처리", value: 2, color: "#94a3b8" },
] as const;
const TOTAL = 12;

const SCENES = [
  {
    label: "먼저 드는 돈",
    summary: "4 + 6 + 2 = 12만원",
    revenue: null,
    price: "−",
    revenueText: "−",
    gapText: "−",
    note: "수거 4만원, 선별·재처리 6만원, 잔여물 처리 2만원을 이어 붙이면 12만원입니다. 특정 국가나 재료의 실제 단가가 아닙니다.",
  },
  {
    label: "kg당 1000원에 팔면",
    summary: "12 − 6 = 6만원 부족",
    revenue: 6,
    price: "1000원",
    revenueText: "6만원",
    gapText: "6만원",
    note: "60kg을 kg당 1000원에 팔면 6만원입니다. 나머지 6만원을 요금·생산자 부담·세금 등 누가 채울지 정하지 않으면 운영이 계속되기 어렵습니다.",
  },
  {
    label: "(가정) kg당 800원으로 내리면",
    summary: "12 − 4.8 = 7.2만원 부족",
    revenue: 4.8,
    price: "800원",
    revenueText: "4만 8000원",
    gapText: "7만 2000원",
    note: "회수량은 그대로 60kg인데 가격만 바뀌어 수입이 4만 8000원, 부족액이 7만 2000원이 됩니다. 물질이 같아도 재무 결과는 바뀝니다.",
  },
] as const;

const pct = (value: number) => `${(value / TOTAL) * 100}%`;

export default function FundingGapViz() {
  return (
    <SceneShell
      eyebrow="처리비와 판매수입"
      title="같은 60kg을 회수해도 부족한 돈은 가격에 따라 달라집니다"
      description="두 막대의 전체 길이가 처리비 12만원입니다. 금액은 모두 설명용 가정입니다."
      ariaLabel="처리비 12만원과 판매수입, 부족액의 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 text-sm">
            <p className="text-xs font-bold">처리비(만원): 수거 · 선별·재처리 · 잔여물 처리</p>
            <div className="mt-1.5 flex h-9 w-full overflow-hidden rounded-sm" role="img" aria-label="수거 4만원, 선별·재처리 6만원, 잔여물 처리 2만원">
              {COST.map((part, index) => (
                <div
                  key={part.name}
                  className={`flex items-center justify-center font-mono text-xs font-bold text-white ${index > 0 ? "border-l border-background" : ""}`}
                  style={{ width: pct(part.value), backgroundColor: part.color }}
                >
                  {part.value}
                </div>
              ))}
            </div>

            <p className="mt-4 text-xs font-bold">메우는 돈(만원): 판매수입 · 재원 없는 부족액</p>
            <div className="mt-1.5 flex h-9 w-full overflow-hidden rounded-sm border border-border" role="img" aria-label={scene.revenue === null ? "판매수입을 아직 놓지 않았습니다" : `판매수입 ${scene.revenueText}, 부족 ${scene.gapText}`}>
              {scene.revenue !== null && (
                <>
                  <div className="flex items-center justify-center font-mono text-xs font-bold text-white transition-[width] duration-300 motion-reduce:transition-none" style={{ width: pct(scene.revenue), backgroundColor: "#15803d" }}>
                    {scene.revenue}
                  </div>
                  <div className="flex min-w-0 flex-1 items-center justify-center border-l border-dashed border-[#b91c1c] font-mono text-xs font-bold text-[#b91c1c] dark:text-[#fca5a5]">
                    {TOTAL - scene.revenue}
                  </div>
                </>
              )}
            </div>

            <dl className="mt-4 grid grid-cols-3 gap-x-3 font-mono text-xs">
              <div>
                <dt className="text-muted-foreground">kg당 가격</dt>
                <dd className="mt-0.5 font-bold">{scene.price}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">판매수입</dt>
                <dd className="mt-0.5 font-bold text-[#15803d] dark:text-[#86efac]">{scene.revenueText}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">부족액</dt>
                <dd className="mt-0.5 font-bold text-[#b91c1c] dark:text-[#fca5a5]">{scene.gapText}</dd>
              </div>
            </dl>
          </div>
        );
      }}
    />
  );
}

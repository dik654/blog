import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 고객 결제에서 인건비·월세·세금 전 중간 결과까지.
 * 160,000 − 3,200 = 156,800, − 40,000 = 116,800, − 2,000 = 114,800. 막대 전체 폭 = 160,000원.
 * 인건비·월세·세금은 이 절에 금액이 없으므로 막대를 그리지 않습니다.
 */
const TOTAL = 160_000;

const ROWS = [
  { name: "고객 결제", from: 0, to: 160_000, value: "160,000원", color: "#64748b" },
  { name: "수수료 2%", from: 156_800, to: 160_000, value: "− 3,200원", color: "#d97706" },
  { name: "판매 재료 20개", from: 116_800, to: 156_800, value: "− 40,000원", color: "#d97706" },
  { name: "폐기 재료 1개", from: 114_800, to: 116_800, value: "− 2,000원", color: "#dc2626" },
  { name: "중간 결과", from: 0, to: 114_800, value: "114,800원", color: "#2563eb" },
] as const;

const SCENES = [
  { label: "고객 결제", summary: "20건 × 8,000원 = 160,000원", shown: 1, note: "하루 20건을 건당 8천 원에 전부 카드로 판매했다는 가정의 판매 금액입니다." },
  { label: "수수료", summary: "160,000 − 3,200 = 156,800원", shown: 2, note: "결제업체가 2%를 떼면 받을 돈은 15만6천800원입니다. 2%와 이틀 뒤 입금은 모두 설명용 가정입니다." },
  { label: "팔린 재료", summary: "156,800 − 40,000 = 116,800원", shown: 3, note: "받은 재료 전부가 아니라 팔린 20개 분량만 뺍니다. 20개 × 2천 원 = 4만 원입니다." },
  { label: "버린 재료", summary: "116,800 − 2,000 = 114,800원", shown: 5, note: "폐기 1개 × 2천 원을 따로 뺀 값이 중간 결과입니다. 판매 재료와 합치지 않고 줄을 나눴습니다." },
  { label: "아직 끝이 아닙니다", summary: "오늘 통장 입금 0원", shown: 5, note: "아직 입금 전이므로 11만4천800원이 오늘 통장에 생긴 돈은 아닙니다. 인건비·월세·세금도 남아 있고, 이 세 항목은 금액이 정해지지 않아 막대로 그리지 않았습니다." },
] as const;

export default function MoneyWaterfallViz() {
  return (
    <SceneShell
      eyebrow="돈의 계산"
      title="16만 원이 11만4천800원이 되기까지"
      description="모든 막대의 축척이 같고 전체 폭이 16만 원입니다. 주황·빨강 막대는 위 줄의 남은 금액 오른쪽 끝에서 깎인 몫입니다. 모든 숫자는 3절의 가정이며 세금 계산과 환불·보류·추가 조정은 생략합니다."
      ariaLabel="고객 결제 16만 원에서 수수료와 재료비, 폐기를 차례로 빼 중간 결과 11만4천800원이 되는 계산"
      scenes={SCENES}
      render={(scene) => {
        const item = SCENES[scene];
        return (
          <div>
            <div className="space-y-2">
              {ROWS.map((row, index) => {
                const on = index < item.shown;
                return (
                  <div key={row.name} className="text-xs sm:text-sm">
                    <div className="flex items-baseline justify-between gap-2 leading-5">
                      <span className={index === ROWS.length - 1 ? "font-bold" : "text-muted-foreground"}>{row.name}</span>
                      <span className={`font-mono ${index === ROWS.length - 1 ? "font-bold" : ""} ${on ? "" : "invisible"}`}>{row.value}</span>
                    </div>
                    <div className="relative mt-0.5 h-4 min-w-0 rounded-sm bg-muted/40">
                      <div
                        className={`absolute inset-y-0 rounded-sm ${on ? "" : "invisible"}`}
                        style={{ left: `${(row.from / TOTAL) * 100}%`, width: `${((row.to - row.from) / TOTAL) * 100}%`, backgroundColor: row.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className={`mt-4 grid gap-2 sm:grid-cols-2 ${scene === 4 ? "" : "invisible"}`}>
              <div className="rounded-lg border border-border p-2.5 text-xs leading-5 sm:text-sm">
                <p className="font-bold">오늘 통장</p>
                <p className="text-muted-foreground">입금 0원 · 이틀 뒤 확인</p>
              </div>
              <div className="rounded-lg border border-dashed border-amber-600 p-2.5 text-xs leading-5 sm:text-sm">
                <p className="font-bold">아직 빼지 않은 것</p>
                <p className="text-muted-foreground">인건비 · 월세 · 세금</p>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}

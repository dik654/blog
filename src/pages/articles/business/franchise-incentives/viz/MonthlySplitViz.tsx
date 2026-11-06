import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 월매출 3천만 원(가정)을 본부 150, 재료 1,000, 월세 300으로 나누면 1,550이 남는다.
 * 막대 전체 길이 = 3,000만 원. 3,000 × 5% = 150, 3,000 − 150 − 1,000 − 300 = 1,550.
 */
const TOTAL = 3000;
const REST_BEFORE = "#cbd5e1"; // 아직 나누지 않은 매출

const ITEMS = [
  { label: "본부 지급액", value: 150, color: "#2563eb", from: 1, memo: "매출의 5%" },
  { label: "재료", value: 1000, color: "#64748b", from: 2, memo: "그달에 모두 사용" },
  { label: "월세", value: 300, color: "#d97706", from: 2, memo: "" },
  { label: "남은 돈", value: 1550, color: "#16a34a", from: 3, memo: "다른 운영비를 내기 전" },
] as const;

const SCENES = [
  { label: "점포에 들어온 돈", summary: "월매출 3,000만 원", note: "막대 전체가 고객이 낸 3천만 원입니다. 금액은 부가세를 뺀 같은 기준이고, 판매대금 수령도 그달에 끝난다고 놓았습니다." },
  { label: "본부 몫을 표시합니다", summary: "3,000 × 5% = 150만 원", note: "매출 연동 약정은 점주의 최종 이익과 별도로 받을 금액을 정합니다. 그래서 150만 원은 이익이 아니라 매출에서 계산합니다." },
  { label: "재료와 월세를 표시합니다", summary: "150 + 1,000 + 300 = 1,450만 원", note: "막대의 왼쪽부터 나눈 순서는 계산 순서일 뿐입니다. 본부에 다른 비용보다 먼저 송금한다는 뜻이 아니며, 실제 지급일과 연체 조건은 계약에서 확인합니다." },
  { label: "남은 돈은 아직 이익이 아닙니다", summary: "3,000 − 1,450 = 1,550만 원", note: "임금·광고·공과금·세금은 금액을 가정하지 않아 막대에 넣지 않았습니다. 이 돈들을 1,550만 원에서 더 내야 합니다." },
] as const;

export default function MonthlySplitViz() {
  return (
    <SceneShell
      eyebrow="한 달 계산"
      title="월매출 3천만 원을 한 막대에서 나눕니다"
      description="막대 길이는 금액에 비례합니다. 옅은 칸은 아직 나누지 않은 매출입니다. 모든 값은 이 글의 가정이고 단위는 만 원입니다."
      ariaLabel="월매출 3천만 원을 본부 지급액, 재료, 월세, 남은 돈으로 나눈 막대"
      scenes={SCENES}
      render={(active) => {
        const shown = ITEMS.filter((item) => item.from <= active);
        const used = shown.reduce((sum, item) => sum + item.value, 0);
        return (
          <div className="min-w-0">
            <div className="flex h-9 overflow-hidden rounded-md border border-border" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
              {shown.map((item) => (
                <div key={item.label} className="h-full border-r border-background last:border-r-0" style={{ width: `${(item.value / TOTAL) * 100}%`, backgroundColor: item.color }} />
              ))}
              {used < TOTAL && <div className="h-full" style={{ width: `${((TOTAL - used) / TOTAL) * 100}%`, backgroundColor: REST_BEFORE }} />}
            </div>
            <div className="mt-4 space-y-2">
              {ITEMS.map((item) => {
                const on = item.from <= active;
                return (
                  <div key={item.label} className={`grid grid-cols-[0.75rem_minmax(0,1fr)_auto] items-center gap-2 text-sm ${on ? "" : "opacity-30"}`}>
                    <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: on ? item.color : REST_BEFORE }} />
                    <span className="min-w-0">
                      <span className="font-semibold">{item.label}</span>
                      {item.memo && <span className="ml-2 text-xs text-muted-foreground">{item.memo}</span>}
                    </span>
                    <span className="font-mono font-semibold">{on ? item.value.toLocaleString("en-US") : "−"}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }}
    />
  );
}

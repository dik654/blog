import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 가정한 100가구를 25+35+25+15로 나눈 장부와, 한 가구가 여러 칸에 겹치는 예.
 * 작은 네모 하나가 한 가구이고 "칸"은 본문처럼 네 종류를 뜻합니다. 겹치는 가구 수는 본문에 없으므로 강조한 네모 하나는 예시일 뿐 개수가 아닙니다.
 */
const GROUPS = [
  { key: "동", name: "직접 동원", count: 25, detail: "징집·군수 공장", color: "#2563eb" },
  { key: "생", name: "할당 생산", count: 35, detail: "식량·연료·운송", color: "#16a34a" },
  { key: "돌", name: "돌봄·필수 서비스", count: 25, detail: "가족·의료·생활 유지", color: "#d97706" },
  { key: "피", name: "피란·상실", count: 15, detail: "추방·사망·생계 붕괴", color: "#dc2626" },
] as const;

const CELLS = GROUPS.flatMap((group, groupIndex) => Array.from({ length: group.count }, () => groupIndex));

const SCENES = [
  { label: "100가구 전체", summary: "네모 100개 (가정)", note: "작은 네모 하나가 한 가구입니다. 실제 나라의 통계가 아니라 배분 구조를 보기 위한 가정입니다." },
  { label: "직접 동원", summary: "25가구", note: "징집되거나 군수 공장에 직접 묶인 가구입니다. 전선의 병사만 세면 이 칸의 일부만 보입니다." },
  { label: "할당 생산", summary: "25 + 35 = 60가구", note: "식량·연료·운송의 할당을 받으며 생산을 계속하는 가구입니다." },
  { label: "돌봄·필수 서비스", summary: "60 + 25 = 85가구", note: "돌봄과 필수 서비스를 떠맡은 가구입니다. 군복을 입지 않아도 장부에 들어갑니다." },
  { label: "피란·상실", summary: "85 + 15 = 100가구", note: "피란·추방·사망이나 생계 붕괴를 겪는 가구입니다. 네 수를 더하면 100이 됩니다." },
  { label: "한 가구가 여러 칸에", summary: "합 100은 분류가 아닙니다", note: "한 칸에 적힌 가구도 군수 공장에서 일하면서 배급을 받고 가족을 돌볼 수 있습니다. 겹치는 가구 수는 정하지 않았고, 강조한 네모는 예 하나입니다." },
] as const;

const EXAMPLE_CELL = 7;

export default function HouseholdLedgerViz() {
  return (
    <SceneShell
      eyebrow="100가구 장부"
      title="네 칸의 합은 100이지만 한 가구는 여러 칸에 겹칠 수 있습니다"
      description="작은 네모 하나가 한 가구이고, 글자는 네 칸 중 어디에 적혔는지입니다. 동 = 직접 동원, 생 = 할당 생산, 돌 = 돌봄·필수 서비스, 피 = 피란·상실. 모든 수는 배분 구조를 보기 위한 가정입니다."
      ariaLabel="가정한 100가구를 네 종류로 나누고 한 가구의 겹침을 보여 주는 칸 그림"
      scenes={SCENES}
      render={(active) => {
        const overlap = active === 5;
        const filled = overlap ? GROUPS.length : active;
        return (
          <div className="grid min-w-0 grid-cols-[minmax(0,9.75rem)_minmax(0,1fr)] gap-3 sm:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] sm:gap-6">
            <div className="grid grid-cols-10 content-start gap-0.5 sm:gap-1" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
              {CELLS.map((groupIndex, cell) => {
                const on = groupIndex < filled;
                const example = overlap && cell === EXAMPLE_CELL;
                return (
                  <span
                    key={cell}
                    className="flex aspect-square items-center justify-center border text-[9px] font-bold sm:text-[11px] leading-none"
                    style={{
                      borderColor: example ? "#0f172a" : on ? GROUPS[groupIndex].color : "#94a3b8",
                      borderWidth: 1,
                      borderRadius: 2,
                      backgroundColor: example ? "#fde68a" : on ? `${GROUPS[groupIndex].color}${overlap ? "14" : "24"}` : "transparent",
                      color: example ? "#0f172a" : on ? GROUPS[groupIndex].color : "transparent",
                    }}
                  >
                    {GROUPS[groupIndex].key}
                  </span>
                );
              })}
            </div>
            {overlap ? (
              <div className="min-w-0 text-sm">
                <p className="font-semibold">강조한 가구의 예</p>
                <ul className="mt-2 space-y-2">
                  {["군수 공장 노동", "배급 받음", "가족 돌봄"].map((item) => (
                    <li key={item} className="rounded-lg border border-border bg-background px-2 py-1.5 text-xs leading-5 sm:px-3 sm:py-2 sm:text-sm">{item}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <ul className="min-w-0 space-y-1.5 text-xs sm:space-y-2 sm:text-sm">
                {GROUPS.map((group, index) => {
                  const on = index < filled;
                  return (
                    <li key={group.key} className={`flex items-baseline justify-between gap-2 rounded-lg border px-2 py-1 leading-5 sm:gap-3 sm:px-3 sm:py-1.5 ${on ? "border-border bg-background" : "border-dashed border-border/60 text-muted-foreground/70"}`}>
                      <span className="min-w-0 leading-4"><b style={on ? { color: group.color } : undefined}>{group.key}</b> {group.name}<span className="hidden text-xs text-muted-foreground sm:block">{group.detail}</span></span>
                      <span className="shrink-0 font-mono font-bold">{group.count}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      }}
    />
  );
}

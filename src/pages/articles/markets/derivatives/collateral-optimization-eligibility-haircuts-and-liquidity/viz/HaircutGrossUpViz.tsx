import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 인정가치 10을 채우려면 시장가 = 10 ÷ (1 − 할인율).
 * A 5% → 10.526… ≈ 10.53, B 15% → 11.764… (글의 "약 11.77"은 반올림 오류라 11.764…로 표시).
 * 연 기회비용 A 2%, B 0.5%(가정) → 10.53×0.02 ≈ 0.21, 11.764×0.005 ≈ 0.06.
 */
const SCALE = 12;
const COST_SCALE = 0.25;

const ASSETS = [
  { key: "A", name: "채권 A", haircut: "5%", market: 10.53, rate: "2%", cost: 0.21, formula: "10 ÷ 0.95 ≈ 10.53" },
  { key: "B", name: "채권 B", haircut: "15%", market: 11.764, rate: "0.5%", cost: 0.06, formula: "10 ÷ 0.85 = 11.764…" },
] as const;

const SCENES = [
  { label: "A는 5%를 깎습니다", summary: "10 ÷ 0.95 ≈ 10.53", rows: 1, cost: false, note: "할인율은 담보로 인정할 때 시장가에서 깎는 비율입니다. 깎이고도 10이 남아야 하므로 10을 0.95로 나눕니다." },
  { label: "B는 15%를 깎습니다", summary: "10 ÷ 0.85 = 11.764…", rows: 2, cost: false, note: "많이 깎이는 B는 시장가 11.764…를 내야 같은 10이 됩니다. 회색 칸이 깎여 인정받지 못하는 몫입니다." },
  { label: "그래도 B가 쌀 수 있습니다", summary: "연 비용 A ≈ 0.21 · B ≈ 0.06", rows: 2, cost: true, note: "연 기회비용(다른 곳에 쓰지 못해 잃는 값)을 A 2%, B 0.5%로 놓으면 단순 연 비용은 약 0.21과 0.06입니다. B의 집중 한도가 남아 있다면 시장가를 더 내는 B가 오히려 쌉니다." },
] as const;

export default function HaircutGrossUpViz() {
  return (
    <SceneShell
      eyebrow="할인율과 필요 시장가"
      title="인정가치 10을 채우려면 시장가를 얼마나 내야 하나"
      description="파란 칸은 담보로 인정받는 10, 회색 칸은 할인으로 깎이는 몫입니다. 할인율 5%·15%와 기회비용 2%·0.5%는 글이 계산 순서를 보이려고 둔 가정입니다."
      ariaLabel="할인율 5퍼센트 채권 A와 15퍼센트 채권 B가 인정가치 10을 채우는 데 필요한 시장가와 연 기회비용 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-4">
            {ASSETS.map((asset, index) => {
              const on = index < scene.rows;
              return (
                <div key={asset.key} className="min-w-0">
                  <div className="mb-1 flex flex-wrap items-baseline justify-between gap-x-2 text-xs sm:text-sm">
                    <span className={on ? "font-bold" : "text-muted-foreground/50"}>{asset.name} · 할인 {asset.haircut}</span>
                    <span className={`font-mono ${on ? "" : "text-muted-foreground/40"}`}>{on ? `시장가 ${asset.formula}` : "·"}</span>
                  </div>
                  <div className="flex h-8 w-full overflow-hidden rounded-md bg-muted/40">
                    {on ? (
                      <>
                        <div className="flex h-full items-center justify-center text-[11px] font-semibold" style={{ width: `${(10 / SCALE) * 100}%`, backgroundColor: "#2563eb", color: "#ffffff" }}>인정가치 10</div>
                        <div className="h-full" style={{ width: `${((asset.market - 10) / SCALE) * 100}%`, backgroundColor: "#cbd5e1" }} />
                      </>
                    ) : null}
                  </div>
                  <div className={`mt-1 grid grid-cols-[7.5rem_minmax(0,1fr)_2.5rem] items-center gap-2 text-xs ${scene.cost && on ? "" : "invisible"}`}>
                    <span className="text-muted-foreground">연 비용 ({asset.rate})</span>
                    <div className="h-3 min-w-0 rounded-sm bg-muted/40">
                      <div className="h-full rounded-sm" style={{ width: `${(asset.cost / COST_SCALE) * 100}%`, backgroundColor: "#d97706" }} />
                    </div>
                    <span className="text-right font-mono font-bold">{asset.cost.toFixed(2)}</span>
                  </div>
                </div>
              );
            })}
            <p className="text-[11px] text-muted-foreground">막대 전체 폭 = 시장가 12, 주황 막대 전체 폭 = 연 비용 0.25</p>
          </div>
        );
      }}
    />
  );
}

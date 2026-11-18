import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 판매가 100의 여섯 몫과 운송·보험 8→16 충격.
 * 35+8+15+12+20+10 = 100, 운송만 16이면 35+16+15+12+20+10 = 108.
 * 판매가 100 유지 → 누군가 8을 줄이거나 떠안음(누구인지는 글에 없음). 판매가 108 → 소비자 부담, 수요가 줄 수 있음.
 * 막대 축은 0~112, 길이는 금액에 비례한다.
 */
const SHARES = [
  { key: "parts", name: "해외 부품", base: 35, color: "#2563eb" },
  { key: "freight", name: "운송·보험", base: 8, color: "#d97706" },
  { key: "assembly", name: "조립", base: 15, color: "#7c3aed" },
  { key: "platform", name: "플랫폼·결제", base: 12, color: "#0f766e" },
  { key: "seller", name: "판매자 운영비·이익", base: 20, color: "#64748b" },
  { key: "reserve", name: "수리·회수·기후 위험 대비", base: 10, color: "#16a34a" },
] as const;

const AXIS = 112;
const SHOCK_FREIGHT = 16;

const SCENES = [
  { label: "기준 장부", summary: "35+8+15+12+20+10 = 100", freight: 8, price: 100, note: "판매가 100이 여섯 몫으로 나뉩니다. 여러 나라와 기업이 한 가격 안에서 서로 다른 몫을 가집니다. 숫자는 실제 상품 통계가 아니라 설명용 가정입니다." },
  { label: "운송·보험이 16이 됩니다", summary: "총비용 108 · 가격 100", freight: SHOCK_FREIGHT, price: 100, note: "항로 우회와 보험료 상승으로 운송·보험만 8에서 16이 되고 다른 몫은 그대로 둡니다. 비용 막대가 판매가 100 선을 8만큼 넘습니다." },
  { label: "판매가를 100으로 지키면", summary: "누군가 8을 줄이거나 떠안음", freight: SHOCK_FREIGHT, price: 100, note: "누군가의 몫을 8 줄이거나 그만큼 손실을 떠안아야 합니다. 글은 그게 누구인지 정하지 않습니다. 점선 칸은 넘친 자리일 뿐, 그 밑의 초록 몫을 줄인다는 뜻이 아닙니다." },
  { label: "판매가를 108로 올리면", summary: "소비자가 8을 더 냄", freight: SHOCK_FREIGHT, price: 108, note: "소비자가 8을 부담합니다. 다만 수요가 줄 수 있습니다. 얼마나 줄지는 글에 수치가 없어 그리지 않았습니다." },
] as const;

const pct = (value: number) => `${(value / AXIS) * 100}%`;

export default function PriceShockViz() {
  return (
    <SceneShell
      eyebrow="판매가 100의 장부"
      title="운송비 8이 16이 되면 막대가 가격선을 넘습니다"
      description="막대 길이는 금액에 비례하고 세로 점선이 판매가입니다. 3절의 설명용 가정 숫자를 그대로 썼습니다."
      ariaLabel="판매가 100의 여섯 몫, 운송·보험 8에서 16 충격, 가격 유지와 인상 두 갈래"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const values = SHARES.map((share) => (share.key === "freight" ? scene.freight : share.base));
        const total = values.reduce<number>((sum, value) => sum + value, 0);
        const over = total - scene.price;
        const starts = values.map((_, index) => values.slice(0, index).reduce<number>((sum, value) => sum + value, 0));
        return (
          <div className="min-w-0 space-y-4">
            <div className="grid grid-cols-[3.5rem_minmax(0,1fr)] items-center gap-2 text-xs">
              <span className="font-semibold">비용</span>
              <div className="relative h-9 min-w-0">
                {SHARES.map((share, index) => (
                  <div
                    key={share.key}
                    className="absolute top-0 flex h-full items-center justify-center border-r border-background font-mono text-[11px] font-bold text-white"
                    style={{ left: pct(starts[index]), width: pct(values[index]), backgroundColor: share.color }}
                  >
                    {values[index]}
                  </div>
                ))}
                {over > 0 && active === 2 && (
                  <div className="absolute top-0 h-full rounded-sm border border-dashed border-[#dc2626]" style={{ left: pct(scene.price), width: pct(over) }} />
                )}
                <div className="absolute -top-1 h-11 border-l border-dashed border-[#0f172a] dark:border-[#e2e8f0]" style={{ left: pct(scene.price) }} />
              </div>
              <span className="font-semibold">판매가</span>
              <div className="relative h-5 min-w-0">
                <div className="absolute left-0 top-0 h-full rounded-sm bg-[#94a3b8]/40" style={{ width: pct(scene.price) }} />
                <span className="absolute top-0 flex h-full items-center pl-2 font-mono text-[11px] font-bold">{scene.price}</span>
              </div>
            </div>

            <div className="grid grid-cols-[3.5rem_minmax(0,1fr)] gap-2 text-xs">
              <span />
              <div className="relative h-10 min-w-0">
                {over > 0 && active === 1 && (
                  <span className="absolute right-0 top-0 max-w-[16rem] text-right font-bold leading-4 text-[#dc2626]">비용이 판매가보다 8 많음</span>
                )}
                {active === 2 && (
                  <span className="absolute right-0 top-0 max-w-[16rem] text-right font-bold leading-4 text-[#dc2626]">점선 칸 8: 누군가 줄이거나 떠안을 몫 (어느 몫인지는 미정)</span>
                )}
                {active === 3 && (
                  <span className="absolute right-0 top-0 max-w-[16rem] text-right font-bold leading-4 text-[#2563eb]">가격선이 108로 옮겨 감 · 수요가 줄 수 있음</span>
                )}
              </div>
            </div>

            <ul className="grid min-w-0 gap-1 text-xs sm:grid-cols-2 sm:gap-x-6">
              {SHARES.map((share, index) => (
                <li key={share.key} className="grid grid-cols-[0.75rem_minmax(0,1fr)_3.5rem] items-center gap-2">
                  <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: share.color }} />
                  <span className="leading-5">{share.name}</span>
                  <span className={`text-right font-mono font-bold ${values[index] !== share.base ? "text-[#d97706]" : ""}`}>
                    {values[index] !== share.base ? `${share.base}→${values[index]}` : values[index]}
                  </span>
                </li>
              ))}
              <li className="grid grid-cols-[0.75rem_minmax(0,1fr)_3.5rem] items-center gap-2 border-t border-border/70 pt-1 font-bold sm:col-span-2">
                <span />
                <span>합계</span>
                <span className="text-right font-mono">{total}</span>
              </li>
            </ul>
          </div>
        );
      }}
    />
  );
}

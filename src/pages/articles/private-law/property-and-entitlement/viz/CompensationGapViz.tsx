import SceneShell from "./SceneShell";

/**
 * 본문 대응: #forced-transfer ProgressiveDetail "값을 물어 주면 언제나 괜찮은가?"
 * 바깥에서 매기는 값은 대개 시장 거래 가격을 기준으로 삼고, 그 사람에게만 있는 가치는 들어오지 않는다.
 * 그래서 물어 주는 값이 실제 손실보다 작게 나오는 경향 → 오차가 한쪽으로 치우침 → 문턱을 높게.
 * 막대 길이는 모양을 보이려는 가정이며 본문에 금액이 없다.
 */
const CASES = [
  { name: "그 사람만의 몫이 작은 경우 (가정)", market: 50, personal: 18 },
  { name: "그 사람만의 몫이 큰 경우 (가정)", market: 50, personal: 40 },
] as const;
const SCALE = 95;

const SCENES = [
  {
    label: "실제로 잃는 것",
    summary: "시장 기준 몫 + 그 사람에게만 있는 몫",
    note: "옮겨 가는 쪽이 잃는 것에는 비슷한 물건이 시장에서 거래되는 가격으로 잴 수 있는 몫과, 오래 산 집처럼 그 사람에게만 있는 몫이 함께 들어 있습니다.",
  },
  {
    label: "물어 주는 값",
    summary: "대개 시장 기준 몫까지만",
    note: "바깥에서 매기는 값은 대개 시장 가격을 기준으로 삼으므로 그 사람에게만 있는 몫은 들어오지 않는 경향이 있습니다. 그래서 물어 주는 값은 대개 모자란 쪽으로 어긋나고, 오차가 한쪽으로 치우칩니다.",
  },
  {
    label: "치우침이 클수록",
    summary: "동의 없는 이전의 문턱을 높게",
    note: "그 사람에게만 있는 몫이 클수록 물어 주는 값과 실제 손실의 차이가 벌어집니다. 그만큼 동의 없는 이전의 문턱을 높게 잡아야 하고, 제도는 값을 정확히 재기 어려운 자리를 절차로 메웁니다.",
  },
] as const;

const MARKET = "#4f46e5";
const PERSONAL = "#d97706";
const PAID = "#059669";

function Row({ name, market, personal, showPaid, dim }: { name: string; market: number; personal: number; showPaid: boolean; dim: boolean }) {
  return (
    <div className={`space-y-1.5 ${dim ? "invisible" : ""}`} aria-hidden={dim}>
      <p className="text-xs font-semibold">{name}</p>
      <div className="flex h-7 min-w-0 items-stretch">
        <div className="flex items-center justify-center rounded-l-md border text-[11px] font-semibold sm:text-xs" style={{ width: `${(market / SCALE) * 100}%`, borderColor: MARKET, backgroundColor: "#4f46e51f", color: MARKET }}>
          <span className="hidden sm:inline">시장 기준</span>
        </div>
        <div className="flex items-center justify-center rounded-r-md border border-l-0 text-[11px] font-semibold sm:text-xs" style={{ width: `${(personal / SCALE) * 100}%`, borderColor: PERSONAL, backgroundColor: "#d977061f", color: PERSONAL }}>
          <span className="hidden sm:inline">그 사람만의 몫</span>
        </div>
      </div>
      <div className={`flex h-7 min-w-0 items-stretch ${showPaid ? "" : "invisible"}`}>
        <div className="flex items-center justify-center rounded-md border text-[11px] font-semibold sm:text-xs" style={{ width: `${(market / SCALE) * 100}%`, borderColor: PAID, backgroundColor: "#0596691f", color: PAID }}>
          <span className="hidden sm:inline">물어 주는 값</span>
        </div>
        <div className="flex items-center justify-center rounded-md border border-dashed text-[11px] text-red-700 sm:text-xs dark:text-red-400" style={{ width: `${(personal / SCALE) * 100}%`, borderColor: "#dc2626" }}>
          <span className="hidden sm:inline">모자람</span>
        </div>
      </div>
    </div>
  );
}

export default function CompensationGapViz() {
  return (
    <SceneShell
      eyebrow="물어 주는 값의 치우침"
      title="물어 주는 값은 모자란 쪽으로 어긋나기 쉽습니다"
      description="위 막대는 실제로 잃는 것, 아래 막대는 바깥에서 매겨 물어 주는 값입니다. 막대 길이는 모양을 보이려는 가정이며 본문에는 금액이 없습니다."
      ariaLabel="실제 손실 중 시장 기준 몫만 보상되어 모자람이 생기고, 그 사람만의 몫이 클수록 모자람이 커지는 세 장면"
      scenes={SCENES}
      render={(active) => (
        <div className="space-y-4">
          <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground sm:hidden">
            <li><span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm border" style={{ borderColor: MARKET, backgroundColor: "#4f46e51f" }} />시장 기준 몫</li>
            <li><span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm border" style={{ borderColor: PERSONAL, backgroundColor: "#d977061f" }} />그 사람만의 몫</li>
            <li><span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm border" style={{ borderColor: PAID, backgroundColor: "#0596691f" }} />물어 주는 값</li>
            <li><span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm border border-dashed" style={{ borderColor: "#dc2626" }} />모자람</li>
          </ul>
          <Row {...CASES[0]} showPaid={active >= 1} dim={false} />
          <Row {...CASES[1]} showPaid={active >= 1} dim={active < 2} />
        </div>
      )}
    />
  );
}

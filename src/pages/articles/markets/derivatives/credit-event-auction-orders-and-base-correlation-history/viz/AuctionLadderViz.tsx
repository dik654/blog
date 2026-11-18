import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture 첫 문단 — 매도 순잔량 102(백만 달러)를 높은 매수 주문부터 채워 처음 닿는 가격을 찾는다(3·7절 숫자).
 * 92.125: 15+5=20 → 누계 20 / 91.875: 10 → 30 / 91.75: 10 → 40 / 91.625: 20 → 60 / 91.5: 42만 사용 → 102.
 * 91.5의 전체 주문 수량은 본문에 없으므로 쓴 42만 그린다. 지급: 1천만(가정) × (100 − 91.5)% = 85만 달러.
 */
const TARGET = 102;

const LEVELS = [
  { price: "92.125", orders: [15, 5], used: 20 },
  { price: "91.875", orders: [10], used: 10 },
  { price: "91.75", orders: [10], used: 10 },
  { price: "91.625", orders: [20], used: 20 },
  { price: "91.5", orders: [] as readonly number[], used: 42 },
] as const;

const CUMULATIVE: readonly number[] = LEVELS.map((_, index) => LEVELS.slice(0, index + 1).reduce<number>((sum, level) => sum + level.used, 0));

const SCENES = [
  { label: "92.125에서 시작", summary: "15 + 5 = 20 · 누계 20", reached: 0, note: "순잔량은 서로 맞는 실물 요청을 상계한 뒤 남은 규모이고, 이 경매에서는 1억200만 달러 매도였습니다. 팔 물량이 남았으니 가장 높은 매수 주문인 92.125의 15와 5부터 채웁니다(단위 백만 달러)." },
  { label: "91.875로 내려감", summary: "누계 20 + 10 = 30", reached: 1, note: "92.125의 주문을 다 써도 102에 못 미쳐 한 칸 아래 91.875의 10을 더합니다." },
  { label: "91.75로 내려감", summary: "누계 30 + 10 = 40", reached: 2, note: "누계 30이면 102까지 72가 남아 91.75의 10을 더합니다. 그래도 62가 남습니다." },
  { label: "91.625로 내려감", summary: "누계 40 + 20 = 60", reached: 3, note: "91.625의 20까지 더하면 누계 60입니다. 여기까지가 본문이 말한 '91.625 이상 주문 60'입니다." },
  { label: "91.5에서 102에 닿음", summary: "60 + 42 = 102 → 최종가격 91.5", reached: 4, note: "남은 42를 91.5의 주문에서 채우면 102가 끝납니다. 그 가격의 주문 전체 수량은 본문에 없어 쓴 42만 그렸습니다. 마지막으로 쓴 가격이 제한 규칙을 통과하면 최종가격이 됩니다." },
  { label: "계약 현금으로 바꿈", summary: "1천만 × 8.5% = 85만 달러", reached: 4, note: "최종가격 91.5는 액면 100 중 91.5가 남는다는 뜻이라 보호 지급률은 100 − 91.5 = 8.5%입니다. 명목 1천만 달러(본문의 가정)라면 단순 결제액은 85만 달러입니다." },
] as const;

const ORDER_SCALE = 45;

export default function AuctionLadderViz() {
  return (
    <SceneShell
      eyebrow="주문 사다리"
      title="매도 잔량 102를 위 가격부터 채워 91.5에서 멈춥니다"
      description="한 줄이 한 가격이고, 막대는 그 가격의 매수 주문(백만 달러)입니다. 2026년 8월 4일 DISH DBS 경매의 공개 주문을 본문 순서대로 옮겼습니다."
      ariaLabel="매도 순잔량 1억200만 달러를 높은 매수 주문부터 채워 최종가격 91.5에 닿는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const filled = CUMULATIVE[scene.reached];
        const payout = active === SCENES.length - 1;
        return (
          <div className="min-w-0 space-y-3">
            <div className="space-y-1.5">
              {LEVELS.map((level, index) => {
                const done = index <= scene.reached;
                const current = index === scene.reached && !payout;
                return (
                  <div key={level.price} className={`grid grid-cols-[3.5rem_minmax(0,1fr)_4.5rem] items-center gap-2 rounded-md border px-2 py-1 text-xs sm:text-sm ${current ? "border-[#2563eb]" : "border-transparent"}`}>
                    <span className={`font-mono font-bold ${done ? "text-[#2563eb]" : "text-muted-foreground"}`}>{level.price}</span>
                    <div className="flex h-4 min-w-0 gap-0.5">
                      {level.orders.length > 0
                        ? level.orders.map((size, n) => (
                            <div key={n} className="h-full shrink-0 rounded-sm border border-[#2563eb]" style={{ width: `${(size / ORDER_SCALE) * 100}%`, backgroundColor: done ? "#2563eb" : "transparent", opacity: done ? 0.8 : 0.5 }} />
                          ))
                        : <div className="h-full shrink-0 rounded-sm border border-[#2563eb]" style={{ width: `${(level.used / ORDER_SCALE) * 100}%`, backgroundColor: done ? "#2563eb" : "transparent", opacity: done ? 0.8 : 0.5 }} />}
                    </div>
                    <span className="text-right font-mono text-muted-foreground">
                      {level.orders.length > 0 ? level.orders.join("+") : `${level.used} 사용`}
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="text-[11px] leading-5 text-muted-foreground">91.5 줄은 쓴 42만 그렸습니다. 그 가격의 나머지 주문 수량은 본문에 없습니다.</p>
            <div>
              <div className="flex items-baseline justify-between text-xs text-muted-foreground">
                <span>채운 누계</span>
                <span className="font-mono font-bold text-foreground">{filled} / {TARGET}</span>
              </div>
              <div className="mt-1 h-4 rounded-sm border border-border bg-muted/30">
                <div className="h-full rounded-sm bg-[#16a34a] transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${(filled / TARGET) * 100}%` }} />
              </div>
            </div>
            <div className={`rounded-md border px-3 py-2 text-xs sm:text-sm ${payout ? "border-[#16a34a]" : "border-dashed border-border"}`}>
              <span className="text-muted-foreground">CDS 결제(명목 1천만 달러, 가정): </span>
              <span className={`font-mono font-bold ${payout ? "text-[#16a34a]" : "text-muted-foreground"}`}>
                {payout ? "(100 − 91.5)% × 1천만 = 85만 달러" : "최종가격이 정해진 뒤 계산"}
              </span>
            </div>
          </div>
        );
      }}
    />
  );
}

import SceneShell from "./SceneShell";

/**
 * 본문 대응: #comparison — 200주 중 몇 주에 콜을 묶었는지가 주가 120의 한 주당 손익을 바꾼다.
 * 위 칸 = 100주 묶음 2개와 콜 계약. 아래 막대 = 전체 주식 한 주당 달러.
 * 주식 20, 프리미엄 3×비율, 넘기는 상승 15×비율 → 0%: 20, 50%: 14, 100%: 8.
 */
const STOCK_GAIN = 20;
const PREMIUM = 3;
const GIVEN_UP = 15;

const SCENES = [
  { label: "매도 0%", summary: "주가 120 → 한 주당 20달러", calls: 0, note: "콜을 팔지 않으면 받은 돈도, 넘기는 상승도 없습니다. 주가 상승 20달러가 그대로 남습니다." },
  { label: "매도 50%", summary: "20 − 7.5 + 1.5 = 14달러", calls: 1, note: "200주에 100주분 콜 하나를 팔면 두 묶음 중 하나만 약속에 걸립니다. 전체 주식 한 주당으로 나누면 받은 돈은 1.5달러, 넘기는 상승은 7.5달러입니다." },
  { label: "매도 100%", summary: "20 − 15 + 3 = 8달러", calls: 2, note: "두 묶음 모두 약속에 걸립니다. 4절에서 계산한 8달러와 같고, 50%일 때의 14달러보다 상승 참여가 작습니다." },
  { label: "보유량보다 많이", summary: "초과분은 주식으로 못 덮음", calls: 3, note: "세 번째 계약에는 맞춰 줄 주식이 없습니다. 이 수량은 주가가 오르면 주식 이익으로 메우지 못합니다. 세 계약은 경계를 보이려는 가정이라 손익 숫자를 적지 않았습니다." },
] as const;

const SCALE = 26;

function Bar({ label, value, color, strong = false }: { label: string; value: number | null; color: string; strong?: boolean }) {
  const width = value === null ? 0 : (Math.abs(value) / SCALE) * 100;
  return (
    <div className="grid grid-cols-[6.25rem_minmax(0,1fr)_3.25rem] items-center gap-2 text-xs sm:text-sm">
      <span className={strong ? "font-bold" : "text-muted-foreground"}>{label}</span>
      <div className="h-4 min-w-0 rounded-sm bg-muted/40">
        <div className="h-full rounded-sm transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${width}%`, backgroundColor: color }} />
      </div>
      <span className={`text-right font-mono ${strong ? "font-bold" : ""}`}>{value === null ? "−" : `${value > 0 ? "+" : value < 0 ? "−" : ""}${Math.abs(value)}`}</span>
    </div>
  );
}

export default function SellRatioViz() {
  return (
    <SceneShell
      eyebrow="매도 비율"
      title="콜을 몇 주에 묶었는지가 내 몫을 바꿉니다"
      description="칸 하나가 100주 묶음입니다. 아래 막대는 주가 120에서 전체 주식 한 주당 손익(달러)이며, 3절의 매수가 100·행사가 105·프리미엄 3을 그대로 씁니다(가정)."
      ariaLabel="매도 비율 0, 50, 100퍼센트에서 주가 120의 한 주당 손익 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const over = scene.calls > 2;
        const ratio = over ? null : scene.calls / 2;
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-3 gap-2">
              {[0, 1, 2].map((slot) => {
                const hasStock = slot < 2;
                const hasCall = slot < scene.calls;
                return (
                  <div
                    key={slot}
                    className={`rounded-lg border px-2 py-2 text-center text-xs leading-5 ${
                      hasStock ? "border-border bg-background" : hasCall ? "border-dashed border-red-600" : "border-dashed border-border/40"
                    }`}
                  >
                    <span className={`block font-semibold ${hasStock ? "" : "text-muted-foreground/60"}`}>{hasStock ? "주식 100주" : "주식 없음"}</span>
                    <span className={`block ${hasCall ? (hasStock ? "font-semibold text-amber-700 dark:text-amber-400" : "font-semibold text-red-700 dark:text-red-400") : "text-muted-foreground/50"}`}>
                      {hasCall ? "콜 1계약" : "콜 없음"}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 space-y-2">
              <Bar label="주가 상승" value={STOCK_GAIN} color="#64748b" />
              <Bar label="받은 돈" value={ratio === null ? null : PREMIUM * ratio} color="#16a34a" />
              <Bar label="넘기는 상승" value={ratio === null ? null : -GIVEN_UP * ratio} color="#d97706" />
              <Bar label="합계" value={ratio === null ? null : STOCK_GAIN + PREMIUM * ratio - GIVEN_UP * ratio} color="#2563eb" strong />
            </div>
          </div>
        );
      }}
    />
  );
}

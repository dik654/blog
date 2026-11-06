import SceneShell from "./SceneShell";

/**
 * 본문 대응: #limits — 환율·금리·차환 거절을 따로 바꾼다.
 * 조달 = 연장 안 된 달러 × 환율, 부족 = max(조달 − 현금 200억, 0), 연 이자 = 1억 달러 × 이자율 × 환율.
 * 기준 0·0·40 / 환율 0·0·48 / 금리 0·0·60 / 거절 200·0·40 / 환율+거절 240·40·48 / 셋 다 240·40·72.
 */
const CASH = 200;
const SCALE = 260;

const CASES = [
  { label: "기준", fx: false, rate: false, refuse: false, note: "1000원·4%·전액 연장입니다. 지금 구해야 할 원금이 없고 연 이자는 400만 달러 × 1000원 = 40억 원입니다." },
  { label: "환율만 바꿉니다", fx: true, rate: false, refuse: false, note: "400만 달러 × 1200원 = 48억 원입니다. 빚 전액이 연장되면 원금은 환산액만 커지고 당장 구할 돈은 생기지 않습니다." },
  { label: "금리만 바꿉니다", fx: false, rate: true, refuse: false, note: "600만 달러 × 1000원 = 60억 원입니다. 이자는 늘지만 여기의 부족은 원금만 현금과 맞댄 값이라 움직이지 않습니다." },
  { label: "차환 거절만", fx: false, rate: false, refuse: true, note: "2000만 달러 × 1000원 = 200억 원으로 현금 200억 원과 딱 맞습니다. 원금만 보면 부족이 없지만 현금이 남지 않아 연 이자 40억 원은 따로 맞춰야 합니다." },
  { label: "거절 + 환율", fx: true, rate: false, refuse: true, note: "2000만 달러 × 1200원 = 240억 원이라 40억 원이 모자랍니다. 이 숫자에서 부족을 만든 것은 거절과 환율의 겹침입니다." },
  { label: "셋 다", fx: true, rate: true, refuse: true, note: "원금 부족은 그대로 40억 원이고 연 이자 72억 원의 지급 일정은 따로 맞춰야 합니다. 가정한 숫자의 산수일 뿐 실제 사건의 원인을 증명하지는 않습니다." },
] as const;

function compute({ fx, rate, refuse }: { fx: boolean; rate: boolean; refuse: boolean }) {
  const won = fx ? 1200 : 1000;
  const need = refuse ? (2000 * won) / 10000 : 0;
  const short = Math.max(need - CASH, 0);
  const interest = ((rate ? 600 : 400) * won) / 10000;
  return { won, need, short, interest };
}

const SCENES = CASES.map((item) => {
  const { need, short, interest } = compute(item);
  return { label: item.label, note: item.note, summary: `구할 원금 ${need}억 · 원금 부족 ${short}억 · 이자 ${interest}억` };
});

function Bar({ label, value, color, strong = false }: { label: string; value: number; color: string; strong?: boolean }) {
  return (
    <div className="grid grid-cols-[5.5rem_minmax(0,1fr)_3.5rem] items-center gap-2 text-xs sm:text-sm">
      <span className={strong ? "font-bold" : "text-muted-foreground"}>{label}</span>
      <div className="h-4 min-w-0 rounded-sm bg-muted/40">
        <div className="h-full rounded-sm transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${(value / SCALE) * 100}%`, backgroundColor: color }} />
      </div>
      <span className={`text-right font-mono ${strong ? "font-bold" : ""}`}>{value}억</span>
    </div>
  );
}

function Switch({ name, value, changed }: { name: string; value: string; changed: boolean }) {
  return (
    <div className={`rounded-lg border px-2 py-2 text-center text-xs leading-5 ${changed ? "border-amber-600" : "border-border"}`}>
      <span className="block text-muted-foreground">{name}</span>
      <span className={`block font-mono font-semibold ${changed ? "text-amber-700 dark:text-amber-400" : ""}`}>{value}</span>
      <span className="block text-muted-foreground">{changed ? "바꿈" : "그대로"}</span>
    </div>
  );
}

export default function FactorIsolationViz() {
  return (
    <SceneShell
      eyebrow="하나씩 바꾸기"
      title="환율·금리·차환 거절을 따로 바꾸면 부족 현금의 출처가 보입니다"
      description="3절과 7절의 가정 숫자입니다. 사용 가능한 현금은 200억 원으로 두었고, 연 이자는 1억 달러 전액 기준입니다. 부족은 구할 원금만 현금과 맞댄 값으로 이자 지급은 넣지 않았습니다."
      ariaLabel="환율, 금리, 차환 거절을 따로 바꿀 때의 조달 필요액, 부족 현금, 연 이자"
      scenes={SCENES}
      render={(active) => {
        const item = CASES[active];
        const { won, need, short, interest } = compute(item);
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-3 gap-2">
              <Switch name="환율" value={`${won}원`} changed={item.fx} />
              <Switch name="이자율" value={item.rate ? "6%" : "4%"} changed={item.rate} />
              <Switch name="연장액" value={item.refuse ? "8000만" : "1억"} changed={item.refuse} />
            </div>
            <div className="mt-4 space-y-2">
              <Bar label="구할 원금" value={need} color="#d97706" />
              <Bar label="현금" value={CASH} color="#64748b" />
              <Bar label="원금 부족" value={short} color="#dc2626" strong />
              <Bar label="연 이자" value={interest} color="#2563eb" />
            </div>
          </div>
        );
      }}
    />
  );
}

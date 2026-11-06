import SceneShell from "./SceneShell";

/**
 * 본문 대응: #limits — 장부상 이익이 같아도 무급 노동이 다르면 사업의 매력이 다르다.
 * 본문에 금액이 없어 500·300은 비교용 가정이다. 500 − 300 = 200, 500 − 0 = 500.
 * 막대 전체 폭 = 600만 원.
 */
const BOOK = 500;
const REPLACE = 300;
const SCALE = 600;

const SCENES = [
  { label: "장부만 보면 같습니다", summary: "가게 A 500 = 가게 B 500", step: 0, note: "두 가게의 장부상 이익을 똑같이 500만 원으로 놓았습니다(가정). 이 숫자만으로는 어느 가게가 더 나은지 가릴 수 없습니다." },
  { label: "무급으로 일한 시간을 찾습니다", summary: "A만 가족 무급 노동", step: 1, note: "가게 A는 점주와 가족이 임금을 받지 않고 오래 일합니다. 그 시간을 대체 직원으로 채우는 비용을 300만 원으로 놓았습니다(가정). 다른 일을 할 때의 소득으로 비교할 수도 있습니다." },
  { label: "그 비용을 빼고 비교합니다", summary: "A 500 − 300 = 200, B = 500", step: 2, note: "300만 원은 기회비용(그 시간의 대가를 따져 보는 값)이라 회계상 순이익에 반드시 기록되는 임금과 구별합니다. 다른 사람이 인수해 운영할 수익을 판단할 때 두 숫자를 함께 봅니다." },
] as const;

function Bar({ label, width, color, value, dim = false, strong = false }: { label: string; width: number; color: string; value: string; dim?: boolean; strong?: boolean }) {
  return (
    <div className={`grid grid-cols-[5.5rem_minmax(0,1fr)_2.75rem] items-center gap-2 text-xs ${dim ? "opacity-30" : ""}`}>
      <span className={strong ? "font-bold" : "text-muted-foreground"}>{label}</span>
      <div className="h-4 min-w-0 rounded-sm bg-muted/40">
        <div className="h-full rounded-sm" style={{ width: `${(width / SCALE) * 100}%`, backgroundColor: color }} />
      </div>
      <span className="text-right font-mono text-sm font-bold">{value}</span>
    </div>
  );
}

export default function UnpaidLaborViz() {
  return (
    <SceneShell
      eyebrow="장부 밖의 비용"
      title="이익이 같은 두 가게를 무급 노동까지 봅니다"
      description="단위는 만 원입니다. 본문에 금액이 없으므로 모든 금액은 비교를 위한 가정입니다."
      ariaLabel="장부상 이익이 같은 두 가게의 대체 직원 비용 반영 전후 비교"
      scenes={SCENES}
      render={(active) => {
        const step = SCENES[active].step;
        return (
          <div className="grid min-w-0 gap-5 sm:grid-cols-2 sm:gap-6">
            {[
              { name: "가게 A", memo: "가족이 무급으로 오래 일함", cost: REPLACE },
              { name: "가게 B", memo: "무급 노동 없음(가정)", cost: 0 },
            ].map((shop) => (
              <div key={shop.name} className="min-w-0 space-y-2">
                <p className="text-sm font-bold">{shop.name} <span className="ml-1 text-xs font-normal text-muted-foreground">{step >= 1 ? shop.memo : "\u00a0"}</span></p>
                <Bar label="장부상 이익" width={BOOK} color="#64748b" value="500" />
                <Bar label="대체 직원 비용" width={step < 1 ? 0 : shop.cost} color="#d97706" value={step < 1 ? "−" : shop.cost ? `−${shop.cost}` : "0"} dim={step < 1} />
                <Bar label="뺀 비교값" width={step < 2 ? 0 : BOOK - shop.cost} color="#2563eb" value={step >= 2 ? String(BOOK - shop.cost) : "−"} dim={step < 2} strong />
              </div>
            ))}
          </div>
        );
      }}
    />
  );
}

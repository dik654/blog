import SceneShell from "./SceneShell";

/**
 * 본문 대응: #real-rate — 금액 배율을 물가 배율로 나누면 살 수 있는 양이 남는다.
 * 105/104 → 1.0096개(약 0.96%, 뺄셈 1%), 120/118 → 1.0169개(약 1.69%, 뺄셈 2%).
 * 사후 사례 105/108 → 0.9722개(약 −2.78%, 실제 물가 8%는 가정).
 */
const SCENES = [
  { label: "오늘", summary: "100만 원으로 물건 1개", money: 100, price: 100, note: "구매력을 보려고 값이 100만 원인 물건 하나를 놓았습니다(가정). 지금은 통장 금액과 물건값이 같아 꼭 한 개를 삽니다." },
  { label: "1년 뒤 통장", summary: "명목금리 5% → 105만 원", money: 105, price: null, note: "금액은 5% 늘었습니다. 하지만 이것만으로는 무엇을 더 살 수 있게 됐는지 알 수 없습니다." },
  { label: "1년 뒤 물건값", summary: "105 ÷ 104 = 1.0096개 · 약 0.96%", money: 105, price: 104, note: "물가가 4% 올라 물건값은 104만 원입니다. 늘어난 양은 나눗셈으로 약 0.96%이고, 뺄셈 5−4=1%는 이 값의 근사입니다. 여기서는 차이가 작습니다." },
  { label: "두 비율이 크면", summary: "120 ÷ 118 = 1.0169개 · 약 1.69%", money: 120, price: 118, note: "명목 20%에 물가 18%면 뺄셈은 2%인데 정확한 값은 약 1.69%입니다. 물가가 두 자릿수로 오르면 근사가 눈에 띄게 어긋납니다." },
  { label: "물가가 예상과 다르면", summary: "105 ÷ 108 = 0.9722개 · 약 −2.78%", money: 105, price: 108, note: "계약 때 예상 물가 4%로 본 사전 실질금리는 약 0.96%였습니다. 실제 물가가 8%였다면(가정) 나중에 확인한 사후 실질금리는 약 −2.78%입니다. 빌려준 쪽은 예상보다 적은 구매력을 돌려받고, 빌린 쪽은 그만큼 덜 갚은 셈입니다." },
] as const;

const MAX = 125;

function Row({ label, value, color, hidden = false }: { label: string; value: number | null; color: string; hidden?: boolean }) {
  return (
    <div className="grid grid-cols-[4.25rem_minmax(0,1fr)_3rem] items-center gap-2 text-xs sm:text-sm">
      <span className="text-muted-foreground">{label}</span>
      <div className="h-5 min-w-0 rounded-sm bg-muted/40">
        {!hidden && value !== null && (
          <div className="h-full rounded-sm transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${(value / MAX) * 100}%`, backgroundColor: color }} />
        )}
      </div>
      <span className="text-right font-mono">{value === null ? "?" : `${value}만`}</span>
    </div>
  );
}

export default function RealRateViz() {
  return (
    <SceneShell
      eyebrow="구매력"
      title="통장 금액을 물건값으로 나누면 살 수 있는 양이 남습니다"
      description="두 막대는 같은 눈금입니다. 아래 칸은 그 돈으로 살 수 있는 물건의 개수이고, 한 칸이 물건 하나입니다."
      ariaLabel="명목금리와 물가상승률로 구매력을 계산하는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const units = scene.price === null ? null : scene.money / scene.price;
        return (
          <div className="min-w-0">
            <div className="space-y-2">
              <Row label="통장 금액" value={scene.money} color="#2563eb" />
              <Row label="물건값" value={scene.price} color="#d97706" />
            </div>
            <p className="mt-4 text-xs text-muted-foreground">살 수 있는 양</p>
            <div className="mt-1.5 grid grid-cols-[minmax(0,1fr)_4.75rem] items-center gap-2">
              <div className="relative h-8 overflow-hidden rounded-sm border border-border bg-background">
                <div className="absolute inset-y-0 left-0 w-[80%] border-r border-border" />
                {units !== null && (
                  <div className="absolute inset-y-0 left-0 bg-emerald-600/40 transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${units * 80}%` }} />
                )}
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-semibold">물건 1개</span>
              </div>
              <span className="text-right font-mono text-sm font-bold">{units === null ? "?" : `${units.toFixed(4)}개`}</span>
            </div>
          </div>
        );
      }}
    />
  );
}

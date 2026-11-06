import SceneShell from "./SceneShell";

/**
 * 본문 대응: #comparison·#limits — 같은 100톤 매도 계약(30만), 밀값 35만.
 * 100톤: 3500 − 500 = 3000. 60톤: 2100 − 500 = 1600. 0톤: 0 − 500 = −500 (만 원).
 * 60톤은 상승분 5만 × 60 = 300으로 손실 500을 다 메우지 못해 200이 남는다.
 */
const SCENES = [
  { label: "밀 100톤", tons: 100, summary: "3500 − 500 = 3000만 원", note: "농가는 현물 매출 3500만 원과 선물 손실 500만 원을 합쳐 3000만 원을 확보합니다. 계약이 원래 사업의 수량과 맞으니 위험이 줄어듭니다." },
  { label: "수확 60톤", tons: 60, summary: "2100 − 500 = 1600만 원", note: "100톤 판매 계약 중 40톤이 원래 사업을 넘어섭니다. 60톤의 상승분은 5만 원 × 60톤 = 300만 원이라 선물 손실 500만 원을 다 메우지 못합니다. 60톤을 30만 원에 판 1800만 원보다 200만 원 적습니다." },
  { label: "밀 없음", tons: 0, summary: "0 − 500 = −500만 원", note: "밀을 전혀 보유하지 않은 매도자는 상쇄할 매출 없이 500만 원을 잃습니다. 계약은 같으니 계약 방향만으로 헤지 여부를 정할 수 없습니다." },
] as const;

const PRICE = 35;
const LOSS = 500;
const SCALE = 3500;
const TILES = Array.from({ length: 10 }, (_, index) => (index + 1) * 10);

function Bar({ label, value, color, strong = false }: { label: string; value: number; color: string; strong?: boolean }) {
  return (
    <div className="grid grid-cols-[5.25rem_minmax(0,1fr)_3.5rem] items-center gap-2 text-xs sm:text-sm">
      <span className={strong ? "font-bold" : "text-muted-foreground"}>{label}</span>
      <div className="h-4 min-w-0 rounded-sm bg-muted/40">
        <div className="h-full rounded-sm transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${(Math.abs(value) / SCALE) * 100}%`, backgroundColor: color }} />
      </div>
      <span className={`text-right font-mono ${strong ? "font-bold" : ""}`}>{value < 0 ? `−${Math.abs(value)}` : value}</span>
    </div>
  );
}

export default function HarvestCoverViz() {
  return (
    <SceneShell
      eyebrow="계약 아래의 밀"
      title="같은 매도 계약도 밑에 있는 밀에 따라 결과가 달라집니다"
      description="칸 하나가 10톤입니다. 모두 톤당 30만 원에 100톤을 판 계약이고, 만기 밀값은 글의 사례인 35만 원으로 두었습니다(가정). 막대 단위는 만 원입니다."
      ariaLabel="실제 보유 밀이 100톤, 60톤, 0톤일 때 매도 계약의 합산 결과"
      scenes={SCENES}
      render={(active) => {
        const { tons } = SCENES[active];
        const sales = tons * PRICE;
        const total = sales - LOSS;
        return (
          <div className="min-w-0">
            <p className="mb-1 text-xs font-semibold text-amber-700 dark:text-amber-400">매도 계약 100톤</p>
            <div className="h-1 rounded-sm bg-[#d97706]" />
            <div className="mt-1 grid grid-cols-10 gap-1">
              {TILES.map((tile) => (
                <div
                  key={tile}
                  className={`h-8 rounded-sm border ${tile <= tons ? "border-slate-500 bg-slate-500" : "border-dashed border-[#d97706]"}`}
                />
              ))}
            </div>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              채운 칸 = 실제 밀 {tons}톤 · 점선 칸 = 밀 없이 계약만 있는 {100 - tons}톤
            </p>
            <div className="mt-4 space-y-2">
              <Bar label="현물 매출" value={sales} color="#64748b" />
              <Bar label="선물 손실" value={-LOSS} color="#d97706" />
              <Bar label="합계" value={total} color={total < 0 ? "#dc2626" : "#2563eb"} strong />
            </div>
          </div>
        );
      }}
    />
  );
}

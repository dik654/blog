import SceneShell from "./SceneShell";

/**
 * 본문 대응: comparison 절 — 2시간을 유료로 옮겨도 돌봄 4시간은 전에도 있었다. 기록되는 돈은 0 → 3만원.
 * 돌봄의 양·품질 변화는 이 글의 가정에 없으므로 값을 그리지 않는다.
 */
const SCENES = [
  { label: "모두 가족이 맡을 때", summary: "돌봄 4시간 · 거래 0원", note: "지출이 없어도 돌봄 4시간은 실제로 있습니다. 가계 지출이 없다는 이유로 0으로 처리하면 실제 제약을 지우게 됩니다." },
  { label: "2시간을 유료로", summary: "돌봄 4시간 · 거래 3만원", note: "2시간이 유료 서비스로 옮겨가면 3만원의 거래가 새로 기록됩니다. 그러나 이전에도 같은 2시간의 돌봄이 있었습니다." },
  { label: "따로 재야 할 세 가지", summary: "돈 · 돌봄 · 다른 일의 시간", note: "기록된 돈의 증가와 돌봄의 양·품질 증가, 다른 일을 할 수 있는 시간 증가는 각각 측정합니다. 돌봄의 양과 품질이 바뀌었는지는 이 계산만으로 알 수 없습니다." },
] as const;

function Cell({ paid }: { paid: boolean }) {
  return (
    <span className={`flex h-10 items-center justify-center rounded-sm border text-xs font-semibold ${paid ? "border-[#64748b] bg-[#64748b]/25" : "border-[#b45309] bg-[#b45309]/20"}`}>
      {paid ? "유료" : "가족"}
    </span>
  );
}

const MEASURES = [
  { name: "기록된 돈", value: "0원 → 3만원" },
  { name: "돌봄의 양·품질", value: "이 계산으론 모름" },
  { name: "다른 일을 할 수 있는 시간", value: "2시간 증가" },
] as const;

export default function CareLedgerViz() {
  return (
    <SceneShell
      eyebrow="장부에 보이는 것"
      title="돈이 새로 찍혀도 돌봄이 그때 처음 생긴 것은 아닙니다"
      description="칸 하나가 A 가구의 돌봄 1시간입니다(가정). 아래 장부 칸은 그 시간 중 거래로 기록되는 금액입니다."
      ariaLabel="돌봄 4시간과 기록되는 거래 금액의 관계"
      scenes={SCENES}
      render={(active) => {
        const paid = active >= 1;
        return (
          <div className="min-w-0">
            <p className="mb-1 text-xs font-bold">실제 돌봄 4시간</p>
            <div className="grid grid-cols-4 gap-1">
              {[0, 1, 2, 3].map((hour) => (
                <Cell key={hour} paid={paid && hour >= 2} />
              ))}
            </div>
            <div className="mt-3 flex items-baseline justify-between gap-2 border-t border-border pt-2 text-xs">
              <span className="font-bold">장부에 찍힌 돌봄 거래</span>
              <span className="font-mono text-sm font-bold">{paid ? "3만원" : "0원"}</span>
            </div>
            <div className={`mt-3 grid gap-2 sm:grid-cols-3 ${active === 2 ? "" : "invisible"}`}>
              {MEASURES.map((item) => (
                <div key={item.name} className="border-l border-primary/60 pl-3 text-xs">
                  <p className="text-muted-foreground">{item.name}</p>
                  <p className="font-mono font-bold">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}

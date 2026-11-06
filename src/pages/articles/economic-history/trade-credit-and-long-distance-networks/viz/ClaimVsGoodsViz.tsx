import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture — 실물이 팔리거나 가공되어도 은 6미나의 의무는 상환 때까지 남는다.
 * 6미나 = 2미나(다음 수확, 3분의 1) + 4미나(나중). 칸 하나가 1미나.
 * 단계 칸의 간격은 순서만 나타낸다. 글에 상환까지의 기간이 없다.
 */
const ACCENT = "#2563eb";

const SCENES = [
  { label: "약속이 생기는 때", summary: "실물 넘어감 · 의무 6미나", left: 6, goods: 0, note: "7절의 경로대로 상인이 카네시에서 물건을 팔았는데 구매자가 은을 다 내지 못한 경우로 따라갑니다. 물건은 넘어갔고, 점토판에 은 6미나(약 3kg)의 의무가 생깁니다." },
  { label: "실물이 달라져도", summary: "실물 변화 · 의무 6미나 그대로", left: 6, goods: 1, note: "직물은 이미 팔리고 주석은 다른 물건으로 가공될 수 있습니다. 실물의 위치와 소유가 바뀌어도 의무는 한 칸도 줄지 않습니다." },
  { label: "다음 수확", summary: "6 − 2 = 4미나 남음", left: 4, goods: 1, note: "약속대로라면 전체의 3분의 1인 2미나를 다음 수확 때 갚습니다. 기한까지 갚지 못하면 달마다 이자가 붙는 조항이 있지만(8절), 이자율이 글에 없어 칸에 넣지 않았습니다." },
  { label: "뒤 상환", summary: "4 − 4 = 0미나", left: 0, goods: 1, note: "나머지 4미나까지 실제 은으로 갚으면 의무가 끝납니다. 실물과 따로 움직인 청구권이 이때 닫힙니다." },
] as const;

const STEPS = ["물건 판매", "실물 변화", "다음 수확", "뒤 상환"];

function Good({ name, state, gone }: { name: string; state: string; gone: boolean }) {
  return (
    <div className={`rounded-lg border px-2 py-2 text-center text-xs leading-5 ${gone ? "border-dashed border-border" : "border-border bg-background"}`}>
      <span className={`block font-semibold ${gone ? "text-muted-foreground" : ""}`}>{name}</span>
      <span className="block text-muted-foreground">{state}</span>
    </div>
  );
}

export default function ClaimVsGoodsViz() {
  return (
    <SceneShell
      eyebrow="실물과 청구권"
      title="물건이 팔리고 가공돼도 점토판의 6칸은 그대로 남습니다"
      description="청구권은 나중에 은을 받을 권리이고, 미나는 은의 무게 단위입니다. 칸 하나가 1미나이며, 네 단계는 순서만 나타내고 실제 기간을 뜻하지 않습니다."
      ariaLabel="실물 상태와 점토판 의무 6미나가 네 단계에서 따로 변하는 모습"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const paid = 6 - scene.left;
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-4 gap-1 text-center text-xs">
              {STEPS.map((step, index) => (
                <span key={step} className={`border-t pt-1 ${index === active ? "font-bold" : "text-muted-foreground"}`} style={{ borderTopColor: index <= active ? ACCENT : "#cbd5e1" }}>
                  {step}
                </span>
              ))}
            </div>
            <p className="mt-4 text-xs font-bold">실물</p>
            <div className="mt-1.5 grid grid-cols-2 gap-2">
              <Good name="직물" state={scene.goods ? "이미 팔림" : "구매자에게 넘어감"} gone={scene.goods > 0} />
              <Good name="주석" state={scene.goods ? "가공될 수 있음" : "구매자에게 넘어감"} gone={scene.goods > 0} />
            </div>
            <div className="mt-4 flex items-baseline justify-between text-xs">
              <span className="font-bold">점토판의 의무</span>
              <span className="font-mono font-bold">남은 {scene.left}미나</span>
            </div>
            <div className="mt-1.5 grid grid-cols-6 gap-1.5">
              {[0, 1, 2, 3, 4, 5].map((slot) => {
                const done = slot < paid;
                return (
                  <div
                    key={slot}
                    className="h-9 rounded-md border transition-colors duration-300 motion-reduce:transition-none"
                    style={{ backgroundColor: done ? "transparent" : ACCENT, borderColor: done ? "#94a3b8" : ACCENT, borderStyle: done ? "dashed" : "solid" }}
                  />
                );
              })}
              <span className="col-span-2 text-center text-xs text-muted-foreground">다음 수확 2미나</span>
              <span className="col-span-4 text-center text-xs text-muted-foreground">나중 상환 4미나</span>
            </div>
          </div>
        );
      }}
    />
  );
}

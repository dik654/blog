import SceneShell from "./SceneShell";

/**
 * 본문 대응: #black-box 첫 문단 — 나라 안의 일하는 사람·물건 만드는 곳·공동 서비스, 나라 밖의 고객·부품 판매처·돈 빌려주는 상대.
 * 화살표는 방향만 뜻합니다. 양은 그리지 않습니다.
 */
type Dir = "out" | "in";
const LANES = [
  { left: "물건을 만드는 곳", right: "물건을 사는 고객", flows: [{ text: "물건", dir: "out" as Dir }, { text: "돈", dir: "in" as Dir }] },
  { left: "물건을 만드는 곳", right: "부품을 파는 곳", flows: [{ text: "부품", dir: "in" as Dir }, { text: "돈", dir: "out" as Dir }] },
  { left: "돈을 빌린 쪽", right: "돈을 빌려주는 상대", flows: [{ text: "빌린 돈", dir: "in" as Dir }, { text: "갚을 돈", dir: "out" as Dir }] },
  { left: "일하는 사람", right: "나라 밖의 사람", flows: [{ text: "사람", dir: "out" as Dir }, { text: "사람", dir: "in" as Dir }] },
] as const;

const SCENES = [
  { label: "파는 길", summary: "물건은 나가고 돈은 들어옵니다", note: "바깥의 고객에게 물건을 팔면 물건과 돈이 서로 반대 방향으로 국경을 넘습니다." },
  { label: "사 오는 길", summary: "부품은 들어오고 돈은 나갑니다", note: "부품을 밖에서 사면 방향이 뒤집힙니다. 판 돈과 부품값이 같은 국경을 서로 반대로 지나갑니다." },
  { label: "빌리는 길", summary: "지금 들어온 돈, 나중에 나갈 돈", note: "돈을 빌려주는 상대도 바깥에 있습니다. 들어온 돈에는 나중에 다시 나갈 돈이 붙어 있습니다." },
  { label: "사람의 길", summary: "사람도 안팎으로 움직입니다", note: "국경을 넘는 것은 물건과 돈만이 아닙니다. 사람도 안에서 밖으로, 밖에서 안으로 이동합니다." },
  { label: "하나가 막히면", summary: "나머지는 어떻게 달라질까요?", note: "부품 길을 예로 막았습니다(가정). 나머지 길이 어떻게 달라질지가 첫 질문입니다." },
] as const;

const COLOR = "#2563eb";
const BLOCK = "#dc2626";
const MUTED = "#94a3b8";

function FlowArrow({ dir, color, dashed }: { dir: Dir; color: string; dashed: boolean }) {
  return (
    <svg viewBox="0 0 72 8" className="h-2 w-full" preserveAspectRatio="none" aria-hidden="true">
      <line x1={2} x2={70} y1={4} y2={4} stroke={color} strokeWidth={1.25} strokeDasharray={dashed ? "3 3" : undefined} vectorEffect="non-scaling-stroke" />
      <path d={dir === "out" ? "M64 0.5L70 4L64 7.5" : "M8 0.5L2 4L8 7.5"} fill="none" stroke={color} strokeWidth={1.25} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export default function BorderFlowViz() {
  return (
    <SceneShell
      eyebrow="나라의 안과 밖"
      title="국경을 사이에 두고 네 갈래가 오갑니다"
      description="왼쪽이 나라 안, 오른쪽이 나라 밖입니다. 화살표는 방향만 뜻하고, 길이는 양이 아닙니다."
      ariaLabel="나라 안과 밖 사이로 물건, 부품, 돈, 사람이 오가는 네 갈래 지도"
      scenes={SCENES}
      render={(active) => {
        const blockedLane = active === 4 ? 1 : -1;
        return (
          <div className="relative min-w-0">
            <div aria-hidden="true" className="absolute bottom-0 left-1/2 top-5 w-0 border-l border-dashed border-muted-foreground/50" />
            <div className="relative grid grid-cols-[minmax(0,1fr)_minmax(72px,0.8fr)_minmax(0,1fr)] gap-x-2 text-center text-xs font-bold text-muted-foreground">
              <span>나라 안</span>
              <span className="bg-transparent">국경</span>
              <span>나라 밖</span>
            </div>
            <div className="relative mt-1 grid grid-cols-[minmax(0,1fr)_minmax(72px,0.8fr)_minmax(0,1fr)] gap-x-2">
              <div className="rounded-lg border border-border bg-background px-2 py-1 text-center text-xs leading-5">공동 서비스를 정하는 곳</div>
            </div>
            <div className="relative mt-1 space-y-1">
              {LANES.map((lane, index) => {
                const on = active === 4 || active === index;
                const blocked = index === blockedLane;
                return (
                  <div
                    key={`${lane.left}-${lane.right}`}
                    className={`grid grid-cols-[minmax(0,1fr)_minmax(72px,0.8fr)_minmax(0,1fr)] items-center gap-x-2 transition-opacity duration-300 motion-reduce:transition-none ${on ? "opacity-100" : "opacity-25"}`}
                  >
                    <div className="flex min-h-[3.25rem] items-center justify-center rounded-lg border border-border bg-background px-2 py-1 text-center text-xs leading-5">{lane.left}</div>
                    <div className="min-w-0 space-y-0.5">
                      {lane.flows.map((flow) => {
                        const unknown = active === 4 && !blocked;
                        const color = blocked ? BLOCK : unknown ? MUTED : COLOR;
                        return (
                          <div key={`${flow.text}-${flow.dir}`} className="min-w-0">
                            <p className="bg-background/80 text-center text-[11px] font-semibold leading-4">
                              {blocked ? `${flow.text} 막힘` : unknown ? `${flow.text} ?` : flow.text}
                            </p>
                            <FlowArrow dir={flow.dir} color={color} dashed={blocked || unknown} />
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex min-h-[3.25rem] items-center justify-center rounded-lg border border-border bg-background px-2 py-1 text-center text-xs leading-5">{lane.right}</div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }}
    />
  );
}

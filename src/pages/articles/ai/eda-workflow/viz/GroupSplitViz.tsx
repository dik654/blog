import SceneShell from "./SceneShell";

/**
 * 본문 대응: #overview 질문 2 — 같은 고객의 반복 주문을 random row split하면 누출을 막을 수 없다.
 * 고객 4명 × 주문 3건 = 12행은 설명용 축소판(가정). 실제 글의 사례는 배송 1,000건.
 * random: validation 3행이 고객 1·2·4에서 하나씩 → 세 고객 모두 train에도 있음.
 * group: 고객 4의 3행 전체가 validation → train과 겹치는 고객 0명.
 */
type Slot = "none" | "train" | "valid";

const CUSTOMERS = ["고객 1", "고객 2", "고객 3", "고객 4"] as const;

const SCENES = [
  {
    label: "한 고객이 여러 행입니다",
    summary: "4명 × 3건 = 12행",
    note: "한 행은 주문 한 건입니다. 같은 고객이 주문을 반복하면 그 고객의 정보가 여러 행에 나뉘어 들어갑니다.",
    grid: [
      ["none", "none", "none"],
      ["none", "none", "none"],
      ["none", "none", "none"],
      ["none", "none", "none"],
    ],
    overlap: null,
  },
  {
    label: "행 단위로 무작위 split",
    summary: "validation 고객 3명 모두 train에도 있음",
    note: "행을 무작위로 고르면 validation 주문의 고객이 train에도 들어갑니다. 모델은 그 고객의 다른 주문을 이미 본 상태로 평가받습니다.",
    grid: [
      ["train", "train", "valid"],
      ["train", "valid", "train"],
      ["train", "train", "train"],
      ["valid", "train", "train"],
    ],
    overlap: 3,
  },
  {
    label: "고객 단위로 split",
    summary: "겹치는 고객 0명",
    note: "고객을 경계로 묶어 한 고객의 주문 전체를 같은 쪽에 둡니다. validation 고객은 train에서 한 번도 보지 않은 고객이 됩니다.",
    grid: [
      ["train", "train", "train"],
      ["train", "train", "train"],
      ["train", "train", "train"],
      ["valid", "valid", "valid"],
    ],
    overlap: 0,
  },
] as const;

const CELL: Record<Slot, string> = {
  none: "border-border bg-background text-muted-foreground",
  train: "border-slate-500 bg-slate-500/15 text-foreground",
  valid: "border-blue-600 bg-blue-600/15 font-bold text-blue-700 dark:text-blue-300",
};

const TAG: Record<Slot, string> = { none: "주문", train: "train", valid: "valid" };

export default function GroupSplitViz() {
  return (
    <SceneShell
      eyebrow="split 경계"
      title="행을 섞으면 같은 고객이 train과 validation 양쪽에 들어갑니다"
      description="칸 하나가 주문 한 건이고 한 줄이 한 고객입니다. 고객 4명·주문 3건씩은 1,000건 사례를 줄인 설명용 배치입니다(가정)."
      ariaLabel="무작위 행 split과 고객 단위 split에서 validation 고객이 train과 겹치는지 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-2">
            {CUSTOMERS.map((name, row) => {
              const cells = (scene.grid as readonly (readonly Slot[])[])[row];
              const inBoth = cells.includes("train") && cells.includes("valid");
              return (
                <div key={name} className="grid grid-cols-[3.75rem_minmax(0,1fr)_3.5rem] items-center gap-2 text-xs">
                  <span className="font-semibold">{name}</span>
                  <div className="grid min-w-0 grid-cols-3 gap-1.5">
                    {cells.map((slot, index) => (
                      <span key={index} className={`rounded border px-1 py-1.5 text-center ${CELL[slot]}`}>
                        {TAG[slot]}
                      </span>
                    ))}
                  </div>
                  <span className={`text-right font-bold ${inBoth ? "text-red-700 dark:text-red-400" : "text-transparent"}`}>{inBoth ? "양쪽" : "·"}</span>
                </div>
              );
            })}
            <p className="pt-2 text-xs text-muted-foreground">
              validation 고객 중 train에도 있는 고객{" "}
              <span className="font-mono font-bold text-foreground">{scene.overlap === null ? "−" : `${scene.overlap}명`}</span>
            </p>
          </div>
        );
      }}
    />
  );
}

import SceneShell from "./SceneShell";

/**
 * 본문 대응: #need — 예상 잔여 5개와 실사 4개의 1개 차이, 그 원인 갈래, 폐기 확인 뒤의 정리.
 * 25 − 20 = 5, 5 − 4 = 1, 25 − 20 − 1 = 4, 4 − 4 = 0, 1 × 2,000 = 2,000원.
 */
type Cell = "sold" | "left" | "gap" | "waste";

const SCENES = [
  {
    label: "장부만 계산하면",
    summary: "25 − 판매 20 = 예상 5개",
    expected: 5,
    counted: "아직 안 셈",
    gapText: "−",
    last: "left" as Cell,
    note: "시작 10개와 입고 15개, 모두 25개에서 판매 20개를 빼면 장부상 5개가 남아야 합니다.",
  },
  {
    label: "실제로 세면",
    summary: "실사 4개 · 차이 1개",
    expected: 5,
    counted: "4개",
    gapText: "1개",
    last: "gap" as Cell,
    note: "실제로 세어 보니(실사) 4개입니다. 은행 잔액만 봐서는 보이지 않는 이 1개 차이를 기록해야 합니다.",
  },
  {
    label: "원인이 조치를 가릅니다",
    summary: "같은 1개, 다른 원인",
    expected: 5,
    counted: "4개",
    gapText: "1개",
    last: "gap" as Cell,
    note: "상해서 버린 것인지, 직원 식사인지, 주문을 기록하지 않은 것인지에 따라 다음날 조치가 달라집니다.",
  },
  {
    label: "이 사례는 폐기",
    summary: "1개 × 2,000원 = 2,000원 손실",
    expected: 4,
    counted: "4개",
    gapText: "0개",
    last: "waste" as Cell,
    note: "폐기 1개가 확인됐으므로 2천 원 손실로 처리합니다. 예상 잔여는 25 − 20 − 1 = 4개가 되어 실사와 맞지만, 차이 0개가 손실 0원을 뜻하지는 않습니다.",
  },
] as const;

const CELL_CLASS: Record<Cell, string> = {
  sold: "border-blue-600 bg-blue-600/40 text-transparent",
  left: "border-slate-400 bg-background text-transparent",
  gap: "border-dashed border-red-600 bg-background font-bold text-red-700 dark:text-red-400",
  waste: "border-red-600 bg-red-600/40 font-bold text-red-800 dark:text-red-200",
};

const CAUSES = ["상해서 버림", "직원 식사", "기록 안 한 주문"] as const;

function Count({ name, value, strong = false }: { name: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-2 border-b border-border py-1 text-xs leading-5 sm:text-sm">
      <span className="text-muted-foreground">{name}</span>
      <span className={`font-mono ${strong ? "font-bold" : ""}`}>{value}</span>
    </div>
  );
}

export default function StockGapViz() {
  return (
    <SceneShell
      eyebrow="재료 25개"
      title="장부의 5개와 실제 4개 사이의 한 칸"
      description="칸 하나가 재료 1개 분량입니다. 파란 칸은 판매, 빈 칸은 남은 재료입니다. 숫자는 3절의 가정입니다."
      ariaLabel="재료 25개 중 판매 20개를 뺀 예상 잔여 5개와 실사 4개의 차이, 폐기 확인까지의 과정"
      scenes={SCENES}
      render={(scene) => {
        const item = SCENES[scene];
        const cells = Array.from({ length: 25 }, (_, index): Cell => {
          if (index < 20) return "sold";
          if (index < 24) return "left";
          return item.last;
        });
        return (
          <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_14rem]">
            <div className="mx-auto grid w-full max-w-[13rem] grid-cols-5 gap-1" role="img" aria-label={`재료 25개: 판매 20개와 나머지 5개의 상태. ${item.summary}`}>
              {cells.map((cell, index) => (
                <span key={index} className={`flex aspect-square items-center justify-center rounded-sm border text-sm ${CELL_CLASS[cell]}`}>
                  {cell === "gap" ? "?" : cell === "waste" ? "폐기" : "·"}
                </span>
              ))}
            </div>
            <div className="min-w-0">
              <Count name="장부 예상 잔여" value={`${item.expected}개`} />
              <Count name="실사" value={item.counted} />
              <Count name="차이" value={item.gapText} strong />
              <div className={`mt-3 space-y-1 ${scene === 2 ? "" : "invisible"}`}>
                {CAUSES.map((cause) => (
                  <p key={cause} className="rounded-md border border-dashed border-red-600 px-2 py-1 text-xs leading-5">? → {cause}</p>
                ))}
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}

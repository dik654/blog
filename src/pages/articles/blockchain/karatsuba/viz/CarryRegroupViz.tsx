import SceneShell from "./SceneShell";

/**
 * 본문 대응: #trace — 세 곱 672·2840·2652를 100진 자리 칸에 놓고 올림을 넘긴다.
 * 2652 → 52 남김, 26 올림 / 2840+26=2866 → 66 남김, 28 올림 / 672+28=700 → 00 남김, 7 올림.
 * 반례: 134를 34로 자르면 s=46×34=1564, 교차항 1564−672−2652=−1760, 결과 6,546,652.
 * 차이 7,006,652−6,546,652=460,000 = 버린 100×46=4600이 가운데 칸(×100)에서 빠진 값.
 */
const PLACES = ["×100³", "×100²", "×100", "×1"] as const;

interface Cell {
  value: string;
  detail: string;
  tone: "idle" | "over" | "done" | "changed" | "changedOver" | "bug";
}

const SCENES: readonly {
  label: string;
  summary: string;
  note: string;
  cells: readonly Cell[];
}[] = [
  {
    label: "세 곱을 자리에 놓기",
    summary: "672 | 2840 | 2652",
    note: "칸 하나는 100진 자리 하나라서 0~99만 담을 수 있습니다. 높은 곱 672는 ×100² 칸, 교차항 2840은 ×100 칸, 낮은 곱 2652는 ×1 칸에 놓이지만 세 칸 모두 99를 넘습니다.",
    cells: [
      { value: "", detail: "비어 있음", tone: "idle" },
      { value: "672", detail: "높은 곱", tone: "over" },
      { value: "2840", detail: "교차항", tone: "over" },
      { value: "2652", detail: "낮은 곱", tone: "over" },
    ],
  },
  {
    label: "낮은 칸의 올림",
    summary: "2652 → 52 남김, 26 올림",
    note: "2652 = 26×100 + 52입니다. 52는 ×1 칸에 남고 26은 한 칸 왼쪽인 ×100 칸으로 넘어가 2840+26=2866이 됩니다.",
    cells: [
      { value: "", detail: "비어 있음", tone: "idle" },
      { value: "672", detail: "아직 그대로", tone: "over" },
      { value: "2866", detail: "2840 + 26", tone: "changedOver" },
      { value: "52", detail: "26을 왼쪽으로", tone: "changed" },
    ],
  },
  {
    label: "가운데 칸의 올림",
    summary: "2866 → 66 남김, 28 올림",
    note: "2866 = 28×100 + 66입니다. 66을 남기고 28을 ×100² 칸으로 보내면 672+28=700이 됩니다.",
    cells: [
      { value: "", detail: "비어 있음", tone: "idle" },
      { value: "700", detail: "672 + 28", tone: "changedOver" },
      { value: "66", detail: "28을 왼쪽으로", tone: "changed" },
      { value: "52", detail: "확정", tone: "done" },
    ],
  },
  {
    label: "위쪽 칸까지 정리",
    summary: "7 | 00 | 66 | 52 = 7,006,652",
    note: "700 = 7×100 + 0이므로 00을 남기고 7을 새 칸으로 보냅니다. 높은 칸부터 7 | 00 | 66 | 52로 읽으면 네 번 곱한 기준 결과 7,006,652와 같습니다.",
    cells: [
      { value: "7", detail: "새로 생긴 칸", tone: "changed" },
      { value: "00", detail: "7을 왼쪽으로", tone: "changed" },
      { value: "66", detail: "확정", tone: "done" },
      { value: "52", detail: "확정", tone: "done" },
    ],
  },
  {
    label: "반례: 134를 34로 자르면",
    summary: "6,546,652 (460,000 부족)",
    note: "56+78=134에서 백의 자리를 버리면 세 번째 곱이 46×34=1564가 되고 교차항은 1564−672−2652=−1760입니다. 버린 100에 46을 곱한 4600이 ×100 칸에서 빠져 결과가 4600×100=460,000만큼 작아집니다. 교차항이 원래 음수인 것이 아니라 중간 합의 올림을 버린 버그입니다.",
    cells: [
      { value: "", detail: "비어 있음", tone: "idle" },
      { value: "672", detail: "높은 곱", tone: "over" },
      { value: "−1760", detail: "2840이어야 함", tone: "bug" },
      { value: "2652", detail: "낮은 곱", tone: "over" },
    ],
  },
];

const TONE: Record<Cell["tone"], string> = {
  idle: "border-dashed border-border/50 text-muted-foreground/60",
  over: "border-amber-600/70 text-foreground",
  done: "border-border bg-background text-foreground",
  changed: "border-border bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300",
  changedOver: "border-amber-600/70 bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300",
  bug: "border-red-600 bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400",
};

export default function CarryRegroupViz() {
  return (
    <SceneShell
      eyebrow="100진 자리 올림"
      title="넘친 칸은 100을 떼어 왼쪽 칸으로 보냅니다"
      description="칸 하나가 두 자리 묶음 하나(0~99)입니다. 주황 테두리는 99를 넘어 아직 정리가 필요한 칸, 파란 바탕은 그 장면에서 값이 바뀐 칸입니다. 세 곱의 값은 9절의 손계산을 그대로 씁니다."
      ariaLabel="672, 2840, 2652를 100진 자리 칸에 놓고 올림을 넘겨 7,006,652를 얻는 과정과 올림을 버린 반례"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-4 gap-2">
              {PLACES.map((place, index) => {
                const cell = scene.cells[index];
                return (
                  <div key={place} className={`min-w-0 rounded-lg border px-1.5 py-2 text-center transition-colors duration-300 motion-reduce:transition-none ${TONE[cell.tone]}`}>
                    <span className="block font-mono text-[11px] text-muted-foreground">{place}</span>
                    <span className="mt-1 block h-7 font-mono text-base font-bold leading-7 sm:text-lg">{cell.value || "·"}</span>
                    <span className="mt-1 block h-8 text-[11px] leading-4">{cell.detail}</span>
                  </div>
                );
              })}
            </div>
            <p className="mt-3 text-center font-mono text-xs text-muted-foreground">
              {active === SCENES.length - 1
                ? "672·100² − 1760·100 + 2652 = 6,546,652"
                : "672·100² + 2840·100 + 2652 = 7,006,652"}
            </p>
          </div>
        );
      }}
    />
  );
}

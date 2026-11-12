import SceneShell from "./SceneShell";

/**
 * 본문 대응: #overview 세 번째 질문 — 같은 고객이 반복되는 data에서 random split은 고객을 train과
 * validation 양쪽에 섞는다. group split은 고객 단위, time split은 시점 단위로 경계를 긋는다.
 * 고객 3명 × 시점 4개와 random 배정 모양은 그림을 위한 가정.
 */
const CUSTOMERS = ["고객 1", "고객 2", "고객 3"] as const;
const PERIODS = ["시점 1", "시점 2", "시점 3", "시점 4"] as const;

type Side = "T" | "V";
const LAYOUTS: readonly (readonly (readonly Side[])[])[] = [
  [
    ["T", "V", "T", "T"],
    ["T", "T", "V", "T"],
    ["V", "T", "T", "V"],
  ],
  [
    ["T", "T", "T", "T"],
    ["V", "V", "V", "V"],
    ["T", "T", "T", "T"],
  ],
  [
    ["T", "T", "T", "V"],
    ["T", "T", "T", "V"],
    ["T", "T", "T", "V"],
  ],
];

const SCENES = [
  { label: "Random split", summary: "세 고객 모두 양쪽에 등장", note: "Row를 무작위로 나누면 같은 고객의 row가 train과 validation에 함께 들어갈 수 있고, 이 그림에서는 세 고객 모두 그렇습니다. 무작위라는 사실만으로 이 관계가 끊기지 않으므로 leakage가 자동으로 사라지지 않습니다." },
  { label: "Group split", summary: "고객 2의 row는 전부 validation", note: "고객 단위로 경계를 그으면 한 고객의 모든 row가 한쪽에만 있습니다. Validation 고객은 training에서 한 번도 보지 않은 고객입니다." },
  { label: "Time split", summary: "시점 4의 row만 validation", note: "시점으로 경계를 그으면 validation row가 모두 training row보다 뒤입니다. 이 그림에서는 같은 고객이 양쪽에 나옵니다. 어느 경계를 쓸지는 배포 단위에 맞춰 정합니다." },
] as const;

export default function SplitBoundaryViz() {
  return (
    <SceneShell
      eyebrow="반복 고객과 split"
      title="같은 고객의 row가 경계 양쪽에 있는지 봅니다"
      description="칸 하나가 고객 한 명의 한 시점 row입니다. T는 train, V는 validation이며 고객 수·시점 수와 무작위 배정 모양은 그림을 위한 가정입니다."
      ariaLabel="random, group, time split에서 고객별 row 배정 비교"
      scenes={SCENES}
      render={(active) => {
        const layout = LAYOUTS[active];
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-[4rem_repeat(4,minmax(0,1fr))] gap-1.5 text-center text-[11px] text-muted-foreground sm:grid-cols-[5rem_repeat(4,minmax(0,1fr))] sm:gap-2">
              <span />
              {PERIODS.map((p) => (
                <span key={p}>{p}</span>
              ))}
            </div>
            <div className="mt-1.5 space-y-1.5 sm:space-y-2">
              {CUSTOMERS.map((c, ci) => {
                const row = layout[ci];
                const mixed = row.includes("T") && row.includes("V");
                return (
                  <div key={c} className="grid grid-cols-[4rem_repeat(4,minmax(0,1fr))] items-center gap-1.5 sm:grid-cols-[5rem_repeat(4,minmax(0,1fr))] sm:gap-2">
                    <span className={`text-xs font-semibold ${mixed && active === 0 ? "text-red-700 dark:text-red-400" : ""}`}>{c}</span>
                    {row.map((side, pi) => (
                      <span
                        key={pi}
                        className={`flex h-9 items-center justify-center rounded-md border font-mono text-sm font-bold ${
                          side === "V" ? "border-amber-600 bg-amber-500/10 text-amber-800 dark:text-amber-300" : "border-border bg-background text-foreground"
                        }`}
                      >
                        {side}
                      </span>
                    ))}
                  </div>
                );
              })}
            </div>
            <p className="mt-3 text-xs leading-5 text-muted-foreground">
              {active === 0 ? "빨간 이름 = train과 validation 양쪽에 row가 있는 고객" : "T = train · V = validation"}
            </p>
          </div>
        );
      }}
    />
  );
}

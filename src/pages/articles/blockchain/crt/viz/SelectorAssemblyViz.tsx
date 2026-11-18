import SceneShell from "./SceneShell";

/**
 * 본문 대응: #numerical — 선택자 70·21·15가 각 기준에서 1 또는 0을 남기고,
 * 2×70+3×21+2×15=233, 233 mod 105=23으로 나머지 2·3·2를 그대로 지킨다.
 * 칸 = 그 수를 3·5·7로 나눈 나머지. 모든 나머지는 아래 MODS로 직접 계산한다.
 */
const MODS = [3, 5, 7] as const;

type Row = { value: number; label: string; note: string; strong?: boolean };

const SCENES: readonly {
  label: string;
  summary: string;
  note: string;
  rows: readonly Row[];
}[] = [
  {
    label: "35에서 70으로",
    summary: "35 × 2 = 70",
    note: "35는 5와 7의 배수라 두 칸이 0입니다. 3으로 나누면 2가 남으므로 역원 2를 곱한 70은 3에서만 1을 남깁니다.",
    rows: [
      { value: 35, label: "35", note: "5×7" },
      { value: 70, label: "70", note: "35×2" },
    ],
  },
  {
    label: "선택자 세 개",
    summary: "70 · 21 · 15",
    note: "21은 3×7이라 5에서만, 15는 3×5라 7에서만 나머지 1이 남습니다. 두 값은 이미 1이라 곱할 역원이 1입니다.",
    rows: [
      { value: 70, label: "70", note: "35×2" },
      { value: 21, label: "21", note: "21×1" },
      { value: 15, label: "15", note: "15×1" },
    ],
  },
  {
    label: "원하는 나머지를 곱해 더함",
    summary: "140 + 63 + 30 = 233",
    note: "각 선택자에 2·3·2를 곱하면 자기 칸에만 그 나머지가 생깁니다. 세 줄을 더해도 다른 칸은 0이라 233의 나머지는 2·3·2입니다.",
    rows: [
      { value: 140, label: "140", note: "2×70" },
      { value: 63, label: "63", note: "3×21" },
      { value: 30, label: "30", note: "2×15" },
      { value: 233, label: "233", note: "세 줄의 합", strong: true },
    ],
  },
  {
    label: "105로 줄임",
    summary: "233 − 210 = 23",
    note: "105는 세 기준 모두의 배수라 빼도 칸이 바뀌지 않습니다. 0 이상 105 미만으로 줄이면 23이 남고 나머지는 그대로 2·3·2입니다.",
    rows: [
      { value: 233, label: "233", note: "앞 장면의 합" },
      { value: 210, label: "−210", note: "105×2를 뺌" },
      { value: 23, label: "23", note: "0~104의 답", strong: true },
    ],
  },
];

const SLOTS = [0, 1, 2, 3] as const;

export default function SelectorAssemblyViz() {
  return (
    <SceneShell
      eyebrow="선택자로 조립"
      title="자기 칸에만 나머지를 남기는 세 값을 더합니다"
      description="한 줄이 한 수이고, 세 칸은 그 수를 3·5·7로 나눈 나머지입니다. 0이 아닌 칸만 진하게 칠했습니다. 7절의 기준 3·5·7과 원하는 나머지 2·3·2를 그대로 씁니다."
      ariaLabel="선택자 70, 21, 15의 나머지와 2×70+3×21+2×15=233, 233을 105로 줄인 23"
      scenes={SCENES}
      render={(active) => {
        const rows = SCENES[active].rows;
        return (
          <div className="min-w-0 text-xs sm:text-sm">
            <div className="grid grid-cols-[minmax(0,1fr)_repeat(3,3rem)] items-center gap-2 px-2 pb-2 text-muted-foreground sm:grid-cols-[minmax(0,1fr)_repeat(3,4.5rem)]">
              <span>수</span>
              {MODS.map((m) => (
                <span key={m} className="text-center font-semibold">÷{m} 나머지</span>
              ))}
            </div>
            <div className="space-y-2">
              {SLOTS.map((slot) => {
                const row = rows[slot];
                const isSum = row?.strong === true;
                return (
                  <div
                    key={slot}
                    className={`grid min-h-[2.75rem] grid-cols-[minmax(0,1fr)_repeat(3,3rem)] items-center gap-2 rounded-lg border px-2 py-1.5 sm:grid-cols-[minmax(0,1fr)_repeat(3,4.5rem)] ${
                      row === undefined ? "border-dashed border-border/40" : isSum ? "border-primary/60 bg-primary/5" : "border-border bg-background"
                    }`}
                  >
                    {row === undefined ? (
                      <span className="col-span-4 text-muted-foreground/40">&nbsp;</span>
                    ) : (
                      <>
                        <span className="min-w-0">
                          <span className="font-mono font-bold">{row.label}</span>
                          <span className="ml-2 text-muted-foreground">{row.note}</span>
                        </span>
                        {MODS.map((m) => {
                          const r = row.value % m;
                          return (
                            <span
                              key={m}
                              className={`rounded-md py-1 text-center font-mono ${
                                r === 0 ? "text-muted-foreground/60" : "bg-primary/15 font-bold text-primary"
                              }`}
                            >
                              {r}
                            </span>
                          );
                        })}
                      </>
                    )}
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

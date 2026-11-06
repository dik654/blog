import SceneShell from "./SceneShell";

/**
 * 본문 대응: #product-boundary — 같은 네 행에서 합·곱을 계산한다. 비중은 각각 1/4.
 * 2X+3Y = 4,5,5,6 → 5. XY = 0,1,1,0 → 1/2 (E[X]E[Y] = 1). XV = 2,0,0,0 → 1/2 (E[X]E[V] = 1/2).
 */
const RECORDS = ["HH", "HT", "TH", "TT"];
const CASES = [
  { first: "X", second: "Y", result: "2X+3Y", a: [2, 1, 1, 0], b: [0, 1, 1, 2], c: ["4", "5", "5", "6"], rowMean: "(4+5+5+6)/4 = 5", split: "2·1 + 3·1 = 5", splitName: "2E[X]+3E[Y]", same: true },
  { first: "X", second: "Y", result: "XY", a: [2, 1, 1, 0], b: [0, 1, 1, 2], c: ["0", "1", "1", "0"], rowMean: "(0+1+1+0)/4 = 1/2", split: "1 × 1 = 1", splitName: "E[X]E[Y]", same: false },
  { first: "X", second: "V", result: "XV", a: [2, 1, 1, 0], b: [1, 0, 0, 1], c: ["2", "0", "0", "0"], rowMean: "(2+0+0+0)/4 = 1/2", split: "1 × 1/2 = 1/2", splitName: "E[X]E[V]", same: true },
] as const;

const SCENES = [
  { label: "합은 나누어도 같다", summary: "5 = 5", note: "앞 절의 합입니다. 각 행의 덧셈을 두 열의 합으로 분배할 수 있어, X와 Y가 독립이 아니어도 평균을 나누어 계산한 값과 같습니다." },
  { label: "곱은 짝이 남는다", summary: "1/2 ≠ 1", note: "X가 큰 행에서는 Y가 작습니다. X=2인 행의 Y는 0이고 X=0인 행의 Y는 2라서 곱이 0이 됩니다. 평균을 먼저 곱하면 이 짝의 관계가 지워집니다." },
  { label: "값이 같아도 독립은 아니다", summary: "1/2 = 1/2 · 그래도 독립 아님", note: "V=(X−1)²에서는 곱의 평균이 맞아떨어집니다. 그러나 X=1이라고 알면 V는 반드시 0이므로 X와 V는 독립이 아닙니다. 등식 하나를 확인했다고 독립을 역으로 결론 내리지 않습니다." },
] as const;

export default function RowPairViz() {
  return (
    <SceneShell
      eyebrow="같은 행의 짝"
      title="합은 열마다 나누어도 되지만 곱은 같은 행의 짝이 결과를 정합니다"
      description="X는 앞면 수, Y=2−X는 뒷면 수입니다. 네 기록의 비중은 각각 1/4로 둔 3절의 가정을 그대로 씁니다."
      ariaLabel="네 기록에서 합, 곱, V와의 곱의 평균을 비교"
      scenes={SCENES}
      render={(index) => {
        const item = CASES[index];
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-[1fr_1fr_1fr_1.4fr] gap-1 text-center font-mono text-sm">
              {["기록", item.first, item.second, item.result].map((head, column) => (
                <span key={column} className={`py-1 text-xs font-bold ${column === 3 ? "text-primary" : "text-muted-foreground"}`}>{head}</span>
              ))}
              {RECORDS.map((record, row) => [
                <span key={`r${row}`} className="rounded-sm bg-muted/30 py-1.5 text-muted-foreground">{record}</span>,
                <span key={`a${row}`} className="rounded-sm border border-border/60 py-1.5">{item.a[row]}</span>,
                <span key={`b${row}`} className="rounded-sm border border-border/60 py-1.5">{item.b[row]}</span>,
                <span key={`c${row}`} className="rounded-sm border border-primary bg-primary/10 py-1.5 font-bold">{item.c[row]}</span>,
              ])}
            </div>
            <div className="mt-3 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
              <div className="rounded-lg border border-primary/60 p-2 sm:p-3">
                <p className="text-xs text-muted-foreground">행마다 계산한 뒤 평균</p>
                <p className="mt-1 font-mono text-xs font-bold sm:text-sm">{item.rowMean}</p>
              </div>
              <span className="text-center font-mono text-lg font-bold" aria-label={item.same ? "같음" : "다름"}>{item.same ? "=" : "≠"}</span>
              <div className="rounded-lg border border-border p-2 sm:p-3">
                <p className="text-xs text-muted-foreground">평균부터 구해 계산 · {item.splitName}</p>
                <p className="mt-1 font-mono text-xs font-bold sm:text-sm">{item.split}</p>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}

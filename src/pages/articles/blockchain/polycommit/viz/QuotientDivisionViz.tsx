import StepSceneShell from "./StepSceneShell";

/**
 * 본문 대응: #case, #commit-open — f(X)=X²+2X+3 (17로 나눈 나머지), 위치 z=4.
 * f−y를 X−4로 조립제법으로 나눈다: 4를 곱해 다음 칸에 더한다.
 * y=10: (1,2,−7) → 1, 2+4=6, −7+24=17≡0 → q=X+6, 나머지 0.
 * y=11: (1,2,−8) → 1, 6, −8+24=16 → 나머지 16.
 */
type Cell = { top: string; add: string; out: string };

const SCENES = [
  {
    label: "f에서 답 10을 뺍니다",
    summary: "X² + 2X + 3 − 10",
    note: "계수를 높은 차수부터 1, 2, 3으로 적고 상수항에서 주장한 답 10을 뺍니다. 3−10=−7이고, 17로 나눈 나머지로는 −7과 10이 같은 수입니다.",
  },
  {
    label: "X−4로 나누기 (답 10)",
    summary: "몫 X+6 · 나머지 0",
    note: "맨 앞 1을 내리고, 4를 곱해 다음 칸에 더합니다. 2+4=6, 다시 6×4=24를 더하면 −7+24=17이고 17로 나누면 0입니다. 나머지가 0이므로 X−4가 인수이고 몫은 X+6입니다. 거꾸로 (X−4)(X+6)=X²+2X−24이고 −24와 −7은 17로 나눈 나머지가 같습니다.",
  },
  {
    label: "답을 11로 바꾸면",
    summary: "나머지 16 · 몫 다항식 없음",
    note: "상수항이 3−11=−8이 됩니다. 같은 과정을 거치면 마지막 칸은 −8+24=16입니다. 나머지가 0이 아니므로 f(X)−11=(X−4)·q(X)를 만족하는 다항식 q가 없습니다. 7절의 f(4)−11=−1≡16과 같은 값입니다.",
  },
] as const;

const COLUMNS = ["X²", "X", "상수"] as const;

const TABLES: readonly (readonly Cell[])[] = [
  [
    { top: "1", add: "", out: "" },
    { top: "2", add: "", out: "" },
    { top: "3 − 10 = −7", add: "", out: "" },
  ],
  [
    { top: "1", add: "", out: "1" },
    { top: "2", add: "+ 1×4 = 4", out: "6" },
    { top: "−7", add: "+ 6×4 = 24", out: "17 ≡ 0" },
  ],
  [
    { top: "1", add: "", out: "1" },
    { top: "2", add: "+ 1×4 = 4", out: "6" },
    { top: "−8", add: "+ 6×4 = 24", out: "16" },
  ],
];

const RESULT: readonly { quotient: string; remainder: string; ok: boolean | null }[] = [
  { quotient: "아직 나누기 전", remainder: "−7 ≡ 10", ok: null },
  { quotient: "q = X + 6", remainder: "0", ok: true },
  { quotient: "다항식 몫 없음", remainder: "16", ok: false },
];

function Table({ active }: { active: number }) {
  const cells = TABLES[active];
  const result = RESULT[active];
  const rows: readonly { name: string; key: keyof Cell }[] = [
    { name: active === 2 ? "f − 11" : "f − 10", key: "top" },
    { name: "4를 곱해 더함", key: "add" },
    { name: "결과", key: "out" },
  ];
  return (
    <div className="min-w-0">
      <div className="grid grid-cols-[5.5rem_repeat(3,minmax(0,1fr))] gap-x-2 border-b border-border pb-1 text-[11px] text-muted-foreground">
        <span>z = 4</span>
        {COLUMNS.map((name) => (
          <span key={name} className="text-center">{name}</span>
        ))}
      </div>
      {rows.map((row) => (
        <div
          key={row.key}
          className={`grid min-h-10 grid-cols-[5.5rem_repeat(3,minmax(0,1fr))] items-center gap-x-2 border-b border-border/50 text-xs ${
            row.key === "out" ? "font-bold" : ""
          }`}
        >
          <span className="text-muted-foreground">{row.name}</span>
          {cells.map((cell, index) => {
            const isRemainder = row.key === "out" && index === 2 && cell.out !== "";
            const tone = isRemainder ? (result.ok ? "border-emerald-600 text-emerald-700 dark:text-emerald-400" : "border-red-600 text-red-700 dark:text-red-400") : "border-transparent";
            return (
              <span key={index} className={`rounded-md border px-1 py-1 text-center font-mono ${tone}`}>
                {cell[row.key] || "·"}
              </span>
            );
          })}
        </div>
      ))}
      <div className="mt-3 grid grid-cols-2 gap-2 text-center text-xs">
        <div className="rounded-md border border-border px-2 py-2">
          <span className="block text-muted-foreground">몫</span>
          <span className="block font-mono font-bold">{result.quotient}</span>
        </div>
        <div
          className={`rounded-md border px-2 py-2 ${
            result.ok === null ? "border-border" : result.ok ? "border-emerald-600/60" : "border-red-600/60"
          }`}
        >
          <span className="block text-muted-foreground">{result.ok === null ? "상수항 (17로 나눈 나머지)" : "나머지"}</span>
          <span className="block font-mono font-bold">{result.remainder}</span>
        </div>
      </div>
    </div>
  );
}

export default function QuotientDivisionViz() {
  return (
    <StepSceneShell
      eyebrow="몫이 생기는가"
      title="f(X)−y를 X−4로 나누면 답 10만 나머지가 0입니다"
      description="모든 계산은 17로 나눈 나머지에서 합니다(≡는 17로 나눈 나머지가 같다는 뜻). 칸은 높은 차수부터 X², X, 상수항의 계수입니다. 숫자는 이 글의 설명용 가정입니다."
      ariaLabel="f(X)−10과 f(X)−11을 X−4로 조립제법 나눗셈한 결과 비교"
      scenes={SCENES}
      render={(active) => <Table active={active} />}
    />
  );
}

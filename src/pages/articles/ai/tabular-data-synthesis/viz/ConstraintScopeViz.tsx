import SceneShell from "./SceneShell";

/**
 * 본문 대응: #constraints — range rule은 column 하나, relational rule은 여러 column,
 * temporal rule은 같은 entity의 row sequence를 본다. hard constraint를 어긴 row는
 * generator score와 무관하게 release하지 않는다.
 * 표의 네 row와 세 rule의 식·허용 오차는 설명용 가정이다.
 * r3: 종료 04-02 < 시작 05-10 → relational 실패.
 * r4: 같은 고객 C1의 앞 계약 종료 03-31보다 시작 03-15가 빠름 → temporal 실패.
 */
type Cell = "age" | "start" | "end";
type Verdict = "pass" | "fail" | "skip";
type RuleScene = {
  label: string;
  summary: string;
  note: string;
  cells: readonly Cell[];
  rows: readonly string[];
  verdicts: readonly Verdict[];
  ledger: readonly string[];
};

const ROWS = [
  { id: "r1", cust: "C1", age: "34", start: "01-05", end: "03-31" },
  { id: "r2", cust: "C2", age: "51", start: "02-01", end: "06-30" },
  { id: "r3", cust: "C3", age: "27", start: "05-10", end: "04-02" },
  { id: "r4", cust: "C1", age: "34", start: "03-15", end: "08-31" },
] as const;

const SCENES: readonly RuleScene[] = [
  {
    label: "Range rule",
    summary: "column 하나만 봅니다",
    note: "나이 column 하나만 보고 범위를 확인합니다. 네 row 모두 통과합니다. 하지만 r3과 r4에도 문제가 남아 있다는 것을 이 rule로는 알 수 없습니다.",
    cells: ["age"],
    rows: ["r1", "r2", "r3", "r4"],
    verdicts: ["pass", "pass", "pass", "pass"],
    ledger: ["18 ≤ 나이 ≤ 99", "모든 row", "0", "row 거부"],
  },
  {
    label: "Relational rule",
    summary: "한 row의 여러 column",
    note: "같은 row의 시작일과 종료일을 함께 봅니다. r3은 나이 범위를 통과했지만 종료일 04-02가 시작일 05-10보다 빨라서 실패합니다.",
    cells: ["start", "end"],
    rows: ["r1", "r2", "r3", "r4"],
    verdicts: ["pass", "pass", "fail", "pass"],
    ledger: ["시작 ≤ 종료", "모든 row", "0일", "row 거부"],
  },
  {
    label: "Temporal rule",
    summary: "같은 고객의 row 순서",
    note: "고객 C1의 두 row를 시간 순서로 이어 봅니다. r4는 혼자 보면 시작 ≤ 종료라 통과지만, 앞 계약이 03-31에 끝나기 전인 03-15에 시작해서 실패합니다. C2와 C3은 row가 하나라 비교할 앞 row가 없습니다.",
    cells: ["start", "end"],
    rows: ["r1", "r4"],
    verdicts: ["pass", "skip", "skip", "fail"],
    ledger: ["다음 시작 ≥ 앞 종료", "고객별 row 묶음", "0일", "뒤 row 거부"],
  },
  {
    label: "Release",
    summary: "4 row 중 2 row만 학습 입력",
    note: "Generator score가 높게 나왔더라도(가정) hard constraint 하나라도 어긴 r3과 r4는 training input으로 release하지 않습니다. 남는 것은 세 rule을 모두 통과한 r1과 r2입니다.",
    cells: [],
    rows: [],
    verdicts: ["pass", "pass", "fail", "fail"],
    ledger: [],
  },
];

const LEDGER_FIELDS = ["식", "적용 entity", "허용 오차", "failure action"] as const;
const COLS = "grid grid-cols-[1.8rem_2.2rem_2.2rem_minmax(0,1fr)_minmax(0,1fr)_4rem] gap-px";

function verdictText(verdict: Verdict, release: boolean) {
  if (verdict === "skip") return "해당 없음";
  if (release) return verdict === "pass" ? "release" : "거부";
  return verdict === "pass" ? "통과" : "실패";
}

export default function ConstraintScopeViz() {
  return (
    <SceneShell
      eyebrow="Rule이 보는 칸"
      title="같은 표에서 세 rule은 서로 다른 칸을 봅니다"
      description="표는 계약 row 네 개짜리 설명용 synthetic table이고, 날짜는 월-일입니다(가정). 진하게 표시된 칸이 현재 rule이 읽는 칸입니다."
      ariaLabel="range, relational, temporal rule이 synthetic table에서 읽는 칸과 release 판정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const release = active === 3;
        const watched = (rowId: string, cell: Cell) => scene.rows.includes(rowId) && scene.cells.includes(cell);
        const cellClass = (rowId: string, cell: Cell) =>
          watched(rowId, cell) ? "bg-primary/15 font-bold text-foreground" : "bg-background text-muted-foreground";
        return (
          <div className="min-w-0 space-y-4">
            <div className="min-w-0 overflow-hidden rounded-md border border-border bg-border text-center text-xs">
              <div className={`${COLS} text-[11px] font-bold`}>
                {(["row", "고객", "나이", "시작", "종료", "판정"] as const).map((head) => (
                  <div key={head} className={`px-0.5 py-1.5 ${head === "나이" && active === 0 ? "bg-primary/15" : "bg-muted"}`}>{head}</div>
                ))}
              </div>
              {ROWS.map((row, index) => {
                const verdict = scene.verdicts[index];
                const linked = active === 2 && row.cust === "C1";
                return (
                  <div key={row.id} className={`${COLS} border-t border-border font-mono`}>
                    <div className="bg-background px-0.5 py-2">{row.id}</div>
                    <div className={`px-0.5 py-2 ${linked ? "bg-primary/15 font-bold text-foreground" : "bg-background"}`}>{row.cust}</div>
                    <div className={`px-0.5 py-2 ${cellClass(row.id, "age")}`}>{row.age}</div>
                    <div className={`px-0.5 py-2 ${cellClass(row.id, "start")}`}>{row.start}</div>
                    <div className={`px-0.5 py-2 ${cellClass(row.id, "end")}`}>{row.end}</div>
                    <div
                      className={`flex items-center justify-center px-0.5 py-2 font-sans text-[11px] font-bold ${
                        verdict === "fail"
                          ? "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400"
                          : verdict === "pass"
                            ? "bg-background text-emerald-700 dark:text-emerald-400"
                            : "bg-background text-muted-foreground"
                      }`}
                    >
                      {verdict === "fail" ? "✕ " : verdict === "pass" ? "✓ " : ""}
                      {verdictText(verdict, release)}
                    </div>
                  </div>
                );
              })}
              <div className="border-t border-border bg-background px-2 py-1.5 text-left text-[11px] text-muted-foreground">
                {active === 2 ? "C1 묶음: r1(01-05~03-31) → r4(03-15~08-31)" : "고객 C1은 r1과 r4, 두 row를 가집니다."}
              </div>
            </div>
            <div className="grid min-h-[5.5rem] grid-cols-2 gap-px overflow-hidden rounded-md border border-border bg-border text-xs sm:grid-cols-4">
              {LEDGER_FIELDS.map((field, index) => (
                <div key={field} className="bg-background px-2 py-2">
                  <p className="text-[11px] text-muted-foreground">{field}{release ? "" : " (가정)"}</p>
                  <p className="mt-1 break-keep font-semibold">
                    {release ? (index === 0 ? "세 rule 모두 통과" : index === 3 ? "한 rule이라도 실패하면 제외" : "—") : scene.ledger[index]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}

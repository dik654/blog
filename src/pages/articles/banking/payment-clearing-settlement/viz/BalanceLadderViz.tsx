import SceneShell, { type ShellScene } from "./SceneShell";

/**
 * 본문 대응: #rtgs-vs-dns — 잔액을 지시 한 건마다 적는다.
 * 고정 순서·A100 B20 C0: (0,120,0)(90,30,0)(90,0,30)(90,20,10)(80,20,20)(90,20,10), 합 120.
 * 고정 순서·A100 B0 C0: (0,100,0)(90,10,0) 다음 ③ 30은 B 10으로 처리하지 못한다.
 * 바꾼 순서·A100 B0 C0: ①(0,100,0) ③(0,70,30) ④(0,90,10) ②(90,0,10) ⑤(80,0,20) ⑥(90,0,10), 합 100.
 */
interface Row {
  label: string;
  balances: readonly [number, number, number] | null;
  blocked?: string;
}

interface LadderScene extends ShellScene {
  rows: readonly Row[];
}

const SCENES: readonly LadderScene[] = [
  {
    label: "고정 순서",
    summary: "최초 합 120",
    note: "받은 돈을 다시 써서 음수 없이 모두 처리됩니다. ③을 처리한 순간 B의 잔액이 0입니다.",
    rows: [
      { label: "처음", balances: [100, 20, 0] },
      { label: "① A→B 100", balances: [0, 120, 0] },
      { label: "② B→A 90", balances: [90, 30, 0] },
      { label: "③ B→C 30", balances: [90, 0, 30] },
      { label: "④ C→B 20", balances: [90, 20, 10] },
      { label: "⑤ A→C 10", balances: [80, 20, 20] },
      { label: "⑥ C→A 10", balances: [90, 20, 10] },
    ],
  },
  {
    label: "B의 20을 빼면",
    summary: "③에서 멈춤: B 10 < 30",
    note: "B의 처음 20만 없앴습니다. ②까지 지나면 B는 10뿐이라 ③을 보내지 못하고, 순서를 고정한 이 표에서는 뒤 세 건이 기다립니다.",
    rows: [
      { label: "처음", balances: [100, 0, 0] },
      { label: "① A→B 100", balances: [0, 100, 0] },
      { label: "② B→A 90", balances: [90, 10, 0] },
      { label: "③ B→C 30", balances: null, blocked: "처리 못 함" },
      { label: "④ C→B 20", balances: null, blocked: "차례 대기" },
      { label: "⑤ A→C 10", balances: null, blocked: "차례 대기" },
      { label: "⑥ C→A 10", balances: null, blocked: "차례 대기" },
    ],
  },
  {
    label: "순서를 바꾸면",
    summary: "최초 합 100",
    note: "③·④를 ②보다 먼저 처리하면 B가 90을 모아 A에게 보냅니다. 100 지시를 실행할 순간 어느 은행이 100을 가져야 하므로 이 모형에서는 100이 하한입니다.",
    rows: [
      { label: "처음", balances: [100, 0, 0] },
      { label: "① A→B 100", balances: [0, 100, 0] },
      { label: "③ B→C 30", balances: [0, 70, 30] },
      { label: "④ C→B 20", balances: [0, 90, 10] },
      { label: "② B→A 90", balances: [90, 0, 10] },
      { label: "⑤ A→C 10", balances: [80, 0, 20] },
      { label: "⑥ C→A 10", balances: [90, 0, 10] },
    ],
  },
];

const AXIS_MAX = 120;
const BANKS = ["A", "B", "C"];

function Cell({ value }: { value: number }) {
  return (
    <div className="min-w-0">
      <span className="block text-right font-mono text-xs font-semibold tabular-nums">{value}</span>
      <div className="mt-0.5 h-1.5 rounded-sm bg-muted/50">
        <div className="h-full rounded-sm" style={{ width: `${(value / AXIS_MAX) * 100}%`, backgroundColor: value === 0 ? "transparent" : "#2563eb" }} />
      </div>
    </div>
  );
}

export default function BalanceLadderViz() {
  return (
    <SceneShell
      eyebrow="건별 잔액"
      title="지시 한 건마다 세 은행의 잔액이 어떻게 바뀌는지 적습니다"
      description="한 줄이 지시 한 건을 처리한 직후의 잔액(억 원)입니다. 막대 눈금은 120까지로 같고, 추가 차입·분할이 없는 설명용 모형입니다."
      ariaLabel="세 가지 조건에서 지시별 잔액 변화"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-[6rem_repeat(3,minmax(0,1fr))] gap-x-2 text-xs font-semibold text-muted-foreground sm:grid-cols-[8rem_repeat(3,minmax(0,1fr))]">
              <span>지시</span>
              {BANKS.map((bank) => (
                <span key={bank} className="text-right">
                  {bank}
                </span>
              ))}
            </div>
            <div className="mt-1">
              {scene.rows.map((row) => (
                <div key={row.label} className="grid min-h-7 grid-cols-[6rem_repeat(3,minmax(0,1fr))] items-center gap-x-2 border-t border-border/60 pt-1 sm:grid-cols-[8rem_repeat(3,minmax(0,1fr))]">
                  <span className={`text-xs ${row.balances ? "" : "text-muted-foreground"}`}>{row.label}</span>
                  {row.balances ? (
                    row.balances.map((value, index) => <Cell key={BANKS[index]} value={value} />)
                  ) : (
                    <span className={`col-span-3 text-center text-xs ${row.blocked === "처리 못 함" ? "font-bold text-red-700 dark:text-red-400" : "text-muted-foreground"}`}>{row.blocked}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}

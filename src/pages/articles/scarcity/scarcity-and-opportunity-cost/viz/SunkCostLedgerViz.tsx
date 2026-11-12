import SceneShell from "./SceneShell";

/**
 * 본문 대응: #sunk — 재료비 30을 이미 치렀고 돌려받을 수 없다. 구우면 5가 더 들고 20을 받는다.
 * 굽는다: −30 −5 +20 = −15, 굽지 않는다: −30. 공통 −30을 지우면 +15 대 0.
 * 접힌 설명의 환급 경우: 그만두면 10을 돌려받는다. 여기에 앞 예의 5와 20을 그대로 쓰는 것은 가정입니다.
 * 계속: −30 −5 +20 = −15, 그만둠: −30 +10 = −20. 공통 −20을 지우면 계속은 −10 −5 +20 = +5 대 0.
 */
const PAID = 30;
const MORE = 5;
const GET = 20;
const REFUND = 10;
const COMMON = PAID - REFUND;

/** 한 줄 = 항목 하나. a는 왼쪽 선택, b는 오른쪽 선택에 적히는 값. struck이면 양쪽에 같아 지운 줄. */
type Line = { label: string; a: number; b: number; struck?: boolean; costA?: boolean };
type Step = { left: string; right: string; lines: readonly Line[] };

const STEPS: readonly Step[] = [
  {
    left: "굽는다",
    right: "굽지 않는다",
    lines: [
      { label: "이미 낸 재료비", a: -PAID, b: -PAID },
      { label: "더 드는 것", a: -MORE, b: 0 },
      { label: "받는 것", a: GET, b: 0 },
    ],
  },
  {
    left: "굽는다",
    right: "굽지 않는다",
    lines: [
      { label: "이미 낸 재료비", a: -PAID, b: -PAID, struck: true },
      { label: "더 드는 것", a: -MORE, b: 0 },
      { label: "받는 것", a: GET, b: 0 },
    ],
  },
  {
    left: "계속한다",
    right: "그만둔다",
    lines: [
      { label: "이미 낸 돈", a: -PAID, b: -PAID },
      { label: "돌려받는 것", a: 0, b: REFUND },
      { label: "더 드는 것", a: -MORE, b: 0 },
      { label: "받는 것", a: GET, b: 0 },
    ],
  },
  {
    left: "계속한다",
    right: "그만둔다",
    lines: [
      { label: "양쪽에서 사라진 몫", a: -COMMON, b: -COMMON, struck: true },
      { label: "포기한 환급", a: -REFUND, b: 0, costA: true },
      { label: "더 드는 것", a: -MORE, b: 0 },
      { label: "받는 것", a: GET, b: 0 },
    ],
  },
];

const ROWS = 4;
const SCALE = 30;

const total = (step: Step, side: "a" | "b") =>
  step.lines.filter((l) => !l.struck).reduce<number>((acc, l) => acc + l[side], 0);
const TOTALS = STEPS.map((s) => [total(s, "a"), total(s, "b")] as const);
const fmt = (n: number) => (n < 0 ? `−${-n}` : n > 0 ? `+${n}` : "0");

const SCENES = [
  {
    label: "두 줄을 나란히 적습니다",
    summary: `${fmt(TOTALS[0][0])} 대 ${fmt(TOTALS[0][1])}`,
    note: `굽으면 −${PAID} − ${MORE} + ${GET} = ${fmt(TOTALS[0][0])}, 굽지 않으면 ${fmt(TOTALS[0][1])}입니다. 굽는 쪽도 손해지만 굽지 않는 쪽의 손해가 더 큽니다.`,
  },
  {
    label: "양쪽에 같은 30을 지웁니다",
    summary: `${fmt(TOTALS[1][0])} 대 ${fmt(TOTALS[1][1])}`,
    note: `${PAID}은 두 칸 모두에 적혀 있어 어느 쪽을 골라도 똑같이 사라집니다. 지워도 굽는 쪽이 ${TOTALS[1][0] - TOTALS[1][1]}만큼 낫다는 차이는 그대로입니다.`,
  },
  {
    label: "그만두면 10을 돌려받는다면",
    summary: `${fmt(TOTALS[2][0])} 대 ${fmt(TOTALS[2][1])} (가정)`,
    note: `아래 접힌 설명의 첫 경우입니다. 그만두면 ${REFUND}을 돌려받습니다. 계속할 때의 ${MORE}와 ${GET}은 앞 예의 숫자를 그대로 쓴 가정입니다.`,
  },
  {
    label: "환급 10은 계속하는 쪽의 비용",
    summary: `${fmt(TOTALS[3][0])} 대 ${fmt(TOTALS[3][1])} (가정)`,
    note: `양쪽에서 똑같이 사라진 것은 ${COMMON}뿐이라 그것만 지웁니다. 계속하면 돌려받을 ${REFUND}을 포기하므로 그 ${REFUND}이 계속하는 쪽의 비용이 됩니다.`,
  },
] as const;

function Cell({ value, struck, cost }: { value: number; struck?: boolean; cost?: boolean }) {
  const color = struck ? "#94a3b8" : cost ? "#d97706" : value < 0 ? "#dc2626" : value > 0 ? "#16a34a" : "#94a3b8";
  const width = (Math.abs(value) / SCALE) * 100;
  return (
    <div className="min-w-0">
      <span className={`block text-right font-mono text-sm ${struck ? "text-muted-foreground line-through" : "font-semibold"}`}>{fmt(value)}</span>
      <div className="mt-0.5 h-1.5 min-w-0 rounded-sm bg-muted/40">
        <div className="ml-auto h-full rounded-sm" style={{ width: `${width}%`, backgroundColor: color, opacity: struck ? 0.4 : 0.85 }} />
      </div>
    </div>
  );
}

export default function SunkCostLedgerViz() {
  return (
    <SceneShell
      eyebrow="이미 나간 돈"
      title="두 칸에 똑같이 적힌 값은 비교에서 지워집니다"
      description="한 줄이 항목 하나이고, 왼쪽·오른쪽 칸이 두 선택입니다. 회색 줄은 양쪽에 같아서 지운 값입니다."
      ariaLabel="이미 낸 재료비 30을 두 선택에서 지우는 비교와 일부 환급 경우"
      scenes={SCENES}
      render={(active) => {
        const step = STEPS[active];
        return (
          <div className="min-w-0 rounded-lg border border-border/70 p-3 text-xs sm:text-sm">
            <div className="grid grid-cols-[minmax(0,1fr)_5rem_5rem] gap-x-3 border-b border-border/60 pb-2 font-bold sm:grid-cols-[minmax(0,1fr)_7rem_7rem]">
              <span className="text-muted-foreground">항목</span>
              <span className="text-right">{step.left}</span>
              <span className="text-right">{step.right}</span>
            </div>
            {Array.from({ length: ROWS }, (_, i) => {
              const line = step.lines[i];
              return (
                <div key={i} className="grid h-9 grid-cols-[minmax(0,1fr)_5rem_5rem] items-center gap-x-3 sm:grid-cols-[minmax(0,1fr)_7rem_7rem]">
                  {line ? (
                    <>
                      <span className={line.struck ? "text-muted-foreground line-through" : line.costA ? "font-semibold text-[#b45309]" : ""}>{line.label}</span>
                      <Cell value={line.a} struck={line.struck} cost={line.costA} />
                      <Cell value={line.b} struck={line.struck} />
                    </>
                  ) : null}
                </div>
              );
            })}
            <div className="grid grid-cols-[minmax(0,1fr)_5rem_5rem] items-baseline gap-x-3 border-t border-border/60 pt-2 sm:grid-cols-[minmax(0,1fr)_7rem_7rem]">
              <span className="text-muted-foreground">{step.lines.some((l) => l.struck) ? "지우고 남은 합" : "합계"}</span>
              <span className="text-right font-mono text-sm font-bold">{fmt(TOTALS[active][0])}</span>
              <span className="text-right font-mono text-sm font-bold">{fmt(TOTALS[active][1])}</span>
            </div>
          </div>
        );
      }}
    />
  );
}

import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture — 각 100인 두 회사, 개별 부도 10%, 회수 40%(가정).
 * 칸 100개 = 똑같이 일어날 법한 1년 결과 100개(칸 하나 1%).
 * 독립: 둘 다 1, A만 9, B만 9, 둘 다 생존 81 → 손실 0:81%, 60:18%, 120:1%. 기대손실 18%×60+1%×120=12.
 * 늘 함께: 둘 다 10, 생존 90 → 0:90%, 120:10%. 기대손실 10%×120=12.
 */
type Outcome = "none" | "a" | "b" | "both";

const LOSS_ONE = 100 * 0.6;
const LOSS_BOTH = 2 * LOSS_ONE;

const independent = (row: number, col: number): Outcome => (row === 0 && col === 0 ? "both" : col === 0 ? "a" : row === 0 ? "b" : "none");
// A의 부도 칸(왼쪽 첫 열)을 그대로 두고 B가 그 10칸으로 옮겨 와 겹친다.
const together = (_row: number, col: number): Outcome => (col === 0 ? "both" : "none");

const COLORS: Record<Outcome, string> = { none: "#e2e8f0", a: "#d97706", b: "#2563eb", both: "#dc2626" };

const DIST = [
  { name: "독립", zero: 81, one: 18, two: 1 },
  { name: "늘 함께", zero: 90, one: 0, two: 10 },
] as const;
const expectedLoss = (row: (typeof DIST)[number]) => (row.one * LOSS_ONE + row.two * LOSS_BOTH) / 100;

const SCENES = [
  {
    label: "서로 독립일 때",
    summary: "둘 다 부도 1칸 = 1%",
    note: "칸 하나는 똑같이 일어날 법한 1년 결과 하나(1%)입니다. 회사 A는 왼쪽 첫 열 10칸에서, 회사 B는 맨 윗줄 10칸에서 부도납니다. 둘이 서로 상관없으면 두 줄이 겹치는 칸은 왼쪽 위 1칸뿐이라 둘 다 부도날 확률은 10%×10%=1%입니다.",
  },
  {
    label: "늘 함께 무너질 때",
    summary: "둘 다 부도 10칸 = 10%",
    note: "두 회사가 완전히 같은 충격에 움직이면 A가 부도나는 왼쪽 첫 열 10칸에서 B도 부도납니다. 각 회사의 부도 칸은 여전히 10칸(10%)이지만, 그 10칸이 전부 겹쳐 둘 다 부도가 10%가 됩니다.",
  },
  {
    label: "평균은 같고 꼬리가 다름",
    summary: `기대손실 둘 다 ${expectedLoss(DIST[0])} · 120 손실 1% → 10%`,
    note: `독립이면 60을 잃는 칸이 18개, 120을 잃는 칸이 1개라 기대손실은 18%×60+1%×120=${expectedLoss(DIST[0])}입니다. 늘 함께면 120을 잃는 칸 10개뿐이라 10%×120=${expectedLoss(DIST[1])}입니다. 평균은 같은데 한 번에 120을 잃을 확률이 1%에서 10%로 커집니다.`,
  },
] as const;

const CELL = 15;
const GAP = 2;
const GRID = 10 * CELL + 9 * GAP;

function DistBar({ row, show }: { row: (typeof DIST)[number]; show: boolean }) {
  const parts = [
    { key: "zero", value: row.zero, color: COLORS.none, label: "0" },
    { key: "one", value: row.one, color: "#64748b", label: "60" },
    { key: "two", value: row.two, color: COLORS.both, label: "120" },
  ];
  return (
    <div className={`transition-opacity duration-300 motion-reduce:transition-none ${show ? "opacity-100" : "opacity-25"}`}>
      <div className="flex items-baseline justify-between text-xs">
        <span className="font-bold">{row.name}</span>
        <span className="font-mono text-muted-foreground">기대손실 {expectedLoss(row)}</span>
      </div>
      <div className="mt-1 flex h-5 overflow-hidden rounded-sm border border-border">
        {parts.map((part) => (part.value > 0 ? <div key={part.key} style={{ width: `${part.value}%`, backgroundColor: part.color }} /> : null))}
      </div>
      <p className="mt-1 font-mono text-[11px] leading-5 text-muted-foreground">
        손실 0: {row.zero}% · 60: {row.one}% · 120: {row.two}%
      </p>
    </div>
  );
}

export default function JointDefaultGridViz() {
  return (
    <SceneShell
      eyebrow="함께 무너지는 정도"
      title="개별 부도 10%는 같아도 둘 다 부도는 1%에서 10%까지 달라집니다"
      description="4절의 가정: 각 100인 회사 A·B, 1년 부도확률 각 10%, 회수 40%라 한 회사 부도 손실은 60입니다. 칸 100개를 똑같이 일어날 법한 1년 결과로 두고 칸 하나를 1%로 셉니다(설명용)."
      ariaLabel="10×10 칸으로 본 두 회사의 독립 부도와 완전 동시 부도, 손실 분포와 기대손실"
      scenes={SCENES}
      render={(active) => {
        const outcome = (row: number, col: number) => (active === 0 ? independent(row, col) : together(row, col));
        return (
          <div className="mx-auto flex max-w-[30rem] items-start gap-4 sm:gap-6">
            <div className="w-[40%] max-w-[168px] shrink-0">
              <svg viewBox={`0 0 ${GRID} ${GRID}`} className="h-auto w-full" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
                {Array.from({ length: 100 }, (_, index) => {
                  const row = Math.floor(index / 10);
                  const col = index % 10;
                  const kind = outcome(row, col);
                  return <rect key={index} x={col * (CELL + GAP)} y={row * (CELL + GAP)} width={CELL} height={CELL} rx={2} fill={COLORS[kind]} />;
                })}
              </svg>
              <p className="mt-2 text-[11px] leading-5 text-muted-foreground">칸 색 = 부도한 회사 · 손실</p>
              <ul className="space-y-0.5 text-[11px] leading-5 text-muted-foreground">
                <li><span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: COLORS.a }} />A만 · 60</li>
                <li><span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: COLORS.b }} />B만 · 60</li>
                <li><span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: COLORS.both }} />둘 다 · 120</li>
                <li><span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm border border-border" style={{ backgroundColor: COLORS.none }} />없음 · 0</li>
              </ul>
            </div>
            <div className="min-w-0 flex-1 space-y-4">
              <p className="text-xs leading-5 text-muted-foreground">손실 분포(막대 전체 = 100%) · 회색 0 · 짙은 회색 60 · 빨강 120</p>
              <DistBar row={DIST[0]} show={active !== 1} />
              <DistBar row={DIST[1]} show={active !== 0} />
            </div>
          </div>
        );
      }}
    />
  );
}

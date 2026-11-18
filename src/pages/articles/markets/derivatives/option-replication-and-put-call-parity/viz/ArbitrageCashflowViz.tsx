import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 복제 조합 비용 10, 만기 20 또는 0.
 * 콜이 14면: 복제 매수 −10, 콜 매도 +14 → 오늘 +4, 만기 상승 20−20=0, 하락 0−0=0.
 * 콜이 7이면: 본문은 "콜 매수·복제 매도 방향을 생각할 수 있다"까지만 말함. 10−7=3은 산술.
 */
type Cell = number | null;
interface Row {
  name: string;
  today: Cell;
  up: Cell;
  down: Cell;
}

const SCENES: readonly { label: string; summary: string; note: string; rows: readonly Row[] }[] = [
  {
    label: "복제 조합을 10에 삽니다",
    summary: "오늘 −10 · 만기 +20 / 0",
    note: "주식 반 주를 사고 40을 빌리는 데 내 돈 10이 듭니다. 만기에는 2·3절대로 상승 20, 하락 0이 들어옵니다.",
    rows: [{ name: "복제 조합 매수", today: -10, up: 20, down: 0 }],
  },
  {
    label: "콜을 시장가 14에 팝니다",
    summary: "오늘 +14 · 만기 −20 / 0",
    note: "콜을 팔면 오늘 14를 받는 대신, 만기에 주가가 120이면 산 사람에게 20을 내줄 의무가 생깁니다. 주가가 80이면 행사되지 않아 내줄 돈이 없습니다.",
    rows: [
      { name: "복제 조합 매수", today: -10, up: 20, down: 0 },
      { name: "콜 매도", today: 14, up: -20, down: 0 },
    ],
  },
  {
    label: "합치면 오늘 4가 남습니다",
    summary: "오늘 +4 · 만기 0 / 0",
    note: "만기에는 복제 조합이 준 돈으로 판 콜의 의무를 정확히 갚아 두 상태 모두 0입니다. 미래 위험 없이 오늘 4가 남으므로, 이런 주문이 몰리면 콜 14와 복제 10의 차이가 유지되기 어렵습니다.",
    rows: [
      { name: "복제 조합 매수", today: -10, up: 20, down: 0 },
      { name: "콜 매도", today: 14, up: -20, down: 0 },
      { name: "합계", today: 4, up: 0, down: 0 },
    ],
  },
  {
    label: "콜이 7이면 방향이 뒤집힙니다",
    summary: "콜 매수 · 복제 매도",
    note: "본문은 이때 콜을 사고 비싼 복제 조합을 파는 방향을 생각할 수 있다고만 말합니다. 복제 조합을 실제로 10에 팔 수 있다고 두면(가정) 오늘 10−7=3이 남고, 만기에는 콜로 받은 돈을 복제 매도분에 넘겨 0이 됩니다.",
    rows: [
      { name: "콜 매수", today: -7, up: 20, down: 0 },
      { name: "복제 조합 매도 (가정)", today: 10, up: -20, down: 0 },
      { name: "합계", today: 3, up: 0, down: 0 },
    ],
  },
];

const SLOTS = [0, 1, 2] as const;

function Amount({ value, strong }: { value: Cell; strong: boolean }) {
  if (value === null) return <span className="text-muted-foreground">−</span>;
  const color = value > 0 ? "text-[#15803d] dark:text-[#4ade80]" : value < 0 ? "text-[#b91c1c] dark:text-[#f87171]" : "text-muted-foreground";
  const text = value > 0 ? `+${value}` : value < 0 ? `−${Math.abs(value)}` : "0";
  return <span className={`font-mono ${strong ? "text-base font-bold" : "text-sm"} ${color}`}>{text}</span>;
}

function CashGrid({ scene }: { scene: number }) {
  const rows = SCENES[scene].rows;
  return (
    <div className="min-w-0" role="img" aria-label={`${SCENES[scene].label}: ${SCENES[scene].summary}`}>
      <div className="grid grid-cols-[minmax(0,1.6fr)_repeat(3,minmax(0,1fr))] gap-x-2 border-b border-border pb-2 text-center text-xs font-semibold text-muted-foreground">
        <span className="text-left">거래</span>
        <span>오늘</span>
        <span>만기 · 주가 120</span>
        <span>만기 · 주가 80</span>
      </div>
      {SLOTS.map((slot) => {
        const row = rows[slot];
        const isTotal = row?.name === "합계";
        return (
          <div
            key={slot}
            className={`grid min-h-[3rem] grid-cols-[minmax(0,1.6fr)_repeat(3,minmax(0,1fr))] items-center gap-x-2 text-center ${isTotal ? "border-t border-[#2563eb]" : "border-b border-border/50"}`}
          >
            {row ? (
              <>
                <span className={`text-left text-xs leading-5 sm:text-sm ${isTotal ? "font-bold" : ""}`}>{row.name}</span>
                <Amount value={row.today} strong={isTotal} />
                <Amount value={row.up} strong={isTotal} />
                <Amount value={row.down} strong={isTotal} />
              </>
            ) : (
              <span className="col-span-4 text-left text-xs text-muted-foreground/50">·</span>
            )}
          </div>
        );
      })}
      <p className="mt-2 text-xs text-muted-foreground">+는 내 손에 들어오는 돈, −는 나가는 돈입니다. 금리 0이라 오늘과 만기 금액을 그대로 더합니다.</p>
    </div>
  );
}

export default function ArbitrageCashflowViz() {
  return (
    <SceneShell
      eyebrow="가격이 어긋날 때"
      title="콜이 14면 미래 위험 없이 오늘 4가 남습니다"
      description="열은 돈이 오가는 시점과 상태, 줄은 거래 하나입니다. 콜을 14에 판다는 것은 오늘 14를 받고 만기에 주가가 행사가격 100을 넘은 만큼 내줄 의무를 지는 것입니다."
      ariaLabel="콜이 복제 비용보다 비쌀 때와 쌀 때 오늘과 만기의 현금 흐름"
      scenes={SCENES}
      render={(index) => <CashGrid scene={index} />}
    />
  );
}

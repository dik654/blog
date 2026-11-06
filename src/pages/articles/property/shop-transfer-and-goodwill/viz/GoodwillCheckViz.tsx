import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism 둘째 문단 — 영업상 이점 1천만 원의 검토 순서.
 * 금액은 본문에 없으므로 막대를 쓰지 않고, 기록 대조 칸과 바꿔 넣는 항목만 그립니다.
 * 기간 세 칸은 "여러 기간"을 나타내는 설명용입니다.
 */
const SOURCES = ["신고 매출", "카드·배달 정산", "계좌 입금"] as const;
const PERIODS = ["기간 1", "기간 2", "기간 3"] as const;

const ROWS = [
  { from: "일시 매출 · 미사용 선불권", to: "별도 표시" },
  { from: "기존 임대료", to: "새 임대료" },
  { from: "점주와 가족의 노동", to: "대체 임금 차감" },
] as const;

const SCENES = [
  { label: "세 기록 맞추기", summary: "기록 3개 × 여러 기간", note: "신고 매출, 카드·배달 정산, 계좌 입금을 여러 기간에 걸쳐 맞춰 봅니다." },
  { label: "일시적인 것 표시", summary: "매출에 깃발 달기", note: "양도 전 할인행사가 만든 일시적 매출과 미사용 선불권을 별도 표시합니다." },
  { label: "임대료 바꿔 넣기", summary: "기존 → 새 임대료", note: "새 점주가 낼 돈은 기존 임대료가 아니므로 새 임대료를 넣습니다." },
  { label: "대체 임금 빼기", summary: "노동 → 임금 차감", note: "점주와 가족의 노동을 대체할 임금을 차감합니다. 그래도 1천만 원은 미래 기대입니다." },
] as const;

function Stage({ step }: { step: number }) {
  return (
    <div className="min-w-0">
      <div className="grid grid-cols-[minmax(0,6.5rem)_repeat(3,minmax(0,1fr))] gap-1 text-xs">
        <span />
        {PERIODS.map((period) => (
          <span key={period} className="text-center text-muted-foreground">{period}</span>
        ))}
        {SOURCES.map((source, row) => (
          <div key={source} className="contents">
            <span className="self-center leading-5 text-muted-foreground">{source}</span>
            {PERIODS.map((period, column) => {
              const flagged = step >= 1 && column === 2 && row !== 2;
              return (
                <span key={period} className={`flex h-7 items-center justify-center rounded border text-sm ${flagged ? "border-dashed border-amber-600 font-semibold text-amber-700 dark:text-amber-400" : "border-border text-primary"}`}>
                  {flagged ? "표시" : "✓"}
                </span>
              );
            })}
          </div>
        ))}
      </div>
      <ul className="mt-3 space-y-1.5">
        {ROWS.map((row, index) => {
          const on = step >= index + 1;
          const now = step === index + 1;
          return (
            <li key={row.from} className={`grid grid-cols-[minmax(0,1fr)_1.25rem_minmax(0,6.5rem)] items-center gap-1 text-xs leading-5 sm:text-sm ${on ? "" : "opacity-40"}`}>
              <span className={`rounded border px-2 py-1 ${now ? "border-primary" : "border-border"}`}>{row.from}</span>
              <span className="text-center text-muted-foreground" aria-hidden>→</span>
              <span className={`rounded border px-2 py-1 ${now ? "border-primary font-semibold text-primary" : "border-border"}`}>{row.to}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function GoodwillCheckViz() {
  return (
    <SceneShell
      eyebrow="영업상 이점 검토"
      title="과거 기록을 맞춘 뒤 새 점주의 조건으로 바꿔 놓고 봅니다"
      description="위 칸은 기록 대조, 아래는 차례로 고쳐 넣는 항목입니다. 금액은 본문에 없어 적지 않았고 기간 세 칸은 설명용입니다."
      ariaLabel="세 기록을 여러 기간에 걸쳐 맞추고 일시 매출 표시, 새 임대료, 대체 임금을 차례로 반영하는 과정"
      scenes={SCENES}
      render={(active) => <Stage step={active} />}
    />
  );
}

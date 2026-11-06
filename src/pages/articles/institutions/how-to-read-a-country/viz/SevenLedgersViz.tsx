import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #names — 일곱 장부가 각각 적는 것, 그리고 모든 장부에 공통으로 있는 세 칸.
 * 공식 통계 분류가 아니라 이 글의 분석 틀입니다.
 */
const LEDGERS = [
  { name: "정치·법", holds: "누가 규칙을 바꾸고 누가 집행하는가" },
  { name: "예산", holds: "정부의 수입·지출·빚" },
  { name: "생산", holds: "노동과 재료가 무엇으로 바뀌는가" },
  { name: "대외 거래", holds: "물건과 자금의 국경 이동" },
  { name: "생활 서비스", holds: "주거·의료·교육·이동의 실제 접근성" },
  { name: "정보", holds: "사람들이 무엇을 보고 믿는 경로" },
  { name: "기대", holds: "그 믿음 때문에 오늘 바뀌는 소비·투자·투표" },
] as const;
const BLANKS = ["결정권자", "돈을 내는 사람", "손실을 받는 사람"] as const;
const GRID = "sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]";

export default function SevenLedgersViz() {
  return (
    <VizFrame
      eyebrow="국가의 일곱 장부"
      title="일곱 장부는 적는 내용이 달라도 빈칸 세 개는 같습니다"
      description="공식 통계 분류가 아니라 이 글의 분석 틀입니다. 점선 칸은 실제 나라를 읽을 때 채울 자리입니다."
    >
      <div className="min-w-0">
        <div className={`grid gap-x-4 ${GRID}`}>
          <span className="hidden sm:block" />
          <div className="grid grid-cols-3 gap-1 text-center text-[11px] font-bold leading-4 text-primary">
            {BLANKS.map((blank) => <span key={blank}>{blank}</span>)}
          </div>
        </div>
        <ul className="mt-2 divide-y divide-border/70">
          {LEDGERS.map((ledger) => (
            <li key={ledger.name} className={`grid items-center gap-x-4 gap-y-1.5 py-2.5 ${GRID}`}>
              <p className="min-w-0 text-sm leading-6">
                <span className="font-bold">{ledger.name}</span>
                <span className="text-muted-foreground"> · {ledger.holds}</span>
              </p>
              <div className="grid grid-cols-3 gap-1" aria-hidden="true">
                {BLANKS.map((blank) => <span key={blank} className="h-6 rounded border border-dashed border-muted-foreground/50" />)}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </VizFrame>
  );
}

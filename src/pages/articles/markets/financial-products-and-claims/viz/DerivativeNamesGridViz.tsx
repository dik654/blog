import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #source — ELS·DLS·ELB·DLB를 두 축에 놓습니다.
 * 가로: 조건을 거는 대상. 세로: 만기 원금 지급 약속이 있는 사채로 구별되는가.
 */
const COLUMNS = ["주식·주가지수", "금리·환율·원자재·신용 사건 등"];
const ROWS = [
  { title: "만기 원금 지급 약속 없음", cells: ["ELS", "DLS"] },
  { title: "만기 원금 지급 약속 있음", cells: ["ELB", "DLB"] },
];

export default function DerivativeNamesGridViz() {
  return (
    <VizFrame
      eyebrow="이름의 두 축"
      title="비슷한 네 이름을 두 축에 놓습니다"
      description="가로는 무엇에 조건을 거는지, 세로는 만기 원금 지급을 약속하는 사채로 구별되는지입니다. 지급액은 두 줄 모두 조건에 따라 달라집니다."
      note="한국 상품 분류 기준입니다. 미국 문서의 ELN은 주가연계 채무라는 표현이며, 한국의 어느 한 칸과 이름만으로 같다고 볼 수 없습니다."
    >
      <div className="min-w-0" role="img" aria-label="ELS는 주식 조건, DLS는 그 밖의 조건, ELB와 DLB는 각각에 만기 원금 지급 약속이 붙은 구분">
        <div className="grid grid-cols-[4.75rem_minmax(0,1fr)_minmax(0,1fr)] gap-2 sm:grid-cols-[7.5rem_minmax(0,1fr)_minmax(0,1fr)]">
          <span />
          {COLUMNS.map((column) => (
            <p key={column} className="text-center text-xs font-bold leading-5 text-muted-foreground">{column}</p>
          ))}
          {ROWS.map((row, rowIndex) => (
            <div key={row.title} className="contents">
              <p className="self-center text-xs font-bold leading-5 text-muted-foreground">{row.title}</p>
              {row.cells.map((cell) => (
                <p key={cell} className={`rounded-lg border px-2 py-4 text-center font-mono text-lg font-bold ${rowIndex === 1 ? "border-primary/70 text-primary" : "border-border text-foreground"}`}>
                  {cell}
                </p>
              ))}
            </div>
          ))}
          <span />
          <p className="col-span-2 rounded-lg border border-dashed border-red-600/70 px-2 py-1.5 text-center text-xs font-bold leading-5 text-red-700 dark:text-red-400">
            아래 줄의 약속도 발행자의 지급 능력에 의존합니다
          </p>
        </div>
      </div>
    </VizFrame>
  );
}

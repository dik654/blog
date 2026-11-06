import SceneShell from "./SceneShell";

/**
 * 본문 대응: #measurement-and-reanalysis — 같은 쟁점을 자료를 바꿔 다시 본 순서.
 * 숫자와 보고 내용은 본문이 적은 범위에 한정한다. 판정(누가 맞는가)은 그리지 않는다.
 */
const ROWS = [
  { year: "1994", who: "Card·Krueger", data: "전화 조사", direction: "뉴저지 상대 증가 · 변화 차이 2.75" },
  { year: "1995", who: "Neumark·Wascher", data: "급여 기록 230곳", direction: "뉴저지 상대 고용 감소" },
  { year: "1998", who: "Card·Krueger", data: "ES-202 행정자료", direction: "뉴저지 비슷하거나 조금 더 빠른 증가" },
  { year: "1998", who: "Card·Krueger", data: "급여 표본 점검", direction: "소수 매장과 보고 간격을 지적" },
] as const;

const SCENES = [
  { label: "출발점", summary: "전화 조사", note: "12절 표 3의 4행입니다. 두 시점 모두 자료가 있는 같은 가게에서 가게당 FTE 변화가 뉴저지 +0.47, 펜실베이니아 −2.28이고 차이는 2.75(표준오차 1.34)입니다." },
  { label: "자료를 급여 기록으로", summary: "230곳 · 다른 방향", note: "1995년 작업논문은 230곳의 급여 기록으로 전화 조사 자료를 재검토해, 전화 조사 쪽 변동이 더 크고 자신들의 자료에서는 뉴저지의 상대 고용 감소가 나타난다고 보고했습니다." },
  { label: "자료를 행정자료로", summary: "ES-202", note: "1998년 작업논문은 BLS의 ES-202 행정자료에서 뉴저지가 비슷하거나 조금 더 빠른 고용 증가를 보인다고 보고했습니다." },
  { label: "표본 자체를 묻습니다", summary: "매장 구성 · 보고 간격", note: "같은 논문은 급여 표본이 다르게 나온 이유를 1995년 EPI 연구에 펜실베이니아 자료를 처음 제공한 한 가맹점주의 소수 매장에서 찾고, 주별·격주·월별 보고 매장끼리 추세가 크게 다르다고 지적했습니다." },
  { label: "여기서 말할 수 있는 범위", summary: "판정이 아니라 쟁점", note: "이 글은 두 작업논문 초록의 쟁점을 확인했을 뿐, 2000년 출판본이나 그 뒤의 모든 연구를 검증하지 않았습니다. 어느 자료든 오류·대표성·기간·추정 대상을 함께 확인합니다." },
] as const;

export default function ReanalysisMapViz() {
  return (
    <SceneShell
      eyebrow="재검토의 순서"
      title="같은 쟁점을 자료를 바꿔 가며 다시 물었습니다"
      description="위에서 아래로 시간순이고 각 줄은 저자가 보고한 내용입니다. 본문이 크기를 적지 않은 보고는 방향만 적었습니다."
      ariaLabel="1994년 전화 조사부터 1998년 표본 점검까지 자료와 보고 내용의 순서"
      scenes={SCENES}
      render={(active) => (
        <ol className="m-0 list-none space-y-0 p-0">
          {ROWS.map((row, index) => {
            const final = active === 4;
            const reached = final || index <= active;
            const current = !final && index === active;
            return (
              <li key={`${row.year}-${row.data}`} className={`relative border-l pb-1.5 pl-4 last:pb-0 ${reached ? "border-primary/60 opacity-100" : "border-border opacity-30"}`}>
                <span className={`absolute -left-[4.5px] top-1.5 block h-2 w-2 rounded-full ${current ? "bg-[#2563eb]" : reached ? "bg-[#64748b]" : "bg-[#94a3b8]"}`} />
                <div className="flex flex-wrap items-baseline gap-x-2 text-xs leading-5 sm:text-sm">
                  <span className="font-mono font-bold">{row.year}</span>
                  <span className={current ? "font-bold" : ""}>{row.who}</span>
                  <span className="text-muted-foreground">{row.data}</span>
                </div>
                <p className="m-0 text-xs leading-5 sm:text-sm">
                  <span className={`font-bold ${current ? "text-[#2563eb]" : ""}`}>{row.direction}</span>
                </p>
              </li>
            );
          })}
        </ol>
      )}
    />
  );
}

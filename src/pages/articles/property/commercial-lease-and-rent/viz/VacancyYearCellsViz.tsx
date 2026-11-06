import SceneShell from "./SceneShell";

/**
 * 본문 대응: #need — 다음 점주를 못 찾아 두 달 비는 별도의 1년. 200만 × 12 = 2천400만, 200만 × 2 = 400만, 2천400만 − 400만 = 2천만.
 * 칸 하나 = 한 달치 200만 원. 어느 두 달이 비어도 합계는 같습니다.
 */
const SCENES = [
  { label: "12개월 내내", summary: "200만 × 12 = 2천400만 원", note: "다음 점주가 끊기지 않는다면 건물주가 받을 월세입니다." },
  { label: "두 달 공실", summary: "2천400만 − 400만 = 2천만 원", note: "두 칸이 비면 200만 원씩 400만 원이 빠집니다. 앞의 3년 계약에 넣은 계산이 아니라 별도의 1년을 가정한 것입니다." },
  { label: "아직 순수익 아님", summary: "2천만 − 수선·세금·이자 등", note: "받은 돈에서 수선·세금·이자 등을 더 빼야 합니다. 이 글은 금액을 정하지 않았으므로 칸으로 그리지 않았습니다." },
] as const;

const MONTHS = Array.from({ length: 12 }, (_, index) => index);

export default function VacancyYearCellsViz() {
  return (
    <SceneShell
      eyebrow="건물주의 1년"
      title="월세 200만 원이 전부 건물주 몫이 아닌 이유"
      description="칸 하나가 한 달 월세 200만 원입니다. 비어 있는 칸은 점주가 없어 받지 못한 달입니다."
      note="두 달 공실은 앞의 3년 계약과 별개인 (가정)입니다. 어느 두 달이 비어도 합계는 같습니다."
      ariaLabel="1년 12칸 중 두 칸이 비고 나머지에서 비용을 더 빼는 건물주의 월세 계산"
      scenes={SCENES}
      render={(active) => (
        <div className="mx-auto w-full max-w-[520px]">
          <div className="grid grid-cols-6 gap-1.5">
            {MONTHS.map((month) => {
              const empty = active >= 1 && month >= 10;
              return (
                <span key={month} className={`flex h-12 flex-col items-center justify-center rounded border text-xs ${empty ? "border-dashed border-red-600 text-red-700 dark:text-red-400" : "border-primary bg-primary/10"}`}>
                  <span className="font-semibold">{empty ? "공실" : "200만"}</span>
                </span>
              );
            })}
          </div>
          <dl className="m-0 mt-3 divide-y divide-border border-y border-border text-sm">
            <div className="flex items-baseline justify-between gap-3 py-1.5">
              <dt className="text-muted-foreground">받는 월세</dt>
              <dd className="m-0 p-0 font-mono font-semibold">{active === 0 ? "2천400만 원" : "2천만 원"}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-3 py-1.5">
              <dt className="text-muted-foreground">더 뺄 돈</dt>
              <dd className={`m-0 p-0 font-mono font-semibold ${active === 2 ? "text-amber-700 dark:text-amber-400" : "text-muted-foreground/50"}`}>{active === 2 ? "수선·세금·이자 등" : "—"}</dd>
            </div>
          </dl>
        </div>
      )}
    />
  );
}

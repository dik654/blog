import LaborSceneFrame from "./LaborSceneFrame";
import { laborPlan, numberLabel as f } from "../model";
const labels = ["두 계획", "임금 합계", "한 시간 추가", "최저시급 9"] as const;
const notes = [
  "같은 하루에 노동을 총 3시간 쓰는 계획과 4시간 쓰는 계획입니다. 그만큼의 시간을 구하려면 시급을 6과 7로 제시해야 한다고 가정합니다. 사람 수를 자르는 계산이 아닙니다.",
  "3시간에는 3×6=18, 4시간에는 4×7=28을 지급합니다. 모든 시간에 같은 시급을 적용한 대안을 비교합니다.",
  "새 한 시간의 7에 앞의 세 시간마다 더 주는 1을 합치면 추가 비용은 10입니다. 수입 증가 9.5보다 커서 이익은 0.5 줄어듭니다.",
  "최저시급 9 아래에서는 3시간과 4시간 모두 시급 9를 줍니다. 임금 합계는 27과 36입니다. 비용 증가 9보다 수입 증가 9.5가 커서 이익은 0.5 늘어납니다.",
] as const;
export default function WageStopViz() {
  return <LaborSceneFrame title="한 시간의 시급과 전체 임금 증가를 구분한다"
    description="3시간과 4시간의 수입·임금 합계·남는 돈을 같은 기간에서 비교합니다."
    note="(가정) 노동시간에 따른 수입은 13n−n²/2, 필요한 시급은 n+3이며 다른 비용은 생략합니다."
    labels={labels} notes={notes}
    renderClassName="min-h-[14.875rem] sm:min-h-0" noteClassName="min-h-[8.75rem] min-[390px]:min-h-[7rem] sm:min-h-0"
    render={s => <>
      <div className="grid grid-cols-2 gap-3 text-sm leading-7">
        {[3, 4].map(n => { const p = laborPlan(n, s === 3 ? 9 : 0); return <div key={n} className="border-l-2 border-primary/50 pl-3">
          <p className="font-bold">{n}시간 · 시급 {p.wage}</p><p>수입 {f(p.revenue)}</p>
          {s >= 1 && <><p>임금 합계 {f(p.cost)}</p><p className="font-bold">남는 돈 {f(p.profit)}</p></>}
        </div>; })}
      </div>
      {s >= 2 && <div className="mt-4 border-y border-border py-3 text-sm leading-7">
        <p>수입 증가 +9.5</p><p>임금 합계 증가 −{s === 3 ? 9 : 10}</p>
        <p className="font-bold">남는 돈 변화 {s === 3 ? "+0.5" : "−0.5"}</p>
      </div>}
    </>} />;
}

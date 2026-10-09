import LaborSceneFrame from "./LaborSceneFrame";
import { competitiveHours, laborPlan, monopsonyHours, numberLabel as f } from "../model";
const floors = [0, 7, 8, 9, 12, 13] as const;
const labels = ["인상 전", "7", "8", "9", "12", "13"] as const;
const notes = [
  "경쟁 기준은 노동 5시간·시급 8입니다. 동일 임금으로 시간을 구하는 고용주는 10/3시간·시급 19/3을 고릅니다. 고용주 수만으로 이 조건을 확인할 수는 없습니다.",
  "최저시급 7에서는 그 시급으로 구할 수 있는 4시간이 동일 임금 고용주의 최적점입니다. 임금총액의 기울기가 꺾이는 곳이며 단순한 미분 등식을 대입하지 않습니다. 경쟁 기준의 시급 8은 그대로입니다.",
  "최저시급 8에서 두 모형의 고용시간은 5가 됩니다. 동일 임금 모형에서 노동시간이 가장 큰 최저시급입니다. 실제 시장의 최적 정책을 추정한 값은 아닙니다.",
  "최저시급 9에서는 두 모형 모두 4시간을 고릅니다. 인상 전과 비교하면 경쟁 기준의 5보다 작고, 동일 임금 고용주의 10/3보다 큽니다.",
  "최저시급 12에서는 두 모형 모두 1시간입니다. 동일 임금 고용주도 인상 전보다 적은 시간을 고릅니다. 모든 인상에서 고용이 늘어나는 것은 아닙니다.",
  "이 연속 모형에서 최저시급 13이면 양의 노동시간을 조금이라도 쓰는 편이 불리해 0시간을 고릅니다. 별도의 정수 수입 사례에서는 경계의 동률을 따로 확인합니다.",
] as const;
export default function TwoPredictionsViz() {
  return <LaborSceneFrame title="같은 최저시급을 서로 다른 출발점에 적용한다"
    description="경쟁 기준과 동일 임금 고용주의 노동시간을 여섯 조건에서 비교합니다."
    note="(가정) 같은 생산·노동공급 관계를 유지한 연속 시간 모형입니다. 1992년 관측치를 예측한 그래프가 아닙니다."
    labels={labels} notes={notes}
    renderClassName="min-h-[17rem] min-[390px]:min-h-[13.5rem] sm:min-h-0" noteClassName="min-h-[10.5rem] min-[390px]:min-h-[8.75rem] sm:min-h-0"
    render={s => {
      const F = floors[s], n = monopsonyHours(F), p = laborPlan(n, F);
      return <div className="space-y-4 text-sm leading-7">
        <p className="font-bold">{F === 0 ? "최저시급 제한 없음" : `최저시급 ${F}`}</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="border-l-2 border-primary/50 pl-3"><p>경쟁 기준</p><p className="text-xl font-bold">{f(competitiveHours(F))}시간</p></div>
          <div className="border-l-2 border-primary/50 pl-3"><p>동일 임금 고용주</p><p className="text-xl font-bold">{f(n)}시간</p></div>
        </div>
        <p>동일 임금 모형의 임금 합계 {f(p.cost)} · 이익 {f(p.profit)}</p>
        <p>{n === 0 ? "고용하지 않으므로 실제 지급 임금은 없습니다." : `지급 시급 ${f(p.wage)}`}</p>
      </div>;
    }} />;
}

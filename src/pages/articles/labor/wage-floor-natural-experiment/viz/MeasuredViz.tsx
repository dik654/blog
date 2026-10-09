import LaborSceneFrame from "./LaborSceneFrame";
const labels = ["두 차례 조사", "표 3의 3행", "같은 가게", "인과 조건"] as const;
const notes = [
  "1992년 2~3월에 먼저 조사하고 4월 1일 인상 후 11~12월에 다시 조사했습니다. 인상 시점과 두 조사 시점의 간격을 구분합니다.",
  "표의 표시 숫자만 빼면 0.59−(−2.16)=2.75입니다. 논문이 원자료에서 계산해 보고한 변화 차이는 2.76입니다. 반올림된 입력을 다시 계산한 값과 구분합니다.",
  "표 3의 4행은 두 조사 모두 고용자료가 있는 가게의 변화입니다. 0.47−(−2.28)=2.75입니다. 초기 조사 410곳과 각 행의 유효 관측 표본은 같다고 가정하지 않습니다.",
  "임금을 올리지 않았을 때 두 지역의 고용 변화가 같았을지 검토해야 합니다. 조사·폐업 처리·다른 충격·지역 간 파급도 확인합니다. 가까운 지역이라는 사실만으로 인과가 확정되지는 않습니다.",
] as const;
export default function MeasuredViz() {
  return <LaborSceneFrame title="논문 표의 행과 비교 대상을 먼저 읽는다"
    description="Card·Krueger(1994) 표 3의 관측값을 설명용 노동시간 모형과 구분합니다."
    note="정규직 환산(FTE)은 관리자 포함 전일제 수에 시간제 수의 절반을 더한 이 논문의 측정치입니다."
    labels={labels} notes={notes}
    renderClassName="min-h-[13.5rem] min-[390px]:min-h-[12.75rem] sm:min-h-0" noteClassName="min-h-[10.5rem] min-[390px]:min-h-[8.75rem] sm:min-h-0"
    render={s => <div className="space-y-4 text-sm leading-7">
      {s === 0 ? <><p>2~3월 · 첫 조사 410곳</p><p>4월 1일 · 뉴저지 법정 최저시급 4.25 → 5.05달러</p><p>11~12월 · 후속 조사</p><p>펜실베이니아의 법정 최저시급은 4.25달러 유지</p></> : s <= 2 ? <>
        <div className="grid grid-cols-2 gap-3"><div className="border-l-2 border-primary/50 pl-3"><p>뉴저지 변화</p><p className="text-xl font-bold">+{s === 1 ? "0.59" : "0.47"}</p></div><div className="border-l-2 border-primary/50 pl-3"><p>펜실베이니아 변화</p><p className="text-xl font-bold">−{s === 1 ? "2.16" : "2.28"}</p></div></div>
        <p>논문 보고 변화 차이 {s === 1 ? "2.76 · 표준오차 1.36" : "2.75 · 표준오차 1.34"}</p><p>{s === 1 ? "각 시점의 자료가 있는 가게 평균" : "두 시점 모두 자료가 있는 같은 가게"}</p>
      </> : <><p>법이 바뀌지 않은 경우의 추세</p><p>조사 방법과 표본 구성</p><p>폐업·일시 휴업 처리</p><p>동시에 달라진 수요와 다른 정책</p><p>비교 지역으로 전해진 영향</p></>}
    </div>} />;
}

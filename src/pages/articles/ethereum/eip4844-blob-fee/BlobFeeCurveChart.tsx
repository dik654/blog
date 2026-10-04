import { Mafs, Coordinates, Plot, Theme } from "mafs";

export default function BlobFeeCurveChart() {
 return <figure className="not-prose rounded-xl border border-border/70 bg-background p-4 sm:p-6">
  <figcaption className="font-semibold">이상적인 지수 곡선과 실제 정수 계산의 차이</figcaption>
  <p className="mt-2 text-sm leading-6">가로축은 초과분÷update fraction, 세로축은 가격÷최소 가격입니다. 파란 선은 실수 함수 eˣ이며 실제 정수 가격의 측정 그래프가 아닙니다.</p>
  <div className="themed-mafs mt-4 min-w-0 overflow-x-auto"><Mafs height={230} preserveAspectRatio={false} pan={false} zoom={false} viewBox={{x:[-.2,3.3],y:[-4,23],padding:0}}><Coordinates.Cartesian xAxis={{lines:.5,labels:v=>v>=0&&v<=3?v.toFixed(1):""}} yAxis={{lines:5,labels:v=>v>=0&&v<=20?String(v):""}} /><Plot.OfX y={x=>Math.exp(x)} color={Theme.blue} /></Mafs></div>
  <p className="mt-3 text-sm leading-6">가로축 2에서 선의 높이는 e²≈7.389입니다. 그러나 본문의 작은 정수 설정 f=1,n=4,d=2는 중간 나눗셈도 내림하므로 6을 반환합니다. 비율 n/d가 같다는 사실만으로 정수 오차까지 같아지지는 않습니다.</p>
 </figure>;
}

import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import FlowRail from "../world-systems/FlowRail";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import SourceApplication from "../world-systems/SourceApplication";
import PriceChoiceViz from "./market-power-and-markup/viz/PriceChoiceViz";
import MarkupViz from "./market-power-and-markup/viz/MarkupViz";
import { sale, welfare } from "./market-power-and-markup/model";
function SalesTable({ quantities }: { quantities: number[] }) {
  return <div className="my-6 overflow-x-auto"><table className="w-full text-left text-sm">
    <caption className="mb-3 text-left leading-6">(가정) 같은 수요·단위 비용 7 · 같은 기간의 대안 비교</caption>
    <thead><tr>{["수량", "가격", "매출", "비용", "이익"].map(t => <th scope="col" className="p-2" key={t}>{t}</th>)}</tr></thead>
    <tbody>{quantities.map(q => { const s = sale(q); return <tr key={q} className="border-t border-border"><th scope="row" className="p-2">{q}</th>{[s.price, s.revenue, s.cost, s.profit].map((v, i) => <td className="p-2" key={i}>{v}</td>)}</tr>; })}</tbody>
  </table></div>;
}
function SurplusTable() {
  return <div className="my-6 overflow-x-auto"><table className="w-full text-left text-sm">
    <caption className="mb-3 text-left leading-6">(가정) 동일 수요·비용·고정비 0 · 소비자와 생산자의 잉여</caption>
    <thead><tr>{["수량", "소비자", "생산자", "합계", "손실"].map(t => <th scope="col" className="p-2" key={t}>{t}</th>)}</tr></thead>
    <tbody>{[6, 3].map(q => { const s = welfare(q); return <tr key={q} className="border-t border-border"><th scope="row" className="p-2">{q}</th>{[s.consumer, s.producer, s.total, s.lost].map((v, i) => <td className="p-2" key={i}>{v}</td>)}</tr>; })}</tbody>
  </table></div>;
}
/** 동일 가격·선형 수요·비용의 가정 사례. 원문의 수치나 실제 업체의 관측값이 아닙니다. */
export default function MarketPowerAndMarkupArticle() {
  return <div className="space-y-16">
      <section id="overview" data-teach-level="S" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">1. 값을 내려 더 팔았는데 남는 돈은 줄었다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">같은 물건을 파는 업체가 가격을 10에서 9로 내릴지 고민합니다. 10을 받으면 3개, 9를 받으면 4개가 팔린다고 예상합니다. 더 팔았으니 매출은 늘겠지만 만드는 비용도 늘어납니다. 가격 인하가 이익에도 도움이 되는지는 두 변화를 함께 세어야 합니다.</p>
          <p className="leading-7">이 글에서는 같은 기간에 물건 하나를 같은 가격으로 파는 상황을 비교합니다. 가격별 판매량과 하나를 만드는 비용을 먼저 적고 실제로 남는 돈을 계산합니다. 그다음 수량을 조금씩 바꾸는 식, 수요가 가격에 반응하는 정도, 일어나지 않은 거래의 가치를 연결합니다.</p>
        </div>
        <p data-stage-bridge="overview" className="mt-5 text-sm leading-7 text-muted-foreground">먼저 가격을 고르는 업체가 입력으로 알아야 할 것과 계산할 결과를 나눕니다.</p>
      </section>
      <section id="black-box" data-teach-level="B" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">2. 가격별 판매량과 비용을 알아야 선택할 수 있다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            업체는 어떤 가격에서 얼마나 팔리는지와 그 수량을 만드는 비용을 알아야 합니다. 가격에 판매량을 곱하면 매출이고 비용을 빼면 이익입니다. 같은 기간의 판매 계획을 비교해 가장
            큰 이익이 남는 선택을 찾습니다. 팔지 않는 선택도 가능하다면 함께 비교합니다.
          </p>
          <p className="leading-7">아래 숫자는 관계를 설명하기 위한 (가정)입니다. 하나를 만들 때 7이 들고 처음에 따로 내는 비용은 없습니다. 필요한 만큼 만들 여력이 있으며 세금·외부 피해·품질 차이·미래의 수요 변화는 생략합니다. 실제 매장에서는 가격을 바꿔도 수요표 자체가 달라질 수 있습니다.</p>
          <p className="leading-7">이번 업체가 판매량에 영향을 줄 수 있는 가격을 정한다고 가정합니다. 그 힘이 어디서 생겼는지를 생산 설비의 최소 수량 하나로 설명하지는 않습니다. 앞 글의 비용 비교와 이번 글의 판매 조건은 따로 확인해야 합니다.</p>
        </div>
        <FlowRail title="가격 선택에서 이익 비교까지" steps={[
          { actor: "가격별 주문", movement: "같은 기간에 팔릴 수량과 생산할 여력을 확인합니다.", receives: "비교할 가격과 수량" },
          { actor: "매출과 비용", movement: "가격 × 수량에서 해당 수량의 비용을 뺍니다.", receives: "대안별 이익" },
          { actor: "전체 선택 비교", movement: "다른 수량과 생산 한도, 팔지 않는 선택을 함께 봅니다.", receives: "조건 안에서 가장 큰 이익" },
        ]} />
        <p data-stage-bridge="black-box" className="mt-5 text-sm leading-7 text-muted-foreground">가격 10과 9를 같은 비용표에 넣어 봅니다.</p>
      </section>
      <section id="case" data-teach-level="0" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">3. 3개와 4개의 매출·비용·이익을 각각 센다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">가격 10에 3개를 팔면 매출은 10 × 3 = 30입니다. 비용은 7 × 3 = 21이므로 남는 돈은 9입니다. 가격 9에 4개를 팔면 매출은 9 × 4 = 36, 비용은 7 × 4 = 28, 남는 돈은 8입니다.</p>
          <p className="leading-7">가격을 내린 대안에서 매출은 6 늘고 비용은 7 늡니다. 이익은 오히려 1 줄어듭니다. 새로 파는 네 번째 물건의 가격 9만 비용 7과 비교하면 이 차이를 놓칩니다. 같은 가격을 적용한 앞의 세 개에서도 매출이 달라졌기 때문입니다.</p>
          <p className="leading-7">비교하는 두 대안은 같은 기간의 판매 계획입니다. 이미 끝난 과거 거래의 가격을 바꾸거나 고객에게 환불한다는 뜻이 아닙니다. 가격 10을 유지했다면 세 개에 30을 받을 수 있었고, 처음부터 9로 정했다면 네 개에 36을 받는다고 비교합니다.</p>
        </div>
        <SalesTable quantities={[3, 4]} />
        <p data-stage-bridge="case" className="mt-5 text-sm leading-7 text-muted-foreground">그림에서 새 판매의 수입과 앞의 세 개에서 줄어든 수입을 따로 봅니다.</p>
      </section>
      <section id="picture" data-teach-level="1" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">4. 새로 받는 9에서 세 개의 차이 3을 뺀다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">가격 9의 계획을 가격 10의 계획과 비교하면, 새로 팔리는 한 개가 매출 9를 더합니다. 기존 세 개에 해당하는 수량은 하나당 1씩 덜 받으므로 합계 3이 줄어듭니다. 두 변화를 합친 9 − 3 = 6이 전체 매출 증가입니다.</p>
          <p className="leading-7">그림은 네 단계로 계산을 보여 줍니다. 먼저 두 계획을 놓고, 각 매출을 계산한 뒤 더해진 9와 줄어든 3을 합칩니다. 마지막으로 비용 증가 7을 빼면 왜 이익이 1 줄었는지 확인할 수 있습니다.</p>
        </div>
        <PriceChoiceViz />
        <p data-stage-bridge="picture" className="mt-5 text-sm leading-7 text-muted-foreground">매출이 가장 큰 가격과 이익이 가장 큰 가격이 같은지도 따져 봅니다.</p>
      </section>
      <section id="why" data-teach-level="2" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">5. 매출만 키우거나 새 한 개의 가격만 보면 답이 달라진다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">가격을 8로 내려 5개를 판다면 매출은 40으로 더 커집니다. 하지만 비용도 35가 되어 이익은 5로 작아집니다. 10을 받아 3개를 파는 이익 9보다 적습니다. 매출 증가와 이익 증가를 구분해야 하는 이유입니다.</p>
          <p className="leading-7">한편 2개를 팔 때 가격이 11이라면 매출은 22, 비용은 14, 이익은 8입니다. 2개에서 3개로 늘릴 때는 매출이 8 늘고 비용은 7 늘어 이익이 1 늘어납니다. 3개에서 4개로 늘릴 때와 결과가 반대입니다.</p>
          <p className="leading-7">이번 숫자에서는 3개의 이익이 앞뒤보다 큽니다. 이것만으로 모든 비용표에서 앞뒤 두 경우만 보면 충분하다는 규칙을 만들 수는 없습니다. 뒤에서 전체 이익식의 모양을 확인하고 생산 한도가 있을 때도 따로 비교합니다.</p>
        </div>
        <SalesTable quantities={[2, 3, 4, 5]} />
        <p data-stage-bridge="why" className="mt-5 text-sm leading-7 text-muted-foreground">가격·매출·이익의 역할이 분명해졌으니 이 차이에 이름을 붙입니다.</p>
      </section>
      <section id="names" data-teach-level="3" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">6. 수요·한계수입·한계비용을 서로 다른 값으로 읽는다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">가격마다 팔리는 양의 관계를 수요라고 부릅니다. 이번 글의 수요는 가격을 13에서 판매량만큼 뺀 값으로 둡니다. 판매량은 q로 쓰겠습니다. 가격은 p로 쓰겠습니다. 그러면 p = 13 − q입니다. 가격이 음수가 되지 않는 0부터 13까지의 수량을 다룹니다.</p>
          <p className="leading-7">
            매출은 가격과 수량의 곱이고 이익은 매출에서 비용을 뺀 값입니다. 수량을 아주 조금 늘릴 때의 매출 변화율을 한계수입, 비용 변화율을 한계비용이라고 부릅니다. 여기서는
            한계비용이 7입니다.
          </p>
          <p className="leading-7">물건을 정수 개씩만 팔 때 한 개 추가의 매출 차이와, 연속적인 수량에서 구한 미분값은 같은 개념으로 바로 대입할 수 없습니다. 위의 3개에서 4개로 갈 때 매출 차이는 6입니다. 뒤에서 미분으로 얻는 값 7과 5가 왜 이 차이와 다른지 확인합니다.</p>
          <p className="leading-7">가격에서 한계비용을 뺀 차이를 가격으로 나눈 비율을 이 글의 마크업 지표로 씁니다. 10과 7의 차이 3을 가격 10으로 나누면 30%입니다. 비용 7을 분모로 삼는 3 ÷ 7, 약 42.9%의 원가 가산율과 구분합니다.</p>
          <p className="leading-7">이 30%라는 비율에는 이름이 있습니다. Abba Lerner가 1934년 논문(The Review of Economic Studies 1권 3호, 157~175쪽)에서 독점력의 척도로 제시해 러너 지수(Lerner index)라고 부릅니다.</p>
          <p className="leading-7">실증 연구는 같은 차이를 가격이 한계비용의 몇 배인지, 곧 μ = 가격 ÷ 한계비용으로 보고하는 경우가 많습니다. 사례에서는 μ = 10 ÷ 7 ≈ 1.43이고, 두 지표는 러너 지수 = 1 − 1/μ = 1 − 7/10 = 0.3으로 서로 바뀝니다.</p>
          <p className="leading-7">이 환산을 알아야 실증 수치를 읽을 수 있습니다. De Loecker·Eeckhout·Unger의 2020년 QJE 논문은 집계 마크업이 1980년 한계비용보다 21% 높은 수준(μ = 1.21)에서 논문 시점의 61%(μ = 1.61)로 올랐다고 보고합니다. 러너 지수로 바꾸면 1 − 1/1.21 ≈ 0.17에서 1 − 1/1.61 ≈ 0.38입니다.</p>
          <p className="leading-7">같은 연구의 NBER 작업논문판(w23687)은 18%에서 67%로 적어 판본마다 수치가 다르고, 저자들은 중앙값은 그대로였다고 덧붙였습니다. 평균이 오른 것이 모든 기업의 마크업이 오른 것은 아니라는 뜻입니다. Lerner 논문은 서지(Crossref)만 확인했습니다(2026-10-09).</p>
        </div>
        <p data-stage-bridge="names" className="mt-5 text-sm leading-7 text-muted-foreground">이름을 붙인 뒤 업체가 실제로 어떤 수요를 마주하는지 조건을 분명히 합니다.</p>
      </section>
      <section id="facing-demand" data-teach-level="4" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">7. 판매자 수만으로 가격을 고르는 힘을 정하지 않는다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">자기 판매량을 바꿔도 시장가격에 거의 영향을 주지 못한다고 보는 업체는 주어진 가격을 기준으로 판단합니다. 이를 가격수용자로 모형화합니다. 판매자가 여럿이라는 사실만으로 모든 업체가 반드시 이 조건을 만족하는 것은 아닙니다. 상품이나 서비스가 다르면 각 업체의 가격에 따라 주문이 달라질 수 있습니다.</p>
          <p className="leading-7">
            이번 사례의 업체는 자기 가격 10에서 3개, 9에서 4개가 팔리는 관계를 마주합니다. 이 관계를 그대로 둔 채 10을 받으면서 4개를 판다고 정할 수는 없습니다. 가격이나
            그에 맞는 수량을 선택하면 다른 값은 수요 관계에 따라 정해집니다.
          </p>
          <p className="leading-7">한 판매자가 해당 시장 전체의 공급을 맡는 독점을 단순한 사례로 사용합니다. 실제 시장의 경계와 대체 상품, 진입 가능성은 따로 확인해야 합니다. 비용이 낮아지는 생산 방식만으로 독점의 존재나 지속을 증명하지 않습니다.</p>
        </div>
        <p data-stage-bridge="facing-demand" className="mt-5 text-sm leading-7 text-muted-foreground">같은 가격을 받는 조건이 전체 매출의 변화에 어떻게 들어가는지 일반식으로 연결합니다.</p>
      </section>
      <section id="marginal-revenue" data-teach-level="4" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">8. 한 개를 더 파는 차이와 아주 작은 변화의 비율을 구분한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">같은 기간의 모든 판매에 같은 가격을 적용하고 수요가 내려가는 상황에서는, 더 팔기 위해 가격을 낮출 때 앞의 수량에서도 받을 돈이 줄어듭니다. 이 때문에 양의 수량에서 아주 조금 더 팔아 늘어나는 수입의 비율은 현재 가격보다 작습니다.</p>
          <p className="leading-7">이번 매출은 R(q) = q(13 − q)입니다. 이를 미분하면 R′(q) = 13 − 2q가 됩니다. 3에서의 미분값은 7이고 4에서의 미분값은 5입니다. 3개에서 4개로 한 번에 늘린 차이 36 − 30 = 6은 이 두 끝점의 미분값과 다릅니다.</p>
          <p className="leading-7">수요가 직선이고 구간 길이가 1인 이번 사례에서는 두 끝점 미분값의 평균인 6이 그 구간의 매출 차이와 같습니다. 일반적인 수요에서도 항상 단순 평균을 쓰는 것은 아닙니다. 정수 수량을 비교할 때는 각 매출을 직접 빼면 됩니다.</p>
          <p className="leading-7">
            고객마다 서로 다른 가격을 받을 수 있다면 매출식 자체가 달라집니다. 새 고객에게 낮은 가격을 제시해도 다른 판매 가격을 그대로 유지할 수 있는 경우에는 위의 감소분을 그대로
            적용할 수 없습니다. 가격을 다르게 받는다고 해서 모든 경우에 이 감소분이 사라지는 것도 아닙니다.
          </p>
        </div>
        <ExplainedFormula question="3개에서 4개로 갈 때의 6과 미분값을 어떻게 구분하나요?"
          idea="먼저 실제 두 매출을 빼고, 아주 작은 변화의 비율은 따로 미분해 구합니다."
          formula={String.raw`R(q)=q(13-q),\quad R'(q)=13-2q`}
          annotatedFormula={String.raw`\begin{gathered}R'(q)=p(q)+qp'(q)\\R(q)=13q-q^2\\R'(q)=13-2q\\R(4)-R(3)=36-30=6\end{gathered}`}
          operations={[
            { expression: String.raw`R'(3)=7`, annotation: "수량 3에서 아주 작은 변화의 비율입니다." },
            { expression: String.raw`R'(4)=5`, annotation: "수량 4에서의 변화율입니다. 한 구간의 차이 6과 구분합니다." },
            { expression: String.raw`p(q)+qp'(q)`, annotation: "매출 pq를 미분한 일반형입니다. p′가 음수이고 q가 양수이면 가격보다 작습니다." },
          ]}
          terms={[
            { symbol: "q", name: "같은 기간의 수량", description: "미분에서는 연속적으로 변할 수 있다고 둡니다. 정수 주문은 두 전체 값을 비교합니다." },
            { symbol: "R", name: "매출", description: "같은 가격을 모든 수량에 곱한 값입니다." },
            { symbol: String.raw`p'`, name: "수량에 따른 가격 변화율", description: "이번 직선에서는 −1입니다." },
          ]}
          assumptions={["같은 기간·동일 상품·동일 가격이며 가격 관계가 미분 가능합니다.", "앞의 수량에 대한 매출 비교는 대안 간 차이이며 과거 판매분 환불이 아닙니다."]}
          interpretation="가격 9에서 비용 7만 빼는 대신 전체 매출 증가 6과 전체 비용 증가 7을 비교해야 이익 감소 1이 보입니다." />
        <p data-stage-bridge="marginal-revenue" className="mt-5 text-sm leading-7 text-muted-foreground">이제 매출식에서 비용을 빼고 전체 이익이 어디서 가장 큰지 확인합니다.</p>
      </section>
      <section id="stopping-point" data-teach-level="5" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">9. 연속적인 수량에서는 이익식 전체로 최대점을 확인한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">이번 이익은 매출 13q − q²에서 비용 7q를 뺀 6q − q²입니다. 이를 9 − (q − 3)²로 다시 쓰면 3에서 이익 9가 가장 크다는 것이 보입니다. 어떤 수량에서도 제곱한 값은 음수가 아니므로 앞뒤의 일부 수량만 확인한 결과가 아닙니다.</p>
          <p className="leading-7">미분으로도 같은 점을 찾을 수 있습니다. 이익의 변화율 6 − 2q가 0인 수량은 3입니다. 그때 한계수입 13 − 2 × 3은 한계비용 7과 같고 실제 가격은 수요식에 3을 넣어 10으로 읽습니다. 이익의 두 번째 미분이 −2이므로 이 사례의 내부 정지점은 유일한 최대점입니다.</p>
          <p className="leading-7">수량이 정수로 제한되어도 이번 최대점 3은 허용되므로 답이 같습니다. 하지만 모든 모형에서 한계수입과 한계비용이 정확히 같은 정수 수량이 존재하는 것은 아닙니다. 정수의 전체 이익과 생산 한도, 생산하지 않는 선택을 확인해야 합니다.</p>
        </div>
        <ExplainedFormula question="가격 10과 수량 3이 정말 전체 이익을 가장 크게 하나요?"
          idea="미분이 0인 후보를 찾은 뒤 이번 이익식의 모양과 가능한 범위를 확인합니다."
          formula={String.raw`\pi(q)=6q-q^2=9-(q-3)^2`}
          annotatedFormula={String.raw`\begin{gathered}\pi'(q)=MR-MC\\\pi(q)=6q-q^2\\=9-(q-3)^2\\q^*=3,\quad p^*=10\end{gathered}`}
          operations={[
            { expression: String.raw`\pi'(q)=MR-MC`, annotation: "매출 변화율에서 비용 변화율을 뺍니다. 매끄러운 내부 최대점에서는 0입니다." },
            { expression: String.raw`6-2q=0`, annotation: "이번 이익식의 후보 수량은 3입니다." },
            { expression: String.raw`\pi''(q)=-2`, annotation: "이번 식은 아래로 굽으므로 내부 후보가 전체 최대점입니다." },
          ]}
          terms={[
            { symbol: String.raw`\pi`, name: "이익", description: "같은 기간 매출에서 모든 포함 비용을 뺀 값입니다." },
            { symbol: "MR", name: "한계수입", description: "아주 작은 수량 증가에 대한 매출 변화율입니다." },
            { symbol: "MC", name: "한계비용", description: "이번 모형에서는 7입니다." },
          ]}
          assumptions={["0부터 13까지의 연속 수량을 선택할 수 있고 별도 고정비가 없습니다.", "MR=MC는 일반적으로 매끄러운 내부 최적점의 필요조건입니다. 경계·다른 후보·미생산 선택도 비교해야 합니다."]}
          interpretation="이 사례는 완전제곱과 음의 두 번째 미분으로 최대를 확인했습니다. 등식 하나를 모든 판매 조건의 종료 규칙으로 쓰지 않습니다." />
        <p data-stage-bridge="stopping-point" className="mt-5 text-sm leading-7 text-muted-foreground">같은 계산을 Cournot이 가격을 기준으로 쓴 원래 식과 대조합니다.</p>
      </section>
      <section id="cournot-source" data-teach-level="6" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">10. Cournot의 식도 매출에서 생산 비용을 뺀다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">Cournot의 1838년 논저를 1897년 Bacon 영어 번역으로 읽으면 56쪽에서 광천수 판매자의 가격 선택이 나옵니다. 비용을 무시할 수 있는 첫 경우에는 가격과 판매량의 곱을 가장 크게 만듭니다. 57쪽은 재료와 노동 비용이 들면 매출 대신 비용을 뺀 수입을 가장 크게 해야 한다고 설명합니다.</p>
          <p className="leading-7">원문의 판매량 D를 이 글의 q로, 생산 비용 φ(D)의 미분을 MC로 옮기면 57쪽 식 (2)는 q + q′(p)(p − MC) = 0입니다. 이번 사례는 q(p) = 13 − p이고 q′(p) = −1이므로 13 − p − (p − 7) = 0이 됩니다. 따라서 가격은 10, 수량은 3입니다.</p>
          <p className="leading-7">원문 56~57쪽은 샘의 공급량이 부족하면 위의 내부 해를 그대로 쓸 수 없다고 밝힙니다. 58쪽도 생산이나 수요의 한도가 결정을 막는 경우를 따로 다룹니다. 59쪽의 가격이 한계비용보다 크다는 설명은 앞의 가격 결정식과 양의 수량·내려가는 수요 관계를 사용합니다.</p>
        </div>
        <SourceApplication source="Cournot · Bacon 영어 번역 (1897), 인쇄 57쪽 식 (2)" excerpt="the net receipts" application="매출 자체가 아니라 생산 비용을 뺀 수입을 비교합니다. 이 글의 30−21=9와 36−28=8이 그 구분의 작은 사례입니다. 13·7·3·10은 글에서 둔 숫자이며 원문 관측 자료가 아닙니다." />
        <CitationBlock source="A. Cournot · Researches into the Mathematical Principles of the Theory of Wealth, N. T. Bacon 번역(1897), 54~59쪽" citeKey={1} href="https://archive.org/details/researchesintom00fishgoog">공개 스캔의 관련 본문을 읽고 56·57·58·59쪽 이미지를 직접 확인했습니다. 57쪽 식 (2)와 56~58쪽의 생산 한도 조건을 이 글의 같은 사례에 적용했습니다. 프랑스어 초판 전체를 검증했다는 뜻은 아닙니다.</CitationBlock>
        <SourceApplication source="같은 번역본 · 인쇄 58쪽 §28" excerpt="there may be such a limitation" application="생산 한도가 수량 2라면 이익 최대 후보 3은 만들 수 없습니다. 뒤의 한계 절에서는 이때 수량 2와 가격 11을 고르는 경우를 비교합니다. 원문에도 한도 때문에 내부 식을 적용하지 못하는 경우가 있습니다." />
        <p data-stage-bridge="cournot-source" className="mt-5 text-sm leading-7 text-muted-foreground">가격 기준의 원래 식을 정리하면 가격과 한계비용의 차이를 비율로 나타낼 수 있습니다.</p>
      </section>
      <section id="markup-size" data-teach-level="6" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">11. 마크업 식은 최적점의 탄력성과 연결된다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">가격에 따른 수량 변화율을 가격과 수량의 비로 조정한 ε = q′(p)p/q를 수요의 가격탄력성이라고 부릅니다. 아주 작은 가격 변화에 대한 수량의 비율 반응입니다. 가격이 정확히 1% 움직일 때의 유한한 변화와 항상 같은 값은 아닙니다. 이번 수요에서는 음수이므로 크기를 볼 때 절댓값을 씁니다.</p>
          <p className="leading-7">
            앞의 조건 q + q′(p)(p − MC) = 0을 q로 나누면 1 + ε(p − MC)/p = 0입니다. 따라서 가격 기준 마크업은 (p − MC)/p = −1/ε =
            1/|ε|입니다. 한 상품에 같은 가격을 받고, 선택 가능한 범위 안쪽에서 이익이 최대가 되는 매끄러운 점에 적용하는 관계입니다.
          </p>
          <p className="leading-7">기본 사례의 가격 10과 수량 3에서는 ε = −10/3이고 그 절댓값의 역수는 3/10입니다. 실제 마크업 (10 − 7)/10인 30%와 같습니다. 한계비용이 양수이면 이 조건의 양의 최적점에서는 |ε|가 1보다 큽니다. 한계비용이 0인 내부 해는 |ε| = 1일 수 있습니다.</p>
          <p className="leading-7">이 식을 비용이 결과에 영향을 주지 않는다는 뜻으로 읽어서는 안 됩니다. 비용이 바뀌면 선택하는 가격과 수량이 달라지고 탄력성을 읽는 위치도 달라집니다. 식은 최적점에서 맞아야 할 관계를 보여 주며 가격의 변화 원인을 혼자 결정하는 공식은 아닙니다.</p>
        </div>
        <ExplainedFormula question="가격 10에서의 30%는 수요의 반응과 어떻게 연결되나요?"
          idea="가격 기준 최적조건을 수량으로 나누고 탄력성의 정의를 대입합니다."
          formula={String.raw`\frac{p-MC}{p}=-\frac1\varepsilon=\frac1{|\varepsilon|}`}
          annotatedFormula={String.raw`\begin{gathered}\varepsilon=q'(p)\frac pq\\\frac{p-MC}{p}=-\frac1\varepsilon\\\frac{10-7}{10}=\frac3{10}\end{gathered}`}
          operations={[
            { expression: String.raw`q+q'(p)(p-MC)=0`, annotation: "생산 한도에 막히지 않은 매끄러운 내부 이익 최대점의 조건입니다." },
            { expression: String.raw`1+\varepsilon\frac{p-MC}{p}=0`, annotation: "양의 수량 q로 나누고 ε=q′p/q를 대입했습니다." },
            { expression: String.raw`\varepsilon=-\frac{10}{3}`, annotation: "이번 q′=−1, 가격 10, 수량 3에서 읽은 탄력성입니다." },
          ]}
          terms={[
            { symbol: String.raw`\varepsilon`, name: "해당 점의 가격탄력성", description: "다른 가격에서 읽으면 달라질 수 있습니다. 단순한 선의 기울기와도 다릅니다." },
            { symbol: String.raw`q'(p)`, name: "가격에 따른 수량 변화율", description: "이 유도에서는 유한한 음수이며 가격과 수량 관계가 미분 가능합니다." },
            { symbol: String.raw`(p-MC)/p`, name: "가격을 분모로 한 마크업", description: "원가 가산율이나 매출 대비 순이익률과 같은 수치로 취급하지 않습니다." },
          ]}
          assumptions={["p와 q가 양수이고 같은 가격을 받는 단일 상품을 이익 최대화합니다.", "선택이 매끄러운 내부에 있고 수요의 가격 미분은 유한한 음수입니다. 정수·용량·규제 경계에는 등식을 바로 대입하지 않습니다."]}
          interpretation="최적점의 탄력성 절댓값이 커질수록 이 관계의 마크업은 작습니다. 비용이 변하면 최적점과 그 점의 탄력성이 함께 움직일 수 있습니다." />
        <p data-stage-bridge="markup-size" className="mt-5 text-sm leading-7 text-muted-foreground">수요를 바꾸는 경우와 비용을 바꾸는 경우를 각각 같은 계산으로 비교합니다.</p>
      </section>
      <section id="elasticity-comparison" data-teach-level="6" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">12. 수요를 바꿀 때와 비용을 바꿀 때를 나눠 본다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            기본 수요 p = 13 − q와 다른 수요 p = 19 − 2q를 한계비용 7 아래에서 비교합니다. 두 관계는 모두 수량 6에서 가격 7을 지나지만 서로 다른 수요입니다. 두
            이익을 가장 크게 하는 수량은 이번 숫자에서는 3으로 같고 가격은 각각 10과 13입니다.
          </p>
          <p className="leading-7">두 최적점의 탄력성 절댓값은 각각 10/3과 13/6입니다. 가격 기준 마크업은 30%와 6/13, 약 46.15%입니다. 이는 두 수요를 선택해 만든 비교입니다. 기울기만 보고 모든 가격에서 같은 탄력성을 갖는다거나 실제 대체 상품의 효과를 측정했다고 말할 수는 없습니다.</p>
          <p className="leading-7">이번에는 기본 수요 p = 13 − q를 유지하고 한계비용만 7에서 9로 바꿉니다. 이익 최대 수량은 2, 가격은 11이 되고 탄력성 절댓값은 11/2입니다. 마크업은 (11 − 9)/11 = 2/11, 약 18.18%로 바뀝니다. 비용이 바뀌면 같은 수요에서도 읽는 점과 마크업이 달라집니다.</p>
        </div>
        <MarkupViz />
        <p data-stage-bridge="elasticity-comparison" className="mt-5 text-sm leading-7 text-muted-foreground">다음에는 기본 수요와 비용으로 돌아가 가격 변화와 수량 감소가 잉여에 남기는 결과를 계산합니다.</p>
      </section>
      <section id="what-is-lost" data-teach-level="6" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">13. 이전된 9와 일어나지 않은 거래의 가치 4.5를 나눈다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">같은 수요 p = 13 − q와 한계비용 7에서 가격 7에 수량 6을 거래하는 기준을 둡니다. 이때 소비자 잉여는 밑변 6, 높이 6인 삼각형의 넓이 18입니다. 이 글에서는 고정비가 없고 가격과 비용이 같으므로 생산자 잉여는 0입니다.</p>
          <p className="leading-7">
            가격 10에 수량 3을 파는 경우 소비자 잉여는 3 × 3 ÷ 2 = 4.5입니다. 생산자 잉여는 (10 − 7) × 3 = 9입니다. 합계는 13.5이므로 기준의 18보다
            4.5 작습니다. 생산 비용을 그대로 둔 상태에서, 고객이 지불하려는 값이 비용보다 높은 거래 일부가 일어나지 않은 결과입니다.
          </p>
          <p className="leading-7">소비자 잉여는 18에서 4.5로 13.5 줄었습니다. 이 중 실제로 거래되는 3개에서 가격 차이 3씩인 9는 생산자에게 이전된 몫입니다. 나머지 4.5는 양쪽 어디에도 생기지 않은 잉여입니다. 이 비교에서 생산자 잉여가 이익과 같은 것은 고정비를 0으로 두었기 때문입니다.</p>
          <p className="leading-7">이 계산은 동일한 비용과 정해진 수요를 유지한 한 시점의 잉여 비교입니다. 외부 피해, 미래 투자, 품질, 소득 분배의 가치 판단을 모두 포함하는 사회 평가가 아닙니다. 가격과 수량은 함께 바뀌므로 높은 가격과 줄어든 거래의 관계를 따로 떼어 원인 하나로 단정하지 않습니다.</p>
        </div>
        <SurplusTable />
        <p data-stage-bridge="what-is-lost" className="mt-5 text-sm leading-7 text-muted-foreground">이익의 내부 조건과 잉여 계산을 어떤 상황에 그대로 쓸 수 없는지 확인합니다.</p>
      </section>
      <section id="limits" data-teach-level="7" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">14. 생산 한도·진입 비용·시장 제도가 있으면 다시 비교한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">기본 수요에서 최대 2개만 만들 수 있다면 수량 3은 선택할 수 없습니다. 0부터 2까지 이익이 늘어나므로 2개를 만들고 가격 11을 받습니다. 그때 한계수입은 9이고 한계비용은 7로 서로 다릅니다. 생산 한도에 걸린 최대점에 MR = MC를 요구하면 답을 잃습니다.</p>
          <p className="leading-7">새로 영업을 시작할 때 피할 수 있는 고정비 10이 필요하고 생산하지 않으면 그 비용도 내지 않는 경우를 생각합니다. 운영 중 가장 큰 이익 9에서 10을 빼면 −1이므로 아무것도 하지 않는 0이 더 큽니다. 이미 회수 불가능하게 지출한 10이라면 계속 영업할 때 추가로 얻는 9와 이후 달라지는 비용을 비교해야 합니다.</p>
          <p className="leading-7">미분이 0이라는 조건만으로 일반적인 모형의 전체 최대를 증명할 수는 없습니다. 함수가 매끄럽지 않거나 여러 최대 후보가 있으면 허용되는 후보와 경계를 비교합니다. Cournot의 앞 장 54~55쪽도 정지 조건이 최대뿐 아니라 최소에서 성립할 수 있음을 논의합니다.</p>
          <p className="leading-7">기본 사례의 잉여 손실 4.5에서 기업을 쪼개면 언제나 더 좋다는 결론이 곧바로 나오지는 않습니다. 실제 분할은 생산비·운송·계약·품질·투자를 바꿀 수 있습니다. 앞 글의 비용 동률 수량이 시장보다 크다는 사실만으로 한 기업이 더 싸다는 주장도 성립하지 않습니다. 바뀐 조건의 전체 비용과 거래를 다시 비교해야 합니다.</p>
          <p className="leading-7">가격차별, 여러 상품을 함께 파는 전략, 경쟁자의 반응, 가격 규제와 장기 투자는 이번 단일 상품의 동일 가격 모형을 바꿉니다. 가격이 비용보다 높다는 관찰만으로 원인이나 정책을 모두 판정할 수는 없습니다.</p>
        </div>
        <p data-stage-bridge="limits" className="mt-5 text-sm leading-7 text-muted-foreground">마지막으로 같은 숫자를 바꿨을 때 매출·이익·마크업이 어떻게 움직이는지 예상해 봅니다.</p>
      </section>
      <section id="handoff" data-teach-level="7" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">15. 가격과 수량에서 남는 돈까지 한 번에 따라간다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">가격 10과 수량 3의 이익 9에서 출발했습니다. 가격을 9로 내려 네 개를 팔면 새 매출 9에서 다른 세 개의 차이 3을 빼고 비용 증가 7을 더 고려해야 합니다. 연속적인 수량의 식은 같은 계산의 변화율을 보여 주며 실제 최대는 선택 가능한 범위까지 확인합니다.</p>
          <p className="leading-7">기업 안팎의 선택은 <Link to="/economics/firms/why-firms-exist">기업의 경계</Link>, 설비와 물량의 관계는 <Link to="/economics/firms/scale-and-cost-structure">규모와 비용 구조</Link>에서 연결됩니다. 다음 <Link to="/economics/labor/wage-floor-natural-experiment">임금 하한과 노동시장</Link>에서는 물건을 파는 쪽뿐 아니라 노동을 사는 쪽의 선택과 계약 조건을 봅니다.</p>
        </div>
        <ReviewPrompts questions={[
          "가격을 10에서 9로 내려 판매량이 3개에서 4개가 될 때, 이익은 9에서 얼마로 바뀌나요? (답: 3절)",
          "3개에서 4개로 늘릴 때의 매출 차이 6을 수량 3에서의 미분값 7과 같다고 해도 되나요? (답: 8절)",
          "같은 수요에서 한계비용이 7에서 9로 바뀌면 최적점의 가격 기준 마크업도 그대로 30%인가요? (답: 12절)",
        ]} />
        <ContentBoundary article="market-power-and-markup" />
        <p data-stage-bridge="handoff" className="mt-5 text-sm leading-7 text-muted-foreground">최적조건을 적용한 가정과 실제 주문의 차이를 설명할 수 있으면 다른 수요와 비용도 비교할 수 있습니다.</p>
      </section>
    </div>;
}

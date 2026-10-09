import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import FlowRail from "../world-systems/FlowRail";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import SourceApplication from "../world-systems/SourceApplication";
import TwoPredictionsViz from "./wage-floor-natural-experiment/viz/TwoPredictionsViz";
import WageStopViz from "./wage-floor-natural-experiment/viz/WageStopViz";
import MeasuredViz from "./wage-floor-natural-experiment/viz/MeasuredViz";
import { laborPlan, numberLabel as f } from "./wage-floor-natural-experiment/model";
function PlansTable({ hours, floor = 0 }: { hours: number[]; floor?: number }) {
  return <div className="my-6 overflow-x-auto"><table className="w-full text-left text-sm">
    <caption className="mb-3 text-left leading-6">(가정) 같은 하루의 대안 · {floor ? `최저시급 ${floor}` : "하한 없음"} · 금액은 달러</caption>
    <thead><tr>{["시간", "시급", "수입", "임금 합계", "이익"].map(t => <th scope="col" className="p-2" key={t}>{t}</th>)}</tr></thead>
    <tbody>{hours.map(n => { const p = laborPlan(n, floor); return <tr key={n} className="border-t border-border"><th scope="row" className="p-2">{n}</th>{[p.wage, p.revenue, p.cost, p.profit].map((v, i) => <td className="p-2" key={i}>{f(v)}</td>)}</tr>; })}</tbody>
  </table></div>;
}
/** 연속 노동시간 가정, 별도 정수 사례, 1992년 관측자료의 범위를 구분합니다. */
export default function WageFloorNaturalExperimentArticle() {
  return <div className="space-y-16">
      <section id="overview" data-teach-level="S" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">1. 시급이 높아졌는데 노동을 더 쓰는 경우가 있을까</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">가게가 같은 하루에 노동을 3시간 쓸지 4시간 쓸지 고릅니다. 필요한 시간을 구하려면 시급을 각각 6달러와 7달러로 제시해야 한다고 가정합니다. 4시간을 택하면 새 한 시간에 7달러를 줄 뿐 아니라 나머지 세 시간에도 1달러씩 더 줍니다. 임금 합계는 18에서 28로 늘어납니다.</p>
          <p className="leading-7">
            이때 법이 최저시급을 9달러로 정하면 두 계획 모두 시급 9달러를 적용합니다. 임금 합계는 각각 27과 36이 됩니다. 전체 지급액은 두 계획 모두 높아졌지만 3시간 대신
            4시간을 택할 때의 추가 지급액은 10에서 9로 작아졌습니다. 고용 선택을 이해하려면 이 두 비교를 구분해야 합니다.
          </p>
          <p className="leading-7">먼저 설명용 가게의 계산을 끝까지 따라갑니다. 그다음 실제 법이 바뀐 지역과 비교 지역의 고용을 조사한 논문을 읽습니다. 설명을 위해 정한 수입·임금 숫자와 연구에서 관측한 숫자는 서로 다른 자료입니다.</p>
        </div>

        <p data-stage-bridge="overview" className="mt-5 text-sm leading-7 text-muted-foreground">가게가 선택하는 노동시간과 그 선택에 필요한 입력부터 정합니다.</p>
      </section>
      <section id="black-box" data-teach-level="B" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">2. 수입과 임금 합계를 받아 같은 하루의 계획을 비교한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            입력은 일을 얼마나 맡기면 수입이 얼마나 생기는지, 그 시간을 구하려면 시급을 얼마로 제시해야 하는지입니다. 가게는 각 계획의 수입에서 임금 합계를 빼고 가장 많이 남는 계획을
            고릅니다. 일하지 않는 0시간도 선택할 수 있습니다.
          </p>
          <p className="leading-7">여기서 3시간은 세 사람을 뜻하지 않습니다. 하루에 투입하는 동일한 종류의 노동시간 합계이며 3시간 20분처럼 나눌 수 있습니다. 누구의 시간인지에 따른 생산성 차이와 근무표 제약은 생략합니다. 뒤에서는 사람 수처럼 정수만 가능한 별도 사례도 계산합니다.</p>
          <p className="leading-7">
            모든 시간에 같은 시급을 적용하고 노동 외의 비용은 이번 비교에서 0으로 둡니다. 상품을 파는 가격과 생산 설비도 일정합니다. 실제 가게에서는
            임차료와 재료비, 사회보험, 교육, 초과근무, 퇴직 비용과 수요 변화까지 따져야 합니다. 이 가정 계산을 실제 매장의 손익표로 사용하지는 않습니다.
          </p>
        </div>
        <FlowRail title="노동 계획을 비교하는 순서" steps={[
          { actor: "노동시간", movement: "같은 하루에 쓸 시간을 정하고 그때의 수입을 읽습니다.", receives: "계획별 수입" },
          { actor: "지급 조건", movement: "필요한 시급과 법정 최저시급 중 큰 값을 모든 시간에 적용합니다.", receives: "시간 × 지급 시급" },
          { actor: "선택", movement: "수입에서 임금 합계를 빼고 다른 시간과 0시간을 함께 비교합니다.", receives: "가정 안에서 가장 큰 이익" },
        ]} />
        <p data-stage-bridge="black-box" className="mt-5 text-sm leading-7 text-muted-foreground">3시간과 4시간의 수입까지 채워 실제로 남는 돈을 계산합니다.</p>
      </section>
      <section id="case" data-teach-level="0" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">3. 임금 합계가 18에서 28로 늘 때 수입은 9.5 늘어난다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">설명용 수입표에서 3시간의 수입은 34.5달러, 4시간은 44달러라고 둡니다. 시급에 하한이 없으면 3시간 계획의 임금 합계는 3 × 6 = 18이고 남는 돈은 16.5입니다. 4시간 계획은 4 × 7 = 28을 지급하고 16이 남습니다.</p>
          <p className="leading-7">한 시간 더 쓰는 계획에서 수입은 9.5 늘지만 임금은 10 늘어 이익은 0.5 줄어듭니다. 새 한 시간의 시급 7만 수입 증가 9.5와 비교하면 이익이 늘 것처럼 보입니다. 하지만 다른 세 시간의 시급도 함께 달라진다는 가정이 빠진 계산입니다.</p>
          <p className="leading-7">이 비교는 아직 실행하지 않은 같은 하루의 두 계획입니다. 어제 이미 지급한 급여를 다시 정산한다는 뜻이 아닙니다. 애초에 3시간과 시급 6을 택할 때와, 4시간과 시급 7을 택할 때의 전체 비용을 나란히 놓습니다.</p>
        </div>
        <PlansTable hours={[3, 4]} />
        <p data-stage-bridge="case" className="mt-5 text-sm leading-7 text-muted-foreground">새 시간의 지급액과 앞의 시간에 생기는 차이를 그림에서 나누어 봅니다.</p>
      </section>
      <section id="picture" data-teach-level="1" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">4. 새 시간의 7과 다른 세 시간의 3을 함께 센다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">시급 7의 계획에서는 새 시간에 7달러를 지급합니다. 앞의 세 시간에 해당하는 노동에도 시급이 6에서 7로 바뀌어 총 3달러를 더 지급합니다. 따라서 임금 합계 차이는 7 + 3 = 10입니다. 전체 비용을 먼저 적으면 어느 항목이 빠졌는지 바로 확인할 수 있습니다.</p>
          <p className="leading-7">그림의 마지막 단계에서 최저시급 9를 적용해 보세요. 두 계획의 시급이 모두 9가 되므로 앞의 세 시간에 해당하는 지급액은 서로 같습니다. 새 한 시간의 9만 더 지급하면 됩니다. 그래서 더 높은 시급과 더 작은 추가 비용이 동시에 나타납니다.</p>
          <p className="leading-7">이것은 인상 후 모든 계획이 더 이익이라는 뜻은 아닙니다. 4시간 계획의 남는 돈도 16에서 8로 줄어듭니다. 다만 인상 후의 선택지끼리 비교하면 3시간의 7.5보다 4시간의 8이 큽니다. 인상 전후의 이익 수준과 같은 조건 안에서의 선택을 구분합니다.</p>
        </div>
        <WageStopViz />
        <p data-stage-bridge="picture" className="mt-5 text-sm leading-7 text-muted-foreground">세 시간과 네 시간만 비교한 결과가 전체 선택에서도 성립하는지 확인할 준비를 합니다.</p>
      </section>
      <section id="why" data-teach-level="2" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">5. 지급 시급 하나로 고용의 방향을 정할 수 없다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">최저시급 9에서 5시간을 쓰면 수입은 52.5, 임금 합계는 45여서 7.5가 남습니다. 3시간과 5시간 모두 4시간의 이익 8보다 작습니다. 다만 이 세 계획의 비교만으로 가능한 모든 시간의 최대를 증명하지는 못합니다. 뒤에서 중간 시간을 포함한 수입식 전체를 확인합니다.</p>
          <p className="leading-7">한편 가게가 언제나 시급 8에 필요한 시간을 구할 수 있다면 계산이 달라집니다. 3시간에서 4시간으로 갈 때 다른 시간의 시급이 바뀌지 않으므로 임금 합계는 8만 늘어납니다. 더 많은 시간을 구할 때 시급을 올려야 하는지 여부가 비교의 출발점을 바꿉니다.</p>
          <p className="leading-7">
            주변에 가게가 많다는 사실만으로 시급 8에 원하는 시간을 모두 구할 수 있다고 결론 내릴 수는 없습니다. 통근 거리, 구직에 드는 시간, 근무 조건과 필요한 숙련이 다르면
            구직자가 쉽게 옮기지 못할 수 있습니다. 어느 조건이 실제 가게에 가까운지는 관측 자료로 가립니다.
          </p>
          <p className="leading-7">지금까지 확인한 것은 같은 수입표에서도 지급 조건에 따라 3시간에서 4시간으로 옮기는 판단이 달라진다는 점입니다. 다음 절의 이름들은 이 두 계산을 짧게 가리키기 위해 붙입니다. 이름 자체가 어느 조건이 현실에 맞는지를 결정하지는 않습니다.</p>
        </div>
        <PlansTable hours={[3, 4, 5]} floor={9} />
        <p data-stage-bridge="why" className="mt-5 text-sm leading-7 text-muted-foreground">계산의 역할을 알았으니 노동의 추가 수입과 고용주의 지급 조건에 이름을 붙입니다.</p>
      </section>
      <section id="names" data-teach-level="3" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">6. 노동의 추가 수입, 임금 수용, 수요독점을 구분한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">노동을 아주 조금 더 투입할 때 늘어나는 수입의 비율을 한계수입생산이라고 부릅니다. 상품가격이 일정하다는 이 글의 가정에서는 추가 생산량에 상품가격을 곱한 한계생산가치와 같습니다. 상품을 더 팔기 위해 가격도 내려야 한다면 두 개념을 같은 값으로 두면 안 됩니다.</p>
          <p className="leading-7">가게가 노동의 시급을 주어진 값으로 받아들이면 임금 수용자로 모형화합니다. 더 많은 노동을 구하려면 시급을 올려야 하는 고용주는 노동공급 관계를 마주합니다. 노동을 사는 쪽의 힘을 분석하는 수요독점 모형이 이 경우를 설명합니다. 고용주가 문자 그대로 한 곳인 경우가 가장 단순하지만 여러 고용주와 구직 마찰이 있는 상황에서도 이런 힘이 생길 수 있습니다.</p>
          <p className="leading-7">
            최저임금은 지급할 수 있는 임금의 법정 하한입니다. 법정 하한과 실제 지급 임금은 같지 않을 수 있습니다. 뒤의 연구에서는 정책이 바뀐 쪽과 비교 쪽의 전후 변화 차이를
            계산하며 이를 차이의 차이 방법이라고 부릅니다. 계산값을 정책의 인과효과로 읽으려면 추가 가정이 필요합니다.
          </p>
        </div>

        <p data-stage-bridge="names" className="mt-5 text-sm leading-7 text-muted-foreground">먼저 34.5와 44가 나온 수입표를 연속적인 노동시간 식으로 적습니다.</p>
      </section>
      <section id="two-counts" data-teach-level="4" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">7. 한 시간의 차이와 순간적인 변화율은 다르다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">노동시간을 n이라 하고 하루 수입을 B(n) = 13n − n²/2로 둡니다. 노동을 아주 조금 늘릴 때의 변화율은 v(n) = B′(n) = 13 − n입니다. 3시간에서의 변화율은 10이고 4시간에서는 9입니다. 실제 3시간에서 4시간으로 늘릴 때는 B(4) − B(3) = 9.5를 사용합니다.</p>
          <p className="leading-7">변화율이 직선으로 10에서 9까지 내려가므로 이 한 시간 구간의 수입 증가는 평균 변화율 9.5에 구간 길이 1을 곱한 값입니다. n번째 정수 단위의 수입이 곧 13 − n이라는 뜻이 아닙니다. 순간 변화율과 유한한 구간의 차이를 섞으면 이후 최적점도 달라집니다.</p>
          <p className="leading-7">노동이 늘수록 변화율이 내려가는 것은 이번 모형의 가정입니다. 고정된 조리대에서 서로 기다리는 상황을 떠올릴 수 있지만 모든 일에서 같은 모양은 아닙니다. 이 감소가 없어도 추가 수입이 비용보다 작거나 생산 한도가 있다면 유한한 고용 선택이 생길 수 있습니다.</p>
        </div>
        <ExplainedFormula question="v(3)=10인데 왜 한 시간의 수입 증가는 9.5인가요?"
          idea="각 시점의 변화율과 두 전체 수입의 차이를 구분합니다."
          formula={String.raw`B(n)=13n-\frac{n^2}{2}`}
          annotatedFormula={String.raw`\begin{gathered}B'(n)=v(n)=13-n\\B(3)=34.5,\ B(4)=44\\B(4)-B(3)=9.5\end{gathered}`}
          operations={[
            { expression: String.raw`v(3)=10,\quad v(4)=9`, annotation: "각 노동시간에서 읽은 순간 변화율입니다." },
            { expression: String.raw`\int_3^4(13-n)\,dn=9.5`, annotation: "3시간에서 4시간까지의 변화율을 합친 실제 수입 증가입니다." },
          ]}
          terms={[
            { symbol: "n", name: "하루의 노동시간", description: "0부터 13까지 연속적으로 나눌 수 있는 동질 노동시간입니다." },
            { symbol: "B", name: "하루 수입", description: "이번 예에서 노동 외의 비용은 생략했습니다." },
            { symbol: "v", name: "노동시간에 대한 수입 변화율", description: "고정된 상품가격 아래에서는 한계생산가치와 같습니다." },
          ]}
          assumptions={["가격·설비·다른 비용을 고정한 설명용 함수이며 관측자료의 추정식이 아닙니다.", "n번째 단위의 수입을 13−n으로 놓는 정수 사례는 뒤에서 별도로 계산합니다."]}
          interpretation="구간 전체를 비교할 때는 B의 차이를 쓰고, 연속적인 내부 후보를 찾을 때는 미분을 씁니다." />
        <p data-stage-bridge="two-counts" className="mt-5 text-sm leading-7 text-muted-foreground">같은 수입식에 고정된 시급 8을 먼저 적용합니다.</p>
      </section>
      <section id="many-buyers" data-teach-level="4" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">8. 시급을 주어진 값으로 받으면 5시간을 고른다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">시급 8을 바꿀 수 없고 필요한 시간을 구할 수 있는 가게의 이익은 B(n) − 8n = 5n − n²/2입니다. 이를 12.5 − (n − 5)²/2로 쓰면 5시간에서 최대라는 것이 보입니다. 이 지점의 추가 수입 변화율도 13 − 5 = 8입니다.</p>
          <p className="leading-7">경쟁하는 노동시장의 기준을 만들 때는 전체 노동수요의 역관계를 13 − n, 공급의 역관계를 n + 3으로 둡니다. 둘이 같은 지점은 노동 5시간·시급 8입니다. 시장 전체에서 임금이 정해지는 관계와, 개별 가게가 이미 정해진 시급을 받아들이는 조건은 구분합니다.</p>
          <p className="leading-7">
            이번 곡선과 연속 시간에서는 유일한 해가 나오지만 일반적으로 내부의 미분 등식만으로 전체 최대를 확정할 수는 없습니다. 정수 인원이나 생산 한도, 고용하지 않는 선택이 있으면
            그 대안도 비교합니다. 고용주의 수가 많다는 이유만으로 임금 수용을 자동으로 가정하지 않습니다.
          </p>
        </div>

        <p data-stage-bridge="many-buyers" className="mt-5 text-sm leading-7 text-muted-foreground">이번에는 더 많은 시간을 구하려면 모든 시간의 시급을 올려야 하는 고용주를 계산합니다.</p>
      </section>
      <section id="one-buyer" data-teach-level="5" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">9. 임금 총액을 미분하면 시급보다 큰 추가 비용이 나온다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">필요한 시급이 w(n) = n + 3이면 임금 총액은 W(n) = n(n + 3)입니다. 이를 미분한 2n + 3은 시급 n + 3보다 n만큼 큽니다. 시간을 조금 더 구할 때 기존 시간에 해당하는 지급액도 함께 늘기 때문입니다.</p>
          <p className="leading-7">이익은 B − W = 10n − 3n²/2입니다. 최대점은 n = 10/3, 즉 3시간 20분입니다. 이때 시급은 19/3, 추가 수입 변화율과 임금 총액의 변화율은 모두 29/3입니다. 고용주는 시급과 추가 수입이 같아질 때까지 노동을 늘리지 않습니다. 전체 임금 증가를 비교해야 합니다.</p>
          <p className="leading-7">
            이번 이익식을 완전제곱으로 쓰면 전체 최대도 확인됩니다. 일반적인 매끄러운 내부 해에서 B′ = W′는 필요조건이며 정수 선택·최저임금으로 꺾인 점·생산 한도에서는 전체 값을
            다시 비교해야 합니다.
          </p>
        </div>
        <ExplainedFormula question="왜 시급 19/3보다 추가 수입 29/3이 큰데도 멈추나요?"
          idea="한 시간의 시급과 모든 시간에 지급하는 임금 총액의 미분을 구분합니다."
          formula={String.raw`W'(n)=w(n)+nw'(n)`}
          annotatedFormula={String.raw`\begin{gathered}W(n)=n(n+3)\\W'(n)=2n+3\\\pi(n)=10n-\frac32n^2\\=\frac{50}{3}-\frac32\left(n-\frac{10}{3}\right)^2\end{gathered}`}
          operations={[
            { expression: String.raw`13-n=2n+3`, annotation: "이 사례의 내부 후보는 노동시간 10/3입니다." },
            { expression: String.raw`w=\frac{19}{3},\quad v=W'=\frac{29}{3}`, annotation: "추가 수입은 시급보다 크지만 전체 임금의 추가 비용과 같습니다." },
          ]}
          terms={[
            { symbol: "W", name: "임금 총액", description: "같은 날 모든 노동시간에 같은 시급을 지급합니다." },
            { symbol: String.raw`nw'`, name: "다른 시간의 임금 증가", description: "시간을 더 구하기 위해 시급을 높이는 영향입니다." },
            { symbol: String.raw`\pi`, name: "이익", description: "이번 가정에서는 노동에서 생긴 수입에서 임금 총액을 뺍니다." },
          ]}
          assumptions={["연속 노동시간·같은 시급·미분 가능한 공급 관계·내부 선택입니다.", "아래로 굽은 이번 이익식이 전체 최대를 보장합니다. 등식만으로 일반적인 최대를 확정하지 않습니다."]}
          interpretation="노동시간 10/3과 시급 19/3은 가정한 생산과 공급 관계가 함께 정한 결과입니다." />
        <ExplainedFormula question="시급과 추가 수입의 차이는 노동공급 반응과 어떻게 연결되나요?"
          idea="내부 조건을 시급으로 나누고 같은 점의 노동공급 탄력성을 대입합니다."
          formula={String.raw`\frac{v-w}{w}=\frac1{\varepsilon_s}`}
          annotatedFormula={String.raw`\begin{gathered}v=w+nw'\\\varepsilon_s=\frac{dn}{dw}\frac wn=\frac{w}{nw'}\\\frac{v-w}{w}=\frac{nw'}w=\frac1{\varepsilon_s}\\\varepsilon_s=\frac{19}{10},\quad\frac{v-w}{w}=\frac{10}{19}\end{gathered}`}
          operations={[
            { expression: String.raw`v-w=nw'`, annotation: "동일 임금의 내부 조건에서 다른 시간의 지급 증가를 분리합니다." },
            { expression: String.raw`\frac{10}{19}\approx52.63\%`, annotation: "분모를 시급으로 둔 차이입니다. 추가 수입을 분모로 둔 비율과는 다릅니다." },
          ]}
          terms={[
            { symbol: String.raw`\varepsilon_s`, name: "해당 점의 노동공급 탄력성", description: "작은 시급 변화에 대한 노동시간의 비율 반응입니다." },
            { symbol: String.raw`w'`, name: "시간에 따른 필요 시급의 변화율", description: "이 유도에서는 양수이며 공급 관계를 미분해 뒤집을 수 있습니다." },
          ]}
          assumptions={["양의 n·w, 매끄러운 내부 해, 미분 가능한 양의 공급 기울기와 모든 시간의 같은 임금이 필요합니다.", "최저임금의 꺾인 점이나 정수 인원에 이 등식을 직접 대입하지 않습니다."]}
          interpretation="생산성이나 공급 조건이 변하면 최적점과 그 지점의 탄력성이 함께 바뀝니다." />
        <p data-stage-bridge="one-buyer" className="mt-5 text-sm leading-7 text-muted-foreground">최저임금을 적용할 때는 이 미분값에 하한을 씌우기 전에 임금 총액부터 바꿉니다.</p>
      </section>
      <section id="two-predictions" data-teach-level="6" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">10. 최저시급은 총액을 바꾸고 그 뒤에 추가 비용을 계산한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            최저시급을 F라 하면 지급 시급은 F와 n + 3 중 큰 값입니다. 따라서 임금 총액은 W_F(n) = n × max(F, n + 3)입니다. 원래 추가 비용 2n + 3과 F
            중 큰 값을 쓰는 방식은 틀립니다. 최저임금은 지급 시급에 적용되며 추가 비용은 바뀐 총액에서 다시 계산합니다.
          </p>
          <p className="leading-7">예를 들어 F = 9이면 6시간까지는 시급 9로 필요한 시간을 구할 수 있다고 가정합니다. 이 구간의 임금 총액은 9n이고 추가 비용은 9입니다. 6시간을 넘겨 더 구하려면 필요한 시급 n + 3이 9보다 높아져 총액은 다시 n(n + 3)이 됩니다. 두 식이 만나는 점에서는 좌우의 기울기를 나눠 봅니다.</p>
          <p className="leading-7">
            전체 이익을 비교하면 최저시급이 19/3 이하일 때는 원래 10/3시간을 유지합니다. 그보다 높고 8 이하이면 F − 3시간을 고릅니다. 8부터 13까지는 13 − F시간으로
            줄며 13 이상에서는 0시간입니다. 처음에는 구할 수 있는 노동이 늘고 그 이후에는 높아진 시급 때문에 선택하는 노동이 줄어듭니다.
          </p>
          <p className="leading-7">
            최저시급 9에서는 4시간을 고릅니다. 인상 전 경쟁 기준 5시간보다는 적지만 더 구하려면 시급을 올려야 했던 고용주의 10/3시간보다는 많습니다. 그러나 12로 높이면 두 모형
            모두 1시간으로 줄어듭니다. 최저임금의 고용효과 방향은 출발 조건과 인상 폭을 함께 봐야 합니다.
          </p>
        </div>
        <ExplainedFormula question="최저시급을 올릴 때 노동시간은 왜 처음부터 계속 줄지 않나요?"
          idea="총액의 두 구간과 꺾인 점을 비교해 전체 최대를 고릅니다."
          formula={String.raw`W_F(n)=n\max(F,n+3)`}
          annotatedFormula={String.raw`\begin{gathered}W_F'(n)=F\quad(n<F-3)\\W_F'(n)=2n+3\quad(n>F-3)\\n^*(F)=\begin{cases}10/3&0\le F\le19/3\\F-3&19/3<F\le8\\13-F&8<F<13\\0&F\ge13\end{cases}\end{gathered}`}
          operations={[
            { expression: String.raw`13-n-F=0`, annotation: "시급 F로 필요한 시간을 구할 수 있는 구간의 내부 후보입니다. 후보가 그 구간에 속하는지도 확인합니다." },
            { expression: String.raw`n=F-3`, annotation: "19/3과 8 사이에서는 이 꺾인 점의 왼쪽에서 이익이 늘고 오른쪽에서 줄어듭니다." },
            { expression: String.raw`F=9\Rightarrow n^*=4`, annotation: "최적점 4는 시급 9로 구할 수 있는 6시간보다 작습니다." },
          ]}
          terms={[
            { symbol: "F", name: "최저시급", description: "0 이상이며 모든 지급 시급에 적용합니다." },
            { symbol: String.raw`W_F`, name: "하한 적용 후 임금 총액", description: "임금 총액을 먼저 바꾸고 그 차이나 미분을 계산합니다." },
            { symbol: String.raw`n^*`, name: "가장 큰 이익의 노동시간", description: "정지점·꺾인 점·0과 13의 경계를 함께 비교한 결과입니다." },
          ]}
          assumptions={["각 구간의 이익은 아래로 굽고, 꺾인 점과 허용 범위도 함께 비교합니다.", "F−3이 음수이면 양의 노동시간에서 첫 구간은 존재하지 않습니다. 실제 정책의 최적 수준을 추정한 식은 아닙니다."]}
          interpretation="이 모형에서 노동시간은 10/3을 유지하다가 5까지 늘고 다시 0까지 줄어듭니다." />
        <AlgorithmBlock title="최저시급 적용 후 다시 고르는 절차"
          input={["수입 B(n)=13n−n²/2와 필요한 시급 n+3", "최저시급 F≥0, 선택 범위 0≤n≤13"]}
          steps={[
            { code: "W_F(n) = n × max(F, n+3)", note: "모든 시간에 실제 지급할 시급을 곱합니다." },
            { code: "구간별 내부 후보 + 꺾인 점 + 허용 범위 끝을 모은다", note: "미분이 0인 후보가 해당 구간에 속하는지 확인합니다. 정수만 가능하면 허용된 정수도 비교합니다." },
            { code: "B(n) − W_F(n)을 비교한다", note: "0시간을 포함해 가장 큰 값을 고릅니다. 동률이 있으면 모두 남깁니다." },
          ]}
          output="F=9이면 n=4, 수입44−임금36=이익8" />
        <TwoPredictionsViz />
        <p data-stage-bridge="two-predictions" className="mt-5 text-sm leading-7 text-muted-foreground">
            정수 인원에도 같은 식을 그대로 써도 되는지 살펴봅니다.
          </p>
      </section>
      <section id="finite-units" data-teach-level="6" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">11. 정수 인원에서는 동률을 숨기지 않는다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">별도 사례로 첫 단위가 수입 12를, 둘째가 11을, 셋째가 10을 더한다고 둡니다. 이때 n개 단위의 총수입은 12 + 11 + … + (13 − n), 즉 12.5n − n²/2입니다. 앞의 연속 함수 B(n) = 13n − n²/2와 다른 함수입니다. 앞 함수의 n번째 한 시간 구간 수입은 13.5 − n입니다.</p>
          <p className="leading-7">이 별도 정수 사례에서 시급 8을 주어진 값으로 받으면 4단위와 5단위의 이익이 모두 10으로 같습니다. 필요한 시급 n + 3을 모두에게 지급하면 3단위의 이익 15가 최대이며 4단위에서는 14입니다. 정수 단위의 추가 수입 9와 추가 임금 10을 비교한 결과입니다.</p>
          <p className="leading-7">같은 정수 사례에 최저시급 9를 적용하면 3단위와 4단위의 이익이 모두 6입니다. 최저시급 12에서는 0단위와 1단위가 이익 0으로 같습니다. 따라서 각각 반드시 4명과 1명이라고 유일한 답을 정하면 안 됩니다. 연속 시간의 결과와 정수 인원의 결과를 섞지 않는 것이 핵심입니다.</p>
          <p className="leading-7">또 임금을 사람마다 다르게 줄 수 있다는 사실만으로 모든 임금 차이가 사라지는 것도 아닙니다. 각 노동 단위를 정확한 최소 수용액에 구하고 다른 단위의 지급액을 바꾸지 않을 수 있는 특별한 경우에 추가 비용식이 달라집니다. 부분적인 차등 임금이나 협상, 구직 마찰은 그 자체로 이 조건을 보장하지 않습니다.</p>
        </div>

        <p data-stage-bridge="finite-units" className="mt-5 text-sm leading-7 text-muted-foreground">설명용 숫자의 계산을 마쳤으니 실제 논문에서 무엇을 조사했는지 봅니다.</p>
      </section>
      <section id="what-happened" data-teach-level="6" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">12. 실제 연구에서는 법정 하한과 두 지역의 고용을 조사했다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">Card·Krueger(1994)는 1992년 4월 1일 뉴저지의 법정 최저시급이 4.25에서 5.05달러로 오른 사건을 연구했습니다. 펜실베이니아의 하한은 4.25달러였습니다. 모든 근로자의 실제 시급이 이 하한과 같았다는 뜻은 아닙니다. 첫 조사는 2~3월, 후속 조사는 인상 후 7~8개월인 11~12월입니다.</p>
          <p className="leading-7">
            초기 조사 410곳과 각 표의 유효 관측 표본은 구분합니다. 표 3의 3행은 각 시점에 고용자료가 있는 가게 평균의 변화입니다. 뉴저지 +0.59와 펜실베이니아 −2.16을
            표시된 숫자로 빼면 2.75이며 논문의 원계산 보고값은 반올림 차이가 있는 2.76입니다. 4행은 두 시점 모두 고용자료가 있는 같은 가게의 변화입니다.
          </p>
          <p className="leading-7">
            정규직 환산 인원(FTE)은 관리자 포함 전일제 수에 시간제 수의 절반을 더한 값입니다. 실제 사람 수나 정확한 노동시간 합계와 같지 않습니다. 표 3은 영구 폐업 6곳을
            0으로, 일시 휴업 4곳을 결측으로 처리하고 5행에서만 일시 휴업도 0으로 바꿉니다.
          </p>
        </div>
        <div className="my-6 overflow-x-auto"><table className="w-full text-left text-sm">
          <caption className="mb-3 text-left leading-6">Card·Krueger(1994), 표 3 · 가게당 FTE 변화</caption>
          <thead><tr>{["표본", "NJ", "PA", "보고 차이"].map(t => <th scope="col" className="p-2" key={t}>{t}</th>)}</tr></thead>
          <tbody><tr className="border-t border-border"><th scope="row" className="p-2">3행 · 각 시점</th><td className="p-2">+0.59</td><td className="p-2">−2.16</td><td className="p-2">2.76</td></tr>
          <tr className="border-t border-border"><th scope="row" className="p-2">4행 · 같은 가게</th><td className="p-2">+0.47</td><td className="p-2">−2.28</td><td className="p-2">2.75</td></tr></tbody>
        </table><p className="mt-3 text-sm leading-7 text-muted-foreground">보고 차이의 표준오차는 각각 1.36과 1.34입니다. 3행의 표시 수치 재계산 2.75와 보고값 2.76을 구분합니다.</p></div>
        <SourceApplication source="Card·Krueger(1994), 표 3의 4행" excerpt="balanced sample of stores" application="두 시점 모두 고용자료가 있는 가게로 비교 대상을 맞춘 행입니다. +0.47과 −2.28을 빼서 2.75를 얻으며, 각 시점의 유효 표본을 사용한 3행과 섞지 않습니다." />
        <CitationBlock source="Card·Krueger · Minimum Wages and Employment (1994)" citeKey={1} href="https://davidcard.berkeley.edu/papers/njmin-aer.pdf">관련 본문 772~780·787~792쪽을 읽고 인쇄 780쪽 표 3과 788쪽 표 7의 실제 이미지를 대조했습니다. 보고 수치와 표본·주석을 확인한 것이며 원자료 전체로 회귀를 재현한 것은 아닙니다.</CitationBlock>
        <MeasuredViz />
        <p data-stage-bridge="what-happened" className="mt-5 text-sm leading-7 text-muted-foreground">두 변화의 차이를 계산하는 일과 인과효과로 해석하는 일을 구분합니다.</p>
      </section>
      <section id="comparison-conditions" data-teach-level="6" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">13. 비교 지역은 바뀌지 않았을 때의 경로를 대신한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">방법을 작은 가정 숫자로 확인해 봅니다. 인상 지역의 평균이 20에서 21로, 비교 지역은 25에서 23으로 바뀌었다고 합시다. 두 변화의 차이는 (21 − 20) − (23 − 25) = 3입니다. 처음 평균이 20과 25로 다르다는 사실만으로 이 계산이 무효가 되는 것은 아닙니다.</p>
          <p className="leading-7">
            정책이 없었더라도 인상 지역이 비교 지역처럼 2만큼 줄었다고 가정하면 인상 지역의 미인상 결과는 18입니다. 관측된 21과의 차이 3을 정책효과로 읽을 수 있습니다. 이
            반사실적 추세가 같다는 가정이 평행추세입니다. 인상 지역에만 별도로 수요 증가가 생겼다면 3에는 그 영향도 섞입니다.
          </p>
          <p className="leading-7">가까운 지역이거나 시작 평균이 비슷하다는 것만으로 평행추세가 보장되지는 않습니다. 여러 인상 전 시점의 추세, 다른 정책·경기 충격, 시행 전의 고용 조정, 지역을 오가는 근로자·소비자의 영향, 같은 방식의 조사와 표본 구성을 확인해야 합니다. 인상 전 차이가 작아 보여도 이후의 반사실적 경로를 완전히 증명할 수는 없습니다.</p>
          <p className="leading-7">원 연구가 뉴저지 안에서도 시작 임금별로 비교한 것은 비교집단을 점검하는 추가 방법입니다. 당시 5달러 이상 집단을 곧바로 전혀 영향받지 않은 집단으로 간주하지는 않습니다. 5.00~5.04달러도 새 하한 5.05보다 낮습니다. 어느 가게가 얼마나 직접 영향을 받았는지와 간접 영향을 함께 확인해야 합니다.</p>
        </div>
        <ExplainedFormula question="두 지역의 변화 차이는 어떤 가정 아래 정책효과가 되나요?"
          idea="비교 지역의 변화를 인상 지역의 미인상 경로로 옮길 수 있는지 확인합니다."
          formula={String.raw`\widehat\tau=\Delta Y_T-\Delta Y_C`}
          annotatedFormula={String.raw`\begin{gathered}\widehat\tau=(21-20)-(23-25)=3\\Y_{T,\mathrm{no\ change}}=20-2=18\\21-18=3\end{gathered}`}
          operations={[
            { expression: String.raw`\Delta Y_C=-2`, annotation: "가정 사례에서 비교 지역의 변화입니다." },
            { expression: String.raw`Y_{T,\mathrm{no\ change}}=18`, annotation: "정책이 없었다면 인상 지역도 같은 2만큼 줄었을 것이라는 가정을 적용한 값입니다." },
          ]}
          terms={[
            { symbol: "T", name: "정책이 바뀐 지역", description: "관측된 결과와 정책이 없었을 결과는 동시에 볼 수 없습니다." },
            { symbol: "C", name: "비교 지역", description: "정책이 없을 때의 변화 경로를 대신하도록 선택합니다." },
            { symbol: String.raw`\widehat\tau`, name: "변화 차이 추정치", description: "표본 오차와 식별 가정의 불확실성을 함께 살핍니다." },
          ]}
          assumptions={["정책이 없었을 때 두 지역의 평균 변화가 같아야 합니다.", "선행 반응·비교 지역 파급·측정과 표본 변화·동시 충격을 검토합니다. 숫자 20·21·25·23은 방법 설명을 위한 별도 가정입니다."]}
          interpretation="차이의 차이는 단순한 전후 비교를 개선하지만, 계산 형식만으로 인과를 보장하지 않습니다." />
        <p data-stage-bridge="comparison-conditions" className="mt-5 text-sm leading-7 text-muted-foreground">고용 결과 하나로 모형을 확정하지 않으려면 다른 결과도 함께 비교해야 합니다.</p>
      </section>
      <section id="prices-and-models" data-teach-level="6" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">14. 고용이 늘었다는 관측만으로 수요독점을 입증하지 않는다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">표 7의 가격 비교는 다른 표본과 단위를 사용합니다. 유효 자료가 있는 315곳에서 식사 가격의 로그 변화에 대한 뉴저지 계수는 (i)열 0.033, 표준오차는 0.014입니다. 표시 계수를 정확히 지수 변환하면 exp(0.033) − 1 ≈ 3.36%입니다. 원문 787쪽의 3.2%라는 서술을 이 표시 계수와 정확히 같은 환산값으로 쓰지 않습니다.</p>
          <p className="leading-7">저자들은 고용과 가격의 결과를 자신들이 검토한 단순 경쟁·수요독점·탐색 모형이 함께 설명하기 어렵다고 논의합니다. 이것은 가능한 모든 모형을 배제했다는 뜻이 아닙니다. 서비스 품질, 상품 구성, 가격 결정과 수요 반응 같은 조건이 달라지면 모형의 예측도 달라질 수 있습니다.</p>
          <p className="leading-7">앞에서 만든 설명용 가게는 상품가격을 고정했습니다. 따라서 그 모형 자체에서 상품가격 하락을 예측한 적은 없습니다. 고용 증가가 생산량 증가로 이어지고 그것이 시장가격을 낮춘다고 말하려면 생산·상품수요·시장 전체의 가격 결정 조건을 더 연결해야 합니다. 하나의 예측과 관측이 맞았다고 해서 그 모형만 맞는다고 결론 내릴 수는 없습니다.</p>
        </div>
        <SourceApplication source="Card·Krueger(1994), 표 7" excerpt="change in the log price" application="0.033은 달러 변화나 정확한 3.2%가 아니라 로그 가격 변화의 지역 간 차이 계수입니다. 고용 표의 FTE 차이와 표본·측정 단위가 다르므로 숫자를 같은 종류의 결과처럼 합치지 않습니다." />
        <p data-stage-bridge="prices-and-models" className="mt-5 text-sm leading-7 text-muted-foreground">
            자료를 바꾸어 같은 결과가 나오는지 살핀 후속 연구로 넘어갑니다.
          </p>
      </section>
      <section id="measurement-and-reanalysis" data-teach-level="6" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">15. 전화 응답과 급여 자료, 표본 선택도 검토 대상이다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            Neumark·Wascher의 1995년 NBER 작업논문은 230곳의 급여 기록을 이용해 전화 조사 자료를 재검토했습니다. 저자들은 전화 조사 쪽 고용 변화의 변동이 더 크며
            자신들의 급여 자료에서는 뉴저지의 상대 고용 감소가 나타난다고 보고했습니다.
          </p>
          <p className="leading-7">Card·Krueger의 1998년 NBER 작업논문은 BLS의 ES-202 행정자료에서 뉴저지가 비슷하거나 조금 더 빠른 고용 증가를 보인다고 보고했습니다. 또한 Neumark·Wascher의 급여 표본이 BLS 자료와도, 자신들의 앞선 표본과도 다르게 나온 이유를 1995년 EPI 연구에 펜실베이니아 자료를 처음 제공한 한 가맹점주가 소유한 소수 매장에서 찾았습니다.</p>
          <p className="leading-7">그 표본의 고용 추세가 자료를 주별·격주·월별로 보고한 매장끼리 크게 다르다는 점도 함께 지적했습니다. 양쪽이 어떤 자료와 기간을 비교했는지가 논쟁의 일부였습니다.</p>
          <p className="leading-7">여기서는 두 작업논문의 초록에 보고된 쟁점을 확인했습니다. 이를 2000년 출판본 전체나 그 뒤의 모든 연구를 검증한 결론으로 취급하지 않습니다. “급여 자료이므로 무조건 정답”이나 “전화 조사 결과이므로 무조건 무효”라는 선택 대신, 자료의 오류·대표성·기간·추정 대상을 함께 확인해야 한다는 점을 배웁니다.</p>
        </div>
        <CitationBlock source="Neumark·Wascher · NBER Working Paper 5224 (1995)" citeKey={2} href="https://www.nber.org/system/files/working_papers/w5224/w5224.pdf">공개 작업논문 초록의 실제 페이지를 읽었습니다. 여기서는 자료와 보고 결론의 차이만 소개하며 전체 추정표를 재현했다고 주장하지 않습니다.</CitationBlock>
        <CitationBlock source="Card·Krueger · NBER Working Paper 6386 (1998)" citeKey={3} href="https://www.nber.org/system/files/working_papers/w6386/w6386.pdf">공개 작업논문 표지와 초록의 실제 페이지를 읽었습니다. ES-202 자료와 급여 표본·보고 간격에 관한 저자의 보고 범위에 한정합니다.</CitationBlock>
        <p data-stage-bridge="measurement-and-reanalysis" className="mt-5 text-sm leading-7 text-muted-foreground">가정 모형과 연구 결과가 각각 말할 수 있는 범위를 정리합니다.</p>
      </section>
      <section id="limits" data-teach-level="7" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">16. 방향을 이해하는 모형과 정책을 결정하는 자료를 구분한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            같은 시급으로 노동을 더 구할 수 있는지, 모든 시간의 시급이 함께 바뀌는지에 따라 추가 비용이 달라집니다. 최저임금으로 꺾인 점에서는 미분 등식을 그대로 적용할 수 없고 정수
            인원에서는 여러 선택이 동률일 수 있습니다. 이 구분이 설명용 계산의 범위입니다.
          </p>
          <p className="leading-7">실제 최저임금의 결과에는 노동시간과 인원, 근로자 구성, 생산성, 가격, 품질, 이윤도 영향을 줍니다. 새 가게의 진입과 폐업, 장기 투자도 달라질 수 있습니다. 짧은 기간의 기존 가게 고용만으로 모든 효과를 합산할 수는 없습니다. 같은 고용 수준이라도 누가 채용되고 누가 일을 잃었는지에 따라 분배 결과가 다를 수 있습니다.</p>
          <p className="leading-7">1992년 두 지역의 해당 업종에서 나온 추정치를 모든 국가와 산업, 시점, 인상 폭에 그대로 옮기지 않습니다. 지금의 법정 금액을 안내하는 글도 아닙니다. 다른 사례에 적용하려면 노동공급과 상품수요, 시행 조건과 자료의 비교 가능성을 다시 조사해야 합니다.</p>
        </div>

        <p data-stage-bridge="limits" className="mt-5 text-sm leading-7 text-muted-foreground">마지막으로 계산과 자료 해석을 스스로 예측해 봅니다.</p>
      </section>
      <section id="handoff" data-teach-level="7" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">17. 임금 차이의 이유와 측정의 범위를 함께 묻는다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">같은 한 시간의 시급을 보더라도 추가 생산에서 생기는 수입과, 그 시간을 구하는 데 필요한 전체 비용이 다를 수 있습니다. 임금 차이를 볼 때도 생산에서 생기는 차이와 구직·교섭·이동 조건에서 생기는 차이를 함께 물어야 합니다.</p>
          <p className="leading-7">앞 글의 판매가격 선택과 이번 노동 구매는 다른 단위에 생기는 수입·지출 변화까지 세어야 한다는 점에서 연결됩니다. 하지만 실제 시장에서 어느 정도의 힘이 있는지, 정책으로 무엇이 달라지는지는 모형의 식만으로 정할 수 없습니다.</p>
        </div>
        <p className="mt-5 text-sm leading-7"><Link className="underline" to="/economics/firms/market-power-and-markup#marginal-revenue">같은 기간의 판매 계획에서 다른 수량의 수입도 달라지는 이유를 다시 확인합니다.</Link></p>
        <ReviewPrompts questions={[
          "최저시급이 없을 때 3시간에서 4시간으로 늘리면 시급 7만 추가되나요? (답: 3절)",
          "최저시급을 7에서 8로 올리면 이 글의 동일 임금 고용주는 시간을 줄이나요? (답: 10절)",
          "두 지역이 가깝고 인상 전 평균이 비슷하면 변화 차이가 자동으로 인과효과가 되나요? (답: 13절)",
        ]} />
        <ContentBoundary article="wage-floor-natural-experiment" />
      </section>
  </div>;
}

import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import BondCashflowViz from "./bond-pricing-and-yield-curve/viz/BondCashflowViz";
import PriceYieldCurveViz from "./bond-pricing-and-yield-curve/viz/PriceYieldCurveViz";
import YieldCurveShapeViz from "./bond-pricing-and-yield-curve/viz/YieldCurveShapeViz";

/**
 * 채권 가격과 수익률은 같은 정보를 반대 방향으로 적은 것입니다
 *
 * 2편의 할인 식에 실제 청구권을 처음으로 꽂아 넣는 글. 4편이 남긴 "r은 어디서
 * 오는가"의 절반(만기 구조)을 여기서 닫고, 나머지 절반(위험의 값)은 위험 글이
 * 맡는다. 신용위험의 가격은 이 글의 범위가 아니다.
 */
export default function BondPricingAndYieldCurveArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          채권은 2편의 할인 식에 현금흐름을 꽂아 넣은 첫 사례입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            채권은 &ldquo;정해진 날짜에 정해진 금액을 주겠다&rdquo;는 약속입니다.
            현금흐름의 모양이 미리 적혀 있다는 뜻이고, 그러면{" "}
            <Link to="/finance/money/time-value-and-discounting#npv">
              시간의 값을 재는 법
            </Link>
            에서 세운 식에 그 금액들을 그대로 넣기만 하면 값이 나옵니다.
          </p>

          <p className="leading-7">
            그런데 실제 시장에서는 값이 먼저 있고 식이 나중입니다. 사람들이
            사고팔면서 가격이 정해지고, 그 가격을 식에 거꾸로 넣어 &ldquo;이
            가격이 되려면 할인율이 얼마여야 하는가&rdquo;를 되묻습니다. 그
            되물은 값이 수익률입니다.
          </p>

          <p className="leading-7">
            그래서 가격과 수익률은 서로 다른 두 정보가 아니라 같은 정보의 두
            표현입니다. 한쪽이 정해지면 다른 쪽이 따라 정해지고, 분모에 들어가
            있으니 방향은 반대가 됩니다. 채권 이야기가 늘 &ldquo;금리가 오르면
            채권값이 떨어진다&rdquo;로 시작하는 이유입니다.
          </p>
        </div>

        <BondCashflowViz />

        <ContentBoundary article="bond-pricing-and-yield-curve" />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            이 글이 푸는 질문은 둘입니다.{" "}
            <strong>
              금리가 1%포인트 움직일 때 이 채권의 값이 몇 퍼센트 움직일지는
              무엇이 정하는가
            </strong>
            , 그리고{" "}
            <strong>만기가 다르면 왜 금리도 다른가</strong>입니다. 앞은 채권
            하나의 성질이고 뒤는 시장 전체의 모양입니다.
          </p>

          <p className="leading-7">
            순서는 현금흐름에서 가격으로, 가격에서 수익률로 되묻기, 그 수익률이
            움직일 때 가격이 얼마나 흔들리는지, 마지막으로 만기별 금리가 이루는
            곡선입니다. 그 곡선이 4편에서 비워 둔 자리를 채웁니다.
          </p>

          <p className="leading-7">
            발행자가 갚지 못할 가능성은 이 글에서 다루지 않습니다. 여기서는
            약속된 현금흐름이 그대로 들어온다고 두고, 못 받을 위험에 얼마를
            요구해야 하는지는{" "}
            <Link to="/finance/risk/risk-diversification-and-pricing">
              위험의 값
            </Link>
            이 맡습니다.
          </p>
        </div>
      </section>

      <section id="cashflow-to-price" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 1. 현금흐름이 적혀 있으면 가격은 계산의 결과입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            액면 100만 원, 표면금리 연 3%, 만기 3년짜리 채권은 1년 뒤 3만 원,
            2년 뒤 3만 원, 3년 뒤 103만 원을 준다는 뜻입니다. 마지막 해에 이자와
            원금이 함께 들어오는 것이 전부입니다. 모양이 이렇게 단순하기 때문에
            채권이 할인 계산의 첫 연습 대상이 됩니다.
          </p>

          <p className="leading-7">
            각 금액에 그 시점의 할인계수를 곱해 더하면 오늘의 값이 나옵니다.
            할인율을 3%로 잡으면 정확히 100만 원이고, 5%로 잡으면 약 94만
            5,000원, 1%로 잡으면 약 105만 9,000원입니다. 같은 약속인데 무엇과
            견주느냐에 따라 값이 달라집니다.
          </p>

          <p className="leading-7">
            여기서 세 가지 이름이 나옵니다. 할인율이 표면금리와 같으면 가격이
            액면과 같아 액면 발행, 할인율이 더 높으면 액면보다 싸서 할인 발행,
            더 낮으면 액면보다 비싸서 할증 발행이라 부릅니다. 이름은 다르지만
            계산은 하나입니다.
          </p>
        </div>

        <ExplainedFormula
          question="약속된 이자와 원금이 적혀 있을 때 오늘 치러야 할 값은 얼마인가?"
          idea="2편의 순현재가치 식에서 현금흐름 자리에 채권의 약속을 그대로 넣습니다. 매기 들어오는 이자는 같은 금액이 반복되고, 마지막에 원금이 한 번 더해집니다. 그러니 식은 반복되는 부분과 한 번뿐인 부분의 합이 됩니다."
          formula={String.raw`P = \sum_{t=1}^{n} \frac{c \cdot F}{(1+y)^{t}} + \frac{F}{(1+y)^{n}}`}
          annotatedFormula={String.raw`P = \underbrace{\sum_{t=1}^{n} \frac{c \cdot F}{(1+y)^{t}}}_{\text{매기 받는 이자의 현재가치}} + \underbrace{\frac{F}{(1+y)^{n}}}_{\text{만기에 받는 원금의 현재가치}}`}
          operations={[
            {
              expression: String.raw`c \cdot F`,
              annotation: [
                "표면금리를 액면에 곱해 매기 실제로 받는 이자 금액을 구합니다.",
                "곱은 비율로 적힌 약속을 금액으로 바꿉니다.",
              ],
            },
            {
              expression: String.raw`\frac{1}{(1+y)^{t}}`,
              annotation: [
                "각 금액을 자기 시점에서 오늘로 되돌리는 할인계수입니다.",
                "t가 커질수록 작아지므로 먼 이자일수록 가격에 적게 기여합니다.",
              ],
            },
            {
              expression: String.raw`\sum_{t=1}^{n}`,
              annotation: [
                "1기부터 만기 n기까지 모든 이자 지급의 기여를 누적합니다.",
                "같은 금액이 반복되므로 이 합은 2편의 연금 식으로 닫힌 형태로도 쓸 수 있습니다.",
              ],
            },
            {
              expression: String.raw`\frac{F}{(1+y)^{n}}`,
              annotation: [
                "원금은 만기에 한 번만 들어오므로 합이 아니라 항 하나로 더합니다.",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`P`,
              name: "채권 가격",
              description: "지금 이 채권을 사기 위해 치러야 하는 금액입니다.",
            },
            {
              symbol: String.raw`F`,
              name: "액면",
              description:
                "만기에 돌려받기로 한 원금이며 이자 계산의 기준이기도 합니다.",
            },
            {
              symbol: String.raw`c`,
              name: "표면금리",
              description:
                "액면 대비 매기 지급하는 이자의 비율입니다. 발행할 때 정해지면 바뀌지 않습니다.",
            },
            {
              symbol: String.raw`y`,
              name: "할인율",
              description:
                "이 현금흐름을 오늘 값으로 되돌릴 때 쓰는 비율입니다. 시장에서 정해지며 표면금리와 다를 수 있습니다.",
            },
            {
              symbol: String.raw`n`,
              name: "남은 기간의 수",
              description: "만기까지 이자가 지급되는 횟수입니다.",
            },
          ]}
          assumptions={[
            "약속된 금액이 전부 들어온다고 둡니다. 발행자가 갚지 못할 가능성은 이 식에 없습니다.",
            "모든 기간에 같은 할인율을 씁니다. 실제로는 만기마다 다른 금리를 써야 하며 그 구조는 이 글 뒷부분에서 다룹니다.",
            "이자 지급 시점이 정확히 한 기간 간격이라고 둡니다. 발행일과 매수일 사이에 걸친 이자는 별도로 계산해야 합니다.",
          ]}
          interpretation="분모에 y가 있으므로 y가 커지면 P는 작아집니다. 이것이 가격과 수익률이 반대로 움직이는 이유이며, 시장의 심리가 아니라 식의 구조입니다. 다만 이 식만으로는 '얼마나' 움직이는지 알 수 없습니다. 같은 1%포인트라도 만기와 표면금리에 따라 가격 변화 폭이 크게 다르며, 그 크기를 재는 것이 다음 부품입니다."
        />
      </section>

      <section id="ytm" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 2. 시장 가격을 식에 거꾸로 넣으면 수익률 하나가 나옵니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            실제로는 가격이 먼저 관측됩니다. 그러면 앞 식에서 미지수는 y가 되고,
            &ldquo;이 가격이 되려면 할인율이 얼마여야 하는가&rdquo;를 푸는
            문제가 됩니다. 그 답을 <strong>만기수익률</strong>이라 부릅니다.
          </p>

          <p className="leading-7">
            이 문제는 이미 풀어 본 적이 있습니다. 2편의 내부수익률이 순현재가치를
            0으로 만드는 할인율이었듯, 만기수익률은 계산된 가격을 시장 가격과
            같게 만드는 할인율입니다. 같은 방정식이고 같은 수치 해법을 씁니다.
          </p>

          <p className="leading-7">
            다른 점은 하나 있습니다. 채권의 현금흐름은 처음에 한 번 나가고 그
            뒤로는 계속 들어오는 모양이라 부호가 한 번만 바뀝니다. 2편에서 해가
            여러 개 나올 수 있다고 경고했던 조건이 여기서는 성립하지 않으므로,
            만기수익률은 하나로 정해집니다.
          </p>
        </div>

        <AlgorithmBlock
          title="시장 가격에서 만기수익률을 찾는 절차"
          input={[
            "시장에서 관측된 가격 P_mkt",
            "채권의 약속: 액면 F, 표면금리 c, 남은 기간 n",
            "시작값 y0(보통 표면금리)과 허용 오차 eps",
          ]}
          steps={[
            {
              code: "f(y) = sum over t of cF/(1+y)^t + F/(1+y)^n − P_mkt",
              note: "계산된 가격과 시장 가격의 차이를 0으로 만드는 y를 찾는 문제로 바꿉니다. 2편의 내부수익률 문제와 같은 형태입니다.",
            },
            {
              code: "f'(y) = −sum over t of t·cF/(1+y)^(t+1) − n·F/(1+y)^(n+1)",
              note: "모든 항이 음수이므로 f는 y에 대해 단조 감소합니다. 이 성질이 해가 하나뿐임을 보장합니다.",
            },
            {
              code: "repeat: y_next = y − f(y)/f'(y)",
              note: "접선을 따라 0을 지나는 자리로 옮기는 뉴턴 반복입니다. 단조 함수라 초기값이 크게 빗나가지 않으면 잘 수렴합니다.",
            },
            {
              code: "if |f(y_next)| < eps: return y_next; else y = y_next",
              note: "가격 차이가 충분히 작아지면 멈춥니다. 채권에서는 가격 단위가 크므로 허용 오차를 금액 기준으로 잡는 편이 안전합니다.",
            },
          ]}
          output="이 가격을 설명하는 유일한 할인율, 곧 만기수익률"
          repeatUntil="가격 차이가 허용 오차 안에 들어올 때까지"
        />

        <div id="ytm-assumption" className="scroll-mt-20">
          <h3 className="mb-4 mt-12 text-xl font-bold">
            만기수익률은 실제로 얻게 될 수익률이 아닙니다
          </h3>
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p className="leading-7">
              만기수익률을 &ldquo;만기까지 들고 있으면 받게 될 연 수익률&rdquo;로
              읽기 쉽지만 정확하지 않습니다. 이 값이 실현되려면 중간에 받는
              이자를 전부 같은 수익률로 다시 굴릴 수 있어야 하기 때문입니다.
              식이 모든 항에 같은 y를 쓴다는 사실이 곧 그 가정입니다.
            </p>

            <p className="leading-7">
              현실에서 금리는 움직입니다. 받은 이자를 더 낮은 금리로 굴리게 되면
              실현 수익률은 만기수익률보다 낮아지고, 더 높은 금리로 굴리면
              높아집니다. 만기까지 들고 있어도 결과가 달라진다는 뜻입니다.
            </p>

            <p className="leading-7">
              그래서 만기수익률은 예측값이 아니라 비교를 위한 공통 척도로
              쓰입니다. 서로 다른 만기와 표면금리를 가진 채권들을 한 숫자로 줄
              세울 수 있게 해 주는 것이 이 값의 쓸모입니다.
            </p>
          </div>
        </div>
      </section>

      <section id="duration" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 3. 가격이 얼마나 흔들릴지는 현금흐름의 무게중심이 정합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            이제 첫 질문에 답할 차례입니다. 금리가 1%포인트 오를 때 가격이
            0.9% 떨어지는 채권이 있고 18% 떨어지는 채권이 있습니다. 차이를
            만드는 것은 돈이 언제 들어오느냐입니다. 늦게 들어올수록 할인의
            영향을 더 오래 받기 때문입니다.
          </p>

          <p className="leading-7">
            그래서 각 현금흐름이 가격에 기여하는 비중을 가중치로 삼아 시점의
            평균을 구합니다. 이 평균을 <strong>듀레이션</strong>이라 하고,
            &ldquo;이 채권의 실질적인 만기&rdquo;로 읽을 수 있습니다. 표면금리가
            높으면 돈이 앞쪽에 많이 들어오므로 듀레이션은 만기보다 짧아집니다.
          </p>

          <p className="leading-7">
            이 값이 유용한 이유는 가격 민감도와 직접 연결되기 때문입니다.
            듀레이션을 살짝 고쳐 쓴 값이 곧 &ldquo;금리 1%포인트당 가격 변화
            율&rdquo;이 됩니다. 그래서 채권을 고르는 일이 만기를 고르는 일이
            아니라 듀레이션을 고르는 일이 됩니다.
          </p>
        </div>

        <ExplainedFormula
          question="금리가 조금 움직일 때 채권 가격은 몇 퍼센트 움직이는가?"
          idea="가격은 여러 할인계수의 합이고, 각 계수가 금리에 반응하는 정도는 시점 t에 비례합니다. 그래서 전체 반응은 시점들의 가중평균으로 요약되고, 가중치는 그 현금흐름이 가격에서 차지하는 비중입니다. 곡선을 직선으로 근사한 것이므로 큰 변화에서는 오차가 남습니다."
          formula={String.raw`D = \sum_{t=1}^{n} t \cdot w_t, \quad D^* = \frac{D}{1+y}, \quad \frac{\Delta P}{P} \approx -D^* \Delta y + \tfrac{1}{2} C (\Delta y)^2`}
          annotatedFormula={String.raw`\frac{\Delta P}{P} \approx \underbrace{-D^* \Delta y}_{\text{직선 근사: 기울기} \times \text{변화}} + \underbrace{\tfrac{1}{2} C (\Delta y)^2}_{\text{휘어진 정도가 되돌려 주는 몫}}`}
          operations={[
            {
              expression: String.raw`w_t`,
              annotation: [
                "t시점 현금흐름의 현재가치를 전체 가격으로 나눈 비중이며 모두 더하면 1입니다.",
                "나눗셈은 금액이 아니라 기여도로 정규화해 서로 다른 크기의 채권을 같은 자로 재게 합니다.",
              ],
            },
            {
              expression: String.raw`\sum_{t=1}^{n} t \cdot w_t`,
              annotation: [
                "시점에 비중을 곱해 더하면 현금흐름의 무게중심이 나옵니다.",
                "곱은 늦게 들어오는 돈에 더 큰 영향력을 주어 민감도를 반영합니다.",
              ],
            },
            {
              expression: String.raw`\frac{D}{1+y}`,
              annotation: [
                "한 기간의 할인 배율로 나눠, 시간 단위의 무게중심을 가격 변화율 단위로 바꿉니다.",
              ],
            },
            {
              expression: String.raw`-D^* \Delta y`,
              annotation: [
                "음수 부호는 금리가 오르면 가격이 내린다는 방향을 담습니다.",
                "이 항만 쓰면 곡선을 직선으로 대신하는 것이라 변화가 클수록 오차가 커집니다.",
              ],
            },
            {
              expression: String.raw`\tfrac{1}{2} C (\Delta y)^2`,
              annotation: [
                "제곱이라 부호와 무관하게 양수이므로, 금리가 오르든 내리든 직선 근사보다 가격이 유리한 쪽으로 보정됩니다.",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`D`,
              name: "듀레이션",
              description:
                "현금흐름 시점의 가중평균이며 단위는 기간입니다. 이 채권이 실질적으로 몇 년짜리인지를 말합니다.",
            },
            {
              symbol: String.raw`D^*`,
              name: "수정 듀레이션",
              description:
                "금리 1단위 변화당 가격 변화율입니다. 실무에서 민감도라고 할 때는 보통 이 값을 뜻합니다.",
            },
            {
              symbol: String.raw`C`,
              name: "볼록성",
              description:
                "가격-수익률 곡선이 얼마나 휘어 있는지를 나타내는 2차 항의 계수입니다.",
            },
            {
              symbol: String.raw`\Delta y`,
              name: "수익률 변화",
              description: "금리가 움직인 폭이며 보통 소수로 적습니다.",
            },
          ]}
          assumptions={[
            "모든 만기의 금리가 같은 폭으로 움직인다고 둡니다. 곡선의 모양 자체가 바뀌면 이 근사는 어긋납니다.",
            "현금흐름이 고정되어 있다고 둡니다. 중도상환 권리가 붙은 채권은 금리가 움직일 때 현금흐름 자체가 바뀝니다.",
            "2차까지만 씁니다. 변화가 아주 크면 3차 이상의 항이 남습니다.",
          ]}
          interpretation="수정 듀레이션이 8인 채권은 금리가 1%포인트 오를 때 가격이 약 8% 떨어집니다. 여기서 읽어야 할 것은 만기가 아니라 듀레이션이 위험의 척도라는 점입니다. 읽으면 안 되는 것은 이 값이 항상 정확하다는 생각입니다. 볼록성 항이 말해 주듯 실제 손실은 직선 근사보다 작고 이익은 더 크며, 변화가 클수록 그 차이가 벌어집니다."
        />

        <PriceYieldCurveViz />

        <div id="duration-use" className="scroll-mt-20">
          <h3 className="mb-4 mt-12 text-xl font-bold">
            같은 만기라도 듀레이션은 다를 수 있습니다
          </h3>
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p className="leading-7">
              만기가 10년으로 같아도 표면금리가 높은 채권은 이자를 앞쪽에서 많이
              받으므로 무게중심이 앞당겨집니다. 극단적으로 이자를 전혀 주지 않는
              채권은 모든 돈이 만기에 한 번 들어오므로 듀레이션이 만기와 같아지고,
              금리 변화에 가장 크게 흔들립니다.
            </p>
          </div>

          <TermBreakdown
            title="무엇이 듀레이션을 늘리고 줄이는가"
            items={[
              {
                term: "만기가 길수록 늘어난다",
                description:
                  "돈이 더 늦게 들어오므로 무게중심이 뒤로 밀립니다. 가장 직관적인 요인입니다.",
                example:
                  "같은 조건이면 10년물이 3년물보다 금리 변화에 훨씬 크게 흔들립니다.",
                boundary:
                  "만기가 아주 길어지면 듀레이션 증가가 둔해집니다. 먼 현금흐름은 이미 할인계수가 작아 비중이 낮기 때문입니다.",
              },
              {
                term: "표면금리가 높을수록 줄어든다",
                description:
                  "중간에 받는 금액이 커서 가격에서 앞쪽 현금흐름의 비중이 올라가고, 무게중심이 앞당겨집니다.",
                example:
                  "만기 10년, 표면금리 8%인 채권은 같은 만기의 무이표채보다 듀레이션이 짧습니다.",
                boundary:
                  "표면금리는 발행 시 고정되므로 이 요인은 채권을 고를 때의 선택이지 나중에 조절할 수 있는 값이 아닙니다.",
              },
              {
                term: "수익률이 높을수록 줄어든다",
                description:
                  "할인계수가 전반적으로 작아지면서 먼 현금흐름의 비중이 더 많이 깎여 무게중심이 앞으로 옵니다.",
                example:
                  "같은 채권이라도 시장금리가 높은 국면에서는 듀레이션이 조금 짧게 계산됩니다.",
                boundary:
                  "효과의 크기가 앞의 두 요인보다 작아, 실무에서는 만기와 표면금리를 먼저 봅니다.",
              },
            ]}
          />
        </div>
      </section>

      <section id="yield-curve" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 4. 만기마다 금리가 다르므로 하나의 y로는 부족합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            지금까지 모든 기간에 같은 y를 썼습니다. 편했지만 사실이 아닙니다.
            같은 발행자의 채권이라도 1년물과 10년물의 금리는 다릅니다. 만기를
            가로축에, 금리를 세로축에 놓고 점을 이으면 하나의 곡선이 나오는데
            이것이 <strong>수익률 곡선</strong>입니다.
          </p>

          <p className="leading-7">
            곡선이 왜 그런 모양인지는 이미 절반 설명했습니다.{" "}
            <Link to="/finance/banking/central-bank-and-policy-transmission#transmission">
              중앙은행 글
            </Link>
            에서 본 대로 긴 금리는 앞으로의 단기금리 기대 평균에 기간 프리미엄을
            더한 값입니다. 그래서 곡선의 모양은 정책 경로에 대한 시장의 예상을
            담습니다.
          </p>

          <p className="leading-7">
            여기서 4편이 비워 둔 자리가 채워집니다. 할인율 r은 하늘에서 떨어지는
            상수가 아니라 이 곡선에서 만기별로 읽어 오는 값입니다. 3년 뒤
            현금흐름은 3년 지점의 금리로, 10년 뒤 현금흐름은 10년 지점의 금리로
            할인하는 것이 정확한 계산입니다.
          </p>
        </div>

        <YieldCurveShapeViz />

        <div id="curve-shapes" className="scroll-mt-20">
          <h3 className="mb-4 mt-12 text-xl font-bold">
            곡선이 뒤집히면 무엇을 읽어야 하는가
          </h3>
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p className="leading-7">
              보통은 만기가 길수록 금리가 높아 곡선이 우상향합니다. 기다리는 데
              대한 보상이 붙기 때문입니다. 그런데 가끔 짧은 쪽이 긴 쪽보다 높아져
              곡선이 뒤집히는데, 기대 가설로 읽으면 앞으로 단기금리가 내려갈
              것으로 시장이 보고 있다는 뜻입니다.
            </p>

            <p className="leading-7">
              이 신호를 해석할 때는 조심해야 합니다. 곡선은 기대 평균과 기간
              프리미엄의 합이므로, 뒤집힘이 기대 때문인지 프리미엄 때문인지
              곡선만 보고는 가를 수 없습니다. 프리미엄은 관측값이 아니라
              추정값이기 때문입니다.
            </p>
          </div>

          <ProgressiveDetail
            title="곡선의 어느 지점을 할인율로 써야 하는가?"
            preview="관측되는 만기수익률이 아니라 각 시점의 순수 할인율을 따로 뽑아 써야 정확합니다."
          >
            <p className="leading-7">
              시장에서 관측되는 만기수익률은 여러 시점의 현금흐름을 하나의
              숫자로 뭉갠 값입니다. 만기가 같아도 표면금리가 다르면 무게중심이
              달라 만기수익률도 조금씩 다릅니다. 그래서 곡선을 그대로 할인율로
              쓰면 미세한 오차가 생깁니다.
            </p>
            <p className="leading-7">
              정확히 하려면 각 시점에 딱 한 번 현금이 들어오는 가상의 채권,
              곧 무이표채의 금리를 만기별로 뽑아야 합니다. 짧은 만기부터
              차례로 풀어 가며 긴 만기의 순수 할인율을 벗겨 내는 방식으로
              구성하는 것이 일반적입니다.
            </p>
            <p className="leading-7">
              이 구분은 실무에서 중요하지만 이 글의 결론을 바꾸지는 않습니다.
              가격과 수익률이 반대로 움직인다는 것, 듀레이션이 민감도를
              정한다는 것, 곡선의 모양이 정책 기대를 담는다는 것은 어느 쪽을
              쓰든 그대로입니다.
            </p>
          </ProgressiveDetail>
        </div>

        <CitationBlock
          source="Frederick R. Macaulay · Some Theoretical Problems Suggested by the Movements of Interest Rates, Bond Yields and Stock Prices in the United States since 1856 (NBER, 1938)"
          citeKey={1}
          href="https://www.nber.org/books-and-chapters/some-theoretical-problems-suggested-movements-interest-rates-bond-yields-and-stock-prices-united"
        >
          듀레이션 개념이 처음 제시된 저작입니다. 채권의 만기만으로는 금리
          변화에 대한 민감도를 설명할 수 없다는 문제에서 출발해, 현금흐름 시점을
          현재가치 비중으로 가중평균한 값을 대안으로 내놓았습니다. 다만 이
          저작이 제시한 것은 가중평균 개념이며, 오늘 실무에서 쓰는 수정
          듀레이션과 볼록성 보정은 이후에 덧붙은 것입니다. 둘을 같은 출처로
          인용하면 안 됩니다.
        </CitationBlock>
      </section>

      <section id="boundary" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          현금흐름이 적혀 있지 않은 청구권은 어떻게 값을 매길까요
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            이 글은 내내 &ldquo;약속된 금액이 그대로 들어온다&rdquo;고 두었습니다.
            국채처럼 발행자가 자국 통화로 빌린 경우에는 이 가정이 비교적 잘
            맞지만, 회사채는 갚지 못할 가능성이 있어 같은 만기라도 금리가 더
            높습니다. 그 차이가 신용 스프레드입니다.
          </p>

          <p className="leading-7">
            더 큰 문제는 현금흐름이 아예 적혀 있지 않은 청구권입니다. 주식에는
            표면금리도 만기도 없고, 회사가 벌어들인 것 중 채권자에게 주고 남은
            것을 가질 뿐입니다. 그런데도 값이 매겨집니다.
          </p>

          <p className="leading-7">
            다음 글은 그 청구권입니다.{" "}
            <Link to="/finance/markets/equity-claims-and-valuation">
              주주는 마지막에 남는 것을 갖습니다
            </Link>
            에서 적혀 있지 않은 현금흐름에 같은 할인 식을 어떻게 적용하는지,
            그리고 그때 무엇이 불확실해지는지를 봅니다.
          </p>
        </div>
      </section>
    </div>
  );
}

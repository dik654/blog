import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import TimeValueAndDiscountingViz from "./time-value-and-discounting/viz/TimeValueAndDiscountingViz";
import DiscountFactorViz from "./time-value-and-discounting/viz/DiscountFactorViz";

/**
 * 지금의 1만 원과 1년 뒤의 1만 원은 다른 값입니다
 *
 * 금융의 계산 도구를 세우는 글이다. 뒤의 채권·주식·규제 글이 모두 이 글의
 * 할인 계산을 재사용한다. 할인율이 시장에서 어떻게 정해지는지는 채권 글이 맡는다.
 */
export default function TimeValueAndDiscountingArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          금융에서 값이 붙는 거의 모든 것이 같은 식 하나에서 나옵니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            채권 가격, 주식의 적정가치, 대출의 월 납입액, 연금의 일시금, 규제가
            요구하는 자본의 크기는 서로 다른 계산처럼 보입니다. 그런데 전부 한
            문장으로 줄어듭니다.{" "}
            <strong>
              앞으로 들어오고 나갈 돈을 모두 오늘 시점으로 옮겨서 더한다
            </strong>
            는 것입니다. 달라지는 것은 현금흐름의 모양과 옮길 때 쓰는 비율뿐입니다.
          </p>

          <p className="leading-7">
            그래서 이 글은 새 주제를 하나 더 얹는 글이 아니라 뒤따르는 글들이 공통으로 딛고 설 바닥을 까는 글입니다. 채권 글은 이 식의 현금흐름 자리에 쿠폰과 액면을 넣고, 주식
            글은 배당을 넣으며, 규제 글은 손실 시나리오를 넣습니다. 식은 그대로입니다.
          </p>

          <p className="leading-7">
            바닥을 까는 일은 왜 필요할까요. 시점이 다른 금액은 서로 다른
            단위이기 때문입니다. 오늘 받는 100만 원과 3년 뒤 받는 100만 원은
            같은 숫자지만 같은 값이 아닙니다. 오늘 받으면 그사이 굴려서 불릴 수
            있고, 3년을 기다리는 동안에는 그 기회를 포기해야 합니다. 이 성질을{" "}
            <strong>화폐의 시간가치</strong>라고 부릅니다.
          </p>
        </div>

        <TimeValueAndDiscountingViz />

        <ContentBoundary article="time-value-and-discounting" />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            식 하나를 세우는 데 필요한 부품은 넷입니다. 한 기간을 건너는{" "}
            <em>배율</em>, 그 배율을 뒤집은 <em>할인계수</em>, 여러 시점의 값을
            모으는 <em>합</em>, 그리고 합을 비율로 되묻는 <em>역질문</em>입니다.
            이 글은 그 넷을 순서대로 만들고, 마지막에 단위가 어긋나는 경우
            하나를 바로잡습니다.
          </p>

          <p className="leading-7">
            부품을 다 만들고 나면 식에 빈칸이 정확히 하나 남습니다. 옮길 때 쓰는
            비율 r이 어디서 오는가입니다. 이 글은 그 빈칸을 채우지 않고 드러내는
            데서 멈춥니다. 채우는 일은 만기 구조를 다루는 채권 글과 위험의 값을
            다루는 글이 나눠 맡습니다.
          </p>

          <p className="leading-7">
            앞 글에서 돈이 구매력을 미래로 옮기는 일을 한다고 했습니다.{" "}
            <Link to="/finance/money/money-as-a-claim#three-functions">
              돈의 세 기능
            </Link>
            중 가치 저장이 바로 이 글이 계산으로 다루는 부분입니다. 거듭제곱과
            로그의 기본 성질은{" "}
            <Link to="/cs/ai/math-exponents-logarithms#exponents">
              지수와 로그
            </Link>
            가 소유하며, 이 글은 그 계산을 쓰기만 합니다.
          </p>
        </div>
      </section>

      <section id="compounding" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 1. 한 기간을 건너는 배율은 더해지지 않고 곱해집니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            연 5%로 100만 원을 3년 맡길 때 매년 원금에만 5만 원씩 붙으면 3년 뒤 115만 원입니다. 그런데 붙은 이자를 원금에 얹고 다음 해에 그 합계에 이자를 매기면 115만
            7,625원이 됩니다. 차이는 7,625원이고 해가 갈수록 더 커집니다.
          </p>

          <p className="leading-7">
            앞의 방식이 단리, 뒤가 <strong>복리</strong>입니다. 복리는 이자를
            다시 굴린다는 뜻이고, 계산으로는 매 기간 같은 비율을 곱한다는
            뜻입니다. 곱셈이 반복되므로 증가 폭 자체가 커지며, 이것이 시간가치
            계산이 덧셈이 아니라 거듭제곱으로 쓰이는 이유입니다.
          </p>

          <p className="leading-7">
            여기서 주의할 것이 하나 있습니다. 같은 &ldquo;연 5%&rdquo;라도 1년에
            몇 번 이자를 붙이느냐에 따라 결과가 달라집니다. 매달 붙이면 연
            5.116%로 굴린 것과 같아집니다. 그래서 금리를 비교할 때는 숫자만
            보지 말고 이자를 붙이는 주기를 함께 봐야 합니다.
          </p>
        </div>

        <ExplainedFormula
          question="지금의 금액을 n기간 뒤로 굴리면 얼마가 되는가?"
          idea="한 기간이 지날 때마다 원금이 (1+r)배가 됩니다. 기간이 n번 반복되면 그 배율이 n번 곱해지므로 곱셈의 반복, 곧 거듭제곱이 됩니다. 덧셈으로 쓰면 이자가 다시 이자를 낳는 부분이 빠집니다."
          formula={String.raw`FV = PV \cdot (1+r)^{n}`}
          annotatedFormula={String.raw`FV = PV \cdot \underbrace{(1+r)}_{\text{한 기간의 배율}}{}^{\overbrace{n}^{\text{반복 횟수}}}`}
          operations={[
            {
              expression: String.raw`1+r`,
              annotation: [
                "원금 1에 이자 r이 더해져 남는 배율입니다.",
                "합은 원금 보존분과 새로 붙은 이자를 한 배율로 묶습니다.",
              ],
            },
            {
              expression: String.raw`(1+r)^{n}`,
              annotation: [
                "같은 배율을 n번 곱해 이자가 다시 이자를 낳는 과정을 누적합니다.",
                "여기서 곱셈을 덧셈 n·r로 바꾸면 단리가 되고 복리 효과가 사라집니다.",
              ],
            },
            {
              expression: String.raw`PV \cdot (1+r)^{n}`,
              annotation: [
                "누적된 배율을 원래 금액에 곱해 미래 시점의 금액으로 옮깁니다.",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`PV`,
              name: "현재의 금액",
              description: "지금 시점에 가지고 있거나 투입하는 금액입니다.",
            },
            {
              symbol: String.raw`FV`,
              name: "n기간 뒤의 금액",
              description: "같은 돈을 n기간 굴렸을 때 도달하는 금액입니다.",
            },
            {
              symbol: String.raw`r`,
              name: "한 기간당 이자율",
              description:
                "한 기간에 원금 대비 얼마가 붙는지입니다. 기간 단위와 반드시 짝을 맞춰야 하며, 연 5%를 월 단위로 쓰려면 월 이자율로 바꿔야 합니다.",
            },
            {
              symbol: String.raw`n`,
              name: "기간의 수",
              description:
                "r이 적용되는 기간이 몇 번 반복되는지입니다. r이 월 이자율이면 n은 개월 수입니다.",
            },
          ]}
          assumptions={[
            "이자율 r이 모든 기간에 같다고 둡니다. 금리가 바뀌면 기간마다 다른 배율을 곱해야 합니다.",
            "붙은 이자가 전액 재투자된다고 둡니다. 중간에 꺼내 쓰면 복리 효과가 그만큼 줄어듭니다.",
            "세금과 수수료는 넣지 않았습니다. 실제 수령액은 이보다 작습니다.",
          ]}
          interpretation="n이 커질수록 FV는 직선이 아니라 가속하며 늘어납니다. 다만 이것은 약속된 이자가 실제로 지급될 때의 이야기이고, 상대가 갚지 못할 가능성은 r 안에 들어 있지 않습니다. 높은 r을 보고 좋은 투자라고 읽으면 안 되는 이유가 여기에 있습니다."
        />
      </section>

      <section id="discounting" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 2. 그 배율을 뒤집으면 미래를 오늘로 되돌리는 계수가 됩니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            앞 식에서 알고 싶은 것이 FV가 아니라 PV라면 양변을 배율로 나누면
            됩니다. 3년 뒤 115만 7,625원을 연 5% 기준으로 오늘 값으로 되돌리면
            정확히 100만 원입니다. 이 되돌리는 계산을 <strong>할인</strong>이라
            하고, 나오는 값이 현재가치입니다.
          </p>

          <p className="leading-7">
            할인에서 쓰는 비율은 <strong>할인율</strong>이라 부릅니다. 이름은
            다르지만 자리는 앞 식의 r과 같고, 의미는 &ldquo;이 돈을 지금 받으면
            대신 얻을 수 있었던 수익률&rdquo;입니다. 그래서 할인율은 하늘에서
            떨어지는 상수가 아니라 무엇과 견주느냐에 따라 달라지는 선택입니다.
          </p>

          <p className="leading-7">
            이 선택은 결과를 크게 흔듭니다. 10년 뒤 1억 원은 할인율 3%에서 약 7,441만 원이지만 8%에서는 약 4,632만 원입니다. 같은 미래 금액인데 오늘 값이 1.6배
            차이 납니다. 먼 미래일수록 이 차이는 더 벌어집니다.
          </p>
        </div>

        <ExplainedFormula
          question="n기간 뒤에 받을 금액은 오늘 얼마의 값어치인가?"
          idea="앞 절의 곱셈을 그대로 되돌립니다. 미래로 갈 때 (1+r)을 n번 곱했으니 오늘로 올 때는 n번 나눕니다. 그 나누는 몫을 미리 계산해 두면 어떤 금액에도 곱해서 쓸 수 있는 한 개의 계수가 됩니다."
          formula={String.raw`PV = \frac{FV}{(1+r)^{n}} = FV \cdot DF_n, \qquad DF_n = (1+r)^{-n}`}
          annotatedFormula={String.raw`PV = \underbrace{FV}_{\text{미래 금액}} \cdot \underbrace{(1+r)^{-n}}_{\text{n기간을 되돌리는 할인계수 } DF_n}`}
          operations={[
            {
              expression: String.raw`\frac{FV}{(1+r)^{n}}`,
              annotation: [
                "미래로 보낼 때 곱한 배율로 나눠 시점을 원래대로 되돌립니다.",
                "나눗셈의 기준이 되는 것은 같은 기간 동안 얻을 수 있었던 수익률입니다.",
              ],
            },
            {
              expression: String.raw`(1+r)^{-n}`,
              annotation: [
                "지수의 부호를 뒤집어 나눗셈을 곱셈으로 바꿔 쓴 것이며 값은 같습니다.",
                "r이 0보다 크면 이 값은 1보다 작고 n이 커질수록 0에 가까워집니다.",
              ],
            },
            {
              expression: String.raw`FV \cdot DF_n`,
              annotation: [
                "할인계수를 한 번 계산해 두면 같은 시점의 어떤 금액에도 곱하기만 하면 됩니다.",
                "여러 시점의 현금흐름을 다룰 때 이 재사용이 계산을 크게 줄입니다.",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`DF_n`,
              name: "n기간 할인계수",
              description:
                "n기간 뒤의 1원이 오늘 얼마인지를 나타내는 수입니다. 이 수 하나만 있으면 그 시점의 모든 금액을 환산할 수 있습니다.",
            },
            {
              symbol: String.raw`r`,
              name: "할인율",
              description:
                "이 돈을 지금 받아 대신 굴렸을 때 기대할 수 있는 수익률입니다. 무엇과 견주느냐에 따라 달라지는 선택값입니다.",
            },
            {
              symbol: String.raw`n`,
              name: "기다리는 기간의 수",
              description: "받기까지 남은 기간이며 r의 기간 단위와 같아야 합니다.",
            },
          ]}
          assumptions={[
            "약속된 금액이 실제로 들어온다고 둡니다. 못 받을 가능성을 반영하려면 r을 높이거나 금액 자체를 기대값으로 낮춰야 하며, 둘을 동시에 하면 위험을 두 번 세게 됩니다.",
            "기간마다 같은 r을 씁니다. 실제 시장에서는 만기마다 다른 금리가 적용되며, 그 구조는 채권 글에서 다룹니다.",
            "물가 변동은 포함되어 있지 않습니다. 명목 금액과 명목 할인율을 짝지어야 합니다.",
          ]}
          interpretation="할인계수는 r이 크거나 n이 길수록 빠르게 작아집니다. 먼 미래의 큰 금액이 오늘 값으로는 생각보다 작아지는 이유가 이것입니다. 반대로 이 성질 때문에 할인율을 조금만 낮춰 잡아도 장기 사업의 평가액이 크게 부풀 수 있으므로, 결론을 말할 때는 반드시 어떤 r을 썼는지 함께 밝혀야 합니다."
        />

        <DiscountFactorViz />
      </section>

      <section id="npv" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 3. 계수를 곱해 한 시점에 모으면 비로소 더할 수 있습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            현실의 투자는 한 번 넣고 한 번 받는 일이 드뭅니다. 처음에 목돈이
            나가고 여러 해에 걸쳐 조금씩 들어옵니다. 이때 각 시점의 금액에 그
            시점의 할인계수를 곱해 모두 오늘로 옮긴 뒤 합한 값이{" "}
            <strong>순현재가치</strong>입니다.
          </p>

          <p className="leading-7">
            판단 기준은 단순합니다. 순현재가치가 0보다 크면 이 사업은 같은 위험으로 다른 데 굴렸을 때보다 낫고 0보다 작으면 못합니다. 여기서 &ldquo;다른 데&rdquo;의
            기준이 바로 할인율이므로 순현재가치는 절대적인 좋고 나쁨이 아니라 비교 대상 대비 판정입니다.
          </p>

          <p className="leading-7">
            매년 같은 금액이 같은 기간 들어오는 경우에는 계산이 더 짧아집니다. 할인계수의 합이 등비수열이라 닫힌 식으로 정리되기 때문입니다. 이 형태를 연금이라 부릅니다. 원리금 균등
            상환 대출의 월 납입액이 바로 이 식에서 나옵니다.
          </p>
        </div>

        <ExplainedFormula
          question="시점이 흩어진 현금흐름 전체를 하나의 숫자로 어떻게 판정하는가?"
          idea="더할 수 없는 것을 더하려면 단위를 맞춰야 합니다. 각 시점의 금액을 그 시점의 할인계수로 오늘로 옮기면 모두 같은 단위가 되고, 그제야 합이 뜻을 가집니다. 나가는 돈에 음수 부호를 주면 합 하나로 순이익까지 함께 판정됩니다."
          formula={String.raw`NPV = \sum_{t=0}^{T} \frac{C_t}{(1+r)^{t}}`}
          annotatedFormula={String.raw`NPV = \sum_{t=0}^{T} \underbrace{C_t}_{\text{t시점 순현금흐름}} \cdot \underbrace{(1+r)^{-t}}_{\text{t시점 할인계수}}`}
          operations={[
            {
              expression: String.raw`C_t`,
              annotation: [
                "들어오면 양수, 나가면 음수로 적어 한 번의 합으로 순액을 구합니다.",
                "t=0의 초기 투자액은 대개 음수이며 할인계수가 1이라 그대로 더해집니다.",
              ],
            },
            {
              expression: String.raw`(1+r)^{-t}`,
              annotation: [
                "각 금액을 자기 시점에서 오늘로 되돌려 서로 더할 수 있는 단위로 맞춥니다.",
                "t가 클수록 계수가 작아지므로 먼 미래의 금액은 합에 적게 기여합니다.",
              ],
            },
            {
              expression: String.raw`\sum_{t=0}^{T}`,
              annotation: [
                "0기부터 마지막 기 T까지 모든 시점의 기여를 누적합니다.",
                "누적 범위를 T에서 끊는다는 것은 그 뒤의 현금흐름을 0으로 본다는 뜻이며, 실제로 이어진다면 잔존가치를 따로 넣어야 합니다.",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`C_t`,
              name: "t시점의 순현금흐름",
              description:
                "그 시점에 실제로 오가는 현금의 순액입니다. 회계상 이익이 아니라 현금이라는 점이 중요합니다.",
            },
            {
              symbol: String.raw`T`,
              name: "마지막 기간",
              description: "현금흐름을 세는 마지막 시점입니다.",
            },
            {
              symbol: String.raw`r`,
              name: "할인율",
              description:
                "같은 위험을 지고 다른 곳에 넣었을 때 기대할 수 있는 수익률입니다.",
            },
          ]}
          assumptions={[
            "모든 기간에 같은 r을 씁니다. 위험이 시점마다 다르면 시점별 할인율이 필요합니다.",
            "중간에 들어온 현금을 같은 r로 다시 굴릴 수 있다고 봅니다.",
            "현금흐름의 시점과 금액을 미리 안다고 둡니다. 불확실하면 기대값을 쓰되 분산은 이 식에 담기지 않습니다.",
          ]}
          interpretation="NPV가 0보다 크면 할인율로 삼은 대안보다 낫다는 뜻이며, 그 이상도 이하도 아닙니다. 두 사업의 NPV를 비교할 때는 같은 r과 같은 기간을 썼는지 먼저 확인해야 합니다. 규모가 다른 사업은 NPV 크기만으로 우열을 가릴 수 없습니다."
        />

        <div id="annuity" className="scroll-mt-20">
          <h3 className="mb-4 mt-12 text-xl font-bold">
            매기 금액이 같으면 합이 닫힌 형태로 줄어듭니다
          </h3>
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p className="leading-7">
              합을 매번 항마다 계산하지 않아도 되는 경우가 있습니다. 매기 같은 금액이 같은 기간 들어오면 할인계수의 합이 등비수열이 되어 짧은 식으로 정리됩니다. 원리금 균등 상환
              대출의 월 납입액이 바로 여기서 나옵니다.
            </p>
          </div>

        <ProgressiveDetail
          title="매기 같은 금액이 들어오면 왜 식이 짧아지는가?"
          preview="할인계수의 합이 공비 1/(1+r)인 등비수열이라 닫힌 형태로 정리됩니다."
        >
          <p className="leading-7">
            매기 C가 T기간 동안 들어오면 현재가치는 C를 공통으로 묶어
            <span className="whitespace-nowrap"> C·Σ(1+r)^(−t)</span>가 됩니다.
            괄호 안의 합은 첫 항이 1/(1+r)이고 공비가 같은 등비수열이므로 등비
            급수 공식으로 정리되어 다음 형태가 됩니다.
          </p>
          <p className="leading-7">
            <span className="whitespace-nowrap">PV = C · [1 − (1+r)^(−T)] / r</span>
            입니다. 대괄호 안의 값은 T가 커질수록 1에 가까워지므로, 영원히
            들어오는 경우의 현재가치는 C/r로 수렴합니다. 이 형태는 배당이
            일정하다고 가정한 주식 가치 계산에서 다시 등장합니다.
          </p>
          <p className="leading-7">
            원리금 균등 상환 대출은 이 식을 반대로 읽은 것입니다. 빌린 금액을
            PV 자리에 놓고 C를 구하면 월 납입액이 나옵니다. 같은 원금이라도
            금리가 오르면 대괄호 값이 작아져 같은 PV를 채우기 위해 C가
            커집니다.
          </p>
        </ProgressiveDetail>
        </div>
      </section>

      <section id="irr" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 4. 합을 0으로 만드는 비율을 되물으면 수익률이 나옵니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            &ldquo;이 사업의 수익률은 몇 퍼센트인가&rdquo;라는 질문에 답하려면
            순현재가치를 정확히 0으로 만드는 할인율을 찾으면 됩니다. 그 값을{" "}
            <strong>내부수익률</strong>이라 합니다. 이름이 내부인 이유는 바깥에서
            할인율을 가져오지 않고 현금흐름 자체에서 뽑아내기 때문입니다.
          </p>

          <p className="leading-7">
            문제는 이 값을 손으로 풀 수 없다는 데 있습니다. 식이 r에 대한 고차 다항식이라 일반적인 해법이 없어 수치적으로 찾아야 합니다. 다행히 현금흐름이 처음 한 번 나가고 그
            뒤로 계속 들어오는 형태라면 순현재가치가 r에 대해 단조 감소하므로 해가 하나뿐이고 찾기도 쉽습니다.
          </p>

          <p className="leading-7">
            그 조건이 깨지면 곧바로 문제가 생깁니다. 현금흐름의 부호가 여러 번 바뀌면 순현재가치를 0으로 만드는 r이 둘 이상 나올 수 있고 그중 무엇이 &ldquo;그 사업의
            수익률&rdquo;인지 말할 수 없게 됩니다. 규모가 다른 두 사업을 내부수익률만으로 줄 세우는 것도 위험합니다.
          </p>
        </div>

        <AlgorithmBlock
          title="내부수익률을 수치적으로 찾는 절차"
          input={[
            "현금흐름 C[0..T]: 나가는 돈은 음수, 들어오는 돈은 양수",
            "시작값 r0: 보통 0.1 같은 적당한 값",
            "허용 오차 eps와 최대 반복 횟수",
          ]}
          steps={[
            {
              code: "f(r) = sum over t of C[t] / (1+r)^t   // 이 값을 0으로 만드는 r을 찾는다",
              note: "구하려는 것이 곧 NPV를 0으로 만드는 할인율이므로, 목표 함수는 NPV 식 그 자체입니다.",
            },
            {
              code: "f'(r) = sum over t of -t * C[t] / (1+r)^(t+1)",
              note: "기울기를 알면 다음 시도값을 훨씬 가깝게 잡을 수 있습니다. 이 도함수는 각 항을 r로 미분해 얻습니다.",
            },
            {
              code: "repeat: r_next = r - f(r) / f'(r)",
              note: "현재 점에서 접선을 그어 그 접선이 0을 지나는 자리로 옮깁니다. 뉴턴 방법이라 부르는 반복입니다.",
            },
            {
              code: "if |f(r_next)| < eps or |r_next - r| < eps: return r_next; else r = r_next",
              note: "함숫값이 충분히 0에 가깝거나 더 이상 움직이지 않으면 멈춥니다. 두 조건을 함께 보는 이유는 기울기가 완만한 구간에서 한쪽만으로는 속기 쉽기 때문입니다.",
            },
            {
              code: "if 반복 한도 초과: 부호 변화 구간을 이분법으로 좁혀 다시 시도하거나 해 없음으로 보고한다",
              note: "기울기가 0에 가까우면 뉴턴 방법이 발산합니다. 이때는 느리지만 반드시 수렴하는 이분법으로 물러서는 편이 안전합니다.",
            },
          ]}
          output="NPV를 0으로 만드는 할인율 r, 또는 해가 여러 개이거나 찾지 못했다는 판정"
          repeatUntil="함숫값이 허용 오차 안에 들어오거나 반복 한도에 닿을 때까지"
        />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            절차의 마지막 단계가 말해 주듯 내부수익률은 &ldquo;항상 하나 있는 값&rdquo;이 아닙니다. 아래 표는 두 지표를 어떤 질문에 써야 하는지 정리한 것입니다.
          </p>
        </div>

        <div id="irr-compare" className="scroll-mt-20">
          <h3 className="mb-4 mt-12 text-xl font-bold">
            두 지표는 같은 식에서 나오지만 같은 질문에 답하지 않습니다
          </h3>

        <TermBreakdown
          title="순현재가치와 내부수익률은 다른 질문에 답합니다"
          items={[
            {
              term: "순현재가치 (NPV)",
              description:
                "지금 기준으로 얼마를 벌었는지를 금액으로 답합니다. 비교 대상이 할인율에 명시적으로 들어가므로 무엇과 견주었는지가 드러납니다.",
              example:
                "초기 1억 원을 넣고 3년간 매년 4천만 원이 들어오는 사업은 할인율 8%에서 약 308만 원입니다.",
              boundary:
                "금액이므로 규모가 큰 사업이 유리하게 보입니다. 투입 자본이 제한된 상황에서는 단위 자본당 값으로 다시 봐야 합니다.",
            },
            {
              term: "내부수익률 (IRR)",
              description:
                "이 현금흐름이 스스로 만들어 내는 수익률을 비율로 답합니다. 규모와 무관한 숫자라 직관적으로 읽히고 전달하기 쉽습니다.",
              example:
                "위와 같은 현금흐름의 내부수익률은 약 9.7%이며, 이는 할인율 9.7%에서 NPV가 0이 된다는 뜻입니다.",
              boundary:
                "현금흐름의 부호가 여러 번 바뀌면 해가 여러 개 나올 수 있고, 기간이나 규모가 다른 사업을 이 숫자만으로 줄 세우면 결론이 뒤집힙니다.",
            },
          ]}
        />
        </div>
      </section>

      <section id="real-rate" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          단위 점검. 금액이 늘어도 물가가 더 오르면 구매력은 줄어듭니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            연 5% 예금에 넣어 1년 뒤 105만 원을 받아도 그사이 물가가 4% 올랐다면
            실제로 늘어난 구매력은 5%가 아닙니다. 금액 기준의 수익률을 명목,
            물가 상승분을 걷어 낸 것을 <strong>실질금리</strong>라 하며, 판단에
            써야 하는 쪽은 대개 실질 쪽입니다.
          </p>

          <p className="leading-7">
            둘의 관계는 흔히 &ldquo;명목에서 물가상승률을 빼면 실질&rdquo;이라고 간단히 씁니다. 정확한 관계는 뺄셈이 아니라 나눗셈이지만 두 값이 작을 때는 차이가 미미해
            뺄셈으로 근사합니다. 물가가 두 자릿수로 오르는 상황에서는 이 근사가 눈에 띄게 어긋납니다.
          </p>

          <p className="leading-7">
            실질금리에는 한 가지 함정이 더 있습니다. 계약할 때 아는 것은 명목 금리와 &ldquo;예상되는&rdquo; 물가상승률뿐이고 실제 물가는 나중에야 드러납니다. 그래서 사전에
            계산한 실질금리와 사후에 확인된 실질금리는 다를 수 있습니다. 그 차이가 돈을 빌린 쪽과 빌려준 쪽 사이에서 이익과 손실로 갈립니다.
          </p>
        </div>

        <ExplainedFormula
          question="물가 상승을 걷어 내면 실제로 늘어난 구매력은 얼마인가?"
          idea="명목 금액이 늘어난 배율과 물가가 오른 배율을 각각 구한 뒤, 전자를 후자로 나누면 살 수 있는 양이 몇 배가 되었는지가 남습니다. 두 배율의 나눗셈이므로 뺄셈은 그 근사일 뿐입니다."
          formula={String.raw`1 + r_{\text{real}} = \frac{1 + i}{1 + \pi} \;\;\Longrightarrow\;\; r_{\text{real}} \approx i - \pi`}
          annotatedFormula={String.raw`1 + r_{\text{real}} = \frac{\overbrace{1 + i}^{\text{금액이 늘어난 배율}}}{\underbrace{1 + \pi}_{\text{물가가 오른 배율}}}`}
          operations={[
            {
              expression: String.raw`1 + i`,
              annotation: [
                "1년 뒤 통장에 남는 금액이 원금의 몇 배인지입니다.",
              ],
            },
            {
              expression: String.raw`1 + \pi`,
              annotation: [
                "같은 물건을 사는 데 드는 돈이 몇 배가 되었는지입니다.",
              ],
            },
            {
              expression: String.raw`\frac{1 + i}{1 + \pi}`,
              annotation: [
                "나눗셈은 금액의 증가를 물가의 증가로 정규화해 살 수 있는 양의 배율만 남깁니다.",
                "분모가 분자보다 크면 이 값이 1보다 작아지고, 실질금리는 음수가 됩니다.",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`i`,
              name: "명목금리",
              description: "계약서에 적히는 금액 기준의 금리입니다.",
            },
            {
              symbol: String.raw`\pi`,
              name: "물가상승률",
              description:
                "같은 기간 동안 물가가 오른 비율입니다. 어떤 물가지수를 쓰느냐에 따라 값이 달라집니다.",
            },
            {
              symbol: String.raw`r_{\text{real}}`,
              name: "실질금리",
              description:
                "구매력 기준으로 실제 늘어난 비율입니다. 명목금리가 양수여도 음수가 될 수 있습니다.",
            },
          ]}
          assumptions={[
            "두 비율이 같은 기간을 기준으로 측정됐다고 둡니다.",
            "물가상승률을 하나의 대표 지수로 잰다고 둡니다. 실제로 각 가계가 겪는 물가는 소비 구성에 따라 다릅니다.",
            "근사식은 i와 π가 모두 작을 때만 쓸 수 있습니다. π가 클수록 오차가 커집니다.",
          ]}
          interpretation="명목금리가 5%이고 물가상승률이 4%면 정확한 실질금리는 약 0.96%이고 근사값은 1%로, 차이가 무시할 만합니다. 반면 명목 20%에 물가 18%면 정확값은 약 1.69%인데 근사값은 2%로 벌어집니다. 또한 이 식은 사후에 확인된 물가로 계산한 것인지 계약 시점의 예상 물가로 계산한 것인지에 따라 전혀 다른 숫자이므로, 어느 쪽인지 밝히지 않은 실질금리는 비교에 쓸 수 없습니다."
        />

        <CitationBlock
          source="Irving Fisher · The Theory of Interest (1930)"
          citeKey={1}
          href="https://oll.libertyfund.org/titles/fisher-the-theory-of-interest"
        >
          명목금리와 실질금리, 그리고 예상 물가상승률의 관계를 체계적으로
          정리한 고전입니다. 위 식이 피셔 방정식이라 불리는 이유가 여기에
          있습니다. 다만 이 저작은 이론적 관계를 세운 것이지, 명목금리가 예상
          물가를 실제로 얼마나 반영하는가에 대한 실증 결과가 아닙니다. 그
          반영 정도는 시기와 국가에 따라 다르게 관측되며, 이 글은 관계식만
          사용하고 반영 정도는 주장하지 않습니다.
        </CitationBlock>
      </section>

      <section id="boundary" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          조립을 마치면 빈칸이 하나 남습니다: r은 어디서 오는가
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            지금까지의 도구는 모두 r을 입력으로 받습니다. 그런데 이 글은 r이
            어디서 오는지를 답하지 않았습니다. &ldquo;다른 데 굴렸을 때의
            수익률&rdquo;이라고만 했을 뿐, 그 다른 데가 무엇이고 값이 어떻게
            정해지는지는 열어 두었습니다.
          </p>

          <p className="leading-7">
            여기에 답하려면 두 가지가 더 필요합니다. 하나는 만기가 다르면 금리도 다르다는 사실이고, 다른 하나는 못 받을 위험이 클수록 요구하는 수익률이 높아진다는 사실입니다. 앞은
            채권의 수익률 곡선이, 뒤는 위험의 가격이 다룹니다.
          </p>

          <p className="leading-7">
            그 전에 먼저 볼 것이 있습니다. 지금까지 &ldquo;예금에 넣으면&rdquo;
            이라고 말할 때의 그 예금이 애초에 어떻게 생기는가입니다. 앞 글에서
            예금이 은행의 빚이라는 것까지는 확인했으니, 다음은 그 빚이 만들어지는
            자리입니다.{" "}
            <Link to="/finance/banking/bank-balance-sheet-and-deposit-creation">
              은행 대출이 예금을 만든다
            </Link>
            로 이어집니다.
          </p>
        </div>
      </section>
    </div>
  );
}

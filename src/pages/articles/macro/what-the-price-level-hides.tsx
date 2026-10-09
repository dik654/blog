import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import ExchangeBalanceViz from "./what-the-price-level-hides/viz/ExchangeBalanceViz";
import FourKnobsViz from "./what-the-price-level-hides/viz/FourKnobsViz";

/**
 * 값이 올랐다는 말은 네 자리 중 어디가 움직였는지를 말하지 않습니다
 *
 * 경제 2단계 7편, 거시 2편. 원자료는 Fisher 『The Purchasing Power of Money』
 * 개정판이고 16~21쪽의 숫자와 문장을 쪽 이미지로 대조했다. 이 글의 축은
 * 교환방정식이 항등식이라는 것 — 무엇이 균형을 맞추는지는 말하지만 무엇이
 * 무엇을 움직이는지는 말하지 않는다는 점이다. 저자 자신이 그 경계를 적어
 * 두었다.
 */
export default function WhatThePriceLevelHidesArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          빵과 석탄과 옷감으로 1억 달러어치가 오갔습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            한 해 동안 빵 2억 개가 개당 0.1달러에, 석탄 1,000만 톤이 톤당
            5달러에, 옷감 3,000만 야드가 야드당 1달러에 팔렸다고 해 봅시다.
            더하면 1억 달러어치입니다. 같은 해에 이 나라가 가진 돈은 500만
            달러뿐인데, 그 돈이 한 해에 스무 번 손을 바꾸면 건너간 돈도 1억
            달러가 됩니다.
          </p>

          <p className="leading-7">
            이 네 숫자가 이 글의 전부입니다. 가진 돈, 그 돈이 손을 바꾼 횟수,
            오간 물건의 양, 그리고 값. 넷은 서로 묶여 있어서{" "}
            <strong>셋이 정해지면 나머지 하나가 따라옵니다.</strong>
          </p>

          <p className="leading-7">
            <strong>
              그래서 값이 올랐다는 말만으로는 무슨 일이 일어났는지 알 수
              없습니다. 네 자리 중 어디가 움직였습니까.
            </strong>{" "}
            앞 글에서 총량을 사람 수로 나눠야 한다고 했는데 여러 해를 견주려면
            하나가 더 필요합니다. 값이 변한 몫을 걷어내는 일입니다.
          </p>
        </div>

        <ExchangeBalanceViz />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            다섯 부품입니다. 양쪽이 왜 반드시 같은지, 돈 쪽을 셀 때 왜 가진
            돈만으로는 모자라는지, 네 자리가 어떻게 묶이는지, 그 묶임이
            무엇을 말하지 <em>않는지</em>, 그래서 무엇을 물어야 하는지입니다.
          </p>

          <p className="leading-7">
            <em>
              여기까지만 읽어도 이 글의 질문은 잡힙니다 — 값이 올랐다는 사실
              하나로는 원인을 좁힐 수 없습니다.
            </em>
          </p>
        </div>
      </section>

      <section id="two-sides" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 1. 거래 하나가 같은 값이므로 한 해를 다 더해도 같습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            설탕 10파운드를 파운드당 7센트에 샀다고 해 봅시다. 70센트가 건너가고
            설탕 10파운드가 건너옵니다. 이 거래에서 양쪽이 같은 값이라는 것은
            발견이 아니라 <strong>거래가 그렇게 정의되어 있다는
            뜻</strong>입니다. 70센트를 주고 10파운드를 받았으면 그 둘은 서로
            바꿔진 것입니다.
          </p>

          <p className="leading-7">
            한 해 동안 일어난 모든 거래를 이렇게 적어 전부 더합니다. 하나하나가
            같았으니 다 더해도 같습니다. 그래서 한 나라에서 한 해 동안 건너간
            돈과 건너온 물건은 값으로 같습니다. Fisher는 이 등식을 교환방정식이라
            불렀습니다.
          </p>

          <p className="leading-7">
            여기서 한 가지를 분명히 해 둬야 합니다. 이 등식은 자료를 모아
            확인한 법칙이 아니라 더하기의 결과입니다.{" "}
            <strong>틀릴 수가 없습니다.</strong> 틀릴 수 없는 등식이 무엇에
            쓸모가 있는지가 뒤에 나올 질문이고 이 글의 마지막 두 부품이 그
            질문을 다룹니다.
          </p>
        </div>

        <CitationBlock
          source="Irving Fisher, 『The Purchasing Power of Money』, New York: Macmillan, 개정판(1926년 인쇄), 16~18쪽"
          citeKey={1}
          href="https://archive.org/details/purchasingpower00fish"
        >
          설탕의 예는 16쪽입니다 — “Suppose, for instance, that a person buys 10
          pounds of sugar at 7 cents per pound.” 같은 쪽에서 교환방정식을 “It is
          obtained simply by adding together the equations of exchange for all
          individual transactions”로 정의하고, 17쪽에서 “in the grand total of
          all exchanges for a year, the total money paid is equal in value to
          the total value of the goods bought”라고 적습니다. 500만 달러 × 스무
          번과 빵·석탄·옷감의 세 줄은 17~18쪽입니다. Internet Archive 공개본을
          내려받아 2장을 읽었고, 위 숫자와 문장은 해당 쪽 이미지를 직접 열어
          대조했습니다. 이 사본은 1911년 초판이 아니라 저자가 수정한
          개정판이므로 쪽수는 개정판 기준입니다.
        </CitationBlock>

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            <em>
              양쪽이 왜 같은지는 이 절에서 끝났습니다. 그 양쪽을 각각 어떻게
              세는지가 다음 부품입니다.
            </em>
          </p>
        </div>
      </section>

      <section id="velocity" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 2. 같은 돈이 여러 번 쓰이므로 가진 돈만으로는 모자랍니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            물건 쪽은 세기가 비교적 쉽습니다. 종류마다 값에 수량을 곱해 더하면
            됩니다. 문제는 돈 쪽입니다. 이 나라에 있는 돈이 500만 달러뿐인데 한
            해에 1억 달러어치가 오갔습니다. 돈이 모자란 것이 아니라{" "}
            <strong>같은 돈이 여러 번 쓰인 것</strong>입니다.
          </p>

          <p className="leading-7">
            돈 쪽을 셀 때는 두 수가 필요합니다. 얼마나 가지고 있는지와,
            그 돈이 한 해에 몇 번 손을 바꾸는지입니다. 둘을 곱해야 한 해 동안
            실제로 건너간 돈이 나옵니다. 500만 달러가 스무 번 손을 바꾸면 1억
            달러입니다.
          </p>

          <p className="leading-7">
            손을 바꾸는 횟수는 사람마다 다릅니다. Fisher는 각자가 한 해에 쓴
            돈을 평소 지니고 다니는 돈으로 나누면 자기 횟수를 구할 수 있다고
            적었습니다. 나라 전체의 횟수는 그것들의 평균 같은 것입니다.{" "}
            <strong>이 수는 가진 돈과 전혀 다른 것을 재며, 따로 움직일 수
            있습니다.</strong>
          </p>
        </div>

        <TermBreakdown
          title="돈 쪽을 이루는 두 수"
          description="둘은 서로 다른 것을 재고, 한쪽이 움직여도 다른 쪽은 그대로일 수 있습니다."
          items={[
            {
              term: "가진 돈",
              description:
                "어느 시점에 세어 본 돈의 양입니다. 사진 한 장처럼 한 순간의 값입니다.",
              example:
                "이 나라에 500만 달러가 있습니다. 한 해 내내 그대로일 수도 있습니다.",
              boundary:
                "이것만으로는 한 해에 얼마가 오갔는지 알 수 없습니다. 쌓여만 있을 수도 있기 때문입니다.",
            },
            {
              term: "손을 바꾼 횟수",
              description:
                "한 해 동안 같은 돈이 평균 몇 번 쓰였는지입니다. 기간이 있어야 뜻이 생깁니다.",
              example:
                "스무 번이면 500만 달러가 1억 달러어치의 거래를 떠받칩니다.",
              boundary:
                "사람들이 돈을 쥐고 있으려 하면 이 수가 내려갑니다. 가진 돈이 그대로여도 건너간 돈은 줄어듭니다.",
            },
          ]}
        />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            <em>
              이제 양쪽을 각각 셀 수 있습니다. 넷을 한 줄로 묶는 것이 다음
              부품입니다.
            </em>
          </p>
        </div>
      </section>

      <section id="four-knobs" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 3. 셋이 정해지면 나머지 하나가 따라옵니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            지금까지의 것을 한 줄로 적으면 네 자리가 한 등식에 들어갑니다. 왼쪽은
            가진 돈과 손 바뀜의 곱이고, 오른쪽은 값과 수량의 곱을 종류마다 더한
            것입니다.
          </p>
        </div>

        <ExplainedFormula
          question="네 자리가 어떻게 묶여 있습니까"
          idea={
            <>
              한 해 동안 건너간 돈과 건너온 물건이 같다는 것을 그대로 식으로
              적은 것입니다. 네 자리 가운데{" "}
              <strong>어느 셋이 정해지든 나머지 하나는 선택의 여지가
              없습니다.</strong>
            </>
          }
          formula={String.raw`M V \;=\; \sum_i p_i\,q_i`}
          annotatedFormula={String.raw`\underbrace{M}_{\text{가진 돈}}\;\underbrace{V}_{\text{손 바뀐 횟수}} \;=\; \sum_i \underbrace{p_i}_{\text{그 물건의 값}}\;\underbrace{q_i}_{\text{오간 수량}}`}
          operations={[
            {
              expression: String.raw`M V`,
              annotation: [
                "곱해야 건너간 돈이 나옵니다",
                "가진 돈만으로는 한 해의 거래를 셀 수 없습니다",
              ],
            },
            {
              expression: String.raw`\sum_i p_i\,q_i`,
              annotation: [
                "종류마다 값과 수량을 곱해 더합니다",
                "빵·석탄·옷감이 각각 한 항입니다",
              ],
            },
            {
              expression: String.raw`P \,T \;=\; \sum_i p_i\,q_i`,
              annotation: [
                "오른쪽을 값 수준 하나와 물량 하나로 줄여 적은 꼴",
                "줄이려면 무엇을 평균으로 삼을지 먼저 정해야 합니다",
              ],
            },
          ]}
          terms={[
            {
              symbol: "M",
              name: "가진 돈",
              description: "어느 시점에 세어 본 돈의 양입니다.",
            },
            {
              symbol: "V",
              name: "손 바뀐 횟수",
              description:
                "한 해 동안 같은 돈이 평균 몇 번 쓰였는지입니다. 기간이 있어야 뜻이 생깁니다.",
            },
            {
              symbol: String.raw`p_i,\; q_i`,
              name: "그 물건의 값과 오간 수량",
              description:
                "종류마다 따로 있습니다. 빵 0.1달러에 2억 개, 석탄 5달러에 1,000만 톤처럼 읽습니다.",
            },
          ]}
          interpretation="이 식은 네 자리가 서로를 제약한다는 것만 말합니다. 어느 자리가 먼저 움직였고 어느 자리가 끌려갔는지는 식 안에 들어 있지 않습니다."
          assumptions={[
            "한 해라는 기간을 먼저 정해야 합니다. V와 q는 기간이 있어야 뜻이 생기고, M은 그렇지 않습니다.",
            "오른쪽을 값 하나와 물량 하나로 줄이려면 무엇을 얼마의 비중으로 평균할지 정해야 합니다. 그 선택이 결과를 바꿉니다.",
            "여기서는 수표와 예금을 뺀 현금만 셉니다. 저자는 뒤에서 이것을 따로 더해 같은 꼴로 확장합니다.",
          ]}
        />

        <FourKnobsViz />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            위 그림의 두 번째 장면부터가 이 묶임의 뜻입니다. 돈의 양은 그대로인데
            같은 돈이 두 배로 자주 쓰이면 값이 두 배가 됩니다. 돈도 손 바뀜도
            그대로인데 오간 물건이 두 배가 되면 값은 절반이 됩니다. 넷째 장면이
            가장 중요합니다 — 가진 돈이 두 배가 되어도 손 바뀜이 절반이면{" "}
            <strong>값은 전혀 움직이지 않습니다.</strong>
          </p>

          <p className="leading-7">
            <em>
              네 자리의 관계는 이제 셀 수 있습니다. 이 식이 무엇을 말하지 않는지는 다음 부품에서 봅니다.
            </em>
          </p>
        </div>
      </section>

      <section id="not-a-cause" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 4. 이 식은 무엇이 무엇을 움직였는지 말하지 않습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            값이 두 배가 되었다고 해 봅시다. 식을 보면 가능한 경우가 여럿입니다.
            가진 돈이 두 배가 되었을 수도 있고 손 바뀜이 두 배가 되었을 수도 있고 오간 물건이 절반이 되었을 수도 있습니다. 셋이 섞여 있을 수도
            있습니다. <strong>관찰된 값 하나로는 가를 수 없습니다.</strong>
          </p>

          <p className="leading-7">
            더 중요한 것은 반대 방향입니다. 가진 돈이 두 배가 되었는데 값이
            그대로인 경우도 식이 허용합니다. 손 바뀜이 절반이 되었거나 오간
            물건이 두 배가 되었으면 그렇습니다. 그래서 돈을 늘리면 값이 오른다는
            말은 이 식에서 바로 나오지 않습니다.
          </p>

          <p className="leading-7">
            Fisher 자신이 그 자리를 못 박았습니다. 돈의 양을 두 배로 만든다고 늘
            값이 두 배가 되는 것은 아니며, 돈의 양은{" "}
            <strong>값 수준을 정하는 세 가지 가운데 하나일 뿐이고 셋이 똑같이
            중요하다</strong>고 적습니다. 이 글이 이 식을 다루는 이유가 그
            문장입니다.
          </p>
        </div>

        <CitationBlock
          source="Fisher, 같은 책 개정판 19~21쪽"
          citeKey={2}
          href="https://archive.org/details/purchasingpower00fish"
        >
          세 경우가 모두 숫자와 함께 적혀 있습니다. 손 바뀜이 두 배가 되면
          빵·석탄·옷감의 값이 0.20·10.00·2.00달러가 되고, 오간 물량이 두 배가
          되면 0.05·2.50·0.50달러가 됩니다(20쪽). 21쪽의 문장이 이 부품의
          전부입니다 — “To double the quantity of money, therefore, is not
          always to double prices. We must distinctly recognize that the
          quantity of money is only one of three factors, all equally important
          in determining the price level.” 16쪽에는 각 단계의 결론이 “true
          solely on the particular hypothesis assumed”라는 단서도 함께 적혀
          있습니다. 21쪽 문장은 쪽 이미지를 직접 열어 대조했습니다.
        </CitationBlock>

        <AlgorithmBlock
          title="값이 올랐을 때 어느 자리가 움직였는지 좁히는 절차"
          input={[
            "두 시점의 값 수준",
            "두 시점의 가진 돈",
            "두 시점의 오간 물량",
          ]}
          steps={[
            {
              code: "값 수준의 변화 배수를 구한다",
              note: "먼저 무엇을 평균으로 삼았는지 확인합니다. 바구니가 다르면 같은 해도 다른 배수가 나옵니다.",
            },
            {
              code: "가진 돈과 오간 물량의 변화 배수를 각각 구한다",
              note: "둘 다 세기 어려운 값입니다. 특히 오간 물량은 종류가 바뀌면 같은 자로 잴 수 없습니다.",
            },
            {
              code: "손 바뀜의 배수 = 값 배수 × 물량 배수 ÷ 돈 배수",
              note: "직접 세지 않고 나머지 셋에서 역산합니다. 그래서 이 수는 독립된 관찰이 아니라 식을 맞추는 나머지입니다.",
            },
          ]}
          output="네 자리의 변화 배수 — 다만 손 바뀜은 관찰이 아니라 역산된 값"
        />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            마지막 줄이 이 식의 한계를 그대로 드러냅니다. 넷 중 셋을 세고 하나를
            역산하면 식은 반드시 맞습니다. 맞는다는 것이 설명이 아닙니다.{" "}
            <strong>틀릴 수 없는 식은 틀릴 수 없다는 이유로 아무것도 반증하지
            못합니다.</strong>
          </p>

          <p className="leading-7">
            <em>
              이쯤에서 끊어도 이 글의 경고는 다 나왔습니다. 그러면 이 식을
              어디에 쓰는지가 남습니다.
            </em>
          </p>
        </div>
      </section>

      <section id="what-to-ask" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 5. 쓸모는 답이 아니라 물어야 할 목록에 있습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            틀릴 수 없는 식에도 쓸모가 있습니다. 네 자리를 빠짐없이 적어 두므로,
            값이 올랐다는 말을 들었을 때 <strong>무엇을 더 물어야 하는지</strong>가
            정해집니다. 돈이 늘었습니까, 같은 돈이 더 자주 쓰였습니까, 아니면
            물건이 줄었습니까. 셋 다 아니라면 그 주장은 식과 맞지 않습니다.
          </p>

          <p className="leading-7">
            앞 글과 이어지는 자리도 여기입니다. 두 해의 총량을 견주려면 그동안
            값이 변한 몫을 걷어내야 하는데, 걷어낸다는 것은 오른쪽 항을 값과
            물량으로 가른다는 뜻입니다. 그래서{" "}
            <Link to="/economics/macro/why-per-head-stalls">
              총량을 사람 수로 나누는 일
            </Link>{" "}
            앞에 값으로 나누는 일이 한 번 더 있습니다. 두 나눗셈을 섞으면 같은
            자료가 다른 이야기를 합니다.
          </p>

          <p className="leading-7">
            다만 값으로 나누는 일에는 1단계에서 본 문제가 그대로 따라옵니다.
            값 수준 하나를 만들려면 무엇을 얼마의 비중으로 평균할지 정해야 하고
            그 선택이 결과를 바꿉니다.{" "}
            <Link to="/economics/labor/measuring-the-spread">
              한 숫자로 줄일 때 잃는 것
            </Link>
            이 여기서도 똑같이 나타납니다.
          </p>
        </div>

        <ProgressiveDetail
          title="그러면 돈을 많이 찍으면 값이 오른다는 말은 틀린 것입니까"
          preview="틀렸다는 뜻이 아니라, 이 식만으로는 그 말을 세울 수 없다는 뜻입니다."
        >
          <p className="leading-7">
            이 식은 네 자리가 서로를 제약한다는 것까지만 말합니다. 돈을 크게 늘린
            자리에서 값이 크게 올랐다는 관찰은 식 밖에서 따로 모아야 하고 그 관찰이 쌓이면 돈과 값 사이에 규칙적인 관계가 있다는 주장을 세울 수
            있습니다. 다만 그때 그 주장을 떠받치는 것은 식이 아니라 자료입니다.
          </p>
          <p className="leading-7">
            식이 하는 일은 그 주장을 세울 때 손 바뀜과 물량이 그동안 어떻게
            움직였는지를 반드시 함께 적게 만드는 것입니다. 그 둘을 적지 않은
            주장은 식이 허용하는 다른 경우들을 배제하지 못합니다.
          </p>
        </ProgressiveDetail>

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            <em>
              이 글의 답은 여기서 끝납니다. 값이 올랐다는 말은 네 자리 중 하나의
              움직임일 뿐이고, 어느 자리인지는 식이 아니라 자료가 말합니다.
            </em>
          </p>
        </div>
      </section>

      <section id="handoff" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          다음은 사람을 세는 자리입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            여기까지 더한 숫자를 읽는 규칙을 둘 봤습니다. 무엇으로 나누느냐에
            따라 같은 사실이 반대로 읽히고, 값이 변한 몫을 걷어내지 않으면 두
            해를 견줄 수 없습니다. 둘 다 숫자가 만들어지는 자리까지 내려가야
            보이는 것이었습니다.
          </p>

          <p className="leading-7">
            다음 글은 더 노골적입니다. 실업률이라는 숫자는 누구를 세고 누구를 빼느냐로 만들어지는데 그 규칙이 국제 기준 문서에 세 조건으로 적혀
            있습니다. 세 조건 중 하나만 바꿔도 같은 나라의 숫자가 달라집니다.
          </p>

          <h3 className="mt-10 mb-4 text-lg font-bold">
            읽고 나서 맞춰 볼 질문
          </h3>

          <p className="leading-7">
            1. 어떤 나라에서 가진 돈이 두 배가 되었는데 값이 그대로였습니다. 식이
            허용하는 설명을 두 가지 대 보십시오.{" "}
            <strong>(답: 부품 4절)</strong>
          </p>

          <p className="leading-7">
            2. 사람들이 불안해서 돈을 쥐고 쓰지 않습니다. 네 자리 중 무엇이
            움직이고, 값은 어느 쪽으로 갑니까. <strong>(답: 부품 2절)</strong>
          </p>

          <p className="leading-7">
            3. 손 바뀜을 직접 세지 않고 나머지 셋에서 역산했다면, 그 식이 맞았다는
            사실이 왜 아무것도 증명하지 못합니까.{" "}
            <strong>(답: 부품 4절)</strong>
          </p>
        </div>

        <ContentBoundary article="what-the-price-level-hides" />
      </section>
    </div>
  );
}

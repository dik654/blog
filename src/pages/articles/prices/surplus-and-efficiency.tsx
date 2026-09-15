import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import SurplusViz from "./surplus-and-efficiency/viz/SurplusViz";
import PriceCapViz from "./surplus-and-efficiency/viz/PriceCapViz";

/**
 * 거래가 만든 값은 누구에게 갑니까
 *
 * 경제 시리즈 4편. 3편이 남긴 "정해진 결과가 좋은 것인가"를 받는다. 두 잉여의
 * 정의, 균형이 총잉여를 최대로 만드는 이유, 값을 묶었을 때의 이전과 소멸까지가
 * 범위다. 효율이 공정이 아니라는 것과 잉여를 더하는 전제를 마지막에 짚는다.
 */
export default function SurplusAndEfficiencyArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          거래가 끝나면 양쪽 모두 무언가를 남깁니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            앞 글에서 값이 7로 정해지고 네 개가 거래됐습니다. 그런데 정해졌다는
            것과 좋다는 것은 다른 말이었습니다. 이 결과를 무엇으로 채점해야
            합니까.
          </p>

          <p className="leading-7">
            실마리는 거래가 끝난 자리에 있습니다. 10까지 낼 수 있었던 사람이 7에
            샀습니다. 3이 남았습니다. 4가 들던 사람이 7에 팔았습니다. 역시 3이
            남았습니다.
          </p>

          <p className="leading-7">
            이 남은 것들을 더한 값이 이 글이 쓸 채점표입니다. 아래 그림이 그것을
            세는 방법입니다.
          </p>
        </div>

        <SurplusViz />

        <ContentBoundary article="surplus-and-efficiency" />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            이 글이 푸는 질문은 하나입니다.{" "}
            <strong>
              거래가 만들어 낸 값이 얼마이고 그것이 누구에게 가는가
            </strong>
            입니다.
          </p>

          <p className="leading-7">
            순서는 양쪽이 각각 무엇을 남기는지 보고, 그 합이 균형에서 가장 커지는
            이유를 확인하고, 값을 묶었을 때 무엇이 옮겨지고 무엇이 사라지는지
            봅니다.
          </p>

          <p className="leading-7">
            이 채점표가 무엇을 재지 못하는지는 마지막 절에서 밝힙니다. 결론부터
            적자면 이 자는 공정을 재지 않습니다.
          </p>
        </div>
      </section>

      <section id="two-surpluses" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 1. 양쪽 모두 값보다 나은 자리에서 거래합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            거래가 일어나려면 사는 쪽이 값보다 더 낼 수 있어야 하고 파는 쪽이
            값보다 덜 들여야 합니다. 그러니 거래된 건마다 양쪽에 여유가
            남습니다.
          </p>

          <p className="leading-7">
            사는 쪽의 여유는 낼 수 있었던 최대 금액에서 실제로 낸 값을 뺀
            것입니다. 앞 글의 여섯 사람 가운데 값 7에 산 넷의 여유가 3, 2, 1,
            0이라 합이 6입니다.
          </p>

          <p className="leading-7">
            파는 쪽의 여유는 받은 값에서 드는 값을 뺀 것입니다. 네 사람의 여유가
            3, 2, 1, 0이라 역시 합이 6입니다.
          </p>

          <p className="leading-7">
            여기서 두 값이 같은 것은 우연입니다. 앞 글에서 두 줄을 대칭으로 잡아 둔 결과일 뿐이고 줄의 모양이 다르면 두 합도 달라집니다.
          </p>

          <p className="leading-7">
            그리고 마지막에 거래한 쪽은 양쪽 다 남는 것이 0입니다. 낼 수 있던
            금액이 값과 같고 드는 값도 값과 같았습니다. 거래해도 그만 안 해도
            그만인 자리입니다.
          </p>

          <p className="leading-7">
            이것이 앞 글의 균형이 어떤 자리였는지를 다시 말해 줍니다. 값은 여유가
            0이 되는 사람이 양쪽에 동시에 나타나는 곳에서 멈춥니다.
          </p>
        </div>

        <TermBreakdown
          title="무엇에서 무엇을 뺀 값인가"
          description="두 여유는 이름이 다를 뿐 같은 모양이고, 기준이 되는 값이 각각 앞 글의 두 줄입니다."
          items={[
            {
              term: "사는 쪽의 여유",
              description:
                "낼 수 있었던 최대 금액에서 실제로 낸 값을 뺀 것입니다.",
              example:
                "10까지 낼 수 있던 사람이 7에 샀으면 3입니다. 여섯 중 산 넷을 더하면 6입니다.",
              boundary:
                "그 최대 금액을 본인도 정확히 알지 못하고 물어봐도 사실대로 말할 이유가 없습니다. 관찰된 선택에서 되짚어 재는 값입니다.",
            },
            {
              term: "파는 쪽의 여유",
              description:
                "받은 값에서 그 한 개를 만드는 데 드는 값을 뺀 것입니다.",
              example:
                "4가 들던 사람이 7에 팔았으면 3입니다. 판 넷을 더하면 6입니다.",
              boundary:
                "드는 값은 그 한 개에 더 드는 것만 셉니다. 이미 지은 설비처럼 되돌릴 수 없는 값은 들어가지 않습니다.",
            },
            {
              term: "둘을 더한 값",
              description:
                "거래가 만들어 낸 값의 총량이며, 이 글이 쓰는 채점표입니다.",
              example:
                "6과 6을 더해 12입니다.",
              boundary:
                "누가 얼마를 가져갔는지는 이 숫자에 들어 있지 않습니다. 같은 12가 아주 다른 분배에서도 나옵니다.",
            },
          ]}
        />
      </section>

      <section id="total-surplus" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 2. 쌍으로 묶으면 값이 지워지고 차이만 남습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            두 여유를 각각 재고 더하는 대신, 산 사람과 판 사람을 쌍으로 묶어
            보겠습니다. 그러면 값이 한 번은 빼지고 한 번은 더해져 사라집니다.
          </p>

          <p className="leading-7">
            남는 것은 낼 수 있었던 금액에서 드는 값을 뺀 차이입니다. 첫 쌍은
            10과 4라 6, 둘째는 9와 5라 4, 셋째는 8과 6이라 2입니다.
          </p>

          <p className="leading-7">
            이 차이에는 값이 들어 있지 않습니다. 그래서 <strong>전체가 얼마인지는
            값과 무관하고, 값은 그것을 어떻게 나눌지만 정합니다.</strong> 2편에서
            교환 비율이 이득의 크기가 아니라 몫만 정했던 것과 같은 구조입니다.
          </p>

          <p className="leading-7">
            이제 몇 쌍까지 거래해야 하는지가 나옵니다. 차이가 양수인 쌍까지는 더할수록 커지고 음수가 되는 쌍부터는 더할수록 줄어듭니다.
          </p>

          <p className="leading-7">
            넷째 쌍은 7과 7이라 차이가 0이고 다섯째는 6과 8이라 −2입니다. 누적이 6, 10, 12, 12, 10, 6이므로 네 쌍까지가 봉우리입니다.
          </p>

          <p className="leading-7">
            앞 글의 균형 수량이 정확히 넷이었습니다. 우연이 아닙니다. 값이 두 줄을 같은 지점에서 자르기 때문에 값이 정해 준 수량과 차이가 양수인 쌍의 수가 같은 것입니다.
          </p>
        </div>

        <ExplainedFormula
          question="거래가 만든 값의 총량은 얼마이고 왜 균형에서 가장 큽니까?"
          idea="한 쌍의 거래가 만든 값은 사는 쪽이 낼 수 있었던 금액에서 파는 쪽에 드는 값을 뺀 차이입니다. 실제 거래 값은 그 차이를 둘로 나누기만 할 뿐 크기를 바꾸지 않으므로, 총량은 거래된 쌍들의 차이를 더한 것입니다. 차이가 양수인 쌍까지 더하면 커지고 음수인 쌍을 더하면 줄어들므로, 차이가 뒤집히기 직전까지가 가장 큽니다."
          formula={String.raw`TS(Q) = \sum_{i=1}^{Q} (v_i - c_i), \qquad Q^{*} = \max\{\, Q : v_Q \ge c_Q \,\}`}
          annotatedFormula={String.raw`TS(Q) = \sum_{i=1}^{Q} \underbrace{(v_i - c_i)}_{\text{값이 지워진 차이}}, \qquad Q^{*} = \max\{\, Q : \underbrace{v_Q \ge c_Q}_{\text{뒤집히기 직전}} \,\}`}
          operations={[
            {
              expression: String.raw`v_i - c_i`,
              annotation: [
                "i번째 쌍에서 사는 쪽이 낼 수 있었던 금액과 파는 쪽에 드는 값의 차이입니다.",
                "실제 값 P를 넣어 (v_i − P) + (P − c_i)로 써 보면 P가 상쇄됩니다. 그래서 이 차이는 값이 얼마든 변하지 않습니다.",
              ],
            },
            {
              expression: String.raw`\sum_{i=1}^{Q} (v_i - c_i)`,
              annotation: [
                "거래된 쌍들의 차이를 모두 더한 것이며, 양쪽 여유를 각각 재어 더한 값과 같습니다.",
                "낼 수 있는 금액을 내림차순, 드는 값을 오름차순으로 세운 뒤 짝지었을 때의 합입니다. 짝을 다르게 지으면 이 합이 더 작아집니다.",
              ],
            },
            {
              expression: String.raw`\max\{\, Q : v_Q \ge c_Q \,\}`,
              annotation: [
                "차이가 음수로 뒤집히기 직전까지의 수량입니다.",
                "v가 내림차순이고 c가 오름차순이면 차이도 감소하므로 부호가 한 번만 바뀌고, 그래서 이 지점이 유일한 봉우리가 됩니다. 1편의 한 단위 판정과 같은 논증입니다.",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`v_i`,
              name: "i번째로 산 사람이 낼 수 있던 금액",
              description:
                "앞 글의 사려는 줄을 내림차순으로 세운 것이며, 그 정체는 기회비용입니다.",
            },
            {
              symbol: String.raw`c_i`,
              name: "i번째로 판 사람에게 드는 값",
              description:
                "앞 글의 팔려는 줄을 오름차순으로 세운 것이며, 그 한 개에 더 드는 값입니다.",
            },
            {
              symbol: String.raw`TS(Q)`,
              name: "Q쌍까지 거래했을 때의 총량",
              description:
                "거래가 만들어 낸 값의 합이며 누가 가져갔는지는 들어 있지 않습니다.",
            },
          ]}
          assumptions={[
            "낼 수 있는 금액이 큰 사람부터, 드는 값이 작은 사람부터 짝지어진다고 둡니다. 짝이 어긋나면 같은 수량에서도 합이 작아집니다.",
            "사람마다의 금액을 같은 자로 더할 수 있다고 둡니다. 같은 1만 원이 누구에게나 같은 무게라는 뜻인데, 이 전제는 마지막 절에서 다시 봅니다.",
            "한 사람이 한 개만 거래한다고 둡니다. 여러 개를 사고파는 경우에는 각 단위마다 금액이 달라져 줄이 사람 단위가 아니라 단위 단위로 다시 세워집니다.",
          ]}
          interpretation="낼 수 있던 금액이 10, 9, 8, 7, 6, 5이고 드는 값이 4, 5, 6, 7, 8, 9라고 하겠습니다. 쌍마다의 차이는 6, 4, 2, 0, −2, −4이고 누적은 6, 10, 12, 12, 10, 6입니다. 네 쌍까지가 가장 크고 그 값이 12입니다. 값 7에서 산 쪽의 여유 6과 판 쪽의 여유 6을 각각 재어 더해도 같은 12가 나옵니다. 여기서 읽어야 할 것은 12라는 숫자에 값 7이 들어 있지 않다는 점입니다. 값이 6이든 8이든 네 쌍이 거래되는 한 총량은 12이고 나뉘는 몫만 달라집니다. 읽으면 안 되는 것은 12가 큰지 작은지에 대한 판단입니다. 이 숫자는 다른 배치와 견줄 때만 뜻이 있고, 그 자체로 좋다 나쁘다를 말하지 않습니다."
        />
      </section>

      <section id="price-cap" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 3. 값을 묶으면 옮겨지는 것과 사라지는 것이 함께 생깁니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            이제 채점표가 있으니 개입의 효과를 잴 수 있습니다. 값을 5 위로 받지
            못하게 묶어 보겠습니다.
          </p>

          <p className="leading-7">
            드는 값이 5를 넘는 사람은 만들지 않습니다. 팔려는 쪽이 둘로
            줄어듭니다. 사려는 쪽은 여섯인데 둘만 나오므로 넷이 못 삽니다.
          </p>

          <p className="leading-7">
            판 쪽이 남기는 것이 6에서 1로 5만큼 줄고, 산 쪽은 6에서 9로 3만큼
            늡니다. <strong>나간 것보다 들어온 것이 적습니다.</strong> 차이인
            2가 어디로도 가지 않고 사라집니다.
          </p>

          <p className="leading-7">
            사라진 2의 정체는 일어나지 않은 거래입니다. 셋째 쌍은 8과 6이라 2를
            만들 수 있었는데 값이 묶여 있어 만들어지지 않았습니다.
          </p>

          <p className="leading-7">
            그런데 위 계산에는 숨은 전제가 있습니다. 낼 수 있던 금액이 가장 큰 둘이 샀다고 두었습니다. 값이 묶이면 값으로 줄을 세울 수 없으므로 실제로는 다른 방식으로 나뉩니다.
          </p>

          <p className="leading-7">
            먼저 온 순서로 나뉜다고 하면 낼 수 있던 금액과 무관하게 둘이
            받습니다. 산 쪽이 남기는 것이 평균 기준으로 5가 되어 합이 6으로
            내려가고, <strong>사라지는 것이 2에서 6으로 늘어납니다.</strong>
          </p>

          <p className="leading-7">
            그래서 값을 묶는 결정에는 늘 두 번째 결정이 따라옵니다. 누가 받을지를 무엇으로 정할 것인가입니다. 그것을 정하지 않으면 줄 서는 시간처럼 아무에게도 가지 않는 비용이 그
            자리를 메웁니다.
          </p>
        </div>

        <PriceCapViz />

        <AlgorithmBlock
          title="개입의 효과를 재는 절차"
          input={[
            "개입 전의 두 줄과 균형",
            "개입의 내용과 그것이 바꾸는 것",
            "누가 받을지를 정하는 방식",
          ]}
          steps={[
            {
              code: "개입 전 총량을 쌍별 차이의 합으로 구한다",
              note: "값이 지워지므로 이 값은 개입 전 가격과 무관합니다.",
            },
            {
              code: "개입 뒤 실제 거래량을 사려는 양과 팔려는 양의 작은 쪽으로 정한다",
              note: "값이 묶이면 두 양이 어긋난 채로 남습니다. 작은 쪽이 실제로 일어나는 거래 수입니다.",
            },
            {
              code: "그 수량에서의 총량을 다시 구하고 차이를 사라진 값으로 적는다",
              note: "만들어질 수 있었는데 만들어지지 않은 쌍의 차이입니다.",
            },
            {
              code: "양쪽 여유를 각각 다시 구해 이동한 몫을 적는다",
              note: "나간 것과 들어온 것이 같지 않습니다. 그 차이가 앞에서 구한 사라진 값과 맞아야 합니다.",
            },
            {
              code: "누가 받을지를 정하는 방식을 넣어 다시 계산한다",
              note: "낼 수 있던 금액 순이 아니면 산 쪽의 여유가 더 작아집니다. 줄 서는 시간처럼 아무에게도 가지 않는 비용도 여기서 더합니다.",
            },
          ]}
          output="이동한 몫과 사라진 값, 그리고 배분 방식에 따라 달라지는 범위"
        />

        <ProgressiveDetail
          title="세금은 같은 자로 재면 부담이 어떻게 나뉘는지까지 보여 줍니다"
          preview="한 개당 세금을 붙이면 사는 값이 오르고 받는 값이 내리는데, 그 비율은 두 줄의 기울기가 정합니다."
        >
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p className="leading-7">
              같은 시장에 한 개당 4의 세금을 붙여 보겠습니다. 파는 쪽이 내는
              것으로 하면 드는 값이 전부 4씩 올라간 것과 같습니다.
            </p>

            <p className="leading-7">
              새 균형은 값 9에 둘입니다. 사는 쪽이 내는 값은 7에서 9로 2 올랐고 파는 쪽이 실제로 받는 값은 7에서 5로 2 내렸습니다. 세금 4가 정확히 반반으로 나뉩니다.
            </p>

            <p className="leading-7">
              반반이 되는 이유는 두 줄의 기울기가 같기 때문입니다. 앞 글에서 낼
              수 있는 금액이 1씩 내려가고 드는 값이 1씩 올라가게 잡았습니다. 한쪽
              줄이 더 가파르면 그쪽이 덜 부담합니다.
            </p>

            <p className="leading-7">
              누가 내도록 정했는지는 이 결과에 들어오지 않습니다. 사는 쪽에 물리도록 바꿔도 같은 비율로 나뉩니다. 법이 정하는 것은 누가 납부하느냐이고 실제 부담은 두 줄의 모양이
              정합니다.
            </p>

            <p className="leading-7">
              총량은 12에서 10으로 줄었습니다. 줄어든 2가 여기서도 만들어지지
              않은 거래의 값입니다. 다만 값을 묶는 경우와 달리 8이 세금으로
              거두어져 어딘가에 남습니다.
            </p>
          </div>
        </ProgressiveDetail>
      </section>

      <section id="not-fairness" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 4. 이 자는 공정을 재지 않습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            채점표가 하나 생겼으니 그것이 무엇을 재지 못하는지를 적어야 합니다.
            두 가지가 있습니다.
          </p>

          <p className="leading-7">
            첫째, 이 숫자에는 누가 가져갔는지가 들어 있지 않습니다. 총량 12는 산
            쪽이 12를 다 가져가도 12이고 판 쪽이 다 가져가도 12입니다. 같은
            점수가 전혀 다른 분배에서 나옵니다.
          </p>

          <p className="leading-7">
            그래서 값을 묶는 결정이 이 자로는 늘 손해로 보입니다. 총량이 줄기
            때문입니다. 그런데 그 결정의 목적은 대개 총량이 아니라 분배에
            있습니다. 목적이 다른 것을 이 자로만 재면 판정이 한쪽으로 기웁니다.
          </p>

          <p className="leading-7">
            둘째, 잉여를 더하려면 사람마다의 금액을 같은 자로 더할 수 있어야
            합니다. 같은 1만 원이 누구에게나 같은 무게라는 뜻입니다.
          </p>

          <p className="leading-7">
            이 전제는 편한 만큼 셉니다. 낼 수 있는 금액은 원하는 정도만이 아니라 낼 수 있는 능력도 함께 반영하므로 많이 가진 쪽의 여유가 더 크게 잡힙니다.
          </p>

          <p className="leading-7">
            그러면 이 자를 버려야 합니까. 그렇지는 않습니다. 이 자가 하는 일은
            좋고 나쁨을 정하는 것이 아니라 <strong>무엇을 포기하고 있는지를
            숫자로 보여 주는 것</strong>입니다. 분배를 위해 총량을 얼마나 포기할
            것인지는 그다음 판단이고, 그 판단은 이 글의 범위 밖입니다.
          </p>
        </div>

        <ProgressiveDetail
          title="효율이라는 말이 뜻하는 것은 생각보다 좁습니다"
          preview="아무도 손해 보지 않으면서 누군가 나아질 여지가 없다는 뜻일 뿐입니다."
        >
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p className="leading-7">
              총량이 가장 큰 상태를 효율적이라고 부릅니다. 그런데 이 말이 뜻하는
              것은 좁습니다. 아직 만들어지지 않은 이득이 남아 있지 않다는
              것뿐입니다.
            </p>

            <p className="leading-7">
              한 사람이 전부 가져가고 나머지가 아무것도 못 가져가는 상태도 이
              뜻에서는 효율적일 수 있습니다. 더 만들 것이 없기 때문입니다.
            </p>

            <p className="leading-7">
              그래서 효율적이라는 판정은 시작점이지 결론이 아닙니다. 효율적이지
              않다면 아무도 손해 보지 않으면서 누군가 나아질 길이 남아 있다는
              뜻이라 그것부터 찾는 편이 낫고, 효율적이라면 이제 나누는 문제만
              남았다는 뜻입니다.
            </p>

            <p className="leading-7">
              이 구분을 흐리는 흔한 표현이 하나 있습니다. 효율적이니 좋다는
              말입니다. 이 자는 좋다는 말을 할 수 있는 자가 아닙니다.
            </p>
          </div>
        </ProgressiveDetail>
      </section>

      <section id="boundary" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          채점까지가 이 글이고, 왜 그 값이 정해지는지는 다음 글입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            네 부품을 합치면 이렇습니다. 양쪽 모두 값보다 나은 자리에서
            거래하므로 여유가 남고, 쌍으로 묶으면 값이 지워져 차이만 남으며, 그
            합이 균형에서 가장 크고, 값을 묶으면 옮겨지는 것과 사라지는 것이
            함께 생깁니다.
          </p>

          <p className="leading-7">
            3편이 남긴 빈칸은 메워졌습니다. 정해진 결과를 재는 자가 생겼고 그 자가 균형을 가장 높게 친다는 것도 확인했습니다. 못 산 두 사람은 낼 수 있는 금액이 드는 값보다 낮아서
            못 산 것이고 그 거래는 일어났다면 총량을 줄였을 것입니다.
          </p>

          <p className="leading-7">
            그런데 새 빈칸이 생겼습니다. 여기까지는 두 줄이 이미 있다고 두고
            계산했습니다. 낼 수 있는 금액과 드는 값을 아무도 모아 두지 않았는데
            어떻게 값 하나가 그 전부를 반영합니까.
          </p>

          <p className="leading-7">
            다음 글은 그 질문을 봅니다. 값 하나가 수천 명의 사정을 어떻게 실어
            나르는지, 그리고 그 일을 중앙에서 계산으로 대신할 수 있는지입니다.
          </p>

          <p className="leading-7">
            다루지 않은 것을 밝혀 둡니다. 총량을 얼마나 포기하고 분배를 바꿀지는
            이 글의 범위 밖이고, 그 판단은{" "}
            <Link to="/politics/polity/collective-choice-problem">
              한 사회에 하나만 존재할 수 있는 결정
            </Link>
            의 영역입니다. 값이 지워진다는 이 글의 계산은 2편에서 교환 비율이
            몫만 정했던 것과 같은 자리이고,{" "}
            <Link to="/economics/scarcity/gains-from-trade#where-gain-comes-from">
              그 유도
            </Link>
            를 그대로 확장한 것입니다.
          </p>
        </div>
      </section>
    </div>
  );
}

import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import KnowledgeSplitViz from "./prices-as-information/viz/KnowledgeSplitViz";
import PriceSignalViz from "./prices-as-information/viz/PriceSignalViz";

/**
 * 가격은 아무도 갖지 않은 지식을 옮깁니다
 *
 * 경제 시리즈 5편. 4편이 남긴 "아무도 모아 두지 않은 사정이 어떻게 값 하나에
 * 담기는가"를 받는다. 분산된 지식, 값이 요약이 되는 조건, 값의 세 역할,
 * 중앙에서 계산할 때 달라지는 것까지가 범위다.
 */
export default function PricesAsInformationArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          아무도 전체를 모르는데 답은 맞게 나옵니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            앞 두 글은 두 줄이 이미 있다고 두고 계산했습니다. 그런데 그 줄은
            어디에도 적혀 있지 않습니다. 열두 개의 숫자가 열두 사람의 머릿속에
            흩어져 있습니다.
          </p>

          <p className="leading-7">
            누구도 그 열두 개를 다 알지 못합니다. 파는 사람은 사는 사람이 얼마까지
            낼 수 있는지 모르고, 사는 사람은 만드는 데 얼마가 드는지 모릅니다.
          </p>

          <p className="leading-7">
            그런데도 값이 맞게 정해지고, 거래되어야 할 것만 거래됩니다. 아래
            그림이 그 일에 실제로 필요한 정보가 얼마인지를 셉니다.
          </p>
        </div>

        <KnowledgeSplitViz />

        <ContentBoundary article="prices-as-information" />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            이 글이 푸는 질문은 하나입니다.{" "}
            <strong>
              아무도 모아 두지 않은 사정이 어떻게 값 하나에 담기는가
            </strong>
            입니다.
          </p>

          <p className="leading-7">
            순서는 알아야 할 것이 왜 한곳에 없는지, 값 하나가 어떻게 그것을
            대신하는지, 아는 것만으로 왜 부족한지, 그리고 중앙에서 계산하면 무엇이
            달라지는지입니다.
          </p>

          <p className="leading-7">
            값이 나르지 못하는 것도 있습니다. 그것은 다음 글부터의 몫이고, 이
            글은 값이 나르는 것까지만 봅니다.
          </p>
        </div>
      </section>

      <section id="dispersed" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 1. 알아야 할 것이 한곳에 모여 있지 않습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            앞 글의 계산을 중앙에서 다시 하려면 열두 개의 숫자가 필요합니다.
            그런데 그 숫자들은 자료로 존재하지 않습니다.
          </p>

          <p className="leading-7">
            낼 수 있는 최대 금액은 그 사람이 지금 무엇을 포기할 수 있는지에
            달려 있습니다. 1편의 표현으로는 기회비용이고, 그것은 그 사람의 사정이
            바뀔 때마다 움직입니다.
          </p>

          <p className="leading-7">
            드는 값도 같습니다. 오늘 재고가 얼마나 남았는지, 이번 주에 설비가
            얼마나 비어 있는지, 옆 가게가 어제 얼마에 팔았는지 같은 것들이
            들어갑니다.
          </p>

          <p className="leading-7">
            이런 것들은 통계로 올라오지 않습니다. 올라올 때쯤이면 이미 바뀌어
            있고, 무엇보다 그 사람 자신도 숫자로 적어 두지 않았습니다.
          </p>

          <p className="leading-7">
            그래서 문제는 계산이 어렵다는 것이 아닙니다.{" "}
            <strong>계산에 넣을 자료가 애초에 한곳에 없다는 것</strong>입니다.
            모으는 일이 계산보다 먼저이고 더 어렵습니다.
          </p>
        </div>

        <CitationBlock
          source="F. A. Hayek, “The Use of Knowledge in Society”, American Economic Review XXXV(4), 1945, pp. 519–530"
          citeKey={1}
          href="https://www.econlib.org/library/Essays/hykKnw.html"
        >
          이 문제를 정면으로 세운 글입니다. 필요한 지식이 어떤 상태로 있는지에
          대해 &ldquo;The knowledge of the circumstances of which we must make use
          never exists in concentrated or integrated form but solely as the
          dispersed bits of incomplete and frequently contradictory knowledge
          which all the separate individuals possess&rdquo;라고 적습니다. 그리고
          값이 하는 일을 &ldquo;We must look at the price system as such a
          mechanism for communicating information if we want to understand its
          real function&rdquo;이라고 정리하며, &ldquo;a kind of machinery for
          registering change, or a system of telecommunications which enables
          individual producers to watch merely the movement of a few
          pointers&rdquo;라는 비유를 덧붙입니다. 원문을 직접 열어 세 대목과
          서지를 확인했습니다. 이 글이 인용하는 것은 지식이 흩어져 있다는 진단과
          값이 그것을 전달한다는 기능까지이고, 같은 글이 이어 가는 계획 경제에
          대한 논쟁은 다루지 않습니다.
        </CitationBlock>
      </section>

      <section id="sufficient" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 2. 값 하나가 그 전부를 대신합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            각자가 옳게 행동하는 데 필요한 것이 몇 개인지 세어 보겠습니다.
            자기 숫자 하나와 시장 값 하나, 둘입니다.
          </p>

          <p className="leading-7">
            10까지 낼 수 있는 사람은 값이 7이면 삽니다. 남이 얼마까지 낼 수
            있는지도, 만드는 데 얼마가 드는지도 알 필요가 없습니다. 비교 한 번이면
            끝납니다.
          </p>

          <p className="leading-7">
            그런데 각자가 그 비교만 했는데 전체가 맞아떨어집니다. 값이 7일 때 사는
            쪽에서 넷이 남고 파는 쪽에서도 넷이 남으며, 그 넷이 앞 글에서 총량이
            가장 컸던 수량입니다.
          </p>

          <p className="leading-7">
            이것이 우연이 아닌 이유는 값이 두 줄을 같은 자리에서 자르기
            때문입니다. 값보다 크면 사고 값보다 작으면 만드는데, 그 두 조건이
            정확히 쌍별 차이가 양수인 구간을 고릅니다.
          </p>

          <p className="leading-7">
            사정이 바뀌면 이 구조가 더 또렷해집니다. 만드는 값이 모두 2씩 올랐다고
            해 보겠습니다. 사는 쪽은 이 사실을 모릅니다.
          </p>

          <p className="leading-7">
            값이 8로 움직이고, 8을 못 내는 셋이 물러납니다. 왜 올랐는지 아무도
            알려 주지 않았는데 물러나야 할 사람이 정확히 물러납니다.{" "}
            <strong>값이 움직였다는 사실 하나가 바뀐 사정 전부를 대신했습니다.</strong>
          </p>
        </div>

        <ExplainedFormula
          question="각자가 자기 숫자만 보고 내린 결정이 왜 전체 최적과 같아집니까?"
          idea="각자의 행동은 자기 숫자를 시장 값과 견주는 비교 하나입니다. 값보다 더 낼 수 있으면 사고 값보다 덜 들면 만듭니다. 값이 균형값이면 이 두 조건을 통과하는 수가 양쪽에서 같아지고, 그 수량이 앞 글에서 쌍별 차이가 양수인 구간의 끝과 일치합니다. 그래서 전체를 아무도 계산하지 않아도 각 비교의 합이 전체 최적 수량이 됩니다."
          formula={String.raw`a_i = \mathbb{1}[\,v_i \ge P\,], \quad b_j = \mathbb{1}[\,c_j \le P\,] \;\Longrightarrow\; \sum_i a_i = \sum_j b_j = Q^{*}`}
          annotatedFormula={String.raw`\underbrace{a_i = \mathbb{1}[\,v_i \ge P\,]}_{\text{각자의 비교 한 번}}, \; \underbrace{b_j = \mathbb{1}[\,c_j \le P\,]}_{\text{파는 쪽도 한 번}} \;\Longrightarrow\; \underbrace{\textstyle\sum_i a_i = Q^{*}}_{\text{총량이 가장 큰 수량}}`}
          operations={[
            {
              expression: String.raw`\mathbb{1}[\,v_i \ge P\,]`,
              annotation: [
                "i번째 사람이 낼 수 있는 금액을 값과 견주어 사면 1, 안 사면 0입니다.",
                "이 판정에 남의 숫자가 들어가지 않습니다. 필요한 것은 자기 숫자와 값뿐이라 시장이 커져도 판정의 비용이 늘지 않습니다.",
              ],
            },
            {
              expression: String.raw`\sum_i a_i = \sum_j b_j`,
              annotation: [
                "사겠다는 사람 수와 만들겠다는 사람 수가 같아지는 것이 균형값의 정의입니다.",
                "이 등식이 성립하지 않으면 남은 쪽이 값을 밀어 움직이므로, 값이 멈춰 있다는 것 자체가 이 등식이 성립한다는 뜻입니다.",
              ],
            },
            {
              expression: String.raw`Q^{*}`,
              annotation: [
                "앞 글에서 쌍별 차이를 더한 총량이 가장 큰 수량입니다.",
                "이 수량과 위 두 합이 같다는 것이 이 식의 내용입니다. 값이 두 줄을 같은 자리에서 자르므로 세 수가 한 점을 가리킵니다.",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`v_i,\; c_j`,
              name: "각자의 숫자",
              description:
                "낼 수 있는 최대 금액과 한 개 더 만드는 데 드는 값이며, 본인만 알고 어디에도 모여 있지 않습니다.",
            },
            {
              symbol: String.raw`P`,
              name: "시장 값",
              description:
                "모두가 볼 수 있는 하나의 숫자이며, 각자가 자기 숫자와 견주는 유일한 외부 정보입니다.",
            },
            {
              symbol: String.raw`Q^{*}`,
              name: "총량이 가장 큰 수량",
              description:
                "낼 수 있는 금액에서 드는 값을 뺀 차이가 양수인 쌍의 수입니다.",
            },
          ]}
          assumptions={[
            "값이 균형에 도달했다고 둡니다. 아직 움직이는 중이면 각자의 판정이 옳아도 합이 최적과 어긋납니다.",
            "사는 쪽이 내는 값과 파는 쪽이 받는 값이 같다고 둡니다. 세금이나 중간 마진이 끼면 두 값이 갈라져 판정 기준이 둘이 됩니다.",
            "한 사람의 결정이 남의 숫자를 바꾸지 않는다고 둡니다. 이 전제가 깨지는 경우가 다음 글의 주제입니다.",
          ]}
          interpretation="낼 수 있는 금액이 10, 9, 8, 7, 6, 5이고 드는 값이 4, 5, 6, 7, 8, 9인 시장에서 값이 7이면 사겠다는 사람이 넷, 만들겠다는 사람도 넷입니다. 앞 글에서 쌍별 차이가 6, 4, 2, 0, −2, −4라 총량이 가장 큰 수량도 넷이었습니다. 이제 드는 값이 모두 2씩 올라 6, 7, 8, 9, 10, 11이 되면 값이 8로 움직이고 사겠다는 사람이 셋으로 줄어듭니다. 새 쌍별 차이는 4, 2, 0, −2, −4, −6이라 총량이 가장 큰 수량도 셋입니다. 여기서 읽어야 할 것은 사는 쪽이 드는 값이 올랐다는 사실을 끝까지 몰랐다는 점입니다. 받은 정보는 값이 8이라는 것 하나이고, 그것만으로 물러나야 할 셋이 물러났습니다. 읽으면 안 되는 것은 이 일치가 언제나 일어난다는 결론입니다. 값이 움직이는 중이거나, 사는 쪽이 내는 값과 파는 쪽이 받는 값이 갈라져 있거나, 한 사람의 결정이 남의 숫자를 바꾸면 이 등식이 깨집니다."
        />

        <PriceSignalViz />
      </section>

      <section id="three-roles" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 3. 아는 것만으로는 부족하고 따를 이유가 있어야 합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            값이 정보를 나른다는 것만으로는 설명이 절반입니다. 정보를 받았다고
            그대로 따를 이유가 생기지는 않기 때문입니다.
          </p>

          <p className="leading-7">
            누군가 재료가 귀해졌다고 알려 주었다고 해 보겠습니다. 그래서 아껴야
            한다는 것도 알았습니다. 그런데 내가 아껴서 생기는 이득은 남에게
            갑니다. 알고도 안 아낄 이유가 충분합니다.
          </p>

          <p className="leading-7">
            값은 다릅니다. 값이 오르면 아끼지 않는 사람이 더 냅니다. 알려 주는
            일과 따르게 만드는 일을 같은 숫자가 동시에 합니다.
          </p>

          <p className="leading-7">
            그리고 세 번째가 있습니다. 그 숫자가 실제로 누가 가져갈지까지
            정합니다. 8을 낼 수 있는 사람이 가져가고 7까지인 사람은 못 가져
            갑니다.
          </p>

          <p className="leading-7">
            세 역할이 한 숫자에 묶여 있다는 것이 편리한 동시에 불편합니다. 하나를
            건드리면 셋이 다 움직이기 때문입니다.
          </p>

          <p className="leading-7">
            앞 글에서 값을 묶었을 때가 그 예입니다. 나누는 방식을 바꾸려고 값을
            건드렸는데 정보와 유인이 함께 꺼졌습니다. 그래서 만들 사람이 줄고,
            누가 받을지를 따로 정해야 했습니다.
          </p>
        </div>

        <TermBreakdown
          title="한 숫자가 하는 세 가지 일"
          description="값을 건드리는 개입은 셋을 한꺼번에 건드립니다."
          items={[
            {
              term: "알려 주기",
              description:
                "어딘가에서 사정이 바뀌었다는 것을 그 이유를 말하지 않고 전달합니다.",
              example:
                "드는 값이 올랐는지 다른 곳에서 더 급하게 쓰게 됐는지 모르는 채로, 값이 8이 됐다는 것만 받습니다.",
              boundary:
                "값이 왜 움직였는지는 담기지 않습니다. 원인을 알아야 하는 판단에는 값만으로 부족합니다.",
            },
            {
              term: "따르게 하기",
              description:
                "그 신호를 무시하면 자기 손해가 되도록 만듭니다.",
              example:
                "아끼지 않으면 더 내야 하므로, 알려 주는 것과 따로 설득할 필요가 없습니다.",
              boundary:
                "이 역할은 자기 손해로 돌아올 때만 작동합니다. 손해가 남에게 가면 신호를 알아도 따르지 않습니다.",
            },
            {
              term: "누가 가져갈지 정하기",
              description:
                "값을 낼 수 있는 쪽이 가져가는 방식으로 배분까지 끝냅니다.",
              example:
                "값이 8이면 8 이상을 낼 수 있는 셋이 가져갑니다.",
              boundary:
                "낼 수 있는 금액에는 얼마나 원하는지와 얼마나 낼 수 있는지가 섞여 있습니다. 4편에서 이 자가 공정을 재지 않는다고 한 것이 여기와 이어집니다.",
            },
          ]}
        />
      </section>

      <section id="central-calculation" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 4. 중앙에서 계산하려면 자료를 먼저 모아야 합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            그러면 중앙에서 계산하면 어떻습니까. 앞 글의 문제는 숫자 열두 개짜리
            선형 문제라 계산 자체는 어렵지 않습니다.
          </p>

          <p className="leading-7">
            어려운 것은 그 앞입니다. 열두 개를 모아야 하는데, 각자에게 물어야
            하고, 물어도 사실대로 답할 이유가 없습니다.
          </p>

          <p className="leading-7">
            사실대로 답할 이유가 없는 것이 핵심입니다. 배분이 내 답에 달려 있으면
            나는 답을 유리하게 고릅니다. 사는 쪽은 낮게 부르고 파는 쪽은 높게
            부릅니다.
          </p>

          <p className="leading-7">
            시장에서는 이 문제가 다르게 풀립니다. 낮게 부르면 못 사고 높게 부르면
            못 팝니다. 말이 아니라 행동으로 답하게 되어 있어서, 거짓으로 답하면
            자기가 손해를 봅니다.
          </p>

          <p className="leading-7">
            그리고 자료는 계속 바뀝니다. 모으는 데 걸린 시간만큼 낡은 자료로
            계산하게 되고, 그 사이에 바뀐 사정은 다음 주기까지 반영되지
            않습니다.
          </p>

          <p className="leading-7">
            그러니 비교해야 할 것은 계산의 정확도가 아닙니다. 낡은 자료로 정확히
            푸는 쪽과, 각자가 최신 정보로 거칠게 반응하는 쪽 가운데 어느 쪽이
            나은가입니다. 답은 자료가 얼마나 빨리 바뀌는지에 달려 있습니다.
          </p>
        </div>

        <AlgorithmBlock
          title="같은 배분에 이르는 두 경로"
          input={[
            "각자만 아는 숫자",
            "그 숫자가 바뀌는 속도",
            "거짓으로 답할 때의 이득",
          ]}
          steps={[
            {
              code: "중앙: 모두에게 물어 숫자를 모은다",
              note: "여기서 시간이 들고, 모으는 동안 원본이 바뀝니다.",
            },
            {
              code: "중앙: 답이 사실인지 확인할 방법을 마련한다",
              note: "배분이 답에 달려 있으면 유리하게 답할 이유가 생깁니다. 이 단계가 없으면 앞 단계의 자료가 쓸모없습니다.",
            },
            {
              code: "중앙: 모은 숫자로 풀고 결과를 내려보낸다",
              note: "계산 자체는 대개 가장 쉬운 단계입니다.",
            },
            {
              code: "시장: 값 하나를 공개하고 각자가 자기 숫자와 견준다",
              note: "묻지 않고 행동을 봅니다. 낮게 부르면 못 사고 높게 부르면 못 팔아서 거짓이 자기 손해가 됩니다.",
            },
            {
              code: "시장: 남는 쪽이 값을 밀어 다시 견주게 한다",
              note: "자료를 다시 모으는 단계가 없습니다. 바뀐 사정은 그 사람의 행동으로 곧장 들어옵니다.",
            },
          ]}
          output="같은 배분에 이르는 두 경로와, 각각이 무엇에서 시간을 쓰는지"
        />

        <ProgressiveDetail
          title="그래서 계산이 빨라지면 답이 달라집니까"
          preview="빨라지는 것은 세 단계 가운데 가장 쉬운 하나뿐이라, 앞의 두 단계가 남습니다."
        >
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p className="leading-7">
              계산 능력이 늘면 중앙에서 푸는 쪽이 유리해진다고 생각하기
              쉽습니다. 그런데 빨라지는 것은 세 단계 가운데 마지막 하나입니다.
            </p>

            <p className="leading-7">
              모으는 단계는 빨라질 수 있습니다. 거래 기록이 자동으로 쌓이면 관찰된
              행동에서 숫자를 되짚어 잴 수 있습니다. 실제로 그렇게 하는 곳이
              늘었습니다.
            </p>

            <p className="leading-7">
              사실인지 확인하는 단계는 그렇지 않습니다. 배분이 답에 달려 있는 한
              유리하게 답할 이유가 남습니다. 이것은 계산의 문제가 아니라 유인의
              문제라 계산량으로 풀리지 않습니다.
            </p>

            <p className="leading-7">
              그래서 실제로 늘어난 것은 중앙 계획이 아니라 값을 더 자주 바꾸는
              방식입니다. 관찰된 행동으로 값을 자주 갱신하는 쪽은 두 경로의
              장점을 섞은 것이고, 이 글의 대비를 대체하지는 않습니다.
            </p>
          </div>
        </ProgressiveDetail>
      </section>

      <section id="boundary" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          값이 나르지 못하는 것이 다음 글입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            네 부품을 합치면 이렇습니다. 알아야 할 것이 한곳에 없고, 값 하나가
            각자에게 필요한 만큼만 전달하며, 그 숫자가 알려 주는 일과 따르게 하는
            일과 나누는 일을 동시에 하고, 중앙에서 하려면 계산보다 수집과 검증이
            먼저 걸립니다.
          </p>

          <p className="leading-7">
            여기까지가 2부입니다. 3편에서 값이 어떻게 정해지는지, 4편에서 그
            결과를 무엇으로 채점하는지, 이 글에서 왜 그 일이 가능한지를 봤습니다.
          </p>

          <p className="leading-7">
            그런데 이 전부에 전제가 하나 깔려 있었습니다. 한 사람의 결정이 남의
            숫자를 바꾸지 않는다는 것입니다. 앞 절의 식에서도 가정으로 적어
            두었습니다.
          </p>

          <p className="leading-7">
            그 전제가 깨지면 어떻게 됩니까. 내 결정이 남의 비용을 올리는데 그
            값이 내 장부에 안 적히면, 내가 보는 값은 더 이상 사정을 옳게 말해
            주지 않습니다.
          </p>

          <p className="leading-7">
            다음 글부터는 그 경우를 봅니다. 같은 장치가 반대로 작동하는 조건
            셋을 차례로 셉니다. 값이 놓치는 비용, 값을 받을 수 없는 경우, 그리고
            한쪽만 아는 것이 있는 경우입니다.
          </p>

          <p className="leading-7">
            다루지 않은 것을 밝혀 둡니다. 값이 아예 없는 것들, 그리고 파는 쪽이
            하나뿐이라 값을 부르는 쪽이 생기는 경우는 이 글의 범위 밖입니다.
            앞 글의 채점표가 공정을 재지 않는다는 것도{" "}
            <Link to="/economics/prices/surplus-and-efficiency#not-fairness">
              그대로 유효
            </Link>
            합니다. 값이 정보를 잘 나른다는 것과 그 결과가 좋다는 것은 다른
            말입니다.
          </p>
        </div>
      </section>
    </div>
  );
}

import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import SocialCostViz from "./externalities-and-social-cost/viz/SocialCostViz";
import CoaseViz from "./externalities-and-social-cost/viz/CoaseViz";

/**
 * 장부에 적히지 않은 비용은 누가 냅니까
 *
 * 경제 시리즈 6편. 5편이 전제로 둔 "한 사람의 결정이 남의 숫자를 바꾸지
 * 않는다"가 깨지는 첫 경우다. 두 비용의 분리, 과잉의 크기, 값에 얹는 길과
 * 권리를 정해 협상시키는 길까지가 범위다. 상대를 특정할 수 없는 경우는 7편.
 */
export default function ExternalitiesAndSocialCostArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          값이 옳게 말하려면 드는 것이 전부 장부에 적혀야 합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            앞 글에서 값 하나가 사정을 옳게 전달했습니다. 그런데 그 계산에는
            전제가 하나 있었습니다. 한 사람의 결정이 남의 숫자를 바꾸지 않는다는
            것입니다.
          </p>

          <p className="leading-7">
            이제 그 전제를 풀어 보겠습니다. 만들 때마다 매연이 나오고, 그것을
            옆 사람이 마십니다. 만든 사람의 장부에는 그 값이 적히지 않습니다.
          </p>

          <p className="leading-7">
            그러면 값은 장부에 적힌 것만 보고 정해집니다. 아래 그림이 그
            차이가 어디서 벌어지는지입니다.
          </p>
        </div>

        <SocialCostViz />

        <ContentBoundary article="externalities-and-social-cost" />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            이 글이 푸는 질문은 하나입니다.{" "}
            <strong>
              장부에 적히지 않은 값이 있으면 값은 무엇을 잘못 말하고, 그것을
              어떻게 되돌리는가
            </strong>
            입니다.
          </p>

          <p className="leading-7">
            순서는 두 비용이 어디서 갈라지는지, 그 차이가 수량을 얼마나
            어긋나게 하는지, 값에 얹어 되돌리는 길과 권리를 정해 협상시키는
            길을 차례로 봅니다.
          </p>

          <p className="leading-7">
            상대를 특정할 수 없는 경우는 다루지 않습니다. 매연을 마신 사람이
            누구인지 알 수 없으면 아래의 두 번째 길이 아예 열리지 않고, 그
            경우는 다음 글의 주제입니다.
          </p>
        </div>
      </section>

      <section id="two-costs" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 1. 장부에 적히는 값과 실제로 드는 값이 갈라집니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            만드는 쪽의 장부에는 재료와 시간과 전기가 적힙니다. 앞 세 글에서
            팔려는 줄을 만든 것이 그 숫자들입니다.
          </p>

          <p className="leading-7">
            그런데 만들 때마다 2만큼이 제삼자에게 갑니다. 그 사람은 이 시장에
            참여하지 않습니다. 사려는 줄에도 팔려는 줄에도 그의 2는 없습니다.
          </p>

          <p className="leading-7">
            그래서 값은 그 2를 모른 채 정해집니다. 5편에서 값이 사정을 옳게
            전달했던 이유는 관련된 사람들이 전부 그 줄 어딘가에 있었기
            때문인데, 지금은 한 사람이 밖에 서 있습니다.
          </p>

          <p className="leading-7">
            여기서 한 가지를 분명히 해 두어야 합니다. 이 문제는 누가 나쁜
            사람이냐의 문제가 아닙니다. 만드는 쪽을 막으면 이번에는 만드는
            쪽이 손해를 봅니다. <strong>피하려는 손해와 막아서 생기는 손해가
            양쪽에 다 있습니다.</strong>
          </p>

          <p className="leading-7">
            그러니 물어야 할 것은 누구를 벌할지가 아니라 어느 쪽 손해가 더
            큰지입니다. 그것을 재려면 두 숫자를 같은 자에 올려야 하고, 이 글의
            나머지가 그 일입니다.
          </p>
        </div>

        <CitationBlock
          source="R. H. Coase, “The Problem of Social Cost”, The Journal of Law and Economics, Volume III, October 1960"
          citeKey={1}
          href="https://www.law.uchicago.edu/sites/default/files/file/coase-problem.pdf"
        >
          문제를 한쪽이 다른 쪽에 해를 끼치는 구도로 보는 것부터 틀렸다고
          적습니다. &ldquo;We are dealing with a problem of a reciprocal nature.
          To avoid the harm to B would inflict harm on A. The real question that
          has to be decided is: should A be allowed to harm B or should B be
          allowed to harm A? The problem is to avoid the more serious
          harm.&rdquo; 제과점 기계의 소음이 옆 의사의 진료를 방해한 사건을 들어,
          의사를 보호하면 제과점이 손해를 본다는 점을 짚습니다. 1960년 10월
          제3권 원문 PDF를 내려받아 이 대목과 아래 절들에서 인용한 문장들을 직접
          대조했습니다. 이 글이 인용하는 것은 문제의 구조와 거래비용에 대한
          논지까지이고, 같은 글이 다루는 판례 분석과 규제 방식 비교는 범위 밖
          입니다.
        </CitationBlock>
      </section>

      <section id="overproduction" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 2. 갈라진 만큼 더 만들어집니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            값이 2를 모른다면 결과가 얼마나 어긋나는지 세어 보겠습니다. 4편의
            방법을 그대로 쓰되 드는 값에 2를 더해서 다시 잽니다.
          </p>

          <p className="leading-7">
            장부만 보면 쌍별 차이가 6, 4, 2, 0, −2, −4라 네 쌍까지가
            봉우리였습니다. 2를 더하면 4, 2, 0, −2, −4, −6이 되어 셋째까지가
            봉우리입니다.
          </p>

          <p className="leading-7">
            그런데 시장은 여전히 넷을 만듭니다. 값이 7이고 7까지 낼 수 있는
            사람이 넷이기 때문입니다. <strong>하나가 더 만들어집니다.</strong>
          </p>

          <p className="leading-7">
            그 넷째 한 개가 얼마를 깎아먹는지도 나옵니다. 그 쌍의 실제 차이가
            −2이니 2만큼입니다. 만든 쪽은 0을 벌었고 옆 사람은 2를 잃었습니다.
          </p>

          <p className="leading-7">
            여기서 읽어야 할 것은 어긋남의 방향입니다. 장부에 안 적히는 값이
            있으면 <strong>늘 더 만들어집니다.</strong> 반대로 장부에 안 적히는
            이득이 있으면 덜 만들어집니다.
          </p>

          <p className="leading-7">
            그리고 전부를 막는 것이 답은 아닙니다. 첫 세 개는 실제로 드는 값을
            다 세어도 남습니다. 문제는 만드는 일 자체가 아니라 몇 개째부터가
            밑지느냐입니다.
          </p>
        </div>

        <ExplainedFormula
          question="장부에 안 적히는 값이 있으면 수량이 얼마나 어긋납니까?"
          idea="시장은 장부에 적힌 값만으로 멈출 자리를 정하고, 실제로 옳은 자리는 그 값에 빠진 몫을 더해 잰 것입니다. 두 기준이 다르므로 멈추는 수량도 다르고, 그 사이의 단위들은 만들어졌지만 실제로는 밑진 것들입니다. 깎아먹은 양은 그 구간에서 빠진 몫과 남은 차이의 차액을 더한 것입니다."
          formula={String.raw`Q^{m} = \max\{Q : v_Q \ge c_Q\}, \quad Q^{s} = \max\{Q : v_Q \ge c_Q + e\}, \quad L = \sum_{i=Q^{s}+1}^{Q^{m}} (c_i + e - v_i)`}
          annotatedFormula={String.raw`\underbrace{Q^{m} = \max\{Q : v_Q \ge c_Q\}}_{\text{장부만 보는 시장}}, \quad \underbrace{Q^{s} = \max\{Q : v_Q \ge c_Q + e\}}_{\text{빠진 몫까지 센 자리}}, \quad \underbrace{L = \textstyle\sum (c_i + e - v_i)}_{\text{더 만든 몫이 깎아먹은 양}}`}
          operations={[
            {
              expression: String.raw`v_Q \ge c_Q`,
              annotation: [
                "시장의 판정이며 장부에 적힌 값만 들어갑니다.",
                "5편에서 각자의 비교가 전체 최적과 맞물렸던 것은 이 판정에 빠진 항이 없을 때의 이야기입니다.",
              ],
            },
            {
              expression: String.raw`v_Q \ge c_Q + e`,
              annotation: [
                "제삼자가 지는 몫까지 더해 잰 판정입니다.",
                "e가 양수면 이 조건이 더 까다로우므로 멈추는 자리가 앞으로 당겨집니다. e가 음수, 그러니까 남에게 이득이 가는 경우에는 반대로 밀립니다.",
              ],
            },
            {
              expression: String.raw`\sum_{i=Q^{s}+1}^{Q^{m}} (c_i + e - v_i)`,
              annotation: [
                "두 자리 사이에서 만들어진 단위마다 실제로 든 값이 낼 수 있던 금액을 얼마나 넘었는지를 더한 것입니다.",
                "이 합은 만든 쪽의 이득이 아니라 전체가 잃은 양입니다. 만든 쪽은 그 구간에서도 손해를 보지 않았고, 잃은 것은 제삼자입니다.",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`e`,
              name: "장부에 적히지 않는 몫",
              description:
                "한 단위를 만들 때마다 만든 사람이 내지 않고 제삼자가 지는 값이며, 이득인 경우에는 음수가 됩니다.",
            },
            {
              symbol: String.raw`Q^{m},\; Q^{s}`,
              name: "시장이 멈추는 자리와 옳은 자리",
              description:
                "각각 장부만 보고 잰 수량과 빠진 몫까지 세어 잰 수량입니다.",
            },
            {
              symbol: String.raw`L`,
              name: "깎아먹은 양",
              description:
                "두 자리 사이에서 만들어진 단위들이 전체에서 덜어낸 값입니다.",
            },
          ]}
          assumptions={[
            "빠진 몫이 단위마다 같다고 둡니다. 실제로는 첫 단위와 백 번째 단위의 피해가 다르고, 대개 뒤로 갈수록 커집니다.",
            "그 몫을 숫자로 알 수 있다고 둡니다. 이 전제가 다음 절에서 가장 크게 걸립니다.",
            "피해를 입는 쪽이 값을 낮추는 방식으로 대응하지 않는다고 둡니다. 창문을 닫거나 이사하는 선택이 있으면 실제 피해는 그보다 작아집니다.",
          ]}
          interpretation="낼 수 있는 금액이 10, 9, 8, 7, 6, 5이고 장부에 적히는 값이 4, 5, 6, 7, 8, 9이며 만들 때마다 2가 제삼자에게 간다고 하겠습니다. 시장은 값 7에서 멈춰 네 개를 만듭니다. 실제로 드는 값은 6, 7, 8, 9, 10, 11이라 쌍별 차이가 4, 2, 0, −2, −4, −6이고 셋째까지가 봉우리입니다. 그래서 한 개가 더 만들어지고, 그 한 개의 실제 차이가 −2이므로 2만큼을 깎아먹습니다. 여기서 읽어야 할 것은 만든 쪽이 그 넷째에서 손해를 보지 않았다는 점입니다. 7에 팔아 7이 들었으니 본전이고, 잃은 것은 이 거래에 끼지 않은 사람입니다. 읽으면 안 되는 것은 만드는 일을 전부 막아야 한다는 결론입니다. 첫 세 개는 제삼자의 몫까지 다 세어도 남으므로, 문제는 만드는 일 자체가 아니라 몇 개째부터가 밑지느냐입니다."
        />
      </section>

      <section id="pricing-in" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 3. 빠진 몫을 값에 얹으면 다시 맞습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            문제가 값에 빠진 항이라면 답도 거기에 있습니다. 빠진 만큼을 값에
            얹으면 장부가 실제와 같아집니다.
          </p>

          <p className="leading-7">
            한 개당 2를 물리면 만드는 쪽의 장부가 6, 7, 8, 9, 10, 11이 됩니다.
            5편에서 이미 계산한 상황입니다. 값이 8로 움직이고 세 개가 만들어
            집니다.
          </p>

          <p className="leading-7">
            정확히 옳은 수량입니다. 그리고 그 과정에서 아무도 제삼자의 사정을
            알 필요가 없었습니다. 값이 8이라는 것만 보고 넷째를 만들려던 사람이
            물러났습니다.
          </p>

          <p className="leading-7">
            그런데 여기에 5편의 문제가 그대로 돌아옵니다.{" "}
            <strong>2라는 숫자를 누가 압니까.</strong> 그것을 알려면 매연이
            누구에게 얼마의 피해를 주는지를 모아야 하는데, 그것이 바로 5편에서
            모으기 어렵다고 한 종류의 정보입니다.
          </p>

          <p className="leading-7">
            그리고 물어보면 부풀려 답할 이유가 있습니다. 피해액을 크게 부를수록
            내 쪽에 유리하기 때문입니다. 5편의 검증 문제도 같이 돌아옵니다.
          </p>

          <p className="leading-7">
            그래서 이 길은 원리가 깔끔한 만큼 실행이 어렵습니다. 얹는 값이
            실제보다 크면 덜 만들어지고 작으면 여전히 더 만들어집니다. 틀린
            방향을 고르는 것은 아니지만 정확히 맞추기가 어렵습니다.
          </p>
        </div>

        <TermBreakdown
          title="얹는 값이 빗나가면"
          description="방향은 맞아도 크기가 틀리면 다른 자리에서 멈춥니다."
          items={[
            {
              term: "정확히 맞으면",
              description: "장부가 실제와 같아져 시장이 옳은 자리에서 멈춥니다.",
              example:
                "2를 물리면 값이 8이 되고 세 개가 만들어져 봉우리와 일치합니다.",
              boundary:
                "이 경우에도 제삼자에게 돈이 가지는 않습니다. 걷힌 돈이 어디로 가는지는 이 계산과 별개의 결정입니다.",
            },
            {
              term: "실제보다 작으면",
              description:
                "여전히 장부가 실제보다 싸서 더 만들어집니다.",
              example:
                "1만 물리면 값이 7과 8 사이에 걸려 넷째가 살아남을 수 있습니다.",
              boundary:
                "방향은 맞으므로 아무것도 안 하는 것보다는 낫습니다. 다만 얼마나 남았는지를 알 방법이 없습니다.",
            },
            {
              term: "실제보다 크면",
              description:
                "장부가 실제보다 비싸져 만들어져야 할 것까지 막힙니다.",
              example:
                "4를 물리면 두 개만 남아 셋째가 사라지는데, 셋째는 다 세어도 밑지지 않는 단위였습니다.",
              boundary:
                "덜 만드는 쪽의 손해는 눈에 잘 띄지 않습니다. 만들어지지 않은 것은 아무도 아쉬워하지 않기 때문입니다.",
            },
          ]}
        />
      </section>

      <section id="bargaining" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 4. 값을 얹는 대신 권리를 정해 주고 맡길 수도 있습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            다른 길이 있습니다. 얼마인지를 맞히려 하지 말고, 넷째를 만들
            권리가 누구에게 있는지만 정해 주고 둘이 알아서 하게 두는 것입니다.
          </p>

          <p className="leading-7">
            권리가 만드는 쪽에 있다고 해 보겠습니다. 넷째로 만드는 쪽이 얻는
            것은 0이고 옆 사람이 잃는 것은 2입니다. 옆 사람이 그 사이의 금액을
            주고 만들지 말라고 하면 양쪽 다 낫습니다.
          </p>

          <p className="leading-7">
            권리가 옆 사람에게 있으면 만드는 쪽이 허락을 사야 합니다. 옆 사람은
            2 아래로는 안 파는데 만드는 쪽이 얻는 것은 0입니다. 살 수 없으니
            만들지 않습니다.
          </p>

          <p className="leading-7">
            <strong>두 경우 모두 셋에서 멈춥니다.</strong> 권리를 누구에게 주든
            만들어지는 양이 같고 돈의 방향만 반대입니다. 2편에서 교환 비율이,
            4편에서 값이 몫만 정했던 것과 같은 자리입니다.
          </p>

          <p className="leading-7">
            그런데 이 결과에는 앞의 것보다 더 센 전제가 붙어 있습니다. 상대를
            찾고 서로의 숫자를 알고 약속을 맺는 데 값이 들지 않는다는 것입니다.
          </p>

          <p className="leading-7">
            그 값이 들기 시작하면 결론이 뒤집힙니다. 넷째를 막아서 생기는 이득이
            2뿐인데 협상에 3이 들면 아무도 협상하지 않습니다. 그러면 권리가
            만드는 쪽에 있을 때 넷째가 그대로 만들어집니다.
          </p>

          <p className="leading-7">
            그래서 협상이 막힐 때는 권리를 아무 데나 두면 안 됩니다.{" "}
            <strong>협상이 열렸다면 갔을 쪽에 처음부터 두는 편이 낫습니다.</strong>{" "}
            여기서 이 글은 법의 영역으로 넘어갑니다.
          </p>
        </div>

        <CoaseViz />

        <CitationBlock
          source="R. H. Coase, “The Problem of Social Cost”, The Journal of Law and Economics, Volume III, October 1960, §VI"
          citeKey={2}
          href="https://www.law.uchicago.edu/sites/default/files/file/coase-problem.pdf"
        >
          앞 절들의 전제를 스스로 풀어내는 대목입니다. 값이 들지 않을 때에
          대해서는 &ldquo;if such market transactions are costless, such a
          rearrangement of rights will always take place if it would lead to an
          increase in the value of production&rdquo;이라고 적고, 곧바로 그
          전제를 &ldquo;a very unrealistic assumption&rdquo;이라고 부릅니다. 무엇에
          값이 드는지도 열거합니다. &ldquo;to discover who it is that one wishes
          to deal with, to inform people that one wishes to deal and on what
          terms, to conduct negotiations leading up to a bargain, to draw up the
          contract, to undertake the inspection needed to make sure that the
          terms of the contract are being observed&rdquo;입니다. 그리고 결론은
          이렇습니다. &ldquo;In these conditions the initial delimitation of legal
          rights does have an effect on the efficiency with which the economic
          system operates.&rdquo; 흔히 이 글의 결론으로 소개되는 것은 앞쪽의
          전제이지만, 정작 이 글이 힘주어 말하는 것은 그 전제가 깨졌을 때 권리를
          어디에 두느냐가 결과를 바꾼다는 뒤쪽입니다. 이 글의 2편이 거래비용을
          상대를 찾고 재고 강제하는 값으로 정의한 것도 위 열거를 따른 것입니다.
        </CitationBlock>

        <AlgorithmBlock
          title="어느 길로 갈지 고르는 절차"
          input={[
            "빠진 몫을 숫자로 잴 수 있는지",
            "피해를 입는 쪽을 특정할 수 있는지",
            "협상에 드는 값과 막아서 생기는 이득",
          ]}
          steps={[
            {
              code: "if 상대를 특정할 수 없다: 협상 경로를 지운다",
              note: "매연을 마신 사람이 누구인지 모르면 권리를 줘도 쓸 사람이 없습니다. 다음 글의 주제가 여기서 갈립니다.",
            },
            {
              code: "if 협상 비용 < 막아서 생기는 이득: 권리만 정해 주고 맡긴다",
              note: "얼마인지를 맞힐 필요가 없어집니다. 양쪽이 자기 숫자를 알고 있고 그것이 협상에 그대로 들어갑니다.",
            },
            {
              code: "else: 권리를 협상이 열렸다면 갔을 쪽에 둔다",
              note: "협상으로 고칠 수 없으므로 처음 배치가 그대로 결과가 됩니다. 이 판단이 법의 영역입니다.",
            },
            {
              code: "if 빠진 몫을 잴 수 있다: 그만큼을 값에 얹는다",
              note: "상대를 특정하지 못해도 쓸 수 있는 길입니다. 다만 크기를 틀리면 다른 자리에서 멈춥니다.",
            },
            {
              code: "잰 값이 부풀려졌는지 확인할 방법을 함께 정한다",
              note: "피해액은 크게 부를수록 유리하므로 5편의 검증 문제가 그대로 돌아옵니다.",
            },
          ]}
          output="빠진 몫을 값에 얹는 길과 권리를 배치하는 길 가운데 이 상황에서 가능한 것"
        />

        <ProgressiveDetail
          title="값을 매겨 옮기게 할지 사게 할지는 법이 이미 다룬 문제입니다"
          preview="협상이 될 때와 안 될 때 보호 방식을 달리 하는 판단이 법 쪽에 정본으로 있습니다."
        >
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p className="leading-7">
              권리를 어디에 두고 어떻게 보호할지는 이 시리즈보다{" "}
              <Link to="/law/private-law/property-and-entitlement#two-protections">
                법 쪽 글
              </Link>
              이 먼저 다룬 문제입니다. 동의를 받아야 옮길 수 있게 할지, 값을
              매겨 옮긴 뒤 물어 주게 할지의 선택입니다.
            </p>

            <p className="leading-7">
              그 글의 기준이 이 절의 결론과 같습니다. 협상 비용이 옮겨서 느는
              값보다 작으면 동의를 요구하는 편이 낫고, 협상 비용이 더 크면 값을
              매겨 옮기는 길이 대안이 됩니다.
            </p>

            <p className="leading-7">
              사고처럼 미리 협상할 상대를 특정할 수 없는 경우는{" "}
              <Link to="/law/private-law/tort-and-accident-cost#how-much-care">
                사고의 비용
              </Link>
              이 맡습니다. 거기서 쓰는 한 단계 비교가 이 글의 한 단위 판정과
              같은 식입니다.
            </p>

            <p className="leading-7">
              두 시리즈가 같은 자리에서 만나는 것이 우연은 아닙니다. 위 인용문이
              법학 학술지에 실린 글이고, 문제를 어느 쪽 손해가 더 큰지로 다시
              세운 것이 그 글의 출발점이었습니다.
            </p>
          </div>
        </ProgressiveDetail>
      </section>

      <section id="boundary" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          상대를 특정할 수 없으면 두 길이 다 막힙니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            네 부품을 합치면 이렇습니다. 장부에 안 적히는 값이 있으면 두 비용이
            갈라지고, 갈라진 만큼 더 만들어지며, 빠진 몫을 값에 얹거나 권리를
            정해 협상시키면 되돌릴 수 있습니다.
          </p>

          <p className="leading-7">
            두 길 모두 조건이 붙습니다. 앞의 길은 빠진 몫이 얼마인지 알아야
            하고, 뒤의 길은 상대를 특정할 수 있고 협상에 드는 값이 이득보다
            작아야 합니다.
          </p>

          <p className="leading-7">
            그런데 이 둘이 동시에 막히는 경우가 있습니다. 누가 얼마나 피해를
            입었는지도 모르고, 이득을 보는 사람을 빼놓을 수도 없는 것들입니다.
            깨끗한 공기나 등대나 기초 연구 같은 것입니다.
          </p>

          <p className="leading-7">
            거기서는 값이 잘못 말하는 정도가 아니라 값이 아예 붙지 않습니다.
            다음 글이 그 경우입니다. 모두가 원하는데 아무도 만들지 않는 일이
            어떻게 생기는지를 봅니다.
          </p>

          <p className="leading-7">
            다루지 않은 것을 밝혀 둡니다. 피해가 단위마다 같다고 두었고, 피해를
            입는 쪽이 창문을 닫거나 옮기는 식으로 대응하는 경우도 넣지
            않았습니다. 걷은 돈을 누구에게 줄지도 이 글의 범위 밖이며, 그것은{" "}
            <Link to="/economics/prices/surplus-and-efficiency#not-fairness">
              4편에서 이 자가 재지 않는다고 한 것
            </Link>
            과 같은 종류의 판단입니다.
          </p>
        </div>
      </section>
    </div>
  );
}

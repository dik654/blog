import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import ThriftParadoxViz from "./aggregation-and-composition/viz/ThriftParadoxViz";
import MultiplierLeakViz from "./aggregation-and-composition/viz/MultiplierLeakViz";

/**
 * 한 사람에게 맞는 답이 모두에게 맞지는 않습니다
 *
 * 경제 시리즈 9편이자 마지막. 앞 여덟 편은 전부 한 시장 안의 결정이었고
 * 한 사람의 소득이 자기 결정에 따라 움직이지 않는다는 전제가 깔려 있었다.
 * 여기서 그 전제를 풀고, 모두의 결정을 동시에 합칠 때 무엇이 뒤집히는지를
 * 본다. 통화·금리·물가는 다루지 않고 되먹임의 구조와 총량의 한계만 다룬다.
 */
export default function AggregationAndCompositionArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          앞의 여덟 편은 전부 한 사람의 자리에서 본 것입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            지금까지 한 계산에는 공통점이 하나 있습니다. 한 사람이 덜 사기로
            하면 그 시장의 값이 조금 움직였을 뿐,{" "}
            <strong>그 사람의 소득은 그대로였습니다.</strong>
          </p>

          <p className="leading-7">
            빵을 덜 사도 내 월급은 그대로입니다. 한 사람의 결정이 자기 소득을
            바꿀 만큼 크지 않기 때문인데, 이것은 사실입니다.
          </p>

          <p className="leading-7">
            그런데 모두가 동시에 덜 사면 어떻게 됩니까. 내가 쓰지 않은 만큼은
            누군가가 받지 못한 만큼입니다. 그 사람의 소득이 줄고, 그러면 그
            사람도 덜 씁니다.
          </p>
        </div>

        <ThriftParadoxViz />

        <ContentBoundary article="aggregation-and-composition" />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            이 글이 푸는 질문은 하나입니다.{" "}
            <strong>
              한 사람에게 옳은 판단을 모두가 동시에 하면 왜 결과가 뒤집히고,
              합친 숫자로는 무엇을 볼 수 없는가
            </strong>
            입니다.
          </p>

          <p className="leading-7">
            순서는 이렇습니다. 먼저 한 사람의 지출이 다른 사람의 소득이라는
            관계를 세우고, 그것 때문에 다 같이 아끼면 아껴지지 않는다는 것을
            셉니다. 그다음 한 번의 지출이 몇 바퀴를 도는지와 그 크기를 정하는
            것을 보고, 마지막으로 합친 숫자가 무엇을 지우는지를 봅니다.
          </p>

          <p className="leading-7">
            돈과 이자율은 다루지 않습니다. 이 글의 계산은 값과 이자율이 움직이지
            않는다고 두고 되먹임의 구조만 본 것이며, 그 둘이 움직이면 숫자가
            달라진다는 점은 마지막 절에서 밝혀 둡니다.
          </p>
        </div>
      </section>

      <section id="spending-is-income" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 1. 한 사람의 지출이 다른 사람의 소득입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            당연해 보이는 문장이지만 앞의 여덟 편은 이것을 쓰지 않았습니다. 한
            시장만 볼 때는 그 시장 밖의 소득이 어디서 오는지 물을 필요가 없었기
            때문입니다.
          </p>

          <p className="leading-7">
            전부 합치면 물어야 합니다. 누군가가 받는 모든 돈은 누군가가 쓴
            돈이고, 그 반대도 마찬가지입니다.{" "}
            <strong>둘은 같은 것을 양쪽에서 부른 이름입니다.</strong>
          </p>

          <p className="leading-7">
            여기서 한 가지가 따라 나옵니다. 한 해 동안 번 것 가운데 쓰이지 않은
            것이 있으면 그것은 어딘가에 남아 있어야 합니다. 갈 곳은 새로 만드는
            것, 그러니까 투자뿐입니다.
          </p>

          <p className="leading-7">
            숫자로 두겠습니다. 한 해 도는 소득이 250이고 그중 220이 다시
            쓰이면 남는 것이 30입니다. 그 30이 투자로 쓰이는 30과 같습니다.
          </p>

          <p className="leading-7">
            이것은 우연이 아니라 정의상 그렇습니다. 그런데 한 사람에게는 전혀
            그렇지 않습니다. 내가 얼마를 남기느냐와 내가 얼마를 새로 만드느냐
            사이에는 아무 관계도 없습니다.
          </p>

          <p className="leading-7">
            여기가 이 글 전체가 서 있는 자리입니다.{" "}
            <strong>한 사람에게 참인 것과 전부에게 동시에 참인 것이
            다릅니다.</strong>
          </p>
        </div>

        <CitationBlock
          source="John Maynard Keynes, The General Theory of Employment, Interest and Money (1936), 프랑스어판 서문"
          citeKey={1}
          href="https://gutenberg.net.au/ebooks03/0300071h/printall.html"
        >
          이 책이 무엇을 고치려는 책인지를 한 문장으로 적어 둔 대목입니다.
          &ldquo;I argue that important mistakes have been made through extending
          to the system as a whole conclusions which have been correctly arrived
          at in respect of a part of it taken in isolation.&rdquo; 그리고 왜
          그렇게 되는지를 이어서 적습니다. &ldquo;the demand arising out of the
          consumption and investment of one individual is the source of the
          incomes of other individuals, so that incomes in general are not
          independent, quite the contrary, of the disposition of individuals to
          spend and invest.&rdquo; 남기는 것과 새로 만드는 것이 전체로는 반드시
          같지만 한 사람에게는 아무 관계도 없다는 것도 같은 문단에 있습니다.
          호주 구텐베르크가 공개한 전문으로 이 대목과 아래 절들에서 인용한
          문장을 직접 대조했습니다.
        </CitationBlock>
      </section>

      <section id="thrift" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 2. 그래서 다 같이 아끼면 아껴지지 않습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            앞 절의 관계를 움직여 보겠습니다. 모두가 앞날이 걱정되어 10씩 덜
            쓰기로 합니다. 각자에게는 옳은 판단입니다. 덜 쓰면 더 남으니까요.
          </p>

          <p className="leading-7">
            소득이 1 늘 때 0.8을 다시 쓴다고 두겠습니다. 그러면 첫 바퀴에 10이
            빠지고, 그만큼 소득이 준 사람이 다음 바퀴에 8을 덜 씁니다. 그다음이
            6.4, 그다음이 5.12입니다.
          </p>

          <p className="leading-7">
            다 더하면 50입니다. <strong>소득이 250에서 200으로
            줄어듭니다.</strong> 처음에 줄이기로 한 것은 10뿐이었습니다.
          </p>

          <p className="leading-7">
            이제 남는 것을 세어 보겠습니다. 소득 200 가운데 170이 다시 쓰이므로
            남는 것이 30입니다. <strong>아끼기 전과 똑같습니다.</strong>
          </p>

          <p className="leading-7">
            이유는 앞 절에 있습니다. 전체로 남는 것은 투자와 같아야 하는데,
            투자는 이 계산에서 30으로 고정되어 있었습니다. 그러니 남는 것이
            달라질 방법이 없습니다.
          </p>

          <p className="leading-7">
            비율로는 올랐습니다. 30을 250으로 나누면 12퍼센트이고 30을 200으로
            나누면 15퍼센트입니다. 더 아끼기는 했는데 더 남지는 않았습니다.
          </p>

          <p className="leading-7">
            그래서 결과가 이렇습니다. 모두가 더 아끼려고 한 끝에 소득만 50이
            줄고 남는 것은 그대로입니다. 각자의 판단은 하나도 틀리지
            않았습니다.
          </p>
        </div>

        <ExplainedFormula
          question="다 같이 아끼면 왜 남는 것이 늘지 않습니까?"
          idea="남는 것은 소득에서 다시 쓰이는 것을 뺀 나머지인데, 그 소득 자체가 다시 쓰이는 것에 따라 정해집니다. 덜 쓰기로 하면 분모인 소득도 같이 줄어드는데, 두 줄어듦이 정확히 상쇄되어 남는 것은 투자와 같은 자리에 그대로 머뭅니다."
          formula={String.raw`Y = cY + a + I \;\Rightarrow\; Y = \frac{a+I}{1-c}, \qquad S = Y - (cY + a) = I`}
          annotatedFormula={String.raw`\underbrace{Y = \frac{a+I}{1-c}}_{\text{소득이 정해지는 자리}}, \qquad \underbrace{S = (1-c)Y - a = I}_{\text{남는 것은 투자와 같다}}`}
          operations={[
            {
              expression: String.raw`Y = cY + a + I`,
              annotation: [
                "소득이 다시 쓰이는 것과 새로 만드는 것의 합과 같아야 한다는 관계이며, 오른쪽에 Y가 다시 들어 있는 것이 이 절의 전부입니다.",
                "앞 여덟 편에는 이 되먹임이 없었습니다. 한 시장만 볼 때는 그 시장 밖의 소득을 주어진 것으로 두어도 되기 때문입니다.",
              ],
            },
            {
              expression: String.raw`Y = \frac{a+I}{1-c}`,
              annotation: [
                "되먹임을 풀어 소득을 구한 것이며, 분모가 다시 쓰이지 않고 빠지는 몫입니다.",
                "a를 10 줄이면 Y가 그 몫으로 나눈 만큼 줄어듭니다. c가 0.8이면 분모가 0.2라 50이 줄어듭니다.",
              ],
            },
            {
              expression: String.raw`S = (1-c)Y - a = I`,
              annotation: [
                "남는 것을 소득에서 다시 쓰이는 것을 빼어 구한 뒤 위의 Y를 넣은 결과입니다.",
                "a가 식에서 사라집니다. 얼마나 아끼기로 하든 남는 금액은 투자와 같은 자리에 머물고, 달라지는 것은 그 자리에 닿는 소득의 크기입니다.",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`c`,
              name: "소득이 1 늘 때 다시 쓰는 몫",
              description:
                "예에서는 0.8입니다. 0과 1 사이의 값이며 1에 가까울수록 되먹임이 세집니다.",
            },
            {
              symbol: String.raw`a`,
              name: "소득과 무관하게 쓰는 몫",
              description:
                "아끼기로 하는 결정이 바꾸는 것이 이 값입니다. 예에서는 20에서 10으로 줄였습니다.",
            },
            {
              symbol: String.raw`I`,
              name: "새로 만드는 데 쓰는 것",
              description:
                "이 계산에서는 소득과 무관하게 30으로 고정해 두었고, 그 전제가 결론을 떠받칩니다.",
            },
          ]}
          assumptions={[
            "투자가 소득과 무관하게 정해진다고 둡니다. 실제로는 소득이 줄면 투자도 줄어 결과가 더 나빠지고, 이자율이 내려 투자가 늘면 덜 나빠집니다.",
            "값이 움직이지 않는다고 둡니다. 값이 내려가면 같은 돈으로 더 살 수 있어 일부가 되돌아옵니다.",
            "모두의 다시 쓰는 몫이 같다고 둡니다. 사람마다 다르면 누가 아끼느냐에 따라 크기가 달라지고, 그 이야기가 마지막 절입니다.",
          ]}
          interpretation="소득이 1 늘 때 0.8을 다시 쓰고 소득과 무관하게 쓰는 몫이 20, 새로 만드는 데 쓰는 것이 30이라고 하겠습니다. 소득은 50을 0.2로 나눈 250이고 남는 것은 30입니다. 모두가 10씩 덜 쓰기로 해 그 몫이 10이 되면 소득은 40을 0.2로 나눈 200이 되고 남는 것은 여전히 30입니다. 여기서 읽어야 할 것은 각자의 판단이 틀리지 않았다는 점입니다. 한 사람만 덜 썼다면 그 사람은 정말로 더 남겼을 것이고, 뒤집힌 이유는 모두가 동시에 했기 때문입니다. 읽으면 안 되는 것은 아끼는 것이 나쁘다는 결론입니다. 이 계산은 새로 만드는 데 쓰는 것이 소득과 무관하게 30으로 묶여 있을 때의 이야기이고, 아낀 것이 실제로 새로 만드는 데 쓰인다면 그 30이 늘어 결론이 달라집니다."
        />

        <CitationBlock
          source="John Maynard Keynes, The General Theory (1936), 제7장"
          citeKey={2}
          href="https://gutenberg.net.au/ebooks03/0300071h/printall.html"
        >
          이 절의 결론이 한 문장으로 적혀 있습니다. &ldquo;Every such attempt to
          save more by reducing consumption will so affect incomes that the
          attempt necessarily defeats itself.&rdquo; 그 앞에 이유가 있습니다.
          &ldquo;although the amount of his own saving is unlikely to have any
          significant influence on his own income, the reactions of the amount
          of his consumption on the incomes of others makes it impossible for
          all individuals simultaneously to save any given sums.&rdquo; 반대
          방향도 같은 문단에서 짚습니다. 전체가 투자보다 덜 남기려 해도
          소득이 올라 결국 투자와 같은 금액에 닿는다고 적습니다. 다만 이 글이
          쓴 숫자와 계수는 책의 것이 아니라 같은 관계를 풀어 계산한 것입니다.
        </CitationBlock>
      </section>

      <section id="multiplier" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 3. 한 번의 지출이 몇 바퀴를 돌지는 도는 비율이 정합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            앞 절에서 10이 50이 되었습니다. 그 5배가 어디서 나왔는지를 따로
            보겠습니다. 방향은 반대여도 셈은 같습니다.
          </p>

          <p className="leading-7">
            10을 새로 쓰면 누군가의 소득이 10 늘고 그 사람이 8을 씁니다. 그러면
            또 누군가의 소득이 8 늘고 6.4를 씁니다. 6.4, 5.12, 4.1이
            이어집니다.
          </p>

          <p className="leading-7">
            한 바퀴마다 0.8씩 작아지므로 합이 무한히 커지지는 않습니다. 10을
            0.2로 나눈 50에서 멈춥니다.{" "}
            <strong>분모는 다시 쓰이지 않고 빠지는 몫입니다.</strong>
          </p>

          <p className="leading-7">
            그래서 이 크기를 정하는 것은 도는 비율입니다. 절반만 다시 쓰면 2배,
            0.8이면 5배, 0.9면 10배입니다. 1에 가까워질수록 가파르게 커집니다.
          </p>

          <p className="leading-7">
            그런데 다시 쓰는 것이 전부 안에서 돌지는 않습니다. 쓰는 것 가운데
            일부는 밖에서 만든 물건입니다. 그 몫은 여기서 도는 대신 빠져
            나갑니다.
          </p>

          <p className="leading-7">
            쓰는 것의 20퍼센트가 밖에서 만든 물건이라면 안에서 도는 몫이 0.8
            곱하기 0.8인 0.64가 됩니다. 크기가 5배에서 2.8배로 내려갑니다.
          </p>

          <p className="leading-7">
            <strong>같은 10이 50이 되기도 하고 28이 되기도 합니다.</strong>{" "}
            어디로 얼마나 새는지를 모르면 이 숫자를 낼 수 없고, 그것은 합친
            숫자 하나만 봐서는 알 수 없는 것입니다.
          </p>
        </div>

        <MultiplierLeakViz />

        <CitationBlock
          source="John Maynard Keynes, The General Theory (1936), 제10장"
          citeKey={3}
          href="https://gutenberg.net.au/ebooks03/0300071h/printall.html"
        >
          이 크기에 이름을 붙인 대목입니다. &ldquo;we can write ΔY&#8342; = k
          ΔI&#8342;, where 1 − 1/k is equal to the marginal propensity to
          consume. Let us call k the investment multiplier.&rdquo; 1에서 1/k을
          뺀 것이 다시 쓰는 몫이라는 말은 k가 안 도는 몫의 역수라는 뜻이고, 이
          절의 계산이 그것입니다. 새는 곳도 같은 장에 있습니다. 밖과 거래하는
          경제에서는 늘어난 소비의 일부가 밖의 고용으로 가므로 &ldquo;we must
          diminish the full figure of the multiplier&rdquo;라고 적고, 그 부분을
          &ldquo;leakage&rdquo;라 부릅니다. 이 절의 숫자도 책의 것과 겹칩니다.
          다시 쓰는 몫을 80퍼센트로 잡으면 크기가 5쯤이고, 밖과의 거래가 소비의
          20퍼센트를 차지하면 2나 3까지 내려간다고 적혀 있습니다. 다만 책이
          2나 3을 말할 때는 실업 급여라는 두 번째 새는 자리를 함께 넣은
          것이고, 이 절의 2.8은 밖과의 거래 하나만 넣어 다시 계산한 값입니다.
        </CitationBlock>

        <TermBreakdown
          title="새는 자리는 한 곳이 아닙니다"
          description="다시 쓰이지 않고 빠지는 몫은 여러 곳에서 동시에 생기고, 분모는 그 합입니다."
          items={[
            {
              term: "남기는 몫",
              description:
                "받은 것 가운데 쓰지 않고 두는 부분이며 이 계산의 기본 분모입니다.",
              example:
                "0.8을 다시 쓰면 0.2가 여기서 빠져 크기가 5배가 됩니다.",
              boundary:
                "빠진다고 해서 없어지는 것은 아닙니다. 그 돈이 새로 만드는 데 쓰이면 다른 경로로 돌아오고, 앞 절의 계산은 그 경로를 막아 둔 것입니다.",
            },
            {
              term: "밖에서 만든 물건을 사는 몫",
              description:
                "여기서 도는 대신 밖의 소득이 되므로 안에서는 사라집니다.",
              example:
                "쓰는 것의 20퍼센트가 그렇다면 안에서 도는 몫이 0.64가 되어 크기가 2.8배로 내려갑니다.",
              boundary:
                "밖의 소득이 올라 그쪽에서 이쪽 물건을 더 사면 일부가 돌아옵니다. 그래서 세계 전체로 보면 새는 자리가 아닙니다.",
            },
            {
              term: "걷히는 몫",
              description:
                "세금으로 걷히는 만큼은 그 바퀴에서 빠지고, 걷힌 것이 다시 쓰이는지는 별개의 결정입니다.",
              example:
                "걷힌 것을 그대로 다시 쓰면 빠지지 않은 것과 같아지고, 쌓아 두면 그대로 빠집니다.",
              boundary:
                "그래서 세율만으로는 크기를 알 수 없습니다. 걷은 쪽이 무엇을 하는지까지 봐야 합니다.",
            },
          ]}
        />
      </section>

      <section id="aggregates-hide" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 4. 합친 숫자는 그 숫자를 정한 것을 지웁니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            앞 세 절은 모두의 소득을 하나의 숫자로 다뤘습니다. 편리하지만 대가가
            있습니다. 같은 총액이 전혀 다른 모양에서 나올 수 있습니다.
          </p>

          <p className="leading-7">
            다섯 사람을 두겠습니다. 한쪽은 20씩 고르게 받고, 다른 쪽은 60, 20,
            10, 5, 5로 받습니다. 총액은 둘 다 100이고 평균도 둘 다 20입니다.
          </p>

          <p className="leading-7">
            가운데 사람은 다릅니다. 앞쪽은 20이고 뒤쪽은 10입니다.{" "}
            <strong>평균이 같은데 절반입니다.</strong>
          </p>

          <p className="leading-7">
            이것이 공평의 문제만은 아닙니다. 앞 세 절의 숫자 자체가 달라지기
            때문입니다. 소득이 낮을수록 받은 것을 더 많이 쓴다는 것을 넣어
            보겠습니다.
          </p>

          <p className="leading-7">
            10까지는 다 쓰고 그 위로는 절반만 쓴다고 하면, 고른 쪽은 각자 15씩
            써서 75입니다. 치우친 쪽은 35, 15, 10, 5, 5를 더해 70입니다.
          </p>

          <p className="leading-7">
            같은 100인데 다시 쓰이는 것이 75와 70으로 다릅니다. 그러면 앞 절의
            도는 비율이 달라지고, 크기도 달라집니다.
          </p>

          <p className="leading-7">
            여기서 이 시리즈의 마지막 문장이 나옵니다.{" "}
            <strong>합친 숫자가 얼마가 될지를 정하는 것은 합치면서 지워진
            쪽입니다.</strong>
          </p>
        </div>

        <AlgorithmBlock
          title="합친 숫자를 읽을 때 되묻는 절차"
          input={[
            "총액과 평균",
            "그 총액이 어떻게 나뉘어 있는지",
            "구간마다 다시 쓰는 몫이 어떻게 다른지",
          ]}
          steps={[
            {
              code: "총액과 가운데 사람을 따로 본다",
              note: "평균이 같아도 가운데가 절반일 수 있습니다. 예에서는 20과 10으로 갈립니다.",
            },
            {
              code: "구간마다 다시 쓰는 몫을 매겨 총액을 다시 계산한다",
              note: "10까지 다 쓰고 그 위로 절반만 쓰면 고른 쪽이 75, 치우친 쪽이 70입니다. 같은 총액에서 다른 숫자가 나옵니다.",
            },
            {
              code: "그 숫자로 불어나는 크기를 다시 구한다",
              note: "도는 비율이 달라지면 분모가 달라지므로 같은 충격에서 다른 결과가 나옵니다.",
            },
            {
              code: "충격이 누구에게 닿는지를 함께 본다",
              note: "같은 금액이라도 다 쓰는 쪽에 닿으면 크게 돌고 남기는 쪽에 닿으면 덜 돕니다.",
            },
            {
              code: "총액 하나로 답할 수 없는 물음이면 거기서 멈춘다",
              note: "합친 숫자가 지운 것이 답을 정하는 경우에는 그 숫자만으로 결론을 내지 않는 편이 낫습니다.",
            },
          ]}
          output="이 총액으로 답할 수 있는 물음과 분포를 봐야만 답할 수 있는 물음의 구분"
        />

        <ProgressiveDetail
          title="합쳐 놓은 숫자로 결정하는 일 자체가 별도의 문제입니다"
          preview="여럿의 뜻을 하나로 모으는 절차가 왜 깔끔하게 되지 않는지는 정치 쪽 글이 다룹니다."
        >
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p className="leading-7">
              이 절이 말한 것은 여럿의 숫자를 더하면 정보가 사라진다는 것입니다.
              그런데 숫자가 아니라 여럿의 뜻을 하나로 모을 때도 비슷한 일이
              생기고, 그쪽은{" "}
              <Link to="/politics/elections/voting-paradoxes">
                투표를 다룬 글
              </Link>
              이 다룹니다.
            </p>

            <p className="leading-7">
              다른 점도 분명합니다. 여기서는 더하는 일 자체는 잘 정의되어
              있고 더한 뒤에 무엇이 안 보이느냐가 문제입니다. 그쪽에서는 더하는
              방법 자체가 여럿이고 어느 것을 쓰느냐에 따라 답이 달라집니다.
            </p>

            <p className="leading-7">
              앞 글에서 본 것도 같이 놓을 만합니다.{" "}
              <Link to="/economics/market-failure/public-goods-and-commons#revelation">
                각자의 값을 물어서 모으는 문제
              </Link>
              는 더하기 전에 숫자를 얻는 단계에서 막히는 경우였습니다. 이 절은
              숫자를 정확히 얻었다고 해도 더하는 순간 잃는 것이 있다는
              이야기입니다.
            </p>
          </div>
        </ProgressiveDetail>
      </section>

      <section id="boundary" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          이 글의 계산은 값과 이자율을 세워 둔 채로 한 것입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            앞 절들의 숫자는 전부 한 가지 전제 위에 있습니다. 값도 이자율도
            움직이지 않는다는 것입니다. 둘 다 실제로는 움직입니다.
          </p>

          <p className="leading-7">
            값이 내려가면 같은 돈으로 더 살 수 있어 줄어든 소득의 일부가
            되돌아옵니다. 이자율이 내려가면 새로 만드는 데 쓰는 것이 늘어 30이
            고정이라는 전제가 풀립니다.
          </p>

          <p className="leading-7">
            반대 방향도 있습니다. 소득이 줄면 새로 만들 이유도 줄어 30이 오히려
            작아질 수 있습니다. 그러면 이 글의 계산보다 나빠집니다.
          </p>

          <p className="leading-7">
            어느 쪽이 얼마나 센지는 이 글이 답하지 않습니다. 그것을 재는 일은
            돈과 이자율과 물가를 같이 다뤄야 하고, 이 시리즈의 범위 밖입니다.
          </p>

          <p className="leading-7">
            그리고 여기서 아끼는 것이 나쁘다는 결론을 끌어내면 안 됩니다. 아낀
            것이 실제로 새로 만드는 데 쓰이면 이 절의 30이 늘어 결과가
            달라집니다. 이 글이 보인 것은 그 경로가 막혀 있을 때 무슨 일이
            생기는지입니다.
          </p>

          <p className="leading-7">
            여기까지가 아홉 편입니다. 무엇이 부족한지에서 시작해 값이 그것을
            어떻게 전달하는지를 보고, 값이 놓치는 것들을 세 가지로 나눠 본 뒤,
            전부 합치면 앞의 이야기가 어디서 뒤집히는지로 닫았습니다.
          </p>

          <p className="leading-7">
            한 줄로 남길 것이 있다면 이것입니다. 각자에게 옳은 판단이 모두에게
            동시에 옳지는 않고, 그 차이를 만드는 것은 사람의 잘못이 아니라
            결정들이 서로를 통과하는 방식입니다.
          </p>
        </div>
      </section>
    </div>
  );
}

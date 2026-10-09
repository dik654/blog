import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import FourNumbersViz from "./what-ricardo-assumed/viz/FourNumbersViz";
import CapitalMovesViz from "./what-ricardo-assumed/viz/CapitalMovesViz";

/**
 * 리카도의 논증은 자본이 국경을 넘지 않는다는 전제 위에 있습니다
 *
 * 경제 2단계 9편, 거시 4편. 1단계가 비교우위의 메커니즘을 소유하므로 이
 * 글은 그것을 다시 설명하지 않는다. 이 글이 소유하는 것은 그 논증이 서
 * 있는 전제와, 전제가 풀렸을 때 저자 자신이 적어 둔 다른 결론이다.
 * 원자료는 Ricardo(1817) 초판 6장 「On Foreign Trade」(3판 1821년 기준 7장)이며 Project Gutenberg 전사본으로 읽었다.
 * facsimile이 아니라는 점을 인용 블록에 밝힌다.
 */
export default function WhatRicardoAssumedArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          포르투갈이 둘 다 더 잘 만드는데도 교역이 일어납니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            옷감 한 몫을 만드는 데 영국은 100명이 한 해 일해야 하고 포르투갈은
            90명이면 됩니다. 포도주 한 몫은 영국이 120명, 포르투갈이 80명입니다.
            포르투갈이 둘 다 적게 듭니다. 그런데도 포르투갈은 포도주를 보내고
            옷감을 받아 옵니다.
          </p>

          <p className="leading-7">
            왜 이런 교환이 양쪽에 이득인지는 1단계에서 이미 봤습니다. 이 글이 읽는 자리는 그다음 문장입니다. 저자는 바로 이어서 같은 교환이{" "}
            <strong>한 나라 안에서는 일어나지 않는다</strong>고 적습니다. 영국인
            100명의 일한 몫을 영국인 80명의 일한 몫과 바꿀 수는 없습니다.
          </p>

          <p className="leading-7">
            <strong>
              같은 비율이 나라 사이에서는 성립하고 한 나라 안에서는 성립하지
              않는다면, 그 차이를 만드는 것이 무엇입니까.
            </strong>{" "}
            저자는 그 자리에 답을 적어 두었습니다. 그 답이 이 논증 전체가 서 있는 전제입니다.
          </p>
        </div>

        <FourNumbersViz />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            네 부품입니다. 안과 밖이 어떻게 다른지, 그 차이를 만드는 전제가 무엇인지, 전제가 풀리면 저자 자신이 어떤 결론을
            적었는지, 그가 그 전제를 무엇으로 떠받쳤는지입니다.
          </p>

          <p className="leading-7">
            <em>
              여기까지만 읽어도 이 글의 자리는 잡힙니다 — 결론이 아니라 전제를
              읽습니다.
            </em>
          </p>
        </div>
      </section>

      <section id="inside-vs-outside" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 1. 같은 교환이 한 나라 안에서는 일어나지 않습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            먼저 무엇이 같은지 봅니다. 영국은 옷감을 내주고 포도주를 받습니다. 내준 쪽에는 100명이 한 해 일한 몫이 들어
            있고 받은 쪽에는 80명이 한 해 일한 몫이 들어 있습니다. 숫자만 보면 손해 같지만 영국이 스스로 포도주를 만들었다면
            120명이 들었을 테니 이득입니다.
          </p>

          <p className="leading-7">
            이제 같은 구도를 한 나라 안에 두어 봅니다. 요크셔 사람 100명이 한 해
            일한 몫을 런던 사람 80명이 한 해 일한 몫과 바꾸는 일이 계속 일어날
            수 있습니까. 저자는 아니라고 적습니다. 그런 교환은{" "}
            <strong>같은 나라의 개인들 사이에서는 성립할 수 없다</strong>는
            것입니다.
          </p>

          <p className="leading-7">
            이유는 간단합니다. 안에서는 돈과 사람이 더 벌리는 쪽으로 옮겨 갑니다. 런던 쪽이 더 남는다면 요크셔의 자본이
            런던으로 옮겨 갑니다. 그 움직임이 차이를 지웁니다. 차이가 지워지면 100 대 80 같은 비율도 남지 않습니다.
          </p>
        </div>

        <CitationBlock
          source="David Ricardo, 『On the Principles of Political Economy, and Taxation』 (London: John Murray, 1817) 초판, 6장 「On Foreign Trade」(3판 기준 7장)"
          citeKey={1}
          href="https://www.gutenberg.org/ebooks/33310"
        >
          네 숫자가 그대로 있습니다 — 영국은 옷감에 “the labour of 100 men for
          one year”, 포도주에 “the labour of 120 men”, 포르투갈은 포도주에 “the
          labour of eighty men”, 옷감에 “the labour of ninety men”입니다. 안과
          밖의 구분은 이어지는 문장입니다 — “Such an exchange could not take
          place between the individuals of the same country. The labour of 100
          Englishmen cannot be given for that of 80 Englishmen, but the produce
          of the labour of 100 Englishmen may be given for the produce of the
          labour of 80 Portuguese.” Project Gutenberg의 1817년 초판 전사본(eBook
          33310)을 내려받아 이 장 전체를 읽었습니다. 초판은 「On Profits」를 두 번째 V장(V*)으로 매겨서 외국무역이 VI장이고, 흔히 인용되는 7장은 3판(1821)의 번호입니다. 이 글의 다른 원자료들과
          달리 <strong>facsimile이 아니라 전사본</strong>이어서 쪽 이미지로
          대조하지 못했고, 그래서 쪽수를 적지 않고 장 번호까지만 적습니다.
        </CitationBlock>

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            <em>
              안과 밖이 어떻게 다른지는 이 절에서 끝났습니다. 그 차이의 출처가
              다음 부품입니다.
            </em>
          </p>
        </div>
      </section>

      <section id="the-assumption" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 2. 차이를 만드는 것은 자본이 국경을 넘기 어렵다는 것입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            저자는 안과 밖의 차이를 한 문장으로 설명합니다. 자본이 더 이익이 되는
            곳을 찾아 한 나라에서 다른 나라로 옮겨 가기는{" "}
            <strong>어렵고</strong>{" "}
            같은 나라의 한 지방에서 다른 지방으로 옮겨
            가기는 <strong>활발하다</strong>는 것입니다.
          </p>
        </div>

        <TermBreakdown
          title="같은 움직임, 두 가지 속도"
          description="자본이 얼마나 쉽게 옮겨 가느냐가 두 경우를 가릅니다."
          items={[
            {
              term: "한 나라 안",
              description:
                "자본이 지방 사이를 활발히 오갑니다. 더 남는 쪽으로 곧 옮겨 갑니다.",
              example:
                "런던 쪽이 더 남으면 요크셔의 자본이 런던으로 갑니다. 그 움직임이 수익 차이를 지웁니다.",
              boundary:
                "차이가 지워지므로 100명분을 80명분과 바꾸는 비율이 남지 않습니다.",
            },
            {
              term: "나라와 나라 사이",
              description:
                "자본이 쉽게 넘어가지 않습니다. 그래서 수익 차이가 남은 채로 지속됩니다.",
              example:
                "포르투갈이 옷감을 더 싸게 만들 수 있어도 영국 자본이 그리로 가지 않습니다.",
              boundary:
                "이 어려움이 없어지면 다음 부품의 결론으로 넘어갑니다. 전제이지 법칙이 아닙니다.",
            },
          ]}
        />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            여기서 한 가지를 분명히 해야 합니다. 비판자가 뒤에 찾아낸 약점이 아니라 <strong>저자가 같은 장에 직접 적어
            둔 전제</strong>입니다. 그는 이 전제를 숨기지 않았습니다. 오히려 그것이 안과 밖을 가르는 이유라고
            명시했습니다. 이 글은 그 자리를 다시 읽을 뿐입니다.
          </p>

          <p className="leading-7">
            앞 글들에서 쓴 말로 옮기면 이렇게 됩니다. 자본이 국경을 넘는 데에는{" "}
            <Link to="/economics/firms/why-firms-exist">
              값으로 조정하는 일 자체에 드는 값
            </Link>
            이 크게 붙습니다. 상대를 찾고 조건을 따지고 약속을 강제하는 일이
            국경을 넘으면 훨씬 비싸집니다. 그 값이 충분히 크면 자본이 움직이지 않습니다. 움직이지 않으면 수익 차이가 남습니다.
          </p>

          <p className="leading-7">
            <em>
              이 절에서 전제의 내용은 잡혔습니다. 그 전제가 풀리면 어떻게 되는지가
              다음 부품입니다.
            </em>
          </p>
        </div>
      </section>

      <section id="if-it-moves" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 3. 전제가 풀리면 저자 자신이 다른 결론을 적습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            이 장에서 가장 눈여겨볼 대목은 저자가 반대 경우를 직접 따져 보는 자리입니다. 자본이 옮겨 갈 수 있다면 어떻게
            되는가를 묻고 그 답을 적습니다.
          </p>
        </div>

        <CapitalMovesViz />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            답은 두 가지입니다. 첫째, 포도주와 옷감이 <strong>둘 다 포르투갈에서</strong> 만들어지는 편이 영국
            자본가에게도 두 나라 소비자에게도 이롭다고 적습니다. 영국에서 옷감을 만들던 자본과 노동이 그리로 옮겨 갑니다.
          </p>

          <p className="leading-7">
            둘째, 그렇게 되면 두 나라 사이의 구분이 사라진다고 적습니다. 자본이 가장 이익이 되는 곳으로 자유롭게 흐르면
            이윤율에 차이가 없어집니다. 물건 값의 차이로 남는 것은 시장까지 옮기는 데 더 드는 품뿐입니다. 하나는 요크셔에서,
            다른 하나는 런던에서 만들어진 것과 같아집니다.
          </p>
        </div>

        <ExplainedFormula
          question="자본이 움직일 때와 움직이지 않을 때 무엇이 달라집니까"
          idea={
            <>
              자본이 머무르면 각 나라가 자기 안에서 상대적으로 나은 쪽을 고르고,
              움직이면 모두가{" "}
              <strong>절대적으로 더 싼 곳 하나로 모입니다.</strong> 고르는
              기준이 나라 안의 비율에서 나라 사이의 절대 비교로 바뀝니다.
            </>
          }
          formula={String.raw`\frac{a_{\text{옷}}^{E}}{a_{\text{술}}^{E}} \;\neq\; \frac{a_{\text{옷}}^{P}}{a_{\text{술}}^{P}}`}
          annotatedFormula={String.raw`\underbrace{\frac{a_{\text{옷}}^{E}}{a_{\text{술}}^{E}}}_{\text{영국 안의 맞바꿈 비율}} \;\neq\; \underbrace{\frac{a_{\text{옷}}^{P}}{a_{\text{술}}^{P}}}_{\text{포르투갈 안의 맞바꿈 비율}}`}
          operations={[
            {
              expression: String.raw`\frac{a_{\text{옷}}^{E}}{a_{\text{술}}^{E}} = \frac{100}{120}`,
              annotation: [
                "영국 안에서 옷감 한 몫은 포도주 0.83몫",
                "나라 안의 비율이라 자본이 머물러도 성립합니다",
              ],
            },
            {
              expression: String.raw`\frac{a_{\text{옷}}^{P}}{a_{\text{술}}^{P}} = \frac{90}{80}`,
              annotation: [
                "포르투갈 안에서는 옷감 한 몫이 포도주 1.13몫",
                "두 비율이 다르다는 것이 교역의 조건입니다",
              ],
            },
            {
              expression: String.raw`a_{\text{옷}}^{P} < a_{\text{옷}}^{E},\quad a_{\text{술}}^{P} < a_{\text{술}}^{E}`,
              annotation: [
                "자본이 움직이면 이 절대 비교가 기준이 됩니다",
                "둘 다 작은 쪽으로 모입니다",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`a_{\text{옷}}^{E}`,
              name: "영국에서 옷감 한 몫에 드는 사람 수",
              description: "이 장의 네 숫자 가운데 100입니다.",
            },
            {
              symbol: String.raw`a_{\text{술}}^{P}`,
              name: "포르투갈에서 포도주 한 몫에 드는 사람 수",
              description: "80입니다. 나머지 둘은 120과 90입니다.",
            },
          ]}
          interpretation="교역의 이득은 두 나라 안의 비율이 서로 다르다는 데서 나오고, 자본이 모이는 쪽은 절대 크기가 작다는 데서 나옵니다. 어느 쪽이 작동하는지는 자본이 움직일 수 있느냐가 정합니다."
          assumptions={[
            "비율 표기는 이 글이 네 숫자를 정리한 것이고 원문에 이 꼴로 있지 않습니다.",
            "한 몫이 두 나라에서 같은 양을 뜻한다고 둡니다. 품질이 다르면 같은 자로 잴 수 없습니다.",
            "노동만으로 값을 재는 설정입니다. 저자의 다른 장들이 이 설정을 다루며, 이 글은 그 논의에 들어가지 않습니다.",
          ]}
        />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            <em>
              이쯤에서 끊어도 이 글의 핵심은 다 나왔습니다. 남은 것은 저자가 그
              전제를 무엇으로 떠받쳤는가입니다.
            </em>
          </p>
        </div>
      </section>

      <section id="what-he-leaned-on" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 4. 전제를 떠받친 것은 사람의 마음과 제도였습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            자본이 왜 국경을 넘지 않는지, 저자가 든 근거는 기술도 비용표도 아닙니다. 두 가지입니다. 하나는 자기 손이 닿지
            않는 곳에 재산을 두었을 때 느끼는 불안이고 다른 하나는 태어난 곳과 익힌 습관을 떠나 낯선 정부와 새 법에 자신을
            맡기기를 꺼리는 마음입니다.
          </p>

          <p className="leading-7">
            그는 그 마음이 약해지는 것을 보고 싶지 않다고 덧붙입니다. 이 문장이 중요합니다. 전제가 <strong>관찰된 사실로
            제시된 것이 아니라 지속되기를 바라는 상태로 제시되었다</strong>는 점이 여기서 드러납니다.
          </p>
        </div>

        <CitationBlock
          source="Ricardo (1817) 초판, 6장(3판 기준 7장)"
          citeKey={2}
          href="https://www.gutenberg.org/ebooks/33310"
        >
          안과 밖을 가르는 문장은 “by considering the difficulty with which
          capital moves from one country to another, to seek a more profitable
          employment, and the activity with which it invariably passes from one
          province to another in the same country”입니다. 반사실은 “It would
          undoubtedly be advantageous to the capitalists of England, and to the
          consumers in both countries, that under such circumstances, the wine
          and the cloth should both be made in Portugal”이고, 그 경우의 결론은
          “if capital freely flowed towards those countries where it could be
          most profitably employed, there could be no difference in the rate of
          profit, and no other difference in the real or labour price of commodities, than the additional quantity of labour required to convey them to the various markets”입니다. 전제를 떠받친 근거는 “the fancied or real insecurity of
          capital, when not under the immediate control of its owner, together
          with the natural disinclination which every man has to quit the
          country of his birth”이며, 바로 뒤에 “These feelings, which I should
          be sorry to see weakened”가 이어집니다. 모두 같은 장이며 Project
          Gutenberg 전사본으로 읽었습니다.
        </CitationBlock>

        <AlgorithmBlock
          title="결론이 아니라 전제를 읽는 절차"
          input={[
            "원문의 결론 한 줄",
            "그 결론이 나오기 직전까지의 서술",
            "저자가 반대 경우를 따져 본 대목이 있는지",
          ]}
          steps={[
            {
              code: "결론이 성립하지 않는 경우를 저자가 적어 두었는지 찾는다",
              note: "있으면 그것이 전제의 위치를 그대로 알려 줍니다. 이 장에서는 자본이 자유롭게 흐르는 경우가 그 대목입니다.",
            },
            {
              code: "전제를 떠받치는 근거가 무엇인지 확인한다",
              note: "기술·비용처럼 측정되는 것인지, 마음·제도처럼 바뀔 수 있는 것인지를 가릅니다. 뒤쪽이면 결론의 수명이 그 조건에 묶입니다.",
            },
            {
              code: "결론을 조건부 명제로 다시 적는다",
              note: "'A이면 B'의 꼴로 적고 A를 본문에 남깁니다. A를 떼고 B만 인용하는 것이 이 절차가 막으려는 일입니다.",
            },
          ]}
          output="조건이 붙은 결론 한 줄과, 그 조건이 무엇에 의존하는지에 대한 판정"
        />

        <ProgressiveDetail
          title="그러면 오늘날에는 그 전제가 깨진 것입니까"
          preview="이 글은 그 판정을 하지 않습니다. 원문이 적어 둔 조건을 드러내는 데까지가 범위입니다."
        >
          <p className="leading-7">
            자본이 오늘날 얼마나 쉽게 국경을 넘는지, 그래서 어떤 결론이 성립하는지는 자료로 따져야 하는 별개의 문제입니다. 이
            글은 그 자료를 읽지 않았으니 그 판정을 싣지 않습니다. 싣는 것은 저자가 조건을 적어 두었다는 사실과 그 조건이
            무엇에 기댔는지까지입니다.
          </p>
          <p className="leading-7">
            다만 한 가지는 원문에서 바로 읽힙니다. 저자는 이 조건이 깨지면 다른 결론이 나온다는 것을 알았고 그 결론도 적어 두었습니다.
            "자유무역은 언제나 양쪽에 이득"이라는 형태로 이 장을 인용하면{" "}
            <Link to="/economics/macro/why-per-head-stalls">
              조건을 떼고 결론만 가져가는 일
            </Link>
            이 됩니다.
          </p>
        </ProgressiveDetail>

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            <em>
              이 글의 답은 여기서 끝납니다. 교역의 이득은 두 나라 안의 비율이 다르다는 데서 나오고 그 비율이 지워지지 않는 이유는 자본이 국경을
              넘기 어렵다는 전제입니다.
            </em>
          </p>
        </div>
      </section>

      <section id="handoff" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">2단계를 여기서 닫습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            아홉 편으로 1단계가 값에 맡겨 두었던 자리를 하나씩 열었습니다. 값을 쓰는 것이 비싸면 지시가 대신합니다. 값이
            내려가는 것은 커져서가 아니라 돌아가는 방법이 열려서입니다. 파는 쪽이 하나면 값을 고르고 사는 쪽이 하나면 임금이 그
            몫 아래에 남습니다. 그렇게 정해진 몫들의 벌어짐은 곡선으로 재고 그것들을 다 더한 숫자는 무엇으로 나누고 누구를
            세느냐에 따라 다른 이야기를 합니다.
          </p>

          <p className="leading-7">
            아홉 편에 공통된 것이 하나 있습니다. 어느 글에서도 결론을 그대로 가져오지 않고 그 결론이 서 있는 조건까지 함께
            적었습니다. Coase의 경계 조건도, Young의 경고도, Card와 Krueger의 열린 결론도, Fisher의
            항등식도, 이 장의 전제도 그렇습니다. 2단계에서 배운 것을 한 줄로 적으면 그것입니다 — <strong>조건 없이
            인용된 결론은 아직 읽지 않은 것입니다.</strong>
          </p>

          <h3 className="mt-10 mb-4 text-lg font-bold">
            읽고 나서 맞춰 볼 질문
          </h3>

          <p className="leading-7">
            1. 요크셔 100명분을 런던 80명분과 바꾸는 일이 계속되지 않는 이유를
            한 문장으로 말해 보십시오. <strong>(답: 부품 1절)</strong>
          </p>

          <p className="leading-7">
            2. 자본이 자유롭게 움직인다면 옷감은 어디서 만들어집니까. 그 결론은 누가 적은 것입니까. <strong>(답: 부품
            3절)</strong>
          </p>

          <p className="leading-7">
            3. 전제를 떠받친 근거가 기술이 아니라 마음과 제도라는 사실이 왜
            중요합니까. <strong>(답: 부품 4절)</strong>
          </p>
        </div>

        <ContentBoundary article="what-ricardo-assumed" />
      </section>
    </div>
  );
}

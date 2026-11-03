import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import CalculationWalkthrough from "@/components/articles/calculation-walkthrough";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import ElectoralSystemsViz from "./electoral-systems/viz/ElectoralSystemsViz";
import DivisorViz from "./electoral-systems/viz/DivisorViz";

/**
 * 표를 의석으로 바꾸는 규칙이 결과를 정합니다
 *
 * 4편이 의석 분포를 주어진 것으로 두고 계산했으니, 그 의석이 어디서 오는지를
 * 받는다. 선거구에서 나눌 의석 수와 그 의석을 배분하는 규칙이 함께 결과를
 * 만든다는 것을 축으로 삼고, 집계 규칙 자체의 한계는 다음 글이 소유한다.
 */
export default function ElectoralSystemsArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          표는 그대로인데 의석만 바뀝니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            앞 글에서는 의석 분포에 따라 정당의 협상력과 정부 구성이 어떻게
            달라지는지 살펴봤습니다. 이제 그 의석 분포가 어디에서 오는지 볼
            차례입니다. 유권자가 던진 표가 같아도, 표를 세고 의석을 나누는 규칙에
            따라 결과는 달라집니다.
          </p>

          <p className="leading-7">
            선거 규칙은 표를 의석으로 그대로 옮기는 통로가 아닙니다. 아래 예에서는
            한 정당이 44퍼센트의 표로 아홉 석을 모두 얻지만, 같은 표를 다른 방식으로
            세면 세 석만 얻습니다.
          </p>

          <p className="leading-7">
            계산이 틀리거나 표가 조작된 것이 아닙니다. 어떤 표를 의석으로 인정할지,
            남는 몫을 어떻게 나눌지 정한 규칙이 다르기 때문에 결과도 달라집니다.
          </p>
        </div>

        <ElectoralSystemsViz />

        <ContentBoundary article="electoral-systems" />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            이제{" "}
            <strong>
              표를 의석으로 바꾸는 규칙이 무엇을 정하고, 그 대가로 무엇을 버리는지
            </strong>
            살펴보겠습니다.
          </p>

          <p className="leading-7">
            먼저 선거구에서 몇 명을 뽑고 당선자를 어떻게 가리는지 살펴봅니다. 그런
            다음 1등이 의석을 가져가는 방식과 득표율에 맞춰 의석을 나누는 방식을
            비교합니다. 두 결과가 얼마나 다른지 수로 확인한 뒤, 두 방식을 섞을 때
            무엇이 달라지는지도 살펴봅니다.
          </p>

          <p className="leading-7">
            다만 어떤 집계 규칙을 골라도 피할 수 없는 한계는 여기서 다루지 않습니다.
            이 문제는 다음 글인{" "}
            <Link to="/politics/elections/voting-paradoxes">
              다수결의 역설
            </Link>
            에서 이어집니다.
          </p>
        </div>
      </section>

      <section id="district-magnitude" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          한 선거구에서 몇 명을 뽑느냐가 왜 중요한가
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            선거 제도는 네 가지 선택으로 이루어집니다. 한 선거구에서 뽑을 사람의
            수와 당선자를 가리는 방식을 정해야 합니다. 의석 배분에 참여할 최소
            득표율과 유권자가 후보와 정당 가운데 무엇을 고를지도 결과에 영향을
            줍니다.
          </p>

          <p className="leading-7">
            먼저 한 선거구에서 몇 명을 뽑는지가 의석을 나눌 수 있는 범위를
            정합니다. 한 명만 뽑으면 한 자리를 여러 정당에 나눠 줄 수 없습니다.
            열 명을 뽑으면 여러 정당에 의석을 나눌 여지가 생깁니다. 실제로 누가 몇
            석을 받는지는 그다음에 적용하는 배분 규칙이 정합니다.
          </p>

          <p className="leading-7">
            예를 들어 열 석을 득표율에 비례해 나누면 10퍼센트 안팎을 받은 정당도
            한 석을 얻을 가능성이 생깁니다. 그러나 열 석을 모두 1등 정당에 주는
            정당 블록 투표라면 선거구가 커져도 결과는 비례에 가까워지지 않습니다.
            선거구 크기가 의석을 나눌 여지를 만들고, 배분 공식이 그 안에서 실제
            결과를 정하는 셈입니다.
          </p>

          <p className="leading-7">
            봉쇄조항은 어떤 정당이 배분에 참여할 수 있는지 먼저 가리고, 투표 방식은
            유권자가 정당과 후보 가운데 무엇을 고르는지 바꿉니다. 따라서 네 선택 중
            하나만 보고 결과를 예측할 수는 없습니다.
          </p>
        </div>

        <TermBreakdown
          title="선거 결과를 함께 만드는 네 가지 선택"
          items={[
            {
              term: "선거구 크기",
              description:
                "한 선거구에서 뽑는 사람의 수입니다. 한 자리인지 여러 자리인지에 따라 의석을 여러 정당에 나눌 수 있는 범위가 달라집니다.",
              example:
                "한 명만 뽑으면 한 자리를 쪼갤 수 없습니다. 열 명을 비례 방식으로 나누면 10퍼센트 안팎의 정당에도 한 자리가 돌아갈 가능성이 생깁니다.",
              boundary:
                "비례 배분에서는 선거구가 클수록 대체로 비례성이 높아집니다. 하지만 여러 자리를 1등이 모두 가져가는 블록 투표에서는 반대 결과도 납니다. 크기만으로 비례성을 보장할 수 없습니다.",
            },
            {
              term: "당선 결정 방식",
              description:
                "표를 의석으로 바꾸는 계산 규칙입니다. 1등만 가져가는 방식과 몫을 나누는 방식이 크게 갈립니다.",
              example:
                "같은 득표를 단순다수로 세면 한 당이 전부 가져가고, 몫으로 나누면 여러 당에 흩어집니다.",
              boundary:
                "한 자리만 뽑으면 의석률을 여러 정당에 나눌 수는 없습니다. 다만 어느 후보를 승자로 정하는지는 단순다수·결선·선호 이전 같은 규칙에 따라 달라질 수 있습니다.",
            },
            {
              term: "봉쇄조항",
              description:
                "의석 배분에 참여하려면 넘어야 하는 최소 득표율이나 최소 지역구 의석 수입니다.",
              example:
                "전국 득표 3퍼센트를 넘지 못한 정당을 배분에서 빼면 그 표가 다른 정당으로 직접 옮겨가지는 않습니다. 남은 정당끼리 의석을 나누므로 그들의 상대 몫이 커집니다.",
              boundary:
                "정당이 너무 잘게 쪼개지는 것을 막는 장치입니다. 하지만 문턱 바로 아래의 표는 통째로 빠지므로 불비례를 오히려 키울 수 있습니다.",
            },
          ]}
        />

        <CitationBlock
          source="International IDEA · Electoral System Design: The New International IDEA Handbook"
          citeKey={1}
          href="https://www.idea.int/sites/default/files/publications/electoral-system-design-the-new-international-idea-handbook.pdf"
        >
          International IDEA는 선거 공식과 선거구 크기를 서로 다른 핵심 변수로
          구분합니다. 한 자리를 여러 정당에 나눌 수 없으므로, 비례대표에는 복수
          의석 선거구가 필요합니다. 비례 배분 안에서는 선거구가 클수록 대체로
          비례성이 높아집니다. 하지만 블록 투표와 정당 블록 투표에서는 선거구가
          커질수록 오히려 비례성이 낮아질 수 있습니다. 선거구 크기는 의석을 나눌
          수 있는 범위를 정하고, 배분 공식은 그 범위 안에서 실제 결과를 만듭니다.
        </CitationBlock>
      </section>

      <section id="plurality" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          1등만 뽑으면 어떤 표가 사라지는가
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            한 선거구에서 한 명만 뽑아 1등에게 의석을 주는 방식은 단순하지만, 많은
            표를 결과에서 제외합니다. 위 예에서는 44퍼센트를 얻은 정당이 아홉 석을
            모두 가져가고, 41퍼센트와 15퍼센트를 얻은 정당에는 한 석도 돌아가지
            않습니다.
          </p>

          <p className="leading-7">
            이렇게 표를 제외하는 데에는 이유가 있습니다. 한 정당이 실제 득표율보다
            많은 의석을 얻으면 단독 과반이 생길 가능성이 커집니다. 앞 글에서 봤듯
            단독 과반은 연립 협상과 거부권자를 줄여 정부가 더 빨리 결정하도록
            돕습니다. 대신 많은 표가 의석으로 이어지지 않습니다.
          </p>

          <p className="leading-7">
            이 규칙은 유권자의 선택에도 영향을 줍니다. 이길 가능성이 작은 후보에게
            던진 표가 의석으로 이어지지 않을 것 같으면, 유권자는 당선 가능성이 큰
            후보에게 표를 옮길 수 있습니다. 계산 규칙이 표를 제외하는 효과와 그
            사실을 아는 유권자가 선택을 바꾸는 효과가 겹치면서, 다수제에서는 정당
            수가 줄어드는 경향이 나타납니다.
          </p>

          <p className="leading-7">
            다만 이것은 경향이지 법칙이 아닙니다. 지지가 특정 지역에 몰린 정당은
            전국 득표가 작아도 그 지역에서 계속 1등을 하므로 사라지지 않습니다.
            아래에서 보듯 표가 어디에 몰려 있는지가 결과를 크게 바꿉니다.
          </p>
        </div>

        <div id="districting" className="scroll-mt-20">
          <h3 className="mb-4 mt-12 text-xl font-bold">
            같은 표에 선거구 경계만 다시 그으면
          </h3>
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p className="leading-7">
              위 그림의 마지막 장면은 선거구 경계만 바꾼 실험입니다. 전국 득표는
              44·41·15로 같고 계산 규칙과 유권자도 그대로지만, 아홉 석을 모두 얻던
              정당의 의석은 세 석으로 줄어듭니다.
            </p>

            <p className="leading-7">
              이유는 단순합니다. 다수제에서 이기는 데 필요한 것은 1등이지 큰 표차가
              아닙니다. 어느 선거구에서 90 대 5로 이겨도 한 석입니다. 다른
              선거구에서 59 대 21로 이겨도 한 석입니다. 첫 선거구에서는 이기는 데
              쓰고 남은 표가 더 많으므로, 표가 한곳에 몰린 쪽이 손해를 봅니다.
            </p>

            <p className="leading-7">
              이 성질을 의도적으로 이용하면 선거구 경계가 정치적 도구가 됩니다.
              상대 지지자를 몇 개 선거구에 몰아넣으면 승리에 쓰고 남는 표가 많아집니다.
              반대로 여러 선거구에 잘게 흩으면 어디에서도 1등을 하지 못하게 만들 수
              있습니다. 어느 쪽이든 득표수는 그대로인데 의석만 달라집니다.
            </p>

            <p className="leading-7">
              그래서 다수제를 쓰는 곳에서는 경계를 누가 긋는가도 제도의 일부가
              됩니다. 선거 규칙만큼 지도를 그리는 일도 결과에 영향을 줍니다. 지도를
              그리는 쪽이 중립적인지는 별도로 따져야 합니다.
            </p>
          </div>
        </div>
      </section>

      <section id="proportional" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          의석은 쪼갤 수 없는데 어떻게 비례해 나누는가
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            반대쪽에는 여러 의석을 득표율에 맞춰 나누는 방식이 있습니다. 하지만
            의석은 소수점 단위로 쪼갤 수 없습니다. 44퍼센트에 9석을 곱하면
            3.96석이 나오는데, 0.96석만 따로 떼어 줄 수는 없습니다.
          </p>

          <p className="leading-7">
            그래서 비례대표제 안에서도 소수점 이하의 몫을 처리하는 방법이 여러
            갈래로 나뉩니다. 널리 쓰이는 한 방식은 각 정당의 표를 1, 2, 3으로
            차례로 나눠 몫을 구한 뒤, 그 몫을 큰 순서로 세워 의석 수만큼 고릅니다.
          </p>

          <p className="leading-7">
            의석을 받은 정당은 다음 계산에서 더 큰 수로 표를 나누므로 몫이 줄어듭니다.
            그 몫이 충분히 작아지면 아직 의석을 받지 못한 정당에도 차례가 옵니다.
            아래 절차와 그림에서 이 순서를 확인할 수 있습니다.
          </p>
        </div>

        <AlgorithmBlock
          title="몫을 큰 순서로 세워 의석을 하나씩 나누는 절차"
          input={[
            "각 정당의 득표수",
            "나눌 의석 수",
            "봉쇄조항이 있다면 그 문턱",
          ]}
          steps={[
            {
              code: "봉쇄조항을 넘지 못한 정당을 먼저 배분 대상에서 제외한다.",
              note: "제외된 표가 다른 정당으로 직접 넘어가지는 않습니다. 그 표를 계산에서 빼고 남은 정당끼리 의석을 나누므로, 남은 정당의 상대 몫이 커집니다.",
            },
            {
              code: "각 정당의 득표를 1, 2, 3, … 으로 나눈 몫을 모두 구한다.",
              note: "나누는 수는 그 정당이 이미 받은 의석 수에 1을 더한 값입니다. 의석을 많이 받을수록 다음 몫이 작아집니다.",
            },
            {
              code: "모든 몫을 큰 순서로 한 줄로 세운다.",
              note: "정당별로 줄을 세우는 것이 아니라 전부 섞어서 한 줄입니다. 이 줄이 곧 의석을 가져가는 순서입니다.",
            },
            {
              code: "앞에서부터 나눌 의석 수만큼 끊고, 각 몫의 주인에게 의석을 하나씩 준다.",
              note: "끊는 자리 바로 뒤에 있던 몫은 의석으로 바뀌지 못합니다. 그 몫이 누구 것인지가 제도의 성격을 드러냅니다.",
            },
            {
              code: "나누는 수를 1, 3, 5, … 로 바꾸면 다른 방식이 된다.",
              note: "첫 몫은 두 방식 모두 득표를 1로 나눕니다. 차이는 한 석을 받은 뒤부터입니다. 다음 몫은 2가 아니라 3으로 나눕니다. 이미 의석을 받은 정당의 몫이 더 크게 줄어, 경계 의석이 작은 정당으로 갈 가능성이 커집니다.",
            },
          ]}
          output="각 정당이 가져가는 의석 수와 마지막 의석 바로 다음 순위의 몫"
        />

        <DivisorViz />

        <CitationBlock
          source="European Parliamentary Research Service · Understanding the d’Hondt method (2024)"
          citeKey={2}
          href="https://www.europarl.europa.eu/RegData/etudes/BRIE/2024/762352/EPRS_BRI%282024%29762352_EN.pdf"
        >
          EPRS는 D’Hondt를 제수를 쓰는 최고평균 방식으로 분류합니다. 각 정당의
          득표를 이미 받은 의석 수에 1을 더한 값으로 나눕니다. 매 차례 가장 큰
          몫을 가진 정당이 다음 의석을 받습니다. 396·369·135표에 이 절차를 아홉
          번 적용하면 4·4·1석이 됩니다. 같은 자료는 D’Hondt가 Sainte-Laguë보다
          득표가 큰 정당에 유리한 경향이 있다고 설명합니다. 의석을 정수로 나눠야
          하므로, 어떤 배분 방식에서도 일정한 불비례가 남는다고 덧붙입니다.
        </CitationBlock>
      </section>

      <section id="disproportionality" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          득표율과 의석률은 얼마나 어긋났는가
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            지금까지는 두 제도의 차이를 말로 비교했습니다. 이제 각 정당의 득표율과
            의석률이 얼마나 어긋났는지 계산하면, 차이의 크기도 같은 기준으로 비교할
            수 있습니다.
          </p>

          <p className="leading-7">
            각 정당의 득표율에서 의석률을 빼면 어긋난 정도가 나옵니다. 이 차이를
            그대로 더하면 남는 쪽과 모자라는 쪽이 서로 지워져 언제나 0이 됩니다.
            부호가 달라도 차이의 크기는 남도록 각 값을 제곱해서 더합니다.
          </p>

          <p className="leading-7">
            차이를 제곱하면 큰 어긋남에 더 큰 가중치가 붙습니다. 여러 정당이 조금씩
            손해 본 경우와 한 정당이 크게 손해 본 경우를 다르게 계산하려는
            선택입니다.
          </p>
        </div>

        <ExplainedFormula
          question="어떤 제도에서 득표율과 의석률이 더 크게 어긋나는가?"
          idea="정당마다 득표율과 의석률의 차이를 구하고, 상쇄되지 않도록 제곱해서 더합니다. 합을 반으로 나누는 것은 하나의 왜곡이 두 번 세어지기 때문입니다. 한 정당이 더 받으면 다른 정당이 그만큼 덜 받습니다. 같은 왜곡이 양쪽에서 한 번씩 계산에 들어옵니다."
          formula={String.raw`\mathrm{LSq} = \sqrt{\tfrac{1}{2} \sum_{i=1}^{n} (v_i - s_i)^2}`}
          annotatedFormula={String.raw`\mathrm{LSq} = \sqrt{\tfrac{1}{2} \sum_{i=1}^{n} \underbrace{(v_i - s_i)^2}_{i\text{의 득표율과 의석률의 어긋남}}}`}
          operations={[
            {
              expression: String.raw`(v_i - s_i)^2`,
              annotation: [
                "득표율에서 의석률을 뺀 차이를 제곱합니다. 남는 쪽과 모자라는 쪽이 상쇄되지 않게 하려는 것입니다.",
                "제곱이므로 큰 어긋남 하나가 작은 어긋남 여럿보다 훨씬 무겁게 들어갑니다.",
              ],
            },
            {
              expression: String.raw`\tfrac{1}{2}`,
              annotation: [
                "한 정당이 더 받은 만큼 다른 정당이 덜 받으므로 같은 왜곡이 두 번 세어집니다. 반으로 나눠 한 번으로 만듭니다.",
                "이 인자가 없으면 값이 언제나 √2배 커질 뿐 제도 사이의 순서는 바뀌지 않습니다.",
              ],
            },
            {
              expression: String.raw`\sqrt{\phantom{x}}`,
              annotation: [
                "제곱해서 더한 값을 다시 퍼센트 단위로 되돌립니다.",
                "그래서 결과를 '평균적으로 몇 퍼센트포인트 어긋났는가'에 가깝게 읽을 수 있습니다.",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`v_i`,
              name: "정당 i의 득표율",
              description:
                "전체 유효표에서 그 정당이 받은 비율이며 퍼센트로 씁니다.",
            },
            {
              symbol: String.raw`s_i`,
              name: "정당 i의 의석률",
              description:
                "전체 의석에서 그 정당이 얻은 비율이며 같은 단위로 씁니다.",
            },
            {
              symbol: String.raw`\mathrm{LSq}`,
              name: "불비례 지수",
              description:
                "0이면 득표율과 의석률이 완전히 일치합니다. 값이 클수록 표가 의석으로 옮겨 가는 과정에서 많이 비틀렸다는 뜻입니다.",
            },
          ]}
          assumptions={[
            "정당이 분석의 단위라고 둡니다. 무소속이 많으면 각각을 하나의 정당처럼 세어야 해서 값이 흔들립니다.",
            "득표율과 의석률을 같은 시점의 같은 선거에서 잰다고 둡니다. 지역구와 비례를 따로 뽑는 제도에서는 어느 표를 기준으로 삼을지부터 정해야 합니다.",
            "비례에서 벗어난 정도만 재고, 그 벗어남이 정당한지 아닌지는 판단하지 않습니다.",
          ]}
          interpretation="아래 계산 장부는 소선거구 단순다수의 50.2가 어디서 나오는지 한 줄씩 펼칩니다. 같은 네 단계를 전국 비례 4·4·1에 적용하면 약 3.7입니다. 선거구 경계만 바꾼 3·6·0에 적용하면 약 22.3입니다. 같은 표를 놓고 규칙만 바꿨는데 격차가 크게 달라졌습니다. 다만 값이 작다고 곧바로 더 좋은 제도라고 결론 내리면 안 됩니다. 이 수는 비례에서 벗어난 정도만 재며, 단독 과반이나 대표와 지역의 연결은 세지 않습니다."
        />

        <CalculationWalkthrough
          title="불비례 지수 계산 장부"
          question="44·41·15퍼센트의 표가 9·0·0석이 되면 왜 50.2인가?"
          scope="같은 선거에서 세 정당의 득표율과 의석률만 비교합니다. 단위는 퍼센트포인트입니다."
          steps={[
            {
              label: "득표율을 적습니다",
              expression: "v = (44, 41, 15)",
              result: "합계 100%",
              reason: "가당·나당·다당이 받은 표의 비율입니다.",
            },
            {
              label: "9·0·0석을 의석률로 바꿉니다",
              expression: "s = (9/9, 0/9, 0/9) × 100",
              result: "s = (100, 0, 0)",
              reason: "의석 수와 득표율을 같은 퍼센트 단위로 맞춥니다.",
            },
            {
              label: "정당마다 어긋난 크기를 구합니다",
              expression: "v − s = (−56, 41, 15)",
              result: "56·41·15%p 차이",
              reason: "부호는 더 받았는지 덜 받았는지를 나타냅니다. 다음 줄에서 제곱하므로 크기만 남습니다.",
            },
            {
              label: "차이를 제곱해 더합니다",
              expression: "(−56)² + 41² + 15²",
              result: "3136 + 1681 + 225 = 5042",
              reason: "남는 쪽과 모자라는 쪽이 서로 지워지지 않게 제곱합니다.",
            },
            {
              label: "두 번 센 왜곡을 반으로 줄이고 단위를 되돌립니다",
              expression: "√(5042 ÷ 2)",
              result: "√2521 ≈ 50.2",
              reason: "한 정당이 더 받은 만큼 다른 정당이 덜 받아 같은 왜곡을 두 번 셉니다. 2로 나눈 뒤 제곱근을 씌워 다시 퍼센트포인트 단위로 돌아옵니다.",
            },
          ]}
          conclusion="소선거구 단순다수의 불비례 지수는 약 50.2입니다. 같은 표를 전국 비례로 나눈 4·4·1석의 약 3.7보다 훨씬 큽니다."
          caveats={[
            "정부를 빨리 구성하는 효과와 지역 대표성을 이 수에 넣지 않았습니다.",
            "무소속이 많거나 지역구표와 정당표가 따로 있으면 어떤 표를 기준으로 삼을지 먼저 정해야 합니다.",
          ]}
        />

        <CitationBlock
          source="Michael Gallagher · Election indices (최소제곱지수의 출처를 저자 본인이 밝힌 문서)"
          citeKey={3}
          href="https://doi.org/10.1016/0261-3794(91)90004-C"
        >
          위 지수는 저자 본인이 정리한 &ldquo;Election indices&rdquo; 문서에서
          &ldquo;득표 분포와 의석 분포 사이의 불비례를 재는 최소제곱지수(LSq)&rdquo;로
          소개되며, 출처를 Michael Gallagher, &lsquo;Proportionality, disproportionality
          and electoral systems&rsquo;, <em>Electoral Studies</em> 10권 1호(1991),
          33~51쪽으로 밝힙니다. 같은 문서가 정당 수를 재는 다른 지수의 출처도 함께
          적고 있습니다. 다만 1991년 원 논문은 출판사 쪽에서 자동 조회를 막아
          직접 열지 못했습니다. 여기서는 서지 사항과 지수의 출처만 확인했으며,
          계산 과정은 앞에서 직접 풀었습니다.
        </CitationBlock>

        <ProgressiveDetail
          title="불비례가 낮은 것이 언제나 좋은가?"
          preview="이 수는 비례에서 벗어난 정도만 재고, 벗어남의 대가로 무엇을 얻었는지는 세지 않습니다."
        >
          <p className="leading-7">
            값이 0이라는 것은 득표율과 의석률이 일치한다는 뜻일 뿐, 그 의회가 잘
            굴러간다는 뜻은 아닙니다. 비례성이 높아 여러 정당이 의회에 들어오는
            조건에서는 앞 글에서 본 정부 구성 협상이 늘어날 수 있습니다. 그러나
            정당 수가 적거나 연립 관행이 안정적이면 같은 문제가 반드시 생기지는
            않습니다.
          </p>
          <p className="leading-7">
            반대로 값이 크다는 것도 그 자체로는 판정이 아닙니다. 다수제가 만드는
            높은 값은 단독 과반이 나올 가능성을 높이는 과정에서 생길 수 있습니다.
            그 대신 얻는 정부 구성의 안정성을 더 중시할지는 이 지수만으로 판단할
            수 없습니다.
          </p>
          <p className="leading-7">
            따라서 이 지수만으로 어떤 제도를 고를 수는 없습니다. 이 값은 득표율과
            의석률이 얼마나 어긋났는지를 보여 주며, 정부 구성의 안정성이나 지역
            대표성은 별도로 비교해야 합니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="mixed" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          두 방식을 섞으면 무엇이 달라지는가
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            많은 나라는 두 방식 가운데 하나만 고르지 않고 함께 사용합니다. 일부
            의석은 소선거구에서 뽑아 지역과 대표를 연결하고, 나머지는 정당 득표에
            따라 나눠 비례성을 보완합니다.
          </p>

          <p className="leading-7">
            섞는 방법은 크게 둘로 나뉩니다. 지역구 의석과 비례 의석을 따로 계산해
            더하면, 지역구에서 생긴 불비례는 비례 의석 수만큼만 줄어듭니다. 반대로
            정당 득표율에 따라 전체 의석을 먼저 정하고 지역구 당선 의석을 뺀 나머지를
            채우면, 최종 의석 분포가 득표율에 더 가까워집니다. 겉으로는 혼합형이라는
            같은 이름을 쓰지만 결과를 만드는 원리는 다릅니다.
          </p>

          <p className="leading-7">
            한국은 지역구를 소선거구 단순다수로 뽑고 비례대표를 따로 두는 쪽에
            속합니다. 헌법은 국회를 보통·평등·직접·비밀선거로 선출된 의원으로
            구성하고, 의원 수는 200명 이상으로 두도록 정합니다. 선거구와
            비례대표의 구체적인 규칙은 헌법이 아니라 법률에 맡깁니다.
          </p>

          <p className="leading-7">
            이 구조에서는 헌법을 고치지 않고도 일반 법률 절차로 선거 규칙을 바꿀
            수 있습니다. 그런데 그 법률을 고치는 국회의원은 현재 규칙으로 당선된
            사람들입니다. 규칙을 고치는 쪽과 그 규칙의 적용을 받는 쪽이 같은
            셈입니다.
          </p>
        </div>

        <CitationBlock
          source="대한민국헌법 제41조 (한국법제연구원 영문 번역본)"
          citeKey={4}
          href="https://elaw.klri.re.kr/eng_service/lawView.do?hseq=1&lang=ENG"
        >
          제1항은 국회가 &ldquo;보통·평등·직접·비밀선거로 국민이 선출한
          의원으로 구성된다&rdquo;고 정하고, 제2항은 의원 수를 법률로 정하되
          200인 이상이어야 한다고 합니다. 제3항은 &ldquo;국회의원의 선거구,
          비례대표제, 그 밖에 국회의원 선거에 관한 사항은 법률로 정한다&rdquo;고
          하여 구체적인 선거 제도를 법률에 위임합니다. 위 본문에서 선거구와
          비례대표의 규칙을 헌법 개정 없이 일반 법률 절차로 바꿀 수 있다고 한
          근거가 이 위임 구조입니다.
          번역본은 참조용이며 법적 효력은 국문 원문에 있다고 이 사이트가
          명시합니다.
        </CitationBlock>
      </section>

      <section id="boundary" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          제도는 무엇을 버릴지 정할 뿐 옳은 답을 정하지 않습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            어느 제도가 더 옳은지는 하나의 기준으로 답할 수 없습니다. 다수제는
            단독 과반이 나올 가능성을 높이는 대신 많은 표를 의석으로 바꾸지 못할
            수 있습니다. 비례제는 더 많은 표를 의석에 반영하지만, 여러 정당이
            의회에 들어오면 정부를 구성하기 위한 협상이 늘어날 수 있습니다.
          </p>

          <p className="leading-7">
            앞의 계산은 유권자의 선호가 고정되어 있고, 제도는 그 선호를 세는 방법만
            바꾼다고 가정했습니다. 실제 선거에서는 유권자도 규칙을 보고 표를 다르게
            쓰므로 득표율 자체가 제도의 영향을 받습니다.
          </p>

          <p className="leading-7">
            더 근본적인 문제도 남아 있습니다. 여기서는 어떻게 세느냐만 다뤘지, 셈
            자체가 사람들의 뜻을 제대로 담아낼 수 있는지는 묻지 않았습니다. 그런데
            선택지가 셋 이상이면 어떤 집계 규칙도 피하지 못하는 이상한 일들이
            생깁니다.
          </p>

          <p className="leading-7">
            다음 글인{" "}
            <Link to="/politics/elections/voting-paradoxes">
              다수결의 역설
            </Link>
            에서는 어떤 규칙을 고를지가 아니라, 집계 규칙 자체에 어떤 한계가 있는지
            살펴봅니다.
          </p>
        </div>

        <ReviewPrompts
          questions={[
            "가당이 전국 득표 44퍼센트인데도 아홉 석을 모두 얻을 수 있는 이유는 무엇입니까? (답: 2절)",
            "가당이 첫 의석을 받은 뒤 다음 몫은 198입니다. 그런데 둘째 의석이 나당으로 가는 이유는 무엇입니까? (답: 3절)",
            "불비례 지수가 50.2에서 3.7로 낮아졌다는 사실만으로 뒤 제도가 더 낫다고 결론 내릴 수 없는 이유는 무엇입니까? (답: 4절)",
          ]}
        />
      </section>
    </div>
  );
}

import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import LemonsViz from "./information-asymmetry/viz/LemonsViz";
import SignalCostViz from "./information-asymmetry/viz/SignalCostViz";

/**
 * 한쪽만 아는 것이 있으면 값이 평균을 말합니다
 *
 * 경제 시리즈 8편. 앞의 모든 글은 각자가 자기 값을 알고 있다고 두었다.
 * 여기서는 한쪽만 알고 다른 쪽은 모를 때 값이 무엇을 말하게 되는지,
 * 그래서 어느 쪽이 시장에 남는지를 본다. 계약 전 숨은 특성과 계약 후
 * 숨은 행동을 함께 다루고, 가려내는 두 장치의 값을 센다.
 */
export default function InformationAsymmetryArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          지금까지는 양쪽이 같은 것을 보고 있었습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            앞의 모든 글에서 사는 쪽은 자기가 얼마를 낼 수 있는지 알았고 파는
            쪽은 자기에게 얼마가 드는지 알았습니다. 서로의 숫자는 몰라도 물건
            자체는 같은 것을 보고 있었습니다.
          </p>

          <p className="leading-7">
            그런데 중고차는 다릅니다. 판 사람은 그 차를 몇 년 몰았고 어디가
            어떤지 압니다. 살 사람은 겉만 봅니다.
          </p>

          <p className="leading-7">
            이때 값은 무엇을 말합니까. 좋은 차인지 나쁜 차인지 구별할 수 없으면
            같은 값이 붙습니다. 그러면 그 값은 어느 한 대의 값이 아니라{" "}
            <strong>나온 차들의 평균</strong>이 됩니다.
          </p>
        </div>

        <LemonsViz />

        <ContentBoundary article="information-asymmetry" />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            이 글이 푸는 질문은 하나입니다.{" "}
            <strong>
              한쪽만 아는 것이 있으면 값이 무엇을 말하게 되고, 그래서 어느 쪽이
              시장에 남는가
            </strong>
            입니다.
          </p>

          <p className="leading-7">
            순서는 이렇습니다. 먼저 구별할 수 없을 때 값이 평균에 붙는다는 것을 보고, 그 값이 좋은 쪽을 밀어내는 과정을 셉니다. 그다음 아는 쪽이 값비싼 표시를 보내 갈라지는 길과
            그 값이 어디로 가는지를 보고 마지막으로 계약을 맺은 뒤에 행동이 바뀌는 다른 종류의 문제를 봅니다.
          </p>

          <p className="leading-7">
            숨기는 쪽이 나쁜 사람이라는 이야기는 하지 않습니다. 좋은 차를 가진 사람도 자기 차가 좋다고 말할 수는 있지만 그 말을 나쁜 차를 가진 사람도 똑같이 할 수 있어서 아무 일도
            하지 못합니다.
          </p>
        </div>
      </section>

      <section id="pooling" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 1. 구별할 수 없으면 좋은 것과 나쁜 것이 같은 값에 팔립니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            중고차 여섯 대를 두겠습니다. 판 쪽에게 각각 2, 4, 6, 8, 10, 12의
            값이 있고, 산 쪽은 같은 차를 1.5배로 쳐서 3, 6, 9, 12, 15, 18로
            봅니다.
          </p>

          <p className="leading-7">
            어느 대를 봐도 산 쪽이 더 높게 칩니다. 그러니 여섯 대 모두 거래되는 것이 맞고 그때 생기는 것이 1, 2, 3, 4, 5, 6을 더한 21입니다.
          </p>

          <p className="leading-7">
            그런데 산 쪽은 어느 대가 어느 대인지 모릅니다. 그래서 여섯 대에 각각
            다른 값을 매길 수가 없고 하나의 값만 부를 수 있습니다.
          </p>

          <p className="leading-7">
            여기서 두 가지가 동시에 일어납니다. 좋은 차와 나쁜 차가{" "}
            <strong>같은 값에 팔리고</strong>, 그 값보다 자기 차를 높게 치는
            사람은 아예 내놓지 않습니다.
          </p>

          <p className="leading-7">
            좋은 차 주인은 말을 할 수 있지 않느냐고 물을 수 있습니다. 할 수는
            있는데 나쁜 차 주인도 똑같은 말을 할 수 있습니다. 그래서 말만으로는
            아무것도 갈라지지 않습니다.
          </p>
        </div>

        <CitationBlock
          source="George A. Akerlof, “The Market for ‘Lemons’: Quality Uncertainty and the Market Mechanism”, The Quarterly Journal of Economics, Vol. 84, No. 3, August 1970, pp. 488–500"
          citeKey={1}
          href="https://doi.org/10.2307/1879431"
        >
          이 구조를 처음 적어 둔 글입니다. &ldquo;An asymmetry in available
          information has developed: for the sellers now have more knowledge
          about the quality of a car than the buyers. But good cars and bad cars
          must still sell at the same price &mdash; since it is impossible for a
          buyer to tell the difference between a good car and a bad car.&rdquo;
          그래서 &ldquo;the owner of a good machine must be locked in&rdquo;이라고
          적습니다. 나쁜 것이 좋은 것을 몰아낸다는 점에서 악화가 양화를 몰아내는
          현상과 닮았지만 같지는 않다고 스스로 단서를 답니다. &ldquo;In
          Gresham&rsquo;s law, however, presumably both buyer and seller can tell
          the difference between good and bad money. So the analogy is
          instructive, but not complete.&rdquo; 원문 열세 쪽을 내려받아 이 대목과
          아래 절들에서 인용한 문장을 직접 대조했습니다. 이 글의 숫자 예시는
          논문의 것이 아니라 같은 구조를 여섯 대로 줄여 다시 계산한 것인데,
          산 쪽이 1.5배로 친다는 설정만은 논문의 U₂ 효용함수와 같은 비율을
          썼습니다.
        </CitationBlock>
      </section>

      <section id="unravelling" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 2. 그 값으로는 좋은 것부터 나오지 않습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            산 쪽의 처지에서 계산해 보겠습니다. 값 하나를 부르면 자기 차를 그
            값 아래로 치는 사람만 내놓습니다. 그러니 부른 값이 나오는 차의
            범위를 정합니다.
          </p>

          <p className="leading-7">
            값 2를 부르면 첫째 차만 나오고 그 차의 값어치는 3입니다. 3이 2보다
            크니 산 쪽은 냅니다. 값 6을 부르면 세 대가 나오고 평균이 6이라
            아슬아슬하게 맞습니다.
          </p>

          <p className="leading-7">
            값 8을 부르면 어떻게 됩니까. 네 대가 나오고 평균이 7.5입니다.{" "}
            <strong>8을 내고 7.5를 받는 셈이라 내지 않습니다.</strong> 값 10도
            12도 마찬가지입니다.
          </p>

          <p className="leading-7">
            이유가 보입니다. 값을 올리면 더 좋은 차도 나오지만 이미 나와 있던
            나쁜 차들도 그대로 남습니다. 평균은 새로 들어온 차 하나에만 끌리고
            값은 그보다 빨리 오릅니다.
          </p>

          <p className="leading-7">
            그래서 값이 6에서 멈춥니다. 세 대가 거래되고 세 대는 나오지
            않습니다. 나오지 않은 세 대는 산 쪽이 12, 15, 18로 치고 판 쪽이 8,
            10, 12로 치니 전부 거래되는 것이 맞는 차들입니다.
          </p>

          <p className="leading-7">
            <strong>사라진 15는 나쁜 차의 몫이 아니라 좋은 차의
            몫입니다.</strong> 앞 두 글의 실패와 방향이 또 다릅니다. 여기서는
            수량이 어긋나는 것이 아니라 어느 쪽이 남느냐가 어긋납니다.
          </p>
        </div>

        <ExplainedFormula
          question="구별할 수 없을 때 값이 어디서 멈춥니까?"
          idea="값 하나를 부르면 그 값 아래로 치는 쪽만 내놓으므로, 부른 값이 무엇이 나오는지를 정하고 나온 것들의 평균이 다시 그 값을 낼지를 정합니다. 값이 오르면 나오는 범위가 넓어지지만 평균은 범위의 가운데를 따라가므로 값보다 천천히 오릅니다. 두 선이 만나는 마지막 자리에서 멈춥니다."
          formula={String.raw`P^{*} = \max\{P : k \cdot \mathbb{E}[v \mid v \le P] \ge P\}, \qquad L = \sum_{v > P^{*}} (k v - v)`}
          annotatedFormula={String.raw`\underbrace{P^{*} = \max\{P : k \cdot \mathbb{E}[v \mid v \le P] \ge P\}}_{\text{값이 멈추는 자리}}, \qquad \underbrace{L = \textstyle\sum_{v > P^{*}} (k-1) v}_{\text{안 나온 것들의 사라진 이득}}`}
          operations={[
            {
              expression: String.raw`\mathbb{E}[v \mid v \le P]`,
              annotation: [
                "부른 값 아래로 치는 것들만 모아 낸 평균이며, 이것이 산 쪽이 실제로 마주하는 물건입니다.",
                "값이 오르면 이 평균도 오르지만 새로 들어온 하나에만 끌려 오르므로 값보다 느립니다. 이 속도 차이가 이 절의 전부입니다.",
              ],
            },
            {
              expression: String.raw`k \cdot \mathbb{E}[v \mid v \le P] \ge P`,
              annotation: [
                "산 쪽이 그 값을 낼지의 판정이며, 한 대의 값이 아니라 평균에 대고 냅니다.",
                "이 부등식이 마지막으로 성립하는 자리가 값이 멈추는 곳입니다. 그보다 위의 물건은 주인이 내놓지 않습니다.",
              ],
            },
            {
              expression: String.raw`\sum_{v > P^{*}} (k-1) v`,
              annotation: [
                "나오지 않은 것들 각각에서 산 쪽과 판 쪽의 값 차이를 더한 것입니다.",
                "이 합이 사라지는 이유는 그것들이 나쁜 물건이어서가 아니라 좋은 물건이어서입니다. 값이 그 값어치에 못 미칩니다.",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`v`,
              name: "판 쪽이 그 물건에 매기는 값",
              description:
                "그 물건의 상태를 그대로 나타내며 판 쪽만 압니다. 예에서는 2, 4, 6, 8, 10, 12입니다.",
            },
            {
              symbol: String.raw`k`,
              name: "산 쪽이 판 쪽의 몇 배로 치는가",
              description:
                "예에서는 1.5입니다. 이 배수가 클수록 평균이 값을 따라잡기 쉬워집니다.",
            },
            {
              symbol: String.raw`P^{*}`,
              name: "값이 멈추는 자리",
              description:
                "그보다 위의 물건은 주인이 내놓지 않으므로 거래의 범위를 정합니다.",
            },
          ]}
          assumptions={[
            "산 쪽이 전혀 구별하지 못한다고 둡니다. 실제로는 점검이나 이력으로 부분적으로 구별할 수 있고, 그만큼 이 계산이 약해집니다.",
            "판 쪽이 자기 물건을 정확히 안다고 둡니다. 양쪽이 다 모르면 이 문제가 아니라 그냥 위험의 문제가 됩니다.",
            "산 쪽이 물건의 분포를 안다고 둡니다. 어떤 것들이 얼마나 있는지조차 모르면 평균을 낼 수도 없습니다.",
          ]}
          interpretation="판 쪽의 값이 2, 4, 6, 8, 10, 12이고 산 쪽이 1.5배로 친다고 하겠습니다. 값 2에서는 한 대가 나와 평균이 3이고, 값 6에서는 세 대가 나와 평균이 6이라 아직 맞습니다. 값 8에서는 네 대가 나오는데 평균이 7.5라 값에 못 미칩니다. 그래서 값이 6에서 멈춰 세 대만 거래되고, 나오지 않은 세 대에서 4, 5, 6을 더한 15가 사라집니다. 여기서 읽어야 할 것은 사라진 쪽이 좋은 쪽이라는 점입니다. 값이 평균에 붙으면 평균보다 나은 것은 언제나 손해를 보고 물러납니다. 읽으면 안 되는 것은 이런 시장이 반드시 통째로 무너진다는 결론입니다. 논문의 연속형 예에서는 아무것도 거래되지 않지만 그것은 가장 나쁜 물건의 값이 0까지 내려가 있기 때문이고, 여기처럼 바닥이 2에서 끊기면 절반이 남습니다."
        />

        <TermBreakdown
          title="얼마나 무너지는지는 두 숫자가 정합니다"
          description="같은 구조인데 배수와 바닥에 따라 한 대만 남기도 하고 여섯 대가 다 거래되기도 합니다."
          items={[
            {
              term: "산 쪽이 1.2배로 치면",
              description:
                "평균이 값을 거의 못 따라가 맨 아래 한 대만 거래됩니다.",
              example:
                "값 4를 부르면 두 대가 나오고 평균이 3.6이라 이미 값에 못 미칩니다.",
              boundary:
                "배수가 1에 가까울수록 애초에 거래로 생기는 것이 작아지므로, 무너지는 정도와 잃는 크기를 같이 봐야 합니다.",
            },
            {
              term: "산 쪽이 2배로 치면",
              description: "여섯 대가 모두 거래되어 아무것도 무너지지 않습니다.",
              example:
                "값 12를 불러도 나온 여섯 대의 평균이 10.5이고 그 두 배인 21이 12를 넘습니다.",
              boundary:
                "구별하지 못하는 것은 그대로인데 결과만 멀쩡합니다. 정보가 한쪽에 몰려 있다는 사실 자체가 문제인 것은 아닙니다.",
            },
            {
              term: "가장 나쁜 것의 값이 0이면",
              description: "어떤 값을 불러도 평균이 값에 못 미쳐 아무것도 거래되지 않습니다.",
              example:
                "값 P를 부르면 나온 것들의 평균이 P의 절반 근처라, 1.5배를 해도 P에 못 미칩니다.",
              boundary:
                "논문의 연속형 예가 이 경우입니다. 완전한 붕괴는 구조의 필연이 아니라 바닥이 어디냐의 결과입니다.",
            },
          ]}
        />
      </section>

      <section id="signaling" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 3. 아는 쪽이 값비싼 표시를 보내면 갈라집니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            말로는 안 된다고 했습니다. 나쁜 쪽도 똑같은 말을 할 수 있기
            때문입니다. 그러면 나쁜 쪽이 <strong>따라 하기 어려운</strong> 것이
            있으면 됩니다.
          </p>

          <p className="leading-7">
            일자리로 옮겨 보겠습니다. 한쪽은 일을 12만큼 해내고 다른 쪽은
            6만큼 해내는데 겉으로는 구별되지 않습니다. 절반씩이라 하면 값이
            평균인 9에 붙습니다.
          </p>

          <p className="leading-7">
            여기에 자격증을 둡니다. 중요한 것은 이 자격증이 일을 조금도 잘하게
            만들지 않는다는 점입니다. 오직 얻는 데 값이 들 뿐입니다.
          </p>

          <p className="leading-7">
            그리고 그 값이 유형마다 다릅니다. 잘하는 쪽은 한 단위에 1이 들고
            못하는 쪽은 4가 듭니다. 잘하는 사람이 자격증도 쉽게 딴다는
            이야기입니다.
          </p>

          <p className="leading-7">
            이제 두 단위를 갖춘 사람에게만 12를 준다고 해 보겠습니다. 잘하는
            쪽은 12에서 2를 빼 10이라 안 갖추고 6을 받는 것보다 낫습니다.
          </p>

          <p className="leading-7">
            못하는 쪽은 12에서 8을 빼 4입니다. 안 갖추고 6을 받는 편이
            낫습니다. <strong>따라오지 않습니다.</strong> 그래서 갈라집니다.
          </p>

          <p className="leading-7">
            그런데 둘을 합치면 10 더하기 6으로 16입니다. 섞여 있을 때는 9씩
            18이었습니다. <strong>2가 줄었고 그 2가 자격증에 들어간
            값입니다.</strong>
          </p>

          <p className="leading-7">
            갈라내기는 했는데 일을 해내는 양은 하나도 늘지 않았습니다. 앞 절의
            15를 되찾자고 여기서 2를 태운 셈인데, 이 두 숫자의 크기는 상황마다
            다릅니다.
          </p>
        </div>

        <SignalCostViz />

        <CitationBlock
          source="Michael Spence, “Job Market Signaling”, The Quarterly Journal of Economics, Vol. 87, No. 3, August 1973, pp. 355–374"
          citeKey={2}
          href="https://doi.org/10.2307/1882010"
        >
          이 장치가 성립하는 조건을 &ldquo;A Critical Assumption&rdquo;이라는 소절
          제목으로 따로 떼어 둡니다. &ldquo;It is not difficult to see that a
          signal will not effectively distinguish one applicant from another,
          unless the costs of signaling are negatively correlated with productive
          capability. For if this condition fails to hold, given the offered wage
          schedule, everyone will invest in the signal in exactly the same
          way.&rdquo; 이 절의 1과 4가 그 조건입니다. 한 가지를 덧붙여야 합니다.
          논문 자신의 수치에서는 잘하는 쪽까지 손해를 봅니다. 능력이 1과 2이고
          비용이 각각 y와 y/2일 때 갈라지는 범위가 1 &lt; y* &lt; 2인데, 절반씩
          섞였을 때의 값이 1.5이고 잘하는 쪽의 순이익이 2 − y*/2이므로 언제나
          그 아래입니다. 그래서 &ldquo;Thus, everyone would prefer a situation in
          which there is no signaling&rdquo;이라고 적습니다. 이 절의 숫자에서
          잘하는 쪽이 1만큼 이득을 보는 것은 비용 비가 1대 4로 더 가팔라서이고,
          일반적인 결론이 아닙니다. 조건은 잘하는 쪽의 비용을 못하는 쪽의
          비용으로 나눈 값이 못하는 쪽의 비율보다 작아야 한다는 것입니다.
        </CitationBlock>

        <AlgorithmBlock
          title="가려내는 장치가 서는지 확인하는 절차"
          input={[
            "두 유형이 실제로 해내는 양의 차이",
            "표시를 얻는 데 유형마다 드는 값",
            "못하는 쪽의 비율",
          ]}
          steps={[
            {
              code: "if 표시 비용이 유형과 무관하다: 여기서 멈춘다",
              note: "누구나 같은 방식으로 갖추므로 갖춘 사람과 안 갖춘 사람이 나뉘지 않습니다. 말로 하는 것과 다를 바가 없어집니다.",
            },
            {
              code: "s_min = 해내는 양의 차이 ÷ 못하는 쪽의 단위 비용",
              note: "못하는 쪽이 따라올지 말지가 뒤집히는 자리입니다. 예에서는 6을 4로 나눈 1.5이고, 그보다 큰 요구여야 따라오지 않습니다.",
            },
            {
              code: "if 잘하는 쪽의 순이익 < 섞였을 때의 값: 갈라져도 아무도 낫지 않다",
              note: "잘하는 쪽의 단위 비용을 못하는 쪽의 단위 비용으로 나눈 값이 못하는 쪽의 비율보다 커지면 이 경우가 됩니다. 논문 자신의 수치가 여기입니다.",
            },
            {
              code: "전체 = 섞였을 때의 합 − 표시에 들어간 값",
              note: "표시가 해내는 양을 바꾸지 않는 한 전체는 언제나 줄어듭니다. 갈라내는 값을 치른 만큼입니다.",
            },
            {
              code: "앞 절에서 사라진 몫과 여기서 태운 값을 견준다",
              note: "가려내는 일이 이득인지는 두 숫자의 크기 문제이며, 어느 쪽이 큰지는 시장마다 다릅니다.",
            },
          ]}
          output="이 표시가 유형을 갈라내는지, 갈라낸다면 그 대가가 얼마인지"
        />
      </section>

      <section id="hidden-action" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 4. 계약을 맺은 뒤에 행동이 바뀝니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            지금까지는 계약을 맺기 전부터 한쪽이 숨기고 있는 것이 있었습니다.
            이제 다른 경우를 보겠습니다. 맺을 때는 양쪽이 같은 것을 보고
            있었는데 맺고 나서 한쪽의 행동이 바뀌는 경우입니다.
          </p>

          <p className="leading-7">
            숫자로 두겠습니다. 손해가 100이고, 주의하면 사고 확률이 0.1, 주의를
            안 하면 0.3입니다. 주의하는 데 10이 듭니다.
          </p>

          <p className="leading-7">
            보험이 없으면 계산이 간단합니다. 주의하면 기대 손해 10에 주의 비용
            10을 더해 20이고, 안 하면 30입니다. <strong>주의합니다.</strong>
          </p>

          <p className="leading-7">
            이제 손해를 전부 물어 주는 보험에 들었다고 하겠습니다. 사고가 나도
            본인이 잃는 것이 없으니 본인이 보는 것은 주의 비용 10뿐입니다.{" "}
            <strong>안 하게 됩니다.</strong>
          </p>

          <p className="leading-7">
            그러면 사고 확률이 0.3으로 올라 사회적으로 드는 값이 30이 됩니다.
            보험료도 결국 그만큼이 되므로 본인이 냅니다. 20이면 되던 것이
            30이 되었고 10이 사라졌습니다.
          </p>

          <p className="leading-7">
            여기서 주의할 점이 하나 있습니다. 이것도 거짓말의 문제가 아닙니다.
            보험에 든 사람은 자기 앞의 숫자로 정확히 계산했습니다. 손해가 자기
            장부에서 빠져나갔을 뿐입니다.
          </p>

          <p className="leading-7">
            그래서 되돌리는 방법도 같습니다. 손해의 일부를 본인 장부에 남기면
            됩니다. 자기부담이 60이면 주의할 때 16이고 안 할 때 18이라 다시
            주의합니다.
          </p>

          <p className="leading-7">
            문턱은 50입니다. 그 아래로는 아무리 보험료를 깎아도 주의가 돌아오지
            않습니다. 그런데 자기부담을 50 이상으로 두면{" "}
            <strong>보험이 원래 하려던 일, 그러니까 위험을 덜어 주는 일을 절반
            넘게 못 하게 됩니다.</strong>
          </p>
        </div>

        <ExplainedFormula
          question="자기부담을 얼마나 남겨야 주의가 돌아옵니까?"
          idea="주의할지 말지는 주의해서 아끼는 기대 손해와 주의에 드는 값을 견줘 정해집니다. 그런데 손해의 일부를 남이 물어 주면 아끼는 몫도 그만큼 줄어드니, 남은 몫이 주의 비용을 덮을 만큼 커야 계산이 뒤집힙니다. 그 크기가 주의 비용을 확률 차이로 나눈 값입니다."
          formula={String.raw`p_{1} d + c \le p_{0} d \iff d \ge \frac{c}{p_{0} - p_{1}}`}
          annotatedFormula={String.raw`\underbrace{p_{1} d + c \le p_{0} d}_{\text{주의하는 편이 나은 조건}} \iff \underbrace{d \ge \frac{c}{p_{0} - p_{1}}}_{\text{본인에게 남겨야 하는 몫}}`}
          operations={[
            {
              expression: String.raw`p_{1} d + c`,
              annotation: [
                "주의했을 때 본인이 치를 것으로 보는 값이며, 낮아진 확률로 자기부담을 지는 몫에 주의 비용을 더한 것입니다.",
                "자기부담이 0이면 이 값이 주의 비용 하나만 남습니다. 그래서 전액 보험에서는 주의할 이유가 사라집니다.",
              ],
            },
            {
              expression: String.raw`p_{0} d`,
              annotation: [
                "주의하지 않았을 때 본인이 치를 것으로 보는 값입니다.",
                "여기에도 손해 전액이 아니라 자기부담만 들어갑니다. 나머지는 보험이 물어 주므로 본인의 계산에서 빠집니다.",
              ],
            },
            {
              expression: String.raw`d \ge \frac{c}{p_{0} - p_{1}}`,
              annotation: [
                "두 계산이 뒤집히는 문턱이며, 주의 비용을 주의가 낮추는 확률 폭으로 나눈 것입니다.",
                "주의가 확률을 크게 낮출수록 문턱이 낮아집니다. 주의해도 별 차이가 없는 사고에서는 문턱이 손해 전액을 넘어 어떤 자기부담으로도 되돌릴 수 없게 됩니다.",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`d`,
              name: "본인에게 남기는 몫",
              description:
                "사고가 났을 때 보험이 물어 주지 않고 본인이 지는 금액입니다.",
            },
            {
              symbol: String.raw`c`,
              name: "주의에 드는 값",
              description:
                "시간이든 불편이든 돈이든 주의를 지키는 데 실제로 치르는 것입니다. 예에서는 10입니다.",
            },
            {
              symbol: String.raw`p_{0},\; p_{1}`,
              name: "주의하지 않을 때와 할 때의 사고 확률",
              description: "예에서는 0.3과 0.1이며 그 차이가 문턱을 정합니다.",
            },
          ]}
          assumptions={[
            "주의를 하느냐 마느냐 둘 중 하나로 둡니다. 실제로는 정도가 연속이고, 그러면 자기부담이 클수록 주의가 조금씩 늘어나는 모양이 됩니다.",
            "보험사가 주의했는지를 전혀 볼 수 없다고 둡니다. 볼 수 있으면 자기부담 대신 조건을 걸면 되고, 실제 계약은 그 중간입니다.",
            "본인이 위험 자체를 싫어하는 정도는 세지 않습니다. 그것을 넣으면 자기부담을 늘리는 쪽의 손해가 여기 적은 것보다 커집니다.",
          ]}
          interpretation="손해가 100이고 주의하면 확률이 0.1, 안 하면 0.3이며 주의에 10이 든다고 하겠습니다. 보험이 없으면 주의할 때 20이고 안 할 때 30이라 주의합니다. 손해를 전부 물어 주면 본인이 보는 것이 주의 비용 10뿐이라 안 하게 되고, 사회적으로 드는 값이 20에서 30으로 오릅니다. 문턱은 10을 0.2로 나눈 50이고, 자기부담을 60으로 두면 주의할 때 16, 안 할 때 18이라 다시 주의합니다. 여기서 읽어야 할 것은 이 해법이 공짜가 아니라는 점입니다. 주의를 되살리려면 손해의 절반 이상을 본인에게 남겨야 하고, 그것은 보험이 하려던 일을 절반 넘게 포기한다는 뜻입니다. 읽으면 안 되는 것은 보험에 든 사람이 부도덕하다는 결론입니다. 그 사람은 자기 앞의 숫자로 정확히 계산했고, 달라진 것은 손해가 자기 장부에서 빠져나갔다는 사실뿐입니다."
        />

        <CitationBlock
          source="Kenneth J. Arrow, “Uncertainty and the Welfare Economics of Medical Care”, The American Economic Review, Vol. LIII, No. 5, December 1963, §V.C"
          citeKey={3}
          href="https://www.jstor.org/stable/1812044"
        >
          이 절의 두 이름이 같은 논문 안에 나란히 있습니다. 계약 뒤에 행동이
          바뀌는 쪽에 대해 &ldquo;What is desired in the case of insurance is
          that the event against which insurance is taken be out of the control
          of the individual. Unfortunately, in real life this separation can
          never be made perfectly&rdquo;라고 적고, 불이 나는 확률이 부주의에
          영향을 받는다는 예를 듭니다. 대응책도 같은 문단에 적혀 있습니다.
          &ldquo;Coinsurance provisions have been introduced into many major
          medical policies to meet this contingency as well as the risk aversion
          of the insurance companies.&rdquo; 계약 전에 숨어 있는 쪽에 대해서는
          보험료를 위험별로 나누지 않으면 &ldquo;insurance plans could arise
          which charged lower premiums to preferred risks and draw them off,
          leaving the plan which does not discriminate among risks with only an
          adverse selection of them&rdquo;이라고 적습니다. 세계보건기구가 2004년에
          공개한 전재본으로 이 대목들을 직접 대조했는데, 그 판본은 중간중간
          줄임표로 생략된 발췌본이라 인용한 문단 바깥의 맥락까지는 확인하지
          못했습니다. 이 절의 숫자 예시는 논문의 것이 아닙니다.
        </CitationBlock>

        <ProgressiveDetail
          title="값비싼 형식으로 걸러 내는 일은 법 쪽에도 같은 모양으로 있습니다"
          preview="어떤 약속에 법의 힘을 붙일지를 거르는 요건과 주의 수준을 값으로 유도하는 판정이 그쪽에 정본으로 있습니다."
        >
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p className="leading-7">
              값이 드는 형식을 요구해서 진짜만 남기는 구조는{" "}
              <Link to="/law/private-law/contract-and-enforceable-promise#which-promises">
                법 쪽 글
              </Link>
              에도 있습니다. 모든 약속에 법의 힘을 붙이지 않고 요건을 통과한
              것만 거르는데, 그 요건이 바로 지킬 뜻이 없는 쪽에게 더 부담스러운
              것들입니다.
            </p>

            <p className="leading-7">
              이 절의 자기부담도 법 쪽에 짝이 있습니다.{" "}
              <Link to="/law/private-law/tort-and-accident-cost#how-much-care">
                주의 수준을 정하는 판정
              </Link>
              은 조치 하나를 올릴 때 드는 값과 그 조치가 줄이는 기대 손해를
              견주는데, 여기서 자기부담을 정한 부등식이 같은 비교를 보험 쪽에서
              한 것입니다.
            </p>

            <p className="leading-7">
              다른 점도 분명합니다. 법 쪽은 사고가 난 뒤에 누가 얼마를 무는지를
              정하고, 이 절은 사고가 나기 전에 계약으로 얼마를 남길지를
              정합니다. 같은 숫자를 다른 시점에서 다루는 셈입니다.
            </p>
          </div>
        </ProgressiveDetail>
      </section>

      <section id="boundary" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          가려내는 장치의 값을 세지 않으면 절반만 본 것입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            이 글이 낸 숫자는 두 개입니다. 구별하지 못해서 사라지는 15와 갈라
            내는 데 태우는 2입니다. 두 숫자를 같이 봐야 합니다.
          </p>

          <p className="leading-7">
            논문이 든 장치들도 마찬가지입니다. 보증과 상호와 자격증은 전부 값이 드는 것들이고 그 값을 빼고 나서도 남는 것이 있을 때만 이득입니다.
          </p>

          <p className="leading-7">
            그리고 앞 절에서 본 대로 갈라내는 것이 모두를 낫게 하지는 않습니다. 잘하는 쪽까지 손해를 보는 경우가 있고 논문 자신의 수치가 그 경우입니다.
          </p>

          <p className="leading-7">
            이 글의 숫자에는 전제도 여럿 붙어 있습니다. 산 쪽이 전혀 구별하지
            못한다고 두었는데 실제로는 점검과 이력으로 부분적으로 구별하고,
            표시가 일을 해내는 양을 전혀 바꾸지 않는다고 두었는데 실제 교육은
            그 사이 어딘가입니다.
          </p>

          <p className="leading-7">
            그 사이 어디인지를 재는 일은 이 글이 하지 않았습니다. 자격증이 갈라내기만 하는지 실제로 사람을 낫게도 하는지는 숫자로 가려야 할 문제이고 이 글의 계산은 한쪽 끝을 재어 본
            것입니다.
          </p>

          <p className="leading-7">
            여기까지가 값이 놓치는 것들입니다. 값에 안 적히는 몫, 빼놓을 수 없는 것, 한쪽만 아는 것 세 가지를 차례로 보았습니다. 다음 글은 자리를 옮겨 이 모든 결정을 다 합치면
            무엇이 보이고 무엇이 안 보이는지를 봅니다.
          </p>
        </div>
      </section>
    </div>
  );
}

import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import LorenzCurveViz from "./measuring-the-spread/viz/LorenzCurveViz";
import BowAndAreaViz from "./measuring-the-spread/viz/BowAndAreaViz";

/**
 * 벌어진 정도는 표가 아니라 곡선으로 잽니다
 *
 * 경제 2단계 5편, 노동 2편. contract 1.3의 층위 사다리를 따른다. 입구에서
 * 이름 없이 Lorenz 218쪽의 열 사람 사례를 세우고, 부품 1에서 계급별 표가 왜
 * 답을 못 주는지, 부품 2에서 쌓아 그리는 방법, 부품 3에서 한 숫자로 줄이는
 * 나눗셈, 부품 4에서 그 숫자가 입구의 사례를 어떻게 잘못 세우는지, 부품 5에서
 * 앞 글의 틈과 잇는다. 원자료는 Lorenz(1905)이고 표와 반례는 쪽 이미지로
 * 대조했다.
 */
export default function MeasuringTheSpreadArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          같은 100달러를 열 사람이 나눠 가진 두 경우가 있습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            첫째 경우는 6, 7, 8, 9, 10, 12, 12, 12, 12, 12달러입니다. 둘째
            경우는 8, 8, 8, 8, 8, 8, 8, 14, 14, 16달러입니다. 둘 다 합이
            100달러이고 사람도 열 명으로 같습니다. 어느 쪽이 더 고르게 나뉜
            것입니까.
          </p>

          <p className="leading-7">
            바로 답하기 어렵습니다. 가장 적게 받은 사람은 둘째 경우가 더 많이 받았는데 가장 많이 받은 사람도 둘째 경우가 더
            많이 받았습니다. 아래가 고른 쪽과 위가 고른 쪽이 따로입니다.
          </p>

          <p className="leading-7">
            <strong>
              그러면 벌어진 정도를 어떻게 재야 두 경우를 같은 자 위에 올릴 수
              있습니까.
            </strong>{" "}
            앞 글까지는 임금 하나가 어디서 멈추는지를 셌습니다. 이 글이 다루는 것은 그다음입니다. 그렇게 정해진 몫들을 한자리에
            모아 놓고 전체가 얼마나 벌어져 있는지를 잽니다.
          </p>
        </div>

        <LorenzCurveViz />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            덩어리는 셋입니다. 지금 흔히 쓰는 방식이 왜 답을 주지 못하는지, 대신
            무엇을 그리면 보이는지, 그리고 그 그림을 한 숫자로 줄일 때 무엇을
            얻고 무엇을 잃는지입니다. 마지막에 그 벌어짐이 어디서 생기는지를 앞
            글과 잇습니다.
          </p>

          <p className="leading-7">
            <em>
              여기까지가 이 글의 질문입니다 — 두 분배를 견주려면 무엇을 봐야 하는가입니다.
            </em>
          </p>
        </div>
      </section>

      <section id="why-tables-fail" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 1. 계급별 표로는 벌어졌는지 좁아졌는지 알 수 없습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            가장 익숙한 방식은 소득을 구간으로 나누고 각 구간에 사람이 몇 명인지 세는 것입니다. 가운데 구간의 사람이 늘면
            고르게 퍼졌다고 읽습니다. 1905년에 Lorenz가 든 영국 자료가 그 예입니다. 1877년과 1886년 사이에
            150~500파운드 구간은 21.4% 늘었고 500~1,000파운드 구간은 그대로이며 1,000~5,000파운드는
            2.5%, 5,000파운드 초과는 2.3% 줄었습니다.
          </p>

          <p className="leading-7">
            줄어든 쪽이 위 구간이니 고르게 퍼진 것처럼 보입니다. 그런데 이 표는
            답을 줄 수 없습니다. 위 구간의 <strong>사람 수</strong>가 줄었다는
            것만 적혀 있고 그들이 받은 <strong>몫</strong>이 어떻게 됐는지는
            적혀 있지 않기 때문입니다. 사람은 줄었는데 그 적은 사람이 전체에서
            차지하는 몫은 오히려 커졌을 수 있습니다.
          </p>

          <p className="leading-7">
            이것이 이 글 전체의 출발점입니다. 세는 단위를 사람에서{" "}
            <strong>사람과 몫 둘 다</strong>로 바꿔야 합니다. 한쪽만 세면 어느
            방향으로 움직였는지가 원리적으로 결정되지 않습니다.
          </p>
        </div>

        <CitationBlock
          source="M. O. Lorenz, “Methods of Measuring the Concentration of Wealth,” Publications of the American Statistical Association, Vol. 9, No. 70 (June 1905), pp. 209–219"
          citeKey={1}
          href="https://archive.org/details/jstor-2276207"
        >
          210쪽의 문장이 이 부품의 전부입니다 — “It is impossible to tell from
          such a table whether there has been a concentration or diffusion of
          wealth because it might be true that the incomes over five thousand
          pounds, although a smaller proportion of the total number in the
          second epoch, nevertheless constitute a much larger proportion of the
          total income.” 영국 소득세 자료의 네 구간과 증감률도 같은 쪽의 표에서
          그대로 옮긴 것입니다. 209쪽에서 글의 목적을 “at what point a community
          is to be placed between the two extremes, — equality, on the one hand,
          and the ownership of all wealth by one individual on the other”로
          적습니다. JSTOR Early Journal Content 공개본을 내려받아 읽었고, 인용과
          표는 해당 쪽 이미지를 직접 열어 대조했습니다.
        </CitationBlock>

        <TermBreakdown
          title="같은 자료, 무엇을 세느냐"
          description="세는 단위가 하나인지 둘인지가 답을 줄 수 있는지를 가릅니다."
          items={[
            {
              term: "구간별 사람 수만 센다",
              description:
                "소득을 구간으로 나누고 각 구간에 몇 명인지만 적습니다.",
              example:
                "위 구간의 사람이 2.3% 줄었습니다. 고르게 퍼진 것처럼 보입니다.",
              boundary:
                "그 사람들이 가진 몫이 커졌는지 작아졌는지가 표에 없어, 방향이 결정되지 않습니다.",
            },
            {
              term: "사람과 몫을 함께 센다",
              description:
                "가난한 쪽부터 사람을 쌓으면서 그들이 가진 몫도 함께 쌓습니다.",
              example:
                "아래 70%가 전체의 41%를 가졌다가 아래 60%가 32%를 가지게 되었습니다.",
              boundary:
                "구간을 어떻게 끊든 결과가 같아야 하므로, 구간이 아니라 누적으로 읽어야 합니다.",
            },
          ]}
        />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            <em>
              무엇을 세야 하는지는 이제 정해졌습니다. 그 둘을 어떻게 한 그림에 올리는지가 다음 부품입니다.
            </em>
          </p>
        </div>
      </section>

      <section id="cumulate-and-draw" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 2. 가난한 쪽부터 쌓아서 그리면 보입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            Lorenz가 제안한 방법은 두 줄입니다. 한 축에 가난한 쪽부터 쌓은 사람의 비율을 두고 다른 축에 그 사람들이 가진
            몫의 비율을 둡니다. 그러면 점 하나가 "아래 몇 퍼센트가 전체의 몇 퍼센트를 가졌는가"를 말합니다.
          </p>

          <p className="leading-7">
            똑같이 나눠 가진 경우를 먼저 그려 보십시오. 왜 이 방법이 되는지가 거기서 보입니다. 아래 1%가 전체의 1%를,
            아래 2%가 2%를 가지므로 점이 전부 대각선 위에 놓입니다. 평균 재산이 얼마든 사람이 몇 명이든 똑같이 나누기만
            하면 직선은 그대로입니다. <strong>크기가 지워집니다.</strong>
          </p>
        </div>

        <BowAndAreaViz />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            가로에 사람의 누적 비율, 세로에 몫의 누적 비율을 두는 지금의 관례에서는
            고르지 않게 나뉘면 선이 그 아래로 처집니다. 그런데 시작점과 끝점은
            바뀌지 않습니다. 아무도 가지지 않은 상태에서 시작하고 전부 더하면
            100%가 되는 것은 어떤 분배에서나 같기 때문입니다. 그래서 두 분배의
            차이는 오직 <strong>가운데가 얼마나 처졌는지</strong>에만 남습니다.
            Lorenz는 이 읽는 규칙을 활에 빗대 적었습니다 — 활이 휠수록 쏠린
            것입니다.
          </p>

          <p className="leading-7">위 그림의 두 번째 장면은 그가 쓴 자료(214쪽 표)를 지금의 관례대로 다시 그린 것입니다. 프로이센에서 1892년에는 아래 70.1%가 전체 소득의
            41.2%를 가졌는데 1901년에는 아래 60.5%가 31.7%를 가졌습니다. 1901년 선이 1892년 선보다 아래에
            놓입니다. 그래서 더 쏠렸다고 읽습니다.</p>
          <p className="leading-7">Lorenz 자신의 218쪽 그림은 세로축이 사람 수의 비율(Percents of Number),
            가로축이 소득의 비율(Percents of Total Income)로 지금과 두 축이 바뀌어 있어 같은 곡선이 대각선 위쪽으로 휩니다.
            217쪽 본문은 어느 축에 무엇을 놓을지 정하지 않았으므로, 축을 바꿔도 활이 더 휠수록 더 쏠렸다는 읽기 규칙은 같습니다.</p>
        </div>

        <CitationBlock
          source="Lorenz (1905), 214쪽 표 · 217–218쪽"
          citeKey={2}
          href="https://archive.org/details/jstor-2276207"
        >
          방법의 원문은 217쪽입니다 — “Plot along one axis cumulated per cents,
          of the population from poorest to richest, and along the other the per
          cent, of the total wealth held by these per cents, of the
          population.” 이어서 “With an unequal distribution, the curves will
          always begin and end in the same points as with an equal
          distribution, but they will be bent in the middle; and the rule of
          interpretation will be, as the bow is bent, concentration increases”로
          읽는 규칙을 적습니다. 프로이센 수치는 214쪽 표의 여섯 계급을 가난한
          쪽부터 쌓은 것이고, 218쪽에서 “It is evident at a glance that the
          figures for 1901 show a greater concentration than those for 1892”로
          판정합니다. 표와 두 문장 모두 쪽 이미지로 대조했습니다.
        </CitationBlock>
      </section>

      <section id="one-number" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 3. 휜 정도를 한 숫자로 줄입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            곡선은 눈으로 견주기에는 좋지만 여러 나라와 여러 해를 줄 세우기에는 불편합니다. 휜 정도를 숫자 하나로 바꾸고
            싶어집니다. 가장 곧은 방법은 대각선과 곡선 사이의 넓이를 재는 것인데 그 넓이는 그림을 크게 그리면 같이 커지므로
            그대로 쓸 수 없습니다. 삼각형 전체 넓이로 나누면 그 문제가 사라집니다.
          </p>
        </div>

        <ExplainedFormula
          question="휜 정도를 그림 크기와 무관한 한 숫자로 어떻게 바꿉니까"
          idea={
            <>
              대각선과 곡선 사이의 넓이를 대각선 아래 삼각형 넓이로 나눕니다.
              분모와 분자가 같은 비율로 커지므로{" "}
              <strong>그림을 키워도 값이 변하지 않습니다.</strong> 똑같이 나누면
              0이고, 한 사람이 다 가지는 쪽으로 갈수록 1에 가까워집니다.
            </>
          }
          formula={String.raw`G \;=\; \frac{A}{A + B}`}
          annotatedFormula={String.raw`G \;=\; \frac{\underbrace{A}_{\text{대각선과 곡선 사이}}}{\underbrace{A + B}_{\text{대각선 아래 삼각형 전체}}}`}
          operations={[
            {
              expression: String.raw`A + B = \tfrac{1}{2}`,
              annotation: [
                "가로·세로를 비율로 두면 삼각형 넓이는 늘 1/2",
                "그래서 분모가 고정됩니다",
              ],
            },
            {
              expression: String.raw`B = \int_0^1 L(p)\,dp`,
              annotation: [
                "곡선 아래 넓이",
                "아래 p만큼의 사람이 가진 몫을 전 구간에 걸쳐 더한 것입니다",
              ],
            },
            {
              expression: String.raw`G = 1 - 2\int_0^1 L(p)\,dp`,
              annotation: [
                "위 둘을 넣어 정리한 꼴",
                "곡선만 있으면 바로 계산됩니다",
              ],
            },
          ]}
          terms={[
            {
              symbol: "L(p)",
              name: "쌓은 몫의 곡선",
              description:
                "가난한 쪽부터 센 사람의 비율 p에 대해 그들이 가진 몫의 비율입니다. L(0)=0, L(1)=1입니다.",
            },
            {
              symbol: "A",
              name: "대각선과 곡선 사이의 넓이",
              description: "활이 휜 만큼입니다. 똑같이 나누면 0이 됩니다.",
            },
            {
              symbol: "B",
              name: "곡선 아래의 넓이",
              description:
                "A와 더하면 대각선 아래 삼각형이 되어, 비율로 두면 늘 1/2입니다.",
            },
          ]}
          interpretation="이 숫자는 곡선이 대각선에서 평균적으로 얼마나 떨어져 있는지를 말합니다. 어느 구간에서 떨어졌는지는 말하지 않으며, 그 차이가 다음 부품의 내용입니다."
          assumptions={[
            "사람을 가난한 쪽부터 줄 세울 수 있다고 둡니다. 같은 값을 가진 사람이 많아도 순서만 정해지면 됩니다.",
            "몫이 음수가 아니라고 둡니다. 빚이 있어 음수인 자료에서는 곡선이 0 아래로 내려가 이 비율이 1을 넘을 수 있습니다.",
            "구간이 굵은 자료에서는 구간 안이 고르다고 가정하고 직선으로 잇습니다. 실제보다 덜 휘게 나오므로 이 값은 아래로 치우칩니다.",
          ]}
        />

        <AlgorithmBlock
          title="자료에서 이 숫자를 구하는 절차"
          input={[
            "사람을 가난한 쪽부터 줄 세운 몫의 목록",
            "또는 계급별 (사람 %, 몫 %) 표",
          ]}
          steps={[
            {
              code: "가난한 쪽부터 사람과 몫을 각각 누적한다",
              note: "두 누적 비율의 쌍이 곡선의 점이 됩니다. 마지막 점은 반드시 (100, 100)입니다.",
            },
            {
              code: "이웃한 두 점을 직선으로 이어 사다리꼴 넓이를 더한다 → B",
              note: "구간이 굵으면 이 직선이 실제 곡선보다 위에 있어 B가 커지고, 따라서 결과가 작게 나옵니다.",
            },
            {
              code: "G = 1 − B ÷ (삼각형 넓이)",
              note: "가로·세로를 0~100으로 두면 삼각형 넓이는 5,000입니다. 비율로 두면 1/2입니다.",
            },
          ]}
          output="0과 1 사이의 한 숫자 — 프로이센 1892년 0.357, 1901년 0.394"
        />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">여기서 경계를 하나 분명히 해야 합니다. 이 나눗셈은{" "}
            <strong>Lorenz의 1905년 글에 없습니다.</strong> 그는 곡선을 그리는
            방법과 읽는 규칙까지만 적었고 넓이를 재어 한 숫자로 바꾸는 일은 이후의 작업입니다. 위 식은 그의 곡선에서 이 글이
            이어 적은 것이고 프로이센의 0.357과 0.394도 그의 표를 이 글이 계산한 값입니다.</p>
          <p className="leading-7">이 넓이 비가 통계표에서
            지니계수(Gini coefficient)라고 부르는 값입니다. 이탈리아 통계학자 Corrado Gini가 1912년에 평균차를 이용한 계산식을 내놓았고,
            1914년 논문에서 Lorenz 곡선과 균등선 사이 넓이를 삼각형 넓이로 나눈 비가 자신의 집중비 R이 다가가는 극한값임을 보였습니다.</p>

          <p className="leading-7">
            <em>
              두 분배를 숫자 하나로 줄 세울 수 있게 됐습니다. 그런데 입구의 두 경우를 이 숫자로 세워 보면 문제가 드러납니다.
            </em>
          </p>
        </div>
      </section>

      <section id="what-one-number-loses" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 4. 그 한 숫자가 못 보는 것이 입구의 두 경우입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            입구의 열 사람으로 돌아갑니다. 첫째 경우를 가난한 쪽부터 쌓으면 6, 13, 21, 30, 40, 52, 64,
            76, 88, 100입니다. 둘째 경우는 8, 16, 24, 32, 40, 48, 56, 70, 84, 100입니다.
            다섯 번째에서 둘 다 40으로 같아지고 그 앞뒤로 큰 쪽이 바뀝니다.
          </p>

          <p className="leading-7">
            아래 절반까지는 둘째 경우가 더 많이 받았습니다. 가장 가난한 사람이 6달러가 아니라 8달러를 받기 때문입니다. 위
            절반으로 가면 첫째 경우가 앞섭니다. 둘째 경우의 위쪽 셋이 14, 14, 16으로 몰려 있는 탓입니다. <strong>두 곡선이 가운데에서 엇갈립니다.</strong>
          </p>

          <p className="leading-7">
            이 상태에서 넓이 비를 계산하면 첫째가 0.120, 둘째가 0.144로
            나옵니다. 숫자만 보면 둘째가 더 쏠렸다는 답이 나오지만 아래 절반에 있는 사람에게는 둘째가 더 나은 분배입니다. 한 숫자는 두 곡선이
            대각선에서 평균적으로 얼마나 떨어졌는지만 말하고{" "}
            <strong>어디서 떨어졌는지는 말하지 않습니다.</strong>
          </p>

          <p className="leading-7">
            이 반례는 제가 만든 것이 아닙니다. Lorenz가 곡선을 제안한 바로 그 글에서 직접 든 것입니다. 그는 이런
            경우에도 그림은 무슨 일이 있었는지 를 말해 준다고 적었습니다. 곡선을 숫자로 줄이면 바로 그 정보가 사라집니다.
          </p>
        </div>

        <CitationBlock
          source="Lorenz (1905), 218쪽"
          citeKey={3}
          href="https://archive.org/details/jstor-2276207"
        >
          원문은 “The curves may not always give so clear an answer as in the
          previous illustration, because opposing tendencies may exist at the
          same time, but the diagram will always tell what has happened”이고,
          바로 아래에 “the distribution of $100 among a group of ten persons at
          two epochs”로 두 줄의 숫자를 싣습니다. Case I은 6 7 8 9 10 12 12 12
          12 12, Case II는 8 8 8 8 8 8 8 14 14 16입니다. 이 숫자들은 쪽 이미지를
          직접 열어 읽었습니다. 0.120과 0.144는 원문에 없고 이 글이 그 숫자로
          계산한 값입니다.
        </CitationBlock>

        <ProgressiveDetail
          title="그러면 한 숫자를 쓰면 안 됩니까"
          preview="쓰되 무엇을 묻고 있는지에 따라 답이 달라집니다. 줄 세우기에는 쓸 수 있고, 어느 쪽이 나은지를 묻는 데에는 부족합니다."
        >
          <p className="leading-7">
            곡선이 엇갈리지 않고 한쪽이 다른 쪽보다 전 구간에서 아래에 있으면 넓이 비의 순서와 곡선의 순서가 일치합니다.
            프로이센의 두 해가 그런 경우입니다. 엇갈릴 때만 순서가 깨지므로 숫자를 쓰기 전에 곡선이 엇갈리는지 보는 것이
            순서입니다.
          </p>
          <p className="leading-7">
            또 같은 곡선에서 다른 숫자를 뽑을 수도 있습니다. 아래 절반이 가진 몫만 보거나 위 1%가 가진 몫만 보는 식입니다.
            어느 구간을 보느냐가 곧 무엇을 묻느냐입니다. 넓이 비는 그중 전 구간을 고르게 섞은 하나일 뿐입니다. 1단계의{" "}
            <Link to="/economics/prices/surplus-and-efficiency">
              효율은 공정함이 아니다
            </Link>
            와 같은 자리입니다 — 재는 것과 판단하는 것은 다른 단계입니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="where-the-spread-comes-from" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 5. 벌어지는 자리는 앞 글의 틈이 사람마다 다른 자리입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            재는 방법까지 왔으니 이제 그 벌어짐이 어디서 생기는지를 물을 수
            있습니다. 앞 글에서 임금은 그 사람이 더 만들어 파는 몫과 같아지거나 사는 쪽이 하나면 그보다 낮은 자리에서 멈췄습니다. 그리고 낮아지는
            폭은 <strong>그 사람이 옮겨 갈 자리가 얼마나 있는지</strong>로
            정해졌습니다.
          </p>

          <p className="leading-7">
            여기서 한 걸음만 더 가면 됩니다. 옮겨 갈 자리의 수는 사람마다 같지 않습니다. 같은 도시 안에서도 자격이 여러
            곳에서 통하는 사람은 옮길 데가 많고 기술이 한 공장에서만 쓰이는 사람은 옮길 데가 적습니다. 앞 글의 식에서 민감도가
            사람마다 다르다는 뜻입니다. 그러면 같은 몫을 만들어 내는 두 사람이 다른 임금을 받습니다.
          </p>

          <p className="leading-7">
            그래서 벌어짐에는 적어도 두 갈래가 섞여 있습니다. 하나는 더 만들어 파는 몫 자체가 다른 데서 옵니다. 나머지 하나는
            같은 몫을 만들어도 옮길 자리가 적어 덜 받는 데서 옵니다. 곡선은 둘을 합한 결과만 보여 주고 어느 쪽이 얼마인지는
            가르지 못합니다. 그 가르는 일은 이 글의 범위를 넘습니다.
          </p>

          <p className="leading-7">
            <em>
              이 글의 답은 여기서 끝납니다. 벌어진 정도는 사람과 몫을 함께 쌓아 그린 곡선으로 재고 한 숫자로 줄일 수는 있으나
              곡선이 엇갈리는 자리에서는 그 숫자를 믿을 수 없습니다.
            </em>
          </p>
        </div>
      </section>

      <section id="handoff" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          다섯 편으로 조직과 사람까지 왔습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            2단계는 1단계가 값에 맡겨 두었던 자리를 하나씩 열었습니다. 값을 쓰는 것이 비싸면 지시가 대신하고 그 안에서 값이
            내려가는 것은 커져서가 아니라 돌아가는 방법이 열려서입니다. 파는 쪽이 하나면 값을 고르게 되고 사는 쪽이 하나면
            임금이 그 몫 아래에 남습니다. 그리고 그렇게 정해진 몫들을 모아 놓으면 벌어진 정도를 곡선으로 잴 수 있습니다.
          </p>

          <p className="leading-7">
            다음 묶음은 한 사람과 한 가게의 이야기를 벗어납니다. 여기까지는 누가 무엇을 얼마에 주고받는지였는데 그것들을 전부
            더한 숫자가 따로 움직이는 자리가 있습니다. 1단계의 마지막 글에서 한 번 건드렸던 자리입니다. 거기서
            성장·물가·실업·바깥과의 거래를 차례로 셉니다.
          </p>

          <h3 className="mt-10 mb-4 text-lg font-bold">
            읽고 나서 맞춰 볼 질문
          </h3>

          <p className="leading-7">
            1. 어떤 나라에서 상위 1%의 사람 수 비중이 줄었다는 발표가
            나왔습니다. 이것만으로 쏠림이 줄었다고 읽으면 안 되는 이유를 한
            문장으로 말해 보십시오. <strong>(답: 부품 1절)</strong>
          </p>

          <p className="leading-7">
            2. 어떤 분배의 곡선이 다른 분배의 곡선보다 모든 지점에서 아래에
            있습니다. 이때 넓이 비의 순서를 믿어도 됩니까.{" "}
            <strong>(답: 부품 4절)</strong>
          </p>

          <p className="leading-7">
            3. 같은 일을 하고 같은 몫을 만들어 내는데 임금이 다른 두 사람이 있습니다. 앞 글의 식으로 이 경우를 설명해
            보십시오.{" "}
            <strong>(답: 부품 5절)</strong>
          </p>
        </div>

        <ContentBoundary article="measuring-the-spread" />
      </section>
    </div>
  );
}

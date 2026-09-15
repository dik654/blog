import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import VerticalSumViz from "./public-goods-and-commons/viz/VerticalSumViz";
import CommonsEntryViz from "./public-goods-and-commons/viz/CommonsEntryViz";

/**
 * 빼놓을 수 없으면 아무도 내지 않고, 줄어드는 것이면 너무 빨리 씁니다
 *
 * 경제 시리즈 7편. 6편은 피해를 입는 쪽을 특정할 수 있었고 그래서 값을
 * 얹거나 권리를 정해 협상시킬 수 있었다. 여기서는 관련된 사람이 전부이거나
 * 누구인지 알 수 없어 두 길이 모두 막히는 경우를 다룬다. 배제성과 경합성의
 * 정의는 정치 쪽 글이 정본이므로 다시 세우지 않고, 이 글은 수량과 값에만
 * 집중한다.
 */
export default function PublicGoodsAndCommonsArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          앞 글의 두 길이 모두 닫히는 경우가 있습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            앞 글에서는 매연을 마신 사람이 누구인지 알 수 있었습니다. 그래서 그
            사람에게 권리를 주고 협상시킬 수도 있었고, 피해액을 재어 값에 얹을
            수도 있었습니다.
          </p>

          <p className="leading-7">
            그런데 가로등을 생각해 보겠습니다. 불을 켜면 그 길을 지나는 모두가
            혜택을 봅니다. 돈을 내지 않은 사람만 어둠 속에 두는 방법이
            없습니다.
          </p>

          <p className="leading-7">
            이때는 앞 글의 구도가 통째로 어그러집니다. 피해를 입는 제삼자가 한
            명이 아니라 전부이고, 그 전부와 따로따로 협상할 수도 없습니다.
          </p>
        </div>

        <VerticalSumViz />

        <ContentBoundary article="public-goods-and-commons" />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            이 글이 푸는 질문은 하나입니다.{" "}
            <strong>
              빼놓을 수 없는 것에서는 얼마를 만드는 것이 맞고, 값은 그 수량에서
              얼마나 어긋나는가
            </strong>
            입니다.
          </p>

          <p className="leading-7">
            순서는 이렇습니다. 먼저 한 사람이 더 누려도 줄지 않는 것에서 값을
            어떻게 더해야 하는지를 보고, 그 값을 물어보면 왜 참말이 나오지
            않는지를 봅니다. 그다음 줄어드는 것에서는 어긋남이 반대 방향으로
            생긴다는 것을 보고, 마지막으로 빼놓을 수 있게 되면 무엇이 풀리고
            무엇이 안 풀리는지를 봅니다.
          </p>

          <p className="leading-7">
            빼놓을 수 있느냐와 줄어드느냐로 네 칸을 가르는 일 자체는 정치 쪽
            글이 먼저 했습니다. 여기서는 그 분류를 가져다 쓰고, 각 칸에서
            수량이 얼마나 어긋나는지만 셉니다.
          </p>
        </div>
      </section>

      <section id="vertical-sum" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 1. 한 사람이 더 누려도 줄지 않으면 값을 세로로 더합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            앞 네 글에서 사려는 줄을 만들 때는 사람들을 옆으로 세웠습니다. 값이
            7이면 7까지 낼 수 있는 사람이 몇 명인지 세었고, 그 수가 팔리는
            개수였습니다.
          </p>

          <p className="leading-7">
            그렇게 세울 수 있었던 것은 한 개를 한 사람이 가져가면 다음 사람은
            다른 한 개를 가져가야 했기 때문입니다. 빵 하나는 한 사람만 먹습니다.
          </p>

          <p className="leading-7">
            가로등은 다릅니다. 한 개를 세우면 가도 보고 나도 보고 다도 봅니다.
            가가 본다고 해서 나의 몫이 줄지 않습니다. 그러니 한 개의 값은 한
            사람의 값이 아니라 <strong>셋의 값을 합친 것</strong>입니다.
          </p>

          <p className="leading-7">
            숫자로 보겠습니다. 가로등을 한 개씩 늘릴 때 가가 더 얻는 값이 6, 5,
            4, 3이고 나는 4, 3, 2, 1, 다는 2, 2, 1, 1입니다. 세로로 더하면 12,
            10, 7, 5입니다.
          </p>

          <p className="leading-7">
            드는 값이 한 개당 9라고 하겠습니다. 첫째는 12와 9라 남고, 둘째는
            10과 9라 아슬아슬하게 남고, 셋째는 7과 9라 밑집니다.{" "}
            <strong>두 개가 맞습니다.</strong>
          </p>

          <p className="leading-7">
            그런데 각자에게 맡기면 어떻게 됩니까. 가 혼자 세우려면 6을 얻자고
            9를 써야 합니다. 나도 다도 마찬가지입니다.{" "}
            <strong>한 개도 만들어지지 않습니다.</strong>
          </p>

          <p className="leading-7">
            어긋남의 방향이 앞 글과 반대입니다. 앞 글에서는 장부에 안 적히는
            비용이 있어 더 만들어졌는데, 여기서는 장부에 안 적히는 이득이 있어
            덜 만들어집니다. 정확히는 하나도 안 만들어집니다.
          </p>
        </div>

        <ExplainedFormula
          question="한 개를 여럿이 같이 누리면 몇 개를 만드는 것이 맞습니까?"
          idea="한 개를 한 사람만 쓰는 것이라면 그 한 개가 남는지는 한 사람의 값으로 판정합니다. 한 개를 여럿이 동시에 누린다면 그 한 개가 만들어 내는 값은 모두의 값을 합친 것이므로 판정에도 합을 넣어야 합니다. 같은 사람들, 같은 값인데 더하는 방향만 달라집니다."
          formula={String.raw`Q^{*} = \max\{Q : v_{Q} \ge c_{Q}\}, \qquad q^{*} = \max\Big\{q : \sum_{i=1}^{n} v_{i}(q) \ge c(q)\Big\}`}
          annotatedFormula={String.raw`\underbrace{Q^{*} = \max\{Q : v_{Q} \ge c_{Q}\}}_{\text{한 사람만 쓰는 것}}, \qquad \underbrace{q^{*} = \max\Big\{q : \textstyle\sum_{i} v_{i}(q) \ge c(q)\Big\}}_{\text{여럿이 같이 누리는 것}}`}
          operations={[
            {
              expression: String.raw`v_{Q} \ge c_{Q}`,
              annotation: [
                "앞 네 글이 쓰던 판정이며 한 사람의 값과 한 개의 값을 견줍니다.",
                "이 판정이 옳으려면 그 한 개를 그 한 사람만 쓴다는 것이 전제입니다. 사려는 줄을 옆으로 세운 것이 이 전제의 그림입니다.",
              ],
            },
            {
              expression: String.raw`\sum_{i=1}^{n} v_{i}(q)`,
              annotation: [
                "q번째 한 개에 대해 n명이 각각 더 얻는 값을 전부 더한 것입니다.",
                "여기서 n은 값을 내는 사람이 아니라 누리는 사람의 수입니다. 내지 않은 사람을 빼놓을 수 없으니 둘이 갈라집니다.",
              ],
            },
            {
              expression: String.raw`\sum_{i=1}^{n} v_{i}(q) \ge c(q)`,
              annotation: [
                "합이 드는 값을 넘는 동안 한 개씩 더 만드는 것이 맞습니다.",
                "각자의 값은 전부 드는 값보다 작은데 합은 넘을 수 있습니다. 그 구간이 바로 아무도 혼자서는 만들지 않지만 만드는 것이 맞는 구간입니다.",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`v_{i}(q)`,
              name: "i번째 사람이 q번째 한 개에서 더 얻는 값",
              description:
                "가로등 예에서 가의 6, 5, 4, 3이 이것입니다. 개수가 늘수록 줄어든다고 둡니다.",
            },
            {
              symbol: String.raw`c(q)`,
              name: "q번째 한 개를 만드는 데 드는 값",
              description: "예에서는 개수와 무관하게 9로 두었습니다.",
            },
            {
              symbol: String.raw`n`,
              name: "누리는 사람의 수",
              description:
                "값을 낸 사람이 아니라 실제로 누리는 사람의 수입니다. 빼놓을 수 없으면 이 둘이 달라집니다.",
            },
          ]}
          assumptions={[
            "한 사람이 더 누려도 남의 몫이 전혀 줄지 않는다고 둡니다. 실제로는 길이 붐비면 줄어들고, 그 경우가 세 번째 부품의 주제입니다.",
            "각자의 값을 숫자로 알고 있다고 둡니다. 이 전제가 다음 절에서 통째로 깨집니다.",
            "값을 더할 수 있다고 둡니다. 사람마다 돈 한 단위의 무게가 다르면 이 합이 무엇을 뜻하는지가 별도의 문제가 됩니다.",
          ]}
          interpretation="가로등을 한 개씩 늘릴 때 가가 더 얻는 값이 6, 5, 4, 3이고 나는 4, 3, 2, 1, 다는 2, 2, 1, 1이며 한 개에 9가 든다고 하겠습니다. 세로로 더한 값이 12, 10, 7, 5이므로 드는 값과의 차이가 +3, +1, −2, −4이고 둘째까지가 봉우리입니다. 두 개를 세우면 셋이 합쳐 22를 얻고 18을 쓰니 4가 남습니다. 그런데 각자에게 맡기면 첫 개의 값이 가에게 6, 나에게 4, 다에게 2라 아무도 9를 내지 않습니다. 여기서 읽어야 할 것은 어긋남의 크기가 아니라 방향입니다. 만들어져야 할 것이 하나도 만들어지지 않으므로, 앞 글처럼 조금 더 만들어지는 것과는 종류가 다른 실패입니다. 읽으면 안 되는 것은 합이 크면 무조건 만들어야 한다는 결론입니다. 셋째와 넷째는 합이 드는 값에 못 미치므로, 같이 쓰는 것이라고 해서 많을수록 좋은 것은 아닙니다."
        />

        <CitationBlock
          source="Paul A. Samuelson, “The Pure Theory of Public Expenditure”, The Review of Economics and Statistics, Vol. 36, No. 4, November 1954, pp. 387–389"
          citeKey={1}
          href="https://www.jstor.org/stable/1925895"
        >
          같이 누리는 재화를 &ldquo;collective consumption goods&rdquo;로 정의하고
          그 성질을 &ldquo;each individual&rsquo;s consumption of such a good leads
          to no subtraction from any other individual&rsquo;s consumption of that
          good&rdquo;이라고 적습니다. 더하는 방향에 대해서도 명시합니다.
          &ldquo;A graphical interpretation of these conditions in terms of
          vertical rather than horizontal addition of different individuals&rsquo;
          marginal-rate-of-substitution schedules can be given.&rdquo; 논문의
          조건식은 한계대체율의 합이 한계변환율과 같아진다는 형태이고, 이 절의
          부등식은 그것을 개수를 하나씩 늘리는 이산 형태로 옮긴 것입니다. 1954년
          11월호 원문 세 쪽을 내려받아 이 문장들과 아래 절에서 인용하는 대목을
          직접 대조했습니다. 값을 더할 수 있다고 둔 전제와 그 합이 누구의 기준이
          되어야 하는지는 논문이 사회후생함수로 따로 다루며, 이 글의 범위 밖
          입니다.
        </CitationBlock>
      </section>

      <section id="revelation" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 2. 얼마나 원하는지 물어보면 참말할 이유가 없습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            앞 절의 계산에는 각자의 값을 알고 있다는 전제가 있었습니다. 그
            숫자는 어디서 옵니까. 물어보는 수밖에 없습니다.
          </p>

          <p className="leading-7">
            그런데 물어보는 순간 그 답이 무엇에 쓰이는지를 대답하는 사람도
            압니다. 그러면 답은 자기 값이 아니라 자기에게 유리한 쪽으로
            기웁니다.
          </p>

          <p className="leading-7">
            어느 쪽으로 기우는지는 걷는 방식이 정합니다. 두 가지를 견줘
            보겠습니다.
          </p>

          <p className="leading-7">
            먼저 <strong>신고한 만큼 걷는</strong> 방식입니다. 둘째 가로등에서
            참값이 가 5, 나 3, 다 2이고 합이 10이라 9보다 큽니다. 세우는 것이
            맞습니다.
          </p>

          <p className="leading-7">
            그런데 참말하면 각자 자기가 말한 만큼 내고 그만큼 받으므로 남는
            것이 정확히 0입니다. 가가 4라고 줄여 말하면 합이 9라 여전히
            세워지는데 4만 내고 5를 얻어 1이 남습니다.
          </p>

          <p className="leading-7">
            그래서 줄여 말할 이유가 생깁니다. 셋이 다 1씩 줄이면 합이 7이 되어
            세워지지 않습니다. <strong>세우는 것이 맞는데 안 세워집니다.</strong>
          </p>

          <p className="leading-7">
            이번에는 <strong>신고와 무관하게 똑같이 나눠 걷는</strong> 방식을
            보겠습니다. 셋째 가로등에서 참값이 가 4, 나 2, 다 1이고 합이 7이라
            9에 못 미칩니다. 세우면 안 됩니다.
          </p>

          <p className="leading-7">
            그런데 셋이 3씩 나눠 낸다면 가는 3을 내고 4를 얻습니다. 가에게는
            세워지는 편이 낫습니다. 가가 6이라고 부풀리면 합이 9가 되어
            세워집니다.
          </p>

          <p className="leading-7">
            가는 1을 얻지만 나는 1을, 다는 2를 잃습니다. 합치면 2를
            깎아먹습니다. <strong>세우면 안 되는데 세워집니다.</strong>
          </p>

          <p className="leading-7">
            방향이 정반대인데 원인은 같습니다. 신고가 부담을 늘리면 줄여 말하고,
            신고가 부담을 늘리지 않으면 부풀려 말합니다. 그리고 부담을 신고와
            어떻게 엮든 둘 중 한쪽은 남습니다.
          </p>
        </div>

        <CitationBlock
          source="Paul A. Samuelson, “The Pure Theory of Public Expenditure”, 1954, §3 Impossibility of decentralized spontaneous solution"
          citeKey={2}
          href="https://www.jstor.org/stable/1925895"
        >
          논문이 절 제목으로 못박은 결론입니다. &ldquo;However no decentralized
          pricing system can serve to determine optimally these levels of
          collective consumption.&rdquo; 이유로 드는 것이 바로 이 절의 첫 번째
          방식입니다. &ldquo;now it is in the selfish interest of each person to
          give false signals, to pretend to have less interest in a given
          collective consumption activity than he really has&rdquo;라고 적고,
          혜택에 따라 물리는 세금으로도 이 계산 문제를 사적 재화처럼 분권적으로는
          풀 수 없다고 덧붙입니다. 주의할 점이 하나 있습니다. 논문이 이름 붙인
          방향은 <em>줄여 말하는</em> 쪽 하나이고, 이 절의 두 번째 방식에서
          나오는 부풀리는 방향은 논문의 문장이 아니라 부담을 신고에서 떼어
          놓았을 때 같은 계산을 다시 해서 얻은 것입니다. 논문이 남긴 한 줄도
          그대로 옮겨 둡니다. &ldquo;The solution &lsquo;exists&rsquo;; the
          problem is how to &lsquo;find&rsquo; it.&rdquo;
        </CitationBlock>

        <TermBreakdown
          title="걷는 방식이 거짓말의 방향을 정합니다"
          description="같은 사람과 같은 값인데 부담을 신고에 어떻게 엮느냐에 따라 기우는 쪽이 반대가 됩니다."
          items={[
            {
              term: "신고한 만큼 걷는다",
              description:
                "말한 값이 곧 자기 부담이므로 참말하면 남는 것이 없습니다.",
              example:
                "둘째 가로등에서 참값 5, 3, 2는 합이 10이라 세우는 것이 맞는데, 가가 4로 줄이면 4만 내고 5를 얻습니다.",
              boundary:
                "셋이 다 줄이면 합이 9에 못 미쳐 세워지지 않습니다. 각자에게 이득인 행동이 모이면 만들어져야 할 것이 사라집니다.",
            },
            {
              term: "신고와 무관하게 나눠 걷는다",
              description:
                "말한 값이 부담을 바꾸지 않고 세워질지만 바꾸므로 부풀리는 쪽이 이득입니다.",
              example:
                "셋째 가로등에서 참값 4, 2, 1은 합이 7이라 세우면 안 되는데, 가가 6으로 부풀리면 합이 9가 되어 세워집니다.",
              boundary:
                "가는 1을 얻고 나와 다가 3을 잃어 합이 −2입니다. 잃는 쪽이 여럿으로 흩어져 있어 눈에 잘 띄지 않습니다.",
            },
            {
              term: "그 사이를 고른다",
              description:
                "부담을 신고에 약하게만 엮으면 두 방향이 약해지는 대신 둘 다 남습니다.",
              example:
                "신고액에 비례해 걷되 비율을 낮추면 줄여 말할 이유도 부풀릴 이유도 작아집니다.",
              boundary:
                "약해질 뿐 사라지지 않습니다. 참말이 각자에게 가장 이득이 되게 만드는 방식이 있는지는 이 글이 다루지 않는 별도의 문제입니다.",
            },
          ]}
        />
      </section>

      <section id="congestion" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 3. 줄어드는 것이면 반대쪽으로 어긋납니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            지금까지는 한 사람이 더 누려도 남의 몫이 줄지 않는다고 두었습니다.
            이제 그 전제를 풀겠습니다. 빼놓을 수는 없는데 줄어들기는 하는
            것입니다.
          </p>

          <p className="leading-7">
            호수가 그렇습니다. 누가 배를 띄우는지 막을 수 없는데, 배가 많아지면
            한 척이 건지는 양은 줄어듭니다.
          </p>

          <p className="leading-7">
            숫자로 두겠습니다. 배가 B척이면 한 척이 건지는 값이 12에서 B를 뺀
            만큼이고, 배 한 척을 띄우는 데 4가 듭니다.
          </p>

          <p className="leading-7">
            호수 전체로 보면 네 척이 가장 좋습니다. 건진 것이 32이고 배 값이
            16이라 16이 남습니다. 다섯 척이면 35와 20이라 15로 줄어듭니다.
          </p>

          <p className="leading-7">
            그런데 들어오는 사람은 전체를 보지 않습니다. 다섯째 배는 7을 건지고
            4를 쓰니 자기에게는 3이 남습니다.{" "}
            <strong>들어오는 것이 자기에게는 맞습니다.</strong>
          </p>

          <p className="leading-7">
            그 배가 들어오면 먼저 있던 네 척이 각각 8에서 7로 줄어 4를
            잃습니다. 자기가 얻은 3보다 큽니다. 그 4는 들어온 사람의 장부에
            없습니다.
          </p>

          <p className="leading-7">
            그래서 들어오기가 멈추지 않습니다. 한 척이 4 이상을 건지는 한 들어올
            이유가 있으므로 여덟 척까지 갑니다.{" "}
            <strong>그 자리에서 호수가 남기는 것은 0입니다.</strong>
          </p>

          <p className="leading-7">
            네 척일 때 남던 16이 통째로 사라졌습니다. 잡은 물고기가 줄어서가
            아니라 잡는 데 쓴 배 값이 잡은 값만큼 불어나서입니다.
          </p>

          <p className="leading-7">
            앞 절과 방향이 반대입니다. 가로등은 빼놓을 수 없어서 아무도 내지
            않았고, 호수는 빼놓을 수 없어서 너무 많이 들어옵니다. 가르는 것은
            한 사람이 더 쓸 때 남의 몫이 주느냐입니다.
          </p>
        </div>

        <CommonsEntryViz />

        <ExplainedFormula
          question="빼놓을 수 없는데 줄어들기까지 하면 몇이 들어옵니까?"
          idea="한 척이 더 들어올 때 호수 전체가 더 건지는 양과 그 한 척이 자기 손에 쥐는 양은 다릅니다. 앞의 것은 남들의 몫이 준 것을 빼고 남은 것이고 뒤의 것은 빼지 않은 것이므로, 뒤의 것이 언제나 큽니다. 들어오기는 뒤의 것이 0이 될 때까지 계속되고 그 자리는 앞의 것이 0이 되는 자리보다 한참 뒤입니다."
          formula={String.raw`\Delta^{\text{전체}}(B) = T(B) - T(B-1) - k, \qquad \Delta^{\text{한 척}}(B) = \frac{T(B)}{B} - k, \qquad T(B) = B\,(a - B)`}
          annotatedFormula={String.raw`\underbrace{\Delta^{\text{전체}}(B) = T(B) - T(B-1) - k}_{\text{호수 전체가 더 남기는 것}}, \qquad \underbrace{\Delta^{\text{한 척}}(B) = \tfrac{T(B)}{B} - k}_{\text{들어오는 배가 보는 것}}`}
          operations={[
            {
              expression: String.raw`T(B) = B\,(a - B)`,
              annotation: [
                "배가 B척일 때 호수 전체가 건지는 값입니다. 척수가 늘면 한 척의 몫이 줄기 때문에 B에 대해 봉우리를 가집니다.",
                "예에서는 a를 12로 두었습니다. 배 여섯 척에서 36으로 가장 많이 건지지만 그것이 가장 좋은 자리는 아닙니다.",
              ],
            },
            {
              expression: String.raw`T(B) - T(B-1) - k`,
              annotation: [
                "한 척이 더 들어올 때 호수 전체가 더 남기는 것이며, 먼저 있던 배들의 몫이 준 것이 이미 빠져 있습니다.",
                "이 값이 마지막으로 양수인 자리가 맞는 척수입니다. 예에서는 네 척입니다.",
              ],
            },
            {
              expression: String.raw`\frac{T(B)}{B} - k`,
              annotation: [
                "들어오는 배가 실제로 보는 것이며, 배마다 몫이 같으므로 전체를 척수로 나눈 것이 자기 몫입니다.",
                "여기에는 남들의 몫이 준 것이 빠져 있지 않습니다. 그래서 이 값이 0이 될 때까지 들어오고, 예에서는 여덟 척입니다.",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`B`,
              name: "들어온 배의 수",
              description: "호수를 쓰는 사람의 수이며 아무도 막을 수 없다고 둡니다.",
            },
            {
              symbol: String.raw`k`,
              name: "배 한 척을 띄우는 데 드는 값",
              description:
                "예에서는 4이며 척수와 무관하게 같다고 둡니다. 다른 데서 그만큼을 벌 수 있다는 뜻이기도 합니다.",
            },
            {
              symbol: String.raw`a`,
              name: "호수가 비어 있을 때 한 척이 건질 값의 기준",
              description:
                "예에서는 12이며, 한 척의 몫이 a에서 척수를 뺀 만큼 줄어든다고 둔 것입니다.",
            },
          ]}
          assumptions={[
            "배마다 실력이 같고 몫이 똑같이 나뉜다고 둡니다. 실력 차이가 있으면 먼저 들어온 쪽이 더 건지므로 들어오기가 더 일찍 멈춥니다.",
            "물고기가 다음 해로 이어지지 않는다고 둡니다. 씨가 마르는 문제를 넣으면 지금의 과잉이 내년의 봉우리까지 낮춥니다.",
            "들어오려는 사람이 충분히 많다고 둡니다. 여덟 척을 채울 만큼 없으면 그 앞에서 멈춥니다.",
          ]}
          interpretation="한 척이 건지는 값이 12에서 척수를 뺀 만큼이고 배 한 척에 4가 든다고 하겠습니다. 호수 전체가 남기는 것은 한 척부터 여덟 척까지 7, 12, 15, 16, 15, 12, 7, 0이라 네 척에서 가장 큽니다. 그런데 한 척이 4 이상을 건지는 한 들어올 이유가 있으므로 여덟 척까지 들어오고, 그 자리에서 남는 것이 0입니다. 다섯째 배 하나만 떼어 보면 자기는 7을 건지고 4를 써서 3이 남지만 먼저 있던 네 척이 각각 1씩 줄어 4를 잃으므로 합치면 −1이고, 이것이 16에서 15로 줄어든 크기와 정확히 같습니다. 여기서 읽어야 할 것은 물고기가 사라졌다는 이야기가 아니라는 점입니다. 여덟 척일 때 잡은 값은 32로 네 척일 때와 같고, 사라진 것은 잡는 데 쓴 배 값이 그만큼 불어난 몫입니다. 읽으면 안 되는 것은 사람들이 어리석어서 이렇게 된다는 결론입니다. 각자는 자기 앞의 숫자로 정확히 계산했고, 그 숫자에 남의 몫이 준 것이 들어 있지 않았을 뿐입니다."
        />

        <CitationBlock
          source="Garrett Hardin, “The Tragedy of the Commons”, Science, Vol. 162, No. 3859, 13 December 1968, pp. 1243–1248"
          citeKey={3}
          href="https://doi.org/10.1126/science.162.3859.1243"
        >
          이 절의 셈을 목초지로 적어 둔 글입니다. 한 마리를 더 들일 때의 이득을
          &ldquo;Since the herdsman receives all the proceeds from the sale of the
          additional animal, the positive utility is nearly +1&rdquo;이라 하고,
          손해를 &ldquo;Since the effects of overgrazing are shared by all the
          herdsmen, the negative utility for any particular decision-making
          herdsman is only a fraction of −1&rdquo;이라 합니다. 다섯째 배가 3을
          얻고 4를 물리는 구조가 이것입니다. 다만 이 글이 인용하는 것은 이
          셈까지입니다. 같은 논문이 여기서 곧바로 강제 없이는 파멸이 불가피하다는
          결론으로 넘어가는데, 실제로 규칙을 세워 오래 유지한 공유자원 사례가
          여럿 보고되어 있고 그 조건은{" "}
          <Link to="/politics/polity/collective-choice-problem#self-governance">
            정치 쪽 글
          </Link>
          이 다룹니다. 원문 전문은 열지 못했고 위 두 문장과 서지는 저자 재단이
          공개한 전재본으로 확인했습니다.
        </CitationBlock>
      </section>

      <section id="excluding" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 4. 빼놓을 수 있게 되어도 한 값으로는 비용을 못 채웁니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            여기까지의 문제가 전부 빼놓을 수 없다는 데서 나왔으니, 빼놓을 수
            있게 만들면 풀리겠다고 생각하게 됩니다. 절반은 맞습니다.
          </p>

          <p className="leading-7">
            호수부터 보겠습니다. 주인을 정해 배 한 척에 4씩 받게 하면 한 척이
            건지는 값에서 배 값과 입어료를 빼고 남아야 들어오므로 네 척에서
            멈춥니다. 정확히 맞는 척수이고 걷힌 16이 사라졌던 그 16입니다.
          </p>

          <p className="leading-7">
            줄어드는 쪽에서는 빼놓을 수 있게 되는 것이 통합니다. 값이 들어오기를
            막는 일을 하고, 그 값이 바로 남의 몫이 준 만큼입니다.
          </p>

          <p className="leading-7">
            가로등은 다릅니다. 두 개를 세울 때 가의 총가치가 11, 나가 7, 다가
            4이고 다 합치면 22인데 드는 값은 18입니다. 세우는 것이 맞습니다.
          </p>

          <p className="leading-7">
            이제 요금을 매겨 받는다고 해 보겠습니다. 한 값으로 받으면 그 값보다
            낮게 치는 사람은 빠집니다. 4를 받으면 셋이 다 내지만 12뿐이고, 7을
            받으면 둘이 내어 14, 11을 받으면 한 명이 내어 11입니다.
          </p>

          <p className="leading-7">
            <strong>어느 값을 매겨도 18을 못 채웁니다.</strong> 합치면 22가 있는
            데도 그렇습니다. 값을 올리면 내는 사람이 줄고 값을 내리면 한 명당
            받는 것이 줄기 때문입니다.
          </p>

          <p className="leading-7">
            사람마다 다르게 받으면 됩니다. 가에게 11, 나에게 7, 다에게 4를
            받으면 22가 걷힙니다. 그런데 그 숫자를 알려면 물어봐야 하고, 물어보면
            앞 절의 문제가 그대로 돌아옵니다.
          </p>

          <p className="leading-7">
            빼놓을 수 있게 되어도 남는 것이 하나 더 있습니다. 드는 값이 14여서
            요금 7로 겨우 채워진다고 해 보겠습니다. 그러면 세워지기는 하는데
            다는 빠집니다.
          </p>

          <p className="leading-7">
            다를 들이는 데 드는 값은 0입니다. 이미 켜진 불이니 한 사람이 더
            본다고 해서 아무것도 더 들지 않습니다. 그런데 요금이 그 사람을
            내보냅니다. <strong>값이 있어야 만들어지고, 만들어진 뒤에는 그 값이
            사람을 내보냅니다.</strong>
          </p>
        </div>

        <AlgorithmBlock
          title="네 칸 가운데 어디인지에 따라 무엇이 어긋나는지가 정해집니다"
          input={[
            "내지 않은 사람을 빼놓을 수 있는지",
            "한 사람이 더 쓰면 남의 몫이 주는지",
            "각자의 값을 물어서 알아낼 수 있는지",
          ]}
          steps={[
            {
              code: "if 빼놓을 수 있고 남의 몫도 준다: 앞 네 글의 계산이 그대로 통한다",
              note: "빵과 커피가 여기입니다. 값 하나가 두 줄을 맞물리게 하고 수량이 봉우리에서 멈춥니다.",
            },
            {
              code: "if 빼놓을 수 없고 남의 몫이 줄지 않는다: 값을 세로로 더하고, 덜 만들어질 것을 각오한다",
              note: "가로등이 여기입니다. 각자에게 맡기면 하나도 안 만들어지므로 얼마를 만들지를 값이 아닌 다른 절차로 정해야 합니다.",
            },
            {
              code: "if 빼놓을 수 없고 남의 몫이 준다: 들어오기가 멈추지 않는다",
              note: "호수가 여기입니다. 한 척이 보는 몫과 전체가 더 남기는 것이 갈라져 남는 것이 0이 될 때까지 들어옵니다.",
            },
            {
              code: "if 빼놓을 수 있고 남의 몫이 줄지 않는다: 만들어지긴 하는데 들어올 수 있는 사람이 빠진다",
              note: "요금을 받는 다리와 이미 만들어진 지식이 여기입니다. 한 사람을 더 들이는 데 0이 드는데 값이 그 사람을 내보냅니다.",
            },
            {
              code: "값을 매길 때는 한 값으로 비용이 채워지는지 먼저 확인한다",
              note: "총가치가 비용을 넘어도 한 값으로는 못 채우는 경우가 있습니다. 사람마다 다르게 받으려면 각자의 값을 알아야 합니다.",
            },
          ]}
          output="이 재화가 네 칸 가운데 어디이고, 그 칸에서 수량이 어느 방향으로 얼마나 어긋나는지"
        />

        <ProgressiveDetail
          title="네 칸을 가르는 일과 그 뒤를 누가 정하는지는 정치 쪽 글이 먼저 다룹니다"
          preview="배제성과 경합성의 정의, 무임승차의 유인 구조, 규칙을 세워 유지한 사례의 조건이 그쪽에 정본으로 있습니다."
        >
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p className="leading-7">
              빼놓을 수 있느냐와 줄어드느냐로 네 칸을 가르는 일은{" "}
              <Link to="/politics/polity/collective-choice-problem#two-kinds-of-choice">
                정치 쪽 글
              </Link>
              이 먼저 세웠습니다. 이 글은 그 분류를 가져다 각 칸에서 수량이
              얼마나 어긋나는지만 셌습니다.
            </p>

            <p className="leading-7">
              기여할지 말지의 유인 구조도 그쪽에 있습니다. 혜택을 구성원 수로
              나눈 몫이 자기가 회수하는 값이므로 사람이 많아질수록 내지 않는
              쪽이 유리해진다는 관계입니다. 이 글의 두 번째 절은 그 위에 한 층을
              더한 것인데, 낼지 말지가 아니라{" "}
              <strong>얼마나 원한다고 말할지</strong>를 다룹니다.
            </p>

            <p className="leading-7">
              강제로 걷는 길과 규칙을 세워 스스로 관리하는 길, 그리고 그 조건이
              규모 때문에 깨지는 지점은{" "}
              <Link to="/politics/polity/collective-choice-problem#self-governance">
                같은 글의 뒤쪽
              </Link>
              이 다룹니다. 이 글은 어느 길로 갈지를 고르지 않고, 어느 길로 가든
              얼마를 만드는 것이 맞는지의 숫자만 내놓습니다.
            </p>
          </div>
        </ProgressiveDetail>
      </section>

      <section id="boundary" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          얼마가 맞는지를 아는 것과 그것을 정하는 것은 다른 일입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            이 글이 내놓은 것은 숫자입니다. 가로등은 두 개, 호수는 네 척입니다.
            그 숫자를 어떻게 정하고 누가 집행하느냐는 다루지 않았습니다.
          </p>

          <p className="leading-7">
            그리고 그 숫자 자체가 각자의 값을 안다는 전제 위에 있습니다. 두 번째
            절이 보인 것은 그 값을 물어서는 얻을 수 없다는 것이었습니다. 논문의
            표현대로, 답은 존재하는데 찾는 것이 문제입니다.
          </p>

          <p className="leading-7">
            그러니 여기서 시장이 못 한다는 결론을 정부가 잘한다는 결론으로 바꿔
            읽으면 안 됩니다. 값을 물어보면 기운다는 문제는 걷는 쪽이 누구든
            그대로 남습니다.
          </p>

          <p className="leading-7">
            이 글의 숫자에는 전제가 여럿 붙어 있습니다. 가로등에서는 한 사람이
            더 본다고 남의 몫이 전혀 줄지 않는다고 두었는데 길이 붐비면 줄어들고,
            호수에서는 물고기가 다음 해로 이어지지 않는다고 두었는데 실제로는
            올해의 과잉이 내년의 봉우리를 낮춥니다.
          </p>

          <p className="leading-7">
            값을 사람마다 다르게 받는 방식도 이 글이 열어만 두고 닫지
            않았습니다. 참말하는 것이 각자에게 가장 이득이 되게 만드는 방식이
            있는지는 따로 다뤄야 할 주제입니다.
          </p>

          <p className="leading-7">
            다음 글은 남은 한 칸입니다. 지금까지는 각자가 자기 값을 알고 있다고
            두었는데, 한쪽만 알고 다른 쪽은 모르는 경우가 있습니다. 그때 시장에
            무엇이 남는지를 봅니다.
          </p>
        </div>
      </section>
    </div>
  );
}

import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import ComparativeAdvantageViz from "./gains-from-trade/viz/ComparativeAdvantageViz";
import TradeRangeViz from "./gains-from-trade/viz/TradeRangeViz";

/**
 * 더 잘하는 쪽이 다 하지 않는 것이 낫습니다
 *
 * 경제 시리즈 2편. 1편의 기회비용이 사람마다 다르다는 사실 하나에서 교환의
 * 이득을 끌어낸다. 비율이 정해지는 구간까지가 범위이고, 그 구간 안 어디로
 * 정해지는지는 3편의 몫이다.
 */
export default function GainsFromTradeArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          둘 다 더 잘하는 사람이 있어도 혼자 다 하는 것은 손해입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            앞 글에서 값은 포기한 것으로 잰다고 했습니다. 그리고 포기하는 것이
            사람마다 다르므로 같은 일의 값도 사람마다 달랐습니다. 이 사실
            하나에서 꽤 이상한 결론이 나옵니다.
          </p>

          <p className="leading-7">
            무엇이든 남보다 빠르고 잘하는 사람이 있다고 하겠습니다. 그 사람이
            혼자 다 하는 것이 맞아 보입니다. 그런데 맞지 않습니다. 그 사람도
            남에게 맡기고 자기는 한 가지에 붙는 편이 낫습니다.
          </p>

          <p className="leading-7">
            이상하게 들리는 이유는 만든 양과 치른 값을 같은 것으로 보기
            때문입니다. 아래 그림이 그 둘을 떼어 놓습니다.
          </p>
        </div>

        <ComparativeAdvantageViz />

        <ContentBoundary article="gains-from-trade" />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            이 글이 푸는 질문은 하나입니다.{" "}
            <strong>
              모든 것을 더 잘하는 쪽도 왜 남과 나눠 하는 편이 나은가
            </strong>
            입니다.
          </p>

          <p className="leading-7">
            순서는 더 잘하는 것과 더 싸게 하는 것을 가르고, 둘 다 나아지는
            비율이 있는지 보고, 그 이득이 어디서 생기는지 짚고, 마지막으로 그
            이득을 갉아먹는 것을 셉니다.
          </p>

          <p className="leading-7">
            비율이 그 구간 안 어디로 정해지는지는 다루지 않습니다. 이 글은
            구간이 있다는 것까지만 보입니다.
          </p>
        </div>
      </section>

      <section id="two-advantages" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 1. 더 많이 만드는 것과 더 싸게 만드는 것은 다릅니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            가온은 하루에 빵 8판이나 케이크 4개를 만들고, 나루는 빵 3판이나
            케이크 3개를 만듭니다. 가온이 빵도 케이크도 더 많이 만듭니다.
          </p>

          <p className="leading-7">
            그런데 앞 글의 규칙을 적용해 보겠습니다. 가온이 케이크 한 개를
            만들려면 빵 2판을 포기해야 합니다. 나루는 빵 1판만 포기하면
            됩니다.
          </p>

          <p className="leading-7">
            그러니까 케이크의 값은 나루 쪽이 절반입니다. 나루가 더 적게
            만드는데도 더 싸게 만듭니다. 만든 양이 아니라 포기한 것으로 재기
            때문에 생기는 역전입니다.
          </p>

          <p className="leading-7">
            빵은 반대로 갑니다. 가온은 빵 한 판에 케이크 0.5개를 포기하고
            나루는 1개를 포기합니다. 그래서 싸게 만드는 쪽이 하나씩 갈립니다.
          </p>

          <p className="leading-7">
            이 갈림은 우연이 아닙니다. 한 사람이 두 가지를 모두 상대보다 싸게 만들 수는 없습니다. 한쪽이 싸다는 것은 그 값을 재는 기준이 된 다른 쪽이 비싸다는 뜻이라 두 값은
            서로의 뒤집은 값이기 때문입니다.
          </p>
        </div>

        <TermBreakdown
          title="두 가지 우위를 가르면"
          description="같은 표를 놓고 무엇을 읽느냐에 따라 다른 결론이 나옵니다."
          items={[
            {
              term: "절대우위",
              description:
                "같은 시간에 더 많이 만드는 쪽입니다. 생산량을 그대로 비교합니다.",
              example:
                "빵 8판 대 3판, 케이크 4개 대 3개이므로 가온이 둘 다 절대우위입니다.",
              boundary:
                "누가 무엇을 맡을지는 이 비교로 정해지지 않습니다. 한 사람이 둘 다 이기면 답이 나오지 않기 때문입니다.",
            },
            {
              term: "비교우위",
              description:
                "그것을 만들려고 포기해야 하는 것이 더 적은 쪽입니다. 기회비용을 비교합니다.",
              example:
                "케이크 한 개의 값이 가온은 빵 2판, 나루는 빵 1판이므로 케이크는 나루가 비교우위입니다.",
              boundary:
                "두 사람의 기회비용이 같으면 비교우위가 갈리지 않고, 그때는 나눠 해서 얻는 것이 없습니다.",
            },
            {
              term: "두 우위가 어긋나는 이유",
              description:
                "절대우위는 상대와 견주고, 비교우위는 자기 안에서 다른 선택지와 견줍니다.",
              example:
                "나루는 케이크를 적게 만들지만 그 때문에 포기하는 빵도 적습니다.",
              boundary:
                "비교우위는 두 가지 모두에서 동시에 나올 수 없습니다. 한쪽 값이 낮으면 그 값의 기준이 된 다른 쪽 값이 반드시 높습니다.",
            },
          ]}
        />

        <CitationBlock
          source="David Ricardo, On the Principles of Political Economy, and Taxation (John Murray, 1817), ch. VI · On Foreign Trade"
          citeKey={1}
          href="https://www.gutenberg.org/ebooks/33310"
        >
          둘 다 더 적은 노동으로 만드는 쪽이 있어도 교환이 이득이라는 것을 숫자로
          보인 자리입니다. 잉글랜드는 옷감에 100명, 포도주에 120명이 들고
          포르투갈은 포도주에 80명, 옷감에 90명이 듭니다. 포르투갈이 둘 다 적게
          드는데도 &ldquo;This exchange might even take place, notwithstanding
          that the commodity imported by Portugal could be produced there with
          less labour than in England&rdquo;라고 적고, 그 이유를 포도주에
          자본을 쓰는 편이 옷감을 직접 만드는 것보다 더 많은 옷감을 가져다주기
          때문이라고 설명합니다. 1817년 John Murray 초판 본문을 Project
          Gutenberg 전자화본으로 대조했습니다. 초판에서 이 장은 6장이며 흔히
          인용되는 7장은 1821년 3판의 번호입니다. 이 글이 쓰는 것은 위 예와
          그 논증까지이고, 같은 책의 가치론과 지대론은 다루지 않습니다.
        </CitationBlock>
      </section>

      <section id="trade-range" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 2. 둘 다 나아지는 비율의 구간이 존재합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            싸게 만드는 쪽이 갈렸다고 해서 바로 나눠 할 이유가 되지는 않습니다.
            바꿀 비율이 양쪽 모두에게 이득이어야 합니다.
          </p>

          <p className="leading-7">
            그 조건은 간단합니다. 나루가 케이크를 넘기려면 직접 빵을 만들 때보다
            많이 받아야 하고, 가온이 케이크를 받으려면 직접 만들 때보다 적게
            줘야 합니다.
          </p>

          <p className="leading-7">
            나루가 직접 만드는 값이 빵 1판, 가온이 직접 만드는 값이 빵 2판이니
            비율은 그 사이에 있어야 합니다. 케이크 한 개에 빵 1판에서 2판
            사이면 둘 다 받아들입니다.
          </p>

          <p className="leading-7">
            여기서 짚어 둘 것이 하나 있습니다. 비율을 어디에 두든 두 사람의
            이득을 더한 값은 같습니다. 비율은 이득의 크기를 정하지 않고 나누는
            몫만 정합니다.
          </p>
        </div>

        <ExplainedFormula
          question="어떤 비율에서 교환이 성립하고, 그때 이득은 얼마입니까?"
          idea="각자가 직접 만들 때 치르는 값이 그 사람이 받아들일 수 있는 한계입니다. 파는 쪽은 자기 값보다 많이 받아야 하고 사는 쪽은 자기 값보다 적게 줘야 하므로, 비율은 두 값 사이에 있어야 합니다. 그 구간 안이면 각자의 이득은 자기 값과 비율의 차이에 거래량을 곱한 것이고, 둘을 더하면 비율이 지워져 두 값의 차이만 남습니다."
          formula={String.raw`c_{\text{저}} < x < c_{\text{고}}, \qquad G_{\text{고}} = Q\,(c_{\text{고}} - x), \quad G_{\text{저}} = Q\,(x - c_{\text{저}})`}
          annotatedFormula={String.raw`\underbrace{c_{\text{저}} < x < c_{\text{고}}}_{\text{성립 구간}}, \qquad \underbrace{G_{\text{고}} + G_{\text{저}} = Q\,(c_{\text{고}} - c_{\text{저}})}_{\text{비율이 지워진 총이득}}`}
          operations={[
            {
              expression: String.raw`c_{\text{저}} < x`,
              annotation: [
                "싸게 만드는 쪽이 직접 만들 때의 값보다 많이 받아야 넘길 이유가 생깁니다.",
                "이 조건이 깨지면 그쪽은 넘기지 않고 직접 만듭니다. 상대에게 아무리 좋은 조건이어도 거래는 일어나지 않습니다.",
              ],
            },
            {
              expression: String.raw`x < c_{\text{고}}`,
              annotation: [
                "비싸게 만드는 쪽이 직접 만들 때의 값보다 적게 줘야 받을 이유가 생깁니다.",
                "두 조건이 함께 있어야 구간이 열리며, 구간의 폭이 곧 두 기회비용의 차이입니다.",
              ],
            },
            {
              expression: String.raw`G_{\text{고}} + G_{\text{저}} = Q\,(c_{\text{고}} - c_{\text{저}})`,
              annotation: [
                "두 이득을 더하면 x가 상쇄되어 사라집니다.",
                "그래서 총이득은 비율과 무관하고, 기회비용이 얼마나 다른지와 얼마나 주고받는지만으로 정해집니다. 비율은 그 몫을 누가 더 가져가는지만 바꿉니다.",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`c_{\text{저}},\; c_{\text{고}}`,
              name: "각자가 직접 만들 때의 값",
              description:
                "그 재화 한 단위를 스스로 만들려고 포기해야 하는 다른 재화의 양이며, 낮은 쪽이 비교우위를 가진 쪽입니다.",
            },
            {
              symbol: String.raw`x`,
              name: "교환 비율",
              description:
                "그 재화 한 단위를 넘기고 받는 다른 재화의 양이며, 두 값 사이에 있어야 합니다.",
            },
            {
              symbol: String.raw`Q`,
              name: "주고받는 양",
              description:
                "한 번에 넘기는 재화의 수량이며, 총이득의 크기를 정하는 두 요소 가운데 하나입니다.",
            },
          ]}
          assumptions={[
            "각자의 기회비용이 수량과 무관하게 일정하다고 둡니다. 실제로는 한쪽으로 몰아갈수록 값이 올라가 완전한 특화 전에 멈춥니다.",
            "옮기고 재고 지키는 데 드는 값을 0으로 둡니다. 다음 절에서 이 전제를 풉니다.",
            "두 사람이 서로의 값을 알고 있다고 둡니다. 모르면 구간 안 어디로 정할지의 다툼이 남고, 그 다툼 자체가 비용이 됩니다.",
          ]}
          interpretation="나루의 값이 빵 1판, 가온의 값이 빵 2판이고 케이크 두 개를 주고받는다고 하겠습니다. 비율을 1.5판으로 잡으면 가온은 2 곱하기 0.5인 1판, 나루도 2 곱하기 0.5인 1판이 남아 둘 다 이득입니다. 비율을 0.8판으로 낮추면 나루가 −0.4판이라 직접 만드는 편이 나으므로 거부하고, 2.4판으로 올리면 가온이 −0.8판이라 이번에는 가온이 거부합니다. 구간은 양쪽에서 막혀 있습니다. 여기서 읽어야 할 것은 세 경우 모두 두 이득의 합이 2판으로 같다는 점입니다. 합은 2 곱하기 2에서 1을 뺀 값으로 고정되어 있고 비율은 그 2판을 어떻게 나눌지만 정합니다. 읽으면 안 되는 것은 구간이 늘 열려 있다는 결론입니다. 두 기회비용이 같으면 구간의 폭이 0이 되어 교환할 이유가 사라집니다."
        />

        <TradeRangeViz />
      </section>

      <section id="where-gain-comes-from" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 3. 이득은 옮겨 담는 데서가 아니라 배치를 바꾸는 데서 나옵니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            총이득 2판은 어디서 온 것입니까. 물건을 주고받는 행위 자체가 무언가를
            만들어 낸 것은 아닙니다. 만든 뒤에 나눈 것뿐입니다.
          </p>

          <p className="leading-7">
            답은 무엇을 만들었는지가 바뀌었다는 데 있습니다. 교환할 수 있으면 각자가 자기가 싸게 만드는 쪽에 시간을 몰 수 있고 같은 시간에서 더 많은 것이 나옵니다.
          </p>

          <p className="leading-7">
            숫자로 확인해 보겠습니다. 가온이 케이크 2개를 직접 만들면 빵 4판을
            포기해 빵 4판과 케이크 2개가 남습니다. 특화해서 빵 8판을 만들고 그중
            3판을 넘기면 빵 5판과 케이크 2개가 됩니다. 케이크는 그대로인데 빵이
            한 판 늘었습니다.
          </p>

          <p className="leading-7">
            나루도 같습니다. 직접 빵 3판을 만들면 케이크가 0개지만 케이크 3개를 만들어 2개를 넘기면 빵 3판에 케이크 1개가 남습니다.
          </p>

          <p className="leading-7">
            그래서 두 사람 모두 혼자서는 닿을 수 없던 조합에 닿습니다. 앞 글의 경계선 바깥에서 소비하게 되는 것이고 경계선이 밀린 것이 아니라 교환이라는 다른 경로가 생긴 것입니다.
          </p>
        </div>

        <AlgorithmBlock
          title="누가 무엇을 맡을지 정하는 절차"
          input={[
            "각자가 각 재화를 만드는 데 드는 시간이나 만들 수 있는 양",
            "옮기고 재고 지키는 데 드는 값",
          ]}
          steps={[
            {
              code: "각 사람 · 각 재화에 대해 기회비용을 구한다",
              note: "상대와 견주는 것이 아니라 자기 안에서 다른 재화와 견줍니다.",
            },
            {
              code: "재화마다 기회비용이 낮은 사람에게 배정한다",
              note: "생산량이 아니라 기회비용으로 배정합니다. 한 사람이 두 재화 모두에서 낮을 수는 없습니다.",
            },
            {
              code: "if 두 사람의 기회비용이 같다: return 각자 만든다",
              note: "구간의 폭이 0이라 나눠 해서 얻는 것이 없습니다.",
            },
            {
              code: "if 옮기는 값 ≥ 기회비용의 차이: return 각자 만든다",
              note: "구간이 사라지므로 배정이 옳아도 교환이 성립하지 않습니다.",
            },
            {
              code: "두 기회비용 사이에서 비율 x를 고른다",
              note: "어디를 고르든 총이득은 같고 나누는 몫만 달라집니다. 이 선택은 이 글이 다루지 않습니다.",
            },
          ]}
          output="각자가 맡을 재화와 교환이 성립하는 비율의 구간"
        />

        <ProgressiveDetail
          title="특화가 끝까지 가지 않는 경우가 더 흔합니다"
          preview="기회비용이 수량에 따라 오르면 완전히 몰아가기 전에 멈추는 것이 이득입니다."
        >
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p className="leading-7">
              위 계산은 기회비용이 수량과 무관하게 일정하다고 두었습니다. 그래서
              답이 한쪽으로 전부 몰아가는 완전한 특화로 나왔습니다.
            </p>

            <p className="leading-7">
              앞 글에서 봤듯 실제 경계선은 바깥으로 휩니다. 빵을 많이 만들수록
              한 판을 더 만들 때 포기해야 하는 케이크가 늘어납니다.
            </p>

            <p className="leading-7">
              그러면 가온이 빵에 몰아갈수록 가온의 빵 값이 올라가고 어느 지점에서 상대의 값과 만납니다. 그 지점에서 멈추는 것이 답입니다. 앞 글의 한 단위 판정이 여기에도 그대로
              적용됩니다.
            </p>

            <p className="leading-7">
              그래서 현실에서 보이는 것은 한 나라가 한 가지만 만드는 모습이
              아니라 같은 산업을 양쪽이 다 하면서 비중만 다른 모습입니다. 이득의
              방향은 같고 크기만 작아집니다.
            </p>
          </div>
        </ProgressiveDetail>
      </section>

      <section id="transaction-cost" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 4. 옮기고 재고 지키는 값이 구간을 갉아먹습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            지금까지는 주고받는 데 아무 값도 들지 않는다고 두었습니다. 그
            전제를 풀면 구간이 좁아집니다.
          </p>

          <p className="leading-7">
            드는 값은 운반만이 아닙니다. 상대를 찾고, 물건이 약속대로인지 재고,
            약속을 안 지켰을 때 강제할 방법을 마련하는 데까지 값이 듭니다. 이
            전부를 묶어 거래비용이라고 부릅니다.
          </p>

          <p className="leading-7">
            케이크 한 개당 빵 0.5판이 든다고 하면 가온이 받아들일 수 있는 상한이
            2판에서 1.5판으로 내려옵니다. 구간이 1에서 1.5로 절반이 되고 총이득도
            2판에서 1판으로 줄어듭니다.
          </p>

          <p className="leading-7">
            그리고 이 값이 기회비용의 차이인 1판을 넘으면 구간 자체가 사라집니다.
            배정이 옳고 비교우위가 갈려 있어도 교환이 일어나지 않습니다.
          </p>

          <p className="leading-7">
            이것이 왜 중요하냐면, 교환을 늘리는 방법이 둘이라는 뜻이기 때문입니다.
            기회비용의 차이를 키우거나 거래비용을 줄이거나입니다. 도로와 저울과
            계약을 강제하는 장치가 하는 일이 뒤쪽입니다.
          </p>
        </div>

        <ProgressiveDetail
          title="지키는 값이 왜 옮기는 값만큼 큰가"
          preview="운반은 줄어들었지만 약속을 강제하는 비용은 남아서, 그쪽이 구간을 더 많이 갉아먹습니다."
        >
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p className="leading-7">
              옮기는 값은 기술이 내려 줍니다. 배와 컨테이너와 통신이 그 일을 했고
              거리의 값은 크게 줄었습니다.
            </p>

            <p className="leading-7">
              지키는 값은 그렇게 줄지 않습니다. 물건이 약속대로인지 사기 전에는
              알 수 없고, 먼저 보낸 쪽이 떼일 수 있으며, 떼였을 때 받아 낼 방법이
              상대가 어디에 있느냐에 따라 달라집니다.
            </p>

            <p className="leading-7">
              그래서 이 비용을 낮추는 장치가 따로 필요합니다. 약속을 구속력 있게
              만드는{" "}
              <Link to="/law/private-law/contract-and-enforceable-promise">
                계약
              </Link>
              과 그 약속을 강제할 힘이 어디에 모여 있는지의 문제가 여기서
              경제와 만납니다. 그 힘이 없는 영역에서 협력이 어떻게 생기는지는{" "}
              <Link to="/politics/governance/international-anarchy">
                국제질서
              </Link>
              가 다룹니다.
            </p>

            <p className="leading-7">
              이 글은 거래비용을 하나의 숫자로만 다룹니다. 그 숫자가 무엇으로
              이루어져 있고 어떻게 낮추는지는 이 글의 범위 밖입니다.
            </p>
          </div>
        </ProgressiveDetail>
      </section>

      <section id="boundary" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          비율이 구간 안 어디로 정해지는지는 아직 빈칸입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            네 부품을 합치면 이렇습니다. 기회비용이 서로 다르면 싸게 만드는 쪽이
            하나씩 갈리고, 두 값 사이에 둘 다 이득인 비율의 구간이 열리며, 이득은
            배치를 바꾼 데서 나오고, 거래비용이 그 구간을 갉아먹습니다.
          </p>

          <p className="leading-7">
            그런데 구간이 열려 있다는 것까지만 나왔습니다. 1판과 2판 사이 어디가 될지는 이 계산으로 정해지지 않습니다. 두 사람이 서로의 값을 알고 마주 앉아 다투면 정해지겠지만
            시장에는 마주 앉을 상대가 수천 명입니다.
          </p>

          <p className="leading-7">
            그리고 그 수천 명은 서로의 기회비용을 모릅니다. 1편 끝에서 남긴 빈칸이
            여기서 더 뾰족해집니다. 아무도 남의 사정을 모르는데 비율이 하나로
            정해집니다.
          </p>

          <p className="leading-7">
            다음 글부터는 그 숫자가 어떻게 정해지는지를 봅니다. 그것이 가격이고 앞의 두 글에서 나온 기회비용이 그 숫자의 재료가 됩니다.
          </p>

          <p className="leading-7">
            다루지 않은 것을 밝혀 둡니다. 교환으로 두 사람 모두 나아진다는 것은
            각자가 자기 값을 알고 스스로 받아들였을 때의 이야기입니다. 누가 더
            많이 가져가는지, 특화한 뒤 그 일이 사라지면 어떻게 되는지는 이 글의
            범위 밖입니다.
          </p>
        </div>
      </section>
    </div>
  );
}

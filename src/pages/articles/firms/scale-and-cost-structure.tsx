import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import DetourViz from "./scale-and-cost-structure/viz/DetourViz";
import DifferentiationViz from "./scale-and-cost-structure/viz/DifferentiationViz";

/**
 * 싸지는 것은 공장이 커져서가 아닙니다
 *
 * 경제 2단계 2편. 1편은 조직이 왜 생기고 왜 멈추는지를 셌다. 여기서는 그
 * 조직이 많이 만들수록 싸진다고들 하는 구조를 연다. Young 1928을 따라
 * 싸지는 힘의 출처를 조직의 크기가 아니라 돌아가는 생산 방법에 두고, 그
 * 방법이 시장 크기에 묶여 있으며 실제로는 산업이 쪼개지면서 실현된다는
 * 데까지 간다. 수확 체증에서 하나만 남는다는 결론이 따라 나오지 않는다는
 * 것도 같은 논문이 명시적으로 막아 둔 자리다.
 */
export default function ScaleAndCostStructureArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          많이 만들면 싸진다는 말에는 설명이 빠져 있습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            앞 글에서 조직은{" "}
            <Link to="/economics/firms/why-firms-exist">
              값을 쓰는 것이 비싼 자리에서 지시가 대신하는 범위
            </Link>
            였고, 그 범위는 안팎의 값이 같아지는 자리에서 멈췄습니다. 그 글
            내내 조직은 값을 받아들이는 쪽이었습니다. 이제 조직이 값을 어떻게
            만드는지를 봅니다.
          </p>

          <p className="leading-7">
            시작은 누구나 하는 말입니다. 많이 만들면 하나당 값이 내려간다. 그런데
            이 말에는 이유가 빠져 있습니다. 같은 방법으로 열 개를 만들든 만 개를
            만들든 하나를 만드는 데 드는 품은 그대로입니다. 손으로 못을 박는
            사람은 만 번째 못도 첫 번째 못과 똑같은 품이 듭니다.
          </p>

          <p className="leading-7">
            <strong>
              그러면 하나당 값이 실제로 내려가는 자리에서는 무엇이 바뀐
              것입니까.
            </strong>{" "}
            답은 크기가 아니라 방법입니다. 그리고 방법이 바뀔 수 있는 조건이
            시장의 크기입니다. 이 글은 그 연결을 다섯 부품으로 폅니다.
          </p>
        </div>

        <DetourViz />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            싸지는 힘이 어디서 오는지, 그 힘을 쓰려면 무엇이 먼저 있어야 하는지,
            그 무엇이 어떻게 다시 커지는지, 커진 결과가 실제로는 어떤 모양으로
            나타나는지, 그리고 그 모양에서 무엇이 따라 나오지 <em>않는지</em>
            입니다.
          </p>

          <p className="leading-7">
            <em>
              여기까지 읽으면 이 글이 고치려는 오해는 잡힙니다 — 하나당 값이
              내려간 것을 공장이 커진 결과로 읽는 습관입니다.
            </em>
          </p>
        </div>
      </section>

      <section id="roundabout" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 1. 싸지는 힘은 곧장 가지 않고 돌아가는 데서 옵니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            못을 박는 가장 곧은 길은 손에 잡히는 것으로 두드리는 것입니다. 돌아가는
            길은 먼저 망치를 만들고 그 망치로 박는 것입니다. 돌아가는 길은 당장
            못을 박는 데 아무 보탬이 되지 않는 일 — 망치 만들기 — 을 먼저 합니다.
            그 대신 그 뒤로는 하나를 박는 데 드는 품이 줄어듭니다.
          </p>

          <p className="leading-7">
            Young은 1928년에 이 돌아감이 바로 수확 체증의 본체라고 적었습니다.
            싸지는 힘의 주된 출처는 큰 공장이 아니라{" "}
            <strong>돌아가는 생산 방법</strong>이고, 그 돌아감은 분업이 오늘날
            띠는 모습과 거의 같은 것이라는 겁니다. 분업이 공정을 단순한 단계로
            쪼개면 그중 일부가 기계로 넘어갈 수 있게 되고, 기계를 쓰는 것이
            다시 한 단계 더 돌아가는 일입니다.
          </p>
        </div>

        <CitationBlock
          source="Allyn A. Young, “Increasing Returns and Economic Progress,” The Economic Journal, Vol. 38, No. 152 (Dec. 1928), pp. 527–542"
          citeKey={1}
          href="https://www.jstor.org/stable/2224835"
        >
          530쪽의 문장이 이 부품의 전부입니다. “It would be wasteful to make a
          hammer to drive a single nail; it would be better to use whatever
          awkward implement lies conveniently at hand.” 이어서 자동차 백 대를
          만들자고 전용 치구와 게이지와 선반을 갖추는 것도 같은 낭비라고 하고,
          “Mr. Ford’s methods would be absurdly uneconomical if his output were
          very small”이라고 적습니다. 스캔본을 내려받아 OCR한 뒤, 인용한 문장은
          해당 쪽 이미지를 직접 열어 글자 단위로 대조했습니다. 쪽 번호는 각 면의
          머리글에 찍힌 것을 그대로 읽은 것입니다.
        </CitationBlock>

        <TermBreakdown
          title="같은 물건, 두 가지 길"
          description="먼저 들이는 몫이 있느냐가 둘을 가릅니다."
          items={[
            {
              term: "곧장 가는 길",
              description:
                "지금 손에 있는 것으로 바로 만듭니다. 먼저 들이는 몫이 없습니다.",
              example:
                "손에 잡히는 돌로 못을 박습니다. 열 개를 박든 만 개를 박든 하나당 품은 같습니다.",
              boundary:
                "수량이 아무리 늘어도 하나당 값이 내려가지 않습니다. 싸질 여지가 애초에 없습니다.",
            },
            {
              term: "돌아가는 길",
              description:
                "당장은 물건이 되지 않는 일을 먼저 하고, 그 뒤로 하나당 품을 줄입니다.",
              example:
                "망치를 먼저 만들고 그 망치로 박습니다. 먼저 든 몫은 박는 개수로 나뉩니다.",
              boundary:
                "개수가 적으면 먼저 든 몫이 나뉘지 않아 오히려 비쌉니다. 그래서 수량이 조건이 됩니다.",
            },
          ]}
        />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            <em>
              여기까지 읽으면 싸지는 힘이 어디서 오는지는 잡힙니다. 그 힘을 언제
              쓸 수 있는지가 바로 다음 질문입니다.
            </em>
          </p>
        </div>
      </section>

      <section id="minimum-market" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 2. 돌아가려면 먼저 그만큼의 시장이 있어야 합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            돌아가는 길이 늘 나은 것은 아닙니다. 먼저 든 몫은 만드는 개수로
            나뉘므로, 개수가 적으면 하나당 얹히는 몫이 커집니다. 두 길의 값이
            같아지는 개수가 있고, 그 개수를 넘어야 돌아가는 쪽이 싸집니다.
          </p>
        </div>

        <ExplainedFormula
          question="돌아가는 방법은 몇 개부터 싸집니까"
          idea={
            <>
              먼저 들이는 몫을 두 길의 단위당 값 차이로 나눈 수입니다. 먼저 들이는
              몫이 클수록, 그리고 줄어드는 폭이 작을수록{" "}
              <strong>그 방법이 열리는 시장이 커집니다.</strong>
            </>
          }
          formula={String.raw`N^{*} \;=\; \frac{F}{c_{\text{곧장}} - c_{\text{돌아}}}`}
          annotatedFormula={String.raw`N^{*} \;=\; \frac{\underbrace{F}_{\text{먼저 들이는 몫}}}{\underbrace{c_{\text{곧장}} - c_{\text{돌아}}}_{\text{하나당 줄어드는 값}}}`}
          operations={[
            {
              expression: String.raw`c_{\text{곧장}} \cdot N`,
              annotation: ["곧장 갈 때 N개를 만드는 값", "먼저 드는 몫이 없습니다"],
            },
            {
              expression: String.raw`F + c_{\text{돌아}} \cdot N`,
              annotation: ["돌아갈 때 N개를 만드는 값", "F는 개수와 무관하게 한 번 듭니다"],
            },
            {
              expression: String.raw`N > N^{*}`,
              annotation: ["이쪽이면 돌아가는 편이 쌉니다", "넘지 못하면 돌아가는 것이 낭비입니다"],
            },
          ]}
          terms={[
            {
              symbol: "F",
              name: "먼저 들이는 몫",
              description:
                "망치를 만드는 데 드는 값처럼, 물건을 몇 개 만들든 한 번만 드는 몫입니다.",
            },
            {
              symbol: String.raw`c_{\text{곧장}}`,
              name: "곧장 갈 때 하나당 값",
              description: "돌아가지 않고 만들 때 하나에 드는 품입니다.",
            },
            {
              symbol: String.raw`c_{\text{돌아}}`,
              name: "돌아간 뒤 하나당 값",
              description: "먼저 들인 것을 갖춘 다음 하나에 드는 품입니다.",
            },
            {
              symbol: String.raw`N^{*}`,
              name: "그 방법이 열리는 최소 수량",
              description:
                "두 길의 값이 같아지는 개수입니다. 시장이 이보다 작으면 그 방법은 있어도 쓰이지 않습니다.",
            },
          ]}
          interpretation="돌아가는 방법은 기술로 가능한지와 별개로 수량이 받쳐 줘야 쓰입니다. 그래서 같은 기술을 가진 두 나라에서 쓰이는 방법이 다를 수 있습니다."
          assumptions={[
            "먼저 들이는 몫이 만드는 개수와 무관하다고 둡니다.",
            "돌아간 뒤의 하나당 값이 개수와 무관하게 일정하다고 둡니다.",
            "만들 개수를 미리 알고 고른다고 둡니다. 실제로는 내다본 수량으로 고르고 틀릴 수 있습니다.",
          ]}
        />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            위 그림의 두 번째 장면이 이 식입니다. 망치에 60이 들고 그 뒤로 하나당
            4면, 못이 열 개를 넘어야 망치를 만드는 쪽이 싸집니다. 세 번째 장면은
            한 걸음 더 간 경우입니다. 망치를 찍어 내는 틀을 또 만들면 하나당 값이
            더 내려가지만, 그 방법은 못이 여든 개를 넘어야 열립니다.{" "}
            <strong>한 번 더 돌아갈 때마다 필요한 시장이 더 커집니다.</strong>
          </p>

          <p className="leading-7">
            Young은 이것을 둘째 차례의 경제라고 불렀습니다. 망치를 만드는 설비를
            얼마나 갖출지는 다시 망치가 몇 개 필요한지에 달려 있고, 망치가 몇 개
            필요한지는 못이 몇 개인지에 달려 있습니다. 어느 단계에서든 같은
            질문이 되풀이됩니다 — 그 몫을 나눠 질 수량이 있습니까.
          </p>
        </div>

        <AlgorithmBlock
          title="돌아갈지 정하는 절차"
          input={[
            "c_곧장: 곧장 갈 때 하나당 값",
            "F, c_돌아: 돌아갈 때 먼저 드는 몫과 그 뒤 하나당 값",
            "N: 내다보는 수량",
          ]}
          steps={[
            {
              code: "N* = F / (c_곧장 − c_돌아)",
              note: "두 길의 값이 같아지는 수량을 먼저 구합니다. 분모가 0이거나 음수이면 그 방법은 어떤 수량에서도 싸지지 않습니다.",
            },
            {
              code: "N ≤ N* 이면 곧장 간다",
              note: "먼저 든 몫을 나눠 질 수량이 없습니다. 기술이 있어도 쓰지 않는 편이 낫습니다.",
            },
            {
              code: "N > N* 이면 돌아간다. 그리고 다음 단계로 같은 질문을 되풀이한다",
              note: "돌아간 뒤에는 그 설비를 만드는 설비라는 다음 돌아감이 생기고, 그 단계의 N*은 더 큽니다.",
            },
          ]}
          output="그 수량에서 실제로 쓰이는 방법 하나 — 앞 그림의 아래쪽 테두리"
          repeatUntil="다음 단계의 N*이 내다보는 수량보다 커질 때까지"
        />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            <em>
              여기까지 읽으면 어떤 방법이 쓰일지 계산할 수 있습니다. 남은 것은 그
              수량이 어디서 오는가입니다.
            </em>
          </p>
        </div>
      </section>

      <section id="market-is-produced" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 3. 그 시장의 크기도 생산이 정합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            여기까지면 시장의 크기는 밖에서 주어진 것처럼 보입니다. 인구가 몇
            명인지, 땅이 얼마나 넓은지가 정해 주는 것처럼요. Young은 그 자리에서
            한 번 더 뒤집습니다. 큰 시장이란 사람 수나 면적이 아니라{" "}
            <strong>사들일 힘</strong>이고, 사들일 힘은 만들어 낼 힘에
            달려 있습니다. 그래서 시장의 크기는 결국 생산의 양이 정합니다.
          </p>

          <p className="leading-7">
            그러면 고리가 닫힙니다. 분업은 시장의 크기에 달려 있는데, 시장의
            크기는 다시 분업에 달려 있습니다. Young 자신이 이 문장을 쓰고 바로
            덧붙입니다 — 이것은 단순한 동어반복이 아니라고요. 한쪽에서 돌아가는
            방법이 열리면 거기서 나온 생산이 다른 쪽의 시장을 키우고, 그 시장이
            다른 쪽의 다음 돌아감을 엽니다. 변화가 변화의 조건을 만들어 냅니다.
          </p>
        </div>

        <CitationBlock
          source="Allyn A. Young, “Increasing Returns and Economic Progress,” The Economic Journal 38(152), 1928, p. 533"
          citeKey={2}
          href="https://www.jstor.org/stable/2224835"
        >
          원문은 “Adam Smith’s dictum amounts to the theorem that the division
          of labour depends in large part upon the division of labour”이고 바로
          다음 문장이 “This is more than mere tautology”입니다. 같은 쪽 앞에서
          큰 시장이 무엇인지도 못 박습니다 — “Not area or population alone, but
          buying power, the capacity to absorb a large annual output of goods.”
          이 두 문장은 해당 쪽 이미지를 열어 대조했습니다.
        </CitationBlock>

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            이 고리에는 끝이 정해져 있지 않습니다. Young은 인구가 늘지 않아도
            시장이 커지고 수확 체증이 실현될 수 있다고 적었고, 확장이 멈추는
            자리는 수요가 더 늘지 않는 곳과 더 돌아가도 값이 내려가지 않는
            곳뿐이라고 했습니다. 1단계에서 본{" "}
            <Link to="/economics/macro/aggregation-and-composition">
              부분과 전체가 어긋나는 자리
            </Link>
            가 여기서도 나옵니다. 한 산업이 보는 시장은 밖에서 주어진 것이지만,
            모든 산업이 서로의 시장이므로 전체로 보면 주어진 것이 아닙니다.
          </p>

          <p className="leading-7">
            <em>
              여기까지 읽으면 고리가 닫힙니다. 그 고리가 실제 세상에서 어떤
              모양으로 나타나는지가 다음 부품입니다.
            </em>
          </p>
        </div>
      </section>

      <section id="differentiation" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 4. 커지는 것은 공장이 아니라 산업이 쪼개지는 것입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            지금까지의 이야기를 한 공장 안에서 일어나는 일로 읽기 쉽습니다. 시장이
            커지니 공장이 커지고, 커진 공장이 더 돌아가는 방법을 쓴다는 식으로요.
            Young은 바로 거기를 막습니다. 수확 체증이 실현되는 전형적인 모양은
            하나가 커지는 것이 아니라 <strong>갈라지는 것</strong>입니다.
          </p>
        </div>

        <DifferentiationViz />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            이유는 부품 2의 식에 이미 들어 있습니다. 한 공장이 쓰는 수량은 그
            공장이 파는 양에 묶여 있습니다. 그런데 그 공장이 쓰던 중간 단계를
            떼어 내 따로 만드는 곳을 세우면, 그곳은 공장 하나가 아니라 같은 것을
            쓰는 여러 곳에 팝니다. 보는 수량이 커지므로{" "}
            <strong>그 조각에서는 더 큰 N*의 방법이 열립니다.</strong> 한 공장
            안에서는 끝내 열리지 않았을 돌아감이, 쪼개고 나면 열립니다.
          </p>

          <p className="leading-7">
            그래서 Young은 개별 회사의 크기만 보고 수확 체증을 재려 하면 그
            구조를 놓친다고 했습니다. 대부분의 산업에서 회사 하나가 경제적으로
            커질 수 있는 크기에는 — 느슨하기는 해도 — 실제로 한계가 있다고 보고,
            그 한계 때문에 한 회사 안에서 다 가져갈 수 없는 돌아감의 이득이 별도
            산업의 몫으로 넘어간다고 적습니다.
          </p>

          <p className="leading-7">
            <em>
              여기까지 읽으면 수확 체증이 실제로 어떤 모양인지 보입니다. 그
              모양에서 무엇이 따라 나오지 않는지가 마지막 부품입니다.
            </em>
          </p>
        </div>

        <CitationBlock
          source="Allyn A. Young, “Increasing Returns and Economic Progress,” The Economic Journal 38(152), 1928, p. 539"
          citeKey={3}
          href="https://www.jstor.org/stable/2224835"
        >
          “This should be sufficiently obvious if we assume, as we must, that in
          most industries there are effective, though elastic, limits to the
          economical size of the individual firm.” 같은 쪽의 맺음 세 가지 중
          첫째가 “the mechanism of increasing returns is not to be discerned
          adequately by observing the effects of variations in the size of an
          individual firm or of a particular industry”입니다. 인쇄업의 예는
          537–538쪽에 있습니다.
        </CitationBlock>
      </section>

      <section id="not-monopoly" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 5. 싸진다는 것에서 하나만 남는다는 것이 따라 나오지 않습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            여기서 가장 흔한 비약을 막아야 합니다. 많이 만들수록 싸진다면 가장
            많이 만드는 곳이 가장 싸고, 그러면 결국 하나만 남는다 — 이 추론은
            자연스러워 보이지만 앞의 네 부품이 그대로 받쳐 주지 않습니다. Young은
            내부 경제와 외부 경제를 가르는 일이 쓸모 있는 이유의 첫째로,
            바로 이 추론이 <strong>흔한 오류</strong>라는 점을 들었습니다.
          </p>
        </div>

        <CitationBlock
          source="Allyn A. Young, “Increasing Returns and Economic Progress,” The Economic Journal 38(152), 1928, p. 527"
          citeKey={4}
          href="https://www.jstor.org/stable/2224835"
        >
          “In the first place it is, or ought to be, a safeguard against the
          common error of assuming that wherever increasing returns operate
          there is necessarily an effective tendency towards monopoly.” 이
          문장도 쪽 이미지를 직접 열어 대조했습니다. 이 글이 부품 5를 둔 이유가
          이 한 문장이고, 앞 글의 넘김 문장도 이 문장에 맞춰 고쳤습니다.
        </CitationBlock>

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            왜 따라 나오지 않는지는 부품 4가 답입니다. 돌아감의 이득은 한 회사가
            전부 삼켜서 실현되는 것이 아니라 상당 부분이 쪼개져 나간 별도 산업의
            몫으로 실현됩니다. 그 몫을 가져가는 곳들은 서로 다른 조각을 맡고
            있으므로, 하나가 전부를 가져가는 그림이 되지 않습니다.
          </p>

          <p className="leading-7">
            그렇다고 파는 쪽이 하나로 남는 경우가 없다는 뜻은 아닙니다. 부품 2의
            식이 그 조건을 그대로 줍니다. 어떤 조각에서{" "}
            <strong>그 방법이 열리는 최소 수량이 시장 전체보다 크면</strong>,
            둘로 나눠서는 둘 다 그 방법을 못 쓰고 하나가 다 만드는 쪽이 쌉니다.
            이것은 싸진다는 사실 자체에서 나온 결론이 아니라, 최소 수량과 시장
            크기를 견준 결과입니다. 둘은 다른 주장입니다.
          </p>
        </div>

        <ProgressiveDetail
          title="그러면 큰 회사가 싸게 파는 것은 무엇으로 읽습니까"
          preview="실제로 큰 곳이 더 싸게 파는 일은 흔합니다. 그 관찰 하나에 적어도 네 가지가 섞여 있습니다."
        >
          <p className="leading-7">
            첫째는 이 글이 다룬 것입니다. 수량이 받쳐 줘서 더 돌아가는 방법을 쓰고
            있을 수 있습니다. 둘째는 쪼개짐 쪽입니다. 그 회사가 잘해서가 아니라
            그 회사가 사는 중간재의 산업이 커져서 쌀 수 있습니다.
          </p>
          <p className="leading-7">
            셋째는 앞 글의 경계 조건입니다. 같은 일을 안에서 다루는 값이 밖에서
            사 오는 값보다 싸졌을 뿐일 수 있습니다. 넷째는 이 글의 범위 밖입니다.
            사 오는 쪽에 값을 깎게 할 힘이 있어서 쌀 수도 있는데, 그것은 값이
            어떻게 정해지는지의 문제이지 만드는 데 얼마가 드는지의 문제가
            아닙니다. 관찰된 값 하나로 이 넷을 가를 수는 없습니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="handoff" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          파는 쪽이 하나인 이유는 따로 세워야 합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            정리하면 이렇습니다. 하나당 값이 내려가는 것은 크기의 효과가 아니라{" "}
            <strong>방법이 바뀐 효과</strong>이고, 방법이 바뀔 수 있는 조건이
            수량입니다. 그 수량은 밖에서 주어진 것이 아니라 생산이 함께 키우는
            것이고, 커진 결과는 한 곳이 비대해지는 모양보다 조각이 갈라지는
            모양으로 나타납니다.
          </p>

          <p className="leading-7">
            그래서 다음 글은 이 글에서 빌려 올 수 없는 것을 따로 세워야 합니다.
            파는 쪽이 하나로 남는 자리가 분명히 있는데, 그 이유를 싸진다는 사실
            자체에서 끌어올 수는 없습니다. 끌어올 수 있는 것은 부품 2의 식
            하나입니다 — 그 방법이 열리는 최소 수량이 시장보다 클 때.
          </p>

          <p className="leading-7">
            <em>
              여기까지 읽으면 이 글의 질문에 답이 나왔습니다. 싸지는 힘은 크기가
              아니라 방법에서 오고, 방법은 수량이 열며, 수량은 생산이 함께
              키웁니다.
            </em>
          </p>

          <p className="leading-7">
            그리고 하나가 남은 다음에 묻게 되는 것은 값입니다. 1단계에서 값은
            사려는 쪽과 팔려는 쪽이 만나 정해졌고, 아무도 그 값을 고르지
            않았습니다. 파는 쪽이 하나면 그 쪽이 값을 <strong>고릅니다</strong>.
            무엇을 보고 고르는지, 그리고 그 값이 1단계에서 세운 균형값{" "}
            <code>P* = 7</code>에서 어디로 움직이는지가 다음 글의 숫자입니다.
          </p>

          <h3 className="mt-10 mb-4 text-lg font-bold">
            읽고 나서 맞춰 볼 질문
          </h3>

          <p className="leading-7">
            1. 먼저 드는 몫이 120이고 하나당 값이 10에서 7로 내려간다면 그 방법이
            열리는 최소 수량은 몇 개입니까. <strong>(답: 부품 2절)</strong>
          </p>

          <p className="leading-7">
            2. 어떤 나라에서만 쓰이는 생산 방법이 있습니다. 기술을 숨겨서가
            아니라면 무엇으로 설명할 수 있습니까.{" "}
            <strong>(답: 부품 2절)</strong>
          </p>

          <p className="leading-7">
            3. 한 업종에서 회사 수가 늘었는데 하나당 값은 내려갔습니다. 이것이 왜
            모순이 아닌지 말해 보십시오. <strong>(답: 부품 4절)</strong>
          </p>
        </div>

        <ContentBoundary article="scale-and-cost-structure" />
      </section>
    </div>
  );
}

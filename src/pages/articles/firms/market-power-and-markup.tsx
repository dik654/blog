import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import PriceChoiceViz from "./market-power-and-markup/viz/PriceChoiceViz";
import MarkupViz from "./market-power-and-markup/viz/MarkupViz";

/**
 * 혼자 팔면 값을 고르게 됩니다
 *
 * 경제 2단계 3편. 1편은 조직의 경계를, 2편은 싸지는 구조를 셌고 둘 다
 * 조직을 값을 받아들이는 쪽으로 두었다. 여기서 그 전제를 뗀다. 원자료는
 * Cournot 1838(Bacon 1897 영역)의 제5장으로, 혼자 파는 쪽의 멈추는 조건과
 * 값이 한계비용보다 반드시 높다는 것이 거기 있다. 틈의 크기가 수요의
 * 민감도로 정해진다는 형태는 그 식에서 이 글이 직접 유도한다.
 */
export default function MarketPowerAndMarkupArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          1단계에서는 아무도 값을 고르지 않았습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            1단계에서 값은{" "}
            <Link to="/economics/prices/surplus-and-efficiency">
              사려는 쪽과 팔려는 쪽이 만난 자리
            </Link>
            였습니다. 아무도 그 값을 정하지 않았고, 모두가 그 값을 보고 자기
            몫을 정했습니다. 2단계의 앞 두 편도 그 전제를 그대로 썼습니다.
            조직은 밖의 값을 받아들이고 안팎을 가를 뿐이었습니다.
          </p>

          <p className="leading-7">
            그 전제가 깨지는 자리가 있습니다. 앞 글에서 본 조건 그대로입니다.
            어떤 조각에서{" "}
            <Link to="/economics/firms/scale-and-cost-structure">
              돌아가는 방법이 열리는 최소 수량
            </Link>
            이 시장 전체보다 크면, 둘로 나눠서는 둘 다 그 방법을 못 쓰고 하나가
            다 만드는 쪽이 쌉니다. 그렇게 파는 쪽이 하나로 남으면 값은 더 이상
            주어지지 않습니다.
          </p>

          <p className="leading-7">
            <strong>
              그러면 혼자 파는 쪽은 값을 어디에 둘까요. 그리고 그 값은 아무도
              고르지 않았을 때의 값과 얼마나, 왜 다를까요.
            </strong>{" "}
            답은 1838년에 이미 식으로 적혀 있습니다.
          </p>
        </div>

        <PriceChoiceViz />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            다섯 부품입니다. 혼자 팔면 무엇을 마주하는지, 하나 더 팔 때 실제로
            늘어나는 돈이 얼마인지, 그래서 어디서 멈추는지, 벌어진 틈의 크기를
            무엇이 정하는지, 그리고 그 틈이 옮겨 가는 몫만 만드는 것이 아니라는
            점입니다.
          </p>

          <p className="leading-7">
            <em>
              여기까지만 읽어도 이 글의 질문은 잡힙니다 — 아무도 고르지 않던 값이
              누군가 고르는 값이 되면 그 값은 어디에 멈추는가입니다.
            </em>
          </p>
        </div>
      </section>

      <section id="facing-demand" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 1. 혼자 팔면 점 하나가 아니라 선 전체를 마주합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            여럿이 팔 때 파는 쪽 하나가 보는 것은 값 하나입니다. 그 값에 내놓으면
            원하는 만큼 팔리고, 조금이라도 더 부르면 한 개도 안 팔립니다. 자기가
            얼마를 내놓든 값은 꿈쩍하지 않습니다.
          </p>

          <p className="leading-7">
            혼자 팔면 마주하는 것이 달라집니다. 값마다 팔리는 양이 다른{" "}
            <strong>선 전체</strong>를 마주합니다. 이제 값을 고를 수 있는데,
            고를 수 있는 것은 값 하나뿐이고 수량은 따라옵니다. 값과 수량을 따로
            고를 수는 없습니다.
          </p>

          <p className="leading-7">
            Cournot이 1838년에 든 예가 광천수입니다. 샘 하나를 가진 사람이 리터당
            100프랑을 부를 수는 있지만, 그러면 거의 팔리지 않는 것을 곧 알게
            됩니다. 그래서 값을 차차 내려 가장 큰 몫이 남는 자리를 찾습니다. 이
            문장이 값을 고른다는 것의 정의입니다 — 부르는 것은 자유지만 팔리는
            양은 자유가 아닙니다.
          </p>
        </div>

        <CitationBlock
          source="A. Cournot, 『Researches into the Mathematical Principles of the Theory of Wealth』 (1838), N. T. Bacon 영역 1897, 제5장 Of Monopoly, 56–61쪽"
          citeKey={1}
          href="https://archive.org/details/researchesintom00fishgoog"
        >
          56쪽 §26의 문장입니다. 값을 차차 내려 “the value of <em>p</em> which
          renders the product <em>pF(p)</em> a maximum”에 이른다고 적고, 그
          조건을 식 (1) <em>F(p) + pF′(p) = 0</em>으로 둡니다. 여기서{" "}
          <em>F(p)</em>가 값에 따라 팔리는 양, 즉 이 글의 수요 선입니다.
          Internet Archive의 1897년 영역본 스캔을 받아 읽었고, 식과 인용 문장은
          해당 쪽 이미지를 직접 열어 대조했습니다. 1838년 프랑스어 원본이 아니라
          영역본을 읽은 것입니다.
        </CitationBlock>

        <TermBreakdown
          title="마주하는 것이 다릅니다"
          description="자기가 내놓는 양이 값을 움직이느냐가 둘을 가릅니다."
          items={[
            {
              term: "여럿이 팔 때",
              description:
                "값 하나를 마주합니다. 자기가 얼마를 내놓든 그 값은 그대로입니다.",
              example:
                "값 7에 내놓으면 원하는 만큼 팔리고, 7.1을 부르면 한 개도 안 팔립니다.",
              boundary:
                "고를 것이 수량뿐이므로, 하나 더 팔아 늘어나는 돈은 늘 값과 같습니다.",
            },
            {
              term: "혼자 팔 때",
              description:
                "값마다 팔리는 양이 다른 선 전체를 마주합니다. 값을 고르면 수량이 따라옵니다.",
              example:
                "10을 부르면 3개, 9로 내리면 4개가 팔립니다. 둘을 따로 고를 수는 없습니다.",
              boundary:
                "하나 더 팔려면 값을 내려야 하고, 그 내린 값은 이미 팔던 것에도 적용됩니다.",
            },
          ]}
        />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            <em>
              이 절에서 무엇이 달라졌는지는 잡혔습니다. 그 차이가 셈에
              구체적으로 얼마를 더하고 빼는지가 다음 부품입니다.
            </em>
          </p>
        </div>
      </section>

      <section id="marginal-revenue" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 2. 하나 더 팔 때 늘어나는 돈은 그 값보다 낮습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            값을 10에서 9로 내려 하나를 더 판다고 해 봅시다. 좋은 일만 생기는
            것이 아닙니다. 새 손님에게서 9를 더 받지만, 원래 10에 사던 3명에게도
            이제 9를 받습니다. 하나당 1씩, 모두 3이 깎입니다. 늘어난 돈은 9가
            아니라 9에서 3을 뺀 6입니다.
          </p>

          <p className="leading-7">
            이 둘째 몫이 이 글 전체의 핵심입니다. 여럿이 팔 때는 이 몫이 없습니다.
            값이 꿈쩍하지 않으니 이미 팔던 것에서 깎일 것도 없습니다. 혼자 팔면
            늘 생기고, <strong>이미 팔던 수량이 많을수록 커집니다.</strong>
          </p>

          <p className="leading-7">
            그래서 하나 더 팔아 늘어나는 돈은 그때 받는 값보다 반드시 낮습니다.
            위 그림의 네 번째 장면에서 빨간 선이 그 늘어나는 돈이고, 수요 선보다
            두 배 빠르게 내려갑니다. 멈추는 자리를 정할 때 보는 것은 값이 아니라
            이 선입니다.
          </p>

          <p className="leading-7">
            <em>
              이제 멈출 때 무엇을 보는지 알게 됩니다. 그 선으로 실제로
              멈춰 보는 것이 다음 부품입니다.
            </em>
          </p>
        </div>
      </section>

      <section id="stopping-point" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 3. 멈추는 자리는 늘어나는 돈과 늘어나는 값이 같아지는 곳입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            규칙 자체는 앞의 두 글과 같은 모양입니다. 하나를 더 할 때 얻는 것과
            드는 것을 견주어, 얻는 쪽이 크면 더 하고 작아지면 멈춥니다. 달라진
            것은 얻는 쪽의 내용뿐입니다. 이제 얻는 것은 값이 아니라 깎이는 몫을
            뺀 나머지입니다.
          </p>
        </div>

        <MarkupViz />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            Cournot은 만드는 데 값이 드는 경우로 넘어가 이 조건을 식으로 적었고,
            거기서 한 가지를 못 박았습니다. 이렇게 정해진 값은{" "}
            <strong>반드시 한계비용보다 높습니다.</strong> 이유는 간단합니다.
            하나 더 만들어 드는 값이 하나 더 팔아 늘어나는 돈보다 커지는 순간
            멈추는데, 늘어나는 돈이 이미 값보다 낮으므로 멈춘 자리의 값은 그보다
            더 위에 있습니다.
          </p>
        </div>

        <CitationBlock
          source="A. Cournot (1838), Bacon 영역 1897, 57쪽 식 (2) · 59쪽 §29"
          citeKey={2}
          href="https://archive.org/details/researchesintom00fishgoog"
        >
          만드는 값 <em>φ(D)</em>를 넣은 조건이 57쪽의 식 (2)입니다 —{" "}
          <em>D + (dD/dp)·[p − d[φ(D)]/dD] = 0</em>. 59쪽 §29는 여기서{" "}
          “necessarily <em>p</em> &gt; <em>d[φ(D)]/dD</em>”를 끌어내고, 그 이유를
          “the producer will always stop when the increase in expense exceeds
          the increase in receipts”로 적습니다. 두 쪽 모두 이미지를 열어
          대조했습니다. <em>d[φ(D)]/dD</em>가 오늘 말로 한계비용입니다.
        </CitationBlock>

        <AlgorithmBlock
          title="혼자 파는 쪽이 값을 정하는 절차"
          input={[
            "수요: 값마다 팔리는 양",
            "φ′(D): 하나 더 만드는 데 드는 값",
            "현재 수량 D",
          ]}
          steps={[
            {
              code: "늘어나는 돈 = 지금 값 − (이미 팔던 수량에서 깎이는 몫)",
              note: "하나 더 팔려면 값을 내려야 하고, 내린 값이 이미 팔던 것에도 적용되므로 그 몫을 뺍니다.",
            },
            {
              code: "늘어나는 돈 > φ′(D) 이면 한 개 더 판다",
              note: "얻는 쪽이 크므로 수량을 늘립니다. 이때 값은 조금 내려갑니다.",
            },
            {
              code: "늘어나는 돈 = φ′(D) 에서 멈춘다",
              note: "Cournot의 식 (2)입니다. 더 늘리면 드는 값이 늘어나는 돈을 넘어섭니다.",
            },
            {
              code: "값은 그 수량에서 수요 선을 올려다봐 읽는다",
              note: "멈추는 자리를 정하는 것은 늘어나는 돈이지만, 받는 값은 그 수량에서 사람들이 쳐주는 값입니다. 그래서 값이 한계비용보다 위에 남습니다.",
            },
          ]}
          output="수량 하나와 그 위에서 읽히는 값 하나 — 그리고 둘 사이에 벌어진 틈"
          repeatUntil="늘어나는 돈이 하나 더 만드는 값과 같아질 때까지"
        />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            <em>
              여기서 끊어도 틈이 생긴다는 것까지는 셀 수 있습니다. 그 틈이
              얼마나 벌어지는지는 아직 세지 않았습니다.
            </em>
          </p>
        </div>
      </section>

      <section id="markup-size" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 4. 틈의 크기는 수요가 얼마나 민감한가로 정해집니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            틈이 생긴다는 것까지는 Cournot의 식이 줍니다. 그런데 그 틈이 얼마나
            벌어지는지는 무엇이 정할까요. 흔히 떠올리는 답은 그 회사가 얼마나
            큰지나 얼마나 싸게 만드는지입니다. 같은 식을 조금만 옮겨 적으면 다른
            답이 나옵니다.
          </p>
        </div>

        <ExplainedFormula
          question="값과 한계비용 사이의 틈은 얼마나 벌어집니까"
          idea={
            <>
              Cournot의 식 (2)를 값으로 나누어 정리하면, 틈의 비율이{" "}
              <strong>수요가 값에 얼마나 민감한지</strong> 하나로 적힙니다.
              둔할수록 틈이 벌어지고, 민감할수록 좁아집니다.
            </>
          }
          formula={String.raw`\frac{p - \varphi'(D)}{p} \;=\; \frac{1}{|\varepsilon|}`}
          annotatedFormula={String.raw`\underbrace{\frac{p - \varphi'(D)}{p}}_{\text{값에서 틈이 차지하는 몫}} \;=\; \underbrace{\frac{1}{|\varepsilon|}}_{\text{수요가 둔할수록 커지는 값}}`}
          operations={[
            {
              expression: String.raw`D + \frac{dD}{dp}\left[p - \varphi'(D)\right] = 0`,
              annotation: ["Cournot 57쪽의 식 (2)", "멈추는 자리의 조건입니다"],
            },
            {
              expression: String.raw`\varepsilon = \frac{dD}{dp}\cdot\frac{p}{D}`,
              annotation: [
                "값이 1% 바뀔 때 수량이 몇 % 바뀌는지",
                "수요 선이 눕든 서든 이 한 수로 담깁니다",
              ],
            },
            {
              expression: String.raw`|\varepsilon| \to \infty`,
              annotation: [
                "조금만 올려도 다 떠나는 경우",
                "틈이 0이 되어 1단계의 값으로 돌아옵니다",
              ],
            },
          ]}
          terms={[
            {
              symbol: "p",
              name: "고른 값",
              description: "멈춘 수량에서 수요 선을 올려다봐 읽은 값입니다.",
            },
            {
              symbol: String.raw`\varphi'(D)`,
              name: "하나 더 만드는 데 드는 값",
              description:
                "Cournot의 표기 그대로입니다. 오늘 말로 한계비용이고, 1단계에서 값이 멈추던 자리입니다.",
            },
            {
              symbol: String.raw`\varepsilon`,
              name: "수요의 민감도",
              description:
                "값이 1% 오를 때 팔리는 양이 몇 % 줄어드는지입니다. 음수이므로 절댓값으로 씁니다.",
            },
          ]}
          interpretation="틈의 크기는 파는 쪽이 얼마나 크거나 얼마나 싸게 만드는가가 아니라, 사는 쪽이 값에 얼마나 민감한가로 정해집니다. 대신할 것이 많을수록 민감해지므로, 틈을 좁히는 것은 같은 것을 파는 상대만이 아니라 대신할 수 있는 모든 것입니다."
          assumptions={[
            "모두에게 같은 값을 받는다고 둡니다. 손님마다 다른 값을 받을 수 있으면 다른 식이 됩니다.",
            "한계비용을 알고 있다고 둡니다. 실제로는 여러 물건을 함께 만드는 곳에서 이 값을 가르는 것 자체가 다투어집니다.",
            "민감도는 멈춘 그 자리에서 잰 값입니다. 수요 선 전체에서 하나로 고정된 수가 아닙니다.",
          ]}
        />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            위 그림의 마지막 장면이 이 식입니다. 두 수요 선은 1단계의 균형점을
            똑같이 지나도록 맞췄습니다. 그래서 아무도 값을 고르지 않았을 때의
            자리는 둘 다 수량 6, 값 7로 같습니다. 그런데 혼자 팔게 하면 민감한
            쪽은 값이 10에서 멈추고 둔한 쪽은 13에서 멈춥니다. 틈은 30%와 46%로
            갈립니다. <strong>크기도 비용도 같은데 값이 다릅니다.</strong>
          </p>

          <p className="leading-7">
            여기서 1단계의 한 문장이 다시 살아납니다. 값이 하는 일은 흩어진 지식을
            옮기는 것이었습니다. 혼자 파는 쪽이 고르는 값에는 그 지식에 더해 사는
            쪽이 얼마나 빠져나갈 수 있는지가 함께 적혀 있습니다. 값 하나를 보고는
            둘을 가를 수 없습니다.
          </p>

          <p className="leading-7">
            <em>
              이 절까지 오면 틈의 크기를 무엇이 정하는지 알게 됩니다. 남은 것은
              그 틈이 세상에서 무엇을 만드는가입니다.
            </em>
          </p>
        </div>
      </section>

      <section id="what-is-lost" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 5. 틈은 옮겨 가는 몫만이 아니라 사라지는 몫을 만듭니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            값이 7에서 10으로 올랐으니 사는 쪽이 3씩 더 내고 파는 쪽이 3씩 더
            받습니다. 여기까지는 <strong>옮겨 간 몫</strong>입니다. 누가 가져가야
            옳은지는 다툴 수 있어도, 세상에서 없어진 것은 없습니다.
          </p>

          <p className="leading-7">
            그런데 수량도 6에서 3으로 줄었습니다. 줄어든 3개는 만들었더라면 드는
            값보다 사람들이 더 쳐주었을 것들입니다. 7에 만들 수 있는데 8을
            쳐주겠다는 사람이 있었고, 그 거래는 이제 일어나지 않습니다. 이 몫은
            누구에게도 가지 않습니다. 1단계에서{" "}
            <Link to="/economics/prices/surplus-and-efficiency">
              값에 상한을 씌웠을 때
            </Link>{" "}
            보았던 바로 그 삼각형이고, 이번에는 상한을 씌운 사람 없이 생깁니다.
          </p>

          <p className="leading-7">
            그래서 이 문제를 이익이 너무 많다는 쪽으로만 읽으면 절반을 놓칩니다.
            이익은 옮겨 간 몫이고, 그 자체로는 누가 갖느냐의 문제입니다. 사라진
            몫은 누가 갖느냐의 문제가 아니라{" "}
            <strong>아예 만들어지지 않은 몫</strong>입니다. 그리고 그것을 만든
            것은 높은 값이 아니라 줄어든 수량입니다.
          </p>

          <p className="leading-7">
            <em>
              여기서 이 글의 답이 끝납니다. 값은 늘어나는 돈이
              한계비용과 만나는 수량에서 멈추고, 그 위에 민감도만큼 떠 있으며, 그
              틈과 함께 일어나지 않은 거래가 남습니다.
            </em>
          </p>
        </div>

        <ProgressiveDetail
          title="그러면 혼자 파는 쪽은 늘 나쁜 것입니까"
          preview="사라지는 몫이 생긴다는 것과 그래서 쪼개는 편이 낫다는 것은 다른 주장입니다."
        >
          <p className="leading-7">
            앞 글의 조건을 떠올려야 합니다. 하나만 남은 이유가 그 조각의 최소
            수량이 시장보다 컸기 때문이라면, 둘로 쪼개면 둘 다 그 방법을 못 씁니다.
            만드는 값 자체가 올라가므로 사라지는 삼각형이 줄어드는 대신 다른 몫이
            커집니다. 어느 쪽이 큰지는 미리 정해져 있지 않고 숫자를 재야 압니다.
          </p>
          <p className="leading-7">
            또 이 글의 셈은 한 시점의 것입니다. 틈이 있어야 먼저 들이는 몫을
            회수할 수 있어서 애초에 그 방법을 열게 된 경우도 있습니다. 1단계의{" "}
            <Link to="/economics/prices/surplus-and-efficiency">
              효율은 공정함이 아니다
            </Link>
            와 같은 자리에서, 사라지는 몫의 크기를 재는 것과 무엇을 할지 정하는
            것은 다른 단계입니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="handoff" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          값을 고르는 힘까지 왔고, 남은 것은 사람입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            세 편으로 조직을 한 바퀴 돌았습니다. 조직은{" "}
            <strong>값을 쓰는 것이 비싼 자리</strong>에서 생기고 안팎의 값이
            같아지는 자리에서 멈춥니다. 그 안에서 값이 내려가는 것은 커져서가
            아니라 돌아가는 방법이 열려서입니다. 그리고 어떤 조각에서 하나만
            남으면, 값은 주어지는 것이 아니라 고르는 것이 되고 그 값은 한계비용
            위에 수요의 민감도만큼 떠 있습니다.
          </p>

          <p className="leading-7">
            여기까지 오는 동안 한 가지를 계속 밖에 두었습니다. 조직 안에서 일하는
            사람입니다. 1편에서 고용 계약은 지시를 받는 범위만 적힌 약속이었고, 그
            범위 안에서 무엇을 할지는 지시가 정했습니다. 그런데 그 약속의 값, 즉
            임금은 누가 어떻게 정합니까.
          </p>

          <p className="leading-7">
            다음 두 편이 그 자리입니다. 임금이 다른 값들과 같은 방식으로 정해지는
            부분과 그렇지 않은 부분을 가르고, 그다음 그렇게 정해진 몫들이 사람
            사이에 어떻게 벌어지는지를 봅니다. 이번 글에서 본 틈이 거기서 한 번 더
            나옵니다 — 사는 쪽이 하나일 때의 값도 같은 구조로 정해지기
            때문입니다.
          </p>

          <h3 className="mt-10 mb-4 text-lg font-bold">
            읽고 나서 맞춰 볼 질문
          </h3>

          <p className="leading-7">
            1. 값 12에 2개를 팔던 곳이 11로 내려 3개를 팝니다. 늘어난 돈은
            얼마입니까. <strong>(답: 부품 2절)</strong>
          </p>

          <p className="leading-7">
            2. 어떤 약에 비슷한 대체약이 여럿 나왔습니다. 그 약을 만드는 곳의
            규모와 비용이 그대로여도 값이 내려가는 이유를 말해 보십시오.{" "}
            <strong>(답: 부품 4절)</strong>
          </p>

          <p className="leading-7">
            3. 값이 올라 파는 쪽이 더 번 몫과, 거래가 일어나지 않아 사라진 몫은
            무엇이 다릅니까. <strong>(답: 부품 5절)</strong>
          </p>
        </div>

        <ContentBoundary article="market-power-and-markup" />
      </section>
    </div>
  );
}

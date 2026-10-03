import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import TwoRatiosViz from "./why-per-head-stalls/viz/TwoRatiosViz";
import CheckLoopViz from "./why-per-head-stalls/viz/CheckLoopViz";

/**
 * 총량이 늘어도 한 사람 몫은 제자리일 수 있습니다
 *
 * 경제 2단계 6편, 거시 1편. contract 1.3의 층위 사다리를 따른다. 원자료는
 * Malthus(1798) 초판이고 25~27쪽의 숫자와 문장은 초판 facsimile 쪽
 * 이미지로 대조했다. 이 글은 그의 결론을 지지하지 않는다 — 셈을 끝까지
 * 따라가 보이고, 예측이 빗나간 뒤에 어느 가정이 깨졌는지를 짚는 것이
 * 목적이다.
 */
export default function WhyPerHeadStallsArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          100년 뒤에 7,700만 명의 몫이 비어 있다는 셈이 있었습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            섬 하나에 700만 명이 살고 지금 거두는 양이 딱 그 700만 명을 먹여 살린다고 해 봅시다. 25년마다 사람은 두
            배가 되고 거두는 양은 25년마다 지금 거두는 만큼씩 더해진다고 둡니다. 100년 뒤에 사람은 1억 1,200만 명이고
            먹일 수 있는 것은 3,500만 명분입니다. 7,700만 명의 몫이 비어 있습니다.
          </p>

          <p className="leading-7">
            1798년에 적힌 셈입니다. 눈여겨볼 것은 결론이 아니라 구조입니다. 이
            셈에서 <strong>양쪽 다 늘어납니다.</strong> 사람도 늘고 거두는 양도
            늘어 둘 다 100년 전보다 훨씬 많습니다. 그런데 한 사람에게 돌아가는
            몫은 내려갔습니다.
          </p>

          <p className="leading-7">
            <strong>
              총량이 커지는 것과 한 사람 몫이 올라가는 것은 다른 일입니다. 그러면
              무엇이 둘을 가릅니까.
            </strong>{" "}
            앞의 다섯 편은 한 가게와 한 사람의 이야기였습니다. 여기서부터는
            그것들을 전부 더한 숫자를 다루는데, 더한 숫자를 읽는 첫 번째 규칙이
            이 글의 내용입니다.
          </p>
        </div>

        <TwoRatiosViz />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            다섯 부품입니다. 두 줄이 늘어나는 방식이 어떻게 다른지, 그 둘을 나눈
            값이 무엇을 말하는지, 그 값이 왜 한자리에 묶이는지, 실제로는 왜
            묶이지 않았는지, 그래서 남는 질문이 무엇인지입니다.
          </p>

          <p className="leading-7">
            <em>
              여기까지만 읽어도 이 글이 겨루는 자리는 잡힙니다 — 총량이 커졌다는
              말과 살림이 나아졌다는 말은 같은 말이 아닙니다.
            </em>
          </p>
        </div>
      </section>

      <section id="two-ratios" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 1. 한쪽은 곱으로 늘고 다른 쪽은 더하기로 늡니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            사람 쪽부터 봅니다. 25년마다 두 배라는 것은 700만이 1,400만, 2,800만,
            5,600만, 1억 1,200만이 된다는 뜻입니다. 매번 <strong>직전 값에
            곱해집니다.</strong> 그래서 뒤로 갈수록 한 번에 늘어나는 양 자체가
            커집니다. 네 번째 25년에는 한 번에 5,600만이 늘어납니다.
          </p>

          <p className="leading-7">
            거두는 양 쪽은 다릅니다. 25년마다 지금 거두는 만큼씩 더해진다는 것은
            700만분, 1,400만분, 2,100만분, 2,800만분, 3,500만분이 된다는
            뜻입니다. 매번 <strong>같은 양이 더해집니다.</strong> 네 번째
            25년에도 700만분만 늘어납니다.
          </p>

          <p className="leading-7">
            곱으로 느는 쪽과 더해서 느는 쪽을 나란히 두면 처음에는 차이가 잘 보이지 않습니다. 첫 25년에는 둘 다 두 배가
            되어 딱 맞습니다. 차이는 시간이 지나야 벌어지고 한번 벌어지기 시작하면 좁혀지지 않습니다.
          </p>
        </div>

        <TermBreakdown
          title="늘어나는 두 가지 방식"
          description="매번 무엇을 하느냐가 다르고, 그 차이가 시간이 갈수록 커집니다."
          items={[
            {
              term: "곱으로 느는 쪽",
              description:
                "매번 직전 값에 일정한 배수를 곱합니다. 늘어나는 양 자체가 함께 커집니다.",
              example:
                "700만 → 1,400만 → 2,800만 → 5,600만. 한 번에 늘어나는 양이 700만에서 2,800만으로 커집니다.",
              boundary:
                "배수가 1보다 크기만 하면 결국 어떤 더하기도 따라잡습니다. 다만 그 결국이 언제인지는 배수가 정합니다.",
            },
            {
              term: "더해서 느는 쪽",
              description:
                "매번 같은 양을 더합니다. 늘어나는 양이 처음부터 끝까지 같습니다.",
              example:
                "700만분 → 1,400만분 → 2,100만분 → 2,800만분. 한 번에 늘어나는 양은 늘 700만분입니다.",
              boundary:
                "총량은 계속 커집니다. 느리게 느는 것과 늘지 않는 것은 다른 말입니다.",
            },
          ]}
        />

        <CitationBlock
          source="T. R. Malthus, 『An Essay on the Principle of Population』 (London: J. Johnson, 1798) 초판, 14·21·25~28쪽"
          citeKey={1}
          href="https://archive.org/details/essayonprincipl00malt"
        >
          두 비율의 선언은 초판 14쪽입니다 — “Population, when unchecked,
          increases in a geometrical ratio. Subsistence increases only in an
          arithmetical ratio.” 섬의 100년 셈은 25~26쪽에 있고, 원문은 “the
          population would be one hundred and twelve millions, and the means of
          subsistence only equal to the support of thirty-five millions; which
          would leave a population of seventy-seven millions totally unprovided
          for”입니다. 세계로 넓힌 두 수열(1·2·4·8… 대 1·2·3·4…)과 225년 뒤의
          “512 to 10”은 28쪽입니다. 25년마다 두 배라는 비율은 당시 미국의 관찰을
          근거로 삼은 것이라고 21쪽에 적습니다. Internet Archive의
          1798년 초판 스캔을 내려받아 읽었고, 14쪽과 26쪽의 문장은 해당 쪽 이미지를 직접 열어
          대조했고, 21·25·28쪽은 같은 스캔의 OCR 본문에 찍힌 쪽 머리글로
          확인했습니다.
        </CitationBlock>

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            <em>
              두 줄이 어떻게 갈라지는지는 이 절에서 잡혔습니다. 그 둘을 어떻게
              하나의 숫자로 묶는지가 다음 부품입니다.
            </em>
          </p>
        </div>
      </section>

      <section id="per-head" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 2. 두 줄을 나누면 한 사람 몫이 나옵니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            총량 두 줄을 따로 보면 "둘 다 늘었다"는 말밖에 할 수 없습니다. 살림이
            나아졌는지 묻고 있다면 봐야 할 것은 한 줄을 다른 줄로 나눈 값입니다.
            먹일 수 있는 양을 사람 수로 나누면 한 사람에게 돌아가는 몫이 나옵니다.
          </p>
        </div>

        <ExplainedFormula
          question="총량이 커졌는데 살림이 나아졌는지는 어떻게 봅니까"
          idea={
            <>
              총량을 사람 수로 나눕니다. 그러면 분자와 분모가 각각 얼마나 빨리
              늘어나는지가 비교되고,{" "}
              <strong>분모가 더 빨리 늘면 총량이 커져도 이 값은 내려갑니다.</strong>
            </>
          }
          formula={String.raw`y_t \;=\; \frac{Y_t}{N_t}`}
          annotatedFormula={String.raw`y_t \;=\; \frac{\underbrace{Y_t}_{\text{거두는 양 전체}}}{\underbrace{N_t}_{\text{나눠 가질 사람 수}}}`}
          operations={[
            {
              expression: String.raw`Y_t = Y_0 + a\,t`,
              annotation: [
                "매번 같은 양을 더하는 경우",
                "t가 커져도 더해지는 a는 그대로입니다",
              ],
            },
            {
              expression: String.raw`N_t = N_0 \cdot 2^{\,t}`,
              annotation: [
                "매번 두 배가 되는 경우",
                "t가 커질수록 한 번에 늘어나는 양이 커집니다",
              ],
            },
            {
              expression: String.raw`\frac{Y_t}{N_t} \to 0`,
              annotation: [
                "분모가 분자를 따라잡고 지나칩니다",
                "총량이 계속 커져도 이 값은 내려갑니다",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`Y_t`,
              name: "거두는 양 전체",
              description:
                "그 해에 만들어진 것을 모두 더한 값입니다. 여기서는 먹일 수 있는 사람 수로 셉니다.",
            },
            {
              symbol: String.raw`N_t`,
              name: "나눠 가질 사람 수",
              description: "그 해의 인구입니다.",
            },
            {
              symbol: String.raw`y_t`,
              name: "한 사람 몫",
              description:
                "둘을 나눈 값입니다. 살림이 나아졌는지를 묻는다면 이 값을 봐야 합니다.",
            },
          ]}
          interpretation="분자와 분모가 늘어나는 방식이 다르면 총량의 방향과 한 사람 몫의 방향이 갈립니다. 둘 다 늘었다는 말로는 어느 쪽인지 알 수 없습니다."
          assumptions={[
            "모두가 똑같이 나눠 가진다고 둡니다. 실제로는 벌어짐이 있고, 그 벌어짐은 이 나눗셈에 담기지 않습니다.",
            "거두는 양을 사람 수로 셀 수 있다고 둡니다. 종류가 여럿이면 무엇을 얼마로 칠지 정하는 문제가 먼저 생깁니다.",
            "25년마다 두 배와 일정량 더하기는 Malthus가 둔 값입니다. 실제 값이 아니라 두 방식을 가르기 위한 설정입니다.",
          ]}
        />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            앞 그림의 세 번째 장면이 이 나눗셈입니다. 시작점에서 1이던 값이
            25년 뒤에도 1이고, 50년 뒤 0.75, 75년 뒤 0.5, 100년 뒤 0.31입니다.
            같은 기간에 거두는 양은 다섯 배가 되었습니다.{" "}
            <strong>다섯 배로 늘어난 총량과 3분의 1로 줄어든 한 사람 몫이 같은
            셈에서 나옵니다.</strong>
          </p>

          <p className="leading-7">
            여기에 1단계에서 본 것이 하나 더 겹칩니다. 이 나눗셈은 모두가
            똑같이 나눠 가진다고 두고 계산한 값이라 앞 글에서 본{" "}
            <Link to="/economics/labor/measuring-the-spread">
              벌어진 정도
            </Link>
            는 담기지 않습니다. 한 사람 몫이 올라가도 아래쪽 사람의 몫은 내려갈
            수 있습니다. 평균 하나로 두 질문에 답할 수는 없습니다.
          </p>

          <p className="leading-7">
            <em>
              이제 한 사람 몫을 계산할 수 있습니다. 그 값이 왜 한자리에
              묶이는지가 다음 부품입니다.
            </em>
          </p>
        </div>
      </section>

      <section id="the-check" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 3. 줄어든 몫이 사람 수를 도로 눌러 제자리로 되돌립니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            지금까지는 사람이 알아서 두 배씩 는다고 두었습니다. 그런데 100년 뒤에
            7,700만 명의 몫이 비어 있다는 것은 그 사람들이 실제로 태어나 굶는다는
            뜻이 아닙니다. 그만큼이 <strong>애초에 태어나지 않거나 살아남지
            못한다</strong>는 뜻입니다.
          </p>
        </div>

        <CheckLoopViz />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            그러면 셈이 고리가 됩니다. 사람이 늘면 한 사람 몫이 줄고, 몫이 줄면
            먹고살기 어려워지고, 어려워지면 사람 수가 눌리고, 눌리면 한 사람
            몫이 다시 올라갑니다. 늘어난 것이 <strong>그 늘어남을 막는
            쪽으로</strong> 돌아옵니다.
          </p>

          <p className="leading-7">
            이 고리가 닫혀 있는 한 결론은 하나입니다. 한 사람 몫은 오르내릴 수는
            있어도 긴 눈으로 보면 한자리에 묶입니다. 거두는 양이 늘면 그만큼
            사람이 늘어 몫이 도로 내려가기 때문입니다. 총량은 얼마든지 커질 수
            있는데 살림은 나아지지 않습니다.
          </p>
        </div>

        <AlgorithmBlock
          title="한 해를 넘길 때 두 줄이 어떻게 바뀌는지"
          input={[
            "N: 올해 사람 수",
            "Y: 올해 거두는 양 (먹일 수 있는 사람 수로 셈)",
            "a: 한 기간에 더해지는 거두는 양",
          ]}
          steps={[
            {
              code: "y ← Y ÷ N",
              note: "한 사람 몫을 먼저 구합니다. 이 값이 이후 모든 판단의 입력입니다.",
            },
            {
              code: "Y ← Y + a",
              note: "거두는 양은 사람 수와 무관하게 같은 양만 더해집니다. 땅이 늘지 않기 때문이라는 것이 이 설정의 근거입니다.",
            },
            {
              code: "N ← N × g(y)",
              note: "사람 수가 늘어나는 배수가 한 사람 몫에 달려 있습니다. 몫이 넉넉하면 g가 1보다 크고, 모자라면 1보다 작아집니다. 이 한 줄이 고리를 닫습니다.",
            },
          ]}
          output="g(y)=1이 되는 y 하나 — 한 사람 몫이 머무는 자리"
          repeatUntil="사람 수가 더 늘지도 줄지도 않는 y에 닿을 때까지"
        />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            <em>
              이쯤에서 끊어도 이 셈의 결론은 다 나왔습니다. 남은 것은 그 결론이
              실제와 맞았는지입니다.
            </em>
          </p>
        </div>
      </section>

      <section id="what-broke" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 4. 예측은 빗나갔고, 어느 가정이 깨졌는지 짚을 수 있습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            이 글이 다룬 셈은 1798년에 적혔고 그 뒤 두 세기 동안 사람도 늘고 한 사람 몫도 함께 올랐습니다. 고리가 말한
            대로 되지 않았습니다. 그러면 무엇을 배울 수 있습니까.
          </p>

          <p className="leading-7">
            빗나간 예측을 다루는 방법은 두 가지입니다. 하나는 틀렸으니 버리는 것이고 다른 하나는 <strong>어느 가정이
            깨졌는지 짚는 것</strong>입니다. 뒤쪽이 쓸모 있는 이유는 고리 자체는 여전히 옳기 때문입니다. 세 가정이 다
            성립하면 지금도 같은 결론이 나옵니다.
          </p>

          <p className="leading-7">
            깨진 것은 둘입니다. 첫째, 거두는 양이 더하기로만 늘지 않았습니다. 같은 땅에서 거두는 양 자체가 바뀌었고 그 변화는
            더해지는 것이 아니라 곱해지는 쪽에 가까웠습니다. 둘째, 한 사람 몫이 늘었을 때 사람 수가 그만큼 늘지 않았습니다.
            고리의 마지막 화살표가 약해졌고 넉넉해질수록 아이를 덜 낳는 쪽으로 오히려 방향이 뒤집힌 곳도 있습니다.
          </p>

          <p className="leading-7">
            셋째 가정은 아직 깨지지 않았습니다. 땅이 늘지 않는다는 것은 지금도
            그렇습니다. 깨진 것은 땅이 늘었다는 것이 아니라{" "}
            <strong>같은 땅에서 거두는 양이 늘었다</strong>는 것입니다. 이
            구분이 다음 질문을 만듭니다.
          </p>
        </div>

        <ProgressiveDetail
          title="그러면 이 셈은 아무 데도 쓸모가 없습니까"
          preview="고리가 닫히는 조건이 성립하는 자리에서는 지금도 같은 결론이 나옵니다. 조건을 적어 두는 것이 이 셈의 쓸모입니다."
        >
          <p className="leading-7">
            이 셈은 세 가정이 성립할 때 무슨 일이 일어나는지를 말합니다. 거두는
            양이 고정된 양만큼만 늘고, 사람 수가 몫에 따라 늘고, 나눌 것이 더
            없는 조건입니다. 셋이 다 성립하는 자리에서는 지금도 한 사람 몫이
            제자리에 묶입니다.
          </p>
          <p className="leading-7">
            그래서 이 글은 그의 결론을 지지하지도 기각하지도 않습니다. 결론이
            조건부 명제라는 것을 보이고, 어느 조건이 깨졌는지 적는 데까지가 이
            글의 범위입니다. 앞 글에서{" "}
            <Link to="/economics/labor/wage-floor-natural-experiment">
              같은 바닥이 두 셈에서 반대 예측을 낳았던 것
            </Link>
            과 같은 구조입니다 — 결론보다 조건이 먼저입니다.
          </p>
        </ProgressiveDetail>

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            <em>
              이 대목까지 오면 왜 빗나갔는지까지 짚힙니다. 다음은 무엇이 한 사람 몫을 올렸는지입니다.
            </em>
          </p>
        </div>
      </section>

      <section id="what-it-leaves" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 5. 남는 질문은 무엇이 한 사람 몫을 올리는가입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            깨진 가정 둘 중에서 더 중요한 쪽은 첫째입니다. 같은 땅에서 거두는
            양이 늘었다는 것. 이 자리에 2단계의 앞 글들이 그대로 들어옵니다. 앞에서
            본 것은 <Link to="/economics/firms/scale-and-cost-structure">
              돌아가는 방법이 열리면 하나당 값이 내려간다
            </Link>
            는 구조였고 그 돌아감은 수량이 받쳐 줄 때 열렸습니다.
          </p>

          <p className="leading-7">
            같은 이야기를 나라 전체로 올리면 이렇게 됩니다. 사람이 늘면 나눌 것이
            줄어드는 쪽으로만 작용하는 것이 아니라, 수량이 커져 더 돌아가는
            방법이 열리는 쪽으로도 작용합니다. 두 힘이 반대 방향이고{" "}
            <strong>어느 쪽이 이기는지는 미리 정해져 있지 않습니다.</strong>{" "}
            Malthus의 셈은 뒤쪽 힘을 0으로 두었습니다.
          </p>

          <p className="leading-7">
            그래서 이 글이 닫는 것은 한 가지뿐입니다. 총량을 보고 살림을 말하면
            안 된다는 것, 그리고 한 사람 몫이 올라가려면 사람 수보다 빠르게 느는
            무언가가 있어야 한다는 것입니다. 그 무언가가 무엇인지는 이 글이
            답하지 않습니다.
          </p>

          <p className="leading-7">
            <em>
              이 글의 답은 여기서 끝납니다. 한 사람 몫은 두 줄의 나눗셈이고, 그 값이 묶이는 것은 고리가 닫혀 있을 때이며
              고리는 두 자리에서 풀렸습니다.
            </em>
          </p>
        </div>
      </section>

      <section id="handoff" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          더한 숫자를 읽는 규칙이 세 개 더 남았습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            거시는 더한 숫자를 다룹니다. 더하는 순간 개별 거래에서는 묻지 않던 질문이 생기고 이 글에서 본 것이 그중 첫
            번째였습니다 — 무엇으로 나누느냐에 따라 같은 사실이 반대로 읽힙니다.
          </p>

          <p className="leading-7">
            남은 세 편은 각각 다른 규칙을 다룹니다. 더한 숫자를 견주려면 값이
            변한 몫을 걷어내야 하고, 일자리를 세려면 누구를 셀지 먼저 정해야
            하며, 나라 밖과의 거래를 읽으려면 안에서 누가 이기고 누가 지는지를
            따로 봐야 합니다. 세 편 모두 숫자가 만들어지는 자리까지 내려가
            봅니다.
          </p>

          <h3 className="mt-10 mb-4 text-lg font-bold">
            읽고 나서 맞춰 볼 질문
          </h3>

          <p className="leading-7">
            1. 어떤 나라의 총생산이 10년 동안 60% 늘었습니다. 같은 기간 인구가
            80% 늘었다면 한 사람 몫은 어떻게 됐습니까.{" "}
            <strong>(답: 부품 2절)</strong>
          </p>

          <p className="leading-7">
            2. 고리의 마지막 화살표(몫이 늘면 사람 수가 는다)가 사라지면 한 사람
            몫은 어떻게 움직입니까. <strong>(답: 부품 3절)</strong>
          </p>

          <p className="leading-7">
            3. "땅이 늘지 않았으니 Malthus가 옳았다"는 말의 어디가 틀렸는지
            짚어 보십시오. <strong>(답: 부품 4절)</strong>
          </p>
        </div>

        <ContentBoundary article="why-per-head-stalls" />
      </section>
    </div>
  );
}

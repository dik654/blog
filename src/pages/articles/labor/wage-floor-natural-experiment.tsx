import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import TwoPredictionsViz from "./wage-floor-natural-experiment/viz/TwoPredictionsViz";
import WageStopViz from "./wage-floor-natural-experiment/viz/WageStopViz";
import MeasuredViz from "./wage-floor-natural-experiment/viz/MeasuredViz";

/**
 * 임금을 올리면 일자리가 준다는 예측을 실제로 재 봤습니다
 *
 * 경제 2단계 4편, 노동 1편. 설명 순서는 contract 1.3의 층위 사다리를 따른다.
 * 입구에서 이름 없이 작은 수치 사례와 검은 상자 세 개만 세우고, 부품 1~3에서
 * 같은 숫자 묶음으로 두 셈을 지은 뒤 이름을 붙이고, 부품 4에서 예측이 갈리는
 * 자리를 만들고, 부품 5에서 입구의 그 사례를 원문 표에 넣어 끝까지 따라간다.
 * 원자료는 Card·Krueger(1994)이며 표 3·표 7의 숫자와 인용 문장은 쪽 이미지로
 * 대조했다.
 */
export default function WageFloorNaturalExperimentArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          한 시간에 4.25달러 받던 사람이 5.05달러를 받게 되었습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            1992년 4월 1일, 미국 뉴저지주에서 시간당 임금의 바닥이 4.25달러에서 5.05달러로 올랐습니다. 바로 옆
            펜실베이니아주 동부에서는 같은 일을 하는 사람이 그대로 4.25달러를 받았습니다. 두 곳의 같은 업종 가게 410곳을
            바뀌기 직전에 한 번, 7~8개월 뒤에 한 번 더 세어 본 기록이 있습니다.
          </p>

          <p className="leading-7">
            이 숫자가 중요한 이유는 앞의 세 편이 세운 셈이 여기서 처음으로
            시험대에 오르기 때문입니다. 값이 오르면 덜 산다는 셈을 사람이 파는
            시간에 그대로 적용하면, 바닥을 올린 쪽에서 일자리가 줄어야 합니다.
            그런데 앞 글에서 본 다른 셈을 적용하면 늘어날 수도 있습니다. 두 셈이
            같은 자리에서 반대 방향을 가리킵니다.
          </p>

          <p className="leading-7">
            <strong>
              그러면 어느 쪽이 맞는지는 세어 보면 됩니다. 그리고 세어 본 결과는
              둘 중 하나를 고르는 것이 아니었습니다.
            </strong>{" "}
            이 글은 그 과정을 다섯 부품으로 따라갑니다. 지금은 아직 어느 셈에도
            이름을 붙이지 않습니다.
          </p>
        </div>

        <TwoPredictionsViz />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            덩어리는 셋입니다. 사람을 한 명 더 쓸 때 가게가 무엇을 얻고 무엇을
            내는지 세는 부분, 그 셈이 사는 쪽의 수에 따라 어떻게 달라지는지,
            그리고 실제로 센 숫자입니다. 앞의 둘이 부품 1부터 4까지이고 마지막이
            부품 5입니다.
          </p>

          <p className="leading-7">
            <em>
              여기까지 읽으면 이 글이 무엇을 겨루는지는 잡힙니다 — 한쪽만 바닥을
              올린 자리에서 일자리가 어느 쪽으로 움직였는가입니다.
            </em>
          </p>
        </div>
      </section>

      <section id="two-counts" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 1. 한 사람을 더 쓸 때 얻는 것과 내는 것을 셉니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            작은 가게 하나를 놓고 숫자를 세어 봅니다. 사람을 한 명 쓰면 한 시간에 13달러어치를 더 만들어 팝니다. 두 명째를
            쓰면 12달러어치가 더해지고 세 명째는 10달러어치입니다. 다섯 명째에 가면 8달러어치로 줄어듭니다.
          </p>

          <p className="leading-7">
            줄어드는 이유는 신비롭지 않습니다. 조리대와 계산대는 그대로인데 손만 늘기 때문입니다. 네 번째 사람은 세 번째 사람이
            비켜 줄 때를 기다리게 되고 그만큼 한 시간에 보태는 몫이 작아집니다. 이 줄어듦이 있어야 가게가 사람을 무한히 쓰지
            않는 이유가 생깁니다.
          </p>

          <p className="leading-7">
            내는 쪽은 임금입니다. 여기서 앞의 세 편과 다른 점이 하나 있습니다. 빵이나 부품은 더 사려고 해도 그 값이 보통
            그대로지만, 사람은 더 부르려면 더 쳐줘야 하는 경우가 많습니다. 이 가게가 있는 동네에서 시간당 4달러를 부르면 한
            명이 오고 5달러면 두 명, 8달러면 다섯 명이 옵니다. 더 좋은 자리를 포기하고 올 사람이 그만큼씩 늘어나기
            때문입니다.
          </p>
        </div>

        <WageStopViz />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            이제 두 줄이 생겼습니다. 한 명 더 써서 얻는 몫은 사람이 늘수록 내려가고, 한 명 더 부르려고 줘야 하는 임금은
            사람이 늘수록 올라갑니다. 어디서 멈출지는 이 두 줄을 어떻게 읽느냐에 달려 있습니다. 읽는 방법이 두 가지입니다.
          </p>

          <p className="leading-7">
            <em>
              여기까지 읽으면 멈추는 자리가 두 줄이 만나는 곳 근처라는 것까지는
              보입니다. 정확히 어디인지가 다음 두 부품에서 갈립니다.
            </em>
          </p>
        </div>
      </section>

      <section id="many-buyers" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 2. 사는 가게가 여럿이면 임금은 얻는 몫에서 멈춥니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            같은 동네에 비슷한 가게가 여럿 있다고 해 봅시다. 이때 가게 하나가 임금을 흔들 수는 없습니다. 동네 임금이
            8달러인데 7달러를 부르면 아무도 오지 않습니다. 9달러를 부르면 8달러로도 올 사람에게 괜히 더 주는 것이 됩니다.
            가게가 정할 수 있는 것은 몇 명을 쓸지뿐입니다.
          </p>

          <p className="leading-7">
            그러면 셈이 간단합니다. 한 명 더 써서 얻는 몫이 8달러보다 크면 쓰고
            작으면 쓰지 않습니다. 앞의 숫자로는 다섯 명째가 8달러어치를 보태므로
            다섯 명까지 쓰고 멈춥니다. 그리고 8달러를 불렀을 때 오는 사람도 마침
            다섯 명입니다. 두 줄이 만나는 자리가 그대로 답이 됩니다.
          </p>

          <p className="leading-7">
            여기서 세 가지에 이름을 붙입니다. 한 명을 더 써서 가게가 더 만들어
            파는 몫을 <strong>한계생산가치</strong>라고 부릅니다. 가게가 사람을
            원하는 것은 사람 자체가 아니라 그 사람이 만들 물건이 팔리기
            때문입니다. 이런 수요를 <strong>파생수요</strong>라고 합니다. 그리고
            지금처럼 사는 쪽이 여럿이라 아무도 값을 흔들 수 없는 상태가 1단계에서
            내내 쓰던 그 전제입니다.
          </p>
        </div>

        <TermBreakdown
          title="앞의 세 편과 같은 자리, 반대편"
          description="파는 쪽과 사는 쪽 중 어느 쪽이 하나인가만 다릅니다."
          items={[
            {
              term: "파는 쪽이 하나일 때 (앞 글)",
              description:
                "값을 고르게 되고, 하나 더 팔려면 이미 팔던 것의 값도 내려야 합니다.",
              example:
                "하나 더 팔아 늘어나는 돈이 그때 받는 값보다 낮고, 그래서 값이 한계비용 위에 남습니다.",
              boundary:
                "틈의 크기는 사는 쪽이 값에 얼마나 민감한지로 정해집니다.",
            },
            {
              term: "사는 쪽이 하나일 때 (이 글)",
              description:
                "임금을 고르게 되고, 한 명 더 부르려면 이미 일하던 사람의 임금도 올려야 합니다.",
              example:
                "한 명 더 써서 드는 값이 그때 주는 임금보다 높고, 그래서 임금이 한계생산가치 아래에 남습니다.",
              boundary:
                "틈의 크기는 파는 쪽이 임금에 얼마나 민감한지로 정해집니다.",
            },
          ]}
        />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            <em>
              여기까지 읽으면 교과서가 말하는 임금의 자리를 셀 수 있습니다. 바닥을
              8달러보다 높게 걸면 그 자리가 어떻게 밀리는지도 같은 표에서 바로
              읽힙니다.
            </em>
          </p>
        </div>
      </section>

      <section id="one-buyer" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 3. 사는 가게가 하나면 앞 글의 셈이 뒤집혀 나타납니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            이번에는 그 동네에 그 가게 하나뿐이라고 해 봅시다. 공장 하나가 있는 시골 마을이나 출퇴근할 수 있는 거리 안에
            비슷한 일자리가 거의 없는 경우입니다. 이제 가게가 임금을 고를 수 있습니다. 다만 고를 수 있는 것은 임금 하나뿐이고
            몇 명이 올지는 따라옵니다.
          </p>

          <p className="leading-7">
            네 번째 사람을 쓰고 싶다고 해 봅시다. 네 명을 부르려면 7달러를 줘야
            합니다. 그런데 이미 일하던 세 사람도 7달러를 받게 됩니다. 원래 6달러를
            주고 있었으니 세 사람에게서 1달러씩, 모두 3달러가 더 나갑니다. 네
            번째 사람을 쓰는 데 드는 값은 7달러가 아니라 10달러입니다.
          </p>

          <p className="leading-7">
            앞 글을 읽었다면 이 구조가 낯익을 것입니다.{" "}
            <Link to="/economics/firms/market-power-and-markup">
              혼자 파는 쪽이 하나 더 팔려고 값을 내리면
            </Link>{" "}
            이미 팔던 것에서 몫이 깎였습니다. 그 몫이 여기서는 이미 일하던
            사람에게 더 줘야 하는 몫으로 나타납니다. 부호만 뒤집힌 같은 셈입니다.
            이렇게 사는 쪽이 하나뿐인 상태를 <strong>수요독점</strong>이라고
            부릅니다.
          </p>

          <p className="leading-7">
            그래서 멈추는 자리가 당겨집니다. 네 번째 사람이 보태는 몫은
            9달러인데 쓰는 데 드는 값은 10달러이므로 쓰지 않습니다. 세 명에서
            멈추고 임금은 6달러입니다. 사는 쪽이 여럿일 때의 다섯 명·8달러와
            견주면 <strong>사람도 적고 임금도 낮습니다.</strong>
          </p>
        </div>

        <ExplainedFormula
          question="임금은 한계생산가치보다 얼마나 아래에 남습니까"
          idea={
            <>
              앞 글에서 값과 한계비용의 틈이 수요의 민감도로 정해졌듯이, 여기서는
              한계생산가치와 임금의 틈이{" "}
              <strong>사람이 임금에 얼마나 민감하게 모이는지</strong>로
              정해집니다. 둔하게 모일수록 틈이 벌어집니다.
            </>
          }
          formula={String.raw`\frac{v - w}{w} \;=\; \frac{1}{\eta}`}
          annotatedFormula={String.raw`\underbrace{\frac{v - w}{w}}_{\text{임금 대비 떼어 두는 몫}} \;=\; \underbrace{\frac{1}{\eta}}_{\text{사람이 둔하게 모일수록 커지는 값}}`}
          operations={[
            {
              expression: String.raw`w(n) \cdot n`,
              annotation: [
                "n명을 쓸 때 나가는 임금의 합",
                "한 명 더 부르면 w(n)도 함께 오릅니다",
              ],
            },
            {
              expression: String.raw`w(n) + n \cdot \frac{dw}{dn}`,
              annotation: [
                "한 명 더 쓸 때 실제로 더 나가는 값",
                "뒤 항이 이미 일하던 사람에게 더 주는 몫입니다",
              ],
            },
            {
              expression: String.raw`\eta = \frac{dn}{dw}\cdot\frac{w}{n}`,
              annotation: [
                "임금이 1% 오를 때 오는 사람이 몇 % 늘어나는지",
                "이 값이 클수록 틈이 좁아집니다",
              ],
            },
          ]}
          terms={[
            {
              symbol: "v",
              name: "한계생산가치",
              description:
                "마지막으로 쓴 사람이 한 시간에 더 만들어 파는 몫입니다. 위 표에서는 세 번째 사람의 10달러입니다.",
            },
            {
              symbol: "w",
              name: "실제로 주는 임금",
              description:
                "그 사람 수를 부르는 데 필요한 임금입니다. 위 표에서는 6달러입니다.",
            },
            {
              symbol: String.raw`\eta`,
              name: "사람이 모이는 민감도",
              description:
                "임금이 1% 오를 때 오는 사람이 몇 % 늘어나는지입니다. 옮길 자리가 많을수록 큽니다.",
            },
          ]}
          interpretation="틈의 크기는 가게가 얼마나 크거나 얼마나 인색한가가 아니라, 일하는 쪽이 다른 자리로 옮길 수 있는 정도로 정해집니다. 그래서 옮길 자리를 늘리는 것과 임금의 바닥을 올리는 것이 같은 틈을 서로 다른 쪽에서 좁힙니다."
          assumptions={[
            "모두에게 같은 임금을 준다고 둡니다. 사람마다 다른 임금을 줄 수 있으면 이 틈이 생기지 않습니다.",
            "민감도는 멈춘 그 자리에서 잰 값이지 공급 전체에 하나로 붙는 수가 아닙니다.",
            "표는 한 명 단위로 끊어 본 것입니다. 쪼개지 않고 이어서 풀면 3.3명·임금 6.3달러에서 멈추고 틈은 53%이며, 그 자리의 민감도 1.9의 역수와 맞습니다.",
          ]}
        />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            <em>
              여기까지 읽으면 두 셈을 모두 셀 수 있습니다. 이제 같은 바닥을
              양쪽에 걸어 보면 예측이 어디서 갈리는지가 나옵니다.
            </em>
          </p>
        </div>
      </section>

      <section id="two-predictions" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 4. 같은 바닥이 한쪽은 줄이고 다른 쪽은 늘립니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            이제 바닥을 9달러로 걸어 봅니다. 두 경우에 같은 수를 넣는 것이
            중요합니다. 숫자가 다르면 결과가 갈린 이유가 바닥 때문인지 다른 것
            때문인지 알 수 없기 때문입니다.
          </p>
        </div>

        <AlgorithmBlock
          title="바닥을 걸었을 때 사람 수를 다시 세는 절차"
          input={[
            "v(n) = 13 − n: n번째 사람이 더 만들어 파는 몫",
            "w(n) = n + 3: n명을 부르는 데 필요한 임금",
            "F = 9: 법이 정한 시간당 바닥",
          ]}
          steps={[
            {
              code: "한 명 더 쓰는 값을 다시 적는다 → max(F, 그 경우의 원래 값)",
              note: "바닥 아래로는 내려갈 수 없으므로, 바닥에 걸리는 구간에서는 한 명 더 쓰는 값이 F로 평평해집니다. 임금이 사람 수에 따라 오르지 않으니 이미 일하던 사람에게 더 줄 몫도 사라집니다.",
            },
            {
              code: "v(n) ≥ 한 명 더 쓰는 값 인 가장 큰 n을 찾는다",
              note: "여럿이 사던 경우에는 13 − n ≥ 9 이므로 n = 4입니다. 하나가 사던 경우에도 같은 식이 되어 n = 4입니다.",
            },
            {
              code: "오는 사람이 그보다 적으면 오는 사람 수로 끊는다",
              note: "w = 9일 때 오는 사람은 6명이므로 여기서는 걸리지 않습니다. 바닥이 더 높으면 이 줄에서 끊깁니다.",
            },
          ]}
          output="여럿이 사던 쪽 5명 → 4명, 하나가 사던 쪽 3명 → 4명"
          repeatUntil="바닥이 더 올라 v(n)이 바닥보다 작아지는 n이 오는 사람 수보다 작아질 때까지"
        />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            같은 바닥 하나가 한쪽에서는 다섯 명을 네 명으로 줄이고 다른 쪽에서는
            세 명을 네 명으로 늘립니다. 방향이 반대인 이유는 간단합니다. 여럿이
            사던 쪽에서는 바닥이 이미 맞던 자리를 위로 밀어 올린 것이고, 하나가
            사던 쪽에서는 바닥이 <strong>이미 일하던 사람에게 더 줘야 하는 몫을
            없애 준 것</strong>이기 때문입니다. 임금이 어차피 9달러로 고정되면 한
            명 더 쓴다고 나머지 임금이 오르지 않습니다.
          </p>

          <p className="leading-7">
            그래서 바닥을 올리면 일자리가 준다는 말은 조건부 명제입니다. 조건은 사는 쪽이 여럿이라는 것입니다. 그 조건이 깨지면
            같은 셈이 반대 답을 냅니다. 어느 조건에 있는지는 책상에서 정할 수 없습니다.
          </p>

          <p className="leading-7">
            <em>
              여기까지 읽으면 세어 볼 준비가 끝났습니다. 남은 것은 실제로 한쪽만
              바닥을 올린 자리를 찾아 숫자를 보는 일입니다.
            </em>
          </p>
        </div>
      </section>

      <section id="what-happened" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 5. 재 본 결과는 두 셈 중 어느 쪽도 그대로 맞히지 못했습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            입구의 사례로 돌아갑니다. 1992년 4월 1일 뉴저지의 바닥이
            4.25달러에서 5.05달러로 올랐고 펜실베이니아 동부는 4.25달러
            그대로였습니다. Card와 Krueger는 두 곳의 패스트푸드 가게 410곳을
            1992년 2~3월에 한 번, 11~12월에 한 번 더 조사했습니다. 바닥 말고는
            되도록 같은 두 쪽을 나란히 두고 변화를 견주는 방식입니다.
          </p>
        </div>

        <MeasuredViz />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            표 3의 세 번째 줄이 답입니다. 바닥을 올리지 않은 펜실베이니아에서
            가게당 정규 환산 인원이 2.16명 줄었고, 올린 뉴저지에서는 0.59명
            늘었습니다. 차이는 2.76명이고 표준오차는 1.36입니다. 줄어야 한다는
            예측과 방향이 반대입니다.
          </p>

          <p className="leading-7">
            뉴저지 안에서만 갈라 봐도 같습니다. 처음에 4.25달러를 주던 가게
            101곳은 법 때문에 반드시 올려야 했고, 이미 5달러 이상을 주던 73곳은
            거의 영향을 받지 않았습니다. 가장 세게 올려야 했던 101곳이 1.32명
            늘었고, 거의 영향이 없던 73곳은 2.04명 줄었습니다. 두 주를 비교한
            것이 아니라 한 주 안에서 비교한 것인데도 방향이 같습니다.
          </p>
        </div>

        <CitationBlock
          source="David Card · Alan B. Krueger, “Minimum Wages and Employment: A Case Study of the Fast-Food Industry in New Jersey and Pennsylvania,” The American Economic Review, Vol. 84, No. 4 (Sept. 1994), pp. 772–793"
          citeKey={1}
          href="https://davidcard.berkeley.edu/papers/njmin-aer.pdf"
        >
          772쪽 첫 문단이 겨루는 대상을 못 박습니다 — “The prediction from
          conventional economic theory is unambiguous: a rise in the minimum
          wage leads perfectly competitive employers to cut employment.” 위
          숫자는 780쪽 표 3의 세 번째 줄입니다. 그대로 둔 쪽 −2.16(1.25), 올린
          쪽 +0.59(0.54), 차이 +2.76(1.36)이고, 뉴저지 안에서는 시작임금
          4.25달러 101곳 +1.32(0.95), 4.26~4.99달러 140곳 +0.87(0.84),
          5달러 이상 73곳 −2.04(1.14)입니다. 정규 환산 인원은 시간제 한 사람을
          반 사람으로 세며, 문 닫은 여섯 곳의 인원은 0으로 둡니다. 저자 공개본
          PDF를 내려받아 읽었고 표 3과 인용 문장은 해당 쪽 이미지를 직접 열어
          대조했습니다.
        </CitationBlock>

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            여기까지면 두 번째 셈이 이긴 것처럼 보입니다. 그런데 같은 논문이 한
            가지를 더 쟀습니다. 한 끼 값입니다. 사는 쪽이 하나여서 사람을 더
            쓰게 된 것이라면 더 많이 만들어 팔게 되므로 값은 내려가야 합니다.
            실제로는 올린 쪽에서 한 끼 값이 3.2% <strong>더 올랐습니다.</strong>
          </p>

          <p className="leading-7">
            그래서 논문의 결론은 한쪽 손을 들어 주는 것이 아닙니다. 사람 수는
            첫 번째 셈의 예측과 맞지 않고, 값의 움직임은 두 번째 셈의 예측과 맞지
            않습니다. 저자들이 직접 그렇게 적었습니다.
          </p>
        </div>

        <CitationBlock
          source="Card · Krueger (1994), 788쪽 표 7 · 791–792쪽"
          citeKey={2}
          href="https://davidcard.berkeley.edu/papers/njmin-aer.pdf"
        >
          값은 788쪽 표 7의 첫 열입니다. 한 끼 값의 로그 변화에 붙은 계수가
          0.033(0.014)이고, 본문은 이를 “after-tax meal prices rose 3.2-percent
          faster in New Jersey than in Pennsylvania”로 읽습니다. 792쪽의 맺음
          문장이 이 글 부품 5의 제목 그대로입니다 — “Taken as a whole, these
          findings are difficult to explain with the standard competitive model
          or with models in which employers face supply constraints (e.g.,
          monopsony or equilibrium search models).” 791쪽에는 수요독점을
          직접 시험한 기록도 있습니다. 사람을 구해 오면 상여금을 주던 가게를
          따로 모아 비교했는데 고용이 더 빠르게 늘지도 느리게 늘지도 않았습니다.
          두 문장 모두 쪽 이미지로 대조했습니다.
        </CitationBlock>

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            이 결과를 읽는 방법은 하나뿐입니다. 한 업종, 두 주, 한 번의 인상에서 잰 것이므로 모든 노동에 대한 법칙으로 늘릴
            수 없습니다. 동시에 교과서 예측이 어디서나 성립한다는 주장도 이 숫자 앞에서는 그대로 설 수 없습니다. 이 글이 앞
            네 부품에서 두 셈을 모두 세워 둔 이유가 여기 있습니다. 하나만 세워 두면 이 결과가 다른 하나의 증거처럼 읽히기
            쉽습니다.
          </p>

          <p className="leading-7">
            <em>
              여기까지 읽으면 이 글의 질문에 답이 나왔습니다. 임금이 다른 값들과
              같은 방식으로만 정해지지는 않으며, 어느 방식인지는 재 봐야 알고,
              재 본 자리에서는 두 설명 다 부족했습니다.
            </em>
          </p>
        </div>

        <ProgressiveDetail
          title="이 한 번의 측정으로 논쟁이 끝났습니까"
          preview="끝나지 않았습니다. 같은 사건을 다른 자료로 다시 잰 연구가 이어졌고, 이 글은 그 뒤의 논쟁까지는 다루지 않습니다."
        >
          <p className="leading-7">
            이 글이 싣는 것은 1994년 논문 안에서 저자들이 직접 보고한 범위까지입니다. 이후 같은 사건을 가게의 급여 기록으로
            다시 잰 연구가 나오고 그에 대한 저자들의 재반론이 이어졌습니다. 최저임금 전반에 대한 실증 문헌도 계속 쌓였습니다.
            그 뒤의 숫자들은 원문을 직접 읽어 확인하기 전에는 이 글에 싣지 않습니다.
          </p>
          <p className="leading-7">
            다만 뒤의 논쟁이 어느 쪽으로 기울든 이 글의 부품 1에서 4까지는 바뀌지 않습니다. 두 셈이 같은 자리에서 반대를
            가리킨다는 것은 자료가 아니라 셈의 성질입니다. 그래서 어느 쪽인지는 자료로만 가를 수 있다는 구조도 그대로입니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="handoff" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          정해진 몫이 사람 사이에서 어떻게 벌어지는지가 남습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            네 편으로 조직과 그 안의 사람까지 왔습니다. 조직은 값을 쓰는 것이
            비싼 자리에서 생기고, 그 안에서 값이 내려가는 것은 커져서가 아니라
            돌아가는 방법이 열려서이며, 파는 쪽이 하나면 값을 고르게 되고, 사는
            쪽이 하나면 임금이 한계생산가치 아래에 남습니다. 네 번 모두 같은
            규칙이었습니다 — 하나 더 할 때 얻는 것과 드는 것을 견주어 멈춘다는
            것입니다.
          </p>

          <p className="leading-7">
            다음 글은 그렇게 정해진 몫들을 한자리에 모읍니다. 어떤 사람의 시간은 많이 쳐주고 어떤 사람의 시간은 적게 쳐주는데,
            그 차이가 어디서 오고 얼마나 벌어져 있으며, 벌어진 정도를 어떻게 재는지입니다. 이번 글의 틈이 거기서 한 번 더
            나옵니다. 옮길 자리가 적은 쪽일수록 틈이 벌어지는데 그 조건은 사람마다 같지 않기 때문입니다.
          </p>

          <h3 className="mt-10 mb-4 text-lg font-bold">
            읽고 나서 맞춰 볼 질문
          </h3>

          <p className="leading-7">
            1. 사는 가게가 하나뿐인 동네에 지하철이 새로 놓여 옆 동네로 20분이면
            갈 수 있게 되었습니다. 바닥을 건드리지 않아도 임금과 사람 수는 어느
            쪽으로 움직입니까. <strong>(답: 부품 3절)</strong>
          </p>

          <p className="leading-7">
            2. 바닥을 9달러가 아니라 12달러로 걸면 사는 쪽이 하나인 경우에도
            사람 수가 줄어듭니다. 표의 어느 줄에서 그렇게 되는지 짚어 보십시오.{" "}
            <strong>(답: 부품 4절)</strong>
          </p>

          <p className="leading-7">
            3. 뉴저지에서 사람도 늘고 한 끼 값도 올랐습니다. 이 두 가지가 왜 한
            셈으로 같이 설명되기 어려운지 한 문장으로 말해 보십시오.{" "}
            <strong>(답: 부품 5절)</strong>
          </p>
        </div>

        <ContentBoundary article="wage-floor-natural-experiment" />
      </section>
    </div>
  );
}

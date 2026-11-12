import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import PartyFunctionViz from "./parties-and-interest-groups/viz/PartyFunctionViz";
import MedianConvergenceViz from "./parties-and-interest-groups/viz/MedianConvergenceViz";
import RentSeekingViz from "./parties-and-interest-groups/viz/RentSeekingViz";

/**
 * 열두 후보가 세 정당으로 묶이고, 묶음에서 빠진 면허 쟁점이 조직·경합·포획으로
 * 이어지는 하나의 설명용 사례를 끝까지 추적한다.
 */
export default function PartiesAndInterestGroupsArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          열두 후보가 세 정당이 되면 무엇이 쉬워지고 무엇이 사라질까요?
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            설명을 위해 한 도시 선거를 가정하겠습니다. 후보는 12명이고, 유권자가
            확인할 쟁점은 교통비·주차·도로 예산·운송 면허 네 가지입니다. 후보를
            한 명씩 보면 확인할 칸은 12×4=48개입니다. 후보들이 세 정당의 공약
            묶음으로 모이면 3×4=12개로 줄고, 정당 이름을 믿는 사람은 이름 세
            개만 보고도 대강 고를 수 있습니다.
          </p>

          <p className="leading-7">
            답은 간단합니다.{" "}
            <strong>
              정당과 이익집단은 이미 만들어진 의견을 그대로 전달하는 우편함이
              아닙니다. 수많은 요구를 몇 개의 선택지로 압축해 결정을 가능하게
              하지만, 그 압축에 들어가지 못한 요구는 투표용지에서 사라집니다.
            </strong>{" "}
            이 글에서는 네 번째 쟁점인 운송 면허가 세 정당의 핵심 공약에서
            빠졌다고 두고, 그 뒤에 무슨 일이 생기는지 따라갑니다.
          </p>

          <p className="leading-7">
            면허 하나의 가치가 1,000억 원이고 신청 기업이 10곳이라면 기업 한
            곳의 이해관계는 큽니다. 반면 같은 1,000억 원을 시민 5,000만 명이
            나눠 부담하면 한 사람 몫은 2,000원입니다. 선거에서 빠진 쟁점은
            사라지는 대신, 조직하기 쉬운 쪽을 통해 다시 정치에 들어옵니다.
          </p>
        </div>

        <PartyFunctionViz />
        <ContentBoundary article="parties-and-interest-groups" />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            이제 같은 사례를 다섯 번 봅니다. 먼저 선택지가 어떻게 48칸에서
            12칸으로 줄어드는지 봅니다. 이어 두 큰 정당을 가운데로 미는 힘, 면허
            기업과 시민의 조직 가능성 차이, 10개 기업이 면허를 놓고 쓰는 경쟁
            비용, 마지막으로 규제기관이 기업 정보에 의존하게 되는 경로를
            확인합니다.
          </p>
          <p className="leading-7">
            여기서 말하는 도시는 계산을 연결하기 위한 가상 사례입니다. 특정
            나라의 정당이나 면허 제도가 실제로 이렇게 움직였다는 실증 주장이
            아닙니다. 결정 뒤 집행 단계는 다음 글{" "}
            <Link to="/politics/governance/bureaucracy-and-implementation">
              관료제와 집행
            </Link>
            에서 이어집니다.
          </p>
        </div>
      </section>

      <section id="why-parties" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          1. 정당은 열두 후보를 세 묶음으로 압축합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            정당이 없으면 유권자는 후보 12명의 네 쟁점 입장을 따로 확인해야
            합니다. 정당은 여러 입장을 공약 묶음 하나에 넣고, 그 묶음을 후보
            여러 명이 함께 사용하게 합니다. 48개였던 후보별 확인 칸이 정당별
            12칸으로 줄어드는 첫 번째 효과입니다.
          </p>
          <p className="leading-7">
            정당 이름은 이 묶음의 짧은 표지가 됩니다. 표지가 실제 공약을 잘
            예고한다면 유권자는 정당 세 곳만 구분해도 후보의 대략적인 위치를
            짐작할 수 있습니다. 다만 이름과 실제 행동이 어긋날 때도 판단을 계속
            맡긴다는 약점이 함께 생깁니다.
          </p>
          <p className="leading-7">
            입법부에서도 비슷한 축약이 일어납니다. 사안마다 의원들을 처음부터
            설득하는 대신, 여러 표결에 함께 움직일 장기 연합을 미리 만듭니다.
            유권자의 조사 부담과 의원들의 반복 협상 부담을 같은 조직이 함께
            줄이는 셈입니다.
          </p>
          <p className="leading-7">
            그러나 줄이는 동작에는 삭제가 붙습니다. 교통비·주차·도로 예산은 세
            정당의 축에 들어갔지만 운송 면허는 어느 묶음에서도 분명히 다루지
            않았다고 해 보겠습니다. 유권자는 면허에 관한 선호가 있어도 그 선호만
            따로 표시할 칸이 없습니다.
          </p>
        </div>

        <TermBreakdown
          title="같은 압축이 줄이는 세 가지"
          items={[
            {
              term: "확인할 칸",
              description:
                "후보 12명×쟁점 4개인 48칸을 정당 3곳×쟁점 4개인 12칸으로 줄입니다.",
              example:
                "정당 이름을 신뢰하면 유권자는 세 공약 묶음의 차이만 먼저 보면 됩니다.",
              boundary:
                "정당 안에서 후보의 입장이 갈리면 12칸보다 더 확인해야 합니다. 12는 설명용 사례의 값이지 보편 법칙이 아닙니다.",
            },
            {
              term: "반복할 협상",
              description:
                "입법부에서 사안마다 과반을 새로 만드는 대신 여러 표결에 걸친 연합을 미리 묶습니다.",
              example:
                "당론이 유지되면 표결 때마다 모든 의원을 처음부터 설득하지 않아도 됩니다.",
              boundary:
                "그 대가로 의원이 지역 유권자의 뜻과 다른 묶음을 따라야 할 수 있습니다.",
            },
            {
              term: "정치에 올라오는 쟁점",
              description:
                "서로 다른 문제를 몇 개의 공약 축에 넣어 비교 가능한 선택지로 만듭니다.",
              example:
                "교통비·주차·도로 예산은 묶였지만 운송 면허는 묶음 밖에 남았습니다.",
              boundary:
                "묶음 밖의 쟁점이 중요하지 않다는 뜻이 아닙니다. 표준 선택지에 담기지 않았다는 뜻입니다.",
            },
          ]}
        />

        <CitationBlock
          source="Anthony Downs · An Economic Theory of Political Action in a Democracy (Journal of Political Economy 65권 2호, 1957, 135~150쪽)"
          citeKey={1}
          href="https://doi.org/10.1086/257897"
        >
          정당과 유권자가 불완전한 정보 아래에서 비용을 줄이며 선택한다는 경제적
          모형을 제시한 논문입니다. 아래의 두 정당·한 축 경쟁 설명은 이 계열의
          단순화에서 가져옵니다. 후보 12명과 운송 면허 수치는 이 글의 설명용
          사례이며 논문의 실측값이 아닙니다.
        </CitationBlock>
      </section>

      <section id="competition" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          2. 한 축에서는 두 큰 정당이 가운데로 밀립니다
        </h2>
        <MedianConvergenceViz />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            세 정당 중 두 곳이 큰 정당이고, 유권자 집단 아홉 개가 정책 축의
            1번부터 9번 위치에 하나씩 있다고 가정하겠습니다. 가운데 유권자는
            5번입니다. 두 정당이 4번과 7번에 있다면 7번 정당은 6번으로 옮길 때
            가운데에 더 가까워져 표를 더 얻을 수 있습니다. 상대도 같은 유혹을
            받으므로 둘 다 5번 쪽으로 밀립니다.
          </p>
          <p className="leading-7">
            이 힘을 <strong>후보 또는 정당의 가운데 수렴</strong>이라고
            부릅니다. 앞 글의 중위 투표자 계산을 정당의 위치 선택에 적용한
            것입니다. 다만 계산이 말하는 것은 “가운데로 가려는 힘이
            있다”까지입니다. 실제 정당이 언제나 같은 정책을 택한다는 결론은
            아닙니다.
          </p>
          <p className="leading-7">
            완전히 겹치지 않는 이유도 같은 사례에서 찾을 수 있습니다. 극단의
            지지자가 기권할 수 있고, 본선 전에는 각 정당 내부 유권자의 선택을
            먼저 통과해야 하며, 운송 면허처럼 기존 한 축에 잘 놓이지 않는 쟁점도
            있습니다. 제3정당·비례대표제·정체성·후보 신뢰까지 들어오면 단순한 두
            정당 모형의 예측은 더 약해집니다.
          </p>
        </div>

        <ProgressiveDetail
          title="선거 때 말이 비슷하면 집권 뒤 정책도 같을까요?"
          preview="수렴 계산은 유권자가 실제 위치를 알고 그 위치대로 투표한다는 조건에서만 바로 작동합니다."
        >
          <p className="leading-7">
            유권자가 선거 문구는 바로 보지만 집권 뒤 결정을 늦게 확인한다면,
            수렴은 말에서 먼저 나타나고 정책에는 약하게 나타날 수 있습니다. 정당
            이름과 실제 행동의 거리가 작고 과거 결정을 확인하기 쉬울수록 말의
            수렴이 정책까지 이어질 가능성이 커집니다.
          </p>
          <p className="leading-7">
            따라서 두 정당의 문구가 비슷하다는 관찰만으로 실제 정책이 같다고
            판정하면 안 됩니다. 공약·표결 기록·집행 결과를 서로 다른 단계의
            자료로 나눠 확인해야 합니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="who-organizes" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          3. 빠진 면허 쟁점은 조직하기 쉬운 쪽을 통해 돌아옵니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            운송 면허가 정당 공약에서 빠졌다고 정책 과정에서도 사라지는 것은
            아닙니다. 면허의 가치 1,000억 원을 신청 기업 10곳이 같은 확률로
            기대한다면 한 곳의 기대 몫은 100억 원입니다. 담당자를 고용하고
            자료를 만들며 회의에 참석할 이유가 충분합니다.
          </p>
          <p className="leading-7">
            시민 쪽의 합계 부담도 1,000억 원이지만 5,000만 명으로 나누면 한
            사람당 2,000원입니다. 정책의 존재를 알아보고 다른 시민을 찾고 의견을
            전달하는 비용이 2,000원보다 크다면, 반대할 이유가 있어도 실제 행동은
            나오기 어렵습니다. 총액은 같지만 행동을 결정하는 한 사람 몫이
            다릅니다.
          </p>
          <p className="leading-7">
            여기에 조직의 출발점 차이가 더해집니다. 신청 기업은 이미 법인·협회·
            담당자·연락망을 갖고 있지만 시민 5,000만 명은 이 사안 때문에 처음
            서로를 찾아야 합니다. 이렇게 같은 크기의 이해관계가 조직 비용 때문에
            다르게 정치에 도달하는 상태를 <strong>조직의 치우침</strong>이라고
            부르겠습니다.
          </p>
        </div>

        <AlgorithmBlock
          title="같은 면허 쟁점에서 어느 쪽이 먼저 조직되는지 계산하는 절차"
          input={[
            "면허 가치와 시민 부담의 합계 = 각각 1,000억 원",
            "신청 기업 = 10곳 · 시민 = 5,000만 명",
            "기업 쪽에는 기존 연락망과 담당 조직이 있고 시민 쪽에는 없다고 가정",
          ]}
          steps={[
            {
              code: "기업 한 곳의 설명용 기대 몫 → 1,000억 ÷ 10 = 100억 원",
              note: "실제 당첨 확률이 같다는 뜻이 아니라, 조직 유인을 비교하기 위한 첫 장부입니다.",
            },
            {
              code: "시민 한 사람의 부담 → 1,000억 ÷ 5,000만 = 2,000원",
              note: "합계가 같아도 한 사람이 회수하거나 막을 수 있는 금액은 크게 다릅니다.",
            },
            {
              code: "100억과 2,000원을 각자의 정보 수집·연락·참여 비용과 비교",
              note: "기업 쪽은 비용을 치르고도 남을 가능성이 크지만 시민 한 사람은 비용이 손해보다 클 수 있습니다.",
            },
            {
              code: "기존 조직 확인 → 기업 쪽 있음 · 시민 쪽 없음",
              note: "이미 모여 있는 쪽은 새 조직을 만드는 고정비를 다시 내지 않습니다.",
            },
            {
              code: "판정 → 기업 쪽 요구가 먼저 안건과 자료의 형태를 갖출 가능성이 큼",
              note: "정당성의 판정이 아닙니다. 누가 더 쉽게 정치 과정에 도달하는지를 판정한 것입니다.",
            },
          ]}
          output="같은 1,000억 원이라도 100억 대 2,000원과 기존 조직의 차이 때문에 기업 쪽이 먼저 조직될 가능성이 큼"
        />

        <CitationBlock
          source="Mancur Olson · The Logic of Collective Action (Harvard University Press, 1965)"
          citeKey={2}
          href="https://doi.org/10.4159/9780674041660"
        >
          공통 이해관계가 있다는 사실만으로 사람들이 자발적으로 조직되지는
          않으며, 조직 활동의 비용을 개인이 부담할 유인이 있는지를 따로 봐야
          한다는 고전적 논증입니다. 위의 100억·2,000원은 이 글이 만든
          사례입니다. 흩어진 다수가 언제나 진다는 뜻도 아닙니다. 기존 조직,
          선택적 혜택, 공론화와 제도적 대표가 조직 비용을 대신 치르면 결과가
          달라집니다.
        </CitationBlock>
      </section>

      <section id="rent-seeking" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          4. 면허를 얻으려는 다툼에도 별도의 비용이 듭니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            면허를 한 기업이 얻으면 1,000억 원의 가치가 그 기업으로 옮겨갑니다.
            그러나 10개 기업이 면허를 얻으려고 사람·자료·시간에 쓴 돈은
            별도입니다. 특히 진 아홉 곳의 지출은 면허 가치로 바뀌지 않습니다.
          </p>
          <p className="leading-7">
            이를 계산하려면 단순한 경합 규칙 하나를 둡니다. 각 기업이 이길
            확률이 자기 지출을 전체 지출로 나눈 비율과 같고, 기업들의 조건도
            같다고 가정합니다. 이 가정 아래에서는 한 곳이 조금 더 쓸 때 늘어나는
            당첨 확률의 가치와 추가 지출이 같아지는 곳에서 멈춥니다.
          </p>
        </div>

        <ExplainedFormula
          question="가치 1,000억 원의 면허를 10곳이 다투면 모형 안에서 얼마를 쓰게 될까요?"
          idea="한 기업의 기대 이득을 ‘당첨 확률×면허 가치−지출’로 적습니다. 다른 기업들의 지출을 고정한 채 자기 지출을 조금 늘려 얻는 이득이 1원 늘 때 추가 비용도 1원이 되는 지점을 찾고, 모든 기업이 같은 지출을 한다고 놓습니다."
          formula={String.raw`x^{*} = \frac{n-1}{n^{2}}V, \qquad X = nx^{*} = \frac{n-1}{n}V`}
          annotatedFormula={String.raw`\underbrace{x^{*}}_{\text{한 기업의 지출}} = \underbrace{\frac{n-1}{n^{2}}}_{\text{대칭 경합의 지출 비율}}\underbrace{V}_{\text{면허 가치}}, \qquad \underbrace{X}_{\text{전체 지출}} = \underbrace{n}_{\text{기업 수}}x^{*} = \frac{n-1}{n}V`}
          operations={[
            {
              expression: String.raw`u_i=\frac{x_i}{x_i+S_{-i}}V-x_i`,
              annotation: [
                "한 기업의 기대 이득입니다. S₋ᵢ는 나를 뺀 나머지 기업의 지출 합계입니다. 앞항은 당첨 확률에 면허 가치를 곱한 값이고 뒤항은 실제 지출입니다.",
                "당첨 확률이 지출 비중과 정확히 같다는 것이 가장 강한 가정입니다.",
              ],
            },
            {
              expression: String.raw`\frac{\partial u_i}{\partial x_i}=\frac{VS_{-i}}{(x_i+S_{-i})^2}-1=0`,
              annotation: [
                "내 지출을 아주 조금 늘렸을 때 늘어나는 기대 이득에서 추가 비용 1을 뺍니다. 이 값이 0이면 더 쓰거나 덜 써서 얻을 이득이 없는 멈춤점입니다.",
                "다른 기업의 지출 S₋ᵢ는 이 한 기업이 선택하는 동안 고정해 둡니다.",
              ],
            },
            {
              expression: String.raw`S_{-i}=(n-1)x,\qquad x_i+S_{-i}=nx`,
              annotation: [
                "기업들이 같은 조건이라 모두 x만큼 쓴다고 놓습니다. 그러면 나머지 n−1곳은 합계 (n−1)x를 쓰고, 전체는 nx가 됩니다.",
                "이 두 값을 바로 앞의 멈춤식에 넣어야 n만 남는 식을 얻을 수 있습니다.",
              ],
            },
            {
              expression: String.raw`\frac{V(n-1)x}{(nx)^2}=1\quad\Longrightarrow\quad x^{*}=\frac{n-1}{n^2}V`,
              annotation: [
                "분자의 x 하나와 분모의 x²에서 x 하나를 약분한 뒤 양변에 x를 곱으면 한 기업의 지출식이 나옵니다.",
                "전체 지출은 이 값에 기업 수 n을 곱한 X=(n−1)V/n입니다.",
              ],
            },
            {
              expression: String.raw`x^{*}=\frac{10-1}{10^2}\times1000=90`,
              annotation: [
                "기업이 10곳이고 면허 가치가 1,000억 원일 때 한 기업의 설명용 균형 지출은 90억 원입니다.",
                "실제 기업의 로비 예산을 측정한 값이 아닙니다.",
              ],
            },
            {
              expression: String.raw`X=10\times90=900`,
              annotation: [
                "열 곳의 지출을 합치면 900억 원으로 면허 가치의 90퍼센트입니다.",
                "경쟁자가 늘수록 이 비율은 1에 가까워지지만 이 모형에서는 1을 넘지 않습니다.",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`V`,
              name: "면허 가치",
              description:
                "당첨 기업이 얻는 설명용 경제적 가치이며 여기서는 1,000억 원입니다.",
            },
            {
              symbol: String.raw`n`,
              name: "경쟁 기업 수",
              description:
                "같은 조건으로 면허를 놓고 다투는 기업 수이며 여기서는 10입니다.",
            },
            {
              symbol: String.raw`x^{*}`,
              name: "한 기업의 지출",
              description:
                "다른 기업의 지출에 최선으로 대응한 대칭 균형의 값입니다.",
            },
            {
              symbol: String.raw`S_{-i}`,
              name: "나머지 기업의 지출 합계",
              description:
                "기업 i 한 곳을 빼고 다른 기업들이 쓴 돈을 모두 더한 값입니다.",
            },
            {
              symbol: String.raw`X`,
              name: "전체 지출",
              description: "모든 경쟁 기업의 지출을 합한 값입니다.",
            },
          ]}
          assumptions={[
            "당첨 확률이 자기 지출의 비중과 정확히 같다고 둡니다.",
            "열 기업의 능력·정보·연결 관계가 같고 모두 위험 중립적이라고 둡니다.",
            "지출이 정책 정보를 개선하는 사회적 가치로 남지 않고 되돌아오지도 않는다고 둡니다.",
          ]}
          interpretation="같은 사례에서 n=2이면 각 250억·합계 500억, n=4이면 각 187.5억·합계 750억, n=10이면 각 90억·합계 900억입니다. 경쟁자가 늘수록 한 곳의 지출은 줄지만 합계는 늘어납니다. 이 숫자를 실제 로비 지출의 예측값으로 읽으면 안 됩니다. 한 기업이 훨씬 유리하거나 참여 비용이 크면 다른 기업이 포기해 합계가 크게 낮아질 수 있습니다."
        />

        <RentSeekingViz />

        <CitationBlock
          source="Gordon Tullock · The Welfare Costs of Tariffs, Monopolies, and Theft (Western Economic Journal 5권 3호, 1967, 224~232쪽)"
          citeKey={3}
          href="https://doi.org/10.1111/j.1465-7295.1967.tb01923.x"
        >
          관세·독점 같은 이전을 얻거나 막기 위해 쓰는 정치적 자원도 사회적
          비용에 포함해야 한다고 지적한 논문입니다. 저자는 그 지출을 실제로
          측정하는 방법까지 제시하지는 못했다고 밝힙니다. 위의 x/(전체 지출)
          경합식과 90억·900억 계산은 이 논문의 표에 있는 값이 아니라, 뒤에 널리
          쓰인 단순 경합 모형을 이 글이 직접 전개한 것입니다.
        </CitationBlock>
      </section>

      <section id="capture" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          5. 규제기관이 듣는 정보도 조직된 쪽으로 기울 수 있습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            이제 면허 규칙을 만들 규제기관의 자리로 가 보겠습니다. 기관은 운행
            비용·안전 기록·수요 예측을 알아야 합니다. 이 자료를 이미 갖춘 곳은
            신청 기업 10곳입니다. 시민 한 사람은 2,000원을 부담하지만 업계
            자료에 맞설 보고서를 혼자 만들 이유도 능력도 부족합니다.
          </p>
          <p className="leading-7">
            그래서 회의 자료와 전문 인력이 기업 쪽에서 계속 들어오면, 금품이나
            불법 청탁이 없어도 기관이 보는 문제의 범위가 업계의 범위와 비슷해질
            수 있습니다. 규제하는 기관이 규제받는 쪽의 정보·인력·관점에
            구조적으로 기대는 상태를 <strong>규제 포획</strong>이라고 부릅니다.
          </p>
          <p className="leading-7">
            다만 정보 의존이 곧 포획의 증거는 아닙니다. 외부 자료 검증, 공개
            의견 수렴, 소비자 대표, 인사상 이해충돌 통제가 실제 결정에 반대
            근거를 공급한다면 의존을 줄일 수 있습니다. 판정하려면 누가 자료를
            냈는지뿐 아니라 반대 자료가 들어올 통로와 최종 결정이 어떻게
            바뀌었는지를 함께 봐야 합니다.
          </p>
        </div>

        <CitationBlock
          source="George J. Stigler · The Theory of Economic Regulation (Bell Journal of Economics and Management Science 2권 1호, 1971, 3~21쪽)"
          citeKey={4}
          href="https://doi.org/10.2307/3003160"
        >
          누가 규제의 편익과 부담을 얻고 어떤 형태의 규제가 공급되는지를 경제적
          이해관계로 설명하려 한 논문입니다. 산업이 규제를 적극적으로 요구하고
          자기 편익에 맞게 작동시킬 수 있다는 강한 명제를 제시하지만, 모든
          규제가 실제로 포획됐다는 판정서는 아닙니다. 이 글은 그 명제를 정보와
          조직의 흐름을 조사할 질문으로 사용합니다.
        </CitationBlock>
      </section>

      <section id="boundary" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          6. 압축 장치를 없애는 대신 빠진 요구의 재진입 통로를 봐야 합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            정당이 쟁점을 줄였다고 정당을 없애면 더 많은 의견이 자동으로
            대표되지는 않습니다. 열두 후보의 48칸을 다시 각자 조사해야 하고,
            안정적인 연합이 없으면 앞 글의 표결 순서 문제가 더 커질 수 있습니다.
            이익집단을 금지해도 이해관계가 큰 기업은 다른 방식으로 연결될 수
            있지만 2,000원씩 부담하는 시민은 여전히 흩어져 있습니다.
          </p>
          <p className="leading-7">
            따라서 실제 판단 질문은 “조직을 없앨까?”보다 “압축에서 빠진 운송
            면허 쟁점이 다시 들어올 통로가 있는가?”에 가깝습니다. 새로운
            정당이나 후보가 쟁점을 올릴 수 있는지, 공개 의견 수렴과 소비자
            대표가 있는지, 규제 자료의 출처와 반론을 확인할 수 있는지를 살펴야
            합니다.
          </p>
          <p className="leading-7">
            이 글은 결정이 만들어지기 전까지를 다뤘습니다. 결정이 난 뒤에도
            현장의 재량·정보·성과 측정 때문에 결과가 다시 달라집니다. 그 경로는{" "}
            <Link to="/politics/governance/bureaucracy-and-implementation">
              관료제와 집행
            </Link>
            에서 이어집니다.
          </p>
        </div>

        <ReviewPrompts
          questions={[
            "12명×4개였던 확인 칸이 세 정당에서 몇 칸으로 줄어듭니까? (답: 12칸이며, 정당 이름을 신뢰하면 먼저 구분할 표지는 세 개까지 줄어듭니다. 1절)",
            "같은 1,000억 원인데 왜 기업과 시민의 조직 가능성이 다릅니까? (답: 기업 한 곳의 설명용 기대 몫은 100억 원이고 시민 한 사람의 부담은 2,000원이며, 기업 쪽에는 기존 조직도 있습니다. 3절)",
            "10개 기업의 전체 지출 900억 원을 실제 예측값이라고 말할 수 있습니까? (답: 지출 비중=당첨 확률, 기업의 동질성, 전액 소모라는 강한 가정 아래의 모형값입니다. 4절)",
          ]}
        />
      </section>
    </div>
  );
}

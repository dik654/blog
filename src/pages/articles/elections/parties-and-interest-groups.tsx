import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import PartyFunctionViz from "./parties-and-interest-groups/viz/PartyFunctionViz";
import RentSeekingViz from "./parties-and-interest-groups/viz/RentSeekingViz";

/**
 * 선택지를 줄이는 장치들이 무엇을 함께 잘라 냅니다
 *
 * 6편이 "선호가 한 축으로 정리되어 있으면 다수결이 답을 낸다"로 끝났으니,
 * 그 정리를 실제로 해 주는 장치를 받는다. 정당과 이익집단을 대표 기구가 아니라
 * 선택지 축소 장치로 보고, 축소가 무엇을 잘라 내는지가 이 글의 축이다.
 */
export default function PartiesAndInterestGroupsArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          선호가 한 줄로 정리되는 것은 저절로 되는 일이 아닙니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            앞 글은 이상한 곳에서 끝났습니다. 어떤 집계 규칙도 조건들을 다 만족할
            수 없는데, 실제 정치는 대개 답을 내고 굴러갑니다. 차이를 만드는 것이
            규칙이 아니라 들어오는 선호의 모양이라는 데까지 갔습니다.
          </p>

          <p className="leading-7">
            그러면 남는 질문이 하나입니다. 그 모양은 누가 만듭니까. 수많은 쟁점이
            저절로 몇 개의 축으로 줄어들 이유가 없고, 사람들이 그 축 위에서 자기
            자리를 갖게 될 이유도 없습니다.
          </p>

          <p className="leading-7">
            줄이는 장치가 따로 있습니다. 그리고 그 장치들은 대표하는 일을 하기
            전에 먼저 줄이는 일을 합니다. 줄인다는 것은 동시에 잘라 낸다는
            뜻이기도 합니다.
          </p>
        </div>

        <PartyFunctionViz />

        <ContentBoundary article="parties-and-interest-groups" />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            이 글이 푸는 질문은 하나입니다.{" "}
            <strong>
              선택지를 줄여 주는 장치들은 무엇을 가능하게 하고 그 과정에서 무엇을
              함께 잘라 내는가
            </strong>
            입니다.
          </p>

          <p className="leading-7">
            순서는 정당이 하는 축소, 축소된 축 위에서 벌어지는 경쟁, 조직되는
            이익과 조직되지 않는 이익의 갈림, 그 다툼 자체가 만들어 내는 비용,
            그리고 규제하는 쪽이 규제받는 쪽에 기대게 되는 경로입니다.
          </p>

          <p className="leading-7">
            여기서는 결정이 내려지기까지만 다룹니다. 내려진 결정이 실제로
            집행되는 단계에서 다시 걸러지는 일은 다음 글{" "}
            <Link to="/politics/governance/bureaucracy-and-implementation">
              관료제와 집행
            </Link>
            이 맡습니다.
          </p>
        </div>
      </section>

      <section id="why-parties" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 1. 정당은 대표하기 전에 먼저 줄입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            정당을 생각이 비슷한 사람들의 모임으로만 보면 설명되지 않는 것이
            많습니다. 생각이 비슷한 사람들이 왜 굳이 하나의 이름과 규율을
            갖춰야 하는지, 그리고 왜 거의 모든 나라에서 몇 개의 큰 덩어리로
            수렴하는지가 그렇습니다.
          </p>

          <p className="leading-7">
            줄이는 장치로 보면 이 둘이 함께 설명됩니다. 후보가 많고 쟁점이 많으면
            유권자가 알아봐야 할 양은 후보 수와 쟁점 수를 곱한 만큼입니다. 정당은
            이름 하나에 여러 쟁점의 입장을 묶어 붙여 그 양을 정당 수만큼으로
            줄입니다.
          </p>

          <p className="leading-7">
            줄어드는 것은 유권자의 부담만이 아닙니다. 입법부 안에서도 같은 일이
            일어납니다. 사안마다 다른 상대와 과반을 다시 만들어야 한다면 협상
            비용이 감당되지 않는데, 정당은 여러 사안에 걸친 장기 연합을 미리
            묶어 두어 그 비용을 한 번에 치릅니다.
          </p>

          <p className="leading-7">
            그리고 여기서 앞 글과 직접 이어지는 결과가 나옵니다. 여러 쟁점이 하나의
            축으로 정리되면 사람들의 선호가 그 축 위에서 봉우리 하나 모양이 되기
            쉽습니다. 앞 글에서 순환을 막아 주던 조건이 정당 경쟁의 부산물로
            만들어지는 셈입니다.
          </p>
        </div>

        <TermBreakdown
          title="정당이 실제로 줄여 주는 것들"
          items={[
            {
              term: "유권자의 탐색 비용",
              description:
                "정당 이름이 여러 쟁점의 입장을 한꺼번에 알려 주는 표지 역할을 합니다. 후보 하나하나를 조사하지 않아도 대략의 판단이 섭니다.",
              example:
                "처음 보는 후보라도 소속 정당을 알면 주요 쟁점에서 어느 쪽에 설지 짐작할 수 있습니다.",
              boundary:
                "표지가 실제 내용과 어긋나도 유권자는 알아채기 어렵습니다. 비용을 줄여 주는 장치는 속이기도 쉬운 장치입니다.",
            },
            {
              term: "입법부의 협상 비용",
              description:
                "사안마다 과반을 새로 만드는 대신 여러 사안에 걸친 연합을 미리 묶어 둡니다. 앞 글의 정부 구성 문제가 매번 반복되지 않습니다.",
              example:
                "당론으로 움직이면 표결마다 개별 의원을 설득할 필요가 없어집니다.",
              boundary:
                "묶어 두는 대가로 개별 의원이 자기 지역구의 뜻과 다르게 투표해야 하는 경우가 생깁니다.",
            },
            {
              term: "쟁점 공간의 차원",
              description:
                "서로 다른 쟁점들을 몇 개의 축으로 눌러 담습니다. 앞 글에서 순환을 막아 주던 조건이 여기서 만들어집니다.",
              example:
                "본래 관련이 없던 여러 쟁점이 같은 정당 안에 묶이면서 하나의 좌표 위에 놓입니다.",
              boundary:
                "축에 올라타지 못한 쟁점은 선택지에 실리지 않습니다. 그 쟁점을 중요하게 보는 사람은 투표로 말할 방법이 없습니다.",
            },
          ]}
        />
      </section>

      <section id="competition" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 2. 가운데로 가지만 끝까지 가지는 않습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            축이 하나로 정리되고 나면 앞 글의 계산이 그대로 정당에 적용됩니다.
            두 정당이 그 축 위에서 위치를 고를 수 있다면, 어느 쪽이든 상대보다
            가운데에 가까이 서는 쪽이 이깁니다. 그래서 둘 다 가운데로 밀려갑니다.
          </p>

          <p className="leading-7">
            실제로 두 정당이 붙어 있는 나라들이 있고, 선거가 다가올수록 양쪽의
            말이 비슷해지는 현상도 흔히 관찰됩니다. 그런데 완전히 겹치지는
            않습니다. 가운데로 미는 힘을 상쇄하는 힘이 몇 개 있기 때문입니다.
          </p>

          <p className="leading-7">
            첫째는 기권입니다. 양쪽이 다 가운데로 가면 양극단의 지지자에게는
            차이가 사라지고, 차이가 없으면 투표할 이유도 사라집니다. 가운데로
            갈수록 잃는 표가 생기므로 어느 지점에서 멈춥니다.
          </p>

          <p className="leading-7">
            둘째는 후보를 고르는 단계가 따로 있다는 것입니다. 본선에서 이기려면
            가운데가 유리하지만, 본선에 나가려면 먼저 당내에서 뽑혀야 합니다.
            뽑아 주는 사람들이 전체 유권자보다 한쪽으로 치우쳐 있으면 후보는 그
            치우친 중위에 맞춰집니다.
          </p>

          <p className="leading-7">
            셋째는 축이 정말 하나인가입니다. 앞 글에서 봤듯 축이 둘 이상이면
            가운데라는 자리 자체가 정의되지 않습니다. 이때는 어느 축을 선거의
            쟁점으로 만들 것인가가 위치를 고르는 일보다 중요해집니다.
          </p>
        </div>

        <ProgressiveDetail
          title="양쪽이 비슷해 보이는 것과 실제로 같은 것은 다른가?"
          preview="가운데로 미는 힘은 말에 먼저 작용하고 정책에는 나중에 작용합니다."
        >
          <p className="leading-7">
            가운데로 수렴한다는 계산은 정당의 위치가 유권자에게 그대로 보인다고
            가정합니다. 실제로는 선거 기간에 하는 말과 집권 후의 결정 사이에 틈이
            있고, 유권자가 그 틈을 확인하려면 시간이 걸립니다.
          </p>
          <p className="leading-7">
            그래서 수렴은 말에서 먼저, 정책에서 나중에 나타납니다. 양쪽이 비슷한
            말을 하는데도 집권 후의 결정이 크게 다른 경우가 생기는 이유입니다.
            이때 유권자가 느끼는 배신감은 정당이 특별히 부정직해서가 아니라 이
            구조에서 나옵니다.
          </p>
          <p className="leading-7">
            뒤집어 보면 이 틈이 좁을수록 수렴이 실제 정책까지 내려옵니다. 지난
            임기의 결정을 유권자가 쉽게 확인할 수 있는 나라일수록 선거 공약과
            집권 후 결정의 거리가 짧아집니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="who-organizes" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 3. 조직되는 이익과 조직되지 않는 이익이 갈립니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            정당이 축을 만든다면, 그 축 위에 무엇이 올라갈지는 또 다른 문제입니다.
            여기서 정치에서 가장 자주 관찰되는 비대칭이 나옵니다. 아주 적은 사람이
            아주 많은 사람을 상대로 이기는 일이 반복됩니다.
          </p>

          <p className="leading-7">
            이유는 1편에서 이미 나왔습니다. 혜택을 나눠 갖는 사람이 적으면 한 명이
            회수하는 몫이 크고, 많으면 몫이 작아집니다. 그래서 같은 크기의 이익도
            누가 나눠 갖느냐에 따라 조직될 수도, 되지 않을 수도 있습니다.
          </p>

          <p className="leading-7">
            특혜는 대개 소수에게 집중되고 그 비용은 전체에게 흩어집니다. 백 곳이
            천억을 나눠 가지면 한 곳당 열 억이라 움직일 이유가 충분하지만, 오천만
            명이 천억을 나눠 내면 한 사람당 이천 원이라 알아볼 이유조차 없습니다.
            양쪽 다 합계는 같은데 한쪽만 조직됩니다.
          </p>

          <p className="leading-7">
            그래서 어떤 요구가 정치에 도달하는지는 그 요구가 얼마나 정당한지와
            거의 무관합니다. 도달하는 조건은 아래 절차로 판정할 수 있습니다.
          </p>
        </div>

        <AlgorithmBlock
          title="어떤 이익이 조직되어 정치에 도달하는지 판정하는 절차"
          input={[
            "그 결정이 만들어 내는 이익 또는 비용의 총액",
            "그것을 나눠 갖거나 나눠 내는 사람의 수",
            "그 사람들이 이미 서로 연결되어 있는지 여부",
          ]}
          steps={[
            {
              code: "총액을 인원으로 나눠 1인당 이해관계를 구한다.",
              note: "정치에 도달하는지를 정하는 것은 총액이 아니라 이 값입니다. 총액이 같아도 인원이 다르면 결과가 갈립니다.",
            },
            {
              code: "1인당 이해관계를 알아보고 움직이는 비용과 비교한다.",
              note: "알아보는 비용에는 그 결정이 존재한다는 사실을 아는 비용까지 들어갑니다. 대개 이 비용이 이천 원짜리 손해보다 큽니다.",
            },
            {
              code: "이미 다른 이유로 모여 있는 조직이 있는지 본다.",
              note: "업계 단체나 직능 단체처럼 다른 목적으로 이미 존재하는 조직이 있으면 새로 모을 비용이 들지 않습니다. 이 점이 산업 쪽과 소비자 쪽을 크게 가릅니다.",
            },
            {
              code: "기여하지 않은 사람을 혜택에서 빼놓을 수 있는지 본다.",
              note: "빼놓을 수 없으면 1편의 무임승차가 그대로 걸립니다. 조직이 별도의 이익을 따로 주어 이 문제를 우회하는 경우가 많습니다.",
            },
            {
              code: "네 값을 함께 놓고 조직 가능성을 판정한다. 한쪽만 조직되면 결과는 그쪽으로 기운다.",
              note: "양쪽 다 조직되지 않으면 결정이 아예 안건이 되지 않습니다. 관찰되지 않는 이 경우가 실제로는 가장 흔합니다.",
            },
          ]}
          output="각 이해 당사자의 조직 가능성과, 그 비대칭이 결정을 어느 쪽으로 기울게 하는지에 대한 판정"
        />
      </section>

      <section id="rent-seeking" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 4. 다투는 일 자체가 비용입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            여기까지는 특혜가 누구에게 가느냐의 문제였습니다. 그런데 특혜를 얻으려는
            다툼에는 그와 별개의 손실이 붙어 있습니다. 누가 가져가느냐는 옮기는
            문제지만, 가져가려고 쓴 돈은 사라지는 문제입니다.
          </p>

          <p className="leading-7">
            특혜를 얻으려면 자원을 씁니다. 사람을 고용하고 자료를 만들고 시간을
            들입니다. 반대쪽에서 막으려는 쪽도 같은 일을 합니다. 그리고 이 지출의
            대부분은 진 쪽의 것이라 아무것도 남기지 않습니다.
          </p>

          <p className="leading-7">
            얼마나 사라지는지는 계산할 수 있습니다. 각자가 쓴 돈의 비중만큼 이길
            확률을 갖는다고 두고 모두가 최선으로 대응하면, 놀랍게도 경쟁자가
            늘어날수록 지출 합계가 특혜의 가치 전체에 가까워집니다.
          </p>
        </div>

        <ExplainedFormula
          question="특혜를 나눠 주면 그 가치만큼만 자리를 옮기는가?"
          idea="각자가 쓴 돈의 비중만큼 이길 확률을 갖는다고 둡니다. 한 곳이 돈을 조금 더 쓰면 확률이 올라가 기대 이득이 늘지만 쓴 돈만큼 손해도 늘어나므로, 두 변화가 같아지는 지점에서 멈춥니다. 모두가 같은 조건이라 그 지점이 모두에게 같고, 그것을 인원수만큼 더하면 사회 전체가 쓴 돈이 나옵니다."
          formula={String.raw`x^{*} = \frac{n-1}{n^{2}}\,V, \qquad n\,x^{*} = \frac{n-1}{n}\,V \;\xrightarrow[\;n \to \infty\;]{}\; V`}
          annotatedFormula={String.raw`x^{*} = \underbrace{\frac{n-1}{n^{2}}\,V}_{\text{한 곳이 쓰는 돈}}, \qquad n\,x^{*} = \underbrace{\frac{n-1}{n}\,V}_{\text{사회 전체가 쓰는 돈}} \;\xrightarrow[\;n \to \infty\;]{}\; V`}
          operations={[
            {
              expression: String.raw`\frac{x_i}{\sum_j x_j}\,V - x_i`,
              annotation: [
                "한 곳의 기대 이득입니다. 앞은 이길 확률에 특혜 가치를 곱한 것이고 뒤는 실제로 쓴 돈입니다.",
                "이길 확률을 지출의 비중으로 둔 것이 이 계산의 핵심 단순화입니다.",
              ],
            },
            {
              expression: String.raw`\frac{n-1}{n^{2}}`,
              annotation: [
                "각자가 더 써도 이득이 늘지 않는 지점을 모든 경쟁자에게 동시에 적용해 나온 값입니다.",
                "n이 커질수록 이 값은 작아집니다. 경쟁자가 많아지면 한 곳이 쓰는 돈은 오히려 줄어듭니다.",
              ],
            },
            {
              expression: String.raw`\frac{n-1}{n}`,
              annotation: [
                "한 곳의 지출에 인원수를 곱한 합계이며, n이 커질수록 1에 가까워집니다.",
                "각자는 덜 쓰는데 합계는 늘어난다는 것이 이 두 식의 대비에서 바로 읽힙니다.",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`V`,
              name: "특혜의 가치",
              description:
                "그 결정을 따냈을 때 얻는 이익의 크기입니다. 독점권, 면허, 보조금처럼 형태는 여러 가지입니다.",
            },
            {
              symbol: String.raw`n`,
              name: "경쟁자 수",
              description:
                "그 특혜를 놓고 다투는 쪽의 수입니다. 막으려는 쪽도 자원을 쓰면 같은 계산에 들어갑니다.",
            },
            {
              symbol: String.raw`x^{*}`,
              name: "한 곳이 쓰는 돈",
              description:
                "모두가 상대의 지출을 보고 최선으로 대응한 상태에서 각자가 쓰는 금액입니다.",
            },
          ]}
          assumptions={[
            "이길 확률이 자기 지출의 비중과 같다고 둡니다. 실제로는 연줄이나 정보가 비대칭이라 같은 돈이 같은 확률을 사지 않습니다.",
            "모든 경쟁자의 조건이 같다고 둡니다. 한 곳이 이미 크게 유리하면 나머지가 아예 참여하지 않아 지출 합계가 훨씬 작아집니다.",
            "쓴 돈이 되돌아오지 않는다고 둡니다. 로비 과정에서 만들어진 정보가 실제로 정책을 개선하는 부분이 있다면 그만큼은 낭비가 아닙니다.",
          ]}
          interpretation="가치 1000억짜리 특혜를 두 곳이 다투면 각자 250억을 써서 합계가 500억이 되고, 네 곳이면 각자 187.5억에 합계 750억, 열 곳이면 각자 90억에 합계 900억이 됩니다. 여기서 읽어야 할 것은 각자가 쓰는 돈은 줄어드는데 사회 전체가 쓰는 돈은 늘어난다는 대비입니다. 경쟁이 치열해질수록 개별 기업의 부담은 가벼워지고 사회의 손실은 무거워집니다. 읽으면 안 되는 것은 실제 로비 지출이 특혜 가치의 90퍼센트라는 결론입니다. 이 값은 확률이 지출에 정확히 비례하고 모두가 같은 조건일 때의 상한에 가깝고, 실제로는 조건이 비대칭이라 참여 자체를 포기하는 쪽이 생겨 훨씬 낮게 나옵니다."
        />

        <RentSeekingViz />

        <CitationBlock
          source="Gordon Tullock · The Welfare Costs of Tariffs, Monopolies, and Theft (Western Economic Journal 5권 3호, 1967, 224~232쪽)"
          citeKey={1}
          href="https://doi.org/10.1111/j.1465-7295.1967.tb01923.x"
        >
          이전 연구들이 관세와 독점의 손실을 아주 작게 계산한 것이 도구의 문제라고
          보고, 빠진 항목을 지적한 글입니다. &ldquo;정부는 대개 스스로 보호관세를
          매기지 않는다. 그렇게 하도록 로비를 받거나 압력을 받아야 하고, 그러려면
          정치 활동에 자원이 지출된다&rdquo;고 적고, 그 지출을 &ldquo;사회 전체의
          관점에서는 순전히 낭비인데, 부를 늘리는 데 쓰이는 것이 아니라 부를
          옮기거나 옮기는 것을 막으려는 시도에 쓰이기 때문&rdquo;이라고 말합니다.
          도둑질을 예로 들어 &ldquo;이전 자체는 사회에 아무 비용도 지우지 않지만,
          그 일을 하는 사람들에게는 다른 활동과 마찬가지여서 이전을 만들거나 막는
          데 큰 자원이 투입될 수 있다&rdquo;고 덧붙입니다. 다만 저자 자신이
          &ldquo;이 지출을 측정할 방법은 제시할 수 없다&rdquo;고 명시했습니다. 위
          식은 이 논문에 있는 것이 아니라 뒤에 표준이 된 경합 모형이며, 이 글에서
          직접 전개했습니다. 대학 강의 자료로 공개된 사본에서 전문을 확인했고,
          링크는 이 학술지를 승계한 출판사 쪽 서지 항목을 가리킵니다.
        </CitationBlock>

        <div id="capture" className="scroll-mt-20">
          <h3 className="mb-4 mt-12 text-xl font-bold">
            규제하는 쪽이 규제받는 쪽에 기대게 되는 경로
          </h3>
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p className="leading-7">
              앞의 비대칭이 오래 유지되면 관계 자체가 굳습니다. 규제 기관이 판단을
              내리려면 그 산업에 대한 자세한 정보가 필요한데, 그 정보를 가장 많이
              가진 쪽이 규제받는 쪽입니다.
            </p>

            <p className="leading-7">
              반대편에는 그 정보를 제공할 사람이 없습니다. 흩어진 비용을 지는
              쪽은 조직되어 있지 않으니 자료를 만들어 보낼 조직도 없습니다. 그래서
              기관이 듣는 말의 대부분이 한쪽에서 옵니다.
            </p>

            <p className="leading-7">
              사람도 같은 방향으로 움직입니다. 그 분야를 아는 사람이 규제 기관과
              업계 양쪽에만 있으므로 인력이 오갑니다. 이 움직임 하나하나는 부정이
              아니지만, 쌓이면 기관의 시야가 업계의 시야와 비슷해집니다.
            </p>

            <p className="leading-7">
              그래서 포획은 누가 누구에게 무엇을 준 사건이 아니라 정보와 사람의
              흐름이 한쪽으로만 나 있는 상태에 가깝습니다. 개별 부정을 적발해도
              흐름 자체가 남아 있으면 같은 결과가 다시 나옵니다.
            </p>
          </div>
        </div>
      </section>

      <section id="boundary" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          걸러 내는 장치를 없애면 더 잘 대표되지는 않습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            이 글은 정당과 이익집단이 무엇을 잘라 내는지를 계속 말했습니다. 그러면
            그것들을 없애면 잘리는 것이 없어질 것 같지만, 그렇게 되지 않습니다.
            줄이는 장치가 사라지면 앞 글의 순환이 돌아오고, 그때 결정하는 것은
            순서를 쥔 자리입니다.
          </p>

          <p className="leading-7">
            조직되지 않은 이익도 마찬가지입니다. 이익집단을 금지해도 집중된 쪽은
            다른 형태로 조직되고, 흩어진 쪽은 여전히 조직되지 않습니다. 비대칭을
            만드는 것은 조직의 형태가 아니라 1인당 이해관계이기 때문입니다.
          </p>

          <p className="leading-7">
            그래서 물어야 할 것이 달라집니다. 장치를 없앨 것인가가 아니라, 잘려
            나간 쪽이 다시 들어올 통로가 있는가입니다. 새 축을 세우는 정당이 실제로
            생길 수 있는지, 흩어진 비용을 대신 말해 주는 자리가 있는지가 그
            통로입니다.
          </p>

          <p className="leading-7">
            여기까지가 결정이 내려지기 전의 이야기입니다. 그런데 내려진 결정이
            그대로 실행되는 것도 아닙니다. 다음 글{" "}
            <Link to="/politics/governance/bureaucracy-and-implementation">
              관료제와 집행
            </Link>
            이 그 단계를 맡습니다. 집행하는 조직이 왜 필요하고, 그 조직이 결정을
            어떻게 다시 한 번 걸러 내는지가 주제입니다.
          </p>
        </div>
      </section>
    </div>
  );
}

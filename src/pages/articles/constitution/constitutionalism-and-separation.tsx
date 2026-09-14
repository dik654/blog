import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import PaperBindsViz from "./constitutionalism-and-separation/viz/PaperBindsViz";
import VetoPlayerViz from "./constitutionalism-and-separation/viz/VetoPlayerViz";

/**
 * 헌법은 종이인데도 힘을 묶습니다
 *
 * 2편이 남긴 "지배자의 계산에 기대지 않고 미리 묶을 수 있는가"를 받는다.
 * 종이가 실제 힘을 제약하는 메커니즘, 나누기, 견제, 굳히기 네 부품을 다루고
 * 정부 형태별 배분 방식은 다음 글이 소유한다.
 */
export default function ConstitutionalismAndSeparationArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          강제력을 쥔 쪽이 왜 자기를 묶는 문서를 지키는지가 먼저입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            앞 글은 불편한 곳에서 끝났습니다. 통치가 유지되는 조건은 폭정에서도 똑같이 성립하고 지배자의 이익과 사회의 이익이 겹치는 구간은 조건부라는 것이었습니다. 그래서 다음 질문이
            나왔습니다. 선의나 계산에 기대지 않고 미리 묶어 둘 수 있는가입니다.
          </p>

          <p className="leading-7">
            헌법이 그 답이라고들 합니다. 그런데 여기서 바로 이상한 점이 드러납니다. 헌법은 종이에 적힌 글자이고 그것을 어길 수 있는 힘은 정작 묶이는 쪽이 쥐고 있습니다. 군대와
            경찰을 가진 쪽이 문서 한 장 때문에 물러설 이유가 무엇일까요.
          </p>

          <p className="leading-7">
            이 질문을 건너뛰면 헌법 이야기가 전부 당위가 됩니다. 그래서 이 글은 거기서 시작합니다. 종이가 실제로 힘을 묶는 경로를 먼저 세우고 그 위에서 나누기·견제·굳히기 세 장치가
            각각 무엇을 막는지 봅니다.
          </p>
        </div>

        <PaperBindsViz />

        <ContentBoundary article="constitutionalism-and-separation" />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            이 글이 푸는 질문은 하나입니다.{" "}
            <strong>
              집행력을 갖지 않은 문서가 어떻게 집행력을 가진 쪽을 제약하는가
            </strong>
            입니다.
          </p>

          <p className="leading-7">
            순서는 그 메커니즘, 권력을 기능으로 나누는 장치, 나눈 것들이 서로
            막게 하는 장치, 그리고 바꾸기 어렵게 굳히는 장치입니다. 마지막에
            이 장치들이 치르는 대가로 닫습니다.
          </p>

          <p className="leading-7">
            대통령제와 의원내각제가 이 권한들을 구체적으로 어떻게 배분하는지는
            다음 글{" "}
            <Link to="/politics/constitution/government-forms">
              정부 형태
            </Link>
            가 맡습니다. 여기서는 형태와 무관한 공통 구조만 봅니다.
          </p>
        </div>
      </section>

      <section id="why-paper-binds" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 1. 헌법은 무엇이 위반인지를 모두에게 같은 신호로 알려 줍니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            앞 글에서 통치가 순응 위에 선다는 것을 봤습니다. 뒤집으면 순응이 한꺼번에 무너지면 통치도 무너진다는 뜻입니다. 그런데 사람들이 한꺼번에 움직이려면 조건이 하나 필요합니다.
            지금이 나설 때라는 것을 서로 알아야 합니다.
          </p>

          <p className="leading-7">
            여기서 헌법의 역할이 나옵니다. 어디까지가 허용이고 어디부터가
            위반인지를 미리 문서로 못 박아 두면, 선을 넘는 순간 모두가 같은
            시점에 같은 판단을 하게 됩니다. 각자 다르게 느끼던 불만이 하나의
            공통된 신호로 바뀝니다.
          </p>

          <p className="leading-7">
            그래서 지배자가 물러서는 이유는 문서를 존중해서가 아닙니다. 선을 넘으면 흩어져 있던 저항이 한꺼번에 조직될 위험이 커지기 때문입니다. 헌법의 구속력은 종이 자체가 아니라 그
            종이가 만들어 내는 조정 효과에서 나옵니다.
          </p>

          <p className="leading-7">
            이 설명은 한 가지를 함께 예측합니다. 선이 모호하면 구속력이 약해집니다. 무엇이 위반인지 사람마다 다르게 읽히면 같은 시점에 같은 판단이 모이지 않고 그러면 선을 넘어도
            큰일이 생기지 않습니다.
          </p>
        </div>

        <TermBreakdown
          title="이 설명이 맞다면 따라 나오는 것들"
          items={[
            {
              term: "선은 뚜렷할수록 세다",
              description:
                "해석이 갈리지 않는 조항일수록 위반 여부가 한 번에 공유되므로 구속력이 큽니다. 임기 제한이나 선거 주기처럼 날짜와 숫자로 적힌 조항이 대표적입니다.",
              example:
                "임기 연장은 누가 봐도 위반이라 판단이 갈리지 않지만, '공공복리를 위한 제한'은 읽는 사람마다 다릅니다.",
              boundary:
                "뚜렷함이 좋기만 한 것은 아닙니다. 상황이 바뀌어도 조정할 여지가 없어져 다른 문제를 만듭니다.",
            },
            {
              term: "공개성이 필요하다",
              description:
                "내용을 모두가 알고, 위반이 일어났다는 사실도 널리 알려져야 조정이 일어납니다. 그래서 공포 절차와 언론의 존재가 구속력의 조건이 됩니다.",
              example:
                "같은 조항이라도 위반 사실이 알려지지 않으면 저항이 조직되지 않습니다.",
              boundary:
                "알려진다고 반드시 저항이 일어나는 것은 아닙니다. 조정은 가능해질 뿐 보장되지는 않습니다.",
            },
            {
              term: "누가 선을 판정하느냐가 중요해진다",
              description:
                "위반 여부를 공적으로 선언하는 자리가 있으면 조정이 훨씬 쉬워집니다. 위헌심사 기관이 그 역할을 합니다.",
              example:
                "법원이 위헌이라고 선언하면 각자 판단하던 사람들이 하나의 판정을 공유하게 됩니다.",
              boundary:
                "그 기관 자체가 포섭되면 신호가 오히려 위반을 정당화하는 쪽으로 쓰일 수 있습니다.",
            },
          ]}
        />
      </section>

      <section id="separation" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 2. 규칙을 만드는 쪽과 집행하는 쪽과 판정하는 쪽을 가릅니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            한 사람이 규칙을 만들고 집행하고 위반 여부까지 판정하면, 자기가 만든
            규칙으로 자기를 심판하는 셈이 됩니다. 그러면 앞 절의 신호가 아예
            생기지 않습니다. 위반이라고 선언할 사람이 위반한 당사자이기
            때문입니다.
          </p>

          <p className="leading-7">
            그래서 기능을 셋으로 가릅니다. 일반적인 규칙을 정하는 입법, 개별
            사안에 그 규칙을 적용해 실행하는 행정, 다툼이 생겼을 때 규칙에 맞는지
            판정하는 사법입니다. 이 구분은 조직도가 아니라 <em>같은 사람이 두
            역할을 겸하지 못하게</em> 하는 데 목적이 있습니다.
          </p>

          <p className="leading-7">
            나누는 것만으로도 얻는 것이 있습니다. 하나를 장악해도 나머지를 통해 제동이 걸리므로 권력을 남용하려면 여러 기관을 동시에 장악해야 합니다. 비용이 올라가고 그 과정이 눈에
            띄므로 앞 절의 신호가 켜질 시간이 생깁니다.
          </p>
        </div>

        <CitationBlock
          source="Publius · The Federalist No. 51 (1788년 2월 8일)"
          citeKey={1}
          href="https://avalon.law.yale.edu/18th_century/fed51.asp"
        >
          권력분립의 근거를 사람의 덕성이 아니라 제도적 이해관계에서 찾은
          글입니다. &ldquo;야심은 야심으로 맞서게 해야 한다&rdquo;고 적고, 각
          부서를 맡은 사람에게 다른 부서의 침범에 저항할 헌법적 수단과 개인적
          동기를 함께 주는 것이 권력 집중에 대한 큰 안전장치라고 말합니다. 이
          글 2절과 3절의 구도가 여기서 나옵니다. 다만 이것은 18세기 특정 헌법안을
          옹호하기 위한 정치 문헌이며, 여기 제시된 설계가 실제로 권력 집중을
          얼마나 막았는지에 대한 실증 연구가 아닙니다.
        </CitationBlock>
      </section>

      <section id="checks" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 3. 나누기만 하면 부족해서 서로 막을 수단을 줍니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            기능만 갈라 놓으면 각자 자기 영역에서 마음대로 하게 됩니다. 그래서
            서로의 결정에 끼어들 수단을 줍니다. 거부권, 동의 요건, 탄핵, 위헌
            심사가 그런 장치입니다. 이제 한 쪽이 무언가를 하려면 다른 쪽의
            승인이 필요해집니다.
          </p>

          <p className="leading-7">
            이 장치들의 효과는 한 문장으로 요약됩니다. <strong>바꿀 수 있는
            것이 줄어든다</strong>는 것입니다. 승인이 필요한 사람이 늘어날수록
            모두가 동의하는 변경안의 범위가 좁아지고, 어느 지점부터는 아무것도
            바꿀 수 없게 됩니다.
          </p>

          <p className="leading-7">
            그래서 견제 장치는 남용을 막는 동시에 정상적인 변경도 막습니다. 이
            둘은 같은 성질의 두 얼굴이지 별개의 문제가 아닙니다. 아래 계산이
            그 점을 정확히 보여 줍니다.
          </p>
        </div>

        <ExplainedFormula
          question="승인이 필요한 사람이 늘어나면 바꿀 수 있는 정책은 어떻게 줄어드는가?"
          idea="각 거부권자는 현재 상태보다 자기에게 나은 안에만 동의합니다. 정책을 하나의 축 위에 놓으면 그 조건은 현상유지보다 자기 이상점에 가까운 구간이 되고, 통과되려면 모든 거부권자의 구간에 동시에 들어야 합니다. 그래서 통과 가능한 영역은 구간들의 교집합이 됩니다."
          formula={String.raw`W(q) = \bigcap_{i=1}^{n} \{\, x : |x - x_i| < |q - x_i| \,\}`}
          annotatedFormula={String.raw`W(q) = \bigcap_{i=1}^{n} \underbrace{\{\, x : |x - x_i| < |q - x_i| \,\}}_{i\text{가 현상유지보다 낫다고 보는 구간}}`}
          operations={[
            {
              expression: String.raw`|x - x_i| < |q - x_i|`,
              annotation: [
                "새 안이 현상유지보다 자기 이상점에 더 가까운지를 두 거리의 비교로 씁니다.",
                "부등식이므로 딱 같은 거리인 안은 동의하지 않는 쪽으로 봅니다.",
              ],
            },
            {
              expression: String.raw`\bigcap_{i=1}^{n}`,
              annotation: [
                "한 사람이라도 반대하면 통과되지 않으므로 합집합이 아니라 교집합입니다.",
                "거부권자를 한 명 늘릴 때마다 구간이 더 좁아지기만 하고 넓어지지는 않습니다.",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`x_i`,
              name: "거부권자 i의 이상점",
              description:
                "그 사람이 가장 원하는 정책 위치입니다. 정책을 하나의 축으로 단순화했을 때의 좌표입니다.",
            },
            {
              symbol: String.raw`q`,
              name: "현상유지",
              description:
                "아무것도 바꾸지 않았을 때의 정책 위치이며, 모든 비교의 기준점입니다.",
            },
            {
              symbol: String.raw`W(q)`,
              name: "통과 가능 영역",
              description:
                "모든 거부권자가 현상유지보다 낫다고 보는 안들의 집합입니다. 비어 있으면 어떤 변경도 통과되지 않습니다.",
            },
          ]}
          assumptions={[
            "정책을 하나의 축 위에 놓을 수 있다고 둡니다. 축이 둘 이상이면 교집합의 모양이 훨씬 복잡해집니다.",
            "각 거부권자의 선호가 자기 이상점에서 멀어질수록 단조롭게 나빠진다고 둡니다.",
            "거래나 연계가 없다고 둡니다. 다른 사안과 묶어 주고받으면 여기서 막히는 안도 통과될 수 있습니다.",
          ]}
          interpretation="거부권자가 둘이고 이상점이 각각 5와 7인데 현상유지가 6이라면, 첫째는 6보다 5에 가까운 구간 즉 4보다 크고 6보다 작은 곳을, 둘째는 6보다 7에 가까운 곳 즉 6보다 크고 8보다 작은 곳을 원합니다. 두 구간은 겹치지 않으므로 통과 가능 영역이 비고, 아무것도 바꿀 수 없습니다. 여기서 읽어야 할 것은 교착이 누구의 고집 때문이 아니라 현상유지의 위치 때문에 생긴다는 점입니다. 읽으면 안 되는 것은 거부권자가 많으면 언제나 교착이라는 결론입니다. 현상유지가 모든 이상점의 바깥에 있으면 거부권자가 아무리 많아도 함께 옮길 여지가 남습니다."
        />

        <VetoPlayerViz />

        <div id="judicial-review" className="scroll-mt-20">
          <h3 className="mb-4 mt-12 text-xl font-bold">
            선출되지 않은 기관이 선출된 결정을 뒤집어도 되는가
          </h3>
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p className="leading-7">
              견제 장치 가운데 위헌심사는 성격이 다릅니다. 선거로 뽑히지 않은
              소수가 다수의 대표가 만든 법을 무효로 만들기 때문입니다. 다수결로
              정한 것을 다수결로 뽑히지 않은 쪽이 뒤집는다는 점에서 긴장이
              생깁니다.
            </p>

            <p className="leading-7">
              이 긴장을 푸는 흔한 답은 층을 나누는 것입니다. 지금의 다수가 정한 것을 뒤집는 근거가 더 앞선 시점의 더 큰 합의, 곧 헌법이라는 설명입니다. 심사 기관은 자기 뜻을
              관철하는 것이 아니라 그 합의를 대신 읽는 자리입니다.
            </p>

            <p className="leading-7">
              이 답이 성립하려면 조건이 있습니다. 헌법의 선이 읽는 사람에 따라 크게 달라지지 않아야 합니다. 해석의 폭이 넓어질수록 그 기관은 합의를 읽는 자리가 아니라 스스로 정하는
              자리에 가까워지고 1절의 신호도 함께 흐려집니다.
            </p>
          </div>
        </div>
      </section>

      <section id="entrenchment" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 4. 바꾸기 어렵게 만들면 지켜지지만 굳어 버립니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            마지막 장치는 헌법 자체를 바꾸기 어렵게 만드는 것입니다. 일반 법률은
            과반으로 바꿀 수 있지만 헌법은 훨씬 높은 문턱을 둡니다. 특별다수,
            여러 기관의 동의, 국민투표, 기간을 두고 두 번 의결하기 같은 방식이
            쓰입니다.
          </p>

          <p className="leading-7">
            이 장치가 필요한 이유는 분명합니다. 바꾸기 쉬우면 힘을 쥔 쪽이 제약을 먼저 없애고 나서 원하는 것을 하면 됩니다. 문턱을 높이면 그 우회로가 막히고 1절의 선이 실제로 선
            역할을 하게 됩니다.
          </p>

          <p className="leading-7">
            대가는 앞 절의 계산 그대로입니다. 문턱이 높다는 것은 거부권자가 많다는 뜻이고 그만큼 통과 가능 영역이 좁아집니다. 정말 고쳐야 할 것도 고칠 수 없게 되며 그 압력이 개정이
            아니라 해석의 변경이나 조문 무시로 빠져나가기도 합니다.
          </p>
        </div>

        <AlgorithmBlock
          title="어떤 변경이 통과될 수 있는지 판정하는 절차"
          input={[
            "정책 축과 현상유지 위치 q",
            "거부권을 가진 행위자 목록과 각자의 이상점",
            "요구되는 정족수: 각 단계에서 누구의 동의가 필요한가",
          ]}
          steps={[
            {
              code: "거부권자를 빠짐없이 나열한다. 형식적 동의권만 있는 자리도 포함한다.",
              note: "실제 교착의 원인이 목록에서 빠진 행위자인 경우가 많습니다. 상원·대통령·헌법재판소·지방정부가 각각 거부권자일 수 있습니다.",
            },
            {
              code: "각 거부권자 i에 대해 승인 구간을 구한다: q와 2·x_i − q 사이.",
              note: "현상유지보다 자기 이상점에 가까운 구간이며, 이상점을 중심으로 q를 반사한 지점까지입니다.",
            },
            {
              code: "모든 구간의 교집합을 구한다.",
              note: "한 명이라도 반대하면 끝이므로 교집합입니다. 이 단계에서 비면 다음으로 넘어갈 필요가 없습니다.",
            },
            {
              code: "교집합이 비면 '현상유지 고착'으로 판정하고, 비지 않으면 그 구간이 실현 가능한 변경 범위다.",
              note: "교착이 확인되면 원인을 따로 봐야 합니다. 거부권자 수 때문인지, 현상유지가 이상점들 사이에 있기 때문인지에 따라 해법이 다릅니다.",
            },
            {
              code: "교착이면 우회 경로를 점검한다: 사안 묶기, 해석 변경, 정족수 자체의 변경, 조문 무시.",
              note: "제도가 막으면 압력은 사라지지 않고 다른 통로로 나옵니다. 어느 통로로 나오는지가 그 체제의 성격을 드러냅니다.",
            },
          ]}
          output="실현 가능한 변경의 범위, 또는 교착이라는 판정과 그 원인 및 압력이 빠져나갈 통로 목록"
        />

        <ProgressiveDetail
          title="문턱을 얼마나 높여야 적당한가?"
          preview="한쪽 끝에는 제약이 사라지는 위험이, 다른 끝에는 고칠 수 없어 무시당하는 위험이 있습니다."
        >
          <p className="leading-7">
            문턱이 낮으면 헌법이 일반 법률과 다를 바 없어집니다. 힘을 쥔 쪽이 제약을 먼저 고치고 나서 원하는 것을 하면 되므로 1절에서 말한 선이 선 역할을 하지 못합니다.
          </p>
          <p className="leading-7">
            문턱이 너무 높으면 반대 방향의 문제가 생깁니다. 사회가 크게 바뀌어 조문이 현실과 어긋나도 고칠 수 없고 그러면 실제 운용이 조문과 따로 놀기 시작합니다. 조문을 지키지 않는
            것이 관행이 되면 다른 조문의 구속력도 함께 약해집니다.
          </p>
          <p className="leading-7">
            그래서 실제 헌법들은 부분마다 다른 문턱을 두기도 합니다. 통치 구조는
            상대적으로 고치기 쉽게 두고 기본권의 핵심은 더 높은 문턱이나 개정
            금지로 묶는 식입니다. 무엇을 어느 층에 둘지가 곧 그 사회가 무엇을
            흔들리지 않게 하고 싶은지에 대한 답입니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="boundary" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          조문이 같아도 같은 제약이 되지는 않습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            이 글의 논리는 모두 1절에 얹혀 있습니다. 헌법이 구속력을 갖는 것은
            위반 신호가 공유되고 그 신호에 반응할 수 있기 때문입니다. 그 조건이
            없으면 같은 조문도 종이로 남습니다.
          </p>

          <p className="leading-7">
            앞 글의 국가 능력이 여기서 다시 걸립니다. 정보와 집행이 닿지 않는
            지역에서는 조문이 무엇이든 실제 운용이 달라집니다. 제도를 비교할 때
            조문만 보면 안 되는 이유가 두 글에서 같은 형태로 나왔습니다.
          </p>

          <p className="leading-7">
            여기까지가 형태와 무관한 공통 구조입니다. 실제 헌법들은 이 장치들을
            서로 다르게 조합합니다. 특히 입법과 행정을 한 덩어리로 묶느냐 따로
            뽑느냐에 따라 앞 절의 거부권자 목록 자체가 달라집니다.
          </p>

          <p className="leading-7">
            다음 글{" "}
            <Link to="/politics/constitution/government-forms">
              정부 형태
            </Link>
            에서 그 두 갈래를 봅니다. 같은 권력분립 원칙에서 왜 전혀 다른 두
            체계가 나오고, 각각 어떤 교착과 어떤 위험을 갖는지가 주제입니다.
          </p>
        </div>
      </section>
    </div>
  );
}

import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import DecisionTimingViz from "./rules-standards-and-interpretation/viz/DecisionTimingViz";
import RuleOrStandardViz from "./rules-standards-and-interpretation/viz/RuleOrStandardViz";
import InterpretationCoreViz from "./rules-standards-and-interpretation/viz/InterpretationCoreViz";
import GapAnalogyBranchViz from "./rules-standards-and-interpretation/viz/GapAnalogyBranchViz";

/**
 * 법은 언제 구체적인 답을 정할까요?
 *
 * 앞 글의 법적 효력·명확성에서 출발해, 하나의 빙판길 속도 사건을 두 방식으로
 * 판정한다. 행동 전 구체화와 행동 후 구체화의 비용을 비교한 뒤, 어느 쪽에도
 * 남는 해석과 법의 빈칸까지 간다. 판단이 선례가 되는 과정은 다음 글이 소유한다.
 */
export default function RulesStandardsAndInterpretationArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          법은 구체적인 답을 정하는 시점을 고릅니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            빙판길을 시속 95킬로미터로 달린 차가 있습니다. 법에 “시속
            100킬로미터를 넘지 말라”고 적혀 있다면 위반이 아닙니다. 반면 “안전한
            속도로 달려야 한다”고 적혀 있다면 노면과 시야를 확인한 뒤 위반이라고
            판단할 수도 있습니다.
          </p>

          <p className="leading-7">
            같은 행동과 같은 안전 목표인데 결론이 달라진 까닭은 답을 정한
            시점입니다. 첫 문장은 행동 전에 선을 그었고, 둘째 문장은 사건이 생긴
            뒤 사정을 살피게 했습니다.
          </p>

          <p className="leading-7">
            <strong>
              행동 전에 구체적인 선을 정하면 반복해서 판단하는 비용은 줍니다.
              대신 현실과 어긋날 수 있습니다. 사건 뒤에 정하면 사정에는 잘
              맞지만 매번 판단 비용을 치릅니다.
            </strong>{" "}
            이 교환관계가 이 글의 한 문장 답입니다.
          </p>

          <p className="leading-7">
            아래 그림에서는 같은 95킬로미터 사건의 왼쪽과 오른쪽을 번갈아
            보세요. 왼쪽은 선이 먼저 생기고, 오른쪽은 사실 조사가 먼저
            일어납니다.
          </p>
        </div>

        <DecisionTimingViz />

        <div className="prose prose-neutral mt-6 max-w-none dark:prose-invert">
          <p className="leading-7">
            그림에서 보듯 두 방식은 “엄격한 법과 느슨한 법”의 차이가 아닙니다.
            같은 목표에 필요한 구체적인 내용을 언제 채우는지가 다릅니다. 그러면
            자연스럽게 다음 질문이 생깁니다. 어느 시점에 정하는 편이 나은지
            따져 보겠습니다.
          </p>
        </div>

        <ContentBoundary article="rules-standards-and-interpretation" />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            이 글은 그 질문을 사안 수와 어긋남의 손해로 계산한 뒤, 숫자로 선을
            그어도 왜 해석이 남는지 살펴봅니다. 적용할 조문이 아예 없을 때
            어디까지 비슷한 조문을 가져올 수 있는지도 구분합니다.
          </p>
          <p className="leading-7">
            한 사건의 판단이 다음 사건을 얼마나 구속하는지는 다음 글{" "}
            <Link to="/law/legal-system/precedent-and-legal-change">
              선례와 법의 변화
            </Link>
            에서 이어집니다.
          </p>
        </div>
      </section>

      <section id="two-timings" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          왜 같은 95킬로미터가 다른 판정을 만들까요?
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            시속 100킬로미터라는 선은 운전자가 출발하기 전에 이미 있습니다.
            운전자는 계기판으로 자기 위치를 알 수 있고, 단속하는 쪽은 측정값만
            선과 비교하면 됩니다. 다만 빙판에서 위험한 시속 95킬로미터를
            놓칩니다.
          </p>

          <p className="leading-7">
            “안전한 속도”라는 문장은 미리 숫자를 정하지 않습니다. 판단하는 쪽은
            사건이 생긴 뒤 노면·시야·교통량을 조사해 답을 구체화합니다. 실제
            위험에는 더 잘 맞출 수 있지만, 운전자는 결과를 정확히 예측하기
            어렵고 같은 조사가 사건마다 반복됩니다.
          </p>

          <p className="leading-7">
            이제 두 방식에 이름을 붙일 수 있습니다. 행동 전에 구체적인 내용을
            정해 둔 형식은 <strong>규칙(rule)</strong>입니다. 사건 뒤에 사정을
            평가해 내용을 구체화하는 형식은 <strong>기준(standard)</strong>
            입니다. 두 형식은 문장의 길이가 아니라 구체화 시점으로 나뉩니다.
          </p>
        </div>

        <TermBreakdown
          title="시점 하나가 바꾸는 세 가지"
          items={[
            {
              term: "비용을 치르는 때",
              description:
                "규칙은 제정할 때 조사와 합의 비용을 먼저 치르고, 기준은 사건이 생길 때마다 당사자와 판단자가 비용을 치릅니다.",
              example:
                "속도 제한선은 한 번 정하지만, 안전했는지는 노면과 시야를 사건마다 다시 확인합니다.",
              boundary:
                "제정 비용은 눈에 잘 띄지 않고 재판 비용은 드러나므로, 장부를 합치지 않으면 한쪽이 실제보다 싸 보일 수 있습니다.",
            },
            {
              term: "결과를 아는 때",
              description:
                "규칙은 행동 전에 결과를 알기 쉽고, 기준은 사건 뒤에야 결과가 선명해집니다.",
              example:
                "시속 100이라는 선이 있으면 95로 달린 운전자는 적어도 그 조항의 숫자 위반은 아니라고 예측할 수 있습니다.",
              boundary:
                "예측 가능성은 선 바로 아래까지 가도 된다는 유인을 만들 수 있습니다.",
            },
            {
              term: "오차가 남는 곳",
              description:
                "규칙은 고정선의 양쪽에 과잉 포함과 과소 포함을 남기고, 기준은 사건별 판단의 차이와 불확실성을 남깁니다.",
              example:
                "빙판의 95는 위험해도 선에 걸리지 않고, 안전한 직선도로의 105는 덜 위험해도 선에 걸릴 수 있습니다.",
              boundary:
                "조건을 계속 붙여 규칙을 정교하게 만들면 읽고 적용하는 비용도 함께 커집니다.",
            },
          ]}
        />
      </section>

      <section id="cost-comparison" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          어느 쪽이 나은지는 무엇을 세어야 알 수 있을까요?
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            먼저 가상의 비용 장부를 만듭니다. 규칙을 조사하고 만드는 데 1000이
            한 번 들고, 고정선이 현실과 어긋날 때마다 평균 2의 손해가 생긴다고
            하겠습니다. 기준은 만드는 비용을 따로 잡지 않는 대신 사건마다 12를
            들여 판단합니다.
          </p>

          <p className="leading-7">
            한 해 20건이면 규칙은 1000에 20×2를 더한 1040이고, 기준은 20×12인
            240입니다. 반대로 500건이면 2000 대 6000이 되어 규칙이
            싸집니다. 한 번만 내는 1000은 반복할수록 사건당 작아지지만, 매번
            내는 12는 그대로이기 때문입니다.
          </p>

          <p className="leading-7">
            아래 그림은 사안 수를 20건, 100건, 500건으로 바꿉니다. 마지막
            장면에서는 사안 수를 그대로 두고 고정선의 어긋남만 키워, 결론이 다시
            바뀌는지 확인합니다.
          </p>
        </div>

        <RuleOrStandardViz />

        <div className="prose prose-neutral mt-6 max-w-none dark:prose-invert">
          <p className="leading-7">
            따라서 “사안이 많으면 규칙이 낫다”만 기억하면 안 됩니다. 고정선의
            어긋남이 커지면 반복이 많아도 규칙의 총비용이 더 클 수 있습니다.
            이제 이 관계를 어느 숫자에서 뒤집히는지 식으로 확인해 보겠습니다.
          </p>
        </div>

        <ExplainedFormula
          question="두 방식의 총비용이 뒤집히는 사안 수는 몇 건인가?"
          idea="규칙 쪽에는 한 번 드는 제정 비용과 사건마다 생기는 어긋남 손해를 넣습니다. 기준 쪽에는 사건마다 드는 판단 비용을 넣습니다. 규칙의 총비용이 기준보다 작아지는 조건을 사안 수 n에 대해 풀면 갈림길이 나옵니다."
          formula={String.raw`c_{R} + n\,m \;<\; n\,c_{S} \quad\Longleftrightarrow\quad n \;>\; n^{*} = \frac{c_{R}}{c_{S}-m}`}
          annotatedFormula={String.raw`\underbrace{c_{R} + n\,m}_{\text{규칙의 총비용}} \;<\; \underbrace{n\,c_{S}}_{\text{기준의 총비용}} \quad\Longleftrightarrow\quad n \;>\; \underbrace{\frac{c_{R}}{c_{S}-m}}_{\text{비용이 뒤집히는 사안 수}}`}
          operations={[
            {
              expression: String.raw`c_{R} + n\,m`,
              annotation: [
                "규칙을 만드는 비용 c_R은 한 번만 들고, 고정선의 어긋남 m은 사안 수 n만큼 반복됩니다.",
                "그래서 n이 커질수록 c_R을 사건 하나에 나눈 몫은 작아집니다.",
              ],
            },
            {
              expression: String.raw`n\,c_{S}`,
              annotation: [
                "기준을 적용할 때 사건 하나에 드는 판단 비용 c_S가 n번 반복됩니다.",
                "사안이 늘어도 사건 하나당 판단 비용은 줄지 않는다고 단순화한 장부입니다.",
              ],
            },
            {
              expression: String.raw`\frac{c_{R}}{c_{S}-m}`,
              annotation: [
                "분모 c_S−m은 사건 하나를 규칙으로 처리했을 때 아끼는 순비용입니다.",
                "m이 c_S에 가까워지면 사건 하나에서 아끼는 몫이 거의 없어져, 제정 비용을 회수하려면 매우 많은 사안이 필요합니다.",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`c_{R}`,
              name: "규칙 제정 비용",
              description:
                "경우의 수를 조사하고 선을 정해 문장으로 만드는 데 한 번 드는 비용입니다.",
            },
            {
              symbol: String.raw`c_{S}`,
              name: "기준의 사건당 판단 비용",
              description:
                "당사자가 결과를 알아보고 판단자가 사실관계를 평가하는 데 사건마다 드는 비용입니다.",
            },
            {
              symbol: String.raw`m`,
              name: "규칙의 사건당 어긋남 손해",
              description:
                "고정선이 실제 위험과 맞지 않아 생기는 손해를 사건 하나당 평균으로 나타낸 값입니다.",
            },
          ]}
          assumptions={[
            "두 방식이 같은 목표를 담을 수 있다고 둡니다. 애초에 미리 정할 수 없는 판단이라면 이 비교를 그대로 쓸 수 없습니다.",
            "사안 수와 사건당 비용을 미리 어림할 수 있다고 둡니다. 새 영역에서는 이 값들이 가장 불확실합니다.",
            "어긋남의 손해를 평균으로 잡습니다. 드물지만 큰 손해가 섞여 있다면 평균만으로 위험을 판단하면 안 됩니다.",
          ]}
          interpretation="c_R=1000, c_S=12, m=2이면 분모는 10이고 문턱은 100건입니다. 100건보다 적으면 사건별 판단이 싸고, 많으면 규칙이 싸다는 뜻입니다. 다만 m을 8로 높이면 분모는 4가 되어 문턱이 250건으로 밀립니다. 실제 제도에서는 이 세 값뿐 아니라 공정성, 권한 배분, 기본권, 집행 가능성도 함께 검토해야 하므로 이 식은 비용 직관을 보여 주는 설명용 모형입니다."
        />

        <CitationBlock
          source="Louis Kaplow · Rules Versus Standards: An Economic Analysis (Duke Law Journal 42권 3호, 1992)"
          citeKey={1}
          href="https://hls.harvard.edu/bibliography/rules-versus-standards-an-economic-analysis/"
        >
          Kaplow는 규칙과 기준을 구체적인 내용을 행동 전에 주는가, 행동 뒤
          재판에서 주는가로 구분합니다. 규칙은 만들 때 비용이 더 들고, 기준은
          개인이 행동을 정하고 판단자가 과거 행위에 적용할 때 비용이 더 드는
          경향이 있다고 설명합니다. 위 문턱 식과 숫자는 이 비용 비대칭을
          따라가도록 이 글이 만든 설명용 모형이며, 논문이 제시한 실증 결과나
          원래 수식이 아닙니다.
        </CitationBlock>
      </section>

      <section id="interpretation" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          숫자로 선을 그었는데도 왜 해석이 남을까요?
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            속도는 숫자로 적을 수 있지만 “차량”과 “도로”의 범위는 다시 말로
            적어야 합니다. 공원에 차량 출입을 금지한다고 했을 때 승용차는
            들어가고 보행자는 벗어납니다. 자전거·전동 휠체어·응급차·전시용
            전차는 그 사이에 남습니다.
          </p>

          <p className="leading-7">
            따라서 해석은 조문 전체를 마음대로 다시 쓰는 일이 아닙니다. 비교적
            분명한 안쪽과 바깥쪽 사이에서, 그 문장과 법체계가 어느 쪽을
            가리키는지 근거를 확인하는 일입니다.
          </p>

          <p className="leading-7">
            아래 그림은 왼쪽의 확실한 적용 사례에서 시작해 가운데 회색 지대로
            이동합니다. 마지막 장면에서는 말의 통상적 의미, 조문 사이의 관계,
            목적과 연혁, 입법 자료를 차례로 펼칩니다.
          </p>
        </div>

        <InterpretationCoreViz />

        <div className="prose prose-neutral mt-6 max-w-none dark:prose-invert">
          <p className="leading-7">
            이 네 항목은 모든 나라와 모든 사건에 똑같이 적용되는 고정 사다리가
            아닙니다. 한국 대법원은 문언의 통상적 의미를 원칙으로 삼습니다.
            여기에 입법 취지와 목적, 제·개정 연혁, 법질서 전체, 다른 법령과의
            관계를 함께 봅니다. 미국에서도 문언, 법률 맥락, 해석 원칙, 입법
            연혁과 집행 자료를 씁니다. 다만 자료의 무게는 해석 이론에 따라
            달라집니다.
          </p>
          <p className="leading-7">
            그래서 다음 절차는 보편적 우선순위를 선언하는 규칙이 아니라, 근거가
            조문에서 얼마나 멀어졌는지 놓치지 않기 위한 설명용 점검 순서입니다.
          </p>
        </div>

        <AlgorithmBlock
          title="한 사건에서 해석 근거를 넓혀 가는 과정"
          input={[
            "적용 여부를 다투는 조문과 관련 조문",
            "빙판길·시속 95킬로미터처럼 확인된 사실",
            "제정·개정 연혁과 필요한 범위의 입법 자료",
          ]}
          steps={[
            {
              code: "1. 문장의 통상적 의미로 사례가 확실히 안쪽인지 바깥쪽인지 확인한다.",
              note: "승용차와 보행자처럼 답이 선명하면 더 넓은 자료를 끌어오지 않고 여기서 멈출 수 있습니다.",
            },
            {
              code: "2. 같은 법의 정의·예외·관련 조문을 맞춰, 단어가 법 전체에서 같은 뜻으로 쓰였는지 확인한다.",
              note: "예외를 따로 적었다는 사실과 정의 조항은 원칙의 범위를 좁히거나 넓히는 근거가 됩니다.",
            },
            {
              code: "3. 문언의 가능한 범위 안에서 입법 목적과 제정·개정 연혁을 함께 본다.",
              note: "공원 조문이 소음과 사고를 막으려는 것이라면 전시용 전차와 응급차를 달리 볼 이유가 생깁니다. 목적이 여러 개라면 하나만 골라 결론을 만들면 안 됩니다.",
            },
            {
              code: "4. 그래도 답이 갈리면 입법 자료와 실제 집행 맥락을 검토하고, 어느 근거가 결론을 바꿨는지 밝힌다.",
              note: "한 사람의 발언을 입법자의 공통 의사로 취급할 수는 없습니다. 자료의 대표성과 법체계별 허용 범위를 따로 확인해야 합니다.",
            },
            {
              code: "5. 적용할 문장 자체가 없다면 해석 문제와 법의 빈칸 문제를 분리한다.",
              note: "여기서부터는 있는 문장의 뜻을 찾는 일보다, 비슷한 규범으로 빈칸을 메울 수 있는지가 쟁점이 됩니다.",
            },
          ]}
          output="사례에 조문을 적용할지의 결론, 결론을 바꾼 근거, 문언의 가능한 범위 안에서 해결됐는지 여부"
        />

        <CitationBlock
          source="대법원 2020. 9. 3. 선고 2016두32992 전원합의체 판결"
          citeKey={2}
          href="https://law.go.kr/precInfoP.do?precSeq=226511"
        >
          대법원은 법률의 입법 취지와 목적, 제·개정 연혁, 법질서 전체와의 조화,
          다른 법령과의 관계를 고려하더라도 가능한 한 문언의 통상적 의미에
          충실하게 해석하는 것이 원칙이라고 밝혔습니다. 문언이 비교적 명확하면
          다른 해석방법을 쓸 필요가 없거나 그 사용이 제한된다는 점도 함께
          적었습니다.
        </CitationBlock>

        <CitationBlock
          source="U.S. Congressional Research Service · Statutory Interpretation: Theories, Tools, and Trends"
          citeKey={3}
          href="https://www.congress.gov/crs_external_products/R/PDF/R45153/R45153.6.pdf"
        >
          미국 의회조사국 보고서는 통상적 의미, 법률 맥락, 해석 원칙, 입법
          연혁, 실제 집행을 주요 도구로 소개합니다. 동시에 문언주의와 목적주의
          같은 접근이 자료의 사용과 무게를 다르게 본다고 설명합니다. 이 자료는
          위 점검 순서를 전 세계 공통 규칙으로 오해하지 않게 해 주는 비교
          근거입니다.
        </CitationBlock>
      </section>

      <section id="gaps-and-analogy" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          적용할 문장 자체가 없다면 어디까지 메울 수 있을까요?
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            새 기술이나 예상하지 못한 거래가 등장하면 단어의 경계가 아니라
            적용할 조문 자체가 없을 수 있습니다. 이때 먼저 물을 것은 입법자가
            빠뜨린 빈칸인지, 일부러 규율하지 않은 영역인지입니다.
          </p>
        </div>

        <GapAnalogyBranchViz />

        <div className="prose prose-neutral mt-6 max-w-none dark:prose-invert">
          <p className="leading-7">
            빠뜨린 빈칸이라면 비슷한 사안을 다루는 조문을 가져와 적용할 수
            있습니다. 이것이 <strong>유추 적용</strong>입니다. 두 사안이 그
            조문이 겨냥한 성질에서 비슷해야 합니다. 법체계와 입법 목적에 비춰
            같은 효과를 주는 것도 정당해야 합니다.
          </p>

          <p className="leading-7">
            그러나 입법자가 일부러 비워 둔 곳을 빈칸이라고 부르면 법원이 새
            규율을 만드는 결과가 됩니다. 특히 형벌처럼 국가가 개인에게 중대한
            불이익을 주는 영역에서는 이 경계가 더 엄격합니다.
          </p>
        </div>

        <CitationBlock
          source="대한민국헌법 제12조 제1항·제13조 제1항"
          citeKey={4}
          href="https://www.law.go.kr/lsInfoP.do?lsiSeq=53088"
        >
          헌법은 법률에 의하지 않은 처벌을 금지하고, 행위 당시 범죄가 아니었던
          행위로 소추하지 못하도록 정합니다. 그래서 행위 당시 문언의 가능한
          범위를 넘어 피고인에게 불리하게 처벌 범위를 새로 만드는 유추는
          허용되지 않습니다.
        </CitationBlock>

        <CitationBlock
          source="헌법재판소 2012. 5. 31. 2009헌바123 등 결정"
          citeKey={5}
          href="https://www.law.go.kr/LSW/detcInfoP.do?detcSeq=19781"
        >
          헌법재판소는 일반 법률에서 체계적·합목적적 해석이나 유추로 흠결을
          보충할 수 있다고 설명하면서도, 형벌조항은 죄형법정주의 때문에
          입법목적을 내세운 유추가 금지된다고 밝혔습니다. 조세 법규처럼 법률상
          근거가 엄격히 필요한 영역에서도 해석으로 새로운 부과 근거를 만드는
          것은 허용되지 않는다고 함께 판시했습니다.
        </CitationBlock>

        <ProgressiveDetail
          title="형벌에서는 목적을 전혀 볼 수 없다는 뜻일까요?"
          preview="금지되는 것은 목적을 보는 일 자체가 아니라, 가능한 문언을 넘어 피고인에게 불리한 처벌 근거를 새로 만드는 일입니다."
        >
          <p className="leading-7">
            형벌 조항도 단어의 통상적 의미가 허용하는 범위 안에서는 입법 취지와
            목적을 볼 수 있습니다. 연혁과 다른 조문도 함께 검토합니다. 단어
            하나를 사전에서 찾는 것만으로 모든 사건을 해결할 수는 없기
            때문입니다.
          </p>
          <p className="leading-7">
            다만 그 자료를 이용해 문언의 가능한 범위를 넘고, 피고인에게 불리한
            새 처벌 근거를 만들 수는 없습니다. 이 한계는 “해석을 하느냐”가
            아니라 “해석으로 없던 처벌을 만들었느냐”에 놓입니다.
          </p>
          <p className="leading-7">
            침익적 행정처분이나 조세처럼 법률상 근거가 엄격히 요구되는
            영역에서도 불리한 확장·유추가 제한됩니다. 그러므로 “형벌에서만
            유추가 막힌다”고 외우면 안 됩니다. 누가 어떤 불이익을 부과하는지,
            법률이 어느 정도로 명확한 근거를 요구하는지 확인해야 합니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="boundary" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          결국 어느 형식을 고를지는 세 값을 함께 보는 일입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            빙판길의 시속 95킬로미터로 돌아가 보겠습니다. 같은 사례가 자주
            반복되고 시속 100이라는 선의 어긋남이 작다고 하겠습니다. 이때는
            행동 전에 규칙으로 정해 두는 편이 반복 비용과 불확실성을 줄입니다.
            반대로 도로 상태가 크게 다르고 고정선의 오차가 크다면, 기준으로 남겨
            사건 뒤에 판단하는 편이 나을 수 있습니다.
          </p>

          <p className="leading-7">
            선택할 때는 사안 수, 사건별 판단 비용, 고정선의 어긋남 손해를 함께
            봐야 합니다. 여기에 기본권과 권한 배분처럼 비용으로만 바꿀 수 없는
            한계도 더해야 합니다. 그래서 규칙과 기준 중 하나가 언제나 우월하다는
            결론은 나오지 않습니다.
          </p>

          <p className="leading-7">
            어느 쪽을 택해도 해석은 사라지지 않습니다. 그리고 한 사건에서
            메운 회색은 다음 사건의 근거가 되기 시작합니다. 다음 글{" "}
            <Link to="/law/legal-system/precedent-and-legal-change">
              선례와 법의 변화
            </Link>
            에서는 그 판단이 왜 따라야 할 이유가 되고, 언제 거두어야 하는지를
            살펴봅니다.
          </p>
        </div>
      </section>
    </div>
  );
}

import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import ImplementationChainViz from "./bureaucracy-and-implementation/viz/ImplementationChainViz";
import MeasurementDistortionViz from "./bureaucracy-and-implementation/viz/MeasurementDistortionViz";

/**
 * 배달 차량 1,000대를 20일 안에 점검하라는 한 도시의 결정이 집행 조직과
 * 마지막 검사관을 지나며 달라지는 경로를 끝까지 추적한다.
 */
export default function BureaucracyAndImplementationArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          “차량 1,000대를 점검하라”는 결정만으로는 결과가 정해지지 않습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            설명을 위해 한 도시가 성수기 전에 배달 차량 1,000대를 20일 안에
            점검하고, 화재 위험이 큰 차량부터 자세히 보라고 결정했다고
            가정하겠습니다. 집행기관에는 검사관 10명이 있습니다. 한 검사관은
            체크리스트만 보면 하루에 5대를 처리하지만, 배터리 불법 개조처럼 드문
            결함을 자세히 찾으려면 하루에 1대밖에 보지 못합니다.
          </p>

          <p className="leading-7">
            계산부터 하면 검사관의 시간은 10명×20일=200일입니다. 빠른 점검만
            하면 200×5=1,000대를 채울 수 있지만, 정밀 점검만 하면 200대가
            한계입니다. “1,000대를 점검하라”와 “위험한 차량을 먼저 찾아라”를
            같은 시간 안에 모두 완벽하게 지킬 수 없습니다.
          </p>

          <p className="leading-7">
            답은 한 문장으로 정리됩니다.{" "}
            <strong>
              결정문은 개별 차량을 누가, 어떤 정보로, 어디까지 살필지와 예외를
              어떻게 처리할지까지 정하지 못하므로, 집행기관의 규칙과 마지막
              검사관의 판단이 실제 정책을 다시 만듭니다.
            </strong>{" "}
            이 차이는 담당자가 게을러서만 생기는 것이 아닙니다. 처리해야 할 양과
            정보, 시간의 제약만으로도 생깁니다.
          </p>
        </div>

        <ImplementationChainViz />
        <ContentBoundary article="bureaucracy-and-implementation" />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            이제 같은 점검 사례를 다섯 번 봅니다. 왜 의회가 직접 검사할 수
            없는지, 맡긴 뒤 누가 무엇을 더 많이 아는지, 체크리스트와 현장 판단을
            어디서 나눌지, 처리 건수에 보상을 걸면 정밀 조사가 왜 줄어드는지,
            마지막으로 어떤 통제가 그 차이를 줄일 수 있는지 순서대로 봅니다.
          </p>
          <p className="leading-7">
            차량 수·기간·처리 속도는 설명을 연결하기 위한 가상 수치입니다. 특정
            도시의 실제 점검 실적이나 검사관 생산성을 주장하는 값이 아닙니다.
            국가들 사이처럼 최종 집행자가 없는 경우는 다음 글{" "}
            <Link to="/politics/governance/international-anarchy">
              국제 무정부
            </Link>
            에서 이어집니다.
          </p>
        </div>
      </section>

      <section id="why-delegate" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          1. 의회는 기준을 정할 수 있지만 차량 1,000대를 직접 볼 수는 없습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            맡길 수밖에 없는 첫째 이유는 양입니다. 차량 1,000대의 배터리와
            제동장치를 한 대씩 확인하는 일은 표결 몇 번으로 끝나지 않습니다.
            둘째 이유는 전문성입니다. 어떤 흔적이 과열의 신호인지 판단하려면
            검사 장비와 기술 지식이 필요합니다. 셋째 이유는 시간입니다. 새 개조
            방식이 나타날 때마다 조례 전체를 다시 만들면 대응이 늦습니다.
          </p>
          <p className="leading-7">
            그래서 의회는 목표·권한·금지선·이의 제기 절차를 정하고, 세부 기준과
            개별 판정은 집행기관에 맡깁니다. 여기서 중요한 질문은 “맡길까?”가
            아니라 “어디까지 맡기고 어떤 조건을 붙일까?”입니다.
          </p>
        </div>

        <AlgorithmBlock
          title="점검 결정을 집행 가능한 일로 바꾸는 첫 장부"
          input={[
            "목표: 배달 차량 1,000대를 20일 안에 점검하고 위험 차량을 먼저 자세히 볼 것",
            "인력: 검사관 10명",
            "속도: 빠른 체크리스트는 1인당 하루 5대 · 정밀 점검은 하루 1대",
          ]}
          steps={[
            {
              code: "쓸 수 있는 시간 → 10명 × 20일 = 200 검사관·일",
              note: "검사관·일은 한 검사관이 하루 일할 수 있는 양입니다. 사람 수와 기간을 같은 단위로 묶습니다.",
            },
            {
              code: "모두 빠르게 보면 → 200 × 5대 = 1,000대",
              note: "대수 목표는 채우지만 드문 결함을 자세히 찾을 시간은 거의 남지 않습니다.",
            },
            {
              code: "모두 자세히 보면 → 200 × 1대 = 200대",
              note: "차량 한 대의 판단은 깊어지지만 800대는 기간 안에 보지 못합니다.",
            },
            {
              code: "집행 과제 → 1,000대 중 어느 차량을 200일의 정밀 점검 시간에 넣을지 정하기",
              note: "결정문이 비워 둔 자리는 위험 신호 기준, 검사 순서와 예외 절차가 채웁니다.",
            },
          ]}
          output="의회는 모든 판정을 직접 하는 대신 목표와 경계를 정하고, 집행기관은 200 검사관·일을 차량별로 배분합니다."
        />

        <CitationBlock
          source="대한민국헌법 제75조·제96조 (한국법제연구원 영문 번역본)"
          citeKey={1}
          href="https://elaw.klri.re.kr/eng_service/lawView.do?hseq=1&lang=ENG"
        >
          제75조는 대통령령을 법률이 구체적으로 범위를 정해 위임한 사항과 법률
          집행에 필요한 사항으로 제한합니다. 제96조는 행정각부의 설치·조직과
          직무범위를 법률로 정하게 합니다. 위임 자체를 없애기보다 범위와 조직에
          조건을 붙이는 구조입니다. 링크의 영문 번역은 참조용이며 법적 효력은
          국문 원문에 있습니다.
        </CitationBlock>
      </section>

      <section id="agency" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          2. 맡기는 순간 목표를 아는 쪽과 현장을 아는 쪽이 갈립니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            의회는 왜 이 점검을 시작했는지와 시민이 감수할 수 있는 위험을
            압니다. 그러나 어느 차량의 배터리 덮개가 수상한지는 모릅니다.
            검사관은 그 흔적을 볼 수 있지만, 도시 전체에서 정밀 점검을 어디까지
            늘릴 때 다른 업무를 포기해도 되는지는 혼자 정할 수 없습니다.
          </p>
          <p className="leading-7">
            이처럼 일을 맡긴 쪽과 맡은 쪽의 정보가 다른 문제를 주인·대리인
            문제라고 부릅니다. 사람의 성품을 의심하는 말이 아닙니다. 의회가 직접
            검사하지 않는 한 현장 정보가 보이지 않고, 검사관이 정책 전체를
            정하지 않는 한 목표의 우선순위를 모두 알 수 없다는 구조를
            가리킵니다.
          </p>
        </div>

        <TermBreakdown
          title="같은 차량 점검에서 갈라지는 두 종류의 정보"
          items={[
            {
              term: "판정 전에는 숨은 정보",
              description:
                "어떤 차량이 위험하고 정밀 점검에 얼마나 오래 걸릴지는 현장을 보기 전에는 의회가 알기 어렵습니다.",
              example:
                "검사관은 배터리 개조 흔적을 보지만, 의회는 보고서에 적힌 위험 등급만 봅니다.",
              boundary:
                "두 번째 검사팀이나 외부 시험기관의 자료와 대조하면 정보 차이를 줄일 수 있습니다.",
            },
            {
              term: "판정 뒤에는 숨은 행동",
              description:
                "검사관이 체크리스트를 실제로 얼마나 꼼꼼히 봤는지는 완료 건수만으로 알 수 없습니다.",
              example:
                "하루 5대를 처리했다는 기록만으로 어려운 결함을 끝까지 추적했는지는 확인할 수 없습니다.",
              boundary:
                "무작위 재검사와 작업 기록은 행동을 더 보이게 하지만 시간과 비용이 듭니다.",
            },
            {
              term: "결과에도 운이 섞임",
              description:
                "사고가 없었다고 점검이 완벽했다거나 사고가 났다고 점검이 부실했다고 바로 말할 수 없습니다.",
              example:
                "같은 결함도 운행 거리와 날씨에 따라 사고로 이어질 수도, 이어지지 않을 수도 있습니다.",
              boundary:
                "그래서 사고 건수만 보지 않고 판정 근거와 표본 재검사를 함께 봐야 합니다.",
            },
          ]}
        />
      </section>

      <section id="rules-or-discretion" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          3. 체크리스트는 같은 답을 만들지만 목록 밖 결함은 놓칠 수 있습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            정보 차이를 줄이는 가장 쉬운 방법은 검사 순서를 미리 적는 것입니다.
            배터리 온도, 배선 손상, 제동거리처럼 확인할 항목과 불합격선을 정하면
            누가 검사해도 비슷한 답이 나오고, 차량 소유자도 이의를 제기할 근거를
            얻습니다.
          </p>
          <p className="leading-7">
            하지만 새 방식으로 개조한 차량이 목록의 모든 수치를 통과하면서도
            위험한 흔적을 보일 수 있습니다. 검사관이 목록 밖을 볼 수 없으면 그
            차량은 통과합니다. 반대로 “수상하면 더 보라”는 재량을 넓히면 새로운
            위험을 잡을 수 있지만, 검사관마다 판단이 달라지고 편견이 끼어들
            여지도 커집니다.
          </p>
        </div>

        <AlgorithmBlock
          title="체크리스트와 현장 판단의 경계를 정하는 절차"
          input={[
            "미리 목록으로 만들 수 있는 결함",
            "목록 밖 결함을 발견했을 때 생길 수 있는 피해",
            "현장 판단의 근거를 나중에 확인할 수 있는지",
          ]}
          steps={[
            {
              code: "반복되는 결함과 명확한 수치는 체크리스트에 넣는다.",
              note: "배선 손상처럼 같은 방법으로 확인할 수 있는 항목은 규칙이 빠르고 공평합니다.",
            },
            {
              code: "목록 밖 징후를 발견하면 정밀 점검으로 넘길 수 있게 한다.",
              note: "예외 통로가 없으면 새 결함을 알아차려도 통과시킬 수밖에 없습니다.",
            },
            {
              code: "정밀 점검으로 넘긴 이유를 사진·측정값·문장으로 남긴다.",
              note: "재량에는 설명 의무를 붙여야 다른 검사관과 사후 검토자가 판단을 다시 볼 수 있습니다.",
            },
            {
              code: "무작위 표본을 다시 검사해 규칙과 재량의 오판을 따로 센다.",
              note: "통과 오류와 과잉 검사 오류를 분리해야 어느 쪽의 경계를 옮길지 알 수 있습니다.",
            },
          ]}
          output="반복되는 항목은 규칙으로 고정하고, 새로운 위험에는 기록 가능한 재량과 재검사를 붙입니다."
        />

        <div id="street-level" className="scroll-mt-20">
          <h3 className="mb-4 mt-12 text-xl font-bold">
            마지막 검사관이 200일의 정밀 점검 시간을 누구에게 쓸지 정합니다
          </h3>
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p className="leading-7">
              모든 차량을 자세히 볼 수 없으므로 누군가는 먼저 볼 차량을 골라야
              합니다. 신고 이력, 개조 흔적, 운행 거리 같은 신호로 순서를 정하는
              순간, 검사관의 처리 요령이 실제 정책의 일부가 됩니다.
            </p>
            <p className="leading-7">
              이것을 일선의 재량이라고 부릅니다. 규칙을 어긴다는 뜻이 아닙니다.
              규칙이 1,000대의 순서를 완전히 정하지 못하고 정밀 점검 시간도
              200일뿐이어서, 비어 있는 순서를 현장 사람이 채운다는 뜻입니다.
            </p>
          </div>

          <CitationBlock
            source="Michael Lipsky · Street-Level Bureaucracy (1980; 30주년판 2010)"
            citeKey={2}
            href="https://www.russellsage.org/publications/book/street-level-bureaucracy"
          >
            일선 공공서비스 종사자가 큰 사건 수, 모호한 목표, 부족한 자원과
            상당한 재량 아래에서 일하며, 자원 배분·선별·일상화 방식으로 실제
            정책을 만든다는 연구입니다. 이 글의 차량 1,000대와 200 검사관·일은
            그 책의 실측값이 아니라 같은 구조를 보여 주는 가상 사례입니다.
          </CitationBlock>
        </div>
      </section>

      <section id="measurement" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          4. 완료 건수에만 보상하면 정밀 조사는 줄어들 수 있습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            집행기관은 보이지 않는 행동을 관리하려고 숫자를 만듭니다. 이
            사례에서 가장 쉬운 숫자는 완료한 차량 수입니다. 하지만 빠른
            체크리스트와 어려운 결함 추적은 같은 검사관의 시간을 두고 다툽니다.
            완료 건수에만 성과급을 걸면 관리 화면의 숫자는 좋아져도 정밀 조사는
            밀릴 수 있습니다.
          </p>
          <p className="leading-7">
            아래 식은 그 방향을 따라가기 위한 설명용 모형입니다. 빠른 점검
            노력은 e₁, 정밀 조사 노력은 e₂입니다. β는 완료 건수에 건 보상, μ는
            정밀 조사를 계속하게 하는 직업의식, γ는 두 일이 같은 시간을 두고
            다투는 정도입니다.
          </p>
        </div>

        <ExplainedFormula
          question="완료 건수에 건 보상 β를 올리면 정밀 조사 노력 e₂는 왜 줄어들까요?"
          idea="검사관은 두 노력에서 얻는 보상과 보람을 더하고, 노력 자체의 피로와 두 일이 서로 시간을 빼앗는 비용을 뺀다고 둡니다. 각 노력을 조금 늘렸을 때 추가 이득과 추가 비용이 같아지는 두 식을 만든 뒤 함께 풉니다."
          formula={String.raw`e_1^{*}=\frac{\beta-\gamma\mu}{1-\gamma^2},\qquad e_2^{*}=\frac{\mu-\gamma\beta}{1-\gamma^2},\qquad \frac{\partial e_2^{*}}{\partial\beta}=-\frac{\gamma}{1-\gamma^2}<0`}
          annotatedFormula={String.raw`\underbrace{e_1^{*}}_{\text{빠른 점검 노력}}=\frac{\beta-\gamma\mu}{1-\gamma^2},\qquad \underbrace{e_2^{*}}_{\text{정밀 조사 노력}}=\frac{\mu-\gamma\beta}{1-\gamma^2},\qquad \underbrace{\frac{\partial e_2^{*}}{\partial\beta}}_{\text{완료 보상을 올릴 때 정밀 조사의 변화}}=-\frac{\gamma}{1-\gamma^2}<0`}
          operations={[
            {
              expression: String.raw`U=\beta e_1+\mu e_2-\frac12(e_1^2+e_2^2+2\gamma e_1e_2)`,
              annotation: [
                "앞의 두 항은 빠른 점검 보상과 정밀 조사에서 느끼는 보람입니다. 괄호 안은 노력의 피로이며 γe₁e₂는 두 일이 서로 시간을 빼앗는 비용입니다.",
                "0≤γ<1로 두면 비용이 지나치게 뒤틀리지 않고 두 노력의 멈춤점을 구할 수 있습니다.",
              ],
            },
            {
              expression: String.raw`\beta=e_1+\gamma e_2,\qquad \mu=e_2+\gamma e_1`,
              annotation: [
                "각 노력을 아주 조금 늘렸을 때 얻는 값과 추가 피로가 같아지는 두 조건입니다.",
                "첫 식은 빠른 점검, 둘째 식은 정밀 조사의 멈춤점을 나타냅니다.",
              ],
            },
            {
              expression: String.raw`e_1=\beta-\gamma e_2\quad\Longrightarrow\quad \mu=e_2+\gamma(\beta-\gamma e_2)`,
              annotation: [
                "첫 식에서 e₁을 정리해 둘째 식에 넣습니다. 이제 정밀 조사 노력 e₂ 하나만 남습니다.",
                "괄호를 풀면 μ=γβ+(1−γ²)e₂입니다.",
              ],
            },
            {
              expression: String.raw`e_2^{*}=\frac{\mu-\gamma\beta}{1-\gamma^2}`,
              annotation: [
                "γ와 μ가 고정돼 있을 때 β가 커지면 분자 μ−γβ가 작아집니다. 그래서 완료 건수 보상을 올릴수록 정밀 조사 노력이 줄어듭니다.",
                "노력은 음수가 될 수 없으므로 식이 0 아래로 내려가면 실제 선택은 e₂=0인 모서리에 멈춥니다.",
              ],
            },
            {
              expression: String.raw`\gamma=0.5,\ \mu=10,\ \beta=15\quad\Longrightarrow\quad e_1^{*}=13.33,\ e_2^{*}=3.33`,
              annotation: [
                "빠른 점검은 (15−5)÷0.75=13.33, 정밀 조사는 (10−7.5)÷0.75=3.33입니다.",
                "β=5일 때의 0과 10에서 빠른 점검 쪽으로 노력이 크게 옮겨갔습니다.",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`e_1`,
              name: "빠른 점검 노력",
              description:
                "완료 건수로 쉽게 셀 수 있는 체크리스트 업무에 쓰는 노력입니다.",
            },
            {
              symbol: String.raw`e_2`,
              name: "정밀 조사 노력",
              description:
                "드문 결함을 추적하는 데 쓰지만 단순 완료 건수로는 잘 보이지 않는 노력입니다.",
            },
            {
              symbol: String.raw`\beta`,
              name: "완료 건수 보상",
              description:
                "빠른 점검 노력을 한 단위 늘릴 때 받는 설명용 보상입니다.",
            },
            {
              symbol: String.raw`\mu`,
              name: "직업의식",
              description:
                "외부 보상이 없어도 정밀 조사를 계속하게 하는 설명용 내적 동기입니다.",
            },
            {
              symbol: String.raw`\gamma`,
              name: "두 일이 다투는 정도",
              description:
                "0이면 서로 시간을 빼앗지 않고, 1에 가까울수록 한 일을 할 때 다른 일을 하기 어렵습니다.",
            },
          ]}
          assumptions={[
            "두 노력의 피로가 이차식으로 늘고 검사관들이 같은 방식으로 반응한다고 단순화합니다.",
            "직업의식 μ가 보상 β와 무관하게 고정되어 있다고 둡니다.",
            "정밀 조사의 질을 완료 건수로 직접 보상할 수 없고 두 일이 같은 시간을 두고 다툰다고 둡니다.",
          ]}
          interpretation="γ=0.5, μ=10일 때 β가 5·10·15·20으로 늘면 (빠른 점검, 정밀 조사)는 (0,10)·(6.67,6.67)·(13.33,3.33)·(20,0)이 됩니다. 정밀 조사의 단위 가치가 빠른 점검보다 세 배라고 두면 전체 설명용 가치는 30→26.67→23.33→20으로 줄어듭니다. 이는 실제 검사관의 생산성 측정값이 아니며 성과급이 언제나 해롭다는 뜻도 아닙니다. γ=0처럼 두 일이 시간을 다투지 않거나 정밀 조사의 가치가 작으면 같은 결론이 나오지 않습니다."
        />

        <MeasurementDistortionViz />

        <CitationBlock
          source="Bengt Holmström · Paul Milgrom · Multitask Principal–Agent Analyses (1991, 24~52쪽)"
          citeKey={3}
          href="https://doi.org/10.1093/jleo/7.special_issue.24"
        >
          한 사람이 여러 일을 맡을 때 한 과업의 강한 보상이 측정하기 어려운 다른
          과업에서 주의를 빼 올 수 있고, 그래서 고정급이나 약한 유인이 더 나을
          수 있음을 보인 이론 논문입니다. 위 식은 논문의 식을 그대로 옮긴 것이
          아니라 같은 방향을 차량 점검 사례에서 따라가기 위해 이 글이 단순화한
          모형입니다.
        </CitationBlock>

        <ProgressiveDetail
          title="그러면 완료 건수를 재지 말아야 할까요?"
          preview="숫자를 없애면 빠른 점검도 보이지 않습니다. 한 숫자가 전체 목표를 대신하지 못하게 해야 합니다."
        >
          <p className="leading-7">
            완료 건수는 기간 안에 차량을 얼마나 봤는지 알려 주는 필요한
            숫자입니다. 문제는 이 숫자 하나를 안전 전체와 같다고 보는 데
            있습니다. 무작위 재검사의 오류율, 위험 차량의 정밀 조사 비율, 판정이
            뒤집힌 이유를 함께 보면 다른 노력이 완전히 숨지는 않습니다.
          </p>
          <p className="leading-7">
            또는 빠른 선별팀과 정밀 조사팀을 나눌 수 있습니다. 같은 사람이 두
            일을 두고 매번 선택하지 않으면 γ가 작아져 완료 보상이 정밀 조사를
            밀어내는 힘도 약해집니다. 다만 팀 사이의 인계 오류라는 새 비용이
            생깁니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="control" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          5. 통제는 차이를 없애는 일이 아니라 어디에서 다시 볼지 정하는 일입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            이 사례에서 쓸 수 있는 통제는 네 가지입니다. 먼저 점검 항목·이해충돌
            금지·기록 형식을 미리 정할 수 있습니다. 다음으로 통과 차량을
            무작위로 다시 검사할 수 있습니다. 서로 다른 검사팀의 판정을 비교할
            수도 있고, 익명 처리한 판정 근거와 오류율을 밖에 공개할 수도
            있습니다.
          </p>
          <p className="leading-7">
            네 방법에는 각각 값이 붙습니다. 미리 정한 절차는 새 결함에 느리고,
            재검사는 검사관·일을 더 쓰며, 복수 팀은 업무가 겹치고, 공개 자료는
            그것을 읽고 문제를 제기할 조직이 있는 쪽에서 더 잘 활용합니다. 모든
            비용을 없애는 통제 수단은 없습니다.
          </p>
        </div>

        <TermBreakdown
          title="같은 차량 점검에 붙일 수 있는 네 통제"
          items={[
            {
              term: "미리 조건 걸기",
              description:
                "체크리스트, 기록 형식과 이해충돌 금지를 점검 전에 정합니다.",
              example:
                "모든 정밀 점검 전환에는 사진 한 장과 측정값을 남기게 합니다.",
              boundary:
                "목록 밖 결함에는 늦게 대응하고 서류 작성 시간이 늘어납니다.",
            },
            {
              term: "뒤에 다시 보기",
              description:
                "통과·불합격 표본을 다시 검사해 첫 판정의 오류를 확인합니다.",
              example: "매주 통과 차량 일부를 다른 검사관이 다시 봅니다.",
              boundary:
                "정확하지만 같은 차량을 두 번 보므로 처리 용량을 씁니다.",
            },
            {
              term: "여럿의 답 견주기",
              description:
                "팀이나 외부 시험기관의 판정을 비교해 한 기관만 가진 정보를 확인합니다.",
              example:
                "새 배터리 개조 방식은 두 팀이 독립적으로 위험도를 매깁니다.",
              boundary: "업무 중복과 판정 충돌을 조정하는 비용이 생깁니다.",
            },
            {
              term: "밖에서 보이게 하기",
              description:
                "판정 기준·오류율·이의 제기 결과를 공개해 외부 검토를 엽니다.",
              example:
                "차량 식별정보를 가린 뒤 위험 신호별 판정 변경률을 공개합니다.",
              boundary:
                "자료를 읽고 의견을 낼 시간과 조직이 있는 집단이 더 큰 영향력을 가질 수 있습니다.",
            },
          ]}
        />

        <CitationBlock
          source="McCubbins · Noll · Weingast · Administrative Procedures as Instruments of Political Control (1987, 243~277쪽)"
          citeKey={4}
          href="https://doi.org/10.1093/oxfordjournals.jleo.a036930"
        >
          선출된 행위자가 모든 행정 결정을 직접 감시할 수 없을 때, 절차가 누가
          참여하고 어떤 정보와 입증 책임이 결정에 들어오는지를 바꿔 행정기관을
          통제할 수 있다는 이론을 제시합니다. 미국 의회를 중심으로 한 이론이므로
          모든 나라에서 같은 제도가 같은 효과를 낸다는 실증 결론으로 읽으면 안
          됩니다.
        </CitationBlock>
      </section>

      <section id="boundary" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          6. 집행 실패는 “누가 게을렀나?”보다 “어느 선택이 결과를 바꿨나?”로
          봐야 합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            처음 결정은 1,000대를 점검하고 위험 차량을 먼저 보라는 두 목표를
            담았습니다. 200 검사관·일의 한계, 빠른 점검과 정밀 조사의 속도 차이,
            체크리스트 밖 예외, 완료 건수 보상이 차례로 들어오면서 실제 점검
            방식이 정해졌습니다. 결정과 결과의 차이는 이 선택들이 쌓인 값입니다.
          </p>
          <p className="leading-7">
            따라서 문제가 생기면 먼저 어느 단계가 달라졌는지 묻습니다. 위험 신호
            기준이 잘못됐는지, 검사 순서에 편향이 있었는지, 완료 건수 보상이
            정밀 조사를 밀어냈는지, 재검사에서 같은 오류가 반복됐는지를 나눠
            봐야 실제로 고칠 곳이 보입니다.
          </p>
          <p className="leading-7">
            이 글은 최종 집행자가 있는 한 도시 안의 문제를 다뤘습니다. 국가들
            사이에는 판정을 강제로 집행할 한 단계 위의 자리가 없습니다. 그때
            약속과 통제가 어떻게 달라지는지는{" "}
            <Link to="/politics/governance/international-anarchy">
              국제 무정부
            </Link>
            에서 이어집니다.
          </p>
        </div>

        <ReviewPrompts
          questions={[
            "검사관 10명이 20일 동안 일하면 왜 정밀 점검 1,000대를 끝낼 수 없을까요? (답: 1절)",
            "체크리스트를 더 자세히 만들면 현장 재량을 완전히 없앨 수 있을까요? (답: 3절)",
            "완료 건수가 늘었는데도 전체 안전 가치가 줄 수 있는 조건은 무엇일까요? (답: 4절)",
          ]}
        />
      </section>
    </div>
  );
}

import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import AgreementDecisionViz from "./international-anarchy/viz/AgreementDecisionViz";
import AnarchyStructureViz from "./international-anarchy/viz/AnarchyStructureViz";
import RatificationOverlapViz from "./international-anarchy/viz/RatificationOverlapViz";
import ShadowOfFutureViz from "./international-anarchy/viz/ShadowOfFutureViz";

/**
 * 해협을 마주 본 두 나라의 순찰선 합의를 끝까지 추적한다. 위가 없다는 말에서
 * 시작해 안보 딜레마, 반복 협력, 국제 제도, 상대적 이득과 국내 비준까지 간다.
 */
export default function InternationalAnarchyArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          약속을 강제로 지키게 할 곳이 없어도 협력은 가능할까요?
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            해협을 마주 본 A국과 B국이 매년 순찰선 수를 제한한다고
            가정하겠습니다. 둘 다 제한을 지키면 충돌 위험과 군비를 줄여 각각
            3의 이익을 얻습니다. 한 나라만 몰래 순찰선을 늘리면 그 나라는 5를
            얻지만, 둘 다 늘리면 비용과 긴장이 커져 각각 1만 남습니다. 이 숫자는
            원리를 연결하기 위한 가상 값입니다.
          </p>

          <p className="leading-7">
            국내 계약이라면 분쟁을 법원이 판정하고 국가가 집행합니다. 그러나 두
            국가 위에는 같은 방식으로 최종 판정하고 강제로 집행할 정부가 없습니다.
            그렇다고 모든 조약이 곧바로 무너지지는 않습니다. 두 나라는 다음
            해에도 같은 해협에서 만나기 때문입니다.
          </p>

          <p className="leading-7">
            답은 한 문장으로 정리됩니다. <strong>위반을 알아챌 수 있고, 위반에
            대응할 수 있으며, 앞으로의 협력 가치가 한 번의 배신 이익보다 크면
            위에서 강제하지 않아도 약속은 스스로 설 수 있습니다.</strong> 국제
            제도는 세계 정부가 되는 대신 이 세 조건을 바꿉니다.
          </p>
        </div>

        <AnarchyStructureViz />
        <ContentBoundary article="international-anarchy" />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            이 답은 세 가지 꼬리 질문을 만듭니다. 방어하려고 늘린 순찰선이 왜
            오히려 양쪽을 불안하게 만들까요? <strong>(답: 2절)</strong> 미래가
            얼마나 중요해야 약속을 지키는 편이 유리할까요? <strong>(답: 3절)</strong>
            강제력이 없는 국제기구는 정확히 무엇을 바꿀까요? <strong>(답: 4절)</strong>
          </p>
          <p className="leading-7">
            마지막에는 계산만으로 해결되지 않는 두 문제도 봅니다. 한쪽이 더 많이
            얻으면 그 차이가 미래의 힘이 될 수 있고, 국가끼리 합의해도 각 나라의
            의회가 받아들이지 않으면 발효되지 않습니다. 처음부터 끝까지 같은
            해협 합의를 따라가므로 개념 이름보다 먼저 실제 선택이 보일 것입니다.
          </p>
        </div>
      </section>

      <section id="no-sovereign" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          1. 국제 무정부는 무질서가 아니라 최종 집행자가 없다는 뜻입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            A국이 “B국이 순찰선 제한을 어겼다”고 주장해도, 양국 위에서 사실을
            조사하고 판결을 강제로 따르게 할 정부는 없습니다. 국제재판과 중재가
            있어도 당사국이 관할과 절차를 받아들이는 범위가 중요합니다. 판정이
            아예 없다는 말이 아니라, 국내 법원처럼 언제나 마지막 말이 되는 자리가
            없다는 뜻입니다.
          </p>

          <p className="leading-7">
            그래서 A국은 최악의 경우 자기 힘으로 안전을 지켜야 합니다. 지금 B국에
            공격 의도가 없더라도 다음 정부가 같은 생각을 유지하리라는 보장은
            없습니다. A국은 그 가능성까지 계산해 순찰선과 감시 장비를 준비합니다.
            최후에 기댈 곳이 자신뿐인 이 상태를 <strong>자력구제</strong>라고
            부릅니다.
          </p>

          <p className="leading-7">
            여기서 이름의 순서를 거꾸로 이해하면 안 됩니다. ‘국제 무정부’라서
            늘 전쟁이 벌어진다는 뜻이 아닙니다. 먼저 최종 집행자가 없고, 그래서
            각국이 최악의 경우를 스스로 대비해야 하며, 그 대비가 평시 선택까지
            바꾼다는 구조가 있습니다. 그 구조에 붙인 이름이 국제 무정부와
            자력구제입니다.
          </p>
        </div>

        <TermBreakdown
          title="같은 순찰선 합의에서 없어지는 것과 남는 것"
          items={[
            {
              term: "없는 것 · 자동으로 최종이 되는 판정",
              description:
                "양국이 사실과 조문을 다르게 해석할 때 어느 한쪽의 동의 없이도 다툼을 끝낼 상위 정부가 없습니다.",
              example:
                "감시선이 순찰선 수에 포함되는지를 두 나라가 다르게 읽으면 해석 다툼부터 시작됩니다.",
              boundary:
                "재판·중재·조사기구가 없다는 뜻은 아닙니다. 그 권한과 집행 경로가 당사국의 동의와 대응에 기대는 점이 다릅니다.",
            },
            {
              term: "없는 것 · 대신 해 주는 집행",
              description:
                "B국이 합의를 어겼을 때 A국 대신 벌금을 걷거나 순찰선을 압류할 세계 경찰은 없습니다.",
              example:
                "A국이 검증 중단, 항만 협력 정지, 자체 순찰 강화 같은 대응을 직접 선택해야 합니다.",
              boundary:
                "집행자가 없다고 대응 수단까지 없는 것은 아닙니다. 대응이 믿을 만한지가 협력의 조건이 됩니다.",
            },
            {
              term: "남는 것 · 자기 힘으로 하는 대비",
              description:
                "상대의 현재 의도뿐 아니라 능력과 미래 변화까지 보며 스스로 안전 수단을 갖춥니다.",
              example:
                "A국은 B국이 합의를 지켜도 감시 장비와 최소 순찰 전력은 남겨 둡니다.",
              boundary:
                "항상 공격적으로 행동한다는 뜻이 아니라, 마지막 안전장치를 남에게 완전히 맡길 수 없다는 뜻입니다.",
            },
          ]}
        />
      </section>

      <section id="security-dilemma" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          2. 방어용 순찰선도 상대 눈에는 공격 수단으로 보입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            A국이 밀수와 해적을 막겠다며 순찰선 두 척을 더 띄웁니다. A국에는
            방어이지만 B국에는 항로를 막을 능력이 커진 일로 보입니다. B국도 두
            척을 늘립니다. 이제 양국은 이전보다 돈을 더 쓰면서도 상대 전력이
            커졌으므로 더 불안합니다.
          </p>

          <p className="leading-7">
            이 결과에는 악의가 필요하지 않습니다. 문제는 의도를 직접 볼 수 없고,
            오늘의 방어 장비가 내일 공격에 쓰이지 않으리라고 보장할 수도 없다는
            데 있습니다. 자신을 지키는 수단이 상대를 위협하는 수단과 겹칠수록
            서로의 합리적인 대비가 양쪽을 덜 안전하게 만듭니다. 이것이
            <strong> 안보 딜레마</strong>입니다.
          </p>

          <p className="leading-7">
            반대로 방어와 공격을 눈으로 구별할 수 있으면 딜레마는 약해집니다.
            예를 들어 먼바다 공격에는 쓸 수 없고 해협 구조 활동에만 맞는 장비라면
            상대가 느끼는 위협이 작습니다. 장비의 이름이 ‘방어용’인지보다 실제
            능력과 배치가 무엇을 가능하게 하는지가 중요합니다.
          </p>
        </div>

        <CitationBlock
          source="Robert Jervis · Cooperation Under the Security Dilemma (World Politics 30권 2호, 1978년, 167~214쪽)"
          citeKey={1}
          href="https://www.cambridge.org/core/journals/world-politics/article/abs/cooperation-under-the-security-dilemma/C8907431CCEFEFE762BFCA32F091C526"
        >
          Jervis는 한 국가의 안전을 높이는 정책이 다른 국가의 안전을 낮추는
          구조를 안보 딜레마로 정리했습니다. 착취의 이득과 당했을 때의 비용이
          작고, 상호 협력의 이득과 상호 비협력의 비용이 클수록 협력이 쉬워진다고
          설명합니다. 또 방어가 공격보다 유리하고 둘을 구별하기 쉬울수록 딜레마가
          약해진다고 봅니다. 해협과 순찰선, 아래 수치는 이 글의 가상 사례이며
          논문에 실린 실증 결과가 아닙니다.
        </CitationBlock>
      </section>

      <section id="shadow" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          3. 다음 해의 가치가 0.5보다 크면 제한을 지키는 편이 유리합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            한 번만 만난다면 B국은 몰래 순찰선을 늘려 3 대신 5를 얻을 수 있습니다.
            하지만 발각된 뒤 A국도 늘리면 다음 해부터 둘 다 1만 얻습니다. 매년
            같은 선택이 반복되면 이번의 추가 이익 2와 앞으로 잃을 협력 이익을
            비교해야 합니다.
          </p>

          <p className="leading-7">
            앞으로의 1을 오늘 얼마로 보는지를 <strong>δ(델타)</strong>라고
            쓰겠습니다. δ에는 시간이 지나며 가치가 줄어드는 정도와 다음 해에도
            관계가 이어질 가능성이 함께 들어갑니다. 이 글에서는 직관을 위해
            ‘다음 만남의 가치’라고 읽습니다. 계산 이름은 나중에 붙이고, 먼저 두
            선택의 장부를 나란히 보겠습니다.
          </p>
        </div>

        <ExplainedFormula
          question="순찰선 제한을 계속 지키는 값이 한 번 어기는 값보다 커지는 때는 언제인가?"
          idea="계속 지키면 매년 3을 받습니다. 한 번 어기면 올해 5를 받고, 발각된 다음 해부터는 양쪽이 늘려 매년 1만 받습니다. 미래 값을 δ만큼씩 줄여 더한 두 장부가 같아지는 지점이 협력의 문턱입니다."
          formula={"\\frac{R}{1-\\delta} \\;\\ge\\; T + \\frac{\\delta P}{1-\\delta} \\quad\\Longleftrightarrow\\quad \\delta \\;\\ge\\; \\frac{T-R}{T-P}"}
          annotatedFormula={"\\underbrace{\\frac{R}{1-\\delta}}_{\\text{매년 제한을 지킬 때}} \\;\\ge\\; \\underbrace{T + \\frac{\\delta P}{1-\\delta}}_{\\text{올해 어기고 이후 경쟁할 때}} \\quad\\Longleftrightarrow\\quad \\underbrace{\\delta}_{\\text{다음 만남의 가치}} \\;\\ge\\; \\underbrace{\\frac{T-R}{T-P}}_{\\text{협력이 필요한 문턱}}"}
          operations={[
            {
              expression: "\\frac{R}{1-\\delta}=R+\\delta R+\\delta^2R+\\cdots",
              annotation: [
                "R은 둘 다 제한을 지킬 때 매년 얻는 값입니다. 해협 사례에서는 R=3입니다.",
                "3을 올해 받고, 다음 해 3은 δ배, 그다음 해 3은 δ²배로 줄여 더합니다.",
              ],
            },
            {
              expression: "T+\\frac{\\delta P}{1-\\delta}=T+\\delta P+\\delta^2P+\\cdots",
              annotation: [
                "T는 혼자 어긴 첫해의 값 5이고, P는 이후 양쪽이 늘렸을 때 매년 받는 값 1입니다.",
                "첫해 5는 바로 받으므로 줄이지 않고, 다음 해부터 받는 1만 δ배씩 줄입니다.",
              ],
            },
            {
              expression: "\\delta^{*}=\\frac{T-R}{T-P}=\\frac{5-3}{5-1}=0.5",
              annotation: [
                "분자 5−3=2는 이번에 혼자 어겨 더 얻는 값입니다.",
                "분모 5−1=4는 어긴 뒤 경쟁 상태로 가면서 잃는 폭입니다. 2÷4=0.5가 경계입니다.",
              ],
            },
          ]}
          terms={[
            {
              symbol: "R=3",
              name: "둘 다 제한을 지킬 때의 연간 값",
              description:
                "충돌 위험과 군비를 함께 줄여 각 나라가 얻는 가상 이익입니다.",
            },
            {
              symbol: "T=5,\\;P=1",
              name: "혼자 어긴 첫해의 값 · 이후 경쟁할 때의 연간 값",
              description:
                "T는 기습적 우위를 얻은 해의 값이고, P는 양쪽이 대응한 뒤 남는 값입니다.",
            },
            {
              symbol: "\\delta",
              name: "다음 만남의 가치",
              description:
                "0에 가까우면 다음 해를 거의 보지 않고, 1에 가까우면 먼 미래까지 크게 봅니다.",
            },
          ]}
          assumptions={[
            "위반을 알아챌 수 있고, 발각되면 상대도 순찰선을 늘릴 수 있다고 둡니다.",
            "한 번 위반한 뒤에는 양쪽이 계속 경쟁해 매년 1을 얻는 단순한 대응을 가정합니다.",
            "관계가 언제 끝나는지 미리 정해져 있지 않다고 둡니다. 마지막 해가 확정되면 마지막 해부터 거꾸로 협력이 무너질 수 있습니다.",
          ]}
          interpretation="δ=0.3이면 계속 지키는 값은 3÷0.7=4.29이고, 한 번 어기는 값은 5+0.3÷0.7=5.43입니다. 어기는 편이 큽니다. δ=0.8이면 각각 3÷0.2=15와 5+0.8÷0.2=9이므로 지키는 편이 큽니다. 결론은 ‘자주 만나면 언제나 협력한다’가 아닙니다. 위반을 볼 수 없거나 대응할 수 없으면 이 비교 자체가 작동하지 않으며, 배신으로 얻는 T가 커지면 필요한 문턱도 올라갑니다."
        />

        <ShadowOfFutureViz />
      </section>

      <section id="institutions" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          4. 국제 제도는 처벌자가 아니라 계산을 바꾸는 장치입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            앞의 계산은 위반을 발견할 수 있고, 대응할 수 있으며, 다음 만남이
            중요하다는 세 조건을 몰래 빌렸습니다. 국제 제도는 이 조건을 문서와
            절차로 만듭니다. 공동 위치 기록은 몰래 늘린 순찰선을 보이게 하고,
            정기 점검은 다음 만남을 확실하게 하며, 항만·어업 협력을 함께 묶으면
            위반으로 잃을 것이 커집니다.
          </p>

          <p className="leading-7">
            이때 조사기구가 직접 순찰선을 압류하지 않아도 효과가 생깁니다. 위반
            사실을 함께 확인하면 대응이 잘못된 정보에서 출발할 위험이 줄고,
            무엇을 멈출지 미리 정하면 대응 의지도 믿기 쉬워집니다. 국제 제도는
            세계 정부의 작은 복사본이라기보다 국가들이 서로의 선택을 예측하게
            하는 계산 장치에 가깝습니다.
          </p>
        </div>

        <AgreementDecisionViz />

        <CitationBlock
          source="Robert Axelrod·Robert O. Keohane · Achieving Cooperation under Anarchy: Strategies and Institutions (World Politics 38권 1호, 1985년, 226~254쪽)"
          citeKey={2}
          href="https://www.cambridge.org/core/journals/world-politics/article/abs/achieving-cooperation-under-anarchy-strategies-and-institutions/706B24B2FB4525D661BEB5E954D6DC49"
        >
          Axelrod와 Keohane은 협력을 설명하는 핵심 조건으로 이해관계의 상호성,
          미래의 그림자, 참여자 수를 들고, 실제 결과는 인식·전략·사안 연계와
          제도에 따라 달라진다고 설명합니다. 행위자들이 제도와 규범을 만들어
          상호작용의 맥락 자체를 바꾼다는 점도 강조합니다. 본문의 네 단계 판정
          화면은 이 논문의 알고리즘이 아니라, 그 논점을 해협 사례에 적용해 만든
          학습용 절차입니다.
        </CitationBlock>
      </section>

      <section id="limits" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          5. 둘 다 이익이어도 누가 더 얻는지와 국내 비준이 남습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            순찰선 합의에 항만 공동 사용을 붙여 A국은 4, B국은 8의 추가 이익을
            얻는다고 가정하겠습니다. A국도 분명 이익이지만, B국의 추가 이익 4가
            나중에 더 큰 해군력으로 바뀔 수 있다고 믿는다면 A국은 합의를
            망설입니다. 자기 몫만 보는 대신 상대와의 격차까지 보는 판단을
            <strong> 상대적 이득</strong> 고려라고 부릅니다.
          </p>

          <p className="leading-7">
            그러나 상대가 더 얻는 모든 거래가 안보 문제가 되는 것은 아닙니다.
            그 차이가 미래의 강압 능력으로 바뀔 수 있고 상대를 잠재적 위협으로
            볼 때 특히 중요합니다. 동맹 관계이거나 이익 차이가 군사력으로 바뀌기
            어렵다면 이 고려는 약해질 수 있습니다.
          </p>
        </div>

        <CitationBlock
          source="Joseph M. Grieco · Anarchy and the Limits of Cooperation (International Organization 42권 3호, 1988년, 485~507쪽)"
          citeKey={3}
          href="https://doi.org/10.1017/S0020818300027715"
        >
          Grieco는 국가가 협력의 절대 이익뿐 아니라 상대가 더 얻는 몫을 걱정할 수
          있어, 부정행위 감시만으로 협력의 한계가 모두 사라지지 않는다고
          비판했습니다. 본문의 4와 8은 이 차이를 눈에 보이게 만든 가상 수치이며,
          어느 실제 합의의 측정값이 아닙니다. 상대적 이득 주장은 이후 반론과
          조건부 해석이 이어진 이론 논쟁이라는 점도 함께 읽어야 합니다.
        </CitationBlock>

        <ProgressiveDetail
          title="두 나라가 합의했는데 왜 국내 의회 때문에 다시 협상해야 할까요?"
          preview="국제 협상에서 가능한 숫자와 국내에서 통과 가능한 숫자가 겹쳐야 실제 합의가 됩니다."
        >
          <RatificationOverlapViz />
          <p className="leading-7">
            순찰선 상한을 두고 A국 의회는 2~4척만 받아들이고, B국의 연립정부는
            3~5척만 받아들인다고 가정하겠습니다. 국제 협상에서 합의할 수 있는
            숫자는 3~4척뿐입니다. 2척은 B국 국내에서, 5척은 A국 국내에서
            부결됩니다. 이 범위 역시 설명용 가상 값입니다.
          </p>
          <p className="leading-7">
            협상 대표는 바깥에서 상대국과 협상하면서 동시에 안에서 비준을 얻어야
            합니다. 그래서 <strong>두 수준 게임</strong>이라고 부릅니다. A국
            대표가 “4척을 넘으면 의회가 부결한다”는 말을 믿게 만들면 B국은 4척
            아래로 움직여야 합니다. 손이 묶인 사실이 협상력이 될 수 있는
            이유입니다.
          </p>
          <p className="leading-7">
            다만 국내 범위가 좁을수록 언제나 유리한 것은 아닙니다. A국이 2척만,
            B국이 5척만 받아들인다면 겹치는 구간이 없어 합의 자체가 불가능합니다.
            좁은 비준 범위는 상대의 양보를 끌어낼 수도 있지만, 서로 맞닿지 않으면
            협상을 끝내 버립니다.
          </p>
        </ProgressiveDetail>

        <CitationBlock
          source="Robert D. Putnam · Diplomacy and Domestic Politics: The Logic of Two-Level Games (International Organization 42권 3호, 1988년, 427~460쪽)"
          citeKey={4}
          href="https://www.cambridge.org/core/journals/international-organization/article/abs/diplomacy-and-domestic-politics-the-logic-of-twolevel-games/B2E11FB757C4465C4097015BD421035F"
        >
          Putnam은 국가 지도자가 국제 협상과 국내 비준이라는 두 게임을 동시에
          치른다고 설명합니다. 국내 선호·연합·제도와 협상 전략이 서로 얽히므로
          국가를 하나의 고정된 선호를 가진 행위자로만 보면 중요한 제약을 놓칩니다.
          2~4척과 3~5척의 범위는 논문 사례가 아니라 비준 가능 영역의 겹침을
          보여 주기 위한 가상 예입니다.
        </CitationBlock>
      </section>

      <section id="boundary" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          6. 협력의 핵심은 선의가 아니라 위반 뒤의 계산까지 설계하는 일입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            해협 사례의 흐름을 한 번에 되짚어 보겠습니다. 위에서 집행할 정부가
            없으므로 두 나라는 스스로 대비합니다. 그 대비가 상대에게 위협으로
            보여 군비 경쟁을 만들지만, 매년 다시 만나고 위반을 확인하며 대응할
            수 있다면 미래 손실이 한 번의 이익보다 커져 제한이 유지될 수 있습니다.
          </p>

          <p className="leading-7">
            국제 제도는 이 구조 바깥에서 명령하지 않습니다. 안에서 검증을 붙이고,
            만남을 반복시키고, 대응을 예측 가능하게 하며, 여러 사안을 연결해
            위반의 값을 바꿉니다. 그래도 상대가 더 얻은 몫이 미래의 힘이 되거나
            국내 비준 범위가 겹치지 않으면 합의는 멈출 수 있습니다.
          </p>

          <p className="leading-7">
            따라서 실제 합의를 볼 때 “국제기구가 강한가?”만 물으면 부족합니다.
            위반을 누가 어떻게 확인하는지, 대응이 가능한지, 다음 만남이 얼마나
            중요한지, 이익의 격차가 힘으로 바뀌는지, 각국 국내에서 통과 가능한
            범위가 겹치는지를 차례로 봐야 합니다.
          </p>

          <p className="leading-7">
            이 글은 국가를 중심으로 한 합리적 선택 모형을 설명했습니다. 정체성,
            규범, 역사적 기억이 무엇을 위협이나 이익으로 보게 만드는지는 이
            모형만으로 모두 설명되지 않습니다. 또 가상 수치의 문턱은 실제 조약의
            준수율을 예측한 값이 아닙니다. 실제 분석에는 군사 능력, 국내 정치,
            오판과 정보의 질을 별도로 확인해야 합니다.
          </p>

          <p className="leading-7">
            국내에서 강제가 집합적 선택을 어떻게 바꾸는지 다시 보려면{" "}
            <Link to="/politics/polity/collective-choice-problem">
              집합적 선택 문제
            </Link>
            로 돌아가면 됩니다. 국가 안의 집행이 어떻게 달라지는지는 앞 글{" "}
            <Link to="/politics/governance/bureaucracy-and-implementation">
              관료제와 집행
            </Link>
            에서 이어집니다.
          </p>
        </div>

        <ReviewPrompts
          questions={[
            "공동 위치 기록이 고장 나 위반을 볼 수 없게 되면, δ가 0.8이어도 왜 3절의 협력 계산을 그대로 쓸 수 없을까요? (답: 4절)",
            "A국 4, B국 8의 이익이 생겨도 A국이 합의를 거부할 수 있는 조건은 무엇일까요? (답: 5절)",
            "A국의 비준 범위가 2~4척이고 B국이 3~5척일 때 실제 합의 가능한 상한은 몇 척인가요? (답: 5절)",
          ]}
        />
      </section>
    </div>
  );
}

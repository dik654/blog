import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import PromiseFilterViz from "./contract-and-enforceable-promise/viz/PromiseFilterViz";
import BreachIncentiveViz from "./contract-and-enforceable-promise/viz/BreachIncentiveViz";

/**
 * 어떤 약속을 법이 지켜 줍니까
 *
 * 법이 작동하는 방식 세 글을 마쳤으니, 그 장치가 실제 관계에서 무엇을 정하는지
 * 시작한다. 걸러지는 약속·구제 수단의 선택·배상액이 만드는 유인·계약의
 * 빈칸까지가 범위이고, 모두에게 대항하는 권리는 다음 글이 소유한다.
 */
export default function ContractAndEnforceablePromiseArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          강제할 곳이 있을 때 약속은 어떻게 달라집니까
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            앞 시리즈의 마지막 글에서 강제할 자리가 없을 때 약속이 서는 조건을
            봤습니다. 같은 상대를 계속 만나고, 어긴 것을 알아챌 수 있고, 되갚을
            수 있어야 한다는 것이었습니다.
          </p>

          <p className="leading-7">
            국가 안에서는 그 자리가 있습니다. 그러면 한 번 만나고 끝나는 상대와도 약속이 설 수 있고 되갚을 힘이 없는 쪽도 약속을 받을 수 있습니다. 앞 글의 조건들이 느슨해지는
            것입니다.
          </p>

          <p className="leading-7">
            그런데 그 힘을 아무 약속에나 붙여 주지는 않습니다. 붙여 주는 약속과 그렇지 않은 약속을 가르는 체가 있고 붙여 준 뒤에도 무엇을 물릴지가 또 하나의 선택으로 남습니다.
          </p>
        </div>

        <PromiseFilterViz />

        <ContentBoundary article="contract-and-enforceable-promise" />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            이 글이 푸는 질문은 하나입니다.{" "}
            <strong>
              어떤 약속에 법의 힘이 붙고, 그 약속을 어겼을 때 무엇을 물리며, 그
              선택이 사람들의 행동을 어떻게 바꾸는가
            </strong>
            입니다.
          </p>

          <p className="leading-7">
            순서는 걸러지는 기준, 시키는 것과 물리는 것의 차이, 배상액이 만드는
            유인, 그리고 계약서가 다 적지 못한 빈칸을 무엇이 메우는지입니다.
          </p>

          <p className="leading-7">
            여기서 다루는 힘은 두 사람 사이에만 미칩니다. 세상 누구에게나
            주장할 수 있는 권리는 성격이 달라서 다음 글{" "}
            <Link to="/law/private-law/property-and-entitlement">재산</Link>이
            맡습니다.
          </p>
        </div>
      </section>

      <section id="which-promises" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 1. 모든 약속을 지켜 주지는 않습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            사람들은 하루에도 여러 번 약속합니다. 그 가운데 어겼다고 법원에 갈 수
            있는 것은 아주 일부입니다. 왜 전부가 아닌지부터 물어야 합니다.
          </p>

          <p className="leading-7">
            이유는 비용입니다. 모든 약속에 법의 힘을 붙이면 저녁을 사겠다는 말 하나로도 법원이 움직여야 하고 사람들은 가벼운 말조차 하지 못하게 됩니다. 약속의 값을 올리면 약속 자체가
            줄어듭니다.
          </p>

          <p className="leading-7">
            그래서 체를 둡니다. 첫째는 서로 같은 것을 말했는지입니다. 한쪽이 판
            것과 다른 쪽이 산 것이 다르면 애초에 하나의 약속이 아닙니다.
          </p>

          <p className="leading-7">
            둘째는 법에 기대겠다는 뜻이 있었는지입니다. 저녁을 사겠다는 말과
            물건을 대겠다는 계약은 말의 형태가 같아도 이 뜻이 다릅니다. 대가가
            오갔는지와 서면을 갖췄는지가 그 뜻을 밖에서 읽는 표지로 쓰입니다.
          </p>

          <p className="leading-7">
            셋째와 넷째는 내용입니다. 무엇을 언제 얼마에 할지가 정해져야 어겼는지 판정할 수 있고 금지된 것을 하기로 한 약속에는 힘을 붙여 줄 수 없습니다.
          </p>
        </div>

        <TermBreakdown
          title="네 체가 각각 무엇을 막는가"
          items={[
            {
              term: "합의",
              description:
                "두 사람이 같은 것을 말했는지를 봅니다. 서로 다른 것을 떠올렸다면 지킬 약속 자체가 없습니다.",
              example:
                "같은 이름의 물건이 두 종류인데 각자 다른 것을 생각하고 서명했다면 합의가 성립하지 않습니다.",
              boundary:
                "속마음이 아니라 밖으로 드러난 표시를 기준으로 봅니다. 그렇지 않으면 나중에 다른 생각이었다고 말하는 것만으로 약속을 무를 수 있게 됩니다.",
            },
            {
              term: "묶일 뜻",
              description:
                "법의 힘에 기대겠다는 뜻이 있었는지를 봅니다. 대가가 오갔는지와 형식을 갖췄는지가 그 표지입니다.",
              example:
                "가족끼리 주고받은 말에는 이 뜻이 없다고 보는 것이 출발점이고, 사업상 주고받은 문서에는 있다고 보는 것이 출발점입니다.",
              boundary:
                "표지는 뜻 자체가 아니라 뜻을 읽는 단서입니다. 형식을 갖췄어도 농담이었던 정황이 분명하면 결론이 달라질 수 있습니다.",
            },
            {
              term: "확정성",
              description:
                "무엇을 언제 얼마에 할지가 정해져야 어겼는지를 판정할 수 있습니다.",
              example:
                "값을 정하지 않고 사기로만 했다면 얼마를 물리라고 해야 할지 정할 수 없습니다.",
              boundary:
                "전부 적혀 있어야 하는 것은 아닙니다. 빠진 부분을 메우는 장치가 따로 있고, 그것이 4절의 내용입니다.",
            },
            {
              term: "적법성",
              description:
                "금지된 것을 하기로 한 약속에는 힘을 붙여 주지 않습니다.",
              example:
                "법이 막는 일을 대가를 받고 하기로 한 약속은 어겨도 물릴 수 없습니다.",
              boundary:
                "힘을 붙여 주지 않는 것과 이미 주고받은 것을 어떻게 정리하느냐는 다른 문제이며, 뒤쪽은 별도의 규칙이 다룹니다.",
            },
          ]}
        />
      </section>

      <section id="remedy-choice" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 2. 시키는 것과 물리는 것은 다릅니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            체를 통과한 약속을 한쪽이 어겼습니다. 이제 법이 할 수 있는 일이
            둘입니다. 약속한 대로 하게 만들거나, 하지 않은 대신 돈을 물리는
            것입니다.
          </p>

          <p className="leading-7">
            직관적으로는 앞쪽이 자연스러워 보입니다. 약속했으면 지켜야 하니까요.
            그런데 실제 제도는 대체로 뒤쪽을 기본으로 둡니다. 이유가 몇 가지
            있습니다.
          </p>

          <p className="leading-7">
            하게 만들려면 계속 지켜봐야 합니다. 물건을 넘기는 것처럼 한 번에 끝나는 일이면 시킬 수 있지만 몇 달에 걸쳐 어떤 품질로 일하게 하는 것은 법원이 감독할 수 없습니다.
            그리고 사람에게 특정한 노동을 강제하는 것은 그 자체로 다른 문제를 부릅니다.
          </p>

          <p className="leading-7">
            그래서 기본은 돈이고, 하게 만드는 것은 돈으로 메울 수 없을 때 쓰는
            예외가 됩니다. 세상에 하나뿐인 물건이나 대체할 곳이 없는 권리가 그런
            경우입니다.
          </p>
        </div>

        <CitationBlock
          source="Oliver Wendell Holmes Jr. · The Path of the Law (Harvard Law Review 10권, 1897, 457~478쪽)"
          citeKey={1}
          href="https://en.wikisource.org/wiki/The_Path_of_the_Law"
        >
          1897년 보스턴대 법학대학원 헌정식 강연을 옮긴 글입니다. 법을 도덕과
          분리해 결과의 예측으로 보자고 제안하면서, 계약에 대해
          &ldquo;보통법에서 계약을 지킬 의무란 지키지 않으면 배상해야 한다는
          예측을 뜻하며, 그것 말고는 아무것도 아니다&rdquo;라고 적습니다. 그
          시각을 &ldquo;법을 알고 싶다면 나쁜 사람의 눈으로 보아야 한다. 그런
          사람은 그 앎이 예측하게 해 주는 물질적 결과만 신경 쓰지, 양심의 더
          모호한 제재에서 행동의 이유를 찾는 좋은 사람처럼 보지 않는다&rdquo;로
          설명합니다. 위 본문에서 기본 구제를 돈으로 두는 이유를 정리한 부분은
          이 관점과 이어지지만, 이 글의 주장은 관점의 제안이지 어느 나라 제도가
          실제로 그렇게 되어 있다는 보고가 아닙니다. 실제 제도에서 이행을 시키는
          경우가 어디까지인지는 나라마다 다릅니다.
        </CitationBlock>
      </section>

      <section id="damages" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 3. 얼마를 물리느냐가 어길지 말지를 정합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            돈으로 물린다고 정하고 나면 다음 질문이 따라옵니다. 얼마를 물릴
            것인가입니다. 그런데 이 숫자는 사후 정산에 그치지 않습니다. 사람들이
            사전에 무엇을 할지를 정합니다.
          </p>

          <p className="leading-7">
            상황을 보겠습니다. 약속한 뒤에 사정이 바뀌어 이행하는 데 드는 비용이 크게 올랐습니다. 이때 어기는 쪽은 배상액과 이행 비용을 견주고 사회는 이행 비용과 상대가 얻을 이익을
            견줍니다. 두 비교의 기준이 다르면 판단이 어긋납니다.
          </p>

          <p className="leading-7">
            그리고 두 기준을 맞추는 방법이 하나 있습니다. 배상액을 상대가 얻을
            이익과 같게 두는 것입니다.
          </p>
        </div>

        <ExplainedFormula
          question="배상액을 얼마로 두면 어길지 말지의 판단이 옳게 내려지는가?"
          idea="어기는 쪽은 배상액과 이행 비용을 견줘 싼 쪽을 고릅니다. 사회가 보기에 파기가 나은 것은 이행 비용이 상대가 얻을 이익보다 클 때입니다. 두 비교는 오른쪽 항이 각각 배상액과 상대 이익이라는 점만 다릅니다. 그래서 배상액을 상대 이익과 같게 두면 두 판정이 언제나 같아집니다."
          formula={String.raw`\text{파기 선택} \iff C > D, \qquad \text{파기가 나음} \iff C > V, \qquad D = V \;\Rightarrow\; \text{두 조건이 일치}`}
          annotatedFormula={String.raw`\underbrace{C > D}_{\text{어기는 쪽의 기준}}, \qquad \underbrace{C > V}_{\text{사회의 기준}}, \qquad \underbrace{D = V \;\Rightarrow\; \text{일치}}_{\text{배상을 상대 이익에 맞출 때}}`}
          operations={[
            {
              expression: String.raw`C > D`,
              annotation: [
                "이행에 드는 비용이 물어야 할 돈보다 크면 어기는 쪽이 싸다는 계산입니다.",
                "여기서 상대가 얻을 이익은 들어오지 않습니다. 어기는 쪽이 보는 것은 자기 비용과 배상액뿐입니다.",
              ],
            },
            {
              expression: String.raw`C > V`,
              annotation: [
                "만드는 데 드는 비용이 그것으로 얻는 이익보다 크면 만들지 않는 편이 낫다는 계산입니다.",
                "이 비교에는 배상액이 들어오지 않습니다. 배상은 돈이 한쪽에서 다른 쪽으로 옮겨 가는 것이지 없어지거나 생기는 것이 아니기 때문입니다.",
              ],
            },
            {
              expression: String.raw`D = V`,
              annotation: [
                "두 부등식의 오른쪽 항을 같게 만들면 왼쪽이 같으므로 판정도 언제나 같아집니다.",
                "어긋나는 구간의 폭은 정확히 |D − V|입니다. 배상을 상대 이익에 맞추면 그 폭이 0이 됩니다.",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`C`,
              name: "이행 비용",
              description:
                "약속한 것을 실제로 해내는 데 드는 비용이며, 사정이 바뀐 뒤에야 크기가 드러납니다.",
            },
            {
              symbol: String.raw`D`,
              name: "배상액",
              description:
                "어겼을 때 물어야 하는 돈이며, 제도가 정하는 값입니다.",
            },
            {
              symbol: String.raw`V`,
              name: "상대가 이행으로 얻을 이익",
              description:
                "약속대로 되었을 때 상대에게 생기는 값이며, 사회가 보는 편익이기도 합니다.",
            },
          ]}
          assumptions={[
            "상대가 얻을 이익을 사후에 재어 낼 수 있다고 둡니다. 실제로는 이 값을 증명하기 어려워 배상액이 그보다 작게 정해지는 일이 흔합니다.",
            "소송 비용과 회수 위험을 넣지 않았습니다. 넣으면 실제로 받는 돈이 배상액보다 작아 계산이 과잉 파기 쪽으로 기웁니다.",
            "상대가 그 약속을 믿고 한 준비가 고정되어 있다고 둡니다. 배상이 두터울수록 준비를 과하게 하는 쪽으로 기우는 별도의 문제가 이 모형 밖에 있습니다.",
          ]}
          interpretation="상대가 이행으로 얻을 이익을 100으로 두고 배상액도 100으로 맞추면, 이행 비용이 130인 사정에서 어기는 쪽은 100을 물고 파기를 고르며 사회적으로도 130을 들여 100짜리를 만들지 않는 편이 낫습니다. 배상을 60으로 낮추면 이행 비용이 80일 때 파기를 고르는데 사회적으로는 80을 들여 100짜리를 만드는 편이 나았으므로 20이 사라집니다. 반대로 배상을 150으로 올리면 이행 비용이 130일 때 이행을 고르는데 이는 130을 들여 100짜리를 만드는 것이라 30이 사라집니다. 여기서 읽어야 할 것은 배상액이 사후 정산이 아니라 사전 유인이라는 점입니다. 읽으면 안 되는 것은 약속을 어기는 것이 계산만 맞으면 괜찮다는 결론입니다. 이 계산은 상대가 얻을 이익을 온전히 물어 준다는 것을 전제하는데, 실제로는 그 값을 증명하기 어려워 덜 물어 주는 경우가 흔하고 그때는 위에서 본 과잉 파기가 그대로 일어납니다."
        />

        <BreachIncentiveViz />
      </section>

      <section id="incomplete" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 4. 계약서는 미래를 다 적을 수 없습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            앞 절의 계산은 사정이 바뀌었을 때 어떻게 할지를 다뤘습니다. 그런데
            그것을 계약서에 미리 적어 두면 되지 않느냐는 생각이 자연스럽습니다.
            적을 수 있다면 그렇게 하는 편이 낫습니다.
          </p>

          <p className="leading-7">
            그런데 적을 수 없습니다. 일어날 수 있는 일을 전부 떠올릴 수 없고 떠올려도 전부 적으면 협상이 끝나지 않습니다. 앞 글의 계산이 여기서 다시 나옵니다. 미리 적어 두는
            비용과 그때 가서 정하는 비용을 견주는 문제이고, 계약 당사자에게는 사안이 한 건뿐이라 미리 적는 쪽이 대체로 비쌉니다.
          </p>

          <p className="leading-7">
            그래서 계약에는 반드시 빈칸이 남습니다. 그 빈칸을 법이 대신 메워 두고 당사자가 다르게 정하면 그쪽을 따릅니다. 미리 적지 않아도 되는 기본값을 제공하는 것입니다.
          </p>

          <p className="leading-7">
            이 기본값을 무엇으로 채울지에는 기준이 있습니다. 대부분의 당사자가
            그 상황에서 합의했을 법한 내용으로 두는 것입니다. 그러면 예외적인
            사람만 따로 적으면 되므로 전체가 치르는 비용이 가장 작아집니다.
          </p>
        </div>

        <AlgorithmBlock
          title="계약에 적혀 있지 않은 사안을 처리하는 절차"
          input={[
            "계약서의 문언과 협상 과정에서 오간 자료",
            "그 거래가 속한 분야의 관행",
            "그 상황을 다루는 임의규정의 유무",
          ]}
          steps={[
            {
              code: "정말 적혀 있지 않은지 먼저 확인한다. 다른 조항에서 읽어 낼 수 있는지 본다.",
              note: "빈칸처럼 보이는 것이 실은 다른 조항의 반대 해석으로 채워지는 경우가 많습니다. 앞 글의 체계 해석이 여기서 먼저 걸립니다.",
            },
            {
              code: "당사자가 그 상황을 알았다면 무엇으로 합의했을지를 자료에서 찾는다.",
              note: "협상 과정의 초안과 오간 문서가 단서입니다. 다만 뒤늦게 유리한 쪽으로 읽으려는 유인이 양쪽에 있어 무게를 가려야 합니다.",
            },
            {
              code: "그 분야의 관행이 있으면 관행을 본다.",
              note: "관행은 그 거래를 여러 번 하는 사람들이 이미 치러 본 비용의 결과라, 대부분의 당사자가 합의했을 내용에 가까울 가능성이 높습니다.",
            },
            {
              code: "그래도 남으면 법이 마련해 둔 기본값을 적용한다.",
              note: "기본값은 명령이 아니라 대체 가능한 초기값입니다. 당사자가 다르게 적었다면 그쪽이 우선합니다.",
            },
            {
              code: "기본값이 그 거래에 맞지 않는다면 왜 맞지 않는지를 적어 둔다.",
              note: "기본값은 대부분의 당사자를 기준으로 만들어지므로 예외적인 거래에는 어긋납니다. 어긋남이 반복되면 그것이 기본값을 고칠 근거가 됩니다.",
            },
            {
              code: "적을 수 있었는데 적지 않은 것인지, 적을 수 없었던 것인지 가른다.",
              note: "적을 수 있었는데 침묵했다면 그 침묵 자체가 선택일 수 있습니다. 두 경우를 섞으면 빈칸을 메우는 일이 계약을 다시 쓰는 일이 됩니다.",
            },
          ]}
          output="그 사안에 적용할 내용과, 그것이 계약에서 나온 것인지 관행에서 나온 것인지 법의 기본값에서 나온 것인지에 대한 구분"
        />

        <ProgressiveDetail
          title="기본값을 일부러 불편하게 두는 경우도 있는가?"
          preview="대부분이 원할 내용으로 두는 것과, 말하게 만들려고 두는 것은 목적이 다릅니다."
        >
          <p className="leading-7">
            기본값을 대부분의 당사자가 합의했을 내용으로 두면 적어야 할 사람이
            줄어 전체 비용이 작아집니다. 이것이 기본 원칙입니다.
          </p>
          <p className="leading-7">
            그런데 반대로 두는 경우가 있습니다. 한쪽만 아는 정보가 있을 때입니다.
            그 정보를 가진 쪽에 불리하게 기본값을 두면, 그쪽이 먼저 말을 꺼내
            따로 적자고 하게 됩니다. 정보를 끌어내려고 일부러 불편한 초기값을 두는
            것입니다.
          </p>
          <p className="leading-7">
            예를 들어 손해가 특별히 클 사정을 아는 쪽이 있다면, 기본값을 통상적인 손해까지만 물어 주는 것으로 두는 편이 낫습니다. 그러면 특별한 사정이 있는 쪽이 미리 알리고 값을
            조정하게 되고 알리지 않으면 그 위험은 아는 쪽이 집니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="boundary" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          이 힘은 두 사람 사이에만 미칩니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            이 글에서 본 것은 전부 약속한 두 사람 사이의 이야기입니다. 물건을 대기로 한 사람이 어기면 그 사람에게 물릴 수 있지만 그 물건을 가로챈 제삼자에게는 이 계약을 들이댈 수
            없습니다.
          </p>

          <p className="leading-7">
            그런데 세상에는 누구에게나 주장할 수 있는 권리가 있습니다. 내
            물건이라는 주장은 그 물건을 가져간 사람이 누구든 통합니다. 약속에서
            나온 힘과는 성격이 다릅니다.
          </p>

          <p className="leading-7">
            그 차이가 어디서 오는지가 다음 질문입니다. 두 사람이 정한 것은 두
            사람만 묶는 것이 당연한데, 어떤 권리는 어떻게 그 범위를 넘어
            모두에게 미치는가입니다.
          </p>

          <p className="leading-7">
            다음 글{" "}
            <Link to="/law/private-law/property-and-entitlement">재산</Link>이
            그 자리를 맡습니다. 소유가 정확히 무엇을 주는지, 그리고 동의 없이도
            옮길 수 있는 경우가 왜 있는지가 주제입니다.
          </p>
        </div>
      </section>
    </div>
  );
}

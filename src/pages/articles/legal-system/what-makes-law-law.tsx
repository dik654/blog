import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import NormChainViz from "./what-makes-law-law/viz/NormChainViz";
import LegalityConditionsViz from "./what-makes-law-law/viz/LegalityConditionsViz";

/**
 * 무엇이 이 문장을 법으로 만듭니까
 *
 * 법 시리즈의 입구. 정치 시리즈가 "누가 정하는가"로 끝났으니, 정해진 문장이
 * 개별 사안의 판단이 되기까지 무엇이 필요한지를 받는다. 효력의 사슬과 그것이
 * 멈추는 자리, 그리고 형식 조건까지가 이 글의 범위다.
 */
export default function WhatMakesLawLawArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          정해진 문장과 내 사건의 판단 사이에는 아직 거리가 있습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            앞 시리즈는 한 사회에 하나만 존재할 수 있는 결정을 누가 어떻게
            내리는지를 다뤘습니다. 강제력이 어디에 모이고, 무엇이 그것을 묶고,
            누가 그 자리를 채우고, 어떤 조직이 집행하는지까지 따라갔습니다.
          </p>

          <p className="leading-7">
            그런데 그렇게 정해진 것은 문장입니다. 일반적인 문장 하나가 어느 날
            내 앞에 놓인 고지서 한 장이 되고 판결문 한 줄이 되기까지, 아직 설명되지
            않은 구간이 남아 있습니다. 그 구간을 다루는 것이 이 시리즈입니다.
          </p>

          <p className="leading-7">
            첫 질문은 가장 아래에서 시작합니다. 고지서를 받아 들고 왜 이걸 따라야
            하느냐고 물으면 어떤 답이 돌아오는지, 그리고 그 답에 같은 질문을 계속
            하면 어디까지 가는지입니다.
          </p>
        </div>

        <NormChainViz />

        <ContentBoundary article="what-makes-law-law" />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            이 글이 푸는 질문은 하나입니다.{" "}
            <strong>무엇이 어떤 문장을 법으로 만드는가</strong>입니다.
          </p>

          <p className="leading-7">
            순서는 힘으로 하는 요구와 법이 어디서 갈라지는지, 효력이 어디서 와서
            어디서 멈추는지, 그리고 그렇게 효력을 얻은 규범이 실제로 사람을
            이끌려면 무엇이 더 필요한지입니다.
          </p>

          <p className="leading-7">
            여기서는 어떤 문장이 법인지까지만 봅니다. 그 문장을 개별 사안에
            적용하는 일, 곧 해석은 다음 글{" "}
            <Link to="/law/legal-system/rules-standards-and-interpretation">
              규칙과 기준
            </Link>
            이 맡습니다.
          </p>
        </div>
      </section>

      <section id="command-vs-law" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 1. 총을 든 요구와 고지서는 어디서 갈라집니까
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            둘 다 내놓으라고 하고 둘 다 따르지 않으면 나쁜 일이 생깁니다. 겉모습만
            보면 법은 조직이 크고 옷을 갖춰 입은 협박처럼 보입니다. 이 비유를
            반박하지 못하면 법에 대한 이야기가 전부 힘에 대한 이야기로 무너집니다.
          </p>

          <p className="leading-7">
            갈라지는 지점은 셋입니다. 첫째, 고지서는 나를 지목해서 만들어지지
            않았습니다. 같은 조건에 있는 모든 사람에게 같은 내용이 적용되는 규칙이
            먼저 있고 내 사건이 거기 걸린 것입니다. 협박은 그 반대로 지목에서
            시작합니다.
          </p>

          <p className="leading-7">
            둘째, 그 규칙은 내가 그 행동을 하기 전에 이미 있었고 알 수 있었습니다.
            그래서 나는 미리 피할 수 있었습니다. 협박은 닥친 뒤에야 알게 되므로
            피할 기회를 주지 않습니다.
          </p>

          <p className="leading-7">
            셋째, 요구하는 쪽도 그 규칙에 묶입니다. 정해진 금액과 절차를 벗어나면
            그쪽이 잘못한 것이 됩니다. 협박자는 자기 요구에 묶이지 않습니다.
          </p>

          <p className="leading-7">
            그래서 차이를 만드는 것은 힘의 크기가 아니라 힘이 규칙을 통해서만
            나온다는 구조입니다. 다음 절은 그 구조가 어디까지 이어지는지를 봅니다.
          </p>
        </div>

        <TermBreakdown
          title="셋을 갈라 놓고 보면"
          items={[
            {
              term: "지목이 아니라 규칙",
              description:
                "특정인을 향해 만들어진 요구가 아니라, 조건을 적어 둔 일반 규칙에 내 사건이 걸린 것입니다.",
              example:
                "같은 속도로 같은 구간을 지난 모든 차에 같은 금액이 부과됩니다.",
              boundary:
                "일반적인 문장이라도 실제로 한 사람에게만 해당하도록 조건을 좁히면 형식만 규칙일 수 있습니다.",
            },
            {
              term: "사전에 알 수 있음",
              description:
                "행동하기 전에 규칙이 존재했고 찾아볼 수 있었기 때문에 피할 기회가 있었습니다.",
              example:
                "제한 속도를 알고 있으면 과태료를 피하는 선택이 가능합니다.",
              boundary:
                "공포되어 있어도 사실상 읽어 낼 수 없을 만큼 복잡하면 이 조건은 형식적으로만 충족됩니다.",
            },
            {
              term: "요구하는 쪽도 묶임",
              description:
                "부과하는 기관이 정해진 요건과 절차를 벗어나면 그 처분이 취소될 수 있습니다.",
              example:
                "고지서에 근거 조문과 이의 신청 방법이 적혀 있는 것은 그 묶임을 확인해 주는 장치입니다.",
              boundary:
                "묶임이 실제로 작동하려면 취소를 선언할 수 있는 별도의 자리가 있어야 합니다. 앞 시리즈의 권력분립이 여기서 다시 걸립니다.",
            },
          ]}
        />
      </section>

      <section id="validity-chain" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 2. 효력은 위에서 오고, 사슬은 규범이 아닌 곳에서 멈춥니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            고지서가 효력을 갖는 이유를 물으면 시행령이 나오고, 시행령을 물으면
            법률이 나오고, 법률을 물으면 헌법이 나옵니다. 매번 같은 형태의 답이
            나온다는 것이 중요합니다. 어떤 규범의 효력은 다른 규범이 그것을 만들
            권한을 주었다는 데서 옵니다.
          </p>

          <p className="leading-7">
            그러면 헌법은 무엇이 효력을 줍니까. 여기서 같은 답을 한 번 더 하려면
            헌법 위에 또 다른 규범이 있어야 하는데, 없습니다. 사슬이 끝나는
            자리입니다.
          </p>

          <p className="leading-7">
            이 자리를 채우는 흔한 답 하나는 성립하지 않습니다. 더 높은 규범을
            상정하는 것입니다. 그렇게 하면 그 규범에 대해 같은 질문을 또 할 수
            있으므로 문제가 한 칸 미뤄질 뿐입니다.
          </p>

          <p className="leading-7">
            남는 답은 성격이 다릅니다. 사슬을 멈추는 것이 규범이 아니라 사실이라는
            것입니다. 법원과 공직자들이 실제로 어떤 문서를 기준으로 삼아 판단하고
            있다는 사실, 그것이 바닥입니다.
          </p>
        </div>

        <ExplainedFormula
          question="어떤 규범이 효력을 갖는지 묻는 일은 왜 끝나야 하고, 어디서 끝나는가?"
          idea="한 규범의 효력은 그것을 만들 권한을 준 다른 규범에서 옵니다. 이 관계를 그대로 적으면 자기 자신을 다시 부르는 모양이 되고, 그런 정의는 종결 조건이 있어야 성립합니다. 종결 조건의 자리에는 또 하나의 규범을 놓을 수 없습니다. 놓으면 같은 질문이 다시 시작되기 때문입니다. 그래서 그 자리에는 규범이 아닌 것, 곧 사실이 들어갑니다."
          formula={String.raw`\mathrm{valid}(N) \iff \exists M \bigl[\, \mathrm{valid}(M) \wedge \mathrm{auth}(M,\,N) \,\bigr], \qquad \mathrm{valid}(R_{0}) :\equiv \mathrm{practice}(R_{0})`}
          annotatedFormula={String.raw`\mathrm{valid}(N) \iff \exists M \bigl[\, \underbrace{\mathrm{valid}(M) \wedge \mathrm{auth}(M,\,N)}_{\text{효력 있는 상위 규범이 권한을 줌}} \,\bigr], \qquad \underbrace{\mathrm{valid}(R_{0}) :\equiv \mathrm{practice}(R_{0})}_{\text{바닥은 규범이 아니라 사실}}`}
          operations={[
            {
              expression: String.raw`\mathrm{auth}(M,\,N)`,
              annotation: [
                "M이 N을 만들 권한을 주었다는 관계입니다. 누가 어떤 절차로 무엇을 정할 수 있는지가 여기 들어갑니다.",
                "권한의 범위를 벗어나면 이 관계가 성립하지 않아 N은 효력을 얻지 못합니다. 위임의 한계를 다투는 사건이 전부 이 지점의 다툼입니다.",
              ],
            },
            {
              expression: String.raw`\exists M \bigl[\, \mathrm{valid}(M) \wedge \cdots \,\bigr]`,
              annotation: [
                "정의 안에서 정의되는 술어를 다시 부르는 재귀 구조입니다. 이런 정의는 종결 조건이 있어야만 값이 정해집니다.",
                "종결 조건이 없으면 어떤 규범에 대해서도 효력 여부를 확정할 수 없게 됩니다. 사슬이 끝나야 하는 이유가 여기 있습니다.",
              ],
            },
            {
              expression: String.raw`\mathrm{valid}(R_{0}) :\equiv \mathrm{practice}(R_{0})`,
              annotation: [
                "최상위 규범의 효력을 다른 규범에서 끌어오지 않고 관행이라는 사실로 정의합니다. 등호 옆의 기호가 증명이 아니라 정의임을 나타냅니다.",
                "그래서 이 항목만은 옳고 그름을 따질 대상이 아니라 실제로 그러한지를 관찰할 대상입니다.",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`N,\,M`,
              name: "규범",
              description:
                "처분·규칙·법률·헌법처럼 무엇을 해야 하는지 정하는 문장입니다. 사슬 위의 한 칸을 가리킵니다.",
            },
            {
              symbol: String.raw`R_{0}`,
              name: "최상위 기준",
              description:
                "그 체계에서 무엇이 법인지를 가리는 데 실제로 쓰이는 기준이며, 사슬의 바닥에 놓입니다.",
            },
            {
              symbol: String.raw`\mathrm{practice}`,
              name: "관행이라는 사실",
              description:
                "법원과 공직자들이 실제로 그 기준을 써서 판단하고 있다는 상태입니다. 규범이 아니라 관찰 대상입니다.",
            },
          ]}
          assumptions={[
            "권한 수여 관계가 한 방향이고 순환하지 않는다고 둡니다. 서로가 서로의 근거가 되는 구조라면 사슬이 끝나지 않습니다.",
            "사슬의 길이가 유한하다고 둡니다. 무한히 올라갈 수 있다면 종결 조건 자체가 필요 없지만, 실제 체계는 유한합니다.",
            "최상위 기준이 하나로 특정된다고 둡니다. 두 기준이 경쟁하는 시기에는 같은 규범에 대해 답이 갈립니다.",
          ]}
          interpretation="과태료 부과 처분이 효력을 갖는 것은 시행령이 그 권한을 주었기 때문이고, 시행령은 법률이 범위를 정해 위임했기 때문이며, 그 법률은 헌법이 정한 절차를 밟았기 때문입니다. 헌법에 이르면 auth 관계를 채울 상위 규범이 없어 재귀가 멈추고, 그 자리를 관행이라는 사실이 채웁니다. 여기서 읽어야 할 것은 바닥이 사실이라는 점이 결함이 아니라 재귀적 정의의 구조가 요구하는 것이라는 점입니다. 읽으면 안 되는 것은 그래서 법이 힘과 같다는 결론입니다. 이 식은 효력이 어디서 오는지만 말하며, 그 효력을 가진 규범의 내용이 정당한지는 다루지 않습니다. 또 하나 읽어야 할 것은 이 구조가 체제 전환을 설명해 준다는 점입니다. 바닥이 관행이므로, 공직자들이 기준으로 삼는 문서가 바뀌면 그 위에 걸려 있던 규범들의 효력이 한꺼번에 다시 계산됩니다."
        />

        <CitationBlock
          source="Stanford Encyclopedia of Philosophy · Legal Positivism (Leslie Green · Thomas Adams, 2003년 초판, 2025년 10월 10일 개정)"
          citeKey={1}
          href="https://plato.stanford.edu/entries/legal-positivism/"
        >
          효력의 근거를 사회적 사실에서 찾는 입장을 정리한 항목입니다. 무엇이
          법인지 가리는 최상위 기준을 승인의 규칙이라고 부르며, 그것이
          &ldquo;공직자들의 관행이지 더 넓은 공동체가 반드시 공유하는 기준은
          아니&rdquo;라고 적습니다. 핵심은 그 기준이 &ldquo;실제로 실행되고 있기
          때문에만 존재한다&rdquo;는 대목이며, 그래서 &ldquo;법체계에서 효력의
          최종 기준은 법규범도 전제된 규범도 아니라 실제로 실행되고 있기 때문에만
          존재하는 사회적 규칙&rdquo;이 됩니다. 위 식에서 종결 조건을 규범이
          아니라 사실로 둔 근거가 이것입니다. 다만 이 항목이 정리하는 것은 효력의
          근거에 관한 한 입장이며, 도덕적 기준이 효력 판단에 들어온다고 보는 반대
          입장도 같은 항목 안에 소개되어 있습니다.
        </CitationBlock>
      </section>

      <section id="form-conditions" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 3. 효력이 있다고 해서 사람을 이끌 수 있는 것은 아닙니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            앞 절은 어떤 문장이 효력을 갖는지에 답했습니다. 그런데 효력이 있는
            문장이 곧 사람의 행동을 이끄는 것은 아닙니다. 절차를 다 밟아 만들어도
            아무도 그것에 맞춰 행동할 수 없는 규범이 있습니다.
          </p>

          <p className="leading-7">
            그런 경우를 모아 보면 실패의 방식이 몇 가지로 정리됩니다. 공포하지
            않거나, 읽어도 뜻이 정해지지 않거나, 이미 한 행동에 뒤늦게 적용하거나,
            서로 어긋나는 요구를 하거나, 지킬 수 없는 것을 요구하거나, 너무 자주
            바꾸거나, 적힌 것과 다르게 집행하는 것입니다.
          </p>

          <p className="leading-7">
            이 항목들은 법이 좋은 법이기 위한 요건이 아닙니다. 규범이 사람을
            이끄는 장치로 작동하기 위한 요건입니다. 하나라도 빠지면 그 규범은
            사전에 행동을 안내하는 것이 아니라 사후에 벌할 근거로만 남습니다.
          </p>
        </div>

        <AlgorithmBlock
          title="어떤 규범이 사람의 행동을 실제로 이끌 수 있는지 판정하는 절차"
          input={[
            "규범의 문언과 공포 여부·시점",
            "적용 대상의 범위와 적용 시점의 기준",
            "같은 사안에 걸리는 다른 규범들의 목록",
            "실제 집행 사례",
          ]}
          steps={[
            {
              code: "대상이 조건으로 적혀 있는지, 특정인을 지목하는지 본다.",
              note: "형식은 일반적이어도 조건을 좁혀 사실상 한 사람에게만 걸리게 만들 수 있으므로, 적용 대상의 실제 크기를 함께 봅니다.",
            },
            {
              code: "행위 시점보다 앞서 공포되었는지 확인한다.",
              note: "공포 시점이 행위 시점보다 뒤이면 그 규범은 그 사건에서 안내 역할을 할 수 없었습니다. 형벌에서 이 조건이 특히 엄격한 이유입니다.",
            },
            {
              code: "읽어서 적용 여부가 정해지는지 본다. 판단이 갈리는 범위를 표시한다.",
              note: "모든 규범에 회색 지대가 있으므로 있느냐가 아니라 얼마나 넓으냐를 봅니다. 회색 지대가 본문보다 넓으면 명확성 조건이 무너진 것입니다.",
            },
            {
              code: "같은 사안에 걸리는 다른 규범과 어긋나지 않는지 본다.",
              note: "어긋나면 어느 쪽을 따라도 위반이 되므로 맞출 방법이 없습니다. 상위법 우선이나 특별법 우선 같은 충돌 해소 규칙이 있는지 함께 확인합니다.",
            },
            {
              code: "요구하는 행동이 실제로 가능한지 본다.",
              note: "물리적으로 불가능하거나 다른 의무와 동시에는 이행할 수 없는 요구는 규범이 아니라 벌할 구실이 됩니다.",
            },
            {
              code: "최근 개정 이력을 보고, 행동을 맞출 수 있을 만큼 안정적인지 본다.",
              note: "너무 자주 바뀌면 알아보는 비용이 준수의 이익을 넘어서서, 사람들이 규범 대신 관행을 따르게 됩니다.",
            },
            {
              code: "적힌 대로 집행되는지 확인한다. 어긋나면 어느 쪽이 실제 규칙인지 표시한다.",
              note: "이 항목이 깨지면 앞의 여섯을 다 갖춰도 소용이 없습니다. 조문을 읽고 맞춘 행동이 실제로는 빗나가기 때문입니다.",
            },
          ]}
          output="그 규범이 사전 안내로 쓰일 수 있는지에 대한 판정과, 깨진 조건 목록 및 그때 사람들이 실제로 무엇을 기준으로 삼게 되는지"
        />

        <LegalityConditionsViz />
      </section>

      <section id="why-form-matters" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 4. 이 조건들이 요구되는 이유는 도덕이 아니라 기능입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            앞 절의 목록을 보면 선한 통치의 덕목처럼 읽힙니다. 그런데 이 조건들이
            요구되는 이유는 더 건조합니다. 조건이 깨지면 규범이 하려던 일 자체를
            할 수 없게 됩니다.
          </p>

          <p className="leading-7">
            규범이 하려는 일은 사람들이 서로의 행동을 예측할 수 있게 만드는
            것입니다. 내가 이렇게 하면 저쪽이 저렇게 한다는 것을 미리 알 수 있어야
            계약을 맺고 투자를 하고 다툼을 미리 피할 수 있습니다. 앞 조건들은 전부
            그 예측을 가능하게 하는 데 필요한 것들입니다.
          </p>

          <p className="leading-7">
            앞 시리즈에서 본 구조가 여기서 다시 나타납니다. 헌법이 힘을 묶는 것은
            무엇이 위반인지를 모두가 같은 시점에 같은 판단으로 읽을 수 있기
            때문이었습니다. 그 조정 효과가 성립하려면 선이 뚜렷하고 미리 알려져
            있어야 했습니다. 지금 목록의 공포와 명확성이 정확히 그 조건입니다.
          </p>

          <p className="leading-7">
            그래서 형식 조건은 내용과 무관한 껍데기가 아닙니다. 그것이 무너지면 법은 사람을 이끄는 장치에서 사후에 벌할 근거로 성격이 바뀌고 그 성격의 차이가 1절에서 협박과 법을 갈라
            놓았던 바로 그 차이입니다.
          </p>
        </div>

        <ProgressiveDetail
          title="형식만 갖추면 나쁜 법도 법인가?"
          preview="이 질문에 답을 정하는 대신, 답이 갈리는 지점이 어디인지부터 봅니다."
        >
          <p className="leading-7">
            이 글은 효력의 조건과 작동의 조건만 다뤘고 내용의 정당성은 다루지
            않았습니다. 그래서 형식을 다 갖춘 부당한 규범을 두고 그것이 법인지
            묻는 질문에 이 글만으로는 답할 수 없습니다.
          </p>
          <p className="leading-7">
            답이 갈리는 지점은 분명합니다. 효력 판단에 내용에 대한 평가가 들어가는가
            입니다. 들어가지 않는다고 보면 그것은 부당한 법이고, 들어간다고 보면
            그것은 법이 아닙니다. 두 입장 모두 같은 규범에 대해 따르지 말아야
            한다고 말할 수 있으므로, 실천적 결론이 갈리는 폭은 생각보다 좁습니다.
          </p>
          <p className="leading-7">
            다만 앞 절의 조건들이 여기서 한 가지를 말해 줍니다. 심하게 부당한 규범일수록 형식 조건을 함께 어기는 경향이 있다는 것입니다. 지목해서 만들고, 공포하지 않고, 소급해
            적용하고, 적힌 것과 다르게 집행하는 일이 함께 나타납니다. 형식만 보고도 상당 부분이 걸러진다는 뜻이지만 전부 걸러진다는 뜻은 아닙니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="boundary" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          여기까지는 어떤 문장이 법인지까지입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            이 글은 두 가지를 세웠습니다. 효력은 권한을 준 상위 규범에서 오고 그
            사슬은 관행이라는 사실에서 멈춘다는 것, 그리고 효력을 얻은 규범이
            사람을 이끌려면 여덟 가지 형식 조건이 더 필요하다는 것입니다.
          </p>

          <p className="leading-7">
            그런데 두 가지를 다 갖춘 문장을 손에 들고도 내 사건이 거기 걸리는지는
            아직 모릅니다. 문장은 일반적이고 사건은 개별적이라, 그 사이를 잇는
            일이 남아 있습니다.
          </p>

          <p className="leading-7">
            그리고 그 잇는 일은 기계적이지 않습니다. 앞 절에서 명확성 조건을 두고
            &ldquo;회색 지대가 있느냐가 아니라 얼마나 넓으냐&rdquo;라고 적은 것이
            그 예고입니다. 회색 지대를 누가 어떻게 메우는지가 다음 질문입니다.
          </p>

          <p className="leading-7">
            다음 글{" "}
            <Link to="/law/legal-system/rules-standards-and-interpretation">
              규칙과 기준
            </Link>
            이 그 자리를 맡습니다. 미리 적어 두는 방식과 사후에 판단하는 방식이
            각각 무엇을 사고 무엇으로 값을 치르는지가 주제입니다.
          </p>
        </div>
      </section>
    </div>
  );
}

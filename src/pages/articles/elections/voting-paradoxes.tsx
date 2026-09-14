import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import CondorcetCycleViz from "./voting-paradoxes/viz/CondorcetCycleViz";
import MedianVoterViz from "./voting-paradoxes/viz/MedianVoterViz";

/**
 * 규칙을 아무리 잘 골라도 남는 문제가 있습니다
 *
 * 5편이 "어떻게 세느냐"를 다뤘으니, 세는 일 자체의 한계를 받는다. 순환에서
 * 출발해 의사일정·다른 규칙·불가능성 정리까지 가고, 그런데도 굴러가는 이유를
 * 선호의 모양에서 찾아 닫는다.
 */
export default function VotingParadoxesArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          더 나은 규칙을 찾는 문제가 아닐 수도 있습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            앞 글은 규칙마다 버리는 것이 다르다는 것을 보였습니다. 그러면 자연스러운
            다음 생각은 덜 버리는 규칙을 찾자는 것입니다. 이 글은 그 생각이 어디에서
            막히는지를 봅니다.
          </p>

          <p className="leading-7">
            막히는 지점은 계산의 정교함이 아닙니다. 사람이 셋이고 안이 셋뿐인 가장
            작은 예에서, 모두가 일관된 선호를 갖고 있는데도 다수결이 답을 내놓지
            못합니다. 어느 안이 가장 원해지는지가 정해지지 않습니다.
          </p>

          <p className="leading-7">
            이것이 특정 규칙의 결함이라면 규칙을 바꾸면 됩니다. 그런데 바꿔 보면
            다른 것이 깨집니다. 이 글은 그 교체를 몇 번 해 본 뒤, 왜 끝까지
            해결되지 않는지에 대한 답으로 갑니다.
          </p>
        </div>

        <CondorcetCycleViz />

        <ContentBoundary article="voting-paradoxes" />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            이 글이 푸는 질문은 하나입니다.{" "}
            <strong>
              여럿의 뜻을 하나로 모으는 규칙에는 어떤 한계가 있고, 그런데도 실제
              정치가 굴러가는 이유는 무엇인가
            </strong>
            입니다.
          </p>

          <p className="leading-7">
            순서는 순환이 생기는 조건, 순환이 있을 때 순서를 쥔 사람이 얻는 힘,
            규칙을 바꿨을 때 대신 깨지는 것, 그 교체가 끝나지 않는 이유, 그리고
            현실에서 순환이 자주 보이지 않는 이유입니다.
          </p>

          <p className="leading-7">
            여기서 다루는 것은 셈의 성질이지 정치의 동기가 아닙니다. 순환을
            정리해 주는 실제 장치들, 곧 정당과 이익집단이 무엇을 미리 걸러 내는지는
            다음 글{" "}
            <Link to="/politics/elections/parties-and-interest-groups">
              정당과 이익집단
            </Link>
            이 맡습니다.
          </p>
        </div>
      </section>

      <section id="cycle" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 1. 개인은 멀쩡한데 집단만 순서를 잃습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            위 예에서 각자의 선호는 아무 문제가 없습니다. 첫째보다 둘째를, 둘째보다
            셋째를 덜 원하고, 그러니 첫째를 셋째보다 더 원합니다. 순서가 앞뒤로
            이어진다는 이 성질을 이행성이라고 부릅니다.
          </p>

          <p className="leading-7">
            그런데 다수결로 만든 집단의 순서에는 그 성질이 없습니다. 가안이
            나안을 이기고 나안이 다안을 이기는데, 다안이 가안을 이깁니다. 개인
            수준에서 당연한 것이 집단 수준에서 사라집니다.
          </p>

          <p className="leading-7">
            여기서 무엇을 읽어야 하는지가 중요합니다. 계산을 잘못한 것이 아니고,
            유권자가 비합리적인 것도 아닙니다. 세 판의 다수결은 각각 정확하고
            각자의 선호도 일관됩니다. 다수결이라는 연산 자체가 이행성을 보존하지
            않을 뿐입니다.
          </p>

          <p className="leading-7">
            그래서 첫 번째 질문은 이 일이 언제 생기는가입니다. 아래 절차가 그
            판정을 그대로 옮긴 것입니다.
          </p>
        </div>

        <AlgorithmBlock
          title="순환이 있는지 판정하고 그 결과를 읽는 절차"
          input={[
            "선택지 목록",
            "각 유권자의 선호 순서",
            "비교에 쓸 다수결 기준: 보통 과반",
          ]}
          steps={[
            {
              code: "모든 선택지 쌍에 대해 어느 쪽을 더 원하는 사람이 몇 명인지 센다.",
              note: "선택지가 n개면 쌍은 n(n−1)/2개입니다. 각 쌍의 승패를 표로 적어 두면 다음 단계가 표 읽기로 끝납니다.",
            },
            {
              code: "모든 상대를 이기는 선택지가 있는지 본다. 있으면 그것이 콩도르세 승자다.",
              note: "있으면 어떤 순서로 붙여도 그 안이 이깁니다. 의사일정을 누가 정하든 결과가 같아집니다.",
            },
            {
              code: "없으면 승패 관계를 따라가며 출발점으로 돌아오는 고리를 찾는다.",
              note: "콩도르세 승자가 없다는 것은 반드시 고리가 있다는 뜻입니다. 모두를 이기는 안이 없으면 이기고 지는 관계가 닫힌 원을 그릴 수밖에 없습니다.",
            },
            {
              code: "고리가 있으면 의사일정별 우승자를 계산한다: 먼저 붙일 쌍을 고르고 승자를 남은 안과 붙인다.",
              note: "고리 위의 어떤 안도 적절한 순서를 고르면 우승자가 됩니다. 이것이 다음 절의 내용입니다.",
            },
            {
              code: "각 유권자의 선호를 하나의 축 위에 그려 봉우리가 하나인지 확인한다.",
              note: "전부 봉우리가 하나면 순환이 애초에 생기지 않습니다. 순환이 나왔다면 봉우리가 둘인 사람이 있거나 축이 하나로 줄여지지 않는 것입니다.",
            },
          ]}
          output="콩도르세 승자, 또는 순환의 고리와 의사일정별 우승자 목록, 그리고 순환이 생긴 구조적 이유"
        />
      </section>

      <section id="agenda" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 2. 순환이 있으면 순서를 쥔 사람이 결과를 정합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            순환 자체는 추상적으로 들립니다. 그런데 실제 회의에서는 안건을 한 번에
            셋씩 놓고 결정하지 않습니다. 둘을 붙여 하나를 떨어뜨리고, 남은 것을
            다음 것과 붙입니다. 순환이 있으면 바로 여기서 결과가 갈립니다.
          </p>

          <p className="leading-7">
            위 Viz의 마지막 장면이 그 계산입니다. 어느 둘을 먼저 붙이느냐에 따라
            세 안 모두가 우승자가 될 수 있습니다. 표는 한 장도 바뀌지 않고 누구도
            마음을 바꾸지 않았는데 결과만 달라집니다.
          </p>

          <p className="leading-7">
            그래서 의사일정을 정하는 자리가 조용한 권력이 됩니다. 무엇을 언제
            표결에 부칠지, 어떤 안을 수정안으로 묶을지, 어떤 안을 아예 상정하지
            않을지가 전부 같은 종류의 선택입니다. 표결은 공개되지만 순서를 정하는
            과정은 대개 그렇지 않습니다.
          </p>

          <p className="leading-7">
            앞 글들의 구도가 여기서 다시 나타납니다. 거부권은 결과를 막는 힘이고
            의사일정 통제는 무엇을 후보로 올릴지 정하는 힘입니다. 둘 다 표를 한 장도
            더 갖지 않고 결과를 바꿉니다.
          </p>
        </div>

        <TermBreakdown
          title="순서를 쥔다는 것이 구체적으로 무엇인가"
          items={[
            {
              term: "표결 순서",
              description:
                "어떤 안을 먼저 붙이고 어떤 안을 나중에 붙일지를 정하는 권한입니다. 순환이 있을 때 우승자를 사실상 고릅니다.",
              example:
                "자기가 원하는 안을 마지막까지 남겨 두면 그 안이 한 번만 이기면 됩니다.",
              boundary:
                "콩도르세 승자가 있으면 이 힘은 사라집니다. 어떤 순서로 붙여도 같은 안이 이기기 때문입니다.",
            },
            {
              term: "상정 여부",
              description:
                "어떤 안을 후보 목록에 넣을지 말지를 정하는 권한입니다. 표결에 오르지 않은 안은 이길 기회 자체가 없습니다.",
              example:
                "고리를 끊는 안 하나를 목록에서 빼면 남은 안들 사이에서는 순환이 사라지기도 합니다.",
              boundary:
                "상정을 막는 힘은 대개 공개되지 않아 밖에서 관찰하기 어렵습니다. 결과만 보면 합의처럼 보입니다.",
            },
            {
              term: "수정안 묶기",
              description:
                "여러 사안을 하나로 묶거나 쪼개 표결 단위를 바꾸는 권한입니다. 묶는 방식에 따라 과반이 생기기도 사라지기도 합니다.",
              example:
                "각각으로는 과반을 못 얻는 두 안을 묶으면 양쪽 지지자가 합쳐져 통과되기도 합니다.",
              boundary:
                "묶기는 순환을 없애는 것이 아니라 선택지 집합을 바꾸는 것입니다. 같은 사람들 사이에서 다른 게임을 여는 셈입니다.",
            },
          ]}
        />
      </section>

      <section id="other-rules" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 3. 규칙을 바꾸면 대신 다른 것이 깨집니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            둘씩 붙이는 방식이 문제라면 한 번에 순위를 다 매기게 하면 됩니다. 1위에
            2점, 2위에 1점, 3위에 0점을 주고 합계로 정하는 식입니다. 이 방식은
            순환을 만들지 않습니다. 대신 다른 것이 깨집니다.
          </p>

          <p className="leading-7">
            유권자 다섯 명이 있고 세 명이 가안·나안·다안 순서, 두 명이
            나안·다안·가안 순서라고 해 봅시다. 점수를 매기면 가안이 6점, 나안이
            7점이라 나안이 이깁니다. 이제 뒤의 두 명이 다안만 맨 아래로 내려
            나안·가안·다안이 되었다고 합시다. 아무도 가안과 나안의 우열을 바꾸지
            않았습니다. 그런데 가안이 8점, 나안이 7점이 되어 승자가 바뀝니다.
          </p>

          <p className="leading-7">
            여기서 깨진 것은 이름이 있습니다. 두 안의 사회적 우열이 그 둘에 대한
            사람들의 생각만으로 정해져야 한다는 조건입니다. 점수제는 셋째 안의
            위치를 통해 첫째와 둘째의 우열을 바꿉니다.
          </p>

          <p className="leading-7">
            결선투표로 바꿔도 마찬가지입니다. 이번에 깨지는 것은 더 이상한
            것입니다. 어떤 후보가 이겼는데, 그 후보를 더 좋아하게 된 유권자가
            생기자 그 후보가 지는 일이 생깁니다.
          </p>
        </div>

        <ProgressiveDetail
          title="지지가 늘었는데 지는 일이 실제로 계산되는가?"
          preview="1위 표가 늘어 탈락자가 바뀌면, 결승에서 만나는 상대가 바뀝니다."
        >
          <p className="leading-7">
            유권자 100명이 세 후보를 놓고 결선투표를 한다고 합시다. 40명이
            가·나·다 순서, 31명이 나·다·가 순서, 29명이 다·가·나 순서입니다.
            1차에서 가 40표, 나 31표, 다 29표이므로 다가 탈락하고, 다를 1위로 둔
            29명의 표가 가에게 갑니다. 가가 69대 31로 이깁니다.
          </p>
          <p className="leading-7">
            이제 나를 1위로 두었던 네 명이 가를 더 좋아하게 되어 가·나·다 순서로
            바꿨다고 합시다. 1차 결과는 가 44표, 나 27표, 다 29표가 됩니다. 이번에는
            나가 탈락하고, 나를 1위로 둔 27명의 표가 다에게 갑니다. 다가 56대
            44로 이깁니다.
          </p>
          <p className="leading-7">
            가는 지지를 잃지 않았습니다. 오히려 네 명을 더 얻었습니다. 그런데도
            졌습니다. 바뀐 것은 1차에서 누가 탈락하느냐였고, 그것이 결승 상대를
            바꿨습니다. 규칙이 중간 단계에서 후보를 떨어뜨리는 한 이 일은 언제든
            생길 수 있습니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="arrow" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 4. 교체가 끝나지 않는 이유가 증명되어 있습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            여기까지 보면 더 나은 규칙을 계속 찾으면 될 것 같습니다. 그런데 그
            탐색이 끝나지 않는다는 것이 증명되어 있습니다. 조건 몇 개를 적어 두고,
            그 조건들을 동시에 만족하는 규칙이 없다는 것을 보인 결과입니다.
          </p>

          <p className="leading-7">
            조건들은 하나하나 보면 지나친 요구처럼 보이지 않습니다. 사람들이 어떤
            선호를 갖고 오든 규칙이 답을 내놓아야 하고, 그 답은 개인의 선호처럼
            앞뒤가 이어지는 순서여야 하며, 모두가 가안을 나안보다 원하면 사회도
            그래야 하고, 두 안의 우열은 그 둘에 대한 생각만으로 정해져야 하며,
            한 사람의 선호가 언제나 그대로 결과가 되는 일은 없어야 합니다.
          </p>

          <p className="leading-7">
            선택지가 셋 이상일 때 이 다섯을 모두 만족하는 규칙은 존재하지
            않습니다. 넷을 만족시키면 나머지 하나가 반드시 깨집니다. 앞 절에서
            규칙을 바꿀 때마다 다른 것이 깨진 것은 우연이 아니었습니다.
          </p>

          <p className="leading-7">
            이 결과를 읽을 때 자주 생기는 오해가 있습니다. 민주적 결정이 무의미하다는
            뜻으로 읽는 것입니다. 정리가 말하는 것은 그보다 훨씬 좁습니다. 어떤
            선호 조합이 들어와도 저 다섯을 전부 지키는 규칙은 없다는 것뿐입니다.
            뒤집으면 들어오는 선호 조합에 제한이 있으면 이야기가 달라집니다. 그것이
            마지막 절의 내용입니다.
          </p>
        </div>

        <CitationBlock
          source="Stanford Encyclopedia of Philosophy · Arrow's Theorem (2014년 초판, 2025년 12월 7일 개정)"
          citeKey={1}
          href="https://plato.stanford.edu/entries/arrows-theorem/"
        >
          정리의 진술을 &ldquo;선택지가 둘보다 많다고 하자. 그러면 U, SO, WP, D,
          I를 모두 만족하는 사회후생함수 f는 없다&rdquo;로 적고, 다섯 조건을 각각
          정의합니다. U는 정의역이 개인들의 모든 선호 조합을 포함할 것, SO는
          결과가 다시 하나의 순서일 것, WP는 모두가 x를 y보다 원하면 사회도 그럴
          것, D는 독재자가 없을 것, I는 두 선택지에 대한 사회의 판단이 그 둘에
          대한 개인들의 판단에만 의존할 것입니다. 원 결과는 Kenneth J. Arrow,
          &lsquo;A Difficulty in the Concept of Social Welfare&rsquo;,{" "}
          <em>Journal of Political Economy</em> 58권 4호(1950), 328~346쪽과 이듬해
          단행본에 실렸습니다. 원 논문 자체는 출판사 쪽이 자동 조회를 막아 열지
          못했고, 조건과 진술은 이 백과사전 항목에서 확인했습니다.
        </CitationBlock>
      </section>

      <section id="median-voter" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 5. 그런데도 대개 굴러가는 이유는 규칙이 아니라 선호의 모양입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            앞 절이 맞다면 의회와 선거는 늘 순환에 빠져 있어야 합니다. 그런데
            실제로는 그렇지 않습니다. 대부분의 표결은 한 번에 끝나고 결과도 뒤집히지
            않습니다. 그 차이를 만드는 것은 규칙이 아니라 들어오는 선호의 모양입니다.
          </p>

          <p className="leading-7">
            선택지를 하나의 축 위에 늘어놓을 수 있고, 각자가 자기 이상점에서
            멀어질수록 단조롭게 싫어한다면, 즉 선호에 봉우리가 하나뿐이라면 순환이
            생기지 않습니다. 그때는 한가운데 이상점을 가진 사람의 위치가 어떤 안과
            붙어도 이깁니다.
          </p>

          <p className="leading-7">
            이것이 왜 성립하는지는 계산이 아주 짧습니다. 아래에서 그 짧은 계산을
            그대로 폅니다.
          </p>
        </div>

        <ExplainedFormula
          question="어떤 조건이 있으면 다수결이 순환하지 않는가?"
          idea="이상점을 크기 순으로 세웠을 때 한가운데 있는 위치를 생각합니다. 이 위치보다 왼쪽에 있는 안이 도전하면, 이상점이 한가운데 이상인 사람들은 전부 한가운데가 더 가깝다고 봅니다. 그 사람들은 중위 자신을 포함하므로 언제나 과반입니다. 오른쪽에서 도전해도 방향만 뒤집힐 뿐 같습니다."
          formula={String.raw`x^{*} = x_{\left(\frac{n+1}{2}\right)}, \qquad \forall y \neq x^{*} : \bigl|\{\, i : |x_i - x^{*}| < |x_i - y| \,\}\bigr| > \frac{n}{2}`}
          annotatedFormula={String.raw`x^{*} = \underbrace{x_{\left(\frac{n+1}{2}\right)}}_{\text{크기 순 한가운데 이상점}}, \qquad \forall y \neq x^{*} : \underbrace{\bigl|\{\, i : |x_i - x^{*}| < |x_i - y| \,\}\bigr|}_{x^{*}\text{를 더 가깝게 보는 사람 수}} > \frac{n}{2}`}
          operations={[
            {
              expression: String.raw`x_{\left(\frac{n+1}{2}\right)}`,
              annotation: [
                "이상점을 작은 값부터 늘어놓았을 때 한가운데 순위에 있는 값입니다.",
                "사람 수가 홀수면 한가운데가 정확히 한 명이라 이 값이 하나로 정해집니다.",
              ],
            },
            {
              expression: String.raw`|x_i - x^{*}| < |x_i - y|`,
              annotation: [
                "i의 이상점에서 볼 때 한가운데가 도전안보다 가까운지를 두 거리의 비교로 씁니다.",
                "봉우리가 하나라는 전제가 여기서 쓰입니다. 가까울수록 낫다는 말이 성립해야 이 비교가 선호의 비교가 됩니다.",
              ],
            },
            {
              expression: String.raw`> \frac{n}{2}`,
              annotation: [
                "과반이라는 조건입니다. 도전안이 왼쪽이면 이상점이 한가운데 이상인 사람들이, 오른쪽이면 이하인 사람들이 전부 여기에 들어갑니다.",
                "중위 자신이 언제나 그 집합에 포함되므로 인원이 (n+1)/2명 이상이 되어 과반이 보장됩니다.",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`x_i`,
              name: "유권자 i의 이상점",
              description:
                "그 사람이 가장 원하는 위치입니다. 정책을 하나의 축으로 줄였을 때의 좌표입니다.",
            },
            {
              symbol: String.raw`x^{*}`,
              name: "중위 이상점",
              description:
                "이상점들을 크기 순으로 세웠을 때 한가운데 값이며, 이 위치를 가진 사람을 중위 유권자라고 부릅니다.",
            },
            {
              symbol: String.raw`y`,
              name: "도전안",
              description:
                "중위 이상점과 맞붙는 다른 위치입니다. 축 위 어디에 있어도 결론은 같습니다.",
            },
          ]}
          assumptions={[
            "정책을 하나의 축 위에 놓을 수 있다고 둡니다. 축이 둘 이상이면 이 결론은 일반적으로 성립하지 않습니다.",
            "각자의 선호에 봉우리가 하나뿐이라고 둡니다. 가운데를 양끝보다 싫어하는 사람이 있으면 전제가 깨집니다.",
            "모두가 참여하고 자기 선호대로 투표한다고 둡니다. 기권이 한쪽에 몰리면 실제 중위가 이동합니다.",
          ]}
          interpretation="이상점이 2·4·5·8·9인 다섯 명이라면 한가운데는 5입니다. 4가 도전하면 이상점이 5·8·9인 세 명이 5를 더 가깝게 보아 3대 2로 5가 이깁니다. 8이 도전하면 이번에는 2·4·5인 세 명이 5를 택해 역시 3대 2입니다. 여기서 읽어야 할 것은 순환을 막아 주는 것이 규칙이 아니라 선호의 모양이라는 점입니다. 같은 다수결인데 어떤 선호 조합에서는 순환하고 어떤 조합에서는 하나의 답을 냅니다. 읽으면 안 되는 것은 정치가 언제나 한가운데로 수렴한다는 결론입니다. 이 계산은 축이 하나이고 봉우리가 하나일 때만 성립하며, 실제 쟁점은 여러 축에 걸쳐 있고 어중간한 타협을 양쪽 어느 쪽보다 나쁘게 보는 사람도 흔합니다."
        />

        <MedianVoterViz />
      </section>

      <section id="boundary" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          불가능하다는 말은 무의미하다는 말이 아닙니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            이 글에서 보인 것은 전부 조건부입니다. 순환은 선호가 충분히 갈릴 때
            생기고, 불가능성은 어떤 선호 조합이 들어와도 조건을 지키라고 요구할 때
            성립하며, 중위가 이긴다는 결론은 축이 하나이고 봉우리가 하나일 때만
            나옵니다.
          </p>

          <p className="leading-7">
            그래서 실제 정치를 볼 때 물어야 할 것이 바뀝니다. 어떤 규칙이 옳은가가
            아니라, 지금 이 사안의 선호 구조가 어떤 모양인가입니다. 봉우리가 하나로
            줄어드는 사안에서는 다수결이 깔끔하게 답을 내고, 그렇지 않은 사안에서는
            순서를 쥔 자리가 조용히 결과를 정합니다.
          </p>

          <p className="leading-7">
            그런데 선호의 모양은 하늘에서 주어지는 것이 아닙니다. 수많은 쟁점이
            몇 개의 축으로 줄어들어 있고, 사람들이 그 축 위에서 자기 위치를 갖게
            되는 데에는 그렇게 만드는 장치가 필요합니다. 그 장치가 무엇인지가 다음
            질문입니다.
          </p>

          <p className="leading-7">
            다음 글{" "}
            <Link to="/politics/elections/parties-and-interest-groups">
              정당과 이익집단
            </Link>
            이 그 자리를 맡습니다. 정당이 왜 생기는지를 선택지를 줄이는 장치로
            보고, 그 줄이기가 무엇을 함께 잘라 내는지가 주제입니다.
          </p>
        </div>
      </section>
    </div>
  );
}

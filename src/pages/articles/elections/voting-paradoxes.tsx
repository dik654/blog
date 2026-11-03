import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import CondorcetCycleViz from "./voting-paradoxes/viz/CondorcetCycleViz";
import MedianVoterViz from "./voting-paradoxes/viz/MedianVoterViz";

/**
 * 규칙을 아무리 잘 골라도 남는 문제가 있습니다
 *
 * 세 사람의 같은 선호표를 순환, 의사일정, 불가능성, 단일정점 복구까지
 * 바꾸지 않고 추적한다. 별도 사례는 규칙 교체의 대가를 확인하는 보충 반례다.
 */
export default function VotingParadoxesArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          세 번 모두 2대 1인데 왜 마지막 답은 없을까요?
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            세 사람이 가안·나안·다안 가운데 하나를 고르는 회의가 있습니다.
            1번은 가&gt;나&gt;다, 2번은 나&gt;다&gt;가, 3번은 다&gt;가&gt;나
            순서로 원합니다. 각 사람의 순서는 모순이 없고, 둘씩 표결하면 매번
            분명한 2대 1이 나옵니다.
          </p>

          <p className="leading-7">
            그런데 가는 나를 이기고, 나는 다를 이기며, 다는 가를 이깁니다. 이긴
            안을 따라가면 마지막 승자 하나가 남지 않고 출발점으로 돌아옵니다.
            <strong>
              개인의 순서가 모두 일관돼도 집단의 순서는 고리를 만들 수 있으므로,
              마지막 승자는 저절로 정해지지 않습니다. 결과는 표결 순서와 선호의
              모양에 따라 달라집니다.
            </strong>
          </p>

          <p className="leading-7">
            이 결과에서 세 가지 질문이 나옵니다. 먼저 답이 하나가 아닐 때 실제
            회의에서 누가 결과를 정하는지 살펴봅니다. 이어 다른 규칙으로 바꾸면
            문제가 사라지는지, 같은 다수결이 어떤 경우에는 안정적으로 끝나는지
            확인합니다. 아래 그림은 처음의 세 표를 그대로 두고 이 질문들을 차례로
            보여 줍니다.
          </p>
        </div>

        <CondorcetCycleViz />

        <ContentBoundary article="voting-paradoxes" />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            이 글에서는 먼저 쌍별 승패표를 보고 결과가 표결 순서에 민감한지
            판단합니다. 이어 선택지를 한 줄에 놓고 어떤 사람의 선호가 안정성을
            깨는지도 찾습니다. 특정 선거제나 후보를 추천하는 글은 아닙니다.
          </p>

          <p className="leading-7">
            먼저 세 번의 2대 1이 왜 하나의 순서가 되지 않는지 계산합니다. 이어서
            표결 순서의 힘, 규칙을 바꿀 때 옮겨 가는 결함, 그 교체가 끝나지 않는
            이유를 봅니다. 마지막에는 같은 사례의 3번 선호만 고쳐 안정되는
            조건을 확인합니다.
          </p>
        </div>
      </section>

      <section id="cycle" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          1. 개인의 순서는 집단으로 자동 복사되지 않습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            1번은 가를 나보다, 나를 다보다 원하므로 가를 다보다도 원합니다.
            2번과 3번도 같은 방식으로 앞뒤가 이어집니다. 이렇게 앞선 두 비교가
            세 번째 비교와 모순되지 않는 성질을{" "}
            <strong>앞뒤가 이어지는 순서(이행성)</strong>
            라고 부릅니다.
          </p>

          <p className="leading-7">
            쌍별 다수결에서는 비교할 때마다 다수를 이루는 두 사람이 바뀝니다.
            가가 나를 이길 때는 1번과 3번, 나가 다를 이길 때는 1번과 2번, 다가
            가를 이길 때는 2번과 3번이 같은 편입니다. 한 사람 안의 일관성을 지켜
            주던 연결고리가 비교 사이에는 없습니다.
          </p>

          <p className="leading-7">
            이 현상을 <strong>다수결의 순환(콩도르세 순환)</strong>이라고
            합니다. 모든 다른 안을 일대일로 이기는 안은{" "}
            <strong>콩도르세 승자</strong>인데, 지금은 셋 중 누구도 그런 승자가
            아닙니다. 계산 착오도, 비합리적인 유권자도 필요하지 않습니다.
          </p>

          <p className="leading-7">
            다만 “승자가 없으면 언제나 고리가 있다”는 말에는 범위가 있습니다.
            모든 안의 쌍이 비교되고, 각 쌍의 승패가 무승부 없이 정해지는 완전한
            승패표에서 성립합니다. 지금처럼 유권자 수가 홀수이고 모두가 엄격한
            순위를 적으면 그 조건이 맞습니다.
          </p>
        </div>

        <AlgorithmBlock
          title="처음의 세 표에서 순환과 표결 순서 효과를 판정하는 절차"
          input={[
            "1번 = 가 > 나 > 다",
            "2번 = 나 > 다 > 가",
            "3번 = 다 > 가 > 나",
          ]}
          steps={[
            {
              code: "가와 나 비교 → 가 지지 {1, 3}, 나 지지 {2} → 가 2대 1 승",
              note: "첫 번째 쌍만 보고 어느 두 사람이 다수를 이루는지 적습니다.",
            },
            {
              code: "나와 다 비교 → 나 지지 {1, 2}, 다 지지 {3} → 나 2대 1 승",
              note: "이번에는 다수를 이루는 사람이 1번과 2번으로 바뀝니다.",
            },
            {
              code: "다와 가 비교 → 다 지지 {2, 3}, 가 지지 {1} → 다 2대 1 승",
              note: "가>나>다>가가 되어 출발점으로 돌아옵니다.",
            },
            {
              code: "모든 상대를 이기는 안 찾기 → 없음",
              note: "모든 상대를 이기는 안이 없으므로 표결 순서를 바꿨을 때 결과가 달라질 수 있습니다.",
            },
            {
              code: "세 가지 표결 순서 실행 → 최종 승자 {다, 가, 나}",
              note: "같은 표를 두고 먼저 붙일 쌍만 바꾸어 최종 승자를 계산합니다.",
            },
          ]}
          output="승패 고리: 가 > 나 > 다 > 가 · 콩도르세 승자: 없음 · 표결 순서별 승자: 다·가·나"
        />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            이제 고리가 있다는 사실보다 더 현실적인 문제가 남습니다. 회의는 결국
            하나를 골라야 합니다. 승자 하나가 정해져 있지 않다면, 누가 먼저 붙일
            두 안을 정하는지가 결과에 영향을 줍니다.
          </p>
        </div>
      </section>

      <section id="agenda" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          2. 순환이 생기면 표결 순서가 승자를 고릅니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            가와 나를 먼저 붙이면 가가 남고, 이어 다와 붙으면 다가 우승합니다.
            나와 다를 먼저 붙이면 마지막에 가가 이깁니다. 가와 다를 먼저 붙이면
            마지막 승자는 나입니다. 표는 한 장도 달라지지 않았습니다.
          </p>

          <p className="leading-7">
            그래서 무엇을 먼저 표결하고, 무엇을 후보 목록에 올리며, 여러 안을 한
            묶음으로 처리할지를 정하는 권한이 결과를 바꿉니다. 이 권한을
            <strong> 의사일정 통제</strong>라고 합니다. 표를 더 얻는 힘이 아니라
            표가 작동할 순서를 고르는 힘입니다.
          </p>

          <p className="leading-7">
            이 힘은 언제나 강한 것이 아닙니다. 모든 상대를 이기는 안이 하나
            있으면 어느 순서로 붙여도 그 안이 남습니다. 의사일정의 힘은 순환이
            있다는 진단과 함께 읽어야 합니다.
          </p>
        </div>

        <TermBreakdown
          title="순서를 쥔다는 말이 가리키는 세 가지 동작"
          items={[
            {
              term: "표결 순서",
              description:
                "먼저 붙일 두 안과 마지막까지 남겨 둘 안을 정합니다. 처음의 세 표에서는 순서만으로 가·나·다 모두를 우승시킬 수 있습니다.",
              example:
                "가와 나를 먼저 붙이고 다를 마지막에 두면 다가 우승합니다.",
              boundary:
                "콩도르세 승자가 있으면 어떤 순서에서도 같은 안이 남으므로 이 힘은 사라집니다.",
            },
            {
              term: "상정 여부",
              description:
                "어떤 안을 표결 후보에 넣을지 정합니다. 빠진 안은 지지자가 많아도 이길 기회가 없습니다.",
              example:
                "고리의 한 안을 빼면 남은 두 안 사이에는 승패 하나만 남습니다.",
              boundary:
                "순환을 해결한 것이 아니라 선택지 집합을 바꾼 것입니다.",
            },
            {
              term: "묶기와 쪼개기",
              description:
                "여러 내용을 한 안으로 묶거나 별도 안으로 나눠 비교 단위를 바꿉니다.",
              example:
                "각각은 과반이 안 되는 두 항목을 한 법안에 묶으면 지지 연합이 달라집니다.",
              boundary:
                "유권자의 선호를 바꾸지 않아도 선택지의 정의를 바꾸므로 새 승패표가 생깁니다.",
            },
          ]}
        />
      </section>

      <section id="other-rules" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          3. 규칙을 바꾸면 결함이 사라지는 대신 자리를 옮깁니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            고리를 피하려면 세 안을 한 번에 점수로 합치거나, 1차에서 일부를
            떨어뜨린 뒤 결선을 치를 수 있습니다. 두 방식 모두 최종 승자를
            내놓습니다. 하지만 답을 내놓는 것과 직관적인 조건을 모두 지키는 것은
            같은 일이 아닙니다.
          </p>

          <p className="leading-7">
            순위를 점수로 바꾸면 아무도 가와 나의 상대 순서를 바꾸지 않았는데
            다의 위치만 달라져 가와 나의 사회적 순서가 뒤집힐 수 있습니다.
            결선에서는 이긴 후보의 지지가 늘었는데 탈락자가 바뀌어 오히려 질 수
            있습니다. 따라서 규칙을 바꿀 때는 무엇을 새로 포기하는지도 함께
            살펴봐야 합니다.
          </p>
        </div>

        <ProgressiveDetail
          title="셋째 안만 옮겼는데 가와 나의 승패가 왜 바뀔까요?"
          preview="점수제는 모든 순위의 위치를 점수로 바꾸므로, 다의 위치도 가와 나의 점수 차이에 들어갑니다."
        >
          <p className="leading-7">
            유권자 다섯 명 가운데 세 명은 가&gt;나&gt;다, 두 명은
            나&gt;다&gt;가라고 하겠습니다. 1위 2점, 2위 1점, 3위 0점을 주면 가는
            6점, 나는 7점이라 나가 이깁니다.
          </p>
          <p className="leading-7">
            뒤의 두 명이 다를 맨 아래로 내려 나&gt;가&gt;다가 되면, 아무도 가와
            나의 상대 순서를 바꾸지 않았는데 가 8점, 나 7점으로 승자가 바뀝니다.
            두 안의 사회적 우열은 사람들이 그 둘을 어떻게 비교하는지만으로
            정해져야 한다는
            <strong> 무관한 대안으로부터의 독립</strong>이 깨진 예입니다.
          </p>
        </ProgressiveDetail>

        <ProgressiveDetail
          title="이긴 후보를 더 좋아했는데도 정말 질 수 있을까요?"
          preview="1위 표가 늘어 1차 탈락자가 바뀌면 결승에서 만나는 상대도 바뀝니다."
        >
          <p className="leading-7">
            100명이 40명 가&gt;나&gt;다, 31명 나&gt;다&gt;가, 29명
            다&gt;가&gt;나로 투표한다고 하겠습니다. 1차에서 다가 탈락하고 그 29명이
            가로 옮겨 가가 69대 31로 이깁니다.
          </p>
          <p className="leading-7">
            이제 나를 1위로 두었던 네 명이 가를 더 좋아하게 되어
            가&gt;나&gt;다로 바꿉니다. 1차는 가 44, 나 27, 다 29가 되어 이번에는
            나가 탈락합니다. 나를 지지하던 27명이 다로 옮겨 다가 56대 44로
            이깁니다. 가의 지지는 늘었지만 결과는 패배로 바뀌었습니다. 이를{" "}
            <strong>단조성 위반</strong>이라고 합니다.
          </p>
        </ProgressiveDetail>

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            이 두 반례는 모든 규칙이 똑같이 나쁘다는 뜻이 아닙니다. 어떤 조건을
            지키고 어떤 조건을 포기할지를 선택해야 한다는 뜻입니다. 그렇다면
            “좋은 규칙”에 기대한 조건을 먼저 정확히 적어야 합니다.
          </p>
        </div>
      </section>

      <section id="conditions" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          4. 집계 규칙에 바라는 다섯 조건을 먼저 펼칩니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            여기서 규칙의 출력은 당선자 이름 하나가 아니라 모든 안을 앞뒤로 세운
            사회의 순서입니다. 그래야 가가 나보다 낫고 나가 다보다 낫다면 가가
            다보다도 낫다는 일관성을 검사할 수 있습니다.
          </p>

          <h3>먼저 입력 범위와 출력 형태를 정합니다</h3>
          <p className="leading-7">
            <strong>선호 제한 없음</strong>은 각 개인의 순서가 일관되기만 하면
            어떤 조합도 입력으로 받을 것을 요구합니다.{" "}
            <strong>사회적 순서</strong>는 어떤 입력에서도 결과가 다시 앞뒤가
            이어지는 완전한 순서여야 한다는 요구입니다. 처음의 세 표는 허용되는
            입력이지만 쌍별 다수결은 고리를 출력하므로 두 번째 요구를 지키지
            못합니다.
          </p>

          <h3>그다음 판단 과정에 세 가지 제한을 겁니다</h3>
          <p className="leading-7">
            <strong>전원일치 존중</strong>은 모두가 가를 나보다 원하면 사회도
            가를 나보다 앞에 두라는 뜻입니다.{" "}
            <strong>두 안만 보고 비교하기</strong>는 가와 나의 사회적 우열을
            정할 때 사람들이 다를 어디에 두었는지 보지 말라는 요구입니다. 앞
            절의 표준 이름으로는 무관한 대안으로부터의 독립입니다.
          </p>

          <p className="leading-7">
            마지막 <strong>한 사람에게 결과를 맡기지 않기</strong>는 어느 한
            사람의 엄격한 선호가 모든 입력과 모든 쌍에서 늘 사회의 선호가 되는
            규칙을 금지합니다. 이것이 비독재 조건입니다. 다섯 조건은 하나씩 보면
            무리해 보이지 않지만, 선택지가 셋 이상이면 전부를 함께 지킬 수
            없습니다.
          </p>

          <p className="leading-7">
            처음의 사례는 이 충돌을 눈앞에 보여 줍니다. 쌍별 다수결은 전원일치,
            두 안만 보고 비교하기, 한 사람에게 맡기지 않기를 지킵니다. 대신 모든
            선호 조합을 받으면 사회적 순서가 고리로 무너집니다. 조건을 다
            적고 나면 어떤 규칙이 이 조건들을 함께 지킬 수 있는지 물을 수
            있습니다.
          </p>
        </div>
      </section>

      <section id="arrow" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          5. 다섯 조건을 모두 지키는 규칙은 존재하지 않습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            선택지가 셋 이상이면 선호 제한 없음, 사회적 순서, 전원일치 존중,
            무관한 대안으로부터의 독립, 비독재를 동시에 만족하는 집계 규칙은
            없습니다. 이것이 <strong>애로우 불가능성 정리</strong>입니다.
          </p>

          <p className="leading-7">
            증명의 중심 생각은 “어떤 집단의 뜻이 다른 사람들의 반대에도 사회의
            판단을 정할 수 있는가”입니다. 전원일치를 지켜야 하므로 처음에는 전체
            유권자 집단이 그런 힘을 가집니다. 그 가운데 더는 줄일 수 없는 최소
            집단을 하나 잡습니다.
          </p>

          <ol className="leading-7">
            <li>최소 집단이 두 명 이상이라고 가정하고 두 묶음으로 나눕니다.</li>
            <li>
              선택지 셋의 순서를 서로 다르게 놓은 입력을 만듭니다. 어떤 입력도
              허용한다는 조건 때문에 이 조합을 시험할 수 있습니다.
            </li>
            <li>
              사회의 순서가 앞뒤로 이어지고 두 안의 판단이 그 둘의 상대 순서에만
              의존하려면, 두 묶음 가운데 하나가 더 작은 결정 집단이 되어야
              합니다.
            </li>
            <li>
              이는 처음 집단이 최소라는 가정과 충돌합니다. 따라서 최소 집단은 한
              명이고, 같은 논리를 모든 안의 쌍으로 옮기면 그 한 명이 독재자가
              됩니다.
            </li>
          </ol>

          <p className="leading-7">
            결국 나머지 네 조건을 유지하면 비독재가 깨집니다. 비독재를 지키려면
            다른 조건 가운데 적어도 하나를 내려놓아야 합니다. 앞 절에서 규칙을
            바꿀 때마다 결함이 다른 곳으로 이동한 까닭이 여기 있습니다.
          </p>
        </div>

        <CitationBlock
          source="Kenneth J. Arrow · A Difficulty in the Concept of Social Welfare · Journal of Political Economy 58(4), 1950, 328~346쪽"
          citeKey={1}
          href="https://doi.org/10.1086/256963"
        >
          원 논문 342쪽은 선택지가 적어도 셋이고 개인이 자유롭게 순서를 정할 수
          있을 때, 요구 조건을 만족하는 사회적 순서는 외부에서 강요되거나 한
          사람의 순서에 맡겨질 수밖에 없다는 &ldquo;Possibility Theorem&rdquo;을
          제시합니다. 이 글의 세 표를 허용하면서 고리 없는 사회적 순서를 항상
          요구하면 같은 충돌이 시작됩니다. 출판 정보와 쪽수는 University of
          Chicago Press에서 확인했고, 논문 내용은 University of Chicago가 공개한
          스캔과 대조했습니다.
        </CitationBlock>

        <CitationBlock
          source="Stanford Encyclopedia of Philosophy · Arrow's Theorem · 2025년 12월 7일 개정"
          citeKey={2}
          href="https://plato.stanford.edu/entries/arrows-theorem/"
        >
          3.1절과 3.2절은 오늘날 널리 쓰는 다섯 조건 U, SO, WP, D, I를 각각
          정의하고, 선택지가 둘보다 많으면 이를 동시에 만족하는 사회후생함수가
          없다고 정리합니다. 원 논문의 표기와 현대의 표준 진술이 다른 부분은 이
          항목의 구분을 따랐습니다.
        </CitationBlock>

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            정리는 민주적 결정이 무의미하다고 말하지 않습니다. 어떤 선호
            조합이든 받아야 한다는 요구까지 포함해 다섯 조건을 동시에 요구할 수
            없다고 말합니다. 입력될 수 있는 선호의 모양을 좁히면 정리의 전제
            하나가 사라지고 다른 결과가 가능해집니다.
          </p>
        </div>
      </section>

      <section id="median-voter" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          6. 처음의 선호 한 줄을 고치면 가운데 안이 승자가 됩니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            처음 사례로 돌아가 보겠습니다. 가-나-다를 왼쪽에서 오른쪽으로 놓으면 1번의
            가&gt;나&gt;다와 2번의 나&gt;다&gt;가는 자기 최고점에서 멀어질수록
            선호가 내려갑니다. 3번의 다&gt;가&gt;나만 바로 옆의 나를 맨 아래에
            둡니다.
          </p>

          <p className="leading-7">
            3번의 순서를 다&gt;나&gt;가로 바꾸면 세 사람 모두 한 봉우리 모양이
            됩니다. 그러면 나는 가를 2대 1로 이기고 다도 2대 1로 이깁니다. 같은
            다수결인데 이제는 표결 순서가 결과를 바꾸지 못합니다.
          </p>
        </div>

        <MedianVoterViz />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            선택지를 한 축에 놓았을 때 자기 최고점에서 멀어질수록 덜 좋아하는
            모양을
            <strong> 단일정점 선호</strong>라고 합니다. 각자의 최고점을 줄
            세웠을 때 가운데에 있는 사람은 왼쪽 안과 붙으면 가운데와 오른쪽
            사람을, 오른쪽 안과 붙으면 가운데와 왼쪽 사람을 자기 편으로
            얻습니다.
          </p>

          <p className="leading-7">
            따라서 가운데 최고점은 어느 쪽의 도전에도 과반을 잃지 않습니다. 이
            결과가 <strong>중위 투표자 정리</strong>입니다. 아래 식은 거리를
            재는 특별한 모형이 아니라, 축의 어느 쪽에 최고점이 있는 사람을 세는
            장부입니다.
          </p>
        </div>

        <ExplainedFormula
          question="한 축의 가운데 최고점은 왜 어느 도전안에도 지지 않을까요?"
          idea="사람 수가 홀수일 때 최고점을 왼쪽부터 세우고 가운데 최고점을 x_m이라 둡니다. 도전안이 왼쪽이면 x_m 이상에 최고점을 둔 사람들은 단일정점 선호 때문에 모두 x_m을 더 좋아합니다. 그 집합은 가운데 사람을 포함해 적어도 (n+1)/2명입니다. 오른쪽 도전은 좌우만 바꾸면 같습니다."
          formula={String.raw`\begin{aligned} x_m &= x_{\left(\frac{n+1}{2}\right)} \\ y<x_m &\Rightarrow \left|\{i:x_i\ge x_m\}\right|\ge\frac{n+1}{2}>\frac n2 \\ y>x_m &\Rightarrow \left|\{i:x_i\le x_m\}\right|\ge\frac{n+1}{2}>\frac n2 \end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned} x_m &= \underbrace{x_{\left(\frac{n+1}{2}\right)}}_{\text{최고점을 줄 세웠을 때 가운데}} \\ y<x_m &\Rightarrow \underbrace{\left|\{i:x_i\ge x_m\}\right|}_{\text{가운데와 그 오른쪽 사람 수}}\ge\frac{n+1}{2}>\frac n2 \\ y>x_m &\Rightarrow \underbrace{\left|\{i:x_i\le x_m\}\right|}_{\text{가운데와 그 왼쪽 사람 수}}\ge\frac{n+1}{2}>\frac n2 \end{aligned}`}
          operations={[
            {
              expression: String.raw`x_{\left(\frac{n+1}{2}\right)}`,
              annotation: [
                "최고점을 축의 왼쪽부터 정렬한 뒤 가운데 순번을 고릅니다.",
                "n이 홀수라서 가운데 순번이 한 사람으로 정해집니다.",
              ],
            },
            {
              expression: String.raw`\left|\{i:x_i\ge x_m\}\right|`,
              annotation: [
                "왼쪽 도전안 y와 x_m을 비교할 때 x_m과 그 오른쪽에 최고점을 둔 사람을 셉니다.",
                "단일정점 선호라면 이 사람들은 y보다 x_m을 더 좋아합니다.",
              ],
            },
            {
              expression: String.raw`\left|\{i:x_i\le x_m\}\right|`,
              annotation: [
                "오른쪽 도전안이면 반대로 x_m과 그 왼쪽에 최고점을 둔 사람을 셉니다.",
                "두 경우 모두 가운데 사람을 포함하므로 수가 절반을 넘습니다.",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`x_i`,
              name: "i번 사람의 최고점",
              description:
                "축 위에서 그 사람이 가장 좋아하는 선택지의 위치입니다.",
            },
            {
              symbol: String.raw`x_m`,
              name: "가운데 최고점",
              description:
                "모든 최고점을 왼쪽부터 세웠을 때 가운데 순번의 위치입니다.",
            },
            {
              symbol: String.raw`y`,
              name: "도전안",
              description: "가운데 최고점과 일대일로 맞붙는 다른 선택지입니다.",
            },
          ]}
          assumptions={[
            "선택지를 하나의 축 위에 놓을 수 있습니다.",
            "모든 사람의 선호가 그 축에서 단일정점입니다.",
            "사람 수가 홀수이고 모두가 자기 순서대로 쌍별 다수결에 참여합니다.",
          ]}
          interpretation="처음 사례를 고친 뒤 n=3이고 가운데 최고점 x_m은 나입니다. 왼쪽의 가가 도전하면 최고점이 나 이상인 2번과 3번, 곧 2명이 나를 골라 2대 1입니다. 오른쪽의 다가 도전하면 최고점이 나 이하인 1번과 2번이 나를 골라 다시 2대 1입니다. 여기서 읽어야 할 결론은 선호의 모양을 제한하면 같은 다수결도 안정된다는 것입니다. 정치가 늘 가운데로 수렴한다거나, 선호 한 줄이 조건을 어기면 반드시 순환한다는 결론은 나오지 않습니다."
        />

        <CitationBlock
          source="Duncan Black · On the Rationale of Group Decision-making · Journal of Political Economy 56(1), 1948, 23~34쪽"
          citeKey={3}
          href="https://doi.org/10.1086/256633"
        >
          원 논문 27~28쪽은 모든 위원의 선호 곡선을 한 축에서 단일정점으로 만들
          수 있고 위원 수 n이 홀수일 때, 가운데 최고점 O((n+1)/2)이 그보다
          낮거나 높은 어떤 안과 붙어도 적어도 (n+1)/2표를 얻는다고 전개합니다.
          이 글에서는 n=3을 넣어 O2에 해당하는 나가 가와 다를 각각 2대 1로
          이기는지 확인했습니다.
        </CitationBlock>

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            이 복구는 애로우 정리와 충돌하지 않습니다. “어떤 선호 조합도
            입력으로 받는다”는 조건을 버리고 단일정점인 조합만 받았기
            때문입니다. 완벽한 규칙을 찾은 것이 아니라, 안정성을 얻는 대신
            허용할 선호의 범위를 좁힌 것입니다.
          </p>
        </div>
      </section>

      <section id="boundary" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          7. 실제 판단에서는 규칙과 선호 구조를 함께 봐야 합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            다수결의 고리는 언제나 생기지 않습니다. 반대로 단일정점 조건을 한
            사람만 어겼다고 언제나 고리가 생기는 것도 아닙니다. 조건이 깨지면
            보장이 사라질 뿐이며, 실제 승패표를 다시 계산해야 합니다. 처음
            사례에서는 그 계산 결과가 고리였습니다.
          </p>

          <p className="leading-7">
            한 축이라는 전제도 강합니다. 세금은 낮게 원하지만 복지는 높게 원하는
            사람처럼 쟁점이 둘 이상이면 모든 선택지를 같은 한 줄에 놓기
            어렵습니다. 이때 “가운데”는 축마다 달라지고, 각 축의 가운데를 합친
            안이 모든 도전을 이긴다는 보장은 없습니다.
          </p>

          <p className="leading-7">
            따라서 실제 제도를 볼 때는 규칙의 이름만 확인해서는 안 됩니다. 먼저
            쌍별 승패에 고리가 있는지와 누가 표결 순서를 정하는지 살펴봐야 합니다.
            그다음 어떤 조건을 포기한 규칙인지, 선호를 한 축의 한 봉우리로 볼
            근거가 있는지 확인해야 합니다.
          </p>

          <p className="leading-7">
            선호의 모양은 저절로 생기지 않습니다. 정당은 많은 쟁점을 몇 묶음으로
            줄이고 후보를 몇 개의 축 위에 세웁니다. 다음 글인{" "}
            <Link to="/politics/elections/parties-and-interest-groups">
              정당과 이익집단
            </Link>
            에서는 정당이 쟁점을 묶고 선택지를 줄이는 과정이 순환을 줄이는 동시에
            무엇을 선택지 밖으로 밀어내는지 살펴봅니다.
          </p>
        </div>

        <ReviewPrompts
          questions={[
            "처음의 세 표에서 가·나·다 중 누구도 최종 승자가 아닌 이유는 무엇입니까? (답: 1절)",
            "같은 표를 그대로 두고 표결 순서만 바꾸면 세 안 모두 우승할 수 있는 이유는 무엇입니까? (답: 2절)",
            "3번의 순서를 다>가>나에서 다>나>가로 고치면 왜 나가 안정된 승자가 됩니까? (답: 6절)",
          ]}
        />
      </section>
    </div>
  );
}

import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import MegakernelDesignTradeoffsViz from "./megakernel-design-tradeoffs/viz/MegakernelDesignTradeoffsViz";

/**
 * Megakernel 은 launch 와 tail 을 지우는 대신 자원 공유 비용을 냅니다
 *
 * 작성 규칙은 docs/coverage-batch-playbook.md 를 따른다.
 * - 제목(h2)은 그 절의 결론 한 문장. 첫 문단은 결론을 다시 말한다(두괄식).
 * - 한 문단 = 한 생각, 260자 이하. 문단 사이는 비워 두고 목록은 본문 안에 쓰지 않는다.
 * - 처음 나오는 용어는 그 자리에서 풀어 쓴다. 수치 예를 최소 한 번 든다.
 */
export default function MegakernelDesignTradeoffsArticle() {
  return (
    <div id="overview" className="space-y-16">
      <section id="problem" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">TODO 결론형 제목: 이 글이 답하는 질문</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">TODO 한 문단 결론. 왜 이 개념이 필요한지, 어떤 문제에서 등장하는지.</p>
          <p>TODO 전체 구조 예고. 이어지는 절이 어떤 순서로 무엇을 보여 주는지.</p>
        </div>
        <MegakernelDesignTradeoffsViz />
        <ContentBoundary article="megakernel-design-tradeoffs" />
      </section>

      <section id="mechanism" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">TODO 핵심 mechanism 을 결론으로 말하는 제목</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>TODO claim → 이유 → 작은 수치 예 → 한계 → 다음 질문.</p>
        </div>
        <ExplainedFormula
          question="TODO 이 식이 답하는 질문"
          idea="TODO 왜 이런 형태인지"
          formula={String.raw`TODO`}
          annotatedFormula={String.raw`\underbrace{TODO}_{\text{역할}}`}
          operations={[{ expression: String.raw`TODO`, annotation: ["식의 실제 기호를 써서", "무엇을 결합·누적·정규화하는지"] }]}
          terms={[{ symbol: "TODO", name: "이름", description: "역할" }]}
          assumptions={["성립 전제"]}
          interpretation="식에서 읽어야 할 결과와 읽으면 안 되는 과도한 결론"
        />
      </section>

      <section id="procedure" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">TODO 절차가 있는 개념이면 pseudocode 로 닫는 제목</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>TODO</p>
        </div>
        <AlgorithmBlock
          title="TODO 절차 이름"
          input={["TODO 입력"]}
          steps={[{ code: "TODO 단계", note: "왜 이 단계가 필요한지" }]}
          output="TODO 출력"
        />
      </section>

      <section id="boundary" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">TODO 한계·비교·선택 기준을 결론으로 말하는 제목</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>TODO</p>
        </div>
        <TermBreakdown
          title="TODO 이미 설명한 것을 비교·참조용으로 정리"
          items={[{ term: "TODO", description: "설명", example: "예", boundary: "경계" }]}
        />
        <ProgressiveDetail title="TODO 독자가 열어서 답을 얻을 질문" preview="TODO 접힌 상태에서도 읽히는 결론 한 줄">
          <p>TODO 논문별 실험 조건·구현 차이처럼 첫 독해를 끊는 세부</p>
        </ProgressiveDetail>
      </section>

      <section id="paper-todo" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">TODO 근거 논문이 무엇을 보였고 무엇은 아닌지</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>TODO 논문이 해결한 문제 → 핵심 아이디어 → 전제 → 실험 범위 → 일반화하면 안 되는 결론.</p>
        </div>
        <CitationBlock source="TODO 저자 · 제목 (venue year)" citeKey={1} href="https://TODO">
          TODO 한 문단 요약과 경계
        </CitationBlock>
        <p className="prose prose-neutral max-w-none dark:prose-invert">
          다음 글: <Link to="/gpu/TODO">TODO</Link>
        </p>
      </section>
    </div>
  );
}

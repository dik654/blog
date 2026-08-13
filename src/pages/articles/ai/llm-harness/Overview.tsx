import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import HistoryViz from "./viz/HistoryViz";
import OverviewViz from "./viz/OverviewViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        좋은 모델만으로는 실제 작업이 끝나지 않는다
      </h2>
      <div className="not-prose mb-8">
        <OverviewViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          LLM은 다음 행동을 제안할 수 있지만, 어떤 파일이 정본인지, 어느 API를
          호출해도 되는지, 작업이 정말 끝났는지는 저절로 알지 못한다. 데모에서는
          좋은 답변 한 번이면 충분하지만, 실제 제품에서는 실행 도중 세션이
          바뀌고 tool이 실패하며 외부 상태까지 변한다. 이 간극을 메우는 것이
          <strong> LLM 하네스</strong>다.
        </p>
        <p className="leading-7">
          하네스는 prompt wrapper나 특정 agent framework의 이름이 아니라,
          모델을 둘러싼 <strong>실행 계약과 피드백 시스템</strong>을 가리킨다.
          목표와 완료 조건, 필요한 context를 찾는 경로, tool과 실제 권한,
          진행 상태를 남길 artifact, 검증과 복구 규칙이 모두 여기에 들어간다.
          모델은 가능한 다음 행동을 제안하고, 하네스는 그 행동을 실행해도 되는지
          판정한 뒤 관찰 가능한 결과를 다시 모델에 돌려준다.
        </p>
        <ContentBoundary article="llm-harness" />

        <h3 className="mb-3 mt-6 text-xl font-semibold">
          왜 모델이 좋아져도 하네스가 남는가
        </h3>
        <p className="leading-7">
          모델 능력이 올라가면 세부 절차와 예외 분기를 덜 지시할 수 있다. 그러나
          파일·API·사람에게 영향을 주는 실행에는 여전히 권한, observability,
          종료 조건과 책임 경계가 필요하다. 좋은 하네스는 모델의 추론을 대신하는
          규칙 더미가 아니라, 모델이 탐색해도 되는 영역과 시스템이 반드시
          강제해야 하는 invariant를 나눈다. 따라서 모델 교체로 줄어드는 부분은
          대개 과도한 prompt scaffolding이고, 권한 검사·artifact 보존·검증처럼
          시스템 책임에 속하는 부분은 남는다.
        </p>

        <h3 className="mb-3 mt-6 text-xl font-semibold">
          용어의 역사는 직선 계보가 아니다
        </h3>
        <p className="leading-7">
          2023년 Auto-GPT류 실험에서 이미 목표를 주고 tool을 반복 호출하는
          형태가 등장했지만, 당시 모델은 긴 실행 경로에서 쉽게 방향을 잃었다.
          그래서 개발자가 정해진 경로를 짜는 workflow가 먼저 실용화됐고,
          모델이 강해진 뒤에는 ReAct형 agent loop가 그 분기 일부를 흡수했다.
          이후 작업 시간이 길어지면서 context engineering, 검증, checkpoint가
          중요해졌고 이 넓은 바깥층을 harness engineering이라고 부르는 사례가
          늘었다.
        </p>
      </div>

      <div className="not-prose mt-8">
        <HistoryViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          이 변화는 프롬프트→컨텍스트→하네스→루프→그래프가 이전 개념을 차례로
          대체했다는 뜻이 아니다. 서로 다른 실패를 강조하는 설계 어휘가 겹쳐
          쓰이기 시작했다는 쪽이 정확하다. Anthropic은 predefined code path를
          따르는 <em>workflow</em>와 모델이 다음 과정과 tool을 고르는
          <em> agent</em>를 구분하지만, 실제 시스템은 둘을 섞는다. 예를 들어 조사
          순서는 모델이 정하더라도 배포·삭제·결제 전이는 정해진 checkpoint와
          사람 승인을 통과하게 만들 수 있다.
        </p>
        <div id="paper-anthropic-effective-agents" className="scroll-mt-24">
          <CitationBlock
            source="Anthropic — Building effective agents"
            citeKey={1}
            href="https://www.anthropic.com/engineering/building-effective-agents"
          >
            미리 정의한 code path를 따르는 workflow와 model이 다음 단계와 tool을
            고르는 agent를 구분하고, 단순한 구조에서 관측된 필요에 따라
            routing·parallelization·evaluator를 추가하는 기준을 설명합니다. 이는
            모든 agent architecture의 표준 분류나 보편 성능 보장은 아닙니다.
          </CitationBlock>
        </div>
      </div>
    </section>
  );
}

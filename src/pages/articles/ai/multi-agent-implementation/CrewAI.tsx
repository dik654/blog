import CrewAIViz from './viz/CrewAIViz';

export default function CrewAI() {
  return (
    <section id="crewai" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">CrewAI로 역할 기반 팀</h2>
      <div className="not-prose mb-8"><CrewAIViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">Agent 정의 — role + goal + tools</h3>
        <p className="leading-7">
          CrewAI의 <code>Agent</code>는 세 가지로 정의된다: <strong>역할(role)</strong>, <strong>목표(goal)</strong>, <strong>도구(tools)</strong>.<br />
          <code>role="품질 분석가"</code>는 시스템 프롬프트에 삽입되어 에이전트의 행동 방식을 결정한다.<br />
          <code>goal="불량 원인을 파악하여 보고서를 작성"</code>은 에이전트가 달성해야 할 최종 목표.<br />
          <code>tools=[VectorDBTool, PandasTool]</code>은 에이전트가 사용할 수 있는 도구 목록.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">Task 정의 — description + expected_output</h3>
        <p className="leading-7">
          <code>Task</code>는 에이전트에게 부여하는 구체적 작업 단위.<br />
          <code>description</code>: "센서 데이터에서 이상 패턴을 분석하라"처럼 구체적으로 명시.<br />
          <code>expected_output</code>: "이상 유형 + 심각도 등급"처럼 출력 형식을 정의하면 에이전트가 형식을 맞춰 응답한다.<br />
          각 Task는 하나의 Agent에 할당되며, 이전 Task의 결과를 컨텍스트로 받을 수 있다.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">Crew 구성 — 팀 + 프로세스</h3>
        <p className="leading-7">
          <code>Crew(agents=[...], tasks=[...], process=Process.sequential)</code>로 팀을 구성한다.<br />
          <code>crew.kickoff()</code> 호출 한 번으로 전체 워크플로우가 실행된다.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">Sequential vs Hierarchical Process</h3>
        <p className="leading-7">
          <strong>Sequential</strong>: Task 1 → Task 2 → Task 3 순서대로 실행. 이전 결과가 자동으로 다음 Task의 컨텍스트가 된다.<br />
          <strong>Hierarchical</strong>: 매니저 에이전트가 Task를 동적으로 분배하고 결과를 취합한다.<br />
          제조 현장에서는 <strong>Sequential이 권장</strong> — 감사 추적(audit trail)이 명확하고, 각 단계의 결과를 검증할 수 있다.
        </p>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>CrewAI를 선택하는 경우</strong> — 빠른 프로토타이핑이 목표일 때.<br />
          Agent/Task/Crew 3개 개념만 이해하면 30분 안에 멀티 에이전트 시스템을 구축할 수 있다.<br />
          LangGraph 대비: 세밀한 상태 제어는 어렵지만, 러닝 커브가 매우 낮다.
        </p>
      </div>
    </section>
  );
}

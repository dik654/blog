import AgentReActViz from './viz/AgentReActViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">AI 에이전트 프레임워크 개요</h2>
      <div className="not-prose mb-8"><AgentReActViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>AI 에이전트</strong> — LLM을 핵심 추론 엔진으로 사용하면서 <strong>도구 호출, 메모리 관리, 계획 수립</strong>을 자율적으로 수행하는 시스템<br />
          단순 챗봇과 달리 복합적인 작업을 여러 단계에 걸쳐 스스로 분해하고 실행
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">ReAct 패턴</h3>
        <p>
          <strong>ReAct</strong>(Reasoning + Acting) — 가장 널리 쓰이는 에이전트 패턴<br />
          LLM이 <code>Think → Action → Observation</code> 루프를 반복하며 문제 해결<br />
          각 단계에서 추론(Thought)을 명시적으로 생성하여 행동의 근거를 남김
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">에이전트 구성 요소</h3>
        <ul>
          <li><strong>LLM</strong> &mdash; 추론, 계획, 도구 선택의 핵심 엔진</li>
          <li><strong>Memory</strong> &mdash; 단기(대화) + 장기(벡터 DB) 기억</li>
          <li><strong>Tools</strong> &mdash; 검색, 코드 실행, API 호출 등</li>
          <li><strong>Planning</strong> &mdash; 작업 분해와 실행 순서 결정</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">주요 패턴 비교</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">패턴</th>
                <th className="border border-border px-3 py-2 text-left">특징</th>
                <th className="border border-border px-3 py-2 text-left">적용</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2 font-medium">ReAct</td>
                <td className="border border-border px-3 py-2">Think-Act-Observe 루프</td>
                <td className="border border-border px-3 py-2">범용 도구 사용</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-medium">Plan-and-Execute</td>
                <td className="border border-border px-3 py-2">계획 수립 후 순차 실행</td>
                <td className="border border-border px-3 py-2">복잡한 다단계 작업</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-medium">Reflection</td>
                <td className="border border-border px-3 py-2">자기 평가 + 수정</td>
                <td className="border border-border px-3 py-2">코드 생성, 글쓰기</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

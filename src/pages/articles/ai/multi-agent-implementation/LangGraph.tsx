import LangGraphViz from './viz/LangGraphViz';

export default function LangGraph() {
  return (
    <section id="langgraph" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">LangGraph로 상태 기반 에이전트</h2>
      <div className="not-prose mb-8"><LangGraphViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">StateGraph — 공유 상태 중심 설계</h3>
        <p className="leading-7">
          LangGraph의 핵심은 <strong>TypedDict로 정의한 공유 상태</strong>가 그래프의 모든 노드를 관통하는 것.<br />
          <code>messages</code>(대화 이력), <code>current_agent</code>(현재 활성 노드), <code>result</code>(최종 출력)가 기본 필드.<br />
          각 노드 함수는 상태를 입력받아 수정된 상태를 반환한다. 불변(immutable)이 아니라 누적(accumulate) 방식.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">노드와 엣지</h3>
        <p className="leading-7">
          <code>graph.add_node("분석", analyze_fn)</code>로 노드를 등록하고,
          <code>graph.add_edge("분석", "판단")</code>으로 연결한다.<br />
          <code>add_conditional_edges</code>로 조건부 라우팅을 설정: 상태의 특정 필드 값에 따라 다음 노드가 달라진다.<br />
          예: <code>need_search</code> 플래그가 True이면 "검색" 노드로, False이면 "분석" 노드로 라우팅.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">체크포인트와 Human-in-the-loop</h3>
        <p className="leading-7">
          <code>SqliteSaver</code> 또는 <code>MemorySaver</code>를 연결하면 매 노드 실행 후 상태가 자동 저장된다.<br />
          오류 발생 시 마지막 체크포인트에서 재개할 수 있어, 긴 파이프라인의 중간 실패에 강하다.<br />
          Human-in-the-loop: 특정 노드 앞에 "승인 대기" 상태를 삽입. 운영자가 확인 후 다음 단계로 진행.
        </p>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>LangGraph를 선택하는 경우</strong> — 복잡한 분기/루프가 있고, 각 단계의 상태를 정밀하게 제어해야 할 때.<br />
          제조 예: "센서 이상 탐지 → 매뉴얼 검색 → 분석 → (불충분하면 다시 검색) → 최종 판단" 같은 루프형 워크플로우.
        </p>
      </div>
    </section>
  );
}

import MultiAgentViz from './viz/MultiAgentViz';
import MultiAgentDetailViz from './viz/MultiAgentDetailViz';

export default function MultiAgent() {
  return (
    <section id="multi-agent" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">멀티에이전트 패턴</h2>
      <div className="not-prose mb-8"><MultiAgentViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Multi-Agent: <strong>여러 AI agent가 협력</strong>해 복잡한 task 해결.<br />
          역할 분담 (역할 기반), 의사소통 (메시지 기반), 계층 구조 (관리자-작업자).<br />
          AutoGen, CrewAI, LangGraph가 대표 프레임워크.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">Multi-Agent Architectures</h3>
        <div className="not-prose mb-6"><MultiAgentDetailViz /></div>
        <p className="leading-7">
          Multi-Agent: <strong>role-based, debater, hierarchical, sequential, swarm</strong>.<br />
          AutoGen, CrewAI, LangGraph 대표 프레임워크.<br />
          coordination cost vs specialization benefit trade-off.
        </p>
      </div>
    </section>
  );
}

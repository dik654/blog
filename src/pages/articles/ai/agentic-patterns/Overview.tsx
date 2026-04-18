import OverviewViz from './viz/OverviewViz';
import OverviewDetailViz from './viz/OverviewDetailViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">에이전트란 무엇인가</h2>
      <div className="not-prose mb-8"><OverviewViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          AI Agent — <strong>자율적으로 task 분해 + tool 사용 + iterative 실행</strong>하는 LLM 기반 시스템.<br />
          2022-2023 AutoGPT, BabyAGI 붐 → 2024 production-grade agents.<br />
          Claude Code, Cursor, Devin 등이 대표 사례.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">Agent vs Chatbot 차이</h3>
        <div className="not-prose mb-6"><OverviewDetailViz /></div>
        <p className="leading-7">
          Agent = <strong>LLM + tools + memory + planning + iteration</strong>.<br />
          ReAct, Plan-Execute, Reflection, Multi-agent 4가지 주요 패턴.<br />
          Claude Code, Cursor가 production agent 대표.
        </p>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>왜 "agent"가 중요한가</strong> — LLM의 한계 극복.<br />
          LLM alone: text in/out, hallucinations, no action.<br />
          Agent: tools 사용으로 현실 행동 + verification + multi-step reasoning.<br />
          2024-2025: "agentic AI"가 major AI 트렌드.
        </p>
      </div>
    </section>
  );
}

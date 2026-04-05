import OverviewViz from './viz/OverviewViz';

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
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Chatbot vs Agent:

// Chatbot (전통적 LLM):
// - input → output
// - single turn (or short multi-turn)
// - no tools (text only)
// - no action on world
// - stateless (mostly)
// - reactive

// Agent (LLM with tools):
// - task → plan → execute → observe → iterate
// - multi-step reasoning
// - tool use (calculator, search, code, ...)
// - acts on external systems
// - stateful (memory, context)
// - proactive

// Agent 핵심 구성:
// 1. LLM (brain)
// 2. Tools (hands)
// 3. Memory (context)
// 4. Planning (strategy)
// 5. Feedback (observation)

// Agent loop:
// while not task_done:
//     thought = llm.think(task, history)
//     action = llm.choose_action(thought)
//     result = execute(action)
//     history.append((thought, action, result))
//
// return final_answer

// Agent frameworks:
// - LangChain (2022)
// - LlamaIndex
// - AutoGen (Microsoft)
// - CrewAI
// - Semantic Kernel
// - ADK (Claude Agent SDK)

// Agent types:
// 1. ReAct: Reasoning + Acting
// 2. Plan-and-Execute: plan first, then act
// 3. Reflection: self-critique + retry
// 4. Multi-agent: collaborative
// 5. Tool-using: API/function calling

// Production agents (2024):
// - Claude Code (coding)
// - Cursor Composer (coding)
// - Devin (coding)
// - MultiOn (web browsing)
// - Rabbit R1 (device control)
// - Adept (general)

// Benefits:
// - complex task automation
// - reduced human effort
// - consistent execution
// - scalable

// Challenges:
// - hallucinations in planning
// - tool misuse
// - infinite loops
// - cost (many LLM calls)
// - safety (autonomous actions)`}
        </pre>
        <p className="leading-7">
          Agent = <strong>LLM + tools + memory + planning + iteration</strong>.<br />
          ReAct, Plan-Execute, Reflection, Multi-agent 4가지 주요 패턴.<br />
          Claude Code, Cursor가 production agent 대표.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 "agent"가 중요한가</strong> — LLM의 한계 극복.<br />
          LLM alone: text in/out, hallucinations, no action.<br />
          Agent: tools 사용으로 현실 행동 + verification + multi-step reasoning.<br />
          2024-2025: "agentic AI"가 major AI 트렌드.
        </p>
      </div>
    </section>
  );
}

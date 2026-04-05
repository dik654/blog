import ReActViz from './viz/ReActViz';

export default function ReAct() {
  return (
    <section id="react" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ReAct 패턴</h2>
      <div className="not-prose mb-8"><ReActViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          ReAct (Yao et al., ICLR 2023) — <strong>Reasoning + Acting 결합 패턴</strong>.<br />
          LLM이 thought + action 번갈아 생성 → tool 호출 → observation → 반복.<br />
          현대 agent framework의 baseline.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">ReAct 프롬프트 구조</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// ReAct Pattern (Reason + Act):

// Prompt template:
// """
// You have access to these tools:
// - search(query): web search
// - calculator(expr): math
// - read_file(path): read file
//
// Use this format:
// Thought: [your reasoning]
// Action: [tool_name(args)]
// Observation: [tool output]
// ... (repeat as needed)
// Final Answer: [answer]
//
// Task: {user_query}
// """

// Example execution:
//
// User: "What's the population of Seoul in 2024?"
//
// Thought: I need to search for Seoul's 2024 population.
// Action: search("Seoul population 2024")
// Observation: Seoul population was 9.6 million in 2024.
//
// Thought: I have the answer.
// Final Answer: Seoul's population in 2024 is 9.6 million.

// Key insight:
// - reasoning (thought) guides action
// - action gives concrete observation
// - observation updates next reasoning
// - iterative refinement

// vs Pure Chain-of-Thought (CoT):
// CoT: thoughts only, no external info
// ReAct: thoughts + tool calls + observations

// vs Pure Action:
// Action only: no reasoning explanation
// ReAct: explicit planning before each action

// Benefits:
// - transparent reasoning
// - grounded in real data
// - error recovery (wrong tool → retry)
// - interpretable

// Limitations:
// - long token count (verbose)
// - can get stuck in loops
// - requires good prompting

// Modern implementations:
// - LangChain AgentExecutor
// - Claude Code (internal)
// - AutoGPT (variant)
// - OpenAI function calling

// Variants:
// - Few-shot ReAct (with examples)
// - Zero-shot ReAct (no examples)
// - Self-Ask (question decomposition)
// - ReWOO (separate planner)

// Cost considerations:
// - multiple LLM calls per task
// - token count grows with iterations
// - balance: depth vs cost`}
        </pre>
        <p className="leading-7">
          ReAct: <strong>Thought → Action → Observation → 반복</strong>.<br />
          Yao et al. 2023, most agent frameworks의 기반.<br />
          grounded reasoning + error recovery.
        </p>
      </div>
    </section>
  );
}

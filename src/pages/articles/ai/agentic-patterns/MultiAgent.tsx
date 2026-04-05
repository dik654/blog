import MultiAgentViz from './viz/MultiAgentViz';

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
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Multi-Agent Architectures:

// 1. Role-based Teams:
// - Manager, Researcher, Coder, Tester
// - 각자 전문 영역
// - 역할별 prompt 다름
// - 협력하여 task 수행
//
// 예: CrewAI team
// Manager: plans work
// Researcher: gathers info
// Coder: writes code
// Tester: validates output

// 2. Debater Pattern:
// - Pro agent: 찬성 의견
// - Con agent: 반대 의견
// - Judge agent: 최종 결정
// - adversarial 검증
//
// 장점: bias 감소, 철저한 분석

// 3. Expert Committee:
// - domain experts (각자 전문 분야)
// - 의견 aggregation
// - voting or consensus
// - diverse perspectives

// 4. Hierarchical (Manager-Worker):
// - top-level planner
// - sub-agents for subtasks
// - result aggregation
// - scalable

// 5. Sequential Pipeline:
// - agent A → agent B → agent C
// - 각 stage 전문화
// - output of one = input of next
// - assembly line

// 6. Swarm/Mesh:
// - peer-to-peer
// - no central coordinator
// - emergent behavior
// - autonomous collaboration

// Communication patterns:

// Message passing:
// agent_a.send(message, agent_b)
// agent_b.receive() → respond

// Shared memory:
// shared_state.update(key, value)
// agents read/write shared context

// Blackboard:
// - central knowledge base
// - agents contribute
// - supervisor orchestrates

// Frameworks:

// AutoGen (Microsoft):
// - agent roles via prompts
// - chat-based interaction
// - code execution
// - human-in-the-loop

// CrewAI:
// - crews of agents
// - task assignment
// - hierarchical structure
// - tools per agent

// LangGraph:
// - state machines
// - nodes = agents
// - edges = transitions
// - explicit control flow

// Challenges:
// - coordination overhead
// - infinite loops
// - token cost (N agents × iterations)
// - role confusion
// - message ambiguity

// Use cases:
// ✓ Code generation + review
// ✓ Research + writing
// ✓ Debate + synthesis
// ✓ Complex workflows
// ✓ Parallel exploration

// 2024 trends:
// - OpenAI Swarm
// - Anthropic Claude Teams
// - Microsoft Magentic-One
// - increasingly production-ready`}
        </pre>
        <p className="leading-7">
          Multi-Agent: <strong>role-based, debater, hierarchical, sequential, swarm</strong>.<br />
          AutoGen, CrewAI, LangGraph 대표 프레임워크.<br />
          coordination cost vs specialization benefit trade-off.
        </p>
      </div>
    </section>
  );
}

import CodePanel from '@/components/ui/code-panel';
import FrameworkArchViz from './viz/FrameworkArchViz';

const lcelCode = `from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

# LCEL 파이프라인 (선언적 체이닝)
prompt = ChatPromptTemplate.from_template(
    "다음 주제를 요약해줘: {topic}"
)

chain = prompt | ChatOpenAI(model="gpt-4") | StrOutputParser()
result = chain.invoke({"topic": "양자 컴퓨팅"})

# Agent 구성
from langchain.agents import create_tool_calling_agent
from langchain_community.tools import TavilySearchResults

tools = [TavilySearchResults(max_results=3)]
agent = create_tool_calling_agent(llm, prompt, tools)`;

const annotations = [
  { lines: [1, 3] as [number, number], color: 'sky' as const, note: '핵심 모듈 임포트' },
  { lines: [6, 10] as [number, number], color: 'emerald' as const, note: 'LCEL: | 연산자로 체인 구성' },
  { lines: [15, 20] as [number, number], color: 'amber' as const, note: 'Agent: LLM + Tools 결합' },
];

export default function LangChain() {
  return (
    <section id="langchain" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">LangChain 심층 분석</h2>
      <div className="not-prose mb-8"><FrameworkArchViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-2 mb-3">LCEL (LangChain Expression Language)</h3>
        <p>
          <strong>LCEL</strong> — LangChain v0.1+의 핵심<br />
          <code>|</code> 파이프 연산자로 프롬프트, LLM, 파서를 선언적으로 체이닝<br />
          스트리밍, 배치, 비동기 실행이 자동 지원
        </p>
        <CodePanel title="LCEL 파이프라인 & Agent 구성" code={lcelCode} annotations={annotations} />

        <h3 className="text-xl font-semibold mt-6 mb-3">Memory 패턴</h3>
        <ul>
          <li><strong>ConversationBufferMemory</strong> &mdash; 전체 대화 저장 (짧은 대화)</li>
          <li><strong>ConversationSummaryMemory</strong> &mdash; LLM이 요약 생성 (긴 대화)</li>
          <li><strong>VectorStoreMemory</strong> &mdash; 임베딩 기반 관련 기억 검색</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">LangGraph</h3>
        <p>
          LangChain 팀의 <strong>LangGraph</strong> — 에이전트를 상태 그래프(State Graph)로 모델링<br />
          노드는 함수, 엣지는 조건부 라우팅<br />
          사이클 지원으로 복잡한 멀티-에이전트 워크플로우 구현 가능
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">LangGraph 상세 구조</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// LangGraph 개념
//
// State Graph:
//   - Nodes: 함수 (LLM call, tool use, ...)
//   - Edges: 조건부 라우팅
//   - State: TypedDict, 각 노드 간 전달
//
// 예시 (ReAct agent):
from typing import TypedDict, Annotated
from langgraph.graph import StateGraph, END
from langchain_core.messages import BaseMessage

class AgentState(TypedDict):
    messages: Annotated[list[BaseMessage], add_messages]

def agent_node(state: AgentState):
    response = llm.invoke(state["messages"])
    return {"messages": [response]}

def tool_node(state: AgentState):
    last_msg = state["messages"][-1]
    tool_calls = last_msg.tool_calls
    results = [execute_tool(tc) for tc in tool_calls]
    return {"messages": results}

def should_continue(state: AgentState):
    last_msg = state["messages"][-1]
    if last_msg.tool_calls:
        return "tools"
    return "end"

workflow = StateGraph(AgentState)
workflow.add_node("agent", agent_node)
workflow.add_node("tools", tool_node)
workflow.set_entry_point("agent")
workflow.add_conditional_edges(
    "agent",
    should_continue,
    {"tools": "tools", "end": END}
)
workflow.add_edge("tools", "agent")  # 사이클!
app = workflow.compile()

// 고급 기능:
//   - Checkpointing (대화 저장/복원)
//   - Human-in-the-loop (인간 승인 단계)
//   - Streaming (노드별 중간 결과)
//   - Parallel execution
//   - Time travel debugging`}
        </pre>
      </div>
    </section>
  );
}

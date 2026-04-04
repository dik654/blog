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
      </div>
    </section>
  );
}

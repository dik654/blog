import FrameworkArchViz from './viz/FrameworkArchViz';
import LangGraphDetailViz from './viz/LangGraphDetailViz';

const pipelineSteps = [
  {
    title: 'Prompt Template',
    color: '#0ea5e9',
    code: 'ChatPromptTemplate.from_template("요약해줘: {topic}")',
    desc: '변수 슬롯({topic})을 포함한 템플릿 — invoke 시 자동 치환',
  },
  {
    title: 'LLM 호출',
    color: '#10b981',
    code: 'ChatOpenAI(model="gpt-4")',
    desc: '프롬프트를 받아 LLM API 호출 — 스트리밍·배치·비동기 자동 지원',
  },
  {
    title: 'Output Parser',
    color: '#f59e0b',
    code: 'StrOutputParser()',
    desc: 'AIMessage → 순수 문자열 변환 — JSON 파서 등으로 교체 가능',
  },
  {
    title: 'Chain 실행',
    color: '#8b5cf6',
    code: 'chain = prompt | llm | parser',
    desc: '| 연산자(__or__)로 Runnable을 선언적 체이닝 — 각 단계 입출력 자동 연결',
  },
  {
    title: 'Agent 구성',
    color: '#ef4444',
    code: 'create_tool_calling_agent(llm, prompt, tools)',
    desc: 'LLM + Tools 결합 — 도구 호출 결과를 다시 LLM에 피드백하는 루프',
  },
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
        <div className="not-prose grid gap-3 sm:grid-cols-2 lg:grid-cols-3 my-4">
          {pipelineSteps.map((s) => (
            <div
              key={s.title}
              className="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-4 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="inline-block w-3 h-3 rounded-full"
                  style={{ backgroundColor: s.color }}
                />
                <span className="font-semibold text-sm">{s.title}</span>
              </div>
              <code className="block text-xs bg-neutral-100 dark:bg-neutral-800 rounded px-2 py-1 mb-2 break-all">
                {s.code}
              </code>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>

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
        <div className="not-prose mb-6"><LangGraphDetailViz /></div>
      </div>
    </section>
  );
}

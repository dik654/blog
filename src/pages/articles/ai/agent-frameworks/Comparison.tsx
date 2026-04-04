const FRAMEWORKS = [
  {
    name: 'LangChain', color: '#10b981',
    focus: '범용 LLM 앱 프레임워크',
    strengths: 'LCEL 파이프라인, 풍부한 통합(700+ integrations), LangGraph로 복잡한 워크플로우',
    weakness: '추상화 레이어 과다, 디버깅 어려움, 버전 변경 잦음',
    useCase: '프로토타이핑, RAG, 범용 챗봇',
  },
  {
    name: 'LlamaIndex', color: '#6366f1',
    focus: 'RAG 특화 데이터 프레임워크',
    strengths: '문서 인덱싱/검색 최적화, 구조화된 데이터 쿼리, 다양한 데이터 커넥터',
    weakness: 'Agent 기능 상대적으로 약함, LangChain 대비 생태계 작음',
    useCase: '문서 Q&A, 지식 베이스, 구조화 데이터 분석',
  },
  {
    name: 'CrewAI', color: '#f59e0b',
    focus: '멀티 에이전트 협업',
    strengths: '역할 기반 에이전트, 자동 작업 위임, 간단한 API',
    weakness: '단일 에이전트 대비 비용 높음, 디버깅 복잡',
    useCase: '리서치 팀, 콘텐츠 파이프라인, 복합 분석',
  },
  {
    name: 'AutoGen', color: '#ef4444',
    focus: 'MS의 멀티 에이전트 대화',
    strengths: '에이전트 간 대화 기반 협업, 코드 실행 내장, Human-in-the-loop',
    weakness: 'API 변경 빈번(v0.4 대폭 리팩토링), 학습 곡선',
    useCase: '코드 생성, 수학 문제, 연구 자동화',
  },
];

export default function Comparison() {
  return (
    <section id="comparison" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">프레임워크 비교</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          각 프레임워크는 고유한 설계 철학을 보유<br />
          프로젝트 요구사항에 맞는 선택이 중요
        </p>
      </div>
      <div className="not-prose space-y-4">
        {FRAMEWORKS.map((f) => (
          <div key={f.name} className="rounded-xl border p-5"
            style={{ borderColor: f.color + '30', background: f.color + '06' }}>
            <div className="flex items-baseline gap-3 mb-3">
              <span className="font-bold text-base" style={{ color: f.color }}>{f.name}</span>
              <span className="text-xs text-muted-foreground">{f.focus}</span>
            </div>
            <div className="grid gap-2 text-sm">
              <div className="flex gap-2">
                <span className="text-emerald-400 flex-shrink-0 w-12">강점</span>
                <span className="text-foreground/70">{f.strengths}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-rose-400 flex-shrink-0 w-12">약점</span>
                <span className="text-foreground/70">{f.weakness}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-sky-400 flex-shrink-0 w-12">적합</span>
                <span className="text-foreground/70">{f.useCase}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

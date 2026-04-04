import ContextOverviewViz from './viz/ContextOverviewViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">컨텍스트 엔지니어링이란</h2>
      <div className="not-prose mb-8"><ContextOverviewViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>컨텍스트 엔지니어링</strong> — LLM에게 전달되는 모든 정보를 설계하고 최적화하는 기술<br />
          프롬프트 한 줄이 아니라, 시스템 프롬프트 + RAG + 도구 결과 + 히스토리 + 메모리를 합산한 전체 입력이 성능을 결정
        </p>
        <p>
          모델을 GPT-4에서 Claude로 바꾸는 것보다, 같은 모델에 더 나은 컨텍스트를 주는 편이 효과적<br />
          컨텍스트 = LLM이 "읽는" 모든 토큰의 합
        </p>
      </div>
    </section>
  );
}

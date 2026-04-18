import GenerationViz from './viz/GenerationViz';

export default function Generation() {
  return (
    <section id="generation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">생성 &amp; 프롬프트 설계</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          검색 결과(context)를 LLM에 주입하고 응답을 생성 — 프롬프트 설계가 답변 품질을 결정<br />
          같은 context로도 프롬프트에 따라 환각 여부와 출처 인용 여부가 달라진다
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">RAG 프롬프트 템플릿</h3>
        <p>핵심 요소:</p>
        <ul>
          <li><strong>시스템 지침</strong> — "주어진 컨텍스트에서만 답변하라, 모르면 모른다고 답하라"</li>
          <li><strong>Context 블록</strong> — 검색된 청크를 명확한 구분자로 감싼다</li>
          <li><strong>출처 표시 요청</strong> — "답변 끝에 참조한 청크 번호를 제시하라"</li>
          <li><strong>사용자 질문</strong> — 마지막에 실제 질의</li>
        </ul>
      </div>

      <div className="not-prose my-8">
        <GenerationViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Context Window 관리</h3>
        <p>
          LLM의 컨텍스트 윈도우는 제한적 — Top K 청크가 컨텍스트를 초과하면 가장 관련성 높은 것만 선택<br />
          청크 순서도 중요: "Lost in the Middle" 현상 — LLM은 컨텍스트 중간의 정보를 놓치는 경향, 가장 중요한 청크를 앞뒤에 배치
        </p>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
        <p className="font-semibold mb-2">실전 팁: 근거 인용 의무화</p>
        <p className="text-sm">
          프롬프트에 "답변의 각 주장 뒤에 [청크 번호]를 붙여라"를 명시<br />
          제조 도메인처럼 정확성이 중요한 곳에서는 출처 추적이 필수, 환각도 줄어든다
        </p>
      </div>
    </section>
  );
}

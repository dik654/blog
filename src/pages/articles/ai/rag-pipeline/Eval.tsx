import EvalViz from './viz/EvalViz';

export default function Eval() {
  return (
    <section id="evaluation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">RAG 평가: Faithfulness, Relevance</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          RAG 시스템은 검색 품질과 생성 품질을 <strong>분리해서 평가</strong>해야 한다<br />
          생성 품질만 보면 검색 단계의 문제를 놓치고, 검색만 보면 답변 품질을 알 수 없다
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">RAGAS 4대 메트릭</h3>
        <ul>
          <li><strong>Faithfulness</strong> — 답변이 context에 근거하는가? 환각 탐지</li>
          <li><strong>Answer Relevance</strong> — 답변이 질문에 관련 있는가? 동문서답 탐지</li>
          <li><strong>Context Relevance</strong> — 검색된 context가 질문과 관련 있는가? 검색 품질</li>
          <li><strong>Context Recall</strong> — 필요한 정보가 context에 포함되었는가? 검색 누락 탐지</li>
        </ul>
      </div>

      <div className="not-prose my-8">
        <EvalViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">LLM-as-Judge</h3>
        <p>
          사람이 수백 개 답변을 평가하기 어려울 때 — GPT-4 같은 강한 LLM을 평가자로 사용<br />
          평가 프롬프트: "이 답변이 질문에 근거(context)에 기반해 정확히 답하는지 1~5점으로 평가"
        </p>
        <p>
          주의: LLM 평가자도 편향이 있으므로 — 소수 샘플은 사람이 직접 검증하고 LLM 평가와 상관관계를 확인
        </p>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
        <p className="font-semibold mb-2">실전 팁: 자동 평가 파이프라인</p>
        <p className="text-sm">
          질문-정답 쌍 50~100개를 미리 만들어놓고, 청킹·임베딩·프롬프트를 바꿀 때마다 자동 평가<br />
          사람이 모든 변경을 수동 검증하면 반복 속도가 느려져 실험 횟수가 줄어든다
        </p>
      </div>
    </section>
  );
}

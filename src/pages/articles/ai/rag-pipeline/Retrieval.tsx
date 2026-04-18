import RetrievalViz from './viz/RetrievalViz';

export default function Retrieval() {
  return (
    <section id="retrieval" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">검색 전략: Dense, Sparse, Hybrid</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          검색은 RAG의 핵심 — 잘못된 청크를 가져오면 LLM이 아무리 좋아도 엉뚱한 답을 한다<br />
          Dense, Sparse, Hybrid — 3가지 검색 방식 각각의 장단점을 알아야 최적 조합을 만들 수 있다
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">3가지 검색 방식</h3>
        <ul>
          <li><strong>Dense Retrieval</strong> — 임베딩 기반 의미 검색, 동의어·의역에 강하지만 정확한 키워드 매칭에 약함</li>
          <li><strong>Sparse Retrieval(BM25)</strong> — 단어 빈도 기반, 전문 용어·코드·제품명에 강함</li>
          <li><strong>Hybrid</strong> — Dense와 Sparse를 결합, RRF(Reciprocal Rank Fusion)로 순위 병합</li>
        </ul>
      </div>

      <div className="not-prose my-8">
        <RetrievalViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Re-ranking과 Query Transformation</h3>
        <p>
          <strong>Re-ranking</strong> — 1차로 K=20개 검색 → Cross-encoder로 재정렬 → Top K=5 선택<br />
          Bi-encoder(빠름, 정확도↓)와 Cross-encoder(느림, 정확도↑)를 2단계로 결합
        </p>
        <p>
          <strong>Query Transformation</strong> — 쿼리를 LLM으로 재작성해서 검색 품질 향상<br />
          HyDE(Hypothetical Document Embedding): "답변 형태"로 쿼리를 확장 후 임베딩
        </p>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
        <p className="font-semibold mb-2">실전 팁: MMR로 다양성 확보</p>
        <p className="text-sm">
          Top K 검색 결과가 비슷한 청크만 가져오면 — 같은 정보 반복, 컨텍스트 낭비<br />
          MMR(Maximal Marginal Relevance)로 유사도와 다양성을 균형 맞춰 선택하면 해결
        </p>
      </div>
    </section>
  );
}

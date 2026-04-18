import EmbeddingViz from './viz/EmbeddingViz';

export default function Embedding() {
  return (
    <section id="embedding" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">임베딩 &amp; 벡터 DB</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          텍스트를 고정 차원 벡터로 변환 — 의미적으로 비슷한 텍스트는 벡터 공간에서 가깝게<br />
          임베딩 모델의 품질이 검색 정확도를 직접 결정한다
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">임베딩 모델 선택</h3>
        <ul>
          <li><strong>E5(multilingual-e5)</strong> — 다국어 지원, 한국어 성능 우수</li>
          <li><strong>BGE(BAAI General Embedding)</strong> — 영어 MTEB 상위권</li>
          <li><strong>Korean-SBERT</strong> — 한국어 특화, 제조 도메인에 KR-SBERT + domain fine-tuning 조합 유효</li>
          <li><strong>OpenAI text-embedding-3</strong> — API 기반, 품질 안정적이지만 비용 발생</li>
        </ul>
      </div>

      <div className="not-prose my-8">
        <EmbeddingViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">벡터 DB 선택</h3>
        <ul>
          <li><strong>FAISS</strong> — Meta 제작 라이브러리, 초고속. 로컬 파일 기반, 관리 간단</li>
          <li><strong>Chroma</strong> — Python 친화적, 프로토타입에 적합</li>
          <li><strong>Milvus / Qdrant / Weaviate</strong> — 프로덕션 벡터 DB, 분산·메타데이터 필터링 지원</li>
        </ul>
        <p>
          <strong>인덱스 전략</strong> — 수만 건은 Flat(완전 탐색), 수십만~수백만 건은 HNSW(그래프 기반) 또는 IVF(클러스터 기반)
        </p>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
        <p className="font-semibold mb-2">실전 팁: 차원 vs 속도</p>
        <p className="text-sm">
          임베딩 차원이 높을수록 표현력이 좋지만 검색 속도가 느려진다<br />
          1024차원이 기본, 속도가 중요하면 384차원 모델(all-MiniLM)도 충분한 경우가 많다
        </p>
      </div>
    </section>
  );
}

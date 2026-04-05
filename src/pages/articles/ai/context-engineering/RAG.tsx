import RAGPipelineViz from './viz/RAGPipelineViz';

export default function RAG() {
  return (
    <section id="rag" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">RAG: 검색 증강 생성</h2>
      <div className="not-prose mb-8"><RAGPipelineViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>RAG</strong>(Retrieval-Augmented Generation) — LLM의 학습 데이터에 없는 최신·내부 정보를 실시간으로 주입하는 패턴<br />
          파인튜닝 없이도 도메인 특화 지식 활용 가능
        </p>
        <p>
          청킹 전략이 검색 품질을 좌우 — 너무 크면 노이즈 포함, 너무 작으면 맥락 부족<br />
          하이브리드 검색(벡터 + BM25) + 리랭킹(Cross-encoder)으로 정확도 극대화
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">RAG 파이프라인 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// RAG 표준 파이프라인
//
// [Indexing Phase] — 한 번 실행
//
// 1. Document Loading
//    PDF, HTML, DB, Slack, Notion, ...
//    → raw text
//
// 2. Chunking
//    - Size-based: 512~1024 tokens
//    - Semantic: 문장/단락 경계
//    - Overlap: 50~100 tokens
//    - Parent-child, hierarchical
//
// 3. Embedding
//    text-embedding-3-large, BGE, Cohere embed
//    → 1536~3072 dim vectors
//
// 4. Vector DB Storage
//    Pinecone, Weaviate, Qdrant, Milvus
//    + metadata (source, date, author)

// [Retrieval Phase] — query 당 실행
//
// 1. Query Processing
//    - Expansion: HyDE, Query rewriting
//    - Decomposition: sub-queries
//    - Embedding: 같은 모델로 vectorize
//
// 2. Vector Search (k=50~100)
//    - Cosine similarity
//    - Hybrid: Vector + BM25
//    - Filter: metadata-based
//
// 3. Reranking (k=5~20)
//    - Cross-encoder (e.g., BGE-reranker)
//    - LLM-as-judge
//    - 정확도 ↑ 10~30%
//
// 4. Context Assembly
//    - Format for LLM
//    - Add citations
//    - Deduplicate

// [Generation Phase]
//   User Query + Retrieved Chunks → LLM
//   → Answer with citations`}
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">Chunking 전략 비교</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Chunking 전략
//
// 1. Fixed-Size Chunking
//    text[0:512], text[412:924], ...
//    - 간단, 빠름
//    - overlap으로 경계 완화
//    - 의미 경계 무시
//
// 2. Recursive Character Splitter
//    \\n\\n → \\n → ". " → " " → char
//    - Langchain 표준
//    - 자연스러운 경계
//
// 3. Semantic Chunking
//    - Embedding similarity
//    - 의미 변화 시점 분할
//    - 고품질이나 비용 큼
//
// 4. Document-Specific
//    - Code: 함수/클래스 단위
//    - Markdown: 헤더 기반
//    - Tables: 행 단위
//
// 5. Hierarchical
//    - Parent chunks (큰 단위)
//    - Child chunks (작은 단위)
//    - 검색: child, 반환: parent
//    - 정확도 + 문맥 둘 다

// 실전 권장:
//   Technical docs: 512-1024 tokens + header-aware
//   Long PDFs: hierarchical + summary
//   Code: AST-based
//   Chat logs: turn-based

// 측정 지표 (Retrieval Quality):
//   - Recall@k (관련 문서 비율)
//   - MRR (Mean Reciprocal Rank)
//   - NDCG (Normalized DCG)
//   - End-to-end answer quality`}
        </pre>
        <p className="leading-7">
          요약 1: RAG = <strong>Indexing + Retrieval + Generation</strong> 3단계.<br />
          요약 2: <strong>Hybrid search + Reranking</strong>이 품질 핵심.<br />
          요약 3: Chunking 전략이 <strong>RAG 성공의 절반</strong>.
        </p>
      </div>
    </section>
  );
}

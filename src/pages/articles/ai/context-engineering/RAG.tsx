import RAGPipelineViz from './viz/RAGPipelineViz';
import { PipelineViz, ChunkViz } from './viz/RAGDetailViz';

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
        <div className="not-prose mb-6"><PipelineViz /></div>

        <h3 className="text-xl font-semibold mt-6 mb-3">Chunking 전략 비교</h3>
        <div className="not-prose mb-6"><ChunkViz /></div>
        <p className="leading-7">
          요약 1: RAG = <strong>Indexing + Retrieval + Generation</strong> 3단계.<br />
          요약 2: <strong>Hybrid search + Reranking</strong>이 품질 핵심.<br />
          요약 3: Chunking 전략이 <strong>RAG 성공의 절반</strong>.
        </p>
      </div>
    </section>
  );
}

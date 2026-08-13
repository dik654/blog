import { Link } from "react-router-dom";
import RAGPipelineViz from "./viz/RAGPipelineViz";
import { PipelineViz, ChunkViz } from "./viz/RAGDetailViz";

export default function RAG() {
  return (
    <section id="rag" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">RAG는 필요한 근거를 골라 넣는다</h2>
      <div className="not-prose mb-8">
        <RAGPipelineViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>RAG(Retrieval-Augmented Generation)</strong>는 질문과 관련된
          문서를 먼저 검색하고, 그 근거를 context에 넣어 답을 생성하는
          패턴입니다. 모델 가중치를 바꾸지 않고 최신 문서나 내부 지식을 사용할
          수 있지만, 검색 결과가 틀리면 생성 단계도 좋아질 수 없습니다. 그래서
          RAG는 “문서를 많이 넣는 기술”이 아니라 검색·선택·인용의 품질을
          관리하는 context pipeline으로 보는 편이 정확합니다.
        </p>
        <p>
          chunk 크기, embedding, sparse search, reranker 중 어느 하나가 항상
          정답은 아닙니다. 질문이 정확한 고유명사를 포함하면 BM25가 강할 수
          있고, 표현이 달라지는 의미 검색에는 dense retriever가 도움이 됩니다.
          hybrid search와 reranking도 후보 recall이 충분하고 추가 지연을 감당할
          수 있을 때 선택합니다.
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">전체 파이프라인</h3>
        <div className="not-prose mb-6">
          <PipelineViz />
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">Chunk는 검색 단위다</h3>
        <div className="not-prose mb-6">
          <ChunkViz />
        </div>
        <p className="leading-7">
          여기서는 RAG가 context에 들어오는 지점을 중심으로 다룹니다. indexing,
          retrieval 평가, reranking과 답변 검증을 실제로 구성하는 방법은{" "}
          <Link to="/ai/rag-pipeline">RAG 파이프라인 글</Link>에서 이어서 볼 수
          있습니다. 한 개념의 구현 세부를 여러 글에 복제하지 않고, 이 글은
          context 선택이라는 역할만 맡습니다.
        </p>
      </div>
    </section>
  );
}

import Overview from "./rag-pipeline/Overview";
import Chunking from "./rag-pipeline/Chunking";
import Embedding from "./rag-pipeline/Embedding";
import { Link } from "react-router-dom";
import Generation from "./rag-pipeline/Generation";
import Eval from "./rag-pipeline/Eval";
import { RagPipelineReturn } from "./rag-pipeline/RagPipelineLocator";

export default function RagPipelineArticle() {
  return (
    <div className="space-y-12">
      <Overview />
      <Chunking />
      <Embedding />
      <section id="retrieval" className="scroll-mt-20">
        <h2 className="mb-4 text-2xl font-bold">후보 선택</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            이 글에서는 검색 단계가 넘겨주는 입력과 출력만 전체 경로에
            연결합니다. BM25·HNSW·RRF·cross-encoder가 후보를 만들고 줄이는
            내부 과정은 별도 글에서 한 요청으로 추적합니다.
          </p>
          <p>
            <Link to="/cs/ai/retrieval-ranking-funnel">
              Retrieval ranking funnel 글로 이동 →
            </Link>
          </p>
        </div>
      </section>
      <Generation />
      <Eval />
      <RagPipelineReturn />
    </div>
  );
}

import Overview from "./rag-pipeline/Overview";
import Chunking from "./rag-pipeline/Chunking";
import Embedding from "./rag-pipeline/Embedding";
import { Link } from "react-router-dom";
import Generation from "./rag-pipeline/Generation";
import Eval from "./rag-pipeline/Eval";

export default function RagPipelineArticle() {
  return (
    <div className="space-y-12">
      <Overview />
      <Chunking />
      <Embedding />
      <section id="retrieval" className="scroll-mt-20">
        <h2 className="mb-4 text-2xl font-bold">Candidate retrieval은 독립 funnel로 검증합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            이 lifecycle 글은 candidate retrieval의 입력·출력 receipt와 downstream
            context 경계만 연결합니다. BM25·HNSW·RRF·cross-encoder·Graph lane과
            pre-retrieval ACL의 수식·비용·recall ceiling은 별도 글에서 비교합니다.
          </p>
          <p>
            <Link to="/ai/retrieval-ranking-funnel">
              Retrieval ranking funnel 글로 이동 →
            </Link>
          </p>
        </div>
      </section>
      <Generation />
      <Eval />
    </div>
  );
}

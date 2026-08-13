import Overview from "./rag-pipeline/Overview";
import Chunking from "./rag-pipeline/Chunking";
import Embedding from "./rag-pipeline/Embedding";
import Retrieval from "./rag-pipeline/Retrieval";
import Generation from "./rag-pipeline/Generation";
import Eval from "./rag-pipeline/Eval";

export default function RagPipelineArticle() {
  return (
    <div className="space-y-12">
      <Overview />
      <Chunking />
      <Embedding />
      <Retrieval />
      <Generation />
      <Eval />
    </div>
  );
}

import Overview from "./sentence-embeddings/Overview";
import SBERT from "./sentence-embeddings/SBERT";
import Modern from "./sentence-embeddings/Modern";
import Evaluation from "./sentence-embeddings/Evaluation";

export default function SentenceEmbeddingsArticle() {
  return (
    <div className="space-y-12">
      <Overview />
      <SBERT />
      <Modern />
      <Evaluation />
    </div>
  );
}

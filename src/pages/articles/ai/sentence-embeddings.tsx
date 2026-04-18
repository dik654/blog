import Overview from './sentence-embeddings/Overview';
import SBERT from './sentence-embeddings/SBERT';
import Modern from './sentence-embeddings/Modern';
import Evaluation from './sentence-embeddings/Evaluation';

export default function SentenceEmbeddingsArticle() {
  return (
    <>
      <Overview />
      <SBERT />
      <Modern />
      <Evaluation />
    </>
  );
}

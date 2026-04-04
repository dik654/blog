import MultiHeadDemo from '../components/MultiHeadDemo';
import MultiHeadMergeViz from './viz/MultiHeadMergeViz';

export default function MultiHead() {
  return (
    <section id="multi-head">
      <h2 className="text-2xl font-semibold mb-4 scroll-mt-20">Multi-Head Attention</h2>
      <p className="leading-7 mb-6">
        단일 Attention 대신 여러 개의 Attention Head를 병렬로 사용<br />
        서로 다른 관점에서 정보를 포착 — 각 Head는 독립적인 Q, K, V 가중치를 보유
      </p>
      <MultiHeadMergeViz />
      <MultiHeadDemo />
    </section>
  );
}

import AutobahnLayersViz from './viz/AutobahnLayersViz';
import AutobahnArchViz from './viz/AutobahnArchViz';
import AutobahnBlipViz from './viz/AutobahnBlipViz';

export default function Autobahn() {
  return (
    <section id="autobahn" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Autobahn</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          전통적 BFT의 저지연 + DAG 기반의 빠른 복구를 결합한 하이브리드 프로토콜 (SOSP 2024)
        </p>
      </div>
      <div className="not-prose mb-8"><AutobahnLayersViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <h3 className="text-xl font-semibold mb-3">Highway · Lanes · Ride-Sharing</h3>
        <p className="leading-7">
          합의(Highway)와 데이터 전파(Lanes)를 분리 — Ride-Sharing으로 메시지 피기백
        </p>
      </div>
      <div className="not-prose mb-8"><AutobahnArchViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <h3 className="text-xl font-semibold mb-3">Blip 복구 비교</h3>
        <p className="leading-7">
          Blip(일시 장애) 발생 시 복구 방식 — 전통 BFT vs DAG vs Autobahn
        </p>
      </div>
      <div className="not-prose"><AutobahnBlipViz /></div>
    </section>
  );
}

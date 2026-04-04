import ContextViz from './viz/ContextViz';
import CryptoModelViz from './viz/CryptoModelViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">대칭/비대칭 암호</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          블록체인의 신뢰 기반인 암호학의 핵심 개념과 응용.
        </p>
      </div>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="not-prose"><CryptoModelViz /></div>
    </section>
  );
}

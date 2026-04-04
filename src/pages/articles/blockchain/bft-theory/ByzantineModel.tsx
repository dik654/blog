import ByzantineModelViz from './viz/ByzantineModelViz';

export default function ByzantineModel() {
  return (
    <section id="byzantine-model" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">비잔틴 장애 모델</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          Crash Fault vs Byzantine Fault, 동기/비동기/부분 동기 네트워크 모델.
        </p>
      </div>
      <div className="not-prose"><ByzantineModelViz /></div>
    </section>
  );
}

import ContextViz from './viz/ContextViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">VDF 개요 &amp; 동기</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          VDF(Verifiable Delay Function) — "일정 시간이 흘렀다"를 수학적으로 증명하는 함수.<br />
          계산에 T 스텝이 반드시 필요하고, 검증은 짧은 증명으로 빠르게 가능
        </p>
      </div>
      <div className="not-prose"><ContextViz /></div>
    </section>
  );
}

import ApplicationsViz from './viz/ApplicationsViz';

export default function Applications() {
  return (
    <section id="applications" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">응용: DRAND, Irys, Ethereum</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          "시간의 증명"이 필요한 모든 곳에 적용.<br />
          핵심 가정: 병렬화 불가능한 순차 연산 = 실제 시간이 흘렀다는 물리적 보장
        </p>
      </div>
      <div className="not-prose"><ApplicationsViz /></div>
    </section>
  );
}

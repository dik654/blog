import ForkCompatViz from './viz/ForkCompatViz';

export default function TestDesign() {
  return (
    <section id="test-design" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">테스트 케이스 설계</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          동일 체인/동일 포크는 허용, 다른 제네시스나 다른 포크 경로는 거부.<br />
          Sepolia 등 테스트넷도 동일 로직 적용, 포크 순서/타이밍만 상이
        </p>
      </div>
      <div className="not-prose"><ForkCompatViz /></div>
    </section>
  );
}

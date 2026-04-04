import ConstructionViz from './viz/ConstructionViz';

export default function Construction() {
  return (
    <section id="construction" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">구성: 순차 계산 + 빠른 검증</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          RSA 그룹 위 반복 제곱이 핵심. phi(N)을 모르면 x^(2^T)를 T번 제곱으로만 계산 가능
        </p>
      </div>
      <div className="not-prose"><ConstructionViz /></div>
    </section>
  );
}

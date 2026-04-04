import CostViz from './viz/CostViz';

export default function CostComparison() {
  return (
    <section id="cost-comparison" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">BN254 비용 비교</h2>
      <div className="not-prose mb-8"><CostViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          BN254 페어링에서 Fp12 곱셈은 가장 빈번한 연산이다.
          <br />
          Miller Loop 254회 반복마다 Fp12 곱셈이 등장한다.
        </p>
        <p>
          Karatsuba 타워로 한 번의 Fp12 곱셈이 <strong>144 &rarr; 54</strong> Fp 곱셈으로 줄어든다.
          <br />
          2.7배의 절감이 254번 반복되므로, 페어링 전체 성능에 결정적인 차이를 만든다.
        </p>
      </div>
    </section>
  );
}

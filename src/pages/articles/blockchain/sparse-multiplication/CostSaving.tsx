import CostViz from './viz/CostViz';

export default function CostSaving() {
  return (
    <section id="cost-saving" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Full vs Sparse 비용 비교</h2>
      <div className="not-prose mb-8"><CostViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          한 번의 Fp12 곱셈에서 Full은 54 Fp곱, Sparse는 18 Fp곱이다.<br />
          차이는 <strong>36 Fp곱</strong>이고, 절감률은 67%다.
        </p>
        <p>
          이 절감은 단순 이론이 아니다.<br />
          실제 구현체(gnark, arkworks, py_ecc)에서{' '}
          <code className="bg-accent px-1.5 py-0.5 rounded text-sm">
            mul_by_034
          </code>{' '}
          함수는 Full{' '}
          <code className="bg-accent px-1.5 py-0.5 rounded text-sm">
            mul
          </code>{' '}
          대비 약 3배 빠르다.
        </p>
        <p>
          Karatsuba가 곱셈 횟수를 144에서 54로 줄였다면,
          sparse 구조는 54에서 18로 한 번 더 줄인다.<br />
          두 최적화는 독립적으로 작동하며, 함께 적용된다.
        </p>
      </div>
    </section>
  );
}

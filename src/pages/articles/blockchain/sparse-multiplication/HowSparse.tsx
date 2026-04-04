import HowSparseViz from './viz/HowSparseViz';

export default function HowSparse() {
  return (
    <section id="how-sparse" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        어떤 슬롯끼리 곱해지는가
      </h2>
      <div className="not-prose mb-8"><HowSparseViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Full Fp12 곱셈은 12개 슬롯 x 12개 슬롯 = 144개 항을 계산한다.<br />
          Karatsuba 최적화를 적용해도 <strong>54 Fp곱</strong>이 필요하다.
        </p>
        <p>
          Sparse 곱셈에서는 l(P)의 non-zero 슬롯이 3개뿐이다.
          0인 슬롯과의 곱은 항상 0이므로 건너뛸 수 있다.<br />
          실제 계산해야 할 항은 <strong>12 x 3 = 36개</strong>다.
        </p>
        <p>
          이 36개 항에 Karatsuba 트릭을 추가 적용하면{' '}
          <strong>18 Fp곱</strong>까지 줄어든다.<br />
          구현 코드에서는{' '}
          <code className="bg-accent px-1.5 py-0.5 rounded text-sm">
            mul_by_034
          </code>{' '}
          같은 이름으로 sparse 곱셈 전용 함수를 제공한다.
          "034"는 non-zero인 슬롯 인덱스를 뜻한다.
        </p>
      </div>
    </section>
  );
}

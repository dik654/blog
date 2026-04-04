import RecursiveViz from './viz/RecursiveViz';

export default function Recursive() {
  return (
    <section id="recursive" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        재귀 적용: Fp2 &rarr; Fp6 &rarr; Fp12 타워
      </h2>
      <div className="not-prose mb-8"><RecursiveViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Karatsuba는 한 층에서만 적용되는 기법이 아니다.
          <br />
          확장체 타워의 <strong>각 층</strong>에서 재귀적으로 적용된다.
        </p>
        <p>
          Fp2 곱셈에서 Fp 곱셈 4회 &rarr; 3회. Fp6 곱셈에서 Fp2 곱셈 9회 &rarr; 6회.
          <br />
          Fp12 곱셈에서 Fp6 곱셈 4회 &rarr; 3회.
          <br />
          각 단계의 절감이 곱해져서, 최종적으로 Fp12 곱셈 한 번에 필요한 Fp 곱셈이
          <strong> 144회에서 54회</strong>로 줄어든다.
        </p>
      </div>
    </section>
  );
}

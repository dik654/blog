import NaiveViz from './viz/NaiveViz';

export default function NaiveMul() {
  return (
    <section id="naive-mul" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Naive 곱셈: 4회 방식</h2>
      <div className="not-prose mb-8"><NaiveViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          (a+bu)(c+du)를 전개하면 ac + adu + bcu + bdu²가 된다.
          <br />
          여기서 u² = -1을 대입하면 실수부는 ac - bd, 허수부는 ad + bc다.
        </p>
        <p>
          총 <strong>4번의 Fp 곱셈</strong>과 2번의 Fp 덧셈/뺄셈이 필요하다.
          <br />
          Fp 곱셈 한 번은 256-bit 정수의 Montgomery 곱셈이므로 비용이 크다.
          <br />
          덧셈은 곱셈 대비 약 1/10의 비용이다.
        </p>
      </div>
    </section>
  );
}

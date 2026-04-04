import PolyFFTViz from './viz/PolyFFTViz';

export default function PolynomialArithmetic() {
  return (
    <section id="polynomial-arithmetic" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">다항식 산술 & FFT</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          다항식은 ZKP의 핵심 데이터 구조 — 회로 제약, 증명, 검증 모두 다항식 연산으로 환원.
        </p>
      </div>
      <div className="not-prose"><PolyFFTViz /></div>
    </section>
  );
}

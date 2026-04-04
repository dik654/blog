import ButterflyViz from './viz/ButterflyViz';

export default function NTT() {
  return (
    <section id="ntt" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">NTT & 나비 연산</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          유한체 위의 FFT &mdash; 복소수 근 대신 원시 근(Primitive Root of Unity) 사용.
          다항식 곱셈 O(n log n).
        </p>
      </div>
      <div className="not-prose"><ButterflyViz /></div>
    </section>
  );
}

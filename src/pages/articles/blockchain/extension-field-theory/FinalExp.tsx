import Math from '@/components/ui/math';
import FinalExpViz from './viz/FinalExpViz';

export default function FinalExp() {
  return (
    <section id="final-exp" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Final Exponentiation 상세</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          페어링의 두 번째 단계.
          Miller Loop 출력 f를 <Math>{'f^{(p^{12}-1)/r}'}</Math>로 변환하여 GT 원소를 만든다.
        </p>
        <p>~3000-bit 지수를 인수분해:</p>
        <Math display>{'\\frac{p^{12}-1}{r} = (p^6 - 1) \\cdot (p^2 + 1) \\cdot \\frac{p^4 - p^2 + 1}{r}'}</Math>
        <p>각 인수를 순서대로 처리. 약 5,000 Fp 곱셈.</p>
      </div>
      <div className="not-prose"><FinalExpViz /></div>
    </section>
  );
}

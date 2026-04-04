import WhyFreeViz from './viz/WhyFreeViz';
import CodePanel from '@/components/ui/code-panel';

export default function WhyFree() {
  return (
    <section id="why-free" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">왜 "무료"인가</h2>
      <div className="not-prose mb-8"><WhyFreeViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          "상수 스케일링"과 "일반 곱셈"은 근본적으로 다르다.<br />
          일반 Fp12 곱셈은 두 미지수 원소의 곱이므로 교차항 처리가 필요하고,
          Karatsuba를 적용해도 54번의 Fp 곱셈이 든다.
        </p>
        <p>
          Frobenius는 미지수 원소에 <strong>알려진 상수</strong>를 곱하는 것이다.<br />
          교차항이 없고 각 계수가 독립적으로 처리된다.
          12번의 Fp 곱셈이 최대치이며, 일부 상수가 0이나 1이면 그마저 생략된다.
        </p>
        <CodePanel title="Full 곱셈 vs Frobenius 비용" code={`// Full Fp12 곱셈: A × B (둘 다 미지수)
//   → Karatsuba 3단 적용
//   → Fp2×Fp2: 3회, Fp6×Fp6: 6회 Fp2곱, Fp12: 3회 Fp6곱
//   → 총 54 Fp곱 + 덧셈들

// Frobenius: A × γ (γ는 precomputed 상수)
//   → 각 계수 독립: cᵢ × γᵢ
//   → γ₀=1 → 생략, 일부 γᵢ는 Fp 원소 → Fp곱 1회
//   → 실제 비용: ~6 Fp곱

// BN254 기준: 6 / 54 ≈ 0.11 → Full 곱셈의 약 1/9`} defaultOpen annotations={[
          { lines: [1, 4], color: 'sky', note: 'Full: 미지수×미지수 → 교차항 필수' },
          { lines: [6, 9], color: 'emerald', note: 'Frobenius: 미지수×상수 → 독립 처리' },
          { lines: [11, 11], color: 'amber', note: '비용 비율: 약 1/9' },
        ]} />
      </div>
    </section>
  );
}

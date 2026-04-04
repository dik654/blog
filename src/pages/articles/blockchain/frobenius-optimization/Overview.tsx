import OverviewViz from './viz/OverviewViz';
import CodePanel from '@/components/ui/code-panel';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Frobenius 사상이란?</h2>
      <div className="not-prose mb-8"><OverviewViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          페어링의 Final Exponentiation에서{' '}
          <code className="bg-accent px-1.5 py-0.5 rounded text-sm">f^(p^k)</code>를
          계산해야 한다. p는 256-bit 소수이므로 naive하게 제곱하면 약 2의256승번 곱셈이 필요하다.<br />
          이 연산은 물리적으로 불가능하다.
        </p>
        <p>
          <strong>Frobenius 사상</strong>은 이 문제를 우회한다.<br />
          유한체 위에서 원소를 p승하는 사상 <code className="bg-accent px-1.5 py-0.5 rounded text-sm">
          {"\u03C6(x) = x^p"}</code>는 체의 자기 동형 사상이다.<br />
          Fp12 원소의 12개 계수에 미리 계산한 상수를 곱해 재배열하면 동일한 결과를 얻는다.
        </p>
        <CodePanel title="Frobenius 핵심 아이디어" code={`// 목표: f^p 를 계산 (p ≈ 2^256)

// naive: 반복 제곱 → 약 256번 Fp12 곱셈 (각 54 Fp곱)
let result = f.pow(p);  // 약 13,824 Fp곱!

// Frobenius: 12개 계수에 상수 스케일링
let result = frobenius(f);  // 약 6 Fp곱 (일부 γ가 1)
// → 2,000배 이상 빠름`} defaultOpen annotations={[
          { lines: [3, 4], color: 'sky', note: 'naive: 256번 × 54 = 13,824 Fp곱' },
          { lines: [6, 8], color: 'emerald', note: 'Frobenius: 상수 곱 12번 (실제 ~6번)' },
        ]} />
      </div>
    </section>
  );
}

import ConcreteViz from './viz/ConcreteViz';
import CodePanel from '@/components/ui/code-panel';

export default function Concrete() {
  return (
    <section id="concrete" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">단계별 계수 변환 예제</h2>
      <div className="not-prose mb-8"><ConcreteViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          가장 단순한 확장체 Fp2 위에서 Frobenius를 적용해 보자.
          Fp2의 원소 <code className="bg-accent px-1.5 py-0.5 rounded text-sm">a + bu</code>에
          Frobenius를 적용하면{' '}
          <code className="bg-accent px-1.5 py-0.5 rounded text-sm">(a+bu)^p = a + b * u^p</code>이다.
        </p>
        <CodePanel title="F₇² 위의 Frobenius 예제" code={`// F₇² = F₇[u] / (u² + 1),  p = 7

// 원소: 3 + 5u
// Frobenius: (3 + 5u)^7

// 페르마 소정리: a^p = a (a ∈ Fp)
// → 3^7 = 3,  5^7 = 5

// u^p = u^7.  u² = -1 이므로:
// u^7 = u^6 · u = (u²)³ · u = (-1)³ · u = -u

// 결과: 3 + 5·(-u) = 3 - 5u = 3 + 2u  (mod 7)`} defaultOpen annotations={[
          { lines: [4, 4], color: 'sky', note: '목표: 7승 계산' },
          { lines: [6, 7], color: 'emerald', note: 'Fp 원소는 p승해도 불변' },
          { lines: [9, 10], color: 'amber', note: 'u^p = -u 가 핵심' },
        ]} />
        <p>
          결론: Fp2 Frobenius = <strong>두 번째 계수의 부호 반전</strong>.
          곱셈이 아니라 부호 하나 바꾸는 것이다.<br />
          Fp12에서는 이 패턴이 타워 구조를 따라 확장되어,
          하위 6개 계수는 유지되고 상위 6개 계수에 상수가 곱해진다.
        </p>
      </div>
    </section>
  );
}

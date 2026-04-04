import InFinalExpViz from './viz/InFinalExpViz';
import CodePanel from '@/components/ui/code-panel';

export default function InFinalExp() {
  return (
    <section id="in-final-exp" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Final Exp에서의 지수 분해</h2>
      <div className="not-prose mb-8"><InFinalExpViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Final Exponentiation의 지수{' '}
          <code className="bg-accent px-1.5 py-0.5 rounded text-sm">(p12-1)/r</code>을
          세 부분으로 분해할 때 Frobenius가 핵심 역할을 한다.<br />
          각 단계에서 p의 거듭제곱이 등장하는데, 이것이 전부 Frobenius로 대체된다.
        </p>
        <CodePanel title="세 단계의 Frobenius 활용" code={`// Easy Part 1: f^(p⁶ - 1)
//   p⁶승 = Frobenius 6회 = conjugate (부호 반전)
//   비용: conjugate + inv + mul = Fp12곱 2회

// Easy Part 2: g^(p² + 1)
//   p²승 = Frobenius 2회 (상수 스케일링)
//   비용: frobenius + mul = Fp12곱 1회 + 스케일링

// Hard Part: h^((p⁴-p²+1)/r)
//   지수를 c₀ + c₁·p + c₂·p² + c₃·p³ 으로 분해
//   각 p^k = Frobenius k회 (무료!)
//   실제 곱셈은 c 계수 체인에서만 발생`} defaultOpen annotations={[
          { lines: [1, 3], color: 'sky', note: 'Easy1: p⁶ = conjugate (뒤집기)' },
          { lines: [5, 7], color: 'emerald', note: 'Easy2: p² = Frobenius 2회' },
          { lines: [9, 12], color: 'amber', note: 'Hard: p^k마다 Frobenius (무료)' },
        ]} />
        <p>
          Hard Part에서 지수를 BN 파라미터 u의 다항식으로 재표현하면,
          p의 거듭제곱 부분은 전부 Frobenius로 처리되고
          실제 비용은 u 기반 addition chain의 제곱·곱셈에만 집중된다.
        </p>
      </div>
    </section>
  );
}

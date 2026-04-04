import OperatorViz from './viz/OperatorViz';
import CodePanel from '@/components/ui/code-panel';
import { dispatchCode, addImplCode, mulImplCode, displayCode, axiomTestCode } from './operatorOverloadData';

export default function OperatorOverload() {
  return (
    <section id="operator-overload" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">연산자 오버로딩 + Display</h2>
      <div className="not-prose mb-8"><OperatorViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">Rust의 연산자 = 트레잇 메서드</h3>
        <p>Rust에서 <code className="bg-accent px-1.5 py-0.5 rounded text-sm">a + b</code>를 쓰면 컴파일러가 트레잇 메서드를 호출한다.</p>
        <CodePanel title="연산자 → 트레잇 디스패치" code={dispatchCode} defaultOpen annotations={[
          { lines: [1, 3], color: 'sky', note: '이항 연산자 매핑' },
          { lines: [4, 4], color: 'emerald', note: '단항 연산자 매핑' },
        ]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">Add 구현</h3>
        <CodePanel title="Add 트레잇 구현" code={addImplCode} annotations={[
          { lines: [1, 4], color: 'sky', note: '값 버전: Fp + Fp' },
          { lines: [7, 10], color: 'emerald', note: '참조 버전: Fp + &Fp' },
        ]} />
        <p><code className="bg-accent px-1.5 py-0.5 rounded text-sm">Fp</code>는 <code className="bg-accent px-1.5 py-0.5 rounded text-sm">Copy</code>이므로 값으로 받아도 32바이트 복사 비용이 거의 없다.</p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Mul이 mont_mul을 호출하는 이유</h3>
        <CodePanel title="Mul → mont_mul" code={mulImplCode} defaultOpen annotations={[
          { lines: [3, 3], color: 'sky', note: '곱셈의 실체는 Montgomery 곱셈' },
        ]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">Display: Montgomery form이 아닌 실제 값 출력</h3>
        <CodePanel title="Display 트레잇" code={displayCode} annotations={[
          { lines: [3, 3], color: 'sky', note: 'Montgomery → normal 변환' },
          { lines: [4, 5], color: 'emerald', note: 'big-endian 순서로 hex 출력' },
        ]} />
        <p>내부 저장값은 Montgomery form(a * R mod p)이라 그대로 출력하면 의미 없는 숫자가 나온다. <code className="bg-accent px-1.5 py-0.5 rounded text-sm">to_repr()</code>로 변환 후 출력해야 한다.</p>

        <h3 className="text-xl font-semibold mt-6 mb-3">체(Field) 공리 테스트</h3>
        <CodePanel title="유한체 공리 검증 테스트" code={axiomTestCode} annotations={[
          { lines: [1, 3], color: 'sky', note: '항등원 검증' },
          { lines: [5, 7], color: 'emerald', note: '교환법칙 검증' },
          { lines: [9, 11], color: 'amber', note: '결합법칙 검증' },
          { lines: [13, 14], color: 'violet', note: '분배법칙 검증' },
        ]} />
        <p>Montgomery 구현은 상수 하나만 틀려도 모든 곱셈이 조용히 틀린 값을 낸다. 공리 테스트는 구현이 수학적으로 올바른 체인지 한꺼번에 검증하는 통합 테스트 역할을 한다.</p>
      </div>
    </section>
  );
}

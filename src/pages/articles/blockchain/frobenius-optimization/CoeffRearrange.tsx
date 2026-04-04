import CoeffViz from './viz/CoeffViz';
import CodePanel from '@/components/ui/code-panel';

export default function CoeffRearrange() {
  return (
    <section id="coeff-rearrange" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">12개 계수의 재배열</h2>
      <div className="not-prose mb-8"><CoeffViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Fp12 원소는 12개의 Fp 계수로 표현된다.<br />
          Frobenius 사상을 적용하면 각 계수에 고정 상수를 곱하는 것으로 귀결된다.<br />
          이 상수들은 p와 기약다항식으로부터 결정되며, 커브 파라미터가 바뀌지 않는 한 불변이다.
        </p>
        <CodePanel title="Frobenius 계수 변환" code={`// Fp12 원소: (c₀, c₁, ..., c₁₁)
// Frobenius φ(f) = f^p

// 각 계수에 고정 상수 γᵢ를 곱한다
fn frobenius(f: &Fp12) -> Fp12 {
    Fp12 {
        c0:  f.c0  * GAMMA[0],   // γ₀ = 1 (항상)
        c1:  f.c1  * GAMMA[1],   // γ₁ = ξ^((p-1)/6)
        c2:  f.c2  * GAMMA[2],
        // ... c₃~c₁₁ 동일 패턴
    }
}

// γᵢ는 setup 시 한 번만 계산 → 테이블에 저장`} defaultOpen annotations={[
          { lines: [4, 4], color: 'sky', note: '핵심: 미지수×미지수가 아닌, 미지수×상수' },
          { lines: [7, 7], color: 'emerald', note: 'c₀의 상수는 항상 1 (변화 없음)' },
          { lines: [14, 14], color: 'amber', note: '상수 테이블은 커브별로 고정' },
        ]} />
        <p>
          중요한 점은 <code className="bg-accent px-1.5 py-0.5 rounded text-sm">GAMMA[0] = 1</code>이라는 것이다.<br />
          Fp 부분(c0)은 Frobenius에 영향을 받지 않는다. 나머지 상수도 일부는 단순한 값이어서
          실제 곱셈 횟수는 12보다 적다.
        </p>
      </div>
    </section>
  );
}

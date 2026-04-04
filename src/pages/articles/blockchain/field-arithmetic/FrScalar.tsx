import FrScalarViz from './viz/FrScalarViz';
import CodePanel from '@/components/ui/code-panel';
import { prDiffCode, frStructCode, macroCode, macroCallCode, fileStructCode } from './frScalarData';

export default function FrScalar() {
  return (
    <section id="fr-scalar" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Fr 스칼라체</h2>
      <div className="not-prose mb-8"><FrScalarViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">Fp와 Fr - 왜 체가 두 개 필요한가?</h3>
        <p>BN254 커브에는 소수가 두 개 등장한다.</p>
        <table className="w-full text-sm border-collapse">
          <thead><tr className="border-b"><th className="text-left p-2"></th><th className="text-left p-2">Fp (base field)</th><th className="text-left p-2">Fr (scalar field)</th></tr></thead>
          <tbody>
            <tr className="border-b"><td className="p-2 font-semibold">역할</td><td className="p-2">점의 좌표 범위</td><td className="p-2">스칼라 (점을 몇 번 더할지) 범위</td></tr>
            <tr className="border-b"><td className="p-2 font-semibold">용도</td><td className="p-2">G1 좌표 (x, y)</td><td className="p-2">ZK witness, 회로 변수</td></tr>
          </tbody>
        </table>
        <p className="mt-3">비유하면, 지도의 좌표는 위도/경도(Fp)로 표현하고 &quot;몇 km 이동&quot;은 거리(Fr)로 표현한다.</p>

        <h3 className="text-xl font-semibold mt-6 mb-3">p와 r의 차이</h3>
        <CodePanel title="p vs r 비교" code={prDiffCode} defaultOpen annotations={[
          { lines: [1, 2], color: 'sky', note: '두 소수의 hex 표현' },
          { lines: [3, 4], color: 'emerald', note: '상위 동일, 하위 상이' },
        ]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">Fr 구조체</h3>
        <CodePanel title="Fr 정의" code={frStructCode} defaultOpen annotations={[
          { lines: [1, 5], color: 'sky', note: 'MODULUS = r (스칼라체 소수)' },
          { lines: [7, 8], color: 'emerald', note: 'Fp와 동일한 구조' },
        ]} />
        <p>Fp와 구조가 100% 동일하다. 다른 것은 MODULUS 값뿐이다.</p>

        <h3 className="text-xl font-semibold mt-6 mb-3">define_prime_field! 매크로로 코드 재사용</h3>
        <p>Fr의 add, sub, mont_mul, inv 모두 Fp와 로직이 동일하고 상수만 다르다. Rust의 <code className="bg-accent px-1.5 py-0.5 rounded text-sm">macro_rules!</code>로 코드 템플릿을 만든다.</p>
        <CodePanel title="define_prime_field! 매크로" code={macroCode} annotations={[
          { lines: [2, 5], color: 'sky', note: '3가지 상수만 파라미터로 받음' },
          { lines: [7, 7], color: 'emerald', note: '구조체부터 trait impl까지 전부 생성' },
        ]} />
        <p>하나의 매크로 호출로 16가지가 생성된다: 상수(MODULUS, R, R2, INV), 구조체, 메서드(from_raw, mont_mul, add, sub, pow, inv 등), 연산자(+, -, *), Display.</p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Fr 생성: 매크로 한 줄</h3>
        <CodePanel title="fr.rs — 매크로 호출" code={macroCallCode} annotations={[
          { lines: [3, 4], color: 'sky', note: 'MODULUS 상수' },
          { lines: [5, 6], color: 'emerald', note: 'R = 2²⁵⁶ mod r' },
          { lines: [7, 8], color: 'amber', note: 'R² mod r' },
        ]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">파일 구조</h3>
        <CodePanel title="field/ 디렉토리" code={fileStructCode} defaultOpen annotations={[
          { lines: [1, 1], color: 'sky', note: '공용 헬퍼 + 매크로 정의' },
          { lines: [2, 3], color: 'emerald', note: '수동 vs 매크로 구현' },
        ]} />
        <p>상수 3개(MODULUS, R, R2)만 바꾸면 새 유한체를 생성할 수 있다. 나중에 BLS12-381 등 다른 커브를 추가할 때도 같은 매크로를 재사용할 수 있다.</p>
      </div>
    </section>
  );
}

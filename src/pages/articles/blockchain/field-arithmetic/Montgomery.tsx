import MontgomeryStepsViz from './viz/MontgomeryStepsViz';
import MontgomeryFlowViz from './viz/MontgomeryFlowViz';
import CodePanel from '@/components/ui/code-panel';
import { redcCode, redcProofCode, flowCode, limbCode, invCode, opsCode } from './montgomeryData';

export default function Montgomery() {
  return (
    <section id="montgomery" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Montgomery 곱셈</h2>
      <div className="not-prose mb-8"><MontgomeryStepsViz /></div>
      <h3 className="text-lg font-semibold mb-3">곱셈 파이프라인</h3>
      <div className="not-prose mb-8"><MontgomeryFlowViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">왜 Montgomery인가?</h3>
        <p>일반 모듈러 곱셈은 512-bit 나눗셈이 필요하다.
        <br />
          ZK 증명에서 수백만 번 반복되는 연산에서 이는 병목이 된다.
        <br />
          Peter Montgomery(1985)의 아이디어: 숫자를 a 대신 a·R mod p로 저장하면 나눗셈 대신 비트 시프트로 곱셈할 수 있다.</p>

        <h3 className="text-xl font-semibold mt-6 mb-3">기호 정의</h3>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>p</strong>: 소수 (modulus)</li>
          <li><strong>R</strong> = 2²⁵⁶ (Montgomery 상수)</li>
          <li><strong>a_mont</strong> = a · R mod p (Montgomery 형식)</li>
          <li><strong>p&apos;</strong> = -p⁻¹ mod R (미리 계산된 상수)</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">REDC 알고리즘</h3>
        <p>목표: T · R⁻¹ mod p를 나눗셈 없이 계산한다.</p>
        <CodePanel title="REDC 3단계" code={redcCode} defaultOpen annotations={[
          { lines: [1, 1], color: 'sky', note: '하위 비트 마스킹' },
          { lines: [2, 2], color: 'emerald', note: '비트 시프트로 나눗셈 대체' },
          { lines: [3, 3], color: 'amber', note: '최종 범위 보정' },
        ]} />

        <p><strong>핵심</strong>: T + m·p가 R의 배수가 되도록 m을 선택하므로, /R은 정확히 나누어떨어진다.</p>
        <CodePanel title="REDC 정당성 증명" code={redcProofCode} annotations={[
          { lines: [1, 3], color: 'sky', note: 'T + m·p ≡ 0 (mod R) 유도' },
          { lines: [5, 7], color: 'emerald', note: 't ≡ T·R⁻¹ (mod p) 결론' },
        ]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">Montgomery 곱셈 전체 흐름</h3>
        <CodePanel title="Montgomery 곱셈 결과" code={flowCode} defaultOpen annotations={[
          { lines: [1, 1], color: 'sky', note: 'Montgomery form 입력' },
          { lines: [2, 3], color: 'emerald', note: 'REDC로 결과도 Montgomery form' },
        ]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">Limb별 Reduction (INV가 64비트인 이유)</h3>
        <p>256비트 전체를 한번에 처리하는 대신, 하위 64비트를 0으로 만드는 과정을 4번 반복한다.</p>
        <CodePanel title="4-round limb reduction" code={limbCode} defaultOpen annotations={[
          { lines: [1, 2], color: 'sky', note: '각 라운드에서 최하위 limb 소거' },
          { lines: [4, 4], color: 'emerald', note: '256비트 시프트로 결과 추출' },
        ]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">INV 계산 (Newton&apos;s method)</h3>
        <CodePanel title="INV 상수 계산 (Newton 반복)" code={invCode} annotations={[
          { lines: [3, 3], color: 'sky', note: '초기값 1비트 정밀도' },
          { lines: [5, 5], color: 'emerald', note: 'Newton 반복으로 정밀도 2배씩 증가' },
          { lines: [7, 7], color: 'amber', note: '-p₀⁻¹ mod 2^64 반환' },
        ]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">필요한 상수 3개</h3>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>R mod p</strong>: 1의 Montgomery form (<code className="bg-accent px-1.5 py-0.5 rounded text-sm">Fp::ONE</code>)</li>
          <li><strong>R² mod p</strong>: normal → Montgomery 변환에 사용. <code className="bg-accent px-1.5 py-0.5 rounded text-sm">from_raw(a) = mont_mul(a, R²) = a·R</code></li>
          <li><strong>INV</strong>: REDC에서 하위 limb 소거에 사용</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">square, pow, inv</h3>
        <p>모두 mont_mul의 조합이다.</p>
        <CodePanel title="파생 연산들" code={opsCode} defaultOpen annotations={[
          { lines: [1, 1], color: 'sky', note: '자기 자신과 곱셈' },
          { lines: [2, 2], color: 'emerald', note: 'square-and-multiply 패턴' },
          { lines: [3, 3], color: 'amber', note: 'Fermat 소정리 활용' },
        ]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">비용 비교</h3>
        <table className="w-full text-sm border-collapse">
          <thead><tr className="border-b"><th className="text-left p-2">연산</th><th className="text-left p-2">일반</th><th className="text-left p-2">Montgomery</th></tr></thead>
          <tbody>
            <tr className="border-b"><td className="p-2">변환 비용</td><td className="p-2">없음</td><td className="p-2">from_raw / to_repr 각 1번</td></tr>
            <tr className="border-b"><td className="p-2">덧셈</td><td className="p-2">mod p</td><td className="p-2">동일 (그대로)</td></tr>
            <tr className="border-b"><td className="p-2">곱셈</td><td className="p-2">나눗셈 필요</td><td className="p-2">REDC (시프트 + 덧셈)</td></tr>
            <tr><td className="p-2">적합한 경우</td><td className="p-2">곱셈 1~2번</td><td className="p-2">곱셈 수백만 번 (ZK 증명)</td></tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}

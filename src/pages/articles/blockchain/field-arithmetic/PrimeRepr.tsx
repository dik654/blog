import PrimeReprViz from './viz/PrimeReprViz';
import CodePanel from '@/components/ui/code-panel';
import { limbCode, fpStructCode, helperCode, modAddCode } from './primeReprData';

export default function PrimeRepr() {
  return (
    <section id="prime-repr" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">254-bit 소수를 [u64; 4]로 표현하기</h2>
      <div className="not-prose mb-8"><PrimeReprViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">BN254란?</h3>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>BN</strong> = Barreto-Naehrig, 페어링에 적합한 타원곡선 패밀리</li>
          <li><strong>254</strong> = base field 소수 p의 bit 길이</li>
          <li>이 p 위에서 타원곡선 y² = x³ + 3을 정의한다</li>
          <li>Ethereum의 <code className="bg-accent px-1.5 py-0.5 rounded text-sm">ecAdd</code>, <code className="bg-accent px-1.5 py-0.5 rounded text-sm">ecMul</code>, <code className="bg-accent px-1.5 py-0.5 rounded text-sm">ecPairing</code> precompile이 이 커브를 사용</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">왜 [u64; 4]인가?</h3>
        <p>이 소수는 254-bit이다.
        <br />
          한 개의 <code className="bg-accent px-1.5 py-0.5 rounded text-sm">u64</code>는 64-bit만 담을 수 있으므로 최소 4개가 필요하다 (254 / 64 = 3.96).</p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Limb이란?</h3>
        <p>큰 숫자의 한 부분을 가리키는 용어이다.
        <br />
          GMP(GNU Multiple Precision) 라이브러리에서 시작되어 업계 표준이 됐다.
        <br />
          64-bit 단위로 쪼개 저장한다.</p>
        <CodePanel title="Limb 배치 (little-endian)" code={limbCode} defaultOpen annotations={[
          { lines: [1, 4], color: 'sky', note: '4개의 u64 limb' },
          { lines: [6, 6], color: 'emerald', note: '복원 공식' },
        ]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">Little-endian limb 배치</h3>
        <p>limb[0]이 최하위. carry(올림)가 낮은 인덱스에서 높은 인덱스로 전파되므로 <code className="bg-accent px-1.5 py-0.5 rounded text-sm">for i in 0..4</code> 순회가 자연스럽다.</p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Fp 구조체</h3>
        <CodePanel title="Fp 구조체 정의" code={fpStructCode} defaultOpen annotations={[
          { lines: [1, 2], color: 'sky', note: 'Copy 가능한 32바이트 구조체' },
          { lines: [4, 4], color: 'emerald', note: '영원소' },
        ]} />
        <p><code className="bg-accent px-1.5 py-0.5 rounded text-sm">pub(crate)</code>로 같은 크레이트 내에서만 내부 limb에 직접 접근 가능하다.</p>

        <h3 className="text-xl font-semibold mt-6 mb-3">빌딩 블록: adc, sbb, mac</h3>
        <p><strong>adc</strong> (Add with Carry): <code className="bg-accent px-1.5 py-0.5 rounded text-sm">a + b + carry_in → (합, carry_out)</code></p>
        <p><strong>sbb</strong> (Subtract with Borrow): <code className="bg-accent px-1.5 py-0.5 rounded text-sm">a - b - borrow_in → (차, borrow_out)</code></p>
        <p><strong>mac</strong> (Multiply-ACcumulate): <code className="bg-accent px-1.5 py-0.5 rounded text-sm">acc + a * b + carry → (하위 64-bit, 상위 64-bit)</code></p>
        <CodePanel title="adc / mac 헬퍼 함수" code={helperCode} annotations={[
          { lines: [1, 3], color: 'sky', note: 'adc: overflow 플래그로 carry 전파' },
          { lines: [6, 8], color: 'emerald', note: 'mac: u128로 확장하여 128비트 결과' },
        ]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">모듈러 덧셈 / 뺄셈</h3>
        <p>결과가 p 이상이면 p를 한 번 빼고, 음수면 p를 한 번 더한다. 두 피연산자가 [0, p) 범위이므로 한 번이면 충분하다.</p>
        <CodePanel title="모듈러 덧셈" code={modAddCode} defaultOpen annotations={[
          { lines: [2, 5], color: 'sky', note: 'limb별 carry 전파 덧셈' },
          { lines: [6, 6], color: 'emerald', note: '결과 ≥ p이면 p를 뺌' },
        ]} />
        <p><code className="bg-accent px-1.5 py-0.5 rounded text-sm">sub_if_gte</code>는 "일단 p를 빼보고 borrow 발생 여부로 대소를 판단"하는 트릭이다.</p>
      </div>
    </section>
  );
}

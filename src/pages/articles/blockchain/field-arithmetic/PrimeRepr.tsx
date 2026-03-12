export default function PrimeRepr() {
  return (
    <section id="prime-repr" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">254-bit 소수를 [u64; 4]로 표현하기</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">BN254란?</h3>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>BN</strong> = Barreto-Naehrig, 페어링에 적합한 타원곡선 패밀리</li>
          <li><strong>254</strong> = base field 소수 p의 bit 길이</li>
          <li>이 p 위에서 타원곡선 y² = x³ + 3을 정의한다</li>
          <li>Ethereum의 <code className="bg-accent px-1.5 py-0.5 rounded text-sm">ecAdd</code>, <code className="bg-accent px-1.5 py-0.5 rounded text-sm">ecMul</code>, <code className="bg-accent px-1.5 py-0.5 rounded text-sm">ecPairing</code> precompile이 이 커브를 사용</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">왜 [u64; 4]인가?</h3>
        <p>이 소수는 254-bit이다. 한 개의 <code className="bg-accent px-1.5 py-0.5 rounded text-sm">u64</code>는 64-bit만 담을 수 있으므로 최소 4개가 필요하다 (254 / 64 = 3.96).</p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Limb이란?</h3>
        <p>큰 숫자의 한 부분을 가리키는 용어로, GMP(GNU Multiple Precision) 라이브러리에서 시작되어 업계 표준이 됐다. 64-bit 단위로 쪼개 저장한다.</p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`limb[0] = 0x3c208c16d87cfd47   ← 최하위 64-bit
limb[1] = 0x97816a916871ca8d
limb[2] = 0xb85045b68181585d
limb[3] = 0x30644e72e131a029   ← 최상위 64-bit

복원: limb[0] + limb[1] * 2^64 + limb[2] * 2^128 + limb[3] * 2^192`}</code></pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">Little-endian limb 배치</h3>
        <p>limb[0]이 최하위. carry(올림)가 낮은 인덱스에서 높은 인덱스로 전파되므로 <code className="bg-accent px-1.5 py-0.5 rounded text-sm">for i in 0..4</code> 순회가 자연스럽다.</p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Fp 구조체</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`#[derive(Clone, Copy, PartialEq, Eq, Debug)]
pub struct Fp(pub(crate) [u64; 4]);

pub const ZERO: Fp = Fp([0, 0, 0, 0]);`}</code></pre>
        <p><code className="bg-accent px-1.5 py-0.5 rounded text-sm">pub(crate)</code>로 같은 크레이트 내에서만 내부 limb에 직접 접근 가능하다.</p>

        <h3 className="text-xl font-semibold mt-6 mb-3">빌딩 블록: adc, sbb, mac</h3>
        <p><strong>adc</strong> (Add with Carry): <code className="bg-accent px-1.5 py-0.5 rounded text-sm">a + b + carry_in → (합, carry_out)</code></p>
        <p><strong>sbb</strong> (Subtract with Borrow): <code className="bg-accent px-1.5 py-0.5 rounded text-sm">a - b - borrow_in → (차, borrow_out)</code></p>
        <p><strong>mac</strong> (Multiply-ACcumulate): <code className="bg-accent px-1.5 py-0.5 rounded text-sm">acc + a * b + carry → (하위 64-bit, 상위 64-bit)</code></p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`// adc: 두 u64를 carry와 함께 더하기
let (s1, c1) = a.overflowing_add(b);
let (s2, c2) = s1.overflowing_add(carry as u64);
(s2, c1 | c2)

// mac: 곱셈 결과가 128-bit이므로 u128로 확장
let wide = acc as u128 + (a as u128) * (b as u128) + carry as u128;
(wide as u64, (wide >> 64) as u64)`}</code></pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">모듈러 덧셈 / 뺄셈</h3>
        <p>결과가 p 이상이면 p를 한 번 빼고, 음수면 p를 한 번 더한다. 두 피연산자가 [0, p) 범위이므로 한 번이면 충분하다.</p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`pub fn add(&self, rhs: &Fp) -> Fp {
    let (d0, carry) = self.0[0].overflowing_add(rhs.0[0]);
    let (d1, carry) = adc(self.0[1], rhs.0[1], carry);
    let (d2, carry) = adc(self.0[2], rhs.0[2], carry);
    let (d3, _) = adc(self.0[3], rhs.0[3], carry);
    sub_if_gte([d0, d1, d2, d3])
}`}</code></pre>
        <p><code className="bg-accent px-1.5 py-0.5 rounded text-sm">sub_if_gte</code>는 "일단 p를 빼보고 borrow 발생 여부로 대소를 판단"하는 트릭이다.</p>
      </div>
    </section>
  );
}

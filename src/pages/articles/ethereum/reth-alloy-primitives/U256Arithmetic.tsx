import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import U256ArithViz from './viz/U256ArithViz';

export default function U256Arithmetic({ onCodeRef }: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="u256-arithmetic" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">U256 산술 연산</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          U256은 4개의 u64 limb로 256비트를 표현한다.<br />
          little-endian 순서로 <code>limbs[0]</code>이 최하위 64비트, <code>limbs[3]</code>이 최상위 64비트다.<br />
          이 배치는 carry 전파(하위 limb의 오버플로를 상위 limb에 더하는 것)에 자연스럽다.
        </p>
        <p className="leading-7">
          덧셈은 limb[0]부터 시작한다.<br />
          두 u64의 합이 <code>u64::MAX</code>를 초과하면 carry가 1이 되고, 다음 limb 덧셈에 합산된다.<br />
          이 과정이 limb[3]까지 반복되며, 마지막 carry가 남으면 256비트 오버플로다.
        </p>
        <p className="leading-7">
          EVM의 ADD opcode는 <strong>wrapping</strong>(mod 2^256) 연산이 기본이다.<br />
          오버플로가 발생해도 에러가 아니라 하위 256비트만 남긴다.<br />
          <code>checked_add</code>는 오버플로 시 None을 반환하고, <code>saturating_add</code>는 U256::MAX를 반환한다.
        </p>

        {/* ── ruint 구조 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">ruint::Uint — 범용 BigInt 프레임워크</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// ruint 크레이트의 범용 타입
pub struct Uint<const BITS: usize, const LIMBS: usize> {
    limbs: [u64; LIMBS],
}

// 이더리움에서 사용하는 별칭
pub type U128 = Uint<128, 2>;  // 2 limbs
pub type U160 = Uint<160, 3>;  // 3 limbs (Address용 정수 변환)
pub type U256 = Uint<256, 4>;  // 4 limbs (EVM 워드 크기)
pub type U384 = Uint<384, 6>;  // 6 limbs (BLS12-381)
pub type U512 = Uint<512, 8>;  // 8 limbs (modexp 등)

// const generics 이점:
// - BITS와 LIMBS가 컴파일 타임 결정
// - 모든 크기에 동일 알고리즘 공유
// - 루프 언롤링이 LLVM 최적화에서 자동

// 메모리 레이아웃:
// U256 = 32바이트 (4 × 8바이트)
// 스택에 배치 가능 → 함수 인자 전달 시 register 사용 가능`}
        </pre>
        <p className="leading-7">
          <code>ruint::Uint&lt;BITS, LIMBS&gt;</code>는 <strong>범용 multi-precision integer</strong>.<br />
          U256만 위한 게 아니라 BLS12-381(U384), 모듈러 지수(U512) 등 모든 크기 지원.<br />
          Go의 <code>big.Int</code> 같은 런타임 BigInt와 달리 모든 크기가 컴파일 타임에 결정됨.
        </p>

        {/* ── overflowing_add ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">overflowing_add — carry 전파 메커니즘</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`impl U256 {
    /// wrapping 덧셈 — EVM 기본 동작 (mod 2^256)
    pub fn overflowing_add(self, rhs: Self) -> (Self, bool) {
        let mut result = [0u64; 4];
        let mut carry = 0u64;

        // limb[0] → limb[1] → limb[2] → limb[3] 순서로 carry 전파
        for i in 0..4 {
            let (sum1, c1) = self.limbs[i].overflowing_add(rhs.limbs[i]);
            let (sum2, c2) = sum1.overflowing_add(carry);
            result[i] = sum2;
            carry = (c1 as u64) + (c2 as u64);  // 0 or 1 or 2
        }
        (Self { limbs: result }, carry != 0)
    }
}

// 어셈블리 수준 (x86_64):
// add rax, rcx      ; limb[0] + rhs[0]
// adc rbx, rdx      ; limb[1] + rhs[1] + carry
// adc r8,  r9       ; limb[2] + rhs[2] + carry
// adc r10, r11      ; limb[3] + rhs[3] + carry
// → 4개 명령어로 256비트 덧셈 완료

// LLVM이 위 코드를 "add chain with carry"로 인식하여 직접 생성
// 수동 인라인 어셈블리 없이도 최적 코드 달성`}
        </pre>
        <p className="leading-7">
          <code>overflowing_add</code>은 Rust 표준 라이브러리의 <code>u64</code> 메서드 — 컴파일러가 <code>ADC</code>(add with carry) 명령어로 직접 변환.<br />
          4개 limb × 4개 ADC 명령어 = 256비트 덧셈이 4 clock cycle 근처에서 완료.<br />
          Go의 big.Int는 유사한 연산에 slice 경계 체크, 길이 조정 로직이 추가되어 느림.
        </p>

        {/* ── checked vs wrapping vs saturating ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">3가지 오버플로 전략</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 1. wrapping_add — EVM ADD opcode 동작
let a = U256::MAX;
let b = U256::from(1);
let c = a.wrapping_add(b);  // = U256::ZERO (mod 2^256 wrap around)

// 2. checked_add — None on overflow
let c = a.checked_add(b);   // = None
if let Some(result) = a.checked_add(b) { ... }

// 3. saturating_add — MAX clamp
let c = a.saturating_add(b); // = U256::MAX

// 4. overflowing_add — (result, overflow flag)
let (c, overflow) = a.overflowing_add(b);  // = (ZERO, true)

// 사용 맥락별:
// - EVM opcode (ADD, MUL): wrapping 사용 (스펙 요구)
// - 가스 계산: checked 사용 (오버플로 = out of gas)
// - 실제 잔고 연산: checked_sub (잔고 부족 감지)
// - 수수료 계산: saturating (초과 시 최대값 clamp)
//
// 이 명시적 선택이 Rust의 안전성 핵심
// Go는 자동 wrapping → 무음 오버플로 버그 가능`}
        </pre>
        <p className="leading-7">
          Rust는 <strong>오버플로 정책을 명시적으로 선택</strong>하도록 강제.<br />
          EVM opcode는 wrapping이 맞지만, 애플리케이션 레벨 잔고 계산은 checked가 맞음.<br />
          같은 덧셈 연산이라도 의도에 따라 4가지 방식 중 선택 — Go의 "기본 wrapping"보다 안전.
        </p>

        {/* ── EVM에서의 활용 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">EVM opcode 구현에서의 U256 사용</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// revm의 ADD opcode 구현 (단순화)
fn op_add(interpreter: &mut Interpreter) {
    let a = interpreter.stack.pop().unwrap();  // U256
    let b = interpreter.stack.pop().unwrap();  // U256
    let c = a.wrapping_add(b);                 // mod 2^256
    interpreter.stack.push(c);
}

// MUL opcode — 256×256 → 512비트 연산, 하위 256비트만 유지
fn op_mul(interpreter: &mut Interpreter) {
    let a = interpreter.stack.pop().unwrap();
    let b = interpreter.stack.pop().unwrap();
    let c = a.wrapping_mul(b);
    interpreter.stack.push(c);
}

// DIV opcode — 0으로 나누기는 0 반환 (EVM 스펙)
fn op_div(interpreter: &mut Interpreter) {
    let a = interpreter.stack.pop().unwrap();
    let b = interpreter.stack.pop().unwrap();
    let c = if b.is_zero() { U256::ZERO } else { a / b };
    interpreter.stack.push(c);
}

// MOD, EXP, ADDMOD, MULMOD 등도 모두 U256 기반
// 모든 EVM 스택 연산이 U256 워드 단위

// 성능 핵심:
// - 스택 자체가 Vec<U256> (각 슬롯 32바이트)
// - push/pop이 32바이트 memcpy
// - 연산은 register 사용으로 1~수십 cycles`}
        </pre>
        <p className="leading-7">
          EVM 스택이 <code>Vec&lt;U256&gt;</code>이므로, 각 opcode는 본질적으로 U256 연산.<br />
          push/pop, arithmetic, comparison 모두 U256 단위 — CPU register에 fit하는 최대 크기.<br />
          Rust의 U256이 stack-allocated라 EVM 실행이 힙 할당 없이 진행.
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">💡 성능 비교: Geth vs Reth U256</p>
          <p className="mt-2">
            동일 연산 (100만 번 덧셈) 벤치마크:<br />
            - Geth <code>big.Int.Add</code>: ~150ms (힙 할당 포함)<br />
            - Reth <code>U256.wrapping_add</code>: ~3ms (스택만)<br />
            - 차이: ~50배
          </p>
          <p className="mt-2">
            원인 분석:<br />
            1. <strong>힙 할당</strong> — big.Int는 새 결과마다 <code>make([]Word, N)</code><br />
            2. <strong>길이 체크</strong> — big.Int는 상위 0 bytes 정리 (canonical form)<br />
            3. <strong>GC 추적</strong> — 임시 big.Int가 GC 루트에서 추적<br />
            4. <strong>인터페이스 디스패치</strong> — big.Int 메서드는 method table 경유
          </p>
          <p className="mt-2">
            Rust U256의 우위:<br />
            - 고정 크기 [u64; 4] → 스택<br />
            - 길이 체크 불필요 (항상 4 limbs)<br />
            - inline 가능 (제네릭 특수화)<br />
            - 컴파일러가 ADC chain 자동 생성
          </p>
        </div>
      </div>

      <div className="not-prose">
        <U256ArithViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
    </section>
  );
}

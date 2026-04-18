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
        <div className="rounded-lg border border-border bg-muted/30 p-5 my-4">
          <div className="rounded border border-border bg-background px-3 py-2 text-sm mb-3">
            <code>{'pub struct Uint<const BITS: usize, const LIMBS: usize> { limbs: [u64; LIMBS] }'}</code>
          </div>
          <p className="text-sm font-semibold mb-2">이더리움에서 사용하는 별칭</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm mb-4">
            <div className="rounded border border-border bg-background px-3 py-1.5"><code>U128</code> = 2 limbs</div>
            <div className="rounded border border-border bg-background px-3 py-1.5"><code>U160</code> = 3 limbs (Address 정수)</div>
            <div className="rounded border border-border bg-background px-3 py-1.5 font-semibold"><code>U256</code> = 4 limbs (EVM 워드)</div>
            <div className="rounded border border-border bg-background px-3 py-1.5"><code>U384</code> = 6 limbs (BLS12-381)</div>
            <div className="rounded border border-border bg-background px-3 py-1.5"><code>U512</code> = 8 limbs (modexp)</div>
          </div>
          <p className="text-sm font-semibold mb-2">const generics 이점</p>
          <div className="space-y-1.5 text-sm">
            <div className="flex items-start gap-2"><span className="text-emerald-500 font-bold">-</span> BITS와 LIMBS가 컴파일 타임 결정</div>
            <div className="flex items-start gap-2"><span className="text-emerald-500 font-bold">-</span> 모든 크기에 동일 알고리즘 공유</div>
            <div className="flex items-start gap-2"><span className="text-emerald-500 font-bold">-</span> LLVM 최적화에서 루프 언롤링 자동</div>
            <div className="flex items-start gap-2"><span className="text-emerald-500 font-bold">-</span> U256 = 32B → 스택 배치, 함수 인자 시 register 사용 가능</div>
          </div>
        </div>
        <p className="leading-7">
          <code>ruint::Uint&lt;BITS, LIMBS&gt;</code>는 <strong>범용 multi-precision integer</strong>.<br />
          U256만 위한 게 아니라 BLS12-381(U384), 모듈러 지수(U512) 등 모든 크기 지원.<br />
          Go의 <code>big.Int</code> 같은 런타임 BigInt와 달리 모든 크기가 컴파일 타임에 결정됨.
        </p>

        {/* ── overflowing_add ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">overflowing_add — carry 전파 메커니즘</h3>
        <div className="rounded-lg border border-border bg-muted/30 p-5 my-4">
          <p className="text-sm font-semibold mb-2"><code>overflowing_add(self, rhs) -&gt; (Self, bool)</code></p>
          <div className="space-y-2 text-sm mb-4">
            <div className="rounded border border-border bg-background px-3 py-2 flex items-start gap-2">
              <span className="font-bold text-indigo-500 shrink-0">0</span>
              <span><code>limbs[0]</code>: <code>self[0].overflowing_add(rhs[0])</code> → sum + carry</span>
            </div>
            <div className="rounded border border-border bg-background px-3 py-2 flex items-start gap-2">
              <span className="font-bold text-indigo-500 shrink-0">1</span>
              <span><code>limbs[1]</code>: <code>self[1] + rhs[1] + carry</code> → carry 전파</span>
            </div>
            <div className="rounded border border-border bg-background px-3 py-2 flex items-start gap-2">
              <span className="font-bold text-indigo-500 shrink-0">2</span>
              <span><code>limbs[2]</code>: 동일 carry 전파</span>
            </div>
            <div className="rounded border border-border bg-background px-3 py-2 flex items-start gap-2">
              <span className="font-bold text-indigo-500 shrink-0">3</span>
              <span><code>limbs[3]</code>: 마지막 carry가 남으면 256비트 오버플로</span>
            </div>
          </div>
          <p className="text-sm font-semibold mb-2">x86_64 어셈블리 (LLVM 자동 생성)</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm mb-2">
            <div className="rounded border border-border bg-background px-3 py-1.5 text-center font-mono text-xs">add rax, rcx</div>
            <div className="rounded border border-border bg-background px-3 py-1.5 text-center font-mono text-xs">adc rbx, rdx</div>
            <div className="rounded border border-border bg-background px-3 py-1.5 text-center font-mono text-xs">adc r8, r9</div>
            <div className="rounded border border-border bg-background px-3 py-1.5 text-center font-mono text-xs">adc r10, r11</div>
          </div>
          <p className="text-xs text-muted-foreground">4개 명령어로 256비트 덧셈 완료 — LLVM이 "add chain with carry" 패턴 인식, 수동 인라인 ASM 불필요</p>
        </div>
        <p className="leading-7">
          <code>overflowing_add</code>은 Rust 표준 라이브러리의 <code>u64</code> 메서드 — 컴파일러가 <code>ADC</code>(add with carry) 명령어로 직접 변환.<br />
          4개 limb × 4개 ADC 명령어 = 256비트 덧셈이 4 clock cycle 근처에서 완료.<br />
          Go의 big.Int는 유사한 연산에 slice 경계 체크, 길이 조정 로직이 추가되어 느림.
        </p>

        {/* ── checked vs wrapping vs saturating ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">3가지 오버플로 전략</h3>
        <div className="rounded-lg border border-border bg-muted/30 p-5 my-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-4">
            <div className="rounded border border-border bg-background px-3 py-2">
              <p className="font-semibold mb-1"><code>wrapping_add</code></p>
              <p className="text-muted-foreground"><code>U256::MAX + 1</code> = <code>U256::ZERO</code> (mod 2^256)</p>
            </div>
            <div className="rounded border border-border bg-background px-3 py-2">
              <p className="font-semibold mb-1"><code>checked_add</code></p>
              <p className="text-muted-foreground"><code>U256::MAX + 1</code> = <code>None</code></p>
            </div>
            <div className="rounded border border-border bg-background px-3 py-2">
              <p className="font-semibold mb-1"><code>saturating_add</code></p>
              <p className="text-muted-foreground"><code>U256::MAX + 1</code> = <code>U256::MAX</code> (clamp)</p>
            </div>
            <div className="rounded border border-border bg-background px-3 py-2">
              <p className="font-semibold mb-1"><code>overflowing_add</code></p>
              <p className="text-muted-foreground"><code>U256::MAX + 1</code> = <code>(ZERO, true)</code></p>
            </div>
          </div>
          <p className="text-sm font-semibold mb-2">사용 맥락별 선택</p>
          <div className="space-y-2 text-sm">
            <div className="rounded border border-border bg-background px-3 py-2">
              <span className="font-medium">EVM opcode</span> (ADD, MUL): <code>wrapping</code> — 스펙 요구
            </div>
            <div className="rounded border border-border bg-background px-3 py-2">
              <span className="font-medium">가스 계산</span>: <code>checked</code> — 오버플로 = out of gas
            </div>
            <div className="rounded border border-border bg-background px-3 py-2">
              <span className="font-medium">잔고 연산</span>: <code>checked_sub</code> — 잔고 부족 감지
            </div>
            <div className="rounded border border-border bg-background px-3 py-2">
              <span className="font-medium">수수료 계산</span>: <code>saturating</code> — 초과 시 MAX clamp
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">이 명시적 선택이 Rust의 안전성 핵심 — Go는 자동 wrapping → 무음 오버플로 버그 가능</p>
        </div>
        <p className="leading-7">
          Rust는 <strong>오버플로 정책을 명시적으로 선택</strong>하도록 강제.<br />
          EVM opcode는 wrapping이 맞지만, 애플리케이션 레벨 잔고 계산은 checked가 맞음.<br />
          같은 덧셈 연산이라도 의도에 따라 4가지 방식 중 선택 — Go의 "기본 wrapping"보다 안전.
        </p>

        {/* ── EVM에서의 활용 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">EVM opcode 구현에서의 U256 사용</h3>
        <div className="rounded-lg border border-border bg-muted/30 p-5 my-4">
          <p className="text-sm font-semibold mb-2">revm opcode 구현 (단순화)</p>
          <div className="space-y-2 text-sm mb-4">
            <div className="rounded border border-border bg-background px-3 py-2">
              <span className="font-semibold">ADD</span> — <code>a.wrapping_add(b)</code> → mod 2^256
            </div>
            <div className="rounded border border-border bg-background px-3 py-2">
              <span className="font-semibold">MUL</span> — <code>a.wrapping_mul(b)</code> → 256x256 → 하위 256비트만 유지
            </div>
            <div className="rounded border border-border bg-background px-3 py-2">
              <span className="font-semibold">DIV</span> — <code>if b.is_zero() {'{'} U256::ZERO {'}'} else {'{'} a / b {'}'}</code> → 0으로 나누기는 0 반환 (EVM 스펙)
            </div>
          </div>
          <p className="text-xs text-muted-foreground mb-3">MOD, EXP, ADDMOD, MULMOD 등도 모두 U256 기반 — 모든 EVM 스택 연산이 U256 워드 단위</p>
          <p className="text-sm font-semibold mb-2">성능 핵심</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
            <div className="rounded border border-border bg-background px-3 py-1.5">스택 = <code>{'Vec<U256>'}</code> (슬롯당 32B)</div>
            <div className="rounded border border-border bg-background px-3 py-1.5">push/pop = 32B memcpy</div>
            <div className="rounded border border-border bg-background px-3 py-1.5">연산 = register → 1~수십 cycles</div>
          </div>
        </div>
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

import M from '@/components/ui/math';
import OverviewViz from './viz/OverviewViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Fp 소수체 표현</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          BN254의 소수 p는 254비트 — u64 하나(64비트)로는 표현 불가
          <br />
          [u64; 4] 배열로 분할: 4 x 64 = 256비트 공간에 254비트 수를 저장
          <br />
          little-endian 배치 — limbs[0]이 최하위, limbs[3]이 최상위
        </p>
        <p className="leading-7">
          기본 빌딩 블록 세 가지: adc(add-with-carry), sbb(subtract-with-borrow), mac(multiply-accumulate)
          <br />
          이 세 함수 위에 모든 유한체 연산(+, -, *, inv, pow)을 쌓아 올림
        </p>
      </div>
      <div className="not-prose mb-8">
        <OverviewViz onOpenCode={open} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h4>구현 인사이트</h4>
        <p className="leading-7">
          sub_if_gte의 branchless 패턴 — "일단 빼보고 borrow면 원래 값"
          <br />
          조건 분기 없이 상수 시간 실행 — 타이밍 사이드채널 공격 방지
          <br />
          ZK 증명에서 필드 연산은 초당 수백만 회 — 이 수준의 최적화가 전체 성능 좌우
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Big Integer 표현 및 연산</h3>

        {/* 문제 & 해법 */}
        <div className="not-prose my-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-muted/50 rounded-xl p-5 border border-border">
            <p className="text-sm font-semibold text-muted-foreground mb-2">문제</p>
            <p className="text-sm">암호학 소수: 128-512비트</p>
            <p className="text-sm">CPU 레지스터: 32 또는 64비트</p>
            <p className="text-sm mt-1 text-muted-foreground">"큰 수"를 표현하고 연산해야 함</p>
          </div>
          <div className="bg-muted/50 rounded-xl p-5 border border-border">
            <p className="text-sm font-semibold text-muted-foreground mb-2">해법 — limb 기반 산술</p>
            <p className="text-sm">256비트 수를 4 x 64비트 limb 배열로 표현</p>
            <p className="text-sm mt-1"><code className="text-xs bg-muted px-1 rounded">[a0, a1, a2, a3]</code> =</p>
            <M display>{'N = a_0 + a_1 \\cdot 2^{64} + a_2 \\cdot 2^{128} + a_3 \\cdot 2^{192}'}</M>
          </div>
        </div>

        {/* Primitive operations */}
        <div className="not-prose my-4 bg-muted/50 rounded-xl border border-border overflow-hidden">
          <div className="bg-muted px-5 py-2 border-b border-border">
            <span className="text-sm font-semibold">Primitive Operations — 세 가지 빌딩 블록</span>
          </div>
          <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="font-semibold mb-1"><code className="text-xs bg-muted px-1 rounded">adc</code> (add-with-carry)</p>
              <p className="text-xs text-muted-foreground">(sum, carry) = a + b + carry_in</p>
              <p className="text-xs mt-1">x86 <code className="text-xs bg-muted px-1 rounded">addc</code> 명령어 사용</p>
              <p className="text-xs">출력: 64비트 합 + 1비트 carry</p>
            </div>
            <div>
              <p className="font-semibold mb-1"><code className="text-xs bg-muted px-1 rounded">sbb</code> (subtract-with-borrow)</p>
              <p className="text-xs text-muted-foreground">(diff, borrow) = a - b - borrow_in</p>
              <p className="text-xs mt-1">x86 <code className="text-xs bg-muted px-1 rounded">sbb</code> 명령어 사용</p>
              <p className="text-xs">출력: 64비트 차 + 1비트 borrow</p>
            </div>
            <div>
              <p className="font-semibold mb-1"><code className="text-xs bg-muted px-1 rounded">mac</code> (multiply-accumulate)</p>
              <p className="text-xs text-muted-foreground">(hi, lo) = a * b + c + d</p>
              <p className="text-xs mt-1">64x64 = 128비트 곱 + 덧셈</p>
              <p className="text-xs">다중 정밀도 곱셈의 핵심</p>
            </div>
          </div>
        </div>

        {/* Basic field operations */}
        <div className="not-prose my-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-muted/50 rounded-xl p-5 border border-border">
            <p className="text-sm font-semibold text-muted-foreground mb-2">덧셈 (mod p)</p>
            <p className="text-sm"><code className="text-xs bg-muted px-1 rounded">sum = add_limbs(a, b)</code></p>
            <p className="text-xs text-muted-foreground mt-1">carry chain으로 전체 덧셈</p>
            <p className="text-sm mt-1"><code className="text-xs bg-muted px-1 rounded">if sum &ge; p: sum -= p</code></p>
            <p className="text-xs text-muted-foreground mt-1">조건부 감산</p>
          </div>
          <div className="bg-muted/50 rounded-xl p-5 border border-border">
            <p className="text-sm font-semibold text-muted-foreground mb-2">뺄셈 (mod p)</p>
            <p className="text-sm"><code className="text-xs bg-muted px-1 rounded">diff = sub_limbs(a, b)</code></p>
            <p className="text-xs text-muted-foreground mt-1">borrow chain으로 전체 뺄셈</p>
            <p className="text-sm mt-1"><code className="text-xs bg-muted px-1 rounded">if borrow: diff += p</code></p>
            <p className="text-xs text-muted-foreground mt-1">음수 wrap-around</p>
          </div>
          <div className="bg-muted/50 rounded-xl p-5 border border-border">
            <p className="text-sm font-semibold text-muted-foreground mb-2">곱셈 (mod p)</p>
            <p className="text-sm"><code className="text-xs bg-muted px-1 rounded">product = full_mult(a, b)</code></p>
            <p className="text-xs text-muted-foreground mt-1">4x4 = 8 limbs schoolbook</p>
            <p className="text-sm mt-1"><code className="text-xs bg-muted px-1 rounded">result = mod_reduce(product, p)</code></p>
            <p className="text-xs text-muted-foreground mt-1">Montgomery 또는 Barrett 리덕션</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground ml-1">성능: Fp 곱셈 1회당 ~20-30 CPU 사이클</p>

        {/* Constant-time */}
        <div className="not-prose my-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-red-50 dark:bg-red-950/30 rounded-xl p-5 border border-red-200 dark:border-red-800">
            <p className="text-sm font-semibold text-red-700 dark:text-red-300 mb-2">BAD — 분기 있음</p>
            <p className="text-sm font-mono">if carry {'{'} result -= p; {'}'}</p>
            <p className="text-xs text-muted-foreground mt-2">CPU 분기 예측기가 조건 결과를 노출</p>
            <p className="text-xs text-muted-foreground">타이밍 공격으로 비밀 키 유출 가능</p>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-xl p-5 border border-emerald-200 dark:border-emerald-800">
            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 mb-2">GOOD — branchless</p>
            <p className="text-sm font-mono text-xs">let mask = (borrow as i64).wrapping_neg() as u64;</p>
            <p className="text-sm font-mono text-xs mt-1">result[i] = result[i].wrapping_add(p[i] & mask);</p>
            <p className="text-xs text-muted-foreground mt-2">조건 분기 없이 상수 시간 실행</p>
            <p className="text-xs text-muted-foreground">암호학 연산은 반드시 상수 시간이어야 함</p>
          </div>
        </div>

        {/* Rust implementation pattern */}
        <div className="not-prose my-4 bg-muted/50 rounded-xl border border-border overflow-hidden">
          <div className="bg-muted px-5 py-2 border-b border-border">
            <span className="text-sm font-semibold">Rust 구현 패턴</span>
          </div>
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-muted-foreground mb-1">구조체</p>
              <p><code className="text-xs bg-muted px-1 rounded">pub struct Fp(pub [u64; 4])</code></p>
              <p className="text-xs text-muted-foreground mt-2 mb-1">add 구현</p>
              <p className="text-xs">4회 <code className="text-xs bg-muted px-1 rounded">adc</code> 루프로 carry chain 덧셈</p>
              <p className="text-xs mt-1"><code className="text-xs bg-muted px-1 rounded">sub_if_gte(result, &P)</code> — 조건부 감산</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">sub_if_gte — "일단 빼보고 borrow면 원래 값"</p>
              <p className="text-xs">4회 <code className="text-xs bg-muted px-1 rounded">sbb</code> 루프로 a - p 시도</p>
              <p className="text-xs mt-1">borrow 발생 시 mask = <code className="text-xs bg-muted px-1 rounded">0xFFFF...FFFF</code></p>
              <p className="text-xs mt-1"><code className="text-xs bg-muted px-1 rounded">(diff & !mask) | (a & mask)</code> — branchless 선택</p>
            </div>
          </div>
        </div>

        {/* Montgomery & Production */}
        <div className="not-prose my-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-muted/50 rounded-xl p-5 border border-border">
            <p className="text-sm font-semibold text-muted-foreground mb-2">Montgomery 형태</p>
            <p className="text-sm">모든 값을 <M>{'x \\cdot R \\bmod p'}</M> 형태로 저장 (<M>{'R = 2^{256}'}</M>)</p>
            <p className="text-sm mt-1">곱셈에서 나눗셈 없이 자동 리덕션</p>
            <p className="text-sm mt-1">덧셈/뺄셈은 변경 없음</p>
            <p className="text-sm mt-1 text-muted-foreground">입출력 경계에서만 변환</p>
          </div>
          <div className="bg-muted/50 rounded-xl p-5 border border-border">
            <p className="text-sm font-semibold text-muted-foreground mb-2">프로덕션 라이브러리</p>
            <p className="text-sm"><strong>BLST</strong> (Supranational) — hand-tuned AVX/NEON asm</p>
            <p className="text-sm mt-1"><strong>BoringSSL</strong> (Google) — 상수 시간 곡선 연산</p>
            <p className="text-sm mt-1"><strong>ark-ff</strong> (Arkworks) — pure Rust + <code className="text-xs bg-muted px-1 rounded">#[asm]</code></p>
          </div>
        </div>

        {/* ZK hot path & Curve-specific */}
        <div className="not-prose my-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-muted/50 rounded-xl p-5 border border-border">
            <p className="text-sm font-semibold text-muted-foreground mb-2">ZK 프로버 핫 패스</p>
            <p className="text-sm">전형적 증명 계산: <M>{'10^6 \\sim 10^9'}</M> Fp 곱셈</p>
            <p className="text-sm mt-1">20ns/회 기준: ~100ms ~ 20초</p>
            <p className="text-xs text-muted-foreground mt-2">SIMD (AVX-512): 배치 연산 2-3배 가속</p>
            <p className="text-xs text-muted-foreground">GPU: MSM에서 10-100배 가속</p>
            <p className="text-xs text-muted-foreground">ASIC: 반복 워크로드 1000배+ 가속</p>
          </div>
          <div className="bg-muted/50 rounded-xl p-5 border border-border">
            <p className="text-sm font-semibold text-muted-foreground mb-2">곡선별 limb 수</p>
            <div className="text-sm space-y-1">
              <p><strong>BN254</strong>: <M>{'p \\approx 2^{254}'}</M> (4 limbs)</p>
              <p><strong>BLS12-381</strong>: <M>{'p \\approx 2^{381}'}</M> (6 limbs)</p>
              <p><strong>secp256k1</strong>: <M>{'p \\approx 2^{256}'}</M> (4 limbs)</p>
              <p><strong>Pasta/Vesta</strong>: <M>{'p \\approx 2^{255}'}</M> (4 limbs)</p>
            </div>
            <p className="text-xs text-muted-foreground mt-2">6-limb 필드는 4-limb 대비 ~2.5배 느림 — 곱셈이 <M>{'O(n^2)'}</M></p>
          </div>
        </div>
      </div>
    </section>
  );
}

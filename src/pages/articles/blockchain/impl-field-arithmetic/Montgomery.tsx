import M from '@/components/ui/math';
import MontViz from './viz/MontViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Montgomery({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="montgomery" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">몽고메리 곱셈</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          일반 모듈러 곱셈: (a * b) mod p — 나눗셈이 필요해 느림
          <br />
          Montgomery 해법: 수를 a * R mod p 형태로 저장하면 나눗셈을 시프트로 대체
          <br />
          R = 2^256이므로 "R로 나누기" = 256비트 오른쪽 시프트
        </p>
        <p className="leading-7">
          mont_mul = schoolbook 4x4 곱셈 + REDC(Montgomery reduction)
          <br />
          REDC의 핵심: INV 상수로 하위 limb을 0으로 만들어 제거
          <br />
          4회 반복 후 8-limb을 4-limb으로 축소 — 결과는 자동으로 mod p
        </p>
      </div>
      <div className="not-prose mb-8">
        <MontViz onOpenCode={open} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h4>구현 인사이트</h4>
        <p className="leading-7">
          INV = -p^(-1) mod 2^64 — Newton법으로 컴파일 타임에 6회 반복으로 계산
          <br />
          각 반복마다 정밀도 2배: 1 → 2 → 4 → 8 → 16 → 32 → 64비트
          <br />
          inv()가 pow(p-2)로 구현된 것도 핵심 — 확장 유클리드 없이 한 줄로 역원
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Montgomery 알고리즘 상세</h3>

        {/* 문제 & 해법 */}
        <div className="not-prose my-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-muted/50 rounded-xl p-5 border border-border">
            <p className="text-sm font-semibold text-muted-foreground mb-2">문제</p>
            <p className="text-sm"><M>{'(a \\times b) \\bmod p'}</M> 를 효율적으로 계산해야 함</p>
            <p className="text-sm mt-1">직접 방식: 곱한 뒤 p로 나눗셈 — CPU 나눗셈 ~20-40 사이클로 느림</p>
          </div>
          <div className="bg-muted/50 rounded-xl p-5 border border-border">
            <p className="text-sm font-semibold text-muted-foreground mb-2">Montgomery 해법</p>
            <p className="text-sm">"Montgomery 형태"로 R을 스케일링하여 저장</p>
            <p className="text-sm mt-1">나눗셈 완전 제거 — 시프트로 대체</p>
          </div>
        </div>

        {/* Montgomery form */}
        <div className="not-prose my-4 bg-muted/50 rounded-xl border border-border overflow-hidden">
          <div className="bg-muted px-5 py-2 border-b border-border">
            <span className="text-sm font-semibold">Montgomery 형태 — 변환 규칙</span>
          </div>
          <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-xs text-muted-foreground mb-1">원래 값</p>
              <p><M>{'x \\in [0, p)'}</M></p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Montgomery 형태</p>
              <p><M>{'x_{mont} = x \\cdot R \\bmod p'}</M></p>
              <p className="text-xs text-muted-foreground mt-1"><M>{'R = 2^{256}'}</M> (256비트 필드)</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">변환</p>
              <p className="text-xs">To Mont: <code className="text-xs bg-muted px-1 rounded">mont_mul(x, R^2 mod p)</code></p>
              <p className="text-xs mt-1">From Mont: <code className="text-xs bg-muted px-1 rounded">mont_mul(x_mont, 1)</code></p>
            </div>
          </div>
        </div>

        {/* REDC */}
        <div className="not-prose my-4 bg-muted/50 rounded-xl border border-border overflow-hidden">
          <div className="bg-muted px-5 py-2 border-b border-border flex items-center gap-2">
            <span className="text-sm font-semibold">REDC (Montgomery Reduction)</span>
            <span className="text-xs text-muted-foreground">CIOS 변형</span>
          </div>
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-muted-foreground mb-1">정의</p>
              <p><M>{'\\text{REDC}(T) = T \\cdot R^{-1} \\bmod p'}</M></p>
              <p className="text-xs text-muted-foreground mt-1">T: 2n-limb 입력 (<M>{'0 \\le T < p \\cdot R'}</M>)</p>
              <p className="text-xs text-muted-foreground mt-2 mb-1">알고리즘</p>
              <p className="text-xs">for i = 0..n:</p>
              <p className="text-xs ml-2"><code className="text-xs bg-muted px-1 rounded">q = (T[i] * INV) mod 2^64</code></p>
              <p className="text-xs ml-2"><code className="text-xs bg-muted px-1 rounded">T += q * p * 2^(64*i)</code> — 하위 limb을 0으로</p>
              <p className="text-xs mt-1"><code className="text-xs bg-muted px-1 rounded">result = T / R</code> — 하위 limbs 버림</p>
              <p className="text-xs"><code className="text-xs bg-muted px-1 rounded">if result &ge; p: result -= p</code></p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">왜 동작하는가?</p>
              <p className="text-xs">각 반복 후: T의 다음 하위 limb이 0이 됨</p>
              <p className="text-xs mt-1">n회 반복 후: 하위 n개 limb 전부 0</p>
              <p className="text-xs mt-1">따라서 <M>{'T = (\\text{something}) \\cdot R'}</M></p>
              <p className="text-xs mt-1">R로 나누기 = 256비트 오른쪽 시프트 = 하위 limbs 버림</p>
              <p className="text-xs text-muted-foreground mt-3 mb-1">핵심 합동식</p>
              <p className="text-xs"><M>{'T + q \\cdot p \\equiv T \\pmod{p}'}</M> — p의 배수 더하기</p>
              <p className="text-xs mt-1"><M>{'T + q \\cdot p \\equiv 0 \\pmod{R}'}</M> — q 선택에 의해</p>
            </div>
          </div>
        </div>

        {/* mont_mul */}
        <div className="not-prose my-4 bg-muted/50 rounded-xl p-5 border border-border">
          <p className="text-sm font-semibold text-muted-foreground mb-2">Montgomery 곱셈</p>
          <p className="text-sm"><strong>Step 1</strong>: schoolbook 곱셈 — 2n-limb 결과 <M>{'T = a \\cdot b'}</M></p>
          <p className="text-sm mt-1"><strong>Step 2</strong>: REDC(T) — <M>{'T \\cdot R^{-1} \\bmod p'}</M> 반환</p>
          <p className="text-xs text-muted-foreground mt-3">a, b가 Montgomery 형태 (<M>{'aR, bR'}</M>)일 때:</p>
          <p className="text-sm mt-1"><M>{'(aR)(bR) \\cdot R^{-1} = (ab) \\cdot R'}</M> — 결과도 Montgomery 형태</p>
        </div>

        {/* INV & Inverse */}
        <div className="not-prose my-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-muted/50 rounded-xl border border-border overflow-hidden">
            <div className="bg-muted px-5 py-2 border-b border-border">
              <span className="text-sm font-semibold">INV 상수 계산</span>
            </div>
            <div className="p-5 text-sm">
              <p><M>{'\\text{INV} = -p^{-1} \\bmod 2^{64}'}</M></p>
              <p className="text-xs text-muted-foreground mt-2">Newton법 (매 단계 정밀도 2배)</p>
              <p className="text-xs mt-1"><code className="text-xs bg-muted px-1 rounded">inv = 1</code></p>
              <p className="text-xs"><code className="text-xs bg-muted px-1 rounded">inv = inv * (2 - p * inv)</code> &times; 6회 반복</p>
              <p className="text-xs text-muted-foreground mt-1">정밀도: 1 &rarr; 2 &rarr; 4 &rarr; 8 &rarr; 16 &rarr; 32 &rarr; 64비트</p>
              <p className="text-xs mt-1"><code className="text-xs bg-muted px-1 rounded">return -inv</code></p>
              <p className="text-xs text-muted-foreground mt-1">컴파일 타임 const로 사전 계산</p>
            </div>
          </div>
          <div className="bg-muted/50 rounded-xl border border-border overflow-hidden">
            <div className="bg-muted px-5 py-2 border-b border-border">
              <span className="text-sm font-semibold">역원 — Fermat 소정리</span>
            </div>
            <div className="p-5 text-sm">
              <p><M>{'a \\in \\mathbb{F}_p^*: a^{p-1} = 1 \\pmod{p}'}</M></p>
              <p className="mt-1"><M>{'a^{p-2} = a^{-1} \\pmod{p}'}</M></p>
              <p className="text-xs text-muted-foreground mt-2">구현: <code className="text-xs bg-muted px-1 rounded">self.pow(&(P - 2))</code></p>
              <p className="text-xs text-muted-foreground mt-1">비용: ~256 제곱 + ~128 곱 = ~384 Montgomery mults</p>
              <p className="text-xs text-muted-foreground mt-1">상수 시간 — 암호학에 적합</p>
              <p className="text-xs text-muted-foreground mt-3">대안: 확장 유클리드 — 더 빠르지만 NOT 상수 시간</p>
            </div>
          </div>
        </div>

        {/* Performance & Memory */}
        <div className="not-prose my-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-muted/50 rounded-xl border border-border overflow-hidden">
            <div className="bg-muted px-5 py-2 border-b border-border">
              <span className="text-sm font-semibold">성능 비교 (x86_64)</span>
            </div>
            <div className="p-5 text-sm space-y-1">
              <div className="flex justify-between"><span><code className="text-xs bg-muted px-1 rounded">mont_mul</code></span><span>~18 사이클 (adx/bmi2)</span></div>
              <div className="flex justify-between"><span><code className="text-xs bg-muted px-1 rounded">mont_sq</code></span><span>~15 사이클</span></div>
              <div className="flex justify-between"><span><code className="text-xs bg-muted px-1 rounded">add/sub</code></span><span>~2-3 사이클</span></div>
              <div className="flex justify-between"><span><code className="text-xs bg-muted px-1 rounded">inv</code> (pow)</span><span>~7000 사이클</span></div>
              <div className="flex justify-between"><span><code className="text-xs bg-muted px-1 rounded">inv</code> (ext gcd)</span><span className="text-muted-foreground">~1500 (비상수 시간)</span></div>
              <p className="text-xs text-muted-foreground mt-3">Batch inversion (Montgomery trick):</p>
              <p className="text-xs text-muted-foreground"><M>{'\\text{inv}(a_1), \\ldots, \\text{inv}(a_n)'}</M> 한 번에 — 비용: 3(n-1) mults + 1 inv</p>
            </div>
          </div>
          <div className="bg-muted/50 rounded-xl p-5 border border-border">
            <p className="text-sm font-semibold text-muted-foreground mb-2">메모리 레이아웃 최적화</p>
            <p className="text-sm"><code className="text-xs bg-muted px-1 rounded">#[repr(align(32))]</code></p>
            <p className="text-sm"><code className="text-xs bg-muted px-1 rounded">struct Fp([u64; 4])</code></p>
            <p className="text-xs text-muted-foreground mt-2">32바이트 정렬 — 단일 캐시 라인에 적합</p>
            <p className="text-xs text-muted-foreground mt-1">SIMD 로드 명령어 활용 가능</p>
          </div>
        </div>
      </div>
    </section>
  );
}

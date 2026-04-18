import M from '@/components/ui/math';
import ScalarViz from './viz/ScalarViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Scalar({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="scalar" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Fr 스칼라 필드</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          Fr은 BN254 곡선의 위수(order) r로 정의된 필드
          <br />
          Fp와 100% 동일한 구조 — 다른 것은 모듈러스(p vs r) 하나뿐
          <br />
          define_prime_field! 매크로에 상수만 넣으면 전체 산술 자동 생성
        </p>
        <p className="leading-7">
          ZK 증명에서 Fr의 역할: R1CS witness, QAP 다항식 계수, 증명 원소
          <br />
          Groth16/PLONK 프로버가 수행하는 모든 다항식 연산이 Fr 위에서 이루어짐
        </p>
      </div>
      <div className="not-prose mb-8">
        <ScalarViz onOpenCode={open} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h4>구현 인사이트</h4>
        <p className="leading-7">
          Fp를 수동 구현(학습용)하고, Fr은 매크로로 재사용 — 코드 400줄 → 40줄
          <br />
          다른 곡선(BLS12-381 등)으로 전환 시 상수만 교체하면 됨
          <br />
          매크로 내부에서 INV를 Newton법으로 컴파일 타임 자동 계산 — 수동 계산 불필요
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Scalar Field와 Base Field 구분</h3>

        {/* 기본 개념 */}
        <div className="not-prose my-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-muted/50 rounded-xl p-5 border border-border">
            <p className="text-sm font-semibold text-muted-foreground mb-2">타원 곡선 기본</p>
            <p className="text-sm">곡선 E는 base field <M>{'\\mathbb{F}_p'}</M> 위에 정의</p>
            <p className="text-sm mt-1">점 <M>{'P = (x, y)'}</M>, 좌표 <M>{'x, y \\in \\mathbb{F}_p'}</M></p>
            <p className="text-sm mt-1">곡선 위수 <M>{'\\#E(\\mathbb{F}_p) = N \\approx p'}</M></p>
            <p className="text-sm mt-1">N의 최대 소인수 r &rarr; scalar field <M>{'\\mathbb{F}_r'}</M></p>
          </div>
          <div className="bg-muted/50 rounded-xl p-5 border border-border">
            <p className="text-sm font-semibold text-muted-foreground mb-2">BN254의 두 필드</p>
            <p className="text-sm">Base field: <M>{'\\mathbb{F}_p'}</M>, <M>{'p \\approx 2^{254}'}</M></p>
            <p className="text-sm mt-1">Scalar field: <M>{'\\mathbb{F}_r'}</M>, <M>{'r \\approx 2^{254}'}</M></p>
            <p className="text-sm mt-1 text-muted-foreground"><M>{'p \\neq r'}</M> (크기는 비슷)</p>
          </div>
        </div>

        {/* 두 필드 용도 */}
        <div className="not-prose my-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-muted/50 rounded-xl p-5 border border-border">
            <p className="text-sm font-semibold text-muted-foreground mb-2"><M>{'\\mathbb{F}_p'}</M> (Base Field) 용도</p>
            <p className="text-sm">좌표 산술 (coordinate arithmetic)</p>
            <p className="text-sm mt-1">점 덧셈, 더블링</p>
            <p className="text-sm mt-1">line function 평가</p>
            <p className="text-sm mt-1">페어링 중간 결과 (Fp2/6/12 경유)</p>
          </div>
          <div className="bg-muted/50 rounded-xl p-5 border border-border">
            <p className="text-sm font-semibold text-muted-foreground mb-2"><M>{'\\mathbb{F}_r'}</M> (Scalar Field) 용도</p>
            <p className="text-sm">스칼라 곱셈: <M>{'s \\cdot P'}</M></p>
            <p className="text-sm mt-1">곡선 그룹의 위수</p>
            <p className="text-sm mt-1">ZK 회로의 witness 값</p>
            <p className="text-sm mt-1">다항식 계수</p>
          </div>
        </div>

        {/* BN254 concrete values */}
        <div className="not-prose my-4 bg-muted/50 rounded-xl border border-border overflow-hidden">
          <div className="bg-muted px-5 py-2 border-b border-border">
            <span className="text-sm font-semibold">BN254 구체적 수치</span>
          </div>
          <div className="p-5 text-sm space-y-2">
            <div>
              <p className="text-xs text-muted-foreground mb-1">p (base field prime)</p>
              <p className="text-xs font-mono break-all">21888242871839275222246405745257275088696311157297823662689037894645226208583</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">r (scalar field prime)</p>
              <p className="text-xs font-mono break-all">21888242871839275222246405745257275088548364400416034343698204186575808495617</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              <div>
                <p className="text-xs"><M>{'p - 1'}</M>: 2-adicity = <strong>1</strong> (2로 1회만 나눠짐)</p>
              </div>
              <div>
                <p className="text-xs"><M>{'r - 1'}</M>: 2-adicity = <strong>28</strong> (FFT-friendly)</p>
                <p className="text-xs text-muted-foreground mt-1"><M>{'r - 1 = 2^{28} \\cdot 3^2 \\cdot 13 \\cdot \\ldots'}</M> &rarr; NTT <M>{'2^{28}'}</M>까지 가능</p>
              </div>
            </div>
          </div>
        </div>

        {/* FFT 이유 */}
        <div className="not-prose my-4 bg-muted/50 rounded-xl p-5 border border-border">
          <p className="text-sm font-semibold text-muted-foreground mb-2">r-1이 2-smooth해야 하는 이유 (ZK)</p>
          <p className="text-sm">NTT는 transform 크기 n이 <M>{'n \\mid (p - 1)'}</M>이어야 동작</p>
          <p className="text-sm mt-1">ZK 회로 m개 제약 &rarr; <M>{'n = 2^{\\lceil \\log_2 m \\rceil}'}</M>, 일반적으로 <M>{'2^{20} \\sim 2^{28}'}</M></p>
          <p className="text-sm mt-1 text-muted-foreground"><M>{'r - 1'}</M>의 2-adicity 28 덕분에 <M>{'2^{28}'}</M> 크기 NTT 지원</p>
        </div>

        {/* 매크로 재사용 */}
        <div className="not-prose my-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-muted/50 rounded-xl border border-border overflow-hidden">
            <div className="bg-muted px-5 py-2 border-b border-border">
              <span className="text-sm font-semibold">Fp 매크로 정의</span>
            </div>
            <div className="p-5 text-sm">
              <p><code className="text-xs bg-muted px-1 rounded">define_prime_field!</code></p>
              <p className="mt-1"><code className="text-xs bg-muted px-1 rounded">struct Fp(pub [u64; 4])</code></p>
              <p className="text-xs text-muted-foreground mt-1">P = [0x3c208c16..., ...]</p>
              <p className="text-xs text-muted-foreground">INV = 0x87d20782e4866389</p>
            </div>
          </div>
          <div className="bg-muted/50 rounded-xl border border-border overflow-hidden">
            <div className="bg-muted px-5 py-2 border-b border-border">
              <span className="text-sm font-semibold">Fr 매크로 정의 — 상수만 다름</span>
            </div>
            <div className="p-5 text-sm">
              <p><code className="text-xs bg-muted px-1 rounded">define_prime_field!</code></p>
              <p className="mt-1"><code className="text-xs bg-muted px-1 rounded">struct Fr(pub [u64; 4])</code></p>
              <p className="text-xs text-muted-foreground mt-1">P = [0x43e1f593..., ...]</p>
              <p className="text-xs text-muted-foreground">INV = 0xc2e1f593efffffff</p>
            </div>
          </div>
        </div>

        {/* Generic pattern */}
        <div className="not-prose my-4 bg-muted/50 rounded-xl border border-border overflow-hidden">
          <div className="bg-muted px-5 py-2 border-b border-border flex items-center gap-2">
            <span className="text-sm font-semibold">Generic 구현 (arkworks 패턴)</span>
          </div>
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Field trait</p>
              <p><code className="text-xs bg-muted px-1 rounded">trait Field: Add + Mul + Neg + Inv + From&lt;u64&gt;</code></p>
              <p className="text-xs mt-1"><code className="text-xs bg-muted px-1 rounded">impl Field for Fp</code></p>
              <p className="text-xs"><code className="text-xs bg-muted px-1 rounded">impl Field for Fr</code></p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">제네릭 알고리즘</p>
              <p><code className="text-xs bg-muted px-1 rounded">fn polynomial_evaluate&lt;F: Field&gt;(coeffs: &[F], x: F) -&gt; F</code></p>
              <p className="text-xs text-muted-foreground mt-1">곡선 전환 시 상수만 교체:</p>
              <p className="text-xs mt-1"><code className="text-xs bg-muted px-1 rounded">BlsFp(pub [u64; 6])</code> — 381비트, 6 limbs</p>
              <p className="text-xs"><code className="text-xs bg-muted px-1 rounded">BlsFr(pub [u64; 4])</code> — 255비트, 4 limbs</p>
            </div>
          </div>
        </div>

        {/* Invariants & Pitfalls */}
        <div className="not-prose my-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-xl p-5 border border-emerald-200 dark:border-emerald-800">
            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 mb-2">필수 불변량</p>
            <p className="text-sm">값은 항상 mod p (또는 r)로 리듀스</p>
            <p className="text-sm mt-1">상수 시간 연산 (비밀 값에 대한 분기 금지)</p>
            <p className="text-sm mt-1">Montgomery 형태 일관성 유지</p>
            <p className="text-sm mt-1">타입 안전성: Fp와 Fr 값 혼합 불가</p>
          </div>
          <div className="bg-red-50 dark:bg-red-950/30 rounded-xl p-5 border border-red-200 dark:border-red-800">
            <p className="text-sm font-semibold text-red-700 dark:text-red-300 mb-2">흔한 실수</p>
            <p className="text-sm"><strong>1.</strong> 잘못된 필드로 스칼라 곱: <M>{'s \\in \\mathbb{F}_p'}</M>로 <M>{'s \\cdot P'}</M> &rarr; 수학적 오류</p>
            <p className="text-sm mt-1"><strong>2.</strong> 리듀스 누락: 뺄셈 후 &gt; p일 수 있음 &rarr; 조건부 감산 필수</p>
            <p className="text-sm mt-1"><strong>3.</strong> Montgomery 형태 혼동: Mont-form과 일반 값 혼합 &rarr; 타입 구분으로 방지</p>
          </div>
        </div>

        {/* Benchmarks */}
        <div className="not-prose my-4 bg-muted/50 rounded-xl border border-border overflow-hidden">
          <div className="bg-muted px-5 py-2 border-b border-border">
            <span className="text-sm font-semibold">벤치마크 (싱글 스레드, AMD Zen 3)</span>
          </div>
          <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Fp (BN254, 254비트)</p>
              <div className="space-y-0.5">
                <div className="flex justify-between text-xs"><span>add</span><span>~2 ns</span></div>
                <div className="flex justify-between text-xs"><span>mult</span><span>~18 ns</span></div>
                <div className="flex justify-between text-xs"><span>inv (pow)</span><span>~4000 ns</span></div>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Fr (BN254, 254비트)</p>
              <p className="text-xs">Fp와 동일 성능 (같은 limb 수)</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">BLS12-381 Fp (381비트, 6 limbs)</p>
              <div className="space-y-0.5">
                <div className="flex justify-between text-xs"><span>add</span><span>~3 ns</span></div>
                <div className="flex justify-between text-xs"><span>mult</span><span>~35 ns</span></div>
                <div className="flex justify-between text-xs"><span>inv</span><span>~10000 ns</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

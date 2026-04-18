import M from '@/components/ui/math';
import GateTypesViz from './viz/GateTypesViz';

export default function GateTypes() {
  return (
    <section id="gate-types" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">게이트 타입 상세</h2>
      <div className="not-prose mb-8"><GateTypesViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">산술 게이트</h3>
        <p>모든 게이트의 기본. <strong>4개 와이어</strong>와 <strong>6개 선택자</strong>로 임의 산술 관계를 표현한다.</p>
        <div className="not-prose my-4">
          <div className="rounded-lg border border-sky-500/30 p-4">
            <p className="font-semibold text-sm text-sky-400 mb-2">산술 게이트 (Arithmetic Gate)</p>
            <div className="my-2 text-center">
              <M display>{'q_m \\cdot a \\cdot b + q_l \\cdot a + q_r \\cdot b + q_o \\cdot c + q_4 \\cdot d + q_c = 0'}</M>
            </div>
            <p className="text-sm text-muted-foreground">덧셈, 곱셈, 혼합 연산 모두 하나의 등식으로 표현</p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">범위 게이트</h3>
        <p>값이 특정 범위 내에 있음을 증명. <strong>4비트 쿼드 분해</strong>로 효율적으로 검증한다.</p>
        <div className="not-prose my-4">
          <div className="rounded-lg border border-emerald-500/30 p-4">
            <p className="font-semibold text-sm text-emerald-400 mb-2">범위 게이트 (Range Gate) -- 쿼드 분해 방식</p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>값 <code>v</code>를 4비트 쿼드(quads)로 분해</li>
              <li>각 쿼드: <M>{'0 \\le q_i \\le 3'}</M> 검증</li>
              <li>재결합: <M>{'v = \\sum q_i \\cdot 4^i'}</M> 확인</li>
            </ul>
            <div className="grid grid-cols-2 gap-3 text-sm text-center mt-3">
              <div className="bg-muted/50 rounded p-2"><strong>8비트 range</strong><br />2개 범위 게이트</div>
              <div className="bg-muted/50 rounded p-2"><strong>32비트 range</strong><br />8개 범위 게이트</div>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">논리 게이트</h3>
        <div className="not-prose my-4">
          <div className="rounded-lg border border-amber-500/30 p-4">
            <p className="font-semibold text-sm text-amber-400 mb-2">논리 게이트 (AND / XOR)</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><p className="font-medium text-foreground/80">AND</p><p className="text-muted-foreground"><M>{'a \\wedge b'}</M> -- 비트별 논리곱</p></div>
              <div><p className="font-medium text-foreground/80">XOR</p><p className="text-muted-foreground"><M>{'a \\oplus b'}</M> -- 비트별 배타적 논리합</p></div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">4비트 단위로 처리: 각 쿼드에서 비트 분해 → 논리 연산 → 재결합</p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">ECC 게이트</h3>
        <div className="not-prose my-4">
          <div className="rounded-lg border border-violet-500/30 p-4 space-y-3">
            <div>
              <p className="font-semibold text-sm text-violet-400 mb-1">고정 기반 스칼라 곱 (Fixed-base Scalar Mul)</p>
              <ul className="text-sm space-y-0.5 text-muted-foreground">
                <li>사전 계산된 테이블 <M>{'T[i] = i \\cdot G'}</M></li>
                <li>스칼라를 4비트씩 분해 → <M>{'T[q_i]'}</M> 룩업</li>
              </ul>
            </div>
            <div className="border-t border-border/40 pt-3">
              <p className="font-semibold text-sm text-sky-400 mb-1">가변 기반 그룹 덧셈 (Variable-base)</p>
              <ul className="text-sm space-y-0.5 text-muted-foreground">
                <li>완전 덧셈 공식 (complete addition formula)</li>
                <li><M>{'P + Q = R'}</M>: 제약 4개로 표현</li>
              </ul>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">룩업 게이트</h3>
        <div className="not-prose my-4">
          <div className="rounded-lg border border-rose-500/30 p-4">
            <p className="font-semibold text-sm text-rose-400 mb-2">PlonkUp 룩업 (Plookup 통합 게이트)</p>
            <ul className="text-sm space-y-0.5 text-muted-foreground">
              <li>PlonkUp: PLONK + Plookup 통합</li>
              <li><code>q_lookup = 1</code>인 행에서 <code>(a, b, c) &isin; Table</code> 검증</li>
              <li>range check, XOR 등에 활용</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

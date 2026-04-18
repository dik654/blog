import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import M from '@/components/ui/math';
import SignViz from './viz/SignViz';
import { codeRefs } from './codeRefs';

export default function DilithiumSign({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="dilithium-sign" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Dilithium 서명 (NTT + 거부 샘플링)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          서명 과정의 핵심은 <strong>거부 샘플링</strong>입니다.
          마스킹 벡터 y로 <code>z = y + c*s1</code>을 계산하되,
          z가 너무 크면 s1 정보가 노출될 수 있어 재시작합니다.
        </p>
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('dilithium-sign', codeRefs['dilithium-sign'])} />
          <span className="text-[10px] text-muted-foreground self-center">sign() 내부</span>
        </div>
        <p>
          도전 다항식 <code>c</code>는 256개 계수 중 정확히 39개만 +1 또는 -1이고 나머지는 0입니다.
          이 희소성 덕분에 c*s1의 노름이 작게 유지되어, z가 s1을 숨길 수 있습니다.
        </p>
        <p className="text-sm border-l-2 border-blue-400 pl-3 bg-blue-50/50 dark:bg-blue-950/20 py-2 rounded-r">
          <strong>Insight</strong> — 거부 샘플링의 직관: y 없이 z = c*s1만 공개하면 s1이 바로 드러납니다.
          y를 더해 z를 균일 분포처럼 만들되, z가 "너무 한쪽으로 치우치면"(= s1 방향) 재시도합니다.
        </p>
      </div>
      <div className="mt-8"><SignViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">Sign 알고리즘 상세</h3>
        <div className="not-prose space-y-4 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-blue-400 mb-2"><code>Sign(sk, M)</code> &mdash; Dilithium 서명 생성</p>
            <p className="text-xs text-muted-foreground mb-2">
              <code>sk = (seed, tr, s1, s2, t_low)</code> &rarr; <M>{'\\mu = H(\\text{tr} \\| M)'}</M>
            </p>
            <ol className="text-sm space-y-1.5 text-muted-foreground list-decimal list-inside">
              <li><strong>Hash</strong> &mdash; <M>{'\\mu = H(\\text{tr} \\| M)'}</M></li>
              <li><strong>Masking vector</strong> &mdash; <M>{"\\rho' = H(\\text{seed} \\| \\mu \\| \\kappa)"}</M>, <M>{'y = \\text{ExpandMask}(\\rho\', \\kappa)'}</M></li>
              <li><strong>Commit</strong> &mdash; <M>{'w = A \\cdot y'}</M>, <M>{'w_{\\text{high}} = \\text{HighBits}(w, 2\\gamma_2)'}</M></li>
              <li><strong>Challenge</strong> &mdash; <M>{'c = H(\\mu \\| w_{\\text{high}})'}</M> (sparse polynomial)</li>
              <li><strong>Response</strong> &mdash; <M>{'z = y + c \\cdot s_1'}</M></li>
            </ol>
          </div>
          <div className="rounded-lg border border-red-500/30 p-4">
            <p className="font-semibold text-sm text-red-400 mb-2">Rejection Sampling (anti-leak)</p>
            <ol className="text-sm space-y-1.5 text-muted-foreground list-decimal list-inside">
              <li><M>{'\\|z\\|_\\infty \\geq \\gamma_1 - \\beta'}</M> &rarr; restart (s1 정보 노출 방지)</li>
              <li><M>{'r = w - c \\cdot s_2'}</M>, <M>{'\\|\\text{LowBits}(r)\\|_\\infty \\geq \\gamma_2 - \\beta'}</M> &rarr; restart</li>
              <li><M>{'h = \\text{MakeHint}(-c \\cdot t_{\\text{low}}, r)'}</M>, <M>{'\\text{weight}(h) > \\omega'}</M> &rarr; restart</li>
            </ol>
            <p className="text-sm text-muted-foreground mt-2">통과 시 서명 <M>{'(c, z, h)'}</M> 반환 &mdash; 평균 3-7 iteration</p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">NTT (Number Theoretic Transform)</h3>
        <div className="not-prose space-y-4 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-blue-400 mb-2">Polynomial Multiplication 최적화</p>
            <div className="grid grid-cols-2 gap-3 text-sm text-center mb-3">
              <div><p className="text-muted-foreground">Naive</p><p className="font-mono"><M>{'O(n^2)'}</M></p></div>
              <div><p className="text-muted-foreground">NTT</p><p className="font-mono"><M>{'O(n \\log n)'}</M></p></div>
            </div>
            <p className="text-sm text-muted-foreground">
              Dilithium의 모든 polynomial 연산 (<M>{'A \\cdot s, c \\cdot s_1, c \\cdot s_2'}</M> 등) &mdash;
              <M>{'R_q = \\mathbb{Z}_q[X]/(X^n + 1)'}</M>
            </p>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-green-400 mb-2">NTT 동작 원리 (FFT의 정수론 버전)</p>
            <ol className="text-sm space-y-1.5 text-muted-foreground list-decimal list-inside">
              <li>Primitive n-th root of unity <M>{'\\omega \\in \\mathbb{Z}_q'}</M></li>
              <li>계수 &rarr; 값 변환: <M>{'\\text{NTT}(p) = (p(\\omega^0), p(\\omega^1), \\ldots, p(\\omega^{n-1}))'}</M></li>
              <li>Pointwise multiply: <M>{'\\hat{c}[i] = \\hat{a}[i] \\cdot \\hat{b}[i]'}</M></li>
              <li>Inverse NTT: <M>{'c'}</M></li>
            </ol>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-amber-400 mb-2">Dilithium2 성능</p>
              <div className="text-sm space-y-1 text-muted-foreground">
                <p>n = 256, q = 8,380,417</p>
                <p>NTT forward/inverse: <strong>~500 cycles</strong></p>
                <p>Pointwise mult: ~256 mults</p>
                <p>Total poly mult: <strong>~1,500 cycles</strong></p>
                <p>vs naive ~65,000 cycles &rarr; <strong>40x speedup</strong></p>
              </div>
            </div>
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-muted-foreground mb-2">Implementation Tips</p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>Precomputed <M>{'\\omega'}</M> table</li>
                <li>Bit-reversal ordering</li>
                <li>Montgomery multiplication</li>
                <li>AVX2/AVX-512 vectorization</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

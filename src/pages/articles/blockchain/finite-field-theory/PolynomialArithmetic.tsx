import M from '@/components/ui/math';
import PolyFFTViz from './viz/PolyFFTViz';

export default function PolynomialArithmetic() {
  return (
    <section id="polynomial-arithmetic" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">다항식 산술 & FFT</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          다항식은 ZKP의 핵심 데이터 구조 — 회로 제약, 증명, 검증 모두 다항식 연산으로 환원.
        </p>
      </div>
      <div className="not-prose"><PolyFFTViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">다항식 연산과 NTT</h3>

        {/* 두 가지 표현 */}
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">1. Coefficient Form (계수)</div>
            <M display>{'p(x) = \\underbrace{a_0}_{\\text{상수항}} + \\underbrace{a_1 x}_{\\text{1차항}} + \\underbrace{a_2 x^2}_{\\text{2차항}} + \\cdots + \\underbrace{a_d x^d}_{\\text{최고차항}}'}</M>
            <p className="text-sm text-muted-foreground mt-2">a_i = i차 계수, d = 다항식의 차수(degree), x = 변수. 저장: <code>[a_0, a_1, ..., a_d]</code> 배열로 d+1개 계수만 보관.</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-2">2. Evaluation Form (평가)</div>
            <p className="text-sm text-muted-foreground">도메인 <M>{'D = \\{\\omega^0, \\omega^1, \\ldots, \\omega^{n-1}\\}'}</M></p>
            <p className="text-xs text-muted-foreground mt-2">저장: <code>[p(w^0), p(w^1), ..., p(w^(n-1))]</code></p>
          </div>
        </div>

        <div className="not-prose rounded-lg border bg-card p-4 mb-4">
          <p className="text-xs font-mono text-muted-foreground mb-2">변환</p>
          <div className="flex items-center justify-center gap-3 text-sm">
            <span className="rounded bg-blue-100 dark:bg-blue-900/30 px-2 py-1 text-blue-700 dark:text-blue-300 font-semibold">계수</span>
            <span className="text-muted-foreground flex flex-col items-center text-xs">
              <span>&rarr; FFT/NTT</span>
              <span>&larr; IFFT/INTT</span>
            </span>
            <span className="rounded bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 text-emerald-700 dark:text-emerald-300 font-semibold">평가</span>
            <span className="text-muted-foreground ml-2"><M>{'O(n \\log n)'}</M></span>
          </div>
        </div>

        {/* 복잡도 비교 */}
        <h4 className="text-lg font-semibold mt-5 mb-3">복잡도 비교</h4>
        <div className="not-prose rounded-lg border bg-card p-4 mb-4">
          <div className="grid grid-cols-3 gap-2 text-center text-sm mb-1">
            <div className="font-semibold text-muted-foreground">연산</div>
            <div className="font-semibold text-blue-600 dark:text-blue-400">계수 형태</div>
            <div className="font-semibold text-emerald-600 dark:text-emerald-400">평가 형태</div>
          </div>
          {[
            { op: 'Add', coeff: 'O(n)', eval: 'O(n)' },
            { op: 'Multiply', coeff: 'O(n^2)', eval: 'O(n) pointwise' },
            { op: 'Divide', coeff: 'O(n^2)', eval: 'O(n) pointwise' },
          ].map(r => (
            <div key={r.op} className="grid grid-cols-3 gap-2 text-center text-sm py-1 border-t border-border/50">
              <div className="text-muted-foreground">{r.op}</div>
              <div><M>{r.coeff}</M></div>
              <div className="font-semibold"><M>{r.eval}</M></div>
            </div>
          ))}
          <p className="text-xs text-muted-foreground mt-2 text-center">곱셈이 많으면 평가 형태가 유리</p>
        </div>

        {/* NTT */}
        <h4 className="text-lg font-semibold mt-5 mb-3">NTT (Number Theoretic Transform)</h4>
        <div className="not-prose rounded-lg border bg-card p-4 mb-4">
          <p className="text-sm text-muted-foreground mb-3">
            FFT의 유한체 버전 &mdash; 단위근 <M>{'\\omega \\in \\mathbb{F}_p'}</M>에서 <M>{'\\omega^n = 1'}</M>, <M>{'\\omega^k \\neq 1'}</M> (<M>{'k < n'}</M>)
          </p>
          <p className="text-sm text-muted-foreground mb-3">필요 조건: <M>{'n \\mid (p{-}1)'}</M></p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="rounded bg-muted/50 p-2">
              <p className="text-sm font-semibold">BN254 <M>{'F_r'}</M></p>
              <p className="text-xs text-muted-foreground"><M>{'p{-}1 = 2^{28} \\cdot 5 \\cdot 11 \\cdots'}</M> &rarr; <M>{'2^{28}'}</M>까지 NTT</p>
            </div>
            <div className="rounded bg-muted/50 p-2">
              <p className="text-sm font-semibold">Goldilocks</p>
              <p className="text-xs text-muted-foreground"><M>{'p{-}1 = 2^{32} \\cdot (2^{32}{-}1)'}</M> &rarr; <M>{'2^{32}'}</M> 대규모 NTT</p>
            </div>
          </div>
        </div>

        {/* ZKP 사용 예 */}
        <h4 className="text-lg font-semibold mt-5 mb-3">다항식 활용처</h4>
        <div className="not-prose grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          {[
            { name: 'FRI (STARK)', desc: 'Reed-Solomon + Low-degree test' },
            { name: 'KZG', desc: 'P(x) 커밋 → 상수 크기 증명' },
            { name: 'PLONK', desc: 'Gate · Permutation · Lookup 다항식' },
            { name: 'Groth16', desc: 'QAP: A(x), B(x), C(x)' },
          ].map(p => (
            <div key={p.name} className="rounded-lg border bg-card p-3">
              <p className="text-sm font-semibold">{p.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{p.desc}</p>
            </div>
          ))}
        </div>

        {/* Lagrange 보간 */}
        <h4 className="text-lg font-semibold mt-5 mb-3">Lagrange 보간</h4>
        <div className="not-prose rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground mb-2"><M>n</M>개 점 &rarr; 차수 <M>{'(n{-}1)'}</M> 다항식</p>
          <M display>{'L_i(x) = \\prod_{j \\neq i} \\underbrace{\\frac{x - x_j}{x_i - x_j}}_{\\text{j번째 보간 인수}}'}</M>
          <p className="text-sm text-muted-foreground mt-2">L_i(x) = i번째 Lagrange 기저 다항식. x_j에서 0, x_i에서 1이 되도록 설계된 "선택 함수".</p>
          <M display>{'p(x) = \\sum_i \\underbrace{y_i}_{\\text{목표값}} \\cdot \\underbrace{L_i(x)}_{\\text{기저 다항식}}'}</M>
          <p className="text-sm text-muted-foreground mt-2">y_i = i번째 점의 y좌표(목표값), L_i(x) = 해당 점에서만 1인 기저 다항식. 모든 기저의 가중합으로 n개 점을 정확히 통과하는 차수 n-1 다항식 구성. Barycentric form은 더 효율적 평가 + 수치 안정성을 제공.</p>
        </div>
      </div>
    </section>
  );
}

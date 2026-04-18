import M from '@/components/ui/math';
import R1CStoQAPViz from './viz/R1CStoQAPViz';

export default function R1CStoQAP() {
  return (
    <section id="r1cs-to-qap" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">R1CS → QAP 변환</h2>
      <div className="not-prose mb-8"><R1CStoQAPViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          R1CS의 행렬 제약을 <strong>다항식 기반 QAP</strong>로 변환하는 과정입니다.<br />
          Lagrange 보간으로 다항식을 구성하고, 몫 다항식 h(x)를 FFT 기반으로 효율 계산합니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">Lagrange 보간</h3>
        <div className="rounded-lg border p-4 not-prose text-sm space-y-2">
          <h4 className="font-semibold text-base mb-2">R1CS 계수 → 다항식 복원</h4>
          <p className="text-muted-foreground">R1CS 제약 i: <M>{'a_i \\cdot w_i \\times b_i \\cdot w_i = c_i \\cdot w_i'}</M></p>
          <p>각 변수 j에 대해 3개 다항식 생성:</p>
          <div className="grid gap-2 sm:grid-cols-3 mt-2">
            <div className="rounded border p-3 bg-sky-50 dark:bg-sky-950/30">
              <code className="text-xs font-mono">aⱼ(x)</code>
              <p className="text-xs text-muted-foreground mt-1">제약 i에서 변수 j의 A-계수를 보간</p>
            </div>
            <div className="rounded border p-3 bg-sky-50 dark:bg-sky-950/30">
              <code className="text-xs font-mono">bⱼ(x)</code>
              <p className="text-xs text-muted-foreground mt-1">제약 i에서 변수 j의 B-계수를 보간</p>
            </div>
            <div className="rounded border p-3 bg-sky-50 dark:bg-sky-950/30">
              <code className="text-xs font-mono">cⱼ(x)</code>
              <p className="text-xs text-muted-foreground mt-1">제약 i에서 변수 j의 C-계수를 보간</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            평가점: <M>{'\\omega^0, \\omega^1, \\ldots, \\omega^{n-1}'}</M> (n-th 단위근)
          </p>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">QAP 다항식 구성</h3>
        <div className="rounded-lg border p-4 not-prose text-sm space-y-2">
          <h4 className="font-semibold text-base mb-2">A(x)·B(x) - C(x) = h(x)·t(x)</h4>
          <div className="space-y-1 bg-sky-50 dark:bg-sky-950/30 rounded p-3">
            <p className="font-mono text-xs">witness 가중합 다항식:</p>
            <M display>{'A(x) = \\sum_j w_j \\cdot a_j(x)'}</M>
            <M display>{'B(x) = \\sum_j w_j \\cdot b_j(x)'}</M>
            <M display>{'C(x) = \\sum_j w_j \\cdot c_j(x)'}</M>
          </div>
          <div className="bg-amber-50 dark:bg-amber-950/30 rounded p-3 mt-2">
            <p className="font-medium text-xs mb-1">QAP 만족 조건</p>
            <M display>{'A(x) \\cdot B(x) - C(x) = h(x) \\cdot t(x)'}</M>
            <p className="text-xs text-muted-foreground">
              모든 <M>{'x \\in \\{\\omega^0, \\ldots, \\omega^{n-1}\\}'}</M>에서 성립
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">몫 다항식 h(x) — 코셋 FFT</h3>
        <div className="rounded-lg border p-4 not-prose text-sm space-y-2">
          <h4 className="font-semibold text-base mb-2">h(x) = [A·B - C] / t(x)</h4>
          <div className="bg-sky-50 dark:bg-sky-950/30 rounded p-3 mb-2">
            <p className="text-xs text-muted-foreground">vanishing polynomial</p>
            <M display>{'t(x) = (x - \\omega^0)(x - \\omega^1)\\cdots(x - \\omega^{n-1}) = x^n - 1'}</M>
            <M display>{'h(x) = \\frac{A(x) \\cdot B(x) - C(x)}{t(x)}'}</M>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded p-3">
            <p className="font-medium text-xs mb-2">5단계 코셋 FFT 최적화</p>
            <ol className="space-y-1 text-xs list-decimal list-inside text-muted-foreground">
              <li>IFFT: A, B, C를 계수 → 점별 값</li>
              <li>코셋 이동: <M>{'k \\cdot \\omega'}</M> 도메인에서 평가</li>
              <li>점별 곱: <M>{'A(k\\omega^i) \\cdot B(k\\omega^i) - C(k\\omega^i)'}</M></li>
              <li>점별 나눗셈: <M>{'\\div\\; t(k\\omega^i)'}</M></li>
              <li>IFFT: 결과를 다시 계수로 변환</li>
            </ol>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">Vanishing Polynomial</h3>
        <div className="rounded-lg border p-4 not-prose text-sm space-y-2">
          <h4 className="font-semibold text-base mb-2">t(x) = xⁿ - 1 — 건전성의 근거</h4>
          <div className="bg-sky-50 dark:bg-sky-950/30 rounded p-3 mb-2">
            <M display>{'t(x) = x^n - 1 \\quad (n = \\text{제약 수})'}</M>
            <p className="text-xs text-muted-foreground mt-1">
              성질: <M>{'t(\\omega^i) = 0 \\;\\; \\forall\\, i \\in [0, n)'}</M>
            </p>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded p-3">
            <p className="text-xs">
              <M>{'A(\\omega^i)B(\\omega^i) - C(\\omega^i) = 0'}</M>이면,{' '}
              <M>{'A(x)B(x) - C(x)'}</M>가 <M>{'t(x)'}</M>로 나누어짐
            </p>
            <p className="text-xs font-medium mt-1">
              → h(x)가 다항식으로 존재 ⟺ R1CS 만족
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

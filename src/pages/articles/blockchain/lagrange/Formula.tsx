import M from '@/components/ui/math';
import LagrangeFormulaViz from './viz/LagrangeFormulaViz';

export default function Formula() {
  return (
    <section id="formula" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Lagrange 보간 공식</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          각 점에서만 1이고 나머지에서 0인 &ldquo;선택 함수&rdquo;를 만들어 가중합.
        </p>
      </div>
      <div className="not-prose"><LagrangeFormulaViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Lagrange 공식 유도</h3>

        <h4 className="text-lg font-semibold mt-5 mb-2">표준 형태</h4>
        <M display>{'f(x) = \\underbrace{\\sum_{i=0}^{n-1}}_{\\text{모든 점에 대해}} \\underbrace{y_i}_{\\text{i번째 y값}} \\cdot \\underbrace{L_i(x)}_{\\text{기저 다항식}}'}</M>
        <p className="text-sm text-muted-foreground mt-2">
          <M>{'f(x)'}</M>: 보간 결과 다항식, <M>{'y_i'}</M>: i번째 데이터 점의 y좌표, <M>{'L_i(x)'}</M>: i번째 Lagrange 기저 다항식 (해당 점에서만 1, 나머지에서 0)
        </p>
        <p>
          <M>{'L_i(x)'}</M>는 i번째 Lagrange basis 다항식이다:
        </p>
        <M display>{'\\underbrace{L_i(x)}_{\\text{기저 다항식}} = \\prod_{j \\neq i} \\frac{\\overbrace{x - x_j}^{\\text{현재 점과의 거리}}}{\\underbrace{x_i - x_j}_{\\text{정규화 상수}}}'}</M>
        <p className="text-sm text-muted-foreground mt-2">
          <M>{'x_j'}</M>: j번째 데이터 점의 x좌표, 분자 <M>{'(x - x_j)'}</M>: j번째 점에서 0이 되도록 강제, 분모 <M>{'(x_i - x_j)'}</M>: 자기 점 <M>{'x_i'}</M>에서 1이 되도록 정규화
        </p>
      </div>

      <h4 className="text-lg font-semibold mt-5 mb-2">L_i(x)의 성질</h4>
      <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-3 my-3">
        <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-4">
          <p className="font-semibold text-sm text-indigo-400">차수</p>
          <p className="text-sm mt-1.5 text-foreground/75"><M>{'L_i'}</M>는 차수 <M>{'n-1'}</M> 다항식</p>
        </div>
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
          <p className="font-semibold text-sm text-emerald-400">자기 점에서 1</p>
          <p className="text-sm mt-1.5 text-foreground/75"><M>{'L_i(x_i) = 1'}</M></p>
        </div>
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
          <p className="font-semibold text-sm text-amber-400">다른 점에서 0</p>
          <p className="text-sm mt-1.5 text-foreground/75"><M>{'L_i(x_j) = 0'}</M> (<M>{'j \\neq i'}</M>)</p>
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-4">
        <p>
          검증: <M>{'f(x_k) = \\sum_i y_i \\cdot L_i(x_k) = y_k \\cdot 1 + \\sum_{i \\neq k} y_i \\cdot 0 = y_k'}</M>
        </p>

        <h4 className="text-lg font-semibold mt-5 mb-2">일차 원리에서의 유도</h4>
        <p>
          n개 점에서 <M>{'f(x_i) = y_i'}</M>인 다항식이 필요하다.
          <br />
          <M>{'L_i(x_j) = 0'}</M> (<M>{'j \\neq i'}</M>)이 되려면 <M>{'L_i'}</M>는 모든 <M>{'x_j'}</M>를 근으로 가져야 한다:
          <M display>{'L_i(x) = \\underbrace{c}_{\\text{정규화 계수}} \\cdot \\underbrace{\\prod_{j \\neq i}(x - x_j)}_{\\text{다른 모든 점에서 0이 되는 곱}}'}</M>
          <p className="text-sm text-muted-foreground mt-2">
            <M>{'c'}</M>: <M>{'L_i(x_i) = 1'}</M>을 만족시키기 위한 정규화 상수, <M>{'(x - x_j)'}</M>: j번째 점을 근으로 만드는 인수
          </p>
          <M>{'L_i(x_i) = 1'}</M>을 만족시키려면 <M>{'c = 1 / \\prod_{j \\neq i}(x_i - x_j)'}</M>.
          <br />
          따라서 <M>{'f(x) = \\sum y_i \\cdot L_i(x)'}</M>가 보간한다
        </p>

        <h4 className="text-lg font-semibold mt-5 mb-2">예시: 3개 점</h4>
        <p>
          점: <M>{'(0, 1),\\; (1, 3),\\; (2, 2)'}</M>
        </p>
      </div>

      <div className="not-prose grid grid-cols-1 gap-3 my-3">
        {[
          { name: 'L₀(x)', formula: '(x-1)(x-2) / (0-1)(0-2) = (x²-3x+2) / 2', color: 'indigo' },
          { name: 'L₁(x)', formula: '(x-0)(x-2) / (1-0)(1-2) = x(x-2)/(-1) = -x²+2x', color: 'emerald' },
          { name: 'L₂(x)', formula: '(x-0)(x-1) / (2-0)(2-1) = x(x-1)/2 = (x²-x)/2', color: 'amber' },
        ].map(p => (
          <div key={p.name} className={`rounded-lg border border-${p.color}-500/20 bg-${p.color}-500/5 p-4`}>
            <p className={`font-semibold text-sm text-${p.color}-400`}>{p.name}</p>
            <p className="text-sm mt-1.5 text-foreground/75">{p.formula}</p>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-4">
        <p>
          <M>{'f(x) = 1 \\cdot L_0 + 3 \\cdot L_1 + 2 \\cdot L_2 = -\\tfrac{3}{2}x^2 + \\tfrac{7}{2}x + 1'}</M>.
          <br />
          검증: <M>{'f(0) = 1'}</M>, <M>{'f(1) = 3'}</M>, <M>{'f(2) = 2'}</M>
        </p>

        <h4 className="text-lg font-semibold mt-5 mb-2">계산 측면</h4>
        <p>
          나이브 계산은 평가당 <M>{'O(n^2)'}</M> 곱셈이다.
          <br />
          분모 <M>{'\\text{den}_i = \\prod_{j \\neq i}(x_i - x_j)'}</M>를 전처리하면 <M>{'O(n^2)'}</M> 후 각 <M>{'L_i(x)'}</M>는 <M>{'O(n)'}</M>.
          <br />
          Barycentric 형태: <M>{'f(x) = \\frac{\\sum w_i y_i / (x - x_i)}{\\sum w_i / (x - x_i)}'}</M>
          (단, <M>{'w_i = 1/\\text{den}_i'}</M>). 수치적으로 더 안정적이며 평가당 <M>{'O(n)'}</M>
        </p>

        <h4 className="text-lg font-semibold mt-5 mb-2">단위근 도메인 특수 경우</h4>
        <p>
          평가점이 <M>{'\\{1, \\omega, \\omega^2, \\ldots, \\omega^{n-1}\\}'}</M>일 때:
        </p>
        <M display>{'L_i(x) = \\frac{\\underbrace{\\omega^i}_{\\text{i번째 단위근}} \\cdot \\overbrace{(x^n - 1)}^{\\text{vanishing polynomial}}}{\\underbrace{n}_{\\text{도메인 크기}} \\cdot \\underbrace{(x - \\omega^i)}_{\\text{i번째 점 제외}}}'}</M>
        <p className="text-sm text-muted-foreground mt-2">
          <M>{'\\omega'}</M>: 원시 n차 단위근, <M>{'x^n - 1'}</M>: 모든 단위근에서 0인 vanishing polynomial, 분모의 <M>{'(x - \\omega^i)'}</M>: i번째 점의 영점을 제거하여 해당 점에서만 값을 가지게 함
        </p>
        <p>
          PLONK/STARK에서 사용하는 간결한 형태다.
          <br />
          분모가 <M>{'n \\cdot \\omega^{-i}'}</M>로 단순화되기 때문이다
        </p>

        <h4 className="text-lg font-semibold mt-5 mb-2">행렬 형태 (Vandermonde)</h4>
        <p>
          Lagrange 보간은 Vandermonde 시스템 <M>{'V \\cdot \\mathbf{a} = \\mathbf{y}'}</M>를 푸는 것이다
          (<M>{'V[i][j] = x_i^j'}</M>).
          <br />
          단위근이면 V는 FFT 행렬이고, <M>{'V^{-1} = \\frac{1}{n} \\overline{V}'}</M>
          → FFT/IFFT로 <M>{'O(n \\log n)'}</M> 보간이 가능하다
        </p>

        <h4 className="text-lg font-semibold mt-5 mb-2">ZK 회로에서의 역할</h4>
      </div>

      <div className="not-prose grid grid-cols-1 gap-3 my-3">
        {[
          { name: 'Selector 다항식', desc: 'q(x) = Σ q_i · L_i(x). L_i(x)는 ω^i에서만 1로 평가. 각 게이트의 값을 선택', color: 'indigo' },
          { name: 'Copy constraint (PLONK)', desc: '순열 다항식 σ(X)를 Lagrange 다항식들로 표현', color: 'emerald' },
          { name: 'Trace column (STARK)', desc: '스텝 j의 trace[j]를 실행 도메인 위에서 보간', color: 'amber' },
        ].map(p => (
          <div key={p.name} className={`rounded-lg border border-${p.color}-500/20 bg-${p.color}-500/5 p-4`}>
            <p className={`font-semibold text-sm text-${p.color}-400`}>{p.name}</p>
            <p className="text-sm mt-1.5 text-foreground/75">{p.desc}</p>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-4">
        <p>
          유한체 위에서는 부동소수점 문제가 없으므로 모든 산술이 정확하다.
          실수 위에서는 Barycentric 공식이나 Modified Lagrange(Higham)가 수치 안정성 면에서 우수하다
        </p>
      </div>
    </section>
  );
}

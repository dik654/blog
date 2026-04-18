import Math from '@/components/ui/math';

export default function DFT() {
  return (
    <section id="dft" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">DFT와 시간복잡도</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          DFT(Discrete Fourier Transform)는 다항식을 n개 점에서 동시에 평가하는 연산이다.
          <br />
          차수 n-1 다항식 <Math>{'f(x) = a_0 + a_1 x + \\cdots + a_{n-1} x^{n-1}'}</Math>을
          <br />
          평가점 <Math>{'\\{\\omega^0, \\omega^1, \\ldots, \\omega^{n-1}\\}'}</Math>에서 계산한다
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">행렬-벡터 곱으로 보는 DFT</h3>
        <p>
          DFT는 행렬 <Math>{'W'}</Math>와 계수 벡터 <Math>{'\\mathbf{a}'}</Math>의 곱이다:
        </p>
        <Math display>{'\\underbrace{\\begin{pmatrix} y_0 \\\\ y_1 \\\\ y_2 \\\\ y_3 \\end{pmatrix}}_{\\text{평가값 벡터}} = \\underbrace{\\begin{pmatrix} 1 & 1 & 1 & 1 \\\\ 1 & \\omega & \\omega^2 & \\omega^3 \\\\ 1 & \\omega^2 & \\omega^4 & \\omega^6 \\\\ 1 & \\omega^3 & \\omega^6 & \\omega^9 \\end{pmatrix}}_{\\text{DFT 행렬 W}} \\underbrace{\\begin{pmatrix} a_0 \\\\ a_1 \\\\ a_2 \\\\ a_3 \\end{pmatrix}}_{\\text{계수 벡터}}'}</Math>
        <p className="text-sm text-muted-foreground mt-2">
          y = W·a. y<sub>k</sub> = f(ω<sup>k</sup>) = 다항식을 k번째 단위근에서 평가한 값<br />
          W[i][j] = ω<sup>ij</sup> — i행 j열 원소가 단위근의 (i×j) 거듭제곱<br />
          a = 다항식 계수 벡터. 직접 계산하면 O(n²), FFT로 O(n log n)
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          구체적 예시: <Math>{'\\mathbb{F}_{17}'}</Math>
        </h3>
        <p>
          <Math>{'p = 17'}</Math>이면 <Math>{'p - 1 = 16 = 2^4'}</Math>이므로 최대 16차 단위근이 존재한다.
          <br />
          n=4일 때 4차 단위근: <Math>{'4^4 = 256 \\equiv 1 \\pmod{17}'}</Math> → <Math>{'\\omega = 4'}</Math>
        </p>
        <p>
          다항식 <Math>{'f(x) = 1 + 2x + 3x^2 + 4x^3'}</Math>을 DFT로 평가:
        </p>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          {[
            { pt: 'f(ω⁰) = f(1)', calc: '1+2+3+4 = 10', color: 'indigo' },
            { pt: 'f(ω¹) = f(4)', calc: '1+8+48+256 = 313 ≡ 7 (mod 17)', color: 'emerald' },
            { pt: 'f(ω²) = f(16)', calc: '16≡-1 이므로 1-2+3-4 = -2 ≡ 15', color: 'amber' },
            { pt: 'f(ω³) = f(13)', calc: '13²≡16, 13³≡4 → 1+26+48+16 = 91 ≡ 6', color: 'indigo' },
          ].map(p => (
            <div key={p.pt} className={`rounded-lg border border-${p.color}-500/20 bg-${p.color}-500/5 p-4`}>
              <p className={`font-semibold text-sm text-${p.color}-400`}>{p.pt}</p>
              <p className="text-sm mt-1.5 text-foreground/75">{p.calc}</p>
            </div>
          ))}
        </div>
        <p>
          결과: <Math>{'[10,\\; 7,\\; 15,\\; 6]'}</Math> (모든 연산은 mod 17).
          <br />
          이 4개 값을 얻기 위해 16번의 곱셈이 필요했다 — <Math>{'O(n^2)'}</Math>.
          <br />
          FFT는 같은 결과를 <Math>{'O(n \\log n) = 8'}</Math>번 연산으로 얻는다
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">DFT 수학적 심층</h3>

        <h4 className="text-lg font-semibold mt-5 mb-2">두 가지 해석</h4>
      </div>

      <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-3">
        <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-4">
          <p className="font-semibold text-sm text-indigo-400">평가 해석</p>
          <p className="text-sm mt-1.5 text-foreground/75">
            다항식 <Math>{'f(x) = a_0 + a_1 x + \\cdots'}</Math>를 n개 점
            <Math>{'1, \\omega, \\omega^2, \\ldots'}</Math>에서 평가
          </p>
        </div>
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
          <p className="font-semibold text-sm text-emerald-400">선형대수 해석</p>
          <p className="text-sm mt-1.5 text-foreground/75">
            <Math>{'\\mathbf{y} = W \\cdot \\mathbf{a}'}</Math>.
            <Math>{'W[i][j] = \\omega^{ij}'}</Math>인 Vandermonde 행렬.
            직접 곱은 <code>O(n²)</code>
          </p>
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-4">
        <h4 className="text-lg font-semibold mt-5 mb-2">Vandermonde 성질 및 역변환</h4>
        <p>
          <Math>{'W \\cdot \\bar{W} = n \\cdot I'}</Math> (<Math>{'\\bar{W}'}</Math>는 <Math>{'\\omega^{-ij}'}</Math> 원소).
          따라서 <Math>{'W^{-1} = \\frac{1}{n} \\bar{W}'}</Math> → DFT는 <strong>가역</strong>이다.
          <br />
          행렬식 <Math>{'\\det(W) = \\prod_{i < j}(\\omega^j - \\omega^i) \\neq 0'}</Math>
          (서로 다른 근이므로). Shannon-Whittaker: n개 점이 차수 <Math>{'n-1'}</Math> 다항식을 유일하게 결정한다
        </p>

        <h4 className="text-lg font-semibold mt-5 mb-2">
          직접 계산: <Math>{'O(n^2)'}</Math>
        </h4>
        <p>
          각 <Math>{'y_k = \\sum_j a_j \\cdot \\omega^{kj}'}</Math>를 계산.
          <Math>{'n^2'}</Math> 곱셈 + <Math>{'n^2'}</Math> 덧셈.
          n = 100만이면 약 <Math>{'10^{12}'}</Math> 연산 (~1000초)
        </p>

        <h4 className="text-lg font-semibold mt-5 mb-2">
          Cooley-Tukey 분해: <Math>{'O(n \\log n)'}</Math>
        </h4>
        <p>
          짝수/홀수 인덱스로 분할:
          <Math>{'f_{\\text{even}}(x) = a_0 + a_2 x + a_4 x^2 + \\cdots'}</Math>,
          <Math>{'f_{\\text{odd}}(x) = a_1 + a_3 x + a_5 x^2 + \\cdots'}</Math>
        </p>
        <Math display>{'f(x) = \\underbrace{f_{\\text{even}}(x^2)}_{\\text{짝수 인덱스 계수}} + \\underbrace{x}_{\\text{시프트}} \\cdot \\underbrace{f_{\\text{odd}}(x^2)}_{\\text{홀수 인덱스 계수}}'}</Math>
        <p className="text-sm text-muted-foreground mt-2">
          f<sub>even</sub> = a₀ + a₂x + a₄x² + … (짝수 번째 계수만 모은 다항식)<br />
          f<sub>odd</sub> = a₁ + a₃x + a₅x² + … (홀수 번째 계수만 모은 다항식)<br />
          n차 문제를 n/2차 2개로 분할 → 재귀 T(n) = 2T(n/2) + O(n) = O(n log n)
        </p>
        <p>
          <Math>{'f_{\\text{even}}'}</Math>과 <Math>{'f_{\\text{odd}}'}</Math>는
          <Math>{'\\{\\omega^0, \\omega^2, \\ldots\\} = \\{\\omega\'^0, \\omega\'^1, \\ldots\\}'}</Math>
          (<Math>{'\\omega\' = \\omega^2'}</Math>는 <Math>{'n/2'}</Math>차 단위근)에서 평가하면 된다.
          <br />
          재귀: <Math>{'T(n) = 2T(n/2) + O(n) = O(n \\log n)'}</Math>
        </p>

        <h4 className="text-lg font-semibold mt-5 mb-2">
          <Math>{'\\mathbb{F}_{17}'}</Math> 예시의 W 행렬
        </h4>
        <p>
          <Math>{'p = 17, n = 4, \\omega = 4'}</Math>.
          W 행렬(mod 17):
        </p>
      </div>

      <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-3">
        {[
          { row: '행 0', vals: '[1, 1, 1, 1]', color: 'indigo' },
          { row: '행 1', vals: '[1, 4, 16, 13] — 4¹, 4², 4³', color: 'emerald' },
          { row: '행 2', vals: '[1, 16, 1, 16] — 4², 4⁴=1, 4⁶=16', color: 'amber' },
          { row: '행 3', vals: '[1, 13, 16, 4] — 4³, 4⁶=16, 4⁹=4', color: 'indigo' },
        ].map(p => (
          <div key={p.row} className={`rounded-lg border border-${p.color}-500/20 bg-${p.color}-500/5 p-3`}>
            <p className={`font-semibold text-sm text-${p.color}-400`}>{p.row}</p>
            <p className="text-xs mt-1 text-foreground/75">{p.vals}</p>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-4">
        <p>
          계수 <Math>{'\\mathbf{a} = [1, 2, 3, 4]'}</Math>에 대한 행렬곱 결과:
          <Math>{'\\mathbf{y} = [10,\\; 7,\\; 15,\\; 6]'}</Math> (모두 mod 17)
        </p>

        <h4 className="text-lg font-semibold mt-5 mb-2">Parseval 정리 (NTT 버전)</h4>
        <p>
          <Math>{'\\sum_i |a_i|^2 = \\frac{1}{n} \\sum_k |y_k|^2'}</Math>.
          <Math>{'\\mathbb{F}_p'}</Math>에서 계수 노름과 평가 노름의 관계를 나타내며, 바운딩된 오류 추정에 사용된다
        </p>

        <h4 className="text-lg font-semibold mt-5 mb-2">Cooley-Tukey 이후의 알고리즘</h4>
      </div>

      <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-3">
        {[
          { name: 'Stockham', desc: 'Bit-reversal 불필요. GPU/SIMD에 적합', color: 'indigo' },
          { name: 'Six-step FFT', desc: '매우 큰 n 처리. 캐시 인지 메모리 접근', color: 'emerald' },
          { name: 'Bluestein', desc: '임의의 n에서 동작 (2^k 제한 없음). Chirp z-변환 사용', color: 'amber' },
          { name: 'Rader', desc: '소수 크기 FFT. 정수론적 트릭으로 합성곱으로 변환', color: 'indigo' },
        ].map(p => (
          <div key={p.name} className={`rounded-lg border border-${p.color}-500/20 bg-${p.color}-500/5 p-4`}>
            <p className={`font-semibold text-sm text-${p.color}-400`}>{p.name}</p>
            <p className="text-sm mt-1.5 text-foreground/75">{p.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

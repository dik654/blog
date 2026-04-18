import M from '@/components/ui/math';
import QAPPipelineViz from './viz/QAPPipelineViz';

export default function QAP() {
  return (
    <section id="qap" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">QAP (Quadratic Arithmetic Program)</h2>
      <div className="not-prose mb-8"><QAPPipelineViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">왜 다항식으로 변환하는가</h3>
        <p>R1CS의 m개 개별 등식을 검증자가 일일이 확인하면 O(m) 비용이 듭니다.
        <br />
          QAP(Quadratic Arithmetic Program)는 이를 하나의 다항식 항등식으로 압축합니다.
        <br />
          O(1) 검증을 가능하게 하며, 이것이 ZK-SNARK의 &quot;Succinct(간결한)&quot;를 실현하는 핵심입니다.</p>

        {/* R1CS vs QAP 검증 비용 */}
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="rounded-lg border-l-4 border-l-rose-500 bg-card p-4">
            <p className="font-semibold text-sm text-rose-400 mb-2">R1CS: 개별 등식 O(m)</p>
            <M display>{'\\langle a_1, s \\rangle \\cdot \\langle b_1, s \\rangle = \\langle c_1, s \\rangle, \\;\\ldots,\\; \\langle a_m, s \\rangle \\cdot \\langle b_m, s \\rangle = \\langle c_m, s \\rangle'}</M>
          </div>
          <div className="rounded-lg border-l-4 border-l-emerald-500 bg-card p-4">
            <p className="font-semibold text-sm text-emerald-400 mb-2">QAP: 단일 항등식 O(1)</p>
            <M display>{'a(x) \\cdot b(x) - c(x) = h(x) \\cdot t(x)'}</M>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">R1CS &rarr; QAP 변환 파이프라인</h3>
        <p>R1CS 행렬의 각 열을 Lagrange 보간(Interpolation, 점들을 지나는 다항식 구성)으로 변환합니다.
        <br />
          witness 벡터로 결합하고, 소거 다항식(Vanishing Polynomial)으로 나누어떨어지는지 확인합니다.</p>

        {/* 5단계 파이프라인 */}
        <div className="not-prose space-y-3 mb-4">
          <div className="rounded-lg border-l-4 border-l-sky-500 bg-card p-4">
            <p className="font-semibold text-sm text-sky-400 mb-2">변환 5단계</p>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-sm">
              {[
                { n: '\u2460', title: '도메인 선택', desc: <span>D = &#123;<M>{'\\omega_1, \\ldots, \\omega_m'}</M>&#125;</span> },
                { n: '\u2461', title: 'Lagrange 보간', desc: <span><M>{'a_j(\\omega_i) = A[i,j]'}</M></span> },
                { n: '\u2462', title: '소거 다항식', desc: <span><M>{'t(x) = \\prod(x - \\omega_i)'}</M></span> },
                { n: '\u2463', title: 'Witness 결합', desc: <span><M>{'a(x) = \\sum_j s_j \\cdot a_j(x)'}</M></span> },
                { n: '\u2464', title: '몫 다항식', desc: <span><M>{'h(x) = \\frac{a \\cdot b - c}{t(x)}'}</M></span> },
              ].map(s => (
                <div key={s.n} className="rounded border bg-muted/50 p-2">
                  <p className="font-semibold">{s.n} {s.title}</p>
                  <p className="text-muted-foreground text-xs mt-1">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg border-l-4 border-l-violet-500 bg-card p-4">
            <p className="font-semibold text-sm text-violet-400 mb-2">핵심 동치 관계</p>
            <M display>{'\\text{R1CS 만족} \\iff t(x) \\mid (a(x) \\cdot b(x) - c(x)) \\iff h(x)\\text{가 다항식 (나머지 없음)}'}</M>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">Lagrange 보간</h3>
        <p>n개의 점을 지나는 유일한 degree &lt; n 다항식을 구합니다.
        <br />
          기저 다항식 L_i(x)는 정확히 하나의 도메인 점에서만 1이고 나머지에서 0입니다.
        <br />
          이를 Kronecker delta 성질이라 합니다.</p>

        {/* Lagrange 보간법 */}
        <div className="not-prose space-y-3 mb-4">
          <div className="rounded-lg border-l-4 border-l-sky-500 bg-card p-4">
            <p className="font-semibold text-sm text-sky-400 mb-2">일반 공식</p>
            <M display>{'L_i(x) = \\prod_{j \\neq i} \\frac{x - x_j}{x_i - x_j}, \\quad p(x) = \\sum_i y_i \\cdot L_i(x)'}</M>
          </div>
          <div className="rounded-lg border-l-4 border-l-emerald-500 bg-card p-4">
            <p className="font-semibold text-sm text-emerald-400 mb-2">구체적 예시: 점 (1,3), (2,5)</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li><M>{'L_0(x) = -(x - 2)'}</M>, &ensp; <M>{'L_1(x) = x - 1'}</M></li>
              <li><M>{'p(x) = 3 \\cdot (-(x-2)) + 5 \\cdot (x-1) = 2x + 1'}</M></li>
              <li><M>{'p(1) = 3'}</M> &check;, &ensp; <M>{'p(2) = 5'}</M> &check;</li>
            </ul>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">Schwartz-Zippel 보조정리</h3>
        <p>차수 d인 비영 다항식이 랜덤 점에서 0일 확률은 d/|F| 이하입니다.
        <br />
          BN254에서 d=1000이면 확률은 약 10^(-74)으로 사실상 0입니다.</p>

        {/* Schwartz-Zippel */}
        <div className="not-prose space-y-3 mb-4">
          <div className="rounded-lg border-l-4 border-l-amber-500 bg-card p-4">
            <p className="font-semibold text-sm text-amber-400 mb-2">확률 상한</p>
            <M display>{'\\Pr[p(\\tau) = 0] \\leq \\frac{d}{|\\mathbb{F}|}'}</M>
          </div>
          <div className="rounded-lg border-l-4 border-l-emerald-500 bg-card p-4">
            <p className="font-semibold text-sm text-emerald-400 mb-2">BN254에서의 구체적 확률</p>
            <p className="text-sm text-muted-foreground">
              <M>{'d \\approx 1{,}000'}</M>, &ensp;
              <M>{'|\\mathbb{F}| \\approx 2^{254}'}</M> &rarr;
              <M>{'\\Pr \\leq \\frac{1000}{2^{254}} \\approx 10^{-74} \\approx 0'}</M>
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              랜덤 <M>{'\\tau'}</M>에서 <M>{'a(\\tau) \\cdot b(\\tau) - c(\\tau) = h(\\tau) \\cdot t(\\tau)'}</M>가 성립하면
              모든 x에서 성립한다고 <M>{'2^{254}'}</M> 대 1의 확률로 확신 가능
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">소거 다항식 (Vanishing Polynomial)</h3>
        <p>도메인의 모든 점에서 0이 되는 다항식입니다.
        <br />
          프로덕션에서는 roots of unity(단위근)를 사용하여 t(x) = x^m - 1로 극도로 희소하게 만듭니다.</p>

        {/* Vanishing Polynomial */}
        <div className="not-prose rounded-lg border border-border/60 p-4 mb-4">
          <M display>{'t(x) = (x - \\omega_1)(x - \\omega_2) \\cdots (x - \\omega_m)'}</M>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mt-3">
            <div className="rounded border bg-card p-3">
              <p className="font-semibold">교육용</p>
              <p className="text-muted-foreground">
                <M>{'t(x) = (x-1)(x-2)(x-3) = x^3 - 6x^2 + 11x - 6'}</M>
              </p>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold">프로덕션 (roots of unity)</p>
              <p className="text-muted-foreground">
                <M>{'t(x) = x^m - 1'}</M> &rarr; O(1) 저장, O(log m) 평가
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            역할: <M>{'p(x)'}</M>가 모든 <M>{'\\omega_i'}</M>에서 0 &iff; <M>{'t(x) \\mid p(x)'}</M>
          </p>
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">QAP 수학적 구조 상세</h3>

        {/* R1CS → QAP 변환 정의 */}
        <div className="not-prose space-y-4 mb-6">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm mb-3">R1CS 인스턴스 &rarr; QAP 변환</p>
            <p className="text-sm text-muted-foreground mb-2">
              <M>{'m'}</M> 제약, <M>{'n'}</M> 변수.
              행렬 <M>{'A, B, C \\in \\mathbb{F}^{m \\times n}'}</M>, witness <M>{'\\mathbf{s}'}</M> (길이 n)
            </p>
            <p className="text-sm text-muted-foreground mb-3">
              제약 <M>{'i'}</M>: <M>{'(A_i \\cdot s) \\times (B_i \\cdot s) = (C_i \\cdot s)'}</M>
            </p>
            <div className="rounded border bg-muted/50 p-3">
              <p className="text-sm font-semibold mb-2">QAP 변환</p>
              <p className="text-sm text-muted-foreground">
                각 변수 <M>{'j \\in 1..n'}</M>에 대해 다항식 <M>{'A_j(x), B_j(x), C_j(x)'}</M> 정의:
              </p>
              <M display>{'A_j(\\omega_i) = A[i][j], \\quad B_j(\\omega_i) = B[i][j], \\quad C_j(\\omega_i) = C[i][j] \\quad \\text{for } i = 1..m'}</M>
              <p className="text-sm text-muted-foreground mt-2">
                &rarr; <strong>3n</strong>개 다항식, 각 차수 <M>{'m - 1'}</M> (행렬의 열 하나당 다항식 하나)
              </p>
            </div>
          </div>

          {/* Combined polynomials + Key identity */}
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm mb-3">결합 다항식과 핵심 항등식</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-center mb-3">
              <div className="rounded border bg-card p-2">
                <M>{'A(x) = \\sum_j s_j \\cdot A_j(x)'}</M>
              </div>
              <div className="rounded border bg-card p-2">
                <M>{'B(x) = \\sum_j s_j \\cdot B_j(x)'}</M>
              </div>
              <div className="rounded border bg-card p-2">
                <M>{'C(x) = \\sum_j s_j \\cdot C_j(x)'}</M>
              </div>
            </div>
            <div className="rounded border bg-muted/50 p-3">
              <p className="text-sm font-semibold mb-1">핵심 항등식</p>
              <p className="text-sm text-muted-foreground">
                <M>{'x = \\omega_i'}</M>에서:
                <M>{'A(\\omega_i) = \\sum_j s_j \\cdot A[i][j] = A_i \\cdot s'}</M>
              </p>
              <M display>{'\\text{R1CS 만족} \\iff A(\\omega_i) \\cdot B(\\omega_i) - C(\\omega_i) = 0 \\;\\forall i'}</M>
              <M display>{'\\iff t(x) \\mid (A(x) \\cdot B(x) - C(x)) \\iff \\exists h(x): A \\cdot B - C = t(x) \\cdot h(x)'}</M>
            </div>
          </div>

          {/* Polynomial degrees */}
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm mb-3">다항식 차수</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm text-center">
              <div className="rounded border bg-card p-2">
                <p className="text-muted-foreground text-xs">A, B, C</p>
                <M>{'\\leq m - 1'}</M>
              </div>
              <div className="rounded border bg-card p-2">
                <p className="text-muted-foreground text-xs">A&middot;B - C</p>
                <M>{'\\leq 2m - 2'}</M>
              </div>
              <div className="rounded border bg-card p-2">
                <p className="text-muted-foreground text-xs">t(x)</p>
                <M>{'= m'}</M>
              </div>
              <div className="rounded border bg-card p-2">
                <p className="text-muted-foreground text-xs">h(x)</p>
                <M>{'\\leq m - 2'}</M>
              </div>
            </div>
          </div>

          {/* Vanishing polynomial evaluation */}
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm mb-3">소거 다항식 평가</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="rounded border bg-card p-3">
                <p className="font-semibold">Standard</p>
                <p className="text-muted-foreground">
                  <M>{'t(x) = \\prod(x - \\omega_i)'}</M>
                  <br />평가: O(m)
                </p>
              </div>
              <div className="rounded border bg-card p-3">
                <p className="font-semibold">Roots of unity (FFT domain)</p>
                <p className="text-muted-foreground">
                  <M>{'\\omega'}</M> = primitive m-th root of unity
                  <br /><M>{'H = \\{\\omega^0, \\omega^1, \\ldots, \\omega^{m-1}\\}'}</M>
                  <br /><M>{'t(x) = x^m - 1'}</M> &rarr; O(log m) 평가
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              <M>{'x^m - 1 = 0'}</M> &iff; x는 m-th root of unity.
              분해: <M>{'x^m - 1 = \\prod(x - \\omega^i)'}</M>
            </p>
          </div>

          {/* Example walkthrough */}
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm mb-3">예시 (m=3, n=4)</p>
            <p className="text-sm text-muted-foreground mb-2">R1CS 제약 행렬:</p>
            <div className="grid grid-cols-3 gap-2 text-sm text-center mb-3">
              <div className="rounded border bg-card p-2">
                <p className="text-xs text-muted-foreground">A</p>
                <p className="font-mono text-xs">[[1,0,0,0], [0,1,0,0], [0,0,1,0]]</p>
              </div>
              <div className="rounded border bg-card p-2">
                <p className="text-xs text-muted-foreground">B</p>
                <p className="font-mono text-xs">[[0,1,0,0], [0,0,1,0], [0,0,0,1]]</p>
              </div>
              <div className="rounded border bg-card p-2">
                <p className="text-xs text-muted-foreground">C</p>
                <p className="font-mono text-xs">[[0,0,1,0], [0,0,0,1], [1,0,0,0]]</p>
              </div>
            </div>
            <div className="rounded border bg-muted/50 p-3 text-sm text-muted-foreground">
              <p>도메인 &#123;1, 2, 3&#125;에서 Lagrange 보간:</p>
              <ul className="space-y-0.5 mt-1">
                <li><M>{'A_1(x)'}</M>: (1,1),(2,0),(3,0) &rarr; <M>{'(x-2)(x-3)/2'}</M></li>
                <li><M>{'A_2(x)'}</M>: (1,0),(2,1),(3,0) &rarr; <M>{'-(x-1)(x-3)'}</M></li>
                <li>&hellip; (총 12개 다항식)</li>
              </ul>
              <p className="mt-2">
                Witness <M>{'s = [1, x, y, xy]'}</M>,
                <M>{'A(x) = 1 \\cdot A_1 + x \\cdot A_2 + y \\cdot A_3 + xy \\cdot A_4'}</M>
              </p>
            </div>
          </div>

          {/* FFT speedup */}
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm mb-3">FFT 가속 (프로덕션)</p>
            <div className="grid grid-cols-2 gap-3 text-sm mb-3">
              <div className="rounded border bg-red-500/10 p-2 text-center">
                <p className="font-semibold">Naive</p>
                <p className="text-muted-foreground"><M>{'O(m^2)'}</M></p>
              </div>
              <div className="rounded border bg-green-500/10 p-2 text-center">
                <p className="font-semibold">NTT (Number Theoretic Transform)</p>
                <p className="text-muted-foreground"><M>{'O(m \\log m)'}</M></p>
              </div>
            </div>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p><strong>1.</strong> <M>{'A_j, B_j, C_j'}</M> 계수 계산 (IFFT)</p>
              <p><strong>2.</strong> Witness 결합: <M>{'s_j \\cdot \\text{poly}_j'}</M></p>
              <p><strong>3.</strong> <M>{'A \\cdot B'}</M> 곱셈 (FFT point-wise)</p>
              <p><strong>4.</strong> C 감산</p>
              <p><strong>5.</strong> <M>{'t(x)'}</M>로 나누기 (<M>{'x^m - 1'}</M> trick)</p>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              총 Prover 비용: <M>{'O(n \\cdot m \\log m)'}</M>
            </p>
          </div>

          {/* Schwartz-Zippel soundness */}
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm mb-3">Schwartz-Zippel 건전성</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>Prover가 거짓말할 경우: <M>{'A \\cdot B - C'}</M>가 <M>{'t'}</M>로 나누어떨어지지 않음</li>
              <li>&rarr; <M>{"h'(x)"}</M>가 맞지 않음 &rarr; <M>{"A \\cdot B - C - t \\cdot h' \\neq 0"}</M> 다항식</li>
              <li>&rarr; 랜덤 점 z에서 0일 확률: <M>{'\\leq \\frac{2m-2}{|\\mathbb{F}|}'}</M></li>
            </ul>
            <div className="rounded border bg-muted/50 p-2 mt-2 text-sm text-center">
              <M>{'|\\mathbb{F}| \\sim 2^{254}'}</M>, <M>{'m \\sim 10^6'}</M> &rarr;
              soundness error <M>{'\\sim 2^{-228}'}</M> (무시 가능)
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

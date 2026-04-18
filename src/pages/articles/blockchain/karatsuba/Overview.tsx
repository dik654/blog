import M from '@/components/ui/math';
import OverviewViz from './viz/OverviewViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">왜 Karatsuba인가?</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          Fp2 곱셈을 4번 &rarr; 3번으로 25% 절감. 타워에서 재귀 적용하면 144 &rarr; 54.
        </p>
      </div>
      <div className="not-prose"><OverviewViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Karatsuba 알고리즘 개요</h3>

        {/* 역사 + 활용 */}
        <div className="not-prose rounded-lg border-l-4 border-l-blue-500 bg-card p-4 mb-4">
          <div className="text-sm font-semibold mb-2">History</div>
          <p className="text-sm text-muted-foreground mb-2">
            1960년 Anatoly Karatsuba가 <M>{'O(n^{\\log_2 3}) \\approx O(n^{1.585})'}</M> 정수 곱셈을 증명.
            최초의 sub-quadratic 곱셈 알고리즘으로, Kolmogorov의 <M>{'O(n^2)'}</M> 최적 추측을 반증했다.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm text-muted-foreground">
            <div className="rounded bg-muted/50 p-2 text-center">Big Integer (GMP)</div>
            <div className="rounded bg-muted/50 p-2 text-center">다항식 곱셈</div>
            <div className="rounded bg-muted/50 p-2 text-center">확장체 곱셈</div>
            <div className="rounded bg-muted/50 p-2 text-center">Pairings</div>
            <div className="rounded bg-muted/50 p-2 text-center">PQ Crypto</div>
          </div>
        </div>

        {/* 핵심 아이디어 */}
        <div className="not-prose rounded-lg border bg-card p-4 mb-4">
          <div className="text-sm font-semibold mb-2">핵심 아이디어</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded bg-muted/50 p-3">
              <div className="text-xs font-mono text-muted-foreground mb-1">Naive (4 mults)</div>
              <M display>{'\\underbrace{(a + b \\cdot 10)}_{\\text{첫째 수}} \\underbrace{(c + d \\cdot 10)}_{\\text{둘째 수}} = \\underbrace{ac}_{\\text{곱①}} + \\underbrace{(ad + bc)}_{\\text{곱②③}} \\cdot 10 + \\underbrace{bd}_{\\text{곱④}} \\cdot 100'}</M>
              <p className="text-sm text-muted-foreground mt-2">
                <M>a, c</M>: 일의 자리, <M>b, d</M>: 십의 자리. 교차항 <M>{'ad + bc'}</M>에 곱셈 2회가 필요하여 총 4회
              </p>
            </div>
            <div className="rounded bg-muted/50 p-3">
              <div className="text-xs font-mono text-muted-foreground mb-1">Karatsuba (3 mults)</div>
              <M display>{'\\underbrace{ad + bc}_{\\text{교차항}} = \\underbrace{(a+b)(c+d)}_{\\text{곱③}} - \\underbrace{ac}_{\\text{곱① 재사용}} - \\underbrace{bd}_{\\text{곱② 재사용}}'}</M>
              <p className="text-sm text-muted-foreground mt-2">
                <M>ac</M>와 <M>bd</M>는 실수부 계산에 이미 필요하므로 재사용. 새 곱셈은 <M>{'(a+b)(c+d)'}</M> 1회뿐
              </p>
            </div>
          </div>
        </div>

        {/* 재귀 복잡도 */}
        <div className="not-prose rounded-lg border bg-card p-4 mb-4">
          <div className="text-sm font-semibold mb-2">재귀 복잡도 (n자리 수)</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded bg-muted/50 p-3">
              <div className="text-xs font-mono text-muted-foreground mb-1">Karatsuba</div>
              <M display>{'T(n) = \\underbrace{3}_{\\text{부분 곱셈 수}} T(\\underbrace{n/2}_{\\text{반으로 분할}}) + \\underbrace{O(n)}_{\\text{덧셈/뺄셈}} = O(n^{\\log_2 3}) \\approx O(n^{1.585})'}</M>
              <p className="text-sm text-muted-foreground mt-2">
                <M>{'T(n)'}</M>: <M>n</M>자리 수의 곱셈 비용. 3개 부분 문제로 분할하여 sub-quadratic 달성
              </p>
            </div>
            <div className="rounded bg-muted/50 p-3">
              <div className="text-xs font-mono text-muted-foreground mb-1">Naive</div>
              <M display>{'T(n) = \\underbrace{4}_{\\text{부분 곱셈 수}} T(\\underbrace{n/2}_{\\text{반으로 분할}}) + \\underbrace{O(n)}_{\\text{덧셈/뺄셈}} = O(n^2)'}</M>
              <p className="text-sm text-muted-foreground mt-2">
                <M>{'T(n)'}</M>: <M>n</M>자리 수의 곱셈 비용. 4개 부분 문제 = quadratic 증가
              </p>
            </div>
          </div>
        </div>

        {/* 페어링 타워 적용 */}
        <div className="not-prose rounded-lg border-l-4 border-l-emerald-500 bg-card p-4 mb-4">
          <div className="text-sm font-semibold mb-2">BN254/BLS12-381 확장체 타워 적용</div>
          <p className="text-sm text-muted-foreground mb-3">
            타워: <M>{'\\mathbb{F}_p \\to \\mathbb{F}_{p^2} \\to \\mathbb{F}_{p^6} \\to \\mathbb{F}_{p^{12}}'}</M>
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded bg-muted/50 p-3">
              <div className="text-xs font-mono text-red-500 mb-1">Without Karatsuba</div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>Fp12: 4 Fp6 mults</li>
                <li>Fp6: 9 Fp2 mults</li>
                <li>Fp2: 4 Fp mults</li>
                <li className="font-semibold">Total: 4 x 9 x 4 = 144 Fp mults</li>
              </ul>
            </div>
            <div className="rounded bg-muted/50 p-3">
              <div className="text-xs font-mono text-emerald-500 mb-1">With Karatsuba</div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>Fp12: 3 Fp6 mults</li>
                <li>Fp6: 6 Fp2 mults</li>
                <li>Fp2: 3 Fp mults</li>
                <li className="font-semibold">Total: 3 x 6 x 3 = 54 Fp mults (62% 절감)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Karatsuba가 유리한 범위 */}
        <div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-amber-600 dark:text-amber-400 mb-2">Small (n=2,3)</div>
            <p className="text-sm text-muted-foreground">이득 거의 없음 &mdash; 덧셈 오버헤드가 지배</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-2">Medium (n=8-32)</div>
            <p className="text-sm text-muted-foreground">큰 이득 &mdash; 체 곱셈의 전형적 범위</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">Large (n=1000+)</div>
            <p className="text-sm text-muted-foreground">
              Toom-Cook, Schonhage-Strassen, Furer 알고리즘에 밀림
            </p>
          </div>
        </div>

        {/* 변형 */}
        <div className="not-prose rounded-lg border bg-card p-4 mb-4">
          <div className="text-sm font-semibold mb-2">Karatsuba 변형</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-muted-foreground">
            <div className="rounded bg-muted/50 p-3">
              <div className="font-medium mb-1">Standard Karatsuba</div>
              <p>2-split당 3 mults</p>
            </div>
            <div className="rounded bg-muted/50 p-3">
              <div className="font-medium mb-1">Toom-3</div>
              <p>3-split당 5 mults (vs 9). 큰 입력에 유리</p>
            </div>
            <div className="rounded bg-muted/50 p-3">
              <div className="font-medium mb-1">Toom-4</div>
              <p>4-split당 7 mults (vs 16). GMP 프로덕션 사용</p>
            </div>
          </div>
        </div>

        {/* 실무 이슈 */}
        <div className="not-prose rounded-lg border-l-4 border-l-amber-500 bg-card p-4 mb-4">
          <div className="text-sm font-semibold mb-2">실무 이슈</div>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li><strong>Overflow</strong> &mdash; <M>{'(a+b)'}</M>가 <M>{'2^n'}</M>을 초과할 수 있음. 해결: 1비트 여유 확보</li>
            <li><strong>Cache</strong> &mdash; 재귀가 캐시를 어지럽힘. 해결: 작은 base case(n &lt; 16)에서 인라인</li>
            <li><strong>Underflow</strong> &mdash; <M>{'(a+b)(c+d) - ac - bd'}</M>가 음수될 수 있음. 해결: signed 산술 또는 careful unsigned</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

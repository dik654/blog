import M from '@/components/ui/math';
import SchwartzZippelViz from './viz/SchwartzZippelViz';

export default function SchwartzZippel() {
  return (
    <section id="schwartz-zippel" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Schwartz-Zippel 보조정리</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          두 다항식이 같은지 랜덤 점에서 확인 — PLONK, STARK 건전성의 기반.
        </p>
      </div>
      <div className="not-prose"><SchwartzZippelViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Schwartz-Zippel Lemma</h3>

        {/* 보조정리 정식 */}
        <div className="not-prose rounded-lg border-l-4 border-l-blue-500 bg-card p-4 mb-4">
          <div className="text-sm font-semibold mb-2">Schwartz-Zippel Lemma (1979)</div>
          <p className="text-sm text-muted-foreground mb-2">
            <M>{'P \\in F[x_1, \\ldots, x_n]'}</M> &mdash; 차수 <M>d</M>인 non-zero 다항식<br />
            <M>{'S \\subseteq F'}</M> 유한 부분집합에서 <M>{'(r_1, \\ldots, r_n) \\in S^n'}</M> 랜덤 샘플링
          </p>
          <M display>{'\\underbrace{\\Pr[P(r_1, \\ldots, r_n) = 0]}_{\\text{랜덤 평가가 0일 확률}} \\leq \\frac{\\overbrace{d}^{\\text{다항식 차수}}}{\\underbrace{|S|}_{\\text{샘플링 집합 크기}}}'}</M>
          <p className="text-sm text-muted-foreground mt-2">P = 검사 대상 다항식, r_i = S에서 균일 랜덤 선택한 값, d = 총 차수, |S| = 샘플링 집합의 원소 수. |S|가 클수록 오류 확률이 지수적으로 감소 -- ZKP에서 |S|를 체 전체로 잡으면 사실상 0에 수렴.</p>
        </div>

        {/* Polynomial Identity Testing */}
        <h4 className="text-lg font-semibold mt-5 mb-3">Polynomial Identity Testing</h4>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-muted-foreground mb-2">Method 1 (직접)</div>
            <p className="text-sm text-muted-foreground">모든 계수 비교: <M>{'O(d)'}</M></p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">Method 2 (SZ)</div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>차이 다항식 <M>{'D(x) = P(x) - Q(x)'}</M></li>
              <li><M>{'r \\leftarrow \\text{random} \\in S'}</M></li>
              <li><M>{'P = Q'}</M> &rarr; <M>{'D = 0'}</M> &rarr; 항상 true</li>
              <li><M>{'P \\neq Q'}</M> &rarr; <M>{'\\Pr[D(r)=0] \\leq d/|S|'}</M></li>
            </ul>
            <p className="text-xs text-muted-foreground mt-2"><M>{'|S| = 2^{256}'}</M>이면 오류 확률 사실상 0</p>
          </div>
        </div>

        {/* ZKP 활용 */}
        <h4 className="text-lg font-semibold mt-5 mb-3">ZKP에서의 활용</h4>
        <div className="not-prose grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          {[
            { name: 'PLONK', desc: 'Grand product &mdash; random challenge로 한 점 검증' },
            { name: 'STARK', desc: 'AIR constraint &mdash; DEEP composition single point' },
            { name: 'Sumcheck', desc: <>수행: <M>{'\\sum f(x)'}</M> over <M>{'{\\{0,1\\}}^n'}</M></> },
            { name: 'Multi-linear', desc: 'Random challenge로 평가' },
          ].map(p => (
            <div key={p.name} className="rounded-lg border bg-card p-3">
              <p className="text-sm font-semibold">{p.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{p.desc}</p>
            </div>
          ))}
        </div>

        {/* 보안 분석 */}
        <h4 className="text-lg font-semibold mt-5 mb-3">보안 분석</h4>
        <div className="not-prose rounded-lg border bg-card p-4 mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <p className="text-sm font-semibold mb-1">Soundness error</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>단일 쿼리: <M>{'d / |F|'}</M></li>
                <li><M>k</M> 쿼리: <M>{'(d / |F|)^k'}</M></li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold mb-1">실전 계산</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>BN254 <M>{'F_r'}</M>: <M>{'|F| \\sim 2^{254}'}</M></li>
                <li><M>{'d = 10^6'}</M> &rarr; error <M>{'\\sim 2^{-230}'}</M></li>
                <li>&rarr; 매우 안전</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 변형 */}
        <div className="not-prose rounded-lg border bg-card p-4">
          <p className="text-xs font-mono text-muted-foreground mb-2">Variants</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="rounded bg-muted/50 p-2 text-center text-sm text-muted-foreground">DeMillo-Lipton-SZ</div>
            <div className="rounded bg-muted/50 p-2 text-center text-sm text-muted-foreground">Multi-variate extension</div>
            <div className="rounded bg-muted/50 p-2 text-center text-sm text-muted-foreground">Low-degree testing (STARK core)</div>
          </div>
        </div>
      </div>
    </section>
  );
}

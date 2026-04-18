import M from '@/components/ui/math';
import WhyAlgebraViz from './viz/WhyAlgebraViz';
import GroupRingFieldViz from './viz/GroupRingFieldViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">군 . 환 . 체 정의</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          ZKP의 모든 연산은 유한체(finite field) 위에서 수행된다.
          <br />
          왜 대수 구조가 필요하고, 군-환-체가 무엇인지.
        </p>
      </div>
      <div className="not-prose mb-8"><WhyAlgebraViz /></div>
      <div className="not-prose"><GroupRingFieldViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">대수 구조 계층</h3>

        {/* 계층 구조: Magma → Abelian Group */}
        <div className="not-prose rounded-lg border bg-card p-4 mb-4">
          <p className="text-xs font-mono text-muted-foreground mb-3">Algebraic Structures Hierarchy</p>
          <div className="flex flex-wrap items-center gap-2 text-sm mb-3">
            <span className="rounded bg-muted px-2 py-1">Magma</span>
            <span className="text-muted-foreground">⊃</span>
            <span className="rounded bg-muted px-2 py-1">Semigroup</span>
            <span className="text-muted-foreground">⊃</span>
            <span className="rounded bg-muted px-2 py-1">Monoid</span>
            <span className="text-muted-foreground">⊃</span>
            <span className="rounded bg-muted px-2 py-1">Group</span>
            <span className="text-muted-foreground">⊃</span>
            <span className="rounded bg-indigo-500/10 border border-indigo-500/30 px-2 py-1 font-semibold">Abelian Group</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-muted-foreground">
            <div className="rounded bg-muted/50 p-2 text-center"><span className="font-semibold">Semigroup</span><br />+ 결합법칙</div>
            <div className="rounded bg-muted/50 p-2 text-center"><span className="font-semibold">Monoid</span><br />+ 항등원</div>
            <div className="rounded bg-muted/50 p-2 text-center"><span className="font-semibold">Group</span><br />+ 역원</div>
            <div className="rounded bg-muted/50 p-2 text-center"><span className="font-semibold">Abelian</span><br />+ 교환법칙</div>
          </div>
        </div>

        {/* 군 · 환 · 체 */}
        <div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">군 (Group) <M>{'(G, *)'}</M></div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li><M>{'(a*b)*c = a*(b*c)'}</M> 결합</li>
              <li><M>{'e*a = a*e = a'}</M> 항등원</li>
              <li><M>{'a*a^{-1} = e'}</M> 역원</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-2">예: <M>{'(\\mathbb{Z}, +)'}</M>, <M>{'(\\mathbb{Z}_n, +)'}</M>, 타원곡선 점</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-2">환 (Ring) <M>{'(R, +, \\times)'}</M></div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li><M>{'(R, +)'}</M> 아벨 군</li>
              <li><M>{'(R, \\times)'}</M> 반군 (결합)</li>
              <li>분배법칙: <M>{'a(b+c) = ab + ac'}</M></li>
            </ul>
            <p className="text-xs text-muted-foreground mt-2">예: <M>{'(\\mathbb{Z}_n, +, \\times)'}</M>, 다항식 환</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-amber-600 dark:text-amber-400 mb-2">체 (Field) <M>{'(F, +, \\times)'}</M></div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>환 + <M>{'(F \\setminus \\{0\\}, \\times)'}</M> 아벨 군</li>
              <li>모든 non-zero 원소가 역원 가짐</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-2">예: <M>{'\\mathbb{Q}, \\mathbb{R}, \\mathbb{F}_p, GF(p^n)'}</M></p>
          </div>
        </div>

        {/* 유한체 */}
        <h4 className="text-lg font-semibold mt-5 mb-3">유한체 (Finite Fields)</h4>
        <div className="not-prose rounded-lg border bg-card p-4 mb-4">
          <p className="text-sm text-muted-foreground mb-3">유한 개 원소 &mdash; 암호학의 기반. 모든 <M>{'p^n'}</M> (<M>p</M> 소수, <M>{'n \\geq 1'}</M>)에 대해 유일하게 존재.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="rounded bg-muted/50 p-3">
              <p className="text-sm font-semibold"><M>{'\\mathbb{F}_p'}</M> (소수체)</p>
              <p className="text-xs text-muted-foreground mt-1"><code>{'{0, 1, ..., p-1}'}</code></p>
            </div>
            <div className="rounded bg-muted/50 p-3">
              <p className="text-sm font-semibold"><M>{'\\mathbb{F}_{2^n}'}</M> (이진 확장)</p>
              <p className="text-xs text-muted-foreground mt-1">AES 등 대칭 암호</p>
            </div>
            <div className="rounded bg-muted/50 p-3">
              <p className="text-sm font-semibold"><M>{'\\mathbb{F}_{p^n}'}</M> (일반 확장)</p>
              <p className="text-xs text-muted-foreground mt-1">페어링 기반 암호학</p>
            </div>
          </div>
        </div>

        {/* ZKP에서의 활용 */}
        <h4 className="text-lg font-semibold mt-5 mb-3">ZKP에서의 활용</h4>
        <div className="not-prose grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          {[
            { op: '+, -, ×, ÷', label: 'Field 연산' },
            { op: 'Polynomial', label: '다항식 산술' },
            { op: 'E(F_p)', label: '타원곡선' },
            { op: 'Pairing', label: '확장체 페어링' },
          ].map(i => (
            <div key={i.label} className="rounded-lg border bg-card p-3 text-center">
              <p className="text-sm font-semibold">{i.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{i.op}</p>
            </div>
          ))}
        </div>

        {/* 주요 ZK field primes */}
        <div className="not-prose rounded-lg border bg-card p-4">
          <p className="text-xs font-mono text-muted-foreground mb-3">주요 ZK Field Primes</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="rounded bg-muted/50 p-3">
              <p className="text-sm font-semibold">BN254</p>
              <p className="text-xs text-muted-foreground"><M>{'F_r \\sim 2^{254}'}</M> &mdash; Ethereum 프리컴파일, 레거시</p>
            </div>
            <div className="rounded bg-muted/50 p-3">
              <p className="text-sm font-semibold">BLS12-381</p>
              <p className="text-xs text-muted-foreground"><M>{'F_r \\sim 2^{255}'}</M> &mdash; Zcash, Filecoin, Eth 2.0</p>
            </div>
            <div className="rounded bg-muted/50 p-3">
              <p className="text-sm font-semibold">Pasta (Halo2)</p>
              <p className="text-xs text-muted-foreground"><M>{'F_p, F_q'}</M> &mdash; cycle of curves</p>
            </div>
            <div className="rounded bg-muted/50 p-3">
              <p className="text-sm font-semibold">Goldilocks (Plonky2)</p>
              <p className="text-xs text-muted-foreground"><M>{'p = 2^{64} - 2^{32} + 1'}</M></p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

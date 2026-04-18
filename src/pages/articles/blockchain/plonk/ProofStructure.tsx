import M from '@/components/ui/math';
import ProofStructureViz from './viz/ProofStructureViz';

export default function ProofStructure() {
  return (
    <section id="proof-structure" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">증명 데이터 구조</h2>
      <div className="not-prose mb-8"><ProofStructureViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">커밋먼트 포인트</h3>
        <p>증명에는 <strong>G1 점 9개</strong>가 포함된다. Round 1-3에서 생성되는 와이어, 순열, 몫 커밋먼트이다.</p>
        <div className="not-prose my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-muted-foreground mb-2">G1 커밋먼트 (7개)</p>
            <div className="grid grid-cols-3 gap-3 text-sm text-center">
              <div className="rounded border border-sky-500/30 p-2">
                <p className="text-sky-400 font-medium">Round 1</p>
                <p className="text-muted-foreground font-mono"><M>{'[a]_1, [b]_1, [c]_1'}</M></p>
                <p className="text-xs text-muted-foreground">와이어 다항식</p>
              </div>
              <div className="rounded border border-emerald-500/30 p-2">
                <p className="text-emerald-400 font-medium">Round 2</p>
                <p className="text-muted-foreground font-mono"><M>{'[Z]_1'}</M></p>
                <p className="text-xs text-muted-foreground">순열 누적자</p>
              </div>
              <div className="rounded border border-amber-500/30 p-2">
                <p className="text-amber-400 font-medium">Round 3</p>
                <p className="text-muted-foreground font-mono"><M>{'[t_{\\text{lo}}]_1, [t_{\\text{mid}}]_1, [t_{\\text{hi}}]_1'}</M></p>
                <p className="text-xs text-muted-foreground">몫 다항식</p>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">평가값</h3>
        <p>Round 4에서 <M>{'\\zeta'}</M>와 <M>{'\\zeta\\omega'}</M>에서 평가한 스칼라 값들이다.</p>
        <div className="not-prose my-4">
          <div className="rounded-lg border border-violet-500/30 p-4">
            <p className="font-semibold text-sm text-violet-400 mb-2">Fr 평가값 (6개)</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded border border-border/40 p-2">
                <p className="text-muted-foreground font-medium mb-1">와이어 평가</p>
                <p className="text-muted-foreground"><M>{'\\bar{a} = a(\\zeta),\\; \\bar{b} = b(\\zeta),\\; \\bar{c} = c(\\zeta)'}</M></p>
              </div>
              <div className="rounded border border-border/40 p-2">
                <p className="text-muted-foreground font-medium mb-1">순열 + 시프트 평가</p>
                <p className="text-muted-foreground"><M>{'\\bar{\\sigma}_a = \\sigma_a(\\zeta),\\; \\bar{\\sigma}_b = \\sigma_b(\\zeta)'}</M></p>
                <p className="text-muted-foreground"><M>{'\\bar{z}_\\omega = Z(\\zeta\\omega)'}</M></p>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">오프닝 증명</h3>
        <div className="not-prose my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-muted-foreground mb-2">오프닝 증명 + 총 크기</p>
            <div className="rounded border border-rose-500/30 p-3 mb-3">
              <p className="text-sm text-rose-400 font-medium mb-1">2개 G1 점 -- 배치 오프닝</p>
              <p className="text-sm text-muted-foreground"><M>{'[W_\\zeta]_1'}</M> -- <M>{'\\zeta'}</M>에서의 배치 오프닝</p>
              <p className="text-sm text-muted-foreground"><M>{'[W_{\\zeta\\omega}]_1'}</M> -- <M>{'\\zeta\\omega'}</M>에서의 단일 오프닝</p>
            </div>
            <div className="rounded border border-emerald-500/30 p-3">
              <p className="text-sm text-emerald-400 font-medium mb-1">총 768B 고정 크기</p>
              <div className="grid grid-cols-3 gap-3 text-sm text-center text-muted-foreground mt-1">
                <div className="bg-muted/50 rounded p-2"><strong>G1 x 9</strong><br />576 bytes</div>
                <div className="bg-muted/50 rounded p-2"><strong>Fr x 6</strong><br />192 bytes</div>
                <div className="bg-muted/50 rounded p-2"><strong>합계</strong><br />768 bytes (고정!)</div>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">Rust 구조체</h3>
        <div className="not-prose my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-muted-foreground mb-2">Proof 구조체</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="rounded border border-sky-500/30 p-3">
                <p className="text-sm text-sky-400 font-medium mb-1">Round 1-3 커밋먼트</p>
                <ul className="text-sm space-y-0.5 text-muted-foreground font-mono">
                  <li><code>a_comm</code>: G1Affine</li>
                  <li><code>b_comm</code>: G1Affine</li>
                  <li><code>c_comm</code>: G1Affine</li>
                  <li><code>z_comm</code>: G1Affine</li>
                  <li><code>t_lo_comm</code>: G1Affine</li>
                  <li><code>t_mid_comm</code>: G1Affine</li>
                  <li><code>t_hi_comm</code>: G1Affine</li>
                </ul>
              </div>
              <div className="rounded border border-violet-500/30 p-3">
                <p className="text-sm text-violet-400 font-medium mb-1">Round 4-5 값 + 오프닝</p>
                <ul className="text-sm space-y-0.5 text-muted-foreground font-mono">
                  <li><code>a_eval</code>, <code>b_eval</code>, <code>c_eval</code>: Fr</li>
                  <li><code>s_sigma_1_eval</code>, <code>s_sigma_2_eval</code>: Fr</li>
                  <li><code>z_shifted_eval</code>: Fr</li>
                  <li><code>w_z</code>: G1Affine</li>
                  <li><code>w_zw</code>: G1Affine</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import M from '@/components/ui/math';
import ComposerFlowViz from './viz/ComposerFlowViz';

export default function StandardComposer() {
  return (
    <section id="standard-composer" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">StandardComposer 구조</h2>
      <div className="not-prose mb-8"><ComposerFlowViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">선택자와 와이어 벡터</h3>
        <p>StandardComposer는 <strong>6개 선택자 벡터</strong>와 <strong>4개 와이어 벡터</strong>를 관리한다. 게이트가 추가될 때마다 각 벡터에 값이 push된다.</p>
        <div className="not-prose my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-muted-foreground mb-2">선택자 / 와이어 벡터</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="rounded border border-sky-500/30 p-3">
                <p className="font-semibold text-sm text-sky-400 mb-1">6개 선택자 -- 게이트 동작 결정</p>
                <ul className="text-sm space-y-0.5 text-muted-foreground font-mono">
                  <li><code>q_m</code> -- 곱셈 항 계수</li>
                  <li><code>q_l</code> -- left wire 계수</li>
                  <li><code>q_r</code> -- right wire 계수</li>
                  <li><code>q_o</code> -- output wire 계수</li>
                  <li><code>q_4</code> -- 4번째 wire 계수 (확장)</li>
                  <li><code>q_c</code> -- 상수 항</li>
                </ul>
              </div>
              <div className="rounded border border-emerald-500/30 p-3">
                <p className="font-semibold text-sm text-emerald-400 mb-1">4개 와이어 -- 입출력 값</p>
                <ul className="text-sm space-y-0.5 text-muted-foreground font-mono">
                  <li><code>w_l</code> -- left input wire</li>
                  <li><code>w_r</code> -- right input wire</li>
                  <li><code>w_o</code> -- output wire</li>
                  <li><code>w_4</code> -- 4번째 wire (TurboComposer)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">변수 관리와 게이트 추가</h3>
        <p><code className="bg-accent px-1.5 py-0.5 rounded text-sm">alloc()</code>으로 변수를 등록하고, <code className="bg-accent px-1.5 py-0.5 rounded text-sm">poly_gate()</code>로 와이어와 선택자를 동시에 확정한다.</p>
        <div className="not-prose my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-muted-foreground mb-2">변수 관리 + 게이트 추가</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="rounded border border-sky-500/30 p-3">
                <p className="font-semibold text-sm text-sky-400 mb-1">변수 할당</p>
                <ul className="text-sm space-y-0.5 text-muted-foreground">
                  <li><code>zero_var</code> = <code>append_output_public(F::zero)</code></li>
                  <li><code>alloc()</code> → <code>Variable(index)</code> -- private witness</li>
                  <li><code>add_input()</code> → <code>Variable</code> -- public input</li>
                </ul>
              </div>
              <div className="rounded border border-emerald-500/30 p-3">
                <p className="font-semibold text-sm text-emerald-400 mb-1">게이트 추가 (<code>poly_gate</code>)</p>
                <ul className="text-sm space-y-0.5 text-muted-foreground">
                  <li><code>w_l.push(a), w_r.push(b), w_o.push(c), w_4.push(d)</code></li>
                  <li><code>q_m.push(s.q_m), q_l.push(s.q_l), ...</code></li>
                  <li><code>perm.add_variables_to_map(a, b, c, d, n)</code></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">회로 구성 과정</h3>
        <div className="not-prose my-4">
          <div className="rounded-lg border border-border/60 p-4 space-y-3">
            <div className="rounded border border-sky-500/30 p-3">
              <p className="font-semibold text-sm text-sky-400 mb-1">1. Variable 생성</p>
              <p className="text-sm font-mono text-muted-foreground">let x = composer.alloc(value_x);</p>
              <p className="text-sm font-mono text-muted-foreground">let y = composer.alloc(value_y);</p>
            </div>
            <div className="rounded border border-emerald-500/30 p-3">
              <p className="font-semibold text-sm text-emerald-400 mb-1">2. 게이트 추가 (빌더 패턴)</p>
              <div className="text-sm font-mono text-muted-foreground space-y-0.5">
                <p>composer.arithmetic_gate(|g| {'{'}</p>
                <p className="pl-4">g.witness(x, y, None)</p>
                <p className="pl-5">.add(F::one, F::one) <span className="text-sky-400/70">// q_l=1, q_r=1</span></p>
                <p className="pl-5">.out(-F::one) <span className="text-sky-400/70">// q_o=-1</span></p>
                <p>{'}'});</p>
              </div>
            </div>
            <div className="rounded border border-amber-500/30 p-3">
              <p className="font-semibold text-sm text-amber-400 mb-1">3. Permutation map 등록</p>
              <p className="text-sm font-mono text-muted-foreground">perm.add_variables_to_map(x, y, out, dummy, gate_idx)</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

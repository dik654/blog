import M from '@/components/ui/math';
import ProverDetailViz from './viz/ProverDetailViz';

export default function ProverDetail() {
  return (
    <section id="prover-detail" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Prover 5-Round 상세</h2>
      <div className="not-prose mb-8"><ProverDetailViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">Round 1 -- 와이어 커밋먼트</h3>
        <p>witness를 Lagrange 보간 후 <strong>블라인딩 항</strong>을 추가하여 영지식성을 보장한다.</p>
        <div className="not-prose my-4">
          <div className="rounded-lg border border-sky-500/30 p-4">
            <p className="font-semibold text-sm text-sky-400 mb-2">Round 1: Wire Commits</p>
            <p className="text-sm text-muted-foreground mb-2">블라인딩 스칼라 <M>{'b_1, \\ldots, b_9'}</M> 선택 (랜덤)</p>
            <div className="my-2">
              <M display>{'a(X) = (b_1 X + b_2) \\cdot Z_H(X) + \\sum_i a_i \\cdot L_i(X)'}</M>
              <M display>{'b(X) = (b_3 X + b_4) \\cdot Z_H(X) + \\sum_i b_i \\cdot L_i(X)'}</M>
              <M display>{'c(X) = (b_5 X + b_6) \\cdot Z_H(X) + \\sum_i c_i \\cdot L_i(X)'}</M>
            </div>
            <p className="text-sm text-muted-foreground">→ <M>{'[a]_1, [b]_1, [c]_1'}</M> 전송 (KZG commit)</p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">Round 2 -- 순열 누적자</h3>
        <div className="not-prose my-4">
          <div className="rounded-lg border border-emerald-500/30 p-4">
            <p className="font-semibold text-sm text-emerald-400 mb-2">Round 2: Permutation Z(X)</p>
            <p className="text-sm text-muted-foreground mb-2">Fiat-Shamir 챌린지: <M>{'\\beta, \\gamma \\leftarrow \\text{transcript.squeeze}()'}</M></p>
            <div className="my-2">
              <M display>{'Z(\\omega^0) = 1'}</M>
              <M display>{'Z(\\omega^{i+1}) = Z(\\omega^i) \\cdot \\prod_j \\frac{w_j(\\omega^i) + \\beta \\cdot \\omega^i \\cdot k_j + \\gamma}{w_j(\\omega^i) + \\beta \\cdot \\sigma_j(\\omega^i) + \\gamma}'}</M>
            </div>
            <p className="text-sm text-muted-foreground"><M>{'Z(X)'}</M>에 블라인딩 추가 → <M>{'[Z]_1'}</M> 전송</p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">Round 3 -- 몫 다항식</h3>
        <div className="not-prose my-4">
          <div className="rounded-lg border border-amber-500/30 p-4">
            <p className="font-semibold text-sm text-amber-400 mb-2">Round 3: Quotient t(X)</p>
            <p className="text-sm text-muted-foreground mb-2">챌린지: <M>{'\\alpha \\leftarrow \\text{transcript.squeeze}()'}</M></p>
            <div className="my-2">
              <M display>{'t(X) = \\frac{\\text{gate}(X) + \\alpha \\cdot \\text{perm}_1(X) + \\alpha^2 \\cdot \\text{perm}_2(X)}{Z_H(X)}'}</M>
            </div>
            <p className="text-sm text-muted-foreground mb-1"><M>{'\\deg(t) \\approx 3n'}</M> → 3등분:</p>
            <M display>{'t(X) = t_{\\text{lo}}(X) + X^n \\cdot t_{\\text{mid}}(X) + X^{2n} \\cdot t_{\\text{hi}}(X)'}</M>
            <p className="text-sm text-muted-foreground mt-2">→ <M>{'[t_{\\text{lo}}]_1, [t_{\\text{mid}}]_1, [t_{\\text{hi}}]_1'}</M> 전송</p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">Round 4 -- 평가</h3>
        <div className="not-prose my-4">
          <div className="rounded-lg border border-violet-500/30 p-4">
            <p className="font-semibold text-sm text-violet-400 mb-2">Round 4: Evaluations</p>
            <p className="text-sm text-muted-foreground mb-2">챌린지: <M>{'\\zeta \\leftarrow \\text{transcript.squeeze}()'}</M></p>
            <p className="text-sm text-muted-foreground"><M>{'\\zeta'}</M>에서 6개 스칼라 계산:</p>
            <div className="grid grid-cols-2 gap-2 text-sm mt-2">
              <div className="bg-muted/50 rounded p-2 text-center"><M>{'\\bar{a} = a(\\zeta),\\; \\bar{b} = b(\\zeta),\\; \\bar{c} = c(\\zeta)'}</M></div>
              <div className="bg-muted/50 rounded p-2 text-center"><M>{'\\bar{\\sigma}_a = \\sigma_a(\\zeta),\\; \\bar{\\sigma}_b = \\sigma_b(\\zeta),\\; \\bar{z}_\\omega = Z(\\zeta\\omega)'}</M></div>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">Round 5 -- 오프닝 증명</h3>
        <div className="not-prose my-4">
          <div className="rounded-lg border border-rose-500/30 p-4">
            <p className="font-semibold text-sm text-rose-400 mb-2">Round 5: Opening Proofs</p>
            <p className="text-sm text-muted-foreground mb-2">챌린지: <M>{'\\nu \\leftarrow \\text{transcript.squeeze}()'}</M></p>
            <p className="text-sm text-muted-foreground mb-1">선형화 다항식 <M>{'r(X)'}</M>: <M>{'\\bar{a}, \\bar{b}'}</M> 등으로 부분 평가</p>
            <div className="my-2">
              <M display>{'W_\\zeta(X) = \\frac{r(X) + \\nu(a(X) - \\bar{a}) + \\nu^2(b(X) - \\bar{b}) + \\cdots}{X - \\zeta}'}</M>
              <M display>{'W_{\\zeta\\omega}(X) = \\frac{Z(X) - \\bar{z}_\\omega}{X - \\zeta\\omega}'}</M>
            </div>
            <p className="text-sm text-muted-foreground">→ <M>{'[W_\\zeta]_1, [W_{\\zeta\\omega}]_1'}</M> 전송</p>
          </div>
        </div>
      </div>
    </section>
  );
}

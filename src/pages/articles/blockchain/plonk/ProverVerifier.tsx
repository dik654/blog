import M from '@/components/ui/math';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import PLONKRoundsViz from './viz/PLONKRoundsViz';
import PLONKProverFlowViz from './viz/PLONKProverFlowViz';
import { codeRefs } from './codeRefs';

export default function ProverVerifier({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="prover-verifier" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">PLONK Prover / Verifier</h2>
      <div className="not-prose mb-8"><PLONKRoundsViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">5-Round 프로토콜 흐름</h3>
      </div>
      <div className="not-prose mb-8"><PLONKProverFlowViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('plonk-round1-3', codeRefs['plonk-round1-3'])} />
          <span className="text-[10px] text-muted-foreground self-center">Prover R1-3</span>
          <CodeViewButton onClick={() => onCodeRef('plonk-round4-5', codeRefs['plonk-round4-5'])} />
          <span className="text-[10px] text-muted-foreground self-center">Prover R4-5</span>
          <CodeViewButton onClick={() => onCodeRef('plonk-verifier', codeRefs['plonk-verifier'])} />
          <span className="text-[10px] text-muted-foreground self-center">Verifier</span>
        </div>
        <h3 className="text-xl font-semibold mt-6 mb-3">빌딩 블록의 결합</h3>
        <p>KZG(다항식 commit), PLONKish(범용 게이트), Permutation(와이어 연결)을 5라운드 프로토콜로 조립한다.
        <br />
          모든 제약을 다항식 등식으로 변환하고, quotient polynomial(몫 다항식)로 증명한다.
        <br />
          Fiat-Shamir 변환으로 비대화형으로 만든다.</p>

        <h3 className="text-xl font-semibold mt-6 mb-3">5-Round Prover (Round 1-3)</h3>
        <div className="not-prose my-4 space-y-3">
          <div className="rounded-lg border border-sky-500/30 p-4">
            <p className="font-semibold text-sm text-sky-400 mb-2">Round 1: Wire Commitments</p>
            <p className="text-sm text-muted-foreground"><M>{'a(x), b(x), c(x)'}</M> -- witness를 Lagrange 보간 후 KZG commit</p>
            <p className="text-sm text-muted-foreground">블라인딩: 각 다항식에 랜덤 항 추가 (zero-knowledge)</p>
            <p className="text-sm text-muted-foreground">→ <M>{'[a]_1, [b]_1, [c]_1'}</M> 전송</p>
          </div>
          <div className="rounded-lg border border-emerald-500/30 p-4">
            <p className="font-semibold text-sm text-emerald-400 mb-2">Round 2: Permutation Accumulator</p>
            <p className="text-sm text-muted-foreground"><M>{'\\beta, \\gamma \\leftarrow'}</M> Fiat-Shamir (Round 1 transcript)</p>
            <p className="text-sm text-muted-foreground"><M>{'Z(x)'}</M> 계산: grand product accumulator → <M>{'[Z]_1'}</M> 전송</p>
          </div>
          <div className="rounded-lg border border-amber-500/30 p-4">
            <p className="font-semibold text-sm text-amber-400 mb-2">Round 3: Quotient Polynomial</p>
            <p className="text-sm text-muted-foreground"><M>{'\\alpha \\leftarrow'}</M> Fiat-Shamir</p>
            <M display>{'t(x) = \\frac{\\text{gate}(x) + \\alpha \\cdot \\text{perm}_1(x) + \\alpha^2 \\cdot \\text{perm}_2(x)}{Z_H(x)}'}</M>
            <p className="text-sm text-muted-foreground"><M>{'Z_H(x) = x^n - 1'}</M> (vanishing polynomial). <M>{'t(x)'}</M>를 3등분 → <M>{'[t_{\\text{lo}}]_1, [t_{\\text{mid}}]_1, [t_{\\text{hi}}]_1'}</M> 전송</p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">5-Round Prover (Round 4-5)</h3>
        <div className="not-prose my-4 space-y-3">
          <div className="rounded-lg border border-violet-500/30 p-4">
            <p className="font-semibold text-sm text-violet-400 mb-2">Round 4: 평가값 전송</p>
            <p className="text-sm text-muted-foreground"><M>{'\\zeta \\leftarrow'}</M> Fiat-Shamir</p>
            <p className="text-sm text-muted-foreground"><M>{'\\bar{a}=a(\\zeta),\\; \\bar{b}=b(\\zeta),\\; \\bar{c}=c(\\zeta),\\; \\bar{\\sigma}_A=\\sigma_A(\\zeta),\\; \\bar{\\sigma}_B=\\sigma_B(\\zeta),\\; \\bar{z}_\\omega=Z(\\zeta\\omega)'}</M></p>
            <p className="text-sm text-muted-foreground">→ 6개 스칼라 전송</p>
          </div>
          <div className="rounded-lg border border-rose-500/30 p-4">
            <p className="font-semibold text-sm text-rose-400 mb-2">Round 5: Opening Proofs</p>
            <p className="text-sm text-muted-foreground"><M>{'\\nu \\leftarrow'}</M> Fiat-Shamir</p>
            <p className="text-sm text-muted-foreground">linearization: <M>{'r(x)'}</M> = gate/perm 다항식들을 <M>{'\\bar{a}, \\bar{b}'}</M> 등으로 부분 평가</p>
            <M display>{'W_\\zeta(x) = \\frac{r(x) + \\nu(a(x)-\\bar{a}) + \\nu^2(b(x)-\\bar{b}) + \\cdots}{x - \\zeta}'}</M>
            <M display>{'W_{\\zeta\\omega}(x) = \\frac{Z(x) - \\bar{z}_\\omega}{x - \\zeta\\omega}'}</M>
            <p className="text-sm text-muted-foreground">→ <M>{'[W_\\zeta]_1, [W_{\\zeta\\omega}]_1'}</M> 전송</p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">Verifier</h3>
        <div className="not-prose my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-muted-foreground mb-2">PLONK Verifier</p>
            <p className="text-sm text-muted-foreground mb-2">입력: 증명 <M>{'\\pi = ([a],[b],[c],[Z],[t_{\\text{lo}}],[t_{\\text{mid}}],[t_{\\text{hi}}], \\bar{a},\\bar{b},\\bar{c},\\bar{\\sigma}_A,\\bar{\\sigma}_B,\\bar{z}_\\omega, [W_\\zeta],[W_{\\zeta\\omega}])'}</M></p>
            <ol className="text-sm space-y-1 text-muted-foreground list-decimal pl-5">
              <li>Fiat-Shamir로 <M>{'\\beta, \\gamma, \\alpha, \\zeta, \\nu, u'}</M> 재생성</li>
              <li><M>{'Z_H(\\zeta) = \\zeta^n - 1'}</M> 계산</li>
              <li>Lagrange <M>{'L_1(\\zeta) = (\\zeta^n - 1) / (n(\\zeta - 1))'}</M> 계산</li>
              <li>gate 관계 + permutation 관계 → <M>{'\\bar{r}'}</M> 계산 (스칼라)</li>
              <li><M>{'[F]_1'}</M> = linearization commitment 재구성</li>
              <li><M>{'[E]_1'}</M> = 평가값들의 commitment</li>
            </ol>
            <div className="mt-3 rounded border border-emerald-500/30 p-3">
              <p className="font-semibold text-sm text-emerald-400 mb-1">Pairing check (최종 검증)</p>
              <M display>{'e([W_\\zeta]_1 + u \\cdot [W_{\\zeta\\omega}]_1,\\; [\\tau]_2) = e(\\zeta \\cdot [W_\\zeta]_1 + u\\zeta\\omega \\cdot [W_{\\zeta\\omega}]_1 + [F]_1 - [E]_1,\\; G_2)'}</M>
            </div>
          </div>
        </div>
        <p>검증자는 <strong>페어링 2회</strong>와 소수의 G1 스칼라 곱만으로 검증을 완료한다. 전체 witness를 보지 않고 증명의 정당성을 확인할 수 있다.</p>
      </div>
    </section>
  );
}

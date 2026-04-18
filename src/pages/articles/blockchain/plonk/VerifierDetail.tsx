import M from '@/components/ui/math';
import VerifierDetailViz from './viz/VerifierDetailViz';

export default function VerifierDetail() {
  return (
    <section id="verifier-detail" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Verifier 상세</h2>
      <div className="not-prose mb-8"><VerifierDetailViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">Fiat-Shamir 재생</h3>
        <p>검증자는 증명자와 동일한 transcript를 구성하여 <strong>모든 챌린지를 재생성</strong>한다. 이것이 대화형 → 비대화형 변환의 핵심이다.</p>
        <div className="not-prose my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-sky-400 mb-2">Fiat-Shamir 챌린지 재생</p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="rounded border border-sky-500/30 p-2">
                <p>Round 1 transcript: <code>transcript.append([a], [b], [c])</code></p>
                <p>→ <M>{'\\beta, \\gamma = \\text{transcript.squeeze}()'}</M></p>
              </div>
              <div className="rounded border border-border/40 p-2">
                <p><code>transcript.append([Z])</code> → <M>{'\\alpha = \\text{transcript.squeeze}()'}</M></p>
              </div>
              <div className="rounded border border-border/40 p-2">
                <p><code>transcript.append([t_lo], [t_mid], [t_hi])</code> → <M>{'\\zeta = \\text{transcript.squeeze}()'}</M></p>
              </div>
              <div className="rounded border border-emerald-500/30 p-2">
                <p>Round 4 transcript: <code>transcript.append(a&#772;, b&#772;, c&#772;, &#963;&#772;_a, &#963;&#772;_b, z&#772;_&#969;)</code></p>
                <p>→ <M>{'\\nu = \\text{transcript.squeeze}()'}</M></p>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">선형화 커밋먼트 [F]_1</h3>
        <p>KZG의 <strong>가법 동형성</strong>을 이용하여 개별 커밋먼트로부터 combined commitment를 재구성한다.</p>
        <div className="not-prose my-4">
          <div className="rounded-lg border border-amber-500/30 p-4">
            <p className="font-semibold text-sm text-amber-400 mb-2">선형화 커밋먼트</p>
            <p className="text-sm text-muted-foreground mb-1"><M>{'\\bar{r}'}</M> 스칼라 계산:</p>
            <M display>{'\\bar{r} = \\bar{a} \\cdot \\bar{b} \\cdot \\nu_{q_m} + \\bar{a} \\cdot \\nu_{q_l} + \\bar{b} \\cdot \\nu_{q_r} + \\bar{c} \\cdot \\nu_{q_o} + \\nu_{q_c}'}</M>
            <M display>{'+ \\alpha \\cdot [\\bar{z}_\\omega(\\bar{a}+\\beta\\bar{\\sigma}_a+\\gamma)(\\bar{b}+\\beta\\bar{\\sigma}_b+\\gamma) \\cdot \\beta \\cdot \\nu_z]'}</M>
            <M display>{'+ \\alpha^2 \\cdot L_1(\\zeta) \\cdot \\nu_z'}</M>
            <div className="mt-3 rounded border border-violet-500/30 p-3">
              <p className="text-sm text-violet-400 font-medium mb-1"><M>{'[F]_1'}</M> 재구성 -- <M>{'\\nu'}</M> 결합</p>
              <M display>{'[F]_1 = \\nu \\cdot [a]_1 + \\nu^2 \\cdot [b]_1 + \\nu^3 \\cdot [c]_1 + \\nu^4 \\cdot [\\sigma_a]_1 + \\nu^5 \\cdot [\\sigma_b]_1 + [\\text{linearized terms}]_1'}</M>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">배치 KZG 검증</h3>
        <p>최종 검증은 <strong>페어링 2회</strong>로 완료된다. 증명 크기와 검증 시간 모두 회로 크기에 무관하다.</p>
        <div className="not-prose my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-muted-foreground mb-2">배치 KZG Pairing Check</p>
            <div className="rounded border border-sky-500/30 p-3 mb-3">
              <p className="text-sm text-sky-400 font-medium mb-1"><M>{'[E]_1'}</M> 평가값 커밋 구성</p>
              <M display>{'[E]_1 = (\\bar{r} + \\nu \\cdot \\bar{a} + \\nu^2 \\cdot \\bar{b} + \\nu^3 \\cdot \\bar{c} + \\nu^4 \\cdot \\bar{\\sigma}_a + \\nu^5 \\cdot \\bar{\\sigma}_b + u \\cdot \\bar{z}_\\omega) \\cdot G_1'}</M>
            </div>
            <div className="rounded border border-rose-500/30 p-3">
              <p className="text-sm text-rose-400 font-medium mb-1">페어링 등식 -- <M>{'O(1)'}</M> 검증</p>
              <M display>{'e([W_\\zeta]_1 + u \\cdot [W_{\\zeta\\omega}]_1,\\; [\\tau]_2) = e(\\zeta \\cdot [W_\\zeta]_1 + u\\zeta\\omega \\cdot [W_{\\zeta\\omega}]_1 + [F]_1 - [E]_1,\\; G_2)'}</M>
              <p className="text-sm text-muted-foreground mt-1">→ 페어링 2회로 모든 제약 동시 검증</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

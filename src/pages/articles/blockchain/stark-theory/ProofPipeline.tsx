import M from '@/components/ui/math';
import ProofFlowViz from './viz/ProofFlowViz';

export default function ProofPipeline() {
  return (
    <section id="proof-pipeline" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">STARK 증명 파이프라인</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          Trace Commit &rarr; Constraint Composition &rarr; FRI &rarr; Query &rarr; Verify. 5단계 파이프라인.
        </p>
      </div>
      <div className="not-prose"><ProofFlowViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">STARK 증명 파이프라인 5단계</h3>

        {/* 5 Phases */}
        <div className="not-prose rounded-lg border border-border/60 p-4 mb-4">
          <p className="font-semibold text-sm text-blue-400 mb-3">Proof Generation Pipeline</p>
          <div className="space-y-2 text-sm">
            <div className="rounded border bg-card p-3">
              <p className="font-semibold text-sky-300">Phase 1: Trace Generation &amp; Commitment</p>
              <div className="text-xs text-muted-foreground mt-1 space-y-1">
                <p>연산 실행 &rarr; trace table 생성</p>
                <p>Column별 polynomial interpolation</p>
                <p>LDE (Reed-Solomon 확장) 수행</p>
                <p>Merkle commit to trace LDE &rarr; root를 verifier에 전송</p>
              </div>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold text-emerald-300">Phase 2: Constraint Composition</p>
              <div className="text-xs text-muted-foreground mt-1 space-y-1">
                <p>AIR 제약 다항식 생성</p>
                <p>Verifier challenges <M>\alpha_i</M> (Fiat-Shamir)</p>
                <p>Composition polynomial: <M>C(x) = \sum_i \alpha_i \cdot C_i(x) / V(x)</M></p>
                <p>LDE composition polynomial &rarr; Merkle commit</p>
              </div>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold text-amber-300">Phase 3: Deep Composition</p>
              <div className="text-xs text-muted-foreground mt-1 space-y-1">
                <p>Verifier가 random <M>z</M> 샘플링</p>
                <p>Prover가 <M>z</M>에서의 trace 값 전송</p>
                <p>DEEP composition poly로 결합 &rarr; 단일 low-degree test로 축소</p>
              </div>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold text-purple-300">Phase 4: FRI Low-Degree Test</p>
              <div className="text-xs text-muted-foreground mt-1 space-y-1">
                <p>재귀적으로 다항식 반감 (halve)</p>
                <p><M>\log(n)</M> 라운드의 commit/challenge</p>
                <p>Each round: 접힌(folded) 다항식 commit</p>
                <p>Final round: constant 공개</p>
              </div>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold text-rose-300">Phase 5: Queries &amp; Verification</p>
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mt-1">
                <div>
                  <p className="font-semibold text-foreground/70 mb-1">Prover sends:</p>
                  <p>Trace evaluations at queried positions</p>
                  <p>Merkle proofs</p>
                  <p>FRI consistency values</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground/70 mb-1">Verifier checks:</p>
                  <p>All Merkle proofs valid</p>
                  <p>FRI folding consistent</p>
                  <p>Constraint evaluation correct</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Verifier 체크 */}
        <div className="not-prose rounded-lg border border-border/60 p-4 mb-4">
          <p className="font-semibold text-sm text-emerald-400 mb-3">
            Verifier 체크 (복잡도 <M>O(\log^2 n)</M>)
          </p>
          <div className="space-y-1 text-sm">
            {[
              'Sample query positions (random)',
              'Verify Merkle proofs',
              'Check AIR constraint at sampled points',
              'Verify FRI halving consistency',
              'Verify final polynomial degree',
            ].map((desc, i) => (
              <div key={i} className="flex gap-3 rounded border bg-card p-2">
                <span className="text-xs font-bold text-emerald-400/60 w-4 shrink-0">{i + 1}</span>
                <span className="text-xs">{desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Proof Components + 실무 수치 */}
        <div className="not-prose rounded-lg border border-border/60 p-4 mb-4">
          <p className="font-semibold text-sm text-amber-400 mb-3">Proof 구성요소 &amp; 실무 수치</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="rounded border bg-card p-3">
              <p className="font-semibold text-xs mb-2">Proof Components</p>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>Trace Merkle roots</p>
                <p>Composition Merkle roots</p>
                <p>FRI commitments (each layer)</p>
                <p>Query answers + Merkle paths</p>
                <p>Final FRI polynomial</p>
              </div>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold text-xs mb-2">전형적인 STARK proof</p>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>Proof size: 50&ndash;200 KB</p>
                <p>Verifier: 10&ndash;100 ms</p>
                <p>Prover: seconds ~ minutes</p>
              </div>
              <p className="font-semibold text-xs mt-3 mb-1">Cairo VM 예시</p>
              <div className="text-xs text-muted-foreground space-y-1">
                <p><M>10^6</M> step trace &rarr; Proof ~80 KB</p>
                <p>Verify ~80 ms on L1 Ethereum</p>
                <p>Prover ~10 s (고성능 HW)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

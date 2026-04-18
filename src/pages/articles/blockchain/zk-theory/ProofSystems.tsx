import M from '@/components/ui/math';
import ProofSystemsViz from './viz/ProofSystemsViz';

export default function ProofSystems() {
  return (
    <section id="proof-systems" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">SNARKs vs STARKs vs IOP</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          증명 크기, 검증 속도, 셋업, 양자 내성 &mdash; 시스템별 트레이드오프 비교.
        </p>
      </div>
      <div className="not-prose"><ProofSystemsViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">zkSNARK vs zkSTARK vs IOP</h3>

        {/* 비교 테이블 */}
        <div className="not-prose rounded-lg border bg-card p-4 mb-4 overflow-x-auto">
          <div className="grid grid-cols-5 gap-2 text-center text-sm mb-1 font-semibold">
            <div className="text-muted-foreground">시스템</div>
            <div>Trusted Setup</div>
            <div>Proof Size</div>
            <div>Verify Time</div>
            <div>Quantum</div>
          </div>
          {[
            { name: 'Groth16', setup: 'Yes', size: '~200 B', time: '~3 ms', q: 'No' },
            { name: 'PLONK', setup: '1x univ', size: '~500 B', time: '~5 ms', q: 'No' },
            { name: 'Halo2', setup: 'No', size: '~1 KB', time: '~10 ms', q: 'No' },
            { name: 'STARK', setup: 'No', size: '50-200 KB', time: '~50 ms', q: 'Yes' },
            { name: 'Bulletproofs', setup: 'No', size: 'O(log n)', time: 'O(n)', q: 'No' },
          ].map(r => (
            <div key={r.name} className="grid grid-cols-5 gap-2 text-center text-sm py-1.5 border-t border-border/50">
              <div className="font-semibold">{r.name}</div>
              <div className="text-muted-foreground">{r.setup}</div>
              <div className="text-muted-foreground">{r.size}</div>
              <div className="text-muted-foreground">{r.time}</div>
              <div className={r.q === 'Yes' ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-muted-foreground'}>{r.q}</div>
            </div>
          ))}
        </div>

        {/* zkSNARK */}
        <h4 className="text-lg font-semibold mt-5 mb-3">zkSNARK</h4>
        <div className="not-prose rounded-lg border bg-card p-4 mb-4">
          <div className="flex flex-wrap gap-2 mb-3">
            {[
              { letter: 'S', meaning: 'Succinct (증명 작음)' },
              { letter: 'N', meaning: 'Non-interactive' },
              { letter: 'AR', meaning: 'ARgument (계산적 건전성)' },
              { letter: 'K', meaning: 'Knowledge (지식 추출)' },
            ].map(a => (
              <div key={a.letter} className="rounded bg-muted/50 px-2 py-1 text-xs text-muted-foreground">
                <span className="font-semibold">{a.letter}</span>: {a.meaning}
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mb-3">증명 크기 상수/polylog, 검증 밀리초, pairing/DLP 가정</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { name: 'Groth16', desc: '최소 증명 (3 group elements), per-circuit setup' },
              { name: 'PLONK', desc: 'Universal trusted setup' },
              { name: 'Marlin', desc: 'Universal, 다양한 상호작용' },
              { name: 'Halo', desc: 'Recursion, no trusted setup' },
            ].map(v => (
              <div key={v.name} className="rounded bg-muted/50 p-2">
                <p className="text-sm font-semibold">{v.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* zkSTARK */}
        <h4 className="text-lg font-semibold mt-5 mb-3">zkSTARK</h4>
        <div className="not-prose rounded-lg border bg-card p-4 mb-4">
          <div className="flex flex-wrap gap-2 mb-3">
            {[
              { letter: 'S', meaning: 'Scalable (prover 준선형)' },
              { letter: 'T', meaning: 'Transparent (no trusted setup)' },
              { letter: 'AR', meaning: 'ARgument' },
              { letter: 'K', meaning: 'Knowledge' },
            ].map(a => (
              <div key={a.letter} className="rounded bg-muted/50 px-2 py-1 text-xs text-muted-foreground">
                <span className="font-semibold">{a.letter}</span>: {a.meaning}
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mb-2">증명 큼 (수십~수백 KB), Post-quantum secure, 해시 기반</p>
          <p className="text-xs text-muted-foreground">프로젝트: StarkWare, Risc0, Polygon Miden</p>
        </div>

        {/* IOP */}
        <h4 className="text-lg font-semibold mt-5 mb-3">Interactive Oracle Proofs (IOP)</h4>
        <div className="not-prose rounded-lg border bg-card p-4 mb-4">
          <p className="text-sm text-muted-foreground mb-2">
            이론적 프레임워크 &mdash; Prover가 oracle 제공, Verifier가 position 쿼리, Fiat-Shamir로 비대화형 변환
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="rounded bg-muted/50 p-2 text-sm text-muted-foreground">
              <span className="font-semibold">STARKs</span> &mdash; FRI-based IOP
            </div>
            <div className="rounded bg-muted/50 p-2 text-sm text-muted-foreground">
              <span className="font-semibold">SNARK</span> &mdash; Polynomial IOP + PCS
            </div>
          </div>
        </div>

        {/* 선택 가이드 */}
        <h4 className="text-lg font-semibold mt-5 mb-3">선택 가이드</h4>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { goal: '증명 크기 최우선', pick: 'Groth16 (가장 작음)' },
            { goal: '유연한 setup', pick: 'PLONK (1x trusted setup)' },
            { goal: 'No trusted setup (small proof)', pick: 'Halo2' },
            { goal: 'No trusted setup (PQ)', pick: 'STARK (large proof)' },
            { goal: 'Recursion 필요', pick: 'Halo2, Nova, Plonky2' },
            { goal: 'High performance', pick: 'Plonky3 (latest)' },
          ].map(g => (
            <div key={g.goal} className="rounded-lg border bg-card p-3">
              <p className="text-sm font-semibold">{g.goal}</p>
              <p className="text-xs text-muted-foreground mt-1">&rarr; {g.pick}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

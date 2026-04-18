import M from '@/components/ui/math';
import ZKPropertyViz from './viz/ZKPropertyViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">완전성 · 건전성 · 영지식성</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          영지식 증명(Zero-Knowledge Proof, ZKP) — 비밀을 공개하지 않고 "나는 이 사실을 안다"를 증명하는 암호학적 프로토콜.
          <br />
          세 가지 성질을 동시에 만족해야 유효한 ZKP다.
        </p>
      </div>
      <div className="not-prose"><ZKPropertyViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">ZKP 3대 성질 정식 정의</h3>

        {/* 3대 성질 */}
        <div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-2">1. Completeness (완전성)</div>
            <p className="text-sm text-muted-foreground mb-2">정직한 Prover + 정직한 Verifier &rarr; 참 명제는 항상 승인</p>
            <M display>{'\\forall (\\underbrace{x}_{\\text{공개 입력}}, \\underbrace{w}_{\\text{증인}}) \\in R: \\Pr[\\underbrace{V(x, \\pi)}_{\\text{검증}} = \\text{ACCEPT}] \\geq 1 - \\underbrace{\\text{negl}}_{\\text{무시 가능}}'}</M>
            <p className="text-sm text-muted-foreground mt-2">x = 공개 입력(statement), w = 비밀 증인(witness), R = 관계(x와 w가 올바른 쌍), pi = 증명(proof), V = 검증자 알고리즘, negl = 무시 가능 함수(보안 파라미터에 대해 역다항식보다 빠르게 감소).</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-red-600 dark:text-red-400 mb-2">2. Soundness (건전성)</div>
            <p className="text-sm text-muted-foreground mb-2">거짓 명제는 (거의) 승인받을 수 없음</p>
            <M display>{'\\forall \\underbrace{x \\notin L}_{\\text{거짓 명제}},\\, \\forall \\underbrace{P^*}_{\\text{악의적 증명자}}: \\Pr[V(x, \\underbrace{\\pi^*}_{\\text{위조 증명}}) = \\text{ACCEPT}] \\leq \\underbrace{\\varepsilon}_{\\text{건전성 오류}}'}</M>
            <p className="text-sm text-muted-foreground mt-2">L = 참인 명제의 집합(language), P* = 임의의(악의적) 증명자, pi* = 위조된 증명, epsilon = 건전성 오류 상한(예: 2^-128). 어떤 전략을 써도 거짓 명제를 승인받을 확률이 epsilon 이하.</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">3. Zero-Knowledge (영지식성)</div>
            <p className="text-sm text-muted-foreground mb-2">Verifier는 "x가 참" 외에 어떤 정보도 얻지 못함</p>
            <p className="text-sm text-muted-foreground">
              Simulator <M>S</M> 존재 &mdash; <M>{'S(x)'}</M>만으로 실제 transcript와 구별 불가능한 분포 생성
            </p>
          </div>
        </div>

        {/* ZK 변형 */}
        <div className="not-prose rounded-lg border bg-card p-4 mb-4">
          <p className="text-xs font-mono text-muted-foreground mb-2">ZK Variants</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="rounded bg-muted/50 p-2 text-center">
              <p className="text-sm font-semibold">Perfect ZK</p>
              <p className="text-xs text-muted-foreground">두 분포 완전히 같음</p>
            </div>
            <div className="rounded bg-muted/50 p-2 text-center">
              <p className="text-sm font-semibold">Statistical ZK</p>
              <p className="text-xs text-muted-foreground">통계적으로 가까움</p>
            </div>
            <div className="rounded bg-muted/50 p-2 text-center">
              <p className="text-sm font-semibold">Computational ZK</p>
              <p className="text-xs text-muted-foreground">계산적으로 구별 불가</p>
            </div>
          </div>
        </div>

        {/* 역사적 이정표 */}
        <h4 className="text-lg font-semibold mt-5 mb-3">역사적 이정표</h4>
        <div className="not-prose rounded-lg border bg-card p-4 mb-4">
          <div className="space-y-1">
            {[
              { year: '1985', event: 'Goldwasser-Micali-Rackoff: ZK 정의' },
              { year: '1986', event: 'Fiat-Shamir: 비대화형 변환' },
              { year: '1988', event: 'Blum-Feldman-Micali: NIZK' },
              { year: '2013', event: 'Pinocchio: 첫 실용 SNARK' },
              { year: '2016', event: 'Groth16: 최소 proof size' },
              { year: '2019', event: 'PLONK: universal setup' },
              { year: '2020', event: 'Halo: recursion, no trusted setup' },
              { year: '2021', event: 'STARKs 상용화: StarkWare, Risc0' },
            ].map(m => (
              <div key={m.year} className="flex gap-3 items-baseline">
                <span className="text-xs font-mono text-muted-foreground w-10 shrink-0">{m.year}</span>
                <span className="text-sm text-muted-foreground">{m.event}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 보안 기반 */}
        <div className="not-prose rounded-lg border bg-card p-4 mb-6">
          <p className="text-xs font-mono text-muted-foreground mb-2">Hard Problems (보안 기반)</p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {['Discrete Log', 'CDH / DDH', 'KoE', 'Bilinear Pairing', 'Lattice (PQ)'].map(p => (
              <div key={p} className="rounded bg-muted/50 p-2 text-center text-xs text-muted-foreground">{p}</div>
            ))}
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">ZKP 사용 사례</h3>

        {/* 사용 사례 */}
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-4">
          {[
            { title: 'Privacy Blockchains', items: ['Zcash (Groth16 / Halo2)', 'Monero (Bulletproofs)', 'Aztec (private ZK-rollup)'] },
            { title: 'ZK-Rollups (L2)', items: ['zkSync, Starknet, Scroll', 'Batch 거래 → single proof', 'L1 gas 대폭 감소'] },
            { title: 'Identity & Credentials', items: ['Anonymous credentials', '나이만 증명 (age verif.)', 'Worldcoin (Iris)'] },
            { title: 'Voting', items: ['Election integrity', 'Anonymous ballots', 'Vocdoni, ZKVote'] },
            { title: 'Verifiable Computation', items: ['Cloud outsourcing', 'zkML (ML 검증)', 'Game integrity'] },
            { title: 'Cross-chain Bridges', items: ['Light client proofs', 'Succinct verification'] },
          ].map(c => (
            <div key={c.title} className="rounded-lg border bg-card p-3">
              <p className="text-sm font-semibold mb-1">{c.title}</p>
              <ul className="text-xs text-muted-foreground space-y-0.5">
                {c.items.map(i => <li key={i}>{i}</li>)}
              </ul>
            </div>
          ))}
        </div>

        {/* Application Stack */}
        <div className="not-prose rounded-lg border bg-card p-4 mb-4">
          <p className="text-xs font-mono text-muted-foreground mb-2">주요 Application Stack</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { name: 'Circom + snarkjs', use: 'Groth16 / PLONK' },
              { name: 'Cairo', use: 'StarkWare' },
              { name: 'Halo2', use: 'Zcash, EF' },
              { name: 'Arkworks', use: 'Rust, 연구용' },
              { name: 'Noir', use: 'Aztec DSL' },
              { name: 'Leo', use: 'Aleo' },
            ].map(s => (
              <div key={s.name} className="rounded bg-muted/50 px-2 py-1.5">
                <p className="text-sm font-semibold"><code>{s.name}</code></p>
                <p className="text-xs text-muted-foreground">{s.use}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 산업 동향 */}
        <div className="not-prose rounded-lg border-l-4 border-l-amber-500 bg-card p-4">
          <div className="text-sm font-semibold mb-1">산업 동향</div>
          <p className="text-sm text-muted-foreground">
            $5B+ 투자 (2022-2024) / 수백 개 ZK 프로젝트 / Ethereum rollup 지배 / AI + ZK (zkML) 급부상
          </p>
        </div>
      </div>
    </section>
  );
}

import HotStuffPipelineViz from './viz/HotStuffPipelineViz';
import HotStuffDetailViz from './viz/HotStuffDetailViz';

export default function HotStuff() {
  return (
    <section id="hotstuff" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">HotStuff</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          HotStuff (Yin et al., 2019) — <strong>PBFT의 O(n²) 통신을 O(n) Star topology</strong>로 해결.<br />
          Threshold signature + 파이프라이닝으로 throughput 동시 향상.<br />
          Libra(Diem) → Aptos의 기반 합의 프로토콜.
        </p>
      </div>
      <div className="not-prose mb-8"><HotStuffDetailViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <h3 className="text-xl font-semibold mb-3">Chained HotStuff 파이프라인</h3>
        <p className="leading-7">
          매 view에서 하나의 투표로 여러 블록의 진행을 동시 처리 — 3-chain commit rule.
        </p>
      </div>
      <div className="not-prose mb-8"><HotStuffPipelineViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        {/* ── HotStuff 핵심 혁신 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">HotStuff의 3가지 혁신</h3>
        <div className="grid gap-3 not-prose mb-4">
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">혁신 1: Linear View Change (<code className="text-xs">O(n³)</code> → <code className="text-xs">O(n)</code>)</p>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">PBFT view change</p>
                <p>each → all: VIEW-CHANGE + <code className="text-xs">O(n)</code> proofs.<br /><code className="text-xs">O(n²)</code> messages × <code className="text-xs">O(n)</code> proof = <code className="text-xs">O(n³)</code></p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">HotStuff view change</p>
                <p>each → leader: <code className="text-xs">NewView(highQC)</code>.<br /><code className="text-xs">O(n)</code> messages × <code className="text-xs">O(1)</code> proof = <code className="text-xs">O(n)</code>. 1000x+ 효율 개선.</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">혁신 2: Star Topology (<code className="text-xs">O(n²)</code> → <code className="text-xs">O(n)</code>)</p>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">PBFT: all-to-all</p>
                <p>각 phase당 <code className="text-xs">n × (n-1)</code> messages. 모든 link 활용.</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">HotStuff: leader-centric</p>
                <p>leader broadcasts → replicas vote → leader aggregates. <code className="text-xs">O(n)</code>/phase.<br />Trade-off: leader bottleneck → rotate per view로 해결.</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">혁신 3: Chained Voting (파이프라이닝)</p>
            <p className="text-sm mb-1">Basic: 1 block / 4 phases → Chained: 1 block / 1 view. throughput 3x 향상.</p>
            <p className="text-sm text-muted-foreground">핵심 insight: <code className="text-xs">vote for B_v = prepareQC for B_(v-1)</code> — 매 vote가 여러 역할 수행.</p>
            <p className="text-sm mt-1">3-chain commit: <code className="text-xs">B ← B' ← B''</code> (consecutive views) → 3 rounds QC → safety via chained locking.</p>
          </div>
        </div>
        <p className="leading-7">
          3가지 혁신: <strong>linear VC, star topology, chained voting</strong>.<br />
          PBFT의 O(n²)/O(n³) → HotStuff의 O(n)/O(n).<br />
          throughput 3x + validator 10x+ 확장성.
        </p>

        {/* ── Threshold Signature 심층 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Threshold Signature (BLS12-381)</h3>
        <div className="grid gap-3 not-prose mb-4">
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">BLS Signature 흐름</p>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Setup</p>
                <p><code className="text-xs">G1, G2, GT</code>: elliptic curve groups, pairing <code className="text-xs">e: G1 × G2 → GT</code>, hash <code className="text-xs">H: msg → G1</code>, generator <code className="text-xs">g ∈ G2</code></p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">KeyGen / Sign / Verify</p>
                <p>KeyGen: <code className="text-xs">sk ∈ Z_q</code>, <code className="text-xs">pk = g^sk</code><br />Sign: <code className="text-xs">σ = H(m)^sk</code><br />Verify: <code className="text-xs">e(σ, g) == e(H(m), pk)</code> — 1 pairing</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">Aggregation</p>
            <p className="text-sm"><code className="text-xs">σ_agg = σ_1 · σ_2 · ... · σ_k</code> (G1 group multiplication). <code className="text-xs">pk_agg = pk_1 · ... · pk_k</code>.<br />검증: <code className="text-xs">e(σ_agg, g) == e(H(m), pk_agg)</code> — 여전히 1 pairing. <code className="text-xs">n=100</code>일 때 67 pairings → 1 pairing (67x 빠른 검증).</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">HotStuff QC 구조</p>
            <p className="text-sm"><code className="text-xs">block_hash</code> + <code className="text-xs">view</code> + <code className="text-xs">sig_agg</code> (96 bytes, BLS12-381) + <code className="text-xs">signers</code> (bitmap, <code className="text-xs">n/8</code> bytes). 전체 크기: signature <code className="text-xs">O(1)</code>, bitmap <code className="text-xs">O(n)</code>.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="rounded-lg border border-destructive/30 p-4">
              <p className="font-semibold text-sm mb-1">공격 방어</p>
              <p className="text-sm">Rogue key attack → Proof-of-Possession(PoP). Small subgroup attack → membership check. 구현 세심 필요.</p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="font-semibold text-sm mb-1">블록체인 사용 현황</p>
              <p className="text-sm">Ethereum 2.0 / Chia / Diem / Aptos: BLS12-381. Cosmos: Ed25519 (aggregation 지원 약함).</p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          BLS aggregation = <strong>n개 서명 → 1개 서명, n개 검증 → 1 pairing</strong>.<br />
          HotStuff O(n) 달성의 암호학적 기반.<br />
          96 bytes signature (BLS12-381), Ethereum 2.0이 대표 사용자.
        </p>

        {/* ── 실무 적용 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">HotStuff 실무 적용 사례</h3>
        <div className="grid gap-3 sm:grid-cols-2 not-prose mb-4">
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">Diem/Libra (2019-2022)</p>
            <p className="text-sm">Facebook blockchain. LibraBFT(HotStuff 구현). 2022 종료(규제 이슈).</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">Aptos (2022-현재)</p>
            <p className="text-sm">Diem 개발자 창립. DiemBFT v4(Jolteon 기반). Move language. 100K+ TPS 목표.</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">ThunderCore (2019-)</p>
            <p className="text-sm">PaLa + HotStuff. EVM 호환. Asia 시장.</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">Cypherium / Concordium</p>
            <p className="text-sm">Cypherium: PoW + BFT hybrid. Concordium: 규제 친화적 privacy.</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 not-prose mb-4">
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">HotStuff 계열 변형</p>
            <ul className="text-sm space-y-1 list-disc pl-4">
              <li>Jolteon — 2-chain commit</li>
              <li>Ditto — async fallback</li>
              <li>HotStuff-2 — 2-phase + TC</li>
              <li>Marlin — optimized HotStuff</li>
              <li>Streamlet — simplified HotStuff</li>
            </ul>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">성능 벤치마크</p>
            <p className="text-sm"><strong>HotStuff (origin)</strong>: 128 validators, 25K TPS, ~500ms latency (single region).</p>
            <p className="text-sm mt-1"><strong>Jolteon (Aptos)</strong>: ~100 validators, 100K+ TPS(Quorum Store), ~1s latency (global).</p>
            <p className="text-sm mt-2 text-muted-foreground">DAG-BFT 진화: 1 block/view → multiple blocks/wave → 10-100x throughput.</p>
          </div>
        </div>
        <p className="leading-7">
          HotStuff = <strong>Diem/Aptos 기반, ThunderCore 등 적용</strong>.<br />
          실측 25K+ TPS, Jolteon 변형으로 100K+ 달성.<br />
          DAG-BFT (2022-) 등장 전 최선의 sequential BFT.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 HotStuff가 BFT의 "표준"이 된 이유</strong> — 이론과 실무 결합.<br />
          학술적 완결성 (formal proof) + production-grade 구현 (Libra).<br />
          이후 모든 BFT 프로토콜은 HotStuff와 비교 (baseline).<br />
          DAG-BFT조차 HotStuff concepts (QC, TC) 재사용.
        </p>
      </div>
    </section>
  );
}

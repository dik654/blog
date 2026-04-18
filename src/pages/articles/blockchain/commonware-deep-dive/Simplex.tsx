import SimplexViz from './viz/SimplexViz';

export default function Simplex() {
  return (
    <section id="simplex" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Simplex Consensus</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          Benjamin Chan · Rafael Pass가 TCC 2023에서 발표한 BFT 프로토콜
          <br />
          PBFT(1999) → Tendermint(2014) → HotStuff(2018) → <strong>Simplex(2023)</strong> 계보의 최신 합의
        </p>
        <p className="leading-7">
          4가지 핵심 혁신:
          <br />
          <strong>즉시 View 전환</strong> — Cert(k, x) 수집 즉시 view k+1로 이동. 기존처럼 머무르며 View-change 전송 불가
          <br />
          <strong>No-Commit 증명</strong> — n-f개 View-change(k) = 해당 view에서 결정 없었음을 증명
          <br />
          <strong>리더 대기 제거</strong> — 기존 2Δ 대기 완전 제거. 리더는 즉시 제안
          <br />
          <strong>짧은 Timeout</strong> — View-change timeout 6Δ → 3Δ로 단축
        </p>
        <p className="leading-7">
          Commonware의 <code>consensus::simplex</code>가 프로덕션 구현
          <br />
          <code>consensus::threshold_simplex</code> — VRF + BLS 임계 서명 추가 변형
        </p>
      </div>
      <div className="not-prose mb-8"><SimplexViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">BFT Consensus 계보</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 not-prose mb-6">
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-1">PBFT <span className="text-muted-foreground font-normal">(1999, Castro & Liskov)</span></h4>
            <ul className="text-sm space-y-0.5 text-muted-foreground mt-2">
              <li>첫 실용적 BFT</li>
              <li>3 phases — pre-prepare, prepare, commit</li>
              <li>Quadratic <code className="text-xs">O(n²)</code> view change</li>
              <li>37 pages paper</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-1">Tendermint <span className="text-muted-foreground font-normal">(2014, Buchman)</span></h4>
            <ul className="text-sm space-y-0.5 text-muted-foreground mt-2">
              <li>Practical BFT for blockchain</li>
              <li>Locking mechanism for safety</li>
              <li>Cosmos, Celestia에서 사용</li>
              <li>Higher latency</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-1">HotStuff <span className="text-muted-foreground font-normal">(2018, Yin et al.)</span></h4>
            <ul className="text-sm space-y-0.5 text-muted-foreground mt-2">
              <li>Linear view change <code className="text-xs">O(n)</code></li>
              <li>3-chain commit</li>
              <li>Pipeline 가능 (Chained HotStuff)</li>
              <li>Diem/Aptos에서 사용</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-1">HotStuff-2 / Fast-HotStuff <span className="text-muted-foreground font-normal">(2022)</span></h4>
            <ul className="text-sm space-y-0.5 text-muted-foreground mt-2">
              <li>2-chain commit (optimistic)</li>
              <li>Better latency</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-card p-4 border-blue-500/30 bg-blue-500/5">
            <h4 className="font-semibold text-sm mb-1">Simplex <span className="text-muted-foreground font-normal">(2023, Chan & Pass)</span></h4>
            <ul className="text-sm space-y-0.5 text-muted-foreground mt-2">
              <li>2 round optimal (happy path)</li>
              <li><code className="text-xs">O(n²)</code> messages but simpler proofs</li>
              <li>15 pages paper</li>
              <li>Fast view change — 3Δ vs 6Δ</li>
            </ul>
          </div>
        </div>
        <div className="rounded-lg border border-border bg-card p-5 not-prose mb-6">
          <h4 className="font-semibold text-sm mb-2 text-muted-foreground">Trade-offs</h4>
          <div className="space-y-1 text-sm">
            <div><strong className="text-foreground">Simplex</strong> <span className="text-muted-foreground">— simplicity + speed</span></div>
            <div><strong className="text-foreground">HotStuff</strong> <span className="text-muted-foreground">— scalability (linear view change)</span></div>
            <div><strong className="text-foreground">Tendermint</strong> <span className="text-muted-foreground">— battle-tested</span></div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Simplex 라운드 구조</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mb-6">
          <div className="rounded-lg border border-border bg-card p-5">
            <h4 className="font-semibold text-base mb-3">Round 1: Propose + Vote</h4>
            <ol className="text-sm space-y-1 text-muted-foreground list-decimal list-inside">
              <li>Leader broadcasts <code className="text-xs">Propose(k, block)</code></li>
              <li>Each replica: verify block, vote if valid, broadcast <code className="text-xs">Vote(k, block_hash)</code></li>
              <li>On 2f+1 votes: form <code className="text-xs">Cert(k, block_hash)</code></li>
            </ol>
          </div>
          <div className="rounded-lg border border-border bg-card p-5">
            <h4 className="font-semibold text-base mb-3">Round 2: Finalize</h4>
            <ol className="text-sm space-y-1 text-muted-foreground list-decimal list-inside">
              <li>Any replica sees <code className="text-xs">Cert(k, block_hash)</code></li>
              <li>Broadcasts <code className="text-xs">Finalize(k, block_hash)</code></li>
              <li>On 2f+1 Finalize: block committed</li>
              <li>즉시 view k+1로 전환</li>
            </ol>
          </div>
        </div>
        <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-5 not-prose mb-6">
          <h4 className="font-semibold text-sm mb-2">Key Innovation: 즉시 View 전환</h4>
          <ul className="text-sm space-y-0.5 text-muted-foreground">
            <li><code className="text-xs">Cert</code> 받으면 바로 k+1 진입</li>
            <li>과거 view에서 추가 vote/lock 불필요</li>
            <li>Happy path에서 linear messaging</li>
          </ul>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 not-prose mb-6">
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Unhappy Path: View Change</h4>
            <ol className="text-sm space-y-0.5 text-muted-foreground list-decimal list-inside">
              <li>Timer expires without <code className="text-xs">Cert(k)</code></li>
              <li>Broadcast <code className="text-xs">ViewChange(k)</code></li>
              <li>2f+1 ViewChange → No-Commit proof for k</li>
              <li>Start view k+1 with new leader</li>
            </ol>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Safety</h4>
            <ul className="text-sm space-y-0.5 text-muted-foreground">
              <li>No conflicting Cert in same view</li>
              <li>View k에서 committed → 영구 유지</li>
              <li>View change cannot rewrite history</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Liveness</h4>
            <ul className="text-sm space-y-0.5 text-muted-foreground">
              <li>Good leader → progress</li>
              <li>Faulty leader → 3Δ timeout → view change</li>
              <li>GST 이후 progress guaranteed</li>
            </ul>
          </div>
        </div>

      </div>
    </section>
  );
}

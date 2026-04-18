import M from '@/components/ui/math';
import ConsensusClassViz from './viz/ConsensusClassViz';

export default function ConsensusClass() {
  return (
    <section id="consensus-class" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">합의 알고리즘 분류</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          장애 모델(CFT vs BFT)과 최종성 유형(결정적 vs 확률적)으로 분류.
        </p>
      </div>
      <div className="not-prose"><ConsensusClassViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">합의 알고리즘 분류</h3>

        {/* 1. Fault Model */}
        <h4 className="text-lg font-semibold mt-5 mb-3">1. Fault Model별 분류</h4>
        <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">CFT (Crash Fault Tolerance)</div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li><M>{'n \\geq 2f+1'}</M> nodes</li>
              <li>노드가 멈추거나 연결 끊김만 허용</li>
              <li>악의적 행동 없음</li>
              <li>예: Paxos, Raft, ZAB (ZooKeeper)</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-red-600 dark:text-red-400 mb-2">BFT (Byzantine Fault Tolerance)</div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li><M>{'n \\geq 3f+1'}</M> nodes</li>
              <li>악의적 노드 허용</li>
              <li>블록체인 표준</li>
              <li>예: PBFT, Tendermint, HotStuff</li>
            </ul>
          </div>
        </div>

        {/* 2. Finality */}
        <h4 className="text-lg font-semibold mt-5 mb-3">2. Finality별 분류</h4>
        <div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-2">Deterministic Finality</div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>한번 확정 = 영원히 유효</li>
              <li>즉시 또는 빠른 finality</li>
              <li>예: Tendermint, HotStuff, Algorand</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-amber-600 dark:text-amber-400 mb-2">Probabilistic Finality</div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>시간이 지날수록 확실</li>
              <li>Fork 가능성 점차 감소</li>
              <li>예: Bitcoin (6 confirmations)</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-purple-600 dark:text-purple-400 mb-2">Economic Finality</div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>롤백 = 경제적 비용</li>
              <li>Slashing mechanism</li>
              <li>예: Ethereum 2.0 Casper</li>
            </ul>
          </div>
        </div>

        {/* 3. Leader 선출 */}
        <h4 className="text-lg font-semibold mt-5 mb-3">3. Leader 선출별</h4>
        <div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">Rotating Leader</div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>라운드마다 다른 리더</li>
              <li>Round-robin 또는 random</li>
              <li>예: PBFT, Tendermint</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-2">Stable Leader</div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>실패 전까지 한 리더</li>
              <li>View change on failure</li>
              <li>예: Paxos, Raft</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-amber-600 dark:text-amber-400 mb-2">Leaderless</div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>리더 없음</li>
              <li>Probabilistic</li>
              <li>예: Avalanche, Snowflake</li>
            </ul>
          </div>
        </div>

        {/* 4. Chain Structure */}
        <h4 className="text-lg font-semibold mt-5 mb-3">4. Chain Structure별</h4>
        <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">Linear Chain</div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>하나의 체인</li>
              <li>예: Bitcoin, Ethereum, BFT</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-2">DAG (Directed Acyclic Graph)</div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>병렬 블록 &rarr; 높은 throughput</li>
              <li>예: IOTA, Narwhal+Bullshark, Aleph</li>
            </ul>
          </div>
        </div>

        {/* 블록체인 매핑 테이블 */}
        <h4 className="text-lg font-semibold mt-5 mb-3">실제 블록체인 매핑</h4>
        <div className="not-prose overflow-x-auto mb-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 font-semibold">Blockchain</th>
                <th className="text-left p-2 font-semibold">Fault Model</th>
                <th className="text-left p-2 font-semibold">Finality</th>
                <th className="text-right p-2 font-semibold">Throughput</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b border-dashed"><td className="p-2">Bitcoin</td><td className="p-2">PoW</td><td className="p-2">Probabilistic</td><td className="p-2 text-right">7 tps</td></tr>
              <tr className="border-b border-dashed"><td className="p-2">Ethereum</td><td className="p-2">PoS+BFT</td><td className="p-2">Deterministic</td><td className="p-2 text-right">15 tps</td></tr>
              <tr className="border-b border-dashed"><td className="p-2">Solana</td><td className="p-2">PoS</td><td className="p-2">Probabilistic</td><td className="p-2 text-right">65K tps</td></tr>
              <tr className="border-b border-dashed"><td className="p-2">Cosmos</td><td className="p-2">BFT</td><td className="p-2">Deterministic</td><td className="p-2 text-right">~10K tps</td></tr>
              <tr className="border-b border-dashed"><td className="p-2">Avalanche</td><td className="p-2">PoS</td><td className="p-2">Probabilistic</td><td className="p-2 text-right">4500 tps</td></tr>
              <tr className="border-b border-dashed"><td className="p-2">Aptos</td><td className="p-2">HotStuff</td><td className="p-2">Deterministic</td><td className="p-2 text-right">~160K tps</td></tr>
              <tr><td className="p-2">Sui</td><td className="p-2">DAG BFT</td><td className="p-2">Deterministic</td><td className="p-2 text-right">120K+ tps</td></tr>
            </tbody>
          </table>
        </div>

        {/* Trade-offs */}
        <div className="not-prose rounded-lg border-l-4 border-l-amber-500 bg-card p-4 mb-2">
          <div className="text-sm font-semibold mb-2">Trade-offs</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
            <div>Decentralization &harr; Throughput</div>
            <div>Finality speed &harr; Finality certainty</div>
            <div>Leader stability &harr; Fairness</div>
            <div>Chain purity &harr; Parallelism</div>
          </div>
        </div>
      </div>
    </section>
  );
}

import M from '@/components/ui/math';
import CAPViz from './viz/CAPViz';

export default function CAP() {
  return (
    <section id="cap" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">CAP 정리 & PACELC</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          Brewer(2000) — 분산 시스템은 C, A, P 중 최대 2가지만 동시 보장. 네트워크 분할은 불가피 &rarr; C vs A 선택.
        </p>
      </div>
      <div className="not-prose"><CAPViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">CAP 정리와 PACELC</h3>

        {/* 3가지 속성 */}
        <h4 className="text-lg font-semibold mt-5 mb-3">CAP의 3가지 속성</h4>
        <div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-1">C — Consistency (일관성)</div>
            <p className="text-sm text-muted-foreground">모든 노드가 같은 데이터 반환 (<code className="text-xs bg-muted px-1 rounded">Linearizability</code>)</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-1">A — Availability (가용성)</div>
            <p className="text-sm text-muted-foreground">모든 요청이 응답 받음 (정답 아니어도)</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-amber-600 dark:text-amber-400 mb-1">P — Partition Tolerance (분할 내성)</div>
            <p className="text-sm text-muted-foreground">네트워크 분할 시에도 동작</p>
          </div>
        </div>
        <div className="not-prose rounded-lg border-l-4 border-l-red-500 bg-card p-4 mb-6">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold">정리:</span> P가 발생하면 C와 A 모두 만족 불가 &rarr; 2개만 선택 가능.
            현실에서 Partition은 발생하므로 P는 필수 &rarr; <span className="font-semibold">CP 또는 AP</span> 선택.
          </p>
        </div>

        {/* CP vs AP */}
        <h4 className="text-lg font-semibold mt-5 mb-3">CP vs AP 분류</h4>
        <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">CP (Consistency + Partition tolerance)</div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>일관성 우선</li>
              <li>Partition 시 일부 unavailable</li>
              <li>예: HBase, MongoDB (single master), etcd</li>
              <li>적합: 은행, 결제 시스템</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-2">AP (Availability + Partition tolerance)</div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>가용성 우선</li>
              <li>Partition 시 stale data 반환 가능</li>
              <li>Eventually consistent</li>
              <li>예: Cassandra, DynamoDB, Riak</li>
              <li>적합: SNS, 캐시</li>
            </ul>
          </div>
        </div>

        {/* PACELC */}
        <h4 className="text-lg font-semibold mt-5 mb-3">PACELC (Abadi 2012)</h4>
        <div className="not-prose rounded-lg border-l-4 border-l-amber-500 bg-card p-4 mb-4">
          <p className="text-sm text-muted-foreground mb-1">
            <span className="font-semibold">P</span>artition 발생 &rarr; <span className="font-semibold">A</span>와 <span className="font-semibold">C</span> 중 선택 /
            <span className="font-semibold"> E</span>lse (정상) &rarr; <span className="font-semibold">L</span>(Latency)과 <span className="font-semibold">C</span> 중 선택
          </p>
        </div>
        <div className="not-prose grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-3 text-center">
            <div className="text-sm font-semibold mb-1">PA / EL</div>
            <p className="text-xs text-muted-foreground">Cassandra, DynamoDB</p>
          </div>
          <div className="rounded-lg border bg-card p-3 text-center">
            <div className="text-sm font-semibold mb-1">PC / EC</div>
            <p className="text-xs text-muted-foreground">HBase, BigTable</p>
          </div>
          <div className="rounded-lg border bg-card p-3 text-center">
            <div className="text-sm font-semibold mb-1">PA / EC</div>
            <p className="text-xs text-muted-foreground">MongoDB (config)</p>
          </div>
          <div className="rounded-lg border bg-card p-3 text-center">
            <div className="text-sm font-semibold mb-1">PC / EL</div>
            <p className="text-xs text-muted-foreground">drop by default</p>
          </div>
        </div>

        {/* 블록체인과 CAP */}
        <h4 className="text-lg font-semibold mt-5 mb-3">블록체인과 CAP</h4>
        <div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-amber-600 dark:text-amber-400 mb-2">Bitcoin</div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li><span className="font-medium">AP</span> (eventual consistency)</li>
              <li>Chain fork &rarr; 가용성 유지</li>
              <li>Final confirmation 후 C</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">Ethereum 2.0 PoS</div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li><span className="font-medium">CP</span> with finality</li>
              <li>Finality 후 consistent</li>
              <li>Unfinalized: AP-like</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-2">Tendermint</div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li><span className="font-medium">CP</span> (consistency)</li>
              <li>2/3+ votes로 instant finality</li>
              <li>Network partition &rarr; halt (no fork)</li>
            </ul>
          </div>
        </div>

        {/* 실무 Trade-offs */}
        <div className="not-prose rounded-lg border-l-4 border-l-blue-500 bg-card p-4 mb-2">
          <div className="text-sm font-semibold mb-2">실무 Trade-offs</div>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>Strong consistency &rarr; latency 증가 / High availability &rarr; consistency 저하</li>
            <li><code className="text-xs bg-muted px-1 rounded">CRDT</code> — conflict-free replicated data types</li>
            <li><code className="text-xs bg-muted px-1 rounded">Vector clocks</code> — causal consistency</li>
            <li>Quorum systems: <M>{'R + W > N'}</M></li>
          </ul>
        </div>
      </div>
    </section>
  );
}

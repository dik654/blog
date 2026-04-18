import StorageViz from './viz/StorageViz';

export default function Storage() {
  return (
    <section id="storage" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">저장 프리미티브 (MMR · ADB · QMDB)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          <strong>Merkle Mountain Range</strong>(MMR) — 감소하는 높이의 트리 리스트
          <br />
          Merkle Tree와 달리 append-only, O(1) 순차 쓰기, SSD 친화적, GC 불필요
          <br />
          블록체인 상태 저장에 최적화된 구조
        </p>
        <p className="leading-7">
          <strong>storage::adb</strong>(Authenticated Database) — MMR 기반 인증 데이터베이스 제품군
          <br />
          <strong>adb::any</strong> — "어떤 시점에 키가 특정 값을 가졌음"을 증명
          <br />
          <strong>adb::current</strong> — "키의 현재 값"을 증명. Activity Merkle Tree와 Grafting 기법 사용
        </p>
        <p className="leading-7">
          <strong>QMDB</strong>(Quick Merkle Database) — LayerZero와 협력 개발
          <br />
          상태 읽기: 1 SSD read · 상태 업데이트: O(1) SSD I/O · Merkleization: 메모리 내(0 SSD I/O)
          <br />
          메모리: 2.3 bytes/entry · 처리량: 최대 2.28M 상태 업데이트/초
        </p>
      </div>
      <div className="not-prose mb-8"><StorageViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">MMR (Merkle Mountain Range) 구조</h3>
        <div className="rounded-lg border border-border bg-card p-5 not-prose mb-6">
          <p className="text-sm text-muted-foreground mb-3">
            Append-only authenticated structure — Open Timestamps & Grin에서 유래.
            여러 Merkle tree를 크기 내림차순으로 배열, 새 leaf 추가 시 같은 크기 트리 병합
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-sm mb-2">Append 알고리즘</h4>
              <ol className="text-sm space-y-1 text-muted-foreground list-decimal list-inside">
                <li><code className="text-xs">mmr.push(new_leaf)</code></li>
                <li>같은 크기 트리가 있으면 <code className="text-xs">right</code>, <code className="text-xs">left</code> pop</li>
                <li><code className="text-xs">parent = hash(left, right)</code></li>
                <li>parent push, 반복</li>
              </ol>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-2">특성</h4>
              <ul className="text-sm space-y-0.5 text-muted-foreground">
                <li><code className="text-xs">O(log n)</code> amortized append</li>
                <li>Append-only — no delete, no modify</li>
                <li>Proofs: <code className="text-xs">O(log n)</code> size</li>
                <li>SSD friendly — sequential write</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-border bg-card p-4 not-prose mb-6">
          <h4 className="font-semibold text-sm mb-2 text-muted-foreground">용도</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div><strong className="text-foreground">Beacon chain history</strong> <span className="text-muted-foreground">— Ethereum</span></div>
            <div><strong className="text-foreground">Timestamp protocols</strong></div>
            <div><strong className="text-foreground">Ordered event logs</strong></div>
            <div><strong className="text-foreground">Oracle data feeds</strong></div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">QMDB 아키텍처</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Quick Merkle Database — LayerZero & Commonware collaboration
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 not-prose mb-6">
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">1. In-memory Merkle Tree</h4>
            <ul className="text-sm space-y-0.5 text-muted-foreground">
              <li>모든 tree node가 RAM에 상주</li>
              <li>Hash 재계산 instant</li>
              <li>2.3 bytes/entry overhead</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">2. SSD-backed Values</h4>
            <ul className="text-sm space-y-0.5 text-muted-foreground">
              <li>Values만 SSD에 저장</li>
              <li>Key → SSD offset mapping</li>
              <li>1 SSD read per <code className="text-xs">get_value</code></li>
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">3. Append-only Log</h4>
            <ul className="text-sm space-y-0.5 text-muted-foreground">
              <li>Updates는 log에 기록</li>
              <li>No random SSD writes</li>
              <li>Compaction 주기적</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">4. Radix Patricia Tree</h4>
            <ul className="text-sm space-y-0.5 text-muted-foreground">
              <li>Ethereum MPT와 유사</li>
              <li>16-way branching (hex)</li>
              <li>Path compression</li>
            </ul>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mb-6">
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2 text-muted-foreground">성능 목표</h4>
            <ul className="text-sm space-y-0.5 text-muted-foreground">
              <li>State query: <strong className="text-foreground">1 SSD read</strong></li>
              <li>State update: <strong className="text-foreground"><code className="text-xs">O(1)</code> SSD I/O</strong></li>
              <li>Merkleization: <strong className="text-foreground">0 SSD I/O</strong> (in-memory)</li>
              <li>Throughput: <strong className="text-foreground">2.28M updates/sec</strong></li>
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2 text-muted-foreground">메모리 비교</h4>
            <div className="text-sm space-y-1 text-muted-foreground">
              <div><strong className="text-foreground">QMDB</strong> — 1B entries x 2.3B = ~2.3 GB RAM</div>
              <div><strong className="text-foreground">일반 MPT</strong> — ~40 GB (metadata overhead)</div>
            </div>
            <h4 className="font-semibold text-sm mb-2 mt-3 text-muted-foreground">사용 사례</h4>
            <ul className="text-sm space-y-0.5 text-muted-foreground">
              <li>L1 state storage</li>
              <li>High-throughput chains</li>
              <li>Real-time analytics</li>
            </ul>
          </div>
        </div>

      </div>
    </section>
  );
}

import M from '@/components/ui/math';
import ContextViz from './viz/ContextViz';
import SystemModelViz from './viz/SystemModelViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">분산 시스템 모델</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          블록체인의 이론적 토대 — 분산 시스템의 통신 모델, 한계, 해결책.
        </p>
      </div>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="not-prose"><SystemModelViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">분산 시스템 모델 구분</h3>

        {/* 1. Timing Model */}
        <h4 className="text-lg font-semibold mt-5 mb-3">1. Timing Model (시간 모델)</h4>
        <div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">Synchronous</div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>메시지 지연 상한 <code className="text-xs bg-muted px-1 rounded">known</code></li>
              <li>Clock drift 상한 <code className="text-xs bg-muted px-1 rounded">known</code></li>
              <li>가장 강력한 가정</li>
              <li>현실: 거의 불가능</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-amber-600 dark:text-amber-400 mb-2">Asynchronous</div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>메시지 지연 상한 없음</li>
              <li>언제 도착할지 모름</li>
              <li>가장 약한 가정</li>
              <li>FLP impossibility 적용</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-2">Partial Synchronous</div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>대부분 sync, 가끔 async</li>
              <li><code className="text-xs bg-muted px-1 rounded">GST</code> (Global Stabilization Time) 이후 sync</li>
              <li>현실적 중간 모델</li>
              <li>대부분 BFT 프로토콜의 가정</li>
            </ul>
          </div>
        </div>

        {/* 2. Failure Model */}
        <h4 className="text-lg font-semibold mt-5 mb-3">2. Failure Model (장애 모델)</h4>
        <div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">Crash Failure (Fail-Stop)</div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>노드가 멈추거나 메시지 손실</li>
              <li>악의적 행동 없음</li>
              <li>Tolerance: <M>f &lt; n/2</M> (majority)</li>
              <li>예: Paxos, Raft</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-red-600 dark:text-red-400 mb-2">Byzantine Failure</div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>임의의 악의적 행동 가능</li>
              <li>거짓말, 메시지 변조, 음모</li>
              <li>Tolerance: <M>f &lt; n/3</M></li>
              <li>예: PBFT, Tendermint, HotStuff</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Omission Failure</div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>메시지를 보내지 않음</li>
              <li>Crash의 부분 집합</li>
            </ul>
          </div>
        </div>

        {/* 3. Network Model */}
        <h4 className="text-lg font-semibold mt-5 mb-3">3. Network Model</h4>
        <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">Reliable Channels</div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>메시지 결국 전달됨</li>
              <li>Lossy &rarr; lossless 변환 가능</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-2">Authenticated Channels</div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>발신자 확인 가능</li>
              <li>Digital signature 필수</li>
            </ul>
          </div>
        </div>

        {/* 핵심 정리 */}
        <h4 className="text-lg font-semibold mt-5 mb-3">핵심 정리</h4>
        <div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          <div className="rounded-lg border-l-4 border-l-red-500 bg-card p-4">
            <div className="text-sm font-semibold mb-1">FLP (1985)</div>
            <p className="text-sm text-muted-foreground">Async + 1 crash &rarr; 결정적 합의 불가능</p>
          </div>
          <div className="rounded-lg border-l-4 border-l-amber-500 bg-card p-4">
            <div className="text-sm font-semibold mb-1">CAP (2000)</div>
            <p className="text-sm text-muted-foreground">Consistency, Availability, Partition-tolerance &rarr; 2개만 선택 가능</p>
          </div>
          <div className="rounded-lg border-l-4 border-l-blue-500 bg-card p-4">
            <div className="text-sm font-semibold mb-1">Byzantine Generals (1982)</div>
            <p className="text-sm text-muted-foreground"><M>f</M> Byzantine faults &rarr; <M>{'n \\geq 3f+1'}</M> 필요</p>
          </div>
        </div>

        {/* 블록체인 매핑 */}
        <h4 className="text-lg font-semibold mt-5 mb-3">블록체인 매핑</h4>
        <div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-3 mb-2">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-amber-600 dark:text-amber-400 mb-2">Bitcoin</div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>Partial sync</li>
              <li>Byzantine (PoW)</li>
              <li>Probabilistic finality</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">Ethereum 2.0</div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>Partial sync</li>
              <li>Byzantine (PoS Casper FFG)</li>
              <li>Deterministic finality (2 epochs)</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-2">Tendermint/Cosmos</div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>Partial sync</li>
              <li>Byzantine BFT</li>
              <li>Instant finality</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

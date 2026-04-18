import M from '@/components/ui/math';
import FLPViz from './viz/FLPViz';

export default function FLP() {
  return (
    <section id="flp" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">FLP 불가능성 정리</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          Fischer, Lynch, Paterson(1985) — 비동기 시스템에서 단 하나의 crash fault로도 결정적 합의 불가능.
        </p>
      </div>
      <div className="not-prose"><FLPViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">FLP Impossibility 정리</h3>

        {/* 정리 정의 */}
        <div className="not-prose rounded-lg border-l-4 border-l-red-500 bg-card p-4 mb-6">
          <div className="text-sm font-semibold mb-2">FLP Impossibility Theorem (1985)</div>
          <p className="text-sm italic text-muted-foreground mb-2">
            "In an asynchronous system where at least one process may fail by crashing, there is no deterministic consensus protocol that can guarantee termination."
          </p>
          <p className="text-sm text-muted-foreground">
            Async + 1 crash &rarr; 결정적 합의 불가능
          </p>
        </div>

        {/* 합의의 3 필수 속성 */}
        <h4 className="text-lg font-semibold mt-5 mb-3">합의의 3 필수 속성</h4>
        <div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-1">Agreement</div>
            <p className="text-sm text-muted-foreground">모든 정직한 노드가 같은 값 결정</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-1">Validity</div>
            <p className="text-sm text-muted-foreground">결정된 값은 제안된 값 중 하나</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-amber-600 dark:text-amber-400 mb-1">Termination</div>
            <p className="text-sm text-muted-foreground">모든 정직한 노드가 언젠가 결정</p>
          </div>
        </div>

        {/* 증명 아이디어 */}
        <h4 className="text-lg font-semibold mt-5 mb-3">증명 아이디어</h4>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-mono text-muted-foreground mb-1">Step 1</div>
            <div className="text-sm font-semibold mb-1">Bivalent Configuration</div>
            <p className="text-sm text-muted-foreground">어떤 결과든 가능한 상태 — 0도 1도 결정될 수 있음</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-mono text-muted-foreground mb-1">Step 2</div>
            <div className="text-sm font-semibold mb-1">Critical Step</div>
            <p className="text-sm text-muted-foreground">메시지 도착 순서가 최종 결과를 결정</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-mono text-muted-foreground mb-1">Step 3</div>
            <div className="text-sm font-semibold mb-1">Adversary Scheduling</div>
            <p className="text-sm text-muted-foreground">메시지를 지연시켜 계속 bivalent 상태 유지</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-mono text-muted-foreground mb-1">Step 4</div>
            <div className="text-sm font-semibold mb-1">Infinite Execution</div>
            <p className="text-sm text-muted-foreground">영원히 결정 못 함 &rarr; Termination 위반</p>
          </div>
        </div>

        {/* 현실의 해결책 */}
        <h4 className="text-lg font-semibold mt-5 mb-3">현실의 해결책</h4>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-1">1. Synchrony 가정</div>
            <p className="text-sm text-muted-foreground">Message timeout 사용</p>
            <p className="text-xs text-muted-foreground mt-1">예: Raft, Paxos (partial sync)</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-1">2. Randomization</div>
            <p className="text-sm text-muted-foreground">Ben-Or protocol — <M>{'O(\\text{expected rounds})'}</M></p>
            <p className="text-xs text-muted-foreground mt-1">예: Algorand, Dfinity</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-amber-600 dark:text-amber-400 mb-1">3. Failure Detector</div>
            <p className="text-sm text-muted-foreground"><code className="text-xs bg-muted px-1 rounded">&#x25C7;P</code> (eventually perfect) — Chandra-Toueg algorithm</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-red-600 dark:text-red-400 mb-1">4. Probabilistic Termination</div>
            <p className="text-sm text-muted-foreground">"eventually with high probability"</p>
            <p className="text-xs text-muted-foreground mt-1">예: Bitcoin Nakamoto consensus</p>
          </div>
        </div>

        {/* 블록체인 해결 방식 */}
        <h4 className="text-lg font-semibold mt-5 mb-3">블록체인 해결 방식</h4>
        <div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-amber-600 dark:text-amber-400 mb-2">Bitcoin / PoW</div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>Probabilistic consensus</li>
              <li>Longest chain rule</li>
              <li>No deterministic termination</li>
              <li>6 confirmations = "effectively final"</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">PBFT (Castro-Liskov 1999)</div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>Partial sync assumption</li>
              <li>View change mechanism</li>
              <li><M>{'n \\geq 3f + 1'}</M></li>
              <li>Deterministic when sync</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-2">HotStuff</div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>Linear view change</li>
              <li>Pipelined consensus</li>
              <li>Tendermint, Diem 기반</li>
            </ul>
          </div>
        </div>

        {/* FLP의 의미 */}
        <div className="not-prose rounded-lg border-l-4 border-l-amber-500 bg-card p-4 mb-2">
          <div className="text-sm font-semibold mb-2">FLP의 의미</div>
          <p className="text-sm text-muted-foreground mb-1">
            "완벽한 비동기 결정적 합의는 불가" &rarr; 실용적 합의는 가정을 필요로 하며, 가정을 완화하며 progress 확보.
          </p>
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">역설:</span> Bitcoin이 10년 이상 돌아가는 이유 = async + random + economic incentives
          </p>
        </div>
      </div>
    </section>
  );
}

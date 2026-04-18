import M from '@/components/ui/math';
import ByzantineViz from './viz/ByzantineViz';

export default function BFTTheory() {
  return (
    <section id="bft-theory" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Byzantine 장군 문제</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          Lamport, Shostak, Pease(1982) — 배신자가 있는 분산 합의의 형식화. n명 중 f명이 악의적일 때 합의 가능 조건.
        </p>
      </div>
      <div className="not-prose"><ByzantineViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Byzantine Generals Problem</h3>

        {/* 시나리오 + 조건 */}
        <div className="not-prose rounded-lg border-l-4 border-l-red-500 bg-card p-4 mb-6">
          <div className="text-sm font-semibold mb-2">시나리오</div>
          <p className="text-sm text-muted-foreground mb-1">
            <M>n</M>명의 장군이 도시 포위 &mdash; 공격 vs 후퇴 결정. 일부는 배신자(악의적). 목표: 정직한 장군끼리 같은 결정.
          </p>
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">조건:</span> 모든 정직한 장군이 같은 계획 / 정직한 장군이 제안하면 모두 따름.
          </p>
        </div>

        {/* 핵심 정리 */}
        <h4 className="text-lg font-semibold mt-5 mb-3">핵심 정리</h4>
        <div className="not-prose rounded-lg border bg-card p-4 mb-4">
          <div className="text-center mb-3">
            <M display>{'n \\geq 3f + 1'}</M>
          </div>
          <p className="text-sm text-muted-foreground text-center mb-3">
            <M>f</M> = 최대 Byzantine 노드 수 &rarr; 1/3 미만의 악의적 노드만 허용
          </p>
          <div className="grid grid-cols-3 gap-2 text-center text-sm text-muted-foreground">
            <div className="rounded bg-muted/50 p-2"><M>f=1</M>: <M>{'n \\geq 4'}</M></div>
            <div className="rounded bg-muted/50 p-2"><M>f=2</M>: <M>{'n \\geq 7'}</M></div>
            <div className="rounded bg-muted/50 p-2"><M>f=3</M>: <M>{'n \\geq 10'}</M></div>
          </div>
        </div>

        {/* 왜 3f+1? */}
        <h4 className="text-lg font-semibold mt-5 mb-3">왜 3f+1?</h4>
        <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-red-600 dark:text-red-400 mb-2"><M>n = 3f</M> 인 경우 (불가능)</div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>정직한 노드 <M>2f</M>, 악의적 <M>f</M></li>
              <li>가상 분할 시나리오 구성 가능</li>
              <li>정직한 노드들을 다른 결정으로 유도</li>
              <li>&rarr; 합의 불가능</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-2"><M>n = 3f+1</M> 일 때 (가능)</div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>다수결: <M>{'2f+1 > f'}</M></li>
              <li>Quorum intersection 보장</li>
              <li>악의적 노드가 양쪽을 속일 수 없음</li>
            </ul>
          </div>
        </div>

        {/* PBFT */}
        <h4 className="text-lg font-semibold mt-5 mb-3">PBFT (Castro-Liskov 1999)</h4>
        <div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-mono text-muted-foreground mb-1">Phase 1</div>
            <div className="text-sm font-semibold mb-1">Pre-prepare</div>
            <p className="text-sm text-muted-foreground">Leader가 제안</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-mono text-muted-foreground mb-1">Phase 2</div>
            <div className="text-sm font-semibold mb-1">Prepare</div>
            <p className="text-sm text-muted-foreground">모두 검증, <M>2f+1</M> prepare 수집</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-mono text-muted-foreground mb-1">Phase 3</div>
            <div className="text-sm font-semibold mb-1">Commit</div>
            <p className="text-sm text-muted-foreground"><M>2f+1</M> commit 수집 &rarr; finalize</p>
          </div>
        </div>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold mb-1">View Change</div>
            <p className="text-sm text-muted-foreground">Leader 악의적 &rarr; 새 leader. <M>2f+1</M> view change 메시지 필요</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold mb-1">통신 복잡도</div>
            <p className="text-sm text-muted-foreground">Normal: <M>{'O(n^2)'}</M> / View change: <M>{'O(n^3)'}</M></p>
          </div>
        </div>

        {/* 현대 BFT 개선 */}
        <h4 className="text-lg font-semibold mt-5 mb-3">현대 BFT 개선</h4>
        <div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">Tendermint (2016)</div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>2-phase (pre-vote + pre-commit)</li>
              <li>Instant finality</li>
              <li>Cosmos, Binance Chain</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-2">HotStuff (2019)</div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>Linear view change <M>O(n)</M></li>
              <li>Pipelining</li>
              <li>Diem (Meta), Aptos, Sui</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-amber-600 dark:text-amber-400 mb-2">Fast BFT Variants</div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>SBFT, Mir-BFT</li>
              <li>Narwhal+Bullshark</li>
              <li>Scalability 개선</li>
            </ul>
          </div>
        </div>

        {/* 블록체인 관점 */}
        <h4 className="text-lg font-semibold mt-5 mb-3">블록체인 관점</h4>
        <div className="not-prose grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          <div className="rounded-lg border bg-card p-3 text-center">
            <div className="text-sm font-semibold mb-1">PoW</div>
            <p className="text-xs text-muted-foreground">"economic Byzantine" via cost</p>
          </div>
          <div className="rounded-lg border bg-card p-3 text-center">
            <div className="text-sm font-semibold mb-1">PoS</div>
            <p className="text-xs text-muted-foreground">slashing + BFT finality gadget</p>
          </div>
          <div className="rounded-lg border bg-card p-3 text-center">
            <div className="text-sm font-semibold mb-1">DPoS</div>
            <p className="text-xs text-muted-foreground">limited validator set + BFT</p>
          </div>
          <div className="rounded-lg border bg-card p-3 text-center">
            <div className="text-sm font-semibold mb-1">BFT-direct</div>
            <p className="text-xs text-muted-foreground">Tendermint, HotStuff</p>
          </div>
        </div>

        {/* Limit */}
        <div className="not-prose rounded-lg border-l-4 border-l-amber-500 bg-card p-4 mb-2">
          <div className="text-sm font-semibold mb-1">Bound 정리</div>
          <p className="text-sm text-muted-foreground">
            <M>{'n \\geq 3f+1'}</M>은 asynchronous BFT의 tight bound.
            Synchronous 환경에서는 <M>{'n \\geq 2f+1'}</M> (다수결)로 충분.
          </p>
        </div>
      </div>
    </section>
  );
}

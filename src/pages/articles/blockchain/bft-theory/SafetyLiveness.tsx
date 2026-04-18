import SafetyLivenessViz from './viz/SafetyLivenessViz';

export default function SafetyLiveness() {
  return (
    <section id="safety-liveness" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">안전성 vs 활성</h2>
      <div className="not-prose mb-6"><SafetyLivenessViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <p className="leading-7">
          분산 합의의 <strong>양대 정확성 속성</strong>.<br />
          Safety — "나쁜 일은 절대 일어나지 않음", Liveness — "좋은 일은 결국 일어남".<br />
          FLP 불가능성: 비동기에서 둘 다 deterministic 보장 불가.
        </p>

        {/* ── 정의 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">형식적 정의</h3>
        <div className="not-prose grid gap-3 sm:grid-cols-2 mb-4">
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
            <p className="font-semibold text-sm mb-2">Safety (안전성): "Nothing bad happens"</p>
            <p className="text-xs text-muted-foreground mb-2">합의에서</p>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li><strong>Agreement</strong> — 모든 정직 노드가 같은 값 decide</li>
              <li><strong>Validity</strong> — decide된 값은 어떤 노드가 제안한 값</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-2">블록체인에서</p>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>No double-spend (같은 UTXO 두 번 불가)</li>
              <li>No fork conflict (두 상충 block 동시 finalize 불가)</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-2">"violated in finite time" — 위반은 유한 시간 내 <strong>감지 가능</strong></p>
          </div>
          <div className="rounded-lg border border-sky-500/30 bg-sky-500/5 p-4">
            <p className="font-semibold text-sm mb-2">Liveness (활성): "Something good eventually happens"</p>
            <p className="text-xs text-muted-foreground mb-2">합의에서</p>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li><strong>Termination</strong> — 모든 정직 노드가 결국 decide</li>
              <li><strong>Progress</strong> — 새 값이 결국 추가됨</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-2">블록체인에서</p>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>Block finalization (TX가 결국 finalize)</li>
              <li>Chain advance (새 block 주기적 생성)</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-2">"not violated in finite time" — "아직 안 일어남" ≠ "영원히 안 일어남"</p>
          </div>
        </div>
        <p className="leading-7">
          Safety는 <strong>유한 관측으로 위반 감지</strong> 가능.<br />
          Liveness는 <strong>무한 관측 필요</strong> — 위반 증명이 이론적으로 어려움.<br />
          Safety는 확률적 보장 불가, Liveness는 timing 가정 필요.
        </p>

        {/* ── FLP 불가능성 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">FLP 불가능성 정리 (1985)</h3>
        <div className="not-prose space-y-3 mb-4">
          <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4">
            <p className="font-semibold text-sm mb-2">Fischer-Lynch-Paterson Impossibility</p>
            <p className="text-sm">비동기 분산 시스템에서 단 1개 노드 crash 가능해도, 모든 정직 노드가 유한 시간에 합의에 도달하는 <strong>deterministic 알고리즘은 존재하지 않는다</strong>.</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">증명 개요</p>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li><strong>bivalent state</strong> — 아직 0/1 어느 쪽으로도 갈 수 있는 상태</li>
              <li>비동기 → 메시지 delay 조절 가능 → 항상 bivalent 유지하는 스케줄 존재</li>
              <li>→ 영원히 decide 안 할 수 있음</li>
            </ul>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border p-4">
              <p className="font-semibold text-sm mb-2">우회 1: Randomization</p>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>Ben-Or 1983, HoneyBadger BFT</li>
                <li>coin-flip으로 bivalent 탈출</li>
                <li>확률 1로 terminate</li>
              </ul>
            </div>
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
              <p className="font-semibold text-sm mb-2">우회 2: Partial Sync</p>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>DLS 1988, GST 이후 동기</li>
                <li><strong>거의 모든 실무 BFT 선택</strong></li>
                <li>PBFT, HotStuff, Tendermint</li>
              </ul>
            </div>
            <div className="rounded-lg border p-4">
              <p className="font-semibold text-sm mb-2">우회 3: Failure Detector</p>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>Chandra-Toueg 1996</li>
                <li>◇P (eventually perfect)</li>
                <li>감지기 자체에 timing 가정</li>
              </ul>
            </div>
          </div>
        </div>
        <p className="leading-7">
          FLP = <strong>비동기 deterministic 합의 불가능</strong>.<br />
          우회: randomization, partial sync, failure detector.<br />
          실무 BFT는 대부분 partial sync 선택 (HotStuff, PBFT, Tendermint).
        </p>

        {/* ── Safety vs Liveness Trade-off ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Safety/Liveness Trade-off (CAP 정리)</h3>
        <div className="not-prose space-y-3 mb-4">
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">CAP 정리 (Brewer 2000, Gilbert-Lynch 2002)</p>
            <p className="text-sm mb-2">Consistency, Availability, Partition tolerance — 3개 중 2개만 동시 보장.</p>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li><strong>Consistency ≈ Safety</strong> (같은 값 보장)</li>
              <li><strong>Availability ≈ Liveness</strong> (응답 보장)</li>
              <li><strong>Partition tolerance</strong> = 필수 (네트워크 항상 파티션 가능)</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-2">P 고정 → C(Safety) vs A(Liveness) 선택</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
              <p className="font-semibold text-sm mb-2">CP 시스템 (Safety 우선)</p>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>BFT 블록체인: Tendermint, HotStuff</li>
                <li>DB: HBase, MongoDB (strong consistency)</li>
                <li>Tendermint: 1/3+ 다운 시 <strong>halt</strong> (liveness 포기)</li>
                <li>절대 fork 안 남 (safety 보장)</li>
              </ul>
            </div>
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
              <p className="font-semibold text-sm mb-2">AP 시스템 (Liveness 우선)</p>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>Nakamoto 블록체인: Bitcoin</li>
                <li>DB: Cassandra, DynamoDB (eventual)</li>
                <li>네트워크 파티션에도 각자 계속 생산</li>
                <li>fork 가능 (safety probabilistic)</li>
              </ul>
            </div>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">부분 동기의 답</p>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>GST 이전: AP 모드 (liveness 보장 못 함)</li>
              <li>GST 이후: CP 모드 (둘 다 보장)</li>
              <li>Safety는 <strong>영원히</strong> 보장, Liveness만 희생</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-2">Tendermint: validator 34% 다운 → halt, but fork 없음 → 복구 시 liveness 회복</p>
          </div>
        </div>
        <p className="leading-7">
          BFT 블록체인 = <strong>CP (Safety &gt; Liveness)</strong>.<br />
          validator 1/3 이상 다운 시 halt — fork는 절대 안 남.<br />
          금융 시스템이 safety 포기할 수 없기 때문.
        </p>

        {/* ── 실제 프로토콜의 선택 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">실제 프로토콜의 선택</h3>
        <div className="not-prose rounded-lg border p-4 mb-4">
          <div className="overflow-x-auto">
            <table className="text-sm w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-1 pr-3">프로토콜</th>
                  <th className="text-left py-1 pr-3">Safety</th>
                  <th className="text-left py-1 pr-3">Liveness</th>
                  <th className="text-left py-1">비고</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-dashed"><td className="py-1 pr-3">PBFT (1999)</td><td className="py-1 pr-3">always</td><td className="py-1 pr-3">synchronous periods</td><td className="py-1">view change로 stuck 탈출</td></tr>
                <tr className="border-b border-dashed"><td className="py-1 pr-3">Tendermint (2014)</td><td className="py-1 pr-3">always</td><td className="py-1 pr-3">1/3+ 다운 시 halt</td><td className="py-1">안전하지만 취약</td></tr>
                <tr className="border-b border-dashed"><td className="py-1 pr-3">HotStuff (2018)</td><td className="py-1 pr-3">always</td><td className="py-1 pr-3">partial sync + rotation</td><td className="py-1">3-chain rule commit</td></tr>
                <tr className="border-b border-dashed"><td className="py-1 pr-3">Nakamoto (2008)</td><td className="py-1 pr-3">probabilistic</td><td className="py-1 pr-3">always (honest majority)</td><td className="py-1">51% 공격 시 safety 깨짐</td></tr>
                <tr className="border-b border-dashed"><td className="py-1 pr-3">Avalanche (2019)</td><td className="py-1 pr-3">probabilistic</td><td className="py-1 pr-3">always (sub-sampling)</td><td className="py-1">파라미터 튜닝</td></tr>
                <tr><td className="py-1 pr-3">Ethereum 2.0</td><td className="py-1 pr-3">BFT (Casper FFG)</td><td className="py-1 pr-3">probabilistic (GHOST)</td><td className="py-1">하이브리드</td></tr>
              </tbody>
            </table>
          </div>
          <div className="mt-3 rounded bg-muted/50 p-3">
            <p className="text-sm font-semibold mb-1">설계 교훈</p>
            <ol className="text-sm space-y-0.5 list-decimal list-inside">
              <li>안전성이 뚫리면 복구 불가 (rollback 재앙)</li>
              <li>활성이 안 되면 잠시 멈춤 (복구 가능)</li>
              <li>따라서 BFT는 항상 <strong>safety 우선</strong></li>
              <li>Nakamoto는 liveness 우선 (open membership)</li>
            </ol>
          </div>
        </div>
        <p className="leading-7">
          <strong>Safety 깨짐 = 복구 불가</strong>, Liveness 멈춤 = 일시적.<br />
          그래서 BFT는 항상 safety 우선 — Tendermint는 1/3 다운에 halt 감수.<br />
          Ethereum 2.0은 하이브리드 — FFG(safety) + GHOST(liveness) 각각.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 "항상 Safety 우선"이 합리적인가</strong> — 비대칭적 손실.<br />
          Liveness 실패는 복구 가능한 불편함, Safety 실패는 돈이 두 곳에 존재하는 재앙.<br />
          금융 시스템의 전제: 일시적 halt &gt;&gt; 영구적 불일치.
        </p>
      </div>
    </section>
  );
}

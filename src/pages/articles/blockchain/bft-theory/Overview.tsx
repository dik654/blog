import M from '@/components/ui/math';
import ContextViz from './viz/ContextViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">비잔틴 장군 문제</h2>
      <div className="not-prose mb-6"><ContextViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <p className="leading-7">
          Leslie Lamport가 1982년 논문 "The Byzantine Generals Problem"에서 제기.<br />
          분산 노드 일부가 임의로 거짓말(악의적 메시지 위조)을 할 때, 정직 노드들이 <strong>공통 결정</strong>에 도달할 수 있는가.<br />
          현대 블록체인·분산 DB·항공 제어·원자력 발전소 안전 시스템의 이론적 토대.
        </p>

        {/* ── 문제 설정 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">문제 설정: 장군 비유</h3>
        <div className="not-prose grid gap-3 sm:grid-cols-2 mb-4">
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">상황 (Lamport 1982)</p>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li><code>n</code>명의 장군이 도시를 포위</li>
              <li>각 장군은 <strong>공격</strong> 또는 <strong>후퇴</strong> 결정</li>
              <li>전달자를 통해서만 통신 (메시지 전달 모델)</li>
              <li>일부 장군은 배신자 (Byzantine = 배신자)</li>
            </ul>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">합의 요건</p>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li><strong>IC1 (Agreement)</strong> — 모든 정직 장군이 같은 결정</li>
              <li><strong>IC2 (Validity)</strong> — 커맨더가 정직하면 모든 정직 장군이 커맨더 명령 따름</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-2">배신자가 서로 다른 메시지를 전달해도 B, C는 누가 거짓말하는지 구별 불가</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">Lamport 핵심 정리</p>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>비서명: <M>{'n \\geq 3f+1'}</M> 필요</li>
              <li>서명 (Authenticated): <M>{'n \\geq f+2'}</M>까지 가능</li>
              <li>현대 블록체인은 대부분 서명 있는 모델</li>
            </ul>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">블록체인 매핑</p>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>장군 = <code>validator/node</code></li>
              <li>공격/후퇴 = block 수락/거부</li>
              <li>전달자 = P2P 네트워크</li>
              <li>배신자 = 악의적 validator (double-sign, censor)</li>
              <li>서명 = Ed25519 / BLS signature</li>
            </ul>
          </div>
        </div>
        <p className="leading-7">
          Byzantine은 <strong>임의의 악의적 행동</strong> — 거짓 메시지, 침묵, 모순된 응답.<br />
          Crash fault (단순 정지)와 구별 — 훨씬 강한 공격 모델.<br />
          <M>{'n \\geq 3f+1'}</M>은 비서명 모델의 하한, 블록체인은 서명으로 완화.
        </p>

        {/* ── 4가지 핵심 질문 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">BFT가 답해야 할 4가지 질문</h3>
        <div className="not-prose grid gap-3 sm:grid-cols-2 mb-4">
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">Q1. Fault Threshold</p>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>비서명: <M>{'f < n/3'}</M></li>
              <li>서명 + 부분동기: <M>{'f < n/3'}</M> (여전히)</li>
              <li>서명 + 동기: <M>{'f < n/2'}</M></li>
              <li>CFT (Crash only): <M>{'f < n/2'}</M></li>
            </ul>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">Q2. Timing Model</p>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li><strong>Synchronous</strong> — 지연 상한 <M>{String.raw`\Delta`}</M> 알려짐</li>
              <li><strong>Asynchronous</strong> — 상한 없음 (FLP 불가능성)</li>
              <li><strong>Partial Sync</strong> — GST 후 동기 (DLS 1988)</li>
            </ul>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">Q3. Safety vs Liveness</p>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li><strong>Safety</strong> — 다른 결정 금지 (never decide wrong)</li>
              <li><strong>Liveness</strong> — 결국 결정 (eventually decide)</li>
              <li>FLP: 비동기에서 deterministic 불가</li>
              <li>우회: randomization 또는 partial sync</li>
            </ul>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">Q4. 통신 복잡도</p>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li><M>{'O(n^2)'}</M> — PBFT, Tendermint (all-to-all)</li>
              <li><M>{'O(n)'}</M> — HotStuff (leader collects)</li>
              <li><M>{'O(n \\log n)'}</M> — DAG-based (Narwhal)</li>
              <li>실제 배포: validator 수 ≤ 수백</li>
            </ul>
          </div>
        </div>
        <div className="not-prose rounded-lg border p-4 mb-4">
          <p className="font-semibold text-sm mb-2">프로토콜별 선택 및 블록체인 채택</p>
          <div className="overflow-x-auto">
            <table className="text-sm w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-1 pr-3">프로토콜</th>
                  <th className="text-left py-1 pr-3">타이밍</th>
                  <th className="text-left py-1 pr-3">Threshold</th>
                  <th className="text-left py-1 pr-3">통신</th>
                  <th className="text-left py-1">채택</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-dashed"><td className="py-1 pr-3">PBFT</td><td className="py-1 pr-3">partial sync</td><td className="py-1 pr-3"><M>{'f < n/3'}</M></td><td className="py-1 pr-3"><M>{'O(n^2)'}</M></td><td className="py-1">Hyperledger</td></tr>
                <tr className="border-b border-dashed"><td className="py-1 pr-3">Tendermint</td><td className="py-1 pr-3">partial sync</td><td className="py-1 pr-3"><M>{'f < n/3'}</M></td><td className="py-1 pr-3"><M>{'O(n^2)'}</M></td><td className="py-1">Cosmos (CometBFT)</td></tr>
                <tr className="border-b border-dashed"><td className="py-1 pr-3">HotStuff</td><td className="py-1 pr-3">partial sync</td><td className="py-1 pr-3"><M>{'f < n/3'}</M></td><td className="py-1 pr-3"><M>{'O(n)'}</M></td><td className="py-1">Aptos (Jolteon)</td></tr>
                <tr className="border-b border-dashed"><td className="py-1 pr-3">Narwhal</td><td className="py-1 pr-3">partial sync</td><td className="py-1 pr-3"><M>{'f < n/3'}</M></td><td className="py-1 pr-3"><M>{'O(n)'}</M></td><td className="py-1">Sui (Mysticeti)</td></tr>
                <tr><td className="py-1 pr-3">Casper FFG</td><td className="py-1 pr-3">partial sync</td><td className="py-1 pr-3"><M>{'f < n/3'}</M></td><td className="py-1 pr-3">hybrid</td><td className="py-1">Ethereum 2</td></tr>
              </tbody>
            </table>
          </div>
        </div>
        <p className="leading-7">
          4가지 설계 축: <strong>fault threshold, timing, safety/liveness, communication</strong>.<br />
          블록체인 BFT는 대부분 partial sync, <M>{'f < n/3'}</M>, safety 우선.<br />
          통신 복잡도가 validator 수 한계 결정 (수백 규모).
        </p>

        {/* ── 왜 이제 와서 중요? ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">왜 40년 묵은 문제가 블록체인에서 부활?</h3>
        <div className="not-prose grid gap-3 sm:grid-cols-2 mb-4">
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">초기 BFT (1982-1999)</p>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li><strong>1982</strong> — Lamport, Byzantine Generals</li>
              <li><strong>1988</strong> — DLS, Partial synchrony 모델</li>
              <li><strong>1999</strong> — Castro-Liskov, PBFT (최초의 실용적 BFT)</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-2">3-phase + <M>{'O(n^2)'}</M> 메시지 + view change</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">쇠퇴기 (2000s)</p>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>데이터 센터는 CFT로 충분 (Paxos, Raft)</li>
              <li>Byzantine fault 실무 사례 드묾</li>
              <li><strong>2008</strong> — Bitcoin (PoW + longest chain, BFT 아님)</li>
            </ul>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">부활기 (2016-2022)</p>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li><strong>2016</strong> — Hyperledger Fabric, Tendermint</li>
              <li><strong>2018</strong> — HotStuff (<M>{'O(n)'}</M>, responsive, chained)</li>
              <li><strong>2022</strong> — Narwhal + Bullshark (50K+ TPS)</li>
            </ul>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">현재 (2024)</p>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>Mysticeti (Sui) — 390ms latency, 160K+ TPS</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-2">이론이 실제로 검증되는 시대</p>
          </div>
        </div>
        <div className="not-prose rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 mb-4">
          <p className="font-semibold text-sm mb-2">왜 블록체인이 BFT를 부활시켰나</p>
          <ol className="text-sm space-y-1 list-decimal list-inside">
            <li>경제적 가치 = 공격 인센티브 → Byzantine 고려 필수</li>
            <li>Open network = 누구나 악의적 노드 될 수 있음</li>
            <li>Safety 우선 = 거래 rollback 재앙</li>
            <li>성능 한계 = BFT 연구 재가속 (수만 TPS 필요)</li>
          </ol>
        </div>
        <p className="leading-7">
          BFT는 <strong>40년 이론 → 실무 재출현</strong>.<br />
          1999 PBFT 이후 쇠퇴 → 2016 블록체인 붐으로 부활.<br />
          2024 Mysticeti 160K TPS까지 진화 — 이론이 실제로 검증되는 시대.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 블록체인은 Byzantine 모델이 필수인가</strong> — 돈이 걸려 있기 때문.<br />
          Paxos/Raft는 같은 팀이 운영하는 서버 = 악의 없음 가정.<br />
          블록체인은 낯선 사람 간 협력 = 반드시 Byzantine 가정 — 경제적 공격 인센티브가 존재.
        </p>
      </div>
    </section>
  );
}

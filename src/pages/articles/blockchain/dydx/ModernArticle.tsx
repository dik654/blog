import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";
import { AuthorityViz, OrderPathViz } from "./viz/ModernDydxViz";

export default function ModernDydxArticle() {
  return <article className="space-y-14">
    <section id="overview" className="space-y-6">
      <header className="space-y-3"><p className="text-sm font-semibold text-primary">dYdX Chain protocol/v9.6.3 구현 읽기</p><h2 className="text-3xl font-bold tracking-tight">dYdX에서 order receipt, proposed match, committed settlement은 서로 다른 사실이다</h2></header>
      <p className="text-lg leading-8 text-foreground/90">Cosmos SDK bank 예제의 <code>Alice→Bob 10</code>은 받는 사람과 수량이 고정된 transfer입니다. 반면 dYdX에서 Alice가 10 contract bid를 내도 Bob에게 바로 이체되지 않습니다. Bob의 ask와 price·time priority로 match되고, 두 subaccount의 margin·position·fee·risk check가 모두 통과한 fill만 consensus application state로 settlement됩니다.</p>
      <p>CometBFT의 proposal/finalization authority와 Cosmos SDK branch/commit은 각각 <a className="text-primary hover:underline" href="/blockchain/cometbft-abci#prepare-process">ABCI++</a>와 <a className="text-primary hover:underline" href="/blockchain/cosmos-sdk#baseapp">Cosmos SDK 정본</a>을 재사용합니다. 이 글은 dYdX의 order class, MemClob, proposed operations, risk/settlement과 indexer projection 경계만 소유합니다.</p>
      <AuthorityViz />
    </section>

    <section id="orderbook-architecture" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">01 · Order class</p><h2 className="mt-2 text-2xl font-bold">Short-term order는 node memory에, long-term·conditional order는 chain state에 더 길게 남는다</h2></header>
      <p><code>OrderId.OrderFlags</code>는 short-term, long-term, conditional, TWAP 계열을 구분합니다. Short-term order는 <code>OrderFlags=0</code>이고 block height로 expiry하며, CheckTx/gossip에서 validator의 in-memory CLOB인 MemClob에 반영됩니다. Long-term·conditional order는 stateful order로 MsgPlaceOrder path에서 KV state에 기록되고 MemClob view와 sync됩니다.</p>
      <p>따라서 한 node의 orderbook에 Alice bid가 보인다는 것은 global commit receipt가 아닙니다. Validator마다 도착 시점과 short-term view가 다를 수 있으며, proposer가 operations로 block candidate에 실은 뒤 replicas가 validation·execution해야 fill과 removal이 authoritative해집니다.</p>
      <OrderPathViz />
      <div id="paper-dydx-order-types-v963"><CitationBlock source="dYdX v4-chain protocol/v9.6.3 — x/clob/types/order_id.go" citeKey={1} type="code" href="https://github.com/dydxprotocol/v4-chain/blob/protocol/v9.6.3/protocol/x/clob/types/order_id.go"><p><strong>문제:</strong> Order identity에 persistence·expiry class를 명시적으로 encode합니다.</p><p><strong>기여:</strong> Short-term·stateful·conditional·TWAP 판별과 deterministic sorting/state-key conversion을 구현합니다.</p><p><strong>전제:</strong> protocol/v9.6.3 OrderId flag·subaccount·client ID semantics을 사용합니다.</p><p><strong>근거 범위:</strong> dYdX order identity·class contract입니다.</p><p><strong>말하지 않는 것:</strong> Valid ID를 collateral validity·match·fill·commit으로 보장하지 않습니다.</p></CitationBlock></div>
    </section>

    <section id="matching-engine" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">02 · Matching과 risk</p><h2 className="mt-2 text-2xl font-bold">Price가 cross했다고 바로 fill하지 않고 잔량·collateral·position transition을 함께 검증한다</h2></header>
      <p>MemClob은 price-time priority로 executable liquidity를 찾지만 proposer가 만든 match를 다른 validator가 무조건 신뢰하지는 않습니다. Process-proposed-operations path는 order identity, side·price·remaining size, duplicate fill/removal, subaccount collateralization, liquidation/rate limits과 deterministic ordering을 다시 검사한 뒤 state update를 생성합니다.</p>
      <ExplainedFormula question="Bid·ask가 cross했을 때 이 두 order로 최대 얼마나 fill할 수 있는가?" idea={<>Buy limit이 sell limit 이상일 때만 price condition이 맞고, 이미 fill된 수량을 뺀 두 remaining quantity 중 작은 값이 match 상한입니다. Risk check가 더 작은 수량을 허용하거나 match를 거절할 수 있습니다.</>} formula={String.raw`p_{bid}\ge p_{ask},\qquad q_{candidate}=\min(q_{bid}-f_{bid},\;q_{ask}-f_{ask})`}
      annotatedFormula={String.raw`p_{bid}\ge p_{ask},\qquad q_{candidate}=\underbrace{\min(q_{bid}-f_{bid},\;q_{ask}-f_{ask})}_{\text{경계 후보 선택}}`}
      operations={[
        { expression: String.raw`\min(q_{bid}-f_{bid},\;q_{ask}-f_{ask})`, annotation: ["허용 후보 중 목적에 맞는 경계값을 선택합니다.","Buy limit이 sell limit 이상일 때만 price","condition이 맞고, 이미 fill된 수량을 뺀 두","remaining quantity 중 작은 값이 match"] },
      ]} terms={[{symbol:"p_{bid},p_{ask}",name:"limit prices",description:"Buyer의 최대 가격과 seller의 최소 가격입니다."},{symbol:"q_{bid},q_{ask}",name:"order quantums",description:"각 order의 초기 integer 수량입니다."},{symbol:"f_{bid},f_{ask}",name:"filled quantums",description:"해당 order에 이미 누적된 fill 수량입니다."},{symbol:"q_{candidate}",name:"quantity upper bound",description:"이 pair가 liquidity로 제공할 수 있는 최대 candidate입니다."}]} assumptions={["Price·quantity는 protocol이 정한 integer units와 tick/step 제약을 따릅니다.","Order가 expiry·cancellation·reduce-only 규칙을 통과합니다.","Subaccount collateral·position·liquidation/rate-limit check가 별도로 통과해야 합니다.","Execution price·fee·maker/taker role은 이 최소 식만으로 결정되지 않습니다."]} interpretation="Alice bid가 10 중 2 fill, Bob ask가 6 중 1 fill이면 remaining은 8과 5이므로 candidate는 5입니다. 그러나 Bob의 position update가 margin 규칙을 깨면 5가 바로 committed fill이 되지 않습니다." />
      <div id="paper-dydx-matching-v963"><CitationBlock source="dYdX v4-chain protocol/v9.6.3 — x/clob keeper·memclob" citeKey={2} type="code" href="https://github.com/dydxprotocol/v4-chain/tree/protocol/v9.6.3/protocol/x/clob"><p><strong>문제:</strong> Node-local order view에서 proposer match를 만들고 deterministic state transition으로 검증합니다.</p><p><strong>기여:</strong> Price-time MemClob, proposed operations, single-match·order/removal·risk processing을 구현합니다.</p><p><strong>전제:</strong> protocol/v9.6.3 module ordering, oracle·subaccount state와 dYdX CometBFT integration을 사용합니다.</p><p><strong>근거 범위:</strong> dYdX CLOB candidate/match execution boundary입니다.</p><p><strong>말하지 않는 것:</strong> Local top-of-book·proposer operation을 committed fill이나 fair global arrival order로 보장하지 않습니다.</p></CitationBlock></div>
    </section>

    <section id="cosmos-integration" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">03 · Consensus settlement</p><h2 className="mt-2 text-2xl font-bold">Block은 order intent 자체보다 검증 가능한 operation과 state transition을 확정한다</h2></header>
      <p>Proposer의 candidate block은 order placements/removals·matches·liquidations 같은 operations를 담습니다. Replicas는 proposal validation에서 encoding·ordering·limits를 확인하고 FinalizeBlock에서 같은 operations를 실행해 positions, quote balance, fills, fees·funding, removals와 indexer events를 계산합니다. Consensus safety는 모든 replicas가 같은 block을 결정한다는 것이지, proposer가 본 모든 local order를 실어 준다는 fairness 보장이 아닙니다.</p>
      <p>Release fixture는 같은 Alice/Bob orders, oracle price, account/subaccount state와 block context를 모든 validator에 주고 order·fill·position·balance·event hash parity를 검사합니다. Duplicate proposed match, expired order, insufficient collateral, wrong fill amount과 altered operation order는 fail closed해야 합니다.</p>
    </section>

    <section id="indexer" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">04 · Indexer projection</p><h2 className="mt-2 text-2xl font-bold">Indexer와 frontend는 chain event를 읽기 좋은 view로 재구성하지만 settlement owner가 아니다</h2></header>
      <p>Chain은 deterministic state transition과 versioned events를 남기지만 사용자가 필요한 candle, historical fills, account timeline, market aggregates를 모두 query-optimized 형태로 보관하지는 않습니다. Indexer는 event subtype/version과 block identity를 소비해 database projection을 만들고 frontend/API에 제공합니다.</p>
      <p>이 projection은 lag·duplicate delivery·out-of-order processing·schema migration·reorg 처리에서 chain과 달라질 수 있으므로 block height/hash·event version을 idempotency key와 checkpoint로 사용해야 합니다. Indexer DB를 비운 뒤 retained chain/event source에서 replay했을 때 같은 projection을 재구성할 수 있어야 하며, 잔액·position·fill 분쟁에서는 committed chain state/receipt가 우선합니다.</p>
      <div id="paper-dydx-indexer-v963"><CitationBlock source="dYdX v4-chain protocol/v9.6.3 — indexer event source" citeKey={3} type="code" href="https://github.com/dydxprotocol/v4-chain/tree/protocol/v9.6.3/indexer"><p><strong>문제:</strong> Consensus application event를 query-oriented off-chain records로 materialize합니다.</p><p><strong>기여:</strong> Versioned event types, ingestion handlers·schema와 service boundaries를 제공합니다.</p><p><strong>전제:</strong> protocol/v9.6.3 event encoding, ordered block identity와 retained replay source를 사용합니다.</p><p><strong>근거 범위:</strong> dYdX indexer projection implementation입니다.</p><p><strong>말하지 않는 것:</strong> API response를 consensus receipt로, indexer availability를 chain liveness로 보장하지 않습니다.</p></CitationBlock></div>
      <h3 className="text-xl font-semibold">이 글만으로 풀어야 하는 10문제</h3><p>기초 6문제는 order/transaction, short-term/stateful, MemClob, matching·risk, settlement, indexer를 확인합니다. 심화 4문제는 divergent local books, malicious proposal, collateral failure과 indexer replay/reconciliation release gate를 설계하게 합니다.</p>
    </section>
  </article>;
}

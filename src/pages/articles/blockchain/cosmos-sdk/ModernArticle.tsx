import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";
import { CosmosTxViz, ExecutionModeViz } from "./viz/ModernCosmosSDKViz";

export default function ModernCosmosSDKArticle() {
  return <article className="space-y-14">
    <section id="overview" className="space-y-6">
      <header className="space-y-3"><p className="text-sm font-semibold text-primary">Cosmos SDK v0.55.0 구현 읽기</p><h2 className="text-3xl font-bold tracking-tight">Cosmos SDK는 ordered transaction bytes를 모듈 상태 전이와 committed version으로 바꾸는 application framework다</h2></header>
      <p className="text-lg leading-8 text-foreground/90">CometBFT가 <code>Alice→Bob 10 stake</code>의 순서를 결정하더라도 balance를 이해하지는 않습니다. Cosmos SDK application의 BaseApp이 bytes를 transaction으로 decode하고, AnteHandler에서 fee·sequence·signature를 검증한 뒤 <code>MsgSend</code>를 bank MsgServer로 routing해 Alice와 Bob의 balance state를 바꾸어야 비로소 이 요청이 도메인 의미를 갖습니다.</p>
      <p>ABCI method의 candidate/committed authority와 crash replay는 <a className="text-primary hover:underline" href="/blockchain/cometbft-abci">ABCI++ 정본</a>이 소유합니다. 이 글은 SDK v0.55.0의 execution mode, ante/message routing, keeper/store branch라는 application 경계에 집중합니다.</p>
      <CosmosTxViz />
    </section>

    <section id="baseapp" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">01 · BaseApp mode</p><h2 className="mt-2 text-2xl font-bold">같은 handler도 어떤 branch에서 실행되는지에 따라 권위가 다르다</h2></header>
      <p><code>CheckTx</code>는 node-local mempool admission을 위한 실행이며 write를 committed store에 반영하지 않습니다. <code>Simulate</code>도 gas·result를 미리 보기 위한 discarded branch입니다. 반면 <code>FinalizeBlock</code>은 CometBFT가 결정한 ordered txs를 block context에서 실행하고, 성공한 child cache writes만 block branch에 합친 뒤 <code>Commit</code>이 durable version으로 만듭니다.</p>
      <p>Context에는 block height/time, gas meters, event manager, execution mode와 MultiStore branch가 들어있습니다. Handler가 global clock·random source·unpinned network response를 읽으면 replica마다 result가 달라질 수 있으므로 consensus input에 포함된 context만으로 deterministic하게 계산해야 합니다.</p>
      <ExecutionModeViz />
      <div id="paper-cosmos-baseapp-v055"><CitationBlock source="Cosmos SDK v0.55.0 — baseapp" citeKey={1} type="code" href="https://github.com/cosmos/cosmos-sdk/tree/v0.55.0/baseapp"><p><strong>문제:</strong> ABCI request와 query/simulation을 mode별 isolated state transition으로 연결합니다.</p><p><strong>기여:</strong> BaseApp context, block execution, tx routing과 response/error 경계를 구현합니다.</p><p><strong>전제:</strong> v0.55.0 application wiring, deterministic module handlers와 compatible CometBFT ABCI를 사용합니다.</p><p><strong>근거 범위:</strong> Cosmos SDK BaseApp execution orchestration입니다.</p><p><strong>말하지 않는 것:</strong> CheckTx OK를 block inclusion·commit으로, handler return을 disk durability로 확대하지 않습니다.</p></CitationBlock></div>
    </section>

    <section id="runtx-pipeline" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">02 · Ante → message</p><h2 className="mt-2 text-2xl font-bold">AnteHandler는 transaction envelope를, MsgServer는 business transition을 검증한다</h2></header>
      <p>Default auth ante chain은 context setup, extension option, basic validation, timeout height, memo, transaction size gas, fee deduction, public-key setup, signature count/gas/verification과 sequence increment을 순서대로 적용합니다. Signature가 맞는다고 <code>MsgSend</code>가 성공하는 것은 아닙니다. Bank MsgServer는 address codec, blocked recipient, send-enabled policy, denom/amount와 spendable balance를 별도로 확인합니다.</p>
      <ExplainedFormula question="Transaction이 gas limit 안에서 완료되는지 어떻게 나누어 읽는가?" idea={<>Gas meter는 ante, 각 message handler와 post-handler의 소비를 같은 limit에 누적합니다. 이 식은 시간 단위가 아니라 application이 정한 deterministic accounting입니다.</>} formula={String.raw`G_{used}=G_{ante}+\sum_{i=1}^{m}G_{msg_i}+G_{post}\le G_{limit}`} terms={[{symbol:"G_{ante}",name:"ante gas",description:"Signature verification, tx bytes, fee/sequence check 등의 소비입니다."},{symbol:"G_{msg_i}",name:"message gas",description:"i번째 routed MsgServer와 keeper store access의 소비입니다."},{symbol:"G_{post}",name:"post gas",description:"Configured post-handler가 사용한 gas입니다."},{symbol:"G_{limit}",name:"transaction gas limit",description:"Transaction이 신청한 최대 application gas입니다."}]} assumptions={["Gas cost table은 chain release/config에 귀속됩니다.","Out-of-gas panic은 BaseApp recovery path에서 tx failure로 변환됩니다.","Block gas meter와 transaction gas meter를 구분합니다.","Gas unit은 wall-clock ns나 CPU instruction 수와 같지 않습니다."]} interpretation="Ante에서 30, MsgSend에서 50, post에서 5를 썼다면 total은 85입니다. Limit 80이면 child cache write를 merge하지 않지만 ante fee/sequence 처리의 정확한 rollback semantics는 mode와 SDK 구현을 따라 확인해야 합니다." />
      <div id="paper-cosmos-ante-bank-v055"><CitationBlock source="Cosmos SDK v0.55.0 — x/auth/ante · x/bank/keeper" citeKey={2} type="code" href="https://github.com/cosmos/cosmos-sdk/blob/v0.55.0/x/auth/ante/ante.go"><p><strong>문제:</strong> Transaction envelope authorization와 bank transfer policy를 단계별로 분리합니다.</p><p><strong>기여:</strong> Ordered ante decorators와 MsgSend handler/keeper boundary를 제공합니다.</p><p><strong>전제:</strong> App이 default ante chain과 bank MsgServer를 해당 ordering으로 wiring했습니다.</p><p><strong>근거 범위:</strong> v0.55.0 auth/bank transaction validation·execution입니다.</p><p><strong>말하지 않는 것:</strong> Custom ante chain·module policy가 같거나 signature OK가 balance availability를 보장한다고 말하지 않습니다.</p></CitationBlock></div>
    </section>

    <section id="module-architecture" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">03 · Module과 keeper</p><h2 className="mt-2 text-2xl font-bold">Module은 API와 lifecycle을 드러내고 keeper가 state capability를 제한한다</h2></header>
      <p>MsgServiceRouter는 protobuf type URL을 MsgServer method로 연결하고, keeper는 module이 접근할 store service와 다른 module capability를 구성자로 받습니다. Bank keeper가 account keeper를 필요한 interface로만 받는 이유는 모든 module이 raw keyspace와 module account를 임의로 수정하지 못하게 하려는 것입니다.</p>
      <p>이 경계는 Go package visibility만으로 완성되지 않습니다. App wiring에서 너무 넓은 keeper interface를 넘기거나 raw store service를 공유하면 capability가 다시 넓어집니다. Release test는 unauthorized module account transfer, blocked address, malformed type URL과 module ordering drift를 포함해야 합니다.</p>
    </section>

    <section id="state-management" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">04 · CacheMultiStore</p><h2 className="mt-2 text-2xl font-bold">Child branch의 Write와 root store Commit은 다른 durability 경계다</h2></header>
      <p>CacheMultiStore는 mounted store마다 cache branch를 만듭니다. Transaction child가 성공하면 <code>Write()</code>로 parent block branch에 merge하고, failure면 child를 폐기합니다. 하지만 parent에 merge된 것은 아직 disk committed version이 아니며 block의 <code>Commit</code>이 store version과 root hash를 durable하게 만듭니다.</p>
      <p>BlockSTM 같은 optimistic runner를 쓸 때도 observable result는 sequential semantics과 같아야 합니다. Read/write conflict, retry와 event order를 재현하지 못하면 performance optimization이 consensus semantics를 바꾸게 됩니다.</p>
      <div id="paper-cosmos-cachemulti-v055"><CitationBlock source="Cosmos SDK v0.55.0 — store/cachemulti/store.go" citeKey={3} type="code" href="https://github.com/cosmos/cosmos-sdk/blob/v0.55.0/store/cachemulti/store.go"><p><strong>문제:</strong> Multi-module writes를 parent에 선택적으로 merge하는 isolated branch를 만듭니다.</p><p><strong>기여:</strong> Store-key별 lazy cache, nested CacheWrap과 Write merge를 구현합니다.</p><p><strong>전제:</strong> RootMultiStore와 application Commit ordering이 별도로 정상 작동합니다.</p><p><strong>근거 범위:</strong> v0.55.0 in-memory branch/parent merge semantics입니다.</p><p><strong>말하지 않는 것:</strong> Child Write를 durable database commit이나 external side effect rollback으로 보장하지 않습니다.</p></CitationBlock></div>
      <h3 className="text-xl font-semibold">이 글만으로 풀어야 하는 10문제</h3><p>기초 6문제는 CometBFT/application 경계, mode, ante/message, gas, keeper, cache/commit을 확인합니다. 심화 4문제는 nondeterminism, partial failure, capability leak과 optimistic execution parity release gate를 설계하게 합니다.</p>
    </section>
  </article>;
}

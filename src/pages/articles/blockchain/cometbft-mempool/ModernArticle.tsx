import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";
import { AdmissionLifecycleViz, RecheckBarrierViz } from "./viz/ModernMempoolViz";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import { codeRefs } from "./codeRefs";
import { cometbftMempoolTree } from "./fileTrees";

export default function ModernCometBFTMempoolArticle() {
  const sidebar = useCodeSidebar();
  return <>
  <article className="space-y-14">
    <section id="overview" className="space-y-6">
      <header className="space-y-3"><p className="text-sm font-semibold text-primary">CometBFT v0.40.0 구현 읽기</p><h2 className="text-3xl font-bold tracking-tight">Mempool은 미확정 transaction의 local 대기실이지 공유 원장이 아니다</h2></header>
      <p className="text-lg leading-8 text-foreground/90"><code>alice→bob 10</code>이라는 같은 bytes도 node A의 mempool에는 있고 node B에는 없을 수 있습니다. 도착 순서, local capacity, cache, application CheckTx 결과가 node마다 다르기 때문입니다. 합의가 최종 block order를 정하기 전까지 mempool의 목록과 순서는 protocol-wide truth가 아닙니다.</p>
      <p>v0.40.0 <code>CListMempool</code>의 핵심은 admission과 commit을 분리하는 데 있습니다. 빠른 local gate와 ABCI CheckTx를 통과하면 proposal 후보가 되지만, proposer가 선택하고 consensus가 결정하고 application이 FinalizeBlock·Commit을 마쳐야 ledger state가 바뀝니다. 전체 흐름은 <a className="text-primary hover:underline" href="/blockchain/cometbft#overview">CometBFT overview 정본</a>, ABCI method authority는 <a className="text-primary hover:underline" href="/blockchain/cometbft-abci#overview">ABCI++ 정본</a>에서 이어집니다.</p>
      <AdmissionLifecycleViz />
    </section>

    <section id="clist" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">01 · CList와 queue</p><h2 className="mt-2 text-2xl font-bold">list 순서는 proposal 후보를 읽기 위한 local snapshot이다</h2></header>
      <p>CListMempool은 transaction을 linked list에 두고 TxKey로 element를 빠르게 찾는 map, 전체 byte 수와 개수 counter, 이미 본 transaction을 거르는 cache를 함께 둡니다. proposer 쪽은 <code>ReapMaxBytesMaxGas</code>로 앞에서부터 읽되 protobuf로 block data에 들어갈 실제 크기와 CheckTx에서 받은 <code>GasWanted</code> 누계를 제한합니다. raw transaction byte 합만 세면 encoding overhead 때문에 block 한도를 넘을 수 있습니다.</p>
      <p><code>TxsAvailable</code>은 height마다 한 번만 깨우는 capacity-1 signal입니다. transaction 수를 전달하는 queue가 아니라 “후보가 적어도 하나 생겼다”는 edge-trigger에 가깝습니다. consumer는 깨어난 뒤 mempool을 다시 읽어야 하며, signal 개수를 transaction 개수로 해석해서는 안 됩니다.</p>
      <div className="not-prose flex flex-wrap gap-3">
        <CodeViewButton label="CListMempool 구조체" onClick={() => sidebar.open("clist-struct", codeRefs["clist-struct"])} />
      </div>
      <ExplainedFormula question="새 transaction을 local mempool에 넣기 전에 byte capacity를 어떻게 검사하는가?" idea={<>현재 저장한 transaction bytes에 새 bytes를 더한 값이 설정한 최대치를 넘지 않아야 합니다. 개수 제한과 단일 transaction 최대 크기는 이 식과 별도의 gate입니다.</>} formula={String.raw`B_{\mathrm{after}}=B_{\mathrm{pool}}+|tx|\le B_{\max}`} terms={[{symbol:"B_{\mathrm{pool}}",name:"현재 pool bytes",description:"CListMempool이 추적하는 accepted transaction raw byte 합입니다."},{symbol:"|tx|",name:"새 transaction 크기",description:"이번 CheckTx 요청에 넣기 전 받은 transaction bytes 길이입니다."},{symbol:"B_{\max}",name:"MaxTxsBytes",description:"node-local mempool 전체 byte ceiling입니다."}]} assumptions={["개수 제한 Size와 단건 제한 MaxTxBytes도 별도로 통과해야 합니다.","동시 CheckTx 사이에 pool이 변할 수 있으므로 응답 뒤 추가 직전에 capacity를 다시 검사합니다.","proposal의 block MaxBytes 계산은 protobuf data size를 사용하므로 이 raw-byte 식과 같지 않습니다.","local capacity 통과는 application validity나 commit을 뜻하지 않습니다."]} interpretation="현재 900MiB이고 새 tx가 200MiB인데 MaxTxsBytes가 1GiB라면 admission 전에 거절합니다. 그러나 100B tx 하나라도 cache duplicate이거나 CheckTx Code가 실패하면 마찬가지로 들어가지 않습니다." />
    </section>

    <section id="checktx" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">02 · CheckTx admission</p><h2 className="mt-2 text-2xl font-bold">capacity → 단건 크기 → preCheck → cache → async CheckTx 순서로 좁힌다</h2></header>
      <p><code>CheckTx</code>는 update read lock을 잡고 pool capacity, <code>MaxTxBytes</code>, optional preCheck와 application connection 상태를 검사한 다음 cache에 TxKey를 넣습니다. cache가 이미 보았다면 같은 transaction을 또 ABCI로 보내지 않고 sender만 추가할 수 있습니다. 새 transaction이면 <code>CheckTxAsync</code>를 호출하고, 응답의 Code가 OK이며 postCheck도 통과했을 때 capacity를 한 번 더 검사해 list에 넣습니다.</p>
      <p>cache와 pool은 같은 집합이 아닙니다. committed transaction은 pool에서는 제거하지만 성공한 transaction의 key를 cache에 남겨 즉시 재전파되는 duplicate를 막습니다. 반대로 invalid transaction은 <code>KeepInvalidTxsInCache</code> 설정에 따라 cache에서 빼 나중에 조건이 달라졌을 때 다시 제출하게 할 수 있습니다. 따라서 “cache hit”를 “현재 mempool에 존재”로 보고하면 안 됩니다.</p>
      <div className="not-prose flex flex-wrap gap-3">
        <CodeViewButton label="CheckTx()" onClick={() => sidebar.open("clist-checktx", codeRefs["clist-checktx"])} />
        <CodeViewButton label="reqResCb → addTx()" onClick={() => sidebar.open("clist-addtx", codeRefs["clist-addtx"])} />
      </div>
      <div id="paper-cometbft-mempool-v040"><CitationBlock source="CometBFT v0.40.0 — mempool/clist_mempool.go" citeKey={1} type="code" href="https://github.com/cometbft/cometbft/blob/v0.40.0/mempool/clist_mempool.go"><p><strong>문제:</strong> concurrent transaction admission, local ordering, duplicate suppression과 commit 뒤 정리를 조정합니다.</p><p><strong>기여:</strong> CheckTx gate 순서, TxKey map·cache, reap, Update와 recheck의 실제 구현을 제공합니다.</p><p><strong>전제:</strong> v0.40.0 flood/CList mempool과 compatible ABCI application을 사용합니다.</p><p><strong>근거 범위:</strong> node-local mempool state와 application admission callback 처리입니다.</p><p><strong>말하지 않는 것:</strong> CheckTx OK인 transaction의 inclusion, execution success, global propagation을 보장하지 않습니다.</p></CitationBlock></div>
    </section>

    <section id="recheck" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">03 · Commit 뒤 Update와 recheck</p><h2 className="mt-2 text-2xl font-bold">새 committed state에서 남은 후보를 다시 검사할 때까지 admission view를 섞지 않는다</h2></header>
      <p>BlockExecutor는 application Commit 전에 mempool lock을 잡고 pending CheckTx를 flush합니다. Commit이 끝나면 <code>Update(h)</code>가 block에 포함된 transaction을 결과와 무관하게 local pool에서 제거하고 새 state로 pre/post filter를 교체합니다. 예를 들어 block h가 Alice의 nonce 7을 썼다면 pool에 남아 있던 같은 계정 nonce 7 transaction은 더는 유효하지 않을 수 있습니다.</p>
      <p><code>Recheck=true</code>이면 Update는 남은 list의 시작과 끝을 snapshot으로 잡고 각각을 <code>CheckTxType_Recheck</code>로 보냅니다. 응답이 새 state에서 실패한 transaction은 제거합니다. RecheckTimeout이 지나면 대기를 끝낼 수 있으므로 timeout을 “모든 항목이 다시 유효함”으로 해석해서는 안 됩니다. 운영에서는 pending recheck count와 timeout을 노출하고, 새 CheckTx·reap·Update가 같은 세대의 view를 보도록 lock 경계를 보존해야 합니다.</p>
      <div className="not-prose flex flex-wrap gap-3">
        <CodeViewButton label="Update()" onClick={() => sidebar.open("clist-update", codeRefs["clist-update"])} />
        <CodeViewButton label="recheckTxs()" onClick={() => sidebar.open("clist-recheck", codeRefs["clist-recheck"])} />
      </div>
      <RecheckBarrierViz />
      <div id="paper-cometbft-mempool-interface-v040"><CitationBlock source="CometBFT v0.40.0 — mempool/mempool.go · state/execution.go" citeKey={2} type="code" href="https://github.com/cometbft/cometbft/blob/v0.40.0/state/execution.go"><p><strong>문제:</strong> application Commit과 mempool Update 사이에 old-state CheckTx가 끼어드는 race를 막습니다.</p><p><strong>기여:</strong> mempool lock·ABCI flush·Commit·asynchronous Update의 ordering contract를 구현합니다.</p><p><strong>전제:</strong> v0.40.0 BlockExecutor와 Mempool interface를 함께 사용합니다.</p><p><strong>근거 범위:</strong> 한 node 안에서 commit state와 admission state가 넘어가는 동시성 경계입니다.</p><p><strong>말하지 않는 것:</strong> 다른 node의 mempool 순서, transaction 재제출 정책, external side effect의 exactly-once를 정하지 않습니다.</p></CitationBlock></div>
      <p>Release gate는 같은 arrival trace를 여러 번 재생하고 duplicate TxKey가 한 element만 만드는지, capacity 직전 concurrent 응답이 ceiling을 크게 넘기지 않는지, block commit 동안 새 CheckTx가 old state로 통과하지 않는지, recheck late response가 다른 transaction을 지우지 않는지 확인합니다. 마지막으로 block에 들어가지 않은 유효 tx가 recheck 뒤 다시 proposal 후보가 되고, committed tx는 재등장하지 않아야 합니다.</p>
      <h3 className="text-xl font-semibold">이 글만으로 풀어야 하는 10문제</h3><p>기초 6문제는 local truth, capacity·cache·CheckTx, reap, availability signal과 Update를 확인합니다. 심화 4문제는 concurrent admission, duplicate cache, recheck timeout·late response, commit-lock release gate를 설계하게 합니다.</p>
    </section>
  </article>
  <CodeSidebar
    codeRefKey={sidebar.codeRefKey}
    codeRef={sidebar.codeRef}
    onClose={sidebar.close}
    onNavigate={sidebar.navigate}
    codeRefs={codeRefs}
    fileTrees={{ cometbft: cometbftMempoolTree }}
    projectMetas={{
      cometbft: {
        id: "cometbft",
        label: "CometBFT · Go",
        badgeClass: "bg-blue-500/10 border-blue-500 text-blue-700",
      },
    }}
  />
  </>;
}

import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";
import { CertificateCatchupViz, FilecoinF3TraceViz } from "./viz/ModernFilecoinF3Viz";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import { codeRefs } from "./codeRefs";
import { f3Tree } from "./fileTrees";

export default function ModernFilecoinF3Article() {
  const sidebar = useCodeSidebar();
  return <>
  <article className="space-y-14">
    <section id="overview" className="space-y-6">
      <header className="space-y-3"><p className="text-sm font-semibold text-primary">Filecoin F3 integration</p><h2 className="text-3xl font-bold tracking-tight">바뀔 수 있는 EC head를 certificate checkpoint로 고정하고 다음 fork choice의 울타리로 쓴다</h2></header>
      <p className="text-lg leading-8 text-foreground/90">Alice→Bob transaction이 Expected Consensus(EC) head의 block D에 들어갔다고 하겠습니다. 이 inclusion만으로는 D가 다시 바뀌지 않는다고 말할 수 없습니다. F3는 이전에 finalized한 base B와 그 위의 current EC proposal B→C→D, versioned power table을 GPBFT instance에 넣습니다. GPBFT가 prefix를 결정하면 서명 evidence가 붙은 finality certificate가 되고, 이후 EC는 그 checkpoint를 정확히 포함하는 branches 안에서만 weight를 비교합니다.</p>
      <p>이 경계에는 세 owner가 있습니다. EC는 valid weighted head를 제공하고, GPBFT는 weighted phases와 decision certificate를 만들며, F3 integration은 input/base·committee binding, certificate chain sync와 finalized-prefix fork-choice fence를 연결합니다. F3 process가 멈춰도 EC chain은 계속 자랄 수 있지만 새 F3 certificate가 없다면 새 fast finality는 생기지 않습니다.</p>
      <FilecoinF3TraceViz />
      <aside className="rounded-lg border border-primary/30 bg-primary/5 p-5 text-sm leading-6"><strong>핵심 아이디어:</strong> Finality는 “현재 가장 무거운 head”라는 점수가 아니라, 어느 committee가 어떤 base 위의 어느 prefix를 어떤 instance에서 결정했는지 재검증할 수 있는 certificate chain과 그 결과를 강제하는 fork-choice fence입니다.</aside>
    </section>

    <section id="ec-f3-boundary" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">01 · EC input, base, committee</p><h2 className="mt-2 text-2xl font-bold">Proposal은 움직일 수 있지만 이전 finalized base와 historical power table은 instance에 고정한다</h2></header>
      <p>F3 instance의 proposal은 node가 관찰한 current canonical EC chain이므로 consensus가 끝나기 전에 달라질 수 있습니다. 반면 base는 이전 certificate에서 이미 합의한 chain prefix이며 새 proposal은 그 base를 연장해야 합니다. Proposal이 바뀌었다는 이유로 base까지 되돌리면 이전 agreement를 무효화하므로 input validation에서 extension 관계와 commitments를 검사합니다.</p>
      <div className="not-prose flex flex-wrap gap-3">
        <CodeViewButton label="F3.Run() 개요" onClick={() => sidebar.open("f3-run", codeRefs["f3-run"])} />
        <CodeViewButton label="GPBFT phases" onClick={() => sidebar.open("gpbft-run", codeRefs["gpbft-run"])} />
      </div>
      <p>투표 power도 현재 head에서 임의로 읽지 않습니다. Protocol manifest와 finalized chain state의 lookback으로 instance committee와 signing keys, scaled power를 정하고 power-table CID·network name·instance·supplemental data에 결속합니다. 그래서 certificate i를 과거 PTᵢ가 아니라 현재 PT로 검증해서는 안 됩니다. Member가 바뀌면 동일 signatures의 weight 합이 달라져 history를 재해석하게 됩니다.</p>
      <ExplainedFormula question="F3 certificate signer 집합이 strong quorum인지 무엇으로 판정하는가?" idea={<>Certificate가 가리키는 historical power table에서 distinct valid signers의 power를 더하고, table total의 2/3를 엄격히 넘어야 합니다. 그 전에 network·instance·base·decision과 aggregate signature를 같은 domain에서 검증합니다.</>} formula={String.raw`q(C_i)=\sum_{v\in Signers(C_i)}w_i(v),\qquad 3q(C_i)>2W_i`}
      annotatedFormula={String.raw`q(C_i)=\underbrace{\sum_{v\in Signers(C_i)}w_i(v),\qquad 3q(C_i)>2W_i}_{\text{허용 경계 판정}}`}
      operations={[
        { expression: String.raw`\sum_{v\in Signers(C_i)}w_i(v),\qquad 3q(C_i)>2W_i`, annotation: ["계산한 양을 허용 경계와 비교해 상태를 판정합니다.","Certificate가 가리키는 historical power","table에서 distinct valid signers의","power를 더하고, table total의 2/3를 엄격히"] },
      ]} terms={[{symbol:"C_i",name:"instance certificate",description:"Instance i의 base, decision, supplemental data와 signer evidence를 담습니다."},{symbol:"w_i(v)",name:"historical voting power",description:"Instance i에 결속된 power table에서 participant v가 가진 검증 weight입니다."},{symbol:"W_i",name:"committee total power",description:"같은 table의 eligible voting power 합입니다."},{symbol:"q(C_i)",name:"certificate power",description:"중복을 제거한 valid certificate signers의 power 합입니다."}]} assumptions={["Certificate와 power table이 같은 network·instance·manifest generation에 결속됩니다.","Signer membership, signing key, aggregate signature와 duplicate를 검증합니다.","Byzantine committee power는 protocol fault bound인 1/3 미만입니다.","Quorum certificate는 GPBFT decision evidence이며 application transaction success까지 증명하지 않습니다."]} interpretation="W_i=120이면 q=80은 3q=240이라 strict inequality를 통과하지 못하고 q=81은 243>240이라 통과합니다. 현재 table에서 81이더라도 PT_i에서 79라면 과거 certificate는 strong quorum이 아닙니다." />
      <div id="paper-fip86-f3"><CitationBlock source="FIP-0086 — Fast Finality in Filecoin" citeKey={1} href="https://github.com/filecoin-project/FIPs/blob/c856d99b126cb52a0436c4838da55ec84495cfa7/FIPS/fip-0086.md"><p><strong>문제:</strong> Expected Consensus의 긴 probabilistic confirmation을 검증 가능한 fast checkpoint로 보완합니다.</p><p><strong>기여:</strong> EC/F3 input, GPBFT certificate, power-table evolution·sync와 finalized-prefix fork-choice 변경을 규정합니다.</p><p><strong>전제:</strong> Byzantine QAP 1/3 미만, versioned committee·manifest와 EC compatibility·network timing 조건을 사용합니다.</p><p><strong>근거 범위:</strong> Final FIP revision c856d99의 F3 protocol semantics와 deployment model입니다.</p><p><strong>말하지 않는 것:</strong> 고정 latency SLA, current Go API나 F3 halt 중 EC head의 자동 finality를 보장하지 않습니다.</p></CitationBlock></div>
    </section>

    <section id="cert-sync" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">02 · certificate chain과 fork-choice fence</p><h2 className="mt-2 text-2xl font-bold">Cold start node는 신뢰한 시작점에서 certificate와 power table을 한 칸씩 이어 검증한다</h2></header>
      <p>최신 certificate 한 장과 aggregate signature만 받아서는 누가 signer인지 판단할 trusted table이 없습니다. Catch-up node는 신뢰한 certificate Cᵢ와 PTᵢ에서 시작해 다음 instance 번호, network, base linkage, decision chain과 supplemental data를 확인하고 PTᵢ로 signatures와 quorum을 검증합니다. 그 certificate에 결속된 power-table diff를 검증해 PTᵢ₊₁을 만든 뒤에야 Cᵢ₊₁을 검사합니다. 중간 instance를 건너뛰거나 stale table을 섞으면 fail closed합니다.</p>
      <CertificateCatchupViz />
      <ExplainedFormula question="Finalized checkpoint F가 생긴 뒤 EC head 후보는 어떤 순서로 고르는가?" idea={<>먼저 candidate branch가 F와 그 ancestors를 정확히 포함하는지 boolean fence로 거릅니다. 그 다음 통과한 valid branches 안에서만 EC chain weight의 argmax를 계산합니다. 더 무겁다는 이유로 fence를 먼저 넘을 수는 없습니다.</>} formula={String.raw`Head=\underset{B\in Valid:\;F\preceq B}{\operatorname{argmax}}\;W_{EC}(B)`}
      annotatedFormula={String.raw`Head=\underbrace{\underset{B\in Valid:\;F\preceq B}{\operatorname{argmax}}\;W_{EC}(B)}_{\text{prefix relation 계산}}`}
      operations={[
        { expression: String.raw`\underset{B\in Valid:\;F\preceq B}{\operatorname{argmax}}\;W_{EC}(B)`, annotation: ["prefix relation이(가) 식의 결과에 기여하는","방식을 계산합니다.","먼저 candidate branch가 F와 그","ancestors를 정확히 포함하는지 boolean"] },
      ]} terms={[{symbol:"F",name:"latest finalized checkpoint",description:"검증된 certificate chain의 마지막 decision이 고정한 chain prefix입니다."},{symbol:"F\\preceq B",name:"prefix relation",description:"Candidate branch B가 F의 exact chain commitments를 ancestor로 포함한다는 뜻입니다."},{symbol:"Valid",name:"EC-valid branches",description:"Expected Consensus의 full validation을 통과한 candidate branches입니다."},{symbol:"W_{EC}(B)",name:"EC chain weight",description:"Fence를 통과한 branches 사이에서 head를 고르는 기존 EC score입니다."}]} assumptions={["F certificate chain과 historical power tables를 trusted base부터 검증했습니다.","Prefix comparison은 height만이 아니라 exact chain keys/commitments를 사용합니다.","Candidate branch는 EC full validation을 통과했습니다.","Fence 뒤 head도 F 이후 구간에서는 바뀔 수 있으며 external release는 application state receipt를 확인합니다."]} interpretation="F=C이고 C→D의 weight가 100, C와 충돌하는 X의 weight가 130이라도 X는 후보 집합 밖입니다. C→D와 C→D′가 각각 100과 110이면 둘은 fence 안에서 비교해 D′를 head로 고를 수 있습니다." />
      <div id="paper-gof3-cert-v0814"><CitationBlock source="go-f3 v0.8.14 — certificates and exchange" citeKey={2} type="code" href="https://github.com/filecoin-project/go-f3/tree/v0.8.14/certexchange"><p><strong>문제:</strong> Lagging node가 untrusted peers의 certificate sequence로 committee와 finalized chain을 안전하게 따라잡습니다.</p><p><strong>기여:</strong> Certificate validation, power-table derivation·store와 polling exchange lifecycle을 구현합니다.</p><p><strong>전제:</strong> go-f3 v0.8.14 commit 5f2c984, trusted starting certificate/table과 network name을 고정합니다.</p><p><strong>근거 범위:</strong> Pinned certificate store/exchange의 catch-up 경로와 tests입니다.</p><p><strong>말하지 않는 것:</strong> Peer availability, initial trust-anchor 선택이나 application state execution을 자동 보장하지 않습니다.</p></CitationBlock></div>
      <div id="paper-lotus-f3-v1362"><CitationBlock source="Lotus v1.36.2 — chain/lf3 integration" citeKey={3} type="code" href="https://github.com/filecoin-project/lotus/tree/v1.36.2/chain/lf3"><p><strong>문제:</strong> Lotus EC chain·power state·API와 external go-f3 module lifecycle을 일관되게 연결합니다.</p><p><strong>기여:</strong> Manifest wiring, EC backend, power-table queries, certificate access와 participation lifecycle을 구현합니다.</p><p><strong>전제:</strong> Lotus v1.36.2 commit c6f4d02와 compatible go-f3, configuration과 activation을 사용합니다.</p><p><strong>근거 범위:</strong> 이 pinned Lotus F3 adapter와 node-local API integration입니다.</p><p><strong>말하지 않는 것:</strong> FIP correctness proof, 모든 deployment manifest나 downstream bridge release safety를 대신하지 않습니다.</p></CitationBlock></div>
    </section>

    <section id="release" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">03 · halt, retry, release</p><h2 className="mt-2 text-2xl font-bold">EC height와 certificate instance를 따로 관찰하고 finality-dependent action은 후자에 묶는다</h2></header>
      <p>F3 participants나 dissemination이 멈추면 EC는 새로운 head를 계속 만들 수 있습니다. 운영 화면이 EC height만 보여 주면 사용자는 새 blocks도 finalized되었다고 오해합니다. 따라서 <code>ec_head_height</code>, <code>latest_f3_instance</code>, <code>finalized_epoch</code>, certificate age와 catch-up error를 따로 노출하고, withdrawal·bridge checkpoint 같은 action은 certificate와 application state receipt가 모두 맞을 때만 release합니다.</p>
      <p>Cold-start test는 stale power table, skipped instance, wrong network, broken base link, invalid aggregate signature를 하나씩 주입해야 합니다. 어느 하나라도 나오면 마지막 trusted certificate에서 멈추고 peer를 바꾸어 bounded retry하며, 최신 한 장을 강제로 수락하지 않습니다. Fork-choice test에서는 finalized C와 충돌하는 더 무거운 X를 거절하고 C를 잇는 D·D′만 weight로 비교합니다. Rollback은 아직 release하지 않은 local candidate와 cache에만 적용하며 finalized prefix를 운영 편의로 되돌리지 않습니다.</p>
      <div className="grid gap-4 md:grid-cols-2"><aside className="rounded-lg border border-border p-4"><h3 className="font-semibold">통과 receipt</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">Trusted base, contiguous instances, certificate digests, power-table CIDs, finalized prefix, application state root.</p></aside><aside className="rounded-lg border border-border p-4"><h3 className="font-semibold">중단 조건</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">Certificate domain·signature·table·base mismatch, F3 lag SLO 초과, finalized prefix 밖의 head 후보.</p></aside></div>
      <h3 className="text-xl font-semibold">이 글만으로 풀어야 하는 10문제</h3><p>기초 6문제는 proposal/base, F3 halt, committee binding, certificate context, power-table diff와 fork-choice fence를 묻습니다. 심화 4문제는 stale/skipped sync, lag policy, conflicting heavy branch와 cold-start-to-release test를 설계하게 합니다. 위 단계만으로 신뢰 시작점과 실패 시 행동까지 답할 수 있어야 합니다.</p>
    </section>
  </article>
  <CodeSidebar
    codeRefKey={sidebar.codeRefKey}
    codeRef={sidebar.codeRef}
    onClose={sidebar.close}
    onNavigate={sidebar.navigate}
    codeRefs={codeRefs}
    fileTrees={{ "go-f3": f3Tree }}
    projectMetas={{
      "go-f3": {
        id: "go-f3",
        label: "go-f3 · Go",
        badgeClass: "bg-blue-500/10 border-blue-500 text-blue-700",
      },
    }}
  />
  </>;
}

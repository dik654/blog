import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";
import { HotstuffBoundaryViz, HotstuffChainViz } from "./viz/ModernHotstuffViz";

export default function ModernHotstuffArticle(){return <article className="space-y-14">
  <section id="overview" className="space-y-6">
    <header className="space-y-3"><p className="text-sm font-semibold text-primary">HotStuff · chained leader BFT</p><h2 className="text-3xl font-bold tracking-tight">HotStuff는 votes를 QC로 압축하고 locks를 chain에 실어 leader rotation의 evidence handoff를 단순화한다</h2></header>
    <p className="text-lg leading-8 text-foreground/90">
            Alice 요청을 담은 block B10이 제안됐다고 하겠습니다. Replica는 현재 lock을 연장하거나 view가 더 높은 QC로 justify된 proposal에만
            vote합니다. Leader는 같은 block/view의 2f+1 shares를 quorum certificate(QC)로 모아 다음 block의 parent
            justification으로 보냅니다. Direct-parent QCs가 연속된 three-chain이 생기면 가장 오래된 block과 ancestors를 commit합니다.
          </p>
    <p>
            PBFT의 all-to-all phases에서 phase 이름만 바꾼 것은 아닙니다. HotStuff는 threshold QC, per-view leader rotation,
            chained pipelining, pacemaker/core 분리를 묶습니다. Compact QC는 vote dissemination의 wire 표현을 줄이지만 payload
            availability, persistent recovery, application effect까지 해결하지 않습니다.
          </p>
    <HotstuffChainViz />
    <aside className="rounded-lg border border-primary/30 bg-primary/5 p-5 text-sm leading-6"><strong>핵심 아이디어:</strong> SafeNode vote rule은 safety를, pacemaker는 GST 뒤 view synchronization을 담당합니다. Timer가 틀려도 lock rule을 낮추지 않으며, 빠른 proposal이 곧 commit은 아닙니다.</aside>
  </section>

  <section id="qc-chain" className="space-y-6">
    <header><p className="text-sm font-semibold text-primary">01 · safe vote, QC, three-chain</p><h2 className="mt-2 text-2xl font-bold">Replica는 locked branch를 연장하거나 더 높은 QC가 여는 branch에만 한 번 투표한다</h2></header>
    <p>
            Proposal에는 block, parent, justify QC가 함께 담깁니다. Replica는 proposal이 locked block의 descendant이면 lock을
            지키면서 vote할 수 있습니다. Conflicting branch라면 justify QC의 view가 lockedQC보다 높아야 합니다. 이는 최신 honest quorum
            evidence가 stale lock을 안전하게 넘어서는 조건입니다. Higher view 숫자만 있고 QC signature·domain·ancestry가 invalid하면
            vote하지 않습니다.
          </p>
    <ExplainedFormula question="HotStuff의 safeNode가 proposal b에 vote해도 된다고 판정하는 두 조건은 무엇인가?" idea={<>첫 조건은 현재 lock이 지키는 branch를 그대로 연장합니다. 둘째는 더 최신 quorum certificate가 있어 stale lock보다 높은 evidence를 제시할 때만 branch 변경을 허용합니다.</>} formula={String.raw`\begin{aligned}E&=b\succeq locked\\H&=v(q)>v(q_L)\\safe(b,q)&=E\lor H\end{aligned}`}
    annotatedFormula={String.raw`\begin{aligned}E&=\underbrace{b\succeq locked}_{\text{locked block 계산}}\\H&=\underbrace{v(q)>v(q_L)}_{\text{허용 경계 판정}}\\safe(b,q)&=\underbrace{E\lor H}_{\text{판정 조건 결합}}\end{aligned}`}
    operations={[
      { expression: String.raw`b\succeq locked`, annotation: ["locked block이(가) 식의 결과에 기여하는 방식을","계산합니다.","첫 조건은 현재 lock이 지키는 branch를 그대로","연장합니다."] },
      { expression: String.raw`v(q)>v(q_L)`, annotation: ["계산한 양을 허용 경계와 비교해 상태를 판정합니다.","첫 조건은 현재 lock이 지키는 branch를 그대로","연장합니다."] },
      { expression: String.raw`E\lor H`, annotation: ["대안 gate 중 하나라도 참이면 조건을 통과시킵니다.","첫 조건은 현재 lock이 지키는 branch를 그대로","연장합니다."] },
    ]} terms={[{symbol:"b",name:"proposal block",description:"현재 leader가 제안한 payload·parent·justify QC를 가진 block입니다."},{symbol:"q",name:"justify QC",description:"Proposal parent 또는 safe extension을 정당화하는 valid threshold certificate입니다."},{symbol:"locked",name:"locked block",description:"Replica가 conflicting vote를 막기 위해 유지하는 현재 branch 하한입니다."},{symbol:"q_L",name:"lock certificate",description:"Locked block에 대응하는 replica-local highest safety certificate입니다."},{symbol:"E",name:"extends-lock condition",description:"Proposal b가 current locked block의 descendant인지 나타냅니다."},{symbol:"H",name:"higher-QC condition",description:"Justify QC가 current lock certificate보다 더 높은 view인지 나타냅니다."}]} assumptions={["QC는 같은 committee·view·block digest의 distinct 2f+1 valid shares로 검증합니다.","Replica는 view마다 vote를 한 번만 하고 block ancestry를 검증합니다.","n=3f+1, 최대 f Byzantine과 authenticated partial-synchrony model을 사용합니다.","Safe vote와 QC는 payload execution·client external effect를 보장하지 않습니다."]} interpretation="lockedQC view가 5이면 locked branch를 연장한 proposal은 vote할 수 있습니다. Sibling proposal은 valid justifyQC view가 6 이상일 때만 두 번째 조건을 통과하며, 단순 view 6 label은 충분하지 않습니다." />
    <p>Leader는 n=4,f=1에서 shares 3개를 모아 QC를 만듭니다. Threshold signature를 사용하면 certificate bytes를 compact하게 표현할 수 있지만 membership·domain 검증은 그대로입니다. Chained HotStuff에서는 각 view의 generic QC가 여러 logical phases를 겹쳐 수행합니다. B11이 QC(B10), B12가 QC(B11), B13이 QC(B12)를 운반하고 direct-parent 관계가 모두 맞으면 B10이 commit됩니다. 높이만 연속이고 sibling 또는 skipped parent이면 three-chain이 아닙니다.</p>
    <div id="paper-hotstuff-chain"><CitationBlock source="HotStuff paper §4–6 — SafeNode, Chaining, Pacemaker" citeKey={1} href="https://arxiv.org/pdf/1803.05069#page=8"><p><strong>문제:</strong> Lock safety와 linear view change를 지키면서 phases를 block chain 위에 pipeline해야 합니다.</p><p><strong>기여:</strong> SafeNode predicate, one/two/three-chain rules와 pacemaker/core interface를 정의합니다.</p><p><strong>전제:</strong> Valid threshold QCs, direct-parent relation, monotonic views와 paper safety state machine을 사용합니다.</p><p><strong>근거 범위:</strong> HotStuff voting·commit·view synchronization construction과 proof argument입니다.</p><p><strong>말하지 않는 것:</strong> 세 blocks를 보았다는 사실만으로 commit되거나 pacemaker timing이 safety certificate를 대신하지 않습니다.</p></CitationBlock></div>
  </section>

  <section id="pacemaker" className="space-y-6">
    <header><p className="text-sm font-semibold text-primary">02 · linear view change와 responsiveness</p><h2 className="mt-2 text-2xl font-bold">Pacemaker는 replicas를 같은 view로 모으고 leader는 highest QC를 이어 actual delay에 맞춰 진행한다</h2></header>
    <p>
            Timeout 또는 progress signal을 처리하는 pacemaker는 safety core와 별도 module입니다. 새 leader는 2f+1 NEW-VIEW
            reports에서 highest QC를 고르고 그 block을 parent로 proposal합니다. 각 replica가 leader에게 한 report를 보내고 leader가
            proposal/QC를 broadcast하는 구조라 view-change evidence traffic은 linear authenticator regime을 따를 수 있습니다.
            그렇다고 bad leaders가 연속된 전체 worst-case나 payload traffic이 모두 선형이라는 뜻은 아닙니다.
          </p>
    <p>Optimistic responsiveness는 GST 뒤 correct leader가 정해졌을 때 known maximum delay Δ를 매번 기다리지 않고 actual message delay에 맞춰 progress한다는 뜻입니다. GST 전에는 arbitrary delay로 stall할 수 있고 timer가 view를 계속 바꿀 수 있습니다. Safety test는 이때 conflicting commit이 없는지, liveness test는 GST 뒤 honest replicas가 같은 view에 모여 three-chain을 만드는지를 따로 봅니다.</p>
    <HotstuffBoundaryViz />
    <div id="paper-hotstuff"><CitationBlock source="HotStuff: BFT Consensus in the Lens of Blockchain" citeKey={2} href="https://arxiv.org/abs/1803.05069"><p><strong>문제:</strong> Partial synchrony에서 linear leader replacement와 optimistic responsiveness를 함께 달성해야 합니다.</p><p><strong>기여:</strong> Threshold QCs, safe-node locking, chained three-chain commit과 modular pacemaker를 제시합니다.</p><p><strong>전제:</strong> n=3f+1 authenticated replicas, 최대 f Byzantine faults, threshold signatures와 GST 뒤 synchrony를 사용합니다.</p><p><strong>근거 범위:</strong> HotStuff protocol variants, correctness proofs와 paper evaluation입니다.</p><p><strong>말하지 않는 것:</strong> 논문 TPS·latency 또는 intermediate pseudocode가 current production chain의 고정 구현이라는 뜻은 아닙니다.</p></CitationBlock></div>
  </section>

  <section id="release" className="space-y-6">
    <header><p className="text-sm font-semibold text-primary">03 · persistence와 release</p><h2 className="mt-2 text-2xl font-bold">QC chain을 복구한 뒤 payload·deterministic execution·client receipt까지 확인한다</h2></header>
    <p>
            Restarting replica는 persisted highest QC·lock·last executed boundary에서 시작해야 합니다. Missing branch
            blocks와 payload를 hash로 가져오고 QC signer/domain, parent chain, three-chain을 다시 검증합니다. 그 뒤 같은 ordered
            commands를 deterministic하게 실행해 state root가 peers와 맞을 때 client result를 release합니다. QC만 남고 block
            bytes가 없거나 volatile lock을 잃으면 fail closed하고 state sync를 시작합니다.
          </p>
    <p>
            libhotstuff는 paper authors의 historical prototype이며 README도 persistent recovery 같은 한계를 남깁니다. Exact
            commit에서 core behavior를 읽되 production durability·security support를 추정하지 않습니다. Test는 stale higher-
            view label, invalid QC, forked direct-parent chain, bad pacemaker, crash를 넣고 safety conflict 0,
            GST 뒤 eventual commit, state/result parity를 별도 확인합니다.
          </p>
    <div id="paper-libhotstuff"><CitationBlock source="libhotstuff prototype — commit 34aa507" citeKey={3} type="code" href="https://github.com/hot-stuff/libhotstuff/tree/34aa50796f201aaab91c4db5aae9d3b7aceddb5c"><p><strong>문제:</strong> Paper의 event-driven HotStuff core를 reusable BFT state-machine-replication library로 구현해야 합니다.</p><p><strong>기여:</strong> Consensus core, QC/block types, networking demo와 replaceable pacemaker integration을 제공합니다.</p><p><strong>전제:</strong> Exact historical commit 34aa507, 해당 crypto/network dependencies와 volatile-state limitations를 고정합니다.</p><p><strong>근거 범위:</strong> Paper authors의 prototype source snapshot과 README-declared feature boundary입니다.</p><p><strong>말하지 않는 것:</strong> Maintained production support, persistent recovery, current security audit나 fixed performance를 보장하지 않습니다.</p></CitationBlock></div>
    <h3 className="text-xl font-semibold">이 글만으로 확인할 10가지</h3><p>
            기초 6문제는 request trace, QC count, safeNode, three-chain, pipeline, responsiveness를 묻습니다. 심화 4문제는
            fork·false chain·bad pacemaker와 pinned prototype recovery suite를 설계하게 합니다.
          </p>
  </section>
</article>}

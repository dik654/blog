import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";
import { NarwhalStateViz, NarwhalTraceViz } from "./viz/ModernNarwhalViz";

export default function ModernNarwhalArticle() {
  return <article className="space-y-14">
    <section id="overview" className="space-y-6">
      <header className="space-y-3"><p className="text-sm font-semibold text-primary">Certificate DAG · data plane</p><h2 className="text-3xl font-bold tracking-tight">Narwhal은 큰 transaction bytes와 작은 ordering metadata가 지나가는 길을 분리한다</h2></header>
      <p className="text-lg leading-8 text-foreground/90">Alice가 Bob에게 보내는 transaction을 여러 건과 묶어 <em>batch</em>로 만들었다고 하겠습니다. Narwhal에서는 worker가 실제 batch bytes를 동료 workers에 전파하고 저장 receipt를 모읍니다. Primary는 그 bytes를 매번 다시 보내는 대신 batch digest와 이전 round certificates를 묶은 header를 제안합니다. Committee가 같은 header에 투표해 quorum certificate를 만들면, ordering protocol은 이 작은 certificate DAG를 읽고 필요할 때만 bytes를 가져옵니다.</p>
      <p><em>Certificate DAG</em>는 certificate가 vertex이고 이전 round certificates에 대한 references가 directed edges인 그래프입니다. 이 그래프가 data availability와 causal history를 제공하지만 total order까지 자동으로 정하지는 않습니다. Bullshark 같은 consumer가 leader와 causal sub-DAG를 해석해야 순서가 생기며, application이 그 순서대로 transaction을 실행해야 Bob의 balance가 바뀝니다.</p>
      <NarwhalTraceViz />
      <aside className="rounded-lg border border-primary/30 bg-primary/5 p-5 text-sm leading-6"><strong>핵심 아이디어:</strong> Certificate는 “충분한 validator가 이 digest의 bytes를 보관했다”는 복구 전제입니다. “이 transaction이 몇 번째이며 성공적으로 실행됐다”는 receipt가 아닙니다.</aside>
    </section>

    <section id="worker-header" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">01 · worker와 primary</p><h2 className="mt-2 text-2xl font-bold">Worker는 payload를 저장하고 primary는 digest·round·parents를 조립한다</h2></header>
      <p>Validator마다 하나 이상의 worker와 primary가 있습니다. Worker는 batch를 만들고 다른 validators의 workers에 bytes를 보낸 뒤 저장 acknowledgement를 기다립니다. Quorum storage evidence가 모이면 local primary에 batch digest와 worker identity를 알립니다. Primary header에는 committee를 고정하는 epoch, logical round, 단일 author, payload digest 목록, 직전 round certificates가 parents로 들어갑니다. 따라서 network와 disk가 밀리는 data plane과 DAG를 조립하는 metadata plane을 따로 계측할 수 있습니다.</p>
      <p>
            순서는 batch dissemination → remote storage receipt → primary header → primary votes →
            certificate입니다. Digest만 본 primary가 remote storage를 성공으로 간주하면 안 됩니다. 반대로 worker가 bytes를 저장했다는 사실만으로
            header의 parent round나 author signature가 올바르다고 볼 수도 없습니다. 두 경로는 certificate에서 만나기 전까지 검증 책임이 서로
            다릅니다.
          </p>
      <div className="grid gap-4 md:grid-cols-2"><aside className="rounded-lg border border-border p-4"><h3 className="font-semibold">Worker receipt</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">Batch digest, byte length, worker route, storage generation과 distinct acknowledgers를 기록합니다.</p></aside><aside className="rounded-lg border border-border p-4"><h3 className="font-semibold">Primary receipt</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">Epoch·round·author·header digest·payload digests·parent certificate digests와 signer set을 기록합니다.</p></aside></div>
      <div id="paper-narwhal-worker-e67"><CitationBlock source="MystenLabs/narwhal commit e67f915 — worker and synchronizer" citeKey={1} type="code" href="https://github.com/MystenLabs/narwhal/tree/e67f91530e6bd4ef7808e42f548f07e58764ec5b/worker/src"><p><strong>문제:</strong> 큰 payload batch를 여러 workers에 저장하고 누락된 bytes와 certificates를 다시 가져와야 합니다.</p><p><strong>기여:</strong> Batch maker, quorum waiter, worker handlers와 primary synchronization 경로를 구현합니다.</p><p><strong>전제:</strong> 보관 종료된 저장소의 exact commit e67f915, 당시 process topology·storage·authenticated network configuration을 사용합니다.</p><p><strong>근거 범위:</strong> 이 pinned historical implementation의 worker dissemination과 node-local retrieval 동작입니다.</p><p><strong>말하지 않는 것:</strong> Current Sui consensus, permanent retention, total order나 application execution을 보장하지 않습니다.</p></CitationBlock></div>
    </section>

    <section id="certificate-dag" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">02 · header, vote, certificate</p><h2 className="mt-2 text-2xl font-bold">같은 typed header의 distinct signer power가 quorum에 닿아야 DAG vertex가 된다</h2></header>
      <p>Vote를 세기 전에 epoch와 committee snapshot, author signature, round 관계, payload·parent digests를 검증합니다. 같은 signer의 중복 vote는 한 번만 세고, author-round가 같은 다른 header에 대한 vote를 섞지 않습니다. Equal-weight <code>n=4, f=1</code> 예에서는 quorum <code>q=2f+1=3</code>입니다. 두 quorum의 최소 교집합은 두 validators이므로 적어도 한 honest validator가 겹칩니다. 다만 이 overlap은 causal evidence의 일관성을 돕는 조건일 뿐, 서로 독립적인 DAG vertices 사이의 total order를 정해 주지는 않습니다.</p>
      <ExplainedFormula question="두 quorum parent sets는 최소 몇 명을 공유하고 왜 q=2가 위험한가?" idea={<>크기 q인 두 집합을 n명 안에 놓으면 합집합은 n을 넘을 수 없으므로 교집합은 최소 2q−n입니다. n=3f+1, q=2f+1이면 f+1이어서 적어도 한 honest signer가 겹칩니다.</>} formula={String.raw`\begin{aligned}|Q_1\cap Q_2|&\ge 2q-n\\n&=3f+1\\q&=2f+1\end{aligned}`}
      annotatedFormula={String.raw`\begin{aligned}|Q_1\cap Q_2|&\ge \underbrace{2q-n}_{\text{committee size 계산}}\\n&=\underbrace{3f+1}_{\text{committee size 계산}}\\q&=\underbrace{2f+1}_{\text{fault bound 계산}}\end{aligned}`}
      operations={[
        { expression: String.raw`2q-n`, annotation: ["committee size이(가) 식의 결과에 기여하는 방식을","계산합니다.","크기 q인 두 집합을 n명 안에 놓으면 합집합은 n을 넘을 수","없으므로 교집합은 최소 2q−n입니다."] },
        { expression: String.raw`3f+1`, annotation: ["committee size이(가) 식의 결과에 기여하는 방식을","계산합니다.","크기 q인 두 집합을 n명 안에 놓으면 합집합은 n을 넘을 수","없으므로 교집합은 최소 2q−n입니다."] },
        { expression: String.raw`2f+1`, annotation: ["fault bound이(가) 식의 결과에 기여하는 방식을","계산합니다.","크기 q인 두 집합을 n명 안에 놓으면 합집합은 n을 넘을 수","없으므로 교집합은 최소 2q−n입니다."] },
      ]} terms={[{symbol:"n",name:"committee size",description:"고정 epoch의 distinct validators 수입니다."},{symbol:"f",name:"fault bound",description:"Protocol이 허용하는 Byzantine validator 수의 상한입니다."},{symbol:"q",name:"certificate quorum",description:"같은 valid header에 투표한 distinct validator 수입니다."},{symbol:"Q₁∩Q₂",name:"quorum intersection",description:"두 certificate signer sets에 함께 들어간 validators입니다."}]} assumptions={["Equal-weight committee 예이며 weighted committee라면 voting power로 다시 계산합니다.","Signature·epoch·round·author·digest domain을 검증하고 duplicate signer를 제거합니다.","n=4,f=1에서 q=3이고 최소 overlap은 2입니다.","Overlap은 data/causal certificate 성질이며 그 자체가 total order나 execution을 만들지 않습니다."]} interpretation="n=4에서 q=3이면 2q−n=2입니다. q=2로 낮추면 {A,B}와 {C,D}가 겹치지 않아 같은 author-round의 conflicting headers를 각각 인증할 수 있습니다." />
      <p>
            Certificate만 있고 local parents가 없다면 먼저 certificate 자체를 검증한 뒤 parent digests를 따라 missing history를
            가져옵니다. 이어 payload digest를 보관한 workers 또는 certificate signers의 경로로 bytes를 요청하고 hash가 header digest와
            같은지 확인합니다. Byzantine author가 bytes를 숨겨도 quorum에 honest storage holder가 포함된다는 전제 덕분에 retrieval 후보가
            남습니다. 이는 즉시 fetch latency나 영구 보관을 보장한다는 뜻은 아닙니다.
          </p>
      <div id="paper-narwhal-tusk"><CitationBlock source="Narwhal and Tusk: A DAG-based Mempool and Efficient BFT Consensus" citeKey={2} href="https://arxiv.org/abs/2105.11827"><p><strong>문제:</strong> Reliable transaction dissemination을 ordering leader의 bandwidth·availability 병목에서 분리해야 합니다.</p><p><strong>기여:</strong> Worker/primary scale-out, availability certificate와 causal DAG mempool 구조를 제시합니다.</p><p><strong>전제:</strong> Authenticated committee, n=3f+1과 최대 f Byzantine faults, 논문의 worker·network model을 사용합니다.</p><p><strong>근거 범위:</strong> Narwhal/Tusk protocol construction, correctness argument와 논문 evaluation입니다.</p><p><strong>말하지 않는 것:</strong> 논문의 TPS·latency가 다른 hardware나 current Sui protocol의 고정 성능이라는 뜻은 아닙니다.</p></CitationBlock></div>
      <div id="paper-narwhal-types-e67"><CitationBlock source="MystenLabs/narwhal commit e67f915 — primary types" citeKey={3} type="code" href="https://github.com/MystenLabs/narwhal/blob/e67f91530e6bd4ef7808e42f548f07e58764ec5b/types/src/primary.rs"><p><strong>문제:</strong> Header·vote·certificate의 bytes와 검증 domain을 implementation에서 일관되게 고정해야 합니다.</p><p><strong>기여:</strong> Header, Vote, Certificate structures와 epoch·signature·stake validation을 구현합니다.</p><p><strong>전제:</strong> Archived repository exact commit e67f915와 matching committee·worker cache를 사용합니다.</p><p><strong>근거 범위:</strong> Historical Narwhal primary message types와 validation 경로에 한정합니다.</p><p><strong>말하지 않는 것:</strong> Maintained current Sui consensus source, production support나 application state correctness를 나타내지 않습니다.</p></CitationBlock></div>
    </section>

    <section id="release" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">03 · 복구와 release</p><h2 className="mt-2 text-2xl font-bold">Received·certified·ordered·executed를 별도 상태로 남겨야 crash와 GC를 견딘다</h2></header>
      <NarwhalStateViz />
      <p>
            Batch d7을 예로 들면 received는 local bytes만 있다는 뜻이고 certified는 quorum storage와 causal header evidence가
            있다는 뜻입니다. Bullshark가 d7이 들어 있는 sub-DAG를 deterministic sequence에 놓아야 ordered가 되며 application state
            root와 transaction result를 기록해야 executed가 됩니다. External API는 마지막 receipt까지 확인한 뒤에만 Bob의 balance 변경을
            알립니다.
          </p>
      <p>
            Release test에는 wrong epoch, duplicate signer, invalid parent round와 payload digest mismatch를 넣고 어떤
            경우에도 state를 바꾸지 않는지 확인합니다. Crash 뒤에는 pinned epoch·certificate store·payload GC generation에서 다시 시작해
            causal parents → bytes → hash → deterministic order → state receipt 순으로 재생합니다. Payload가 없으면 대체
            signer/worker에 bounded retry하고 검증 가능한 bytes를 못 찾으면 마지막 executed boundary에서 멈춥니다. Certificate를
            삭제하거나 실행을 추측해 앞으로 나가서는 안 됩니다.
          </p>
      <p>
            GC는 “certificate가 있으니 bytes를 지워도 된다”가 아니라 downstream consumer의 ordered/executed watermark와 복구 보존
            기간을 함께 봐야 합니다. 같은 certificates를 서로 다른 arrival order로 넣어도 order digest와 state root가 같아야 하며 실패
            attempt의 임시 bytes와 index만 rollback합니다.
          </p>
      <h3 className="text-xl font-semibold">이 글만으로 확인할 10가지</h3><p>기초 6문제는 worker/primary data, acknowledgement→certificate 순서, header fields, n=4 quorum overlap, certificate의 보장 경계와 missing-data 복구를 묻습니다. 심화 4문제는 invalid-domain suite, Byzantine withholding, q=2 반례와 crash·GC 이후 certificate-to-execution replay를 설계하게 합니다.</p>
    </section>
  </article>;
}

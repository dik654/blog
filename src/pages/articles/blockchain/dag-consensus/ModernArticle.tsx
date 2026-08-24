import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";
import { DAGCausalFlowViz, DAGLayerBoundaryViz } from "./viz/ModernDAGConsensusViz";

export default function ModernDAGConsensusArticle() {
  return <article className="space-y-14">
    <section id="overview" className="space-y-6">
      <header className="space-y-3"><p className="text-sm font-semibold text-primary">DAG-BFT를 처음부터</p><h2 className="text-3xl font-bold tracking-tight">여러 validator가 동시에 data를 퍼뜨려도 실행 순서는 하나로 닫아야 한다</h2></header>
      <p className="text-lg leading-8 text-foreground/90">Directed acyclic graph(DAG)는 vertex와 한 방향 edge로 만든 순환 없는 그래프입니다. DAG-BFT에서는 validator마다 매 round transaction batch를 담은 vertex를 만들고 이전 round의 여러 certified vertices를 parent로 참조합니다. 이 구조는 data 전파를 병렬화하지만, 그래프 자체는 하나의 total order가 아닙니다.</p>
      <p>A와 B가 동시에 vertex를 만들었다면 어떤 node는 A를 먼저, 다른 node는 B를 먼저 받을 수 있습니다. 두 vertex 사이에 causal edge가 없으면 둘 다 올바른 topological order가 여러 개 존재합니다. State machine replication은 모든 replica가 같은 순서로 transaction을 적용해야 하므로 protocol은 anchor를 고르고, anchor가 도달하는 causal history를 정하며, 동률까지 처리하는 deterministic linearization rule을 추가해야 합니다.</p>
      <DAGCausalFlowViz />
      <aside className="rounded-lg border border-primary/30 bg-primary/5 p-5 text-sm leading-6"><strong>핵심 아이디어:</strong> DAG는 consensus의 대체어가 아니라 data availability와 causal history를 미리 만든 입력입니다. Ordering protocol이 공통 anchor와 commit wave를 정하고 deterministic traversal이 그래프를 한 줄로 펼쳐야 SMR log가 됩니다.</aside>
    </section>

    <section id="narwhal" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">01 · Narwhal</p><h2 className="mt-2 text-2xl font-bold">Transaction dissemination을 ordering critical path에서 떼어낸다</h2></header>
      <p>Narwhal의 worker는 transaction batch를 다른 validators에 전파하고 저장 acknowledgement를 모읍니다. Primary는 batch digest와 이전 round parents를 묶은 header를 만들며, 충분한 validators가 availability를 확인하면 certificate가 됩니다. Certificate는 “이 digest의 data를 fault bound 아래에서 나중에 retrieve할 근거가 있다”는 뜻이지 transaction이 total order에 들어갔거나 application에서 유효하다는 뜻은 아닙니다.</p>
      <p>한 vertex가 이전 round의 2f+1 certified vertices를 가리키면 round 사이에 강한 causal 연결이 생깁니다. n=4,f=1에서 두 honest vertices가 각각 세 parents를 선택하면 두 parent sets는 최소 두 개가 겹칩니다. 그래도 edge가 없는 동시 vertices의 상대 순서는 정해지지 않으며, certificate signer가 payload를 영구 보관하거나 모든 executor가 즉시 다운로드했다는 보장도 별도 retention·fetch contract가 필요합니다.</p>
      <ExplainedFormula question="n=3f+1에서 서로 다른 두 DAG vertex의 q=2f+1 parent sets는 최소 몇 개의 parent를 공유하는가?" idea={<>각 set가 전체 n개 중 q개를 고르므로 두 크기의 합에서 전체 크기를 뺀 만큼은 반드시 중복됩니다. n=4,f=1,q=3이면 2q-n=2입니다. 이 causal overlap은 DAG가 완전히 갈라지는 것을 막는 재료지만 그 자체로 anchor commit은 아닙니다.</>} formula={String.raw`|P_x\cap P_y|\ge 2q-n=f+1`}
      annotatedFormula={String.raw`|P_x\cap P_y|\ge 2q-n=\underbrace{f+1}_{\text{허용 경계 판정}}`}
      operations={[
        { expression: String.raw`f+1`, annotation: ["Minimum overlap이(가) 식의 결과에 기여하는","방식을 계산합니다.","각 set가 전체 n개 중 q개를 고르므로 두 크기의 합에서","전체 크기를 뺀 만큼은 반드시 중복됩니다."] },
      ]} terms={[{symbol:"P_x,P_y",name:"Parent sets",description:"같은 round의 두 certified vertices가 참조한 이전 round certificate 집합입니다."},{symbol:"q",name:"Parent threshold",description:"예시에서 한 vertex가 요구하는 distinct previous-round certificates 수입니다."},{symbol:"f",name:"Byzantine bound",description:"고정 membership에서 허용한 최대 faulty validator 수입니다."},{symbol:"f+1",name:"Minimum overlap",description:"최대 fault 수보다 큰 교집합 크기입니다."}]} assumptions={["n=3f+1 equal-weight fixed membership과 distinct valid certificates를 사용합니다.","Protocol version이 실제로 q=2f+1 parent rule을 요구한다고 고정합니다.","Certificate의 data-availability 전제와 retention 기간을 별도로 만족합니다.","Overlap만으로 total order·fairness·application validity가 생기지 않습니다."]} interpretation="n=4에서는 두 3-parent sets가 최소 2개를 공유합니다. 하지만 x와 y가 서로를 참조하지 않는다면 어느 것을 먼저 실행할지는 여전히 정해지지 않으므로 ordering rule이 필요합니다." />
      <div id="paper-narwhal-tusk"><CitationBlock source="Danezis et al. — Narwhal and Tusk" citeKey={1} href="https://arxiv.org/abs/2105.11827"><p><strong>문제:</strong> Reliable transaction dissemination을 consensus ordering과 분리해 leader data bottleneck을 줄입니다.</p><p><strong>기여:</strong> Narwhal DAG mempool과 이를 HotStuff 또는 asynchronous Tusk ordering에 결합하는 구조를 제시합니다.</p><p><strong>전제와 범위:</strong> 논문의 authenticated membership·fault·worker·WAN workload 범위입니다. 보고된 throughput을 payload·hardware가 다른 chain의 상한으로 일반화하지 않습니다.</p></CitationBlock></div>
    </section>

    <section id="bullshark" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">02 · Bullshark</p><h2 className="mt-2 text-2xl font-bold">Wave의 anchor를 support한 DAG edge로 commit하고 causal past를 함께 선형화한다</h2></header>
      <p>Bullshark는 이미 구축된 DAG를 해석해 Byzantine atomic broadcast order를 만듭니다. Round들을 wave로 묶고 정해진 anchor vertex가 후속 vertices에서 충분한 strong support를 받았는지 확인합니다. Commit rule을 만족한 anchor는 그 이전에 미commit된 anchors와 causal history를 끌고 오며, 모든 honest node가 동일한 deterministic traversal을 사용해 같은 sequence를 출력합니다.</p>
      <p>중요한 safety 경계는 local arrival order를 쓰지 않는 것입니다. A가 x→y 순으로 받고 B가 y→x 순으로 받았을 때 “도착한 순서대로 apply”하면 같은 certified DAG에서도 state가 갈라집니다. Round, author의 canonical identity, digest처럼 모든 node가 공유하는 값으로 tie-break하고, parent가 아직 없으면 fetch·validate가 끝날 때까지 해당 prefix를 apply하지 않아야 합니다.</p>
      <div id="paper-bullshark"><CitationBlock source="Spiegelman et al. — Bullshark: DAG BFT Protocols Made Practical" citeKey={2} href="https://arxiv.org/abs/2201.05677"><p><strong>문제:</strong> DAG 위 ordering을 추가 consensus message 없이 실용적인 latency로 수행합니다.</p><p><strong>기여:</strong> Common synchronous case의 fast path와 asynchronous safety/liveness를 갖는 anchor·wave 해석법을 제시합니다.</p><p><strong>전제와 범위:</strong> 논문 variant별 synchrony·randomness·wave 조건과 evaluation을 구분합니다. 모든 DAG protocol이 같은 rounds, leader schedule, fairness를 제공한다는 뜻은 아닙니다.</p></CitationBlock></div>
    </section>

    <section id="linearization" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">03 · 반례와 경계</p><h2 className="mt-2 text-2xl font-bold">Certified, committed, ordered, executed는 네 가지 상태다</h2></header>
      <DAGLayerBoundaryViz />
      <div className="grid gap-4 md:grid-cols-2"><div className="rounded-lg border border-border bg-card p-4"><h3 className="text-sm font-semibold">도착 순서 반례</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">x와 y가 독립인데 R1은 x,y, R2는 y,x로 받았습니다. Balance에 x=+10, y=×2를 적용하면 20과 10처럼 결과가 달라질 수 있으므로 arrival order는 SMR order가 될 수 없습니다.</p></div><div className="rounded-lg border border-border bg-card p-4"><h3 className="text-sm font-semibold">Certificate-only 반례</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">Digest certificate는 있지만 payload holder가 동시에 offline이면 anchor를 정해도 execution input을 가져오지 못합니다. Signer threshold, erasure/replication, retention과 fetch deadline을 함께 검증해야 합니다.</p></div></div>
      <p>DAG width가 커지면 data throughput 여지는 늘지만 vertex metadata, signatures, parent references, storage와 garbage collection 비용도 늘어납니다. Slow validator가 만든 오래된 vertex를 언제 포함할지, duplicate transaction을 어느 stable ID로 제거할지, committed causal prefix를 prune하기 전에 checkpoint와 state sync가 준비됐는지도 운영 protocol의 일부입니다.</p>
    </section>

    <section id="comparison" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">04 · 검증과 선택</p><h2 className="mt-2 text-2xl font-bold">선형 BFT와 같은 correctness gate를 통과한 뒤 병렬화 이득을 잰다</h2></header>
      <p>같은 membership·key·transaction arrival과 network schedule로 leader-BFT baseline과 DAG candidate를 실행합니다. 정상 경로뿐 아니라 missing batch, invalid certificate, equivocation, delayed parent, minority partition, anchor leader omission, restart와 prune 경계를 주입합니다. 모든 replica의 committed vertex sequence와 state root가 같고 duplicate apply가 0이어야 성능 비교를 시작할 수 있습니다.</p>
      <div className="overflow-x-auto rounded-lg border border-border"><table className="min-w-[760px] w-full text-sm"><thead className="bg-muted/50 text-left"><tr><th className="p-3">측정 축</th><th className="p-3">잘못된 결론</th><th className="p-3">필요한 receipt</th></tr></thead><tbody className="divide-y divide-border text-muted-foreground"><tr><td className="p-3 font-medium text-foreground">Data throughput</td><td className="p-3">DAG width가 곧 committed TPS</td><td className="p-3">offered·certified·committed·executed bytes/s</td></tr><tr><td className="p-3 font-medium text-foreground">Latency</td><td className="p-3">한 round 평균이 client finality</td><td className="p-3">batch wait·certificate·anchor·apply p50/p99</td></tr><tr><td className="p-3 font-medium text-foreground">Recovery</td><td className="p-3">DAG가 커졌으니 liveness 보장</td><td className="p-3">GST marker·missing parents·backlog drain time</td></tr><tr><td className="p-3 font-medium text-foreground">Resource</td><td className="p-3">network bytes만 세면 충분</td><td className="p-3">per-node ingress/egress·signature CPU·storage·GC</td></tr></tbody></table></div>
      <h3 className="text-xl font-semibold">이 글만으로 풀어야 하는 10문제</h3><p>기초 6문제는 DAG·causal edge, Narwhal certificate, parent overlap, data/order/execution 분리, Bullshark anchor, deterministic linearization을 묻습니다. 심화 4문제는 arrival-order 반례, payload unavailable 반례, 4-validator fault trace, baseline과의 paired release gate를 설계하게 합니다.</p>
    </section>
  </article>;
}

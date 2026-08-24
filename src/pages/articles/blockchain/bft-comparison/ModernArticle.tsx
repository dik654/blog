import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";
import { BFTAxisTableViz, BFTMechanismComparisonViz } from "./viz/ModernBFTComparisonViz";

function Note({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="rounded-lg border border-border bg-card p-4"><h3 className="text-sm font-semibold text-foreground">{title}</h3><div className="mt-2 text-sm leading-6 text-muted-foreground">{children}</div></div>;
}

export default function ModernBFTComparisonArticle() {
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-6">
        <header className="space-y-3"><p className="text-sm font-semibold text-primary">BFT protocol을 비교하는 법</p><h2 className="text-3xl font-bold tracking-tight">빠른 논문 하나를 고르기 전에 같은 실패와 같은 workload를 놓는다</h2></header>
        <p className="text-lg leading-8 text-foreground/90">PBFT, HotStuff, Autobahn은 모두 일부 replica가 거짓말하거나 서로 다른 내용을 보내도 하나의 명령 순서를 만드는 Byzantine fault-tolerant state machine replication(BFT SMR) protocol입니다. 그러나 data를 퍼뜨리는 위치, 안전한 vote evidence를 만드는 방식, leader 교체 뒤 밀린 작업을 회복하는 경로가 다르므로 논문에 적힌 TPS만 나란히 놓아서는 선택할 수 없습니다.</p>
        <p>이 글은 네 대의 equal-weight replica A·B·C·D 중 최대 한 대가 Byzantine인 작은 예에서 시작합니다. 세 대의 서명이 같은 height·view·phase·value에 모이면 quorum certificate(QC)가 되며, 서로 다른 두 3인 quorum은 적어도 두 replica를 공유합니다. 다만 교집합 산술만으로 safety가 완성되는 것은 아닙니다. 그 안의 honest replica가 protocol의 lock·vote rule에 따라 충돌하는 값에 다시 서명하지 않아야 합니다. 이 기초의 정본은 <a href="/blockchain/bft-theory#faulty-threshold" className="text-primary underline-offset-4 hover:underline">BFT 이론의 quorum과 lock</a>에 있고, 여기서는 세 protocol이 그 evidence를 어떻게 운반하는지 비교합니다.</p>
        <BFTMechanismComparisonViz />
        <aside className="rounded-lg border border-primary/30 bg-primary/5 p-5 text-sm leading-6"><strong>핵심 아이디어:</strong> protocol 비교의 단위는 이름이 아니라 <em>membership·fault·timing model → data dissemination → order certificate → commit rule → leader-change recovery</em>입니다. 같은 단위를 고정한 뒤 latency·throughput·bytes·CPU를 측정해야 구조적 차이와 구현 차이를 분리할 수 있습니다.</aside>
      </section>

      <section id="pbft" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">01 · PBFT</p><h2 className="mt-2 text-2xl font-bold">두 vote phase가 request 순서를 고정하고 view change가 prepared evidence를 회수한다</h2></header>
        <p>PBFT의 primary는 sequence number가 붙은 PRE-PREPARE를 보냅니다. Backup은 request와 view·sequence가 맞으면 PREPARE를 multicast하고, pre-prepare와 서로 다른 replica의 충분한 prepare를 모아 <strong>prepared</strong> 상태를 만듭니다. 이어 COMMIT을 보내며 2f+1개의 일치하는 commit을 모으면 locally committed가 됩니다. n=4,f=1에서는 세 commit이 필요하므로, 최대 한 Byzantine replica만으로는 서로 충돌하는 두 local commit을 만들 수 없습니다.</p>
        <p>Primary가 멈추거나 equivocate하면 replica는 timeout만으로 기존 lock을 지우지 않고 VIEW-CHANGE에 prepared certificate와 stable checkpoint를 담아 다음 primary에게 보냅니다. 새 primary의 NEW-VIEW가 이 evidence를 정당하게 선택해야 이미 prepared된 request와 충돌하는 sequence를 제안하지 않습니다. Original PBFT의 normal path와 view-change message는 구체적인 authenticator·batch·checkpoint 구성에 의존하므로 “PBFT는 언제나 O(n²), view change는 언제나 O(n³)”처럼 한 줄로 고정하지 않고 실제 구현의 전송 bytes와 verification 수를 세어야 합니다.</p>
        <div id="paper-pbft-comparison"><CitationBlock source="Castro·Liskov — Practical Byzantine Fault Tolerance" citeKey={1} href="https://pmg.csail.mit.edu/papers/osdi99.pdf"><p><strong>문제:</strong> Byzantine replica가 있는 비동기 network에서 practical SMR을 구현합니다.</p><p><strong>기여:</strong> PRE-PREPARE·PREPARE·COMMIT, checkpoint와 view change를 결합하고 NFS workload에서 구현을 평가했습니다.</p><p><strong>전제와 범위:</strong> 논문의 fixed membership·authentication·workload와 당시 구현 결과에 한정합니다. 현대 WAN, stake weight, 다른 crypto·batch의 성능을 자동으로 예측하지 않습니다.</p></CitationBlock></div>
      </section>

      <section id="hotstuff" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">02 · HotStuff</p><h2 className="mt-2 text-2xl font-bold">Chained QC가 normal path와 leader 교체의 evidence 형식을 맞춘다</h2></header>
        <p>HotStuff의 block은 parent block과 그 parent를 지지하는 QC를 가리킵니다. Replica는 현재 lock과 양립하고 justify QC가 충분히 새로울 때 vote하며, leader는 vote를 모아 다음 QC를 만듭니다. Chained HotStuff에서는 연속된 proposal과 QC가 prepare·pre-commit·commit 역할을 pipeline하므로, 한 block이 즉시 commit되는 것이 아니라 뒤의 certified descendants가 쌓여 commit rule을 만족해야 합니다.</p>
        <p>Pacemaker는 view timeout과 leader 교체를 담당하지만 safety rule을 대신하지 않습니다. 새 leader는 replicas가 보낸 highest QC를 바탕으로 safe proposal을 만들고, threshold signature를 쓸 경우 normal view와 leader replacement의 authenticator communication을 linear하게 구성할 수 있습니다. 여기서 linear는 end-to-end traffic·signature verification·payload dissemination 전체가 언제나 O(n)이라는 뜻이 아닙니다. Payload broadcast, timeout certificate, threshold crypto 구현 비용은 측정표에 따로 남겨야 합니다.</p>
        <div id="paper-hotstuff-comparison"><CitationBlock source="Yin et al. — HotStuff" citeKey={2} href="https://arxiv.org/abs/1803.05069"><p><strong>문제:</strong> Partial synchrony에서 leader replacement가 단순하고 responsive한 BFT를 만듭니다.</p><p><strong>기여:</strong> Chained QC, three-phase safety와 pacemaker 분리를 통해 linear authenticator communication을 제시합니다.</p><p><strong>전제와 범위:</strong> Authenticated fixed-membership model과 논문의 protocol·crypto·evaluation 범위입니다. 모든 HotStuff 계열 구현이 같은 chain length나 latency를 갖는다는 뜻은 아닙니다.</p></CitationBlock></div>
      </section>

      <section id="autobahn" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">03 · Autobahn</p><h2 className="mt-2 text-2xl font-bold">Replica별 lane에 data를 축적하고 consensus는 포함할 cut을 정한다</h2></header>
        <p>Leader 중심 protocol에서는 leader가 order뿐 아니라 payload dissemination의 병목까지 떠안을 수 있습니다. Autobahn은 replica마다 순서가 있는 lane을 두어 data를 비동기적으로 퍼뜨리고, consensus proposal은 각 lane의 어느 tip까지 포함할지를 나타내는 <strong>cut</strong>을 정합니다. 한 cut이 확정되면 tip의 causal prefix를 결정적인 lane·slot 규칙으로 펼쳐 하나의 실행 순서를 얻습니다.</p>
        <p>이 분리는 network blip 동안 합의가 멈춰도 data lane이 계속 전진할 수 있게 합니다. Network가 회복되면 leader가 개별 transaction을 다시 모으기보다 certified lane tips를 cut에 포함해 backlog를 회수합니다. 하지만 lane certificate가 transaction의 application validity나 fair ordering을 보장하지 않으며, cut에 들어온 data를 모든 executor가 실제로 fetch할 수 있어야 commit 뒤 실행이 막히지 않습니다.</p>
        <div id="paper-autobahn"><CitationBlock source="Giridharan et al. — Autobahn: Seamless high speed BFT" citeKey={3} href="https://arxiv.org/abs/2401.10369"><p><strong>문제:</strong> 좋은 network 구간의 낮은 latency와 blip 뒤 빠른 회복을 동시에 얻습니다.</p><p><strong>기여:</strong> Parallel lane dissemination과 low-latency partially synchronous consensus를 결합하고 hangover를 평가합니다.</p><p><strong>전제와 범위:</strong> 논문의 deployment·fault injection·payload·implementation에서의 비교입니다. 다른 hardware나 membership에서 latency 절반이라는 비율이 유지된다는 일반 법칙은 아닙니다.</p></CitationBlock></div>
      </section>

      <section id="comparison" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">04 · 수치와 선택</p><h2 className="mt-2 text-2xl font-bold">Quorum 안전성은 공통으로 계산하고 성능은 동일 envelope 안에서 잰다</h2></header>
        <ExplainedFormula question="Equal-weight BFT에서 두 commit quorum이 적어도 한 honest replica를 공유하려면 quorum은 얼마나 커야 하는가?" idea={<>두 집합의 원소 수를 더하면 전체 n을 넘는 부분이 반드시 교집합입니다. n=3f+1, q=2f+1을 대입하면 2q-n=f+1이 되어 최대 Byzantine 수 f보다 하나 많습니다.</>} formula={String.raw`\begin{aligned}|Q_1\cap Q_2|&\ge 2q-n\\&=f+1>f\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}|Q_1\cap Q_2|&\ge \underbrace{2q-n}_{\text{Replica 수 계산}}\\&=\underbrace{f+1>f}_{\text{허용 경계 판정}}\end{aligned}`}
        operations={[
          { expression: String.raw`2q-n`, annotation: ["Replica 수이(가) 식의 결과에 기여하는 방식을","계산합니다.","두 집합의 원소 수를 더하면 전체 n을 넘는 부분이 반드시","교집합입니다."] },
          { expression: String.raw`f+1>f`, annotation: ["계산한 양을 허용 경계와 비교해 상태를 판정합니다.","두 집합의 원소 수를 더하면 전체 n을 넘는 부분이 반드시","교집합입니다."] },
        ]} terms={[{symbol:"n",name:"Replica 수",description:"같은 membership snapshot에 있는 equal-weight voting replicas입니다."},{symbol:"f",name:"Fault bound",description:"Protocol이 허용한다고 가정한 최대 Byzantine replica 수입니다."},{symbol:"q",name:"Quorum 크기",description:"한 certificate에 필요한 distinct valid signers 수로 여기서는 2f+1입니다."},{symbol:"Q_1,Q_2",name:"두 signer 집합",description:"서로 충돌할 수 있는 certificate의 signer sets입니다."}]} assumptions={["n=3f+1인 fixed equal-weight membership입니다.","Signer identity·phase·view·value와 signature를 검증하고 중복 signer를 한 번만 셉니다.","Honest replica가 protocol의 lock·vote rule을 지킵니다.","Stake-weighted quorum에는 signer 수가 아니라 historical voting weight를 사용합니다."]} interpretation="n=4,f=1,q=3이면 두 quorum은 최소 2명을 공유해 그중 적어도 한 명은 honest입니다. q를 2로 낮추면 {A,B}와 {C,D}처럼 교집합 없는 certificate가 가능하므로 이 safety 논리를 쓸 수 없습니다." />
        <BFTAxisTableViz />
        <div className="grid gap-4 md:grid-cols-2"><Note title="같은 조건으로 고정할 것">Membership·fault 위치·GST와 delay trace, payload bytes·batching, offered load, crypto·threshold setup, machine·region과 client measurement point를 함께 기록합니다.</Note><Note title="서로 따로 볼 결과">Conflicting commit은 0이어야 하는 hard safety gate입니다. 그 뒤 good-interval latency, blip 중 backlog, recovery time, useful throughput, network bytes와 CPU를 분리합니다.</Note></div>
        <p>예를 들어 후보 A가 정상 구간 100ms, blip 후 recovery 8초이고 후보 B가 정상 140ms, recovery 0.8초라면 “B가 느리다”로 끝낼 수 없습니다. 사용 환경의 blip 빈도와 latency SLO에 따라 선택이 달라집니다. 반대로 candidate가 빠르더라도 equivocation fixture에서 conflicting committed digest가 하나라도 나오면 평균 throughput이 그 실패를 상쇄하지 못합니다.</p>
        <h3 className="text-xl font-semibold">이 글만으로 풀어야 하는 10문제</h3><p>기초 6문제는 4-replica quorum, PBFT phase, view change evidence, HotStuff chained QC, Autobahn lane·cut, safety·liveness 분리를 묻습니다. 심화 4문제는 작은 quorum 반례, 동일 조건 비용 계산, blip trace 비교, failure-injection release gate를 설계하게 합니다. 답안에 필요한 전제·수치·과도하게 읽으면 안 되는 결론은 위 네 section에 모두 놓았습니다.</p>
      </section>
    </article>
  );
}

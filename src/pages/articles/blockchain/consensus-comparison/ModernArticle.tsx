import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";
import { ConsensusFamilyMatrixViz, ConsensusSelectionFlowViz } from "./viz/ModernConsensusComparisonViz";

export default function ModernConsensusComparisonArticle() {
  return <article className="space-y-14">
    <section id="overview" className="space-y-6">
      <header className="space-y-3"><p className="text-sm font-semibold text-primary">합의 protocol 종합 선택</p><h2 className="text-3xl font-bold tracking-tight">‘누가 어떤 실패 아래 무엇을 결정하는가’가 TPS보다 먼저다</h2></header>
      <p className="text-lg leading-8 text-foreground/90">합의(consensus)는 여러 node가 network 도착 순서가 달라도 하나의 값이나 명령 순서를 결정하는 문제입니다. PBFT·HotStuff·Tendermint 같은 classical BFT, Narwhal·Bullshark 같은 DAG-BFT, Bitcoin식 Nakamoto consensus, 반복 sampling으로 선호를 굳히는 계열은 모두 합의라는 이름을 쓰지만 membership과 finality의 의미부터 다릅니다.</p>
      <p>초심자가 가장 먼저 분리할 것은 safety와 liveness입니다. Safety는 두 정직 node가 충돌하는 결정을 내리지 않는 성질이고, liveness는 명시한 network·fault 조건에서 결국 새 결정을 내리는 성질입니다. Network partition에서 멈춰 safety를 지키는 protocol과 계속 한쪽 결과를 내는 protocol을 평균 TPS 하나로 비교하면 안 됩니다. <a className="text-primary underline-offset-4 hover:underline" href="/blockchain/distributed-systems#overview">process·message·failure model</a>과 <a className="text-primary underline-offset-4 hover:underline" href="/blockchain/smr-theory#overview">SMR의 total order·deterministic apply</a>는 별도 정본에서 더 깊게 이어집니다.</p>
      <ConsensusSelectionFlowViz />
      <aside className="rounded-lg border border-primary/30 bg-primary/5 p-5 text-sm leading-6"><strong>핵심 아이디어:</strong> 같은 표의 첫 열은 protocol 이름이 아니라 membership snapshot과 influence 단위여야 합니다. 그 다음 failure·timing model, decision evidence, finality semantics를 고정하고 마지막에 workload 비용을 비교합니다.</aside>
    </section>

    <section id="performance" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">01 · 계열과 성능</p><h2 className="mt-2 text-2xl font-bold">Message 차수는 payload bytes, fan-out, crypto와 client wait를 대신하지 않는다</h2></header>
      <ConsensusFamilyMatrixViz />
      <p>
            Classical leader BFT는 고정된 validator 집합에서 proposal과 vote certificate로 명령 순서를 결정합니다. DAG-BFT는 여러
            validator의 data dissemination을 병렬화하되 DAG의 causal history를 결정적인 total order로 펼치는 규칙이 추가됩니다.
            Nakamoto consensus는 열린 참여를 hash work 같은 희소 자원과 연결하고 cumulative work가 큰 유효 branch를 선택합니다. Sampling
            계열은 작은 peer 표본을 반복해 선호 confidence를 키우므로 sample size·독립성·adversary fraction이 안전성 parameter가 됩니다.
          </p>
      <ExplainedFormula question="사용자가 느끼는 commit latency를 어떤 항목으로 분해해야 protocol의 진짜 병목을 찾을 수 있는가?" idea={<>한 번의 평균 RTT로 뭉개지 않고 request가 batch를 기다리는 시간, data가 필요한 replicas에 도달하는 시간, order round, deterministic execution, finality policy와 queueing을 더합니다. 서로 겹쳐 실행되는 구간은 critical path에서만 세어야 합니다.</>} formula={String.raw`\begin{aligned}L_{client}={}&L_{batch}+L_{data}+r\Delta\\&+L_{exec}+L_{finality}+L_{queue}\end{aligned}`}
      annotatedFormula={String.raw`\begin{aligned}\underbrace{L_{client}}_{\text{Client-visible latency 계산}}={}&L_{batch}+L_{data}+r\Delta\\&+L_{exec}+L_{finality}+L_{queue}\end{aligned}`}
      operations={[
        { expression: String.raw`L_{client}`, annotation: ["Client-visible latency이(가) 식의 결과에","기여하는 방식을 계산합니다.","한 번의 평균 RTT로 뭉개지 않고 request가","batch를 기다리는 시간, data가 필요한"] },
      ]} terms={[{symbol:"L_{client}",name:"Client-visible latency",description:"제출 시점부터 선택한 finality evidence까지의 end-to-end 시간입니다."},{symbol:"r",name:"Critical-path rounds",description:"좋은 network 구간에서 순차적으로 기다려야 하는 message-delay 단계 수입니다."},{symbol:String.raw`\Delta`,name:"Observed network delay",description:"고정 상수가 아니라 region·payload·tail percentile과 함께 측정한 delay입니다."},{symbol:"L_{data},L_{exec}",name:"Data·execution cost",description:"Payload availability와 state transition 실행에 실제로 든 시간입니다."}]} assumptions={["모든 항목은 같은 client 위치·offered load·batch policy·payload에서 측정합니다.","병렬 data/order 작업을 중복 합산하지 않고 critical path를 계측합니다.","GST 뒤 theoretical bound와 실제 p50·p99를 구분합니다.","Confirmation depth나 challenge period처럼 protocol 밖 policy도 finality 항에 명시합니다."]} interpretation="Order round를 한 단계 줄여도 queue가 500ms라면 사용자는 거의 이득을 보지 못합니다. 반대로 낮은 p50만 보고 blip 뒤 backlog와 p99 recovery를 숨기면 운영 선택을 잘못하게 됩니다." />
      <p>예를 들어 두 후보가 같은 1KiB transaction 10,000개를 처리하더라도 A는 10ms batching+120ms data+2×40ms order+30ms execution=240ms이고, B는 60ms batching+50ms data+3×40ms+10ms execution=240ms일 수 있습니다. 합계가 같아도 A는 data fan-out, B는 batching·round가 최적화 지점입니다. 논문 TPS는 machine·region·transaction size·batch·client load를 함께 인용해야 하며 다른 논문의 숫자를 가로로 빼서 배수 향상이라 부르지 않습니다.</p>
    </section>

    <section id="security" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">02 · 안전성과 활성</p><h2 className="mt-2 text-2xl font-bold">결정적 finality와 확률적 confirmation은 같은 문장이 아니다</h2></header>
      <p>Fixed-membership BFT에서 결정적 finality는 fault bound, authenticated vote, quorum intersection과 lock rule이 유지될 때 conflicting commit을 protocol 위반 없이 만들 수 없다는 뜻입니다. 이는 “block을 본 즉시 안전하다”거나 fault bound가 깨져도 history가 유지된다는 뜻이 아닙니다. Nakamoto 계열에서는 더 큰 competing work가 나타날 reorg 위험이 confirmation depth와 honest/adversarial work, propagation 조건에 따라 줄어드는 확률적 finality를 사용합니다.</p>
      <p>Sampling 계열의 오류 확률도 독립 표본과 Byzantine 비율 같은 model parameter에 의존합니다. ‘확률적’이라는 말만 같다고 Nakamoto의 random walk와 metastable sampling을 같은 식으로 계산할 수 없습니다. DAG-BFT의 finality가 결정적이어도 data가 certificate만 있고 executor가 payload를 받지 못하면 safety와 별개로 liveness가 막힐 수 있습니다. 따라서 finality evidence, data availability, execution validity, client notification을 별도 receipt로 남깁니다.</p>
      <div id="paper-dls-comparison"><CitationBlock source="Dwork·Lynch·Stockmeyer — Consensus in the Presence of Partial Synchrony" citeKey={1} href="https://groups.csail.mit.edu/tds/papers/Lynch/jacm88.pdf"><p><strong>문제:</strong> 완전 synchrony와 완전 asynchrony 사이에서 consensus 가능 조건을 밝힙니다.</p><p><strong>기여:</strong> Unknown delay bound와 unknown Global Stabilization Time(GST) model, fault별 resilience 결과를 제시합니다.</p><p><strong>전제와 범위:</strong> 논문의 process·authentication·fault model에 대한 이론 결과입니다. 실제 Internet의 GST 시점이나 timeout 값을 제공하지 않습니다.</p></CitationBlock></div>
      <div id="paper-bitcoin-comparison"><CitationBlock source="Nakamoto — Bitcoin: A Peer-to-Peer Electronic Cash System" citeKey={2} href="https://bitcoin.org/bitcoin.pdf"><p><strong>문제:</strong> 중앙 운영자 없이 double spend에 저항하는 transaction history를 만듭니다.</p><p><strong>기여:</strong> PoW chain, cumulative work 선택과 attacker catch-up 확률 모델을 결합합니다.</p><p><strong>전제와 범위:</strong> 논문의 hash-power·network·confirmation model입니다. 현대 Bitcoin 구현의 모든 relay·mining pool·fee 동작이나 다른 PoW chain의 확률을 자동 보장하지 않습니다.</p></CitationBlock></div>
    </section>

    <section id="use-cases" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">03 · 선택과 검증</p><h2 className="mt-2 text-2xl font-bold">제품의 membership과 실패 비용을 protocol 요구로 번역한다</h2></header>
      <div className="overflow-x-auto rounded-lg border border-border"><table className="min-w-[780px] w-full text-sm"><thead className="bg-muted/50 text-left"><tr><th className="p-3">상황</th><th className="p-3">먼저 물을 질문</th><th className="p-3">후보와 주의점</th></tr></thead><tbody className="divide-y divide-border text-muted-foreground"><tr><td className="p-3 font-medium text-foreground">조직이 validator를 관리</td><td className="p-3">f, region, key·membership rotation</td><td className="p-3">Classical/DAG BFT; fault bound 초과와 operator correlation 검사</td></tr><tr><td className="p-3 font-medium text-foreground">Open participation ledger</td><td className="p-3">Sybil cost와 influence concentration</td><td className="p-3">PoW/PoS 계열; resource majority·custody·fork choice 분리</td></tr><tr><td className="p-3 font-medium text-foreground">큰 payload·높은 offered load</td><td className="p-3">Leader ingress와 data availability</td><td className="p-3">DAG/separated dissemination; order와 execution 병목은 그대로 측정</td></tr><tr><td className="p-3 font-medium text-foreground">간헐적 partition·blip</td><td className="p-3">정지 허용 시간과 conflict 비용</td><td className="p-3">Safety hard gate 뒤 recovery p99·backlog drain을 paired 비교</td></tr></tbody></table></div>
      <p>Release test는 같은 binary·membership·keys·genesis, transaction bytes·arrival trace와 network fault schedule을 후보 둘에 재생합니다. Equivocation, omission, minority/majority partition, GST marker, leader crash·restart, stale certificate, disk recovery를 넣고 conflicting commit 0과 deterministic state hash parity를 먼저 검사합니다. 그 뒤 client p50/p99, useful committed bytes/s, per-replica network bytes, CPU·memory, backlog와 recovery time을 비교합니다.</p>
      <h3 className="text-xl font-semibold">이 글만으로 풀어야 하는 10문제</h3><p>
            기초 6문제는 safety·liveness, membership, 네 계열의 evidence, 결정적·확률적 finality, latency 분해와 비용 단위를 확인합니다.
            심화 4문제는 서로 다른 finality를 같은 숫자로 비교한 반례, workload-normalized benchmark, partition trace, hard-gated
            선택표를 만들게 합니다. 필요한 개념은 현재 글에서 직관과 예제로 설명하고 증명과 protocol별 유도는 연결한 canonical article로 확장합니다.
          </p>
    </section>
  </article>;
}

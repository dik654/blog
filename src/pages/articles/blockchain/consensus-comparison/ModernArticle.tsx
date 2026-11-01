import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";
import {
  ConsensusFamilyMatrixViz,
  ConsensusFaultTraceViz,
  ConsensusLatencyPathViz,
  ConsensusRequestTraceViz,
  ConsensusSelectionFlowViz,
} from "./viz/ModernConsensusComparisonViz";

export default function ModernConsensusComparisonArticle() {
  return <article className="space-y-14">
    <section id="overview" className="scroll-mt-24 space-y-6">
      <header className="space-y-3">
        <p className="text-sm font-semibold text-primary">합의 계열 비교 · 같은 요청을 네 경로로 추적</p>
        <h2 className="text-3xl font-bold tracking-tight">무엇을 완료로 부르는지부터 맞춰야 비교가 시작됩니다</h2>
      </header>
      <p className="text-lg leading-8 text-foreground/90">
        사용자가 잔액 10을 보내는 요청을 제출했다고 하겠습니다. Classical BFT는 validator 표를, DAG-BFT는 data certificate와 ordering evidence를, Nakamoto PoW는 누적 work를, sampling 계열은 반복 표본의 선호를 모읍니다. 네 계열 모두 하나의 history를 만들려 하지만, 참가 자격과 완료 증거는 서로 다릅니다.
      </p>
      <ConsensusRequestTraceViz />
      <p>
        이 글이 답할 질문은 하나입니다. <strong>서로 다른 합의 계열을 어떤 공통 질문으로 비교해야 제품의 안전성과 대기 시간을 잘못 해석하지 않는가?</strong> 비교 순서는 참가 자격과 영향력, 실패와 timing 전제, 결정 증거와 finality 의미, client가 실제로 기다린 경로입니다.
      </p>
      <aside className="border-l-2 border-primary pl-5 text-sm leading-6 text-muted-foreground">
        <strong className="text-foreground">먼저 재사용할 개념:</strong> Safety는 충돌 결정을 금지하는 성질이고, liveness는 명시한 조건에서 결국 새 결정을 내리는 성질입니다. 합의가 순서를 정한 뒤에도 deterministic execution과 client notification은 별도 상태입니다. 자세한 정의는 <a className="text-primary underline-offset-4 hover:underline" href="/cs/blockchain/distributed-systems#overview">분산 시스템</a>과 <a className="text-primary underline-offset-4 hover:underline" href="/cs/blockchain/smr-theory#overview">상태 머신 복제</a> 글에서 이어집니다.
      </aside>
    </section>

    <section id="evidence" className="scroll-mt-24 space-y-6">
      <header>
        <p className="text-sm font-semibold text-primary">01 · 증거</p>
        <h2 className="mt-2 text-2xl font-bold">Validator 한 표와 hash power 한 단위는 같은 표가 아닙니다</h2>
      </header>
      <ConsensusFamilyMatrixViz />
      <p>
        Classical BFT는 고정된 검증자 명부에서 서명된 표를 모읍니다. 명부는 epoch마다 바뀔 수 있습니다. 프로토콜마다 lock과 view change 방식은 다르지만, 같은 slot에서 충돌하는 quorum certificate를 만들지 못하게 하는 교집합이 핵심입니다.
      </p>
      <p>
        DAG-BFT는 payload 전파를 ordering 경로와 분리하는 경우가 많습니다. 이때 batch를 여러 노드가 보관했다는 data certificate와 anchor의 순서를 확정했다는 증거는 서로 다릅니다. 전자가 생겼다고 실행 순서까지 결정된 것은 아닙니다.
      </p>
      <p>
        Nakamoto PoW는 “노드 몇 대”보다 유효한 work가 얼마나 누적됐는지를 비교합니다. 열린 참여를 hash power라는 비용에 연결하고, 더 많은 누적 work를 가진 유효한 chain을 선택합니다. Sampling 계열은 작은 peer 표본을 여러 번 뽑아 선호와 confidence를 갱신합니다. 따라서 sample size, threshold, 연속 성공 횟수와 표본 전제가 결과의 일부입니다.
      </p>
      <p>
        같은 요청을 받았다는 사실은 어느 계열에서도 완료가 아닙니다. BFT vote는 domain과 signature를, DAG vertex는 parents와 payload availability를, PoW block은 header·transactions·work를, sampling response는 poll 대상과 현재 선호를 검증한 뒤에야 다음 상태로 넘어갑니다.
      </p>
    </section>

    <section id="security" className="scroll-mt-24 space-y-6">
      <header>
        <p className="text-sm font-semibold text-primary">02 · 장애</p>
        <h2 className="mt-2 text-2xl font-bold">Network partition은 멈춤·branch 경쟁·표본 편향을 각각 만듭니다</h2>
      </header>
      <ConsensusFaultTraceViz />
      <p>
        고정된 참가자 명부를 쓰는 BFT에서는 어느 쪽도 정족수를 만들지 못하면 멈추는 것이 정상일 수 있습니다. 정지는 liveness 손실입니다. 그러나 주어진 전제 안에서 충돌하는 certificate가 없다면 곧바로 safety 실패라고 볼 수는 없습니다.
      </p>
      <p>
        DLS의 partial synchrony는 두 모형을 구분합니다. 하나는 메시지 지연 상한이 있지만 그 값을 모르는 경우이고, 다른 하나는 알려진 상한이 알 수 없는 시점 이후부터 성립하는 경우입니다. 논문이 실제 인터넷의 GST 시각이나 timeout 값을 정해 주는 것은 아닙니다.
      </p>
      <p>
        PoW network가 갈라지면 양쪽 branch에 work가 쌓일 수 있습니다. 연결이 돌아온 뒤 더 큰 누적 work를 가진 유효한 chain을 채택하면서 다른 branch의 낮은 깊이 거래가 되돌아갈 수 있습니다. Sampling 계열의 오류 확률은 반복 표본과 adversary model에서 나오므로, PoW의 attacker catch-up 확률과 같은 식이나 같은 “99.9% finality” 열에 넣으면 안 됩니다.
      </p>
      <div id="paper-dls-comparison"><CitationBlock source="Dwork·Lynch·Stockmeyer — Consensus in the Presence of Partial Synchrony" citeKey={1} href="https://groups.csail.mit.edu/tds/papers/Lynch/jacm88.pdf">
        <p><strong>문제:</strong> 완전 synchrony와 완전 asynchrony 사이에서 consensus가 가능한 조건을 밝힙니다.</p>
        <p><strong>기여:</strong> 알 수 없는 delay bound와 알 수 없는 안정화 시점을 구분하고 fault model별 resilience를 제시합니다.</p>
        <p><strong>전제와 범위:</strong> 논문의 process·authentication·fault model에 대한 이론 결과입니다.</p>
        <p><strong>말하지 않는 것:</strong> 실제 서비스의 GST 시점, timeout 값이나 관측 p99를 제공하지 않습니다.</p>
      </CitationBlock></div>
      <div id="paper-bitcoin-comparison"><CitationBlock source="Nakamoto — Bitcoin: A Peer-to-Peer Electronic Cash System" citeKey={2} href="https://bitcoin.org/bitcoin.pdf">
        <p><strong>문제:</strong> 중앙 운영자 없이 double spend에 저항하는 거래 history를 만듭니다.</p>
        <p><strong>기여:</strong> Hash-based proof-of-work chain, 누적 work 선택과 attacker catch-up model을 결합합니다.</p>
        <p><strong>전제와 범위:</strong> 원문의 hash-power·network·confirmation model입니다.</p>
        <p><strong>말하지 않는 것:</strong> 현대 mining pool·relay·fee 정책이나 다른 PoW chain의 reorg 확률을 자동으로 설명하지 않습니다.</p>
      </CitationBlock></div>
      <div id="paper-avalanche-comparison"><CitationBlock source="Team Rocket et al. — Snow protocol family · arXiv v2" citeKey={3} href="https://arxiv.org/abs/1906.08936v2">
        <p><strong>문제:</strong> 전체 참가자를 매번 모으지 않고 반복적인 network subsampling으로 선호를 수렴시킵니다.</p>
        <p><strong>기여:</strong> Metastable sampling을 사용하는 Snow family와 그 probabilistic safety model을 제시합니다.</p>
        <p><strong>전제와 범위:</strong> 논문의 sampling·Byzantine adversary·parameter와 평가 환경입니다.</p>
        <p><strong>말하지 않는 것:</strong> 한 번의 poll, 임의 peer discovery나 현재 모든 Avalanche 구현의 network finality를 대신하지 않습니다.</p>
      </CitationBlock></div>
    </section>

    <section id="performance" className="scroll-mt-24 space-y-6">
      <header>
        <p className="text-sm font-semibold text-primary">03 · 대기</p>
        <h2 className="mt-2 text-2xl font-bold">같은 240ms도 줄여야 할 계층이 다릅니다</h2>
      </header>
      <ConsensusLatencyPathViz />
      <ExplainedFormula
        question="Client가 실제로 기다린 시간을 어떻게 나누어야 병목을 찾을 수 있습니까?"
        idea={<>Batch 대기, data와 ordering의 critical path, deterministic execution, finality policy, queue를 구분합니다. Data와 order가 병렬이라면 두 구간을 모두 더하지 않고 실제로 더 오래 걸린 critical path만 셉니다.</>}
        formula={String.raw`L_{client}=L_{batch}+L_{critical}+L_{exec}+L_{policy}+L_{queue}`}
        annotatedFormula={String.raw`L_{client}=\underbrace{L_{batch}}_{\text{묶음 대기}}+\underbrace{L_{critical}}_{\text{data·order 실제 경로}}+\underbrace{L_{exec}}_{\text{상태 실행}}+\underbrace{L_{policy}}_{\text{확인 정책}}+\underbrace{L_{queue}}_{\text{밀린 요청}}`}
        operations={[
          { expression: String.raw`10+120+2\times40+30=240\text{ ms}`, annotation: ["후보 A는 batch 10, data 120", "order 두 단계 80, execute 30", "data 전달이 가장 긴 구간입니다."] },
          { expression: String.raw`60+50+3\times40+10=240\text{ ms}`, annotation: ["후보 B는 batch 60, data 50", "order 세 단계 120, execute 10", "batch와 order가 긴 구간입니다."] },
          { expression: String.raw`L_{critical}=\max(L_{data},L_{order})`, annotation: ["두 작업이 완전히 겹치는 경우의 예입니다.", "겹치지 않으면 실제 순차 구간을 더합니다.", "Trace 없이 식만 보고 정하지 않습니다."] },
        ]}
        terms={[
          { symbol: "Lclient", name: "client-visible latency", description: "요청 제출부터 선택한 완료 evidence를 받을 때까지의 시간입니다." },
          { symbol: "Lcritical", name: "data·order critical path", description: "병렬 구간을 중복 계산하지 않은 실제 선행 경로입니다." },
          { symbol: "Lpolicy", name: "finality policy wait", description: "Confirmation depth나 별도 checkpoint처럼 제품이 추가한 대기입니다." },
          { symbol: "Lqueue", name: "queue delay", description: "Offered load가 처리량을 넘을 때 앞선 요청 때문에 기다린 시간입니다." },
        ]}
        assumptions={[
          "후보는 같은 client 위치·transaction bytes·batch policy·offered load에서 측정합니다.",
          "각 구간은 trace ID와 단조 시계로 계측하고 겹친 시간을 중복 합산하지 않습니다.",
          "평균뿐 아니라 p50·p95·p99와 장애 뒤 backlog drain을 함께 봅니다.",
          "논문의 theoretical message round를 실제 network delay나 제품 SLA로 바꾸지 않습니다.",
        ]}
        interpretation="두 후보의 합계가 같아도 A는 전파·storage·fan-out을, B는 batching·round·timeout을 먼저 조사해야 합니다. Queue가 500ms라면 consensus round를 한 단계 줄여도 사용자가 느끼는 개선은 작을 수 있습니다."
      />
      <p>
        Throughput도 transaction count만 비교하지 않습니다. Useful committed bytes/s, payload 크기, batch, validator 수와 region, client offered load, signature·hash CPU, node별 ingress·egress를 같이 기록합니다. 서로 다른 논문에서 가져온 최고 TPS를 나란히 놓아 배수 향상으로 읽는 방식은 workload와 hardware 차이를 숨깁니다.
      </p>
      <div id="paper-narwhal-comparison"><CitationBlock source="Danezis et al. — Narwhal and Tusk · arXiv v4" citeKey={4} href="https://arxiv.org/abs/2105.11827v4">
        <p><strong>문제:</strong> Reliable transaction dissemination을 ordering과 분리해 BFT의 data path 병목을 줄입니다.</p>
        <p><strong>기여:</strong> Causal history를 저장하는 Narwhal과 이를 HotStuff·Tusk ordering에 연결하는 구조를 제시합니다.</p>
        <p><strong>전제와 범위:</strong> 논문의 authenticated membership, worker 배치, payload와 WAN 평가 조건입니다.</p>
        <p><strong>말하지 않는 것:</strong> 논문의 TPS가 다른 hardware·transaction·protocol의 상한이거나 data certificate가 곧 execution finality라는 뜻은 아닙니다.</p>
      </CitationBlock></div>
    </section>

    <section id="use-cases" className="scroll-mt-24 space-y-6">
      <header>
        <p className="text-sm font-semibold text-primary">04 · 선택</p>
        <h2 className="mt-2 text-2xl font-bold">후보 이름보다 먼저 제품이 지켜야 할 경계를 확정합니다</h2>
      </header>
      <ConsensusSelectionFlowViz />
      <p>
        조직이 검증자와 key rotation을 관리하며 충돌 비용이 매우 크다면, 고정 참가자 BFT의 fault domain과 허용 가능한 정지 시간을 먼저 적습니다. 누구나 참여할 수 있는 ledger라면 Sybil 영향력을 어떤 자원으로 제한하는지, 그 자원이 얼마나 집중되는지부터 봅니다.
      </p>
      <p>
        큰 payload의 전파가 병목이라면 DAG나 분리된 dissemination이 후보가 될 수 있습니다. 다만 전파 경로를 분리해도 ordering, execution, storage의 병목까지 자동으로 사라지지는 않습니다.
      </p>
      <p>
        비교 환경부터 고정합니다. 같은 binary, membership, keys, genesis를 쓰고 transaction bytes와 arrival trace도 같게 맞춥니다. Network fault schedule 역시 모든 후보에 똑같이 적용합니다.
      </p>
      <p>
        정상 부하뿐 아니라 equivocation, omission, 소수·다수 partition, leader crash, 오래된 증거와 재시작도 시험합니다. 먼저 충돌 decision이 0건인지, 모든 정상 노드의 state hash가 같은지 확인합니다. 이 조건을 통과한 후보만 client p99, useful bytes/s, 노드별 network bytes, CPU·memory, backlog와 recovery time으로 비교합니다.
      </p>
      <p>
        이 비교 글은 특정 protocol을 채택하라고 결론 내리지 않습니다. 각 계열의 완료 evidence를 분리하고 같은 조건의 실험 질문을 만드는 데서 끝납니다. 개별 protocol의 lock, quorum, DAG linearization, sampling state는 연결된 세부 글에서 한 요청씩 다시 추적합니다.
      </p>
    </section>
  </article>;
}

import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";
import { AutobahnCommitViz, AutobahnLaneCutViz } from "./viz/ModernAutobahnViz";

export default function ModernAutobahnArticle() {
  return <article className="space-y-14">
    <section id="overview" className="space-y-6">
      <header className="space-y-3"><p className="text-sm font-semibold text-primary">차선형 데이터 전파 · 끝점 합의</p><h2 className="break-keep text-3xl font-bold tracking-tight">Autobahn은 멈춘 동안 쌓인 거래를 어떻게 한 번에 따라잡을까요?</h2></header>
      <p className="text-lg font-semibold leading-8 text-foreground/90">각 복제본은 합의가 멈춰도 자기 차선에 거래 묶음을 계속 인증하고, 합의는 모든 묶음 대신 각 차선의 최신 끝점만 담은 짧은 목록 하나를 결정합니다.</p>
      <p>Alice가 Bob에게 보내는 거래가 A 차선의 두 번째 칸에 들어갔다고 하겠습니다. 거래 묶음은 승객(passenger), 차선의 한 칸은 자동차(car)라고 부릅니다. 자동차에는 차선 위치, 이전 자동차의 참조, 실제 거래 묶음이 들어갑니다.</p>
      <p>서로 다른 복제본 <code>f+1</code>개가 같은 자동차를 받았다고 표를 주면 가용성 증명(Proof of Availability, PoA)이 생깁니다. 각 차선은 서로 기다리지 않고 자라기 때문에 네트워크가 잠깐 흔들리는 동안에도 가능한 차선은 데이터를 계속 퍼뜨릴 수 있습니다.</p>
      <p>합의는 쌓인 거래 바이트를 다시 전부 싣지 않습니다. 대신 모든 차선에서 PoA를 얻은 최신 끝점을 모은 목록, 즉 cut을 결정합니다. 각 노드는 지난 cut 뒤에 새로 생긴 차선 뒷부분(suffix)을 가져오고, 모두가 아는 같은 규칙으로 한 줄에 섞은 뒤 실행으로 넘깁니다. 따라서 합의 메시지 크기는 backlog 길이에 따라 늘지 않습니다. 다만 빠진 payload를 받는 시간, 쌓인 거래를 실제로 실행하는 시간까지 사라지는 것은 아닙니다.</p>
      <AutobahnLaneCutViz />
      <aside className="rounded-lg border border-primary/30 bg-primary/5 p-5 text-sm leading-6"><strong>세 증거를 섞지 마세요.</strong> PoA는 데이터를 다시 받을 곳이 남았다는 증거이고, cut 합의는 어느 끝점까지 순서에 넣을지 정한 증거입니다. 실제 payload 동기화와 애플리케이션 상태 변경은 그 뒤에 따로 끝내야 합니다.</aside>
    </section>

    <section id="lanes-cut" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">01 · 자동차와 가용성 증명</p><h2 className="mt-2 break-keep text-2xl font-bold">PoA가 있는데도 왜 같은 위치에 두 자동차가 생길 수 있을까요?</h2></header>
      <p>논문은 전체 복제본을 <code>n=3f+1</code>개, 그중 Byzantine 장애를 일으킬 수 있는 복제본을 최대 <code>f</code>개로 둡니다. 자동차의 PoA에는 같은 내용에 대한 서로 다른 표 <code>f+1</code>개가 필요합니다. 따라서 표를 준 복제본 중 적어도 한 곳은 정상이며 데이터를 다시 내줄 수 있습니다.</p>
      <p><code>n=4, f=1</code>이면 필요한 표는 2개이고 정상 보유자의 하한은 1명입니다. 하지만 Byzantine 차선 소유자가 같은 위치에 자동차 두 대를 제안하고 서로 다른 정상 복제본이 하나씩 투표하면 두 자동차 모두 PoA를 얻을 수 있습니다. PoA를 “갈라지지 않았다는 인증서”로 보면 안 되는 이유입니다. 합의가 그 차선에서 사용할 끝점 하나를 나중에 정합니다.</p>
      <ExplainedFormula question="Car PoA의 honest-holder 하한은 얼마이고 무엇을 보장하지 않는가?" idea={<>PoA signer가 f+1명이고 Byzantine signer가 최대 f명이므로 적어도 한 명은 honest합니다. 이 결과는 data retrieval 후보를 남기지만 같은 position의 유일한 car를 증명하지는 않습니다.</>} formula={String.raw`\begin{aligned}honest(PoA)&\ge |PoA|-f\\&=(f+1)-f=1\end{aligned}`}
      annotatedFormula={String.raw`\begin{aligned}honest(PoA)&\ge \underbrace{|PoA|-f}_{\text{서명자 중 최대 f명 Byzantine}}\\&=\underbrace{(f+1)-f=1}_{\text{honest holder 최소 1}}\end{aligned}`}
      operations={[
        { expression: String.raw`|PoA|-f`, annotation: ["distinct matching vote 수에서","최악의 경우 Byzantine f명을 뺀","honest voter 하한"] },
        { expression: String.raw`(f+1)-f=1`, annotation: ["car threshold f+1을 넣으면 1.","n=4, f=1: 2표 중 최대 1표 Byzantine.","같은 position의 두 car 모두 PoA 가능"] },
      ]} terms={[{symbol:"PoA",name:"proof of availability",description:"같은 lane·position·car digest에 대한 distinct matching votes입니다."},{symbol:"f",name:"Byzantine bound",description:"n=3f+1 committee에서 허용하는 faulty replicas 상한입니다."},{symbol:"f+1",name:"car threshold",description:"Paper data layer가 availability premise에 사용하는 vote 수입니다."},{symbol:"honest(PoA)",name:"honest holder lower bound",description:"PoA voters 중 batch retrieval에 응답할 honest replica 최소 수입니다."}]} assumptions={["Static Byzantine adversary, authenticated reliable channels와 valid signatures를 사용합니다.","Vote는 같은 lane·position·digest domain에 결속되고 duplicate signer를 제거합니다.","Honest voter가 protocol이 요구한 car data를 보관한다는 전제를 사용합니다.","PoA는 total order, non-equivocation, permanent retention이나 application execution receipt가 아닙니다."]} interpretation="n=4,f=1에서 PoA 두 표 중 최대 한 표만 Byzantine이므로 honest holder가 적어도 한 명입니다. 하지만 Byzantine voter B와 honest H1이 car x에, B와 honest H2가 car y에 투표하면 x와 y 모두 PoA를 가질 수 있습니다." />
      <p>Cut <code>[2,2,2,3]</code>은 네 차선에서 선택한 인증된 끝점 위치입니다. 이전에 커밋한 cut이 <code>[1,1,1,1]</code>이었다면 이번에 새로 처리할 뒷부분은 A2, B2, C2, D2·D3입니다.</p>
      <p>각 노드는 빠진 자동차를 digest와 부모 연결을 따라 병렬로 받고, 차선과 위치에 대한 결정적 zipper 규칙을 적용합니다. 나중 cut에 어떤 차선의 더 낮은 과거 위치가 들어 있어도, 차선마다 기록한 마지막 커밋 위치 이하를 다시 출력하면 안 됩니다.</p>
      <div id="paper-autobahn-lanes"><CitationBlock source="Autobahn paper §5.1 — Lanes and Cars" citeKey={1} href="https://arxiv.org/pdf/2401.10369"><p><strong>문제:</strong> Consensus와 독립적으로 data를 전파하면서 긴 lane history를 작은 tip reference로 표현해야 합니다.</p><p><strong>기여:</strong> In-order parent chaining, f+1 PoA, certified·optimistic tips와 non-blocking synchronization premise를 정의합니다.</p><p><strong>전제:</strong> Paper model의 reliable authenticated channels, digest/signature validity와 lane-position voting rules를 사용합니다.</p><p><strong>근거 범위:</strong> Autobahn data layer와 proof-of-availability semantics에 한정합니다.</p><p><strong>말하지 않는 것:</strong> PoA가 reliable-broadcast non-equivocation, total order, permanent storage나 실행 성공을 보장하지 않습니다.</p></CitationBlock></div>
    </section>

    <section id="commit-recovery" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">02 · 준비, 확정, 주 노드 교체</p><h2 className="mt-2 break-keep text-2xl font-bold">빠른 확정과 느린 확정은 왜 서로 다른 증거를 남길까요?</h2></header>
      <p>일반 view에서 주 노드가 cut을 제안하면 <code>2f+1</code>개의 준비 표(Prep-Vote)가 PrepareQC를 만듭니다. 느린 경로는 이 증거를 다시 알리는 Confirm 메시지 뒤에 <code>2f+1</code>개의 확인 응답(Confirm-Ack)을 모아 CommitQC를 만듭니다. 여러 정상 노드가 PrepareQC를 저장했기 때문에 주 노드가 바뀌어도 결정 후보를 복구할 수 있습니다.</p>
      <p>반면 모든 <code>n</code>개 복제본의 준비 표가 모인 빠른 경로는 Confirm 단계를 생략합니다. <code>n=4, f=1</code>이면 PrepareQC에는 3표, 느린 CommitQC에는 확인 응답 3개, 빠른 CommitQC에는 준비 표 4개가 필요합니다. 이름과 기준이 다른 증거를 하나의 <code>ready=true</code>로 뭉치면 다음 view가 무엇을 반드시 이어받아야 하는지 알 수 없습니다.</p>
      <AutobahnCommitViz />
      <p>진행이 없으면 먼저 <code>f+1</code>개의 Timeout 메시지가 모입니다. 이 가운데 적어도 하나는 정상 복제본의 불만이므로 다른 복제본도 같은 view의 Timeout을 퍼뜨립니다. <code>2f+1</code>개가 모이면 타임아웃 인증서(Timeout Certificate, TC)가 생기고 다음 view를 여는 표가 됩니다.</p>
      <p>새 주 노드는 TC 안에서 가장 높은 PrepareQC와, <code>f+1</code>개 보고서에 반복해서 나타난 가장 높은 제안을 비교해 논문의 우선순위 규칙으로 안전한 후보를 고릅니다. 고정 timeout 값이나 BLS 서명 사용은 프로토콜의 필수 전제가 아니므로 실제 배포에서 따로 정하고 측정해야 합니다.</p>
      <div id="paper-autobahn-consensus"><CitationBlock source="Autobahn paper §5.2–5.4 — Cut consensus and view change" citeKey={2} href="https://arxiv.org/pdf/2401.10369"><p><strong>문제:</strong> 큰 backlog를 참조하는 cut을 낮은 agreement latency로 commit하고 fast/slow evidence를 view change에서 보존해야 합니다.</p><p><strong>기여:</strong> Prepare/Confirm, all-node fast commit, TC recovery, deterministic lane zipping과 parallel slots를 정의합니다.</p><p><strong>전제:</strong> Paper의 exact quorum domains, lane-history synchronization과 bounded concurrent-instance policy를 따릅니다.</p><p><strong>근거 범위:</strong> Autobahn cut consensus·view-change·processing algorithms와 correctness proofs에 한정합니다.</p><p><strong>말하지 않는 것:</strong> Cut commit이 payload synchronization·execution 완료나 모든 load에서 zero hangover를 뜻하지 않습니다.</p></CitationBlock></div>
    </section>

    <section id="release" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">03 · 네트워크 흔들림과 회복</p><h2 className="mt-2 break-keep text-2xl font-bold">Cut 하나가 backlog를 가리켜도 왜 복구 시간이 0초는 아닐까요?</h2></header>
      <p>3초 동안 합의가 멈췄고 네 차선이 각각 자동차 20개씩 전진했다고 하겠습니다. 회복 뒤 cut 하나는 자동차 80개의 끝점을 한 번에 가리킬 수 있습니다. 합의 메시지는 자동차 80개에 비례해 커지지 않습니다.</p>
      <p>그러나 느린 노드는 자신에게 없는 차선 뒷부분을 받고, hash와 부모 연결을 확인하고, 결정된 순서로 실행해야 합니다. 들어오는 부하가 네트워크·디스크·실행 용량보다 크면 backlog는 계속 늘어납니다. cut이 빨리 커밋됐다는 사실만으로 모든 후유증이 사라졌다고 결론 내리면 안 됩니다.</p>
      <p>안전성 검사는 네트워크 속도와 관계없이 서로 충돌하는 cut이나 출력 순서가 생기지 않는지를 봅니다. 진행성과 매끄러운 회복 검사는 논문이 말하는 좋은 구간, 정상 주 노드, 부하가 처리 용량보다 낮다는 조건에서 cut이 다시 커밋되고 backlog가 줄어드는지를 봅니다. 네트워크 분할 중 정지는 허용되지만 서로 다른 결과의 확정은 허용되지 않습니다. 메시지 전달 상한이 회복된 뒤에도 계속 커밋하지 못하면 진행성 실패입니다.</p>
      <p>출시 전에는 같은 차선 위치에서 두 PoA가 생기는 경우, 빠른 경로 후보 직후 주 노드가 바뀌는 경우, 이전보다 낮은 위치가 섞인 cut, 여러 합의 slot이 함께 움직이는 경우를 재생해야 합니다. 각 차선에서 이미 커밋한 위치 이하를 버리고, slot 순서·suffix를 섞는 규칙·중복 제거를 적용했을 때 모든 정상 노드의 상태 digest가 같은지 확인합니다.</p>
      <p>클라이언트 성공은 cut 인증서만 보지 않고 payload hash 검증, 거래 순서 확정, 애플리케이션 상태 변경 영수증까지 포함해야 합니다. 실패 때는 아직 커밋되지 않은 로컬 제안과 캐시만 되돌립니다.</p>
      <div id="paper-autobahn"><CitationBlock source="Autobahn: Seamless high speed BFT" citeKey={3} href="https://arxiv.org/abs/2401.10369"><p><strong>문제:</strong> Partial-synchrony blip 뒤 traditional BFT hangover와 DAG BFT의 good-interval latency를 함께 줄여야 합니다.</p><p><strong>기여:</strong> Chained lanes, f+1 car PoA, certified-tip cuts와 low-latency view-based consensus를 결합합니다.</p><p><strong>전제:</strong> n=3f+1 authenticated replicas, static Byzantine adversary를 두고 safety에는 synchrony가 필요 없지만 liveness에는 good interval을 사용합니다.</p><p><strong>근거 범위:</strong> Autobahn protocol, correctness·seamlessness definitions와 paper evaluation입니다.</p><p><strong>말하지 않는 것:</strong> Legacy fixed timeout·BLS·TPS 숫자나 다른 deployment의 speedup을 보편값으로 주장하지 않습니다.</p></CitationBlock></div>
      <h3 className="text-xl font-semibold">이 글만으로 확인할 10가지</h3><p>기초 6문제는 lane/car/passenger/PoA/tip, honest-holder 하한, cut suffix, slow·fast thresholds, timeout relay·TC와 cut/실행 경계를 묻습니다. 심화 4문제는 PoA equivocation, fast-view recovery, non-monotonic duplicate 방지와 blip·backlog release suite를 설계하게 합니다.</p>
    </section>
  </article>;
}

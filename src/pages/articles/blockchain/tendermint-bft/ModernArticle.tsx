import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";
import { TendermintFailureTable, TendermintLockTraceViz, TendermintRoundViz } from "./viz/ModernTendermintViz";

export default function ModernTendermintArticle() {
  return <article className="space-y-14">
    <section id="overview" className="space-y-6">
      <header className="space-y-3"><p className="text-sm font-semibold text-primary">Tendermint · 블록 한 칸을 정하는 과정</p><h2 className="text-3xl font-bold tracking-tight">제안자가 계속 바뀌어도 어떻게 같은 블록 하나만 결정할까요?</h2></header>
      <p className="text-lg leading-8 text-foreground/90">
        Tendermint의 답은 간단합니다. 같은 블록에 먼저 1차 투표를 모아 잠금 근거를 만들고, 그 근거를 본 검증자들이 2차 투표를 보냅니다. 같은 라운드의 2차 투표가 전체 투표권의 3분의 2를 엄격히 넘을 때만 그 블록을 결정합니다. 제안자가 멈춰 라운드가 바뀌어도 잠금은 저절로 사라지지 않습니다.
      </p>
      <p>
        여기서 높이(<em>height</em>)는 지금 채울 블록 위치입니다. 라운드(<em>round</em>)는 그 위치를 채우지 못했을 때 제안자를 바꾸며 다시 시도한 횟수입니다. 단계(<em>step</em>)는 현재 제안, 1차 투표, 2차 투표 중 무엇을 기다리는지 나타냅니다. 먼저 블록 X가 height 120에 들어가는 한 번의 정상 흐름을 보겠습니다.
      </p>
      <TendermintRoundViz />
      <aside className="border-l-2 border-primary bg-primary/5 p-5 text-sm leading-6"><strong>한 문장 답:</strong> 1차 투표 정족수는 잠금을 만들거나 바꿀 근거이고, 2차 투표 정족수는 블록을 결정하는 근거입니다. 라운드 번호나 타임아웃만으로 잠금을 바꿀 수는 없습니다.</aside>
    </section>

    <section id="protocol" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">01 · 두 번의 투표</p><h2 className="mt-2 text-2xl font-bold">nil 투표는 빈 블록 결정이 아니라 “지금은 특정 블록을 지지하지 않는다”는 표입니다</h2></header>
      <p>제안 단계에서는 정해진 제안자가 블록을 보냅니다. 검증자는 제안이 애플리케이션 규칙에 맞고 자기 잠금과 충돌하지 않으면 그 블록에 1차 투표(<em>prevote</em>)합니다. 제안을 제때 받지 못했거나 제안이 잘못됐고 지켜야 할 잠긴 블록도 없다면 nil에 1차 투표합니다. nil은 빈 블록을 확정한다는 뜻이 아닙니다. 이번 라운드에서 특정 블록을 지지할 근거가 없다는 뜻입니다.</p>
      <p>같은 높이와 라운드에서 블록 B의 1차 투표가 전체 투표권의 3분의 2를 넘으면 B의 잠금 변경 증명(Proof of Lock Change, PoLC)이 생깁니다. 이 증거를 본 검증자는 B에 잠기고 B에 2차 투표(<em>precommit</em>)합니다. 같은 라운드의 B 2차 투표가 다시 3분의 2를 넘으면 B를 결정합니다. 서명에는 체인 ID, 높이, 라운드, 투표 종류와 블록 ID를 함께 묶어 다른 체인이나 단계의 표를 재사용하지 못하게 합니다.</p>
      <ExplainedFormula question="검증자마다 투표권이 다르면 3분의 2 초과를 어떻게 계산할까요?" idea={<>유효한 서명을 보낸 서로 다른 검증자의 투표권을 더합니다. 키 개수를 세거나 3분의 2를 반올림하지 않고, 양변에 3을 곱해 정수로 엄격하게 비교합니다.</>} formula={String.raw`3W_{signed}>2W_{total}`}
      annotatedFormula={String.raw`\underbrace{3W_{signed}}_{\text{서명 power×3}}>\underbrace{2W_{total}}_{\text{전체 power×2}}`}
      operations={[
          { expression: String.raw`3W_{signed}`, annotation: ["서로 다른 서명자의 투표권 합에 3을 곱합니다.","키가 80개여도 투표권 합이 60이면 부족합니다."] },
          { expression: String.raw`2W_{total}`, annotation: ["전체 투표권 합에 2를 곱합니다.","전체가 100이면 67은 201>200이라 통과하고, 66은 198이라 실패합니다."] },
        ]} terms={[{symbol:"W_{signed}",name:"서명한 투표권",description:"같은 체인·높이·라운드·투표 종류·블록 ID에 유효하게 서명한 서로 다른 검증자의 투표권 합입니다."},{symbol:"W_{total}",name:"전체 투표권",description:"그 높이에 적용되는 검증자 집합의 전체 투표권 합입니다."},{symbol:"3,2",name:"정수 비교",description:"소수점과 반올림 없이 3분의 2 초과를 판정하기 위해 양변에 곱하는 수입니다."}]} assumptions={["같은 검증자를 중복해서 세지 않습니다.","그 높이에 적용되는 검증자 집합과 투표권을 사용합니다.","서명, 체인 ID, 투표 종류, 높이·라운드와 블록 ID를 모두 검증합니다.","Byzantine 투표권은 전체의 3분의 1 미만이라고 가정합니다."]} interpretation="전체 투표권이 100이면 67은 통과하지만 66은 부족합니다. 이 계산은 검증자 수가 아니라 투표권 합을 셉니다." />
      <div id="paper-tendermint-original"><CitationBlock source="Jae Kwon — Tendermint: Consensus without Mining" citeKey={1} href="https://tendermint.com/static/docs/tendermint.pdf"><p><strong>문제:</strong> PoW mining 없이 blockchain ledger에 BFT finality를 제공합니다.</p><p><strong>기여:</strong> Partial synchrony와 1/3 미만 Byzantine power 아래 round-based blockchain consensus 초기 설계를 제시했습니다.</p><p><strong>전제와 범위:</strong> 2014 draft v0.6의 역사적 설계 근거이며 문서 자체가 outdated임을 밝힙니다. 현재 CometBFT wire·ABCI++·state transition의 정본으로 사용하지 않습니다.</p></CitationBlock></div>
    </section>

    <section id="locking" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">02 · 라운드를 건너는 잠금</p><h2 className="mt-2 text-2xl font-bold">새 제안이 왔다는 이유만으로 이전 블록을 버리면 두 결과가 생길 수 있습니다</h2></header>
      <p>PoLC는 같은 높이와 라운드에서 특정 블록 또는 nil에 모인 3분의 2 초과 1차 투표 묶음입니다. 검증자가 0라운드에서 A의 PoLC를 보고 A에 잠겼다면, 1라운드 제안자가 근거 없이 B를 보내도 A를 지킵니다. B로 바꾸려면 기존 잠금 라운드보다 높고 현재 라운드보다 낮은 B의 PoLC를 실제 표와 함께 확인해야 합니다.</p>
      <TendermintLockTraceViz />
      <p>왜 이렇게 복잡한가요? 한 블록이 이미 결정되었다면 그 2차 투표 정족수와 충돌 블록의 1차 투표 정족수는 정직한 투표권을 공유해야 합니다. 정직한 검증자가 정당한 더 높은 근거 없이는 잠금을 바꾸지 않으므로 충돌 블록이 다시 정족수를 얻는 길이 막힙니다. 반대로 아직 결정되지 않고 잠금만 갈라졌다면, 더 높은 라운드의 PoLC를 전달해 오래된 잠금을 안전하게 한쪽으로 모을 수 있습니다.</p>
      <div id="paper-cometbft-consensus"><CitationBlock source="CometBFT v0.38.25 Specification — Byzantine Consensus Algorithm" citeKey={2} href="https://github.com/cometbft/cometbft/blob/v0.38.25/spec/consensus/consensus.md"><p><strong>문제:</strong> 높이·라운드·단계마다 제안, 1차·2차 투표, 결정과 라운드 전환 조건을 구현 가능한 상태 기계로 규정합니다.</p><p><strong>기여:</strong> 3분의 2 초과, PoLC, 잠금 변경, 공통 종료 조건과 타임아웃의 의미를 명시합니다.</p><p><strong>전제와 범위:</strong> v0.38.25 태그의 규격입니다. 다른 버전의 코드 경로와 같다고 가정하지 않습니다.</p></CitationBlock></div>
    </section>

    <section id="comparison" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">03 · 느린 네트워크와 운영 경계</p><h2 className="mt-2 text-2xl font-bold">충돌을 막는 조건과 계속 진행하는 조건은 다릅니다</h2></header>
      <p>부분 동기 네트워크에서는 언젠가 통신 지연이 일정 범위 안으로 들어오지만, 그 시점(GST)과 지연 상한을 미리 알 수 없습니다. 그전에는 여러 라운드가 연속으로 타임아웃되어도 이상하지 않습니다. 이때 지켜야 할 것은 서로 충돌하는 두 블록을 결정하지 않는 안전성입니다. 통신이 안정된 뒤에는 충분한 정직한 투표권이 온라인이고 유효한 제안이 제때 전달되면 1차·2차 투표 정족수가 생겨 다시 진행할 수 있습니다.</p>
      <p>타임아웃을 너무 짧게 잡으면 정상적인 지연에도 제안자가 자주 바뀝니다. 너무 길게 잡으면 실제 장애를 발견한 뒤 오래 기다립니다. 라운드가 오를수록 타임아웃을 늘리는 방식은 알 수 없는 지연 상한을 찾아가는 운영 전략입니다. 그러나 전체 투표권의 3분의 1 이상이 오프라인이면 3분의 2 초과 표를 만들 수 없어 체인이 멈춥니다. 멈춤은 허용되지만 충돌 결정은 없어야 합니다.</p>
      <TendermintFailureTable />
      <p>Tendermint 합의 알고리즘, CometBFT 프로그램, ABCI++ 애플리케이션은 같은 층이 아닙니다. 합의가 블록 순서를 정해도 애플리케이션의 비결정적 계산이나 외부 결제를 자동으로 한 번만 실행하게 만들지는 않습니다. 배포한 버전의 합의 규칙과 모든 노드의 상태 해시가 같은지 확인하고, 외부 효과는 outbox나 멱등성 영수증으로 따로 관리해야 합니다.</p>
    </section>
  </article>;
}

import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";
import { Hotstuff2CommitViz, Hotstuff2EntryDecisionViz, Hotstuff2EntryViz, Hotstuff2FailureTable } from "./viz/ModernHotstuff2Viz";

export default function ModernHotstuff2Article() {
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-6">
        <header className="space-y-3">
          <p className="text-sm font-semibold text-primary">HotStuff-2 · HotStuff 다음의 질문</p>
          <h2 className="text-3xl font-bold tracking-tight">합의 단계를 줄이면서도 매 view마다 Δ를 기다리지 않을 수 있을까요?</h2>
        </header>
        <p className="text-lg leading-8 text-foreground/90">
          앞 글의 HotStuff는 바로 앞 부모를 가리키는 QC가 세 번 이어져야 가장 오래된 블록을 커밋했습니다. HotStuff-2는 한 view에서 같은 블록을 두 번 확인하는 방식으로 이 경로를 줄입니다. Alice의 송금을 담은 B20이 첫 인증서와 이중 인증서를 거쳐 다음 view에서 커밋되는 과정을 먼저 따라가겠습니다.
        </p>
        <Hotstuff2CommitViz />
        <aside className="border-l-2 border-primary bg-primary/5 p-5 text-sm leading-6">
          <strong>먼저 기억할 한 문장:</strong> HotStuff-2의 빠른 경로는 직전 view의 이중 인증서가 있을 때만 열립니다. 그 증거가 없으면 안전 규칙을 줄이는 대신 모든 정상 lock이 도착할 시간을 기다립니다.
        </aside>
      </section>

      <section id="two-phase" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">01 · 두 번의 정족수 확인</p>
          <h2 className="mt-2 text-2xl font-bold">첫 인증서는 블록을, 이중 인증서는 그 인증서를 다시 확인합니다</h2>
        </header>
        <p>
          View 20의 주 노드는 B20을 제안하고 첫 번째 표를 모읍니다. 서로 다른 복제본 3대의 표가 모이면 C20(B20)이 됩니다. 주 노드는 이 인증서를 prepare 메시지로 방송합니다. 이를 검증한 복제본은 B20을 잠그고 C20(B20)에 대한 두 번째 표를 view 21의 주 노드에게 보냅니다.
        </p>
        <p>
          두 번째 표 3개가 모이면 C20(C20(B20))이 됩니다. 이중 인증서는 직전 view에서 B20이 두 번의 정족수 확인을 통과했다는 뜻입니다. View 21의 주 노드는 이 증거를 받아 별도의 Δ 대기 없이 B20을 잇는 B21을 제안할 수 있습니다. 복제본은 제안에 담긴 이중 인증서가 가리키는 B20을 커밋합니다.
        </p>
        <ExplainedFormula
          question="n=3t+1에서 블록 인증서와 이중 인증서에는 각각 몇 표가 필요합니까?"
          idea={<>두 단계 모두 서로 다른 복제본 2t+1곳의 표를 요구합니다. 정족수 두 개는 적어도 t+1곳에서 겹치므로, 최대 t곳이 잘못돼도 정상 복제본이 하나 이상 교집합에 남습니다.</>}
          formula={String.raw`|Q_1|\ge 2t+1,\quad |Q_2|\ge 2t+1`}
          annotatedFormula={String.raw`\underbrace{|Q_1|\ge 2t+1}_{\text{블록에 대한 첫 표}}\qquad\underbrace{|Q_2|\ge 2t+1}_{\text{인증서에 대한 두 번째 표}}`}
          operations={[
            { expression: "n=3t+1", annotation: ["전체 복제본 수와 허용할 Byzantine fault 수의 관계입니다.", "n=4라면 t=1입니다."] },
            { expression: "2t+1=3", annotation: ["B20의 첫 인증서에 서로 다른 표 3개가 필요합니다.", "이중 인증서에도 두 번째 표 3개가 필요합니다."] },
            { expression: String.raw`|Q_a\cap Q_b|\ge t+1`, annotation: ["크기 2t+1인 두 집합은 최소 t+1곳에서 겹칩니다.", "t=1이면 두 곳이 겹치고 정상 복제본이 적어도 한 곳 남습니다."] },
          ]}
          terms={[
            { symbol: "Q₁", name: "첫 번째 표 집합", description: "같은 B20과 view 20을 인증하는 서로 다른 복제본의 표입니다." },
            { symbol: "Q₂", name: "두 번째 표 집합", description: "검증된 C20(B20)을 다시 인증하는 서로 다른 복제본의 표입니다." },
            { symbol: "t", name: "Byzantine fault 상한", description: "3t+1대 가운데 임의로 잘못 행동할 수 있는 최대 복제본 수입니다." },
          ]}
          assumptions={[
            "같은 복제본의 중복 표를 한 번만 세고 위원회 구성을 고정합니다.",
            "표가 가리키는 view, 블록 해시와 인증서 도메인을 모두 검증합니다.",
            "복제본은 같은 view의 같은 단계에서 충돌한 두 값에 투표하지 않습니다.",
            "인증서는 블록 본문 저장이나 애플리케이션 실행 완료를 뜻하지 않습니다.",
          ]}
          interpretation="n=4, t=1에서는 첫 표 3개로 C20(B20)을 만들고, 두 번째 표 3개로 C20(C20(B20))을 만듭니다. 같은 숫자를 두 번 센다고 해서 두 인증서의 의미가 같은 것은 아닙니다."
        />
        <div id="paper-hotstuff2-steady">
          <CitationBlock source="HotStuff-2 §4 · View Protocol" citeKey={1} href="https://eprint.iacr.org/2023/397.pdf#page=4">
            <p><strong>문제:</strong> 부분 동기 네트워크에서 선형 통신을 유지하면서 한 view의 합의를 두 단계로 구성해야 합니다.</p>
            <p><strong>기여:</strong> 블록 인증서, 이중 인증서, 잠금 갱신과 다음 주 노드로 보내는 vote2 절차를 정의합니다.</p>
            <p><strong>전제:</strong> 인증된 복제본 3t+1대, 최대 t개의 Byzantine fault, threshold signature와 부분 동기 모델을 사용합니다.</p>
            <p><strong>근거 범위:</strong> 논문 Figure 1의 steady-state view protocol과 정족수 규칙입니다.</p>
            <p><strong>말하지 않는 것:</strong> 인증서 두 개만 있으면 블록 본문 저장과 상태 실행까지 자동으로 완료된다는 뜻은 아닙니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="view-sync" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">02 · 두 가지 view 진입</p>
          <h2 className="mt-2 text-2xl font-bold">직전 view의 증거가 없을 때는 표의 수보다 도착 시간을 확인합니다</h2>
        </header>
        <Hotstuff2EntryViz />
        <p>
          느린 진입 경로를 잠금 보고서 2t+1개로 상태 인증서를 만들어 방송하는 방식으로 이해하면 안 됩니다. 그런 보고서 묶음을 모든 복제본에게 보내면 한 view의 전달량이 O(n²)으로 커집니다. HotStuff-2는 주 노드가 Ppc + Δ를 기다려 모든 정상 복제본의 잠금 보고가 도착하도록 한 뒤, 그중 가장 높은 인증서 하나만 제안에 넣습니다.
        </p>
        <p>
          Ppc는 pacemaker가 정상 복제본을 같은 view로 모으는 데 허용하는 시간 차이입니다. 논문이 예로 든 RareSync와 Lewis-Pye 계열에서는 Ppc = 2Δ로 둡니다. GST 전에는 이 시간이 실제 전달을 보장하지 않으므로 진행이 멈출 수 있습니다. 그러나 어떤 경우에도 복제본은 제안의 인증서가 자신의 lock보다 낮으면 투표하지 않습니다.
        </p>
        <Hotstuff2EntryDecisionViz />
        <div id="paper-hotstuff2-pacemaker">
          <CitationBlock source="HotStuff-2 §4 · Pacemaker and view entry" citeKey={2} href="https://eprint.iacr.org/2023/397.pdf#page=5">
            <p><strong>문제:</strong> 이전 주 노드가 실패했을 때 숨은 높은 lock을 놓치지 않으면서 정상 주 노드가 이어지는 경로는 매번 Δ를 기다리지 않아야 합니다.</p>
            <p><strong>기여:</strong> 직전 view의 이중 인증서를 이용한 빠른 진입과 Ppc+Δ를 기다리는 느린 진입을 구분합니다.</p>
            <p><strong>전제:</strong> GST 뒤 메시지 지연 상한 Δ와 pacemaker가 보장하는 view 진입 시간 차이 Ppc를 사용합니다.</p>
            <p><strong>근거 범위:</strong> 논문 Figure 2의 pacemaker와 §4.1의 지연·통신량 분석입니다.</p>
            <p><strong>말하지 않는 것:</strong> 첫 2t+1개 잠금 보고만으로 모든 정상 복제본의 가장 높은 lock을 알 수 있다는 뜻은 아닙니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="release" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">03 · 확인 경계</p>
          <h2 className="mt-2 text-2xl font-bold">빠른 경로와 복구 경로를 따로 재고, 블록 실행은 마지막에 확인합니다</h2>
        </header>
        <p>
          두 단계라는 말만으로 실제 지연을 단정할 수는 없습니다. 정상 주 노드가 이어져 직전 view의 이중 인증서를 받는 경우와, 이전 주 노드가 실패해 Ppc+Δ를 기다리는 경우를 나눠야 합니다. 메시지 수뿐 아니라 인증자 수, 블록 본문 바이트, 서명 검증과 timeout certificate 비용도 따로 기록해야 합니다.
        </p>
        <p>
          재시작한 복제본은 가장 높은 인증서와 이중 인증서, 현재 lock, view와 마지막 실행 위치를 복구해야 합니다. 인증서만 남고 B20 본문이나 부모 블록이 없다면 해시를 따라 빠진 블록을 받은 뒤 실행합니다. 클라이언트에게 결과를 내기 전 같은 순서의 상태 전이가 같은 결과를 만드는지도 확인해야 합니다.
        </p>
        <h3 className="text-xl font-semibold">틀리기 쉬운 네 경계</h3>
        <Hotstuff2FailureTable />
        <div id="paper-hotstuff2">
          <CitationBlock source="HotStuff-2: Optimal Two-Phase Responsive BFT · ePrint 2023/397" citeKey={3} href="https://eprint.iacr.org/2023/397">
            <p><strong>문제:</strong> 두 단계의 optimistic latency, 선형 정상 경로 통신, responsiveness와 제곱 최악 통신량을 함께 달성해야 합니다.</p>
            <p><strong>기여:</strong> 두 단계 합의와 직전 view의 이중 인증서 여부를 이용하는 pacemaker를 하나의 프로토콜로 제시합니다.</p>
            <p><strong>전제:</strong> 부분 동기 네트워크, 인증된 복제본 3t+1대, threshold signature와 논문이 정의한 pacemaker를 사용합니다.</p>
            <p><strong>근거 범위:</strong> 논문의 프로토콜, 안전성·진행 증명과 점근적 통신량 분석입니다.</p>
            <p><strong>말하지 않는 것:</strong> 모든 view가 기다림 없이 진행되거나 제3자 구현의 성능과 복구가 검증됐다는 뜻은 아닙니다.</p>
          </CitationBlock>
        </div>
      </section>
    </article>
  );
}

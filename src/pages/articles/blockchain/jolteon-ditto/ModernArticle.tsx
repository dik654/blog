import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";
import { DittoFallbackViz, JolteonDittoFailureTable, JolteonPathViz, JolteonTimeoutViz } from "./viz/ModernJolteonDittoViz";

export default function ModernJolteonDittoArticle() {
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-6">
        <header className="space-y-3">
          <p className="text-sm font-semibold text-primary">Jolteon·Ditto · HotStuff-2 다음의 질문</p>
          <h2 className="text-3xl font-bold tracking-tight">주 노드가 멈춰도 안전한 가지를 찾고, 네트워크가 오래 불안정하면 다른 합의 경로로 넘어갈 수 있을까요?</h2>
        </header>
        <p className="text-lg leading-8 text-foreground/90">
          앞 글의 HotStuff-2는 직전 view의 이중 인증서가 없으면 시간 경계를 기다렸습니다. Jolteon은 다른 선택을 합니다. 정상 round에서는 연속된 인증 블록 두 개로 커밋하고, 주 노드가 멈춘 round에서는 timeout 2f+1개에 담긴 가장 높은 QC를 다음 제안의 안전 하한으로 사용합니다. 먼저 Alice의 요청을 담은 B10이 정상 경로에서 커밋되는 과정을 보겠습니다.
        </p>
        <JolteonPathViz />
        <aside className="border-l-2 border-primary bg-primary/5 p-5 text-sm leading-6">
          <strong>먼저 기억할 한 문장:</strong> Jolteon의 TC는 커밋 증거가 아니고, Ditto의 MVBA 결정도 곧바로 클라이언트에게 결과를 보내도 된다는 증거가 아닙니다.
        </aside>
      </section>

      <section id="jolteon-path" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">01 · 정상 round</p>
          <h2 className="mt-2 text-2xl font-bold">직접 이어진 연속 round의 인증 블록 두 개가 필요합니다</h2>
        </header>
        <p>
          B10의 표는 round 11의 주 노드에게 모이고 QC10이 됩니다. Round 11의 제안 B11이 QC10을 부모 인증서로 사용하면 복제본은 qchigh를 QC10까지 올리고 B11에 투표합니다. QC11이 만들어져 B10과 B11이 모두 인증되면, 두 블록이 직접 이어지고 round도 10·11로 연속인지 확인한 뒤 B10과 그 조상을 커밋합니다.
        </p>
        <ExplainedFormula
          question="n=4, f=1에서 QC는 몇 표가 필요하고, two-chain은 무엇을 확인합니까?"
          idea={<>QC에는 서로 다른 복제본 2f+1곳의 표가 필요합니다. 커밋할 때는 인증 블록이 두 개라는 사실만 보지 않고, 두 블록이 부모·자식이며 round가 정확히 하나 차이 나는지도 확인합니다.</>}
          formula={String.raw`|QC_r|\ge 2f+1,\qquad B_{r+1}.parent=QC_r.block`}
          annotatedFormula={String.raw`\underbrace{|QC_r|\ge 2f+1}_{\text{같은 블록에 대한 정족수}}\qquad\underbrace{B_{r+1}.parent=QC_r.block}_{\text{직접 이어진 연속 round}}`}
          operations={[
            { expression: "n=3f+1", annotation: ["n=4이면 f=1입니다.", "잘못 행동할 수 있는 복제본은 최대 한 대입니다."] },
            { expression: "2f+1=3", annotation: ["B10의 QC에 서로 다른 표 3개가 필요합니다.", "B11의 QC에도 같은 수의 표가 필요합니다."] },
            { expression: "B11.round=B10.round+1", annotation: ["Round 10과 11이 연속이어야 합니다.", "높이만 인접하거나 round를 건너뛴 블록은 two-chain이 아닙니다."] },
          ]}
          terms={[
            { symbol: "QCᵣ", name: "Round r의 블록 인증서", description: "같은 round와 블록에 대한 서로 다른 2f+1개 표입니다." },
            { symbol: "qchigh", name: "가장 높은 QC", description: "복제본이 지금까지 확인한 가장 높은 인증서이며 Jolteon의 one-chain lock 상태입니다." },
            { symbol: "Bᵣ₊₁", name: "다음 round의 블록", description: "정상 경로에서는 직전 round QC의 블록을 직접 이어야 합니다." },
          ]}
          assumptions={[
            "위원회, epoch, round, 블록 해시와 서로 다른 서명자를 검증합니다.",
            "복제본은 같은 round에서 충돌한 두 블록에 투표하지 않습니다.",
            "부모 관계와 연속 round 조건을 모두 확인합니다.",
            "커밋 인증과 애플리케이션 실행 결과는 별도로 확인합니다.",
          ]}
          interpretation="n=4, f=1이면 B10과 B11의 QC에 각각 표 3개가 필요합니다. QC10을 직접 잇는 round 11의 B11이 인증되어야 B10을 커밋할 수 있습니다."
        />
      </section>

      <section id="timeout-path" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">02 · 장애 round</p>
          <h2 className="mt-2 text-2xl font-bold">Timeout certificate는 다음 제안이 내려갈 수 없는 선을 정합니다</h2>
        </header>
        <JolteonTimeoutViz />
        <p>
          주 노드가 멈추면 각 복제본은 round와 qchigh를 담은 timeout 메시지를 모든 복제본에게 보냅니다. 같은 round의 timeout 2f+1개가 모이면 TC가 됩니다. 다음 주 노드는 TC에 들어 있는 QC 가운데 가장 높은 것을 선택하고, 그 블록을 잇는 제안과 TC 전체를 함께 보냅니다. 그래서 정상 round의 통신은 선형이지만 장애 뒤 view 변경 제안은 O(n) 크기이고 전체 전달량은 O(n²)이 됩니다.
        </p>
        <p>
          TC와 QC의 정족수는 같지만 역할은 다릅니다. QC는 한 블록이 투표 정족수를 얻었다는 증거이고, TC는 장애 round 뒤 새 제안이 TC 안의 가장 높은 QC보다 낮아질 수 없게 하는 증거입니다. TC만 보고 블록을 커밋하거나, TC에서 임의의 낮은 QC를 골라 제안하면 안전 규칙을 잃습니다.
        </p>
        <div id="paper-jolteon">
          <CitationBlock source="Jolteon and Ditto §3 · Figure 2" citeKey={1} href="https://arxiv.org/pdf/2106.10362#page=5">
            <p><strong>문제:</strong> HotStuff 계열의 커밋 지연을 줄이면서 장애 round 뒤에도 안전한 제안의 부모를 골라야 합니다.</p>
            <p><strong>기여:</strong> One-chain lock, two-chain commit과 2f+1개 qchigh를 담은 timeout certificate 투표 규칙을 정의합니다.</p>
            <p><strong>전제:</strong> 인증된 복제본 n=3f+1대, 최대 f개의 Byzantine fault, threshold signature와 부분 동기 pacemaker를 사용합니다.</p>
            <p><strong>근거 범위:</strong> 논문 Figure 2의 Jolteon 정상 경로와 pacemaker, §3.1의 통신량 분석입니다.</p>
            <p><strong>말하지 않는 것:</strong> TC가 커밋 인증서이거나 높이가 인접한 임의의 두 블록이 two-chain을 만든다는 뜻은 아닙니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="ditto-fallback" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">03 · 비동기 fallback</p>
          <h2 className="mt-2 text-2xl font-bold">Ditto는 잠금 상태를 검증한 후보만 MVBA에 넣습니다</h2>
        </header>
        <p>
          부분 동기 프로토콜은 GST 전의 긴 비동기 구간에서 안전하게 멈출 수 있습니다. Ditto는 같은 view의 timeout 2f+1개가 모이면 Jolteon의 pacemaker 대신 비동기 fallback을 엽니다. 그러나 timeout 직후 바로 합의를 시작하지는 않습니다. 각 복제본이 qchigh를 담은 proof를 전파하고, 상대가 이를 확인하거나 더 높은 QC를 돌려주는 과정이 먼저 필요합니다.
        </p>
        <DittoFallbackViz />
        <p>
          MVBA의 상태 의존 유효성 검사는 후보의 view, 부모 QC의 view, 연속 round와 proof를 함께 확인합니다. MVBA가 블록 B를 결정하면 복제본은 B와 그 조상을 커밋하고 B의 표를 다시 전파합니다. 그다음 fallback 표시를 내리고 B가 인증될 때까지 기다려야 정상 경로로 돌아갈 수 있습니다.
        </p>
        <div id="paper-jolteon-ditto">
          <CitationBlock source="Jolteon and Ditto §4 · Figure 3" citeKey={2} href="https://arxiv.org/abs/2106.10362">
            <p><strong>문제:</strong> 정상 네트워크에서는 선형 통신을 유지하면서 긴 비동기 구간과 주 노드 공격에서도 진행 가능성을 확보해야 합니다.</p>
            <p><strong>기여:</strong> Jolteon 정상 경로와 상태 의존 MVBA를 사용하는 비동기 fallback을 한 안전 상태 위에서 연결합니다.</p>
            <p><strong>전제:</strong> 인증된 복제본 n=3f+1대, 최대 f개의 Byzantine fault와 무작위성을 사용하는 MVBA의 합의·유효성·종료 조건을 사용합니다.</p>
            <p><strong>근거 범위:</strong> 논문 Figure 3의 fallback 상태 전이와 §4의 안전성·통신량 분석입니다.</p>
            <p><strong>말하지 않는 것:</strong> 네트워크 상태를 예측해 더 빠른 경로를 고르거나, MVBA의 결정만으로 애플리케이션 실행과 외부 결과 전달까지 끝난다는 뜻은 아닙니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="release" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">04 · 확인 경계</p>
          <h2 className="mt-2 text-2xl font-bold">논문의 프로토콜과 고정한 제품 코드를 같은 구현으로 부르지 않습니다</h2>
        </header>
        <p>
          논문은 비동기 fallback 구현과 평가가 오래되었고 Jolteon 및 Ditto의 동기 경로 구현은 최신이라고 직접 적고 있습니다. 따라서 논문의 통신량·진행 증명과 당시 실험 수치를 분리해야 합니다. 실제 적용을 검토할 때는 정상 경로, timeout, fallback 진입, MVBA 결정, 결정 블록 재인증과 재시작을 같은 버전에서 다시 측정해야 합니다.
        </p>
        <p>
          Aptos 코드는 비교용으로 <code>aptos-node-v1.48.6</code> 태그를 고정합니다. 이 버전의 round manager에는 Proposal, Vote, QC, TwoChainTimeoutCertificate와 OrderVote 처리 경로가 있습니다. 이 사실만으로 해당 코드가 논문 Ditto의 state-aware MVBA fallback을 그대로 구현한다고 결론내리지 않습니다. 2026년 11월에는 더 새로운 release가 존재하므로, v1.48.6을 현재 최신 코드라고 부르지도 않습니다.
        </p>
        <h3 className="text-xl font-semibold">자주 섞이는 다섯 경계</h3>
        <JolteonDittoFailureTable />
        <div id="paper-aptos-round-v1486">
          <CitationBlock source="Aptos Core · aptos-node-v1.48.6 round_manager.rs" citeKey={3} type="code" href="https://github.com/aptos-labs/aptos-core/blob/aptos-node-v1.48.6/consensus/src/round_manager.rs">
            <p><strong>문제:</strong> 고정한 Aptos release에서 실제로 어떤 합의 메시지와 처리 함수가 연결되는지 확인해야 합니다.</p>
            <p><strong>기여:</strong> ProposalMsg, VoteMsg, RoundTimeoutMsg, OrderVoteMsg와 TwoChainTimeoutCertificate를 검증·처리하는 이벤트 경로를 제공합니다.</p>
            <p><strong>전제:</strong> 태그 <code>aptos-node-v1.48.6</code>과 commit <code>e9051e97994eb73b18c185268953efa68586f9fa</code>를 고정합니다.</p>
            <p><strong>근거 범위:</strong> 이 태그의 round manager와 직접 연결된 합의 메시지 처리 경계입니다.</p>
            <p><strong>말하지 않는 것:</strong> 이 파일이 논문 Ditto의 MVBA fallback을 그대로 구현하거나 현재 최신 Aptos 합의 전체를 대표한다는 뜻은 아닙니다.</p>
          </CitationBlock>
        </div>
      </section>
    </article>
  );
}

import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";
import { GpbftBoundaryViz, GpbftRecoveryViz, GpbftTraceViz } from "./viz/ModernGpbftViz";

export default function ModernGossipBftArticle() {
  return <article className="space-y-14">
    <section id="overview" className="scroll-mt-24 space-y-6">
      <header className="space-y-3">
        <p className="text-sm font-semibold text-primary">Power-weighted BFT · 한 chain 제안 추적</p>
        <h2 className="text-3xl font-bold tracking-tight">메시지를 받은 것과 같은 chain을 결정한 것은 다릅니다</h2>
      </header>
      <p className="text-lg leading-8 text-foreground/90">
        Alice→Bob 거래를 포함한 ECChain P가 제안됐다고 하겠습니다. Gossipsub은 P에 관한 표를 빠르게 퍼뜨리지만 일부 메시지를 놓칠 수 있습니다. GossiPBFT는 받은 메시지를 바로 세지 않고, 같은 합의 instance에 속한 유효한 표만 power로 집계해 P의 decision certificate를 만듭니다.
      </p>
      <GpbftTraceViz />
      <p>
        이 글이 답할 질문은 하나입니다. <strong>메시지가 빠질 수 있는 전파망 위에서 power가 서로 다른 참가자들이 어떻게 같은 ECChain을 결정하는가?</strong> 답은 vote domain 검증, 올림한 2/3 정족수, phase별 justification, bottom을 통한 다음 round 전환, DECIDE 정족수의 조합입니다.
      </p>
      <aside className="border-l-2 border-primary pl-5 text-sm leading-6 text-muted-foreground">
        <strong className="text-foreground">먼저 구분할 것:</strong> FIP의 프로토콜 이름은 GossiPBFT이고, 현재 Go 구현의 package 이름은 <code>gpbft</code>입니다. 이 글은 그 합의 핵심만 다룹니다. EC proposal의 유효성, certificate chain 동기화, 확정된 prefix를 EC fork choice에 반영하는 과정은 Expected Consensus와 Filecoin F3 글에서 이어집니다.
      </aside>
    </section>

    <section id="quorum" className="scroll-mt-24 space-y-6">
      <header>
        <p className="text-sm font-semibold text-primary">01 · weighted strong quorum</p>
        <h2 className="mt-2 text-2xl font-bold">총 power가 120이면 80부터 정족수입니다</h2>
      </header>
      <p>
        GossiPBFT는 참가자 수가 아니라 같은 power table에 기록된 합의 power를 셉니다. FIP-0086은 strong quorum을 <code>ceil(2W/3)</code> 이상으로 정의하고, go-f3 v0.8.15도 같은 정수식을 사용합니다. 따라서 W=120일 때 80은 실패가 아니라 정확히 통과하는 값입니다.
      </p>
      <ExplainedFormula
        question="두 strong quorum이 왜 정직한 power를 하나 이상 공유합니까?"
        idea={<>각 signer 집합의 power를 더한 뒤 전체 W를 빼면 교집합의 하한이 남습니다. W=120에서는 80짜리 두 정족수가 최소 40만큼 겹칩니다. Byzantine power가 40보다 작다면 그 교집합 전체가 Byzantine일 수 없습니다.</>}
        formula={String.raw`q(W)=\left\lceil\frac{2W}{3}\right\rceil,\qquad w(Q_1\cap Q_2)\ge q_1+q_2-W`}
        annotatedFormula={String.raw`\underbrace{q(120)}_{\text{strong quorum}}=\underbrace{80}_{\lceil 240/3\rceil},\qquad \underbrace{w(Q_1\cap Q_2)}_{\text{양쪽에 포함된 power}}\ge\underbrace{80+80-120}_{40}`}
        operations={[
          { expression: String.raw`q(120)=\lceil 80\rceil=80`, annotation: ["2×120을 3으로 나눕니다.", "나머지가 있으면 올림합니다.", "120은 나누어떨어져 80입니다."] },
          { expression: String.raw`80+80-120=40`, annotation: ["Q₁=A+B+C=80", "Q₂=D+B+C=80", "교집합 B+C의 power는 40입니다."] },
          { expression: String.raw`w(B)<40`, annotation: ["Byzantine power를 1/3 미만으로 둡니다.", "40짜리 교집합을 모두 차지할 수 없으므로", "정직한 power가 양쪽에 포함됩니다."] },
        ]}
        terms={[
          { symbol: "W", name: "total committee power", description: "해당 instance에 고정된 power table의 전체 합입니다." },
          { symbol: "q(W)", name: "strong quorum threshold", description: "2W/3을 정수로 올림한 최소 통과 power입니다." },
          { symbol: "Q₁,Q₂", name: "signer sets", description: "같은 vote domain에서 서로 충돌할 수 있는 두 signer 집합입니다." },
          { symbol: "w(Q₁∩Q₂)", name: "intersection power", description: "두 집합에 모두 들어 있는 distinct signers의 power 합입니다." },
        ]}
        assumptions={[
          "Byzantine committee power는 W/3보다 작습니다.",
          "두 집합은 같은 network·instance·phase context와 같은 power table에서 검증됩니다.",
          "같은 sender는 한 번만 세고 signature와 chain value를 먼저 검증합니다.",
          "정직한 참가자는 phase별 voting rule과 justification rule을 지킵니다.",
        ]}
        interpretation="A=40, B=25, C=15, D=40이면 Q₁={A,B,C}와 Q₂={D,B,C}는 모두 80입니다. 두 집합은 B+C=40에서 겹칩니다. 이 산술은 필요한 교집합을 보이며, 실제 safety에는 정직한 참가자의 phase 규칙도 함께 필요합니다."
      />
      <pre className="overflow-x-auto border border-border bg-muted/20 p-4 text-sm leading-6"><code>{`// part가 strong quorum에 도달했는지 판정합니다.
func IsStrongQuorum(part int64, whole int64) bool {
    // 2×whole을 3으로 나눈 값을 올림해 최소 통과 power를 구합니다.
    return part >= divCeil(2*whole, 3)
}`}</code></pre>
      <p>
        수신량과 집계량도 구분해야 합니다. A의 같은 서명 메시지를 두 번 받아도 power 40은 한 번만 더합니다. 현재 구현의 quorum state는 sender를 먼저 중복 제거한 뒤 value별 power를 누적합니다. 다른 instance나 phase의 올바른 서명도 현재 정족수에는 넣지 않습니다.
      </p>
      <div id="paper-fip86-gpbft"><CitationBlock source="FIP-0086 — GossiPBFT Consensus · revision 1bec05f" citeKey={1} href="https://github.com/filecoin-project/FIPs/blob/1bec05ffc8cfdf03bc2ba3c404cd3d1c3170caf7/FIPS/fip-0086.md">
        <p><strong>문제:</strong> Filecoin의 power-weighted committee가 EC-compatible chain prefix를 빠르게 결정해야 합니다.</p>
        <p><strong>기여:</strong> Strong quorum, QUALITY·CONVERGE·PREPARE·COMMIT·DECIDE, best-effort broadcast와 partial-synchrony 조건을 규정합니다.</p>
        <p><strong>전제:</strong> Byzantine QAP가 1/3 미만이고 committee·base chain·network·instance가 고정됩니다.</p>
        <p><strong>근거 범위:</strong> 2025-06-24 revision <code>1bec05f</code>의 프로토콜 명세입니다.</p>
        <p><strong>말하지 않는 것:</strong> Gossipsub exactly-once 전달, 고정된 완료 시간이나 현재 Go API 전체를 보장하지 않습니다.</p>
      </CitationBlock></div>
    </section>

    <section id="phases" className="scroll-mt-24 space-y-6">
      <header>
        <p className="text-sm font-semibold text-primary">02 · round와 phase</p>
        <h2 className="mt-2 text-2xl font-bold">QUALITY와 CONVERGE는 연속 단계가 아니라 서로 다른 round의 입구입니다</h2>
      </header>
      <p>
        Round 0은 <strong>QUALITY → PREPARE → COMMIT</strong>으로 갑니다. Round 1 이상은 QUALITY를 반복하지 않고 <strong>CONVERGE → PREPARE → COMMIT</strong>으로 갑니다. DECIDE는 round loop 바깥에 있습니다. 따라서 다섯 이름을 한 줄의 고정 시간표처럼 외우면 실제 분기와 evidence 관계를 놓칩니다.
      </p>
      <div className="not-prose grid gap-px bg-border p-px text-center text-sm sm:grid-cols-[1fr_auto_1fr]">
        <div className="bg-background p-5"><p className="text-xs font-bold text-primary">ROUND 0</p><p className="mt-3 font-black">QUALITY → PREPARE → COMMIT</p><p className="mt-2 text-xs leading-5 text-muted-foreground">입력 chain의 prefix 후보를 좁힙니다.</p></div>
        <div className="flex items-center justify-center bg-background px-4 py-2 font-bold text-primary">또는</div>
        <div className="bg-background p-5"><p className="text-xs font-bold text-primary">ROUND 1+</p><p className="mt-3 font-black">CONVERGE → PREPARE → COMMIT</p><p className="mt-2 text-xs leading-5 text-muted-foreground">Ticket과 이전 evidence로 proposal을 다시 맞춥니다.</p></div>
      </div>
      <p>
        Phase를 넘기는 핵심은 시간 경과가 아니라 evidence입니다. Round 0 PREPARE와 bottom COMMIT처럼 명세가 evidence를 요구하지 않는 예외를 빼면, 현재 메시지에는 허용된 이전 phase의 strong quorum justification이 있어야 합니다. Justification은 그 phase의 원본 메시지를 모두 받지 못한 참가자도 같은 aggregate evidence를 검증하고 진행하게 합니다.
      </p>
      <pre className="overflow-x-auto border border-border bg-muted/20 p-4 text-sm leading-6"><code>{`// Evidence 없이도 유효할 수 있는 세 경우를 먼저 적습니다.
needsJustification := !(
    // QUALITY는 candidate support를 처음 알리는 phase입니다.
    msg.Vote.Phase == QUALITY_PHASE ||
    // Round 0 PREPARE는 앞선 round evidence가 없습니다.
    (msg.Vote.Phase == PREPARE_PHASE && msg.Vote.Round == 0) ||
    // Bottom COMMIT은 특정 chain을 결정하자는 표가 아닙니다.
    (msg.Vote.Phase == COMMIT_PHASE && voteForBottom)
)

// 나머지 메시지는 phase·round·value가 맞는 justification을 검증합니다.
if needsJustification {
    validateJustification(msg, committee)
}`}</code></pre>
      <p>
        COMMIT에서 non-bottom P의 strong quorum을 확인하면 참가자는 P를 담은 DECIDE를 보냅니다. 이 DECIDE는 COMMIT quorum을 증명하지만, 수신자 한 명의 표일 뿐입니다. 최종 반환은 서로 다른 DECIDE sender의 power도 strong quorum에 도달했을 때 이뤄집니다.
      </p>
      <div id="paper-gof3-validator-v0815"><CitationBlock source="go-f3 v0.8.15 · validator.go" citeKey={2} type="code" href="https://github.com/filecoin-project/go-f3/blob/v0.8.15/gpbft/validator.go">
        <p><strong>문제:</strong> 서명은 맞지만 instance·round·phase·value·justification이 잘못된 표를 집계 전에 거절해야 합니다.</p>
        <p><strong>기여:</strong> Sender power, ECChain, phase 제약, signature payload와 justification의 phase·round·value·aggregate signature를 검사합니다.</p>
        <p><strong>전제:</strong> go-f3 v0.8.15 tag <code>a1f286d</code>와 해당 instance의 committee·network name을 고정합니다.</p>
        <p><strong>근거 범위:</strong> 이 태그의 <code>cachingValidator</code> 메시지 검증 경로입니다.</p>
        <p><strong>말하지 않는 것:</strong> Gossipsub 전달 성공, EC input 생성이나 application execution을 보장하지 않습니다.</p>
      </CitationBlock></div>
    </section>

    <section id="recovery" className="scroll-mt-24 space-y-6">
      <header>
        <p className="text-sm font-semibold text-primary">03 · bottom과 다음 round</p>
        <h2 className="mt-2 text-2xl font-bold">안전한 제안이 없으면 임의로 고르지 않고 이번 round를 끝냅니다</h2>
      </header>
      <GpbftRecoveryViz />
      <p>
        Bottom은 go-f3에서 길이가 0인 <code>ECChain</code>으로 표현합니다. 이것은 빈 chain을 최종 결정했다는 뜻이 아닙니다. PREPARE에서 local proposal의 정족수를 얻지 못했을 때 COMMIT으로 보내는 “이 round에서는 특정 chain을 결정하지 않음” 표입니다. Bottom COMMIT이 strong quorum이면 기존 proposal과 candidate 정보를 들고 다음 round로 갑니다.
      </p>
      <pre className="overflow-x-auto border border-border bg-muted/20 p-4 text-sm leading-6"><code>{`// Local proposal의 PREPARE 정족수나 동등한 justification을 찾았습니다.
if foundQuorum || foundJustification {
    // 같은 proposal을 non-bottom COMMIT 값으로 유지합니다.
    i.value = i.proposal
// 더는 proposal 정족수가 가능하지 않거나 phase가 완료됐습니다.
} else if quorumNotPossible || phaseComplete {
    // 이번 round에서 특정 chain을 결정하지 않도록 bottom을 표합니다.
    i.value = &ECChain{}
}

// Non-bottom COMMIT strong quorum이면 DECIDE로 갑니다.
if foundStrongQuorum && !quorumValue.IsZero() {
    i.beginDecide(round)
// Bottom COMMIT strong quorum이면 다음 round를 시작합니다.
} else if foundStrongQuorum || foundJustificationForBottom {
    i.beginNextRound()
}`}</code></pre>
      <p>
        이 복구는 safety 기준을 낮추지 않습니다. 네트워크가 갈라져 표가 부족하면 decision이 멈출 수 있습니다. 이는 진행성 문제이지 곧바로 충돌 decision이 생겼다는 뜻은 아닙니다. Partial synchrony가 가정하는 시점 이후 정직한 참가자 사이의 메시지가 제한된 시간 안에 다시 도착해야 timeout 증가와 rebroadcast가 효과를 냅니다.
      </p>
      <p>
        현재 구현은 높은 round에서 phase timeout이 길어지더라도 별도의 rebroadcast 시간을 잡아 무전 상태가 길어지지 않게 합니다. 현재 round의 메시지뿐 아니라 필요한 경우 이전 round의 PREPARE·COMMIT과 round 0 QUALITY도 다시 보냅니다. Publish 호출 성공만 기록해서는 실제로 어떤 evidence가 빠졌는지 알 수 없습니다.
      </p>
    </section>

    <section id="decision" className="scroll-mt-24 space-y-6">
      <header>
        <p className="text-sm font-semibold text-primary">04 · DECIDE와 완료 경계</p>
        <h2 className="mt-2 text-2xl font-bold">COMMIT 근거를 전달한 뒤 DECIDE 표도 다시 모읍니다</h2>
      </header>
      <GpbftBoundaryViz />
      <p>
        <code>beginDecide</code>는 P의 COMMIT strong quorum을 aggregate한 justification을 만들고 round 0의 DECIDE 메시지를 보냅니다. 모든 참가자가 실제로 서로 다른 round에서 P를 발견했더라도 DECIDE payload를 같은 round 0으로 맞춰 aggregate할 수 있게 한 것입니다. <code>tryDecide</code>는 DECIDE 메시지 자체의 strong quorum을 확인한 뒤에만 decision certificate를 만들고 instance를 끝냅니다.
      </p>
      <pre className="overflow-x-auto border border-border bg-muted/20 p-4 text-sm leading-6"><code>{`// Round r에서 P의 COMMIT strong quorum을 찾습니다.
quorum := committed.FindStrongQuorumFor(P)
// 그 signer 집합과 aggregate signature를 DECIDE의 근거로 만듭니다.
justification := buildJustification(quorum, r, COMMIT_PHASE, P)
// 서로 다른 local round도 같은 DECIDE payload로 모을 수 있게 round 0으로 보냅니다.
broadcast(0, DECIDE_PHASE, P, justification)

// DECIDE sender들의 표도 strong quorum인지 확인합니다.
if decision.HasStrongQuorumFor(P) {
    // DECIDE 표를 다시 aggregate해 최종 decision certificate를 만듭니다.
    certificate := buildJustification(decisionQuorum, 0, DECIDE_PHASE, P)
    // 이 instance의 합의 결과를 반환하고 종료합니다.
    terminate(certificate)
}`}</code></pre>
      <p>
        여기까지 확인하면 “GossiPBFT가 P를 결정했다”고 말할 수 있습니다. 그러나 P 안의 Alice→Bob 거래가 애플리케이션 상태에 성공적으로 반영됐는지, certificate가 다른 노드에 동기화됐는지, EC가 확정된 prefix 밖의 branch를 거절하는지는 다음 계층의 상태입니다. Decision certificate를 서비스 완료 영수증으로 확대해서는 안 됩니다.
      </p>
      <div id="paper-gof3-gpbft-v0815"><CitationBlock source="go-f3 v0.8.15 · gpbft.go" citeKey={3} type="code" href="https://github.com/filecoin-project/go-f3/blob/v0.8.15/gpbft/gpbft.go">
        <p><strong>문제:</strong> Out-of-order·late·누락 메시지 속에서도 현재 round와 phase를 안전하게 전진하고 하나의 decision을 반환해야 합니다.</p>
        <p><strong>기여:</strong> <code>tryPrepare</code>, <code>tryCommit</code>, <code>beginDecide</code>, <code>tryDecide</code>, bottom 전환과 rebroadcast를 구현합니다.</p>
        <p><strong>전제:</strong> go-f3 v0.8.15 tag <code>a1f286d58bce369d79a3a725df7ba03af09a759</code>와 검증된 power table·messages를 사용합니다.</p>
        <p><strong>근거 범위:</strong> 이 태그의 local GPBFT state transition과 quorum 집계 구현입니다.</p>
        <p><strong>말하지 않는 것:</strong> 실제 네트워크의 완료 시간, EC fork choice 반영이나 거래 실행 성공을 보장하지 않습니다.</p>
      </CitationBlock></div>
    </section>
  </article>;
}

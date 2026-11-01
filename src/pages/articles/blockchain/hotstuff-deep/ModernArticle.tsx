import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";
import { HotstuffChainViz, HotstuffFailureTable, HotstuffRecoveryViz } from "./viz/ModernHotstuffViz";

const SAFE_VOTE_PSEUDOCODE = [
  "// 제안이 현재 lock이 지키는 가지를 연장하는지 확인합니다.",
  "extendsLockedBranch = isDescendant(proposal.block, lockedQC.block)",
  "",
  "// 다른 가지라면 제안에 담긴 QC가 현재 lock보다 높은 view인지 확인합니다.",
  "hasHigherQC = proposal.justifyQC.view > lockedQC.view",
  "",
  "// 두 조건 가운데 하나를 만족하고 QC 자체가 유효할 때만 표를 보냅니다.",
  "if verify(proposal.justifyQC) && (extendsLockedBranch || hasHigherQC):",
  "    vote(proposal.block, proposal.view)",
].join("\n");

export default function ModernHotstuffArticle() {
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-6">
        <header className="space-y-3">
          <p className="text-sm font-semibold text-primary">HotStuff · PBFT 다음의 질문</p>
          <h2 className="text-3xl font-bold tracking-tight">주 노드가 자주 바뀌어도 이전 합의를 간단히 이어받을 수 있을까?</h2>
        </header>
        <p className="text-lg leading-8 text-foreground/90">
          PBFT는 새 주 노드가 여러 복제본의 준비 증거를 모아 순번표를 다시 만듭니다. HotStuff는 이 증거 인계를 블록과 QC의 사슬로 바꿉니다. 아래 그림에서는 PBFT 글에서 사용한 Alice의 송금을 B10에 넣습니다. 이후 B11·B12·B13이 앞선 블록의 QC를 어떻게 이어받는지 따라갑니다.
        </p>
        <HotstuffChainViz />
        <aside className="border-l-2 border-primary bg-primary/5 p-5 text-sm leading-6">
          <strong>먼저 기억할 한 문장:</strong> QC 하나는 블록이 충분한 표를 받았다는 증거입니다. Chained HotStuff에서 B10을 commit하려면 B11·B12·B13의 QC 연결이 바로 앞 부모를 차례로 가리켜 three-chain을 만들어야 합니다.
        </aside>
      </section>

      <section id="qc-chain" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">01 · QC 사슬</p>
          <h2 className="mt-2 text-2xl font-bold">Lock은 아무 가지에나 표를 주지 못하게 막습니다</h2>
        </header>
        <p>
          각 제안에는 새 블록과 부모, 그 부모를 정당화하는 QC가 들어 있습니다. 복제본은 제안이 현재 lock이 지키는 가지를 연장하면 투표할 수 있습니다. 충돌하는 가지라면 제안의 QC가 현재 lockedQC보다 높은 view를 증명해야 합니다. view 숫자만 크거나 서명과 블록 해시가 맞지 않는 QC는 이 조건을 통과하지 못합니다.
        </p>
        <ExplainedFormula
          question="복제본이 제안 b에 투표해도 되는 두 조건은 무엇입니까?"
          idea={<>제안이 현재 lock을 그대로 연장하거나, 현재 lock보다 높은 view의 유효한 QC로 다른 가지를 정당화해야 합니다.</>}
          formula={"safe(b,q)=extends(b,locked)\\lor view(q)>view(lockedQC)"}
          annotatedFormula={"\\underbrace{safe(b,q)}_{\\text{투표 가능}}=\\underbrace{extends(b,locked)}_{\\text{현재 가지 연장}}\\lor\\underbrace{view(q)>view(lockedQC)}_{\\text{더 높은 유효 QC}}"}
          operations={[
            { expression: "extends(b,locked)=1", annotation: ["B12가 lock이 지키는 B11의 자식이면", "같은 가지를 연장하므로 투표할 수 있습니다."] },
            { expression: "view(q)>view(lockedQC)", annotation: ["다른 가지라면 justify QC의 view가", "현재 lock의 QC보다 높아야 합니다."] },
            { expression: "E\\lor H", annotation: ["둘 가운데 하나를 만족해도 QC 서명과", "블록 해시·조상 관계 검증은 별도로 필요합니다."] },
          ]}
          terms={[
            { symbol: "b", name: "제안 블록", description: "현재 view의 주 노드가 제안한 블록입니다." },
            { symbol: "q", name: "justify QC", description: "제안의 부모나 더 안전한 가지를 정당화하는 정족수 증거입니다." },
            { symbol: "locked", name: "잠긴 블록", description: "복제본이 충돌한 가지에 다시 투표하지 않도록 지키는 현재 블록입니다." },
            { symbol: "lockedQC", name: "lock의 QC", description: "복제본이 보유한 현재 lock의 근거입니다." },
          ]}
          assumptions={[
            "QC는 같은 위원회와 view, 블록 해시를 가리키는 서로 다른 복제본 2f+1곳의 유효한 표로 만듭니다.",
            "복제본은 view마다 같은 단계에 중복 투표하지 않고 블록의 조상 관계를 검증합니다.",
            "복제본은 3f+1대이며 최대 f대가 Byzantine fault를 일으킬 수 있습니다.",
            "안전한 투표와 QC는 블록 본문 저장이나 애플리케이션 실행 완료를 보장하지 않습니다.",
          ]}
          interpretation="lockedQC가 view 11이라면 그 가지를 연장하는 B12에는 투표할 수 있습니다. 충돌한 가지는 view 12 이상의 유효한 QC가 있어야 검토할 수 있습니다. 숫자 12만 적힌 제안은 충분하지 않습니다."
        />
        <div className="not-prose overflow-x-auto border border-border bg-muted/20 p-4">
          <p className="mb-3 text-xs font-bold text-muted-foreground">HotStuff §4.1의 safeNode 판정을 풀어 쓴 의사 코드</p>
          <pre className="min-w-[46rem] text-xs leading-6"><code>{SAFE_VOTE_PSEUDOCODE}</code></pre>
        </div>
        <p>
          n=4, f=1에서는 같은 블록과 view를 가리키는 유효한 표 3개가 QC를 만듭니다. Threshold signature를 사용하면 이 표들을 하나의 짧은 서명으로 표현할 수 있습니다. 그래도 누가 표를 보냈는지, 어느 위원회와 view의 표인지, 어떤 블록 해시를 가리키는지는 계속 검증해야 합니다.
        </p>
        <p>
          Chained HotStuff는 연속된 블록이 앞선 QC를 운반하게 해 여러 논리 단계를 겹쳐 처리합니다. B11이 QC10을, B12가 QC11을, B13이 QC12를 들고 바로 앞 부모에 연결되면 B10이 commit됩니다. B13이 B11을 건너뛰거나 형제 블록의 QC를 들고 오면 높이가 연속이어도 three-chain이 아닙니다.
        </p>
        <div id="paper-hotstuff-chain">
          <CitationBlock source="HotStuff v6 §4–5 — safeNode and Chained HotStuff" citeKey={1} href="https://arxiv.org/html/1803.05069v6#S4">
            <p><strong>문제:</strong> Lock의 안전성을 지키면서 주 노드 교체와 여러 합의 단계를 단순한 사슬로 표현해야 합니다.</p>
            <p><strong>기여:</strong> safeNode 판정, QC, one/two/three-chain과 chained commit 규칙을 정의합니다.</p>
            <p><strong>전제:</strong> 인증된 복제본 3f+1대, threshold signature, 유효한 QC와 블록 조상 관계를 사용합니다.</p>
            <p><strong>근거 범위:</strong> arXiv v6의 Basic HotStuff와 Chained HotStuff 알고리즘입니다.</p>
            <p><strong>말하지 않는 것:</strong> 높이가 연속인 블록 세 개만 보았다고 commit할 수 있다는 뜻은 아닙니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="pacemaker" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">02 · 주 노드 교체</p>
          <h2 className="mt-2 text-2xl font-bold">Pacemaker는 진행을 돕지만 안전 규칙을 바꾸지 않습니다</h2>
        </header>
        <HotstuffRecoveryViz />
        <p>
          주 노드가 멈추면 pacemaker가 복제본을 다음 view로 보냅니다. 새 주 노드는 유효한 NEW-VIEW 2f+1개를 모아 그 안에서 가장 높은 QC를 고릅니다. 그리고 그 QC가 인증한 블록을 부모로 새 제안을 만듭니다. 각 복제본은 새 주 노드에게 보고 하나를 보냅니다. 새 주 노드는 모은 표를 QC 하나로 만들어 배포하므로 주 노드 교체의 인증자 수를 선형으로 구성할 수 있습니다.
        </p>
        <p>
          여기서 선형이라는 말은 논문이 세는 인증자 수를 가리킵니다. 블록 본문 전체의 바이트 수와 서명 검증 CPU는 별도입니다. 잘못된 주 노드가 연속돼 여러 view를 거칠 때의 전체 비용도 언제나 O(n)은 아닙니다. 비교할 때는 인증자 수와 메시지 수, payload 바이트, 암호 연산을 따로 측정해야 합니다.
        </p>
        <p>
          Optimistic responsiveness도 조건부입니다. GST 뒤 정상 주 노드가 정해지고 정상 복제본이 같은 view에 모여야 합니다. 그러면 매 단계에서 알려진 최대 지연 Δ를 다 기다리지 않고 실제 메시지 지연 속도로 진행할 수 있습니다. GST 전에는 처리가 멈출 수 있습니다. 이때도 lock과 QC 검증은 그대로 유지해야 합니다.
        </p>
        <div id="paper-hotstuff">
          <CitationBlock source="HotStuff: BFT Consensus in the Lens of Blockchain · arXiv v6" citeKey={2} href="https://arxiv.org/abs/1803.05069v6">
            <p><strong>문제:</strong> 부분 동기 네트워크에서 선형 주 노드 교체와 optimistic responsiveness를 함께 달성해야 합니다.</p>
            <p><strong>기여:</strong> Threshold QC, safeNode, chained three-chain commit과 안전성 핵심에서 분리한 pacemaker를 제시합니다.</p>
            <p><strong>전제:</strong> GST 뒤 알려진 지연 상한, 정상 주 노드, 인증된 복제본 3f+1대와 최대 f개의 Byzantine fault를 가정합니다.</p>
            <p><strong>근거 범위:</strong> arXiv v6의 프로토콜, 증명과 당시 평가입니다.</p>
            <p><strong>말하지 않는 것:</strong> 논문의 TPS와 지연이 현재 체인이나 다른 구현에서도 그대로 나온다는 뜻은 아닙니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="release" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">03 · 재시작과 검증</p>
          <h2 className="mt-2 text-2xl font-bold">QC를 복구한 뒤에도 블록 본문과 실행 상태를 따로 확인해야 합니다</h2>
        </header>
        <p>
          재시작한 복제본은 영속적으로 보관한 highestQC, lockedQC와 마지막 실행 위치에서 출발해야 합니다. QC만 남고 블록 본문이나 부모 가지가 없다면 해시를 따라 빠진 블록을 받아야 합니다. QC 서명과 view, 블록 해시, 조상 관계를 모두 검증한 뒤 커밋된 요청을 같은 순서로 실행합니다.
        </p>
        <p>
          논문 저자들의 libhotstuff는 알고리즘을 읽을 수 있는 역사적 프로토타입입니다. 고정한 commit의 코드가 보여 주는 동작과 README가 밝힌 한계까지만 근거로 사용합니다. 현재 운영 환경의 저장 내구성, 보안 지원과 장애 복구가 이미 해결됐다고 추정하지 않습니다.
        </p>
        <h3 className="text-xl font-semibold">반드시 거절하거나 멈춰야 하는 사례</h3>
        <HotstuffFailureTable />
        <p className="text-sm leading-6 text-muted-foreground">
          표는 측정 결과가 아니라 검증 계획입니다. 모든 장애에서 충돌한 commit은 0건이어야 합니다. GST 뒤 정상 주 노드와 정상 복제본 2f+1대가 같은 view에 모이면 처리도 다시 진행되어야 합니다.
        </p>
        <div id="paper-libhotstuff">
          <CitationBlock source="libhotstuff prototype · commit 34aa507" citeKey={3} type="code" href="https://github.com/hot-stuff/libhotstuff/tree/34aa50796f201aaab91c4db5aae9d3b7aceddb5c">
            <p><strong>문제:</strong> 논문의 event-driven HotStuff 핵심을 재사용할 수 있는 상태 기계 복제 라이브러리로 구현해야 합니다.</p>
            <p><strong>기여:</strong> 합의 핵심, QC와 블록 타입, 네트워크 예제를 교체 가능한 pacemaker와 연결합니다.</p>
            <p><strong>전제:</strong> 역사적 commit 34aa507과 당시 암호·네트워크 의존성을 고정합니다.</p>
            <p><strong>근거 범위:</strong> 논문 저자들의 프로토타입 소스와 README가 밝힌 기능 경계입니다.</p>
            <p><strong>말하지 않는 것:</strong> 지속적인 제품 지원, 영속 복구, 현재 보안 감사와 고정 성능을 보장하지 않습니다.</p>
          </CitationBlock>
        </div>
      </section>
    </article>
  );
}

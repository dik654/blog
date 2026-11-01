import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";
import { PbftNormalViz, PbftRecoveryViz, PbftTestTable } from "./viz/ModernPbftViz";

const PREDICATE_PSEUDOCODE = `// 요청 본문과 주 노드의 제안이 로컬 로그에 있어야 합니다.
has_request(m) && has_preprepare(m, view, sequence)

// 같은 view·sequence·digest를 가리키는 서로 다른 백업의 PREPARE를 셉니다.
&& distinct_matching_prepares(view, sequence, digest) >= 2 * f

// 위 조건을 만족한 복제본만 COMMIT을 보낼 수 있습니다.
send_commit(view, sequence, digest)

// 로컬 prepared와 서로 다른 복제본의 COMMIT을 함께 확인합니다.
prepared(m, view, sequence) && distinct_matching_commits(view, sequence, digest) >= 2 * f + 1

// 앞선 순번까지 실행한 뒤 현재 요청을 상태 기계에 적용합니다.
execute_after_all_lower_sequences(sequence)`;

export default function ModernPbftArticle() {
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-6">
        <header className="space-y-3">
          <p className="text-sm font-semibold text-primary">PBFT · 요청 한 건의 전체 흐름</p>
          <h2 className="text-3xl font-bold tracking-tight">복제본 하나가 거짓말해도 나머지는 같은 순서로 실행할 수 있을까?</h2>
        </header>
        <p className="text-lg leading-8 text-foreground/90">
          Alice가 Bob에게 10을 보내는 요청을 복제본 4대가 처리한다고 하겠습니다. PBFT는 요청 내용만 맞추지 않습니다. 현재 주 노드의 임기인 <em>view</em>, 실행 순서인 <em>sequence</em>, 요청을 식별하는 해시를 한 묶음으로 고정합니다. 아래 그림은 요청이 어느 순간에 제안되고, 실행 가능해지고, 클라이언트의 성공으로 바뀌는지 보여줍니다.
        </p>
        <PbftNormalViz />
        <aside className="border-l-2 border-primary bg-primary/5 p-5 text-sm leading-6">
          <strong>먼저 구분할 세 가지:</strong> prepared는 한 복제본이 같은 제안을 충분히 확인한 상태입니다. committed-local은 그 복제본이 실행 조건까지 갖춘 상태입니다. 클라이언트는 실행 결과가 같은 응답을 <code>f+1</code>곳에서 받은 뒤에야 성공으로 판단합니다.
        </aside>
      </section>

      <section id="normal-case" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">01 · 정상 처리</p>
          <h2 className="mt-2 text-2xl font-bold">PREPARE와 COMMIT은 서로 다른 질문에 답합니다</h2>
        </header>
        <p>
          PRE-PREPARE는 주 노드가 요청을 어느 순번에 놓았는지 알립니다. 백업은 서명과 요청 해시를 먼저 확인합니다. 이어서 현재 view와 맞는지, 허용된 순번 범위 안에 있는지, 같은 자리에 다른 요청을 이미 받지 않았는지를 검사합니다. 조건을 모두 통과한 백업만 PREPARE를 보냅니다. 그래서 잘못된 주 노드가 같은 순번에 두 요청을 나눠 보내도 정상 복제본은 두 요청을 모두 지지하지 않습니다.
        </p>
        <p>
          PREPARE는 현재 view 안에서 같은 순서를 봤다는 증거를 만듭니다. COMMIT은 그 증거를 다음 view까지 넘길 수 있을 만큼 많은 정상 복제본이 보았음을 확인합니다. 둘을 같은 표를 두 번 세는 단계로 이해하면 안 됩니다. 그러면 COMMIT만 모은 복제본이 요청 본문과 PRE-PREPARE를 확인하지 않은 채 상태를 바꿀 수 있습니다.
        </p>
        <ExplainedFormula
          question="복제본 하나가 sequence 42를 실행하려면 어떤 증거를 차례로 확인해야 합니까?"
          idea={<>Prepared는 요청과 제안을 PREPARE 증거에 묶습니다. Committed-local은 로컬 prepared 상태에 COMMIT 정족수를 더합니다.</>}
          formula={String.raw`\begin{aligned}prepared_i&=PP_i\land |P_i|\ge 2f\\committedLocal_i&=prepared_i\land |C_i|\ge 2f+1\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}\underbrace{prepared_i}_{\text{제안을 충분히 확인}}&=\underbrace{PP_i}_{\text{요청과 PRE-PREPARE}}\land \underbrace{|P_i|\ge 2f}_{\text{서로 다른 백업의 PREPARE}}\\\underbrace{committedLocal_i}_{\text{로컬 실행 조건}}&=prepared_i\land \underbrace{|C_i|\ge 2f+1}_{\text{서로 다른 복제본의 COMMIT}}\end{aligned}`}
          operations={[
            { expression: String.raw`n=3f+1=4`, annotation: ["설명용 클러스터는 복제본 4대입니다.", "임의로 잘못 동작할 수 있는 복제본은 최대 1대입니다."] },
            { expression: String.raw`2f=2`, annotation: ["PRE-PREPARE와 PREPARE 2개가 prepared를 만듭니다.", "PREPARE는 서로 다른 백업이 보낸 것이어야 합니다."] },
            { expression: String.raw`2f+1=3`, annotation: ["로컬 prepared에 COMMIT 3개를 더해야 committed-local입니다.", "COMMIT만 3개 모인 상태는 실행 조건이 아닙니다."] },
          ]}
          terms={[
            { symbol: "PPᵢ", name: "승인한 제안", description: "복제본 i가 요청 본문과 PRE-PREPARE의 view·sequence·digest를 검증해 로그에 넣은 상태입니다." },
            { symbol: "Pᵢ", name: "일치하는 PREPARE 집합", description: "서로 다른 백업이 같은 view·sequence·digest에 보낸 유효한 PREPARE입니다." },
            { symbol: "Cᵢ", name: "일치하는 COMMIT 집합", description: "서로 다른 복제본이 같은 view·sequence·digest에 보낸 유효한 COMMIT입니다." },
            { symbol: "f", name: "Byzantine fault 한도", description: "전체 3f+1대 중 임의로 잘못 동작할 수 있는 복제본의 최대 수입니다." },
          ]}
          assumptions={[
            "요청과 프로토콜 메시지의 인증을 먼저 검증합니다.",
            "같은 발신자의 메시지를 중복해서 세지 않습니다.",
            "복제본은 더 낮은 sequence를 모두 실행한 뒤 현재 요청을 실행합니다.",
            "이 판정은 디스크 영속성이나 외부 결제 완료를 뜻하지 않습니다.",
          ]}
          interpretation="n=4, f=1이면 제안과 PREPARE 2개가 prepared를 만들고, 로컬 prepared와 COMMIT 3개가 committed-local을 만듭니다. 서로 다른 단계의 증거를 합쳐 세면 안 됩니다."
        />
        <div className="not-prose overflow-x-auto border border-border bg-muted/20 p-4">
          <p className="mb-3 text-xs font-bold text-muted-foreground">OSDI 1999 §4.2의 판정 조건을 풀어 쓴 의사 코드</p>
          <pre className="min-w-[46rem] text-xs leading-6"><code>{PREDICATE_PSEUDOCODE}</code></pre>
        </div>
        <div id="paper-pbft-normal">
          <CitationBlock source="PBFT paper §4.2 — Normal-Case Operation" citeKey={1} href="https://www.usenix.org/legacy/publications/library/proceedings/osdi99/full_papers/castro/castro_html/node4.html#SECTION00042000000000000000">
            <p><strong>문제:</strong> 잘못된 주 노드가 같은 순번에 다른 요청을 보내더라도 정상 복제본의 실행 순서가 갈라지지 않아야 합니다.</p>
            <p><strong>기여:</strong> PRE-PREPARE 승인 조건, prepared·committed-local 판정과 순서 실행 규칙을 정의합니다.</p>
            <p><strong>전제:</strong> 인증된 복제본 3f+1대, 최대 f개의 Byzantine fault, 결정적인 상태 기계와 충돌에 강한 해시를 가정합니다.</p>
            <p><strong>근거 범위:</strong> PBFT 정상 처리의 메시지와 실행 조건에 한정합니다.</p>
            <p><strong>말하지 않는 것:</strong> PREPARE나 COMMIT 하나가 클라이언트 성공 또는 외부 효과의 영속성을 뜻하지 않습니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="view-recovery" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">02 · 뷰 변경과 체크포인트</p>
          <h2 className="mt-2 text-2xl font-bold">새 주 노드는 이전 증거를 읽고 순번표를 다시 만듭니다</h2>
        </header>
        <PbftRecoveryViz />
        <p>
          요청이 실행되지 않은 채 타이머가 끝나면 복제본은 다음 view로 이동합니다. 1999년 논문의 단순화된 절차에서 새 주 노드는 자기 것을 포함한 VIEW-CHANGE <code>2f+1</code>개를 모읍니다. 각 순번에 prepared 증거가 있으면 가장 높은 이전 view의 값을 고릅니다. 증거가 없는 빈 순번에는 아무 동작도 하지 않는 null 요청을 넣습니다. 백업도 같은 입력으로 결과를 다시 계산하므로 새 주 노드가 증거를 빼거나 다른 값을 끼워 넣을 수 없습니다.
        </p>
        <p>
          체크포인트는 오래된 프로토콜 기록을 안전하게 지우는 기준입니다. 같은 순번과 상태 해시에 CHECKPOINT <code>2f+1</code>개가 모이면 안정된 체크포인트가 됩니다. 그때 낮은 watermark를 올리고 이전 기록을 정리할 수 있습니다. 상태 자체를 잃은 복제본은 인증된 상태를 다시 받은 뒤 해시를 확인하고, 체크포인트 이후 요청을 재생해야 합니다.
        </p>
        <aside className="border-l-2 border-border p-4 text-sm leading-6 text-muted-foreground">
          이 글은 OSDI 1999 §4의 단순화된 PBFT를 기준으로 합니다. 2002년 확장판은 반복되는 뷰 변경과 복구를 다루기 위해 P·Q 집합과 VIEW-CHANGE-ACK를 추가합니다. 두 절차의 메시지 형식을 하나로 섞어 구현하면 안 됩니다.
        </aside>
        <div id="paper-pbft-recovery">
          <CitationBlock source="PBFT paper §4.3–4.4 — Garbage Collection and View Changes" citeKey={2} href="https://www.usenix.org/legacy/publications/library/proceedings/osdi99/full_papers/castro/castro_html/node4.html#SECTION00043000000000000000">
            <p><strong>문제:</strong> 주 노드가 바뀌어도 이미 준비된 순번을 보존하고, 무한히 늘어나는 기록을 안전하게 줄여야 합니다.</p>
            <p><strong>기여:</strong> 안정 체크포인트, watermark, VIEW-CHANGE·NEW-VIEW 재구성과 상태 전송 절차를 정의합니다.</p>
            <p><strong>전제:</strong> 유효한 증거 2f+1개와 모든 백업이 다시 계산할 수 있는 순번별 선택 규칙을 사용합니다.</p>
            <p><strong>근거 범위:</strong> OSDI 1999 논문에 실린 단순화된 복구와 기록 정리 절차입니다.</p>
            <p><strong>말하지 않는 것:</strong> 로컬 스냅샷이나 타이머 하나가 전체 복제본이 인정한 복구 완료를 보장하지 않습니다.</p>
          </CitationBlock>
        </div>
        <div id="paper-pbft-proactive">
          <CitationBlock source="Practical Byzantine Fault Tolerance and Proactive Recovery — TOCS 2002" citeKey={3} href="https://www.microsoft.com/en-us/research/wp-content/uploads/2017/01/p398-castro-bft-tocs.pdf">
            <p><strong>문제:</strong> 여러 번의 뷰 변경과 복제본 복구가 이어져도 이전 증거와 상태를 유한한 공간에서 보존해야 합니다.</p>
            <p><strong>기여:</strong> P·Q 기록, VIEW-CHANGE-ACK, 상태 전송과 proactive recovery를 포함한 확장 절차를 제시합니다.</p>
            <p><strong>전제:</strong> 논문이 정의한 인증 방식과 복구 주기, 취약 시간 창을 따릅니다.</p>
            <p><strong>근거 범위:</strong> 2002년 확장 알고리즘과 당시 C++ BFT 라이브러리의 실험입니다.</p>
            <p><strong>말하지 않는 것:</strong> 확장판의 메시지 구조를 1999년 단순화된 절차에 일부만 옮겨도 안전하다는 뜻은 아닙니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="release" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">03 · 사용자 결과와 검증</p>
          <h2 className="mt-2 text-2xl font-bold">합의가 끝났다는 말은 어느 관찰자의 판정인지 밝혀야 합니다</h2>
        </header>
        <p>
          committed-local은 복제본 하나가 해당 순번을 실행해도 된다는 판정입니다. 복제본은 앞선 순번까지 실행한 뒤 결과를 클라이언트에게 보냅니다. 클라이언트는 같은 타임스탬프와 결과를 담은 응답을 서로 다른 복제본 <code>f+1</code>곳에서 받아야 결과를 받아들입니다. n=4, f=1이면 두 응답이 필요하므로 적어도 하나는 정상 복제본이 보낸 결과입니다.
        </p>
        <p>
          응답이 늦어 클라이언트가 같은 요청을 다시 보내더라도 복제본은 마지막 타임스탬프와 응답을 기억합니다. 이미 처리한 요청은 다시 실행하지 않고 이전 결과를 돌려줍니다. 이 규칙은 PBFT 안에서 같은 요청을 두 번 실행하지 않게 합니다. 외부 결제나 다른 데이터베이스까지 포함한 전역 exactly-once를 자동으로 만들어 주지는 않습니다.
        </p>
        <h3 className="text-xl font-semibold">프로토콜을 통과시킬 장애 사례</h3>
        <PbftTestTable />
        <p className="text-sm leading-6 text-muted-foreground">
          표는 측정 결과가 아니라 검증 계획입니다. 각 사례에서 충돌한 실행 결과는 0건이어야 합니다. 네트워크 지연 상한을 알 수 없는 동안에는 처리가 멈출 수 있습니다. 통신이 안정되고 정상 주 노드와 정상 복제본 2f+1대가 같은 view에 모인 뒤에는 새 요청이 완료되어야 합니다.
        </p>
        <div id="paper-pbft-correctness">
          <CitationBlock source="A Correctness Proof for a Practical Byzantine-Fault-Tolerant Replication Algorithm" citeKey={4} href="https://www.microsoft.com/en-us/research/publication/correctness-proof-practical-byzantine-fault-tolerant-replication-algorithm/">
            <p><strong>문제:</strong> 정상 처리와 뷰 변경을 함께 놓고도 PBFT가 선형화 가능한 상태 기계를 구현함을 보여야 합니다.</p>
            <p><strong>기여:</strong> PBFT의 안전성과 진행 조건을 I/O automaton으로 형식화하고 증명합니다.</p>
            <p><strong>전제:</strong> 인증, 정족수 교집합, 결정적인 상태 기계와 논문이 정의한 타이밍 조건을 사용합니다.</p>
            <p><strong>근거 범위:</strong> 1999년 PBFT 알고리즘의 정확성 논증입니다.</p>
            <p><strong>말하지 않는 것:</strong> 특정 구현의 저장 장치, 네트워크, 운영 절차가 자동으로 검증됐다는 뜻은 아닙니다.</p>
          </CitationBlock>
        </div>
      </section>
    </article>
  );
}

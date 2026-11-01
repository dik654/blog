import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";
import {
  AutobahnCommitViz,
  AutobahnEvidenceBoundaryViz,
  AutobahnLaneCutViz,
} from "./viz/ModernAutobahnViz";

export default function ModernAutobahnArticle() {
  return <article className="space-y-14">
    <section id="overview" className="space-y-6">
      <header className="space-y-3">
        <p className="text-sm font-semibold text-primary">Autobahn 전체 흐름</p>
        <h2 className="text-3xl font-bold tracking-tight">거래 데이터는 여러 차선으로 보내고, 합의는 각 차선의 도착 지점만 정합니다</h2>
      </header>
      <p className="text-lg leading-8 text-foreground/90">
        이 글은 한 가지 질문을 따라갑니다. Alice가 Bob에게 보내는 거래 묶음이 A 차선의 <em>car</em>가 된 뒤, 네 replica가
        어떤 데이터를 실행할지 어떻게 같은 결론에 도달할까요?
      </p>
      <AutobahnLaneCutViz />
      <p>
        Autobahn은 replica마다 독립적인 데이터 차선(<em>lane</em>)을 둡니다. 각 차선의 car는 바로 앞 car를 가리키므로
        순서가 있는 이력을 만듭니다. 합의 제안에는 쌓인 거래를 다시 전부 넣지 않고, 각 차선에서 선택한 마지막 인증 car의 위치만
        <em>cut</em>으로 넣습니다. cut이 확정되면 직전 cut 이후의 차선 구간을 동기화하고, 모두가 공유하는 결정적 규칙으로 한
        실행 순서로 펼칩니다.
      </p>
      <aside className="border-l-2 border-primary pl-5 text-sm leading-7">
        <strong>분리해서 볼 세 가지:</strong> PoA는 데이터를 다시 받을 경로를 남기고, CommitQC는 어떤 cut을 선택했는지
        확정하며, payload 검증과 실행은 그 선택을 실제 상태에 반영합니다. 셋 중 하나가 끝났다고 나머지까지 끝난 것은 아닙니다.
      </aside>
    </section>

    <section id="lanes-cut" className="space-y-6">
      <header>
        <p className="text-sm font-semibold text-primary">01 · 차선과 cut</p>
        <h2 className="mt-2 text-2xl font-bold">f+1표는 데이터를 가진 정직한 replica를 남기지만, car 하나만 존재한다고 증명하지는 않습니다</h2>
      </header>
      <p>
        논문은 replica 수를 <code>n=3f+1</code>, Byzantine replica의 상한을 <code>f</code>로 둡니다. 같은
        차선·위치·car digest에 서로 다른 <code>f+1</code>명의 표가 모이면 proof of availability(PoA)가 됩니다.
        <code>n=4, f=1</code>이면 두 표 중 적어도 한 표는 정직한 replica가 냈으므로 car 데이터를 다시 받을 수 있는
        보관자가 적어도 한 명 남습니다.
      </p>
      <ExplainedFormula
        question="Car PoA에서 보장되는 정직한 보관자의 최솟값은 얼마인가?"
        idea={<>PoA 서명자 f+1명 중 Byzantine replica가 최대 f명이므로, 적어도 한 명은 정직합니다. 이 계산은 데이터 가용성의 하한이지 같은 위치의 car가 하나뿐이라는 증명은 아닙니다.</>}
        formula={String.raw`\begin{aligned}honest(PoA)&\ge |PoA|-f\\&=(f+1)-f=1\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}honest(PoA)&\ge \underbrace{|PoA|-f}_{\text{PoA 서명자에서 Byzantine 상한을 제외}}\\&=\underbrace{(f+1)-f=1}_{\text{정직한 보관자 최소 1명}}\end{aligned}`}
        operations={[
          { expression: String.raw`|PoA|-f`, annotation: ["서로 다른 서명자만 셉니다.", "그중 Byzantine replica는 최대 f명입니다.", "나머지가 정직한 보관자의 하한입니다."] },
          { expression: String.raw`(f+1)-f=1`, annotation: ["n=4, f=1이면 PoA 기준은 2표입니다.", "두 표 모두 Byzantine일 수는 없습니다.", "따라서 정직한 보관자가 최소 한 명입니다."] },
        ]}
        terms={[
          { symbol: "PoA", name: "proof of availability", description: "같은 차선·위치·car digest에 대한 서로 다른 replica의 표입니다." },
          { symbol: "f", name: "Byzantine fault bound", description: "n=3f+1 위원회에서 허용하는 Byzantine replica의 최대 수입니다." },
          { symbol: "f+1", name: "car 인증 기준", description: "논문의 데이터 계층이 PoA를 만들 때 요구하는 표 수입니다." },
          { symbol: "honest(PoA)", name: "정직한 보관자 하한", description: "PoA에 참여한 replica 중 car 데이터를 보관한 정직한 replica의 최솟값입니다." },
        ]}
        assumptions={[
          "인증된 채널과 유효한 전자서명을 사용하고, 중복 서명자는 한 번만 셉니다.",
          "표는 같은 차선·위치·car digest에 결속됩니다.",
          "정직한 voter는 프로토콜이 요구한 car 데이터를 보관합니다.",
          "PoA만으로 전체 순서, 영구 보관, 애플리케이션 실행 성공을 주장하지 않습니다.",
        ]}
        interpretation="Byzantine 차선 소유자가 같은 위치에 car x와 y를 만들 수 있습니다. Byzantine replica B와 정직한 H1이 x에, B와 정직한 H2가 y에 투표하면 두 car 모두 두 표를 얻습니다. 그러므로 consensus cut이 어느 tip을 사용할지 하나로 확정해야 합니다."
      />
      <p>
        직전 cut이 <code>[1,1,1,1]</code>이고 새 cut이 <code>[2,2,2,3]</code>이라면 새로 처리할 구간은
        A2, B2, C2, D2, D3입니다. replica는 없는 car를 parent digest를 따라 받아 검증한 뒤, 이미 처리한 위치 이하를 제외하고
        결정적 zipping 함수를 적용합니다. 논문은 모든 replica가 같은 결과를 만드는 함수를 요구하지만, A 차선부터 D 차선까지
        고정해서 읽는 하나의 함수만을 규정하지는 않습니다.
      </p>
      <div id="paper-autobahn-lanes">
        <CitationBlock source="Autobahn: Seamless high speed BFT · §5.1 Lanes" citeKey={1} href="https://www.cs.cornell.edu/~fsp/reports/Autobahn__SOSP24_CR.pdf">
          <p><strong>문제:</strong> 합의가 잠시 멈춰도 데이터 전파를 계속하고, 긴 차선 이력을 작은 tip 참조로 표현해야 합니다.</p>
          <p><strong>기여:</strong> 앞 car를 가리키는 차선, f+1표의 PoA, certified tip과 cut의 입력을 정의합니다.</p>
          <p><strong>전제:</strong> n=3f+1, 최대 f Byzantine faults, 인증된 채널과 논문의 투표 규칙을 사용합니다.</p>
          <p><strong>근거 범위:</strong> 논문의 차선과 PoA 의미에 한정합니다.</p>
          <p><strong>말하지 않는 것:</strong> PoA가 car의 유일성, 전체 순서, 영구 보관을 보장한다고 확대하지 않습니다.</p>
        </CitationBlock>
      </div>
    </section>

    <section id="consensus" className="space-y-6">
      <header>
        <p className="text-sm font-semibold text-primary">02 · cut 합의</p>
        <h2 className="mt-2 text-2xl font-bold">PrepareQC, CommitQC, fast-path 증거를 서로 바꿔 쓰면 안 됩니다</h2>
      </header>
      <AutobahnCommitViz />
      <p>
        leader가 cut을 제안하면 <code>2f+1</code> Prep-Votes가 PrepareQC를 만듭니다. 일반적인 slow path에서는 이어지는
        Confirm message에 <code>2f+1</code> Confirm-Acks가 모여 CommitQC가 됩니다.
      </p>
      <p>
        좋은 네트워크 구간에서 모든 <code>n</code> replica의 Prep-Vote를 얻으면 Confirm 단계를 생략하는 fast path를 사용할 수 있습니다.
        <code>n=4, f=1</code>에서 세 Prep-Votes와 네 Prep-Votes는 같은 증거가 아닙니다.
      </p>
      <p>
        진행이 멈추면 <code>f+1</code> timeout messages를 본 replica가 timeout을 다시 퍼뜨립니다. 이 기준에는 적어도
        한 정직한 replica의 불만이 포함됩니다. <code>2f+1</code> Timeouts가 모인 Timeout Certificate는 다음 view로
        이동할 ticket이 됩니다. 새 leader는 보고된 highQC와 high proposal을 논문의 규칙대로 비교해 안전한 제안을 복구합니다.
      </p>
      <pre className="overflow-x-auto border border-border bg-muted/30 p-4 text-sm leading-6"><code>{`// 같은 view와 cut digest에 묶인 서로 다른 Prep-Vote를 셉니다.
prepareVotes = collectDistinctPrepVotes(view, cutDigest)

// 2f+1표가 모이면 slow path의 준비 증거를 만듭니다.
if prepareVotes.count >= 2*f + 1:
    prepareQC = makePrepareQC(prepareVotes)

// 모든 n명이 투표한 경우에만 Confirm 단계를 생략합니다.
if prepareVotes.count == n:
    commit(fastCommitQC(prepareVotes))
else:
    // PrepareQC를 받은 replica가 Confirm-Ack을 보냅니다.
    confirmAcks = collectDistinctConfirmAcks(prepareQC)

    // 2f+1 Confirm-Ack이 모이면 slow-path 결정 증거를 만듭니다.
    if confirmAcks.count >= 2*f + 1:
        commit(slowCommitQC(confirmAcks))`}</code></pre>
      <div id="paper-autobahn-consensus">
        <CitationBlock source="Autobahn: Seamless high speed BFT · §5.2–5.4" citeKey={2} href="https://www.cs.cornell.edu/~fsp/reports/Autobahn__SOSP24_CR.pdf">
          <p><strong>문제:</strong> backlog가 커져도 작은 cut을 낮은 지연으로 확정하고, view가 바뀔 때 안전한 증거를 넘겨야 합니다.</p>
          <p><strong>기여:</strong> Prepare/Confirm slow path, 모든 replica의 표를 쓰는 fast path, timeout과 view-change 규칙을 정의합니다.</p>
          <p><strong>전제:</strong> 논문이 구분한 표의 domain과 기준, 차선 이력 동기화, 제한된 동시 consensus instance를 따릅니다.</p>
          <p><strong>근거 범위:</strong> cut consensus와 view-change 알고리즘 및 증명에 한정합니다.</p>
          <p><strong>말하지 않는 것:</strong> cut 확정만으로 payload 동기화와 애플리케이션 실행이 끝났다고 주장하지 않습니다.</p>
        </CitationBlock>
      </div>
    </section>

    <section id="boundaries" className="space-y-6">
      <header>
        <p className="text-sm font-semibold text-primary">03 · 확인된 경계</p>
        <h2 className="mt-2 text-2xl font-bold">논문의 알고리즘, 공개 프로토타입, 클라이언트 완료 상태를 따로 확인합니다</h2>
      </header>
      <AutobahnEvidenceBoundaryViz />
      <p>
        공개 artifact의 <code>autobahn</code> 브랜치를 commit
        <code>6d77e0307e9dc09cc8def2c846a20523646ab4de</code>로 고정해 확인했습니다. 메시지 자료형에는
        Prepare, Confirm, Commit이 따로 있고, core에는 제안의 payload와 parent를 동기화한 뒤 consensus 준비 여부를 판단하는
        경로가 있습니다.
      </p>
      <p>
        이는 논문의 구조가 코드에 어떤 모양으로 나타났는지 확인하는 근거입니다. 다만 README가 설명하듯 실험
        재현용 prototype이므로, 이 코드만 보고 제품 수준의 장기 보관·자동 복구·모든 최적화가 끝났다고 말할 수는 없습니다.
      </p>
      <div id="code-autobahn-artifact">
        <CitationBlock source="autobahn-artifact · messages.rs/core.rs · commit 6d77e03" citeKey={3} href="https://github.com/neilgiri/autobahn-artifact/tree/6d77e0307e9dc09cc8def2c846a20523646ab4de">
          <p><strong>확인 대상:</strong> Rust/Tokio 기반 공개 artifact의 primary message와 core 처리 경로입니다.</p>
          <p><strong>확인된 것:</strong> Proposal의 header digest·height, Prepare/Confirm/Commit message 구분, payload·parent sync와 consensus 준비 검사가 코드에 존재합니다.</p>
          <p><strong>근거 범위:</strong> 고정된 commit의 공개 prototype에 한정합니다.</p>
          <p><strong>말하지 않는 것:</strong> 논문의 모든 의사코드와 최적화가 일대일로 구현됐거나 production 운영이 검증됐다고 주장하지 않습니다.</p>
        </CitationBlock>
      </div>
      <p>
        마지막으로 <em>seamless</em>는 합의 메시지 크기와 네트워크 장애 뒤의 agreement 회복을 설명하는 논문 주장입니다.
        offered load가 네트워크·디스크·실행 용량을 넘으면 backlog는 줄지 않습니다. cut을 빠르게 확정하더라도 느린 replica가
        긴 suffix를 받아 검증하고 실행하는 시간은 남습니다.
      </p>
      <p>
        따라서 이 글에서 확정할 결론은 “cut 합의와 데이터 처리를 분리한다”는
        메커니즘이며, 모든 배포에서 end-to-end 지연이 사라진다는 성능 보장이 아닙니다.
      </p>
      <div id="paper-autobahn">
        <CitationBlock source="Autobahn: Seamless high speed BFT · SOSP 2024" citeKey={4} href="https://www.cs.cornell.edu/~fsp/reports/Autobahn__SOSP24_CR.pdf">
          <p><strong>문제:</strong> 부분 동기 네트워크의 일시적 장애 뒤 traditional BFT의 backlog hangover와 DAG BFT의 정상 구간 지연을 함께 줄이려 합니다.</p>
          <p><strong>기여:</strong> chained lanes, f+1 PoA, certified-tip cut과 낮은 지연의 view-based consensus를 결합합니다.</p>
          <p><strong>전제:</strong> n=3f+1 authenticated replicas, static Byzantine adversary를 두며, liveness와 회복 주장은 좋은 네트워크 구간과 처리 용량 전제를 사용합니다.</p>
          <p><strong>근거 범위:</strong> 논문의 프로토콜·증명·평가에 한정합니다.</p>
          <p><strong>말하지 않는 것:</strong> 다른 하드웨어와 부하에서도 같은 처리량·지연이 나온다고 일반화하지 않습니다.</p>
        </CitationBlock>
      </div>
    </section>
  </article>;
}

import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";
import {
  BullsharkCommitTraceViz,
  BullsharkOrderingViz,
  BullsharkVariantViz,
} from "./viz/ModernBullsharkViz";

function BullsharkSketch() {
  return (
    <div className="not-prose overflow-x-auto border border-border bg-[#111318] p-4 text-[12px] leading-6 text-[#e7eaf0]">
      <pre><code>{`// 새 인증서를 로컬 DAG의 작성자·라운드 위치에 넣습니다.
dag[certificate.round][certificate.author] = certificate

// 방금 받은 홀수 라운드 인증서의 직전 짝수 라운드를 후보로 봅니다.
leader_round = certificate.round - 1
if leader_round < 2 or leader_round is odd:
    return []

// 후보 리더를 부모로 참조한 서로 다른 작성자의 stake를 더합니다.
leader = predefined_leader(leader_round)
support = sum(
    stake(child.author)
    for child in dag[certificate.round]
    if leader.digest in child.parents
)

// 지지 임계값에 못 미치면 DAG만 보관하고 출력을 만들지 않습니다.
if support < validity_threshold:
    return []

// 현재 리더에서 도달할 수 있는 이전 리더를 찾고 오래된 것부터 처리합니다.
leaders = reverse(order_leaders_from_current(leader))
for leader in leaders:
    // 이미 커밋한 인증서를 제외하고 인과적 과거를 결정적으로 펼칩니다.
    for certificate in order_dag(leader):
        update_last_committed(certificate)
        persist(consensus_index, certificate.digest)
        emit(certificate, consensus_index)
        consensus_index += 1`}</code></pre>
    </div>
  );
}

export default function ModernBullsharkArticle() {
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-6">
        <header className="space-y-3">
          <p className="text-sm font-semibold text-primary">Bullshark 상세</p>
          <h2 className="text-3xl font-bold tracking-tight">인증서 DAG의 여러 가능한 순서 가운데 하나를 어떻게 고를까요?</h2>
        </header>
        <p className="text-lg leading-8 text-foreground/90">
          <a className="font-semibold text-primary underline-offset-4 hover:underline" href="/cs/blockchain/dag-consensus#bullshark">앞선 DAG 합의 지도</a>와 <a className="font-semibold text-primary underline-offset-4 hover:underline" href="/cs/blockchain/narwhal-deep#overview">Narwhal 상세편</a>에서 거래 배치가 인증서가 되는 과정까지 봤습니다. 이 글은 인증된 DAG를 한 줄의 합의 순서로 바꾸는 구간만 확대합니다. 직접 커밋되지 못한 앵커 L2와 나중에 지지를 얻는 L4를 끝까지 따라갑니다.
        </p>

        <BullsharkCommitTraceViz />

        <p>
          Narwhal 인증서는 데이터 회수 근거와 부모 관계를 제공합니다. 그러나 서로 인과관계가 없는 인증서는 여러 순서로 나열할 수 있습니다. Bullshark는 미리 정한 앵커가 다음 라운드 인증서들의 지지를 받았는지 확인하고, 결정된 앵커에서 거슬러 갈 수 있는 과거를 같은 규칙으로 펼쳐 공통 접두사를 만듭니다.
        </p>
        <p>
          이 글의 동작 추적은 보관 종료된 MystenLabs/narwhal의 <code>e67f915</code> 커밋에 있는 부분 동기식 standalone 구현에 한정합니다. Bullshark 전체 논문의 비동기 변형은 리더와 wave 규칙이 다르므로 마지막 절에서 따로 구분합니다.
        </p>
      </section>

      <section id="wave-anchor" className="space-y-6">
        <header className="space-y-2">
          <p className="text-sm font-semibold text-primary">01 · 지지와 앵커</p>
          <h2 className="text-2xl font-bold">다음 라운드의 부모 참조가 앵커에 대한 표가 됩니다</h2>
        </header>

        <ExplainedFormula
          question="n=4, f=1인 고정 구현에서 L4의 지지 power는 어떻게 계산할까요?"
          idea={<>라운드 5의 서로 다른 작성자 가운데 L4의 digest를 부모로 담은 인증서만 골라 stake를 더합니다. Equal-weight 예에서 B5와 C5가 L4를 가리키면 합계 2가 validity threshold f+1=2에 닿습니다.</>}
          formula={String.raw`S(L_4)=\sum_{c\in DAG[5]} stake(author(c))\cdot \mathbf{1}[digest(L_4)\in parents(c)]\ge f+1`}
          annotatedFormula={String.raw`\underbrace{S(L_4)}_{\text{L4 지지 power}}=\underbrace{stake(B)+stake(C)}_{\text{서로 다른 작성자}}=2\ge\underbrace{f+1}_{\text{validity threshold}}=2`}
          operations={[
            { expression: String.raw`digest(L_4)\in parents(c)`, annotation: ["별도 투표 메시지를 만들지 않음", "child의 parent 참조를 표로 해석", "참조가 없으면 0"] },
            { expression: String.raw`\sum stake(author(c))`, annotation: ["DAG가 작성자마다 인증서 하나를 보관", "같은 작성자의 중복 수신은 한 번만 계산", "weighted committee는 stake로 합산"] },
            { expression: String.raw`S(L_4)\ge f+1`, annotation: ["고정 구현의 validity threshold", "equal-weight n=4, f=1이면 2", "B5·C5로 직접 커밋 조건 충족"] },
          ]}
          terms={[
            { symbol: "L₄", name: "짝수 라운드 앵커", description: "모든 검증자가 같은 leader schedule로 고르는 라운드 4 인증서입니다." },
            { symbol: "DAG[5]", name: "다음 라운드 인증서 집합", description: "라운드 5에서 작성자별로 검증해 저장한 인증서들입니다." },
            { symbol: "parents(c)", name: "부모 digest 집합", description: "인증서 c가 직전 라운드에서 인과적으로 참조한 인증서 식별자들입니다." },
          ]}
          assumptions={[
            "보관된 e67f915의 부분 동기식 Bullshark 구현을 읽습니다.",
            "n=4, f=1이고 네 검증자의 stake가 같은 설명용 예입니다.",
            "인증서와 부모 관계는 Narwhal 계층에서 이미 검증됐습니다.",
            "이 f+1 식을 비동기 Bullshark v3의 모든 리더 판정에 적용하지 않습니다.",
          ]}
          interpretation="L4 자체를 먼저 받았다는 사실은 커밋 근거가 아닙니다. B5와 C5가 L4를 부모로 참조해 서로 다른 stake 2를 제공해야 이 구현의 직접 커밋 경로가 열립니다."
        />

        <p>
          새 인증서가 들어오면 구현은 그 인증서를 DAG에 넣고 직전 라운드를 후보 리더 라운드로 계산합니다. 후보가 2 이상의 짝수 라운드가 아니거나, 리더 인증서가 없거나, 지지 power가 임계값보다 작으면 빈 출력으로 돌아갑니다. DAG는 계속 자라지만 합의 순서는 아직 늘어나지 않습니다.
        </p>
        <p>
          L4가 임계값을 넘으면 곧바로 L4만 출력하지 않습니다. <code>order_leaders</code>는 L4에서 이전 짝수 라운드 리더로 가는 경로를 검사합니다. L4에서 L2까지 닿으면 목록에 L2를 추가하고, 목록을 뒤집어 L2부터 처리합니다. 반대로 경로가 없다면 L2를 끼워 넣지 않습니다. 부분 동기식 논문의 DAG 완전성 조건에서는 미래 앵커가 L2에 닿지 않는다면 어느 정상 노드도 L2를 커밋하지 않았다고 판단할 수 있기 때문입니다.
        </p>

        <BullsharkSketch />

        <div id="paper-bullshark-partial">
          <CitationBlock source="Bullshark: The Partially Synchronous Version v1" citeKey={1} href="https://arxiv.org/abs/2209.05633v1">
            <p><strong>문제:</strong> 인증서 DAG 위에서 별도의 합의 메시지를 추가하지 않고 앵커와 전체 순서를 결정해야 합니다.</p>
            <p><strong>기여:</strong> 짝수 라운드 앵커, 다음 홀수 라운드의 f+1표, 이전 앵커 경로 검사와 결정적 인과 이력 출력을 간결하게 설명합니다.</p>
            <p><strong>전제:</strong> n=3f+1, reliable·non-equivocating·complete DAG와 GST 이후의 부분 동기 네트워크를 사용합니다.</p>
            <p><strong>근거 범위:</strong> 이 글의 L2·L4 앵커와 직접·간접 결정 흐름입니다.</p>
            <p><strong>말하지 않는 것:</strong> 비동기 Bullshark의 4라운드 wave와 fallback leader가 같은 규칙이라는 뜻은 아닙니다.</p>
          </CitationBlock>
        </div>

        <div id="paper-bullshark-e67">
          <CitationBlock source="MystenLabs/narwhal commit e67f915 — bullshark.rs" citeKey={2} type="code" href="https://github.com/MystenLabs/narwhal/blob/e67f91530e6bd4ef7808e42f548f07e58764ec5b/consensus/src/bullshark.rs">
            <p><strong>문제:</strong> 인증서가 도착할 때마다 현재 DAG만으로 커밋 가능한 리더와 출력 인증서를 갱신해야 합니다.</p>
            <p><strong>구현:</strong> 짝수 라운드 리더 선택, 다음 라운드의 validity-threshold 지지 계산, 이전 리더 회수, consensus index 부여와 상태 저장을 수행합니다.</p>
            <p><strong>근거 범위:</strong> 보관 종료된 저장소의 정확한 커밋 e67f915에 있는 historical standalone 구현입니다.</p>
            <p><strong>말하지 않는 것:</strong> 현재 Sui의 합의 구현이나 비동기 Bullshark 변형을 나타내지 않습니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="ordering" className="space-y-6">
        <header className="space-y-2">
          <p className="text-sm font-semibold text-primary">02 · 하위 DAG</p>
          <h2 className="text-2xl font-bold">앵커를 고른 뒤에도 어떤 인증서를 어떤 순서로 내보낼지 정해야 합니다</h2>
        </header>

        <BullsharkOrderingViz />

        <p>
          논문은 앵커의 인과적 과거를 “어떤 결정적 규칙”으로 정렬한다고 정의합니다. 고정 구현의 실제 규칙은 더 구체적입니다. <code>order_dag</code>는 앵커에서 DFS를 시작하고, 각 헤더의 부모 digest를 <code>BTreeSet</code> 순서로 읽습니다. 이미 방문한 digest와 작성자별 <code>last_committed</code> 라운드는 건너뛰고, GC 범위 밖의 인증서를 제거한 뒤 <code>round</code> 기준 안정 정렬을 적용합니다.
        </p>
        <p>
          여기에는 별도의 “author 기준 정렬”이 없습니다. 같은 라운드 안의 순서는 정렬된 부모 digest를 따라간 DFS 방문 순서가 안정 정렬 뒤에도 유지됩니다. 따라서 로컬 네트워크 도착 순서나 <code>HashMap</code> 순회를 합의 규칙으로 사용한다고 설명하면 실제 코드와 달라집니다. 자료구조의 순서 보장이 바뀌면 결과도 다시 검증해야 합니다.
        </p>
        <p>
          L2 하위 DAG를 먼저 출력하면 <code>state.update</code>가 작성자별 마지막 커밋 라운드를 올립니다. 이어서 L4를 펼칠 때 이미 처리한 인증서는 제외되어 같은 인증서가 두 번 나오지 않습니다. 각 새 인증서에는 전역 <code>consensus_index</code>가 붙고, 마지막 커밋 상태와 digest가 저장됩니다. 이 출력은 인증서 순서이며, 인증서가 가리키는 배치 원문을 가져와 거래를 실행한 결과는 아닙니다.
        </p>

        <div id="paper-bullshark-utils-e67">
          <CitationBlock source="MystenLabs/narwhal commit e67f915 — consensus ordering utilities" citeKey={3} type="code" href="https://github.com/MystenLabs/narwhal/blob/e67f91530e6bd4ef7808e42f548f07e58764ec5b/consensus/src/utils.rs">
            <p><strong>문제:</strong> 현재 리더에서 도달할 수 있는 이전 리더와 아직 출력하지 않은 인과적 과거를 중복 없이 한 줄로 만들어야 합니다.</p>
            <p><strong>구현:</strong> <code>linked</code>가 라운드를 거슬러 경로를 검사하고, <code>order_dag</code>가 DFS·중복 제거·GC 필터·round 안정 정렬을 수행합니다.</p>
            <p><strong>전제:</strong> 같은 커밋의 <code>Header.parents: BTreeSet&lt;CertificateDigest&gt;</code>, 검증된 DAG와 일치하는 consensus state를 사용합니다.</p>
            <p><strong>근거 범위:</strong> 이 고정 구현의 리더 회수와 하위 DAG 평탄화 경로입니다.</p>
            <p><strong>말하지 않는 것:</strong> 거래 공정성, 애플리케이션 실행 성공, 현재 Sui linearizer의 규칙을 보장하지 않습니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="release" className="space-y-6">
        <header className="space-y-2">
          <p className="text-sm font-semibold text-primary">03 · 변형과 멈춤</p>
          <h2 className="text-2xl font-bold">같은 이름의 프로토콜 변형과 시스템의 실패 동작을 섞지 않습니다</h2>
        </header>

        <BullsharkVariantViz />

        <p>
          부분 동기식 설명과 고정 구현에서는 짝수 라운드 앵커가 다음 홀수 라운드의 f+1 지지를 받는 흐름을 추적했습니다. 전체 비동기 Bullshark v3는 네 라운드를 한 wave로 묶고, 첫째·셋째 라운드의 steady-state leaders와 common coin으로 고르는 fallback leader, 투표 유형과 2f+1 판정을 함께 사용합니다. “Bullshark는 항상 2라운드마다 f+1표로 커밋한다”라고 요약하면 서로 다른 변형을 합친 잘못된 설명이 됩니다.
        </p>
        <p>
          시스템이 지지 임계값을 얻지 못하면 해당 호출은 빈 순서를 반환하고 DAG만 더 쌓습니다. 네트워크가 나뉘거나 예정된 리더가 늦으면 커밋이 멈출 수 있지만, 그 사실만으로 서로 다른 두 순서를 확정했다는 뜻은 아닙니다. Safety는 정상 노드가 충돌하는 순서를 내지 않는지, liveness는 해당 변형의 네트워크 조건이 회복된 뒤 새 순서가 계속 나오는지 따로 판단합니다.
        </p>
        <p>
          재시작 시 고정 구현은 저장된 작성자별 <code>last_committed</code>와 consensus index를 읽고, 인증서 저장소에서 GC 범위 안의 DAG를 다시 만듭니다. 필요한 과거가 GC 경계 밖이라면 임의로 복원하지 않습니다. 합의 출력 뒤에도 배치 바이트가 없거나 실행 검증이 실패하면 애플리케이션은 그 자리에서 멈춰야 하며, 인증서 커밋을 거래 성공으로 바꾸어 기록해서는 안 됩니다.
        </p>

        <div id="paper-bullshark-full">
          <CitationBlock source="Bullshark: DAG BFT Protocols Made Practical v3" citeKey={4} href="https://arxiv.org/abs/2201.05677v3">
            <p><strong>문제:</strong> 비동기 진행을 보존하면서 동기적인 구간에서는 낮은 지연의 fast path를 제공해야 합니다.</p>
            <p><strong>기여:</strong> 4라운드 wave, steady-state·fallback leaders, vote type과 common coin을 결합한 비동기 Bullshark를 제시합니다.</p>
            <p><strong>전제:</strong> n=3f+1 authenticated committee, reliable broadcast와 논문이 정의한 global perfect coin을 사용합니다.</p>
            <p><strong>근거 범위:</strong> 비동기 변형의 leader·wave·liveness 경계를 부분 동기식 구현과 구분하는 데 사용합니다.</p>
            <p><strong>말하지 않는 것:</strong> e67f915의 standalone <code>bullshark.rs</code>가 이 전체 알고리즘을 구현한다는 뜻은 아닙니다.</p>
          </CitationBlock>
        </div>
      </section>
    </article>
  );
}

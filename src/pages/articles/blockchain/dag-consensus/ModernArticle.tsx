import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";
import {
  DAGArrivalOrderCounterexampleViz,
  DAGStateBoundaryViz,
  DAGTransactionTraceViz,
} from "./viz/ModernDAGConsensusViz";

function BoundaryNote({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-border bg-card p-4">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <div className="mt-2 text-sm leading-6 text-muted-foreground">{children}</div>
    </div>
  );
}

function OrderingSketch() {
  return (
    <div className="not-prose overflow-x-auto border border-border bg-[#111318] p-4 text-[12px] leading-6 text-[#e7eaf0]">
      <pre><code>{`// 다음 라운드 블록 f+1개가 앵커를 가리키는지 확인합니다.
if support(anchor) >= f + 1:
    // 결정된 앵커에서 아직 처리하지 않은 인과적 과거를 모읍니다.
    history = uncommitted_ancestors(anchor)

    // 모든 검증자가 공유하는 값으로 같은 순서를 만듭니다.
    ordered = sort(history, by=(round, author, digest))

    // 빠진 배치를 가져온 뒤 각 거래를 한 번만 실행합니다.
    execute(fetch_missing(ordered))`}</code></pre>
    </div>
  );
}

export default function ModernDAGConsensusArticle() {
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-6">
        <header className="space-y-3">
          <p className="text-sm font-semibold text-primary">DAG 합의</p>
          <h2 className="text-3xl font-bold tracking-tight">병렬로 받은 거래가 어떻게 하나의 실행 순서가 될까요?</h2>
        </header>
        <p className="text-lg leading-8 text-foreground/90">
          네 검증자 A·B·C·D가 서로 기다리지 않고 거래를 퍼뜨린다고 가정하겠습니다. Alice의 거래 T1은 A가 만든 블록 A1에 들어갑니다. Narwhal은 A1의 데이터를 나중에 다시 가져올 수 있다는 증거를 만들고, Bullshark는 DAG의 edge를 읽어 어느 앵커까지 결정됐는지 판단합니다. 마지막으로 모든 검증자가 같은 규칙으로 앵커의 인과적 과거를 펼쳐야 T1의 실행 위치가 정해집니다.
        </p>

        <DAGTransactionTraceViz />

        <p>
          DAG는 방향이 있고 순환이 없는 그래프입니다. 여기서는 각 인증된 블록이 vertex이고, 다음 라운드 블록이 이전 라운드 인증서를 가리키는 참조가 edge입니다. Edge를 거슬러 내려가 만나는 모든 블록이 해당 블록의 인과적 과거입니다.
        </p>
        <p>
          중요한 점은 DAG 자체가 전체 순서가 아니라는 것입니다. 서로를 가리키지 않는 A1과 B1은 어느 쪽이 먼저 와도 그래프 규칙을 만족합니다. 따라서 DAG는 데이터를 병렬로 받아 인과관계를 쌓는 구조이고, 합의 규칙은 그 위에서 공통 앵커와 결정적 순서를 선택합니다.
        </p>
      </section>

      <section id="narwhal" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">01 · Narwhal</p>
          <h2 className="mt-2 text-2xl font-bold">데이터를 먼저 인증하고, 작은 참조만 DAG에 쌓습니다</h2>
        </header>
        <p>
          Worker A는 T1을 포함한 배치를 다른 검증자의 worker에게 보냅니다. A의 primary는 자기 worker가 만든 배치 해시와 이전 라운드 인증서들을 묶어 A1을 제안합니다. 서로 다른 검증자 2f+1명이 유효한 A1에 서명하면 Cert(A1)이 됩니다. n=4, f=1이면 세 명의 서명이 필요합니다.
        </p>
        <p>
          인증서 서명자 가운데 적어도 f+1명은 정상입니다. Narwhal의 정상 검증자는 필요한 데이터를 보관하고 요청받으면 제공하므로 Cert(A1)은 A1과 그 인과적 과거를 나중에 회수할 수 있다는 근거가 됩니다. 그러나 현재 검증자가 payload를 이미 가지고 있다는 뜻은 아니며, 영구 보관이나 애플리케이션 유효성도 별도 문제입니다.
        </p>
        <p>
          다음 라운드 블록은 이전 라운드 인증서 가운데 최소 n−f=2f+1개를 부모로 참조합니다. A2가 A1·B1·C1을, B2가 B1·C1·D1을 고르더라도 두 부모 집합은 겹칩니다. 이 겹침이 각 검증자의 DAG가 완전히 갈라지는 것을 막는 재료가 됩니다.
        </p>

        <ExplainedFormula
          question="n=3f+1에서 크기가 q=2f+1인 두 부모 집합은 최소 몇 개가 겹칠까요?"
          idea={<>두 집합의 크기를 더해 전체 검증자 수를 넘는 부분은 반드시 중복입니다. n=4, f=1, q=3이면 두 부모 집합은 적어도 두 개를 공유합니다.</>}
          formula={String.raw`|P_x\cap P_y|\ge 2q-n=f+1`}
          annotatedFormula={String.raw`\underbrace{|P_x\cap P_y|}_{\text{공통 부모}}\ge \underbrace{2q-n}_{\text{전체 수를 넘는 중복}}=\underbrace{f+1}_{\text{장애 한도보다 하나 큼}}`}
          operations={[
            { expression: String.raw`2q-n`, annotation: ["두 집합의 원소 수를 더하고", "전체 후보 수 n을 빼면 최소 중복입니다.", "n=4, q=3이면 6−4=2입니다."] },
            { expression: String.raw`f+1`, annotation: ["공통 부모 수가 Byzantine 한도 f보다 큽니다.", "하지만 이 산술만으로 전체 순서는 생기지 않습니다."] },
          ]}
          terms={[
            { symbol: "P_x,P_y", name: "부모 집합", description: "같은 라운드의 두 인증 블록이 참조하는 직전 라운드 인증서 집합입니다." },
            { symbol: "q", name: "부모 임계값", description: "한 블록이 요구하는 서로 다른 직전 라운드 인증서 수이며 이 예에서는 2f+1입니다." },
            { symbol: "f", name: "Byzantine 한도", description: "고정된 검증자 집합에서 허용한다고 가정한 최대 Byzantine 검증자 수입니다." },
          ]}
          assumptions={[
            "n=3f+1인 고정 equal-weight 검증자 집합입니다.",
            "서명·라운드·작성자·부모 참조가 유효하며 중복 서명은 한 번만 셉니다.",
            "각 블록은 직전 라운드의 서로 다른 인증서 2f+1개 이상을 참조합니다.",
            "부모 교집합은 연결성의 재료일 뿐 앵커 커밋이나 실행 순서를 직접 보장하지 않습니다.",
          ]}
          interpretation="A2의 부모가 {A1,B1,C1}, B2의 부모가 {B1,C1,D1}이면 B1과 C1이 겹칩니다. 그래도 A1과 D1의 상대 순서는 아직 정해지지 않으므로 별도 ordering 규칙이 필요합니다."
        />

        <div id="paper-narwhal-tusk">
          <CitationBlock source="Danezis et al. — Narwhal and Tusk v4" citeKey={1} href="https://arxiv.org/abs/2105.11827v4">
            <p><strong>문제:</strong> 거래 원문 전파를 합의의 주 노드 병목에서 분리합니다.</p>
            <p><strong>이 글에서 확인한 부분:</strong> §3의 2f+1 서명 인증서, 이전 라운드 n−f 부모 참조, 인증서의 인과적 과거와 회수 조건입니다.</p>
            <p><strong>경계:</strong> 논문의 worker·primary·인증된 검증자 집합과 fault model을 전제로 합니다. 논문 성능 수치를 다른 장비의 예상 처리량으로 쓰지 않습니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="bullshark" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">02 · Bullshark</p>
          <h2 className="mt-2 text-2xl font-bold">DAG edge가 앵커에 대한 표가 됩니다</h2>
        </header>
        <p>
          이 글은 저자들이 별도로 정리한 부분 동기식 Bullshark 버전으로 정상 경로를 설명합니다. 이 버전에서는 짝수 라운드마다 미리 정한 검증자의 블록을 앵커로 봅니다. 라운드 2의 앵커가 A2라면 라운드 3 블록이 A2를 가리키는 edge 하나가 A2에 대한 표 하나입니다.
        </p>
        <p>
          어떤 검증자의 로컬 DAG에서 A2를 가리키는 서로 다른 작성자의 블록이 f+1개 이상 보이면 A2를 직접 commit합니다. n=4, f=1에서는 B3와 C3의 두 edge면 조건을 만족합니다. 이후 더 높은 앵커를 결정할 때는 그 앵커에서 이전 앵커로 내려가는 경로를 확인해 중간 앵커를 commit하거나 안전하게 건너뜁니다.
        </p>
        <p>
          전체 비동기 Bullshark는 네 라운드 wave, steady-state leader와 fallback leader, 무작위성을 함께 사용합니다. 따라서 “모든 Bullshark는 두 라운드와 f+1표만 쓴다”고 일반화하면 안 됩니다. 여기서 f+1 규칙은 부분 동기식 버전의 ordering 핵심을 이해하기 위한 정확한 범위입니다.
        </p>

        <OrderingSketch />
        <p className="text-sm leading-6 text-muted-foreground">
          위 코드는 논문의 전체 알고리즘을 옮긴 구현이 아니라, 이 글에서 따라온 결정 경계를 보여주는 의사코드입니다. 실제 구현은 이전 앵커의 간접 결정, equivocation, garbage collection과 재시작 상태까지 처리해야 합니다.
        </p>

        <div id="paper-bullshark-partial">
          <CitationBlock source="Spiegelman et al. — Bullshark: The Partially Synchronous Version v1" citeKey={2} href="https://arxiv.org/abs/2209.05633v1">
            <p><strong>문제:</strong> DAG의 ordering 논리만 떼어 일반 독자가 따라갈 수 있게 정리합니다.</p>
            <p><strong>이 글에서 확인한 부분:</strong> 짝수 라운드 앵커, 다음 라운드 edge의 투표 의미, f+1 commit 규칙, 이후 앵커 경로를 통한 간접 결정입니다.</p>
            <p><strong>경계:</strong> 부분 동기식 버전입니다. 전체 비동기 Bullshark의 wave·fallback·fairness·garbage collection은 원 논문에서 별도로 확인해야 합니다.</p>
          </CitationBlock>
        </div>
        <div id="paper-bullshark">
          <CitationBlock source="Spiegelman et al. — Bullshark v3" citeKey={3} href="https://arxiv.org/abs/2201.05677v3">
            <p><strong>문제:</strong> 동기 구간의 빠른 경로와 비동기 안전성·활성을 한 DAG 해석법에 담습니다.</p>
            <p><strong>이 글에서 확인한 부분:</strong> 네 라운드 wave, steady-state·fallback leader, committed leader의 인과적 과거를 결정적으로 전달하는 구조입니다.</p>
            <p><strong>경계:</strong> 이 글의 단순한 f+1 예시는 위 부분 동기식 논문에서 가져왔습니다. 두 논문의 변형을 한 알고리즘처럼 섞지 않습니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="linearization" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">03 · 선형화</p>
          <h2 className="mt-2 text-2xl font-bold">결정된 앵커의 인과적 과거를 모두 같은 순서로 펼칩니다</h2>
        </header>

        <DAGArrivalOrderCounterexampleViz />

        <p>
          A1과 B1 사이에 edge가 없다면 둘은 동시에 유효할 수 있습니다. 한 검증자는 A1을 먼저 받고 다른 검증자는 B1을 먼저 받을 수 있으므로 로컬 도착 순서는 합의 결과가 될 수 없습니다. 앵커 A2가 결정되면 각 검증자는 A2에서 도달할 수 있고 아직 처리하지 않은 블록을 모은 뒤 프로토콜과 구현이 고정한 결정적 규칙으로 같은 순서를 만듭니다. 구체적인 tie-break는 구현별 자료구조까지 확인해야 합니다.
        </p>
        <p>
          결정적 순서가 생겨도 payload가 자동으로 메모리에 나타나지는 않습니다. Cert(A1)의 서명자에게 빠진 A1 배치를 요청하고 검증한 뒤에야 T1을 실행할 수 있습니다. 따라서 앵커 commit 시각, 필요한 payload를 모두 받은 시각, state root를 만든 시각을 서로 다른 상태로 기록해야 합니다.
        </p>

        <DAGStateBoundaryViz />

        <div className="grid gap-4 md:grid-cols-2">
          <BoundaryNote title="Payload가 늦게 오는 경우">
            앵커와 순서는 유지하되 해당 prefix의 실행을 기다립니다. 인증서를 없던 일로 만들거나 다음 거래부터 먼저 실행하면 검증자별 state가 갈릴 수 있습니다.
          </BoundaryNote>
          <BoundaryNote title="같은 작성자가 equivocation한 경우">
            같은 round·author의 서로 다른 digest를 구분해 검증하고 프로토콜의 선택 규칙을 적용합니다. 자료구조의 map 순서나 먼저 도착한 블록으로 임의 결정하면 안 됩니다.
          </BoundaryNote>
        </div>
      </section>

      <section id="comparison" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">04 · 정리</p>
          <h2 className="mt-2 text-2xl font-bold">DAG가 빠른 이유와 합의를 대신하지 못하는 이유를 함께 봅니다</h2>
        </header>
        <p>
          Narwhal은 여러 worker가 거래 원문을 병렬로 퍼뜨리게 하고, primary와 ordering 계층은 작은 인증서 참조를 다룹니다. 이 분리는 주 노드 한 대가 모든 payload를 받아 다시 전송하는 병목을 줄일 수 있습니다. 그러나 certified block 수나 DAG의 폭을 곧바로 committed TPS로 읽을 수는 없습니다.
        </p>
        <p>
          Bullshark는 이미 쌓인 edge를 표로 해석해 공통 앵커를 결정합니다. 그 뒤 결정적 선형화가 독립 블록을 포함한 인과적 과거를 한 줄로 만들고, payload 회수와 애플리케이션 실행이 이어집니다. 그러므로 이 구조의 전체 지연은 배치 대기, 인증, 앵커 결정, 누락 데이터 회수, 실행을 모두 포함합니다.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <BoundaryNote title="다음 글 · Narwhal 심층">
            Worker와 primary 사이의 batch digest, header, certificate, 누락 batch 회수와 garbage collection을 실제 메시지 단위로 추적합니다.
          </BoundaryNote>
          <BoundaryNote title="다음 글 · Bullshark 심층">
            Direct·indirect commit, skip, wave, leader 경로와 결정적 sub-DAG 선형화를 구현 상태와 함께 추적합니다.
          </BoundaryNote>
        </div>
        <p>
          이제 “DAG 합의”라는 이름을 하나의 상자로 보지 않고, <strong>데이터 전파를 인증하는 Narwhal, 앵커를 결정하는 Bullshark, committed sub-DAG를 정렬하고 실행하는 상태 기계</strong>로 나눠 설명할 수 있어야 합니다. 어느 단계가 멈췄는지 알면 인증서가 부족한 문제, 앵커가 결정되지 않은 문제, payload 동기화 문제와 실행 문제를 서로 구분할 수 있습니다.
        </p>
      </section>
    </article>
  );
}

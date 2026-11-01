import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";
import {
  TuskEvidenceBoundaryViz,
  TuskLivenessBoundaryViz,
  TuskWaveTraceViz,
} from "./viz/ModernTuskViz";

function TuskOrderingSketch() {
  return (
    <div className="not-prose overflow-x-auto border border-border bg-[#111318] p-4 text-[12px] leading-6 text-[#e7eaf0]">
      <pre><code>{`// wave의 마지막 라운드가 끝나면 공통 동전으로 첫 라운드의 지도자를 고릅니다.
leader = choose_leader(common_coin, wave.first_round)

// 다음 라운드에서 서로 다른 작성자의 인증서가 지도자를 가리키는지 셉니다.
support = count_distinct_authors_pointing_to(leader)

// f+1명보다 적으면 이 지도자는 지금 확정하지 않습니다.
if support < f + 1:
    return NO_EXPLICIT_COMMIT

// 현재 지도자에서 직전 확정 지점까지 거슬러 가며 연결된 이전 지도자를 찾습니다.
leaders = recover_linked_previous_leaders(leader)

// 오래된 지도자부터 아직 출력하지 않은 인과 과거를 같은 규칙으로 펼칩니다.
for candidate in oldest_first(leaders):
    output(deterministic_unordered_ancestors(candidate))`}</code></pre>
    </div>
  );
}

export default function ModernTuskArticle() {
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-6">
        <header className="space-y-3">
          <p className="text-sm font-semibold text-primary">Tusk 상세</p>
          <h2 className="text-3xl font-bold tracking-tight">첫 지도자가 실패했는데도 다음 지도자가 왜 그 기록까지 확정할까요?</h2>
        </header>
        <p className="text-lg leading-8 text-foreground/90">
          Narwhal은 거래 묶음을 여러 검증자가 보관했다는 인증서와 부모 연결을 먼저 만듭니다. Tusk는 이 인증된 DAG를 다시 전송하지 않고 각 검증자의 로컬 DAG에서 읽습니다. 아래 예에서는 첫 지도자 L1이 지지를 하나만 받아 건너뛰지만, 다음 지도자 L2가 지지 둘을 얻고 L1까지 이어지는 인과 경로를 품으면서 둘의 순서가 함께 정해집니다.
        </p>

        <TuskWaveTraceViz />

        <p>
          이 그림에서 화살표는 새 인증서가 이전 라운드의 부모를 가리키는 방향입니다. <code>L2 → R2-B → L1</code>이라는 경로가 있으므로 L2를 확정할 때 L1을 더 오래된 지도자로 먼저 복구할 수 있습니다. 첫 wave는 1~3라운드, 두 번째 wave는 3~5라운드입니다. 3라운드를 앞 wave의 동전 공개와 다음 wave의 첫 라운드로 함께 쓰는 것이 겹치는 wave 최적화입니다.
        </p>
        <p>
          논문의 “추가 메시지 0개”는 순서를 고르는 단계가 Narwhal DAG 위에서 별도의 합의 메시지를 더 보내지 않는다는 뜻입니다. 거래 원문 전파, 인증서 생성, 부모 연결, 공통 동전에 필요한 통신까지 사라진다는 뜻은 아닙니다. 또한 순서가 정해졌다고 애플리케이션 실행과 사용자 응답까지 끝난 것도 아닙니다.
        </p>

        <div id="paper-narwhal-tusk">
          <CitationBlock source="Danezis 외 · Narwhal and Tusk · EuroSys 2022" citeKey={1} href="https://arxiv.org/abs/2105.11827v4">
            <p><strong>문제:</strong> 대용량 거래 전파와 합의 순서 결정을 분리하면서 비동기 네트워크에서도 같은 순서를 만들어야 합니다.</p>
            <p><strong>제안:</strong> Narwhal의 인증된 인과 DAG 위에 3라운드 wave, 공통 동전, f+1 지지와 이전 지도자 복구 규칙을 둡니다.</p>
            <p><strong>전제:</strong> 인증된 위원회, n=3f+1, f&lt;n/3의 Byzantine 참여자와 논문이 정의한 비동기 메시지 모델을 사용합니다.</p>
            <p><strong>말하지 않는 것:</strong> 논문의 처리량과 지연이 현재 제품의 수치이거나, Tusk가 현재 Sui 합의라는 뜻은 아닙니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="wave-commit" className="space-y-6">
        <header className="space-y-2">
          <p className="text-sm font-semibold text-primary">01 · 후보와 지지</p>
          <h2 className="text-2xl font-bold">동전은 후보를 고르고, f+1 지지는 그 후보를 확정할 수 있는지 가릅니다</h2>
        </header>
        <p>
          각 wave의 첫 라운드가 끝났을 때는 어느 인증서가 지도자가 될지 아직 모릅니다. 두 번째 라운드의 부모 연결까지 고정된 뒤 공통 동전이 첫 라운드의 작성자를 골라 지도자를 뒤늦게 정합니다. 이 순서가 지켜져야 네트워크를 조절하는 공격자가 지도자를 먼저 안 뒤 그 지도자만 고립시키기 어렵습니다.
        </p>

        <ExplainedFormula
          question="n=4, f=1에서 왜 서로 다른 작성자 2명의 지지가 필요할까요?"
          idea={<>Byzantine 작성자는 최대 한 명입니다. 서로 다른 작성자 f+1명이 지도자를 직접 가리키면 그중 적어도 한 명은 정직합니다. 같은 작성자가 연결을 여러 개 만들더라도 한 명으로만 셉니다.</>}
          formula={String.raw`\begin{aligned}s(L)&=|\{a\mid a\text{가 }L\text{을 직접 참조}\}|\\s(L)&\ge f+1\\n=4,\ f=1&:\ s(L)\ge2\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}\underbrace{s(L)}_{\text{지도자 지지 작성자 수}}&=|\{\underbrace{a}_{\text{서로 다른 작성자}}\mid a\rightarrow L\}|\\s(L)&\ge \underbrace{f+1}_{\text{정직한 작성자 최소 1명}}\\n=4,\ f=1&:\ s(L)\ge2\end{aligned}`}
          operations={[
            { expression: String.raw`f+1=2`, annotation: ["Byzantine 작성자는 최대 1명", "2명 중 적어도 1명은 정직", "동일 작성자의 중복은 제외"] },
            { expression: String.raw`s(L_1)=1`, annotation: ["2라운드 B만 L1을 참조", "기준 2보다 작음", "첫 wave에서는 건너뜀"] },
            { expression: String.raw`s(L_2)=2`, annotation: ["4라운드 A와 B가 L2를 참조", "기준 2를 충족", "두 번째 wave에서 명시적 확정"] },
          ]}
          terms={[
            { symbol: "L", name: "지도자 인증서", description: "해당 wave의 공통 동전이 첫 라운드 후보 중 고른 인증서입니다." },
            { symbol: "a", name: "인증서 작성자", description: "다음 라운드 인증서를 만든 인증된 검증자입니다." },
            { symbol: "s(L)", name: "직접 지지 수", description: "지도자 L을 부모로 포함한 다음 라운드의 서로 다른 작성자 수입니다." },
            { symbol: "f", name: "장애 허용 수", description: "위원회에서 Byzantine일 수 있는 최대 참여자 수입니다." },
          ]}
          assumptions={[
            "위원회는 n=3f+1이고 작성자 신원을 인증합니다.",
            "각 인증서와 부모 연결은 Narwhal 규칙으로 검증됐습니다.",
            "지지는 중복 인증서 수가 아니라 서로 다른 작성자 수로 셉니다.",
            "f+1은 Tusk 지도자 확정 조건이며 Narwhal 가용성 인증 quorum과 다른 수치입니다.",
          ]}
          interpretation="L1은 동전으로 뽑혔지만 지지가 1개라 건너뜁니다. L2는 A와 B 두 작성자의 지지를 받아 명시적으로 확정할 수 있습니다. 동전 선택과 확정은 같은 사건이 아닙니다."
        />

        <div id="paper-tusk-protocol">
          <CitationBlock source="Narwhal and Tusk · Tusk wave와 확정 규칙" citeKey={2} href="https://sonnino.com/papers/narwhal-and-tusk.pdf#page=10">
            <p><strong>문제:</strong> 서로 다른 시점에 DAG를 보는 검증자들이 같은 지도자 순서를 계산해야 합니다.</p>
            <p><strong>규칙:</strong> 3라운드 wave의 마지막에 공통 동전으로 첫 라운드 지도자를 고르고, 두 번째 라운드의 f+1개 인증서가 그 지도자를 가리킬 때 명시적으로 확정합니다.</p>
            <p><strong>근거 범위:</strong> 논문의 알고리즘과 안전성·진행성 주장에 한정합니다.</p>
            <p><strong>말하지 않는 것:</strong> 동전으로 뽑힌 모든 지도자가 확정되거나, 기대 라운드 수가 최악의 시간 상한이라는 뜻은 아닙니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="causal-order" className="space-y-6">
        <header className="space-y-2">
          <p className="text-sm font-semibold text-primary">02 · 인과 과거</p>
          <h2 className="text-2xl font-bold">현재 지도자를 확정한 뒤 이전 지도자와 미출력 조상을 오래된 순서로 펼칩니다</h2>
        </header>
        <p>
          L2의 지지만 확인하고 L2부터 출력하면 L1의 기록을 잃습니다. Tusk는 현재 지도자에서 직전 확정 지점으로 거슬러 가며 연결된 과거 지도자를 찾습니다. L2에서 L1로 가는 경로가 있으므로 L1을 먼저 후보 목록에 넣고, 각 지도자의 아직 출력하지 않은 인과 조상을 정해진 순서로 펼칩니다.
        </p>
        <p>
          로컬 도착 순서는 사용할 수 없습니다. 같은 인증서를 모두 받았더라도 네트워크 지연 때문에 A 노드와 B 노드의 도착 순서는 다를 수 있기 때문입니다. 부모 식별자와 라운드처럼 모든 정직한 노드가 다시 계산할 수 있는 값으로 순서를 정하고, 이미 출력한 인증서는 중복으로 내보내지 않아야 합니다.
        </p>

        <TuskOrderingSketch />

        <p>
          논문에 연결된 프로토타입의 고정 커밋 <code>70dc862</code>도 같은 큰 흐름을 구현합니다. <code>validity_threshold()</code>로 f+1 지지를 검사하고, <code>order_leaders()</code>가 현재 지도자와 연결된 이전 지도자를 찾은 뒤, <code>order_dag()</code>가 인과 과거를 펼칩니다. 그러나 논문의 공통 동전은 구현되어 있지 않습니다. <code>leader()</code>에는 TODO가 남아 있고 실제 선택은 라운드 로빈입니다.
        </p>

        <TuskEvidenceBoundaryViz />

        <div id="paper-tusk-prototype">
          <CitationBlock type="code" source="facebookresearch/narwhal · 고정 커밋 70dc862 · consensus/src/lib.rs" citeKey={3} href="https://github.com/facebookresearch/narwhal/blob/70dc862db090260dc77acdaa807b4584475bafc2/consensus/src/lib.rs#L119-L300">
            <p><strong>확인한 코드:</strong> 지도자 지지 stake를 합산해 f+1보다 작은 경우 건너뛰고, 연결된 과거 지도자와 인과 DAG를 순서대로 출력합니다.</p>
            <p><strong>중요한 차이:</strong> 공통 동전은 TODO이며 테스트 밖에서는 라운드 번호를 이용한 라운드 로빈으로 지도자를 고릅니다.</p>
            <p><strong>프로젝트 경계:</strong> 저장소 자체가 생산용으로 설계되지 않은 연구·벤치마크 구현이라고 밝히며 2023년 10월 31일 보관 처리됐습니다.</p>
            <p><strong>말하지 않는 것:</strong> 이 코드가 논문의 공통 동전을 완성했거나 현재 Sui에서 실행된다는 뜻은 아닙니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="limits" className="space-y-6">
        <header className="space-y-2">
          <p className="text-sm font-semibold text-primary">03 · 진행성의 경계</p>
          <h2 className="text-2xl font-bold">원 논문의 진행성 주장은 2024년 후속 분석과 함께 읽어야 합니다</h2>
        </header>

        <TuskLivenessBoundaryViz />

        <p>
          원 논문은 비동기 적대자 아래에서 지도자 하나를 확정하는 데 기대 7 DAG 라운드가 걸린다고 주장합니다. 메시지 지연이 독립적으로 무작위라는 공통 상황 분석에서는 각 블록이 기대 4.5라운드에 확정된다고 계산합니다. 둘 다 기대값이며 “4.5라운드 안에 반드시 끝난다”는 시간 상한이 아닙니다.
        </p>
        <p>
          Victor Shoup의 2024년 분석은 사양과 양립하는 합리적인 구현 가정에서 더 강한 문제를 제기합니다. 공격자는 메시지를 영원히 버리지 않고 다음 wave가 끝날 때까지 모두 전달하면서도, 모든 참여자가 계속 다음 wave로 진행하는 동안 한 정직한 참여자만 지도자를 확정하게 만들 수 있습니다. 안전한 지도자 순서는 유지되지만 대부분의 참여자가 계속 확정한다는 강한 진행성은 깨집니다.
        </p>
        <p>
          늦게 도착한 지지도 다시 검사하는 적극적 확정과 오랫동안 확정이 없을 때 다음 wave 진행을 멈추는 back-pressure가 완화책으로 제안됩니다. 다만 후속 분석은 이것이 DAG-Rider와 같은 강한 진행성을 자동으로 되돌리지는 않는다고 구분합니다. 따라서 “eventual delivery와 공통 동전이면 Tusk 진행성이 확정됐다”는 문장으로 끝내면 현재 근거를 반영하지 못합니다.
        </p>

        <div id="paper-tusk-liveness-challenge">
          <CitationBlock source="Victor Shoup · Blue fish, red fish, live fish, dead fish · 2024" citeKey={4} href="https://eprint.iacr.org/2024/1235">
            <p><strong>문제 제기:</strong> Tusk의 동전 공개 시점과 wave 종료 때 한 번만 적용하는 확정 규칙 아래에서 강한 진행성이 성립하는지 다시 분석합니다.</p>
            <p><strong>결과:</strong> 모든 메시지를 결국 전달하고 모두 wave를 계속 진행하게 하면서도, 충분히 큰 위원회에서 한 정직한 참여자만 계속 지도자를 확정하는 실행을 구성합니다.</p>
            <p><strong>유지되는 성질:</strong> 공격은 정직한 참여자의 지도자 순서가 충돌하지 않는 안전성까지 깨는 주장이 아닙니다.</p>
            <p><strong>경계:</strong> 적극적 확정·back-pressure·높은 threshold 동전은 각각 다른 비용과 미해결 증명 조건을 가집니다.</p>
          </CitationBlock>
        </div>

        <p>
          현재 Sui 공식 문서는 Mysticeti를 합의 프로토콜로 설명합니다. Mysticeti는 Narwhal·Tusk 계보에서 출발했지만 인증된 DAG와 wave 규칙을 그대로 실행하는 Tusk가 아닙니다. 이 글은 역사적 Tusk 메커니즘과 그 한계를 설명하며 현재 Sui 운영 구조를 대신하지 않습니다.
        </p>

        <div id="paper-sui-current-consensus">
          <CitationBlock source="Sui 공식 문서 · Consensus" citeKey={5} href="https://www.docs.sui.io/develop/sui-architecture/consensus">
            <p><strong>현재 경로:</strong> Sui는 DAG 기반 Mysticeti를 사용한다고 설명합니다.</p>
            <p><strong>구분:</strong> Mysticeti는 여러 검증자가 병렬로 블록을 제안하지만 Tusk의 인증된 DAG·공통 동전 wave와는 다른 결정 규칙을 가집니다.</p>
            <p><strong>근거 범위:</strong> 현재 공개 문서가 설명하는 Sui 합의 구조에 한정합니다.</p>
            <p><strong>말하지 않는 것:</strong> Tusk 연구가 무의미하거나 모든 DAG 합의가 같은 진행성 문제를 가진다는 뜻은 아닙니다.</p>
          </CitationBlock>
        </div>

        <p>
          이제 부모 지도에는 다음 사실을 되돌려 놓을 수 있습니다. Tusk는 인증된 DAG에서 공통 동전으로 후보를 뒤늦게 고르고, f+1 지지로 현재 지도자를 확정하며, 인과 경로를 따라 건너뛴 이전 지도자까지 같은 순서로 복구합니다. 다만 논문의 진행성 주장, 공개 프로토타입의 실제 코드, 후속 반론과 현재 제품 배치는 서로 다른 근거로 관리해야 합니다.
        </p>
      </section>
    </article>
  );
}

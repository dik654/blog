import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";
import {
  MysticetiCommitTraceViz,
  MysticetiDecisionPseudocodeViz,
  MysticetiEvidenceBoundaryViz,
} from "./viz/ModernMysticetiViz";

export default function ModernMysticetiArticle() {
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-6">
        <header className="space-y-3">
          <p className="text-sm font-semibold text-primary">Mysticeti 한 문장</p>
          <h2 className="text-3xl font-bold tracking-tight">왜 ‘인증서 없는 DAG’가 더 빠를까요?</h2>
        </header>
        <p className="text-lg font-semibold leading-8 text-foreground">
          Mysticeti는 블록 검증을 없앤 것이 아니라, <strong>다음 두 라운드의 서명 블록 참조를 투표와 인증서로 다시 읽어 별도 인증서 방송을 기다리지 않는 합의</strong>입니다.
        </p>
        <p className="text-lg leading-8 text-foreground/90">
          검증자 네 명 A·B·C·D가 있고 한 명까지 잘못될 수 있다고 하겠습니다. 라운드 r에서 지도자 블록 L이 거래를 담습니다. r+1의 A·B·C 블록이 L을 처음 지지하면 L은 인증됩니다. 이어서 r+2의 A·B·C 블록이 그 지지 정족수를 인과 과거에 담으면 인증서 블록 세 개가 생기고 L을 직접 확정할 수 있습니다.
        </p>

        <MysticetiCommitTraceViz />

        <p>
          이 경로가 논문이 말하는 세 번의 메시지 지연입니다. 첫 번째는 제안 L, 두 번째는 L을 지지하는 블록들, 세 번째는 그 지지 정족수를 품은 인증서 블록들입니다. Narwhal처럼 각 블록을 DAG에 넣기 전에 서명을 따로 모아 독립된 인증서를 방송하는 단계가 없습니다.
        </p>
        <p>
          하지만 <em>uncertified</em>를 “서명이나 검증이 없다”로 읽으면 안 됩니다. 각 블록은 작성자 서명, epoch와 round, 이전 라운드 부모 정족수, 부모의 유효성을 통과해야 합니다. 사라진 것은 블록마다 만드는 별도의 인증서 메시지이지, 안전성을 확인하는 증거가 아닙니다.
        </p>
      </section>

      <section id="uncertified-votes" className="space-y-6">
        <header className="space-y-2">
          <p className="text-sm font-semibold text-primary">01 · 두 개의 정족수</p>
          <h2 className="text-2xl font-bold">참조 세 개를 봤다고 바로 확정해도 될까요?</h2>
        </header>
        <p>
          아닙니다. 첫 정족수는 L이 다른 충돌 블록과 동시에 인증되지 못하게 합니다. 두 번째 정족수는 충분한 검증자가 그 인증 사실까지 보았다는 확인입니다. 그래서 “L을 지지한 작성자”와 “L의 지지 정족수를 본 인증서 블록 작성자”를 따로 셉니다.
        </p>
        <p>
          Byzantine 지도자가 같은 자리에서 L과 L′을 만들 수도 있습니다. 이때 다음 블록 하나가 둘을 모두 투표한 것처럼 세면 두 후보가 같은 지분을 재사용합니다. Mysticeti는 인과 과거를 정해진 순서로 훑어 그 작성자가 해당 자리에서 처음 지지한 블록 하나만 투표로 인정합니다. 로컬 도착 순서는 노드마다 다르므로 기준으로 쓰지 않습니다.
        </p>

        <ExplainedFormula
          question="n=4, f=1에서 L은 어떤 두 문턱을 넘어야 직접 확정될까요?"
          idea={<>설명용으로 네 검증자의 투표권이 같다고 둡니다. 먼저 r+1에서 서로 다른 세 작성자가 L을 처음 지지해야 L이 인증됩니다. 다음으로 r+2에서 그 지지 정족수를 품은 블록도 서로 다른 세 작성자에게서 나와야 직접 확정됩니다.</>}
          formula={String.raw`\begin{aligned}Q&=2f+1=3\\S(L)&=\{a:\operatorname{firstSupport}(B_a)=L\}\\|S(L)|&\ge Q\quad\Rightarrow\quad L\text{ 인증}\\C(L)&=\{c:B_c\text{가 }S(L)\text{ 정족수를 포함}\}\\|C(L)|&\ge Q\quad\Rightarrow\quad L\text{ 직접 확정}\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}\underbrace{Q}_{\text{필요한 서로 다른 작성자 수}}&=2\underbrace{f}_{\text{최대 Byzantine 수}}+1=3\\\underbrace{S(L)}_{\text{첫 지지 작성자 집합}}&=\{a:\underbrace{\operatorname{firstSupport}(B_a)=L}_{\text{a의 표는 L 하나}}\}\\|S(L)|&\ge Q\Rightarrow\underbrace{L\text{ 인증}}_{\text{첫 번째 문턱}}\\\underbrace{C(L)}_{\text{인증서 블록 작성자 집합}}&=\{c:B_c\text{가 }S(L)\text{ 정족수를 포함}\}\\|C(L)|&\ge Q\Rightarrow\underbrace{L\text{ 직접 확정}}_{\text{두 번째 문턱}}\end{aligned}`}
          operations={[
            { expression: String.raw`Q=2\times1+1=3`, annotation: ["네 명 중 한 명까지 잘못될 수 있음", "서로 다른 작성자 세 명이 필요", "같은 작성자의 중복 블록은 한 번만 셈"] },
            { expression: String.raw`S(L)=\{A,B,C\}`, annotation: ["r+1의 A·B·C가 L을 첫 지지", "|S(L)|=3으로 첫 문턱 통과", "이 시점의 결론은 L 인증"] },
            { expression: String.raw`C(L)=\{A,B,C\}`, annotation: ["r+2의 A·B·C가 지지 정족수를 품음", "|C(L)|=3으로 두 번째 문턱 통과", "이제 L을 직접 확정"] },
          ]}
          terms={[
            { symbol: "Q", name: "정족수", description: "설명용 동일 투표권 n=3f+1 위원회에서 2f+1명입니다. 실제 구현은 서로 다른 작성자의 투표권을 합산합니다." },
            { symbol: "Bₐ", name: "작성자 a의 다음 블록", description: "서명과 부모 검증을 통과한 r+1 블록입니다." },
            { symbol: "S(L)", name: "L의 첫 지지 집합", description: "같은 자리의 후보 가운데 L을 처음 지지한 서로 다른 작성자 집합입니다." },
            { symbol: "C(L)", name: "L의 인증서 블록 집합", description: "L의 지지 정족수를 인과 과거에 포함한 r+2 블록의 서로 다른 작성자 집합입니다." },
          ]}
          assumptions={[
            "손계산을 위해 네 검증자의 투표권을 같게 두었습니다.",
            "각 블록의 서명·epoch·round·부모 정족수와 모든 부모 연결을 먼저 검증했습니다.",
            "같은 작성자가 같은 자리에서 여러 블록을 만들어도 투표권을 중복 합산하지 않습니다.",
            "여기서 직접 확정은 합의 순서의 결정이며 거래 실행·체크포인트 인증과는 다른 상태입니다.",
          ]}
          interpretation="A·B·C의 r+1 지지는 L을 인증합니다. A·B·C의 r+2 인증서 블록은 그 인증 사실을 충분한 검증자가 보았음을 확인해 L을 직접 확정합니다. 첫 정족수만으로 두 번째 결론까지 건너뛰면 안 됩니다."
        />

        <div id="paper-mysticeti">
          <CitationBlock source="Mysticeti: Reaching the Limits of Latency with Uncertified DAGs" citeKey={1} href="https://docs.sui.io/paper/mysticeti.pdf">
            <p><strong>문제:</strong> 블록마다 별도 인증서를 만드는 지연을 줄이면서 Byzantine 위원회가 같은 순서를 결정해야 합니다.</p>
            <p><strong>제안:</strong> 서명 블록 DAG에서 first support, skip pattern, certificate pattern을 읽고 자리마다 commit·skip·undecided를 결정합니다.</p>
            <p><strong>전제:</strong> n=3f+1 위원회, 인증된 블록, 이전 라운드 2f+1 부모와 부분 동기 네트워크의 GST 이후 진행성 전제를 사용합니다.</p>
            <p><strong>말하지 않는 것:</strong> 논문의 0.5초와 처리량이 현재 운영망의 보장 수치이거나 raw 부모 참조 하나가 곧 확정이라는 뜻은 아닙니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="decision-linearize" className="space-y-6">
        <header className="space-y-2">
          <p className="text-sm font-semibold text-primary">02 · 미결정 장벽</p>
          <h2 className="text-2xl font-bold">새 L4가 확정됐는데 왜 L3 때문에 기다릴까요?</h2>
        </header>
        <p>
          지도자 자리의 결과는 세 가지입니다. 충분한 인증서 블록이 있으면 <strong>commit</strong>, 모든 후보에 충분한 비지지 증거가 있으면 <strong>skip</strong>, 어느 쪽도 아니면 <strong>undecided</strong>입니다. 미결정은 실패나 임의 선택이 아니라 더 뒤의 확정된 지도자가 증거를 가져올 때까지 판단을 보류하는 상태입니다.
        </p>
        <p>
          예를 들어 결과가 <code>[commit L1, skip L2, undecided L3, commit L4]</code>라면 L4까지 계산은 끝났어도 외부에는 L1·L2까지만 보냅니다. L4를 먼저 내보낸 뒤 L3이 간접 확정되면 이미 공개한 순서 앞에 L3의 인과 과거를 끼워 넣어야 하기 때문입니다.
        </p>

        <MysticetiDecisionPseudocodeViz />

        <p>
          더 뒤의 확정된 지도자를 <em>anchor</em>로 삼았을 때 L3으로 이어지는 인증 경로가 있으면 L3을 간접 commit하고, 그런 경로가 없다는 규칙상 증거가 있으면 간접 skip합니다. 그제야 L1부터 L4까지 연속된 결정 구간이 열립니다. Linearizer는 commit된 지도자의 인과 조상 중 아직 내보내지 않은 블록만 안정된 순서로 펼칩니다.
        </p>

        <div id="paper-sui-committer-v1823">
          <CitationBlock type="code" source="Sui mainnet-v1.82.3 · base_committer.rs · bf407391" citeKey={2} href="https://github.com/MystenLabs/sui/blob/mainnet-v1.82.3/consensus/core/src/base_committer.rs">
            <p><strong>확인한 코드:</strong> <code>find_supported_block</code>, <code>is_vote</code>, <code>is_certificate</code>, direct commit·skip과 committed anchor 기반 indirect decision입니다.</p>
            <p><strong>전제:</strong> mainnet-v1.82.3 태그의 정확한 커밋 bf4073918ed33cfa0b09c500658fa116a774bcfd와 그 버전의 Committee·DagState를 함께 봅니다.</p>
            <p><strong>경계:</strong> 이 고정 소스는 해당 릴리스의 구현 증거이며 미래 ProtocolConfig나 논문의 모든 선택 사항을 고정하지 않습니다.</p>
          </CitationBlock>
        </div>

        <div id="paper-sui-linearizer-v1823">
          <CitationBlock type="code" source="Sui mainnet-v1.82.3 · UniversalCommitter와 Linearizer" citeKey={3} href="https://github.com/MystenLabs/sui/tree/mainnet-v1.82.3/consensus/core/src">
            <p><strong>확인한 코드:</strong> <code>UniversalCommitter.try_decide</code>는 가장 긴 연속 결정 구간만 반환하고, <code>Linearizer</code>는 이미 commit한 블록을 제외한 인과 sub-DAG를 commit 단위로 만듭니다.</p>
            <p><strong>버전:</strong> 2026년 10월 21일 공개된 mainnet-v1.82.3, 커밋 bf407391을 사용했습니다.</p>
            <p><strong>말하지 않는 것:</strong> 합의 sub-DAG가 만들어졌다는 사실만으로 애플리케이션 실행과 체크포인트 인증까지 끝났다는 뜻은 아닙니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="release" className="space-y-6">
        <header className="space-y-2">
          <p className="text-sm font-semibold text-primary">03 · 어디까지 끝났나</p>
          <h2 className="text-2xl font-bold">빠른 실행 결과를 봤다면 거래가 완전히 끝난 걸까요?</h2>
        </header>
        <p>
          Mysticeti-C가 정하는 것은 블록과 거래의 합의 순서입니다. 논문의 Mysticeti-FPC는 충돌하지 않는 자산 이전의 거래 표를 DAG에 함께 실어 특정 거래를 합의 순서보다 먼저 실행할 수 있게 합니다. 빠른 실행 결과를 받았다는 사실과 합의 commit, 애플리케이션 상태 반영, 체크포인트 인증은 서로 다른 영수증입니다.
        </p>

        <MysticetiEvidenceBoundaryViz />

        <p>
          운영 검증에서도 이 경계를 유지해야 합니다. 네트워크가 갈라진 동안 미결정 자리가 늘고 출력이 멈추더라도 서로 충돌하는 결정이 0개라면 안전성은 유지될 수 있습니다. 네트워크가 안정된 뒤 부모 정족수와 지도자 진행이 회복되어 연속 결정 구간이 다시 늘어나는지는 별도의 진행성 검사입니다.
        </p>
        <p>
          현재 Sui 공식 문서는 Mysticeti를 사용한다고 설명하지만, 논문의 모든 FPC 선택 사항이 항상 켜져 있다고 말하지 않습니다. 또한 공식 문서의 약 0.5초·20만 TPS 수치는 통제된 논문 실험이며 운영망 보장 수치가 아니라고 명시합니다.
        </p>

        <div id="paper-sui-current-consensus">
          <CitationBlock source="Sui 공식 문서 · Consensus" citeKey={4} href="https://docs.sui.io/develop/sui-architecture/consensus">
            <p><strong>현재 제품:</strong> Sui가 DAG 기반 Mysticeti를 사용하며 여러 검증자가 병렬로 블록을 제안한다고 설명합니다.</p>
            <p><strong>결정 경계:</strong> 블록 순서가 shared object 거래의 상대적 실행 순서를 정하지만 실행 비용에 따라 거래가 합의 뒤 취소될 수도 있습니다.</p>
            <p><strong>성능 경계:</strong> 공개 수치는 통제된 벤치마크이고 생산 지표가 아니라고 문서가 직접 구분합니다.</p>
          </CitationBlock>
        </div>

        <p>
          부모 지도에 되돌려 놓을 결론은 이렇습니다. Mysticeti는 인증 증거를 없앤 것이 아니라 DAG의 다음 블록 참조 속에 겹쳐 넣었습니다. 두 정족수를 통과한 지도자를 결정하되, 더 오래된 미결정 자리가 있으면 외부 출력을 멈춥니다. 그리고 합의 순서·빠른 실행·체크포인트 최종성을 서로 다른 완료 상태로 관리합니다.
        </p>
      </section>
    </article>
  );
}

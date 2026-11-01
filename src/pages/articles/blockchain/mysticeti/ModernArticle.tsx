import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";
import { MysticetiBoundaryViz, MysticetiTraceViz } from "./viz/ModernMysticetiViz";

export default function ModernMysticetiArticle() {
  return <article className="space-y-14">
    <section id="overview" className="scroll-mt-24 space-y-6">
      <header className="space-y-3">
        <p className="text-sm font-semibold text-primary">Uncertified DAG · 한 거래 추적</p>
        <h2 className="text-3xl font-bold tracking-tight">Mysticeti는 certificate를 없앤 것이 아니라 DAG 안에서 찾아냅니다</h2>
      </header>
      <p className="text-lg leading-8 text-foreground/90">
        Alice가 Bob에게 보내는 거래가 leader block에 들어갔다고 하겠습니다. Mysticeti-C는 그 block에 대한 별도 certificate를 먼저 만들지 않습니다. 대신 다음 round의 signed blocks가 누구를 지지했는지, 그다음 blocks가 그 vote quorum을 ancestry에 담았는지를 읽어 leader slot을 commit·skip·undecided로 판정합니다.
      </p>
      <MysticetiTraceViz />
      <p>
        이 글이 답할 질문은 하나입니다. <strong>별도 block certificate 없이도 모든 정직한 replica가 어떻게 같은 leader prefix와 같은 sub-DAG 순서를 얻는가?</strong> 답은 first support, direct·indirect decision, undecided barrier, deterministic linearization의 조합입니다.
      </p>
      <aside className="border-l-2 border-primary pl-5 text-sm leading-6 text-muted-foreground">
        <strong className="text-foreground">먼저 구분할 것:</strong> uncertified는 검증하지 않는다는 뜻이 아닙니다. Block signature와 epoch·round·author·parents를 검증하고, proposal·implicit certificate·leader commit·application execution·checkpoint를 서로 다른 상태로 둡니다.
      </aside>
    </section>

    <section id="votes" className="scroll-mt-24 space-y-6">
      <header>
        <p className="text-sm font-semibold text-primary">01 · support와 certificate pattern</p>
        <h2 className="mt-2 text-2xl font-bold">한 author의 first support를 한 표로만 셉니다</h2>
      </header>
      <p>
        Round r의 같은 leader slot에 L과 L′이 생겼다고 하겠습니다. Round r+1의 block은 causal ancestry를 따라가면서 그 slot에서 처음 지지한 block 하나를 고릅니다. L을 first support한 서로 다른 author들의 voting power가 quorum에 이르면 vote pattern이 됩니다. Round r+2의 block이 그 quorum votes를 ancestors로 담으면 L의 implicit certificate block입니다.
      </p>
      <ExplainedFormula
        question="왜 first support와 distinct-author quorum을 함께 검사합니까?"
        idea={<>Later block이 leader vote를 운반하므로 author별 첫 지지 하나만 고른 뒤 중복 없는 voting power를 더해야 합니다. 그래야 equivocation으로 만든 L과 L′이 같은 stake를 동시에 쓰지 못합니다.</>}
        formula={String.raw`\begin{aligned}F(a)&=\operatorname{firstSupport}(B_a)\\V(L)&=\{a:F(a)=L\}\\\sum_{a\in V(L)}w(a)&\ge 2f+1\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}F(a)&=\underbrace{\operatorname{firstSupport}(B_a)}_{\text{a가 처음 지지한 leader}}\\V(L)&=\underbrace{\{a:F(a)=L\}}_{\text{L의 중복 없는 지지자}}\\\underbrace{\sum_{a\in V(L)}w(a)}_{\text{distinct voting power}}&\ge \underbrace{2f+1}_{\text{quorum}}\end{aligned}`}
        operations={[
          { expression: String.raw`\operatorname{firstSupport}(B_a)`, annotation: ["Bₐ의 ancestry를 protocol 순서로 훑습니다.", "같은 slot 후보 가운데 하나만", "author a의 vote로 인정합니다."] },
          { expression: String.raw`V(L)`, annotation: ["L을 처음 지지한 author 집합입니다.", "같은 author의 두 block은", "두 표로 세지 않습니다."] },
          { expression: String.raw`\sum w(a)`, annotation: ["n=4, f=1의 equal-weight 예시라면", "서로 다른 세 author가 필요합니다.", "raw reference 하나만으로는 부족합니다."] },
        ]}
        terms={[
          { symbol: "L", name: "leader block", description: "정해진 leader slot의 signed block 후보입니다." },
          { symbol: "Bₐ", name: "later block", description: "Author a가 뒤 round에 만든 검증된 block입니다." },
          { symbol: "F(a)", name: "first support", description: "같은 slot 후보 중 protocol traversal이 처음 지지로 인정한 block입니다." },
          { symbol: "V(L)", name: "supporter set", description: "L을 처음 지지한 중복 없는 authors의 집합입니다." },
          { symbol: "w(a)", name: "voting power", description: "Pinned committee에서 author a가 가진 weight입니다." },
        ]}
        assumptions={[
          "n=3f+1과 equal weight는 손으로 따라가기 위한 축소 표기입니다.",
          "실제 구현은 committee voting power와 ProtocolConfig를 사용합니다.",
          "Signature·epoch·round·author·ancestor quorum을 먼저 검증합니다.",
          "Vote pattern은 leader decision evidence이지 거래 실행 receipt가 아닙니다.",
        ]}
        interpretation="n=4, f=1이면 서로 다른 세 author의 valid votes가 quorum입니다. Author A가 equivocate해도 A의 stake를 L과 L′ 양쪽에 동시에 더하지 않습니다."
      />
      <pre className="overflow-x-auto border border-border bg-muted/20 p-4 text-sm leading-6"><code>{`// 같은 author·round의 후보 가운데 protocol 순서상 첫 지지를 찾습니다.
supported = find_supported_block(later_block, leader_slot)

// 후보 L을 첫 지지한 서로 다른 author의 voting power만 더합니다.
votes = distinct_power(blocks where supported(block) == L)

// 한 later block이 quorum votes를 ancestry에 담았을 때만 certificate입니다.
is_certificate = votes >= quorum_power`}</code></pre>
      <p>
        반례는 arrival order를 바꾸는 것입니다. 같은 author-round의 L과 L′을 서로 다른 순서로 받은 두 replica도 검증된 ancestor 배열과 같은 traversal 규칙으로 같은 first support를 계산해야 합니다. Wrong epoch, invalid signature, parent quorum 부족은 vote 계산보다 먼저 거절합니다.
      </p>
      <div id="paper-mysticeti"><CitationBlock source="Mysticeti: Reaching the Latency Limits with Uncertified DAGs" citeKey={1} href="https://docs.sui.io/paper/mysticeti.pdf">
        <p><strong>문제:</strong> Certified DAG의 per-block certificate round를 없애면서 3-message-round BFT order와 transaction fast path를 만들어야 합니다.</p>
        <p><strong>기여:</strong> Skip·certificate patterns, direct·indirect slot decisions와 DAG에 transaction votes를 싣는 Mysticeti-FPC를 제시합니다.</p>
        <p><strong>전제:</strong> n=3f+1 Byzantine committee, authenticated signed blocks와 논문의 partial-synchrony·object-conflict model을 사용합니다.</p>
        <p><strong>근거 범위:</strong> Mysticeti-C/FPC의 프로토콜, 증명과 논문 평가 환경에 한정합니다.</p>
        <p><strong>말하지 않는 것:</strong> 논문의 0.5초·200K+ TPS 결과나 모든 FPC 옵션이 현재 Sui 배포에서 그대로 활성이라는 뜻은 아닙니다.</p>
      </CitationBlock></div>
    </section>

    <section id="decisions" className="scroll-mt-24 space-y-6">
      <header>
        <p className="text-sm font-semibold text-primary">02 · direct·indirect decision과 prefix</p>
        <h2 className="mt-2 text-2xl font-bold">Undecided slot 뒤의 결정은 먼저 내보내지 않습니다</h2>
      </header>
      <p>
        Direct rule은 충분한 certificate blocks가 있으면 commit, 충분한 non-support가 있으면 skip으로 판정합니다. 둘 다 부족하면 undecided입니다. 이 상태는 실패가 아니라 미래의 anchor가 더 많은 causal evidence를 가져올 때까지 순서를 보존하는 장벽입니다.
      </p>
      <pre className="overflow-x-auto border border-border bg-muted/20 p-4 text-sm leading-6"><code>{`// 가장 최신 slot부터 direct rule을 적용합니다.
status = try_direct_decide(slot)

// 직접 판정하지 못하면 뒤에서 이미 판정된 anchor를 찾습니다.
if status == undecided:
    status = try_indirect_decide(slot, later_leaders)

// 오래된 slot부터 연속으로 판정된 prefix까지만 외부화합니다.
for leader in oldest_first(leaders):
    if leader.status == undecided:
        break
    emit(commit_or_skip(leader))`}</code></pre>
      <p>
        Indirect rule은 target slot보다 뒤의 첫 committed anchor를 사용합니다. Anchor ancestry에 target leader의 certificate가 있으면 indirect commit, 없으면 indirect skip입니다. Anchor 자체가 undecided라면 target도 그대로 기다립니다.
      </p>
      <p>
        따라서 <code>[commit L1, skip L2, undecided L3, commit L4]</code>에서 외부화할 수 있는 것은 L1·L2뿐입니다. L4를 먼저 내보내면 L3이 나중에 commit될 때 이미 공개한 total order 앞에 새 sub-DAG를 끼워야 합니다. Sui의 <code>UniversalCommitter::try_decide</code>도 첫 undecided를 만나면 prefix 생성을 멈춥니다.
      </p>
      <div id="paper-sui-committer-v1823"><CitationBlock source="Sui mainnet-v1.82.3 · base_committer.rs" citeKey={2} type="code" href="https://github.com/MystenLabs/sui/blob/mainnet-v1.82.3/consensus/core/src/base_committer.rs">
        <p><strong>문제:</strong> Uncertified DAG에서 support·blame·direct/indirect decision을 결정적으로 판정해야 합니다.</p>
        <p><strong>기여:</strong> <code>find_supported_block</code>, vote·certificate 검사, direct commit·skip과 anchor 기반 indirect decision을 구현합니다.</p>
        <p><strong>전제:</strong> <code>mainnet-v1.82.3</code> tag commit <code>bf407391</code>과 matching Committee·ProtocolConfig·DagState를 사용합니다.</p>
        <p><strong>근거 범위:</strong> 이 태그의 consensus leader-decision 구현에 한정합니다.</p>
        <p><strong>말하지 않는 것:</strong> 논문의 모든 pseudocode parameter나 future mainnet configuration을 고정하지 않습니다.</p>
      </CitationBlock></div>
    </section>

    <section id="boundaries" className="scroll-mt-24 space-y-6">
      <header>
        <p className="text-sm font-semibold text-primary">03 · linearization과 완료 경계</p>
        <h2 className="mt-2 text-2xl font-bold">CommittedSubDag는 공통 순서이지 거래 성공 전체가 아닙니다</h2>
      </header>
      <p>
        결정된 leader를 받으면 Linearizer는 아직 commit하지 않은 causal ancestors만 모읍니다. 현재 고정한 Sui 소스는 GC 경계 아래와 이미 committed한 block을 제외하고, round 다음 authority index로 정렬한 block references를 이전 commit digest에 연결합니다. 이는 replica마다 같은 순서를 재구성하기 위한 규칙이지 그 순서가 공정하다는 증명은 아닙니다.
      </p>
      <MysticetiBoundaryViz />
      <p>
        <code>CommittedSubDag</code>가 consumer로 전달되면 consensus order는 정해졌습니다. 하지만 application execution, effects 저장과 checkpoint 반영은 뒤의 처리입니다. Mysticeti-FPC의 transaction votes도 별도 경로입니다. 현재 Sui source에는 explicit reject와 implicit accept vote 자료형이 있지만, 자료형이 존재한다는 사실만으로 모든 protocol configuration에서 같은 fast path가 활성이라고 단정할 수 없습니다.
      </p>
      <div id="paper-sui-linearizer-v1823"><CitationBlock source="Sui mainnet-v1.82.3 · UniversalCommitter·Linearizer" citeKey={3} type="code" href="https://github.com/MystenLabs/sui/tree/mainnet-v1.82.3/consensus/core/src">
        <p><strong>문제:</strong> 여러 leader decision을 연속 prefix와 중복 없는 committed sub-DAG로 consumer에 전달해야 합니다.</p>
        <p><strong>기여:</strong> UniversalCommitter의 longest decided prefix, Linearizer의 ancestry 수집·stable sort·commit chain, transaction vote 자료형과 tracking 경로를 제공합니다.</p>
        <p><strong>전제:</strong> <code>mainnet-v1.82.3</code> exact tag commit <code>bf4073918ed33cfa0b09c500658fa116a774bcfd</code>와 matching store·ProtocolConfig를 사용합니다.</p>
        <p><strong>근거 범위:</strong> 이 태그의 consensus core와 output boundary에 한정합니다.</p>
        <p><strong>말하지 않는 것:</strong> Application execution success, checkpoint durability, ordering fairness나 future feature activation을 자동 보장하지 않습니다.</p>
      </CitationBlock></div>
      <div id="paper-sui-current-consensus"><CitationBlock source="Sui 공식 문서 · Consensus" citeKey={4} href="https://www.docs.sui.io/develop/sui-architecture/consensus">
        <p><strong>확인되는 것:</strong> 현재 공개 문서는 Sui가 DAG 기반 Mysticeti 합의를 사용한다고 설명합니다.</p>
        <p><strong>구분할 것:</strong> 이 제품 배치 사실은 과거 Tusk·Bullshark와 같은 인증된 DAG 규칙을 그대로 실행한다는 뜻이 아닙니다.</p>
      </CitationBlock></div>
    </section>
  </article>;
}

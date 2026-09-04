import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";
import { TuskBoundaryViz, TuskFailureViz } from "./viz/ModernTuskViz";

export default function ModernTuskArticle(){return <article className="space-y-14">
  <section id="overview" className="space-y-6"><header className="space-y-3"><p className="text-sm font-semibold text-primary">Tusk · asynchronous DAG ordering</p><h2 className="text-3xl font-bold tracking-tight">Tusk는 transaction을 다시 broadcast하는 합의가 아니라, Narwhal이 만든 certified DAG를 local하게 읽어 순서를 고른다</h2></header>
    <p className="text-lg leading-8 text-foreground/90">
            Alice→Bob 10 transaction bytes는 먼저 Narwhal workers를 통해 퍼지고 primary header의 digest와 parents가
            availability certificate를 얻어 DAG vertex가 됩니다. Tusk의 입력은 이 certified DAG입니다. Tusk는 공통 coin으로 이미
            DAG에 있는 leader를 선택하고 support가 충분한 leader와 causal history를 deterministic order로 출력합니다.
          </p>
    <p>Paper의 “zero-message overhead”는 Tusk ordering logic이 별도 consensus messages를 보내지 않고 local Narwhal DAG를 조사한다는 뜻입니다. Payload dissemination, DAG certificates와 shared coin을 위한 network communication까지 0이라는 뜻은 아닙니다.</p><TuskBoundaryViz />
    <aside className="rounded-lg border border-primary/30 bg-primary/5 p-5 text-sm leading-6"><strong>책임 분리:</strong> Availability certificate는 bytes를 honest party에서 회수할 수 있다는 evidence이고, Tusk decision은 order입니다. Application execution과 client finality receipt는 그 다음 단계입니다.</aside>
  </section>
  <section id="coin-support" className="space-y-6"><header><p className="text-sm font-semibold text-primary">01 · shared coin and support</p><h2 className="mt-2 text-2xl font-bold">Coin이 leader를 고른 뒤 f+1 causal support가 있는 경우에만 anchor로 사용한다</h2></header>
    <p>Committee가 <code>n=3f+1</code>일 때 Tusk는 odd round마다 앞선 round의 candidate leader를 common coin으로 선택합니다. 각 honest node는 자신의 local DAG에서 다음-round certificates가 그 leader를 causal하게 참조하는지 셉니다. Support가 f+1보다 작으면 leader를 order anchor로 쓰지 않고 다음 기회를 기다립니다.</p>
    <ExplainedFormula question="왜 leader support threshold가 f+1이면 Byzantine-only support를 배제할 수 있는가?" idea={<>Byzantine authors는 최대 f명입니다. 서로 다른 author f+1명의 certificate가 leader를 causal history에 포함하면 그중 적어도 한 명은 honest라서 leader evidence가 honest DAG 확산 경로에 들어갑니다.</>} formula={String.raw`\begin{aligned}s(L)&=\sum_{a\in C}\mathbf{1}[L\prec a]\\s(L)&\ge f+1\\n=4,\ f=1&:\ s(L)\ge2\end{aligned}`}
    annotatedFormula={String.raw`\begin{aligned}s(L)&=\underbrace{\sum_{a\in C}\mathbf{1}[L\prec a]}_{\text{causal support 계산}}\\s(L)&\ge \underbrace{f+1}_{\text{causal support 계산}}\\n=4,\ f=1&:\ s(L)\ge\underbrace{2}_{\text{causal support 계산}}\end{aligned}`}
    operations={[
      { expression: String.raw`\sum_{a\in C}\mathbf{1}[L\prec a]`, annotation: ["causal support이(가) 식의 결과에 기여하는 방식을","계산합니다.","Byzantine authors는 최대 f명입니다."] },
      { expression: String.raw`f+1`, annotation: ["causal support이(가) 식의 결과에 기여하는 방식을","계산합니다.","Byzantine authors는 최대 f명입니다."] },
      { expression: String.raw`2`, annotation: ["causal support이(가) 식의 결과에 기여하는 방식을","계산합니다.","Byzantine authors는 최대 f명입니다."] },
    ]} terms={[{symbol:"L",name:"coin-selected leader",description:"해당 wave에서 shared coin이 고른 DAG certificate입니다."},{symbol:"C",name:"next-round authors",description:"다음 round의 valid certificates를 만든 distinct author 집합입니다."},{symbol:"L≺a",name:"causal ancestry",description:"Author a의 certificate가 leader L을 ancestry에 포함한다는 뜻입니다."},{symbol:"s(L)",name:"causal support",description:"Leader L을 ancestry에 포함한 authors 수입니다."},{symbol:"f",name:"fault bound",description:"n parties 중 Byzantine일 수 있는 최대 수입니다."}]} assumptions={["Authenticated committee에서 n=3f+1, f<n/3입니다.","Narwhal certificates와 causal edges를 완전히 검증합니다.","Support는 중복 vertex가 아니라 distinct author로 셉니다.","f+1은 Tusk anchor 조건이며 generic availability quorum이나 execution receipt가 아닙니다."]} interpretation="n=4,f=1이면 서로 다른 authors 2명의 support가 필요합니다. 한 Byzantine author만 leader를 참조한 경우 s=1이므로 anchor로 채택하지 않습니다." />
    <div id="paper-narwhal-tusk"><CitationBlock source="Narwhal and Tusk paper · arXiv 2105.11827" citeKey={1} href="https://arxiv.org/abs/2105.11827"><p><strong>문제:</strong> Reliable transaction dissemination을 consensus ordering의 leader bottleneck과 분리하고 비동기 상황에서도 progress해야 합니다.</p><p><strong>기여:</strong> Certified causal DAG Narwhal과 shared-coin 기반 asynchronous ordering protocol Tusk를 제시합니다.</p><p><strong>전제:</strong> Message-passing n parties, f&lt;n/3 Byzantine, authenticated membership과 eventually reliable asynchronous links를 사용합니다.</p><p><strong>근거 범위:</strong> Paper의 Narwhal/Tusk construction, proofs와 당시 evaluation에 한정합니다.</p><p><strong>말하지 않는 것:</strong> Paper 수치가 current chain SLA이거나 Tusk가 Commonware Simplex의 implementation이라는 뜻은 아닙니다.</p></CitationBlock></div>
  </section>
  <section id="causal-order" className="space-y-6"><header><p className="text-sm font-semibold text-primary">02 · causal history to total order</p><h2 className="mt-2 text-2xl font-bold">결정된 leader를 거꾸로 추적하고, 아직 출력하지 않은 ancestors를 같은 규칙으로 펼친다</h2></header>
    <p>
            Current leader가 support 조건을 통과하면 node는 DAG ancestry를 거슬러 이전 candidate leaders를 찾습니다. 직접 support를 못
            받은 이전 leader도 committed leader의 causal history에 포함되어 paper rule을 만족하면 함께 결정될 수 있습니다. 결정된 leaders를
            오래된 것부터 처리하고 각 leader가 도달하는 미출력 certificates를 deterministic ordering으로 펼쳐 모든 honest nodes가 같은
            total order를 만듭니다.
          </p>
    <p>Arrival order를 그대로 쓰면 network 지연 차이로 node마다 transaction order가 달라집니다. Stable author/digest order처럼 protocol이 정한 tie-breaker와 duplicate suppression이 필요합니다. Missing ancestor가 있으면 output을 서두르지 않고 certificate·payload를 복구해야 합니다.</p>
    <div id="paper-tusk-protocol"><CitationBlock source="Narwhal and Tusk paper · Tusk protocol and correctness" citeKey={2} href="https://arxiv.org/pdf/2105.11827#page=10"><p><strong>문제:</strong> 각 node가 다른 arrival order로 본 causal DAG에서 같은 leader sequence와 total order를 계산해야 합니다.</p><p><strong>기여:</strong> Odd-round coin leader, f+1 support, causal-history traversal과 zero-extra-message ordering rule을 정의합니다.</p><p><strong>전제:</strong> Valid Narwhal DAG, common coin, distinct-author certificates와 paper의 asynchronous model을 따릅니다.</p><p><strong>근거 범위:</strong> Tusk ordering algorithm, safety·liveness lemmas와 paper terminology에 한정합니다.</p><p><strong>말하지 않는 것:</strong> Local DAG arrival order가 곧 total order이거나 support만으로 payload execution·durability가 끝난다는 뜻은 아닙니다.</p></CitationBlock></div>
  </section>
  <section id="release" className="space-y-6"><header><p className="text-sm font-semibold text-primary">03 · asynchronous liveness and release</p><h2 className="mt-2 text-2xl font-bold">시간 제한 없이 안전하다는 말과 무조건 즉시 끝난다는 말은 다르다</h2></header>
    <TuskFailureViz /><p>
            Asynchronous model에는 알려진 message-delay 상한이 없으므로 “Δ가 지나면 leader를 실패로 간주”하는 partial-synchrony
            timeout proof를 쓰지 않습니다. 대신 eventually reliable delivery와 randomized common coin 아래 충분한 waves를 거치면
            termination하는 확률적 liveness를 주장합니다. Paper의 expected 4.5 rounds는 random-delay analysis 조건의 결과이지
            adversarial delay에서 성립하는 deterministic upper bound가 아닙니다.
          </p>
    <p>Release fixture는 coin disagreement, duplicate author, invalid parent certificate, missing ancestor, arbitrary arrival permutation, payload loss, restart와 long partition을 넣습니다. Valid DAG prefix에 대한 conflicting total order는 0이어야 하고, delivery가 재개되면 progress가 관측되어야 합니다. Ordered digest 뒤 payload bytes를 복구·실행하고 durable state root를 만든 다음에 Alice 요청의 client receipt를 냅니다.</p>
    <p>
            Tusk는 2021 Narwhal paper의 protocol입니다. Current Commonware v2026.7.0 Simplex source의
            notarize/nullify/finalize behavior와 섞어 설명하지 않으며 Bullshark의 deterministic leader schedule·partial-
            synchrony variants도 Tusk 사실로 가져오지 않습니다.
          </p>
    <h3 className="text-xl font-semibold">이 글만으로 확인할 10가지</h3><p>기초 6문제는 Narwhal/Tusk 경계, zero-message 의미, n=4 support, coin leader, causal order와 완료 상태를 묻습니다. 심화 4문제는 Byzantine-only support 반례, arrival permutation, asynchronous liveness와 crash/recovery release를 설계하게 합니다.</p>
  </section>
</article>}

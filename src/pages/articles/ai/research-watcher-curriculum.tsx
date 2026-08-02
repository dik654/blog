import type { ReactNode } from 'react';
import MathFormula from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { CapabilityCheck, ConceptPrimer, LearningHandoff, Misconception, QuestionLead, SourceNotes } from '@/components/learning/ArticleLearning';
import { PromotionDecisionWorkbench, SourceLineageExplorer } from './research-watcher-curriculum/viz/ResearchWatcherExplorers';

function Formula({ latex, meaning, symbols }: { latex: string; meaning: string; symbols: [string, string][] }) {
  return <div data-formula-pair className="not-prose my-6 min-w-0"><div className="min-w-0 overflow-hidden rounded-md border border-border px-2 py-4 sm:p-4"><MathFormula display className="my-0 text-sm sm:text-base">{latex}</MathFormula></div><FormulaNote meaning={meaning} symbols={symbols} /></div>;
}

function ProcessRow({ index, title, children }: { index: string; title: string; children: ReactNode }) {
  return <div className="grid min-w-0 gap-2 border-t border-border py-4 first:border-t-0 sm:grid-cols-[2.2rem_10rem_minmax(0,1fr)] sm:gap-4"><span className="font-mono text-xs font-bold text-muted-foreground">{index}</span><strong className="text-sm">{title}</strong><div className="min-w-0 text-sm leading-relaxed text-muted-foreground">{children}</div></div>;
}

const reviewPacket = `type PromotionReview = {
  sourceEventId: string;
  workId: string;
  workVersionId: string;
  sourceRole: 'primary' | 'explanation' | 'implementation' | 'correction';
  currentTrack: { id: string; currentVersion: string };
  contractDelta: {
    compute: string[];
    data: string[];
    objective: string[];
    runtime: string[];
    verification: string[];
  };
  foundationGates: {
    mechanismChanged: boolean;
    existingFoundationsSufficient: boolean;
    neededToReproduce: boolean;
    reusable: boolean;
  };
  evidence: Array<{ claimId: string; sourceSpan: string; boundary: string }>;
  proposal: {
    by: 'reviewer-9b';
    decision: 'watch' | 'evidence' | 'replace-current' | 'foundation-delta';
    rationaleSpans: string[];
  };
  signature: null | {
    editor: string;
    decision: PromotionReview['proposal']['decision'];
    inputHash: string;
    currentVersion: string;
    signedAt: string;
  };
  supersedes: null | { workVersionId: string; restorableUntil: string };
};`;

export default function ResearchWatcherCurriculumArticle() {
  return (
    <>
      <section id="queue-contract" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">발견 queue는 curriculum이 아니다</h2>
        <QuestionLead question="하루에 수백 건의 새 논문과 회사 글이 들어오면, 가장 최신인 것부터 전부 필수 아티클로 만들면 될까?" answer="안 된다. Feed는 놓치지 않기 위한 inbox이고 학습 경로는 독자가 끝까지 읽을 수 있는 최소 설명이다. 자동화는 발견·정규화·초안까지 넓게 하되, 필수 경로를 늘리는 결정은 현재 글과 학습 계약이 실제로 달라졌다는 근거를 통과해야 한다." />
        <ConceptPrimer items={[
          { term: 'Discovery', meaning: '새 source event를 빠짐없이 queue에 넣는 단계다.', why: '높은 recall이 목표라서 중복과 약한 후보가 섞여도 된다.' },
          { term: 'Promotion', meaning: '후보가 현재 top, 비교 근거 또는 새 기반 중 어디에 들어갈지 정하는 편집 결정이다.', why: '잘못 승격하면 최신 정보가 아니라 끝없는 필수 목록이 된다.' },
          { term: 'Current top', meaning: '한 분야의 지금 경계를 대표하는 교체 가능한 source와 글이다.', why: '새 연구는 과거 위에 계속 쌓이지 않고 기존 top과 먼저 경쟁한다.' },
          { term: 'Canonical floor', meaning: '현재 메커니즘을 이해하는 데 필요한 대표 논문 한 편과 최소 개념이다.', why: '역사를 무한히 거슬러 가지 않고 재현 가능한 첫 바닥에서 멈춘다.' },
        ]} />
        <div className="not-prose my-7 border-y border-border">
          <ProcessRow index="01" title="자동으로 넓게 수집"><p>공식 Atom feed, sitemap과 release event를 읽어 raw payload와 검색 시각을 보존한다.</p></ProcessRow>
          <ProcessRow index="02" title="현재와 좁게 비교"><p>후보를 해당 track의 current top 하나와 다섯 contract 축으로 비교한다.</p></ProcessRow>
          <ProcessRow index="03" title="경로는 작게 유지"><p>대부분은 watchlist나 evidence가 되고, 드물게 current pointer를 교체하며, 기반 추가는 더 드물다.</p></ProcessRow>
        </div>
        <p className="not-prose my-5 border-l-2 border-foreground/30 pl-4 text-sm font-semibold leading-relaxed">경로 불변식 · track 하나는 current source 1개와 canonical paper 1개를 가진다. 승격은 둘 중 하나를 교체하거나, 네 gate를 모두 통과한 foundation을 한 번에 1개만 추가한다. 새 source를 필수 목록 끝에 누적하지 않는다.</p>
        <Misconception>“자동으로 자란다”는 말은 모델이 마음대로 글을 공개한다는 뜻이 아니다. 자동화되는 것은 반복 가능한 수집·비교 자료의 생성이고, 근거·배치·학습 난이도·Viz·수식·반응형 QA를 통과한 글만 공개된다.</Misconception>
      </section>

      <section id="source-identity" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">URL보다 오래가는 identity를 만든다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>논문 v1과 v2는 URL이 다를 수 있지만 같은 연구의 revision이다. 회사 블로그는 같은 결과를 더 쉽게 설명할 수 있고, GitHub release는 논문에 없던 실행 interface를 바꿀 수 있다. 반대로 URL 하나의 내용이 조용히 수정될 수도 있다. 따라서 URL을 연구 identity로 쓰면 중복은 늘고 정정은 놓친다.</p>
          <p><strong>Work</strong>는 “이 연구가 무엇인가”를, <strong>WorkVersion</strong>은 v1·v2처럼 어느 상태인지를, <strong>SourceEvent</strong>는 feed·webhook·재수집에서 무엇을 관측했는지를 나타낸다. Claim은 그 버전에서 검증해야 할 최소 문장이다. 원문 hash, retrieved time과 관계 edge를 함께 남기면 새 버전이 와도 과거 근거를 덮어쓰지 않는다.</p>
          <p>앞의 Ingestion·Knowledge IR 용어로 옮기면 <strong>Work는 여러 revision을 묶는 Source의 논리 identity</strong>, <strong>WorkVersion은 불변 DocumentVersion</strong>, <strong>SourceEvent는 새 snapshot을 ingestion하게 만든 관측 trigger</strong>다. 이름이 바뀐 새 lineage system이 아니라, 논문·회사 글·release처럼 계속 갱신되는 source에 같은 모델을 적용한 운영 view다.</p>
          <p>관계 이름은 W3C PROV-O의 작은 부분만 빌린다. <code>wasRevisionOf</code>는 어느 이전 버전을 고쳤는지, <code>hadPrimarySource</code>는 설명 글이 어느 1차 자료를 사용했는지, <code>wasInvalidatedBy</code>는 무엇 때문에 더 이상 유효하지 않은지 나타낸다. Repository가 논문을 구현한다는 <code>implements</code>는 PROV-O 표준이 아니라 이 제품이 명시적으로 정의한 관계다.</p>
        </div>
        <SourceLineageExplorer />
        <div className="not-prose my-7 border-y border-border">
          <ProcessRow index="Work" title="안정된 연구 단위"><p>arXiv base ID, DOI, 공식 title·author와 명시적 cross-reference로 묶는다. 제목 유사도는 merge 후보일 뿐 확정 키가 아니다.</p></ProcessRow>
          <ProcessRow index="Version" title="불변 snapshot"><p>version ID, content hash, published/updated time과 원문 주소를 저장한다. 새 버전이 와도 이전 snapshot을 보존한다.</p></ProcessRow>
          <ProcessRow index="Event" title="관측 사실"><p>어느 source에서 언제 무엇을 받았는지 raw payload와 delivery ID를 남긴다. 재시도와 중복 delivery를 구분한다.</p></ProcessRow>
          <ProcessRow index="Claim" title="영향을 받는 최소 단위"><p>수치·조건·메커니즘을 source span에 연결한다. 정정되면 전체 사이트가 아니라 이 claim에서 파생된 문장만 찾는다.</p></ProcessRow>
        </div>
      </section>

      <section id="discovery-routing" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">수집과 routing은 해도, publishing은 하지 않는다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>현재 script는 Atom feed에서 논문 metadata를 읽고 sitemap에서 회사 연구 페이지를 찾는다. Repository release에는 delivery 검증과 재처리를 갖춘 webhook consumer가 필요한데, 이는 아직 구현할 다음 단계다. Atom의 <code>updated</code>와 sitemap의 <code>lastmod</code>는 다시 확인할 힌트이지 과학적 주장이 바뀌었다는 증거가 아니다. 원문을 다시 받아 hash와 version 관계를 확인해야 한다.</p>
          <p>첫 routing은 설명 가능하고 recall이 높은 규칙으로 한다. 예를 들어 현재 <code>topics.json</code>에 등록된 <code>KV cache</code>, <code>quantization</code>, <code>serving</code>이 보이면 LLM systems 후보로 보낸다. 현재 script는 점수 2 이상을 queue에 넣고 3 이상을 <code>compare-current-top</code> 검토 lane으로 보낸다. Strong keyword 하나도 3점이므로 이 hint는 승격이나 글 생성이 아니라 reviewer가 먼저 볼 위치일 뿐이다. 그 다음 bounded reviewer는 후보 source의 필요한 section과 current-track packet만 받아 claim과 contract delta를 작성한다.</p>
        </div>
        <div className="not-prose my-7 border-y border-border">
          <ProcessRow index="01" title="Fetch"><p>원본 응답, HTTP metadata, source ID, 발견 시각과 실패를 source별로 격리해 저장한다.</p></ProcessRow>
          <ProcessRow index="02" title="Normalize"><p>추적 parameter를 제거한 URL과 identifier를 만들되 raw URL·payload는 잃지 않는다.</p></ProcessRow>
          <ProcessRow index="03" title="Resolve identity"><p>명시적 arXiv version·DOI·release commit을 먼저 쓰고, title·author similarity는 사람 검토가 필요한 후보 edge로 둔다.</p></ProcessRow>
          <ProcessRow index="04" title="Route"><p>deterministic keyword로 후보 track을 넓게 고른 뒤 reviewer가 current top과 실제 관련성을 판정한다.</p></ProcessRow>
          <ProcessRow index="05" title="Queue"><p>현재는 <code>watchlist</code>, <code>compare-current-top</code>, <code>evidence-review</code> 세 hint와 <code>discovered</code> 상태만 만든다. Duplicate와 correction은 identity·invalidation 단계가 붙은 뒤에만 판정한다.</p></ProcessRow>
        </div>
      </section>

      <section id="mechanism-diff" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">모델 이름이 아니라 다섯 계약을 비교한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>새 이름과 높은 benchmark는 배울 메커니즘을 말해 주지 않는다. 후보와 현재 글을 같은 질문으로 다시 읽는다. 어떤 연산을 추가하거나 없앴는가, 데이터 단위와 생성 과정이 달라졌는가, 최적화 목표가 달라졌는가, state·memory·latency interface가 달라졌는가, 성공을 판정하는 검증 계약이 달라졌는가?</p>
          <p>이 비교는 “좋다/나쁘다” 점수 하나가 아니다. 예를 들어 같은 Transformer를 더 크게 학습해 점수가 오른 경우는 compute scale의 evidence다. 반면 MoE(Mixture of Experts, token마다 전체가 아니라 일부 expert만 호출하는 구조)의 router가 일부 expert만 선택한다면 compute와 runtime contract가 달라진다. 교체 이유는 이름이나 날짜가 아니라 독자가 새로 계산·구현·진단해야 할 delta다.</p>
        </div>
        <Formula latex={String.raw`\underbrace{A}_{\text{비교 축}}=\{a_1,a_2,a_3,a_4,a_5\}`} meaning="후보와 현재 글을 모델 이름이나 발표 날짜가 아니라 계산·데이터·목표·실행·검증이라는 같은 다섯 질문으로 비교한다. 긴 영문 이름은 바로 아래 주석으로 내려 수식의 관계부터 크게 읽히게 한다." symbols={[[String.raw`A`, '항상 같은 순서로 확인하는 다섯 계약 축의 집합'], [String.raw`a_1`, 'compute: 어떤 연산과 자원을 쓰는가'], [String.raw`a_2`, 'data: 어떤 입력 단위와 생성 과정을 쓰는가'], [String.raw`a_3`, 'objective: 무엇을 최적화하는가'], [String.raw`a_4`, 'runtime: state·memory·latency interface가 어떻게 달라지는가'], [String.raw`a_5`, 'verification: 성공과 실패를 무엇으로 판정하는가']]}/>
        <Formula latex={String.raw`\underbrace{\Delta C}_{\text{달라진 계약}}=\{\,a\in A\mid\underbrace{v_a^{+}}_{\text{후보 값}}\ne\underbrace{v_a^{0}}_{\text{현재 값}}\,\}`} meaning="다섯 축의 이름 자체가 새로 생기는지를 비교하지 않고, 같은 축 안의 계약 값이 달라졌는지를 찾는다. 이렇게 해야 runtime 축의 batch interface가 streaming state interface로 바뀐 경우처럼 축 내부 변화를 정확히 delta로 남길 수 있다." symbols={[[String.raw`a`, '다섯 축 중 지금 비교하는 축 하나'], [String.raw`v_a^{+}`, '후보 source에서 읽은 축 a의 구체적인 계약 값'], [String.raw`v_a^{0}`, '현재 top이 가진 같은 축의 계약 값'], [String.raw`\Delta C`, '후보와 현재의 계약 값이 실제로 다른 축만 모은 집합'], [String.raw`\ne`, '두 계약 값이 같지 않음을 검사하는 비교']]}/>
        <PromotionDecisionWorkbench />
      </section>

      <section id="promotion" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">현재 글 교체와 기반 추가를 분리한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Contract가 바뀌었어도 기존 글의 state, probability, optimization 같은 기반으로 새 방식을 충분히 설명할 수 있다면 current top만 교체한다. 이전 top은 provenance history와 비교 근거로 남지만 필수 글 한 편으로 독자 앞에 다시 쌓지 않는다.</p>
          <p>새 기반은 네 질문에 모두 “예”일 때만 만든다. 메커니즘이 실제로 달라졌는가? 기존 기반만으로 설명할 수 없는가? 독자가 계산·구현·실패 진단을 하려면 꼭 필요한가? 다른 현재 글에도 재사용되는가? 하나라도 아니면 새 기반이 아니라 해당 current article 안의 설명 또는 evidence다.</p>
        </div>
        <div className="not-prose my-7 border-y border-border">
          <ProcessRow index="Watch" title="관찰만 유지"><p>관련성이나 근거가 약하고 현재 계약을 바꾸지 않는다. 다음 version과 독립 재현을 기다린다.</p></ProcessRow>
          <ProcessRow index="Evidence" title="비교 근거 갱신"><p>benchmark, scale, 새로운 ablation처럼 설명을 보강하지만 읽는 순서는 바꾸지 않는다.</p></ProcessRow>
          <ProcessRow index="Replace" title="현재 top 교체"><p>재사용 가능한 contract가 바뀌었다. 현재 글을 수정하거나 새 독립 질문의 글로 교체하고 이전 top은 history로 내린다.</p></ProcessRow>
          <ProcessRow index="Delta" title="최소 기반 추가"><p>네 gate를 모두 통과한 개념 한 개만 가장 가까운 하단에 추가한다. 논문 연대기 전체를 다시 열지 않는다.</p></ProcessRow>
          <ProcessRow index="Rollback" title="승격 되돌리기"><p>History의 이전 current pointer와 그때의 input hash를 복원하고 rollback도 서명한다. 함께 추가한 foundation은 다른 current 글이 참조하지 않을 때만 제거한다.</p></ProcessRow>
        </div>
      </section>

      <section id="invalidation" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">정정은 다음 전체 재작성까지 기다리지 않는다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>수치 하나가 정정됐다고 모든 글을 재생성하면 비싸고 불안정하다. 반대로 다음 정기 build까지 기다리면 틀린 claim이 계속 공개된다. Evidence → extracted claim → explanatory sentence → article → learning path의 edge를 저장해 두고, 바뀐 evidence에서 도달 가능한 downstream만 stale로 표시한다.</p>
          <p>여기서 <code>I(e)</code>는 Knowledge IR 글의 <code>I(ΔS)</code>와 같은 reachability closure다. 앞 글은 바뀐 source span 집합 <code>ΔS</code>에서 시작하고, Watcher는 correction·withdrawal·hash change로 확인된 event <code>e</code>가 가리키는 span에서 시작할 뿐이다. 따라서 두 식은 서로 다른 무효화 방식이 아니라 같은 provenance graph 계산의 입력 경계를 다르게 쓴다.</p>
          <p>Retraction Watch나 Crossref relation은 DOI metadata가 deposit된 저널 문헌의 경보를 주는 입력이며 arXiv preprint 정정을 일반적으로 대신하지 않는다. arXiv는 새 version comment·withdrawal과 저자 errata를 따로 확인한다. 최종 action 전에는 publisher page와 새 version을 확인하고, 정정의 범위가 특정 구성요소 제거 실험인지 결론 전체인지 구분한다. 영향받은 공개 글에는 release block을 걸고 해당 source span, 수식, Viz label과 이 글의 완성도 점검 문제만 targeted rebuild한다.</p>
        </div>
        <Formula latex={String.raw`\begin{aligned}\underbrace{I(e)}_{\text{다시 검토할 downstream}}&=\{\,n\mid\underbrace{e\leadsto n}_{\text{근거 edge로 도달 가능}}\,\}\\[-0.1em]\underbrace{B}_{\text{공개 차단 집합}}&=I(e)\cap\underbrace{P}_{\text{현재 공개된 node}}\end{aligned}`} meaning="변경된 evidence e에서 provenance edge를 따라 도달할 수 있는 node만 영향 집합 I(e)로 잡고, 그중 현재 공개된 node P와 겹치는 부분을 즉시 차단한다. 그래프 도달 가능성을 쓰는 이유는 관련 없는 글을 재생성하지 않으면서도 간접 요약을 거친 stale claim을 놓치지 않기 위해서다." symbols={[[String.raw`e`, '수정·철회·hash 변경이 확인된 evidence node'], [String.raw`n`, 'claim, 문장, Viz, article 또는 learning-path node'], [String.raw`e\leadsto n`, 'provenance edge를 하나 이상 따라 e에서 n으로 도달할 수 있음'], [String.raw`I(e)`, 'e의 변경으로 다시 검토해야 하는 모든 downstream node'], [String.raw`P`, '현재 사용자에게 공개된 node 집합'], [String.raw`B`, '수정이 끝날 때까지 release를 차단할 공개 node 집합']]}/>
      </section>

      <section id="small-model-packet" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">4B·9B 모델은 판단 범위를 좁혀 쓴다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>작은 모델에게 하루치 feed, 모든 논문과 전체 sidebar를 한 번에 주면 identity merge와 curriculum 판단이 섞인다. 4B extractor는 source section 하나와 schema만 받아 claim, 수치, qualifier와 exact span을 낸다. 9B reviewer는 그 결과와 한 track의 current packet만 받아 다섯 delta와 네 gate를 채운다. Graph order 변경과 publish 권한은 deterministic orchestrator가 가진다.</p>
          <p>각 packet에는 source 역할과 금지 문장을 함께 넣는다. “새로우면 필수”, “회사 글이 자기 논문을 독립 검증”, “GitHub release가 production 품질 증명” 같은 conclusion은 validator가 거부한다. 모델의 prose가 아니라 source span과 structured decision이 다음 단계의 입력이 된다.</p>
        </div>
        <pre className="not-prose my-6 whitespace-pre-wrap break-words rounded-md border border-border bg-muted/20 p-4 text-[11px] leading-6 sm:text-xs"><code>{reviewPacket}</code></pre>
        <div className="not-prose my-7 border-y border-border">
          <ProcessRow index="4B" title="Section extractor"><p>원문 한 section, figure·equation address, output schema와 forbidden claims만 받는다. 원문에 없는 해석은 <code>unknown</code>으로 남긴다.</p></ProcessRow>
          <ProcessRow index="9B" title="Track reviewer"><p>정규화된 claim, current top summary, 다섯 contract와 네 foundation gate만 받는다. 전체 사이트를 다시 쓰지 않는다.</p></ProcessRow>
          <ProcessRow index="Rule" title="Deterministic validator"><p>source span 존재, version 관계, 필수 field, decision consistency와 duplicate edge를 검사한다.</p></ProcessRow>
          <ProcessRow index="Human" title="Editorial signature"><p>근거의 독립성, 쉬운 서사, 글 경계, 수식 설명과 Viz가 실제 이해를 돕는지 확인한 뒤 서명한다.</p></ProcessRow>
        </div>
      </section>

      <section id="implementation-evaluation" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">현재 구현에서 다음으로 무엇을 붙일까?</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>이 저장소의 <code>scripts/research-discover.mjs</code>는 공식 Atom feed와 sitemap을 읽고 URL을 정규화하며, <code>topics.json</code> 규칙으로 후보 track을 제안한다. 각 source 실패를 격리하고 <code>queue.json</code>에 보존하며, user systemd timer가 매일 07:30 KST에 실행한다. 중요한 경계는 이 script가 글을 공개하지 않는다는 점이다.</p>
          <p>다음 구현 단위는 URL-only identity를 Work·WorkVersion·SourceEvent로 확장하고 GitHub release webhook consumer를 붙인 뒤, queue candidate와 current track을 합친 immutable review packet을 만드는 것이다. 기존 queue의 <code>existingFoundationsSufficient</code> 극성을 유지해 false일 때만 기반 부족 gate가 열린다. Editorial decision에는 reviewer, input hash, current version과 시각을 서명해 같은 입력의 결정이 왜 달라졌는지 추적한다. <code>placementHint</code>에는 publish 권한을 주지 않고, 그 다음에만 article draft와 targeted invalidation을 연결한다.</p>
        </div>
        <div className="not-prose my-7 border-y border-border">
          <ProcessRow index="Recall" title="Discovery 평가"><p>알고 있는 official release fixture 중 queue에 들어온 비율과 source별 fetch 실패를 따로 본다.</p></ProcessRow>
          <ProcessRow index="Route" title="Routing 평가"><p>top-k 후보 track 안에 정답이 있는 비율과 잘못된 category 비율을 측정한다.</p></ProcessRow>
          <ProcessRow index="Merge" title="Identity 평가"><p>같은 work를 갈라놓은 false split과 다른 work를 합친 false merge를 별도로 센다.</p></ProcessRow>
          <ProcessRow index="Fresh" title="무효화 평가"><p>정정 fixture가 stale claim을 얼마나 빨리 찾는지, 관련 없는 글을 얼마나 차단하는지 본다.</p></ProcessRow>
          <ProcessRow index="Promote" title="편집 평가"><p>실제 학습 계약을 바꾼 승격의 precision, reviewer 시간과 한 달 뒤 되돌린 비율을 기록한다.</p></ProcessRow>
        </div>
        <CapabilityCheck items={[
          'Feed item과 필수 article을 같은 것으로 취급하지 않는다.',
          'Work, WorkVersion, SourceEvent와 Claim의 identity를 분리한다.',
          '후보를 compute·data·objective·runtime·verification contract로 비교한다.',
          '현재 top 교체와 최소 foundation delta를 네 gate로 구분한다.',
          '정정된 evidence에서 영향받은 공개 claim만 찾아 차단한다.',
          '4B extractor, 9B reviewer와 publish orchestrator의 권한을 분리한다.',
        ]} />
        <LearningHandoff
          description="Watcher의 산출물은 링크 모음이 아니라 source identity, version diff, evidence packet과 승격 결정이다. Parser와 provenance graph가 준비되지 않은 후보는 공개 지식으로 자동 승격하지 않는다."
          items={[
            { label: '막히면', slug: 'knowledge-source-ingestion', title: '멀티소스 Ingestion', reason: '발견한 PDF·HTML·video·repository를 재현 가능한 version과 locator로 고정한다.' },
            { label: '막히면', slug: 'knowledge-ir-evidence-lineage', title: 'Knowledge IR · Evidence Lineage', reason: '새 claim과 기존 claim의 support·contradiction·supersession 관계 및 영향 범위를 계산한다.' },
            { label: '막히면', slug: 'rag-pipeline', title: 'RAG 파이프라인', reason: '바뀐 evidence가 실제 query context와 answer trace에 어디까지 사용됐는지 확인한다.' },
            { label: '적용하기', slug: 'research-codar-2026', title: 'CoDaR 연구 재구성', reason: '후보 발견부터 source reconstruction, transfer question, 승격 판정까지 한 연구를 끝까지 처리한다.' },
          ]}
        />
        <SourceNotes sources={[
          { label: 'arXiv API Access', href: 'https://info.arxiv.org/help/api/index.html', note: '공개 API, identifier와 version-aware retrieval의 공식 출발점. arXiv 등록은 peer review나 정확성 보증이 아니다.' },
          { label: 'W3C PROV-O', href: 'https://www.w3.org/TR/prov-o/', note: 'Entity, Activity, Agent와 revision·primary source·invalidation 관계를 표현하는 표준 vocabulary.' },
          { label: 'Crossref · Retraction Watch data', href: 'https://www.crossref.org/documentation/retrieve-metadata/retraction-watch/', note: 'REST API update-to relation으로 correction·retraction 경보를 가져오는 공식 안내.' },
          { label: 'Crossref · Versioning', href: 'https://www.crossref.org/documentation/principles-practices/best-practices/versioning/', note: 'version마다 고유 identifier와 관계를 남기는 원칙.' },
          { label: 'GitHub · Webhooks', href: 'https://docs.github.com/en/webhooks/about-webhooks', note: 'polling 대신 event delivery를 받고 delivery를 검증·재처리하는 공식 동작.' },
          { label: 'GitHub · Release event', href: 'https://docs.github.com/en/webhooks/webhook-events-and-payloads#release', note: 'release action과 payload schema. Release 존재는 production 품질의 증명이 아니다.' },
          { label: 'RFC 4287 · Atom', href: 'https://www.rfc-editor.org/rfc/rfc4287', note: 'feed entry의 id, updated, link 등 수집 단계의 공통 구조.' },
          { label: 'Sitemaps protocol', href: 'https://www.sitemaps.org/protocol.html', note: 'URL과 last modification hint를 발견하는 형식. lastmod는 claim 변경 증거가 아니다.' },
        ]} />
      </section>
    </>
  );
}

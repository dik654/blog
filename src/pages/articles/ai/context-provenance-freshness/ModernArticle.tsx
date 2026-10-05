import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import { ProvenanceFreshnessViz } from "../context-engineering/viz/ModernContextEngineeringViz";

export default function ContextProvenanceFreshnessArticle() {
  return <div className="space-y-16">
    <section id="overview" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Retrieved fragment는 text와 provenance receipt를 함께 가져야 합니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          2026년 8월 15일, 직원 A가 연차 승인 규칙을 묻습니다. 검색 결과에는 문구가 더 비슷한
          <code>policy-v6</code>(similarity .92, validUntil 7월 31일)와 현재 정본
          <code>policy-v7</code>(similarity .81, validFrom 8월 1일)이 함께 있습니다.
          Caller는 tenant A의 HR reader이고, 답에는 <code>policy://leave/section-4@v7</code>의
          digest까지 연결해야 합니다.
        </p>
        <h3>그림을 보기 전에 결과를 예상해 보세요</h3>
        <ol>
          <li>질문과 더 비슷한 v6(.92)를 v7(.81)보다 먼저 넣어야 할까요?</li>
          <li>Source URL 하나만 남기면 나중에 같은 문장과 판을 다시 찾을 수 있을까요?</li>
          <li>Provenance metadata가 완전하면 fragment 내용도 참이라고 보장할까요?</li>
        </ol>
        <p>
          세 답은 모두 <strong>아니요</strong>입니다. ACL과 질의 시점의 validity를 먼저 통과시키고
          canonical source와 revision으로 충돌을 해결합니다. Provenance는 생성·변환 경로를
          증명하지만 내용의 진실성을 대신 판정하지 않습니다.
        </p>
      </div>
      <ProvenanceFreshnessViz />
      <ContentBoundary article="context-provenance-freshness" />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>RAG가 찾은 문장만 context에 넣으면 model과 reviewer는 원본·revision·시점·권한을 확인할 수 없습니다. <strong>Context provenance</strong>는 fragment가 어느 entity에서 어떤 activity를 거쳐 만들어졌고 누가 책임지는지를 다시 추적할 수 있게 하는 metadata입니다.</p>
      </div>
      <TermBreakdown title="Fragment receipt의 필드" items={[{term:"Source identity",description:"원본 URI·document ID·section path처럼 같은 entity를 다시 찾는 key입니다."},{term:"Revision identity",description:"Version·commit·content digest로 동일 이름의 서로 다른 판을 구분합니다."},{term:"Freshness interval",description:"updatedAt·retrievedAt·validFrom·validUntil을 분리해 언제의 사실인지 표시합니다."},{term:"Access scope",description:"Tenant·role·purpose에 따라 이 fragment를 현재 caller가 읽을 수 있는지 나타냅니다."},{term:"Derivation",description:"원문→chunk→embedding index→reranked result의 변환 chain을 남깁니다.",boundary:"Metadata가 있다는 사실만으로 내용의 진실성은 보장되지 않습니다."}]}/>
    </section>
    <section id="fragment-shape" className="scroll-mt-20"><h2 className="mb-5 text-2xl font-bold">Text와 metadata를 분리하지 않고 하나의 typed fragment로 전달합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>Chunk text를 복사한 뒤 source URL을 별도 배열에 두면 reranking·dedup·serialization 과정에서 대응이 깨질 수 있습니다. Fragment ID와 source receipt를 같은 record로 유지하고 citation도 그 record에서 생성합니다.</p></div></section>
    <section id="conflict" className="scroll-mt-20"><h2 className="mb-5 text-2xl font-bold">충돌은 similarity가 아니라 canonical source·version·validity rule로 해결합니다</h2><ExplainedFormula question="서로 다른 두 policy fragment 가운데 어떤 것을 context에 넣나요?" idea={<p>먼저 caller의 access scope와 질의 시점의 validity를 검사합니다. 그 뒤 canonical source priority와 revision order로 하나를 고릅니다. 문장이 질문과 더 비슷하다는 이유만으로 stale policy를 채택하지 않습니다.</p>} formula={String.raw`c^*=\arg\max_{c\in C}\{P(c),R(c)\}\;\text{s.t.}\;ACL(c,u)\land t\in V(c)`} annotatedFormula={String.raw`\begin{aligned}C'&=\underbrace{\{c\in C:ACL(c,u)\}}_{\text{현재 caller가 읽을 수 있는 fragment만 남김}}\\C''&=\underbrace{\{c\in C':t\in V(c)\}}_{\text{질의 시점에 유효한 version만 남김}}\\c^*&=\underbrace{\arg\max_{c\in C''}(P(c),R(c))}_{\substack{\text{canonical source priority를 먼저,}\\\text{그 안에서 최신 revision을 선택}}}\end{aligned}`} operations={[{expression:String.raw`\{c\in C:ACL(c,u)\}`,annotation:["fragment scope와 caller를 비교해","권한 밖 source를 제거"]},{expression:String.raw`\{c\in C':t\in V(c)\}`,annotation:["질의 시각을 validity interval과 비교해","stale·future version을 제거"]},{expression:String.raw`\arg\max(P(c),R(c))`,annotation:["source priority를 먼저 적용하고","동일 source 안에서 revision을 선택"]}]} terms={[{symbol:"C",name:"Candidate fragments",description:"Retriever가 반환한 fragment 집합입니다."},{symbol:String.raw`ACL(c,u)`,name:"Access check",description:"Caller u가 fragment c를 읽을 수 있는지 판정합니다."},{symbol:String.raw`V(c)`,name:"Validity interval",description:"Fragment의 사실이 적용되는 시각 구간입니다."},{symbol:String.raw`P(c)`,name:"Source priority",description:"정본으로 지정된 source의 우선순위입니다."},{symbol:String.raw`R(c)`,name:"Revision order",description:"같은 source 안에서 version을 비교하는 순서입니다."}]} assumptions={["Source priority와 revision comparison rule을 query 전에 versioning합니다.","ACL·validity metadata가 없는 fragment는 permissive default가 아니라 별도 reject/review로 보냅니다.","Semantic relevance score는 위 gate를 통과한 뒤 ranking에만 사용합니다."]} interpretation="policy-v6가 질문 문구와 더 비슷해도 8월 1일 이후 canonical v7이 유효하면 v6는 context에서 제외합니다."/></section>
    <section id="release" className="scroll-mt-20"><h2 className="mb-5 text-2xl font-bold">Release 전에 source를 거꾸로 재생하고 stale conflict fixture를 통과시킵니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>최종 citation에서 원문 entity와 revision까지 도달하는지, index 갱신 중 v6·v7이 함께 검색될 때 v7을 고르는지, tenant B fragment가 tenant A request에 섞이지 않는지 검사합니다.</p></div><div id="paper-w3c-prov" className="not-prose mt-8 scroll-mt-24"><CitationBlock type="paper" citeKey={1} source="W3C Recommendation — PROV-O" href="https://www.w3.org/TR/prov-o/">Entity·Activity·Agent와 generation·use·derivation 관계를 표현하는 interoperable provenance ontology입니다. 이 글은 해당 모델을 context fragment receipt의 직관으로 재사용하며, PROV-O 자체가 retrieval relevance·truth·ACL을 판정한다고 주장하지 않습니다.</CitationBlock></div></section>
  </div>;
}

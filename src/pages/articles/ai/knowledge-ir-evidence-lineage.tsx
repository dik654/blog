import M from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import {
  CapabilityCheck,
  ConceptPrimer,
  LearningHandoff,
  Misconception,
  QuestionLead,
  SourceNotes,
} from '@/components/learning/ArticleLearning';
import {
  KnowledgeIrLineageExplorer,
  RevisionImpactExplorer,
} from './knowledge-system-core/viz/KnowledgeSystemExplorers';

export default function KnowledgeIrEvidenceLineageArticle() {
  return (
    <>
      <section id="document-versus-ir" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Normalized document는 읽는 순서이고 Knowledge IR은 검증하는 관계다</h2>
        <QuestionLead
          question="Heading, paragraph, table과 formula가 순서대로 든 JSON이 있으면 이미 Knowledge IR 아닌가?"
          answer="아직 아니다. 그것은 원문 구조를 보존한 document representation이다. Knowledge IR은 어떤 문장이 독립 claim인지, 어느 조건에서만 참인지, 어떤 source span이 지지하는지, 어느 변환을 거쳐 출력에 들어갔는지를 별도 객체와 relation으로 만든다."
        />
        <ConceptPrimer items={[
          { term: 'Block', meaning: 'Heading, paragraph, table cell, formula, caption, code symbol처럼 원문에 직접 있는 구조 단위다.', why: '원문 주소와 reading order를 잃지 않는다.' },
          { term: 'Claim', meaning: '한 번에 support 여부를 판정할 수 있는 최소 주장이다.', why: '긴 답 전체가 아니라 오류가 생긴 문장만 검사한다.' },
          { term: 'Scope', meaning: 'Claim이 유효한 온도, version, population, 실험 조건과 예외다.', why: '수치와 조건이 떨어져 검색되는 오류를 막는다.' },
          { term: 'Evidence', meaning: 'Claim을 지지·반박하거나 아직 결론 내리지 못하게 하는 exact source span이다.', why: 'Citation 문자열을 검증 가능한 relation으로 바꾼다.' },
          { term: 'Transformation', meaning: '요약·번역·table 계산·code execution처럼 한 artifact를 다른 artifact로 바꾼 run이다.', why: '최종 답 이전 어느 단계에서 의미가 변했는지 찾는다.' },
        ]} />
        <div className="not-prose my-8 border-y border-border">
          {[
            ['Normalized document', '원문이 어떻게 배치되어 있었나?', 'Block · order · hierarchy · locator', 'ingestion output'],
            ['Knowledge IR', '원문이 무엇을 주장하고 무엇이 지지하나?', 'Claim · Scope · Evidence · Concept · relation', 'semantic build artifact'],
            ['Retrieval index', '질문에서 어떤 후보를 빨리 찾나?', 'search unit · vector · lexical field · filter', 'derived serving artifact'],
            ['Rendered article', '독자에게 어떤 순서와 언어로 설명하나?', 'section · prose · formula · Viz · citation', 'versioned output'],
          ].map(([name, question, objects, role]) => <div key={name} className="grid gap-2 py-5 sm:grid-cols-[9rem_minmax(0,1fr)_minmax(0,1fr)_8rem]"><strong className="text-xs">{name}</strong><p className="text-xs leading-relaxed text-muted-foreground">{question}</p><code className="break-words text-[10px] leading-relaxed">{objects}</code><p className="text-[10px] font-semibold leading-relaxed">{role}</p></div>)}
        </div>
        <Misconception>
          Knowledge graph에 node와 edge가 많다고 근거가 강해지지 않는다. Source address 없이 LLM이 만든 relation은 검색 힌트일 수는 있어도
          사실을 증명하는 evidence가 아니다. Graph 규모와 provenance 품질을 분리한다.
        </Misconception>
      </section>

      <section id="ir-schema" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">최소 schema는 원문, 의미, 변환을 서로 덮어쓰지 않는다</h2>
        <p className="mb-5 max-w-3xl text-sm leading-relaxed text-muted-foreground">요약문만 저장하면 나중에 어느 원문에서 왔고 어떤 처리 과정을 거쳤는지 검증할 수 없다. 다음 장면은 document, claim, artifact와 transform 관점을 바꿔 가며 각 객체의 focus, relation과 다시 찾을 source address를 분리해 보여준다.</p>
        <KnowledgeIrLineageExplorer />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Manual rev 1.3의 표에는 “80°C 이하에서 최대 torque 42 N·m”가 있다. 이를 한 text field로 저장하면
            <code>42 N·m</code>만 검색될 때 조건이 사라진다. Claim은 “최대 torque는 42 N·m”로 두고 Scope에
            temperature predicate와 manual version을 둔다. Evidence edge는 torque 값 cell과 80°C 조건 cell을 각각 가리킨다.
          </p>
          <p>
            같은 의미를 강의 영상과 code가 설명할 수 있다. Video evidence는 timestamp와 frame을, code evidence는 commit과 symbol을 가진다.
            이들을 “관련 링크” 배열로 묶지 않고 <code>explains</code>, <code>implements</code>, <code>verifies</code>처럼 relation type을 구분한다.
            Artifact alignment는 서로 독립적으로 versioned된 manual revision과 release commit의 관계를 명시한다.
          </p>
          <p>
            <code>table:7/row:8/cell:max_torque</code>는 IR 안에서 relation을 걸기 위한 논리 block ID다.
            각 block은 Ingestion이 만든 <code>source_locator_id</code>를 반드시 보존하고, 그 ID는 실제
            <code>page_no · bbox · charspan · rotation</code> locator로 해석된다. 따라서 claim graph에서 cell을 고른 뒤에도
            <code>open(locator)</code>로 같은 manual revision의 정확한 page와 영역으로 돌아갈 수 있다.
          </p>
        </div>
        <pre className="not-prose my-8 overflow-x-auto rounded-md border border-border bg-muted/20 p-4 text-[10px] leading-relaxed"><code>{`{
  "claim_id": "claim:torque-limit",
  "statement": { "value": 42, "unit": "N*m", "predicate": "max_torque" },
  "scope": [{ "temperature_c": { "lte": 80 } }, { "manual_version": "1.3" }],
  "evidence": [
    { "block": "table:7/row:8/cell:max_torque", "source_locator_id": "loc:manual-1.3:torque", "verdict": "supports_value" },
    { "block": "table:7/row:8/cell:temperature", "source_locator_id": "loc:manual-1.3:temperature", "verdict": "supports_scope" }
  ],
  "artifacts": [{ "commit": "a91f...", "symbol": "apply_torque_limit", "relation": "implements" }]
}`}</code></pre>
        <M display>{String.raw`\operatorname{support}(c,e)=\begin{cases}\text{지지},&\underbrace{e\models(c\land q)}_{\text{주장과 조건을 모두 포함}}\\\text{부분},&\underbrace{e\models c,\ e\not\models q}_{\text{조건 근거가 빠짐}}\\\text{반박},&\underbrace{e\models\neg c}_{\text{원문과 충돌}}\end{cases}`}</M>
        <FormulaNote
          meaning="Evidence e가 claim c의 본문뿐 아니라 qualifier q까지 지지하는지 나눈다. 수치만 맞고 적용 조건이 없으면 fully supported로 올리지 않는다."
          symbols={[
            ['support(c,e)', 'claim c와 evidence e 사이의 판정'],
            ['c', '검증할 최소 주장'],
            ['q', '온도·version·실험 조건 같은 qualifier 또는 scope'],
            ['e ⊨ x', 'evidence e가 명제 x를 실제로 뒷받침함'],
            ['¬c', 'claim c와 반대되는 내용'],
          ]}
        />
      </section>

      <section id="lineage" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Build-time lineage와 query-time trace를 서로 다른 graph로 남긴다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            <strong>Build-time lineage</strong>는 source를 index와 article로 만들 때 생긴다. Source span이 block이 되고,
            extraction run을 거쳐 claim과 concept이 되며, renderer가 한국어 article을 만들었다는 graph다.
            이 graph는 source correction이 어떤 artifact를 다시 만들어야 하는지 알려 준다.
          </p>
          <p>
            <strong>Query-time trace</strong>는 사용자가 질문할 때 생긴다. 어떤 query rewrite와 filter가 적용됐고,
            어떤 candidate가 검색·rerank되어 실제 context snapshot에 들어갔으며, 최종 답의 각 claim이 어느 evidence id를 사용했는지 남긴다.
            Index에 좋은 evidence가 존재해도 runtime에서 선택되지 않았다면 그 답의 근거가 아니다.
          </p>
          <p>
            VeriTrail은 여러 generative stage를 DAG로 보고 final claim에서 intermediate output을 거슬러 source까지 evidence trail을 만든다.
            여기서 중요한 경계는 “source URL을 붙였다”가 아니라, final claim이 사용한 node와 source sentence가 실제 edge로 이어진다는 점이다.
          </p>
        </div>
        <M display>{String.raw`P(c)=\frac{\underbrace{|E_c^{+}|}_{\text{완전 지지 evidence}}}{\underbrace{|E_c^{+}|}_{\text{지지}}+\underbrace{|E_c^{?}|}_{\text{부분·불명확}}+\underbrace{|E_c^{-}|}_{\text{반박}}}`}</M>
        <FormulaNote
          meaning="P(c)는 claim의 truth 확률이 아니라 review용 support coverage 예다. Fully supporting evidence가 전체 판정 evidence 중 얼마나 되는지 보고, 부분·반박 근거가 있으면 자동 확정을 막는다."
          symbols={[
            ['P(c)', 'claim c의 검토 우선순위에 쓰는 support 비율'],
            ['E_c⁺', 'claim과 scope를 모두 지지한 evidence 집합'],
            ['E_c?', '관련되지만 조건이 부족하거나 불명확한 evidence 집합'],
            ['E_c⁻', 'claim과 충돌하는 evidence 집합'],
          ]}
        />
        <Misconception>
          Confidence 0.97은 truth 97%가 아니다. Extractor confidence, schema validation, cross-source agreement와 human verdict는 서로 다른 신호다.
          어떤 model score도 source span과 scope 검증을 대신하지 않는다.
        </Misconception>
      </section>

      <section id="multilingual-artifacts" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">여러 언어는 원문을 번역해 없애지 않고 concept label 위에 겹친다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            “torque limit”, “토크 제한”, “トルク制限”은 같은 concept을 가리킬 수 있다. IR은 stable concept id와 언어별 label·alias를 둔다.
            그러나 evidence는 반드시 source literal과 원문 language를 유지한다. Renderer가 한국어로 설명해도 독자는 영어 manual의 exact wording으로 돌아갈 수 있어야 한다.
          </p>
          <p>
            번역도 Transformation node다. Input claim id, source language, target language, glossary version, model과 output을 기록한다.
            “shall”을 권고로 약하게 번역하거나 unit을 바꾼 오류가 생기면 extraction을 다시 하지 않고 renderer/translation branch만 재실행한다.
          </p>
          <p>
            Video와 code는 언어보다 address type이 다르다. Manual claim을 video가 <code>explains</code>하고 code symbol이
            <code>implements</code>하며 test가 <code>verifies</code>할 수 있다. 이 relation을 모두 “evidence”로 부르면 설명, 구현, 실험 증거의 강도가 섞인다.
          </p>
        </div>
        <div className="not-prose my-8 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3">
          {[
            ['Concept', 'concept:torque.limit', '언어 독립 identity'],
            ['Labels', 'torque limit · 토크 제한', '검색과 렌더링 alias'],
            ['Source literal', '“shall limit ...” · p.42', '법적·기술적 뉘앙스 보존'],
          ].map(([label, value, note]) => <div key={label} className="min-w-0 bg-background p-4"><p className="text-[9px] font-bold uppercase text-muted-foreground">{label}</p><p className="mt-2 break-words text-sm font-black">{value}</p><p className="mt-2 text-[9px] leading-relaxed text-muted-foreground">{note}</p></div>)}
        </div>
      </section>

      <section id="revision-impact" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">수정본이 오면 덮어쓰지 않고 영향받은 graph만 닫는다</h2>
        <ConceptPrimer items={[
          { term: 'DocumentVersion', meaning: '원본 revision과 그 parser output을 수정하지 않고 새 ID로 묶은 버전 객체다.', why: '과거 답이 어떤 원문을 사용했는지 재현한다.' },
          { term: 'Valid time', meaning: '그 source claim이 현실에서 유효하다고 명시한 시간 구간이다.', why: '새 문서를 저장한 시각과 실제 적용 시점을 혼동하지 않는다.' },
          { term: 'Superseded', meaning: '더 최신인 source evidence가 현재 자리를 대신해 이전 evidence가 기본 검색 대상에서 내려간 상태다.', why: '서로 다른 revision이 동시에 current로 검색되는 오류를 막는다.' },
          { term: 'Stale', meaning: '입력 evidence가 바뀌어 다시 계산하거나 검토해야 하는 derived artifact 상태다.', why: '아직 재빌드하지 않은 article·chunk를 유효한 결과처럼 내보내지 않는다.' },
          { term: 'Transaction', meaning: '관련 상태 변경을 전부 성공시키거나 전부 취소해 중간 상태가 보이지 않게 하는 데이터베이스 작업 단위다.', why: 'old evidence와 derived artifact의 상태가 서로 다른 시점에 반영되는 일을 막는다.' },
          { term: 'Outbox event', meaning: '상태 변경과 같은 transaction에 기록한 뒤 별도 전달기가 rebuild queue로 보내는 이벤트다.', why: '상태는 바뀌었지만 rebuild 요청만 유실되는 이중 쓰기 실패를 막는다.' },
          { term: 'Diff / Rebuild worker', meaning: 'Diff worker는 두 revision의 변경 범위를 계산하고, rebuild worker는 확정된 impact set의 index와 article을 다시 만든다.', why: '변경 탐지와 상태 결정, 파생물 생성을 한 작업자에게 섞지 않는다.' },
          { term: 'Race condition', meaning: '여러 작업자가 실행된 순서에 따라 최종 상태가 달라지는 경쟁 오류다.', why: '한 coordinator만 상태 전이를 쓰게 해야 하는 이유를 설명한다.' },
        ]} />
        <p className="mb-5 max-w-3xl text-sm leading-relaxed text-muted-foreground">새 문서가 들어왔다고 모든 파생 결과를 다시 만들 필요는 없다. 다음 장면은 v1.2와 수정본 v1.3을 바꿔 보며 source span, claim, retrieval chunk와 article의 상태가 달라져도 관련 없는 claim은 valid로 남는 영향 범위를 보여준다.</p>
        <RevisionImpactExplorer />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Revision event는 네 단계 handoff를 지난다. Watcher나 source intake가 새 version을 발견한다. Ingestion이 원본과 parser output을
            새 immutable DocumentVersion으로 만든다. IR diff가 바뀐 block·table cell·scope와 downstream impact set을 계산한다.
            마지막으로 <strong>IR revision coordinator</strong> 한 곳만 old evidence를 superseded로, 영향받은 derived artifact를 stale로 전이한다.
          </p>
          <p>
            이전 version을 삭제하면 과거 답을 재현할 수 없다. 반대로 새 version만 추가하고 old claim을 current로 남기면 두 개의 진실이 동시에 검색된다.
            Logical claim id 아래 valid-time과 source version을 두고 superseded 상태를 명시한다. Diff worker나 rebuild worker가 상태를 제각각 쓰게 하지 않고,
            coordinator가 한 transaction과 outbox event로 상태 변경과 rebuild enqueue를 소유해야 중복 writer와 race를 막을 수 있다.
          </p>
        </div>
        <M display>{String.raw`I(\Delta S)=\left\{v\in V\ \middle|\ \underbrace{\exists s\in\Delta S:\ s\leadsto v}_{\text{바뀐 span에서 도달 가능}}\right\}`}</M>
        <FormulaNote
          meaning="Changed source span 집합 ΔS에서 provenance edge를 따라 도달할 수 있는 downstream node만 impact set I(ΔS)에 넣는다. 전체 corpus를 재생성하지 않고 관련 claim·index·article을 targeted rebuild한다."
          symbols={[
            ['ΔS', '새 revision에서 내용이나 scope가 바뀐 source span 집합'],
            ['V', 'claim, chunk, translation, article 같은 모든 downstream node 집합'],
            ['s ⇝ v', 'source span s에서 node v까지 derivation path가 존재함'],
            ['I(ΔS)', 'invalid 또는 stale 후보가 되어 재검토할 node 집합'],
          ]}
        />
      </section>

      <section id="ir-release" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">IR release는 schema 통과가 아니라 추적 가능한 판단으로 닫는다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <ol>
            <li>모든 claim은 최소 하나의 source span 또는 명시적 unknown 상태를 가진다.</li>
            <li>수치·수식 claim은 unit과 Scope가 빠지면 fully supported가 될 수 없다.</li>
            <li>Transformation은 input node, model/code version, configuration과 output node를 남긴다.</li>
            <li>언어별 label을 바꾸어도 concept id와 source literal은 변하지 않는다.</li>
            <li>Revision fixture는 관련 claim만 stale로 만들고 unrelated branch는 유효하게 유지한다.</li>
            <li>Runtime answer는 build-time graph와 별개인 retrieval·packing·generation trace를 남긴다.</li>
          </ol>
        </div>
        <CapabilityCheck items={[
          'Normalized document, Knowledge IR, retrieval index와 rendered article을 서로 다른 artifact로 설계한다.',
          '수식 값과 qualifier를 Claim·Scope·Evidence relation으로 분리한다.',
          'Manual span, video timestamp와 exact code commit을 typed artifact relation으로 연결한다.',
          'Build-time lineage와 query-time trace가 각각 답하는 질문을 설명한다.',
          '새 revision을 덮어쓰지 않고 changed span에서 downstream impact closure를 계산한다.',
          'Confidence가 truth가 아닌 이유와 unknown·inconclusive 상태의 필요성을 설명한다.',
        ]} />
        <LearningHandoff
          description="IR의 산출물은 summary 문자열이 아니라 원문 좌표와 transformation을 따라 재검산할 수 있는 claim graph다. 새 연구 승격과 query-time 답변은 이 provenance를 소비한다."
          items={[
            { label: '막히면', slug: 'knowledge-source-ingestion', title: '멀티소스 Ingestion', reason: 'Claim이 가리킬 block·table cell·formula scope·timestamp·commit locator가 먼저 보존됐는지 확인한다.' },
            { label: '이어 읽기', slug: 'rag-pipeline', title: 'RAG 파이프라인', reason: 'Claim graph를 검색 후보와 answer trace로 투영하되 evidence scope와 ACL을 잃지 않는지 검증한다.' },
            { label: '적용하기', slug: 'knowledge-research-watcher', title: 'Research Watcher', reason: '새 version과 correction event를 감지해 어떤 claim과 article을 stale로 닫을지 결정한다.' },
          ]}
        />
        <SourceNotes sources={[
          { label: 'W3C · PROV-O', href: 'https://www.w3.org/TR/prov-o/', note: 'Entity, Activity, Agent, derivation, revision과 invalidation을 표현하는 표준 vocabulary.' },
          { label: 'Microsoft Research · VeriTrail', href: 'https://www.microsoft.com/en-us/research/blog/veritrail-detecting-hallucination-and-tracing-provenance-in-multi-step-ai-workflows/', note: 'Multi-stage generation DAG에서 final claim을 source로 추적하고 error stage를 찾는 현재 연구.' },
          { label: 'Docling Graph · Data Grounding & Provenance', href: 'https://docling-project.github.io/docling-graph/fundamentals/graph-management/provenance/', note: 'Graph node를 chunk, page와 optional char span으로 되돌리는 current implementation interface.' },
          { label: 'Crossref · Versioning', href: 'https://www.crossref.org/documentation/schema-library/markup-guide-metadata-segments/versions-corrections-and-retractions/', note: 'Correction·update·retraction metadata를 source lineage와 연결하는 운영 근거.' },
        ]} />
      </section>
    </>
  );
}

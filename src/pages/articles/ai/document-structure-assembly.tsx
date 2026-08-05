import MathFormula from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { CitationBlock } from '@/components/ui/citation';
import {
  CapabilityCheck,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
  StopRule,
} from '@/components/learning/ArticleLearning';
import {
  CrossPageRelationLab,
  DocumentReleaseGate,
  OverlapSynchronizationLab,
  PageToDocumentAssemblyLab,
  TypedBlockStrip,
} from './document-structure-assembly/viz/DocumentAssemblyLabs';

function Formula({ latex, meaning, symbols }: { latex: string; meaning: string; symbols: [string, string][] }) {
  return (
    <div className="not-prose my-6 min-w-0">
      <div className="min-w-0 rounded-md border border-border p-3 sm:p-4">
        <MathFormula display className="my-0 text-[12px] sm:text-base">{latex}</MathFormula>
      </div>
      <FormulaNote meaning={meaning} symbols={symbols} />
    </div>
  );
}

const repairTypes = [
  {
    number: '01', title: '문단 이어짐', question: '다음 page의 첫 문장이 앞 문장의 계속인가?',
    evidence: '종결 부호, 문법 연결, indent·column, page edge 위치', output: 'continues 관계. 원문 text는 합쳐 보이더라도 두 source span을 유지한다.',
  },
  {
    number: '02', title: '표 이어짐', question: '다음 page의 행이 같은 table schema를 따르는가?',
    evidence: '열 수·폭, header type, 단위, border, caption·footnote', output: 'table fragment 관계. 값이 아니라 cell identity와 header lineage를 잇는다.',
  },
  {
    number: '03', title: '제목 계층', question: '이 heading의 parent와 범위는 어디까지인가?',
    evidence: '번호 규칙, font·weight, 위치, 뒤따르는 block type', output: 'contains 관계가 있는 rooted section tree를 만든다.',
  },
  {
    number: '04', title: '그림·텍스트', question: 'caption과 설명 문단은 어느 figure를 가리키는가?',
    evidence: 'figure 번호, 공간 거리, page 인접, 용어·entity 일치', output: 'describes 관계. figure crop과 caption provenance를 함께 보존한다.',
  },
] as const;

export default function DocumentStructureAssemblyArticle() {
  return (
    <>
      <section id="page-is-not-document" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Page가 맞아도 document는 틀릴 수 있다</h2>
        <QuestionLead
          question="180쪽 보고서의 모든 페이지가 눈으로 보기엔 정확한데, 왜 RAG는 숫자를 엉뚱한 제목 아래에서 찾을까?"
          answer="RAG는 검색 증강 생성(Retrieval-Augmented Generation)이다. 페이지 parser는 각 page 안의 block(독립적인 문서 요소)을 읽는 데 성공했지만, page 47의 table header와 page 48의 수치 행, page 90의 제목과 page 91의 본문 사이 관계가 끊겼다. Document assembly는 OCR을 다시 하는 단계가 아니라 이 끊긴 논리 관계를 근거와 함께 복원하는 단계다."
        />
        <PageToDocumentAssemblyLab />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p><strong>Page parser</strong>는 한 장 안에서 글자, 표, 수식, 그림과 reading order를 찾는다. <strong>Document assembler</strong>는 여러 장의 결과를 보고 무엇이 이어지고 무엇이 부모·자식인지 결정한다. 두 작업을 한 모델 호출로 뭉치면 실패했을 때 글자를 잘못 읽었는지, 관계를 잘못 연결했는지 분리하기 어렵다.</p>
          <p>2026년의 문서 VLM(Vision-Language Model, 이미지와 언어를 함께 처리하는 모델)은 page-level parsing을 크게 개선했다. 예를 들어 PaddleOCR-VL-1.6 공식 문서는 0.9B 모델의 text, formula, table, reading-order 성능과 실제 왜곡 조건을 보고한다. 그러나 이것이 곧 180쪽 문서의 제목 계층과 cross-page table이 맞다는 뜻은 아니다.</p>
          <CitationBlock source="MinerU-Popo · arXiv:2605.24973" citeKey={1} href="https://arxiv.org/abs/2605.24973">
            <p>논문은 page-level OCR이 잘 추출한 결과도 페이지 경계에서 문단과 표의 연속성을 잃어 RAG가 요구하는 document-level coherence를 제공하지 못한다고 문제를 정의한다.</p>
          </CitationBlock>
        </div>
        <Misconception>Document assembly는 여러 페이지의 Markdown 문자열을 이어 붙이는 작업이 아니다. 관계를 만들면서도 원본 page, bounding box(bbox, 원본 좌표 사각형), parser version과 원문 block 경계를 잃지 않아야 한다.</Misconception>
      </section>

      <section id="normalized-ir" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">먼저 typed block 중간 표현(IR)로 정규화한다</h2>
        <ConceptPrimer items={[
          { term: 'Block', meaning: '한 페이지에서 독립적으로 위치와 내용을 가질 수 있는 heading, paragraph, table, formula, figure, caption 단위.', why: '문자열 전체가 아니라 관계를 맺을 최소 단위를 고정한다.' },
          { term: 'IR', meaning: '서로 다른 parser 출력을 같은 field와 type으로 바꾼 중간 표현.', why: 'PaddleOCR, olmOCR, 기존 PDF text layer를 같은 assembler에서 비교할 수 있다.' },
          { term: 'Provenance', meaning: '이 block이 어느 문서·page·bbox·parser revision에서 왔는지 나타내는 출처 사슬.', why: '검색 답변에서 원본 crop까지 되돌아가 오류를 확인한다.' },
          { term: 'Relation', meaning: 'continues, contains, describes처럼 두 block 사이의 논리 연결.', why: '원문을 덮어쓰지 않고 document structure를 별도 layer로 표현한다.' },
        ]} />
        <TypedBlockStrip />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Assembler의 입력은 parser가 만든 Markdown이 아니라 <strong>정규화된 typed block</strong>이어야 한다. 최소 field는 <code>block_id</code>, <code>type</code>, content, <code>page</code>, <code>bbox</code>, reading-order index, parser confidence, source reference다. Table block은 HTML뿐 아니라 origin cell별 <code>origin_cell_id</code>, row·column, rowspan·colspan, <code>page</code>, <code>source_bbox</code>, <code>crop_ref</code>와 render-to-source transform(렌더링된 cell 좌표를 원본 page 좌표로 되돌리는 변환)을 가진 cell IR을 포함한다. Formula도 LaTeX와 source crop을 함께 둔다.</p>
          <p>위 Viz에서 block 종류를 바꾸면 공통 identity·source field는 그대로 남고, heading의 level이나 table의 HTML·column signature처럼 type별 field만 달라진다. 예시 table fragment는 <code>block_id=report:p48:b03</code>, <code>confidence=0.93</code>, <code>page=48</code>을 보존한다.</p>
          <p>Docling의 <code>DoclingDocument</code>는 이런 구현의 한 예다. text, table, picture와 hierarchy를 통합된 document representation으로 두고 여러 형식으로 직렬화한다. 중요한 것은 특정 라이브러리 이름이 아니라 <strong>원문 block과 파생 relation을 분리하는 schema 원칙</strong>이다.</p>
          <CitationBlock source="Docling · DoclingDocument" citeKey={2} href="https://docling-project.github.io/docling/concepts/docling_document/">
            <p>공식 문서는 document item, grouping, serialization, confidence, chunking을 하나의 표현에서 다루는 구조를 설명한다. 여기서는 이를 대체 불가능한 표준이 아니라 IR 설계 사례로 사용한다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="relation-evidence" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">연결은 evidence를 합쳐 결정한다</h2>
        <p className="mb-5 max-w-3xl text-sm leading-relaxed text-muted-foreground">페이지 경계의 두 block이 이어지는지는 의미 유사도 하나로 확정할 수 없다. 다음 장면은 문단·표·제목·캡션 fixture를 바꿔 가며 geometry, schema, typography와 semantic continuity가 관계 유형마다 어떤 점수 조합을 만드는지 비교한다.</p>
        <CrossPageRelationLab />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>두 block의 embedding이 비슷하다는 이유만으로 연결하면 같은 주제를 반복하는 다른 표와 문단이 합쳐진다. 반대로 bbox 거리만 보면 다음 page의 첫 문단처럼 좌표계가 리셋되는 관계를 놓친다. 따라서 geometry, type/schema, typography, semantic continuity를 <strong>서로 다른 evidence channel</strong>로 남긴다.</p>
          <p>아래 점수와 decision 식은 MinerU-Popo가 공개한 학습식의 전사가 아니라, 여러 assembler를 같은 release contract로 비교하기 위해 이 글이 만든 <strong>교육용 generic gate</strong>다. 실제 가중치와 threshold는 문서 유형별 golden relation에서 추정하고 versioned receipt로 남긴다.</p>
        </div>
        <Formula
          latex={String.raw`\begin{aligned} S_{ij}={}&\underbrace{w_g g_{ij}}_{\text{위치·페이지 근거}}+\underbrace{w_t t_{ij}}_{\text{타입·구조 근거}}\\&+\underbrace{w_v v_{ij}}_{\text{글꼴·시각 근거}}+\underbrace{w_s s_{ij}}_{\text{문맥·의미 근거}} \end{aligned}`}
          meaning="후보 block i와 j가 이어질 가능성을 네 종류의 독립 evidence로 계산하는 편집용 generic gate다. MinerU-Popo 원문 식이 아니다. 점수는 진실이 아니라 자동 연결·보류·거절을 나누기 위한 측정값이며, 가중치는 내 golden relation set에서 검증해야 한다."
          symbols={[["g_{ij}", 'page 인접, page edge, bbox와 column geometry'], ["t_{ij}", 'block type, table column signature, heading numbering'], ["v_{ij}", 'font, weight, indent와 border 같은 시각 단서'], ["s_{ij}", '문법·주제·entity의 의미 연속성'], ["w_*", '문서 유형별로 검증한 evidence 가중치']]}
        />
        <Formula
          latex={String.raw`\begin{aligned}
            j_i^\star&=\underbrace{\arg\max_j S_{ij}}_{\text{i와 가장 잘 이어지는 후보}}\\
            \underbrace{M_i}_{\text{후보 분리도}}&=
              \underbrace{S_i^{(1)}-S_i^{(2)}}_{\text{1위 점수에서 2위 점수를 뺌}}\\[2pt]
            \operatorname{decision}(i,j_i^\star)&=
              \begin{cases}
                \text{거절},&\underbrace{C_{i j_i^\star}=1}_{\text{명시적 충돌}}\\
                \text{연결},&\substack{C_{i j_i^\star}=0\\S_i^{(1)}\ge\tau\\M_i\ge\delta}\\
                \text{보류},&\text{그 밖의 모호한 경우}
              \end{cases}
          \end{aligned}`}
          meaning="먼저 모든 후보 점수를 비교해 1위 후보 j_i^*를 정한다. Figure 번호나 block type처럼 그 후보가 원문과 충돌하면 거절한다. 충돌이 없을 때만 1위 점수와 1·2위 margin을 함께 확인해 연결하고, 둘 중 하나라도 부족하면 원문을 바꾸지 않은 채 보류한다."
          symbols={[
            [String.raw`j_i^\star`, 'source block i에 대해 evidence score가 가장 높은 1위 relation 후보'],
            [String.raw`S_i^{(1)},S_i^{(2)}`, '같은 source block 후보들 가운데 1위와 2위 evidence score'],
            [String.raw`M_i`, '1위와 2위 후보 사이의 점수 차이'],
            [String.raw`C_{i j_i^\star}`, 'source block i와 1위 후보 사이의 명시적 번호·타입·schema 충돌 표시'],
            [String.raw`\tau`, '자동 연결에 필요한 1위 후보의 최소 점수'],
            [String.raw`\delta`, '1위 후보가 2위와 충분히 구분된다고 볼 최소 margin'],
          ]}
        />
        <StopRule>Relation score의 신경망 내부까지 무한히 내려가지 않는다. geometry·schema·style·semantics가 어떤 관측값인지와 보류 gate를 설명할 수 있으면 다음 단계로 간다.</StopRule>
      </section>

      <section id="four-repairs" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">네 종류의 경계 복원은 서로 다른 문제다</h2>
        <div className="not-prose divide-y divide-border border-y border-border">
          {repairTypes.map((repair) => (
            <div key={repair.number} className="grid gap-3 py-5 md:grid-cols-[3rem_9rem_minmax(0,1fr)]">
              <span className="font-mono text-lg font-black text-muted-foreground">{repair.number}</span>
              <p className="text-sm font-black">{repair.title}</p>
              <div className="min-w-0 space-y-2 text-sm leading-relaxed">
                <p><strong>질문.</strong> {repair.question}</p>
                <p className="text-muted-foreground"><strong className="text-foreground">근거.</strong> {repair.evidence}</p>
                <p className="text-muted-foreground"><strong className="text-foreground">출력.</strong> {repair.output}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>MinerU-Popo는 이 경계를 text truncation recovery, table truncation recovery, title hierarchy reconstruction, image-text association의 네 subtask로 분리한다. 30K 생성 데이터로 Qwen3-VL-4B를 fine-tuning하고, 여러 OCR parser의 출력을 같은 후처리 입력으로 다룬다. 논문이 보고한 title hierarchy와 RAG 개선 수치는 저자들의 실험 결과이며, 내 문서에서도 재현된다고 가정하면 안 된다.</p>
        </div>
      </section>

      <section id="cross-page-table" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Cross-page table은 값을 만들지 않는다</h2>
        <QuestionLead
          question="Page 47의 표가 4열인데 page 48 parser는 첫 행을 5열로 읽었다면 어느 쪽에 맞춰야 할까?"
          answer="자동으로 4열이나 5열을 선택하면 안 된다. 원본 geometry, header type, 반복되는 행 pattern과 다른 parser 결과를 evidence로 남기고, 구조가 확정될 때까지 ∅와 review 상태를 유지한다. 특히 숫자를 복사하거나 합계로 역산해 채우면 provenance가 깨진다."
        />
        <div className="not-prose grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">
          {[
            ['먼저 찾을 것', '같은 caption·단위, column width signature, header type, 다음 page의 첫 row 위치와 continued marker'],
            ['연결해도 되는 것', '두 table fragment의 identity, source header lineage, page boundary와 footnote relation'],
            ['연결하면 안 되는 것', '근거 없는 cell value, 이웃 값 복사, 합계를 맞추기 위한 숫자 생성'],
            ['불확실할 때 출력', 'ambiguous_schema, unresolved_cell=∅, parser disagreement와 review crop'],
          ].map(([title, body]) => <div key={title} className="min-w-0 bg-background p-4 sm:p-5"><p className="text-sm font-bold">{title}</p><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p></div>)}
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Cross-page relation이 승인되면 다음은 각 fragment 내부의 HTML 구조를 검산하는 단계다. <InternalLink slug="html-table-structure-reconstruction">HTML Table Parsing 글</InternalLink>에서 <code>rowspan</code>과 <code>colspan</code>을 occupancy grid로 펼치고 overlap·hole·header lineage를 확인하며, origin cell의 논리 좌표를 원본 <code>source_bbox</code>와 연결한다. Document assembler는 “두 조각이 같은 표인가”를 판단하고, grid reconstructor는 “각 cell이 어느 행·열을 점유하고 어느 원본 crop이 그 값을 증명하는가”를 판단한다.</p>
        </div>
      </section>

      <section id="overlap-sync" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">긴 문서는 overlap으로 동기화한다</h2>
        <p className="mb-5 max-w-3xl text-sm leading-relaxed text-muted-foreground">Chunk 경계가 문단·표·제목 관계를 자르면 어느 처리 창도 양쪽 증거를 함께 보지 못한다. 다음 장면은 고정된 chunk·overlap 계약에서 두 창의 판정이 일치하거나 충돌하거나 한쪽에서 빠질 때 sync 결과를 어떻게 닫는지 비교한다.</p>
        <OverlapSynchronizationLab />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>180쪽 전체를 한 번에 넣지 못하면 block sequence를 chunk로 나눈다. 단순히 1–32, 33–64처럼 자르면 32–33 경계를 볼 모델이 없다. 그래서 다음 chunk가 앞 chunk의 마지막 일부를 다시 읽도록 overlap을 둔다.</p>
          <p>아래 고정 길이 <code>C</code>와 overlap <code>O</code>는 원리를 설명하기 위한 편집용 sliding-window 식이다. MinerU-Popo의 공개 구현은 3-page overlap과 boundary density를 이용한 dynamic chunking을 사용하므로, 이 식의 숫자를 해당 논문의 고정 hyperparameter로 인용하지 않는다.</p>
        </div>
        <Formula
          latex={String.raw`I_k=\Big[\underbrace{k(C-O)}_{\text{k번째 시작 위치}},\ \underbrace{k(C-O)+C}_{\text{chunk 끝 위치}}\Big)`}
          meaning="교육용 fixed-window abstraction에서 길이 C인 chunk를 O만큼 겹치며 이동한다. 겹친 block은 relation ID와 source endpoints를 맞춰 같은 판단인지 확인하는 동기화 구간이 된다. 실제 dynamic boundary 구현은 내용 밀도에 따라 C와 경계를 바꿀 수 있다."
          symbols={[["I_k", 'k번째 chunk가 읽는 block index 구간'], ["C", '한 chunk의 block 수'], ["O", '이웃 chunk가 함께 읽는 overlap block 수'], ["C-O", '다음 chunk로 이동하는 stride']]}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>두 chunk가 같은 relation을 내면 중복을 병합한다. 한쪽은 table continuation, 다른 쪽은 paragraph continuation이라고 판단하면 더 유창한 출력을 고르지 않고 conflict를 남긴다. 공통 block이 없어 ID를 정렬할 수 없다면 overlap을 늘려 재처리한다.</p>
          <p>MinerU-Popo는 long document를 위해 dynamic chunking과 overlap-based synchronization을 제안한다. 여기서 얻을 일반 원리는 특정 모델보다 넓다. <strong>장문 처리의 품질은 chunk 하나의 정확도뿐 아니라 겹친 판단을 어떻게 합치고 충돌을 노출하는지에 달려 있다.</strong></p>
        </div>
      </section>

      <section id="tree-retrieval" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">문서 tree와 검색 단위를 분리한다</h2>
        <div className="not-prose grid gap-px overflow-hidden rounded-md border border-border bg-border md:grid-cols-3">
          {[
            ['Source layer', '원본 page, crop, text/HTML/LaTeX block과 parser trace. 절대 덮어쓰지 않는다.'],
            ['Structure layer', 'section contains paragraph, table continues fragment, caption describes figure 같은 relation graph/tree.'],
            ['Retrieval layer', '질문에 답할 크기로 node를 chunk하되 heading path, relation과 source reference를 상속한다.'],
          ].map(([title, body], index) => <div key={title} className="min-w-0 bg-background p-5"><p className="font-mono text-[10px] font-black text-muted-foreground">LAYER 0{index + 1}</p><p className="mt-3 text-sm font-bold">{title}</p><p className="mt-2 text-xs leading-relaxed text-muted-foreground">{body}</p></div>)}
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p><strong>Rendering unit</strong>과 <strong>retrieval unit</strong>은 같지 않다. 사람에게는 page 47–48의 표를 하나로 렌더링할 수 있지만, 검색에서는 header와 특정 행을 묶은 작은 node가 더 적합할 수 있다. 어느 경우든 retrieval node가 원본 cell과 heading path로 돌아갈 수 있어야 한다.</p>
          <p>예를 들어 “서울 Q3 매출은?”이라는 질문의 검색 결과는 숫자 <code>104</code>만 반환하면 부족하다. <code>3. 지역별 실적 → 매출 표 → 서울 행 → Q3 열</code>이라는 path, page 47 header origin cell과 page 48 value origin cell의 <code>origin_cell_id + source_bbox + crop_ref</code>, verification 상태를 함께 전달해야 한다. 이 cell source reference는 <InternalLink slug="html-table-structure-reconstruction">표 구조 복원의 cell provenance 계약</InternalLink>에서 만들어진다.</p>
          <Misconception>Markdown heading을 기준으로 일정 token마다 자르는 것은 document assembly가 아니다. 구조가 틀린 Markdown을 잘게 나누면 오류를 더 찾기 어렵게 복제할 뿐이다.</Misconception>
        </div>
      </section>

      <section id="release-evidence" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">릴리스 증거와 어려운 검산</h2>
        <QuestionLead
          question="새 assembler가 hierarchy TEDS를 높였지만 표 질문의 citation page를 두 번 틀렸다면 배포할 수 있을까?"
          answer="안 된다. TEDS(Tree-Edit-Distance-based Similarity)는 예측한 HTML tree와 정답 tree의 구조 유사도를 재는 점수다. 이 평균 구조 점수는 좋아졌어도 critical retrieval fixture와 source fidelity gate가 실패했다. 릴리스는 모든 핵심 gate를 통과해야 하는 fail-closed 결정이어야 한다."
        />
        <DocumentReleaseGate />
        <Formula
          latex={String.raw`\operatorname{release}=\underbrace{G_{src}}_{\text{원본 역추적}}\land\underbrace{G_{rel}}_{\text{관계 정확성}}\land\underbrace{G_{rag}}_{\text{질문·인용 정확성}}\land\underbrace{G_{reg}}_{\text{회귀 통과}}`}
          meaning="평균 점수를 더하는 대신 source, relation, RAG answer, regression의 critical gate를 모두 만족할 때만 배포한다. 하나라도 실패하면 review나 fallback으로 닫는다."
          symbols={[["G_{src}", '모든 출력 node의 page·bbox provenance gate'], ["G_{rel}", '문단·표·제목·caption relation gate'], ["G_{rag}", '정답, heading path와 citation fidelity gate'], ["G_{reg}", 'golden document 회귀 gate']]}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h3>180쪽 보고서에 적용해 보자</h3>
          <ol>
            <li>Page 47–48 표는 4열/5열 parser disagreement 때문에 자동 merge를 보류한다. 값은 만들지 않고 두 source crop과 schema 후보를 review에 보낸다.</li>
            <li>Page 90 heading과 page 91 body는 numbering, typography, 위치, topic이 같은 parent를 지지하고 차순위 margin이 충분하면 <code>contains</code>를 승인한다.</li>
            <li>Page 112 figure와 page 113 caption은 figure number가 일치하는지 먼저 본다. 번호가 충돌하면 의미가 비슷해도 연결하지 않는다.</li>
            <li>Chunk overlap에서 같은 relation이 반복되면 병합하고, type이나 endpoints가 다르면 충돌을 보존한다.</li>
            <li>최종 tree의 각 retrieval node가 원본 page·bbox로 돌아가며, 질문 fixture의 값·heading path·citation이 맞을 때만 release한다.</li>
          </ol>
        </div>
        <CapabilityCheck items={[
          'Page parser와 document assembler의 책임 경계를 설명할 수 있다.',
          '서로 다른 OCR 출력을 provenance가 있는 typed block IR로 정규화할 수 있다.',
          'Geometry·schema·style·semantics를 독립 evidence로 두고 보류 gate를 설계할 수 있다.',
          'Cross-page table에서 구조 관계와 cell value 생성을 구분할 수 있다.',
          'Overlap chunk의 일치·충돌·공백을 각각 merge·review·retry로 처리할 수 있다.',
          '180쪽 보고서의 document tree, retrieval node와 fail-closed release evidence를 설계할 수 있다.',
        ]} />
        <SourceNotes sources={[
          { label: 'MinerU-Popo paper', href: 'https://arxiv.org/abs/2605.24973', note: '네 cross-page subtask, 30K data, Qwen3-VL-4B, overlap synchronization과 document tree.' },
          { label: 'MinerU-Popo code', href: 'https://github.com/opendatalab/MinerU-Popo', note: '논문 저자가 공개한 구현 저장소.' },
          { label: 'PaddleOCR-VL-1.6', href: 'https://www.paddleocr.ai/main/en/version3.x/algorithm/PaddleOCR-VL/PaddleOCR-VL-1.6.html', note: '0.9B page parser의 공식 성능·학습·배포 기준점.' },
          { label: 'DoclingDocument', href: 'https://docling-project.github.io/docling/concepts/docling_document/', note: '통합 document IR, hierarchy, serialization과 chunking 구현 사례.' },
          { label: 'PubTabNet · TEDS', href: 'https://arxiv.org/abs/1911.10683', note: 'HTML table tree-edit 평가의 기준 논문.' },
        ]} />
      </section>
    </>
  );
}

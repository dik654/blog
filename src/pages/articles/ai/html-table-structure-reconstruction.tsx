import M from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { CitationBlock } from '@/components/ui/citation';
import { CapabilityCheck, ConceptPrimer, InternalLink, Misconception, QuestionLead, SourceNotes, StopRule } from '@/components/learning/ArticleLearning';
import TableGridReconstructionLab from './html-table-structure-reconstruction/viz/TableGridReconstructionLab';

export default function HtmlTableStructureReconstructionArticle() {
  return (
    <div className="space-y-16">
      <section id="structure-not-text" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">셀 글자가 맞아도 표는 틀릴 수 있다</h2>
        <QuestionLead question="OCR이 모든 숫자를 정확히 읽었다면 table parsing도 성공한 것일까?" answer="아니다. 숫자 12를 정확히 읽어도 잘못된 열·행 header 아래에 붙으면 의미가 바뀐다. Table Structure Recognition은 cell text 인식과 별도로 행, 열, 병합, header 관계를 복원하는 문제다." />
        <ConceptPrimer items={[
          { term: 'Structure token', meaning: 'tr, td, rowspan, colspan처럼 cell의 위치·병합을 표현하는 token.', why: 'plain text만으로는 숫자가 어느 header에 속하는지 보존할 수 없다.' },
          { term: 'Origin cell', meaning: '병합 영역의 왼쪽 위에서 실제 text와 span을 소유한 cell.', why: '나머지 slot을 복제 text가 아니라 origin pointer로 표현해야 중복을 피한다.' },
          { term: 'Source region', meaning: 'Origin cell이 나온 원본 page·bbox·crop과 좌표 변환 정보.', why: '논리적 row·column 오류를 원본 pixel 영역까지 되짚어 검토한다.' },
          { term: 'Occupancy grid', meaning: '각 2D slot이 비었는지, 어느 origin cell이 점유하는지 나타낸 배열.', why: 'HTML 순서만 읽어서는 rowspan이 다음 행을 미리 차지한 사실을 놓치기 쉽다.' },
          { term: 'Invariant', meaning: '어떤 정상 표에서도 반드시 성립해야 하는 구조 조건.', why: '모델 confidence 없이도 overlap, hole, out-of-bounds를 deterministic하게 찾는다.' },
        ]} />
        <TableGridReconstructionLab />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>VLM이 HTML을 생성해도 browser가 그럴듯하게 렌더링하는 것과 구조가 맞는 것은 다르다. 파서는 HTML을 AST로 읽고, 각 cell을 row-major 순서로 occupancy grid에 배치한 뒤, 겹침과 구멍을 검사해야 한다.</p>
          <CitationBlock source="PubTabNet · Image-based table recognition" citeKey={1} href="https://arxiv.org/abs/1911.10683"><p>PubTabNet은 table image와 structured HTML을 연결하고, 구조와 cell content를 함께 비교하는 TEDS(Tree-Edit-Distance-based Similarity, tree 편집 거리 기반 유사도)를 제안했다.</p></CitationBlock>
        </div>
      </section>

      <section id="expand-grid" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">rowspan·colspan을 2차원 격자로 펼치는 순서</h2>
        <div className="not-prose divide-y divide-border border-y border-border">
          {[
            ['01 · Parse', '문자열 replace가 아니라 HTML parser로 table→section→row→cell AST를 만든다.'],
            ['02 · Skip occupied', '새 cell을 놓기 전에 이전 rowspan이 점유한 column을 건너뛴다.'],
            ['03 · Fill rectangle', 'origin (r,c)에서 rowspan×colspan 직사각형을 같은 cell ID로 채운다.'],
            ['04 · Reject overlap', '이미 다른 origin이 차지한 slot에 쓰려 하면 malformed structure로 기록한다.'],
            ['05 · Normalize', '최대 열 수 C를 고정하고 hole, extra column, empty row를 별도 상태로 남긴다.'],
          ].map(([label, body]) => <div key={label} className="grid gap-2 py-4 sm:grid-cols-[9rem_minmax(0,1fr)]"><p className="font-mono text-xs font-black">{label}</p><p className="text-sm leading-relaxed text-muted-foreground">{body}</p></div>)}
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <M display>{String.raw`\underbrace{c_r^{\mathrm{active}}}_{\text{이전 rowspan이 점유}}+\underbrace{\sum_{j\in\mathrm{origin}(r)}\operatorname{colspan}(j)}_{\text{이 행에서 시작한 cell 폭}}=\underbrace{C}_{\text{표의 총 열 수}}`}</M>
          <FormulaNote meaning="이전 rowspan이 예약한 slot 수와 현재 행에서 새 cell이 차지하는 폭을 더하는 이유는 둘이 겹치지 않고 한 행의 모든 C개 slot을 정확히 분할해야 하기 때문이다. 합이 C보다 작으면 hole, 크면 overlap·overflow 후보이며, 바로 colspan을 늘리지 말고 누락된 token과 실제 ragged schema를 확인한다." symbols={[["c_r^{\\mathrm{active}}", '이전 행에서 시작한 rowspan이 현재 행에 예약한 slot 수'], ["\\mathrm{origin}(r)", '현재 행에서 새로 시작하는 origin cell 집합'], ["C", '정규화된 총 column 수']]} />
        </div>
      </section>

      <section id="cell-provenance" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">논리 slot과 원본 pixel은 같은 좌표가 아니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>점유 격자의 <code>(row, column)</code>은 복원된 표 안의 논리 좌표다. Review UI가 필요한 것은 PDF page 안의 실제 pixel 또는 point 좌표다. 따라서 각 <strong>origin cell</strong>은 <code>origin_cell_id</code>, text, row·column, rowspan·colspan과 함께 <code>page</code>, <code>source_bbox</code>, <code>crop_ref</code>, parser revision을 소유해야 한다. 병합으로 채워진 나머지 slot은 bbox를 복제하지 않고 같은 <code>origin_cell_id</code>만 가리킨다.</p>
          <p>Parser가 원본 page를 crop하거나 resize해서 읽었다면 model output bbox를 그대로 원본 좌표라고 부를 수 없다. 입력을 만든 transform과 좌표 단위(pixel, PDF point, 0~1 normalized)를 manifest에 남기고 원본 범위로 역변환해야 한다.</p>
          <M display>{String.raw`\underbrace{b_{\mathrm{source}}}_{\text{원본 page의 cell bbox}}=\underbrace{T_{\mathrm{render}\to\mathrm{source}}}_{\text{crop·resize를 되돌리는 변환}}\!\left(\underbrace{b_{\mathrm{model}}}_{\text{model 입력 위의 bbox}}\right)`}</M>
          <FormulaNote meaning="모델이 본 crop·resize 이미지의 cell bbox를 원본 page 좌표로 되돌린다. 이 변환을 보존해야 subtotal 오류가 난 논리 cell을 실제 원문 crop과 대조할 수 있다. 좌표가 없거나 범위를 벗어나면 그 cell은 자동 공개하지 않고 review_required로 남긴다." symbols={[[String.raw`b_{\mathrm{model}}`, 'model input image 좌표계에서 검출한 cell 사각형'], [String.raw`T_{\mathrm{render}\to\mathrm{source}}`, 'crop offset, resize scale, rotation을 역으로 적용하는 기록된 변환'], [String.raw`b_{\mathrm{source}}`, '원본 document page 좌표계의 검토 가능한 cell 영역']]} />
        </div>
        <div className="not-prose grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">
          {[
            ['Origin cell IR', 'cell_id · text · row/column · rowspan/colspan · page · source_bbox · crop_ref · parser_revision'],
            ['Occupied slot IR', 'row · column · origin_cell_id만 저장하고 text와 bbox를 중복 생성하지 않음'],
            ['Verifier failure', 'table_id · rule_id · origin_cell_id · source_bbox · observed/expected를 함께 반환'],
            ['Review action', '해당 crop을 열어 text 오류, span 오류, header 연결 오류를 서로 다르게 수정'],
          ].map(([title, body]) => <div key={title} className="min-w-0 bg-background p-4"><p className="text-sm font-bold">{title}</p><p className="mt-2 break-words text-xs leading-relaxed text-muted-foreground">{body}</p></div>)}
        </div>
      </section>

      <section id="invariants" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">구조 verifier가 확인할 네 가지</h2>
        <div className="not-prose grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">
          {[
            ['Slot uniqueness', '각 grid slot은 정확히 하나의 origin cell을 가리킨다.'],
            ['Rectangular span', '한 origin의 rowspan×colspan 영역은 끊기지 않은 직사각형이다.'],
            ['Width consistency', '허용된 ragged schema가 아니라면 모든 expanded row width는 C다.'],
            ['Header reachability', 'data cell은 column·row header까지 모호하지 않은 경로를 가져야 한다.'],
          ].map(([title, body]) => <div key={title} className="bg-background p-4"><p className="text-sm font-bold">{title}</p><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p></div>)}
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert"><p>마지막 조건은 검색 증강 생성(Retrieval-Augmented Generation, RAG)에서 중요하다. cell text가 정확해도 header association이 끊기면 “2025 Q2 매출”을 다른 지역의 값으로 retrieval할 수 있다. 구조 검사는 렌더링 품질이 아니라 downstream 의미 보존 검사다.</p></div>
      </section>

      <section id="backfill" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Backfill은 값을 만드는 알고리즘이 아니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>구조 복원에서 backfill은 강한 근거가 있을 때 비어 있는 slot에 origin pointer나 explicit missing marker를 넣는 과정이다. 이웃 숫자를 복사하거나 그럴듯한 text를 생성하는 것은 복원이 아니라 데이터 조작이다.</p>
        </div>
        <div className="not-prose divide-y divide-border border-y border-border">
          {[
            ['안전한 경우', '직선 border geometry와 인접 행의 동일 span pattern이 같은 merge를 독립적으로 지지한다. origin pointer만 복구한다.'],
            ['보류할 경우', '한 행이 한 칸 짧지만 missing cell과 wrong colspan을 구분할 evidence가 없다. ∅와 review flag를 남긴다.'],
            ['금지할 경우', '합계 관계만 맞추기 위해 숫자나 label을 추정해 채운다. 원문 provenance를 파괴한다.'],
          ].map(([title, body]) => <div key={title} className="grid gap-2 py-4 sm:grid-cols-[9rem_minmax(0,1fr)]"><p className="text-sm font-bold">{title}</p><p className="text-sm leading-relaxed text-muted-foreground">{body}</p></div>)}
        </div>
        <Misconception>“Backfilling Algorithm”은 하나의 보편 표준 알고리즘 이름이 아니다. 어떤 signal로 무엇을 복구하는지 명시해야 한다. HTML 구조, line geometry, neighboring pattern, schema가 서로 다른 evidence다.</Misconception>
      </section>

      <section id="teds-rag" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">TEDS와 RAG 검증은 서로 다른 질문을 한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <M display>{String.raw`\begin{aligned}
d_{\text{편집}}&=\operatorname{EditDistance}(T_a,T_b)\\
n_{\text{기준}}&=\max(|T_a|,|T_b|)\\
\operatorname{TEDS}(T_a,T_b)&=1-\frac{d_{\text{편집}}}{n_{\text{기준}}}
\end{aligned}`}</M>
          <FormulaNote meaning="편집 비용을 두 tree 중 더 큰 node 수로 나누는 이유는 크기가 다른 표끼리도 0~1 범위에서 비교하기 위해서다. Insert·delete는 node 하나의 비용, 서로 다른 non-cell tag나 rowspan·colspan 속성 불일치는 substitution 비용으로 센다. 대응하는 td cell은 문자열의 normalized Levenshtein distance를 content substitution 비용으로 쓴다. 이를 1에서 빼면 완전 일치는 1이지만, 특정 숫자의 business header와 합계는 별도 semantic invariant로 검사한다." symbols={[["T_a,T_b", '예측/정답 table HTML tree'], ["|T|", 'tree node 수'], ["\\operatorname{EditDistance}", '구조·span 속성과 cell content를 맞추는 최소 편집 비용'], ["normalized Levenshtein distance", '두 문자열을 같게 만드는 삽입·삭제·치환의 최소 횟수를 두 문자열 중 더 긴 길이로 나눈 0~1 거리']]} />
          <p>운영 pipeline은 TEDS 같은 benchmark metric, occupancy invariant, numeric parse, subtotal relation, header-cell lineage를 나눠 기록해야 한다. 각 실패는 <code>origin_cell_id</code>와 <code>source_bbox</code>를 함께 반환해 어떤 원문 영역을 확인할지까지 닫아야 한다. 하나의 평균 점수가 어떤 오류를 숨기는지 알 수 있어야 한다.</p>
          <CitationBlock source="PaddleOCR-VL documentation" citeKey={2} href="https://www.paddleocr.ai/main/en/version3.x/algorithm/PaddleOCR-VL/PaddleOCR-VL-1.6.html"><p>현재 document parsing 모델의 표 출력은 이 글의 입력이다. 모델 architecture와 배포는 PaddleOCR-VL 글에 두고, 여기서는 출력 이후의 deterministic 검산만 다룬다.</p></CitationBlock>
        </div>
        <CapabilityCheck items={[
          'rowspan·colspan HTML을 origin pointer가 있는 2D grid로 펼칠 수 있다.',
          '논리 cell 좌표와 원본 page bbox를 구분하고 crop·resize transform으로 역매핑할 수 있다.',
          'active rowspan을 포함한 row width invariant로 malformed table을 찾을 수 있다.',
          '구조 backfill과 cell value hallucination을 구분할 수 있다.',
          'TEDS, cell text, header lineage와 business invariant를 별도 지표로 설계할 수 있다.',
        ]} />
        <StopRule>HTML AST를 origin pointer가 있는 occupancy grid로 펼치고, overlap·hole·overflow·header lineage와 source crop을 각각 재현할 수 있으면 멈춘다. Missing cell의 값을 추정하지 않고 unresolved provenance로 review에 넘긴다.</StopRule>
        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p>
            여기서 만든 점유 격자와 header lineage는 진단 보고서로 끝나지 않는다. 다음 단계인{' '}
            <InternalLink slug="ocr-runtime-evaluation">OCR 런타임과 평가</InternalLink>에서 원문 provenance, 문서 관계,
            검색 인용과 함께 자동 공개 여부를 결정하는 release gate가 된다.
          </p>
        </div>
        <SourceNotes sources={[
          { label: 'PubTabNet and TEDS', href: 'https://arxiv.org/abs/1911.10683', note: 'structured HTML table dataset과 tree-edit 기반 평가.' },
          { label: 'PaddleOCR-VL', href: 'https://www.paddleocr.ai/main/en/version3.x/algorithm/PaddleOCR-VL/PaddleOCR-VL-1.6.html', note: '현재 다국어 document parsing 출력의 제품 기준점.' },
        ]} />
      </section>
    </div>
  );
}

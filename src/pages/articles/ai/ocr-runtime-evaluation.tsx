import MathFormula from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { CapabilityCheck, ConceptPrimer, InternalLink, QuestionLead, SourceNotes, SpecialistEntry, StopRule } from '@/components/learning/ArticleLearning';
import OCRReleaseGateViz from './ocr-runtime-evaluation/OCRReleaseGateViz';

export default function OCRRuntimeEvaluationArticle() {
  return (
    <div className="space-y-16">
      <SpecialistEntry
        title="OCR 결과를 검색 가능한 문서로 출시하는 운영 경로"
        description="문자를 잘 읽는 모델을 소개하는 글이 아니라, page artifact를 재현하고 표·수식·좌표를 검증한 뒤 RAG에 공개하는 release pipeline을 다룬다."
        prerequisites={[
          'Page parser가 text뿐 아니라 bbox, reading order와 구조를 출력할 수 있음을 안다.',
          '여러 page의 제목, 문단과 표를 document 단위로 다시 이어야 함을 안다.',
          'RAG가 답과 함께 돌아갈 수 있는 원문 근거를 필요로 함을 안다.',
        ]}
        links={[
          { slug: 'ocr-document-ai-map', title: 'OCR · Document AI 전체 경로', reason: '입력 PDF에서 page parsing, document assembly와 검색까지 전체 책임을 본다.' },
          { slug: 'document-structure-assembly', title: 'Document structure assembly', reason: '페이지 사이 표·문단·caption과 provenance를 복원하는 단계를 배운다.' },
          { slug: 'rag-pipeline', title: 'RAG pipeline', reason: '검증한 문서를 어떤 근거 단위로 검색할지 연결한다.' },
        ]}
      />
      <section id="overview" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">OCR은 추출이 아니라 검증 파이프라인이다</h2>
        <QuestionLead question="페이지 OCR 점수가 높으면 곧바로 RAG(Retrieval-Augmented Generation, 검색 증강 생성)에 넣어도 될까?" answer="안 된다. 검색 답변이 원본 page·bbox(bounding box, 페이지 안 위치 상자)로 돌아갈 수 있고, 페이지 사이 관계와 표의 논리 구조가 검증되며, 실패 상태를 숨기지 않을 때만 문서가 공개 가능한 지식 단위가 된다." />
        <ConceptPrimer items={[
          { term: 'Idempotent page task', meaning: '같은 source와 render·model·prompt·schema version으로 다시 실행하면 같은 artifact identity를 얻는 작업.', why: 'Retry가 중복 page나 서로 다른 결과를 조용히 섞지 않게 한다.' },
          { term: 'Fail-closed gate', meaning: '필수 증거가 없거나 규칙이 실패하면 자동 공개하지 않고 review 또는 blocked로 남기는 판정.', why: '높은 평균 confidence가 provenance·구조 오류를 덮지 못하게 한다.' },
        ]} />
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>OCR을 모델 호출 하나로 생각하면 운영에서 실패한다. PDF와 스캔 문서는 입력 품질, 렌더링 해상도, 페이지 분할, layout, 표, 수식, 언어 혼합, review workflow가 모두 결과를 바꾼다. 이미지와 문장을 함께 읽는 VLM(Vision-Language Model, 시각-언어 모델) OCR은 강하지만, 그럴듯한 hallucination도 만들 수 있다.</p>
          <p>따라서 신뢰 가능한 OCR 시스템은 extract → structure → verify → store → retrieve의 파이프라인으로 설계해야 한다. 모델이 Markdown을 잘 만들었다고 끝나는 것이 아니라, downstream에서 그 Markdown을 검색하고 근거로 쓸 수 있는지 확인해야 한다.</p>
        </div>
        <p className="not-prose mb-4 mt-8 text-sm leading-6 text-muted-foreground" data-viz-context>
          아래에서는 같은 문서를 `검증 완료`, `표 합계 불일치`, `출처 좌표 누락`으로 바꿔
          보며 어느 artifact에서 실패가 드러나고 최종 판정이 어떻게 달라지는지 확인한다.
        </p>
        <OCRReleaseGateViz />
      </section>

      <section id="pipeline" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">PDF·이미지 전처리와 페이지 분할</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>PDF OCR은 먼저 source type을 구분한다. born-digital PDF는 이미 text layer가 있을 수 있고, scanned PDF는 image rendering이 필요하다. text layer가 있어도 reading order가 깨졌거나 table이 망가진 경우에는 OCR/VLM 재파싱이 필요할 수 있다.</p>
          <p>스캔 문서는 deskew, dewarp, denoise, contrast normalization, page crop, rotation detection이 중요하다. 작은 글자와 수식이 많은 문서는 render DPI(dots per inch, 1인치에 배치하는 점의 수)를 올려야 하지만, 너무 큰 이미지는 VLM memory와 latency를 키운다. 전처리 설정은 모델 선택만큼 중요하다.</p>
          <p>페이지 단위 처리도 고민해야 한다. 한 페이지씩 처리하면 context는 짧지만 cross-page table과 heading continuity가 끊긴다. 여러 페이지를 묶으면 context는 좋아지지만 비용과 hallucination 위험이 커진다. 긴 문서는 page-level OCR 후 document-level stitching을 별도 단계로 둔다.</p>
        </div>
      </section>

      <section id="structured-output" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">Markdown·HTML·JSON 출력 설계</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>출력 schema는 OCR 품질의 일부다. RAG에는 heading과 paragraph가 살아 있는 Markdown이 좋다. 표 분석에는 HTML table 또는 cell JSON이 필요하다. 수식 검색과 렌더링에는 LaTeX가 필요하다. 문서 검토 UI에는 bbox와 page coordinate가 필요하다.</p>
          <pre className="not-prose overflow-x-auto rounded-lg border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-950 shadow-sm dark:border-slate-300 dark:bg-white dark:text-slate-950"><code>{`{
  "document_id": "report-sha256:…",
  "page": 12,
  "blocks": [
    {
      "block_id": "p12-b03",
      "type": "heading",
      "order": 3,
      "text": "Revenue",
      "bbox": [86, 112, 512, 154],
      "crop_ref": "crop://report/p12/b03",
      "verification": "verified"
    }
  ],
  "metadata": {
    "source_pdf": "report.pdf",
    "ocr_model": "olmOCR-2-7B-1025",
    "render_dpi": 200,
    "prompt_version": "ocr-v7",
    "schema_version": "typed-block-v4"
  }
}`}</code></pre>
          <p>중요한 것은 사람이 읽기 좋은 출력과 기계가 검증하기 좋은 출력을 동시에 남기는 것이다. Markdown만 저장하면 table cell 검증이 어렵고, JSON만 저장하면 사람이 review하기 불편할 수 있다.</p>
        </div>
      </section>

      <section id="orchestration" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">운영 오케스트레이션</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>OCR 운영은 긴 batch job과 짧은 interactive job이 섞인다. 사용자가 업로드한 3쪽 PDF는 즉시 결과를 보여줘야 하지만, 사내 문서 50만 페이지 ingestion은 며칠 동안 실패 없이 돌아야 한다. 따라서 document job과 page task를 분리하고, page 단위 상태를 저장하는 것이 좋다.</p>
          <p>기본 상태 머신은 <code>queued</code>, <code>rendered</code>, <code>parsed</code>, <code>structured</code>, <code>verified</code>, <code>review_required</code>, <code>approved</code>, <code>failed</code> 정도로 충분하다. 각 page task는 idempotent해야 한다. key는 document hash, page number, render setting, model version, prompt/schema version을 묶어서 만든다. 그래야 모델만 바꿔 재처리하거나, 실패한 page만 재시도할 수 있다.</p>
          <pre className="not-prose overflow-x-auto rounded-lg border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-950 shadow-sm dark:border-slate-300 dark:bg-white dark:text-slate-950"><code>{`job_key = sha256(
  document_hash,
  page_number,
  render_dpi,
  model_name,
  model_version,
  prompt_version,
  output_schema_version
)

if exists_success(job_key):
  return cached_result

render_page()
parse_with_primary_model()
run_quality_gates()
if gates.fail:
  route_to_review_or_fallback()
store_result_with_trace()`}</code></pre>
          <p>queue 설계에서는 timeout과 fallback이 중요하다. 큰 이미지, 복잡한 표, 손상된 PDF가 worker를 오래 붙잡으면 전체 backlog가 쌓인다. page-level timeout을 두되 render profile은 실패 이유에 맞춘다. 작은 글자·수식은 DPI를 올리거나 crop을 좁히고, memory 초과는 DPI·tile 크기를 낮추며, 구조 오류는 다른 parser 또는 human review로 보낸다.</p>
        </div>
      </section>

      <section id="verification" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">Unit tests와 human review</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>olmOCR 2가 보여준 중요한 방향은 OCR을 unit test로 검증할 수 있다는 점이다. 업무 문서에서도 같은 사고방식이 필요하다. OCR output이 문법적으로 그럴듯한지보다, 업무 규칙을 통과하는지가 중요하다.</p>
          <ul>
            <li><strong>금액</strong>: subtotal + tax = total인지 검사한다.</li>
            <li><strong>날짜</strong>: 문서 기간과 표 안 날짜가 일관되는지 검사한다.</li>
            <li><strong>표</strong>: header 수, row 수, merged cell, numeric column alignment를 검사한다.</li>
            <li><strong>수식</strong>: LaTeX parse 가능 여부와 symbol set을 검사한다.</li>
            <li><strong>Reading order</strong>: section heading과 paragraph 순서를 검사한다.</li>
          </ul>
          <p>모든 오류를 자동으로 잡을 수는 없다. 그래서 review queue가 필요하다. unit test 실패, low-confidence page, 숫자 많은 page, scan quality 낮은 page를 사람이 확인하도록 보내야 한다.</p>
        </div>
      </section>

      <section id="quality-gates" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">품질 gate pseudo-code</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>품질 gate는 모델 confidence를 하나 더하는 수준이 아니다. 문서 구조와 업무 규칙을 검사해 page를 자동 승인할지, fallback으로 보낼지, 사람에게 보낼지 결정하는 router다. gate는 보수적으로 설계해야 한다. false positive로 잘못 승인하는 비용이 false negative로 review가 늘어나는 비용보다 큰 경우가 많다.</p>
          <pre className="not-prose overflow-x-auto rounded-lg border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-950 shadow-sm dark:border-slate-300 dark:bg-white dark:text-slate-950"><code>{`function evaluatePage(result, sourceProfile) {
  const gates = []

  gates.push(checkSourceTrace(result.blocks))
  gates.push(checkReadingOrder(result.markdown))
  gates.push(checkTables(result.tables))
  gates.push(checkLatex(result.formulas))

  if (sourceProfile.kind === "invoice") {
    gates.push(checkInvoiceTotals(result.fields))
    gates.push(checkTaxIdFormat(result.fields))
  }

  if (sourceProfile.kind === "financial_report") {
    gates.push(checkNumericColumns(result.tables))
    gates.push(checkPageFootnotes(result.blocks))
  }

  const failed = gates.filter(g => !g.pass)
  if (failed.some(g => g.severity === "critical")) return "review_required"
  if (failed.length > 0) return "fallback_parser"
  return "verified"
}`}</code></pre>
          <p>좋은 gate는 설명 가능해야 한다. “OCR confidence 0.73”보다 “2번 표의 5행 subtotal이 total과 맞지 않음”, “LaTeX parser 실패”, “문단 bbox가 source page에 없음”이 review 작업을 줄인다. 실패 이유가 구체적이어야 사람이 빠르게 확인할 수 있다.</p>
        </div>
        <div className="not-prose my-6 min-w-0">
          <div className="min-w-0 rounded-md border border-border p-3 sm:p-4">
            <MathFormula display className="my-0 text-[12px] sm:text-base">{String.raw`\operatorname{release}(d)=\underbrace{G_{\text{source}}(d)}_{\text{원문으로 돌아감}}\land\underbrace{G_{\text{relation}}(d)}_{\text{문서 관계 검증}}\land\underbrace{G_{\text{table}}(d)}_{\text{표 규칙 통과}}\land\underbrace{G_{\text{citation}}(d)}_{\text{검색 인용 연결}}`}</MathFormula>
          </div>
          <FormulaNote meaning="문서 d는 네 gate가 모두 참일 때만 자동 공개한다. 하나라도 실패하면 점수를 평균내 덮지 않고 review 또는 blocked 상태로 남긴다." symbols={[[String.raw`G_{\text{source}}`, 'block과 origin cell의 page·source_bbox·parser revision provenance 검사'], [String.raw`G_{\text{relation}}`, 'heading, paragraph, caption, cross-page relation 검사'], [String.raw`G_{\text{table}}`, '점유 격자, header lineage, origin-cell source region과 업무 합계 규칙'], [String.raw`G_{\text{citation}}`, 'RAG chunk에서 원본 evidence까지의 역추적 경로']]} />
          <p className="prose prose-neutral mt-4 max-w-none dark:prose-invert">
            <InternalLink slug="html-table-structure-reconstruction">HTML 표 구조 복원</InternalLink>에서 만든 점유 격자와
            header lineage가 바로 <MathFormula>{String.raw`G_{\text{table}}`}</MathFormula>의 입력이다. 표 글자가 맞는지만
            다시 검사하는 것이 아니라 slot 충돌, 병합 범위, header 연결과 업무 합계를 서로 다른 실패 이유로 남긴다.
            실패 receipt에는 <code>origin_cell_id</code>, <code>page</code>, <code>source_bbox</code>, <code>crop_ref</code>를
            포함해 reviewer가 표 전체가 아니라 문제 cell의 원본 영역을 바로 열 수 있게 한다.
          </p>
        </div>
      </section>

      <section id="rag" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">RAG·검색 시스템에 넣는 법</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>OCR 결과를 RAG에 넣을 때 가장 흔한 실패는 layout을 무시하고 chunking하는 것이다. multi-column 문서를 잘못 읽으면 서로 다른 열의 문장이 섞이고, 표를 줄글로 flatten하면 행/열 의미가 사라진다. 그러면 retrieval은 잘 되어도 answer가 틀린 근거를 사용한다.</p>
          <p>권장 방식은 page/block/table 단위 metadata를 유지하는 것이다. 각 chunk에는 source document, page, bbox 또는 block id, heading path, OCR model, verification status를 붙인다. 표는 일반 paragraph chunk와 분리하고, 원본 HTML/JSON을 함께 저장한다.</p>
          <p>LLM answer에는 OCR confidence가 아니라 verification status를 노출하는 것이 좋다. “이 표는 unit test를 통과했다”, “이 페이지는 human reviewed”, “이 숫자는 OCR-only라 검증 필요” 같은 상태가 downstream 신뢰도를 만든다.</p>
        </div>
      </section>

      <section id="observability" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">관측 지표와 review queue</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>OCR 시스템의 observability는 일반 API metrics보다 더 문서 중심이어야 한다. page latency, model latency, render latency, failure reason, review rate, fallback rate, table gate failure, numeric mismatch, hallucination suspect count를 모두 page type별로 나눠 봐야 한다. 평균 성공률만 보면 특정 문서 유형의 붕괴를 놓친다.</p>
          <ul>
            <li><strong>Throughput</strong>: pages/min, queue depth, worker utilization, p95 page latency.</li>
            <li><strong>Quality</strong>: verified ratio, review_required ratio, gate failure by type.</li>
            <li><strong>Cost</strong>: page당 GPU seconds, token count, render DPI별 비용.</li>
            <li><strong>Regression</strong>: model version별 golden set diff, table/math failure delta.</li>
            <li><strong>Review</strong>: reviewer correction rate, repeated failure template, time-to-approval.</li>
          </ul>
          <p>review queue는 단순히 실패 page를 쌓는 곳이 아니라 데이터 개선 loop의 시작점이다. 사람이 고친 결과는 verifier rule, prompt contract, fine-tuning sample, golden set 중 하나로 되돌아가야 한다. review가 데이터 개선으로 이어지지 않으면 같은 오류를 계속 사람이 고치게 된다.</p>
        </div>
      </section>

      <section id="benchmark" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">벤치마크 프로토콜</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>내 문서에 맞는 OCR 벤치마크를 만들려면 문서 유형별 golden set이 필요하다. 논문 20 pages, 계약서 20 pages, 영수증 20 pages, 표 많은 보고서 20 pages, 저품질 스캔 20 pages처럼 실패 모드를 나눠야 한다.</p>
          <p>점수는 CER(Character Error Rate, 글자 오류율)와 WER(Word Error Rate, 단어 오류율)만으로 끝내지 않는다. reading order accuracy, table structure score, formula parse rate, numeric exact match, field extraction accuracy, hallucination count, processing time, peak memory, page cost를 함께 기록한다.</p>
          <p>모델 비교는 olmOCR 2, <InternalLink slug="paddleocr-vl">PaddleOCR-VL</InternalLink>, PP-StructureV3/PP-OCR pipeline, 범용 VLM을 같은 문서 set에서 돌린다. 출력 schema가 다르면 공정 비교가 어려우므로 Markdown/HTML/JSON normalization layer를 둔다.</p>
        </div>
        <CapabilityCheck items={[
          'Page parser의 출력과 document assembler의 relation을 서로 다른 artifact로 설명할 수 있다.',
          '표 구조·금액 합계·수식 parsing처럼 자동 검증 가능한 gate를 문서 유형별로 정의할 수 있다.',
          'OCR confidence가 높아도 source trace가 없으면 release를 막아야 하는 이유를 설명할 수 있다.',
          'Golden set을 문서 유형과 실패 mode로 나누고 품질·속도·비용 회귀를 함께 측정할 수 있다.',
          'RAG 답변에서 chunk, block, page, bbox와 원문 crop까지 역추적할 수 있다.',
        ]} />
        <StopRule>각 page artifact의 idempotency key와 source identity를 고정하고, 실패 gate·block ID·page·bbox·crop reference가 담긴 release receipt로 공개·검토·차단을 재현할 수 있으면 이 경로에서 멈춘다.</StopRule>
        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p>
            문서 관계와 provenance 계약을 다시 확인하려면{' '}
            <InternalLink slug="document-structure-assembly">앞 단계인 Document Assembly</InternalLink>로 돌아간다.
          </p>
        </div>
        <SourceNotes sources={[
          { label: 'Ai2 · olmOCR 2: Unit test rewards for document OCR', href: 'https://allenai.org/blog/olmocr-2', note: '합성 HTML에서 만든 binary unit test를 GRPO reward와 olmOCR-Bench 평가에 사용한 공식 연구 글. 본문의 unit-test 방향과 공개 수치의 근거다.' },
          { label: 'Poznanski et al. · olmOCR 2 technical report', href: 'https://arxiv.org/abs/2510.19817', note: 'olmOCR-2-7B-1025, verifiable reward, math·table·multi-column 개선 주장의 1차 논문.' },
          { label: 'PaddleOCR · PP-StructureV3 official documentation', href: 'https://www.paddleocr.ai/main/en/version3.x/algorithm/PP-StructureV3/PP-StructureV3.html', note: 'layout, table, formula, chart, reading order와 Markdown 출력 모듈의 공식 범위. 전체 document assembly를 보장한다는 근거로 사용하지 않는다.' },
          { label: 'Zhong et al. · PubTabNet and TEDS', href: 'https://arxiv.org/abs/1911.10683', note: 'HTML table structure와 Tree-Edit-Distance 기반 평가의 원 논문. 업무 합계나 provenance 정확도까지 대신하지 않는다.' },
          { label: 'Xu et al. · MinerU-Popo', href: 'https://arxiv.org/abs/2605.24973', note: 'page-level OCR 뒤 text/table truncation, title hierarchy, image-text association을 document-level로 복원하는 근거.' },
        ]} />
      </section>
    </div>
  );
}

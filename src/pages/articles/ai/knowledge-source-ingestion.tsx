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
  IngestionStructureExplorer,
  StructureRecoveryGate,
} from './knowledge-system-core/viz/KnowledgeSystemExplorers';

export default function KnowledgeSourceIngestionArticle() {
  return (
    <>
      <section id="source-envelope" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">파싱 전에 “어느 원본을 읽었는가”부터 고정한다</h2>
        <QuestionLead
          question="PDF를 Markdown으로 잘 바꿨는데도 왜 나중에 답의 출처를 증명하지 못할까?"
          answer="변환 text만 저장했기 때문이다. 원본 byte, logical work, exact version, 수집 시각, content hash, 접근 권한과 parser configuration을 함께 고정해야 같은 입력을 다시 처리하고 수정 전후를 비교할 수 있다."
        />
        <ConceptPrimer items={[
          { term: 'Source identity', meaning: '같은 매뉴얼·논문·영상 계열을 가리키는 오래가는 논리 ID다.', why: 'URL이 바뀌어도 같은 work의 revision을 묶는다.' },
          { term: 'Document version', meaning: 'rev 1.2 PDF처럼 byte와 metadata가 고정된 한 시점의 원본이다.', why: '새 revision이 와도 과거 evidence를 덮어쓰지 않는다.' },
          { term: 'Content hash', meaning: '원본 byte에서 계산한 fingerprint다.', why: '파일명이 같아도 내용이 바뀐 silent update를 찾는다.' },
          { term: 'Source envelope', meaning: 'identity·version·hash·language·license·ACL·retrieved_at을 묶은 수집 계약이다.', why: 'Parser가 무엇을 읽었는지 재현하고 tenant 경계를 지킨다.' },
        ]} />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            원본은 변환 결과보다 먼저 저장한다. <code>manual-v1.3.pdf</code>가 들어오면 raw object를 immutable storage에 두고,
            논리적인 manual ID와 revision 1.3을 연결한다. 그 다음 parser run이 어떤 code version과 option으로 이 원본을 읽었는지 기록한다.
            그래야 OCR 모델을 바꾸어도 같은 원본에서 나온 두 결과를 비교할 수 있다.
          </p>
          <p>
            Access policy도 envelope의 일부다. 사내 문서 A를 읽을 권한이 없는 사용자의 query가 vector similarity만으로 A의 chunk를 가져오면
            generation 전에 이미 정보 유출이다. ACL·tenant·retention과 PII policy는 retrieval filter가 아니라 ingestion부터 이어지는 metadata다.
          </p>
        </div>
        <M display>{String.raw`\mathcal{A}(b)=\left(\underbrace{s}_{\text{원문 ID}},\underbrace{v}_{\text{버전}},\underbrace{\ell}_{\text{위치 주소}},\underbrace{r}_{\text{범위}}\right)`}</M>
        <FormulaNote
          meaning="Block b의 source address를 네 부분으로 고정한다. 문장 문자열만 저장하지 않고 어느 source version의 어느 위치와 범위에서 왔는지 남겨야 재검증할 수 있다."
          symbols={[
            ['A(b)', 'block b를 원문으로 되돌리는 주소'],
            ['s', 'manual, video, repository 같은 논리 source id'],
            ['v', 'revision, content hash 또는 commit처럼 고정된 version'],
            ['ℓ', 'page+bbox, timestamp+frame, file+line+symbol 같은 위치'],
            ['r', '정확한 char span, cell range, time interval 같은 범위'],
          ]}
        />
      </section>

      <section id="parser-routing" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">모든 입력을 한 VLM에 보내지 않고 구조가 살아 있는 길을 먼저 쓴다</h2>
        <p className="mb-3 max-w-3xl text-sm leading-relaxed text-muted-foreground"><strong className="text-foreground">VLM(Visual Language Model)</strong>은 이미지와 글을 함께 읽고 설명을 생성하는 모델이다. 복합 그림을 해석하는 데 유용하지만, 원문의 좌표·셀·문장 경계를 그대로 복사하는 결정론적 parser는 아니다.</p>
        <p className="mb-5 max-w-3xl text-sm leading-relaxed text-muted-foreground">PDF, video와 repository는 보존할 수 있는 native 구조와 다시 찾을 주소가 서로 다르다. 다음 장면은 source artifact를 바꾸고 structure recovery를 끄고 켜며 native parser, specialist 처리와 stable address가 text-only 추출에서 어떻게 사라지는지 비교한다.</p>
        <IngestionStructureExplorer />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            입력마다 이미 가지고 있는 정보가 다르다. HTML은 heading과 table DOM을 가지고 있고 Git은 commit과 AST를 가진다.
            이를 screenshot으로 바꿔 다시 읽으면 정확한 구조를 일부러 버린 뒤 추측하는 셈이다. Native parser가 보존할 수 있는 의미를 먼저 사용한다.
          </p>
          <p>
            PDF는 반대다. 화면에는 두 단, 표, 그림과 수식이 보이지만 내부 text object의 순서가 읽는 순서와 다를 수 있다.
            Digital PDF에서는 glyph와 좌표를 먼저 얻고 layout model로 block을 묶는다. Scan page에서는 OCR이 필요하며,
            table structure recognition과 formula recognition은 일반 OCR text와 별도의 specialist stage가 될 수 있다.
          </p>
          <p>
            Video도 transcript 하나로 끝나지 않는다. 말한 시점, slide가 바뀐 frame, code demo의 화면 구간을 같은 timeline에 놓는다.
            Repository는 README만 읽지 않고 release tag가 가리키는 commit, file, symbol, test와 dependency edge를 고정한다.
          </p>
        </div>
        <div className="not-prose my-8 border-y border-border">
          {[
            ['1 · Native', 'DOM·PDF object·Git object처럼 source가 이미 가진 구조를 읽는다.', '결정론적이고 값싼 첫 경로'],
            ['2 · Specialist', 'OCR·layout·table·formula·ASR·AST처럼 좁은 모델이 한 구조를 복구한다.', '오류 종류를 측정하기 쉬움'],
            ['3 · VLM fallback', '깨진 page나 복합 diagram처럼 앞 단계가 낮은 confidence를 낸 구간만 본다.', '비용과 hallucination 범위 제한'],
            ['4 · Validator', 'Cell 수, caption anchor, source span, schema와 허용 ID를 프로그램으로 검사한다.', '모델의 확신과 사실을 분리'],
          ].map(([step, body, why]) => <div key={step} className="grid gap-2 border-b border-border py-5 last:border-b-0 sm:grid-cols-[8rem_minmax(0,1fr)_10rem]"><strong className="text-xs">{step}</strong><p className="text-xs leading-relaxed text-muted-foreground">{body}</p><p className="text-xs font-semibold leading-relaxed">{why}</p></div>)}
        </div>
        <Misconception>
          VLM이 화면을 이해한다고 해서 faithful converter가 되는 것은 아니다. 설명을 잘 생성하는 능력은 원문에 없는 cell이나 문장을 만들 위험도 가진다.
          Conversion path에서는 “알 수 없음”과 정확한 source address가 자연스러운 문장보다 중요하다.
        </Misconception>
      </section>

      <section id="structure-recovery" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Block을 찾는 것보다 block 사이 관계를 복구하는 일이 더 어렵다</h2>
        <p className="mb-5 max-w-3xl text-sm leading-relaxed text-muted-foreground">문자를 정확히 읽어도 페이지를 넘는 표, 수식의 적용 조건과 figure-caption 연결은 끊길 수 있다. 다음 gate에서는 이 세 관계를 하나씩 깨뜨려 text coverage와 무관하게 IR handoff가 review queue로 닫히는 지점을 확인한다.</p>
        <StructureRecoveryGate />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            41쪽 아래에서 시작한 표가 42쪽 위에서 계속되면 두 개의 table object가 아니라 하나의 logical table일 수 있다.
            Header 반복, column geometry, caption과 table identifier를 이용해 segment를 연결하되, 확신이 낮으면 억지로 merge하지 않고 continuation candidate로 남긴다.
          </p>
          <p>
            수식도 LaTeX 문자열만 뽑으면 부족하다. 본문의 “온도가 80°C 이하일 때” 같은 qualifier, 식 번호, symbol definition과 참조 문장이
            같은 anchor group에 들어가야 한다. Figure는 image crop, caption, 본문의 “Figure 7을 보라”는 reference를 연결한다.
          </p>
          <p>
            Reading order는 좌표의 단순한 위→아래 정렬이 아니다. 두 단 문서에서 왼쪽 단을 끝내기 전에 오른쪽 단으로 넘어가거나,
            header·footer가 본문에 끼면 다음 단계의 chunk와 claim이 이미 잘못된다. Section hierarchy와 furniture를 따로 표시한다.
          </p>
        </div>
        <M display>{String.raw`C_{\mathrm{str}}=\frac{\sum_{i=1}^{m}\underbrace{w_i}_{\text{구조 중요도}}\underbrace{\mathbf{1}[\hat r_i=r_i]}_{\text{관계 복구 성공}}}{\underbrace{\sum_{i=1}^{m}w_i}_{\text{필수 구조 전체}}}`}</M>
        <FormulaNote
          meaning="Structure coverage는 text character 수가 아니라 필요한 관계가 정확히 복구됐는지를 중요도 가중 평균으로 본다. 안전 한계 표와 수식 scope는 footer보다 큰 가중치를 줄 수 있다."
          symbols={[
            ['C_str', '필수 구조 관계의 가중 복구율'],
            ['r_i', 'gold fixture에 기록한 i번째 실제 관계'],
            ['r̂_i', 'parser가 복구한 관계'],
            ['1[·]', '두 관계가 맞으면 1, 아니면 0인 indicator'],
            ['w_i', 'table row, formula scope, caption anchor 등 관계별 위험 가중치'],
          ]}
        />
        <M display>{String.raw`L_{\mathrm{link}}=1-\frac{\underbrace{|E_{\mathrm{pred}}\cap E_{\mathrm{gold}}|}_{\text{맞게 복구한 연결}}}{\underbrace{|E_{\mathrm{gold}}|}_{\text{필수 연결}}}`}</M>
        <FormulaNote
          meaning="Link loss는 필요한 structure edge 중 놓친 비율이다. Text가 99% 맞아도 formula와 qualifier 연결 하나를 놓치면 이 지표가 실패를 드러낸다."
          symbols={[
            ['L_link', '0이면 모든 필수 연결이 살아 있고 1에 가까울수록 많이 잃은 값'],
            ['E_pred', 'parser가 만든 reading-order, continuation, caption, scope edge 집합'],
            ['E_gold', '사람이 fixture에 확인한 필수 edge 집합'],
            ['∩', '예측과 정답에 동시에 있는 올바른 edge'],
          ]}
        />
      </section>

      <section id="source-coordinates" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">형식마다 다른 주소를 공통 locator interface로 감싼다</h2>
        <div className="not-prose my-8 divide-y divide-border border-y border-border">
          {[
            ['PDF / image', 'page_no · bbox · charspan · rotation', '해당 page를 다시 render하고 정확한 영역을 강조한다.'],
            ['HTML / Office', 'canonical URL · DOM path · heading path · charspan', 'Selector가 바뀌어도 content hash와 heading ancestry로 후보를 찾는다.'],
            ['Video / audio', 'media id · start/end time · frame id · transcript span', '말, slide와 code frame을 같은 시간 구간으로 연다.'],
            ['Repository', 'repo · commit · file · line range · symbol', '현재 default branch가 아니라 답에서 사용한 exact code를 연다.'],
          ].map(([source, address, action]) => <div key={source} className="grid gap-2 py-5 sm:grid-cols-[8rem_minmax(0,1fr)_minmax(0,1fr)]"><strong className="text-xs">{source}</strong><code className="break-words text-[10px] leading-relaxed">{address}</code><p className="text-xs leading-relaxed text-muted-foreground">{action}</p></div>)}
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            공통 schema가 모든 위치를 똑같은 숫자로 만들 필요는 없다. 대신 <code>open(locator)</code>, <code>quote(locator)</code>,
            <code>contains(locator, child)</code>처럼 downstream이 필요한 동작을 같은 interface로 제공한다.
            PDF bbox와 Git symbol의 실제 field는 다르지만 둘 다 원문을 다시 열고 범위를 검증할 수 있어야 한다.
          </p>
        </div>
      </section>

      <section id="ingestion-release" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Ingestion의 완료는 예쁜 Markdown이 아니라 재현 가능한 fixture다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>첫 구현은 형식을 넓히지 말고 위험 fixture를 좁게 고정한다. 예를 들어 digital PDF, scanned PDF, HTML, repository 네 경로로 시작한다.</p>
          <ol>
            <li>원본, envelope, parser run과 output schema version을 저장한다.</li>
            <li>Two-column page, cross-page table, formula+scope, figure reference와 appendix를 gold fixture로 만든다.</li>
            <li>Block text coverage와 structure edge coverage를 따로 측정한다.</li>
            <li>Source address로 원문을 다시 열어 highlight가 맞는지 browser test한다.</li>
            <li>Low-confidence 구간만 fallback queue로 보내고 unknown을 데이터 상태로 남긴다.</li>
            <li>ACL과 prompt-injection content를 downstream instruction channel과 분리한다. Prompt injection은 문서 안의 문장을 지식이 아니라 “이전 지시를 무시하라” 같은 실행 명령으로 오인하게 만드는 공격이다.</li>
          </ol>
        </div>
        <CapabilityCheck items={[
          '같은 manual의 logical identity와 immutable revision을 분리한다.',
          'PDF·video·repository가 서로 다른 parser와 address를 가져야 하는 이유를 설명한다.',
          'Cross-page table, formula qualifier와 figure-caption reference를 text extraction 밖의 구조 문제로 분류한다.',
          'Native parser → specialist model → VLM fallback → validator의 순서를 설계한다.',
          'Character accuracy가 높은데도 structure fixture가 실패하는 반례를 만든다.',
          '원문 locator를 이용해 table cell, video frame과 exact code commit을 다시 연다.',
        ]} />
        <LearningHandoff
          description="Ingestion의 산출물은 예쁜 Markdown이 아니라 versioned source, typed block, relation edge와 원문으로 돌아가는 locator다. 그 구조를 의미 graph로 올릴 때만 다음 단계를 연다."
          items={[
            { label: '막히면', slug: 'knowledge-compiler', title: 'Knowledge Compiler', reason: 'Source·structure·meaning·retrieval·maintenance 다섯 계약 중 지금 깨진 경계를 먼저 고른다.' },
            { label: '이어 읽기', slug: 'knowledge-ir-evidence-lineage', title: 'Knowledge IR · Evidence Lineage', reason: 'Block과 locator를 Claim·Scope·Evidence·Transformation graph로 바꾸고 수정 영향을 추적한다.' },
            { label: '적용하기', slug: 'research-codar-2026', title: 'CoDaR 연구 재구성', reason: 'Reading order와 context dependency를 잃은 chunking이 실제 장문 추론을 어떻게 깨뜨리는지 검증한다.' },
          ]}
        />
        <SourceNotes sources={[
          { label: 'IBM Research · Docling, AAAI 2025', href: 'https://research.ibm.com/publications/docling-an-efficient-open-source-toolkit-for-ai-driven-document-conversion', note: 'Parser backend, PDF pipeline, layout·table specialist와 unified document representation.' },
          { label: 'DoclingDocument v2', href: 'https://docling-project.github.io/docling/concepts/docling_document/', note: 'Text·table·picture·hierarchy·bbox와 provenance를 함께 표현하는 current data model.' },
          { label: 'GROBID', href: 'https://github.com/kermitt2/grobid', note: '학술 문서 header, citation과 full-text 구조를 복구하는 독립 parser 사례.' },
          { label: 'Tree-sitter', href: 'https://tree-sitter.github.io/tree-sitter/', note: 'Code를 text chunk가 아니라 syntax tree와 symbol 단위로 읽는 parser 기반.' },
        ]} />
      </section>
    </>
  );
}

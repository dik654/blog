import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Blocks, CheckCircle2, FileInput, FileSearch, GitMerge, ShieldCheck } from 'lucide-react';
import {
  BeginnerBridge,
  CapabilityCheck,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
  StopRule,
} from '@/components/learning/ArticleLearning';
import { articlePath } from '@/lib/paths';
import { PageToDocumentAssemblyLab, TypedBlockStrip } from './document-structure-assembly/viz/DocumentAssemblyLabs';

const stages = [
  { number: '00', title: '문서 계약', icon: FileInput, input: '업무 질문·문서 유형', work: '정답 단위, source trace, 허용 오류와 review 비용을 고정한다.', output: '입출력·품질 계약', risk: '“Markdown이면 충분”처럼 downstream을 생략한다.' },
  { number: '01', title: 'Page parser', icon: FileSearch, input: 'PDF page·scan', work: 'Text·table·formula·figure와 page 안 reading order를 찾는다.', output: 'Typed page blocks', risk: '페이지가 맞으면 문서 전체도 맞다고 가정한다.' },
  { number: '02', title: 'Document assembly', icon: GitMerge, input: '여러 page의 blocks', work: '끊긴 문단·표·제목 계층·그림 caption 관계를 복원한다.', output: 'Document tree + relation', risk: '모호한 관계를 자연스러운 text로 덮는다.' },
  { number: '03', title: 'Deterministic verify', icon: Blocks, input: 'Tree·HTML·LaTeX', work: 'Grid, schema, 숫자, source lineage와 문법 invariant를 검사한다.', output: 'Pass·review·fallback', risk: 'Model confidence 하나로 승인한다.' },
  { number: '04', title: 'Release · RAG', icon: ShieldCheck, input: '검증된 document nodes', work: 'Golden 질문, citation fidelity, 비용·latency와 회귀를 검증한다.', output: '검색 가능한 근거', risk: 'Retrieval hit만 보고 답의 근거 path를 확인하지 않는다.' },
] as const;

function ExecutionPath() {
  const [active, setActive] = useState(0);
  const stage = stages[active];
  const ActiveIcon = stage.icon;
  return (
    <figure data-document-execution-path className="foundation-viz-explorer not-prose my-8 min-w-0 scroll-mt-20 overflow-hidden rounded-md border border-border">
      <figcaption className="grid gap-2 border-b border-border px-4 py-4 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center sm:px-5">
        <span className="font-mono text-xs font-black text-blue-700 dark:text-blue-300">EVIDENCE PIPELINE</span>
        <strong className="text-sm leading-snug">모델 이름이 아니라 각 단계의 입력·출력·실패 책임을 따라간다</strong>
        <span className="w-fit rounded-sm border border-border px-2 py-1 font-mono text-xs font-bold text-muted-foreground">5 stages</span>
      </figcaption>
      <div className="grid grid-cols-2 gap-2 p-4 sm:p-5 lg:grid-cols-5">
        {stages.map((item, index) => {
          const Icon = item.icon;
          return (
            <button key={item.number} type="button" aria-pressed={active === index} onClick={() => setActive(index)} className={`min-h-20 min-w-0 rounded-md border p-3 text-left transition-colors last:col-span-2 lg:last:col-span-1 ${active === index ? 'border-blue-600/45 bg-blue-500/[0.06]' : 'border-border hover:bg-muted/25'}`}>
              <span className="flex items-center justify-between gap-2"><Icon className="h-4 w-4" aria-hidden="true" /><span className="font-mono text-xs font-black text-muted-foreground">{item.number}</span></span>
              <strong className="mt-3 block text-xs leading-snug">{item.title}</strong>
            </button>
          );
        })}
      </div>
      <div className="border-t border-border bg-muted/15 p-4 sm:p-5">
        <div className="flex min-w-0 items-start gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-border bg-background"><ActiveIcon className="h-4 w-4" aria-hidden="true" /></span><div className="min-w-0"><p className="text-sm font-black">{stage.title}</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{stage.work}</p></div></div>
        <div className="mt-4 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3">{[['입력', stage.input], ['출력', stage.output], ['깨지는 지점', stage.risk]].map(([label, value]) => <div key={label} className="min-w-0 bg-background p-3"><p className="text-xs font-black text-muted-foreground">{label}</p><p className="mt-1 text-xs leading-relaxed">{value}</p></div>)}</div>
      </div>
    </figure>
  );
}

const parserChoices = [
  { title: 'PaddleOCR-VL-1.6', question: '다국어 page를 구조화해야 한다', mechanism: 'PP-DocLayoutV2가 요소와 순서를 찾고 0.9B VLM이 crop을 읽는다.', boundary: '현재 page parser 사례' },
  { title: 'olmOCR 2', question: '학습 reward도 자동 검증하고 싶다', mechanism: '합성 문서의 unit test를 문서 출력 reward와 평가에 연결한다.', boundary: '검증 가능한 training signal 사례' },
  { title: 'Module pipeline', question: '좌표와 업무 field를 반복 추출한다', mechanism: 'Detector·recognizer·layout·table module을 나눠 실패와 교체 범위를 좁힌다.', boundary: '좌표·업무 field 중심 대안' },
] as const;

function ParserBoundaryLab() {
  const [active, setActive] = useState(0);
  const choice = parserChoices[active];
  return (
    <figure data-parser-boundary-lab className="foundation-viz-explorer not-prose my-8 scroll-mt-20 overflow-hidden rounded-md border border-border">
      <figcaption className="border-b border-border px-4 py-4 sm:px-5"><span className="font-mono text-xs font-black text-blue-700 dark:text-blue-300">PARSER BOUNDARY</span><strong className="mt-1 block text-sm">모델 이름보다 질문과 책임 경계를 먼저 고른다</strong></figcaption>
      <div className="grid gap-2 p-4 sm:grid-cols-3 sm:p-5" role="group" aria-label="Page parser 목적 선택">{parserChoices.map((item, index) => <button key={item.title} type="button" aria-pressed={active === index} onClick={() => setActive(index)} className={`min-h-20 rounded-md border p-3 text-left text-xs font-bold ${active === index ? 'border-blue-600/45 bg-blue-500/[0.06]' : 'border-border'}`}>{item.title}</button>)}</div>
      <div className="grid gap-px border-t border-border bg-border sm:grid-cols-3">{[['먼저 묻는 질문', choice.question], ['실행 방식', choice.mechanism], ['이 글에서의 위치', choice.boundary]].map(([label, value]) => <div key={label} className="min-w-0 bg-background p-4"><p className="text-xs font-black text-muted-foreground">{label}</p><p className="mt-2 text-xs leading-relaxed">{value}</p></div>)}</div>
    </figure>
  );
}

const releaseQuestions = [
  ['인식', 'Text·formula·table content가 source crop과 정확히 대응하는가?'],
  ['구조', 'Reading order, heading path, merged cell과 cross-page relation이 맞는가?'],
  ['근거', '모든 retrieval node가 document·page·bbox·parser revision으로 돌아가는가?'],
  ['사용 결과', 'Golden 질문의 값, 문맥, heading path와 citation page가 모두 맞는가?'],
  ['운영', 'Latency, page cost, fallback, review rate와 queue 회복이 SLO 안인가?'],
  ['회귀', 'Parser·assembler·schema 변경 전후에 어떤 문서 유형이 나빠졌는가?'],
] as const;

function ReleaseQuestionLab() {
  const [active, setActive] = useState(0);
  const [title, question] = releaseQuestions[active];
  return (
    <figure data-document-release-questions className="foundation-viz-explorer not-prose my-8 scroll-mt-20 overflow-hidden rounded-md border border-border">
      <figcaption className="border-b border-border px-4 py-4 sm:px-5"><span className="font-mono text-xs font-black text-blue-700 dark:text-blue-300">RELEASE QUESTIONS</span><strong className="mt-1 block text-sm">평균 점수 대신 실패 표면을 하나씩 연다</strong></figcaption>
      <div className="grid gap-2 p-4 sm:grid-cols-3 sm:p-5" role="group" aria-label="릴리스 검증 항목">{releaseQuestions.map(([label], index) => <button key={label} type="button" aria-pressed={active === index} onClick={() => setActive(index)} className={`min-h-12 rounded-md border px-3 text-left text-xs font-bold ${active === index ? 'border-emerald-600/45 bg-emerald-500/[0.06]' : 'border-border'}`}>{label}</button>)}</div>
      <div className="flex min-w-0 items-start gap-3 border-t border-border bg-muted/15 p-4 sm:p-5"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-300" /><div className="min-w-0"><p className="text-sm font-black">{title}</p><p className="mt-1 text-sm leading-relaxed text-muted-foreground">{question}</p></div></div>
    </figure>
  );
}

const route = [
  { number: '01', slug: 'paddleocr-vl', hash: '', title: 'PaddleOCR-VL-1.6', question: '한 page에서 어떤 block과 reading order를 얻는가?', note: '현재 page parser 사례' },
  { number: '01B', slug: 'olmocr-2', hash: '', title: 'olmOCR 2', question: '문서 unit test를 학습 reward와 평가에 연결해야 하는가?', note: '필요할 때만 · 검증 분기' },
  { number: '01C', slug: 'paper-donut-2021', hash: '', title: 'Donut (2021)', question: '외부 OCR 경계를 없앤 image-to-sequence 기준점까지 내려가야 하는가?', note: '필요할 때만 · 원문' },
  { number: '02', slug: 'document-structure-assembly', hash: '', title: 'Document Assembly', question: 'Page 사이 관계를 무엇으로 잇고 언제 보류하는가?', note: '필수 연결 단계' },
  { number: '03', slug: 'html-table-structure-reconstruction', hash: '', title: 'HTML Table Grid', question: '병합 cell을 deterministic하게 어떻게 검산하는가?', note: '표 구조 verifier' },
  { number: '03B', slug: 'ocr-runtime-evaluation', hash: '#verification', title: 'Document Rule Verification', question: '금액·날짜·표·수식·reading order를 어떤 규칙으로 fail-closed 하는가?', note: '문서 규칙 verifier' },
  { number: '04', slug: 'ocr-runtime-evaluation', hash: '#quality-gates', title: 'Runtime · Release · RAG', question: '어떤 증거가 있어야 검색 근거로 배포하는가?', note: '운영 gate' },
] as const;

export default function OCRDocumentAIMapArticle() {
  return (
    <>
      <section id="document-contract" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">먼저 문서 계약을 정한다</h2>
        <BeginnerBridge title="영수증의 글자를 모두 옮겨 적어도 금액과 품목의 관계를 잃으면 업무는 끝나지 않는다">
          OCR은 사진 속 글자를 문자열로 읽는 단계다. Document AI는 제목·본문·표·좌표와 읽는 순서를 함께 복원해, 나중에 답이 어느 페이지와 영역에서 나왔는지 다시 확인할 수 있게 만든다.
        </BeginnerBridge>
        <QuestionLead
          question="OCR의 목표는 글자를 많이 맞히는 것일까, 질문에 근거를 대며 정확히 답하는 것일까?"
          answer="업무 목표가 검색 증강 생성(Retrieval-Augmented Generation, RAG)이라면 후자다. 글자 인식률이 높아도 표 header, 제목 계층, 그림 caption과 source page가 끊기면 검색 결과의 의미가 바뀐다. 그래서 모델을 고르기 전에 독자가 물을 질문과 답이 돌아가야 할 원본 위치를 먼저 정한다."
        />
        <ConceptPrimer items={[
          { term: 'Reading order', meaning: '페이지의 제목·본문·표·각주를 사람이 읽어야 할 순서.', why: '좌표가 가까운 요소를 잘못 이어 문장의 의미가 바뀌는 일을 막는다.' },
          { term: 'Page parser', meaning: '한 페이지 안의 text·table·formula·figure를 찾고 reading order로 배열하는 단계.', why: '문자 인식과 page 내부 layout 책임을 분리한다.' },
          { term: 'Document assembler', meaning: '여러 페이지의 block을 문단·표·제목·caption 관계로 연결하는 단계.', why: '페이지 경계에서 끊긴 논리 구조를 복원한다.' },
          { term: 'IR · Intermediate Representation', meaning: '여러 parser의 출력을 같은 필드와 관계로 정규화한 중간 표현.', why: '사람용 Markdown을 만들기 전에도 원본 위치·타입·관계를 잃지 않고 검산한다.' },
          { term: 'Verifier', meaning: 'HTML grid, 숫자, LaTeX, source reference처럼 명시적 규칙을 검사하는 코드.', why: '유창한 모델 출력만으로 승인하지 않는다.' },
          { term: 'Evidence object', meaning: '내용과 함께 page, bounding box(bbox, 원본 좌표 사각형), parser revision, verification 상태를 가진 검색 근거.', why: '답변에서 원본까지 되돌아가 오류를 확인한다.' },
        ]} />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>첫 질문은 “어떤 OCR 모델이 최고인가?”가 아니다. 계약서 조항을 찾는지, 연차보고서 표의 숫자를 비교하는지, 논문의 수식을 렌더링하는지에 따라 필요한 output schema와 허용 오류가 달라진다. 검색 답변에는 최소한 document ID, page, block ID, heading path와 verification status가 따라야 한다.</p>
          <Misconception>OCR benchmark 한 점수는 제품 계약이 아니다. Text, formula, table, reading order, cross-page relation, citation fidelity는 서로 다른 실패 표면이다.</Misconception>
        </div>
      </section>

      <section id="execution-path" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">다섯 단계 실행 경로</h2>
        <p className="mb-5 max-w-3xl text-sm leading-relaxed text-muted-foreground">문서를 읽는 일은 OCR 한 번이 아니라 문서 계약, page parsing, 문서 조립, deterministic verification과 release·RAG가 이어지는 과정이다. 다음 장면에서 각 단계의 입력·출력과 깨지는 지점을 분리해 교체 가능한 경계를 먼저 잡는다.</p>
        <ExecutionPath />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>각 단계는 앞 단계가 만든 결과를 입력으로 받지만 같은 책임을 갖지 않는다. Page parser가 표를 HTML로 만들고, document assembler가 다음 page의 표 fragment와 연결하며, deterministic verifier가 <code>rowspan</code>·<code>colspan</code>과 숫자 invariant를 검사한다. Release 단계는 실제 질문과 citation을 다시 확인한다.</p>
          <p>이 분리는 교체 가능성도 만든다. Page parser를 PaddleOCR-VL에서 olmOCR로 바꿔도 normalized block IR가 같다면 assembler와 verifier를 재사용할 수 있다. 반대로 assembler만 바꿨을 때 page recognition regression까지 다시 추측할 필요가 없다.</p>
        </div>
      </section>

      <section id="typed-blocks" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">공통 언어: typed block IR</h2>
        <p className="mb-5 max-w-3xl text-sm leading-relaxed text-muted-foreground">Markdown 문자열만 넘기면 표 cell, 수식 crop과 원본 좌표가 사라져 후속 검산이 불가능하다. 다음 strip은 heading, paragraph, table과 formula를 바꿔 보며 공통 identity·content·source·evidence와 타입별 고유 필드를 함께 보존하는 최소 IR을 보여준다.</p>
        <TypedBlockStrip />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>사람에게 보여줄 Markdown과 시스템이 검산할 IR을 구분한다. Heading에는 level·typography·heading path, paragraph에는 text·language·continuation hint, table에는 HTML·cell·column signature, formula에는 LaTeX·display mode·source crop을 둔다. page·bbox·order 같은 원본 위치는 어느 타입에나 공통 source reference로 보존한다.</p>
          <p>여러 parser를 비교할 때도 Markdown 문자열 전체를 diff하지 않는다. 같은 source region을 가리키는 block을 정렬하고 text, type, geometry, structure 차이를 각각 기록한다. 이 표준화가 있어야 “모델 A는 글자는 맞지만 열 구조가 틀렸다”처럼 실패를 설명할 수 있다.</p>
        </div>
      </section>

      <section id="parser-boundary" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Page parser가 끝나는 곳</h2>
        <p className="mb-5 max-w-3xl text-sm leading-relaxed text-muted-foreground">Page parser를 고를 때도 모델 순위보다 필요한 출력과 검증 방식을 먼저 정해야 한다. 다음 장면은 다국어 구조화, 자동 검증 가능한 학습, 반복적인 좌표·업무 field 추출이라는 질문에 따라 PaddleOCR-VL, olmOCR와 module pipeline의 실행 방식과 책임 경계를 비교한다.</p>
        <ParserBoundaryLab />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>PaddleOCR-VL-1.6 공식 문서는 96.33% OmniDocBench v1.6 결과와 scanning, warping, screen photography, illumination, skew의 Real5 평가를 보고한다. 이는 제작팀의 benchmark 주장으로 읽고, 내 문서 유형의 golden set으로 다시 검증해야 한다. 1.6은 1.5와 같은 architecture를 유지하면서 data optimization과 continued pre-training, SFT, RL의 progressive post-training을 적용했다고 설명한다.</p>
          <p><InternalLink slug="paddleocr-vl">PaddleOCR-VL 글</InternalLink>에서는 page image가 typed output이 되는 현재 실행 계약을 읽는다. 학습 reward와 evaluator가 병목일 때만 <InternalLink slug="olmocr-2">olmOCR 2 글</InternalLink>을 열고, 외부 OCR 경계를 제거한 기준점을 확인해야 할 때만 <InternalLink slug="paper-donut-2021">Donut 원문</InternalLink>으로 내려간다. 두 선택 글은 현재 production 경로의 필수 선수 과목이 아니다.</p>
        </div>
        <StopRule>현재 목표가 다국어 문서 ingestion이라면 PaddleOCR-VL-1.6을 page parser 사례로 잡고 다음으로 간다. 저해상도 character failure의 원인을 문자 검출·인식 알고리즘까지 내려가 진단하는 일은 이 지도의 범위 밖인 별도 기초 분기다.</StopRule>
      </section>

      <section id="assembly-boundary" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">문서 조립이 시작되는 곳</h2>
        <p className="mb-5 max-w-3xl text-sm leading-relaxed text-muted-foreground">페이지별 block을 얻은 뒤에는 어느 관계가 페이지 경계를 넘어 이어지는지 문서 단위로 복구해야 한다. 다음 장면은 page blocks와 assembled document를 전환하며 표 continuation, 제목과 다음 페이지 본문의 scope, figure-caption 연결이 세 개의 document relation으로 함께 복구되는 모습을 보여준다.</p>
        <PageToDocumentAssemblyLab />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Page 47 끝에서 멈춘 표가 page 48 첫 행으로 이어지고, page 90 마지막 제목의 본문이 page 91에서 시작할 수 있다. 이 관계는 어느 한 page만 봐서는 확정할 수 없다. <InternalLink slug="document-structure-assembly">Document Assembly 글</InternalLink>은 문단, 표, 제목 hierarchy, 그림·caption의 네 관계를 evidence score와 명시적 보류 상태로 복원한다.</p>
          <p>MinerU-Popo는 다양한 OCR의 page output을 재사용해 이 네 subtask를 처리하고, overlap synchronization으로 장문 chunk의 판단을 맞춘 뒤 tree-structured document를 만든다. 논문이 보고한 hierarchy TEDS(Tree-Edit-Distance-based Similarity, tree 편집 거리 기반 유사도)와 RAG 개선은 방향을 보여주는 1차 근거지만 제품 release 증거는 아니다.</p>
        </div>
      </section>

      <section id="route" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">이 경로를 읽는 순서</h2>
        <div className="not-prose divide-y divide-border border-y border-border">
          {route.map((item) => (
            <Link key={`${item.number}-${item.slug}`} to={`${articlePath('ai', item.slug)}${item.hash}`} className="group grid gap-3 py-5 md:grid-cols-[3rem_13rem_minmax(0,1fr)_8rem] md:items-center">
              <span className="font-mono text-lg font-black text-muted-foreground">{item.number}</span>
              <span className="text-sm font-black group-hover:underline group-hover:underline-offset-4">{item.title}</span>
              <span className="text-sm leading-relaxed text-muted-foreground">{item.question}</span>
              <span className="w-fit rounded-sm border border-border px-2 py-1 text-xs font-bold text-muted-foreground">{item.note}</span>
            </Link>
          ))}
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>표가 없는 plain text 문서라면 03을 건너뛸 수 있다. 반대로 표가 핵심인 재무 문서는 02에서 cross-page identity를 결정한 뒤 03에서 cell grid를 반드시 검산한다. 금액·날짜가 중요한 재무 문서는 03B에서 합계와 기간 규칙도 통과해야 한다. 수식이 있는 논문은 같은 03B에서 LaTeX parse와 허용 symbol set을 통과해야 한다. 04는 선택 사항이 아니다. RAG에 넣는 순간 page parsing 결과가 사용자 답변의 근거가 되기 때문이다.</p>
        </div>
      </section>

      <section id="release-question" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">릴리스가 답해야 할 질문</h2>
        <p className="mb-5 max-w-3xl text-sm leading-relaxed text-muted-foreground">평균 OCR 점수만으로는 실제 질문에 필요한 숫자·표·citation이 보존됐는지 알 수 없다. 다음 장면은 인식, 구조, 근거, 사용 결과, 운영과 회귀의 여섯 질문을 펼쳐 release review가 빠뜨리면 안 되는 증거 범위를 정리한다.</p>
        <ReleaseQuestionLab />
        <CapabilityCheck items={[
          'Document AI를 page parser 한 번의 호출이 아니라 다섯 단계 evidence pipeline으로 설명할 수 있다.',
          'Page parser, assembler, verifier와 RAG release의 실패 책임을 구분할 수 있다.',
          '모델 이름을 외우지 않고 문서 목표에 맞는 output schema와 provenance를 먼저 정할 수 있다.',
          '표 중심·plain text·법률 문서에 따라 읽을 글과 검증 gate를 선택할 수 있다.',
        ]} />
        <StopRule>업무 질문에서 필요한 output schema를 고정하고, page parser·document assembler·deterministic verifier·release owner를 나눈 뒤 현재 병목 한 갈래를 선택할 수 있으면 이 지도에서 멈춘다. 검증 reward가 필요하지 않으면 olmOCR을, OCR-free 계보가 필요하지 않으면 Donut을 열지 않는다.</StopRule>
        <SourceNotes sources={[
          { label: 'PaddleOCR-VL-1.6 official documentation', href: 'https://www.paddleocr.ai/main/en/version3.x/algorithm/PaddleOCR-VL/PaddleOCR-VL-1.6.html', note: '0.9B architecture, progressive post-training과 공식 document benchmark 주장.' },
          { label: 'MinerU-Popo paper', href: 'https://arxiv.org/abs/2605.24973', note: 'Page-level OCR에서 document-level assembly로 넘어가는 최신 문제 정의와 구현.' },
          { label: 'DoclingDocument', href: 'https://docling-project.github.io/docling/concepts/docling_document/', note: 'Typed document IR, hierarchy, serialization과 chunking 구현 사례.' },
        ]} />
      </section>
    </>
  );
}

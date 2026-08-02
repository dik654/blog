import {
  ArrowDown,
  Braces,
  FileSearch,
  PackageSearch,
  Radar,
} from 'lucide-react';
import {
  CapabilityCheck,
  BeginnerOpening,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
  StopRule,
} from '@/components/learning/ArticleLearning';
import { KnowledgeSystemContractExplorer } from './knowledge-system-core/viz/KnowledgeSystemExplorers';

const route = [
  {
    index: '01', icon: PackageSearch, slug: 'knowledge-compiler', title: '현재 contract',
    question: '지금 깨진 것은 source, structure, meaning, retrieval, maintenance 중 어디일까?',
    outcome: '다섯 계약과 글의 ownership을 구분하고 필요한 단계만 연다.',
  },
  {
    index: '02', icon: FileSearch, slug: 'knowledge-source-ingestion', title: '원문 구조 복원',
    question: 'PDF·영상·code에서 어떤 구조와 주소를 보존해야 다시 검증할 수 있을까?',
    outcome: 'Reading order, table·formula·caption과 source coordinate를 복구한다.',
  },
  {
    index: '03', icon: Braces, slug: 'knowledge-ir-evidence-lineage', title: 'Knowledge IR',
    question: 'Block을 claim·scope·evidence·transformation으로 어떻게 바꿀까?',
    outcome: '수정 가능한 의미 graph와 build-time evidence lineage를 만든다.',
  },
  {
    index: '04', icon: PackageSearch, slug: 'rag-pipeline', title: '검색과 문맥 포장',
    question: '질문을 증명할 근거를 token budget 안에서 어떻게 찾고 조립할까?',
    outcome: 'Dependency-aware routing, hybrid retrieval, packing과 runtime trace로 닫는다.',
  },
  {
    index: '05', icon: Radar, slug: 'knowledge-research-watcher', title: '지속 갱신',
    question: '새 논문·회사 글·release가 올 때 무엇만 교체하고 다시 계산할까?',
    outcome: 'Source promotion, foundation delta와 targeted rebuild queue를 운영한다.',
  },
] as const;

const stories = [
  {
    marker: 'CURRENT · ACL 2026',
    title: 'Lost in Decomposition은 “길면 자른다”는 기본값을 뒤집었다',
    body: 'CoDaR 연구는 RAG나 chunk-wise processing 같은 분해 방식이 모든 long document에 항상 이롭지 않다고 보고했다. 앞 구간의 정의·지시어·논리 전제가 뒤 구간 해석에 자주 필요하면 분해가 dependency structure를 끊을 수 있다.',
    boundary: '한 dataset의 threshold를 그대로 제품에 쓰지 않는다. 문서와 질문 slice에서 full-context, 구조 보존 retrieval, decomposition을 함께 평가한다.',
  },
  {
    marker: 'STRUCTURE · AAAI 2025',
    title: 'Docling은 parser output을 Markdown이 아니라 document object로 남긴다',
    body: 'Text, table, picture, caption, section hierarchy, reading order, bounding box와 provenance를 통합 표현에 남긴다. PDF는 layout·table specialist를 통과하고, HTML·Office처럼 구조가 있는 형식은 native semantics를 먼저 사용한다.',
    boundary: 'Parser가 만든 구조는 의미 claim이 아니다. “42 N·m”가 어떤 조건에서 유효한지는 다음 IR 단계가 소유한다.',
  },
  {
    marker: 'RUNTIME · SOSP 2025',
    title: 'METIS는 top-k와 synthesis가 query마다 달라야 함을 시스템 문제로 다뤘다',
    body: '한 사실을 묻는 질문과 여러 분기의 값을 합치는 질문은 필요한 chunk 수와 synthesis 방식이 다르다. 더 많은 context는 입력 token을 처음 계산하는 prefill, 생성 중 attention 중간값을 담는 KV cache, scheduler에서 차례를 기다리는 queue delay를 함께 키우므로 configuration과 scheduling을 같이 본다.',
    boundary: '낮은 latency와 높은 task score는 source truth나 claim grounding을 보장하지 않는다. 근거 gate는 별도로 둔다.',
  },
] as const;

export default function KnowledgeCompilerArticle() {
  return (
    <>
      <section id="why-contracts" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">원문을 읽는 것과 다시 확인할 수 있는 지식으로 만드는 것은 다르다</h2>
        <BeginnerOpening
          title="Knowledge Compiler는 자료를 답으로 바꾸는 반복 가능한 제작 과정이다"
          description={<>논문, 영상, 블로그와 코드를 읽어 설명 글을 만들 때 원문 위치와 변환 과정을 함께 남기는 시스템을 이 글에서는 <strong>Knowledge Compiler</strong>라고 부른다. 프로그래밍 언어 컴파일러와 같은 제품 이름이 아니라, 서로 다른 자료를 검증 가능한 지식으로 바꾸는 설계 개념이다.</>}
          familiarScene={<>여러 사람이 회의록, 표와 녹화 영상을 보고 보고서를 쓴다고 하자. 완성된 문장만 남기면 숫자가 틀렸을 때 어디서 가져왔는지 찾기 어렵다. 원본 파일, 페이지·시간 위치, 해석과 수정 기록을 함께 남겨야 다음 사람이 검증하고 갱신할 수 있다.</>}
          steps={[
            { label: '원본과 주소를 보존한다', detail: '파일 버전, 페이지, 표 셀과 영상 시간을 다시 찾을 수 있게 남긴다.' },
            { label: '구조와 주장을 분리한다', detail: '제목·문단·표 구조와 그 안에서 말하는 주장·조건·근거를 구분한다.' },
            { label: '검색과 갱신 기록을 남긴다', detail: '어떤 근거로 답했는지, 새 원문이 오면 무엇을 다시 만들지 추적한다.' },
          ]}
        />
        <QuestionLead
          question="최신 언어 모델이 PDF와 영상을 읽을 수 있다면 원문 전체를 넣고 리뷰 하나를 만들면 충분하지 않을까?"
          answer="일회성 독해에는 충분할 수 있다. 그러나 같은 원문을 다시 검증하고, 수정된 부분만 재처리하고, 한국어 글·검색 index·구현 가이드를 함께 만들려면 source version, 구조, claim-evidence 관계와 query-time trace를 명시적으로 저장해야 한다."
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            이때 중요한 것은 거대한 JSON 하나가 아니다. <strong>원본을 잃지 않는 수집, 문서 구조 복원, 의미 IR,
            검색 가능한 context package, 지속 갱신</strong>이 서로 다른 실패와 검증을 가진다는 사실이다.
            한 글에 모두 압축하면 OCR 오류를 embedding으로 고치거나, 오래된 source를 prompt로 가리는 식의 잘못된 처방이 나온다.
          </p>
          <p>
            아래 영문 계약 이름과의 대응도 여기서 고정한다. <strong>source</strong>는 원본을 잃지 않는 수집,
            <strong> structure</strong>는 문서 구조 복원, <strong>meaning</strong>은 claim·scope·evidence를 만드는 의미 IR,
            <strong> retrieval</strong>은 검색 가능한 context package, <strong>maintenance</strong>는 지속 갱신이다.
            예를 들어 claim과 evidence의 연결이 틀렸다면 PDF 배치 문제가 아니라 meaning 계약의 실패다.
          </p>
          <p>
            그래서 기존 종합 글을 route hub로 바꾸고 세부 계산은 독립 글로 옮겼다. 새 도구나 모델은 다섯 계약 중 실제로 바뀐 층에만 추가한다.
          </p>
        </div>
        <Misconception>
          Knowledge IR은 LLM 내부의 latent meaning을 JSON으로 그대로 꺼낸 것이 아니다. 제품이 source address, claim, scope,
          evidence와 transformation을 다시 검증하기 위해 설계한 명시적 data model이다.
        </Misconception>
      </section>

      <section id="current-boundary" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">현재 연구는 더 큰 context보다 분해할 조건을 묻는다</h2>
        <p className="mb-5 max-w-3xl text-sm leading-relaxed text-muted-foreground">긴 입력을 한 번에 넣을 수 있다는 사실과 신뢰할 수 있는 지식으로 재구성할 수 있다는 사실은 다르다. 다음 장면은 source·structure·meaning·retrieval·maintenance 단계를 바꿔 가며 각 단계의 입력, 출력, 대표 실패와 다음 handoff를 먼저 고정한다.</p>
        <KnowledgeSystemContractExplorer />
        <div className="not-prose my-8 divide-y divide-border border-y border-border">
          {stories.map((story) => (
            <article key={story.title} className="grid gap-3 py-6 sm:grid-cols-[9rem_minmax(0,1fr)]">
              <p className="font-mono text-xs font-black text-muted-foreground">{story.marker}</p>
              <div className="min-w-0">
                <h3 className="text-base font-bold leading-snug">{story.title}</h3>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{story.body}</p>
                <p className="mt-4 border-l-2 border-border pl-3 text-xs font-semibold leading-relaxed">{story.boundary}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="route" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">한 source의 복원에서 지속 갱신까지 다섯 단계</h2>
        <div className="not-prose my-8 border-y border-border" aria-label="Knowledge System 읽는 순서">
          {route.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={item.slug} className="relative grid min-w-0 gap-3 border-b border-border py-5 last:border-b-0 sm:grid-cols-[3rem_2.5rem_minmax(0,12rem)_minmax(0,1fr)] sm:items-start">
                <span className="font-mono text-xs font-black text-muted-foreground">{item.index}</span>
                <span className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-muted/20"><Icon className="h-4 w-4" /></span>
                <div className="min-w-0">
                  {item.slug === 'knowledge-compiler' ? <strong className="text-sm">{item.title}</strong> : <InternalLink slug={item.slug}>{item.title}</InternalLink>}
                  <p className="mt-1 text-xs font-semibold leading-relaxed text-muted-foreground">{item.question}</p>
                </div>
                <p className="min-w-0 text-xs leading-relaxed text-muted-foreground">{item.outcome}</p>
                {index < route.length - 1 && <ArrowDown className="absolute -bottom-2.5 left-[3.35rem] z-10 h-5 w-5 rounded-full border border-border bg-background p-1 text-muted-foreground sm:left-[4.25rem]" />}
              </div>
            );
          })}
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            <strong>학습 순서와 실행 순서는 다르다.</strong> 운영에서는 Watcher, 즉 feed·sitemap·release event를 주기적으로 감시하는 수집기가
            새 source version을 먼저 발견해 ingestion queue에 넣는다.
            그러나 처음 배우는 사람은 source 하나의 구조와 evidence lineage를 먼저 완성해야 자동 promotion이 무엇을 망가뜨릴 수 있는지 이해한다.
          </p>
        </div>
      </section>

      <section id="finish-line" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">어디에서 멈추고 무엇을 증명할까?</h2>
        <StopRule title="필수 논문은 RAG 2020에서 멈춘다">
          현재 상단은 CoDaR 2026으로 시작하지만, 역사 하향은 retrieval과 generation을 분리한 RAG 2020에서 끊는다.
          BM25의 전체 역사, 모든 embedding·vector DB와 document model 논문은 실제 구현 선택을 바꿀 때만 연다.
        </StopRule>
        <CapabilityCheck items={[
          '답 오류를 source, structure, meaning, retrieval, maintenance 중 한 층에 먼저 배정한다.',
          'Full-context와 decomposition 중 하나를 문서 길이만 보고 고르지 않는다.',
          'Build-time evidence lineage와 query-time runtime trace를 구분한다.',
          '학습 route와 실제 discovery-to-publish runtime order가 다른 이유를 설명한다.',
          'RAG 2020 아래로 무한히 내려가지 않고 현재 실패에 필요한 기반에서 멈춘다.',
        ]} />
        <SourceNotes sources={[
          { label: 'Guo et al. · Lost in Decomposition, ACL 2026', href: 'https://aclanthology.org/2026.findings-acl.2097/', note: 'Context dependency가 강한 문서에서 decomposition이 실패할 수 있고 adaptive routing이 필요하다는 현재 상단 근거.' },
          { label: 'IBM Research · Docling, AAAI 2025', href: 'https://research.ibm.com/publications/docling-an-efficient-open-source-toolkit-for-ai-driven-document-conversion', note: '다형식 parser, 전문 모델과 unified document representation의 구현 경계.' },
          { label: 'Ray et al. · METIS, SOSP 2025', href: 'https://www.microsoft.com/en-us/research/publication/metis-fast-quality-aware-rag-systems-with-configuration-adaptation/', note: 'Query별 context 수와 synthesis·scheduling의 quality-delay trade-off.' },
          { label: 'Lewis et al. · Retrieval-Augmented Generation, 2020', href: 'https://arxiv.org/abs/2005.11401', note: 'Parametric memory와 retrieved non-parametric memory를 결합하는 최소 canonical cutoff.' },
        ]} />
      </section>
    </>
  );
}

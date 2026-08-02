import { CapabilityCheck, ComparisonTable, Misconception, QuestionLead, SourceNotes } from '@/components/learning/ArticleLearning';
import EvalViz from './viz/EvalViz';

export default function Eval() {
  return (
    <section id="evaluation" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">RAG 평가는 어디가 틀렸는지 말해야 한다</h2>

      <QuestionLead
        question="최종 답이 틀렸을 때 검색, context 구성, 생성 중 무엇을 고쳐야 할까?"
        answer="한 개의 종합 점수로는 알 수 없다. 같은 질문에 대해 후보 문서를 찾았는지, 올바르게 순위를 매겼는지, 답의 각 claim이 context에 지지되는지, 답변이 질문에 직접 응답하는지를 단계별로 측정해야 한다."
      />

      <EvalViz />

      <ComparisonTable
        headers={['층', '핵심 질문', '대표 지표', '실패하면 먼저 바꿀 것']}
        rows={[
          ['검색 후보', '정답 근거가 Top K 안에 들어왔는가?', 'Recall@K', 'chunk, query rewrite, dense·sparse index'],
          ['검색 순위', '좋은 근거가 앞에 배치됐는가?', 'MRR · nDCG@K', 'reranker, score fusion, metadata filter'],
          ['답변', '질문에 직접 답하고 요구 형식을 지켰는가?', 'Answer relevance · task score', 'prompt, model, structured output'],
          ['근거', '각 claim이 실제 source span에 지지되는가?', 'Claim support · citation precision/recall', 'context selection, abstention, verifier'],
          ['운영', '품질을 만족하며 지속적으로 서비스 가능한가?', 'p95 latency · token · freshness · cost', 'cache, index update, model routing'],
        ]}
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Golden set은 질문과 정답 두 칸으로 끝나지 않는다</h3>
        <p>
          각 질문에는 정답 문장만 아니라 관련 source span, 허용 가능한 claim, 반드시 거부해야 할 claim, 적용 시점과 문서 버전을 함께 둔다.
          그래야 검색 모델을 바꿨을 때는 Recall@K를 다시 계산하고, 생성 모델만 바꿨을 때는 같은 context snapshot으로 claim 지지를 비교할 수 있다.
        </p>
        <p>
          RAGAS처럼 reference 없이 빠르게 반복하는 자동 평가도 유용하다. 다만 LLM judge 역시 확률적 모델이다.
          배포 차단 기준은 사람이 검토한 작은 고정 세트와 실행 가능한 규칙 검사에 묶고, judge 점수는 넓은 회귀 탐색과 review 우선순위에 쓴다.
        </p>
      </div>

      <Misconception>
        Faithfulness가 높다고 답이 맞는 것은 아니다. 검색된 문서 자체가 오래됐거나 잘못됐어도 모델은 그 문서에 매우 충실하게 답할 수 있다.
        그래서 source 품질·버전·freshness와 claim grounding을 별도 축으로 관리해야 한다.
      </Misconception>

      <div className="not-prose my-8 border-y border-border py-5">
        <p className="text-sm font-semibold">최소 회귀 루프</p>
        <ol className="mt-4 grid gap-3 text-sm leading-relaxed text-muted-foreground sm:grid-cols-2">
          <li><strong className="text-foreground">01.</strong> 실패 질문을 retrieval miss, ranking miss, unsupported generation, stale source로 분류한다.</li>
          <li><strong className="text-foreground">02.</strong> 한 층만 바꾸고 동일 query·corpus·model version으로 다시 실행한다.</li>
          <li><strong className="text-foreground">03.</strong> 품질 지표와 p95 latency·token cost를 함께 비교한다.</li>
          <li><strong className="text-foreground">04.</strong> 좋아진 실패 유형과 새로 생긴 regression을 fixture로 고정한다.</li>
        </ol>
      </div>

      <CapabilityCheck
        items={[
          'Recall@K와 answer relevance가 서로 다른 실패를 측정함을 설명한다.',
          'Claim support와 citation precision·recall을 분리한다.',
          '동일 context snapshot으로 generation 변경만 비교한다.',
          '품질 회귀와 latency·cost 회귀를 함께 차단한다.',
        ]}
      />

      <SourceNotes
        sources={[
          { label: 'Es et al. · RAGAS', href: 'https://arxiv.org/abs/2309.15217', note: 'retrieval context와 생성 답변의 여러 품질 축을 reference-free하게 평가하는 framework.' },
          { label: 'Yan et al. · Corrective RAG', href: 'https://arxiv.org/abs/2401.15884', note: '검색 품질을 평가해 정답·오답·모호 상태별로 다른 retrieval action을 선택한다.' },
          { label: 'Microsoft Research · BenchmarkQED', href: 'https://www.microsoft.com/en-us/research/project/graphrag/', note: 'GraphRAG 프로젝트의 현재 RAG benchmark와 평가 연구 연결점.' },
        ]}
      />
    </section>
  );
}

import FormulaNote from '@/components/ui/formula-note';
import Math from '@/components/ui/math';
import {
  CapabilityCheck,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
  SpecialistEntry,
  StopRule,
} from '@/components/learning/ArticleLearning';
import { ContextDependencyRoutingLab } from './knowledge-system-core/viz/KnowledgeSystemExplorers';

function Formula({ latex, meaning, symbols }: { latex: string; meaning: string; symbols: [string, string][] }) {
  return (
    <div data-formula-pair className="not-prose my-7 min-w-0">
      <div className="min-w-0 overflow-hidden rounded-md border border-border px-2 py-4 sm:px-4">
        <Math display className="my-0 text-[13px] sm:text-base">{latex}</Math>
      </div>
      <FormulaNote meaning={meaning} symbols={symbols} />
    </div>
  );
}

const resultReceipts = [
  {
    scope: '같은 RAG · 다른 dataset',
    values: 'NarrativeQA −11.72% · 2WikiMQA +10.98%',
    claim: '분해형 방법의 효과는 dataset을 건너 자동으로 일반화되지 않았다.',
  },
  {
    scope: '같은 CoA · 다른 dataset',
    values: 'NarrativeQA −22.06% · MuSiQue +27.51%',
    claim: '더 복잡한 multi-agent workflow도 문서 구조와 맞지 않으면 Full-Context보다 나빠졌다.',
  },
  {
    scope: 'CoDaR · NarrativeQA',
    values: 'Vanilla 대비 RAG +11.34% · CoA +22.05%',
    claim: '강한 dependency 문서를 Full-Context로 돌리는 route가 큰 하락을 완화했다.',
  },
] as const;

export default function ResearchCodar2026Article() {
  return (
    <>
      <SpecialistEntry
        eyebrow="현재 연구 읽기"
        title="CoDaR의 문서 의존성과 routing 실험을 검산하는 글"
        description="긴 문서를 무조건 쪼개거나 무조건 한 번에 읽는 대신, 문서 구간 사이의 의존성을 측정해 처리 경로를 고르는 연구를 다룬다. RAG와 문서 provenance의 기본 계약은 먼저 안다고 가정한다."
        prerequisites={[
          'RAG가 긴 문서에서 관련 passage를 검색해 context를 줄이는 이유를 안다.',
          '앞 절의 정의나 지시어가 뒤 절의 뜻을 바꿀 수 있음을 안다.',
          '검색·요약 뒤에도 원문 위치와 변환 기록을 남겨야 함을 안다.',
        ]}
        links={[
          { slug: 'rag-pipeline', title: 'RAG pipeline', reason: 'Full-context와 decomposition을 선택하는 기본 문제부터 배운다.' },
          { slug: 'knowledge-ir-evidence-lineage', title: 'Knowledge IR · evidence lineage', reason: '분해·요약한 뒤에도 출처와 문서 구조를 보존하는 법을 잡는다.' },
        ]}
      />
      <section id="failure-question" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">긴 문서를 나누면 왜 어떤 문서에서는 더 나빠질까?</h2>
        <QuestionLead
          question="긴 context가 어렵다면 RAG, memory, compression 또는 여러 agent로 나누는 것이 항상 Full-Context보다 안전할까?"
          answer="CoDaR 논문의 답은 아니다. 검색·요약·agent 분담은 attention 부담을 줄이지만, 서로 의존하는 chunk를 갈라 놓기도 한다. 독립 passage가 모인 문서는 필요한 조각만 고르는 편이 좋을 수 있지만, 앞의 정의·대명사·논증을 이어 읽어야 하는 서사는 전체 구조를 보존해야 한다."
        />
        <ConceptPrimer items={[
          { term: 'Full-Context', meaning: '문서 전체와 질문을 한 번에 long-context model에 넣는 기준선이다.', why: '비용은 크지만 문서의 원래 순서와 dependency를 보존한다.' },
          { term: 'Decomposition', meaning: '검색, chunk 반복, agent 분담, memory 또는 compression으로 문서를 여러 처리 단위로 나눈다.', why: '길이를 줄이는 동시에 관계를 끊을 수 있는 공통 개입이다.' },
          { term: 'Context dependency', meaning: '현재 chunk를 이해하려면 앞 chunk의 정보·지시 대상·논리 전제가 필요한 정도다.', why: '질문 유형보다 문서 구조가 분해 위험을 직접 설명한다.' },
          { term: 'Adaptive routing', meaning: '모든 문서에 같은 workflow를 강제하지 않고 문서 특성에 따라 실행 경로를 고른다.', why: '잘 맞는 문서의 이득을 유지하면서 잘못된 분해의 손실을 줄인다.' },
        ]} />
        <ContextDependencyRoutingLab />
        <Misconception>DCDS가 높다는 말은 문서가 더 어렵거나 답이 틀릴 확률이 높다는 뜻이 아니다. 이 점수는 앞 chunk와의 관계가 얼마나 조밀한지 측정해 분해가 구조를 잃을 위험을 나타내는 routing signal이다.</Misconception>
      </section>

      <section id="dcds" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">추상적인 “연결이 강하다”를 chunk pair 판단으로 계산한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>논문은 문서를 순서가 있는 chunk <strong>c₁ … cₙ</strong>으로 나눈다. 현재 chunk가 앞 chunk를 필요로 하는지를 정보 의존, 지시어 의존, 논리 의존의 세 질문으로 판정한다. 하나라도 있으면 evaluator <strong>E</strong>가 1, 없으면 0을 낸다.</p>
          <p>Chunk score는 현재 chunk와 바로 앞 <strong>k</strong>개 chunk 사이의 dependency 평균이다. Document score는 처음 k개를 제외한 모든 chunk score의 평균이다. 원문 설정은 512 words per chunk, k=3, GPT-4o-mini evaluator다.</p>
        </div>
        <Formula
          latex={String.raw`\underbrace{S(c_i)}_{\text{현재 chunk의 의존도}}=\frac{1}{k}\sum_{j=1}^{k}\underbrace{E(c_i,c_{i-j})}_{\text{앞 chunk가 필요한가: 0 또는 1}}`}
          meaning="현재 chunk ci를 이해할 때 앞의 k개 chunk를 하나씩 검사한다. 필요한 관계의 개수를 k로 나누므로 score는 0과 1 사이가 된다. 세 dependency 유형 중 하나라도 성립하면 해당 pair를 1로 세지만, 관계의 강도나 정답 중요도를 직접 측정하지는 않는다."
          symbols={[
            [String.raw`c_i`, '현재 평가하는 i번째 chunk'],
            [String.raw`c_{i-j}`, '현재 chunk보다 j칸 앞의 chunk'],
            [String.raw`k`, '앞으로 돌아보는 chunk window 크기, 원문은 3'],
            [String.raw`E`, '정보·지시어·논리 dependency 중 하나가 있으면 1인 evaluator'],
            ['평균', '문서 길이나 window 안 pair 수가 달라도 같은 0~1 scale에서 비교하기 위해 사용'],
          ]}
        />
        <Formula
          latex={String.raw`\underbrace{\operatorname{DCDS}(D)}_{\text{문서 전체 의존도}}=\frac{1}{N-k}\sum_{i=k+1}^{N}\underbrace{S(c_i)}_{\text{chunk별 앞 문맥 의존도}}`}
          meaning="앞 chunk가 k개 모두 존재하는 위치만 모아 평균한다. 높은 값은 많은 chunk가 앞 문맥 없이는 독립적으로 해석되기 어렵다는 뜻이다. Chunk 크기, k, evaluator prompt가 바뀌면 같은 문서의 값도 달라질 수 있으므로 이 설정도 metric version에 포함해야 한다."
          symbols={[
            [String.raw`D`, '순서가 보존된 전체 문서'],
            [String.raw`N`, '문서를 나눈 전체 chunk 수'],
            [String.raw`N-k`, '앞의 k개를 모두 비교할 수 있는 평가 chunk 수'],
            [String.raw`S(c_i)`, '앞 식에서 계산한 각 chunk의 dependency 평균'],
            ['설정 version', 'Chunker·window·evaluator·prompt를 고정해야 score를 재현할 수 있음'],
          ]}
        />
      </section>

      <section id="routing" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">CoDaR는 새 모델이 아니라 실행 경로를 고르는 router다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>CoDaR는 model weight를 학습하지 않는다. 작은 validation set에서 threshold <strong>τ</strong>를 고르고, 새 문서의 DCDS가 그보다 낮을 때만 RAG·CoA·MemoryBank·ReadAgent 같은 long-context method를 실행한다. 강한 dependency 문서는 Full-Context로 보낸다.</p>
          <p>원문은 dataset마다 무작위 20개 sample로 threshold를 정하고 나머지를 test했다. 따라서 τ는 보편 상수가 아니다. Corpus, chunker, evaluator, base model과 목표 metric이 바뀌면 다시 calibration해야 한다.</p>
        </div>
        <Formula
          latex={String.raw`\begin{aligned}
\underbrace{d(D)}_{\text{문서 의존도 점수}}&=\operatorname{DCDS}(D)\\
\operatorname{route}(D)
&=\begin{cases}
\text{decompose / retrieve},&d(D)<\tau\\
\text{Full-Context},&d(D)\ge\tau
\end{cases}
\end{aligned}`}
          meaning="Dependency가 threshold보다 약하면 분해 이득을 기대하고 workflow형 방법을 사용한다. 강하면 원래 순서와 관계를 보존하는 Full-Context로 되돌린다. 이 규칙은 어느 답이 맞는지 고르는 reflection이 아니라 답을 만들기 전에 document structure로 실행 경로를 정한다."
          symbols={[
            [String.raw`\tau`, '작은 validation set에서 고르는 routing threshold'],
            [String.raw`\operatorname{DCDS}(D)<\tau`, '문서 chunk가 비교적 독립적이라 분해 손실이 낮다고 보는 조건'],
            [String.raw`\operatorname{DCDS}(D)\ge\tau`, '앞 문맥 관계가 강해 구조 보존이 필요하다고 보는 조건'],
            ['training-free', 'Router를 위해 model parameter를 update하지 않지만 evaluator 호출과 threshold calibration은 필요'],
          ]}
        />
      </section>

      <section id="evidence" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">상대 성능의 부호가 문서 종류에 따라 뒤집혔다는 것이 핵심 증거다</h2>
        <Formula
          latex={String.raw`\underbrace{\Delta_M}_{\text{Full 대비 상대 변화}}=\frac{\underbrace{\operatorname{Score}_M}_{\text{분해형 방법}}-\underbrace{\operatorname{Score}_{\mathrm{full}}}_{\text{전체 문맥 기준}}}{\operatorname{Score}_{\mathrm{full}}}\times100\%`}
          meaning="같은 dataset에서 workflow형 long-context method가 Full-Context보다 얼마나 좋아지거나 나빠졌는지 비율로 본다. 양수면 그 method가 이득, 음수면 분해 때문에 손해일 수 있다. Dataset 간 절대 F1 차이를 없애는 완전한 정규화는 아니므로 절대 점수와 함께 읽어야 한다."
          symbols={[
            [String.raw`\operatorname{Score}_M`, 'RAG·CoA·MemoryBank·ReadAgent 중 한 method의 F1 또는 ROUGE-L'],
            [String.raw`\operatorname{Score}_{\mathrm{full}}`, '같은 base model이 문서 전체를 직접 읽은 기준 점수'],
            [String.raw`\Delta_M>0`, '해당 dataset과 설정에서 분해형 method가 기준보다 높음'],
            [String.raw`\Delta_M<0`, '해당 dataset과 설정에서 기준보다 낮아 routing 없이 강제 적용할 위험이 있음'],
          ]}
        />
        <div className="not-prose divide-y divide-border border-y border-border">
          {resultReceipts.map((receipt) => (
            <article key={receipt.scope} className="grid gap-3 py-5 sm:grid-cols-[12rem_15rem_minmax(0,1fr)] sm:gap-6">
              <p className="text-sm font-bold">{receipt.scope}</p>
              <p className="font-mono text-sm font-black leading-relaxed">{receipt.values}</p>
              <p className="text-sm leading-relaxed text-muted-foreground">{receipt.claim}</p>
            </article>
          ))}
        </div>
        <div className="prose prose-neutral mt-7 max-w-none dark:prose-invert">
          <p>논문은 NarrativeQA chunk를 50% 또는 100% shuffle하는 controlled experiment도 수행했다. 원래 dependency 구조가 깨질수록 Full-Context의 상대적 이점이 줄고 분해형 방법의 상대 성능이 올라갔다. 저자들은 이를 분해형 방법이 원래의 dependency 구조를 충분히 활용하지 못한다는 증거로 읽는다.</p>
          <p>이 글이 원문 표에서 읽어 낸 증거 범위는 영어 LongBench 계열 dataset과 실험에 사용한 base model까지다. 별도로 저자들이 Limitations에 명시한 항목은 attention mechanism 관점의 세부 원인 분석이 없다는 점과 다른 언어의 discourse 구조로 일반화되는지 검증하지 않았다는 점이다. 따라서 한국어 기술 문서에 원문의 threshold를 그대로 복사하면 안 된다.</p>
        </div>
      </section>

      <section id="production-transfer" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">문서 평균이 낮아도 단 하나의 중요한 관계는 지켜야 한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>여기서부터는 <strong>CoDaR 원문의 주장</strong>과 <strong>이 글의 제품 전이</strong>를 구분해야 한다. 원문 DCDS는 문서 전반의 dependency 빈도를 평균낸다. 따라서 100개의 독립 chunk 사이에 안전 수식의 적용 조건 하나만 멀리 떨어져 있다면 평균은 낮을 수 있다. 하지만 그 한 관계를 끊으면 “42 N·m”만 남고 “80°C 이하”라는 scope가 사라진다.</p>
          <p>Pair evaluator도 truth oracle이 아니다. 저자들은 600개 pair의 사람 annotation과 비교해 정확도 84.6%, Cohen&apos;s κ 0.64를 보고했다. 연구용 대규모 경향 측정에는 쓸 수 있어도, 단 한 번의 오판이 위험한 수식·표·규정 문서를 자동 release하는 근거로는 부족하다.</p>
          <p>그래서 제품 route는 문서 평균에 <strong>critical relation guard</strong>와 <strong>실제 context 적재 가능성</strong>을 더한다. 다음 식은 원문 CoDaR 식이 아니라, 이 글이 Knowledge System에 옮겨 쓸 때 제안하는 보수적 실행 계약이다.</p>
        </div>
        <Formula
          latex={String.raw`\begin{aligned}
\underbrace{d_{\mathrm{high}}(D)}_{\text{평균 의존도 gate}}
&=\mathbb 1[\operatorname{DCDS}(D)\ge\tau]\\
\underbrace{c_{\mathrm{critical}}(D)}_{\text{중요 관계 gate}}
&=\mathbb 1[C_{\mathrm{crit}}(D)=1]\\
\underbrace{G_{\mathrm{break}}(D)}_{\text{관계 보존 필요}}
&=d_{\mathrm{high}}(D)\lor c_{\mathrm{critical}}(D)
\end{aligned}`}
          meaning="평균 dependency가 높거나 중요한 관계가 하나라도 있으면 1을 낸다. 이 guard는 DCDS 평균에 묻힐 수 있는 안전 조건·수식 qualifier·cross-page table을 별도 신호로 살리기 위한 제품 전이다."
          symbols={[
            [String.raw`G_{\mathrm{break}}`, '분해가 의미 관계를 끊을 위험이 있어 보존 경로가 필요한지 나타내는 제품 guard'],
            [String.raw`C_{\mathrm{crit}}`, '안전 조건·수식 qualifier·cross-page table처럼 하나만 끊겨도 답이 달라지는 관계의 존재 여부'],
            [String.raw`\mathbb{1}[\cdot]`, '괄호 안 조건이 참이면 1, 아니면 0을 내는 indicator'],
            [String.raw`\lor`, '평균 위험과 단일 중요 관계 중 하나라도 있으면 보존 경로를 열기 위한 OR'],
          ]}
        />
        <Formula
          latex={String.raw`\begin{aligned}
G=1,\ N\le L&\Rightarrow\underbrace{r=A_{\mathrm{full}}}_{\text{전체 적재}}\\
G=1,\ N>L&\Rightarrow\underbrace{r=A_{\mathrm{struct}}}_{\text{구조 보존}}\\
G=0&\Rightarrow\underbrace{r=A_{\mathrm{split}}}_{\text{분해 후보}}
\end{aligned}`}
          meaning="G, N, L을 짧은 별칭으로 써 세 갈래 조건과 결과가 모바일에서도 한눈에 보이게 했다. 관계를 보존해야 하고 전체 문서가 context limit 안에 들어가면 Full-Context를 쓴다. 한도를 넘으면 무작정 자르지 않고 section hierarchy, 인접 evidence, table·formula scope를 함께 보존하는 fallback로 보낸다. 관계 보존 guard가 꺼져야 decomposition을 후보로 열며, 아직 release가 확정된 것은 아니다."
          symbols={[
            [String.raw`G`, '바로 위에서 정의한 관계 보존 guard Gbreak의 짧은 표기'],
            [String.raw`N`, '질문, 전체 문서, system overhead와 출력 예약을 합친 실제 token 수 Ntotal'],
            [String.raw`L`, '선택한 model과 runtime이 허용하는 context 한도 Nlimit'],
            [String.raw`r`, '문서 D에 적용할 제품 실행 경로 rprod(D)'],
            [String.raw`A_{\mathrm{full}}`, '질문과 전체 문서를 한 context에 적재하는 Full-Context 실행'],
            [String.raw`A_{\mathrm{struct}}`, '전체 적재는 불가능하지만 hierarchy와 관계를 보존하는 retrieval·grouping fallback'],
            [String.raw`A_{\mathrm{split}}`, '일반 decomposition·retrieval을 다음 평가 대상으로 허용하는 후보 경로'],
            [String.raw`\le,\ >`, '전체 적재 가능 여부에 따라 Full-Context와 구조 보존 fallback을 가르는 비교'],
          ]}
        />
        <div className="not-prose mt-7 divide-y divide-border border-y border-border" data-knowledge-owner-handoff>
          {[
            {
              symptom: '문장 사이 정보·지시어·논리 관계가 끊길 위험',
              owner: 'CoDaR → RAG route',
              action: 'DCDS와 critical relation을 보고 Full-Context·구조 보존·분해 후보를 고른다.',
              slug: 'rag-pipeline',
              label: 'RAG Pipeline',
            },
            {
              symptom: '41–42쪽 표가 갈라지고 수식과 caption 주소가 사라짐',
              owner: 'Source Ingestion',
              action: '검색 전에 reading order, cross-page grid와 source locator를 복구한다.',
              slug: 'knowledge-source-ingestion',
              label: 'Source Ingestion',
            },
            {
              symptom: '42 N·m는 남았지만 80°C 이하라는 적용 범위가 분리됨',
              owner: 'Knowledge IR',
              action: 'Claim과 Scope를 typed relation으로 묶고 어느 span이 지지하는지 저장한다.',
              slug: 'knowledge-ir-evidence-lineage',
              label: 'Knowledge IR',
            },
            {
              symptom: 'Manual 1.3이 수치를 고쳤는데 이전 답이 계속 노출됨',
              owner: 'Research Watcher + IR',
              action: '새 version을 발견하고 changed span에서 도달 가능한 claim만 무효화한다.',
              slug: 'knowledge-research-watcher',
              label: 'Research Watcher',
            },
          ].map((item) => (
            <article key={item.owner} className="grid min-w-0 gap-2 py-5 sm:grid-cols-[minmax(0,1.1fr)_10rem_minmax(0,1.3fr)] sm:gap-5">
              <p className="text-sm font-bold leading-relaxed">{item.symptom}</p>
              <p className="text-xs font-black uppercase leading-relaxed text-muted-foreground">{item.owner}</p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {item.action}{' '}
                <InternalLink slug={item.slug}>{item.label}</InternalLink>
              </p>
            </article>
          ))}
        </div>
        <Misconception>CoDaR route가 맞으면 Knowledge System 전체가 맞는 것이 아니다. CoDaR는 “분해가 관계를 끊을까?”를 판단하는 한 owner다. 원문 구조, claim scope, 최신 version과 최종 답의 evidence coverage는 각각 다른 단계가 닫아야 한다.</Misconception>
      </section>

      <section id="implementation-boundary" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">제품에서는 DCDS 하나가 아니라 routing trace를 남긴다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>최소 구현은 document version을 고정하고, chunk boundary와 evaluator의 pair 판단을 저장하며, DCDS와 threshold, 선택된 route를 한 trace로 묶는다. 같은 질문을 Full-Context와 retrieval route 양쪽에 보내 golden answer, evidence coverage, latency와 cost를 비교해야 한다.</p>
          <p>Dependency가 강해 Full-Context를 골라도 context window를 넘으면 그대로 실행할 수 없다. 그때는 hierarchy를 보존한 section grouping, relation-aware retrieval, overlapping context 또는 abstention 같은 별도 fallback가 필요하다. CoDaR는 이 문제를 자동으로 해결하는 compressor가 아니다.</p>
        </div>
        <StopRule>DCDS 두 식, threshold route, dataset별 부호 반전과 controlled shuffle의 증거 경계를 설명하고, 낮은 평균이 critical relation의 안전을 보장하지 않는 이유까지 말할 수 있으면 현재 원문 단계는 끝이다. 실제 chunk schema, hybrid retrieval와 context packing은 <InternalLink slug="rag-pipeline">RAG Pipeline</InternalLink>, source relation 보존은 <InternalLink slug="knowledge-ir-evidence-lineage">Knowledge IR</InternalLink>에서 구현한다.</StopRule>
        <CapabilityCheck items={[
          'RAG가 항상 Full-Context보다 낫다는 주장을 반례 수치로 반박한다.',
          '정보·지시어·논리 dependency를 pair evaluator 입력으로 구분한다.',
          'Chunk score와 document score를 작은 0/1 예제로 계산한다.',
          'DCDS가 truth score가 아니라 routing signal인 이유를 설명한다.',
          'Threshold와 evaluator 설정을 corpus가 바뀔 때 다시 검증해야 하는 이유를 말한다.',
          '문서 평균 DCDS가 낮아도 formula qualifier 하나 때문에 구조 보존 경로가 필요한 반례를 만든다.',
          'CoDaR가 맡는 routing과 Ingestion·IR·Watcher가 맡는 책임을 구분한다.',
          'Full-Context가 불가능한 길이에서 별도 fallback가 필요하다는 경계를 적는다.',
        ]} />
        <SourceNotes sources={[
          { label: 'CoDaR · ACL Anthology', href: 'https://aclanthology.org/2026.findings-acl.2097/', note: '정식 metadata, abstract, PDF와 citation의 1차 근거.' },
          { label: 'CoDaR · official PDF', href: 'https://aclanthology.org/2026.findings-acl.2097.pdf', note: 'DCDS 정의, controlled shuffle, routing 실험과 limitations를 검산한다.' },
          { label: 'LongBench', href: 'https://arxiv.org/abs/2308.14508', note: 'NarrativeQA·Qasper·MultiFieldQA·MuSiQue·2WikiMQA를 가져온 장문 평가 기반.' },
          { label: 'Lost in the Middle', href: 'https://arxiv.org/abs/2307.03172', note: 'Long-context model이 위치에 따라 정보를 다르게 활용하는 출발 문제.' },
        ]} />
      </section>
    </>
  );
}

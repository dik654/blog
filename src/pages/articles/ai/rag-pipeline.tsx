import M from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import {
  BeginnerBridge,
  CapabilityCheck,
  ConceptPrimer,
  InternalLink,
  LearningHandoff,
  Misconception,
  QuestionLead,
  SourceNotes,
} from '@/components/learning/ArticleLearning';
import {
  ContextPackingExplorer,
  RagReleaseGate,
  RetrievalStrategyExplorer,
} from './knowledge-system-core/viz/KnowledgeSystemExplorers';

export default function RagPipelineArticle() {
  return (
    <>
      <section id="dependency-routing" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">첫 결정은 chunk 크기가 아니라 문서를 분해해도 되는가다</h2>
        <BeginnerBridge title="도서관에서 질문 하나에 모든 책을 책상 위로 옮기지는 않는다">
          필요한 책과 쪽을 먼저 찾되, 앞 문장의 정의나 표의 머리글이 없으면 뜻이 끊기는 자료는 함께 펼쳐야 한다. RAG는 단순히 문장을 잘라 검색하는 기술이 아니라 <strong>질문에 필요한 근거를 찾고, 관계가 끊기지 않게 읽을 범위를 정하는 과정</strong>이다.
        </BeginnerBridge>
        <QuestionLead
          question="Context window가 길어졌는데도 왜 RAG가 필요하고, 반대로 RAG가 있는데 왜 원문 전체를 읽어야 할까?"
          answer="질문과 문서의 의존 구조가 다르기 때문이다. 독립 사실을 찾는 질문은 retrieval이 빠르고 저렴하다. 정의·지시어·논리 전제가 여러 구간에 연속되어 있으면 분해가 관계를 끊을 수 있어 full-context 또는 구조를 보존한 긴 단위가 더 낫다."
        />
        <ConceptPrimer items={[
          { term: 'Full-context', meaning: '문서 전체 또는 큰 논리 단위를 한 번에 reader model에 넣는다.', why: '강한 장거리 의존성을 보존하지만 prefill·KV·latency 비용이 크다.' },
          { term: 'Decomposition', meaning: '문서를 chunk로 나누고 필요한 일부만 검색·요약한다.', why: 'Corpus가 크고 관련 구간이 희소할 때 계산과 noise를 줄인다.' },
          { term: 'Structure-preserving retrieval', meaning: 'Section·table·figure group·code symbol처럼 관계가 살아 있는 단위를 검색한다.', why: '고정 token 분할과 full-context 사이의 실용적인 중간 경로다.' },
          { term: 'Context dependency', meaning: '한 구간을 이해할 때 앞뒤 구간의 정보·지시어·논리가 필요한 정도다.', why: '문서 길이 대신 분해 위험을 판단하는 신호가 된다.' },
        ]} />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            2026년 CoDaR 연구는 long-context workflow가 dataset에 따라 좋아지거나 나빠질 수 있음을 보였다.
            Chunk-wise iteration과 retrieval은 weak-dependency 문서에서 유용하지만, strong-dependency 문서에서는 서로 연결된 구간을 따로 처리해 성능을 낮출 수 있었다.
          </p>
          <p>
            연구는 각 chunk가 앞의 <em>k</em>개 chunk 중 하나에 정보·지시어·논리적으로 의존하는지 평가하고 document 평균을 냈다.
            이 값은 보편적인 truth score가 아니다. 원 논문의 512-word chunk, <em>k</em>=3, evaluator 설정을 그대로 제품 threshold로 복사하지 않고,
            자사 document와 golden query에서 세 route를 비교하는 출발 신호로 쓴다.
          </p>
        </div>
        <M display>{String.raw`\begin{aligned}S(c_i)&=\frac{1}{k}\sum_{j=1}^{k}\underbrace{E(c_i,c_{i-j})}_{\text{앞 구간 의존 여부}}\\D(D)&=\frac{1}{N-k}\sum_{i=k+1}^{N}\underbrace{S(c_i)}_{\text{구간 의존도}}\end{aligned}`}</M>
        <FormulaNote
          meaning="각 chunk가 앞선 k개 chunk에 의존하는 비율 S(c_i)를 구하고 문서 전체 평균 D(D)를 낸다. 값이 높을수록 무조건 full-context라는 법칙이 아니라 decomposition을 먼저 의심할 routing signal이다."
          symbols={[
            ['c_i', '문서의 i번째 순차 chunk'],
            ['E(c_i,c_i-j)', '정보·지시어·논리 의존이 있으면 1, 아니면 0인 evaluator'],
            ['k', '검사할 앞쪽 chunk window 수'],
            ['N', '문서 전체 chunk 수'],
            ['D(D)', '문서 D의 평균 context dependency signal'],
          ]}
        />
        <Misconception>
          “이질적인 artifact가 여러 개면 항상 query를 분해한다”도 잘못이다. Table·formula·code 사이의 관계를 한 context에서 함께 읽어야 할 수 있다.
          질문을 하위 evidence need로 나누되, 마지막 reasoning은 관계가 보존된 context package 또는 full-context에서 수행한다.
        </Misconception>
      </section>

      <section id="retrieval-units" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Chunk는 text 조각이 아니라 주소와 문맥을 가진 검색 단위다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            이 글에서 <strong>chunk</strong>는 단순히 token 수로 자른 문자열이 아니라 검색 index에 넣는 <strong>retrieval unit</strong>을 뜻한다.
            Retrieval unit은 앞 단계의 <InternalLink slug="knowledge-source-ingestion">구조 복원</InternalLink> 위에서 만든다.
            Section, paragraph group, table row+headers, formula+qualifier, figure+caption, code symbol+docstring처럼 독자가 함께 봐야 의미가 생기는 최소 묶음을 먼저 정의한다.
            Token limit은 이 의미 경계가 너무 클 때 적용하는 제약이지 첫 칼이 아니다.
          </p>
          <p>
            <strong>Naive chunking</strong>은 text를 자른 뒤 각 조각을 따로 encode한다. 빠르지만 “이 회사”, “그 조건”, “식 (7)” 같은 표현의 선행 문맥을 잃는다.
            <strong>Contextual retrieval</strong>은 전체 문서를 참고해 chunk별 짧은 설명을 만들고 원 chunk 앞에 붙여 embedding과 BM25 index를 만든다.
            이 설명은 검색 helper이지 source literal이 아니므로 generated transformation과 model version을 따로 기록한다.
          </p>
          <p>
            <strong>Late chunking</strong>은 순서를 바꾼다. 긴 document token 전체를 transformer로 먼저 encode한 뒤,
            기존 chunk boundary에 속한 token embedding만 mean pool한다. Chunk vector가 앞뒤 문맥을 이미 본다는 장점이 있지만,
            model context limit과 비용을 피할 수 없고 좋은 boundary 자체도 여전히 필요하다.
          </p>
        </div>
        <div className="not-prose my-8 border-y border-border">
          {[
            ['Naive', 'split → encode each chunk → pool', '가장 단순한 baseline', '지시어·제목·상위 문맥 손실'],
            ['Contextual', 'split → generate short context → index context+chunk', '기존 embedding·BM25에 적용', '생성 context의 오류·일회성 indexing 비용'],
            ['Late chunking', 'encode long document → span pool by boundary', '주변 token 문맥을 vector에 반영', 'long encoder 비용·context limit'],
            ['Hierarchical', 'section parent + child evidence units', '전체 주제와 세부 span을 함께 검색', 'parent summary와 child evidence의 lineage 필요'],
          ].map(([name, order, strength, risk]) => <div key={name} className="grid gap-2 py-5 sm:grid-cols-[7rem_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]"><strong className="text-xs">{name}</strong><code className="break-words text-xs leading-relaxed">{order}</code><p className="text-xs font-semibold leading-relaxed">{strength}</p><p className="text-xs leading-relaxed text-muted-foreground">{risk}</p></div>)}
        </div>
        <M display>{String.raw`\underbrace{z_C}_{\text{문맥이 반영된 chunk 벡터}}=\frac{1}{|C|}\sum_{i\in C}\underbrace{h_i(x_{1:n})}_{\text{문서 전체를 본 token 표현}}`}</M>
        <FormulaNote
          meaning="Late chunking은 document 전체 token x_1:n을 먼저 encode해 token 표현 h_i를 만들고, chunk C에 속한 위치만 평균낸다. 자른 뒤 encode하는 naive 방식과 계산 순서가 반대다."
          symbols={[
            ['z_C', '검색 index에 저장할 chunk C의 contextual vector'],
            ['C', '기존 chunker가 정한 token span'],
            ['|C|', 'chunk 안 token 수'],
            ['h_i(x_1:n)', '전체 document context를 본 i번째 token embedding'],
            ['x_1:n', 'encoder에 함께 넣은 document token sequence'],
          ]}
        />
      </section>

      <section id="search-signals" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Sparse, dense, late interaction은 서로 다른 recall 실패를 담당한다</h2>
        <ConceptPrimer items={[
          { term: 'Sparse · BM25', meaning: 'Query와 문서에 실제로 나타난 term의 희귀도와 빈도로 순위를 만든다.', why: '제품명·error code·함수명 같은 exact match를 놓치지 않는다.' },
          { term: 'Dense bi-encoder', meaning: 'Query와 검색 unit을 각각 하나의 vector로 압축해 방향 유사도를 비교한다.', why: '표현이 달라도 의미가 비슷한 문장을 찾는다.' },
          { term: 'Late interaction', meaning: 'Query와 문서를 token vector 여러 개로 유지하고 query token별 최고 대응을 합친다.', why: '여러 세부 조건을 하나의 vector로 너무 일찍 압축하지 않는다.' },
          { term: 'Hybrid retrieval', meaning: 'Sparse·dense·late-interaction 후보를 합친 뒤 공통 기준으로 rerank한다.', why: '한 검색기의 blind spot을 다른 신호로 보완한다.' },
        ]} />
        <p className="mb-5 max-w-3xl text-sm leading-relaxed text-muted-foreground">정확한 제품명, 의미가 같은 표현과 query token별 세부 대응은 같은 검색 신호가 잘 잡지 못한다. 다음 비교는 하나의 고정 query에 sparse·dense·late-interaction·hybrid retriever를 차례로 적용해 best match, score scale, 강점과 남는 실패를 분리한다.</p>
        <RetrievalStrategyExplorer />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            “TS-999” 같은 error code, exact part number와 함수 이름은 lexical match가 강하다. BM25는 query term이 document에서 얼마나 드문지,
            같은 term이 document 안에 얼마나 나타나는지, document 길이가 어떤지를 함께 본다. Term frequency가 무한히 점수를 키우지 않도록 포화시킨다.
          </p>
          <p>
            Dense bi-encoder는 query와 unit을 각각 한 vector로 압축해 cosine similarity를 계산한다. “motor가 뜨거울 때 힘을 줄인다”와
            “thermal torque derating”처럼 표현이 달라도 의미를 찾기 좋다. 하지만 한 vector에 모든 token을 압축하므로 exact identifier나 여러 조건의 세밀한 대응을 놓칠 수 있다.
          </p>
        </div>
        <M display>{String.raw`s_{\mathrm{dense}}(q,d)=\underbrace{\frac{u_q^{\top}v_d}{\|u_q\|_2\|v_d\|_2}}_{\text{query와 document 방향 유사도}}`}</M>
        <FormulaNote
          meaning="Query vector와 document vector의 길이를 나눈 내적을 사용해 두 방향이 얼마나 비슷한지 본다. 이 값은 semantic relevance이지 source correctness나 claim support가 아니다."
          symbols={[
            ['s_dense(q,d)', 'query q와 검색 unit d의 dense score'],
            ['u_q', 'query를 하나의 vector로 encode한 값'],
            ['v_d', 'document unit을 하나의 vector로 encode한 값'],
            ['u_qᵀv_d', '두 vector 방향의 일치 정도를 세는 내적'],
            ['||·||₂', 'vector 크기를 나눠 길이 영향을 제거하는 L2 norm'],
          ]}
        />
        <M display>{String.raw`\begin{aligned}
          \underbrace{n_d}_{\text{문서 길이 보정}}
          &=1-b+b\frac{|d|}{\bar L}\\
          \underbrace{g(t,d)}_{\text{포화된 용어 기여}}
          &=\frac{f(t,d)(k_1+1)}{f(t,d)+k_1n_d}\\
          \operatorname{BM25}(q,d)
          &=\sum_{t\in q}
            \underbrace{\operatorname{IDF}(t)}_{\text{희귀 용어 중요도}}g(t,d)
        \end{aligned}`}</M>
        <FormulaNote
          meaning="먼저 문서 길이를 말뭉치 평균 길이와 비교해 보정값 n_d를 만든다. 다음으로 용어 빈도 f(t,d)를 g(t,d)처럼 포화시킨다. 마지막에 질의의 각 용어마다 희귀도 IDF와 포화된 빈도 기여를 곱해 더한다. 긴 한 줄을 실제 계산 순서 세 단계로 나눈 것이다."
          symbols={[
            ['t', '질의에 포함된 한 용어'],
            ['IDF(t)', '말뭉치 전체에서 드문 용어일수록 큰 역문서 빈도'],
            ['f(t,d)', '문서 d에서 용어 t가 나온 횟수'],
            ['|d|, L̄', '문서 길이와 말뭉치의 평균 문서 길이'],
            ['n_d', '문서 길이가 평균보다 길거나 짧은 정도를 반영한 보정값'],
            ['g(t,d)', '반복 횟수가 무한히 점수를 키우지 않도록 포화시킨 용어 기여'],
            ['k₁, b', '빈도 포화와 길이 보정 강도를 정하는 설정값'],
          ]}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            ColBERT-style late interaction은 query와 document를 token vector 여러 개로 유지한다. 각 query token이 document token 중 가장 잘 맞는 하나를 찾고,
            그 MaxSim을 query token 전체에서 더한다. “temperature”, “80°C”, “torque”, “limit”이 서로 다른 document 위치와 각각 대응할 수 있지만
            index storage와 search 연산이 single-vector보다 크다.
          </p>
        </div>
        <M display>{String.raw`s_{\mathrm{late}}(q,d)=\sum_{i=1}^{|q|}\underbrace{\max_{1\le j\le |d|}Q_i^{\top}D_j}_{\text{각 query token의 최고 대응}}`}</M>
        <FormulaNote
          meaning="각 query token vector Q_i가 document token vector D_j 중 가장 비슷한 하나를 고르고 그 값을 모두 더한다. Query의 세부 조건을 한 vector로 너무 일찍 압축하지 않는 late-interaction score다."
          symbols={[
            ['Q_i', 'i번째 query token의 contextual vector'],
            ['D_j', 'j번째 document token의 contextual vector'],
            ['max_j', '한 query token과 가장 잘 맞는 document token 선택'],
            ['Σ_i', 'query token별 부분 일치 점수를 합산'],
          ]}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            실패 반례를 같이 기억해야 한다. BM25는 query가 “열 때문에 힘을 줄임”이고 문서가 <code>thermal derating</code>만 썼다면
            exact term이 없어 놓칠 수 있다. Dense는 의미가 비슷한 설명을 찾고도 <code>TS-999</code>와 <code>TS-998</code> 같은 식별자를
            뭉갤 수 있다. Late interaction은 “80°C”와 “42 N·m”를 각각 찾더라도 서로 다른 표 행에서 가져오면 두 조건이 같은 claim에
            묶였다는 relation을 보장하지 못한다. 그래서 hybrid 후보 뒤에도 scope·row·version을 함께 읽는 reranker와 evidence verifier가 필요하다.
          </p>
        </div>
      </section>

      <section id="fusion-rerank" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Fusion은 후보를 넓히고 reranker는 같은 질문으로 다시 읽는다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            BM25 11.8과 cosine 0.82를 그대로 더하면 scale이 큰 score가 결과를 지배한다. Reciprocal Rank Fusion은 각 retriever의 절대 score가 아니라
            candidate가 몇 번째였는지를 사용한다. 여러 retriever가 높은 순위로 동의한 unit이 올라오지만, 한 retriever만 찾을 수 있는 희귀 evidence도 candidate pool에 남는다.
          </p>
        </div>
        <M display>{String.raw`\operatorname{RRF}(d)=\sum_{r\in\mathcal{R}}\underbrace{\frac{1}{\kappa+\operatorname{rank}_r(d)}}_{\text{retriever }r\text{의 순위 기여}}`}</M>
        <FormulaNote
          meaning="Retriever마다 score scale이 달라도 candidate d의 rank만 사용해 기여를 합친다. κ는 1위와 아래 순위의 차이가 너무 커지지 않게 완화한다."
          symbols={[
            ['RRF(d)', 'candidate d의 fused rank score'],
            ['R', 'BM25, dense, late interaction 같은 retriever 집합'],
            ['rank_r(d)', 'retriever r가 candidate d에 준 순위'],
            ['κ', '상위 순위 기여를 부드럽게 만드는 양의 상수'],
          ]}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            First-stage retriever는 corpus 전체에서 recall을 확보해야 하므로 query와 document를 따로 encode하거나 inverted index를 쓴다.
            Cross-encoder reranker는 수십 개 candidate만 query와 함께 읽어 더 정확한 relevance를 계산한다. Candidate 20개를 5개로 줄이면
            generation context가 짧아지지만, reranker가 놓친 evidence는 뒤 단계에서 복구할 수 없다.
          </p>
          <p>
            Multi-hop 질문은 query를 evidence need로 분해할 수 있다. “허용 torque, 적용 온도, 어느 release가 구현했나?”를
            value, qualifier, code-version subquery로 나누되, 세 답을 독립적으로 생성하지 않는다. Candidate를 모은 뒤 shared entities와 version relation을 확인하고 하나의 context package로 합친다.
          </p>
        </div>
      </section>

      <section id="context-packing" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Context packing은 score 정렬이 아니라 evidence coverage 최적화다</h2>
        <p className="mb-5 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Evidence coverage는 질문에 필요한 하위 claim 중 서로 구분되는 current source span으로 지지된 비율이다.
          상위 chunk가 같은 문장을 반복하면 점수는 높아도 coverage는 늘지 않는다. 다음 장면은 context dependency, token budget과 repeated summary 포함 여부를 바꿔
          표 값·수식 조건·code version의 coverage가 3/3인지 확인한다.
        </p>
        <ContextPackingExplorer />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Top-k unit을 score 순서로 이어 붙이면 같은 summary가 반복되고 정작 formula qualifier가 budget 밖으로 밀릴 수 있다.
            Packer는 먼저 답에 필요한 subclaim 집합을 만든다. 각 candidate가 어떤 subclaim을 지지하는지, source version이 current인지,
            서로 중복인지, table header나 caption 같은 인접 context가 필요한지 표시한다.
          </p>
          <p>
            Context package는 plain text가 아니다. Query contract, selected source ids, exact spans, trust label, ordering reason과 token count를 가진다.
            Table row는 column header와 함께, formula는 qualifier와 symbol definition과 함께, code는 commit과 symbol signature와 함께 serialize한다.
          </p>
        </div>
        <M display>{String.raw`\begin{aligned}
U_{\text{충족}}(X)&=\operatorname{cover}(X,Q)\\
U_{\text{감점}}(X)&=\lambda\operatorname{dup}(X)+\mu\operatorname{risk}(X)\\
\max_{X\subseteq C}\quad&U_{\text{충족}}(X)-U_{\text{감점}}(X)\\
\text{조건}\quad&\sum_{x\in X}\operatorname{tok}(x)\le B
\end{aligned}`}</M>
        <FormulaNote
          meaning="Candidate C 중 evidence set X를 골라 질문 Q의 필수 하위 claim을 최대한 덮고, 중복과 stale·permission·conflict 위험을 줄인다. 선택한 token 합은 budget B를 넘지 않는다. 실제 packer는 이 목적을 heuristic이나 search로 근사할 수 있다."
          symbols={[
            ['C', 'retrieval과 rerank를 통과한 candidate evidence 전체'],
            ['X', '실제 prompt context에 넣을 evidence subset'],
            ['cover(X,Q)', '질문 Q를 답하는 데 필요한 subclaim을 X가 덮는 정도'],
            ['dup(X)', '같은 내용을 반복해 budget을 낭비하는 정도'],
            ['risk(X)', 'stale source, ACL 위반, conflict와 untrusted instruction 위험'],
            ['tok(x), B', 'evidence x의 serialized token 수와 전체 budget'],
            ['λ, μ', '중복과 위험을 얼마나 강하게 벌점할지 정하는 값'],
          ]}
        />
        <Misconception>
          Lost in the Middle 연구를 “중요한 근거는 prompt 양 끝에 둔다”는 고정 배치 recipe로 읽으면 안 된다.
          Position sensitivity를 regression slice로 측정하고, evidence id와 structure를 명확히 serialize하며, 불필요한 context를 제거하는 것이 먼저다.
        </Misconception>
      </section>

      <section id="runtime-trace" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Prompt에 근거가 들어간 것과 답의 claim이 지지되는 것은 다르다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            한 실행에는 query, auth filter, rewrite, candidate scores, rerank result, selected context snapshot, model·prompt version과 output을 stable run id로 남긴다.
            답을 sentence가 아니라 최소 claim으로 나누고 각 claim이 package의 어느 source span에 의해 fully supported, inconclusive, contradicted인지 판정한다.
          </p>
          <p>
            답이 “42 N·m”라고 맞췄어도 80°C qualifier를 빼면 partial support다. Rev 1.2의 45 N·m chunk를 current filter가 놓쳤다면 freshness failure다.
            Code release를 manual claim의 scientific confirmation처럼 인용하면 relation-type failure다. 최종 정답률 하나로는 세 원인을 구분할 수 없다.
          </p>
          <p>
            Retrieved context는 신뢰할 수 없는 data channel이다. 문서 안의 “이전 지침을 무시하라”는 문장은 source 내용이지 system instruction이 아니다.
            Packer는 untrusted content를 delimiter와 typed field로 격리하고 tool permission은 context 밖의 policy engine이 결정한다.
          </p>
        </div>
        <div className="not-prose my-8 border-y border-border py-6">
          <h3 className="mb-3 text-base font-bold">Citation 문자열을 provenance record로 바꾼다</h3>
          <p className="mb-5 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            답 끝에 문서 이름만 붙이면 어디를 읽고 어떤 중간 판단을 거쳤는지 재현할 수 없다. 최소 record는 아래 네 주소를 끊기지 않게 잇는다.
          </p>
          <ol className="grid gap-3 sm:grid-cols-2">
            {[
              ['1 · claim_id', '최종 답을 한 번에 검증할 수 있는 최소 주장으로 나눈다. 예: “80°C에서 허용 토크는 42 N·m다.”'],
              ['2 · generation_node', '어떤 model·prompt version이 어느 context snapshot에서 이 claim을 만들었는지 기록한다.'],
              ['3 · retrieval_run', 'Query, filter, 후보 점수, rerank 순위와 실제로 pack한 evidence id를 한 실행으로 묶는다.'],
              ['4 · source_span', '문서 version, page·section·offset과 qualifier까지 가리켜 원문으로 되돌아갈 수 있게 한다.'],
            ].map(([label, description]) => (
              <li key={label} className="min-w-0 border-l-2 border-foreground/20 pl-4">
                <strong className="block text-xs">{label}</strong>
                <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{description}</span>
              </li>
            ))}
          </ol>
          <p className="mt-5 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            Verifier는 각 claim-source edge를 <strong className="text-foreground">supported</strong>,
            <strong className="text-foreground"> inconclusive</strong>, <strong className="text-foreground">contradicted</strong>로 판정한다.
            중간 요약이 qualifier를 잃었다면 source가 아니라 그 generation node를 고치고, current source가 후보에 없었다면 retrieval run을 고친다.
          </p>
        </div>
        <div className="not-prose my-8 divide-y divide-border border-y border-border">
          {[
            ['Retrieval miss', '필수 source span이 candidate set에 없음', 'unit·index·query rewrite·filter'],
            ['Ranking miss', 'span은 찾았지만 rerank 후 budget 밖', 'fusion·reranker·candidate depth'],
            ['Packing miss', '필요한 table header·scope·version이 빠짐', 'coverage·adjacency·dedup·budget'],
            ['Generation miss', 'context에 있는 근거를 잘못 합성', 'prompt·model·structured claim output'],
            ['Grounding miss', '답 claim 전체를 지지하는 span이 없음', 'verifier·abstention·claim splitting'],
            ['Freshness miss', 'superseded source가 current로 검색됨', 'version filter·impact closure·reindex'],
          ].map(([failure, sign, owner]) => <div key={failure} className="grid gap-2 py-5 sm:grid-cols-[8rem_minmax(0,1fr)_minmax(0,1fr)]"><strong className="text-xs">{failure}</strong><p className="text-xs leading-relaxed text-muted-foreground">{sign}</p><code className="break-words text-xs leading-relaxed">{owner}</code></div>)}
        </div>
      </section>

      <section id="evaluation-release" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">평가는 검색·근거·freshness·지연을 같은 run에서 분리한다</h2>
        <ConceptPrimer items={[
          { term: 'Recall@20', meaning: '정답 근거가 상위 20개 검색 후보 안에 하나라도 들어온 질문의 비율이다.', why: '생성 전에 검색기가 필요한 근거를 후보로 올렸는지 본다.' },
          { term: 'MRR', meaning: '각 질문에서 첫 번째 정답 근거가 나온 순위의 역수(1/rank)를 평균한 값이다.', why: '근거가 후보 안에 있는지만 보지 않고 얼마나 앞에서 처음 만나는지 측정한다.' },
          { term: 'nDCG', meaning: '여러 근거의 관련도 등급과 순서를 함께 반영한 DCG를 이상적인 순서의 DCG로 나눈 값이다.', why: '부분 근거와 완전 근거가 섞인 목록에서 좋은 근거가 위에 배치됐는지 비교한다.' },
          { term: 'Claim support', meaning: '최종 답의 최소 claim 중 scope까지 current evidence가 완전히 지지한 비율이다.', why: '그럴듯한 정답과 실제 근거가 있는 답을 분리한다.' },
          { term: 'Current-source ratio', meaning: '선택한 context 중 superseded되지 않은 현재 source가 차지하는 비율이다.', why: '오래된 근거로 맞는 척하는 freshness 실패를 잡는다.' },
          { term: 'p95 latency', meaning: '100개 요청을 빠른 순서로 세웠을 때 95번째 요청의 지연 시간이다.', why: '평균이 숨기는 느린 꼬리 요청을 release gate에 포함한다.' },
        ]} />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h3>모든 질문을 같은 RAG 경로로 보내지 않는다</h3>
          <p>
            특정 규정의 한 문장처럼 답의 위치가 좁으면 일반 hybrid retrieval과 rerank가 먼저다.
            검색한 문서가 질문과 맞는지 evaluator가 낮은 확신을 보이면 <strong>Corrective RAG</strong>처럼
            그대로 생성하지 않고 검색 질의를 고치거나 허용된 외부 source로 넓히고, 그래도 근거가 없으면
            답을 보류한다. 핵심은 CRAG라는 이름이 아니라 <strong>검색 실패를 생성 단계에 숨기지 않는 분기</strong>다.
          </p>
          <p>
            반대로 “전체 corpus의 공통 위험은 무엇인가?”처럼 여러 문서에 흩어진 관계를 묻는 전역 질문은
            가까운 chunk 몇 개만 찾는 방식으로 coverage를 얻기 어렵다. GraphRAG 연구는 source에서 entity graph와
            community summary를 미리 만들고, 관련 community의 부분 답을 다시 합쳐 전역 요약을 구성했다. 이는 모든
            질문에 graph를 쓰라는 결론이 아니다. Indexing 비용과 추출 오류가 늘기 때문에 전역 sensemaking 질문에서만
            별도 route로 열고, 각 summary가 원 source text unit으로 돌아가는 주소를 유지해야 한다.
          </p>
          <p>
            <strong>RAGAS</strong>는 reference-free 평가를 통해 context relevance, answer faithfulness와 answer relevance를
            나누려는 초기 틀을 제공했다. 다만 LLM judge 점수 하나를 정답으로 취급하지 않는다. 이 글의 release에서는
            source span이 있는 golden set으로 Recall·claim support·freshness를 직접 재고, RAGAS형 자동 평가는 빠른
            회귀 신호로만 사용한 뒤 사람 검토 표본과 judge version을 함께 남긴다.
          </p>
        </div>
        <p className="mb-5 max-w-3xl text-sm leading-relaxed text-muted-foreground">최종 답 하나만 채점하면 검색 실패와 근거 부족, 오래된 source와 timeout을 구분할 수 없다. 다음 release gate는 같은 fixture에서 Recall@20, claim support, current source 비율과 p95 latency를 각각 조절하고 네 조건이 함께 통과할 때만 release한다.</p>
        <RagReleaseGate />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Golden set은 질문과 정답 한 줄이 아니다. Relevant source spans, 허용 claim, 금지 claim, current version, expected abstention과 access policy를 함께 가진다.
            Retrieval model만 바꿀 때는 같은 corpus snapshot에서 Recall@K·MRR·nDCG를 비교하고, generation model만 바꿀 때는 같은 context snapshot을 재사용한다.
          </p>
          <p>
            METIS가 보여 준 것처럼 query complexity에 따라 <code>num_chunks</code>, synthesis 방식과 intermediate length가 달라질 수 있다.
            단일 사실은 적은 context로 빠르게 답하고, 여러 evidence를 합치는 질문은 더 많은 context나 map-reduce가 필요할 수 있다.
            하지만 configuration optimizer도 claim support와 source freshness gate를 통과해야 한다.
          </p>
          <p>
            작은 모델을 쓸 때는 일을 좁힌다. 4B extractor는 한 unit에서 exact claim·scope·source id만 구조화한다.
            9B reviewer는 한 query의 candidate packet에서 evidence coverage와 conflict를 판단한다. Orchestrator만 retrieval route, graph version,
            prompt assembly와 release를 바꾸며 모든 작은 모델 출력은 schema·ID allowlist·source span validator를 통과한다.
          </p>
        </div>
        <CapabilityCheck items={[
          '문서 길이만으로 full-context와 decomposition을 선택하지 않고 dependency·task slice를 평가한다.',
          'Naive, contextual, late chunking의 계산 순서와 source-literal 경계를 설명한다.',
          'BM25, dense cosine, late interaction이 각각 놓치는 query를 반례로 만든다.',
          '서로 다른 score scale을 직접 더하지 않고 fusion과 rerank의 역할을 분리한다.',
          'Table row, formula qualifier와 code version을 evidence coverage 기준으로 token budget 안에 포장한다.',
          'Build-time lineage와 실제 query run의 context snapshot·claim trace를 연결하되 동일시하지 않는다.',
          'Recall, ranking, packing, grounding, freshness, latency failure를 한 지표로 숨기지 않는다.',
        ]} />
        <LearningHandoff
          description="RAG의 산출물은 답 문자열이 아니라 어떤 version의 evidence를 어떤 context package에 넣었는지 재생 가능한 query trace다. 다음 단계에서는 새 revision이 들어왔을 때 이 trace와 공개 claim 중 무엇을 다시 계산할지 닫는다."
          items={[
            { label: '막히면', slug: 'knowledge-ir-evidence-lineage', title: 'Knowledge IR · Evidence Lineage', reason: '검색 결과가 가리키는 Claim·Scope·Evidence와 build-time provenance가 먼저 연결됐는지 확인한다.' },
            { label: '이어 읽기', slug: 'knowledge-research-watcher', title: 'Research Watcher', reason: '새 source version과 correction event가 들어왔을 때 stale context·claim·article만 찾아 재검토한다.' },
            { label: '적용하기', slug: 'research-codar-2026', title: 'CoDaR 연구 재구성', reason: 'Full-context와 decomposition route를 실제 장문 의존성 evidence로 비교한다.' },
          ]}
        />
        <SourceNotes sources={[
          { label: 'Guo et al. · CoDaR / Lost in Decomposition, ACL 2026', href: 'https://aclanthology.org/2026.findings-acl.2097/', note: 'Context dependency가 강한 document에서 decomposition workflow가 실패할 수 있는 현재 routing 근거.' },
          { label: 'Lewis et al. · Retrieval-Augmented Generation, 2020', href: 'https://arxiv.org/abs/2005.11401', note: 'Retrieved non-parametric memory와 generation을 결합하는 최소 canonical contract.' },
          { label: 'Günther et al. · Late Chunking, 2024', href: 'https://arxiv.org/abs/2409.04701', note: '전체 문맥 token encoding 뒤 span pooling하는 contextual chunk embedding.' },
          { label: 'Anthropic · Contextual Retrieval, 2024', href: 'https://www.anthropic.com/engineering/contextual-retrieval', note: 'Chunk-specific context를 embedding과 BM25 index 앞에 붙이고 rerank한 회사 연구.' },
          { label: 'Santhanam et al. · ColBERTv2, 2022', href: 'https://aclanthology.org/2022.naacl-main.272/', note: 'Query token별 MaxSim late interaction과 residual compression의 기준 논문.' },
          { label: 'Liu et al. · Lost in the Middle, TACL 2024', href: 'https://aclanthology.org/2024.tacl-1.9/', note: 'Long context의 evidence position sensitivity를 보여 준 평가 근거.' },
          { label: 'Ray et al. · METIS, SOSP 2025', href: 'https://www.microsoft.com/en-us/research/publication/metis-fast-quality-aware-rag-systems-with-configuration-adaptation/', note: 'Query별 chunk 수·synthesis·intermediate length와 scheduling의 quality-delay trade-off.' },
          { label: 'Microsoft Research · VeriTrail, 2025', href: 'https://www.microsoft.com/en-us/research/blog/veritrail-detecting-hallucination-and-tracing-provenance-in-multi-step-ai-workflows/', note: 'Multi-stage final claim을 source까지 추적하고 error stage를 찾는 provenance 연구.' },
          { label: 'Es et al. · RAGAS, 2023', href: 'https://arxiv.org/abs/2309.15217', note: 'Context relevance, answer faithfulness와 answer relevance를 분리한 reference-free RAG 평가 틀. Production ground truth를 대신하지는 않는다.' },
          { label: 'Edge et al. · GraphRAG, 2024', href: 'https://arxiv.org/abs/2404.16130', note: 'Entity graph와 community summaries를 이용해 corpus 전체를 묻는 global sensemaking 질문을 다룬 연구.' },
          { label: 'Yan et al. · Corrective RAG, 2024', href: 'https://arxiv.org/abs/2401.15884', note: 'Retrieved document 품질을 평가해 correction 또는 knowledge 확장 route를 여는 원 논문.' },
        ]} />
      </section>
    </>
  );
}

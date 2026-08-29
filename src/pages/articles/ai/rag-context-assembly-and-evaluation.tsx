import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import RagContextAssemblyAndEvaluationViz from "./rag-context-assembly-and-evaluation/viz/RagContextAssemblyAndEvaluationViz";

/**
 * RAG context 조립과 평가: packing·groundedness·error attribution
 *
 * 작성 규칙은 docs/coverage-batch-playbook.md 를 따른다.
 */
export default function RagContextAssemblyAndEvaluationArticle() {
  return (
    <div id="overview" className="space-y-16">
      <section id="problem" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Context 조립과 지표 분리, RAG의 서로 다른 두 병목을 잡습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Retrieval이 candidate를 넘겨도 그 자체로 좋은 답변이 나오지 않습니다. 예산 안에서
            어떤 evidence를 남기고 어떤 순서로 배치하는지가 첫 번째 병목이고, 답변이 나온 뒤에는
            어느 stage를 고쳐야 하는지 지표별로 나눠 봐야 두 번째 병목이 드러납니다.
          </p>
          <p>
            이 글은 candidate를 넘겨받은 뒤 context를 조립하는 절차(evidence selection·packing·
            ordering), 답변 품질을 RAGAS 류 지표로 나눠 재는 방법, 그리고 실패를 retrieval·
            ranking·generation stage로 귀속하는 절차를 다룹니다.
          </p>
          <p>
            Candidate를 만드는 sparse·dense·fusion·reranking 자체는{" "}
            <Link to="/ai/retrieval-ranking-funnel#retrieval">retrieval ranking funnel</Link> 글이
            정본입니다. Source ingestion부터 citation policy·context token budget까지 전체
            lifecycle과 이를 stage별로 추적하는 layered evaluation은{" "}
            <Link to="/ai/rag-pipeline#evaluation">RAG 파이프라인</Link> 글이 이미 다룹니다.
          </p>
          <p>
            이 글은 그 layered evaluation이 참조하는 지표 자체의 정의와, context를 조립하는 두
            선택(selection·packing)을 채웁니다.
          </p>
        </div>
        <RagContextAssemblyAndEvaluationViz />
        <ContentBoundary article="rag-context-assembly-and-evaluation" />
      </section>

      <section id="context-assembly" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          예산을 넘는 evidence는 선택으로 줄이고, 남은 evidence는 순서까지 정합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Retrieval budget(top-k=5, chunk당 500 token이면 2,500 token)을 넘는 candidate 전부를
            context에 넣을 수 없습니다. Evidence selection은 그 예산 안에서 실제로 남길 chunk를
            정하는 절차이고, 순위만으로 자르면 비슷한 내용이 중복돼 서로 다른 정보를 밀어냅니다.
          </p>
          <p>
            Rerank 순위 top-8 중 top-5를 그대로 자르면 1·2위가 같은 문단을 다른 표현으로 반복해
            실질 정보는 3개 chunk 분량만 남을 수 있습니다. Cosine similarity 0.9 이상인 후보를
            중복으로 걸러 순위 3·6·8위를 대신 채우면 같은 예산으로 더 넓은 evidence를
            확보합니다.
          </p>
          <p>
            예산을 넘긴 나머지를 요약·추출로 줄이는 선택지도 있지만, 그 압축 자체는{" "}
            <Link to="/ai/context-window-optimization#compression">
              context window optimization의 compression
            </Link>
            이 이미 다룹니다. 이 글은 압축 전에 무엇을 남길지 정하는 selection 단계만 다룹니다.
          </p>
          <p>
            선택된 chunk를 실제 prompt 문자열로 만드는 결정이 context packing이고, 그 chunk를 어떤
            순서로 배치할지가 context ordering입니다. 두 결정은 붙어 있지만 서로 다른 실패를
            만듭니다.
          </p>
          <p>
            Packing은 각 chunk 앞뒤에 source id·구분자를 넣어 model이 어디까지가 한 evidence인지
            알게 하는 작업입니다. 구분자가 없으면 model이 두 문서의 경계를 넘어 잘못된 조합으로
            답을 만들 수 있습니다.
          </p>
          <p>
            Ordering은{" "}
            <Link to="/ai/context-window-optimization#position">lost-in-the-middle</Link> 위치
            편향을 고려한 배치입니다. GPT-3.5-Turbo의 20-document 실험에서 정답이 1번째면 정확도
            75.8%, 10번째(가운데)면 53.8%로 떨어졌으므로, 가장 중요한 evidence를 맨 앞이나 맨
            끝에 두고 나머지를 채웁니다.
          </p>
        </div>
        <TermBreakdown
          title="Selection·packing·ordering 세 결정"
          description="예산 안에서 무엇을 남기고, 어떻게 직렬화하고, 어떤 순서로 두는지는 서로 다른 결정입니다."
          items={[
            {
              term: "Evidence selection",
              description: "예산 안에서 실제로 남길 chunk를 정하는 절차입니다.",
              example: "Top-8 중 중복 제거 뒤 top-5 재구성",
              boundary: "압축(context compression)과 달리 chunk 내용을 바꾸지 않고 포함 여부만 정합니다.",
            },
            {
              term: "Context packing",
              description: "선택된 chunk를 구분자·citation id와 함께 하나의 prompt 문자열로 직렬화합니다.",
              example: "[doc:report-v3#p12] 형태의 source 표시를 chunk마다 붙임",
              boundary: "직렬화 형식이 없으면 model이 여러 evidence를 하나로 섞어 인용을 잘못 답니다.",
            },
            {
              term: "Context ordering",
              description: "직렬화된 chunk의 배치 순서를 정합니다.",
              example: "가장 관련도 높은 chunk를 맨 앞과 맨 끝에 배치",
              boundary: "순서를 바꿔도 chunk의 relevance 점수는 바뀌지 않고, model의 실제 활용률만 달라집니다.",
            },
          ]}
        />
      </section>

      <section id="metrics" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Groundedness는 답변을, context precision·recall은 근거를 봅니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            RAGAS는 reference 정답 없이 LLM으로 RAG 품질을 재는 네 지표를 정의합니다. Groundedness
            (원 논문 명칭 faithfulness)와 answer relevance는 생성된 답변을, context precision과
            context recall은 검색된 context 자체를 평가합니다.
          </p>
          <p>
            여기서 말하는 groundedness는{" "}
            <Link to="/ai/prompt-reasoning#chain-of-thought">
              chain-of-thought faithfulness
            </Link>
            (reasoning 과정이 실제 계산을 반영하는지)와 다른 개념입니다. Groundedness는 최종
            답변의 각 주장이 context 문장으로 뒷받침되는지만 봅니다.
          </p>
        </div>
        <ExplainedFormula
          question="답변의 각 주장이 실제로 context에 있는지 어떻게 하나의 점수로 재나요?"
          idea={
            <p>
              LLM으로 답변을 원자적 주장(statement) 여러 개로 쪼갠 뒤, 각 주장이 context에서
              추론 가능한지 참·거짓으로 판정하고 지지된 주장의 비율을 냅니다.
            </p>
          }
          formula={String.raw`G=\dfrac{|V|}{|S|}`}
          annotatedFormula={String.raw`G=\dfrac{\overbrace{|V|}^{\text{context로 지지된 주장 수}}}{\underbrace{|S|}_{\text{답변 전체 주장 수}}}`}
          operations={[
            {
              expression: String.raw`S=\text{decompose}(a)`,
              annotation: ["답변 a를 LLM으로", "독립적인 주장 단위로 쪼갬"],
            },
            {
              expression: String.raw`V=\{s\in S:\text{verify}(s,\,c(q))\}`,
              annotation: ["각 주장을 context c(q)와 대조해", "지지되는 주장만 모음"],
            },
            {
              expression: String.raw`G=|V|/|S|`,
              annotation: ["지지된 주장 수를", "전체 주장 수로 나눔"],
            },
          ]}
          terms={[
            { symbol: "a", name: "Answer", description: "생성된 답변입니다." },
            { symbol: "S", name: "Statement set", description: "답변을 분해한 개별 주장 전체입니다." },
            { symbol: "V", name: "Verified subset", description: "context에서 추론 가능하다고 판정된 주장의 부분집합입니다." },
            { symbol: "c(q)", name: "Retrieved context", description: "질문 q에 대해 검색돼 조립된 context입니다." },
          ]}
          assumptions={[
            "주장 분해와 지지 여부 판정 모두 LLM judge에 의존합니다.",
            "Context 자체가 정답을 담고 있다는 보장은 context recall로 별도 확인해야 합니다.",
          ]}
          interpretation="답변이 5개 주장으로 쪼개지고 그중 4개가 context로 지지되면 G=0.8입니다. RAGAS 논문은 WikiEval 데이터셋에서 사람 판정과 95% 일치했다고 보고합니다."
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Answer relevance는 반대 방향의 실패를 잡습니다. Context는 맞게 썼지만 질문과 무관한
            답을 하는 경우입니다. 답변에서 거꾸로 여러 개의 가상 질문을 만들어 원 질문과 얼마나
            비슷한지 embedding cosine similarity로 잽니다.
          </p>
        </div>
        <ExplainedFormula
          question="답변이 실제로 원 질문을 다루는지 reference 없이 어떻게 재나요?"
          idea={
            <p>
              답변만 보고 LLM으로 그 답이 나올 법한 질문 n개를 역으로 생성한 뒤, 각 생성 질문과
              원 질문의 embedding cosine similarity 평균을 냅니다.
            </p>
          }
          formula={String.raw`AR=\dfrac{1}{n}\sum_{i=1}^{n}\cos(q,\,q_i)`}
          annotatedFormula={String.raw`AR=\dfrac{1}{n}\sum_{i=1}^{n}\underbrace{\cos(\overbrace{q}^{\text{원 질문}},\,\overbrace{q_i}^{\text{답변 a로부터 역생성한 질문}})}_{\text{두 질문 embedding의 코사인 유사도}}`}
          operations={[
            {
              expression: String.raw`\{q_1,\dots,q_n\}=\text{gen}(a)`,
              annotation: ["답변 a만 보고 LLM으로", "n개의 가상 질문을 역생성"],
            },
            {
              expression: String.raw`\cos(q,q_i)`,
              annotation: ["원 질문과 각 가상 질문의", "embedding 코사인 유사도 계산"],
            },
            {
              expression: String.raw`AR=\frac{1}{n}\sum_i \cos(q,q_i)`,
              annotation: ["n개 유사도의 평균을", "answer relevance 점수로 사용"],
            },
          ]}
          terms={[
            { symbol: "q", name: "Original question", description: "사용자의 원 질문입니다." },
            { symbol: "q_i", name: "Generated question", description: "답변 a로부터 LLM이 역생성한 i번째 가상 질문입니다." },
            { symbol: "n", name: "Sample count", description: "역생성하는 가상 질문의 개수입니다." },
          ]}
          assumptions={[
            "가상 질문 생성과 embedding 품질에 결과가 좌우됩니다.",
            "불완전하거나 회피성 답변에는 역생성 질문 자체가 모호해질 수 있습니다.",
          ]}
          interpretation="RAGAS 논문은 WikiEval에서 answer relevance가 사람 판정과 78% 일치했다고 보고하며, 세 지표 중 가장 낮은 일치율임을 함께 명시합니다."
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Context precision과 recall은 답변이 아니라 검색된 context 자체를 봅니다. Precision은
            relevant chunk가 순위 위쪽에 오는지, recall은 정답에 필요한 근거가 하나도 빠지지
            않았는지를 봅니다. RAGAS 논문 자체는 이 둘을 정의하지 않고, 후속 RAGAS 공식 문서가
            추가한 지표입니다.
          </p>
        </div>
        <ExplainedFormula
          question="검색된 chunk들이 relevant한 것을 순위 위쪽에 배치했는지 어떻게 재나요?"
          idea={
            <p>
              순위 k마다 그 지점까지의 precision을 구하고, k번째 chunk가 relevant일 때만(v_k=1)
              그 precision을 가중해 합산한 뒤 relevant chunk 총 개수로 정규화합니다.
            </p>
          }
          formula={String.raw`CP@K=\dfrac{\sum_{k=1}^{K}\big(\text{Precision@}k\times v_k\big)}{\text{전체 relevant chunk 수}}`}
          annotatedFormula={String.raw`CP@K=\dfrac{\sum_{k=1}^{K}\overbrace{\Big(\underbrace{\text{Precision@}k}_{\substack{\text{순위 }k\text{까지}\\\text{TP}/(\text{TP+FP})}}\times\underbrace{v_k}_{\substack{\text{순위 }k\text{가}\\\text{relevant면 1}}}\Big)}^{\text{relevant 위치에서만 정밀도를 가중}}}{\underbrace{\text{전체 relevant chunk 수}}_{\text{정규화 분모}}}`}
          operations={[
            {
              expression: String.raw`\text{Precision@}k=\text{TP}_k/(\text{TP}_k+\text{FP}_k)`,
              annotation: ["순위 k까지 누적된", "참 relevant 비율을 계산"],
            },
            {
              expression: String.raw`v_k\in\{0,1\}`,
              annotation: ["순위 k의 chunk가 relevant면 1,", "아니면 0으로 표시"],
            },
            {
              expression: String.raw`CP@K=\sum_k(\text{Precision@}k\cdot v_k)/|\text{relevant}|`,
              annotation: ["relevant 위치의 precision만 더해", "relevant chunk 수로 정규화"],
            },
          ]}
          terms={[
            { symbol: "K", name: "Cutoff", description: "평가 대상으로 삼는 검색 결과 개수입니다." },
            { symbol: "v_k", name: "Relevance indicator", description: "순위 k chunk의 relevance 여부(0 또는 1)입니다." },
          ]}
          assumptions={[
            "LLM 기반 버전은 relevance 판정 자체를 judge model에 맡깁니다.",
            "Non-LLM 버전은 문자열 유사도로 relevance를 근사해 계산 비용은 낮지만 의미 유사어를 놓칠 수 있습니다.",
          ]}
          interpretation="Relevant chunk가 모두 앞쪽 순위에 몰려 있으면 CP@K는 1에 가깝고, 같은 개수의 relevant chunk가 뒤섞여 있으면 값이 낮아집니다."
        />
        <ExplainedFormula
          question="정답에 필요한 근거가 검색 결과에서 하나도 빠지지 않았는지 어떻게 재나요?"
          idea={
            <p>
              Reference 답변을 개별 주장(claim)으로 분해한 뒤, 각 claim이 검색된 context에서
              지지되는지 판정하고 그 비율을 recall로 씁니다.
            </p>
          }
          formula={String.raw`CR=\dfrac{|\{\,r\in R: \text{attributable}(r,\,c(q))\,\}|}{|R|}`}
          annotatedFormula={String.raw`CR=\dfrac{\overbrace{|\{r\in R:\text{attributable}(r,c(q))\}|}^{\text{context로 귀속 가능한 reference claim 수}}}{\underbrace{|R|}_{\text{reference의 전체 claim 수}}}`}
          operations={[
            {
              expression: String.raw`R=\text{decompose}(\text{reference})`,
              annotation: ["reference 정답을 LLM으로", "개별 claim 단위로 분해"],
            },
            {
              expression: String.raw`\text{attributable}(r,c(q))`,
              annotation: ["각 claim r이 검색된 context에서", "지지되는지 판정"],
            },
            {
              expression: String.raw`CR=|\{\text{attributable}\}|/|R|`,
              annotation: ["지지되는 claim 수를", "전체 claim 수로 나눔"],
            },
          ]}
          terms={[
            { symbol: "R", name: "Reference claims", description: "reference 정답을 분해한 개별 claim 전체입니다." },
            { symbol: "c(q)", name: "Retrieved context", description: "질문 q에 대해 검색된 context입니다." },
          ]}
          assumptions={[
            "Reference 정답이 있어야 계산할 수 있어 순수 reference-free 지표는 아닙니다.",
            "Claim 분해 세밀도에 따라 같은 context라도 recall 값이 달라질 수 있습니다.",
          ]}
          interpretation="Reference에서 뽑은 claim 3개 중 2개만 검색 context에서 지지되면 context recall은 0.67입니다."
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Context relevance라는 이름의 지표도 있지만, 이 글에서는 noise·dilution 관점에서 이미
            다룬{" "}
            <Link to="/ai/context-window-optimization#relevance">
              context relevance degradation
            </Link>
            과 같은 대상을 가리키므로 그 글을 정본으로 둡니다.
          </p>
          <p>
            Citation accuracy(생성된 인용이 실제로 그 문장을 지지하는 비율)도{" "}
            <Link to="/ai/rag-pipeline#evaluation">
              RAG 파이프라인의 citation support metric
            </Link>
            이 이미 정의합니다. 그 글의 예시로는 citation 5개 중 valid 4개면 precision 0.8입니다.
          </p>
        </div>
      </section>

      <section id="failure-taxonomy" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          실패는 retrieval·ranking·generation 세 stage 중 하나로 귀속됩니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            같은 &apos;틀린 답&apos;도 원인이 다르면 고칠 곳이 다릅니다. Retrieval failure는 정답
            문서가 corpus에 있어도 애초에 candidate로 회수되지 않은 경우이고, ranking failure는
            candidate에는 있었지만 top-k 안에 들지 못한 경우이며, generation failure는 정답
            evidence가 최종 context에 들어갔는데도 model이 이를 답변에 반영하지 못한 경우입니다.
          </p>
          <p>
            질문 100개 중 42개가 실패했다면, retrieval failure 12개·ranking failure 18개·
            generation failure 12개로 나눌 수 있습니다. Ranking failure 비중이 가장 크면 reranker
            재학습이나 top-k 조정이 먼저 손댈 곳입니다.
          </p>
          <p>
            이 세 층을 순서대로 지나가는 진단 자체는{" "}
            <Link to="/ai/rag-pipeline#overview">RAG 파이프라인의 stage-success trace</Link>가
            이미 정의합니다. 그 trace가 source=1, retrieve=1, context=0, support=0처럼 indicator
            0/1을 남기면, 이 taxonomy가 첫 실패 indicator를 세 failure 이름 중 하나로 번역합니다.
            실패를 특정 stage 담당자에게 배정하는 error attribution도 같은 trace의
            결과물입니다.
          </p>
        </div>
        <TermBreakdown
          title="세 failure의 신호와 고칠 대상"
          description="같은 최종 실패도 어느 stage에서 끊겼는지에 따라 고쳐야 할 component가 다릅니다."
          items={[
            {
              term: "Retrieval failure",
              description: "정답 문서가 candidate set에 아예 없는 경우입니다.",
              example: "BM25·dense 후보 모두에서 corpus 내 정답 문서가 회수되지 않음",
              boundary: "Corpus 자체에 문서가 없으면 이 failure가 아니라 ingestion 문제입니다.",
            },
            {
              term: "Ranking failure",
              description: "Candidate에는 있었지만 순위가 밀려 top-k 밖으로 나간 경우입니다.",
              example: "정답 문서가 candidate 45위, top-8만 통과",
              boundary: "Candidate recall ceiling이 이미 낮으면 ranking을 고쳐도 복구되지 않습니다.",
            },
            {
              term: "Generation failure",
              description: "정답 evidence가 최종 context 안에 있는데도 model이 답변에 반영하지 못한 경우입니다.",
              example: "Context 안 정답 chunk가 가운데 위치해 lost-in-the-middle로 무시됨",
              boundary: "Groundedness 점수가 낮다고 항상 이 failure는 아니며, context 자체가 부족했을 수도 있습니다.",
            },
          ]}
        />
      </section>

      <section id="ablation-oracle" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Ablation·oracle 비교가 RAG 기여도와 retriever 여유를 보여줍니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Retrieval ablation은 retrieval 단계를 완전히 끄고 순수 parametric LM 성능과 비교해
            RAG 전체가 실제로 얼마나 기여하는지를 분리하는 실험입니다. Oracle retrieval은 반대로
            실제 retriever 대신 정답이 포함된 것으로 알려진 이상적 context를 강제로 넣어
            generator 쪽 성능의 상한을 잽니다.
          </p>
          <p>
            Lewis et al.(2020)은 Natural Questions에서 retrieval 없는 closed-book T5-11B+SSM이
            EM 36.6%인 반면, retrieval을 더한 RAG-Sequence는 44.5%를 기록했다고 보고합니다. 이
            약 8%p 차이가 retrieval ablation이 보여주는 RAG의 실제 기여분입니다.
          </p>
          <p>
            Ju et al.(2025)의 CRUX benchmark는 정답 요약에 필요한 최소 passage 집합을 oracle
            retrieval로 정의합니다. CRUX-DUC에서 oracle은 정의상 회수율 100%로 최종 결과
            coverage 64.6%를 만드는 반면, 실제 최선의 방법(LSR+RankFirst)은 회수율 53.6%로 최종
            coverage 44.3%에 그쳐 20%p 이상의 격차가 남습니다.
          </p>
          <p>
            이 oracle과 실제 retriever의 성능 차이를 retriever upper bound라고 부릅니다. 격차가
            크면 reranker·query rewriting 개선의 여지가 아직 많다는 뜻이고, 격차가 이미 작다면
            다음 개선은 retrieval이 아니라 generation 쪽에 있다는 신호입니다.
          </p>
          <p>
            더 좁은 범위에서 첫 단계 candidate 자체의 상한은{" "}
            <Link to="/ai/retrieval-ranking-funnel#retrieval">
              candidate-recall ceiling
            </Link>
            이 이미 다룹니다. Retriever upper bound는 funnel 전체가 만든 최종 answer 품질 기준의
            더 넓은 상한입니다.
          </p>
        </div>
      </section>

      <section id="pipeline" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Hallucination evaluation은 개별 fabrication을 사례로 짚어냅니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Groundedness가 지지 비율을 연속값 하나로 요약한다면, hallucination evaluation은 그
            안에서 실제로 근거 없는 개별 주장을 찾아 사례로 남깁니다. 같은 groundedness=0.8이라도
            놓친 20%가 사소한 부연 설명인지, 존재하지 않는 통계 수치를 지어낸 것인지는 다른
            문제입니다.
          </p>
          <p>
            판정은 대개 <Link to="/ai/llm-as-a-judge#problem">LLM-as-a-judge</Link>로 하되,
            context와 외부 world knowledge 어디에서도 확인되지 않는 주장만 hallucination으로
            표시하고, context엔 없지만 널리 알려진 사실은 별도로 분류해 과도한 오탐을 줄입니다.
          </p>
        </div>
        <AlgorithmBlock
          title="End-to-end RAG 평가 파이프라인"
          input={[
            "질문 q",
            "검색된 candidate set",
            "조립된 context c(q)",
            "생성된 답변 a",
            "reference 정답(있는 경우)",
          ]}
          steps={[
            {
              code: "cp, cr = context_precision(c(q)), context_recall(c(q), reference)",
              note: "Retrieval 단계 지표부터 계산합니다 — context 자체가 relevant 하고 빠짐없는지.",
            },
            {
              code: "g, ar = groundedness(a, c(q)), answer_relevance(a, q)",
              note: "Generation 단계 지표를 계산합니다 — 답변이 context에 근거하고 질문에 답하는지.",
            },
            {
              code: "halluc = hallucination_evaluation(a, c(q))",
              note: "Groundedness가 낮춘 주장 중 실제 fabrication만 사례로 분리합니다.",
            },
            {
              code: "stage = attribute_failure(cp, cr, g, ar)",
              note: "값이 낮은 첫 지표를 retrieval·ranking·generation failure 중 하나로 귀속합니다 — error attribution.",
            },
          ]}
          output="Stage별 점수, 첫 실패 stage, 그 stage 담당자에게 배정할 regression 사례"
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            이 파이프라인이 매 request마다 남기는 stage별 점수와 담당자 배정 자체는{" "}
            <Link to="/ai/rag-pipeline#evaluation">RAG 파이프라인의 layered evaluation</Link>이
            정본입니다.
          </p>
          <p>
            사실을 entity·relation graph로 미리 구조화하는{" "}
            <Link to="/ai/knowledge-graph-construction#problem">knowledge graph</Link> 자체는
            별도 글이 정본이고, 그 그래프를 query 시점 검색에 쓰는 GraphRAG provenance 경계는{" "}
            <Link to="/ai/retrieval-ranking-funnel#retrieval">
              retrieval ranking funnel의 graph-structured retrieval boundary
            </Link>
            에서 다룹니다.
          </p>
        </div>
      </section>

      <section id="sources" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">근거 문서</h2>
        <div id="paper-ragas" className="not-prose mt-8 scroll-mt-24">
          <CitationBlock
            type="paper"
            citeKey={1}
            source="Es et al. · RAGAS: Automated Evaluation of Retrieval Augmented Generation"
            href="https://arxiv.org/abs/2309.15217"
          >
            Reference 없이 LLM으로 faithfulness·answer relevance·context relevance 세 지표를
            계산하는 방법을 제안하고 WikiEval에서 사람 판정과의 일치율(95%·78%·70%)을
            보고합니다. Context precision·recall이라는 이름은 이 논문에 없으며, 이후 RAGAS
            공식 문서가 별도로 추가했습니다.
          </CitationBlock>
        </div>
        <div id="paper-ragas-precision" className="not-prose mt-8 scroll-mt-24">
          <CitationBlock
            type="paper"
            citeKey={2}
            source="RAGAS 공식 문서 · Context Precision"
            href="https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/context_precision/"
          >
            순위 k까지의 precision을 relevant 위치에서만 가중해 합산하는 계산식과 LLM 기반·
            non-LLM(문자열 유사도) 두 변형을 정의합니다. 라이브러리 버전에 따라 세부 구현이
            바뀔 수 있습니다.
          </CitationBlock>
        </div>
        <div id="paper-ragas-recall" className="not-prose mt-8 scroll-mt-24">
          <CitationBlock
            type="paper"
            citeKey={3}
            source="RAGAS 공식 문서 · Context Recall"
            href="https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/context_recall/"
          >
            Reference 답변을 claim으로 분해해 각 claim이 검색된 context에서 지지되는지 판정하고
            그 비율을 recall로 정의합니다. Reference가 있어야 계산 가능해 reference-free는
            아닙니다.
          </CitationBlock>
        </div>
        <div id="paper-rag-original" className="not-prose mt-8 scroll-mt-24">
          <CitationBlock
            type="paper"
            citeKey={4}
            source="Lewis et al. · Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks"
            href="https://arxiv.org/abs/2005.11401"
          >
            Wikipedia dense index를 결합한 RAG-Sequence·RAG-Token이 retrieval 없는 closed-book
            T5-11B+SSM보다 Natural Questions·TriviaQA·WebQuestions에서 큰 폭으로 앞선다는 결과를
            보고합니다. 이 글은 그 격차를 retrieval ablation의 예시로 재사용하며, 모든 model·
            corpus에서 같은 폭의 격차를 보장한다는 뜻은 아닙니다.
          </CitationBlock>
        </div>
        <div id="paper-crux" className="not-prose mt-8 scroll-mt-24">
          <CitationBlock
            type="paper"
            citeKey={5}
            source="Ju et al. · Controlled Retrieval-augmented Context Evaluation for Long-form RAG"
            href="https://arxiv.org/abs/2506.20051"
          >
            정답 요약에 필요한 최소 passage 집합을 oracle retrieval(Z*)로 정의하고, CRUX-DUC·
            Multi-News에서 oracle 대비 실제 방법들의 coverage 격차를 측정합니다. 두 데이터셋
            모두 요약 task 범위이며 모든 RAG task에 같은 격차 크기를 일반화하지 않습니다.
          </CitationBlock>
        </div>
      </section>
    </div>
  );
}

import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import { EmbeddingEvaluationViz } from "../sentence-embeddings/viz/ModernSentenceEmbeddingViz";

export default function EmbeddingEvaluationArticle() {
  return <div className="space-y-16">
    <section id="overview" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Embedding 평가는 model score보다 먼저 “무엇을 정답이라 부를지”를 고정합니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert"><p className="text-lg leading-8">
            한 query에 답이 되는 문서는 하나가 아닐 수 있습니다. 같은 규정을 설명하는 원문·FAQ·절차서가 모두 relevant일 수 있고 corpus가 바뀌면 document
            ID와 정답 집합도 달라집니다. 이 상태에서 single-positive label만 쓰면 실제 정답을 negative로 채점할 수 있습니다.
          </p></div>
      <TermBreakdown title="Metric 전에 만드는 평가 장부" items={[
        { term: "Corpus snapshot", description: "평가 query가 검색할 수 있는 문서와 chunk의 고정 revision입니다." },
        { term: "Relevant set", description: "Query마다 정답으로 인정한 document 전체와 relevance grade입니다." },
        { term: "Label snapshot", description: "Corpus revision·annotator rule·positive IDs·판정 시각을 묶은 평가 artifact입니다.", boundary: "Unlabeled를 확정 negative로 간주하지 않습니다." },
        { term: "Required slice", description: "한국어·장문·domain·query style처럼 평균으로 상쇄하면 안 되는 배포 조건입니다." },
      ]} />
      <EmbeddingEvaluationViz />
      <ContentBoundary article="embedding-evaluation" />
    </section>

    <section id="labels" className="scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">Multi-positive label은 정답이 여러 개인 현실을 보존합니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert"><p>Query “연차는 며칠인가?”에 정책 원문 A와 직원 FAQ B가 모두 답을 포함한다면 relevant set은 {`{A,B}`}입니다. A만 positive로 두고 B를 hard negative로 학습하거나 평가하면 model이 유용한 문서를 올린 일을 오답으로 셉니다.</p><p>
            corpus revision, query definition, positive IDs, relevance grade, annotator agreement와 unresolved
            case는 label snapshot에 남깁니다. 새 문서가 들어온 뒤에는 예전 metric과 직접 비교하지 않고 새 generation으로 다시 채점합니다.
          </p></div>
    </section>

    <section id="metrics" className="scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">Recall은 정답 coverage를, NDCG는 중요한 정답의 위치를 봅니다</h2>
      <ExplainedFormula question="Relevant 문서가 여러 개일 때 top-k 결과를 어떻게 두 축으로 읽나요?" idea={<p>
            Recall은 relevant set 중 top-k 안에 들어온 비율입니다. NDCG는 각 문서의 relevance gain을 rank가 내려갈수록 할인해 더한 뒤 가능한
            이상적 순서의 값으로 나눕니다.
          </p>} formula={String.raw`\operatorname{Recall@}k=|\mathcal R_q\cap C_k(q)|/|\mathcal R_q|,\quad \operatorname{NDCG@}k=\operatorname{DCG@}k/\operatorname{IDCG@}k`} annotatedFormula={String.raw`\begin{aligned}n_{\rm hit}&=\underbrace{|\mathcal R_q\cap C_k(q)|}_{\text{top-k의 정답 수}}\\\operatorname{Recall@}k&=\underbrace{n_{\rm hit}/|\mathcal R_q|}_{\text{전체 정답 중 찾은 비율}}\\g_i&=\underbrace{2^{r_i}-1}_{\text{grade를 gain으로 변환}}\\w_i&=\underbrace{1/\log_2(i+1)}_{\text{낮은 rank를 할인}}\\\operatorname{DCG@}k&=\underbrace{\sum_{i=1}^{k}g_iw_i}_{\text{할인 gain을 누적}}\\\operatorname{NDCG@}k&=\underbrace{\operatorname{DCG@}k/\operatorname{IDCG@}k}_{\text{이상적 순서로 정규화}}\end{aligned}`} operations={[
        { expression: String.raw`|\mathcal R_q\cap C_k(q)|`, annotation: ["정답 집합과 top-k를 교차해", "찾아낸 relevant 문서 수를 셈"] },
        { expression: String.raw`|\mathcal R_q\cap C_k|/|\mathcal R_q|`, annotation: ["찾은 수를 전체 정답 수로 나눠", "query마다 다른 정답 개수를 정규화"] },
        { expression: String.raw`2^{r_i}-1`, annotation: ["높은 relevance grade 차이를 키워", "중요 문서의 gain을 표현"] },
        { expression: String.raw`1/\log_2(i+1)`, annotation: ["rank가 내려갈수록 작은 가중치를 곱해", "위쪽 결과를 더 크게 보상"] },
        { expression: String.raw`\operatorname{DCG}/\operatorname{IDCG}`, annotation: ["관측 순위 점수를 최선 순위 점수로 나눠", "query별 난이도를 0--1 범위로 비교"] },
      ]} terms={[
        { symbol: String.raw`\mathcal R_q`, name: "Relevant set", description: "Query q의 모든 labeled positive입니다." },
        { symbol: String.raw`C_k(q)`, name: "Top-k candidates", description: "Retriever가 반환한 첫 k개 문서입니다." },
        { symbol: String.raw`r_i`, name: "Relevance grade", description: "i번째 결과의 graded relevance입니다." },
        { symbol: "IDCG", name: "Ideal DCG", description: "같은 labels를 가장 좋은 순서로 놓았을 때의 DCG입니다." },
      ]} assumptions={["Metric convention·tie rule·IDCG=0 처리와 k를 고정합니다.", "Labels와 candidates가 같은 corpus snapshot을 참조합니다.", "Unlabeled 문서를 확정 negative로 해석하지 않습니다."]} interpretation="Relevant 4개 중 top-10에 3개면 Recall@10=.75입니다. 같은 세 문서라도 grade 3 문서가 1위인지 10위인지에 따라 NDCG는 달라집니다." />
      <div id="paper-mteb" className="not-prose mt-8 scroll-mt-24"><CitationBlock type="paper" citeKey={1} source="Muennighoff et al. — MTEB" href="https://arxiv.org/abs/2210.07316">Retrieval·STS·classification·clustering·reranking 등 다양한 task에서 text embedding을 비교한 benchmark입니다. Leaderboard 평균이 특정 서비스 corpus·언어·latency를 대신하지는 않습니다.</CitationBlock></div>
    </section>

    <section id="release" className="scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">Required slice를 통과한 뒤 품질·latency·memory·storage의 frontier를 고릅니다</h2>
      <ExplainedFormula question="점수가 높은 model이 더 느리고 큰 경우 어떤 후보를 release하나요?" idea={<p>
            필수 slice threshold를 모두 통과한 후보만 feasible set에 넣습니다. 그 안에서 품질은 더 높고 비용은 더 낮은 후보가 다른 후보를 지배하면 열등 후보를
            제거합니다.
          </p>} formula={String.raw`\mathcal F=\{m:Q_s(m)\ge\tau_s\ \forall s\},\quad m_a\succ m_b\iff Q_a\ge Q_b\land C_a\le C_b`} annotatedFormula={String.raw`\begin{aligned}g_s(m)&=\underbrace{\mathbf 1[Q_s(m)\ge\tau_s]}_{\text{slice s의 gate}}\\\mathcal F&=\underbrace{\{m:\prod_s g_s(m)=1\}}_{\text{모든 slice 통과}}\\g_Q&=\underbrace{\mathbf 1[Q_a\ge Q_b]}_{\text{품질이 낮지 않음}}\\g_C&=\underbrace{\mathbf 1[C_a\le C_b]}_{\text{비용이 크지 않음}}\\g_Q^+&=\underbrace{\mathbf 1[Q_a>Q_b]}_{\text{품질의 엄격한 개선}}\\g_C^+&=\underbrace{\mathbf 1[C_a<C_b]}_{\text{비용의 엄격한 개선}}\\g_+&=\underbrace{\max(g_Q^+,g_C^+)}_{\text{한 축 이상 개선}}\\m_a\succ m_b&\Longleftrightarrow\underbrace{g_Qg_Cg_+=1}_{\text{세 조건을 모두 충족}}\end{aligned}`} operations={[
        { expression: String.raw`Q_s(m)\ge\tau_s\ \forall s`, annotation: ["각 필수 slice 점수를 개별 threshold와 비교해", "평균이 약한 slice를 숨기지 못하게 함"] },
        { expression: String.raw`Q_a\ge Q_b`, annotation: ["같은 corpus·labels에서 품질을 비교해", "더 낮은 품질 후보를 제거할 근거 생성"] },
        { expression: String.raw`C_a\le C_b`, annotation: ["p95·memory·index size를 같은 단위로 비교해", "운영 비용이 더 큰 후보를 식별"] },
        { expression: String.raw`(Q_a>Q_b)\lor(C_a<C_b)`, annotation: ["최소 한 축의 엄격한 개선을 요구해", "완전히 같은 후보를 지배로 오판하지 않음"] },
      ]} terms={[
        { symbol: String.raw`Q_s`, name: "Slice quality", description: "Required slice s의 Recall·NDCG 등 합의한 품질입니다." },
        { symbol: String.raw`\tau_s`, name: "Release threshold", description: "Test를 보기 전에 정한 slice별 최소값입니다." },
        { symbol: "C(m)", name: "Serving cost vector", description: "p95 latency·runtime memory·actual index size·update time입니다." },
        { symbol: String.raw`\succ`, name: "Pareto dominance", description: "한 후보가 품질은 낮지 않고 비용은 크지 않으며 한 축 이상 더 나은 관계입니다." },
      ]} assumptions={["모든 후보는 같은 corpus·label snapshot·ANN setting·hardware·concurrency로 측정합니다.", "Validation에서 threshold와 후보를 고르고 untouched test는 마지막 보고에 한 번 사용합니다.", "Privacy·safety·license는 품질과 상쇄하지 않는 별도 gate입니다."]} interpretation="A가 NDCG .62·p95 8ms·20GB, B가 .61·10ms·25GB면 A가 B를 지배합니다. C가 .64·14ms·18GB면 A와 C는 서로 다른 trade-off로 남습니다." />
    </section>
  </div>;
}

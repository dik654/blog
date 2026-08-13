import ExplainedFormula from "@/components/ui/explained-formula";
import EvalBenchViz from "./viz/EvalBenchViz";

export default function Evaluation() {
  return <section id="evaluation" className="mb-16 scroll-mt-20">
    <h2 className="mb-6 text-2xl font-bold">평가는 leaderboard 평균이 아니라 정답 집합·순위·slice·운영 비용을 같은 조건에서 재현합니다</h2>
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <p>MTEB는 retrieval·semantic textual similarity(STS)·classification·clustering·reranking 등 서로 다른 embedding task를 한 framework에서 비교하는 출발점입니다. 그러나 task 평균은 서비스의 한국어 비율·짧은 사실 질문·분석형 query·긴 document·최신 corpus를 대표하지 않으므로 실제 traffic에서 분리한 domain evaluation을 반드시 둡니다.</p>
      <p>Retrieval label은 query당 하나만 있다고 가정하지 않습니다. 여러 문서가 답이면 relevant set 전체를 보존하고, source document와 near-duplicate가 split을 넘지 않게 합니다. Recall은 정답을 후보에 포함했는지, NDCG는 relevance grade가 높은 문서를 위에 두었는지 측정합니다.</p>
    </div>
    <ExplainedFormula
      question="Query마다 정답이 여러 개일 때 Recall@k와 NDCG@k는 각각 무엇을 측정할까요?"
      idea={<>Recall은 top-k에 들어온 relevant 문서 수를 전체 relevant 수로 나눕니다. NDCG는 높은 relevance grade를 앞 순위에 둘수록 크게 주고, 같은 label set에서 가능한 이상적 DCG로 나누어 0~1 scale로 만듭니다.</>}
      formula={String.raw`\operatorname{Recall@}k(q)=\frac{|\mathcal R_q\cap \operatorname{Top}_k(q)|}{|\mathcal R_q|},\qquad \operatorname{NDCG@}k(q)=\frac{\sum_{r=1}^{k}\frac{2^{\mathrm{rel}_r}-1}{\log_2(r+1)}}{\operatorname{IDCG@}k(q)}`}
      terms={[
        { symbol: "R_q", name: "relevant set", description: "Query q에 대해 정답으로 인정되는 모든 문서 ID 집합입니다." },
        { symbol: "Top_k(q)", name: "retrieved top-k", description: "현재 retriever가 높은 score 순으로 반환한 k개 문서입니다." },
        { symbol: "rel_r", name: "graded relevance", description: "순위 r 문서의 0·1 또는 다단계 relevance label입니다." },
        { symbol: "IDCG", name: "ideal DCG", description: "같은 relevance labels를 가장 좋은 순서로 놓았을 때의 DCG입니다." },
      ]}
      assumptions={["Query별 모든 known positive를 보존하고 unlabeled를 확정 negative로 과해석하지 않습니다.", "NDCG gain function과 log discount convention·tie handling을 고정합니다.", "Relevant set이 비거나 IDCG=0인 query의 포함 규칙을 평가 protocol에 명시합니다."]}
      interpretation="정답 4개 중 top-10에 3개가 있으면 Recall@10=.75입니다. 세 문서가 모두 있어도 가장 중요한 문서를 뒤에 두면 NDCG는 낮아질 수 있으므로 candidate coverage와 ranking quality를 분리해 봅니다."
    />
    <div className="not-prose my-8"><EvalBenchViz /></div>
    <ExplainedFormula
      question="품질이 비슷한 embedding 후보를 serving 비용까지 포함해 어떻게 비교할까요?"
      idea={<>후보 a가 다른 후보 b보다 품질은 낮지 않고 latency·memory·storage는 크지 않으며 적어도 하나는 더 좋다면 b는 지배당합니다. 남은 Pareto 후보에서 제품 제약으로 고릅니다.</>}
      formula={String.raw`a\succ b\iff Q_a\ge Q_b,\;L_a\le L_b,\;R_a\le R_b,\;S_a\le S_b\quad\text{and at least one strict}`}
      terms={[
        { symbol: "Q", name: "quality vector or gated score", description: "Domain Recall/NDCG·worst slice 등 배포에 필요한 품질 기준입니다." },
        { symbol: "L", name: "latency", description: "같은 hardware·batch·precision에서 측정한 p95 query encoding+search latency입니다." },
        { symbol: "R", name: "runtime resources", description: "Peak accelerator/CPU memory와 throughput capacity입니다." },
        { symbol: "S", name: "index storage", description: "Vector·ANN structure·metadata·replica를 포함한 실제 저장량입니다." },
      ]}
      assumptions={["Corpus snapshot·index settings·hardware·batch·precision·warmup·load를 동일하게 맞춥니다.", "Quality를 scalar 평균 하나로 합치기 전에 필수 language/domain slice minimum을 통과시킵니다.", "Offline latency가 production concurrency·update cost를 완전히 대표하지 않으므로 canary 측정이 필요합니다."]}
      interpretation="MTEB 평균 1점 상승만 보고 dimension·latency가 몇 배 큰 model을 고르지 않습니다. 반대로 작은 비용 차이로 critical slice가 크게 좋아지면 Pareto 후보로 남아 제품 제약에서 선택할 수 있습니다."
    />
    <div id="paper-mteb" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
      <p className="text-xs font-bold text-primary">논문 읽기 · MTEB</p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">Muennighoff 등은 여러 embedding task와 dataset을 공통 API·metric으로 평가하는 MTEB를 제안했습니다. Benchmark 평균은 포함된 task·language·dataset snapshot의 집계이며 특정 서비스의 query distribution, corpus freshness와 system cost를 대신하지 않습니다.</p>
      <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://arxiv.org/abs/2210.07316" target="_blank" rel="noreferrer">Task taxonomy와 benchmark 범위 보기</a>
    </div>
  </section>;
}

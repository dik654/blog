import ExplainedFormula from "@/components/ui/explained-formula";
import EvalViz from "./viz/EvalViz";

export default function Eval() {
  return (
    <section id="evaluation" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">RAG 평가는 답변 점수 하나가 아니라 retrieval·context·answer·citation·system을 같은 query trace에서 따로 측정합니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p><strong>Recall@k</strong>는 필요한 문서 가운데 top-k가 몇 개를 회수했는지 봅니다. <strong>NDCG@k</strong>는 관련성이 높은 문서를 앞에 배치했는지 평가하며, 높은 순위에 더 큰 가치를 주고 이상적인 순서의 DCG로 나눠 0과 1 사이로 정규화합니다. Candidate recall이 낮으면 generation 실험을 멈추고 retrieval부터 고칩니다.</p>
      </div>
      <ExplainedFormula
        question="한 질문에 정답 문서가 여러 개일 때 top-k가 얼마나 회수했는지 어떻게 계산할까요?"
        idea={<>정답 문서 집합과 검색된 top-k의 교집합을 전체 정답 수로 나눕니다. 하나만 gold로 두면 다른 정답 문서를 false negative로 잘못 셀 수 있습니다.</>}
        formula={String.raw`\operatorname{Recall@k}(q)=\frac{|R_q\cap C_{q,k}|}{|R_q|}`}
        terms={[
          { symbol: "R_q", name: "relevant set", description: "질문 q를 뒷받침하는 모든 label 문서입니다." },
          { symbol: "C_q,k", name: "top-k candidates", description: "Retriever가 k위까지 반환한 문서 집합입니다." },
          { symbol: "|·|", name: "set size", description: "중복을 제거한 원소 수입니다." },
        ]}
        assumptions={["Relevance label과 retrieval corpus가 같은 revision입니다.", "Query별 여러 positive를 보존하며 ACL 밖 문서는 정답 집합에서도 제외합니다.", "Recall은 순서와 문서 내용의 충분성을 직접 평가하지 않습니다."]}
        interpretation="정답 문서가 4개이고 top-10에 3개가 있으면 Recall@10은 0.75입니다. 첫 번째에 3개가 몰려 있든 뒤에 있든 이 값은 같으므로 순서는 NDCG로 따로 봅니다."
      />
      <div id="reading-ndcg" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">평가 정본 · Cumulated Gain-based Evaluation</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Järvelin과 Kekäläinen은 binary relevant 여부를 넘어 graded relevance와 결과 순위를 함께 반영하는 cumulative gain 계열을 제안했습니다. NDCG는 ideal ordering으로 정규화해 query별 scale을 맞추지만, label의 완전성·사용자 행동·online utility까지 자동으로 보장하지는 않습니다.</p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://doi.org/10.1145/582415.582418" target="_blank" rel="noreferrer">Gain·discount·normalization의 원 연구 보기</a>
      </div>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>Context 단계에서는 answer-span coverage와 불필요한 문맥 비율을 보고, answer 단계에서는 정확성·근거 일치(faithfulness)·no-answer 거절을 분리합니다. Citation은 링크가 있다는 사실이 아니라, 인용된 source가 실제 주장을 지지하는지와 필요한 주장에 인용이 빠지지 않았는지를 봅니다.</p>
      </div>
      <ExplainedFormula
        question="인용이 많다는 사실과 인용이 정확하고 빠짐없다는 사실을 어떻게 구분할까요?"
        idea={<>답변을 검증 가능한 atomic claim으로 나누고 각 citation의 support를 판정합니다. Precision은 붙인 인용 중 맞는 비율이고, recall은 근거가 필요한 주장 중 올바른 인용이 연결된 비율입니다.</>}
        formula={String.raw`P_{\mathrm{cite}}=\frac{|E_{\mathrm{valid}}|}{|E_{\mathrm{all}}|},\qquad R_{\mathrm{cite}}=\frac{|U_{\mathrm{supported}}|}{|U_{\mathrm{verifiable}}|}`}
        terms={[
          { symbol: "E_all", name: "all citation links", description: "답변이 주장에 연결한 모든 citation입니다." },
          { symbol: "E_valid", name: "valid support links", description: "Source가 해당 주장을 실제로 뒷받침하고 revision·ACL도 유효한 citation입니다." },
          { symbol: "U_verifiable", name: "verifiable claims", description: "외부 근거가 필요한 atomic claim 집합입니다." },
          { symbol: "U_supported", name: "supported claims", description: "하나 이상의 올바른 citation이 연결된 claim입니다." },
        ]}
        assumptions={["Claim segmentation과 entailment rubric을 사전에 고정하고 human audit 표본을 둡니다.", "같은 잘못된 citation을 여러 번 붙여도 valid support가 되지 않습니다.", "Citation precision·recall은 답변의 완전한 유용성·문체·안전성을 대신하지 않습니다."]}
        interpretation="인용 5개 중 4개가 주장을 지지하면 precision은 0.8입니다. 근거가 필요한 주장 6개 중 3개만 올바르게 연결됐다면 recall은 0.5이므로 인용은 대체로 맞지만 많이 빠진 답입니다."
      />
      <div className="not-prose my-8"><EvalViz /></div>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>평가셋에는 factoid뿐 아니라 multi-hop·no-answer·stale source·conflicting source·ACL·prompt injection을 넣습니다. LLM-as-judge는 빠른 rubric evaluator지만 judge·prompt·순서에 민감하므로 deterministic ID/span 검사와 blind human audit를 함께 둡니다. Source·parser·embedding·index·retriever·prompt·model version을 trace에 남겨 회귀가 시작된 stage를 찾습니다.</p>
      </div>
      <div id="reading-ragas" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">평가 논문 · Ragas</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Ragas는 RAG를 retrieval context와 LLM generation으로 나누고, ground-truth annotation에만 의존하지 않는 자동 평가 metric 묶음을 제안했습니다. 핵심은 여러 failure dimension을 분리한 점이며, reference-free evaluator가 사람 판정과 언제나 일치하거나 security·ACL·latency를 대신한다는 뜻은 아닙니다.</p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://arxiv.org/abs/2309.15217" target="_blank" rel="noreferrer">Metric 설계와 평가 범위 보기</a>
      </div>
    </section>
  );
}

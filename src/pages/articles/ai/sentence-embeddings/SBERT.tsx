import ExplainedFormula from "@/components/ui/explained-formula";
import SBERTArchViz from "./viz/SBERTArchViz";

export default function SBERT() {
  return <section id="sbert" className="mb-16 scroll-mt-20">
    <h2 className="mb-6 text-2xl font-bold">SBERT의 핵심은 문서 표현을 query와 독립적으로 계산할 수 있게 만든 것입니다</h2>
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <p>Cross-encoder는 query와 document token을 한 sequence에 넣기 때문에 모든 token이 서로 상호작용할 수 있습니다. 정교한 pair score를 만들 수 있지만 query가 바뀔 때마다 corpus 문서를 다시 읽어야 합니다. Bi-encoder는 query와 document를 각각 encode해 vector로 비교하므로 문서 vector를 offline에서 한 번 계산해 index에 저장할 수 있습니다.</p>
      <p>SBERT는 shared BERT encoder와 pooling을 siamese 또는 triplet 구조로 학습해 이 독립 vector가 semantic relation을 보존하도록 했습니다. NLI classification·STS regression·triplet objective는 서로 다른 supervision이므로 checkpoint의 pooling·normalization·training relation을 함께 확인해야 합니다.</p>
    </div>
    <div className="not-prose my-8"><SBERTArchViz /></div>
    <ExplainedFormula
      question="Corpus 문서가 M개일 때 cross-encoder와 bi-encoder의 online 계산 구조는 어떻게 다를까요?"
      idea={<>Cross-encoder는 새 query마다 M개의 query-document pair forward가 필요합니다. Bi-encoder는 문서 M개를 미리 encode하고, online에서는 query forward 한 번과 저장된 vector M개에 대한 similarity search를 수행합니다.</>}
      formula={String.raw`\begin{aligned}
C_{\mathrm{cross}}(q)
&=\sum_{j=1}^{M}C_{\mathrm{pair}}(q,d_j)\\
C_{\mathrm{bi}}(q)
&=C_q+C_{\mathrm{ANN}}(\mathbf z_q,\{\mathbf z_{d_j}\})
\end{aligned}`}
      terms={[
        { symbol: "M", name: "corpus size", description: "검색 대상 문서 또는 chunk의 총개수입니다." },
        { symbol: "C_pair", name: "pair-forward cost", description: "Query와 한 document를 함께 넣는 cross-encoder 한 번의 비용입니다." },
        { symbol: "C_q", name: "query-encoding cost", description: "새 query를 embedding 하나로 만드는 online encoder 비용입니다." },
        { symbol: "C_ANN", name: "vector-search cost", description: "Approximate nearest-neighbor index에서 가까운 문서 vector를 찾는 비용입니다." },
      ]}
      assumptions={["Document embedding 계산과 index build 비용은 offline으로 분리했습니다.", "ANN cost는 index type·dimension·recall setting·hardware에 따라 달라져 O(1)로 간주할 수 없습니다.", "Cross-encoder와 bi-encoder는 interaction capacity가 달라 같은 품질을 보장하지 않습니다."]}
      interpretation="Bi-encoder의 장점은 Transformer가 빨라진 것이 아니라 document-side 계산을 query 사이에서 재사용한다는 점입니다. 그래서 대규모 corpus 후보 검색에 쓰고 cross-encoder는 상위 후보만 다시 읽는 방식이 자연스럽습니다."
    />
    <ExplainedFormula
      question="1단계 bi-encoder가 정답을 놓치면 2단계 reranker가 복구할 수 있을까요?"
      idea={<>Reranker는 candidate set Ck(q)에 들어온 문서만 순서를 바꿀 수 있습니다. 따라서 최종 top-k relevant 수는 candidate set이 포함한 relevant 수를 넘지 못합니다.</>}
      formula={String.raw`\begin{aligned}
\mathcal R_q\cap C_k(q)&=\varnothing\\
\Longrightarrow\quad
\mathcal R_q\cap \operatorname{Rerank}(C_k(q))&=\varnothing
\end{aligned}`}
      terms={[
        { symbol: "R_q", name: "relevant set", description: "Query q에 대해 label상 정답으로 인정되는 모든 문서 집합입니다." },
        { symbol: "C_k(q)", name: "candidate set", description: "Bi-encoder가 corpus에서 먼저 가져온 k개 문서입니다." },
        { symbol: "Rerank", name: "second-stage reranker", description: "Candidate 내부의 pair score를 다시 계산해 순서를 바꾸는 함수입니다." },
      ]}
      assumptions={["Reranker는 candidate 밖의 corpus를 새로 검색하지 않습니다.", "Query당 여러 positive가 있으면 relevant set 전체를 label에 보존합니다.", "Generation model이 외부 지식으로 답을 맞힐 수 있어도 retrieval groundedness 관점에서는 누락으로 봅니다."]}
      interpretation="Reranker NDCG를 높이기 전에 candidate Recall@k가 충분한지 확인해야 합니다. k를 키우면 recall은 오를 수 있지만 reranking latency와 context selection 비용도 늘어납니다."
    />
    <div id="paper-sbert" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
      <p className="text-xs font-bold text-primary">논문 읽기 · Sentence-BERT</p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">Reimers와 Gurevych는 BERT pair scoring의 조합 비용을 문제로 두고 siamese·triplet network로 독립 sentence embedding을 학습했습니다. 논문의 STS·transfer 결과와 10,000문장 비교 예시는 당시 BERT/SBERT·hardware·task 조건의 측정이며 모든 현대 ANN system의 고정 speedup 비율은 아닙니다.</p>
      <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://aclanthology.org/D19-1410/" target="_blank" rel="noreferrer">Architecture·objective·평가 범위 보기</a>
    </div>
  </section>;
}

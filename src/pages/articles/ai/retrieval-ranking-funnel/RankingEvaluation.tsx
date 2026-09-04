import ExplainedFormula from "@/components/ui/explained-formula";

export default function RankingEvaluation() {
  return (
    <section id="ranking-evaluation" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Precision@k와 MRR은 candidate recall과 다른 질문에 답합니다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          Candidate recall과 rerank NDCG만으로는 최종 사용자가 보는 상위 결과의 품질을 다 설명하지 못합니다. Precision@k는 상위 k개 중 실제
          relevant 비율을 봅니다. MRR이 보는 것은 첫 정답이 얼마나 앞에 나왔는지입니다.
        </p>
        <p>
          Ranking precision은 상위 결과 창 안의 정확도를 재는 일반적인 이름입니다. 그 창을 k개로 고정해 계산한 값이 Precision@k입니다. Recall@k가
          relevant set 전체 대비 회수량을 본다면 Precision@k는 사용자가 실제로 스크롤하는 범위 안에 잡음이 얼마나 섞여 있는지를 봅니다.
        </p>
        <p>
          예를 들어 reranker의 top-5 output에서 1·2·4번째 문서가 relevant이고 3·5번째가 아니라면 Precision@5는 3/5=0.6입니다. 같은 top-5가
          relevant set 전체 4개 중 3개를 담았다면 Recall@5는 3/4=0.75입니다. 같은 결과를 두고 두 지표가 서로 다른 값을 줍니다.
        </p>
        <p>
          MRR은 query 여러 개에 걸쳐 시스템이 정답을 얼마나 빨리 찾는지를 한 숫자로 요약합니다. Query마다 상위 결과에서 처음 나온 relevant 문서의 순위를 뒤집어 모은
          뒤 query 수로 나눈 평균입니다.
        </p>
      </div>
      <ExplainedFormula
        question="여러 query에 걸쳐 정답을 얼마나 빨리 찾는지는 어떻게 한 숫자로 요약할까요?"
        idea="Query마다 상위 결과에서 처음 나온 relevant 문서의 순위를 뒤집어 더하고 query 수로 나눕니다. 정답이 앞에 있을수록 1에 가깝고, 상위 결과에서 못 찾으면 그 query의 기여는 0입니다."
        formula={String.raw`\operatorname{MRR}=\frac{1}{|Q|}\sum_{q\in Q}\frac{1}{\operatorname{rank}_q^{first}}`}
        annotatedFormula={String.raw`\operatorname{MRR}=\frac{1}{|Q|}\sum_{q\in Q}\underbrace{\frac{1}{\operatorname{rank}_q^{first}}}_{\text{query }q\text{의 첫 정답 순위를 뒤집음}}`}
        operations={[
          { expression: String.raw`\frac{1}{\operatorname{rank}_q^{first}}`, annotation: ["query q의 상위 결과에서 처음 나온 relevant 문서 순위를 찾아", "그 역수를 그 query의 기여로 둡니다."] },
          { expression: String.raw`\frac{1}{|Q|}\sum_{q\in Q}`, annotation: ["모든 query의 기여를 더한 뒤", "query 수로 나눠 평균을 냅니다."] },
        ]}
        terms={[
          { symbol: "Q", name: "query set", description: "평가에 포함한 query 전체입니다." },
          { symbol: "rank_q^{first}", name: "첫 정답 순위", description: "Query q의 상위 결과 중 처음 나온 relevant 문서의 1부터 시작하는 순위이며, 못 찾으면 무한대로 두어 기여가 0이 됩니다." },
        ]}
        assumptions={["평가 창(top-k) 밖에서는 정답을 찾지 못한 것으로 처리합니다.", "여러 relevant 문서 중 첫 번째만 보고 나머지 위치는 반영하지 않습니다.", "Query 집합과 relevant label은 candidate recall·NDCG 평가와 같은 corpus revision을 씁니다."]}
        interpretation="Query 3개에서 첫 정답 순위가 각각 2, 1, top-k 안에 없음이면 기여는 1/2, 1, 0이고 MRR은 (0.5+1+0)/3=0.5입니다."
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          이름이 비슷해 헷갈리기 쉬운 짝이 있습니다. Reciprocal Rank Fusion(RRF)과 Mean Reciprocal Rank(MRR)은 둘 다 순위의 역수를 쓰지만 하는
          일이 다릅니다. RRF가 하는 일은 한 query 안에서 여러 검색기의 목록을 합치는 것입니다. MRR은 이미 완성된 하나의 순위를 여러 query에 걸쳐 평가하는 지표입니다.
        </p>
        <p>
          하나는 이 funnel의 fusion 단계에서 쓰고 다른 하나는 결과가 나온 뒤 평가에서 씁니다. 두 이름을 바꿔 쓰면 합치는 방법과 평가하는 방법을 뒤섞는 셈입니다.
        </p>
      </div>
    </section>
  );
}

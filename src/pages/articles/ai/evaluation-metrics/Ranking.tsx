import ExplainedFormula from "@/components/ui/explained-formula";
import RankingMetricsViz from "./viz/RankingMetricsViz";

export default function Ranking() {
  return (
    <section id="ranking" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">검색과 추천에서는 정답의 수, relevance 강도, 사용자가 보는 깊이를 먼저 고정합니다</h2>
      <div className="prose max-w-none prose-neutral dark:prose-invert">
        <p>
          Recall@k는 relevant item 전체 중 상위 k개에 몇 개를 회수했는지, MRR은 첫 relevant item을 얼마나 빨리 만나는지 봅니다.
          NDCG@k는 relevance가 0/1이 아니라 0·1·2·3처럼 여러 단계일 때 상단의 높은 relevance에 더 큰 보상을 줍니다. MAP은 relevant
          item이 나타날 때마다 그 지점의 precision을 계산해 여러 positive의 순서 품질을 봅니다. 어느 metric도 이름만으로 알맞다고
          정할 수 없으며 UI가 실제로 노출하는 k와 label 구조가 먼저입니다.
        </p>
      </div>

      <ExplainedFormula
        question="NDCG는 relevance가 높은 문서를 위에 놓는 일을 어떻게 하나의 점수로 만들까요?"
        idea={<>각 rank의 graded relevance를 gain으로 바꾸고 아래 rank일수록 log discount를 적용한 뒤, 같은 relevance 목록의 이상적인 정렬 점수로 나눕니다.</>}
        formula={String.raw`\operatorname{DCG}@k=\sum_{j=1}^{k}\frac{2^{\mathrm{rel}_j}-1}{\log_2(j+1)},\qquad \operatorname{NDCG}@k=\frac{\operatorname{DCG}@k}{\operatorname{IDCG}@k}`}
        terms={[
          { symbol: "j", name: "rank position", description: "1부터 시작하는 결과 목록의 위치입니다." },
          { symbol: "rel_j", name: "graded relevance", description: "j번째 item에 부여된 단계형 relevance label입니다." },
          { symbol: "log discount", name: "position discount", description: "아래 rank의 gain을 점차 작게 반영하는 사용자 관찰 가정입니다." },
          { symbol: "IDCG", name: "ideal DCG", description: "같은 judged items를 relevance가 높은 순서로 정렬했을 때 가능한 DCG입니다." },
        ]}
        assumptions={[
          "Relevance grade의 의미와 gain mapping 2^rel−1을 task에 맞게 고정합니다.",
          "k는 실제 surface에서 사용자가 볼 수 있는 깊이와 맞춥니다.",
          "IDCG가 0인 query를 제외·0 처리하는 규칙을 사전에 정합니다.",
        ]}
        interpretation="Relevance 3인 문서를 1등에서 5등으로 내리면 relevance 1인 문서보다 더 큰 gain을 잃습니다. NDCG는 query마다 이상적 순서로 정규화하지만 query 난이도 차이를 없애지는 않습니다."
      />

      <div className="not-prose my-8"><RankingMetricsViz /></div>

      <div className="prose max-w-none prose-neutral dark:prose-invert">
        <p>
          Query metric은 먼저 query 하나에서 계산한 뒤 query들을 평균내는 것이 기본입니다. 모든 query-document pair를 한꺼번에
          평균내면 candidate가 많은 query나 relevance label이 많은 query가 더 큰 weight를 얻습니다. 반면 실제 traffic experience를
          추정하려면 query frequency를 weight로 쓰는 편이 맞을 수 있습니다. 둘은 어느 쪽이 더 정직한가의 문제가 아니라 서로 다른
          population 질문입니다.
        </p>
      </div>

      <ExplainedFormula
        question="Query macro 평균과 실제 traffic 평균은 왜 서로 다른 model을 선택할 수 있을까요?"
        idea={<>Macro는 고유 query마다 같은 한 표를 주고, traffic-weighted 평균은 실제 발생 횟수만큼 표를 줍니다. Head query 개선과 tail query 개선의 우선순위가 달라집니다.</>}
        formula={String.raw`M_{\mathrm{macro}}=\frac{1}{|Q|}\sum_{q\in Q}m_q,\qquad M_{\mathrm{traffic}}=\frac{\sum_{q\in Q}n_qm_q}{\sum_{q\in Q}n_q}`}
        terms={[
          { symbol: "Q", name: "unique query set", description: "중복 traffic event를 query identity로 묶은 평가 query 집합입니다." },
          { symbol: "m_q", name: "per-query metric", description: "Query q 하나에서 계산한 Recall·MRR·NDCG·AP 값입니다." },
          { symbol: "n_q", name: "traffic count or weight", description: "정해진 기간에 query q가 발생한 횟수 또는 목표 배포 weight입니다." },
          { symbol: "Mmacro", name: "query macro score", description: "각 고유 query에 동일 weight를 준 평균입니다." },
        ]}
        assumptions={[
          "Query canonicalization·deduplication·language/intent slice 규칙을 고정합니다.",
          "Traffic count는 evaluation 기간과 배포 목표 population에서 가져옵니다.",
          "두 reducer를 candidate 결과를 본 뒤 유리한 쪽으로 바꾸지 않습니다.",
        ]}
        interpretation="Query A의 NDCG가 1.0이고 99회 발생하며 B는 0이고 1회 발생하면 traffic 평균은 .99, macro 평균은 .5입니다. 전자는 사용자 요청 대부분을, 후자는 query 종류의 균형을 답합니다."
      />

      <div id="paper-cumulative-gain" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">핵심 논문 · Cumulated Gain-based Evaluation of IR Techniques</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Järvelin과 Kekäläinen은 binary relevance만 보던 평가를 넘어 graded relevance와 rank discount를 사용하는 cumulative gain 기반
          지표를 전개했습니다. 현재 널리 쓰이는 NDCG 해석의 기반이지만, 논문의 user model이 모든 검색·추천 UI의 실제 관찰 확률을
          그대로 표현한다고 보거나 NDCG 하나가 diversity·freshness·latency를 대신한다고 해석하지 않습니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://doi.org/10.1145/582415.582418" target="_blank" rel="noreferrer">논문 출판 정보 보기</a>
      </div>

      <div className="prose max-w-none prose-neutral dark:prose-invert">
        <p>
          마지막으로 relevance judgment가 불완전한지 확인합니다. 평가자가 보지 않은 문서를 자동으로 negative로 처리하면 새로운 relevant
          문서를 찾은 model이 오히려 벌점을 받을 수 있습니다. Judged coverage, unjudged rate, label source와 pooling procedure를 metric
          옆에 기록하고 head·tail·language·intent·freshness slice를 나눕니다. Online click은 position·presentation·selection bias가 있으므로
          offline relevance label과 같은 정답으로 바로 사용하지 않습니다.
        </p>
      </div>
    </section>
  );
}

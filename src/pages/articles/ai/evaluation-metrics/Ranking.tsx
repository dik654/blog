import RankingMetricsViz from './viz/RankingMetricsViz';

export default function Ranking() {
  return (
    <section id="ranking" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">랭킹: MAP, NDCG</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          추천·검색 대회에서는 예측값 자체가 아니라 <strong>순위(ranking)</strong>가 평가 대상<br />
          "정답 아이템을 상위에 얼마나 잘 배치했는가"를 측정
        </p>
        <ul>
          <li><strong>MAP@K</strong> — Mean Average Precision. K위까지 정답의 위치 가중 평균</li>
          <li><strong>NDCG@K</strong> — Normalized Discounted Cumulative Gain. 상위 위치일수록 가중치가 크고 이상적 순위로 정규화</li>
          <li><strong>MRR</strong> — Mean Reciprocal Rank. 첫 번째 정답의 역수 평균</li>
          <li><strong>Hit@K</strong> — 상위 K개에 정답이 포함되는 비율</li>
        </ul>
      </div>

      <div className="not-prose my-8">
        <RankingMetricsViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">NDCG의 해석</h3>
        <p>
          DCG는 관련도 점수에 log(1/rank) 할인을 곱해 합산 — 상위일수록 값이 크다<br />
          NDCG는 DCG를 이상적인 DCG(IDCG)로 나눠 0~1 범위로 정규화 → 다른 쿼리끼리 비교 가능
        </p>
        <p>
          NDCG가 널리 쓰이는 이유 — 이진 관련도가 아니라 <strong>점수형 관련도</strong>도 처리 가능 (예: 3점 리뷰 vs 5점 리뷰)
        </p>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
        <p className="font-semibold mb-2">실전 팁: LambdaRank / ListMLE</p>
        <p className="text-sm">
          랭킹 지표는 미분 불가능 — 대신 Listwise 손실(LambdaRank, ListMLE)로 학습<br />
          LightGBM의 <code>rank:lambdaMART</code> objective가 실전에서 가장 자주 쓰인다
        </p>
      </div>
    </section>
  );
}

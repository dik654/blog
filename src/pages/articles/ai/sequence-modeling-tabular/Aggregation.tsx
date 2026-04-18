import AggregationViz from './viz/AggregationViz';

export default function Aggregation() {
  return (
    <section id="aggregation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">시퀀스 집계 피처</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          GBM(LightGBM, XGBoost)은 고정 길이 행 벡터를 입력받는다.
          시퀀스를 직접 넣을 수 없으므로, <strong>집계 함수로 압축</strong>하여 flat feature를 만든다.
          이 방식은 빠르고, 기존 파이프라인과 바로 결합되며, 해석이 쉽다는 장점이 있다.
        </p>
        <p>
          집계 피처는 크게 세 부류로 나뉜다:
          기본 통계(평균, 표준편차, 카운트), 윈도우 통계(최근 N개), 패턴 피처(n-gram, 전환 확률).
          각 부류가 서로 다른 정보를 포착하므로 전부 생성한 뒤 모델이 선택하게 하는 것이 효과적이다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">기본 통계 집계</h3>
        <p>
          <strong>수치형 필드</strong>(x 좌표, y 좌표, 속도 등)에는 mean, std, min, max, median을 적용한다.
          "평균 x 좌표가 50 이상이면 공격 진영에서 활동하는 선수"처럼, 통계 자체가 의미 있는 피처가 된다.
        </p>
        <p>
          <strong>범주형 필드</strong>(이벤트 유형, 구역 등)에는 mode(최빈값), nunique(고유값 수),
          각 범주의 비율(pass_ratio = 패스 횟수 / 전체 이벤트 수)을 계산한다.
          "패스 비율 0.7 이상이면 빌드업형, 슛 비율 0.2 이상이면 마무리형" 같은 해석이 가능하다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">최근 N개 윈도우 통계</h3>
        <p>
          전체 시퀀스의 평균은 과거 패턴을 포함하므로 <strong>현재 추세를 희석</strong>한다.
          "최근 3개 이벤트의 x 좌표 평균"이 "전체 평균"보다 다음 위치 예측에 더 유효한 경우가 많다.
          이동 평균(rolling mean)과 지수 가중 이동 평균(EWMA)을 함께 생성하면,
          단기 추세와 장기 추세를 동시에 포착한다.
        </p>
        <p>
          EWMA(지수 가중 이동 평균)는 최신 이벤트에 더 큰 가중치를 부여한다:
          S_t = alpha * x_t + (1-alpha) * S_{'{t-1}'}.
          alpha=0.3이면 최신 이벤트에 30% 가중치, 나머지 70%는 이전 누적에 분배.
        </p>
      </div>

      <div className="not-prose my-8">
        <AggregationViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">n-gram 패턴 피처</h3>
        <p>
          자연어 처리에서 bigram(연속 2단어)을 쓰듯, 이벤트 시퀀스에서도 연속 이벤트 조합의 빈도를 센다.
          <strong>bigram</strong>: (패스→패스), (패스→드리블), (드리블→슛) 등 2개 연속 조합.
          <strong>trigram</strong>: (패스→패스→드리블) 같은 3개 조합.
          각 조합의 발생 횟수와 비율이 피처가 된다.
        </p>
        <p>
          n-gram 피처의 해석 — "패스→드리블" 빈도가 높으면 돌파 성향,
          "패스→패스→패스" 빈도가 높으면 점유율 축구 스타일.
          단, 이벤트 유형이 많으면 조합 수가 폭발(N^2, N^3)하므로 빈도 상위 k개만 선택하거나,
          PCA로 차원을 줄인다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">전환 확률 행렬</h3>
        <p>
          전환 확률(transition probability)은 "현재 이벤트 유형이 A일 때, 다음이 B일 확률"이다.
          P(B|A) = count(A→B) / count(A→*).
          N개 유형이면 N x N 행렬이 되고, 각 셀이 하나의 피처.
          대각선 값이 높으면 같은 유형 반복 패턴, 비대각선이 높으면 전환이 잦은 패턴.
        </p>
        <p>
          전환 확률 행렬은 마르코프 체인(Markov chain)의 전이 행렬과 같은 구조다.
          1차 마르코프 가정("다음 상태는 현재 상태에만 의존")이 성립하지 않더라도,
          전환 확률 자체는 유용한 피처로 작동한다.
        </p>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
        <p className="font-semibold mb-2">실전 팁: 집계 피처 네이밍 규칙</p>
        <p className="text-sm">
          피처 이름에 집계 방식을 명시하면 해석이 쉬워진다: <code>x_mean_all</code>, <code>x_mean_last5</code>,
          <code>pass_to_dribble_ratio</code>, <code>transition_dribble_shot</code>.
          LightGBM의 feature importance와 함께 보면 "어떤 집계가 유효한지" 바로 알 수 있다.
        </p>
      </div>
    </section>
  );
}

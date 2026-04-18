import NumericViz from './viz/NumericViz';

export default function Numeric() {
  return (
    <section id="numeric" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">수치형 변환: 스케일링, 구간화, 로그</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          수치형 피처는 스케일(단위)이 제각각이다. 소득은 만 단위, 나이는 십 단위, 클릭수는 백만 단위.
          스케일 차이가 크면 경사 하강법 기반 모델(선형회귀, 신경망)에서 학습이 불안정해진다.
          트리 모델(XGBoost, LightGBM)은 분할 기준이 순서이므로 스케일 영향이 적지만, 스케일링 후 성능이 오르는 경우도 있다.
        </p>

        <h3>3가지 스케일러 비교</h3>
        <p>
          <strong>StandardScaler</strong> — z = (x - mean) / std. 평균 0, 표준편차 1로 정규화.
          정규분포를 가정하므로 이상치에 민감. 가장 범용적이고 기본 선택지.
        </p>
        <p>
          <strong>MinMaxScaler</strong> — (x - min) / (max - min). 0~1 범위로 압축.
          신경망 입력에 적합하지만, 이상치 하나가 범위를 왜곡하면 나머지 값이 한쪽에 몰린다.
        </p>
        <p>
          <strong>RobustScaler</strong> — (x - median) / IQR. 중앙값과 사분위 범위(IQR = Q3 - Q1) 기반.
          이상치에 강건. 금융 데이터, 센서 데이터처럼 극단값이 많은 도메인에서 선택.
        </p>
      </div>

      <div className="not-prose my-8">
        <NumericViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>로그 변환</h3>
        <p>
          소득·가격·조회수처럼 오른쪽 꼬리가 긴(positively skewed) 분포에서 <code>log(1 + x)</code>를 적용하면
          대칭에 가까운 분포로 변환된다. 1을 더하는 이유는 x=0일 때 log(0) = -inf를 방지하기 위함.
        </p>
        <p>
          로그 변환은 선형 모델의 성능을 크게 올릴 수 있다. 트리 모델에서는 효과가 제한적이지만,
          타겟 변수에 적용하면 RMSE 기준 점수가 향상되는 경우가 많다.
        </p>

        <h3>구간화(Binning)</h3>
        <p>
          연속 변수를 범주형으로 변환하는 기법. 나이 → 10대/20대/30대, 소득 → 저/중/고.
          수치 노이즈를 줄이고, 비선형 관계를 선형 모델에 전달하는 효과.
          등간격(equal-width), 등빈도(equal-frequency), 도메인 기반(의미 있는 경계) 세 가지 방법이 있다.
        </p>

        <h3>다항 피처(Polynomial)</h3>
        <p>
          x에서 x, x², x³, 또는 x1·x2 등을 생성. 비선형 관계를 선형 모델에 주입.
          degree 2까지가 실전 한계 — 3 이상은 차원 폭발과 과적합 위험이 급증.
        </p>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
        <p className="font-semibold mb-2">실전 팁: 스케일러 선택 기준</p>
        <p className="text-sm">
          이상치가 적으면 StandardScaler, 신경망이면 MinMaxScaler, 이상치가 많으면 RobustScaler.
          트리 모델은 스케일링이 필수가 아니지만, 피처 간 분포가 극단적으로 다르면 시도해볼 가치가 있다.
          타겟이 치우쳐 있으면 log 변환을 먼저 적용하고 스케일링을 나중에 한다.
        </p>
      </div>
    </section>
  );
}

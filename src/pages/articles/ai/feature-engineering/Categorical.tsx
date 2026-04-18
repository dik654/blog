import CategoricalViz from './viz/CategoricalViz';

export default function Categorical() {
  return (
    <section id="categorical" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">범주형 인코딩: 타겟, 빈도, 임베딩</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          범주형 변수(도시명, 브랜드, 직업 등)는 대부분의 모델이 직접 처리하지 못한다.
          숫자로 변환해야 하는데, 변환 방식에 따라 성능 차이가 크다.
          범주 수(cardinality)가 핵심 판단 기준 — 적으면 One-Hot, 많으면 Target/Frequency/Embedding.
        </p>

        <h3>Label Encoding</h3>
        <p>
          범주를 정수로 매핑 (서울=0, 부산=1, 대구=2).
          <strong>순서(ordinal)가 있는 범주</strong>에만 적합 — 학력(초등=0, 중등=1, 고등=2), 등급(브론즈=0, 실버=1, 골드=2).
          순서가 없는데 Label Encoding을 쓰면 "서울 &lt; 부산"이라는 거짓 순서를 모델이 학습한다.
        </p>

        <h3>One-Hot Encoding</h3>
        <p>
          각 범주를 0/1 이진 열로 분리. 범주 간 순서 관계가 없음을 명시.
          범주 수 15개 이하에서 사용. 100개 이상이면 차원 폭발(curse of dimensionality)로
          학습 속도 저하와 과적합이 동시에 발생.
        </p>
      </div>

      <div className="not-prose my-8">
        <CategoricalViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Target Encoding (Mean Encoding)</h3>
        <p>
          범주를 해당 범주의 <strong>타겟 평균값</strong>으로 치환. 서울의 전환율이 72%이면 "서울" → 0.72.
          고카디널리티 범주(수백~수천)에 매우 효과적이지만, <strong>정보 누수(data leakage)</strong> 위험이 있다.
        </p>
        <p>
          스무딩(smoothing)으로 과적합 방지 — 관측 수 n이 적은 범주는 전체 평균에 가중.
          공식: (n * category_mean + m * global_mean) / (n + m). m은 스무딩 파라미터(보통 10~100).
          교차 검증 fold 내에서만 계산해야 누수를 막을 수 있다.
        </p>

        <h3>Frequency Encoding</h3>
        <p>
          범주를 출현 횟수 또는 비율로 치환. "서울" 1500건 중 45%이면 → 0.45.
          타겟 정보를 사용하지 않으므로 정보 누수가 없다.
          단점은 동일 빈도를 가진 서로 다른 범주를 구분하지 못한다는 것.
        </p>

        <h3>Entity Embedding</h3>
        <p>
          신경망의 Embedding 레이어로 범주를 저차원 밀집 벡터로 매핑.
          학습 과정에서 유사한 범주는 벡터 공간에서 가까이 위치하게 된다.
          TabNet, DeepFM, Wide&Deep 등에서 기본 사용. 고카디널리티(수천 범주) 처리에 가장 강력.
          학습된 임베딩을 추출해 GBM 피처로 재사용하는 전략도 효과적이다.
        </p>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
        <p className="font-semibold mb-2">실전 팁: 인코딩 선택 가이드</p>
        <p className="text-sm">
          범주 수 10 이하 → One-Hot. 10~100 → Frequency + Target(스무딩).
          100+ → Target Encoding(fold별 계산) 또는 Entity Embedding.
          트리 모델에는 Label Encoding도 의외로 잘 동작한다 — 분할이 순서가 아닌 범위 기반이므로.
        </p>
      </div>
    </section>
  );
}

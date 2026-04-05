import CodePanel from '@/components/ui/code-panel';

const PYOD_CODE = `from pyod.models.ecod import ECOD
import numpy as np

# 1. 데이터 준비 (n=10000, d=20)
X_train = np.random.randn(10000, 20)

# 2. ECOD 모델 생성 — 하이퍼파라미터 불필요
clf = ECOD(contamination=0.05)  # 상위 5%를 이상치로 간주

# 3. 학습 + 예측
clf.fit(X_train)
labels = clf.labels_          # 0: 정상, 1: 이상치
scores = clf.decision_scores_ # 연속 이상치 점수

# 4. 새 데이터 예측
X_test = np.random.randn(100, 20)
test_labels = clf.predict(X_test)
test_scores = clf.decision_function(X_test)`;

const PYOD_ANNOT = [
  { lines: [5, 5] as [number, number], color: 'sky' as const, note: '다변량 데이터 생성' },
  { lines: [8, 8] as [number, number], color: 'emerald' as const, note: 'contamination만 설정' },
  { lines: [11, 13] as [number, number], color: 'amber' as const, note: 'fit 후 라벨/점수 접근' },
  { lines: [16, 17] as [number, number], color: 'violet' as const, note: '새 데이터 이상치 판정' },
];

export default function Implementation() {
  return (
    <section id="implementation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">PyOD 구현 & 대규모 처리</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>PyOD</strong> 라이브러리 — ECOD를 포함한 40+ 이상 탐지 알고리즘을 통합 API로 제공<br />
          ECOD는 <code>fit()</code> 호출 시 내부적으로 ECDF를 계산<br />
          별도의 반복 학습 없음
        </p>
      </div>
      <CodePanel
        title="PyOD ECOD 사용 예제"
        code={PYOD_CODE}
        annotations={PYOD_ANNOT}
        defaultOpen
      />
      <div className="prose prose-neutral dark:prose-invert max-w-none mt-4">
        <h3 className="text-xl font-semibold mb-3">대규모 데이터 처리 전략</h3>
        <ul>
          <li>
            <strong>O(n * d) 시간 복잡도</strong> — 각 차원별 정렬 O(n log n)이
            주요 비용. LOF의 O(n^2)보다 훨씬 효율적
          </li>
          <li>
            <strong>메모리 효율</strong> — ECDF는 원본 데이터만 저장. 거리 행렬(n x n)이
            불필요하여 메모리 O(n * d)
          </li>
          <li>
            <strong>병렬화</strong> — 차원 간 독립이므로 각 피처의 ECDF를 병렬 계산 가능.
            <code>n_jobs</code> 파라미터로 멀티코어 활용
          </li>
          <li>
            <strong>스트리밍 확장</strong> — 새 데이터 도착 시 ECDF를 점진적으로
            업데이트할 수 있어 온라인 탐지에도 적용 가능
          </li>
        </ul>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">PyOD 생태계와 ECOD</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// PyOD (Python Outlier Detection) 라이브러리
//
// 40+ 알고리즘 통합:
//   - Statistical: ECOD, COPOD, HBOS
//   - Proximity-based: KNN, LOF, CBLOF
//   - Linear: PCA, MCD
//   - Probabilistic: ABOD, GMM
//   - Tree-based: IForest
//   - Neural: AE, VAE, SO-GAAL
//   - Ensemble: Feature Bagging, LSCP
//
// 통합 API:
//   from pyod.models.{method} import {Method}
//   clf = Method(contamination=0.1)
//   clf.fit(X_train)
//   labels = clf.predict(X_test)
//   scores = clf.decision_function(X_test)

// Benchmark 기반 선택:
//
// ECOD 권장 상황:
//   ✓ 데이터 크기 크고 (n > 10K)
//   ✓ 차원 독립적 (또는 상관관계 약함)
//   ✓ 해석성 중요
//   ✓ 하이퍼파라미터 튜닝 없이 바로 사용
//
// KNN/LOF 권장:
//   - 국소 밀도 변화 중요
//   - 데이터 크기 작음 (n < 10K)
//   - 비선형 경계
//
// Isolation Forest 권장:
//   - 고차원 (d > 50)
//   - 빠른 학습 필요
//   - 범용 baseline
//
// Autoencoder 권장:
//   - 이미지, 시퀀스 데이터
//   - 복잡한 패턴
//   - 대용량 데이터 보유`}
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">평가 지표와 실무 주의사항</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 이상 탐지 평가 지표
//
// 1. ROC-AUC
//    - 정상/이상 이진 분류
//    - threshold 독립
//    - 0.5~1.0 범위
//
// 2. PR-AUC (Precision-Recall)
//    - 불균형 데이터에 유리
//    - 이상치 비율 < 5% 일 때 중요
//
// 3. Precision@K
//    - 상위 K개 중 실제 이상치 비율
//    - 실무에서 중요 (검토 자원 제한)
//
// 4. F1-score
//    - Precision·Recall 조화평균
//    - 이진 판정 기반

// 실무 체크리스트:
//
// [전처리]
//   - 스케일링 (StandardScaler, MinMaxScaler)
//   - Categorical → One-hot
//   - Missing 처리
//   - Feature engineering
//
// [학습]
//   - contamination 추정 (도메인 지식)
//   - validation set 분리 (가능하면)
//   - cross-validation
//
// [평가]
//   - 다양한 임계값 실험
//   - 여러 알고리즘 앙상블
//   - 도메인 전문가 검토
//
// [배포]
//   - 드리프트 모니터링
//   - 주기적 재학습
//   - alert 시스템 연동

// 앙상블 예시:
from pyod.models.combination import average

# 여러 모델 훈련
clfs = [ECOD(), IForest(), KNN()]
for clf in clfs:
    clf.fit(X_train)

# 점수 앙상블
scores = np.zeros(X_test.shape[0])
for clf in clfs:
    scores += clf.decision_function(X_test)
scores /= len(clfs)`}
        </pre>
        <p className="leading-7">
          요약 1: <strong>PyOD</strong>가 Python 이상 탐지 표준 라이브러리 — 40+ 알고리즘.<br />
          요약 2: ECOD는 <strong>대규모·해석성·no-tuning</strong> 시나리오에 최적.<br />
          요약 3: 실무에서는 <strong>앙상블 + 드리프트 모니터링</strong>이 중요.
        </p>
      </div>
    </section>
  );
}

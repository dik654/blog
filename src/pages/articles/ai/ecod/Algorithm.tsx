import ECODArchViz from './viz/ECODArchViz';
import CodePanel from '@/components/ui/code-panel';

const FORMULA = `# ECOD 이상치 점수 계산 수식

## 1. 경험적 CDF (각 차원 j에 대해)
  F_j(x) = (1/n) * Σ I(X_ij ≤ x)    # I는 지시함수

## 2. 꼬리 확률 → 이상치 점수 변환
  O_left(i,j)  = -log( F_j(x_ij) )         # 좌측 꼬리
  O_right(i,j) = -log( 1 - F_j(x_ij) )     # 우측 꼬리

## 3. Two-tail 결합
  O(i,j) = max( O_left(i,j), O_right(i,j) )

## 4. 최종 이상치 점수 (차원 합산)
  O(i) = Σ_j O(i,j)    # 독립성 가정 하에 합산`;

export default function Algorithm() {
  return (
    <section id="algorithm" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ECDF 기반 이상치 점수 계산</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        차원별 ECDF → 꼬리 확률에 -log 변환 → Two-tail max → 합산.<br />
        꼬리 확률 0.01 → 점수 4.6, 0.5 → 점수 0.7. 극단일수록 급증.
      </p>
      <ECODArchViz />
      <div className="mt-6">
        <CodePanel title="ECOD 수학적 정의" code={FORMULA} defaultOpen />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">ECOD 상세 계산 예시</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// ECOD 단계별 수치 예시
//
// 데이터: 5 samples × 2 features
//   X = [[1.0, 10],    # sample 0
//        [2.0, 12],    # sample 1
//        [2.5, 11],    # sample 2
//        [3.0, 15],    # sample 3
//        [100, 500]]   # sample 4 (이상치)
//
// Step 1: 각 차원에 대해 ECDF 계산
//
// Feature 1 (x축):
//   정렬: [1.0, 2.0, 2.5, 3.0, 100]
//   F_1(1.0) = 1/5 = 0.2
//   F_1(2.0) = 2/5 = 0.4
//   F_1(2.5) = 3/5 = 0.6
//   F_1(3.0) = 4/5 = 0.8
//   F_1(100) = 5/5 = 1.0
//
// Feature 2 (y축):
//   정렬: [10, 11, 12, 15, 500]
//   F_2(10)  = 0.2
//   F_2(11)  = 0.4
//   F_2(12)  = 0.6
//   F_2(15)  = 0.8
//   F_2(500) = 1.0
//
// Step 2: 각 sample의 꼬리 점수
//
// Sample 0 (x=1.0, y=10):
//   O_left(0,1)  = -log(0.2) = 1.609
//   O_right(0,1) = -log(1-0.2) = 0.223
//   O_left(0,2)  = -log(0.2) = 1.609
//   O_right(0,2) = -log(1-0.2) = 0.223
//   max_1 = 1.609, max_2 = 1.609
//   Total O(0) = 3.218
//
// Sample 4 (x=100, y=500):
//   O_left(4,1)  = -log(1.0) = 0.0  (실제 ε로 clamp)
//   O_right(4,1) = -log(1-1.0+ε) ≈ 매우 큼
//   max_1 ≈ 매우 큼
//   max_2 ≈ 매우 큼
//   Total O(4) = 매우 큼
//   → 이상치로 판정`}
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">수치 안정성과 변형</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 수치 안정성
//
// 경계값 처리:
//   F(x) = 0 or 1일 때 -log(0) = ∞
//   해결: 작은 epsilon 사용
//     F_safe = max(min(F, 1-ε), ε)
//   ε = 1e-7 정도
//
// 상수 열 (constant feature):
//   모든 값이 같으면 ECDF = step(x)
//   해결: 해당 차원 제외 또는 0 점수 할당

// ECOD 변형:
//
// 1. ECOD+ (Auto-Skew):
//    분포 skewness를 추정하여 tail 방향 자동 결정
//    좌/우 편향 분포에서 성능 개선
//
// 2. COPOD (Copula):
//    ECOD의 확장
//    차원 간 상관관계 고려
//    Empirical copula로 다변량 tail 추정
//
// 3. HBOS (Histogram-Based):
//    ECDF 대신 히스토그램 사용
//    더 빠름, 해석성 유사
//
// 4. LODA (Lightweight Online):
//    온라인 학습 가능
//    랜덤 projection 활용

// 장점 요약:
//   ✓ 학습 불필요
//   ✓ 하이퍼파라미터 프리
//   ✓ 해석 가능 (차원별 기여도)
//   ✓ 대규모 확장성
//   ✓ 선형 데이터에 강함
//
// 단점:
//   ✗ 차원 간 상관관계 무시
//   ✗ 비선형 구조 포착 어려움
//   ✗ 국소 밀도 변화 감지 못함
//     → LOF가 더 유리한 경우
//   ✗ 범주형 데이터 전처리 필요`}
        </pre>
        <p className="leading-7">
          요약 1: <strong>ECDF → -log → max → sum</strong> 4단계로 이상 점수 계산.<br />
          요약 2: <strong>epsilon clamp</strong>로 수치 안정성 확보 필수.<br />
          요약 3: <strong>차원 독립 가정</strong>이 단점 — COPOD가 확장 해결책.
        </p>
      </div>
    </section>
  );
}

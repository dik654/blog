import CEvsMSEViz from './viz/CEvsMSEViz';

export default function CEvsMSE({ title }: { title?: string }) {
  return (
    <section id="ce-vs-mse" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'CE vs MSE'}</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        분류에서 CE가 MSE보다 선호되는 이유 — 예측이 크게 틀렸을 때 기울기 크기.<br />
        CE + softmax → 미분이 ŷ - y로 깔끔. MSE는 σ'(z) 추가로 4배+ 작음.
      </p>
      <CEvsMSEViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">MSE vs CE 기울기 비교</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 분류 문제에서 MSE vs CE
//
// 설정:
//   Binary classification
//   z = 선형 출력 (logit)
//   ŷ = sigmoid(z) = 예측 확률
//   y ∈ {0, 1} = 정답
//
// MSE Loss:
//   L_MSE = (1/2)·(ŷ - y)²
//
//   기울기:
//   dL/dz = (ŷ - y) · ŷ · (1 - ŷ)
//          = (ŷ - y) · sigmoid'(z)
//
// CE Loss:
//   L_CE = -y·log(ŷ) - (1-y)·log(1-ŷ)
//
//   기울기:
//   dL/dz = ŷ - y  (단순!)
//
// 수치 비교 (y=1, 모델이 틀림):
//   예측 ŷ=0.01 (매우 틀림):
//     MSE grad = (0.01-1) × 0.01 × 0.99 = -0.0098
//     CE grad  = 0.01 - 1 = -0.99
//     → CE가 100배 큰 기울기!
//
//   예측 ŷ=0.5:
//     MSE grad = (0.5-1) × 0.5 × 0.5 = -0.125
//     CE grad  = 0.5 - 1 = -0.5
//     → CE가 4배 큰 기울기
//
//   예측 ŷ=0.99 (거의 맞음):
//     MSE grad = -0.0099
//     CE grad  = -0.01
//     → 거의 비슷

// 결론:
//   "크게 틀린 예측일수록 CE가 훨씬 큰 기울기"
//   → 학습 초기 수렴 속도가 MSE보다 훨씬 빠름
//   → MSE는 포화 영역에서 학습 정지 위험`}
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">포화(Saturation) 문제</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Sigmoid Saturation 문제
//
// sigmoid(z) 미분값:
//   sigmoid'(z) = sigmoid(z) · (1 - sigmoid(z))
//
//   최대값: z=0일 때 0.25
//   z → ±∞: 미분값 → 0 (포화)
//
// 구간별 sigmoid'(z):
//   z = -10: sigmoid(z) ≈ 0.00005, 미분 ≈ 0.00005
//   z = -5:  sigmoid(z) ≈ 0.007, 미분 ≈ 0.007
//   z = 0:   sigmoid(z) = 0.5, 미분 = 0.25
//   z = 5:   sigmoid(z) ≈ 0.993, 미분 ≈ 0.007
//   z = 10:  sigmoid(z) ≈ 0.99995, 미분 ≈ 0.00005

// MSE + Sigmoid의 문제:
//   dL/dz = (ŷ - y) · sigmoid'(z)
//
//   만약 z = 10인데 y = 0 (완전히 틀림):
//     ŷ = 0.99995, error = 0.99995
//     하지만 sigmoid'(10) ≈ 0.00005
//     dL/dz ≈ 0.99995 × 0.00005 ≈ 0.00005
//     → 거의 0 기울기! 학습 안 됨
//
// CE + Sigmoid:
//   dL/dz = ŷ - y
//
//   같은 상황: dL/dz ≈ 0.99995
//   → 강한 기울기, 빠르게 수정

// 분류 = CE, 회귀 = MSE:
//   - 분류: 확률 출력 → sigmoid/softmax → CE
//   - 회귀: 실수 출력 → identity → MSE
//
//   왜? CE는 log 덕분에 sigmoid derivative가 상쇄됨
//       MSE는 상쇄 안 됨 → 포화 영역 학습 실패`}
        </pre>
        <p className="leading-7">
          요약 1: <strong>CE + Sigmoid/Softmax</strong> 조합이 분류의 표준 — 수학적 필연.<br />
          요약 2: MSE는 <strong>포화 영역</strong>에서 기울기 소실 — 학습 정체.<br />
          요약 3: CE의 단순한 <strong>(ŷ - y)</strong> 기울기가 빠른 수렴의 비결.
        </p>
      </div>
    </section>
  );
}

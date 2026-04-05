import DimReduceViz from './viz/DimReduceViz';

export default function DimensionReduction() {
  return (
    <section id="dimension-reduction" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">차원 축소의 의미</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>왜 잠재 공간이 핵심인가</h3>
        <p>
          Bottleneck이 정보를 강제로 압축한다.<br />
          노이즈(잡음)는 패턴이 없으므로 압축 과정에서 자연스럽게 탈락.<br />
          핵심 구조만 잠재 벡터에 남는다.
        </p>

        <h3>PCA vs 오토인코더</h3>
        <p>
          <strong>PCA(주성분 분석)</strong> — 선형 변환으로 차원 축소. 데이터의 분산이 최대인 방향을 찾음.<br />
          <strong>오토인코더</strong> — 비선형 활성화 함수 덕분에 곡면, 매니폴드(Manifold) 위의 구조도 학습 가능.<br />
          선형 활성화만 쓰면 오토인코더 = PCA와 동일한 결과.
        </p>

        <h3>직관적 이해</h3>
        <p>
          PCA: 종이 위 점들을 직선에 투영 (직선만 가능).<br />
          오토인코더: 점들을 곡선에 투영 (복잡한 곡면도 가능).
        </p>
      </div>
      <div className="not-prose mt-8">
        <DimReduceViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">PCA와의 수학적 관계</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Linear Autoencoder = PCA (증명)
//
// Linear AE 정의 (활성화 없음, bias 없음):
//   z = W_enc @ x         (W_enc ∈ R^{k×n})
//   x̂ = W_dec @ z        (W_dec ∈ R^{n×k})
//
// 학습 목표:
//   minimize E[||x - W_dec W_enc x||²]
//
// 최적해 (Baldi & Hornik 1989):
//   W_dec = U_k         (PCA 상위 k개 주성분 행렬)
//   W_enc = U_k^T       (전치 행렬)
//
//   단, 회전/스케일 ambiguity 있음
//
// 즉, Linear AE는 PCA subspace를 찾음
// (정확한 주성분 방향은 학습 경로에 의존)

// 비선형 Autoencoder의 추가 능력:
//
// PCA:
//   - 선형 부분공간만 학습
//   - 곡면/매니폴드 표현 불가
//   - Swiss roll 같은 데이터에서 실패
//
// Nonlinear AE:
//   - 비선형 매니폴드 학습
//   - 곡선 경로로 압축 가능
//   - 표현 능력 훨씬 강력
//
// 실험 예시 (Swiss Roll):
//   PCA k=2: 원형으로 접힌 구조를 평면으로 못 펼침
//   Nonlinear AE k=2: 2D 평면으로 자연스럽게 전개`}
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">매니폴드 가설과 표현 학습</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Manifold Hypothesis (매니폴드 가설)
//
// 관찰:
//   - 고차원 데이터 (이미지 784차원, 텍스트 수천 차원)
//   - 실제 데이터는 고차원 공간의 작은 부분만 차지
//   - 본질적으로는 훨씬 저차원 매니폴드 위에 존재
//
// 예:
//   28×28 MNIST = 784차원 공간
//   하지만 "손글씨 숫자"는 이 중 극소부분
//   본질 차원 ≈ 10~30 (숫자 모양의 자유도)
//
// 오토인코더 역할:
//   - 고차원 → 저차원 매니폴드 좌표계 학습
//   - 잠재 공간 z는 매니폴드 위의 좌표
//   - 인접한 z → 유사한 데이터 (smoothness)
//
// 활용:
//   1. 시각화: z를 2D/3D로 축소하면 데이터 구조 시각화
//   2. 생성: z를 샘플링하여 새 데이터 생성 (VAE)
//   3. 보간(interpolation): z₁ ↔ z₂ 경로가 smooth한 변형
//   4. 이상 탐지: 매니폴드에서 벗어난 샘플 감지

// 잠재 공간 품질 측정:
//   - Disentanglement: 각 z 차원이 독립적 factor 대응
//   - Smoothness: 작은 z 변화 → 작은 x 변화
//   - Coverage: 데이터 전체를 잘 표현
//
// 최근 트렌드:
//   - Disentangled VAE (β-VAE, FactorVAE)
//   - Self-supervised learning (SimCLR, MAE)
//   - Foundation models의 내부 representation`}
        </pre>
        <p className="leading-7">
          요약 1: <strong>Linear AE = PCA</strong> — 비선형 활성화가 표현력의 핵심 차이.<br />
          요약 2: <strong>매니폴드 가설</strong>은 고차원 데이터가 저차원 구조에 놓인다는 가정.<br />
          요약 3: 잠재 공간은 <strong>표현 학습(representation learning)</strong>의 출발점 — 딥러닝 전반의 기반.
        </p>
      </div>
    </section>
  );
}

import DecoderComputeViz from './viz/DecoderComputeViz';

export default function DecoderComputation() {
  return (
    <section id="decoder-computation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">디코더 숫자 계산: z → x̂</h2>
      <div className="not-prose mb-8"><DecoderComputeViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-2xl">
        <h3 className="text-xl font-semibold mt-6 mb-3">Step 1: z 입력</h3>
        <p>
          잠재 벡터 <strong>z = [0.685, -0.285]</strong>가 디코더에 들어간다.
          2차원에서 3차원으로 복원해야 한다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Step 2: 은닉층 확장</h3>
        <p>
          <strong>h_dec = ReLU(W_dec · z + b_dec)</strong> — 가중치 행렬 W_dec(4×2)로
          2차원을 4차원 은닉층으로 확장한다.<br />
          결과: h_dec = [0.48, 0.31, 0.00, 0.62]
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Step 3: 출력층</h3>
        <p>
          <strong>x̂ = sigmoid(W_out · h_dec + b_out)</strong><br />
          sigmoid를 통과하면 모든 값이 [0, 1] 범위로 제한된다.<br />
          결과: <strong>x̂ = [0.73, 0.45, 0.52]</strong>
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">원본과 비교</h3>
        <p>
          원본 x = [0.80, 0.40, 0.60] vs 복원 x̂ = [0.73, 0.45, 0.52]<br />
          아직 차이가 있다. 이 차이가 <strong>재구성 손실</strong>이 된다.<br />
          학습이 반복되면 x̂가 x에 점점 가까워진다.
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Decoder 구조와 출력 분포</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// VAE Decoder Implementation
class Decoder(nn.Module):
    def __init__(self, latent_dim, hidden_dim, output_dim):
        super().__init__()
        self.fc1 = nn.Linear(latent_dim, hidden_dim)
        self.fc2 = nn.Linear(hidden_dim, output_dim)

    def forward(self, z):
        h = F.relu(self.fc1(z))
        x_hat = torch.sigmoid(self.fc2(h))  # 0~1 픽셀값
        return x_hat

// 출력 분포 선택:
//
// 1. Bernoulli (이진/이진화 이미지)
//    p(x|z) = ∏ x̂_i^{x_i} · (1-x̂_i)^{1-x_i}
//    손실: Binary Cross-Entropy
//    활성화: sigmoid
//    MNIST, 이진 이미지에 적합
//
// 2. Gaussian (연속 픽셀)
//    p(x|z) = N(μ(z), σ²·I)
//    손실: MSE (σ 고정 시)
//    활성화: linear 또는 sigmoid
//    일반 이미지에 적합
//
// 3. Categorical (컬러 이미지)
//    p(x|z) = Cat(π_1, ..., π_K) for each pixel
//    K=256 (8-bit 컬러)
//    활성화: softmax
//    PixelVAE 등에서 활용

// 이미지 생성 시 decoder 구조:
//
// MNIST:
//   Linear(20, 400)
//   ReLU
//   Linear(400, 784)
//   Sigmoid → (28, 28) reshape
//
// 더 복잡한 이미지 (ConvTranspose):
//   Linear(latent, 4*4*256)
//   Reshape(4, 4, 256)
//   ConvT(256→128, stride=2) → 8×8×128
//   ConvT(128→64, stride=2)  → 16×16×64
//   ConvT(64→3, stride=2)    → 32×32×3
//   Sigmoid (픽셀 정규화)`}
        </pre>
        <p className="leading-7">
          요약 1: Decoder는 <strong>z → 은닉층 → 출력</strong> 단순 구조.<br />
          요약 2: 출력 분포(Bernoulli/Gaussian/Categorical)가 <strong>loss 함수</strong> 결정.<br />
          요약 3: 이미지는 <strong>ConvTranspose</strong>로 공간 차원 복원.
        </p>
      </div>
    </section>
  );
}

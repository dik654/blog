import EncoderComputeViz from './viz/EncoderComputeViz';
import EncoderImplViz from './viz/EncoderImplViz';

export default function EncoderComputation() {
  return (
    <section id="encoder-computation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">인코더 숫자 계산: x → μ, log σ²</h2>
      <div className="not-prose mb-8"><EncoderComputeViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-2xl">
        <h3 className="text-xl font-semibold mt-6 mb-3">Step 1: 입력</h3>
        <p>
          입력 벡터 <strong>x = [0.8, 0.4, 0.6]</strong> — 3차원 데이터.
          이미지라면 픽셀값을 정규화한 결과다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Step 2: 은닉층 계산</h3>
        <p>
          은닉층 활성화: <strong>h = ReLU(W_enc · x + b_enc)</strong><br />
          가중치 행렬 W_enc(4×3)과 편향 b_enc를 곱하고 ReLU 적용.
          음수는 0으로 잘린다. 결과: h = [0.72, 0.00, 0.54, 0.38]
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Step 3: μ 출력</h3>
        <p>
          별도의 가중치 W_μ(2×4)로 <strong>μ = W_μ · h + b_μ</strong> 계산.<br />
          결과: <strong>μ = [0.35, -0.12]</strong> — 잠재 분포의 "중심"
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Step 4: log σ² 출력</h3>
        <p>
          또 다른 가중치 W_logvar(2×4)로 <strong>log σ² = W_logvar · h + b_logvar</strong>.<br />
          결과: <strong>log σ² = [-0.8, -1.2]</strong><br />
          σ² 대신 log σ²를 출력하는 이유 — 분산은 항상 양수여야 하므로
          로그 공간에서 계산하면 어떤 실수값이든 exp로 양수 변환 가능
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Encoder 구조 PyTorch 구현</h3>
        <div className="not-prose"><EncoderImplViz /></div>
        <p className="leading-7">
          요약 1: Encoder는 <strong>2개 출력 헤드</strong> (μ, log σ²) — 분포 파라미터.<br />
          요약 2: <strong>log σ²를 출력</strong>하면 양수 제약 자동 해결 + 수치 안정.<br />
          요약 3: MNIST 표준 설정: <strong>784 → 400 → 20</strong> dimension.
        </p>
      </div>
    </section>
  );
}

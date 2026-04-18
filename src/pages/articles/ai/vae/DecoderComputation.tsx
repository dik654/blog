import DecoderComputeViz from './viz/DecoderComputeViz';
import DecoderImplViz from './viz/DecoderImplViz';

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
        <div className="not-prose"><DecoderImplViz /></div>
        <p className="leading-7">
          요약 1: Decoder는 <strong>z → 은닉층 → 출력</strong> 단순 구조.<br />
          요약 2: 출력 분포(Bernoulli/Gaussian/Categorical)가 <strong>loss 함수</strong> 결정.<br />
          요약 3: 이미지는 <strong>ConvTranspose</strong>로 공간 차원 복원.
        </p>
      </div>
    </section>
  );
}

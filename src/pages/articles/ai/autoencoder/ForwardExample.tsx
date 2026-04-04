import ForwardExampleViz from './viz/ForwardExampleViz';

export default function ForwardExample() {
  return (
    <section id="forward-example" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">순전파 예시 (구체적 숫자)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>모델 설정</h3>
        <p>
          가장 단순한 오토인코더: 입력 2차원, 잠재 1차원, 출력 2차원.<br />
          활성화 함수: sigmoid(x) = 1 / (1 + e⁻ˣ).
        </p>

        <h3>초기값</h3>
        <ul>
          <li>입력: x = [0.8, 0.4]</li>
          <li>인코더 가중치: w_enc = [0.5, 0.3]</li>
          <li>디코더 가중치: w_dec = [0.6, 0.7]</li>
        </ul>

        <h3>계산 과정</h3>
        <p>
          <strong>인코더:</strong> z = sigmoid(0.5 x 0.8 + 0.3 x 0.4) = sigmoid(0.52) = <strong>0.627</strong><br />
          <strong>디코더:</strong><br />
          x&#770;₁ = sigmoid(0.6 x 0.627) = sigmoid(0.376) = <strong>0.593</strong><br />
          x&#770;₂ = sigmoid(0.7 x 0.627) = sigmoid(0.439) = <strong>0.608</strong>
        </p>

        <h3>결과 비교</h3>
        <p>
          입력 [0.8, 0.4] vs 출력 [0.593, 0.608].<br />
          아직 부정확하다 — 학습(역전파)을 통해 가중치를 조정해야 한다.
        </p>
      </div>
      <div className="not-prose mt-8">
        <ForwardExampleViz />
      </div>
    </section>
  );
}

import ExplainedFormula from "@/components/ui/explained-formula";
import ForwardExampleViz from "./viz/ForwardExampleViz";

export default function ForwardExample() {
  return (
    <section id="forward-example" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">숫자 하나로 forward pass를 끝까지 계산해 봅니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          입력 2차원, latent 1차원, 출력 2차원의 작은 network를 사용하겠습니다.
          입력은 <code>x=[0.8, 0.4]</code>, encoder weight는
          <code>[0.5, 0.3]</code>, decoder weight는 <code>[0.6, 0.7]</code>로
          두고 bias는 생략합니다. Activation은 sigmoid이므로 모든 출력이 0과 1
          사이에 놓입니다.
        </p>
      </div>

      <ExplainedFormula
        question="두 입력값이 하나의 latent value가 되었다가 어떻게 두 출력으로 복원될까?"
        idea={<>먼저 encoder의 weighted sum에 sigmoid를 적용해 z를 만듭니다. Decoder는 같은 z에 서로 다른 weight를 곱해 각 output coordinate를 만듭니다.</>}
        formula={String.raw`\begin{aligned}
a &= 0.5\cdot0.8+0.3\cdot0.4=0.52 \\
z &= \sigma(a)\approx0.627 \\
\hat{x}_1 &= \sigma(0.6z)\approx0.593 \\
\hat{x}_2 &= \sigma(0.7z)\approx0.608
\end{aligned}`}
        terms={[
          { symbol: "σ(a)", name: "sigmoid", description: "1/(1+e^{-a})로 계산해 실수를 0과 1 사이로 바꿉니다." },
          { symbol: "z", name: "one-dimensional code", description: "두 input coordinate를 하나로 줄인 latent value입니다." },
          { symbol: "x̂₁,x̂₂", name: "reconstructed coordinates", description: "Decoder가 만든 두 output이며 입력의 같은 위치와 비교합니다." },
        ]}
        assumptions={["Bias를 0으로 둔 설명용 toy network입니다.", "Input 범위가 [0,1]이어서 sigmoid output을 사용합니다."]}
        interpretation="초기 reconstruction [0.593, 0.608]은 입력 [0.8, 0.4]와 아직 다릅니다. 이 차이를 scalar loss로 줄이면서 encoder와 decoder weight가 함께 바뀝니다."
      />

      <div className="not-prose mt-8"><ForwardExampleViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          두 coordinate의 squared error를 평균내면 약 0.043입니다. 학습이 진행되면
          training reconstruction loss는 줄어들 수 있지만, 그 값이 0에 가깝다고
          좋은 representation을 얻었다고 단정할 수는 없습니다. Training sample을
          외운 network도 그 sample만큼은 정확히 복원하기 때문입니다.
        </p>
      </div>
    </section>
  );
}

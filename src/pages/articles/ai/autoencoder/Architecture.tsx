import ExplainedFormula from "@/components/ui/explained-formula";
import AutoFlowViz from "./viz/AutoFlowViz";

export default function Architecture() {
  return (
    <section id="architecture" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Encoder와 decoder는 어떤 계약으로 연결될까?</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Encoder는 입력 <code>x∈Rⁿ</code>을 latent vector <code>z∈Rᵏ</code>로
          바꾸고, decoder는 같은 <code>z</code>에서 입력과 같은 shape의
          reconstruction을 만듭니다. 두 network를 대칭으로 그리는 경우가 많지만
          필수 조건은 아닙니다. Decoder는 encoder의 수학적 inverse가 아니라,
          training data에서 <code>z</code>만 보고 <code>x</code>를 잘 복원하도록
          따로 학습되는 함수입니다.
        </p>
      </div>

      <ExplainedFormula
        question="Autoencoder의 forward pass에서 무엇이 압축되고, 어떤 값끼리 비교할까?"
        idea={<>두 함수를 순서대로 합성합니다. Encoder output z가 병목을 통과하는 유일한 정보이며, loss는 입력 x와 decoder output x̂를 비교합니다.</>}
        formula={String.raw`\begin{aligned}
z &= f_{\theta}(x) \\
f_{\theta}&:\mathbb{R}^{n}\to\mathbb{R}^{k} \\
\hat{x} &= g_{\phi}(z) \\
g_{\phi}&:\mathbb{R}^{k}\to\mathbb{R}^{n}
\end{aligned}`}
        terms={[
          { symbol: "x", name: "input", description: "복원할 관측값이며 batch에서는 첫 축이 sample을 나타냅니다." },
          { symbol: "f_θ", name: "encoder", description: "입력을 latent coordinates로 바꾸는 parameterized function입니다." },
          { symbol: "z", name: "latent representation", description: "Decoder로 전달되는 중간 표현입니다." },
          { symbol: "g_φ", name: "decoder", description: "Latent representation에서 reconstruction 또는 likelihood parameter를 만듭니다." },
          { symbol: "x̂", name: "reconstruction", description: "입력과 같은 shape을 가지며 선택한 loss에서 x와 비교합니다." },
        ]}
        assumptions={["Encoder와 decoder가 미분 가능한 parameterized function입니다.", "입력과 출력의 shape·범위가 loss의 가정과 맞습니다."]}
        interpretation="k<n이면 coordinate 수가 줄어드는 undercomplete bottleneck입니다. 그러나 k≥n이어도 noise나 sparsity가 정보 전달을 제한할 수 있으므로 dimension 하나만으로 압축 여부를 판정할 수는 없습니다."
      />

      <AutoFlowViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Bottleneck은 dimension 하나가 아니라 정보 경로 전체입니다</h3>
        <p>
          <code>k&lt;n</code>인 undercomplete model은 coordinate 수를 줄여 복사를
          어렵게 합니다. 반대로 overcomplete model은 <code>k≥n</code>이라도
          activation 일부만 켜도록 만들거나, 입력에 noise를 더하거나, decoder
          capacity를 제한해 유용한 특징을 학습할 수 있습니다. 이미지에는 CNN,
          sequence에는 Transformer처럼 입력 구조에 맞는 backbone도 선택할 수
          있습니다.
        </p>
        <p>
          Latent dimension이 너무 작으면 필요한 정보까지 사라지고, 제약 없이 너무
          큰 model을 쓰면 sample을 외우기 쉽습니다. 따라서 latent size는 validation
          reconstruction뿐 아니라 linear probe, retrieval, clustering처럼 실제로
          representation을 사용할 task와 함께 선택해야 합니다.
        </p>
      </div>
    </section>
  );
}

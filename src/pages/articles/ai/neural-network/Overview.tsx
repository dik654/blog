import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import RepresentationPipelineViz from "./viz/RepresentationPipelineViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">신경망은 입력을 여러 표현 공간으로 옮기는 함수 합성이다</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          단일 <Link to="/ai/perceptron">퍼셉트론</Link>은 하나의 affine score로
          입력 공간을 나누기 때문에 XOR처럼 한 직선으로 분리되지 않는 패턴을 표현하지
          못한다. Multi-layer perceptron(MLP)은 affine transformation과 nonlinear
          activation을 여러 번 합성해 이 제약을 푼다. 앞쪽 layer는 관측 feature를
          중간 표현으로 바꾸고, 뒤쪽 layer는 그 표현을 task의 예측 parameter로 바꾼다.
        </p>
        <p>
          이때 hidden layer가 “숨겨져 있다”는 말은 값을 볼 수 없다는 뜻이 아니다.
          각 hidden activation은 얼마든지 기록하고 시각화할 수 있지만, 어느 unit이
          어떤 feature를 맡아야 하는지 정답 label로 직접 감독하지 않는다. 최종 objective의
          gradient가 모든 layer를 함께 조정하면서 유용한 internal representation이
          만들어진다. 이 관점이 neuron 그림보다 실제 tensor·framework 동작에 가깝다.
        </p>
      </div>

      <RepresentationPipelineViz />

      <ExplainedFormula
        question="L개의 layer가 있는 MLP 전체를 하나의 예측 함수로 어떻게 표현할까?"
        idea={<>각 layer는 이전 activation을 affine transformation으로 옮긴 뒤 activation φ를 적용합니다. 이 관계를 재귀적으로 반복하면 전체 network는 parameter θ를 가진 함수 합성이 됩니다.</>}
        formula={String.raw`\begin{aligned}a^{(0)}&=x\\z^{(\ell)}&=a^{(\ell-1)}W^{(\ell)}+b^{(\ell)}\\a^{(\ell)}&=\phi^{(\ell)}\!\left(z^{(\ell)}\right)\\F_\theta(x)&=f^{(L)}_\theta\circ\cdots\circ f^{(1)}_\theta(x)\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}a^{(0)}&=\underbrace{x}_{\text{오른쪽 항으로 결과 계산}}\\z^{(\ell)}&=\underbrace{a^{(\ell-1)}W^{(\ell)}+b^{(\ell)}}_{\text{오른쪽 항으로 결과 계산}}\\a^{(\ell)}&=\underbrace{\phi^{(\ell)}\!\left(z^{(\ell)}\right)}_{\text{허용 경계 판정}}\\F_\theta(x)&=f^{(L)}_\theta\circ\cdots\circ f^{(1)}_\theta(x)\end{aligned}`}
        operations={[
          { expression: String.raw`x`, annotation: ["왼쪽 결과를 오른쪽의 실제 항으로 계산합니다.","각 layer는 이전 activation을 affine","transformation으로 옮긴 뒤 activation","φ를 적용합니다."] },
          { expression: String.raw`a^{(\ell-1)}W^{(\ell)}+b^{(\ell)}`, annotation: ["왼쪽 결과를 오른쪽의 실제 항으로 계산합니다.","각 layer는 이전 activation을 affine","transformation으로 옮긴 뒤 activation","φ를 적용합니다."] },
          { expression: String.raw`\phi^{(\ell)}\!\left(z^{(\ell)}\right)`, annotation: ["계산한 양을 허용 경계와 비교해 상태를 판정합니다.","각 layer는 이전 activation을 affine","transformation으로 옮긴 뒤 activation","φ를 적용합니다."] },
        ]}
        terms={[
          { symbol: "a^{(\\ell)}", name: "layer activation", description: "Layer ℓ이 다음 layer에 넘기는 learned representation입니다." },
          { symbol: "W^{(\\ell)},b^{(\\ell)}", name: "trainable parameters", description: "좌표를 섞고 이동시키는 weight와 bias입니다." },
          { symbol: "\\phi^{(\\ell)}", name: "activation", description: "Affine layer들이 하나로 접히지 않게 하는 nonlinear function입니다." },
          { symbol: "F_\\theta", name: "network function", description: "모든 layer parameter를 θ로 묶은 end-to-end mapping입니다." },
        ]}
        assumptions={["행 vector·right-multiplication 표기이며 framework의 weight storage는 transpose 형태일 수 있습니다.", "마지막 layer의 φ는 hidden activation과 같을 필요가 없고 target의 확률 모델에 따라 달라집니다."]}
        interpretation="Depth는 함수 합성 단계의 수를 늘리지만, 깊다는 사실만으로 학습이나 일반화가 좋아지는 것은 아닙니다. Initialization·normalization·optimization과 data가 함께 맞아야 합니다."
      />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>표현 가능성과 학습 가능성을 구분한다</h3>
        <p>
          Universal approximation theorem은 조건을 만족하는 단일 hidden layer가
          compact domain의 연속 함수를 임의의 정확도로 근사할 수 있다는 존재 정리다.
          필요한 width가 현실적인지, finite data에서 원하는 함수를 찾을 수 있는지,
          optimizer가 그 parameter에 도달하는지는 보장하지 않는다. 따라서 “한 층이면
          충분하다”거나 “깊을수록 정확하다”는 결론으로 읽으면 범위를 벗어난다.
          이 경계는 <a href="https://doi.org/10.1007/BF02551274" target="_blank" rel="noreferrer">Cybenko의 원 논문</a>에서
          정리의 조건과 함께 확인할 수 있다.
        </p>
        <p>
          이 글은 MLP forward contract와 출력 설계를 다룬다. Gradient를 효율적으로
          계산하는 reverse-mode autodiff와 parameter update는
          <Link to="/ai/backprop-optimization">역전파·최적화 글</Link>이 소유하고,
          activation별 derivative와 gated FFN은
          <Link to="/ai/activation-functions">활성화 함수 글</Link>에서 확장한다.
        </p>
      </div>
    </section>
  );
}

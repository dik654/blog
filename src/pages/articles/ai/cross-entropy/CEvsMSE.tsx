import ExplainedFormula from "@/components/ui/explained-formula";
import LikelihoodChoiceViz from "./viz/LikelihoodChoiceViz";

export default function CEvsMSE({ title }: { title?: string }) {
  return (
    <section id="ce-vs-mse" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">{title ?? "CE와 MSE의 선택은 관측값의 likelihood 가정에서 시작한다"}</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          “분류에는 cross-entropy, 회귀에는 MSE”는 유용한 기본값이지만 원인은 문제의 이름이 아니다. 모델 output이 어떤 조건부 분포의 parameter인지 먼저 정하고
          관측 label의 negative log-likelihood를 계산하면 알맞은 loss가 나온다. Categorical 분포에는 cross-entropy가, 고정 variance
          Gaussian에는 상수항과 scale을 제외한 MSE가 대응한다.
        </p>
      </div>

      <ExplainedFormula
        question="왜 Gaussian regression에서는 MSE가, categorical classification에서는 cross-entropy가 자연스럽게 나오는가?"
        idea={<>같은 maximum likelihood 원칙에 서로 다른 관측 분포를 넣습니다. Gaussian의 log density는 squared residual을 만들고, categorical likelihood의 log는 정답 확률의 negative log를 만듭니다.</>}
        formula={String.raw`\begin{aligned}\mathcal L_{\rm Gaussian}&=\frac{(y-\mu_\theta)^2}{2\sigma^2}+C\\[3pt]\mathcal L_{\rm Cat}&=-\log\operatorname{softmax}(z_\theta)_y\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}\mathcal L_{\rm Gaussian}&=\underbrace{\frac{(y-\mu_\theta)^2}{2\sigma^2}+C}_{\text{기준량당 비율}}\\[3pt]\mathcal L_{\rm Cat}&=\underbrace{-\log\operatorname{softmax}(z_\theta)_y}_{\text{선택 비율 정규화}}\end{aligned}`}
        operations={[
          { expression: String.raw`\frac{(y-\mu_\theta)^2}{2\sigma^2}+C`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","같은 maximum likelihood 원칙에 서로 다른 관측","분포를 넣습니다."] },
          { expression: String.raw`-\log\operatorname{softmax}(z_\theta)_y`, annotation: ["score를 합이 1인 선택 비율로 정규화합니다.","같은 maximum likelihood 원칙에 서로 다른 관측","분포를 넣습니다."] },
        ]}
        terms={[
          { symbol: "\\mu_\\theta", name: "predicted mean", description: "Gaussian conditional distribution의 평균 parameter입니다." },
          { symbol: "\\sigma^2", name: "noise variance", description: "고정하면 MSE의 scale만 바꾸지만 학습하면 별도 log variance 항이 필요합니다." },
          { symbol: "z_\\theta", name: "class logits", description: "Categorical probability를 만드는 normalized 전 score입니다." },
          { symbol: "C", name: "constant term", description: "θ와 무관해 fixed-variance optimization에서 생략할 수 있습니다." },
        ]}
        assumptions={["첫 식은 conditional Gaussian noise와 고정 σ를 가정합니다.", "두 번째 식은 mutually exclusive K-class categorical label을 가정합니다."]}
        interpretation="MSE와 CE는 경쟁하는 임의의 곡선이 아니라 서로 다른 데이터 생성 가정에서 나온 NLL이다. 따라서 multi-label, ordinal, count, survival 문제에서는 그에 맞는 likelihood를 다시 선택해야 합니다."
      />

      <LikelihoodChoiceViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>MSE를 분류에 쓰는 것이 금지된 것은 아니다</h3>
        <p>
          확률 vector에 Brier score인 squared error를 적용하면 calibration을 평가하는
          proper scoring rule이 된다. 다만 softmax probability 뒤에 MSE를 연결하면
          logit gradient에 softmax Jacobian이 한 번 더 곱해진다. 반면 softmax와
          cross-entropy의 결합은 gradient가 <code>p − y</code>로 정리되어 포화된
          오답에서도 직접적인 correction을 전달한다. 어떤 objective가 실제 metric에
          유리한지는 data noise와 calibration 요구까지 포함해 실험해야 한다.
        </p>
      </div>
    </section>
  );
}

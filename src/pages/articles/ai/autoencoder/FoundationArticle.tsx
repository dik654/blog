import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import { AutoencoderFoundationViz } from "./viz/ModernAutoencoderViz";

export default function FoundationArticle() {
  return <div className="space-y-16">
    <section id="overview" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Autoencoder는 입력을 좁은 중간 표현으로 옮겼다가 다시 복원합니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert"><p className="text-lg leading-8">처음에는 “압축”, “latent”, “representation learning”을 한꺼번에 외우지 않습니다. 입력 <code>x</code>를 encoder에 넣어 중간값 <code>z</code>를 만들고, decoder가 같은 입력 형태의 <code>x̂</code>를 만드는 가장 작은 계산부터 봅니다.</p></div>
      <TermBreakdown title="계산 경로의 대상 네 개" description="각 용어를 따로 정의한 뒤 아래 그림에서 하나의 복원 경로로 연결합니다." items={[
        { term: "Input · x", description: "복원하려는 관측값입니다. Sample 하나의 shape·단위·값 범위를 먼저 고정합니다.", example: "28×28 grayscale image 한 장은 784개 [0,1] 좌표로 펼칠 수 있습니다.", boundary: "Input이 target으로 재사용된다고 class label이 생기는 것은 아닙니다." },
        { term: "Encoder · fθ", description: "Input을 decoder에 넘길 latent representation으로 바꾸는 학습 가능한 함수입니다.", example: "784 coordinates를 32 coordinates로 바꿉니다.", boundary: "Encoder만 떼어 쓸지는 downstream 목적에 따라 별도로 결정합니다." },
        { term: "Latent · z", description: "Encoder output이자 decoder input인 중간 interface입니다.", example: "z∈R³²이면 decoder가 보는 값은 32개 coordinate입니다.", boundary: "32 coordinates는 32 bits나 32개의 사람다운 개념을 뜻하지 않습니다." },
        { term: "Decoder · gφ", description: "Latent만 보고 input과 같은 shape의 reconstruction을 만드는 별도 함수입니다.", example: "32 coordinates에서 784 pixel 값을 예측합니다.", boundary: "Encoder의 수학적 inverse일 필요는 없습니다." },
      ]} />
      <AutoencoderFoundationViz />
      <ContentBoundary article="autoencoder" />
    </section>

    <section id="bottleneck" className="scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">Bottleneck은 decoder가 볼 수 있는 정보 경로를 제한합니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert"><p><strong>Undercomplete bottleneck</strong>은 latent coordinate 수 <code>k</code>를 input dimension <code>n</code>보다 작게 둡니다. 128개 coordinate에서 16개만 넘기면 coordinate 비율은 1/8입니다. 하지만 real number의 precision과 network capacity가 남아 있으므로 이를 곧바로 “16-bit 압축”이라 부르면 안 됩니다.</p></div>
      <ExplainedFormula question="Encoder와 decoder의 domain을 어떻게 이어 한 번의 복원으로 만들까요?" idea={<p>Encoder가 만든 z만 decoder에 넘깁니다. 두 함수를 합성하되 input·latent·output shape를 식 안에 같이 표시합니다.</p>} formula={String.raw`z=f_\theta(x),\quad \hat x=g_\phi(z)`} annotatedFormula={String.raw`\begin{aligned}x\in\mathbb R^n&\xrightarrow{\ \underbrace{f_\theta}_{\text{n개 입력에서 k개 latent를 선택}}\ }z\in\mathbb R^k\\z&\xrightarrow{\ \underbrace{g_\phi}_{\text{latent만 보고 input shape를 복원}}\ }\hat x\in\mathbb R^n\end{aligned}`} operations={[
        { expression: String.raw`f_\theta:\mathbb R^n\to\mathbb R^k`, annotation: ["input 정보를 latent interface로", "학습 가능한 방식으로 변환"] },
        { expression: String.raw`g_\phi:\mathbb R^k\to\mathbb R^n`, annotation: ["latent 이외의 우회 경로 없이", "비교 가능한 input shape를 생성"] },
        { expression: String.raw`k<n`, annotation: ["전달 coordinate 수를 줄여", "그대로 복사하기 어렵게 제한"] },
      ]} terms={[
        { symbol: "n", name: "Input dimension", description: "Sample 하나의 coordinate 수입니다." },
        { symbol: "k", name: "Latent dimension", description: "Decoder에 전달되는 coordinate 수입니다." },
        { symbol: "θ,φ", name: "Trainable parameters", description: "Encoder와 decoder가 loss를 함께 받는 parameter입니다." },
      ]} assumptions={["Input과 reconstruction의 shape·좌표 의미가 대응합니다.", "Decoder에는 z 밖의 input shortcut이 없습니다."]} interpretation="k<n은 가장 단순한 capacity 제약입니다. Overcomplete model은 corruption·sparsity 같은 다른 제약이 필요할 수 있습니다." />
      <TermBreakdown title="Encoder·decoder weight를 묶을지(tied) 따로 둘지(untied)" items={[
        {
          term: "Tied weights (W_d = W_e^T)",
          description: "Linear encoder z=W_e x+b_e, decoder x̂=W_d z+b_d에서 decoder weight를 따로 학습하지 않고 encoder weight의 transpose로 고정합니다. Parameter 수가 절반으로 줄고, PCA의 orthogonal basis와 비슷한 정규화 효과를 냅니다.",
          example: "n=784, k=32이면 untied는 W_e·W_d를 각각 학습해 총 2×784×32개 parameter가 필요하지만, tied는 W_e 하나만 학습하고 W_d=W_e^T로 재사용합니다.",
          boundary: "Encoder·decoder 사이에 nonlinear activation이 있으면 tied weight가 정확한 inverse를 보장하지 않습니다 — 여전히 근사적인 정규화 효과일 뿐입니다.",
        },
        {
          term: "Untied weights",
          description: "Encoder와 decoder가 서로 독립된 parameter를 갖습니다. 표현력은 더 크지만 그만큼 identity로 collapse하거나 overfit할 여지도 커집니다.",
          boundary: "실무 선택은 모델 크기·데이터 양·regularization 필요도에 따라 갈립니다. 두 방식 중 한쪽이 항상 우월하다는 보장은 없습니다.",
        },
      ]} />
    </section>

    <section id="reconstruction" className="scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">Reconstruction objective는 좌표 오차를 학습 신호 하나로 만듭니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert"><p>연속값에 MSE를 쓰면 fixed-variance Gaussian의 mean을 예측하는 해석이 가능합니다. Binary coordinate에 BCE를 쓰면 Bernoulli probability를 예측합니다. Loss는 이름이 아니라 관측값의 범위·likelihood·reduction과 함께 선택합니다.</p></div>
      <ExplainedFormula question="Batch의 모든 coordinate 오차를 왜 제곱하고 평균할까요?" idea={<p>같은 위치의 차이를 먼저 만들고, 부호가 상쇄되지 않게 제곱한 뒤, batch와 feature 수가 달라도 비교하도록 평균합니다.</p>} formula={String.raw`\mathcal L_{\rm MSE}=\frac1{Bn}\sum_{b=1}^{B}\lVert x^{(b)}-\hat x^{(b)}\rVert_2^2`} annotatedFormula={String.raw`\begin{aligned}r_j^{(b)}&=\underbrace{x_j^{(b)}-\hat x_j^{(b)}}_{\text{같은 좌표의 residual}}\\e^{(b)}&=\underbrace{\frac1n\sum_{j=1}^{n}(r_j^{(b)})^2}_{\text{sample 안에서 제곱·평균}}\\\mathcal L_{\rm MSE}&=\underbrace{\frac1B\sum_{b=1}^{B}e^{(b)}}_{\text{batch 전체를 평균}}\end{aligned}`} operations={[
        { expression: String.raw`x_j^{(b)}-\hat x_j^{(b)}`, annotation: ["같은 sample·coordinate에서", "복원 residual을 계산"] },
        { expression: String.raw`(x_j^{(b)}-\hat x_j^{(b)})^2`, annotation: ["양·음 residual을 상쇄하지 않고", "큰 오차를 더 크게 반영"] },
        { expression: String.raw`\frac1{Bn}\sum_{b,j}`, annotation: ["모든 기여를 누적한 뒤", "coordinate 수로 정규화"] },
      ]} terms={[
        { symbol: "B", name: "Batch size", description: "한 update에서 함께 보는 sample 수입니다." },
        { symbol: "n", name: "Feature count", description: "Sample 하나에서 비교하는 coordinate 수입니다." },
        { symbol: "x̂", name: "Reconstruction", description: "Decoder가 만든 input-shaped prediction입니다." },
      ]} assumptions={["Feature scale과 missing-value policy가 고정되어 있습니다.", "MSE 해석에서는 coordinate noise scale을 같게 둡니다."]} interpretation="작은 MSE는 해당 좌표 scale에서 가깝다는 뜻입니다. Perceptual similarity나 downstream usefulness까지 자동으로 뜻하지 않습니다." />
      <ExplainedFormula
        question="Coordinate가 [0,1] 확률처럼 해석될 때 loss는 MSE와 무엇이 달라지나요?"
        idea={
          <p>
            각 coordinate를 독립 Bernoulli 확률로 보고 decoder output을 그
            확률의 추정치로 삼습니다. 실제 값이 1에 가까우면 예측도 1에
            가까워야 loss가 작아지고, 0에 가까우면 그 반대입니다.
          </p>
        }
        formula={String.raw`\mathcal L_{\rm BCE}=-\frac1{Bn}\sum_{b=1}^{B}\sum_{j=1}^{n}\Big[x_j^{(b)}\log \hat x_j^{(b)}+(1-x_j^{(b)})\log(1-\hat x_j^{(b)})\Big]`}
        annotatedFormula={String.raw`\begin{aligned}
\ell_j^{(b)}&=\underbrace{-\Big[x_j^{(b)}\log \hat x_j^{(b)}+(1-x_j^{(b)})\log(1-\hat x_j^{(b)})\Big]}_{\text{coordinate 하나의 negative log-likelihood}}\\
\mathcal L_{\rm BCE}&=\underbrace{\frac1{Bn}\sum_{b,j}\ell_j^{(b)}}_{\text{모든 sample·coordinate 평균}}
\end{aligned}`}
        operations={[
          {
            expression: String.raw`x_j\log \hat x_j`,
            annotation: ["실제 값이 1일 때", "예측 확률이 1에 가까울수록 벌점이 줄어듦"],
          },
          {
            expression: String.raw`(1-x_j)\log(1-\hat x_j)`,
            annotation: ["실제 값이 0일 때", "예측 확률이 0에 가까울수록 벌점이 줄어듦"],
          },
          {
            expression: String.raw`-[\cdot]`,
            annotation: ["두 항을 더한 log-likelihood 부호를 뒤집어", "최소화할 양의 loss로 변환"],
          },
        ]}
        terms={[
          {
            symbol: String.raw`x_j^{(b)}`,
            name: "실제 값 (0 또는 1 근방)",
            description: "[0,1] 범위로 정규화한 coordinate입니다. 정확한 이진값과 연속 [0,1] target 모두 이 형태로 씁니다.",
          },
          {
            symbol: String.raw`\hat x_j^{(b)}`,
            name: "예측 확률",
            description: "Decoder output에 sigmoid를 씌워 (0,1) 구간으로 만든 예측입니다.",
          },
        ]}
        assumptions={[
          "예측 x̂ⱼ는 항상 (0,1) 구간 안에 있어야 하므로 decoder 마지막 층에 sigmoid가 필요합니다 — MSE에는 이 제약이 없습니다.",
          "이진 label뿐 아니라 [0,1] 사이 continuous target(정규화된 pixel 밝기 등)에도 그대로 적용하는 관례입니다.",
        ]}
        interpretation="MSE는 residual 크기에 비례해 벌점을 주지만 BCE는 예측이 정답과 반대 극단일 때(0인데 예측이 1에 가깝거나 그 반대) log가 발산해 훨씬 크게 벌점을 줍니다. 이진에 가까운 데이터(binarized MNIST 등)에는 BCE가 MSE보다 더 날카로운 gradient 신호를 만듭니다."
      />
    </section>

    <section id="evaluation" className="scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">복원이 잘돼도 representation이 유용하다는 결론은 따로 검증합니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>Capacity가 크고 제약이 약하면 model이 training input을 거의 그대로 복사하는 <strong>identity degeneracy</strong>에 가까워질 수 있습니다. 그래서 training reconstruction, held-out reconstruction, latent linear probe·retrieval·clustering을 다른 줄에 기록합니다.</p>
        <ul>
          <li><strong>다음 정리</strong><br /><Link to="/ai/linear-autoencoder-pca">Linear autoencoder가 PCA와 같아지는 조건</Link></li>
          <li><strong>다음 학습 목표</strong><br /><Link to="/ai/denoising-masked-autoencoders">Corruption과 masking으로 clean target 복원하기</Link></li>
          <li><strong>다음 운영 문제</strong><br /><Link to="/ai/reconstruction-anomaly-detection">Reconstruction score를 anomaly decision으로 calibration하기</Link></li>
          <li><strong>별도 sparse 경로</strong><br /><Link to="/ai/sparse-autoencoder">Overcomplete dictionary와 sparsity frontier</Link></li>
        </ul>
      </div>
      <div id="paper-deep-autoencoder" className="not-prose mt-8 scroll-mt-24"><CitationBlock source="Hinton & Salakhutdinov — Reducing the Dimensionality of Data with Neural Networks" citeKey={1} type="paper" href="https://doi.org/10.1126/science.1127647">작은 central layer를 둔 deep autoencoder의 nonlinear dimensionality-reduction 실험입니다. 논문의 pretraining·dataset·architecture 조건을 넘어 모든 autoencoder의 semantic latent를 보장한다고 일반화하지 않습니다.</CitationBlock></div>
    </section>
  </div>;
}

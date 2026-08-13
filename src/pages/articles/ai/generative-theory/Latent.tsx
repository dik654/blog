import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import LatentTradeoffViz from "./viz/LatentTradeoffViz";

export default function Latent() {
  return (
    <section id="latent" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Latent variable model은 보이지 않는 생성 원인 z를 적분해야 한다
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Latent-variable model은 먼저 z∼p(z)를 뽑고 decoder pθ(x|z)를 통해
          observation을 만든다고 가정한다. 같은 x를 설명할 z가 많으면 marginal
          likelihood pθ(x)=∫pθ(x|z)p(z)dz와 posterior pθ(z|x)의 계산이
          어려워진다. VAE는 tractable qφ(z|x)를 inference network로 학습해 log
          pθ(x)의 lower bound인 ELBO를 최적화한다.
        </p>
      </div>

      <ExplainedFormula
        question="Intractable posterior를 직접 계산하지 않고 latent model의 log-likelihood를 어떻게 낮은 쪽에서 최적화할까?"
        idea={
          <>
            임의의 qφ(z|x)를 곱하고 나눈 뒤 Jensen inequality를 적용하면
            reconstruction expectation에서 approximate posterior와 prior의 KL을
            뺀 ELBO가 나옵니다. ELBO와 log evidence의 차이는 qφ와 true
            posterior의 KL입니다.
          </>
        }
        formula={String.raw`\begin{aligned}R(x)&=\mathbb E_{q_\phi(z\mid x)}[\log p_\theta(x\mid z)]\\K(x)&=D_{KL}(q_\phi(z\mid x)\|p(z))\\\mathcal L_{ELBO}(x)&=R(x)-K(x)\\\log p_\theta(x)&=\mathcal L_{ELBO}(x)+D_{KL}(q_\phi\|p_\theta)\end{aligned}`}
        terms={[
          {
            symbol: "q_\phi(z\mid x)",
            name: "approximate posterior",
            description:
              "Encoder가 observation별 latent distribution을 amortized inference합니다.",
          },
          {
            symbol: "p_\theta(x\mid z)",
            name: "decoder likelihood",
            description:
              "Latent z에서 observation의 조건부 distribution을 정의합니다.",
          },
          {
            symbol: "p(z)",
            name: "prior",
            description:
              "Generation 때 sample하는 latent 기준 distribution입니다.",
          },
          {
            symbol: "D_{KL}(q_\phi\|p_\theta)",
            name: "inference gap",
            description: "ELBO가 true log evidence보다 낮은 정확한 차이입니다.",
          },
        ]}
        assumptions={[
          "qφ의 support가 posterior를 덮고 expectation의 Monte Carlo gradient를 계산할 수 있습니다.",
          "Reconstruction term의 형태는 Bernoulli·Gaussian 등 선택한 decoder likelihood에 따라 달라집니다.",
        ]}
        interpretation="ELBO는 reconstruction loss와 임의의 regularizer를 붙인 경험식이 아닙니다. Likelihood lower bound이며 q family가 제한되면 bound가 느슨해져 model fit과 inference error가 함께 섞입니다."
      />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Encoder, reparameterization, posterior collapse와 decoder likelihood의
          상세 유도는 <Link to="/ai/vae">VAE 글</Link>이 소유한다. 이 지도에서는
          flexible decoder를 얻는 대신 exact posterior와 exact likelihood를
          포기하는 선택만 다른 family와 비교한다.
        </p>

        <h3>Normalizing flow는 exact likelihood를 위해 가역성을 택한다</h3>
        <p>
          Flow는 단순한 base density의 z를 invertible function f로 data space에
          옮긴다. 역함수와 Jacobian determinant를 계산할 수 있으므로 exact
          likelihood, sampling과 latent inference를 모두 수행할 수 있지만, 모든
          dimension을 자유롭게 줄이거나 비가역 decoder를 쓸 수는 없다.
        </p>
      </div>

      <ExplainedFormula
        question="가역 변환이 data space의 volume을 늘리거나 줄일 때 density를 어떻게 보정할까?"
        idea={
          <>
            Probability mass는 좌표 변환 전후에 보존되어야 합니다. 작은 volume이
            f에 의해 늘어나면 단위 volume당 density는 그만큼 낮아지므로 inverse
            Jacobian determinant를 곱합니다.
          </>
        }
        formula={String.raw`\begin{aligned}z&=f^{-1}(x)\\J^{-1}&=\partial z/\partial x\\\log p_X(x)&=\log p_Z(z)+\log|\det J^{-1}|\end{aligned}`}
        terms={[
          {
            symbol: "f",
            name: "invertible transform",
            description:
              "Base sample z를 observation x로 보내는 bijection입니다.",
          },
          {
            symbol: "J_{f^{-1}}",
            name: "inverse Jacobian",
            description:
              "x의 작은 volume이 z 공간에서 얼마나 변하는지 나타냅니다.",
          },
          {
            symbol: "p_Z",
            name: "base density",
            description:
              "Gaussian처럼 sample과 density 계산이 쉬운 분포입니다.",
          },
        ]}
        assumptions={[
          "f가 differentiable bijection이며 x와 z의 dimension이 같습니다.",
          "Architecture는 determinant와 inverse를 tractable하게 계산하도록 설계됩니다.",
        ]}
        interpretation="Flow의 exact likelihood는 공짜가 아닙니다. Invertibility와 Jacobian 구조가 architecture를 제한하며, 높은 likelihood가 perceptual sample ranking과 일치하지 않을 수도 있습니다."
      />

      <LatentTradeoffViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Real NVP는 coupling transform으로 exact log-likelihood·sampling·latent
          inference를 함께 구현한 대표 사례입니다. VAE와 flow는 둘 다 latent를
          쓰지만 approximation을 두는 위치가 다르므로 “latent model”이라는
          이유만으로 같은 objective로 묶어서는 안 됩니다.
        </p>
      </div>

      <div
        id="paper-vae-map"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          논문 읽기 · Variational inference
        </p>
        <p className="mt-2 text-sm font-semibold">
          Auto-Encoding Variational Bayes
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Intractable posterior가 있는 latent-variable model을 amortized
          encoder와 reparameterization으로 학습하는 방법을 제시합니다. 이 논문의
          ELBO는 likelihood lower bound이지만, 모든 decoder에서 좋은 perceptual
          sample이나 disentangled latent를 자동으로 보장하지는 않습니다.
        </p>
        <a
          className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
          href="https://arxiv.org/abs/1312.6114"
          target="_blank"
          rel="noreferrer"
        >
          원 논문의 estimator·ELBO·실험 보기
        </a>
      </div>

      <div
        id="paper-real-nvp"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          논문 읽기 · Exact likelihood flow
        </p>
        <p className="mt-2 text-sm font-semibold">
          Density Estimation using Real NVP
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Affine coupling layer로 inverse와 Jacobian determinant를 계산 가능하게
          설계해 exact log-likelihood와 양방향 mapping을 함께 얻습니다. 이는
          invertible architecture라는 제약 아래의 결과이며, likelihood 순위가
          perceptual quality 순위와 같다는 주장은 아닙니다.
        </p>
        <a
          className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
          href="https://arxiv.org/abs/1605.08803"
          target="_blank"
          rel="noreferrer"
        >
          원 논문의 coupling transform·평가 보기
        </a>
      </div>
    </section>
  );
}

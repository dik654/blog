import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";

const pipeline = [
  ["Encode", "x에서 qφ(z|x)의 μ와 log σ²를 예측한다."],
  ["Sample", "ε∼N(0,I)를 z=μ+σ⊙ε로 변환한다."],
  ["Decode", "pθ(x|z)의 parameter를 출력한다."],
  ["Optimize", "ELBO로 data fit과 posterior regularization을 함께 학습한다."],
];

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        VAE는 latent-variable model을 neural network로 학습한다
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-lg leading-8">
          Variational autoencoder(VAE)는 관측값 <code>x</code>가 보이지 않는
          latent variable <code>z</code>에서 생성됐다고 가정합니다. Decoder는
          <code>pθ(x|z)</code>를 정의하고, encoder는 계산하기 어려운 true
          posterior
          <code>pθ(z|x)</code>를 <code>qφ(z|x)</code>로 근사한다. 이름에
          autoencoder가 들어가지만 목적은 단순 복원이 아니라 probabilistic
          generative model의 likelihood lower bound를 학습하는 것입니다.
        </p>
        <p>
          생성 모델 전체 지도에서 likelihood·latent variable·GAN·diffusion의
          관계를 먼저 보고 싶다면{" "}
          <Link to="/ai/generative-theory">생성 모델 지도</Link>
          에서 시작하면 됩니다. 이 글은 VAE가 posterior approximation과
          reparameterization으로 그 지도의 latent-variable 경로를 구현하는
          방법을 소유합니다.
        </p>
      </div>

      <ContentBoundary article="vae" />

      <div
        id="paper-aevb"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          논문 읽기 · VAE의 출발점
        </p>
        <p className="mt-2 text-sm font-semibold">
          Auto-Encoding Variational Bayes
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Continuous latent와 intractable posterior가 있는 directed model에서
          reparameterized lower-bound estimator와 amortized recognition model을
          제시합니다. 논문의 estimator 조건과 실험 범위를 넘어 모든 discrete
          latent나 decoder에 같은 식을 그대로 적용할 수 있다는 뜻은 아닙니다.
        </p>
        <a
          className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
          href="https://arxiv.org/abs/1312.6114"
          target="_blank"
          rel="noreferrer"
        >
          원 논문의 estimator·lower bound·실험 보기
        </a>
      </div>

      <figure
        data-viz="vae-training-path"
        className="not-prose my-8 rounded-xl border border-border/75 bg-card p-4 sm:p-6"
      >
        <figcaption className="mb-4 text-sm font-semibold">
          VAE의 한 번의 학습 경로
        </figcaption>
        <div className="grid gap-3 md:grid-cols-4">
          {pipeline.map(([title, body], index) => (
            <div
              key={title}
              className="relative rounded-xl border bg-background/90 p-4"
            >
              <p className="text-xs font-bold text-primary/70">0{index + 1}</p>
              <p className="mt-2 font-semibold">{title}</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {body}
              </p>
              {index < pipeline.length - 1 && (
                <span className="absolute -right-2.5 top-1/2 hidden -translate-y-1/2 rounded-full border bg-card px-1.5 py-0.5 text-xs md:block">
                  →
                </span>
              )}
            </div>
          ))}
        </div>
      </figure>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>VAE가 풀어야 하는 두 문제</h3>
        <p>
          첫째, <code>pθ(x)=∫pθ(x|z)p(z)dz</code>를 직접 계산하기 어려울 수
          있다. 둘째, posterior에서 sample을 뽑는 stochastic node를 통과해
          encoder parameter까지 낮은 분산의 gradient를 보내야 한다. ELBO가 첫
          문제를 tractable한 objective로 바꾸고, reparameterization trick이 두
          번째 문제에 pathwise gradient를 제공합니다.
        </p>
        <p>
          Tensor shape로 보면 batch가 <code>B</code>, latent dimension이
          <code>d</code>일 때 encoder의 <code>μ</code>와 <code>log σ²</code>, base
          noise <code>ε</code>, sample <code>z</code>는 모두
          <code>B×d</code>입니다. Batch 32와 <code>d=16</code>이라면 네 tensor가
          모두 32×16이고, decoder output은 관측값의 shape와 선택한 likelihood
          parameter 수에 맞춰 정해집니다.
        </p>
      </div>
    </section>
  );
}

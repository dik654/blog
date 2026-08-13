import { Link } from "react-router-dom";

const variants = [
  [
    "β-VAE",
    "KL에 β를 곱해 rate–distortion 균형을 바꾼다. β가 크다고 disentanglement가 자동 보장되지는 않는다.",
  ],
  [
    "Conditional VAE",
    "label이나 context를 encoder·decoder에 넣어 조건부 분포 p(x|c)를 학습한다.",
  ],
  [
    "VQ-VAE",
    "continuous posterior 대신 discrete codebook과 quantization을 사용해 token-like latent를 만든다.",
  ],
  [
    "Hierarchical VAE",
    "여러 scale의 latent를 두어 global structure와 local detail을 나눠 설명한다.",
  ],
];

export default function Applications() {
  return (
    <section id="applications" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        변형 모델은 latent 표현과 생성 조건을 바꾼다
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          VAE 계열은 image generation뿐 아니라 representation learning,
          missing-data imputation, molecule design와 anomaly scoring 등에
          사용됩니다. 공통점은 latent variable과 variational objective이고,
          prior·posterior family, decoder likelihood와 latent hierarchy를 어떻게
          정하느냐가 변형을 나눕니다.
        </p>
      </div>

      <figure className="not-prose my-8 grid gap-3 md:grid-cols-2">
        {variants.map(([name, body]) => (
          <div key={name} className="rounded-2xl border bg-card p-4 sm:p-5">
            <p className="font-mono text-sm font-bold text-primary">{name}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {body}
            </p>
          </div>
        ))}
      </figure>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>VQ-VAE와 latent diffusion은 같은 “VAE”라는 말로 묶지 않는다</h3>
        <p>
          VQ-VAE는 codebook의 discrete latent를 사용하며 perceptual quality와
          autoregressive prior 같은 후속 설계를 가능하게 했다. 그러나
          quantization 하나가 blurry output을 자동으로 해결하는 것은 아니다.
          Stable Diffusion 계열의 first-stage autoencoder는 pixel space를
          spatial latent로 압축해 diffusion compute를 줄이지만, 구체적인
          regularization과 compression factor는 model version마다 확인해야 한다.
        </p>
        <p>
          Latent에서 denoising을 수행하는 전체 경로는
          <Link to="/ai/diffusion-models"> Diffusion Models 글</Link>에서 이어서
          다룹니다.
        </p>
      </div>

      <div
        id="paper-vq-vae"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          논문 읽기 · Discrete latent
        </p>
        <p className="mt-2 text-sm font-semibold">
          Neural Discrete Representation Learning
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Continuous Gaussian posterior 대신 vector-quantized codebook과 학습된
          prior를 사용해 image·video·speech의 discrete representation을
          다룹니다. VQ-VAE의 objective와 straight-through update는 기본 Gaussian
          VAE의 ELBO 유도를 그대로 유지한 변형이 아니므로 두 방법을 구분해서
          읽어야 합니다.
        </p>
        <a
          className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
          href="https://arxiv.org/abs/1711.00937"
          target="_blank"
          rel="noreferrer"
        >
          원 논문의 codebook·objective·평가 보기
        </a>
      </div>
    </section>
  );
}

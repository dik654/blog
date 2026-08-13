import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";

const loop = [
  ["Noise level 선택", "Noise schedule에서 timestep을 뽑습니다."],
  ["학습 입력 생성", "Closed form으로 clean data에서 xₜ를 바로 만듭니다."],
  [
    "복원 방향 예측",
    "Network가 noise·x₀·velocity 중 정한 target을 예측합니다.",
  ],
  ["반복해서 생성", "Noise에서 시작해 sampler가 data 쪽으로 이동합니다."],
];

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Diffusion은 망가뜨리는 법을 먼저 정하고 복원 방향만 학습합니다
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-lg leading-8">
          깨끗한 사진에 Gaussian noise를 조금씩 더하면 어느 순간 화면 전체가
          무작위 점처럼 보입니다. Diffusion model은 이처럼 data를 noise로 보내는
          forward process를 사람이 먼저 고정하고, noisy sample에서 어느 방향으로
          돌아가야 하는지만 network에 학습시킵니다. 학습할 때는 임의 noise
          level의 sample을 한 번에 만들 수 있지만, 생성할 때는 보통 여러 번
          방향을 다시 물으며 noise에서 data 쪽으로 이동합니다.
        </p>
        <p>
          VAE·GAN과 비교한 전체 좌표는{" "}
          <Link to="/ai/generative-theory">생성 모델 지도</Link>가 소유합니다.
          이 글에서는 먼저 DDPM의 discrete noising을 숫자로 계산하고, noise
          prediction이 score가 되는 이유를 확인합니다. 그다음에{" "}
          <Link to="/ai/math-differential-equations-numerical-solvers">
            ODE·SDE와 numerical solver 기초
          </Link>
          를 재사용해 reverse SDE·probability-flow ODE·flow matching으로
          확장합니다. 마지막에는 같은 수학을 실제 image pipeline의 U-Net·latent
          autoencoder·CFG와 연결합니다.
        </p>
      </div>
      <ContentBoundary article="diffusion-models" />

      <div
        id="paper-ddpm"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          논문 읽기 · Discrete diffusion
        </p>
        <p className="mt-2 text-sm font-semibold">
          Denoising Diffusion Probabilistic Models
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Gaussian forward chain과 learned reverse process를 연결하고, weighted
          variational bound와 denoising score matching의 관계에서 simplified
          noise-prediction objective를 제시합니다. 논문의 1,000-step sampler와
          특정 U-Net recipe가 모든 diffusion model의 고정 조건이라는 뜻은
          아닙니다.
        </p>
        <a
          className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
          href="https://arxiv.org/abs/2006.11239"
          target="_blank"
          rel="noreferrer"
        >
          원 논문의 process·objective·algorithm 보기
        </a>
      </div>

      <figure
        data-viz="diffusion-overview"
        className="not-prose my-8 rounded-xl border border-border/75 bg-card p-4 sm:p-6"
      >
        <figcaption className="mb-5 text-sm font-semibold">
          Training과 sampling을 구분한 전체 흐름
        </figcaption>
        <div className="grid gap-3 md:grid-cols-4">
          {loop.map(([title, body], index) => (
            <div key={title} className="min-w-0 border-t border-border pt-4">
              <p className="text-xs font-bold text-primary/70">0{index + 1}</p>
              <p className="mt-2 font-semibold">{title}</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {body}
              </p>
            </div>
          ))}
        </div>
      </figure>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>DDPM이 바꾼 trade-off</h3>
        <p>
          DDPM은 adversarial game 없이 여러 noise level의 supervised target을
          회귀하므로 GAN보다 optimization을 다루기 쉬운 경우가 많습니다. 대신
          sample 하나를 만드는 데 denoiser를 여러 번 호출해야 합니다. 이후
          연구의 큰 축은 target parameterization, noise schedule, solver와
          distillation을 바꿔 적은 network function evaluation(NFE)에서도 품질을
          유지하는 것입니다.
        </p>
      </div>
    </section>
  );
}

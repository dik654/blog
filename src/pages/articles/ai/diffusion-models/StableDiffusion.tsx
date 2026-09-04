import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";

const pipeline = [
  ["Text encoder", "Prompt를 conditioning sequence로 바꿉니다."],
  [
    "Latent denoiser",
    "Compressed latent에서 timestep별 prediction을 만듭니다.",
  ],
  ["Sampler", "Prediction·schedule·guidance로 latent를 update합니다."],
  ["Image decoder", "마지막 latent를 pixel image로 복원합니다."],
];

export default function StableDiffusion() {
  return (
    <section id="stable-diffusion" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Latent diffusion은 denoising 공간을 pixel에서 compressed latent로
        옮깁니다
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Latent diffusion model(LDM)은 먼저 trained autoencoder로 image를
          spatial latent로 압축하고 그 latent에서 diffusion을 수행한다. Pixel
          grid보다 작은 representation을 처리해 denoiser compute를 줄이는 대신,
          autoencoder가 보존하지 못한 detail은 diffusion이 되찾을 수 없다는
          경계가 생긴다. 예를 들어 64×64 pixel grid를 8×8 spatial latent로
          줄이면 denoiser가 훑는 위치 수는 4,096개에서 64개로 64배
          감소합니다. 하지만 channel 수, network width, attention, NFE가 함께
          달라지므로 실제 FLOPs와 latency가 정확히 64배 좋아진다는 뜻은
          아닙니다. Autoencoder의 probabilistic objective는{" "}
          <Link to="/ai/vae">VAE 글</Link>
          에서 이어진다.
        </p>
        <p>
          “Stable Diffusion은 77×768 CLIP embedding을 쓴다” 같은 숫자는 특정 version의 계약입니다. Text encoder, token length,
          latent channel과 spatial compression은 version마다 달라지므로 LDM의 일반 원리와 checkpoint configuration을 구분해야 합니다.
        </p>
        <p>
          Pixel diffusion과 latent diffusion을 공정하게 비교하려면 data와 resolution, condition, denoiser FLOPs 예산을 맞추고
          autoencoder·latent shape·scaling을 기록합니다. 그다음 autoencoder reconstruction을 별도로 측정해 품질 ceiling을 확인합니다.
          Denoiser NFE·wall-clock·memory와 sample quality·coverage·condition adherence는 같은 evaluator에서 비교해야
          합니다. Spatial 위치 수만 맞추거나 FID 하나만 보는 실험으로는 어느 stage가 만든 차이인지 분리할 수 없습니다.
        </p>
      </div>

      <div
        id="paper-latent-diffusion"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          논문 읽기 · Compressed generation
        </p>
        <p className="mt-2 text-sm font-semibold">
          High-Resolution Image Synthesis with Latent Diffusion Models
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Pixel-space diffusion의 계산비를 줄이기 위해 pretrained autoencoder의 latent에서 denoising하고 cross-attention으로
          text·layout 같은 condition을 주입합니다. Latent 압축은 공짜가 아니며 autoencoder가 버린 detail은 diffusion stage가 원본에서
          복구할 수 없습니다.
        </p>
        <a
          className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
          href="https://arxiv.org/abs/2112.10752"
          target="_blank"
          rel="noreferrer"
        >
          원 논문의 perceptual compression·conditioning 실험 보기
        </a>
      </div>

      <figure className="not-prose my-8 rounded-2xl border bg-card p-4 sm:p-6">
        <figcaption className="mb-4 text-sm font-semibold">
          Text-to-image latent diffusion pipeline
        </figcaption>
        <div className="grid gap-3 md:grid-cols-4">
          {pipeline.map(([title, body], index) => (
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
        <h3>Classifier-free guidance는 두 prediction의 차이를 증폭한다</h3>
        <p>
          Classifier-free guidance(CFG)를 쓰는 model은 training 중 일부
          condition을 비워 conditional·unconditional behavior를 한 network에
          학습한다. Sampling에서는 두 prediction의 차이를 scale <code>w</code>로
          더해 condition 방향을 강화합니다.
        </p>
        <p>
          <code>w=1</code>은 위 식에서 conditional prediction이 되며 “조건을
          무시한 random generation”이 아니다. 큰 scale은 prompt alignment를 높일
          수 있지만 saturation, artifact와 diversity 감소를 일으킬 수 있다. 7.5
          같은 값도 보편적인 default가 아니라 checkpoint·sampler·step 수와 함께
          검증할 parameter입니다.
        </p>
        <p>
          예를 들어 unconditional prediction이 2이고 conditional prediction이
          1.5라면, <code>w=1</code>의 guided prediction은
          <code>2+1(1.5−2)=1.5</code>이고 <code>w=3</code>에서는
          <code>2+3(1.5−2)=0.5</code>입니다. 두 branch를 별도로 계산하는지 한
          batch로 묶는지에 따라 실제 NFE와 wall-clock 해석도 달라집니다.
        </p>

        <h3>제품 이름보다 component contract를 본다</h3>
        <p>
          ControlNet, LoRA, image adapter 같은 확장은 condition을 넣는 경로나 weight update 범위를 바꿉니다. 실제 pipeline을 재현할 때는
          model name만 기록하지 말고 autoencoder, text encoder, denoiser, scheduler, sampler, guidance scale과
          precision을 함께 고정해야 합니다.
        </p>
      </div>
      <ExplainedFormula
        question="별도 classifier 없이 text condition 방향을 sampling 중 어떻게 더 강하게 만들까?"
        idea={
          <>
            같은 noisy latent를 condition 없이 한 번, text condition과 함께 한
            번 예측한 뒤 두 결과의 차이를 condition이 만든 방향으로 봅니다. 그
            방향을 scale w만큼 더합니다.
          </>
        }
        formula={String.raw`\begin{aligned}
          \hat\epsilon={}&\epsilon_\theta(x_t,t,\varnothing) \\
          &+w\left[\epsilon_\theta(x_t,t,c)-\epsilon_\theta(x_t,t,\varnothing)\right]
        \end{aligned}`}
        terms={[
          {
            symbol: "c",
            name: "text condition",
            description:
              "prompt encoder가 만든 conditioning representation입니다.",
          },
          {
            symbol: String.raw`\varnothing`,
            name: "dropped condition",
            description:
              "training에서 condition을 비운 unconditional branch입니다.",
          },
          {
            symbol: "w",
            name: "guidance scale",
            description:
              "conditional direction을 증폭하는 sampling hyperparameter입니다.",
          },
        ]}
        assumptions={[
          "classifier-free guidance를 위해 condition dropout으로 conditional·unconditional behavior를 함께 학습한 model입니다.",
          "두 prediction 때문에 보통 denoiser evaluation 비용이 늘어납니다.",
        ]}
        interpretation="w=1이면 conditional prediction과 정확히 같아집니다. 큰 w는 prompt alignment를 높일 수 있지만 saturation·artifact·diversity 감소를 만들 수 있어 checkpoint와 sampler마다 검증해야 합니다."
      />

      <div
        id="paper-classifier-free-guidance"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          논문 읽기 · Guidance without classifier
        </p>
        <p className="mt-2 text-sm font-semibold">
          Classifier-Free Diffusion Guidance
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Conditional model과 별도 unconditional model을 따로 학습하는 대신 condition dropout으로 하나의 network가 두 score를 모두
          내도록 하고 inference 때 차이를 결합해 fidelity–diversity trade-off를 조절합니다. 큰 guidance scale이 모든 checkpoint와
          metric에서 더 좋다는 보장은 없습니다.
        </p>
        <a
          className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
          href="https://arxiv.org/abs/2207.12598"
          target="_blank"
          rel="noreferrer"
        >
          원 논문의 conditional·unconditional 결합 보기
        </a>
      </div>
    </section>
  );
}

import { Link } from "react-router-dom";

const path = [
  [
    "Down path",
    "Spatial resolution을 줄이며 넓은 receptive field의 feature를 만듭니다.",
  ],
  ["Middle", "가장 낮은 resolution에서 global context와 condition을 섞습니다."],
  ["Up path", "Resolution을 복원하며 같은 scale의 skip feature를 결합합니다."],
];

export default function UNet() {
  return (
    <section id="unet" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Denoiser는 noisy sample과 noise level을 함께 읽습니다
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Image DDPM은 전통적으로 multi-scale U-Net을 denoiser로 사용해 왔습니다. Contracting path가 넓은 context를 모으고 expanding
          path가 resolution을 복원하며 skip connection은 같은 spatial scale의 detail을 다시 전달합니다. ResNet의 identity
          shortcut과 목적이 완전히 같지는 않습니다. U-Net skip은 encoder feature를 decoder로 전달하는 long skip입니다. 차이는 거기에 있습니다.
        </p>
      </div>

      <div
        id="paper-unet"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          논문 읽기 · Multi-scale backbone
        </p>
        <p className="mt-2 text-sm font-semibold">
          U-Net: Convolutional Networks for Biomedical Image Segmentation
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          원 U-Net은 biomedical segmentation을 위해 contracting path와 symmetric expanding path, 같은 scale의 feature를
          잇는 long skip을 제안했습니다. Diffusion U-Net은 여기에 timestep embedding·residual block·attention을 더한 후속
          backbone입니다. 원 논문의 구조와 DDPM 구현은 구분해서 봐야 합니다.
        </p>
        <a
          className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
          href="https://arxiv.org/abs/1505.04597"
          target="_blank"
          rel="noreferrer"
        >
          원 U-Net의 contracting·expanding path 보기
        </a>
      </div>

      <figure
        data-viz="unet-path"
        className="not-prose my-8 grid gap-4 rounded-xl border border-border/75 bg-card p-4 md:grid-cols-3 md:p-6"
      >
        {path.map(([title, body], index) => (
          <div key={title} className="min-w-0 border-t border-border pt-4">
            <p className="text-xs font-bold text-primary/70">0{index + 1}</p>
            <p className="mt-2 font-semibold">{title}</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              {body}
            </p>
          </div>
        ))}
      </figure>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Timestep conditioning</h3>
        <p>
          같은 <code>xₜ</code>처럼 보여도 noise level에 따라 제거할 signal의
          scale이 다르므로 denoiser는 <code>t</code> 또는 continuous noise
          embedding을 입력받습니다. Sinusoidal feature를 쓰는 경우가 많지만
          Transformer positional encoding과 “동일한 원리”로 단정할 필요는
          없습니다. 둘 다 scalar를 여러 frequency의 feature로 확장하지만 주입
          위치와 학습 목적이 다릅니다.
        </p>

        <h3>Text conditioning과 architecture 변화</h3>
        <p>
          Text-to-image U-Net은 image feature를 query, text embedding을
          key/value로 쓰는 cross-attention 등을 통해 condition을 주입할 수 있다.
          그러나 모든 diffusion model이 U-Net이나 cross-attention을 쓰는 것은
          아니며, DiT 계열은 patch token을 처리하는 Transformer backbone을
          사용합니다. Attention 계산 자체는{" "}
          <Link to="/ai/attention-theory">Attention 이론 글</Link>에서 이어서 볼
          수 있습니다.
        </p>
      </div>
    </section>
  );
}

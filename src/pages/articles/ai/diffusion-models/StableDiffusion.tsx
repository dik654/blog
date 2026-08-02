import { CitationBlock } from '@/components/ui/citation';
import M from '@/components/ui/math';
import StableDiffusionArchScene from './viz/StableDiffusionArchScene';
import CFGSection from './CFGSection';
import SDPipelineScene from './viz/SDPipelineScene';

export default function StableDiffusion() {
  return (
    <section id="stable-diffusion" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Stable Diffusion (Latent Diffusion)</h2>
      <div className="not-prose mb-8"><StableDiffusionArchScene /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Pixel image <M>{'x_0'}</M> 는 크다.
          512×512×3 전체에서 diffusion loop 를 돌리면 매 step 비용이 커진다.
          먼저 VAE encoder 로 작은 latent <M>{'z_0'}</M> 를 만든다.
          이후 forward/reverse 는 <M>{'x_t'}</M> 대신 <M>{'z_t'}</M> 에서 진행된다.
          마지막에 VAE decoder 가 <M>{'z_0'}</M> 를 pixel image 로 되돌린다.
          이 구체 구조가 <strong>Latent Diffusion</strong>, Stable Diffusion 의 기반.
        </p>

        <CitationBlock source="Rombach et al., CVPR 2022 — Latent Diffusion" citeKey={4} type="paper"
          href="https://arxiv.org/abs/2112.10752">
          <p className="italic">
            "By introducing an autoencoding stage, we can train DMs on a compressed latent space,
            reducing training compute by at least 4x while maintaining generation quality."
          </p>
          <p className="mt-2 text-xs">
            512×512 image 를 64×64 latent 로 옮기면 같은 denoise loop 를 훨씬 작은 공간에서 돌릴 수 있다.
          </p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-6 mb-3">CLIP 텍스트 인코더</h3>
        <p>
          Prompt 문장은 바로 denoise 방향이 될 수 없다.
          Tokenizer 가 문장을 token 으로 자르고, CLIP text encoder 가 조건 sequence <M>{'c'}</M> 를 만든다.
          U-Net 은 <M>{'\\epsilon_\\theta(z_t,t,c)'}</M> 를 예측할 때 cross-attention 으로 이 조건을 조회한다.
          seed latent 는 시작점을 정하고, <M>{'c'}</M> 는 그 시작점이 어떤 의미 쪽으로 정리될지 정한다.
        </p>

        <CFGSection />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Latent Diffusion 전체 파이프라인</h3>
        <div className="not-prose"><SDPipelineScene /></div>
        <p className="leading-7">
          요약 1: <M>{'x_0 \\to z_0'}</M> 압축 뒤 latent 에서 diffusion 을 돌린다.<br />
          요약 2: Prompt 는 <M>{'c'}</M>, random seed 는 <M>{'z_T'}</M> 로 서로 다른 역할을 갖는다.<br />
          요약 3: ControlNet, LoRA, DreamBooth 는 이 latent denoise loop 주변에 조건이나 weight 조정을 붙인 확장이다.
        </p>
      </div>
    </section>
  );
}

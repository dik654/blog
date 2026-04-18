import { CitationBlock } from '@/components/ui/citation';
import StableDiffusionArchViz from './viz/StableDiffusionArchViz';
import CFGSection from './CFGSection';
import SDPipelineViz from './viz/SDPipelineViz';

export default function StableDiffusion() {
  return (
    <section id="stable-diffusion" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Stable Diffusion (Latent Diffusion)</h2>
      <div className="not-prose mb-8"><StableDiffusionArchViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Stable Diffusion — <strong>Latent Diffusion Model(LDM)</strong> 기반<br />
          픽셀 공간이 아닌 <strong>잠재 공간(latent space)</strong>에서 확산 과정 수행<br />
          계산 비용을 크게 줄이면서도 고품질 이미지 생성
        </p>

        <CitationBlock source="Rombach et al., CVPR 2022 — Latent Diffusion" citeKey={4} type="paper"
          href="https://arxiv.org/abs/2112.10752">
          <p className="italic">
            "By introducing an autoencoding stage, we can train DMs on a compressed latent space,
            reducing training compute by at least 4x while maintaining generation quality."
          </p>
          <p className="mt-2 text-xs">
            512x512 이미지를 64x64 잠재 벡터로 압축 처리 —
            48배 이상 공간 압축으로 일반 GPU에서도 학습/추론 가능
          </p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-6 mb-3">CLIP 텍스트 인코더</h3>
        <p>
          텍스트 프롬프트 → <strong>CLIP 텍스트 인코더</strong>로 77개 토큰 x 768차원의 임베딩 시퀀스로 변환<br />
          이 임베딩이 U-Net의 Cross-Attention에 전달<br />
          텍스트 의미에 맞는 이미지 생성을 유도
        </p>

        <CFGSection />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Latent Diffusion 전체 파이프라인</h3>
        <div className="not-prose"><SDPipelineViz /></div>
        <p className="leading-7">
          요약 1: Stable Diffusion의 본질은 <strong>Latent Diffusion</strong> — VAE 압축 후 diffusion.<br />
          요약 2: <strong>48배 공간 압축</strong>으로 소비자 GPU에서도 학습/추론 가능.<br />
          요약 3: <strong>ControlNet·LoRA·DreamBooth</strong> 등 풍부한 생태계 — 오픈소스 혁명.
        </p>
      </div>
    </section>
  );
}

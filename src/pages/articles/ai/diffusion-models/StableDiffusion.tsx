import { CitationBlock } from '@/components/ui/citation';
import StableDiffusionArchViz from './viz/StableDiffusionArchViz';
import CFGSection from './CFGSection';

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
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Stable Diffusion 전체 구조
//
// [1] Image Space (512×512×3 = 786K dims)
//         ↓ VAE Encoder (8× downsample)
// [2] Latent Space (64×64×4 = 16K dims) ← 48× 압축
//         ↓ Diffusion Process (U-Net)
// [3] Generated Latent
//         ↓ VAE Decoder
// [4] Generated Image
//
// 핵심 통찰:
//   이미지 픽셀 공간은 redundant
//   "semantic" 정보는 훨씬 작은 latent space에 압축 가능
//   Diffusion을 latent에서 하면 48배 효율적

// 학습:
//   1. VAE 먼저 학습 (autoencoder 단독)
//   2. VAE encoder 고정, diffusion U-Net 학습
//   3. latent에서 forward/reverse process
//
// 추론 (Text-to-Image):
//   Input: "A cat sitting on a red chair"
//   1. CLIP tokenizer → 77 tokens
//   2. CLIP text encoder → (77, 768) embedding
//   3. z_T ~ N(0, I), shape (4, 64, 64)
//   4. for t = T, T-1, ..., 1:
//        ε̂ = UNet(z_t, t, text_emb)
//        z_{t-1} = denoise(z_t, ε̂, t)
//      50~100 steps
//   5. x = VAE_decoder(z_0)
//   6. Output: 512×512 image

// Stable Diffusion 버전:
//   SD 1.x (2022): 원조, 512×512, 860M UNet
//   SD 2.x (2022): CLIP-OpenAI → OpenCLIP, 768×768
//   SDXL (2023): 1024×1024, 3.5B params, 두 VAE
//   SD3 (2024): MM-DiT (transformer), flow matching
//   Cascade (2024): 3-stage cascade

// 생태계:
//   - ControlNet: pose/edge/depth 제어
//   - LoRA: 캐릭터/스타일 fine-tuning
//   - DreamBooth: 특정 객체 학습
//   - IP-Adapter: 이미지 prompt
//   - AnimateDiff: 애니메이션 생성`}
        </pre>
        <p className="leading-7">
          요약 1: Stable Diffusion의 본질은 <strong>Latent Diffusion</strong> — VAE 압축 후 diffusion.<br />
          요약 2: <strong>48배 공간 압축</strong>으로 소비자 GPU에서도 학습/추론 가능.<br />
          요약 3: <strong>ControlNet·LoRA·DreamBooth</strong> 등 풍부한 생태계 — 오픈소스 혁명.
        </p>
      </div>
    </section>
  );
}

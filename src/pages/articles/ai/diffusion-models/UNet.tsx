import { CitationBlock } from '@/components/ui/citation';
import UNetArchViz from './viz/UNetArchViz';
import UNetCodeSection from './UNetCodeSection';

export default function UNet() {
  return (
    <section id="unet" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">U-Net 아키텍처</h2>
      <div className="not-prose mb-8"><UNetArchViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Diffusion 모델의 노이즈 예측기로 <strong>U-Net</strong> 사용<br />
          인코더-디코더 구조에 <strong>Skip Connection</strong> 추가<br />
          고해상도 디테일과 저해상도 의미 정보를 동시에 활용
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">시간 임베딩 (Timestep Embedding)</h3>
        <p>
          U-Net은 현재 시점 t를 입력으로 받아야 함<br />
          Transformer의 positional encoding과 유사한 <strong>사인파 임베딩</strong>으로 t를 고차원 벡터로 변환<br />
          각 ResBlock에 주입하여 네트워크가 노이즈 수준을 인식
        </p>

        <CitationBlock source="Ronneberger et al., MICCAI 2015 — U-Net" citeKey={3} type="paper"
          href="https://arxiv.org/abs/1505.04597">
          <p className="italic">
            "The contracting path captures context while the symmetric expanding path
            enables precise localization through skip connections."
          </p>
          <p className="mt-2 text-xs">
            원래 의료 영상 분할용으로 설계된 U-Net이 Diffusion에서 노이즈 예측기로 채택되어
            핵심 아키텍처가 되었습니다.
          </p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-6 mb-3">Cross-Attention (텍스트 조건)</h3>
        <p>
          텍스트 조건부 생성을 위해 U-Net 내부에 <strong>Cross-Attention 레이어</strong> 삽입<br />
          이미지 특징이 Query, 텍스트 임베딩이 Key/Value<br />
          텍스트의 의미가 이미지 생성 과정에 반영
        </p>

        <UNetCodeSection />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">U-Net 구조 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Diffusion U-Net 구조 (Stable Diffusion 기준)
//
// 입력: x_t (noisy image), t (timestep), c (text condition)
//
// Time Embedding:
//   t → sinusoidal embedding → MLP → t_emb
//   모든 ResBlock에 주입
//
// Text Embedding (조건부):
//   prompt → CLIP text encoder → (77, 768) tokens
//   Cross-attention으로 U-Net에 주입
//
// Downsampling Path (Encoder):
//   [ResBlock + Attention + Down] × 4
//   해상도: 64 → 32 → 16 → 8
//   채널: 320 → 640 → 1280 → 1280
//
// Middle Block:
//   ResBlock + Attention + ResBlock
//   해상도 8, 채널 1280
//
// Upsampling Path (Decoder):
//   [Up + ResBlock + Attention] × 4
//   해상도: 8 → 16 → 32 → 64
//   Skip connection으로 encoder 특징과 concat
//
// Output:
//   Conv → ε̂ (예측 노이즈)
//
// 파라미터 수 (SD 1.5):
//   약 860M parameters
//   주로 attention과 conv

// Transformer Block:
//   각 spatial location에서:
//     1. Self-Attention (이미지 특징 간)
//     2. Cross-Attention (텍스트 조건)
//     3. FeedForward
//   + residual, layer norm

// 최신 변형 (2023~):
//   - DiT (Diffusion Transformer): U-Net 대신 Transformer
//   - SD3, Stable Cascade: transformer 기반
//   - Multi-resolution training
//   - Consistency distillation`}
        </pre>
        <p className="leading-7">
          요약 1: U-Net의 <strong>skip connection</strong>이 다양한 스케일 정보 보존.<br />
          요약 2: <strong>time/text embedding</strong>이 생성 제어 핵심.<br />
          요약 3: 최근 SD3는 <strong>DiT (Diffusion Transformer)</strong>로 이동 — U-Net 대체.
        </p>
      </div>
    </section>
  );
}

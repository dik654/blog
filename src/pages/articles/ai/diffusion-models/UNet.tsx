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
    </section>
  );
}

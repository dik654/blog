import { CitationBlock } from '@/components/ui/citation';
import LtxBlockViz from './viz/LtxBlockViz';

export default function LatentSpace() {
  return (
    <section id="latent-space" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">1단계: 영상과 오디오를 잠재 토큰으로 압축하기</h2>
      <div className="not-prose mb-8"><LtxBlockViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          LTX-2의 내부 구조는 “영상 모델 하나”가 아니라 <strong>압축기 + patchifier + dual-stream transformer</strong>로 봐야 한다.
          Video VAE는 픽셀 프레임을 spatiotemporal latent grid로 압축하고, Audio VAE는 오디오를 spectrogram latent로 압축한다.
          이 latent들은 바로 attention에 들어가지 않고 patchifier를 거쳐 토큰 시퀀스가 된다.
        </p>
        <p>
          이 단계가 중요한 이유는 계산량 때문이다. 원본 영상은 <code>프레임 수 × 높이 × 너비 × 채널</code> 규모의 픽셀 덩어리다.
          여기에 그대로 attention을 걸면 토큰 수가 폭발한다. VAE는 먼저 공간과 시간을 압축해 “복원 가능한 작은 격자”를 만들고,
          patchifier는 이 격자를 transformer가 읽는 1차원 token 목록으로 펼친다. 즉 DiT가 보는 것은 픽셀이 아니라
          <strong> 압축된 시공간 패치 token</strong>이다.
        </p>
        <p>
          video token은 x, y, t 위치를 모두 갖기 때문에 3D RoPE가 맞고, audio token은 시간 축 중심이라 1D temporal RoPE가 맞다.
          이 차이를 하나의 stream에 억지로 넣지 않고, modality별 stream으로 분리한 뒤 cross-attention으로 교환하는 것이 LTX-2의 핵심이다.
        </p>
        <h3>토큰화 과정을 더 잘게 나누면</h3>
        <ol>
          <li>영상 입력은 프레임 묶음으로 들어오고, Video VAE encoder가 시간과 공간을 함께 압축한다.</li>
          <li>오디오 입력은 파형 그대로가 아니라 모델이 다루기 쉬운 주파수/시간 표현을 거쳐 Audio VAE latent가 된다.</li>
          <li>각 latent grid는 patchifier를 지나 토큰 시퀀스가 된다. 이때 영상은 3D 위치, 오디오는 시간 위치가 붙는다.</li>
          <li>텍스트 prompt는 별도 text encoder를 지나 conditioning token이 되고, DiT block의 cross-attention으로 들어간다.</li>
          <li>denoising이 끝난 latent는 decoder와 upscaler를 지나 다시 사람이 보는 영상/오디오가 된다.</li>
        </ol>
        <CitationBlock source="LTX-Video: Realtime Video Latent Diffusion" citeKey={3} href="https://arxiv.org/abs/2501.00103">
          <p>
            LTX-Video 논문은 transformer 기반 latent diffusion에서 Video-VAE와 denoising transformer의 역할을
            함께 설계해, 시간 일관성과 빠른 고해상도 생성을 목표로 한다고 설명한다.
          </p>
        </CitationBlock>
        <p>
          VAE는 단순 압축기가 아니다. 좋은 VAE는 픽셀 디테일을 보존하면서도 diffusion transformer가 예측하기 쉬운 표현 공간을 만든다.
          그래서 LTX-2.3에서 spatial upscaler와 decoder 경로가 모델 본체만큼 중요하다. latent가 나쁘면 transformer가 아무리 커도
          decoder 단계에서 질감, edge, 시간 일관성이 무너진다.
        </p>
        <p>
          학습자가 특히 조심해야 할 지점은 “압축”과 “토큰화”를 같은 말로 쓰지 않는 것이다. 압축은 VAE가 수행하며,
          원본 media를 더 작은 latent grid로 바꾼다. 토큰화는 patchifier가 수행하며, 이미 압축된 latent grid를 transformer 입력
          순서로 재배열한다. 따라서 VAE 품질은 복원 품질과 artifact에 영향을 주고, patchifier/position encoding 설계는 attention이
          시간적 순서와 공간적 이웃을 얼마나 잘 이해하는지에 영향을 준다.
        </p>
        <p>
          위 Viz에서 보듯, LTX-2의 transformer block은 네 단계로 읽으면 된다. 먼저 각 stream이 자기 modality 안에서
          self-attention을 수행한다. 그 다음 text embedding을 cross-attention으로 주입한다. 이후 audio-video cross-attention이
          들어가고, 마지막에 cross-modality AdaLN과 FFN이 다음 denoising state를 만든다. 이 순서 때문에 LTX는
          “비디오 생성 후 오디오 붙이기”가 아니라 <strong>audio-video joint generation</strong>으로 이해해야 한다.
        </p>
      </div>
    </section>
  );
}

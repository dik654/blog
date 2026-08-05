import { CitationBlock } from '@/components/ui/citation';
import M from '@/components/ui/math';
import UNetArchScene from './viz/UNetArchScene';
import UNetCodeSection from './UNetCodeSection';
import UNetDetailScene from './viz/UNetDetailScene';

export default function UNet() {
  return (
    <section id="unet" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">U-Net 아키텍처</h2>
      <div className="not-prose mb-8"><UNetArchScene /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Reverse step 에 필요한 출력은 image 가 아니라 noise 예측 <M>{'\\epsilon_\\theta'}</M>.
          입력 <M>{'x_t'}</M> 에는 작은 얼룩부터 큰 구조까지 noise 가 섞여 있다.
          좁은 convolution 만 쓰면 넓은 문맥이 부족하고, 해상도를 너무 줄이면 위치 디테일이 사라진다.
          그래서 down path 로 문맥을 모으고, up path 로 해상도를 복원하며, skip connection 으로 위치 정보를 되돌린다.
          이 구조가 <strong>U-Net</strong>.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">시간 임베딩 (Timestep Embedding)</h3>
        <p>
          같은 <M>{'x_t'}</M> 모양이라도 step <M>{'t'}</M> 가 다르면 빼야 할 noise 크기가 다르다.
          스칼라 <M>{'t'}</M> 를 그대로 더하면 block 안 feature 와 차원이 맞지 않는다.
          먼저 sin/cos 값 묶음으로 펼치고 MLP 를 지나 <M>{'t_{emb}'}</M> 를 만든다.
          각 ResBlock 은 이 값을 더해 현재 noise level 을 알게 된다.
        </p>

        <CitationBlock source="Ronneberger et al., MICCAI 2015 — U-Net" citeKey={3} type="paper"
          href="https://arxiv.org/abs/1505.04597">
          <p className="italic">
            "The contracting path captures context while the symmetric expanding path
            enables precise localization through skip connections."
          </p>
          <p className="mt-2 text-xs">
            Diffusion 에서는 같은 encoder-decoder 구조가 위치 디테일과 넓은 문맥을 동시에 보존하는 noise predictor 로 쓰인다.
          </p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-6 mb-3">Cross-Attention (텍스트 조건)</h3>
        <p>
          텍스트 조건 <M>{'c'}</M> 는 prompt token embedding 시퀀스다.
          U-Net feature 는 “현재 이미지 위치가 무엇을 참고해야 하는가”를 query 로 낸다.
          텍스트 token 은 key/value 로 들어간다.
          <M>{'\\mathrm{softmax}(QK^\\top/\\sqrt d)V'}</M> 는 image feature 가 prompt token 중 필요한 의미를 골라 섞는 연산이다.
        </p>

        <UNetCodeSection />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">U-Net 구조 상세</h3>
        <div className="not-prose"><UNetDetailScene /></div>
        <p className="leading-7">
          요약 1: <M>{'x_t'}</M> 는 image/latent 상태, <M>{'t'}</M> 는 noise level, <M>{'c'}</M> 는 조건 방향이다.<br />
          요약 2: U-Net 은 이 세 입력을 합쳐 <M>{'\\epsilon_\\theta(x_t,t,c)'}</M> 를 만든다.<br />
          요약 3: 최근 모델은 같은 역할을 Transformer block 으로 옮긴다. 이 계열이 DiT.
        </p>
      </div>
    </section>
  );
}

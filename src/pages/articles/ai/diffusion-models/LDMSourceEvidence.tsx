import {
  CapabilityCheck,
  InternalLink,
  Misconception,
  SourceNotes,
} from '@/components/learning/ArticleLearning';
import SourceFormula from './SourceFormula';
import { CompressionTradeoffLab, LdmEvidenceReceipt } from './viz/LDMSourceLabs';

export default function LDMSourceEvidence() {
  return (
    <section id="latent-diffusion-source" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Latent Diffusion은 계산 공간을 줄이되 생성이 필요한 정보를 남기는 두 단계 설계다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Pixel diffusion은 눈으로 거의 구분하기 어려운 고주파 세부까지 큰 RGB grid에서 반복 계산한다. Rombach et al.은 이 부담을
          두 문제로 나눴다. 먼저 autoencoder <code>E,D</code>를 perceptual loss와 patch discriminator로 학습해 사람이 인지할
          구조를 보존한 작은 2D latent를 만든다. 그 뒤 diffusion model은 이 고정된 latent 공간에서 semantic variation을 학습한다.
        </p>
        <p>
          이 분리는 “VAE에 이미지를 넣으면 알아서 빨라진다”가 아니다. 압축이 약하면 diffusion이 pixel detail 부담을 계속 지고,
          압축이 너무 강하면 decoder가 원래 없어진 작은 글자·경계·정밀 위치를 복구할 수 없다. 그래서 first-stage reconstruction과
          second-stage generation을 같은 축으로 측정해야 한다.
        </p>
        <p>
          두 극단을 비교하면 trade-off가 분명하다. <code>f=1</code>은 autoencoder가 없는 pixel identity라 first-stage
          reconstruction bottleneck은 없지만 denoiser가 65,536개 위치를 모두 처리한다. <code>f=32</code>는 공간 위치를
          1,024배 줄이지만, 원문 Table 8의 VQ 설정은 R-FID 31.83·PSNR 17.45였다. 같은 <code>f=32</code>라도 더 큰 KL
          latent 설정은 R-FID 2.04·PSNR 22.27이므로 압축 배수 하나만으로 품질을 예측할 수도 없다. R-FID는 원본과 재구성
          이미지 분포의 차이라 낮을수록 좋고, PSNR은 pixel 복원 신호 품질이라 높을수록 좋다.
        </p>
      </div>
      <SourceFormula
        latex={String.raw`\underbrace{f}_{\text{공간 압축 배수}}=
\frac{\underbrace{H}_{\text{pixel 높이}}}{\underbrace{h}_{\text{latent 높이}}}
=\frac{\underbrace{W}_{\text{pixel 너비}}}{\underbrace{w}_{\text{latent 너비}}}`}
        meaning="왜 가로와 세로를 같은 f로 나누나: 2D image의 공간 구조를 유지한 채 각 축을 downsample하기 위해서다. Latent 위치 수는 H×W에서 h×w로 줄어 대략 f²배 감소한다. Channel 수와 실제 FLOPs도 중요하므로 f²를 전체 speedup과 동일시하지 않는다."
        symbols={[
          ['H,W', '원 pixel image의 높이와 너비'],
          ['h,w', 'Encoder가 만든 latent grid의 높이와 너비'],
          ['f', '각 공간축의 downsampling factor'],
          [String.raw`f^2`, '공간 position 수가 줄어드는 비율'],
        ]}
      />
      <CompressionTradeoffLab />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Diffusion 목적은 그대로지만 입력이 x에서 z로 이동한다</h3>
        <p>
          학습 image <code>x</code>는 고정된 encoder를 지나 <code>z=E(x)</code>가 된다. Timestep을 뽑아 latent에 Gaussian noise를
          섞고, U-Net은 넣은 noise를 예측한다. Sampling이 끝나면 decoder <code>D</code>는 마지막 latent를 pixel image로 한 번 복원한다.
          Autoencoder와 diffusion을 동시에 한 objective로 훈련하는 구조가 아니다.
        </p>
      </div>
      <SourceFormula
        latex={String.raw`\begin{aligned}
\underbrace{\epsilon}_{\substack{\text{실제}\\\text{noise}}}
&\sim\mathcal N(0,I),\qquad z=E(x)\\
\ell_\theta(z_t,t,\epsilon)
&=\left\|
\underbrace{\epsilon}_{\substack{\text{latent에}\\\text{넣은 noise}}}
-\underbrace{\epsilon_\theta(z_t,t)}_{\substack{\text{U-Net 예측}\\\text{noise}}}
\right\|_2^2\\
\mathcal L_{\mathrm{LDM}}
&=\mathbb E_{x,t,\epsilon}\!\left[\ell_\theta(z_t,t,\epsilon)\right]
\end{aligned}`}
        meaning="왜 x가 아니라 z에 noise를 넣나: first-stage encoder가 지각적으로 중요한 정보를 작은 2D grid에 남겼으므로 반복 denoising을 그 공간에서 수행해 계산을 줄인다. 정답은 원 DDPM과 같은 sampled noise이며, sampling 뒤에만 D가 latent를 pixel로 되돌린다."
        symbols={[
          ['x', '학습 데이터의 pixel image'],
          [String.raw`z=E(x)`, '고정된 encoder가 만든 clean latent'],
          [String.raw`z_t`, 'timestep t에서 noise가 섞인 latent'],
          [String.raw`\epsilon`, 'Forward corruption에 실제로 사용한 Gaussian noise'],
          [String.raw`\epsilon_\theta`, 'Latent U-Net의 noise prediction'],
        ]}
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Cross-attention은 text만을 위한 장식이 아니라 조건 interface다</h3>
        <p>
          조건 <code>y</code>는 text, semantic map, class 또는 다른 modality일 수 있다. Domain encoder <code>τθ</code>가 이를
          token sequence로 바꾸고, U-Net 중간 feature가 query가 되어 그 condition token의 key/value를 읽는다. 이 덕분에 task마다
          완전히 다른 denoiser architecture를 만들지 않고 condition encoder와 cross-attention interface를 공유할 수 있다.
        </p>
      </div>
      <SourceFormula
        latex={String.raw`\begin{aligned}
\underbrace{c}_{\text{조건 token}}&=\underbrace{\tau_\theta(y)}_{\text{조건별 encoder}}\\
\mathcal L_{\mathrm{LDM}}^{\mathrm{cond}}
&=\mathbb E\!\left[
\left\|\epsilon-
\underbrace{\epsilon_\theta(z_t,t,c)}_{\text{cross-attention으로 조건을 읽는 denoiser}}
\right\|_2^2
\right]
\end{aligned}`}
        meaning="왜 조건 encoder를 분리하나: Text, layout, semantic map처럼 입력 형태가 달라도 U-Net에는 token sequence라는 공통 interface로 넘기기 위해서다. 왜 condition을 noise objective 안에 넣나: 같은 noisy latent라도 condition에 따라 제거할 noise와 복원할 semantic direction이 달라져야 하기 때문이다."
        symbols={[
          ['y', 'Text, class, layout처럼 generation을 제어하는 원 condition'],
          [String.raw`\tau_\theta`, 'Condition을 cross-attention token으로 바꾸는 domain-specific encoder'],
          ['c', 'Denoiser가 key/value로 읽는 condition representation'],
          [String.raw`\epsilon_\theta(z_t,t,c)`, 'Timestep과 condition에 함께 의존하는 latent noise prediction'],
        ]}
      />

      <LdmEvidenceReceipt />
      <Misconception>
        LDM-4의 <code>f=4</code>를 모든 이미지 모델의 정답으로 외우면 안 된다. 원문 compression sweep은 “너무 약하면
        diffusion 학습이 느리고, 너무 강하면 reconstruction 상한이 낮다”는 trade-off를 보여 준다. 최적 지점은 데이터, decoder,
        target 해상도와 작은 글자·정밀 복원 요구에 따라 달라진다.
      </Misconception>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          논문의 한계도 같은 경계에서 나온다. Latent에서 계산해도 reverse sampling은 순차적이므로 GAN보다 느렸다. 또한 autoencoder의
          reconstruction error는 super-resolution처럼 pixel-level 정밀도가 필요한 task의 병목이 될 수 있다. 현재 checkpoint 조작은
          <InternalLink slug="stable-diffusion-open-models">Stable Diffusion 실행 글</InternalLink>로, DiT·MMDiT와 flow path 비교는
          <InternalLink slug="dit-flow-matching-evaluation">DiT와 Flow Matching</InternalLink>으로 넘긴다.
        </p>
      </div>
      <CapabilityCheck items={[
        'Perceptual compression과 diffusion의 semantic compression을 두 학습 단계로 구분한다.',
        '공간 downsampling f가 latent position을 f²배 줄이지만 전체 speedup과 같지 않은 이유를 설명한다.',
        'f=1과 f=32의 계산량·reconstruction 상한을 R-FID와 PSNR 근거로 비교한다.',
        'Pixel DDPM objective에서 xₜ가 zₜ로 바뀌는 지점과 decoder가 실행되는 시점을 추적한다.',
        '조건 encoder τθ와 cross-attention이 text·layout 등 다른 입력을 공통 interface로 바꾸는 이유를 말한다.',
        '논문의 2.7×/1.6× receipt를 특정 inpainting setup의 근거로 제한하고 reconstruction bottleneck을 함께 보고한다.',
      ]} />
      <SourceNotes sources={[
        { label: 'Ronneberger et al. · U-Net', href: 'https://arxiv.org/abs/1505.04597', note: 'Encoder의 같은 해상도 feature를 decoder에 결합해 localization을 복원하는 skip dataflow의 원 출처.' },
        { label: 'Rombach et al. · High-Resolution Image Synthesis with Latent Diffusion Models', href: 'https://arxiv.org/abs/2112.10752', note: 'Perceptual compression, latent objective, cross-attention, compression sweep, compute evidence와 limitation의 1차 출처.' },
        { label: 'CompVis · latent-diffusion', href: 'https://github.com/CompVis/latent-diffusion', note: '원 논문의 official training, sampling configuration과 first-stage model artifact.' },
        { label: 'CVPR 2022 open access', href: 'https://openaccess.thecvf.com/content/CVPR2022/html/Rombach_High-Resolution_Image_Synthesis_With_Latent_Diffusion_Models_CVPR_2022_paper.html', note: '출판본과 supplemental material의 고정 기록.' },
      ]} />
    </section>
  );
}

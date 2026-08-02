import MathFormula from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import {
  CapabilityCheck,
  InternalLink,
  Misconception,
  SourceNotes,
  StopRule,
} from '@/components/learning/ArticleLearning';
import SignalContractLab from './SignalContractLab';

const variants = [
  ['Conditional GAN', 'G와 D에 label·text·image 조건을 함께 입력', '원하는 class나 입력에 맞춘 생성'],
  ['DCGAN', 'Convolution, normalization, activation의 안정적 image 설계', '초기 image GAN의 재현 가능한 baseline'],
  ['WGAN-GP', '확률 분류 대신 1-Lipschitz critic과 Wasserstein signal', '분포 support가 떨어져 있을 때 더 연속적인 gradient'],
  ['StyleGAN', 'Mapping network와 layer별 style modulation', '고해상도 image의 scale별 제어'],
];

export default function EvaluationAndHandoff() {
  return (
    <section id="evaluation" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">변형 이름보다 어떤 gradient를 바꿨는지 본다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          GAN 변형은 architecture만 바꾼 목록이 아니다. 조건을 추가하거나 discriminator의 함수족을 제한하고, 두 분포 사이의
          거리와 gradient 성질을 바꾸는 시도다. 특히 WGAN 계열은 binary classification score 대신 critic의 기대값 차이를
          사용하고 Lipschitz 조건을 regularization으로 강제한다.
        </p>
      </div>
      <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3"><MathFormula display className="my-0 text-xs sm:text-base">{String.raw`\max_{\|f\|_L\leq1}\;\mathbb E_{x\sim p_{data}}[f(x)]-\mathbb E_{\tilde x\sim p_g}[f(\tilde x)]`}</MathFormula></div>
      <FormulaNote
        meaning="기대값은 잘 고른 한 장이 아니라 real distribution과 generated distribution 전체의 평균 score 차이를 비교한다. Critic f는 그 차이를 키우되 입력 거리가 조금 변할 때 score가 그보다 더 급하게 변하지 않는 1-Lipschitz 함수로 제한된다. Generator가 locally Lipschitz라는 조건 아래 Wasserstein 거리는 연속이고 거의 모든 지점에서 미분 가능하다는 것이 핵심이다. 매 update에 항상 유용한 gradient가 보장된다는 뜻은 아니다."
        symbols={[
          [String.raw`f`, '확률을 출력하는 classifier가 아니라 real과 fake의 상대 위치를 매기는 critic'],
          [String.raw`\|f\|_L\leq1`, 'critic의 기울기 크기를 제한하는 1-Lipschitz 조건'],
          [String.raw`p_{data}`, '실제 데이터가 따르는 분포'],
          [String.raw`p_g`, 'generator가 만든 sample의 분포'],
          ['두 기대값의 차이', 'critic이 구분한 real 쪽 평균과 generated 쪽 평균 사이의 간격'],
        ]}
      />
      <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3">
        <p className="mb-2 text-xs font-bold text-muted-foreground">WGAN-GP · critic 입력 기울기 penalty</p>
        <MathFormula display className="my-0 text-xs sm:text-base">
          {String.raw`\mathcal L_{GP}=\lambda\,\mathbb E_{\hat{x}}\left(\left\lVert\nabla_{\hat{x}}f(\hat{x})\right\rVert_2-1\right)^2`}
        </MathFormula>
      </div>
      <FormulaNote
        meaning="원 WGAN의 weight clipping은 weight 범위를 자르는 간접 제약이라 critic capacity를 망가뜨릴 수 있다. WGAN-GP는 real과 generated sample 사이에서 뽑은 x-hat에 대해 critic score의 입력 방향 기울기 크기를 직접 1 근처로 밀어낸다. L2 norm은 모든 입력 방향의 기울기 크기를 하나로 모으고, 1을 뺀 뒤 제곱하므로 너무 작거나 너무 큰 slope를 모두 벌점화한다. 이것은 sampled path의 soft penalty이지 전 공간의 1-Lipschitz를 증명하는 장치는 아니다."
        symbols={[
          [String.raw`\hat{x}`, 'real sample과 generated sample 사이에서 뽑은 보간 지점'],
          [String.raw`\nabla_{\hat{x}}f(\hat{x})`, 'critic score가 입력 변화에 얼마나 민감한지 나타내는 기울기'],
          [String.raw`\lambda`, '원래 critic 목적과 gradient penalty 사이의 가중치'],
          ['제곱', '기울기 크기가 1보다 작거나 큰 두 방향의 위반을 모두 양수 벌점으로 만든다.'],
        ]}
      />
      <Misconception>
        WGAN-GP가 mode collapse를 자동으로 없애는 것은 아니다. 더 매끄러운 distribution signal을 만들려는
        방법이지만 generator capacity, data coverage와 optimizer dynamics는 별도로 검증해야 한다.
      </Misconception>
      <div className="not-prose my-8 divide-y divide-border border-y border-border">
        {variants.map(([name, change, purpose]) => <article key={name} className="grid gap-2 py-4 sm:grid-cols-[9rem_1fr_1fr]"><h3 className="text-sm font-bold">{name}</h3><p className="text-sm leading-relaxed">{change}</p><p className="text-sm leading-relaxed text-muted-foreground">{purpose}</p></article>)}
      </div>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>평가에서 최소한 분리할 것</h3>
        <ul>
          <li><strong>Fidelity 또는 precision:</strong> 만들어진 sample이 실제 data manifold 가까이에 있는가?</li>
          <li><strong>Coverage 또는 recall:</strong> 실제 data의 다양한 mode를 얼마나 덮는가?</li>
          <li><strong>조건 일치:</strong> label, text, source image 조건을 실제로 따르는가?</li>
          <li><strong>Memorization:</strong> nearest neighbor가 training sample 복사인지 확인했는가?</li>
        </ul>
      </div>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>왜 여기서 Diffusion이 등장하는가</h3>
        <p>
          GAN의 정답 함수는 학습 중인 D라서 G가 움직이면 D가 풀 문제도 함께 움직인다. Diffusion은 실제 data에
          우리가 뽑은 noise를 섞으므로 각 noisy state에서 되찾아야 할 noise를 알고 있다. 이 고정된 supervised
          target은 두 player의 균형 문제를 피하지만, 생성할 때 한 번의 G forward 대신 여러 reverse step을 실행한다.
        </p>
        <p>
          따라서 전환의 이유는 “새 모델이 더 최신이라서”가 아니다. 움직이는 비교자와 one-pass sampling을 유지할지,
          알려진 corruption target과 반복 sampling 비용을 택할지의 계약 변화다. 아래 lab은 같은 실패 증상에 제품
          지연 조건을 더했을 때 다음 실험이 어떻게 달라지는지 보여준다.
        </p>
      </div>
      <SignalContractLab />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          확률분포와 JS·Wasserstein의 차이가 아직 추상적이면
          {' '}<InternalLink slug="probability-information-theory">확률과 정보 이론</InternalLink>으로 내려간다.
          분포 학습 계열 전체를 다시 비교하려면 <InternalLink slug="generative-theory">생성 모델 전체 지도</InternalLink>,
          고정 noise target의 수학은 <InternalLink slug="diffusion-models">Diffusion Models</InternalLink>,
          현재 backbone과 ODE 경로는 <InternalLink slug="dit-flow-matching-evaluation">DiT와 Flow Matching</InternalLink>,
          실제 tensor·memory 경계는 <InternalLink slug="image-model-runtime">Image Model Runtime</InternalLink>에서 이어진다.
        </p>
      </div>
      <CapabilityCheck items={['D와 G step의 trainable parameter와 detach 경계를 구분한다.', 'Minimax와 non-saturating gradient가 score 0 근처에서 다른 이유를 계산한다.', 'Mode collapse를 sample 품질과 별개의 coverage 문제로 진단한다.', 'WGAN critic과 WGAN-GP penalty가 각각 바꾸는 신호를 구분한다.', '고정 denoising target의 안정성과 반복 sampling 비용을 함께 비교한다.']} />
      <StopRule>
        움직이는 critic, coverage 실패, WGAN-GP의 soft constraint와 Diffusion의 고정 noise target 사이의
        선택을 설명할 수 있으면 GAN의 최소 기반은 끝이다. GAN의 모든 변형과 optimal transport 증명으로 더
        내려가지 않는다.
      </StopRule>
      <SourceNotes sources={[
        { label: 'Goodfellow et al. · Generative Adversarial Nets', href: 'https://arxiv.org/abs/1406.2661', note: 'Minimax game과 optimal discriminator 분석' },
        { label: 'Arjovsky et al. · Wasserstein GAN', href: 'https://arxiv.org/abs/1701.07875', note: 'Wasserstein distance와 critic objective' },
        { label: 'Gulrajani et al. · Improved Training of Wasserstein GANs', href: 'https://arxiv.org/abs/1704.00028', note: 'Weight clipping을 대체하는 gradient penalty와 WGAN-GP' },
        { label: 'Heusel et al. · GANs Trained by a Two Time-Scale Update Rule', href: 'https://arxiv.org/abs/1706.08500', note: 'TTUR과 FID 제안' },
        { label: 'Ho et al. · Denoising Diffusion Probabilistic Models', href: 'https://arxiv.org/abs/2006.11239', note: '고정 forward noising, learned reverse process와 반복 sampling 계약' },
      ]} />
    </section>
  );
}

import FormulaNote from '@/components/ui/formula-note';
import Math from '@/components/ui/math';
import {
  CapabilityCheck,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
  SpecialistEntry,
  StopRule,
} from '@/components/learning/ArticleLearning';
import {
  GradientBudgetLab,
  MixedSequenceMaskLab,
  ObjectiveBranchLab,
} from './multimodal-foundation/viz/ObjectiveLabs';

function Formula({ latex, meaning, symbols }: { latex: string; meaning: string; symbols: [string, string][] }) {
  return <div data-formula-pair className="not-prose my-7 min-w-0"><div className="min-w-0 overflow-hidden rounded-md border border-border px-2 py-4 sm:px-4"><Math display className="my-0 text-[13px] sm:text-base">{latex}</Math></div><FormulaNote meaning={meaning} symbols={symbols} /></div>;
}

export default function MultimodalUnifiedGenerationObjectivesArticle() {
  return (
    <>
      <SpecialistEntry
        title="한 backbone 안의 서로 다른 생성 학습법을 비교하는 글"
        description="Text의 next-token loss와 image의 discrete-token 또는 diffusion loss가 같은 Transformer 안에서 어떻게 공존하는지 읽는다. 생성 모델과 visual token의 기본 구분을 먼저 잡아야 수식이 역할별로 보인다."
        prerequisites={[
          'Next-token prediction이 앞 token으로 다음 ID의 확률을 맞추는 학습임을 안다.',
          'Diffusion이 noise가 섞인 연속 값을 여러 단계에 걸쳐 복원한다는 뜻을 안다.',
          'Backbone 공유와 output head·loss 공유가 서로 다른 주장임을 구분할 수 있다.',
        ]}
        links={[
          { slug: 'multimodal-foundation-models-current', title: '멀티모달 모델의 전체 흐름', reason: '이해와 생성이라는 두 목표를 먼저 분리한다.' },
          { slug: 'generative-theory', title: '생성 모델의 기초', reason: '분포, latent와 diffusion이 등장한 이유를 쉬운 장면부터 배운다.' },
          { slug: 'multimodal-visual-tokenization', title: '시각 tokenization', reason: 'Discrete visual code와 continuous patch 표현의 차이를 잡는다.' },
        ]}
      />
      <section id="one-backbone-many-losses" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">한 backbone과 한 objective는 다른 주장이다</h2>
        <QuestionLead
          question="Text와 image를 같은 transformer가 처리하면 둘 다 next-token prediction으로 배우는 것일까?"
          answer="아니다. Emu3·Janus처럼 image를 discrete code로 바꾸면 visual next-token loss를 쓸 수 있다. Transfusion처럼 image를 continuous patch span으로 남기면 같은 transformer 안에서도 text에는 token 단위 LM loss, image에는 span 전체의 image-level diffusion loss를 적용할 수 있다."
        />
        <ConceptPrimer items={[
          { term: 'Autoregressive (AR)', meaning: '앞에서 생성한 항을 조건으로 다음 token 하나의 확률을 예측한다.', why: 'Text와 discrete visual vocabulary를 같은 next-token interface로 다룬다.' },
          { term: 'Diffusion objective', meaning: 'Noise가 섞인 continuous latent에서 noise·velocity·clean target을 회귀한다.', why: 'Image를 discrete ID로 강제하지 않고 연속 공간에서 생성한다.' },
          { term: 'Flow matching', meaning: '간단한 source 분포에서 data 분포로 움직이는 vector field를 회귀한다.', why: '여러 denoising step을 연속 dynamics와 ODE solver로 표현한다.' },
          { term: 'Modality head', meaning: 'Shared hidden을 text vocabulary logit이나 image prediction으로 바꾸는 출력 모듈이다.', why: 'Backbone을 공유해도 output 공간은 다르므로 마지막 변환을 분리한다.' },
        ]} />
        <ObjectiveBranchLab />
        <Misconception>“Next-token prediction is all you need” 같은 논문 제목은 모든 raw modality가 처음부터 정수 token이라는 뜻이 아니다. Emu3 앞에는 image·video를 discrete code로 바꾸고 다시 복원하는 tokenizer가 있다.</Misconception>
      </section>

      <section id="ar-objective" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Discrete stream은 정답 ID의 확률을 높인다</h2>
        <Formula
          latex={String.raw`\underbrace{\mathcal L_{\mathrm{AR}}}_{\text{다음 token 손실}}=-\sum_{t\in\mathcal M}\underbrace{\log p_\theta(x_t\mid x_{<t})}_{\text{정답 token의 조건부 log 확률}}`}
          meaning="각 target 위치에서 앞 token만 보고 정답 ID에 준 확률의 log를 더한다. 확률의 곱을 log의 합으로 바꾸면 긴 sequence도 안정적으로 계산할 수 있다. 앞의 minus는 정답 확률을 크게 만드는 문제를 최소화 loss로 바꾼다. Mask M은 text·visual 중 이번 objective가 책임지는 위치만 고른다."
          symbols={[
            [String.raw`x_t`, 't 위치의 text token 또는 discrete visual code'],
            [String.raw`x_{<t}`, '현재 위치보다 앞에서 이미 주어진 token sequence'],
            [String.raw`\mathcal M`, 'Loss를 계산할 target 위치 mask'],
            [String.raw`p_\theta`, 'Shared transformer와 modality head가 만든 다음 ID 분포'],
          ]}
        />
        <MixedSequenceMaskLab />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Emu3 framework는 text·image·video를 discrete token sequence로 만들고 decoder-only transformer의 next-token objective로 이해와 생성을 통합한다. 공개 post-trained artifact는 이해용 Emu3-Chat과 생성용 Emu3-Gen으로 나뉜다. Janus-Pro도 image generation에서는 VQ code를 한 칸씩 예측한다. “같은 AR objective”만으로 framework, checkpoint와 runtime까지 같다고 보면 안 된다.</p>
          <p>Raster 순서로 visual code를 한 개씩 만들면 이미 만든 왼쪽·위쪽 code를 조건으로 사용할 수 있다. 대신 24×24 grid면 576번의 dependency가 생긴다. KV cache와 batch parallelism은 도움이 되지만 한 image 안의 순차 길이는 남는다.</p>
        </div>
      </section>

      <section id="continuous-objective" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Continuous image span은 noise 또는 velocity를 회귀한다</h2>
        <Formula
          latex={String.raw`\underbrace{x_t}_{\text{noise가 섞인 image latent}}=\underbrace{\alpha_t x_0}_{\text{남은 clean signal}}+\underbrace{\sigma_t\epsilon}_{\text{추가한 Gaussian noise}}`}
          meaning="Clean image latent와 random noise를 시간 t의 비율로 섞어 학습 입력 x_t를 만든다. Signal과 noise에 각각 계수를 곱하는 이유는 시간에 따라 둘의 비율을 연속적으로 바꾸기 위해서다. 두 항을 더하면 원 image 정보와 새 noise가 같은 좌표 공간에서 섞인다."
          symbols={[
            [String.raw`x_0`, 'Data에서 얻은 clean continuous image latent'],
            [String.raw`\epsilon`, '학습 때 직접 샘플한 Gaussian noise 정답'],
            [String.raw`\alpha_t,\sigma_t`, '시간 t에서 signal과 noise를 섞는 schedule'],
            [String.raw`x_t`, 'Model이 t 시점에서 실제로 받는 noisy latent'],
          ]}
        />
        <Formula
          latex={String.raw`\underbrace{\mathcal L_{\mathrm{diff}}}_{\text{image span 손실}}=\mathbb E\!\left[\left\|\epsilon-\epsilon_\theta(x_t,t,c)\right\|_2^2\right]`}
          meaning="Model이 noisy latent에서 예측한 noise와 학습 때 실제로 넣은 noise의 차이를 잰다. 제곱 L2는 vector 각 성분의 오차를 음이 아닌 하나의 값으로 합치고, 기대값은 여러 image·시간·noise 표본의 평균 목표를 뜻한다. 여러 noise level을 학습해야 sampling 때 큰 noise에서 작은 noise로 반복 이동할 수 있다."
          symbols={[
            [String.raw`\epsilon_\theta`, 'Parameter θ를 가진 model이 예측한 noise'],
            [String.raw`x_t,t`, '현재 noisy latent와 그 noise level'],
            [String.raw`c`, 'Text와 interleaved context가 만든 condition'],
            [String.raw`\mathbb E`, 'Data, time과 Gaussian noise 표본에 대한 평균'],
          ]}
        />
        <Formula
          latex={String.raw`\begin{aligned}
            \underbrace{z_t}_{\text{중간 latent}}&=(1-t)\underbrace{z_0}_{\text{noise 표본}}+t\underbrace{z_1}_{\text{data 표본}}\\
            \underbrace{u^*(z_t,t)}_{\text{목표 이동 속도}}&=\underbrace{z_1-z_0}_{\text{noise에서 data로 가는 방향}}\\
            \underbrace{\mathcal L_{\mathrm{flow}}}_{\text{velocity 회귀}}&=\mathbb E\!\left[\left\|u_\theta(z_t,t,c)-u^*(z_t,t)\right\|_2^2\right]
          \end{aligned}`}
          meaning="여기서는 t=0이 noise이고 t=1이 data다. 바로 앞 diffusion 식의 x₀=clean data 표기와 방향이 반대이므로 아래첨자만 보고 같은 뜻이라고 생각하면 안 된다. Rectified flow의 가장 단순한 형태에서 첫 줄은 noise 표본과 data latent 사이의 직선에서 시간 t의 중간점을 만든다. 둘째 줄은 그 직선을 따라가려면 어느 방향으로 얼마나 움직여야 하는지 목표 velocity를 정한다. 셋째 줄은 model이 예측한 velocity와 목표의 제곱 거리를 줄인다. 학습 뒤에는 noise에서 시작해 model velocity를 ODE solver로 적분해 data 쪽으로 이동한다."
          symbols={[
            [String.raw`z_0\sim p_{\mathrm{noise}}`, 'Sampling이 시작하는 간단한 noise 분포의 표본'],
            [String.raw`z_1\sim p_{\mathrm{data}}`, 'Encoder가 만든 실제 image latent 표본'],
            [String.raw`t\in[0,1]`, 'Noise 끝과 data 끝 사이에서 고른 연속 시간'],
            [String.raw`u_\theta`, 'Condition c를 읽고 현재 latent의 이동 속도를 예측하는 vector field'],
            ['선형 보간', '두 분포 사이의 학습 경로를 단순한 직선으로 만들어 목표 velocity를 직접 계산하기 위해 사용'],
            ['제곱 L2', 'Latent의 모든 성분에서 velocity 오차를 음이 아닌 하나의 scalar loss로 합치기 위해 사용'],
          ]}
        />
        <Formula
          latex={String.raw`\begin{aligned}
            \underbrace{\mathcal L}_{\text{공유 parameter의 총 손실}}
            &=\underbrace{\lambda_{\mathrm{text}}\mathcal L_{\mathrm{text}}}_{\text{text token objective}}\\
            &\quad+\underbrace{\lambda_{\mathrm{image}}\mathcal L_{\mathrm{image}}}_{\text{image objective}}
          \end{aligned}`}
          meaning="Shared transformer는 두 modality에서 온 gradient의 합을 받는다. Lambda는 서로 단위와 규모가 다른 loss가 update를 얼마나 차지할지 조절한다. 하지만 weight만 맞춘다고 끝나지 않는다. Batch에 text와 image가 얼마나 자주 들어오는지도 누적 gradient 비율을 바꾼다."
          symbols={[
            [String.raw`\lambda_{\mathrm{text}},\lambda_{\mathrm{image}}`, '각 modality loss의 상대 update 강도'],
            [String.raw`\mathcal L_{\mathrm{text}}`, 'Text target 위치의 next-token loss'],
            [String.raw`\mathcal L_{\mathrm{image}}`, '전략에 따라 visual AR, diffusion 또는 flow loss'],
            ['더하기', '같은 shared parameter가 두 task의 gradient를 동시에 받기 때문에 사용'],
          ]}
        />
        <GradientBudgetLab />
      </section>

      <section id="evidence-and-choice" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Objective는 output과 검증 방식까지 바꾼다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p><strong>Discrete AR</strong>은 token likelihood와 teacher-forced perplexity를 직접 계산할 수 있다. 그러나 좋은 code likelihood가 perceptual image 품질을 자동 보장하지 않으므로 decoder reconstruction, text rendering, composition과 human preference를 따로 본다.</p>
          <p><strong>Diffusion·flow</strong>는 여러 image 위치를 continuous field로 함께 갱신할 수 있다. Sampling step, solver와 guidance가 runtime 품질을 바꾸므로 training loss만으로 제품 latency를 예측할 수 없다.</p>
          <p><strong>Shared backbone</strong>의 이익은 modality 사이 transfer와 parameter reuse다. 위험은 gradient competition과 한 modality의 data volume이 다른 modality를 압도하는 것이다. Text·image validation을 분리하고 shared layer의 gradient norm, representational interference와 per-capability regression을 추적한다.</p>
        </div>
        <StopRule>
          AR·diffusion·flow 중 어느 objective가 어느 representation과 output head를 요구하는지 설명할 수 있으면 여기서 끝이다.
          Janus 계열의 설계 의도와 원문 증거를 먼저 <InternalLink slug="paper-janus-2024">Janus 논문 재구성</InternalLink>에서 확인하고,
          그 다음 공식 code의 실제 tensor를 검산할 때 <InternalLink slug="janus-pro-multimodal-runtime">Janus-Pro runtime</InternalLink>으로 이동한다.
        </StopRule>
        <CapabilityCheck items={[
          'Shared transformer와 shared tokenizer·loss·decoder를 별도 주장으로 구분한다.',
          'Discrete visual AR과 continuous diffusion·flow가 요구하는 representation을 고른다.',
          'Loss weight와 modality sampling 비율이 함께 gradient budget을 바꾸는 이유를 설명한다.',
          'Training loss, generation schedule과 product quality evidence를 분리한다.',
        ]} />
        <SourceNotes sources={[
          { label: 'Emu3 · Nature', href: 'https://www.nature.com/articles/s41586-025-10041-x', note: 'Discrete text·image·video token과 decoder-only next-token objective의 peer-reviewed 근거.' },
          { label: 'Emu3 official repository', href: 'https://github.com/baaivision/Emu3', note: 'Tokenizer와 generation interface의 공개 code 근거.' },
          { label: 'Transfusion', href: 'https://arxiv.org/abs/2408.11039', note: 'Text language modeling loss와 continuous image diffusion loss를 mixed sequence에서 결합한 연구.' },
          { label: 'Janus', href: 'https://arxiv.org/abs/2410.13848', note: 'Decoupled visual encoding과 autoregressive unified transformer의 근거.' },
          { label: 'Janus-Pro', href: 'https://arxiv.org/abs/2501.17811', note: '확장된 data와 model scale, visual generation·understanding 결과를 보고한 Janus-Pro의 1차 출처.' },
          { label: 'JanusFlow', href: 'https://arxiv.org/abs/2411.07975', note: 'Autoregressive language model과 rectified flow image generation을 결합한 대조 전략.' },
        ]} />
      </section>
    </>
  );
}

import { Link } from 'react-router-dom';
import { CitationBlock } from '@/components/ui/citation';
import M from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import {
  BeginnerBridge,
  CapabilityCheck,
  ConceptPrimer,
  QuestionLead,
  SourceNotes,
} from '@/components/learning/ArticleLearning';
import { articlePath } from '@/lib/paths';
import StableDiffusionRuntimeViz from './stable-diffusion-open-models/StableDiffusionRuntimeViz';
import StableDiffusionArchitectureViz from './stable-diffusion-open-models/StableDiffusionArchitectureViz';

const familyMilestones = [
  {
    order: '01',
    family: 'Stable Diffusion 1.x',
    question: '공개 이미지 생성 pipeline의 최소 실행 계약은 무엇인가?',
    inherited: 'LDM의 VAE latent, U-Net denoiser와 text cross-attention을 그대로 실행 기준선으로 삼는다.',
    changed: '512px와 단일 CLIP text encoder를 중심으로 checkpoint, LoRA와 sampler 생태계가 크게 확장됐다.',
    caution: '다른 계열의 해상도, encoder와 adapter recipe까지 이 기본값으로 간주하지 않는다.',
  },
  {
    order: '02',
    family: 'Stable Diffusion 2.x',
    question: '골격이 같아도 왜 prompt와 embedding 감각이 달라지는가?',
    inherited: 'VAE latent와 U-Net LDM이라는 큰 skeleton은 1.x와 같다.',
    changed: '학습 data contract와 OpenCLIP 계열 text encoder가 바뀌어 prompt가 만드는 condition 좌표가 달라졌다.',
    caution: '1.x embedding, negative prompt와 LoRA 호환성을 모델 이름만 보고 가정하지 않는다.',
  },
  {
    order: '03',
    family: 'SDXL',
    question: '1024px에서 구조와 세부를 어떻게 더 넓게 담는가?',
    inherited: 'Latent, U-Net denoising loop, cross-attention이라는 외부 계약은 유지한다.',
    changed: '더 큰 U-Net, 늘어난 attention, 두 text encoder와 선택적 refiner로 용량과 conditioning을 확장했다.',
    caution: 'SD1.5의 resolution, rank, learning rate와 text encoder 처리법을 SDXL에 그대로 복사하지 않는다.',
  },
  {
    order: '04',
    family: 'SD3 / SD3.5',
    question: '왜 같은 diffusion 계열인데 U-Net recipe가 더는 주소가 되지 않는가?',
    inherited: 'Noisy latent와 condition에서 vector field를 예측하고 solver가 상태를 이동하는 바깥 loop는 남는다.',
    changed: 'MMDiT joint attention과 rectified-flow 계열 objective로 내부 mixing과 prediction 의미를 바꿨다. SD3.5는 QK normalization도 사용한다.',
    caution: 'SDXL LoRA target, text encoder 조합과 sampler 의미를 복사하지 말고 새 pipeline manifest에서 다시 고른다.',
  },
] as const;

function FamilyMilestones() {
  return (
    <div className="not-prose my-8 divide-y divide-border border-y border-border">
      {familyMilestones.map((milestone) => (
        <article className="grid min-w-0 gap-5 py-8 sm:grid-cols-[4.5rem_minmax(0,1fr)] sm:gap-7" key={milestone.family}>
          <div>
            <span className="font-mono text-3xl font-black tabular-nums text-primary">{milestone.order}</span>
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase text-muted-foreground">Architecture milestone</p>
            <h3 className="mt-2 text-xl font-black">{milestone.family}</h3>
            <p className="mt-3 text-sm font-bold leading-6">{milestone.question}</p>
            <dl className="mt-6 space-y-4 text-sm leading-7">
              {[
                ['상속한 것', milestone.inherited],
                ['바꾼 것', milestone.changed],
                ['그대로 복사하지 않을 것', milestone.caution],
              ].map(([term, value]) => (
                <div className="grid min-w-0 gap-1 sm:grid-cols-[9.5rem_minmax(0,1fr)] sm:gap-4" key={term}>
                  <dt className="font-bold text-foreground">{term}</dt>
                  <dd className="min-w-0 text-muted-foreground">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </article>
      ))}
    </div>
  );
}

export default function StableDiffusionOpenModelsArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">Stable Diffusion은 “checkpoint 하나”가 아니다</h2>
        <BeginnerBridge title="이미지 파일 하나가 아니라 글 해석기·작업 공간·반복 수정기·복원기가 이어진 제작선이다">
          Checkpoint는 학습된 숫자 묶음인 weight를 저장한 파일일 뿐이다. 실제 생성에서는 prompt를 숫자로 바꾸고, 압축된 latent 공간에서 noise를 여러 번 고친 뒤, VAE가 그 결과를 사람이 보는 pixel 이미지로 복원한다.
        </BeginnerBridge>
        <QuestionLead
          question="최신 이미지 모델이 더 많아진 지금, 왜 Stable Diffusion 실행 구조를 다시 읽어야 할까?"
          answer="Stable Diffusion이 언제나 최고 성능이어서가 아니다. Prompt encoder, latent, denoiser, scheduler, VAE와 adapter가 분리된 실행 계약이 공개 이미지 생태계의 가장 관찰 가능한 기준선이기 때문이다. 이 기준선을 잡으면 SDXL, SD3.5뿐 아니라 newer DiT·flow model도 무엇이 바뀌었는지 모듈 단위로 비교할 수 있다."
        />
        <ConceptPrimer
          items={[
            { term: 'Latent', meaning: 'RGB pixel을 VAE가 압축한 작은 feature grid다.', why: '해상도와 VRAM 비용이 어느 tensor에서 커지는지 계산한다.' },
            { term: 'Denoiser', meaning: '현재 noisy latent와 timestep, 조건을 받아 제거할 noise 또는 velocity를 예측한다.', why: 'U-Net과 MMDiT가 서로 다른 핵심 계산기임을 구분한다.' },
            { term: 'Scheduler', meaning: 'Denoiser 예측을 사용해 다음 noise level의 latent로 이동시키는 수치 규칙이다.', why: 'Model weight와 sampler 설정을 같은 것으로 오해하지 않는다.' },
            { term: 'Condition', meaning: 'Text·image·pose·depth가 attention 또는 residual 경로로 들어가는 제어 신호다.', why: 'Prompt, CFG, ControlNet과 IP-Adapter의 개입 위치를 나눈다.' },
          ]}
        />
        <aside className="not-prose border-l-2 border-blue-500 py-1 pl-4">
          <p className="text-xs font-bold text-blue-700 dark:text-blue-300">선택형 최소 구현 기준선</p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            최신 이미지 모델을 읽는 모든 사람이 이 글부터 시작할 필요는 없다. 현재 모델에서 모듈 경계가 흐려지거나
            SDXL 계보의 Illustrious·LoRA·ControlNet을 직접 다룰 때만 내려온다. 역사 탐색은 latent diffusion을 정립한
            2021년 LDM 논문에서 멈추고, 더 아래 DDPM 수학은 식이 막힐 때만 연다.
          </p>
        </aside>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            Stable Diffusion 계열을 제대로 이해하려면 모델명을 외우기보다 실행 그래프를 먼저 봐야 한다.
            실제 구현에서 하나의 이미지 생성은 <code>tokenizer</code>, <code>text_encoder</code>, <code>unet</code>,
            <code>scheduler</code>, <code>vae</code>가 순서대로 협력하는 과정이다. Diffusers의
            <code>StableDiffusionPipeline</code> 생성자도 이 구성요소들을 그대로 드러낸다.
          </p>
          <p>
            그래서 workflow에서 보이는 <code>steps</code>, <code>CFG</code>, <code>sampler</code>, <code>latent</code>,
            <code>VAE</code>, <code>LoRA</code>, <code>ControlNet</code>은 UI 장식이 아니라 내부 모듈에 직접 대응한다.
            어떤 수치를 바꾸는지보다 먼저 “어느 모듈의 입력·가중치·residual을 바꾸는가”를 잡아야 한다.
          </p>
          <CitationBlock source="Hugging Face Diffusers StableDiffusionPipeline" citeKey={1} href="https://huggingface.co/docs/diffusers/api/pipelines/stable_diffusion/text2img">
            <p>Diffusers 문서는 Stable Diffusion pipeline의 구성요소를 VAE, CLIP text encoder, tokenizer, U-Net, scheduler로 명시한다.</p>
          </CitationBlock>
          <CitationBlock source="Stability AI Core Models · 2026-05-20" citeKey={6} href="https://stability.ai/core-models">
            <p>2026년 공식 model catalog에도 SD3.5와 SDXL 계열이 함께 남아 있다. 이 글은 이를 최신 성능 순위가 아니라 공개 구조를 비교하는 기준선으로 다룬다.</p>
          </CitationBlock>
        </div>
        <p className="not-prose mb-4 mt-8 text-sm leading-6 text-muted-foreground" data-viz-context>
          아래 장면은 전체 pipeline을 한꺼번에 펼치지 않는다. 각 단계에서 바뀌는 tensor와 책임자, 다음 비교에서 고정할 값을 하나씩 확인한다.
        </p>
        <StableDiffusionRuntimeViz />
      </section>

      <section id="ldm-pipeline" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">Latent Diffusion 구현 흐름</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            Stable Diffusion의 핵심은 pixel 공간이 아니라 latent 공간에서 diffusion을 돌린다는 점이다.
            학습 데이터 이미지는 먼저 autoencoder의 encoder를 거쳐 latent <M>{'z_0'}</M>가 되고,
            diffusion은 이 <M>{'z_0'}</M>에 noise를 섞은 <M>{'z_t'}</M>를 복원하도록 학습한다.
          </p>
          <M display>{'\\begin{aligned} z_0&=\\underbrace{E_{\\mathrm{VAE}}(x)}_{\\text{이미지를 latent로 압축}}\\\\ z_t&=\\underbrace{\\alpha_t z_0}_{\\text{남긴 원본 신호}}+\\underbrace{\\sigma_t\\epsilon}_{\\text{추가한 Gaussian noise}},\\quad \\epsilon\\sim\\mathcal N(0,I) \\end{aligned}'}</M>
          <FormulaNote meaning="Pixel 이미지를 작은 latent로 압축한 뒤, timestep t에서 남길 원본 신호와 추가할 Gaussian noise를 섞어 학습 입력을 만든다." symbols={[[String.raw`E_{\mathrm{VAE}}`, 'RGB 이미지를 latent grid로 압축하는 encoder'], [String.raw`\alpha_t`, 't 시점에 보존할 clean signal 비율'], [String.raw`\sigma_t`, 't 시점에 추가할 noise 크기'], [String.raw`\epsilon`, '모델이 복원 목표로 삼는 무작위 noise']]} />
          <p>
            inference에서는 반대로 Gaussian noise에서 시작한다. U-Net이 각 step에서 noise 또는 velocity를 예측하고,
            scheduler가 그 예측을 써서 다음 latent로 이동한다. 마지막 latent를 VAE decoder가 RGB 이미지로 복원한다.
          </p>
          <M display>{'\\begin{aligned} \\hat\\epsilon&=\\underbrace{\\epsilon_\\theta(z_t,t,c)}_{\\text{제거할 noise 예측}}\\\\ z_{t-1}&=\\underbrace{\\mathrm{SchedulerStep}(z_t,\\hat\\epsilon,t)}_{\\text{덜 noisy한 latent로 한 단계 이동}} \\end{aligned}'}</M>
          <FormulaNote meaning="Denoiser는 현재 latent에서 제거할 noise를 추정하고, scheduler는 그 추정을 수치적 이동 규칙에 넣어 한 단계 더 깨끗한 latent를 만든다." symbols={[[String.raw`\epsilon_\theta`, '학습된 U-Net 또는 denoiser'], [String.raw`c`, 'prompt를 text encoder가 만든 조건 tensor'], [String.raw`\hat\epsilon`, '현재 step에서 제거할 것으로 예측한 noise'], ['SchedulerStep', 'sampler와 noise schedule이 정하는 한 step 갱신']]} />
          <p>
            여기서 <M>{'c'}</M>는 text encoder가 만든 condition이다. 즉 prompt는 이미지에 직접 그려지는 것이 아니라,
            U-Net 내부 attention layer가 조회하는 context로 들어간다.
          </p>
          <CitationBlock source="High-Resolution Image Synthesis with Latent Diffusion Models" citeKey={2} href="https://arxiv.org/abs/2112.10752">
            <p>LDM 논문은 diffusion을 pretrained autoencoder의 latent space에서 수행하고, cross-attention으로 text 같은 conditioning을 주입하는 구조를 제안한다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="tensor-shapes" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">Tensor shape로 읽기</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            내부 구현을 이해할 때 가장 먼저 볼 것은 shape다. SD1.x에서 512×512 이미지는 보통 VAE scale factor 8을 지나
            4×64×64 latent가 된다. SDXL의 1024×1024는 4×128×128 latent로 생각하면 된다.
          </p>
          <M display>{'\\begin{aligned} x&\\in\\mathbb R^{\\underbrace{3}_{\\text{RGB 채널}}\\times\\underbrace{H W}_{\\text{화소 격자}}}\\\\ \\downarrow&\\quad\\text{VAE가 가로·세로를 각각 8배 압축}\\\\ z&\\in\\mathbb R^{\\underbrace{4}_{\\text{latent 채널}}\\times\\underbrace{(H/8)(W/8)}_{\\text{압축 격자}}} \\end{aligned}'}</M>
          <FormulaNote meaning="VAE는 색상 3채널의 큰 pixel grid를 의미가 압축된 4채널 latent grid로 바꾼다. 가로·세로가 각각 8분의 1이면 공간 위치 수는 64분의 1이 된다." symbols={[[String.raw`H\times W`, '출력 이미지의 pixel 해상도'], [String.raw`H/8\times W/8`, 'denoiser가 실제로 처리하는 latent 공간 크기'], ['4', 'SD 계열 latent feature channel 수']]} />
          <p>
            이 shape가 workflow 수치와 바로 연결된다. 512에서 1024로 올리면 가로와 세로가 각각 2배가 되므로 pixel 수와
            latent 위치 수는 4배가 된다. 하지만 모든 연산 비용이 같은 비율로 늘지는 않는다.
          </p>
          <M display>{String.raw`\begin{aligned}
            n_{\mathrm{lat}}(512)&=64^2=4{,}096\\
            n_{\mathrm{lat}}(1024)&=128^2=16{,}384
            =4\,n_{\mathrm{lat}}(512)
          \end{aligned}`}</M>
          <FormulaNote
            meaning="VAE가 가로와 세로를 각각 8분의 1로 줄이므로 512 이미지는 64×64, 1024 이미지는 128×128 latent가 된다. 한 변은 2배지만 위치 수는 2×2=4배다."
            symbols={[
              [String.raw`n_{\mathrm{lat}}`, 'VAE 압축 뒤 denoiser가 처리하는 공간 위치 수'],
              ['512, 1024', '입력과 출력 이미지의 한 변 pixel 수'],
              ['64, 128', '8배 압축 뒤 latent의 한 변 위치 수'],
            ]}
          />
          <M display>{String.raw`\begin{aligned}
            C_{\mathrm{self}}&\propto n_{\mathrm{lat}}^2
            &&\Rightarrow 4^2=16\times\\
            C_{\mathrm{cross}}&\propto n_{\mathrm{lat}}T
            &&\Rightarrow 4\times\quad(T\text{ 고정})\\
            C_{\mathrm{conv}}&\propto n_{\mathrm{lat}}
            &&\Rightarrow 4\times
          \end{aligned}`}</M>
          <FormulaNote
            meaning="모든 latent 위치 쌍을 비교하는 dense spatial self-attention의 score 수는 위치 증가율을 다시 제곱해 16배가 된다. Text 길이가 고정된 cross-attention과 같은 channel·kernel의 convolution은 공간 위치를 한 번 훑으므로 대략 4배다. 실제 시간과 VRAM은 attention을 쓰는 해상도, channel 수, kernel과 구현 최적화에 따라 달라진다."
            symbols={[
              [String.raw`C_{\mathrm{self}}`, 'dense spatial self-attention의 score 계산량'],
              [String.raw`C_{\mathrm{cross}}`, 'image 위치가 text token을 조회하는 score 계산량'],
              [String.raw`C_{\mathrm{conv}}`, 'channel과 kernel 크기를 고정했을 때 convolution 공간 연산량'],
              [String.raw`T`, '고정된 prompt text token 길이'],
            ]}
          />
          <ul>
            <li><strong>batch</strong>: 여러 이미지를 동시에 만들면 latent batch 차원이 커진다.</li>
            <li><strong>height/width</strong>: VAE scale factor 때문에 8 또는 16의 배수 제약이 자주 나타난다.</li>
            <li><strong>num inference steps</strong>: U-Net forward를 몇 번 반복할지 정한다.</li>
            <li><strong>guidance scale</strong>: conditional/unconditional 예측을 얼마나 벌릴지 정한다.</li>
          </ul>
        </div>
      </section>

      <section id="unet-internals" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">U-Net 내부: ResNet, attention, skip connection</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            SD1.x와 SDXL의 denoiser는 U-Net 계열이다. U-Net은 down path에서 spatial resolution을 줄이며 feature를 깊게 만들고,
            middle block에서 넓은 문맥을 섞은 뒤, up path에서 resolution을 되살린다. down path의 feature는 skip connection으로 up path에 전달된다.
          </p>
          <p>
            이 구조 때문에 U-Net 기반 SD는 “지역 texture를 잘 다루는 convolution”과 “멀리 떨어진 개념을 묶는 attention”이 섞인 모델로 봐야 한다.
            LoRA target을 attention에만 넣으면 prompt-token과 style/subject 결합은 잘 바뀌지만, 모든 texture·구도·해부학 문제가 해결되는 것은 아니다.
          </p>
          <M display>{'\\begin{aligned} S&=\\underbrace{QK^\\top/\\sqrt d}_{\\text{query와 key의 유사도}}\\\\ A&=\\underbrace{\\mathrm{softmax}(S)}_{\\text{참조 비율로 정규화}}\\\\ \\mathrm{Attention}(Q,K,V)&=\\underbrace{AV}_{\\text{선택한 value feature를 합성}} \\end{aligned}'}</M>
          <FormulaNote meaning="이미지 위치의 query가 이미지 또는 prompt의 key와 맞는 정도를 계산하고, 그 비율만큼 value feature를 가져온다. Cross-attention에서는 prompt가 그림에 직접 복사되는 것이 아니라 이 검색 주소와 내용으로 작동한다." symbols={[[String.raw`Q`, '현재 latent 위치가 찾는 정보'], [String.raw`K`, '이미지 또는 text token의 검색 주소'], [String.raw`V`, '선택되면 가져올 feature'], ['softmax', '모든 후보의 선택 비율을 합 1로 정규화']]} />
          <p>
            self-attention에서는 <M>{'Q,K,V'}</M>가 모두 image feature에서 나온다.
            cross-attention에서는 <M>{'Q'}</M>가 image feature, <M>{'K,V'}</M>가 text embedding에서 나온다.
            그래서 cross-attention은 “이미지의 각 위치가 prompt token 중 무엇을 볼지”를 정하는 장치에 가깝다.
          </p>
        </div>
        <p className="not-prose mb-4 mt-8 text-sm leading-6 text-muted-foreground" data-viz-context>
          먼저 U-Net의 다중 해상도 경로를 보고, 같은 외부 denoising 계약 안에서 MMDiT가 정보 혼합 방식을 어디서 바꾸는지 이어서 비교한다.
        </p>
        <StableDiffusionArchitectureViz />
      </section>

      <section id="conditioning" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">Prompt, negative prompt, CFG가 실제로 하는 일</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            prompt와 negative prompt는 단순 문자열이 아니다. tokenizer가 token id로 바꾸고, text encoder가 embedding sequence로 만든다.
            CFG를 켜면 U-Net을 조건 없는 embedding과 조건 있는 embedding으로 보통 두 번 호출하거나, batch를 합쳐 한 번에 처리한다.
          </p>
          <M display>{'\\begin{aligned} \\Delta\\hat\\epsilon_c&=\\underbrace{\\hat\\epsilon_c-\\hat\\epsilon_{\\emptyset}}_{\\text{prompt가 만든 변화 방향}}\\\\ \\hat\\epsilon_{\\mathrm{cfg}}&=\\hat\\epsilon_{\\emptyset}+\\underbrace{w\\,\\Delta\\hat\\epsilon_c}_{\\text{조건 방향을 w배 강조}} \\end{aligned}'}</M>
          <FormulaNote meaning="조건부 예측에서 무조건 예측을 뺀 방향은 prompt가 만든 변화다. CFG는 그 방향을 w배 강조하지만, 지나치면 자연스러운 생성 분포를 벗어난다." symbols={[[String.raw`\hat\epsilon_\emptyset`, 'prompt가 없을 때의 기준 예측'], [String.raw`\hat\epsilon_c`, 'prompt 조건이 있을 때의 예측'], [String.raw`w`, '두 예측 차이를 얼마나 강조할지 정하는 guidance scale']]} />
          <p>
            <M>{'w'}</M>가 guidance scale이다. SD1.5나 SDXL workflow에서 CFG를 올리면 prompt 충실도가 올라갈 수 있지만,
            색이 타거나 contrast가 거칠어지고, 손·얼굴·텍스트가 더 불안정해질 수 있다. 모델은 “정답 방향”으로만 가는 것이 아니라
            학습 manifold에서 벗어난 강한 조건 방향으로 끌려갈 수 있기 때문이다.
          </p>
          <p>
            <code>clip skip</code>은 text encoder의 마지막 layer 대신 더 앞선 hidden-state layer를 선택하는 pipeline 설정이다.
            어떤 layer가 더 좋은지는 checkpoint의 학습 설정과 model card를 확인하고 같은 seed로 A/B 비교해야 한다. 특정 그림체나
            anime 모델에 보편적으로 유리한 품질 규칙으로 받아들이면 안 된다.
          </p>
          <CitationBlock source="Hugging Face Diffusers StableDiffusionPipeline" citeKey={1} href="https://huggingface.co/docs/diffusers/api/pipelines/stable_diffusion/text2img">
            <p>Diffusers는 clip_skip을 prompt embedding 계산에서 건너뛸 CLIP layer 수로 정의한다. 특정 모델의 품질 효과까지 보장하는 설정은 아니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="sdxl" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">SDXL: 더 큰 U-Net, 두 text encoder, base/refiner</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            SDXL은 SD1.x의 단순 확장이 아니다. SDXL technical report는 이전 Stable Diffusion보다 훨씬 큰 U-Net backbone,
            증가한 attention block, 두 번째 text encoder를 핵심 차이로 설명한다. native 해상도도 512가 아니라 1024 기준으로 보는 것이 자연스럽다.
          </p>
          <FamilyMilestones />
          <p>
            SDXL의 base/refiner 구조는 실전 workflow의 highres fix 감각과 비슷하게 읽을 수 있다. base model이 composition과 큰 구조를 만들고,
            refiner가 낮은 noise 구간에서 texture/detail을 더 다듬는다. ComfyUI에서 base를 일정 denoise 구간까지 돌리고 refiner로 넘기는 workflow가
            나오는 이유가 여기에 있다.
          </p>
          <M display>{'\\begin{aligned} z_{\\mathrm{base}}&:\\quad \\underbrace{\\sigma_{\\mathrm{high}}\\rightarrow\\sigma_{\\mathrm{mid}}}_{\\text{큰 구도와 배치를 결정}}\\\\ z_{\\mathrm{refiner}}&:\\quad \\underbrace{\\sigma_{\\mathrm{mid}}\\rightarrow\\sigma_{\\mathrm{low}}}_{\\text{작은 texture와 경계를 보정}} \\end{aligned}'}</M>
          <FormulaNote meaning="큰 noise 구간에서는 전체 구도와 물체 배치가 정해지고, 낮은 noise 구간에서는 작은 texture와 경계가 다듬어진다. Base와 refiner는 이 noise 구간을 나눠 맡는다." symbols={[[String.raw`\sigma_{high}`, '구조가 아직 크게 바뀔 수 있는 초기 noise'], [String.raw`\sigma_{mid}`, 'base와 refiner를 넘기는 경계'], [String.raw`\sigma_{low}`, '세부 묘사만 조정되는 낮은 noise']]} />
          <p>
            SDXL LoRA를 학습할 때 SD1.5 감각을 그대로 가져오면 안 된다. 권장 해상도, caption 길이, text encoder 처리, target module,
            rank/learning rate가 모두 달라진다. Illustrious는 SDXL architecture를 바꾸지 않고 tag annotation과
            tag·자연어를 함께 쓰는 multi-level caption으로 illustration data contract를 바꾼 사례다.
          </p>
          <CitationBlock source="SDXL: Improving Latent Diffusion Models for High-Resolution Image Synthesis" citeKey={3} href="https://openreview.net/forum?id=di52zR8xgf">
            <p>SDXL report는 더 큰 U-Net backbone, attention block 증가, 두 번째 text encoder, refiner stage를 통해 고해상도 생성 품질을 높인 과정을 설명한다.</p>
          </CitationBlock>
          <CitationBlock source="Illustrious: an Open Advanced Illustration Model" citeKey={4} href="https://arxiv.org/abs/2409.19946">
            <p>Illustrious 논문은 SDXL architecture를 유지하면서 tag-based dataset과 tag·자연어를 결합한 multi-level caption을 사용한 학습 과정을 설명한다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="sd3" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">SD3/SD3.5: U-Net에서 MMDiT로 감각이 바뀐다</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            SD3 계열은 SDXL의 U-Net LDM을 단순히 키운 모델이 아니다. Stability AI는 SD3에서 Multimodal Diffusion Transformer, 즉 MMDiT 구조와
            rectified flow formulation을 사용한다고 설명한다. 중요한 차이는 image feature와 text representation을 transformer token 흐름 안에서 더 직접적으로 섞는다는 점이다.
          </p>
          <p>
            U-Net SD에서 LoRA target은 주로 attention q/k/v/out, 일부 conv, text encoder였다. SD3/SD3.5에서는 transformer block의 attention/MLP,
            modality별 projection, text/image token mixing 위치를 봐야 한다. 따라서 “SDXL에서 잘 먹힌 LoRA rank와 target module”을 그대로 옮기는 것은 이론적으로도 근거가 약하다.
          </p>
          <M display>{'\\begin{gathered} \\underbrace{(h_{\\mathrm{image}},h_{\\mathrm{text}})}_{\\text{입력 token 두 흐름}}\\\\[4pt] \\xrightarrow{\\mathrm{MMDiTBlock}}\\\\[4pt] \\underbrace{(h_{\\mathrm{image}}^{\\prime},h_{\\mathrm{text}}^{\\prime})}_{\\text{서로를 본 뒤 갱신}} \\end{gathered}'}</M>
          <FormulaNote meaning="MMDiT는 text를 고정된 보조 조건으로만 두지 않고 text token과 image token을 한 block 안에서 함께 갱신한다. 그래서 U-Net용 tuning 경험값을 그대로 옮길 수 없다." symbols={[[String.raw`h_{image}`, '현재 noisy image latent의 token 표현'], [String.raw`h_{text}`, 'prompt encoder가 만든 text token 표현'], [String.raw`h'`, '두 modality가 서로를 본 뒤 갱신된 표현']]} />
          <p>
            workflow 수치도 다르게 해석해야 한다. SDXL에서의 CFG, sampler, LoRA strength는 U-Net latent diffusion의 관성 위에서 축적된 경험값이다.
            flow/DiT 계열은 학습된 trajectory와 transformer token mixing이 달라서 같은 숫자가 같은 시각적 의미를 갖지 않는다.
          </p>
          <CitationBlock source="Scaling Rectified Flow Transformers for High-Resolution Image Synthesis" citeKey={5} href="https://arxiv.org/abs/2403.03206">
            <p>SD3 원 논문은 image와 language representation에 별도 weight를 쓰는 MMDiT와 rectified-flow formulation을 구조·학습의 핵심으로 제시한다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="control-editing" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">ControlNet, IP-Adapter, Inpaint는 어디에 끼어드는가</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            SD workflow의 강점은 base denoising loop 사이에 intervention을 넣을 수 있다는 점이다. ControlNet은 pose, depth, edge 같은 조건을
            U-Net block residual로 주입한다. IP-Adapter는 image encoder에서 나온 reference embedding을 attention 쪽 조건으로 넣는다.
            inpaint는 mask와 masked image latent를 추가 입력으로 넣어 특정 영역만 다시 denoise한다.
          </p>
          <ul>
            <li><strong>ControlNet</strong>: “무엇을 그릴지”보다 “어떤 구조를 따를지”를 강제한다. openpose, canny, depth workflow가 여기에 해당한다.</li>
            <li><strong>IP-Adapter</strong>: reference image의 identity/style 신호를 text condition과 병렬로 넣는다.</li>
            <li><strong>Inpaint</strong>: 기존 latent를 유지하면서 mask 내부 noise를 다시 푸는 local generation이다.</li>
            <li><strong>Highres fix</strong>: 저해상도에서 composition을 잡고, latent upscale 후 낮은 denoise strength로 detail을 다시 만든다.</li>
          </ul>
          <p>
            따라서 “모델이 좋아서 결과가 좋다”라고만 보면 workflow를 분석할 수 없다. 같은 checkpoint라도 ControlNet weight, denoise strength,
            mask blur, refiner split, LoRA merge 순서가 다르면 내부적으로 다른 계산 그래프가 된다.
          </p>
        </div>
      </section>

      <section id="finetuning" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">Fine-tuning: 무엇을 업데이트하는가</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            SD 계열 fine-tuning은 “그림체를 학습한다”가 아니라 특정 weight subset에 gradient를 흘리는 일이다.
            full fine-tuning은 U-Net weight 자체를 움직이고, LoRA는 projection layer에 저랭크 변화량을 붙인다.
          </p>
          <M display>{'\\begin{aligned} \\Delta W&=\\underbrace{\\frac{\\alpha}{r}BA}_{\\text{rank로 제한한 학습 변화량}}\\\\ W_{\\mathrm{runtime}}&=W_0+\\underbrace{\\lambda\\Delta W}_{\\text{사용자 strength로 적용}} \\end{aligned}'}</M>
          <FormulaNote meaning="LoRA는 base weight를 직접 덮어쓰지 않고 작은 두 행렬의 곱을 변화량으로 더한다. Runtime strength λ를 바꾸면 같은 adapter의 개입 정도를 조절할 수 있다." symbols={[[String.raw`W_0`, '고정된 base model weight'], [String.raw`BA`, 'rank r로 제한된 학습 변화량'], [String.raw`\alpha/r`, '학습 시 변화량의 기본 scale'], [String.raw`\lambda`, '추론 workflow에서 조절하는 LoRA strength']]} />
          <p>
            SD1.x/SDXL LoRA에서 attention projection이 흔한 target인 이유는 cross-attention이 prompt token과 spatial feature를 묶는 위치이기 때문이다.
            character LoRA는 token과 visual feature의 결합을 바꾸고, style LoRA는 여러 layer의 texture/color/composition prior를 조금씩 밀어낸다.
          </p>
          <ul>
            <li><strong>U-Net LoRA</strong>: style, subject, composition, texture에 직접적인 영향이 크다.</li>
            <li><strong>Text encoder LoRA</strong>: trigger token 의미를 강하게 바꿀 수 있지만 prompt 해석 전체가 흔들릴 수 있다.</li>
            <li><strong>Full fine-tune</strong>: checkpoint prior 자체를 바꾼다. 데이터 중복과 caption 오류가 그대로 모델 습관이 된다.</li>
            <li><strong>Merge</strong>: 여러 checkpoint의 weight 공간을 섞는다. 좋은 샘플은 나와도 원인 추적은 어려워진다.</li>
          </ul>
        </div>
      </section>

      <section id="debugging" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">구현 관점 디버깅 체크리스트</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            Stable Diffusion workflow가 이상할 때는 prompt를 더 길게 쓰기 전에 모듈 경계를 따라 확인해야 한다.
            어떤 문제가 어느 모듈에서 생겼는지 분리하지 않으면 sampler, CFG, LoRA strength를 무작정 바꾸게 된다.
          </p>
          <ul>
            <li><strong>색이 탁하거나 contrast가 이상함</strong>: VAE, CFG 과다, checkpoint 추천 VAE, clip skip을 확인한다.</li>
            <li><strong>prompt를 안 따름</strong>: text encoder 계열, token truncation, CFG, LoRA conflict, trigger token을 본다.</li>
            <li><strong>구도는 맞는데 디테일이 망가짐</strong>: steps, low-noise 구간, refiner/highres fix, VAE decode를 분리한다.</li>
            <li><strong>ControlNet을 넣으면 그림이 딱딱해짐</strong>: control weight, start/end percent, CFG와 denoise strength가 과한지 본다.</li>
            <li><strong>LoRA가 너무 강함</strong>: UI strength만 낮추기 전에 rank, alpha, target module, caption overfit을 기록한다.</li>
          </ul>
          <p>
            좋은 실험 기록은 <code>checkpoint</code>, <code>VAE</code>, <code>sampler</code>, <code>steps</code>, <code>CFG</code>,
            <code>seed</code>, <code>resolution</code>, <code>LoRA strength</code>, <code>ControlNet weight</code>, <code>denoise strength</code>를
            함께 남긴다. 그래야 같은 이미지가 왜 달라졌는지 구현 레벨에서 추적할 수 있다.
          </p>
        </div>
        <CapabilityCheck
          title="이 글을 마치면 모르는 workflow도 이렇게 읽을 수 있어야 한다"
          items={[
            'Checkpoint 파일을 tokenizer·text encoder·denoiser·scheduler·VAE의 실행 그래프로 분해한다.',
            '해상도와 batch가 latent shape, attention 비용과 VRAM을 어떻게 바꾸는지 계산한다.',
            'SD1.x·SDXL의 U-Net 경로와 SD3.5의 MMDiT·flow 경로를 구분한다.',
            'CFG·LoRA·ControlNet·IP-Adapter가 어느 입력이나 weight path에 개입하는지 찾는다.',
            '샘플 실패를 prompt 탓으로 몰지 않고 encoder·denoiser·scheduler·VAE 경계별로 좁힌다.',
          ]}
        />
        <div className="not-prose my-8 grid gap-3 sm:grid-cols-3">
          <Link to={articlePath('ai', 'diffusion-models')} className="rounded-md border p-4 hover:bg-muted/30"><span className="text-[11px] font-bold text-muted-foreground">막힐 때만 · 수학 보강</span><strong className="mt-2 block text-sm">Diffusion 수학과 sampling</strong></Link>
          <Link to={articlePath('ai', 'image-model-runtime')} className="rounded-md border p-4 hover:bg-muted/30"><span className="text-[11px] font-bold text-muted-foreground">같은 실행 관점</span><strong className="mt-2 block text-sm">모델 계열을 가로지르는 runtime</strong></Link>
          <Link to={articlePath('ai', 'open-image-video-models')} className="rounded-md border p-4 hover:bg-muted/30"><span className="text-[11px] font-bold text-muted-foreground">다시 현재로</span><strong className="mt-2 block text-sm">오픈 이미지·비디오 모델 지도</strong></Link>
        </div>
        <SourceNotes sources={[
          { label: 'Latent Diffusion Models', href: 'https://arxiv.org/abs/2112.10752', note: 'VAE latent에서 diffusion을 수행하고 cross-attention으로 조건을 주입한 기반 논문.' },
          { label: 'SDXL Technical Report', href: 'https://openreview.net/forum?id=di52zR8xgf', note: '더 큰 U-Net, 두 text encoder와 refiner 구조의 원 보고서.' },
          { label: 'Illustrious', href: 'https://arxiv.org/abs/2409.19946', note: 'SDXL architecture 위에 tag-based data와 multi-level caption을 적용한 illustration model 원 논문.' },
          { label: 'Stable Diffusion 3 paper', href: 'https://arxiv.org/abs/2403.03206', note: 'MMDiT의 modality별 weight, joint attention과 rectified-flow 기준.' },
          { label: 'Diffusers · Stable Diffusion 3', href: 'https://huggingface.co/docs/diffusers/api/pipelines/stable_diffusion/stable_diffusion_3', note: 'SD3.5도 공유하는 MMDiT, flow scheduler, 세 text encoder의 현재 구현 문서.' },
          { label: 'Stability AI · Stable Diffusion 3.5', href: 'https://stability.ai/news/introducing-stable-diffusion-3-5', note: 'SD3.5 model variants와 QK normalization을 설명한 공식 공개 글.' },
          { label: 'Stability AI · Core models (2026)', href: 'https://stability.ai/core-models', note: '2026년 공식 공개 catalog 경계. 이 글이 최신 전체 이미지 모델 순위표가 아님을 확인한다.' },
        ]} />
      </section>
    </div>
  );
}

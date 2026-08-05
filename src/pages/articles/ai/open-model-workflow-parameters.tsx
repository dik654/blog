import { CitationBlock } from '@/components/ui/citation';
import M from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import {
  CapabilityCheck,
  ConceptPrimer,
  LearningHandoff,
  Misconception,
  QuestionLead,
  SourceNotes,
} from '@/components/learning/ArticleLearning';
import { ParameterBudgetExplorer } from './open-model-core/viz/OpenModelExplorers';

export default function OpenModelWorkflowParametersArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">수치는 UI 옵션이 아니라 수학의 노브다</h2>
        <QuestionLead
          question="누군가 잘 나온 workflow의 steps 28, CFG 4, 1024px을 그대로 쓰면 같은 품질이 나올까?"
          answer="그 수치는 특정 model revision, prediction target, solver, latent compression과 hardware에서만 의미가 닫힌다. Steps는 denoiser 호출 예산, sigma는 상태 경로, guidance는 조건 방향의 힘, resolution·frames는 tensor 크기다. 숫자를 복사하기 전에 무엇을 바꾸는 knob인지 읽어야 한다."
        />
        <ConceptPrimer items={[
          { term: 'Seed', meaning: '초기 noise와 stochastic operation의 출발점을 고정하는 값이다.', why: '한 축씩 비교할 때 시작 상태 차이를 제거한다.' },
          { term: 'Noise schedule', meaning: 'Inference가 통과할 noise level의 순서다.', why: 'Model이 학습한 시간 좌표와 solver 호출 지점을 맞춘다.' },
          { term: 'Guidance', meaning: '조건이 만든 prediction 방향을 얼마나 반영할지 정하는 힘이다.', why: '품질 점수가 아니라 adherence와 자연스러움의 tradeoff로 읽는다.' },
          { term: 'Budget', meaning: 'Token 수, model call, activation과 transfer를 합친 실행 비용이다.', why: 'Preset을 latency·VRAM 가설로 바꾼다.' },
        ]} />
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            ComfyUI나 Diffusers에서 보는 <code>steps</code>, <code>sampler</code>, <code>CFG</code>, <code>sigma</code>,
            <code>resolution</code>, <code>frames</code>, <code>LoRA strength</code>는 임의의 프리셋 값이 아니다.
            각각 diffusion/flow trajectory, 조건부 score, latent tensor shape, weight update 크기와 연결된다.
          </p>
          <p>
            그래서 워크플로우를 이해하려면 “이 수치를 올리면 좋아진다”가 아니라 “어떤 수학적 항을 키우거나 줄이는가”로 읽어야 한다.
          </p>
          <p>
            가장 단순화하면 노이즈가 섞인 latent는 아래처럼 쓸 수 있다. UI의 <code>sigma</code>, timestep, sampler는 이 노이즈 레벨을 따라
            어디에서 어디로 이동할지를 정하는 장치다.
          </p>
          <M display>{'\\begin{aligned} x_t&=\\underbrace{\\alpha_tx_0}_{\\text{현재 남긴 clean signal}}+\\underbrace{\\sigma_t\\epsilon}_{\\text{현재 noise level}}\\\\ \\epsilon&\\sim\\underbrace{\\mathcal N(0,I)}_{\\text{seed가 결정하는 Gaussian noise}} \\end{aligned}'}</M>
          <FormulaNote meaning="Workflow의 timestep과 sigma는 추상적인 숫자가 아니라 현재 latent에 원본 신호와 noise가 얼마나 섞였는지를 나타낸다." symbols={[[String.raw`x_0`, '생성 과정이 도달하려는 clean latent'], [String.raw`\alpha_t`, '현재 남아 있는 clean signal 비율'], [String.raw`\sigma_t`, '현재 noise level'], [String.raw`\epsilon`, 'seed에서 결정되는 Gaussian noise']]} />
          <CitationBlock source="Stable Diffusion XL Technical Report" citeKey={1} href="https://openreview.net/forum?id=di52zR8xgf">
            <p>SDXL report는 latent diffusion 구조, conditioning scheme, aspect ratio/size conditioning, refiner stage를 설명한다.</p>
          </CitationBlock>
        </div>
        <ParameterBudgetExplorer />
      </section>
      <section id="steps-sigma" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">steps·sampler·sigma</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            diffusion/flow 모델은 noise가 큰 상태에서 작은 상태로 이동한다. 이상적으로는 연속적인 경로를 따라가지만,
            실제 inference는 <code>steps</code>개의 점으로 나눠 근사한다. <code>sigma</code> 또는 timestep schedule은 각 점의
            noise level을 의미하고, sampler는 그 점 사이를 어떻게 이동할지 정하는 수치해석 방법이다.
          </p>
          <M display>{'\\begin{aligned} \\hat\\epsilon_i&=\\underbrace{\\hat\\epsilon_\\theta(x_{t_i},t_i,c)}_{\\text{denoiser가 예측한 이동 방향}}\\\\ x_{t_{i-1}}&=\\underbrace{\\Phi(x_{t_i},\\hat\\epsilon_i,\\sigma_i,\\sigma_{i-1})}_{\\text{두 noise level 사이 sampler 갱신}} \\end{aligned}'}</M>
          <FormulaNote meaning="Sampler는 모델 자체가 아니라 denoiser의 예측을 이용해 두 noise level 사이를 이동하는 수치적 갱신 규칙이다." symbols={[[String.raw`\Phi`, 'Euler·DPM++·UniPC 등 sampler 한 step'], [String.raw`\hat\epsilon_\theta`, 'checkpoint가 예측한 noise 또는 velocity'], [String.raw`\sigma_i,\sigma_{i-1}`, '현재와 다음 step의 noise level']]} />
          <p>
            여기서 <M>{'\\Phi'}</M>가 sampler의 한 step update다. 즉 <code>Euler</code>, <code>DPM++</code>, <code>UniPC</code> 같은 이름은
            같은 denoiser 예측을 다른 방식으로 적분하는 선택지에 가깝다.
          </p>
          <ul>
            <li><strong>steps 증가</strong>: 근사는 촘촘해지지만 시간이 늘고, 일정 이상에서는 품질 이득이 작아진다.</li>
            <li><strong>sampler 변경</strong>: 같은 denoiser라도 경로가 달라져 texture, contrast, motion smoothness가 바뀐다.</li>
            <li><strong>turbo/distilled 모델</strong>: 적은 step에 맞춰 학습되었으므로 일반 모델처럼 step을 크게 늘리는 것이 항상 유리하지 않다.</li>
          </ul>
          <Misconception>
            Step 수를 늘리는 것은 model capacity를 늘리는 일이 아니다. 같은 함수 평가를 더 촘촘히 할 뿐이며, distilled model에서는 학습한 짧은 trajectory를 벗어나 오히려 artifact가 늘 수 있다.
          </Misconception>
          <CitationBlock source="Scaling Rectified Flow Transformers for High-Resolution Image Synthesis" citeKey={2} href="https://arxiv.org/abs/2403.03206">
            <p>SD3 논문은 rectified flow formulation과 MM-DiT architecture를 고해상도 text-to-image generation에 적용한다.</p>
          </CitationBlock>
        </div>
      </section>
      <section id="cfg-guidance" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">CFG·guidance scale</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            CFG는 조건이 있는 예측과 조건이 없는 예측의 차이를 키운다. 보통 denoiser가 예측한 noise 또는 velocity를 아래처럼 섞는다고 읽으면 된다.
          </p>
          <M display>{'\\begin{aligned} \\Delta\\hat\\epsilon_c&=\\underbrace{\\hat\\epsilon_c-\\hat\\epsilon_{\\emptyset}}_{\\text{prompt가 만든 조건 방향}}\\\\ \\hat\\epsilon_{\\mathrm{cfg}}&=\\hat\\epsilon_{\\emptyset}+\\underbrace{w\\,\\Delta\\hat\\epsilon_c}_{\\text{guidance scale로 방향을 강조}} \\end{aligned}'}</M>
          <FormulaNote meaning="Guidance scale은 prompt가 만든 예측 차이를 확대한다. 품질을 직접 올리는 값이 아니라 조건 충실도와 자연스러운 생성 분포 사이를 조절한다." symbols={[[String.raw`\hat\epsilon_\emptyset`, '조건 없는 기준 예측'], [String.raw`\hat\epsilon_c`, 'prompt 조건 예측'], [String.raw`w`, 'UI에서 조절하는 CFG 또는 guidance scale']]} />
          <p>
            여기서 <M>{'w'}</M>가 UI의 guidance scale이다. <M>{'w'}</M>가 너무 작으면 prompt를 덜 따르고,
            너무 크면 모델이 자연스러운 manifold에서 벗어난다.
          </p>
          <p>
            이미지에서는 과포화, anatomy collapse, harsh contrast로 보이고, 비디오에서는 motion stiffness, flicker, audio-video desync로 보일 수 있다.
            LTX처럼 modality guidance가 있는 모델은 text CFG뿐 아니라 audio/video coherence 방향의 guidance도 따로 봐야 한다.
          </p>
        </div>
      </section>
      <section id="shape-cost" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">해상도·프레임·latent shape</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            1024×1024는 pixel size지만 모델은 보통 VAE latent에서 계산한다. VAE scale factor가 8이면 대략 128×128 latent grid가 된다.
            비디오는 여기에 frame 축이 붙는다. 따라서 2배 해상도나 2배 frame은 단순히 출력만 커지는 것이 아니라
            denoiser가 처리할 token 수와 attention/memory 비용을 바꾼다.
          </p>
          <M display>{'\\begin{aligned} z_{\\mathrm{image}}&\\in\\mathbb R^{\\underbrace{C}_{\\text{feature 채널}}\\times\\underbrace{H^{\\prime}\\times W^{\\prime}}_{\\text{압축된 공간 grid}}}\\\\ z_{\\mathrm{video}}&\\in\\mathbb R^{C\\times\\underbrace{T^{\\prime}}_{\\text{압축된 시간축}}\\times H^{\\prime}\\times W^{\\prime}} \\end{aligned}'}</M>
          <FormulaNote meaning="비디오 latent는 이미지 latent에 압축된 시간축이 추가된 tensor다. Frames와 resolution을 올리면 denoiser가 동시에 다뤄야 할 위치 수가 곱으로 증가한다." symbols={[[String.raw`C`, 'latent feature channel'], [String.raw`T'`, 'VAE 압축 뒤 시간 길이'], [String.raw`H',W'`, 'VAE 압축 뒤 공간 해상도']]} />
          <M display>{'\\begin{aligned} N_{\\mathrm{video}}&=\\underbrace{T^{\\prime}H^{\\prime}W^{\\prime}}_{\\text{시간·공간 위치를 모두 token화}}\\\\ \\mathrm{cost}_{\\mathrm{full\\ attn}}&\\sim\\underbrace{\\mathcal O(N_{\\mathrm{video}}^2)}_{\\text{모든 token 쌍을 비교}} \\end{aligned}'}</M>
          <FormulaNote meaning="시간과 공간 위치를 token으로 펼치면 전체 token 수는 T'·H'·W'다. Full attention은 이 모든 token 쌍을 비교하므로 비용이 그 수의 제곱으로 커진다." symbols={[[String.raw`N_{video}`, 'attention이 보는 전체 시공간 token 수'], [String.raw`T'H'W'`, '시간축과 공간 grid의 곱'], [String.raw`N_{video}^2`, '모든 token 쌍을 직접 비교하는 비용']]} />
          <p>
            실제 모델은 window attention, factorized attention, patching, temporal compression 같은 최적화를 쓰지만,
            workflow에서 <code>frames</code>와 <code>resolution</code>을 올릴 때 비용이 급격히 커지는 이유는 이 token 수 증가에서 출발한다.
          </p>
          <ul>
            <li><strong>이미지 모델</strong>: 해상도 증가는 composition과 detail을 바꾸지만 VRAM도 증가시킨다.</li>
            <li><strong>비디오 모델</strong>: frame 수 증가는 motion context를 늘리지만 temporal consistency 비용이 커진다.</li>
            <li><strong>애니메이션</strong>: FPS를 올린다고 무조건 좋아지지 않는다. timing, hold frame, smear frame이 깨질 수 있다.</li>
          </ul>
        </div>
      </section>
      <section id="model-differences" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">모델별로 같은 수치가 다르게 먹히는 이유</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            Parameter 값에는 단위와 적용 대상이 숨어 있다. Guidance 4가 text CFG인지, true CFG인지, distilled guidance embedding인지부터 다를 수 있다.
            Steps 4도 training으로 압축한 네 번인지, base solver를 네 번만 부른 것인지 다르다. 따라서 family 사이에는 숫자를 이식하지 말고 목적과 반응 curve를 이식한다.
          </p>
          <ul>
            <li><strong>Stable Diffusion / SDXL</strong>: U-Net과 CFG 기반 community preset이 넓지만 checkpoint·sampler·VAE 조합에 따라 optimum이 달라진다.</li>
            <li><strong>Krea 2·FLUX.2 base 계열</strong>: Rectified-flow/DiT contract와 timeshift, reference condition을 확인한다. Distilled variant의 step을 base에 옮기지 않는다.</li>
            <li><strong>FLUX.2 klein distilled/base</strong>: 같은 4B·9B 안에서도 step-distilled API/local variant와 undistilled fine-tuning base를 구분한다.</li>
            <li><strong>LTX-2.3</strong>: Video/audio latent, frame 수와 configuration에 따라 steps·guidance가 motion과 sync에 함께 작용한다.</li>
            <li><strong>Wan2.2</strong>: A14B의 expert switch와 TI2V-5B의 dense path를 구분하고 task별 recommended schedule을 pin한다.</li>
          </ul>
          <p>
            실험은 seed set을 고정하고 한 축만 sweep한다. Steps라면 quality·latency curve, guidance라면 adherence·artifact curve, resolution·frames라면
            task metric·peak VRAM·wall time curve를 만든다. Best sample 대신 중앙값과 실패율을 보고, model revision이 바뀌면 curve를 다시 만든다.
          </p>
        </div>
        <CapabilityCheck items={[
          'Seed, steps, sigma schedule와 solver가 각각 무엇을 고정하거나 바꾸는지 설명할 수 있다.',
          'Guidance를 품질 값이 아니라 조건 방향의 힘과 회귀 위험으로 읽을 수 있다.',
          'Resolution과 frames가 latent token·attention·activation budget을 키우는 과정을 계산할 수 있다.',
          '다른 model family 사이에서 parameter 숫자를 그대로 이식하지 않고 response curve를 다시 측정할 수 있다.',
        ]} />
        <LearningHandoff
          description="Parameter audit의 산출물은 잘 나온 preset이 아니라 model revision과 seed set이 고정된 quality·latency·VRAM response curve다. 목표 curve가 부족할 때만 finetuning으로 넘어가고, 공유할 때는 실행 graph와 manifest를 함께 고정한다."
          items={[
            { label: '막히면', slug: 'image-model-runtime', title: 'Image Model Runtime', reason: 'Steps·guidance·resolution이 condition, denoiser, solver와 activation 중 무엇을 바꾸는지 다시 찾는다.' },
            { label: '막히면', slug: 'video-model-runtime', title: 'Video Model Runtime', reason: 'Frame·FPS·temporal latent가 spatial parameter와 곱해지는 memory·consistency 책임을 복습한다.' },
            { label: '이어 읽기', slug: 'open-model-finetuning-theory', title: 'Open Model Finetuning', reason: 'Inference knob로 고칠 수 없는 domain·identity·style gap인지 확인한 뒤 학습 target과 evidence를 설계한다.' },
            { label: '적용하기', slug: 'open-model-community-workflows', title: 'Community Workflow 검증', reason: 'Response curve를 만든 exact artifact·environment·sampling state를 실행 가능한 manifest로 배포한다.' },
          ]}
        />
        <SourceNotes sources={[
          { label: 'SDXL Technical Report', href: 'https://openreview.net/forum?id=di52zR8xgf', note: 'Latent diffusion, size conditioning과 refiner 기준.' },
          { label: 'Stable Diffusion 3 paper', href: 'https://arxiv.org/abs/2403.03206', note: 'Rectified flow와 MM-DiT의 prediction·sampling 기준.' },
          { label: 'FLUX.2 documentation', href: 'https://docs.bfl.ai/flux_2/flux2_overview', note: 'Distilled/base variant와 fixed endpoint의 parameter boundary.' },
          { label: 'Wan2.2 repository', href: 'https://github.com/Wan-Video/Wan2.2', note: 'Video task별 configuration과 MoE/dense 구분.' },
        ]} />
      </section>
    </div>
  );
}

import { Link } from 'react-router-dom';
import { CitationBlock } from '@/components/ui/citation';
import M from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import {
  CapabilityCheck,
  ConceptPrimer,
  Misconception,
  QuestionLead,
  SourceNotes,
} from '@/components/learning/ArticleLearning';
import { articlePath } from '@/lib/paths';
import {
  AdaptationDecisionExplorer,
  OpenMediaReleaseGate,
} from './open-model-core/viz/OpenModelExplorers';

export default function OpenModelFinetuningTheoryArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">왜 방법론부터 알아야 하는가</h2>
        <QuestionLead
          question="제품 identity가 흔들리면 곧바로 full fine-tuning을 해야 할까?"
          answer="아니다. 한 번의 layout은 prompt·box·mask가, 기존 제품 보존은 reference condition이, 반복되는 좁은 개념은 LoRA가 더 직접적일 수 있다. Base model이 갖지 못한 분포를 지속적으로 바꿔야 하고 충분한 데이터·회귀 suite·compute가 있을 때만 넓은 fine-tuning을 검토한다."
        />
        <ConceptPrimer items={[
          { term: 'Inference control', meaning: 'Weight를 바꾸지 않고 prompt, reference, mask와 control input으로 결과를 조종한다.', why: '가장 작고 되돌리기 쉬운 개입부터 시작한다.' },
          { term: 'Trainable scope', meaning: '학습 중 gradient를 받아 실제로 움직이는 module과 parameter 범위다.', why: '비용과 회귀 원인을 미리 한정한다.' },
          { term: 'Adaptation delta', meaning: 'Base model에 추가하려는 identity, style, motion 또는 domain 변화다.', why: '막연한 품질 향상 대신 학습 가능한 목표를 만든다.' },
          { term: 'Regression suite', meaning: '새 능력을 얻는 동안 기존 prompt·style·identity 능력이 망가지지 않았는지 보는 고정 평가다.', why: 'Train loss가 좋아도 product model은 실패할 수 있다.' },
        ]} />
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>Stable Diffusion, SDXL, SD3.5, FLUX, Wan, LTX, HunyuanVideo, Z-Image, Sulphur 2를 full fine-tuning하려면 “트레이너 실행해줘”로는 부족하다. 모델마다 학습 가능한 장기와 병목이 다르고, 잘못 건드리면 좋은 base model을 비싼 비용으로 망가뜨린다. 작업자를 시키려면 최소한 어떤 weight를 업데이트할지, 어떤 데이터가 그 weight에 신호를 줄지, 어떤 검증으로 성공을 판정할지 알아야 한다.</p>
          <p>가장 큰 구분은 LoRA와 full fine-tuning이다. LoRA는 원본 weight를 고정하고 작은 변화량만 학습한다. full fine-tuning은 원본 weight 자체를 이동시킨다. 전자는 싸고 되돌리기 쉽지만 변화 폭이 제한된다. 후자는 모델 prior를 깊게 바꿀 수 있지만 catastrophic forgetting, overfit, license risk, 재현성 문제가 커진다.</p>
          <p>따라서 full fine-tuning의 목적은 “품질을 높인다”가 아니라 더 구체적이어야 한다. 예를 들어 캐릭터 identity를 더 잘 보존한다, 특정 브랜드 제품을 정확히 그린다, 특정 카메라 motion을 익힌다, 2D animation timing을 배운다, 특정 도메인의 typography를 안정화한다처럼 학습 목표를 좁혀야 한다.</p>
          <CitationBlock source="Hugging Face Diffusers training examples" citeKey={1} href="https://github.com/huggingface/diffusers/tree/main/examples">
            <p>Diffusers는 Stable Diffusion, SDXL, SD3, FLUX 등 다양한 diffusion/DiT 계열 학습 예제를 제공하며, full fine-tuning과 LoRA를 구현하는 기본 참조점으로 쓰인다.</p>
          </CitationBlock>
        </div>
        <AdaptationDecisionExplorer />
      </section>

      <section id="mental-model" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">Full fine-tuning의 수학적 감각</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>full fine-tuning은 loss를 줄이기 위해 원본 weight를 직접 업데이트한다.</p>
          <M display>{'\\underbrace{W}_{\\text{학습 대상 weight}}\\leftarrow \\underbrace{W}_{\\text{현재 weight}}-\\underbrace{\\eta}_{\\text{learning rate}}\\underbrace{\\nabla_W\\mathcal{L}}_{\\text{loss 를 줄이는 gradient}}'}</M>
          <FormulaNote meaning="Full fine-tuning은 pretrained weight 자체를 현재 데이터의 loss가 줄어드는 방향으로 이동시킨다. 따라서 새 능력을 얻는 변화와 기존 prior를 잃는 변화가 같은 update 안에서 일어난다." symbols={[[String.raw`W`, '직접 수정되는 모델 weight'], [String.raw`\eta`, '한 step의 이동 크기를 정하는 learning rate'], [String.raw`\nabla_W\mathcal L`, '현재 batch loss가 가장 빨리 커지는 방향이므로 빼서 loss를 낮춤']]} />
          <p>이 식은 단순하지만 의미는 크다. pretrained model이 갖고 있던 “세상에 대한 prior”가 바뀐다. 이미지 모델에서는 구도, 질감, 스타일, 텍스트 해석이 바뀌고, 비디오 모델에서는 motion prior, frame-to-frame identity, camera movement, temporal consistency가 바뀐다.</p>
          <p>LoRA는 같은 문제를 제한된 변화량으로 푼다.</p>
          <M display>{'\\begin{aligned} \\Delta W&=\\underbrace{\\frac{\\alpha}{r}BA}_{\\text{rank로 제한한 adapter 변화량}}\\\\ W_{runtime}&=W_0+\\underbrace{\\lambda\\Delta W}_{\\text{추론 strength로 적용}} \\end{aligned}'}</M>
          <FormulaNote meaning="LoRA는 base weight를 고정하고 rank가 작은 두 행렬의 곱만 학습한다. 표현할 변화의 범위를 제한하는 대신 학습 메모리와 저장 비용을 줄인다." symbols={[[String.raw`W_0`, '고정된 base weight'], [String.raw`BA`, '학습되는 low-rank 변화량'], [String.raw`r`, 'adapter의 표현 용량을 정하는 rank'], [String.raw`\lambda`, '추론 때 적용 강도를 바꾸는 계수']]} />
          <p>LoRA가 실패하는 상황은 대개 “필요한 변화가 low-rank adapter로 표현하기 어렵거나, target module이 틀렸거나, base prior 자체를 더 깊게 바꿔야 하는 경우”다. full fine-tuning은 이 한계를 넘을 수 있지만, 그만큼 데이터와 검증이 훨씬 중요해진다.</p>
          <p>작업 지시의 핵심은 trainable scope다. 모든 weight를 무작정 업데이트할지, denoiser만 업데이트할지, text encoder를 얼릴지, VAE는 고정할지, 특정 block만 열지, MoE expert 중 일부만 학습할지 정해야 한다. 이 결정을 못 하면 비용과 실패 원인을 해석할 수 없다.</p>
          <p>목표 능력만 올리고 기존 능력을 보존하려면 학습 objective도 두 방향을 분리해서 본다.</p>
          <M display>{String.raw`\begin{aligned}
            \mathcal L_{\text{adapt}}&=
              \underbrace{\mathcal L_{\text{target}}(D_{\text{new}})}_{\text{새 능력 학습}}\\
              &\quad+
              \underbrace{\beta\,\mathcal L_{\text{retain}}(D_{\text{base}})}_{\text{기존 능력 보존}}
          \end{aligned}`}</M>
          <FormulaNote meaning="새 데이터의 loss만 줄이면 base 능력을 잃을 수 있다. Target 향상과 기존 분포 보존을 별도 dataset·metric으로 측정하고 균형을 정한다." symbols={[[String.raw`D_{new}`, '추가할 능력을 담은 curated dataset'], [String.raw`D_{base}`, '기존 능력을 확인하는 replay·validation set'], [String.raw`\mathcal L_{target}`, '목표 능력의 학습 신호'], [String.raw`\beta`, '기존 능력 보존에 주는 상대 비중']]} />
        </div>
      </section>

      <section id="model-anatomy" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">모델별로 알아야 할 내부 장기</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>모델 이름이 달라도 생성 파이프라인은 대체로 조건 인코더, latent autoencoder, denoiser, scheduler로 나눌 수 있다. full fine-tuning은 이 중 어디를 움직일지 정하는 일이다.</p>
          <ul>
            <li><strong>U-Net latent diffusion 기준선</strong>: Stable Diffusion 1.x와 SDXL은 attention·residual 경로의 adapter 생태계가 넓다. Denoiser와 text encoder를 같이 열면 prompt 의미까지 움직일 수 있다.</li>
            <li><strong>Image DiT / flow 계열</strong>: Krea 2, FLUX.2와 SD3 계열은 text/image token 결합, timestep modulation, attention·MLP target과 VAE contract를 확인한다. 같은 family 안에서도 distilled inference variant와 undistilled training base를 구분한다.</li>
            <li><strong>Typography·layout 특화 공개 weight</strong>: Ideogram 4.0처럼 fine-tuning과 내부 배포를 공식 지원하는 경우에도 exact training API, commercial license와 current feature boundary를 model card에서 다시 확인한다.</li>
            <li><strong>Video DiT / joint media</strong>: LTX-2.3은 video·audio condition과 temporal activation이 핵심이다. Trainer가 제공하는 LoRA, IC-LoRA와 full mode를 섞지 않고 exact checkpoint requirement를 pin한다.</li>
            <li><strong>Noise-regime MoE</strong>: Wan2.2 A14B는 high/low-noise expert를 분리한다. TI2V-5B dense model과 구분하고, expert 전체를 열지 일부를 열지에 따라 motion·detail 회귀를 따로 본다.</li>
          </ul>
          <CitationBlock source="LTX-2 Trainer documentation" citeKey={2} href="https://docs.ltx.io/open-source-model/trainer/overview">
            <p>LTX 공식 Trainer가 지원하는 training mode와 현재 checkpoint·hardware 요구사항을 확인하는 1차 자료다. 문서 version이 바뀔 수 있으므로 run manifest에 snapshot을 남긴다.</p>
          </CitationBlock>
          <CitationBlock source="Wan2.2 GitHub" citeKey={3} href="https://github.com/Wan-Video/Wan2.2">
            <p>Wan2.2 저장소는 MoE denoising 구조, high-noise/low-noise expert, upgraded training data, high-compression video generation을 핵심 기술로 설명한다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="data-design" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">데이터셋 설계: 무엇을 배울 수 있게 만들 것인가</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>full fine-tuning에서 데이터는 “많을수록 좋다”가 아니다. 모델이 바뀌길 원하는 방향과 caption이 정확히 맞아야 한다. 이미지 모델에 motion을 학습시킬 수 없고, 비디오 모델에 motion label이 없는 클립만 넣으면 무엇이 움직여야 하는지 약한 신호만 준다.</p>
          <p>이미지 모델의 데이터셋은 subject, style, composition, typography, lighting, camera, negative examples를 구분해야 한다. 캐릭터 fine-tune이면 얼굴/의상/포즈/배경을 분리해 caption한다. 브랜드 제품 fine-tune이면 제품 형태, 로고 위치, 재질, 반사, 촬영 각도를 명시한다. typography fine-tune이면 실제 이미지 안의 글자를 OCR schema로 기록해야 한다.</p>
          <p>비디오 모델의 데이터셋은 더 복잡하다. 각 클립마다 subject identity, camera motion, object motion, scene transition, frame count, fps, resolution, shot type, temporal defect를 기록해야 한다. 10초 클립 1개는 이미지 240장과 같지 않다. 모델은 연속성과 motion을 배우므로, frame sampling과 caption schema가 학습 신호를 결정한다.</p>
          <p>validation set은 train set보다 먼저 만들어야 한다. 같은 장면을 외웠는지 확인하는 prompt가 아니라, 학습한 개념을 새로운 조합에서 사용할 수 있는지 보는 prompt를 둔다. full fine-tune은 train loss가 좋아도 validation prompt에서 prompt diversity가 죽는 경우가 흔하다.</p>
          <ul>
            <li><strong>Subject training</strong>: identity consistency, new pose, new lighting, new camera angle.</li>
            <li><strong>Style training</strong>: 다양한 subject에 style이 전이되는지, subject identity를 덮어버리지 않는지.</li>
            <li><strong>Motion training</strong>: 같은 action을 다른 subject/scene에서 유지하는지.</li>
            <li><strong>Typography training</strong>: 글자 정확도, 위치, 언어 혼합, 긴 문자열 실패율.</li>
            <li><strong>Domain training</strong>: 특정 데이터 분포에 맞추되 base model의 일반 능력을 얼마나 잃는지.</li>
          </ul>
        </div>
      </section>

      <section id="training-stack" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">학습 스택: 코드보다 먼저 정할 것</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>작업자를 시킬 때는 “Kohya로 해줘”, “Diffusers로 해줘”보다 먼저 다음 결정을 줘야 한다.</p>
          <ol>
            <li><strong>Base checkpoint</strong>: SDXL base인지, 특정 finetune checkpoint인지, FLUX dev인지, LTX 2.3 dev인지, Sulphur를 base로 할지.</li>
            <li><strong>Training target</strong>: denoiser 전체, 일부 transformer block, attention only, MLP 포함, text encoder 포함 여부.</li>
            <li><strong>Precision</strong>: bf16/fp16/fp8 loading, optimizer precision, gradient accumulation, checkpoint save dtype.</li>
            <li><strong>Memory strategy</strong>: gradient checkpointing, block swapping, CPU offload, FSDP, DeepSpeed ZeRO, activation checkpointing.</li>
            <li><strong>Data pipeline</strong>: resize/crop policy, bucketing, frame sampling, caption format, duplicate removal, validation split.</li>
            <li><strong>Optimization</strong>: LR, scheduler, warmup, batch size, accumulation, optimizer, weight decay, EMA 여부.</li>
            <li><strong>Evaluation</strong>: fixed prompt suite, seed list, base-vs-ft grid, checkpoint interval, rollback criterion.</li>
          </ol>
          <p>full fine-tuning의 메모리는 대략 네 덩어리다. 모델 weight, optimizer state, gradient, activation이다. Adam 계열 optimizer는 weight보다 optimizer state가 더 큰 경우가 많다. 비디오 모델은 여기에 sequence length가 곱으로 들어와 activation이 폭증한다.</p>
          <M display>{'\\begin{aligned} \\mathrm{fixed}&=\\underbrace{W+G+O}_{\\text{weight·gradient·optimizer state}}\\\\ \\mathrm{dynamic}&=\\underbrace{A(T,H,W,B)}_{\\text{frame·해상도·batch가 키우는 activation}}\\\\ \\mathrm{train\\ memory}&\\approx\\mathrm{fixed}+\\mathrm{dynamic} \\end{aligned}'}</M>
          <FormulaNote meaning="학습 VRAM은 weight만 세면 안 된다. Gradient와 optimizer state가 상시 메모리를 차지하고, activation은 frame·해상도·batch에 따라 실행 중 크게 변한다." symbols={[[String.raw`W`, '모델 weight 메모리'], [String.raw`G`, 'backpropagation을 위한 gradient'], [String.raw`O`, 'Adam moment 등 optimizer state'], [String.raw`A(T,H,W,B)`, '시간·공간·batch 크기에 따라 증가하는 activation']]} />
          <div className="not-prose my-5 border-l-2 border-blue-500/55 pl-4 text-sm leading-7">
            <strong>계산 감각을 위한 가상 예시</strong>
            <p className="mt-1 text-muted-foreground">
              10억 parameter를 bf16 weight와 bf16 gradient로 두고, Adam의 두 moment만 fp32로 잡으면
              <code className="mx-1">W=2 GB</code>, <code className="mx-1">G=2 GB</code>,
              <code className="mx-1">O=8 GB</code>이므로 fixed lower bound는 약 12 GB다.
              한 실행의 activation이 6 GB라면 벌써 약 18 GB다. FP32 master weight, allocator fragmentation,
              communication buffer와 kernel workspace는 아직 더하지 않은 값이므로 실제 예약량은 반드시 profiler로 다시 잰다.
            </p>
          </div>
          <p>여기서 <M>{'A'}</M>는 activation memory이고, 비디오에서는 frame count <M>{'T'}</M>, 해상도 <M>{'H,W'}</M>, batch size <M>{'B'}</M>에 민감하다. 그래서 비디오 full fine-tune은 “파라미터 수가 몇 B인가”보다 “몇 프레임, 몇 해상도, 어떤 attention, 어떤 offload인가”가 더 중요하다.</p>
          <CitationBlock source="HunyuanVideo 1.5 GitHub" citeKey={4} href="https://github.com/Tencent-Hunyuan/HunyuanVideo-1.5">
            <p>HunyuanVideo 1.5 저장소는 inference code와 weights를 공개하고, LoRA fine-tuning에는 <code>--use_lora</code> 옵션을 사용한다고 안내한다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="model-playbooks" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">구조별 작업 지시 플레이북</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>모델 이름별 command를 외우지 않고 trainable 구조와 목표 변화에 따라 작업 지시를 만든다. 새 family가 나와도 아래 네 playbook 중 어디에 속하는지 먼저 판정한다.</p>
          <h3>U-Net image latent</h3>
          <p>Attention·residual 중 target module, text encoder freeze, VAE 고정, prior preservation과 validation seed를 명시한다. Identity와 style leakage, prompt diversity를 따로 측정한다.</p>
          <h3>Image DiT / flow</h3>
          <p>Distilled inference checkpoint가 아니라 training signal이 남은 base인지 확인한다. Single·dual stream, attention·MLP, timestep modulation과 text/VLM encoder 중 무엇을 열지 정한다. Typography와 layout fixture를 회귀 suite에 넣는다.</p>
          <h3>Video DiT / joint audio-video</h3>
          <p>Frame sampling, temporal compression, audio condition, VAE와 text/audio encoder freeze를 기록한다. Activation budget을 frame·resolution·batch로 산정하고, identity·motion·flicker·sync를 별도 metric으로 본다.</p>
          <h3>Noise-regime MoE</h3>
          <p>High/low-noise expert와 shared module 중 어느 scope를 열지 정한다. Expert 전환 구간을 고정하고 layout·motion 개선이 detail prior를 해치지 않는지 양쪽 noise fixture로 검증한다.</p>
        </div>
      </section>

      <section id="agent-brief" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">작업자에게 이렇게 시켜야 한다</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>full fine-tuning 작업을 맡길 때는 “모델 학습해줘”가 아니라 다음 산출물을 요구해야 한다.</p>
          <ul>
            <li><strong>Feasibility memo</strong>: 선택 모델, license, trainer, expected VRAM, expected disk, 예상 시간, 실패 가능성.</li>
            <li><strong>Dataset manifest</strong>: 파일 목록, caption, 해상도/프레임, 중복 제거 기준, train/validation split.</li>
            <li><strong>Training config</strong>: trainable modules, learning rate, scheduler, batch/accumulation, precision, optimizer, checkpoint interval.</li>
            <li><strong>Baseline grid</strong>: base model 결과와 fine-tuned checkpoint 결과를 같은 prompt/seed/steps로 비교.</li>
            <li><strong>Regression grid</strong>: 학습 목표가 아닌 일반 prompt에서 base 능력을 얼마나 잃었는지 확인.</li>
            <li><strong>Rollback plan</strong>: overfit, prompt collapse, motion collapse, identity drift가 보이면 어느 checkpoint로 돌아갈지.</li>
          </ul>
          <p>이 산출물이 없으면 결과 이미지/영상이 몇 개 좋아 보여도 재현 가능한 모델 작업이라고 보기 어렵다. 특히 full fine-tune은 비용이 크기 때문에, 첫 실험은 항상 작은 데이터와 짧은 step으로 “망가지는 방향”을 먼저 확인해야 한다.</p>
        </div>
        <OpenMediaReleaseGate />
      </section>

      <section id="failure-modes" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">실패 모드와 판정 기준</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>full fine-tune의 실패는 loss curve만으로 잡히지 않는다. 이미지가 예뻐졌는데 prompt diversity가 죽거나, motion은 좋아졌는데 identity가 흔들리거나, 특정 스타일은 강해졌는데 일반 사진 prompt가 망가질 수 있다.</p>
          <ul>
            <li><strong>Overfit</strong>: training subject는 잘 나오지만 새로운 구도와 조명에서 무너진다.</li>
            <li><strong>Forgetting</strong>: base model의 일반 능력, prompt following, style diversity가 줄어든다.</li>
            <li><strong>Caption mismatch</strong>: caption이 실제 학습 목표를 설명하지 않아 모델이 엉뚱한 상관관계를 배운다.</li>
            <li><strong>Text encoder drift</strong>: token 의미가 바뀌어 기존 prompt convention이 깨진다.</li>
            <li><strong>Motion collapse</strong>: 비디오에서 움직임이 작아지거나 반복 motion으로 수렴한다.</li>
            <li><strong>Temporal artifact</strong>: flicker, identity drift, background swimming, limb inconsistency가 늘어난다.</li>
            <li><strong>Checkpoint stacking</strong>: 이미 fine-tuned된 모델 위에 다시 학습해 bias가 누적된다.</li>
          </ul>
          <p>성공 판정은 한 장의 best sample이 아니라 고정 prompt suite의 평균 실패율로 한다. full fine-tune은 “잘 나온 샘플”보다 “나빠진 영역이 어디인가”를 먼저 봐야 한다.</p>
          <CitationBlock source="DreamBooth paper" citeKey={5} href="https://arxiv.org/abs/2208.12242">
            <p>DreamBooth는 subject-driven generation에서 prior preservation이 왜 필요한지 보여주는 대표적인 fine-tuning reference다.</p>
          </CitationBlock>
        </div>
        <Misconception>
          Train loss가 더 낮고 cherry-picked sample이 더 예쁘다고 adaptation 성공이 아니다. 목표 fixture의 실패율이 줄고, base regression suite와 license·replay gate가 함께 닫혀야 한다.
        </Misconception>
      </section>

      <section id="takeaway" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">핵심 정리</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>내가 fine-tuning 작업을 시키려면 모델의 품질보다 먼저 변화 목표와 학습 표면을 알아야 한다. U-Net, image DiT, joint audio-video DiT와 noise-regime MoE는 trainable module과 activation 병목이 다르다. Family 이름이 아니라 exact training base와 revision을 고정한다.</p>
          <p>두 번째로 데이터셋과 caption schema를 설계해야 한다. 모델은 데이터에 없는 개념을 배우지 못하고, caption에 없는 구분을 안정적으로 분리하지 못한다. full fine-tune은 데이터 설계가 곧 모델 설계다.</p>
          <p>세 번째로 검증 프로토콜을 요구해야 한다. 작업자에게 필요한 산출물은 예쁜 샘플이 아니라 dataset manifest, training config, base-vs-ft grid, regression grid, rollback 기준이다. 이 네 가지가 있어야 모델을 계속 개선할 수 있다.</p>
        </div>
        <CapabilityCheck items={[
          'Prompt·control, reference, LoRA와 full fine-tuning을 update 범위와 rollback 비용으로 구분할 수 있다.',
          'Model family의 exact training base와 trainable module을 지정할 수 있다.',
          'Target dataset과 base regression suite를 분리해 adaptation objective를 설계할 수 있다.',
          '예쁜 sample이 아니라 manifest, baseline·regression grid와 release gate로 성공을 판정할 수 있다.',
        ]} />
        <SourceNotes sources={[
          { label: 'Diffusers training examples', href: 'https://github.com/huggingface/diffusers/tree/main/examples', note: '공개 image model의 LoRA·fine-tuning 구현 기준.' },
          { label: 'LTX Trainer documentation', href: 'https://docs.ltx.io/open-source-model/trainer/overview', note: 'Video model training mode와 runtime requirement.' },
          { label: 'Wan2.2 repository', href: 'https://github.com/Wan-Video/Wan2.2', note: 'MoE·dense task architecture 경계.' },
          { label: 'DreamBooth', href: 'https://arxiv.org/abs/2208.12242', note: 'Subject adaptation과 prior preservation의 최소 연구 기준.' },
        ]} />
      </section>

      <section id="implementation-handoff" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">판정 뒤에는 필요한 구현만 연다</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            공통 production 경로는 여기서 끝난다. 최종 산출물은 모델 이름이 아니라
            <strong> 실패 조건, 가장 작은 충분한 개입, 고정할 표면, 바꿀 표면, target·regression fixture와 rollback</strong>을
            한 장에 적은 adaptation brief다. 그 brief가 weight update를 요구하지 않으면 학습으로 넘어가지 않는다.
          </p>
          <p>
            특히 한 장의 제품·인물·문구를 바꾸면서 나머지를 보존하는 문제라면 LoRA나 full fine-tuning 전에
            mask, semantic condition과 appearance reference를 실제 graph에서 검증한다. 아래 구현 경로는 선택 사항이며
            Image·Video 공통 5단계의 새 필수 선행이 아니다.
          </p>
        </div>
        <div className="not-prose grid gap-3 md:grid-cols-3">
          <Link to={articlePath('ai', 'comfyui-edit-models-flux-qwen')} className="min-w-0 rounded-md border border-border p-4 transition-colors hover:bg-muted/30">
            <span className="text-[11px] font-bold text-blue-700 dark:text-blue-300">한 번의 Image 편집</span>
            <strong className="mt-2 block text-sm leading-snug">FLUX.2·Qwen 2511 condition graph</strong>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">Mask·reference로 보존 실패를 먼저 줄인다.</p>
          </Link>
          <Link to={articlePath('ai', 'illustrious-xl')} className="min-w-0 rounded-md border border-border p-4 transition-colors hover:bg-muted/30">
            <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300">반복되는 Image prior</span>
            <strong className="mt-2 block text-sm leading-snug">Illustrious XL의 작은 적응</strong>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">Tag·style·identity fixture로 LoRA 필요성을 판정한다.</p>
          </Link>
          <Link to={articlePath('ai', 'ltx-23')} className="min-w-0 rounded-md border border-border p-4 transition-colors hover:bg-muted/30">
            <span className="text-[11px] font-bold text-violet-700 dark:text-violet-300">시간축을 바꾸는 Video</span>
            <strong className="mt-2 block text-sm leading-snug">LTX-2.3 training artifact</strong>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">Frame·motion·audio 회귀를 분리한 뒤에만 학습한다.</p>
          </Link>
        </div>
      </section>
    </div>
  );
}

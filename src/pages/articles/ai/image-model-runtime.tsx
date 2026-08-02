import { CitationBlock } from '@/components/ui/citation';
import M from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import {
  BeginnerOpening,
  CapabilityCheck,
  ConceptPrimer,
  LearningHandoff,
  Misconception,
  QuestionLead,
  SourceNotes,
} from '@/components/learning/ArticleLearning';
import { RuntimeInheritanceExplorer } from './open-model-core/viz/OpenModelExplorers';

export default function ImageModelRuntimeArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">한 장은 다섯 계약을 지나 만들어진다</h2>
        <BeginnerOpening
          title="이미지 생성 모델은 완성 그림을 한 번에 꺼내지 않습니다."
          description={<>사람이 포스터를 만들 때도 주문서를 읽고, 작은 작업판에서 구도를 여러 번 고친 뒤, 마지막에 납품용 크기로 펼친다. 이미지 생성 모델도 비슷하게 <strong className="text-foreground">지시를 읽는 단계</strong>, <strong className="text-foreground">압축된 작업 공간에서 그림을 고치는 단계</strong>, <strong className="text-foreground">pixel로 펼치는 단계</strong>를 차례로 지난다.</>}
          familiarScene={<>“빨간 컵, 흰 배경, 위에는 한글 제목”이라고 주문했다고 하자. 제목만 틀렸다면 주문서를 읽는 단계가 문제일 수 있고, 컵 모양이 무너졌다면 그림을 고치는 단계, 색이 탁해졌다면 마지막으로 펼치는 단계가 문제일 수 있다. 결과 한 장만 보고는 어느 단계가 처음 실패했는지 알 수 없다.</>}
          steps={[
            { label: '지시를 읽을 수 있는 숫자로 바꾼다', detail: '글, 참고 이미지와 바꾸어도 되는 영역을 모델이 비교할 수 있는 표현으로 만든다.' },
            { label: '작은 작업 공간에서 여러 번 고친다', detail: '무작위에 가까운 상태에서 시작해, 매 단계 어떤 방향으로 고칠지 예측한다.' },
            { label: '완성 상태를 실제 그림으로 펼친다', detail: '압축된 결과를 RGB pixel로 복원하고 필요한 후처리를 적용한다.' },
          ]}
        />
        <QuestionLead
          label="이제 확인할 질문"
          question="Prompt를 넣으면 모델이 바로 pixel을 그리는 것 아닌가?"
          answer="아니다. 글과 참고 자료를 읽는 단계, 압축된 작업 공간에서 그림을 여러 번 고치는 단계, 그 결과를 실제 pixel로 펼치는 단계가 따로 있다. 각 단계를 condition, latent, denoiser·solver, VAE라고 부른다. 이름보다 먼저 어느 단계가 어떤 입력을 받고 무엇을 넘기는지 구분해야 실패 원인을 찾을 수 있다."
        />
        <ConceptPrimer items={[
          { term: 'Condition', meaning: 'Text, image, mask와 box를 denoiser가 읽을 수 있게 표현한 입력이다.', why: '의도가 어느 stage에서 손실됐는지 찾는다.' },
          { term: 'Latent', meaning: 'Pixel을 더 작은 spatial grid와 feature channel로 압축한 상태다.', why: '해상도·memory·VAE 손실을 같은 그림에서 읽는다.' },
          { term: 'Denoiser', meaning: '현재 noisy state에서 다음 이동 방향 또는 clean target을 예측하는 neural network다.', why: 'U-Net·DiT라는 이름보다 prediction contract를 먼저 본다.' },
          { term: 'Solver / scheduler', meaning: 'Noise level을 어떤 순서와 step으로 지나갈지 정하는 수치 적분 규칙이다.', why: 'Steps와 sampler를 model과 독립된 마법값으로 쓰지 않는다.' },
        ]} />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            한국어 패키지 시안을 만든다고 하자. Prompt에는 문구와 재질이 있고, reference에는 제품 형태와 brand color가 있으며,
            mask에는 바꿔도 되는 영역이 있다. 이 입력들이 text/image encoder를 지나 condition이 되고, latent noise와 함께 denoiser에 들어간다.
            Solver는 denoiser를 여러 번 호출하고, VAE가 마지막 latent를 pixel로 되돌린다. Upscale과 color correction이 붙으면 그것도 결과 계약에 포함된다.
          </p>
          <p>
            이 글의 목표는 모든 모델의 내부 구현을 외우는 것이 아니다. 어느 model family를 받아도 input shape, condition path,
            prediction target, solver state, decoder와 artifact boundary를 찾는 방법을 익히는 것이다.
          </p>
        </div>
        <RuntimeInheritanceExplorer initialMode="image" />
      </section>

      <section id="prompt-encoding" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Prompt encoding: 문자열과 reference가 조건이 되는 과정</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Prompt는 먼저 tokenizer가 token id로 나누고, text encoder가 각 위치를 vector로 바꾼다. 긴 지시는 무한히 들어가지 않는다.
            최대 token 길이를 넘으면 잘리거나 prompt expander가 다시 쓸 수 있다. 따라서 “똑같은 prompt”를 비교하려면 원문뿐 아니라
            실제 encoder input, truncation과 rewriting 여부를 기록해야 한다.
          </p>
          <M display>{String.raw`\begin{aligned}
            (i_1,\ldots,i_L)&=\underbrace{\operatorname{Tok}(p)}_{\text{문장을 길이 }L\text{의 token ID로 분해}}\\
            C_{\text{text}}&=\underbrace{E_{\text{text}}(i_1,\ldots,i_L)}_{\text{각 token을 조건 vector로 변환}}\in\mathbb R^{L\times D}\\
            C&=\underbrace{\operatorname{Fuse}(C_{\text{text}},C_{\text{ref}},C_{\text{mask}})}_{\text{text·reference·mask 조건을 model contract에 맞게 결합}}
          \end{aligned}`}</M>
          <FormulaNote meaning="Prompt와 reference는 문자열·이미지 상태 그대로 denoiser에 들어가지 않는다. 각 encoder가 만든 조건 표현을 model이 요구하는 방식으로 결합한다." symbols={[[String.raw`p`, '사용자가 쓴 원 prompt'], [String.raw`L`, 'truncation 뒤 token 길이'], [String.raw`D`, 'text feature 차원'], [String.raw`C`, 'denoiser가 실제로 받는 전체 condition']]} />
          <p>
            Model마다 결합 방식이 다르다. U-Net latent diffusion은 text feature를 cross-attention으로 주입하는 경우가 많고,
            MMDiT나 single-stream DiT는 text와 image token을 joint sequence로 처리할 수 있다. Krea 2처럼 VLM feature의 여러 layer를
            집계하거나 style reference를 별도로 주는 경우도 있다. 그래서 “CLIP 대신 T5를 쓴다”보다 어떤 tensor가 어느 block에 들어가는지를 본다.
          </p>
          <ul>
            <li><strong>문구 누락:</strong> Tokenizer 분해, max length, prompt rewrite와 visible-text training을 확인한다.</li>
            <li><strong>Reference 내용이 새어 나옴:</strong> Style과 content feature가 분리되는지, strength와 mask 경로를 확인한다.</li>
            <li><strong>지시 일부만 따름:</strong> 조건 간 충돌, long instruction의 위치, guidance와 training caption 분포를 확인한다.</li>
          </ul>
        </div>
      </section>

      <section id="latent-scheduler" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Latent와 noise path: 해상도가 계산량이 되는 지점</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Pixel diffusion은 큰 이미지 전체에서 매 step 계산해야 한다. Latent diffusion은 VAE encoder가 이미지를 더 작은 grid로 압축한 공간에서
            생성한다. 압축률은 공짜가 아니다. Grid가 작을수록 denoiser 계산은 줄지만 작은 글자, 얇은 선과 미세 재질을 decoder가 복원하기 어려울 수 있다.
          </p>
          <M display>{String.raw`\begin{aligned}
            x&\in\underbrace{\mathbb R^{3\times H\times W}}_{\text{납품할 pixel image}}\\
            z_0=E_{\text{VAE}}(x)&\in\underbrace{\mathbb R^{C\times H/s_h\times W/s_w}}_{\text{압축된 latent grid}}\\
            N&=\underbrace{\frac{H}{s_h}\frac{W}{s_w}}_{\text{denoiser가 처리할 spatial 위치 수}}
          \end{aligned}`}</M>
          <FormulaNote meaning="VAE는 H×W pixel을 더 작은 latent grid로 옮긴다. 공간 압축률이 커지면 계산 위치는 줄지만 decoder가 잃은 세부를 되살려야 한다." symbols={[[String.raw`x`, 'RGB pixel image'], [String.raw`z_0`, 'clean image에 대응하는 latent'], [String.raw`s_h,s_w`, '세로·가로 압축률'], [String.raw`N`, '한 denoising step의 spatial 위치 수']]} />
          <p>
            생성은 clean latent <M>{String.raw`z_0`}</M>에서 시작하지 않는다. Seed로 Gaussian noise를 만들고, model이 학습한 noise 또는 flow 경로와
            맞는 scheduler를 따라 clean 쪽으로 이동한다. DDPM 계열은 noise prediction을, rectified flow 계열은 velocity field를 예측할 수 있다.
            서로 다른 prediction target에 같은 update 식을 억지로 붙이면 sampler 이름은 같아 보여도 잘못된 runtime이 된다.
          </p>
          <M display>{String.raw`\begin{aligned}
            z_K&\sim\underbrace{\mathcal N(0,I)}_{\text{seed가 고정하는 초기 latent noise}}\\
            v_k&=\underbrace{f_\theta(z_k,\sigma_k,C)}_{\text{현재 noise level과 condition을 본 이동 방향}}\\
            z_{k-1}&=\underbrace{\operatorname{Solve}(z_k,v_k,\sigma_k,\sigma_{k-1})}_{\text{solver가 다음 noise level의 상태를 계산}}
          \end{aligned}`}</M>
          <FormulaNote meaning="Denoiser는 최종 pixel이 아니라 현재 latent에서 움직일 방향을 예측하고, solver가 noise schedule에 맞춰 다음 상태를 계산한다." symbols={[[String.raw`z_K`, '초기 noise latent'], [String.raw`f_\theta`, 'U-Net 또는 DiT denoiser'], [String.raw`\sigma_k`, 'k번째 noise level'], [String.raw`\operatorname{Solve}`, 'Euler·DPM 등 model에 맞춘 update 규칙']]} />
          <Misconception>
            Step을 늘리면 무조건 좋아지는 것이 아니다. Distilled 4-step model은 짧은 path를 학습했고, base model은 더 긴 path를 가정할 수 있다. Step 수는 model-call budget이며 training schedule과 solver error를 함께 본다.
          </Misconception>
        </div>
      </section>

      <section id="denoiser" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Denoiser: U-Net과 DiT보다 먼저 볼 것</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            U-Net은 multi-resolution feature map과 skip connection을 사용해 coarse structure와 detail을 오간다. Stable Diffusion 1.x와 SDXL의
            adapter 생태계가 이 구조 위에서 성장했다. DiT는 latent patch를 token으로 보고 transformer block에서 관계를 처리한다. MMDiT는 modality별
            parameter와 joint attention을 조합할 수 있고, single-stream 구조는 text·image token을 한 stream에서 처리할 수 있다.
          </p>
          <p>
            그러나 production debug에서 첫 질문은 architecture 이름이 아니다. Denoiser가 epsilon, velocity, clean sample 중 무엇을 예측하는지,
            timestep/noise condition을 어디에 넣는지, text와 image condition이 어느 block에서 섞이는지, patch 크기와 positional encoding이 무엇인지 본다.
            이 계약이 solver, LoRA target과 resolution generalization을 결정한다.
          </p>
          <M display>{String.raw`\begin{aligned}
            e_t&=
              \underbrace{f_\theta(z_t,t,C)}_{\text{모델 예측}}-
              \underbrace{y_t(z_0,\eta)}_{\text{학습 목표}}\\
            \mathcal L_{\text{pred}}&=\mathbb E_{z_0,\eta,t}\!\left[
              \underbrace{w(t)}_{\text{noise 구간 비중}}\,
              \underbrace{\lVert e_t\rVert_2^2}_{\text{예측 오차}}
            \right]
          \end{aligned}`}</M>
          <FormulaNote meaning="Denoiser 학습은 noisy latent에서 정답 target을 맞히는 회귀 문제다. 무엇을 target으로 정의하고 어느 noise 구간에 가중치를 주는지가 inference scheduler와 연결된다." symbols={[[String.raw`t`, '학습에서 뽑은 noise 시간'], [String.raw`w(t)`, 'noise 구간별 loss weight'], [String.raw`e_t`, '모델 예측과 target의 차이'], [String.raw`y_t`, '모델이 채택한 prediction target']]} />
          <CitationBlock source="Latent Diffusion Models" citeKey={1} href="https://arxiv.org/abs/2112.10752">
            <p>Pixel 공간 대신 autoencoder latent에서 diffusion을 수행하고 cross-attention으로 조건을 주입하는 현대 image runtime의 최소 역사 기준점이다.</p>
          </CitationBlock>
          <CitationBlock source="Krea 2 Technical Report" citeKey={2} href="https://www.krea.ai/blog/krea-2-technical-report">
            <p>2026년 공개 image foundation model에서 single-stream DiT, GQA, gated sigmoid attention, lightweight timestep modulation과 VAE 선택이 어떻게 함께 설계되는지 보여준다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="conditioning" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Guidance·reference·LoRA는 서로 다른 개입이다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Guidance는 같은 model의 조건 없는 예측과 조건 있는 예측을 조합해 현재 step의 이동 방향을 바꾼다. Reference adapter와 Control은 별도
            condition을 넣는다. LoRA는 inference input이 아니라 model weight의 함수 자체에 low-rank 변화량을 더한다. 세 방법을 모두 “prompt 강화”라고 부르면
            실패 원인과 rollback 단위를 구분할 수 없다.
          </p>
          <M display>{String.raw`\begin{aligned}
            \hat v_{\text{cfg}}&=\underbrace{v_u}_{\text{조건 없는 기본 방향}}+
              \underbrace{g\,(v_c-v_u)}_{\text{prompt 조건이 만든 차이를 }g\text{배 반영}}\\
            W'&=\underbrace{W_0}_{\text{고정된 base weight}}+
              \underbrace{\alpha BA}_{\text{LoRA가 학습한 low-rank 변화량}}
          \end{aligned}`}</M>
          <FormulaNote meaning="CFG는 한 step의 prediction을 섞고, LoRA는 denoiser 내부 weight를 바꾼다. Guidance와 adapter strength는 작동 위치가 다르므로 같은 숫자로 비교할 수 없다." symbols={[[String.raw`v_u,v_c`, 'unconditional·conditional prediction'], [String.raw`g`, 'guidance scale'], [String.raw`W_0`, 'base model weight'], [String.raw`BA`, 'LoRA가 표현하는 low-rank update']]} />
          <p>
            Guidance가 너무 크면 prompt는 세게 따르지만 자연스러운 data manifold에서 벗어나 contrast, anatomy와 text edge가 무너질 수 있다.
            LoRA strength가 너무 크면 제품 identity가 다른 장면까지 새고, 여러 LoRA가 같은 block을 바꾸면 변화량이 충돌한다. Control strength가 너무 크면
            pose·edge는 맞아도 결과가 뻣뻣해질 수 있다. 한 번에 한 축만 바꿔야 원인을 찾는다.
          </p>
        </div>
      </section>

      <section id="vae-postprocess" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">VAE와 postprocess도 모델 결과의 일부다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Denoising이 끝난 latent는 아직 납품 이미지가 아니다. 전용 VAE decoder가 pixel로 복원한다. VAE가 작은 글자를 지우거나 색을 바꾸면
            denoiser의 latent에서는 정보가 있었어도 최종 결과가 실패한다. 다른 VAE를 잘못 연결하면 scale과 channel contract가 맞지 않거나 색이 뜰 수 있다.
          </p>
          <M display>{String.raw`\begin{aligned}
            \hat x&=\underbrace{D_{\text{VAE}}(z_0)}_{\text{latent를 RGB로 복원}}\\
            \mathcal E_{\text{delivery}}&=
              \underbrace{d_{\text{text}}(\hat x,x^*)}_{\text{문구·배치 오류}}\\
              &\quad+\underbrace{d_{\text{id}}(\hat x,r)}_{\text{제품 정체성 오류}}\\
              &\quad+\underbrace{d_{\text{color}}(\hat x,c^*)}_{\text{색상 오류}}
          \end{aligned}`}</M>
          <FormulaNote meaning="최종 품질은 latent loss 하나가 아니라 decoder 뒤의 작업별 오류로 판정한다. 문구, 제품 identity와 color는 서로 다른 delivery metric이다." symbols={[[String.raw`D_{VAE}`, 'model 전용 pixel decoder'], [String.raw`x^*`, '목표 문구·layout fixture'], [String.raw`r`, '제품 reference'], [String.raw`c^*`, '목표 brand color']]} />
          <p>
            Upscale, detailer, inpaint와 color correction이 붙었다면 model comparison과 workflow comparison을 분리한다. Base output과 final output을 모두 저장하고,
            각 postprocess의 input/output hash를 manifest에 남긴다. 그래야 “모델이 더 선명했다”와 “후처리가 더 강했다”를 구분할 수 있다.
          </p>
        </div>
      </section>

      <section id="memory-budget" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">한 장 생성도 weight 크기만으로 VRAM을 예측할 수 없다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Image runtime의 peak VRAM에는 denoiser·text/reference encoder·VAE weight뿐 아니라 현재 resolution의 attention·MLP activation,
            condition tensor, solver state와 VAE decode buffer가 같은 시간에 겹친다. Quantization은 주로 weight 항을 줄이고,
            CPU offload는 상주 weight를 줄이는 대신 host RAM과 PCIe 전송 시간을 늘린다.
          </p>
          <M display>{String.raw`\underbrace{M_{\mathrm{peak,image}}}_{\text{한 장 생성의 최대 VRAM}}
          \approx
          \underbrace{M_{\mathrm{weights}}(q)}_{\text{상주 weight}}
          +\underbrace{M_{\mathrm{act}}(B,H',W',L)}_{\text{공간 activation}}
          +\underbrace{M_{\mathrm{cond}}}_{\text{text·reference 조건}}
          +\underbrace{M_{\mathrm{solver}}}_{\text{sampling state}}
          +\underbrace{M_{\mathrm{decode}}}_{\text{VAE 복원 buffer}}
          -\underbrace{M_{\mathrm{offloaded}}}_{\text{CPU로 내린 weight}}`}</M>
          <FormulaNote
            meaning="24GB에서 실행 가능한지 판단하려면 checkpoint file 크기가 아니라 생성 중 동시에 살아 있는 모든 항의 최대합을 측정한다. Resolution이 커지면 H'·W' 위치와 attention activation이 커지고, offload로 줄인 VRAM은 전송 지연과 host RAM 사용으로 되돌아온다."
            symbols={[
              [String.raw`q`, '상주 weight의 dtype 또는 quantization bit-width'],
              [String.raw`B`, '동시에 생성하는 image 수'],
              [String.raw`H',W'`, 'VAE 압축 뒤 latent 공간 해상도'],
              [String.raw`L`, 'denoiser block 수와 동시에 살아 있는 activation 범위'],
              [String.raw`M_{\mathrm{offloaded}}`, '해당 시점 GPU에 상주하지 않는 module weight'],
            ]}
          />
          <p>
            Acceptance 기록에는 exact checkpoint·VAE revision, width·height·batch, steps, dtype·quantization, attention backend,
            VAE tiling, offload, host RAM, cold/warm latency와 peak allocated·reserved VRAM을 함께 남긴다. “24GB GPU에서 됐다”는
            hardware 이름만으로는 재현 가능한 결과가 아니다.
          </p>
        </div>
      </section>

      <section id="debugging" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">실패를 소유한 stage를 찾는 순서</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <ol>
            <li><strong>입력 재현:</strong> 실제 prompt, rewrite, reference·mask preprocessing과 truncation을 고정한다.</li>
            <li><strong>조건 확인:</strong> Text/reference encoder와 condition shape, strength와 injection point를 확인한다.</li>
            <li><strong>상태 확인:</strong> Seed, latent shape, model prediction target, sigma schedule과 solver를 확인한다.</li>
            <li><strong>함수 확인:</strong> Base weight, LoRA·adapter target, precision·quantization과 kernel을 확인한다.</li>
            <li><strong>복원 확인:</strong> VAE revision, tiling, upscale와 color pipeline을 분리한다.</li>
          </ol>
          <p>
            한국어 한 글자가 틀렸다면 prompt만 열 번 고치지 않는다. Token이 살아 있는지, typography prior가 있는지, latent resolution이 충분한지,
            VAE가 획을 보존하는지를 stage별 fixture로 본다. 제품 형태가 흔들리면 reference feature, mask와 denoiser prior를 보고, VRAM이 터지면
            latent positions, attention activation, dtype와 offload를 본다.
          </p>
        </div>
        <CapabilityCheck items={[
          'Prompt 문자열에서 final pixel까지 각 stage의 input·output을 추적할 수 있다.',
          'Prediction target과 solver schedule이 서로 맞아야 하는 이유를 설명할 수 있다.',
          'Guidance, Control/reference와 LoRA가 개입하는 위치를 구분할 수 있다.',
          'Text·identity·color 실패를 denoiser와 VAE/postprocess 사이에서 좁힐 수 있다.',
        ]} />
      </section>

      <section id="takeaway" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">다음 글로 넘길 계약</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Image runtime의 최소 뼈대는 condition, latent, denoiser, solver와 decoder다. 새 모델이 나와도 이 다섯 질문을 먼저 채운다.
            Video branch는 이 뼈대에 시간축 latent, motion state, audio condition과 decode·memory 계약을 추가한다. Image만 필요하다면 바로 workflow audit로 가되,
            exact model·VAE revision, condition preprocessing, latent shape, prediction target, solver·schedule, dtype·offload와 postprocess 목록을 handoff한다.
          </p>
        </div>
        <LearningHandoff
          description="Image runtime의 산출물은 condition·latent·denoiser·solver·decoder와 peak-memory manifest다. 시간 상태가 필요하면 Video branch를 비교하고, 그렇지 않으면 같은 run contract를 workflow parameter audit로 넘긴다."
          items={[
            { label: '막히면', slug: 'open-image-video-models', title: '오픈 이미지 · 비디오 모델 지도', reason: '현재 목표가 image, video, finetuning, production 중 어느 branch인지 먼저 고정한다.' },
            { label: '이어 읽기', slug: 'video-model-runtime', title: 'Video Model Runtime', reason: '공간 latent에 시간축·motion·identity·audio alignment가 추가될 때 달라지는 책임을 비교한다.' },
            { label: '적용하기', slug: 'open-model-workflow-parameters', title: 'Workflow Parameter Audit', reason: 'Steps·guidance·resolution·seed를 model revision과 memory budget에 묶어 한 축씩 측정한다.' },
          ]}
        />
        <SourceNotes sources={[
          { label: 'Latent Diffusion Models', href: 'https://arxiv.org/abs/2112.10752', note: '현대 latent diffusion runtime의 최소 역사 기준점.' },
          { label: 'Krea 2 Technical Report', href: 'https://www.krea.ai/blog/krea-2-technical-report', note: '현재 DiT·VAE·condition architecture 사례.' },
          { label: 'FLUX.2 documentation', href: 'https://docs.bfl.ai/flux_2/flux2_overview', note: 'Distilled/base, API/open weight와 fine-tuning boundary 사례.' },
        ]} />
      </section>
    </div>
  );
}

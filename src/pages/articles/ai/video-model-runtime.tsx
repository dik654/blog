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

export default function VideoModelRuntimeArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Video는 image runtime에 시간 상태를 추가한다</h2>
        <BeginnerOpening
          title="영상은 좋은 그림 여러 장이 아니라, 같은 세계가 시간에 따라 이어지는 기록입니다."
          description={<>한 장의 그림에서는 컵 모양이 맞으면 충분할 수 있다. 영상에서는 다음 장면에서도 같은 컵이어야 하고, 카메라와 빛의 움직임이 앞 장면에서 자연스럽게 이어져야 한다. 소리가 있다면 화면 속 사건과 들리는 시각도 맞아야 한다.</>}
          familiarScene={<>종이마다 컵을 따로 그려 빠르게 넘긴다고 해 보자. 매 장의 그림이 예뻐도 손잡이가 왼쪽과 오른쪽을 오가거나 로고가 바뀌면 컵이 떨려 보인다. 영상 모델은 한 장의 모양뿐 아니라 <strong className="text-foreground">앞 장면에서 무엇이 남아야 하는지</strong>도 함께 기억해야 한다.</>}
          steps={[
            { label: '한 장을 만드는 순서를 물려받는다', detail: '글과 참고 이미지를 읽고, 압축된 작업 공간에서 고친 뒤, pixel로 펼치는 기본 과정은 이미지 생성과 같다.' },
            { label: '시간 방향의 기억을 더한다', detail: '대상 모양, 움직임, 카메라와 배경이 앞뒤 장면 사이에서 이어지게 만든다.' },
            { label: '시간에만 보이는 오류를 검사한다', detail: '깜빡임, 정체성 변화, 배경 출렁임과 소리 밀림은 정지 화면 검사만으로 찾을 수 없다.' },
          ]}
        />
        <QuestionLead
          label="이제 확인할 질문"
          question="이미지 모델이 한 장을 잘 만들면 frame을 여러 장 생성해 영상으로 붙이면 되지 않을까?"
          answer="안 된다. 각 장면이 좋아도 같은 제품의 모양과 위치가 매번 바뀌면 영상은 흔들려 보인다. 그래서 영상 모델은 한 장을 만드는 기본 단계에 시간 방향의 압축 상태와 기억을 더해 움직임, 카메라, 대상의 정체성, 때로는 소리의 시점까지 함께 맞춘다."
        />
        <ConceptPrimer items={[
          { term: 'Temporal latent', meaning: '공간뿐 아니라 frame 방향도 압축한 video state다.', why: 'Frames가 늘 때 token·activation·decode 비용이 왜 커지는지 계산한다.' },
          { term: 'Condition mode', meaning: 'T2V, I2V, V2V, audio처럼 생성 과정에 고정하는 관측 종류다.', why: '같은 family 안의 task checkpoint를 잘못 연결하지 않는다.' },
          { term: 'Motion state', meaning: 'Object 이동, camera 경로와 시간 변화가 latent 안에서 일관되게 표현된 상태다.', why: '좋은 frame과 좋은 video를 분리한다.' },
          { term: 'Temporal defect', meaning: 'Flicker, identity drift, background swimming과 audio desync처럼 시간에만 보이는 오류다.', why: 'Image metric 하나로 video 품질을 대체하지 않는다.' },
        ]} />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            앞 글의 한국어 제품 패키지를 5초 영상으로 만든다고 하자. 첫 image의 문구와 제품 형태를 유지하면서 camera가 천천히 회전하고,
            재질의 반사가 움직이며, audio가 있다면 event와 맞아야 한다. 한 frame의 exact text, 모든 frame의 identity, motion trajectory와 sync가
            서로 다른 검증 축이 된다.
          </p>
          <p>
            따라서 Video runtime은 별도의 세계가 아니라 Image runtime의 상속과 확장으로 읽는다. 아래 Viz에서 같은 다섯 stage를 전환하면
            latent shape, denoiser 책임과 failure owner가 시간축에서 어떻게 달라지는지 확인할 수 있다.
          </p>
        </div>
        <RuntimeInheritanceExplorer initialMode="video" />
      </section>

      <section id="latent-video" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Video latent: 시간과 공간을 함께 압축한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            입력 video는 <M>{String.raw`T`}</M>개의 RGB frame이다. Video VAE는 공간을 <M>{String.raw`s_h,s_w`}</M>배,
            시간을 <M>{String.raw`s_t`}</M>배 압축해 더 작은 tensor를 만든다. Wan2.2의 공식 repository는 TI2V-5B에 사용한 VAE가
            시간 4배, 공간 16×16배 압축한다고 설명한다. 이 수치는 모든 Wan variant나 다른 model에 그대로 적용하지 않는다.
          </p>
          <M display>{String.raw`\begin{aligned}
            X&\in\underbrace{\mathbb R^{T\times3\times H\times W}}_{\text{RGB video}}\\
            Z=E_{\text{video}}(X)&\in\underbrace{\mathbb R^{C\times T'\times H'\times W'}}_{\text{시공간 latent}}\\
            T'&=\underbrace{\left\lceil\frac{T}{s_t}\right\rceil}_{\text{시간 압축}}\\
            H'&=\underbrace{\left\lceil\frac{H}{s_h}\right\rceil}_{\text{세로 압축}},\qquad
            W'=\underbrace{\left\lceil\frac{W}{s_w}\right\rceil}_{\text{가로 압축}}
          \end{aligned}`}</M>
          <FormulaNote meaning="Video VAE는 frame 수와 공간 해상도를 동시에 줄여 denoiser가 처리할 시공간 state를 만든다. 압축률과 frame padding 규칙은 model checkpoint와 맞아야 한다." symbols={[[String.raw`T,H,W`, '출력 frame 수와 pixel 크기'], [String.raw`s_t,s_h,s_w`, '시간·공간 압축률'], [String.raw`T',H',W'`, 'denoiser가 실제로 보는 latent 크기'], [String.raw`C`, 'latent feature channel']]} />
          <p>
            Latent를 patch token으로 펼치면 position 수는 시간과 공간의 곱이다. Full attention이라면 모든 position 쌍을 비교하므로 비용이 제곱으로 커진다.
            실제 model은 patching, factorized·window attention, sparse attention과 compression을 사용하지만, frames·resolution을 같이 올릴 때 비용이 급격히
            증가하는 출발점은 이 곱이다.
          </p>
          <M display>{String.raw`\begin{aligned}
            N_{\text{video}}&=\underbrace{\frac{T'H'W'}{p_t p_h p_w}}_{\text{patch 뒤 시공간 token 수}}\\
            \operatorname{Mem}_{\text{full-attn}}&\propto
              \underbrace{B\,L\,h\,N_{\text{video}}^2}_{\text{batch·layer·head마다 생기는 attention state}}
          \end{aligned}`}</M>
          <FormulaNote meaning="Frame·해상도·batch를 올리면 시공간 token 수가 늘고, full attention state는 그 제곱에 비례할 수 있다. 그래서 video OOM은 parameter 수만으로 설명되지 않는다." symbols={[[String.raw`p_t,p_h,p_w`, '시간·공간 patch 크기'], [String.raw`N_{video}`, '한 clip의 token 수'], [String.raw`B,L,h`, 'batch·layer·attention head 수'], [String.raw`N_{video}^2`, '모든 token 쌍을 저장하는 비용']]} />
          <Misconception>
            FPS를 두 배로 올린다고 motion 품질이 자동으로 두 배 좋아지지 않는다. 같은 길이라면 frame 수와 token budget이 늘고, animation에서는 hold·timing 의도가 오히려 깨질 수 있다.
          </Misconception>
        </div>
      </section>

      <section id="conditioning" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">T2V·I2V·V2V·Audio는 서로 다른 관측 계약이다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Text-to-video는 장면과 motion을 text에서 추론한다. Image-to-video는 첫 image 또는 keyframe을 condition으로 고정해 appearance를 보존해야 한다.
            Video-to-video는 source motion·geometry와 새 style 사이의 균형을 잡는다. Audio-video model은 waveform이나 audio token이 사건의 timing과 맞아야 한다.
            UI에서 모두 “conditioning”이라고 보여도 input mask와 loss가 다르다.
          </p>
          <M display>{String.raw`\begin{aligned}
            C_{\text{video}}=\operatorname{Fuse}\!\big(&
              \underbrace{C_{\text{text}}}_{\text{장면·행동}},
              \underbrace{M_I\odot E_I(I)}_{\text{고정 image·mask}},\\
              &\underbrace{C_{\text{audio}}}_{\text{audio 시점}},
              \underbrace{C_{\text{camera}}}_{\text{camera 경로}}\big)
          \end{aligned}`}</M>
          <FormulaNote meaning="Video condition은 text 하나가 아니라 image, mask, audio와 camera signal을 model contract에 맞게 결합할 수 있다. 없는 condition은 임의의 zero인지 learned null인지도 확인해야 한다." symbols={[[String.raw`C_{text}`, 'prompt embedding'], [String.raw`E_I(I)`, 'source image의 latent·feature'], [String.raw`M_I`, '보존할 시간·공간 위치를 가리키는 mask'], [String.raw`C_{audio},C_{camera}`, 'audio와 camera 조건']]} />
          <p>
            I2V에서 첫 frame만 정확하고 이후 identity가 무너지면 text prompt 문제가 아닐 수 있다. Image condition이 어느 frame까지 주입되는지,
            reference token이 temporal attention에서 보존되는지, denoising strength가 source를 얼마나 지우는지 확인한다. Audio-video에서는 sample rate, duration,
            token alignment와 padding이 어긋나도 입 모양과 event가 밀릴 수 있다.
          </p>
          <p>
            Joint audio-video model은 발화와 입 모양을 같은 generation state에서 맞추려 하므로 audio token alignment와 공동 decode를 본다. 반대로 영상을 먼저 만들고 TTS를
            나중에 붙이는 pipeline은 waveform timestamp를 맞출 수는 있어도 입 모양이 해당 phoneme을 만들었다는 보장은 없다. 두 방식은 같은 “audio 지원”으로 묶지 않는다.
          </p>
          <CitationBlock source="LTX-2.3 open-source documentation" citeKey={1} href="https://docs.ltx.io/open-source-model/getting-started/overview">
            <p>Text, image, video, audio와 depth input, synchronized audio-video generation 및 LoRA customization을 공식 open-source 범위로 설명한다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="denoising" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Denoising: motion과 detail이 언제 복원되는가</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Video denoiser도 noise level을 따라 latent를 이동시킨다. High-noise 구간은 전체 composition과 큰 motion을 잡고, low-noise 구간은 texture와 detail을
            다듬는 경향이 있다. Wan2.2 A14B는 이 noise regime을 high-noise expert와 low-noise expert로 나누는 MoE를 사용한다. 이는 token마다 여러 expert를
            고르는 일반 LLM MoE 설명과 같다고 단정하면 안 된다. 공식 구현의 timestep boundary와 routing을 확인해야 한다.
          </p>
          <M display>{String.raw`\begin{aligned}
            g(t)&=\underbrace{\mathbf 1[t\ge t_{\text{switch}}]}_{\text{noise 구간 판정}}\\
            v_\theta(Z_t,t,C)&=
              \underbrace{g(t)f_{\text{high}}(Z_t,t,C)}_{\text{큰 motion·구도}}\\
              &\quad+\underbrace{(1-g(t))f_{\text{low}}(Z_t,t,C)}_{\text{세부 질감}}
          \end{aligned}`}</M>
          <FormulaNote meaning="Wan2.2 A14B의 핵심 직관은 denoising 시간 구간마다 다른 expert가 역할을 맡는 것이다. 전환점과 정확한 routing은 checkpoint·code의 설정으로 확인한다." symbols={[[String.raw`t`, '현재 denoising time 또는 noise level'], [String.raw`t_{switch}`, 'expert가 바뀌는 경계'], [String.raw`f_{high}`, 'high-noise expert'], [String.raw`f_{low}`, 'low-noise expert']]} />
          <p>
            LTX-2.3은 DiT 기반 audio-video foundation model로 설명되며 video와 audio를 한 pass에서 생성한다. 이 경우 loss와 guidance도 영상만의 품질뿐 아니라
            modality coherence를 포함해야 한다. Audio를 나중에 붙이는 pipeline과 joint model은 failure owner가 다르다.
          </p>
          <M display>{String.raw`\begin{aligned}
            \mathcal L_{\text{joint}}&=
              \underbrace{\lambda_v\mathcal L_{\text{video}}}_{\text{영상 복원}}\\
              &\quad+\underbrace{\lambda_a\mathcal L_{\text{audio}}}_{\text{오디오 복원}}\\
              &\quad+\underbrace{\lambda_s\mathcal L_{\text{sync}}}_{\text{시간 동기}}
          \end{aligned}`}</M>
          <FormulaNote meaning="Joint audio-video model은 각 modality의 품질과 둘 사이 timing을 동시에 다뤄야 한다. 식은 개념적 분해이며 LTX의 비공개 정확한 training loss라고 주장하지 않는다." symbols={[[String.raw`\mathcal L_{video}`, '영상 복원 목표'], [String.raw`\mathcal L_{audio}`, '오디오 복원 목표'], [String.raw`\mathcal L_{sync}`, 'event·lip timing 정합 목표'], [String.raw`\lambda_v,\lambda_a,\lambda_s`, '목표 사이 상대 비중']]} />
          <CitationBlock source="Wan2.2 official repository" citeKey={2} href="https://github.com/Wan-Video/Wan2.2">
            <p>A14B의 denoising timestep별 expert 분리와 TI2V-5B의 dense architecture·VAE를 구분하는 1차 자료다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="postprocess" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Decode 뒤에도 시간 일관성은 깨질 수 있다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            마지막 video latent를 VAE가 frame으로 복원할 때 tile seam, color pulse와 작은 text 흔들림이 생길 수 있다. Frame interpolation은 FPS를 늘리지만
            새로운 motion을 생성하며, face restoration이나 per-frame upscaler는 각 frame을 독립 처리해 flicker를 키울 수 있다. Audio codec과 mux 단계는 sync를 밀 수 있다.
          </p>
          <p>
            그래서 base latent decode, temporal upscale, frame interpolation, audio decode와 final encode를 각각 artifact로 저장한다. 어느 단계에서 identity와 timing이
            처음 깨졌는지 비교해야 한다. 최종 MP4 한 개만 남기면 model failure와 delivery pipeline failure를 분리할 수 없다.
          </p>
          <M display>{String.raw`\begin{aligned}
            \hat X&=\underbrace{D_{\text{video}}(Z_0)}_{\text{latent를 frame sequence로 복원}}\\
            u_t&=\operatorname{warp}(\phi(\hat x_{t-1}),F_t) \quad \text{motion 보정}\\
            e_t&=d(\phi(\hat x_t),u_t) \quad \text{남은 변화}\\
            \mathcal E_{\text{time}}&=\frac1{T-1}\sum_{t=2}^{T}e_t
          \end{aligned}`}</M>
          <FormulaNote meaning="단순 pixel 차이는 정상 motion까지 오류로 센다. Motion으로 이전 feature를 현재 frame에 맞춘 뒤 남는 차이를 보면 flicker와 identity drift를 더 잘 분리할 수 있다." symbols={[[String.raw`\hat x_t`, 'decode된 t번째 frame'], [String.raw`\phi`, 'identity·appearance를 보는 feature extractor'], [String.raw`F_t`, '이전 frame에서 현재 frame으로의 motion field'], [String.raw`d`, '보정 뒤 feature 차이']]} />
        </div>
      </section>

      <section id="memory" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">24GB에서 된다는 말을 검증하는 법</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            VRAM은 weight 크기만이 아니다. Denoiser weight, text/audio encoder와 VAE weight, attention·MLP activation, solver state, condition tensor와 decode buffer가
            겹친다. CPU offload는 peak VRAM을 낮추지만 PCIe transfer와 host RAM을 사용해 latency가 늘어난다. Quantization은 weight memory를 줄여도 activation과
            일부 module이 높은 precision으로 남을 수 있다.
          </p>
          <M display>{String.raw`\begin{aligned}
            M_{\text{peak}}&\approx
              \underbrace{M_{\text{weights}}(q)}_{\text{상주 weight}}\\
              &\quad+\underbrace{M_{\text{act}}(B,T',H',W',L)}_{\text{시공간 activation}}\\
              &\quad+\underbrace{M_{\text{cond}}+M_{\text{solver}}+M_{\text{decode}}}_{\text{조건·solver·decode}}\\
              &\quad-\underbrace{M_{\text{offloaded}}}_{\text{CPU로 내린 module}}\\
            t_{\text{wall}}&\approx
              \underbrace{K\,t_{\text{denoise}}}_{\text{model call }K\text{번}}\\
              &\quad+\underbrace{t_{\text{transfer}}}_{\text{offload 전송}}
              +\underbrace{t_{\text{decode}}}_{\text{media 복원}}
          \end{aligned}`}</M>
          <FormulaNote meaning="Peak VRAM과 wall time은 weight 하나로 결정되지 않는다. Frames·resolution이 activation을 키우고, offload로 줄인 VRAM은 transfer latency로 되돌아온다." symbols={[[String.raw`q`, 'weight bit-width와 dtype'], [String.raw`M_{act}`, '시공간 shape에 의존하는 activation'], [String.raw`K`, 'denoiser 호출 횟수'], [String.raw`t_{transfer}`, 'CPU·GPU 사이 module·tensor 이동 시간']]} />
          <p>
            “4090에서 가능”을 기록하려면 exact checkpoint, frame·resolution·FPS, steps, dtype·quantization, attention backend, VAE tiling, offload, host RAM,
            cold/warm latency와 peak allocated/reserved memory를 함께 남긴다. 설정이 다르면 같은 hardware 이름도 비교 근거가 아니다.
          </p>
          <p>
            24GB fallback은 품질 손실을 추적할 수 있는 순서로 좁힌다. 먼저 duration·frame·resolution을 낮춰 시공간 token을 줄이고, 다음으로 attention backend와 VAE tiling을
            바꾼다. 그래도 넘으면 weight quantization과 CPU offload를 적용해 memory와 latency가 어디서 교환됐는지 기록한다. 여러 축을 한 번에 바꾸면 어느 개입이 identity·motion을
            망가뜨렸는지 알 수 없다.
          </p>
        </div>
      </section>

      <section id="debugging" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">좋은 frame이 아니라 시간 실패를 좁힌다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <ul>
            <li><strong>첫 frame은 맞지만 이후 제품이 변함:</strong> I2V mask·conditioning persistence, denoise strength와 temporal attention을 본다.</li>
            <li><strong>배경이 물결치거나 flicker:</strong> VAE decode, temporal module, per-frame postprocess와 compression codec을 분리한다.</li>
            <li><strong>Motion이 거의 없음:</strong> Prompt motion verb, training prior, guidance와 high-noise trajectory를 본다.</li>
            <li><strong>Camera와 object가 같이 흔들림:</strong> Camera condition, reference frame geometry와 motion decomposition을 본다.</li>
            <li><strong>Audio가 밀림:</strong> Sample rate·duration padding, joint condition, decoder와 mux timestamp를 순서대로 본다.</li>
            <li><strong>OOM:</strong> Frames와 resolution을 먼저 줄이고 attention activation, VAE buffer, dtype와 offload trace를 측정한다.</li>
          </ul>
          <p>
            검증 clip은 대표 성공작 하나가 아니라 고정된 짧은 fixture 묶음이어야 한다. 정지 제품, 회전 제품, camera pan, 빠른 hand motion,
            작은 한국어 문구, speaking face와 ambient sound를 분리하면 어느 능력이 부족한지 찾을 수 있다.
          </p>
          <p>
            다음 Workflow 글로 넘길 때는 exact model·VAE revision, T2V·I2V·V2V condition mode, frame·FPS·latent shape, prediction target, solver·schedule,
            audio preprocessing, dtype·offload, decode·interpolation·mux 목록을 한 run manifest에 담는다. 이 필드가 Image와 Video branch가 다시 합류하는 공통 계약이다.
          </p>
        </div>
        <CapabilityCheck items={[
          'Image runtime에서 상속한 stage와 Video가 추가한 시간 계약을 구분할 수 있다.',
          'Frame·resolution·patch가 token과 attention memory를 키우는 과정을 계산할 수 있다.',
          'Wan2.2 A14B MoE와 dense TI2V-5B를 같은 구조로 설명하지 않는다.',
          '좋은 한 frame과 motion·identity·audio sync가 좋은 video를 별도 지표로 검증할 수 있다.',
        ]} />
        <LearningHandoff
          description="Video runtime의 산출물은 image 공통 stage에 temporal latent·condition mode·motion/identity metric·peak-memory trace를 더한 run manifest다. 이 manifest를 고정한 뒤에만 parameter sweep과 workflow 비교를 시작한다."
          items={[
            { label: '막히면', slug: 'image-model-runtime', title: 'Image Model Runtime', reason: 'Condition·latent·denoiser·solver·VAE라는 공통 생성 뼈대부터 다시 추적한다.' },
            { label: '이어 읽기', slug: 'open-model-workflow-parameters', title: 'Workflow Parameter Audit', reason: 'Frame·FPS·resolution·steps·guidance가 temporal quality와 VRAM에 만드는 response curve를 설계한다.' },
            { label: '적용하기', slug: 'open-model-community-workflows', title: 'Community Workflow 검증', reason: 'Exact checkpoint와 custom node, preprocess·decode·mux까지 재현 가능한 manifest로 고정한다.' },
          ]}
        />
        <SourceNotes sources={[
          { label: 'Wan2.2 official repository', href: 'https://github.com/Wan-Video/Wan2.2', note: 'MoE A14B, dense TI2V-5B, VAE compression, task별 실행 경로와 Apache 2.0 model license.' },
          { label: 'LTX-2.3 open-source documentation', href: 'https://docs.ltx.io/open-source-model/getting-started/overview', note: 'Joint audio-video, multimodal input와 local execution 범위.' },
          { label: 'LTX-2 Community License', href: 'https://github.com/Lightricks/LTX-2/blob/main/LICENSE', note: 'Model weight의 commercial entity 조건은 code repository license와 별도 확인.' },
          { label: 'LTX-Video paper', href: 'https://arxiv.org/abs/2501.00103', note: 'Video latent diffusion과 효율적 generation architecture의 연구 근거.' },
        ]} />
      </section>
    </div>
  );
}

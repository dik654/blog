import type { ReactNode } from 'react';
import {
  CapabilityCheck,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
  StopRule,
} from '@/components/learning/ArticleLearning';
import FormulaNote from '@/components/ui/formula-note';
import M from '@/components/ui/math';
import WanFamilyDecisionLab from './WanFamilyDecisionLab';

const sourceRevision = '42bf4cfaa384bc21833865abc2f9e6c0e67233dc';
const sourceRoot = `https://github.com/Wan-Video/Wan2.2/blob/${sourceRevision}`;

function Milestone({
  number,
  eyebrow,
  title,
  children,
}: {
  number: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mb-16 scroll-mt-20">
      <div className="not-prose mb-5 grid gap-2 border-b border-border pb-4 sm:grid-cols-[3.5rem_minmax(0,1fr)] sm:gap-4">
        <span className="font-mono text-3xl font-black text-muted-foreground/35">{number}</span>
        <div>
          <p className="text-[10px] font-bold uppercase text-muted-foreground">{eyebrow}</p>
          <h2 className="mt-1 text-xl font-bold leading-tight sm:text-2xl">{title}</h2>
        </div>
      </div>
      {children}
    </section>
  );
}

export default function Wan22Article() {
  return (
    <>
      <QuestionLead
        question="Wan2.2가 24GB GPU에서 돌아간다는 말과 step마다 14B를 활성화한다는 말은 동시에 참일까?"
        answer={<>서로 다른 checkpoint family라면 가능하다. <strong>A14B</strong>는 두 noise-regime expert 중 하나를 step마다 활성화하고, <strong>TI2V-5B</strong>는 높은 VAE·patch 압축을 쓰는 별도 dense 경로다. Task와 family를 먼저 고르지 않으면 parameter, VRAM과 속도 숫자는 서로 충돌해 보인다.</>}
      />
      <ConceptPrimer
        items={[
          { term: 'condition mode', meaning: 'Text, image 또는 두 입력이 생성 경로를 제약하는 방식.', why: 'T2V·I2V·TI2V checkpoint를 task에 맞게 고른다.' },
          { term: 'noise regime', meaning: '현재 latent가 거의 noise인지, 세부가 드러난 상태인지 나타내는 구간.', why: 'A14B가 어느 expert를 활성화하는지 설명한다.' },
          { term: 'active parameters', meaning: '한 step의 forward pass에서 실제 계산에 참여하는 weight.', why: '전체 capacity와 매 step 계산량을 분리한다.' },
          { term: 'temporal VAE', meaning: 'Frame과 공간축을 함께 더 작은 latent grid로 압축하는 encoder.', why: 'Video token 수와 memory가 어디서 줄어드는지 계산한다.' },
          { term: 'offload contract', meaning: 'Text encoder나 model state를 CPU에 두는 구체적 실행 옵션.', why: '“24GB에서 실행”을 checkpoint 고유 속성으로 오해하지 않는다.' },
        ]}
      />
      <Misconception>
        이 글은 공식 repository revision <code>{sourceRevision.slice(0, 12)}</code>을 기준으로 한다.
        A14B의 MoE routing, TI2V-5B의 dense 압축과 각 hardware 조건을 서로 옮겨 쓰지 않는다.
      </Misconception>

      <Milestone number="01" eyebrow="Task before size" title="Text, image와 접근 가능한 hardware에서 checkpoint를 고른다">
        <div id="family-decision" className="prose prose-neutral max-w-none scroll-mt-20 dark:prose-invert">
          <p>
            Wan2.2는 하나의 checkpoint가 아니다. Text만으로 시작하면 T2V-A14B, 첫 image를 기준으로
            움직임을 만들면 I2V-A14B가 전용 MoE 경로다. TI2V-5B는 text만 또는 image+text를 한
            dense model에서 처리하는 통합 경로다.
          </p>
          <p>
            A14B는 전체 capacity와 한 step 계산을 분리한다. TI2V-5B는 model 크기와 latent grid를
            함께 줄인다. 둘 다 효율화지만 줄이는 대상이 다르다. A14B는 <em>어떤 weight를 이번
            step에 쓸지</em> 고르고, TI2V는 <em>얼마나 작은 grid를 dense model에 넣을지</em> 정한다.
          </p>
        </div>
        <WanFamilyDecisionLab />
      </Milestone>

      <Milestone number="02" eyebrow="A14B routing" title="노이즈가 많은 구간과 적은 구간이 서로 다른 expert를 쓴다">
        <div id="noise-regime-moe" className="prose prose-neutral max-w-none scroll-mt-20 dark:prose-invert">
          <p>
            Denoising 초반의 latent는 거의 noise라 작은 질감보다 화면 배치, 피사체 관계와 큰 움직임을
            먼저 정해야 한다. 후반에는 큰 구조가 이미 잡혀 있으므로 표면, 경계, 작은 움직임과 flicker를
            정리한다. Wan2.2 A14B는 이 다른 역할을 두 expert로 나눈다.
          </p>
        </div>
        <div data-formula-pair className="not-prose my-7 rounded-md border border-border px-3 py-4 sm:px-5">
          <M display minScale={0.72}>{String.raw`\begin{aligned}
\mathrm{SNR}(t)&=\underbrace{\frac{\alpha_t^2}{\sigma_t^2}}_{\text{clean 신호와 noise의 상대 크기}}\\
e(t)&=\begin{cases}
\underbrace{e_{\mathrm{high}}}_{\text{구도와 큰 움직임을 만드는 expert}},&t\ge t_{\mathrm{moe}}\\
\underbrace{e_{\mathrm{low}}}_{\text{질감과 작은 움직임을 다듬는 expert}},&t<t_{\mathrm{moe}}
\end{cases}
\end{aligned}`}</M>
          <FormulaNote
            meaning="이 식은 현재 noise regime에 따라 A14B expert 하나만 선택하는 이유를 보여 준다. Scheduler마다 timestep 숫자의 방향은 다를 수 있으므로 실제 manifest에는 sigma 또는 SNR과 전환 경계를 함께 남긴다."
            symbols={[
              [String.raw`\alpha_t^2`, '현재 latent에 남은 clean signal power'],
              [String.raw`\sigma_t^2`, '현재 latent에 섞인 noise power'],
              [String.raw`t_{\mathrm{moe}}`, '두 expert의 공식 전환 경계'],
              [String.raw`e_{\mathrm{high}},e_{\mathrm{low}}`, '동시에가 아니라 구간별로 활성화되는 두 expert'],
            ]}
          />
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            공식 설명에서 두 expert는 각각 약 14B이고 전체 parameter는 약 27B지만 step당 active
            parameter는 약 14B다. 이는 LLM의 token별 top-k router와 같은 일반 그림으로 외우기보다
            diffusion timestep의 noise regime switch로 읽는 편이 정확하다.
          </p>
          <p>
            여기서부터는 공식 사실이 아니라 fine-tuning 때 검증할 <strong>가설</strong>이다. Style
            detail 변화가 low-noise expert에 더 집중되는지, motion data가 high-noise 경로를 바꾸는지는
            paired ablation으로 측정해야 한다. 공식 repository는 universal LoRA recipe나 expert별
            학습 효과를 보장하지 않는다.
          </p>
        </div>
      </Milestone>

      <Milestone number="03" eyebrow="TI2V compression" title="5B라는 숫자보다 transformer가 보는 시공간 grid를 계산한다">
        <div id="ti2v-compression" className="prose prose-neutral max-w-none scroll-mt-20 dark:prose-invert">
          <p>
            TI2V-5B의 접근성은 작은 dense model만으로 설명되지 않는다. 공식 config와 README는 VAE가
            시간 stride 4와 공간 <code>16×16</code> 압축을 쓰고, patchification이 공간축을 다시
            <code>1×2×2</code>로 묶는 경로를 보여 준다. Transformer가 보는 총 grid 압축은
            공간축 기준 <code>32×32</code>가 된다. 시간축은 첫 frame을 보존하므로 단순히 T/4가 아니다.
          </p>
        </div>
        <div data-formula-pair className="not-prose my-7 rounded-md border border-border px-3 py-4 sm:px-5">
          <M display minScale={0.7}>{String.raw`\begin{aligned}
x&\in\mathbb R^{3\times T\times H\times W}\\
T_z&=\underbrace{\left\lfloor\frac{T-1}{4}\right\rfloor+1}_{\text{첫 frame을 보존한 latent frame 수}}\\
z&\in\underbrace{\mathbb R^{C\times T_z\times H/16\times W/16}}_{\text{VAE가 만든 압축 latent}}\\
N_{\mathrm{token}}&\propto
\underbrace{T_z\frac{H}{32}\frac{W}{32}}_{\text{patchify 뒤 DiT가 처리할 시공간 위치}}
\end{aligned}`}</M>
          <FormulaNote
            meaning="Pinned text2video.py의 exact temporal shape를 반영한다. Frame 수는 4n+1 계약을 따르며 121 frames이면 Tz=floor(120/4)+1=31이다. 이 식은 TI2V-5B에서 frame 수와 해상도가 checkpoint 크기와 별개로 token 수와 activation memory를 늘리는 이유를 보여 준다."
            symbols={[
              [String.raw`T,H,W`, '입력 frame 수, 높이와 너비'],
              [String.raw`T_z`, '첫 frame을 보존한 VAE latent frame 수'],
              [String.raw`C`, 'VAE latent feature channel 수'],
              [String.raw`z`, 'Dense 5B DiT가 받기 전 압축 latent grid'],
              [String.raw`N_{\mathrm{token}}`, 'Patchification 뒤 attention이 처리할 대략적인 위치 수'],
            ]}
          />
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            압축은 공짜가 아닐 수 있다. 작은 글자, 손가락, 빠른 움직임과 작은 물체가 실제로 얼마나
            손실되는지는 공식 코드만으로 결론 낼 수 없고 원본-재구성 VAE test와 end-to-end paired
            sample로 측정해야 한다. “720P 24fps가 가능하다”는 출력 형식과 “모든 작은 시간·공간
            detail이 보존된다”는 별도 품질 주장을 분리한다.
          </p>
          <p>
            TI2V라는 이름도 task contract다. Text-only와 image+text를 모두 받을 수 있지만, image가
            들어오면 첫 frame 또는 visual anchor 보존이라는 별도 평가가 생긴다. Prompt adherence만
            높고 source identity가 흔들리면 I2V 목표에는 실패다.
          </p>
        </div>
      </Milestone>

      <Milestone number="04" eyebrow="Runtime evidence" title="80GB와 24GB는 서로 다른 command와 component 배치의 수치다">
        <div id="runtime-evidence" className="prose prose-neutral max-w-none scroll-mt-20 dark:prose-invert">
          <p>
            공식 single-GPU 안내에서 A14B는 최소 80GB VRAM을 요구한다. TI2V-5B는 model dtype 변환,
            offload와 T5 CPU 실행을 포함한 path에서 24GB 4090급을 대상으로 한다. “Wan2.2는
            24GB에서 된다”라고 family 이름만 남기면 A14B 사용자는 OOM 원인을 찾을 수 없다.
          </p>
          <p>
            Peak memory는 weight만이 아니다. Video·audio latent와 attention activation, text encoder,
            VAE decode, temporary buffer, allocator fragmentation이 함께 만든다. CPU offload는 VRAM을
            줄이지만 PCIe transfer와 system RAM 대기를 추가한다. 따라서 load success와 interactive
            latency도 별도 지표다.
          </p>
        </div>
        <div data-formula-pair className="not-prose my-7 rounded-md border border-border px-3 py-4 sm:px-5">
          <M display minScale={0.78} className="sm:hidden">{String.raw`\begin{aligned}
M_r(t)&=M_D+M_T+M_V\\
M_w(t)&=M_L+M_A+M_X+M_Q\\
M_{\mathrm{peak}}&=\max_t\left[M_r(t)+M_w(t)\right]
\end{aligned}`}</M>
          <M display minScale={0.78} className="hidden sm:block">{String.raw`\begin{aligned}
M(t)&=\underbrace{M_{\mathrm{DiT}}(t)+M_{\mathrm{text}}(t)+M_{\mathrm{VAE}}(t)}_{\text{그 시점에 GPU에 상주한 component}}\\
&\quad+\underbrace{M_{\mathrm{latent}}(t)+M_{\mathrm{attn}}(t)+M_{\mathrm{temp}}(t)+M_{\mathrm{alloc}}(t)}_{\text{입력 grid·중간값·임시 buffer·allocator}}\\
M_{\mathrm{peak}}&=\underbrace{\max_t M(t)}_{\text{실행 중 실제 최고 관측값}}
\end{aligned}`}</M>
          <FormulaNote
            meaning="이 식은 memory 항목을 빠뜨리지 않기 위한 accounting identity이지, vendor가 약속한 peak-VRAM 공식이 아니다. Offload를 켜면 DiT·text·VAE의 시간별 상주 항이 달라지고 PCIe·RAM 비용이 생긴다. 같은 checkpoint라도 Tz·H·W, attention backend와 allocator 상태가 달라지면 실제 peak가 달라지므로 local receipt를 함께 남긴다."
            symbols={[
              [String.raw`M_r,M_w`, '모바일 식에서 줄여 쓴 상주 component 합과 작업 중간값 합'],
              [String.raw`M_D,M_T,M_V`, '모바일 식의 DiT·text encoder·VAE 상주 memory'],
              [String.raw`M_L,M_A,M_X,M_Q`, '모바일 식의 latent·attention·temporary·allocator memory'],
              [String.raw`M_{\mathrm{DiT}},M_{\mathrm{text}},M_{\mathrm{VAE}}`, '시각 t에 GPU에 실제 상주한 model component memory'],
              [String.raw`M_{\mathrm{latent}},M_{\mathrm{attn}}`, 'Media grid와 attention 중간값 memory'],
              [String.raw`M_{\mathrm{temp}},M_{\mathrm{alloc}}`, 'Kernel temporary buffer와 allocator reserve/fragmentation'],
              [String.raw`M_{\mathrm{peak}}`, 'Profiler로 관측한 실행 구간 최대 VRAM'],
            ]}
          />
        </div>
        <div className="not-prose my-7 border-y border-border py-4">
          <p className="text-xs font-black text-muted-foreground">121-frame transfer check</p>
          <p className="mt-2 text-sm leading-relaxed">121 frames는 temporal latent 30.25개가 아니라 31개입니다. 첫 frame 뒤의 120개 간격을 stride 4로 묶고 첫 위치 하나를 더하기 때문입니다. Checkpoint 크기가 그대로여도 frame 수를 늘리면 Tz와 token 수가 증가해 attention·activation memory와 runtime이 늘어납니다. 따라서 “같은 5B인데 왜 느려졌나”의 첫 답은 parameter가 아니라 exact latent grid입니다.</p>
        </div>
        <div className="not-prose my-7 divide-y divide-border border-y border-border">
          {[
            ['Artifact', 'T2V-A14B · I2V-A14B · TI2V-5B, exact revision과 hash'],
            ['Condition', 'Text-only · image+text, prompt extension input/output와 source image hash'],
            ['Schedule', 'Sigma·timestep, t_moe, steps, solver와 seed'],
            ['Media grid', 'Frame count, FPS, width·height, VAE와 patch config'],
            ['Memory path', 'Precision, offload, T5 location, GPU·VRAM·RAM과 peak measurement'],
            ['Receipt', 'Cold/warm latency, output file, retry·OOM와 software revision'],
          ].map(([label, detail]) => (
            <div key={label} className="grid min-w-0 gap-2 py-4 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-4">
              <strong className="text-sm">{label}</strong>
              <code className="break-words text-xs leading-6 text-muted-foreground [overflow-wrap:anywhere]">{detail}</code>
            </div>
          ))}
        </div>
      </Milestone>

      <Milestone number="05" eyebrow="Finite source floor" title="공개 inference 계약을 설명했으면 비공개 학습 recipe로 더 내려가지 않는다">
        <div id="wan-stop" className="prose prose-neutral max-w-none scroll-mt-20 dark:prose-invert">
          <p>
            Wan2.2를 이해하는 최소 바닥은 private dataset mixture가 아니다. Task별 checkpoint를 고르고,
            A14B의 active expert와 TI2V의 dense compression을 분리하고, 내 media grid와 component
            placement에서 runtime을 재현할 수 있으면 된다.
          </p>
          <p>
            README가 더 큰 선별 image·video data와 미감·motion label을 썼다고 설명하는 것은 학습 방향의
            근거다. 원본 dataset, filter code, mixture, optimizer schedule과 expert별 phase가 공개됐다는
            뜻은 아니다.
          </p>
        </div>
        <StopRule>
          A14B의 routing을 TI2V-5B에 옮기거나 private training recipe를 추정하지 않는다. Task, family,
          latent grid, active compute와 hardware receipt를 재구성할 수 있으면 workflow 재현 글로 이동한다.
        </StopRule>
      </Milestone>

      <CapabilityCheck
        items={[
          'T2V-A14B, I2V-A14B와 TI2V-5B의 condition mode를 구분한다.',
          '약 27B total과 step당 약 14B active가 동시에 가능한 이유를 설명한다.',
          'TI2V-5B가 A14B의 작은 MoE variant가 아니라 dense sibling임을 안다.',
          '4×16×16 VAE와 1×2×2 patch가 token grid를 줄이는 과정을 계산한다.',
          'A14B 80GB와 TI2V 24GB 조건을 정확한 command path에 귀속한다.',
          'Checkpoint 외의 frame, encoder, VAE, offload와 schedule을 manifest에 넣는다.',
        ]}
      />
      <div className="not-prose my-8 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
        <span>선행: <InternalLink slug="video-model-runtime" learningPathId="ai-open-model-wan">Video Runtime 공통 계약</InternalLink></span>
        <span>다음: <InternalLink slug="open-model-community-workflows" learningPathId="ai-open-model-wan">Checkpoint별 재현 manifest</InternalLink></span>
      </div>
      <SourceNotes
        sources={[
          { label: 'Wan2.2 official README', href: `${sourceRoot}/README.md`, note: `검산 revision ${sourceRevision.slice(0, 12)}. Model family, A14B MoE, TI2V compression과 공식 실행 조건.` },
          { label: 'Wan2.2 A14B configs', href: `${sourceRoot}/wan/configs/wan_t2v_A14B.py`, note: 'High·low-noise checkpoint와 A14B model configuration.' },
          { label: 'Wan2.2 I2V-A14B config', href: `${sourceRoot}/wan/configs/wan_i2v_A14B.py`, note: 'I2V의 별도 boundary=0.900을 T2V boundary=0.875와 구분한다.' },
          { label: 'Wan2.2 timestep routing code', href: `${sourceRoot}/wan/text2video.py#L169-L190`, note: '현재 timestep과 boundary를 비교해 high/low-noise model을 선택하는 실제 실행 경로.' },
          { label: 'Wan2.2 TI2V-5B config', href: `${sourceRoot}/wan/configs/wan_ti2v_5B.py`, note: 'Dense 5B path, VAE stride와 patch size의 현재 code contract.' },
          { label: 'Wan technical report', href: 'https://arxiv.org/abs/2503.20314', note: 'Wan 계열의 VAE, DiT, data와 evaluation 기반. Wan2.2 delta는 current repository와 함께 검산한다.' },
        ]}
      />
    </>
  );
}

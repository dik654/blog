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
  Pi07EvidenceBoundaryLab,
  Pi07PromptContractLab,
  Pi07RuntimeCadenceLab,
  VLaSourceSpineMilestone,
} from './robot-vla-source/viz/RobotVlaSourceLabs';

function Formula({ latex, meaning, symbols }: { latex: string; meaning: string; symbols: [string, string][] }) {
  return (
    <div data-formula-pair className="not-prose my-7 min-w-0">
      <div className="min-w-0 overflow-hidden rounded-md border border-border px-2 py-4 sm:px-4">
        <Math display className="my-0 text-[13px] sm:text-base">{latex}</Math>
      </div>
      <FormulaNote meaning={meaning} symbols={symbols} />
    </div>
  );
}

const architectureReceipts = [
  {
    name: '관측',
    value: '최대 4 camera × 최대 6 history frames + joint state',
    reading: '현재 한 장만 보는 대신 약 1초 간격의 짧은 시각 기억과 proprioception을 함께 조건으로 쓴다.',
  },
  {
    name: '공통 backbone',
    value: 'Gemma 3 4B · vision encoder 400M 포함',
    reading: '언어, 현재 image, semantic subtask와 metadata를 공통 token 문맥으로 해석한다.',
  },
  {
    name: '행동 expert',
    value: '860M flow action expert · 50-step chunk',
    reading: '텍스트 token을 출력하는 대신 연속 action 궤적을 만들고 그중 15 또는 25 step만 실행한다.',
  },
  {
    name: '별도 world model',
    value: 'BAGEL 기반 14B · visual subgoal 생성',
    reading: 'π0.7의 약 5B parameter에 포함되지 않는다. Subgoal을 쓰는 전체 system 크기와 VLA 크기를 구분해야 한다.',
  },
] as const;

export default function ResearchPi072026Article() {
  return (
    <>
      <SpecialistEntry
        eyebrow="현재 Robot AI 연구 읽기"
        title="π0.7의 mixed-quality data와 비동기 실행을 검산하는 글"
        description="Robot 관측, 언어 조건과 action chunk가 이미 무엇인지 안다는 전제에서, 서로 다른 품질의 demonstration을 어떻게 조건화하고 실제 controller cadence에 연결했는지 원문 증거를 따라간다."
        prerequisites={[
          'Robot policy가 observation과 task 조건을 받아 action을 출력한다는 뜻을 안다.',
          'Imitation learning과 offline data가 기록된 행동을 학습한다는 뜻을 안다.',
          '부분 관측에서는 짧은 camera history와 robot state가 필요할 수 있음을 안다.',
        ]}
        links={[
          { slug: 'robot-ai-top-down', title: 'Robot AI top-down 지도', reason: '감지, state, policy, planning과 controller의 전체 책임을 먼저 본다.' },
          { slug: 'paper-openvla-2024', title: 'OpenVLA 기반 논문', reason: 'Vision-language-action model의 최소 입출력 구조를 잡는다.' },
          { slug: 'rl-imitation-offline-learning', title: 'Imitation · offline learning', reason: '시범 data의 품질과 분포가 policy에 미치는 영향을 배운다.' },
        ]}
      />
      <section id="prompt-contract" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">같은 명령 아래 서로 다른 행동을 섞으면 무엇을 배울까?</h2>
        <QuestionLead
          question="전문가 시범, 느리지만 성공한 시범, 실패한 자율 rollout과 RL specialist 경험을 한 dataset에 모두 넣으면 data가 많아진 만큼 policy도 좋아질까?"
          answer="Task 이름만 주면 그렇지 않다. 같은 '셔츠를 접어라' 아래 빠른 성공, 느린 성공과 실패가 함께 있으면 model은 어느 행동 mode를 재현해야 하는지 알 수 없다. π0.7은 task 외에 속도·품질·실수 여부와 control mode를 조건으로 붙여, 나쁜 상태의 관측 범위는 배우되 runtime에는 높은 품질 mode를 요청한다."
        />
        <ConceptPrimer items={[
          { term: 'Observation', meaning: 'Camera history와 robot joint state처럼 지금 실제로 측정한 정보다.', why: 'Policy가 어느 상태에서 행동하는지 정한다.' },
          { term: 'Context', meaning: 'Task, semantic subtask, visual subgoal, 속도·품질·실수와 control mode다.', why: '같은 관측에서 어떤 전략을 원했는지 구분한다.' },
          { term: 'Action chunk', meaning: '한 번의 추론으로 예측한 50 step 연속 robot command다.', why: 'Model 지연 동안 controller가 실행할 행동 buffer를 만든다.' },
          { term: 'Closed-loop evidence', meaning: '예측 token이 아니라 실제 robot이 행동한 뒤 다음 관측까지 포함한 성공·속도·실패 기록이다.', why: 'Offline loss가 보지 못하는 latency와 state drift를 드러낸다.' },
        ]} />
        <VLaSourceSpineMilestone />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Metadata는 설명용 tag가 아니다. Training example의 행동과 함께 들어가 어느 mode가 그 action을 만들었는지 분리하고, 배포할 때는 <strong>빠름·품질 5·실수 없음</strong>을 요청하는 control input으로 다시 쓰인다. 이 pairing이 없으면 더 많은 저품질 data는 더 넓은 상태를 보여 주는 동시에 원하는 행동도 흐릴 수 있다.</p>
        </div>
        <Pi07PromptContractLab />
        <Misconception>π0.7은 실패를 성공으로 바꾸는 reward model을 이 단계에서 온라인 학습하는 것이 아니다. π*0.6 RL specialist와 autonomous evaluation이 만든 trajectory를 labeled mixture에 넣고 generalist가 조건부 imitation으로 흡수한다. RL 경험을 사용하지만 π0.7 전체 학습을 곧바로 online RL이라고 부르면 안 된다.</Misconception>
      </section>

      <section id="observation-action-path" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Camera history에서 50개 action까지 data flow를 따라간다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Runtime 관측은 front·두 wrist·선택적인 rear camera와 joint configuration이다. 각 view는 최대 6개 history frame을 가질 수 있고 448×448로 맞춘다. MEM 계열 video encoder는 history 길이가 늘어도 고정된 수의 token으로 압축한다. 이는 과거 영상을 전부 language backbone에 펼치는 비용을 줄이면서 가려졌던 물체나 직전 motion의 단서를 남긴다.</p>
          <p>Gemma 3 backbone은 관측과 context를 읽고, 별도의 860M action expert가 flow matching으로 50-step 연속 action을 만든다. VLM 쪽 block-causal mask에서는 observation과 visual-subgoal image token이 각자 내부를 양방향으로 보고, subgoal은 observation도 볼 수 있으며, 뒤따르는 text token은 causal하게 앞만 본다. Action expert는 backbone activation 전체를 참조하고 action token끼리도 양방향으로 본다. 이때 backbone 표현을 보호하는 장치는 mask가 아니라 <strong>Knowledge Insulation</strong>이다. Action expert의 gradient를 backbone으로 흘려보내지 않고, backbone은 더 안정적인 discrete FAST-token cross-entropy로 학습한다.</p>
        </div>
        <Formula
          latex={String.raw`\begin{aligned}\underbrace{x_t}_{\text{정책 입력}}&=\left(\underbrace{o_{t-T:t}}_{\text{최근 영상·관절}},\underbrace{C_t}_{\text{과제·목표·품질}}\right)\\[2pt]\max_{\theta}\;&\mathbb{E}_{\mathcal D}\!\left[\log \pi_{\theta}\!\left(\underbrace{a_{t:t+H}}_{\text{50단계 행동 묶음}}\mid x_t\right)\right]\end{aligned}`}
          meaning="Dataset에서 최근 관측과 context가 주어졌을 때 실제 action chunk의 가능도를 높이는 조건부 policy를 배운다는 논문의 식이다. 다만 실제 action expert는 이 log likelihood를 닫힌 형태로 직접 계산하지 않고 flow-matching objective라는 계산 가능한 근사 하한을 최적화한다."
          symbols={[
            [String.raw`\mathcal D`, 'Demonstration, autonomous evaluation, intervention, open data 등을 섞은 학습 분포'],
            [String.raw`o_{t-T:t}`, '현재까지의 camera history와 joint configuration'],
            [String.raw`C_t`, 'Task·semantic subtask·visual subgoal·episode metadata·control mode'],
            [String.raw`a_{t:t+H}`, '현재부터 H까지의 연속 action chunk, 구현에서는 50 steps'],
            [String.raw`\text{조건부 학습}`, '같은 상태라도 원하는 품질과 목표가 다르면 다른 행동을 낼 수 있게 하는 연산'],
          ]}
        />
        <div className="not-prose divide-y divide-border border-y border-border">
          {architectureReceipts.map((receipt) => (
            <article key={receipt.name} className="grid gap-3 py-5 sm:grid-cols-[9rem_17rem_minmax(0,1fr)] sm:gap-6">
              <p className="text-sm font-bold">{receipt.name}</p>
              <p className="font-mono text-sm font-black leading-relaxed">{receipt.value}</p>
              <p className="text-sm leading-relaxed text-muted-foreground">{receipt.reading}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="mixed-quality-data" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">더 많은 data가 좋아진 조건을 ablation으로 좁힌다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>π0.7은 episode 길이를 500-step 단위 speed bucket으로 만들고, 품질을 1–5로 표시하며, action segment에 실수가 있었는지를 기록한다. Training 중 metadata 전체를 15% 확률로 빼고 각 component도 5% 확률로 따로 뺀다. 그래서 모든 field가 항상 있어야만 움직이는 policy가 아니라, 일부 context가 빠져도 동작하면서 field가 있을 때 mode를 구분하는 policy를 만든다. Control mode는 actuator contract라서 dropout하지 않는다.</p>
          <p>Controlled laundry 실험에서는 상위 30%, 50%, 80%, 전체 data를 각각 사용했다. Metadata가 있으면 낮은 평균 품질의 data를 더 넣을수록 성능이 증가했지만, metadata가 없으면 더 많은 data가 오히려 성능을 낮출 수 있었다. 이는 한 task family의 결과이며 모든 robot data에 대한 법칙은 아니다. 별도 diversity ablation도 가장 다양한 20%를 제거한 경우가 임의 20% 제거보다 나빴지만, 저자들은 거대한 dataset에서 다양성을 깨끗하게 절단하기 어렵다고 명시한다.</p>
          <p>π0.7이 명시적으로 계승한 π0.5의 semantic subtask는 “셔츠 접기”를 “소매를 안으로 접기” 같은 가까운 의도로 나눈다. π*0.6의 RL specialist rollout은 policy가 실제로 방문하는 성공·실패 상태를 더한다. MEM 설계는 짧은 시각 history를 압축하고, 별도 14B world model은 BAGEL에서 초기화한다. 이 네 선행 작업은 π0.7의 lineage이지만, 현재 독자가 반드시 별도 논문 네 편을 먼저 완독해야 하는 바닥은 아니다.</p>
        </div>
        <Formula
          latex={String.raw`\begin{aligned}\underbrace{s_{\mathrm{guided}}(a)}_{\text{원하는 행동 방향}}={}&\underbrace{s_{\mathrm{cond}}(a)}_{\text{metadata를 본 점수}}\\[-1pt]&+\underbrace{\beta\!\left(s_{\mathrm{cond}}(a)-s_{\mathrm{uncond}}(a)\right)}_{\text{품질 조건이 만든 차이를 강화}}\end{aligned}`}
          meaning="기존 classifier-free guidance를 action에 재사용해 metadata를 본 score와 metadata를 가린 score의 차이를 beta만큼 더한다. π0.7이 보고한 적용 범위는 episode metadata다. Beta를 키우면 원하는 품질 mode가 강해질 수 있지만 너무 크면 demonstration 분포 밖의 action으로 밀어낼 수 있다."
          symbols={[
            [String.raw`s_{\mathrm{cond}}`, '속도·품질·실수 metadata를 본 action denoising score'],
            [String.raw`s_{\mathrm{uncond}}`, '같은 입력에서 metadata를 unconditional mode로 가린 score'],
            [String.raw`\beta`, 'Guidance 강도, 원문 실험은 1.3·1.7·2.2 중 선택'],
            [String.raw`\text{두 score의 차이}`, 'Task 자체가 아니라 episode mode가 action 방향에 보탠 성분'],
            [String.raw`\text{실패 경계}`, 'CFG는 잘못된 task 이해나 새로운 물리 skill을 자동 생성하지 않는다.'],
          ]}
        />
      </section>

      <section id="asynchronous-runtime" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">π0.7은 한 번 호출하는 model이 아니라 비동기 control loop다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>High-level policy가 semantic subtask를 정하면 별도의 BAGEL 기반 world model이 가까운 미래의 multi-view visual subgoal을 만든다. Subtask가 바뀌거나 4초가 지나면 subgoal을 비동기로 갱신한다. VLA도 5번의 denoising으로 50 action을 예측하지만 15 또는 25개만 실행하고 다음 chunk를 겹쳐 계산한다.</p>
          <p>50 Hz controller는 20 ms마다 새 tick이 온다. 최소 구성의 H100 추론 38 ms조차 한 tick보다 길다. 따라서 “38 ms면 빠르다”가 결론이 아니라, 이전 chunk를 실행하는 동안 다음 chunk를 계산하고 training에서 0–12 timestep, 최대 240 ms delay를 모사하는 real-time chunking이 핵심이다.</p>
        </div>
        <Formula
          latex={String.raw`\begin{aligned}\underbrace{\Delta t_{\mathrm{tick}}}_{\text{제어 한 번의 시간}}&=\frac{1}{\underbrace{50\ \mathrm{Hz}}_{\text{초당 50회}}}=\underbrace{20\ \mathrm{ms}}_{\text{한 tick}}\\[2pt]\frac{\underbrace{38\ \mathrm{ms}}_{\text{최소 H100 추론}}}{20\ \mathrm{ms}}&\approx\underbrace{1.9\ \text{ticks}}_{\text{한 tick을 넘음}}\end{aligned}`}
          meaning="주파수의 역수를 취해 controller가 action을 갱신할 수 있는 시간 간격을 구한다. 38 ms 추론은 약 1.9 tick이므로 추론이 끝날 때까지 robot을 멈추거나 같은 action을 반복하면 학습 때와 다른 동역학이 된다. Action chunk와 비동기 inference가 그 공백을 덮는다."
          symbols={[
            [String.raw`\Delta t_{\mathrm{tick}}`, 'Controller가 다음 명령을 요구할 때까지의 시간'],
            [String.raw`50\ \mathrm{Hz}`, '논문 RTC가 가정한 robot control frequency'],
            [String.raw`38\ \mathrm{ms}`, '3 cameras·5 denoising steps·training-time RTC인 최소 variant의 단일 H100 수치'],
            [String.raw`\text{역수}`, '초당 반복 횟수를 한 번에 허용되는 시간으로 바꾸는 연산'],
            [String.raw`\text{배포 경계}`, 'Network·queue·sensor age까지 더한 end-to-end latency는 별도로 측정해야 함'],
          ]}
        />
        <Pi07RuntimeCadenceLab />
      </section>

      <section id="evidence-boundary" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Dexterity, transfer와 새 조합을 같은 “일반화”로 합치지 않는다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Seen dexterity 평가는 laundry·espresso·box task에 해당 task data와 specialist rollout을 포함한다. 여기서 하나의 π0.7이 여러 specialist와 비슷하거나 일부 throughput에서 앞섰다는 사실은 강한 generalist evidence지만 zero-shot 증거는 아니다. Metadata와 autonomous evaluation data를 각각 뺀 ablation은 둘 다 full model보다 낮았고, 차이는 특히 throughput에서 컸다.</p>
          <p>Instruction following은 학습에 쓰지 않은 kitchen과 bedroom에서 3–6단계 지시를 수행하는지를 본다. Cross-embodiment 실험은 해당 laundry task data가 없는 bimanual UR5e로 skill을 옮긴다. Appliance task에서는 action-level demonstration 대신 사람이 step-by-step 언어 coaching을 제공한다. Coached execution 중의 visual subgoal은 사람이 준 image가 아니라 별도 BAGEL 기반 world model이 생성한다. 이후에는 coaching data의 언어 instruction trace로 high-level language policy를 학습한다. 서로 다른 개입과 평가 단위이므로 하나의 성공 영상으로 모든 일반화를 주장할 수 없다.</p>
        </div>
        <Pi07EvidenceBoundaryLab />
        <Misconception>논문은 “training에 절대 없던 원자적 skill을 창조했다”는 것을 증명하지 않는다. 저자들도 거대한 혼합 data에서 무엇이 진짜 seen인지 확정하기 어렵고, 관련 skill을 새로운 방식으로 remix했을 수 있다고 적는다. 이 remix 능력을 compositional generalization으로 해석하되 보편적인 zero-shot 성공과 동일시하면 안 된다.</Misconception>
        <StopRule>Observation·context·action chunk, mixed-quality metadata, asynchronous cadence와 평가별 claim boundary를 설명할 수 있으면 π0.7 원문 단계는 끝이다. Action token의 재현 가능한 공개 기준은 <InternalLink slug="paper-openvla-2024">OpenVLA 2024</InternalLink>, demonstration과 rollout 분포는 <InternalLink slug="rl-imitation-offline-learning">모방 학습과 Offline RL</InternalLink>, partial observation은 <InternalLink slug="rl-pomdp-state-estimation">POMDP와 상태 추정</InternalLink>에서 필요한 만큼만 내려간다.</StopRule>
        <CapabilityCheck items={[
          'Task label만 있는 mixed-quality dataset에서 행동이 평균화될 수 있는 이유를 설명한다.',
          'Camera history·context·flow action expert·50-step chunk의 data flow를 순서대로 그린다.',
          'π0.5·π*0.6·MEM과 π0.7의 역할을 구분하고 선행 논문을 무한히 확장하지 않는다.',
          '38 ms와 50 Hz를 비교해 비동기 chunking과 RTC가 필요한 이유를 계산한다.',
          'Seen dexterity, instruction following, cross-embodiment와 coaching evidence가 지지하는 주장을 구분한다.',
          'Seen 90% 이상과 unseen 60–80%의 간격, training overlap 불확실성을 함께 말한다.',
        ]} />
        <SourceNotes sources={[
          { label: 'π0.7 · official research page', href: 'https://www.pi.website/blog/pi07', note: '공개일, 영상과 연구 설명의 1차 출처.' },
          { label: 'π0.7 · official paper PDF', href: 'https://www.pi.website/download/pi07.pdf', note: 'Architecture, context dropout, Algorithm 1, ablation, evaluation과 limitations의 직접 근거.' },
          { label: 'π0.5 · official paper', href: 'https://www.pi.website/download/pi05.pdf', note: 'π0.7이 계승한 semantic subtask hierarchy의 lineage 근거.' },
          { label: 'π*0.6 · official paper', href: 'https://www.pi.website/download/pistar06.pdf', note: 'RL specialist와 autonomous rollout experience를 generalist data로 옮기는 lineage 근거.' },
          { label: 'Classifier-Free Diffusion Guidance', href: 'https://arxiv.org/abs/2207.12598', note: 'π0.7이 episode metadata 조건을 강화하는 데 재사용한 guidance 방법의 원천.' },
        ]} />
      </section>
    </>
  );
}

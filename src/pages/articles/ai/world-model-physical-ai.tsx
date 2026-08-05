import {
  ArrowDown,
  BookOpenCheck,
  BrainCircuit,
  Camera,
  GitBranch,
  Move3d,
  RefreshCw,
} from 'lucide-react';
import {
  BeginnerBridge,
  CapabilityCheck,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
  StopRule,
} from '@/components/learning/ArticleLearning';
import { WorldModelContractExplorer } from './world-model-core/viz/WorldModelExplorers';

const route = [
  {
    index: '01', icon: GitBranch, slug: 'world-model-physical-ai', title: '현재 contract',
    question: '이 모델은 무엇을 관측하고 무엇을 예측하며 action은 어디에 들어갈까?',
    outcome: 'Interactive world, latent predictor, action dynamics와 direct policy를 구분한다.',
  },
  {
    index: '02', icon: BrainCircuit, slug: 'predictive-world-representations', title: '예측 표현',
    question: 'Pixel을 복원하지 않고도 motion과 object state를 배울 수 있을까?',
    outcome: 'Mask prediction, target encoder와 action-free representation의 경계를 읽는다.',
  },
  {
    index: '03', icon: Move3d, slug: 'action-conditioned-world-dynamics', title: '행동 동역학',
    question: '어떤 action이 어떤 좌표와 시간에서 다음 state를 만들었을까?',
    outcome: 'Frame·unit·timestamp, forward/inverse/joint mode와 rollout loss를 연결한다.',
  },
  {
    index: '04', icon: RefreshCw, slug: 'world-model-planning-closed-loop', title: '계획과 폐루프',
    question: '예측을 실제 행동 선택으로 바꾸고 틀린 미래를 어떻게 고칠까?',
    outcome: 'CEM, MPC, uncertainty, constraint와 real closed-loop evidence로 닫는다.',
  },
] as const;

const modelStories = [
  {
    marker: 'CURRENT · 2026-06', title: 'Cosmos 3는 action을 다른 modality와 같은 sequence 안에 넣는다',
    body: 'Language·vision 이해를 위한 autoregressive stream과 vision·audio·action 생성을 위한 diffusion stream을 함께 둔다. Action token을 두 video state 사이의 변화로 놓고, clean action에서 future video를 만드는 forward dynamics, clean video에서 action을 찾는 inverse dynamics, 둘을 함께 생성하는 policy mode를 분리한다.',
    boundary: '공통 backbone이 여러 mode를 지원한다는 사실은 특정 robot에서 안전한 closed-loop control이 검증됐다는 뜻이 아니다.',
  },
  {
    marker: 'REAL CLOSED LOOP · 2026-02', title: 'DreamZero는 world-action model을 7Hz direct policy로 실행한다',
    body: '14B autoregressive video diffusion backbone이 future video와 action을 함께 모델링하고, 별도 CEM search 없이 action을 바로 생성한다. 공개 논문은 실제 robot에서 7Hz closed-loop control, 10–20분 video-only transfer와 30분 새 embodiment adaptation을 보고한다.',
    boundary: 'DreamZero의 증거는 direct world-action policy의 강한 현재 사례다. 후보 action을 명시적으로 rollout하고 constraint cost로 고르는 CEM planner와 같은 실행 구조로 합치지 않는다.',
  },
  {
    marker: 'INTERACTIVE WORLD · 2025-08', title: 'Genie 3는 실시간으로 반응하는 visual world의 경계를 넓혔다',
    body: 'Text로 만든 환경을 720p, 20–24fps에서 수분 동안 탐색하고 user control과 promptable event에 반응한다. 이는 visual consistency와 controllability의 강한 증거다. Agent curriculum과 interactive simulation의 가능성을 보여 주지만 robot base 좌표, meter 단위 action이나 contact force는 공개 claim에 없다.',
    boundary: '화면 속 캐릭터를 조종할 수 있다는 말과 실제 actuator command의 결과를 metric state로 예측한다는 말은 다르다.',
  },
  {
    marker: 'MINIMUM CANONICAL · 2025-06', title: 'V-JEPA 2는 관찰 학습에서 action post-training과 planning까지 연결한다',
    body: '백만 시간 넘는 image·video에서 action 없이 masked latent prediction을 먼저 배운다. 그 encoder를 고정한 뒤 62시간 미만의 DROID robot video, end-effector state와 action으로 V-JEPA 2-AC predictor를 학습한다. 마지막에는 goal image와 가까워지는 후보 action을 CEM으로 찾고 첫 action만 실행한 뒤 다시 관측한다.',
    boundary: '현대 경로의 최소 논문은 여기서 끊는다. 2018년 World Models와 더 오래된 control 계보는 현재 식이나 실패 원인이 막힐 때만 연다.',
  },
  {
    marker: 'DIRECT ACTION', title: 'VLA는 future를 명시적으로 rollout하지 않고 action을 바로 낼 수도 있다',
    body: 'Vision·language에서 robot action을 직접 생성하는 policy는 빠른 amortized inference가 강점이다. 반면 후보 action마다 predicted future와 constraint cost를 명시적으로 비교하지 않을 수 있다. Cosmos 같은 joint world-action model은 action과 expected future를 함께 만들 수 있으므로 direct VLA와도 다시 구분해야 한다.',
    boundary: '좋은 policy와 좋은 world model은 겹칠 수 있지만 같은 interface는 아니다. Output과 evidence를 보고 분류한다.',
  },
] as const;

export default function WorldModelPhysicalAiArticle() {
  return (
    <>
      <section id="why-split" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">World model은 하나의 모델 계열이 아니라 네 가지 질문이다</h2>
        <BeginnerBridge title="다음 화면을 그럴듯하게 그리는 것과 로봇이 움직인 뒤의 실제 결과를 맞히는 것은 다르다">
          World model은 현재 관측과 선택한 action을 받아 앞으로 무엇이 달라질지 예측한다. 예쁜 다음 영상을 만드는 능력만으로는 바퀴가 얼마나 움직였는지 보장할 수 없고, planner는 여러 action의 결과를 비교해 실제로 실행할 하나를 골라야 한다.
        </BeginnerBridge>
        <QuestionLead question="그럴듯한 다음 영상을 만드는 모델을 로봇 planner로 바로 사용할 수 있을까?" answer="아니다. Visual world는 관측이 어떻게 보일지 만들 수 있지만, planning에는 현재 state와 후보 action에서 다음 state가 어떻게 달라지는지, 그 action의 좌표·단위·시간이 무엇인지, 실제 feedback으로 틀린 예측을 언제 고칠지까지 필요하다." />
        <ConceptPrimer items={[
          { term: 'Observation', meaning: 'Camera, proprioception, language처럼 agent가 실제로 받은 감각이다.', why: '화면에 보이지 않는 physical state와 관측 값을 구분한다.' },
          { term: 'Latent state', meaning: '관측을 미래 예측과 decision에 필요한 compact feature로 바꾼 값이다.', why: '모든 pixel을 생성하지 않고도 motion과 object state를 다룬다.' },
          { term: 'Action grounding', meaning: 'Action 숫자에 frame, unit, rate와 actuator 의미를 붙이는 계약이다.', why: '같은 vector가 다른 camera·robot에서 다른 물리 행동이 되는 오류를 막는다.' },
          { term: 'Closed loop', meaning: '일부 action 뒤 새 관측으로 state를 고치고 다시 계획한다.', why: '긴 open-loop rollout의 누적 model error를 현실 feedback으로 줄인다.' },
        ]} />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>기존 글은 V-JEPA, Genie, Cosmos, VLA와 classical simulator를 한 표에 모았다. 비교 축은 있었지만 각 모델이 왜 다음 단계로 이어지는지, action이 없는 video pretraining과 실제 robot intervention 사이에 무엇이 추가되는지 읽기 어려웠다.</p>
          <p>이 경로는 모델 이름 대신 <strong>관측 → 표현 → 행동 조건 예측 → 계획 → 다시 관측</strong>의 실행 계약으로 나눈다. 새 연구가 나오면 네 층 중 바뀐 층만 교체하고, 과거 논문을 무한정 아래에 더하지 않는다.</p>
        </div>
        <Misconception>“World model”이라는 이름은 현실의 완전한 복사본을 뜻하지 않는다. 목표 task에 필요한 counterfactual을 충분히 예측하는 모델이다. 영상의 texture 오차는 무시할 수 있어도 contact, object pose와 workspace boundary 오차는 robot success를 무너뜨릴 수 있다.</Misconception>
      </section>

      <section id="current-contracts" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">현재 모델은 이름이 아니라 입력·출력·증거로 읽는다</h2>
        <p className="mb-5 max-w-3xl text-sm leading-relaxed text-muted-foreground">World model이라는 이름 아래 video generator, action-conditioned predictor와 latent predictor가 함께 놓이지만 서로 대신할 수는 없다. 다음 비교에서는 입력에 action이 있는지, 무엇을 예측하는지, 어떤 planning·control 증거가 공개됐는지부터 분리한다.</p>
        <WorldModelContractExplorer />
        <div className="not-prose my-8 divide-y divide-border border-y border-border">
          {modelStories.map((story) => (
            <article key={story.title} className="grid gap-3 py-6 sm:grid-cols-[9rem_minmax(0,1fr)]">
              <p className="font-mono text-[9px] font-black text-muted-foreground">{story.marker}</p>
              <div className="min-w-0">
                <h3 className="text-base font-bold leading-snug">{story.title}</h3>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{story.body}</p>
                <p className="mt-4 border-l-2 border-border pl-3 text-[10px] font-semibold leading-relaxed">{story.boundary}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="not-prose my-8 border-y border-border py-5">
          <p className="text-[10px] font-black uppercase tracking-[0.12em] text-muted-foreground">Freshness receipt · 2026-07-31</p>
          <p className="mt-2 text-sm font-bold">World Action Planner는 search 구조를 바꾸는 새 후보지만 아직 최상단을 교체하지 않는다.</p>
          <p className="mt-2 max-w-3xl text-xs leading-relaxed text-muted-foreground">2026-07-30 공개된 WAP는 VLM이 초기 계획을 제안하고 action-conditioned world model rollout을 보며 반복 수정한다. 현재 공개 evidence는 simulation 중심이므로 real closed-loop 근거가 쌓일 때까지 연구 queue에 두고, Cosmos 3 범용 contract와 DreamZero real-policy comparator를 유지한다.</p>
        </div>
      </section>

      <section id="route" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">현재 연구에서 기반과 구현으로 내려가는 네 단계</h2>
        <div className="not-prose my-8 border-y border-border" aria-label="World Model 읽는 순서">
          {route.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={item.slug} className="relative grid min-w-0 gap-3 border-b border-border py-5 last:border-b-0 sm:grid-cols-[3rem_2.5rem_minmax(0,12rem)_minmax(0,1fr)] sm:items-start">
                <span className="font-mono text-xs font-black text-muted-foreground">{item.index}</span>
                <span className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-muted/20"><Icon className="h-4 w-4" /></span>
                <div className="min-w-0">
                  {item.slug === 'world-model-physical-ai' ? <strong className="text-sm">{item.title}</strong> : <InternalLink slug={item.slug}>{item.title}</InternalLink>}
                  <p className="mt-1 text-[10px] font-semibold leading-relaxed text-muted-foreground">{item.question}</p>
                </div>
                <p className="min-w-0 text-xs leading-relaxed text-muted-foreground">{item.outcome}</p>
                {index < route.length - 1 && <ArrowDown className="absolute -bottom-2.5 left-[3.35rem] z-10 h-5 w-5 rounded-full border border-border bg-background p-1 text-muted-foreground sm:left-[4.6rem]" aria-hidden="true" />}
              </div>
            );
          })}
        </div>
        <div className="not-prose my-8 grid min-w-0 gap-4 border-y border-border py-5 sm:grid-cols-[2.5rem_minmax(0,1fr)_auto] sm:items-center">
          <span className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-muted/20"><BookOpenCheck className="h-4 w-4" /></span>
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.12em] text-muted-foreground">선택 원문 검산</p>
            <p className="mt-1 text-sm font-bold">V-JEPA 2는 필수 3단계가 아니라 네 계약을 실제 수치로 확인하는 원문 sidecar다.</p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">표현과 action contract가 막힐 때만 열어 7D action, T=15/2 loss, 800×10 CEM과 두 lab 결과를 검산한다.</p>
          </div>
          <InternalLink slug="paper-vjepa2-2025">원문 재구성 열기</InternalLink>
        </div>
        <StopRule>V-JEPA 2/2-AC의 표현·동역학·계획 연결을 설명하고, 새 모델의 action contract와 closed-loop evidence를 판정할 수 있으면 역사 하향을 멈춘다. Camera frame이 막히면 calibration, 불확실성이 막히면 확률, 실제 경로가 막히면 motion planning만 연다.</StopRule>
      </section>

      <section id="entry-choice" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">내 질문에는 어디서 시작해야 할까?</h2>
        <div className="not-prose my-8 divide-y divide-border border-y border-border">
          {[
            ['Video는 자연스럽지만 물체 state가 자꾸 사라진다', 'predictive-world-representations', 'Pixel fidelity와 latent target, temporal context와 representation probe를 확인한다.'],
            ['새 camera에서 action 결과가 반대 방향으로 간다', 'action-conditioned-world-dynamics', 'Camera·base·effector frame, pose delta와 timestamp alignment를 검산한다.'],
            ['One-step 예측은 좋은데 planner rollout이 무너진다', 'action-conditioned-world-dynamics', 'Teacher forcing과 own-prediction rollout의 입력 분포 차이를 확인한다.'],
            ['Goal 이미지는 비슷해지지만 실제 grasp는 실패한다', 'world-model-planning-closed-loop', 'Goal ambiguity, model exploitation, constraint와 real success gate를 분리한다.'],
            ['Robot action이 아니라 interactive world를 만들고 싶다', 'predictive-world-representations', 'Visual consistency가 목표인지 metric action grounding까지 필요한지 먼저 고른다.'],
          ].map(([symptom, slug, action], index) => (
            <div key={`${slug}-${index}`} className="grid gap-2 py-5 sm:grid-cols-[2rem_minmax(0,15rem)_minmax(0,1fr)]">
              <span className="font-mono text-[10px] font-black text-muted-foreground">{String(index + 1).padStart(2, '0')}</span>
              <strong className="text-sm leading-snug">{symptom}</strong>
              <p className="text-xs leading-relaxed text-muted-foreground"><InternalLink slug={slug}>이 글에서 시작</InternalLink><span className="ml-2">{action}</span></p>
            </div>
          ))}
        </div>
        <div className="not-prose my-8 flex items-start gap-3 rounded-md border border-border bg-muted/10 p-4"><Camera className="mt-0.5 h-4 w-4 shrink-0" /><p className="text-xs font-semibold leading-relaxed">배포 camera나 robot이 바뀌면 representation domain shift와 action coordinate calibration을 같은 문제로 합치지 않는다. 먼저 각 계약을 독립 trace로 재현한 뒤 연결한다.</p></div>
        <CapabilityCheck items={[
          'Interactive video, latent predictor, action-conditioned dynamics, joint world-action model과 direct VLA를 구분한다.',
          '모델의 input, predicted variable, action grounding과 strongest evidence를 네 문장으로 정리한다.',
          'Visual controllability를 metric robot physics와 같은 주장으로 확대하지 않는다.',
          '현재 failure에 필요한 글만 읽고 V-JEPA 2/2-AC 아래의 역사 하향을 멈춘다.',
        ]} />
        <SourceNotes sources={[
          { label: 'NVIDIA Research · Cosmos 3', href: 'https://research.nvidia.com/labs/cosmos-lab/cosmos3/', note: 'Omnimodal MoT, action representation과 forward·inverse·joint generation mode의 공식 project와 technical report.' },
          { label: 'NVIDIA · DreamZero', href: 'https://arxiv.org/abs/2602.15922', note: '14B world-action model의 7Hz real closed-loop direct policy, 짧은 cross-embodiment adaptation과 VLA 비교의 1차 근거.' },
          { label: 'World Action Planner · 2026-07-30', href: 'https://arxiv.org/abs/2607.27599', note: 'VLM proposal과 imagined world-model rollout search의 최신 후보. Simulation evidence라 current promotion은 보류했다.' },
          { label: 'Meta AI · V-JEPA 2', href: 'https://ai.meta.com/research/publications/v-jepa-2-self-supervised-video-models-enable-understanding-prediction-and-planning/', note: 'Action-free video pretraining에서 action-conditioned latent planning까지 연결한 현대 최소 기준점.' },
          { label: 'Google DeepMind · Genie 3', href: 'https://deepmind.google/models/genie/', note: 'Realtime interactive visual world의 공개 capability와 duration·accuracy limitation.' },
        ]} />
      </section>
    </>
  );
}

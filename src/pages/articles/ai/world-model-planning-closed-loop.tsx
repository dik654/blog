import MathFormula from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
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
import { ClosedLoopPlannerExplorer, WorldModelReleaseGate } from './world-model-core/viz/WorldModelExplorers';

function Formula({ latex, meaning, symbols }: { latex: string; meaning: string; symbols: [string, string][] }) {
  return <div className="not-prose my-7 min-w-0"><div className="min-w-0 rounded-md border border-border p-3 sm:p-4"><MathFormula display className="my-0 text-sm sm:text-base">{latex}</MathFormula></div><FormulaNote meaning={meaning} symbols={symbols} /></div>;
}

export default function WorldModelPlanningClosedLoopArticle() {
  return (
    <>
      <SpecialistEntry
        title="예측된 미래를 실제 robot action으로 고르는 고급 경로"
        description="World model의 next-state prediction을 goal, cost, search, constraint와 feedback loop에 연결한다. World model이 무엇을 예측하는지부터 낯설다면 action-conditioned dynamics를 먼저 읽는다."
        prerequisites={[
          'State, action과 next state의 관계를 dynamics로 표현할 수 있음을 안다.',
          'World model은 후보 행동의 결과를 예측할 뿐 목표를 스스로 정하지 않음을 안다.',
          'Robot은 action 뒤 새 관측을 받아 오차를 고치는 feedback system임을 안다.',
        ]}
        links={[
          { slug: 'action-conditioned-world-dynamics', title: 'Action-conditioned world dynamics', reason: '현재 state와 action으로 미래를 예측하는 최소 구조를 배운다.' },
          { slug: 'robot-motion-planning', title: 'Robot motion planning', reason: 'Goal, constraint와 collision-free trajectory의 고전적 책임을 잡는다.' },
          { slug: 'rl-model-based-world-models', title: 'Model-based RL', reason: 'Learned dynamics를 value·policy와 결합하는 다른 계보와 비교한다.' },
        ]}
      />
      <section id="model-not-planner" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">World model은 미래를 제안하지만 어느 미래를 고를지는 정하지 않는다</h2>
        <QuestionLead question="Action-conditioned next state를 예측하면 robot action도 자동으로 결정될까?" answer="아니다. Planner에는 목표를 수치로 바꾸는 cost, 지켜야 할 constraint, 후보 action을 찾는 search와 일부 action 뒤 현실을 다시 보는 feedback가 필요하다. World model은 이 과정에서 후보 action의 결과를 계산하는 역할을 맡는다." />
        <ConceptPrimer items={[
          { term: 'Goal representation', meaning: '도달하려는 image·pose·language goal을 현재 state와 비교할 수 있게 바꾼 값이다.', why: '무엇을 성공으로 볼지 planner에 제공한다.' },
          { term: 'Cost J', meaning: 'Goal distance, energy, time, uncertainty와 위험을 action sequence별 숫자로 합친다.', why: '여러 predicted future 중 어떤 것을 선호하는지 정한다.' },
          { term: 'Search', meaning: '연속 action sequence를 sample·평가·수정해 낮은 cost 후보를 찾는다.', why: 'Neural dynamics가 있어도 최적 action은 별도 계산해야 한다.' },
          { term: 'Receding horizon', meaning: 'H step을 계획하되 첫 action만 실행하고 새 관측에서 다시 푼다.', why: 'Model error와 disturbance를 현실 feedback으로 주기적으로 고친다.' },
        ]} />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>같은 world model도 목적이 다르면 action이 달라진다. 컵을 goal 위치에 가장 빨리 놓으려는 cost, 흔들림을 줄이는 cost, table edge에서 멀어지는 safety cost는 서로 다른 trajectory를 고른다. 따라서 “model이 이해했다”는 문장 대신 predicted variable, cost와 executable constraint를 분리해 기록한다.</p>
          <p>Production robot에서는 high-level skill planner, collision-aware motion planner와 low-level feedback controller가 계층으로 나뉠 수 있다. Learned world model이 image-goal action을 고르더라도 torque limit, emergency stop과 contact stability를 대체하지 않는다.</p>
        </div>
        <Misconception>가장 높은 likelihood의 future가 가장 좋은 future는 아니다. Likelihood는 data에서 그럴듯한 정도이고, planner cost는 우리가 원하는 goal과 safety를 나타낸다.</Misconception>
      </section>

      <section id="goal-and-cost" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Goal image를 latent distance로 바꾸면 무엇이 빠질까?</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>V-JEPA 2-AC는 현재 frame과 goal image를 같은 encoder로 feature화한다. Candidate action sequence를 predictor 안에서 펼쳐 마지막 imagined latent가 goal latent와 가까워지는 sequence를 찾는다. 별도 task reward 없이 goal image만으로 reach, grasp와 pick-and-place를 계획할 수 있다는 장점이 있다.</p>
          <p>하지만 goal image는 모호하다. Cup이 goal pixel에 보이더라도 gripper가 놓았는지 아직 들고 있는지, cup이 table 위인지 공중인지, camera parallax 때문에 겹쳐 보이는지 latent distance가 구분하지 못할 수 있다. Goal은 visual target 하나가 아니라 pose tolerance, contact state와 forbidden region을 함께 가져야 한다.</p>
        </div>
        <Formula
          latex={String.raw`\begin{aligned}\underbrace{\hat z_{t+H}}_{\text{H-step 뒤 imagined state}}&=\underbrace{P_\phi(a_{t:t+H-1};z_t,s_t)}_{\text{현재 state에서 후보 행동열 rollout}}\\[0.45em]\underbrace{E_g(a_{t:t+H-1})}_{\text{goal energy}}&=\underbrace{\|\hat z_{t+H}-z_g\|_1}_{\text{예측 state와 goal latent 거리}}\end{aligned}`}
          meaning="현재 latent와 proprioception에서 후보 action sequence를 rollout하고 마지막 prediction을 goal image latent와 비교한다. 이 energy가 작으면 encoder가 보는 feature가 goal과 비슷하다는 뜻이며, physical success와 safety constraint는 별도 항으로 확인해야 한다."
          symbols={[[String.raw`P_\phi`, '학습된 action-conditioned predictor'], [String.raw`z_t`, '현재 camera observation의 latent'], [String.raw`s_t`, '현재 robot end-effector·proprioceptive state'], [String.raw`a_{t:t+H-1}`, '평가할 H-step action sequence'], [String.raw`z_g`, 'goal image의 latent representation'], [String.raw`E_g`, 'goal에 가까운 정도를 나타내는 energy']]} />
        <Formula
          latex={String.raw`\begin{aligned}\underbrace{U(a)}_{\text{rollout 불확실성}}&=\sum_{h=1}^{H}\underbrace{u_{t+h}}_{\text{h-step uncertainty}}\\[0.45em]\underbrace{J(a)}_{\text{planner의 총비용}}&=\underbrace{E_g(a)}_{\text{goal 거리}}+\underbrace{\lambda_u U(a)}_{\text{불확실성 벌점}}\\[-0.05em]&\qquad+\underbrace{I_{safe}(a)}_{\text{constraint 위반 비용}}\end{aligned}`}
          meaning="Goal distance만 최적화하면 search가 model이 자신 없어 하는 action이나 위험 영역을 이용할 수 있다. Uncertainty penalty는 모르는 미래를 피하게 하고 safety indicator는 workspace·collision·joint limit 위반 후보를 goal 점수와 무관하게 제거한다."
          symbols={[[String.raw`a`, '후보 H-step action sequence를 짧게 쓴 기호'], [String.raw`J`, '후보 action sequence의 전체 planning cost'], [String.raw`E_g`, 'goal latent distance'], [String.raw`U(a)`, 'rollout horizon의 uncertainty 합'], [String.raw`\lambda_u`, 'uncertainty를 얼마나 보수적으로 볼지 정하는 weight'], [String.raw`I_{safe}`, '안전 constraint를 통과하면 0, 위반하면 매우 큰 값']]} />
      </section>

      <section id="cem-search" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">CEM은 좋은 action 주변으로 sampling 분포를 좁힌다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>연속 7D action을 H step 나열하면 가능한 sequence는 무한하다. Cross-Entropy Method는 처음에 넓은 Gaussian proposal에서 여러 action sequence를 뽑고 world model로 cost를 계산한다. Cost가 낮은 elite만 남겨 각 시간·action dimension의 평균과 분산을 다시 계산한다. 이 과정을 반복하면 sample이 좋은 후보 주변으로 모인다.</p>
          <p>Gradient가 없어도 사용할 수 있고 discontinuous constraint를 넣기 쉽지만 sample 수 × refinement 수 × horizon만큼 world model rollout이 필요하다. V-JEPA 2-AC 공개 실험은 RTX 4090에서 800 sample, 10 refinement, horizon 1 설정으로 action 하나를 약 16초에 계획했다. 이는 latent prediction이 pixel generation baseline보다 빨랐다는 증거이지 realtime industrial control budget을 만족했다는 뜻은 아니다.</p>
        </div>
        <Formula
          latex={String.raw`\begin{aligned}\underbrace{a_i^{(r)}}_{\text{r번째 반복의 i번째 후보}}&\sim\underbrace{\mathcal N(\mu^{(r)},\operatorname{diag}((\sigma^{(r)})^2))}_{\text{현재 action proposal}}\\[0.45em]\underbrace{\mathcal E^{(r)}}_{\text{elite 후보 집합}}&=\underbrace{\operatorname{TopK}_{\text{lowest }J}\{a_i^{(r)}\}}_{\text{비용이 가장 낮은 K개}}\\[0.45em]\underbrace{\mu^{(r+1)},\sigma^{(r+1)}}_{\text{다음 proposal}}&=\underbrace{\operatorname{mean},\operatorname{std}(\mathcal E^{(r)})}_{\text{elite 주변으로 갱신}}\end{aligned}`}
          meaning="CEM은 후보 action sequence의 cost를 직접 미분하지 않고 elite sample의 통계로 다음 sampling 분포를 만든다. 분산이 너무 빨리 줄면 나쁜 local region에 갇히고, 너무 넓으면 compute를 낭비하므로 action bound, smoothing과 minimum variance를 함께 둔다."
          symbols={[[String.raw`r`, 'CEM refinement 반복 index'], [String.raw`a_i^{(r)}`, 'proposal에서 뽑은 i번째 H-step action sequence'], [String.raw`\mu^{(r)},\sigma^{(r)}`, '각 time·action dimension의 Gaussian 평균과 표준편차'], [String.raw`J`, 'goal·uncertainty·constraint를 합친 cost'], [String.raw`\mathcal E^{(r)}`, '다음 proposal을 만들 elite 후보 집합']]} />
        <Formula
          latex={String.raw`\underbrace{T_{wall}}_{\text{한 action의 예상 탐색 시간}}\approx\underbrace{\frac{N\,R\,H}{B_{eff}}}_{\text{병렬 처리 뒤 rollout 묶음 수}}\underbrace{t_{roll}}_{\text{묶음당 model 시간}}+\underbrace{t_{over}}_{\text{인코딩·선택·전송 시간}}`}
          meaning="Planning horizon만 늘리는 식으로 latency를 추정하면 CEM의 실제 비용을 놓친다. 후보 수 N, refinement 수 R와 horizon H가 rollout 수를 만들고, accelerator가 동시에 처리한 effective batch B_eff가 wall time을 줄인다. t_roll과 overhead는 model 이름에서 추측하지 않고 target device profiler로 측정한다."
          symbols={[[String.raw`T_{wall}`, '한 action을 고를 때까지의 wall-clock estimate'], [String.raw`N`, '각 refinement에서 평가할 후보 action sequence 수'], [String.raw`R`, 'elite 통계로 proposal을 다시 만드는 반복 수'], [String.raw`H`, '후보 하나를 상상할 transition 수'], [String.raw`B_{eff}`, 'memory와 kernel 효율을 포함한 실효 병렬 batch'], [String.raw`t_{roll}`, '실효 batch 하나를 rollout하는 측정 시간'], [String.raw`t_{over}`, 'observation encoding, elite selection과 host/device 전송 overhead']]} />
        <ClosedLoopPlannerExplorer />
      </section>

      <section id="mpc-belief" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">MPC는 긴 계획을 모두 믿지 않고 첫 행동 뒤 현실을 다시 본다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>CEM이 H-step sequence를 골라도 robot은 첫 action만 실행한다. 새 camera frame과 proprioception이 도착하면 latent state를 다시 만들고 후보를 다시 찾는다. 이 receding-horizon loop는 사람이 cup을 조금 밀었거나 gripper가 예상보다 미끄러진 disturbance를 다음 planning step에 반영한다.</p>
          <p>부분 관측에서는 재관측이 단순한 최신 image 교체가 아니다. 이전 belief와 action, 새 observation을 합쳐 hidden state 가능성을 다시 좁히는 과정이다. Replan period가 길면 compute는 줄지만 uncertainty가 오래 누적되고, 너무 짧으면 plan을 다 풀기 전에 sensor·actuator latency가 지배할 수 있다.</p>
        </div>
        <Formula
          latex={String.raw`\begin{aligned}\underbrace{a_{t:t+H-1}^*}_{\text{현재 관측에서 고른 행동열}}&=\arg\min_a\underbrace{J(a;z_t,b_t)}_{\text{goal·위험·belief 기반 비용}}\\[0.45em]\underbrace{a_t^{exec}}_{\text{실제로 보낼 command}}&=\underbrace{\operatorname{first}(a_{t:t+H-1}^*)}_{\text{첫 행동만 실행}}\\[0.45em]\underbrace{b_{t+1}}_{\text{새 state belief}}&\leftarrow\underbrace{\operatorname{Update}(b_t,a_t^{exec},o_{t+1})}_{\text{새 관측으로 갱신 뒤 재계획}}\end{aligned}`}
          meaning="Finite-horizon 최적화 결과 전체를 open loop로 실행하지 않고 첫 action만 actuator에 보낸다. 다음 observation으로 belief 또는 latent를 다시 계산해 같은 최적화를 반복한다. Safety controller는 이 planner 바깥에서도 command를 clamp하거나 emergency stop할 수 있어야 한다."
          symbols={[[String.raw`a_{t:t+H-1}^*`, '현재 step에서 찾은 최저-cost action sequence'], [String.raw`a_t^{exec}`, '실제 controller로 보낼 첫 action'], [String.raw`b_t,b_{t+1}`, '현재·다음 partial-observation belief'], [String.raw`o_{t+1}`, 'action 뒤 새 sensor observation'], [String.raw`J`, 'goal, uncertainty와 constraint를 포함한 planning cost']]} />
        <div className="not-prose my-8 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-4">
          {[
            ['01 · Observe', 'Camera·proprioception timestamp와 calibration version을 고정한다.'],
            ['02 · Imagine', 'Bound 안의 후보 action을 world model에서 짧게 rollout한다.'],
            ['03 · Filter', 'Collision, workspace와 uncertainty gate가 위험 후보를 제거한다.'],
            ['04 · Execute', '첫 action 뒤 실제 observation과 prediction residual을 기록한다.'],
          ].map(([title, body]) => <div key={title} className="min-h-32 bg-background p-4"><strong className="text-xs">{title}</strong><p className="mt-3 text-xs leading-relaxed text-muted-foreground">{body}</p></div>)}
        </div>
      </section>

      <section id="ambiguity-exploitation" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Planner는 world model의 맹점을 찾아내는 강한 adversary다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p><strong>Goal ambiguity</strong>는 cost가 성공 조건을 충분히 표현하지 못한 문제다. Cup의 image 위치만 맞으면 gripper가 cup을 잡고 있어도 성공으로 보거나, 실제 깊이가 달라도 2D projection이 같아질 수 있다. 해결하려면 pose, contact, task phase와 language constraint를 goal에 추가한다.</p>
          <p><strong>Model exploitation</strong>은 search가 dynamics model이 틀리는 action을 적극적으로 찾는 문제다. Training data 밖의 큰 movement를 넣었을 때 predictor가 goal에 순간이동한 latent를 내면 CEM은 낮은 cost 때문에 그 action을 선호한다. Action support bound, ensemble disagreement, short horizon과 real residual monitor로 막는다.</p>
          <p><strong>Sensor spoofing 또는 camera shift</strong>는 observation contract가 깨진 문제다. Image goal과 prediction이 둘 다 같은 encoder blind spot을 공유하면 latent distance만으로는 발견되지 않을 수 있다. Independent geometry check, proprioception과 workspace constraint를 함께 둔다.</p>
        </div>
        <Formula
          latex={String.raw`\underbrace{r_{t+1}}_{\text{현실과 model의 transition 잔차}}=\underbrace{\|E(o_{t+1})-\hat z_{t+1}\|}_{\text{새 관측 latent와 실행 전 예측의 차이}}`}
          meaning="Action을 실제로 실행한 뒤 얻은 observation latent와 실행 전에 예측한 next latent를 비교한다. Residual이 calibration slice의 threshold를 넘으면 다음 CEM step을 계속하지 않고 slow mode, fallback policy 또는 human intervention으로 전환한다."
          symbols={[[String.raw`E(o_{t+1})`, '실제 next observation을 encoder로 바꾼 latent'], [String.raw`\hat z_{t+1}`, '실행 전에 world model이 예측한 next latent'], [String.raw`r_{t+1}`, 'closed-loop transition residual']]} />
        <Misconception>Uncertainty가 낮다고 안전한 것은 아니다. Ensemble 전체가 같은 data bias를 공유할 수 있으므로 hard constraint와 real residual monitor를 uncertainty와 독립적으로 둔다.</Misconception>
      </section>

      <section id="evidence-release" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Demo에서 실제 release까지 증거의 층을 건너뛰지 않는다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Generated video demo는 visual plausibility를 보여 준다. Offline next-state benchmark는 held-out trajectory에서 prediction을 보여 준다. Model 안의 planning score는 optimizer가 cost를 낮출 수 있음을 보여 준다. 실제 robot closed-loop trial만 disturbance 뒤 recovery, actuator delay와 sensor shift까지 포함한 task success를 보여 준다.</p>
          <p>각 층은 아래 층을 무효화하지 않는다. Genie 3의 interactive demo는 visual world 연구에 중요한 증거이고, V-JEPA 2-AC의 robot execution은 latent planning의 별도 증거다. DreamZero의 7Hz real closed loop는 future video와 action을 함께 생성하는 direct policy의 증거다. 문제는 한 interface의 claim을 다른 planner 구조나 real safety까지 확대하는 것이다.</p>
        </div>
        <div className="not-prose my-8 divide-y divide-border border-y border-border">
          {[
            ['01', 'Generated demo', 'Prompt와 control에 반응하는 visual consistency', 'Metric state·repeatable task success는 아직 모름'],
            ['02', 'Offline prediction', 'Held-out one-step·multi-step latent 또는 video error', 'Search가 고른 action의 실제 결과는 아직 모름'],
            ['03', 'Planning replay', 'Recorded state에서 goal cost와 constraint 개선', '새 disturbance와 actuator delay recovery는 아직 모름'],
            ['04', 'Real closed loop', '실행·재관측·재계획을 포함한 task success와 near-miss', '새 robot·site로의 일반화는 별도 slice'],
            ['05', 'Release qualification', 'Camera shift, OOD action, latency, stop과 safety case', '운영 drift monitor와 rollback은 계속 필요'],
          ].map(([index, title, evidence, boundary]) => <div key={index} className="grid gap-2 py-5 sm:grid-cols-[3rem_10rem_minmax(0,1fr)_minmax(0,1fr)]"><span className="font-mono text-xs font-black text-muted-foreground">{index}</span><strong className="text-sm">{title}</strong><span className="text-xs leading-relaxed text-muted-foreground">{evidence}</span><span className="text-xs leading-relaxed text-rose-700 dark:text-rose-300">{boundary}</span></div>)}
        </div>
        <WorldModelReleaseGate />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>축소 실험은 범용 world generation이나 특정 parameter 수에서 시작하지 않는다. Pretrained encoder를 고정하고 target device에서 memory와 p95 latency를 직접 잴 수 있는 최소 predictor로 한 camera, 한 action space, 측정 가능한 tabletop state를 다룬다. Horizon 1/2/4, 후보 수, refinement, effective batch, planning latency와 real success를 함께 기록한다. V-JEPA 2의 약 300M predictor는 원문 재현값이지 모든 작은 실험의 기본 크기가 아니다.</p>
          <p>Camera가 바뀐 transfer에서는 먼저 <InternalLink slug="robot-camera-geometry-calibration">Camera Geometry · Calibration</InternalLink>으로 frame과 extrinsic을 검산한다. Learned rollout 뒤 실제 collision-free path와 controller가 필요하면 <InternalLink slug="robot-motion-planning">Robot Motion Planning</InternalLink>을 연다. Model-based RL의 Dreamer·MuZero 계보는 policy learning과 search target 비교가 필요할 때 <InternalLink slug="rl-model-based-world-models">Model-based RL</InternalLink>에서 선택적으로 읽는다.</p>
        </div>
        <StopRule>과거 world-model 논문을 모두 읽지 않는다. Goal, cost, search, constraint와 feedback을 분리하고 CEM/MPC trace와 real closed-loop gate를 만들 수 있으면 현재 연구를 구현할 최소 기반에 도달했다.</StopRule>
        <CapabilityCheck items={[
          'World model, goal representation, cost, constraint, search와 controller의 책임을 분리한다.',
          'CEM의 candidate sampling, elite selection과 mean·variance update를 실행 순서로 설명한다.',
          'H-step sequence를 계획해도 첫 action만 실행하고 새 관측에서 belief를 갱신한다.',
          'Goal ambiguity와 model exploitation을 서로 다른 failure로 진단한다.',
          'Uncertainty, hard constraint와 real transition residual을 독립 safety gate로 둔다.',
          'Generated demo에서 release qualification까지 각 증거가 허용하는 claim 범위를 구분한다.',
          'Target planning SLO에서 horizon, 후보 수, refinement, effective batch와 predictor latency를 함께 측정하는 실험을 설계한다.',
        ]} />
        <SourceNotes sources={[
          { label: 'Meta AI · V-JEPA 2 paper', href: 'https://ai.meta.com/research/publications/v-jepa-2-self-supervised-video-models-enable-understanding-prediction-and-planning/', note: 'Goal-latent energy, CEM, first-action MPC와 real robot planning time·success evidence의 1차 근거.' },
          { label: 'NVIDIA · Cosmos 3 technical report', href: 'https://research.nvidia.com/labs/cosmos-lab/cosmos3/technical-report.pdf', note: 'World generation, forward/inverse dynamics와 joint policy를 같은 multimodal model에서 구분하는 현재 근거.' },
          { label: 'DreamZero · World Action Models are Zero-shot Policies', href: 'https://arxiv.org/abs/2602.15922', note: '14B joint video/action model의 7Hz real closed-loop direct policy와 10–30분 adaptation 증거. CEM planner 구조로 확대하지 않는다.' },
          { label: 'Rubinstein · Cross-Entropy Method', href: 'https://doi.org/10.1016/S0377-2217(96)00385-2', note: 'Elite sample을 이용한 proposal distribution update의 고전적 근거. 필수 역사 경로로 확장하지 않는다.' },
          { label: 'Mayne et al. · Constrained MPC', href: 'https://doi.org/10.1016/S0005-1098(99)00214-9', note: 'Finite-horizon optimization, constraint와 receding-horizon 실행의 control 기준. Learned model의 정확성은 별도 검증한다.' },
          { label: 'Google DeepMind · Genie 3', href: 'https://deepmind.google/models/genie/', note: 'Interactive visual world가 보여 주는 증거와 공개 limitation의 비교 기준.' },
        ]} />
      </section>
    </>
  );
}

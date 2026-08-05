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
import { ActionDynamicsExplorer } from './world-model-core/viz/WorldModelExplorers';

function Formula({ latex, meaning, symbols }: { latex: string; meaning: string; symbols: [string, string][] }) {
  return <div className="not-prose my-7 min-w-0"><div className="min-w-0 rounded-md border border-border p-3 sm:p-4"><MathFormula display className="my-0 text-sm sm:text-base">{latex}</MathFormula></div><FormulaNote meaning={meaning} symbols={symbols} /></div>;
}

export default function ActionConditionedWorldDynamicsArticle() {
  return (
    <>
      <SpecialistEntry
        title="관찰한 video 표현에 robot action의 결과를 연결하는 글"
        description="장면이 어떻게 변하는지 표현하는 단계에서 한 걸음 더 나아가, 같은 현재 상태에 서로 다른 command를 넣었을 때 미래가 어떻게 갈라지는지 학습한다. Observation, latent와 hidden state가 낯설다면 아래 기반 글부터 읽는다."
        prerequisites={[
          'Camera image는 physical state 전체가 아니라 sensor observation이라는 점을 안다.',
          '여러 frame에서 미래에 필요한 latent representation을 학습할 수 있음을 안다.',
          'Robot action에는 좌표계, 단위와 실행 시각이 붙어야 함을 안다.',
        ]}
        links={[
          { slug: 'predictive-world-representations', title: 'Predictive world representation', reason: 'Observation, hidden state와 latent prediction의 차이부터 배운다.' },
          { slug: 'rl-pomdp-state-estimation', title: '부분 관측과 state estimation', reason: '한 장면만으로 보이지 않는 상태를 history와 belief로 다루는 기반을 잡는다.' },
        ]}
      />
      <section id="intervention-contract" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">World dynamics는 “무슨 일이 일어났나”에서 “무엇을 하면 달라지나”로 넘어간다</h2>
        <QuestionLead question="Video predictor가 다음 frame을 잘 맞히면 action-conditioned world model도 된 것일까?" answer="아니다. 후보 action마다 다른 미래를 비교하려면 transition이 action을 명시적으로 조건으로 받아야 한다. Action의 좌표·단위·실행 시점까지 정해져야 같은 숫자가 실제로 같은 intervention을 뜻한다." />
        <ConceptPrimer items={[
          { term: 'Forward dynamics', meaning: '현재 state와 action에서 다음 state 또는 observation을 예측한다.', why: '후보 action의 결과를 rollout해 planning cost를 계산한다.' },
          { term: 'Inverse dynamics', meaning: '두 state의 변화에서 그 변화를 만든 action을 추정한다.', why: 'Video trajectory에서 action label을 복원하거나 representation을 control과 연결한다.' },
          { term: 'World-action model', meaning: 'Future state와 action을 하나의 joint model 안에서 함께 생성한다.', why: 'Policy와 expected consequence를 같은 sequence contract로 묶는다.' },
          { term: 'Intervention data', meaning: 'Sensor observation과 실제 실행 action이 같은 clock에 기록된 trajectory다.', why: '상관된 motion cue가 아니라 action effect를 학습하는 근거가 된다.' },
        ]} />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Action-free video는 사람이 컵을 미는 장면에서 다음 motion을 예측할 수 있다. 하지만 robot이 왼쪽으로 4 cm 움직이는 command와 오른쪽으로 4 cm 움직이는 command를 넣었을 때 미래가 어떻게 갈라지는지는 action-labeled trajectory가 있어야 배운다.</p>
          <p>World model의 최소 test는 같은 현재 state에 서로 다른 action을 넣어 predicted next state가 control 방향과 일관되게 갈라지는지 확인하는 것이다. Data에 없던 큰 action에서도 그럴듯한 video를 만들 수 있다는 사실과 물리적으로 calibration된 결과를 내는 것은 다르다.</p>
        </div>
        <Formula
          latex={String.raw`\begin{aligned}\underbrace{z_{t+1}^{(1)}}_{\text{행동 1의 다음 state}}&\sim\underbrace{p_\theta(\,\cdot\mid z_t,a_t^{(1)})}_{\text{현재 state·행동 1 조건}}\\[0.45em]\underbrace{z_{t+1}^{(2)}}_{\text{행동 2의 다음 state}}&\sim\underbrace{p_\theta(\,\cdot\mid z_t,a_t^{(2)})}_{\text{같은 state·다른 행동 조건}}\end{aligned}`}
          meaning="현재 latent z_t를 고정하고 action만 바꾸었을 때 next-state distribution이 어떻게 달라지는지 비교한다. Action-conditioned dynamics의 핵심은 평균적인 다음 장면이 아니라 가능한 intervention 사이의 counterfactual 차이를 보존하는 것이다."
          symbols={[[String.raw`z_t`, '현재 observation에서 만든 latent state'], [String.raw`a_t^{(1)},a_t^{(2)}`, '같은 시점에 비교할 서로 다른 후보 action'], [String.raw`z_{t+1}^{(1)},z_{t+1}^{(2)}`, '각 action 아래의 예측 next state'], [String.raw`p_\theta`, 'action-conditioned transition distribution']]} />
      </section>

      <section id="coordinate-contract" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Action vector는 좌표·단위·시간이 붙어야 물리 명령이 된다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>“x 방향 +0.04”만 기록하면 meter인지 normalized range인지, robot base x인지 camera x인지, absolute pose인지 delta command인지 알 수 없다. Camera가 옆으로 이동하면 image의 오른쪽과 robot base의 오른쪽도 일치하지 않을 수 있다.</p>
          <p><strong>아래 식은 Cosmos 3의 표현 예다.</strong> Cosmos 3는 서로 다른 embodiment를 ego pose, effector pose와 grasp state의 공통 geometric component로 나눈다. Pose motion은 이전 pose에서 현재 pose로 가는 relative transform으로 만들고, robot·vehicle·egocentric domain마다 input/output projection을 따로 두면서 backbone을 공유한다. 이 3D translation+6D rotation+grasp 표현은 V-JEPA 2-AC의 7D DROID action과 다른 source contract다.</p>
        </div>
        <Formula
          latex={String.raw`\begin{aligned}\underbrace{\Delta T_t}_{\text{두 시점 사이 pose 변화}}&=\underbrace{T_{t-1}^{-1}T_t}_{\text{이전 좌표에서 본 현재 pose}}\\[0.45em]\underbrace{a_t}_{\text{학습할 action vector}}&=\left[\underbrace{\Delta p_t}_{\text{이동 m}},\underbrace{r_t^{(6)}}_{\text{회전 표현}},\underbrace{g_t}_{\text{gripper 상태}}\right]\end{aligned}`}
          meaning="Cosmos 3식 예에서는 absolute pose 두 개를 그대로 섞지 않고 이전 pose 기준의 relative transform을 만든다. Translation 3D, rotation representation 6D와 gripper state는 다른 단위와 의미를 가지므로 normalize 범위와 frame 이름을 metadata에 남긴다. 이 합계 10D 예를 V-JEPA 2-AC의 robot-base 기준 7D Euler state/action으로 옮겨 적으면 안 된다."
          symbols={[[String.raw`T_{t-1},T_t`, '같은 reference frame에서 표현한 연속 pose transform'], [String.raw`\Delta T_t`, '이전 pose에서 현재 pose로의 relative transform'], [String.raw`\Delta p_t`, '3차원 translation delta'], [String.raw`r_t^{(6)}`, 'rotation matrix로 복원 가능한 6D rotation representation'], [String.raw`g_t`, 'gripper open/close 또는 grasp state']]} />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>시간도 coordinate만큼 중요하다. Camera가 4fps이고 controller가 20Hz라면 video frame 사이에 action이 다섯 번 실행된다. 하나의 a_t가 마지막 command인지 평균인지 integrated delta인지 정하지 않으면 model은 blur와 delay를 action effect로 배운다. Sensor exposure time, proprioception sample, command issue와 actuator response를 하나의 monotonic clock으로 정렬한다.</p>
        </div>
        <Formula
          latex={String.raw`\underbrace{a_t^{frame}}_{\text{frame 사이 대표 action}}=\underbrace{\sum_{k:\,\tau_k\in(t-1,t]}a(\tau_k)\,\Delta\tau_k}_{\text{controller action을 시간 구간에 적분}}`}
          meaning="Video frame t-1과 t 사이의 여러 controller sample을 하나의 transition action으로 묶는 단순 예다. Velocity command면 시간 적분이 pose delta에 가깝고, absolute waypoint나 torque면 같은 합을 쓰면 안 된다. Command semantics에 맞는 aggregation을 명시한다."
          symbols={[[String.raw`a(\tau_k)`, 'controller clock τ_k에서 보낸 command'], [String.raw`\Delta\tau_k`, '해당 command가 유지된 시간'], [String.raw`a_t^{frame}`, '두 observation frame 사이 transition에 붙일 action'], [String.raw`t-1,t`, '연속 video observation의 시간 구간']]} />
      </section>

      <section id="generation-directions" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Forward·inverse·joint mode는 clean token과 예측 token이 다르다</h2>
        <p className="mb-5 max-w-3xl text-sm leading-relaxed text-muted-foreground">같은 trajectory를 보더라도 무엇을 관측으로 주고 무엇을 맞히게 하는지에 따라 학습 계약이 바뀐다. 다음 장면에서는 mode를 바꾸며 action과 visual token 중 어느 쪽이 입력이고 어느 쪽이 예측 대상인지 먼저 분리한다.</p>
        <ActionDynamicsExplorer />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p><strong>Forward dynamics</strong>는 clean action을 condition으로 받고 future visual 또는 latent state를 예측한다. “이 command를 실행하면 무엇이 될까?”에 답하므로 model-based planning에 직접 쓰인다.</p>
          <p><strong>Inverse dynamics</strong>는 연속 observation을 보고 그 사이 action을 예측한다. Demonstration video에서 control signal을 추정하거나 latent가 action-relevant motion을 보존하는지 확인할 수 있다. 하지만 여러 action이 같은 visual change를 만들 수 있어 답이 하나가 아닐 수 있다.</p>
          <p><strong>Joint policy mode</strong>는 future state와 action을 모두 noisy target으로 두고 함께 생성한다. Cosmos 3의 unified sequence에서는 이 세 방향을 clean/noisy token arrangement로 바꾼다. Direct VLA처럼 action만 생성하는지, action과 expected visual consequence를 함께 생성하는지 model card를 읽어 구분한다.</p>
        </div>
        <Misconception>Inverse dynamics가 action label을 잘 복원한다고 forward rollout이 정확한 것은 아니다. 두 conditional direction은 같은 joint data를 보더라도 loss와 uncertainty가 다르므로 각각 평가한다.</Misconception>
      </section>

      <section id="training-objectives" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Teacher forcing은 한 걸음, rollout loss는 자기 예측 이후를 가르친다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>V-JEPA 2-AC는 frozen V-JEPA 2 encoder가 frame마다 만든 feature map에 <strong>각각 7D인 action과 end-effector state</strong>를 시간 순서로 끼워 넣는다. State는 robot base 기준 position 3, extrinsic Euler orientation 3, gripper 1이고 action은 이웃 frame state의 차이다. Block-causal predictor는 현재까지의 실제 feature를 보고 다음 feature를 맞힌다. 이 teacher-forcing path는 어느 transition에서 틀렸는지 안정적으로 학습하기 좋다.</p>
          <p>Planning 때는 다음 실제 frame을 모른다. 첫 예측을 다음 입력으로 넣고 다시 예측해야 한다. 작은 오차가 다음 input distribution을 바꾸므로 one-step validation만 좋고 multi-step rollout은 무너질 수 있다. V-JEPA 2-AC는 짧은 autoregressive rollout loss를 함께 사용해 자기 예측을 본 뒤의 recovery를 학습한다.</p>
        </div>
        <Formula
          latex={String.raw`\begin{aligned}
\underbrace{e_t^{TF}}_{\text{한-step latent 오차}}
&=\|P_\phi(z_t,s_t,a_t)-z_{t+1}\|_1\\
\underbrace{\mathcal L_{TF}}_{\text{실제 state를 넣는 loss}}
&=\frac1T\sum_{t=1}^{T}e_t^{TF}\\
\underbrace{\hat z_{K+1}}_{\text{K-step imagined state}}
&=P_\phi^{(K)}(z_1,s_1,a_{1:K})\\
\underbrace{\mathcal L_{RO}}_{\text{자기 예측 rollout loss}}
&=\|\hat z_{K+1}-z_{K+1}\|_1
\end{aligned}`}
          meaning="Teacher forcing은 매 step 실제 encoder state를 입력으로 주지만 rollout은 predictor가 만든 state를 다음 step에 다시 사용한다. 두 항의 L1 거리는 latent 성분별 절댓값 오차를 더하므로, 큰 오차를 제곱하는 L2보다 한 성분의 극단값이 loss 전체를 지배하는 정도가 작다. 이는 V-JEPA 2-AC 원문의 loss 선택이며 모든 world model에 자동으로 맞는다는 뜻은 아니다. 원문은 teacher forcing T=15와 rollout T=2를 사용한다. 위 식의 K는 서로 다른 system을 비교하기 위한 일반 표기이며 원문 재현 수치는 별도 source page에서 고정한다."
          symbols={[[String.raw`P_\phi`, 'Action-conditioned predictor'], [String.raw`z_t,z_{t+1}`, '현재·다음 frame의 frozen encoder feature'], [String.raw`s_t`, '현재 end-effector state'], [String.raw`a_t`, 't에서 t+1로 가는 action'], [String.raw`P_\phi^{(K)}`, '예측 state를 되먹여 K step 펼친 predictor'], [String.raw`K`, 'rollout loss horizon']]} />
        <Formula
          latex={String.raw`\underbrace{\mathcal L_{dyn}}_{\text{전체 dynamics objective}}=\underbrace{\mathcal L_{TF}}_{\text{one-step 정확도}}+\underbrace{\lambda_{RO}\mathcal L_{RO}}_{\text{rollout 안정성 가중}}`}
          meaning="두 loss는 같은 문제가 아니다. 덧셈은 one-step 정확도와 자기 예측 뒤의 안정성을 하나의 scalar objective로 묶어 gradient가 두 경로 모두에서 오게 한다. λ_RO를 곱하면 rollout 항이 전체 update에 미치는 상대 크기를 조절할 수 있다. 이는 여러 dynamics system을 비교하기 위한 일반화 표기이며, V-JEPA 2-AC Equation 4는 별도 λ 없이 두 loss를 그대로 더한다."
          symbols={[[String.raw`\mathcal L_{TF}`, 'teacher-forced next-state loss'], [String.raw`\mathcal L_{RO}`, 'autoregressive multi-step rollout loss'], [String.raw`\lambda_{RO}`, 'rollout 안정성의 상대 가중치']]} />
      </section>

      <section id="uncertainty-ood" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">한 next state가 아니라 가능한 미래와 모르는 영역을 남긴다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>가려진 물체가 어느 쪽으로 미끄러질지, gripper contact가 성공할지처럼 같은 state와 action에서도 여러 결과가 가능하다. Deterministic L1 predictor는 가능한 미래의 중앙을 내놓을 수 있고, 그 중앙이 실제로는 존재하지 않는 state일 수 있다. Stochastic latent, ensemble 또는 distributional head로 future uncertainty를 남긴다.</p>
          <p>더 위험한 것은 data 밖 action이다. Teleoperation data가 작은 4 cm 이동만 포함했는데 planner가 20 cm action을 제안하면 model은 근거 없는 extrapolation을 할 수 있다. Action prior, workspace constraint와 uncertainty threshold로 search 범위를 제한하고, calibration split에는 새로운 camera·gripper·object를 따로 둔다.</p>
        </div>
        <Formula
          latex={String.raw`\begin{aligned}\underbrace{\bar z_{t+1}}_{\text{ensemble 평균 미래}}&=\frac1M\sum_{m=1}^{M}\underbrace{\hat z_{t+1}^{(m)}}_{\text{m번째 dynamics 예측}}\\[0.45em]\underbrace{u_t}_{\text{model disagreement}}&=\frac1M\sum_{m=1}^{M}\underbrace{\|\hat z_{t+1}^{(m)}-\bar z_{t+1}\|_2^2}_{\text{평균에서 벗어난 정도}}\end{aligned}`}
          meaning="같은 state와 action을 여러 dynamics model에 넣어 예측이 얼마나 갈리는지 보는 간단한 epistemic uncertainty proxy다. 평균과의 L2 거리를 제곱하면 큰 이탈에 더 큰 값을 주고, ensemble prediction의 분산과 같은 형태로 disagreement를 읽을 수 있다. Ensemble이 모두 같은 bias를 가지면 u_t가 작아도 틀릴 수 있으므로 OOD action distance와 real calibration error를 함께 본다."
          symbols={[[String.raw`M`, '서로 다른 seed·bootstrap으로 학습한 dynamics 수'], [String.raw`\hat z_{t+1}^{(m)}`, 'm번째 model의 next-state prediction'], [String.raw`\bar z_{t+1}`, 'ensemble 평균 prediction'], [String.raw`u_t`, 'model 사이 disagreement로 본 uncertainty']]} />
      </section>

      <section id="transfer-evidence" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">새 camera·gripper로 옮길 때 무엇을 먼저 다시 맞출까?</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>첫째, camera extrinsic과 timestamp를 다시 측정한다. 둘째, 새 gripper action을 기존 effector pose와 grasp state contract에 매핑하고 unit range를 검증한다. 셋째, 5시간 data를 무작위 frame으로 나누지 않고 episode·object·view 단위 holdout으로 나눈다. 같은 trajectory의 이웃 frame이 train과 test에 섞이면 transfer 성능이 부풀려진다.</p>
          <p>넷째, pretrained encoder를 먼저 고정하고 작은 predictor와 domain projection만 학습한다. Representation probe와 one-step dynamics가 모두 무너지면 visual adaptation을 열고, one-step은 되지만 rollout만 무너지면 rollout objective와 action coverage를 고친다. 마지막으로 planner가 제안할 action 범위를 5시간 data support 안에서 시작한다.</p>
          <p>V-JEPA 2의 실제 7D action, T=15/2 loss, image-goal CEM과 두 lab 영수증은 <InternalLink slug="paper-vjepa2-2025">V-JEPA 2 원문 재구성</InternalLink>에서 검산한다. 이 dynamics가 일반적인 실제 행동을 고르는 과정은 <InternalLink slug="world-model-planning-closed-loop">World Model Planning · Closed Loop</InternalLink>에서 CEM, MPC, goal ambiguity와 release gate로 이어진다.</p>
        </div>
        <StopRule>모든 causal inference와 robot dynamics 논문을 먼저 읽지 않는다. Action의 frame·unit·time, forward/inverse/joint direction, teacher forcing과 rollout distribution 차이를 설명하고 OOD action을 막을 수 있으면 planning으로 올라간다.</StopRule>
        <CapabilityCheck items={[
          '같은 state에서 action만 바꾸어 next-state distribution을 비교한다.',
          'Camera, robot base와 end-effector frame을 구분하고 relative pose action을 계산한다.',
          'Video fps와 controller rate가 다를 때 transition action의 aggregation 의미를 정한다.',
          'Forward dynamics, inverse dynamics와 joint world-action mode의 clean·predicted token을 배치한다.',
          'Teacher forcing과 own-prediction rollout의 입력 분포 차이와 두 loss의 역할을 설명한다.',
          '새 camera·gripper에서 visual shift, calibration, uncertainty와 action support를 독립 측정한다.',
        ]} />
        <SourceNotes sources={[
          { label: 'NVIDIA · Cosmos 3 technical report', href: 'https://research.nvidia.com/labs/cosmos-lab/cosmos3/technical-report.pdf', note: 'Domain-aware action projection, relative pose representation과 forward·inverse·joint generation mode의 1차 근거.' },
          { label: 'Meta AI · V-JEPA 2 paper', href: 'https://ai.meta.com/research/publications/v-jepa-2-self-supervised-video-models-enable-understanding-prediction-and-planning/', note: 'Frozen encoder, DROID action/end-effector interleave, block-causal predictor와 teacher-forcing·rollout loss의 공식 근거.' },
          { label: 'DROID dataset', href: 'https://droid-dataset.github.io/', note: '다양한 scene와 teleoperation robot trajectory의 observation·action data contract.' },
        ]} />
      </section>
    </>
  );
}

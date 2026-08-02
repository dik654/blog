import { motion } from 'framer-motion';
import { ArrowDown, ArrowRight, CheckCircle2, CircleDot, Sigma, Sparkles } from 'lucide-react';
import StepViz, { type StepDef } from '@/components/ui/step-viz';

type Tone = 'emerald' | 'sky' | 'violet' | 'orange';

interface SequenceStep {
  label: string;
  body: string;
  input: string;
  operation: string;
  output: string;
  invariant: string;
  metrics: Array<{ label: string; value: string }>;
}

const toneClasses: Record<Tone, { ink: string; soft: string; border: string; dot: string }> = {
  emerald: {
    ink: 'text-emerald-700 dark:text-emerald-300',
    soft: 'bg-emerald-500/[0.055]',
    border: 'border-emerald-600/30',
    dot: 'bg-emerald-600',
  },
  sky: {
    ink: 'text-sky-700 dark:text-sky-300',
    soft: 'bg-sky-500/[0.055]',
    border: 'border-sky-600/30',
    dot: 'bg-sky-600',
  },
  violet: {
    ink: 'text-violet-700 dark:text-violet-300',
    soft: 'bg-violet-500/[0.055]',
    border: 'border-violet-600/30',
    dot: 'bg-violet-600',
  },
  orange: {
    ink: 'text-orange-700 dark:text-orange-300',
    soft: 'bg-orange-500/[0.055]',
    border: 'border-orange-600/30',
    dot: 'bg-orange-600',
  },
};

function SequenceStage({ steps, step, tone }: { steps: SequenceStep[]; step: number; tone: Tone }) {
  const current = steps[step];
  const colors = toneClasses[tone];
  const flow = [
    { label: 'INPUT', value: current.input, kind: 'input' },
    { label: 'OPERATION', value: current.operation, kind: 'operation' },
    { label: 'OUTPUT', value: current.output, kind: 'output' },
  ];

  return (
    <div className="w-full min-w-0">
      <div className="mb-5 flex flex-wrap gap-2" aria-label="전체 계산 단계">
        {steps.map((item, index) => {
          const active = index === step;
          const complete = index < step;
          return (
            <div key={item.label} className={`min-w-[7.5rem] flex-1 border-l-2 px-3 py-1.5 ${active ? `${colors.border} ${colors.soft}` : complete ? 'border-foreground/35' : 'border-border'}`}>
              <div className="flex items-center gap-2">
                <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${active ? colors.dot : complete ? 'bg-foreground/50' : 'bg-border'}`} />
                <span className="font-mono text-[10px] font-bold text-muted-foreground">{String(index + 1).padStart(2, '0')}</span>
              </div>
              <p className={`mt-1 text-xs font-semibold leading-snug ${active ? 'text-foreground' : 'text-muted-foreground'}`}>{item.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_15rem]">
        <div className="min-w-0 border-y border-border/70 py-4">
          <div className="grid min-w-0 gap-2 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-stretch">
            {flow.map((item, index) => (
              <div key={item.kind} className="contents">
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.09, duration: 0.25 }}
                  className={`min-w-0 border p-3.5 ${item.kind === 'operation' ? `${colors.border} ${colors.soft}` : item.kind === 'output' ? 'border-emerald-600/25 bg-emerald-500/[0.035]' : 'border-border bg-background'}`}
                >
                  <div className="flex items-center gap-2">
                    {item.kind === 'operation' ? <Sigma className={`h-3.5 w-3.5 ${colors.ink}`} aria-hidden="true" /> : item.kind === 'output' ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-300" aria-hidden="true" /> : <CircleDot className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />}
                    <p className="font-mono text-[10px] font-black text-muted-foreground">{item.label}</p>
                  </div>
                  <p className="mt-3 break-words font-mono text-sm font-bold leading-relaxed [overflow-wrap:anywhere]">{item.value}</p>
                </motion.div>
                {index < flow.length - 1 && <div className="flex items-center justify-center py-1 text-muted-foreground"><ArrowRight className="hidden h-4 w-4 sm:block" aria-hidden="true" /><ArrowDown className="h-4 w-4 sm:hidden" aria-hidden="true" /></div>}
              </div>
            ))}
          </div>
          <motion.p key={current.invariant} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 flex min-w-0 items-start gap-2 text-xs leading-relaxed text-muted-foreground">
            <Sparkles className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${colors.ink}`} aria-hidden="true" />
            <span><strong className="text-foreground">이 장면의 핵심:</strong> {current.invariant}</span>
          </motion.p>
        </div>

        <div className="grid content-start gap-px overflow-hidden border border-border bg-border">
          {current.metrics.map((metric, index) => (
            <motion.div key={metric.label} initial={{ opacity: 0, x: 7 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.14 + index * 0.08 }} className="min-w-0 bg-background p-4">
              <p className="text-[11px] font-semibold text-muted-foreground">{metric.label}</p>
              <p className={`mt-1 break-words font-mono text-lg font-black leading-tight [overflow-wrap:anywhere] ${index === 0 ? colors.ink : ''}`}>{metric.value}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AnimatedSequence({ steps, tone }: { steps: SequenceStep[]; tone: Tone }) {
  const definitions: StepDef[] = steps.map(({ label, body }) => ({ label, body }));
  return <StepViz steps={definitions}>{(step) => <SequenceStage steps={steps} step={step} tone={tone} />}</StepViz>;
}

export function BellmanBackupSequenceViz() {
  const steps: SequenceStep[] = [
    { label: '현재 state를 고정한다', body: '아직 value를 모르지만 state와 가능한 action의 경계를 먼저 정한다.', input: 's = 현재 위치·속도', operation: 'A(s) = {safe, risk}', output: 'Vπ(s) = ?', invariant: 'State가 충분해야 이후 transition 평균도 의미가 있다.', metrics: [{ label: '알고 있는 것', value: 's, A, γ=0.9' }, { label: '구할 것', value: 'Vπ(s)' }] },
    { label: 'Policy가 행동 확률을 낸다', body: 'Policy evaluation은 행동 하나를 고르지 않고 현재 policy의 확률로 평균한다.', input: 'π(safe|s)=0.50', operation: 'Σa π(a|s) · backup', output: 'π(risk|s)=0.50', invariant: 'Expectation 식의 첫 합은 agent policy의 불확실성이다.', metrics: [{ label: 'Policy 질량', value: '0.50 + 0.50' }, { label: '검사', value: '= 1.00' }] },
    { label: '환경 결과를 action별로 평균한다', body: '각 행동에서 reward와 next value를 transition 확률로 먼저 접는다.', input: 'safe: 1 + 0.9×2', operation: 'risk: .35×5.9 + .65×(-2)', output: 'Bsafe=2.80 · Brisk=0.765', invariant: '환경 평균과 policy 평균은 서로 다른 두 확률층이다.', metrics: [{ label: 'Safe backup', value: '2.800' }, { label: 'Risk backup', value: '0.765' }] },
    { label: '평균과 max가 다른 질문에 답한다', body: '현재 policy를 평가하면 평균하고, 최적 policy를 찾으면 가장 큰 action backup을 고른다.', input: '.5×2.80 + .5×0.765', operation: 'expectation ↔ optimality', output: 'Vπ=1.783 · V*=2.800', invariant: '같은 action backup도 policy evaluation과 control에서 결합 연산이 달라진다.', metrics: [{ label: 'Policy value', value: '1.783' }, { label: 'Optimal value', value: '2.800' }] },
  ];
  return <AnimatedSequence steps={steps} tone="emerald" />;
}

export function DqnLearningSequenceViz() {
  const steps: SequenceStep[] = [
    { label: 'Replay에서 transition을 뽑는다', body: '연속 trajectory를 그대로 쓰지 않고 과거 경험을 섞어 sample correlation을 낮춘다.', input: '(s, a, r=1, s′, terminated=0)', operation: 'sample ~ replay D', output: 'mini-batch transition', invariant: 'Replay는 target을 고정하지 않고 데이터의 시간 상관을 줄인다.', metrics: [{ label: 'Termination', value: 'terminated = 0' }, { label: 'Online prediction', value: 'Q(s,a)=1.40' }] },
    { label: '진짜 종료 gate를 적용한다', body: '목표 달성·실패로 끝난 terminal이면 미래 value를 끊는다. Time-limit truncation은 next state가 유효하면 bootstrap한다.', input: 'terminated = 0', operation: 'm = 1-terminated', output: 'bootstrap gate m = 1', invariant: 'Termination mask는 환경 밖 시간 제한과 목표 자체의 종료를 구분해야 한다.', metrics: [{ label: 'Gate', value: 'm = 1' }, { label: 'Discount', value: 'γ = 0.90' }] },
    { label: 'Target network로 우변을 만든다', body: '일정 기간 고정한 network가 next-state 최대 Q를 평가해 moving target의 속도를 늦춘다.', input: 'max Qθ⁻(s′,a′)=2.10', operation: 'Y = 1 + .9×1×2.1', output: 'Y = 2.89', invariant: 'Online network가 맞출 값과 target을 계산하는 network의 책임을 분리한다.', metrics: [{ label: 'Target', value: '2.890' }, { label: 'TD error', value: '2.89-1.40=1.49' }] },
    { label: 'Residual만큼 online Q를 갱신한다', body: 'Target은 잠시 고정되고 gradient는 현재 Q prediction 쪽으로만 흐른다.', input: 'Q=1.40 · δ=1.49', operation: 'Q ← Q + 0.1δ', output: 'Qnew = 1.549', invariant: 'Loss 감소와 environment return 증가는 별도 지표로 확인해야 한다.', metrics: [{ label: 'Updated Q', value: '1.549' }, { label: 'Target은 유지', value: 'Y = 2.890' }] },
  ];
  return <AnimatedSequence steps={steps} tone="sky" />;
}

export function ActorCriticSequenceViz() {
  const steps: SequenceStep[] = [
    { label: 'Actor가 rollout을 만든다', body: '현재 policy가 action을 sample하므로 이 trajectory가 update의 data distribution이 된다.', input: 'sₜ · πθ(a|s)', operation: 'aₜ ~ πθ', output: 'r=0.4 · sₜ₊₁', invariant: 'Actor는 예측기이면서 다음 학습 데이터를 만드는 behavior policy다.', metrics: [{ label: '선택 log-prob', value: '-0.70' }, { label: 'Reward', value: '0.40' }] },
    { label: 'Critic이 한-step residual을 계산한다', body: 'Reward와 next value로 target을 만들고 현재 value prediction과 비교한다.', input: 'V(sₜ)=1.20 · V(sₜ₊₁)=1.40', operation: 'δ=.4+.9×1.4-1.2', output: 'δₜ = 0.46', invariant: 'Critic은 정답 policy를 내지 않고 actor가 사용할 상대적 credit을 추정한다.', metrics: [{ label: 'Critic target', value: '1.660' }, { label: 'TD residual', value: '+0.460' }] },
    { label: 'Advantage가 행동의 상대 책임을 만든다', body: '양의 advantage는 같은 state의 평균보다 이번 선택이 나았다는 뜻이다.', input: 'local δₜ = +0.46', operation: 'GAE: Σ(γλ)ˡδₜ₊ₗ', output: 'Âₜ > 0', invariant: 'State 자체의 난이도를 빼야 선택 행동의 방향 신호가 선명해진다.', metrics: [{ label: 'Advantage sign', value: 'positive' }, { label: 'Credit horizon', value: 'γλ가 결정' }] },
    { label: 'Actor와 critic을 다른 loss로 갱신한다', body: 'Actor는 log-probability에 advantage를 곱하고 critic은 return target에 value를 회귀한다.', input: 'logπ=-.70 · Â=.46', operation: 'actor ↑ · critic MSE ↓', output: 'πθ′ · Vφ′', invariant: '두 loss가 encoder를 공유하면 gradient 충돌과 scale도 함께 관측해야 한다.', metrics: [{ label: 'Actor 방향', value: '선택 확률 ↑' }, { label: 'Critic 방향', value: 'V(sₜ) → 1.66' }] },
  ];
  return <AnimatedSequence steps={steps} tone="violet" />;
}

export function PpoIterationSequenceViz() {
  const steps: SequenceStep[] = [
    { label: 'Old policy로 rollout을 고정한다', body: 'Update 전에 state, action, reward와 old log-probability를 저장한다.', input: 'πold(a|s)=0.40', operation: 'environment rollout', output: 'fixed buffer Dπold', invariant: '이 iteration의 분포 기준은 rollout을 만든 old policy다.', metrics: [{ label: 'Old probability', value: '0.400' }, { label: 'Buffer 상태', value: 'collecting' }] },
    { label: 'Return과 GAE를 역순 계산한다', body: '마지막 state를 bootstrap한 뒤 미래 TD residual을 현재 action의 credit으로 접는다.', input: 'r, done, Vold', operation: 'reverse GAE scan', output: 'Â=+0.80 · R̂=2.10', invariant: 'Buffer 값은 update epoch 동안 다시 환경에서 계산하지 않는다.', metrics: [{ label: 'Advantage', value: '+0.800' }, { label: 'Value target', value: '2.100' }] },
    { label: '새 policy의 ratio를 측정한다', body: 'Stored old probability와 현재 probability를 나눠 선택 action이 얼마나 변했는지 본다.', input: 'πθ(a|s)=0.52', operation: 'r = .52 / .40', output: 'ratio = 1.30', invariant: 'Ratio는 parameter 변화율이 아니라 선택 action 확률의 변화 비다.', metrics: [{ label: 'Raw surrogate', value: '1.30×.80=1.04' }, { label: 'Clip ε', value: '0.20' }] },
    { label: '과도한 improvement를 clip한다', body: 'Positive advantage에서 1+ε를 넘은 추가 objective를 제거해 더 보수적인 값을 쓴다.', input: 'raw=1.04 · clipped=.96', operation: 'min(raw, clipped)', output: 'Lclip sample = 0.96', invariant: 'Clip은 global KL을 보장하지 않으므로 KL과 clip fraction을 별도로 본다.', metrics: [{ label: '선택 surrogate', value: '0.960' }, { label: 'Ratio 경계', value: '[0.8, 1.2]' }] },
    { label: '여러 epoch 뒤 policy를 갱신한다', body: 'Actor·critic update와 KL early stop을 마치면 current policy를 다음 rollout 기준으로 교체한다.', input: 'K mini-batch epochs', operation: 'θ,φ update · KL check', output: 'πold ← πθ', invariant: '새 data distribution은 update가 끝난 뒤 다음 rollout에서만 생성된다.', metrics: [{ label: 'Approx. KL', value: 'monitor' }, { label: '다음 상태', value: 'new rollout' }] },
  ];
  return <AnimatedSequence steps={steps} tone="orange" />;
}

export function OfflineLearningSequenceViz() {
  const steps: SequenceStep[] = [
    { label: 'Expert trajectory를 기록한다', body: 'Expert action은 현재 state뿐 아니라 다음에 어떤 state가 dataset에 들어오는지도 결정한다.', input: 'pi* executes task', operation: 'log (s_t, a*_t)', output: 'D_E: expert states', invariant: 'Demonstration은 독립 sample의 bag이 아니라 한 behavior policy가 만든 trajectory다.', metrics: [{ label: 'State 출처', value: 'd_pi*' }, { label: 'Label 출처', value: 'pi*(s)' }] },
    { label: 'Behavior cloning으로 action을 맞춘다', body: 'Expert state에서 negative log-likelihood를 낮추지만 learner state는 아직 training input에 없다.', input: '(s,a*) ~ D_E', operation: 'min -log pi_theta(a*|s)', output: 'BC policy pi_theta', invariant: '낮은 supervised loss는 expert distribution에서의 local action match다.', metrics: [{ label: 'Open-loop error', value: 'epsilon = 2%' }, { label: 'Closed-loop', value: '아직 미측정' }] },
    { label: 'Learner rollout이 분포를 바꾼다', body: '작은 steering error가 expert가 방문하지 않은 edge state를 만들고 다음 error 확률을 키운다.', input: 's_t ~ d_pi_theta', operation: 'a_t changes s_{t+1}', output: 'OOD recovery state', invariant: 'Sequential error의 핵심은 횟수 누적보다 다음 입력 분포의 변화다.', metrics: [{ label: 'Horizon', value: 'T = 100' }, { label: 'P(any error)', value: '86.7%' }] },
    { label: 'Query 가능성에 따라 갈라진다', body: '현재 state에서 expert를 다시 부를 수 있으면 DAgger, 아무 interaction도 못 하면 offline learning 문제다.', input: 'learner-induced state', operation: 'expert query? yes / no', output: 'DAgger / static D', invariant: 'Algorithm 선택은 model architecture보다 새 label·reward를 얻을 수 있는가에서 갈린다.', metrics: [{ label: 'Online query', value: 'DAgger' }, { label: 'Static only', value: 'Offline RL' }] },
    { label: 'Coverage에 맞는 objective를 고른다', body: 'DAgger는 recovery label을 누적하고, CQL은 OOD Q를 낮추며, DT는 return으로 dataset behavior를 조건화한다.', input: 'coverage + reward + query', operation: 'aggregate / pessimism / sequence', output: 'deployable baseline', invariant: '모든 방법은 결국 deployment distribution과 training evidence의 간격을 다르게 줄인다.', metrics: [{ label: '검증 1', value: 'closed-loop success' }, { label: '검증 2', value: 'support gap' }] },
  ];
  return <AnimatedSequence steps={steps} tone="violet" />;
}

export function WorldModelSequenceViz() {
  const steps: SequenceStep[] = [
    { label: '실제 환경에서 한 번 관측한다', body: 'Action을 실제로 실행한 transition만이 model과 value를 현실에 고정하는 evidence다.', input: 's_t, a_t', operation: 'environment step', output: 'r_t, s_{t+1}', invariant: 'Real transition과 imagined transition은 tensor shape가 같아도 증거의 강도가 다르다.', metrics: [{ label: 'Real interaction', value: '1 step' }, { label: '확인된 결과', value: 'r, s_next' }] },
    { label: 'Value와 model을 함께 갱신한다', body: 'Real transition으로 direct TD update를 하고 같은 sample로 action-conditioned model을 fit한다.', input: '(s,a,r,s_next)', operation: 'Q update + M fit', output: 'Q_theta, M_psi', invariant: 'Value는 return을, model은 action 뒤의 transition structure를 학습한다.', metrics: [{ label: 'Direct backup', value: '1' }, { label: 'Model target', value: 'r, s_next' }] },
    { label: 'Model에서 가상 transition을 만든다', body: '과거 state-action을 sample하고 predicted reward와 next state를 생성한다.', input: '(s_bar,a_bar)', operation: 'M_psi(s_bar,a_bar)', output: '(r_hat,s_hat_next)', invariant: 'Planning compute는 새 현실 data가 아니라 현재 model assumption의 재사용이다.', metrics: [{ label: 'Planning updates', value: 'n times' }, { label: 'Data source', value: 'learned model' }] },
    { label: '같은 learning rule로 planning한다', body: 'Generated transition에 direct learner와 같은 Bellman update를 적용해 value를 빠르게 전파한다.', input: 'r_hat + gamma max Q', operation: 'simulated TD backup', output: 'reactive Q improves', invariant: 'Model accuracy가 높으면 sample efficiency가 늘고 낮으면 bias가 같은 속도로 증폭된다.', metrics: [{ label: '이득', value: 'reward propagation' }, { label: '위험', value: 'model bias' }] },
    { label: '실제 rollout gap으로 다시 검증한다', body: 'One-step loss만 보지 않고 optimized policy의 predicted return과 real return을 비교한다.', input: 'policy optimized in M', operation: 'real environment evaluation', output: 'prediction-real gap', invariant: 'World model의 최종 단위 test는 보기 좋은 reconstruction이 아니라 decision transfer다.', metrics: [{ label: 'Model 지표', value: 'multi-step error' }, { label: 'Policy 지표', value: 'real return gap' }] },
  ];
  return <AnimatedSequence steps={steps} tone="sky" />;
}

export function SafeRlSequenceViz() {
  const steps: SequenceStep[] = [
    { label: 'Reward와 safety cost를 따로 기록한다', body: '같은 transition에서 task 성능과 위험을 서로 다른 signal로 남기고 cost budget의 단위를 고정한다.', input: 's_t, a_t, s_{t+1}', operation: 'measure r_t and c_t', output: 'task log + safety ledger', invariant: 'Safety cost를 reward 안에 숨기면 성능과 위반의 교환비를 감사할 수 없다.', metrics: [{ label: 'Task signal', value: 'r_t = speed' }, { label: 'Constraint signal', value: 'c_t = collision' }] },
    { label: '현재 policy의 두 return을 추정한다', body: 'On-policy rollout에서 reward advantage와 cost advantage를 별도로 계산한다.', input: 'trajectories ~ pi_k', operation: 'estimate J_R, J_C, A_R, A_C', output: 'reward and cost gradients', invariant: '높은 reward rollout이 feasible rollout과 같은 표본 집합이라는 보장은 없다.', metrics: [{ label: 'Reward return', value: 'J_R = 84.2' }, { label: 'Cost vs budget', value: '0.34 > 0.30' }] },
    { label: '제약된 local update를 푼다', body: 'Reward gradient를 따르되 cost boundary와 KL trust region 안에 있는 parameter step을 찾는다.', input: 'g, b, c, H, delta', operation: 'solve constrained QCQP', output: 'candidate Delta theta', invariant: 'CPO의 update는 expected cost의 local surrogate를 제한하며 hard collision을 직접 차단하지 않는다.', metrics: [{ label: 'Cost slack', value: 'c = +0.04' }, { label: 'Update mode', value: 'recovery direction' }] },
    { label: '배포 action의 future risk를 검사한다', body: 'Task policy가 낸 action을 바로 실행하지 않고 safety critic의 calibrated risk와 threshold를 비교한다.', input: 'a_task ~ pi_task(s)', operation: 'Q_risk(s,a_task) <= epsilon?', output: 'safe set or recovery set', invariant: 'Critic의 false negative는 shield가 보지 못하는 위험이므로 coverage와 time-to-collision로 측정한다.', metrics: [{ label: 'Predicted risk', value: '0.18' }, { label: 'Threshold', value: '0.10' }] },
    { label: 'Recovery가 실행하고 독립 제한이 받친다', body: 'Risk가 높으면 recovery action을 actuator로 보내고, speed limit과 emergency stop은 learned policy와 별도로 남긴다.', input: 'recovery set detected', operation: 'a_exec = a_rec + interlocks', output: 'safe-region transition', invariant: '학습 safety, runtime shield, hardware interlock은 한 층의 성능으로 서로 대체하지 않는다.', metrics: [{ label: 'Executed policy', value: 'pi_rec' }, { label: 'Audit log', value: 'handoff + latency' }] },
  ];
  return <AnimatedSequence steps={steps} tone="orange" />;
}

export function PomdpBeliefSequenceViz() {
  const steps: SequenceStep[] = [
    { label: 'Latent state가 observation을 낸다', body: 'World state에는 위치와 속도가 있지만 agent는 sensor model을 통과한 일부 evidence만 받는다.', input: 's_t = position + velocity', operation: 'o_t ~ O(s_t)', output: 'camera: same-looking row', invariant: 'Observation tensor가 크더라도 hidden cause와 같은 것은 아니다.', metrics: [{ label: 'True state', value: 'hidden from agent' }, { label: 'Observed frame', value: 'junction pattern' }] },
    { label: 'Action으로 prior belief를 예측한다', body: '이전 posterior의 probability mass를 action-conditioned transition으로 next state들에 옮긴다.', input: 'b_t(s), a_t = forward', operation: 'sum_s T(s,a,s_next)b_t(s)', output: 'predicted belief b_bar', invariant: 'Observation을 보기 전에 motion model과 process uncertainty가 belief를 먼저 바꾼다.', metrics: [{ label: 'P(row A)', value: '0.58' }, { label: 'P(row B)', value: '0.42' }] },
    { label: 'Sensor likelihood로 posterior를 보정한다', body: '새 observation이 각 candidate state에서 나올 가능성을 prior mass에 곱하고 정규화한다.', input: 'b_bar + o_{t+1}', operation: 'O(s_next,a,o) times b_bar', output: 'posterior b_{t+1}', invariant: '같은 observation도 prior와 sensor calibration이 다르면 다른 posterior를 만든다.', metrics: [{ label: 'Normalization', value: 'P(o)=0.61' }, { label: 'P(row A | o)', value: '0.81' }] },
    { label: 'Policy가 belief에서 행동한다', body: '가장 가능성 높은 state 하나가 아니라 uncertainty 전체를 보고 이동·감속·추가 sensing을 비교한다.', input: 'b_{t+1}', operation: 'argmax_a Q(b,a)', output: 'slow + camera pan', invariant: 'Information action은 즉시 progress가 작아도 다음 belief를 개선해 long-term value를 높일 수 있다.', metrics: [{ label: 'Belief entropy', value: '0.70 bits' }, { label: 'Chosen mode', value: 'sense then act' }] },
    { label: 'Estimator와 policy를 따로 감사한다', body: 'Sensor health, innovation, belief calibration, action confidence와 physical stopping margin을 한 timeline에 기록한다.', input: 'o, b, a_task, a_exec', operation: 'attribute failure by layer', output: 'estimator / policy / physics', invariant: 'High return은 correct belief를, low TD loss는 recoverable dynamics를 보장하지 않는다.', metrics: [{ label: 'Estimator test', value: 'innovation + coverage' }, { label: 'Runtime test', value: 'braking margin' }] },
  ];
  return <AnimatedSequence steps={steps} tone="emerald" />;
}

export function ControlLoopSequenceViz() {
  const steps: SequenceStep[] = [
    { label: 'Plant state가 시간에 따라 변한다', body: '로봇의 위치와 속도는 이전 state, 실제 actuator input, 외란이 합쳐져 다음 state가 된다.', input: 'x_t, u_exec, w_t', operation: 'x_next = f(x,u,w)', output: 'physical x_{t+1}', invariant: 'Controller가 계산한 command와 plant에 실제 적용된 input을 같은 값으로 가정하면 saturation과 deadline miss를 놓친다.', metrics: [{ label: 'Plant update', value: '100 Hz' }, { label: 'Steering limit', value: '+/- 0.25 rad' }] },
    { label: 'Sensor가 state의 일부만 측정한다', body: 'Camera와 encoder는 true state를 직접 복사하지 않고 noise, delay, calibration을 거친 observation을 낸다.', input: 'x_t, sensor health', operation: 'o_t = h(x_t) + v_t', output: 'timestamped observation', invariant: '고해상도 observation도 velocity나 occluded state를 자동으로 observable하게 만들지 않는다.', metrics: [{ label: 'Camera latency', value: '120 ms' }, { label: 'Raw vs state', value: 'o_t != x_t' }] },
    { label: 'Estimator가 control state를 복원한다', body: 'Dynamics와 observation history를 결합해 state estimate와 uncertainty를 controller에 전달한다.', input: 'o_1:t, u_1:t-1', operation: 'predict + correct', output: 'x_hat_t, P_t', invariant: 'Estimate가 늦거나 과신하면 완벽한 feedback gain도 오래된 state에 올바른 action을 계산한다.', metrics: [{ label: 'Innovation', value: 'audit residual' }, { label: 'Uncertainty', value: 'P_t' }] },
    { label: 'Controller가 reference error를 action으로 바꾼다', body: 'PID, LQR, MPC는 같은 목적을 다른 정보와 제약 계약으로 푼다.', input: 'r_t - x_hat_t', operation: 'u_cmd = pi_control(...)', output: 'desired actuator input', invariant: 'LQR의 optimal과 MPC의 feasible은 선언한 model, cost, horizon, constraints 안에서만 의미가 있다.', metrics: [{ label: 'Tracking target', value: 'r_t' }, { label: 'Controller', value: 'PID / LQR / MPC' }] },
    { label: '실행 결과를 다시 측정해 loop를 닫는다', body: 'Command clipping, actuator dynamics, contact와 disturbance 뒤의 결과가 다음 sensor update로 돌아온다.', input: 'u_cmd', operation: 'clip + actuator + plant', output: 'u_exec, x_{t+1}', invariant: '폐루프 검증은 command loss가 아니라 response, saturation, delay, constraint margin의 시간 기록으로 한다.', metrics: [{ label: 'Closed-loop pole', value: 'rho(A-BK)' }, { label: 'Runtime evidence', value: 'x, x_hat, u_cmd, u_exec' }] },
  ];
  return <AnimatedSequence steps={steps} tone="sky" />;
}

import { useState } from 'react';
import MathFormula from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { BeginnerOpening, CapabilityCheck, ConceptPrimer, LearningHandoff, Misconception, QuestionLead, SourceNotes } from '@/components/learning/ArticleLearning';
import { NlpSection, Takeaway } from './nlp-shared';
import { OfflineLearningSequenceViz } from './rl-viz/RlAnimatedSequences';
import { CqlGradientLab, OfflinePolicyEvaluationLab } from './rl-imitation-offline-learning/viz/OfflineDecisionLabs';

function CompoundingErrorLab() {
  const [horizon, setHorizon] = useState(100);
  const [error, setError] = useState(0.02);
  const cleanProbability = (1 - error) ** horizon;
  const anyErrorProbability = 1 - cleanProbability;
  const expectedErrors = horizon * error;

  return (
    <figure className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border" data-compounding-error>
      <figcaption className="grid gap-2 border-b border-border px-4 py-4 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center">
        <span className="font-mono text-xs font-black text-rose-700 dark:text-rose-300">CLOSED-LOOP LAB</span>
        <strong className="text-sm leading-snug">작은 one-step error를 긴 rollout의 실패 확률로 바꿔 본다</strong>
        <span className="font-mono text-xs font-black" data-any-error>P(error) {(anyErrorProbability * 100).toFixed(1)}%</span>
      </figcaption>
      <div className="grid gap-5 border-b border-border bg-rose-500/[0.035] p-4 sm:grid-cols-2">
        <label className="text-xs font-semibold text-muted-foreground">Horizon T · {horizon} step<input aria-label="Imitation horizon" className="mt-3 block w-full accent-rose-700" type="range" min="10" max="300" step="10" value={horizon} onChange={(event) => setHorizon(Number(event.target.value))} /></label>
        <label className="text-xs font-semibold text-muted-foreground">Expert state에서의 error ε · {(error * 100).toFixed(1)}%<input aria-label="Imitation one-step error" className="mt-3 block w-full accent-rose-700" type="range" min="0.001" max="0.1" step="0.001" value={error} onChange={(event) => setError(Number(event.target.value))} /></label>
      </div>
      <div className="p-4 sm:p-6">
        <div className="mb-5 h-3 overflow-hidden rounded-sm bg-muted"><div className="h-full bg-rose-600 transition-[width] duration-300" style={{ width: `${anyErrorProbability * 100}%` }} /></div>
        <div className="grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3">
          <div className="bg-background p-4"><p className="text-xs text-muted-foreground">오류 없이 끝날 확률</p><p className="mt-1 font-mono text-xl font-black">{(cleanProbability * 100).toFixed(1)}%</p></div>
          <div className="bg-background p-4"><p className="text-xs text-muted-foreground">한 번 이상 틀릴 확률</p><p className="mt-1 font-mono text-xl font-black text-rose-700 dark:text-rose-300" data-any-error-value>{(anyErrorProbability * 100).toFixed(1)}%</p></div>
          <div className="bg-background p-4"><p className="text-xs text-muted-foreground">독립 error 가정의 기대 횟수</p><p className="mt-1 font-mono text-xl font-black" data-expected-errors>{expectedErrors.toFixed(2)}</p></div>
        </div>
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">이 계산은 error가 독립이고 한 번의 실수가 이후 분포를 바꾸지 않는 낙관적 기준선이다. 실제 closed loop에서는 첫 실수가 낯선 state를 만들고 다음 error rate 자체를 높일 수 있으므로 rollout failure는 더 심해질 수 있다.</p>
      </div>
    </figure>
  );
}

export default function RlImitationOfflineLearningArticle() {
  return (
    <>
      <NlpSection id="demonstration-contract" marker="01" tone="teal" question="직접 시행착오를 시작하기 전에 잘하는 사람의 기록부터 따라 배울 수 있을까?" title="한 장면의 정답을 맞히는 것과 끝까지 해내는 것은 다르다">
        <BeginnerOpening
          title="잘하는 사람의 운전 기록을 외우기만 하면 혼자서도 끝까지 달릴 수 있을까?"
          description={<>로봇이나 프로그램이 놓인 현재 상황을 <strong>state</strong>, 그 상황에서 고른 움직임을 <strong>action</strong>이라고 한다. 잘하는 사람이 지나온 state와 action을 차례로 저장한 기록이 <strong>demonstration</strong>이고, 그 기록에서 행동 규칙을 배우는 방법이 모방 학습이다.</>}
          familiarScene={<>운전 선생님은 늘 차선 중앙을 달렸기 때문에 기록에는 중앙에서 핸들을 얼마나 돌렸는지가 많다. 학생이 혼자 운전하다 오른쪽으로 조금 밀리면, 그 낯선 위치에서 중앙으로 돌아오는 방법은 기록에 없을 수 있다. 한 번의 작은 실수가 다음에 보게 될 장면 자체를 바꾼다.</>}
          steps={[
            { label: '상황과 행동을 함께 기록한다', detail: '한 장면만 떼지 않고 시간 순서와 작업이 끝난 이유까지 남긴다.' },
            { label: '기록 속 선택을 따라 배운다', detail: '같은 상황에서 전문가가 고른 행동을 더 자주 고르게 만든다.' },
            { label: '혼자 움직일 때 다시 검증한다', detail: '자기 행동이 만든 낯선 상황에서도 복구하고 끝까지 성공하는지 본다.' },
          ]}
        />
        <QuestionLead label="이제 확인할 질문" question="전문가가 본 장면과 그때 한 행동을 모두 기록했다면, 그대로 외우는 것만으로 새 상황에서도 끝까지 움직일 수 있을까?" answer="항상 그렇지는 않다. 기록 속 장면은 전문가가 거의 실수하지 않았기 때문에 도달한 장면이다. 새로 배운 규칙은 자기 행동으로 다른 장면을 만들 수 있으므로, 한 장면의 행동 예측 점수와 실제로 끝까지 수행한 성공률을 따로 확인해야 한다." />
        <ConceptPrimer items={[{ term: 'Behavior policy πβ', meaning: 'Offline dataset의 trajectory를 실제로 만든 policy다.', why: '학습할 policy와 data coverage의 기준을 분리한다.' }, { term: 'Expert policy π*', meaning: 'Imitation label을 제공하는 기준 행동자다.', why: '좋은 demonstration과 learner recovery query의 출처를 밝힌다.' }, { term: 'On-policy query', meaning: '현재 learner가 방문한 state에서 새 label이나 reward를 얻는 일이다.', why: 'DAgger가 가능한 환경과 static offline RL을 구분한다.' }, { term: 'Support', meaning: 'Dataset이 실제 근거를 가진 state-action 영역이다.', why: 'Offline critic의 OOD optimism과 return prompt의 한계를 판단한다.' }]} />
        <div className="prose prose-neutral max-w-none dark:prose-invert"><p>Demonstration dataset은 <code>(observation, action)</code> pair의 bag이 아니다. Episode boundary, action latency, control frequency, reward 또는 success, terminal reason이 붙은 trajectory다. 카메라 frame과 motor command의 timestamp가 한 step만 어긋나도 policy는 잘못된 인과 관계를 학습한다. Robot learning에서는 학습 algorithm을 고르기 전에 이 logging contract를 먼저 검증해야 한다.</p><p>Behavior cloning은 expert action의 conditional likelihood를 최대화한다. 이 목적은 “expert state에서 expert처럼 행동한다”에는 직접 답하지만, learner가 유도하는 state에서 recover하는지와 dataset보다 좋은 return을 만드는지는 직접 답하지 않는다.</p></div>
        <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3 sm:p-4"><MathFormula display className="my-0 text-xs sm:text-base">{String.raw`\underbrace{\theta_{\mathrm{BC}}}_{\text{모방으로 얻은 정책}}=\arg\min_\theta\;\underbrace{\mathbb E_{(s,a)\sim\mathcal D_E}\!\left[-\log\pi_\theta(a\mid s)\right]}_{\text{전문가 행동의 예측 오차}}`}</MathFormula></div>
        <FormulaNote meaning="Expert dataset에서 실제 action에 준 negative log-probability를 줄인다. State distribution은 D_E로 고정되며 learner가 배포 중 방문할 state는 loss 안에 자동으로 나타나지 않는다." symbols={[[String.raw`\mathcal D_E`, 'Expert가 수집한 demonstration dataset'], [String.raw`\pi_\theta(a\mid s)`, 'Learner가 expert action에 준 확률'], [String.raw`\theta_{\mathrm{BC}}`, 'Supervised imitation으로 얻은 policy parameter']]} />
      </NlpSection>

      <NlpSection id="covariate-shift" marker="02" tone="amber" question="Validation accuracy 98%인 policy가 왜 100-step rollout에서 자주 실패할까?" title="한 번의 오차는 다음 입력 분포를 바꾼다">
        <CompoundingErrorLab />
        <OfflineLearningSequenceViz />
        <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3 sm:p-4"><MathFormula display className="my-0 text-xs sm:text-base">{String.raw`\begin{aligned}\underbrace{p_{\mathrm{clean}}}_{\text{모든 step을 맞힐 확률}}&=(1-\epsilon)^T\\[2pt]\underbrace{\Pr(\text{한 번 이상 오류})}_{\text{rollout 실패 위험}}&=1-p_{\mathrm{clean}}\approx\underbrace{T\epsilon}_{\text{작은 오류율의 근사}}\end{aligned}`}</MathFormula></div>
        <FormulaNote meaning="Error가 timestep마다 독립이라는 단순 기준선에서도 horizon T가 길어지면 한 번 이상 틀릴 확률이 빠르게 커진다. 실제 imitation에서는 오류가 새로운 state를 만들기 때문에 이후 epsilon도 고정되지 않아 이 근사는 낙관적일 수 있다." symbols={[[String.raw`\epsilon`, 'Expert-like state에서의 one-step error rate'], [String.raw`T`, 'Closed-loop rollout horizon'], [String.raw`(1-\epsilon)^T`, '모든 step을 오류 없이 통과할 확률']]} />
        <div className="prose prose-neutral max-w-none dark:prose-invert"><p>핵심은 단순 error 누적보다 <strong>covariate shift</strong>다. Expert는 차선 중앙만 방문했기 때문에 dataset에는 중앙에서의 steering label이 많다. Learner가 조금 오른쪽으로 밀리면 오른쪽 edge에서 어느 방향으로 얼마나 복구해야 하는지 본 적이 없다. 틀린 action이 낯선 state를 만들고, 낯선 state가 다음 error를 키우는 feedback loop가 생긴다.</p></div>
        <Misconception>Frame-level train/validation split은 같은 episode의 거의 동일한 frame을 양쪽에 넣어 성능을 부풀릴 수 있다. Episode·scene·operator 단위로 split하고, open-loop action error와 closed-loop success를 함께 측정해야 한다.</Misconception>
      </NlpSection>

      <NlpSection id="dagger" marker="03" tone="blue" question="Learner가 실제로 빠지는 state를 training data로 다시 가져올 수 있다면?" title="DAgger는 recovery state의 label을 누적한다">
        <div className="prose prose-neutral max-w-none dark:prose-invert"><p>DAgger의 변화는 loss function보다 data collection loop에 있다. 현재 policy를 실행해 learner가 만든 state를 방문하고, 그 state에서 expert에게 “지금이라면 무엇을 할 것인가”를 묻는다. 실행 action과 expert label을 분리하면 expert가 매번 robot을 대신 움직이지 않아도 recovery supervision을 얻을 수 있다.</p><p>초기에는 expert와 learner를 섞어 catastrophic state를 피하고, iteration이 진행될수록 learner 비율을 높인다. 새 data만 학습하면 이전 skill을 잊을 수 있으므로 모든 iteration의 dataset을 aggregate한다. 실제 시스템에서는 human intervention latency, unsafe query boundary, 최신 recovery sample의 sampling weight까지 algorithm의 일부다.</p></div>
        <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3 sm:p-4"><MathFormula display className="my-0 text-xs sm:text-base">{String.raw`\begin{aligned}\underbrace{s\sim d_{\pi_i}}_{\text{현재 learner가 방문한 state}}&\\[-1pt]\underbrace{\mathcal D_i}_{\text{이번 recovery 자료}}&=\{(s,\pi^*(s))\}\\[2pt]\underbrace{\mathcal D}_{\text{누적 학습 자료}}&\leftarrow\mathcal D\cup\mathcal D_i\end{aligned}`}</MathFormula></div>
        <FormulaNote meaning="Current policy가 유도한 state distribution에서 expert action을 다시 label하고 누적한다. Dataset이 learner execution distribution을 따라 이동하므로 expert-only cloning의 blind spot을 recovery example로 채운다." symbols={[[String.raw`d_{\pi_i}`, 'Iteration i policy의 state distribution'], [String.raw`\pi^*(s)`, '그 state에서 expert가 선택할 action'], [String.raw`\mathcal D_i`, '이번 iteration의 recovery dataset'], [String.raw`\mathcal D`, '누적 dataset']]} />
        <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3 sm:p-4"><MathFormula display className="my-0 text-xs sm:text-base">{String.raw`\begin{aligned}\underbrace{J(\widehat\pi_{\mathrm{BC}})}_{\text{BC 누적 비용}}&\le J(\pi^*)+\underbrace{T^2\epsilon}_{\text{expert 분포 오류의 최악 누적}}\\[3pt]\underbrace{J(\widehat\pi_{\mathrm{DAgger}})}_{\text{DAgger 누적 비용}}&\le J(\pi^*)+\underbrace{uT\epsilon_N}_{\text{learner 분포 오류의 누적}}+O(1)\end{aligned}`}</MathFormula></div>
        <FormulaNote meaning="원 논문의 조건 아래 expert distribution만 본 BC의 최악 비용 증가는 T² epsilon으로 커질 수 있지만, DAgger가 learner distribution에서 error를 낮추면 uT epsilon_N 형태로 제어된다. u가 T만큼 큰 환경이면 이점도 약해진다." symbols={[[String.raw`J`, 'Policy의 T-step 누적 task cost'], [String.raw`u`, '한 실수가 늘릴 수 있는 expert cost-to-go'], [String.raw`\epsilon_N`, 'Aggregate data에서 얻은 learner-distribution loss']]} />
        <Takeaway>DAgger를 쓸 수 있는지는 “모델이 좋은가”보다 배포 중 expert를 안전하고 빠르게 질의할 수 있는가가 결정한다. Expert query가 불가능하면 문제는 static offline learning으로 바뀐다.</Takeaway>
      </NlpSection>

      <NlpSection id="offline-rl" marker="04" tone="violet" question="환경도 expert도 다시 부를 수 없고 과거 log만 남았다면 어떻게 개선할까?" title="Offline RL은 data 밖 value를 믿지 않는 문제다">
        <QuestionLead question="DQN이나 SAC는 replay buffer를 쓰는데 왜 dataset을 고정하면 갑자기 실패할까?" answer="Online off-policy RL은 높은 Q를 보고 새 action을 실행한 뒤 실제 reward로 틀린 estimate를 고칠 수 있다. Offline RL에서는 policy가 dataset 밖 action을 골라도 결과를 확인할 수 없다. Bootstrap target과 actor가 우연히 큰 OOD Q를 서로 강화할 수 있다." />
        <CqlGradientLab />
        <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3 sm:p-4"><MathFormula display className="my-0 text-xs sm:text-base">{String.raw`\begin{aligned}\underbrace{q_{\mathrm{cand}}(s)}_{\text{큰 candidate Q 모음}}&=\log\sum_a e^{Q(s,a)}\\[2pt]\underbrace{q_{\mathrm{data}}(s)}_{\text{dataset 행동의 평균 Q}}&=\mathbb E_{a\sim\widehat\pi_\beta(\cdot\mid s)}Q(s,a)\\[2pt]\underbrace{\mathcal R_{\mathrm{CQL}}(Q)}_{\text{근거 없는 Q 격차 penalty}}&=\mathbb E_{s\sim\mathcal D}[q_{\mathrm{cand}}(s)-q_{\mathrm{data}}(s)]\end{aligned}`}</MathFormula></div>
        <FormulaNote meaning="큰 candidate-action Q를 모은 soft maximum에서 dataset behavior action의 평균 Q를 뺀다. Data 밖에서만 근거 없이 커진 Q를 상대적으로 낮추려는 penalty이며, Bellman error와 함께 최적화한다." symbols={[[String.raw`\log\sum_a e^{Q(s,a)}`, '큰 candidate Q에 민감한 soft maximum'], [String.raw`\widehat\pi_\beta`, 'Dataset behavior policy의 추정'], [String.raw`\mathcal R_{\mathrm{CQL}}`, 'Conservative gap regularizer']]} />
        <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3 sm:p-4"><MathFormula display className="my-0 text-xs sm:text-base">{String.raw`\begin{aligned}
y_{\text{Bellman}}(s,a)&=\widehat{\mathcal B}^{\pi_k}\widehat Q_k(s,a)\\
L_{\text{보수}}(Q)&=\alpha\mathcal R_{\mathrm{CQL}}(Q)\\
L_{\text{data}}(Q)&=\frac12\mathbb E_{\mathcal D}[(Q(s,a)-y_{\text{Bellman}}(s,a))^2]\\
\min_Q\quad&L_{\text{보수}}(Q)+L_{\text{data}}(Q)
\end{aligned}`}</MathFormula></div>
        <FormulaNote meaning="CQL은 conservative regularizer만 줄이는 알고리즘이 아니다. Candidate와 data action의 Q 간격을 제어하는 항과, 실제 dataset transition으로 만든 Bellman target을 맞추는 항을 함께 최적화한다." symbols={[[String.raw`\alpha`, '보수성의 상대 강도'], [String.raw`\widehat{\mathcal B}^{\pi_k}\widehat Q_k`, 'Frozen target과 dataset transition으로 만든 backup'], [String.raw`\mathcal D`, '추가 interaction 없이 고정된 offline dataset']]} />
        <div className="prose prose-neutral max-w-none dark:prose-invert"><p>CQL의 보수성은 “Q를 모두 낮춘다”가 아니다. Candidate distribution이 크게 평가하는 action의 Q를 누르고 dataset behavior action의 Q는 상대적으로 되돌린다. 위 discrete Lab의 gradient가 바로 그 두 방향을 보여 준다. Alpha가 너무 크면 dataset 안의 드문 좋은 행동까지 억제할 수 있으므로 conservative Q가 낮다는 사실만으로 policy가 더 안전하거나 더 좋다고 결론 내릴 수 없다.</p><p>Coverage는 action count 하나로 끝나지 않는다. 같은 torque라도 state가 달라지면 OOD이고, 비슷한 state라도 multi-modal behavior의 평균 action이 물리적으로 나쁠 수 있다. State representation, action density, trajectory return composition과 terminal reason을 함께 감사해야 한다.</p></div>

        <QuestionLead question="Candidate action의 Q를 직접 낮추지 않고도 dataset 밖 action을 critic에게 묻지 않는 방법은 없을까?" answer="IQL은 dataset에 기록된 action의 Q만 사용해 state value의 upper expectile을 맞춘다. 그 V로 Q를 backup한 뒤, dataset action 중 advantage가 큰 sample에 더 큰 weight를 주는 behavior cloning으로 policy를 꺼낸다." />
        <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3 sm:p-4"><MathFormula display className="my-0 text-xs sm:text-base">{String.raw`\begin{aligned}\underbrace{u(s,a)}_{\text{dataset 행동의 value 잔차}}&=\widehat Q(s,a)-V_\psi(s)\\[2pt]\underbrace{L_2^\tau(u)}_{\text{비대칭 expectile 오차}}&=|\tau-\mathbf 1(u<0)|u^2\\[2pt]\underbrace{L_V(\psi)}_{\text{state value 학습 loss}}&=\mathbb E_{(s,a)\sim\mathcal D}[L_2^\tau(u(s,a))]\end{aligned}`}</MathFormula></div>
        <FormulaNote meaning="IQL은 dataset action의 Q 분포에서 높은 쪽 residual에 더 큰 weight를 주는 expectile regression으로 V를 맞춘다. Tau가 0.5면 평균에 가깝고, 더 크면 현재 data 안의 좋은 action 쪽으로 V가 이동한다." symbols={[[String.raw`\widehat Q(s,a)`, 'Dataset에 실제 기록된 action의 target Q'], [String.raw`V_\psi(s)`, 'Action을 새로 sample하지 않고 맞출 state value'], [String.raw`\tau`, 'Upper expectile을 정하는 비대칭 weight']]} />
        <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3 sm:p-4"><MathFormula display className="my-0 text-xs sm:text-base">{String.raw`\begin{aligned}\underbrace{A_{\mathcal D}(s,a)}_{\text{기록된 행동의 advantage}}&=\widehat Q(s,a)-V_\psi(s)\\[2pt]\underbrace{w(s,a)}_{\text{복제 강도}}&=\exp(\beta A_{\mathcal D}(s,a))\\[2pt]\underbrace{\ell_{\mathrm{BC}}(s,a)}_{\text{기록 행동의 예측 오차}}&=-\log\pi_\theta(a\mid s)\\[2pt]\underbrace{\mathcal L_\pi(\theta)}_{\text{가중 행동 복제 loss}}&=\mathbb E_{(s,a)\sim\mathcal D}[w(s,a)\ell_{\mathrm{BC}}(s,a)]\end{aligned}`}</MathFormula></div>
        <FormulaNote meaning="Dataset action을 그대로 supervised learning하되 estimated advantage가 큰 sample을 더 강하게 복제한다. Exponential weight는 실전에서 상한을 두지 않으면 소수 Q error가 actor를 지배할 수 있다." symbols={[[String.raw`\widehat Q-V_\psi`, 'Dataset action의 estimated advantage'], [String.raw`\beta`, 'Advantage를 cloning weight로 바꾸는 온도'], [String.raw`\log\pi_\theta(a\mid s)`, '기록된 behavior action의 log-likelihood']]} />
        <Takeaway>CQL은 critic의 OOD 낙관을 명시적으로 누르고, IQL은 policy improvement 동안 unseen action의 Q query를 피한다. 둘 다 dataset support 문제를 없애는 보편 해법은 아니며, 배포 전에는 별도의 policy evaluation이 필요하다.</Takeaway>
      </NlpSection>

      <NlpSection id="offline-evaluation" marker="05" tone="blue" question="환경을 다시 실행할 수 없다면 새 policy가 더 좋아졌다는 주장을 무엇으로 반증할까?" title="OPE는 return 추정보다 먼저 support를 검사한다">
        <div className="prose prose-neutral max-w-none dark:prose-invert"><p>Offline critic의 Q와 training loss는 그 critic이 만든 policy를 독립적으로 평가한 값이 아니다. 같은 function approximation error가 actor 선택과 critic score에 함께 들어갈 수 있다. 가장 단순한 off-policy evaluation은 behavior policy가 만든 trajectory return에 target-to-behavior likelihood ratio를 곱해 target policy 분포로 다시 가중한다.</p><p>하지만 unbiasedness라는 말만 보고 ordinary importance sampling을 선택하면 긴 horizon에서 ratio 곱이 폭발한다. Self-normalized estimator는 weight 합으로 나눠 variance를 줄이는 대신 finite-sample bias를 받아들이며, effective sample size는 실제 episode 수 중 몇 개가 추정을 지배하는지 보여 준다.</p></div>
        <OfflinePolicyEvaluationLab />
        <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3 sm:p-4"><MathFormula display className="my-0 text-xs sm:text-base">{String.raw`\begin{aligned}\underbrace{\rho_i}_{\text{trajectory 분포 보정}}&=\prod_{t=0}^{T_i}\frac{\pi(a_t^i\mid s_t^i)}{\pi_\beta(a_t^i\mid s_t^i)}\\[2pt]\underbrace{\widehat V_{\mathrm{IS}}}_{\text{target policy return 추정}}&=\frac1N\sum_{i=1}^N\rho_iG_i\\[2pt]\underbrace{N_{\mathrm{eff}}}_{\text{실질 표본 수}}&=\frac{(\sum_i\rho_i)^2}{\sum_i\rho_i^2}\end{aligned}`}</MathFormula></div>
        <FormulaNote meaning="각 trajectory가 target policy에서 얼마나 더 또는 덜 가능했는지 ratio로 보정해 return을 평균한다. Weight가 몇 trajectory에 몰리면 nominal N보다 effective sample size가 작아져 추정의 신뢰 구간이 넓어진다." symbols={[[String.raw`\rho_i`, 'Trajectory i의 target-to-behavior likelihood ratio'], [String.raw`G_i`, '그 trajectory에서 실제 관측한 return'], [String.raw`N_{\mathrm{eff}}`, 'Weight 집중도를 반영한 유효 표본 수']]} />
        <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3 sm:p-4"><MathFormula display className="my-0 text-xs sm:text-base">{String.raw`\underbrace{\pi(a\mid s)>0}_{\text{target이 선택할 행동}}\quad\Longrightarrow\quad\underbrace{\pi_\beta(a\mid s)>0}_{\text{dataset에도 근거가 있어야 함}}`}</MathFormula></div>
        <FormulaNote meaning="Target policy가 선택할 수 있는 모든 state-action에는 behavior data의 양의 확률 근거가 있어야 한다. 오른쪽이 0이면 ratio와 counterfactual reward를 관측할 수 없어 그 policy value는 data만으로 식별되지 않는다." symbols={[[String.raw`\pi`, '평가하려는 target policy'], [String.raw`\pi_\beta`, 'Offline log를 만든 behavior policy'], [String.raw`>0`, '단순 유사도가 아니라 확률 support가 존재함']]} />
        <Misconception>높은 OPE point estimate 하나는 배포 승인서가 아니다. Behavior policy probability의 기록 또는 추정 오차, trajectory dependence, weight tail, ESS와 confidence interval을 함께 보고, support가 끊기면 policy 제한이나 새 data 수집으로 돌아가야 한다.</Misconception>
      </NlpSection>

      <NlpSection id="sequence-modeling" marker="06" tone="green" question="Bellman backup 없이 trajectory 자체를 조건부 sequence로 배울 수 있을까?" title="Decision Transformer는 원하는 return을 behavior selector로 사용한다">
        <div className="prose prose-neutral max-w-none dark:prose-invert"><p>Decision Transformer는 각 timestep의 미래 reward sum을 hindsight로 계산해 return-to-go token을 만든다. Training에서는 return, state, action을 interleave하고 현재 state까지의 causal context로 dataset action을 예측한다. Evaluation에서는 원하는 return을 먼저 넣고, 실제 reward를 받을 때마다 남은 return에서 빼며 다음 action을 생성한다.</p><p>이 방식은 value function과 policy gradient를 없애고 standard supervised sequence pipeline을 사용할 수 있게 한다. 그러나 원하는 return token이 마법처럼 dataset 밖 skill을 만든다고 해석하면 안 된다. Model은 dataset에 존재하는 behavior와 return의 관계를 학습하므로, support 밖의 return은 OOD prompt다.</p></div>
        <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3 sm:p-4"><MathFormula display className="my-0 text-xs sm:text-base">{String.raw`\begin{aligned}\underbrace{\widehat R_t}_{\text{현재부터 남은 return}}&=\sum_{t'=t}^{T}r_{t'}\\[2pt]\underbrace{\tau}_{\text{학습할 token 순서}}&=(\widehat R_1,s_1,a_1,\ldots,\widehat R_T,s_T,a_T)\end{aligned}`}</MathFormula></div>
        <FormulaNote meaning="남은 return을 action보다 앞 token으로 배치해 causal model이 desired outcome을 조건으로 behavior를 선택하게 한다. Return은 dataset의 실제 미래 reward에서 hindsight로 계산한다." symbols={[[String.raw`\widehat R_t`, '현재부터 끝까지의 return-to-go'], [String.raw`\tau`, 'Return·state·action을 interleave한 trajectory'], [String.raw`a_t`, 'Supervised prediction할 action token']]} />
        <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3 sm:p-4"><MathFormula display className="my-0 text-xs sm:text-base">{String.raw`\begin{aligned}\underbrace{\widehat a_t}_{\text{현재 행동 예측}}&=f_\theta(\widehat R_{t-K+1:t},s_{t-K+1:t},a_{t-K+1:t-1})\\[2pt]\underbrace{\mathcal L(\theta)}_{\text{행동 예측 오차}}&=\frac1K\sum_t\|\widehat a_t-a_t\|_2^2\end{aligned}`}</MathFormula></div>
        <FormulaNote meaning="Causal context에는 현재까지 알려진 return·state와 과거 action만 넣고 현재 dataset action을 예측한다. Evaluation에서는 실제 reward를 받을 때마다 desired remaining return에서 빼 다음 token을 갱신한다." symbols={[[String.raw`K`, '한 action 예측에 제공할 context 길이'], [String.raw`\widehat a_t`, 'Causal history로 예측한 현재 action'], [String.raw`a_t`, 'Dataset이 제공한 supervised action target']]} />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p><strong>방법 이름보다 먼저 다섯 증거를 순서대로 고정한다.</strong> 현재 learner state에 새 expert label을 붙일 수 있는가, 환경에서 새 reward를 얻을 수 있는가, logged action이 deployment 후보를 덮는가, behavior probability와 독립 평가 근거가 있는가, 마지막으로 어떤 수치가 배포를 중단시키는가를 적는다. 이 중 하나라도 답하지 못하면 아래 선택지는 알고리즘 추천이 아니라 아직 검증되지 않은 가설이다.</p>
        </div>
        <div data-offline-choice-contract className="not-prose my-5 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-5">
          {[
            ['01', 'Expert query', '새 learner state의 정답을 받을 수 있는가'],
            ['02', 'Environment query', '새 action 뒤 reward를 관측할 수 있는가'],
            ['03', 'Coverage', '후보 policy가 log support 안에 있는가'],
            ['04', 'Evaluation', 'OPE와 독립 slice가 식별 가능한가'],
            ['05', 'Stop gate', '어떤 실패 수치에서 배포를 거부할 것인가'],
          ].map(([index, label, detail]) => (
            <div className="min-w-0 bg-background p-3" key={index}>
              <p className="font-mono text-[10px] font-black text-emerald-700 dark:text-emerald-300">{index}</p>
              <p className="mt-1 text-xs font-black">{label}</p>
              <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">{detail}</p>
            </div>
          ))}
        </div>
        <div className="not-prose my-7 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-background p-4"><p className="text-xs font-bold text-muted-foreground">Behavior Cloning</p><p className="mt-2 text-sm font-semibold">좋은 demonstration이 충분하고 deployment state가 가깝다</p><p className="mt-3 text-xs leading-relaxed text-muted-foreground">가장 단순하고 안정적이다. Closed-loop drift와 multi-modal average를 먼저 검사한다.</p></div>
          <div className="bg-violet-500/[0.035] p-4"><p className="text-xs font-bold text-muted-foreground">CQL</p><p className="mt-2 text-sm font-semibold">Candidate action의 OOD Q 낙관을 직접 억제한다</p><p className="mt-3 text-xs leading-relaxed text-muted-foreground">Bellman fit과 conservative gap의 균형, actual return과 behavior distance를 본다.</p></div>
          <div className="bg-sky-500/[0.035] p-4"><p className="text-xs font-bold text-muted-foreground">IQL</p><p className="mt-2 text-sm font-semibold">Dataset action만 평가해 implicit improvement를 만든다</p><p className="mt-3 text-xs leading-relaxed text-muted-foreground">Expectile과 advantage weight가 소수 Q error에 끌리지 않는지 확인한다.</p></div>
          <div className="bg-emerald-500/[0.035] p-4"><p className="text-xs font-bold text-muted-foreground">Sequence Modeling</p><p className="mt-2 text-sm font-semibold">긴 trajectory와 여러 return mode를 하나의 model로 조건화한다</p><p className="mt-3 text-xs leading-relaxed text-muted-foreground">Return prompt와 context가 dataset support 안에서 behavior를 구분하는지 확인한다.</p></div>
        </div>
        <CapabilityCheck items={['Demonstration log에서 behavior policy, episode boundary, action latency와 terminal reason을 식별한다.', '낮은 one-step imitation error가 긴 closed-loop success를 보장하지 않는 반례를 계산한다.', 'DAgger가 learner-induced state를 어떻게 expert label로 되가져오는지 실행 순서로 설명한다.', 'Static offline RL에서 OOD Q가 왜 online correction 없이 증폭되는지 backup graph를 그린다.', 'Discrete CQL regularizer의 softmax(Q)−behavior gradient와 Bellman term을 계산한다.', 'IQL이 dataset action의 expectile V와 advantage-weighted cloning으로 unseen-action query를 피하는 경로를 설명한다.', 'Importance ratio, ordinary·self-normalized IS와 ESS를 계산하고 support violation을 식별한다.', 'Decision Transformer의 return-to-go를 training leakage 없이 만들고 evaluation 때 갱신한다.', 'Query 가능성, coverage, reward와 평가 가능성에 따라 BC·DAgger·CQL·IQL·sequence model의 기준선을 선택한다.']} />
        <LearningHandoff
          description="고정 dataset에서 얻은 결론은 support 밖 행동을 자동으로 보장하지 않는다. Online query 가능성, model 사용 여부와 배포 위험에 따라 다음 질문을 제한한다."
          items={[
            { label: '막히면', slug: 'rl-temporal-difference-dqn', title: 'TD·Q-learning·DQN', reason: 'Offline critic이 재사용하는 sampled Bellman target과 OOD bootstrap 증폭 경로를 먼저 복습한다.' },
            { label: '이어 읽기', slug: 'rl-safe-constrained-learning', title: 'Safe & Constrained RL', reason: 'Offline data로 학습한 safety critic의 coverage와 runtime recovery가 실제 위험 예산을 만족하는지 검증한다.' },
            { label: '원문으로', slug: 'paper-cql-2020', title: 'Conservative Q-Learning 재구성', reason: 'Conservative regularizer가 어떤 distribution에서 Q lower bound를 주장하는지 증거와 한계까지 확인한다.' },
          ]}
        />
        <SourceNotes sources={[{ label: 'Ross, Gordon, Bagnell · DAgger', href: 'https://proceedings.mlr.press/v15/ross11a.html', note: 'Policy-induced distribution shift, dataset aggregation algorithm과 cost bound의 1차 출처.' }, { label: 'Kumar et al. · Conservative Q-Learning', href: 'https://proceedings.neurips.cc/paper/2020/hash/0d2b2061826a5df3221116a5085a6052-Abstract.html', note: 'Offline OOD overestimation, conservative objective와 조건부 lower-bound 주장의 1차 출처.' }, { label: 'Kostrikov, Nair, Levine · Implicit Q-Learning', href: 'https://arxiv.org/abs/2110.06169', note: 'Dataset action의 upper expectile value와 advantage-weighted policy extraction의 1차 출처.' }, { label: 'Hanna, Niekum, Stone · Importance Sampling OPE', href: 'https://proceedings.mlr.press/v97/hanna19a.html', note: '다른 behavior policy의 log로 target policy return을 importance weighting하는 OPE의 1차 근거.' }, { label: 'Chen et al. · Decision Transformer', href: 'https://proceedings.neurips.cc/paper_files/paper/2021/hash/7f489f642a0ddb10272b5c31057f0663-Abstract.html', note: 'Return-conditioned causal trajectory representation과 evaluation loop의 1차 출처.' }, { label: 'LeRobot · Dataset format', href: 'https://huggingface.co/docs/lerobot/lerobot-dataset-v3', note: 'Robot trajectory의 timestamp·feature·episode 구조를 실제 dataset interface와 대조한다.' }]} />
      </NlpSection>
    </>
  );
}

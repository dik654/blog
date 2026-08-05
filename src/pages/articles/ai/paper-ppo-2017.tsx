import FormulaNote from '@/components/ui/formula-note';
import Math from '@/components/ui/math';
import {
  CapabilityCheck,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
  StopRule,
} from '@/components/learning/ArticleLearning';
import {
  PpoClipLab,
  PpoEvidenceLab,
  PpoIterationLab,
} from './paper-ppo-2017/viz/PpoPaperLabs';

function Formula({
  latex,
  meaning,
  symbols,
}: {
  latex: string;
  meaning: string;
  symbols: [string, string][];
}) {
  return (
    <div data-formula-pair className="not-prose my-7 min-w-0">
      <div className="min-w-0 overflow-hidden rounded-md border border-border px-2 py-4 sm:px-4">
        <Math display className="my-0 text-[12px] sm:text-base">{latex}</Math>
      </div>
      <FormulaNote meaning={meaning} symbols={symbols} />
    </div>
  );
}

const originalRecipes = [
  {
    label: 'MuJoCo',
    values: 'T=2,048 · Adam 3×10⁻⁴ · K=10 · minibatch 64 · γ=.99 · λ=.95 · clip ε=.2',
  },
  {
    label: 'Atari',
    values: '8 actors · T=128 · 3 epochs · minibatch 32×8 · γ=.99 · λ=.95 · clip ε=.1α',
  },
  {
    label: 'Continuous policy',
    values: '2×64 tanh MLP · Gaussian mean · variable standard deviations',
  },
  {
    label: 'Value objective',
    values: 'Equation 9의 plain squared error · value clipping은 2017 원문 기여가 아님',
  },
] as const;

export default function Ppo2017Paper() {
  return (
    <>
      <section id="context" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">좋은 rollout 하나를 여러 번 학습하면 왜 곧 망가질까?</h2>
        <QuestionLead
          question="Policy gradient의 learning rate만 작게 잡으면 같은 rollout을 여러 epoch 재사용해도 안전할까?"
          answer="보장할 수 없다. 첫 minibatch update 뒤의 policy는 sample을 만든 old policy와 달라지고, 같은 action의 확률 비율이 계속 변한다. Advantage가 크거나 optimizer step이 누적되면 sample 하나가 policy를 멀리 밀 수 있다. PPO는 이 비율을 직접 관찰하고, 과도한 '좋아 보이는 개선'의 surrogate 이득을 잘라 first-order minibatch 학습을 가능하게 만든다."
        />
        <ConceptPrimer items={[
          {
            term: 'Policy πθ(a|s)',
            meaning: '상태 s에서 행동 a를 선택할 확률 분포다.',
            why: 'PPO가 직접 바꾸는 대상이며 old와 new policy의 같은 action 확률을 비교한다.',
          },
          {
            term: 'Advantage Âₜ',
            meaning: '선택한 행동이 그 상태의 평균적인 선택보다 얼마나 더 좋았는지 추정한 값이다.',
            why: '확률을 올릴 행동과 내릴 행동을 부호로 나누며 clipping 방향도 결정한다.',
          },
          {
            term: 'Importance ratio rₜ',
            meaning: '같은 state-action에서 new policy 확률을 old policy 확률로 나눈 값이다.',
            why: 'Old rollout을 현재 policy objective에 재사용하면서 policy가 얼마나 이동했는지 sample별로 드러낸다.',
          },
          {
            term: 'Surrogate objective',
            meaning: '실제 새 policy return을 다시 rollout하지 않고 old sample로 update 방향을 근사한 목적함수다.',
            why: '값싸게 여러 minibatch step을 하되 근사식의 유효 범위를 관리해야 하는 이유가 된다.',
          },
        ]} />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            TRPO는 expected KL constraint 아래에서 surrogate objective를 최적화해 큰 policy 이동을 막으려 했다.
            하지만 conjugate gradient와 Hessian-vector product 같은 2차 근사가 필요했다. PPO 2017은 같은
            “한 번에 너무 멀리 가지 말자”는 문제를 일반적인 stochastic gradient descent로 다룰 두 방법,
            <strong> clipped surrogate</strong>와 <strong>adaptive KL penalty</strong>를 제안했다.
          </p>
        </div>
        <Misconception>
          PPO의 clip은 policy parameter나 action을 직접 자르는 장치가 아니다. Sample별 probability ratio로
          만든 두 objective term 중 더 비관적인 값을 고른다. 따라서 KL divergence를 hard constraint 안에
          둔다는 보장이나 monotonic policy improvement 정리는 없다.
        </Misconception>
      </section>

      <section id="claim" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">비율 1은 그대로, 1.2는 old action 확률을 20% 높였다는 뜻이다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Rollout 때 저장한 old log-probability는 K epoch 동안 고정한다. 현재 policy로 같은 action의
            new log-probability를 다시 계산하고 둘의 차이를 exp하면 확률의 나눗셈이 된다. Log space를 쓰는
            이유는 작은 확률의 직접 나눗셈보다 수치적으로 안정적이고 실제 distribution API가 log-probability를
            자연스럽게 제공하기 때문이다.
          </p>
        </div>
        <Formula
          latex={String.raw`\begin{aligned}
\underbrace{\ell_t}_{\text{현재 policy log-prob}}
&=\log\pi_\theta(a_t\mid s_t)\\
\underbrace{\ell_t^{old}}_{\text{rollout 때 고정한 log-prob}}
&=\log\pi_{\theta_{\rm old}}(a_t\mid s_t)\\
\underbrace{r_t(\theta)}_{\text{새 policy의 상대 확률}}
&=\exp(\ell_t-\ell_t^{old})
\end{aligned}`}
          meaning="같은 state-action의 새 확률을 old 확률로 나눈 값이다. r=1이면 확률이 같고, r=1.2면 20% 올랐으며, r=0.8이면 20% 낮아졌다. 분모가 되는 old log-probability를 K epoch 안에서 바꾸면 비교 기준이 움직여 objective의 의미가 깨진다."
          symbols={[
            [String.raw`\pi_\theta`, '현재 minibatch update를 받고 있는 new policy'],
            [String.raw`\pi_{\theta_{\rm old}}`, '이번 rollout을 만든 고정 behavior policy'],
            [String.raw`a_t,s_t`, 'Rollout buffer에 저장된 행동과 그 행동을 고른 상태'],
            ['log 차이 뒤 exp', 'log p_new − log p_old = log(p_new/p_old)를 안정적으로 ratio로 복원'],
          ]}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Positive advantage에서는 행동 확률을 올리는 것이 개선이다. 그래서 r&gt;1+ε의 추가 이득을 막는다.
            Negative advantage에서는 확률을 낮추는 것이 개선이므로 r&lt;1−ε의 추가 이득을 막는다. 반대로
            해로운 방향으로 멀어진 sample은 clip 밖이어도 raw term이 더 작아져 그대로 벌을 받는다. 이 부호
            비대칭을 이해해야 “ratio를 0.8~1.2로 clamp한다”는 잘못된 구현을 피할 수 있다.
          </p>
        </div>
        <Formula
          latex={String.raw`\underbrace{L_t^{\rm CLIP}}_{\text{비관적 sample 이득}}=\min\!\left(\underbrace{r_t\hat A_t}_{\text{실제 ratio의 이득}},\underbrace{\operatorname{clip}(r_t,1-\epsilon,1+\epsilon)\hat A_t}_{\text{개선 한도를 둔 이득}}\right)`}
          meaning="두 term 중 숫자가 더 작은 값을 선택한다. A가 양수면 ratio 상한에서, A가 음수면 ratio 하한에서 유리한 개선만 포화된다. 해로운 방향은 raw term이 더 작아지므로 min이 그 손실을 지우지 않는다."
          symbols={[
            [String.raw`\hat A_t>0`, '선택한 행동이 예상보다 좋았으므로 확률을 올리고 싶은 sample'],
            [String.raw`\hat A_t<0`, '선택한 행동이 예상보다 나빴으므로 확률을 내리고 싶은 sample'],
            [String.raw`\epsilon`, 'Old policy 주변에서 surrogate 이득을 포화할 비율 폭. 논문 예시는 0.2'],
            ['min', '좋아 보이는 과도한 이동에 낙관적 보상을 주지 않는 pessimistic bound'],
            ['clip 뒤 advantage 곱', 'Advantage 부호에 따라 실제로 막히는 ratio 방향을 자동으로 뒤집음'],
          ]}
        />
        <PpoClipLab />
      </section>

      <section id="mechanism" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Policy, value와 exploration 신호를 한 update에서 함께 계산한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Actor와 critic이 parameter를 공유하면 policy surrogate만 optimize할 수 없다. Equation 9는 clipped
            policy objective에서 value squared error를 빼고 entropy bonus를 더한다. 논문 표기는
            <strong> maximize</strong> 기준이다. 일반적인 optimizer가 loss를 minimize한다면 전체 부호를
            뒤집어 policy loss + c₁·value loss − c₂·entropy로 구현한다.
          </p>
        </div>
        <Formula
          latex={String.raw`\underbrace{L_t^{\rm total}}_{\text{최대화할 목적}}=\underbrace{L_t^{\rm CLIP}}_{\text{policy 개선}}-\underbrace{c_1(V_\theta(s_t)-\hat V_t)^2}_{\text{value 오차 벌점}}+\underbrace{c_2\,\mathcal H[\pi_\theta](s_t)}_{\text{탐색 entropy 보너스}}`}
          meaning="Actor는 clipped surrogate를 크게 만들고, critic은 rollout return target에 가까워지며, entropy는 policy가 너무 빨리 한 행동으로 붕괴하지 않게 한다. 원문 Equation 9의 value 항은 plain squared error다. 후대 PPO2의 clipped value loss를 원문 식으로 적으면 안 된다."
          symbols={[
            [String.raw`L_t^{\rm CLIP}`, 'Ratio와 advantage로 만든 clipped policy surrogate'],
            [String.raw`\hat V_t`, 'Reward와 bootstrap으로 만든 value regression target'],
            [String.raw`c_1`, 'Value error가 shared update에 미치는 크기'],
            [String.raw`\mathcal H`, '현재 action distribution의 entropy'],
            [String.raw`c_2`, 'Exploration 보너스의 크기'],
            ['Minimize 구현', '위 식 전체에 minus를 붙여 −policy + c₁·value − c₂·entropy로 변환'],
          ]}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Algorithm 1은 N개 actor가 T step을 모은 뒤 advantage를 계산하고, 같은 NT sample을 K epoch 동안
            minibatch로 반복 학습한다. 그 K epoch가 끝나야 현재 parameter를 다음 rollout의 old policy
            snapshot으로 넘긴다. PPO가 “on-policy인데 data를 재사용한다”는 말은 이 제한된 iteration 내부
            재사용을 뜻한다.
          </p>
        </div>
        <PpoIterationLab />
      </section>

      <section id="evidence" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">논문은 clipping만 제안하지 않았다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            두 번째 variant는 KL penalty coefficient β를 목표 KL에 맞게 조정한다. Update 뒤 실제 mean KL이
            목표의 1.5배보다 크면 β를 두 배로, 목표의 1/1.5보다 작으면 절반으로 바꾼다. Table 1에서는
            이 adaptive variant도 fixed KL과 no-clipping보다 강했지만 clipped ε=0.2보다 낮았다.
          </p>
        </div>
        <Formula
          latex={String.raw`\underbrace{L_t^{\rm KLPEN}}_{\text{adaptive-KL 목적}}=\underbrace{r_t\hat A_t}_{\text{policy surrogate}}-\underbrace{\beta\,D_{\rm KL}(\pi_{\theta_{\rm old}}\Vert\pi_\theta)}_{\text{old에서 멀어진 정도의 벌점}}`}
          meaning="Clipping 대신 old와 new policy의 KL divergence에 가격 β를 붙인다. β가 크면 이동을 더 강하게 억제하고, 작으면 surrogate 개선을 더 허용한다. 논문은 fixed β뿐 아니라 관측 KL에 따라 β를 자동 조절하는 variant를 실험했다."
          symbols={[
            [String.raw`D_{\rm KL}`, 'Old policy 분포와 new policy 분포 전체의 차이'],
            [String.raw`\beta`, 'Policy 이동에 부과하는 adaptive penalty coefficient'],
            [String.raw`r_t\hat A_t`, 'Clipping하지 않은 importance-weighted advantage'],
            ['Adaptive penalty', '관측 KL이 target에서 멀어질 때 다음 update의 β를 배수로 조절'],
          ]}
        />
        <Formula
          latex={String.raw`\underbrace{\beta_{\rm next}}_{\text{다음 penalty}}=\begin{cases}\beta/2,&\bar D_{\rm KL}<d_{\rm targ}/1.5\\2\beta,&\bar D_{\rm KL}>1.5d_{\rm targ}\\\beta,&\text{그 사이}\end{cases}`}
          meaning="Mean KL이 목표보다 너무 작으면 constraint가 과하다고 보고 β를 절반으로 낮춘다. 너무 크면 β를 두 배로 높인다. 그 사이는 그대로 둔다. 이는 clipped variant의 필수 과정이 아니라 논문이 함께 제안한 별도 PPO variant다."
          symbols={[
            [String.raw`\bar D_{\rm KL}`, '이번 policy update 뒤 측정한 batch 평균 KL'],
            [String.raw`d_{\rm targ}`, '원하는 KL 이동량 target'],
            [String.raw`1.5`, '논문이 β를 바꾸지 않는 허용 band의 배수'],
            ['β/2 또는 2β', '연속 controller가 아니라 거친 multiplicative feedback rule'],
          ]}
        />
        <PpoEvidenceLab />
      </section>

      <section id="reproduction" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">원문 재현과 현대 PPO 구현을 같은 recipe로 부르면 안 된다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            MuJoCo experiment의 actor는 두 개의 64-unit tanh hidden layer를 가진 diagonal Gaussian policy다.
            원문은 MLP가 Gaussian mean과 variable standard deviations를 낸다고만 적고, standard deviation의
            state 의존성이나 action bound 처리 방식은 더 구체적으로 고정하지 않는다. 따라서 SAC 계열에서 흔한
            tanh-squashed Gaussian과 log-Jacobian 보정도, 특정 clipping 방식도 2017 원문 recipe로 소급하면
            안 된다.
          </p>
        </div>
        <div className="not-prose divide-y divide-border border-y border-border">
          {originalRecipes.map((recipe) => (
            <div key={recipe.label} className="grid gap-1 py-4 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-5">
              <strong className="font-mono text-[12px] text-muted-foreground">{recipe.label}</strong>
              <p className="text-sm font-semibold leading-relaxed">{recipe.values}</p>
            </div>
          ))}
        </div>
        <div className="prose prose-neutral mt-7 max-w-none dark:prose-invert">
          <p>
            구현 test는 적어도 세 층이어야 한다. 첫째, ε=.2에서 ratio 0.7·1.0·1.3과 advantage ±1의 선택값을
            수치 oracle로 고정한다. 둘째, K epoch 내 old_log_prob tensor가 byte-for-byte 변하지 않는지 확인한다.
            셋째, approximate KL과 clip fraction을 관측해 clip이 hard constraint가 아니라는 사실을 runtime에서
            확인한다.
          </p>
          <p>
            실제 continuous-control training loop와 action-boundary 처리는
            <InternalLink slug="rl-ppo-continuous-control">PPO 연속 제어 구현</InternalLink>에서 이어 간다.
            이 원문 페이지의 역할은 구현 option을 모두 소개하는 것이 아니라 어떤 option이 2017 source에
            속하는지 경계를 고정하는 것이다.
          </p>
        </div>
      </section>

      <section id="legacy" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Robot policy의 PPO와 LLM post-training의 PPO는 무엇을 공유할까?</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            둘 다 old policy가 만든 sample, advantage-like signal과 probability ratio를 이용해 policy update를
            제한한다. 그러나 LLM에서는 action이 다음 token이고 episode·reward model·KL reference policy와
            batching 구조가 달라진다. 2017 MuJoCo hyperparameter를 그대로 옮기는 것이 아니라 ratio clipping의
            논리와 old-policy provenance를 옮긴다.
          </p>
          <p>
            Human preference reward와 reference-model KL까지 포함한 경로는
            <InternalLink slug="rlhf">RLHF 원문 경로</InternalLink>에서, 자동 검증 reward를 쓰는 최신 reasoning
            경로는 <InternalLink slug="post-training-rlvr">RLVR post-training</InternalLink>에서 별도로 읽는다.
          </p>
        </div>
        <StopRule>
          Advantage 부호별 clip branch를 수치로 계산하고, Equation 9의 세 항과 Algorithm 1의 old-policy
          snapshot, adaptive-KL variant와 원문 evidence의 mixed Atari result를 설명할 수 있으면 PPO 2017
          원문 단계는 끝이다.
        </StopRule>
        <CapabilityCheck items={[
          'ε=.2, ratio 0.7·1.0·1.3, advantage ±1에서 min이 고르는 값을 계산한다.',
          'Positive advantage는 위쪽, negative advantage는 아래쪽 개선만 clipping하는 이유를 설명한다.',
          'K minibatch epoch 동안 old_log_prob를 바꾸면 안 되는 이유를 말한다.',
          'Ratio clipping, adaptive KL penalty, diagnostic KL과 후대 value clipping을 구분한다.',
          'Equation 9를 maximize 표기와 minimize loss 표기로 모두 옮긴다.',
          'Atari 평균 학습 성능과 마지막 100 episode의 승리 수가 반대라는 사실을 숨기지 않는다.',
          '원문 diagonal Gaussian과 후대 tanh-squashed Gaussian을 혼동하지 않는다.',
        ]} />
        <SourceNotes sources={[
          {
            label: 'Proximal Policy Optimization Algorithms · arXiv',
            href: 'https://arxiv.org/abs/1707.06347',
            note: 'Equations 7~9, Algorithm 1, Tables 1~5와 Figure 3의 1차 근거.',
          },
          {
            label: 'OpenAI research announcement',
            href: 'https://openai.com/index/openai-baselines-ppo/',
            note: 'PPO 공개 당시의 요약과 baseline implementation 맥락. 논문 식의 1차 근거는 arXiv PDF다.',
          },
          {
            label: 'OpenAI Baselines · pposgd',
            href: 'https://github.com/openai/baselines/tree/master/baselines/pposgd',
            note: '당시 공개 구현 artifact를 paper recipe와 대조하는 자료.',
          },
          {
            label: 'Generalized Advantage Estimation',
            href: 'https://arxiv.org/abs/1506.02438',
            note: 'PPO Algorithm 1이 사용하는 advantage estimator와 λ의 기반 논문.',
          },
          {
            label: 'Trust Region Policy Optimization',
            href: 'https://arxiv.org/abs/1502.05477',
            note: 'PPO가 단순화하려 한 constrained policy-update 문제의 직접 선행 연구.',
          },
        ]} />
      </section>
    </>
  );
}

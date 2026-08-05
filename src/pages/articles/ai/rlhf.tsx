import { Link } from 'react-router-dom';
import M from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { articlePath } from '@/lib/paths';
import { CapabilityCheck, ConceptPrimer, Misconception, QuestionLead, SourceNotes } from '@/components/learning/ArticleLearning';
import {
  PPOUpdateLab,
  PreferenceScopeBand,
  RankingBatchLab,
  RLHFDataContractViz,
  TwoDistanceViz,
} from './rlhf/viz/RLHFContractViz';

function RouteLink({ slug, label, description }: { slug: string; label: string; description: string }) {
  return (
    <Link to={articlePath('ai', slug)} className="group grid min-w-0 gap-1 border-b border-border py-4 transition-colors hover:bg-muted/20 sm:grid-cols-[11rem_minmax(0,1fr)_auto] sm:items-start sm:gap-4 sm:px-2">
      <span className="text-sm font-black">{label}</span>
      <span className="text-sm leading-6 text-muted-foreground">{description}</span>
      <span className="hidden text-sm text-muted-foreground transition-transform group-hover:translate-x-0.5 sm:block">→</span>
    </Link>
  );
}

export default function RLHFArticle() {
  return (
    <>
      <section id="data-contract" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">한 prompt가 세 종류의 학습 데이터로 갈라진다</h2>
        <QuestionLead
          question="사람이 답 A를 B보다 좋아한다고 표시하면, 그 한 번의 선택이 어떻게 다음 token 확률을 바꾸는가?"
          answer="비교 label이 actor를 바로 학습시키지는 않는다. 먼저 같은 prompt의 여러 답을 순위화해 reward model이 선호 score 차이를 학습한다. 그 다음 사람 label이 없는 새 prompt에서 actor가 rollout을 만들고, reward model 점수와 이동 제약을 사용해 PPO가 token policy를 업데이트한다."
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Pre-training의 다음-token 목적은 인터넷에 자주 이어지는 문장을 잘 맞힌다. 하지만 제품 assistant가 따라야 할 기준은 사용자의 지시,
            진실성, 유용성, 안전성처럼 하나의 정답 문장으로 쓰기 어려운 경우가 많다. InstructGPT의 RLHF pipeline은 이 간극을
            <strong> demonstration, comparison, online rollout</strong>이라는 세 데이터 계약으로 나눴다.
          </p>
          <p>
            세 단계의 row를 섞어 읽으면 안 된다. SFT에는 사람이 쓴 답이 있고, reward model에는 같은 prompt에서 생성한 여러 답과 순위가 있다.
            PPO용 prompt에는 정답 답변이 없다. 현재 actor가 그 자리에서 새 답을 만들고, 이미 학습된 reward model이 scalar를 준다.
          </p>
        </div>
        <RLHFDataContractViz />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            InstructGPT 논문의 recipe는 SFT 약 13,000개, RM 약 33,000개, PPO 약 31,000개의 training prompt를 사용했다.
            이는 RLHF의 보편적인 데이터 비율이 아니다. 중요한 것은 세 split의 숫자가 아니라 <strong>누가 completion을 만들고 어떤 label이 존재하는지</strong>다.
          </p>
          <Misconception>
            “사람 피드백으로 학습했다”는 한 문장만으로 demonstration과 comparison을 같은 데이터라고 부르면 안 된다.
            전자는 정답 token을 직접 제공하고 후자는 두 응답의 상대 순서만 제공한다. PPO prompt는 사람 label 없이 online rollout의 출발점만 제공한다.
          </Misconception>
        </div>
      </section>

      <section id="ranking-batch" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">K개 답의 순위는 한 prompt 안의 비교 묶음이다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            평가자에게 절대적인 품질 점수 7.3을 요구하면 사람마다 척도가 달라진다. 대신 같은 prompt에서 나온 답을 나란히 보여 주고 순위를 매기게 한다.
            InstructGPT는 한 작업에 <M>K=4</M>에서 <M>9</M>개의 응답을 제시했다. 순위 하나는 <M>{String.raw`{K\choose2}`}</M>개의 pair를 만들지만,
            이 pair들은 서로 독립적인 prompt가 아니다.
          </p>
          <M display>{String.raw`\begin{aligned}N_{\mathrm{pair}}&=\underbrace{{K\choose2}}_{\text{두 답을 고르는 조합}}\\&=\frac{\underbrace{K}_{\text{completion 수}}(K-1)}{2}\end{aligned}`}</M>
          <FormulaNote
            meaning="왜 K(K-1)/2인가: K개 중 서로 다른 두 답을 고르는 조합 수이기 때문이다. K=4이면 6개, K=9이면 36개 비교가 생긴다. 다만 같은 completion이 여러 pair에 반복되므로 이를 독립 prompt 36개로 세면 상관 구조를 숨긴다."
            symbols={[
              ['K', '한 prompt에서 평가자에게 보여 준 completion 수'],
              ['N_pair', '그 순위에서 유도한 pairwise comparison 수'],
              ['K choose 2', '순서를 무시하고 두 completion을 고르는 조합'],
            ]}
          />
          <p>
            논문은 같은 prompt에서 나온 모든 비교를 한 batch element로 처리했다. 이렇게 하면 completion마다 한 번의 reward-model forward pass를 재사용하고,
            상관된 pair를 무작위 독립 표본처럼 반복 update해 빠르게 overfit하는 문제를 줄일 수 있다.
          </p>
        </div>
        <RankingBatchLab />
      </section>

      <section id="reward-model" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Reward model은 품질의 진짜 단위가 아니라 순서를 맞히는 자다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Reward model은 prompt와 completion을 읽고 scalar <M>{String.raw`r_\theta(x,y)`}</M>를 낸다. Bradley-Terry model은 두 scalar의 차이를
            sigmoid에 넣어 사람이 어느 답을 고를 확률로 바꾼다. 절대 score가 아니라 <strong>같은 prompt의 score 차이</strong>가 학습 신호다.
          </p>
          <M display>{String.raw`\begin{aligned}\Delta r_\theta&=\underbrace{r_\theta(x,y_w)}_{\text{선호 답 점수}}-\underbrace{r_\theta(x,y_l)}_{\text{비선호 답 점수}}\\P(y_w\succ y_l\mid x)&=\underbrace{\sigma(\Delta r_\theta)}_{\text{점수 차이를 선호 확률로 변환}}\end{aligned}`}</M>
          <FormulaNote
            meaning="왜 두 score를 빼나: 한 평가 작업 안에서 선택된 답이 다른 답보다 얼마나 앞서는지만 필요하기 때문이다. 왜 sigmoid를 쓰나: 제한 없는 score 차이를 비교 label과 맞출 수 있는 0~1 확률로 바꾸기 때문이다."
            symbols={[
              ['x', '두 응답이 공유하는 prompt'],
              ['y_w, y_l', '평가자가 선호한 completion과 덜 선호한 completion'],
              ['r_θ', 'prompt와 completion을 읽어 scalar를 내는 reward model'],
              ['σ', 'score 차이를 선호 확률로 바꾸는 sigmoid'],
            ]}
          />
          <M display>{String.raw`\begin{aligned}
\underbrace{n_p}_{\text{pair 수}}&={K\choose2}\\
\underbrace{d_{wl}}_{\text{선호 score 차이}}
&=r_\theta(x,y_w)-r_\theta(x,y_l)\\
\mathcal L_{\mathrm{RM}}
&=-\frac{1}{n_p}\sum_{(w,l)}\log\sigma(d_{wl})
\end{aligned}`}</M>
          <FormulaNote
            meaning="왜 pair loss를 평균내나: K가 다른 ranking task가 비교 수만으로 손실을 과도하게 지배하지 않게 하기 위해서다. 한 prompt의 pair를 같은 묶음으로 계산해야 completion 재사용과 상관 구조를 보존할 수 있다."
            symbols={[
              ['L_RM', 'reward model이 줄이는 ranking loss'],
              ['n_p', 'K개 completion의 ranking에서 만들 수 있는 pair 수'],
              ['d_wl', '선호한 답과 덜 선호한 답의 reward score 차이'],
              ['(w,l)', '순위에서 앞선 답과 뒤선 답으로 만든 pair'],
              ['log σ(·)', '평가자가 고른 순서에 높은 확률을 주는 log likelihood'],
            ]}
          />

          <h3>그런데 reward의 0점은 어디인가?</h3>
          <p>
            모든 completion score에 100을 더해도 두 score의 차이는 그대로다. 따라서 RM loss만으로는 절대적인 0점을 결정할 수 없다.
            하지만 PPO에서 scalar reward와 value target으로 사용하면 이 offset이 계산에 들어온다. InstructGPT는 RL 전에 labeler demonstration의 평균 reward가 0이 되도록 bias를 정규화했다.
          </p>
          <M display>{String.raw`\begin{aligned}\underbrace{r'_\theta(x,y)}_{\text{이동한 reward}}&=r_\theta(x,y)+\underbrace{c}_{\text{공통 offset}}\\\underbrace{r'_w-r'_l}_{\text{이동 뒤 차이}}&=\underbrace{r_w-r_l}_{\text{원래 차이}}\end{aligned}`}</M>
          <FormulaNote
            meaning="왜 ranking loss가 그대로인가: 같은 상수 c가 뺄셈에서 소거되기 때문이다. 왜 RL 전에 정규화하나: 순위 학습이 정하지 못한 임의의 offset을 raw reward와 value target의 의미로 착각하지 않기 위해서다."
            symbols={[
              ['c', '모든 completion에 동일하게 더한 임의의 score offset'],
              ["r'_θ", 'offset 이동 뒤 reward score'],
              ['r_w-r_l', 'Bradley-Terry 확률을 실제로 결정하는 score 차이'],
            ]}
          />
          <p>
            숫자를 직접 대입하면 offset이 무엇을 바꾸지 않는지 더 분명하다. 선호 답과 비선호 답의 score가 각각 1.2와 0.3이면
            차이는 0.9, 선호 확률은 약 71.1%, pair loss는 약 0.341이다. 두 score에 100을 더해도 세 값은 그대로다.
          </p>
          <M display>{String.raw`\begin{aligned}\underbrace{\Delta r}_{\text{원래 score 차이}}&=1.2-0.3=0.9\\\underbrace{\sigma(\Delta r)}_{\text{선호 확률}}&=\sigma(0.9)\approx0.711\\\underbrace{\Delta r'}_{\text{100 이동 뒤 차이}}&=101.2-100.3=0.9\\\underbrace{-\log\sigma(\Delta r')}_{\text{이동 뒤에도 같은 pair loss}}&\approx0.341\end{aligned}`}</M>
          <FormulaNote
            meaning="첫 두 줄은 원래 score 차이로 선호 확률과 pair loss를 계산한다. 뒤의 두 줄은 두 score에 같은 100을 더해도 차이와 ranking loss가 그대로임을 검산한다. 이 불변성은 Bradley-Terry 비교에만 해당하며, 101.2 같은 raw reward를 PPO return에 직접 넣어도 update가 같다는 뜻은 아니다."
            symbols={[
              [String.raw`\Delta r`, '선호 답 score에서 비선호 답 score를 뺀 값'],
              [String.raw`\sigma(\Delta r)`, '그 차이를 선호 확률로 바꾸는 sigmoid'],
              [String.raw`-\log\sigma(\Delta r)`, '선호 순서를 맞히지 못할수록 커지는 pair loss'],
              [String.raw`\Delta r'`, '공통 offset을 더한 뒤 다시 계산한 score 차이'],
            ]}
          />
          <p>
            이 검산은 Bradley-Terry 학습이 <strong>offset을 식별하지 못한다</strong>는 뜻이다. 반면 정규화하지 않은 101.2를 terminal
            reward로 넣으면 PPO의 return과 critic target에는 큰 상수가 실제로 들어간다. 따라서 “pair 순서는 같음”과 “RL update도 같음”은
            다른 주장이다.
          </p>
          <Misconception>
            Reward 8점이 reward 4점보다 “사람 가치가 두 배”라는 뜻은 아니다. Reward model은 특정 지침과 평가자 집단이 만든 비교 순서를 근사한 proxy다.
            Score 차이는 비교 확률과 연결되지만 절대 원점과 단위에는 임의성이 남는다.
          </Misconception>
        </div>
      </section>

      <section id="ppo-update" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">PPO에서는 답 하나가 끝난 뒤 받은 reward를 token 확률로 되돌린다</h2>
        <ConceptPrimer items={[
          { term: 'Policy gradient', meaning: '선택한 token의 log probability에 결과의 좋고 나쁨을 곱해 policy parameter를 움직이는 방법이다.', why: '환경이나 reward model을 미분하지 않고 actor가 실제로 한 선택의 확률만 바꾼다.' },
          { term: 'Critic', meaning: '현재 prompt와 token prefix에서 앞으로 받을 return의 기준값을 추정하는 model이다. InstructGPT는 이 value function을 reward model에서 초기화했다.', why: '비교 score를 학습한 표현에서 시작하고, 전체 reward 대신 기대보다 얼마나 좋았는지 advantage를 만들면 update 분산이 줄어든다.' },
          { term: 'Importance ratio', meaning: '같은 선택 token에 current policy와 rollout old policy가 준 확률의 비다.', why: 'Old rollout을 재사용하면서 current policy가 그 행동의 확률을 얼마나 바꿨는지 측정한다.' },
        ]} />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            InstructGPT 논문은 RL 환경을 <strong>한 prompt를 주고 한 response를 받은 뒤 episode가 끝나는 bandit</strong>으로 기술한다.
            Actor는 response token을 순서대로 만들지만 task reward는 완성 응답에 붙는다. Reward model에서 초기화한 critic은 각 token prefix에서 앞으로 받을 return을 추정해 advantage를 만들고,
            PPO는 rollout을 만든 old policy와 update 중인 current policy의 선택-token 확률 비율을 비교한다.
          </p>
          <M display>{String.raw`\begin{aligned}
\widehat A_t&=G_t-V_\psi(s_t)\\
\underbrace{g_t}_{\text{선택 token 방향}}
&=\nabla_\phi\log\pi_\phi(a_t\mid s_t)\\
\nabla_\phi J&\approx\widehat{\mathbb E}_t[g_t\widehat A_t]
\end{aligned}`}</M>
          <FormulaNote
            meaning="왜 return에서 critic을 빼나: 같은 prompt prefix에서 원래 기대한 수준보다 더 좋거나 나쁜 부분만 actor 신호로 남겨 분산을 줄이기 위해서다. 왜 log probability를 미분하나: 환경 전이를 미분하지 않고도 actor가 실제로 선택한 token의 확률을 advantage 부호에 따라 올리거나 내릴 수 있기 때문이다."
            symbols={[
              [String.raw`G_t`, 't번째 token 이후 얻는 실제 reward와 bootstrap value를 합친 return'],
              [String.raw`V_\psi(s_t)`, 'critic이 token prefix state에서 예측한 기준 return'],
              [String.raw`\widehat A_t`, '선택 token이 critic 기준보다 좋았는지 나타내는 advantage'],
              [String.raw`g_t`, '선택한 token의 log probability를 올리거나 내리는 parameter 방향'],
              [String.raw`\pi_\phi(a_t\mid s_t)`, 'actor가 현재 prefix에서 실제 선택 token에 준 확률'],
            ]}
          />
          <p>
            실제 PPO 글에서 등장하는 GAE(Generalized Advantage Estimation)는 여러 길이의 TD error를 섞어 <M>{String.raw`\widehat A_t`}</M>를 만드는 방법이다.
            여기서는 먼저 critic이 기준을 빼고, policy gradient가 선택 확률을 움직이며, old/current 확률비가 update 크기를 재는 세 역할만 고정한다.
          </p>
          <M display>{String.raw`\begin{aligned}\underbrace{u_t}_{\text{그대로 계산한 이득}}&=\rho_t(\phi)\widehat A_t\\\underbrace{c_t}_{\text{clip한 이득}}&=\operatorname{clip}(\rho_t,1-\epsilon,1+\epsilon)\widehat A_t\\L^{\mathrm{CLIP}}&=\widehat{\mathbb E}_t\!\left[\underbrace{\min(u_t,c_t)}_{\text{더 보수적인 항 선택}}\right]\end{aligned}`}</M>
          <FormulaNote
            meaning="Advantage가 양수이면 좋은 token의 확률비가 1+ε를 넘을 때 clipped 항이 더 작아져 과도한 확률 증가의 추가 이득을 막는다. Advantage가 음수이면 곱셈이 부등호 방향을 뒤집으므로 확률비가 1-ε 아래로 내려갈 때 clipped 항이 더 작아져 과도한 확률 감소의 추가 이득을 막는다. Min은 두 부호에서 각각 이 보수적인 항을 고른다."
            symbols={[
              ['ρ_t(φ)', 'current policy 확률을 rollout old policy 확률로 나눈 값'],
              ['Â_t', 't번째 선택 token이 baseline보다 좋았는지 나타내는 advantage'],
              ['ε', '한 update에서 허용할 probability-ratio 폭'],
              ['clip', 'ratio를 1-ε와 1+ε 사이로 제한하는 연산'],
            ]}
          />
          <p>
            부호별로 숫자를 대입하면 비대칭이 보인다. <M>{String.raw`\widehat A_t=+2`}</M>이고 <M>{String.raw`\rho_t=1.35`}</M>이면
            raw 이득 2.70 대신 upper clip의 2.40을 고른다. 반대로 <M>{String.raw`\widehat A_t=-2`}</M>이고
            <M>{String.raw`\rho_t=0.70`}</M>이면 raw 값 -1.40보다 lower clip의 -1.60을 고른다. 좋은 token을 더 올리는 방향은
            위쪽에서, 나쁜 token을 더 내리는 방향은 아래쪽에서만 추가 이득이 멈춘다. 잘못된 방향으로 움직인 손실까지 지워 주는 대칭 clamp가 아니다.
          </p>
        </div>
        <PPOUpdateLab />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Clipping은 selected action의 surrogate 이득을 자르는 장치이지 모든 token 분포의 KL을 엄밀하게 제한하는 증명은 아니다.
            그래서 실제 학습에서는 approximate KL, entropy, reward, value loss와 clip fraction을 함께 관찰한다. 이 글에서는 계산을 한 token에 좁혔고,
            일반 PPO의 GAE와 mini-batch update는 별도 policy optimization 글이 소유한다.
          </p>
        </div>
      </section>

      <section id="reference-and-ptx" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Old policy, SFT reference, pretraining data는 서로 다른 기준이다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            가장 흔한 혼동은 PPO clipping과 reference KL을 같은 장치로 읽는 것이다. Old policy는 현재 rollout batch를 만든 직전 snapshot이고,
            frozen reference는 RL 시작점인 SFT policy다. Old policy는 iteration마다 바뀔 수 있지만 reference는 누적 drift를 재기 위해 고정된다.
          </p>
          <p>
            구현에서는 완성 응답의 RM score와 token마다 생기는 reference 이탈 비용을 같은 시점에 주지 않는다.
            <M>{String.raw`s_t=(x,y_{<t})`}</M>, <M>{String.raw`a_t=y_t`}</M>라 두면, sampled log-ratio는 매 token에서 계산하고 RM
            score는 마지막 token의 reward에 한 번만 더한다.
          </p>
          <M display>{String.raw`\begin{aligned}
\ell_t
&=\log\pi_\phi(a_t\mid s_t)-\log\pi_{\mathrm{ref}}(a_t\mid s_t)\\
\widetilde r_t
&=-\beta\ell_t+\mathbf 1[t=T]\,r_\theta(x,y)\\
G_t&=\sum_{k=t}^{T}\gamma^{k-t}\widetilde r_k\\
G_1\big|_{\gamma=1}
&=r_\theta(x,y)-\beta\sum_{t=1}^{T}\ell_t
\end{aligned}`}</M>
          <FormulaNote
            meaning="RM score는 완성 응답을 본 뒤 마지막 token reward에 한 번 들어가지만, sampled reference log-ratio의 비용은 선택한 모든 token에 붙는다. 따라서 앞쪽 prefix의 G_t에는 그 뒤의 KL 비용과 terminal score가 함께 돌아오고 critic과 advantage 계산으로 연결된다. γ는 먼 reward를 얼마나 줄여 합칠지 정하지만 InstructGPT의 GAE에는 discount를 적용하지 않아 γ=1이다. 그래서 첫 token return은 terminal score에서 모든 token의 이탈 비용을 뺀 response-level reward와 같다. 이 sampled 경로의 log-ratio를 모든 응답에 대한 exact sequence KL과 동일시하면 안 된다."
            symbols={[
              ['r_θ(x,y)', 'reward model이 완성 응답에 준 scalar'],
              ['ℓ_t', '현재 actor와 frozen reference가 실제 선택 token에 준 log probability의 차이'],
              ['r̃_t', 'PPO rollout buffer에 기록하는 t번째 shaped token reward'],
              [String.raw`\mathbf 1[t=T]`, '마지막 token에서만 reward model score를 더하는 indicator'],
              ['G_t', 't번째 prefix부터 terminal까지 shaped reward를 합친 return'],
              ['π_φ', '현재 업데이트하는 RL actor'],
              ['π_ref', '고정된 SFT reference policy'],
              ['β', 'reward 상승과 reference 이탈 사이의 교환 계수'],
              ['γ', '미래 shaped reward의 할인율. InstructGPT는 discount를 쓰지 않아 1로 둔다.'],
            ]}
          />
          <p>
            여기서 <M>{String.raw`\beta`}</M>는 KL 자체가 아니라 reward와 reference 이탈 비용의 단위를 맞추는 교환 계수다.
            Cross-entropy와 <M>{String.raw`D_{\mathrm{KL}}(P\Vert Q)`}</M>의 방향부터 다시 확인하려면{' '}
            <Link className="font-semibold underline underline-offset-4" to={articlePath('ai', 'probability-information-theory')}>
              확률·정보이론 최소 기반
            </Link>
            에서 시작한다.
          </p>
          <p>
            InstructGPT는 PPO만 오래 돌렸을 때 일부 public NLP task의 성능이 떨어지는 alignment tax를 관찰했다. 이를 줄이기 위해 pretraining text의
            log likelihood gradient를 PPO gradient와 섞은 PPO-ptx를 사용했다.
          </p>
          <M display>{String.raw`\begin{aligned}J_{\mathrm{PPO\text{-}ptx}}(\phi)&=\underbrace{J_{\mathrm{PPO}}(\phi)}_{\text{reward 기반 update}}+\gamma\,J_{\mathrm{ptx}}(\phi)\\\underbrace{J_{\mathrm{ptx}}(\phi)}_{\text{기존 언어 능력 연습}}&=\mathbb E_{z\sim\mathcal D_{\mathrm{pretrain}}}\!\left[\log\pi_\phi(z)\right]\end{aligned}`}</M>
          <FormulaNote
            meaning="왜 별도 pretraining 항을 더하나: reference 가까이에 머무는 것과 원래 pretraining task의 likelihood를 직접 연습하는 것은 같은 학습 신호가 아니기 때문이다. InstructGPT ablation에서는 KL 계수를 크게 하는 것만으로 관찰된 회귀가 복구되지 않았다."
            symbols={[
              ['J_PPO', 'reward와 PPO 제약으로 높이는 policy objective'],
              ['D_pretrain', '원래 언어 능력을 다시 학습할 pretraining text 분포'],
              ['γ', 'pretraining gradient를 섞는 세기'],
              ['π_φ(z)', '현재 actor가 pretraining sequence에 준 likelihood'],
            ]}
          />
        </div>
        <TwoDistanceViz />
      </section>

      <section id="scope-and-evaluation" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">정렬된 대상은 “인류”가 아니라 수집한 선호 분포다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            InstructGPT는 약 40명의 contractor를 선별하고 상세 지침을 제공했다. 논문 자체도 이 절차가 보편적인 인간 가치가 아니라
            주로 labeler와 연구자가 표현한 선호에 맞춘다고 범위를 제한한다. 훈련 평가자 간 agreement는 72.6%였고, held-out 평가자도 같은 vendor 범위에서 모집됐다.
          </p>
        </div>
        <PreferenceScopeBand />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            좋은 평가 설계는 세 채널을 분리한다. Reward-model validation은 pair 순서를 예측하는지 보고, held-out human preference는 새 prompt와 evaluator에서
            실제 답이 선호되는지 본다. Public NLP benchmark는 기존 능력 회귀를 감시한다. Training reward 하나가 올랐다고 세 채널이 모두 좋아졌다고 결론내리면 안 된다.
          </p>
          <p>
            <strong>Reward hacking</strong>은 policy가 설계자가 원한 품질을 높이지 않고도 learned reward proxy의 허점이나 우연한 상관을 이용해 높은
            점수를 얻는 현상이다. 단순히 reward가 높거나 답의 문체가 달라졌다는 뜻이 아니다. Training RM score는 계속 오르는데 blinded held-out
            사람 선호가 정체되거나 떨어지면 proxy overoptimization을 의심해야 한다. 같은 reward model로 새 prompt만 채점한 값은 같은 허점을 공유할
            수 있으므로 독립적인 evaluator가 필요하다.
          </p>
          <p>
            Held-out capability도 별도 축이다. 사람 선호는 오르지만 수학 정확도, 코드 test pass rate, 사실성처럼 task별 verifier가 떨어진다면 이는
            reward hacking일 수도 있지만 우선 <strong>capability regression 또는 alignment tax</strong>로 기록해야 한다. 반대로 training reward와
            held-out preference·capability가 함께 오르면 알려진 진단에서는 개선이지만, 새로운 분포의 exploit까지 없다는 증명은 아니다. 따라서 학습
            curve에는 training reward, 독립 held-out preference, capability suite와 KL·response length를 같은 checkpoint 축으로 나란히 남긴다.
          </p>
          <p>
            이 기준점이 중요한 이유는 현재도 “사람 또는 model이 만든 상대 선호를 어떤 proxy로 바꾸고, policy를 얼마나 움직일 것인가”라는 문제가 남기 때문이다.
            다만 DPO, Constitutional AI, GRPO와 RLVR은 서로 다른 데이터와 update 계약을 가지므로 이 글 끝에 제품 목록으로 붙이지 않는다.
          </p>
        </div>
      </section>

      <section id="handoff" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">고전 계약을 닫은 뒤 현재 실패와 구현으로 올라간다</h2>
        <div className="not-prose border-t border-border">
          <RouteLink slug="post-training-rlvr" label="신호 선택" description="지식, demonstration, preference, verifier 중 현재 부족한 증거에서 첫 방법을 고른다." />
          <RouteLink slug="rl-ppo-continuous-control" label="PPO 수학 기반" description="이 글에서 고정한 policy gradient·critic·확률비 위에 GAE, rollout buffer와 clipped update를 일반 RL 계산으로 더 깊게 내려간다." />
          <RouteLink slug="reasoning-post-training-frontier" label="현재 실패" description="Sparse credit, exploration collapse, overthinking과 monitorability가 고전 RLHF 위에서 어떻게 달라졌는지 읽는다." />
          <RouteLink slug="open-r1" label="Open-R1 구현" description="Reward model 대신 verifier와 group advantage를 쓰는 공개 code path를 한 batch로 실행한다." />
        </div>
        <CapabilityCheck
          items={[
            'SFT, RM, PPO dataset의 한 행과 label producer를 각각 쓴다.',
            'K=4 순위에서 6개 pair를 만들고 같은 prompt 묶음임을 설명한다.',
            'Reward score 전체에 상수를 더해도 pair loss가 같은 이유를 설명한다.',
            '양수와 음수 advantage에서 PPO min이 고르는 항을 계산한다.',
            'Rollout old policy와 frozen SFT reference를 구분한다.',
            'Clipping, reference KL, pretraining gradient mix가 막는 실패를 구분한다.',
            'Reward model의 evaluator population과 held-out 평가 범위를 말한다.',
          ]}
        />
        <SourceNotes
          sources={[
            { label: 'Ouyang et al. · Training language models to follow instructions with human feedback', href: 'https://arxiv.org/abs/2203.02155', note: '세 데이터셋, K-way ranking batch, reward normalization, PPO bandit, per-token KL, PPO-ptx와 평가 범위의 canonical 근거.' },
            { label: 'Schulman et al. · Proximal Policy Optimization Algorithms', href: 'https://arxiv.org/abs/1707.06347', note: 'Old-policy sample과 clipped surrogate를 번갈아 사용하는 PPO의 원 논문.' },
            { label: 'Christiano et al. · Deep reinforcement learning from human preferences', href: 'https://arxiv.org/abs/1706.03741', note: '환경 reward 대신 trajectory segment의 인간 비교로 reward function을 학습한 최소 선행 근거.' },
          ]}
        />
      </section>
    </>
  );
}

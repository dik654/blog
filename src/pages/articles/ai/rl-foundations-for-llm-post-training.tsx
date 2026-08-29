import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import RlFoundationsForLlmPostTrainingViz from "./rl-foundations-for-llm-post-training/viz/RlFoundationsForLlmPostTrainingViz";

/**
 * Policy Gradient는 Return의 Credit을 Action 확률 변화로 바꿉니다
 *
 * 작성 규칙은 docs/coverage-batch-playbook.md 를 따른다.
 */
export default function RlFoundationsForLlmPostTrainingArticle() {
  return (
    <div id="overview" className="space-y-16">
      <section id="problem" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Policy Gradient는 Return의 Credit을 Action 확률 변화로 바꿉니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            LLM 을 강화학습(reinforcement learning, RL)으로 post-training 한다는
            것은 결국 policy 가 만든 trajectory 에 붙은 reward 를, 그 trajectory
            의 각 token 을 고른 확률이 오르거나 내리는 방향으로 바꾸는 일입니다.
            어떤 reward 를 얼마나 누적해서(return) 어느 시점의 선택으로
            돌려줄지(credit assignment)가 이 변환의 핵심 질문입니다.
          </p>
          <p>
            <Link to="/ai/rlhf#ppo">RLHF 의 PPO 절</Link> 은 policy 가 직접 만든
            response 를 reward·KL 로 평가해 clipped update 를 한다고 설명했지만,
            그 update 가 정확히 무엇을 미분하고 무엇을 몇 시점 전 action 에
            돌려주는지는 다루지 않았습니다. 이 글은 그 안쪽, RL 이론의 최소
            부품 네 가지를 채웁니다.
          </p>
          <p>
            순서는 이렇습니다. 먼저 return 을 정의해 reward 를 누적하는
            방법을 고정하고, 그 return 을 만든 데이터가 현재 policy 것인지
            아닌지(on/off-policy)를 나눕니다.
          </p>
          <p>
            그 다음 policy gradient theorem 으로 return 을 policy
            parameter 의 변화로 바꾸는 식을 유도하고, 마지막으로 그
            변화량이 trajectory 의 어느 action 에 돌아가야 하는지(credit
            assignment)의 한계를 봅니다.
          </p>
        </div>
        <RlFoundationsForLlmPostTrainingViz />
        <ContentBoundary article="rl-foundations-for-llm-post-training" />
      </section>

      <section id="return" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Return은 지금부터 받을 reward를 감가율로 누적한 값입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            강화학습은 agent 가 state 에서 action 을 고르고 reward 를 받아
            다음 state 로 넘어가는 상호작용을 trajectory 길이만큼 반복하는
            문제입니다. Return 은 어느 시점 t 이후 받을 reward 전부를 감가율
            γ(0 이상 1 미만)로 할인해 하나의 숫자로 누적한 값이고, policy 가
            최대화하려는 목표가 바로 이 return 의 기댓값입니다.
          </p>
          <p>
            3-step trajectory 에서 reward 가 r1=1, r2=0, r3=2 이고 γ=0.9 라고
            하면, t=3 부터 거꾸로 G3=2, G2=0+0.9×2=1.8, G1=1+0.9×1.8=2.62
            가 됩니다. 감가율이 1 에 가까울수록 먼 미래의 reward 도 지금
            action 의 return 에 크게 반영됩니다.
          </p>
          <p>
            LLM post-training 에서 trajectory 는 흔히 한 response 의 token
            나열이고, action 은 각 token 선택, reward 는 <Link to="/ai/reward-design-for-verifiable-rl#rlvr">
            verifier 나 reward model
          </Link> 이 매기는 점수입니다. Return 은 그 reward 를 token 단위
            action 하나하나로 되돌리는 첫 단계일 뿐, 아직 어떻게
            분배할지는 정하지 않습니다.
          </p>
        </div>
        <TermBreakdown
          title="Trajectory를 이루는 최소 어휘"
          items={[
            { term: "Reinforcement Learning (RL)", description: "Agent가 state·action·reward 상호작용을 반복하며 return을 최대화하는 policy를 찾는 학습 방식입니다.", example: "LLM이 token을 골라(action) verifier 점수(reward)를 받는 과정", boundary: "Reward만 정의해서는 RL이 되지 않고, 그 reward를 policy 개선 신호로 바꾸는 update 규칙이 함께 있어야 합니다." },
            { term: "Return (G_t)", description: "시점 t 이후 받을 reward를 감가율 γ로 할인해 누적한 값입니다.", example: "r1=1, r2=0, r3=2, γ=0.9 → G1=2.62", boundary: "Return은 그 자체로 policy를 바꾸지 않고, 다음 절의 policy gradient가 이 값을 gradient 방향으로 바꿉니다." },
          ]}
        />
      </section>

      <section id="on-vs-off-policy" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          On-Policy는 현재 policy 데이터만, Off-Policy는 다른 policy 데이터도 씁니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            On-policy learning 은 update 에 쓰는 trajectory 가 반드시 지금
            update 하려는 policy 자신이 만든 것이어야 하는 학습 방식이고,
            off-policy learning 은 과거의 자신이나 별도 behavior policy 가
            만든 trajectory 를 재사용해도 되는 학습 방식입니다. 이 구분은
            같은 환경 상호작용 하나를 몇 번까지 다시 써도 되는지를 가릅니다.
          </p>
          <p>
            On-policy 방식은 batch 를 한 번 쓰고 나면 policy 가 이미
            바뀌었으므로 그 batch 를 버리고 새로 rollout 해야 합니다.
            Trajectory 2,048 개를 뽑아 update 를 몇 epoch 반복한 뒤 그대로
            버린다면, 환경 상호작용 한 번당 얻는 gradient step 수가 적어
            표본 효율이 낮습니다.
          </p>
          <p>
            Off-policy 방식은 replay buffer 에 과거 trajectory 를 최대
            100만 개까지 쌓아 두고, 새 상호작용 없이도 그 buffer 에서
            minibatch 를 계속 뽑아 update 합니다. 같은 transition 하나가
            수백~수천 번 재사용될 수 있어 환경 상호작용당 update 수는
            늘지만, 그 데이터를 만든 policy 와 지금 policy 의 차이가 커질수록
            update 방향이 왜곡되는 대가가 붙습니다.
          </p>
          <p>
            <Link to="/ai/open-r1#grpo-process">GRPO 의 group sampling</Link>
            은 같은 prompt 에서 현재 policy 로 여러 completion 을 한 번에
            뽑아 그 그룹 안에서 상대 advantage 를 계산하는 방법으로, 이
            completion 들이 매 update 마다 현재 policy 로 새로 뽑힌다는
            점에서 on-policy 쪽 사례입니다.
          </p>
        </div>
        <TermBreakdown
          title="On-Policy와 Off-Policy의 자리"
          items={[
            { term: "On-Policy Learning", description: "지금 update 하려는 policy가 직접 만든 data만 사용합니다.", example: "PPO·GRPO의 매 update 직전 rollout", boundary: "Batch를 한 번 쓰면 버려야 해 환경 상호작용당 얻는 update 수가 적습니다." },
            { term: "Off-Policy Learning", description: "다른(과거 또는 별도) policy가 만든 data를 재사용합니다.", example: "Replay buffer에서 뽑은 과거 transition으로 update", boundary: "데이터를 만든 policy와 현재 policy가 멀어질수록 update 왜곡 위험이 커집니다." },
          ]}
        />
      </section>

      <section id="policy-gradient" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Policy Gradient Theorem은 Return을 log-prob 기울기로 바꿉니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Return 의 기댓값을 policy parameter θ 로 직접 미분하려면 문제가
            생깁니다. Trajectory 를 만드는 action sampling 이 이산적이라
            미분 경로가 없기 때문입니다. Policy gradient theorem 은 이 기댓값의
            gradient 를, 실제로 고른 action 의 log-probability 를 return 으로
            가중한 또 다른 기댓값으로 바꿔 이 문제를 우회합니다.
          </p>
          <p>
            이 결과를 Monte Carlo trajectory 표본 하나로 추정해 그대로
            update 에 쓰는 방법이 REINFORCE 입니다. Trajectory 를 뽑고,
            각 시점의 return 을 계산하고, 그 return 으로 가중한
            log-probability gradient 를 더해 한 번 update 합니다.
          </p>
        </div>
        <ExplainedFormula
          question="Return의 기댓값을 policy parameter로 어떻게 미분하나요?"
          idea="Action sampling은 미분할 수 없지만, log 미분 항등식을 쓰면 기댓값의 gradient를 gradient의 기댓값으로 바꿔 trajectory 표본만으로 추정할 수 있는 형태가 됩니다."
          formula={String.raw`\nabla_\theta J(\theta)=\mathbb{E}_{\tau\sim\pi_\theta}\left[\sum_{t=0}^{T-1}\nabla_\theta\log\pi_\theta(a_t\mid s_t)\,G_t\right]`}
          annotatedFormula={String.raw`\nabla_\theta J(\theta)=\underbrace{\mathbb{E}_{\tau\sim\pi_\theta}}_{\text{현재 policy로 뽑은 trajectory 표본 평균}}\left[\sum_{t=0}^{T-1}\underbrace{\nabla_\theta\log\pi_\theta(a_t\mid s_t)}_{\text{고른 action의 log-probability 기울기}}\,\underbrace{G_t}_{\text{그 시점 이후 받은 return}}\right]`}
          operations={[
            { expression: String.raw`\nabla_\theta\log\pi_\theta(a_t\mid s_t)`, annotation: ["실제로 고른 action의 확률에 log를 취해 θ로 미분해", "그 action을 더/덜 고르는 방향의 벡터를 만듦"] },
            { expression: "G_t", annotation: ["그 시점 이후 받은 감가 누적 reward를", "위 방향 벡터의 크기(가중치)로 사용"] },
            { expression: String.raw`\mathbb{E}_{\tau\sim\pi_\theta}[\cdot]`, annotation: ["현재 policy로 여러 trajectory를 뽑아", "표본 평균으로 기댓값을 근사"] },
          ]}
          terms={[
            { symbol: String.raw`\theta`, name: "policy parameter", description: "Neural network 등 policy를 정의하는 학습 가능한 parameter입니다." },
            { symbol: String.raw`\pi_\theta(a_t\mid s_t)`, name: "policy", description: "현재 state에서 각 action을 고를 확률을 내놓는 함수입니다." },
            { symbol: "G_t", name: "return", description: "시점 t 이후 받은 reward를 감가율로 누적한 값입니다." },
            { symbol: String.raw`\tau`, name: "trajectory", description: "한 episode 동안의 state·action·reward 나열입니다." },
          ]}
          assumptions={["Trajectory는 지금 미분하려는 policy π_θ 자신이 만든 것이어야 합니다(on-policy).", "Reward 함수와 환경 전이 자체는 미분 가능할 필요가 없고 policy만 미분 가능하면 됩니다."]}
          interpretation="이 gradient는 실제로 고른 action의 log-probability를 그 뒤에 받은 return만큼 밀어 올리거나 내립니다. Return이 크면 그 action을 더 자주, 작거나 음수면 덜 자주 고르게 하되, 어떤 action이 진짜 원인이었는지는 이 식이 구분하지 않습니다."
        />
        <AlgorithmBlock
          title="REINFORCE 한 step"
          input={["Policy π_θ", "환경(state·reward를 돌려주는 상호작용)"]}
          steps={[
            { code: "τ = (s0,a0,r1,…,s_{T-1},a_{T-1},r_T) ~ π_θ 로 trajectory 하나 생성", note: "지금 update 하려는 θ 자신으로 직접 뽑아야 on-policy 가정이 성립합니다." },
            { code: "for t = T-1 downto 0: G_t ← r_{t+1} + γ·G_{t+1}", note: "trajectory 끝에서부터 거꾸로 계산해 매 시점의 return을 얻습니다." },
            { code: "θ ← θ + α · Σ_t ∇_θ log π_θ(a_t|s_t) · G_t", note: "각 시점의 log-probability gradient를 그 시점 return으로 가중해 한 번에 update합니다." },
          ]}
          output="갱신된 θ — 다음 trajectory는 이 새 θ로 다시 뽑아야 on-policy 가정이 유지됩니다."
          repeatUntil="policy 성능이 수렴하거나 정해진 episode 예산을 소진할 때까지"
        />
        <div id="paper-policy-gradient" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Sutton, McAllester, Singh, Mansour · Policy Gradient Methods for Reinforcement Learning with Function Approximation"
            citeKey={1}
            href="https://proceedings.neurips.cc/paper/1999/hash/464d828b85b0bed98e80ade0a5c43b0f-Abstract.html"
          >
            1999 년 NeurIPS 논문은 value function 근사가 action 선택의
            불연속성 때문에 수렴을 보장하기 어렵다는 문제에서, policy 를
            직접 parameterize 하고 기대 reward 의 gradient 로 update 하는
            policy gradient theorem 을 제시하고 임의의 미분 가능한 함수
            근사기에 대한 첫 수렴 증명을 보였습니다. 결과는 논문이 다룬
            일반 MDP 정식화와 tabular·근사 policy 조건에 한정됩니다.
          </CitationBlock>
        </div>
      </section>

      <section id="credit-assignment" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Credit Assignment는 하나의 Return을 여러 Action에 나누는 문제입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Credit assignment problem 은 trajectory 끝에서 받은 reward
            (또는 그것이 누적된 return)를 그 이전의 어느 action 에 얼마나
            돌려줘야 하는지 정하는 문제입니다. REINFORCE 의 return G_t 는
            이 몫을 시점 거리만 따라 γ 의 거듭제곱으로 줄어드는 형태로
            정하고, 각 action 이 실제로 결과에 얼마나 기여했는지는 따로
            묻지 않습니다.
          </p>
          <p>
            5-step trajectory 에서 마지막에만 reward +1 을 받고 γ=0.9 라면
            첫 action 의 return 은 G1=γ⁴≈0.656 입니다. 같은 γ 를 20-step
            trajectory 에 적용하면 첫 action 의 return 은 γ¹⁹≈0.135 로
            줄어듭니다.
          </p>
          <p>
            Trajectory 가 길어질수록 이른 action 에 남는 신호가 옅어지는
            것이 long-horizon credit assignment 가 어려운 이유이며, LLM 의
            긴 reasoning trace 나 다단계 agent trajectory 에서 특히
            두드러집니다.
          </p>
        </div>
        <TermBreakdown
          title="Credit Assignment의 두 층위"
          items={[
            { term: "Credit Assignment", description: "trajectory 끝의 reward를 이전 각 action에 나누는 문제입니다.", example: "return G_t = γ^(T-t)·r_T 로 시점 거리만큼 할인해 분배", boundary: "이 분배는 시간 거리만 반영하고 각 action의 실제 인과 기여도는 구분하지 못합니다." },
            { term: "Long-Horizon Credit Assignment", description: "Trajectory 길이 T가 커질수록 credit assignment가 더 어려워지는 상황입니다.", example: "T=5의 G1≈0.656 대 T=20의 G1≈0.135", boundary: "신호가 옅어질 뿐 아니라 Monte Carlo return 추정의 분산도 함께 커집니다." },
          ]}
        />
        <ProgressiveDetail
          title="Credit assignment 문제를 완화하는 방법이 있나요?"
          preview="Baseline을 빼 분산을 줄이거나 중간 reward를 추가하는 방법이 흔하지만, 이 글은 return 자체의 한계를 보이는 데 그치고 구체적 완화 방법은 다음 글이 다룹니다."
        >
          <p>
            Return 에서 상태별 baseline(평균적으로 기대되는 return)을 빼
            advantage 를 쓰면 분산은 줄지만 어떤 action 이 원인인지 구분하는
            문제 자체가 사라지지는 않습니다. GRPO 의 group 상대 advantage도
            이런 baseline 절충의 한 형태입니다.
          </p>
          <p>
            더 직접적인 완화는 reward 자체를 마지막 한 번이 아니라 중간
            단계마다 주는 것입니다. Reward 를 sparse 하게 줄지 dense 하게
            줄지, 그리고 그 reward 가 무엇을 검증하는지는{" "}
            <Link to="/ai/reward-design-for-verifiable-rl#sparse-vs-dense">
              다음 글
            </Link>
            의 주제입니다.
          </p>
        </ProgressiveDetail>
        <div id="paper-rl-textbook" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Sutton, Barto · Reinforcement Learning: An Introduction (2nd ed.)"
            citeKey={2}
            href="https://mitpress.mit.edu/9780262039246/reinforcement-learning/"
          >
            2018 년 개정판은 return·policy gradient·credit assignment를
            포함한 RL 의 표준 정식화와 REINFORCE 를 비롯한 기초 알고리즘을
            체계적으로 정리한 교과서입니다. 이 글의 return·credit
            assignment 정의는 이 교과서의 일반 정식화를 따르되, LLM
            trajectory 에 맞는 예시로 바꿔 썼습니다.
          </CitationBlock>
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            다음 글은 이 credit assignment 문제 위에 놓이는 질문, 즉 reward
            자체를 무엇으로 어떻게 설계할지를 다룹니다.{" "}
            <Link to="/ai/reward-design-for-verifiable-rl#overview">
              Reward 설계: verifiable reward·sparse/dense/process·reward
              hacking·shaping
            </Link>
            에서 이어집니다.
          </p>
        </div>
      </section>
    </div>
  );
}

import ExplainedFormula from "@/components/ui/explained-formula";
import OnlineOfflineViz from "./viz/OnlineOfflineViz";

export default function PPO() {
  return (
    <section id="ppo" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        PPO-RLHF는 online response에서 constrained policy update를 반복한다
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          PPO-RLHF의 구분점은 현재 policy가 직접 response를 sample한다는 데 있다.
          Reward model이 완성된 response에 점수를 주고 reference policy에서 멀어진
          정도를 penalty로 빼며, value function은 token trajectory의 baseline을
          추정한다. 이 sample–score–update loop 덕분에 현재 policy의 support를
          따라갈 수 있지만, generation engine과 학습 cluster를 함께 운영해야 한다.
        </p>
      </div>

      <OnlineOfflineViz />

      <ExplainedFormula
        question="Reward를 높이면서 SFT policy에서 무제한으로 멀어지는 것을 어떻게 제어할까?"
        idea={<>Reward maximization에 reference policy와의 KL cost를 함께 두면, reward가 충분히 좋아질 때만 기존 token distribution을 바꾸게 됩니다. β는 reward 한 단위와 policy drift 한 단위의 환율입니다.</>}
        formula={String.raw`\begin{aligned}\ell_{KL}(x,y)&=\log\frac{\pi_\theta(y\mid x)}{\pi_{ref}(y\mid x)}\\R_{KL}(x,y)&=r_\phi(x,y)-\beta\ell_{KL}(x,y)\\J(\theta)&=\mathbb E_{x\sim\mathcal D,\,y\sim\pi_\theta}[R_{KL}(x,y)]\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}
\ell_{KL}
 &=\underbrace{\log\frac{\pi_\theta(y\mid x)}{\pi_{ref}(y\mid x)}}_{\text{reference 대비 policy 이동량}}\\
R_{KL}
 &=\underbrace{r_\phi(x,y)}_{\text{선호 proxy 보상}}
  -\underbrace{\beta\ell_{KL}}_{\text{distribution drift 가격}}\\
J(\theta)
 &=\underbrace{\mathbb E_{x\sim\mathcal D,\,y\sim\pi_\theta}[R_{KL}]}_{\text{현재 policy가 만든 응답에서 평균}}
\end{aligned}`}
        operations={[
          { expression: String.raw`\pi_\theta/\pi_{ref}`, annotation: ["같은 response를 현재·기준 policy가", "얼마나 다르게 보는지 비율로 비교"] },
          { expression: String.raw`\log(\pi_\theta/\pi_{ref})`, annotation: ["token별 probability ratio를", "sequence에서 더할 수 있는 log-ratio로 변환"] },
          { expression: String.raw`r_\phi-\beta\ell_{KL}`, annotation: ["reward 이득에서", "reference 이탈 비용을 차감"] },
          { expression: String.raw`y\sim\pi_\theta`, annotation: ["과거 고정 data가 아니라", "현재 policy support를 online 평가"] },
        ]}
        terms={[
          { symbol: String.raw`\pi_\theta`, name: "policy", description: "응답을 sample하며 update되는 language model입니다." },
          { symbol: String.raw`\pi_{ref}`, name: "reference policy", description: "보통 SFT checkpoint를 고정해 drift의 기준으로 사용합니다." },
          { symbol: "r_\\phi", name: "reward model", description: "Preference data에서 학습한 sequence-level proxy score입니다." },
          { symbol: String.raw`\beta`, name: "KL coefficient", description: "높을수록 reference 근처의 보수적인 update를 선호합니다." },
        ]}
        assumptions={["기대값의 응답 y는 현재 policy에서 sample하므로 objective가 online distribution을 따릅니다.", "표시한 log-ratio는 sequence 합으로 구현할 수 있으며 실제 system은 token-level KL shaping을 사용하기도 합니다."]}
        interpretation="KL은 reward hacking을 판별하는 detector가 아니라 policy drift의 비용입니다. 잘못된 reward를 reference 근처에서 최적화하는 shortcut까지 자동으로 막아 주지는 않습니다."
      />

      <ExplainedFormula
        question="같은 rollout batch를 여러 epoch 학습할 때 policy가 한 번에 너무 크게 바뀌는 것을 어떻게 제한할까?"
        idea={<>PPO는 새 policy와 rollout을 만든 old policy의 token probability ratio를 사용합니다. Advantage 방향의 update는 허용하되 ratio가 1±ε 밖으로 나가면 surrogate benefit을 잘라, 한 batch에서 더 밀어붙일 유인을 줄입니다.</>}
        formula={String.raw`\begin{aligned}\rho_t&=\frac{\pi_\theta(a_t\mid s_t)}{\pi_{old}(a_t\mid s_t)}\\u_t&=\rho_t\hat A_t\\c_t&=\operatorname{clip}(\rho_t,1-\epsilon,1+\epsilon)\hat A_t\\L^{CLIP}(\theta)&=\mathbb E_t[\min(u_t,c_t)]\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}
\rho_t
 &=\underbrace{\frac{\pi_\theta(a_t\mid s_t)}{\pi_{old}(a_t\mid s_t)}}_{\text{rollout 뒤 token 확률 변화 비율}}\\
u_t
 &=\underbrace{\rho_t\hat A_t}_{\text{advantage 방향의 원래 update 이득}}\\
c_t
 &=\underbrace{\operatorname{clip}(\rho_t,1-\epsilon,1+\epsilon)}_{\text{허용 비율 밖 변화 고정}}\hat A_t\\
L^{CLIP}
 &=\underbrace{\mathbb E_t[\min(u_t,c_t)]}_{\text{더 낙관적인 이득을 선택하지 않음}}
\end{aligned}`}
        operations={[
          { expression: String.raw`\pi_\theta/\pi_{old}`, annotation: ["같은 sampled token이", "update 후 얼마나 더/덜 가능해졌는지 비교"] },
          { expression: String.raw`\rho_t\hat A_t`, annotation: ["좋은 action은 확률을 높이고", "나쁜 action은 낮추는 방향을 부여"] },
          { expression: String.raw`\operatorname{clip}(\rho_t,1-\epsilon,1+\epsilon)`, annotation: ["한 rollout batch를 반복 학습해도", "surrogate 이득이 계속 커지지 않게 제한"] },
          { expression: String.raw`\min(u_t,c_t)`, annotation: ["원래 항과 제한 항 중", "보수적인 objective를 선택"] },
        ]}
        terms={[
          { symbol: "s_t,a_t", name: "state·action", description: "LLM에서는 prompt와 prefix가 state, 다음 token이 action입니다." },
          { symbol: String.raw`\pi_{old}`, name: "behavior policy", description: "현재 rollout batch를 생성한 update 이전 policy입니다." },
          { symbol: String.raw`\hat A_t`, name: "advantage estimate", description: "선택한 token이 baseline보다 얼마나 나았는지 추정합니다." },
          { symbol: String.raw`\epsilon`, name: "clip range", description: "Probability-ratio surrogate의 허용 폭입니다." },
        ]}
        assumptions={["Clipping은 objective의 일부이며 모든 parameter-space 변화에 대한 엄밀한 trust region은 아닙니다.", "Sequence 끝에서만 나오는 reward를 token별 advantage로 바꾸는 계산은 아래 GAE 식이 담당합니다."]}
        interpretation="Clipped term은 update 안정성을 위한 장치입니다. ε를 특정 상수로 외우기보다 KL, clip fraction, reward와 capability regression을 함께 보며 정합니다."
      />

      <ExplainedFormula
        question="Sequence 끝에서만 나오는 reward를 각 token의 advantage Â_t로 어떻게 나누나요?"
        idea={<>먼저 각 step의 TD residual(실제로 받은 보상과 다음 state 가치의 합에서 현재 state 가치 예측을 뺀 값)을 구합니다. 뒤쪽 residual을 γλ로 할인해 재귀적으로 누적하면, λ 하나로 bias(짧게 자름)와 variance(멀리까지 봄)를 조절할 수 있는 advantage 추정치가 됩니다.</>}
        formula={String.raw`\delta_t=r_t+\gamma V(s_{t+1})-V(s_t),\qquad \hat A_t=\sum_{l=0}^{\infty}(\gamma\lambda)^l\delta_{t+l}`}
        annotatedFormula={String.raw`\begin{aligned}
\delta_t&=\underbrace{r_t+\gamma V(s_{t+1})-V(s_t)}_{\text{한 step의 TD residual — 실제 결과와 value 예측의 차이}}\\
\hat A_t&=\underbrace{\delta_t+\gamma\lambda\hat A_{t+1}}_{\text{다음 step의 advantage를 할인해 재귀적으로 더함}}\\
&=\underbrace{\sum_{l=0}^{\infty}(\gamma\lambda)^l\delta_{t+l}}_{\text{재귀를 풀면 먼 미래일수록 작은 weight로 반영}}
\end{aligned}`}
        operations={[
          { expression: String.raw`r_t+\gamma V(s_{t+1})-V(s_t)`, annotation: ["실제 보상과 다음 state 가치를 더해", "현재 state 가치 예측과 비교"] },
          { expression: String.raw`\delta_t+\gamma\lambda\hat A_{t+1}`, annotation: ["이번 step의 residual에", "다음 step의 advantage를 할인해서 더함"] },
          { expression: String.raw`\sum_{l=0}^{\infty}(\gamma\lambda)^l\delta_{t+l}`, annotation: ["재귀를 풀어쓰면", "먼 미래 residual일수록 작은 weight로 반영"] },
        ]}
        terms={[
          { symbol: "r_t", name: "step reward", description: "LLM RLHF에서는 마지막 token에서만 0이 아니고 중간 step은 보통 KL penalty만 있습니다." },
          { symbol: "V(s_t)", name: "value baseline", description: "별도로 학습한 value head가 예측한 state의 기대 return입니다." },
          { symbol: String.raw`\gamma`, name: "discount factor", description: "LLM 생성은 episode가 짧아 보통 γ=1을 씁니다." },
          { symbol: String.raw`\lambda`, name: "GAE parameter", description: "λ=1이면 Monte Carlo advantage, λ=0이면 1-step TD만 쓰는 두 극단을 잇습니다." },
        ]}
        assumptions={["V(s_t)는 policy와 별도(또는 공유 backbone의 별도 head)로 학습된 value network입니다.", "Episode가 끝나는 시점 이후 δ는 0으로 취급해 합을 유한하게 자릅니다."]}
        interpretation="λ=1이면 Â_t는 남은 전체 return과 baseline의 차이(Monte Carlo advantage)와 같아지고, λ=0이면 1-step TD residual만 씁니다. 대부분의 RLHF 구현은 λ를 0.9~1 사이로 둬 variance를 줄이면서도 bias를 크게 늘리지 않습니다."
      />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>네 역할과 네 벌의 full model은 같은 말이 아니다</h3>
        <p>
          Policy, value, reward와 reference는 논리적으로 구분되지만 value head가
          policy backbone을 공유하거나 frozen model을 sharding하고 reference
          log-prob을 미리 계산하는 구현도 있다. Memory cost는 역할의 개수가 아니라
          trainable parameter와 optimizer state, activation, rollout KV cache,
          reference cache를 기준으로 계산해야 한다.
        </p>
        <p>
          PPO 원 논문은 interaction에서 sample한 data와 clipped surrogate를 반복
          최적화하는 일반 RL algorithm을 제안했고, LLM의 sequence reward와 KL
          shaping은 RLHF pipeline에서 결합된 것이다. 두 층을 구분해서 읽어야 PPO
          clipping과 alignment 안전장치를 같은 것으로 오해하지 않는다.
        </p>
      </div>

      <div
        id="paper-ppo"
        className="not-prose mt-8 scroll-mt-24 border-l border-border/80 pl-4"
      >
        <p className="text-xs font-bold text-primary">논문 해설 · PPO</p>
        <h3 className="mt-2 text-base font-bold text-foreground">
          PPO 원 논문의 기여와 LLM RLHF에서 추가된 층은 구분해야 한다
        </h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          PPO는 old policy에서 모은 trajectory를 여러 minibatch epoch에 재사용할
          때 probability ratio가 과도하게 변하는 유인을 clipped surrogate로
          줄였습니다. Reward model, SFT reference, token-level KL shaping은 PPO
          자체의 정의가 아니라 이후 LLM RLHF pipeline에서 결합된 구성입니다.
        </p>
      </div>
    </section>
  );
}

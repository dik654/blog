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
        terms={[
          { symbol: "\pi_\theta", name: "policy", description: "응답을 sample하며 update되는 language model입니다." },
          { symbol: "\pi_{ref}", name: "reference policy", description: "보통 SFT checkpoint를 고정해 drift의 기준으로 사용합니다." },
          { symbol: "r_\phi", name: "reward model", description: "Preference data에서 학습한 sequence-level proxy score입니다." },
          { symbol: "\beta", name: "KL coefficient", description: "높을수록 reference 근처의 보수적인 update를 선호합니다." },
        ]}
        assumptions={["기대값의 응답 y는 현재 policy에서 sample하므로 objective가 online distribution을 따릅니다.", "표시한 log-ratio는 sequence 합으로 구현할 수 있으며 실제 system은 token-level KL shaping을 사용하기도 합니다."]}
        interpretation="KL은 reward hacking을 판별하는 detector가 아니라 policy drift의 비용입니다. 잘못된 reward를 reference 근처에서 최적화하는 shortcut까지 자동으로 막아 주지는 않습니다."
      />

      <ExplainedFormula
        question="같은 rollout batch를 여러 epoch 학습할 때 policy가 한 번에 너무 크게 바뀌는 것을 어떻게 제한할까?"
        idea={<>PPO는 새 policy와 rollout을 만든 old policy의 token probability ratio를 사용합니다. Advantage 방향의 update는 허용하되 ratio가 1±ε 밖으로 나가면 surrogate benefit을 잘라, 한 batch에서 더 밀어붙일 유인을 줄입니다.</>}
        formula={String.raw`\begin{aligned}\rho_t&=\frac{\pi_\theta(a_t\mid s_t)}{\pi_{old}(a_t\mid s_t)}\\u_t&=\rho_t\hat A_t\\c_t&=\operatorname{clip}(\rho_t,1-\epsilon,1+\epsilon)\hat A_t\\L^{CLIP}(\theta)&=\mathbb E_t[\min(u_t,c_t)]\end{aligned}`}
        terms={[
          { symbol: "s_t,a_t", name: "state·action", description: "LLM에서는 prompt와 prefix가 state, 다음 token이 action입니다." },
          { symbol: "\pi_{old}", name: "behavior policy", description: "현재 rollout batch를 생성한 update 이전 policy입니다." },
          { symbol: "\hat A_t", name: "advantage estimate", description: "선택한 token이 baseline보다 얼마나 나았는지 추정합니다." },
          { symbol: "\epsilon", name: "clip range", description: "Probability-ratio surrogate의 허용 폭입니다." },
        ]}
        assumptions={["Clipping은 objective의 일부이며 모든 parameter-space 변화에 대한 엄밀한 trust region은 아닙니다.", "Sequence reward를 token advantage로 바꾸는 return·GAE·value fitting 세부가 생략되어 있습니다."]}
        interpretation="Clipped term은 update 안정성을 위한 장치입니다. ε를 특정 상수로 외우기보다 KL, clip fraction, reward와 capability regression을 함께 보며 정합니다."
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

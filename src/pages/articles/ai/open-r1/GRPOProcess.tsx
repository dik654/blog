import ExplainedFormula from "@/components/ui/explained-formula";
import OnlineLoopViz from "./viz/OnlineLoopViz";
import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";

export default function GRPOProcess({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="grpo-process" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        GRPO는 현재 policy의 completion을 같은 prompt 안에서 상대 비교한다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">
          Group Relative Policy Optimization(GRPO)은 prompt 하나에서 현재
          policy로 여러 completion을 sampling하고 reward를 계산한 뒤, 같은 group
          안에서 상대적으로 좋은 completion의 log-probability를 높입니다.
          PPO처럼 별도의 learned value model을 두지 않는다는 점이 눈에 띄지만,
          rollout·verification과 policy log-probability 계산 비용까지 없어지는
          것은 아닙니다.
        </p>
      </div>

      <OnlineLoopViz />

      <div
        id="paper-deepseekmath-grpo"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          핵심 논문 · DeepSeekMath의 GRPO
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          DeepSeekMath가 풀려던 문제는 PPO에서 prompt마다 value model을 함께
          학습하는 메모리·계산 부담이었습니다. 핵심 아이디어는 같은 prompt에서
          여러 output을 뽑아 group reward의 평균을 baseline으로 사용하고, 별도
          critic 없이 상대 advantage를 만드는 것입니다. 논문은 DeepSeekMath 7B와
          수학 data·reward 조건에서 이 방법을 평가했으므로, GRPO만 붙이면 임의의
          base model과 domain에서 같은 reasoning gain이 난다는 결론으로 넓히면
          안 됩니다.
        </p>
        <a
          className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
          href="https://arxiv.org/abs/2402.03300"
          target="_blank"
          rel="noreferrer"
        >
          원 논문의 group-relative baseline과 실험 조건 보기
        </a>
      </div>

      <ExplainedFormula
        question="서로 난도가 다른 prompt에서 reward를 어떻게 상대 신호로 바꾸는가?"
        idea={
          <>
            같은 prompt에서 뽑은 G개 reward의 평균을 기준으로 각 completion이
            group보다 얼마나 나은지 계산합니다. Standard deviation으로 나누는
            것은 scale을 맞추지만, prompt difficulty bias를 만들 수 있어 현재
            TRL에서는 끄거나 batch-level scaling을 선택할 수 있습니다.
          </>
        }
        formula={String.raw`\widehat A_i=\frac{r_i-\overline r}{s_r+\varepsilon},\qquad \overline r=\frac1G\sum_{j=1}^{G}r_j`}
        terms={[
          {
            symbol: "G",
            name: "group size",
            description: "같은 prompt에서 sampling한 completion 개수입니다.",
          },
          {
            symbol: "r_i",
            name: "completion reward",
            description:
              "여러 reward가 있다면 설정한 aggregation 뒤 i번째 completion이 받은 값입니다.",
          },
          {
            symbol: "\\overline r,s_r",
            name: "group 통계",
            description: "같은 prompt reward의 평균과 표준편차입니다.",
          },
          {
            symbol: "\\widehat A_i",
            name: "relative advantage",
            description:
              "Group 평균보다 높은 completion은 양수, 낮은 completion은 음수가 됩니다.",
          },
        ]}
        assumptions={[
          "Reward가 sequence 단위로 주어지고 group 안 completion들이 같은 prompt를 공유합니다.",
          "모든 reward가 같으면 분별 신호가 없으므로 zero-std group 비율을 별도 추적합니다.",
        ]}
        interpretation="GRPO는 절대 난도를 맞히는 value function 대신 같은 문제의 후보들을 비교합니다. Group이 전부 맞거나 전부 틀리면 update에 유용한 상대 정보가 거의 없습니다."
      />
      <div className="not-prose my-4">
        <CodeViewButton
          label="TRL GRPOTrainer — advantage 계산"
          onClick={() => onCodeRef("grpo-advantage", codeRefs["grpo-advantage"])}
        />
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Advantage가 정해져도 policy를 얼마나 움직일지는 별도 문제다</h3>
        <p className="leading-8">
          Rollout을 만든 old policy와 update할 policy의 token probability 비율을
          사용하면, 이미 probability가 크게 달라진 token이 update를 지배하지
          않도록 clipping할 수 있습니다. Reference policy에 대한 KL penalty도
          선택할 수 있지만, 현재 TRL의 기본 <code>beta</code>는 0이므로
          “GRPO에는 항상 KL이 들어간다”고 일반화하면 안 됩니다. DeepSeek-R1의
          보고 설정과 현재 library default를 구분해야 합니다.
        </p>
      </div>

      <ExplainedFormula
        question="Relative advantage를 policy token의 update로 어떻게 전달하는가?"
        idea={
          <>
            새 policy와 rollout policy의 probability ratio에 advantage를 곱하고,
            ratio를 신뢰 구간 밖으로 밀어 얻는 추가 이득은 clip합니다. 아래는
            핵심 surrogate 한 token을 보여 주며 전체 loss는 유효 completion
            token에 aggregation합니다.
          </>
        }
        formula={String.raw`\begin{aligned}
u_{i,t}&=\rho_{i,t}\widehat A_i\\
c_{i,t}&=\operatorname{clip}(\rho_{i,t},1-\epsilon,1+\epsilon)\widehat A_i\\
\ell_{i,t}&=\min(u_{i,t},c_{i,t})
\end{aligned}`}
        terms={[
          {
            symbol: "\\rho_{i,t}",
            name: "policy ratio",
            description:
              "πθ(token|prefix)를 rollout old policy 확률로 나눈 값입니다.",
          },
          {
            symbol: "\\widehat A_i",
            name: "sequence advantage",
            description:
              "해당 completion의 reward에서 만든 신호가 completion token에 전달됩니다.",
          },
          {
            symbol: "\\epsilon",
            name: "clip radius",
            description:
              "한 rollout batch로 policy ratio를 얼마나 멀리 움직일지 제한합니다.",
          },
          {
            symbol: "\\ell_{i,t}",
            name: "token surrogate",
            description:
              "최대화할 clipped contribution이며 구현 loss에서는 음수를 취합니다.",
          },
          {
            symbol: "u_{i,t},c_{i,t}",
            name: "원래 항과 clipped 항",
            description:
              "Policy ratio를 그대로 쓴 contribution과 trust region으로 제한한 contribution입니다.",
          },
        ]}
        assumptions={[
          "여러 update iteration에서 rollout policy와 training policy가 달라질 수 있는 clipped form입니다.",
          "Length normalization, KL term과 importance-sampling correction은 구현·loss_type에 따라 달라집니다.",
        ]}
        interpretation="GRPO라는 이름만 같아도 advantage scaling, token aggregation, clip과 KL 설정이 다르면 update는 달라집니다. 따라서 알고리즘 이름보다 실제 trainer version과 config를 기록합니다."
      />
      <div className="not-prose my-4">
        <CodeViewButton
          label="TRL GRPOTrainer — clipped surrogate loss"
          onClick={() => onCodeRef("grpo-clipped-loss", codeRefs["grpo-clipped-loss"])}
        />
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>긴 reasoning에서는 loss normalization도 학습 신호다</h3>
        <p className="leading-8">
          Original sample-level aggregation은 response length bias를 만들 수
          있다는 후속 분석이 나왔고, DAPO는 group 전체 active token 수로 나누는
          token-level aggregation을, Dr. GRPO는 고정된 최대 길이로 나누는 방식을
          제안했습니다. 현재 TRL 문서도 여러 <code>loss_type</code>을 구분하므로
          과거 recipe와 최신 default를 같은 GRPO로 뭉뚱그리지 않습니다.
        </p>

        <h3>Rollout engine과 trainer가 다른 확률을 계산할 수 있다</h3>
        <p className="leading-8">
          vLLM이 sampling한 token의 log-probability와 training framework가 다시
          계산한 값은 kernel·precision·implementation 차이로 어긋날 수 있습니다.
          그러면 이름은 on-policy여도 실제 update에는 distribution mismatch가
          생깁니다. 현재 TRL은 이 차이와 importance-sampling ratio를 metric으로
          제공하고 correction 옵션도 두므로, reward curve와 함께 sampler–trainer
          log-probability 차이를 감시해야 합니다.
        </p>
      </div>

      <div
        id="paper-dapo"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          후속 핵심 논문 · DAPO와 long-CoT loss
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          DAPO의 핵심 문제의식은 original GRPO의 sample별 길이 정규화가 긴
          completion의 token contribution을 다르게 만들 수 있다는 점입니다.
          논문은 전체 active token으로 loss를 정규화하고 dynamic sampling·clip
          설계를 함께 제안했습니다. 현재 TRL 문서가 <code>dapo</code>를 기본
          loss type으로 두는 것은 library의 현재 선택이며, DeepSeekMath 원
          논문의 GRPO와 같은 objective라고 보면 안 됩니다. DAPO의 결과도 논문
          model·task·system 조건 안에서 읽어야 합니다.
        </p>
        <a
          className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
          href="https://arxiv.org/abs/2503.14476"
          target="_blank"
          rel="noreferrer"
        >
          DAPO의 token-level normalization과 ablation 보기
        </a>
      </div>

      <div
        id="standard-trl-grpo"
        className="not-prose my-8 scroll-mt-24 border-l border-border pl-4"
      >
        <p className="text-xs font-bold text-foreground">
          공식 문서 · 현재 TRL GRPOTrainer
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          현재 공식 문서는 <code>loss_type</code>·reward scaling·KL coefficient,
          token/sequence importance sampling과 vLLM correction을 각각 설정값으로
          노출합니다. 따라서 “GRPO를 사용했다”는 기록만으로는 실행을 재현할 수
          없고, 설치한 TRL commit과 이 설정들을 run artifact로 남겨야 합니다.
          공식 문서는 현재 API 의미의 근거이며 특정 조합의 품질 우위를 보장하는
          benchmark는 아닙니다.
        </p>
        <a
          className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
          href="https://huggingface.co/docs/trl/grpo_trainer"
          target="_blank"
          rel="noreferrer"
        >
          현재 loss type과 vLLM mismatch 설정 보기
        </a>
      </div>
    </section>
  );
}

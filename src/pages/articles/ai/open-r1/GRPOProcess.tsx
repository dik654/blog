import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { Misconception } from '@/components/learning/ArticleLearning';
import FormulaNote from '@/components/ui/formula-note';
import M from '@/components/ui/math';
import { codeRefs } from './codeRefs';
import GRPOBatchLedger from './viz/GRPOBatchLedger';

const recipeSignals = [
  ['Model', 'DeepSeek-R1-Distill-Qwen-1.5B', '작은 distilled policy로 online rollout과 update 경로를 검증한다.'],
  ['Prompt source', 'OpenR1-Math-220k · problem', 'Gold solution을 그대로 prompt에 넣지 않고 problem column으로 conversation을 만든다.'],
  ['Group', 'num_generations = 16', '같은 prompt에서 비교할 후보 수다. 커질수록 비교 기회와 generation cost가 함께 오른다.'],
  ['Length', 'prompt 512 · completion 2,048', '잘림 위험과 rollout token 상한을 동시에 고정한다.'],
  ['Sampling', 'temperature = 0.7', '서로 다른 후보를 만들되 무작위 오류가 과도하게 늘지 않도록 한 snapshot 값이다.'],
  ['Update', 'LR 1e-6 · 1 epoch', '이미 언어 능력이 있는 policy를 작은 step으로 움직이는 recipe다.'],
] as const;

export default function GRPOProcess({ onCodeRef }: { onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="grpo-process" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">GRPO는 한 답을 채점하지 않고 같은 문제의 답들을 비교한다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          PPO는 state마다 앞으로 받을 return을 예측하는 critic을 함께 학습해 baseline을 만든다. GRPO 계열은 같은 prompt에서 여러 completion을
          sample하고 그 group의 평균 reward를 baseline으로 쓴다. Critic parameter와 memory는 줄지만, prompt마다 여러 긴 답을 생성해야 하므로
          <strong> rollout compute가 공짜로 사라지는 것은 아니다.</strong>
        </p>
        <M display>{String.raw`\widehat A_i=\frac{\overbrace{r_i}^{\text{i번째 completion 보상}}-\underbrace{\bar r}_{\text{같은 prompt의 평균}}}{\underbrace{\sqrt{\frac{1}{G}\sum_{j=1}^{G}(r_j-\bar r)^2}}_{\text{그룹 표준편차}}+\underbrace{\varepsilon_{\mathrm{std}}}_{\text{0 나눗셈 방지}}}`}</M>
        <FormulaNote
          meaning="왜 같은 prompt 안에서 평균을 빼나: 쉬운 문제의 절대 점수와 어려운 문제의 절대 점수를 섞지 않고, 같은 난이도에서 다른 completion보다 나았는지를 update 신호로 만들기 위해서다. 표준편차로 나누면 group마다 reward scale이 달라도 advantage 크기를 맞출 수 있다."
          symbols={[
            ['r_i', 'i번째 completion에 선택된 verifier들이 준 최종 reward'],
            ['r̄', '같은 prompt에서 생성한 G개 completion의 평균 reward'],
            ['G', 'prompt 하나에서 비교하는 completion 수'],
            ['Â_i', 'policy update에서 i번째 completion의 상대적 방향과 크기'],
              ['ε_std', '표준편차 0에서 계산이 깨지는 것만 막는 작은 수'],
            ]}
        />
        <p>
          Advantage는 “어느 답이 상대적으로 나았는가”만 정한다. 실제 update는 rollout을 만든 old policy와 현재 policy의 completion 확률 비율을
          곱하고, 한 batch가 policy를 지나치게 멀리 옮기지 않도록 PPO 계열의 clipping을 적용한다.
        </p>
        <M display>{String.raw`\begin{aligned}
\underbrace{\rho_i}_{\text{정책 확률 변화}}
&=\frac{\pi_\theta(y_i\mid x)}{\pi_{\mathrm{old}}(y_i\mid x)}\\
\underbrace{u_i}_{\text{제한 전 값}}
&=\rho_i\widehat A_i\\
\underbrace{\widetilde\rho_i}_{\text{제한한 확률비}}
&=\operatorname{clip}(\rho_i,1-\epsilon_{\mathrm{clip}},1+\epsilon_{\mathrm{clip}})\\
\underbrace{c_i}_{\text{제한 후 값}}
&=\widetilde\rho_i\widehat A_i\\
\underbrace{\mathcal L_{\mathrm{clip}}}_{\text{policy 손실}}
&=-\mathbb E_i[\min(u_i,c_i)]
\end{aligned}`}</M>
        <FormulaNote
          meaning="왜 old policy와 비교하고 작은 쪽을 택하나: rollout은 old policy가 만들었으므로 현재 policy가 그 답의 확률을 얼마나 바꿨는지 ratio로 보정한다. Advantage가 원하는 방향으로 ratio가 너무 멀리 움직였을 때 clipped contribution을 사용해 한 update의 이득을 제한한다."
          symbols={[
            ['ρ_i', '현재 policy 확률을 rollout 당시 old policy 확률로 나눈 비율'],
            ['u_i', 'advantage를 제한 없이 반영한 surrogate contribution'],
            ['ρ̃_i', '현재 policy 확률비를 1±ε 범위로 제한한 값'],
            ['c_i', '제한한 확률비에 advantage를 곱한 contribution'],
            ['ε_clip', 'old policy에서 한 update가 벗어날 수 있는 확률 비율의 허용 폭'],
            ['L_clip', 'gradient descent로 최소화하는 clipped policy loss'],
          ]}
        />
        <p>
          여기서 <code>π_old</code>는 rollout을 생성한 snapshot이라 ratio의 분모가 된다. <code>π_ref</code>는 RL 이전 언어 능력에서 너무
          멀어지는지를 재는 고정 reference policy이며, KL regularization을 켤 때 별도 항에 사용한다. 위 <code>L_clip</code>은 clipped
          policy update만 보여 주므로 <strong>KL penalty와 entropy bonus를 포함하지 않는다.</strong> Recipe가 두 항을 사용한다면 계수와 실제
          logging key를 별도로 명시하고, 사용하지 않는다면 entropy를 진단 지표로 계속 관찰해야 한다.
        </p>
      </div>

      <GRPOBatchLedger />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>ε은 학습 신호를 만들지 않는다</h3>
        <p>
          Reward가 <code>[1, 1, 0, 0]</code>이면 평균은 0.5, population 표준편차는 0.5이고 advantage는
          <code>[+1, +1, -1, -1]</code>이다. 반면 <code>[1, 1, 1, 1]</code>과 <code>[0, 0, 0, 0]</code>은 평균만 다르고
          모든 numerator가 0이라 advantage가 전부 0이다. ε을 더해도 0을 작은 수로 나눈 결과는 0이다.
        </p>
        <p>
          All-correct는 이미 쉬운 prompt일 수 있다. All-wrong은 더 중요하다. 현재 policy가 성공 경로를 sample하지 못했으므로 같은 update를 반복하기보다
          더 쉬운 curriculum, 더 다양한 sampling, teacher trace 또는 verifier 오류를 점검해야 한다. Pass-rate filtering은 이 두 극단만 남기지 않고
          성공과 실패가 공존하는 학습 frontier를 구성하는 도구다.
        </p>
        <M display>{String.raw`\begin{aligned}
\underbrace{B_{\mathrm{sample}}}_{\text{최대 생성 token 수}}
&\le \underbrace{P}_{\text{prompt 수}}\times\underbrace{G}_{\text{prompt당 rollout}}\times\underbrace{C}_{\text{길이 상한}}\\
&=\underbrace{P\times G}_{\text{채점할 completion 수}}\times C
\end{aligned}`}</M>
        <FormulaNote
          meaning="왜 세 수를 곱하나: prompt가 P개이고 각각 G개 답을 최대 C token까지 만들면, verifier와 update 전에 생성해야 할 completion token의 상한이 P×G×C가 된다. 실제 생성은 EOS에서 일찍 끝날 수 있어 더 작다. 이 값은 optimizer가 한 번에 처리하는 example 수와 다르다."
          symbols={[
            ['B_sample', '한 rollout 단계에서 생성할 수 있는 completion token 상한'],
            ['P', '현재 rollout 묶음의 서로 다른 prompt 수'],
            ['G', '한 prompt에서 sample하는 completion 수'],
            ['C', 'completion 하나의 maximum token length'],
          ]}
        />
      </div>

      {onCodeRef && (
        <div className="not-prose my-6 flex flex-wrap items-center gap-3 border-y border-border py-4">
          <CodeViewButton onClick={() => onCodeRef('r1-grpo-main', codeRefs['r1-grpo-main'])} />
          <p className="text-xs leading-5 text-muted-foreground">Dataset → conversation → reward registry → GRPOTrainer → checkpoint lifecycle을 보존한 교육용 excerpt</p>
        </div>
      )}

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>공식 demo recipe를 비용과 신호로 읽는다</h3>
        <p>
          이 숫자는 Open-R1의 1.5B GRPO demo snapshot이다. 특히 <code>num_generations=16</code>은 보편 최적값이 아니다.
          G를 늘리면 비교 후보는 많아지지만 sampled token, verifier 호출, KV memory와 step latency도 함께 늘어난다.
        </p>
      </div>
      <div className="not-prose mt-6 border-y border-border">
        {recipeSignals.map(([label, value, consequence]) => (
          <div key={label} className="grid gap-2 border-b border-border py-4 last:border-b-0 sm:grid-cols-[7rem_17rem_minmax(0,1fr)] sm:gap-4">
            <span className="text-xs font-black text-muted-foreground">{label}</span>
            <code className="break-words text-xs font-bold [overflow-wrap:anywhere]">{value}</code>
            <p className="text-sm leading-6 text-muted-foreground">{consequence}</p>
          </div>
        ))}
      </div>

      <Misconception>
        Group-relative advantage가 critic을 없앤다고 해서 “reward만 있으면 안정적으로 학습한다”는 뜻은 아니다. Group 안에 비교 가능한 다양성이 없거나,
        verifier가 shortcut을 보상하거나, policy가 성공 후보를 전혀 sample하지 못하면 update 신호 자체가 잘못되거나 사라진다.
      </Misconception>
    </section>
  );
}

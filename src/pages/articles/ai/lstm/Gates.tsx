import ExplainedFormula from "@/components/ui/explained-formula";
import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";

export default function Gates({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="gates" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Gate는 hard switch가 아니라 channel별 soft policy다</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          세 gate는 같은 현재 input xₜ와 이전 hidden state hₜ₋₁을 보지만 서로 다른
          parameter로 0과 1 사이의 vector를 만든다. 한 scalar로 cell 전체를 켜는
          것이 아니라 hidden dimension마다 다른 retention·write·exposure 비율을
          학습한다. Sigmoid가 포화되면 gate policy가 0 또는 1에 가까운 장기 결정으로
          바뀌지만 그만큼 gate network 자체의 gradient는 작아질 수 있다.
        </p>
      </div>

      <ExplainedFormula
        question="한 timestep에서 보존·기록·공개 비율을 어떤 입력으로 계산할까?"
        idea={<>현재 input과 이전 hidden state를 한 번 concatenate한 뒤 네 개의 affine output을 한 matrix multiplication으로 계산하고, 세 구간에는 sigmoid를 candidate에는 tanh를 적용합니다.</>}
        formula={String.raw`\begin{aligned}u_t&=[x_t;h_{t-1}]\\a_t&=Wu_t+b\\a_t&=\begin{bmatrix}a_f\\a_i\\a_g\\a_o\end{bmatrix}\\[3pt]f_t&=\sigma(a_f),\quad i_t=\sigma(a_i)\\g_t&=\tanh(a_g),\quad o_t=\sigma(a_o)\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}
u_t&=\underbrace{[x_t;h_{t-1}]}_{\text{현재 입력·이전 hidden 결합}}\\
a_t&=\underbrace{Wu_t+b}_{\text{네 묶음을 한 번에 계산}}\\
(a_f,a_i,a_g,a_o)&=\underbrace{\operatorname{split}_{4}(a_t)}_{\text{4H를 H씩 분리}}\\
(f_t,i_t,o_t)&=\underbrace{\sigma(a_f,a_i,a_o)}_{\text{0--1 비율로 제한}}\\
g_t&=\underbrace{\tanh(a_g)}_{\text{부호 있는 후보값}}
\end{aligned}`}
        operations={[
          { expression: String.raw`[x_t;h_{t-1}]`, annotation: ["현재 관측과 직전 공개 state를", "하나의 step context로 연결"] },
          { expression: String.raw`Wu_t+b`, annotation: ["한 matrix multiplication으로", "네 block의 preactivation 동시 계산"] },
          { expression: String.raw`\operatorname{split}_4(a_t)`, annotation: ["Fused 4H output을 나눠", "각 gate·candidate 역할에 배정"] },
          { expression: String.raw`\sigma\text{ vs }\tanh`, annotation: ["Gate는 0–1 비율로", "candidate는 −1–1 내용으로 변환"] },
        ]}
        terms={[
          { symbol: "W", name: "fused projection", description: "네 gate/candidate의 weight를 한 큰 matrix로 묶은 구현입니다." },
          { symbol: "a_f,a_i,a_o", name: "gate logits", description: "sigmoid 전의 unconstrained scores입니다." },
          { symbol: "a_g", name: "candidate preactivation", description: "기록할 signed content를 만드는 affine output입니다." },
          { symbol: "u_t=[x_t;h_{t-1}]", name: "step context", description: "현재 observation과 직전 공개 state를 연결한 vector입니다." },
        ]}
        assumptions={["Gate ordering은 i,f,g,o 또는 i,f,o,g처럼 library마다 다를 수 있으므로 checkpoint layout을 확인합니다.", "Hidden size H라면 fused output은 4H이며 bias·projection variant에 따라 parameter가 달라집니다."]}
        interpretation="수식은 gate 네 개를 별도 matmul로 그려도 구현에서는 하나로 fuse하는 이유를 보여 준다. 같은 checkpoint라도 gate order가 다르면 단순 weight copy가 깨집니다."
      />
      <CodeViewButton
        onClick={() => onCodeRef("gate-formula", codeRefs["gate-formula"])}
      />

      <div id="paper-forget-gate" className="not-prose mt-8 scroll-mt-24 border-l border-border/80 pl-4">
        <p className="text-xs font-bold text-primary">논문 해설 · Learning to Forget</p>
        <h3 className="mt-2 text-base font-bold">연속 sequence에서는 memory를 쓰는 능력만큼 지울 시점을 학습하는 능력이 필요했다</h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Gers·Schmidhuber·Cummins는 episode boundary가 외부에서 명확히 주어지지 않는 continual prediction에서 오래된 cell content를 reset할 forget gate를 도입했습니다. 이 연구는 forget gate가 현대 LSTM의 기본 구성으로 자리 잡은 근거이지만, 모든 channel을 오래 보존하는 것이 항상 최적이거나 bias 1이 보편적인 정답이라는 뜻은 아닙니다.
        </p>
      </div>

      <div id="paper-lstm-odyssey" className="not-prose mt-6 scroll-mt-24 border-l border-border/80 pl-4">
        <p className="text-xs font-bold text-primary">논문 해설 · LSTM: A Search Space Odyssey</p>
        <h3 className="mt-2 text-base font-bold">Component 이름의 직관보다 같은 실험 조건에서의 ablation을 봐야 한다</h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Jozefowicz 등은 여러 task와 수천 개 architecture configuration에서 gate·activation·bias 변형을 비교했고 forget-gate bias가 강한 baseline에 중요함을 관찰했습니다. 이는 논문의 task·search space·budget 안의 empirical result이며, 변형 하나의 보편적인 순위나 특정 framework default를 보장하지 않습니다.
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Forget bias는 보존을 선호하게 만드는 초기 조건이다</h3>
        <p>
          Forget gate bias를 양수로 두면 학습 초기에 sigmoid output이 0.5보다 커져
          direct path가 너무 빨리 닫히는 일을 줄일 수 있다. Jozefowicz 등의 대규모
          architecture 탐색에서는 forget bias 1이 중요한 baseline 개선으로 관찰됐다.
          다만 framework 기본값과 normalization, sequence reset policy가 다르므로
          모든 task의 고정 정답으로 사용하지 않는다.
        </p>
        <p>
          예를 들어 다른 logit contribution이 0일 때 bias 1은 f=σ(1)≈0.731을
          만든다. 한 step에서는 꽤 큰 값처럼 보이지만 20-step direct retention은
          0.731²⁰≈0.0019에 불과하다. 초기 bias는 학습을 시작할 조건이지 원하는
          memory horizon을 자동으로 보장하는 설정이 아니다.
        </p>
        <p>
          Forget gate가 없는 1997년 원형과 이후 continual sequence를 위해 forget
          gate를 추가한 연구를 구분해야 한다. 위 논문 해설처럼 두 구조의 역사와
          수식 범위를 한 이름으로 합치지 않는 것이 중요하다.
        </p>
      </div>
    </section>
  );
}

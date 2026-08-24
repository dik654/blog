import type { CodeRef } from "@/components/code/types";
import ExplainedFormula from "@/components/ui/explained-formula";
import { codeRefs } from "./codeRefs";
import LstmViz from "./viz/LstmViz";

export default function LstmCell({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="lstm" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">LSTM cell은 네 projection과 두 상태 업데이트로 구성됩니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          현재 입력과 이전 hidden state는 forget, input, output gate와 candidate를 위한 네 개의 projection으로 들어갑니다. 세 gate에는 sigmoid를 적용해 0과 1 사이의 비율을 만들고, candidate에는 tanh를 적용해 새로 기록할 내용을 만듭니다.
        </p>
        <p>
          먼저 <code>c = f*c_prev + i*g</code>로 cell state를 갱신한 뒤 <code>h = o*tanh(c)</code>로 hidden state를 만듭니다. 첫 시점에는 이전 상태가 없으므로 0으로 초기화하거나 별도 분기로 처리할 수 있지만, 두 방식이 batch size와 device·dtype을 일관되게 유지하는지 확인해야 합니다.
        </p>
      </div>
      <div className="not-prose my-8"><LstmViz onOpenCode={open} /></div>
      <ExplainedFormula
        question="Forget·input·output gate는 cell state와 hidden state를 어떤 순서로 바꿀까요?"
        idea={<>먼저 이전 memory에 forget 비율을 곱하고 새 candidate에 input 비율을 곱해 더합니다. 그다음 갱신된 cell state를 tanh로 제한하고 output gate만큼 외부에 공개합니다.</>}
        formula={String.raw`\begin{aligned}
c_t&=f_t c_{t-1}+i_t g_t,\\
h_t&=o_t\tanh(c_t),\\
f_t=.8,\ c_{t-1}=1,\ i_t=.25,\ g_t=.4
&\Rightarrow c_t=.9,\\
o_t=.5&\Rightarrow h_t\approx.358.
\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}
c_t&=\underbrace{f_t c_{t-1}+i_t g_t,}_{\text{gated candidate 계산}}\\
h_t&=\underbrace{o_t\tanh(c_t),}_{\text{output gate 계산}}\\
f_t=.8,\ c_{t-1}=1,\ i_t=.25,\ g_t=.4
&\Rightarrow c_t=.9,\\
o_t=.5&\Rightarrow h_t\approx.358.
\end{aligned}`}
        operations={[
          { expression: String.raw`f_t c_{t-1}+i_t g_t,`, annotation: ["gated candidate이(가) 식의 결과에 기여하는","방식을 계산합니다.","먼저 이전 memory에 forget 비율을 곱하고 새","candidate에 input 비율을 곱해 더합니다."] },
          { expression: String.raw`o_t\tanh(c_t),`, annotation: ["output gate이(가) 식의 결과에 기여하는 방식을","계산합니다.","먼저 이전 memory에 forget 비율을 곱하고 새","candidate에 input 비율을 곱해 더합니다."] },
        ]}
        terms={[
          { symbol: "f_t", name: "forget gate", description: "이전 cell state를 channel별로 얼마나 유지할지 정합니다." },
          { symbol: "i_t g_t", name: "gated candidate", description: "새 candidate 중 cell state에 기록할 양입니다." },
          { symbol: "o_t", name: "output gate", description: "갱신된 cell state에서 hidden state로 공개할 비율입니다." },
        ]}
        assumptions={[
          "이 수치 예제는 hidden dimension 1인 scalar cell이며 실제 model은 element-wise vector 연산입니다.",
          "Gate 값은 sigmoid output이라 0과 1 사이이고 candidate는 tanh output입니다.",
          "State value를 다음 chunk로 넘기는 것과 이전 graph를 detach하는 것은 서로 다른 결정입니다.",
        ]}
        interpretation="Cell state는 .8+.1=.9가 되고 tanh(.9)≈.716의 절반인 hidden state 약 .358을 출력합니다. Gate별 projection과 state update 순서를 바꾸면 같은 shape라도 다른 cell입니다."
      />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>한 번의 큰 projection으로 합칠 수도 있습니다</h3>
        <p>
          교육용 구현은 gate별 Linear를 나누면 흐름을 읽기 쉽지만, 실제 프레임워크는 보통 네 projection을 하나의 큰 행렬곱으로 합친 뒤 결과를 분할합니다. 이렇게 하면 kernel launch와 메모리 접근을 줄일 수 있습니다. 먼저 분리 구현으로 수치가 맞는지 검증한 다음 fused 형태와 결과를 비교하는 순서가 안전합니다.
        </p>
      </div>
    </section>
  );
}

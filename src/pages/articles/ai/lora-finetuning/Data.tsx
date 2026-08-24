import ExplainedFormula from "@/components/ui/explained-formula";
import DataFormatViz from "./viz/DataFormatViz";
import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";

export default function Data({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="data" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Adapter가 작아도 학습 대상은 token sequence이므로, chat template과 loss mask가 틀리면 작은 artifact에 잘못된 행동을 정확히 학습합니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>원본 JSON의 system·user·assistant field를 base tokenizer의 chat template으로 serialize하고, 실제 token ID·special token·turn boundary를 표본으로 확인합니다. 이미 special token이 포함된 문자열을 template에 다시 넣거나 다른 model의 template을 복사하면 training과 serving input이 달라집니다.</p>
        <p>실제로 이런 실수는 이중 BOS(beginning-of-sequence) token 형태로 자주 나타납니다. Gemma 계열처럼 chat template 문자열 자체가 <code>{"{{ bos_token }}"}</code>을 하드코딩해 넣는 경우, 그 문자열을 다시 tokenizer의 <code>add_special_tokens=True</code> 인코딩에 넣으면 BOS가 두 번 들어갑니다. Unsloth는 인코딩 직전에 문자열 앞의 중복 BOS를 지우는 방식으로 이를 막습니다.</p>
        <p>Instruction tuning에서는 대개 assistant response token만 loss에 넣지만 목적에 따라 전체 sequence를 학습할 수도 있습니다. 중요한 것은 선택을 명시하고 padding·packing·truncation 경계와 함께 검사하는 것입니다.</p>
      </div>
      <div className="not-prose mb-8">
        <CodeViewButton
          label="remove_special_tokens — 이중 BOS의 원인과 수정"
          onClick={() => onCodeRef("double-bos-fix", codeRefs["double-bos-fix"])}
        />
      </div>
      <ExplainedFormula
        question="Assistant 답변만 학습할 때 prompt token을 loss에서 어떻게 제외할까요?"
        idea={<>각 token에 0/1 mask를 두고 assistant target 위치만 negative log-likelihood 합과 분모에 포함합니다. 분모도 mask 합을 써야 prompt가 긴 example 때문에 평균 scale이 달라지지 않습니다.</>}
        formula={String.raw`\begin{aligned}
Z&=\sum_{t=1}^{T}m_t,\qquad m_t\in\{0,1\}\\
\mathcal L_{\mathrm{resp}}&=-\frac{1}{Z}\sum_{t=1}^{T}m_t\log p_\theta(x_t\mid x_{<t})
\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}
Z&=\underbrace{\sum_{t=1}^{T}m_t,\qquad m_t\in\{0,1\}}_{\text{loss mask 계산}}\\
\mathcal L_{\mathrm{resp}}&=\underbrace{-\frac{1}{Z}\sum_{t=1}^{T}m_t\log p_\theta(x_t\mid x_{<t})}_{\text{기준량당 비율}}
\end{aligned}`}
        operations={[
          { expression: String.raw`\sum_{t=1}^{T}m_t,\qquad m_t\in\{0,1\}`, annotation: ["loss mask이(가) 식의 결과에 기여하는 방식을","계산합니다.","각 token에 0/1 mask를 두고 assistant","target 위치만 negative log-likelihood"] },
          { expression: String.raw`-\frac{1}{Z}\sum_{t=1}^{T}m_t\log p_\theta(x_t\mid x_{<t})`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","각 token에 0/1 mask를 두고 assistant","target 위치만 negative log-likelihood","합과 분모에 포함합니다."] },
        ]}
        terms={[
          { symbol: "x_t", name: "target token", description: "Chat template으로 직렬화한 sequence의 t번째 다음-token target입니다." },
          { symbol: "m_t", name: "loss mask", description: "학습할 assistant response 위치는 1, prompt·padding은 0입니다." },
          { symbol: "p_theta", name: "model probability", description: "이전 token을 조건으로 현재 token에 부여한 probability입니다." },
          { symbol: "Z = sum m_t", name: "valid-token count", description: "실제로 채점한 response token 수입니다." },
        ]}
        assumptions={["Shifted input/label index에서 mask가 정확히 target token과 맞는지 확인합니다.", "Multi-turn에서 어느 assistant turn을 학습할지와 tool/result token 처리 규칙을 고정합니다.", "Mask가 모두 0인 example을 제거하거나 명시적으로 처리합니다."]}
        interpretation="전체 100 token 중 assistant target 30개만 mask=1이면 loss는 그 30개 NLL의 평균입니다. Prompt 70개는 context로 읽지만 직접 맞히도록 채점하지 않습니다."
      />
      <div className="not-prose my-8"><DataFormatViz /></div>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>Truncation은 긴 prompt의 앞부분, 최신 user 요청, assistant answer 중 무엇을 보존하는지 결정합니다. Packing은 서로 다른 example이 attention이나 loss 경계에서 섞이지 않는지 확인해야 합니다. Data manifest에는 source·license·개인정보 처리·dedup·evaluation contamination·sample weight·length/task slice를 남기고, formatted token sample을 학습 전에 눈으로 검수합니다.</p>
      </div>
    </section>
  );
}

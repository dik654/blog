import ExplainedFormula from "@/components/ui/explained-formula";
import ProgressiveDetail from "@/components/articles/progressive-detail";
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
      <h2 className="mb-6 text-2xl font-bold">
        작은 adapter도 잘못 직렬화한 행동을 그대로 학습합니다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          원본 JSON의 system·user·assistant field는 그대로 모델에 들어가지
          않습니다. Base tokenizer의 chat template이 이 message들을 하나의 token
          sequence로 직렬화합니다.
        </p>
        <p>
          따라서 학습 전에 실제 token ID, special token과 turn boundary를 표본으로
          확인해야 합니다. 다른 model의 template을 복사하거나 special token을 두
          번 넣으면 training과 serving이 서로 다른 입력을 보게 됩니다.
        </p>
        <p>
          그다음 loss mask가 sequence의 어느 부분을 정답으로 채점할지 정합니다.
          Instruction tuning에서는 흔히 assistant response만 채점하지만, 목적에
          따라 전체 sequence를 학습할 수도 있습니다. 어느 쪽이든 padding, packing,
          truncation 경계까지 함께 명시해야 합니다.
        </p>
      </div>
      <ProgressiveDetail
        title="BOS token은 어떻게 두 번 들어가나요?"
        preview="Template과 tokenizer가 각각 BOS를 추가하면 학습 sequence의 시작이 serving과 달라집니다."
      >
        <p>
          일부 chat template은 문자열 앞에 <code>{"{{ bos_token }}"}</code>을 직접
          넣습니다. 그 결과를 다시 <code>add_special_tokens=True</code>로 encode하면
          tokenizer도 BOS를 추가해 같은 token이 두 번 들어갈 수 있습니다.
        </p>
        <p>
          이 글에 포함한 Unsloth snapshot은 encode 직전에 문자열 앞의 중복 BOS를
          제거합니다. 중요한 것은 특정 보정 함수를 복사하는 일이 아니라, formatted
          text와 최종 token ID를 training·serving 양쪽에서 비교하는 것입니다.
        </p>
      </ProgressiveDetail>
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
        <p>
          Truncation은 긴 prompt의 앞부분, 최신 user 요청과 assistant answer 가운데
          무엇을 보존할지 결정합니다. Packing은 서로 다른 example이 attention이나
          loss 경계에서 섞이지 않는지 확인해야 합니다.
        </p>
        <p>
          Data manifest에는 source, license, 개인정보 처리, dedup, evaluation
          contamination과 sample weight를 남깁니다. Length·task slice와 formatted
          token sample도 학습 전에 직접 검수합니다.
        </p>
      </div>
    </section>
  );
}

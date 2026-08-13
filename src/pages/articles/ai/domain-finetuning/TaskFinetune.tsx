import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import TaskFinetuneViz from "./viz/TaskFinetuneViz";

export default function TaskFinetune() {
  return <section id="task-finetune" className="mb-16 scroll-mt-20">
    <h2 className="mb-6 text-2xl font-bold">Task fine-tuning은 지식보다 입력·출력 행동 계약을 직접 학습합니다</h2>
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <p>Classification·정보 추출·instruction following처럼 원하는 행동을 example로 쓸 수 있을 때 SFT를 사용합니다. 한 demonstration에는 prompt template, context truncation, response schema, label policy, abstention과 provenance가 포함되어야 합니다. Formatter shortcut을 막으려면 내용은 같고 표현만 다른 template, 경계 사례와 거절해야 할 사례도 함께 평가합니다.</p>
      <p>SFT의 response-only loss·packing·chat template 자체는 <Link to="/ai/supervised-fine-tuning">SFT 정본</Link>에서 자세히 다룹니다. 여기서는 domain corpus adaptation과 task behavior adaptation을 섞지 않고, full fine-tuning·LoRA·frozen head를 같은 demonstration과 평가에서 비교하는 데 집중합니다.</p>
    </div>
    <div className="not-prose my-8"><TaskFinetuneViz /></div>
    <ExplainedFormula
      question="Prompt는 읽게 하면서 원하는 response token만 학습하려면 어떤 mask를 사용할까요?"
      idea={<>전체 sequence를 context로 forward하되 assistant response target 위치에만 mt=1을 두어 NLL을 평균합니다. Attention mask와 달리 loss mask는 어떤 token을 채점할지를 정합니다.</>}
      formula={String.raw`\begin{aligned}
N_{\mathrm{resp}}&=\sum_t m_t\\
\mathcal L_{\mathrm{SFT}}
&=-\frac{1}{N_{\mathrm{resp}}}\sum_{t=1}^{T}m_t\log\pi_\theta(y_t\mid y_{<t})
\end{aligned}`}
      terms={[
        { symbol: "πθ", name: "language-model policy", description: "현재 prefix에서 다음 token distribution을 출력합니다." },
        { symbol: "yt", name: "target token", description: "직렬화된 prompt-response sequence의 t번째 관측 token입니다." },
        { symbol: "mt", name: "response loss mask", description: "학습할 response target이면 1, prompt·padding이면 0입니다." },
        { symbol: "Nresp", name: "valid response tokens", description: "Mask가 1인 response token 수이며 sample 길이와 padding에 무관하게 loss를 평균낼 분모입니다." },
      ]}
      assumptions={["Decoder-only teacher forcing과 response-only mean reduction을 가정합니다.", "Multi-turn에서 어느 assistant turn을 학습할지 template와 dataset contract에 고정합니다.", "Output schema를 정확히 재현하는 것과 내용의 사실성은 별도 평가합니다."]}
      interpretation="Mask가 0인 prompt도 attention context에는 남아 response probability에 영향을 줍니다. Full-sequence continued pretraining과 response-only SFT는 같은 token 파일을 써도 objective가 다릅니다."
    />
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h3>방법 비교에서는 업데이트 범위만 바꿉니다</h3>
      <p>Full fine-tuning과 LoRA를 비교할 때 base checkpoint·data order·effective batch·update 수·scheduler·evaluation decoding을 같게 둡니다. Trainable parameter 수가 적다고 항상 wall time이나 serving memory가 줄어드는 것은 아니므로 peak memory·optimizer state·merge 여부·latency도 함께 기록합니다.</p>
      <p>Domain holdout과 time holdout, general capability suite를 함께 사용합니다. Probability나 generation confidence가 필요한 경우 calibration과 abstention coverage도 다시 확인하며, label 수보다 실제 error taxonomy·disagreement·rare intent coverage가 부족한지 먼저 봅니다.</p>
    </div>
  </section>;
}

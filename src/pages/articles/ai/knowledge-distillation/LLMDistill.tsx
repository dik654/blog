import ExplainedFormula from "@/components/ui/explained-formula";
import LLMDistillViz from "./viz/LLMDistillViz";

export default function LLMDistill() {
  return (
    <section id="llm" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">LLM에서 token logit을 공유할 수 없다면 teacher sequence를 provenance가 있는 supervised dataset으로 바꿉니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>API teacher처럼 logits와 hidden state에 접근할 수 없거나 teacher와 student tokenizer가 다르면 같은 timestep의 vocabulary probability를 바로 KL로 비교할 수 없습니다. 같은 문자열도 token boundary와 vocabulary index가 다르기 때문입니다. 이때 teacher가 생성한 response를 student tokenizer로 다시 encode하고 ordinary sequence NLL로 학습하는 sequence-level distillation이 자연스럽습니다.</p>
        <p>이 방식에서 teacher generation은 label이 아니라 dataset construction입니다. Prompt source·rights·language·difficulty, teacher/version·system prompt·sampling, filter·verifier·dedup, student chat template·loss mask가 모두 결과를 결정합니다. 많이 생성했다는 숫자보다 deployment task와 rare slice를 얼마나 덮었는지 확인해야 합니다.</p>
      </div>
      <ExplainedFormula
        question="Teacher가 만든 response를 student가 학습할 때 실제 loss는 무엇일까요?"
        idea={<>Teacher sequence를 student tokenizer로 다시 나눈 뒤, prompt가 주어진 상태에서 다음 response token의 likelihood를 높입니다. Response-only mask를 쓰면 prompt token은 context로만 보고 loss 합에서는 제외합니다.</>}
        formula={String.raw`\begin{aligned}c&=\operatorname{Tok}_s(x),\\\ell_t&=-m_t\log p_s(u_t\mid u_{<t},c),\\\mathcal L_{\mathrm{seq}}&=\sum_{t=1}^{L_s}\ell_t.\end{aligned}`}
        terms={[
          { symbol: "x", name: "prompt", description: "Teacher response를 생성한 원 요청과 system/context입니다." },
          { symbol: "Tok_s", name: "student tokenizer", description: "Prompt와 teacher text를 student vocabulary로 다시 encode합니다." },
          { symbol: "u_t", name: "student response token", description: "Teacher가 만든 문자열을 student tokenizer로 나눈 t번째 target입니다." },
          { symbol: "m_t", name: "loss mask", description: "Response·tool argument 등 학습할 위치는 1, prompt·padding은 0으로 둡니다." },
          { symbol: "L_s", name: "student token length", description: "Student tokenizer와 truncation 뒤 target sequence 길이입니다." },
        ]}
        assumptions={[
          "Teacher text를 target으로 받아들일 수 있도록 quality·safety·rights filter를 통과했다고 가정합니다.",
          "Chat template·special token·assistant boundary·truncation과 loss mask를 artifact에 기록합니다.",
          "한 teacher decoding의 mode를 학습하는 것이 teacher의 전체 sequence distribution을 정확히 KL-matching하는 것과 같지는 않습니다.",
        ]}
        interpretation="Teacher와 student token 수가 달라도 문자열 수준 target을 student vocabulary로 다시 encode하면 SFT가 가능합니다. 대신 teacher의 token별 대안 확률은 사라지고 선택된 한 sequence와 generation policy가 supervision이 됩니다."
      />
      <ExplainedFormula
        question="Synthetic dataset이 deployment 요청을 충분히 덮는지 어떻게 확인할까요?"
        idea={<>먼저 운영에 필요한 slice별 목표 비중을 정하고, 생성·filter 뒤 남은 dataset의 비중과 차이를 측정합니다. 전체 sample 수가 커도 중요한 slice가 0이면 coverage는 부족합니다.</>}
        formula={String.raw`\begin{aligned}N&=\sum_jn_j,\\\widehat\pi_k&=n_k/N,\\\delta_k&=\widehat\pi_k-\pi_k^{\mathrm{target}},\\\Delta_{\mathrm{cover}}&=\frac12\sum_k|\delta_k|.\end{aligned}`}
        terms={[
          { symbol: "k", name: "deployment slice", description: "언어·domain·difficulty·tool type·safety category처럼 사전에 정의한 그룹입니다." },
          { symbol: "n_k", name: "accepted count", description: "Teacher 생성 뒤 filter·dedup을 통과한 slice-k sample 수입니다." },
          { symbol: "pi-hat", name: "dataset mixture", description: "최종 synthetic dataset에서 각 slice가 차지하는 비율입니다." },
          { symbol: "pi-target", name: "target mixture", description: "Deployment traffic 또는 의도적으로 정한 training curriculum 비율입니다." },
          { symbol: "Delta_cover", name: "mixture gap", description: "두 categorical mixture의 total-variation distance로 0이면 비율이 같습니다." },
        ]}
        assumptions={[
          "Slice label이 mutually exclusive하고 전체를 덮도록 정의한 단순 mixture 진단입니다. 중첩 slice는 별도 marginal/joint 표가 필요합니다.",
          "Count coverage는 sample 품질·내부 다양성·정답성을 보장하지 않으므로 verifier pass rate와 semantic duplication을 함께 봅니다.",
          "Target mixture를 실제 traffic으로 둘지 rare-risk oversampling curriculum으로 둘지 목적을 명시합니다.",
        ]}
        interpretation="Target이 한국어 .4·영어 .4·code .2인데 accepted data가 .1·.7·.2라면 gap은 .5(|-.3|+|.3|+0)=.3입니다. 총 데이터가 많아도 한국어 coverage가 부족합니다."
      />
      <div className="not-prose my-8"><LLMDistillViz /></div>
      <div id="paper-sequence-kd" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">논문 읽기 · Sequence-Level Knowledge Distillation</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">이 논문의 핵심은 word별 teacher distribution을 맞추는 대신 teacher beam search가 만든 sequence로 작은 NMT model을 학습하는 것입니다. WMT English–German과 IWSLT Thai–English, 해당 LSTM NMT·BLEU 조건에서 sequence search space를 단순화한 결과이며, 오늘날의 general LLM reasoning trace·safety·factuality가 자동으로 전달된다는 뜻은 아닙니다.</p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://aclanthology.org/D16-1139/" target="_blank" rel="noreferrer">Word-level·sequence-level objective와 번역 실험 보기</a>
      </div>
    </section>
  );
}

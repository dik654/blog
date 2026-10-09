import ExplainedFormula from "@/components/ui/explained-formula";
import ResponseMaskViz from "./viz/ResponseMaskViz";

export default function Objective() {
  return (
    <section id="response-loss" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Response-only loss는 prompt를 읽게 하되 prompt token을 정답으로 채점하지 않는다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert"><p>
            response를 예측하려면 model은 prompt token을 attention context로 읽어야 합니다. 그러나 loss mask를 response 위치에만 1로
            두면 prompt 자체를 재생하는 gradient는 내지 않습니다. full-sequence loss를 쓰는 recipe도 물론 가능합니다. 다만 목적과 data
            mixture가 달라지므로 둘을 같은 설정으로 취급하면 안 됩니다.
          </p></div>
      <ExplainedFormula
        question="한 demonstration에서 어떤 next-token prediction만 SFT objective에 포함하는가?"
        idea={<>전체 token sequence의 conditional NLL을 계산하되 response target 위치에만 mask 1을 두고, 유효 target 수로 나누어 sample 길이에 따른 scale을 통제합니다.</>}
        formula={String.raw`\begin{aligned}M&=\sum_{t=1}^{T}m_t\\[2pt]\mathcal L_{\mathrm{SFT}}&=-\frac1M\sum_{t=1}^{T}m_t\log\pi_\theta(y_t\mid y_{<t})\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}M&=\underbrace{\sum_{t=1}^{T}m_t}_{\text{채점할 response token 수}}\\[2pt]\mathcal L_{\mathrm{SFT}}&=-\underbrace{\frac1M}_{\text{길이 scale 통제}}\sum_{t=1}^{T}\underbrace{m_t}_{\text{prompt면 0}}\underbrace{\log\pi_\theta(y_t\mid y_{<t})}_{\text{정답 다음 token 확률}}\end{aligned}`}
        operations={[
          { expression: String.raw`\sum_{t=1}^{T}m_t`, annotation: ["response target 위치만 1로 세고", "prompt·padding은 0으로 뺍니다"] },
          { expression: String.raw`\log\pi_\theta(y_t\mid y_{<t})`, annotation: ["실제 prefix를 넣고 다음 실제 token에", "둔 확률의 log (teacher forcing)", "prompt도 context로는 남습니다"] },
          { expression: String.raw`-\frac1M\sum_{t=1}^{T}m_t\log\pi_\theta(y_t\mid y_{<t})`, annotation: ["response token의 NLL만 더해", "유효 target 수 M으로 나눈 평균"] },
        ]}
        terms={[
          { symbol: "\\pi_\\theta", name: "language-model policy", description: "Prefix를 조건으로 다음 token probability를 냅니다." },
          { symbol: "y_t", name: "target token", description: "직렬화된 demonstration의 t번째 실제 token입니다." },
          { symbol: "m_t", name: "response loss mask", description: "학습할 response target이면 1, prompt·padding이면 0입니다." },
          { symbol: "\\sum_t m_t", name: "valid target count", description: "Response 길이에 따른 reduction scale을 정합니다." },
        ]}
        assumptions={["Decoder-only teacher-forced SFT의 response-only mean loss를 표기했습니다.", "Multi-turn에서 어느 assistant turn을 학습하는지는 dataset contract로 별도 고정해야 합니다."]}
        interpretation="Mask 0인 prompt도 context에는 남아 response probability에 영향을 줍니다. Attention mask와 loss mask를 같은 것으로 보면 안 됩니다."
      />
      <ResponseMaskViz />

      <ExplainedFormula
        question="길이가 다른 response를 batch에서 평균낼 때 긴 답 하나가 objective를 지배하지 않게 하려면?"
        idea={<>Token mean은 모든 유효 target token을 같은 weight로 보므로 긴 response의 비중이 커집니다. Example mean은 각 response 안에서 먼저 평균낸 뒤 example끼리 같은 weight로 평균냅니다.</>}
        formula={String.raw`\begin{aligned}M_i&=\sum_t m_{it}\\S_i&=\sum_t m_{it}\ell_{it}\\[2pt]\mathcal L_{\rm token}&=\frac{\sum_i S_i}{\sum_i M_i}\\[2pt]\mathcal L_{\rm example}&=\frac1N\sum_i\frac{S_i}{M_i}\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}M_i&=\underbrace{\sum_t m_{it}}_{\text{example i 유효 길이}}\\S_i&=\underbrace{\sum_t m_{it}\ell_{it}}_{\text{example i NLL 합}}\\[2pt]\mathcal L_{\rm token}&=\underbrace{\frac{\sum_i S_i}{\sum_i M_i}}_{\text{token마다 같은 weight}}\\[2pt]\mathcal L_{\rm example}&=\underbrace{\frac1N\sum_i\frac{S_i}{M_i}}_{\text{답마다 같은 weight}}\end{aligned}`}
        operations={[
          { expression: String.raw`\frac{\sum_i S_i}{\sum_i M_i}`, annotation: ["batch 전체 token을 한 줄로 평균", "짧은 답(1 token, loss 2)+긴 답(9, 0)", "→ (2+0)/(1+9) = 0.2"] },
          { expression: String.raw`\frac1N\sum_i\frac{S_i}{M_i}`, annotation: ["답 안에서 먼저 평균낸 뒤 답끼리 평균", "같은 두 답이면 (2/1 + 0/9)/2 = 1.0", "긴 답 하나가 지배하지 못합니다"] },
        ]}
        terms={[
          { symbol: "\\ell_{it}", name: "token NLL", description: "Example i의 target 위치 t에서 계산한 negative log-likelihood입니다." },
          { symbol: "m_{it}", name: "loss mask", description: "Response target이면 1, prompt·padding이면 0입니다." },
          { symbol: "M_i", name: "valid response length", description: "Example i에서 실제로 채점하는 token 수입니다." },
          { symbol: "N", name: "example count", description: "Batch에 들어 있는 demonstration 수입니다." },
        ]}
        assumptions={["두 reduction 모두 유효한 선택이며 dataset sampling과 함께 계약으로 고정해야 합니다.", "Distributed gradient accumulation에서는 global numerator·denominator를 같은 방식으로 합쳐야 합니다."]}
        interpretation="유효 token 1개의 loss가 2인 짧은 답과 유효 token 9개의 loss가 모두 0인 긴 답을 묶으면 token mean은 0.2지만 example mean은 1.0입니다. 같은 data라도 reduction이 바뀌면 어떤 example에 더 큰 gradient weight를 주는지가 달라집니다."
      />
    </section>
  );
}

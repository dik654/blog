import ExplainedFormula from "@/components/ui/explained-formula";
import ResponseMaskViz from "./viz/ResponseMaskViz";

export default function Objective() {
  return (
    <section id="response-loss" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Response-only loss는 prompt를 읽게 하되 prompt token을 정답으로 채점하지 않는다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert"><p>Model은 response를 예측하려면 prompt token을 attention context로 읽어야 합니다. 그러나 loss mask를 response 위치에만 1로 두면 prompt 자체를 재생하는 gradient는 내지 않습니다. Full-sequence loss를 쓰는 recipe도 가능하지만 목적과 data mixture가 달라지므로 둘을 같은 설정으로 취급하면 안 됩니다.</p></div>
      <ExplainedFormula
        question="한 demonstration에서 어떤 next-token prediction만 SFT objective에 포함하는가?"
        idea={<>전체 token sequence의 conditional NLL을 계산하되 response target 위치에만 mask 1을 두고, 유효 target 수로 나누어 sample 길이에 따른 scale을 통제합니다.</>}
        formula={String.raw`\begin{aligned}M&=\sum_{t=1}^{T}m_t\\[2pt]\mathcal L_{\mathrm{SFT}}&=-\frac1M\sum_{t=1}^{T}m_t\log\pi_\theta(y_t\mid y_{<t})\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}M&=\underbrace{\sum_{t=1}^{T}m_t}_{\text{response loss mask 계산}}\\[2pt]\mathcal L_{\mathrm{SFT}}&=\underbrace{-\frac1M\sum_{t=1}^{T}m_t\log\pi_\theta(y_t\mid y_{<t})}_{\text{로그 비용 변환}}\end{aligned}`}
        operations={[
          { expression: String.raw`\sum_{t=1}^{T}m_t`, annotation: ["response loss mask이(가) 식의 결과에 기여하는","방식을 계산합니다.","전체 token sequence의 conditional","NLL을 계산하되 response target 위치에만"] },
          { expression: String.raw`-\frac1M\sum_{t=1}^{T}m_t\log\pi_\theta(y_t\mid y_{<t})`, annotation: ["확률이나 곱셈 규모를 더할 수 있는 log 비용으로 바꿉니다.","전체 token sequence의 conditional","NLL을 계산하되 response target 위치에만","mask 1을 두고, 유효 target 수로 나누어"] },
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
        annotatedFormula={String.raw`\begin{aligned}M_i&=\underbrace{\sum_t m_{it}}_{\text{loss mask 계산}}\\S_i&=\underbrace{\sum_t m_{it}\ell_{it}}_{\text{token NLL 계산}}\\[2pt]\mathcal L_{\rm token}&=\underbrace{\frac{\sum_i S_i}{\sum_i M_i}}_{\text{기준량당 비율}}\\[2pt]\mathcal L_{\rm example}&=\frac1N\sum_i\frac{S_i}{M_i}\end{aligned}`}
        operations={[
          { expression: String.raw`\sum_t m_{it}`, annotation: ["loss mask이(가) 식의 결과에 기여하는 방식을","계산합니다.","Token mean은 모든 유효 target token을 같은","weight로 보므로 긴 response의 비중이 커집니다."] },
          { expression: String.raw`\sum_t m_{it}\ell_{it}`, annotation: ["token NLL이(가) 식의 결과에 기여하는 방식을","계산합니다.","Token mean은 모든 유효 target token을 같은","weight로 보므로 긴 response의 비중이 커집니다."] },
          { expression: String.raw`\frac{\sum_i S_i}{\sum_i M_i}`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","Token mean은 모든 유효 target token을 같은","weight로 보므로 긴 response의 비중이 커집니다."] },
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

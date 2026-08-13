import ExplainedFormula from "@/components/ui/explained-formula";
import GPTQvsAWQViz from "./viz/GPTQvsAWQViz";

export default function GPTQAWQ() {
  return <section id="gptq-awq" className="mb-16 scroll-mt-20">
    <h2 className="mb-6 text-2xl font-bold">GPTQ와 AWQ는 같은 4-bit 결과를 만드는 이름이 아니라, 출력 오차를 줄이는 서로 다른 weight-only PTQ입니다</h2>
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <p>Weight matrix <code>W</code>를 단순히 element-wise로 가깝게 만드는 것보다 calibration activation <code>X</code>에서 layer output <code>XW</code>가 유지되는지가 더 중요합니다. GPTQ는 이 reconstruction problem의 approximate second-order information을 이용해 weight를 순차 quantize하고 아직 남은 column을 보정합니다.</p>
      <p>AWQ는 큰 activation과 곱해지는 channel의 weight error가 출력에 크게 드러난다는 관찰에서 출발합니다. Activation statistics로 salient channel을 찾은 뒤 hardware에 불리한 mixed precision 대신 equivalent channel scaling으로 그 weight의 effective quantization resolution을 높입니다.</p>
    </div>
    <ExplainedFormula
      question="Weight 오차 자체보다 calibration input에서 layer output 오차를 최소화하는 이유는 무엇일까요?"
      idea={<>같은 weight difference도 거의 사용되지 않는 input channel보다 큰 activation이 자주 들어오는 channel에서 output을 더 크게 바꿉니다. 그래서 reconstruction은 calibration activation으로 error에 가중치를 줍니다.</>}
      formula={String.raw`\min_{\widehat W\in\mathcal Q}\ \lVert XW-X\widehat W\rVert_F^2=\min_{\widehat W\in\mathcal Q}\operatorname{tr}\!\left((W-\widehat W)^\top X^\top X(W-\widehat W)\right)`}
      terms={[
        { symbol: "X", name: "calibration activations", description: "현재 linear layer에 실제 representative input을 넣어 얻은 input rows입니다." },
        { symbol: "W", name: "float weight matrix", description: "원 checkpoint의 high-precision linear transformation입니다." },
        { symbol: "W-hat", name: "quantized weight", description: "허용된 low-bit codebook과 group layout에 속하는 근사 weight입니다." },
        { symbol: "X^T X", name: "input curvature proxy", description: "어떤 input direction의 weight error가 output에 크게 나타나는지 반영합니다." },
      ]}
      assumptions={["현재 layer의 calibration output reconstruction proxy이며 전체 network task loss와 동일하지 않습니다.", "GPTQ의 실제 blockwise algorithm·damping·ordering은 이 식을 효율적으로 근사하는 구현 세부입니다.", "Calibration distribution 밖의 activation과 unsupported kernel에서는 논문 결과를 그대로 일반화할 수 없습니다."]}
      interpretation="X의 한 column이 자주 크다면 그 channel의 작은 weight 오차도 output 오차를 크게 만듭니다. GPTQ는 second-order 보정을, AWQ는 activation-aware scaling을 사용하지만 둘 다 최종 task·runtime에서 다시 검증해야 합니다."
    />
    <div className="not-prose my-8"><GPTQvsAWQViz /></div>
    <div className="grid gap-5 md:grid-cols-2">
      <div id="paper-gptq" className="not-prose scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">논문 읽기 · GPTQ</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">GPTQ는 대형 generative Transformer를 one-shot weight quantization할 때의 reconstruction과 계산 비용을 다룹니다. 논문의 3/4-bit 품질·속도는 OPT 계열, A100/A6000, 당시 kernel 구현 조건이며 현대 model·engine에 고정된 speedup이 아닙니다.</p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://arxiv.org/abs/2210.17323" target="_blank" rel="noreferrer">Second-order update·block quantization 범위 보기</a>
      </div>
      <div id="paper-awq" className="not-prose scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">논문 읽기 · AWQ</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">AWQ는 activation distribution으로 salient weight channel을 식별하고 equivalent scaling으로 보호하는 W4 방법을 제안했습니다. 논문의 품질·TinyChat 속도는 LLM/VLM·device·packing/kernel 조건에 속하며 모든 4-bit runtime의 결과가 아닙니다.</p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://arxiv.org/abs/2306.00978" target="_blank" rel="noreferrer">Salient channel·scaling·TinyChat 범위 보기</a>
      </div>
    </div>
    <div id="spec-gguf" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
      <p className="text-xs font-bold text-primary">공식 규격 읽기 · GGUF</p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">GGUF는 tensor와 typed metadata를 저장하고 mmap 가능한 loading을 목표로 하는 binary format입니다. Quantization method가 아니라 여러 tensor encoding type과 model/tokenizer metadata를 담는 container이므로 파일명만으로 algorithm·품질·kernel을 확정하지 않습니다.</p>
      <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://github.com/ggml-org/ggml/blob/master/docs/gguf.md" target="_blank" rel="noreferrer">Header·metadata·tensor encoding 규격 보기</a>
    </div>
  </section>;
}

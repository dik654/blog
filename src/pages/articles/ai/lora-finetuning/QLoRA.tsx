import ExplainedFormula from "@/components/ui/explained-formula";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import QLoraDetailViz from "./viz/QLoraDetailViz";

export default function QLoRA() {
  return (
    <section id="qlora" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        QLoRA에서는 저장·연산·학습 정밀도를 따로 봐야 합니다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          “Base가 4-bit다”라는 한 문장만으로 QLoRA의 계산을 설명할 수는
          없습니다. 무엇을 4-bit로 <em>저장</em>하는지와, 어떤 dtype으로
          <em>연산</em>하고 <em>학습</em>하는지를 나눠야 합니다.
        </p>
        <p>
          Base weight는 NF4 같은 low-bit code와 scale metadata로 저장됩니다. Matmul 경로에서는 지정된 compute dtype으로 복원되고 LoRA
          parameter, gradient와 optimizer state는 별도의 training dtype을 사용합니다.
        </p>
        <p>
          그러니 base 저장량만 보고 전체 training memory나 최종 artifact dtype을 판단하면 안 됩니다.
        </p>
        <p>
          NF4·block quantization·double quantization의 일반 원리는
          <a href="/ai/quantization"> 양자화 정본</a>에서 이어집니다. QLoRA의
          quantized base는 frozen이므로 일반 QAT처럼 quantizer error를 gradient로
          직접 수정하지 않습니다. Adapter가 task loss 아래에서 그 오차의 일부를
          보완할 수 있을 뿐입니다.
        </p>
      </div>
      <ExplainedFormula
        question="QLoRA의 한 layer에서 저장값·연산값·학습값은 어떻게 나뉠까요?"
        idea={<>Quantized code와 scale로 base weight를 저장하고 forward 때 compute dtype으로 복원합니다. Base 쪽 gradient는 저장하지 않지만, 그 layer를 지난 loss gradient는 adapter A와 B까지 역전파됩니다.</>}
        formula={String.raw`\begin{aligned}
y&=\operatorname{cast}_{c}\!\bigl(D(q_W,s_W)\bigr)x\\
&\quad+\frac{\alpha}{r}BAx\\
\nabla_{q_W,s_W}\mathcal L&=0\\
\nabla_{A,B}\mathcal L&\ne0
\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}
y&=\underbrace{\operatorname{cast}_{c}\!\bigl(D(q_W,s_W)\bigr)x}_{\text{quantized base storage 계산}}\\
&\quad+\frac{\alpha}{r}BAx\\
\nabla_{q_W,s_W}\mathcal L&=\underbrace{0}_{\text{quantized base storage 계산}}\\
\nabla_{A,B}\mathcal L&\ne0
\end{aligned}`}
        operations={[
          { expression: String.raw`\operatorname{cast}_{c}\!\bigl(D(q_W,s_W)\bigr)x`, annotation: ["quantized base storage이(가) 식의 결과에","기여하는 방식을 계산합니다.","Quantized code와 scale로 base","weight를 저장하고 forward 때 compute"] },
          { expression: String.raw`0`, annotation: ["quantized base storage이(가) 식의 결과에","기여하는 방식을 계산합니다.","Quantized code와 scale로 base","weight를 저장하고 forward 때 compute"] },
        ]}
        terms={[
          { symbol: "q_W,s_W", name: "quantized base storage", description: "Low-bit code와 block/group별 quantization metadata입니다." },
          { symbol: "D", name: "dequantization", description: "Code와 scale을 approximate weight로 복원하는 연산입니다." },
          { symbol: "c", name: "compute dtype", description: "bf16·fp16 등 matmul에 사용하는 연산 precision입니다." },
          { symbol: "A,B", name: "trainable adapter", description: "더 높은 training precision으로 유지하며 gradient를 받는 LoRA parameter입니다." },
        ]}
        assumptions={["Base quantizer·block size·scale dtype·compute dtype·kernel을 함께 기록합니다.", "Frozen base에 gradient/optimizer state를 만들지 않는지 runtime에서 확인합니다.", "Dequantized weight는 원래 full-precision W와 같지 않으므로 full-precision LoRA와 paired quality를 비교합니다."]}
        interpretation="GPU에는 4-bit code만 영구 저장하더라도 matmul 경로는 bf16 값을 사용하거나 fused dequantize를 수행할 수 있습니다. Adapter는 그 위에서 학습되며 base code는 바뀌지 않습니다."
      />
      <ExplainedFormula
        question="QLoRA가 peak memory를 줄이는 항과 그대로 남는 항을 어떻게 구분할까요?"
        idea={<>Base storage, quantization metadata, adapter parameter·gradient·optimizer, activation과 workspace를 별도 장부로 더합니다. Parameter bit만 계산하면 activation peak와 temporary dequant workspace를 놓칩니다.</>}
        formula={String.raw`\begin{aligned}
M_{\mathrm{train}}&\approx \frac{N_Wb}{8}+M_{\mathrm{qmeta}}+M_{A,B}\\
&\quad+M_{\mathrm{grad}}+M_{\mathrm{opt}}+M_{\mathrm{act}}\\
&\quad+M_{\mathrm{workspace}}
\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}
M_{\mathrm{train}}&\approx \underbrace{\frac{N_Wb}{8}+M_{\mathrm{qmeta}}}_{\text{frozen base와 quantization metadata}}+\underbrace{M_{A,B}+M_{\mathrm{grad}}+M_{\mathrm{opt}}}_{\text{trainable adapter state}}\\
&\quad+\underbrace{M_{\mathrm{act}}+M_{\mathrm{workspace}}}_{\text{sequence와 kernel이 만드는 runtime peak}}
\end{aligned}`}
        operations={[
          { expression: String.raw`\frac{N_Wb}{8}+M_{\mathrm{qmeta}}`, annotation: ["Base scalar와 bit 수를 byte로 바꾸고", "quantization metadata를 더합니다"] },
          { expression: String.raw`M_{A,B}+M_{\mathrm{grad}}+M_{\mathrm{opt}}`, annotation: ["학습되는 adapter의 weight·gradient·optimizer를", "각 dtype의 실제 byte로 합산합니다"] },
          { expression: String.raw`M_{\mathrm{act}}+M_{\mathrm{workspace}}`, annotation: ["Backward activation과 temporary workspace를 더해", "parameter 장부가 놓치는 peak를 포함합니다"] },
        ]}
        terms={[
          { symbol: "N_W,b", name: "base count · storage bits", description: "Frozen base scalar 수와 scalar당 low-bit code 크기입니다." },
          { symbol: "M_qmeta", name: "quantization metadata", description: "Scale·zero-point·double-quant metadata와 alignment입니다." },
          { symbol: "M_A,B,grad,opt", name: "adapter training state", description: "Adapter weight·gradient·optimizer state의 실제 dtype별 byte입니다." },
          { symbol: "M_act", name: "saved activations", description: "Sequence·batch·checkpointing에 따라 달라지는 backward용 activation입니다." },
          { symbol: "M_workspace", name: "runtime workspace", description: "Kernel temporary buffer·paged optimizer·allocator reserve 등입니다." },
        ]}
        assumptions={["Byte 단위를 통일하고 allocator가 보고한 peak와 비교합니다.", "Gradient checkpointing·sequence packing·batch와 optimizer가 같을 때 후보를 비교합니다.", "식은 1차 ledger이며 fragmentation·offload·communication·kernel별 temporary peak를 profile로 보완합니다."]}
        interpretation="Base storage가 16-bit에서 4-bit로 줄어도 activation이 peak의 절반이면 전체 memory가 4배 줄지 않습니다. 먼저 장부에서 가장 큰 항을 확인해야 합니다."
      />
      <div className="not-prose my-8"><QLoraDetailViz /></div>
      <ProgressiveDetail
        title="QLoRA의 품질 차이를 base quantization 때문이라고 말하려면 무엇을 고정해야 하나요?"
        preview="LoRA와 QLoRA의 data·adapter·update 조건을 맞춘 paired comparison이 필요합니다."
      >
        <p>
          Base revision, data split, rank, target module, α, optimizer와 update 수를
          같게 둡니다. Storage dtype과 compute dtype, seed도 함께 기록합니다.
        </p>
        <p>
          그런 다음 untouched test에서 target·general·safety slice를 평가하고 peak memory와 step time을 같은 실행 조건에서 측정합니다.
          그래야 메모리 절감과 품질 차이를 서로 다른 원인으로 분리할 수 있습니다.
        </p>
      </ProgressiveDetail>
      <div id="reading-qlora" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">핵심 논문 · QLoRA</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Dettmers 등은 frozen 4-bit quantized base를 통해 LoRA adapter로 gradient를 전달하고 NF4·double
          quantization·paged optimizer를 조합했습니다. 이 구성으로 65B model을 단일 48GB GPU에서 fine-tuning한 결과를 보고했습니다.
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          이는 논문의 LLaMA/T5, instruction dataset, Guanaco와 당시 chatbot 평가
          범위의 결과입니다. 모든 hardware·kernel·task에서 full 16-bit
          fine-tuning과 동등하거나 judge benchmark 하나로 충분하다는 뜻은
          아닙니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://arxiv.org/abs/2305.14314" target="_blank" rel="noreferrer">NF4·double quantization·paged optimizer와 평가 보기</a>
      </div>
    </section>
  );
}

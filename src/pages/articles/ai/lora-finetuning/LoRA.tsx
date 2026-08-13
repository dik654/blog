import ExplainedFormula from "@/components/ui/explained-formula";
import LoraMatrixViz from "./viz/LoraMatrixViz";

export default function LoRA() {
  return (
    <section id="lora" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">LoRA는 큰 weight 전체를 다시 쓰지 않고, 가능한 변화 방향을 rank r인 부분공간으로 제한합니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>Linear layer의 base weight가 <code>d_out × d_in</code>이라면 full update도 같은 크기입니다. LoRA는 input을 먼저 <code>d_in → r</code>로 줄이는 A와 다시 <code>r → d_out</code>으로 늘리는 B를 학습합니다. 중간 폭 r이 작기 때문에 <code>BA</code>가 만들 수 있는 독립 변화 방향은 최대 r개입니다.</p>
      </div>
      <ExplainedFormula
        question="LoRA forward와 두 adapter 행렬의 shape는 어떻게 연결될까요?"
        idea={<>Base output Wx는 그대로 두고 adapter branch BAx를 더합니다. α/r는 rank를 바꿀 때 update scale이 함께 커지는 정도를 조절하는 convention이며, 최적값을 보장하는 상수는 아닙니다.</>}
        formula={String.raw`\begin{aligned}
y&=Wx+sBAx\\
A&\in\mathbb R^{r\times d_{\mathrm{in}}}\\
B&\in\mathbb R^{d_{\mathrm{out}}\times r}\\
s&=\frac{\alpha}{r}
\end{aligned}`}
        terms={[
          { symbol: "W", name: "frozen base weight", description: "Shape dout×din인 pretrained linear weight입니다." },
          { symbol: "A", name: "down projection", description: "Input feature를 r차원 adapter coordinate로 줄입니다." },
          { symbol: "B", name: "up projection", description: "r차원 adapter 값을 output dimension으로 되돌립니다." },
          { symbol: "r", name: "rank budget", description: "Adapter 중간 폭이자 update matrix rank의 상한입니다." },
          { symbol: "s", name: "adapter scale", description: "구현 convention에 따라 α/r 등으로 정하는 update 배율입니다." },
        ]}
        assumptions={["Target은 affine/linear weight이고 bias 학습 여부를 별도로 기록합니다.", "Matrix 곱 순서와 library의 A/B naming·fan-in/fan-out convention을 확인합니다.", "Dropout이 있다면 training adapter branch에만 적용되는 위치와 inference 동작을 고정합니다."]}
        interpretation="din=dout=4096, r=8이면 A는 8×4096, B는 4096×8입니다. Base output과 같은 4096차원 update가 만들어지므로 두 값을 더할 수 있습니다."
      />
      <ExplainedFormula
        question="왜 r이 작으면 parameter는 크게 줄고 update 자유도도 제한될까요?"
        idea={<>Full matrix는 din·dout개의 값을 가지지만 두 adapter는 r(din+dout)개만 가집니다. 또한 행렬 곱 BA의 rank는 A와 B 각각의 rank보다 클 수 없으므로 최대 r입니다.</>}
        formula={String.raw`\begin{aligned}
N_{\mathrm{LoRA}}&=r(d_{\mathrm{in}}+d_{\mathrm{out}})\\
\operatorname{rank}(BA)&\le \min(\operatorname{rank}A,\operatorname{rank}B)\\
&\le r
\end{aligned}`}
        terms={[
          { symbol: "N_LoRA", name: "adapter parameters", description: "한 target weight에 추가되는 A와 B의 scalar 수입니다." },
          { symbol: "din·dout", name: "full update parameters", description: "같은 layer의 unrestricted full matrix가 가지는 scalar 수입니다." },
          { symbol: "rank(BA)", name: "update rank", description: "LoRA가 표현할 수 있는 독립 output/input 변화 방향의 수입니다." },
        ]}
        assumptions={["한 layer의 A/B만 센 값이며 target layer 수·bias·modules_to_save를 전체 합계에 포함합니다.", "작은 rank가 실제 task update에 충분하다는 것은 data와 validation으로 확인합니다.", "Parameter 수 감소가 wall-clock·peak-memory 감소와 같지 않으므로 activation·kernel·optimizer를 따로 측정합니다."]}
        interpretation="4096×4096 full update는 약 1,678만 parameter지만 r=8 LoRA는 65,536개로 약 0.39%입니다. 대신 BA가 표현하는 update rank는 최대 8입니다."
      />
      <div className="not-prose my-8"><LoraMatrixViz /></div>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>Rank 하나만 고르면 끝나지 않습니다. Attention의 q·k·v·o projection과 MLP의 gate·up·down projection 중 어디에 capacity를 배분할지 정해야 합니다. Model family마다 module 이름과 fused layout이 다르므로 문자열을 복사하지 말고 실제 named modules, trainable parameter 수와 forward hook을 확인합니다. 후보를 비교할 때는 data·update 수·α·dropout·initialization을 고정하고 seed를 반복하며, target/general metric과 peak memory·step time을 같은 validation protocol에서 기록합니다.</p>
      </div>
      <div id="reading-lora" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">핵심 논문 · LoRA</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Hu 등은 pretrained weight를 고정하고 Transformer layer에 trainable rank-decomposition matrix를 삽입해 task별 trainable parameter와 checkpoint 비용을 줄였습니다. 논문은 RoBERTa·DeBERTa·GPT-2·GPT-3 조건에서 full fine-tuning과 품질·throughput·memory를 비교하고 adaptation update의 rank deficiency를 분석했습니다. 보고된 큰 절감 배율을 다른 model·target module·optimizer에 그대로 적용할 수는 없습니다.</p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://arxiv.org/abs/2106.09685" target="_blank" rel="noreferrer">Low-rank parameterization과 실험 범위 보기</a>
      </div>
    </section>
  );
}

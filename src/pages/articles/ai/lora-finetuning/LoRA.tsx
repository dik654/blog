import ExplainedFormula from "@/components/ui/explained-formula";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import LoraMatrixViz from "./viz/LoraMatrixViz";
import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";

export default function LoRA({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="lora" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Rank r은 adapter가 배울 변화 방향의 수를 제한합니다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Linear layer의 base weight가 <code>d_out × d_in</code>이라면, 제한 없는
          full update도 같은 크기입니다. LoRA는 이 큰 변화량을 바로 학습하지
          않습니다.
        </p>
        <p>
          대신 input을 <code>d_in → r</code>로 줄이는 A와, 다시
          <code>r → d_out</code>으로 늘리는 B를 학습합니다. 중간 통로의 폭이
          r이므로 <code>BA</code>가 만들 수 있는 독립 변화 방향도 최대 r개입니다.
        </p>
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
        annotatedFormula={String.raw`\begin{aligned}
y&=\underbrace{Wx+sBAx}_{\text{오른쪽 항으로 결과 계산}}\\
A&\in\mathbb R^{r\times d_{\mathrm{in}}}\\
B&\in\mathbb R^{d_{\mathrm{out}}\times r}\\
s&=\underbrace{\frac{\alpha}{r}}_{\text{기준량당 비율}}
\end{aligned}`}
        operations={[
          { expression: String.raw`Wx+sBAx`, annotation: ["왼쪽 결과를 오른쪽의 실제 항으로 계산합니다.","Base output Wx는 그대로 두고 adapter","branch BAx를 더합니다."] },
          { expression: String.raw`\frac{\alpha}{r}`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","Base output Wx는 그대로 두고 adapter","branch BAx를 더합니다."] },
        ]}
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
        annotatedFormula={String.raw`\begin{aligned}
N_{\mathrm{LoRA}}&=\underbrace{r(d_{\mathrm{in}}+d_{\mathrm{out}})}_{\text{오른쪽 항으로 결과 계산}}\\
\operatorname{rank}(BA)&\le \min(\operatorname{rank}A,\operatorname{rank}B)\\
&\le r
\end{aligned}`}
        operations={[
          { expression: String.raw`r(d_{\mathrm{in}}+d_{\mathrm{out}})`, annotation: ["왼쪽 결과를 오른쪽의 실제 항으로 계산합니다.","Full matrix는 din·dout개의 값을 가지지만 두","adapter는 r(din+dout)개만 가집니다."] },
        ]}
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
        <p>
          하지만 rank 하나만 고르면 끝나는 것은 아닙니다. Attention의 query,
          key, value, output projection과 MLP의 gate, up, down projection 가운데
          어디에 adapter를 붙일지도 capacity를 바꿉니다.
        </p>
        <p>
          Model family마다 module 이름과 fused layout이 다릅니다. 다른 설정의 문자열을 그대로 복사하지 말고 실제 named module과 trainable
          parameter 수를 확인해야 합니다.
        </p>
        <p>
          후보를 비교할 때는 data, update 수, α, dropout과 initialization을
          고정합니다. 여러 seed에서 target·general metric뿐 아니라 peak memory와
          step time도 같은 protocol로 기록해야 rank의 효과를 분리할 수 있습니다.
        </p>
      </div>
      <TermBreakdown
        title="Rank 말고도 adapter 크기를 바꾸는 세 값"
        description="같은 rank라도 alpha·scaling·dropout이 다르면 실제 학습되는 delta와 정규화가 달라집니다."
        items={[
          {
            term: "LoRA alpha",
            description:
              "Adapter branch의 배율을 정하는 고정 hyperparameter입니다. Rank r과 따로 지정하고, 실제로 곱해지는 값은 alpha 자체가 아니라 alpha와 r의 비율입니다.",
            example: "앞서 본 s=α/r에서 α가 이 값입니다. Unsloth snapshot은 r=16, α=16을 써서 s=1이 됩니다.",
            boundary: "Alpha를 rank와 같은 값으로 두는 것이 규칙은 아니며, 구현마다 s를 계산하는 공식이 다를 수 있습니다.",
          },
          {
            term: "LoRA scaling",
            description:
              "s=α/r처럼 alpha와 rank의 비율로 adapter delta 크기를 조절하는 계산입니다. Rank만 바꾸고 alpha를 그대로 두면 s가 달라져 같은 학습 곡선을 기대할 수 없습니다.",
            example: "r을 16에서 32로 올리면서 α=16을 유지하면 s는 1에서 0.5로 줄어 delta가 더 작아집니다.",
            boundary: "s를 rank와 무관하게 비슷한 크기로 유지하려는 rank-stabilized 방식(예: α/√r)도 있어, 실제 어떤 scaling 공식을 쓰는지 먼저 확인해야 합니다.",
          },
          {
            term: "LoRA dropout",
            description:
              "Base weight가 아니라 adapter 입력에만 적용하는 dropout입니다. A로 들어가기 전 활성값 일부를 무작위로 0으로 만들어 low-rank branch만 정규화합니다.",
            example: "흔히 0~0.1 사이 값을 쓰며, 값이 클수록 학습 중 adapter 출력의 분산이 커집니다.",
            boundary: "Inference나 merge 시점에는 dropout을 끕니다. 켜진 채로 비교하면 merge 전후 결과가 달라져 앞서 본 동치 조건이 깨집니다.",
          },
        ]}
      />
      <ExplainedFormula
        question="Rank를 낮춰 trainable parameter ratio를 줄이면 memory와 compute budget도 같은 비율로 줄어들까요?"
        idea={<>Trainable parameter ratio는 adapter parameter를 전체 model parameter로 나눈 값입니다. Memory footprint 중 gradient·optimizer state는 이 비율을 따라 줄지만, base forward와 activation은 rank와 무관하게 남습니다. Compute budget은 대부분 frozen base를 통과하는 FLOPs가 정하므로 adapter parameter가 줄어도 크게 줄지 않습니다.</>}
        formula={String.raw`\begin{aligned}
\rho&=\frac{N_{\mathrm{adapter}}}{N_{\mathrm{model}}}\\
M_{\mathrm{train}}&\approx N_{\mathrm{model}}b_{\mathrm{base}}+M_{\mathrm{act}}\\
&\quad+N_{\mathrm{adapter}}(b_p+b_g+b_o)\\
C_{\mathrm{step}}&\approx C(N_{\mathrm{model}})
\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}
\rho&=\underbrace{\frac{N_{\mathrm{adapter}}}{N_{\mathrm{model}}}}_{\text{trainable parameter ratio}}\\
M_{\mathrm{train}}&\approx \underbrace{N_{\mathrm{model}}b_{\mathrm{base}}+M_{\mathrm{act}}}_{\text{rank와 무관한 항}}\\
&\quad+\underbrace{N_{\mathrm{adapter}}(b_p+b_g+b_o)}_{\text{rank를 따라 줄어드는 항}}\\
C_{\mathrm{step}}&\approx \underbrace{C(N_{\mathrm{model}})}_{\text{base FLOPs가 지배}}
\end{aligned}`}
        operations={[
          { expression: String.raw`\frac{N_{\mathrm{adapter}}}{N_{\mathrm{model}}}`, annotation: ["분자에 둔 adapter parameter 수를 분모의","전체 model parameter 수로 정규화합니다."] },
          { expression: String.raw`N_{\mathrm{model}}b_{\mathrm{base}}+M_{\mathrm{act}}`, annotation: ["Base storage와 activation은 rank를 바꿔도","거의 그대로 남는 항입니다."] },
          { expression: String.raw`N_{\mathrm{adapter}}(b_p+b_g+b_o)`, annotation: ["Adapter parameter·gradient·optimizer state만","rank를 따라 늘거나 줄어드는 항입니다."] },
        ]}
        terms={[
          { symbol: "rho", name: "trainable parameter ratio", description: "Adapter parameter 수를 전체 model parameter 수로 나눈 값입니다." },
          { symbol: "N_adapter", name: "adapter parameter count", description: "선택한 모든 target module의 A,B를 합산한 parameter 수입니다." },
          { symbol: "N_model", name: "model parameter count", description: "Base 전체가 가진 parameter 수입니다." },
          { symbol: "b_base,b_p,b_g,b_o", name: "per-parameter bytes", description: "각각 base 저장, adapter 저장, gradient, optimizer state 한 parameter당 byte입니다." },
          { symbol: "M_act", name: "activation memory", description: "Sequence·batch·checkpointing에 따라 달라지는 backward용 activation입니다." },
          { symbol: "C_step", name: "step compute budget", description: "한 step에 필요한 FLOPs를 GPU-시간으로 환산한 예산입니다." },
        ]}
        assumptions={["N_adapter는 실제 선택한 target module과 rank로 계산하고, 후보를 바꿀 때마다 다시 셉니다.", "byte 상수는 storage/compute/training dtype과 optimizer 종류에 따라 달라지므로 profiling으로 확인합니다.", "Compute budget은 GPU-시간(step time × step 수)으로 측정하며 parameter ratio만으로 추정하지 않습니다."]}
        interpretation="이 글의 target-module 예시를 7B 모델 전체와 비교하면 r=8일 때 adapter parameter는 약 20M으로 trainable parameter ratio는 약 0.29%이고, r=16이면 약 0.57%입니다. Hu 등은 GPT-3 175B에 rank 4 LoRA를 적용해 trainable parameter를 약 10,000배, GPU memory를 약 3배 줄였다고 보고했습니다. 다만 forward/backward가 여전히 전체 175B parameter를 통과하므로 이 절감이 compute budget까지 같은 비율로 옮겨가지는 않습니다."
      />
      <ProgressiveDetail
        title="함께 보관한 Unsloth snapshot은 target module을 어떻게 고르나요?"
        preview="한 가지 실전 기본값일 뿐이며, 현재 설치된 model과 PEFT가 같은 module·option을 지원하는지 확인해야 합니다."
      >
        <p>
          이 글에 포함한 <code>get_peft_model()</code> snapshot은 r=16,
          lora_alpha=16으로 두고 attention·MLP의 일곱 linear projection을 target으로
          선택합니다. 이는 모든 model의 최적값이 아니라 해당 구현이 제공하는
          출발점입니다.
        </p>
        <p>
          Snapshot에는 rank가 커질 때 scale을 조정하는 <code>use_rslora</code>도
          있습니다. 지원하지 않는 PEFT version에서 이 option을 요청하면 조용히
          무시하지 않고 오류를 내도록 경계를 둡니다.
        </p>
      </ProgressiveDetail>
      <div className="not-prose mb-8">
        <CodeViewButton
          label="get_peft_model — 실전 기본값과 rslora 검증"
          onClick={() => onCodeRef("lora-hyperparams", codeRefs["lora-hyperparams"])}
        />
      </div>
      <div id="reading-lora" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">핵심 논문 · LoRA</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Hu 등은 pretrained weight를 고정하고 Transformer layer에 trainable rank-decomposition matrix를 삽입했습니다. Task별
          trainable parameter와 checkpoint 비용을 줄이자는 제안이었습니다.
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          논문은 RoBERTa, DeBERTa, GPT-2와 GPT-3 조건에서 full fine-tuning과 품질,
          throughput, memory를 비교하고 adaptation update의 rank deficiency를
          분석했습니다. 보고된 절감 배율을 다른 model, target module과 optimizer에
          그대로 적용할 수는 없습니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://arxiv.org/abs/2106.09685" target="_blank" rel="noreferrer">Low-rank parameterization과 실험 범위 보기</a>
      </div>
    </section>
  );
}

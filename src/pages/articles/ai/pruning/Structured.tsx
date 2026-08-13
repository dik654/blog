import ExplainedFormula from "@/components/ui/explained-formula";
import StructuredViz from "./viz/StructuredViz";

export default function Structured() {
  return (
    <section id="structured" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Structured pruning은 tensor shape를 줄이고, N:M sparsity는 정해진 묶음 안에서만 weight를 남깁니다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Channel·neuron을 제거하면 현재 layer의 output dimension과 다음 layer의 input dimension이 함께 줄어듭니다. 이 변화가 graph 전체에 전파되면 일반 dense kernel도 더 작은 matrix를 계산할 수 있습니다. 대신 residual add, normalization, grouped convolution, attention projection처럼 같은 dimension을 공유하는 경로를 함께 고쳐야 합니다.
        </p>
        <p>
          Attention head를 지운다고 항상 hidden size가 줄어드는 것도 아닙니다. 남은 head output을 원래 크기로 다시 투영하거나 0으로 채우면 parameter는 줄어도 dense GEMM shape가 유지될 수 있습니다. 따라서 “head 25% 제거”가 아니라 export된 tensor shape와 compiler가 선택한 kernel을 확인해야 합니다.
        </p>
      </div>
      <ExplainedFormula
        question="Linear layer의 input·output dimension을 줄이면 계산량이 어떻게 달라질까요?"
        idea={<>Batch와 token을 묶은 행 수를 <code>T</code>라고 하면 dense matrix multiplication은 각 output마다 모든 input을 곱합니다. 두 dimension을 각각 일정 비율로 남기면 주된 multiply-add 수도 그 비율의 곱으로 줄어듭니다.</>}
        formula={String.raw`\begin{aligned}C&\approx2Td_{\mathrm{in}}d_{\mathrm{out}},\\d'_{\mathrm{in}}&=\alpha d_{\mathrm{in}},\\d'_{\mathrm{out}}&=\beta d_{\mathrm{out}},\\C'/C&\approx\alpha\beta.\end{aligned}`}
        terms={[
          { symbol: "T", name: "token rows", description: "Batch×sequence처럼 같은 linear layer를 통과하는 input row 수입니다." },
          { symbol: "d_in", name: "input width", description: "Weight matrix의 입력 channel 수입니다." },
          { symbol: "d_out", name: "output width", description: "Weight matrix가 만드는 출력 channel 수입니다." },
          { symbol: "alpha, beta", name: "retention ratios", description: "Pruning 뒤 각각 남은 input·output dimension 비율입니다." },
          { symbol: "C", name: "operation estimate", description: "곱셈과 덧셈을 각각 하나로 센 주된 dense 연산량 근사입니다." },
        ]}
        assumptions={[
          "표준 dense GEMM의 산술량만 센 식이며 bias·activation·memory traffic·launch·communication은 포함하지 않습니다.",
          "Graph dependency를 실제로 제거해 weight shape가 바뀌었다고 가정합니다.",
          "Alignment가 깨지거나 작은 matrix가 되어 occupancy가 낮아지면 FLOPs 비율과 latency 비율이 달라집니다.",
        ]}
        interpretation="Input과 output width를 각각 75% 남기면 주된 계산량은 .75×.75=.5625, 즉 원래의 56.25%가 됩니다. 다만 end-to-end latency가 43.75% 줄었다는 뜻은 아닙니다."
      />
      <ExplainedFormula
        question="2:4 semi-structured sparsity는 전체 sparsity 50%와 무엇이 다를까요?"
        idea={<>Reduction axis를 연속된 4개씩 나눈 모든 묶음에서 정확히 2개만 남겨야 sparse MMA가 해석할 수 있는 규칙적인 layout이 됩니다. 전체 개수만 절반으로 맞춰도 한 묶음에 3개가 남으면 제약을 위반합니다.</>}
        formula={String.raw`\begin{aligned}\forall g\in\mathcal G_M:\quad&\sum_{i\in g}M_i=N,\\\text{2:4}:\quad&(N,M)=(2,4).\end{aligned}`}
        terms={[
          { symbol: "G_M", name: "local groups", description: "Kernel이 정한 reduction axis에서 연속된 M개 weight 묶음의 집합입니다." },
          { symbol: "M_i", name: "binary mask entry", description: "묶음 안에서 남긴 weight는 1, 제거한 weight는 0입니다." },
          { symbol: "N:M", name: "semi-structured pattern", description: "각 M개 묶음마다 N개를 남기는 local constraint입니다." },
        ]}
        assumptions={[
          "N:M 표기에서 N을 남은 수로 쓰는 convention이며 문서·library의 축과 layout을 함께 확인합니다.",
          "Hardware와 runtime이 해당 dtype·operation·shape의 sparse tactic을 지원해야 합니다.",
          "Mask가 적격이어도 dense tactic이 더 빠르면 compiler가 sparse tactic을 선택하지 않을 수 있습니다.",
        ]}
        interpretation="Mask [1,1,0,0 | 1,0,1,0]은 두 묶음 모두 2개를 남겨 2:4입니다. [1,1,1,0 | 1,0,0,0]도 전체로는 4/8이 남지만 첫 묶음이 3개라 2:4가 아닙니다."
      />
      <div className="not-prose my-8">
        <StructuredViz />
      </div>
      <div id="spec-tensorrt-sparsity" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">공식 구현 문서 읽기 · TensorRT structured sparsity</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          TensorRT 문서는 convolution과 constant-input MatrixMultiply에서 2:4를 검사하는 축, 지원 precision과 builder flag를 명시합니다. 중요한 점은 적격 layer 수와 실제 sparse tactic 선택 수가 다를 수 있다는 설명입니다. Pattern을 만족해도 problem size에서는 dense tactic이 더 빠를 수 있으므로 verbose build log와 같은 engine의 benchmark가 최종 근거입니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://docs.nvidia.com/deeplearning/tensorrt/latest/inference-library/data-formats-tensors.html#sparsity" target="_blank" rel="noreferrer">
          2:4 검사 규칙·tactic 선택 조건 보기
        </a>
      </div>
    </section>
  );
}

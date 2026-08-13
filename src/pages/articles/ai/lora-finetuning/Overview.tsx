import ContentBoundary from "@/components/articles/content-boundary";
import ExplainedFormula from "@/components/ui/explained-formula";
import PeftCompareViz from "./viz/PeftCompareViz";

export default function Overview() {
  return (
    <section id="overview" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">LoRA의 출발점은 “모델을 작게 만든다”가 아니라, 고정된 base model에 필요한 변화만 작은 별도 artifact로 학습하는 것입니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">Full fine-tuning은 base weight 전체에 gradient를 만들고 optimizer state까지 유지합니다. 모델이 커지면 한 task를 위해 같은 크기의 checkpoint를 매번 저장하는 비용도 커집니다. Low-Rank Adaptation(LoRA)은 base weight를 고정한 채 선택한 linear layer의 변화량만 두 작은 행렬로 표현합니다.</p>
        <p>따라서 줄어드는 것은 우선 <strong>trainable parameter·gradient·optimizer state와 task별 checkpoint</strong>입니다. Base weight를 읽는 forward cost와 activation이 사라지는 것은 아니며, adapter를 merge하지 않은 serving에서는 추가 matmul과 adapter routing 비용이 생길 수 있습니다. LoRA를 inference quantization이나 작은 student와 같은 압축으로 세면 안 되는 이유입니다.</p>
        <p>이 글은 base와 adapter의 경계, low-rank update의 shape와 capacity, QLoRA의 저장/연산 precision, chat template·loss mask, merge·requantization·배포 artifact를 차례로 다룹니다. 어떤 adaptation 방법을 고를지는 <a href="/ai/domain-finetuning">도메인 적응 정본</a>, 행렬 rank가 처음이라면 <a href="/ai/math-matrices-svd">행렬·SVD 정본</a>을 먼저 따라갈 수 있습니다.</p>
      </div>
      <ContentBoundary article="lora-finetuning" />
      <ExplainedFormula
        question="Full fine-tuning과 LoRA에서 실제로 업데이트되는 파라미터 집합은 어떻게 다를까요?"
        idea={<>Loss는 같은 model output에서 계산할 수 있지만 gradient를 적용하는 집합이 다릅니다. Full fine-tuning은 모든 base parameter를, LoRA는 adapter와 명시적으로 저장한 module만 optimizer에 넘깁니다.</>}
        formula={String.raw`\Theta_{\mathrm{train}}^{\mathrm{full}}=\Theta_{\mathrm{base}},\qquad \Theta_{\mathrm{train}}^{\mathrm{LoRA}}=\{A_m,B_m:m\in\mathcal T\}\cup\Theta_{\mathrm{save}}`}
        terms={[
          { symbol: "Theta_base", name: "base parameters", description: "Pretrained checkpoint의 전체 weight와 bias입니다." },
          { symbol: "T", name: "target modules", description: "LoRA update를 삽입하기로 한 실제 linear module 경로 집합입니다." },
          { symbol: "A_m,B_m", name: "adapter matrices", description: "Target module m에서 학습하는 두 low-rank 행렬입니다." },
          { symbol: "Theta_save", name: "modules to save", description: "Classifier·embedding 일부처럼 adapter 밖에서 의도적으로 학습·저장하는 module입니다." },
        ]}
        assumptions={["Optimizer가 받는 parameter의 requires_grad와 실제 checkpoint 저장 목록을 모두 확인합니다.", "Frozen base의 dropout·normalization buffer 등 train/eval state는 parameter freeze와 별도로 관리합니다.", "Trainable set이 작다고 activation memory와 base forward cost가 같은 비율로 줄지는 않습니다."]}
        interpretation="전체 7B weight 중 adapter 20M만 학습하면 optimizer state와 gradient는 주로 20M에만 필요하지만, forward/backward에서 base network를 통과하고 activation을 보존하는 비용은 남습니다."
      />
      <div className="not-prose my-8"><PeftCompareViz /></div>
    </section>
  );
}

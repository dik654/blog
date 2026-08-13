import ExplainedFormula from "@/components/ui/explained-formula";
import SelfDistillViz from "./viz/SelfDistillViz";

export default function SelfDistill() {
  return (
    <section id="self" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Self-distillation은 압축의 동의어가 아니라, 이전 checkpoint나 같은 family의 signal을 regularizer로 쓰는 반복 학습입니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>Teacher와 student가 같은 architecture·parameter 수여도 이전 generation의 soft target을 사용하면 self-distillation입니다. Born-Again Networks는 같은 크기의 student가 teacher를 넘는 사례를 보여 주었지만, 이 경우 목표는 model size 축소가 아니라 optimization·regularization 효과입니다.</p>
        <p>반복할수록 좋아진다고 가정하면 안 됩니다. Teacher가 특정 class·language에서 틀린 prediction을 confidence 있게 주면 다음 generation이 그 bias를 강화할 수 있습니다. 매 generation을 같은 독립 holdout에서 비교하고, teacher agreement 상승과 ground-truth quality 상승을 구분해야 합니다.</p>
      </div>
      <ExplainedFormula
        question="Teacher와의 일치도는 올라갔지만 정답 성능은 떨어지는 bias inheritance를 어떻게 측정할까요?"
        idea={<>각 slice에서 teacher와 student가 같은 prediction을 한 비율과 실제 정답 accuracy를 따로 계산합니다. 일치도 증가에서 accuracy 증가를 빼면 teacher 복제만 늘어난 위험 신호를 볼 수 있습니다.</>}
        formula={String.raw`\begin{aligned}A_k^{(g)}&=\frac1{n_k}\sum_{i\in k}\mathbf1[\widehat y_i^{(g)}=y_i],\\G_k^{(g)}&=\frac1{n_k}\sum_{i\in k}\mathbf1[\widehat y_i^{(g)}=\widehat y_{t,i}],\\R_k^{(g)}&=\Delta G_k^{(g)}-\Delta A_k^{(g)}.\end{aligned}`}
        terms={[
          { symbol: "A_k", name: "slice accuracy", description: "Generation g가 slice k의 ground truth를 맞힌 비율입니다." },
          { symbol: "G_k", name: "teacher agreement", description: "Student와 teacher prediction이 같은 비율입니다." },
          { symbol: "Delta", name: "generation change", description: "현재 generation에서 이전 generation 값을 뺀 변화량입니다." },
          { symbol: "R_k", name: "inheritance warning", description: "정답 개선보다 teacher agreement가 더 커진 차이를 보는 진단값입니다." },
        ]}
        assumptions={[
          "같은 고정 holdout·slice membership·prediction policy로 generation을 비교합니다.",
          "R은 causal bias metric이 아니라 teacher 복제와 task gain을 분리해 보는 진단입니다.",
          "Open-ended generation에서는 exact prediction 대신 rubric·human label·task metric과 teacher-similarity metric을 명시적으로 정의합니다.",
        ]}
        interpretation="Teacher agreement가 5%p 늘었지만 accuracy가 1%p 떨어졌다면 R=6%p입니다. Student가 teacher를 더 닮았다는 사실만으로 나아졌다고 승인할 수 없습니다."
      />
      <div className="not-prose my-8"><SelfDistillViz /></div>
      <div id="paper-born-again" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">논문 읽기 · Born Again Neural Networks</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">핵심 기여는 teacher보다 작은 student가 아니라 동일 architecture student를 distillation해 성능이 향상될 수 있음을 보인 점입니다. DenseNet의 CIFAR와 language-modeling 실험, generation recipe 범위의 관찰이며 어떤 model이든 여러 세대 반복하면 계속 좋아진다는 보장은 아닙니다.</p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://arxiv.org/abs/1805.04770" target="_blank" rel="noreferrer">Same-capacity student·세대별 실험 보기</a>
      </div>
    </section>
  );
}

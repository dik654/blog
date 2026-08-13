import ExplainedFormula from "@/components/ui/explained-formula";
import LabelSmoothingViz from "./viz/LabelSmoothingViz";

export default function LabelSmoothing() {
  return (
    <section id="label-smoothing" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Label smoothing은 one-hot target의 확신을 제한합니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          K-class classification에서 label smoothing은 정답 class에
          <code> 1-ε+ε/K</code>, 나머지 class에 <code>ε/K</code>를 배분합니다.
          Cross-entropy가 정답 logit을 끝없이 키우는 압력을 줄여 representation과
          confidence에 regularization을 주지만, label 자체가 불확실하다는 것을
          정확히 모델링하는 방법은 아닙니다.
        </p>
        <p>
          Accuracy가 좋아져도 probability calibration이 항상 개선되는 것은
          아니며, knowledge distillation에서 teacher의 class similarity를
          전달해야 할 때는 uniform smoothing이 정보를 지울 수 있습니다. 따라서
          ε는 고정 관행을 복사하지 않고 accuracy, NLL, ECE와 downstream use를
          함께 보고 선택합니다.
        </p>
      </div>
      <ExplainedFormula
        question="Label smoothing은 one-hot target과 cross-entropy를 정확히 어떻게 바꿀까?"
        idea={<>정답 one-hot e_y의 질량 1−ε은 유지하고 ε는 K classes의 uniform distribution u에 나눕니다. Cross-entropy의 선형성 때문에 hard-label loss와 uniform-target cross-entropy의 weighted sum으로 읽을 수 있습니다.</>}
        formula={String.raw`\begin{aligned}
u_k&=1/K,\\
\widetilde y&=(1-\varepsilon)e_y+\varepsilon u,\\
\mathcal L_{\mathrm{LS}}&=-(1-\varepsilon)\log p_y\\
&\quad-\frac{\varepsilon}{K}\sum_{k=1}^{K}\log p_k.
\end{aligned}`}
        terms={[
          { symbol: "K", name: "number of classes", description: "서로 배타적인 classification output classes의 수입니다." },
          { symbol: "e_y", name: "one-hot target", description: "정답 class y만 1이고 나머지는 0인 hard target vector입니다." },
          { symbol: "ε", name: "smoothing strength", description: "One-hot에서 uniform target으로 옮기는 probability mass의 비율입니다." },
          { symbol: "p_k", name: "predicted class probability", description: "Softmax가 class k에 할당한 probability입니다." },
        ]}
        assumptions={["Single-label K-class classification과 uniform smoothing을 가정합니다.", "Targets의 각 coordinate는 0 이상이고 합이 1이어야 합니다.", "Class weighting·ignore_index·Mixup과 결합하면 reduction과 effective target을 다시 유도합니다."]}
        interpretation="정답 class target은 1−ε+ε/K이고 나머지는 ε/K입니다. 이는 annotator uncertainty의 정답 model이 아니라 uniform prior를 섞는 의도적 regularizer입니다."
      />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          K=4, ε=0.1이고 두 번째 class가 정답이면 각 오답에는 0.1/4=0.025,
          정답에는 0.9+0.025=0.925를 둡니다. Target은
          (0.025, 0.925, 0.025, 0.025)이고 합은 1입니다. 정답 class probability를
          0.9로만 두고 나머지에 0.1을 또 더하면 normalization이 깨지므로 구현의
          convention을 식과 함께 확인해야 합니다.
        </p>
      </div>
      <div className="not-prose my-8"><LabelSmoothingViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Mixup·CutMix와 soft target이 겹치는지 확인합니다</h3>
        <p>
          Mixup과 CutMix는 입력을 섞으며 label도 비율에 맞춰 soft target으로
          만듭니다. 변환 정의와 annotation 동기화는
          <a href="/ai/data-augmentation">데이터 증강 글</a>에서 설명하고,
          여기서는 label smoothing과 동시에 적용했을 때 target entropy가
          지나치게 커지는지만 확인합니다.
        </p>
        <p>
          예를 들어 class 1과 2를 λ=0.7로 Mixup한 target은 (0.7,0.3,0,0)입니다.
          여기에 K=4, ε=0.1의 uniform smoothing을 적용하면
          0.9×(0.7,0.3,0,0)+0.1×(0.25,0.25,0.25,0.25) =
          (0.655,0.295,0.025,0.025)가 됩니다. 먼저 smoothing한 두 label을
          Mixup해도 이 선형 조합에서는 같지만 class weighting·ignore policy·다른
          nonlinear target transform이 끼면 순서를 다시 유도해야 합니다.
        </p>
        <p>
          Ablation은 hard label, label smoothing, mix-based augmentation,
          combination 네 조건을 같은 training budget에서 비교합니다. Minority
          class나 fine-grained class에서 성능이 다르게 움직일 수 있으므로 전체
          accuracy만으로 결론 내리지 않습니다.
        </p>
      </div>
      <div id="paper-label-smoothing" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">논문 읽기 · Inception-v3의 Label Smoothing</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Szegedy 등은 Inception architecture와 training recipe를 재검토하면서 one-hot target을 uniform prior와 섞는 label-smoothing regularization을 포함했습니다. ImageNet classification 결과는 smoothing이 모든 calibration metric·class imbalance·distillation 설정을 개선한다는 증거가 아닙니다.</p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://arxiv.org/abs/1512.00567" target="_blank" rel="noreferrer">Target 식과 Inception 실험 범위 보기</a>
      </div>
      <div id="docs-pytorch-label-smoothing" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">공식 문서 따라 읽기 · CrossEntropyLoss</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">현재 PyTorch CrossEntropyLoss는 class index 또는 같은 shape의 class-probability target을 받고 label_smoothing을 원래 target과 uniform distribution의 mixture로 정의합니다. Probability constraints는 엄격히 검증하지 않으므로 custom soft target의 합과 범위는 사용자가 확인해야 합니다.</p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://docs.pytorch.org/docs/stable/generated/torch.nn.CrossEntropyLoss.html" target="_blank" rel="noreferrer">현재 target·reduction·label_smoothing 계약 보기</a>
      </div>
    </section>
  );
}

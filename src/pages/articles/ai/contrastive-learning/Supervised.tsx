import ExplainedFormula from "@/components/ui/explained-formula";
import SupervisedViz from "./viz/SupervisedViz";

export default function Supervised() {
  return (
    <section id="supervised" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Supervised contrastive loss는 같은 label의 여러 sample을 positive로 사용합니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          SimCLR이 같은 원본의 두 view만 연결한다면 supervised contrastive learning은 batch 안에서 같은 label을 가진 sample을 모두 positive로 봅니다. 이렇게 하면 한 class의 여러 표현을 한 공간에 모을 수 있지만, label이 실제 의미 유사성을 충분히 나타낼 때만 이 가정이 성립합니다.
        </p>
        <p>
          Hierarchical label이나 multi-label 문제에서 최상위 class만 같다는 이유로 모든 sample을 동일한 positive로 묶으면 세부 의미가 사라질 수 있습니다. Positive set을 label hierarchy, annotation confidence와 pair relation에 맞춰 구성하고, 같은 class 안의 subgroup 성능을 따로 확인합니다.
        </p>
      </div>
      <div className="not-prose my-8"><SupervisedViz /></div>
      <ExplainedFormula
        question="같은 label의 positive가 여러 개라면 anchor loss를 어떻게 계산할까요?"
        idea={<>Anchor i와 같은 label을 가진 index 집합 P(i)를 만들고, 각 positive가 batch의 모든 다른 sample보다 높은 점수를 받도록 log-probability를 평균합니다.</>}
        formula={String.raw`\begin{aligned}
s_{ia}&=\mathbf z_i^\top\mathbf z_a/\tau,\\
Z_i&=\sum_{a\ne i}\exp(s_{ia}),\\
\mathcal L_i^{\mathrm{sup}}
&=-\frac{1}{|P(i)|}\sum_{p\in P(i)}
\log\frac{\exp(s_{ip})}{Z_i}.
\end{aligned}`}
        terms={[
          { symbol: "P(i)", name: "positive index set", description: "Batch에서 anchor i를 제외하고 같은 positive 관계를 가진 sample index 집합입니다." },
          { symbol: "|P(i)|", name: "positive count", description: "Anchor loss에 기여하는 positive 개수입니다." },
          { symbol: "a≠i", name: "comparison set", description: "Anchor 자신을 제외한 모든 view 또는 sample입니다." },
          { symbol: "τ", name: "temperature", description: "Similarity logit의 상대 차이를 조절합니다." },
        ]}
        assumptions={["P(i)가 비어 있지 않도록 class-aware batching을 하거나 빈 anchor를 명시적으로 제외합니다.", "같은 label이 contrastive task에서 같은 의미를 나타낸다는 전제가 필요합니다.", "Multi-label·hierarchical label에서는 positive relation을 별도로 정의해야 합니다."]}
        interpretation="A₁의 batch에 A₂·A₃가 있으면 두 항을 평균합니다. 같은 class가 하나도 없다면 1/|P(i)|가 정의되지 않으므로 구현에서 조용히 NaN이 나거나 anchor가 사라지지 않도록 sampler와 유효 anchor 수를 기록해야 합니다."
      />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Batch composition이 loss의 관측 범위를 정합니다</h3>
        <p>
          Anchor와 같은 class의 sample이 batch에 없으면 supervised positive를 만들 수 없고, 한 class가 batch 대부분을 차지하면 negative 다양성이 줄어듭니다. Class-aware sampler를 사용하되 실제 배포 분포와 다른 균형 batch가 calibration을 바꿀 수 있으므로 downstream classifier는 원래 분포에서도 평가합니다.
        </p>
        <p>
          이 loss는 cross-entropy의 자동 대체제가 아니라 representation 학습 도구입니다. Frozen linear probe, full fine-tuning과 retrieval을 같은 encoder checkpoint에서 비교해 class compactness가 실제 task 성능으로 이어지는지 확인합니다.
        </p>
      </div>
      <div id="paper-supcon" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">논문 읽기 · Supervised Contrastive Learning</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Khosla 등은 같은 class의 여러 sample을 positive로 사용하는 supervised contrastive objective를 제시하고 cross-entropy baseline과 비교했습니다. ImageNet·ResNet·논문의 augmentation과 batch recipe에서 나온 결과를 label hierarchy가 다른 모든 domain의 보장으로 확대하지 않습니다.</p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://papers.nips.cc/paper_files/paper/2020/hash/d89a66c7c80a29b1bdbab0f2a1a94af8-Abstract.html" target="_blank" rel="noreferrer">Multi-positive 식과 실험 조건 보기</a>
      </div>
    </section>
  );
}

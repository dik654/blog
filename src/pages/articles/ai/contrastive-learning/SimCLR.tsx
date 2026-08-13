import ExplainedFormula from "@/components/ui/explained-formula";
import SimCLRViz from "./viz/SimCLRViz";

export default function SimCLR() {
  return (
    <section id="simclr" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">SimCLR은 같은 원본의 두 view로 정답 쌍을 만듭니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          SimCLR은 label 없이 positive를 만들기 위해 원본 하나에서 random augmentation 두 개를 뽑습니다. Batch에 원본이 B개라면 view는 2B개가 되고, 같은 원본에서 나온 짝 하나만 anchor의 positive입니다. 나머지 2B−2개는 분모의 비교 대상이 됩니다. 따라서 crop·color jitter·blur 같은 augmentation 분포 자체가 self-supervised label을 만드는 셈입니다.
        </p>
        <p>
          Projection head는 contrastive objective가 직접 작용하는 공간과 downstream representation을 분리합니다. 학습 후에는 projection output이 아니라 encoder representation을 사용하며, head의 깊이나 차원은 고정 recipe가 아니므로 linear probe와 fine-tuning 결과로 확인합니다.
        </p>
      </div>
      <div className="not-prose my-8"><SimCLRViz /></div>
      <ExplainedFormula
        question="Anchor i가 자신의 positive j를 batch의 다른 view보다 가깝게 만들려면 어떤 loss를 쓸까요?"
        idea={<>Positive similarity의 지수값을 분자에 두고, anchor 자신을 제외한 모든 view의 지수값 합으로 나눕니다. 그 확률의 negative log를 줄이면 positive가 상대적으로 높은 점수를 갖게 됩니다.</>}
        formula={String.raw`\begin{aligned}
s_{ik}&=\operatorname{sim}(i,k)/\tau,\\
Z_i&=\sum_{k\ne i}\exp(s_{ik}),\\
\ell_{i,j}&=-\log\frac{\exp(s_{ij})}{Z_i}.
\end{aligned}`}
        terms={[
          { symbol: "i,j", name: "anchor and positive", description: "같은 원본에서 독립적으로 증강된 두 view의 index입니다." },
          { symbol: "2B", name: "number of views", description: "B개 원본에서 view를 두 개씩 만들었을 때 batch 안 전체 view 수입니다." },
          { symbol: "τ", name: "temperature", description: "Similarity 차이를 softmax가 얼마나 날카롭게 볼지 정하는 양수입니다." },
          { symbol: "1[k≠i]", name: "self mask", description: "Anchor가 자기 자신과 비교되는 항만 분모에서 제외합니다." },
        ]}
        assumptions={["각 원본의 두 view가 task 의미를 보존하는 positive라는 전제가 필요합니다.", "Batch의 다른 원본 view를 negative로 취급하므로 semantic duplicate와 같은 class가 false negative가 될 수 있습니다.", "전체 loss는 보통 i→j와 j→i를 모두 anchor로 삼아 평균냅니다."]}
        interpretation="Loss는 절대 거리를 정답으로 주지 않고, 같은 batch 후보 가운데 positive를 알아맞히는 cross-entropy로 볼 수 있습니다. Batch 구성이 바뀌면 같은 anchor의 학습 문제도 달라집니다."
      />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Temperature와 negative 수는 함께 해석합니다</h3>
        <p>
          Temperature가 낮으면 similarity 차이가 더 뾰족해져 가까운 negative에 gradient가 집중됩니다. Batch를 키우면 비교 대상이 늘지만 false negative도 함께 늘 수 있으므로 큰 batch 자체를 목표로 삼지 않습니다. Memory queue나 in-batch negative를 쓸 때도 sample provenance를 검사하고, 같은 class·identity의 충돌률을 보고합니다.
        </p>
        <p>
          Representation collapse는 embedding variance, pair similarity 분포와 linear probe로 감시합니다. Loss만 내려가는데 downstream 성능이 좋아지지 않는다면 augmentation이 너무 강하거나 shortcut으로 pair를 구분하는지 먼저 확인합니다.
        </p>
      </div>
      <ExplainedFormula
        question="Temperature를 낮추면 왜 가까운 negative에 학습 신호가 집중될까요?"
        idea={<>두 후보 a와 b가 받는 softmax weight의 비율을 나누면 공통 분모가 사라집니다. 같은 similarity 차이도 τ로 나누기 때문에 작은 τ에서 비율이 더 빠르게 벌어집니다.</>}
        formula={String.raw`\begin{aligned}
Z_i&=\sum_{a\ne i}e^{s_{ia}/\tau},\\
p_{ik}&=e^{s_{ik}/\tau}/Z_i,\\
\frac{p_{ia}}{p_{ib}}&=\exp\!\left(\frac{s_{ia}-s_{ib}}{\tau}\right).
\end{aligned}`}
        terms={[
          { symbol: "s_ik", name: "similarity logit", description: "Anchor i와 후보 k의 cosine similarity입니다." },
          { symbol: "p_ik", name: "softmax weight", description: "후보 k가 분모와 gradient에서 차지하는 상대 비중입니다." },
          { symbol: "τ", name: "temperature", description: "작을수록 similarity 순위 차이를 크게 증폭합니다." },
        ]}
        assumptions={["Similarity를 같은 scale에서 비교하며 τ>0입니다.", "낮은 τ가 항상 좋은 것은 아니며 mislabeled hard negative의 영향도 함께 커집니다."]}
        interpretation="s_ia−s_ib=0.1일 때 τ=1이면 비율은 약 1.11이지만 τ=0.1이면 약 2.72입니다. 그러므로 temperature와 negative 품질을 따로 조정할 수 없습니다."
      />
      <div id="paper-simclr" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">논문 읽기 · SimCLR</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Chen 등은 composition of augmentations, nonlinear projection head, normalized embedding과 temperature-scaled contrastive loss를 체계적으로 비교했습니다. 큰 batch 성능을 architecture 하나의 보편적 효과로 떼어 읽지 않고, ImageNet·ResNet·논문의 training recipe 범위에서 해석합니다.</p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://proceedings.mlr.press/v119/chen20j.html" target="_blank" rel="noreferrer">실험 구성과 ablation 범위 보기</a>
      </div>
    </section>
  );
}

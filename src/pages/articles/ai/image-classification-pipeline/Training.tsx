import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import TrainingStrategyViz from "./viz/TrainingStrategyViz";

export default function Training() {
  return (
    <section id="training" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">학습 단계에서는 label을 보존하는 변환과 해상도 budget을 먼저 검증합니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          첫 run은 pretrained input contract와 최소한의 crop·flip만 사용합니다.
          이후 RandAugment는 <Link to="/ai/data-augmentation">증강 기초</Link>, Mixup·CutMix는 <Link to="/ai/mixup-cutmix">sample mixing 정본</Link>의
          target 변환 규칙을 재사용하되, target domain에서 의미가 유지되는지 따로
          확인합니다. 좌우가 진단 의미를 바꾸는 의료 image나 글자 방향이 중요한
          문서에는 흔한 flip·rotation도 잘못된 label을 만들 수 있습니다.
        </p>
      </div>
      <ExplainedFormula
        question="Augmentation을 넣은 training objective는 원본 loss와 무엇이 달라질까?"
        idea={<>한 sample을 고정해서 외우는 대신 label을 보존한다고 선언한 transform distribution에서 평균 loss를 줄입니다. 따라서 transform의 확률·세기와 target map은 objective의 일부입니다.</>}
        formula={String.raw`\begin{aligned}
\widehat R_{\mathrm{aug}}(\theta)
&=\frac1n\sum_{i=1}^{n}\mathbb E_{a\sim\mathcal A}[L_i(a)],\\
L_i(a)&=\ell\!\left(f_\theta(a(x_i)),a_y(y_i)\right).
\end{aligned}`}
        terms={[
          { symbol: "𝒜", name: "augmentation distribution", description: "Operation 종류·확률·magnitude·순서를 포함한 train-time transform sampling 규칙입니다." },
          { symbol: "a_y", name: "target transform", description: "Image 변환과 함께 class·box·mask·soft label을 동기화하는 함수입니다." },
          { symbol: "R̂_aug", name: "augmented empirical risk", description: "Training samples와 무작위 transform에 대해 평균낸 학습 목적입니다." },
        ]}
        assumptions={["선택한 transform이 target semantics를 보존하거나 a_y가 정확히 label을 바꿉니다.", "Validation·test에는 stochastic train augmentation을 적용하지 않고 별도의 robustness/TTA protocol로 분리합니다.", "기댓값은 실제로 mini-batch마다 sampling해 근사합니다."]}
        interpretation="Augmentation strength를 높이는 것은 data 수만 늘리는 일이 아니라 model이 같다고 보아야 할 입력 범위를 넓히는 일입니다. 잘못된 불변성을 넣으면 validation accuracy도 특정 slice도 함께 악화할 수 있습니다."
      />
      <ExplainedFormula
        question="Confidence threshold를 쓰는 pseudo-label loss는 어떤 sample을 학습에 포함할까?"
        idea={<>Weak augmentation의 prediction이 threshold τ 이상인 unlabeled image만 hard pseudo-label을 만들고, strong augmentation에서도 같은 class를 예측하도록 학습합니다. Threshold는 정답 보장이 아니라 coverage와 오류율의 trade-off입니다.</>}
        formula={String.raw`\begin{aligned}
q(u)&=p_\theta(y\mid a_w(u)),\\
\widehat y(u)&=\arg\max_c q_c(u),\\
q_{\max}(u)&=\max_c q_c(u),\\
I_\tau(u)&=\mathbb{I}\!\left\{q_{\max}(u)\ge\tau\right\},\\
r(u)&=p_\theta(y\mid a_s(u)),\\
\mathcal L_u&=I_\tau(u)\,\operatorname{CE}\!\left(\widehat y(u),r(u)\right).
\end{aligned}`}
        terms={[
          { symbol: "u", name: "unlabeled image", description: "Label 없이 수집했지만 target deployment population에 속한다고 보는 image입니다." },
          { symbol: "a_w,a_s", name: "weak and strong transforms", description: "Pseudo-label을 읽는 약한 변환과 consistency를 학습하는 강한 변환입니다." },
          { symbol: "τ", name: "confidence threshold", description: "Pseudo-label을 training loss에 포함할 최소 maximum predicted probability입니다." },
          { symbol: "I_τ", name: "selection indicator", description: "조건이 참일 때 1, 아니면 0이어서 해당 unlabeled sample의 loss 포함 여부를 정합니다." },
        ]}
        assumptions={["Unlabeled pool이 target class를 포함하며 weak·strong transform이 class 의미를 보존합니다.", "Confidence가 correctness와 같지 않으므로 class별 precision·coverage를 labeled holdout에서 확인합니다.", "Teacher와 student state·update timing을 명시하고 validation sample은 pseudo-label pool에서 제외합니다."]}
        interpretation="τ를 높이면 보통 선택된 sample 수는 줄고 평균 precision은 높아질 수 있지만 class별 coverage가 크게 달라질 수 있습니다. 전체 selected count만 보고 성공을 판단하면 minority class가 사라질 수 있습니다."
      />
      <div className="not-prose my-8"><TrainingStrategyViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Progressive resizing은 새로운 stage입니다</h3>
        <p>
          작은 resolution stage 뒤 target resolution로 바꾸면 object scale, crop
          distribution, batch size, optimizer update 수와 ViT position embedding이
          함께 달라질 수 있습니다. 이전 checkpoint를 초기값으로 쓰되 별도 stage
          boundary와 local schedule을 기록합니다. 작은 물체 recall과 latency가
          포화되는 지점을 보며 resolution을 정합니다.
        </p>
      </div>
      <div id="paper-randaugment" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">논문 읽기 · RandAugment</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Cubuk 등은 operation별 probability·magnitude를 따로 찾던 큰 search space를 operation 수 N과 공통 magnitude M의 작은 공간으로 줄여 proxy task 없이 탐색했습니다. CIFAR·SVHN·ImageNet·COCO 결과가 임의 domain에서 같은 operation이 label을 보존한다는 뜻은 아닙니다.</p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://proceedings.neurips.cc/paper/2020/hash/d85b63ef0ccb114d0a3bb7b7d808028f-Abstract.html" target="_blank" rel="noreferrer">Reduced search space와 실험 범위 보기</a>
      </div>
      <div id="paper-fixmatch" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">논문 읽기 · FixMatch</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Sohn 등은 weak augmentation에서 confidence가 높은 pseudo-label을 만들고 strong augmentation에서 같은 label을 예측하도록 하는 단순한 semi-supervised objective를 제안했습니다. 논문의 benchmark와 class-balanced label regime를 벗어나면 threshold·distribution mismatch를 다시 검증해야 합니다.</p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://proceedings.neurips.cc/paper/2020/hash/06964dce9addb1c5cb5d6e3d9838f733-Abstract.html" target="_blank" rel="noreferrer">Selection rule과 ablation 보기</a>
      </div>
    </section>
  );
}

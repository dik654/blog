import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ExplainedFormula from "@/components/ui/explained-formula";

const decisions = [
  ["현실성", "배포 환경에서 실제로 생길 변화인가?"],
  ["Target 규칙", "변환 뒤 label·box·mask는 어떻게 바뀌는가?"],
  ["Split 경계", "Train fold 안에서만 sample을 생성했는가?"],
  ["검증", "원본 성능과 예상 shift의 robustness를 함께 봤는가?"],
];

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Data augmentation은 sample 수를 부풀리는 기술이 아니라, 허용할 변화를
        정하는 모델링입니다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-lg leading-8">
          같은 고양이를 조금 옆에서 찍거나 조명이 달라져도 정답은 여전히
          고양이입니다. Data augmentation은 이처럼{" "}
          <strong>배포 환경에서 생길 수 있는 변화</strong>를 training input에
          적용해, model이 우연한 자세나 밝기에 덜 의존하도록 만듭니다. 핵심은
          image 개수를 늘리는 것이 아니라 어떤 변화에서 prediction이 같아야
          하는지를 data pipeline에 넣는 데 있습니다.
        </p>
        <p>
          그러나 모든 변환이 label을 보존하지는 않습니다. 자연 사진의 좌우
          반전은 흔히 허용되지만 글자, 좌우 장기, 교통 표지처럼 방향 자체가
          의미인 task에서는 target을 바꿀 수 있습니다. Detection과
          segmentation은 class label이 그대로여도 box·mask·keypoint 좌표를 같이
          옮겨야 합니다. 따라서 augmentation은 transform 하나가 아니라{" "}
          <strong>input과 target을 함께 바꾸는 계약</strong>으로 정의해야
          합니다.
        </p>
        <p>
          이 글은{" "}
          <Link to="/ai/deep-learning-overview">
            train·validation·test와 generalization
          </Link>
          , <Link to="/ai/cnn">image tensor·translation equivariance</Link>,{" "}
          <Link to="/ai/cross-entropy">soft target loss</Link>를 재사용합니다.
          기하·색상 변환에서 출발해 Mixup·CutMix·tabular synthesis로 확장하고,
          마지막에는 train·validation·TTA pipeline을 분리합니다.
        </p>
      </div>

      <ContentBoundary article="data-augmentation" />

      <ExplainedFormula
        question="Random augmentation을 쓰면 model이 실제로 최소화하는 training objective는 어떻게 바뀔까?"
        idea={
          <>
            원본 sample마다 transform T를 하나 뽑아 transformed input과 함께
            정의된 target τT(y)를 loss에 넣습니다. 즉 한 sample을 복제하는 대신,
            허용한 transformation distribution 전체에서 평균적으로 잘 작동하도록
            empirical risk를 바꿉니다.
          </>
        }
        formula={String.raw`\begin{aligned}
x_i'&=T(x_i),\\
y_i'&=\tau_T(y_i),\\
L_i(T)&=\ell(f_\theta(x_i'),y_i'),\\
\widehat R_{\mathrm{aug}}(\theta)
&=\frac1N\sum_{i=1}^{N}\mathbb E_{T\sim\mathcal A}[L_i(T)].
\end{aligned}`}
        terms={[
          {
            symbol: "N",
            name: "training sample count",
            description:
              "Split이 끝난 뒤 training fold에 속한 원본 sample 수입니다.",
          },
          {
            symbol: "A",
            name: "augmentation distribution",
            description:
              "Transform 종류·확률·세기를 함께 정한 sampling policy입니다.",
          },
          {
            symbol: "T",
            name: "sampled transform",
            description:
              "한 iteration에서 input에 실제 적용한 변환과 parameter입니다.",
          },
          {
            symbol: "τT",
            name: "target transform",
            description:
              "Classification label을 유지하거나 box·mask 좌표와 soft target을 같은 변환에 맞게 갱신합니다.",
          },
          {
            symbol: "ℓ",
            name: "task loss",
            description:
              "변환된 input prediction과 변환된 target을 비교합니다.",
          },
        ]}
        assumptions={[
          "A가 배포 환경에서 label이 유효한 변화 범위를 근사합니다.",
          "T와 τT가 같은 random parameter를 공유합니다.",
          "Validation과 test에는 stochastic training augmentation을 섞지 않습니다.",
        ]}
        interpretation="Augmentation은 data distribution과 objective를 함께 바꿉니다. A가 너무 약하면 regularization 효과가 없고, 너무 강하거나 잘못 정의되면 label noise를 직접 학습하게 됩니다."
      />

      <figure
        data-viz="augmentation-decision-gates"
        className="not-prose my-8 min-w-0 rounded-xl border border-border/75 bg-card p-4 sm:p-6"
      >
        <figcaption className="mb-5 text-sm font-semibold">
          Transform을 추가하기 전에 통과해야 할 네 가지 gate
        </figcaption>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {decisions.map(([title, body], index) => (
            <div
              key={title}
              className="min-w-0 border-t border-primary/45 pt-4"
            >
              <p className="text-xs font-bold text-primary/70">0{index + 1}</p>
              <p className="mt-2 font-semibold">{title}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {body}
              </p>
            </div>
          ))}
        </div>
      </figure>

      <div
        id="paper-randaugment"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          논문 읽기 · Policy의 폭과 세기
        </p>
        <p className="mt-2 text-sm font-semibold">
          RandAugment: Practical Automated Data Augmentation with a Reduced
          Search Space
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          RandAugment는 별도의 proxy search 없이 적용할 operation 수와 공통
          magnitude로 augmentation search space를 줄였습니다.
          CIFAR·SVHN·ImageNet·COCO에서 보고한 결과는 해당
          model·dataset·operation set의 실험 근거이며, 두 hyperparameter가 모든
          domain의 불변식을 자동으로 찾아준다는 뜻은 아닙니다.
        </p>
        <a
          className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
          href="https://arxiv.org/abs/1909.13719"
          target="_blank"
          rel="noreferrer"
        >
          원 논문의 reduced search space와 실험 보기
        </a>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>증강 강도는 별도의 hyperparameter입니다</h3>
        <p>
          “증강을 켰다”만 기록해서는 실험을 재현할 수 없습니다. Rotation angle,
          crop scale, jitter range, 적용 확률과 순서를 config로 남기고, 한 번에
          한 family씩 추가해 원본 validation과 예상 shift를 모사한 robustness
          slice를 비교해야 합니다. Training loss는 더 어려운 sample 때문에 커질
          수 있으므로 baseline과 loss 숫자만 직접 비교하지 않습니다.
        </p>
      </div>
    </section>
  );
}

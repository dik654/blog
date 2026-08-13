import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ExplainedFormula from "@/components/ui/explained-formula";
import PipelineOverviewViz from "./viz/PipelineOverviewViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">이미지 분류의 핵심은 사진을 class로 바꾸는 모델보다, 무엇을 처음 보는 사진으로 셀 것인지 정하는 데 있습니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-lg leading-8">
          이미지 분류기는 한 장의 pixel tensor <code>x</code>를 받아 class별 score를
          만들고, 가장 적절한 label을 고릅니다. 하지만 같은 환자의 연속 촬영본이나
          같은 상품의 crop이 train과 validation에 나뉘면 모델은 class의 일반 규칙
          대신 대상의 고유한 흔적을 기억할 수 있습니다. 따라서 첫 질문은 “어떤
          backbone을 쓸까?”가 아니라 <strong>배포에서 새로 만날 단위가 무엇인가?</strong>입니다.
        </p>
        <p>
          이 글은 sample identity와 group split을 고정한 뒤, pretrained input
          contract와 후보 backbone, augmentation·해상도·semi-supervised stage,
          마지막 probability calibration과 decision policy로 내려갑니다. 각각은
          하나의 긴 파이프라인이지만 변경은 한 번에 한 축만 비교합니다. 그래야
          accuracy가 오른 원인과 serving 비용이 늘어난 원인을 분리할 수 있습니다.
        </p>
        <p>
          Pixel·channel과 convolution은 <Link to="/ai/cnn">CNN 정본</Link>,
          train·validation·test는 <Link to="/ai/deep-learning-overview#learning-loop">학습 입문 글</Link>,
          augmentation 변환식은 <Link to="/ai/data-augmentation">데이터 증강 정본</Link>,
          pretrained parameter를 어디까지 바꿀지는 <Link to="/ai/transfer-learning-practice">transfer learning 정본</Link>에서
          이어집니다. 여기서는 이 개념들을 실제 image classification run 하나로 묶습니다.
        </p>
      </div>
      <ContentBoundary article="image-classification-pipeline" />
      <ExplainedFormula
        question="Group split은 어떤 두 조건을 만족해야 leakage 없이 deployment risk를 추정할까?"
        idea={<>같은 실제 대상에서 나온 sample은 하나의 group으로 묶습니다. Train과 validation의 group 집합은 겹치지 않아야 하며, validation 평균은 배포에서 만날 group을 흉내 낸 sampling unit으로 계산합니다.</>}
        formula={String.raw`\begin{aligned}
g_i&=\operatorname{identity}(x_i),\\
\mathcal G_{\mathrm{tr}}\cap\mathcal G_{\mathrm{val}}&=\varnothing,\\
\widehat R_{\mathrm{val}}&=\frac{1}{n_{\mathrm{val}}}\sum_{i\in\mathrm{val}}\ell\!\left(f_\theta(T(x_i)),y_i\right).
\end{aligned}`}
        terms={[
          { symbol: "g_i", name: "sample identity group", description: "같은 사람·상품·촬영 세션·원본에서 파생된 sample을 묶는 배포 단위입니다." },
          { symbol: "T", name: "inference preprocessing", description: "Resize·crop·channel order·normalization을 포함해 validation과 serving에 동일하게 적용할 변환입니다." },
          { symbol: "f_θ", name: "classifier", description: "전처리된 image를 class logit이나 probability로 바꾸는 모델입니다." },
          { symbol: "R̂_val", name: "validation empirical risk", description: "학습에 쓰지 않은 group에서 같은 loss로 계산한 평균 오차입니다." },
        ]}
        assumptions={["Identity key는 label을 본 뒤 임의로 만든 값이 아니라 수집 구조와 배포 단위에서 정의합니다.", "Duplicate·near-duplicate 검사는 exact hash뿐 아니라 crop·resize·compression 변형도 고려합니다.", "Validation의 class·device·time 분포가 실제 배포와 다르면 별도 slice 또는 reweighting이 필요합니다."]}
        interpretation="Random image split의 정확도가 높아도 group이 겹치면 새 대상에 대한 성능을 말할 수 없습니다. Split manifest와 preprocessing config는 checkpoint와 같은 버전의 artifact로 남깁니다."
      />
      <div className="not-prose my-8"><PipelineOverviewViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>먼저 가장 작은 재현 가능한 baseline을 만듭니다</h3>
        <p>
          Baseline에는 immutable split manifest, class-to-index mapping, pretrained
          weight revision, resize·crop·normalization, seed, optimizer update 수와 평가
          metric이 들어갑니다. Accuracy 하나만 보지 않고 class별 recall, NLL·Brier
          score, 촬영 장비·밝기·object size slice, p50·p95 latency와 peak memory를
          함께 저장합니다. 이후 실험은 이 ledger의 한 열만 바꿉니다.
        </p>
      </div>
    </section>
  );
}

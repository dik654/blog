import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ExplainedFormula from "@/components/ui/explained-formula";

const questions = [
  ["공통 원리", "지금 prediction에서 loss를 가장 줄일 방향은 무엇인가"],
  ["Tree builder", "그 방향을 어떤 split과 leaf 값으로 근사할 것인가"],
  ["System", "후보 split 통계를 얼마나 빠르고 적은 memory로 계산할 것인가"],
  ["Data contract", "category·missing·time split을 train과 serving에서 어떻게 유지할 것인가"],
];

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Gradient boosting은 작은 구간 규칙을 더해 prediction 함수를 고칩니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-lg leading-8">
          집값을 예측하는 가장 단순한 tree는 “면적이 60㎡ 이하인가?”를 묻고,
          왼쪽 leaf에는 3억 원, 오른쪽 leaf에는 6억 원처럼 구간별 상수 값을
          냅니다. 한 tree가 모든 관계를 담게 깊게 키우면 training data의 작은
          변화에도 구조가 흔들릴 수 있습니다. Gradient boosting은 작은 tree
          여러 개를 순서대로 더해, 현재 model이 아직 줄이지 못한 loss 방향을
          조금씩 보완합니다.
        </p>
        <p>
          XGBoost·LightGBM·CatBoost는 이 공통 원리를 공유하지만 같은 이름의
          model은 아닙니다. XGBoost는 regularized second-order objective와
          scalable split system, LightGBM은 histogram·GOSS·EFB와 leaf-wise
          growth, CatBoost는 ordered boosting과 category 처리를 중심으로 서로
          다른 계산·편향을 선택합니다. 따라서 library 기능표보다 공통 수학과
          각 구현이 근사하는 지점을 먼저 나눠야 합니다.
        </p>
        <p>
          이 글은 <Link to="/ai/deep-learning-overview#learning-loop">loss·train/validation split</Link>,{" "}
          <Link to="/ai/math-functions-derivatives-gradients#gradient">derivative와 gradient</Link>,{" "}
          <Link to="/ai/feature-engineering">누출 없는 feature contract</Link>를
          재사용합니다. Category target statistic의 자세한 정의도 앞 글이
          소유하며, 여기서는 boosting update와 결합할 때 생기는 차이만 다룹니다.
        </p>
      </div>

      <ContentBoundary article="gradient-boosting" />

      <ExplainedFormula
        question="Decision tree 한 그루는 입력 공간을 어떻게 prediction으로 바꿀까?"
        idea={<>Split 질문들은 input space를 서로 겹치지 않는 leaf 영역 R₁,…,Rⱼ로 나눕니다. Sample x가 들어간 영역의 상수 score wⱼ를 출력하므로, tree는 복잡한 곡선이 아니라 구간별 상수 함수입니다.</>}
        formula={String.raw`h(x)=\sum_{j=1}^{J}w_j\,\mathbf{1}[x\in R_j]`}
        terms={[
          { symbol: "R_j", name: "leaf region", description: "연속된 split 조건을 모두 만족해 도착한 input space의 한 구간입니다." },
          { symbol: "w_j", name: "leaf value", description: "해당 leaf에 도착한 sample에 더할 regression value 또는 class score입니다." },
          { symbol: "J", name: "leaf count", description: "Tree가 input space를 나눈 terminal region 수이며 model capacity와 연결됩니다." },
          { symbol: "1[x∈R_j]", name: "membership indicator", description: "x가 j번째 영역에 있을 때만 그 leaf value를 선택합니다." },
        ]}
        assumptions={["각 input은 정확히 한 terminal leaf에 도착합니다.", "Classification에서도 tree output은 보통 probability가 아니라 additive score입니다.", "Missing·categorical routing 규칙은 library와 artifact에 함께 저장합니다."]}
        interpretation="Boosting은 이런 작은 구간별 상수 함수를 여러 round에 걸쳐 더합니다. Tree depth와 leaf 수는 한 round가 만들 수 있는 interaction과 구간 수를 정합니다."
      />

      <figure data-viz="gbm-reading-map" className="not-prose my-8 min-w-0 rounded-xl border border-border/75 bg-card p-4 sm:p-6">
        <figcaption className="text-sm font-semibold">세 library를 읽기 전에 분리할 네 층</figcaption>
        <div className="mt-5 grid min-w-0 gap-5 md:grid-cols-4">
          {questions.map(([title, body], index) => (
            <div key={title} className="min-w-0 border-t border-primary/45 pt-4">
              <p className="text-xs font-bold text-primary/70">0{index + 1}</p>
              <p className="mt-2 font-semibold">{title}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </figure>
    </section>
  );
}

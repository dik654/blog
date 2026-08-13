import ExplainedFormula from "@/components/ui/explained-formula";
import KFoldViz from "./viz/KFoldViz";

export default function KFold() {
  return (
    <section id="kfold" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        K-fold는 행의 순서를 바꿔도 문제의 의미가 유지되는 경우에만 자연스럽습니다
      </h2>
      <div className="prose max-w-none prose-neutral dark:prose-invert">
        <p>
          K-fold는 n개 행을 겹치지 않는 K개 validation fold로 나누고, 매번 K−1개로 학습해 남은 하나를 예측합니다. 핵심
          가정은 단순한 “shuffle 가능” 옵션이 아니라 행들이 독립에 가깝고 교환 가능(exchangeable)하다는 것입니다. 즉 행의
          순서를 바꾸어도 공동 데이터 생성 과정의 의미가 달라지지 않아야 합니다.
        </p>
        <p>
          Classification에서 class 수가 적으면 stratification으로 fold별 label 비율을 비슷하게 만들 수 있습니다. 하지만
          stratification은 같은 환자나 세션을 갈라 놓는 문제, 미래가 과거 train에 들어가는 문제를 해결하지 않습니다. 여러
          제약이 있다면 group·time 경계를 먼저 지킨 뒤 가능한 범위에서 label 균형을 맞춥니다.
        </p>
      </div>

      <ExplainedFormula
        question="Fold 크기가 달라도 전체 OOF loss를 같은 행 기준으로 계산하려면 어떻게 합칠까요?"
        idea={
          <>
            Fold score를 무조건 1/K로 평균내지 않고, 각 행이 자신을 학습하지 않은 model에서 받은 loss를 모두 더해 전체 행 수로
            나눕니다. 그러면 큰 fold와 작은 fold가 실제 행 수만큼 반영됩니다.
          </>
        }
        formula={String.raw`\widehat R_{\mathrm{OOF}}=\frac{1}{n}\sum_{k=1}^{K}\sum_{i\in V_k}\ell\!\left(A(D_{-k}),z_i\right),\qquad \bigsqcup_{k=1}^{K}V_k=\{1,\ldots,n\}`}
        terms={[
          { symbol: "V_k", name: "validation fold k", description: "k번째 실행에서 model이 보지 않고 예측한 행의 집합입니다." },
          { symbol: "D_-k", name: "fold-k training data", description: "V_k를 제외하고 transform과 model을 fit하는 데이터입니다." },
          { symbol: "A(D_-k)", name: "fold model", description: "동일한 학습 절차 A를 k번째 train data에 적용해 얻은 model입니다." },
          { symbol: "disjoint union", name: "exact partition", description: "모든 행이 validation fold 하나에만 정확히 포함된다는 뜻입니다." },
        ]}
        assumptions={[
          "각 fold model은 해당 validation 행과 그 행에서 유도된 fitted statistic을 전혀 사용하지 않습니다.",
          "Sample weight가 있으면 loss 합과 분모 모두 같은 weight를 사용합니다.",
          "Repeated CV는 한 행에 여러 OOF prediction이 생기므로 반복별 prediction 집계와 uncertainty 단위를 따로 정합니다.",
        ]}
        interpretation="Fold 크기가 20과 80인데 fold metric을 반반 평균내면 20개 행이 과도하게 반영됩니다. Pooled OOF는 20:80으로 반영합니다."
      />

      <div className="not-prose my-8">
        <KFoldViz />
      </div>

      <div id="paper-cv-estimand" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">핵심 논문 · Cross-Validation: What Does It Estimate and How Well Does It Do It?</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          이 논문의 핵심은 보통의 CV가 관측 데이터 전체로 fit한 특정 model 하나의 conditional error보다, 같은 모집단에서 다시
          뽑은 학습셋들로 fit한 model의 평균 prediction error에 더 가깝다는 점입니다. 또한 fold accuracy들이 독립이 아니어서
          단순 fold 표준편차로 만든 confidence interval이 과도하게 좁을 수 있음을 보이고 nested CV 기반 variance 추정을
          제안합니다. 이 결과를 “CV는 쓸모없다”거나 모든 model에 동일한 exact theorem이 성립한다고 확대하지 않습니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://pmc.ncbi.nlm.nih.gov/articles/PMC11412612/" target="_blank" rel="noreferrer">논문 전문과 전제 보기</a>
      </div>

      <div className="prose max-w-none prose-neutral dark:prose-invert">
        <p>
          Fold 수에는 보편적인 정답이 없습니다. K를 늘리면 fold model의 train set은 커지지만 계산 비용과 fold model 사이의
          상관도 커집니다. 후보 선택에는 pooled OOF, fold·seed·slice table을 함께 쓰고, 최종 성능 주장은 선택에 쓰지 않은
          holdout에서 확인합니다.
        </p>
      </div>
    </section>
  );
}

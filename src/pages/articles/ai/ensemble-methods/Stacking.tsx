import ExplainedFormula from "@/components/ui/explained-formula";
import StackingViz from "./viz/StackingViz";

export default function Stacking() {
  return (
    <section id="stacking" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Stacking은 base model의 ‘처음 보는 행’ prediction을 새 feature로 학습합니다</h2>
      <div className="prose max-w-none prose-neutral dark:prose-invert">
        <p>
          각 training row i는 자신이 속한 fold를 제외한 데이터로 학습한 base model에게서 prediction을 받습니다. Model이 M개라면
          이 값들이 n×M OOF matrix Z가 되고, meta-model은 Z에서 target을 학습합니다. Base model의 training prediction을 넣으면
          memorization confidence와 실제 generalization signal을 구분하지 못하므로 leakage가 됩니다.
        </p>
        <p>
          Test path도 training path와 맞아야 합니다. 보통 각 fold base model이 test에 낸 prediction을 model별로 평균해 M개 feature를
          만들고 같은 class order·transform으로 meta-model에 넣습니다. Full-data base model 하나를 따로 fit해 사용할 수도 있지만
          OOF meta-training feature와 분포가 달라지는 만큼 그 선택을 별도 검증해야 합니다.
        </p>
      </div>

      <ExplainedFormula
        question="Meta-model이 볼 OOF feature 한 칸은 어느 base model에서 나와야 할까요?"
        idea={<>Row i가 속한 fold k(i)를 학습에서 뺀 base model m의 prediction만 Z의 i,m 칸에 넣습니다. 그 뒤 meta-model h를 Z와 target으로 학습합니다.</>}
        formula={String.raw`Z_{im}=f_m^{(-k(i))}(x_i),\qquad \widehat h=\arg\min_h\frac1n\sum_{i=1}^{n}\ell\!\left(h(Z_{i,:}),y_i\right)`}
        terms={[
          { symbol: "k(i)", name: "row fold", description: "Row i가 validation 역할을 맡은 fold 번호입니다." },
          { symbol: "f_m^(-k(i))", name: "cross-fitted base model", description: "Fold k(i)의 모든 row를 제외하고 학습한 m번째 base procedure입니다." },
          { symbol: "Z_i,:", name: "OOF meta-feature row", description: "Row i에 대한 모든 base model의 unseen predictions입니다." },
          { symbol: "h", name: "meta-model", description: "OOF prediction pattern에서 최종 prediction을 학습하는 결합기입니다." },
        ]}
        assumptions={[
          "모든 base prediction은 같은 fold manifest와 row order를 사용하거나 ID join으로 정확히 정렬됩니다.",
          "Base model별 feature preprocessing도 해당 fold train data 안에서 fit합니다.",
          "Meta-model complexity와 feature 수를 OOF sample 수에 맞추고 gain은 nested/outer evaluation에서 확인합니다.",
        ]}
        interpretation="Z의 각 칸은 target y_i를 학습에 사용하지 않은 predictor의 값입니다. 이 조건이 깨지면 meta-model은 base model의 in-sample 과신을 학습합니다."
      />

      <ExplainedFormula
        question="Super Learner가 ‘oracle만큼 좋다’는 말은 어떤 비교를 뜻하며, 무엇을 보장하지 않을까요?"
        idea={<>Cross-validated risk로 결합 계수 α를 고르고, 같은 결합 family 안에서 true risk가 가장 작은 oracle α*와의 excess risk가 표본이 커질수록 사라지는지를 비교합니다.</>}
        formula={String.raw`\widehat\alpha=\arg\min_{\alpha\in\mathcal A_n}\widehat R_{\mathrm{CV}}(h_\alpha),\qquad R(h_{\widehat\alpha})-\inf_{\alpha\in\mathcal A_n}R(h_\alpha)\xrightarrow[n\to\infty]{}0`}
        terms={[
          { symbol: "A_n", name: "candidate combination family", description: "Base library를 섞는 허용된 coefficient·meta-model family이며 표본 크기에 따라 달라질 수 있습니다." },
          { symbol: "alpha-hat", name: "CV-selected combination", description: "V-fold cross-validated risk가 가장 작은 결합 설정입니다." },
          { symbol: "R", name: "population risk", description: "새 deployment sample에서 같은 loss로 측정한 기대 오류입니다." },
          { symbol: "oracle", name: "best in the declared family", description: "세상의 모든 predictor가 아니라 A_n 안에서 population risk가 가장 작은 결합입니다." },
        ]}
        assumptions={[
          "논문의 bounded outcome/prediction·loss·library growth와 cross-validation construction 같은 regularity 조건 안의 asymptotic 주장입니다.",
          "Finite sample에서 selected ensemble이 매번 best single model보다 좋다는 보장이 아닙니다.",
          "Candidate library·meta-family·data distribution이 달라지면 oracle 자체와 수렴 조건도 달라집니다.",
        ]}
        interpretation="Oracle result는 올바른 cross-fitting과 충분한 표본에서 선택 비용이 family 내 최선과 비교해 작아진다는 뜻입니다. 나쁜 library 밖의 좋은 모델을 찾아주거나 작은 데이터의 overfit을 없애지는 않습니다."
      />

      <div className="not-prose my-8"><StackingViz /></div>

      <div id="paper-stacked-generalization" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">원 논문 · Stacked Generalization</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          핵심 아이디어는 original generalizer들이 학습 일부로 훈련되고 남은 부분을 예측한 결과를 second-level generalizer의 입력으로
          사용해 base bias를 학습하는 것입니다. 오늘날의 고정된 library API 하나를 제안한 논문이 아니며, NETtalk를 포함한 당시
          실험과 이론적 동기 범위에서 읽어야 합니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://doi.org/10.1016/S0893-6080(05)80023-1" target="_blank" rel="noreferrer">논문 정보와 원문 경로 보기</a>
      </div>

      <div id="paper-super-learner" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">이론 확장 · Super Learner</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Super Learner는 V-fold cross-validated risk로 candidate learner의 결합을 학습하고 명시된 boundedness·library growth 등 조건에서
          oracle selector와 비교하는 asymptotic 결과를 제공합니다. “아무 모델이나 stack하면 항상 단일 최고 모델보다 낫다”는
          finite-sample 보장이 아니며, meta-family·loss·cross-validation 조건이 theorem의 일부입니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://biostats.bepress.com/ucbbiostat/paper222/" target="_blank" rel="noreferrer">논문의 oracle 조건과 알고리즘 보기</a>
      </div>

      <div id="standard-sklearn-stacking" className="not-prose my-8 scroll-mt-24 border-l border-border pl-4">
        <p className="text-xs font-bold text-foreground">공식 문서 · scikit-learn StackingClassifier</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          현재 API는 final estimator를 base estimators의 cross-validated predictions로 학습하고, base estimators 자체는 full X에서 다시
          fit한다고 설명합니다. cv="prefit"은 prefit model의 같은 training data prediction으로 final estimator를 학습하면 매우 높은
          overfitting 위험이 있으므로, 설치 version과 data lineage를 확인해야 합니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.StackingClassifier.html" target="_blank" rel="noreferrer">현재 API semantics 보기</a>
      </div>
    </section>
  );
}

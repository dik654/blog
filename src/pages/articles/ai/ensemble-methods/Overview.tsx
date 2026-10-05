import ContentBoundary from "@/components/articles/content-boundary";
import ExplainedFormula from "@/components/ui/explained-formula";
import WhyEnsembleViz from "./viz/WhyEnsembleViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">앙상블은 모델을 많이 모으는 기법이 아니라, 같은 행에서 남는 오류를 서로 상쇄하는 방법입니다</h2>
      <div className="prose max-w-none prose-neutral dark:prose-invert">
        <p className="text-lg leading-8">
          같은 OOF row에서 model A와 B의 error를 나란히 놓겠습니다. Row 42는
          <code>+0.6</code>과 <code>−0.5</code>, row 17은 <code>+0.8</code>과
          <code>+0.7</code>입니다. 두 prediction을 같은 비중으로 평균하면 row 42의
          error는 <code>+0.05</code>까지 줄지만 row 17은 <code>+0.75</code>가 남습니다.
        </p>
        <h3>그림을 보기 전에 결과를 예상해 보세요</h3>
        <ol>
          <li>Row 42에서는 두 error의 방향이 반대이므로 단순 평균 error가 +0.05가 될까요?</li>
          <li>Row 17에서도 두 모델을 합치기만 하면 큰 error가 사라질까요?</li>
          <li>Test prediction을 보면서 두 모델의 weight를 골라도 최종 평가가 그대로 유효할까요?</li>
        </ol>
        <p>
          첫째만 <strong>예</strong>입니다. 반대 방향 error는 상쇄되지만 같은 방향
          error는 함께 남습니다. Weight와 meta-model도 OOF prediction에서만
          골라야 test가 최종 평가 역할을 유지합니다.
        </p>
      </div>

      <div className="not-prose my-8"><WhyEnsembleViz /></div>
      <ContentBoundary article="ensemble-methods" />

      <div className="prose max-w-none prose-neutral dark:prose-invert">
        <p>
          두 모델의 accuracy가 높아도 같은 sample을 함께 틀리면 결합할 이유가 작습니다. 반대로 단독 점수가 조금 낮은 모델이라도 기존
          모델과 다른 곳에서 틀리면 평균 prediction의 흔들림을 줄일 수 있습니다. 그래서 후보를 고를 때는 model family 이름이 아니라
          같은 out-of-fold(OOF) 행에서 계산한 error vector와 covariance를 봅니다.
        </p>
        <p>
          먼저 각 model의 prediction이 동일한 row ID·target definition·class order·scale을 갖는지 맞춥니다. 그다음 단순 평균을
          baseline으로 두고 weight나 meta-model은 OOF prediction에서만 학습합니다.
        </p>
        <p>
          Test prediction을 보며 weight를 고르면 test가 selection data로 바뀝니다. Base model이 학습한 행의 in-sample prediction으로
          meta-model을 학습해도 결합 단계에 평가 정보가 새어 들어갑니다.
        </p>
      </div>

      <ExplainedFormula
        question="여러 모델의 평균이 줄이는 오류는 각 모델 수보다 무엇에 달려 있을까요?"
        idea={<>가중 앙상블의 error는 개별 error의 가중합입니다. 그 분산을 전개하면 각 모델의 분산뿐 아니라 같은 행에서 함께 움직이는 covariance가 모두 남습니다.</>}
        formula={String.raw`\begin{aligned}
          e_{\mathrm{ens}}&=\sum_{m=1}^{M}w_m e_m \\
          \operatorname{Var}(e_{\mathrm{ens}})&=\mathbf w^{\top}\Sigma\mathbf w \\
          \Sigma_{jk}&=\operatorname{Cov}(e_j,e_k)
        \end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}
          e_{\mathrm{ens}}&=\underbrace{\sum_{m=1}^{M}w_m e_m}_{\text{row-aligned error 계산}} \\
          \operatorname{Var}(e_{\mathrm{ens}})&=\underbrace{\mathbf w^{\top}\Sigma\mathbf w}_{\text{weight로 covariance를 결합한 분산}} \\
          \Sigma_{jk}&=\underbrace{\operatorname{Cov}(e_j,e_k)}_{\text{같은 row에서 두 error가 함께 움직이는 정도}}
        \end{aligned}`}
        operations={[
          { expression: String.raw`\sum_{m=1}^{M}w_m e_m`, annotation: ["같은 row의 model별 error에 weight를 곱해 ensemble error를 만듭니다."] },
          { expression: String.raw`\operatorname{Cov}(e_j,e_k)`, annotation: ["Model j와 k가 같은 row에서 같은 방향으로 틀리는 정도를 셉니다."] },
          { expression: String.raw`\mathbf w^{\top}\Sigma\mathbf w`, annotation: ["각 variance와 pairwise covariance를 weight 쌍으로 합쳐 최종 error 분산을 구합니다."] },
        ]}
        terms={[
          { symbol: "e_m", name: "row-aligned error", description: "같은 OOF 행에서 m번째 model prediction과 target으로 만든 residual 또는 loss signal입니다." },
          { symbol: "w_m", name: "ensemble weight", description: "Model m의 prediction에 곱하는 계수이며 보통 합이 1인 제약에서 시작합니다." },
          { symbol: "Sigma", name: "error covariance matrix", description: "대각선은 각 error의 분산, 비대각선은 두 model이 함께 흔들리는 정도입니다." },
          { symbol: "M", name: "base-model count", description: "결합 후보 model 수이며 수 자체가 variance 감소를 보장하지 않습니다." },
        ]}
        assumptions={[
          "모든 error는 동일한 OOF row와 동일한 target/metric orientation에서 계산합니다.",
          "Squared-error 관점의 분산 분해이며 classification의 log loss·ranking에는 목적함수를 직접 다시 평가합니다.",
          "작은 OOF sample에서 covariance estimate가 불안정할 수 있으므로 fold·seed·slice별 결과를 함께 봅니다.",
        ]}
        interpretation="두 모델이 같은 분산 σ², 같은 weight 1/2, correlation ρ라면 평균 error 분산은 σ²(1+ρ)/2입니다. ρ=1이면 줄지 않고, ρ=0이면 절반이며, ρ=−1이면 이상적으로 0입니다. 다만 모든 행에서 크기가 같고 방향만 반대인 완전한 음의 상관은 실제 예측에서 매우 강한 조건입니다."
      />

      <div className="prose max-w-none prose-neutral dark:prose-invert">
        <p>
          이 글은 서로 다른 model의 prediction을 결합하는 mean·weighted·rank averaging, OOF stacking, holdout blending과 greedy
          selection을 다룹니다. 한 model 안의 checkpoint averaging이나 data augmentation은 각각 training artifact와 augmentation
          글에서 다룹니다. 같은 말을 여러 글에 흩어 놓지 않기 위한 경계입니다.
        </p>
        <p>
          Diversity audit에서는 먼저 OOF artifact를 row ID와 같은 fold·target으로 정렬합니다. 그런 다음 residual covariance와
          correlation, 두 모델이 함께 틀린 행을 봅니다.
        </p>
        <p>
          Accuracy 같은 전체 점수만 비교하지 않고 group, time, class slice마다 error 방향을 확인합니다. Ranking이나 F1처럼 행별 loss로 단순
          분해되지 않는 metric은 결합 prediction 전체에서 다시 계산합니다.
        </p>
        <p>
          이 판단도 여러 seed에서 흔들릴 수 있습니다. 후보 선택은 OOF에서 하고 최종 이득은 탐색에 쓰지 않은 outer data에서 확인합니다.
        </p>
      </div>

    </section>
  );
}

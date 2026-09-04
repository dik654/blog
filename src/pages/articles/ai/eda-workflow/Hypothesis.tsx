import HypothesisViz from "./viz/HypothesisViz";
import ExplainedFormula from "@/components/ui/explained-formula";

export default function Hypothesis() {
  return (
    <section id="hypothesis" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">EDA의 산출물은 재현 가능한 가설과 다음 실험이다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          차트에서 패턴을 발견했다면 “어떤 조건에서 무엇이 달라지고, 이를 어떤 지표로 확인할 것인가”를 문장으로 남깁니다. “로봇 수가 적을 때 지연이 커진다”에서 멈추면 안 됩니다.
          주문량과 시간대를 통제해도 같은 관계가 유지되는지, 어떤 validation slice에서 비교할지까지 정해야 합니다.
        </p>
        <p>
          관찰된 상관을 원인으로 바꾸어 말하지 않는 것도 중요합니다. 시각화가 만드는 것은 후보 가설까지입니다. 반례 slice와 confounder를 확인한 뒤 feature
          ablation이나 후속 실험으로 검증해야 합니다.
        </p>
      </div>
      <div className="not-prose my-8"><HypothesisViz /></div>
      <ExplainedFormula
        question="두 validation slice의 차이는 p-value 하나가 아니라 어떤 효과와 불확실성으로 남겨야 할까요?"
        idea={<>먼저 같은 metric 단위의 차이를 effect estimate로 계산하고, resampling이나 model 가정으로 confidence interval을 만듭니다. Interval과 practical threshold를 함께 정하면 sample size가 큰 작은 차이와 실제로 중요한 차이를 구분할 수 있습니다.</>}
        formula={String.raw`\begin{aligned}
\widehat{\Delta}&=\bar{y}_A-\bar{y}_B,\\
\bar{y}_A=12.0\text{ min},\ \bar{y}_B=10.5\text{ min}
&\Rightarrow \widehat{\Delta}=1.5\text{ min}.
\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}
\widehat{\Delta}&=\underbrace{\bar{y}_A-\bar{y}_B,}_{\text{변화량 계산}}\\
\bar{y}_A=12.0\text{ min},\ \bar{y}_B=10.5\text{ min}
&\Rightarrow \widehat{\Delta}=1.5\text{ min}.
\end{aligned}`}
        operations={[
          { expression: String.raw`\bar{y}_A-\bar{y}_B,`, annotation: ["왼쪽 결과를 오른쪽의 실제 항으로 계산합니다.","먼저 같은 metric 단위의 차이를 effect","estimate로 계산하고, resampling이나 model","가정으로 confidence interval을 만듭니다."] },
        ]}
        terms={[
          { symbol: String.raw`\bar{y}_A,\bar{y}_B`, name: "slice means", description: "같은 metric과 cutoff로 계산한 두 slice의 평균입니다." },
          { symbol: "Δ̂", name: "estimated effect", description: "A와 B의 관측 평균 차이이며 원래 metric 단위를 유지합니다." },
          { symbol: "confidence interval", name: "sampling-uncertainty interval", description: "반복 sampling에서 정한 절차가 만드는 estimate 범위입니다." },
        ]}
        assumptions={[
          "두 slice의 analysis unit, cutoff, metric과 missing policy를 동일하게 고정합니다.",
          "Interval 계산법의 independence·cluster·time dependence 가정을 확인합니다.",
          "EDA에서 고른 여러 가설을 같은 data로 확정하면 selection bias가 생기므로 별도 holdout이나 multiplicity 계획이 필요합니다.",
        ]}
        interpretation="관측 차이는 1.5분입니다. Confidence interval이 practical threshold를 포함하는지와 holdout에서 방향이 재현되는지를 본 뒤에야 intervention 후보로 올립니다."
      />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>가설에서 피처와 검증 계획을 함께 만든다</h3>
        <p>
          비율·차이·구간화·interaction, 시계열의 lag와 rolling statistic은 도메인 가설을 모델 입력으로 옮기는 방법입니다. 피처를 만들 때는 계산 시점에 이용할
          수 있는 값만 씁니다. 미래 정보가 섞이지 않도록 cutoff와 group boundary를 먼저 고정합니다.
        </p>
        <p>
          각 가설에는 사용한 data version, slice, 집계 코드, 예상되는 변화와 실제 validation 결과를 연결합니다. 효과가 없었던 가설도 남겨 두면 같은 아이디어를
          반복하는 일이 줄고 모델 오류가 발견됐을 때 어떤 전제부터 다시 확인할지 알 수 있습니다.
        </p>
        <p>
          차트를 많이 살펴본 뒤 가장 큰 차이만 골라 같은 data에서 p-value를 보고하면 우연한 pattern을 확정하기 쉽습니다. 탐색 중 만든 가설은 ledger에 모두
          남깁니다. confirmatory test의 primary metric·slice·방향·practical threshold와 multiplicity 처리 방식을 미리 정한 다음
          별도 holdout이나 이후 기간에서 다시 확인합니다. 실패한 가설도 삭제하지 않고 data version과 함께 보존해야 선택 과정을 재현할 수 있습니다.
        </p>
      </div>
    </section>
  );
}

import ExplainedFormula from "@/components/ui/explained-formula";
import TailSelectionViz from "./viz/TailSelectionViz";
import AggregationContractViz from "./viz/AggregationContractViz";

export default function Algorithm() {
  return (
    <section id="algorithm" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">작은 tail probability를 더하기 쉬운 evidence로 바꾼다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          분포 끝의 sample은 한쪽 ECDF가 작다. ECOD는 그 값에 negative log를 적용해
          작은 probability를 큰 contribution으로 뒤집는다. 예를 들어 0.5는 약 0.69,
          0.01은 약 4.61이므로 훨씬 드문 관측이 합산 결과를 더 크게 끌어올린다.
          이 값은 calibrated probability가 아니라 row 사이의 outlyingness를 비교하는 score다.
        </p>
      </div>

      <ExplainedFormula
        question="각 feature의 tail rarity를 왜 −log score로 바꿀까?"
        idea={<>Independence를 가정하면 feature별 tail probability를 곱합니다. Log를 취하면 곱이 합으로 바뀌고, 앞에 minus를 붙이면 작은 probability일수록 큰 anomaly contribution이 됩니다.</>}
        formula={String.raw`\begin{aligned}U_{L,ij}&=-\log \widehat F_{j,L}(X_{ij})\\U_{R,ij}&=-\log \widehat F_{j,R}(X_{ij})\end{aligned}`}
        terms={[
          { symbol: "i,j", name: "row and feature", description: "평가 중인 row i와 그 안의 feature j를 가리킵니다." },
          { symbol: "U_{L,ij}", name: "left contribution", description: "작은 값이 얼마나 드문지 나타내는 nonnegative score입니다." },
          { symbol: "U_{R,ij}", name: "right contribution", description: "큰 값이 얼마나 드문지 나타내는 nonnegative score입니다." },
          { symbol: "-\\log", name: "surprisal transform", description: "곱셈을 덧셈으로 바꾸고 rare event를 큰 값으로 보냅니다." },
        ]}
        assumptions={["Feature별 tail probability를 결합할 때 independence approximation을 사용합니다.", "Score의 절댓값은 reference sample 수와 feature 수에 의존하므로 다른 dataset 사이에서 그대로 비교하지 않습니다."]}
        interpretation="한 feature의 contribution을 읽으면 어떤 열이 score를 높였는지 설명할 수 있지만, correlation이나 원인을 설명하는 feature attribution은 아닙니다."
      />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Skewness는 feature마다 우선할 tail을 고른다</h3>
        <p>
          모든 열에서 왼쪽만 보거나 오른쪽만 보면 방향이 다른 anomaly를 놓친다. 원 논문은
          sample skewness가 음수인 feature에서는 왼쪽, 0 이상이면 오른쪽 contribution을
          선택해 automatic score를 만든다. Skewness가 0에 가깝거나 극단값 하나에 흔들리는
          경우 방향 근거가 약해질 수 있으므로 left·right contribution도 함께 진단한다.
        </p>
      </div>

      <ExplainedFormula
        question="분포가 어느 방향으로 길게 늘어졌는지 어떻게 한 숫자로 정할까?"
        idea={<>평균에서 떨어진 거리를 세제곱하면 방향 부호가 남습니다. 이를 표준편차의 세제곱 scale로 나누어 feature 단위에 덜 민감한 skewness coefficient를 만듭니다.</>}
        formula={String.raw`\gamma_j=\frac{\frac1n\sum_{r=1}^{n}(X_{rj}-\bar X_j)^3}{\left[\frac1{n-1}\sum_{r=1}^{n}(X_{rj}-\bar X_j)^2\right]^{3/2}}`}
        terms={[
          { symbol: "\\bar X_j", name: "feature mean", description: "Feature j의 reference sample 평균입니다." },
          { symbol: "\\gamma_j", name: "sample skewness", description: "음수면 왼쪽, 양수면 오른쪽 tail이 상대적으로 길다는 신호입니다." },
          { symbol: "(X-\\bar X)^3", name: "signed third moment", description: "평균에서 먼 관측에 큰 weight를 주면서 방향을 보존합니다." },
          { symbol: "[\\cdot]^{3/2}", name: "scale normalization", description: "분산을 표준편차의 세제곱 단위로 바꿔 분자와 맞춥니다." },
        ]}
        assumptions={["원 논문이 제시한 sample coefficient이며 library의 scipy.stats.skew 기본 보정과 정확히 같은 식이라고 가정하지 않습니다.", "Heavy tail이나 작은 sample에서는 skewness 부호가 불안정할 수 있습니다."]}
        interpretation="Skewness는 tail 방향을 선택하는 heuristic이지, 관측값이 anomaly일 확률을 추정하는 calibration model이 아닙니다."
      />

      <TailSelectionViz />

      <ExplainedFormula
        question="원 ECOD 논문은 feature contribution을 row score로 어떻게 합칠까?"
        idea={<>왼쪽만 합친 score, 오른쪽만 합친 score, skewness로 feature별 방향을 고른 score를 각각 만든 뒤 row 수준에서 가장 극단적인 하나를 선택합니다.</>}
        formula={String.raw`\begin{aligned}O_L(i)&=\sum_j U_{L,ij}\\O_R(i)&=\sum_j U_{R,ij}\\O_A(i)&=\sum_j U_{S,ij}\\O_i^{\mathrm{paper}}&=\max\{O_L(i),O_R(i),O_A(i)\}\end{aligned}`}
        terms={[
          { symbol: "O_L,O_R", name: "one-direction scores", description: "모든 feature에서 같은 tail 방향의 contribution을 합친 두 후보입니다." },
          { symbol: "O_A", name: "automatic score", description: "Feature마다 skewness 부호로 고른 tail contribution의 합입니다." },
          { symbol: "U_{S,ij}", name: "selected tail", description: "γj가 음수면 UL,ij, 0 이상이면 UR,ij를 선택한 contribution입니다." },
          { symbol: "O_i^{\\mathrm{paper}}", name: "paper score", description: "세 row-level 후보 가운데 가장 큰 최종 outlier score입니다." },
          { symbol: "\\max", name: "robust fallback", description: "Skewness 선택이 놓칠 수 있는 all-left·all-right 패턴도 후보로 유지합니다." },
        ]}
        assumptions={["차원별 probability를 독립으로 보고 log contribution을 더합니다.", "Feature 수가 늘거나 같은 signal을 표현한 correlated feature를 복제하면 score가 커질 수 있습니다."]}
        interpretation="원 논문의 max는 합산 이후 한 번 적용됩니다. 이 순서는 현재 PyOD 구현과 같지 않으므로 재현할 때 식을 명시해야 합니다."
      />

      <AggregationContractViz />

      <ExplainedFormula
        question="현재 PyOD 3.6.4 소스가 실제로 반환하는 score는 무엇인가?"
        idea={<>소스는 각 feature에서 left·right·skew-selected contribution의 최댓값을 먼저 고른 다음, 그 결과를 feature 축으로 합산합니다.</>}
        formula={String.raw`O_i^{\mathrm{PyOD}}=\sum_j\max\left\{U_{L,ij},U_{R,ij},U_{S,ij}\right\}`}
        terms={[
          { symbol: "U_{S,ij}", name: "skew-selected contribution", description: "Skewness 부호에 따라 left 또는 right에서 가져온 feature score입니다." },
          { symbol: "\\max\\{\\cdot\\}", name: "feature-level selection", description: "각 feature에서 contribution을 먼저 선택합니다." },
          { symbol: "\\sum_j", name: "aggregation", description: "선택된 feature contribution을 row별로 더합니다." },
        ]}
        assumptions={["2026-08-12에 확인한 PyOD 3.6.4 공식 source의 decision_function 경로를 기준으로 합니다.", "Package version이 바뀌면 source와 golden score를 다시 확인해야 합니다."]}
        interpretation="일반적으로 sum(max)와 max(sum)는 같지 않으므로 논문 score와 PyOD score의 순위가 달라질 수 있습니다. 논문 재현용 구현과 운영 library 결과를 같은 것으로 기록하면 안 됩니다."
      />

      <div id="paper-ecod" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">논문 읽기 · ECOD 원 방법</p>
        <p className="mt-2 text-sm font-semibold">ECOD: Unsupervised Outlier Detection Using Empirical CDFs</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Li 등은 label 없이 feature별 empirical tail probability를 계산하고, negative log·skewness
          correction·row aggregation으로 global outlier ranking을 만드는 parameter-free score를
          제안했습니다. 논문의 비교는 선정한 tabular benchmark와 원문의 aggregation 식을 전제로
          하며, feature dependence를 정확히 모델링하거나 score를 실제 anomaly probability로
          calibration한다는 뜻은 아닙니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://arxiv.org/abs/2201.00382" target="_blank" rel="noreferrer">원 논문의 score·복잡도·실험 범위 보기</a>
      </div>
    </section>
  );
}

import ExplainedFormula from "@/components/ui/explained-formula";
import LeakageViz from "./viz/LeakageViz";

export default function Leakage() {
  return (
    <section id="leakage" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">평가는 과거의 forecast origin을 한 칸씩 전진시키며 재현합니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Random K-fold는 미래 row로 학습한 model이 과거 row를 맞히게 만들 수 있어
          실제 배포 순서를 재현하지 못합니다. Rolling-origin evaluation은 origin
          c₁&lt;c₂&lt;…를 정하고 각 origin보다 앞에서 available했던 data만 학습한 뒤
          다음 horizon을 평가합니다. Model refit 주기와 feature state update 주기도
          production과 맞춰야 합니다.
        </p>
        <p>
          Label horizon이 길거나 entity가 중복되면 train label interval과 validation
          input 시점이 겹칠 수 있습니다. 이때는 업무 의존성에 따라 gap·purge·group
          boundary를 추가합니다. 무조건 일정 간격을 비우는 것이 아니라 어떤
          information path를 끊으려는지 먼저 적습니다.
        </p>
      </div>

      <ExplainedFormula
        question="Rolling-origin fold에서 training과 validation의 시간 방향을 어떻게 고정할까?"
        idea={<>j번째 origin cⱼ에서는 cutoff보다 충분히 앞선 rows만 training에 두고, origin부터 horizon H까지의 rows를 validation에 둡니다. Gap g는 label 확정이나 overlapping window가 경계를 넘는 것을 막기 위한 선택적 간격입니다.</>}
        formula={String.raw`\mathcal D^{(j)}_{\mathrm{train}}=\{r:t_r<c_j-g\},\qquad \mathcal D^{(j)}_{\mathrm{val}}=\{r:c_j\le t_r<c_j+H\}`}
        annotatedFormula={String.raw`\mathcal D^{(j)}_{\mathrm{train}}=\underbrace{\{r:t_r<c_j-g\},\qquad \mathcal D^{(j)}_{\mathrm{val}}=\{r:c_j\le t_r<c_j+H\}}_{\text{허용 경계 판정}}`}
        operations={[
          { expression: String.raw`\{r:t_r<c_j-g\},\qquad \mathcal D^{(j)}_{\mathrm{val}}=\{r:c_j\le t_r<c_j+H\}`, annotation: ["계산한 양을 허용 경계와 비교해 상태를 판정합니다.","j번째 origin cⱼ에서는 cutoff보다"] },
        ]}
        terms={[
          { symbol: "c_j", name: "forecast origin", description: "j번째 backtest에서 실제 prediction을 내는 것처럼 취급할 cutoff입니다." },
          { symbol: "g", name: "gap · purge width", description: "Training label이나 feature window가 validation 구간과 정보를 공유하지 않도록 비우는 폭입니다." },
          { symbol: "H", name: "validation horizon", description: "각 origin에서 평가할 미래 기간 또는 step 수입니다." },
        ]}
        assumptions={["Row timestamp가 input cutoff인지 label end인지 명확합니다.", "Gap은 label delay·window overlap·entity dependence에 맞춰 정합니다.", "Hyperparameter 선택 folds와 마지막 untouched test period를 분리합니다."]}
        interpretation="각 fold의 방향은 언제나 과거에서 미래입니다. 더 최근의 fold에서 학습 window를 expanding할지 fixed-width rolling할지는 regime 가설에 따라 별도로 정합니다."
      />

      <div className="not-prose my-8"><LeakageViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Point-in-time replay가 feature의 실제 정답지입니다</h3>
        <p>
          전체 기간 aggregation, centered rolling, split 이전 target encoding은 코드가
          간단해도 미래를 섞습니다. Feature job을 과거 cutoff로 replay하고 그때의
          source snapshot에서 나와야 할 값과 비교합니다. Batch와 online path가 같은
          cutoff에서 같은 값·missing·freshness를 내는 golden fixture도 유지합니다.
        </p>
        <p>
          비정상적으로 높은 score나 importance는 누출의 신호일 뿐 증거가 아닙니다.
          어떤 source version이 어느 timestamp 조건을 통과했는지 lineage를 추적하고,
          late-arriving event를 넣기 전후의 backtest 차이로 원인을 확인합니다.
        </p>
        <div id="paper-forecast-evaluation" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
          <p className="text-xs font-bold text-primary">논문 읽기 · Out-of-sample forecast evaluation</p>
          <p className="mt-2 text-sm font-semibold">Out-of-sample Tests of Forecasting Accuracy: an Analysis and Review</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Tashman은 forecast origin·lead time·estimation window를 이동시키는 out-of-sample evaluation design을 정리했습니다. 특정 rolling-origin scheme 하나가 모든 nonstationary series의 최선이라는 주장이 아니라, 실제 예측 상황과 맞는 origin·horizon·window를 명시해 accuracy estimate를 해석해야 한다는 근거입니다.</p>
          <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://doi.org/10.1016/S0169-2070(00)00065-0" target="_blank" rel="noreferrer">원 논문의 evaluation design과 해석 범위 보기</a>
        </div>
      </div>
    </section>
  );
}

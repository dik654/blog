import ExplainedFormula from "@/components/ui/explained-formula";
import OptimizationStrategyViz from "./viz/OptimizationStrategyViz";

export default function Optimization() {
  return (
    <section id="optimization" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">학습 loss, model-selection metric, 운영 정책과 마지막 test는 서로 다른 결정을 담당합니다</h2>
      <div className="prose max-w-none prose-neutral dark:prose-invert">
        <p>
          F1·NDCG·처리 용량 같은 최종 목표는 미분하기 어렵거나 batch 전체의 ordering에 의존할 수 있습니다. 그래서 training에서는
          cross-entropy·pairwise ranking loss·squared loss 같은 surrogate를 사용하고, validation metric으로 checkpoint와 hyperparameter를
          고릅니다. 그다음 같은 정보 경계 안에서 calibrator와 threshold를 정하며, 모든 선택이 끝난 뒤 untouched test에서 한 번 평가합니다.
        </p>
      </div>

      <ExplainedFormula
        question="한 번의 실험에서 parameter 학습과 configuration·threshold 선택은 어떤 data를 사용해야 할까요?"
        idea={<>Train은 model parameter를, validation/OOF는 configuration과 policy를 정합니다. Outer test는 앞의 선택에 참여하지 않고 완성된 procedure를 평가합니다.</>}
        formula={String.raw`\hat\theta_{\lambda}=\arg\min_{\theta}L_{\mathrm{sur}}(D_{\mathrm{train}};\theta,\lambda),\quad (\hat\lambda,\hat\tau)=\arg\min_{\lambda,\tau}M(D_{\mathrm{val}};\hat\theta_{\lambda},\tau),\quad \widehat R_{\mathrm{outer}}=M(D_{\mathrm{test}};\hat\theta_{\hat\lambda},\hat\tau)`}
        terms={[
          { symbol: "theta", name: "model parameters", description: "Training surrogate의 gradient로 학습하는 weight입니다." },
          { symbol: "lambda", name: "configuration", description: "Architecture·regularization·learning rate처럼 validation으로 고르는 hyperparameter입니다." },
          { symbol: "tau", name: "decision policy parameter", description: "Classification threshold·top-k·post-processing strength 같은 운영 규칙입니다." },
          { symbol: "M", name: "selection and report metric", description: "사전에 정한 reducer·slice·guardrail을 포함한 평가 함수입니다." },
        ]}
        assumptions={[
          "Dtrain·Dval·Dtest의 entity/time 정보 경계가 배포 문제에 맞게 분리됩니다.",
          "Validation을 반복 사용한 configuration과 policy는 하나의 adaptive selection procedure로 봅니다.",
          "최종 test를 확인한 뒤 lambda나 tau를 바꾸면 새 독립 evaluation이 필요합니다.",
        ]}
        interpretation="Threshold를 test F1이 가장 높아지도록 다시 고르면 test가 validation으로 바뀝니다. 보고할 값은 그 threshold를 정하는 데 한 번도 쓰지 않은 data에서 계산해야 합니다."
      />

      <div className="not-prose my-8"><OptimizationStrategyViz /></div>

      <div className="prose max-w-none prose-neutral dark:prose-invert">
        <p>
          Surrogate loss가 target metric과 완전히 같은 방향으로 움직인다는 보장은 없습니다. Training loss가 계속 줄어도 validation NDCG가
          멈출 수 있고, AUC가 올라가도 정해진 처리 용량에서 recall이 낮아질 수 있습니다. 따라서 checkpoint에는 training curve뿐 아니라
          동일한 validation fixture에서 계산한 primary metric과 slice guardrail을 붙입니다.
        </p>
        <p>
          여러 metric을 하나의 임의 가중합으로 만들면 치명적인 하락이 작은 평균 개선에 가려질 수 있습니다. 먼저 안전·공정성·latency
          같은 hard guardrail을 통과시키고, feasible 후보 안에서 primary metric을 비교하는 방식이 더 감사하기 쉽습니다.
        </p>
      </div>

      <ExplainedFormula
        question="Primary metric이 좋아졌지만 특정 subgroup이나 latency가 나빠진 candidate를 어떻게 판정할까요?"
        idea={<>Guardrail을 제약조건으로 분리하고 그 조건을 만족하는 후보 집합 안에서만 primary objective를 최적화합니다.</>}
        formula={String.raw`\mathcal F=\{h:G_j(h)\le b_j\ \text{for every }j\},\qquad h^*=\arg\min_{h\in\mathcal F}M_{\mathrm{primary}}(h)`}
        terms={[
          { symbol: "h", name: "complete candidate", description: "Model checkpoint·preprocessing·calibration·threshold·serving configuration을 묶은 후보입니다." },
          { symbol: "Gj", name: "guardrail metric", description: "Worst-slice error·latency·memory·coverage miss처럼 허용 한도가 있는 측정값입니다." },
          { symbol: "bj", name: "guardrail bound", description: "Candidate 결과를 보기 전에 정한 최대 또는 최소 허용 기준입니다." },
          { symbol: "F", name: "feasible set", description: "모든 hard guardrail을 통과한 후보 집합입니다." },
        ]}
        assumptions={[
          "Metric 방향이 다르면 G_j를 모두 작은 값이 좋은 형태로 변환하거나 부등호를 명시합니다.",
          "Measurement noise를 고려한 tolerance·confidence rule과 sample minimum을 사전에 정합니다.",
          "Feasible 후보가 없을 때 constraint를 몰래 완화하지 않고 reject 또는 redesign합니다.",
        ]}
        interpretation="전체 error가 1% 줄었어도 특정 언어 recall이 허용 하한 아래로 내려가면 candidate는 비교 대상에서 제외됩니다. Primary score는 guardrail을 통과한 뒤에만 순위를 정합니다."
      />

      <div id="standard-sklearn-metrics" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">구현 기준 · scikit-learn Metrics and scoring</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          공식 문서는 estimator의 <code>score</code>, scorer의 greater-is-better 부호, multi-metric evaluation과 classification·regression·ranking
          metric API를 구분합니다. 이 글은 현재 API의 parameter와 반환 형식을 구현 기준으로 사용하지만, library default scorer가 각
          조직의 오류 비용·reducer·subgroup guardrail을 자동으로 정해 준다고 보지 않습니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://scikit-learn.org/stable/modules/model_evaluation.html" target="_blank" rel="noreferrer">공식 문서 보기</a>
      </div>

      <div className="prose max-w-none prose-neutral dark:prose-invert">
        <p>
          최종 metric receipt에는 evaluation data revision, row·entity·query ID, prediction cutoff, target transform, positive/relevance 정의,
          sample·slice weight, k·threshold, missing-label 처리, candidate checksum과 bootstrap·seed policy를 포함합니다. 숫자 하나만 저장하면
          다음 실험에서 같은 질문을 다시 계산할 수 없습니다.
        </p>
      </div>
    </section>
  );
}

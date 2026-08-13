import ExplainedFormula from "@/components/ui/explained-formula";

const api = [
  ["fit(X_train)", "training score를 계산하고 X_train을 저장한 뒤 threshold_와 labels_를 만듭니다."],
  ["decision_scores_", "Training row의 연속 anomaly score이며 클수록 더 비정상적인 순위입니다."],
  ["decision_function(X)", "저장한 X_train과 새 X를 합쳐 ECDF·skewness를 다시 계산하고 새 row score만 반환합니다."],
  ["threshold_ / labels_", "contamination percentile로 만든 경계와 그 경계를 넘은 training label입니다."],
] as const;

export default function Implementation() {
  return (
    <section id="implementation" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">PyOD에서는 score·threshold·label을 서로 다른 산출물로 읽는다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          현재 PyOD의 <code>ECOD</code>는 공통 <code>BaseDetector</code> API를 따른다.
          먼저 연속 score의 상위 row와 feature contribution을 검토하고, label이 필요할 때
          threshold policy를 적용하는 순서가 자연스럽다. <code>predict_proba</code>가 반환하는
          값도 score를 변환한 interface이며 실제 사건 확률로 calibration된 값이라고 가정하면 안 된다.
        </p>
      </div>

      <figure data-viz="ecod-api" className="not-prose my-9 overflow-hidden rounded-xl border border-border/70 bg-card">
        <figcaption className="border-b border-border/60 px-4 py-4 text-sm font-bold sm:px-6">PyOD 3.6.4에서 확인할 네 가지 상태</figcaption>
        <div className="grid gap-px bg-border/60 sm:grid-cols-2">
          {api.map(([name, body]) => (
            <div key={name} className="min-w-0 bg-background p-4 sm:p-5">
              <p className="break-words font-mono text-xs font-bold text-primary">{name}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </figure>

      <div className="not-prose my-8 overflow-hidden rounded-xl border border-border/70 bg-zinc-950 text-zinc-100">
        <pre className="overflow-x-auto p-4 text-[13px] leading-6"><code>{`from pyod.models.ecod import ECOD

detector = ECOD(contamination=0.05, n_jobs=-1)
detector.fit(X_train)

train_scores = detector.decision_scores_   # ranking evidence
test_scores = detector.decision_function(X_test)
test_labels = detector.predict(X_test)      # threshold policy applied

# 재현 기록
print(detector.threshold_)
print(detector.get_params())`}</code></pre>
      </div>

      <ExplainedFormula
        question="Contamination c는 연속 score를 어떻게 binary label로 바꿀까?"
        idea={<>Training score의 상위 c 비율이 경계를 넘도록 <code>100(1−c)</code> percentile을 threshold로 사용합니다. PyOD는 score가 threshold보다 클 때 1을 반환합니다.</>}
        formula={String.raw`\begin{aligned}\tau&=Q_{1-c}\!\left(\{O_i^{\mathrm{train}}\}_{i=1}^{n}\right)\\\widehat y_i&=\mathbf1[O_i>\tau]\end{aligned}`}
        terms={[
          { symbol: "c", name: "contamination", description: "Training data에서 outlier로 표시할 것으로 정한 비율이며 PyOD float 설정은 (0, 0.5] 범위입니다." },
          { symbol: "Q_{1-c}", name: "empirical quantile", description: "Training score 분포의 1−c 분위수입니다." },
          { symbol: "\\tau", name: "threshold", description: "연속 score를 binary action으로 바꾸는 경계입니다." },
          { symbol: "\\widehat y_i", name: "predicted label", description: "경계를 넘으면 1, 아니면 0인 운영용 결과입니다." },
        ]}
        assumptions={["같은 training score와 quantile 구현을 사용한다는 전제입니다.", "동점 score는 strict greater-than 비교 때문에 정확히 c 비율의 label을 보장하지 않을 수 있습니다."]}
        interpretation="Contamination은 ECDF score 계산을 학습시키지 않고 decision policy만 정합니다. 실제 anomaly prevalence를 모르면 review capacity와 false-positive 비용으로 선택하고 별도 검증해야 합니다."
      />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>새 row의 score는 고정된 training CDF 조회가 아니다</h3>
        <p>
          2026년 8월 기준 PyOD 3.6.4의 <code>decision_function</code>은 fit 때 저장한
          <code>X_train</code>과 새 입력을 concatenate한 뒤 ECDF와 skewness를 다시 계산하고
          새 row 부분만 반환한다. 따라서 같은 row라도 함께 넣은 test batch의 구성에 따라 score가
          달라질 수 있으며, 낮은 latency의 immutable scoring model이나 진정한 incremental detector로
          볼 수 없다. Batch policy까지 고정하거나 production 요구에 맞는 별도 ECDF lookup 구현을
          검증해야 한다.
        </p>
        <h3>복잡도 표기는 구현 비용과 함께 검증한다</h3>
        <p>
          원 논문은 전체 계산을 <code>O(nd)</code> 시간·공간으로 제시하지만 실제 ECDF 구현은
          feature별 sorting, tie 처리, array concatenate와 복사 비용을 포함한다. <code>n_jobs</code>는
          feature 계산을 병렬화하므로 열이 적거나 serialization 비용이 크면 오히려 손해일 수 있다.
          Latency·peak memory·batch size를 실제 production shape에서 측정하고 package version을 고정한다.
        </p>
      </div>

      <div id="paper-pyod-ecod" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">구현 읽기 · PyOD ECOD 3.6.4</p>
        <p className="mt-2 text-sm font-semibold">PyOD ECOD source와 BaseDetector threshold contract</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          공식 source는 논문 식을 이름만으로 추정하지 않고 <code>decision_function</code>의
          concatenate·ECDF·feature-level max·sum 경로와 <code>BaseDetector</code>의 contamination
          quantile을 직접 확인하게 해 줍니다. 여기서 설명한 batch-dependent score와 strict
          threshold는 PyOD 3.6.4 snapshot에 한정되며, 다른 version·독자 구현까지 같은 semantics를
          갖는다고 일반화하면 안 됩니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://pyod.readthedocs.io/en/latest/_modules/pyod/models/ecod.html" target="_blank" rel="noreferrer">공식 ECOD source의 실제 계산 경로 보기</a>
      </div>
    </section>
  );
}

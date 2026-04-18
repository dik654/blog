import OptunaFlowViz from './viz/OptunaFlowViz';

export default function Optuna() {
  return (
    <section id="optuna" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Optuna: Bayesian 최적화</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>Optuna</strong> — 2019년 Preferred Networks에서 개발한 하이퍼파라미터 최적화 프레임워크<br />
          핵심 개념 3가지: <strong>Study</strong>(최적화 세션), <strong>Trial</strong>(한 번의 파라미터 평가), <strong>Objective</strong>(사용자 정의 평가 함수)
        </p>

        <h3>Study → Trial → Objective 흐름</h3>
      </div>
      <div className="not-prose mb-6">
        <OptunaFlowViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>TPE (Tree-structured Parzen Estimator)</h3>
        <p>
          Optuna의 기본 sampler — GP-BO의 <strong>O(n³) 확장성 한계</strong>를 해결<br />
          GP-BO는 p(y|x)를 모델링하지만, TPE는 역으로 <strong>p(x|y)를 모델링</strong>
        </p>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 mb-4 text-sm">
          {[
            { name: 'l(x) = p(x | y < y*)', desc: '좋은 결과(y < threshold)를 낸 파라미터의 분포. Kernel Density Estimation으로 추정', color: 'text-emerald-500' },
            { name: 'g(x) = p(x | y ≥ y*)', desc: '나쁜 결과를 낸 파라미터의 분포. 마찬가지로 KDE 추정', color: 'text-red-500' },
            { name: 'EI(x) ∝ l(x)/g(x)', desc: 'Expected Improvement. l이 크고 g가 작은 지점이 유망 — 좋은 결과가 많고 나쁜 결과가 적은 영역', color: 'text-amber-500' },
            { name: 'y* = quantile(y, γ)', desc: 'threshold. 상위 γ%(기본 25%)를 "좋은 결과"로 분류. γ가 작을수록 착취 강화', color: 'text-blue-500' },
          ].map((p) => (
            <div key={p.name} className="rounded-lg border border-border bg-card px-3 py-2">
              <span className={`font-mono font-bold text-xs ${p.color}`}>{p.name}</span>
              <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{p.desc}</div>
            </div>
          ))}
        </div>

        <h3>define-by-run API</h3>
        <p>
          Hyperopt 등 기존 도구는 <strong>define-and-run</strong> — 탐색 공간을 미리 정적으로 정의<br />
          Optuna는 <strong>define-by-run</strong> — objective 함수 안에서 trial.suggest_*()로 동적 정의<br />
          장점: 조건부 파라미터를 if/else로 자연스럽게 표현. optimizer가 Adam이면 beta1/beta2 탐색, SGD면 momentum 탐색
        </p>

        <h3>병렬 최적화</h3>
        <p>
          <strong>study.optimize(objective, n_trials=100, n_jobs=-1)</strong> — CPU 코어 수만큼 병렬 실행<br />
          분산 환경: <strong>RDB Storage</strong>(MySQL, PostgreSQL)를 공유하면 여러 머신에서 동시 탐색<br />
          TPE는 비동기 업데이트를 지원 — 병렬 trial의 중간 결과를 즉시 반영하여 다음 제안에 활용
        </p>

        <h3>Dashboard</h3>
        <p>
          <strong>optuna-dashboard</strong> — 웹 UI로 실시간 모니터링<br />
          optimization history(수렴 추이), param importances(파라미터 중요도), contour plot(2D 상호작용) 제공<br />
          Jupyter 환경에서는 <strong>optuna.visualization</strong> 모듈로 Plotly 기반 인터랙티브 차트 생성
        </p>
      </div>
    </section>
  );
}

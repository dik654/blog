import SearchEvolutionViz from './viz/SearchEvolutionViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">탐색 전략 비교</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>하이퍼파라미터 튜닝</strong> — 모델의 학습률, 트리 깊이, 정규화 강도 등 <strong>학습 전에 결정해야 하는 값</strong>을 최적화하는 과정<br />
          모델 가중치(weight)는 학습 중 자동 갱신되지만, 하이퍼파라미터는 사람이 설정 — 최적 조합을 찾는 것이 성능의 핵심
        </p>

        <h3>Grid → Random → Bayesian 진화</h3>
      </div>
      <div className="not-prose mb-6">
        <SearchEvolutionViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Grid Search의 한계</h3>
        <p>
          각 파라미터의 후보 값을 지정하고 <strong>모든 조합을 전수 탐색</strong><br />
          파라미터 3개 x 후보 10개 = 1,000회 — 차원이 늘면 <strong>조합 폭발(Curse of Dimensionality)</strong><br />
          치명적 문제: 파라미터 중요도가 불균등하면 중요하지 않은 축에 예산을 낭비
        </p>

        <h3>Random Search가 더 효율적인 이유</h3>
        <p>
          Bergstra &amp; Bengio(2012) — 동일 예산일 때 Random이 Grid보다 더 좋은 조합을 찾음<br />
          이유: 실제 모델에서 <strong>성능에 영향을 주는 파라미터는 1~2개</strong>(나머지는 둔감)<br />
          Grid는 중요 파라미터 축에서도 격자 간격만큼만 탐색하지만, Random은 연속적으로 커버
        </p>

        <h3>Bayesian Optimization — surrogate model</h3>
        <p>
          핵심 아이디어: 이미 평가한 점들로 <strong>surrogate model(대리 모델)</strong>을 학습 → 목적 함수의 "지형도"를 근사<br />
          <strong>acquisition function(획득 함수)</strong>으로 "다음에 어디를 평가할지" 결정<br />
          Exploitation(착취, 좋은 영역 집중) vs Exploration(탐험, 미탐색 영역 시도) 균형이 핵심
        </p>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3 text-sm">
          {[
            { name: 'GP-BO', desc: 'Gaussian Process 기반. 소규모 탐색에 정확하지만 O(n³)으로 대규모에 비실용적', color: 'text-blue-500' },
            { name: 'TPE', desc: 'Tree-structured Parzen Estimator. Optuna 기본. 고차원+조건부 공간에 강함', color: 'text-emerald-500' },
            { name: 'SMAC', desc: 'Random Forest 기반 surrogate. 범주형 파라미터 처리에 유리', color: 'text-amber-500' },
          ].map((m) => (
            <div key={m.name} className="rounded-lg border border-border bg-card px-3 py-2">
              <span className={`font-mono font-bold text-xs ${m.color}`}>{m.name}</span>
              <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{m.desc}</div>
            </div>
          ))}
        </div>

        <h3>왜 Optuna가 대회 표준인가</h3>
        <p>
          <strong>define-by-run API</strong> — 탐색 공간을 코드 안에서 동적으로 정의. 조건부 파라미터(if/else) 자연스럽게 지원<br />
          <strong>TPE sampler</strong> — GP보다 확장성 좋고, 고차원 탐색 공간에서도 효율적<br />
          <strong>Pruning</strong> — 초반 성능이 나쁜 trial을 조기 종료하여 예산 절약<br />
          <strong>분산 최적화</strong> — RDB Storage로 여러 머신에서 병렬 탐색<br />
          <strong>Dashboard</strong> — 실시간 시각화로 탐색 과정 모니터링
        </p>
        <div className="not-prose grid grid-cols-2 gap-2 mt-3 text-sm">
          {[
            { vs: 'Optuna vs Hyperopt', diff: 'define-by-run vs define-and-run. Optuna는 조건부 공간 + pruning이 내장' },
            { vs: 'Optuna vs Ray Tune', diff: 'Ray는 분산 학습 프레임워크 위에 구축. 대규모 GPU 클러스터일 때 유리' },
            { vs: 'Optuna vs Keras Tuner', diff: 'Keras 전용 vs 프레임워크 무관. Optuna는 LightGBM, XGBoost도 지원' },
            { vs: 'Optuna vs W&B Sweeps', diff: 'W&B는 실험 추적 + 튜닝 통합. Optuna는 순수 튜닝에 더 유연' },
          ].map((c) => (
            <div key={c.vs} className="rounded-lg border border-border bg-card px-3 py-2">
              <span className="font-mono font-bold text-foreground text-xs">{c.vs}</span>
              <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{c.diff}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

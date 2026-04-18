import PruningViz from './viz/PruningViz';

export default function Pruning() {
  return (
    <section id="pruning" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">조기 종료 & 멀티 목적</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>Pruning(가지치기)</strong> — 초반 성능이 나쁜 trial을 빠르게 종료하여 예산을 절약<br />
          100 trials 중 60~70%가 초반에 종료 → 남은 예산으로 유망한 trial을 더 많이 탐색<br />
          결과적으로 같은 시간에 <strong>3~5배 더 많은 유효 탐색</strong>이 가능
        </p>

        <h3>Pruner 종류 & 멀티 목적</h3>
      </div>
      <div className="not-prose mb-6">
        <PruningViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>MedianPruner</h3>
        <p>
          가장 기본적인 pruner — 현재 trial의 중간 결과가 <strong>과거 trial들의 같은 epoch 중앙값</strong>보다 나쁘면 종료<br />
          <strong>n_warmup_steps</strong>: 초반 몇 epoch는 pruning 건너뛰기 — 초기 불안정을 감안<br />
          <strong>n_startup_trials</strong>: 처음 몇 trial은 기준선 확보를 위해 전부 완료 (기본값 5)
        </p>

        <h3>HyperbandPruner</h3>
        <p>
          <strong>Successive Halving Algorithm(SHA)</strong> 기반 — 다단계로 리소스를 할당<br />
          Round 1: 16 trials x 1 epoch → 하위 50% 탈락<br />
          Round 2: 8 trials x 3 epochs → 하위 50% 탈락<br />
          Round 3: 4 trials x 9 epochs → 하위 50% 탈락<br />
          Round 4: 2 trials x 27 epochs → 최종 비교<br />
          초반에 많이 탐색하고 점진적으로 좁혀가는 전략 — MedianPruner보다 공격적
        </p>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 mb-4 text-sm">
          {[
            { name: 'MedianPruner', pros: '안정적, 설정 간단. 대부분의 경우에 적합', cons: '보수적 — 나쁜 trial도 몇 epoch 소비', color: 'text-emerald-500' },
            { name: 'HyperbandPruner', pros: '공격적 탈락 — 예산 절약 극대화', cons: '초반에 잘라서 만회 가능한 trial도 탈락 가능', color: 'text-amber-500' },
            { name: 'PercentilePruner', pros: '중앙값 대신 상위 N%일 기준. 더 세밀한 조절', cons: 'percentile 값 설정에 경험 필요', color: 'text-blue-500' },
            { name: 'ThresholdPruner', pros: '절대 기준값으로 판단. 명확한 최저 기준이 있을 때', cons: '기준값을 미리 알아야 함', color: 'text-violet-500' },
          ].map((p) => (
            <div key={p.name} className="rounded-lg border border-border bg-card px-3 py-2">
              <span className={`font-mono font-bold text-xs ${p.color}`}>{p.name}</span>
              <div className="text-xs text-muted-foreground mt-1 leading-relaxed"><strong>장점:</strong> {p.pros}</div>
              <div className="text-xs text-muted-foreground mt-0.5 leading-relaxed"><strong>단점:</strong> {p.cons}</div>
            </div>
          ))}
        </div>

        <h3>멀티 목적 최적화</h3>
        <p>
          <strong>create_study(directions=["maximize", "minimize"])</strong> — 정확도 최대화 + 추론 시간 최소화 동시 최적화<br />
          결과: <strong>Pareto front(파레토 전선)</strong> — 어떤 목적도 희생하지 않고는 다른 목적을 개선할 수 없는 해 집합<br />
          study.best_trials로 Pareto 최적 해를 전부 조회 → 사용자가 트레이드오프를 고려하여 최종 선택
        </p>

        <h3>결과 시각화</h3>
        <p>
          <strong>plot_param_importances</strong> — <strong>fANOVA(functional ANOVA)</strong> 기반. 각 파라미터가 성능 분산의 몇 %를 설명하는지 분석<br />
          중요도 낮은 파라미터를 고정하면 탐색 차원을 줄여 효율 향상<br />
          <strong>plot_contour</strong> — 2D 등고선으로 두 파라미터의 상호작용 확인<br />
          <strong>plot_optimization_history</strong> — trial 진행에 따른 best value 수렴 추이. 수렴 여부로 추가 탐색 필요성 판단
        </p>

        <h3>실전 체크리스트</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 text-sm">
          {[
            { step: '1. CV 설정', detail: 'Stratified K-Fold(분류) 또는 GroupKFold(그룹 누출 방지). objective 안에서 CV 점수 반환' },
            { step: '2. 넓은 탐색', detail: '50 trials + MedianPruner. fANOVA로 중요 파라미터 파악' },
            { step: '3. 범위 축소', detail: 'best trial 근처로 범위를 좁혀 50 trials 추가. 중요도 낮은 파라미터는 고정' },
            { step: '4. 최종 학습', detail: 'best_params로 전체 데이터 학습. CV fold별 모델을 앙상블하면 추가 성능 향상' },
          ].map((s) => (
            <div key={s.step} className="rounded-lg border border-border bg-card px-3 py-2">
              <span className="font-mono font-bold text-foreground text-xs">{s.step}</span>
              <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{s.detail}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

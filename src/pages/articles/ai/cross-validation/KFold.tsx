import KFoldViz from './viz/KFoldViz';

export default function KFold() {
  return (
    <section id="kfold" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">K-Fold & Stratified K-Fold</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>K-Fold</strong> — 가장 기본적인 교차 검증<br />
          데이터를 K등분 → 각 fold를 돌아가며 검증 세트로 사용 → K번 학습-평가<br />
          K=5 또는 K=10이 일반적 — K가 클수록 평가 안정적이지만 계산 비용 증가
        </p>
        <p>
          아래 Viz에서 5개 스텝으로 <strong>K-Fold의 기본 동작 → Stratified K-Fold의 필요성 → Repeated K-Fold로 분산 축소</strong>를 차례로 확인한다.
        </p>
      </div>

      <div className="not-prose my-8">
        <KFoldViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">K값 선택 기준</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3 text-sm">
          {[
            {
              k: 'K=5',
              desc: '기본값. 학습 데이터 80% 사용. 대부분의 상황에 적합',
              when: '데이터 1만~100만건',
            },
            {
              k: 'K=10',
              desc: '더 안정적 추정. 학습 데이터 90% 사용. 계산 2배',
              when: '데이터 1만건 이하',
            },
            {
              k: 'LOOCV (K=N)',
              desc: 'Leave-One-Out. 극단적으로 안정적이지만 계산 비용 N배',
              when: '데이터 100건 미만',
            },
          ].map((p) => (
            <div key={p.k} className="rounded-lg border border-border bg-card px-3 py-2">
              <span className="font-mono font-bold text-foreground text-xs">{p.k}</span>
              <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{p.desc}</div>
              <div className="text-xs text-muted-foreground mt-1 italic">{p.when}</div>
            </div>
          ))}
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">실전 팁</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 text-sm">
          {[
            {
              title: 'shuffle=True 필수',
              desc: '데이터가 정렬되어 있으면(시간순, 클래스순) 셔플 없이 분할하면 편향 발생. 단, 시계열은 셔플 금지',
            },
            {
              title: 'random_state 고정',
              desc: '실험 재현성 확보. 같은 seed → 같은 분할 → 모델 간 공정한 비교 가능',
            },
            {
              title: '검증 metric 일치',
              desc: 'CV metric과 대회 평가 metric 일치 필수. AUC 대회인데 accuracy로 CV하면 의미 없음',
            },
            {
              title: 'fold별 점수 분석',
              desc: '평균만 보지 말고 fold별 편차 확인. 특정 fold만 낮으면 → 해당 데이터 구간에 문제 있음',
            },
          ].map((p) => (
            <div key={p.title} className="rounded-lg border border-border bg-card px-3 py-2">
              <span className="font-bold text-foreground text-xs">{p.title}</span>
              <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{p.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
        <p className="font-semibold mb-2">실전 팁: 분류는 무조건 Stratified</p>
        <p className="text-sm">
          sklearn의 <code>cross_val_score</code>는 분류기에 대해 기본적으로 Stratified K-Fold를 사용 — 하지만 수동으로
          <code>KFold</code>를 지정하면 이 안전장치가 풀림<br />
          분류 문제에서는 항상 <code>StratifiedKFold</code>를 명시하거나 <code>cross_val_score</code>에 맡겨라
        </p>
      </div>
    </section>
  );
}

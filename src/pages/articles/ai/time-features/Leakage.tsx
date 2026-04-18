import LeakageViz from './viz/LeakageViz';

export default function Leakage() {
  return (
    <section id="leakage" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">미래 누출 방지 전략</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>미래 누출(Future Leakage)</strong> — 학습 시점에서 알 수 없는 미래 정보가 피처에 포함되는 현상<br />
          시계열 피처 엔지니어링에서 가장 치명적인 실수. 검증 점수는 높지만 실전 배포 후 성능이 급락
        </p>

        <h3>누출이 발생하는 흔한 패턴</h3>
        <p>
          <strong>패턴 1: 전체 데이터에 피처 생성 후 분할</strong><br />
          rolling, shift, 정규화를 전체 데이터에 먼저 적용하면 test 시점의 통계가 train에 영향<br />
          <code>center=True</code> 옵션은 미래 값을 윈도우에 포함시키므로 특히 위험
        </p>
        <p>
          <strong>패턴 2: 전체 데이터로 target encoding</strong><br />
          카테고리 변수의 target mean을 전체 데이터로 계산하면 test의 target 정보가 train에 유입<br />
          fold별로 train 내에서만 계산해야 안전
        </p>
        <p>
          <strong>패턴 3: 랜덤 KFold로 교차검증</strong><br />
          시계열에서 랜덤 분할 → 미래 데이터가 train에, 과거 데이터가 test에 배치<br />
          시계열에서는 반드시 시간 순서를 유지하는 분할 전략 사용
        </p>
      </div>
      <div className="not-prose my-8">
        <LeakageViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>올바른 시계열 분할</h3>
        <p>
          <strong>TimeSeriesSplit</strong> — sklearn의 시계열 전용 교차검증<br />
          각 fold에서 train은 항상 test보다 과거. fold가 진행될수록 train 크기 증가<br />
          <code>TimeSeriesSplit(n_splits=5)</code> — 5개 fold, 각각 과거→미래 방향
        </p>
        <p>
          <strong>GroupKFold + 시간 그룹</strong> — 같은 시간 단위(주, 월)가 train과 test에 걸치지 않도록<br />
          예: 주 단위 그룹 → 같은 주의 데이터가 train/test에 나뉘는 것 방지<br />
          단, GroupKFold 자체는 시간 순서를 보장하지 않으므로 정렬 후 사용
        </p>

        <h3>Purged/Embargo 기법</h3>
        <p>
          금융 시계열에서 사용하는 고급 기법<br />
          <strong>Purge</strong>: train과 test 사이에 갭(gap)을 두어 래그 피처의 간접 누출 방지<br />
          <strong>Embargo</strong>: test 직후 일정 기간의 데이터를 train에서 제외<br />
          래그 피처의 윈도우 크기만큼 갭을 두는 것이 안전
        </p>

        <h3>누출 탐지 방법</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 text-sm">
          {[
            { title: 'CV vs LB 갭', desc: 'CV 점수가 비정상적으로 높으면 누출 의심. 실제 리더보드와 큰 차이가 나면 거의 확실' },
            { title: '피처 중요도 이상', desc: '시간 관련 피처가 압도적 1위면 누출 가능성. 특히 롤링 피처가 래그보다 중요하면 의심' },
            { title: '시간역순 검증', desc: '피처를 시간 역순으로 계산해도 성능이 동일하면 미래 정보 사용 증거' },
            { title: 'Adversarial Validation', desc: 'train/test를 구분하는 모델 학습. AUC > 0.7이면 분포 차이 = 누출 가능성' },
          ].map((item) => (
            <div key={item.title} className="rounded-lg border border-border bg-card px-3 py-2">
              <span className="font-semibold text-foreground text-xs">{item.title}</span>
              <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.desc}</div>
            </div>
          ))}
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-1">실전 원칙</p>
          <p className="text-sm text-amber-700 dark:text-amber-300">
            피처를 만들 때마다 스스로에게 물어볼 것: <strong>"실제 배포 환경에서 이 시점에 이 값을 알 수 있는가?"</strong><br />
            대회에서 높은 점수를 받아도 실전에서 재현되지 않으면 의미가 없다.
            의심스러우면 피처를 빼는 것이 안전하다.
          </p>
        </div>
      </div>
    </section>
  );
}

import CVOverviewViz from './viz/CVOverviewViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">왜 교차 검증인가</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          모델 학습 후 "성능이 얼마나 되는지" 평가해야 함<br />
          가장 단순한 방법 — <strong>Train/Test Split</strong>: 데이터를 한 번 나누고 test로 평가<br />
          문제: 어떤 데이터가 test에 들어가느냐에 따라 점수가 크게 흔들림
        </p>
        <p>
          <strong>교차 검증(Cross-Validation, CV)</strong> — 데이터를 K개로 나누고 돌아가며 검증하여 K개의 점수를 얻는 방법<br />
          평균과 분산으로 <strong>일반화 성능의 신뢰구간</strong>을 추정<br />
          단일 점수가 아닌 "0.87 ± 0.02" 같은 범위로 성능을 보고
        </p>

        <h3>CV의 3가지 핵심 가치</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3 text-sm">
          {[
            {
              title: '안정적 평가',
              desc: '랜덤 분할의 운(luck)을 제거 — K번 반복으로 분산까지 파악',
            },
            {
              title: '데이터 효율',
              desc: '모든 데이터가 한 번은 검증에 사용 — 작은 데이터셋에서 특히 중요',
            },
            {
              title: '모델 선택 근거',
              desc: '모델 A: 0.87±0.01 vs 모델 B: 0.88±0.05 → A가 더 안정적',
            },
          ].map((p) => (
            <div key={p.title} className="rounded-lg border border-border bg-card px-3 py-2">
              <span className="font-bold text-foreground text-xs">{p.title}</span>
              <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{p.desc}</div>
            </div>
          ))}
        </div>

        <h3 className="mt-4">대회에서 CV가 리더보드보다 중요한 이유</h3>
        <p>
          Kaggle/Dacon 리더보드 점수 = <strong>Public Test의 일부(보통 30%)</strong>에 대한 단일 평가<br />
          LB에 과적합(overfit)하면 Private Test에서 순위가 뒤집힘 — <strong>shake-up</strong><br />
          CV 점수는 전체 학습 데이터에 대한 K번 반복 평균 → LB보다 더 안정적
        </p>
        <p>
          핵심 원칙: <strong>"Trust your CV"</strong> — CV가 안정적이면 LB 점수에 흔들리지 말 것<br />
          단, CV 전략이 데이터 구조와 맞아야 신뢰할 수 있음 — 이후 섹션에서 상세히 다룸
        </p>
      </div>
      <div className="not-prose mt-6">
        <CVOverviewViz />
      </div>
    </section>
  );
}

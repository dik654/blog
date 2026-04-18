import TimeSeriesSplitViz from './viz/TimeSeriesSplitViz';

export default function TimeSeriesSplit() {
  return (
    <section id="timeseries" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">TimeSeriesSplit: 시간 순서 보존</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          시계열 데이터는 <strong>시간 순서</strong>가 핵심 — 과거로 미래를 예측해야 함<br />
          일반 K-Fold: 셔플로 시간 순서가 무너짐 → 미래 데이터가 train에, 과거 데이터가 val에<br />
          이를 <strong>look-ahead bias(미래 참조 편향)</strong>라 하며, 시계열에서 가장 흔한 누출 유형
        </p>

        <h3>TimeSeriesSplit의 규칙</h3>
        <p>
          sklearn <code>TimeSeriesSplit(n_splits=5)</code> — 각 fold에서 train은 항상 val보다 과거<br />
          fold가 진행될수록 train 크기가 커짐: <strong>expanding window</strong><br />
          시간 역전 없음 → 항상 "과거 → 미래" 방향으로 검증
        </p>

        <h3>Expanding Window vs Sliding Window</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 text-sm">
          {[
            {
              type: 'Expanding Window',
              desc: 'Train 시작점 고정, 끝점 확장. 모든 과거 데이터 활용',
              when: '정상(stationary) 시계열. 과거 정보가 여전히 유효한 경우',
              how: 'sklearn TimeSeriesSplit 기본 동작',
            },
            {
              type: 'Sliding Window',
              desc: 'Train 크기 고정, 시작/끝점 모두 이동. 최근 패턴에 집중',
              when: '비정상(non-stationary) 시계열. 분포 변화(drift)가 있는 경우',
              how: 'max_train_size 파라미터 또는 직접 구현',
            },
          ].map((p) => (
            <div key={p.type} className="rounded-lg border border-border bg-card px-3 py-2">
              <span className="font-bold text-foreground text-xs">{p.type}</span>
              <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{p.desc}</div>
              <div className="text-xs text-muted-foreground mt-1 italic">적합: {p.when}</div>
              <div className="text-xs text-muted-foreground mt-1">구현: {p.how}</div>
            </div>
          ))}
        </div>

        <h3 className="mt-4">창고 대회: 25 타임슬롯 시계열 분할</h3>
        <p>
          타임슬롯 1~25에서 시간 순서 유지 필수<br />
          Train: slot 1~t, Val: slot t+1~t+5<br />
          4-fold split: [1-5|6-10], [1-10|11-15], [1-15|16-20], [1-20|21-25]<br />
          시나리오별 그룹이 있으면 → <strong>GroupKFold + 시간 순서 결합</strong> 필요
        </p>

        <h3 className="mt-4">Purge & Embargo: 고급 시계열 CV</h3>
        <p>
          금융 시계열처럼 자기상관이 강한 데이터에서는 경계(boundary) 부근 데이터가 누출원<br />
          <strong>Purge(제거)</strong>: train-val 경계 앞뒤 n개 샘플 삭제<br />
          <strong>Embargo(금지 구간)</strong>: val 직후 일정 구간을 다음 fold train에서 제외<br />
          Marcos Lopez de Prado의 《Advances in Financial ML》에서 제안한 기법
        </p>

        <h3 className="mt-4">시계열 CV 선택 가이드</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3 text-sm">
          {[
            {
              situation: '일반 시계열',
              strategy: 'TimeSeriesSplit',
              note: 'expanding window 기본',
            },
            {
              situation: '분포 변화 있음',
              strategy: 'Sliding Window',
              note: 'max_train_size 설정',
            },
            {
              situation: '금융 시계열',
              strategy: 'Purged + Embargo',
              note: '자기상관 차단 필수',
            },
          ].map((p) => (
            <div key={p.situation} className="rounded-lg border border-border bg-card px-3 py-2">
              <span className="font-bold text-foreground text-xs">{p.situation}</span>
              <div className="text-xs text-muted-foreground mt-1">{p.strategy}</div>
              <div className="text-xs text-muted-foreground mt-1 italic">{p.note}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="not-prose mt-6">
        <TimeSeriesSplitViz />
      </div>
    </section>
  );
}

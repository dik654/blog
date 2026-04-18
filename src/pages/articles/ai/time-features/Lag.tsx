import LagViz from './viz/LagViz';

export default function Lag() {
  return (
    <section id="lag" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">래그 피처 & 차분</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>래그 피처(Lag Feature)</strong> — 이전 시점의 관측값을 현재 행의 입력 변수로 사용하는 것<br />
          가장 단순하면서도 가장 강력한 시계열 피처. 대부분의 시계열에서 "어제 값"이 가장 좋은 예측 인자
        </p>

        <h3>래그 피처의 원리</h3>
        <p>
          y(t-1): 한 시점 전의 값 — "어제 판매량은 오늘 판매량의 가장 좋은 힌트"<br />
          y(t-2): 두 시점 전의 값 — 더 먼 과거까지 참조할수록 다양한 패턴 포착 가능<br />
          pandas에서는 <code>df['lag_1'] = df['y'].shift(1)</code>로 간단히 생성
        </p>
        <p>
          <strong>주의점</strong> — shift 결과 첫 k행은 NaN. dropna() 또는 fillna()로 처리 필요<br />
          래그 수가 많으면 차원이 늘어나므로 상관분석(ACF)으로 유의미한 래그만 선택
        </p>

        <h3>차분 (Differencing)</h3>
        <p>
          <strong>차분(diff)</strong> = y(t) - y(t-1) — 값 자체가 아닌 <strong>변화량</strong>을 피처로 사용<br />
          추세(trend)가 있는 비정상 시계열에서 특히 유용 — 차분하면 추세가 제거되어 정상 시계열에 근접<br />
          pandas: <code>df['diff_1'] = df['y'].diff(1)</code>
        </p>
        <p>
          2차 차분(diff of diff)도 가능 — 변화량의 변화량 = 가속도에 해당<br />
          ARIMA 모델의 I(Integrated)가 바로 이 차분 횟수
        </p>
      </div>
      <div className="not-prose my-8">
        <LagViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>자기상관(ACF)으로 래그 선택</h3>
        <p>
          <strong>ACF(AutoCorrelation Function)</strong> — 시차 k에서의 자기상관계수: corr(y(t), y(t-k))<br />
          ACF가 높은 시차 → 예측력이 높은 래그 피처<br />
          PACF(Partial ACF) — 중간 시차의 영향을 제거한 순수 상관. AR 모델의 차수 결정에 사용
        </p>

        <h3>실전 가이드라인</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 text-sm">
          {[
            { title: '일별 데이터', desc: 'lag-1, lag-7(주간 주기), lag-14, lag-28 등 주기 배수 래그' },
            { title: '주별 데이터', desc: 'lag-1, lag-4(월간), lag-13(분기), lag-52(연간)' },
            { title: '차분 vs 래그', desc: '래그 = 절대 수준 정보, 차분 = 변화 방향 정보. 둘 다 포함이 유리' },
            { title: '래그 수 제한', desc: 'ACF 기준 유의미한 래그만 선택. 과도한 래그는 과적합 유발' },
          ].map((item) => (
            <div key={item.title} className="rounded-lg border border-border bg-card px-3 py-2">
              <span className="font-semibold text-foreground text-xs">{item.title}</span>
              <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.desc}</div>
            </div>
          ))}
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-1">래그 피처와 미래 누출</p>
          <p className="text-sm text-amber-700 dark:text-amber-300">
            래그 피처 자체는 미래 누출이 아니다 — 과거 값만 참조하기 때문이다.
            단, <strong>target encoding을 래그와 함께 사용할 때</strong> 전체 데이터로 인코딩하면 누출이 발생한다.
            항상 학습/검증/테스트 분할 후에 피처를 계산할 것.
          </p>
        </div>
      </div>
    </section>
  );
}

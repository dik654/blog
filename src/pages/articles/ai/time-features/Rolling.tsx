import RollingViz from './viz/RollingViz';

export default function Rolling() {
  return (
    <section id="rolling" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">롤링 통계: 이동 평균, 표준편차</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>롤링 통계(Rolling Statistics)</strong> — 고정 크기 윈도우를 시간 축을 따라 슬라이딩하며 통계량을 계산<br />
          래그 피처가 "특정 시점의 값"이라면, 롤링 통계는 <strong>"최근 구간의 요약"</strong>
        </p>

        <h3>이동 평균 (Rolling Mean)</h3>
        <p>
          rolling_mean(t, w) = (1/w) * [y(t) + y(t-1) + ... + y(t-w+1)]<br />
          노이즈를 제거하고 추세를 드러냄 — 윈도우 크기가 클수록 부드러운 곡선<br />
          pandas: <code>df['rmean_7'] = df['y'].rolling(7).mean()</code>
        </p>

        <h3>이동 표준편차 (Rolling Std)</h3>
        <p>
          <strong>변동성(Volatility)</strong>의 정량적 지표<br />
          rolling_std가 급격히 증가하는 구간 = 구조적 변화(regime change) 또는 이상치(anomaly)<br />
          금융에서 볼린저 밴드(Bollinger Band) = 이동 평균 ± 2 * 이동 표준편차
        </p>
      </div>
      <div className="not-prose my-8">
        <RollingViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>윈도우 크기 선택 전략</h3>
        <p>
          도메인 주기에 맞추는 것이 원칙 — 일별 데이터에서 주간 패턴이 있으면 w=7<br />
          작은 윈도우(3~5): 빠른 반응, 노이즈에 민감 — 단기 시그널 포착<br />
          큰 윈도우(20~30): 안정적 추세, 지연(lag) 발생 — 장기 트렌드 포착<br />
          여러 윈도우 크기를 동시에 사용하는 것이 일반적 — rmean_3, rmean_7, rmean_30
        </p>

        <h3>지수 이동 평균 (EMA)</h3>
        <p>
          <strong>EMA(Exponential Moving Average)</strong> — 최근 값에 더 큰 가중치를 부여<br />
          EMA(t) = alpha * y(t) + (1 - alpha) * EMA(t-1), alpha = 2/(span+1)<br />
          단순 이동 평균(SMA) 대비 장점: 추세 전환에 <strong>빠르게 반응</strong> + NaN 없이 첫 값부터 계산 가능
        </p>
        <p>
          pandas: <code>df['ema_5'] = df['y'].ewm(span=5).mean()</code><br />
          span=5이면 alpha=0.333 — 최근 3~4개 값이 전체 가중치의 대부분을 차지
        </p>

        <h3>롤링 최대/최소 & 범위</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3 text-sm">
          {[
            { title: 'rolling max', desc: '구간 내 최고점. 저항선 분석, 피크 탐지에 활용' },
            { title: 'rolling min', desc: '구간 내 최저점. 지지선 분석, 바닥 탐지에 활용' },
            { title: 'range = max - min', desc: '구간 변동 폭. 변동성의 직관적 지표' },
          ].map((item) => (
            <div key={item.title} className="rounded-lg border border-border bg-card px-3 py-2">
              <span className="font-mono font-semibold text-foreground text-xs">{item.title}</span>
              <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.desc}</div>
            </div>
          ))}
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-1">롤링 통계의 미래 누출 함정</p>
          <p className="text-sm text-amber-700 dark:text-amber-300">
            <code>df['y'].rolling(7).mean()</code>은 현재 시점 포함 과거 7개의 평균이므로 안전하다.
            그러나 <strong>center=True</strong> 옵션을 쓰면 미래 값이 포함되어 누출이 발생한다.
            시계열 피처 생성 시 center=False(기본값)를 반드시 확인할 것.
          </p>
        </div>
      </div>
    </section>
  );
}

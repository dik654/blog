import M from '@/components/ui/math';

export default function Applications() {
  return (
    <section id="applications" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">SARIMA 확장과 실전 적용</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>SARIMA: 계절성 모델링</h3>
        <p>
          실제 시계열에는 <strong>계절성(Seasonality)</strong>이 존재<br />
          SARIMA — ARIMA에 계절 AR/I/MA 항을 추가하여 주기적 패턴 포착<br />
          월별 데이터는 s=12, 분기별은 s=4, 주별은 s=52 사용
        </p>
        <M display>{'\\text{SARIMA}(\\underbrace{p,d,q}_{\\text{비계절}})\\,(\\underbrace{P,D,Q,s}_{\\text{계절}})'}</M>
        <div className="not-prose grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 mb-4 text-sm">
          {[
            { sym: 'p, d, q', name: '비계절 성분', desc: '일반 ARIMA와 동일한 AR/차분/MA 차수' },
            { sym: 'P, D, Q', name: '계절 성분', desc: '계절 주기 단위의 AR/차분/MA 차수' },
            { sym: 's', name: '계절 주기', desc: '월별=12, 분기별=4, 주별=52' },
            { sym: '예시', name: '(1,1,1)(1,1,1,12)', desc: '비계절 ARIMA(1,1,1) + 12개월 주기 계절 성분' },
          ].map((p) => (
            <div key={p.sym} className="rounded-lg border border-border bg-card px-3 py-2">
              <span className="font-mono font-bold text-foreground text-xs">{p.sym}</span>
              <span className="text-muted-foreground ml-1.5 text-xs font-semibold">{p.name}</span>
              <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{p.desc}</div>
            </div>
          ))}
        </div>

        <h3>실전 적용 영역</h3>
        <p>
          금융(주가/환율), 소매(수요 예측), 에너지(전력 소비), 기상(기온/강수량) 등<br />
          단변량 시계열 예측에서 여전히 강력한 베이스라인<br />
          M-Competition 벤치마크에서 통계 모델이 복잡한 ML 모델을 이기는 사례 다수
        </p>

        <h3>ARIMA vs 딥러닝</h3>
        <div className="not-prose grid grid-cols-2 gap-3 mt-3 text-sm">
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 px-4 py-3">
            <p className="font-bold text-emerald-600 dark:text-emerald-400 text-xs mb-2">ARIMA 강점</p>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>해석 가능성 — 계수의 통계적 의미 부여</li>
              <li>적은 데이터로도 학습 가능</li>
              <li>신뢰 구간 제공 (확률적 예측)</li>
            </ul>
          </div>
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 px-4 py-3">
            <p className="font-bold text-amber-600 dark:text-amber-400 text-xs mb-2">ARIMA 한계</p>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>선형 관계만 포착</li>
              <li>다변량 시계열에 약함 (VAR 필요)</li>
              <li>장기 예측 정확도 하락</li>
            </ul>
          </div>
          <div className="col-span-2 rounded-lg border border-violet-500/30 bg-violet-500/5 px-4 py-3">
            <p className="font-bold text-violet-600 dark:text-violet-400 text-xs mb-2">딥러닝 대안 (LSTM, Transformer)</p>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>비선형 패턴 포착 — 복잡한 시계열에 강점</li>
              <li>다변량/다중 시계열 동시 학습 가능</li>
              <li>대규모 데이터에서 우위, 하이브리드 접근(ARIMA + NN)도 활발</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

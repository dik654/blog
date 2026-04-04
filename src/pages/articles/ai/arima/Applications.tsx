import CodePanel from '@/components/ui/code-panel';

const sarimaCode = `# SARIMA(p,d,q)(P,D,Q,s) — 계절성 확장
# 비계절 성분: ARIMA(p,d,q)
# 계절 성분:   AR(P), 차분(D), MA(Q), 주기(s)
#
# 예: 월별 매출 → s=12
from statsmodels.tsa.statespace.sarimax import SARIMAX
model = SARIMAX(train,
                order=(1,1,1),           # (p,d,q)
                seasonal_order=(1,1,1,12) # (P,D,Q,s)
               ).fit()
forecast = model.forecast(steps=12)`;

const sarimaAnnotations = [
  { lines: [1, 4] as [number, number], color: 'sky' as const, note: 'SARIMA 구조' },
  { lines: [7, 11] as [number, number], color: 'emerald' as const, note: '계절 주기 s=12' },
];

const comparisonCode = `# ARIMA vs 딥러닝 비교
#
# ARIMA 장점:
#   - 해석 가능성 (계수의 통계적 의미)
#   - 적은 데이터로도 학습 가능
#   - 신뢰 구간 제공 (확률적 예측)
#
# ARIMA 한계:
#   - 선형 관계만 포착
#   - 다변량 시계열에 약함 (VAR 필요)
#   - 장기 예측 정확도 하락
#
# 딥러닝 (LSTM, Transformer):
#   - 비선형 패턴 포착
#   - 다변량/다중 시계열 동시 학습
#   - 대규모 데이터에서 우위`;

const compAnnotations = [
  { lines: [3, 6] as [number, number], color: 'emerald' as const, note: 'ARIMA 강점' },
  { lines: [8, 11] as [number, number], color: 'amber' as const, note: 'ARIMA 한계' },
  { lines: [13, 16] as [number, number], color: 'violet' as const, note: '딥러닝 대안' },
];

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
        <CodePanel title="SARIMA 코드 예시" code={sarimaCode}
          annotations={sarimaAnnotations} defaultOpen />

        <h3>실전 적용 영역</h3>
        <p>
          금융(주가/환율), 소매(수요 예측), 에너지(전력 소비), 기상(기온/강수량) 등<br />
          단변량 시계열 예측에서 여전히 강력한 베이스라인<br />
          M-Competition 벤치마크에서 통계 모델이 복잡한 ML 모델을 이기는 사례 다수
        </p>

        <h3>한계와 딥러닝 연결</h3>
        <p>
          ARIMA의 한계 — <strong>선형성 가정</strong>으로 복잡한 비선형 패턴 포착 불가<br />
          LSTM, Temporal Fusion Transformer 등 딥러닝 기반 시계열 모델이 이를 보완<br />
          최근에는 하이브리드 접근(ARIMA + Neural Network)도 활발히 연구
        </p>
        <CodePanel title="ARIMA vs 딥러닝" code={comparisonCode}
          annotations={compAnnotations} />
      </div>
    </section>
  );
}

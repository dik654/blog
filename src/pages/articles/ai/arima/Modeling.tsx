import CodePanel from '@/components/ui/code-panel';

const acfPacfCode = `# ACF (자기상관함수) — MA(q) 차수 결정
#   ACF가 lag q 이후 급격히 절단 → MA(q)
#   ACF가 서서히 감소 → AR 성분 존재
#
# PACF (편자기상관함수) — AR(p) 차수 결정
#   PACF가 lag p 이후 급격히 절단 → AR(p)
#   PACF가 서서히 감소 → MA 성분 존재
#
# 해석 가이드:
#   AR(p):  ACF 감소, PACF lag p에서 절단
#   MA(q):  ACF lag q에서 절단, PACF 감소
#   ARMA:   ACF·PACF 모두 서서히 감소`;

const acfAnnotations = [
  { lines: [1, 3] as [number, number], color: 'sky' as const, note: 'ACF → q 결정' },
  { lines: [5, 7] as [number, number], color: 'emerald' as const, note: 'PACF → p 결정' },
  { lines: [10, 12] as [number, number], color: 'amber' as const, note: '패턴 해석표' },
];

const modelSelectCode = `# AIC / BIC 모델 선택 기준
# AIC = -2·ln(L) + 2k          (파라미터 수 k에 페널티)
# BIC = -2·ln(L) + k·ln(n)     (표본 수 n에 더 강한 페널티)
#
# auto_arima로 자동 탐색
from pmdarima import auto_arima
model = auto_arima(train, seasonal=False,
                   information_criterion='aic',
                   stepwise=True, trace=True)
# → 최적 ARIMA(p,d,q) 자동 선택`;

const modelAnnotations = [
  { lines: [2, 3] as [number, number], color: 'violet' as const, note: '정보 기준 수식' },
  { lines: [6, 10] as [number, number], color: 'emerald' as const, note: 'auto_arima 자동 탐색' },
];

export default function Modeling() {
  return (
    <section id="modeling" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">모델링 과정</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>ACF / PACF 해석</h3>
        <p>
          차분 후 정상화된 시계열에 대해 <strong>ACF(자기상관함수)</strong>와 <strong>PACF(편자기상관함수)</strong>를 그려 p, q 후보를 결정<br />
          핵심 — "급격한 절단(cutoff)" 패턴을 찾는 것
        </p>
        <CodePanel title="ACF / PACF 해석 가이드" code={acfPacfCode}
          annotations={acfAnnotations} defaultOpen />

        <h3>AIC / BIC 모델 선택</h3>
        <p>
          여러 (p,d,q) 후보 중 최적 모델 — <strong>AIC</strong>(Akaike Information Criterion) 또는 <strong>BIC</strong>(Bayesian Information Criterion)가 가장 작은 모델<br />
          BIC는 표본 크기에 비례하는 페널티로 과적합을 더 강하게 억제
        </p>
        <CodePanel title="AIC/BIC & auto_arima" code={modelSelectCode}
          annotations={modelAnnotations} />

        <h3>잔차 진단</h3>
        <p>
          적합 후 잔차가 <strong>백색잡음(White Noise, 무작위 노이즈)</strong>인지 확인<br />
          Ljung-Box 검정(p-value &gt; 0.05)과 잔차 ACF 플롯으로 검증<br />
          잔차에 패턴이 남아 있으면 p, q를 재조정
        </p>
      </div>
    </section>
  );
}

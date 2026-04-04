import CodePanel from '@/components/ui/code-panel';
import ARIMAPipelineViz from './viz/ARIMAPipelineViz';

const stationarityCode = `# 정상성(Stationarity) 조건
# 1. 평균이 시간에 따라 일정: E[Yt] = μ (상수)
# 2. 분산이 시간에 따라 일정: Var(Yt) = σ² (상수)
# 3. 자기공분산이 시차에만 의존: Cov(Yt, Yt-k) = γ(k)

# ADF (Augmented Dickey-Fuller) 검정
# H0: 단위근 존재 (비정상)  vs  H1: 정상 시계열
from statsmodels.tsa.stattools import adfuller
result = adfuller(series)
p_value = result[1]  # p < 0.05 → 정상 시계열`;

const stationarityAnnotations = [
  { lines: [2, 4] as [number, number], color: 'sky' as const, note: '정상성 3가지 조건' },
  { lines: [7, 10] as [number, number], color: 'emerald' as const, note: 'ADF 검정으로 판단' },
];

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ARIMA 개요</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>ARIMA</strong>(AutoRegressive Integrated Moving Average) — Box-Jenkins 방법론에 기반한 대표적인 시계열 예측 모델<br />
          주가 예측, 수요 예측, 기상 데이터 분석 등 다양한 분야에서 딥러닝 이전까지 가장 널리 사용
        </p>
        <p>
          ARIMA의 핵심 — <strong>시계열 데이터의 자기상관(Autocorrelation, 시차 간 상관관계) 구조</strong>를 포착<br />
          과거 값과 과거 오차의 선형 결합으로 미래를 예측<br />
          비정상 시계열은 차분(Differencing)을 통해 정상성 확보
        </p>

        <h3>Box-Jenkins 모델링 파이프라인</h3>
      </div>
      <div className="not-prose mb-6">
        <ARIMAPipelineViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>정상성 (Stationarity)</h3>
        <p>
          ARIMA 모델의 전제 조건 — <strong>정상성(Stationarity, 통계적 성질이 시간에 따라 변하지 않는 것)</strong><br />
          평균/분산/자기공분산이 일정해야 함
        </p>
        <CodePanel title="정상성 조건과 ADF 검정" code={stationarityCode}
          annotations={stationarityAnnotations} />
      </div>
    </section>
  );
}

import ARIMAPipelineViz from './viz/ARIMAPipelineViz';
import M from '@/components/ui/math';

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
        <h4>정상성 3가지 조건</h4>
        <M display>{'\\underbrace{E[Y_t] = \\mu}_{\\text{평균 일정}} \\qquad \\underbrace{\\text{Var}(Y_t) = \\sigma^2}_{\\text{분산 일정}} \\qquad \\underbrace{\\text{Cov}(Y_t,\\, Y_{t-k}) = \\gamma(k)}_{\\text{자기공분산이 시차 k에만 의존}}'}</M>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3 text-sm">
          {[
            { sym: 'E[Yₜ] = μ', name: '평균 일정', desc: '시계열의 기대값이 시간에 따라 변하지 않음 — 트렌드가 없어야 함' },
            { sym: 'Var(Yₜ) = σ²', name: '분산 일정', desc: '변동 폭이 시간에 따라 일정 — 변동성이 커지거나 줄어들지 않음' },
            { sym: 'Cov(Yₜ, Yₜ₋ₖ) = γ(k)', name: '공분산은 시차만 의존', desc: '두 시점 간 상관관계가 절대 시점이 아닌 시차 k에만 의존' },
          ].map((p) => (
            <div key={p.sym} className="rounded-lg border border-border bg-card px-3 py-2">
              <span className="font-mono font-bold text-foreground text-xs">{p.sym}</span>
              <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{p.desc}</div>
            </div>
          ))}
        </div>

        <h4 className="mt-4">ADF 검정 (Augmented Dickey-Fuller)</h4>
        <p>
          정상성 여부를 통계적으로 판단하는 검정<br />
          <strong>귀무가설 H₀</strong>: 단위근 존재 (비정상) vs <strong>대립가설 H₁</strong>: 정상 시계열<br />
          p-value &lt; 0.05 → H₀ 기각 → 정상 시계열로 판단
        </p>
      </div>
    </section>
  );
}

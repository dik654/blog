import M from '@/components/ui/math';

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
        <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3 mb-4 text-sm">
          {[
            { model: 'AR(p)', acf: 'ACF 서서히 감소', pacf: 'PACF lag p에서 급격 절단', color: 'text-emerald-500' },
            { model: 'MA(q)', acf: 'ACF lag q에서 급격 절단', pacf: 'PACF 서서히 감소', color: 'text-sky-500' },
            { model: 'ARMA(p,q)', acf: 'ACF 서서히 감소', pacf: 'PACF 서서히 감소', color: 'text-violet-500' },
          ].map((p) => (
            <div key={p.model} className="rounded-lg border border-border bg-card px-3 py-2">
              <span className={`font-mono font-bold text-xs ${p.color}`}>{p.model}</span>
              <div className="text-xs text-muted-foreground mt-1">ACF: {p.acf}</div>
              <div className="text-xs text-muted-foreground mt-0.5">PACF: {p.pacf}</div>
            </div>
          ))}
        </div>
        <p>
          <strong>ACF</strong> — 시차 k일 때의 자기상관 계수. MA(q) 차수를 결정<br />
          <strong>PACF</strong> — 중간 시차의 영향을 제거한 순수 상관. AR(p) 차수를 결정
        </p>

        <h3>AIC / BIC 모델 선택</h3>
        <p>
          여러 (p,d,q) 후보 중 최적 모델 — <strong>AIC</strong>(Akaike Information Criterion) 또는 <strong>BIC</strong>(Bayesian Information Criterion)가 가장 작은 모델<br />
          BIC는 표본 크기에 비례하는 페널티로 과적합을 더 강하게 억제
        </p>
        <M display>{'\\underbrace{\\text{AIC} = -2 \\ln(L) + 2k}_{\\text{파라미터 수 k에 페널티}} \\qquad \\underbrace{\\text{BIC} = -2 \\ln(L) + k \\ln(n)}_{\\text{표본 수 n에 더 강한 페널티}}'}</M>
        <div className="not-prose grid grid-cols-2 gap-2 mt-3 mb-4 text-sm">
          {[
            { sym: 'L', name: '우도(Likelihood)', desc: '모델이 데이터를 얼마나 잘 설명하는지 — 클수록 좋음' },
            { sym: 'k', name: '파라미터 수', desc: 'p + q + 상수항 등. 많을수록 페널티 증가 → 과적합 방지' },
            { sym: 'n', name: '표본 크기', desc: 'BIC에서 ln(n)이 곱해짐 — 데이터가 많을수록 복잡한 모델에 불리' },
            { sym: 'auto_arima', name: '자동 탐색', desc: 'pmdarima 라이브러리가 AIC/BIC 기준으로 최적 (p,d,q) 자동 선택' },
          ].map((p) => (
            <div key={p.sym} className="rounded-lg border border-border bg-card px-3 py-2">
              <span className="font-mono font-bold text-foreground text-xs">{p.sym}</span>
              <span className="text-muted-foreground ml-1.5 text-xs font-semibold">{p.name}</span>
              <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{p.desc}</div>
            </div>
          ))}
        </div>

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

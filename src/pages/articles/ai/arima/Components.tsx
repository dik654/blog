import ARIMAComponentsViz from './viz/ARIMAComponentsViz';
import M from '@/components/ui/math';

export default function Components() {
  return (
    <section id="components" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">AR(p), I(d), MA(q) 구성요소</h2>
      <div className="not-prose mb-6">
        <ARIMAComponentsViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>ARIMA(p, d, q) 통합 수식</h3>
        <M display>{"Y'_t = \\underbrace{c}_{\\text{상수항}} + \\underbrace{\\phi_1 Y'_{t-1} + \\cdots + \\phi_p Y'_{t-p}}_{\\text{AR(p): 과거 p개 값의 가중합}} + \\underbrace{\\varepsilon_t}_{\\text{현재 오차}} + \\underbrace{\\theta_1 \\varepsilon_{t-1} + \\cdots + \\theta_q \\varepsilon_{t-q}}_{\\text{MA(q): 과거 q개 오차의 가중합}}"}</M>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3 text-sm">
          {[
            { sym: 'AR(p)', name: '자기회귀', color: 'text-emerald-500', defs: 'φ₁...φₚ = 각 시차의 영향력 계수', desc: '과거 p개 시점의 값으로 현재를 예측 — "관성"을 포착' },
            { sym: 'I(d)', name: '차분', color: 'text-amber-500', defs: "Y'ₜ = Yₜ − Yₜ₋₁ (1차 차분)", desc: '비정상 시계열을 d번 차분하여 정상성 확보. 대부분 d=1~2로 충분' },
            { sym: 'MA(q)', name: '이동평균', color: 'text-sky-500', defs: 'θ₁...θq = 각 오차의 가중치', desc: '과거 q개 예측 오차로 보정 — "충격의 잔여 효과"를 모델링' },
          ].map((p) => (
            <div key={p.sym} className="rounded-lg border border-border bg-card px-3 py-2">
              <span className={`font-mono font-bold text-xs ${p.color}`}>{p.sym}</span>
              <span className="text-muted-foreground ml-1.5 text-xs font-semibold">{p.name}</span>
              <div className="text-xs text-muted-foreground/70 mt-0.5">{p.defs}</div>
              <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{p.desc}</div>
            </div>
          ))}
        </div>

        <h3>AR(p) - 자기회귀</h3>
        <p>
          현재 값을 <strong>과거 p개 시점의 값</strong>으로 예측<br />
          계수 φ는 각 시차의 영향력을 표현<br />
          정상성을 위해 특성방정식의 근이 단위원 밖에 있어야 함
        </p>

        <h3>I(d) - 적분 (차분)</h3>
        <p>
          비정상 시계열을 <strong>d번 차분</strong>하여 정상성 확보<br />
          대부분의 실제 시계열은 d=1 또는 d=2로 충분<br />
          과도한 차분은 정보 손실 야기 — ADF 검정으로 최소 d를 결정
        </p>

        <h3>MA(q) - 이동평균</h3>
        <p>
          현재 값을 <strong>과거 q개 시점의 예측 오차</strong>로 보정<br />
          AR이 "과거 값의 관성"을 포착한다면, MA는 "과거 충격의 잔여 효과"를 모델링<br />
          단기 변동성에 효과적
        </p>
      </div>
    </section>
  );
}

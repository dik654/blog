import ExplainedFormula from "@/components/ui/explained-formula";
import ArmaMemoryViz from "./viz/ArmaMemoryViz";

export default function Components() {
  return (
    <section id="components" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        p, d, q는 관측값과 innovation이 담당할 기억 범위를 정한다
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          차분된 series Zt가 준비되면 ARMA(p,q)는 현재 값을 과거 p개 관측값과
          현재·과거 q개 innovation으로 설명한다. Innovation εt는 rolling average가
          아니라 t−1까지의 정보로 예측하지 못한 새 충격이다. 따라서 AR은 series의
          관성과 mean reversion을, MA는 관측된 충격이 이후 예측에 남기는 흔적을
          모델링한다.
        </p>
      </div>

      <ArmaMemoryViz />

      <ExplainedFormula
        question="차분된 현재 값을 과거 관측의 관성과 과거 forecast error로 어떻게 분해할까?"
        idea={<>AR polynomial φ(B)는 Z의 과거를, MA polynomial θ(B)는 innovation의 과거를 필터링합니다. 두 polynomial로 쓰면 lag 구조와 stationarity·invertibility 조건을 같은 언어로 확인할 수 있습니다.</>}
        formula={String.raw`\begin{aligned}\operatorname{AR}_t&=\sum_{i=1}^{p}\phi_iZ_{t-i}\\\operatorname{MA}_t&=\varepsilon_t+\sum_{j=1}^{q}\theta_j\varepsilon_{t-j}\\Z_t&=c+\operatorname{AR}_t+\operatorname{MA}_t\\\phi(B)Z_t&=c+\theta(B)\varepsilon_t\end{aligned}`}
        terms={[
          { symbol: "Z_t=\Delta^dY_t", name: "modeled series", description: "d번 차분한 stationary representation입니다." },
          { symbol: "\phi_i", name: "AR coefficients", description: "과거 관측값이 현재 conditional mean에 주는 가중치입니다." },
          { symbol: "\theta_j", name: "MA coefficients", description: "과거 innovation이 현재 값에 남기는 가중치입니다." },
          { symbol: "\varepsilon_t", name: "innovation", description: "과거 정보에 조건부인 평균 0의 새 error입니다." },
        ]}
        assumptions={["Innovation은 serially uncorrelated하며 보통 constant variance를 가정합니다.", "AR polynomial의 root가 unit circle 밖에 있어야 causal stationarity, MA root가 밖에 있어야 invertible representation을 얻습니다."]}
        interpretation="p와 q는 기억 길이를 그대로 뜻하지 않습니다. 반복되는 AR dynamics는 p보다 긴 impulse response를 만들고, invertible MA는 관측 가능한 과거로 innovation을 복원하게 해 줍니다."
      />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Stationarity와 invertibility는 coefficient 크기만 보는 규칙이 아니다</h3>
        <p>
          AR(1)에서는 |φ₁|&lt;1이라는 단순 조건이 나오지만, 고차 ARMA에서는
          characteristic polynomial의 모든 root를 봐야 한다. Invertibility는
          서로 다른 MA coefficient가 같은 autocovariance를 만드는 비식별 문제를
          피하고 innovation을 past observations로 표현할 수 있게 한다. 직접 root
          constraint를 구현하기보다 statsmodels 같은 검증된 library가
          <code>enforce_stationarity</code>와 <code>enforce_invertibility</code>를
          어떻게 적용하는지 확인한다.
        </p>
      </div>
    </section>
  );
}

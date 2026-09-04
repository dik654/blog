import ExplainedFormula from "@/components/ui/explained-formula";
import TemporalValidationViz from "./viz/TemporalValidationViz";

export default function Modeling() {
  return (
    <section id="modeling" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        ACF와 AIC는 후보를 만들고 미래 구간과 residual이 결론을 낸다
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          시계열을 무작위로 섞으면 미래의 level과 event가 학습 구간으로 들어간다. Parameter 탐색 전에 cutoff를 고정해야 하는 이유다. 한 번의 holdout은 특정
          시기에 우연히 쉽거나 어려울 수 있어 forecast origin을 앞으로 이동시키는 rolling-origin evaluation을 사용한다. 각 fold에서는
          preprocessing, differencing order와 model fitting도 그 시점까지의 data로 다시 수행해야 leakage를 막을 수 있다.
        </p>
      </div>

      <div id="paper-ljung-box" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">논문 읽기 · Residual lack-of-fit</p>
        <p className="mt-2 text-sm font-semibold">On a Measure of Lack of Fit in Time Series Models</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Ljung과 Box는 여러 residual lag의 autocorrelation을 한꺼번에 검사하는 Box–Pierce statistic의 finite-sample 근사를
          개선했습니다. 논문의 결과가 진단하는 것은 적합된 시계열 모형과 선택한 lag 범위에서 남은 선형 serial dependence입니다. 작은 p-value는 누락된 구조의 신호일
          뿐 추가해야 할 order를 자동으로 정해 주지 않습니다. 큰 p-value 쪽도 마찬가지입니다. Variance 변화·비선형성· structural break가 없다는 증거까지는
          되지 못합니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://doi.org/10.1093/biomet/65.2.297" target="_blank" rel="noreferrer">원 논문의 statistic과 finite-sample 보정 보기</a>
      </div>

      <TemporalValidationViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>ACF와 PACF는 식별 규칙이 아니라 diagnostic이다</h3>
        <p>
          ACF(autocorrelation function)는 lag k까지 전파된 전체 correlation을, PACF(partial autocorrelation function)는
          그 사이 lag들의 선형 영향을 통제한 direct correlation을 본다. 이상적인 AR(p)에서는 PACF가 p 뒤에서, MA(q)에서는 ACF가 q 뒤에서 약해지는
          전형적 pattern이 있다. 다만 유한 표본, 계절성, ARMA 혼합에서는 cutoff가 선명하지 않다. Plot은 search space를 줄이는 heuristic으로 쓰고
          후보를 확정하는 oracle로 쓰지 않는다.
        </p>
      </div>

      <ExplainedFormula
        question="Likelihood가 좋아지는 만큼 parameter가 늘어나는 후보를 같은 기준으로 어떻게 비교할까?"
        idea={<>AIC와 BIC는 maximized log-likelihood에 complexity penalty를 더합니다. AIC는 parameter당 2, BIC는 sample size가 커질수록 log n만큼 벌점을 주어 서로 다른 목적의 근사 기준을 만듭니다.</>}
        formula={String.raw`\begin{aligned}\operatorname{AIC}&=-2\log\hat L+2k\\\operatorname{BIC}&=-2\log\hat L+k\log n\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}\operatorname{AIC}&=\underbrace{-2\log\hat L+2k}_{\text{로그 비용 변환}}\\\operatorname{BIC}&=\underbrace{-2\log\hat L+k\log n}_{\text{로그 비용 변환}}\end{aligned}`}
        operations={[
          { expression: String.raw`-2\log\hat L+2k`, annotation: ["확률이나 곱셈 규모를 더할 수 있는 log 비용으로 바꿉니다.","AIC와 BIC는 maximized","log-likelihood에 complexity","penalty를 더합니다."] },
          { expression: String.raw`-2\log\hat L+k\log n`, annotation: ["확률이나 곱셈 규모를 더할 수 있는 log 비용으로 바꿉니다.","AIC와 BIC는 maximized","log-likelihood에 complexity","penalty를 더합니다."] },
        ]}
        terms={[
          { symbol: "\\hat L", name: "maximized likelihood", description: "같은 observations와 likelihood family에서 적합한 model의 최대 likelihood입니다." },
          { symbol: "k", name: "estimated parameters", description: "AR·MA·trend·variance 등 실제 추정한 자유 parameter 수입니다." },
          { symbol: "n", name: "effective sample size", description: "차분과 missing 처리 뒤 likelihood에 기여한 관측 수와 구현 정의를 확인합니다." },
        ]}
        assumptions={["같은 target data와 comparable likelihood로 적합한 후보끼리 비교합니다.", "AIC·BIC의 절대값보다 후보 사이의 차이를 읽습니다."]}
        interpretation="작은 information criterion은 in-sample fit과 complexity의 균형이 낫다는 뜻입니다. 원하는 horizon의 out-of-sample forecast error가 최소라는 보장은 없으므로 temporal validation을 별도로 수행합니다."
      />

      <ExplainedFormula
        question="Residual 여러 lag에 설명되지 않은 autocorrelation이 남았는지 한 통계량으로 어떻게 확인할까?"
        idea={<>Ljung–Box statistic은 lag 1부터 h까지 residual autocorrelation의 제곱을 sample-size correction과 함께 누적합니다. 개별 spike가 아니라 여러 lag의 공동 lack-of-fit을 검정합니다.</>}
        formula={String.raw`Q(h)=n(n+2)\sum_{k=1}^{h}\frac{\hat\rho_k^2}{n-k}`}
        annotatedFormula={String.raw`Q(h)=\underbrace{n(n+2)\sum_{k=1}^{h}\frac{\hat\rho_k^2}{n-k}}_{\text{기준량당 비율}}`}
        operations={[
          { expression: String.raw`n(n+2)\sum_{k=1}^{h}\frac{\hat\rho_k^2}{n-k}`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","Ljung–Box statistic은 lag 1부터 h까지","residual autocorrelation의 제곱을","sample-size correction과 함께 누적합니다."] },
        ]}
        terms={[
          { symbol: "\\hat\\rho_k", name: "residual autocorrelation", description: "Fitted model의 residual에서 계산한 lag-k sample correlation입니다." },
          { symbol: "h", name: "diagnostic horizon", description: "공동으로 확인할 최대 lag이며 season과 sample size를 고려해 정합니다." },
          { symbol: "n", name: "residual sample size", description: "진단에 실제 사용된 residual 개수입니다." },
        ]}
        assumptions={["Null은 선택한 h까지 residual autocorrelation이 모두 0이라는 것입니다.", "ARMA parameter를 추정한 경우 chi-square 자유도 correction과 library convention을 확인해야 합니다."]}
        interpretation="작은 p-value는 남은 serial dependence의 신호지만 어떤 order를 추가할지는 알려 주지 않습니다. 큰 p-value도 variance 변화, nonlinearity와 structural break가 없음을 증명하지 않습니다."
      />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <a href="https://doi.org/10.1093/biomet/65.2.297" target="_blank" rel="noreferrer">Ljung–Box 원 논문</a>은
          Box–Pierce lack-of-fit test의 finite-sample approximation을 개선한다.
          실제 진단에서는 residual plot과 ACF, variance 변화, event 구간을 함께
          보고, point forecast와 prediction interval coverage도 rolling origin마다
          기록한다. Model-based interval이 좁다는 사실만으로 구조 변화가 잦은
          production series에서 calibration됐다고 결론 내리지 않는다.
        </p>
      </div>
    </section>
  );
}

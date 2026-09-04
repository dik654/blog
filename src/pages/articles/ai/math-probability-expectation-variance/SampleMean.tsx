import ExplainedFormula from "@/components/ui/explained-formula";
import BatchVarianceViz from "./viz/BatchVarianceViz";

export default function SampleMean() {
  return (
    <section id="sample-mean" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Sample mean: 관측한 일부로 distribution의 중심 추정하기</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none"><p>
            Population expectation을 정확히 합산할 수 없으면 sample을 뽑아 평균냅니다. 독립이고 같은 distribution에서 뽑은 sample의 평균은
            population mean에 대해 unbiased이며 variance는 sample 수 B로 나뉩니다. 이 조건이 mini-batch가 흔들림을 줄이는 가장 단순한
            이유입니다.
          </p></div>
      <BatchVarianceViz />
      <ExplainedFormula
        question="독립 sample B개의 평균은 왜 개별 sample보다 덜 흔들릴까요?"
        idea={<>합의 variance에서는 독립 변수 사이 covariance 항이 0이 됩니다. 합을 B로 나누면 variance에는 1/B²가 붙고, B개 variance를 더해 최종적으로 σ²/B가 남습니다.</>}
        formula={String.raw`\bar X_B=\frac1B\sum_{i=1}^B X_i,\qquad \mathbb E[\bar X_B]=\mu,\qquad \operatorname{Var}(\bar X_B)=\frac{\sigma^2}{B}`}
        terms={[{symbol:"B",name:"sample size",description:"평균에 함께 넣는 독립 관측의 개수입니다."},{symbol:"\\bar X_B",name:"sample mean",description:"관측한 B개 값의 산술평균입니다."},{symbol:"\\sigma^2/B",name:"mean variance",description:"독립·동일분포 조건에서 평균 추정치의 흔들림입니다."}]}
        assumptions={["X_i가 서로 독립이고 같은 mean μ와 finite variance σ²를 가집니다.","상관된 sample이면 covariance 항이 남아 1/B 감소가 그대로 성립하지 않습니다."]}
        interpretation="Batch size를 4배로 늘리면 variance는 1/4, standard deviation은 1/2가 됩니다. 흔들림이 4배 줄어드는 것은 아닙니다."
      />
      <div className="prose prose-neutral dark:prose-invert max-w-none"><h3>큰 수의 법칙이 말하는 것과 말하지 않는 것</h3><p>
            Sample 수가 커질수록 sample mean이 population mean에서 크게 벗어날 확률이 작아진다는 것이 큰 수의 법칙의 핵심입니다. 유한한 B에서 정확히
            같아진다는 뜻은 아닙니다. 특정 오차 안에 반드시 들어온다거나 데이터가 독립이 아닌 상황을 자동으로 해결한다는 뜻도 아닙니다.
          </p></div>
      <ExplainedFormula
        question="Sample mean이 population mean에 가까워진다는 말을 확률로 어떻게 확인할까요?"
        idea={<>독립 sample 평균의 variance σ²/B에 Chebyshev inequality를 적용합니다. 고정한 오차 ε보다 크게 벗어날 probability의 상한이 B와 함께 0으로 줄면 확률수렴을 얻습니다.</>}
        formula={String.raw`P\!\left(|\bar X_B-\mu|\ge\varepsilon\right)\le\frac{\operatorname{Var}(\bar X_B)}{\varepsilon^2}=\frac{\sigma^2}{B\varepsilon^2}\xrightarrow[B\to\infty]{}0`}
        terms={[
          { symbol: "\\varepsilon", name: "error tolerance", description: "Sample mean과 population mean의 차이를 크게 본다고 정한 양수 기준입니다." },
          { symbol: "P(|\\bar X_B-\\mu|\\ge\\varepsilon)", name: "failure probability", description: "평균 추정 오차가 허용 범위 밖에 있을 probability입니다." },
          { symbol: "B\\to\\infty", name: "asymptotic limit", description: "유한한 특정 batch가 아니라 sample 수를 끝없이 늘리는 극한입니다." },
        ]}
        assumptions={["여기서 쓴 간단한 증명은 Xᵢ가 i.i.d.이고 finite mean μ와 finite variance σ²를 가진다고 둡니다.", "상한은 실제 probability와 같을 필요가 없으며 유한 B의 성공을 보장하지 않습니다."]}
        interpretation="B가 커지면 고정된 ε 밖에 있을 가능성의 상한이 작아집니다. 이는 ‘B=어떤 값이면 반드시 정확하다’는 finite-sample 보장이 아니라 asymptotic statement입니다."
      />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>증명 아이디어와 실패하는 경우</h3>
        <p>
          독립 sample의 평균은 expectation이 μ로 유지되면서 variance가 σ²/B로 줄어듭니다.
          평균이 μ에서 ε 이상 벗어날 probability는 위의 Chebyshev bound로 제한되므로
          B가 커질수록 0에 가까워집니다. 반면 모든 Xᵢ가 사실상 같은
          관측을 복제해 완전히 상관되어 있다면 평균을 몇 번 써도 새로운 정보가 늘지 않아
          variance가 줄지 않습니다. Cauchy distribution처럼 mean 자체가 정의되지 않는
          경우에도 이 버전의 큰 수의 법칙을 그대로 적용할 수 없습니다.
        </p>
      </div>
    </section>
  );
}

import ExplainedFormula from "@/components/ui/explained-formula";

export default function Variance() {
  return (
    <section id="variance" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Variance: expectation 주변에서 얼마나 흔들리는가</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none"><p>
            평균만 같아도 distribution의 불안정성은 다를 수 있습니다. Variance는 각 값이 expectation에서 떨어진 거리를 제곱해 평균냅니다. 제곱하는 이유는
            양·음 편차가 상쇄되지 않게 하고 큰 편차에 더 큰 가중치를 주기 위해서입니다. X를 초 단위로 잰다면 variance의 단위는 초²이고 제곱근인 standard
            deviation은 다시 초 단위입니다.
          </p></div>
      <ExplainedFormula
        question="앞면 개수 X는 expectation 1 주변에서 얼마나 흩어져 있을까요?"
        idea={<>각 값에서 평균 1을 빼고 제곱한 뒤 probability로 가중합니다. Standard deviation은 variance의 단위를 원래 X와 맞추기 위해 제곱근을 취합니다.</>}
        formula={String.raw`\operatorname{Var}(X)=\mathbb E[(X-\mu)^2]=\frac14(0-1)^2+\frac12(1-1)^2+\frac14(2-1)^2=\frac12`}
        terms={[{symbol:"\\mu",name:"mean",description:"X의 expectation이며 편차를 재는 중심입니다."},{symbol:"(X-\\mu)^2",name:"squared deviation",description:"중심에서 떨어진 거리의 부호를 없애고 큰 편차를 강조합니다."},{symbol:"\\sqrt{\\operatorname{Var}(X)}",name:"standard deviation",description:"X와 같은 단위로 읽는 대표적인 흔들림 크기입니다."}]}
        assumptions={["두 번째 moment가 유한해야 variance가 유한합니다.","Variance 0은 random variable이 probability 1로 한 값에 고정된 경우입니다."]}
        interpretation="Variance는 1/2 앞면²이고 standard deviation은 약 0.707 앞면입니다. 평균 1만으로는 이 흔들림을 알 수 없습니다."
      />
      <ExplainedFormula
        question="모집단의 분산과 표본으로 모집단 분산을 추정하는 식은 왜 분모가 다를까요?"
        idea={<>유한한 모집단 전체를 알고 있으면 실제 중심 μ에서의 제곱편차를 N으로 나눕니다. 표본만 있을 때는 같은 표본으로 추정한 평균 X̄가 제곱편차를 작게 만들므로, i.i.d. 표본에서는 n−1로 나누어 그 평균적인 축소를 보정합니다.</>}
        formula={String.raw`\begin{aligned}
\sigma^2&=\frac1N\sum_{i=1}^N(x_i-\mu)^2,\\
\sum_{i=1}^n(X_i-\bar X)^2&=\sum_{i=1}^n(X_i-\mu)^2-n(\bar X-\mu)^2,\\
\mathbb E[\tilde s^2]&=\mathbb E\!\left[\frac1n\sum_{i=1}^n(X_i-\bar X)^2\right]=\frac{n-1}{n}\sigma^2,\\
\mathbb E[s^2]&=\mathbb E\!\left[\frac1{n-1}\sum_{i=1}^n(X_i-\bar X)^2\right]=\sigma^2
\end{aligned}`}
        terms={[
          { symbol: "\\sigma^2", name: "population variance", description: "모집단 전체와 실제 population mean μ를 알 때의 분산입니다." },
          { symbol: "\\tilde s^2", name: "biased sample variance", description: "표본평균 주변 제곱편차를 n으로 나눈 값이며 그 expectation은 (n−1)σ²/n입니다." },
          { symbol: "s^2", name: "unbiased sample variance", description: "i.i.d. 표본에서 expectation이 σ²가 되도록 n−1로 나눈 추정량입니다." },
          { symbol: "n-1", name: "degrees of freedom", description: "편차의 합이 0이라는 제약 뒤 독립적으로 달라질 수 있는 편차의 개수입니다." },
        ]}
        assumptions={["X₁,…,Xₙ은 같은 population에서 독립적으로 뽑고 finite variance를 가집니다.", "n−1 보정은 population variance를 unbiased하게 추정하려는 목적입니다. 현재 데이터 자체의 평균 제곱편차나 ML loss를 정의할 때 언제나 n−1을 써야 한다는 규칙은 아닙니다.", "n이 1이면 s²는 정의되지 않습니다."]}
        interpretation="항등식 오른쪽 첫 합의 expectation은 nσ²이고, 두 번째 항은 nVar(X̄)=σ²이므로 표본평균 주변 제곱편차 합의 expectation은 (n−1)σ²입니다. 관측값 1,2,3의 제곱편차 합은 2이므로, 이 셋이 모집단 전체라면 variance는 2/3이고 더 큰 모집단에서 뽑은 표본이라면 unbiased estimate는 2/(3−1)=1입니다. ‘Unbiased’는 이번 숫자가 참값과 같다는 뜻이 아니라 반복 표집한 추정량의 expectation에 관한 성질입니다."
      />
    </section>
  );
}

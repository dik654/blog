import ExplainedFormula from "@/components/ui/explained-formula";

export default function ProductRule() {
  return (
    <section id="log-identities" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">곱의 로그가 합이 되는 이유는 지수의 적용 횟수가 더해지기 때문이다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>u=aᵐ, v=aⁿ이라고 놓으면 uv=aᵐ⁺ⁿ입니다. 양변에 밑 a의 로그를 취하면 m+n이 남으므로 logₐ(uv)=logₐu+logₐv가 됩니다. 이 성질 덕분에 sample별 확률의 곱을 loss의 합으로 바꿀 수 있습니다.</p>
      </div>
      <ExplainedFormula
        question="여러 양수를 곱한 값을 로그 공간에서는 어떻게 계산하는가?"
        idea={<>각 값이 밑 a를 몇 번 적용한 결과인지 따로 구한 뒤 그 횟수를 더합니다. 나눗셈은 음의 지수 때문에 뺄셈으로 바뀝니다.</>}
        formula={String.raw`\log_a(uv)=\log_a u+\log_a v,\qquad \log_a\!\left(\frac uv\right)=\log_a u-\log_a v`}
        terms={[
          { symbol: "u,v", name: "positive inputs", description: "곱하거나 나눌 0보다 큰 값입니다." },
          { symbol: String.raw`\log_a u`, name: "u의 log-scale 위치", description: "밑 a를 기준으로 u가 놓인 지수 좌표입니다." },
          { symbol: "+,-", name: "additive operations", description: "원래 공간의 곱과 나눗셈이 log 공간에서 바뀐 연산입니다." },
        ]}
        assumptions={["u와 v는 모두 양수이고 모든 logarithm의 밑은 같습니다.", "log(u+v)=log u+log v는 일반적으로 성립하지 않습니다."]}
        interpretation="0.5³의 log는 3log0.5입니다. 독립 사건의 joint probability를 log-likelihood 합으로 바꾸는 계산이 바로 이 규칙입니다."
      />
    </section>
  );
}

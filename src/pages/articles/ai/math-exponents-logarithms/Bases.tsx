import ExplainedFormula from "@/components/ui/explained-formula";

export default function Bases() {
  return (
    <section id="log-bases" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">로그의 밑은 결론보다 단위와 scale을 바꾼다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>밑 2는 정보량을 bit로, 자연상수 e는 nat으로 나타냅니다. 밑을 바꾸면 모든 값에 같은 양의 상수가 곱해지므로, 다른 항의 weight를 그대로 둔다는 조건에서 단독 objective의 minimizer는 같지만 gradient scale과 learning-rate 감각은 달라질 수 있습니다.</p>
      </div>
      <ExplainedFormula
        question="밑 b로 계산한 logarithm을 밑 a로 어떻게 바꾸는가?"
        idea={<>x=bʸ를 같은 기준 a의 지수로 표현하고 두 로그의 비율을 취합니다.</>}
        formula={String.raw`\log_b x=\frac{\log_a x}{\log_a b}`}
        terms={[
          { symbol: "a,b", name: "old·new bases", description: "0보다 크고 1이 아닌 두 기준 배율입니다." },
          { symbol: "\log_a b", name: "scale conversion", description: "두 log 단위 사이를 바꾸는 고정 상수입니다." },
          { symbol: "x", name: "positive value", description: "밑을 바꿔도 원래 값은 변하지 않습니다." },
        ]}
        assumptions={["모든 logarithm은 실수 범위에서 정의되도록 x>0이어야 합니다.", "여러 loss 항을 합칠 때 한 항의 밑만 바꾸면 상대 weight가 바뀔 수 있습니다."]}
        interpretation="log₂x=ln x/ln2입니다. 같은 확률 순서를 유지하지만 수치 단위는 bit와 nat으로 달라집니다."
      />
    </section>
  );
}

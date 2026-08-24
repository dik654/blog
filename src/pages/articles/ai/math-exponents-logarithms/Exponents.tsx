import ExplainedFormula from "@/components/ui/explained-formula";

export default function Exponents() {
  return (
    <section id="exponents" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">지수는 같은 배율을 몇 번 적용했는지 기록한다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>2를 세 번 곱하면 8이고 이를 2³으로 씁니다. 지수의 핵심은 숫자를 크게 만드는 데 있지 않습니다. 같은 밑을 곱할 때 적용 횟수가 더해진다는 구조가 이후 로그의 합 규칙을 만듭니다.</p>
      </div>
      <ExplainedFormula
        question="같은 배율 a를 m번 적용한 뒤 n번 더 적용하면 전체 적용 횟수는 얼마인가?"
        idea={<>앞의 반복 곱셈과 뒤의 반복 곱셈을 한 줄로 이어 붙이면 a가 모두 m+n번 나타납니다.</>}
        formula={String.raw`a^m a^n=a^{m+n}`}
        annotatedFormula={String.raw`a^m a^n=\underbrace{a^{m+n}}_{\text{combined count 계산}}`}
        operations={[
          { expression: String.raw`a^{m+n}`, annotation: ["combined count이(가) 식의 결과에 기여하는 방식을","계산합니다.","앞의 반복 곱셈과 뒤의 반복 곱셈을 한 줄로 이어 붙이면 a가","모두 m+n번 나타납니다."] },
        ]}
        terms={[
          { symbol: "a", name: "base · 밑", description: "반복해서 곱하는 양수 배율입니다." },
          { symbol: "m,n", name: "exponents · 지수", description: "각 구간에서 배율을 적용한 횟수입니다." },
          { symbol: "m+n", name: "combined count", description: "두 곱셈 구간을 이었을 때의 전체 반복 횟수입니다." },
        ]}
        assumptions={["정수 지수의 반복 곱셈에서 출발한 식이며 실수 지수는 연속적인 확장으로 정의합니다.", "로그까지 연결할 때는 밑 a>0, a≠1을 사용합니다."]}
        interpretation="2³×2²=8×4=32=2⁵입니다. 밑이 서로 다르면 지수만 더할 수 없습니다."
      />
    </section>
  );
}

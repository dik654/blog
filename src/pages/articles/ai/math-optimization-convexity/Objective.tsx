import ExplainedFormula from "@/components/ui/explained-formula";

export default function Objective() {
  return (
    <section id="objective" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Objective와 minimizer: 함수값과 위치를 구분하기
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Objective는 더 작게 또는 더 크게 만들고 싶은 scalar 함수를 가리킵니다. Argmin은 가장 작은 함수값 자체가 아니라 그 값을 만드는 입력 위치들의 집합입니다.
          Local minimum과 global minimum도 이 위치가 어느 범위에서 가장 좋은지에 따라 구분합니다.
        </p>
      </div>
      <ExplainedFormula
        question="f(x)=(x−3)²+2의 가장 작은 값과 그 위치는 각각 무엇일까요?"
        idea={
          <>
            제곱은 항상 0 이상이므로 x−3이 0일 때 가장 작습니다. 위치와 그
            위치에서의 함수값을 따로 적습니다.
          </>
        }
        formula={String.raw`\begin{aligned}
          x^*&=\operatorname*{arg\,min}_x f(x)=3 \\
          f^*&=\min_x f(x)=f(3)=2
        \end{aligned}`}
        terms={[
          {
            symbol: "f",
            name: "objective",
            description: "선택 변수 x의 품질을 scalar로 평가하는 함수입니다.",
          },
          {
            symbol: "x^*",
            name: "minimizer",
            description: "Objective의 가장 작은 값을 만드는 입력 위치입니다.",
          },
          {
            symbol: "f^*",
            name: "minimum value",
            description: "Minimizer에서 objective가 갖는 가장 작은 함수값입니다.",
          },
        ]}
        assumptions={[
          "여기서는 x가 모든 실수라는 unconstrained 문제입니다.",
          "Minimizer가 존재하지 않거나 여러 개일 수도 있습니다.",
        ]}
        interpretation="정답은 위치 x*=3과 값 f*=2입니다. argmin과 min을 같은 숫자로 쓰면 안 됩니다."
      />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>허용 domain이 바뀌면 minimizer도 바뀝니다</h3>
        <p>
          같은 <code>f(x)=(x−3)²+2</code>라도 <code>x∈[0,2]</code>만
          허용하면 x=3은 선택할 수 없습니다. 이 구간에서 3에 가장 가까운
          경계 x=2가 minimizer이고 minimum value는 3입니다. 따라서
          optimization 문제는 objective만이 아니라 domain과 constraint까지
          포함해야 완결됩니다.
        </p>
      </div>
    </section>
  );
}

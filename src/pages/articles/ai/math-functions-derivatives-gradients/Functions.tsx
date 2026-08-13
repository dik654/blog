import ExplainedFormula from "@/components/ui/explained-formula";

export default function Functions() {
  return (
    <section id="functions" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">함수와 합성: 입력이 출력을 정하는 규칙</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          함수는 입력 하나가 주어졌을 때 출력 하나를 정하는 규칙입니다. 자판기에서 버튼과
          음료의 대응을 생각하면 됩니다. 같은 입력에 서로 다른 출력을 임의로 내놓는다면
          함수가 아닙니다. 신경망의 한 layer도 입력 vector를 받아 출력 vector를 정하는 함수입니다.
        </p>
        <p>
          함수 합성은 첫 함수의 출력을 다음 함수의 입력으로 넘기는 일입니다. 코드의
          <code>outer(inner(x))</code>와 같습니다. 여러 layer를 연결한 신경망과 chain rule은
          모두 이 합성 구조에서 출발합니다.
        </p>
      </div>
      <ExplainedFormula
        question="두 함수를 차례로 적용하면 실제 계산은 어떤 순서로 진행될까요?"
        idea={<>안쪽 함수가 먼저 입력을 바꾸고, 바뀐 중간값을 바깥 함수가 다시 처리합니다. 기호를 읽는 순서도 안쪽에서 바깥쪽입니다.</>}
        formula={String.raw`g(x)=3x+1,\quad f(u)=u^2\qquad\Longrightarrow\qquad (f\circ g)(x)=f(g(x))=(3x+1)^2`}
        terms={[
          { symbol: "x", name: "원래 입력", description: "전체 합성 함수에 들어가는 시작값입니다." },
          { symbol: "u=g(x)", name: "중간값", description: "안쪽 함수가 만든 출력이자 바깥 함수의 입력입니다." },
          { symbol: "f\\circ g", name: "function composition", description: "g를 먼저 적용하고 f를 이어서 적용한다는 뜻입니다." },
        ]}
        assumptions={["각 입력에서 다음 함수가 받을 수 있는 출력이 정해져 있어야 합니다.", "f∘g와 g∘f는 일반적으로 같은 함수가 아닙니다."]}
        interpretation="x=2이면 g(2)=7을 먼저 구하고 f(7)=49를 구합니다. f를 먼저 적용하는 g(f(2))=13과는 결과가 다릅니다."
      />
    </section>
  );
}

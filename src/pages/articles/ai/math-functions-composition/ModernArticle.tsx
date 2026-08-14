import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import FunctionCompositionViz from "./FunctionCompositionViz";

const OPENSTAX = "https://openstax.org/books/precalculus-2e/pages/1-4-composition-of-functions";
const DEEP_LEARNING_BOOK = "https://www.deeplearningbook.org/contents/mlp.html";

export default function MathFunctionsCompositionArticle() {
  return (
    <article className="space-y-16">
      <section id="overview" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">00 · 입력과 출력부터</p>
          <h2 className="mt-2 text-2xl font-bold">함수는 허용된 입력 하나마다 출력 하나를 정하는 규칙이다</h2>
        </header>
        <p className="text-lg leading-8">
          함수라는 말을 들으면 먼저 복잡한 식을 떠올리기 쉽습니다. 하지만 출발점은
          더 단순합니다. 입력을 하나 고르면 규칙이 출력 하나를 정합니다. 사진 한 장을
          class score로 바꾸는 neural network도, 섭씨 온도를 화씨로 바꾸는 계산도 이
          입력→출력 관계로 읽을 수 있습니다.
        </p>
        <Term
          name="Input"
          shape="x"
          meaning="규칙에 넣어 주는 값입니다."
          example="g(x)=3x+1에서 x=2를 넣습니다."
          boundary="입력의 이름과 실제 허용 shape·범위는 별개이므로 함께 확인합니다."
        />
        <Term
          name="Output"
          shape="g(x)"
          meaning="입력에 규칙을 적용해 얻은 값입니다."
          example="x=2이면 g(2)=7입니다."
          boundary="서로 다른 입력이 같은 출력으로 모여도 함수일 수 있습니다."
        />
        <Term
          name="Function"
          shape="g:X→U"
          meaning="Domain X의 허용 입력 하나마다 codomain U의 출력 하나를 정하는 mapping입니다."
          example="1, 2, 3을 각각 4, 7, 10으로 보내는 g(x)=3x+1입니다."
          boundary="같은 입력을 넣을 때 임의로 서로 다른 출력이 나오면 deterministic function 계약이 아닙니다."
        />
      </section>

      <section id="shape" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">01 · 값보다 먼저 형태</p>
          <h2 className="mt-2 text-2xl font-bold">Domain과 codomain은 함수가 받을 값과 돌려줄 값의 계약이다</h2>
        </header>
        <Term
          name="Domain"
          shape="X"
          meaning="함수에 넣어도 된다고 약속한 입력들의 집합입니다."
          example="제곱근을 실수 함수로 다룬다면 √x의 domain은 x≥0입니다."
          boundary="식에 숫자를 써 넣을 수 있다는 사실만으로 그 값이 domain에 속하지는 않습니다."
        />
        <Term
          name="Codomain"
          shape="U"
          meaning="함수가 출력한다고 선언한 값의 종류와 shape입니다."
          example="Image tensor→10개 class score라면 codomain shape는 ℝ¹⁰입니다."
          boundary="실제로 나온 값들의 집합인 range와 선언된 codomain을 같은 말로 쓰지 않습니다."
        />
        <p>
          두 함수를 연결하려면 첫 함수의 output이 다음 함수의 domain에 들어가야 합니다.
          Tensor program에서는 이 조건이 dtype·axis·shape 계약으로 드러납니다.
        </p>
        <FunctionCompositionViz />
      </section>

      <section id="composition" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">02 · 두 규칙을 연결</p>
          <h2 className="mt-2 text-2xl font-bold">Function composition은 앞 output을 다음 input으로 넘기는 실행 순서다</h2>
        </header>
        <p>
          <code>f(g(x))</code>에서는 괄호 안의 <code>g</code>가 먼저 실행됩니다. 그
          결과를 중간값 <code>u</code>라고 적으면 각 함수의 책임과 shape를 따로 검사할 수
          있습니다.
        </p>
        <ExplainedFormula
          question="g(x)=3x+1의 출력을 f(u)=u²에 넘기면 x=2는 어떤 경로를 지나나요?"
          idea={<>안쪽 함수가 중간값을 먼저 만들고, 바깥 함수는 그 중간값만 입력으로 받습니다. 합성 기호는 이 실행 순서를 한 이름으로 묶습니다.</>}
          formula={String.raw`\begin{aligned}g(2)&=7\\(f\circ g)(2)&=f(7)=49\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}g(2)&=\underbrace{7}_{\substack{\text{안쪽 규칙이}\text{중간값 생성}}}\\[4pt]f(7)&=\underbrace{49}_{\substack{\text{바깥 규칙이}\text{중간값을 소비}}}\\[4pt](f\circ g)(2)&=\underbrace{f(g(2))}_{\substack{\text{두 실행을}\text{하나의 합성으로 표시}}}\end{aligned}`}
          operations={[
            { expression: String.raw`g(2)`, annotation: ["원래 input을", "안쪽 함수에 먼저 적용"] },
            { expression: String.raw`f(7)`, annotation: ["중간 output을", "바깥 함수의 input으로 전달"] },
            { expression: String.raw`f\circ g`, annotation: ["g 다음 f라는", "실행 순서를 한 이름으로 묶음"] },
          ]}
          terms={[
            { symbol: "2", name: "원래 입력", description: "전체 pipeline이 처음 받는 값입니다." },
            { symbol: "7", name: "중간값", description: "g의 output이자 f의 input입니다." },
            { symbol: String.raw`f\circ g`, name: "합성 함수", description: "g를 먼저, f를 다음에 적용합니다." },
          ]}
          assumptions={["g의 output 7이 f의 domain에 속합니다.", "이 예는 deterministic scalar function이며 stateful·random function은 추가 실행 상태를 기록해야 합니다."]}
          interpretation="함수 합성은 식을 붙이는 문법이 아니라 output 계약과 input 계약을 연결하는 실행입니다."
        />
      </section>

      <section id="boundaries" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">03 · 조합의 경계</p>
          <h2 className="mt-2 text-2xl font-bold">합성은 결합 가능하지만 순서를 마음대로 바꿀 수는 없다</h2>
        </header>
        <div className="space-y-4">
          <Boundary title="Order" detail="f(g(2))=49지만 g(f(2))=13입니다. Composition은 일반적으로 commutative하지 않습니다." />
          <Boundary title="Shape" detail="g가 길이 3 vector를 내는데 f가 scalar만 받는다면 중간 adapter 없이는 합성할 수 없습니다." />
          <Boundary title="Defined input" detail="g(x)가 f의 domain 밖 값을 만들면 전체 합성은 그 x에서 정의되지 않습니다." />
        </div>
        <p>
          다음 글에서는 함수가 입력의 작은 변화에 얼마나 민감한지
          <a className="ml-1 font-semibold text-primary underline" href="/ai/math-functions-derivatives-gradients">derivative</a>로
          측정하고, 이어서 여러 입력 좌표의 민감도를
          <a className="ml-1 font-semibold text-primary underline" href="/ai/math-gradients-jacobians">gradient와 Jacobian</a>으로 묶습니다.
        </p>
        <div id="paper-function-composition"><CitationBlock source="OpenStax Precalculus 2e · Composition of Functions" citeKey={1} href={OPENSTAX}><Evidence problem="여러 함수의 input·output을 연결해 새 함수를 계산하는 문제" contribution="Composition 표기, 평가 순서와 domain 제약을 worked example로 설명" assumptions="교재가 선언한 real-valued function과 domain 조건" scope="Precalculus 수준의 function composition" notClaim="Neural network의 학습 가능성이나 모든 tensor shape를 보장하지 않음" /></CitationBlock></div>
        <div id="paper-network-composition"><CitationBlock source="Deep Learning Book · Deep Feedforward Networks" citeKey={2} href={DEEP_LEARNING_BOOK}><Evidence problem="여러 parameterized function을 연결해 prediction을 만드는 구조를 설명" contribution="Feedforward network를 함수 합성과 computational graph 관점으로 정리" assumptions="교재가 둔 model·objective·differentiability 조건" scope="Feedforward network의 구조적 설명" notClaim="깊은 모든 model의 optimization·generalization 우월성을 보장하지 않음" /></CitationBlock></div>
        <ContentBoundary article="math-functions-composition" />
      </section>
    </article>
  );
}

function Term({ name, shape, meaning, example, boundary }: { name: string; shape: string; meaning: string; example: string; boundary: string }) {
  return <div className="border-l border-primary/70 pl-5"><p className="text-xs font-bold text-primary">용어</p><h3 className="mt-1 text-lg font-bold">{name}</h3><p className="mt-2 font-mono text-base font-black">{shape}</p><p className="mt-3 leading-7">{meaning}</p><p className="mt-2 text-sm leading-6 text-muted-foreground"><strong className="text-foreground">작은 예:</strong> {example}</p><p className="mt-2 text-sm leading-6 text-muted-foreground"><strong className="text-foreground">경계:</strong> {boundary}</p></div>;
}
function Boundary({ title, detail }: { title: string; detail: string }) { return <div className="grid gap-2 border-l border-border pl-4 sm:grid-cols-[7rem_1fr]"><p className="font-mono text-xs font-black text-primary">{title}</p><p className="text-sm leading-6">{detail}</p></div>; }
function Evidence({ problem, contribution, assumptions, scope, notClaim }: { problem: string; contribution: string; assumptions: string; scope: string; notClaim: string }) { return <div className="space-y-2"><p><strong>문제:</strong> {problem}</p><p><strong>핵심 아이디어:</strong> {contribution}</p><p><strong>중요 가정:</strong> {assumptions}</p><p><strong>근거 범위:</strong> {scope}</p><p><strong>일반화 금지:</strong> {notClaim}</p></div>; }

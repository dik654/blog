import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import FunctionCompositionViz from "./FunctionCompositionViz";

const OPENSTAX = "https://openstax.org/books/precalculus-2e/pages/1-4-composition-of-functions";
const CALCULUS = "https://openstax.org/books/calculus-volume-1/pages/1-1-review-of-functions";
const DEEP_LEARNING_BOOK = "https://www.deeplearningbook.org/contents/mlp.html";

export default function MathFunctionsCompositionArticle() {
  return (
    <article className="space-y-16">
      <section id="overview" data-teach-level="S" className="space-y-6">
        <h2 className="text-2xl font-bold">1 · 계산 두 개를 연결할 때 무엇을 확인해야 할까</h2>
        <p className="text-lg leading-8">
            숫자를 바꾸는 규칙은 간단해도 여러 규칙을 연결하면 순서 하나로 답이 달라집니다. 어떤 값을 먼저 계산하는지와 그 결과를 다음 계산에 넣어도 되는지를 알면 긴 수식도 작은
            계산들의 연결로 읽을 수 있습니다.
          </p>
        <p>이 글의 목표는 두 계산을 차례로 따라가며 중간에 전달하는 값과 허용 범위를 설명하는 것입니다. 그 연결을 이해하면 사진에서 점수를 만드는 모델도 같은 방식으로 읽기 시작할 수 있습니다. 계산을 연결한다는 사실만으로 모델이 잘 학습되거나 정확해지는 것은 아닙니다.</p>
        <p>먼저 밖에서 보이는 결과를 확인하고, 그 결과를 만드는 두 단계를 열어 보겠습니다.</p>
      </section>
      <section id="black-box" data-teach-level="B" className="space-y-6">
        <h2 className="text-2xl font-bold">2 · 밖에서는 2가 들어가 49가 나온다</h2>
        <p>계산 장치 하나에 2를 넣었더니 49가 나왔다고 합시다(가정). 같은 규칙을 그대로 적용하면 다시 2를 넣어도 49가 나옵니다. 바깥에서는 시작값과 결과만 보이므로, 안쪽에서 몇 번 계산했는지는 아직 알 수 없습니다.</p>
        <p>
            이 장치가 받을 값은 실수 하나이고 돌려주는 값도 실수 하나라고 약속합니다(가정). 숫자 세 개를 한꺼번에 넣으려면 그 세 개를 각각 처리할지 하나로 합칠지 별도 규칙이
            필요합니다. 값의 개수와 의미를 정해야 계산을 실행할 수 있습니다.
          </p>
        <p>입구와 출구의 약속이 잡혔습니다. 이제 49가 우연한 답이 아닌지 중간값으로 확인할 차례입니다.</p>
      </section>
      <section id="case" data-teach-level="0" className="space-y-6">
        <h2 className="text-2xl font-bold">3 · 2를 세 배 하고 1을 더한 뒤 제곱한다</h2>
        <p>안에는 두 규칙이 있습니다. 먼저 받은 수를 세 배 하고 1을 더합니다. 시작값 2는 3×2+1=7이 됩니다. 다음 규칙은 받은 수를 자기 자신과 곱하므로 7×7=49가 됩니다.</p>
        <p>두 규칙 자체는 OpenStax 교재의 사례와 같습니다. 확인할 시작값으로 2를 골랐습니다(가정). 바깥 결과만 확인하면 49만 남지만, 두 단계로 나누면 첫 계산이 7을 만들었는지와 두 번째 계산이 그 7을 받았는지를 따로 검사할 수 있습니다.</p>
        <p>2→7→49라는 경로를 기억해 두세요. 뒤에서 기호와 교재의 식을 읽을 때도 이 값을 그대로 추적합니다.</p>
      </section>
      <section id="picture" data-teach-level="1" className="space-y-6">
        <h2 className="text-2xl font-bold">4 · 앞 계산의 결과가 다음 계산의 재료가 된다</h2>
        <div className="grid gap-4 border-y border-border py-5 sm:grid-cols-3" aria-label="계산 순서">
          <p><strong>시작할 값은?</strong><br />2</p>
          <p><strong>세 배 하고 1을 더하면?</strong><br />7</p>
          <p><strong>받은 값을 제곱하면?</strong><br />49</p>
        </div>
        <p>두 번째 계산에 도착하는 수는 7입니다. 처음 넣었던 2를 다시 제곱하는 것이 아닙니다. 각 단계가 바로 앞 결과를 받는다는 약속 때문에 전체 결과가 49로 정해집니다.</p>
        <p>화살표의 순서는 확인했습니다. 중간 단계를 남겨 두는 이유도 살펴보겠습니다.</p>
      </section>
      <section id="need" data-teach-level="2" className="space-y-6">
        <h2 className="text-2xl font-bold">5 · 순서와 허용 범위를 따로 검사하는 이유</h2>
        <p>같은 2라도 제곱부터 하면 4가 되고, 그 뒤 세 배 하고 1을 더하면 13입니다. 49와 13의 차이는 계산 실수가 아니라 연결 순서의 차이입니다. 두 규칙의 목록만 가지고는 전체 계산을 정할 수 없습니다.</p>
        <p>
            또 다음 단계가 음이 아닌 수만 받는 규칙이라면 첫 단계가 만든 수가 그 범위에 드는지도 확인해야 합니다. 첫 계산이 성공했다고 다음 계산까지 항상 가능한 것은 아닙니다.
            중간값을 남겨 두면 어느 연결에서 약속을 어겼는지 찾을 수 있습니다.
          </p>
        <p>필요한 것은 시작값, 각 규칙, 중간 전달값, 허용 범위입니다. 이제 이 역할에 수학에서 쓰는 이름을 붙입니다.</p>
      </section>
      <section id="names" data-teach-level="3" className="space-y-6">
        <h2 className="text-2xl font-bold">6 · 계산 규칙은 함수, 규칙의 연결은 합성이다</h2>
        <div className="overflow-x-auto"><table className="w-full min-w-[640px] text-sm"><thead><tr><th className="p-3 text-left">앞에서 한 일</th><th className="p-3 text-left">이름과 표기</th><th className="p-3 text-left">이름의 뜻</th></tr></thead><tbody>
          {[['값 하나를 넣는다', '입력(input), x', '계산을 시작할 값'], ['규칙이 값 하나를 정한다', '함수(function), g', '허용된 입력마다 출력 하나를 대응시키는 규칙'], ['첫 규칙이 7을 만든다', '출력(output), g(x)', '그 규칙을 적용해 얻은 값'], ['넣어도 되는 값을 정한다', '정의역(domain)', '입력으로 허용한 집합'], ['결과가 속할 집합을 선언한다', '공역(codomain)', '출력이 속한다고 약속한 집합'], ['실제로 나올 수 있는 결과를 모은다', '치역(range)', '입력 전체를 넣었을 때 도달하는 값들의 집합'], ['앞 결과를 다음 규칙에 넣는다', '합성(composition), f∘g', 'g 다음에 f를 적용하는 새 함수']].map(row => <tr key={row[0]} className="border-t border-border">{row.map(cell => <td key={cell} className="min-w-[180px] p-3 align-top">{cell}</td>)}</tr>)}
        </tbody></table></div>
        <p>세 배 하고 1을 더하는 규칙을 g(x)=3x+1, 제곱하는 규칙을 f(u)=u²라고 쓰겠습니다. x와 u는 각 함수에 들어가는 값의 이름입니다. f에 7을 넣으면 u가 7이 됩니다.</p>
        <p>함수는 서로 다른 입력을 같은 출력으로 보내도 됩니다. f(2)=4이고 f(−2)=4여도 각 입력의 출력은 하나씩 정해져 있습니다. 같은 입력에 출력 두 개를 임의로 배정하는 경우와 구별합니다.</p>
        <p>이름을 알았으니 연결할 수 있는 값의 범위를 더 정확하게 적을 수 있습니다.</p>
      </section>
      <section id="shape" data-teach-level="4" className="space-y-6">
        <h2 className="text-2xl font-bold">7 · 선언한 출력 집합과 실제 나오는 값은 다르다</h2>
        <p>f를 실수에서 실수로 가는 제곱 함수라고 선언하면 정의역과 공역은 모두 실수 전체입니다. 그러나 제곱 결과는 음수가 될 수 없으므로 치역은 0 이상의 실수입니다. 공역은 허용한 출력 집합이고, 치역은 실제로 도달하는 부분입니다.</p>
        <p>
            실수 제곱근 √x는 입력 x≥0에서 정의됩니다. 음수를 넣어 실수 답이 나오지 않는 것은 선언된 정의역 밖의 값을 넣었기 때문입니다. 전체 입력 중 일부에서만 정의한 규칙을
            부분 함수라고 부를 때도 그 허용 범위를 먼저 적습니다.
          </p>
        <p>사진 한 장에서 점수 10개를 만드는 함수라면 사진 배열의 크기와 축 순서가 입력 조건이고, 공역은 길이 10의 실수 벡터인 ℝ¹⁰입니다(가정). 실제 모델이 ℝ¹⁰의 모든 값을 낼 수 있는지는 별개입니다. 프로그램에서는 자료형과 배열의 형태도 이 조건에 포함됩니다.</p>
        <p>
            우리 사례에서 g가 만든 7은 f가 받는 실수에 속합니다. 연결이 가능하다는 것을 확인했으니 그 7을 다음 계산에 실제로 넘깁니다.
          </p>
      </section>
      <section id="composition" data-teach-level="4" className="space-y-6">
        <h2 className="text-2xl font-bold">8 · 안쪽 g를 계산한 다음 바깥 f를 계산한다</h2>
        <p>f(g(2))를 읽을 때는 가장 안쪽부터 시작합니다. g가 원래 입력 2를 받고 7을 돌려줍니다. 이제 남은 계산은 f(7)이며, f가 7을 제곱해 49를 돌려줍니다.</p>
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
        <AlgorithmBlock title="합성을 계산하는 순서 (의사코드)" input={['x=2, g(x)=3x+1, f(u)=u²']} steps={[{code:'x가 g의 정의역에 속하는지 확인한다',note:'2는 허용한 실수입니다.'},{code:'u ← g(x)',note:'3×2+1=7'},{code:'u가 f의 정의역에 속하는지 확인한다',note:'7도 허용한 실수입니다.'},{code:'y ← f(u)',note:'7²=49'}]} output="y=49" />
        <FunctionCompositionViz />
        <p>그림의 1·2·3은 허용 입력 중 고른 값이고, 16·49·100도 가능한 출력 중 일부입니다. 집합 전체를 열거한 그림은 아닙니다. 같은 전달 규칙이 교재 원문에는 어떻게 적혀 있는지 확인하겠습니다.</p>
      </section>
      <section id="source" data-teach-level="5-6" className="space-y-6">
        <h2 className="text-2xl font-bold">9 · 교재의 합성 정의에 같은 2를 넣는다</h2>
        <p><a href={OPENSTAX} className="font-semibold text-primary underline">OpenStax Precalculus 2e §1.4의 Composition of Functions 정의 상자</a>는 앞 출력이 다음 입력이 되는 관계를 <code>(f∘g)(x)=f(g(x))</code>로 씁니다. 원문의 표기 그대로 x=2를 넣으면 왼쪽은 (f∘g)(2), 오른쪽은 f(g(2))=f(7)=49입니다. 이 정의 상자에는 식 번호가 붙어 있지 않습니다.</p>
        <p>같은 상자의 정의역 조건도 적용할 수 있습니다. x가 g의 정의역에 들고 g(x)가 f의 정의역에 들어야 합니다. 우리 경우에는 2와 7이 각각 그 조건을 만족합니다. 연결할 수 있는지를 확인한 뒤 값을 계산한다는 앞 절의 순서와 맞습니다.</p>
        <p><a href={CALCULUS} className="font-semibold text-primary underline">OpenStax Calculus Volume 1 §1.1의 Composition of Functions 도입</a>에는 f(x)=x², g(x)=3x+1이라는 같은 함수가 나옵니다. 원문은 f(g(x))=(3x+1)²와 g(f(x))=3x²+1을 나란히 계산합니다. 여기에 2를 넣어 각각 49와 13을 얻었습니다. 같은 절의 식 (1.1)은 순서를 반대로 적은 <code>(g∘f)(x)=g(f(x))</code>이므로, 기호만 보고 49를 대입하면 안 됩니다.</p>
        <p><a href={DEEP_LEARNING_BOOK} className="font-semibold text-primary underline">Deep Learning Book 6장, 164쪽</a>의 번호 없는 연결식은 <code>f(x)=f⁽³⁾(f⁽²⁾(f⁽¹⁾(x)))</code>입니다. 여기서 위첨자 (1)·(2)·(3)은 거듭제곱이 아니라 계산 순서의 번호입니다. 첫 규칙에 3x+1, 둘째에 제곱, 셋째에 받은 값을 그대로 돌려주는 규칙을 놓으면(가정) 같은 2가 7→49→49로 지나갑니다. 책의 식은 모델을 함수들의 연결로 읽는 근거이며, 이 숫자 예가 학습된 신경망이라는 뜻은 아닙니다.</p>
        <div id="paper-function-composition"><CitationBlock source="OpenStax Precalculus 2e · Composition of Functions" citeKey={1} href={OPENSTAX}><Evidence problem="여러 함수의 input·output을 연결해 새 함수를 계산하는 문제" contribution="Composition 표기, 평가 순서와 domain 제약을 worked example로 설명" assumptions="교재가 선언한 real-valued function과 domain 조건" scope="Precalculus 수준의 function composition" notClaim="Neural network의 학습 가능성이나 모든 tensor shape를 보장하지 않음" /></CitationBlock></div>
        <div id="paper-network-composition"><CitationBlock source="Deep Learning Book · Deep Feedforward Networks" citeKey={2} href={DEEP_LEARNING_BOOK}><Evidence problem="여러 parameterized function을 연결해 prediction을 만드는 구조를 설명" contribution="Feedforward network를 함수 합성과 computational graph 관점으로 정리" assumptions="교재가 둔 model·objective·differentiability 조건" scope="Feedforward network의 구조적 설명" notClaim="깊은 모든 model의 optimization·generalization 우월성을 보장하지 않음" /></CitationBlock></div>

        <p>원문의 이름과 표기가 바뀌어도 안쪽부터 값을 넘기는 순서는 같습니다. 끝으로 순서를 유지해도 연결이 실패하는 조건을 구별하겠습니다.</p>
      </section>
      <section id="boundaries" data-teach-level="7" className="space-y-6">
        <h2 className="text-2xl font-bold">10 · 괄호를 바꾸는 것과 실행 순서를 바꾸는 것은 다르다</h2>
        <p>g(f(2))는 f를 먼저 계산하므로 2→4→13입니다. f(g(2))의 49와 다릅니다. 이런 식으로 두 함수를 맞바꾸어도 결과가 같아야 교환법칙이 성립하는데, 일반적인 합성에서는 성립하지 않습니다.</p>
        <p>세 함수를 묶는 괄호만 바꾸면 어떨까요. f∘(g∘h)와 (f∘g)∘h는 둘 다 x→h(x)→g(h(x))→f(g(h(x))) 순서입니다. 모든 연결이 정의되는 입력에서 결과가 같으므로 결합법칙은 성립합니다. 계산 순서를 바꾸지 않고 묶는 위치만 바꾼 것입니다.</p>
        <p>
            g가 길이 3의 벡터를 돌려주는데 f가 실수 하나만 받는다면 사이에서 세 성분을 합하거나 한 성분을 고르는 규칙을 명시해야 합니다. 그 변환을 추가하면 전체 함수의 의미도
            달라집니다. 중간값이 다음 정의역 밖에 있을 때 임의의 값을 답으로 내는 대신, 입력을 제한하거나 변환 규칙을 새로 정합니다.
          </p>
        <p>프로그램이 난수나 저장된 상태, 시간에 따라 결과를 바꾼다면 x만으로 결과를 정할 수 없습니다. 같은 조건에서 한 결과를 정하는 함수로 기록하려면 난수 상태, 이전 상태와 필요한 외부 입력까지 입력에 포함하고 갱신된 상태도 출력으로 추적합니다. 이 글의 두 규칙에는 그런 추가 상태가 없습니다.</p>
        <p>다음 글에서는 같은 연결에서 시작값을 조금 바꿨을 때 결과가 얼마나 움직이는지 <a className="font-semibold text-primary underline" href="/cs/ai/math-functions-derivatives-gradients">미분과 연쇄법칙</a>으로 계산합니다. 여러 입력과 출력을 함께 다룰 때의 크기와 방향은 <a className="font-semibold text-primary underline" href="/cs/ai/math-gradients-jacobians">기울기와 야코비안</a>에서 확장합니다.</p>
        <ContentBoundary article="math-functions-composition" />
        <ol className="list-decimal space-y-3 pl-6">
          <li>2를 넣는 두 규칙의 순서만 바꾸면 49 대신 어떤 수가 나오며, 어느 중간값이 달라지나요? (답: 10절)</li>
          <li>제곱 함수의 공역을 실수 전체로 선언했는데 음수 결과는 나오지 않습니다. 함수의 약속이 깨진 것일까요? (답: 7절)</li>
          <li>f∘(g∘h)의 괄호를 (f∘g)∘h로 바꾸면 실제 적용 순서도 바뀔까요? (답: 10절)</li>
        </ol>
      </section>
    </article>
  );
}

function Evidence({ problem, contribution, assumptions, scope, notClaim }: { problem: string; contribution: string; assumptions: string; scope: string; notClaim: string }) { return <div className="space-y-2"><p><strong>문제:</strong> {problem}</p><p><strong>핵심 아이디어:</strong> {contribution}</p><p><strong>중요 가정:</strong> {assumptions}</p><p><strong>근거 범위:</strong> {scope}</p><p><strong>일반화 금지:</strong> {notClaim}</p></div>; }

import ExplainedFormula from "@/components/ui/explained-formula";
import GradientDirectionViz from "./viz/GradientDirectionViz";

export default function PartialGradient() {
  return (
    <section id="partial-gradient" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">편미분과 gradient: 손잡이가 여러 개일 때</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          입력이 여러 개면 한 번에 하나만 움직이고 나머지는 고정해 민감도를 잽니다. 이것이 partial derivative입니다. 모든 좌표의 partial derivative를 같은
          순서로 묶은 vector가 gradient입니다. gradient의 각 성분은 서로 다른 parameter 손잡이에 붙은 local slope입니다.
        </p>
      </div>
      <GradientDirectionViz />
      <ExplainedFormula
        question="f(x,y)=x²+3y는 (2,−1)에서 어느 방향으로 가장 빠르게 증가할까요?"
        idea={<>x만 움직인 기울기와 y만 움직인 기울기를 따로 구해 vector로 묶습니다. 임의의 unit direction과의 dot product가 그 방향의 변화율입니다.</>}
        formula={String.raw`\nabla f(x,y)=\left(\frac{\partial f}{\partial x},\frac{\partial f}{\partial y}\right)=(2x,3),\qquad \nabla f(2,-1)=(4,3)`}
        terms={[
          { symbol: String.raw`\partial f/\partial x`, name: "x partial derivative", description: "y를 고정하고 x만 바꿀 때의 local rate입니다." },
          { symbol: String.raw`\nabla f`, name: "gradient", description: "모든 coordinate의 partial derivative를 입력과 같은 순서로 묶은 vector입니다." },
          { symbol: "(4,3)", name: "steepest-ascent direction", description: "이 점에서 가장 빠르게 증가하는 방향과 좌표별 민감도를 함께 나타냅니다." },
        ]}
        assumptions={["각 partial derivative가 존재하는 것만으로 항상 전체가 매끈하다고 결론내릴 수는 없습니다.", "가장 빠른 방향이라는 설명은 Euclidean norm으로 길이 1인 방향들을 비교할 때 성립합니다."]}
        interpretation="Unit direction u=(3/5,4/5)로 움직이는 directional derivative는 ∇f·u=24/5입니다. 반대인 −∇f 방향은 같은 크기로 가장 빠르게 감소하므로 gradient descent가 이 방향을 사용합니다."
      />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>출력이 여러 개면 Jacobian matrix가 된다</h3>
        <p>
          Gradient는 scalar output 하나의 민감도 vector입니다. 반면 layer처럼 output도 vector라면 각 output coordinate마다
          gradient가 하나씩 생깁니다. 이 row들을 모은 것이 Jacobian입니다. 작은 input 변화 vector를 작은 output 변화 vector로 보내는 local
          linear map으로 읽으면 됩니다.
        </p>
      </div>
      <ExplainedFormula
        question="두 입력이 두 출력에 미치는 모든 local rate를 어떻게 한 번에 기록할까요?"
        idea={<>Output coordinate 하나를 row 하나로 두고, 각 input coordinate에 대한 partial derivative를 열에 놓습니다.</>}
        formula={String.raw`F(x,y)=(x+y,xy),\qquad J_F(x,y)=\begin{bmatrix}1&1\\y&x\end{bmatrix},\qquad J_F(2,3)=\begin{bmatrix}1&1\\3&2\end{bmatrix}`}
        terms={[
          { symbol: String.raw`J_F`, name: "Jacobian matrix", description: "행은 output coordinate, 열은 input coordinate에 대응합니다." },
          { symbol: "1,1", name: "첫 output의 gradient", description: "x+y가 x와 y 각각에 갖는 local sensitivity입니다." },
          { symbol: "y,x", name: "둘째 output의 gradient", description: "xy가 x에는 y배, y에는 x배 민감하다는 뜻입니다." },
        ]}
        assumptions={["여기서는 output-by-input Jacobian convention을 사용합니다.", "Local linear approximation은 충분히 작은 input 변화에서 읽습니다."]}
        interpretation="(2,3)에서 input이 (0.01,−0.02)만큼 변하면 output 변화는 대략 Jacobian과 이 vector의 곱으로 계산합니다."
      />
    </section>
  );
}

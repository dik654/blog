import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import SensitivityShapeViz from "./SensitivityShapeViz";

const MIT_MULTIVARIABLE = "https://ocw.mit.edu/courses/18-02sc-multivariable-calculus-fall-2010/pages/2.-partial-derivatives/part-b-chain-rule-gradient-and-directional-derivatives/";
const MATRIX_CALCULUS = "https://arxiv.org/abs/1802.01528";

export default function GradientsJacobiansArticle() {
  return (
    <article className="space-y-16">
      <section id="overview" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">00 · 손잡이 하나씩</p>
          <h2 className="mt-2 text-2xl font-bold">Partial derivative는 여러 입력 가운데 하나만 움직여 local sensitivity를 잰다</h2>
        </header>
        <p className="text-lg leading-8">
          Loss가 weight 두 개 x와 y에 달려 있다면 어느 값을 바꿔야 loss가 변했는지 한 번에
          분리하기 어렵습니다. 먼저 y를 고정하고 x만 움직인 rate를 재고, 다음에는 x를
          고정하고 y만 움직입니다. 이 coordinate별 derivative가 partial derivative입니다.
        </p>
        <Term name="Partial derivative" shape="∂f/∂x" meaning="다른 coordinate를 고정하고 x 하나만 움직인 local rate입니다." example="f(x,y)=x²+3y이면 ∂f/∂x=2x, ∂f/∂y=3입니다." boundary="각 partial이 존재해도 전체 함수가 자동으로 differentiable하다는 뜻은 아닙니다." />
        <ExplainedFormula
          question="f(x,y)=x²+3y의 (2,−1)에서 두 손잡이는 각각 얼마나 민감할까요?"
          idea={<>한 번에는 coordinate 하나만 움직입니다. 고정한 coordinate의 항은 그 partial derivative에서 상수로 취급합니다.</>}
          formula={String.raw`\frac{\partial f}{\partial x}=2x,\qquad \frac{\partial f}{\partial y}=3`}
          annotatedFormula={String.raw`\begin{aligned}\frac{\partial f}{\partial x}&=\underbrace{2x}_{\substack{y\text{를 고정하고}\\x\text{만 움직인 rate}}}\\[4pt]\frac{\partial f}{\partial y}&=\underbrace{3}_{\substack{x\text{를 고정하고}\\y\text{만 움직인 rate}}}\end{aligned}`}
          operations={[
            { expression: String.raw`\partial f/\partial x`, annotation: ["y 이동을 0으로 고정하고", "x 방향 변화만 분리"] },
            { expression: String.raw`\partial f/\partial y`, annotation: ["x 이동을 0으로 고정하고", "y 방향 변화만 분리"] },
          ]}
          terms={[
            { symbol: String.raw`\partial`, name: "Partial symbol", description: "여러 입력 중 선택한 coordinate에 대한 derivative임을 표시합니다." },
            { symbol: "x,y", name: "Input coordinates", description: "서로 독립적으로 움직여 보는 두 손잡이입니다." },
          ]}
          assumptions={["각 partial을 계산할 때 나머지 coordinate를 고정합니다.", "Coordinate의 물리 단위와 scale이 다르면 slope 크기를 그대로 비교하지 않습니다."]}
          interpretation="(2,−1)에서 x 손잡이의 local rate는 4, y 손잡이는 3입니다."
        />
        <SensitivityShapeViz />
      </section>

      <section id="gradient-direction" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">01 · slope를 vector로 묶기</p>
          <h2 className="mt-2 text-2xl font-bold">Gradient는 coordinate별 partial derivative를 입력과 같은 순서로 모은 vector다</h2>
        </header>
        <Term name="Gradient" shape="∇f=(∂f/∂x, ∂f/∂y)" meaning="Scalar output 하나가 각 input coordinate에 얼마나 민감한지 같은 순서로 묶습니다." example="(2,−1)에서 ∇f=(4,3)입니다." boundary="Gradient는 coordinate scale과 선택한 geometry에 의존하는 local object입니다." />
        <Term name="Directional derivative" shape="Dᵤf" meaning="x축 하나가 아니라 선택한 방향 u로 움직일 때의 local rate입니다." example="u=(3/5,4/5)이면 (4,3)·u=24/5입니다." boundary="방향끼리 공정하게 비교하려면 u의 norm을 1로 맞춥니다." />
        <ExplainedFormula
          question="왜 gradient와 방향 vector의 dot product가 그 방향의 변화율일까요?"
          idea={<>작은 이동 Δx를 방향 u의 배수로 두면 각 coordinate 변화에 해당 partial slope를 곱해 더합니다. Dot product가 바로 이 coordinate contribution 합입니다.</>}
          formula={String.raw`\begin{aligned}D_u f&=\nabla f\cdot u\\&=\sum_i\frac{\partial f}{\partial x_i}u_i\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}D_u f&=\underbrace{\nabla f\cdot u}_{\substack{\text{방향 }u\text{로}\\\text{gradient를 투영}}}\\[6pt]&=\sum_i\underbrace{\frac{\partial f}{\partial x_i}}_{\text{slope }i}\underbrace{u_i}_{\text{move }i}\end{aligned}`}
          operations={[
            { expression: String.raw`(\partial f/\partial x_i)u_i`, annotation: ["coordinate i의 local slope에", "그 coordinate로 움직인 비율을 곱함"] },
            { expression: String.raw`\sum_i`, annotation: ["모든 coordinate가 만든", "output 변화 contribution을 합산"] },
            { expression: String.raw`\nabla f\cdot u`, annotation: ["gradient에서", "선택한 방향 성분만 projection"] },
          ]}
          terms={[
            { symbol: "u", name: "Unit direction", description: "길이 1로 맞춘 이동 방향입니다." },
            { symbol: String.raw`D_u f`, name: "Directional derivative", description: "u 방향의 local scalar rate입니다." },
            { symbol: String.raw`\nabla f`, name: "Gradient", description: "모든 coordinate slope를 모은 vector입니다." },
          ]}
          assumptions={["f가 해당 점에서 differentiable하고 Euclidean dot product를 사용합니다.", "Finite step에서는 curvature 때문에 negative gradient step도 loss 감소를 보장하지 않을 수 있습니다."]}
          interpretation="Unit direction 가운데 gradient와 같은 방향이 dot product를 가장 크게 만들고, 반대 방향이 local decrease를 가장 크게 만듭니다."
        />
      </section>

      <section id="jacobian" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">02 · output도 여러 개라면</p>
          <h2 className="mt-2 text-2xl font-bold">Jacobian은 output별 gradient를 행으로 쌓은 local linear map이다</h2>
        </header>
        <Term name="Jacobian matrix" shape="output rows × input columns" meaning="각 output coordinate가 각 input coordinate에 갖는 partial derivative를 표로 놓습니다." example="F(x,y)=(x+y,xy)의 Jacobian은 [[1,1],[y,x]]입니다." boundary="문헌에 따라 transpose convention이 있으므로 행·열 의미를 먼저 확인합니다." />
        <Term name="Jacobian-vector product" shape="J_F v" meaning="전체 Jacobian을 따로 저장하지 않고 선택한 input 방향 v가 output을 어떻게 바꾸는지 계산합니다." example="(2,3)에서 v=(0.01,−0.02)이면 output 변화는 약 (−0.01,−0.01)입니다." boundary="Jv는 forward direction propagation이고, reverse-mode의 vᵀJ와 곱 순서·shape가 다릅니다." />
        <ExplainedFormula
          question="두 input 변화가 두 output 변화로 어떻게 전달될까요?"
          idea={<>행은 어떤 output을 계산하는지, 열은 어떤 input 손잡이의 contribution인지 고정합니다. Matrix-vector product가 input별 contribution을 output마다 합합니다.</>}
          formula={String.raw`J_F(x,y)=\begin{bmatrix}1&1\\y&x\end{bmatrix},\qquad \Delta F\approx J_F\Delta x`}
          annotatedFormula={String.raw`\begin{aligned}J_F(x,y)&=\underbrace{\begin{bmatrix}1&1\\y&x\end{bmatrix}}_{\substack{\text{row: output}\\\text{column: input}}}\\[7pt]\underbrace{\Delta F}_{\text{output move}}&\approx\underbrace{J_F}_{\text{slope map}}\underbrace{\Delta x}_{\text{input move}}\end{aligned}`}
          operations={[
            { expression: String.raw`\partial F_j/\partial x_i`, annotation: ["output j가", "input i에 가진 local slope를 cell에 기록"] },
            { expression: String.raw`J_F\Delta x`, annotation: ["각 cell slope에 해당 input 이동을 곱하고", "같은 output 행 안에서 contribution을 합산"] },
          ]}
          terms={[
            { symbol: String.raw`J_F`, name: "Jacobian", description: "Output-by-input local slope matrix입니다." },
            { symbol: String.raw`\Delta x`, name: "Small input move", description: "Input coordinate 순서의 작은 vector입니다." },
            { symbol: String.raw`\Delta F`, name: "Predicted output move", description: "Jacobian이 1차로 예측한 output 변화입니다." },
          ]}
          assumptions={["이 글은 output-by-input Jacobian convention을 사용합니다.", "Δx가 충분히 작고 F가 해당 점에서 differentiable합니다."]}
          interpretation="Jacobian은 숫자 표가 아니라 작은 input vector를 작은 output vector로 보내는 local function입니다."
        />
      </section>

      <section id="boundaries" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">03 · 다음 계산으로 넘길 경계</p>
          <h2 className="mt-2 text-2xl font-bold">Gradient·JVP·VJP는 같은 Jacobian 정보를 서로 다른 방향으로 사용한다</h2>
        </header>
        <div className="space-y-4">
          <Boundary title="Gradient" detail="Scalar output의 모든 input slope를 한 vector로 모읍니다." />
          <Boundary title="JVP" detail="Input 방향 v를 앞으로 보내 output 변화 Jv를 계산합니다." />
          <Boundary title="VJP" detail="Output 쪽 책임 vector를 뒤로 보내 vᵀJ를 계산합니다. Reverse-mode autodiff의 핵심 연산입니다." />
        </div>
        <p>
          실제 computational graph에서 VJP를 역순으로 누적하는 과정은
          <a className="ml-1 font-semibold text-primary underline" href="/ai/reverse-mode-autodiff">reverse-mode autodiff</a>가
          소유하고, gradient를 parameter update로 바꾸는 선택은
          <a className="ml-1 font-semibold text-primary underline" href="/ai/optimizers">optimizer</a> 글로 이어집니다.
        </p>
        <div id="paper-multivariable-gradient"><CitationBlock source="MIT OpenCourseWare 18.02SC · Gradient and Directional Derivatives" citeKey={1} href={MIT_MULTIVARIABLE}><Evidence problem="다변수 함수의 coordinate별 rate를 방향과 기하로 연결하는 문제" contribution="Partial derivative·gradient·directional derivative·chain rule를 공개 강의와 문제로 설명" assumptions="명시된 multivariable differentiability와 Euclidean coordinate 조건" scope="18.02SC 해당 단원의 계산·기하" notClaim="Arbitrary norm·manifold·nonsmooth optimization의 보편적 결과가 아님" /></CitationBlock></div>
        <div id="paper-jacobian-calculus"><CitationBlock source="The Matrix Calculus You Need For Deep Learning" citeKey={2} href={MATRIX_CALCULUS}><Evidence problem="Vector input·output derivative의 shape와 chain rule convention 혼동" contribution="Gradient·Jacobian과 vectorized chain rule를 deep-learning example에 맞춰 정리" assumptions="논문이 선언한 numerator-layout convention과 differentiability" scope="Matrix calculus tutorial과 worked derivation" notClaim="모든 autodiff implementation의 memory·performance contract가 아님" /></CitationBlock></div>
        <ContentBoundary article="math-gradients-jacobians" />
      </section>
    </article>
  );
}

function Term({ name, shape, meaning, example, boundary }: { name: string; shape: string; meaning: string; example: string; boundary: string }) { return <div className="border-l border-primary/70 pl-5"><p className="text-xs font-bold text-primary">용어</p><h3 className="mt-1 text-lg font-bold">{name}</h3><p className="mt-2 font-mono text-sm font-black">{shape}</p><p className="mt-3 leading-7">{meaning}</p><p className="mt-2 text-sm leading-6 text-muted-foreground"><strong className="text-foreground">작은 예:</strong> {example}</p><p className="mt-2 text-sm leading-6 text-muted-foreground"><strong className="text-foreground">경계:</strong> {boundary}</p></div>; }
function Boundary({ title, detail }: { title: string; detail: string }) { return <div className="grid gap-2 border-l border-border pl-4 sm:grid-cols-[7rem_1fr]"><p className="font-mono text-xs font-black text-primary">{title}</p><p className="text-sm leading-6">{detail}</p></div>; }
function Evidence({ problem, contribution, assumptions, scope, notClaim }: { problem: string; contribution: string; assumptions: string; scope: string; notClaim: string }) { return <div className="space-y-2"><p><strong>문제:</strong> {problem}</p><p><strong>핵심 아이디어:</strong> {contribution}</p><p><strong>중요 가정:</strong> {assumptions}</p><p><strong>근거 범위:</strong> {scope}</p><p><strong>일반화 금지:</strong> {notClaim}</p></div>; }

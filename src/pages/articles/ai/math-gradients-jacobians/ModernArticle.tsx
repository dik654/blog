import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import SensitivityShapeViz from "./SensitivityShapeViz";

const MIT_MULTIVARIABLE = "https://ocw.mit.edu/courses/18-02sc-multivariable-calculus-fall-2010/pages/2.-partial-derivatives/part-b-chain-rule-gradient-and-directional-derivatives/";
const MATRIX_CALCULUS = "https://arxiv.org/abs/1802.01528v3";
const OPENSTAX_DIRECTION = "https://openstax.org/books/calculus-volume-3/pages/4-6-directional-derivatives-and-the-gradient";

export default function GradientsJacobiansArticle() {
  return (
    <article className="space-y-16">
      <section id="overview" data-teach-level="S" className="space-y-6">
        <h2 className="text-2xl font-bold">1 · 바꿀 입력이 여러 개이면 변화의 원인을 어떻게 나눌까</h2>
        <p className="text-lg leading-8">
            모델의 오차는 수많은 숫자에 달려 있습니다. 여러 숫자를 한꺼번에 바꿔 결과가 줄었다고 해도 각각이 얼마나 기여했는지는 바로 알 수 없습니다. 하나씩 바꿔 본 비율을 모으면
            여러 입력을 함께 움직일 때의 결과도 예측할 수 있습니다.
          </p>
        <p>
            앞 글에서 입력 하나의 작은 변화율을 구했습니다. 이번에는 입력 두 개에서 시작해 결과 하나의 변화 방향을 찾고 결과도 두 개이면 같은 정보를 표로 정리하겠습니다. 각 숫자가
            어떤 입력과 어떤 결과를 잇는지가 핵심입니다.
          </p>
        <p>계산 규칙은 고정하고 현재 위치 주변만 살핍니다. 먼저 입력과 결과의 개수를 구별하겠습니다.</p>
      </section>
      <section id="black-box" data-teach-level="B" className="space-y-6">
        <h2 className="text-2xl font-bold">2 · 두 수를 받아 한 수를 돌려주는 계산을 살펴본다</h2>
        <p>첫째 수를 제곱하고 둘째 수의 세 배를 더하는 장치를 둡니다(가정). 첫째 수 2와 둘째 수 −1을 넣으면 4−3=1입니다. 입력은 둘이지만 결과는 하나입니다.</p>
        <p>첫째 수만 2.01로 바꾸면 결과가 1.0401입니다. 이번에는 처음의 2로 돌려놓고 둘째 수만 −0.99로 바꾸면 1.03입니다(가정). 같은 0.01만큼 움직였어도 결과의 변화는 0.0401과 0.03으로 다릅니다.</p>
        <p>이 비교에서 첫째 수를 움직일 때 둘째 수를 고정한 이유는 변화의 원인을 분리하기 위해서입니다. 두 입력을 동시에 바꾸는 경우는 각자의 비율을 얻은 뒤 계산하겠습니다.</p>
      </section>
      <section id="case" data-teach-level="0" className="space-y-6">
        <h2 className="text-2xl font-bold">3 · 같은 0.01 이동이 0.0401과 0.03을 만든다</h2>
        <p>
            첫째 입력의 경우 0.0401/0.01=4.01, 둘째 입력은 0.03/0.01=3입니다. 첫째 입력의 간격을 더 줄이면 비율은 4로 가까워지고 둘째는 세 배 하는 규칙이라
            간격에 상관없이 3입니다. 지금 위치의 두 비율은 입력 순서대로 4와 3입니다.
          </p>
        <p>둘을 함께 움직이는 작은 예로 첫째 수를 0.06, 둘째 수를 0.08 늘려 보겠습니다(가정). 각 비율에 움직인 양을 곱해 더하면 변화 예측은 4×0.06+3×0.08=0.48입니다. 실제 결과는 2.06²+3×(−0.92)=1.4836이므로 실제 변화 0.4836과 약간 다릅니다.</p>
        <p>결과가 둘인 계산도 뒤에서 확인하겠습니다. 두 입력의 합과 곱을 함께 돌려주는 규칙에 2와 3을 넣으면 결과는 5와 6입니다(가정). 입력을 2.01과 2.98로 바꾸면 결과는 4.99와 5.9898입니다. 한 결과의 변화가 아니라 각각의 변화를 구해야 합니다.</p>
        <p>
            한 결과에서는 입력별 기여를 더했고 결과가 둘이면 그 합산을 결과마다 따로 합니다. 두 경우의 숫자를 그대로 유지한 채 표의 역할을 보겠습니다.
          </p>
      </section>
      <section id="picture" data-teach-level="1" className="space-y-6">
        <h2 className="text-2xl font-bold">4 · 입력별 기여를 모아 결과별로 합친다</h2>
        <div className="grid gap-4 border-y border-border py-5 sm:grid-cols-3" aria-label="입력 변화의 기여를 합하는 흐름">
          <p><strong>어느 입력을 움직이나?</strong><br />첫째 0.06, 둘째 0.08</p>
          <p><strong>각각 몇 배로 전달되나?</strong><br />현재 위치에서 4배, 3배</p>
          <p><strong>한 결과에 얼마나 모이나?</strong><br />0.24+0.24=0.48</p>
        </div>
        <p>
            4는 첫째 입력과 결과를 잇고 3은 둘째 입력과 같은 결과를 잇습니다. 결과가 두 개라면 이런 관계도 두 묶음이 됩니다. 입력 순서나 결과 순서를 바꾸면 숫자를 놓는 위치도
            함께 바꿉니다.
          </p>
        <p>전달 비율을 모으는 구조가 보입니다. 이제 같은 표로 방향을 비교할 때 필요한 조건을 확인하겠습니다.</p>
      </section>
      <section id="need" data-teach-level="2" className="space-y-6">
        <h2 className="text-2xl font-bold">5 · 순서와 이동 길이를 맞춰야 방향을 비교할 수 있다</h2>
        <p>0.06과 0.08의 순서를 바꾸면 예측도 4×0.08+3×0.06=0.50으로 바뀝니다. 값 두 개가 있다는 정보만으로는 부족합니다. 각 값이 어느 입력을 가리키는지 정해야 합니다.</p>
        <p>더 멀리 움직인 결과가 더 많이 변했다고 해서 그 방향이 더 민감하다고 말할 수도 없습니다. 0.06과 0.08을 각각 두 배 하면 방향은 같지만 이동 길이와 1차 변화 예측은 두 배입니다. 방향만 비교하려면 이동 길이를 같은 기준으로 맞춥니다.</p>
        <p>현재 위치도 유지합니다. 첫째 입력을 제곱하므로 첫째 입력의 위치가 바뀌면 전달 비율이 달라집니다. 표는 계산 장치에 영구히 붙은 상수가 아니라 특정 위치에서 만든 요약입니다.</p>
        <p>결과마다 기여를 따로 모으는 이유도 있습니다. 합 5와 곱 6을 하나의 숫자로 더해 버리면 각각이 얼마나 변했는지 알 수 없습니다. 두 결과를 어떤 비중으로 합쳐 평가할지는 별도로 정하는 선택입니다. 지금은 입력마다 두 결과를 어떻게 바꾸는지까지 남겨 두어야 나중에 그 선택에 맞춰 다시 계산할 수 있습니다.</p>
        <p>한 결과 안에서 입력들의 기여를 더하는 일과 여러 결과를 하나의 점수로 합치는 일은 구별합니다. 앞에서 구한 0.48은 첫 번째 계산의 결과 하나가 변하는 양입니다. 합과 곱의 계산에서는 각 결과마다 그런 변화량을 하나씩 구합니다.</p>
        <p>입력을 하나씩 움직이는 작업, 비율을 모은 표, 길이를 맞춘 방향에 이제 수학의 이름을 붙입니다.</p>
      </section>
      <section id="names" data-teach-level="3" className="space-y-6">
        <h2 className="text-2xl font-bold">6 · 편미분을 모으면 기울기와 야코비안이 된다</h2>
        <div className="overflow-x-auto"><table className="w-full min-w-[660px] text-sm"><thead><tr><th className="p-3 text-left">이미 한 일</th><th className="p-3 text-left">이름과 표기</th><th className="p-3 text-left">뜻</th></tr></thead><tbody>
          {[['나머지를 고정하고 입력 하나를 움직인다', '편미분(partial derivative), ∂f/∂x', '선택한 좌표의 변화율'], ['결과 하나의 입력별 비율을 모은다', '기울기(gradient), ∇f', '입력 순서대로 모은 편미분 벡터'], ['같은 길이로 움직일 방향을 정한다', '단위 방향, u', '길이를 1로 맞춘 방향'], ['그 방향의 변화율을 구한다', '방향미분, Dᵤf', '선택한 방향으로 움직일 때의 비율'], ['여러 결과의 편미분을 행으로 놓는다', '야코비안(Jacobian), J', '결과별·입력별 변화율 행렬'], ['입력 변화를 표에 통과시킨다', 'JVP, Jv', '야코비안과 입력 벡터의 곱'], ['출력 쪽 비중을 입력 쪽으로 되돌린다', 'VJP, wᵀJ', '출력 벡터와 야코비안의 곱']].map(row=><tr key={row[0]} className="border-t border-border">{row.map(cell=><td key={cell} className="min-w-[190px] p-3 align-top">{cell}</td>)}</tr>)}
        </tbody></table></div>
        <p>첫 규칙을 f(x,y)=x²+3y, 두 결과를 내는 둘째 규칙을 F(x,y)=(x+y,xy)라고 적겠습니다. 둘은 출력 개수가 다른 별개의 계산 예입니다. 행렬곱에서는 입력 변화와 기울기를 열벡터로 씁니다. (4,3)처럼 괄호로 적은 값은 좌표 순서를 나타냅니다.</p>
        <p>용어는 각 값이 어느 쪽을 잇는지 짧게 적는 방법입니다. 처음의 f와 현재 위치 (2,−1)부터 다시 계산하겠습니다.</p>
      </section>
      <section id="partials" data-teach-level="4" className="space-y-6">
        <h2 className="text-2xl font-bold">7 · 다른 좌표를 고정하면 4와 3이 남는다</h2>
        <p>
            y=−1을 고정하면 f(x,−1)=x²−3입니다. x=2에서 x를 h만큼 늘릴 때 변화는 4h+h²이고 h로 나눈 뒤 간격을 줄이면 4가 남습니다. x=2를 고정하면
            f(2,y)=4+3y이므로 y 변화 h는 결과 변화 3h를 만듭니다. 그 비율은 3입니다.
          </p>
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
        <p>f의 입력 순서는 x, y이므로 기울기도 ∇f=(4,3)입니다. 순서를 뒤집은 (3,4)를 쓰면 앞의 0.06과 0.08을 다른 입력에 배정하는 셈입니다. 이제 이 두 비율로 임의의 방향을 계산합니다.</p>
      </section>
      <section id="gradient-direction" data-teach-level="4" className="space-y-6">
        <h2 className="text-2xl font-bold">8 · 방향의 두 성분에 4와 3을 곱해 더한다</h2>
        <p>
            앞의 이동 (0.06,0.08)은 길이가 √(0.06²+0.08²)=0.1입니다. 길이 1로 맞추면 u=(3/5,4/5)이고 이 방향의 변화율은
            4×3/5+3×4/5=24/5=4.8입니다. 다시 이동 길이 0.1을 곱하면 앞서 구한 변화 예측 0.48이 나옵니다.
          </p>
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
        <p>왜 각 기여를 더할까요. 현재 점에서 f가 미분 가능하면 작은 이동의 변화는 4Δx+3Δy에 이동 길이보다 빨리 줄어드는 오차를 더한 것입니다. Δx=t·u₁, Δy=t·u₂를 넣고 t로 나눈 뒤 t→0으로 보내면 4u₁+3u₂가 남습니다. 이것이 내적 ∇f·u입니다.</p>
        <p>기울기의 길이는 √(4²+3²)=5입니다. 같은 길이의 방향 중 ∇f와 나란한 (4/5,3/5)가 변화율 5를, 반대인 (−4/5,−3/5)가 −5를 만듭니다. 앞의 (3/5,4/5)는 방향이 조금 달라 4.8이었던 것입니다.</p>
        <ProgressiveDetail title="왜 다른 단위 방향은 5보다 큰 변화율을 만들 수 없을까" preview="코시–슈바르츠 부등식으로 내적의 절댓값은 두 길이의 곱을 넘지 않습니다. 단위 방향에서는 상한이 기울기 길이 5입니다.">
          <p><a className="font-semibold text-primary underline" href="/cs/ai/math-vectors-inner-products#cauchy-schwarz">코시–슈바르츠 부등식</a>은 |∇f·u|≤‖∇f‖‖u‖입니다. ‖u‖=1로 정했으므로 상한은 5입니다. 같은 방향일 때 +5, 반대일 때 −5로 등호가 성립합니다. 기울기가 0이면 모든 방향의 1차 변화율도 0이며, 감소 방향 하나를 이 정보만으로 고를 수 없습니다.</p>
        </ProgressiveDetail>
        <SensitivityShapeViz />
        <p>이 결론은 미분 가능한 점에서 보통의 유클리드 길이로 단위 방향을 비교할 때의 국소 결과입니다. 유한한 한 걸음의 크기까지 정해 주지는 않습니다. 그 크기를 정하는 문제는 <a className="font-semibold text-primary underline" href="/cs/ai/math-gradient-descent-convergence">경사하강법의 수렴</a>에서 다룹니다.</p>
        <p>결과 하나에서는 벡터 하나로 충분했습니다. 결과가 둘인 두 번째 가정 사례에서는 결과마다 이 계산을 반복합니다.</p>
      </section>
      <section id="jacobian" data-teach-level="4" className="space-y-6">
        <h2 className="text-2xl font-bold">9 · 합과 곱의 변화는 서로 다른 행에서 계산한다</h2>
        <p>F(x,y)=(x+y,xy)의 현재 위치는 (2,3), 결과는 (5,6)입니다. 합 x+y의 두 편미분은 1과 1입니다. 곱 xy는 y를 고정하고 x를 움직이면 비율 y=3, x를 고정하고 y를 움직이면 비율 x=2입니다. 결과 순서대로 행을 쌓으면 J=[[1,1],[3,2]]입니다.</p>
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
        <p>
            같은 입력 변화 v=(0.01,−0.02)를 곱하면 첫 행은 0.01−0.02=−0.01, 둘째 행은 3×0.01+2×(−0.02)=−0.01입니다. 예측 결과는
            (4.99,5.99)입니다. 실제 결과 (4.99,5.9898)와 둘째 성분에서 −0.0002 차이가 나는데 곱을 전개할 때 생략한 ΔxΔy=0.01×(−0.02)입니다.
          </p>
        <AlgorithmBlock title="입력 변화가 결과로 전달되는 한 번의 계산 (의사코드)" input={['현재 입력 (2,3), 작은 입력 변화 v=(0.01,−0.02)', 'F₁=x+y, F₂=xy']} steps={[{code:'현재 결과 ← (2+3, 2×3) = (5,6)'},{code:'J의 첫 행 ← (1,1); 둘째 행 ← (y,x) = (3,2)',note:'행은 결과, 열은 입력 순서입니다.'},{code:'Jv ← (1×0.01+1×(−0.02), 3×0.01+2×(−0.02))'},{code:'예측 결과 ← (5,6)+(−0.01,−0.01)'}]} output="예측 (4.99,5.99), 실제 (4.99,5.9898)" />
        <p>JVP가 필요한 경우에는 모든 편미분을 메모리에 표로 만들 필요가 없습니다. 계산을 앞으로 따라가며 주어진 변화 방향의 기여만 전달해 Jv를 얻을 수 있습니다. 여기의 작은 표는 방향과 행·열을 확인하려고 명시적으로 적었습니다.</p>
        <p>두 행에 값을 놓고 곱한 결과가 확인됐습니다. 이 행·열 약속을 원문의 표기와 맞추겠습니다.</p>
      </section>
      <section id="source" data-teach-level="5-6" className="space-y-6">
        <h2 className="text-2xl font-bold">10 · 원문의 방향미분 식과 야코비안에 같은 수를 넣는다</h2>
        <p><a href={OPENSTAX_DIRECTION} className="font-semibold text-primary underline">OpenStax Calculus Volume 3 §4.6 식 (4.38)</a>은 <code>Dᵤf(x,y)=∇f(x,y)·u</code>입니다. f=x²+3y와 (2,−1), u=(3/5,4/5)를 넣으면 12/5+12/5=24/5입니다. 같은 절 정리 4.13의 최대·최소 방향미분은 여기서 기울기 길이 5와 −5입니다. 이 수치는 우리의 가정 사례이며 교재의 다른 수치 예제를 가져온 것이 아닙니다.</p>
        <p><a href={MATRIX_CALCULUS} className="font-semibold text-primary underline">Parr·Howard, The Matrix Calculus You Need For Deep Learning v3, §4.1의 7쪽</a>은 결과 m개와 입력 n개를 m행 n열로 모읍니다. 원문의 기울기는 각 행을 이루는 가로 벡터입니다. 이 글에서 기울기를 열벡터로 쓸 때는 그 벡터를 전치해 행에 놓습니다.</p>
        <ExplainedFormula
          question="원문의 편미분 행렬에서 각 행은 무엇을 계산하나요?"
          idea={<>결과 하나의 입력별 변화율을 한 행에 모읍니다. 같은 입력 변화에 각 행을 적용하면 결과마다 변화 예측 하나를 얻습니다.</>}
          formula={String.raw`\frac{\partial\mathbf y}{\partial\mathbf x}=\begin{bmatrix}\nabla f_1(\mathbf x)\\\nabla f_2(\mathbf x)\\\vdots\\\nabla f_m(\mathbf x)\end{bmatrix}`}
          annotatedFormula={String.raw`\underbrace{\frac{\partial\mathbf y}{\partial\mathbf x}}_{m\text{행 }n\text{열}}=\begin{bmatrix}\underbrace{\nabla f_1(\mathbf x)}_{\text{결과 1의 입력별 변화율}}\\\vdots\\\underbrace{\nabla f_m(\mathbf x)}_{\text{결과 }m\text{의 입력별 변화율}}\end{bmatrix}`}
          operations={[{expression:String.raw`\nabla f_i(\mathbf x)`,annotation:['원문에서 결과 i의 편미분을','가로 한 행으로 모음']},{expression:String.raw`\partial\mathbf y/\partial\mathbf x`,annotation:['m개 결과와 n개 입력의 관계를','m행 n열로 놓음']}]}
          terms={[{symbol:'m',name:'결과 개수',description:'우리 F는 합과 곱 두 결과이므로 2입니다.'},{symbol:'n',name:'입력 개수',description:'x와 y 두 입력이므로 2입니다.'},{symbol:String.raw`\nabla f_i`,name:'원문 표기의 행 기울기',description:'원문은 가로 벡터를 쌓습니다. 열 기울기 표기와 전치 관계입니다.'}]}
          assumptions={['원문의 numerator layout을 그대로 적었습니다.','식 자체에 번호가 없는 v3 7쪽 행렬입니다.','아래의 f₁과 f₂ 대입은 우리의 가정 사례입니다.']}
          interpretation="원문 f₁에 x+y, f₂에 xy를 놓고 입력 (2,3)을 대입하면 첫 행 (1,1), 둘째 행 (3,2)가 됩니다. 원문의 굵은 x는 이 글의 두 입력 전체를 뜻합니다."
        />
        <p>이 행렬에 같은 v=(0.01,−0.02)를 넣으면 다시 (−0.01,−0.01)을 얻습니다. 표기를 전치해 쓰는 문헌에서는 벡터 방향과 곱 순서도 함께 바꿔야 합니다.</p>
        <div id="paper-multivariable-gradient"><CitationBlock source="MIT OpenCourseWare 18.02SC · Gradient and Directional Derivatives" citeKey={1} href={MIT_MULTIVARIABLE}><Evidence problem="다변수 함수의 coordinate별 rate를 방향과 기하로 연결하는 문제" contribution="Partial derivative·gradient·directional derivative·chain rule를 공개 강의와 문제로 설명" assumptions="명시된 multivariable differentiability와 Euclidean coordinate 조건" scope="18.02SC 해당 단원의 계산·기하" notClaim="Arbitrary norm·manifold·nonsmooth optimization의 보편적 결과가 아님" /></CitationBlock></div>
        <div id="paper-jacobian-calculus"><CitationBlock source="The Matrix Calculus You Need For Deep Learning" citeKey={2} href={MATRIX_CALCULUS}><Evidence problem="Vector input·output derivative의 shape와 chain rule convention 혼동" contribution="Gradient·Jacobian과 vectorized chain rule를 deep-learning example에 맞춰 정리" assumptions="논문이 선언한 numerator-layout convention과 differentiability" scope="Matrix calculus tutorial과 worked derivation" notClaim="모든 autodiff implementation의 memory·performance contract가 아님" /></CitationBlock></div>

        <p>식의 위치와 모양을 맞췄습니다. 마지막으로 각 좌표만 따로 보는 방법의 한계와 반대 방향의 곱을 구별하겠습니다.</p>
      </section>
      <section id="boundaries" data-teach-level="7" className="space-y-6">
        <h2 className="text-2xl font-bold">11 · 좌표별 비율만 있거나 단위를 바꾸면 무엇이 달라질까</h2>
        <p>편미분이 모두 있어도 전체 함수가 미분 가능한 것은 아닙니다. r(x,y)=xy/(x²+y²)로 두되 원점의 값만 0으로 정해 봅시다(가정). 두 좌표축에서는 항상 값이 0이라 원점의 두 편미분도 0입니다. 그러나 x=y=t≠0으로 접근하면 값이 늘 1/2입니다. 원점에서 연속조차 아니므로 작은 이동을 하나의 선형식과 더 작은 오차로 설명할 수 없습니다.</p>
        <p>
            어느 방향을 빠르게 줄일지도 좌표 단위에 영향을 받습니다. 첫 사례의 x를 z=100x로 다시 표시하면 같은 함수는 f(z/100,y)=z²/10000+3y입니다(가정). 같은
            위치는 (z,y)=(200,−1)이고 기울기 성분은 (0.04,3)입니다. 원래의 (4,3)과 크기 순서가 바뀌었지만 z의 1 이동은 x의 0.01 이동과 같은 변화입니다.
            비율 0.04×1=4×0.01도 같습니다. 단위를 맞춰 재척도화하거나 이동 거리를 재는 기준을 명시해야 방향 비교가 같은 의미를 가집니다.
          </p>
        <p>JVP는 입력 변화 v를 앞으로 보내 결과 변화 Jv를 구합니다. VJP는 결과 쪽에 부여한 비중 w를 받아 입력 쪽 기여 wᵀJ를 구합니다. 위의 J에서 출력 비중을 w=(2,−1)로 두면 wᵀJ=(−1,0)입니다(가정). 두 결과를 2F₁−F₂로 합친 값의 입력별 민감도입니다. 입력 쪽 .01과 −.02를 넣은 JVP와 시작하는 벡터의 의미가 다릅니다.</p>
        <p>일반적으로 J가 m행 n열이면 JVP의 v는 입력 쪽 길이 n, Jv는 출력 쪽 길이 m입니다. VJP의 w는 출력 쪽 길이 m이고 wᵀJ는 입력 쪽 길이 n인 행벡터입니다. 열벡터로 돌려주면 Jᵀw라고 씁니다. VJP도 계산을 역순으로 따라가며 필요한 기여만 합칠 수 있어 전체 J 저장이 필수는 아닙니다.</p>
        <p>그 역순 전달을 실제 계산 경로에서 누적하는 방법은 <a className="font-semibold text-primary underline" href="/cs/ai/reverse-mode-autodiff">역방향 자동미분</a>에서 설명합니다. 이렇게 얻은 기울기를 얼마만큼의 변경으로 바꿀지는 <a className="font-semibold text-primary underline" href="/cs/ai/optimizers">옵티마이저</a>의 역할입니다.</p>
        <ContentBoundary article="math-gradients-jacobians" />
        <ol className="list-decimal space-y-3 pl-6">
          <li>기울기 (4,3)에서 방향 (3/5,4/5)보다 (4/5,3/5)의 증가율이 큰 이유는 무엇인가요? (답: 8절)</li>
          <li>Jv의 곱 결과가 (−0.01,−0.01)인데 실제 곱 xy의 변화는 −0.0102입니다. 남은 항은 무엇인가요? (답: 9절)</li>
          <li>두 좌표축에서 각각 미분계수가 0이면 모든 방향에서 연속이라고 결론 내릴 수 있나요? (답: 11절)</li>
        </ol>
      </section>
    </article>
  );
}

function Evidence({ problem, contribution, assumptions, scope, notClaim }: { problem: string; contribution: string; assumptions: string; scope: string; notClaim: string }) { return <div className="space-y-2"><p><strong>문제:</strong> {problem}</p><p><strong>핵심 아이디어:</strong> {contribution}</p><p><strong>중요 가정:</strong> {assumptions}</p><p><strong>근거 범위:</strong> {scope}</p><p><strong>일반화 금지:</strong> {notClaim}</p></div>; }

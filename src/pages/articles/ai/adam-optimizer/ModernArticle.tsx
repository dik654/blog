import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import { codeRefs } from "./codeRefs";
import { adamOptimizerTree } from "./fileTree";
import { AdamStateViz } from "../optimizers/viz/ModernOptimizerViz";

import NumericPath from "../../world-systems/NumericPath";
import AlgorithmBlock from "@/components/ui/algorithm-block";

export default function AdamOptimizerArticle(){ const sidebar=useCodeSidebar();return <article className="space-y-16">
<section id="overview" data-teach-level="S" className="space-y-6"><h2 className="text-2xl font-bold">1. 반대 신호가 와도, 기억한 방향과 크기를 함께 보고 움직입니다</h2><p className="leading-8">학습 중인 숫자가 3이고, 오차 변화율이 처음에는 2, 다음에는 −2라고 합시다. 매번 현재 변화율의 0.1배를 빼는 규칙이라면 3→2.8→3으로 돌아옵니다. 이제 방향을 기억하는 장부와, 부호를 지우고 크기를 기억하는 장부를 따로 두어 보겠습니다 (가정).</p><p className="leading-8">이 글에서 정할 기억 비율로 계산하면 첫 이동은 약 −0.1, 다음 이동은 약 +0.005263입니다. 숫자는 약 2.9에서 2.905263으로 조금 돌아옵니다 (가정). 두 번째 신호의 크기가 첫 번째와 같아도 이동량은 같지 않습니다.</p><p className="leading-8">그 차이가 두 장부에서 어떻게 생기는지 직접 계산하고, 같은 값을 실제 프로그램의 저장 공간과 연산에 넣어 확인합니다.</p></section>
<section id="black-box" data-teach-level="B" className="space-y-6"><h2 className="text-2xl font-bold">2. 부호 있는 장부와 제곱한 장부를 갱신하고 비율을 구합니다</h2><p className="leading-8">하나의 오차 변화율이 들어오면 두 갈래로 보냅니다. 한쪽은 부호를 유지한 채 과거와 섞습니다. 다른 쪽은 제곱해 부호를 없앤 뒤 별도의 비율로 섞습니다. 비어 있던 장부에서 시작한 영향을 보정하고, 첫 장부를 두 번째 장부의 제곱근으로 나눕니다.</p><NumericPath title="첫 변화율 2의 두 장부 계산" steps={[{label:"현재 변화율",value:"2"},{label:"방향·제곱 장부",value:"0.2 · 0.004"},{label:"초기 비중 보정",value:"2 · 4"},{label:"방향 ÷ 제곱근",value:"2/√4 ≈ 1"}]} /><p className="leading-8">마지막 비율에 이동 크기 0.1을 곱해 현재 숫자에서 뺍니다. 0으로 나누는 일을 막는 아주 작은 양수도 분모에 넣으므로 실제 계산은 위 근삿값과 조금 다릅니다.</p></section>
<section id="case" data-teach-level="0" className="space-y-6"><h2 className="text-2xl font-bold">3. 2와 −2는 방향 장부에서 상쇄되지만 제곱 장부에는 둘 다 4입니다</h2><p className="leading-8">방향 장부는 직전 값의 0.9와 새 변화율의 0.1을 합합니다. 제곱 장부는 직전 값의 0.999와 새 제곱의 0.001을 합합니다. 두 장부의 초기값은 0, 이동 크기는 0.1, 분모에 더할 양수는 0.00000001로 정합니다 (가정).</p><p className="leading-8">첫 변화율 2는 방향 장부 0.1×2=0.2, 제곱 장부 0.001×4=0.004를 만듭니다. 두 번째 변화율 −2가 오면 방향은 0.9×0.2+0.1×(−2)=−0.02, 제곱은 0.999×0.004+0.001×4=0.007996입니다.</p><p className="leading-8">방향은 거의 상쇄됐지만 제곱에는 상쇄가 없습니다. 따라서 두 번째 이동은 반대쪽으로 조금만 일어납니다. 이 변화율 목록은 계산을 비교하기 위한 가정이며 특정 모델의 측정값은 아닙니다.</p></section>
<section id="parts" data-teach-level="1" className="space-y-6"><h2 className="text-2xl font-bold">4. 현재 값만 저장하면 두 번째 이동을 재현할 수 없습니다</h2><p className="leading-8">현재 학습 값에 더해 방향 장부, 제곱 장부, 실제 갱신 횟수가 필요합니다. 같은 현재 값과 같은 새 변화율을 넣어도 이전 장부가 다르면 다음 이동은 다릅니다. 갱신 횟수는 비어 있던 장부의 영향을 얼마나 보정할지 결정합니다.</p><p className="leading-8">여러 학습 값은 각자 두 장부를 갖습니다. 다른 좌표에서 큰 변화율이 나왔다고 모든 좌표의 분모를 똑같이 키우는 계산이 아닙니다. 저장할 때는 각 장부가 어느 학습 값에 속했는지도 유지합니다.</p><p className="leading-8">두 장부를 구분했으므로, 제곱한 값을 왜 나눗셈에 사용하는지 확인하겠습니다.</p></section>
<section id="why-two-records" data-teach-level="2" className="space-y-6"><h2 className="text-2xl font-bold">5. 방향의 크기를 과거에 본 크기와 비교하려고 제곱근으로 나눕니다</h2><p className="leading-8">제곱한 수는 원래 변화율과 단위가 다릅니다. 제곱근을 취하면 원래 크기 단위로 돌아와 방향 장부와 비율을 만들 수 있습니다. 같은 보정 방향 2에 대해 제곱 장부의 보정값이 4이면 비율은 약 1, 400이면 약 0.1입니다 (가정).</p><p className="leading-8">이 비교는 방향 장부를 같게 두었을 때의 이야기입니다. 모든 변화율을 두 배로 만들면 방향 장부와 제곱 장부가 함께 달라지므로, 큰 변화율을 가진 좌표는 언제나 덜 움직인다고 말할 수 없습니다.</p><p className="leading-8">빈 장부를 0으로 시작하면 처음 기록은 새 신호의 일부만 포함합니다. 이 초기 비중과 실제 신호의 크기를 구분하도록, 지금까지 들어온 비중의 합으로 각각 나눠 줍니다.</p><p className="leading-8">방향 장부에 두 번 새 신호를 넣은 뒤 남는 비중을 계산해 보겠습니다. 첫 신호는 처음에 0.1만큼 들어왔다가 다음에 0.9배가 되어 0.09만큼 남습니다. 둘째 신호는 0.1만큼 들어옵니다. 둘을 합한 0.19가 지금까지 실제 신호가 차지한 총 비중입니다.</p><p className="leading-8">따라서 방향 장부 −0.02를 0.19로 나누면 약 −0.105263입니다. 보정 후에도 첫 신호와 둘째 신호의 상대 비중은 같아지지 않습니다. 0.09 대 0.1의 관계를 유지한 채 전체 비중만 1에 맞춥니다. 최근 신호에 더 비중을 주는 선택과 빈 장부의 초기 영향을 서로 구별해야 합니다.</p><p className="leading-8">제곱 장부도 별도로 셉니다. 첫 0.001의 비중은 다음에 0.999배가 되어 0.000999로 남고, 새 비중 0.001을 더하면 0.001999입니다. 기록 0.007996을 이 수로 나누면 4입니다. 양쪽 장부는 남기는 비율이 다르므로 같은 보정 분모를 사용할 수 없습니다.</p><p className="leading-8">이 보정은 없는 정보를 새로 만들어 내지 않습니다. 처음 자료가 전체를 대표하지 못해도 그 사실을 알아내지 못합니다. 처음 0을 채워 놓았다는 계산상의 선택만 반영합니다.</p></section>
<section id="names" data-teach-level="3" className="space-y-6"><h2 className="text-2xl font-bold">6. 두 장부와 보정을 실제 이름에 연결합니다</h2><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr><th>먼저 본 역할</th><th>이름</th><th>첫 사례</th></tr></thead><tbody><tr><td>학습 중 바꾸는 값·현재 변화율</td><td>Parameter θ · gradient g</td><td>θ=3, g=2</td></tr><tr><td>부호를 유지한 평균 장부</td><td>First raw moment m</td><td>0.2→−0.02</td></tr><tr><td>제곱을 평균한 장부</td><td>Second raw moment v</td><td>0.004→0.007996</td></tr><tr><td>과거와 현재를 섞는 평균</td><td>Exponential moving average, EMA</td><td>β₁=.9, β₂=.999</td></tr><tr><td>빈 장부에서 시작한 비중 보정</td><td>Bias correction</td><td>m̂=m/(1−β₁ᵗ)</td></tr><tr><td>좌표별 크기로 방향을 나눔</td><td>Diagonal preconditioning</td><td>m̂/(√v̂+ε)</td></tr><tr><td>전체 이동 크기·분모의 작은 양수</td><td>Learning rate η · epsilon ε</td><td>.1 · 10⁻⁸</td></tr></tbody></table></div><p className="leading-8">Adam은 이 두 평균과 보정을 함께 사용하는 갱신 규칙입니다. 대각 형태라는 말은 각 좌표의 기록으로 그 좌표를 조절한다는 뜻이며, 좌표 사이 곡률 전체의 역행렬을 구했다는 뜻은 아닙니다.</p><AdamStateViz /></section>
<section id="moments" data-teach-level="3" className="space-y-6"><h2 className="text-2xl font-bold">7. 부호가 다른 신호를 두 장부에 다르게 반영합니다</h2><ExplainedFormula
          question="첫 gradient g=2에서 m₁=.2, v₁=.004가 되는 이유는 무엇인가요?"
          idea={
            <p>
              같은 gradient에서 signed value와 squared value를 만들고 서로 다른
              decay로 두 장부를 갱신합니다.
            </p>
          }
          formula={String.raw`\begin{aligned}r_t^m&=\beta_1m_{t-1}\\n_t^m&=(1-\beta_1)g_t\\m_t&=r_t^m+n_t^m\\r_t^v&=\beta_2v_{t-1}\\n_t^v&=(1-\beta_2)g_t^2\\v_t&=r_t^v+n_t^v\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}r_t^m&=\underbrace{\beta_1m_{t-1}}_{\text{과거 signed 방향 보존}}\\n_t^m&=\underbrace{(1-\beta_1)g_t}_{\text{현재 방향 추가}}\\m_t&=\underbrace{r_t^m+n_t^m}_{\text{두 방향 기여를 합성}}\\r_t^v&=\underbrace{\beta_2v_{t-1}}_{\text{과거 squared scale 보존}}\\n_t^v&=\underbrace{(1-\beta_2)g_t^2}_{\text{현재 magnitude 제곱 추가}}\\v_t&=\underbrace{r_t^v+n_t^v}_{\text{두 scale 기여를 합성}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`\beta_1m_{t-1}+(1-\beta_1)g_t`,
              annotation: [
                "과거와 현재 signed gradient를 decay-weighted 합으로 묶어",
                "first raw-moment state 갱신",
              ],
            },
            {
              expression: String.raw`g_t^2`,
              annotation: [
                "현재 gradient를 coordinate별로 제곱해",
                "부호 없는 magnitude signal 생성",
              ],
            },
            {
              expression: String.raw`\beta_2v_{t-1}+(1-\beta_2)g_t^2`,
              annotation: [
                "과거와 현재 squared signal을 합쳐",
                "second raw-moment state 갱신",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`m_t`,
              name: "First raw moment EMA",
              description: "Signed gradient history입니다.",
            },
            {
              symbol: String.raw`v_t`,
              name: "Second raw moment EMA",
              description: "Squared-gradient history입니다.",
            },
            {
              symbol: String.raw`\beta_1,\beta_2`,
              name: "Decay coefficients",
              description: "두 state의 기억 길이를 따로 정합니다.",
            },
          ]}
          assumptions={[
            "m₀=v₀=0입니다.",
            "Square는 coordinate-wise입니다.",
            "β₁=.9, β₂=.999 예시는 convention을 고정합니다.",
          ]}
          interpretation="m₁=.1×2=.2이고 v₁=.001×4=.004입니다. v에 평균을 뺀 centered deviation은 들어가지 않습니다."
        />
        <CodeViewButton
          onClick={() =>
            sidebar.open("moment-update", codeRefs["moment-update"])
          }
        /><p className="leading-8">같은 예의 두 번째 gradient −2를 넣으면 m₂=−0.02, v₂=0.007996입니다. v가 기록하는 것은 gradient 제곱이며, 평균에서 얼마나 벗어났는지의 제곱이 아닙니다. 매번 gradient가 2로 고정되어도 보정한 v̂는 4인 반면, 그 신호 자체의 분산은 0입니다.</p><p className="leading-8">
            m과 v는 β도 서로 달라 같은 시점의 과거 신호에 다른 가중치를 줍니다. v−m²을 계산했다고 두 장부가 동일한 가중치 분포의 평균과 제곱 평균이 되는 것이 아닙니다. 두
            장부가 과거를 다르게 반영하므로 v를 분산으로 해석하지 않습니다.
          </p></section>
<section id="bias-correction" data-teach-level="3" className="space-y-6"><h2 className="text-2xl font-bold">8. 초기 보정의 지수는 자료 묶음 수가 아니라 실제 갱신 수입니다</h2><ExplainedFormula
          question="Constant first gradient에서 왜 m̂₁=g, v̂₁=g²가 복원되나요?"
          idea={
            <p>
              0 initialization 때문에 한 번만 들어온 신규 mass가 1−β만큼
              작으므로, 누적된 mass 1−βᵗ로 나눕니다.
            </p>
          }
          formula={String.raw`\begin{aligned}\hat m_t&=m_t/(1-\beta_1^t)\\\hat v_t&=v_t/(1-\beta_2^t)\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}a_t&=\underbrace{1-\beta_1^t}_{\text{first EMA에 누적된 총 mass}}\\\hat m_t&=\underbrace{m_t/a_t}_{\text{작아진 first state scale 복원}}\\b_t&=\underbrace{1-\beta_2^t}_{\text{second EMA에 누적된 총 mass}}\\\hat v_t&=\underbrace{v_t/b_t}_{\text{작아진 squared state scale 복원}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`1-\beta_1^t`,
              annotation: [
                "first EMA가 지금까지 받은 coefficient mass를 계산해",
                "초기 0의 shrink 정도 측정",
              ],
            },
            {
              expression: String.raw`m_t/a_t`,
              annotation: [
                "first state를 누적 mass로 나눠",
                "signed scale 보정",
              ],
            },
            {
              expression: String.raw`v_t/b_t`,
              annotation: [
                "second state를 별도 누적 mass로 나눠",
                "squared scale 보정",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`t`,
              name: "Update index",
              description: "실제 optimizer update 횟수입니다.",
            },
            {
              symbol: String.raw`\hat m_t`,
              name: "Corrected first moment",
              description:
                "Initialization scale을 보정한 direction state입니다.",
            },
            {
              symbol: String.raw`\hat v_t`,
              name: "Corrected second moment",
              description: "Initialization scale을 보정한 squared state입니다.",
            },
          ]}
          assumptions={[
            "Update index는 skipped step에서 임의로 증가하지 않습니다.",
            "두 decay는 각자 exponent를 사용합니다.",
            "이 보정은 data sampling bias와 무관합니다.",
          ]}
          interpretation="t=1에서 m₁=(1−β₁)g를 같은 1−β₁로 나누므로 g가 되고, v도 같은 방식으로 g²를 복원합니다."
        /><p className="leading-8">첫 갱신은 m̂₁=0.2/0.1=2, v̂₁=0.004/0.001=4입니다. 둘째는 m̂₂=−0.02/(1−0.9²)=−0.105263…, v̂₂=0.007996/(1−0.999²)=4입니다. 부호가 반대인 신호가 방향 장부에서 거의 상쇄된 결과가 보정 뒤에도 남습니다.</p><p className="leading-8">두 자료 묶음을 모아 한 번 갱신했다면 t를 2로 세지 않습니다. 해당 parameter에 gradient가 없어 갱신하지 않은 경우나 수치 overflow로 건너뛴 경우도 사용하는 구현의 실제 state 증가 조건과 맞춰야 합니다. 이 보정은 잘못 표집한 자료나 편향된 정답을 바로잡는 기능이 아닙니다.</p></section>
<section id="trace" data-teach-level="4" className="space-y-6"><h2 className="text-2xl font-bold">9. 두 번째 이동이 약 0.005263인 이유를 끝까지 계산합니다</h2><p className="leading-8">첫 보정 방향은 2, 제곱 장부는 4이므로 분모는 2+10⁻⁸입니다. θ에서 0.1×2/(2+10⁻⁸)를 빼면 2.9000000005입니다. 둘째는 보정 방향 −0.105263…, 분모는 그대로 2+10⁻⁸이므로 약 0.0052631579를 더해 2.9052631584가 됩니다 (가정).</p><AlgorithmBlock title="두 갱신의 실제 순서를 적은 의사코드" input={["θ=3, m=v=0, β₁=.9, β₂=.999, η=.1, ε=10⁻⁸, g=[2,−2] (가정)"]} steps={[{code:"각 실제 갱신마다 t를 1 증가"},{code:"m ← β₁m + (1−β₁)g; v ← β₂v + (1−β₂)g²"},{code:"m̂ ← m/(1−β₁ᵗ); v̂ ← v/(1−β₂ᵗ)"},{code:"θ ← θ − ηm̂/(√v̂+ε)"}]} output="θ≈2.9000000005 → 2.9052631584; m·v·t를 함께 보존" /><p className="leading-8">여기서는 parameter 자체를 추가로 줄이는 weight decay를 0으로 두었습니다. 그 축소 규칙을 별도로 적용하는 <a href="/cs/ai/weight-decay">AdamW의 조건</a>을 현재 두 장부 계산과 구분합니다.</p></section>
<section id="source-moments" data-teach-level="5" className="space-y-6"><h2 className="text-2xl font-bold">10. 실제 원문의 두 저장 공간에 같은 2와 −2를 넣습니다</h2><p className="leading-8">고정 원문은 PyTorch v2.8.0, revision ba56102387ef21a3b04b357e5b183d48f0afefc7의 torch/optim/adam.py입니다. 실수 scalar parameter, weight decay=0, amsgrad=False, capturable=False, differentiable=False, maximize=False인 _single_tensor_adam 분기를 읽습니다.</p><CodeViewButton label="두 장부를 바꾸는 실제 원문" onClick={() => sidebar.open("moment-update", codeRefs["moment-update"])} /><p className="leading-8">447행 exp_avg.lerp_(grad, 1−device_beta1)는 저장한 평균에서 이번 gradient 쪽으로 0.1만큼 이동합니다. 즉 m+0.1(g−m)=0.9m+0.1g입니다. 첫 (m,g)=(0,2)는 0.2가 되고, 다음 (0.2,−2)는 −0.02가 됩니다.</p><p className="leading-8">464행은 exp_avg_sq에 beta2를 곱하고 addcmul_(grad,grad,value=1−beta2)로 현재 gradient 제곱의 0.001배를 더합니다. (v,g)=(0,2)에서 0.004, 다음 (0.004,−2)에서 0.007996입니다. 실제 변수 이름 exp_avg_sq의 sq는 평균을 뺀 분산이라는 뜻이 아니라 제곱한 gradient를 뜻합니다.</p></section>
<section id="preconditioning" data-teach-level="6" className="space-y-6"><h2 className="text-2xl font-bold">11. 실제 분모는 제곱근을 보정한 뒤 작은 양수를 더합니다</h2><ExplainedFormula
          question="같은 m̂인데 v̂가 1과 100인 두 좌표의 update가 왜 다른가요?"
          idea={
            <p>
              Squared-gradient history의 root를 denominator로 사용해 자주 큰
              gradient를 본 좌표의 direction을 더 작게 scale합니다.
            </p>
          }
          formula={String.raw`\begin{aligned}s_t&=\sqrt{\hat v_t}\\q_t&=s_t+\varepsilon\\d_t&=\hat m_t/q_t\\\theta_{t+1}&=\theta_t-\eta d_t\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}s_t&=\underbrace{\sqrt{\hat v_t}}_{\substack{\text{squared history를}\\\text{gradient scale로 복원}}}\\q_t&=\underbrace{s_t+\varepsilon}_{\substack{\text{0 나눗셈과}\\\text{작은 분모를 완화}}}\\d_t&=\underbrace{\hat m_t/q_t}_{\substack{\text{direction을 coordinate}\\\text{history scale로 나눔}}}\\\theta_{t+1}&=\underbrace{\theta_t-\eta d_t}_{\text{global LR를 곱해 이동}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`\sqrt{\hat v_t}`,
              annotation: [
                "squared-gradient history에 root를 취해",
                "gradient와 비교 가능한 coordinate scale 생성",
              ],
            },
            {
              expression: String.raw`s_t+\varepsilon`,
              annotation: [
                "scale에 epsilon을 더해",
                "0 division과 tiny denominator 완화",
              ],
            },
            {
              expression: String.raw`\hat m_t/q_t`,
              annotation: [
                "signed direction을 coordinate scale로 나눠",
                "adaptive direction 생성",
              ],
            },
            {
              expression: String.raw`\theta_t-\eta d_t`,
              annotation: [
                "adaptive direction에 global LR를 곱하고 빼서",
                "다음 parameter 확정",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`\varepsilon`,
              name: "Numerical epsilon",
              description: "Denominator convention에 포함되는 작은 양수입니다.",
            },
            {
              symbol: String.raw`d_t`,
              name: "Adaptive direction",
              description: "Coordinate별 history로 scale된 direction입니다.",
            },
            {
              symbol: String.raw`\eta`,
              name: "Global learning rate",
              description:
                "Adaptive direction 전체의 displacement scale입니다.",
            },
          ]}
          assumptions={[
            "Square root와 division은 coordinate-wise입니다.",
            "Epsilon placement와 dtype이 구현에 고정됩니다.",
            "Weight decay는 이 task-gradient path 밖에서 별도로 다룹니다.",
          ]}
          interpretation="m̂가 같고 ε를 무시하면 v̂=1은 1로, v̂=100은 10으로 나누므로 두 번째 coordinate step은 첫 번째의 1/10입니다."
        />
        <CodeViewButton
          onClick={() =>
            sidebar.open(
              "bias-correction-update",
              codeRefs["bias-correction-update"],
            )
          }
        /><p className="leading-8">519–524행은 1−β₁ᵗ, 1−β₂ᵗ와 η/(1−β₁ᵗ)를 계산합니다. 533행의 분모는 sqrt(v)/sqrt(1−β₂ᵗ)+ε입니다. 실수 양의 값에서는 sqrt(v̂)+ε와 같은 수학식이며, 유한 정밀도의 연산 순서는 구현에 남습니다.</p><p className="leading-8">첫 사례의 두 번째 상태 t=2, m=−0.02, v=0.007996을 넣으면 step_size=0.1/0.19≈0.5263157895, 분모=2+10⁻⁸입니다. 535행 param.addcdiv_(exp_avg,denom,value=−step_size)는 약 −0.5263157895×(−0.02)/(2+10⁻⁸)을 더합니다. 9절의 증가량 약 0.0052631579와 같습니다.</p><p className="leading-8">ε를 sqrt(v̂+ε)처럼 제곱근 안에 넣으면 다른 규칙이 됩니다. m̂와 v̂가 모두 0인 상태에서는 ε가 없을 때 0/0이 생깁니다. 반대로 이전 m이 남아 있다면 이번 gradient가 0이어도 parameter가 계속 움직일 수 있습니다.</p></section>
<section id="release-boundary" data-teach-level="7" className="space-y-6"><h2 className="text-2xl font-bold">12. 같은 한 단계 계산과 전체 학습의 수렴은 다른 검증입니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Parameter identity별 m·v·step, β₁·β₂·ε, moment dtype, gradient
            clipping과 AMP skip 순서, LR schedule을 checkpoint와 receipt에
            넣습니다. 같은 training loss만으로 convergence나 validation 우월성을
            결론내리지 않습니다.
          </p>
        </div>
        <div id="paper-adam" className="scroll-mt-24">
          <CitationBlock
            source="Adam: A Method for Stochastic Optimization"
            citeKey={1}
            href="https://arxiv.org/abs/1412.6980"
          >
            <strong>문제:</strong> Noisy·sparse gradient의 coordinate scale
            차이. <strong>기여:</strong> First·second raw-moment EMA와
            initialization bias correction을 결합한 adaptive update.{" "}
            <strong>전제:</strong> 논문의 stochastic
            objective·bounded-gradient·online convex analysis와 실험 조건.{" "}
            <strong>근거 범위:</strong> 원문의 알고리즘과 공개 benchmark. 원래 수렴 증명은 아래 후속 논문이 문제점을 지적했으므로 그대로 보장으로 사용하지 않습니다.{" "}
            <strong>과장 금지:</strong> 모든 nonconvex model에서 기본
            hyperparameter가 최선이거나 SGD보다 항상 우월하다는 뜻은 아닙니다.
          </CitationBlock>
        </div>
        <div id="paper-adam-convergence" className="scroll-mt-24">
          <CitationBlock
            source="On the Convergence of Adam and Beyond"
            citeKey={2}
            href="https://arxiv.org/abs/1904.09237"
          >
            <strong>문제:</strong> Adaptive step history가 특정 convex
            example에서 convergence를 깨뜨릴 수 있는 문제.{" "}
            <strong>기여:</strong> Failure example과 장기 memory 조건을 분석.{" "}
            <strong>전제:</strong> 논문의 convex online optimization
            construction. <strong>근거 범위:</strong> Adam convergence claim의
            경계와 제안 variant. <strong>과장 금지:</strong> 모든 실제 Adam
            training이 발산한다는 뜻은 아닙니다.
          </CitationBlock>
        </div><p className="leading-8">후속 논문의 실패 경로는 드물게 오는 큰 gradient의 영향이 빠르게 줄고, 그 사이 작은 반대 신호가 달라진 분모로 더 강하게 이동시키는 것입니다. 특정 볼록 문제에서도 장기 평균의 올바른 방향과 실제 누적 이동이 어긋날 수 있음을 보입니다. 첫 두 신호의 손계산은 상태 규칙을 확인할 뿐 이 수렴 반례를 재현한 실험은 아닙니다.</p><p className="leading-8">SGD와 비교할 때는 같은 초기값·자료 순서·갱신 예산을 두고 각각의 learning rate를 적절한 범위에서 조절합니다. 학습 오차와 검증 성능, 장부가 차지하는 메모리, 실제 경과 시간을 함께 기록해야 계산량과 결과를 비교할 수 있습니다.</p><p className="leading-8">Checkpoint에는 parameter와 연결된 m·v·step, β₁·β₂·ε, 정밀도와 이동 크기 일정, 건너뛴 갱신 처리를 저장합니다. 중간에 끊지 않은 실행과 재개한 실행의 다음 parameter·장부를 비교하고, 불일치하면 잘못된 상태로 진행하기 전 마지막 일치 상태로 돌아갑니다.</p><ContentBoundary article="adam-optimizer" /><h3 className="text-xl font-semibold">읽은 내용으로 예측해 보세요</h3><ol className="list-decimal space-y-3 pl-6"><li>2 다음에 −2가 들어오면 m은 거의 상쇄되지만 v가 계속 양수인 이유는 무엇일까요? (답: 7절)</li><li>두 묶음을 누적해 처음으로 한 번 갱신했다면 초기 보정에는 t=1과 t=2 중 무엇을 쓸까요? (답: 8절)</li><li>두 번째 갱신의 증가량 약 0.005263을 실제 addcdiv_ 입력에서 어떻게 복원할까요? (답: 11절)</li></ol></section>
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ torch: adamOptimizerTree }}
        projectMetas={{
          torch: {
            id: "torch",
            label: "PyTorch · Python",
            badgeClass: "bg-orange-500/10 border-orange-500 text-orange-700",
          },
        }}
      />
</article>;}

import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import { codeRefs } from "./codeRefs";
import { momentumOptimizerTree } from "./fileTree";
import { MomentumMemoryViz } from "../optimizers/viz/ModernOptimizerViz";

import NumericPath from "../../world-systems/NumericPath";
import AlgorithmBlock from "@/components/ui/algorithm-block";

export default function MomentumOptimizerArticle(){ const sidebar=useCodeSidebar();return <article className="space-y-16">
<section id="overview" data-teach-level="S" className="space-y-6"><h2 className="text-2xl font-bold">1. 방향이 바뀌어도, 쌓인 기록 때문에 잠시 더 움직일 수 있습니다</h2><p className="leading-8">학습 중인 숫자가 3에서 시작하고 세 번 연속으로 계산한 오차 변화율이 1, 1, −1이라고 합시다. 이번 변화율만 따라가면 두 번은 숫자를 줄이고 세 번째에는 늘립니다. 그런데 직전 방향 기록의 90%를 남기고 이번 변화율을 더하면 세 번째 기록도 여전히 양수입니다 (가정).</p><p className="leading-8">초기 기록이 0이면 기록은 1→1.9→0.71로 바뀝니다. 매번 기록의 0.1배를 현재 숫자에서 빼면 숫자는 3→2.9→2.71→2.639로 움직입니다 (가정). 새 신호는 방향을 바꾸라고 하지만 과거의 두 신호가 아직 남아 있습니다.</p><p className="leading-8">이 글에서는 방향 기록 하나가 어떤 정보를 보관하는지, 왜 방향 전환이 늦을 수 있는지, 그리고 같은 세 신호를 실제 구현이 어떻게 처리하는지 확인합니다.</p></section>
<section id="black-box" data-teach-level="B" className="space-y-6"><h2 className="text-2xl font-bold">2. 직전 기록을 줄이고, 새 방향을 더하고, 현재 값을 고칩니다</h2><p className="leading-8">한 번의 계산에는 이번 변화율, 직전 방향 기록, 현재 학습 값이 들어갑니다. 먼저 직전 기록에 0.9를 곱합니다. 여기에 새 변화율을 더해 기록을 갱신하고, 그 기록의 0.1배를 현재 값에서 뺍니다.</p><NumericPath title="세 번째 변화율 −1을 처리하는 계산" steps={[{label:"직전 기록",value:"1.9"},{label:"90%를 남김",value:"1.71"},{label:"새 신호 −1을 더함",value:"0.71"},{label:"2.71에서 .071을 뺌",value:"2.639"}]} /><p className="leading-8">모든 과거 신호를 목록으로 다시 읽지 않아도 됩니다. 같은 크기의 기록 하나를 바꿔 가며 다음 계산에 필요한 정보를 압축합니다.</p></section>
<section id="case" data-teach-level="0" className="space-y-6"><h2 className="text-2xl font-bold">3. 양수 두 번 뒤의 음수 한 번은 기록을 바로 뒤집지 못합니다</h2><p className="leading-8">첫 번째는 0.9×0+1=1, 두 번째는 0.9×1+1=1.9입니다. 세 번째에 −1이 들어와도 0.9×1.9−1=0.71입니다. 새 신호가 과거 기록을 일부 지웠지만 완전히 지우지는 못했습니다.</p><p className="leading-8">
            비교를 위해 새 변화율만 적용하면 3→2.9→2.8→2.9가 됩니다 (가정). 두 규칙에 같은 변화율 목록을 넣어도 도착하는 숫자는 다릅니다. 이 목록은 비교용으로 정한
            값이므로 실제 한 함수에서 서로 다른 경로를 따라 구한 변화율이 같다고 주장하는 실험은 아닙니다.
          </p><p className="leading-8">신호가 1, −1, 1로 번갈아 온다면 기록은 1, −0.1, 0.91입니다 (가정). 부호가 바뀔 때마다 이전 기록과 새 신호가 부분적으로 상쇄됩니다.</p></section>
<section id="parts" data-teach-level="1" className="space-y-6"><h2 className="text-2xl font-bold">4. 학습 값과 방향 기록은 재개할 때 함께 필요합니다</h2><p className="leading-8">현재 숫자 2.71만 저장하면 세 번째 계산을 복원할 수 없습니다. 직전 기록 1.9도 있어야 0.71을 만들 수 있습니다. 기록을 0으로 잘못 시작하면 −1이 되어, 새 숫자도 2.639 대신 2.81이 됩니다.</p><p className="leading-8">
            여러 학습 값이 있으면 각 값에 대응하는 기록이 필요합니다. 배열의 순서를 바꾼 뒤 기록을 이전 순서대로 붙이면, 다른 값의 방향 기억을 사용합니다. 어떤 값의
            기록인지까지 보존해야 합니다.
          </p><p className="leading-8">입력 변화율, 이어지는 기록, 이동한 값을 구분했습니다. 이제 오래된 기억을 얼마나 남겨야 하는지 살펴봅니다.</p></section>
<section id="why-memory" data-teach-level="2" className="space-y-6"><h2 className="text-2xl font-bold">5. 오래된 방향을 남기는 비율은 잡음과 방향 전환을 함께 바꿉니다</h2><p className="leading-8">작은 신호가 좌우로 번갈아 흔들리고 다른 방향은 계속 같은 부호라면, 번갈아 흔들린 기여는 상쇄되고 지속된 기여는 쌓일 수 있습니다. 하지만 지형이 바뀌어 이제 반대로 가야 할 때도 오래된 기여는 그대로 남습니다.</p><p className="leading-8">첫 사례의 0.9를 0으로 바꾸면 기록은 매번 새 변화율과 같아집니다. 반대로 1에 가깝게 만들면 오래전 기여도 더 오래 남습니다. 새 방향에 빠르게 반응하는 성질과 방향을 부드럽게 유지하는 성질 사이에 선택이 생깁니다.</p><p className="leading-8">숫자 0.9만으로 좋은 이동을 보장할 수는 없습니다. 실제로 빼는 크기 0.1과 오차 곡선의 굽음까지 함께 결과를 결정합니다.</p></section>
<section id="names" data-teach-level="3" className="space-y-6"><h2 className="text-2xl font-bold">6. 먼저 본 역할을 실제 이름과 연결합니다</h2><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr><th>먼저 본 역할</th><th>이름</th><th>첫 사례</th></tr></thead><tbody><tr><td>학습 중 바꾸는 값</td><td>Parameter θ</td><td>3→2.9</td></tr><tr><td>현재 값에서 구한 오차 변화율</td><td>Gradient g</td><td>1, 1, −1</td></tr><tr><td>직전 기록에 남기는 비율</td><td>Decay β</td><td>0.9</td></tr><tr><td>과거와 현재 방향의 누적 기록</td><td>Momentum buffer / velocity v</td><td>1, 1.9, 0.71</td></tr><tr><td>기록을 이동량으로 바꾸는 크기</td><td>Learning rate η</td><td>0.1</td></tr><tr><td>오래된 신호를 지수적으로 줄이는 평균</td><td>Exponential moving average, EMA</td><td>같은 β를 거듭 곱함</td></tr></tbody></table></div><p className="leading-8">여기서 v는 아직 η를 곱하지 않은 gradient 크기의 기록입니다. 어떤 문헌은 실제 이동량을 velocity라고 부르므로, 이름만 보고 식을 섞지 않고 무엇이 저장되는지부터 확인합니다.</p><MomentumMemoryViz /></section>
<section id="ema" data-teach-level="3" className="space-y-6"><h2 className="text-2xl font-bold">7. 같은 기억도 현재 신호 앞의 계수에 따라 크기가 달라집니다</h2><ExplainedFormula
          question="β=.9일 때 10 step 전 신호의 상대 가중치와 실제 계수는 어떻게 다른가요?"
          idea={
            <p>
              재귀식에서 직전 state를 반복 대입하면 과거 gradient마다 β의 시간
              차 거듭제곱이 붙습니다.
            </p>
          }
          formula={String.raw`\begin{aligned}m_t&=\beta m_{t-1}+(1-\beta)g_t\\m_t&=(1-\beta)\sum_{j=0}^{t-1}\beta^jg_{t-j}\end{aligned}`}
          annotatedFormula={String.raw`\begin{gathered}\begin{aligned}m_t&=\beta m_{t-1}+(1-\beta)g_t\\m_t&=(1-\beta)\sum_{j=0}^{t-1}\beta^jg_{t-j}\end{aligned}\\[8pt]\begin{aligned}r_t&=\underbrace{\beta m_{t-1}}_{\text{직전 memory를 beta만큼 보존}}\\n_t&=\underbrace{(1-\beta)g_t}_{\text{현재 gradient의 새 기여를 추가}}\\m_t&=\underbrace{r_t+n_t}_{\text{보존분과 신규분을 한 state로 합성}}\end{aligned}\end{gathered}`}
          operations={[
            {
              expression: String.raw`\beta m_{t-1}`,
              annotation: [
                "직전 memory에 beta를 곱해",
                "과거 signal을 한 단계 감쇠",
              ],
            },
            {
              expression: String.raw`(1-\beta)g_t`,
              annotation: [
                "현재 gradient에 남은 mass를 곱해",
                "새 signal의 기여 추가",
              ],
            },
            {
              expression: String.raw`r_t+n_t`,
              annotation: [
                "과거 보존분과 현재 기여를 더해",
                "고정 크기 EMA state 갱신",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`m_t`,
              name: "EMA state",
              description: "시점 t의 normalized moving average입니다.",
            },
            {
              symbol: String.raw`\beta`,
              name: "Decay",
              description: "과거 state를 유지하는 0–1 coefficient입니다.",
            },
            {
              symbol: String.raw`g_t`,
              name: "Current signal",
              description: "이번 step의 gradient입니다.",
            },
          ]}
          assumptions={[
            "0≤β<1입니다.",
            "여기서는 (1−β)를 쓰는 normalized EMA convention입니다.",
            "Step 간격이 같은 optimizer update clock입니다.",
          ]}
          interpretation="10 step 전 상대 weight는 .9¹⁰≈.349입니다. 실제 absolute coefficient에는 현재식 convention의 (1−β)도 곱해집니다."
        /><p className="leading-8">Normalized EMA는 새 신호에 1−β도 곱합니다. 첫 사례의 1, 1, −1을 넣으면 m은 0.1, 0.19, 0.071입니다. β가 고정되고 초기 상태가 모두 0이면 m=(1−β)v이므로 v의 정확히 0.1배입니다.</p><p className="leading-8">이 m을 원래 η=0.1로 그대로 빼면 이동량도 10분의 1이 됩니다. 동일한 경로를 만들려면 이 조건에서는 m에 곱할 이동 크기를 η/(1−β)=1로 바꿔야 합니다. β가 변하거나 초기 상태가 다르면 이 단순 비례를 그대로 쓸 수 없습니다.</p><p className="leading-8">10단계 전 신호의 상대 가중치는 0.9¹⁰≈0.348678입니다. 정규화한 평균에서 그 신호의 실제 계수는 0.1×0.9¹⁰≈0.034868입니다. 최근 10개만 남기는 창과 달리, 더 오래된 기여도 0이 되지 않습니다.</p></section>
<section id="trace" data-teach-level="4" className="space-y-6"><h2 className="text-2xl font-bold">8. 같은 세 변화율을 기록과 학습 값에 차례로 적용합니다</h2><p className="leading-8">갱신 직전 값과 직전 기록을 한 쌍으로 읽습니다. 첫 쌍 (3,0)은 (2.9,1)로, 둘째는 (2.71,1.9)로, 셋째는 (2.639,0.71)로 바뀝니다. 셋째에서도 parameter가 감소한 이유는 gradient −1이 아니라 누적된 velocity 0.71을 빼기 때문입니다.</p><AlgorithmBlock title="첫 사례를 다시 계산하는 의사코드" input={["θ=3, v=0, β=.9, η=.1, gradient 목록 [1,1,−1] (가정)"]} steps={[{code:"각 g마다: v ← .9v + g"},{code:"θ ← θ − .1v"},{code:"(θ,v)를 함께 저장: (2.9,1), (2.71,1.9), (2.639,.71)"}]} output="새 gradient가 음수여도 마지막 θ는 감소" /><p className="leading-8">새 gradient가 0이어도 기존 v가 남아 있으면 다음 v=0.9v가 되어 움직일 수 있습니다. 이번 자료에서 gradient가 0이라는 사실과 parameter가 멈춘다는 사실을 구별해야 합니다.</p></section>
<section id="velocity" data-teach-level="5" className="space-y-6"><h2 className="text-2xl font-bold">9. 실제 PyTorch 원문도 기록을 먼저 고친 뒤 이동에 사용합니다</h2><ExplainedFormula
          question="Gradient가 1,1,1이고 β=.9이면 velocity가 왜 1,1.9,2.71인가요?"
          idea={
            <p>
              Unnormalized convention에서는 직전 velocity를 β배 남기고 현재
              gradient를 그대로 더한 뒤 그 방향의 반대로 이동합니다.
            </p>
          }
          formula={String.raw`\begin{aligned}v_t&=\beta v_{t-1}+g_t\\\theta_{t+1}&=\theta_t-\eta v_t\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}r_t&=\underbrace{\beta v_{t-1}}_{\text{직전 velocity를 감쇠해 보존}}\\v_t&=\underbrace{r_t+g_t}_{\text{현재 gradient를 memory에 누적}}\\\theta_{t+1}&=\underbrace{\theta_t-\eta v_t}_{\text{velocity 반대 방향으로 parameter 이동}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`\beta v_{t-1}`,
              annotation: [
                "직전 velocity에 beta를 곱해",
                "과거 방향을 감쇠 보존",
              ],
            },
            {
              expression: String.raw`r_t+g_t`,
              annotation: [
                "보존된 방향과 현재 gradient를 더해",
                "새 velocity 생성",
              ],
            },
            {
              expression: String.raw`\theta_t-\eta v_t`,
              annotation: [
                "velocity에 learning rate를 곱하고 빼서",
                "parameter를 descent 방향으로 이동",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`v_t`,
              name: "Velocity",
              description: "Gradient history를 누적한 optimizer state입니다.",
            },
            {
              symbol: String.raw`\eta`,
              name: "Learning rate",
              description: "Velocity를 parameter displacement로 바꿉니다.",
            },
            {
              symbol: String.raw`\theta_t`,
              name: "Parameter",
              description: "현재 model state입니다.",
            },
          ]}
          assumptions={[
            "Unnormalized momentum convention을 사용합니다.",
            "β와 η가 update clock마다 명시됩니다.",
            "Nesterov look-ahead는 포함하지 않습니다.",
          ]}
          interpretation="v₁=1, v₂=.9×1+1=1.9, v₃=.9×1.9+1=2.71입니다. 같은 방향이 지속되면 state가 커집니다."
        />
        <CodeViewButton
          onClick={() =>
            sidebar.open("velocity-update", codeRefs["velocity-update"])
          }
        />
<p className="leading-8">고정 원문은 PyTorch v2.8.0, revision ba56102387ef21a3b04b357e5b183d48f0afefc7의 torch/optim/sgd.py입니다. Weight decay=0, dampening=0, nesterov=False, maximize=False와 scalar lr=0.1을 전제로 _single_tensor_sgd의 354–375행을 읽습니다.</p><p className="leading-8">기록이 처음 없을 때 358행은 grad를 복사합니다. 따라서 첫 g=1이면 buf=1이며, 0으로 시작해 0.9×0+1을 계산한 사례와 같습니다. 다음부터 361행의 buf.mul_(momentum).add_(grad, alpha=1−dampening)이 1→1.9→0.71을 만듭니다.</p><p className="leading-8">366행은 갱신한 buf를 이동 방향으로 고릅니다. 375행 param.add_(grad, alpha=−lr)에 세 번째 param=2.71, grad=0.71, lr=0.1을 넣으면 2.639가 저장됩니다. Dampening이 0이 아니면 새 신호의 계수가 달라지며, 첫 buffer의 초기화도 재귀식에 0을 대입한 경우와 별도로 확인해야 합니다.</p></section>
<section id="nesterov" data-teach-level="6" className="space-y-6"><h2 className="text-2xl font-bold">10. Nesterov 분기는 같은 기록에서 다른 최종 방향을 만듭니다</h2><p className="leading-8">기록을 이용해 앞쪽 지점의 변화율을 보는 변형을 Nesterov momentum이라고 부릅니다. v를 아직 η를 곱하지 않은 기록으로 정의한 한 가지 look-ahead 표기는 vₜ=βvₜ₋₁+∇f(θₜ₋₁−ηβvₜ₋₁), θₜ=θₜ₋₁−ηvₜ입니다. 미리 보는 위치에도 η가 있어야 기록을 실제 이동 거리로 바꿉니다.</p><p className="leading-8">PyTorch의 고정 원문은 이 식을 줄마다 그대로 옮긴 구현이 아닙니다. 361행에서 buf를 갱신한 뒤, nesterov=True이면 364행의 grad.add(buf, alpha=momentum)으로 최종 방향을 만듭니다. Parameter를 재정의한 표현과 평가 위치가 있으므로 두 표기의 θ를 동일한 값이라 놓고 한 단계 수치를 섞으면 안 됩니다.</p><CodeViewButton label="Nesterov 분기의 실제 원문" onClick={() => sidebar.open("nesterov-formulation", codeRefs["nesterov-formulation"])} /><p className="leading-8">비교를 위해 세 번째 갱신 직전 상태만 동일하게 param=2.71, buf=1.9, 이번 grad=−1로 고정합니다 (가정). 새 buf는 0.71이고 이 분기의 최종 방향은 −1+0.9×0.71=−0.361입니다. 따라서 다음 param은 2.71−0.1×(−0.361)=2.7461입니다.</p><p className="leading-8">일반 momentum 분기에서 얻은 2.639와 달리 증가합니다. 이는 같은 진입 상태에서 두 코드 분기를 비교한 결과이며, 처음부터 Nesterov로 세 번 학습한 경로라고 해석하지 않습니다. 실제 경로가 다르면 이후 평가 위치와 gradient도 달라질 수 있습니다.</p></section>
<section id="damping-boundary" data-teach-level="7" className="space-y-6"><h2 className="text-2xl font-bold">11. 기억이 커지는 것과 학습이 좋아지는 것을 구별합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Sharp curvature에서 velocity가 minimum을 지나치거나 learning-rate
            schedule 변화 뒤 stale direction이 남을 수 있습니다. SGD와 같은
            initialization·data order·effective batch·update budget에서 loss
            trajectory·update norm·validation을 비교합니다.
          </p>
        </div>
        <div id="paper-polyak" className="scroll-mt-24">
          <CitationBlock
            source="Some Methods of Speeding Up the Convergence of Iteration Methods"
            citeKey={1}
            href="https://doi.org/10.1016/0041-5553(64)90137-5"
          >
            <strong>문제:</strong> 반복 최적화의 느린 수렴.{" "}
            <strong>기여:</strong> 이전 iterate를 사용하는 multi-step
            acceleration 계열을 분석. <strong>전제:</strong> 논문의
            objective·iteration·parameter 조건. <strong>근거 범위:</strong>{" "}
            원문의 deterministic iteration 분석. <strong>과장 금지:</strong>{" "}
            현대 stochastic deep network에서 β=.9가 보편 최적이거나 overshoot가
            사라진다는 뜻은 아닙니다.
          </CitationBlock>
        </div><p className="leading-8">첫 사례에서 방향 전환이 늦는 현상은 확인했지만, 실제 최솟값을 지나쳤는지는 함수와 위치가 있어야 판단할 수 있습니다. 예를 들어 f(θ)=θ²/2에서 θ=0.1, 이전 v=2, β=0.9, η=0.1이면 현재 gradient는 0.1, 새 v=1.9, 다음 θ=−0.09로 최솟값 0을 지나칩니다 (가정). 여러 단계의 오차와 이동 경로를 함께 보아야 좋고 나쁨을 평가할 수 있습니다.</p><p className="leading-8">재개 검증은 같은 parameter와 buffer, β, η 일정, 갱신 횟수, 다음 자료 순서를 저장한 실행과 중간에 끊지 않은 실행을 비교합니다. 복원 뒤 다음 이동이 다르면 값과 기록의 연결, 누락된 상태, 정밀도부터 확인하고 잘못된 checkpoint로 이어 학습하지 않습니다.</p><ContentBoundary article="momentum-optimizer" /><h3 className="text-xl font-semibold">읽은 내용으로 예측해 보세요</h3><ol className="list-decimal space-y-3 pl-6"><li>세 번째 gradient가 −1인데도 parameter가 2.71에서 2.639로 줄어드는 이유는 무엇일까요? (답: 8절)</li><li>β=0.9의 정규화한 EMA를 같은 η로 대신 사용하면 이동량은 어떻게 달라질까요? (답: 7절)</li><li>같은 세 번째 진입 상태에서 Nesterov 분기의 새 parameter는 왜 2.7461일까요? (답: 10절)</li></ol></section>
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ torch: momentumOptimizerTree }}
        projectMetas={{
          torch: {
            id: "torch",
            label: "PyTorch · Python",
            badgeClass: "bg-orange-500/10 border-orange-500 text-orange-700",
          },
        }}
      />
</article>;}

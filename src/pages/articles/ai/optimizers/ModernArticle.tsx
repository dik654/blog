import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import { SgdUpdateViz } from "./viz/ModernOptimizerViz";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import { codeRefs } from "./codeRefs";
import { transformersTree, sgdTree } from "./fileTree";


import NumericPath from "../../world-systems/NumericPath";
import AlgorithmBlock from "@/components/ui/algorithm-block";

export default function OptimizersArticle(){const sidebar=useCodeSidebar();return <> <article className="space-y-16">
<section id="overview" data-teach-level="S" className="space-y-6"><h2 className="text-2xl font-bold">1. 여러 묶음에서 계산한 변화율을 모아 숫자를 한 번 고칩니다</h2>
<p className="leading-8">학습 중인 숫자가 3이고, 현재 오차를 줄일 방향을 계산하려고 자료 8개를 읽는다고 합시다. 한꺼번에 읽기 어려워 2개와 6개로 나눴습니다. 첫 묶음의 오차 합은 2, 둘째 합은 18이며, 학습 중인 숫자에 대한 변화율 합은 각각 4와 28입니다 (가정).</p><p className="leading-8">여덟 자료를 같은 비중으로 보면 오차 평균은 20/8=2.5, 변화율 평균은 32/8=4입니다. 이동 크기를 0.1로 정하면 현재 숫자에서 0.4를 빼서 2.6으로 바꿉니다 (가정). 자료를 나눠 읽었어도 목표가 여덟 자료의 평균이라면 이 결과를 유지해야 합니다.</p><p className="leading-8">이 글은 변화율을 만드는 계산과, 그 결과로 숫자를 실제로 바꾸는 규칙을 구분합니다. 특히 자료를 나눠 읽을 때 무엇을 먼저 모으고 언제 한 번 갱신하는지 끝까지 추적합니다.</p>
<p className="font-semibold">그림을 보기 전에 세 가지를 예측해 보세요.</p><ol className="list-decimal space-y-2 pl-6"><li>크기 2와 6인 두 묶음의 변화율 합 4와 28을 전체 8개로 나누면 평균은 4일까요?</li><li>묶음 평균 2와 14/3을 반씩 섞어도 같은 평균 4가 될까요?</li><li>η=0.1이면 parameter 3에서 0.4를 빼 한 번만 2.6으로 갱신할까요?</li></ol><p>답은 <strong>예, 아니요, 예</strong>입니다. 서로 다른 크기의 묶음은 원래 항목의 합과 분모를 보존하고, 같은 parameter에서 기여를 모두 모은 뒤 한 번 갱신해야 합니다.</p><SgdUpdateViz /><ContentBoundary article="optimizers" />
</section>
<section id="black-box" data-teach-level="B" className="space-y-6"><h2 className="text-2xl font-bold">2. 현재 값을 고정하고, 기여를 모으고, 마지막에 한 번 움직입니다</h2>
<p className="leading-8">처음 두 묶음은 모두 같은 현재 값 3을 사용해 오차와 변화율을 계산합니다. 각 묶음의 합을 모은 뒤 전체 자료 수 8로 나눕니다. 이동 크기 0.1을 곱한 방향을 현재 값에 적용하는 것은 마지막 한 번입니다.</p><NumericPath title="두 묶음이 하나의 갱신으로 합쳐집니다" steps={[{label:"고정한 현재 값",value:"3"},{label:"변화율 합",value:"4 + 28"},{label:"전체 8개로 평균",value:"4"},{label:"0.1배를 빼기",value:"2.6"}]} /><p className="leading-8">2개짜리 묶음을 처리한 직후 값을 고치면 다음 6개는 다른 시작점에서 계산됩니다. 이 차이가 왜 중요한지 작은 장부부터 확인합니다.</p>
</section>
<section id="case" data-teach-level="0" className="space-y-6"><h2 className="text-2xl font-bold">3. 묶음 평균을 똑같이 평균하면 짧은 묶음이 과대평가됩니다</h2>
<p className="leading-8">첫 묶음 자체의 오차 평균은 2/2=1, 둘째는 18/6=3입니다. 두 평균을 다시 반씩 섞으면 2가 됩니다. 전체 자료를 같은 비중으로 셌을 때의 2.5와 다릅니다. 첫 두 자료가 절반의 비중을 받고 나머지 여섯 자료도 절반만 받았기 때문입니다.</p><p className="leading-8">변화율에서도 같은 문제가 생깁니다. 두 묶음 평균 4/2=2와 28/6=14/3을 반씩 섞으면 10/3입니다. 이동 크기 0.1로 숫자 3을 고치면 약 2.666667이 되어, 전체 평균 변화율 4로 얻은 2.6과 다릅니다.</p><p className="leading-8">합계를 어떤 개수로 나누는지가 학습 목표를 바꿉니다. 이 예의 손실합과 변화율합은 설명을 위한 가정 값이며, 특정 모델을 실행해 측정한 결과는 아닙니다.</p>
</section>
<section id="parts" data-teach-level="1" className="space-y-6"><h2 className="text-2xl font-bold">4. 합계를 저장하는 곳과 현재 숫자를 바꾸는 곳을 나눕니다</h2>
<p className="leading-8">계산 안에는 현재 값 3을 보관하는 곳, 묶음별 변화율 4와 28을 더하는 곳, 전체 개수 8을 세는 곳이 있습니다. 이 셋을 읽어 평균 4를 만드는 계산과, 3에서 0.4를 빼는 계산은 다른 단계입니다.</p><p className="leading-8">
            앞 묶음의 계산을 끝냈다고 현재 값을 덮어쓰면 뒤 묶음은 같은 함수의 같은 지점에서 구한 변화율이 아닙니다. 자료 묶음을 합치는 동안에는 현재 값을 보존하고, 합산한 변화율을
            적용할 때만 바꿉니다. 다음 갱신을 시작할 때는 이전 합계를 지워야 같은 값을 중복해서 더하지 않습니다.
          </p><p className="leading-8">갱신 순서가 고정됐습니다. 한 번의 이동이 언제 실패할 수 있는지 확인한 뒤 이 상태들에 이름을 붙입니다.</p>
<p className="leading-8">이 계산에서 개수 8은 저장한 파일 수가 아니라 같은 비중으로 점수를 매기기로 한 자료의 수입니다. 숫자를 담을 자리를 맞추려고 덧붙인 빈칸까지 세면, 오차를 만들지 않은 빈칸이 분모만 키웁니다. 같은 실제 자료라도 빈칸을 얼마나 붙였는지에 따라 이동량이 바뀌게 됩니다.</p><p className="leading-8">평균의 단위 자체를 다르게 정할 수도 있습니다. 예를 들어 짧은 문장 하나와 긴 문장 하나를 같은 비중으로 평가하려면 두 문장의 평균을 반씩 섞는 목표가 맞을 수 있습니다. 그러나 모든 유효 위치를 같은 비중으로 평가하기로 했다면, 2개짜리와 6개짜리 묶음에 반씩 배분하는 계산은 다른 목표입니다.</p><p className="leading-8">따라서 2와 2.5 중 숫자가 더 작다는 이유로 하나를 고르지 않습니다. 어떤 항목을 한 표로 세기로 했는지 먼저 정하고, 자료를 나누기 전후에 그 비중을 유지했는지 확인합니다. 첫 사례는 여덟 위치에 같은 비중을 주는 목표로 고정했습니다.</p><p className="leading-8">일부 묶음에 유효한 항목이 하나도 없다면 그 묶음 자체의 평균은 정의할 수 없습니다. 전체를 모아 유효한 개수가 남았는지 확인하고, 전체도 0이면 나누기와 갱신을 건너뛸 규칙이 필요합니다.</p></section>
<section id="why-step-size" data-teach-level="2" className="space-y-6"><h2 className="text-2xl font-bold">5. 현재의 변화율은 멀리 이동한 뒤까지 예언하지 않습니다</h2>
<p className="leading-8">변화율 4는 현재 값 3 근처에서 오차가 어느 방향으로 증가하는지 나타냅니다. 이를 반대로 적용해 2.6으로 옮기는 것은 작은 이동을 택한 계산입니다. 움직이는 중 곡선의 기울기가 바뀔 수 있으므로 이동 크기를 무작정 키우면 오차가 커질 수 있습니다.</p><p className="leading-8">예를 들어 오차가 (θ−1)²이면 θ=3에서 변화율은 4입니다 (가정). 이동 크기 0.1을 쓰면 θ=2.6에서 오차 2.56으로 줄지만, 이동 크기 2를 쓰면 θ=−5에서 오차 36으로 커집니다. 한 지점의 올바른 변화율과 좋은 전체 학습 결과는 같은 주장이 아닙니다.</p><p className="leading-8">어느 방향과 얼마나 멀리를 분리해야 하는 이유가 보였습니다. 실제 코드에서 이 둘이 어떤 이름으로 저장되는지 살펴봅니다.</p>
</section>
<section id="names" data-teach-level="3" className="space-y-6"><h2 className="text-2xl font-bold">6. 변화율과 실제 이동량을 다른 이름으로 부릅니다</h2>
<div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr><th>먼저 본 역할</th><th>이름</th><th>이번 사례</th></tr></thead><tbody><tr><td>학습 중 바꾸는 숫자</td><td>Parameter θ</td><td>3→2.6</td></tr><tr><td>오차를 parameter로 미분한 값</td><td>Gradient g</td><td>전체 평균 4</td></tr><tr><td>방향을 이동량으로 바꾸는 설정</td><td>Learning rate η</td><td>0.1</td></tr><tr><td>Gradient를 계산하는 역방향 과정</td><td>Backpropagation</td><td>현재 θ를 고정해 기여를 모음</td></tr><tr><td>Gradient와 내부 기록으로 이동을 정함</td><td>Optimizer update</td><td>이동량 −0.4</td></tr><tr><td>현재 gradient 반대 방향으로 η배 이동</td><td>SGD</td><td>3−.1×4</td></tr><tr><td>여러 묶음의 기여를 모아 한 번 갱신</td><td>Gradient accumulation</td><td>2개와 6개를 같은 θ에서 계산</td></tr><tr><td>한 번에 읽는 작은 묶음</td><td>Micro-batch</td><td>유효 자료 수 2 또는 6</td></tr><tr><td>실제 갱신 횟수의 기준</td><td>Update clock</td><td>두 backward, 한 update</td></tr></tbody></table></div><p className="leading-8">Optimizer가 추가로 보존하는 기록은 optimizer state입니다. 순수 SGD는 별도 방향 기록 없이 움직이지만, momentum과 Adam은 이후 이동에 사용할 장부도 함께 바꿉니다. Parameter별 gradient에서 실제 이동량을 만드는 일반 규칙을 9절에서 확인합니다.</p><p className="leading-8">용어가 바뀌어도 첫 사례의 합산과 갱신 순서는 그대로입니다. 전체 자료가 아주 많을 때 한 묶음의 변화율이 무엇을 대표하는지 짚고 넘어갑니다.</p>
</section>
<section id="gradient-estimate" data-teach-level="3" className="space-y-6"><h2 className="text-2xl font-bold">7. 한 묶음의 변화율은 전체 자료의 변화율과 다를 수 있습니다</h2>
<div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Dataset 전체를 매번 읽는 대신 현재 batch의 sample loss를 평균해
            gradient를 계산합니다. Batch sampler·loss reducer·augmentation
            seed가 바뀌면 같은 parameter에서도 다른 g가 나옵니다.
          </p>
          <p>
            그래서 optimizer 비교에서는 epoch 이름보다 processed sample과 optimizer update, effective batch를 함께 기록합니다.
          </p>
        </div><p className="leading-8">이번에는 고른 8개 전체의 평균을 정확히 계산했지만, 전체 데이터가 8개보다 많다면 그 8개의 평균도 전체 평균의 추정입니다. 어떤 자료를 뽑았는지에 따라 gradient가 달라집니다. 복원 추출·가중치·평균 방식 같은 조건을 고정해야 optimizer 규칙만 바꾼 비교인지 확인할 수 있습니다.</p><p className="leading-8">Deep Learning 5.9절 식 (5.98)은 고른 m′개 자료의 변화율을 평균해 g를 만듭니다. 여기서 m′=8, 개별 기여의 합 32를 넣으면 g=4입니다. 같은 가중치를 가진 독립적인 자료를 균등하게 고르는 조건과 임의로 가중한 표본은 구별합니다.</p>
</section>
<section id="trace" data-teach-level="4" className="space-y-6"><h2 className="text-2xl font-bold">8. 오차 2.5와 변화율 4를 구분해 3을 2.6으로 바꿉니다</h2>
<p className="leading-8">첫 묶음의 오차 합 2와 변화율 합 4, 둘째 묶음의 오차 합 18과 변화율 합 28을 각각 더합니다. 오차 장부는 20, 변화율 장부는 32가 됩니다. 전체 8개로 나누면 오차는 2.5, gradient는 4입니다.</p><p className="leading-8">Parameter에서 빼는 값은 오차 2.5가 아니라 learning rate와 gradient의 곱 0.1×4=0.4입니다. 따라서 3→2.6으로 갱신합니다. Gradient를 만든 backward 두 번과 parameter를 바꾼 update 한 번을 서로 다른 횟수로 기록합니다.</p><AlgorithmBlock title="서로 다른 크기의 두 묶음을 한 번의 SGD로 모으기 (의사코드)" input={["현재 θ=3, η=.1; 자료 수 2와 6; 변화율 합 4와 28 (가정)"]} steps={[{code:"같은 θ를 유지하며 각 묶음의 loss 합을 미분"},{code:"총 변화율 G ← 4+28; 총 개수 N ← 2+6"},{code:"g ← G/N = 4"},{code:"θ ← θ − ηg = 2.6; 이번 누적 gradient를 비움"}]} output="자료 8개 평균에 대한 parameter update 한 번" /><p className="leading-8">같은 자료의 수치가 최종 parameter까지 이어졌습니다. 다음 절에서 실제 프로그램이 이 마지막 이동을 어떤 연산으로 수행하는지 확인합니다.</p>
</section>
<section id="update-contract" data-teach-level="5" className="space-y-6"><h2 className="text-2xl font-bold">9. 실제 SGD 원문의 마지막 줄에 3, 4, 0.1을 넣습니다</h2>
<ExplainedFormula
          question="Training step에서 gradient가 어떻게 next parameter가 되나요?"
          idea={
            <p>
              Backward가 gradient를 만들고 optimizer가 update rule U를 적용합니다. 그 결과를 현재 parameter에서 빼거나 더합니다.
            </p>
          }
          formula={String.raw`\begin{aligned}g_t&=\nabla_\theta L_t(\theta_t)\\\Delta_t&=U(g_t,s_t)\\\theta_{t+1}&=\theta_t+\Delta_t\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}g_t&=\underbrace{\nabla_\theta L_t(\theta_t)}_{\substack{\text{현재 batch loss를}\\\text{parameter로 미분}}}\\\Delta_t&=\underbrace{U(g_t,s_t)}_{\substack{\text{gradient와 optimizer state를}\\\text{displacement로 변환}}}\\\theta_{t+1}&=\underbrace{\theta_t+\Delta_t}_{\text{현재 parameter에 이동량 적용}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`\nabla_\theta L_t`,
              annotation: [
                "loss를 parameter로 미분해",
                "local gradient estimate 생성",
              ],
            },
            {
              expression: String.raw`U(g_t,s_t)`,
              annotation: [
                "gradient와 optimizer state를 규칙에 넣어",
                "실제 이동량을 계산",
              ],
            },
            {
              expression: String.raw`\theta_t+\Delta_t`,
              annotation: [
                "현재 parameter에 displacement를 더해",
                "다음 model state 확정",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`\theta_t`,
              name: "Parameter state",
              description: "Update t 직전 model parameter입니다.",
            },
            {
              symbol: String.raw`g_t`,
              name: "Gradient estimate",
              description: "현재 batch objective의 local derivative입니다.",
            },
            {
              symbol: String.raw`s_t`,
              name: "Optimizer state",
              description: "Momentum·moment 같은 선택적 history입니다.",
            },
            {
              symbol: String.raw`\Delta_t`,
              name: "Displacement",
              description: "이번 update가 parameter를 움직이는 양입니다.",
            },
          ]}
          assumptions={[
            "Loss reduction과 gradient sign convention이 명시되어 있습니다.",
            "Update 중간에 parameter를 다른 owner가 바꾸지 않습니다.",
            "Optimizer state와 parameter identity가 맞습니다.",
          ]}
          interpretation="Backward와 optimizer를 분리하면 clipping·weight decay·AMP skip이 gradient 전후 어느 지점에 개입하는지 추적할 수 있습니다."
        /><div id="sgd-update" className="space-y-6"><ExplainedFormula
          question="θ=3, g=4, η=.1이면 왜 다음 parameter가 2.6인가요?"
          idea={
            <p>
              Gradient는 loss가 증가하는 방향입니다. 부호를 뒤집고 learning rate를 곱해 이동량을 만든 뒤 현재 parameter에 더합니다.
            </p>
          }
          formula={String.raw`\begin{aligned}\Delta_t&=-\eta g_t\\\theta_{t+1}&=\theta_t+\Delta_t\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}d_t&=\underbrace{-g_t}_{\text{loss 증가 방향을 descent 방향으로 반전}}\\\Delta_t&=\underbrace{\eta d_t}_{\text{descent 방향에 learning rate를 곱함}}\\\theta_{t+1}&=\underbrace{\theta_t+\Delta_t}_{\text{현재 parameter에 이동량 적용}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`-g_t`,
              annotation: [
                "gradient의 부호를 뒤집어",
                "loss를 낮추는 local direction 생성",
              ],
            },
            {
              expression: String.raw`\eta d_t`,
              annotation: [
                "direction에 learning rate를 곱해",
                "실제 displacement 크기 결정",
              ],
            },
            {
              expression: String.raw`\theta_t+\Delta_t`,
              annotation: [
                "현재 값과 displacement를 합쳐",
                "다음 parameter 저장",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`g_t`,
              name: "Mini-batch gradient",
              description: "현재 batch가 추정한 derivative입니다.",
            },
            {
              symbol: String.raw`\eta`,
              name: "Learning rate",
              description: "Global step-size scale입니다.",
            },
            {
              symbol: String.raw`\Delta_t`,
              name: "SGD displacement",
              description: "Parameter에 더할 signed movement입니다.",
            },
          ]}
          assumptions={[
            "η는 현재 update에 사용할 양수입니다.",
            "Gradient는 descent convention의 loss derivative입니다.",
            "Momentum·decay·clipping은 포함하지 않은 기준 SGD입니다.",
          ]}
          interpretation="−g=−4, η(−g)=−.4이고 3+(−.4)=2.6입니다. 한 step loss 감소나 global convergence는 별도 전제가 필요합니다."
        /></div><p className="leading-8">PyTorch v2.8.0의 _single_tensor_sgd를 고정 revision ba56102387ef21a3b04b357e5b183d48f0afefc7에서 확인했습니다. Momentum과 weight decay를 0으로 두고, 최대화 옵션을 끄며 scalar learning rate를 사용하면 375행의 param.add_(grad, alpha=−lr)가 이 예의 갱신입니다.</p><CodeViewButton label="실제 SGD parameter 갱신 원문" onClick={() => sidebar.open("sgd-basic", codeRefs["sgd-basic"])} /><p className="leading-8">param=3, grad=4, lr=0.1이면 add_는 3에 −0.1×4를 더해 2.6을 저장합니다. 이 함수가 gradient 4를 새로 미분해 만드는 것은 아닙니다. 다른 분기에는 momentum과 weight decay, tensor learning rate가 있으므로 이번 조건을 지우고 모든 호출이 같은 한 줄이라고 일반화하지 않습니다.</p><p className="leading-8">최종 갱신과 그 입력이 연결됐습니다. 그 gradient를 만드는 loss의 공통 분모가 실제 코드에서도 유지되는지 확인하겠습니다.</p>
</section>
<section id="effective-batch" data-teach-level="6" className="space-y-6"><h2 className="text-2xl font-bold">10. 실제 loss 함수는 받은 공통 분모로 각 합을 나눕니다</h2>
<ExplainedFormula
          question="Micro-batch 4를 8번 처리하면 effective batch 32가 되는 경계는 무엇인가요?"
          idea={
            <p>
              각 micro-batch gradient를 같은 parameter snapshot에서 계산해 평균합니다. 그런 다음 parameter update를 정확히 한 번
              실행합니다.
            </p>
          }
          formula={String.raw`\begin{aligned}\bar g_t&=\frac1K\sum_{k=1}^{K}g_{t,k}\\B_{\rm eff}&=K B_{\rm micro}\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}G_t&=\underbrace{\sum_{k=1}^{K}g_{t,k}}_{\text{K개 micro gradient를 같은 장부에 합산}}\\\bar g_t&=\underbrace{G_t/K}_{\text{합을 micro-batch 수로 나눠 평균}}\\B_{\rm eff}&=\underbrace{K B_{\rm micro}}_{\text{update 하나가 본 sample 수 계산}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`\sum_{k=1}^{K}g_{t,k}`,
              annotation: [
                "parameter를 움직이지 않은 채 K개 gradient를 더해",
                "한 update의 누적 gradient 생성",
              ],
            },
            {
              expression: String.raw`G_t/K`,
              annotation: [
                "누적합을 K로 나눠",
                "mean-loss convention과 scale 정렬",
              ],
            },
            {
              expression: String.raw`K B_{\rm micro}`,
              annotation: [
                "micro-batch 크기와 누적 횟수를 곱해",
                "update당 sample 수 계산",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`K`,
              name: "Accumulation count",
              description: "Update 전 backward 횟수입니다.",
            },
            {
              symbol: String.raw`B_{\rm micro}`,
              name: "Micro-batch size",
              description: "한 forward/backward가 처리한 sample 수입니다.",
            },
            {
              symbol: String.raw`B_{\rm eff}`,
              name: "Effective batch",
              description: "한 update가 합친 sample 수입니다.",
            },
          ]}
          assumptions={[
            "각 micro loss의 reduction scale이 같습니다.",
            "K회 사이에 optimizer.step을 호출하지 않습니다.",
            "Data-parallel world size가 있으면 별도 곱으로 포함합니다.",
          ]}
          interpretation="4×8=32이지만 BatchNorm state·dropout mask·data order까지 한 번에 32개를 처리한 실행과 완전히 같다는 뜻은 아닙니다."
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            "각 micro loss의 reduction scale이 같습니다"라는 가정은 유효 자료 수가 다른 묶음에서 깨집니다. sequence 길이가 micro-batch마다
            다르면(padding 없는 packed batch, variable-length data) 각
            micro-batch가 <strong>자기 자신의 유효 토큰 수로만</strong>{" "}
            나누는 mean reduction과, K개 micro-batch 전체를 한 번에 처리했을
            때의 loss가 서로 달라집니다. Loss curve는 정상처럼 보이지만
            실제로는 짧은 시퀀스가 긴 시퀀스보다 과대평가된 gradient를 받는
            식으로 조용히 편향됩니다.
          </p>
          <p>
            Hugging Face Transformers는{" "}
            <code>fixed_cross_entropy</code>에서 공통 분모를 받을 때 합계 손실을 나누도록 구현합니다. K개 micro-batch를 backward 없이 먼저
            모아 accumulation window 전체의 유효 토큰 수(<code>
              num_items_in_batch
            </code>
            )를 미리 계산해 두고, 각 micro loss는 자기 토큰 수가 아니라 이
            공유된 분모로 나눕니다.
          </p>
          <div className="flex flex-wrap gap-2 not-prose">
            <CodeViewButton
              label="fixed_cross_entropy — 합계와 공통 분모 원문"
              onClick={() => sidebar.open("ga-fixed-cross-entropy", codeRefs["ga-fixed-cross-entropy"])}
            />
            <CodeViewButton
              label="get_batch_samples — 분모를 먼저 구하는 위치"
              onClick={() => sidebar.open("ga-num-items-in-batch", codeRefs["ga-num-items-in-batch"])}
            />
          </div>
        </div><p className="leading-8">고정한 Transformers revision 469230357aab0f2b303b0d638c1f8d06edb14184의 loss_utils.py 32–46행은 num_items_in_batch가 있으면 cross-entropy의 합을 구한 뒤 그 값으로 나눕니다. 처음 사례의 손실합 2와 18, 공통 유효 위치 수 8을 넣으면 각 기여는 0.25와 2.25이고 합은 2.5입니다. 두 loss가 모두 같은 parameter에서 만들어졌다면 미분의 합도 (4+28)/8=4가 됩니다.</p><p className="leading-8">이 값은 code excerpt에 들어가기 전의 개별 cross-entropy 손실합과 그 변화율을 가정한 계산입니다. 실제 모델을 실행해 그 수치를 측정한 결과와 구분합니다. num_items_in_batch가 None이면 각 호출은 자체 평균 1과 3을 만듭니다. 그것을 그대로 반씩 평균하면 2가 되어 처음 정한 목표와 달라집니다.</p><CodeViewButton label="두 묶음을 먼저 모으는 실제 원문" onClick={() => sidebar.open("ga-collect-window", codeRefs["ga-collect-window"])} /><p className="leading-8">trainer.py 2256–2271행은 최대 묶음 수만큼 먼저 자료를 모은 뒤 실제 유효 위치 수를 셉니다. 2297–2317행은 이미 이동된 label이 있는지, 이 손실이 label을 이동하는지에 따라 위치를 고르고 −100을 제외합니다. 처음의 2와 6은 이렇게 계산한 유효 위치 수여야 하며, 문자열 길이나 padding 포함 길이가 아닙니다.</p><p className="leading-8">같은 분모를 쓴 손실을 다시 누적 횟수로 나누면 이번에는 너무 작아집니다. 외부 학습 루프가 추가로 나누는지, 분산 실행에서 합산과 평균이 어디에 있는지까지 확인해야 합니다. 공통 분모 옵션만 켠 사실로 전체 루프가 맞다고 판정하지 않습니다.</p>
</section>
<section id="release-boundary" data-teach-level="7" className="space-y-6"><h2 className="text-2xl font-bold">11. 갱신 기록에는 값과 횟수, 분모의 정의가 함께 필요합니다</h2>
<div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            한 receipt에는 parameter revision과 gradient reduction, micro-batch, accumulation, world size,
            learning rate, update index, 그리고 AMP skipped-step을 남깁니다.
          </p>
          <p>
            그다음 Momentum·Adam 같은 stateful optimizer를 비교할 때 동일한
            update clock과 budget을 재사용합니다.
          </p>
        </div>
        <div id="paper-robbins-monro" className="scroll-mt-24">
          <CitationBlock
            source="A Stochastic Approximation Method"
            citeKey={1}
            href="https://doi.org/10.1214/aoms/1177729586"
          >
            <strong>문제:</strong> noisy observation으로 미지의 root를 반복
            추정함. <strong>기여:</strong> 감소하는 step을 쓰는 stochastic
            approximation의 출발점을 제시. <strong>전제:</strong> 논문의
            regression function·noise·step 조건. <strong>근거 범위:</strong> 원
            논문의 scalar stochastic approximation 이론.{" "}
            <strong>과장 금지:</strong> 현대 mini-batch SGD의 모든 nonconvex
            convergence나 generalization을 자동 보장하지 않습니다.
          </CitationBlock>
        </div><p className="leading-8">크기가 다른 묶음에서 단순 1/K 평균을 쓸 수 있는 것은 각 묶음의 기여가 같은 개수·가중치를 대표할 때입니다. 첫 사례처럼 2개와 6개이면 개수에 비례해 평균하거나 공통 분모를 써야 합니다. 계산을 나눠 읽는 것과 서로 다른 가중치로 학습하는 것은 다른 선택입니다.</p><p className="leading-8">같은 크기와 같은 가중치의 K개 묶음이 각각 평균 loss를 내면 그 K개 gradient를 합쳐 K로 나눌 수 있습니다. 예를 들어 장치 4개가 각각 micro-batch 2개를 8번 누적하면 한 갱신의 자료 수는 2×8×4=64입니다 (가정). 장치 사이에서 이미 평균을 했는지까지 확인해야 같은 64개의 평균이 됩니다.</p><p className="leading-8">재개 검증에서는 같은 parameter와 다음 자료 순서, 누적 중인 gradient와 유효 개수, 이동 크기 일정, 갱신 횟수 및 건너뛴 갱신 상태를 복원합니다. 중간에 멈추지 않은 실행과 다음 한 번의 parameter 이동을 대조합니다. 결과가 다르면 마지막으로 일치한 저장 상태로 돌아가 분모·자료 위치·누락된 기록을 확인합니다.</p><h3 className="text-xl font-semibold">읽은 내용으로 예측해 보세요</h3><ol className="list-decimal space-y-3 pl-6"><li>첫 묶음 2개와 둘째 6개의 평균을 반씩 섞으면 오차가 왜 2.5 대신 2가 될까요? (답: 3절)</li><li>Parameter 3에서 빼야 할 값은 오차 2.5와 gradient 4 중 어느 것을 어떻게 사용한 값일까요? (답: 8절)</li><li>공통 분모 8로 이미 나눈 두 손실을 누적 횟수 2로 다시 나누면 어떤 문제가 생길까요? (답: 10절)</li></ol>
</section>
</article>    <CodeSidebar
      codeRefKey={sidebar.codeRefKey}
      codeRef={sidebar.codeRef}
      onClose={sidebar.close}
      onNavigate={sidebar.navigate}
      codeRefs={codeRefs}
      fileTrees={{ transformers: transformersTree, torch: sgdTree }}
      projectMetas={{
        torch: { id: "torch", label: "PyTorch v2.8.0", badgeClass: "border-border" },
        transformers: {
          id: "transformers",
          label: "transformers · Python",
          badgeClass: "bg-yellow-500/10 border-yellow-500 text-yellow-700",
        },
      }}
    />
</>;}

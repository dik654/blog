import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import RepresentationDepthViz from "./viz/RepresentationDepthViz";

const DEEP_LEARNING_REVIEW = "https://www.nature.com/articles/nature14539";
const DEPTH_PAPER = "https://arxiv.org/abs/1602.04485";

import NumericPath from "../../world-systems/NumericPath";
import AlgorithmBlock from "@/components/ui/algorithm-block";

export default function DeepLearningOverviewArticle(){return <article className="space-y-16">
<section id="overview" data-teach-level="S" className="space-y-6"><h2 className="text-2xl font-bold">1. 입력을 다른 숫자로 바꾸면 풀 수 있는 문제가 생깁니다</h2>
<p className="leading-8">두 스위치 중 하나만 켜졌을 때 1을, 둘 다 같을 때 0을 내는 장치를 만든다고 합시다. 필요한 답은 (0, 0)→0, (0, 1)→1, (1, 0)→1, (1, 1)→0입니다. 이 네 입력과 답은 뒤에서 확인할 교과서의 실제 계산 예입니다. 이렇게 작은 문제에도 입력에 일정한 수를 곱하고 더하는 계산만으로는 원하는 답을 만들 수 없습니다.</p><p className="leading-8">해결 방법은 마지막 계산을 복잡하게 만들기 전에, 마지막 계산이 받는 숫자를 바꾸는 것입니다. 앞부분이 원래 입력에서 유용한 차이를 만들고, 뒷부분이 그 차이를 읽어 답을 냅니다. 사진이나 문장처럼 입력이 큰 경우에도 같은 질문이 남습니다. 다음 계산이 쓰기 좋은 숫자는 무엇이며, 그 숫자를 어떻게 찾을까요?</p><p className="leading-8">이 글은 네 가지 입력을 끝까지 추적해 중간 계산을 배우는 이유를 설명합니다. 실제로 수를 찾아가는 학습은 다음 글에서 다루고, 여기서는 어떤 계산 구조가 문제를 풀 수 있는지부터 확인합니다.</p>
</section>
<section id="black-box" data-teach-level="B" className="space-y-6"><h2 className="text-2xl font-bold">2. 관측한 값과 답 사이에 바꿔 적는 단계를 둡니다</h2>
<p className="leading-8">전체 장치는 세 부분으로 읽으면 됩니다. 먼저 켜짐과 꺼짐을 숫자로 받습니다. 가운데에서는 이 숫자를 다른 숫자 묶음으로 바꿉니다. 마지막에서는 바뀐 숫자로 답 하나를 계산합니다. 우리가 고를 것은 가운데와 마지막 계산에 쓰이는 숫자입니다.</p><NumericPath title="원래 입력을 바로 판정하지 않고 중간 계산을 거칩니다" steps={[{label:"무엇을 관측했나",value:"(1, 1)"},{label:"어떻게 바꿔 적나",value:"(2, 1)"},{label:"어떤 답을 내나",value:"0"}]} /><p className="leading-8">중간 결과 (2, 1)이 왜 필요한지는 아직 몰라도 됩니다. 입력이 들어오는 곳과 답을 읽는 곳 사이에 바꿔 적는 단계가 있다는 구조를 잡은 뒤, 그 단계 안을 열어 보겠습니다.</p>
</section>
<section id="case" data-teach-level="0" className="space-y-6"><h2 className="text-2xl font-bold">3. 네 입력을 같은 계산 규칙으로 처리해 봅니다</h2>
<p className="leading-8">매번 예외 규칙을 따로 적는 대신, 두 입력을 더한 값과 그 합에서 1을 뺀 값을 나란히 만듭니다. 음수가 나온 칸은 0으로 바꿉니다. 마지막 답은 첫째 칸에서 둘째 칸의 두 배를 빼서 구합니다.</p><p className="leading-8">(0, 0)은 합이 0이므로 먼저 (0, −1)이 되고, 음수를 지우면 (0, 0)이 됩니다. (0, 1)과 (1, 0)은 모두 (1, 0)이 됩니다. (1, 1)은 (2, 1)이 됩니다. 마지막 계산 결과는 차례로 0, 1, 1, 0으로 처음 요구한 답과 같습니다.</p><p className="leading-8">숫자를 이렇게 바꾸면 마지막 단계가 같은 규칙으로 네 입력을 처리합니다. 이 결과가 성립한 이유를 보려면 음수를 0으로 만든 동작을 따로 살펴봐야 합니다.</p>
</section>
<section id="shape" data-teach-level="1" className="space-y-6"><h2 className="text-2xl font-bold">4. 음수를 지우는 동작이 입력 사이의 관계를 바꿉니다</h2>
<p className="leading-8">가운데 계산을 세 부분으로 열어 보겠습니다. 두 입력의 합을 복사하는 부분, 둘째 칸에서 1을 빼는 부분, 음수만 0으로 바꾸는 부분입니다. 각 부분은 각각 무엇을 함께 볼지, 어느 지점부터 반응할지, 그 지점 전후에 어떤 다른 규칙을 적용할지를 정합니다.</p><NumericPath title="(0, 0)을 넣었을 때 중간 숫자가 바뀌는 위치" steps={[{label:"합을 두 칸에",value:"(0, 0)"},{label:"둘째 칸에서 1을",value:"(0, −1)"},{label:"음수만 0으로",value:"(0, 0)"}]} /><p className="leading-8">앞의 두 부분만 있으면 입력을 곱하고 더하는 한 번의 계산으로 합칠 수 있습니다. 마지막 부분은 음수인지에 따라 규칙이 달라져서 그렇게 합칠 수 없습니다. 이제 각 부분을 뺐을 때 무엇이 깨지는지 확인하겠습니다.</p>
</section>
<section id="why-parts" data-teach-level="2" className="space-y-6"><h2 className="text-2xl font-bold">5. 중간 단계 없이 한 번에 더하기만 하면 왜 실패할까요</h2>
<p className="leading-8">답을 a×첫 입력+b×둘째 입력+c로 만든다고 해 봅시다. (0, 0)의 답을 0으로 맞추면 c=0입니다. (1, 0)의 답이 1이므로 a=1이고, (0, 1)의 답도 1이므로 b=1입니다. 그러면 (1, 1)의 답은 2가 되어 요구한 0과 다릅니다. 일정한 계수로 더하기만 하는 구조의 한계입니다.</p><p className="leading-8">앞 절의 중간 단계에서 음수를 지우지 않으면 (0, 0)이 (0, −1)로 남습니다. 마지막 계산은 0−2×(−1)=2를 내므로 이 입력에서 바로 틀립니다. 중간 숫자에 조건에 따른 변화를 주어야 네 경우를 같은 마지막 계산으로 구별할 수 있습니다.</p><p className="leading-8">부품이 많다는 사실만으로 해결된 것이 아닙니다. 지금 필요한 것은 입력 사이의 관계를 바꾸는 계산입니다. 그 역할을 먼저 확인했으므로 이제 널리 쓰는 이름을 붙이겠습니다.</p>
</section>
<section id="names" data-teach-level="3" className="space-y-6"><h2 className="text-2xl font-bold">6. 바꿔 적은 숫자와 그것을 만드는 과정에 이름을 붙입니다</h2><p className="leading-8">앞에서 계산한 역할을 이름에 대응해 보겠습니다. 처음에는 오른쪽 이름을 외우기보다 왼쪽의 어떤 계산을 가리키는지 확인하면 됩니다.</p><div className="overflow-x-auto"><table className="w-full min-w-[600px] text-left text-sm leading-7"><thead><tr><th className="w-1/2 p-3">앞에서 본 역할</th><th className="p-3">표준 이름과 뜻</th></tr></thead><tbody><tr><td className="border-t border-border p-3">입력 (1, 1)을 다음 계산에 유용한 (2, 1)로 바꿔 적기</td><td className="border-t border-border p-3">Representation, 표현: 원래 관측을 다른 숫자 좌표로 나타낸 것입니다.</td></tr><tr><td className="border-t border-border p-3">중간 숫자를 만드는 조절값도 정답과의 오차로 찾기</td><td className="border-t border-border p-3">Representation learning, 표현 학습: 어떤 표현을 만들지도 학습 과정에서 찾습니다.</td></tr><tr><td className="border-t border-border p-3">앞 계산의 출력을 받아 다음 중간값을 만들기</td><td className="border-t border-border p-3">Layer, 층: 앞 출력에 하나의 변환을 적용하는 단계입니다.</td></tr><tr><td className="border-t border-border p-3">이런 변환을 여러 번 이어 붙이기</td><td className="border-t border-border p-3">Depth, 깊이: 이어 붙인 변환의 단계 수입니다.</td></tr><tr><td className="border-t border-border p-3">앞 계산을 재사용해 특정 함수를 더 작은 구조로 표현하기</td><td className="border-t border-border p-3">Depth efficiency, 깊이에 따른 표현 효율: 정해진 함수족에서 성립하는 조건부 성질입니다.</td></tr><tr><td className="border-t border-border p-3">맞혀야 할 답에 필요한 차이를 중간 숫자에 남기기</td><td className="border-t border-border p-3">Objective가 만드는 편향: 학습 목표가 무엇을 보존할지에 영향을 줍니다.</td></tr></tbody></table></div><p className="leading-8">위 예에서는 정답을 만드는 조절값을 알고 넣었습니다. 실제 표현 학습은 그 값을 오차를 줄이는 과정에서 찾습니다. 사진에서도 pixel 숫자를 다른 좌표로 바꾸어 가장자리나 질감 구분에 유용한 반응을 만들 수 있지만, 중간 숫자 하나가 반드시 사람 눈에 보이는 귀나 얼굴 하나를 뜻하지는 않습니다.</p><p className="leading-8">동일 사진이라도 동물을 맞히는 목표와 촬영 장소를 맞히는 목표는 서로 다른 정보를 유용하게 만듭니다. 이름을 붙인 뒤에는 중간 숫자가 누구의 다음 계산에 쓰이는지 추적해 보겠습니다.</p></section>
<section id="trace" data-teach-level="4" className="space-y-6"><h2 className="text-2xl font-bold">7. (1, 1)이 중간 표현을 거쳐 0이 되는 경로를 따라갑니다</h2>
<p className="leading-8">처음 고른 입력 (1, 1)을 그대로 다시 넣습니다. 두 입력의 합을 두 칸에 복사하면 (2, 2), 둘째 칸에서 1을 빼면 (2, 1), 음수를 0으로 바꾸어도 (2, 1)입니다. 마지막 계산은 1×2+(−2)×1=0을 냅니다.</p><p className="leading-8">반대로 (1, 0)은 (1, 1)→(1, 0)→(1, 0)→1을 거칩니다. 원래 입력이 달라도 정답이 같은 (0, 1)과 (1, 0)이 같은 중간 표현으로 합쳐지는 것도 확인할 수 있습니다. 이번 목표에는 둘의 차이를 보존할 필요가 없기 때문입니다.</p><AlgorithmBlock title="네 입력에 같은 계산을 적용하기 (의사코드)" input={["첫 입력 x₁과 둘째 입력 x₂는 각각 0 또는 1"]} steps={[{code:"s ← x₁ + x₂"},{code:"h₁ ← max(0, s); h₂ ← max(0, s − 1)"},{code:"답 ← h₁ − 2 × h₂"}]} output="네 입력 (0,0), (0,1), (1,0), (1,1)의 답은 0, 1, 1, 0" /><p className="leading-8">한 입력의 모든 중간값이 이어졌습니다. 다음 절에서는 같은 계산이 원문에서 어떤 식과 숫자로 표현되는지 대조합니다.</p>
</section>
<section id="source-xor" data-teach-level="5" className="space-y-6"><h2 className="text-2xl font-bold">8. 교과서의 식에 같은 입력을 직접 넣습니다</h2>
<p className="leading-8">Deep Learning 6.1절, 171쪽의 식 (6.3)은 중간 숫자를 만들고 답을 읽는 계산을 한 줄로 씁니다. 여기서 음수를 0으로 만드는 함수를 ReLU라고 부릅니다. 원문의 W, c, w, b는 각각 합을 만드는 숫자, 중간 이동량, 마지막 가중치, 마지막 이동량입니다.</p><ExplainedFormula question="원문의 네 숫자 묶음이 (1, 1)을 어떻게 0으로 보낼까요?" idea={<>원문 식의 가운데 max는 중간 숫자의 음수 성분을 지웁니다. 그 결과를 마지막 가중치 w와 결합합니다.</>} formula={String.raw`f(x;W,c,w,b)=w^\top\max\{0,W^\top x+c\}+b`} annotatedFormula={String.raw`f(x)=\underbrace{w^\top}_{\text{답을 읽는 가중치}}\underbrace{\max\{0,W^\top x+c\}}_{\text{중간 표현을 만드는 계산}}+\underbrace{b}_{\text{마지막 이동량}}`} operations={[{expression:String.raw`\max\{0,W^\top x+c\}`,annotation:["합과 이동 뒤","음수 성분만 0으로 바꿉니다"]},{expression:String.raw`w^\top`,annotation:["중간 두 값에 1과 −2를 곱해","최종 답을 읽습니다"]}]} terms={[{symbol:"x",name:"입력",description:"두 스위치 값입니다."},{symbol:"W,c",name:"중간 계산 숫자",description:"W의 네 원소는 모두 1, c=(0,−1)입니다."},{symbol:"w,b",name:"출력 계산 숫자",description:"w=(1,−2), b=0입니다."}]} assumptions={["교과서 식 (6.3)–(6.6)의 정해진 해를 사용합니다.","실제로 학습 알고리즘을 실행해 이 해를 찾은 결과는 아닙니다."]} interpretation="x=(1,1)이면 Wᵀx+c=(2,1), 음수 제거 뒤에도 (2,1), 최종 결과는 2−2=0입니다." /><p className="leading-8">원문 식 (6.7)–(6.11), 171–172쪽은 네 입력을 한꺼번에 계산해 출력 (0, 1, 1, 0)을 확인합니다. 앞 절의 계산은 그중 한 행을 따라간 것입니다. 이 예로 구조가 답을 표현할 수 있다는 점은 확인했지만, 어떤 시작값에서도 학습이 이 숫자를 찾아낸다는 결론은 나오지 않습니다.</p><a href="https://www.deeplearningbook.org/contents/mlp.html" target="_blank" rel="noreferrer" className="text-primary underline">원문: Deep Learning 6.1절, 식 (6.3)–(6.11)</a>
</section>
<section id="depth" data-teach-level="6" className="space-y-6"><h2 className="text-2xl font-bold">9. 여러 층의 합성과 선형 계산의 한계를 식으로 확인합니다</h2>
<p className="leading-8">앞에서 h₁과 h₂는 같은 층의 두 칸을 가리켰습니다. 아래 일반식의 h₁, h₂는 각각 첫째 층과 둘째 층의 전체 표현을 가리킵니다. 원문이 제시한 합성의 실제 표기는 f(x)=f⁽³⁾(f⁽²⁾(f⁽¹⁾(x)))입니다. 교과서 6장 164–165쪽의 함수 합성 설명을 이 표기로 풀면, 앞 층의 결과를 다음 함수의 입력으로 전달하는 구조가 됩니다.</p><ExplainedFormula
          question="여러 층은 입력을 어떻게 재사용 가능한 중간 표현으로 바꿀까요?"
          idea={<>각 층은 앞 단계의 결과만 입력으로 받아 작은 변환을 하나 수행합니다. 마지막 층은 누적된 표현을 task output으로 바꿉니다.</>}
          formula={String.raw`h_1=\phi_1(x),\quad h_2=\phi_2(h_1),\quad \hat y=\phi_3(h_2)`}
          annotatedFormula={String.raw`\begin{aligned}h_1&=\underbrace{\phi_1(x)}_{\substack{\text{입력을 첫 표현으로}\text{변환}}}\\[4pt]h_2&=\underbrace{\phi_2(h_1)}_{\substack{\text{앞 표현을 재사용해}\text{더 큰 구조로 조합}}}\\[4pt]\hat y&=\underbrace{\phi_3(h_2)}_{\substack{\text{task가 요구한}\text{출력으로 변환}}}\end{aligned}`}
          operations={[
            { expression: String.raw`\phi_1(x)`, annotation: ["원시 입력을", "첫 중간 좌표로 변환"] },
            { expression: String.raw`\phi_2(h_1)`, annotation: ["이미 만든 특징을", "다음 구조에 재사용"] },
            { expression: String.raw`\phi_3(h_2)`, annotation: ["누적 표현을", "task output으로 읽음"] },
          ]}
          terms={[
            { symbol: "x", name: "입력", description: "아직 task용 표현으로 바뀌지 않은 pixel·token 같은 관측값입니다." },
            { symbol: "h_1,h_2", name: "중간 표현", description: "앞 층의 출력을 다음 층이 다시 사용하는 좌표입니다." },
            { symbol: String.raw`\phi_1,\phi_2,\phi_3`, name: "층별 변환", description: "학습되는 parameter를 가진 작은 함수들입니다." },
            { symbol: String.raw`\hat y`, name: "Prediction", description: "마지막 표현에서 읽은 task output입니다." },
          ]}
          assumptions={[
            "각 층의 출력 shape가 다음 층의 입력 계약과 맞습니다.",
            "이 식은 함수 합성을 보일 뿐, gradient가 안정적으로 흐르거나 좋은 representation을 찾는다고 보장하지 않습니다.",
          ]}
          interpretation="깊이의 핵심은 층 수를 세는 일이 아니라, 앞에서 만든 중간 계산을 뒤에서 다시 쓰는 합성 구조입니다."
        /><p className="leading-8">네 입력 예에서 첫 함수가 (1, 1)을 (2, 1)로 바꾸고, 다음 함수가 이를 0으로 읽습니다. 중간에 조건에 따른 변화가 없다면 행렬을 여러 번 곱한 결과를 한 행렬로 미리 합칠 수 있습니다. 원문 6.1절 168쪽도 이 이유로 선형 층만 이어 붙이는 선택을 배제합니다.</p><ExplainedFormula
          question="φ가 전부 선형이면 층을 쌓아도 왜 표현력이 늘지 않나요?"
          idea={
            <>
              각 φᵢ를 Wᵢh 같은 선형 변환으로 두면, 두 번 합성한 결과도 그
              자체로 다시 하나의 선형 map입니다. 행렬곱은 결합법칙을
              만족하므로 층 수를 아무리 늘려도 결과는 항상 입력의 선형
              변환 하나로 붕괴합니다.
            </>
          }
          formula={String.raw`h_2=W_2(W_1x)=(W_2W_1)x=Wx`}
          annotatedFormula={String.raw`\begin{aligned}h_1&=\underbrace{W_1x}_{\text{첫 층이 선형이라 가정}}\\h_2&=\underbrace{W_2h_1=W_2W_1x}_{\text{두 번째 층도 선형이면 행렬곱이 결합}}\\h_2&=\underbrace{(W_2W_1)x=Wx}_{\text{두 행렬의 곱은 다시 한 행렬 — 층 하나와 표현력이 같음}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`W_2(W_1x)`,
              annotation: ["두 선형 층을 차례로 적용한 결과를", "행렬 결합법칙으로 다시 묶음"],
            },
            {
              expression: String.raw`(W_2W_1)x`,
              annotation: ["두 weight matrix의 곱을 미리 계산해", "입력에 한 번만 곱해도 되는 형태로 정리"],
            },
          ]}
          terms={[
            { symbol: String.raw`W_1,W_2`, name: "층별 weight matrix", description: "각 층이 선형(활성함수 없이 Wh+b 형태)이라고 가정했을 때의 parameter입니다." },
            { symbol: "W", name: "등가 단일 행렬", description: "두 선형 층의 곱을 미리 계산한, 원래 입력에 한 번만 곱해도 같은 결과를 내는 행렬입니다." },
          ]}
          assumptions={[
            "Bias 항은 생략했습니다 — bias를 포함해도 결합된 map은 여전히 하나의 affine 변환입니다.",
            "φᵢ에 비선형 함수를 넣으면 일반적으로 한 행렬곱으로 합칠 수 없습니다. 다만 가중치나 입력 범위에 따라 전체 함수가 여전히 선형일 수 있습니다.",
          ]}
          interpretation="선형 층만 쌓으면 depth와 무관하게 표현 가능한 함수족은 단일 선형 층과 정확히 같습니다. 여러 층이 서로 다른 함수를 표현하려면 φᵢ 사이에 최소 하나의 nonlinearity가 있어야 하며, 이것이 activation function이 존재하는 근본 이유입니다."
        /><p className="leading-8">이때 비선형 계산을 넣는 것은 표현력을 늘릴 가능성을 만드는 조건입니다. 모든 입력이 같은 직선 구간에 머무르거나 뒤 가중치가 0이면 결과가 여전히 선형일 수 있으므로, 비선형 함수 하나가 실제 성능 향상을 보장하지는 않습니다.</p><RepresentationDepthViz />
</section>
<section id="boundaries" data-teach-level="7" className="space-y-6"><h2 className="text-2xl font-bold">10. 표현할 수 있음과 배울 수 있음은 다른 확인입니다</h2>
<p className="leading-8">네 경우를 맞히는 숫자를 직접 넣었으므로 이번 예는 표현 가능성만 확인합니다. 제한된 계산 시간 안에 그 숫자를 찾을 수 있는지는 최적화, 처음 보지 않은 입력에도 맞는지는 일반화의 질문입니다. 여기서는 가능한 네 입력을 모두 사용했기 때문에 새 데이터 성능을 측정한 실험도 아닙니다.</p><p className="leading-8">더 깊은 구조가 특정 함수를 작게 나타낸다는 이론도 어떤 함수족과 근사 오차를 허용하는지에 기대어 성립합니다. 실제 데이터에서 더 깊은 모델이 항상 정확하거나 쉽게 학습된다는 뜻으로 읽으면 안 됩니다. 표현을 평가할 때는 구조와 함께 데이터, 목표, 학습 과정, 독립 평가를 확인해야 합니다.</p>        <div id="paper-deep-learning">
          <CitationBlock source="Deep Learning · LeCun, Bengio, Hinton (2015)" citeKey={1} href={DEEP_LEARNING_REVIEW}>
            <Evidence problem="여러 task의 deep learning 성과를 공통된 representation learning 관점으로 설명할 필요" contribution="여러 층의 representation과 backpropagation을 vision·speech·language 사례에 연결" assumptions="미분 가능한 model, task objective와 당시의 data·compute 조건" scope="2015년까지의 review와 인용된 실험 범위" notClaim="특정 hidden unit의 의미나 모든 deep architecture의 우월성을 증명하지 않음" />
          </CitationBlock>
        </div>
        <div id="paper-depth-benefit">
          <CitationBlock source="Benefits of Depth in Neural Networks · Telgarsky (2016)" citeKey={2} href={DEPTH_PAPER}>
            <Evidence problem="Depth가 width와 다른 표현 자원인지 이론적으로 구분" contribution="특정 함수족에서 깊고 작은 network와 얕고 큰 network의 separation 구성" assumptions="논문이 정한 semi-algebraic gate·근사 조건" scope="구성된 함수족의 representation complexity" notClaim="현실의 모든 dataset에서 더 깊은 model이 더 잘 학습되거나 일반화한다는 결론이 아님" />
          </CitationBlock>
        </div>
<p className="leading-8">중간 표현의 역할을 이해했다면 <a href="/cs/ai/supervised-learning-loop" className="text-primary underline">지도학습 한 바퀴</a>에서 조절 가능한 숫자를 실제로 바꾸는 계산을 따라갑니다. 새 데이터의 평가는 <a href="/cs/ai/train-validation-test" className="text-primary underline">학습·선택·최종 평가 분리</a>로 이어집니다.</p><ContentBoundary article="deep-learning-overview" />
<h3 className="text-xl font-semibold">읽은 내용으로 예측해 보세요</h3><ol className="list-decimal space-y-3 pl-6"><li>음수를 0으로 바꾸는 단계를 빼면 입력 (0, 0)의 답은 얼마가 될까요? (답: 5절)</li><li>입력 (0, 1)은 어떤 중간 표현으로 바뀌고 왜 (1, 0)과 같아질까요? (답: 7절)</li><li>네 입력을 모두 맞혔다는 사실로 새 데이터에서도 잘 맞힌다고 결론낼 수 있을까요? (답: 10절)</li></ol>
</section>
</article>;}
function Evidence({ problem, contribution, assumptions, scope, notClaim }: { problem: string; contribution: string; assumptions: string; scope: string; notClaim: string }) { return <div className="space-y-2"><p><strong>문제:</strong> {problem}</p><p><strong>핵심 아이디어:</strong> {contribution}</p><p><strong>중요 가정:</strong> {assumptions}</p><p><strong>근거 범위:</strong> {scope}</p><p><strong>일반화 금지:</strong> {notClaim}</p></div>; }

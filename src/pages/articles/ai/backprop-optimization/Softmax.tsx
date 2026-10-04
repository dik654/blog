import ExplainedFormula from "@/components/ui/explained-formula";
import SoftmaxFlowViz from "./viz/SoftmaxFlowViz";


import NumericPath from "../../world-systems/NumericPath";
import AlgorithmBlock from "@/components/ui/algorithm-block";

export default function Softmax(){return <div className="space-y-16">
<section id="overview" data-teach-level="S" className="space-y-6"><h2 className="text-2xl font-bold">1. 서로 다른 점수 두 개를 하나의 확률로 읽으려면</h2>
<p className="leading-8">사진이 고양이인지 개인지 둘 중 하나로 답하는 계산을 생각해 봅시다. 마지막에 나온 두 점수는 약 0.6931과 0입니다 (가정). 앞쪽 점수가 높다는 사실은 읽을 수 있지만, 이것만으로 고양이일 확률이 69.31%라고 말할 수는 없습니다. 점수에는 음수가 나올 수도 있고 둘을 더해 1이 될 필요도 없기 때문입니다.</p><p className="leading-8">
            필요한 계산은 두 후보의 순서를 보존하면서 각 후보에 0부터 1 사이의 몫을 나누어 주어야 합니다. 둘 중 정확히 하나가 답이라는 조건에서는 두 몫의 합이 1이 되어야 합니다.
            이 계산이 확률을 만드는 방법과, 그 확률이 실제 정답률과 맞는지는 나중에 구분하겠습니다.
          </p><p className="leading-8">정확히 계산하기 위해 첫 점수를 2의 자연로그, 둘째 점수를 0으로 정하겠습니다 (가정). 자연로그는 어떤 수를 지수 계산에 넣어 2를 만들지 나타내므로, 이 두 점수를 지수로 바꾸면 2와 1이 됩니다. 마지막 결과 2/3과 1/3까지 같은 두 수를 따라갑니다.</p>
</section>
<section id="black-box" data-teach-level="B" className="space-y-6"><h2 className="text-2xl font-bold">2. 양수로 바꾸고, 합을 구하고, 각자의 몫을 읽습니다</h2>
<p className="leading-8">세 부분이면 전체 계산이 보입니다. 제한 없는 점수들을 먼저 양수로 바꿉니다. 그 양수를 전부 더해 하나의 총량을 만듭니다. 각 양수를 그 총량으로 나누면 어느 후보가 얼마나 차지하는지 읽을 수 있습니다. 어느 후보도 자기 분모를 따로 고르지 않습니다.</p><NumericPath title="두 후보가 같은 총량 3을 나눠 가집니다" steps={[{label:"두 점수",value:"ln 2, 0"},{label:"양수로 바꾸기",value:"2, 1"},{label:"같은 합으로 나누기",value:"2/3, 1/3"}]} /><p className="leading-8">최댓값 하나를 고르는 연산과 달리 둘째 후보의 몫도 남습니다. 양수로 바꾸는 이유와 분모를 공유하는 이유를 차례로 확인하겠습니다.</p>
</section>
<section id="case" data-teach-level="0" className="space-y-6"><h2 className="text-2xl font-bold">3. 점수가 0인 후보도 몫을 가집니다</h2>
<p className="leading-8">처음의 두 점수를 지수 계산에 넣으면 e^(ln 2)=2, e^0=1입니다. 총량은 3이므로 첫 후보의 몫은 2/3≈0.6667, 둘째는 1/3≈0.3333입니다. 점수 0이 확률 0을 뜻하지 않는 이유가 이 단계에 있습니다.</p><p className="leading-8">
            둘째 점수도 ln 2로 바꾸면 양수 값이 2와 2가 되어 각각 절반을 차지합니다. 첫 점수를 그대로 두었는데도 첫 후보의 확률이 2/3에서 1/2로 줄었습니다. 같은 총량을
            함께 쓰므로 다른 후보의 변화가 내 몫에도 영향을 줍니다.
          </p><p className="leading-8">확률을 따로 계산한 뒤 합계를 우연히 1에 맞추는 구조가 아닙니다. 공유하는 분모가 후보 사이의 관계를 만듭니다.</p>
</section>
<section id="parts" data-teach-level="1" className="space-y-6"><h2 className="text-2xl font-bold">4. 한 후보의 계산 안에 다른 후보도 들어갑니다</h2>
<p className="leading-8">첫 후보 쪽에서 보면 자신이 받은 양수 2가 분자에 놓입니다. 분모에는 자기 값 2뿐 아니라 둘째 후보의 1도 들어갑니다. 둘째 후보 쪽에서는 분자가 1로 바뀌고 분모 3은 같습니다. 각 몫을 더하면 (2+1)/3=1이 되는 이유입니다.</p><p className="leading-8">만약 각 후보의 값을 자기 값으로만 나누면 둘 다 1이 되어 한 가지 답이라는 조건을 표현할 수 없습니다. 반대로 원래 점수를 그대로 합으로 나누면 음수 점수 때문에 음의 몫이 나올 수 있습니다. 양수로 바꾸는 단계와 공통 총량이 둘 다 필요합니다.</p><p className="leading-8">그렇다면 양수를 만드는 방법은 무엇이든 같을까요? 다음 절에서 지수 계산이 점수 차이를 어떤 비율로 바꾸는지 봅니다.</p>
</section>
<section id="why-exponential" data-teach-level="2" className="space-y-6"><h2 className="text-2xl font-bold">5. 점수의 차이가 비율이 되도록 지수를 씁니다</h2>
<p className="leading-8">지수는 입력이 커질수록 양수가 커지는 함수입니다. 두 점수의 차이가 ln 2이면 양수 값의 비율은 2배가 됩니다. 같은 수를 두 점수에 더해도 이 차이는 같으므로 마지막 비율도 같습니다. 점수의 원점에 매이지 않고 상대 차이를 읽는 데 맞는 성질입니다.</p><p className="leading-8">양수로 바꾸는 다른 함수도 만들 수 있지만, 이 계산이 모두 같은 학습 성질을 가지는 것은 아닙니다. 지수를 쓰면 정답 확률의 로그를 계산할 때 지수와 로그가 상쇄되는 부분이 생겨 학습 오차를 다루기 편합니다. 그 손실과 미분은 <a href="/cs/ai/cross-entropy" className="text-primary underline">교차 엔트로피</a>에서 별도로 연결합니다.</p><p className="leading-8">선택한 함수가 무엇을 보존하는지 확인했습니다. 이제 제한 없는 점수와 몫을 만드는 전체 계산에 이름을 붙입니다.</p>
</section>
<section id="names" data-teach-level="3" className="space-y-6"><h2 className="text-2xl font-bold">6. Logit은 점수이고 softmax는 공동 몫을 만드는 계산입니다</h2>
<p className="leading-8">확률로 바꾸기 전의 제한 없는 점수를 logit이라고 부릅니다. 각 logit을 지수로 바꾸고 그 합으로 나누는 함수가 softmax입니다. 이 함수가 만드는 확률의 의미는 후보 중 하나가 답인 categorical distribution, 범주형 분포입니다.</p><p className="leading-8">앞 예의 ln 2와 0은 logits이고, 2와 1은 지수를 취한 양수 값이며, 2/3과 1/3은 확률입니다. 이 세 종류의 숫자를 같은 뜻으로 부르지 않으면 softmax에 이미 확률을 또 넣는 실수를 찾기 쉽습니다.</p><p className="leading-8">이름을 붙인 뒤에도 계산은 바뀌지 않습니다. 원래 두 logits를 끝까지 추적하고 컴퓨터에서 큰 수를 다루는 방법까지 이어 보겠습니다.</p>
</section>
<section id="trace" data-teach-level="4" className="space-y-6"><h2 className="text-2xl font-bold">7. 같은 두 점수에서 큰 공통값을 빼도 답은 같습니다</h2>
<p className="leading-8">원래 z=(ln 2, 0)의 가장 큰 값 ln 2를 둘 다에서 빼면 (0, −ln 2)입니다. 지수 값은 (1, 1/2), 합은 3/2가 됩니다. 첫 확률은 1÷(3/2)=2/3, 둘째는 (1/2)÷(3/2)=1/3으로 처음과 같습니다.</p><p className="leading-8">두 원래 점수에 1,000을 더한 (1,000+ln 2, 1,000)도 차이는 같습니다 (가정). 원래 큰 수를 곧바로 지수에 넣으면 컴퓨터의 숫자 범위를 넘을 수 있지만, 최댓값을 먼저 빼면 다시 (0, −ln 2)만 계산하면 됩니다. 이 동작을 max shift라고 부릅니다.</p><AlgorithmBlock title="최댓값을 뺀 뒤 softmax 계산하기 (의사코드)" input={["유한한 실수 점수 z=(ln 2, 0) (가정)"]} steps={[{code:"m ← 모든 점수의 최댓값"},{code:"각 i에 대해 wᵢ ← exp(zᵢ − m)"},{code:"S ← 모든 wᵢ의 합"},{code:"각 i에 대해 pᵢ ← wᵢ / S"}]} output="m=ln 2, w=(1,1/2), S=3/2, p=(2/3,1/3)" /><p className="leading-8">실수의 대수적 성질과 유한한 컴퓨터 숫자의 한계가 함께 쓰였습니다. 원문 식으로 왜 비율이 보존되는지 확인하겠습니다.</p>
</section>
<section id="source-normalization" data-teach-level="5" className="space-y-6"><h2 className="text-2xl font-bold">8. 원문 식 (6.29)와 (6.33)에 같은 숫자를 대입합니다</h2>
<p className="leading-8">Deep Learning 6.2.2.3절 181쪽의 식 (6.29)은 softmax(z)ᵢ=exp(zᵢ)/Σⱼexp(zⱼ)입니다. 182쪽의 식 (6.33)은 softmax(z)=softmax(z−maxᵢ zᵢ)로 같은 최대값을 빼는 형태를 제시합니다. 아래 식은 두 원문 관계를 한데 적고, 우리가 쓴 중간값 m을 따로 표시한 것입니다.</p><ExplainedFormula
        question="서로 배타적인 class score 여러 개를 합이 1인 공동 확률로 바꾸려면?"
        idea={<>각 logit을 양수 weight로 바꾸고 모든 class의 weight 합으로 나눕니다. Class 하나의 확률은 다른 모든 class logit에도 의존합니다.</>}
        formula={String.raw`p_i=\frac{e^{z_i}}{\sum_j e^{z_j}}=\frac{e^{z_i-m}}{\sum_j e^{z_j-m}},\qquad m=\max_j z_j`}
        annotatedFormula={String.raw`\begin{aligned}m&=\underbrace{\max_j z_j}_{\substack{\text{overflow 기준}\text{logit 선택}}}\\[7pt]w_i&=\underbrace{e^{z_i-m}}_{\substack{\text{상대 score를}\text{양수 weight로 변환}}}\\[7pt]S&=\underbrace{\sum_j w_j}_{\substack{\text{모든 class의}\text{공동 총량}}}\\[7pt]p_i&=\underbrace{w_i/S}_{\substack{\text{총량 중 class i의}\text{몫을 계산}}}\end{aligned}`}
        operations={[
          { expression: String.raw`\max_jz_j`, annotation: ["공통으로 뺄 가장 큰 score를 골라", "지수 overflow를 피함"] },
          { expression: String.raw`e^{z_i-m}`, annotation: ["score 순서를 보존하면서", "비교 가능한 양수 weight로 변환"] },
          { expression: String.raw`\sum_je^{z_j-m}`, annotation: ["모든 후보가 공유할 총량을 만들어", "각 class의 몫을 계산"] },
        ]}
        terms={[
          { symbol: "z_i", name: "class logit", description: "확률로 정규화하기 전의 범위 제한이 없는 class score입니다." },
          { symbol: String.raw`\sum_j e^{z_j}`, name: "shared normalizer", description: "모든 class의 probability 합이 1이 되게 만듭니다." },
          { symbol: "m", name: "maximum-logit shift", description: "모든 logit에서 같은 값을 빼도 확률은 같다는 성질로 overflow를 줄입니다." },
          { symbol: "w_i", name: "positive class weight", description: "max shift 뒤 exponentiate한 class i의 양수 weight입니다." },
          { symbol: "S", name: "shared weight total", description: "모든 class weight가 공유하는 normalization 분모입니다." },
        ]}
        assumptions={["Class들이 서로 배타적인 categorical output 계약입니다.", "Multi-label처럼 class가 독립이면 class별 sigmoid가 맞습니다."]}
        interpretation="Logit에 같은 상수를 더하거나 빼도 probability는 변하지 않지만, logit 차이를 scale하면 분포의 날카로움은 달라집니다."
      /><p className="leading-8">원문 (6.29)에 z=(ln 2,0)을 넣으면 (2,1)/3입니다. 식 (6.33)을 먼저 적용하면 (1,1/2)/(3/2)입니다. 분자와 분모가 모두 e^(−m)배가 되어 약분되므로 결과가 같습니다. 일반적으로 e^(zᵢ−m)=e^(−m)e^(zᵢ)이므로 각 후보에 같은 비율을 적용해야 이 취소가 가능합니다.</p><p className="leading-8">다른 예인 (1,001,1,000)은 (0,−1)로 바꾼 뒤 지수와 합을 계산합니다 (가정). 결과는 약 (0.7311,0.2689)입니다. 최댓값을 빼는 것은 모든 수치 문제를 없애는 조치가 아닙니다. 아주 작은 몫은 0으로 반올림될 수 있고, 입력에 무한대나 값 없음이 섞이면 별도 처리가 필요합니다.</p><p id="paper-softmax" className="leading-8"><a href="https://www.deeplearningbook.org/contents/mlp.html" target="_blank" rel="noreferrer" className="text-primary underline">원문: Deep Learning 6.2.2.3절, 식 (6.29)–(6.33)</a>. 이 절은 서로 배타적인 출력의 정의와 수치 안정성을 설명합니다. 어느 분류 자료든 배타적이라거나 계산된 확률이 잘 보정되었다는 보장은 아닙니다.</p><p className="leading-8">공통값을 빼는 일은 차이를 보존합니다. 반면 차이의 크기를 바꾸면 확률이 달라지므로 다음 조절은 별도로 읽어야 합니다.</p>
</section>
<section id="temperature" data-teach-level="6" className="space-y-6"><h2 className="text-2xl font-bold">9. 차이를 줄이면 같은 후보가 더 비슷한 몫을 가집니다</h2>
<p className="leading-8">모든 logit을 양수 T로 나누고 softmax를 계산하는 조절을 temperature라고 부릅니다. T=2이면 원래 (ln 2,0)의 차이가 절반이 되어 양수 값은 (√2,1)입니다. 확률은 약 (0.5858,0.4142)로 2/3과 1/3보다 비슷해집니다 (가정).</p><ExplainedFormula
        question="같은 class 순서를 유지하면서 분포만 더 날카롭거나 평평하게 만들려면?"
        idea={<>모든 logit을 같은 양수 T로 나눈 뒤 softmax를 적용합니다. T가 작으면 차이가 확대되고, 크면 차이가 축소됩니다.</>}
        formula={String.raw`p_i(T)=\frac{e^{z_i/T}}{\sum_j e^{z_j/T}},\qquad T>0`}
        annotatedFormula={String.raw`\begin{aligned}&\underbrace{T>0}_{\substack{\text{순서를 보존하는}\text{양수 scale}}}\\[7pt]s_i&=\underbrace{z_i/T}_{\substack{\text{logit 차이를}\text{확대 또는 축소}}}\\[7pt]w_i&=\underbrace{e^{s_i}}_{\substack{\text{조절한 score를}\text{양수 weight로 변환}}}\\[7pt]S&=\underbrace{\sum_j w_j}_{\substack{\text{조절된 weight의}\text{공동 총량}}}\\[7pt]p_i(T)&=\underbrace{w_i/S}_{\substack{\text{class i의}\text{확률 몫}}}\end{aligned}`}
        operations={[
          { expression: String.raw`z_i/T`, annotation: ["작은 T는 score 차이를 확대하고", "큰 T는 차이를 축소"] },
          { expression: String.raw`e^{z_i/T}`, annotation: ["조절된 score를", "양수 비교 weight로 변환"] },
          { expression: String.raw`\sum_je^{z_j/T}`, annotation: ["모든 class의 weight 합으로 나눠", "합이 1인 분포를 만듦"] },
        ]}
        terms={[
          { symbol: "T", name: "temperature", description: "0보다 큰 공통 scale입니다." },
          { symbol: "z_i/T", name: "scaled logit", description: "class 간 상대 간격을 조절한 score입니다." },
          { symbol: "s_i", name: "scaled score", description: "temperature로 간격을 조절한 logit입니다." },
          { symbol: "w_i", name: "temperature-adjusted weight", description: "scaled score를 exponentiate한 양수 weight입니다." },
          { symbol: "S", name: "shared total", description: "모든 adjusted weight의 합입니다." },
          { symbol: "p_i(T)", name: "temperature-scaled probability", description: "조절 뒤 class i가 차지하는 공동 probability입니다." },
        ]}
        assumptions={["T는 양수입니다.", "Class들이 서로 배타적인 categorical output입니다."]}
        interpretation="Temperature는 class 순서를 바꾸지 않지만 확률의 확신 정도를 바꿉니다. 원래 logit scale이 다른 모델끼리는 같은 T도 같은 효과를 보장하지 않습니다."
      /><p className="leading-8">T=1/2이면 양수 값은 (4,1)이 되어 확률은 (0.8,0.2)입니다. 이 계산은 원문 식 (6.29)의 입력 z를 z/T로 놓은 직접 대입입니다. 같은 수를 더할 때와 달리, 나누는 값은 logit의 차이를 바꾸므로 약분으로 사라지지 않습니다.</p><SoftmaxFlowViz /><p className="leading-8">유한한 logits에서 T가 아주 커지면 차이가 0에 가까워져 모든 후보가 같은 몫에 접근합니다. T가 0에 가까워지면 가장 큰 logit에 집중하지만, 최댓값이 여럿이면 그 후보들이 같은 몫을 나눕니다. T=0을 그대로 대입하면 0으로 나누게 되므로 극한과 실제 입력값을 구분합니다.</p><p className="leading-8">T가 양수인 동안 후보 순서는 그대로입니다. 모델마다 원래 logit 차이가 다르므로 같은 T가 같은 확신 정도를 만들지는 않습니다. 마지막으로 이 확률을 어디에 쓸 수 있는지 확인합니다.</p>
</section>
<section id="output-boundary" data-teach-level="7" className="space-y-6"><h2 className="text-2xl font-bold">10. 합이 1이라는 조건과 실제 정답률은 다른 질문입니다</h2>
<p className="leading-8">고양이 또는 개처럼 둘 중 하나만 참이면 두 후보가 총량 1을 나누는 해석이 맞습니다. 실내이면서 야간일 수 있는 사진에서 실내와 야간을 같은 softmax에 넣으면 둘이 서로 몫을 빼앗습니다. 동시에 참일 수 있는 label에는 각각 0–1 값을 내는 sigmoid와 그 의미에 맞는 손실을 사용합니다.</p><p className="leading-8">확률 2/3을 출력했다는 사실만으로 같은 점수를 받은 사진의 2/3이 실제로 정답이라고 결론낼 수는 없습니다. 이런 대응은 별도 자료에서 보정을 평가해야 합니다. 학습할 때도 이미 softmax를 적용한 확률을 raw logits를 요구하는 손실에 다시 전달하면 다른 계산이 됩니다. 수치 안정적인 log-softmax와 negative log-likelihood를 결합한 구현은 원래 logits를 직접 받는 경우가 많으므로 함수의 입력 약속을 확인합니다.</p><h3 className="text-xl font-semibold">읽은 내용으로 예측해 보세요</h3><ol className="list-decimal space-y-3 pl-6"><li>원래 (ln 2,0)의 두 점수에 모두 1,000을 더하면 확률이 바뀔까요? (답: 7절)</li><li>T=2와 T=1/2 중 어느 쪽에서 첫 후보의 몫이 더 커질까요? (답: 9절)</li><li>실내와 야간을 동시에 맞히는 문제에 공동 분모를 쓰면 어떤 제약이 생길까요? (답: 10절)</li></ol>
</section>
</div>;}

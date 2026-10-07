import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import { precisionCodeRefs } from "./codeRefs";
import RoundingGridViz from "./viz/RoundingGridViz";

export default function NumericalPrecisionArticle(){const sidebar=useCodeSidebar();return <article className="space-y-16">
<div id="overview" />
<section id="problem" data-teach-level="S" className="space-y-6">
<h2 className="text-2xl font-bold">1 · 분명히 두 번 더했는데 저장된 값은 그대로다</h2>
<p className="text-lg leading-8">숫자 1에 아주 작은 양을 두 번 더합니다. 한 번 더한 결과를 저장하고 다시 더하니 마지막 값도 1입니다. 그런데 작은 양 두 개를 먼저 합쳐 한 번에 더하면 1보다 큰 값이 남습니다. 입력도 덧셈 횟수도 같은데 괄호를 놓는 위치가 답을 바꿨습니다.</p>
<p>저장할 수 있는 숫자의 자리가 띄엄띄엄 놓여 있기 때문입니다. 계산한 값이 그 사이에 오면 어느 한 자리로 옮겨 적어야 합니다. 이 글은 같은 작은 덧셈이 언제 사라지는지부터 시작해, 실제 저장 코드의 선택 조건까지 따라갑니다. 이어 큰 지수 값과 작은 분산을 계산할 때도 같은 질문을 적용합니다.</p>
<p className="font-semibold">그림을 보기 전에 세 가지를 예측해 보세요.</p>
<ol className="list-decimal space-y-2 pl-6"><li>δ=1/2048일 때 1에 δ를 더해 매번 FP16에 저장하면 첫 결과가 다시 1일까요?</li><li>같은 δ를 두 번 연속 더해 저장하면 최종값도 1일까요?</li><li>δ+δ를 먼저 계산해 1에 더하면 1+1/1024가 남을까요?</li></ol>
<p>답은 <strong>예, 예, 예</strong>입니다. 같은 입력과 덧셈 횟수여도 중간 저장 위치가 달라지면 반올림 경로와 최종값이 달라집니다.</p>
<RoundingGridViz />
<ContentBoundary article="math-numerical-precision-stability" />
</section>
<section id="black-box" data-teach-level="B" className="space-y-6">
<h2 className="text-2xl font-bold">2 · 계산할 값과 저장할 자리를 따로 본다</h2>
<p>
            입력은 현재 값과 더할 양입니다. 안에서는 먼저 두 수를 더하고 그 답을 저장 가능한 자리 중 하나에 놓습니다. 출력은 다음 덧셈이 다시 읽을 저장값입니다. 한 단계의 정확한
            합과 다음 단계가 읽는 값이 같다는 보장은 없습니다.
          </p>
<p>저장 규칙도 입력 조건의 일부입니다. 여기서는 가장 가까운 자리를 고릅니다. 정확히 가운데라면 이웃한 자리의 번호 중 짝수인 쪽을 고릅니다. 어느 쪽이든 마음대로 고른다는 뜻이 아닙니다. 같은 입력과 같은 규칙에서는 같은 자리를 선택합니다.</p>
<p>화면에 소수를 몇 자리 보여 주는지는 별개의 선택입니다. 화면에서 둘 다 1.00으로 보이더라도 내부에 서로 다른 값이 저장되어 있을 수 있습니다. 반대로 소수 자릿수를 길게 출력해도 이미 저장하면서 잃어버린 차이를 복구할 수는 없습니다.</p>
<p>전체 계산은 ‘현재 값 읽기 → 더하기 → 자리 고르기 → 새 값 저장하기’의 반복입니다. 어디에서 자리를 고르는지 표시해 두면 같은 식을 다른 순서로 계산했을 때 무엇이 달라졌는지 찾을 수 있습니다. 여기서는 매 덧셈 뒤 저장하는 경우와 마지막에 저장하는 경우를 비교합니다.</p>
</section>
<section id="case" data-teach-level="0" className="space-y-6">
<h2 className="text-2xl font-bold">3 · 작은 양 하나는 반 칸이고 두 개는 한 칸이다</h2>
<p>작은 양을 δ=1/2048로 정합니다(가정). δ는 약 0.000488입니다. 지금 사용할 저장 방식에서는 1부터 위쪽으로 1/1024 간격의 자리가 놓입니다. 따라서 처음 세 자리는 1, 1+2δ, 1+4δ입니다. 작은 양 하나는 두 자리 사이의 정확히 절반입니다.</p>
<p>1에 δ를 더한 정확한 값은 첫 자리와 다음 자리의 한가운데입니다. 두 자리의 번호를 0과 1로 매기면 짝수인 0번, 즉 1을 저장합니다. 다시 δ를 더할 때 출발점도 저장된 1입니다. 같은 선택을 한 번 더 하므로 결과가 또 1입니다.</p>
<p>작은 두 항을 먼저 더하면 δ+δ=2δ입니다. 이 작은 값 자체는 지금의 방식으로 정확하게 저장할 수 있습니다. 그 뒤 1에 더한 1+2δ도 허용된 자리에 있으므로 그대로 남습니다. 최종값은 1.0009765625입니다.</p>
<p>세 입력 1, δ, δ는 모두 정확하게 저장됩니다. 처음 데이터를 읽는 순간부터 틀렸던 사례가 아닙니다. 첫 번째 방식에서는 중간 합 1+δ를 저장하는 순간 차이를 버렸습니다. 두 번째 방식은 그 중간 합을 만들지 않아 같은 손실을 피했습니다.</p>
<p>처음 방식의 최종값과 정확한 합의 차이는 −2δ입니다. 한 번의 작은 손실이 다음 단계의 출발값을 바꾸어 끝까지 남았습니다. 앞에서 잃은 δ를 기억해 두는 별도 자리가 없으므로 두 번째 저장이 그것을 알아서 돌려주지 않습니다.</p>
<p>작은 항을 네 번 연속 더해도 매번 같은 1에서 다시 출발합니다(가정). 반면 네 항을 먼저 모으면 4δ가 되어 두 칸을 이동할 수 있습니다. ‘작은 항은 언제나 무시해도 된다’는 판단이 위험한 이유입니다. 각각 작아도 합은 읽어야 할 차이가 될 수 있습니다.</p>
</section>
<section id="picture" data-teach-level="1" className="space-y-6">
<h2 className="text-2xl font-bold">4 · 계산한 위치에서 저장할 자리로 이동한다</h2>
<p>아래 선은 1 근처를 확대했습니다. 채운 점은 저장할 수 있는 자리이고 빈 점은 저장 직전 계산한 위치입니다. 가로축은 1에서 얼마나 더 갔는지를 δ 단위로 표시합니다. 한 칸 δ가 모든 곳에서 저장 가능하다는 뜻은 아닙니다.</p>
<p>한 번씩 더하는 두 장면에서는 빈 점이 같은 가운데에 놓이고 같은 왼쪽 자리로 돌아옵니다. 묶어서 더한 장면에서는 계산한 위치가 저장 가능한 점과 겹칩니다. 마지막 장면의 가운데는 오른쪽으로 이동합니다. 가운데면 항상 작은 값으로 내려간다고 외우면 이 장면을 설명할 수 없습니다.</p>
</section>
<section id="why" data-teach-level="2" className="space-y-6">
<h2 className="text-2xl font-bold">5 · 저장 공간을 아끼는 선택이 계산 경로에도 들어온다</h2>
<p>어떤 구간의 모든 실수를 각각 다른 상태로 저장하려면 무한히 많은 자리가 필요합니다. 실제 메모리에는 정해진 수의 상태만 들어가므로 표현할 값을 고릅니다. 1이나 δ처럼 정확히 놓이는 수와 1+δ처럼 사이에 놓이는 수가 함께 생깁니다.</p>
<p>저장 상태를 늘리면 같은 구간의 자리를 더 촘촘히 만들 수 있습니다. 대신 숫자 하나를 저장하고 옮기는 데 더 많은 공간이 필요합니다. 많은 숫자를 반복해 읽고 쓰는 계산에서는 이 비용이 중요합니다. 공간이 두 배라는 사실만으로 전체 실행 시간이 두 배라고 결론 내리지는 않습니다.</p>
<p>원래의 저장 방식을 유지하면서 중간 합만 더 촘촘한 자리에서 보관하는 선택도 있습니다. 첫 합 1+δ를 지킬 수 있다면 다음 δ를 더해 1+2δ에 도착하고, 마지막 저장 때도 그 값을 남길 수 있습니다. 입력의 저장 방식만으로 전체 계산의 정밀도를 판단할 수 없는 이유입니다.</p>
<p>덧셈을 여러 작업에 나누면 작은 항을 묶는 순서도 달라질 수 있습니다. 식에 적힌 항이 같다는 사실과 중간 저장 순서가 같다는 사실을 구별해야 합니다. 결과의 마지막 몇 자리가 달라졌다면 어떤 값이 어느 자리에서 합쳐졌는지 먼저 확인합니다.</p>
<p>더 촘촘한 저장도 문제의 의미까지 고쳐 주지는 않습니다. 서로 같은 사람의 두 값을 더해야 하는데 다른 사람의 값과 짝지었다면, 각각을 더 정확히 더해도 잘못된 짝은 그대로입니다. 뒤에서는 이 문제를 정확한 정수 아홉 개로 따로 확인합니다.</p>
</section>
<section id="names" data-teach-level="3" className="space-y-6">
<h2 className="text-2xl font-bold">6 · 지금 본 자리와 선택 규칙에 이름을 붙인다</h2>
<div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr><th className="p-3">앞에서 본 역할</th><th className="p-3">이름과 표기</th></tr></thead><tbody>{[
["크기에 따라 자리 간격을 바꾸어 유한한 숫자를 저장하기","부동소수점(floating point)"],
["한 구간에서 얼마나 촘촘하게 값을 구별하는가","정밀도(precision), 유효숫자부(significand)"],
["숫자의 부호와 자리 간격을 정하는 크기","부호(sign), 지수(exponent)"],
["가까운 자리로 옮기고 가운데에서는 짝수 자리를 고르기","최근접 짝수 반올림(round to nearest, ties to even)"],
["선택한 형식으로 저장한 결과","q₁₆(x): binary16, 흔히 FP16으로 저장한 값"],
["1과 그보다 바로 큰 표현값의 차이","기계 엡실론(machine epsilon), ε"],
["연산 중 합을 잠시 보관하는 자리","누산기(accumulator)"],
["중간 반올림에 덜 민감하게 같은 수학적 답을 구하기","수치 안정성(numerical stability)"],
["일반 지수 구간과 0 가까이의 특별한 표현","정규수(normal), 비정규수(subnormal)"],
["큰 값이 범위를 넘거나 작은 값의 정확도를 잃기","오버플로(overflow), 언더플로(underflow)"],
].map((r,i)=><tr key={i} className="border-t border-border">{r.map((s,j)=><td key={j} className="p-3 align-top">{s}</td>)}</tr>)}</tbody></table></div>
<p>이 글에서 FP16은 IEEE binary16을 뜻합니다. FP32는 binary32입니다. BF16은 뒤에서 비교할 별도 16 bit 형식입니다. 이 셋의 이름에 같은 bit 수가 들어가도 저장 가능한 자리 배치가 같지는 않습니다.</p>
</section>
<section id="precision" data-teach-level="4" className="space-y-6">
<h2 className="text-2xl font-bold">7 · 저장하는 소수부 10 bit에 숨은 1이 더해진다</h2>
<p>양의 정규수는 (1+소수부)×2ᴱ로 적습니다. 앞의 1은 정규화하면 항상 있으므로 따로 저장하지 않습니다. 저장한 소수부 비트 수는 f입니다. 이 1까지 센 이진 정밀도는 p=f+1이므로 두 값을 구별해야 합니다. FP16은 f=10이지만 p=11입니다.</p>
<ExplainedFormula question="자리 간격과 한 번의 반올림 오차는 같은 값인가요?" idea="[1,2)에서 소수부를 한 칸 올리면 2의 −f제곱만큼 움직입니다. 최근접 반올림은 보통 그 반 칸 안에서 선택합니다."
formula={String.raw`p=f+1,\quad\varepsilon=2^{-f},\quad u=\varepsilon/2=2^{-p},\quad\operatorname{gap}_{[2^E,2^{E+1})}=2^{E-f}`}
annotatedFormula={String.raw`\begin{gathered}p=f+1,\quad\varepsilon=\underbrace{2^{-f}}_{\text{1에서 위쪽 한 칸}},\quad u=\underbrace{2^{-p}}_{\text{상대 오차 상한}}\\\operatorname{gap}_{[2^E,2^{E+1})}=2^{E-f}\\f=10:\quad\varepsilon=2^{-10}=2\delta,\quad u=2^{-11}=\delta\end{gathered}`}
operations={[{expression:String.raw`\operatorname{fl}(z)=z(1+\eta),\quad |\eta|\le u`,annotation:["정확한 결과 z가 정규 범위에 있고 최근접 반올림하며 overflow가 없는 한 번의 연산에 쓰는 모형입니다."]}]}
terms={[{symbol:"f",name:"저장 소수부 bit 수",description:"숨은 선행 1은 제외합니다."},{symbol:"p",name:"이진 정밀도",description:"정규수의 선행 1까지 셉니다."},{symbol:"u",name:"단위 반올림 오차",description:"여러 연산 전체의 오차 상한은 아닙니다."}]}
assumptions={["상대 오차 모형을 0이나 subnormal 영역에 그대로 적용하지 않습니다.","반올림 방향이 바뀌면 같은 u 상한과 tie 선택을 다시 확인해야 합니다."]} interpretation="1 바로 아래의 간격은 위쪽 간격의 절반입니다. 따라서 ε를 ‘1 주변 모든 곳의 최소 간격’이라고 부르지 않습니다." />
<p>2부터 4 미만에서는 같은 f=10이어도 간격이 2⁻⁹=4δ입니다. 2에 δ를 더하면 이번에는 반 칸보다도 작은 1/4칸입니다. 숫자의 크기가 두 배인 구간으로 옮겨 가자 같은 절대 증가량을 구별하기 더 어려워졌습니다.</p>
<div id="paper-fp-arithmetic"><CitationBlock source="Goldberg, 1991 · Floating-point Formats와 Exactly Rounded Operations" citeKey={1} href="https://docs.oracle.com/cd/E19957-01/806-3568/ncg_goldberg.html">원문은 정규화된 선행 자리까지 포함해 정밀도 p를 세고, 정확히 가운데인 값에서 짝수 유효숫자를 고르는 규칙을 설명합니다. 여기에 binary16의 p=11을 넣어 위의 간격과 두 tie를 계산했습니다. 이 해설을 특정 GPU 명령의 성능 보장으로 사용하지 않습니다.</CitationBlock></div>
</section>
<section id="rounding-trace" data-teach-level="4" className="space-y-6">
<h2 className="text-2xl font-bold">8 · 같은 세 입력을 괄호 두 가지로 끝까지 따라간다</h2>
<p>기호 q₁₆은 값을 저장하고 다시 읽는 동작입니다. 수학적인 덧셈 자체와 이 동작을 따로 적으면 중간에 버린 값이 드러납니다. δ=2⁻¹¹은 ε/2와 정확히 같습니다. 반 간격보다 작아서 1이 된다고 설명하면 경계를 잘못 짚은 것입니다.</p>
<ExplainedFormula question="두 괄호 배치는 어느 저장에서 갈라지나요?" idea="첫 배치는 1+δ를 두 번 저장합니다. 두 번째 배치는 작은 항의 합 2δ를 먼저 보존합니다."
formula={String.raw`q_{16}(q_{16}(1+\delta)+\delta)=1\ne1+2\delta=q_{16}(1+q_{16}(\delta+\delta))`}
annotatedFormula={String.raw`\begin{gathered}q_{16}(\underbrace{q_{16}(1+\delta)}_{1}+\delta)=1\\q_{16}(1+\underbrace{q_{16}(\delta+\delta)}_{2\delta})=1+2\delta\\\delta=2^{-11},\qquad 1+2\delta=1.0009765625\end{gathered}`}
operations={[{expression:String.raw`q_{16}(1+3\delta)=1+4\delta`,annotation:["옆의 tie는 1번 자리와 2번 자리 사이입니다. 짝수인 2번 자리로 올라갑니다."]}]}
terms={[{symbol:"q₁₆",name:"저장 변환",description:"binary16으로 반올림한 값을 다시 읽습니다."},{symbol:"δ",name:"같은 증가량",description:"1/2048이며 입력 자체는 정확히 표현됩니다."}]}
assumptions={["각 q₁₆에서 최근접 짝수 반올림을 수행합니다.","다른 형식으로 중간 합을 유지하거나 연산을 합치는 구현은 별도 경로입니다."]} interpretation="δ를 하나씩 네 번 더하면 모두 1에서 멈춥니다. 4δ를 먼저 모아 더하면 1+4δ=1.001953125입니다." />
<p>중간 합을 FP32로 유지하면 1+δ와 1+2δ를 둘 다 보존할 수 있습니다. 이 사례에서는 마지막에 한 번 FP16으로 바꾸어도 1+2δ가 남습니다. 그렇다고 FP32가 모든 가능한 덧셈을 정확하게 만든다는 뜻은 아닙니다. FP32에도 더 작은 항이 사라지는 경계가 있습니다.</p>
</section>
<section id="code-storage" data-teach-level="5" className="space-y-6">
<h2 className="text-2xl font-bold">9 · 실제 Python에서 두 바이트로 저장하고 다시 읽는다</h2>
<p>재현 코드는 CPython 3.9.6에서 실행했습니다. <code>struct.pack('&gt;e', x)</code>는 x를 큰 바이트부터 오는 binary16 두 바이트로 저장합니다. <code>struct.unpack('&gt;e', ...)[0]</code>으로 읽어 q₁₆을 만듭니다. 저장 변환 사이의 덧셈은 Python의 일반 실수 계산이며 GPU의 FP16 덧셈을 실행한 실험은 아닙니다.</p>
<p>고정한 CPython v3.9.6 원문에서 큰 바이트 순서의 형식 표는 문자 e를 <code>bp_halffloat</code>에 연결합니다. 이 함수는 <code>pack_halffloat</code>를 부르고, 값을 C의 double로 읽어 <code>_PyFloat_Pack2</code>에 넘깁니다. 이 경로에서 실제로 두 바이트를 만드는 부분을 다음 절에서 봅니다.</p>
<CodeViewButton onClick={()=>sidebar.open("dispatch",precisionCodeRefs.dispatch)} label="실제 형식 표와 호출 경로" />
<CodeViewButton onClick={()=>sidebar.open("bridge",precisionCodeRefs.bridge)} label="double 입력을 저장 함수에 넘기는 코드" />
<p>실행 결과는 순서대로 저장했을 때 <code>3c00</code>, 작은 항을 묶었을 때 <code>3c01</code>, 옆의 tie를 저장했을 때 <code>3c02</code>입니다. 각각 1, 1+2δ, 1+4δ입니다. 화면의 반올림된 소수만 비교하지 않고 저장한 바이트도 대조했습니다.</p>
<CodeViewButton onClick={()=>sidebar.open("example",precisionCodeRefs.example)} label="실제로 실행한 덧셈·분산·softmax 검산" />
<p>예제에서 덧셈 뒤마다 변환 함수를 호출했으므로 저장 시점이 명시되어 있습니다. Python의 일반 <code>1.0 + δ + δ</code>만 실행해 놓고 이것을 FP16의 두 번 반올림이라고 해석하면 다른 실험이 됩니다. 원문 전체는 commit db3ff76에 고정했으며 여기서 CPython 자체를 다시 빌드하지는 않았습니다.</p>
</section>
<section id="code-rounding" data-teach-level="5" className="space-y-6">
<h2 className="text-2xl font-bold">10 · 코드의 0.5 비교에 같은 가운데 값을 넣는다</h2>
<p>실제 함수는 양의 유한 입력을 1 이상 2 미만의 부분과 지수로 나눕니다. 1+δ에서는 지수가 0입니다. 정규수 분기에서 지수에 15를 더하고 선행 1을 뺀 뒤 소수부에 1024를 곱합니다. 따라서 반올림 직전 값은 정확히 0.5입니다.</p>
<p>원문의 <code>bits</code>는 이 값의 정수 부분이므로 0입니다. 남은 부분이 0.5보다 큰지, 또는 0.5와 같으면서 bits가 홀수인지 검사합니다. 이번에는 둘 다 거짓이므로 0을 유지합니다. 지수 15를 열 자리 왼쪽으로 옮겨 합치면 0x3c00이 됩니다.</p>
<p>1+3δ를 넣으면 같은 위치의 값이 1.5이고 bits는 1입니다. 남은 0.5와 홀수 조건이 함께 참이어서 bits를 2로 올립니다. 결과는 0x3c02입니다. 코드에 정수로 자르는 단계가 있어도 최종 저장 규칙은 단순 버림이 아닙니다. 뒤의 조건문까지 읽어야 합니다.</p>
<CodeViewButton onClick={()=>sidebar.open("rounding",precisionCodeRefs.rounding)} label="정규화와 최근접 짝수 반올림 원문" />
<p>이 함수는 너무 큰 유한 값을 저장하려 하면 <code>OverflowError</code>를 냅니다. 모든 연산 API가 같은 상황에서 무조건 무한대를 반환하는 것은 아닙니다. 0, 무한대, NaN의 별도 분기와 subnormal 처리는 원문에 함께 있으며, 현재의 양의 정규수 경로와 구분해서 읽습니다.</p>
</section>
<section id="formats" data-teach-level="6" className="space-y-6">
<h2 className="text-2xl font-bold">11 · 같은 16 bit라도 촘촘함과 범위가 다르다</h2>
<p>아래 표의 정밀도 p에는 숨은 1을 포함합니다. p×log₁₀2는 정보량을 십진 자릿수로 환산한 대략적인 크기이며, 모든 십진 입력을 그만큼 정확히 보존한다는 보장이 아닙니다. 부호 bit는 세 형식 모두 1개입니다.</p>
<div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr>{["형식","지수 / 소수부 bit","정밀도 p / 십진 환산","1의 위쪽 간격","최대 유한값"].map(s=><th key={s} className="p-3">{s}</th>)}</tr></thead><tbody>{[
["FP32","8 / 23","24 / 약 7.22","2⁻²³","(2−2⁻²³)2¹²⁷"],
["FP16","5 / 10","11 / 약 3.31","2⁻¹⁰","65504"],
["BF16","8 / 7","8 / 약 2.41","2⁻⁷","(2−2⁻⁷)2¹²⁷"],
].map((r,i)=><tr key={i} className="border-t border-border">{r.map((s,j)=><td key={j} className="p-3 align-top">{s}</td>)}</tr>)}</tbody></table></div>
<p>BF16의 지수 범위는 FP32와 같은 규모이고 두 형식의 최소 양의 정규수는 2⁻¹²⁶입니다. 하지만 최대 유한값은 각각 약 3.3895×10³⁸과 3.4028×10³⁸로 다릅니다. 같은 지수 bit 수가 모든 표현값과 양 끝점의 일치를 뜻하지는 않습니다. BF16은 FP16보다 넓은 크기를 다루되 같은 1 근처에서는 간격이 더 큽니다.</p>
<p>FP16의 최소 양의 정규수는 2⁻¹⁴입니다. 그 아래에서는 숨은 선행 1을 쓰지 않는 subnormal 표현으로 간격 2⁻²⁴를 유지하며 0에 다가갑니다. 실행 예제에서 2⁻²⁴는 남지만 그 절반 2⁻²⁵는 짝수 쪽인 0으로 저장됩니다. 이 구간에 정규수의 상대 오차 한계를 그대로 적용할 수는 없습니다.</p>
<p>저장 형식에서 정의 가능한 아주 작은 값과 실제 장치가 연산에 남기는 값도 구별합니다. 예를 들어 Google Cloud TPU 문서는 FP32에서 BF16으로 변환할 때 subnormal을 0으로 바꾼다고 명시합니다. 이를 모든 BF16 장치의 공통 동작으로 넓히지 않습니다.</p>
<CitationBlock source="Kalamkar 외, A Study of BFLOAT16 for Deep Learning Training · Table 1과 Figure 1" citeKey={2} href="https://arxiv.org/html/1905.12322v3#S3">표의 저장 필드 1/8/7과 1/5/10을 가져와 위의 간격과 유한 최대값을 직접 계산했습니다. 원문 그림의 BF16 입력·FP32 누산 흐름은 입력 저장과 중간 합의 형식을 구별하는 예입니다. 이 논문의 특정 학습 결과를 모든 모델의 정확도 보장으로 사용하지 않습니다.</CitationBlock>
<p><a className="text-primary underline" href="https://docs.cloud.google.com/tpu/docs/bfloat16" target="_blank" rel="noreferrer">Cloud TPU의 변환 규칙</a>은 최근접 짝수 반올림, overflow와 subnormal 처리 범위를 따로 설명합니다. 형식 표와 장치의 변환 계약을 함께 확인해야 합니다.</p>
</section>
<section id="stability" data-teach-level="6" className="space-y-6">
<h2 className="text-2xl font-bold">12 · 큰 지수를 만들기 전에 공통 크기를 뺀다</h2>
<p>이번 입력은 [1000,1001,1002]입니다(가정). 각 수에 지수 함수를 적용하고 그 합으로 나누어 비중을 구하려 합니다. 이 계산을 softmax라고 부릅니다. exp(1000)은 FP32는 물론 일반적인 binary64 범위도 넘습니다. 무한대를 돌려주는 연산에서는 inf/inf가 NaN으로 이어질 수 있고, Python의 <code>math.exp(1000)</code>은 실제로 OverflowError를 냈습니다.</p>
<ExplainedFormula question="큰 공통 크기를 빼도 왜 같은 비중인가요?" idea="수학적으로 분자와 분모에 공통인 exp(m)을 약분합니다. 실제로 거대한 exp(m)을 만들 필요는 없습니다."
formula={String.raw`\operatorname{softmax}(x)_i=\frac{e^{x_i}}{\sum_j e^{x_j}}=\frac{e^{x_i-m}}{\sum_j e^{x_j-m}},\quad m=\max_j x_j`}
annotatedFormula={String.raw`\begin{gathered}\operatorname{softmax}(x)_i=\frac{e^{x_i}}{\sum_j e^{x_j}}=\underbrace{\frac{e^{x_i-m}}{\sum_j e^{x_j-m}}}_{\text{공통 크기를 빼고 계산}},\quad m=\max_j x_j\\{}[1000,1001,1002]-1002=[-2,-1,0]\end{gathered}`}
operations={[{expression:String.raw`[e^{-2},e^{-1},1]/(e^{-2}+e^{-1}+1)`,annotation:["합은 약 1.5032147이며 비중은 약 [0.0900306, 0.2447285, 0.6652410]입니다."]}]}
terms={[{symbol:"xᵢ",name:"입력 점수",description:"유한한 수라고 가정합니다."},{symbol:"m",name:"가장 큰 점수",description:"적어도 한 항에서 xᵢ−m=0입니다."}]}
assumptions={["입력은 비어 있지 않고 모두 유한합니다. 무한대나 NaN은 별도 처리 계약이 필요합니다.","항등식은 실수 연산의 관계입니다. 반올림한 구현 결과가 두 식에서 bit 단위로 같다는 보장은 아닙니다."]} interpretation="큰 개별 exp를 만들면서 생기는 overflow를 피합니다. 합산의 정밀도와 작은 항의 소실까지 전부 없애는 공식은 아닙니다." />
<p>[-1002,-1001,-1000]도 최댓값 −1000을 빼면 같은 [−2,−1,0]입니다. 음수가 아주 작다는 이유로 이 변환 뒤 분모가 모두 0이 되지는 않습니다. 유한 입력 중 최댓값에 해당하는 항은 exp(0)=1입니다.</p>
<div id="paper-numerical-stability"><CitationBlock source="Goodfellow·Bengio·Courville, Deep Learning · §4.1, 식 (4.1)" citeKey={3} href="https://www.deeplearningbook.org/contents/numerical.html">원문은 최대값 이동으로 분모에 적어도 하나의 1이 생긴다고 설명하고, 작은 분자는 여전히 underflow할 수 있다고 구분합니다. 위 두 입력에 동일한 이동을 적용해 이 두 조건을 따로 확인했습니다.</CitationBlock></div>
</section>
<section id="underflow" data-teach-level="6" className="space-y-6">
<h2 className="text-2xl font-bold">13 · 작은 비중이 0이 되면 로그는 따로 계산한다</h2>
<p>입력 [0,−1000]은 이미 최댓값이 0입니다(가정). 실행 환경에서 exp(−1000)은 0으로 반올림됩니다. 분모에는 1이 남지만 두 번째 비중은 0입니다. 그 비중에 나중에 로그를 취하면 원래의 유한한 로그값을 얻지 못합니다.</p>
<ExplainedFormula question="아주 작은 비중을 먼저 만들지 않고 로그값을 구할 수 있나요?" idea="나눗셈의 로그를 차로 바꾸고 지수와 로그가 지워지는 항을 먼저 정리합니다."
formula={String.raw`\log\operatorname{softmax}(x)_i=(x_i-m)-\log\sum_j e^{x_j-m}`}
annotatedFormula={String.raw`\begin{gathered}\log\operatorname{softmax}(x)_i=(x_i-m)-\underbrace{\log\sum_j e^{x_j-m}}_{\text{공통 보정}}\\x=[0,-1000]:\quad -1000-\log(1+e^{-1000})\approx-1000\end{gathered}`}
operations={[{expression:String.raw`\log(0)\text{은 실수에서 정의되지 않음}`,annotation:["0으로 저장된 비중을 받은 뒤에는 원래 값의 크기를 되살릴 수 없습니다. 실수 로그는 0에서 정의되지 않습니다."]}]}
terms={[{symbol:"log-softmax",name:"로그 비중 직접 계산",description:"작은 비중을 먼저 저장하지 않는 식입니다."}]}
assumptions={["유한하고 비어 있지 않은 입력이라는 조건을 유지합니다.","구현은 exp와 합산과 log의 정확도 및 누산 형식에 영향을 받습니다."]} interpretation="검산 코드에서는 log(1+exp(−1000))이 0으로 계산되어 두 번째 로그 비중 −1000을 보존했습니다." />
<p>변환 후 각 지수 항은 1 이하이지만 항의 개수가 매우 많고 좁은 형식으로 합산하면 합 자체의 범위나 반올림이 문제가 될 수 있습니다. 유한한 두 입력의 차도 표현 범위를 넘는 극단적인 경우가 있습니다. 최대값 이동을 모든 수치 문제의 제거라고 설명하지 않고 어떤 중간값을 피했는지 말해야 합니다.</p>
</section>
<section id="cancellation" data-teach-level="6" className="space-y-6">
<h2 className="text-2xl font-bold">14 · 큰 두 모멘트가 같아지면 작은 분산이 지워진다</h2>
<p>두 값 [10000,10002]의 평균은 10001이고 모집단 분산은 1입니다(가정). 각 단계의 결과를 FP32로 저장하면서 평균 제곱을 빼는 식으로 계산해 봅시다. 두 번째 값의 정확한 제곱 100040004는 저장할 때 100040000이 됩니다.</p>
<div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr><th className="p-3">계산</th><th className="p-3">FP32로 저장한 값</th></tr></thead><tbody>{[
["두 입력의 제곱","100000000, 100040000"],["제곱들의 평균 E[X²]","100020000"],["평균의 제곱 E[X]²","100020000"],["두 저장값의 차","0"],["입력에서 평균을 먼저 빼기","−1, 1"],["그 차를 제곱해 평균 내기","1"],
].map((r,i)=><tr key={i} className="border-t border-border">{r.map((s,j)=><td key={j} className="p-3">{s}</td>)}</tr>)}</tbody></table></div>
<p>정확한 모멘트는 100020002와 100020001입니다. 두 큰 값에 비해 작은 반올림이 분산 1에는 결정적이었습니다. 이렇게 앞선 오차가 큰 두 항의 차에서 드러나 결과의 상대 오차를 키우는 현상을 치명적 상쇄라고 부릅니다.</p>
<p>중심화한 식 Σ(xᵢ−평균)²/n도 뺄셈을 합니다. 뺄셈 자체를 없앤 것이 아니라 큰 제곱들의 차를 구하는 경로를 피한 것입니다. 입력이 이미 같은 값으로 저장됐거나 평균 추정이 부정확하면 중심화도 원래 정보를 복구하지 못합니다.</p>
<p>가까운 두 수를 빼면 언제나 새 반올림 오차가 생기는 것도 아닙니다. 앞 사례의 표현값 (1+2δ)−1은 정확히 2δ로 저장됩니다. 입력의 작은 변화에 답이 얼마나 민감한지와, 선택한 알고리즘이 추가 오차를 얼마나 만드는지를 구별해야 합니다. 정확한 뺄셈도 이미 틀어진 입력의 차를 그대로 보여 줄 수 있습니다.</p>
</section>
<section id="shape" data-teach-level="6" className="space-y-6">
<h2 className="text-2xl font-bold">15 · 정확하게 더해도 잘못 짝지으면 아홉 값이 나온다</h2>
<p>이제 a에는 [1,2,3]을 세로로, b에는 [10,20,30]을 가로로 놓습니다(가정). 의도한 답이 같은 위치끼리 더한 [11,22,33]이라 해도, 축의 크기만 보고 조합하는 연산은 다른 답을 만들 수 있습니다. 이 축 크기 목록을 shape라고 부릅니다.</p>
<p>NumPy의 broadcasting 규칙은 오른쪽 축부터 맞추며 크기가 같거나 둘 중 하나가 1이면 허용합니다. a의 (3,1)에 b의 (3,)를 맞출 때 b는 비교상 (1,3)처럼 취급됩니다. 첫 축에서는 3과 1, 끝 축에서는 1과 3이므로 결과 크기는 (3,3)입니다.</p>
<div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr>{["a의 값","b=10","b=20","b=30"].map(s=><th key={s} className="p-3">{s}</th>)}</tr></thead><tbody>{[1,2,3].map(a=><tr key={a} className="border-t border-border"><th className="p-3">{a}</th>{[10,20,30].map(b=><td key={b} className="p-3">{a+b}</td>)}</tr>)}</tbody></table></div>
<p>위 정수와 덧셈 결과는 FP16에도 정확히 들어갑니다. 더 정밀한 형식으로 바꿔도 아홉 조합은 그대로입니다. 둘 다 원소가 세 개라는 사실과 축 배치가 같다는 사실은 다릅니다. 같은 위치끼리 더하려면 둘 다 (3,) 또는 둘 다 (3,1)로 맞추는 등 의도한 축 계약을 명시해야 합니다.</p>
<p>(3,4)+(5,)는 끝의 4와 5가 다르고 어느 쪽도 1이 아니므로 이 규칙으로 합칠 수 없습니다. 반면 (32,128,768)+(768,)는 마지막 축이 같아 각 위치의 768개 값에 같은 가로 목록을 더할 수 있습니다. 규칙이 허용하는지와 그 짝짓기가 의도인지 각각 확인합니다.</p>
<CitationBlock source="NumPy 2.0 사용자 안내 · General broadcasting rules" citeKey={4} href="https://numpy.org/doc/2.0/user/basics.broadcasting.html">원문의 오른쪽 정렬과 같음 또는 1이라는 조건을 세 shape에 직접 적용했습니다. 표의 정수 합은 Python으로 검산했으며 여기서 NumPy를 실행한 결과라고 주장하지 않습니다. broadcasting 설명을 입력 배열을 반드시 물리적으로 복사한다는 의미로 읽지도 않습니다.</CitationBlock>
</section>
<section id="applications" data-teach-level="6" className="space-y-6">
<h2 className="text-2xl font-bold">16 · 입력·연산·누산·출력의 형식을 따로 확인한다</h2>
<p>자동 혼합 정밀도는 일부 연산을 낮은 정밀도로 실행하고 민감한 연산에는 다른 형식을 사용하는 정책입니다. 낮은 정밀도가 빠른지는 장치와 실제 연산에 달려 있습니다. 입력을 FP16으로 저장했다는 사실만으로 곱셈과 합산과 출력 저장이 전부 FP16이라고 단정할 수 없습니다.</p>
<p>FP16은 BF16보다 같은 크기에서 자리가 촘촘하지만 표현할 크기의 범위가 좁습니다. BF16은 범위를 넓히면서 같은 구간의 정밀도를 줄입니다. 어떤 연산에 어떤 형식을 쓰는지는 프레임워크 버전, 장치, 연산 종류와 구현을 함께 봐야 합니다. ‘큰 값이면 BF16을 고르면 끝’이라는 규칙으로 정확도를 보장할 수 없습니다.</p>
<p>작은 기울기가 0이 되는 것을 줄이려고 손실에 배율을 곱한 뒤 기울기를 되돌리는 방법을 손실 스케일링이라고 합니다. 이는 작은 값이 머무는 범위를 조정합니다. 이미 1+δ를 1로 저장하면서 버린 차이를 나중에 되찾는 방법은 아닙니다. 가중치나 누산값을 더 넓게 유지하는 선택과 목적을 구분합니다.</p>
<p><a className="text-primary underline" href="https://docs.pytorch.org/docs/2.14/amp.html" target="_blank" rel="noreferrer">PyTorch 2.14 AMP의 연산별 안내</a>에서 실제 장치의 autocast 대상과 출력 형식을 확인할 수 있습니다. 이 글의 저장 변환 실험은 해당 정책이나 GPU 처리 시간을 측정한 실험이 아닙니다.</p>
<p>이어 볼 내용은 <Link className="text-primary underline" to="/cs/ai/training-pipeline#loop">학습 루프의 혼합 정밀도</Link>, <Link className="text-primary underline" to="/cs/ai/quantization#error-shape">정수 격자의 반올림과 clipping</Link>, <Link className="text-primary underline" to="/cs/ai/math-matrices-svd#matrix-map">행렬이 요구하는 입력·출력 차원</Link>입니다. 같은 저장 문제를 재사용하되 각각의 연산 계약에서 다시 확인합니다.</p>
</section>
<section id="limits" data-teach-level="7" className="space-y-6">
<h2 className="text-2xl font-bold">17 · 값이 다른 이유를 재현 가능한 조건으로 적는다</h2>
<p>먼저 같은 입력이 들어갔는지와 shape를 기록합니다. 다음으로 입력 저장, 실제 연산, 합산, 출력 저장의 형식과 반올림 위치를 적습니다. 서로 다른 장치에서 결과가 달라졌다면 병렬 합산 순서나 합쳐진 연산도 확인합니다. 수학적으로 같은 식이라는 사실만으로 실행 경로까지 같아지지는 않습니다.</p>
<p>오차를 비교할 기준값도 정해야 합니다. 이번 δ 사례와 정수 표는 정확한 유리수·정수 답을 알 수 있습니다. 일반 입력에서는 더 높은 정밀도로 계산한 기준이나 알고리즘의 오차 한계가 필요합니다. 0에 가까운 답에서는 상대 오차만 보면 의미가 흐려지므로 절대 오차도 함께 봅니다.</p>
<p>이 글은 저장 변환과 작은 계산의 실제 실행을 확인했습니다. 하드웨어별 subnormal 처리, 행렬 커널의 누산 방식과 빠르기, 모든 모델의 학습 정확도까지 검증한 것은 아닙니다. 좁은 사례에서 맞은 결론을 넓힐 때는 그 조건을 다시 확인합니다.</p>
</section>
<section id="review" data-teach-level="8" className="space-y-6">
<h2 className="text-2xl font-bold">18 · 바꾸기 전에 다음 저장값을 예측한다</h2>
<p>저장 가능한 자리와 계산 경로를 먼저 그리면 ‘오차가 있다’는 말보다 구체적으로 원인을 찾을 수 있습니다. 어느 입력이 어느 중간값을 거쳐 어느 자리로 저장됐는지를 같은 숫자로 끝까지 확인하는 것이 출발점입니다.</p>
<ol className="list-decimal space-y-4 pl-6">
<li>δ를 하나씩 네 번 더할 때와 4δ를 먼저 만들어 더할 때 최종값은 각각 무엇인가요? 중간에 버린 값을 짚어 보세요. (답: 8절)</li>
<li>유한 입력 [−1002,−1001,−1000]에서 최댓값을 뺀 뒤 분모가 모두 0이 될까요? 작은 분자가 사라지는 경우와 구별하세요. (답: 12·13절)</li>
<li>(3,1)+(3,)의 저장 형식을 더 정밀하게 바꾸면 결과 원소 수가 3개가 될까요? 실제 아홉 조합으로 설명하세요. (답: 15절)</li>
</ol>

</section>
<CodeSidebar codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef} onClose={sidebar.close} onNavigate={sidebar.navigate} codeRefs={precisionCodeRefs} fileTrees={{cpython:{name:"cpython",type:"dir",children:[{name:"Objects/floatobject.c",type:"file",path:"cpython/Objects/floatobject.c",codeKey:"rounding"},{name:"Modules/_struct.c",type:"file",path:"cpython/Modules/_struct.c",codeKey:"dispatch"},{name:"rounding_case.py",type:"file",path:"rounding_case.py",codeKey:"example"}]}}} projectMetas={{cpython:{id:"cpython",label:"CPython v3.9.6",badgeClass:"border-border"}}}/>
</article>;}

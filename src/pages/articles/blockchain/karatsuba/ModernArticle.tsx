import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ExplainedFormula from "@/components/ui/explained-formula";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation-block";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import ReviewPrompts from "../../world-systems/ReviewPrompts";
import ModernKaratsubaViz from "./viz/ModernKaratsubaViz";
import { codeRefs, fileTrees } from "./codeRefs";

export default function ModernKaratsubaArticle() {
 const sidebar=useCodeSidebar();
 return <article className="space-y-14">
<section id="overview" data-teach-level="S" className="space-y-5">
<h2 className="text-2xl font-bold">1. 큰 곱셈 하나를 작은 곱셈 세 개로 만듭니다</h2>
<p>1234와 5678을 곱하려고 합니다. 각각 앞의 두 자리와 뒤의 두 자리로 나누면 12·34와 56·78입니다. 네 조각을 어떻게 조합하느냐에 따라 작은 곱셈을 네 번 할 수도 있고 세 번 할 수도 있습니다. 어느 방법이든 답은 7,006,652여야 합니다.</p>
<p>이 글은 같은 답을 더 적은 곱셈으로 만드는 방법을 따라갑니다. 먼저 손으로 계산한 뒤 같은 분해를 반복했을 때 계산량이 어떻게 늘어나는지 봅니다. 마지막에는 실제 GNU MP 원문에서 자리 배열과 부호, 올림을 처리하는 위치를 확인합니다.</p>
<ContentBoundary article="karatsuba" />
</section>
<section id="black-box" data-teach-level="B" className="space-y-5">
<h2 className="text-2xl font-bold">2. 두 정수를 받아 정확한 곱 하나를 돌려줍니다</h2>
<p>입력은 0 이상의 정수 두 개이고 출력은 정확한 정수 곱입니다. 소수점 근사나 나머지 계산은 하지 않습니다. 두 입력을 자리별 조각으로 나누고 작은 곱들을 계산한 다음 각 조각을 원래 자리로 옮겨 더합니다.</p>
<p>입력이 음수라면 부호를 따로 정하고 절댓값을 곱할 수 있습니다. 여기서는 0 이상인 입력에 집중합니다. 임시 값에 필요한 자리까지 저장한다는 조건도 둡니다. 중간 결과가 넘쳤는데 버려도 된다는 뜻은 아닙니다.</p>
</section>
<section id="case" data-teach-level="0" className="space-y-5">
<h2 className="text-2xl font-bold">3. 네 번 곱한 결과를 비교 기준으로 둡니다</h2>
<p>두 자리 묶음 하나의 크기를 100으로 정합니다(가정). 1234=12×100+34이고 5678=56×100+78입니다. 먼저 12×56=672와 34×78=2652를 구합니다. 서로 다른 위치끼리의 곱은 12×78=936과 34×56=1904입니다.</p>
<p>높은 자리끼리의 곱 672에는 100을 두 번 곱합니다. 서로 다른 위치끼리의 합 936+1904=2840에는 100을 한 번 곱합니다. 낮은 자리끼리의 2652는 그대로 더합니다. 따라서 6,720,000+284,000+2652=7,006,652입니다.</p>
<p>다른 계산법을 만들 때도 이 네 조각의 역할과 최종 값이 보존되어야 합니다. 특히 2652는 한 묶음의 최대값 99보다 큽니다. 조각의 곱을 한 묶음 안에 억지로 넣으면 올림을 잃습니다.</p>
</section>
<section id="picture" data-teach-level="1" className="space-y-5">
<h2 className="text-2xl font-bold">4. 가운데 두 곱의 합을 한 번에 구합니다</h2>
<ModernKaratsubaViz />
<p>높은 곱 672와 낮은 곱 2652는 그대로 둡니다. 대신 12와 34의 합 46, 56과 78의 합 134를 곱합니다. 그 결과 6164에는 이미 구한 높은 곱과 낮은 곱도 들어 있으므로 둘을 빼면 가운데에 필요한 2840만 남습니다.</p>
</section>
<section id="need" data-teach-level="2" className="space-y-5">
<h2 className="text-2xl font-bold">5. 덧셈을 늘려도 큰 곱셈을 줄이면 이득일 수 있습니다</h2>
<p>각 자리를 하나씩 짝지어 곱하면 자리 수가 두 배일 때 곱할 쌍은 네 배가 됩니다. 큰 정수에서는 이런 작은 곱의 수가 많아집니다. 반면 두 수를 더하거나 빼는 일은 각 자리를 한 번씩 지나며 처리할 수 있습니다.</p>
<p>따라서 비싼 곱 하나를 여러 번의 덧셈과 뺄셈으로 바꾸는 선택이 가능합니다. 아직 빠르다고 단정할 수는 없습니다. 입력이 작으면 추가 함수 호출과 임시 공간을 준비하는 비용이 절약한 곱보다 클 수 있습니다.</p>
</section>
<section id="names" data-teach-level="3" className="space-y-5">
<h2 className="text-2xl font-bold">6. 조각과 자리 기준에 이름을 붙입니다</h2>
<p>네 조각을 모두 곱하는 방법을 학교식 곱셈, 교차항을 재사용해 세 곱으로 줄이는 방법을 Karatsuba 곱셈이라고 부릅니다. 교차항은 높은 조각과 낮은 조각을 서로 곱해 더한 값입니다. 우리 사례에서는 2840입니다.</p>
<p>나누는 자리의 크기를 B라고 쓰고 높은 조각에는 아래첨자 1, 낮은 조각에는 0을 붙입니다. x₁=12, x₀=34, y₁=56, y₀=78이고 B=100입니다. 같은 분할을 작은 곱에도 다시 적용하는 일을 재귀라고 합니다.</p>
<p>실제 큰 정수 라이브러리는 보통 2의 거듭제곱을 한 자리의 크기로 씁니다. 기계가 다루는 이 자리 단위를 limb라고 부릅니다. 더 작은 입력에서는 단순한 곱셈으로 멈추는데, 그 전환 크기가 임계값 또는 cutoff입니다.</p>
</section>
<section id="naive-mul" data-teach-level="4" className="space-y-5">
<h2 className="text-2xl font-bold">7. 분배법칙으로 네 곱의 자리 위치를 확인합니다</h2>
<ExplainedFormula question="작은 곱마다 100을 몇 번 곱해야 하나요?" idea="높은 조각을 한 번 고를 때마다 B가 하나 붙습니다. 두 번 고른 항은 B², 한 번 고른 두 항은 B를 공유합니다."
formula={String.raw`\begin{aligned}x&=x_1B+x_0\\y&=y_1B+y_0\\xy&=x_1y_1B^2\\&\quad +(x_1y_0+x_0y_1)B+x_0y_0\end{aligned}`}
annotatedFormula={String.raw`\begin{gathered}\underbrace{672\cdot100^2}_{\text{높은 곱의 위치}}\\+\underbrace{(936+1904)\cdot100}_{\text{두 교차항의 위치}}\\+\underbrace{2652}_{\text{낮은 곱의 위치}}\end{gathered}`}
operations={[{expression:"x_1y_0+x_0y_1",annotation:["12×78과 34×56을 더한 2840입니다.","두 항은 같은 자리 크기 B를 공유합니다."]}]}
terms={[{symbol:"B",name:"분할 기준",description:"사례에서는 100입니다. 낮은 조각은 0 이상 B 미만입니다."},{symbol:"x₁·y₁",name:"높은 곱",description:"12×56=672입니다. 최종 결과에서 B²만큼 옮깁니다."},{symbol:"x₀·y₀",name:"낮은 곱",description:"34×78=2652입니다. 곱 자체는 B보다 클 수 있습니다."}]}
assumptions={["정확한 정수 연산이며 자리 이동과 합산에서 올림을 버리지 않습니다.","여기서는 두 입력을 비슷한 크기의 두 조각으로 나눕니다."]}
interpretation="곱셈 네 번 중 가운데 두 번은 개별 값을 따로 보관할 필요가 없습니다. 최종 결과에는 그 합만 사용됩니다." />
</section>
<section id="karatsuba-trick" data-teach-level="5" className="space-y-5">
<h2 className="text-2xl font-bold">8. 합의 곱에서 이미 아는 두 항을 뺍니다</h2>
<ExplainedFormula question="46×134에서 무엇을 빼면 2840이 남나요?" idea="합을 곱하면 원래 네 곱이 모두 들어 있습니다. 이미 계산한 높은 곱과 낮은 곱을 빼면 두 교차항의 합을 얻습니다."
formula={String.raw`\begin{aligned}z_0&=x_0y_0,\quad z_2=x_1y_1\\s&=(x_0+x_1)(y_0+y_1)\\z_1&=s-z_0-z_2\\xy&=z_2B^2+z_1B+z_0\end{aligned}`}
annotatedFormula={String.raw`\begin{aligned}s&=46\cdot134=6164\\z_1&=6164-2652-672\\&=2840\end{aligned}`}
operations={[{expression:"s=z_0+z_2+x_0y_1+x_1y_0",annotation:["분배법칙으로 합의 곱을 전개합니다.","z₀와 z₂를 빼면 원하는 두 교차항만 남습니다."]}]}
terms={[{symbol:"z₀",name:"낮은 곱",description:"앞에서 계산한 2652를 재사용합니다."},{symbol:"z₂",name:"높은 곱",description:"앞에서 계산한 672를 재사용합니다."},{symbol:"s",name:"합의 곱",description:"새로 계산하는 세 번째 곱 6164입니다."},{symbol:"z₁",name:"교차항의 합",description:"곱을 두 번 하는 대신 뺄셈으로 얻은 2840입니다."}]}
assumptions={["합이 한 자리 커질 수 있으므로 134 전체를 저장합니다.","0 이상인 조각의 실제 교차항은 0 이상입니다. 임시 계산의 부호와 올림은 별도로 처리합니다."]}
interpretation="이 등식은 모든 크기의 정수에 맞습니다. 덧셈과 뺄셈, 자리 이동까지 포함한 실행 시간이 항상 줄어든다는 주장은 아닙니다." />
</section>
<section id="trace" data-teach-level="5" className="space-y-5">
<h2 className="text-2xl font-bold">9. 세 곱의 결과를 원래 자리에 놓습니다</h2>
<AlgorithmBlock title="1234×5678의 손계산 절차" input={["x=1234, y=5678, B=100"]} steps={[
{code:"split: x1=12, x0=34; y1=56, y0=78",note:"낮은 두 자리와 나머지를 구분합니다."},
{code:"z2=12*56=672; z0=34*78=2652",note:"높은 곱과 낮은 곱을 한 번씩 계산합니다."},
{code:"s=(12+34)*(56+78)=46*134=6164",note:"세 번째 곱에는 합의 올림까지 포함합니다."},
{code:"z1=6164-672-2652=2840",note:"같은 자리로 들어갈 두 교차항의 합을 얻습니다."},
{code:"result=672*10000+2840*100+2652=7006652",note:"자리 위치를 복원하고 올림을 포함해 합칩니다."}
]} output="7,006,652. 네 곱으로 얻은 기준 결과와 같습니다." />
<p>100진 자리 묶음으로도 올림을 확인할 수 있습니다. 2652에서 낮은 자리 52를 남기고 26을 가운데로 보냅니다. 가운데는 2840+26=2866이므로 66을 남기고 28을 위로 보냅니다. 위쪽 672+28=700을 다시 나누면 7과 00입니다. 높은 쪽부터 7 | 00 | 66 | 52를 읽으면 같은 답입니다.</p>
<p>만약 56+78=134를 두 자리 34로 잘라 버리면 세 번째 곱은 46×34=1564가 됩니다. 잘못된 교차항은 1564−672−2652=−1760이고 최종 값은 6,546,652입니다. 올바른 교차항이 음수가 된 것이 아니라 중간 합의 올림을 버린 버그입니다.</p>
</section>
<section id="source" data-teach-level="6" className="space-y-5">
<h2 className="text-2xl font-bold">10. GMP 문서는 합 대신 차를 곱합니다</h2>
<p>GNU MP 6.3.0 공식 설명은 두 합 대신 두 차의 곱을 사용합니다. d=(x₁−x₀)(y₁−y₀)라고 하면 전개 결과는 z₂+z₀−z₁입니다. 따라서 필요한 교차항은 z₁=z₂+z₀−d로 얻습니다. 세 곱이라는 구조는 같습니다.</p>
<ExplainedFormula question="두 차를 곱해도 같은 가운데 항이 나오나요?" idea="차의 곱에서 두 교차항은 음수로 들어갑니다. 높은 곱과 낮은 곱의 합에서 이를 빼면 교차항만 남습니다."
formula={String.raw`\begin{gathered}d=(x_1-x_0)(y_1-y_0)\\xy=(B^2+B)z_2-Bd+(B+1)z_0\end{gathered}`}
annotatedFormula={String.raw`\begin{aligned}d&=(-22)(-22)=484\\z_1&=672+2652-484\\&=2840\end{aligned}`}
operations={[{expression:"(B^2+B)z_2-Bd+(B+1)z_0",annotation:["B²z₂+B(z₂+z₀−d)+z₀로 묶으면 앞의 재결합식입니다.","B=100에 넣어도 7,006,652가 됩니다."]}]}
terms={[{symbol:"d",name:"두 차의 곱",description:"차 각각의 부호는 달라도 곱의 부호만 알면 재결합할 수 있습니다."},{symbol:"|x₁−x₀|",name:"저장할 차의 크기",description:"두 조각이 B 미만이면 절댓값도 B 미만입니다."}]}
assumptions={["공식 문서의 실제 limb 기준 B는 2의 거듭제곱입니다. 위의 B=100은 같은 등식에 십진 사례를 대입한 것입니다.","차는 절댓값을 저장하고 부호에 따라 더하거나 뺄 수 있습니다."]}
interpretation="합 134는 B=100을 넘지만 차의 크기 22는 넘지 않습니다. GMP는 이 차이를 이용해 중간 입력이 한 자리 커지는 부담을 줄입니다." />
<p>차의 곱이 음수인 경우에는 그 절댓값을 더해야 합니다. 예를 들어 두 번째 수를 7856으로 바꾸면 차는 −22와 22, 곱은 −484입니다. 높은 곱 936과 낮은 곱 1904에 484를 더한 3324가 교차항입니다. 부호를 무시하고 빼면 다른 답이 됩니다.</p>
<div id="paper-gmp-karatsuba"><CitationBlock source="GNU MP 6.3.0 · Karatsuba Multiplication" citeKey={1} href="https://gmplib.org/manual/Karatsuba-Multiplication">공식 문서의 차의 곱과 자리 재결합식에 같은 네 조각을 대입했습니다. 합이 커지는 경우와 부호를 따로 저장하는 이유를 이 사례로 확인할 수 있습니다.</CitationBlock></div>
</section>
<section id="limbs" data-teach-level="6" className="space-y-5">
<h2 className="text-2xl font-bold">11. 실제 C 원문의 배열과 부호 분기를 따라갑니다</h2>
<p>코드 패널은 GNU가 배포한 gmp-6.3.0.tar.xz에서 꺼낸 mpn/generic/toom22_mul.c 전체입니다. 원문은 내부 함수이며 인터페이스가 바뀔 수 있다고 명시합니다. 애플리케이션에서 직접 호출할 공개 API로 소개하는 것은 아닙니다.</p>
<CodeViewButton label="원본 분할과 입력 조건 · 87–117행" onClick={()=>sidebar.open("split",codeRefs.split)} />
<p>앞의 1234와 5678 자체는 64비트 한 limb 안에 들어갑니다. 보통의 라이브러리 호출에서 이 작은 입력이 바로 Karatsuba 경로를 탄다고 말할 수 없습니다. 배열 동작을 읽기 위해 같은 네 조각을 64비트 자리 두 개에 놓습니다(가정). 낮은 자리부터 ap=[34,12], bp=[78,56]이며 두 정수의 값은 이제 12×2⁶⁴+34와 56×2⁶⁴+78입니다.</p>
<p>an=bn=2를 넣으면 s=n=t=1입니다. ap+n과 bp+n은 각각 높은 자리 12와 56을 가리킵니다. 원문은 낮은 조각에서 높은 조각을 뺀 차를 사용합니다. 두 차 모두 34−12=22, 78−56=22라서 음수 표시 vm1_neg는 0으로 남습니다. 앞 절과는 두 차의 방향을 함께 바꿨으므로 곱 484는 같습니다.</p>
<CodeViewButton label="원본 절댓값과 부호 · 119–171행" onClick={()=>sidebar.open("difference",codeRefs.difference)} />
<p>179행은 두 차를 곱해 vm1=484를 만듭니다. 181–182행은 높은 곱 vinf=672, 185행은 낮은 곱 v0=2652를 계산합니다. 세 작은 곱이 각각 충분히 작으면 재귀 대신 기본 곱셈으로 끝납니다.</p>
<CodeViewButton label="원본 세 곱 호출 · 173–185행" onClick={()=>sidebar.open("products",codeRefs.products)} />
<p>188행부터는 결과 배열의 겹치는 자리를 합칩니다. 이 사례에서는 188행의 위쪽 자리에 672가 있고 191행에서 가운데 자리 672+2652=3324를 만듭니다. 199행은 부호가 0이므로 484를 빼 가운데를 2840으로 바꿉니다. 각 값이 2⁶⁴보다 작아 이 사례의 cy와 cy2는 0이며 결과는 낮은 순서 [2652,2840,672,0]입니다.</p>
<CodeViewButton label="원본 합산·뺄셈·올림 · 187–221행" onClick={()=>sidebar.open("combine",codeRefs.combine)} />
<p>이 배열의 값은 672×(2⁶⁴)²+2840×2⁶⁴+2652입니다. 십진 기준에서 올림으로 묶음이 바뀌었던 9절과 달리 여기서는 각 계수가 한 limb에 들어갑니다. 같은 네 조각과 세 곱을 유지하면서 자리의 크기만 바꾼 것입니다. 본문 검증은 독립 정수 계산과 원문 분기 대조이며 이 C 함수를 컴파일해 실행한 결과는 아닙니다.</p>
<p>아래 원문의 61–68행은 설정된 임계값에 따라 기본 곱셈 또는 재귀를 선택합니다. 길이가 다른 하위 문제는 76–85행에서 비율까지 확인해 다른 분할을 선택할 수 있습니다. 재귀식의 세 번과 실제 호출 경로를 구분해야 하는 이유입니다.</p>
<CodeViewButton label="원본 재귀와 임계값 · 54–85행" onClick={()=>sidebar.open("cutoff",codeRefs.cutoff)} />
</section>
<section id="recursive" data-teach-level="7" className="space-y-5">
<h2 className="text-2xl font-bold">12. 깊이는 두 배 기준으로, 작은 곱은 세 배씩 늘어납니다</h2>
<p>크기가 같은 n자리 두 수에서 차의 곱을 쓰면 세 하위 곱의 입력은 절반 크기 안에 들어갑니다. n=2ᵏ이고 한 자리까지 모두 분할하는 계산 모형을 생각합니다(가정). 8자리는 4자리, 2자리, 1자리로 세 번 줄어듭니다. 각 문제를 항상 세 개로 펼친 전체 나무의 마지막 곱은 3³=27개입니다. 학교식의 자리 쌍 8²=64개와 비교할 수 있습니다.</p>
<p>실제 구현은 0을 빠르게 처리하거나 여러 자리에서 재귀를 멈출 수 있습니다. 또 합을 쓰는 방식은 중간 합이 한 자리 커질 수 있습니다. 따라서 27은 위에서 정한 균형 잡힌 전체 재귀 나무의 값이며 임의 구현을 실행한 호출 수가 아닙니다.</p>
<ExplainedFormula question="덧셈 비용을 포함해도 왜 지수가 약 1.585인가요?" idea="깊이 j에는 3ʲ개 문제가 있고 각 문제의 크기는 n/2ʲ입니다. 각 층의 선형 합산 비용과 마지막 작은 곱들을 모두 더합니다."
formula={String.raw`\begin{gathered}T(n)=3T(n/2)+cn\\T(n)=\Theta(n^{\log_2 3})\\\log_2 3\approx1.585\end{gathered}`}
annotatedFormula={String.raw`\begin{gathered}\text{깊이 }j:\quad cn(3/2)^j\\\text{마지막 곱}:\quad 3^k=n^{\log_2 3}\\\sum_{j=0}^{k-1}cn(3/2)^j\\=2cn((3/2)^k-1)\end{gathered}`}
operations={[{expression:"n(3/2)^k=3^k",annotation:["n=2ᵏ를 넣어 합산 비용의 가장 큰 항도 3ᵏ 규모임을 확인합니다."]}]}
terms={[{symbol:"T(n)",name:"n자리의 계산 비용",description:"같은 연산 비용 모형에서 비교합니다."},{symbol:"cn",name:"한 문제의 합산 비용",description:"합·차와 자리 합치기, 올림을 선형 비용으로 묶었습니다."},{symbol:"Θ",name:"성장률의 범위",description:"충분히 큰 n에서 상수배 위아래로 묶인다는 뜻입니다."}]}
assumptions={["균형 잡힌 두 입력과 고정된 기본 곱셈 크기를 가정합니다.","덧셈·뺄셈·올림이 자리 수에 선형인 비용 모형입니다."]}
interpretation="마지막 곱의 비용과 중간 합산 비용이 같은 차수로 늘어납니다. 지수가 2보다 작다는 사실은 작은 입력의 실행 시간 비율까지 정하지 않습니다." />
<div id="paper-karatsuba-ofman"><CitationBlock source="Karatsuba & Ofman · 1962, 145(2), pp. 293–294" citeKey={2} href="https://www.mathnet.ru/eng/dan26729">원 논문의 저자·제목·연도·쪽수는 MathNet 서지로 확인했습니다. 이 글의 계산과 유도는 위에 모두 적었으며 구현 설명은 열람한 GMP 공식 문서와 배포 소스를 기준으로 합니다.</CitationBlock></div>
</section>
<section id="cost-comparison" data-teach-level="7" className="space-y-5">
<h2 className="text-2xl font-bold">13. 전환 크기는 절약한 곱과 추가 비용이 만나는 곳입니다</h2>
<p>간단한 비교 모형으로 학교식 비용을 n², 한 단계 Karatsuba 비용을 3(n/2)²+4n으로 둡니다(가정). 여기서 4n은 추가 합산 비용이며 실제 CPU의 측정값이 아닙니다. n=8에서는 각각 64와 80이므로 Karatsuba가 더 비쌉니다. n=16에서는 둘 다 256이고 n=32에서는 1024와 896으로 순서가 바뀝니다.</p>
<p>이 모형의 전환점 16을 실제 라이브러리 설정에 복사하면 안 됩니다. 기본 곱셈이 더 빨라지면 절약할 수 있는 곱의 비용도 달라집니다. 덧셈, 올림, 함수 호출과 임시 공간의 비용은 CPU와 컴파일러, 메모리 배치에 따라 바뀝니다.</p>
<p>
            GMP 문서도 기본 곱셈을 이차항과 선형항으로 나누고 세 번의 절반 곱에 추가 비용을 붙여 비교합니다. 원문 매크로의 MUL_TOOM22_THRESHOLD는 이런 구현 선택에
            쓰이는 설정입니다. 한 플랫폼의 값이나 문서의 예를 모든 기계의 임계값으로 읽지 않습니다.
          </p>
<p>성능 비교에서는 같은 입력들을 두 경로에 주고 임계값 주변 크기를 확인합니다. 초기 실행의 영향을 줄인 뒤 시간의 중앙값과 느린 쪽 분포도 기록합니다. CPU, 라이브러리 버전, 컴파일 옵션, 자리 폭을 함께 남겨야 다른 결과와 비교할 수 있습니다.</p>
</section>
<section id="boundaries" data-teach-level="7" className="space-y-5">
<h2 className="text-2xl font-bold">14. 홀수 길이·제곱·확장체에서는 조건을 다시 봅니다</h2>
<p>5자리를 나누면 낮은 쪽 3자리와 높은 쪽 2자리처럼 길이가 다를 수 있습니다. GMP 원문의 n=an−(an&gt;&gt;1)은 낮은 쪽을 길게 잡는 계산입니다. 두 입력의 길이까지 크게 다르면 무조건 절반씩 나눈 재귀식으로 시간이나 호출 수를 예측하기 어렵습니다. 76–85행의 별도 분기도 그 문제를 다룹니다.</p>
<p>같은 수의 제곱에서는 높은 제곱, 낮은 제곱, 차의 제곱 세 개를 재사용할 수 있습니다. 그러나 비교 대상인 학교식 제곱도 대칭인 항을 공유하므로 일반 곱셈과 비용이 다릅니다. 제곱의 임계값은 따로 측정해야 합니다.</p>
<p>자리 기준 B를 문자 u로 바꾸어도 분배법칙은 같습니다. (34+12u)(78+56u)는 2652+2840u+672u²입니다. u²=β라는 규칙을 쓰면 결과는 (2652+672β)+2840u가 됩니다. 나머지 계산을 하는 계수라면 덧셈과 뺄셈도 그 규칙을 따라야 합니다.</p>
<p>이 규칙으로 체를 만들려면 사용하는 다항식이 기약이어야 합니다. 임의의 β를 골랐다고 자동으로 확장체가 되지는 않습니다. 구체적인 계수 순서와 β, 나머지 계산 비용은 <Link className="text-primary hover:underline" to="/cs/crypto/extension-fields">확장체 구현 글</Link>에서 이어 봅니다. 여러 층에서 세 곱을 쓴다는 이유만으로 모든 체에 같은 총 곱셈 수를 붙일 수 없습니다.</p>
<p>훨씬 큰 정수에서는 더 여러 조각으로 나누는 Toom 계열이나 변환을 사용하는 곱셈이 유리할 수 있습니다. Karatsuba의 성장률은 정수 곱셈 전체의 최종 한계가 아닙니다.</p>
</section>
<section id="release" data-teach-level="7" className="space-y-5">
<h2 className="text-2xl font-bold">15. 정확한 답과 실제 속도를 따로 확인합니다</h2>
<p>정확성은 0과 1, 최대 자리 값, 연속 올림, 홀수 길이와 길이가 다른 입력으로 확인합니다. 합의 곱에서는 추가 자리를, 차의 곱에서는 절댓값과 부호를 점검합니다. 기준 정수 곱과 모든 결과가 같아야 속도 비교도 의미가 있습니다.</p>
<p>이 글은 1234×5678의 합·차 두 공식, 부호를 바꾼 사례, 올림을 버린 반례와 재귀 계산을 독립 정수 프로그램으로 검산했습니다. GMP 원문은 분할과 세 곱, 겹친 배열의 합산을 같은 조각으로 대조했습니다. GMP의 실제 실행 시간이나 모든 입력의 상수 시간 동작을 측정한 글은 아닙니다.</p>
<ReviewPrompts questions={["56+78의 134에서 백의 자리를 버리면 최종 답이 얼마로 바뀌나요? (답: 9절)","두 차의 곱이 −484이면 왜 484를 더해야 하며 원문의 어느 부호가 그 선택을 하나요? (답: 10·11절)","비용을 n²과 3(n/2)²+4n으로 두면 어느 크기에서 같아지며 그 숫자를 실제 임계값으로 쓸 수 있나요? (답: 13절)"]} />
</section>
<CodeSidebar codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef} onClose={sidebar.close} onNavigate={sidebar.navigate} codeRefs={codeRefs} fileTrees={fileTrees} projectMetas={{gmp:{id:"gmp",label:"GNU MP 6.3.0 · 공식 배포",badgeClass:"bg-sky-50 border-sky-300 text-sky-800"}}} />
</article>;
}

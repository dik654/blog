import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ExplainedFormula from "@/components/ui/explained-formula";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation-block";
import FlowRail from "../../world-systems/FlowRail";
import ReviewPrompts from "../../world-systems/ReviewPrompts";
import LagrangeFormulaViz from "./viz/LagrangeFormulaViz";

export default function ModernLagrange(){return <article className="space-y-14">
 <section id="overview" data-teach-level="S" className="space-y-5"><h2 className="text-2xl font-bold">1. 세 기록에서 계산 규칙을 다시 찾으려면</h2>
  <p>어떤 계산의 기록 세 개만 남았다고 합시다. 입력 0에서는 1, 입력 1에서는 4, 입력 2에서는 9가 나왔습니다. 이 기록들을 모두 맞추면서 다른 입력의 결과도 계산할 규칙을 찾고 싶습니다.</p>
  <p>입력에 1을 더해 제곱하는 규칙은 세 기록과 맞고 입력 3에서 16을 냅니다. Lagrange 보간은 이런 규칙을 눈치로 추측하지 않고 각 기록을 맞추는 작은 식들을 합쳐 만드는 방법입니다. 어떤 범위에서 답이 하나인지도 함께 확인합니다.</p><ContentBoundary article="lagrange" />
 </section>
 <section id="black-box" data-teach-level="B" className="space-y-5"><h2 className="text-2xl font-bold">2. 위치와 결과를 받고 규칙 또는 새 값을 돌려줍니다</h2>
  <p>입력은 위치와 그곳의 값으로 이루어진 쌍입니다. 계산기는 위치가 서로 다른지 확인한 뒤 각 위치를 위한 식을 만들고 관측값을 곱해 더합니다. 출력은 전체 계산 규칙일 수도, 요청한 위치 한 곳의 값일 수도 있습니다.</p>
  <p>두 출력은 필요한 작업량이 다릅니다. 입력 3에서의 값만 필요하다면 모든 계수를 전개할 필요가 없습니다. 반면 규칙을 다른 계산과 곱하거나 나누려면 전체 계수나 다른 표현이 필요할 수 있습니다.</p>
 </section>
 <section id="case" data-teach-level="0" className="space-y-5"><h2 className="text-2xl font-bold">3. 같은 세 기록을 17개의 값 안에서 계산합니다</h2>
  <p>사례는 (0,1), (1,4), (2,9)입니다. 암호에서 쓰는 계산을 보기 위해 모든 결과는 17로 나눈 나머지로 정합니다(가정). 0부터 16 안에서 계산하며 예를 들어 18은 1, −1은 16과 같습니다.</p>
  <p>규칙 x²+2x+1에 0·1·2를 넣으면 1·4·9입니다. 3에서는 16이고 4에서는 25의 나머지 8입니다. 이 규칙을 미리 안다고 가정하지 않고 세 기록만으로 다시 만들겠습니다.</p>
 </section>
 <section id="picture" data-teach-level="1" className="space-y-5"><h2 className="text-2xl font-bold">4. 각 기록의 담당 식을 만든 뒤 더합니다</h2>
  <FlowRail title="같은 세 기록에서 입력 3의 값까지" steps={[{actor:"기록",movement:"서로 다른 위치 0·1·2와 값 1·4·9를 받습니다.",receives:"(0,1), (1,4), (2,9)"},{actor:"담당 식",movement:"자기 위치에서는 1, 다른 두 위치에서는 0인 식을 만듭니다.",receives:"세 위치를 따로 맞출 수 있는 식"},{actor:"합친 규칙",movement:"담당 식에 1·4·9를 곱해 더하고 입력 3을 넣습니다.",receives:"x²+2x+1과 새 값 16"}]} />
 </section>
 <section id="need" data-teach-level="2" className="space-y-5"><h2 className="text-2xl font-bold">5. 한 기록을 맞추다가 다른 기록을 바꾸지 않으려면</h2>
  <p>입력 0에서 1이 나오게 하려고 상수 1을 더하면 입력 1·2의 값도 바뀝니다. 0의 기록만 담당하는 식은 1·2에서 0이 되어야 합니다. 그래서 (x−1)(x−2)를 사용합니다.</p>
  <p>이 식은 입력 0에서 2가 되므로 2로 나누면 원하는 1이 됩니다. 여기서 나눈다는 것은 2를 곱했을 때 1이 되는 수를 곱한다는 뜻입니다. 2×9=18의 나머지가 1이므로 17 안에서는 2의 역원 9를 곱합니다.</p>
 </section>
 <section id="names" data-teach-level="3" className="space-y-5"><h2 className="text-2xl font-bold">6. 기록은 표본점, 담당 식은 보간 기저입니다</h2>
  <p>기록 (xᵢ,yᵢ)를 표본점이라고 합니다. 자기 표본 위치에서 1이고 다른 위치에서 0인 담당 식을 Lagrange 기저 ℓᵢ라고 합니다. 기저에 표본값을 곱해 더한 다항식 L이 보간 결과입니다.</p>
  <p>가장 높은 x의 지수가 차수입니다. 표본이 N개이면 차수가 N−1 이하인 규칙을 찾습니다. 사례에서는 세 점으로 2차 이하를 찾습니다. 17로 나눈 값들에서 0 아닌 값의 역원을 사용할 수 있는 계산 공간은 <Link to="/cs/crypto/finite-field-theory">유한체 F₁₇</Link>입니다.</p>
 </section>
 <section id="formula" data-teach-level="4" className="space-y-5"><h2 className="text-2xl font-bold">7. 담당 식 세 개를 1·4·9배 해 더합니다</h2>
  <p>첫 기저는 ℓ₀=(x−1)(x−2)/2입니다. 둘째는 ℓ₁=−x(x−2), 셋째는 ℓ₂=x(x−1)/2입니다. 자기 위치를 넣으면 분자와 분모가 같아져 1이고 다른 위치에서는 곱의 한 항이 0이 됩니다.</p>
  <ExplainedFormula question="세 표본값을 간섭 없이 한 식으로 합치려면?" idea="각 기저가 자기 위치에서만 1이므로 목표값을 곱한 뒤 모두 더하면 그 위치의 기록만 남습니다." formula={String.raw`\ell_i(x)=\prod_{j\ne i}\frac{x-x_j}{x_i-x_j},\qquad L(x)=\sum_{i=0}^{N-1}y_i\ell_i(x)`} annotatedFormula={String.raw`\begin{aligned}\ell_0(x)&=\underbrace{(x-1)(x-2)/2}_{\text{0에서 1, 1·2에서 0}}\\\ell_1(x)&=\underbrace{-x(x-2)}_{\text{1에서만 1}}\\\ell_2(x)&=\underbrace{x(x-1)/2}_{\text{2에서만 1}}\\L(x)&=\underbrace{\ell_0+4\ell_1+9\ell_2}_{\text{표본값을 곱해 합침}}\end{aligned}`} operations={[{expression:String.raw`x-x_j`,annotation:["다른 표본 위치 xⱼ에서는 0이 됩니다.","그 위치의 결과를 건드리지 않게 합니다."]},{expression:String.raw`(x_i-x_j)^{-1}`,annotation:["자기 위치의 값이 1이 되도록 맞춥니다.","같은 체의 역원을 곱하며 분모는 0이 아니어야 합니다."]}]} terms={[{symbol:"xᵢ,yᵢ",name:"표본 위치와 값",description:"사례는 (0,1), (1,4), (2,9)입니다."},{symbol:"ℓᵢ",name:"표본별 기저",description:"자기 표본점에서 1, 다른 표본점에서 0인 다항식입니다."},{symbol:"L",name:"보간 결과",description:"차수 2 이하이며 세 기록을 모두 만족합니다."},{symbol:"N",name:"표본 수",description:"일반식의 합은 서로 다른 N개 위치에 대해 계산합니다."}]} assumptions={["모든 표본 위치는 같은 체에서 서로 다릅니다.","나눗셈은 0 아닌 분모의 역원을 곱하는 연산입니다. 사례에서 1/2는9입니다."]} interpretation="F17에서 세 기저의 계수는 각각 9x²+7x+1, 16x²+2x, 9x²+8x입니다. 1·4·9배 해 더하면 계수는 x²에서154 mod17=1, x에서87 mod17=2, 상수1이 되어 x²+2x+1입니다." />
  <LagrangeFormulaViz />
 </section>
 <section id="trace" data-teach-level="5" className="space-y-5"><h2 className="text-2xl font-bold">8. 입력 3에서는 기저값 1·14·3으로 16을 얻습니다</h2>
  <p>같은 기저에 3을 넣으면 ℓ₀(3)=2×1/2=1입니다. ℓ₁(3)=−3×1=14, ℓ₂(3)=3×2/2=3입니다. 따라서 L(3)=1×1+4×14+9×3=84의 나머지 16입니다. 계수식에 직접 대입한 9+6+1=16과 같습니다.</p>
  <p>왜 2차 이하에서는 다른 답이 없을까요? 같은 세 표본을 지나는 두 식이 있다면 그 차이는 0·1·2에서 모두 0입니다. 그러나 0 아닌 2차 이하 다항식은 서로 다른 근을 세 개 가질 수 없습니다. 그러므로 차이는 0이며 두 식은 같습니다. 기저 합이 존재를 보이고 근의 개수에 대한 논리가 유일성을 보입니다.</p>
 </section>
 <section id="source" data-teach-level="6" className="space-y-5"><h2 className="text-2xl font-bold">9. DLMF 원문의 세 점에 같은 기록을 넣습니다</h2>
  <p>NIST DLMF §3.3(i)는 n+1개의 점을 사용합니다. 원문의 n=2, z₀·z₁·z₂=0·1·2, f₀·f₁·f₂=1·4·9로 놓으면 식 3.3.2의 기저가 7절의 세 식입니다. 식 3.3.1의 합은 같은 L(x)=x²+2x+1이 됩니다.</p>
  <p>원문은 실수·복소수 표본을 설명합니다. 우리는 서로 다른 위치의 차이에 역원이 존재한다는 대수 조건을 사용해 F₁₇에서 같은 항등식을 적용했습니다. 이는 별도로 확인한 체의 계산이며 실수 함수의 미분을 이용한 근사 오차식을 유한체에 옮긴 것이 아닙니다.</p>
  <div id="reference-dlmf-interpolation"><CitationBlock source="NIST DLMF §3.3(i), 식 3.3.1–3.3.3" citeKey={1} href="https://dlmf.nist.gov/3.3#i">원문의 표본 수 표기와 기저·가중합·표본 위치의 곱을 확인하고 같은 세 기록을 대입했습니다. 뒤의 실수 근사 오차나 암호 프로토콜의 건전성은 별도 전제가 필요합니다.</CitationBlock></div>
 </section>
 <section id="usage" data-teach-level="7" className="space-y-5"><h2 className="text-2xl font-bold">10. 위치가 고정되면 무게를 미리 계산해 둡니다</h2>
  <p>같은 표본 위치로 새 입력을 여러 번 계산한다면 기저의 분모를 매번 곱하지 않아도 됩니다. 위치만으로 정해지는 무게 wᵢ를 저장하는 방식을 barycentric 보간이라고 합니다. 0·1·2의 무게는 1/2, −1, 1/2이고 F₁₇에서는 9·16·9입니다.</p>
  <ExplainedFormula question="전체 계수를 전개하지 않고 L(3)=16을 다시 구할 수 있나요?" idea="고정된 위치의 차이 곱을 역원으로 저장하고 새 위치에서 분자 합과 분모 합을 계산합니다." formula={String.raw`w_i=\left(\prod_{j\ne i}(x_i-x_j)\right)^{-1},\qquad L(z)=\frac{\sum_i w_i y_i/(z-x_i)}{\sum_i w_i/(z-x_i)}`} annotatedFormula={String.raw`\begin{gathered}(w_0,w_1,w_2)=\underbrace{(9,16,9)}_{\text{위치로만 정해지는 무게}}\\D=\underbrace{3+8+9}_{\text{무게를 위치 차이로 나눈 합}}=3\\A=\underbrace{3\cdot1+8\cdot4+9\cdot9}_{\text{표본값도 곱한 합}}=14\\L(3)=\underbrace{14\cdot6}_{\text{D=3의 역원은 6}}=16\end{gathered}`} operations={[{expression:String.raw`w_i/(z-x_i)`,annotation:["z=3에서 차이 3·2·1의 역원은 6·9·1입니다.","무게를 곱하면 나머지 3·8·9가 됩니다."]},{expression:String.raw`A D^{-1}`,annotation:["두 합을 같은 체에서 나눕니다.","14×6=84의 나머지는16입니다."]}]} terms={[{symbol:"wᵢ",name:"미리 계산한 무게",description:"표본 위치만으로 정해집니다. 표본값이 바뀌어도 위치가 같으면 재사용합니다."},{symbol:"z",name:"새 입력",description:"사례는3이며 표본 위치와 같으면 별도 분기가 필요합니다."},{symbol:"D,A",name:"분모 합과 분자 합",description:"D는 무게만, A는 표본값까지 곱한 합입니다. 모두 mod17 계산입니다."}]} assumptions={["z가 표본 위치 xᵢ와 같으면 이 비율식을 계산하지 않고 yᵢ를 반환합니다.","나머지 경우에는 같은 체에서 모든 역원을 계산합니다."]} interpretation="기저를 모두 더하면 상수1이므로 D=1/Z_H(z)입니다. z가 표본 위치 밖이면 Z_H(z)≠0이어서 D도0이 아닙니다. 실수 반올림 오차 분석과 달리 여기서는 정확한 유한체 항등식으로 확인합니다." />
  <AlgorithmBlock title="고정된 세 표본을 새 위치에서 평가하는 순서" input={["위치[0,1,2], 값[1,4,9], 무게[9,16,9], 새 위치z, 같은 F17"]} steps={[{code:"if z == x[i]: return y[i]",note:"z=1이면 곧바로4를 반환합니다. 0의 역원을 요청하지 않습니다."},{code:"t[i] = w[i] * inverse(z-x[i]) mod17",note:"z=3에서는[3,8,9]입니다."},{code:"A = sum(t[i]*y[i]) mod17; D = sum(t[i]) mod17",note:"분자14, 분모3을 얻습니다."},{code:"return A * inverse(D) mod17",note:"3의 역원6을 곱해16을 반환합니다."}]} output="표본 위치에서는 해당 기록, 그 밖에서는 보간 다항식의 같은 값" />
  <p>논문 식 (3.2)의 wⱼ에 위치 0·1·2를 넣으면 같은 무게 9·16·9입니다. 식 (4.1)은 기저들의 합이 1임을 사용합니다. 그 합은 모든 표본 위치에서 1이고 차수도 N−1 이하이므로 상수1과 같아야 합니다. 이 항등식으로 공통 곱 Z_H를 없앤 식 (4.2)에 z=3을 넣으면 위의 분자14·분모3이 됩니다.</p>
  <div id="paper-barycentric-interpolation"><CitationBlock source="Berrut & Trefethen (2004) · Barycentric Lagrange Interpolation" citeKey={2} href="https://people.maths.ox.ac.uk/trefethen/barycentric.pdf">원 논문의 고정 무게와 비율식을 같은 위치 0·1·2에 적용했습니다. 실수 부동소수점의 안정성에 관한 결론은 유한체 구현의 보안이나 성능 보장으로 읽지 않습니다.</CitationBlock></div>
 </section>
 <section id="vanishing" data-teach-level="7" className="space-y-5"><h2 className="text-2xl font-bold">11. 세 위치에서 모두 0이 되는 식을 따로 만듭니다</h2>
  <p>표본 위치 집합 H={"{0,1,2}"}에서 모두 0이 되는 식은 Z_H(x)=x(x−1)(x−2)=x³−3x²+2x입니다. 이를 소멸 다항식이라고 합니다. 0·1·2에서는 한 항이 0이고 3에서는 6입니다.</p>
  <ExplainedFormula question="여러 위치의 조건 C(h)=0을 한 나눗셈 조건으로 바꾸려면?" idea="C가 각 h에서0이면 x−h가 인수입니다. 서로 다른 위치의 인수들이 서로소이므로 곱 전체가 C를 나눕니다. 반대로 그 곱이 인수이면 각 위치에 대입해0이 됩니다." formula={String.raw`Z_H(x)=\prod_{h\in H}(x-h),\quad [\forall h\in H:C(h)=0]\iff C=QZ_H`} annotatedFormula={String.raw`\begin{gathered}Z_H(x)=\underbrace{x(x-1)(x-2)}_{\text{세 위치마다 0인 인수}}\\C(x)=\underbrace{Z_H(x)(x+4)}_{\text{나눗셈 나머지 0}}\\C(3)=\underbrace{6\cdot7}_{\text{표본 밖의 값}}=8\pmod{17}\end{gathered}`} operations={[{expression:String.raw`C=QZ_H`,annotation:["나머지가0인 다항식 나눗셈입니다.","사례에서는 몫Q=x+4입니다."]},{expression:String.raw`C(h)=Q(h)Z_H(h)=0`,annotation:["H 안의 모든 h에서는 Z_H(h)=0입니다.","H 밖에서0이라는 결론은 나오지 않습니다."]}]} terms={[{symbol:"H",name:"검사할 위치 집합",description:"사례는 서로 다른0·1·2입니다."},{symbol:"Z_H",name:"소멸 다항식",description:"각 위치를 근으로 갖는 인수의 곱입니다."},{symbol:"C,Q",name:"조건식과 몫",description:"같은 체의 다항식이며 C를 Z_H로 나눈 나머지를 검사합니다."}]} assumptions={["H의 위치는 서로 다르며 모든 식은 같은 체의 다항식입니다.","조건식의 차수나 사전 고정, 도전값 선택 같은 암호 전제는 별도로 확인합니다."]} interpretation="C=Z_H(x)(x+4)는 표본에서 모두0이지만 C(3)=8입니다. C에1을 더하면 표본에서 모두1이 되어 같은 나눗셈 검사를 통과하지 못합니다." />
 </section>
 <section id="boundaries" data-teach-level="7" className="space-y-5"><h2 className="text-2xl font-bold">12. 세 점이 같아도 더 높은 차수의 규칙은 다릅니다</h2>
  <p>L에 Z_H를 더한 규칙도 0·1·2에서 1·4·9입니다. 그러나 입력3에서는 L(3)+Z_H(3)=16+6의 나머지5가 됩니다. 16과 다릅니다. 세 점이 하나로 정한다는 주장은 2차 이하라는 조건을 포함합니다.</p>
  <p>같은 위치를 두 번 적는 것도 문제입니다. (1,2)와 (1,3)은 같은 입력에서 서로 다른 값을 요구해 함수가 될 수 없습니다. 같은 (1,2)를 반복한 경우에는 새 독립 조건이 늘지 않으며 기저의 분모도0이 됩니다. 먼저 중복을 처리하고 서로 다른 표본 수로 차수 조건을 정해야 합니다.</p>
  <p>관측값 하나가 틀려도 보간은 그것을 통과하는 다른 식을 만들 수 있습니다. 세 점을 통과했다는 사실은 기록의 진위나 암호 증명의 건전성을 확인한 결과가 아닙니다. 다항식 약속, 차수 제한, 무작위 도전값과 실패 확률은 <Link to="/cs/crypto/zk-theory">증명 프로토콜</Link>에서 함께 다룹니다.</p>
 </section>
 <section id="release" data-teach-level="7" className="space-y-5"><h2 className="text-2xl font-bold">13. 필요한 출력과 표본 구조에 맞춰 계산합니다</h2>
  <p>임의 위치에서 한 번 복원한다면 직접 기저를 만드는 방법이 단순합니다. 위치가 고정된 여러 질의에는 무게를 미리 계산해 두면 질의마다 표본 수 N에 비례하는 체 연산으로 평가할 수 있습니다. 직접 무게를 준비하는 비용은 O(N²)이며 이 준비 비용도 따로 셉니다.</p>
  <p>직접적인 전체 계수 보간도 O(N²) 방식으로 구현할 수 있습니다. 위치가 적절한 단위근으로 이루어지고 전체 계수와 전체 평가값을 반복해 오간다면 <Link to="/cs/crypto/fft">NTT·INTT</Link>의 O(N log N) 구조를 사용할 수 있습니다. 특수한 위치 배열을 이용해 같은 평가·복원을 빠르게 계산하는 방법입니다.</p>
  <p>구현 검사는 표본 위치로 질의하는 분기, 중복 위치, 역원, 값 범위와 체의 일치를 포함합니다. 본문의 정확한 정수 계산은 직접 기저와 무게 방식의 일치를 확인한 교육용 재현입니다. 실제 증명 라이브러리의 실행·부채널·성능을 측정한 결과는 아닙니다.</p>
  <ReviewPrompts questions={["새 입력이1이면 무게의 비율식을 그대로 계산하지 않고 무엇을 반환해야 하나요? (답: 10절)","세 표본을 모두 통과하는 L+Z_H는 입력3에서 왜16이 아닌5가 되나요? (답: 12절)","C가 세 표본에서 모두0이면 입력3에서도0이라고 할 수 있나요? (답: 11절)"]}/>
 </section>
 </article>;}

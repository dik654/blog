import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import ThermalBudgetViz from "./doping-and-thermal-budget/viz/ThermalBudgetViz";

import NumericPath from "../world-systems/NumericPath";

export default function DopingAndThermalBudgetArticle() {
return <div className="space-y-16">
<section id="overview" data-teach-level="S" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">1. 뒤의 짧은 가열이 앞에서 만든 분포를 더 크게 바꿀 수 있습니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">실리콘에 원자를 넣은 뒤 공급을 멈춰도 가열하면 그 원자들은 더 깊은 쪽으로 퍼집니다. 처음 창의 위치를 정확히 정했더라도 마지막에 어느 깊이에 얼마나 남을지는 뒤의 열처리까지 따라가야 합니다.</p><p className="leading-7">
            같은 실리콘을 한 시간 가열한 뒤 다시 삼십 분 가열해 보겠습니다. 원자가 퍼지는 정도를 시간과 함께 계산하고 표면의 농도와 깊은 곳의 농도가 어떻게 달라지는지 확인합니다.
            마지막에는 이 길이가 두 전하 영역의 경계 깊이와 왜 다른지 구분하겠습니다.
          </p></div>
</section>

<section id="outside" data-teach-level="B" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">2. 넣은 총량은 유지하고 가열 뒤의 깊이별 양을 비교합니다</h2>
<NumericPath title="열처리 전후의 비교" steps={[{"label": "시작", "value": "표면 근처의 좁은 원자 분포", "detail": "이미 넣은 양을 고정하고 새 공급을 멈춥니다."}, {"label": "바꾸기", "value": "각 단계의 온도·시간", "detail": "같은 원자들이 더 넓은 범위로 퍼집니다."}, {"label": "확인", "value": "표면부터 안쪽까지의 농도", "detail": "표면이 옅어져도 깊은 곳의 농도는 커질 수 있습니다."}]} /><div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">이 비교에서는 원자가 실리콘 밖으로 빠져나가지 않고 옆으로는 균일하다고 가정합니다. 표면에서 안쪽으로의 변화만 봅니다. 초기 분포는 마지막에 퍼진 범위보다 매우 좁다고 둡니다. 실제 주입 분포를 언제나 한 점으로 취급할 수 있는 것은 아닙니다.</p></div>
</section>

<section id="case" data-teach-level="0" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">3. 한 시간 뒤 120 nm였던 폭 척도가 삼십 분 뒤 약 208 nm가 됩니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">숫자는 모두 <strong>가정</strong>입니다. 첫 상태에서 원자가 퍼지기 쉬운 정도를 10⁻¹⁴ cm²/s로 두고 3600초 가열합니다. 다음 상태에서는 그 정도가 네 배인 4×10⁻¹⁴ cm²/s이고 1800초 가열합니다. 특정 원자와 온도의 측정값을 가져온 조합은 아닙니다.</p><p className="leading-7">농도 곡선의 퍼짐을 읽는 길이는 처음 가열 뒤 120 nm, 두 단계를 마친 뒤 약 208 nm입니다. 두 번째 단계는 시간이 절반인데도 전체 변화에 더 크게 기여합니다. 각 단계의 곱과 두 단계의 합을 구하면 그 이유가 보입니다.</p></div>
</section>

<section id="picture" data-teach-level="1" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">4. 같은 원자 수가 더 넓은 깊이에 나뉩니다</h2>
<NumericPath title="같은 양을 두 번 가열하기" steps={[{"label": "시작", "value": "표면 근처에 모임", "detail": "아직 깊은 곳에는 적습니다."}, {"label": "첫 가열", "value": "폭 척도120 nm", "detail": "표면의 꼭대기가 낮아지고 안쪽 농도가 늘어납니다."}, {"label": "둘째 가열", "value": "폭 척도약208 nm", "detail": "새 원자 없이도 분포가 더 넓어집니다."}]} /><div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">
            깊이를 가로축으로 두고 그 깊이의 농도를 세로축으로 그리면 곡선 아래 넓이가 넣은 총량에 대응합니다. 같은 양을 더 깊게 나누면 표면의 높이가 내려갑니다. 낮아진 꼭대기만 보고
            원자가 사라졌다고 판단하지 않습니다.
          </p><p className="leading-7">특정한 깊이를 고정해서 보면 변화가 다를 수 있습니다. 처음에는 거의 도달하지 못했던 곳으로 원자가 들어오면 그곳의 농도는 올라갑니다. 표면과 깊은 곳의 농도를 함께 읽어야 합니다.</p></div>
</section>

<section id="why" data-teach-level="2" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">5. 시간만 더하면 두 가열 상태의 차이를 놓칩니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">같은 시간이라도 원자가 움직이기 쉬운 조건에서는 더 많이 퍼집니다. 따라서 첫 3600초와 다음 1800초를 단순히 합친 5400초만으로는 결과를 구할 수 없습니다. 각 상태에서 퍼지기 쉬운 정도를 시간에 곱해야 합니다.</p><p className="leading-7">
            이 곱의 단위는 길이의 제곱입니다. 그래서 두 단계의 곱끼리는 더할 수 있지만 각각 계산한 길이 120 nm와 다른 길이를 그대로 더하지는 않습니다. 합을 구한 다음 제곱근을
            취하는 순서가 필요합니다.
          </p></div>
</section>

<section id="names" data-teach-level="3" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">6. 총량·움직이기 쉬운 정도·누적 곱을 구별합니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">단위 면적 아래에 들어 있는 원자 총량을 <strong>도즈 Q</strong>라고 합니다. 단위는 개수/cm²입니다. 어느 깊이의 단위 부피당 원자 수인 농도와 다릅니다. 같은 Q라도 깊이별 농도는 바뀔 수 있습니다.</p><p className="leading-7">퍼지기 쉬운 정도를 나타내는 <strong>확산계수 D</strong>의 단위는 cm²/s입니다. 이 글의 단순 모형에서 단계별 D×시간의 합을 <strong>열 예산 B</strong>로 쓰며 단위는 cm²입니다. 에너지의 단위인 줄이나 단순한 초가 아닙니다.</p></div>
</section>

<section id="profile" data-teach-level="4" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">7. 원문의 곡선 모양에서 120 nm가 뜻하는 것을 읽습니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert">
   <p className="leading-7">불순물을 넣은 뒤 외부 공급을 멈추면 이미 들어간 총량을 <strong>도즈 Q</strong>로 둘 수 있습니다. 일정한 D로 퍼지는 단순한 경우, 처음 표면 근처에 몰려 있던 불순물 농도는 깊이에 따라 종 모양에 가까운 <strong>가우스 분포</strong>로 넓어집니다. 깊이 z에서 C(z)는 표면 C(0)에 비해 exp[−(z/a)²]배이며 a=2√(Dt)는 모양의 폭을 읽는 척도입니다.</p>
   <p className="leading-7">z=a에서는 표면 농도의 약 36.8%, z=2a에서는 약 1.8%입니다. 이 a는 p형과 n형 농도가 같아지는 <strong>접합 깊이</strong>가 아닙니다. 접합 깊이를 찾으려면 불순물의 전체 농도 분포와 원래 웨이퍼의 n형 배경 농도를 맞춰야 합니다. ‘120 nm 퍼짐 척도’만 보고 ‘접합이 120 nm 깊다’고 읽으면 안 됩니다.</p>
   <p className="leading-7"><em>폭 척도는 분포가 얼마나 벌어졌는지이고, 접합 깊이는 다른 농도와 만나는 자리입니다.</em></p>
  </div><CitationBlock source="MIT OpenCourseWare 6.152J, Lecture 4, ‘Diffusion’ (2005), PDF 6–7쪽(슬라이드 11–14)" citeKey={1} href="https://ocw.mit.edu/courses/6-152j-micro-nano-processing-technology-fall-2005/dbad8f442ecf1244e2a257de2671d0e2_lecture4.pdf">공식 강의안의 가우스 모양과 a=2√(Dt), 고정 표면 농도의 erfc 해를 대조했습니다. 한쪽 실리콘 깊이에 대한 총량 정규화는 아래 10절의 적분 조건과 MIT 6.774 강의 설명을 따릅니다. 본문의 D·시간 수치는 강의의 실측 조건이 아닙니다.</CitationBlock>
</section>

<section id="first" data-teach-level="4" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">8. 첫 3600초의 곱으로 120 nm를 계산합니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert">
   <p className="leading-7">확산계수의 단위 cm²/s에 시간 3600 s를 곱하면 D<sub>1</sub>t<sub>1</sub>=3.6×10<sup>−11</sup> cm²입니다. 길이 척도를 얻으려면 제곱근을 취하고 2를 곱합니다. a<sub>1</sub>=2√(3.6×10<sup>−11</sup> cm²)=1.2×10<sup>−5</sup> cm=120 nm입니다. 제곱센티미터를 나노미터로 바로 읽지 않고 제곱근과 단위 환산을 나눠 계산합니다.</p>
   <p className="leading-7">도즈 Q가 그대로라면 분포가 넓어질수록 표면의 꼭대기 농도는 낮아집니다. 같은 양을 더 긴 깊이 범위에 펼친 결과입니다. 새 도펀트가 계속 공급되는 경우에는 Q가 일정하다는 전제가 없어 다른 농도식이 필요합니다.</p>
   <p className="leading-7"><em>온도를 모르는 1시간만으로는 퍼짐을 계산할 수 없고 D도 함께 필요합니다.</em></p>
  </div><ExplainedFormula question="가정한 D₁로 1시간 가열했을 때 폭 척도 a₁은?" idea="확산계수와 시간의 곱은 길이의 제곱이므로 제곱근을 취해 길이로 바꿉니다." formula={String.raw`a_1=2\sqrt{D_1t_1}`} annotatedFormula={String.raw`\underbrace{a_1}_{\text{첫 폭 척도}}=2\sqrt{D_1t_1}`} operations={[{expression:String.raw`D_1t_1=3.6\times10^{-11}\,\mathrm{cm^2}`,annotation:"10⁻¹⁴ cm²/s×3600 s입니다."},{expression:String.raw`a_1=1.2\times10^{-5}\,\mathrm{cm}`,annotation:"2×√(3.6×10⁻¹¹ cm²)입니다."},{expression:String.raw`a_1=120\,\mathrm{nm}`,annotation:"1 cm=10⁷ nm를 적용합니다."}]} terms={[{symbol:"a₁",name:"첫 분포 폭 척도",description:"접합 깊이가 아닌 가우스 모양의 깊이 척도입니다."},{symbol:"D₁",name:"첫 확산계수",description:"가정한 10⁻¹⁴ cm²/s입니다."},{symbol:"t₁",name:"첫 가열 시간",description:"가정한 3600 s입니다."}]} assumptions={["외부 도펀트 공급을 멈춘 고정 도즈·일정 D의 가우스 근사입니다.","D₁은 특정 온도나 불순물의 데이터시트 값이 아닙니다."]} interpretation="첫 1시간 뒤 가상 폭 척도는 120 nm입니다. 실제 접합 깊이와는 다릅니다." /><div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">같은 D에서 첫 가열 시간만 네 배인 14400초로 바꾸면 D×t는 네 배가 됩니다. 폭 척도는 √4=2배이므로 120→240 nm입니다. 시간을 네 배로 했다고 폭도 네 배가 되지는 않습니다.</p></div>
</section>

<section id="budget" data-teach-level="5" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">9. 다음 1800초의 기여를 더해 약 208 nm를 얻습니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert">
   <p className="leading-7">두 번째 단계의 D<sub>2</sub>t<sub>2</sub>=4×10<sup>−14</sup> cm²/s×1800 s=7.2×10<sup>−11</sup> cm²입니다. 첫 단계 3.6×10<sup>−11</sup>의 두 배입니다. 일정 D로 이어지는 이상 확산에서는 단계별 D·t의 곱을 더해 <strong>열 예산</strong>으로 볼 수 있습니다. 여기서는 합이 1.08×10<sup>−10</sup> cm²이고 폭 척도 a=2√(합)≈208 nm입니다.</p>
   <p className="leading-7">폭은 120→208 nm로 약 1.73배가 되고, 고정 도즈라면 표면 농도는 첫 단계의 약 120/208≈0.58배로 내려갑니다. 하지만 z=240 nm 깊이의 상대 농도는 첫 단계의 약 0.018에서 두 단계를 마친 뒤 첫 단계 표면 농도 기준 약 0.152로 커집니다. 표면은 옅어지고 꼬리는 깊어지는 같은 분포 변화입니다.</p>
   <p className="leading-7"><em>짧은 두 번째 단계라도 D가 크면 전체 프로파일을 더 크게 바꿉니다.</em></p>
  </div><ThermalBudgetViz /><ExplainedFormula question="두 가열 단계가 끝난 가상 폭 척도는?" idea="일정 D·고정 도즈의 단순 가우스 확산에서는 각 단계의 D×t를 합산한 뒤 제곱근을 취합니다." formula={String.raw`a=2\sqrt{D_1t_1+D_2t_2}`} annotatedFormula={String.raw`\underbrace{a}_{\text{최종 폭 척도}}=2\sqrt{D_1t_1+D_2t_2}`} operations={[{expression:String.raw`D_2t_2=7.2\times10^{-11}\,\mathrm{cm^2}`,annotation:"첫 단계의 두 배입니다."},{expression:String.raw`B=1.08\times10^{-10}\,\mathrm{cm^2}`,annotation:"두 단계의 D×t 합입니다."},{expression:String.raw`a\approx208\,\mathrm{nm}`,annotation:"2×√B를 cm에서 nm로 바꿉니다."}]} terms={[{symbol:"B",name:"누적 열 예산",description:"이 단순 모형에서 단계별 D×t의 합입니다."},{symbol:"a",name:"최종 폭 척도",description:"프로파일의 퍼짐을 나타내며 접합 깊이가 아닙니다."}]} assumptions={["두 단계 모두 고정 도즈·일정 D의 가우스 확산이며 초기 폭을 무시합니다.","전기장·결함·산화·고농도에 따른 D 변화는 제외합니다."]} interpretation="가상 누적 폭 척도는 약 208 nm입니다. 두 번째 단계의 D×t가 더 큽니다." /><CitationBlock source="MIT OpenCourseWare 6.774, Lecture 9 transcript, ‘Dopant Diffusion’ (2004), PDF 3쪽" citeKey={2} href="https://ocw.mit.edu/courses/6-774-physics-of-microfabrication-front-end-processing-fall-2004/149Phbk_yJVmBm_KPM035Wd40as-4iVuA_transcript.pdf">공식 강의 설명은 일정 D의 가우스 근사에서 연속 가열 단계의 D×t를 합산해 누적 열 예산을 잡을 수 있다고 합니다. 높은 온도의 단계가 지배하기 쉽지만 고농도·결함·비정상 확산에서는 예외가 있음을 함께 밝힙니다. 본문의 두 D는 가정입니다.</CitationBlock>
</section>

<section id="source" data-teach-level="6" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">10. 같은 곡선의 총량과 두 깊이의 농도를 검산합니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">MIT 6.774 강의 전사 PDF 3쪽은 가우스 확산 가정에서 각 단계의 D×t를 더하는 절차를 설명합니다. 여기에 첫 3.6×10⁻¹¹ cm²와 다음 7.2×10⁻¹¹ cm²를 넣으면 B=1.08×10⁻¹⁰ cm²입니다. 이 값으로 a=2√B≈207.85 nm를 얻었습니다.</p><p className="leading-7">이 글은 실리콘 표면을 z=0, 안쪽을 양의 깊이로 둡니다. 원자 손실이 없는 한쪽 영역의 총량은 <code>∫₀∞C(z)dz=Q</code>이고, 가우스 곡선은 <code>C(z)=Q/√(πB) × exp[−z²/(4B)]</code>입니다. MIT 6.774 전사 PDF 6쪽의 관계 Q=Cₛ√(πDt)와 같은 정규화입니다. 양쪽으로 퍼지는 문제에서는 총량을 세는 영역이 달라 앞계수를 바꿔야 합니다.</p><p className="leading-7">첫 표면 농도를 1로 나누어 표시하면 두 단계 뒤 표면 농도는 √(3.6×10⁻¹¹/1.08×10⁻¹⁰)=1/√3≈0.577입니다. z=240 nm에서 첫 농도는 exp[−(240/120)²]=exp(−4)≈0.018입니다. 두 단계 뒤 같은 깊이에서는 (1/√3)×exp(−4/3)≈0.152입니다. 두 값 모두 첫 표면 농도로 나누었으므로 직접 비교할 수 있습니다.</p><p className="leading-7">120 nm와 약 208 nm는 농도가 각 단계 표면의 1/e로 내려가는 깊이입니다. 이를 접합 깊이로 부르려면 부족합니다. 예를 들어 첫 표면 농도가 반대 종류의 일정한 배경 농도보다 100배라고 추가로 가정하면, 만나는 깊이는 120√ln100≈258 nm입니다. 같은 가정의 두 단계 뒤에는 207.85√ln(100/√3)≈419 nm입니다. 여기서도 배경과 같아지는 위치를 따로 풀었습니다.</p></div>
</section>

<section id="supply" data-teach-level="6" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">11. 계속 공급해 표면 농도를 고정하면 다른 문제를 풉니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">외부 원자를 계속 넣어 표면 농도 Cₛ를 일정하게 유지하면 실리콘 안의 총량 Q가 증가할 수 있습니다. 그래서 Q가 일정한 앞 계산을 그대로 적용할 수 없습니다. MIT 6.152J PDF 7쪽 슬라이드 13은 이 조건의 곡선을 <code>C(z,t)=Cₛ erfc[z/(2√Dt)]</code>로 제시합니다.</p><p className="leading-7">여기의 <strong>erfc</strong>는 상보 오차 함수의 이름입니다. 중요한 차이는 함수 이름보다 표면에 원자가 계속 공급된다는 조건입니다. 앞 사례는 표면 농도가 약 0.577배로 낮아졌지만 이 조건에서는 공급이 표면 농도를 유지합니다. 열처리 기록에는 시간·온도와 함께 공급을 멈췄는지도 남겨야 합니다.</p></div>
</section>

<section id="limits" data-teach-level="7" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">12. 퍼짐 폭 하나로 접합과 전기적 결과를 끝내지 않습니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert">
   <p className="leading-7">실제 확산계수는 온도와 도펀트 종류, 농도, 산화와 결함 상태에 좌우됩니다. 이온 주입으로 시작한 분포의 폭도 처음부터 0은 아닙니다. 공급을 계속해 표면 농도를 유지하면 고정 도즈 가우스 모형과 다른 해를 써야 합니다. 두 단계의 온도만 듣고 D를 모르면 이 글의 208 nm를 재계산할 수 없습니다.</p>
   <p className="leading-7">제조에서는 원하는 접합 깊이뿐 아니라 시트 저항과 누설도 측정합니다. 뒤 글은 이렇게 만든 소자 사이를 금속으로 이었을 때 배선 저항과 주변 용량이 신호를 얼마나 늦추는지 살펴봅니다.</p>
   <p className="leading-7"><strong>읽고 나서 예측해 보세요.</strong> 첫 단계의 D×t 단위는 무엇입니까? (답: 8절) 두 번째 단계가 절반 시간인데 왜 더 기여합니까? (답: 9절) 208 nm를 접합 깊이라고 써도 됩니까? (답: 7·10·12절)</p>
   <p className="leading-7"><Link to="/electronics/semiconductors/lithography-and-resolution#overlay">앞 글의 창 위치</Link>는 여기의 열 확산 뒤에도 그대로 p-n 경계를 보장하지 않습니다.</p>
  </div>
</section>
</div>;
}

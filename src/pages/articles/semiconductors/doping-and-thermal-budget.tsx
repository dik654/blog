import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import ThermalBudgetViz from "./doping-and-thermal-budget/viz/ThermalBudgetViz";

/** Invented constant-diffusivity, fixed-dose Gaussian spread; D1=1e-14 cm²/s for 1 h, D2=4e-14 cm²/s for .5 h. */
export default function DopingAndThermalBudgetArticle(){
 return <div className="space-y-16">
  <section id="overview" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">창을 정확히 열어도 가열 뒤에는 경계가 움직입니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
   <p className="text-lg leading-8">앞 글에서는 빛으로 산화막의 열린 위치를 옮겼습니다. 그런데 그 자리에 넣은 불순물은 열을 받으면 실리콘 안쪽과 옆으로 퍼집니다. 처음 그린 창의 폭만으로 완성된 p형 영역이나 접합의 깊이를 정할 수 없습니다.</p>
   <p className="leading-7">가상으로 불순물을 먼저 넣고 공급을 멈춘 뒤, 확산계수 D<sub>1</sub>=10<sup>−14</sup> cm²/s인 상태에서 1시간 가열합니다. 단순한 확산 폭 척도는 120 nm입니다. 다음에는 D<sub>2</sub>=4×10<sup>−14</sup> cm²/s인 상태로 30분 더 가열하면 총 폭 척도는 약 208 nm가 됩니다. 뒤 단계는 시간이 절반인데도 확산계수가 네 배라 누적 변화에는 더 크게 기여합니다. 두 D는 특정 온도·불순물의 측정값이 아닌 교육용 가정입니다.</p>
   <p className="leading-7"><em>열을 준 시간이 아니라 각 단계의 ‘얼마나 잘 퍼지는가×얼마나 오래인가’를 함께 세어야 합니다.</em></p>
  </div></section>
  <section id="profile" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">농도는 갑자기 끊기지 않고 깊이에 따라 줄어듭니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
   <p className="leading-7">불순물을 넣은 뒤 외부 공급을 멈추면 이미 들어간 총량을 <strong>도즈 Q</strong>로 둘 수 있습니다. 일정한 D로 퍼지는 단순한 경우, 처음 표면 근처에 몰려 있던 불순물 농도는 깊이에 따라 종 모양에 가까운 <strong>가우스 분포</strong>로 넓어집니다. 깊이 z에서 C(z)는 표면 C(0)에 비해 exp[−(z/a)²]배이며 a=2√(Dt)는 모양의 폭을 읽는 척도입니다.</p>
   <p className="leading-7">z=a에서는 표면 농도의 약 36.8%, z=2a에서는 약 1.8%입니다. 이 a는 p형과 n형 농도가 같아지는 <strong>접합 깊이</strong>가 아닙니다. 접합 깊이를 찾으려면 불순물의 전체 농도 분포와 원래 웨이퍼의 n형 배경 농도를 맞춰야 합니다. ‘120 nm 퍼짐 척도’만 보고 ‘접합이 120 nm 깊다’고 읽으면 안 됩니다.</p>
   <p className="leading-7"><em>폭 척도는 분포가 얼마나 벌어졌는지이고, 접합 깊이는 다른 농도와 만나는 자리입니다.</em></p>
  </div><CitationBlock source="MIT OpenCourseWare 6.152J, Lecture 4, ‘Diffusion’ (2005), 원본 6–7·14–15쪽" citeKey={1} href="https://ocw.mit.edu/courses/6-152j-micro-nano-processing-technology-fall-2005/dbad8f442ecf1244e2a257de2671d0e2_lecture4.pdf">공식 강의안은 고정 도즈와 고정 표면 농도의 서로 다른 해, a=2√(Dt)의 확산 폭 척도, 그리고 불순물 농도가 배경 농도와 만나는 접합 깊이를 구분합니다. 본문의 D·시간 수치는 강의의 실측 조건이 아닙니다.</CitationBlock></section>
  <section id="first" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">첫 1시간의 퍼짐 폭은 120 nm입니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
   <p className="leading-7">확산계수의 단위 cm²/s에 시간 3600 s를 곱하면 D<sub>1</sub>t<sub>1</sub>=3.6×10<sup>−11</sup> cm²입니다. 길이 척도를 얻으려면 제곱근을 취하고 2를 곱합니다. a<sub>1</sub>=2√(3.6×10<sup>−11</sup> cm²)=1.2×10<sup>−5</sup> cm=120 nm입니다. 제곱센티미터를 나노미터로 바로 읽지 않고 제곱근과 단위 환산을 나눠 계산합니다.</p>
   <p className="leading-7">도즈 Q가 그대로라면 분포가 넓어질수록 표면의 꼭대기 농도는 낮아집니다. 같은 양을 더 긴 깊이 범위에 펼친 결과입니다. 새 도펀트가 계속 공급되는 경우에는 Q가 일정하다는 전제가 없어 다른 농도식이 필요합니다.</p>
   <p className="leading-7"><em>온도를 모르는 1시간만으로는 퍼짐을 계산할 수 없고 D도 함께 필요합니다.</em></p>
  </div><ExplainedFormula question="가정한 D₁로 1시간 가열했을 때 폭 척도 a₁은?" idea="확산계수와 시간의 곱은 길이의 제곱이므로 제곱근을 취해 길이로 바꿉니다." formula={String.raw`a_1=2\sqrt{D_1t_1}`} annotatedFormula={String.raw`\underbrace{a_1}_{\text{첫 폭 척도}}=2\sqrt{D_1t_1}`} operations={[{expression:String.raw`D_1t_1=3.6\times10^{-11}\,\mathrm{cm^2}`,annotation:"10⁻¹⁴ cm²/s×3600 s입니다."},{expression:String.raw`a_1=1.2\times10^{-5}\,\mathrm{cm}`,annotation:"2×√(3.6×10⁻¹¹ cm²)입니다."},{expression:String.raw`a_1=120\,\mathrm{nm}`,annotation:"1 cm=10⁷ nm를 적용합니다."}]} terms={[{symbol:"a₁",name:"첫 분포 폭 척도",description:"접합 깊이가 아닌 가우스 모양의 깊이 척도입니다."},{symbol:"D₁",name:"첫 확산계수",description:"가정한 10⁻¹⁴ cm²/s입니다."},{symbol:"t₁",name:"첫 가열 시간",description:"가정한 3600 s입니다."}]} assumptions={["외부 도펀트 공급을 멈춘 고정 도즈·일정 D의 가우스 근사입니다.","D₁은 특정 온도나 불순물의 데이터시트 값이 아닙니다."]} interpretation="첫 1시간 뒤 가상 폭 척도는 120 nm입니다. 실제 접합 깊이와는 다릅니다." /></section>
  <section id="budget" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">다음 30분이 앞의 1시간보다 더 크게 퍼뜨립니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
   <p className="leading-7">두 번째 단계의 D<sub>2</sub>t<sub>2</sub>=4×10<sup>−14</sup> cm²/s×1800 s=7.2×10<sup>−11</sup> cm²입니다. 첫 단계 3.6×10<sup>−11</sup>의 두 배입니다. 일정 D로 이어지는 이상 확산에서는 단계별 D·t의 곱을 더해 <strong>열 예산</strong>으로 볼 수 있습니다. 여기서는 합이 1.08×10<sup>−10</sup> cm²이고 폭 척도 a=2√(합)≈208 nm입니다.</p>
   <p className="leading-7">폭은 120→208 nm로 약 1.73배가 되고, 고정 도즈라면 표면 농도는 첫 단계의 약 120/208≈0.58배로 내려갑니다. 하지만 z=240 nm 깊이의 상대 농도는 첫 단계의 약 0.018에서 두 단계를 마친 뒤 첫 단계 표면 농도 기준 약 0.152로 커집니다. 표면은 옅어지고 꼬리는 깊어지는 같은 분포 변화입니다.</p>
   <p className="leading-7"><em>짧은 두 번째 단계라도 D가 크면 전체 프로파일을 더 크게 바꿉니다.</em></p>
  </div><ThermalBudgetViz /><ExplainedFormula question="두 가열 단계가 끝난 가상 폭 척도는?" idea="일정 D·고정 도즈의 단순 가우스 확산에서는 각 단계의 D×t를 합산한 뒤 제곱근을 취합니다." formula={String.raw`a=2\sqrt{D_1t_1+D_2t_2}`} annotatedFormula={String.raw`\underbrace{a}_{\text{최종 폭 척도}}=2\sqrt{D_1t_1+D_2t_2}`} operations={[{expression:String.raw`D_2t_2=7.2\times10^{-11}\,\mathrm{cm^2}`,annotation:"첫 단계의 두 배입니다."},{expression:String.raw`B=1.08\times10^{-10}\,\mathrm{cm^2}`,annotation:"두 단계의 D×t 합입니다."},{expression:String.raw`a\approx208\,\mathrm{nm}`,annotation:"2×√B를 cm에서 nm로 바꿉니다."}]} terms={[{symbol:"B",name:"누적 열 예산",description:"이 단순 모형에서 단계별 D×t의 합입니다."},{symbol:"a",name:"최종 폭 척도",description:"프로파일의 퍼짐을 나타내며 접합 깊이가 아닙니다."}]} assumptions={["두 단계 모두 고정 도즈·일정 D의 가우스 확산이며 초기 폭을 무시합니다.","전기장·결함·산화·고농도에 따른 D 변화는 제외합니다."]} interpretation="가상 누적 폭 척도는 약 208 nm입니다. 두 번째 단계의 D×t가 더 큽니다." /><CitationBlock source="MIT OpenCourseWare 6.774, Lecture 9 transcript, ‘Dopant Diffusion’ (2004), 2–3쪽" citeKey={2} href="https://ocw.mit.edu/courses/6-774-physics-of-microfabrication-front-end-processing-fall-2004/149Phbk_yJVmBm_KPM035Wd40as-4iVuA_transcript.pdf">공식 강의 설명은 일정 D의 가우스 근사에서 연속 가열 단계의 D×t를 합산해 누적 열 예산을 잡을 수 있다고 합니다. 높은 온도의 단계가 지배하기 쉽지만 고농도·결함·비정상 확산에서는 예외가 있음을 함께 밝힙니다. 본문의 두 D는 가정입니다.</CitationBlock></section>
  <section id="limits" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">퍼짐 폭 하나로 접합과 전기적 결과를 끝내지 않습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
   <p className="leading-7">실제 확산계수는 온도와 도펀트 종류, 농도, 산화와 결함 상태에 좌우됩니다. 이온 주입으로 시작한 분포의 폭도 처음부터 0은 아닙니다. 공급을 계속해 표면 농도를 유지하면 고정 도즈 가우스 모형과 다른 해를 써야 합니다. 두 단계의 온도만 듣고 D를 모르면 이 글의 208 nm를 재계산할 수 없습니다.</p>
   <p className="leading-7">제조에서는 원하는 접합 깊이뿐 아니라 시트 저항과 누설도 측정합니다. 뒤 글은 이렇게 만든 소자 사이를 금속으로 이었을 때 배선 저항과 주변 용량이 신호를 얼마나 늦추는지 살펴봅니다.</p>
   <p className="leading-7"><strong>읽고 나서 예측해 보세요.</strong> 첫 단계의 D×t 단위는 무엇입니까? (답: 3절) 두 번째 단계가 절반 시간인데 왜 더 기여합니까? (답: 4절) 208 nm를 접합 깊이라고 써도 됩니까? (답: 2·5절)</p>
   <p className="leading-7"><Link to="/electronics/semiconductors/lithography-and-resolution#overlay">앞 글의 창 위치</Link>는 여기의 열 확산 뒤에도 그대로 p-n 경계를 보장하지 않습니다.</p>
  </div></section>
 </div>;
}

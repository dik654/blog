import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import YieldDefectViz from "./yield-defect-and-packaging/viz/YieldDefectViz";

/** Invented point-defect case: Ac=1 cm², D0=.1 cm^-2, downstream conditional survival=.98. */
export default function YieldDefectAndPackagingArticle() {
 return <div className="space-y-16">
  <section id="overview" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">같은 웨이퍼에서 나온 다이가 모두 출하되지는 않습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
   <p className="text-lg leading-8">앞 글까지 소자와 배선을 만들었어도 모든 다이가 동작하는 것은 아닙니다. 가상으로 한 다이의 <strong>결함 민감 면적</strong>을 1 cm², 그 면적에 치명적인 결함의 평균 밀도를 0.1개/cm²라 둡니다. 서로 독립적으로 흩어진 점 결함만 생각하는 단순 모형에서 이 다이가 그런 결함을 하나도 만나지 않을 확률은 약 90.48%입니다.</p>
   <p className="leading-7">이 확률은 공장 전체의 실제 수율이 아닙니다. 결함에 따른 한 단계의 모형값입니다. 전기적 사양, 조립·패키징, 최종 시험에서도 다이가 탈락할 수 있습니다. 어떤 분모를 세는지 먼저 정해야 수율 숫자를 읽을 수 있습니다.</p>
   <p className="leading-7"><em>결함이 없을 확률과 출하 가능한 칩의 비율은 서로 다른 단계의 질문입니다.</em></p>
  </div></section>
  <section id="area" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">결함이 떨어진 위치가 회로를 망가뜨리는지가 중요합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
   <p className="leading-7">입자가 웨이퍼에 있어도 모든 위치가 같은 위험은 아닙니다. 두 선을 이어 붙이거나 한 선을 끊을 수 있는 위치가 더 위험합니다. 특정 크기의 결함이 기능 고장을 만들 수 있는 위치를 모은 면적이 <strong>임계 면적 A<sub>c</sub></strong>입니다. 가상 1 cm²는 다이의 바깥 치수를 그대로 뜻하지 않습니다.</p>
   <p className="leading-7">다이의 기능 검사에서 양품이 되는 비율과 속도·전력 같은 사양까지 통과하는 비율도 구분합니다. 이 글의 첫 계산은 임계 면적에 치명적 점 결함이 0개일 확률만 다룹니다.</p>
   <p className="leading-7"><em>다이가 커졌다는 말만으로 임계 면적이 정확히 몇 배인지 결정할 수 없습니다.</em></p>
  </div><CitationBlock source="MIT OpenCourseWare 2.830J/6.780J, Lecture 10, ‘Yield Modeling’ (2008), 원본 6–7·14·17·30쪽" citeKey={1} href="https://ocw.mit.edu/courses/2-830j-control-of-manufacturing-processes-sma-6303-spring-2008/4aff1e21de13870355ef44dbe71f45c6_lecture10.pdf">MIT 공식 강의안은 기능·파라미터 수율을 구분하고 결함 밀도, 임계 면적, 공간적으로 독립인 점 결함의 포아송 모형과 그 한계를 설명합니다. 아래 면적·밀도는 강의의 측정 데이터가 아닙니다.</CitationBlock></section>
  <section id="poisson" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">평균 0.1개라면 0개일 확률은 약 90.48%입니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
   <p className="leading-7">결함 밀도 D<sub>0</sub>가 0.1개/cm²이고 임계 면적 A<sub>c</sub>가 1 cm²이면, 한 다이에 들어올 것으로 기대되는 결함 수 λ=D<sub>0</sub>A<sub>c</sub>=0.1개입니다. 평균이 0.1개라고 해서 다이마다 0.1개의 결함이 있는 것은 아닙니다. 많은 다이에 0개, 일부에 1개 이상인 분포의 평균입니다.</p>
   <p className="leading-7">서로 무관하게 흩어진 점 결함이 임계 면적에 하나만 들어와도 기능을 잃는다고 가정하면, 결함이 0개일 확률은 Y=e<sup>−λ</sup>=e<sup>−0.1</sup>≈0.9048입니다. 가상 후보 다이 1000개가 각각 이 조건을 가진다면 결함 모형상 양품의 <strong>기댓값</strong>은 약 904.8개입니다. 실제 시험에서 0.8개의 다이가 나온다는 뜻도, 한 번의 생산 결과를 보장한다는 뜻도 아닙니다.</p>
   <p className="leading-7"><em>포아송 계산은 평균 결함 수에서 0개일 확률로 넘어가는 단계입니다.</em></p>
  </div><YieldDefectViz /><ExplainedFormula question="임계 면적에 치명적 점 결함이 하나도 없을 확률은?" idea="평균 결함 수를 결함 밀도와 임계 면적의 곱으로 구하고 포아송 분포의 0개 확률 e⁻λ를 계산합니다." formula={String.raw`Y_0=e^{-D_0A_c}`} annotatedFormula={String.raw`Y_0=e^{-\underbrace{D_0A_c}_{\text{평균 결함 수}}}`} operations={[{expression:String.raw`\lambda=0.1\,\mathrm{cm^{-2}}\times1\,\mathrm{cm^2}=0.1`,annotation:"단위 면적당 평균 결함 수에 임계 면적을 곱합니다."},{expression:String.raw`Y_0=e^{-0.1}\approx0.9048`,annotation:"임계 면적 안에 0개일 포아송 확률입니다."},{expression:String.raw`1000Y_0\approx904.8`,annotation:"1000개 후보의 결함 모형상 양품 기댓값입니다."}]} terms={[{symbol:"D₀",name:"평균 결함 밀도",description:"가정한 0.1개/cm²입니다."},{symbol:"A_c",name:"임계 면적",description:"결함이 생기면 기능을 잃는 위치의 가상 1 cm²입니다."},{symbol:"Y₀",name:"결함 0개 확률",description:"전체 공정·패키징 수율과는 다릅니다."}]} assumptions={["점 결함이 공간적으로 독립이고 평균 밀도가 일정합니다.","임계 면적에 결함 하나가 생기면 기능 고장이 납니다."]} interpretation="가상 결함 0개 확률은 약 90.48%이며, 1000개 후보의 양품 기댓값은 약 904.8개입니다." /></section>
  <section id="sensitivity" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">위험 면적이 네 배면 결함 0개 확률은 67.03%입니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
   <p className="leading-7">결함 밀도 0.1개/cm²를 그대로 두고 임계 면적만 4 cm²로 가정하면 평균은 0.4개, 결함 0개 확률은 e<sup>−0.4</sup>≈67.03%입니다. 반대로 면적 1 cm²를 유지하고 결함 밀도만 0.2개/cm²로 두면 e<sup>−0.2</sup>≈81.87%입니다. 밀도와 임계 면적은 곱으로 들어가므로 어느 쪽을 줄이든 이 단순 모형의 확률을 올립니다.</p>
   <p className="leading-7">이 두 면적 사례를 같은 웨이퍼에서 후보 다이 1000개씩이라고 비교하면 안 됩니다. 물리적 다이 크기와 가장자리 손실이 달라지면 웨이퍼에 놓이는 후보 수부터 달라집니다. 여기서는 한 다이의 결함 회피 확률만 비교합니다.</p>
   <p className="leading-7"><em>한 다이의 통과 확률과 웨이퍼 한 장의 후보 개수를 따로 봅니다.</em></p>
  </div></section>
  <section id="package" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">패키지와 시험을 통과하는 비율은 다음 분모에서 셉니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
   <p className="leading-7">가상 후보 1000개에서 앞의 결함 모형상 약 904.8개가 남을 것으로 기대됩니다. 이어서 <strong>그 통과 다이 중</strong> 조립·최종 시험을 통과하는 비율을 임의로 98%라고 놓으면, 출하 기대 개수는 904.8×0.98≈886.7개입니다. 처음 후보에 대한 합성 비율은 약 88.67%입니다. 98%는 인텔 공장의 공개 수율이 아니라 단계별 분모를 연습하기 위한 가정입니다.</p>
   <p className="leading-7">실제 패키지는 다이를 기판에 붙이고 외부 연결과 보호·열 방출 경로를 제공합니다. 조립 뒤에는 열·전기·기능 시험으로 불량과 사양을 가립니다. 포아송 결함식에 패키징 98%를 억지로 넣는 대신 앞 단계 통과분에 대한 <strong>조건부 통과율</strong>로 곱해야 합니다.</p>
   <p className="leading-7"><em>앞 단계 90.48%와 뒤 단계 98%를 곱할 때는 두 비율의 분모가 이어져야 합니다.</em></p>
  </div><CitationBlock source="Intel Tech 101, ‘How Silicon Die Become Chip Packages’ (2025-02-19)" citeKey={2} href="https://www.intel.com/content/www/us/en/newsroom/tech101/manufacturing/how-silicon-die-become-chip-packages.html">인텔 공식 설명은 다이 부착, 패키지의 보호·연결·열 역할, 조립 후 열·전기·기능 시험의 흐름을 보여줍니다. 본문의 조건부 98%와 886.7개는 인텔이 보고한 값이 아닙니다.</CitationBlock></section>
  <section id="limits" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">실제 수율에는 결함의 뭉침과 사양 탈락도 들어갑니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
   <p className="leading-7">점 결함이 완전히 무관하게 흩어지고 하나가 반드시 고장을 낸다는 가정은 거칩니다. 결함이 뭉치거나 크기별 영향이 다르고 일부 회로에 여분 구조가 있으면 실제 확률은 달라집니다. 선폭·저항·속도처럼 연속적인 사양 변화도 포아송의 0개 확률 하나로 설명할 수 없습니다. 공정에서는 결함 지도, 웨이퍼 시험, 조립 뒤 시험을 함께 보고 수율 손실의 위치를 찾습니다.</p>
   <p className="leading-7">이제 회로가 만들어지고 시험을 거친 뒤, 칩을 쓰는 사람의 입장에서 안쪽을 제어하는 법을 볼 차례입니다. 다음 임베디드 글은 메모리 주소로 주변 장치의 레지스터를 읽고 쓰는 한 동작에서 시작합니다.</p>
   <p className="leading-7"><strong>읽고 나서 예측해 보세요.</strong> 임계 면적 1 cm²와 밀도 0.1개/cm²에서 평균 결함 수는? (답: 3절) 임계 면적 네 배에서 한 다이의 확률은? (답: 4절) 왜 98%는 1000개 전체가 아닌 앞 단계 통과분에 곱합니까? (답: 5절)</p>
   <p className="leading-7"><Link to="/electronics/semiconductors/interconnect-and-rc-delay#limits">앞 글의 배선 타이밍</Link>처럼, 이 단순 확률도 실제 추출·시험 데이터로 교정해야 합니다.</p>
  </div></section>
 </div>;
}

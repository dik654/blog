import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import YieldDefectViz from "./yield-defect-and-packaging/viz/YieldDefectViz";

import NumericPath from "../world-systems/NumericPath";

export default function YieldDefectAndPackagingArticle() {
return <div className="space-y-16">
<section id="overview" data-teach-level="S" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">1. 어느 단계에서 몇 개가 남았는지부터 세어야 합니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">웨이퍼 위에 같은 회로를 많이 만들어도 모두 출하할 수 있는 것은 아닙니다. 작은 결함이 전기 연결을 망가뜨릴 수 있고, 다이를 붙이거나 마지막 기능을 확인하는 과정에서도 탈락합니다. 한 단계의 통과율을 공장 전체의 결과로 읽으면 남은 칩 수를 잘못 셉니다.</p><p className="leading-7">
            후보 1000개를 한 묶음으로 잡고 결함 계산에서 조립·시험까지 따라가겠습니다. 먼저 결함이 실제 고장을 만드는 자리를 나누고 그 자리에 결함이 없을 확률을 계산합니다. 다음
            단계에서는 분모를 앞 단계 통과분으로 바꾸겠습니다.
          </p></div>
</section>

<section id="outside" data-teach-level="B" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">2. 후보 다이가 결함 검사와 조립·시험을 거쳐 출하됩니다</h2>
<NumericPath title="한 묶음의 다이를 따라가기" steps={[{"label": "시작", "value": "후보1000개", "detail": "이 수를 첫 분모로 둡니다."}, {"label": "첫 판단", "value": "치명적 결함을 피했는가", "detail": "설명용 확률로 통과 기대 개수를 구합니다."}, {"label": "다음 판단", "value": "조립·시험을 통과했는가", "detail": "첫 판단을 통과한 다이만 다음 분모에 넣습니다."}, {"label": "결과", "value": "출하 가능한 개수", "detail": "처음1000개에 대해 최종 비율을 계산합니다."}]} /><div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">
            첫 판단에서는 정한 종류의 결함을 셉니다. 그 밖의 사양 탈락과 조립·최종 시험 손실은 설명을 위해 다음 단계의 비율에 묶습니다. 실제 생산 기록에서는 손실 원인마다 검사
            단계와 분모를 더 세분해야 합니다.
          </p></div>
</section>

<section id="case" data-teach-level="0" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">3. 후보 1000개에서 약 904.8개, 다시 약 886.7개를 기대합니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">모든 숫자는 <strong>가정</strong>입니다. 각 다이에서 점 결함 하나가 들어오면 기능이 깨지는 위치의 면적을 1 cm²로 둡니다. 그런 결함의 밀도는 평균 0.1개/cm²이고 공간적으로 독립적으로 흩어진다고 가정합니다. 한 다이가 만날 평균 결함 수는 0.1개입니다.</p><p className="leading-7">이 조건에서 해당 결함이 없는 확률은 약 90.48%입니다. 후보 1000개의 통과 기대 개수는 약 904.8개입니다. 그 통과분 중 다음 단계에서 98%가 남는다고 추가로 가정하면 출하 기대 개수는 약 886.7개입니다.</p><p className="leading-7">904.8개는 실제로 0.8개의 칩을 조립한다는 뜻이 아닙니다. 같은 조건의 생산을 많이 반복할 때의 평균을 계산한 것입니다. 한 번의 생산에서는 각 단계가 정수 개수로 기록됩니다.</p></div>
</section>

<section id="picture" data-teach-level="1" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">4. 결함 위치 지도와 단계별 통과 장부를 함께 봅니다</h2>
<NumericPath title="두 가지 기록의 역할" steps={[{"label": "위치 지도", "value": "고장을 만드는 자리", "detail": "같은 결함도 어디에 놓였는지에 따라 영향이 달라집니다."}, {"label": "첫 장부", "value": "1000개 중 결함을 피한 수", "detail": "평균 밀도와 위험 면적을 확률로 바꿉니다."}, {"label": "다음 장부", "value": "첫 통과분 중98%", "detail": "조립·시험에 들어간 대상에서 살아남은 비율입니다."}]} /><div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">결함 하나가 두 선 사이를 이어 붙이는 자리에 있으면 회로가 달라집니다. 같은 크기의 결함이 전기적으로 민감하지 않은 자리에 놓이면 같은 고장을 만들지 않을 수 있습니다. 그래서 다이 전체의 바깥 면적과 고장을 만드는 위치의 면적을 구분합니다.</p></div>
</section>

<section id="why" data-teach-level="2" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">5. 면적과 분모를 나누어야 실패 원인을 잘못 셈하지 않습니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">다이의 바깥 면적을 그대로 위험 면적으로 넣으면 결함의 크기와 실제 배선 간격을 빠뜨립니다. 먼저 어떤 결함이 어느 위치에서 고장을 내는지 정해야 밀도에 곱할 면적을 고를 수 있습니다.</p><p className="leading-7">또 다음 단계의 98%를 처음 1000개에 바로 곱하면 앞 단계에서 탈락한 다이를 다시 포함합니다. 두 통과율의 분모를 연결해야 합니다. 이미 결함을 피한 다이 중 다음 조건도 통과하는 비율을 곱하는 순서입니다.</p></div>
</section>

<section id="names" data-teach-level="3" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">6. 위험 면적·평균 결함 수·통과율에 이름을 붙입니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">정한 종류의 결함이 고장을 일으킬 수 있는 위치의 면적을 <strong>임계 면적 A<sub>c</sub></strong>라고 합니다. 이 면적에 평균 결함 밀도를 곱한 값이 <strong>평균 결함 수 λ</strong>입니다. 0.1이라는 평균은 개별 다이에 생긴 결함의 확정 개수가 아닙니다.</p><p className="leading-7">어느 단계에 들어온 대상 중 조건을 통과한 비율이 그 단계의 <strong>수율</strong>입니다. 어떤 검사와 분모를 썼는지 함께 적어야 같은 뜻의 수치를 비교할 수 있습니다.</p></div>
</section>

<section id="area" data-teach-level="4" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">7. 고장을 만드는 위치를 모아 1 cm²로 가정합니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert">
   <p className="leading-7">입자가 웨이퍼에 있어도 모든 위치가 같은 위험은 아닙니다. 두 선을 이어 붙이거나 한 선을 끊을 수 있는 위치가 더 위험합니다. 특정 크기의 결함이 기능 고장을 만들 수 있는 위치를 모은 면적이 <strong>임계 면적 A<sub>c</sub></strong>입니다. 가상 1 cm²는 다이의 바깥 치수를 그대로 뜻하지 않습니다.</p>
   <p className="leading-7">다이의 기능 검사에서 양품이 되는 비율과 속도·전력 같은 사양까지 통과하는 비율도 구분합니다. 이 글의 첫 계산은 임계 면적에 치명적 점 결함이 0개일 확률만 다룹니다.</p>
   <p className="leading-7"><em>다이가 커졌다는 말만으로 임계 면적이 정확히 몇 배인지 결정할 수 없습니다.</em></p>
  </div><CitationBlock source="MIT OpenCourseWare 2.830J/6.780J, Lecture 10, ‘Yield Modeling’ (2008), 원본 6–7·14·17·30쪽" citeKey={1} href="https://ocw.mit.edu/courses/2-830j-control-of-manufacturing-processes-sma-6303-spring-2008/4aff1e21de13870355ef44dbe71f45c6_lecture10.pdf">MIT 공식 강의안은 기능·파라미터 수율을 구분하고 결함 밀도, 임계 면적, 공간적으로 독립인 점 결함의 포아송 모형과 그 한계를 설명합니다. 아래 면적·밀도는 강의의 측정 데이터가 아닙니다.</CitationBlock>
</section>

<section id="poisson" data-teach-level="4" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">8. 평균 0.1개에서 결함 0개 확률을 계산합니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert">
   <p className="leading-7">결함 밀도 D<sub>0</sub>가 0.1개/cm²이고 임계 면적 A<sub>c</sub>가 1 cm²이면, 한 다이에 들어올 것으로 기대되는 결함 수 λ=D<sub>0</sub>A<sub>c</sub>=0.1개입니다. 평균이 0.1개라고 해서 다이마다 0.1개의 결함이 있는 것은 아닙니다. 많은 다이에 0개, 일부에 1개 이상인 분포의 평균입니다.</p>
   <p className="leading-7">서로 무관하게 흩어진 점 결함이 임계 면적에 하나만 들어와도 기능을 잃는다고 가정하면, 결함이 0개일 확률은 Y=e<sup>−λ</sup>=e<sup>−0.1</sup>≈0.9048입니다. 가상 후보 다이 1000개가 각각 이 조건을 가진다면 결함 모형상 양품의 <strong>기댓값</strong>은 약 904.8개입니다. 실제 시험에서 0.8개의 다이가 나온다는 뜻도, 한 번의 생산 결과를 보장한다는 뜻도 아닙니다.</p>
   <p className="leading-7"><em>포아송 계산은 평균 결함 수에서 0개일 확률로 넘어가는 단계입니다.</em></p>
  </div><YieldDefectViz /><ExplainedFormula question="임계 면적에 치명적 점 결함이 하나도 없을 확률은?" idea="평균 결함 수를 결함 밀도와 임계 면적의 곱으로 구하고 포아송 분포의 0개 확률 e⁻λ를 계산합니다." formula={String.raw`Y_0=e^{-D_0A_c}`} annotatedFormula={String.raw`Y_0=e^{-\underbrace{D_0A_c}_{\text{평균 결함 수}}}`} operations={[{expression:String.raw`\lambda=0.1\,\mathrm{cm^{-2}}\times1\,\mathrm{cm^2}=0.1`,annotation:"단위 면적당 평균 결함 수에 임계 면적을 곱합니다."},{expression:String.raw`Y_0=e^{-0.1}\approx0.9048`,annotation:"임계 면적 안에 0개일 포아송 확률입니다."},{expression:String.raw`1000Y_0\approx904.8`,annotation:"1000개 후보의 결함 모형상 양품 기댓값입니다."}]} terms={[{symbol:"D₀",name:"평균 결함 밀도",description:"가정한 0.1개/cm²입니다."},{symbol:"A_c",name:"임계 면적",description:"결함이 생기면 기능을 잃는 위치의 가상 1 cm²입니다."},{symbol:"Y₀",name:"결함 0개 확률",description:"전체 공정·패키징 수율과는 다릅니다."}]} assumptions={["점 결함이 공간적으로 독립이고 평균 밀도가 일정합니다.","임계 면적에 결함 하나가 생기면 기능 고장이 납니다."]} interpretation="가상 결함 0개 확률은 약 90.48%이며, 1000개 후보의 양품 기댓값은 약 904.8개입니다." />
</section>

<section id="source" data-teach-level="5" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">9. 원문의 0개 확률에 같은 면적과 밀도를 넣습니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">MIT 강의안 17쪽은 점 결함, 결함 하나의 고장, 공간적 비상관이라는 조건 아래 임계 면적과 밀도로 수율을 계산합니다. 포아송 분포에서 결함 개수가 k일 확률은 <code>exp(−λ)λᵏ/k!</code>입니다. 원문이 묻는 고장 없는 경우에 k=0을 넣으면 남는 값은 exp(−λ)입니다.</p><p className="leading-7">같은 사례에서 λ=0.1×1=0.1이므로 exp(−0.1)≈0.904837입니다. 1000개에 곱하면 약 904.837개입니다. 평균 결함 수 0.1을 통과율 0.9로 단순히 빼는 계산과도 다릅니다. 한 다이에 결함이 여러 개 들어올 수 있는 분포를 세었기 때문입니다.</p><p className="leading-7">원문 30쪽은 고장을 만드는 위치가 결함 크기와 단선·단락 종류에 따라 달라진다고 설명합니다. 따라서 여기의 1 cm²와 0.1개/cm²는 같은 결함 종류를 기준으로 맞춘 가정입니다. 서로 다른 입자 크기의 밀도와 면적을 아무렇게나 곱하지 않습니다.</p></div>
</section>

<section id="sensitivity" data-teach-level="6" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">10. 위험 면적과 밀도를 바꾸되 후보 수와 구별합니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert">
   <p className="leading-7">결함 밀도 0.1개/cm²를 그대로 두고 임계 면적만 4 cm²로 가정하면 평균은 0.4개, 결함 0개 확률은 e<sup>−0.4</sup>≈67.03%입니다. 반대로 면적 1 cm²를 유지하고 결함 밀도만 0.2개/cm²로 두면 e<sup>−0.2</sup>≈81.87%입니다. 밀도와 임계 면적은 곱으로 들어가므로 어느 쪽을 줄이든 이 단순 모형의 확률을 올립니다.</p>
   <p className="leading-7">이 두 면적 사례를 같은 웨이퍼에서 후보 다이 1000개씩이라고 비교하면 안 됩니다. 물리적 다이 크기와 가장자리 손실이 달라지면 웨이퍼에 놓이는 후보 수부터 달라집니다. 여기서는 한 다이의 결함 회피 확률만 비교합니다.</p>
   <p className="leading-7"><em>한 다이의 통과 확률과 웨이퍼 한 장의 후보 개수를 따로 봅니다.</em></p>
  </div>
</section>

<section id="package" data-teach-level="6" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">11. 원문의 조립·시험 순서에 다음 단계 98%를 대응시킵니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert">
   <p className="leading-7">가상 후보 1000개에서 앞의 결함 모형상 약 904.8개가 남을 것으로 기대됩니다. 이어서 <strong>그 통과 다이 중</strong> 조립·최종 시험을 통과하는 비율을 임의로 98%라고 놓으면, 출하 기대 개수는 904.8×0.98≈886.7개입니다. 처음 후보에 대한 합성 비율은 약 88.67%입니다. 98%는 인텔 공장의 공개 수율이 아니라 단계별 분모를 연습하기 위한 가정입니다.</p>
   <p className="leading-7">실제 패키지는 다이를 기판에 붙이고 외부 연결과 보호·열 방출 경로를 제공합니다. 조립 뒤에는 열·전기·기능 시험으로 불량과 사양을 가립니다. 포아송 결함식에 패키징 98%를 억지로 넣는 대신 앞 단계 통과분에 대한 <strong>조건부 통과율</strong>로 곱해야 합니다.</p>
   <p className="leading-7"><em>앞 단계 90.48%와 뒤 단계 98%를 곱할 때는 두 비율의 분모가 이어져야 합니다.</em></p>
  </div><CitationBlock source="Intel Tech 101, ‘How Silicon Die Become Chip Packages’ (2025-02-19)" citeKey={2} href="https://www.intel.com/content/www/us/en/newsroom/tech101/manufacturing/how-silicon-die-become-chip-packages.html">인텔 공식 설명은 다이 부착, 패키지의 보호·연결·열 역할, 조립 후 열·전기·기능 시험의 흐름을 보여줍니다. 본문의 조건부 98%와 886.7개는 인텔이 보고한 값이 아닙니다.</CitationBlock><div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">인텔의 공식 공정 소개는 다이 부착, 접합부를 채우는 재료, 열을 퍼뜨리는 덮개, 열·전압을 가하는 시험, 전기 시험, 사용 환경을 흉내 낸 검증을 구분합니다. 예제의 98%는 이런 뒤 단계와 남은 사양 손실을 묶은 가정입니다. 글이 각 단계의 실측 수율을 공개한 것은 아닙니다.</p><p className="leading-7">기호로 쓰면 첫 조건은 A입니다. 뒤 조건은 B이며 최종 비율은 P(A)×P(B|A)입니다. 여기서는 0.904837×0.98≈0.886741입니다. 뒤 비율이 처음부터 조건부이므로 두 단계가 서로 독립이라고 추가로 가정할 필요가 없습니다. 처음 전체에 대한 P(B)를 썼다면 같은 곱을 정당화할 수 없습니다.</p></div>
</section>

<section id="limits" data-teach-level="7" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">12. 실제 수율에는 결함의 뭉침과 사양 탈락도 들어갑니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert">
   <p className="leading-7">
            점 결함이 완전히 무관하게 흩어지고 하나가 반드시 고장을 낸다는 가정은 거칩니다. 결함이 뭉치거나 크기별 영향이 다르고 일부 회로에 여분 회로가 있으면 실제 확률은 달라집니다.
            선폭·저항·속도처럼 연속적인 사양 변화도 포아송의 0개 확률 하나로 설명할 수 없습니다. 공정에서는 결함 지도, 웨이퍼 시험, 조립 뒤 시험을 함께 보고 수율 손실의 위치를
            찾습니다.
          </p>
   <p className="leading-7">이제 회로가 만들어지고 시험을 거친 뒤, 칩을 쓰는 사람의 입장에서 안쪽을 제어하는 법을 볼 차례입니다. 다음 임베디드 글은 메모리 주소로 주변 장치의 레지스터를 읽고 쓰는 한 동작에서 시작합니다.</p>
   <p className="leading-7"><strong>읽고 나서 예측해 보세요.</strong> 임계 면적 1 cm²와 밀도 0.1개/cm²에서 평균 결함 수는? (답: 8·9절) 임계 면적 네 배에서 한 다이의 확률은? (답: 10절) 왜 98%는 1000개 전체가 아닌 앞 단계 통과분에 곱합니까? (답: 11절)</p>
   <p className="leading-7"><Link to="/electronics/semiconductors/interconnect-and-rc-delay#limits">앞 글의 배선 타이밍</Link>처럼, 이 단순 확률도 실제 추출·시험 데이터로 교정해야 합니다.</p>
  </div>
</section>
</div>;
}

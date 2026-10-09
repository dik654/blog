import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import LithographyViz from "./lithography-and-resolution/viz/LithographyViz";

import NumericPath from "../world-systems/NumericPath";

export default function LithographyAndResolutionArticle() {
return <div className="space-y-16">
<section id="overview" data-teach-level="S" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">1. 창의 폭과 놓인 위치를 따로 확인해야 연결됩니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">
            아래 금속선 위에 작은 연결 창을 만든다고 생각해 보겠습니다. 창 자체는 원하는 폭으로 나왔는데 옆으로 밀려 있으면 금속선의 가장자리를 벗어날 수 있습니다. 무늬를 얼마나 작게
            만들 수 있는지와 어디에 놓았는지를 각각 확인해야 합니다.
          </p><p className="leading-7">
            같은 선과 창을 끝까지 따라가겠습니다. 빛으로 무늬를 기록하고 아래 층에 옮기는 순서를 본 뒤 무늬 크기와 층 사이 위치를 각각 계산합니다. 마지막에는 장비 제조사가 공개한
            식과 측정 방법에 이 숫자를 대입합니다.
          </p></div>
</section>

<section id="outside" data-teach-level="B" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">2. 빛으로 기록한 무늬가 아래 층의 열린 자리가 됩니다</h2>
<NumericPath title="한 층의 가공을 밖에서 보기" steps={[{"label": "넣기", "value": "옮길 무늬·찍을 위치", "detail": "이전 층의 선 위에 다음 창을 놓습니다."}, {"label": "가공", "value": "빛으로 기록하고 선택한 곳을 열기", "detail": "빛에 반응하는 막을 거쳐 아래 층을 가공합니다."}, {"label": "확인", "value": "실제 폭·이전 층과의 위치 차이", "detail": "두 측정이 모두 필요합니다."}]} /><div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">완성된 창의 크기만 보면 어느 자리에 놓였는지 알 수 없습니다. 반대로 중심이 맞더라도 창이 너무 크거나 작게 만들어졌다면 원하는 접촉 면적을 얻지 못합니다. 두 검사를 같은 단면에 표시하겠습니다.</p></div>
</section>

<section id="case" data-teach-level="0" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">3. 200 nm 선 위에 120 nm 창을 놓습니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">이 글의 모든 치수 조합은 설명용 <strong>가정</strong>입니다. 이전 층의 선 폭은 200 nm이고 새 연결 창은 120 nm입니다. 두 중심을 맞추면 선 끝부터 창 끝까지 양쪽에 (200−120)/2=40 nm가 남습니다.</p><p className="leading-7">창을 오른쪽으로 30 nm 옮기면 오른쪽 거리는 10 nm, 왼쪽은 70 nm입니다. 50 nm 옮기면 오른쪽 창 끝은 선을 10 nm 넘어갑니다. 이 단면에서 변한 것은 창의 폭이 아니라 중심 위치입니다.</p><p className="leading-7">무늬를 얼마나 작게 찍을 수 있는지 계산할 때는 빛의 파장을 193 nm로 따로 가정합니다. 120 nm 창을 실제로 만들 수 있다는 제품 사양과는 구분합니다.</p></div>
</section>

<section id="picture" data-teach-level="1" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">4. 기록할 막·무늬를 비출 경로·아래 층을 차례로 봅니다</h2>
<NumericPath title="무늬가 아래 층에 도달하는 순서" steps={[{"label": "빛에 반응할 막", "value": "가공할 층 위에 바르기", "detail": "아래 층을 바로 깎기 전에 무늬를 기록할 자리를 둡니다."}, {"label": "무늬가 담긴 판과 빛", "value": "판의 무늬를 줄여 비추기", "detail": "선택한 위치의 막 성질이 바뀝니다."}, {"label": "기록된 막", "value": "굽고 선택한 부분을 씻어 내기", "detail": "아래 층이 드러날 자리를 만듭니다."}, {"label": "아래 층", "value": "열린 곳을 가공하기", "detail": "임시 막의 무늬가 실제 구조로 옮겨집니다."}]} /><div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">
            이 순서에서는 빛을 받는 단계와 물질을 제거하는 단계가 다릅니다. 빛에 반응하는 막이 중간에서 어느 부분을 남길지 정하고 뒤의 가공이 실제 아래 층의 모양을 만듭니다.
          </p></div>
</section>

<section id="why" data-teach-level="2" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">5. 기록과 물질 제거를 나누어 원하는 부분만 가공합니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">아래 층 전체를 같은 조건으로 깎으면 120 nm 창만 골라 열 수 없습니다. 먼저 빛으로 구분할 수 있는 막에 무늬를 기록하고 그 막이 아래 층의 가공 범위를 가리게 합니다. 마지막에는 임시로 사용한 막을 제거합니다.</p><p className="leading-7">또 새로운 층을 찍을 때마다 이전 층과의 위치를 맞춰야 합니다. 120 nm를 일정하게 찍는 조절과 창의 중심을 200 nm 선 위에 놓는 조절은 서로 다른 값을 다룹니다. 폭이 맞았다는 사실만으로 위치까지 맞았다고 판단할 수 없습니다.</p></div>
</section>

<section id="names" data-teach-level="3" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">6. 이미 본 기록·투영·위치 차이에 이름을 붙입니다</h2>
<div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr><th className="p-3">그림에서 본 역할</th><th className="p-3">이름</th></tr></thead><tbody><tr><td className="p-3">빛에 반응해 무늬를 기록하는 막</td><td className="p-3">감광막</td></tr><tr><td className="p-3">옮길 무늬가 들어 있는 판</td><td className="p-3">레티클</td></tr><tr><td className="p-3">두 층 사이의 상대 위치 차이</td><td className="p-3">오버레이</td></tr><tr><td className="p-3">감광막에 빛을 비추는 단계</td><td className="p-3">노광</td></tr><tr><td className="p-3">감광막의 선택한 부분을 씻어 내는 단계</td><td className="p-3">현상</td></tr><tr><td className="p-3">아래 층의 물질을 제거하는 단계</td><td className="p-3">식각</td></tr></tbody></table></div><p className="my-6 leading-7">새 창의 중심이 30 nm 이동했다는 말은 오버레이 차이를 뜻합니다. 창 폭이 30 nm 늘었다는 말과 다릅니다. 나머지 공정 이름들은 앞 그림에서 빛으로 기록하고 아래 층에 옮기는 순서에 대응합니다.</p>
</section>

<section id="transfer" data-teach-level="4" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">7. 120 nm 창의 무늬를 감광막에서 아래 층으로 옮깁니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert">
   <p className="leading-7">웨이퍼 위에 빛에 반응하는 <strong>감광막</strong>을 바르고, 무늬가 담긴 레티클을 통해 빛을 비춥니다. 광학계가 그 무늬를 줄여 감광막에 기록합니다. 이후 굽고 현상하면 선택한 부분이 씻겨 나가 창이 생깁니다. 그 창을 통해 아래 막을 식각하거나 필요한 물질을 바꾸고, 남은 감광막은 제거합니다. 앞 글의 ‘산화막 창’은 이 단계들을 거쳐 아래 산화막에 실제로 옮겨진 결과입니다.</p>
   <p className="leading-7">
            빛을 비춘 자리와 최종적으로 열린 자리가 언제나 같다고 단정하지 않습니다. 감광막의 종류와 현상·식각 조건이 바뀌면 어느 쪽이 남는지도 달라집니다. 따라서 이 글은 특정
            양성·음성 감광막의 색을 고정하지 않고 무늬가 감광막을 거쳐 아래 층으로 전달된다는 순서에 집중합니다.
          </p>
   <p className="leading-7"><em>레티클 무늬는 감광막에 기록된 뒤 가공을 거쳐 아래 층의 창이 됩니다.</em></p>
  </div><CitationBlock source="ASML, ‘Six crucial steps in semiconductor manufacturing’ (주소의 2021 게시, 페이지 표기 2023-10-04 갱신), Photoresist coating·Lithography·Etch 절" citeKey={1} href="https://www.asml.com/en/company/stories/2021/semiconductor-manufacturing-process-steps">장비 제조사의 공식 설명은 감광막 도포, 레티클 투영 노광, 베이크·현상, 열린 자리의 식각을 순서대로 제시합니다. 이 글의 200·120 nm 선과 창은 해당 공정의 제품 치수가 아닙니다.</CitationBlock>
</section>

<section id="resolution" data-teach-level="5" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">8. 원문의 크기 식에 193 nm를 넣으면 96.5 nm입니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert">
   <p className="leading-7">ASML은 인쇄할 수 있는 가장 작은 무늬의 기준인 <strong>임계 치수 CD</strong>를 CD=k<sub>1</sub>λ/NA로 설명합니다. λ는 빛의 파장, NA는 빛을 모으는 광학계의 수치 개구, k<sub>1</sub>은 광학·감광막·공정 최적화를 묶는 계수입니다. 이 식 안에서는 파장이 작을수록, NA가 클수록 CD가 작아집니다. k<sub>1</sub>도 독립된 마법 숫자가 아니라 공정 조건의 결과입니다.</p>
   <p className="leading-7">설명용으로 λ=193 nm, NA=0.8, k<sub>1</sub>=0.4를 함께 <strong>가정</strong>하면 CD=0.4×193/0.8=96.5 nm입니다. 다른 조건을 모두 유지하고 k<sub>1</sub>만 0.3으로 바뀌었다고 가정하면 약 72.4 nm입니다. 이것은 실제 특정 ASML 장비의 보증 선폭이나 ‘공정 노드’가 아닙니다. 120 nm 접촉 창과 200 nm 선의 별도 정렬 예도 이 96.5 nm보다 크게 골랐습니다.</p>
   <p className="leading-7"><em>식은 가능한 무늬 크기를 따지는 출발점이고, 인쇄된 모든 모양의 보증서는 아닙니다.</em></p>
  </div><ExplainedFormula question="가상 λ=193 nm·NA=0.8·k₁=0.4에서 CD는?" idea="파장에 공정 계수를 곱한 뒤 광학계의 수치 개구로 나눕니다." formula={String.raw`\mathrm{CD}=k_1\frac{\lambda}{\mathrm{NA}}`} annotatedFormula={String.raw`\underbrace{\mathrm{CD}}_{\text{임계 치수}}=k_1\frac{\lambda}{\mathrm{NA}}`} operations={[{expression:String.raw`0.4\times193\,\mathrm{nm}=77.2\,\mathrm{nm}`,annotation:"가정한 파장과 계수입니다."},{expression:String.raw`77.2/0.8=96.5\,\mathrm{nm}`,annotation:"NA는 무차원입니다."},{expression:String.raw`0.3\times193/0.8\approx72.4\,\mathrm{nm}`,annotation:"k₁만 바꾼 별도 가정입니다."}]} terms={[{symbol:"CD",name:"임계 치수",description:"이 광학·공정식의 최소 무늬 기준입니다."},{symbol:String.raw`\lambda`,name:"빛의 파장",description:"가상 193 nm입니다."},{symbol:"NA",name:"수치 개구",description:"가상 0.8이며 빛 수집 범위를 나타냅니다."},{symbol:"k₁",name:"공정 계수",description:"가상 0.4 또는 0.3입니다."}]} assumptions={["λ·NA·k₁ 조합은 설명용 가정이며 특정 장비의 승인 조건이 아닙니다.","CD 식만으로 초점, 감광막, 식각 뒤 모양과 수율을 결정하지 않습니다."]} interpretation="가상 CD는 96.5 nm입니다. 층 정렬이 맞는지는 이 수치로 알 수 없습니다." /><CitationBlock source="ASML, ‘The Rayleigh criterion for resolution’, CD=k₁·λ/NA 절" citeKey={2} href="https://www.asml.com/en/technology/lithography-principles/rayleigh-criterion">ASML 공식 설명에서 CD·λ·NA·k₁의 뜻과 식을 확인했습니다. 193 nm·0.8·0.4 조합 및 96.5 nm 계산은 이 글의 가정이며 제품 사양 인용이 아닙니다.</CitationBlock><div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">식만 놓고 NA를 0.8에서 1.6으로 두 배로 바꾸면 0.4×193/1.6=48.25 nm로 절반이 됩니다. 이것은 다른 조건을 고정한 대수 계산입니다. 같은 광학계와 매질에서 실제로 NA를 두 배로 만들 수 있다는 뜻은 아닙니다. 초점과 감광막 반응, 식각 뒤 형태까지 따로 확인해야 합니다.</p></div>
</section>

<section id="overlay" data-teach-level="6" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">9. 같은 120 nm 창을 30 nm 옮겨 원문의 위치 정의를 적용합니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert">
   <p className="leading-7">이전 층의 200 nm 선 가운데에 120 nm 연결 창을 얹는 가상 단면을 봅니다. 중심이 같으면 남는 폭은 (200−120)/2=40 nm씩입니다. 새 창 중심이 한쪽으로 30 nm 밀리면 가까운 쪽 여유는 40−30=10 nm, 먼 쪽은 70 nm입니다. 50 nm 밀리면 가까운 쪽은 −10 nm, 곧 창이 이전 선의 경계를 10 nm 넘습니다.</p>
   <p className="leading-7">이처럼 두 층의 위치 차이를 <strong>오버레이</strong>라고 부릅니다. CD=96.5 nm를 달성해도 위치가 어긋나면 이 연결은 부족할 수 있습니다. 반대로 위치가 정확해도 무늬 자체가 너무 넓거나 좁게 인쇄되면 별도의 문제입니다. 아래 그림의 폭은 설명용이며 실제 장비의 오버레이 성능이나 생산 수율을 뜻하지 않습니다.</p>
   <p className="leading-7"><em>가장 가까운 한쪽의 거리만 봐도 어떤 오차가 연결을 먼저 위협하는지 알 수 있습니다.</em></p>
  </div><LithographyViz /><ExplainedFormula question="새 창 중심이 30 nm 밀리면 가까운 쪽 여유는?" idea="가운데 정렬일 때의 절반 여유에서 중심 이동 거리를 뺍니다." formula={String.raw`M_{\min}=M_0-|\Delta x|`} annotatedFormula={String.raw`\underbrace{M_{\min}}_{\text{가까운 쪽 여유}}=M_0-|\Delta x|`} operations={[{expression:String.raw`(200-120)/2=40\,\mathrm{nm}`,annotation:"정렬이 정확할 때 한쪽 여유입니다."},{expression:String.raw`40-30=10\,\mathrm{nm}`,annotation:"30 nm 밀리면 가까운 쪽에 남습니다."},{expression:String.raw`40-50=-10\,\mathrm{nm}`,annotation:"50 nm면 창이 선 밖으로 10 nm 나갑니다."}]} terms={[{symbol:"M₀",name:"중앙 정렬 한쪽 여유",description:"(이전 선 폭−새 창 폭)/2이며 가상 40 nm입니다."},{symbol:"Wline",name:"이전 층 선 폭",description:"가상 200 nm입니다."},{symbol:"Wwindow",name:"새 층 창 폭",description:"가상 120 nm입니다."},{symbol:String.raw`\Delta x`,name:"중심 위치 차이",description:"두 층 사이 가상 이동 거리입니다."}]} assumptions={["두 무늬가 직사각형이며 폭 변동 없이 옆으로만 이동합니다.","거리는 기하학적 명목값이며 식각·전기 접촉 품질을 보증하지 않습니다."]} interpretation="30 nm 이동이면 최소 여유 10 nm, 50 nm면 −10 nm입니다. CD와는 다른 측정입니다." /><CitationBlock source="ASML, ‘Measuring accuracy’, YieldStar·Fast, accurate wafer metrology 절" citeKey={3} href="https://www.asml.com/en/technology/lithography-principles/measuring-accuracy">공식 자료는 오버레이를 두 칩 층의 정렬 정확도로 설명하고, 계측 표적에서 오버레이와 초점을 측정한다고 밝힙니다. 200·120·30·50 nm는 본문의 가상 정렬 기하입니다.</CitationBlock><div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">ASML의 계측 설명에서 오버레이는 두 층을 얼마나 정확히 맞췄는지를 가리킵니다. 여기에 이 글의 단면을 대응시키면 중심 차이는 30 nm이고 가까운 끝의 남은 거리는 10 nm입니다. 중심 차이와 가장자리 거리는 같은 숫자가 아니며 서로 다른 질문에 답합니다.</p><p className="leading-7">따라서 검사표에는 창의 실제 폭, 이전 선의 실제 폭, 두 중심의 차이를 따로 적어야 합니다. 이 가정의 120·200·30 nm를 함께 알아야 가까운 쪽 10 nm를 계산할 수 있습니다.</p></div>
</section>

<section id="limits" data-teach-level="7" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">10. 찍힌 감광막과 식각 뒤 실제 구조를 다시 재야 합니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert">
   <p className="leading-7">
            노광 장비는 위치와 초점을 맞추지만 아래 층의 높낮이·감광막 화학·식각은 최종 구조를 바꿉니다. ASML은 오버레이와 초점을 계측 표적에서 살피고 식각 뒤 구조도 따로
            측정한다고 설명합니다. 따라서 이 글의 CD 계산과 10 nm 여유는 ‘검사 없이 양품’이라는 뜻이 아닙니다. 원하는 전기적 연결이 되는지의 확인은 이후 공정과 검사까지
            이어집니다.
          </p>
   <p className="leading-7">다음 글은 창 안에 넣은 불순물이 열을 받는 동안 어디까지 퍼지는지 계산합니다. 창의 위치를 잘 잡아도 이후 가열에서 접합 깊이와 옆 범위가 달라질 수 있기 때문입니다.</p>
   <p className="leading-7"><strong>읽고 나서 예측해 보세요.</strong> λ·NA·k₁에서 CD가 무엇입니까? (답: 8절) 30 nm 오버레이 오차가 생기면 한쪽 여유는 얼마입니까? (답: 9절) CD=96.5 nm가 실제 접촉 성공을 보증합니까? (답: 9·10절)</p>
   <p className="leading-7"><Link to="/electronics/semiconductors/wafer-and-planar-process#mask">앞 글의 산화막 창</Link>은 이번 무늬 전달 순서가 아래 층까지 내려간 결과입니다.</p>
  </div>
</section>
</div>;
}

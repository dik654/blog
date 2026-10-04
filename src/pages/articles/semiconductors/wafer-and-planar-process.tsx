import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import PlanarProcessViz from "./wafer-and-planar-process/viz/PlanarProcessViz";

import NumericPath from "../world-systems/NumericPath";

export default function WaferAndPlanarProcessArticle() {
return <div className="space-y-16">
<section id="overview" data-teach-level="S" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">1. 들어갈 자리와 끝까지 덮어 둘 자리를 따로 정합니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">실리콘 전체를 같은 종류로 바꾸면 한 소자에 필요한 서로 다른 영역을 만들 수 없습니다. 필요한 곳만 열어 원자를 넣고 나머지는 덮어 두어야 합니다. 그런데 원자를 넣은 뒤 그 덮개를 모두 없애면 보호해야 할 경계도 드러납니다.</p><p className="leading-7">
            한 작은 영역을 만드는 순서를 따라가겠습니다. 첫 창으로 재료를 바꾸고 다음 창으로 전극을 붙입니다. 두 창의 크기를 다르게 두는 이유를 계산한 뒤 실제 특허의 문장이 같은
            보호 조건을 어떻게 정하는지 확인하겠습니다.
          </p></div>
</section>

<section id="outside" data-teach-level="B" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">2. 실리콘과 두 창의 위치를 정해 접합과 접촉을 만듭니다</h2>
<NumericPath title="가공 전후를 비교하기" steps={[{"label": "시작", "value": "한 종류의 실리콘", "detail": "윗면을 막으로 덮습니다."}, {"label": "제어", "value": "첫 창과 다음 창", "detail": "재료를 바꿀 자리와 전극이 닿을 자리를 정합니다."}, {"label": "결과", "value": "안쪽 경계는 덮이고 전극은 닿음", "detail": "보호와 전기 연결을 함께 만족해야 합니다."}]} /><div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">
            입력은 창의 폭만이 아닙니다. 넣을 원자의 종류와 가열 조건도 안쪽 영역의 모양을 바꿉니다. 이번에는 이 모양을 좌우 대칭의 단면으로 줄여 창과 경계 사이의 거리를
            계산하겠습니다.
          </p></div>
</section>

<section id="case" data-teach-level="0" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">3. 100 µm의 첫 창과 80 µm의 전극 창을 고릅니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">치수는 모두 <strong>가정</strong>입니다. n형 실리콘을 덮은 막에 폭 100 µm의 창을 냅니다. 이 창으로 p형을 만드는 원자를 넣고 가열합니다. 원자가 창 양쪽으로 각각 2 µm씩 더 퍼진다고 두면 표면의 p형 폭은 104 µm입니다.</p><p className="leading-7">
            그다음 p형 영역의 중앙에 폭 80 µm의 전극 창을 냅니다. 전극 창의 끝부터 p형 표면의 끝까지는 양쪽 각각 12 µm입니다. 이 거리가 왜 남는지와 그 위의 막을 왜
            유지하는지를 같은 단면에서 보겠습니다.
          </p><p className="leading-7">100·2·80 µm는 역사적 특허의 공정 치수를 재현한 수치가 아닙니다. 전극이 닿아야 할 면과 덮여 있어야 할 경계의 위치를 분명히 하려고 고른 가상 사례입니다.</p></div>
</section>

<section id="picture" data-teach-level="1" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">4. 첫 창은 원자 입구이고 다음 창은 전극 자리입니다</h2>
<NumericPath title="같은 단면의 가공 순서" steps={[{"label": "막 덮기", "value": "윗면 전체", "detail": "원자가 들어갈 곳을 아직 열지 않았습니다."}, {"label": "첫 창 열기", "value": "100 µm", "detail": "노출된 실리콘으로 원자를 들입니다."}, {"label": "안쪽 영역 만들기", "value": "표면 폭104 µm", "detail": "열을 받으면 아래와 옆으로 퍼집니다."}, {"label": "전극 창 열기", "value": "중앙80 µm", "detail": "경계 위 막은 남기고 접촉 면을 엽니다."}]} /><div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">같은 구멍을 다시 쓰는 것처럼 보여도 두 단계의 목적은 다릅니다. 처음에는 원자를 넣을 면을 고릅니다. 나중에는 전극이 닿을 면을 고르면서 새로 생긴 경계 위의 막을 남깁니다. 다이오드의 다른 쪽 전극은 아래쪽 실리콘에 연결합니다.</p></div>
</section>

<section id="why" data-teach-level="2" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">5. 창을 열었다가 다시 덮는 데 이유가 있습니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">
            처음부터 모든 표면을 열면 필요한 작은 영역만 골라 원자를 넣을 수 없습니다. 반대로 마지막까지 모두 덮어 두면 전극이 실리콘에 직접 닿지 못합니다. 따라서 선택한 면을 여는
            두 단계와 경계를 보호하는 부분이 필요합니다.
          </p><p className="leading-7">원자는 창의 수직 아래로만 움직이지 않습니다. 옆으로 퍼진 결과 경계가 처음 덮여 있던 막 아래에 닿을 수 있습니다. 그 막은 처음에는 입구를 제한했고 나중에는 경계를 보호합니다. 이 두 역할 때문에 가공 뒤 막을 무조건 벗기지 않습니다.</p></div>
</section>

<section id="wafer" data-teach-level="3" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">6. 바탕·산화막·접촉 창의 이름과 역할을 잇습니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert">
      <p className="leading-7"><strong>웨이퍼</strong>는 넓고 얇은 반도체 조각입니다. 산화막을 덮고 여러 창을 만들면 같은 공정을 여러 위치에 반복할 수 있습니다. 개별 소자의 경계는 나중에 절단할 수 있지만, 이 글에서 다루는 전기적 p-n 접합은 절단선이 아니라 실리콘 안의 서로 다른 도핑 영역 사이입니다. 두 종류의 ‘경계’를 섞으면 어느 면을 보호해야 하는지 놓칩니다.</p>
      <p className="leading-7">
            Hoerni의 1959년 출원 특허는 웨이퍼 위의 여러 다이오드 영역을 만들고 뒤에 분리할 수도 있다고 설명합니다. 특허의 주된 새 생각은 단순히 많이 자르는 일이 아니라 확산
            영역의 옆모양을 정하는 산화막을 접합 보호에도 계속 쓴다는 것입니다.
          </p>
      <p className="leading-7"><em>웨이퍼 위의 반복 공정은 여러 소자에 같은 무늬를 옮기는 출발점입니다.</em></p>
    </div><CitationBlock source="Jean A. Hoerni, US Patent 3,025,589, ‘Method of Manufacturing Semiconductor Devices’, 1959 출원·1962 등록, 원본 3쪽(도 1–4 설명)" citeKey={1} href="https://patentimages.storage.googleapis.com/cc/fb/db/690d609db55af5/US3025589.pdf">원본 3쪽은 실리콘 웨이퍼에 산화막을 덮고 여러 창을 낸 뒤 개별 다이오드를 분리하거나 웨이퍼 위에서 함께 가공할 수 있다고 설명합니다. 본문 100 µm 값은 특허의 공정 치수가 아닙니다.</CitationBlock><div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">불순물이 통과하기 어려운 부분을 덮어 가공 범위를 고르는 막을 <strong>마스크</strong>라고 부릅니다. 여기서는 실리콘의 산화막이 그 역할을 합니다. 뒤에 전극이 닿도록 연 자리는 <strong>접촉 창</strong>입니다. 막이 해당 원자와 가열 조건에서 실제로 잘 막아 준다는 전제가 필요합니다.</p></div>
</section>

<section id="mask" data-teach-level="4" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">7. 100 µm 입구에서 104 µm의 표면 영역을 만듭니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert">
      <p className="leading-7">실리콘 표면의 산화막에 창을 내면 그곳의 실리콘만 드러납니다. 가정한 폭 100 µm 창 밖은 덮여 있으므로, 이 단계에서 불순물을 실리콘 안으로 들이는 입구는 창의 위치로 제한됩니다. 열을 주며 p형 불순물이 퍼지는 <strong>확산</strong>을 하면 창 아래에 p형 영역이 생기고 원래 n형 실리콘과 만나는 곳에 p-n 접합이 생깁니다.</p>
      <p className="leading-7">확산은 아래로만 일어나지 않습니다. 옆으로도 퍼집니다. 계산을 쉽게 하려고 표면에서 창 양쪽으로 2 µm씩 더 퍼진다고 <strong>가정</strong>하면 p형 폭은 100+2+2=104 µm입니다. 실제 옆 확산은 온도·시간·재료 농도와 산화막 경계에 따라 달라지므로 이 숫자를 제조 규격으로 쓰지 않습니다. 다음 글에서 마스크 무늬 자체를 어떻게 옮기는지 다룹니다.</p>
      <p className="leading-7"><em>산화막은 닫힌 곳을 막고 열린 곳을 통해 도핑 영역의 옆모양을 정합니다.</em></p>
    </div><PlanarProcessViz /><ExplainedFormula question="폭 100 µm 창 아래에서 양쪽으로 2 µm씩 더 퍼졌다면 표면 p형 폭은?" idea="중앙 창 폭에 왼쪽과 오른쪽의 가상 옆 확산 거리를 더합니다." formula={String.raw`W_p=W_m+2L_{\mathrm{lat}}`} annotatedFormula={String.raw`\underbrace{W_p}_{\text{p형 표면 폭}}=W_m+2L_{\mathrm{lat}}`} operations={[{expression:String.raw`W_m=100\,\mathrm{\mu m}`,annotation:"가정한 산화막 창 폭입니다."},{expression:String.raw`L_{\mathrm{lat}}=2\,\mathrm{\mu m}`,annotation:"가정한 한쪽 옆 확산입니다."},{expression:String.raw`W_p=104\,\mathrm{\mu m}`,annotation:"100+2+2 µm입니다."}]} terms={[{symbol:"Wp",name:"p형 표면 영역 폭",description:"가정한 단면에서 확산 뒤의 표면 폭입니다."},{symbol:"Wm",name:"산화막 창 폭",description:"가정한 100 µm입니다."},{symbol:"Llat",name:"옆 확산 거리",description:"가정한 한쪽 2 µm입니다."}]} assumptions={["단면이 좌우 대칭이고 표면의 옆 확산 거리를 일정한 2 µm로 단순화합니다.","이는 특허의 계측치나 실제 공정의 허용 오차가 아닙니다."]} interpretation="가정한 표면 p형 폭은 104 µm입니다. 옆 확산 수치는 실제 공정에서 별도로 확인해야 합니다." /><CitationBlock source="Hoerni, US Patent 3,025,589, PDF 3쪽(도 1–4 설명)·5쪽(청구항 5)" citeKey={2} href="https://patentimages.storage.googleapis.com/cc/fb/db/690d609db55af5/US3025589.pdf">원본은 산화막의 창으로 불순물을 확산시켜 영역의 옆 범위를 제한하고 접합이 산화막 아래에 닿도록 하는 과정을 설명합니다. 2 µm 옆 확산과 104 µm 폭은 설명용 가정입니다.</CitationBlock>
</section>

<section id="protect" data-teach-level="4" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">8. 80 µm 접촉 창을 열어 양쪽에 12 µm를 남깁니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert">
      <p className="leading-7">
            p형 확산 동안 열린 면에는 새 산화막이 생깁니다. 이를 전부 벗기면 표면까지 닿는 p-n 접합이 드러납니다. Hoerni 특허는 접합 위의 산화막을 남겨 오염과 접촉 과정의
            단락을 줄이는 구조를 제시했습니다. 전극이 닿아야 할 곳만 창을 다시 내고 그 아래의 p형 실리콘에 금속 접촉을 만듭니다. 다이오드 예에서는 다른 쪽 n형 접촉을 웨이퍼 밑면에
            둡니다. 특허의 별도 트랜지스터 도 10은 윗면의 여러 접촉을 보여 줍니다. 둘을 같은 단면이라고 섞지 않습니다.
          </p>
      <p className="leading-7">
            중앙에 폭 80 µm의 전극 창을 낸다는 가정에서 p형 표면 폭 104 µm의 양쪽 끝까지 남는 거리는 (104−80)/2=12 µm씩입니다. 이것은 완벽한 절연 간격이나 합격
            보증이 아닙니다. 마스크 정렬이 한쪽으로 치우치거나 접합 모양이 다르면 실제 최솟값은 줄어듭니다.
          </p>
      <p className="leading-7"><em>덮을 곳을 남기고 닿을 곳만 여는 순서가 접합의 표면을 지킵니다.</em></p>
    </div><ExplainedFormula question="80 µm 전극 창의 양끝에서 가상 p-n 경계까지 몇 µm가 남습니까?" idea="가운데 정렬되었다고 두고 전체 남는 폭을 양쪽에 똑같이 나눕니다." formula={String.raw`M=\frac{W_p-W_c}{2}`} annotatedFormula={String.raw`\underbrace{M}_{\text{한쪽 명목 거리}}=\frac{W_p-W_c}{2}`} operations={[{expression:String.raw`W_p-W_c=104-80=24\,\mathrm{\mu m}`,annotation:"p형 표면 폭에서 전극 창을 뺍니다."},{expression:String.raw`M=12\,\mathrm{\mu m}`,annotation:"가운데 정렬일 때 양쪽 각각입니다."}]} terms={[{symbol:"M",name:"한쪽 명목 거리",description:"전극 창 끝에서 가정한 p형 표면 끝까지입니다."},{symbol:"Wc",name:"전극 창 폭",description:"가정한 80 µm입니다."}]} assumptions={["전극 창은 p형 영역의 가운데에 정확히 정렬됩니다.","실제 마스크 정렬·확산 편차·접촉 손상은 제외한 기하학 계산입니다."]} interpretation="명목 12 µm는 접합 보호 설계의 출발 숫자일 뿐, 실물 허용 오차는 아닙니다." /><CitationBlock source="Hoerni, US Patent 3,025,589, 원본 3–4쪽(도 2–4·도 10)" citeKey={3} href="https://patentimages.storage.googleapis.com/cc/fb/db/690d609db55af5/US3025589.pdf">원본은 접합 위 막을 유지하고 필요한 접촉 자리만 여는 다이오드와 트랜지스터 예를 따로 그립니다. 80 µm 창과 12 µm 거리는 특허 도면의 비율을 측정한 값이 아닙니다.</CitationBlock>
</section>

<section id="source" data-teach-level="5" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">9. 원문의 남겨 둘 막을 가상 단면에서 찾습니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">Hoerni 특허의 청구항 1(e)는 새 창을 열면서 “while leaving permanently in place the coating”이라고 적습니다. 이어지는 대상은 실리콘 표면에 닿는 p–n 접합을 덮은 부분입니다. 이 조건은 원본 PDF 5쪽의 인쇄 열 번호 7에서 읽을 수 있습니다.</p><p className="leading-7">이 글의 단면에 적용하면 p형 표면은 가운데에서 좌우로 52 µm, 전극 창은 좌우로 40 µm까지입니다. 따라서 각 끝의 52−40=12 µm 구간과 표면 접합 위에 막이 남습니다. 식의 12 µm는 본문 기하에서 얻은 값이고 특허가 보증한 안전 거리가 아닙니다.</p><p className="leading-7">원본 PDF 3쪽의 다이오드 설명은 위쪽 p형과 아래쪽 n형에 접촉을 만듭니다. PDF 4쪽의 도 10 설명은 별도의 트랜지스터에서 위쪽 여러 접촉을 다룹니다. 하나의 도면처럼 합치지 않고 이번 두 영역 사례에는 다이오드 경로를 적용했습니다.</p></div><CitationBlock source="Hoerni US3025589, PDF 5쪽 청구항 1(e), 인쇄 열 7" citeKey={4} href="https://patentimages.storage.googleapis.com/cc/fb/db/690d609db55af5/US3025589.pdf#page=5">실제 원문의 새 창 개방과 표면 접합 덮개 보존을 가정한 104/80 µm 단면에 대응시킵니다.</CitationBlock>
</section>

<section id="alternatives" data-teach-level="6" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">10. 같은 단면의 폭과 정렬을 바꿔 검산합니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">옆으로 퍼지는 거리를 한쪽 5 µm라고 새로 가정하면 p형 표면 폭은 100+5+5=110 µm입니다. 중앙 80 µm 창을 유지하면 한쪽 거리는 (110−80)/2=15 µm입니다. 접촉 주변 거리는 커지지만 p형 영역 자체도 더 넓어지므로 옆 소자와의 간격까지 자동으로 좋아지는 것은 아닙니다.</p><p className="leading-7">처음의 104 µm p형 폭으로 돌아와 접촉 창만 100 µm로 넓히면 한쪽 거리는 (104−100)/2=2 µm입니다. 이 창이 가운데에서 오른쪽으로 3 µm 치우친다고 추가로 가정하면 오른쪽 남는 거리는 2−3=−1 µm입니다. 단순 기하에서 창이 경계를 1 µm 넘어갑니다.</p><p className="leading-7">첫 80 µm 창의 12 µm도 똑같이 정렬 오차와 확산 편차를 빼서 판단해야 합니다. 평균 폭이 맞는지와 가장 가까운 접합이 계속 덮이는지는 서로 다른 검사입니다.</p></div>
</section>

<section id="limits" data-teach-level="7" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">11. 원문의 구조를 현대 제조 전체로 확대하지 않습니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert">
      <p className="leading-7">
            Hoerni의 특허는 주로 확산으로 만든 다이오드·양극성 트랜지스터의 산화막 보호와 접촉을 다룹니다. 앞서 배운 MOSFET의 얇은 게이트 절연막이나 오늘날의 다층 배선·이온
            주입·미세 노광을 이 특허 하나의 공정 순서로 돌려 쓸 수 없습니다. 그래도 ‘막을 덮고 필요한 곳만 열고 그 자리에만 물질을 바꾸고 보호할 곳은 남긴다’는 순서를 볼 수
            있습니다.
          </p>
      <p className="leading-7">이 글의 100·2·80 µm는 공간 관계를 드러내기 위해 고른 수치입니다. 정확한 창 폭과 정렬 오차를 다룰 때는 빛으로 무늬를 옮기는 방법과 해상도를 함께 봐야 합니다. 다음 글이 그 경계를 맡습니다.</p>
      <p className="leading-7">산화막이 모든 원자를 모든 조건에서 똑같이 막는 것도 아닙니다. 원본 PDF 4쪽의 인쇄 열 6은 갈륨을 쓸 때의 산화막 마스크 한계를 따로 경고합니다. 따라서 필요한 영역만 바뀐다는 설명에는 불순물·막·열처리의 조합을 확인한다는 조건이 붙습니다.</p>
<p className="leading-7"><strong>읽고 나서 예측해 보세요.</strong> 100 µm 창보다 p형 폭이 왜 104 µm입니까? (답: 7절) 접합 위 막을 남기는 까닭은 무엇입니까? (답: 8·9절) 12 µm를 실제 제조 보증 거리라고 읽을 수 있습니까? (답: 8·10·11절)</p>
      <p className="leading-7"><Link to="/electronics/semiconductors/bands-and-doping#dopants">앞 글의 p형·n형 설명</Link>은 여기서 창 안의 도핑과 원래 웨이퍼의 접합으로 이어집니다.</p>
    </div>
</section>
</div>;
}

import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import PlanarProcessViz from "./wafer-and-planar-process/viz/PlanarProcessViz";

/** Invented cross-section geometry: 100 µm mask opening, 2 µm lateral spread each side, 80 µm centered contact. */
export default function WaferAndPlanarProcessArticle() {
  return <div className="space-y-16">
    <section id="overview" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">전기가 흐를 자리를 웨이퍼 위에서 어떻게 골라낼까요?</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
      <p className="text-lg leading-8">앞 글에서는 실리콘에 어떤 불순물을 넣느냐에 따라 p형과 n형이 된다는 것을 봤습니다. 그런데 웨이퍼 전체를 p형으로 바꾸면 한 소자의 필요한 접합을 만들 수 없습니다. 작은 영역만 열어 불순물을 들이고, 나머지 표면은 덮어 둬야 합니다.</p>
      <p className="leading-7">가상 n형 실리콘 웨이퍼 위에 절연성 산화막을 덮고 폭 100 µm 창을 냅니다. 그 창으로 p형 불순물을 들인 뒤, 전극은 중앙의 80 µm 창에만 닿게 합니다. 옆으로 2 µm씩 퍼진다는 단순 가정을 더하면 p형 표면 영역의 폭은 104 µm, 전극 창 끝에서 p-n 경계까지의 명목 거리는 양쪽 각각 12 µm입니다. 왜 접합 바로 위의 산화막을 남기는지 이 숫자로 따라가겠습니다.</p>
      <p className="leading-7"><em>한 장의 실리콘에서 들어갈 자리와 계속 보호할 자리를 따로 정하는 것이 핵심입니다.</em></p>
    </div></section>
    <section id="wafer" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">웨이퍼는 여러 소자를 한 번에 가공하는 바탕입니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
      <p className="leading-7"><strong>웨이퍼</strong>는 넓고 얇은 반도체 조각입니다. 산화막을 덮고 여러 창을 만들면 같은 공정을 여러 위치에 반복할 수 있습니다. 개별 소자의 경계는 나중에 절단할 수 있지만, 이 글에서 다루는 전기적 p-n 접합은 절단선이 아니라 실리콘 안의 서로 다른 도핑 영역 사이입니다. 두 종류의 ‘경계’를 섞으면 어느 면을 보호해야 하는지 놓칩니다.</p>
      <p className="leading-7">Hoerni의 1959년 출원 특허는 웨이퍼 위의 여러 다이오드 영역을 만들고 뒤에 분리할 수도 있다고 설명합니다. 특허의 주된 새 생각은 단순히 많이 자르는 일이 아니라, 확산 영역의 옆모양을 정하는 산화막을 접합 보호에도 계속 쓴다는 것입니다.</p>
      <p className="leading-7"><em>웨이퍼 위의 반복 공정은 여러 소자에 같은 무늬를 옮기는 출발점입니다.</em></p>
    </div><CitationBlock source="Jean A. Hoerni, US Patent 3,025,589, ‘Method of Manufacturing Semiconductor Devices’, 1959 출원·1962 등록, 원본 3쪽(도 1–4 설명)" citeKey={1} href="https://patentimages.storage.googleapis.com/cc/fb/db/690d609db55af5/US3025589.pdf">원본 3쪽은 실리콘 웨이퍼에 산화막을 덮고 여러 창을 낸 뒤 개별 다이오드를 분리하거나 웨이퍼 위에서 함께 가공할 수 있다고 설명합니다. 본문 100 µm 값은 특허의 공정 치수가 아닙니다.</CitationBlock></section>
    <section id="mask" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">산화막에 낸 창이 불순물의 입구를 정합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
      <p className="leading-7">실리콘 표면의 산화막에 창을 내면 그곳의 실리콘만 드러납니다. 가정한 폭 100 µm 창 밖은 덮여 있으므로, 이 단계에서 불순물을 실리콘 안으로 들이는 입구는 창의 위치로 제한됩니다. 열을 주며 p형 불순물이 퍼지는 <strong>확산</strong>을 하면 창 아래에 p형 영역이 생기고 원래 n형 실리콘과 만나는 곳에 p-n 접합이 생깁니다.</p>
      <p className="leading-7">확산은 아래로만 일어나지 않습니다. 옆으로도 퍼집니다. 계산을 쉽게 하려고 표면에서 창 양쪽으로 2 µm씩 더 퍼진다고 <strong>가정</strong>하면 p형 폭은 100+2+2=104 µm입니다. 실제 옆 확산은 온도·시간·재료 농도와 산화막 경계에 따라 달라지므로 이 숫자를 제조 규격으로 쓰지 않습니다. 다음 글에서 마스크 무늬 자체를 어떻게 옮기는지 다룹니다.</p>
      <p className="leading-7"><em>산화막은 닫힌 곳을 막고 열린 곳을 통해 도핑 영역의 옆모양을 정합니다.</em></p>
    </div><PlanarProcessViz /><ExplainedFormula question="폭 100 µm 창 아래에서 양쪽으로 2 µm씩 더 퍼졌다면 표면 p형 폭은?" idea="중앙 창 폭에 왼쪽과 오른쪽의 가상 옆 확산 거리를 더합니다." formula={String.raw`W_p=W_m+2L_{\mathrm{lat}}`} annotatedFormula={String.raw`\underbrace{W_p}_{\text{p형 표면 폭}}=W_m+2L_{\mathrm{lat}}`} operations={[{expression:String.raw`W_m=100\,\mathrm{\mu m}`,annotation:"가정한 산화막 창 폭입니다."},{expression:String.raw`L_{\mathrm{lat}}=2\,\mathrm{\mu m}`,annotation:"가정한 한쪽 옆 확산입니다."},{expression:String.raw`W_p=104\,\mathrm{\mu m}`,annotation:"100+2+2 µm입니다."}]} terms={[{symbol:"Wp",name:"p형 표면 영역 폭",description:"가정한 단면에서 확산 뒤의 표면 폭입니다."},{symbol:"Wm",name:"산화막 창 폭",description:"가정한 100 µm입니다."},{symbol:"Llat",name:"옆 확산 거리",description:"가정한 한쪽 2 µm입니다."}]} assumptions={["단면이 좌우 대칭이고 표면의 옆 확산 거리를 일정한 2 µm로 단순화합니다.","이는 특허의 계측치나 실제 공정의 허용 오차가 아닙니다."]} interpretation="가정한 표면 p형 폭은 104 µm입니다. 옆 확산 수치는 실제 공정에서 별도로 확인해야 합니다." /><CitationBlock source="Hoerni, US Patent 3,025,589, 원본 3–4쪽(도 1–4·청구항 5)" citeKey={2} href="https://patentimages.storage.googleapis.com/cc/fb/db/690d609db55af5/US3025589.pdf">원본은 산화막의 창으로 불순물을 확산시켜 영역의 옆 범위를 제한하고 접합이 산화막 아래에 닿도록 하는 과정을 설명합니다. 2 µm 옆 확산과 104 µm 폭은 설명용 가정입니다.</CitationBlock></section>
    <section id="protect" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">접합 위의 막을 남기고 전극 자리만 다시 엽니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
      <p className="leading-7">p형 확산 동안 열린 면에는 새 산화막이 생깁니다. 이를 전부 벗기면 표면까지 닿는 p-n 접합이 드러납니다. Hoerni 특허는 접합 위의 산화막을 남겨 오염과 접촉 과정의 단락을 줄이는 구조를 제시했습니다. 전극이 닿아야 할 곳만 창을 다시 내고, 그 아래의 p형 실리콘에 금속 접촉을 만듭니다. 다이오드 예에서는 다른 쪽 n형 접촉을 웨이퍼 밑면에 둡니다. 특허의 별도 트랜지스터 도 10은 윗면의 여러 접촉을 보여 줍니다. 둘을 같은 단면이라고 섞지 않습니다.</p>
      <p className="leading-7">중앙에 폭 80 µm의 전극 창을 낸다는 가정에서, p형 표면 폭 104 µm의 양쪽 끝까지 남는 거리는 (104−80)/2=12 µm씩입니다. 이것은 완벽한 절연 간격이나 합격 보증이 아닙니다. 마스크 정렬이 한쪽으로 치우치거나 접합 모양이 다르면 실제 최솟값은 줄어듭니다.</p>
      <p className="leading-7"><em>덮을 곳을 남기고 닿을 곳만 여는 순서가 접합의 표면을 지킵니다.</em></p>
    </div><ExplainedFormula question="80 µm 전극 창의 양끝에서 가상 p-n 경계까지 몇 µm가 남습니까?" idea="가운데 정렬되었다고 두고 전체 남는 폭을 양쪽에 똑같이 나눕니다." formula={String.raw`M=\frac{W_p-W_c}{2}`} annotatedFormula={String.raw`\underbrace{M}_{\text{한쪽 명목 거리}}=\frac{W_p-W_c}{2}`} operations={[{expression:String.raw`W_p-W_c=104-80=24\,\mathrm{\mu m}`,annotation:"p형 표면 폭에서 전극 창을 뺍니다."},{expression:String.raw`M=12\,\mathrm{\mu m}`,annotation:"가운데 정렬일 때 양쪽 각각입니다."}]} terms={[{symbol:"M",name:"한쪽 명목 거리",description:"전극 창 끝에서 가정한 p형 표면 끝까지입니다."},{symbol:"Wc",name:"전극 창 폭",description:"가정한 80 µm입니다."}]} assumptions={["전극 창은 p형 영역의 가운데에 정확히 정렬됩니다.","실제 마스크 정렬·확산 편차·접촉 손상은 제외한 기하학 계산입니다."]} interpretation="명목 12 µm는 접합 보호 설계의 출발 숫자일 뿐, 실물 허용 오차는 아닙니다." /><CitationBlock source="Hoerni, US Patent 3,025,589, 원본 3–4쪽(도 2–4·도 10)" citeKey={3} href="https://patentimages.storage.googleapis.com/cc/fb/db/690d609db55af5/US3025589.pdf">원본은 접합 위 막을 유지하고 필요한 접촉 자리만 여는 다이오드와 트랜지스터 예를 따로 그립니다. 80 µm 창과 12 µm 거리는 특허 도면의 비율을 측정한 값이 아닙니다.</CitationBlock></section>
    <section id="limits" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">이 첫 평면 공정은 오늘의 칩 제조 전체가 아닙니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
      <p className="leading-7">Hoerni의 특허는 주로 확산으로 만든 다이오드·양극성 트랜지스터의 산화막 보호와 접촉을 다룹니다. 앞서 배운 MOSFET의 얇은 게이트 절연막이나 오늘날의 다층 배선·이온 주입·미세 노광을 이 특허 하나의 공정 순서로 돌려 쓸 수 없습니다. 그래도 ‘막을 덮고, 필요한 곳만 열고, 그 자리에만 물질을 바꾸고, 보호할 곳은 남긴다’는 순서를 볼 수 있습니다.</p>
      <p className="leading-7">이 글의 100·2·80 µm는 공간 관계를 드러내기 위해 고른 수치입니다. 정확한 창 폭과 정렬 오차를 다룰 때는 빛으로 무늬를 옮기는 방법과 해상도를 함께 봐야 합니다. 다음 글이 그 경계를 맡습니다.</p>
      <p className="leading-7"><strong>읽고 나서 예측해 보세요.</strong> 100 µm 창보다 p형 폭이 왜 104 µm입니까? (답: 3절) 접합 위 막을 남기는 까닭은 무엇입니까? (답: 4절) 12 µm를 실제 제조 보증 거리라고 읽을 수 있습니까? (답: 4·5절)</p>
      <p className="leading-7"><Link to="/electronics/semiconductors/bands-and-doping#dopants">앞 글의 p형·n형 설명</Link>은 여기서 창 안의 도핑과 원래 웨이퍼의 접합으로 이어집니다.</p>
    </div></section>
  </div>;
}

import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import { ImageTransformViz } from "../data-augmentation/viz/ModernAugmentationViz";

export default function ImageAugmentationTransformsArticle() {
  return <div className="space-y-16">
    <section id="overview" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">Image augmentation에는 위치를 바꾸는 변환과 값을 바꾸는 변환이 있습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p className="text-lg leading-8">Rotation·crop·translation은 <strong>어디에 있는가</strong>를 바꿉니다. Brightness·contrast·hue·noise는 같은 pixel 위치의 <strong>값이 어떻게 보이는가</strong>를 바꿉니다. 두 family는 target을 갱신하는 방식과 실패 조건이 다릅니다.</p></div><TermBreakdown title="Image transform의 네 계약" items={[
      {term:"Affine annotation transform",description:"Image point에 적용한 matrix와 translation을 box corner·mask·keypoint에도 똑같이 적용합니다.",example:"오른쪽 12px 이동이면 모든 x coordinate에도 +12."},
      {term:"Visibility rule",description:"Transform·crop·clip 뒤 남은 annotation 면적으로 keep·drop·ignore를 판정합니다.",boundary:"원래 object가 있었다는 이유만으로 거의 보이지 않는 box를 유지하지 않습니다."},
      {term:"Photometric augmentation",description:"Camera·조명 변화로 생길 pixel-value 변동 범위를 sampling합니다.",boundary:"색 자체가 label signal이면 hue change를 invariance로 둘 수 없습니다."},
      {term:"Normalization",description:"Random sample 생성이 아니라 model이 기대하는 고정 channel 좌표로 바꾸는 preprocessing입니다."},
    ]}/><ImageTransformViz/><ContentBoundary article="image-augmentation-transforms"/></section>

    <section id="visibility" className="scroll-mt-20"><h2 className="mb-5 text-2xl font-bold">Box는 두 점이 아니라 네 corner를 옮기고 visibility를 다시 계산합니다</h2><ExplainedFormula question="Affine transform과 crop 뒤 annotation을 유지할지 어떻게 계산하나요?" idea={<p>네 corner에 같은 map을 적용해 새 box를 만들고 canvas와 교차시킨 뒤, 변환된 box 중 보이는 면적 비율을 계산합니다.</p>} formula={String.raw`p_j'=Ap_j+t,\quad B'=\operatorname{bbox}(\{p_j'\}_{j=1}^4),\quad r_{\rm vis}=\operatorname{area}(B'\cap C)/\operatorname{area}(B')`} annotatedFormula={String.raw`\begin{aligned}q_j&=\underbrace{Ap_j}_{\text{회전·scale·shear}}\\p_j'&=\underbrace{q_j+t}_{\text{crop·translation 추가}}\\B'&=\underbrace{\operatorname{bbox}(\{p_j'\}_{j=1}^{4})}_{\text{네 corner의 min·max}}\\B_{\rm clip}&=\underbrace{B'\cap C}_{\text{canvas 안으로 clip}}\\a_{\rm visible}&=\underbrace{\operatorname{area}(B_{\rm clip})}_{\text{보이는 면적}}\\a_{\rm object}&=\underbrace{\operatorname{area}(B')}_{\text{변환 뒤 전체 면적}}\\r_{\rm vis}&=\underbrace{a_{\rm visible}/a_{\rm object}}_{\text{visible ratio}}\end{aligned}`} operations={[
      {expression:String.raw`Ap_j+t`,annotation:["corner를 같은 coordinate map으로 옮겨","image와 annotation을 동기화"]},
      {expression:String.raw`\operatorname{bbox}(\{p_j'\})`,annotation:["네 transformed corner의 min/max를 찾아","새 axis-aligned box 생성"]},
      {expression:String.raw`B'\cap C`,annotation:["canvas와 교차시켜","화면 밖 좌표를 제거"]},
      {expression:String.raw`\operatorname{area}(B_{\rm clip})/\operatorname{area}(B')`,annotation:["남은 면적을 전체 면적으로 나눠","keep·drop 판단용 visible ratio 계산"]},
    ]} terms={[
      {symbol:"A",name:"Linear map",description:"Rotation·scale·shear를 조합한 2×2 matrix입니다."},{symbol:"t",name:"Translation",description:"Canvas 이동과 crop origin을 나타내는 2D vector입니다."},{symbol:"C",name:"Output canvas",description:"최종 image가 표현할 수 있는 좌표 영역입니다."},{symbol:String.raw`r_{\rm vis}`,name:"Visible ratio",description:"변환된 object 중 canvas 안에 남은 면적 비율입니다."},
    ]} assumptions={["Image·box·mask·keypoint가 같은 A와 t를 공유합니다.","Coordinate convention과 boundary inclusion 규칙이 고정되어 있습니다.","Keep threshold와 tiny-object rule을 policy revision에 기록합니다."]} interpretation="Rotation 뒤 box는 원래 두 corner만 옮기면 틀릴 수 있습니다. 네 corner→bbox→clip→visibility 순서를 fixture로 검증합니다."/></section>

    <section id="photometric" className="scroll-mt-20"><h2 className="mb-5 text-2xl font-bold">Photometric range는 sensor variation에서 시작하고 label signal 앞에서 멈춥니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>낮과 밤, exposure, white balance, compression noise처럼 실제 camera path에서 생기는 범위를 측정합니다. 피부 병변 색·신호등 상태·위성 spectral band처럼 색이 target이면 그 축을 강하게 흔들지 않습니다. Random erasing도 작은 object 전체를 가릴 수 있으므로 object-size slice를 봅니다.</p></div></section>

    <section id="normalization" className="scroll-mt-20"><h2 className="mb-5 text-2xl font-bold">Normalization은 마지막 random transform이 아니라 첫 layer의 좌표 계약입니다</h2><ExplainedFormula question="Channel 값을 왜 center로 빼고 scale로 나누며, 순서는 왜 고정해야 하나요?" idea={<p>Photometric transform이 raw pixel 단위에서 끝난 뒤, pretrained weight가 기대하는 channel origin과 scale로 좌표를 옮깁니다.</p>} formula={String.raw`x'_{c,h,w}=(x_{c,h,w}-\mu_c)/\sigma_c`} annotatedFormula={String.raw`\begin{aligned}d_{c,h,w}&=\underbrace{x_{c,h,w}-\mu_c}_{\text{channel 기준점을 0으로 이동}}\\x'_{c,h,w}&=\underbrace{d_{c,h,w}/\sigma_c}_{\text{고정 channel scale로 환산}}\end{aligned}`} operations={[
      {expression:String.raw`x_{c,h,w}-\mu_c`,annotation:["channel 기준값을 빼서","model 좌표의 origin을 맞춤"]},
      {expression:String.raw`(x-\mu_c)/\sigma_c`,annotation:["남은 차이를 고정 scale로 나눠","train·validation·serving의 단위를 일치"]},
    ]} terms={[
      {symbol:String.raw`x_{c,h,w}`,name:"Pixel channel value",description:"Color transform이 끝난 뒤 c channel의 값입니다."},{symbol:String.raw`\mu_c`,name:"Channel center",description:"Weight·training contract가 요구하는 기준값입니다."},{symbol:String.raw`\sigma_c`,name:"Channel scale",description:"0이 아닌 channel별 환산 scale입니다."},{symbol:String.raw`x'_{c,h,w}`,name:"Model input coordinate",description:"첫 layer가 실제로 받는 값입니다."},
    ]} assumptions={["x·μ·σ가 모두 0–1 또는 0–255 중 같은 단위를 씁니다.","Training·validation·serving이 같은 normalization revision을 씁니다.","Random photometric transform과 deterministic normalization의 순서를 고정합니다."]} interpretation="Normalization은 sample 수를 늘리지 않습니다. ImageNet mean·std도 특정 weight의 input contract이지 모든 sensor의 보편 상수가 아닙니다."/><div id="paper-albumentations" className="not-prose mt-8 scroll-mt-24"><CitationBlock type="paper" citeKey={1} source="Buslaev et al. — Albumentations" href="https://doi.org/10.3390/info11020125">Image와 여러 annotation type에 transform을 조합하는 library와 benchmark를 설명합니다. API가 존재한다는 사실이 현재 task의 label preservation·range·순서를 보장하지는 않습니다.</CitationBlock></div></section>
  </div>;
}

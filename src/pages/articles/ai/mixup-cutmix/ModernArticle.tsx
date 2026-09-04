import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import { SampleMixingViz } from "../data-augmentation/viz/ModernAugmentationViz";

export default function MixupCutMixArticle() {
  return <div className="space-y-16">
    <section id="overview" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">Mixup·CutMix·Mosaic은 여러 sample을 한 training pair로 조합합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p className="text-lg leading-8">Flip이나 color jitter는 한 sample의 identity를 유지합니다. Sample mixing은 두 개 이상의 input을 합치므로 <strong>target도 같은 조합 규칙으로 다시 만들어야</strong> 합니다. Input만 섞고 one-hot label 하나를 남기면 model에게 보이는 증거와 정답이 충돌합니다.</p></div><TermBreakdown title="세 mixing 방법을 먼저 분리" items={[
      {term:"Mixup",description:"두 tensor 전체와 두 target distribution을 같은 coefficient로 선형 보간합니다."},
      {term:"CutMix",description:"한 image의 region을 다른 image patch로 바꾸고 실제 visible area로 class target을 섞습니다."},
      {term:"Mosaic",description:"여러 image를 tile에 resize·offset하고 각 annotation을 합쳐 한 canvas를 만듭니다.",boundary:"Area target 하나로 box·mask·keypoint까지 대신할 수 없습니다."},
    ]}/><SampleMixingViz/><ContentBoundary article="mixup-cutmix"/></section>

    <section id="mixup" className="scroll-mt-20"><h2 className="mb-5 text-2xl font-bold">Mixup은 input interpolation과 target interpolation을 같은 λ로 묶습니다</h2><ExplainedFormula question="λ를 뽑아 두 sample을 섞을 때 각 곱셈과 덧셈은 무엇을 뜻하나요?" idea={<p>λ는 sample i의 몫이고 1−λ는 sample j의 몫입니다. 같은 두 weight를 input과 target 양쪽에 사용합니다.</p>} formula={String.raw`\lambda\sim\operatorname{Beta}(\alpha,\alpha),\quad \tilde x=\lambda x_i+(1-\lambda)x_j,\quad \tilde y=\lambda y_i+(1-\lambda)y_j`} annotatedFormula={String.raw`\begin{aligned}\lambda&\sim\underbrace{\operatorname{Beta}(\alpha,\alpha)}_{\text{mixing 비율 sampling}}\\x_i^\star&=\underbrace{\lambda x_i}_{\text{i input 몫}}\\x_j^\star&=\underbrace{(1-\lambda)x_j}_{\text{j input 몫}}\\\widetilde x&=\underbrace{x_i^\star+x_j^\star}_{\text{두 input 몫 합산}}\\y_i^\star&=\underbrace{\lambda y_i}_{\text{i target mass}}\\y_j^\star&=\underbrace{(1-\lambda)y_j}_{\text{j target mass}}\\\widetilde y&=\underbrace{y_i^\star+y_j^\star}_{\text{두 target mass 합산}}\end{aligned}`} operations={[
      {expression:String.raw`\operatorname{Beta}(\alpha,\alpha)`,annotation:["0과 1 사이 비율을 뽑아","source dominance를 training마다 변경"]},
      {expression:String.raw`\lambda x_i+(1-\lambda)x_j`,annotation:["두 input을 complementary weight로 더해","한 mixed tensor 생성"]},
      {expression:String.raw`\lambda y_i+(1-\lambda)y_j`,annotation:["동일 weight를 class mass에 적용해","보이는 input 비율과 soft target을 일치"]},
    ]} terms={[
      {symbol:String.raw`\lambda`,name:"Mixing coefficient",description:"Sample i가 차지하는 비율이며 sample j는 1−λ입니다."},{symbol:String.raw`\alpha`,name:"Beta shape",description:"λ가 양 끝 또는 0.5 근처에 모이는 정도를 정합니다."},{symbol:String.raw`\widetilde x`,name:"Mixed input",description:"같은 shape·scale의 두 input을 보간한 tensor입니다."},{symbol:String.raw`\widetilde y`,name:"Soft target",description:"합이 1인 두 class distribution의 convex combination입니다."},
    ]} assumptions={["두 input이 같은 shape와 의미 있는 linear scale을 사용합니다.","Loss가 soft target distribution을 올바르게 처리합니다.","λ와 source IDs를 pair receipt에 저장합니다."]} interpretation="λ=.7이면 input과 target 모두 i:j가 70:30입니다. Discrete·causal feature에서는 이 보간이 현실적인 sample이 아닐 수 있습니다."/><div id="paper-mixup" className="not-prose mt-8 scroll-mt-24"><CitationBlock type="paper" citeKey={1} source="Zhang et al. — mixup" href="https://arxiv.org/abs/1710.09412">Input과 label의 convex combination으로 sample 사이의 선형 behavior를 유도합니다. 논문 domain의 실험 근거이며 모든 feature space의 interpolation이 현실적이라는 주장은 아닙니다.</CitationBlock></div></section>

    <section id="cutmix" className="scroll-mt-20"><h2 className="mb-5 text-2xl font-bold">CutMix는 nominal λ가 아니라 clip 뒤 실제 mask 면적을 사용합니다</h2><ExplainedFormula question="Patch를 붙인 뒤 target weight를 왜 mask 면적으로 다시 계산하나요?" idea={<p>
            patch가 canvas 경계에서 잘리면 처음 뽑은 크기와 실제 visible pixel 수가 달라집니다. 그래서 sample i의 target mass로는 최종 mask M의
            평균을 씁니다.
          </p>} formula={String.raw`\tilde x=M\odot x_i+(1-M)\odot x_j,\quad \lambda_{\rm area}=\frac1{HW}\sum_{h,w}M_{h,w},\quad \tilde y=\lambda_{\rm area}y_i+(1-\lambda_{\rm area})y_j`} annotatedFormula={String.raw`\begin{aligned}x_i^\star&=\underbrace{M\odot x_i}_{\text{mask가 1인 i pixel}}\\x_j^\star&=\underbrace{(1-M)\odot x_j}_{\text{나머지 j pixel}}\\\widetilde x&=\underbrace{x_i^\star+x_j^\star}_{\text{두 region 합산}}\\n_i&=\underbrace{\sum_{h,w}M_{h,w}}_{\text{i의 visible pixel 수}}\\n_{\rm all}&=\underbrace{HW}_{\text{전체 canvas pixel 수}}\\\lambda_{\rm area}&=\underbrace{n_i/n_{\rm all}}_{\text{i의 visible area ratio}}\\y_i^\star&=\underbrace{\lambda_{\rm area}y_i}_{\text{i target mass}}\\y_j^\star&=\underbrace{(1-\lambda_{\rm area})y_j}_{\text{j target mass}}\\\widetilde y&=\underbrace{y_i^\star+y_j^\star}_{\text{두 target mass 합산}}\end{aligned}`} operations={[
      {expression:String.raw`M\odot x_i`,annotation:["mask와 image를 위치별 곱해","i에서 가져올 region만 남김"]},
      {expression:String.raw`(1-M)\odot x_j`,annotation:["complement mask로 j region을 골라","두 image를 겹치지 않게 결합"]},
      {expression:String.raw`\sum M/(HW)`,annotation:["clip 뒤 mask pixel을 세어 canvas 크기로 나눠","실제 visible area ratio 계산"]},
      {expression:String.raw`\lambda_{\rm area}y_i+(1-\lambda_{\rm area})y_j`,annotation:["면적 비율로 두 target mass를 합쳐","classification soft target 생성"]},
    ]} terms={[
      {symbol:"M",name:"Binary spatial mask",description:"각 pixel을 i와 j 중 어디서 가져올지 정합니다."},{symbol:"H,W",name:"Canvas size",description:"최종 classification image의 높이와 너비입니다."},{symbol:String.raw`\lambda_{\rm area}`,name:"Visible area ratio",description:"Clip이 끝난 최종 mask에서 sample i가 차지한 비율입니다."},{symbol:String.raw`\odot`,name:"Element-wise product",description:"Mask와 image를 같은 spatial coordinate에서 곱합니다."},
    ]} assumptions={["Image classification에서 area가 class evidence 비율을 근사합니다.","Detection·segmentation annotation은 별도 target map으로 갱신합니다.","Mask와 source target revision을 저장합니다."]} interpretation="작은 object가 patch 하나에 몰리면 면적과 semantic evidence가 다를 수 있습니다. Area target은 classification 근사이지 보편 target rule이 아닙니다."/><div id="paper-cutmix" className="not-prose mt-8 scroll-mt-24"><CitationBlock type="paper" citeKey={2} source="Yun et al. — CutMix" href="https://openaccess.thecvf.com/content_ICCV_2019/html/Yun_CutMix_Regularization_Strategy_to_Train_Strong_Classifiers_With_Localizable_Features_ICCV_2019_paper.html">Image region을 다른 sample로 바꾸고 visible area에 비례한 classification target을 사용합니다. Detection·segmentation target까지 면적 하나로 처리해도 된다는 뜻은 아닙니다.</CitationBlock></div></section>

    <section id="mosaic" className="scroll-mt-20"><h2 className="mb-5 text-2xl font-bold">Mosaic은 네 image를 붙이는 그림보다 annotation composition이 본체입니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>
            각 tile마다 resize matrix와 offset이 다릅니다. 그래서 box·mask·keypoint를 tile 좌표로 옮기고 canvas에서 clip한 뒤 visible
            ratio와 minimum size를 통과한 annotation만 union합니다. 여기서 source ID·tile map·clip 결과가 빠지면 잘못된 object를 재현할
            수 없습니다.
          </p><p>Mixup·CutMix·Mosaic을 한 번에 켜지 않습니다. Soft-target composition, object loss, calibration이 서로 영향을 주므로 한 family씩 paired ablation합니다.</p></div></section>
  </div>;
}

import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import { AugmentationEvaluationViz } from "../data-augmentation/viz/ModernAugmentationViz";

export default function AugmentationEvaluationArticle() {
  return <div className="space-y-16">
    <section id="overview" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">Augmentation 평가는 transform 이름이 아니라 실행 가능한 policy artifact에서 시작합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p className="text-lg leading-8">“강한 augmentation 사용”은 재현 가능한 설명이 아닙니다. Operation·parameter 범위·확률·순서·input unit·target map·seed를 한 artifact로 고정해야 어떤 training distribution을 비교했는지 알 수 있습니다.</p></div><TermBreakdown title="평가 전에 고정할 네 산출물" items={[
      {term:"Policy artifact",description:"Transform family·range·probability·order·revision을 담은 실행 config입니다."},
      {term:"Clean validation",description:"Training randomness를 넣지 않은 원본 preprocessing 기준선입니다."},
      {term:"Robustness slice",description:"예상 deployment shift를 고정 fixture로 만든 별도 평가 집합입니다."},
      {term:"Release gate",description:"Paired gain·class slice·calibration·latency·rollback 조건을 모두 확인하는 결정 규칙입니다."},
    ]}/><AugmentationEvaluationViz/><ContentBoundary article="augmentation-evaluation"/></section>

    <section id="clean-robust" className="scroll-mt-20"><h2 className="mb-5 text-2xl font-bold">Clean 성능과 robustness 성능은 서로 다른 질문에 답합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>Stochastic augmented validation을 매번 새로 뽑으면 model quality와 transform 난이도·seed가 섞입니다. Clean validation은 원래 task 품질을, fixed low-light·blur·crop slice는 특정 shift에서의 robustness를 답합니다. 두 metric은 별도 column과 confidence interval로 보고합니다.</p></div></section>

    <section id="tta" className="scroll-mt-20"><h2 className="mb-5 text-2xl font-bold">TTA는 training augmentation이 아니라 prediction을 원래 좌표로 되돌리는 inference ensemble입니다</h2><ExplainedFormula question="여러 augmented view의 spatial prediction을 왜 바로 평균하지 않고 inverse map을 적용하나요?" idea={<p>각 view에서 나온 mask·box·heatmap은 서로 다른 좌표에 있습니다. 먼저 각 output을 원래 input 좌표로 되돌린 뒤 같은 위치끼리 평균합니다.</p>} formula={String.raw`\bar p(x)=\frac1K\sum_{k=1}^{K}T_k^{-1}\!\left(f_\theta(T_k(x))\right)`} annotatedFormula={String.raw`\begin{aligned}x_k&=\underbrace{T_k(x)}_{\text{k번째 label-preserving view 생성}}\\p_k&=\underbrace{f_\theta(x_k)}_{\text{각 view 좌표에서 prediction 계산}}\\p_k^{\rm base}&=\underbrace{T_k^{-1}(p_k)}_{\text{spatial output을 원래 좌표로 복원}}\\\bar p(x)&=\underbrace{\frac1K\sum_{k=1}^{K}p_k^{\rm base}}_{\text{같은 좌표의 K개 prediction을 평균}}\end{aligned}`} operations={[
      {expression:String.raw`T_k(x)`,annotation:["고정된 k번째 view를 만들어","추가 inference input 생성"]},
      {expression:String.raw`f_\theta(T_k(x))`,annotation:["각 view를 같은 model에 넣어","view 좌표의 prediction 생성"]},
      {expression:String.raw`T_k^{-1}(p_k)`,annotation:["flip·crop·scale을 역으로 적용해","모든 spatial output을 base 좌표에 정렬"]},
      {expression:String.raw`\frac1K\sum_k`,annotation:["정렬된 prediction을 더해 view 수로 나눠","ensemble probability 계산"]},
    ]} terms={[
      {symbol:String.raw`T_k`,name:"TTA view transform",description:"Release artifact에 고정한 k번째 inference transform입니다."},{symbol:String.raw`T_k^{-1}`,name:"Output inverse map",description:"Box·mask·heatmap을 원래 coordinate system으로 되돌립니다."},{symbol:"K",name:"View count",description:"Base view를 포함해 실행하는 inference 수입니다."},{symbol:String.raw`\bar p(x)`,name:"Aligned ensemble prediction",description:"같은 coordinate와 class order에서 결합한 최종 prediction입니다."},
    ]} assumptions={["모든 TTA view가 target 의미를 보존합니다.","Spatial transform에 정의된 output inverse map이 있습니다.","추가 K회 inference의 latency·memory가 production budget에 포함됩니다."]} interpretation="Classification probability는 좌표 역변환이 없을 수 있지만 box·mask·keypoint는 정렬 없이 평균할 수 없습니다. TTA는 공짜 data augmentation이 아니라 비용 있는 ensemble입니다."/></section>

    <section id="release" className="scroll-mt-20"><h2 className="mb-5 text-2xl font-bold">한 family씩 paired ablation하고 receipt로 release합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>같은 split·seed·training budget에서 baseline과 한 transform family만 다른 run을 짝지어 clean, robustness, calibration, class slice, p95 latency를 비교합니다. 실패 sample에는 source ID·policy revision·sampled parameter·seed를 남겨 재생합니다. 한 metric이 좋아도 forbidden slice나 latency budget이 깨지면 rollout하지 않습니다.</p></div><div id="paper-augmix" className="not-prose mt-8 scroll-mt-24"><CitationBlock type="paper" citeKey={1} source="Hendrycks et al. — AugMix" href="https://arxiv.org/abs/1912.02781">여러 augmentation chain을 혼합하고 consistency loss를 사용해 image corruption robustness를 평가합니다. 논문 corruption benchmark의 결과가 임의 domain shift나 production TTA 비용을 보장하지는 않습니다.</CitationBlock></div></section>
  </div>;
}

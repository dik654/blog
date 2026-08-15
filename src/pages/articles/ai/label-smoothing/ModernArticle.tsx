import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import { LabelSmoothingMechanismViz } from "../regularization-practice/viz/ModernRegularizationViz";

export default function LabelSmoothingArticle() {
  return <div className="space-y-16">
    <section id="overview" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Label smoothing은 정답을 버리는 것이 아니라 target distribution을 다시 배분합니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert"><p className="text-lg leading-8">먼저 one-hot target과 uniform distribution을 따로 봅니다. 그 다음 두 distribution을 ε로 섞고, 마지막에 cross-entropy와 다른 soft-target 기법을 연결합니다.</p></div>
      <TermBreakdown title="Target을 이루는 네 용어" items={[
        { term: "Class count K", description: "Model logit과 target probability가 가지는 class 축의 길이입니다.", example: "K=4입니다." },
        { term: "One-hot target y", description: "정답 class만 1이고 나머지는 0인 distribution입니다.", example: "두 번째 class면 (0,1,0,0)입니다." },
        { term: "Uniform prior u", description: "모든 class에 1/K씩 같은 질량을 둔 distribution입니다.", example: "(.25,.25,.25,.25)입니다.", boundary: "실제 annotator confusion model은 아닙니다." },
        { term: "Smoothing strength ε", description: "One-hot 질량 중 uniform prior로 옮길 비율입니다.", example: "ε=.1이면 hard target 90%, uniform 10%입니다." },
      ]} />
      <LabelSmoothingMechanismViz />
      <ContentBoundary article="label-smoothing" />
    </section>
    <section id="target" className="scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">Class별로 두 distribution의 질량을 더합니다</h2>
      <ExplainedFormula question="왜 target class는 .925이고 나머지는 .025가 될까요?" idea={<p>One-hot을 (1−ε)만큼 남기고 uniform distribution을 ε만큼 더합니다. Uniform의 1/K가 모든 class에 들어가므로 target class도 ε/K를 함께 받습니다.</p>} formula={String.raw`\widetilde y=(1-\epsilon)y+\epsilon\mathbf1/K`} annotatedFormula={String.raw`\begin{aligned}u_k&=\underbrace{1/K}_{\text{class별 균등 몫}}\\y_{\mathrm{hard},k}&=\underbrace{(1-\epsilon)y_k}_{\text{원래 정답을 유지}}\\y_{\mathrm{uniform},k}&=\underbrace{\epsilon u_k}_{\text{균등 몫을 추가}}\\\widetilde y_k&=\underbrace{y_{\mathrm{hard},k}+y_{\mathrm{uniform},k}}_{\text{두 질량을 class별 결합}}\end{aligned}`} operations={[
        { expression: String.raw`(1-\epsilon)y_k`, annotation: ["원래 target distribution에서", "hard-target 비율을 보존"] },
        { expression: String.raw`\epsilon/K`, annotation: ["옮길 총 smoothing 질량을", "K개 class에 균등 분배"] },
        { expression: String.raw`(1-\epsilon)y_k+\epsilon/K`, annotation: ["class별 두 몫을 더해", "최종 probability target 생성"] },
      ]} terms={[
        { symbol: "K", name: "Class count", description: "Target probability vector의 길이입니다." },
        { symbol: "\\epsilon", name: "Smoothing strength", description: "Uniform prior로 옮기는 총 probability mass입니다." },
        { symbol: "ỹ", name: "Smoothed target", description: "합이 1인 최종 class probability vector입니다." },
      ]} assumptions={["Uniform label smoothing 정의입니다.", "0≤ε<1이고 y의 합이 1입니다."]} interpretation="K=4,ε=.1이면 target class는 .9+.025=.925, 나머지는 각각 .025이고 합은 1입니다." />
    </section>
    <section id="loss" className="scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">Cross-entropy는 모든 class의 target 질량으로 log probability를 가중합니다</h2>
      <ExplainedFormula question="Soft target은 loss에서 어떻게 사용되나요?" idea={<p>Model logit을 softmax probability로 바꾸고, 각 class의 log probability에 smoothed target 질량을 곱해 더합니다.</p>} formula={String.raw`\mathcal L=-\sum_k\widetilde y_k\log p_k`} annotatedFormula={String.raw`\begin{aligned}p_k&=\underbrace{\frac{e^{z_k}}{\sum_j e^{z_j}}}_{\text{logit을 합이 1인 model probability로 변환}}\\\mathcal L&=-\underbrace{\sum_{k=1}^{K}\widetilde y_k\log p_k}_{\text{target 질량으로 class별 surprise를 가중 평균}}\end{aligned}`} operations={[
        { expression: String.raw`e^{z_k}/\sum_j e^{z_j}`, annotation: ["상대 logit을 양수로 바꾸고", "전체 합으로 나눠 probability 생성"] },
        { expression: String.raw`-\sum_k\widetilde y_k\log p_k`, annotation: ["target이 준 중요도로", "각 class의 negative log probability를 누적"] },
      ]} terms={[
        { symbol: "z_k", name: "Class logit", description: "Softmax 전 model score입니다." },
        { symbol: "p_k", name: "Model probability", description: "Softmax 뒤 class k에 할당한 probability입니다." },
        { symbol: "L", name: "Soft-target cross-entropy", description: "Smoothed target과 model distribution의 mismatch입니다." },
      ]} assumptions={["Target probability의 합이 1이고 음수가 없습니다.", "Ignore index·class weight·reduction은 별도 API 계약입니다."]} interpretation="Off-target class에도 작은 gradient가 생깁니다. 이것이 calibration 개선을 자동 보장하지는 않습니다." />
    </section>
    <section id="composition" className="scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">Mixup과 함께 쓰면 이름이 아니라 최종 target을 계산합니다</h2>
      <ExplainedFormula question="Mixup 뒤 smoothing을 적용하면 probability mass는 어디로 가나요?" idea={<p>먼저 두 one-hot target을 λ로 섞고, 그 결과 전체를 다시 (1−ε)만큼 유지한 뒤 uniform ε/K를 더합니다.</p>} formula={String.raw`\widetilde y=(1-\epsilon)(\lambda y_a+(1-\lambda)y_b)+\epsilon\mathbf1/K`} annotatedFormula={String.raw`\begin{aligned}y_{\mathrm{mix}}&=\underbrace{\lambda y_a+(1-\lambda)y_b}_{\text{두 sample target을 mix}}\\y_{\mathrm{kept}}&=\underbrace{(1-\epsilon)y_{\mathrm{mix}}}_{\text{mixed target을 유지}}\\y_{\mathrm{uniform}}&=\underbrace{\epsilon\mathbf1/K}_{\text{모든 class에 분배}}\\\widetilde y&=\underbrace{y_{\mathrm{kept}}+y_{\mathrm{uniform}}}_{\text{최종 soft target 결합}}\end{aligned}`} operations={[
        { expression: String.raw`\lambda y_a+(1-\lambda)y_b`, annotation: ["두 sample target을", "input mixing 비율과 같은 비율로 결합"] },
        { expression: String.raw`(1-\epsilon)y_{\mathrm{mix}}+\epsilon\mathbf1/K`, annotation: ["이미 soft한 target에도", "uniform smoothing을 한 번 더 적용"] },
      ]} terms={[
        { symbol: "λ", name: "Mixup coefficient", description: "두 sample과 두 target을 섞는 같은 비율입니다." },
        { symbol: "y_a,y_b", name: "Source targets", description: "Mixup에 참여한 두 class distributions입니다." },
        { symbol: "ỹ", name: "Composed target", description: "두 regularizer를 순서대로 적용한 최종 distribution입니다." },
      ]} assumptions={["Mixup 뒤 label smoothing을 적용하는 순서입니다.", "Framework 구현과 class weighting 순서를 확인합니다."]} interpretation="K=4,λ=.7,ε=.1이고 c1/c2를 섞으면 (.655,.295,.025,.025)입니다. Entropy와 class slice를 단독·조합 ablation으로 비교합니다." />
      <div id="paper-label-smoothing" className="not-prose mt-8 scroll-mt-24"><CitationBlock source="Szegedy et al. — Rethinking the Inception Architecture" citeKey={1} type="paper" href="https://arxiv.org/abs/1512.00567">ImageNet classification recipe에서 uniform label smoothing을 제시합니다. 모든 class imbalance·distillation·calibration 문제를 해결한다는 근거는 아닙니다.</CitationBlock></div>
    </section>
  </div>;
}

import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import { WeightDecayMechanismViz } from "../regularization-practice/viz/ModernRegularizationViz";

export default function WeightDecayArticle() {
  return <div className="space-y-16">
    <section id="overview" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Weight decay는 parameter를 줄이는 update 경로입니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert"><p className="text-lg leading-8">먼저 current weight, data gradient, learning rate, decay coefficient를 따로 봅니다. Plain SGD에서는 L2 penalty와 direct shrink가 같은 식으로 정리되지만, adaptive optimizer에서는 두 경로가 달라집니다.</p></div>
      <TermBreakdown title="Update를 이루는 네 값" items={[
        { term: "Weight w", description: "이번 step 직전의 trainable parameter입니다.", example: "한 scalar coordinate w=10을 추적합니다." },
        { term: "Data gradient g", description: "Task loss가 weight를 어느 방향으로 바꾸려는지 나타냅니다.", example: "g=3이면 positive direction을 줄이는 step입니다." },
        { term: "Learning rate η", description: "한 update에서 gradient와 decay가 움직일 시간 간격입니다.", example: "η=.1입니다.", boundary: "Schedule이 바뀌면 누적 decay도 바뀝니다." },
        { term: "Decay coefficient λ", description: "현재 weight에 비례해 줄이는 강도입니다.", example: "λ=.02이면 step shrink factor는 1−.002입니다." },
      ]} />
      <WeightDecayMechanismViz />
      <ContentBoundary article="weight-decay" />
    </section>
    <section id="sgd-equivalence" className="scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">Plain SGD에서 L2 gradient는 multiplicative shrink로 정리됩니다</h2>
      <ExplainedFormula question="왜 quadratic penalty가 weight를 일정 비율 줄이나요?" idea={<p>L2 penalty를 미분하면 λw입니다. Scalar learning rate의 SGD 식에 넣고 current weight 항끼리 묶으면 (1−ηλ)w가 됩니다.</p>} formula={String.raw`w^+=(1-\eta\lambda)w-\eta g`} annotatedFormula={String.raw`\begin{aligned}g_{\mathrm{L2}}&=\underbrace{\lambda w}_{\text{원점 방향 당김}}\\g_{\mathrm{total}}&=\underbrace{g+g_{\mathrm{L2}}}_{\text{task와 penalty 결합}}\\w^+&=\underbrace{(1-\eta\lambda)w}_{\text{weight 비율 축소}}\\&\quad-\underbrace{\eta g}_{\text{task gradient step}}\end{aligned}`} operations={[
        { expression: String.raw`\nabla_w\frac\lambda2\lVert w\rVert^2=\lambda w`, annotation: ["quadratic 크기 penalty를 미분해", "현재 weight 방향의 당김을 만듦"] },
        { expression: String.raw`(1-\eta\lambda)w`, annotation: ["현재 weight 항을 묶어", "step별 multiplicative shrink로 표현"] },
      ]} terms={[
        { symbol: "g", name: "Data gradient", description: "Ldata만 미분한 task update 방향입니다." },
        { symbol: "η", name: "Learning rate", description: "Gradient와 decay를 step displacement로 바꾸는 scale입니다." },
        { symbol: "λ", name: "Decay coefficient", description: "Weight 크기 penalty의 강도입니다." },
      ]} assumptions={["Plain SGD의 scalar learning rate를 사용합니다.", "Momentum·adaptive preconditioning 전의 등가입니다."]} interpretation="w=10,η=.1,λ=.02,g=3이면 .998×10−.3=9.68입니다. Data gradient가 0이어도 9.98로 줄어듭니다." />
    </section>
    <section id="adamw" className="scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">AdamW는 task direction만 adaptive하게 만들고 shrink는 밖에 둡니다</h2>
      <ExplainedFormula question="왜 Adam의 L2와 AdamW direct decay가 다를까요?" idea={<p>λw를 Adam gradient 안에 넣으면 moment와 coordinate별 denominator가 penalty까지 바꿉니다. AdamW는 task gradient로 만든 adaptive direction과 동일 group의 direct shrink를 마지막에 합칩니다.</p>} formula={String.raw`w^+=(1-\eta\lambda)w-\eta\widehat m/(\sqrt{\widehat v}+\epsilon)`} annotatedFormula={String.raw`\begin{aligned}w_{\mathrm{decay}}&=\underbrace{(1-\eta\lambda)w}_{\text{direct shrink}}\\d_{\mathrm{task}}&=\underbrace{\frac{\widehat m(g)}{\sqrt{\widehat v(g)}+\epsilon}}_{\text{task 방향만 조정}}\\w^+&=\underbrace{w_{\mathrm{decay}}-\eta d_{\mathrm{task}}}_{\text{두 경로를 마지막에 결합}}\end{aligned}`} operations={[
        { expression: String.raw`(1-\eta\lambda)w`, annotation: ["모든 coordinate의 current weight에", "group 안에서 같은 shrink factor 적용"] },
        { expression: String.raw`\widehat m(g)/(\sqrt{\widehat v(g)}+\epsilon)`, annotation: ["task gradient의 방향과 scale만", "moment history로 precondition"] },
      ]} terms={[
        { symbol: "m̂", name: "Bias-corrected first moment", description: "Data gradient의 signed moving average입니다." },
        { symbol: "v̂", name: "Bias-corrected second moment", description: "Data gradient magnitude의 coordinate별 scale입니다." },
        { symbol: "ε", name: "Numerical stabilizer", description: "작은 denominator의 division을 안정화합니다." },
      ]} assumptions={["Decoupled AdamW convention입니다.", "Library별 λ·η 표기와 fused implementation을 확인합니다."]} interpretation="AdamW가 λ를 tuning-free로 만들지는 않습니다. LR schedule과 update 수가 누적 shrink를 바꾸므로 recipe 전체를 기록합니다." />
    </section>
    <section id="parameter-groups" className="scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">마지막에는 parameter가 정확히 한 group에 속하는지 검사합니다</h2>
      <ExplainedFormula question="Decay와 no-decay 분류가 누락·중복 없이 닫혔는지 어떻게 확인할까요?" idea={<p>두 집합을 합치면 모든 trainable parameter가 되어야 하고, 동시에 속하는 parameter는 없어야 합니다.</p>} formula={String.raw`D\cup N=\Theta_{\mathrm{train}},\quad D\cap N=\varnothing`} annotatedFormula={String.raw`\begin{aligned}\underbrace{D\cup N}_{\text{두 group을 합침}}&=\underbrace{\Theta_{\mathrm{train}}}_{\text{누락 없는 전체}}\\\underbrace{D\cap N}_{\text{동시 소속 검사}}&=\underbrace{\varnothing}_{\text{중복 없음}}\end{aligned}`} operations={[
        { expression: String.raw`D\cup N`, annotation: ["두 group의 모든 member를 합쳐", "전체 trainable coverage를 확인"] },
        { expression: String.raw`D\cap N`, annotation: ["두 group에 동시에 든 member를 찾아", "중복 적용이 없음을 확인"] },
      ]} terms={[
        { symbol: "D", name: "Decay group", description: "Direct weight decay를 적용하는 parameter 집합입니다." },
        { symbol: "N", name: "No-decay group", description: "Bias·normalization scale 등 recipe가 제외한 집합입니다." },
        { symbol: "Θtrain", name: "All trainable parameters", description: "requires-grad가 켜진 전체 parameter identity 집합입니다." },
      ]} assumptions={["Parameter object identity로 비교합니다.", "Resume 뒤 optimizer group ordering과 state mapping도 검증합니다."]} interpretation="이름 substring만으로 분류하면 custom module이 빠질 수 있습니다. Type·shape·explicit policy와 exact coverage assertion을 함께 둡니다." />
      <div id="paper-adamw" className="not-prose mt-8 scroll-mt-24"><CitationBlock source="Loshchilov & Hutter — Decoupled Weight Decay Regularization" citeKey={1} type="paper" href="https://arxiv.org/abs/1711.05101">Adaptive gradient update와 direct weight shrinkage를 분리합니다. 특정 λ나 no-decay group이 모든 architecture에 최적이라는 주장은 아닙니다.</CitationBlock></div>
    </section>
  </div>;
}

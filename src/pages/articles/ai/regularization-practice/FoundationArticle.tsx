import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import { GeneralizationDiagnosisViz } from "./viz/ModernRegularizationViz";

export default function RegularizationDiagnosisArticle() {
  return <div className="space-y-16">
    <section id="overview" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Regularization보다 먼저, 두 오차가 무엇을 뜻하는지 확인합니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert"><p className="text-lg leading-8">Train loss와 validation loss가 벌어졌다는 관측은 <strong>과적합 확정 판정</strong>이 아닙니다. 같은 model state를 같은 채점법으로 평가했는지 확인한 뒤, data leakage·pipeline mismatch·label noise·distribution shift를 하나씩 배제해야 합니다.</p></div>
      <TermBreakdown title="먼저 분리할 네 용어" description="한 줄에 하나씩 정의한 뒤에만 gap을 조합합니다." items={[
        { term: "Training empirical risk", description: "Parameter update에 사용한 examples에서 계산한 평균 loss입니다.", example: "Update 5000의 train NLL은 0.18입니다.", boundary: "Mini-batch loss 한 번과 전체 train split 평균은 다릅니다." },
        { term: "Validation empirical risk", description: "Parameter update에 쓰지 않은 validation examples에서 같은 loss로 계산한 평균입니다.", example: "같은 checkpoint의 validation NLL은 0.31입니다.", boundary: "Validation으로 hyperparameter를 골랐다면 최종 test 역할은 아닙니다." },
        { term: "Observed gap", description: "Validation 평균에서 training 평균을 뺀 관측 차이입니다.", example: "0.31−0.18=0.13입니다.", boundary: "Population generalization error 자체가 아니라 유한 split의 추정값입니다." },
        { term: "Regularization", description: "모델이 학습할 자유도나 선택 경로를 의도적으로 제한하는 개입입니다.", example: "Activation, parameter update, trajectory, target 중 한 축을 바꿉니다.", boundary: "Leakage나 잘못된 preprocessing을 가리는 치료제가 아닙니다." },
      ]} />
      <GeneralizationDiagnosisViz />
      <ContentBoundary article="regularization-practice" />
    </section>
    <section id="gap" className="scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">Gap은 같은 시점·같은 loss의 두 평균을 빼서 만듭니다</h2>
      <ExplainedFormula question="관측 gap은 어떤 두 값을 왜 빼서 만들까요?" idea={<p>
            Validation에서 보지 못한 data의 오차를 봅니다. 여기서 이미 fitting에 사용한 train 오차를 기준선으로 제거합니다. 두 값의 차이가 시간에 따라 커지는지
            추적합니다.
          </p>} formula={String.raw`G_t=\widehat R_{\mathrm{val}}(t)-\widehat R_{\mathrm{tr}}(t)`} annotatedFormula={String.raw`\begin{aligned}\widehat R_{\mathrm{tr}}(t)&=\underbrace{\frac{1}{n_{\mathrm{tr}}}\sum_{i\in\mathrm{tr}}\ell_i(\theta_t)}_{\text{학습 data에서 같은 loss를 평균}}\\[4pt]\widehat R_{\mathrm{val}}(t)&=\underbrace{\frac{1}{n_{\mathrm{val}}}\sum_{i\in\mathrm{val}}\ell_i(\theta_t)}_{\text{미사용 data에서 같은 loss를 평균}}\\[4pt]G_t&=\underbrace{\widehat R_{\mathrm{val}}(t)-\widehat R_{\mathrm{tr}}(t)}_{\text{미사용 data에서 늘어난 오차만 분리}}\end{aligned}`} operations={[
        { expression: String.raw`\frac1{n}\sum_i\ell_i`, annotation: ["sample 수가 다른 split도 비교하도록", "sample loss를 평균"] },
        { expression: String.raw`\widehat R_{\mathrm{val}}-\widehat R_{\mathrm{tr}}`, annotation: ["validation의 절대 오차에서", "train에 이미 남은 오차를 제거"] },
      ]} terms={[
        { symbol: "θ_t", name: "Checkpoint", description: "t번째 optimizer update 뒤의 동일 model state입니다." },
        { symbol: "ℓ_i", name: "Sample loss", description: "두 split에 동일한 target·reduction으로 적용한 오차입니다." },
        { symbol: "G_t", name: "Observed gap", description: "현재 split에서 관측한 validation–train 차이입니다." },
      ]} assumptions={["Train과 validation examples가 겹치지 않습니다.", "Preprocessing·loss·denominator가 같습니다.", "Finite validation uncertainty를 별도로 추정합니다."]} interpretation="Train=.18, validation=.31이면 G=.13입니다. 하지만 train=.80, validation=.82의 작은 gap은 좋은 일반화가 아니라 underfitting일 수 있습니다." />
    </section>
    <section id="audit" className="scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">원인 감사가 끝나기 전에는 regularizer를 고르지 않습니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          네 원인을 배제하고 training error도 낮은 채 gap만 계속 커진다면 그
          패턴이 곧 <strong>overfitting</strong>입니다. Overfitting은 model이
          train data의 noise·특수성까지 외워 training error는 계속 줄지만
          unseen data error는 오히려 커지는 현상이며, 아래 네 원인이 모두
          배제된 뒤에만 이 이름을 붙일 수 있습니다.
        </p>
      </div>
      <TermBreakdown title="Gap을 만든 다른 원인" items={[
        { term: "Split leakage", description: "같은 entity·time window의 정보가 train과 validation에 동시에 들어갑니다.", example: "동일 사용자의 연속 event가 두 split에 섞였습니다." },
        { term: "Pipeline mismatch", description: "두 split의 transform·label mapping·loss denominator가 다릅니다.", example: "Validation만 다른 normalization 통계를 사용합니다." },
        { term: "Label noise", description: "Validation label 오류가 loss를 높이지만 model capacity 문제는 아닙니다.", example: "Source별 error sample을 직접 audit합니다." },
        { term: "Distribution shift", description: "Validation population이 train과 다른 생성 과정을 가집니다.", example: "지역·기간·device slice별 gap을 나눠 봅니다." },
      ]} />
      <div className="prose prose-neutral max-w-none dark:prose-invert mt-6">
        <p>
          이 네 가지를 배제한 뒤 남은 gap이 바로 regularization이 다루는 대상입니다. Regularization은 leakage나 잘못된 pipeline을 고치지 않습니다.
          Model이 training data를 과도하게 외우지 못하도록 자유도를 제한해 overfitting 자체를 줄입니다.
        </p>
      </div>
    </section>
    <section id="ablation" className="scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">한 번에 한 축만 바꿔 이득과 부작용을 함께 비교합니다</h2>
      <ExplainedFormula question="Regularizer의 효과를 baseline과 공정하게 어떻게 비교할까요?" idea={<p>
            같은 seed마다 regularized run에서 baseline metric을 빼 paired change를 만듭니다. 평균 gain뿐 아니라 train fit·worst
            slice·calibration·cost를 함께 봅니다.
          </p>} formula={String.raw`\Delta_s=M_s^{\mathrm{reg}}-M_s^{\mathrm{base}}`} annotatedFormula={String.raw`\begin{aligned}\Delta_s&=\underbrace{M_s^{\mathrm{reg}}-M_s^{\mathrm{base}}}_{\text{같은 seed의 공통 흔들림을 상쇄}}\\[4pt]\overline\Delta&=\underbrace{\frac1S\sum_{s=1}^{S}\Delta_s}_{\text{seed별 변화의 평균 효과}}\end{aligned}`} operations={[
        { expression: String.raw`M_s^{\mathrm{reg}}-M_s^{\mathrm{base}}`, annotation: ["동일 seed 쌍끼리 빼서", "initialization 차이를 덜 섞음"] },
        { expression: String.raw`\frac1S\sum_s\Delta_s`, annotation: ["한 seed의 우연에 의존하지 않도록", "paired 변화량을 평균"] },
      ]} terms={[
        { symbol: "s", name: "Seed pair", description: "같은 initialization·data order를 공유하는 baseline/후보 쌍입니다." },
        { symbol: "M", name: "Selection metric", description: "Direction과 unit이 고정된 validation metric입니다." },
        { symbol: "Δ̄", name: "Mean paired effect", description: "S개 seed에서 regularizer가 만든 평균 변화입니다." },
      ]} assumptions={["Split·updates·optimizer·search budget이 동일합니다.", "Untouched test는 선택이 끝날 때까지 열지 않습니다."]} interpretation="Validation 평균이 좋아져도 train fit 붕괴, worst-slice 악화, latency 증가가 크면 채택하지 않습니다." />
      <div id="paper-regularization-selection" className="not-prose mt-8 scroll-mt-24"><CitationBlock source="Goodfellow, Bengio & Courville — Deep Learning, Chapter 7" citeKey={1} type="paper" href="https://www.deeplearningbook.org/contents/regularization.html">Regularization을 학습 알고리즘에 더하는 제약과 penalty의 넓은 계보로 읽습니다. 특정 기법이 모든 architecture에서 유리하다는 보편 순위를 주장하지 않습니다.</CitationBlock></div>
    </section>
  </div>;
}

import ExplainedFormula from "@/components/ui/explained-formula";
import DomainShiftViz from "./viz/DomainShiftViz";

export default function DomainShift() {
  return (
    <section id="domain-shift" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Domain shift는 어떤 확률 관계가 달라졌는지에 따라 대응이 달라집니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Source와 target embedding plot이 떨어져 있다는 사실만으로 adaptation을
          고를 수는 없습니다. Sensor·style처럼 input 빈도 <code>P(x)</code>가
          달라진 covariate shift, class 비율 <code>P(y)</code>가 달라진 label shift,
          같은 input의 정답 관계 <code>P(y|x)</code>가 달라진 concept shift는
          필요한 data와 보정 방법이 서로 다릅니다.
        </p>
      </div>
      <ExplainedFormula
        question="Source와 target의 joint distribution 차이를 어떤 세 질문으로 분해할까?"
        idea={<>P(x,y)=P(y|x)P(x)로 읽으면 input 빈도와 label rule을 분리할 수 있고, Bayes rule을 함께 보면 label prior 변화도 별도 가정으로 다룰 수 있습니다.</>}
        formula={String.raw`\begin{aligned}
          &\text{covariate shift}\\[-2pt]
          &P_s(x)\ne P_t(x),\\[-2pt]
          &P_s(y\mid x)=P_t(y\mid x),\\[4pt]
          &\text{label shift}\\[-2pt]
          &P_s(y)\ne P_t(y),\\[-2pt]
          &P_s(x\mid y)=P_t(x\mid y),\\[4pt]
          &\text{concept shift}\\[-2pt]
          &P_s(y\mid x)\ne P_t(y\mid x).
        \end{aligned}`}
        terms={[
          { symbol: "P_s,P_t", name: "source·target distribution", description: "Pretraining/학습 환경과 실제 deployment 환경의 확률 분포입니다." },
          { symbol: "P(x)", name: "input marginal", description: "Label을 무시한 sensor·style·language·device input의 빈도입니다." },
          { symbol: "P(y)", name: "label prior", description: "각 class 또는 outcome이 나타나는 비율입니다." },
          { symbol: "P(y|x)", name: "label mechanism", description: "같은 input x에서 target y가 정해지는 조건부 관계입니다." },
        ]}
        assumptions={["세 shift 정의는 진단용 이상화이며 현실에서는 여러 변화가 동시에 일어날 수 있습니다.", "Label shift 보정은 class-conditional input P(x|y)가 안정적이라는 강한 가정이 필요합니다.", "Target labels가 전혀 없으면 concept shift를 직접 검증하기 어렵습니다."]}
        interpretation="Input만 가깝게 만드는 representation alignment는 P(y|x)가 다른 concept shift를 해결하지 못하고 오히려 서로 다른 class를 섞을 수 있습니다."
      />
      <div className="not-prose my-8"><DomainShiftViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>가장 단순한 target validation부터 시작합니다</h3>
        <p>
          시간·지역·device처럼 실제 deployment 축으로 holdout을 만들고 fixed·partial·
          full baseline을 비교합니다. Preprocessing과 normalization mismatch를 먼저
          고친 뒤에도 부족하고 unlabeled target data가 있다면 domain-adaptive 또는
          task-adaptive continued pretraining을 시험합니다. General-domain capability를
          유지해야 하면 source regression set도 함께 평가합니다.
        </p>
        <div id="paper-dapt" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
          <p className="text-xs font-bold text-primary">논문 읽기 · Don’t Stop Pretraining</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Gururangan 등은 RoBERTa를 biomedical·computer science·news·reviews의 unlabeled corpus에서 계속 pretraining하는 DAPT와 task corpus의 TAPT를 네 domain·여덟 classification task에서 비교했습니다. 이 결과는 continued pretraining의 조건부 근거이며 모든 modality·domain에서 gain을 보장하지 않습니다.</p>
          <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://aclanthology.org/2020.acl-main.740/" target="_blank" rel="noreferrer">DAPT·TAPT의 data와 실험 범위 보기</a>
        </div>
        <h3>Representation alignment에도 label 보존 가정이 필요합니다</h3>
        <p>
          DANN은 source task label을 맞히면서 source와 target domain을 구분하기
          어려운 representation을 학습합니다. 그러나 domain을 지우는 feature가
          target label에도 필요한 정보라면 negative transfer가 생길 수 있습니다.
          Pseudo-label self-training 역시 confidence·class coverage·error amplification을
          추적하고 labeled target holdout에서 adaptation 전후를 비교합니다.
        </p>
        <div id="paper-dann" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
          <p className="text-xs font-bold text-primary">논문 읽기 · Domain-Adversarial Training</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">DANN은 labeled source와 unlabeled target을 사용해 source task에는 discriminative하면서 domain classifier에는 indistinguishable한 feature를 gradient reversal로 학습합니다. 논문의 sentiment·image classification·person re-identification 조건을 넘어 class-conditional alignment가 보장된다고 해석하면 안 됩니다.</p>
          <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://www.jmlr.org/papers/v17/15-239.html" target="_blank" rel="noreferrer">Gradient reversal objective와 benchmark 범위 보기</a>
        </div>
      </div>
    </section>
  );
}

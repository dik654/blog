import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import TrainingLoopViz from "./TrainingLoopViz";

const DLB = "https://www.deeplearningbook.org/contents/ml.html";
const AUTODIFF = "https://jmlr.org/papers/v18/17-468.html";

export default function SupervisedLearningLoopArticle() {
  return (
    <article className="space-y-16">
      <section id="overview" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">00 · 한 쌍부터</p><h2 className="mt-2 text-2xl font-bold">Example은 input x와 target y의 역할을 묶은 한 건이다</h2></header>
        <Term term="Input feature" shape="x" description="모델이 prediction을 만들 때 실제로 받는 관측값입니다." example="고양이 분류에서는 사진의 pixel tensor입니다." boundary="정답 label이나 미래 정보가 input에 섞이면 leakage가 됩니다." />
        <Term term="Target" shape="y" description="Prediction이 맞았는지 loss가 비교할 기준입니다." example="사진의 정답 class인 ‘고양이’입니다." boundary="Target이 항상 사람이 붙인 label인 것은 아닙니다. Self-supervised 학습은 input에서 target을 구성하기도 합니다." />
        <Term term="Parameterized model" shape="fθ" description="입력 x와 조절 가능한 숫자 θ를 받아 prediction을 만드는 함수입니다." example="ŷ=fθ(x)에서 θ는 weight와 bias입니다." boundary="Learning rate·batch size 같은 hyperparameter는 보통 gradient가 직접 고치는 θ가 아닙니다." />
      </section>

      <section id="tensor-batch" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">01 · 형태를 묶기</p><h2 className="mt-2 text-2xl font-bold">Tensor는 축의 뜻을 가진 숫자 배열이고 batch는 example 축이다</h2></header>
        <p>RGB 사진 한 장의 shape를 C×H×W로 정했다면 32장을 묶은 input은 B×C×H×W=32×3×224×224가 됩니다.</p>
        <ul className="space-y-3 pl-0">
          <li className="list-none border-l border-sky-500 pl-4"><strong>B · batch:</strong> 서로 다른 example의 개수</li>
          <li className="list-none border-l border-violet-500 pl-4"><strong>C · channel:</strong> 한 위치에 저장한 feature 종류</li>
          <li className="list-none border-l border-emerald-500 pl-4"><strong>H·W · spatial:</strong> 사진 안의 세로·가로 위치</li>
        </ul>
        <p className="text-sm text-muted-foreground">
            축 순서는 framework contract에 따라 달라질 수 있습니다. 숫자 32가 보인다고 자동으로 batch라고 단정하지 않습니다.
          </p>
        <TrainingLoopViz />
      </section>

      <section id="training-step" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">02 · 처음으로 조합</p><h2 className="mt-2 text-2xl font-bold">Forward·loss·backward·update가 한 training step을 이룬다</h2></header>
        <ol className="space-y-4 pl-0">
          <Step number="1" title="Forward pass" detail="현재 θ로 prediction과 backward에 필요한 중간값을 만듭니다." />
          <Step number="2" title="Loss" detail="Prediction과 target의 차이를 scalar objective로 모읍니다." />
          <Step number="3" title="Backward" detail="Loss가 각 parameter에 얼마나 민감한지 gradient를 계산합니다." />
          <Step number="4" title="Optimizer update" detail="Gradient와 optimizer state를 사용해 다음 θ를 정합니다." />
        </ol>
        <ExplainedFormula
          question="한 batch의 오차가 parameter update로 이어지는 이유는 무엇일까요?"
          idea={<>각 example의 loss를 같은 기준으로 평균한 뒤, 그 평균이 가장 빠르게 증가하는 gradient의 반대 방향으로 parameter를 조금 이동합니다.</>}
          formula={String.raw`\hat y_i=f_\theta(x_i),\quad \mathcal L_B=\frac{1}{|B|}\sum_{i\in B}\ell(\hat y_i,y_i),\quad \theta_{t+1}=\theta_t-\eta\nabla_\theta\mathcal L_B`}
          annotatedFormula={String.raw`\begin{aligned}\hat y_i&=\underbrace{f_\theta(x_i)}_{\substack{\text{현재 parameter로}\text{prediction 생성}}}\\[4pt]\mathcal L_B&=\underbrace{\frac{1}{|B|}\sum_{i\in B}\ell(\hat y_i,y_i)}_{\substack{\text{example 오차를 모아}\text{batch 평균 생성}}}\\[4pt]\theta_{t+1}&=\underbrace{\theta_t-\eta\nabla_\theta\mathcal L_B}_{\substack{\text{loss가 줄어드는 쪽으로}\text{parameter 이동}}}\end{aligned}`}
          operations={[
            { expression: String.raw`f_\theta(x_i)`, annotation: ["같은 model을", "i번째 input에 적용"] },
            { expression: String.raw`\frac{1}{|B|}\sum_{i\in B}\ell_i`, annotation: ["example별 오차를 합하고", "batch 크기로 평균"] },
            { expression: String.raw`-\eta\nabla_\theta\mathcal L_B`, annotation: ["증가 방향의 반대로", "learning-rate만큼 이동"] },
          ]}
          terms={[
            { symbol: "x_i,y_i", name: "Example pair", description: "i번째 input과 target입니다." },
            { symbol: String.raw`f_\theta`, name: "Parameterized model", description: "모든 batch row가 공유하는 현재 model입니다." },
            { symbol: String.raw`\ell,\mathcal L_B`, name: "Example loss와 batch objective", description: "개별 오차와 그 평균입니다." },
            { symbol: String.raw`\nabla_\theta\mathcal L_B`, name: "Gradient", description: "Parameter별 local sensitivity입니다." },
            { symbol: String.raw`\eta`, name: "Learning rate", description: "한 update의 이동 크기를 조절하는 hyperparameter입니다." },
          ]}
          assumptions={["기본 gradient descent를 보이는 식이며 AdamW는 추가 state와 update 규칙을 사용합니다.", "Loss 감소가 새로운 data의 성능 향상을 자동으로 뜻하지 않습니다."]}
          interpretation="Backpropagation은 gradient를 계산하고 optimizer는 그 gradient로 parameter를 바꿉니다. 두 책임을 한 단어로 합치지 않습니다."
        />
      </section>

      <section id="inference" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">03 · 반복 밖의 경계</p><h2 className="mt-2 text-2xl font-bold">Inference는 parameter를 고정하고 forward만 사용한다</h2></header>
        <div className="grid gap-4 md:grid-cols-2">
          <Compare title="Training" lines={["input + target", "forward + saved intermediates", "loss + backward", "optimizer가 θ 변경"]} />
          <Compare title="Inference" lines={["새 input", "forward", "prediction", "θ는 고정"]} />
        </div>
        <p>
            없는 것은 parameter 갱신이지 runtime state가 아닙니다. 생성 model은 KV cache를 만들 수 있고 batch·latency·memory 제약도
            남습니다.
          </p>
        <p>다음 단계에서 학습용 data와 선택·보고용 data를 섞지 않는 <a className="font-semibold text-primary underline" href="/ai/train-validation-test">Train·validation·test 경계</a>를 봅니다.</p>
        <div id="paper-supervised-learning"><CitationBlock source="Deep Learning Book · Machine Learning Basics" citeKey={1} href={DLB}><Evidence problem="Supervised learning의 input·target·model·empirical objective 역할 구분" contribution="Learning algorithm과 generalization을 공통 표기로 정리" assumptions="명시된 data-generating process와 loss·model family" scope="교과서의 supervised learning 기본 정의" notClaim="특정 architecture나 optimizer의 우월성 보장이 아님" /></CitationBlock></div>
        <div id="paper-autodiff-survey"><CitationBlock source="Automatic Differentiation in Machine Learning: a Survey" citeKey={2} href={AUTODIFF}><Evidence problem="Derivative 계산과 optimization update를 구분" contribution="Forward·reverse accumulation과 computational graph 비용을 정리" assumptions="Primitive derivative와 추적 가능한 program" scope="Autodiff 계산 원리와 implementation taxonomy" notClaim="Optimizer 수렴이나 generalization을 보장하지 않음" /></CitationBlock></div>
        <ContentBoundary article="supervised-learning-loop" />
      </section>
    </article>
  );
}

function Term({ term, shape, description, example, boundary }: { term: string; shape: string; description: string; example: string; boundary: string }) { return <div className="grid gap-3 border-l border-primary/70 pl-5 sm:grid-cols-[7rem_1fr]"><div><p className="text-xs font-bold text-primary">용어</p><p className="mt-1 font-bold">{term}</p><p className="mt-2 font-mono text-lg font-black">{shape}</p></div><div><p className="leading-7">{description}</p><p className="mt-2 text-sm text-muted-foreground"><strong className="text-foreground">예:</strong> {example}</p><p className="mt-2 text-sm text-muted-foreground"><strong className="text-foreground">경계:</strong> {boundary}</p></div></div>; }
function Step({ number, title, detail }: { number: string; title: string; detail: string }) { return <li className="grid list-none grid-cols-[2rem_1fr] gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-full border border-primary font-mono text-xs font-black">{number}</span><div><p className="font-bold">{title}</p><p className="mt-1 text-sm leading-6 text-muted-foreground">{detail}</p></div></li>; }
function Compare({ title, lines }: { title: string; lines: string[] }) { return <div className="border border-border p-5"><p className="font-bold text-primary">{title}</p><div className="mt-4 space-y-2">{lines.map((line,index)=><div key={line} className="flex items-center gap-3 text-sm"><span className="font-mono text-xs text-muted-foreground">{index+1}</span><span>{line}</span></div>)}</div></div>; }
function Evidence({ problem, contribution, assumptions, scope, notClaim }: { problem: string; contribution: string; assumptions: string; scope: string; notClaim: string }) { return <div className="space-y-2"><p><strong>문제:</strong> {problem}</p><p><strong>핵심 아이디어:</strong> {contribution}</p><p><strong>중요 가정:</strong> {assumptions}</p><p><strong>근거 범위:</strong> {scope}</p><p><strong>일반화 금지:</strong> {notClaim}</p></div>; }

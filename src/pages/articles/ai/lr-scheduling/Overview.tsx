import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ExplainedFormula from "@/components/ui/explained-formula";
import OverviewViz from "./viz/OverviewViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Scheduler는 학습률 목록이 아니라 optimizer update에 붙인 시간 함수입니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-lg leading-8">
          모델은 mini-batch 하나를 읽을 때마다 바로 좋아지는 것이 아니라, 계산한
          gradient를 모아 optimizer가 parameter를 실제로 바꿀 때 한 번 전진합니다.
          Learning rate는 그 이동의 크기를 조절하고 scheduler는 <strong>몇 번째
          optimizer update인가</strong>에 따라 learning rate를 바꾸는 규칙입니다.
          따라서 먼저 update clock과 전체 budget을 고정하지 않으면 같은 cosine이나
          warmup이라는 이름도 서로 다른 실험을 뜻하게 됩니다.
        </p>
        <p>
          이 글에서는 constant LR을 기준선으로 놓고, 정해진 시점에 낮추는
          step·exponential, 남은 budget에 맞춰 부드럽게 줄이는 cosine, 한 run에서
          올렸다 내리는 OneCycle, 시작 구간의 큰 update를 늦추는 warmup을 차례로
          비교합니다. <Link to="/ai/optimizers">optimizer 글</Link>은 SGD·momentum·Adam이
          이동 방향을 만드는 방법을, <Link to="/ai/training-pipeline#loop">학습 파이프라인 글</Link>은
          micro-batch·gradient accumulation·world size가 update clock이 되는 과정을
          각각 맡습니다.
        </p>
      </div>
      <ContentBoundary article="lr-scheduling" />
      <ExplainedFormula
        question="Learning rate는 optimizer가 만든 방향을 parameter 이동으로 어떻게 바꿀까?"
        idea={<>Optimizer는 현재 gradient와 momentum·moment 같은 state를 이용해 방향 u<sub>t</sub>를 만듭니다. Scheduler가 돌려주는 η<sub>t</sub>는 이 방향 전체에 곱해지는 step size입니다.</>}
        formula={String.raw`\begin{aligned}\theta_{t+1}&=\theta_t+\Delta\theta_t,\\\Delta\theta_t&=-\eta_t u_t.\end{aligned}`}
        terms={[
          { symbol: "θ_t", name: "current parameters", description: "t번째 optimizer update 직전의 model parameter vector입니다." },
          { symbol: "u_t", name: "optimizer direction", description: "SGD gradient 또는 momentum·adaptive scaling을 반영한 실제 이동 방향입니다." },
          { symbol: "η_t", name: "scheduled learning rate", description: "Update t에서 optimizer direction에 곱하는 양의 scale입니다." },
          { symbol: "Δθ_t", name: "parameter displacement", description: "Update 전후 parameter의 실제 차이이며 LR 효과를 확인할 때 직접 측정할 수 있습니다." },
        ]}
        assumptions={["ηt의 의미는 optimizer와 parameter group마다 다를 수 있으므로 optimizer·group 설정을 함께 기록합니다.", "Weight decay처럼 gradient direction 밖에서 더해지는 update가 있는지 확인합니다.", "Schedule의 독립 변수 t는 micro-batch가 아니라 실제 optimizer update 횟수로 정의합니다."]}
        interpretation="같은 ηt라도 optimizer state와 parameter scale이 다르면 실제 Δθt는 달라지므로, LR curve와 함께 loss·gradient norm·relative update를 관측해야 합니다."
      />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Scalar 예에서 θ=3, optimizer direction u=4, learning rate η=0.05라면
          displacement는 Δθ=−0.05×4=−0.2이고 다음 parameter는 2.8입니다. Learning
          rate는 목적함수의 값이 아니라 optimizer가 만든 방향에 곱하는 이동 scale이며,
          같은 η라도 u가 두 배이면 실제 이동도 두 배가 됩니다.
        </p>
      </div>
      <ExplainedFormula
        question="Epoch 수를 scheduler가 사용할 총 optimizer update 수로 어떻게 바꿀까?"
        idea={<>한 update가 Bμ×A×W개의 sample을 소비한다고 가정하면 epoch당 update 수를 구할 수 있습니다. 마지막 batch 처리와 distributed sampler padding에 따라 실제 값은 달라질 수 있으므로 실행 로그와 맞춰 봅니다.</>}
        formula={String.raw`\begin{aligned}B_{\mathrm{eff}}&=B_{\mu}AW,\\U_{\mathrm{epoch}}&=\left\lceil\frac{N}{B_{\mathrm{eff}}}\right\rceil,\\T&=E\,U_{\mathrm{epoch}}.\end{aligned}`}
        terms={[
          { symbol: "B_μ", name: "per-rank micro-batch", description: "GPU 한 rank가 한 번의 forward/backward에서 읽는 sample 수입니다." },
          { symbol: "A", name: "accumulation count", description: "Optimizer update 한 번 전에 gradient를 모으는 micro-batch 횟수입니다." },
          { symbol: "W", name: "data-parallel world size", description: "서로 다른 sample shard를 동시에 처리하는 rank 수입니다." },
          { symbol: "N,E,T", name: "dataset·epochs·total updates", description: "한 epoch의 sample 수, epoch 횟수, scheduler가 따라갈 전체 update budget입니다." },
        ]}
        assumptions={["모든 rank가 같은 시점에 동기화하고 한 update당 같은 수의 sample을 처리합니다.", "Drop-last·sampler padding·마지막 accumulation 처리 규칙을 명시합니다.", "Token 단위 objective에서는 sample 수 대신 valid token 수가 더 적절한 budget일 수 있습니다."]}
        interpretation="Batch·accumulation·world size가 바뀌면 같은 epoch 수라도 T가 바뀝니다. Warmup steps·milestone·T_max도 새 update clock에 맞춰 다시 계산해야 합니다."
      />
      <div className="not-prose my-8"><OverviewViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          첫 실험은 같은 optimizer·initial LR·budget에서 constant schedule과 후보
          하나만 비교합니다. Train loss가 빠르게 내려갔다는 이유만으로 고르지 않고
          validation metric, seed variation, wall time, divergence·NaN 여부를 함께
          기록합니다. Scheduler state와 global update를 checkpoint에 저장한 뒤
          continuous run과 resumed run의 LR trace가 같은지도 확인합니다.
        </p>
      </div>
      <div id="docs-pytorch-scheduler" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">공식 문서 따라 읽기 · PyTorch LR Scheduler</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">현재 PyTorch 문서는 일반 scheduler를 optimizer update 뒤에 호출하고, ReduceLROnPlateau는 validation 뒤 metric과 함께 호출하도록 구분합니다. API의 last_epoch라는 이름은 scheduler마다 실제 batch/update index를 뜻할 수 있으므로 사용 중인 class의 문서를 확인해야 합니다.</p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://docs.pytorch.org/docs/stable/optim.html#how-to-adjust-learning-rate" target="_blank" rel="noreferrer">호출 순서와 scheduler 목록 보기</a>
      </div>
    </section>
  );
}

import ExplainedFormula from "@/components/ui/explained-formula";
import StepExpViz from "./viz/StepExpViz";

export default function StepExponential() {
  return (
    <section id="step-exponential" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Step·exponential·plateau는 learning rate를 낮추는 trigger가 다릅니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Step schedule은 update milestone을 지나갈 때마다 learning rate를 γ배로
          낮춥니다. Exponential schedule은 매 update마다 같은 γ를 곱하므로 감소가
          연속적입니다. 둘 다 validation 결과를 보지 않는 open-loop 정책이어서
          같은 global update를 복원하면 정확히 같은 값을 재생하기 쉽습니다.
        </p>
        <p>
          반면 ReduceLROnPlateau는 validation metric이 의미 있게 개선되지 않은
          evaluation event가 patience보다 오래 이어질 때 rate를 낮춥니다. Metric
          noise와 평가 주기가 scheduler의 입력이 되므로, 같은 train updates라도
          validation cadence가 다르면 다른 trajectory가 만들어집니다.
        </p>
      </div>
      <ExplainedFormula
        question="Step과 exponential schedule은 같은 γ를 어떤 시간축에 적용할까?"
        idea={<>Step은 K updates마다 지수를 한 번 늘리고, exponential은 update마다 늘립니다. 시작값과 종료값을 먼저 정하면 exponential γ를 역산해 decay 의도를 재현할 수 있습니다.</>}
        formula={String.raw`\begin{aligned}\eta_t^{\mathrm{step}}&=\eta_0\gamma^{\lfloor t/K\rfloor},\\\eta_t^{\mathrm{exp}}&=\eta_0\gamma^t,\\\gamma&=\left(\frac{\eta_T}{\eta_0}\right)^{1/T}.\end{aligned}`}
        terms={[
          { symbol: "η_0,η_T", name: "initial·final LR", description: "Schedule 시작과 T번째 update에서 의도한 learning rate입니다." },
          { symbol: "γ", name: "decay factor", description: "0<γ<1이면 trigger가 발생할 때 learning rate가 줄어듭니다." },
          { symbol: "K", name: "step interval", description: "Step schedule에서 learning rate를 한 번 낮추기 전까지의 optimizer updates입니다." },
          { symbol: "⌊t/K⌋", name: "completed intervals", description: "Update t까지 몇 개의 step interval이 완전히 지났는지 세는 정수입니다." },
        ]}
        assumptions={["식의 t와 K는 optimizer update 단위입니다. Epoch 단위 API라면 호출을 epoch마다 한 번만 해야 같은 식이 됩니다.", "Parameter groups가 여러 개라면 같은 factor를 적용해도 각 base LR는 다를 수 있습니다.", "Final LR는 optimization 성공을 보장하는 값이 아니라 비교할 schedule contract입니다."]}
        interpretation="Exponential γ를 관습적으로 복사하기보다 η0·ηT·T에서 계산하면 batch나 budget이 바뀌었을 때 같은 종료 의도를 유지할 수 있습니다."
      />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          예를 들어 η₀=0.1에서 두 update 뒤 η₂=0.01에 도달하려면
          γ=(0.01/0.1)¹ᐟ²≈0.316입니다. 따라서 η₁≈0.0316, η₂=0.01이 됩니다.
          같은 γ를 epoch마다 호출하면 이 계산의 t는 update가 아니라 epoch가 되어
          전혀 다른 감소 속도가 되므로 호출 단위를 config와 trace에 함께 적습니다.
        </p>
      </div>
      <div className="not-prose my-8"><StepExpViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>ReduceLROnPlateau는 validation event에 반응합니다</h3>
        <p>
          Plateau policy의 state에는 best metric, 나아지지 않은 evaluation 횟수,
          cooldown과 현재 LR가 들어갑니다. 그래서 checkpoint에는 scheduler
          state를 함께 저장해야 합니다. Early stopping도 같은 metric을 본다면
          LR 감소 후 몇 번 더 학습할 기회를 줄지 먼저 정해야, stop이 항상 decay보다
          먼저 발생하는 설정 오류를 피할 수 있습니다.
        </p>
        <p>
          실제 trace에는 global update, evaluation index, metric, 이전·새 LR와
          trigger reason을 함께 남깁니다. 이렇게 해야 “성능이 정체되어 낮췄다”는
          설명을 재현할 수 있고, 단순히 epoch 번호만 저장한 로그보다 resume 오류를
          빨리 찾을 수 있습니다.
        </p>
      </div>
      <div id="docs-pytorch-plateau" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">공식 문서 따라 읽기 · ReduceLROnPlateau</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">PyTorch의 현재 구현은 mode·factor·patience·threshold·cooldown·min_lr를 stateful policy로 사용하고 validate 뒤 scheduler.step(metric)을 호출합니다. 기본값이 특정 task의 최적 정책이라는 뜻은 아닙니다.</p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://docs.pytorch.org/docs/stable/generated/torch.optim.lr_scheduler.ReduceLROnPlateau.html" target="_blank" rel="noreferrer">현재 state와 threshold 의미 보기</a>
      </div>
    </section>
  );
}

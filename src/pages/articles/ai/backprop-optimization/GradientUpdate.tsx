import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";

export default function GradientUpdate() {
  return (
    <section id="gradient-update" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Optimizer가 gradient를 parameter 변화로 바꾼다</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          가장 단순한 gradient descent는 현재 gradient의 반대 방향으로 learning
          rate만큼 움직인다. 실제 training은 mini-batch noise, parameter별 scale과
          곡률 때문에 momentum, adaptive second moment, schedule을 함께 사용할 수
          있지만, 어느 경우든 backward가 계산한 gradient를 update로 변환하는 별도
          단계라는 구조는 같다.
        </p>
      </div>

      <ExplainedFormula
        question="backward가 만든 local slope를 실제 parameter 변화로 어떻게 바꿀까?"
        idea={<>가장 단순한 SGD는 현재 mini-batch gradient의 반대 방향으로 learning rate만큼 움직입니다. Optimizer는 이 자리에 history와 scale transform을 추가합니다.</>}
        formula={String.raw`g_t=\nabla_\theta L_{\mathcal B_t}(\theta_t),\qquad \theta_{t+1}=\theta_t-\eta_t g_t`}
        terms={[
          { symbol: "\\mathcal B_t", name: "mini-batch", description: "t step에서 stochastic gradient를 추정하는 sample 집합입니다." },
          { symbol: "g_t", name: "batch gradient", description: "backpropagation이 계산해 parameter.grad에 누적한 값입니다." },
          { symbol: "\\eta_t", name: "learning rate", description: "schedule이 정하는 현재 step size입니다." },
        ]}
        assumptions={["gradient descent 표기이며 maximize objective에서는 부호가 반대입니다."]}
        interpretation="gradient는 현재 위치의 1차 local 정보이고, optimizer는 그것을 update로 변환합니다. Backpropagation과 Adam을 같은 알고리즘으로 부르면 이 경계가 흐려집니다."
      />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Warmup과 cosine decay는 여러 대규모 학습에서 흔하지만 모든 architecture와
          batch regime의 필수 조건은 아니다. Optimizer·batch size·training horizon을
          고정한 뒤 loss spike, gradient norm, validation metric을 함께 비교해야 한다.
        </p>
      </div>

      <div className="not-prose mt-6 rounded-xl border border-border/75 bg-card p-5">
        <p className="text-sm font-semibold">SGD·Momentum·Adam·AdamW의 state와 update 차이는 별도 글이 소유합니다</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          이 글은 backward와 optimizer의 경계까지만 다루고, bias correction·moment
          estimate·optimizer memory는 다음 글에서 같은 parameter budget으로 비교합니다.
        </p>
        <Link to="/ai/optimizers" className="mt-3 inline-flex text-sm font-semibold text-primary hover:underline">Optimizer 글 바로 보기 →</Link>
      </div>
    </section>
  );
}

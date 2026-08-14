import { Link } from "react-router-dom";

export default function Applications() {
  return (
    <section id="applications" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        같은 solver라도 무엇을 적분하는지 먼저 확인해야 합니다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Neural ODE는 neural network가 vector field를 parameterize하고 solver가
          state를 운반합니다. Score-based diffusion의 reverse SDE는 learned
          score와 random increment를 함께 사용하고, probability-flow ODE와 flow
          matching은 deterministic vector field를 적분합니다. 모두 Euler·Heun
          같은 이름을 쓸 수 있지만 학습 target과 경로의 의미는 서로 다릅니다.
        </p>
        <p>
          Solver benchmark에서 step 수만 비교하면 안 됩니다. Euler는
          step당 NFE가 1이지만 Heun은 2이며 adaptive method는 거절한
          step도 계산비용을 쓸 수 있습니다. 따라서 error tolerance,
          accepted·rejected step, NFE, wall-clock, peak memory를 같이
          기록하고, 참조해와의 차이인 discretization error를 learned
          vector field 자체의 model error와 분리해야 합니다.
        </p>
      </div>
      <div className="not-prose mt-8 grid gap-5 md:grid-cols-2">
        <Link
          to="/ai/diffusion-models#continuous-time"
          className="border-t border-border pt-4"
        >
          <b className="text-sm">
            Diffusion의 reverse SDE와 probability-flow ODE
          </b>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            Score가 reverse dynamics에 들어가는 계수와 같은 marginal을 만드는
            ODE를 이어서 유도합니다.
          </p>
        </Link>
        <Link
          to="/ai/math-functions-derivatives-gradients#derivative"
          className="border-t border-border pt-4"
        >
          <b className="text-sm">Derivative와 local linearity 복습</b>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            Euler update의 출발점인 변화율과 tangent approximation을 작은 수치
            예제로 다시 확인합니다.
          </p>
        </Link>
      </div>
    </section>
  );
}

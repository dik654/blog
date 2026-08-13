import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";

const journey = [
  ["현재 상태", "x(t)", "지금 알고 있는 위치·온도·농도"],
  ["변화 법칙", "dx/dt=f(x,t)", "지금 상태에서 어느 방향으로 얼마나 변하는가"],
  ["초기 조건", "x(t₀)=x₀", "수많은 가능한 경로 중 하나를 고르는 출발점"],
  ["수치적분", "x₀→x₁→⋯", "컴퓨터가 유한한 step으로 경로를 근사"],
] as const;

export default function Overview() {
  return (
    <section id="overview" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        미분방정식은 현재의 변화율로 앞으로의 경로를 정합니다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-lg leading-8">
          자동차의 속도를 매 순간 알면 이동 경로를 계산할 수 있고, 컵의 온도가
          주변 온도와 얼마나 차이 나는지 알면 식어 가는 과정을 예측할 수
          있습니다. 미분방정식은 이처럼{" "}
          <strong>현재 상태의 변화율을 정하는 규칙</strong>입니다. 해를 구한다는
          말은 숫자 하나를 찾는 것이 아니라, 그 규칙을 따르는 함수 전체를
          찾는다는 뜻입니다.
        </p>
        <p>
          이 글은{" "}
          <Link to="/ai/math-functions-derivatives-gradients">미분</Link>을 이미
          배운 독자가 ordinary differential equation(ODE)의 초기값 문제를
          세우고, Euler·Heun method로 근사하며, step size가 왜 안정성을 바꾸는지
          직접 계산할 수 있도록 구성했습니다. 마지막에는 randomness가 경로에
          계속 유입되는 stochastic differential equation(SDE)와의 경계를 분명히
          한 뒤 diffusion model로 연결합니다.
        </p>
      </div>
      <ContentBoundary article="math-differential-equations-numerical-solvers" />

      <figure
        data-viz="differential-equation-contract"
        className="not-prose my-8 rounded-xl border border-border bg-card p-4 sm:p-6"
      >
        <figcaption className="mb-5 text-sm font-semibold">
          변화 법칙을 실제 경로로 바꾸는 네 요소
        </figcaption>
        <div className="grid gap-4 lg:grid-cols-4">
          {journey.map(([title, notation, body], index) => (
            <div key={title} className="min-w-0 border-t border-border pt-4">
              <div className="flex items-baseline justify-between gap-3">
                <p className="font-semibold">{title}</p>
                <span className="text-xs tabular-nums text-muted-foreground">
                  0{index + 1}
                </span>
              </div>
              <p className="mt-3 break-words font-mono text-sm text-primary">
                {notation}
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {body}
              </p>
            </div>
          ))}
        </div>
      </figure>
    </section>
  );
}

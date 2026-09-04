import ExplainedFormula from "@/components/ui/explained-formula";

export default function Convergence() {
  return (
    <section id="convergence" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Convergence guarantee: 결론보다 전제를 먼저 읽는다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          “Gradient descent가 수렴한다”는 문장은 조건 없이 참이 아닙니다. Convexity, L-smoothness, lower bound, 정확한 gradient,
          learning rate 범위 같은 전제가 결론의 범위를 정합니다. Strong convexity까지 있으면 objective가 minimizer 주변에서 충분히 가파르게 올라
          linear convergence rate를 얻습니다.
        </p>
      </div>
      <ExplainedFormula
        question="μ-strongly convex이고 L-smooth인 함수에서 fixed step은 얼마나 빠르게 줄어들까요?"
        idea={
          <>
            η=1/L을 쓰면 매 step의 objective gap이 최대 (1−μ/L)배로 줄어드는
            geometric bound를 얻습니다. L/μ가 클수록 좁고 긴 골짜기라 느립니다.
          </>
        }
        formula={String.raw`\begin{aligned}
          \Delta_t&=f(x_t)-f(x^*) \\
          \Delta_t&\le\left(1-\frac\mu L\right)^t\Delta_0 \\
          0&<\mu\le L
        \end{aligned}`}
        terms={[
          { symbol: String.raw`\Delta_t`, name: "objective gap", description: "Step t의 objective와 optimal value의 차이입니다." },
          { symbol: String.raw`\mu`, name: "strong-convexity constant", description: "함수가 minimizer에서 최소한 얼마나 빠르게 위로 굽는지 나타냅니다." },
          { symbol: "L", name: "smoothness constant", description: "Gradient가 가장 빠르게 변하는 정도의 상한입니다." },
          { symbol: "L/\\mu", name: "condition number", description: "서로 다른 방향의 curvature 불균형과 convergence 난도를 나타냅니다." },
        ]}
        assumptions={[
          "함수가 전역적으로 μ-strongly convex이고 L-smooth합니다.",
          "정확한 full gradient와 η=1/L인 gradient descent를 사용합니다.",
          "표기 convention에 따라 유사 bound의 상수와 norm 형태는 달라질 수 있습니다.",
        ]}
        interpretation="이 bound는 deep network 전체의 nonconvex training을 보장하지 않습니다. Quadratic·convex problem에서 algorithm과 geometry의 관계를 보여주는 기준입니다."
      />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>증명 아이디어와 반례로 전제 확인하기</h3>
        <p>
          먼저 descent lemma에 y=x−∇f(x)/L을 대입하면 한 step 뒤 objective가 gradient norm의 제곱에 비례해 줄어듭니다. Strong
          convexity는 이 gradient norm을 현재 objective gap의 아래쪽에서 묶어 주므로 두 inequality를 연결하면 매 step gap이 (1−μ/L)배
          이하로 수축합니다.
        </p>
        <p>
          같은 f(x)=x²/2도 η=2이면 x가 매번 부호만 바꿔 크기가 줄지 않고 η&gt;2이면 발산합니다. Convex 함수라는 사실만으로 모든 learning rate의 수렴을
          보장할 수 없다는 가장 작은 반례입니다.
        </p>
      </div>
    </section>
  );
}

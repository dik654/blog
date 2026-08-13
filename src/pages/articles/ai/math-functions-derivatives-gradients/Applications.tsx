import { Link } from "react-router-dom";

const links = [
  {
    title: "Activation function",
    detail: "Sigmoid·tanh·ReLU의 출력 범위와 derivative가 gradient flow를 어떻게 바꾸는지 읽습니다.",
    href: "/ai/activation-functions#overview",
  },
  {
    title: "Backpropagation",
    detail: "계산 그래프의 local derivative를 뒤에서 앞으로 재사용하는 reverse-mode 계산으로 확장합니다.",
    href: "/ai/backprop-optimization#chain-rule",
  },
  {
    title: "Optimizer",
    detail: "Gradient를 실제 parameter update로 바꿀 때 learning rate와 state가 맡는 역할을 구분합니다.",
    href: "/ai/optimizers#overview",
  },
] as const;

export default function Applications() {
  return (
    <section id="applications" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">이 수학이 모델 안에서 쓰이는 곳</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          함수와 미분은 특정 모델의 전용 기술이 아닙니다. Activation은 local derivative의
          모양을 정하고, backpropagation은 chain rule로 그 값을 전달하며, optimizer는
          gradient를 parameter 변화로 바꿉니다. 아래 글은 정의를 반복하지 않고 실행 경로를 확장합니다.
        </p>
      </div>
      <div className="not-prose mt-6 grid gap-5 md:grid-cols-3">
        {links.map((item) => (
          <Link key={item.href} to={item.href} className="min-w-0 border-t border-border/80 pt-4 transition-colors hover:border-primary/60">
            <h3 className="text-sm font-bold text-foreground">{item.title}</h3>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">{item.detail}</p>
            <span className="mt-3 block text-xs font-bold text-primary">다음 개념으로 이동 →</span>
          </Link>
        ))}
      </div>
      <div className="prose prose-neutral dark:prose-invert mt-8 max-w-none">
        <h3>공개 강의로 더 넓게 보기</h3>
        <p>
          단변수 미분과 chain rule은 MIT OpenCourseWare의
          <a href="https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/pages/1.-differentiation/" target="_blank" rel="noreferrer">18.01SC Differentiation</a>에서,
          gradient와 directional derivative는
          <a href="https://ocw.mit.edu/courses/18-02sc-multivariable-calculus-fall-2010/pages/2.-partial-derivatives/part-b-chain-rule-gradient-and-directional-derivatives/" target="_blank" rel="noreferrer">18.02SC Multivariable Calculus</a>에서
          강의·문제와 함께 확장할 수 있습니다.
        </p>
      </div>
    </section>
  );
}

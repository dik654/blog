import { Link } from "react-router-dom";

export default function Applications() {
  return (
    <section id="applications" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">이 확률 언어가 다음 글에서 쓰이는 곳</h2>
      <div className="not-prose grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        <Link to="/ai/optimizers#batch-variants" className="border-t border-border pt-4"><b className="text-sm">Optimizer</b><p className="mt-2 text-xs leading-5 text-muted-foreground">Stochastic gradient·moment·batch variance를 update 규칙으로 연결합니다.</p></Link>
        <Link to="/ai/cross-entropy#expectation" className="border-t border-border pt-4"><b className="text-sm">Cross-entropy</b><p className="mt-2 text-xs leading-5 text-muted-foreground">Distribution 아래의 surprisal expectation을 objective로 읽습니다.</p></Link>
        <Link to="/ai/math-gradient-descent-convergence#overview" className="border-t border-border pt-4"><b className="text-sm">Gradient descent</b><p className="mt-2 text-xs leading-5 text-muted-foreground">확률적으로 추정한 gradient가 어떤 전제에서 descent에 쓰이는지 확인합니다.</p></Link>
        <Link to="/ai/seq2seq#overview" className="border-t border-border pt-4"><b className="text-sm">Seq2Seq</b><p className="mt-2 text-xs leading-5 text-muted-foreground">조건부확률의 연쇄법칙을 token별 예측과 전체 sequence likelihood로 연결합니다.</p></Link>
      </div>
      <div className="prose prose-neutral dark:prose-invert mt-8 max-w-none"><h3>공개 강의로 더 넓게 보기</h3><p>Random variable·expectation·variance는 <a href="https://ocw.mit.edu/courses/6-041sc-probabilistic-systems-analysis-and-applied-probability-fall-2013/" target="_blank" rel="noreferrer">MIT OpenCourseWare 6.041SC</a>의 Unit I에서 문제와 함께 확장할 수 있습니다.</p></div>
    </section>
  );
}

import { Link } from "react-router-dom";

export default function Applications() {
  return (
    <section id="applications" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">확률에 negative log를 적용하면 낮게 본 사건을 크게 벌점 준다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>확률 q가 1이면 −log q는 0이고, q가 0에 가까워질수록 값은 제한 없이 커집니다. 따라서 실제로 일어난 사건에 낮은 확률을 준 모델일수록 큰 비용을 받습니다. 이 한 사건의 비용이 surprisal이며, 실제 분포로 평균내면 cross-entropy가 됩니다.</p>
        <p>다음 글인 <Link to="/ai/cross-entropy">Cross-entropy 정본</Link>에서는 이 log 변환을 확률분포·기댓값과 결합해 entropy, KL divergence, maximum likelihood와 softmax gradient까지 확장합니다.</p>
      </div>
      <div id="paper-log-foundation" className="not-prose mt-8 scroll-mt-24 border-l border-border/80 pl-4">
        <p className="text-xs font-bold text-primary">역사적 연결 · logarithm에서 information measure까지</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">로그의 곱→합 성질은 긴 곱셈을 다루는 계산 도구로 쓰였고, 정보이론에서는 독립 사건의 결합 정보량이 더해져야 한다는 요구를 만족시킵니다. 다만 로그 성질만으로 entropy의 모든 공리와 source coding theorem이 자동으로 따라오는 것은 아니며, 그 범위는 다음 글에서 구분합니다.</p>
      </div>
    </section>
  );
}

import { Link } from "react-router-dom";

const paths = [
  ["분포 의미론", "Word×context matrix를 weighting하고 truncated SVD로 dense coordinates를 만듭니다.", "/ai/distributional-semantics#dimensionality"],
  ["Word2Vec", "SGNS가 shifted-PMI matrix를 암묵적으로 factorize한다는 분석과 비교합니다.", "/ai/word2vec#training"],
  ["신경망", "Batch matrix multiplication과 affine layer의 shape 계약으로 확장합니다.", "/ai/neural-network#forward"],
] as const;

export default function Applications() {
  return (
    <section id="applications" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Matrix 계산이 embedding과 neural network에서 맡는 역할</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          같은 matrix factorization도 무엇을 row·column으로 삼고 어떤 error를 줄이는지에
          따라 결과가 달라집니다. Term–document나 word–context matrix의 SVD는 관측
          pattern을 압축하지만, neural network weight의 matrix multiplication은 학습된
          feature transformation을 실행합니다. 아래에서는 정의를 반복하지 않고 각
          응용의 data·objective·평가 경계로 이어갑니다.
        </p>
      </div>
      <div className="not-prose mt-7 grid gap-5 md:grid-cols-3">
        {paths.map(([title, body, href]) => (
          <Link key={href} to={href} className="min-w-0 border-t border-border/80 pt-4 hover:border-primary/60">
            <h3 className="text-sm font-bold">{title}</h3>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">{body}</p>
            <span className="mt-3 block text-xs font-bold text-primary">계산이 쓰이는 곳으로 이동 →</span>
          </Link>
        ))}
      </div>
      <div id="paper-svd-lecture" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">공개 강의 · SVD 확장</p>
        <p className="mt-2 text-sm font-semibold">MIT 18.06 — Singular Value Decomposition</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          임의 matrix를 orthogonal·diagonal·orthogonal 세 factor로 분해하고 AᵀA의
          eigenvalue와 singular value를 연결합니다. 이 글에서는 eigendecomposition
          전체를 선수로 요구하지 않았으므로, 증명과 네 fundamental subspaces까지
          확장할 때 이 강의를 사용합니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/pages/positive-definite-matrices-and-applications/singular-value-decomposition/" target="_blank" rel="noreferrer">
          SVD 강의와 연습문제 보기
        </a>
      </div>
    </section>
  );
}

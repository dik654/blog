import ExplainedFormula from "@/components/ui/explained-formula";
import LowRankBudgetViz from "./viz/LowRankBudgetViz";

export default function LowRank() {
  return (
    <section id="low-rank" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Low-rank approximation은 작은 singular direction부터 생략한다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          SVD를 rank-one outer product의 합으로 펼치면 각 항이 하나의 input pattern과
          output pattern을 singular value로 연결합니다. 앞의 k개만 남긴 Aₖ는 저장과
          계산을 줄이면서 큰 방향을 보존합니다. Eckart–Young 정리는 같은 rank k 예산을
          가진 모든 행렬 가운데 truncated SVD가 spectral norm과 Frobenius norm 기준의
          최적 근사임을 보장합니다.
        </p>
        <p>
          SVD가 만드는 <code>Aₖ=UₖΣₖVₖᵀ</code>는 <strong>low-rank
          factorization</strong>의 한 예입니다. 일반적으로 low-rank factorization은
          m×n 행렬을 rank k인 두 작은 factor의 곱 BC(B는 m×k, C는 k×n)로 표현해
          저장량을 mn에서 k(m+n)으로 줄이는 방법을 통칭합니다.
        </p>
        <p>
          m=n=1,000이고 k=10이면 1,000,000개 entry가 20,000개로 50배 줄어듭니다.
          SVD는 그 가운데 orthogonal 조건 아래 Frobenius norm과 spectral norm
          기준으로 최적인 factorization을 골라 줍니다.
        </p>
      </div>
      <LowRankBudgetViz />
      <ExplainedFormula
        question="Rank k만 남길 때 어떤 근사가 전체 entry의 squared error를 가장 작게 만들까요?"
        idea={<>Singular value가 큰 rank-one component부터 k개 남깁니다. Orthonormal components는 서로 error를 섞지 않으므로 버린 방향의 squared singular value가 Frobenius error로 정확히 더해집니다.</>}
        formula={String.raw`A_k=\sum_{i=1}^{k}\sigma_i u_i v_i^\top,\qquad \min_{\operatorname{rank}(B)\le k}\lVert A-B\rVert_F^2=\lVert A-A_k\rVert_F^2=\sum_{i>k}\sigma_i^2`}
        annotatedFormula={String.raw`A_k=\underbrace{\sum_{i=1}^{k}\sigma_i u_i v_i^\top,\qquad \min_{\operatorname{rank}(B)\le k}\lVert A-B\rVert_F^2=\lVert A-A_k\rVert_F^2=\sum_{i>k}\sigma_i^2}_{\text{경계 후보 선택}}`}
        operations={[
          { expression: String.raw`\sum_{i=1}^{k}\sigma_i u_i v_i^\top,\qquad \min_{\operatorname{rank}(B)\le k}\lVert A-B\rVert_F^2=\lVert A-A_k\rVert_F^2=\sum_{i>k}\sigma_i^2`, annotation: ["허용 후보 중 목적에 맞는 경계값을 선택합니다.","Singular value가 큰 rank-one","component부터 k개 남깁니다."] },
        ]}
        terms={[
          { symbol: "A_k", name: "truncated SVD", description: "가장 큰 singular value와 대응 vector k쌍만 남긴 rank-k matrix입니다." },
          { symbol: String.raw`\lVert\cdot\rVert_F`, name: "Frobenius norm", description: "Matrix 모든 entry의 제곱합에 제곱근을 취한 전체 reconstruction error입니다." },
          { symbol: String.raw`\sum_{i>k}\sigma_i^2`, name: "discarded energy", description: "생략한 orthogonal rank-one components의 squared scale 합입니다." },
        ]}
        assumptions={["Full data matrix를 알고 exact SVD를 계산하며 rank≤k인 unconstrained real matrix와 비교합니다.", "Frobenius 또는 spectral norm 최적성이지 classification·retrieval·공정성 같은 downstream objective 최적성을 뜻하지 않습니다."]}
        interpretation="작은 singular value를 버리는 것은 matrix reconstruction 관점에서 최선이지만 작은 방향이 task label이나 희귀 집단에 중요할 수 있습니다. k는 설명 분산·memory뿐 아니라 downstream error와 subgroup 성능으로 선택해야 합니다."
      />
      <div
        id="paper-eckart-young"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">정리 읽기 · Low-rank optimum</p>
        <p className="mt-2 text-sm font-semibold">Eckart–Young: The Closest Rank k Matrix to A</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          MIT 강의는 truncated SVD가 같은 rank budget의 다른 행렬보다 matrix norm
          reconstruction error가 작다는 정리와 PCA 연결을 설명합니다. 이 보장은
          관측 matrix를 같은 norm으로 복원하는 문제에 한정되며 downstream task의
          최적 k를 대신 정하지 않습니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://ocw.mit.edu/courses/18-065-matrix-methods-in-data-analysis-signal-processing-and-machine-learning-spring-2018/resources/lecture-7-eckart-young-the-closest-rank-k-matrix-to-a/" target="_blank" rel="noreferrer">
          강의·문제와 정리의 조건 보기
        </a>
      </div>
    </section>
  );
}

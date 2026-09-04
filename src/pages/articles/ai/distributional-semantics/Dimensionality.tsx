import ExplainedFormula from "@/components/ui/explained-formula";
import { Link } from "react-router-dom";
import FactorizationViz from "./viz/FactorizationViz";
import SimilarityBoundaryViz from "./viz/SimilarityBoundaryViz";

export default function Dimensionality() {
  return (
    <section id="dimensionality" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Matrix factorization은 sparse context coordinate를 공유 latent
        direction으로 압축한다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">
          PPMI matrix의 column 하나하나는 특정 context feature라 해석하기 쉽지만
          vocabulary가 커지면 매우 넓고 sparse합니다. Truncated SVD는 함께
          변하는 row·column pattern을 상위 singular direction으로 모아 rank-k
          approximation을 만듭니다. LSA/LSI는 이 아이디어를 term–document
          matrix에 적용했습니다.
        </p>
        <p>
          Matrix·rank·SVD 자체의 계산과 Eckart–Young 정리의 전제가 낯설다면
          <Link to="/ai/math-matrices-svd"> 행렬·SVD 정본</Link>에서 2×2 예부터 먼저
          확인할 수 있습니다. 여기서는 이미 정의된 factorization을 word–context
          measurement에 적용할 때 생기는 의미와 평가 경계에 집중합니다.
        </p>
      </div>

      <FactorizationViz />

      <ExplainedFormula
        question="큰 word–context matrix를 k차원 dense word vector로 어떻게 근사하는가?"
        idea={
          <>
            SVD의 singular value가 큰 방향 k개만 남깁니다. Uₖ의 각 row는 word가
            latent direction에 놓인 coordinate이고, Σₖ는 각 direction의 scale을
            담습니다. 어떤 power로 Σ를 word vector에 흡수할지는 별도 design
            choice입니다.
          </>
        }
        formula={String.raw`M\approx U_k\Sigma_kV_k^\top,\qquad E_{\mathrm{word}}=U_k\Sigma_k^p`}
        annotatedFormula={String.raw`M\approx U_k\Sigma_kV_k^\top,\qquad E_{\mathrm{word}}=\underbrace{U_k\Sigma_k^p}_{\text{singular values 계산}}`}
        operations={[
          { expression: String.raw`U_k\Sigma_k^p`, annotation: ["singular values이(가) 식의 결과에 기여하는","방식을 계산합니다.","SVD의 singular value가 큰 방향 k개만","남깁니다."] },
        ]}
        terms={[
          {
            symbol: "M",
            name: "weighted context matrix",
            description:
              "Raw count·PPMI·shifted PPMI 등으로 만든 |W|×|C| matrix입니다.",
          },
          {
            symbol: "U_k,V_k",
            name: "top singular vectors",
            description:
              "Word row와 context column의 상위 k latent directions입니다.",
          },
          {
            symbol: "\\Sigma_k",
            name: "singular values",
            description:
              "각 latent direction이 matrix variation을 설명하는 scale입니다.",
          },
          {
            symbol: "p",
            name: "eigenvalue weighting",
            description:
              "0·1/2·1 등으로 singular scale을 word vector에 얼마나 반영할지 정합니다.",
          },
        ]}
        assumptions={[
          "Frobenius norm에서 최적 rank-k approximation을 주는 truncated SVD를 설명했습니다.",
          "SVD axis의 sign·rotation과 개별 coordinate에 사람이 읽을 수 있는 단일 의미가 자동으로 붙는 것은 아닙니다.",
        ]}
        interpretation="k는 압축률만이 아니라 어떤 작은 variation을 버릴지 정합니다. 너무 작으면 rare relation을 잃고 너무 크면 noise와 memory가 남으므로 downstream metric과 stability로 선택합니다."
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">
          가장 단순한 예로 M=diag(3,1)이면 singular value도 3과 1입니다. k=1은 크기 3인 첫 방향만 남기므로 rank-1 근사는 diag(3,0)이 되고 버린
          squared Frobenius error는 1²=1입니다. 이 값이 최소라는 말은 같은 rank와 Frobenius norm에서 matrix를 가장 잘 복원한다는 의미입니다.
          버린 두 번째 방향이 downstream label이나 희귀한 의미 관계에 쓸모없다는 데까지는 미치지 않습니다.
        </p>
      </div>

      <div id="paper-lsa" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">논문 읽기 · Explicit matrix compression</p>
        <p className="mt-2 text-sm font-semibold">Indexing by Latent Semantic Analysis</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Term–document matrix에 truncated SVD를 적용해 lexical matching을 넘어서는 latent association을 검색에 사용했습니다. 결과가
          서는 범위는 논문이 쓴 corpus·rank·retrieval 평가까지입니다. SVD coordinate를 언어 의미의 고유 축으로 읽을 수는 없습니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://doi.org/10.1002/(SICI)1097-4571(199009)41:6%3C391::AID-ASI1%3E3.0.CO;2-9" target="_blank" rel="noreferrer">LSA 원 논문 보기</a>
      </div>

      <SimilarityBoundaryViz />

      <ExplainedFormula
        question="Vector magnitude보다 context pattern의 방향이 비슷한지 어떻게 비교하는가?"
        idea={
          <>
            Dot product를 두 vector norm으로 나누면 scale을 제거한 angle
            similarity가 됩니다. 같은 방향이면 1, orthogonal이면 0이지만
            negative value의 의미는 embedding construction에 따라 달라집니다.
          </>
        }
        formula={String.raw`\operatorname{cos}(u,v)=\frac{u^\top v}{\lVert u\rVert_2\lVert v\rVert_2}`}
        annotatedFormula={String.raw`\operatorname{cos}(u,v)=\underbrace{\frac{u^\top v}{\lVert u\rVert_2\lVert v\rVert_2}}_{\text{기준량당 비율}}`}
        operations={[
          { expression: String.raw`\frac{u^\top v}{\lVert u\rVert_2\lVert v\rVert_2}`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","Dot product를 두 vector norm으로 나누면","scale을 제거한 angle similarity가 됩니다."] },
        ]}
        terms={[
          {
            symbol: "u,v",
            name: "word vectors",
            description:
              "같은 representation pipeline에서 만든 두 dense vector입니다.",
          },
          {
            symbol: String.raw`u^\top v`,
            name: "alignment",
            description:
              "같은-sign coordinate contribution을 합한 dot product입니다.",
          },
          {
            symbol: "\\lVert u\\rVert_2",
            name: "L2 norm",
            description:
              "Corpus frequency·factor scale과 섞일 수 있는 vector magnitude입니다.",
          },
        ]}
        assumptions={[
          "Zero vector에는 cosine이 정의되지 않으므로 OOV·empty context 처리가 필요합니다.",
          "Intrinsic similarity가 downstream usefulness·factual correctness·fairness를 보장하지 않습니다.",
        ]}
        interpretation="Cosine은 representation 안의 근접도를 측정할 뿐입니다. Synonym과 antonym, domain shift와 사회적 bias를 구분하려면 labeled task·neighbor audit·subgroup evaluation을 함께 사용합니다."
      />
    </section>
  );
}

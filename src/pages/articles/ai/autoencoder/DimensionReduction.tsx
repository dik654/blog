import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import DimReduceViz from "./viz/DimReduceViz";

export default function DimensionReduction() {
  return (
    <section id="dimension-reduction" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Linear autoencoder가 PCA와 만나는 정확한 조건</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          PCA는 centered data를 variance가 큰 직교 방향으로 projection합니다.
          Autoencoder는 reconstruction을 최소화한다는 점에서 비슷해 보이지만, 둘이
          연결되는 것은 encoder와 decoder가 linear이고, bottleneck rank가
          <code>k</code>이며, squared reconstruction error를 최적화하는 제한된
          경우입니다. 필요한 matrix·rank·SVD 기초는{" "}
          <Link to="/ai/math-matrices-svd">matrix와 SVD 글</Link>에서 먼저 확인할
          수 있습니다.
        </p>
      </div>

      <ExplainedFormula
        question="어떤 조건에서 linear autoencoder의 최적 reconstruction이 PCA의 top-k 부분공간과 같아질까?"
        idea={<>Centered data matrix X를 rank k 이하의 linear map DE로 복원하면, 결국 X를 가장 잘 설명하는 k차원 부분공간을 찾는 문제가 됩니다. Truncated SVD의 최적성 때문에 top-k principal subspace가 최소 error를 만듭니다.</>}
        formula={String.raw`\begin{aligned}
M&=ED,\quad \operatorname{rank}(M)\le k\\
M^*&=\arg\min_M\lVert X-XM\rVert_F^2\\
\operatorname{span}(M^*)&=\operatorname{span}(V_k)
\end{aligned}`}
        terms={[
          { symbol: "X", name: "centered data matrix", description: "각 row가 sample이고 feature별 mean을 뺀 data입니다." },
          { symbol: "E,D", name: "linear encoder·decoder matrices", description: "두 map의 합성 DE가 rank-k bottleneck을 만듭니다." },
          { symbol: "M", name: "reconstruction map", description: "Encoder와 decoder를 합친 rank k 이하의 linear transformation입니다." },
          { symbol: "V_k", name: "top-k right singular vectors", description: "Data variance가 큰 principal directions가 펼치는 부분공간입니다." },
          { symbol: "\\lVert\\cdot\\rVert_F", name: "Frobenius norm", description: "모든 sample과 feature의 squared reconstruction error를 합칩니다." },
        ]}
        assumptions={["Data가 feature별로 centered되어 있습니다.", "Encoder와 decoder가 linear이며 bias와 nonlinear activation이 없습니다.", "Squared reconstruction error와 rank-k bottleneck을 사용합니다."]}
        interpretation="최적 reconstruction이 사용하는 부분공간은 PCA와 같지만 latent basis 자체는 회전·scale의 자유도가 있어 PCA coordinate와 동일할 필요가 없습니다. Nonlinear network나 다른 loss를 쓰면 이 정리를 그대로 적용할 수 없습니다."
      />

      <div
        id="paper-linear-ae-pca"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">논문 읽기 · Linear AE와 PCA</p>
        <p className="mt-2 text-sm font-semibold">Neural Networks and Principal Component Analysis: Learning from Examples Without Local Minima</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Baldi와 Hornik은 layered linear network의 quadratic error landscape를
          분석해 global minimum이 covariance의 leading principal vectors가 만드는
          projection과 연결됨을 보였습니다. 이 정리는 nonlinear activation,
          arbitrary regularizer, finite-data generalization을 한꺼번에 보장하지
          않습니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://doi.org/10.1016/0893-6080(89)90014-2" target="_blank" rel="noreferrer">
          원 논문의 theorem 조건과 landscape 보기
        </a>
      </div>

      <div className="not-prose mt-8"><DimReduceViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Nonlinear mapping은 표현력을 늘리지만 의미를 보장하지 않습니다</h3>
        <p>
          Nonlinear encoder와 decoder는 하나의 평면보다 복잡한 data manifold 근처를
          표현할 수 있습니다. 그러나 manifold hypothesis는 고차원 관측이 더 적은
          자유도를 가진 구조 근처에 있다는 출발 가정일 뿐, latent coordinate가
          실제 생성 요인과 일치한다는 보장은 아닙니다. Decoder가 training point를
          외우거나 latent space를 접어 서로 먼 sample을 가깝게 놓을 수도 있습니다.
        </p>
      </div>
    </section>
  );
}

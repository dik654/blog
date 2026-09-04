import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import { LinearPcaViz } from "./viz/ModernAutoencoderViz";

export default function LinearPcaArticle() {
  return <div className="space-y-16">
    <section id="overview" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">PCA와 같다는 말은 네 조건을 고정한 뒤에만 성립합니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert"><p className="text-lg leading-8">Autoencoder 전체가 PCA라는 뜻이 아닙니다. Data를 center하고, encoder·decoder를 linear map으로 제한하고, rank-k bottleneck과 squared reconstruction error를 사용할 때 최적 <strong>부분공간</strong>이 PCA의 leading subspace와 연결됩니다.</p></div>
      <TermBreakdown title="정리의 네 전제" items={[
        { term: "Centered data", description: "각 feature mean을 빼 원점을 data 중심으로 옮깁니다.", example: "X의 각 column mean이 0입니다.", boundary: "Centering 없이 bias 조건까지 바꾸면 다른 optimization입니다." },
        { term: "Linear maps", description: "Encoder E와 decoder D에 nonlinear activation을 넣지 않습니다.", example: "z=xE, x̂=zD입니다.", boundary: "ReLU가 들어오면 PCA equivalence를 그대로 쓰지 않습니다." },
        { term: "Rank-k", description: "합성 reconstruction map이 k차원 이하만 통과시킵니다.", example: "2D data를 k=1 직선에 projection합니다.", boundary: "Hidden width만 k라고 합성 rank가 자동으로 정확히 k인 것은 아닙니다." },
        { term: "Squared error", description: "모든 sample·feature residual의 제곱합을 최소화합니다.", example: "Frobenius norm ||X-XM||²F를 씁니다.", boundary: "BCE·robust loss·weighted loss는 다른 최적 방향을 낼 수 있습니다." },
      ]} />
      <LinearPcaViz />
      <ContentBoundary article="linear-autoencoder-pca" />
    </section>
    <section id="rank-k" className="scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">Encoder와 decoder를 합치면 rank-k reconstruction map이 됩니다</h2>
      <ExplainedFormula question="왜 두 network의 학습을 low-rank matrix approximation으로 바꿀 수 있을까요?" idea={<p>
            Linear encoder와 decoder의 곱을 M 하나로 묶습니다. 중간 dimension k가 합성 map의 rank 상한을 만들고 남는 문제는 X를 가장 잘 복원하는
            rank-k M을 고르는 일입니다.
          </p>} formula={String.raw`M=ED,\quad \operatorname{rank}(M)\le k,\quad \min_M\lVert X-XM\rVert_F^2`} annotatedFormula={String.raw`\begin{aligned}M&=\underbrace{ED}_{\text{두 linear map을 합성}}\\\operatorname{rank}(M)&\le\underbrace{k}_{\text{보존 방향 수의 상한}}\\M^*&=\underset{\operatorname{rank}(M)\le k}{\arg\min}\;\underbrace{\lVert X-XM\rVert_F^2}_{\text{전체 복원 residual}}\end{aligned}`} operations={[
        { expression: String.raw`ED`, annotation: ["encoder 뒤 decoder를 적용해", "하나의 reconstruction map으로 합성"] },
        { expression: String.raw`\operatorname{rank}(ED)\le k`, annotation: ["중간 coordinate가 k개이므로", "보존 가능한 독립 방향을 제한"] },
        { expression: String.raw`\arg\min_M\lVert X-XM\rVert_F^2`, annotation: ["허용 map을 모두 비교해", "squared reconstruction이 최소인 해 선택"] },
      ]} terms={[
        { symbol: "X", name: "Centered data matrix", description: "Row가 sample이고 column mean이 0인 matrix입니다." },
        { symbol: "E,D", name: "Encoder·decoder matrices", description: "각각 n→k, k→n linear map입니다." },
        { symbol: "M", name: "Reconstruction map", description: "두 map을 합친 n→n rank-k 이하 matrix입니다." },
      ]} assumptions={["Data가 centered되어 있습니다.", "E와 D 사이 또는 전후에 nonlinearity가 없습니다.", "Objective가 unweighted squared error입니다."]} interpretation="이 단계는 아직 PCA라는 이름을 쓰지 않습니다. Low-rank reconstruction 문제로 바꿨을 뿐이며 다음 절에서 SVD 최적성을 연결합니다." />
    </section>
    <section id="theorem" className="scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">Eckart–Young 정리가 top-k singular subspace를 선택합니다</h2>
      <ExplainedFormula question="최소 reconstruction error를 만드는 부분공간은 무엇일까요?" idea={<p>X의 SVD에서 큰 singular value가 실어 나르는 방향부터 k개 남기면 버리는 energy가 최소입니다.</p>} formula={String.raw`X=U\Sigma V^\top,\quad \operatorname{span}(M^*)=\operatorname{span}(V_k)`} annotatedFormula={String.raw`\begin{aligned}X&=\underbrace{U\Sigma V^\top}_{\text{직교 방향·크기로 분해}}\\V_k&=\underbrace{[v_1,\ldots,v_k]}_{\text{큰 singular 방향 k개}}\\\operatorname{span}(M^*)&=\underbrace{\operatorname{span}(V_k)}_{\text{최적 부분공간이 일치}}\end{aligned}`} operations={[
        { expression: String.raw`U\Sigma V^\top`, annotation: ["sample·feature geometry를", "직교 방향과 singular magnitude로 분해"] },
        { expression: String.raw`V_k`, annotation: ["복원 energy가 큰 방향부터", "k개만 보존"] },
        { expression: String.raw`\operatorname{span}(M^*)=\operatorname{span}(V_k)`, annotation: ["coordinate 값이 아니라", "두 해가 펼치는 부분공간을 비교"] },
      ]} terms={[
        { symbol: "Σ", name: "Singular values", description: "각 직교 방향이 설명하는 data scale입니다." },
        { symbol: "V_k", name: "Leading right singular vectors", description: "PCA principal subspace를 펼치는 k개 feature directions입니다." },
        { symbol: "span", name: "Spanned subspace", description: "Basis의 회전·scale 표현 차이를 무시한 방향 집합입니다." },
      ]} assumptions={["Eckart–Young의 Frobenius low-rank approximation 조건을 사용합니다.", "Optimization이 global optimum의 reconstruction map에 도달했다고 가정합니다."]} interpretation="동일한 것은 최적 subspace입니다. E와 D의 각 column, latent coordinate의 순서·scale·rotation이 PCA loading과 유일하게 같지는 않습니다." />
    </section>
    <section id="boundary" className="scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">Nonlinear autoencoder에는 이 정리를 그대로 확장하지 않습니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert"><p>ReLU를 넣거나 BCE를 쓰거나 data를 center하지 않으면 optimization problem이 바뀝니다. Nonlinear model이 curved manifold를 표현할 수 있다는 사실과 latent가 실제 생성 요인을 찾는다는 주장은 또 다릅니다.</p></div>
      <div id="paper-linear-ae-pca" className="not-prose mt-8 scroll-mt-24"><CitationBlock source="Baldi & Hornik — Neural Networks and Principal Component Analysis" citeKey={1} type="paper" href="https://doi.org/10.1016/0893-6080(89)90014-2">Linear auto-associative network의 quadratic error landscape와 principal subspace를 분석합니다. Nonlinear network·다른 loss·finite-sample generalization까지 같은 정리라고 주장하지 않습니다.</CitationBlock></div>
    </section>
  </div>;
}

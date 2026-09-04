import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import MathHighDimensionalGeometryViz from "./math-high-dimensional-geometry/viz/MathHighDimensionalGeometryViz";

/**
 * 고차원에서는 거리가 무너지고 그 틈을 JL 사영과 latent 표현이 메운다
 *
 * 작성 규칙은 docs/coverage-batch-playbook.md 를 따른다.
 */
export default function MathHighDimensionalGeometryArticle() {
  return (
    <div id="overview" className="space-y-16">
      <section id="problem" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">차원이 늘면 거리 하나로 가까움을 구분하기 어려워진다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            좌표가 몇 개뿐인 공간에서는 가까운 점과 먼 점의 거리 차이가 뚜렷합니다. 그런데 좌표 수(차원)가 수백·수천 개로 늘면 무작위로 뽑은 점들 사이 거리가 서로 거의 같아져
            "가장 가까운 이웃"이라는 말 자체가 흐려집니다. embedding vector나 이미지 pixel처럼 좌표가 많은 데이터에서 거리 계산과 차원 축소를 어떻게 다뤄야 하는지가
            이 글의 질문입니다.
          </p>
          <p>
            <Link to="/ai/math-vectors-inner-products#norm">벡터·norm 정본</Link>의
            Euclidean norm을 사용해 먼저 거리 개념을 확장하고, 차원이 늘 때
            거리가 왜 무너지는지 확인합니다. 그다음 Johnson–Lindenstrauss
            lemma가 그 거리를 훨씬 낮은 차원에서도 거의 그대로 보존한다는 사실을
            수식으로 봅니다.
          </p>
          <p>
            마지막으로 실제 데이터의 intrinsic dimension이 왜 ambient dimension보다 훨씬 작은지, 그래서 latent·bottleneck
            representation이 왜 정보를 거의 잃지 않고 압축하는지를 보며 마무리합니다.
          </p>
        </div>
        <MathHighDimensionalGeometryViz />
        <ContentBoundary article="math-high-dimensional-geometry" />
      </section>

      <section id="distance" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">차원이 늘수록 무작위 점들의 거리는 서로 비슷해진다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            <strong>Euclidean distance</strong>는 두 vector x, y의 좌표별 차이를
            제곱해 더한 뒤 제곱근을 취한 값이며, x−y의 Euclidean norm과 같습니다.
            2차원·3차원에서는 이 값이 "얼마나 가까운가"라는 직관과 잘 맞습니다.
          </p>
          <p>
            문제는 <strong>고차원 기하(high-dimensional geometry)</strong>에서
            일어납니다. 좌표를 무작위로 뽑은 점 여러 개를 2차원에 두면 최근접
            거리와 최원접 거리가 크게 차이 납니다(예: 1.2 대 8.7, 비율 7.3배).
          </p>
          <p>
            같은 방식으로 좌표 1,000개를 뽑으면 각 좌표 차이의 제곱합이 평균을
            중심으로 좁게 모여 최근접·최원접 거리가 31.1 대 33.4처럼 거의
            같아집니다(비율 1.07배). 거리 하나로 순위를 매기는 계산이 이
            지점부터 의미를 잃습니다.
          </p>
        </div>
        <ExplainedFormula
          question="두 점의 거리는 좌표 차이로부터 어떻게 하나의 숫자가 될까요?"
          idea={<>각 좌표의 차이를 제곱해 더하면 부호가 사라지고, 제곱근을 취하면 좌표를 하나 늘렸을 때 단위가 원래 좌표와 같아집니다. d차원으로 늘어나면 이 합이 d개 항의 평균 크기에 비례해 커집니다.</>}
          formula={String.raw`d(x,y)=\lVert x-y\rVert_2=\sqrt{\sum_{i=1}^{d}(x_i-y_i)^2}`}
          annotatedFormula={String.raw`d(x,y)=\lVert x-y\rVert_2=\sqrt{\underbrace{\sum_{i=1}^{d}(x_i-y_i)^2}_{\text{좌표별 차이 누적}}}`}
          operations={[
            { expression: String.raw`\sum_{i=1}^{d}(x_i-y_i)^2`, annotation: ["좌표별 차이 제곱을","d개 좌표에 대해 누적합니다.","항 하나하나가 그 좌표에서 두 점이","얼마나 벌어졌는지를 나타냅니다."] },
          ]}
          terms={[
            { symbol: "d", name: "ambient dimension", description: "점을 표현하는 좌표(차원)의 개수입니다." },
            { symbol: "x_i-y_i", name: "coordinate gap", description: "i번째 좌표에서 두 점이 벌어진 정도입니다." },
            { symbol: "d(x,y)", name: "Euclidean distance", description: "모든 좌표 차이를 하나의 스칼라 거리로 합친 값입니다." },
          ]}
          assumptions={["좌표가 실수이고 좌표축의 scale이 서로 비교 가능하다고 가정합니다.", "좌표별 분산이 비슷한 무작위 점을 가정한 것으로, 실제 데이터의 분포가 다르면 집중 정도도 달라집니다."]}
          interpretation="d가 커질수록 합 안의 독립 항 수가 늘어 결과값의 상대 표준편차(요동/평균)가 1/√d 비율로 줄어듭니다. 그 결과 무작위 점들 사이 거리는 특정 값 주변으로 몰리고, 최근접·최원접의 차이가 상대적으로 사라집니다."
        />
      </section>

      <section id="jl-lemma" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">JL lemma는 점 개수의 로그에 비례하는 차원만으로 거리를 거의 보존한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            <strong>Johnson–Lindenstrauss(JL) lemma</strong>는 n개의 점을 무작위
            linear projection 하나로 훨씬 낮은 차원 k로 옮겨도, 모든 점 쌍의
            거리가 (1±ε) 배 안에서 보존된다는 정리입니다. 놀라운 부분은 k가
            원래 ambient dimension이 아니라 점 개수 n의 로그에만 비례한다는
            점입니다.
          </p>
          <p>
            n=1,000,000개 점을 ε=0.1(10% 오차) 안에서 보존하려면 Dasgupta–Gupta의 elementary proof가 제시하는 충분 조건으로 k≥17,763이면
            됩니다. n을 1,000개로 1,000배 줄여도 k≥8,882로 절반 정도만 줄어드는데, 이것이 "로그에 비례한다"는 말의 실제 크기입니다.
          </p>
        </div>
        <ExplainedFormula
          question="점이 n개일 때 거리를 (1±ε) 안에서 보존하려면 몇 차원이 필요할까요?"
          idea={<>Dasgupta–Gupta의 증명은 무작위 방향에 대한 projection의 길이가 원래 길이 주변에 집중한다는 사실(앞 절의 거리 집중과 같은 현상)을 이용해, 실패 확률을 점 쌍의 수(약 n²/2)로 나눠도 여전히 작게 만드는 k의 하한을 제시합니다.</>}
          formula={String.raw`k\ge\frac{4\ln n}{\varepsilon^2/2-\varepsilon^3/3}\quad\Longrightarrow\quad (1-\varepsilon)\lVert u-v\rVert^2\le\lVert f(u)-f(v)\rVert^2\le(1+\varepsilon)\lVert u-v\rVert^2`}
          annotatedFormula={String.raw`k\ge\underbrace{\frac{4\ln n}{\varepsilon^2/2-\varepsilon^3/3}}_{\text{충분 목표 차원}}\quad\Longrightarrow\quad \underbrace{(1-\varepsilon)\lVert u-v\rVert^2\le\lVert f(u)-f(v)\rVert^2\le(1+\varepsilon)\lVert u-v\rVert^2}_{\text{거리 보존 허용 범위}}`}
          operations={[
            { expression: String.raw`\frac{4\ln n}{\varepsilon^2/2-\varepsilon^3/3}`, annotation: ["점 개수 n의 로그와 허용 오차 ε로","목표 차원 k의 하한을 계산합니다.","n이 커져도 로그로만 늘어나므로 k는","완만하게 증가합니다."] },
            { expression: String.raw`(1-\varepsilon)\lVert u-v\rVert^2\le\lVert f(u)-f(v)\rVert^2\le(1+\varepsilon)\lVert u-v\rVert^2`, annotation: ["사영 f가 만든 새 거리가 원래 거리","제곱의 (1±ε) 배 구간 안에 있는지","모든 점 쌍에 대해 확인합니다."] },
          ]}
          terms={[
            { symbol: "n", name: "point count", description: "거리를 보존해야 하는 점의 개수입니다." },
            { symbol: String.raw`\varepsilon`, name: "distortion budget", description: "허용하는 거리 왜곡 비율입니다(0과 1 사이)." },
            { symbol: "k", name: "target dimension", description: "사영한 뒤 남기는 차원 수이며 n의 로그에 비례합니다." },
            { symbol: "f", name: "random linear projection", description: "무작위로 뽑은 k×d 행렬이 만드는 선형 사영입니다." },
          ]}
          assumptions={["이 부등식은 확률 1−1/n 이상으로 모든 점 쌍에 대해 동시에 성립하는 확률적 보장입니다.", "이 k는 Dasgupta–Gupta 증명이 제시하는 충분조건이며 실전에서 필요한 최소 차원이라는 뜻은 아닙니다."]}
          interpretation="ε를 절반으로 줄이면 k는 대략 4배로 늘어나고(분모가 ε²에 비례), n을 1,000배 늘리면 k는 로그(ln 1,000≈6.9)만큼만 늘어납니다. 데이터 구조를 전혀 몰라도 거리 하나만 보존하면 될 때 이 무작위 사영이 항상 통한다는 점이 이 정리의 핵심이고, data-specific한 최적 축소는 이 정리의 범위 밖입니다."
        />
        <AlgorithmBlock
          title="무작위 projection으로 JL 보장을 얻는 절차"
          input={["points: R^d 위의 점 n개", "epsilon: 허용 거리 왜곡 비율"]}
          steps={[
            { code: "k = ceil(4 * ln(n) / (epsilon**2/2 - epsilon**3/3))", note: "n과 epsilon만으로 목표 차원을 정합니다. d와는 무관합니다." },
            { code: "R = sample_gaussian(k, d) / sqrt(k)", note: "항목이 평균 0인 정규분포인 k×d 행렬을 만들고 1/√k로 정규화해 길이 기대값을 맞춥니다." },
            { code: "projected = [R @ x for x in points]", note: "각 점에 같은 R을 곱해 R^k로 옮깁니다." },
          ]}
          output="projected: 원래 pairwise distance를 (1±epsilon) 안에서 보존하는 R^k 위의 점 n개"
        />
        <div id="paper-jl-lemma" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
          <p className="text-xs font-bold text-primary">원 정리·증명 읽기 · Johnson–Lindenstrauss lemma</p>
          <p className="mt-2 text-sm font-semibold">Dasgupta & Gupta — An Elementary Proof of a Theorem of Johnson and Lindenstrauss</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Johnson과 Lindenstrauss가 1984년 처음 보인 정리를 확률론만으로 다시 증명하며 k의 명시적인 하한을 제시합니다. 이 하한은 충분조건이고 실무에서 쓰는
            random projection 라이브러리는 더 작은 k로도 실제 데이터에서는 잘 동작하기도 합니다.
          </p>
          <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://doi.org/10.1002/rsa.10073" target="_blank" rel="noreferrer">
            증명과 k 하한 조건 보기
          </a>
        </div>
      </section>

      <section id="intrinsic-dimension" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">실제 데이터의 intrinsic dimension은 ambient dimension보다 훨씬 작다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            <strong>Intrinsic dimension</strong>은 데이터가 실제로 자유롭게
            변할 수 있는 독립 방향의 수이며, 저장에 쓰인 좌표 수인 ambient
            dimension과 다릅니다. 이미지 pixel이나 embedding 좌표 수가 많아도,
            그 데이터가 실제로 놓인 부분공간(또는 manifold)의 차원은 훨씬 작을
            수 있습니다.
          </p>
          <p>
            ImageNet 이미지는 224×224×3=150,528개 pixel로 저장되지만 최근접 이웃 거리 통계로 추정한 intrinsic dimension은 26에서 43
            사이입니다. 15만 개가 넘는 ambient 좌표 가운데 데이터가 실제로 쓰는 자유도는 수십 개뿐입니다.
          </p>
        </div>
        <div id="paper-intrinsic-dimension" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
          <p className="text-xs font-bold text-primary">근거 논문 · Intrinsic dimension 추정</p>
          <p className="mt-2 text-sm font-semibold">Pope, Zhu, Abdelkader, Goldblum & Goldstein — The Intrinsic Dimension of Images and Its Impact on Learning (ICLR 2021)</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            MLE 기반 dimension 추정 도구를 MNIST·CIFAR·ImageNet 같은 자연 이미지 데이터셋에 적용해 ambient dimension보다 훨씬 작은
            intrinsic dimension을 측정했습니다. 이 값이 학습에 필요한 sample 수·일반화와 상관관계를 갖는다는 사실도 함께 보였습니다. 이 논문의 수치는 특정 GAN
            실험 조건에서 얻은 dimension 추정치입니다. 모든 데이터셋의 intrinsic dimension이 항상 이만큼 작다고 일반화하지는 않습니다.
          </p>
          <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://arxiv.org/abs/2104.08894" target="_blank" rel="noreferrer">
            논문과 dimension 추정치 표 보기
          </a>
        </div>
      </section>

      <section id="latent-representation" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Latent representation은 낮은 자유도를 좌표로 명시한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            데이터의 intrinsic dimension이 ambient dimension보다 훨씬 작다는
            사실이 바로 압축이 정보를 거의 잃지 않고 가능한 이유입니다.
            <strong> Latent representation</strong>은 모델이 학습 중에 만드는
            이 낮은 차원의 좌표이고, <strong>bottleneck representation</strong>은
            그 좌표를 강제로 좁은 통로로 만들어 모델이 중요한 방향만 남기게
            하는 구조입니다.
          </p>
          <p>
            <Link to="/ai/math-matrices-svd#low-rank">SVD의 low-rank
            approximation</Link>이 만드는 rank-k 근사가 바로 이런 <strong>low-rank
            representation</strong>의 한 예입니다. 28×28=784차원 MNIST pixel을
            32차원 bottleneck으로 압축하는 autoencoder도 같은 원리로 동작합니다.
            784는 ambient dimension이고 32는 intrinsic dimension 추정치(약
            7~13)보다 훨씬 여유 있는 bottleneck 크기입니다.
          </p>
        </div>
        <TermBreakdown
          title="세 표현이 가리키는 대상은 다르지만 같은 사실에 기댄다"
          description="용어가 겹쳐 보이지만 low-rank representation은 계산 방법, latent representation은 학습된 좌표 자체, bottleneck representation은 그 좌표를 만드는 구조적 제약을 가리킵니다."
          items={[
            {
              term: "Low-rank representation",
              description: "행렬을 rank k인 두 작은 factor의 곱으로 표현해 저장·계산량을 줄이는 방법입니다.",
              example: "SVD의 Aₖ=UₖΣₖVₖᵀ, 또는 추천 시스템의 user·item factor 행렬.",
              boundary: "행렬 형태의 데이터에 적용하는 계산 절차 이름이며, 반드시 학습된 neural network를 전제하지 않습니다.",
            },
            {
              term: "Latent representation",
              description: "모델이 input을 변환해 만든, 사람이 직접 정의하지 않은 저차원 내부 좌표입니다.",
              example: "Autoencoder의 encoder 출력, VAE의 z, distributional embedding의 word vector.",
              boundary: "좌표 하나하나에 고정된 사람이 읽을 수 있는 의미가 자동으로 붙지는 않습니다.",
            },
            {
              term: "Bottleneck representation",
              description: "Latent dimension을 input보다 작게 강제해 모든 정보를 그대로 통과시키지 못하게 만드는 구조적 제약입니다.",
              example: "784차원 입력을 32차원으로 좁히는 autoencoder의 중간 층.",
              boundary: "제약이 곧 압축 품질을 보장하지 않으며, bottleneck이 너무 좁으면 intrinsic dimension보다 작아 정보가 실제로 손실됩니다.",
            },
          ]}
        />
        <ProgressiveDetail
          title="Bottleneck이 intrinsic dimension보다 작으면 무엇이 깨질까"
          preview="Bottleneck 차원이 데이터의 intrinsic dimension보다 작으면 reconstruction이 정확할 수 없고, 그 격차만큼 정보가 사라집니다."
        >
          <p>
            Intrinsic dimension은 데이터에 실제로 필요한 자유도의 하한입니다. Bottleneck을 그보다 좁게 만들면 서로 다른 두 입력이 같은 좌표로 압축될 수 있고
            decoder는 그 둘을 구분해 복원할 방법이 없습니다.
          </p>
          <p>
            반대로 bottleneck을 필요 이상으로 넓게 두면 모델이 압축 대신 input을 거의 그대로 복사하는 identity mapping으로 loss를 낮출 위험이 커집니다.
            실무에서는 intrinsic dimension을 정확히 알 수 없으므로 validation reconstruction error가 bottleneck 크기에 따라 어디서
            꺾이는지를 보고 크기를 정합니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="applications" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">거리 붕괴와 latent 압축이 실제로 쓰이는 곳</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            이 글이 정리한 거리 집중·JL 사영·intrinsic dimension은 각각 다른 글에서 구체적인 구현으로 이어집니다. 아래에서는 정의를 반복하지 않고 각 응용이 이 원리를
            어디에 쓰는지만 짚습니다.
          </p>
        </div>
        <div className="not-prose mt-7 grid gap-5 md:grid-cols-3">
          {[
            ["Autoencoder", "Bottleneck representation의 폭을 정하고 identity mapping 실패를 판정하는 절차로 확장합니다.", "/ai/autoencoder#bottleneck"],
            ["분포 의미론", "Word–context 행렬의 low-rank factorization이 만드는 latent representation 사례로 연결합니다.", "/ai/distributional-semantics#dimensionality"],
            ["Vector search·ANN index", "고차원 embedding의 nearest-neighbor 검색이 거리 집중과 어떻게 타협하는지로 확장합니다.", "/ai/vector-search-and-ann-indexes#dense-retrieval-embedding-space"],
          ].map(([title, body, href]) => (
            <Link key={href} to={href} className="min-w-0 border-t border-border/80 pt-4 hover:border-primary/60">
              <h3 className="text-sm font-bold">{title}</h3>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">{body}</p>
              <span className="mt-3 block text-xs font-bold text-primary">원리가 쓰이는 곳으로 이동 →</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

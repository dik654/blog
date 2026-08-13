import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ExplainedFormula from "@/components/ui/explained-formula";
import OverviewViz from "./viz/OverviewViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">대조 학습은 loss보다 “무엇을 같다고 볼 것인가”에서 시작합니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-lg leading-8">
          대조 학습(contrastive learning)의 핵심 아이디어는 간단합니다. 같은 의미를 가진 두 입력은 가까운 벡터로, 구분해야 하는 두 입력은 먼 벡터로 표현합니다. 다만 모델은 두 입력이 정말 같은지 알지 못하므로, 사람이 만든 <strong>pair 규칙</strong>이 의미의 기준이 됩니다. Positive pair는 모델이 무시해도 되는 변화를, negative pair는 반드시 보존해야 할 차이를 가르칩니다.
        </p>
        <p>
          예를 들어 상품 사진의 밝기가 달라져도 상품 정체성이 같다면 두 사진을 positive로 묶을 수 있습니다. 반면 피부 병변처럼 색이 진단 근거인 문제에서 강한 색 변환을 positive로 두면, 모델은 필요한 정보까지 무시하는 법을 배웁니다. 다른 문서라는 이유만으로 negative로 처리했는데 실제로는 같은 질문의 정답이라면 false negative가 되고, 올바르게 가까워야 할 벡터를 억지로 떼어 놓습니다.
        </p>
        <p>
          벡터·내적·norm이 낯설다면 <Link to="/ai/math-vectors-inner-products">벡터와 내적 정본</Link>을, augmentation이 label을 보존한다는 전제가 궁금하다면 <Link to="/ai/data-augmentation">데이터 증강 정본</Link>을 먼저 읽을 수 있습니다. 이 글에서는 그 기초를 반복하지 않고, pair 규칙이 SimCLR·triplet loss·supervised contrastive loss의 식으로 어떻게 이어지는지 설명합니다.
        </p>
      </div>
      <ContentBoundary article="contrastive-learning" />
      <ExplainedFormula
        question="원본 입력 x는 어떤 두 벡터를 거쳐 비교 가능한 embedding이 될까요?"
        idea={<>Encoder는 downstream task에 넘길 표현 h를 만들고, projection head는 contrastive loss가 직접 작용할 z를 만듭니다. 마지막으로 길이를 1로 맞추면 내적이 cosine similarity가 되어 방향만 비교할 수 있습니다.</>}
        formula={String.raw`\begin{aligned}
\mathbf h_i&=f_\theta(x_i),\\
\widetilde{\mathbf z}_i&=g_\phi(\mathbf h_i),\\
\mathbf z_i&=\widetilde{\mathbf z}_i/\lVert\widetilde{\mathbf z}_i\rVert_2,\\
\operatorname{sim}(i,j)&=\mathbf z_i^\top\mathbf z_j.
\end{aligned}`}
        terms={[
          { symbol: "x_i", name: "input or augmented view", description: "Image·text·audio 등 encoder에 넣는 i번째 입력입니다." },
          { symbol: "fθ", name: "encoder", description: "입력을 downstream representation h로 바꾸는 학습 함수입니다." },
          { symbol: "gφ", name: "projection head", description: "Representation h를 contrastive objective용 공간으로 옮기는 작은 network입니다." },
          { symbol: "z_i", name: "normalized contrastive embedding", description: "L2 norm이 1이어서 내적으로 방향의 유사도를 비교하는 벡터입니다." },
          { symbol: "sim(i,j)", name: "cosine similarity", description: "정규화된 두 벡터의 내적이며 −1에서 1 사이입니다." },
        ]}
        assumptions={["분모의 L2 norm이 0이 아니며 실제 구현은 작은 epsilon을 둘 수 있습니다.", "정규화하면 vector 크기 정보는 similarity에서 사라집니다.", "학습 뒤 h와 z 중 무엇을 downstream에 쓸지는 방법의 계약에 포함해야 합니다."]}
        interpretation="두 벡터가 같은 방향이면 similarity 1, 직교하면 0, 반대 방향이면 −1입니다. SimCLR은 보통 z에서 loss를 계산하지만 학습이 끝나면 projection head를 버리고 h를 downstream feature로 사용합니다."
      />
      <div className="not-prose my-8"><OverviewViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          모든 쌍을 positive와 negative로 억지로 나눌 필요는 없습니다. 판정 근거가 부족한 쌍은 <em>unknown</em>으로 남겨 loss에서 제외하는 편이 잘못된 학습 신호를 만드는 것보다 낫습니다. 또한 positive는 “두 입력이 완전히 같다”가 아니라 “현재 task에서 보존할 의미가 같다”는 관계입니다. 어떤 변화에 불변(invariant)이어야 하는지 먼저 적어야 하는 이유입니다.
        </p>
        <p>
          이제 augmentation으로 positive를 만드는 SimCLR, 세 샘플의 상대 거리를 다루는 triplet loss, label로 여러 positive를 묶는 supervised contrastive loss를 차례로 살펴봅니다. 마지막에는 pair audit와 downstream 평가를 연결해, loss 감소가 실제 유용한 표현으로 이어졌는지 확인합니다.
        </p>
      </div>
    </section>
  );
}

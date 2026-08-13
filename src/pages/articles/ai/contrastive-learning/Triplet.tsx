import ExplainedFormula from "@/components/ui/explained-formula";
import TripletViz from "./viz/TripletViz";

export default function Triplet() {
  return (
    <section id="triplet" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Triplet loss는 positive와 negative 사이의 상대 margin을 학습합니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          하나의 triplet은 anchor, 같은 의미의 positive, 구분해야 할 negative로 구성됩니다. Loss는 anchor–positive 거리보다 anchor–negative 거리가 margin만큼 더 멀어지도록 합니다. 이미 조건을 만족한 easy triplet은 gradient를 거의 만들지 않으므로 어떤 negative를 보여 주느냐가 학습 효율을 좌우합니다.
        </p>
        <p>
          Hard negative는 현재 모델이 헷갈리는 sample이지만, 가장 가까운 후보가 곧 올바른 negative라는 뜻은 아닙니다. 검색 데이터에서는 다른 문서도 실제 정답일 수 있고, 얼굴 인식에서는 같은 identity label이 누락될 수 있습니다. 그래서 mining 전에 multi-positive와 duplicate를 보존하고, teacher나 rule로 false negative를 거릅니다.
        </p>
      </div>
      <ExplainedFormula
        question="Anchor에 대해 positive보다 negative를 margin만큼 멀게 두려면 무엇을 최소화할까요?"
        idea={<>현재 positive 거리에서 negative 거리를 빼고 원하는 여유 m을 더합니다. 조건을 이미 만족하면 0, 위반하면 그 차이만큼 loss를 내는 hinge 구조입니다.</>}
        formula={String.raw`\begin{aligned}
u&=d(\mathbf z_a,\mathbf z_p)-d(\mathbf z_a,\mathbf z_n)+m,\\
[u]_+&=\max(0,u),\\
\mathcal L_{\mathrm{tri}}&=[u]_+.
\end{aligned}`}
        terms={[
          { symbol: "z_a", name: "anchor", description: "비교의 기준이 되는 embedding입니다." },
          { symbol: "z_p", name: "positive", description: "Anchor와 같은 의미로 정의한 embedding입니다." },
          { symbol: "z_n", name: "negative", description: "Anchor와 구분해야 한다고 정의한 embedding입니다." },
          { symbol: "d", name: "distance", description: "Euclidean·squared Euclidean 등 사전에 고정한 거리 함수입니다." },
          { symbol: "m", name: "margin", description: "Negative가 positive보다 더 멀어야 하는 최소 거리 여유입니다." },
        ]}
        assumptions={["Positive·negative 관계가 정확하고 같은 distance convention을 학습·평가에서 사용합니다.", "Margin은 embedding normalization과 distance scale에 맞춰 정합니다.", "Loss 0은 해당 triplet 조건을 만족했다는 뜻이지 전체 embedding 품질이 완성됐다는 뜻은 아닙니다."]}
        interpretation="d(a,p)=0.4, d(a,n)=0.9, m=0.2이면 loss는 0입니다. Negative가 0.5라면 loss는 0.1이어서 anchor-positive를 가깝게 하거나 anchor-negative를 멀게 하는 gradient가 생깁니다."
      />
      <div className="not-prose my-8"><TripletViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Mining policy도 재현 가능한 학습 입력입니다</h3>
        <p>
          Batch-hard mining은 batch 안에서 가까운 negative를 선택하므로 class 구성과 sampler에 민감합니다. Offline mining은 전체 corpus를 넓게 탐색할 수 있지만 encoder가 바뀌면 후보도 낡습니다. Miner model, index snapshot, candidate depth와 filtering rule을 dataset version과 함께 기록합니다.
        </p>
        <p>
          Margin은 보편적인 숫자가 아니라 distance scale과 normalization에 종속됩니다. Random, semi-hard, hard negative를 난이도 구간으로 나눠 loss와 downstream metric을 함께 보면 학습이 어려운 예에서 개선되는지, label noise에 끌려가는지 구분할 수 있습니다.
        </p>
      </div>
      <ExplainedFormula
        question="정규화된 embedding에서 squared Euclidean distance와 cosine similarity는 왜 같은 순서를 만들까요?"
        idea={<>두 벡터 차이의 제곱을 전개하면 각 norm 제곱과 내적이 나옵니다. 두 norm이 모두 1이면 상수 2에서 cosine similarity의 두 배를 뺀 식이 됩니다.</>}
        formula={String.raw`\begin{aligned}
d_{ij}^2&=\lVert\mathbf z_i-\mathbf z_j\rVert_2^2,\\
&=\lVert\mathbf z_i\rVert_2^2+\lVert\mathbf z_j\rVert_2^2
-2\mathbf z_i^\top\mathbf z_j,\\
&=2-2\operatorname{sim}(i,j).
\end{aligned}`}
        terms={[
          { symbol: "||z_i−z_j||²", name: "squared Euclidean distance", description: "두 정규화 embedding 사이 직선 거리의 제곱입니다." },
          { symbol: "z_i^T z_j", name: "inner product", description: "Unit vector에서는 cosine similarity와 같습니다." },
        ]}
        assumptions={["두 embedding의 L2 norm이 정확히 1입니다.", "순서 동치는 squared Euclidean과 cosine에 해당하며 다른 learned metric에는 자동 적용되지 않습니다."]}
        interpretation="Cosine similarity가 클수록 squared distance가 작아지므로 retrieval 순위는 같습니다. 다만 margin 숫자는 distance 표현에 따라 달라지므로 0.2라는 값을 cosine margin과 그대로 바꿔 쓰면 안 됩니다."
      />
      <div id="paper-facenet" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">논문 읽기 · FaceNet과 triplet mining</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Schroff 등은 얼굴 이미지를 unit hypersphere의 embedding으로 직접 매핑하고 triplet loss와 online mining을 사용했습니다. 보고된 margin·batch 구성·mining 결과는 얼굴 identity dataset과 해당 architecture의 조건이며, 임의 검색 corpus의 기본값은 아닙니다.</p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://openaccess.thecvf.com/content_cvpr_2015/html/Schroff_FaceNet_A_Unified_2015_CVPR_paper.html" target="_blank" rel="noreferrer">Triplet selection과 평가 범위 보기</a>
      </div>
    </section>
  );
}

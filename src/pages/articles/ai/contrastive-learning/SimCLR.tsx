import SimCLRViz from './viz/SimCLRViz';
import ContrastiveFormula from './ContrastiveFormula';

export default function SimCLR() {
  return (
    <section id="simclr" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">SimCLR: 자기지도 대조 학습</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>SimCLR(Simple Framework for Contrastive Learning of Visual Representations)</strong> —
          Chen et al. (2020)이 제안한 자기지도 대조 학습 프레임워크.<br />
          원 논문은 폭을 4배로 키운 ResNet-50(4×)로 representation을 학습한 뒤 ImageNet linear evaluation에서 76.5% top-1을 보고했다.
          이 수치는 해당 architecture·augmentation·training budget의 결과이며 제조 데이터 성능으로 옮겨 쓸 수 없다.
        </p>

        <h3>파이프라인: 4단계</h3>
        <p>
          <strong>1) 랜덤 Augmentation</strong> — 같은 이미지 x에서 두 가지 변환 t, t'를 뽑아 x_i, x_j 생성.<br />
          변환 종류: 랜덤 크롭 + 리사이즈, 색상 왜곡(color jitter), 가우시안 블러, 수평 뒤집기.<br />
          <strong>2) 인코더</strong> — ResNet-50으로 각 augmentation을 2048차원 특징 벡터 h로 변환.<br />
          <strong>3) Projection Head</strong> — 표준 ResNet-50 예시에서는 MLP(2048→2048→128)로 h를 z로 매핑. 학습 시에만 사용, 추론 시 제거.<br />
          <strong>4) InfoNCE Loss</strong> — z 공간에서 positive pair 유사도를 높이고 negative pair를 밀어냄.
        </p>

        <h3>InfoNCE Loss 상세</h3>
        <p>
          Temperature는 loss가 similarity 차이에 얼마나 날카롭게 반응할지 조절한다.
          작게 두면 가까운 경쟁 후보에 더 집중하지만 noisy negative에도 민감해질 수 있다.<br />
          배치 크기 N일 때 positive 1쌍, negative 2(N-1)개 — N이 클수록 다양한 negative 제공.
        </p>
      </div>
      <ContrastiveFormula
        latex={String.raw`\underbrace{\mathcal L_{i,j}}_{\text{anchor i의 positive j 손실}}=-\log\frac{\overbrace{\exp(\operatorname{sim}(z_i,z_j)/\tau)}^{\text{positive 점수}}}{\underbrace{\sum_{k\ne i}\exp(\operatorname{sim}(z_i,z_k)/\tau)}_{\text{positive와 negative 전체 경쟁}}}`}
        meaning="이 식은 anchor i가 자기 positive j를 batch의 다른 후보보다 더 높은 점수로 고르게 만든다. 왜 log-softmax를 쓰냐면 pair 비교를 하나의 분류 문제처럼 바꾸기 위해서고, 왜 temperature로 나누냐면 similarity 차이에 loss가 반응하는 날카로움을 조절하기 위해서다."
        symbols={[
          ['z_i, z_j', '같은 원본 image에서 만든 두 augmentation의 normalized projection'],
          ['sim', '두 normalized projection의 cosine similarity'],
          ['tau', 'score 분포의 날카로움을 조절하는 temperature'],
          ['k', 'anchor i와 비교하는 batch의 다른 view index'],
        ]}
      />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>큰 배치가 중요한 이유</h3>
        <p>
          N=256 → negative 510개. N=8192 → negative 16382개.<br />
          negative가 다양할수록 임베딩 공간이 고르게 분포 — <strong>uniformity</strong> 향상.<br />
          원 논문의 batch-size ablation에서는 특히 짧은 학습 budget에서 큰 batch가 유리했고, 학습 epoch을 늘리면 batch 간 격차가 줄었다.
          이 결과도 augmentation, optimizer와 evaluation protocol을 고정한 비교다.
          현장에서는 batch를 키우기 전에 false negative 비율과 memory budget을 같은 split에서 확인한다.
        </p>

        <h3>Projection Head가 필수인 이유</h3>
        <p>
          h(인코더 출력)는 augmentation에 무관한 의미 정보를 담아야 하지만,
          대조 학습 loss는 augmentation에 불변인 특징만 남기도록 압축.<br />
          Projection head z가 contrastive objective에 필요한 변형을 흡수하고, h는 downstream에서 다시 평가한다.
          Head 유무의 효과는 원 논문 ablation처럼 같은 encoder와 evaluation protocol에서 비교해야 한다.
        </p>
      </div>

      <div className="not-prose my-8">
        <SimCLRViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="text-sm leading-relaxed">
            <strong>실전 팁:</strong> GPU 메모리가 제한적이면 MoCo v1/v2의 momentum encoder와 queue를 후보로 둘 수 있다.
            MoCo v3는 queue를 제거하고 큰 in-batch 비교를 사용하므로 같은 메모리 해법으로 묶지 않는다.
            어떤 계열이든 같은 compute budget과 false-negative 조건에서 비교한다.
          </p>
        </div>
      </div>
    </section>
  );
}

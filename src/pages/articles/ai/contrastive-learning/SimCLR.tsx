import SimCLRViz from './viz/SimCLRViz';

export default function SimCLR() {
  return (
    <section id="simclr" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">SimCLR: 자기지도 대조 학습</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>SimCLR(Simple Framework for Contrastive Learning of Visual Representations)</strong> —
          Chen et al. (2020)이 제안한 자기지도 대조 학습 프레임워크.<br />
          라벨 없이 augmentation만으로 ImageNet 선형 평가에서 지도 학습의 76.5%까지 도달.
        </p>

        <h3>파이프라인: 4단계</h3>
        <p>
          <strong>1) 랜덤 Augmentation</strong> — 같은 이미지 x에서 두 가지 변환 t, t'를 뽑아 x_i, x_j 생성.<br />
          변환 종류: 랜덤 크롭 + 리사이즈, 색상 왜곡(color jitter), 가우시안 블러, 수평 뒤집기.<br />
          <strong>2) 인코더</strong> — ResNet-50으로 각 augmentation을 2048차원 특징 벡터 h로 변환.<br />
          <strong>3) Projection Head</strong> — MLP(2048→256→128)로 h를 z로 매핑. 학습 시에만 사용, 추론 시 제거.<br />
          <strong>4) InfoNCE Loss</strong> — z 공간에서 positive pair 유사도를 높이고 negative pair를 밀어냄.
        </p>

        <h3>InfoNCE Loss 상세</h3>
        <p>
          {'L(i,j) = -log( exp(sim(z_i, z_j)/τ) / Σ_{k≠i} exp(sim(z_i, z_k)/τ) )'}<br />
          sim(u,v) = u·v / (||u||·||v||) — cosine similarity.<br />
          τ (temperature) — 분포의 날카로움 제어. τ=0.1이면 유사도 차이를 10배 증폭 → hard negative에 집중.<br />
          배치 크기 N일 때 positive 1쌍, negative 2(N-1)개 — N이 클수록 다양한 negative 제공.
        </p>

        <h3>큰 배치가 중요한 이유</h3>
        <p>
          N=256 → negative 510개. N=8192 → negative 16382개.<br />
          negative가 다양할수록 임베딩 공간이 고르게 분포 — <strong>uniformity</strong> 향상.<br />
          SimCLR 논문 결과: batch 256 → 64.6% / batch 4096 → 74.2% / batch 8192 → 76.5% (ImageNet linear eval).<br />
          대신 메모리 요구량도 비례 증가 — TPU v3 32코어 또는 8×V100 필요.
        </p>

        <h3>Projection Head가 필수인 이유</h3>
        <p>
          h(인코더 출력)는 augmentation에 무관한 의미 정보를 담아야 하지만,
          대조 학습 loss는 augmentation에 불변인 특징만 남기도록 압축.<br />
          Projection head z가 이 정보 손실을 흡수 → h는 downstream에 유용한 풍부한 표현 유지.
          제거 시 정확도 5-10% 하락.
        </p>
      </div>

      <div className="not-prose my-8">
        <SimCLRViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="text-sm leading-relaxed">
            <strong>실전 팁:</strong> GPU 메모리가 제한적이면 MoCo(momentum encoder + queue)로 대체 —
            배치 크기 256으로도 65536개 negative 활용 가능. 소규모 팀에서는 MoCo v3가 현실적 선택.
          </p>
        </div>
      </div>
    </section>
  );
}

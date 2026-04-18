import OverviewViz from './viz/OverviewViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">대조 학습의 핵심 아이디어</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>대조 학습(Contrastive Learning)</strong> — "비슷한 것은 가깝게, 다른 것은 멀게" 임베딩 공간을 구성하는 학습 패러다임.<br />
          분류(Classification)가 "이것은 고양이"를 직접 맞추는 학습이라면,
          대조 학습은 "이 두 이미지는 비슷하다 / 다르다"라는 <strong>쌍(pair) 관계</strong>를 학습.
        </p>

        <h3>왜 대조 학습인가</h3>
        <p>
          라벨이 부족한 현실 — ImageNet 1.4M장에 라벨을 붙이는 데 수만 시간 소요.<br />
          대조 학습은 <strong>자기지도(Self-supervised)</strong> 방식으로 라벨 없이도 강력한 표현을 학습.
          같은 이미지를 두 번 다르게 변환(augmentation)하면 자동으로 positive pair가 생성되기 때문.
        </p>
        <p>
          유전체(gLM) 도메인에서도 동일한 원리가 적용 — 같은 유전자의 wild-type과 변이 시퀀스를
          대조 학습으로 임베딩하면, <strong>변이 민감도(variant sensitivity)</strong>를 cosine distance로 직접 측정 가능.
        </p>

        <h3>핵심 구성 요소</h3>
        <p>
          <strong>Anchor</strong> — 기준 샘플. 모든 비교의 출발점.<br />
          <strong>Positive</strong> — Anchor와 "같다"고 판단되는 샘플. 같은 클래스이거나 같은 이미지의 다른 augmentation.<br />
          <strong>Negative</strong> — Anchor와 "다르다"고 판단되는 샘플. 다른 클래스 또는 다른 이미지.
        </p>
        <p>
          학습 목표: 인코더 f(x)가 만든 임베딩 공간에서 Anchor-Positive 거리는 줄이고, Anchor-Negative 거리는 늘리기.
        </p>

        <h3>Self-supervised vs Supervised Contrastive</h3>
        <p>
          <strong>Self-supervised</strong> — 라벨 없이 augmentation으로 pair 생성. SimCLR, MoCo, BYOL 등.<br />
          <strong>Supervised</strong> — 라벨 정보를 활용해 같은 클래스를 모두 positive로. SupCon Loss.<br />
          Self-supervised가 범용 표현에 강하고, Supervised가 downstream task 정확도에 강함.
        </p>
      </div>

      <div className="not-prose my-8">
        <OverviewViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="text-sm leading-relaxed">
            <strong>핵심 인사이트:</strong> 대조 학습의 임베딩은 분류뿐 아니라 검색, 클러스터링, 이상 탐지, 변이 민감도 등
            거리 기반 태스크 전반에 활용 가능. "좋은 표현"을 학습하면 downstream task가 단순해진다.
          </p>
        </div>
      </div>
    </section>
  );
}

import OverviewViz from './viz/OverviewViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">오토인코더란</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>오토인코더(Autoencoder)</strong> — 입력 데이터를 압축(인코더)한 뒤 복원(디코더)하는 신경망.<br />
          학습 목표: 출력이 입력과 최대한 같아지도록 가중치를 조정.
        </p>

        <h3>비지도/자기지도 학습</h3>
        <p>
          라벨이 필요 없다. 입력 자체가 정답(타깃)이므로 <strong>자기지도 학습(Self-supervised Learning)</strong>에 해당.<br />
          분류기처럼 "고양이/강아지"를 알려줄 필요 없이, 데이터 자체의 구조를 학습.
        </p>

        <h3>비유: 200쪽 책을 3쪽으로 요약하기</h3>
        <p>
          200쪽 원고를 3쪽 요약으로 압축 — 핵심 정보만 남음.<br />
          그 3쪽 요약에서 다시 책을 복원하려 시도 — 완벽하진 않지만 핵심은 보존.<br />
          이 "3쪽 요약"이 바로 <strong>잠재 공간(Latent Space)</strong>.
        </p>
      </div>
      <div className="not-prose mt-8">
        <OverviewViz />
      </div>
    </section>
  );
}

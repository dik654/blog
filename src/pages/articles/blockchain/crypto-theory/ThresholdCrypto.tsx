import ThresholdViz from './viz/ThresholdViz';

export default function ThresholdCrypto() {
  return (
    <section id="threshold-crypto" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">비밀 분산 & 임계값 서명</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          Shamir(1979) — 비밀을 여러 share로 분산하여 t개 이상 모여야 복원. 단일 장애점 제거.
        </p>
      </div>
      <div className="not-prose"><ThresholdViz /></div>
    </section>
  );
}

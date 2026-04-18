import KLDivergenceViz from './viz/KLDivergenceViz';
import KLDetailViz from './viz/KLDetailViz';

export default function KLDivergence() {
  return (
    <section id="kl-divergence" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">KL Divergence</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        D_KL(P‖Q) = CE(P,Q) - H(P) — 두 분포 간의 순수한 차이.<br />
        비대칭(P‖Q ≠ Q‖P), 대칭 버전은 Jensen-Shannon Divergence.
      </p>
      <KLDivergenceViz />
      <KLDetailViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: KL Divergence 대안</p>
          <p>
            <strong>문제점</strong>:<br />
            ✗ 비대칭 (metric 아님)<br />
            ✗ Support mismatch 시 무한<br />
            ✗ 해석 직관 부족
          </p>
          <p className="mt-2">
            <strong>대안 divergences</strong>:<br />
            - <strong>Wasserstein (Earth Mover's)</strong>: "분포 이동 비용", GAN 표준<br />
            - <strong>Total Variation</strong>: 0.5·Σ|P(x) - Q(x)|, bounded [0,1]<br />
            - <strong>Hellinger</strong>: √(1-Σ√(P·Q)), metric 성질<br />
            - <strong>Maximum Mean Discrepancy (MMD)</strong>: kernel-based
          </p>
          <p className="mt-2">
            <strong>언제 무엇을</strong>:<br />
            - 확률 분포 학습 (VAE): KL (closed-form 유도)<br />
            - 생성 모델 평가: Wasserstein (stable gradient)<br />
            - 분포 매칭 (domain adaptation): MMD<br />
            - Hypothesis testing: Hellinger
          </p>
        </div>
      </div>
    </section>
  );
}

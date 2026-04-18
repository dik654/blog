import CrossEntropyViz from './viz/CrossEntropyViz';
import CEDetailViz from './viz/CEDetailViz';

export default function CrossEntropy({ title }: { title?: string }) {
  return (
    <section id="cross-entropy" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '크로스 엔트로피: 두 분포의 괴리'}</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        H(P,Q) = -Σ P(x)·log Q(x) — P의 확률로 Q의 놀라움을 계산.<br />
        P ≠ Q일수록 CE는 엔트로피보다 항상 큼 (Gibbs 부등식).
      </p>
      <CrossEntropyViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">Cross-Entropy 심층 분석</h3>
        <CEDetailViz />

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: CE와 MLE의 관계</p>
          <p>
            <strong>Maximum Likelihood Estimation</strong>:<br />
            - θ* = argmax Π P(x_i | θ)<br />
            - Log likelihood: ℓ(θ) = Σ log P(x_i | θ)<br />
            - Maximize ℓ = minimize -ℓ = minimize CE
          </p>
          <p className="mt-2">
            <strong>동치 관계</strong>:<br />
            - Cross-entropy 최소화 ≡ MLE<br />
            - 훈련 데이터 empirical distribution = P<br />
            - 모델이 θ로 parameterize한 Q<br />
            - Minimize H(P, Q_θ) = MLE
          </p>
          <p className="mt-2">
            <strong>실무 의미</strong>:<br />
            - CE는 단순한 "거리" 이상<br />
            - 통계적으로 최적 (asymptotically consistent estimator)<br />
            - Bayesian 해석 가능 (MAP with uniform prior)<br />
            - Model fitting의 표준 objective
          </p>
        </div>

      </div>
    </section>
  );
}

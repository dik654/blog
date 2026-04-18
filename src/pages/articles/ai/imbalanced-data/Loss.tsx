import FocalLossViz from './viz/FocalLossViz';

export default function Loss() {
  return (
    <section id="loss" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">손실 함수: Focal Loss, Class Weight</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          리샘플링이 <strong>데이터</strong>를 조정한다면, 손실 함수는 <strong>학습 신호</strong>를 조정한다<br />
          소수 클래스의 오분류에 더 큰 벌점을 부여하여 모델이 소수 클래스에 집중하게 만든다<br />
          데이터를 건드리지 않으므로 리샘플링의 과적합/정보손실 문제를 피할 수 있다
        </p>
        <p>
          <strong>Class Weight</strong>(클래스 가중치) — 가장 단순한 접근<br />
          w_i = N / (K * n_i): 전체 샘플 수 N, 클래스 수 K, 클래스 i의 샘플 수 n_i<br />
          소수 클래스(n_i 작음) → w_i 큼 → loss 기여가 증가<br />
          sklearn의 class_weight="balanced"로 자동 적용 가능
        </p>
        <p>
          <strong>Cross-Entropy의 한계</strong> — easy sample이 loss를 지배<br />
          CE = -log(p_t)에서 p_t는 정답 클래스의 예측 확률<br />
          다수 클래스(easy): p_t ≈ 0.95 → loss ≈ 0.05 (작지만 개수가 많음)<br />
          소수 클래스(hard): p_t ≈ 0.2 → loss ≈ 1.6 (크지만 개수가 적음)<br />
          결과적으로 easy sample의 누적 loss가 전체 gradient를 지배 → 소수 클래스 학습 방해
        </p>
        <p>
          <strong>Focal Loss</strong>(Lin et al., 2017, RetinaNet) — easy sample 가중치 감소<br />
          FL = -(1 - p_t)^gamma * log(p_t)<br />
          (1 - p_t)^gamma가 핵심: p_t가 높은(쉬운) 샘플일수록 loss를 기하급수적으로 줄임<br />
          gamma=0이면 표준 CE, gamma=2(기본값)이면 easy sample의 loss가 수백 배 감소<br />
          모델이 "이미 잘 맞추는 샘플"은 무시하고 "어려운 샘플"에 집중하게 된다
        </p>
      </div>
      <FocalLossViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Focal Loss 변형과 실전 조합</h3>
        <p>
          <strong>alpha-balanced Focal Loss</strong>: alpha_t * (1-p_t)^gamma * log(p_t)<br />
          alpha(클래스 가중치) + gamma(난이도 조절)를 동시 적용 — 가장 강력한 단일 손실 함수<br />
          RetinaNet 논문의 기본 설정: alpha=0.25, gamma=2
        </p>
        <p>
          <strong>Asymmetric Loss</strong>(Ben-Baruch et al., 2020) — FP와 FN에 다른 gamma<br />
          양성 손실에 gamma_plus=0(감소 없음), 음성 손실에 gamma_minus=4(강한 감소)<br />
          Multi-label 분류에서 특히 효과적: 대부분의 레이블이 0인 극심한 불균형 처리
        </p>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
        <p className="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-1">실전 팁</p>
        <p className="text-sm text-amber-700 dark:text-amber-300">
          Focal Loss와 SMOTE를 동시에 적용하면 효과가 중첩된다.
          하지만 <strong>과도한 보정은 역효과</strong> — 소수 클래스를 너무 강조하면
          다수 클래스의 정밀도가 떨어지는 "역불균형" 발생.
          gamma와 alpha는 반드시 검증 세트에서 튜닝해야 하며,
          gamma=2, alpha=0.25에서 시작하여 점진적으로 조정하는 것이 실전의 정석.
        </p>
      </div>
    </section>
  );
}

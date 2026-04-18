import EarlyStoppingViz from './viz/EarlyStoppingViz';

export default function EarlyStopping() {
  return (
    <section id="early-stopping" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Early Stopping 전략</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>Early Stopping</strong> — 검증 성능이 더 이상 개선되지 않으면 학습을 조기 종료하는 기법<br />
          가장 단순하면서도 효과적인 정규화 — 추가 계산 비용이 거의 없고 구현이 쉬움<br />
          Goodfellow et al.(2016): "Early Stopping은 L2 정규화와 유사한 효과를 가진다"
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">모니터링 지표</h3>
        <p>
          <strong>val_loss</strong> 기준이 가장 보편적 — 손실이 낮으면 일반화 성능이 높다고 판단<br />
          <strong>val_metric</strong> 기준도 가능 — F1, AUC 등 실제 목적 지표로 판단. 다만 지표에 따라 노이즈가 클 수 있음<br />
          분류 문제에서 val_accuracy가 정체되는데 val_loss는 계속 올라가면 → 이미 오버피팅 중
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">Patience (인내)</h3>
        <p>
          patience = N → val_loss가 N 에폭 연속 개선되지 않으면 종료<br />
          patience=1이면 너무 민감 — 한 에폭의 우연한 상승에 바로 종료<br />
          patience가 너무 크면 오버피팅을 방치하고 GPU 시간을 낭비<br />
          핵심: "충분히 기다리되, 너무 오래 기다리지 않기"
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">min_delta: 개선의 최소 기준</h3>
        <p>
          val_loss가 0.0001만큼 줄어도 "개선"으로 볼 것인가? → min_delta 파라미터로 제어<br />
          min_delta = 0 → 아주 미미한 개선도 인정. min_delta = 0.001 → 의미 있는 개선만 인정<br />
          학습 후반에 손실이 거의 변하지 않을 때 유용
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">Restore Best Weights</h3>
        <p>
          학습 종료 시점의 모델이 최적이 아닐 수 있음 — patience 동안 성능이 악화되었을 수 있으므로<br />
          <strong>restore_best_weights=True</strong> → 학습 종료 후 val_loss가 최소였던 시점의 가중치로 자동 복원<br />
          PyTorch에서는 직접 구현 필요: best_state = model.state_dict().copy()를 저장했다가 복원<br />
          Keras에서는 EarlyStopping 콜백에 restore_best_weights 옵션이 내장
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">LR Scheduler와의 관계</h3>
        <p>
          ReduceLROnPlateau + Early Stopping → 시너지: LR 감소로 잠시 개선 → 다시 정체 → 종료<br />
          주의: LR을 줄이면 손실이 일시적으로 개선되므로 patience를 넉넉히 잡아야 함<br />
          Cosine Annealing 사용 시 → warm restart마다 loss가 요동 → patience를 restart 주기보다 크게 설정
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">실전 권장 설정</h3>
        <p>
          작은 데이터셋(수천~수만): patience 5~10, min_delta 1e-4<br />
          큰 데이터셋(수십만+): patience 10~20, min_delta 1e-3<br />
          LR Scheduler 병행 시: patience 15~30 (LR 감소 후 개선 가능성을 기다림)<br />
          항상 restore_best_weights 사용 — 사용하지 않을 이유가 없음
        </p>
      </div>
      <div className="not-prose my-8">
        <EarlyStoppingViz />
      </div>
    </section>
  );
}

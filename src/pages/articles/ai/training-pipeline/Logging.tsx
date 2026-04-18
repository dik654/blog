import LoggingViz from './viz/LoggingViz';

export default function Logging() {
  return (
    <section id="logging" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">로깅 & 모니터링</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          학습 과정에서 기록하는 것 — <strong>loss</strong>(손실)와 <strong>metric</strong>(평가 지표)<br />
          매 배치: running_loss에 누적 → epoch 끝에 len(loader)로 나눠 평균 계산<br />
          검증: val_loss + task별 metric (accuracy, F1, AUC, RMSE 등)<br />
          이 값들을 리스트에 저장하면 <strong>학습곡선</strong>(learning curve)을 그릴 수 있다
        </p>
        <p>
          학습곡선은 <strong>모델의 건강 지표</strong><br />
          train_loss와 val_loss가 함께 내려가면 정상 학습<br />
          train_loss만 내려가고 val_loss가 올라가면 — <strong>오버피팅</strong><br />
          두 loss가 모두 높으면 — <strong>언더피팅</strong> (모델 용량 부족 또는 학습률 문제)
        </p>
      </div>
      <div className="not-prose my-8">
        <LoggingViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">Early Stopping</h3>
        <p>
          오버피팅을 자동으로 감지하고 학습을 중단하는 기법<br />
          <strong>patience=N</strong>: val_loss가 N epoch 연속 개선되지 않으면 학습 중단<br />
          best_loss 갱신 시 patience 카운터를 0으로 리셋<br />
          patience=5~10이 일반적 — 너무 작으면 조기 중단으로 최적점 이전에 멈춤
        </p>
        <p>
          Early stopping + best model 저장 조합이 실전 표준:<br />
          patience 초과로 학습 중단 → 저장해둔 best_model.pt를 최종 모델로 사용<br />
          이 패턴 하나로 오버피팅 방어 + 최적 모델 확보를 동시에 달성
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">W&B / TensorBoard</h3>
        <p>
          <strong>Weights & Biases (W&B)</strong> — 클라우드 기반 실험 관리 플랫폼<br />
          wandb.log() 한 줄로 loss, learning rate, metric을 실시간 대시보드에 기록<br />
          실험 비교, 하이퍼파라미터 sweep, 팀 공유 기능이 강점<br />
          Kaggle 대회에서 팀 단위 실험 관리에 사실상 표준
        </p>
        <p>
          <strong>TensorBoard</strong> — PyTorch에 내장된 로컬 시각화 도구<br />
          SummaryWriter로 add_scalar, add_histogram, add_graph 등 기록<br />
          별도 서버 없이 로컬에서 바로 확인 가능 — 개인 실험에 간편<br />
          스칼라 차트, 가중치 히스토그램, 계산 그래프 시각화 지원
        </p>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
        <p className="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-1">로깅 실전 전략</p>
        <p className="text-sm text-amber-700 dark:text-amber-300">
          모든 실험에 고유 이름(run_name)을 붙이고 하이퍼파라미터를 함께 기록.
          "lr=1e-3_bs=32_aug=v2" 식으로 설정을 이름에 포함하면 나중에 어떤 설정이 좋았는지 한눈에 비교 가능.
          최소 loss, lr, epoch은 반드시 기록 — 나머지는 필요에 따라 추가.
        </p>
      </div>
    </section>
  );
}

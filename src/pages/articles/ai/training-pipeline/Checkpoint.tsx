import CheckpointViz from './viz/CheckpointViz';

export default function Checkpoint() {
  return (
    <section id="checkpoint" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">체크포인트 & 재현성</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          학습 도중 모델 상태를 저장하는 것 — <strong>체크포인트</strong><br />
          <strong>torch.save(model.state_dict(), path)</strong>로 가중치 딕셔너리만 저장하는 것이 표준<br />
          pickle로 모델 전체를 저장하면 클래스 정의 의존성, 보안 취약점, 호환성 문제가 발생
        </p>
        <p>
          체크포인트에는 가중치만 넣는 것이 아니라 <strong>학습 재개에 필요한 모든 상태</strong>를 포함:<br />
          epoch 번호, model.state_dict(), optimizer.state_dict(), scheduler.state_dict(), best_loss<br />
          이 5가지를 딕셔너리로 묶어서 한 파일에 저장
        </p>
      </div>
      <div className="not-prose my-8">
        <CheckpointViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">Best Model vs Last Model</h3>
        <p>
          <strong>best_model.pt</strong> — validation loss(또는 metric)가 최저/최고일 때만 갱신<br />
          학습이 끝나면 이 파일로 최종 추론을 수행. 오버피팅 이전의 최적 상태를 보존
        </p>
        <p>
          <strong>last_model.pt</strong> — 매 epoch 끝에 덮어쓰기<br />
          학습이 중단되었을 때(서버 크래시, 타임아웃) 이 파일에서 이어서 학습<br />
          두 파일을 분리 저장하는 것이 실전 표준 — best는 추론용, last는 resume용
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">시드 고정: 재현성의 기본</h3>
        <p>
          Python에는 4가지 독립적인 난수 소스가 있다:<br />
          <strong>random</strong>(Python 내장) + <strong>numpy</strong>(NumPy) + <strong>torch</strong>(PyTorch CPU) + <strong>CUDA</strong>(PyTorch GPU)<br />
          4곳 모두 같은 시드로 고정해야 동일 입력에 동일 결과가 나온다
        </p>
        <p>
          <strong>cudnn.deterministic=True</strong> — cuDNN이 같은 알고리즘을 매번 선택<br />
          <strong>cudnn.benchmark=False</strong> — 입력 크기별 최적 알고리즘 탐색을 비활성<br />
          <strong>use_deterministic_algorithms(True)</strong> — 비결정적 연산 사용 시 에러 발생<br />
          이 설정들은 속도를 5~10% 느리게 만든다 — 대회에서는 끄고, 논문/디버깅에서만 키는 전략
        </p>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
        <p className="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-1">DataLoader 워커 시드</p>
        <p className="text-sm text-amber-700 dark:text-amber-300">
          num_workers &gt; 0일 때 각 워커 프로세스는 독립적인 난수 상태를 가진다.
          worker_init_fn에서 base_seed + worker_id로 각 워커 시드를 개별 고정해야 완전한 재현성이 보장된다.
        </p>
      </div>
    </section>
  );
}

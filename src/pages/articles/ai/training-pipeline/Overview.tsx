import OverviewViz from './viz/OverviewViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">학습 루프의 구조</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          PyTorch 학습 파이프라인 — 6개 모듈이 하나의 루프를 이룬다<br />
          <strong>Dataset</strong>이 원본 데이터를 제공하고, <strong>DataLoader</strong>가 미니배치로 묶는다<br />
          <strong>Model</strong>이 forward pass를 실행해 예측값(logits)을 생성하고, <strong>Loss</strong> 함수가 예측과 정답의 차이를 스칼라로 계산<br />
          <strong>Optimizer</strong>가 역전파된 기울기로 가중치를 갱신하고, <strong>Scheduler</strong>는 설정한 호출 주기(batch 또는 epoch)에 맞춰 learning rate를 조절
        </p>
        <p>
          먼저 작은 subset으로 load → forward → backward → checkpoint → evaluation을 끝까지 실행한다.<br />
          이 재현 가능한 baseline을 닫은 뒤 data, feature, model과 hyperparameter를 한 변수씩 바꿔야 무엇이 성능을 바꿨는지 알 수 있다.
        </p>
      </div>
      <div className="not-prose my-8">
        <OverviewViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">핵심 실행 순서</h3>
        <p>
          매 배치마다 3단계가 반복된다:<br />
          <strong>1) Forward</strong> — model(input)으로 예측을 만들고 backward에 필요한 activation을 저장<br />
          <strong>2) Backward</strong> — loss.backward()로 모든 파라미터의 gradient 계산. 자동 미분(autograd)이 계산 그래프를 역순 탐색<br />
          <strong>3) Update</strong> — optimizer.step()으로 가중치 갱신 → optimizer.zero_grad()로 gradient 초기화
        </p>
        <p>
          1 epoch은 training data를 한 번 순회하는 단위다.<br />
          필요한 epoch 수는 data 크기, optimizer와 model에 따라 달라지므로 validation protocol과 compute budget으로 중단 시점을 정한다.
        </p>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
        <p className="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-1">실전 팁</p>
        <p className="text-sm text-amber-700 dark:text-amber-300">
          Template에는 code만이 아니라 split, seed, metric aggregation, AMP 설정, checkpoint schema와 run metadata까지 포함한다.
          새 task에서는 작은 subset으로 먼저 전체 경로를 검증한 뒤 scale을 키운다.
        </p>
      </div>
    </section>
  );
}

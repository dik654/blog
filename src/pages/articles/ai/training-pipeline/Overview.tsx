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
          <strong>Optimizer</strong>가 역전파된 기울기로 가중치를 갱신하고, <strong>Scheduler</strong>가 학습률을 epoch마다 조절
        </p>
        <p>
          이 구조를 한 번 외워두면 어떤 태스크든 15분 안에 뼈대 완성 가능<br />
          대회에서 첫 제출까지 30분 — 나머지 시간은 데이터 분석과 피처 엔지니어링에 집중<br />
          파이프라인 자체보다 <strong>데이터를 어떻게 넣느냐</strong>가 순위를 결정
        </p>
      </div>
      <div className="not-prose my-8">
        <OverviewViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">핵심 실행 순서</h3>
        <p>
          매 배치마다 3단계가 반복된다:<br />
          <strong>1) Forward</strong> — model(input)으로 예측 생성. GPU 메모리를 가장 많이 사용하는 단계 (activation 저장)<br />
          <strong>2) Backward</strong> — loss.backward()로 모든 파라미터의 gradient 계산. 자동 미분(autograd)이 계산 그래프를 역순 탐색<br />
          <strong>3) Update</strong> — optimizer.step()으로 가중치 갱신 → optimizer.zero_grad()로 gradient 초기화
        </p>
        <p>
          1 epoch = 전체 데이터를 한 번 순회하며 이 3단계를 반복하는 것<br />
          보통 10~100 epoch 학습 — validation loss를 보면서 최적 epoch을 결정
        </p>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
        <p className="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-1">실전 팁</p>
        <p className="text-sm text-amber-700 dark:text-amber-300">
          파이프라인 코드를 템플릿으로 만들어두면 대회 시작 직후 복붙으로 첫 제출 완료.
          Kaggle Grand Master들은 자신만의 training template을 가지고 있다.
          빠른 제출 → 빠른 피드백 루프 → 높은 순위.
        </p>
      </div>
    </section>
  );
}

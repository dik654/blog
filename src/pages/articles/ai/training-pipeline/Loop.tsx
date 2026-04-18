import LoopViz from './viz/LoopViz';

export default function Loop() {
  return (
    <section id="loop" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">학습/검증 루프 구현</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          학습 루프와 검증 루프 — 구조는 비슷하지만 <strong>결정적 차이</strong>가 있다<br />
          <strong>model.train()</strong>: Dropout 활성, BatchNorm이 배치 통계를 사용 (학습 모드)<br />
          <strong>model.eval()</strong>: Dropout 비활성, BatchNorm이 이동평균을 사용 (추론 모드)<br />
          이 한 줄을 빠뜨리면 검증 점수가 들쭉날쭉해진다
        </p>
        <p>
          검증 루프에서는 <strong>torch.no_grad()</strong>를 반드시 감싼다<br />
          gradient 계산을 생략해서 메모리 절약 + 속도 향상<br />
          그리고 <strong>optimizer.step()을 절대 호출하지 않는다</strong> — 검증에서 가중치를 바꾸면 데이터 누수
        </p>
      </div>
      <div className="not-prose my-8">
        <LoopViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">Gradient Accumulation</h3>
        <p>
          GPU 메모리가 부족해서 batch_size=128을 못 쓸 때 — batch_size=32 x 4스텝 누적으로 동일 효과<br />
          <strong>핵심 원리</strong>: loss.backward()는 gradient를 <strong>누적(+=)</strong>한다 (zero_grad 전까지)<br />
          N스텝마다 한 번 optimizer.step() + zero_grad() 호출<br />
          주의: loss를 accumulation_steps로 나눠서 스케일링해야 gradient 크기가 맞는다
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Mixed Precision (AMP)</h3>
        <p>
          <strong>torch.cuda.amp.autocast</strong> — forward pass를 FP16(반정밀도)으로 실행<br />
          FP16: 메모리 절반, Tensor Core 활용으로 연산 2배 속도<br />
          단점: FP16의 작은 범위(6e-8 ~ 65504)로 gradient underflow 발생 가능
        </p>
        <p>
          <strong>GradScaler</strong>가 이 문제를 해결 — loss에 큰 scale(예: 1024)을 곱한 뒤 backward<br />
          gradient가 FP16 범위 안에 들어오도록 키운 뒤, unscale로 원래 크기로 복원<br />
          결과: GPU 메모리 40~50% 절약, 속도 1.5~2배 — 성능 손실 거의 없음
        </p>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
        <p className="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-1">tqdm 진행률 표시</p>
        <p className="text-sm text-amber-700 dark:text-amber-300">
          tqdm(train_loader)로 감싸면 배치별 진행률 바를 표시.
          set_postfix(loss=running_loss)로 현재 loss를 실시간 출력.
          장시간 학습에서 진행 상황 파악과 이상 감지에 필수.
        </p>
      </div>
    </section>
  );
}

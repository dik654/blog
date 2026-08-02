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
          <strong>torch.amp.autocast(&quot;cuda&quot;)</strong>는 모든 연산을 FP16으로 강제하지 않는다.<br />
          Tensor Core에 유리한 연산은 낮은 정밀도로, 수치 범위가 중요한 연산은 FP32로 실행한다.
          즉 autocast가 op별로 dtype을 선택한다.<br />
          그래서 memory와 처리량 이득은 model, tensor shape, GPU와 병목 위치에 따라 달라지며 직접 benchmark해야 한다.
        </p>
        <p>
          <strong>torch.amp.GradScaler(&quot;cuda&quot;)</strong>는 loss에 동적인 scale을 곱해 작은 gradient가 FP16에서 0으로 사라지는 위험을 줄인다.<br />
          Optimizer step 전에 같은 scale로 gradient를 되돌리고, overflow가 보이면 step을 건너뛰며 scale을 낮춘다.<br />
          현재 기본 initial scale은 65,536이지만 고정 상수가 아니다. 관찰된 overflow에 따라 매 step 조정되는 상태다.
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

import OneCycleViz from './viz/OneCycleViz';

export default function OneCycle() {
  return (
    <section id="onecycle" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">OneCycleLR: Super-Convergence</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          대부분의 스케줄러가 LR을 "내리기만" 하는 반면,
          <strong>1Cycle Policy</strong>(Leslie Smith, 2018)는 LR을 먼저 <strong>올렸다가</strong> 내린다.
          이 삼각형 패턴이 정규화(regularization) 효과를 내면서 5배 빠른 수렴을 가능하게 한다
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">1Cycle의 세 구간</h3>
        <p>
          <strong>Warmup (30%)</strong>: initial_lr에서 max_lr까지 선형 증가.
          <strong>Annealing (60%)</strong>: max_lr에서 initial_lr까지 cosine/linear 감소.
          <strong>Annihilation (10%)</strong>: initial_lr에서 거의 0까지 급감 — 최종 미세 조정
        </p>
        <p>
          큰 LR 구간이 <strong>regularizer 역할</strong>을 하여 넓은 미니마(flat minimum)로 수렴.
          flat minimum = test loss와 train loss의 차이가 작음 = <strong>일반화 성능 향상</strong>
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Super-Convergence</h3>
        <p>
          Smith & Topin(2019) — CIFAR-10에서 고정 LR 대비 <strong>5배 적은 iteration</strong>으로 같은 정확도.
          비결: 일반 훈련의 3~10배 큰 max_lr 사용.
          조건: Batch Normalization 사용, 충분한 모델 용량, 적절한 max_lr
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">LR Range Test로 max_lr 찾기</h3>
        <p>
          Smith(2015) — LR을 매우 작은 값(1e-7)에서 큰 값(10)까지 지수적으로 증가시키며 loss 기록.
          loss가 급감하는 구간의 LR = 좋은 max_lr 후보.
          loss가 다시 증가하기 직전 = max_lr 상한.
          PyTorch Lightning의 <code>Tuner(trainer).lr_find(model)</code>로 자동화 가능
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">실전 설정</p>
          <p>
            max_lr: LR Range Test 결과 (보통 base_lr의 10배)<br />
            div_factor=25, final_div_factor=1e4<br />
            pct_start=0.3, anneal_strategy=&quot;cos&quot;<br />
            ResNet-50/CIFAR-10: max_lr=0.1, 40 epoch → 94.5%
          </p>
        </div>
      </div>
      <div className="not-prose my-8">
        <OneCycleViz />
      </div>
    </section>
  );
}

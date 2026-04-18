import LRStrategyViz from './viz/LRStrategyViz';

export default function LRStrategy() {
  return (
    <section id="lr-strategy" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Discriminative LR & Warmup</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          전이학습에서 모든 레이어에 같은 학습률(Learning Rate)을 적용하면 비효율적<br />
          하위 레이어는 범용 피처를 이미 학습한 상태 — 크게 바꿀 필요 없음(작은 LR)<br />
          상위 레이어는 태스크 특화 피처를 새로 학습해야 함 — 빠르게 적응 필요(큰 LR)
        </p>
        <p>
          <strong>Discriminative Learning Rates</strong>(차등 학습률) — 레이어 그룹별로 다른 LR 적용<br />
          일반적인 비율: 하위(1e-5) → 중간(1e-4) → 상위(1e-3), 약 10~100배 차이<br />
          PyTorch에서는 <code>param_groups</code>로 구현 — 각 레이어 그룹에 별도 LR 지정
        </p>
      </div>
      <div className="not-prose my-8">
        <LRStrategyViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Warmup: 학습 초기 안정화</h3>
        <p>
          Fine-tuning 시작 시 큰 LR을 즉시 적용하면 — pretrained 가중치가 큰 gradient에 의해 급격히 변경<br />
          특히 분류 헤드가 랜덤 초기화 상태이므로 초기 gradient 신호가 노이즈에 가까움<br />
          이 노이즈 gradient가 backbone으로 역전파되면 학습된 피처가 파괴됨
        </p>
        <p>
          <strong>Warmup</strong> — 처음 5~10% epoch 동안 LR을 0에서 target까지 서서히 증가<br />
          Linear warmup: LR이 선형으로 증가 (가장 단순, 가장 많이 사용)<br />
          분류 헤드가 먼저 의미 있는 gradient를 생성하도록 기다린 후 backbone 학습 시작
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Cosine Annealing + Warmup 조합</h3>
        <p>
          <strong>Cosine Annealing</strong> — LR을 코사인 곡선에 따라 감소시키는 스케줄<br />
          수식: <code>{'eta(t) = eta_min + 0.5 * (eta_max - eta_min) * (1 + cos(pi * t / T))'}</code><br />
          초반에 빠르게 학습하고, 후반에 미세 조정하는 자연스러운 감쇠 곡선
        </p>
        <p>
          <strong>Warm Restart</strong>(SGDR, Loshchilov 2017) — 주기적으로 LR을 복원하여 local minima 탈출<br />
          매 주기(T) 후 LR을 다시 올려 새로운 탐색 시작 → 더 좋은 minima 발견 확률 증가
        </p>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
        <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">실전 표준 조합</p>
        <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
          BERT fine-tuning: warmup 10% + linear decay, peak LR = 2e-5<br />
          GPT fine-tuning: warmup 5% + cosine decay, peak LR = 5e-5<br />
          ViT fine-tuning: warmup 5% + cosine decay, peak LR = 1e-4<br />
          공통 패턴: <strong>Warmup → Peak → Cosine Decay</strong>가 사실상 업계 표준
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          핵심: <strong>레이어별 차등 LR</strong>로 범용 피처 보존 + 태스크 피처 빠른 적응 달성<br />
          <strong>Warmup</strong>으로 초기 불안정 방지 + <strong>Cosine Decay</strong>로 후반 미세 조정 — 삼박자 조합이 최적
        </p>
      </div>
    </section>
  );
}

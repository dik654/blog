import CosineViz from './viz/CosineViz';

export default function Cosine() {
  return (
    <section id="cosine" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Cosine Annealing & Warm Restart</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          StepLR의 급격한 계단 대신 <strong>코사인 곡선</strong>으로 LR을 부드럽게 감소.
          η_t = η_min + 0.5(η_max − η_min)(1 + cos(πt/T)) — 후반에 작은 LR로 세밀한 탐색
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Cosine Annealing의 동작</h3>
        <p>
          코사인 함수의 특성상 초반에는 천천히 감소 → 중반에 빠르게 → 후반에 다시 천천히.
          후반의 완만한 감소가 최솟값 근처에서 <strong>fine-grained search</strong>를 가능하게 함.
          하이퍼파라미터가 T_max와 η_min 둘뿐이라 튜닝이 간단
        </p>
        <p>
          ImageNet 실험에서 StepLR 대비 top-1 accuracy 0.5~1% 향상이 일관되게 보고됨.
          2020년 이후 CV와 NLP 모두에서 Cosine 계열이 기본 스케줄러로 자리잡은 이유
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Warm Restart (SGDR)</h3>
        <p>
          Loshchilov & Hutter(2017) — <strong>주기적으로 LR을 η_max로 리셋</strong>한 뒤 다시 코사인 감소.
          local minimum에 갇혔을 때 큰 LR로 탈출할 수 있다는 것이 핵심 아이디어
        </p>
        <p>
          T_mult=2로 주기를 점진적으로 늘림: 10→20→40 에포크.
          초반 짧은 주기로 다양한 영역을 탐색하고, 후반 긴 주기로 안정적으로 수렴.
          Snapshot Ensemble과 결합하면 하나의 훈련에서 여러 모델을 확보할 수도 있다
        </p>

        <div className="bg-blue-50 dark:bg-blue-950/30 border-l-4 border-blue-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">Cosine vs Step: 왜 Cosine이 우세한가</p>
          <p>
            StepLR의 급격한 계단에서 gradient 방향이 갑자기 변함 → 학습 불안정.<br />
            Cosine의 부드러운 전이가 gradient 충격을 최소화 → 더 안정적인 수렴.<br />
            추가 이점: 튜닝할 하이퍼파라미터가 적어 실험 비용 절감
          </p>
        </div>
      </div>
      <div className="not-prose my-8">
        <CosineViz />
      </div>
    </section>
  );
}

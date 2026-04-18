import WarmupViz from './viz/WarmupViz';

export default function Warmup() {
  return (
    <section id="warmup" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Warmup 전략 & 조합</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          초기 가중치는 랜덤 — gradient가 불안정하고 크기가 불규칙.
          이 상태에서 큰 LR을 바로 적용하면 파라미터가 "잘못된 방향"으로 크게 이동할 수 있다.
          <strong>Warmup</strong>: η를 0에서 η_target까지 N step 동안 점진적으로 올려 안전하게 시작
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Linear Warmup</h3>
        <p>
          η_t = η_target × (t / warmup_steps) — 가장 단순하고 널리 쓰이는 방식.
          warmup_steps 동안 LR이 0에서 η_target까지 선형 증가.
          이 구간에서 gradient 통계(Adam의 1st/2nd moment)가 안정화된 후 본격 학습 시작
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Transformer에서 Warmup이 필수인 이유</h3>
        <p>
          <strong>Adam의 2nd moment 문제</strong>: 분산 추정 v_t가 초기에 0에 가까워 실질 LR이 폭발.
          <strong>Batch Norm 없음</strong>: Transformer는 Layer Norm만 사용 — gradient 폭 제어가 부족.
          <strong>Attention score uniform</strong>: 초기 softmax 출력이 균일해 gradient가 noisy
        </p>
        <p>
          Original Transformer(2017): warmup_steps=4000.
          BERT: 10000 step. GPT-3: 375 step (배치 크기가 크므로 적은 step으로 충분).
          모델이 클수록, 배치가 작을수록 warmup이 더 길어야 안정적
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Warmup + Cosine Decay</h3>
        <p>
          2024 기준 사실상의 표준 조합.
          Phase 1 (5~10%): Linear Warmup — 0 → η_max.
          Phase 2 (90~95%): Cosine Decay — η_max → η_min.
          LLaMA-2는 warmup=2000 step + cosine으로 η_min=0.1×η_max까지 감소.
          ViT는 warmup=10000 step + cosine으로 η_min=0까지 감소
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">기타 변형</h3>
        <p>
          <strong>Inverse Sqrt Decay</strong>: Transformer 원 논문의 스케줄 — η_t = d_model^(-0.5) × min(t^(-0.5), t × warmup^(-1.5)).
          <strong>Polynomial Decay</strong>: η_t = (η_max−η_min)×(1−t/T)^p + η_min — p=1이면 linear, p=2이면 quadratic.
          <strong>WSD(Warmup-Stable-Decay)</strong>: warmup 후 일정 구간 η_max 유지 → 마지막에 급감.
          최근 연구에서 WSD가 Cosine Decay 대비 같은 성능을 더 적은 step에서 달성한다는 보고
        </p>

        <div className="bg-green-50 dark:bg-green-950/30 border-l-4 border-green-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">도메인별 선택 가이드</p>
          <p>
            <strong>CV (이미지)</strong>: Cosine Annealing 또는 OneCycle<br />
            <strong>NLP / LLM</strong>: Warmup + Cosine Decay (표준)<br />
            <strong>짧은 학습 (&lt;50 epoch)</strong>: OneCycle (Super-Convergence)<br />
            <strong>연구 / 탐색</strong>: WSD 또는 Warm Restart
          </p>
        </div>
      </div>
      <div className="not-prose my-8">
        <WarmupViz />
      </div>
    </section>
  );
}

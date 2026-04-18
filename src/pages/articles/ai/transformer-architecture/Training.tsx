import TrainingViz from './viz/TrainingViz';
import TrainingDetailViz from './viz/TrainingDetailViz';
import M from '@/components/ui/math';

export default function Training() {
  return (
    <section id="training" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">학습 기법</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Transformer의 안정적 학습에 필수적인 3가지 기법:<br />
          <strong>Warmup LR 스케줄링</strong> + <strong>AdamW 옵티마이저</strong> + <strong>Mixed Precision Training</strong>(FP16/BF16 혼합 정밀도 학습)<br />
          이 기법들의 결합으로 수백억 파라미터의 대규모 모델도 안정적으로 학습 가능
        </p>
      </div>

      <TrainingViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>학습 파이프라인</h3>

        <M display>
          {`\\underbrace{\\text{lr} = d_{\\text{model}}^{-0.5} \\cdot \\min\\!\\bigl(\\text{step}^{-0.5},\\; \\text{step} \\cdot \\text{warmup}^{-1.5}\\bigr)}_{\\text{원본 논문 LR 공식 — warmup 구간에서 선형 증가, 이후 } \\sqrt{\\text{step}} \\text{ 비례 감소}}`}
        </M>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 not-prose mt-4">
          <div className="rounded-xl border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/40 p-4">
            <h4 className="font-semibold text-sky-700 dark:text-sky-300 mb-2">LR Warmup + Decay</h4>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              학습 초기 <M>{'\\text{warmup}'}</M> 스텝 동안 LR을 0에서 peak까지 선형 증가 — 초기 그래디언트 불안정 방지. 이후 cosine 또는 <M>{'\\text{step}^{-0.5}'}</M> 감쇠
            </p>
          </div>
          <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 p-4">
            <h4 className="font-semibold text-emerald-700 dark:text-emerald-300 mb-2">AdamW 옵티마이저</h4>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              <M>{'\\beta_1{=}0.9,\\;\\beta_2{=}0.95'}</M>, weight decay 0.1. Adam과 달리 가중치 감쇠를 그래디언트 업데이트에서 분리 — L2 정규화 편향 해결
            </p>
          </div>
          <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 p-4">
            <h4 className="font-semibold text-amber-700 dark:text-amber-300 mb-2">Mixed Precision (BF16)</h4>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              Forward는 FP16/BF16, 그래디언트 축적은 FP32. <M>{'\\text{GradScaler}'}</M>가 언더플로 감지 후 스케일 자동 조정 — 메모리 절반, 속도 2배
            </p>
          </div>
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Warmup + Cosine Decay</h3>
        <M display>
          {`\\text{lr} = \\begin{cases} \\text{peak} \\times \\dfrac{\\text{step}}{\\text{warmup}} & \\text{warmup 구간} \\\\[6pt] \\underbrace{\\text{min} + \\tfrac{1}{2}(\\text{peak}-\\text{min})\\,(1+\\cos\\pi p)}_{\\text{cosine decay, } p = \\frac{\\text{step}-\\text{warmup}}{\\text{total}-\\text{warmup}}} & \\text{decay 구간} \\end{cases}`}
        </M>
      </div>
      <TrainingDetailViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none mt-4">
        <p className="leading-7">
          요약 1: <strong>Warmup + Cosine decay</strong>가 학습 안정성의 핵심.<br />
          요약 2: <strong>AdamW</strong>가 Adam의 weight decay 편향 해결.<br />
          요약 3: <strong>Mixed Precision (BF16)</strong>로 메모리·속도 2배 개선.
        </p>
      </div>
    </section>
  );
}
